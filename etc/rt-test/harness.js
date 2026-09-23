/**
 * Multi-client realtime sync test harness.
 *
 * Boots N full draw.io clients as same-origin iframes (?dev=1 sources),
 * replaces each client's realtime transport with a parent-side message
 * broker with controllable delivery (order, delay, duplicates), drives
 * seeded random or scripted edit scenarios through the real editing and
 * sync code paths (graph model transactions, sendLocalChanges,
 * receiveRemoteChanges, cleanup, simulated saves through fileSaved) and
 * asserts at quiescence:
 *
 *  1. Convergence: canonical XML of all clients' pages is identical.
 *  2. Snapshot invariant per client: diffPages(sync.snapshot, ui.pages)
 *     is empty when no local changes are pending.
 *  3. Realtime alignment: ownPages == theirPages == ui.pages.
 *  4. Echo probe: idle flush/cleanup rounds must produce zero outgoing
 *     messages and zero visible patches (echo loop detector).
 *  5. Marker liveness: cells created by non-conflicting ops exist on all
 *     clients; conflicting targets are consistent across clients.
 *  6. No client-side errors (window.onerror, EditorUi.logError).
 *
 * All randomness is seeded (mulberry32); a failing run is reproduced by
 * loading the orchestrator with the reported seed.
 */
var RtHarness = (function()
{
	'use strict';

	// --- Seeded PRNG -----------------------------------------------------
	function mulberry32(seed)
	{
		var a = seed >>> 0;

		return function()
		{
			a |= 0;
			a = (a + 0x6D2B79F5) | 0;
			var t = Math.imul(a ^ (a >>> 15), 1 | a);
			t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;

			return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
		};
	};

	function Rand(seed)
	{
		this.next = mulberry32(seed);
	};

	Rand.prototype.int = function(max)
	{
		return Math.floor(this.next() * max);
	};

	Rand.prototype.pick = function(arr)
	{
		return arr[this.int(arr.length)];
	};

	Rand.prototype.chance = function(p)
	{
		return this.next() < p;
	};

	function sleep(ms)
	{
		return new Promise(function(resolve)
		{
			window.setTimeout(resolve, ms);
		});
	};

	// --- Failure collection ----------------------------------------------
	function Report(config)
	{
		this.config = config;
		this.failures = [];
		this.stats = {messages: 0, deliveries: 0, bytes: 0, ops: {},
			flushes: 0, saves: 0, cleanups: 0};
		// Chronological trace of executed ops and sync events; included
		// in the verdict on failure for attribution
		this.trace = [];
		this.started = Date.now();
	};

	Report.prototype.log = function(entry)
	{
		if (this.trace.length < 5000)
		{
			this.trace.push(entry);
		}
		else if (this.traceTail)
		{
			// trace=tail keeps the END of a long run instead of its
			// start, for hangs and livelocks in the quiescence phase
			this.trace.shift();
			this.trace.push(entry);
		}
	};

	Report.prototype.fail = function(kind, detail)
	{
		this.failures.push({kind: kind, detail: detail});
		console.error('[rt-test] FAIL', kind, detail);
	};

	Report.prototype.finish = function()
	{
		return {
			pass: this.failures.length == 0,
			seed: this.config.seed,
			scenario: this.config.scenario,
			clients: this.config.clients,
			rounds: this.config.rounds,
			opsPerRound: this.config.opsPerRound,
			failures: this.failures,
			stats: this.stats,
			// alwaysTrace: diagnosis of events that do not fail the
			// run (eg. checksum reloads under real timing)
			trace: (this.failures.length > 0 || this.alwaysTrace) ?
				this.trace : undefined,
			runtime: {userAgent: navigator.userAgent, timing: RtHarness.realTiming ? 'real' : 'controlled'},
			durationMs: Date.now() - this.started
		};
	};

	// --- Message broker --------------------------------------------------
	// Collects outgoing sync messages per client and delivers them to the
	// other clients via the real receiveRemoteChanges entry point. The
	// delivery policy makes the timing adversarial but reproducible:
	// per-message delay from the seeded rng, optional duplicates and
	// cross-sender reordering. Per-sender FIFO order is preserved by
	// default (like a socket) unless reorderSameSender is set.
	function Broker(clients, policy, rand, report)
	{
		this.clients = clients;
		this.policy = policy;
		this.rand = rand;
		this.report = report;
		this.queues = [];
		this.pending = 0;
		this.capture = null;

		// Backend revision counter for the etag gate in the save stub:
		// real providers reject a save whose base revision is stale
		// (concurrent autosaves in real-timing mode race like in
		// production and must serialize through merge + retry)
		this.revision = 0;

		// Revision history for the catchup chain: a receiver that sees
		// revision N+2 before N+1 fills the gap from here like the
		// production cache instead of failing the checksum
		this.saveLog = {};

		// Live diffs since the last save, for late joiners: the
		// production cache serves them to the join catchup (a joiner
		// loads the saved file and replays these to reach the head)
		this.liveLog = [];

		for (var i = 0; i < clients.length; i++)
		{
			this.queues.push([]);
		}
	};

	Broker.prototype.send = function(fromIdx, msg)
	{
		this.report.stats.messages++;
		// enc is the actual wire payload; d only rides along for the log
		this.report.stats.bytes += (msg.enc != null) ?
			msg.enc.length : JSON.stringify(msg).length;
		this.report.log('send c' + fromIdx + ' diff id=' +
			((msg.p != null) ? msg.p.id : '?') + ' ' +
			JSON.stringify((msg.p != null) ? msg.p.c : null).substring(0, 300));

		if (this.capture != null)
		{
			this.capture.push({from: fromIdx, msg: msg});

			return;
		}

		// Served to late joiners after the saved base (join catchup)
		this.liveLog.push({msg: msg, from: fromIdx});

		for (var i = 0; i < this.clients.length; i++)
		{
			if (i != fromIdx && !this.clients[i].unjoined)
			{
				this.queues[i].push({msg: msg, from: fromIdx});

				if (this.policy.duplicates != null &&
					this.rand.chance(this.policy.duplicates))
				{
					this.queues[i].push({msg: msg, from: fromIdx});
				}
			}
		}
	};

	// Save propagation: same queue and delivery policy as live diffs
	// (a merge can race live diffs) but never duplicated, as the real
	// cache dedups patches by revision.
	Broker.prototype.sendSave = function(fromIdx, diffJson, checksum)
	{
		this.report.stats.messages++;
		this.report.stats.bytes += diffJson.length;
		this.lastSaver = fromIdx;
		this.revision++;
		this.saveLog[this.revision] = {diff: diffJson,
			checksum: checksum};
		this.report.log('send c' + fromIdx + ' save rev=' +
			this.revision + ' ' + diffJson.substring(0, 200));

		if (this.capture != null)
		{
			this.capture.push({from: fromIdx,
				msg: {a: 'rt-test-save', diff: diffJson}});

			return;
		}

		// The saved state carries everything up to here
		this.liveLog = [];

		for (var i = 0; i < this.clients.length; i++)
		{
			if (i != fromIdx && !this.clients[i].unjoined)
			{
				this.queues[i].push({msg: {a: 'rt-test-save',
					diff: diffJson, checksum: checksum,
					revision: this.revision}, from: fromIdx});
			}
		}
	};

	// Delivers all queued messages. Ordering nastiness happens here: the
	// queue of each receiver is optionally shuffled across senders (and,
	// if configured, within a sender) before delivery, and delivery is
	// spread over 0..maxDelay ms so messages race the receive batcher.
	Broker.prototype.drain = function()
	{
		var self = this;
		var promises = [];

		for (var i = 0; i < this.clients.length; i++)
		{
			var queue = this.queues[i];
			this.queues[i] = [];

			if (queue.length == 0)
			{
				continue;
			}

			if (this.policy.reorder)
			{
				// Seeded shuffle; preserves per-sender order unless
				// reorderSameSender is set (tests the msg-id sort)
				for (var j = queue.length - 1; j > 0; j--)
				{
					var k = this.rand.int(j + 1);

					if (this.policy.reorderSameSender ||
						queue[j].from != queue[k].from)
					{
						var tmp = queue[j];
						queue[j] = queue[k];
						queue[k] = tmp;
					}
				}
			}

			this.pending++;
			promises.push(this.deliverQueue(this.clients[i], queue).finally(function() { self.pending--; }));
		}

		return Promise.all(promises);
	};

	Broker.prototype.deliverQueue = function(client, queue)
	{
		var self = this;

		return new Promise(function(resolve)
		{
			var idx = 0;

			function step()
			{
				if (idx >= queue.length)
				{
					resolve();

					return;
				}

				var entry = queue[idx++];
				var delay = (self.policy.maxDelay > 0) ?
					self.rand.int(self.policy.maxDelay) : 0;

				window.setTimeout(function()
				{
					try
					{
						// A dead socket loses in-flight messages for good
						// (the rejoin catches up from the file), a lossy
						// network only loses live diffs - saves are
						// fetched, not pushed, so they always arrive and
						// convergence must come from the save/merge cycle
						if (client.offline)
						{
							self.report.log('drop offline c' +
								entry.from + '->' + client.name);
						}
						else if (self.policy.dropRate != null &&
							entry.msg.a != 'rt-test-save' &&
							self.rand.chance(self.policy.dropRate))
						{
							self.report.log('drop lossy c' +
								entry.from + '->' + client.name);
						}
						else
						{
							self.report.stats.deliveries++;
							self.report.log('deliver c' + entry.from + '->' +
								client.name + ' ' + ((entry.msg.a == 'rt-test-save') ?
								'save' : 'diff ' + String((entry.msg.p != null) ?
									entry.msg.p.id : '?')));
							client.receive(entry.msg);
						}
					}
					catch (e)
					{
						self.report.fail('deliver-exception', client.name +
							': ' + e.message);
					}

					step();
				}, delay);
			};

			step();
		});
	};

	Broker.prototype.hasPending = function()
	{
		for (var i = 0; i < this.queues.length; i++)
		{
			if (this.queues[i].length > 0)
			{
				return true;
			}
		}

		return false;
	};

	// --- Client ----------------------------------------------------------
	// One full draw.io app in an iframe. bootstrap() waits for the app,
	// captures the EditorUi, swaps in a realtime-capable test file and
	// wires the sync to the broker.
	function Client(idx, container, report)
	{
		this.idx = idx;
		this.name = 'client' + idx;
		this.report = report;
		this.container = container;
		this.errors = [];
	};

	Client.prototype.bootUrl = '/index.html?dev=1&test=1&sockets=0&' +
		'splash=0&local=1&lang=en&chrome=1&gapi=0&db=0&od=0&gh=0&gl=0&tr=0';

	Client.prototype.boot = function()
	{
		var self = this;
		var iframe = document.createElement('iframe');
		iframe.style.width = '900px';
		iframe.style.height = '600px';
		iframe.style.border = '1px solid #ccc';
		iframe.src = this.bootUrl;
		this.iframe = iframe;
		this.container.appendChild(iframe);

		return new Promise(function(resolve, reject)
		{
			var deadline = Date.now() + 60000;

			function poll()
			{
				try
				{
					var win = iframe.contentWindow;

					if (win != null && win.EditorUi != null &&
						win.document.querySelector('.geDiagramContainer') != null)
					{
						self.win = win;
						self.captureUi().then(resolve, reject);

						return;
					}
				}
				catch (e)
				{
					reject(new Error(self.name + ' boot: ' + e.message));

					return;
				}

				if (Date.now() > deadline)
				{
					reject(new Error(self.name + ' boot timeout'));
				}
				else
				{
					window.setTimeout(poll, 200);
				}
			};

			poll();
		});
	};

	// Captures the EditorUi instance via a temporary prototype hook
	// triggered by a synthetic event (no global reference exists).
	Client.prototype.captureUi = function()
	{
		var self = this;
		var win = this.win;

		return new Promise(function(resolve, reject)
		{
			var deadline = Date.now() + 30000;

			function attempt()
			{
				var captured = null;
				var orig = win.EditorUi.prototype.getCurrentFile;

				win.EditorUi.prototype.getCurrentFile = function()
				{
					captured = this;

					return orig.apply(this, arguments);
				};

				try
				{
					var c = win.document.querySelector('.geDiagramContainer');

					// mxGraph listens for pointer events everywhere
					// except on Macs (mxClient.IS_POINTER)
					var pointer = win.mxClient != null &&
						win.mxClient.IS_POINTER;
					var evt = (pointer) ? ['pointerdown', 'pointerup'] :
						['mousedown', 'mouseup'];

					for (var i = 0; i < evt.length; i++)
					{
						c.dispatchEvent((pointer) ?
							new win.PointerEvent(evt[i],
								{bubbles: true, clientX: 400,
								clientY: 300, button: 0, pointerId: 1,
								pointerType: 'mouse', isPrimary: true}) :
							new win.MouseEvent(evt[i],
								{bubbles: true, clientX: 400,
								clientY: 300, button: 0}));
					}
				}
				catch (e)
				{
					// ignore and retry
				}

				win.EditorUi.prototype.getCurrentFile = orig;

				if (captured != null)
				{
					self.ui = captured;
					resolve();
				}
				else if (Date.now() > deadline)
				{
					reject(new Error(self.name + ' ui capture timeout'));
				}
				else
				{
					window.setTimeout(attempt, 300);
				}
			};

			attempt();
		});
	};

	// Creates the realtime test file from the given XML and connects it
	// to the broker. saveLatency is controlled per save call.
	Client.prototype.injectFile = function(xml, broker)
	{
		var self = this;
		var win = this.win;
		var ui = this.ui;
		this.broker = broker;

		// Every hook below belongs to THIS frame. crash() destroys the
		// frame while requests may still be in flight, and the browser
		// then fails them with 'Document is already detached' - a
		// report from a frame the scenario deliberately destroyed is
		// noise, not a finding, and a flaky red trains readers to
		// ignore the gate. Compared against the client's CURRENT window
		// rather than a crashed flag, so the hooks of a reloaded frame
		// stay armed.
		var isLiveFrame = function()
		{
			return self.win === win;
		};

		// Collects errors that would otherwise be invisible
		win.onerror = function(msg, url, line)
		{
			if (!isLiveFrame()) return;

			// Forensics ONLY in the error case (a scan in the hot path
			// scares timing-sensitive races away, see README): a stack
			// overflow in the diff comes from an object graph that grew
			// unexpectedly deep, and that state is persistent, so it is
			// still there to be described when the error fires
			var extra = '';

			if (String(msg).indexOf('call stack') >= 0)
			{
				try
				{
					extra = ' | ' + self.describeDeepCells();
				}
				catch (e)
				{
					extra = ' | deep-cell scan failed: ' + e.message;
				}
			}

			self.errors.push(msg + ' (' + url + ':' + line + ')');
			self.report.fail('window-error', self.name + ': ' + msg +
				' (' + url + ':' + line + ')' + extra);
		};

		// onerror does not see rejections. The app has plenty of
		// promise paths (saves, descriptor loads, the merge queue), and
		// an exception on one of them would otherwise be invisible to
		// the error verdict
		win.addEventListener('unhandledrejection', function(evt)
		{
			if (!isLiveFrame()) return;

			var reason = (evt.reason != null) ?
				(evt.reason.message || evt.reason) : evt.reason;
			var trace = (evt.reason != null && evt.reason.stack != null) ?
				String(evt.reason.stack).split('\n').slice(0, 4) : [];
			var stack = (trace.length > 0) ? ' | ' + trace.join(' <- ') : '';

			self.errors.push('unhandled rejection: ' + reason);
			self.report.fail('unhandled-rejection',
				self.name + ': ' + reason + stack);
		});

		var origLogError = win.EditorUi.logError;

		win.EditorUi.logError = function(message)
		{
			if (!isLiveFrame()) return;

			self.report.fail('logError', self.name + ': ' + message);

			return origLogError.apply(this, arguments);
		};

		// Any alert is a failure: the test=1 snapshot assertion in
		// DrawioFile.patch reports ONLY via ui.alert, and it fires
		// mid-run, before the quiescence anchors re-clone the snapshot
		// and heal the drift the final verdicts would otherwise miss
		var origAlert = ui.alert;

		ui.alert = function(message)
		{
			// The dirty-tracking assertion reports the missed residue
			// only via EditorUi.debug - recompute it here so headless
			// failures carry the actionable detail
			var detail = '';

			try
			{
				if (String(message).indexOf('Dirty page tracking') >= 0 &&
					self.sync != null && self.sync.snapshot != null)
				{
					detail = ' residue=' + JSON.stringify(ui.diffPages(
						self.sync.snapshot, ui.pages)).substring(0, 400);

					// Duplicate-id scan per snapshot page (a cell id
					// appearing twice produces exactly the u+r plus
					// self-previous residue signature)
					var dups = [];

					for (var si = 0; si < self.sync.snapshot.length; si++)
					{
						var page = self.sync.snapshot[si];
						var counts = {};
						var walk = function(cell)
						{
							if (cell.getId() != null)
							{
								counts[cell.getId()] =
									(counts[cell.getId()] || 0) + 1;
							}

							for (var ci = 0; ci < cell.getChildCount(); ci++)
							{
								walk(cell.getChildAt(ci));
							}
						};

						if (page.root != null)
						{
							walk(page.root);
						}

						for (var key in counts)
						{
							if (counts[key] > 1)
							{
								dups.push(page.getId().substring(0, 5) +
									':' + key + 'x' + counts[key]);
							}
						}
					}

					detail += ' snapshotDups=' + JSON.stringify(dups);

					// Existence of every id mentioned in the residue,
					// in snapshot vs visible pages (application
					// divergence needs a missing cell on one side)
					var idsInResidue = (detail.match(/"m\d+_\d+"/g) || [])
						.map(function(s) { return s.replace(/"/g, ''); });
					var exist = [];

					for (var xi = 0; xi < idsInResidue.length &&
						xi < 6; xi++)
					{
						var xid = idsInResidue[xi];
						var inSnap = false, inUi = false;

						for (var pi2 = 0; pi2 < self.sync.snapshot.length; pi2++)
						{
							if (new self.win.mxGraphModel(
								self.sync.snapshot[pi2].root).getCell(xid) != null)
							{
								inSnap = true;
							}
						}

						for (var pi2 = 0; pi2 < ui.pages.length; pi2++)
						{
							var mdl = (ui.pages[pi2] == ui.currentPage) ?
								ui.editor.graph.getModel() :
								new self.win.mxGraphModel(ui.pages[pi2].root);

							if (mdl.getCell(xid) != null)
							{
								inUi = true;
							}
						}

						exist.push(xid + ':snap=' + inSnap + ',ui=' + inUi);
					}

					detail += ' exist=' + JSON.stringify(exist);

					// Provenance of dangling terminal objects: identity of
					// the edge's terminal instance against every model copy
					// tells which copy leaked its object into the ui
					var findInstance = function(pages, id)
					{
						if (pages != null)
						{
							for (var fi = 0; fi < pages.length; fi++)
							{
								if (pages[fi].root != null)
								{
									var c = new self.win.mxGraphModel(
										pages[fi].root).getCell(id);

									if (c != null)
									{
										return c;
									}
								}
							}
						}

						return null;
					};

					var prov = [];

					for (var pv = 0; pv < ui.pages.length; pv++)
					{
						var pvm = (ui.pages[pv] == ui.currentPage) ?
							ui.editor.graph.getModel() :
							new self.win.mxGraphModel(ui.pages[pv].root);

						for (var xi2 = 0; xi2 < idsInResidue.length; xi2++)
						{
							var ec = pvm.getCell(idsInResidue[xi2]);

							if (ec != null && ec.isEdge())
							{
								for (var ti2 = 0; ti2 < 2; ti2++)
								{
									var term = ec.getTerminal(ti2 == 0);

									if (term != null &&
										pvm.getCell(term.getId()) != term)
									{
										var tid = term.getId();
										prov.push(ec.getId() +
											(ti2 == 0 ? '.src=' : '.trg=') +
											tid +
											' own:' + (findInstance(
												self.file.ownPages, tid) === term) +
											' their:' + (findInstance(
												self.file.theirPages, tid) === term) +
											' snap:' + (findInstance(
												self.sync.snapshot, tid) === term) +
											' ownHas:' + (findInstance(
												self.file.ownPages, tid) != null) +
											' theirHas:' + (findInstance(
												self.file.theirPages, tid) != null));
									}
								}
							}
						}
					}

					detail += ' prov=' + JSON.stringify(prov);

					// Undo history forensics: which edits reference the
					// residue ids, where is the cursor, what is dirty
					var undoMgr = ui.editor.undoManager;
					var hist = [];

					for (var hi = 0; hi < undoMgr.history.length; hi++)
					{
						var chs = [];

						for (var hc = 0; hc < undoMgr.history[hi].changes.length &&
							hc < 6; hc++)
						{
							var ch = undoMgr.history[hi].changes[hc];
							var s = ch.constructor.name;

							if (ch.cell != null && ch.cell.getId != null)
							{
								s += ':' + ch.cell.getId();
							}
							else if (ch.child != null && ch.child.getId != null)
							{
								s += ':' + ch.child.getId();
							}

							if (ch.terminal != null && ch.terminal.getId != null)
							{
								s += '>' + ch.terminal.getId() +
									(ch.source ? 's' : 't');
							}

							if (ch.previous != null && ch.previous.getId != null &&
								ch.constructor.name == 'mxTerminalChange')
							{
								s += '<' + ch.previous.getId();
							}

							chs.push(s);
						}

						hist.push(hi + (undoMgr.history[hi].undone ? 'U' : '') +
							'[' + chs.join(',') + ']');
					}

					detail += ' nextAdd=' + undoMgr.indexOfNextAdd +
						' dirty=' + JSON.stringify(self.sync.dirtyPageIds) +
						' curPage=' + ((ui.currentPage != null) ?
							ui.currentPage.getId() : 'null') +
						' hist=' + JSON.stringify(hist.join('|')).substring(0, 1200);
				}
			}
			catch (e)
			{
				detail = ' residue-err=' + e.message;
			}

			if (isLiveFrame())
			{
				self.report.fail('alert', self.name + ': ' + message + detail);
			}

			return origAlert.apply(this, arguments);
		};

		win.Editor.enableRealtime = true;

		var file = broker.backend == 'onedrive' ?
			RtDescriptorBackend.createOneDrive(this, broker, xml) :
			new win.LocalFile(ui, xml, 'rt-test', true);

		// Realtime enablement on the LocalFile test double
		file.isSyncSupported = function() { return true; };
		file.isRealtimeSupported = function() { return true; };
		file.isRealtimeEnabled = function() { return true; };
		file.isAutosave = function() { return true; };
		file.isAutosaveOptional = function() { return false; };
		file.getChannelId = function() { return 'rt-test-channel'; };

		// Autosave is a no-op: saves are driven explicitly by the
		// scenario for determinism. The success callback must NOT be
		// invoked synchronously: fileChanged -> autosave -> success ->
		// handleFileSuccess -> fileChanged recurses on modified files.
		file.autosave = function() {};

		// Descriptor model for the revoke verification: the injected
		// revoke flag plays the provider descriptor reporting effective
		// read-only (isEditable on DriveFile); a lone 403 stays transient
		file.verifyWriteRevoked = function(callback)
		{
			callback(self.revokeWrite === true);
		};


		ui.fileLoaded(file);
		this.file = file;

		if (file.sync == null)
		{
			throw new Error(this.name + ': sync not created');
		}

		this.sync = file.sync;

		if (RtHarness.realTiming)
		{
			// Real-timing mode: the PRODUCTION defaults stay in place
			// (300ms flush debounce, 50ms receive batch, 15s cleanup,
			// 1.5s autosave) and drive flush, save and cleanup
			// organically - the scenario only performs ops with human
			// pacing. The autosave stub mirrors the production thread:
			// debounced, single-flight, saving through the save stub.
			var autoSelf = this;

			// The remote grace period is the one production default the
			// scenarios cannot wait out (a minute per delivery): held
			// content is asserted explicitly in remote-grace instead.
			// grace=<ms> restores it for runs that must model the
			// production cleanup regime (eg. large fleets, where a
			// zero grace expels unconfirmed content on every cleanup)
			this.sync.remoteGraceDelay = (RtHarness.realGraceMs != null) ?
				RtHarness.realGraceMs : 0;

			file.autosave = function()
			{
				var f = this;

				if (f.autosaveThread == null && !f.savingFile)
				{
					f.autosaveThread = window.setTimeout(function()
					{
						f.autosaveThread = null;

						if (f.isModified())
						{
							autoSelf.save(0);
						}
					}, f.autosaveDelay);
				}
			};
		}
		else
		{
			// Neutralizes the wallclock timers so the scenario controls
			// all flush and cleanup timing explicitly
			this.sync.cleanupDelay = 3600000;
			this.sync.remoteGraceDelay = 0;
			this.sync.syncSendMessageDelay = 3600000;
			file.autosaveDelay = 3600000;

			// Shortened receive batch window (still exercises sort/dedup)
			this.sync.syncReceiveMessageDelay = 20;
		}

		// Realtime channel double: routes outgoing diffs to the broker
		// via the real doSendLocalChanges p2pCollab branch
		this.sync.channelId = 'rt-test-channel';

		// Traces the actual (batched) application of remote diffs
		var origDoReceive = this.sync.doReceiveRemoteChanges;

		this.sync.doReceiveRemoteChanges = function(changes)
		{
			self.report.log('apply ' + self.name + ' ' +
				JSON.stringify(changes).substring(0, 400));

			// Cell removes in full (the 400-char cap above hides them
			// in large patches - a dangling-terminal diagnosis needs
			// the exact remove windows)
			try
			{
				var rm = [];

				for (var ci = 0; ci < changes.length; ci++)
				{
					var u = (changes[ci] != null) ? changes[ci].u : null;

					if (u != null)
					{
						for (var pid in u)
						{
							var cells = u[pid].cells;

							if (cells != null && cells.r != null)
							{
								rm.push.apply(rm, cells.r);
							}
						}
					}
				}

				if (rm.length > 0)
				{
					self.report.log('apply-removes ' + self.name + ' ' +
						JSON.stringify(rm).substring(0, 600));
				}
			}
			catch (e)
			{
				// ignore
			}

			return origDoReceive.apply(this, arguments);
		};
		// Checksum fallback: production reloads the file from the
		// backend; the stub merges the last saved state through the
		// real mergeFile path (like rejoin) and counts the reloads -
		// a rising rate is itself a regression signal
		this.sync.reload = function(success, error)
		{
			self.report.stats.reloads =
				(self.report.stats.reloads || 0) + 1;
			self.report.log('checksum-reload ' + self.name);

			var data = (self.broker != null) ?
				self.broker.lastSavedData : null;

			if (data == null)
			{
				if (error != null)
				{
					error({message: 'no saved state for reload'});
				}

				return;
			}

			var shadowFile = {
				initialData: data,
				getShadowPages: function()
				{
					return self.ui.getPagesForXml(data);
				},
				getCurrentRevisionId: function() { return null; },
				getDescriptor: function() { return null; }
			};

			self.file.mergeFile(shadowFile, function()
			{
				self.knownRevision = self.broker.revision;

				if (success != null)
				{
					success();
				}
			}, function(err)
			{
				self.report.fail('reload-error', self.name + ': ' +
					((err != null && err.message != null) ?
						err.message : String(err)));

				if (error != null)
				{
					error(err);
				}
			});
		};

		// Surfaces merge checksum mismatches in the trace (the debug
		// call carries the compared hashes; the reload above would
		// otherwise hide which merge diverged)
		var origDebug = win.EditorUi.debug;

		win.EditorUi.debug = function()
		{
			try
			{
				if (arguments[0] == 'DrawioFileSync.merge')
				{
					var args = Array.prototype.slice.call(arguments);
					var ci = args.indexOf('checksum');
					var cui = args.indexOf('current');

					if (ci >= 0 && cui >= 0 && args[ci + 1] != null &&
						args[ci + 1] != args[cui + 1])
					{
						self.report.log('merge-mismatch ' + self.name +
							' checksum=' + args[ci + 1] +
							' current=' + args[cui + 1]);
					}
				}
			}
			catch (e)
			{
				// ignore
			}

			return (origDebug != null) ?
				origDebug.apply(this, arguments) : undefined;
		};

		// isFileJoined/getState mirror the offline flag so the real
		// isRealtimeConnected/isRealtimeActive gates (merge veto,
		// solo-traffic) see the simulated network state
		this.sync.p2pCollab = {
			sendDiff: function(msg)
			{
				if (self.offline)
				{
					self.report.log('drop offline-send ' + self.name);

					return;
				}

				// Transports the wire encoding (objectToString in the
				// sender frame, stringToObject in the receiver frame in
				// Client.receive) so every live diff exercises the real
				// codec cross-realm; msg.p rides along for the trace log
				broker.send(self.idx, {enc: self.sync.objectToString(msg),
					p: {id: msg.p.id, c: msg.p.c}});
			},
			sendMessage: function() {},
			getLastError: function() { return null; },
			isFileJoined: function() { return !self.offline; },
			getState: function() { return (self.offline) ? 3 : 1; },
			joinFile: function() {},
			destroy: function() {},
			mountChanged: function() {}
		};
		this.broker = broker;

		// History-shape invariants (the phantom-step class of case 17,
		// where a repair recorded itself as an edit and one delete
		// suddenly needed two undos): a remote patch must never change
		// the history LENGTH, and one undo or redo must move the index
		// by exactly one. Invisible to every other verdict - they
		// compare documents, not the shape of the history.
		var undoMgr = ui.editor.undoManager;
		var origPatch = file.patch;

		file.patch = function(patches, resolver, undoable)
		{
			var before = undoMgr.history.length;
			var result = origPatch.apply(this, arguments);

			if (!undoable && undoMgr.history.length != before)
			{
				self.report.fail('history-shape', self.name +
					': a remote patch changed the undo history length (' +
					before + ' -> ' + undoMgr.history.length + ')');
			}

			return result;
		};

		var checkStep = function(name, fn, dir)
		{
			return function()
			{
				var idxBefore = undoMgr.indexOfNextAdd;
				var lenBefore = undoMgr.history.length;
				var possible = (dir < 0) ? undoMgr.canUndo() :
					undoMgr.canRedo();
				var result = fn.apply(this, arguments);

				if (possible)
				{
					var moved = (undoMgr.indexOfNextAdd - idxBefore) * dir;

					if (moved != 1)
					{
						self.report.fail('history-shape', self.name +
							': ' + name + ' moved the history index by ' +
							(undoMgr.indexOfNextAdd - idxBefore) +
							' instead of ' + dir + ' (phantom step)');
					}
				}

				if (undoMgr.history.length != lenBefore)
				{
					self.report.fail('history-shape', self.name + ': ' +
						name + ' changed the history length (' + lenBefore +
						' -> ' + undoMgr.history.length + ')');
				}

				return result;
			};
		};

		ui.undo = checkStep('undo', ui.undo, -1);
		ui.redo = checkStep('redo', ui.redo, 1);

		// System operations must be history-NEUTRAL: they are not user
		// actions, so recording them turns one user action into two
		// undo steps and lets a later replay undo the system's own
		// work. The one exception is replaceFileData: a wholesale
		// replacement (revision restore, external merge) is a USER
		// step and must be exactly ONE undoable entry - never the
		// page-by-page steps whose reversed replay once deleted every
		// page on every client (restore-undo), never none.
		var auditNeutral = function(owner, name, label, allowed)
		{
			var fn = owner[name];
			allowed = (allowed != null) ? allowed : 0;

			if (typeof fn != 'function')
			{
				return;
			}

			owner[name] = function()
			{
				var before = undoMgr.history.length;
				var result = fn.apply(this, arguments);
				var added = undoMgr.history.length - before;

				if (added < 0 || added > allowed)
				{
					self.report.fail('history-shape', self.name + ': ' +
						label + ' changed the undo history length (' +
						before + ' -> ' + undoMgr.history.length +
						') - ' + ((allowed == 0) ?
							'system operations must not be undoable' :
							'at most ' + allowed + ' undoable step allowed'));
				}

				return result;
			};
		};

		auditNeutral(ui, 'replaceFileData', 'replaceFileData', 1);
		auditNeutral(ui, 'sanitizeRealtimeTerminals', 'terminal sanitizer');
		auditNeutral(this.sync, 'cleanup', 'cleanup');
		auditNeutral(this.sync, 'merge', 'merge');
		auditNeutral(this.sync, 'sendLocalChanges', 'flush');
		auditNeutral(file, 'repairUnrenderableEdges', 'edge repair');

		if (!file.isRealtime() || this.sync.snapshot == null)
		{
			throw new Error(this.name + ': realtime not initialized');
		}

		RtTestBackend.install(this, broker, xml);
	};

	// Feeds a broker message into the real receive pipeline
	Client.prototype.receive = function(msg)
	{
		if (msg.a == 'rt-test-save')
		{
			// Merges are serialized per client in revision order like
			// the production catchup chain: under real timing several
			// save broadcasts arrive while a merge is still running,
			// and reentrant merges tear the shadow state apart
			this.mergeQueue = this.mergeQueue || [];
			this.mergeQueue.push(msg);
			this.drainMergeQueue();
		}
		else
		{
			// The production message entry: changeListener decodes the
			// wire encoding in THIS client's realm, applies the
			// protocol and app-version gates and only then hands the
			// payload to handleMessageData - live diffs from outdated
			// or newer senders are gated exactly like in production
			if (msg.enc != null)
			{
				this.sync.changeListener(msg.enc);
			}
			else
			{
				this.sync.receiveRemoteChanges(msg.p);
			}
		}
	};

	// Serialized merge worker: one merge at a time, queue ordered by
	// backend revision (the production cache dedups and chains saves
	// by revision - a reordered OLDER save must be skipped, merging
	// it against the newer shadow would fail the checksum)
	Client.prototype.drainMergeQueue = function()
	{
		var self = this;

		if (this.merging || this.mergeQueue == null ||
			this.mergeQueue.length == 0)
		{
			return;
		}

		this.mergeQueue.sort(function(a, b)
		{
			return (a.revision || 0) - (b.revision || 0);
		});

		var msg = this.mergeQueue.shift();

		if (msg.revision != null &&
			msg.revision <= (this.knownRevision || 0))
		{
			this.report.log('skip stale save rev=' + msg.revision +
				' at ' + this.name + ' (known=' +
				(this.knownRevision || 0) + ')');
			this.drainMergeQueue();

			return;
		}

		// Catchup chain: a reordered delivery can present revision N+2
		// before N+1 - merging across the gap fails the checksum.
		// Production fetches the missing revisions from the cache; the
		// broker's save log plays that role here.
		if (msg.revision != null &&
			msg.revision > (this.knownRevision || 0) + 1 &&
			this.broker != null)
		{
			var filled = false;

			for (var rev = (this.knownRevision || 0) + 1;
				rev < msg.revision; rev++)
			{
				var entry = this.broker.saveLog[rev];

				if (entry != null)
				{
					this.mergeQueue.push({a: 'rt-test-save',
						diff: entry.diff, checksum: entry.checksum,
						revision: rev});
					filled = true;
				}
			}

			if (filled)
			{
				this.report.log('catchup ' + this.name +
					' filling revisions ' +
					((this.knownRevision || 0) + 1) + '..' +
					(msg.revision - 1));
				this.mergeQueue.push(msg);
				this.drainMergeQueue();

				return;
			}
		}

		this.merging = true;

		var done = function()
		{
			self.merging = false;
			self.drainMergeQueue();
		};

		this.sync.merge([JSON.parse(msg.diff)], msg.checksum, null,
			function()
			{
				self.report.log('merge ' + self.name + ' ok modified=' +
					self.file.isModified());

				// Merging the save brought this client up to the
				// sender's backend revision (etag gate base); a
				// reordered older save must not move it backwards
				if (msg.revision != null)
				{
					self.knownRevision = Math.max(
						self.knownRevision || 0, msg.revision);
				}

				// A 412-rejected autosave retries once the merge
				// made the base current
				if (RtHarness.realTiming && self.file.isModified())
				{
					self.file.autosave();
				}

				done();
			}, function(err)
			{
				self.report.fail('merge-error', self.name + ': ' +
					((err != null && err.message != null) ?
						err.message : String(err)));
				done();
			});
	};

	// Names the deepest object graph reachable from a cell property in
	// any of this client's model copies. A stack overflow out of the
	// diff (isObjectEqual JSON.stringifies geometries) means some cell
	// property chain grew far past the handful of levels an mxGeometry
	// has, and that state persists - so the failing run can point at
	// the cell instead of leaving the next reader to reproduce a rare
	// timing hit. Never called unless an error already fired.
	Client.prototype.describeDeepCells = function()
	{
		var worst = null;

		var depthOf = function(value)
		{
			var seen = [], path = [], cur = value, d = 0;

			while (cur != null && typeof cur == 'object' && d < 5000)
			{
				if (seen.indexOf(cur) >= 0)
				{
					path.push('CYCLE');
					break;
				}

				seen.push(cur);
				var next = null, key = null;

				for (var k in cur)
				{
					if (cur[k] != null && typeof cur[k] == 'object')
					{
						next = cur[k];
						key = k;
						break;
					}
				}

				if (next == null)
				{
					break;
				}

				path.push(key);
				cur = next;
				d++;
			}

			return {depth: d, path: path};
		};

		var scan = function(where, cell)
		{
			if (cell == null)
			{
				return;
			}

			var props = ['geometry', 'value', 'style', 'overlays'];

			for (var i = 0; i < props.length; i++)
			{
				var probe = depthOf(cell[props[i]]);

				if (worst == null || probe.depth > worst.depth)
				{
					worst = {depth: probe.depth, where: where,
						id: cell.getId(), prop: props[i],
						path: probe.path};
				}
			}

			for (var i = 0; i < cell.getChildCount(); i++)
			{
				scan(where, cell.getChildAt(i));
			}
		};

		var copies = [{name: 'ui', pages: this.ui.pages},
			{name: 'own', pages: this.file.ownPages},
			{name: 'their', pages: this.file.theirPages},
			{name: 'snapshot', pages: this.sync.snapshot}];

		for (var i = 0; i < copies.length; i++)
		{
			var pages = copies[i].pages;

			if (pages == null)
			{
				continue;
			}

			for (var p = 0; p < pages.length; p++)
			{
				scan(copies[i].name + '/' + pages[p].getId(), pages[p].root);
			}
		}

		return (worst == null) ? 'deepest cell property: none found' :
			'deepest cell property: ' + worst.where + ' ' + worst.id +
			'.' + worst.prop + ' depth=' + worst.depth + ' chain=' +
			worst.path.slice(0, 10).join('/') +
			((worst.path.length > 10) ? '/..' : '');
	};

	Client.prototype.flush = function()
	{
		this.report.stats.flushes++;
		this.sync.sendLocalChanges();
	};

	Client.prototype.cleanupNow = function()
	{
		var self = this;
		this.report.stats.cleanups++;

		try
		{
			this.report.log('cleanup ' + this.name + ' modified=' +
				this.file.isModified() + ' snapVsUi=' + JSON.stringify(
					this.ui.diffPages(this.sync.snapshot,
						this.ui.pages)).substring(0, 400) +
				' uiVsOwn=' + JSON.stringify(
					this.ui.diffPages(this.ui.pages,
						this.file.ownPages)).substring(0, 10000));
		}
		catch (e)
		{
			// ignore
		}
		this.win.clearTimeout(this.sync.cleanupThread);
		this.sync.cleanupThread = null;
		this.sync.cleanup(null, function(err)
		{
			self.report.fail('cleanup-error', self.name + ': ' +
				((err != null && err.message != null) ? err.message : err));
		});
	};

	Client.prototype.save = function(latency)
	{
		return RtTestBackend.save(this, latency);
	};

	Client.prototype.mustCommit = function(latency)
	{
		return RtTestBackend.mustCommit(this, latency);
	};

	// Simulated network loss: outgoing diffs are dropped, incoming
	// live messages are lost for good and the p2pCollab double
	// reports disconnected so the real isRealtimeConnected gates see
	// the simulated state
	Client.prototype.setOffline = function(on)
	{
		this.offline = on;
		this.report.log((on ? 'offline ' : 'online ') + this.name);
	};

	// Reconnect: catches up from the last saved file state through
	// the REAL mergeFile path (checksum roundtrip + patchRealtime),
	// like the production reload after a lost connection. Pending
	// local changes survive per merge semantics.
	Client.prototype.rejoin = function()
	{
		var self = this;

		return new Promise(function(resolve)
		{
			var data = (self.broker != null) ?
				self.broker.lastSavedData : null;

			if (data == null)
			{
				self.setOffline(false);
				resolve();

				return;
			}

			// Duck-typed file double for mergeFile: shadow pages from
			// the saved data plus the descriptor accessors it reads
			var shadowFile = {
				initialData: data,
				getShadowPages: function()
				{
					return self.ui.getPagesForXml(data);
				},
				getCurrentRevisionId: function() { return null; },
				getDescriptor: function() { return null; }
			};
			// Production order: the file catch-up runs BEFORE the
			// realtime channel reports connected again, so mergeFile
			// takes its visible-patch branch (!isRealtimeConnected)
			self.report.log('rejoin ' + self.name + ' merging saved state');

			self.file.mergeFile(shadowFile, function()
			{
				// The rejoin merged the LATEST saved state, so the
				// etag gate base is the current backend revision
				self.knownRevision = self.broker.revision;
				self.setOffline(false);
				resolve();
			}, function(err)
			{
				self.report.fail('rejoin-merge', self.name + ': ' +
					((err != null && err.message != null) ?
						err.message : 'unknown'));
				self.setOffline(false);
				resolve();
			});
		});
	};

	// Late join into a RUNNING session: loads the last saved file
	// state as the base. Legacy scenarios optionally replay the synthetic
	// live log; it is NOT a production cache or a guarantee on reopen.
	// Pass replayLive=false for a real saved-base join. The replayed
	// messages run through the regular receive pipeline including
	// the wire decoding in this client's realm.
	Client.prototype.joinLate = function(broker, replayLive)
	{
		var data = (broker != null) ? broker.lastSavedData : null;

		if (data == null)
		{
			this.report.fail('join-late', this.name +
				': no saved state to join from');

			return;
		}

		this.report.log('join-late ' + this.name + ' base rev=' +
			broker.revision + ' replay=' + (replayLive === true ? broker.liveLog.length : 0));
		this.injectFile(data, broker);
		this.knownRevision = broker.revision;

		for (var i = 0; replayLive === true && i < broker.liveLog.length; i++)
		{
			this.receive(broker.liveLog[i].msg);
		}

		this.unjoined = false;
	};

	// Hard crash: the frame dies with all unflushed and unsaved local
	// state (like a browser crash); incoming messages are lost while
	// down - the reload catches up from the file plus the live log
	Client.prototype.crash = function()
	{
		this.report.log('crash ' + this.name);
		this.report.stats.crashes = (this.report.stats.crashes || 0) + 1;
		this.setOffline(true);

		if (this.iframe != null && this.iframe.parentNode != null)
		{
			this.iframe.parentNode.removeChild(this.iframe);
		}

		this.iframe = null;
		this.win = null;
		this.ui = null;
		this.file = null;
		this.sync = null;
	};

	// Boots a fresh frame and rejoins from the last saved state plus
	// the optional synthetic live log; production reopen uses replayLive=false
	Client.prototype.reloadFromSave = async function(broker, replayLive)
	{
		await this.boot();
		this.offline = false;
		this.joinLate(broker, replayLive);
		this.report.log('reloaded ' + this.name);
	};

	// Canonical XML of the visible pages, used for cross-client
	// convergence checks (computed realm-locally, compared as strings)
	// Canonical CONTENT of the given pages, without any view state: the
	// live convergence verdict covers that between clients, while this
	// is used to read persisted bytes back, where transient view
	// properties are not part of the question
	Client.prototype.getCanonicalContent = function(pages)
	{
		var enc = new this.win.mxCodec(this.win.mxUtils.createXmlDocument());
		var result = [];

		for (var i = 0; i < pages.length; i++)
		{
			this.ui.updatePageRoot(pages[i]);
			result.push({id: pages[i].getId(), name: pages[i].getName(),
				xml: this.win.mxUtils.getXml(enc.encode(
					new this.win.mxGraphModel(pages[i].root)))});
		}

		return JSON.stringify(result);
	};

	Client.prototype.getCanonicalXml = function()
	{
		var ui = this.ui;
		var enc = new this.win.mxCodec(this.win.mxUtils.createXmlDocument());
		var result = [];

		for (var i = 0; i < ui.pages.length; i++)
		{
			ui.updatePageRoot(ui.pages[i]);
			var model = enc.encode(new this.win.mxGraphModel(ui.pages[i].root));

			// View state is part of convergence for diffed properties
			// only; transient properties are per-client
			var vs = (ui.pages[i] == ui.currentPage) ?
				ui.editor.graph.getViewState() : ui.pages[i].viewState;
			var page = {
				id: ui.pages[i].getId(),
				name: ui.pages[i].getName(),
				background: (vs != null) ? vs.background : null,
				xml: this.win.mxUtils.getXml(model)
			};
			result.push(page);
		}

		return JSON.stringify(result);
	};

	Client.prototype.getPagesHash = function()
	{
		return this.ui.getHashValueForPages(this.ui.pages);
	};

	// --- Op generator and executor ---------------------------------------
	// Cell ids are unique per creator so markers can be tracked from the
	// parent: m<clientIdx>_<counter>
	function OpGenerator(rand, clients, report)
	{
		this.rand = rand;
		this.clients = clients;
		this.report = report;
		this.counter = 0;
		// id -> {deleted: bool, conflict: bool}
		this.markers = {};
	};

	// Sidebar "List" container and item styles: childLayout=stackLayout
	// makes mxLayoutManager react on the live model of the current page,
	// the bug class behind the 'Snapshot out of sync' incident
	OpGenerator.STACK_STYLE = 'swimlane;fontStyle=1;childLayout=stackLayout;' +
		'horizontal=1;startSize=30;horizontalStack=0;resizeParent=1;' +
		'resizeParentMax=0;resizeLast=0;collapsible=1;marginBottom=0;' +
		'whiteSpace=wrap;html=1;';

	OpGenerator.STACK_ITEM_STYLE = 'text;strokeColor=none;fillColor=none;' +
		'align=left;verticalAlign=middle;spacingLeft=4;spacingRight=4;' +
		'overflow=hidden;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;' +
		'rotatable=0;whiteSpace=wrap;html=1;';

	OpGenerator.prototype.newId = function(clientIdx)
	{
		return 'm' + clientIdx + '_' + (this.counter++);
	};

	OpGenerator.prototype.aliveIds = function()
	{
		var result = [];

		for (var id in this.markers)
		{
			if (!this.markers[id].deleted)
			{
				result.push(id);
			}
		}

		return result;
	};

	// Executes one random op on the given client. All edits run through
	// the real graph/model APIs on the client's current page so that
	// change events, undo history and the sync change listener behave
	// exactly like user edits.
	OpGenerator.prototype.randomOp = function(client)
	{
		var win = client.win;
		var ui = client.ui;
		var graph = ui.editor.graph;
		var model = graph.getModel();
		var rand = this.rand;
		var self = this;

		var styles = [
			'rounded=0;whiteSpace=wrap;html=1;',
			'rounded=1;whiteSpace=wrap;html=1;fillColor=#dae8fc;strokeColor=#6c8ebf;',
			'shape=hexagon;perimeter=hexagonPerimeter2;whiteSpace=wrap;html=1;',
			'ellipse;whiteSpace=wrap;html=1;fillColor=#d5e8d4;strokeColor=#82b366;',
			'swimlane;whiteSpace=wrap;html=1;'
		];

		function record(type, detail)
		{
			self.report.stats.ops[type] = (self.report.stats.ops[type] || 0) + 1;
			self.report.log('op c' + client.idx + ' ' + type +
				((detail != null) ? ' ' + detail : '') + ' [page ' +
				((ui.currentPage != null) ? ui.currentPage.getId() : '?') + ']');
		};

		// Cells alive in this client's model (any page)
		function findCell(id)
		{
			for (var i = 0; i < ui.pages.length; i++)
			{
				ui.updatePageRoot(ui.pages[i]);
				var m = (ui.pages[i] == ui.currentPage) ? model :
					new win.mxGraphModel(ui.pages[i].root);
				var cell = m.getCell(id);

				if (cell != null)
				{
					return {cell: cell, page: ui.pages[i]};
				}
			}

			return null;
		};

		function switchToPageOf(id)
		{
			var hit = findCell(id);

			if (hit == null)
			{
				return null;
			}

			if (hit.page != ui.currentPage)
			{
				ui.selectPage(hit.page, true);
			}

			return model.getCell(id);
		};

		var ops = ['addVertex', 'addVertex', 'addChild', 'addEdge',
			'setStyle', 'setGeometry', 'setLabel', 'moveCell',
			'deleteCell', 'addPage', 'switchPage', 'renamePage', 'undo',
			'redo', 'addStack', 'stackChild', 'stackChild', 'reconnectEdge',
			'setWaypoints', 'groupCells', 'ungroupCells', 'orderCell',
			'movePage', 'deletePage', 'foldCell', 'edgeLabel'];

		var skip = this.skipOps;

		if (skip != null)
		{
			ops = ops.filter(function(op)
			{
				return skip.indexOf(op) < 0;
			});
		}

		// Raises the share of the given ops (eg. undo-heavy fuzzing):
		// the manual finds were all REPLAY interleavings, which the
		// default weighting reaches only rarely
		if (this.boostOps != null)
		{
			for (var i = 0; i < this.boostOps.length; i++)
			{
				for (var j = 0; j < 4; j++)
				{
					ops.push(this.boostOps[i]);
				}
			}
		}

		var type = rand.pick(ops);

		try
		{
			switch (type)
			{
				case 'addVertex':
				{
					var id = this.newId(client.idx);
					graph.insertVertex(null, id, 'v ' + id,
						20 + rand.int(600), 20 + rand.int(400),
						80 + rand.int(80), 40 + rand.int(40),
						rand.pick(styles));
					this.markers[id] = {deleted: false, conflict: false};
					record(type, id);
					break;
				}
				case 'addChild':
				{
					var ids = this.aliveIds();

					if (ids.length == 0)
					{
						return;
					}

					var parent = switchToPageOf(rand.pick(ids));

					if (parent == null || !parent.isVertex())
					{
						return;
					}

					var id = this.newId(client.idx);
					// Nested hierarchy: child inside an existing vertex
					graph.insertVertex(parent, id, 'c ' + id,
						10 + rand.int(40), 10 + rand.int(30),
						60, 30, rand.pick(styles));
					this.markers[id] = {deleted: false, conflict: false};
					record(type, id + ' in ' + parent.getId());
					break;
				}
				case 'addEdge':
				{
					var ids = this.aliveIds();

					if (ids.length < 2)
					{
						return;
					}

					var sourceId = rand.pick(ids);
					var source = switchToPageOf(sourceId);
					// Terminal on the same page only
					var target = model.getCell(rand.pick(ids));

					if (source == null || target == null || source == target)
					{
						return;
					}

					var id = this.newId(client.idx);
					graph.insertEdge(null, id, '', source, target,
						'edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;');
					this.markers[id] = {deleted: false, conflict: false};
					record(type, id + ' ' + source.getId() + '->' + target.getId());
					break;
				}
				case 'reconnectEdge':
				{
					// Reconnects an existing edge to a new terminal via
					// the interactive API (concurrent reconnects of the
					// same edge are a classic RT terminal-ref race)
					var ids = this.aliveIds();
					var edges = [];

					for (var i = 0; i < ids.length; i++)
					{
						var c = model.getCell(ids[i]);

						if (c != null && c.isEdge())
						{
							edges.push(c);
						}
					}

					if (edges.length == 0 || ids.length < 2)
					{
						return;
					}

					var edge = rand.pick(edges);
					var terminal = model.getCell(rand.pick(ids));

					if (terminal == null || terminal.isEdge() ||
						terminal == edge)
					{
						return;
					}

					var asSource = rand.int(2) == 0;
					graph.connectCell(edge, terminal, asSource);
					record(type, edge.getId() + ' ' +
						(asSource ? 'src' : 'tgt') + '->' +
						terminal.getId());
					break;
				}
				case 'setWaypoints':
				{
					// Sets or clears edge waypoints (geometry.points)
					var ids = this.aliveIds();
					var edges = [];

					for (var i = 0; i < ids.length; i++)
					{
						var c = model.getCell(ids[i]);

						if (c != null && c.isEdge() &&
							c.getGeometry() != null)
						{
							edges.push(c);
						}
					}

					if (edges.length == 0)
					{
						return;
					}

					var edge = rand.pick(edges);
					var geo = edge.getGeometry().clone();
					var count = rand.int(3);
					geo.points = [];

					for (var i = 0; i < count; i++)
					{
						geo.points.push(new client.win.mxPoint(
							20 + rand.int(600), 20 + rand.int(400)));
					}

					model.setGeometry(edge, geo);
					record(type, edge.getId() + ' points=' + count);
					break;
				}
				case 'groupCells':
				{
					// Groups 2-3 top-level vertices of the current page
					// (concurrent grouping races the parent chains)
					var ids = this.aliveIds();
					var candidates = [];
					var defaultParent = graph.getDefaultParent();

					for (var i = 0; i < ids.length; i++)
					{
						var c = model.getCell(ids[i]);

						if (c != null && c.isVertex() &&
							model.getParent(c) == defaultParent)
						{
							candidates.push(c);
						}
					}

					if (candidates.length < 2)
					{
						return;
					}

					var cells = [];
					var count = 2 + rand.int(2);

					while (cells.length < count && candidates.length > 0)
					{
						var idx = rand.int(candidates.length);
						cells.push(candidates.splice(idx, 1)[0]);
					}

					var id = this.newId(client.idx);
					var group = new client.win.mxCell('',
						new client.win.mxGeometry(), 'group');
					group.setId(id);
					group.setVertex(true);
					group.setConnectable(false);
					graph.groupCells(group, 20, cells);
					this.markers[id] = {deleted: false, conflict: false,
						group: true};
					record(type, id + ' <- ' + cells.map(function(c)
					{
						return c.getId();
					}).join(','));
					break;
				}
				case 'ungroupCells':
				{
					// Dissolves a group created by groupCells: children
					// move to the parent, the group cell is removed
					var groups = [];

					for (var gid in this.markers)
					{
						if (this.markers[gid].group &&
							!this.markers[gid].deleted)
						{
							var c = model.getCell(gid);

							if (c != null)
							{
								groups.push(c);
							}
						}
					}

					if (groups.length == 0)
					{
						return;
					}

					var group = switchToPageOf(rand.pick(groups).getId());

					if (group == null)
					{
						return;
					}

					graph.ungroupCells([group]);
					this.markers[group.getId()].deleted = true;
					record(type, group.getId());
					break;
				}
				case 'orderCell':
				{
					// z-order change: reorders the cell inside its
					// parent's child array (the previous-chain machine)
					var ids = this.aliveIds();

					if (ids.length == 0)
					{
						return;
					}

					var cell = switchToPageOf(rand.pick(ids));

					if (cell == null)
					{
						return;
					}

					var back = rand.int(2) == 0;
					graph.orderCells(back, [cell]);
					record(type, cell.getId() + (back ? ' back' : ' front'));
					break;
				}
				case 'movePage':
				{
					if (ui.pages.length < 2)
					{
						return;
					}

					var from = rand.int(ui.pages.length);
					var to = rand.int(ui.pages.length);

					if (from == to)
					{
						return;
					}

					ui.movePage(from, to);
					record(type, from + '->' + to);
					break;
				}
				case 'setStyle':
				{
					var ids = this.aliveIds();

					if (ids.length == 0)
					{
						return;
					}

					var cell = switchToPageOf(rand.pick(ids));

					if (cell == null)
					{
						return;
					}

					model.setStyle(cell, rand.pick(styles) + 'opacity=' +
						(50 + rand.int(50)) + ';');
					record(type, cell.getId());
					break;
				}
				case 'setGeometry':
				{
					var ids = this.aliveIds();

					if (ids.length == 0)
					{
						return;
					}

					var cell = switchToPageOf(rand.pick(ids));

					if (cell == null || cell.getGeometry() == null)
					{
						return;
					}

					var geo = cell.getGeometry().clone();
					geo.x = 10 + rand.int(700);
					geo.y = 10 + rand.int(500);
					model.setGeometry(cell, geo);
					record(type, cell.getId());
					break;
				}
				case 'setLabel':
				{
					var ids = this.aliveIds();

					if (ids.length == 0)
					{
						return;
					}

					var cell = switchToPageOf(rand.pick(ids));

					if (cell == null)
					{
						return;
					}

					model.setValue(cell, 'label-' + rand.int(10000));
					record(type, cell.getId());
					break;
				}
				case 'moveCell':
				{
					var ids = this.aliveIds();

					if (ids.length < 2)
					{
						return;
					}

					var cell = switchToPageOf(rand.pick(ids));
					var parent = model.getCell(rand.pick(ids));

					// Cross-parent move within the page; cycle check
					if (cell == null || parent == null || cell == parent ||
						!parent.isVertex() || model.isAncestor(cell, parent))
					{
						return;
					}

					model.add(parent, cell, model.getChildCount(parent));
					record(type, cell.getId() + ' under ' + parent.getId());
					break;
				}
				case 'deleteCell':
				{
					var ids = this.aliveIds();

					if (ids.length < 5)
					{
						return;
					}

					var id = rand.pick(ids);
					var cell = switchToPageOf(id);

					if (cell == null)
					{
						return;
					}

					// Marks the whole subtree as deleted for the liveness
					// assertion, plus dangling edges removed by the graph
					var removed = graph.removeCells([cell]);

					for (var i = 0; i < removed.length; i++)
					{
						var stack = [removed[i]];

						while (stack.length > 0)
						{
							var current = stack.pop();

							if (current.getId() != null &&
								this.markers[current.getId()] != null)
							{
								this.markers[current.getId()].deleted = true;
							}

							for (var j = 0; j < current.getChildCount(); j++)
							{
								stack.push(current.getChildAt(j));
							}
						}
					}

					record(type, id + ' removed=' + removed.length);
					break;
				}
				// A page delete under adversarial delivery: the random
				// mix only ever ADDED pages, so the interaction of a
				// removed page with crossing traffic was reachable in
				// scripted scenarios only
				case 'deletePage':
				{
					if (ui.pages.length < 3)
					{
						return;
					}

					var page = ui.pages[rand.int(ui.pages.length)];

					if (page == ui.currentPage)
					{
						return;
					}

					ui.updatePageRoot(page);
					var stack = (page.root != null) ? [page.root] : [];

					while (stack.length > 0)
					{
						var current = stack.pop();

						if (current.getId() != null &&
							this.markers[current.getId()] != null)
						{
							this.markers[current.getId()].deleted = true;
						}

						for (var j = 0; j < current.getChildCount(); j++)
						{
							stack.push(current.getChildAt(j));
						}
					}

					ui.removePage(page);
					record(type, page.getId());
					break;
				}
				// Collapse/expand writes alternateBounds and changes
				// what is rendered, and never met a remote patch
				case 'foldCell':
				{
					var ids = this.aliveIds();
					var candidates = [];

					for (var i = 0; i < ids.length; i++)
					{
						var hit = findCell(ids[i]);

						if (hit != null && hit.cell.isVertex() &&
							hit.cell.getChildCount() > 0)
						{
							candidates.push(ids[i]);
						}
					}

					if (candidates.length == 0)
					{
						return;
					}

					var id = rand.pick(candidates);
					var cell = switchToPageOf(id);

					if (cell == null)
					{
						return;
					}

					graph.foldCells(!graph.isCellCollapsed(cell),
						false, [cell]);
					record(type, id + ' collapsed=' +
						graph.isCellCollapsed(cell));
					break;
				}
				// A label child with RELATIVE geometry on an edge - the
				// only relative-geometry content the mix produced was
				// the scripted edge-label scenario
				case 'edgeLabel':
				{
					var ids = this.aliveIds();
					var edges = [];

					for (var i = 0; i < ids.length; i++)
					{
						var hit = findCell(ids[i]);

						if (hit != null && hit.cell.isEdge())
						{
							edges.push(ids[i]);
						}
					}

					if (edges.length == 0)
					{
						return;
					}

					var id = rand.pick(edges);
					var edge = switchToPageOf(id);

					if (edge == null)
					{
						return;
					}

					var labelId = this.newId(client.idx);
					var label = new client.win.mxCell('L' + labelId,
						new client.win.mxGeometry(rand.int(3) / 2 - 0.5, 0,
							0, 0), 'edgeLabel;html=1;');
					label.setId(labelId);
					label.setVertex(true);
					label.setConnectable(false);
					label.geometry.relative = true;
					graph.addCell(label, edge);
					this.markers[labelId] = {deleted: false, conflict: false};
					record(type, labelId + ' on ' + id);
					break;
				}
				case 'addPage':
				{
					if (ui.pages.length >= 6)
					{
						return;
					}

					ui.insertPage();
					record(type);
					break;
				}
				case 'switchPage':
				{
					ui.selectPage(rand.pick(ui.pages), true);
					record(type);
					break;
				}
				case 'renamePage':
				{
					var page = rand.pick(ui.pages);
					model.execute(new win.RenamePage(ui, page,
						'p-' + rand.int(1000)));
					record(type, page.getId());
					break;
				}
				case 'addStack':
				{
					var id = this.newId(client.idx);
					var stack = graph.insertVertex(null, id, 'List ' + id,
						20 + rand.int(500), 20 + rand.int(300), 140, 120,
						OpGenerator.STACK_STYLE);
					this.markers[id] = {deleted: false, conflict: false};

					for (var k = 0; k < 3; k++)
					{
						var cid = this.newId(client.idx);
						graph.insertVertex(stack, cid, 'Item ' + cid,
							0, 0, 140, 30, OpGenerator.STACK_ITEM_STYLE);
						this.markers[cid] = {deleted: false, conflict: false};
					}

					record(type, id);
					break;
				}
				case 'stackChild':
				{
					// Reorders, resizes, relabels or inserts inside an
					// existing stack container so the stack layout runs
					var ids = this.aliveIds();
					var stack = null;

					for (var k = 0; k < ids.length && stack == null; k++)
					{
						var hit = findCell(ids[k]);

						if (hit != null && hit.cell.getStyle() != null &&
							hit.cell.getStyle().indexOf(
								'childLayout=stackLayout') >= 0 &&
							hit.cell.getChildCount() > 0)
						{
							stack = switchToPageOf(ids[k]);
						}
					}

					if (stack == null)
					{
						return;
					}

					var kind = rand.pick(['reorder', 'resize',
						'relabel', 'insert']);
					var count = model.getChildCount(stack);

					if (kind == 'reorder' && count > 1)
					{
						model.add(stack, model.getChildAt(stack,
							rand.int(count)), rand.int(count));
					}
					else if (kind == 'resize')
					{
						var child = model.getChildAt(stack, rand.int(count));
						var geo = child.getGeometry();

						if (geo != null)
						{
							geo = geo.clone();
							geo.height = 20 + rand.int(40);
							model.setGeometry(child, geo);
						}
					}
					else if (kind == 'relabel')
					{
						model.setValue(model.getChildAt(stack,
							rand.int(count)), 'item-' + rand.int(10000));
					}
					else
					{
						var cid = this.newId(client.idx);
						graph.insertVertex(stack, cid, 'Item ' + cid,
							0, 0, 140, 30, OpGenerator.STACK_ITEM_STYLE);
						this.markers[cid] = {deleted: false, conflict: false};
					}

					record(type, stack.getId() + ' ' + kind);
					break;
				}
				case 'undo':
				{
					if (ui.editor.undoManager.canUndo())
					{
						ui.undo();
						// The undone op may resurrect or re-delete markers;
						// liveness for undo-affected ids is not asserted
						record(type);
					}
					break;
				}
				case 'redo':
				{
					if (ui.editor.undoManager.canRedo())
					{
						ui.redo();
						// Same liveness caveat as undo
						record(type);
					}
					break;
				}
			}
		}
		catch (e)
		{
			this.report.fail('op-exception', client.name + ' ' + type +
				': ' + e.message);
		}
	};

	// Conflicting concurrent edits: both clients target the same cell in
	// the same round before any flush
	OpGenerator.prototype.conflictOp = function(clientA, clientB)
	{
		var ids = this.aliveIds();

		if (ids.length == 0)
		{
			return;
		}

		var id = this.rand.pick(ids);
		this.markers[id].conflict = true;
		var self = this;

		[clientA, clientB].forEach(function(client, which)
		{
			try
			{
				var model = client.ui.editor.graph.getModel();
				var cell = null;

				for (var i = 0; i < client.ui.pages.length; i++)
				{
					client.ui.updatePageRoot(client.ui.pages[i]);
					var m = (client.ui.pages[i] == client.ui.currentPage) ?
						model : new client.win.mxGraphModel(
							client.ui.pages[i].root);

					if (m.getCell(id) != null)
					{
						if (client.ui.pages[i] != client.ui.currentPage)
						{
							client.ui.selectPage(client.ui.pages[i], true);
						}

						cell = model.getCell(id);
						break;
					}
				}

				if (cell == null)
				{
					return;
				}

				var kind = self.rand.pick(['style', 'label', 'geo', 'delete']);

				if (kind == 'style')
				{
					model.setStyle(cell, 'rounded=' + which +
						';fillColor=' + (which == 0 ? '#ff0000' : '#00ff00') + ';');
				}
				else if (kind == 'label')
				{
					model.setValue(cell, 'conflict-' + which);
				}
				else if (kind == 'geo' && cell.getGeometry() != null)
				{
					var geo = cell.getGeometry().clone();
					geo.x = (which + 1) * 100;
					model.setGeometry(cell, geo);
				}
				else if (kind == 'delete' && which == 0)
				{
					// Delete vs concurrent edit on the other client
					var removed = client.ui.editor.graph.removeCells([cell]);
					var removedIds = [];

					for (var i = 0; i < removed.length; i++)
					{
						removedIds.push(removed[i].getId());

						if (self.markers[removed[i].getId()] != null)
						{
							self.markers[removed[i].getId()].conflict = true;
						}
					}

					client.report.log('op c' + client.idx +
						' conflict-delete ' + id + ' removed=' +
						JSON.stringify(removedIds).substring(0, 200));
				}

				if (kind != 'delete')
				{
					client.report.log('op c' + client.idx +
						' conflict-' + kind + ' ' + id);
				}

				self.report.stats.ops['conflict'] =
					(self.report.stats.ops['conflict'] || 0) + 1;
			}
			catch (e)
			{
				self.report.fail('conflict-exception',
					client.name + ': ' + e.message);
			}
		});
	};

	// --- Assertions -------------------------------------------------------
	function Asserter(clients, generator, report)
	{
		this.clients = clients;
		this.generator = generator;
		this.report = report;
	};

	Asserter.prototype.assertConvergence = function(context)
	{
		var xml = [];
		var hashes = [];

		for (var i = 0; i < this.clients.length; i++)
		{
			try
			{
				xml.push(this.clients[i].getCanonicalXml());
				hashes.push(this.clients[i].getPagesHash());
			}
			catch (e)
			{
				this.report.fail('canonicalize-exception',
					this.clients[i].name + ': ' + e.message);

				return;
			}
		}

		for (var i = 1; i < this.clients.length; i++)
		{
			if (hashes[i] != hashes[0])
			{
				this.report.fail('divergence-hash', context + ': client0=' +
					hashes[0] + ' ' + this.clients[i].name + '=' + hashes[i]);
			}

			if (xml[i] != xml[0])
			{
				this.report.fail('divergence-xml', context + ': ' +
					this.clients[i].name + ' differs from client0: ' +
					this.firstDiff(xml[0], xml[i]));
			}
		}
	};

	Asserter.prototype.firstDiff = function(a, b)
	{
		var idx = 0;

		while (idx < a.length && idx < b.length && a[idx] == b[idx])
		{
			idx++;
		}

		return '...' + a.substring(Math.max(0, idx - 60), idx + 120) +
			'... vs ...' + b.substring(Math.max(0, idx - 60), idx + 120) + '...';
	};

	Asserter.prototype.assertSnapshotInvariant = function(context)
	{
		for (var i = 0; i < this.clients.length; i++)
		{
			var client = this.clients[i];

			if (client.sync.localFileWasChanged)
			{
				continue;
			}

			try
			{
				var diff = client.ui.diffPages(client.sync.snapshot,
					client.ui.pages);

				if (!client.win.mxUtils.isEmptyObject(diff))
				{
					this.report.fail('snapshot-drift', context + ': ' +
						client.name + ': ' + JSON.stringify(diff).substring(0, 500));
				}
			}
			catch (e)
			{
				this.report.fail('snapshot-diff-exception',
					client.name + ': ' + e.message);
			}
		}
	};

	Asserter.prototype.assertRealtimeAlignment = function(context)
	{
		for (var i = 0; i < this.clients.length; i++)
		{
			var client = this.clients[i];

			try
			{
				var ownDiff = client.ui.diffPages(client.file.ownPages,
					client.ui.pages);
				var theirDiff = client.ui.diffPages(client.file.theirPages,
					client.file.ownPages);

				if (!client.win.mxUtils.isEmptyObject(ownDiff))
				{
					this.report.fail('ownpages-misaligned', context + ': ' +
						client.name + ': ' +
						JSON.stringify(ownDiff).substring(0, 500));
				}

				if (!client.win.mxUtils.isEmptyObject(theirDiff))
				{
					this.report.fail('theirpages-misaligned', context + ': ' +
						client.name + ': ' +
						JSON.stringify(theirDiff).substring(0, 500));
				}
			}
			catch (e)
			{
				this.report.fail('alignment-exception',
					client.name + ': ' + e.message);
			}
		}
	};

	// Checksum divergence heals itself: sync.merge answers a mismatch by
	// reloading, so no merge-error hook fires and every content verdict
	// runs on the healed state. The reload count was recorded and read
	// nowhere, which left the primary detector for "the exact patch
	// paths invented something" switched off - the first attempt at the
	// terminal sanitizer was caught only because its reload storm
	// happened to hit the run timeout. A reload is a regression, not an
	// event: scenarios that legitimately expect one set reloadBudget.
	Asserter.prototype.assertNoReloads = function(budget, context)
	{
		var reloads = this.report.stats.reloads || 0;
		budget = (budget != null) ? budget : 0;

		if (reloads > budget)
		{
			this.report.fail('checksum-reload', context + ': ' + reloads +
				' reload(s) over a budget of ' + budget + ' - a checksum ' +
				'mismatch healed itself and every content verdict then ran ' +
				'on the healed state');
		}
	};

	// The persisted file is the only thing that outlives the session,
	// and every other verdict compares live clients to EACH OTHER: a
	// save that consistently omits or scrambles content produces
	// receivers that agree with the sender, so the whole suite stays
	// green. Reads the bytes back the way a client opening the file
	// tomorrow would.
	Asserter.prototype.assertSavedFile = function(broker, context)
	{
		var data = (broker != null) ? broker.lastSavedData : null;

		if (data == null)
		{
			// Nothing was ever saved in this scenario
			return;
		}

		var client = this.clients[0];

		try
		{
			var cold = client.getCanonicalContent(
				client.ui.getPagesForXml(data));
			var live = client.getCanonicalContent(client.ui.pages);
			var parsed = RtTestBackend.parse(client, data);
			if (parsed.vars !== client.ui.fileNode.getAttribute('vars'))
			{
				this.report.fail('saved-vars', context + ': persisted vars differ from the visible file');
			}

			if (cold != live)
			{
				this.report.fail('saved-file', context + ': the persisted ' +
					'file does not hold the converged document\n  file: ' +
					cold.substring(0, 700) + '\n  live: ' +
					live.substring(0, 700));
			}
		}
		catch (e)
		{
			this.report.fail('saved-file', context +
				': reading the persisted file back failed: ' + e.message);
		}
	};

	// The viewed page must be part of the document. A currentPage that
	// left ui.pages is a phantom: it still renders and accepts edits,
	// but those edits belong to no page in any diff, so they reach
	// neither a flush nor a save and are dropped without a trace the
	// moment an incoming patch heals the dangling reference. Cheap
	// enough to run everywhere, and it guards the whole class rather
	// than the one replay that first produced it.
	Asserter.prototype.assertCurrentPage = function(context)
	{
		for (var i = 0; i < this.clients.length; i++)
		{
			var client = this.clients[i];
			var current = client.ui.currentPage;

			if (current == null)
			{
				this.report.fail('phantom-current-page', context + ': ' +
					client.name + ': no current page');
			}
			else if (client.win.mxUtils.indexOf(
				client.ui.pages, current) < 0)
			{
				var ids = [];

				for (var k = 0; k < client.ui.pages.length; k++)
				{
					ids.push(client.ui.pages[k].getId());
				}

				this.report.fail('phantom-current-page', context + ': ' +
					client.name + ': the viewed page ' + current.getId() +
					' is not in ui.pages [' + ids.join(',') + '] - edits ' +
					'made there reach no flush and no save');
			}
		}
	};

	// The echo detector: after quiescence, additional flush and cleanup
	// rounds must produce no outgoing messages and no visible patches.
	Asserter.prototype.assertNoEcho = function(broker, rounds)
	{
		var self = this;

		return new Promise(function(resolve)
		{
			var round = 0;

			function step()
			{
				if (round++ >= rounds)
				{
					resolve();

					return;
				}

				broker.capture = [];

				for (var i = 0; i < self.clients.length; i++)
				{
					try
					{
						self.clients[i].flush();
						self.clients[i].cleanupNow();
					}
					catch (e)
					{
						self.report.fail('echo-probe-exception',
							self.clients[i].name + ': ' + e.message);
					}
				}

				window.setTimeout(function()
				{
					if (broker.capture.length > 0)
					{
						for (var i = 0; i < broker.capture.length; i++)
						{
							self.report.fail('echo', 'idle round ' + round +
								': client' + broker.capture[i].from +
								' sent ' + JSON.stringify(
									broker.capture[i].msg.c).substring(0, 500));
						}
					}

					broker.capture = null;
					step();
				}, 50);
			};

			step();
		});
	};

	Asserter.prototype.assertMarkers = function()
	{
		var markers = this.generator.markers;

		for (var id in markers)
		{
			if (markers[id].conflict)
			{
				// Conflict targets only need consistency, covered by the
				// convergence assertion
				continue;
			}

			var present = 0;

			for (var i = 0; i < this.clients.length; i++)
			{
				var found = false;
				var ui = this.clients[i].ui;

				for (var p = 0; p < ui.pages.length && !found; p++)
				{
					ui.updatePageRoot(ui.pages[p]);
					var m = new this.clients[i].win.mxGraphModel(
						ui.pages[p].root);
					found = m.getCell(id) != null;
				}

				if (found)
				{
					present++;
				}
			}

			// Undo can legitimately remove a marker on all clients; a
			// marker present on some but not all clients is divergence
			if (present != 0 && present != this.clients.length)
			{
				this.report.fail('marker-partial', id + ' present on ' +
					present + '/' + this.clients.length +
					' clients (deleted=' + markers[id].deleted + ')');
			}
		}
	};

	// The models converging is not enough - the screens must show them.
	// Every visible cell of the current page needs a view state, edges
	// whose ends are determined (terminal or terminal point per end)
	// must render with non-null endpoints, and no state may survive
	// for a cell that left the model. A repair or patch that mutates
	// without invalidation leaves a stale screen on ONE client while
	// the peers render the same model correctly - the invisible-edge
	// manual find that model-level verdicts can never see.
	// An end that is neither a terminal nor a point cannot be drawn.
	// The check needs no view state, so it runs over EVERY page rather
	// than only the one that happens to be current at the end of a
	// scenario - an unrenderable edge on another page is just as
	// invisible to the user and rides into the saved file unnoticed.
	Asserter.prototype.assertRenderableEdges = function(context)
	{
		for (var i = 0; i < this.clients.length; i++)
		{
			var client = this.clients[i];
			var pages = client.ui.pages;

			for (var p = 0; p < pages.length; p++)
			{
				client.ui.updatePageRoot(pages[p]);

				if (pages[p].root == null)
				{
					continue;
				}

				var pm = new client.win.mxGraphModel(pages[p].root);

				for (var id in pm.cells)
				{
					var cell = pm.cells[id];

					if (!cell.isEdge())
					{
						continue;
					}

					var geo = cell.getGeometry();
					var srcOk = cell.getTerminal(true) != null ||
						(geo != null && geo.getTerminalPoint(true) != null);
					var trgOk = cell.getTerminal(false) != null ||
						(geo != null && geo.getTerminalPoint(false) != null);

					if (!srcOk || !trgOk)
					{
						this.report.fail('render-consistency', context +
							': ' + client.name + ' edge ' + id + ' on page ' +
							pages[p].getId() + ' has an undetermined end ' +
							'(src=' + (srcOk ? 'ok' : 'MISSING') + ' trg=' +
							(trgOk ? 'ok' : 'MISSING') + ') - unrenderable');
					}
				}
			}
		}
	};

	Asserter.prototype.assertRenderConsistency = function(context)
	{
		for (var i = 0; i < this.clients.length; i++)
		{
			var client = this.clients[i];
			var graph = client.ui.editor.graph;
			var model = graph.getModel();
			var view = graph.view;
			var report = this.report;

			var hiddenByCollapse = function(cell)
			{
				var parent = model.getParent(cell);

				while (parent != null)
				{
					if (graph.isCellCollapsed(parent))
					{
						return true;
					}

					parent = model.getParent(parent);
				}

				return false;
			};

			for (var id in model.cells)
			{
				var cell = model.cells[id];

				if ((!model.isVertex(cell) && !model.isEdge(cell)) ||
					!graph.isCellVisible(cell) || hiddenByCollapse(cell))
				{
					continue;
				}

				var state = view.getState(cell);

				if (model.isVertex(cell))
				{
					if (state == null)
					{
						report.fail('render-consistency', context + ': ' +
							client.name + ' does not render vertex ' + id);
					}
				}
				else
				{
					var geo = cell.getGeometry();
					var srcOk = cell.getTerminal(true) != null ||
						(geo != null && geo.getTerminalPoint(true) != null);
					var trgOk = cell.getTerminal(false) != null ||
						(geo != null && geo.getTerminalPoint(false) != null);

					// An end that is neither a terminal nor a point is
					// UNRENDERABLE: the edge vanishes from the screen
					// while the model stays consistent everywhere, so
					// no convergence verdict can see it (manual find -
					// a sanitizer nulled the terminal without leaving
					// a point behind)
					if (!srcOk || !trgOk)
					{
						report.fail('render-consistency', context + ': ' +
							client.name + ' edge ' + id +
							' has an undetermined end (src=' +
							(srcOk ? 'ok' : 'MISSING') + ' trg=' +
							(trgOk ? 'ok' : 'MISSING') + ') - unrenderable');
					}

					if (srcOk && trgOk)
					{
						var pts = (state != null) ?
							state.absolutePoints : null;

						if (state == null || pts == null ||
							pts.length < 2 || pts[0] == null ||
							pts[pts.length - 1] == null)
						{
							// M/m = in the cells map, C/c = in the
							// parent's children array: distinguishes a
							// half-attached cell (parent set, missing
							// from children - a tree walk never
							// reaches it) from a stale map (wrapper
							// patch raced a page switch)
							var diag = function(x)
							{
								var p = x.getParent();

								return ((model.cells[x.getId()] == x) ?
									'M' : 'm') + ((p == null) ? '-' :
									((p.children != null &&
										p.children.indexOf(x) >= 0) ?
										'C' : 'c'));
							};
							var src = cell.getTerminal(true);
							var trg = cell.getTerminal(false);

							// Full ancestor chain (id + Edge/Vertex/
							// Root marker, ! = invisible): a walk skip
							// self-explains via the chain, eg. an edge
							// reparented under another edge
							var chainStr = function(x)
							{
								var out = [];

								while (x != null && out.length < 12)
								{
									out.push(x.getId() +
										(model.isEdge(x) ? 'E' :
											(model.isVertex(x) ?
												'V' : 'R')) +
										(x.isVisible() ? '' : '!'));
									x = x.getParent();
								}

								return out.join('<');
							};

							// Distinguishes a LOST invalidation (a
							// forced revalidate heals the state) from
							// a systematic walk skip (it does not)
							var heals = false;
							var forcedCreate = false;
							var rootSync = view.currentRoot == null ||
								view.currentRoot == model.getRoot();

							try
							{
								view.invalidate(cell, true, true);
								view.validate();
								heals = view.getState(cell) != null;

								// getState with create separates a walk
								// that never visits the cell (forced
								// create succeeds) from a blocked state
								// creation (it stays null too)
								if (!heals)
								{
									forcedCreate = view.getState(
										cell, true) != null;
									view.removeState(cell);
								}
							}
							catch (e) {}

							// Twin detection: does ANY object of this
							// id own a state after the validate, and
							// does the model API see the cell where
							// the raw children array does?
							var twinStates = 0;
							var twinSame = false;
							view.states.visit(function(k, st)
							{
								if (st.cell != null &&
									st.cell.getId() == id)
								{
									twinStates++;
									twinSame = twinSame ||
										st.cell == cell;
								}
							});
							var par = cell.getParent();
							var childAt = -1;

							for (var ci = 0; par != null &&
								ci < model.getChildCount(par); ci++)
							{
								if (model.getChildAt(par, ci) == cell)
								{
									childAt = ci;
									break;
								}
							}

							report.fail('render-consistency', context +
								': ' + client.name +
								' does not render edge ' + id +
								' (model has both ends; state=' +
								(state != null) + ' pts=' +
								((pts != null) ? pts.length + ',' +
									(pts[0] != null) + ',' +
									(pts[pts.length - 1] != null) :
									'n/a') + ' edge=' + diag(cell) +
								' src=' + ((src != null) ?
									diag(src) : '-') +
								' trg=' + ((trg != null) ?
									diag(trg) : '-') +
								' healsOnRevalidate=' + heals +
								' forcedCreate=' + forcedCreate +
								' rootSync=' + rootSync +
								' twinStates=' + twinStates + ',' +
								twinSame + ' childAt=' + childAt +
								' chain=' + chainStr(cell) + ')');
						}
					}
				}
			}

			// Stale ghosts: a state whose cell left the model
			view.states.visit(function(key, state)
			{
				var cell = state.cell;

				if (cell != null && (model.isVertex(cell) ||
					model.isEdge(cell)) && cell.getId() != null &&
					model.getCell(cell.getId()) != cell)
				{
					var walker = cell;

					while (walker.getParent() != null)
					{
						walker = walker.getParent();
					}

					report.fail('render-consistency', context + ': ' +
						client.name + ' renders stale ghost ' +
						cell.getId() + ' (inMap=' +
						(model.cells[cell.getId()] != null) +
						' attached=' + (walker == model.getRoot()) + ')');
				}
			});
		}
	};

	// Asserts that the given stack container in the client's SAVED file
	// data is layout-consistent: mxStackLayout emits monotonically
	// increasing y in child order, so XML child order and geometry order
	// must agree. The 2026-07-23 incident wrote order Item1,Item3,Item2
	// with y 30,90,60 - a combination no stack layout run can produce.
	function assertSavedStackConsistent(client, stackId, report, context)
	{
		try
		{
			var pages = client.ui.getPagesForXml(client.file.getData());
			var stack = null;

			for (var i = 0; i < pages.length && stack == null; i++)
			{
				stack = new client.win.mxGraphModel(
					pages[i].root).getCell(stackId);
			}

			if (stack == null)
			{
				report.fail(context, 'stack ' + stackId +
					' not in saved data');

				return;
			}

			var children = [];

			for (var i = 0; i < stack.getChildCount(); i++)
			{
				var child = stack.getChildAt(i);
				children.push({id: child.getId(), y: (child.getGeometry() !=
					null) ? child.getGeometry().y : 0});
			}

			for (var i = 1; i < children.length; i++)
			{
				if (children[i].y <= children[i - 1].y)
				{
					report.fail(context, 'stack ' + stackId + ' saved XML ' +
						'order does not match stack geometry: ' +
						JSON.stringify(children));

					return;
				}
			}

			report.log('saved stack ' + stackId + ' consistent: ' +
				JSON.stringify(children));
		}
		catch (e)
		{
			report.fail(context, 'saved data check failed: ' + e.message);
		}
	};

	// Asserts that the client's ownPages contain the given stack with a
	// layout-consistent child sequence and, for every touched cell id,
	// the same order, geometry and value as the visible pages. Untouched
	// unsaved remote siblings may legitimately be absent from ownPages
	// (adoption is per referenced cell plus its ancestor chain).
	// skipLayoutCheck skips the y-monotonicity check on the own copy:
	// right after merging a save whose sender had adopted only part of
	// the stack, the position of untouched local-only children can be
	// interleaved until the next cleanup runs the layout on the result.
	function assertOwnStackAdopted(client, stackId, touchedIds, report, context, skipLayoutCheck)
	{
		try
		{
			var win = client.win;

			function findStack(pages)
			{
				for (var i = 0; i < pages.length; i++)
				{
					var cell = new win.mxGraphModel(
						pages[i].root).getCell(stackId);

					if (cell != null)
					{
						return cell;
					}
				}

				return null;
			};

			function describe(stack, ids)
			{
				var result = [];

				for (var i = 0; i < stack.getChildCount(); i++)
				{
					var child = stack.getChildAt(i);

					if (ids == null || ids.indexOf(child.getId()) >= 0)
					{
						result.push({id: child.getId(),
							y: (child.getGeometry() != null) ?
								child.getGeometry().y : null,
							value: child.getValue()});
					}
				}

				return result;
			};

			var ownStack = findStack(client.file.ownPages);
			var uiStack = findStack(client.ui.pages);

			if (ownStack == null || uiStack == null)
			{
				report.fail(context, 'stack ' + stackId + ' missing: own=' +
					(ownStack != null) + ' ui=' + (uiStack != null));

				return;
			}

			// Layout consistency of the own copy: y increases in child order
			var all = describe(ownStack, null);

			if (!skipLayoutCheck)
			{
				for (var i = 1; i < all.length; i++)
				{
					if (all[i].y <= all[i - 1].y)
					{
						report.fail(context, 'ownPages stack ' + stackId +
							' XML order does not match stack geometry: ' +
							JSON.stringify(all));

						break;
					}
				}
			}

			// Touched cells: same order, geometry and value as on screen
			var own = JSON.stringify(describe(ownStack, touchedIds));
			var ui = JSON.stringify(describe(uiStack, touchedIds));

			if (own != ui)
			{
				report.fail(context, 'ownPages diverged from ui.pages ' +
					'for touched cells: own=' + own + ' ui=' + ui);
			}
			else
			{
				report.log('own stack ' + stackId + ' adopted: ' +
					JSON.stringify(all));
			}
		}
		catch (e)
		{
			report.fail(context, 'own stack check failed: ' + e.message);
		}
	};

	// Asserts that B's adoption-race edits survived in the given pages:
	// ai1 carries the label 'Item X' and ai2 precedes ai1 below as0.
	// Used against ui.pages and against parsed saved file data.
	function assertStackIntent(win, pages, report, context)
	{
		try
		{
			var stack = null;

			for (var i = 0; i < pages.length && stack == null; i++)
			{
				stack = new win.mxGraphModel(pages[i].root).getCell('as0');
			}

			if (stack == null)
			{
				report.fail(context, 'stack as0 missing');

				return;
			}

			var order = [];
			var label = null;

			for (var i = 0; i < stack.getChildCount(); i++)
			{
				var child = stack.getChildAt(i);
				order.push(child.getId());

				if (child.getId() == 'ai1')
				{
					label = child.getValue();
				}
			}

			var failed = false;

			if (label != 'Item X')
			{
				report.fail(context, 'label of ai1 reverted: ' +
					JSON.stringify(label));
				failed = true;
			}

			if (order.indexOf('ai2') < 0 || order.indexOf('ai1') < 0 ||
				order.indexOf('ai2') > order.indexOf('ai1'))
			{
				report.fail(context, 'reorder of ai2 before ai1 reverted: ' +
					JSON.stringify(order));
				failed = true;
			}

			if (!failed)
			{
				report.log(context + ' intent preserved: ' +
					JSON.stringify(order));
			}
		}
		catch (e)
		{
			report.fail(context, 'intent check failed: ' + e.message);
		}
	};

	// Deterministic repro of the 2026-07-23 ownPages ROOT CAUSE: A
	// inserts a stackLayout List container and does NOT save, B reorders
	// and relabels the unsaved remote children WITHOUT changing the
	// container geometry (a child resize would grow the resizeParent
	// container, adding the container itself to B's diff and masking the
	// ancestor gap). B's sendLocalChanges must adopt the container chain
	// into ownPages (resolveCrossReferences); pre-fix the adopted child
	// inserts were dropped by patchPages because their parent was never
	// adopted ("Updated cell not found"), so ownPages silently lost the
	// updates, later saves persisted a layout-inconsistent state (XML
	// order vs stack geometry) and idle cleanups visibly reverted the
	// reorder on B's screen.
	async function runAdoptionRace(clients, broker, report)
	{
		var resumeAutosaves = RtTestBackend.pauseAutosaves(clients);
		try
		{
		var A = clients[0];
		var B = clients[1];

		// Both clients stay on the first page so the layout manager
		// reacts on the live model of the affected page
		A.ui.selectPage(A.ui.pages[0], true);
		B.ui.selectPage(B.ui.pages[0], true);

		// Phase 1: A inserts the List container with three items and
		// flushes the live diff WITHOUT saving: the cells reach B's
		// ui.pages/theirPages but neither client's shadow, and ownPages
		// only on A
		var graphA = A.ui.editor.graph;
		var stack = graphA.insertVertex(null, 'as0', 'List',
			40, 40, 140, 120, OpGenerator.STACK_STYLE);
		graphA.insertVertex(stack, 'ai0', 'Item 1', 0, 0, 140, 30,
			OpGenerator.STACK_ITEM_STYLE);
		graphA.insertVertex(stack, 'ai1', 'Item 2', 0, 0, 140, 30,
			OpGenerator.STACK_ITEM_STYLE);
		graphA.insertVertex(stack, 'ai2', 'Item 3', 0, 0, 140, 30,
			OpGenerator.STACK_ITEM_STYLE);
		A.flush();
		await RtTestBackend.drain(broker);

		var modelB = B.ui.editor.graph.getModel();
		var stackB = modelB.getCell('as0');

		if (stackB == null || modelB.getChildCount(stackB) < 3)
		{
			report.fail('adoption-race-setup',
				'stack not delivered to client1');

			return;
		}

		// Phase 2: B reorders and relabels the unsaved remote children
		// (the incident op mix; ai0 is deliberately untouched so the
		// per-cell adoption granularity is exercised too)
		modelB.beginUpdate();
		try
		{
			modelB.add(stackB, modelB.getCell('ai2'), 1);
			modelB.setValue(modelB.getCell('ai1'), 'Item X');
		}
		finally
		{
			modelB.endUpdate();
		}

		B.flush();

		// Regression gate: after the flush B's ownPages must contain the
		// adopted container chain with the updates applied; a missing or
		// inconsistent own copy here IS the incident state (dropped
		// updates -> inconsistent saved file + visible cleanup revert)
		assertOwnStackAdopted(B, 'as0', ['ai1', 'ai2'],
			report, 'adoption-drift');

		await RtTestBackend.drain(broker);

		// Phase 3: B saves FIRST (before the creator A ever saved): the
		// adopted cells must be part of B's save and the saved stack
		// must be layout-consistent
		await B.mustCommit(0);
		assertSavedStackConsistent(B, 'as0', report, 'adoption-save');
		await RtTestBackend.drain(broker);

		// Phase 4: A merged B's save above. The save-patch inserts of
		// as0/ai1/ai2 collide with A's pending local copies of the same
		// cells and must be merged into them: previously the colliding
		// inserts were ignored, A's stale copies survived in ownPages
		// and A's next save reverted B's reorder and relabel (last-save-
		// wins ping-pong that converged on the stale state). The own
		// copy may be transiently layout-inconsistent here as B's save
		// does not contain the untouched ai0, whose position interleaves
		// until the next cleanup runs the layout, hence skipLayoutCheck.
		assertOwnStackAdopted(A, 'as0', ['ai1', 'ai2'],
			report, 'merge-adopted', true);

		// A saves in quiescence: B's changes must survive in the saved
		// data and on B's screen after B merges A's save
		await A.mustCommit(0);
		assertStackIntent(A.win, A.ui.getPagesForXml(A.file.getData()),
			report, 'creator-save-intent');
		await RtTestBackend.drain(broker);
		assertStackIntent(B.win, B.ui.pages, report, 'merged-save-intent');

		// Phase 5: idle cleanups reconcile the visible documents with
		// the own pages and the stack layout heals the transient ai0
		// interleave; the healed state must save layout-consistent with
		// the intent intact on both clients
		if (!A.file.isModified())
		{
			A.cleanupNow();
		}

		if (!B.file.isModified())
		{
			B.cleanupNow();
		}

		await RtTestBackend.drain(broker);
		await A.mustCommit(0);
		assertSavedStackConsistent(A, 'as0', report, 'creator-final-save');
		await RtTestBackend.drain(broker);
		assertStackIntent(A.win, A.ui.pages, report, 'a-final-intent');
		assertStackIntent(B.win, B.ui.pages, report, 'b-final-intent');
		}
		finally { resumeAutosaves(); }
	};

	// Deterministic repro of the page-loss class in patchPages: when an
	// explicit page move claims the same predecessor that an existing
	// page follows implicitly, the chain walk never reaches the
	// displaced page and DROPS it from the rebuilt pages array (the
	// candidate root cause of the lossy single-pass cleanup finding).
	// Crossing page moves with entangled previous chains lose one page
	// on EACH client pre-rebuild; the canonical page-order rebuild
	// keeps every page (losslessness), while cross-client ORDER still
	// converges via the save cycle like today (asserted at fixpoint by
	// the standard verdicts, not pre-save).
	async function runPageOrderRace(clients, broker, report)
	{
		var A = clients[0];
		var B = clients[1];

		function pageIds(client)
		{
			var result = [];

			for (var i = 0; i < client.ui.pages.length; i++)
			{
				result.push(client.ui.pages[i].getId());
			}

			return result;
		};

		// Phase 0: A adds two pages and saves so all four pages are in
		// both clients' shadow, own and visible pages
		A.ui.insertPage();
		A.ui.insertPage();
		A.flush();
		await broker.drain();
		await sleep(120);
		await A.save(0);
		await broker.drain();
		await sleep(120);

		var idsA = pageIds(A);
		var idsB = pageIds(B);

		if (idsA.length != 4 || idsA.join(',') != idsB.join(','))
		{
			report.fail('page-order-race-setup', 'clients not aligned on ' +
				'4 pages: A=' + idsA.join(',') + ' B=' + idsB.join(','));

			return;
		}

		// Phase 1: entangled crossing moves. A moves the LAST page to
		// index 1 (its explicit previous claims page 0, displacing page
		// 1 whose follower entry also becomes explicit); B moves page 1
		// to the end. The resulting diffs pin overlapping chains, so
		// the pre-rebuild walk drops a page on each side.
		A.ui.movePage(3, 1);
		B.ui.movePage(1, 3);
		A.flush();
		B.flush();
		await broker.drain();
		await sleep(120);

		// Regression gate: no page may be lost on either client after
		// cross-delivery (order divergence is legal pre-save)
		[A, B].forEach(function(client)
		{
			var ids = pageIds(client).slice();
			ids.sort();
			var expected = idsA.slice();
			expected.sort();

			if (ids.join(',') != expected.join(','))
			{
				report.fail('page-loss', client.name + ' lost pages after ' +
					'crossing moves: has ' + pageIds(client).join(',') +
					' expected set ' + expected.join(','));
			}
		});

		// Phase 2: also exercise own pages through the same path (the
		// flush patched ownPages via patchPages above) and let the
		// standard quiescence converge the order; saved data must keep
		// all four pages
		await B.save(0);
		await broker.drain();
		await sleep(120);

		try
		{
			var savedPages = B.ui.getPagesForXml(B.file.getData());

			if (savedPages == null || savedPages.length != 4)
			{
				report.fail('page-loss-save', 'saved data has ' +
					((savedPages != null) ? savedPages.length : 0) +
					' pages, expected 4');
			}
		}
		catch (e)
		{
			report.fail('page-loss-save', 'saved data check failed: ' +
				e.message);
		}
	};

	// Asserts that the adopted page carries B's edit: the page with the
	// given id must contain cell pb1 labelled 'Adopted'. Used against
	// ownPages and against parsed saved file data.
	function assertAdoptedPage(win, pages, pid, report, context)
	{
		try
		{
			var page = null;

			for (var i = 0; i < pages.length; i++)
			{
				if (pages[i].getId() == pid)
				{
					page = pages[i];
					break;
				}
			}

			if (page == null)
			{
				report.fail(context, 'adopted page ' + pid + ' missing');

				return;
			}

			var cell = new win.mxGraphModel(page.root).getCell('pb1');

			if (cell == null || cell.getValue() != 'Adopted')
			{
				report.fail(context, 'adopted page content reverted: pb1=' +
					((cell != null) ? JSON.stringify(cell.getValue()) :
					'missing'));
			}
			else
			{
				report.log(context + ' adopted content preserved');
			}
		}
		catch (e)
		{
			report.fail(context, 'adopted page check failed: ' + e.message);
		}
	};

	// Deterministic repro of the page-level pending-insert re-merge
	// (adopted-page ping-pong): A inserts a page and does NOT save, so
	// the page stays a pending page insert in A's shadow-vs-own diff.
	// B receives it live, adopts it by editing its content, moves it
	// to the front and saves. A's merge applies B's save patches with
	// merge semantics, but pre-fix the re-asserted pending patch still
	// carried A's page insert entry and insertPage merges colliding
	// entries: the STALE local copy of the adopted page was merged
	// back over the applied save (diffPages against A's copy removes
	// B's cells), and A's next save reverted B's changes. The page
	// move guards the rebuild constraints: pending page inserts are
	// position-inert, so a stale page-ORDER revert after the merge is
	// a regression, never residual behavior.
	async function runPageAdoptionRace(clients, broker, report)
	{
		var A = clients[0];
		var B = clients[1];

		function pageIds(pages)
		{
			var result = [];

			for (var i = 0; i < pages.length; i++)
			{
				result.push(pages[i].getId());
			}

			return result;
		};

		// Phase 0: aligned two-page base in shadow, own and visible
		// pages of both clients
		A.ui.insertPage();
		A.flush();
		await broker.drain();
		await sleep(120);
		await A.save(0);
		await broker.drain();
		await sleep(120);

		// Phase 1: A inserts page P and flushes WITHOUT saving: P
		// reaches B's visible pages but stays a pending page insert
		// on A (shadow has no P), then A returns to the first page
		A.ui.insertPage();
		var pid = A.ui.pages[A.ui.pages.length - 1].getId();
		A.ui.selectPage(A.ui.pages[0], true);
		A.flush();
		await broker.drain();
		await sleep(120);

		var idxB = pageIds(B.ui.pages).indexOf(pid);

		if (idxB < 0)
		{
			report.fail('page-adoption-setup', 'page ' + pid +
				' not delivered to client1');

			return;
		}

		// Phase 2: B adopts P by editing its content, moves it to the
		// front and saves: the save carries B's page content and
		// explicit previous references for the moved pages
		B.ui.selectPage(B.ui.pages[idxB], true);
		B.ui.editor.graph.insertVertex(null, 'pb1', 'Adopted',
			40, 40, 120, 40);
		B.ui.movePage(idxB, 0);
		B.flush();
		await broker.drain();
		await sleep(120);
		await B.save(0);
		await broker.drain();
		await sleep(120);

		// Phase 3: asserts on A directly after the merge, before any
		// further flush or save: B's content and page order must
		// survive in A's own pages
		assertAdoptedPage(A.win, A.file.ownPages, pid, report,
			'merged-own-content');

		var ownOrder = pageIds(A.file.ownPages);

		if (ownOrder[0] != pid)
		{
			report.fail('merged-own-order', 'stale page order revert: ' +
				ownOrder.join(','));
		}

		// Phase 4: A saves - the file must keep B's adopted content
		// (pre-fix this save persisted the stale copy)
		await A.save(0);
		await broker.drain();
		await sleep(120);
		assertAdoptedPage(A.win, A.ui.getPagesForXml(A.file.getData()),
			pid, report, 'creator-save-content');
	};

	// A crossing save contains the creator's old copy of an unsaved
	// page. The adopter's newer edits are inside a pending PAGE insert,
	// so a cell-insert-only freshness guard cannot preserve them.
	async function runPageAdoptionEditRace(clients, broker, report)
	{
		var A = clients[0];
		var B = clients[1];
		report.pageAdoptionEditExpected = [];

		for (var phase = 0; phase < 8; phase++)
		{
			var labelEdit = phase < 2 || phase == 6;
			var liveFirst = phase % 2 == 1;
			var id = 'pae' + phase;
			A.ui.insertPage();
			var pid = A.ui.currentPage.getId();
			var graphA = A.ui.editor.graph;
			graphA.insertVertex(null, id, 'old', 40, 40, 80, 40,
				'fillColor=#ffffff;');
			A.flush();
			await broker.drain();
			await sleep(120);
			B.ui.selectPage(B.ui.getPageById(pid), true);

			// Independent creator content travels in the save first.
			// The fix must merge it even on the cell edited by B.
			broker.capture = [];
			var modelA = graphA.getModel();

			if (labelEdit)
			{
				modelA.setStyle(modelA.getCell(id), 'fillColor=#00ff00;');
			}
			else
			{
				modelA.setValue(modelA.getCell(id), 'creator label');
			}

			graphA.insertVertex(null, id + 'remote', 'creator cell',
				160, 40, 80, 40);
			A.flush();
			var creatorMessages = broker.capture;
			broker.capture = null;
			var saving = A.save(250);
			await sleep(50);
			broker.capture = [];
			var modelB = B.ui.editor.graph.getModel();

			if (labelEdit)
			{
				modelB.setValue(modelB.getCell(id), 'adopter label');
			}
			else
			{
				modelB.setStyle(modelB.getCell(id), phase >= 4 ? null :
					'fillColor=#ff0000;');
			}

			B.flush();
			var adopterMessages = broker.capture;
			broker.capture = null;
			var expected = {page: pid, cell: id,
				value: labelEdit ? 'adopter label' : 'creator label',
				style: labelEdit ? 'fillColor=#00ff00;' :
					(phase >= 4 ? null : 'fillColor=#ff0000;')};
			report.pageAdoptionEditExpected.push(expected);

			var pending = B.ui.diffPages(B.file.getShadowPages(), B.file.ownPages);

			if (pending[B.win.EditorUi.DIFF_INSERT] == null)
			{
				report.fail('page-adoption-edit-setup', 'missing pending page insert');
			}

			if (liveFirst)
			{
				broker.capture = adopterMessages;
				releaseCapture(broker, report, 'page-adoption-edit');
				await broker.drain();
				await sleep(60);
			}

			if (phase >= 6)
			{
				B.setOffline(true);
			}

			await saving;
			await broker.drain();
			await sleep(120);

			if (phase >= 6)
			{
				// File catchup completes before the RT channel rejoins.
				await B.rejoin();
			}

			assertPageAdoptionEdit(B, B.file.ownPages, expected, report,
				'page-adoption-edit-own');

			if (!liveFirst)
			{
				broker.capture = adopterMessages;
				releaseCapture(broker, report, 'page-adoption-edit');
			}

			broker.capture = creatorMessages;
			releaseCapture(broker, report, 'page-adoption-edit');
			await broker.drain();
			await sleep(120);
			await B.save(0);
			await broker.drain();
			await sleep(120);
			assertPageAdoptionEdit(B, B.ui.getPagesForXml(broker.lastSavedData),
				expected, report, 'page-adoption-edit-persisted');
		}
	};

	function assertPageAdoptionEdit(client, pages, expected, report, context)
	{
		var page = client.ui.getPageById(expected.page, pages);

		if (page != null)
		{
			client.ui.updatePageRoot(page);
			var model = new client.win.mxGraphModel(page.root);
			var cell = model.getCell(expected.cell);

			if (cell != null && cell.getValue() == expected.value &&
				cell.getStyle() == expected.style &&
				model.getCell(expected.cell + 'remote') != null)
			{
				return;
			}
		}

		report.fail(context, client.name + ' lost adopter edits or ' +
			'creator content for ' + expected.cell + ': ' +
			JSON.stringify({value: cell != null ? cell.getValue() : null,
				style: cell != null ? cell.getStyle() : null, expected: expected}));
	};

	function assertFinalPageAdoptionEdits(clients, broker, report)
	{
		var saved = clients[0].ui.getPagesForXml(broker.lastSavedData);

		for (var i = 0; i < report.pageAdoptionEditExpected.length; i++)
		{
			var expected = report.pageAdoptionEditExpected[i];
			assertPageAdoptionEdit(clients[0], saved, expected, report,
				'page-adoption-edit-final-file');

			for (var j = 0; j < clients.length; j++)
			{
				assertPageAdoptionEdit(clients[j], clients[j].ui.pages,
					expected, report, 'page-adoption-edit-final-visible');
			}
		}
	};

	// Releases messages held by broker.capture in recording order.
	// Only live diffs are supported - a captured save carries no
	// checksum, so holding one would deliver a patch the receiver
	// cannot verify
	function releaseCapture(broker, report, scope)
	{
		var captured = broker.capture || [];
		broker.capture = null;

		for (var i = 0; i < captured.length; i++)
		{
			var entry = captured[i];

			if (entry.msg != null && entry.msg.a == 'rt-test-save')
			{
				report.fail(scope, 'releaseCapture: a save was captured, ' +
					'which cannot be replayed without its checksum');

				continue;
			}

			broker.send(entry.from, entry.msg);
		}
	};

	// A colliding PAGE insert on the LIVE path must not merge. When a
	// peer adopts an unsaved page, its flush resolve re-asserts that
	// page as a full-data insert; that data is stale against newer
	// live traffic, so merging it reverts the creator's freshly
	// flushed cells on screen AND in the snapshot. The cell-level
	// merge (duplicate delivery, resend) stays on - the two levels
	// shared one flag, which is how the page level was switched on
	// silently
	async function runLivePageInsertRevert(clients, broker, report)
	{
		var A = clients[0];
		var B = clients[1];

		var inPages = function(client, pages, id)
		{
			for (var i = 0; i < pages.length; i++)
			{
				client.ui.updatePageRoot(pages[i]);

				if (new client.win.mxGraphModel(
					pages[i].root).getCell(id) != null)
				{
					return true;
				}
			}

			return false;
		};

		// Phase 0: A creates page P with content and flushes WITHOUT
		// saving, so P lives in B's visible pages but in nobody's file
		A.ui.insertPage();
		var pid = A.ui.pages[A.ui.pages.length - 1].getId();
		A.ui.editor.graph.insertVertex(null, 'lp_a1', 'A1',
			40, 40, 80, 40);
		A.flush();
		await broker.drain();
		await sleep(150);

		var idxB = -1;

		for (var i = 0; i < B.ui.pages.length; i++)
		{
			if (B.ui.pages[i].getId() == pid)
			{
				idxB = i;
			}
		}

		if (idxB < 0)
		{
			report.fail('live-page-insert-revert', 'setup: the unsaved ' +
				'page did not reach the peer');

			return;
		}

		// A page that is created and drawn on without ever switching
		// away from it ships its insert from the CACHED node, which is
		// only rewritten on a page switch: the cells drawn since
		// creation were missing from the insert, and every later diff
		// compared roots, found them equal and never resent them
		if (findCellAnyPage(B, 'lp_a1') == null)
		{
			report.fail('live-page-insert-revert', 'setup: the new page ' +
				'arrived EMPTY - content drawn before the first flush is ' +
				'not carried by the page insert');

			return;
		}

		// Phase 1: B adopts P by editing it (not flushed yet, so B's
		// resolve below still describes P without A's next cell)
		B.ui.selectPage(B.ui.pages[idxB], true);
		B.ui.editor.graph.insertVertex(null, 'lp_b1', 'B1',
			40, 120, 80, 40);

		// Phase 2: the crossing window - A adds a cell and relabels an
		// existing one, then flushes while B's flush is computed from
		// its older copy of P. The relabel matters on its own: an
		// additive merge would still apply the stale copy's UPDATE
		// entries and roll the label back
		broker.capture = [];
		A.ui.editor.graph.insertVertex(null, 'lp_a2', 'A2',
			160, 40, 80, 40);
		A.ui.editor.graph.getModel().setValue(
			A.ui.editor.graph.getModel().getCell('lp_a1'), 'A1-new');
		A.flush();
		B.flush();
		releaseCapture(broker, report, 'live-page-insert-revert');
		await broker.drain();
		await sleep(200);

		var a1 = findCellAnyPage(A, 'lp_a1');

		if (a1 == null || a1.value != 'A1-new')
		{
			report.fail('live-page-insert-revert', 'the peer\'s stale page ' +
				'insert rolled back a freshly flushed label on the creator ' +
				'(value=' + ((a1 != null) ? a1.value : 'MISSING') + ')');
		}

		// Phase 3: asserted BEFORE any save or cleanup could heal it -
		// the revert is what the user sees on the creator's screen
		if (findCellAnyPage(A, 'lp_a2') == null)
		{
			report.fail('live-page-insert-revert', 'the peer\'s stale page ' +
				'insert reverted a freshly flushed cell on the creator');
		}

		var residue = A.win.mxUtils.isEmptyObject(A.ui.diffPages(
			A.sync.snapshot, A.ui.pages));

		if (!residue)
		{
			report.fail('live-page-insert-revert', 'the stale page insert ' +
				'drove the snapshot apart from the visible pages');
		}

		if (findCellAnyPage(A, 'lp_b1') == null)
		{
			report.fail('live-page-insert-revert', 'the adopted page\'s new ' +
				'content did not reach the creator - the update entry must ' +
				'still apply while the insert is skipped');
		}

		if (findCellAnyPage(B, 'lp_a2') == null)
		{
			report.fail('live-page-insert-revert', 'the crossing cell did ' +
				'not reach the adopter');
		}

		// Phase 4: the whole page survives the save cycle on both sides
		await A.save(0);
		await broker.drain();
		await sleep(150);

		// The creator's save re-inserts the page WITHOUT the adopter's
		// cells. Merging that insert as a full diff deleted them from
		// the adopter's own pages, and because the deletion never
		// appears in the patch, nothing re-asserted them: the adopter's
		// own next save then published the loss to everyone
		if (!inPages(B, B.file.ownPages, 'lp_b1'))
		{
			report.fail('live-page-insert-revert', 'the page creator\'s ' +
				'save deleted the adopter\'s own flushed cell from its own ' +
				'pages - a colliding page insert must merge additively');
		}

		await B.save(0);
		await broker.drain();
		await sleep(150);

		for (var i = 0; i < clients.length; i++)
		{
			if (!clients[i].file.isModified())
			{
				clients[i].cleanupNow();
			}
		}

		await sleep(200);

		var ids = ['lp_a1', 'lp_a2', 'lp_b1'];

		for (var i = 0; i < ids.length; i++)
		{
			if (findCellAnyPage(A, ids[i]) == null ||
				findCellAnyPage(B, ids[i]) == null ||
				(broker.lastSavedData || '').indexOf(ids[i]) < 0)
			{
				report.fail('live-page-insert-revert', 'phase 4: ' + ids[i] +
					' did not survive the save cycle on both clients and ' +
					'in the persisted file');
			}
		}
	};

	// The first live patch resolves unsaved references, the second
	// carries the author's actual changes. An adopter's full copy of
	// a referenced cell is stale after a crossing edit from its creator.
	// Cross-SENDER delay is legal even when every socket is FIFO.
	async function runStaleResolve(clients, broker, report)
	{
		var A = clients[0];
		var B = clients[1];
		var C = clients[2];

		for (var i = 0; i < clients.length; i++)
		{
			clients[i].ui.selectPage(clients[i].ui.pages[0], true);
		}

		var graphA = A.ui.editor.graph;
		var graphC = C.ui.editor.graph;
		var modelA = graphA.getModel();
		var modelC = graphC.getModel();
		graphA.insertVertex(null, 'sr_x', 'old', 40, 40, 80, 40,
			'fillColor=#ff0000;');
		graphA.insertVertex(null, 'sr_y', 'target', 200, 40, 80, 40);
		graphA.insertVertex(null, 'sr_z', 'new target', 360, 40, 80, 40);
		graphA.insertEdge(null, 'sr_existing', '',
			modelA.getCell('sr_x'), modelA.getCell('sr_y'));
		A.flush();
		await broker.drain();
		await sleep(150);

		// C references A's unsaved cell. Hold C's whole message while
		// A changes the referenced cell and B receives that newer edit.
		broker.capture = [];
		graphC.insertEdge(null, 'sr_edge', '',
			modelC.getCell('sr_x'), modelC.getCell('sr_y'));
		// The new label adopts an edge as its parent, exercising the
		// insert's terminal references independently of its content.
		graphC.insertVertex(modelC.getCell('sr_existing'), 'sr_label',
			'edge label', 0, 0, 40, 20, 'edgeLabel;', true);
		C.flush();
		var held = broker.capture;
		broker.capture = null;

		if (held.length != 1 || held[0].from != 2 ||
			JSON.stringify(held[0].msg.p.c[0]).indexOf('sr_x') < 0)
		{
			report.fail('stale-resolve-setup',
				'the held message did not adopt the unsaved terminal');
		}

		modelA.beginUpdate();
		try
		{
			var cell = modelA.getCell('sr_x');
			modelA.setValue(cell, 'new');
			modelA.setStyle(cell, 'fillColor=#00ff00;');
			var geo = cell.getGeometry().clone();
			geo.x = 100;
			geo.width = 120;
			modelA.setGeometry(cell, geo);
			modelA.setTerminal(modelA.getCell('sr_existing'),
				modelA.getCell('sr_z'), false);
		}
		finally
		{
			modelA.endUpdate();
		}

		A.flush();
		await broker.drain();
		await sleep(150);

		var observed = findCellAnyPage(B, 'sr_x');

		if (observed == null || observed.value != 'new')
		{
			report.fail('stale-resolve-setup',
				'the newer edit did not reach the observer before the resolve');
		}

		for (var i = 0; i < held.length; i++)
		{
			broker.send(held[i].from, held[i].msg);
		}

		await broker.drain();
		await sleep(150);

		// Assert intent NOW: later saves can heal a visible revert, so
		// final convergence alone cannot detect this regression.
		for (var i = 0; i < clients.length; i++)
		{
			var client = clients[i];
			var cell = findCellAnyPage(client, 'sr_x');
			var edge = findCellAnyPage(client, 'sr_edge');

			if (cell == null || cell.value != 'new' ||
				cell.style != 'fillColor=#00ff00;' ||
				cell.geometry.x != 100 || cell.geometry.width != 120)
			{
				report.fail('stale-resolve-content', client.name +
					' lost newer label/style/geometry to the delayed resolve');
			}

			if (edge == null || edge.getTerminal(true) != cell ||
				edge.getTerminal(false) != findCellAnyPage(client, 'sr_y'))
			{
				report.fail('stale-resolve-reference', client.name +
					' did not apply the adopter\'s actual edge insertion');
			}

			var existing = findCellAnyPage(client, 'sr_existing');
			var label = findCellAnyPage(client, 'sr_label');

			if (existing == null || existing.getTerminal(false) !=
				findCellAnyPage(client, 'sr_z') ||
				label == null || label.getParent() != existing)
			{
				report.fail('stale-resolve-terminal', client.name +
					' lost a newer connection to an ignored insert');
			}

			if (!client.win.mxUtils.isEmptyObject(client.ui.diffPages(
				client.sync.snapshot, client.ui.pages)))
			{
				report.fail('stale-resolve-snapshot', client.name +
					' snapshot differs from the visible document');
			}
		}

		// A roster resend carries actual edits as colliding inserts in
		// the SECOND patch. Losing one live flush models an offline
		// edit, then the real sendUnconfirmedChanges must deliver label,
		// geometry AND terminal changes without a save or cleanup.
		modelA.beginUpdate();
		try
		{
			var cell = modelA.getCell('sr_x');
			modelA.setValue(cell, 'resend');
			var geo = cell.getGeometry().clone();
			geo.y = 100;
			modelA.setGeometry(cell, geo);
			modelA.setTerminal(modelA.getCell('sr_existing'),
				modelA.getCell('sr_y'), false);
		}
		finally
		{
			modelA.endUpdate();
		}

		broker.capture = [];
		A.flush();
		broker.capture = null;
		A.sync.sendUnconfirmedChanges();
		await broker.drain();
		await sleep(150);

		for (var i = 0; i < clients.length; i++)
		{
			var client = clients[i];
			var cell = findCellAnyPage(client, 'sr_x');
			var edge = findCellAnyPage(client, 'sr_existing');

			if (cell == null || cell.value != 'resend' ||
				cell.geometry.y != 100 || edge == null ||
				edge.getTerminal(false) != findCellAnyPage(client, 'sr_y'))
			{
				report.fail('stale-resolve-resend', client.name +
					' dropped the actual label/geometry/terminal resend');
			}
		}
	};

	// Offline client edits locally while the others edit and save,
	// then rejoins: the catch-up merge must bring the missed saved
	// state without losing the offline edits (they are pending local
	// changes and win per merge semantics), and the offline client's
	// next save must publish them
	// Deterministic repro of the 31.5.0 mergeFile checksum regression:
	// a saved page whose ROOT id differs from the shadow's. A fresh
	// parse selects the last parentless cell of a page as its root, so
	// a file rewritten by an external tool, or one carrying a stray
	// cell without a parent, diffs against the shadow as "root changed"
	// and every cell of the page is re-inserted under the new root id.
	// patchPage builds that root from its entry WITHOUT children (the
	// layers are separate insert entries the walk adds afterwards), so
	// refusing an empty root before the walk - the guard added against
	// hostile root inserts - rejected every legitimate root change and
	// mergeFile logged a checksum error for the page (nine in the first
	// 41 h of the release, all self-healed by reload). Both clients
	// merge the rewritten file through the real mergeFile, keep the
	// content, the edge terminals (the collision pre-scan used to run
	// against the old tree and skipped the re-inserted edges' terminals)
	// and stay converged through the next live edit and save.
	async function runRootChange(clients, broker, report)
	{
		var A = clients[0];
		var B = clients[1];
		A.ui.selectPage(A.ui.pages[0], true);
		B.ui.selectPage(B.ui.pages[0], true);

		// Shared saved base: both shadows hold the page with root '0'
		var ga = A.ui.editor.graph;
		var va = ga.insertVertex(null, 'rc_a', 'A', 40, 40, 80, 40);
		var vb = ga.insertVertex(null, 'rc_b', 'B', 240, 40, 80, 40);
		ga.insertEdge(null, 'rc_e', '', va, vb);
		A.flush();
		await broker.drain();
		await sleep(120);
		await A.save(0);
		await broker.drain();
		await sleep(120);

		if (broker.lastSavedData == null)
		{
			report.fail('root-change', 'setup: no saved data');

			return;
		}

		// An external writer rewrites the file with a different root id
		// on the first page (the page content is unchanged)
		var pages = A.ui.getPagesForXml(broker.lastSavedData, true);
		var pageId = pages[0].getId();
		var oldRootId = pages[0].root.getId();
		pages[0].root.setId('rc_root');
		var mutated = A.ui.getXmlForPages(pages);

		if (mutated == null || mutated.indexOf('id="rc_root"') < 0 ||
			mutated.indexOf('parent="rc_root"') < 0)
		{
			report.fail('root-change', 'setup: could not rewrite the root id');

			return;
		}

		broker.lastSavedData = mutated;

		// Both clients merge the rewritten file through the real
		// mergeFile (checksum roundtrip + patchRealtime + patch)
		await A.rejoin();
		await B.rejoin();
		await broker.drain();
		await sleep(150);

		[A, B].forEach(function(X)
		{
			var m = X.ui.editor.graph.getModel();
			var root = m.getRoot();

			if (root == null || root.getId() != 'rc_root')
			{
				report.fail('root-change', X.name + ': page root is ' +
					((root != null) ? root.getId() : 'null') +
					' after the merge, expected rc_root (was ' +
					oldRootId + ')');
			}

			if (m.getChildCount(root) < 1)
			{
				report.fail('root-change', X.name + ': page has no layer ' +
					'after the merge');
			}

			var a = m.getCell('rc_a');
			var b = m.getCell('rc_b');
			var e = m.getCell('rc_e');

			if (a == null || b == null || e == null)
			{
				report.fail('root-change', X.name + ': content lost by the ' +
					'merge (a=' + (a != null) + ' b=' + (b != null) +
					' e=' + (e != null) + ')');
			}
			else if (e.getTerminal(true) != a || e.getTerminal(false) != b)
			{
				report.fail('root-change', X.name + ': edge terminals lost ' +
					'by the merge');
			}

			var shadow = X.file.getShadowPages();
			var shadowRoot = null;

			for (var i = 0; i < shadow.length; i++)
			{
				if (shadow[i] != null && shadow[i].getId() == pageId)
				{
					X.ui.updatePageRoot(shadow[i]);
					shadowRoot = shadow[i].root;
				}
			}

			if (shadowRoot == null || shadowRoot.getId() != 'rc_root')
			{
				report.fail('root-change', X.name + ': shadow root is ' +
					((shadowRoot != null) ? shadowRoot.getId() : 'null') +
					' after the merge');
			}
		});

		// Editing continues on the new root: a live edit reaches the
		// peer and the next save carries the new root id
		A.ui.editor.graph.insertVertex(null, 'rc_after', 'AFTER',
			40, 160, 80, 40);
		A.flush();
		await broker.drain();
		await sleep(150);

		if (findCellAnyPage(B, 'rc_after') == null)
		{
			report.fail('root-change', 'the live edit after the merge never ' +
				'reached the peer');
		}

		await A.save(0);
		await broker.drain();
		await sleep(150);

		var saved = broker.lastSavedData || '';

		if (saved.indexOf('id="rc_root"') < 0 || saved.indexOf('rc_after') < 0)
		{
			report.fail('root-change', 'the save after the merge does not ' +
				'carry the new root id and the edit');
		}
	};

	// A stray cell with no parent, or one naming a parent that is not in
	// the page, used to hijack the whole page: mxModelCodec.decodeRoot
	// took the LAST parentless cell as the root, the real root and all
	// its content became unreachable, updatePageRoot added an empty layer
	// under the stray cell and the next save wrote the emptied page back
	// - no error anywhere on that path (jgraph/drawio-dev#696). Such
	// cells come from external tools and generators, so the file is
	// rewritten here the way one would produce it, outside the model.
	// Both clients must keep the page, adopt the stray cell into the
	// default layer and write the repaired file on the next save.
	async function runStrayRoot(clients, broker, report)
	{
		var A = clients[0];
		var B = clients[1];
		A.ui.selectPage(A.ui.pages[0], true);
		B.ui.selectPage(B.ui.pages[0], true);

		// Shared saved base
		var ga = A.ui.editor.graph;
		var va = ga.insertVertex(null, 'sr_a', 'A', 40, 40, 80, 40);
		var vb = ga.insertVertex(null, 'sr_b', 'B', 240, 40, 80, 40);
		ga.insertEdge(null, 'sr_e', '', va, vb);
		A.flush();
		await broker.drain();
		await sleep(120);
		await A.save(0);
		await broker.drain();
		await sleep(120);

		var saved = broker.lastSavedData;
		var at = (saved != null) ? saved.indexOf('</root>') : -1;

		if (at < 0)
		{
			report.fail('stray-root', 'setup: no saved page to rewrite');

			return;
		}

		// The rewrite an external tool produces: a cell whose parent is
		// not in the page, appended after the content of the first page
		var stray = '<mxCell id="sr_stray" value="STRAY" style="rounded=1;" ' +
			'vertex="1" parent="sr_missing"><mxGeometry x="40" y="160" ' +
			'width="80" height="40" as="geometry"/></mxCell>';
		broker.lastSavedData = saved.substring(0, at) + stray +
			saved.substring(at);

		// Both clients read the rewritten file through the real mergeFile
		await A.rejoin();
		await B.rejoin();
		await broker.drain();
		await sleep(150);

		[A, B].forEach(function(X)
		{
			var m = X.ui.editor.graph.getModel();
			var root = m.getRoot();

			if (root == null || root.getId() != '0')
			{
				report.fail('stray-root', X.name + ': the stray cell took ' +
					'over the page root (root is ' + ((root != null) ?
					root.getId() : 'null') + ', expected 0)');

				return;
			}

			var lost = [];

			['sr_a', 'sr_b', 'sr_e'].forEach(function(id)
			{
				if (m.getCell(id) == null)
				{
					lost.push(id);
				}
			});

			if (lost.length > 0)
			{
				report.fail('stray-root', X.name + ': the page lost ' +
					lost.join(',') + ' to the stray cell');
			}

			var adopted = m.getCell('sr_stray');

			if (adopted == null)
			{
				report.fail('stray-root', X.name + ': the stray cell was ' +
					'dropped instead of adopted');
			}
			else if (adopted.getParent() == null ||
				adopted.getParent() != m.getChildAt(root, 0))
			{
				report.fail('stray-root', X.name + ': the stray cell is not ' +
					'in the default layer (parent is ' +
					((adopted.getParent() != null) ?
						adopted.getParent().getId() : 'null') + ')');
			}
		});

		// The next save writes the repaired file: the stray cell now
		// names a parent that exists, so every later reader agrees
		A.ui.editor.graph.insertVertex(null, 'sr_after', 'AFTER',
			40, 260, 80, 40);
		A.flush();
		await broker.drain();
		await sleep(150);
		await A.save(0);
		await broker.drain();
		await sleep(200);

		var out = broker.lastSavedData || '';
		var parts = out.split('<mxCell');
		var strayNode = null;

		for (var i = 0; i < parts.length; i++)
		{
			if (parts[i].indexOf('id="sr_stray"') >= 0)
			{
				strayNode = parts[i].split('>')[0];
			}
		}

		if (strayNode == null)
		{
			report.fail('stray-root', 'the saved file no longer contains ' +
				'the adopted cell');
		}
		else if (strayNode.indexOf('parent=') < 0)
		{
			report.fail('stray-root', 'the saved file still has the cell ' +
				'without a parent, so the next reader hits the same hazard');
		}

		if (findCellAnyPage(B, 'sr_after') == null)
		{
			report.fail('stray-root', 'the edit made after the merge never ' +
				'reached the peer');
		}
	};

	async function runOfflineRejoin(clients, broker, report)
	{
		var A = clients[0];
		var B = clients[1];
		var C = clients[2];
		[A, B, C].forEach(function(X)
		{
			X.ui.selectPage(X.ui.pages[0], true);
		});

		// Phase 0: shared saved base
		A.ui.editor.graph.insertVertex(null, 'ra1', 'base',
			20, 20, 80, 40);
		A.flush();
		await broker.drain();
		await sleep(120);
		await A.save(0);
		await broker.drain();
		await sleep(120);

		// Phase 1: C goes offline, A and B keep editing and save
		C.setOffline(true);
		A.ui.editor.graph.getModel().setValue(
			A.ui.editor.graph.getModel().getCell('ra1'), 'after-A');
		A.ui.editor.graph.insertVertex(null, 'ra2', 'while-away',
			120, 20, 80, 40);
		A.flush();
		await broker.drain();
		await sleep(120);
		// A saves so ra2/after-A are in the file (B's save only
		// carries B's own changes - single source of truth)
		await A.save(0);
		await broker.drain();
		await sleep(120);
		B.ui.editor.graph.insertVertex(null, 'rb1', 'from-B',
			220, 20, 80, 40);
		B.flush();
		await broker.drain();
		await sleep(120);
		await B.save(0);
		await broker.drain();
		await sleep(120);

		// Phase 2: C edits offline (stays pending locally)
		C.ui.editor.graph.insertVertex(null, 'rc1', 'offline-edit',
			20, 120, 80, 40);
		C.flush();
		await sleep(60);

		// Phase 3: rejoin merges the missed saved state
		await C.rejoin();
		await broker.drain();
		await sleep(120);

		var modelC = C.ui.editor.graph.getModel();
		if (modelC.getCell('ra2') == null || modelC.getCell('rb1') == null)
		{
			report.fail('rejoin-catchup', 'missed saved cells not merged');
		}

		if (modelC.getCell('rc1') == null)
		{
			report.fail('rejoin-pending', 'offline edit lost by the merge');
		}

		// Phase 4: C saves - the offline edit reaches the others'
		// own pages via the merge; the visible document follows with
		// the next cleanup (C's live diff was lost while offline, so
		// there is nothing else to carry it onto A's screen)
		await C.save(0);
		await broker.drain();
		await sleep(120);
		A.cleanupNow();
		await broker.drain();
		await sleep(120);

		if (A.ui.editor.graph.getModel().getCell('rc1') == null)
		{
			report.fail('offline-edit-publish',
				'offline edit missing on client0 after save + cleanup');
		}
	};

	// Deterministic repro of the edited-later LWW race: B saves the
	// adopted cells, A edits one of them AFTER B's save diff was
	// computed but BEFORE the save is delivered. A's newer flushed
	// edit collides with the save's insert entry, and the colliding
	// merge used to write the older saved value back into A's own
	// pages (nothing re-broadcasts it, so the file converged on the
	// older value). With the merge veto A's fresher local copy wins.
	// Deterministic repro of the stale-undo class (2026-07-24): the
	// undo history holds cell OBJECT references, but remote patches
	// remove or replace objects of the same id without invalidating
	// the history. Undoing such an edit restored stale objects:
	// - a dangling terminal (a reconnect undone after a remote
	//   subtree delete restores the previous, now deleted terminal)
	// - a duplicate id or a ghost cell from the cellAdded collision
	//   rename (an order change undone after remote delete+resurrect
	//   re-adds the old object while the id is taken)
	// Post-fix (DrawioFile.invalidateReplacedEdits) the affected edits
	// are dropped and the undos fall through to older, healthy edits.
	async function runUndoStale(clients, broker, report)
	{
		var A = clients[0];
		var B = clients[1];
		A.ui.selectPage(A.ui.pages[0], true);
		B.ui.selectPage(B.ui.pages[0], true);

		// Walks all pages of a client without constructing mxGraphModel
		// wrappers (their cellAdded sweep renames duplicate ids and
		// would destroy the evidence): reports duplicate ids, ghost
		// cells (numeric ids from createId renames) and terminal
		// references pointing outside the tree
		var scanClient = function(client, context)
		{
			for (var pi = 0; pi < client.ui.pages.length; pi++)
			{
				client.ui.updatePageRoot(client.ui.pages[pi]);
				var root = client.ui.pages[pi].root;
				var counts = {};
				var objects = [];
				var edges = [];

				var walk = function(cell)
				{
					objects.push(cell);
					var id = cell.getId();

					if (id != null)
					{
						counts[id] = (counts[id] || 0) + 1;

						if (/^\d+$/.test(id) && parseInt(id, 10) > 1)
						{
							report.fail(context, client.name +
								': ghost cell from collision rename: ' + id);
						}
					}

					if (cell.edge)
					{
						edges.push(cell);
					}

					for (var ci = 0; ci < cell.getChildCount(); ci++)
					{
						walk(cell.getChildAt(ci));
					}
				};

				if (root != null)
				{
					walk(root);
				}

				for (var id in counts)
				{
					if (counts[id] > 1)
					{
						report.fail(context, client.name +
							': duplicate id in tree: ' + id +
							' x' + counts[id]);
					}
				}

				for (var ei = 0; ei < edges.length; ei++)
				{
					var src = edges[ei].getTerminal(true);
					var trg = edges[ei].getTerminal(false);

					if ((src != null && objects.indexOf(src) < 0) ||
						(trg != null && objects.indexOf(trg) < 0))
					{
						report.fail(context, client.name +
							': dangling terminal on ' + edges[ei].getId());
					}
				}
			}
		};

		// Setup: two vertices, an edge and a container with a child,
		// flushed and saved so both clients share the same base
		var graphA = A.ui.editor.graph;
		var modelA = graphA.getModel();
		var v1 = graphA.insertVertex(null, 'us_v1', 'V1', 40, 40, 80, 40);
		graphA.insertVertex(null, 'us_v2', 'V2', 200, 40, 80, 40);
		var edge = graphA.insertEdge(null, 'us_e1', '', v1,
			modelA.getCell('us_v2'));
		var cont = graphA.insertVertex(null, 'us_c1', 'Box',
			40, 160, 160, 100);
		graphA.insertVertex(cont, 'us_k1', 'Kid', 10, 30, 60, 30);
		A.flush();
		await broker.drain();
		await sleep(120);
		await A.save(0);
		await broker.drain();
		await sleep(120);

		var modelB = B.ui.editor.graph.getModel();

		if (modelB.getCell('us_k1') == null)
		{
			report.fail('undo-stale-setup', 'base not delivered');

			return;
		}

		// --- Case 1 (dangling terminal): A reconnects the edge target
		// twice (child, then container), B deletes the container
		// subtree keeping the edge, A undoes the second reconnect -
		// pre-fix this restores the deleted child as the target
		graphA.connectCell(edge, modelA.getCell('us_k1'), false);
		A.flush();
		await broker.drain();
		await sleep(120);
		graphA.connectCell(edge, modelA.getCell('us_c1'), false);
		A.flush();
		await broker.drain();
		await sleep(120);

		B.ui.editor.graph.removeCells([modelB.getCell('us_c1')], false);
		B.flush();
		await broker.drain();
		await sleep(120);

		A.ui.undo();
		A.flush();
		await broker.drain();
		await sleep(120);

		scanClient(A, 'undo-stale-dangling');
		scanClient(B, 'undo-stale-dangling');

		// --- Case 2 (duplicate id / ghost cell): A orders v1 to the
		// front, B deletes v1, flushes, resurrects it via its own undo
		// and flushes the reinsert; A then undoes - pre-fix this
		// re-adds A's old v1 object while the id is taken (duplicate
		// id in the tree or a ghost cell renamed by cellAdded)
		graphA.orderCells(false, [modelA.getCell('us_v1')]);
		A.flush();
		await broker.drain();
		await sleep(120);

		B.ui.editor.graph.removeCells([modelB.getCell('us_v1')], false);
		B.flush();
		await broker.drain();
		await sleep(120);
		B.ui.undo();
		B.flush();
		await broker.drain();
		await sleep(120);

		A.ui.undo();
		A.flush();
		await broker.drain();
		await sleep(120);

		scanClient(A, 'undo-stale-dup');
		scanClient(B, 'undo-stale-dup');

		// --- Case 3 (redo-stale): A edits and undoes (the edit moves
		// to the redo range), B deletes and resurrects the cell; A's
		// redo must not execute the stale edit (invalidation covers
		// the redo range of the history)
		graphA.insertVertex(null, 'us_r1', 'R1', 320, 40, 80, 40);
		A.flush();
		await broker.drain();
		await sleep(120);

		graphA.orderCells(false, [modelA.getCell('us_r1')]);
		A.ui.undo();
		A.flush();
		await broker.drain();
		await sleep(120);

		B.ui.editor.graph.removeCells([modelB.getCell('us_r1')], false);
		B.flush();
		await broker.drain();
		await sleep(120);
		B.ui.undo();
		B.flush();
		await broker.drain();
		await sleep(120);

		if (A.ui.editor.undoManager.canRedo())
		{
			A.ui.redo();
		}

		A.flush();
		await broker.drain();
		await sleep(120);

		scanClient(A, 'undo-stale-redo');
		scanClient(B, 'undo-stale-redo');

		// --- Case 4 (cross-page undo): A edits on page-a, switches to
		// page-b QUIETLY (no history edit, like the sync paths do), B
		// deletes and resurrects the cell; A's undo then runs against
		// the wrong root (parentForCellChanged's contains checks miss,
		// no cellAdded collision handling) - pre-fix this planted a
		// silent duplicate in the page-a tree
		graphA.insertVertex(null, 'us_x1', 'X1', 320, 160, 80, 40);
		A.flush();
		await broker.drain();
		await sleep(120);

		graphA.orderCells(false, [modelA.getCell('us_x1')]);
		A.flush();
		await broker.drain();
		await sleep(120);

		if (A.ui.pages.length > 1)
		{
			A.ui.selectPage(A.ui.pages[1], true);
		}

		B.ui.editor.graph.removeCells([modelB.getCell('us_x1')], false);
		B.flush();
		await broker.drain();
		await sleep(120);
		B.ui.undo();
		B.flush();
		await broker.drain();
		await sleep(120);

		A.ui.undo();
		A.flush();
		await broker.drain();
		await sleep(120);

		if (A.ui.pages.length > 1)
		{
			A.ui.selectPage(A.ui.pages[0], true);
		}

		scanClient(A, 'undo-stale-crosspage');
		scanClient(B, 'undo-stale-crosspage');

		// --- Case 5 (terminal sanitizer net): plants a dangling
		// terminal object that the edge-list based disconnect cannot
		// see (mxCell-level detach, simulating the crossing re-insert
		// windows under loss and reorder seen at 8 clients), then
		// applies a remove patch to the page while it is NOT the
		// current page - the sanitizer pass must null the reference
		graphA.insertVertex(null, 'us_s1', 'S1', 460, 40, 60, 30);
		graphA.insertVertex(null, 'us_s2', 'S2', 560, 40, 60, 30);
		graphA.insertEdge(null, 'us_se1', '',
			modelA.getCell('us_s1'), modelA.getCell('us_s2'));
		A.flush();
		await broker.drain();
		await sleep(120);

		// Saved so the case cells live in BOTH ownPages: B's remove
		// flush must not carry an adoption echo of us_s2 (a colliding
		// re-insert would repair the planted dangling reference and
		// mask what the sanitizer is guarding)
		await A.save(0);
		await broker.drain();
		await sleep(120);

		// Detaches the terminal from the tree bypassing the model (no
		// cellRemoved, no edge-list disconnect) and leaves the page so
		// the incoming patch runs on a fresh wrapper model. Mirrored in
		// the snapshot copy: the real windows produce the state in all
		// copies, and the incoming patch below is applied to both -
		// only a symmetric plant keeps the snapshot invariant honest
		// The plant bypasses the model, so the view state of the
		// detached cell is cleared manually: the real windows ran
		// through evented paths and never leave a state behind, and a
		// tree-walking view clear can never reach a detached cell
		// (render-consistency verdict)
		var plantedS2 = modelA.getCell('us_s2');
		A.ui.editor.graph.view.clear(plantedS2, true);
		plantedS2.removeFromParent();

		var findById = function(cell, id)
		{
			if (cell.getId() == id)
			{
				return cell;
			}

			for (var fi = 0; fi < cell.getChildCount(); fi++)
			{
				var hit = findById(cell.getChildAt(fi), id);

				if (hit != null)
				{
					return hit;
				}
			}

			return null;
		};

		for (var si = 0; si < A.sync.snapshot.length; si++)
		{
			if (A.sync.snapshot[si].root != null)
			{
				var snapS2 = findById(A.sync.snapshot[si].root, 'us_s2');

				if (snapS2 != null)
				{
					snapS2.removeFromParent();
				}
			}
		}

		if (A.ui.pages.length > 1)
		{
			A.ui.selectPage(A.ui.pages[1], true);
		}

		B.ui.editor.graph.removeCells([modelB.getCell('us_s1')], false);
		B.flush();
		await broker.drain();
		await sleep(120);

		if (A.ui.pages.length > 1)
		{
			A.ui.selectPage(A.ui.pages[0], true);
		}

		scanClient(A, 'undo-stale-sanitizer');

		// B removes the case's remaining cells so the bypass-detached
		// terminal cannot diverge the final states: the remove patch
		// clears them from A's visible pages AND A's snapshot (which
		// still holds the terminal - the bypass only touched the tree)
		B.ui.editor.graph.removeCells(
			[modelB.getCell('us_se1'), modelB.getCell('us_s2')], false);
		B.flush();
		await broker.drain();
		await sleep(120);

		// --- Case 6 (page redo after remote re-insert, reorder:30):
		// A adds a page (undoable) and undoes it; B's rename flush
		// adopts and re-inserts the page as a NEW DiagramPage object;
		// A's redo then re-added the OLD page object - a duplicate
		// page id in the pages array. The history invalidation covers
		// page-level object references (ChangePage.relatedPage).
		var p6 = A.ui.insertPage();
		A.flush();
		await broker.drain();
		await sleep(120);

		A.ui.undo();

		var p6b = B.ui.getPageById(p6.getId());

		if (p6b != null)
		{
			B.ui.editor.graph.model.execute(
				new B.win.RenamePage(B.ui, p6b, 'p6-renamed'));
			B.flush();
			await broker.drain();
			await sleep(120);
		}
		else
		{
			report.fail('undo-stale-setup', 'case 6 page not delivered');
		}

		if (A.ui.editor.undoManager.canRedo())
		{
			A.ui.redo();
		}

		A.flush();
		await broker.drain();
		await sleep(120);

		// The redo of the page insert views the page again, resolved to
		// the re-inserted object (the select replay walks by direction:
		// undo to the origin, redo to the target). The base toggle
		// indexed the stale object, so the redo stayed on the first
		// page by accident
		if (A.ui.currentPage == null ||
			A.ui.currentPage.getId() != p6.getId())
		{
			report.fail('undo-stale-pageredo', 'the redo of the page ' +
				'insert did not view the re-inserted page');
		}

		A.ui.selectPage(A.ui.pages[0], true);

		var checkPageDup = function(client, context)
		{
			var seen = {};

			for (var di = 0; di < client.ui.pages.length; di++)
			{
				var pid = client.ui.pages[di].getId();

				if (seen[pid])
				{
					report.fail(context, client.name +
						': duplicate page in array: ' + pid);
				}

				seen[pid] = true;
			}
		};

		checkPageDup(A, 'undo-stale-pagedup');
		checkPageDup(B, 'undo-stale-pagedup');
		scanClient(A, 'undo-stale-pagedup');
		scanClient(B, 'undo-stale-pagedup');

		// --- Case 7 (undo of an unconfirmed local delete after the
		// remote remove confirmed one of its ids, jitter:11 real
		// timing): A deletes Y+edge locally WITHOUT flushing, B
		// deletes X (the edge's other terminal, edge included) and
		// flushes; the remove list arrives at A where the edge is
		// already gone - it must STILL invalidate A's delete edit, or
		// A's undo revives the edge with a dead terminal object
		graphA.insertVertex(null, 'us_y1', 'Y', 40, 260, 60, 30);
		graphA.insertVertex(null, 'us_x2', 'X', 160, 260, 60, 30);
		graphA.insertEdge(null, 'us_ye1', '',
			modelA.getCell('us_y1'), modelA.getCell('us_x2'));
		A.flush();
		await broker.drain();
		await sleep(120);
		await A.save(0);
		await broker.drain();
		await sleep(120);

		// Local unconfirmed delete of Y (takes the edge along), NOT
		// flushed - the delete edit stays in A's history
		A.ui.editor.graph.removeCells([modelA.getCell('us_y1')]);

		B.ui.editor.graph.removeCells([modelB.getCell('us_x2')]);
		B.flush();
		await broker.drain();
		await sleep(120);

		A.ui.undo();
		A.flush();
		await broker.drain();
		await sleep(120);

		scanClient(A, 'undo-stale-confirmed-remove');
		scanClient(B, 'undo-stale-confirmed-remove');

		// --- Case 8 (redo of a delete after a remote edge attached to
		// it, reorder:8 @8C): A deletes a vertex (edge recorded in the
		// delete edit), undoes; B attaches a NEW edge to the revived
		// vertex and flushes; A redoes - the replayed delete knows
		// nothing about B's edge and left its terminal dangling. The
		// post-undo/redo terminal sanitizer disconnects it.
		graphA.insertVertex(null, 'us_z1', 'Z', 40, 360, 60, 30);
		A.flush();
		await broker.drain();
		await sleep(120);
		await A.save(0);
		await broker.drain();
		await sleep(120);

		A.ui.editor.graph.removeCells([modelA.getCell('us_z1')]);
		A.ui.undo();
		A.flush();
		await broker.drain();
		await sleep(120);

		B.ui.editor.graph.insertEdge(null, 'us_ze1', '',
			modelB.getCell('us_v1'), modelB.getCell('us_z1'));
		B.flush();
		await broker.drain();
		await sleep(120);

		A.ui.redo();
		A.flush();
		await broker.drain();
		await sleep(120);

		scanClient(A, 'undo-stale-redo-delete');
		scanClient(B, 'undo-stale-redo-delete');

		// --- Case 9 (execute-time resolution, the core proof of the
		// repair semantics): A reconnects an edge to T, B deletes T,
		// A undoes (edge back on the old terminal), B undoes its
		// delete (T re-added as a NEW object of the same id) and
		// flushes, A REDOES: the replay must resolve the recorded id
		// against the live model and connect the edge to the re-added
		// canonical object - a pre-nulled or dropped edit could never
		// do this
		graphA.insertVertex(null, 'us_p1', 'P1', 40, 460, 60, 30);
		graphA.insertVertex(null, 'us_p2', 'P2', 160, 460, 60, 30);
		graphA.insertVertex(null, 'us_p3', 'P3', 280, 460, 60, 30);
		graphA.insertEdge(null, 'us_pe1', '',
			modelA.getCell('us_p1'), modelA.getCell('us_p2'));
		A.flush();
		await broker.drain();
		await sleep(120);
		await A.save(0);
		await broker.drain();
		await sleep(120);

		// A reconnects the edge target to P3 (the edit under test)
		graphA.connectCell(modelA.getCell('us_pe1'),
			modelA.getCell('us_p3'), false);
		A.flush();
		await broker.drain();
		await sleep(120);

		// B deletes P3 keeping the edge, A undoes the reconnect
		B.ui.editor.graph.removeCells([modelB.getCell('us_p3')], false);
		B.flush();
		await broker.drain();
		await sleep(120);

		A.ui.undo();
		A.flush();
		await broker.drain();
		await sleep(120);

		var pe1 = modelA.getCell('us_pe1');

		if (pe1 == null || pe1.getTerminal(false) !=
			modelA.getCell('us_p2'))
		{
			report.fail('undo-stale-resolve',
				'undo did not restore the previous terminal');
		}

		// B revives P3 through its own undo (a NEW object, same id)
		B.ui.undo();
		B.flush();
		await broker.drain();
		await sleep(120);

		if (modelA.getCell('us_p3') == null)
		{
			report.fail('undo-stale-resolve',
				'revived terminal did not reach client0');
		}

		// A redoes: the replay resolves us_p3 fresh and must connect
		// to the canonical re-added object
		A.ui.redo();
		A.flush();
		await broker.drain();
		await sleep(120);

		pe1 = modelA.getCell('us_pe1');

		if (pe1 == null || pe1.getTerminal(false) == null ||
			pe1.getTerminal(false) != modelA.getCell('us_p3'))
		{
			report.fail('undo-stale-resolve',
				'redo did not resolve to the re-added terminal object');
		}

		var pe1b = modelB.getCell('us_pe1');

		if (pe1b == null || pe1b.getTerminal(false) !=
			modelB.getCell('us_p3'))
		{
			report.fail('undo-stale-resolve',
				'resolved reconnect did not reach the peer');
		}

		scanClient(A, 'undo-stale-resolve');
		scanClient(B, 'undo-stale-resolve');

		// --- Case 10 (undo SEMANTICS, manual find): a null replay
		// value is legitimate - connecting an open edge end and
		// undoing must DISCONNECT again (the repair must not
		// reconstruct the id and turn the undo into a no-op), redo
		// reconnects; an added vertex disappears on undo and returns
		// on redo. Convergence-only verdicts cannot catch a
		// consistently inert undo, so the states are asserted
		graphA.insertVertex(null, 'us_t1', 'T1', 400, 460, 60, 30);
		var openEdge = graphA.insertEdge(null, 'us_oe1', '',
			modelA.getCell('us_p1'), null);

		// An open end always carries a terminal point in the real
		// editor (mxEdgeHandler leaves one) - without it the edge
		// would be unrenderable, which the render verdict rejects
		var openGeo = modelA.getGeometry(openEdge).clone();
		openGeo.setTerminalPoint(new A.win.mxPoint(560, 500), false);
		modelA.setGeometry(openEdge, openGeo);
		A.flush();
		await broker.drain();
		await sleep(120);

		graphA.connectCell(modelA.getCell('us_oe1'),
			modelA.getCell('us_t1'), false);

		A.ui.undo();

		var oe1 = modelA.getCell('us_oe1');

		if (oe1 == null || oe1.getTerminal(false) != null)
		{
			report.fail('undo-stale-semantics',
				'undo of a connect did not disconnect the open end');
		}

		A.ui.redo();
		oe1 = modelA.getCell('us_oe1');

		if (oe1 == null || oe1.getTerminal(false) !=
			modelA.getCell('us_t1'))
		{
			report.fail('undo-stale-semantics',
				'redo did not reconnect the open end');
		}

		A.ui.undo();
		oe1 = modelA.getCell('us_oe1');

		if (oe1 == null || oe1.getTerminal(false) != null)
		{
			report.fail('undo-stale-semantics',
				'second undo did not disconnect again');
		}

		graphA.insertVertex(null, 'us_av1', 'AV', 500, 460, 60, 30);
		A.ui.undo();

		if (modelA.getCell('us_av1') != null)
		{
			report.fail('undo-stale-semantics',
				'undo of an add did not remove the vertex');
		}

		A.ui.redo();

		if (modelA.getCell('us_av1') == null)
		{
			report.fail('undo-stale-semantics',
				'redo of an add did not restore the vertex');
		}

		A.flush();
		await broker.drain();
		await sleep(120);

		scanClient(A, 'undo-stale-semantics');
		scanClient(B, 'undo-stale-semantics');

		// --- Case 11 (manual find, composite disconnect): dragging an
		// edge end off its terminal is ONE edit (the geometry gains the
		// drop point, the terminal goes null). A peer deletes the old
		// terminal, the undo replays the edit: the terminal replay
		// resolves to the dead object and plants a transient point,
		// but the SIBLING geometry replay of the same edit restores
		// the pre-drag geometry afterwards and wiped the point - the
		// edge lost terminal AND point and vanished from the display.
		// Repair points are applied after the whole edit replay.
		graphA.insertVertex(null, 'us_q1', 'Q1', 40, 560, 120, 60);
		graphA.insertVertex(null, 'us_q2', 'Q2', 420, 560, 120, 60);
		graphA.insertEdge(null, 'us_qe1', 'C',
			modelA.getCell('us_q1'), modelA.getCell('us_q2'));
		A.flush();
		await broker.drain();
		await sleep(120);
		await A.save(0);
		await broker.drain();
		await sleep(120);

		// The UI drag-disconnect: drop point plus null terminal in one
		// edit (mxEdgeHandler order)
		modelA.beginUpdate();
		try
		{
			var qgeo = modelA.getGeometry(
				modelA.getCell('us_qe1')).clone();
			qgeo.setTerminalPoint(new A.win.mxPoint(600, 700), false);
			modelA.setGeometry(modelA.getCell('us_qe1'), qgeo);
			modelA.setTerminal(modelA.getCell('us_qe1'), null, false);
		}
		finally
		{
			modelA.endUpdate();
		}

		A.flush();
		await broker.drain();
		await sleep(120);

		B.ui.editor.graph.removeCells([modelB.getCell('us_q2')]);
		B.flush();
		await broker.drain();
		await sleep(120);

		// Undo of the disconnect: the reconnect target is dead - the
		// edge must stay visible via a transient point at the dead
		// terminal's center, never vanish without terminal and point
		A.ui.undo();
		var qe1 = modelA.getCell('us_qe1');

		if (qe1 == null)
		{
			report.fail('undo-stale-point', 'edge lost by the undo');
		}
		else
		{
			var qgeoAfter = qe1.getGeometry();
			var qpt = (qgeoAfter != null) ?
				qgeoAfter.getTerminalPoint(false) : null;

			if (qe1.getTerminal(false) != null)
			{
				report.fail('undo-stale-point',
					'undo reconnected to a dead terminal object');
			}

			if (qpt == null)
			{
				report.fail('undo-stale-point',
					'undo left the open end without a terminal point ' +
					'(edge invisible)');
			}
			else if (Math.abs(qpt.x - 420) > 1 ||
				Math.abs(qpt.y - 590) > 1)
			{
				// The frozen RENDERED attachment point (Q2's left
				// border at 420,590 for the straight Q1->Q2 edge),
				// not the dead terminal's center - the edge keeps
				// looking exactly like before the delete
				report.fail('undo-stale-point',
					'terminal point not at the previous attachment: ' +
					qpt.x + ',' + qpt.y);
			}
		}

		// The LOCAL RENDERING must show the repaired edge too: the
		// models converging is not enough (the drain mutates without a
		// model event, so a missing refresh left the edge invisible on
		// this client while the peers rendered it - the manual find)
		var qstate = A.ui.editor.graph.view.getState(qe1);

		if (qstate == null || qstate.absolutePoints == null ||
			qstate.absolutePoints.length < 2 ||
			qstate.absolutePoints[
				qstate.absolutePoints.length - 1] == null)
		{
			report.fail('undo-stale-point',
				'repaired edge is not rendered on the local client');
		}

		A.flush();
		await broker.drain();
		await sleep(120);

		var qe1b = modelB.getCell('us_qe1');
		var qgeoB = (qe1b != null) ? qe1b.getGeometry() : null;
		var qptB = (qgeoB != null) ?
			qgeoB.getTerminalPoint(false) : null;

		if (qptB == null)
		{
			report.fail('undo-stale-point',
				'terminal point did not reach the peer');
		}

		scanClient(A, 'undo-stale-point');
		scanClient(B, 'undo-stale-point');

		// --- Case 12 (manual find, contradictory undos): B moves a
		// shape INTO A's container, A deletes the container (the shape
		// goes with it), then BOTH undo. B's undo re-materializes the
		// shape at top level, A's undo restores the container subtree -
		// which still holds a stale copy of the now-live shape. Before
		// the fix cellAdded's id-collision loop renamed that copy and
		// the shape existed twice (inside the container AND outside).
		// The live object is canonical: the stale copy is dropped, the
		// shape exists exactly once.
		var countByValue = function(client, value)
		{
			var m = client.ui.editor.graph.getModel();
			var hits = [];

			for (var id in m.cells)
			{
				if (m.cells[id].value === value)
				{
					hits.push(id);
				}
			}

			return hits;
		};

		A.ui.selectPage(A.ui.pages[0], true);
		B.ui.selectPage(B.ui.pages[0], true);
		B.ui.editor.graph.insertVertex(null, 'us_dup_s', 'DUP',
			40, 660, 80, 40);
		B.flush();
		await broker.drain();
		await sleep(120);
		await B.save(0);
		await broker.drain();
		await sleep(120);

		var cont = graphA.insertVertex(null, 'us_dup_c', 'CONT',
			300, 640, 200, 160, 'swimlane;whiteSpace=wrap;html=1;');
		A.flush();
		await broker.drain();
		await sleep(120);

		if (findCellAnyPage(B, 'us_dup_c') == null)
		{
			report.fail('undo-stale-dup-setup',
				'container did not reach client1');

			return;
		}

		// B moves the shape into the container
		var modelBb = B.ui.editor.graph.getModel();
		modelBb.beginUpdate();

		try
		{
			var moved = modelBb.getCell('us_dup_s');
			var mgeo = modelBb.getGeometry(moved).clone();
			mgeo.x = 60;
			mgeo.y = 80;
			modelBb.setGeometry(moved, mgeo);
			modelBb.add(modelBb.getCell('us_dup_c'), moved);
		}
		finally
		{
			modelBb.endUpdate();
		}

		B.flush();
		await broker.drain();
		await sleep(150);

		// A deletes the container - the shape goes with it
		A.ui.editor.graph.removeCells(
			[modelA.getCell('us_dup_c')], false);
		A.flush();
		await broker.drain();
		await sleep(150);

		// B undoes its move: the shape returns to top level
		B.ui.undo();
		B.flush();
		await broker.drain();
		await sleep(150);

		// A undoes its delete: the container returns, its stale copy
		// of the shape must NOT be reborn under a renamed id
		A.ui.undo();
		A.flush();
		await broker.drain();
		await sleep(200);

		for (var ci = 0; ci < 2; ci++)
		{
			var hits = countByValue(clients[ci], 'DUP');

			if (hits.length != 1)
			{
				report.fail('undo-stale-dup', clients[ci].name +
					' has ' + hits.length + ' copies of the shape [' +
					hits.join(',') + '] after the contradictory undos');
			}
			else if (hits[0] != 'us_dup_s')
			{
				report.fail('undo-stale-dup', clients[ci].name +
					' renamed the shape to ' + hits[0] +
					' (replays must never mint an id)');
			}

			if (findCellAnyPage(clients[ci], 'us_dup_c') == null)
			{
				report.fail('undo-stale-dup', clients[ci].name +
					' lost the restored container');
			}
		}

		scanClient(A, 'undo-stale-dup');
		scanClient(B, 'undo-stale-dup');

		// --- Case 13 (manual find, redo across a peer's delete+undo):
		// A moves a shape into a container and UNDOES that; the peer
		// then deletes the container and undoes the delete (it comes
		// back as a NEW object of the same id); A REDOES its move. The
		// shape must survive and land inside the container - it
		// vanished from the model entirely.
		graphA.insertVertex(null, 'us_rd_s', 'RD', 40, 760, 80, 40);
		graphA.insertVertex(null, 'us_rd_c', 'RDC', 300, 740, 200, 160,
			'swimlane;whiteSpace=wrap;html=1;');
		A.flush();
		await broker.drain();
		await sleep(120);
		await A.save(0);
		await broker.drain();
		await sleep(120);

		modelA.beginUpdate();

		try
		{
			modelA.add(modelA.getCell('us_rd_c'),
				modelA.getCell('us_rd_s'));
		}
		finally
		{
			modelA.endUpdate();
		}

		var rdState = function(label)
		{
			var out = [];

			for (var ci = 0; ci < 2; ci++)
			{
				var s = findCellAnyPage(clients[ci], 'us_rd_s');
				var c = findCellAnyPage(clients[ci], 'us_rd_c');
				out.push(clients[ci].name + ': shape=' +
					((s == null) ? 'GONE' : 'parent ' +
						((s.getParent() != null) ?
							s.getParent().getId() : 'null')) +
					' cont=' + ((c == null) ? 'GONE' : 'ok'));
			}

			report.log('rd[' + label + '] ' + out.join(' | '));
		};

		A.flush();
		await broker.drain();
		await sleep(150);
		rdState('after-move');

		// A undoes the move: the shape is back at top level everywhere
		A.ui.undo();
		A.flush();
		await broker.drain();
		await sleep(150);
		rdState('after-undo');

		if (findCellAnyPage(B, 'us_rd_s') == null)
		{
			report.fail('undo-stale-redo-setup',
				'shape missing on client1 before the delete');

			return;
		}

		// The peer deletes the container and undoes that
		B.ui.editor.graph.removeCells(
			[modelB.getCell('us_rd_c')], false);
		B.flush();
		await broker.drain();
		await sleep(150);
		rdState('after-peer-delete');

		B.ui.undo();
		B.flush();
		await broker.drain();
		await sleep(150);
		rdState('after-peer-undo');

		// A redoes its move against the re-materialized container
		A.ui.redo();
		rdState('after-redo-local');
		A.flush();
		await broker.drain();
		await sleep(200);
		rdState('after-redo-flush');

		for (var ci = 0; ci < 2; ci++)
		{
			var rdShape = findCellAnyPage(clients[ci], 'us_rd_s');
			var rdCont = findCellAnyPage(clients[ci], 'us_rd_c');

			if (rdShape == null)
			{
				report.fail('undo-stale-redo', clients[ci].name +
					' LOST the shape after the redo');
			}
			else if (rdCont != null && rdShape.getParent() != rdCont)
			{
				report.fail('undo-stale-redo', clients[ci].name +
					' redo did not move the shape into the container ' +
					'(parent=' + ((rdShape.getParent() != null) ?
						rdShape.getParent().getId() : 'null') + ')');
			}

			if (rdCont == null)
			{
				report.fail('undo-stale-redo', clients[ci].name +
					' lost the restored container');
			}
		}

		scanClient(A, 'undo-stale-redo');
		scanClient(B, 'undo-stale-redo');

		// --- Case 14 (like 13, but the peer does NOT undo): the redo
		// target is gone for good. The replay cannot honour the
		// intention, but it must never lose the shape - moving it into
		// the dead container would take it out of the document.
		graphA.insertVertex(null, 'us_rg_s', 'RG', 40, 860, 80, 40);
		graphA.insertVertex(null, 'us_rg_c', 'RGC', 300, 840, 200, 160,
			'swimlane;whiteSpace=wrap;html=1;');
		A.flush();
		await broker.drain();
		await sleep(120);
		await A.save(0);
		await broker.drain();
		await sleep(120);

		modelA.beginUpdate();

		try
		{
			modelA.add(modelA.getCell('us_rg_c'),
				modelA.getCell('us_rg_s'));
		}
		finally
		{
			modelA.endUpdate();
		}

		A.flush();
		await broker.drain();
		await sleep(150);

		A.ui.undo();
		A.flush();
		await broker.drain();
		await sleep(150);

		// The peer deletes the container and KEEPS it deleted
		B.ui.editor.graph.removeCells(
			[modelB.getCell('us_rg_c')], false);
		B.flush();
		await broker.drain();
		await sleep(150);

		// A redoes into a container that no longer exists
		A.ui.redo();
		A.flush();
		await broker.drain();
		await sleep(200);

		for (var ci = 0; ci < 2; ci++)
		{
			var rgShape = findCellAnyPage(clients[ci], 'us_rg_s');

			if (rgShape == null)
			{
				report.fail('undo-stale-redo-gone', clients[ci].name +
					' LOST the shape when the redo target was gone');
			}
			else
			{
				// Attached to a live tree, not to a removed container
				var walker = rgShape;

				while (walker.getParent() != null)
				{
					walker = walker.getParent();
				}

				var rgModel = clients[ci].ui.editor.graph.getModel();

				if (walker != rgModel.getRoot() ||
					rgModel.getCell('us_rg_s') != rgShape)
				{
					report.fail('undo-stale-redo-gone', clients[ci].name +
						' shape hangs outside the document after the redo');
				}
			}

			if (findCellAnyPage(clients[ci], 'us_rg_c') != null)
			{
				report.fail('undo-stale-redo-gone', clients[ci].name +
					' resurrected the deleted container');
			}
		}

		scanClient(A, 'undo-stale-redo-gone');
		scanClient(B, 'undo-stale-redo-gone');

		// --- Case 15 (manual find, replay cycles while the target is
		// dead): like 13, but A redoes and undoes AGAIN while the peer
		// has the container deleted. Those replays run the dead-target
		// fallback, which rebases the geometry to keep the shape in
		// place - and that direct write must not corrupt the recorded
		// geometry of the edit: after the peer restores the container
		// the final redo has to put the shape back at its container
		// RELATIVE position, not at the absolute one.
		graphA.insertVertex(null, 'us_gp_s', 'GP', 40, 960, 80, 40);
		graphA.insertVertex(null, 'us_gp_c', 'GPC', 300, 940, 200, 160,
			'swimlane;whiteSpace=wrap;html=1;');
		A.flush();
		await broker.drain();
		await sleep(120);
		await A.save(0);
		await broker.drain();
		await sleep(120);

		// The drag into the container: reparent AND rebase the
		// geometry in ONE edit, like the editor does
		modelA.beginUpdate();

		try
		{
			var gpGeo = modelA.getGeometry(
				modelA.getCell('us_gp_s')).clone();
			gpGeo.x = 30;
			gpGeo.y = 40;
			modelA.setGeometry(modelA.getCell('us_gp_s'), gpGeo);
			modelA.add(modelA.getCell('us_gp_c'),
				modelA.getCell('us_gp_s'));
		}
		finally
		{
			modelA.endUpdate();
		}

		A.flush();
		await broker.drain();
		await sleep(150);

		A.ui.undo();
		A.flush();
		await broker.drain();
		await sleep(150);

		// The peer deletes the container
		B.ui.editor.graph.removeCells(
			[modelB.getCell('us_gp_c')], false);
		B.flush();
		await broker.drain();
		await sleep(150);

		// A cycles the replay while the target is dead
		A.ui.redo();
		A.ui.undo();
		A.flush();
		await broker.drain();
		await sleep(150);

		// The peer brings the container back
		B.ui.undo();
		B.flush();
		await broker.drain();
		await sleep(150);

		// And now the redo must land the shape INSIDE the container at
		// its recorded relative position
		A.ui.redo();
		A.flush();
		await broker.drain();
		await sleep(200);

		for (var ci = 0; ci < 2; ci++)
		{
			var gpShape = findCellAnyPage(clients[ci], 'us_gp_s');
			var gpCont = findCellAnyPage(clients[ci], 'us_gp_c');

			if (gpShape == null || gpCont == null)
			{
				report.fail('undo-stale-geo', clients[ci].name +
					' lost the shape or the container');
			}
			else if (gpShape.getParent() != gpCont)
			{
				report.fail('undo-stale-geo', clients[ci].name +
					' shape is not inside the container (parent=' +
					((gpShape.getParent() != null) ?
						gpShape.getParent().getId() : 'null') + ')');
			}
			else
			{
				var g = gpShape.getGeometry();

				if (g == null || g.x != 30 || g.y != 40)
				{
					report.fail('undo-stale-geo', clients[ci].name +
						' shape sits at ' + ((g != null) ?
							g.x + ',' + g.y : 'null') +
						' inside the container instead of 30,40 ' +
						'(absolute coordinates survived the replay)');
				}
			}
		}

		scanClient(A, 'undo-stale-geo');
		scanClient(B, 'undo-stale-geo');

		// --- Case 16 (property replays across a concurrent remote
		// change of the SAME property): execute swaps the field with
		// the live model value, so a remote label or style change
		// between two replays would become the recorded intention and
		// the redo would re-apply the REMOTE value instead of the
		// user's own. Undo restores what the user had before the edit,
		// redo restores the user's edit - the remote value is simply
		// overwritten (last action wins), never resurrected.
		graphA.insertVertex(null, 'us_pr_v', 'ORIG', 40, 1060, 80, 40,
			'rounded=0;whiteSpace=wrap;html=1;');
		A.flush();
		await broker.drain();
		await sleep(120);
		await A.save(0);
		await broker.drain();
		await sleep(120);

		// A relabels and restyles its own shape
		modelA.beginUpdate();

		try
		{
			modelA.setValue(modelA.getCell('us_pr_v'), 'MINE');
			modelA.setStyle(modelA.getCell('us_pr_v'),
				'rounded=1;whiteSpace=wrap;html=1;');
		}
		finally
		{
			modelA.endUpdate();
		}

		A.flush();
		await broker.drain();
		await sleep(150);

		// The peer overwrites both properties
		var prModelB = B.ui.editor.graph.getModel();
		prModelB.beginUpdate();

		try
		{
			prModelB.setValue(prModelB.getCell('us_pr_v'), 'THEIRS');
			prModelB.setStyle(prModelB.getCell('us_pr_v'),
				'ellipse;whiteSpace=wrap;html=1;');
		}
		finally
		{
			prModelB.endUpdate();
		}

		B.flush();
		await broker.drain();
		await sleep(150);

		// A undoes: its own pre-edit state comes back
		A.ui.undo();
		A.flush();
		await broker.drain();
		await sleep(150);

		var prCell = modelA.getCell('us_pr_v');

		if (prCell == null || prCell.value != 'ORIG' ||
			(prCell.getStyle() || '').indexOf('rounded=0') < 0)
		{
			report.fail('undo-stale-prop',
				'undo did not restore the pre-edit label and style ' +
				'(value=' + ((prCell != null) ? prCell.value : 'null') +
				' style=' + ((prCell != null) ?
					(prCell.getStyle() || '').substring(0, 30) : '-') + ')');
		}

		// And redo restores A's OWN edit, not the peer's values
		A.ui.redo();
		A.flush();
		await broker.drain();
		await sleep(150);

		prCell = modelA.getCell('us_pr_v');

		if (prCell == null || prCell.value != 'MINE' ||
			(prCell.getStyle() || '').indexOf('rounded=1') < 0)
		{
			report.fail('undo-stale-prop',
				'redo did not restore the own label and style ' +
				'(value=' + ((prCell != null) ? prCell.value : 'null') +
				' style=' + ((prCell != null) ?
					(prCell.getStyle() || '').substring(0, 30) : '-') + ')');
		}

		var prPeer = findCellAnyPage(B, 'us_pr_v');

		if (prPeer == null || prPeer.value != 'MINE')
		{
			report.fail('undo-stale-prop',
				'the replayed label did not reach the peer (value=' +
				((prPeer != null) ? prPeer.value : 'null') + ')');
		}

		scanClient(A, 'undo-stale-prop');
		scanClient(B, 'undo-stale-prop');

		// --- Case 17 (manual find): c1 disconnects an edge from B; c2
		// deletes B and undoes, but the undo reaches c1 only through
		// the save and cleanup path (B is a NEW object on c1); c1
		// undoes its disconnect (reconnect resolves to that object);
		// c2 redoes its delete. ONE further undo on c2 must restore B
		// with the edge CONNECTED on both clients: the repair
		// sanitizer must neither sever a reconnect whose terminal was
		// replaced by a patch (the id lives - resolve canonically, do
		// not disconnect) nor record its repair as an undoable edit
		// (found: a phantom history step - one delete needing two
		// undos - and a permanently disconnected edge, with the
		// planted point at B's center as the sanitizer's signature).
		graphA.insertVertex(null, 'us17_a', 'SA', 180, 1160, 120, 60);
		graphA.insertVertex(null, 'us17_b', 'SB', 420, 1150, 120, 80,
			'ellipse;whiteSpace=wrap;html=1;');
		var e17 = graphA.insertEdge(null, 'us17_e', '',
			modelA.getCell('us17_a'), modelA.getCell('us17_b'),
			'edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;');
		var g17 = modelA.getGeometry(e17).clone();
		g17.setTerminalPoint(new A.win.mxPoint(420, 1190), false);
		modelA.setGeometry(e17, g17);
		A.flush();
		await broker.drain();
		await sleep(120);
		await A.save(0);
		await broker.drain();
		await sleep(120);

		// c1 disconnects from B (point + null terminal in one edit,
		// like the interactive disconnect)
		modelA.beginUpdate();

		try
		{
			var dgeo = modelA.getGeometry(
				modelA.getCell('us17_e')).clone();
			dgeo.setTerminalPoint(new A.win.mxPoint(560, 1190), false);
			modelA.setGeometry(modelA.getCell('us17_e'), dgeo);
			modelA.setTerminal(modelA.getCell('us17_e'), null, false);
		}
		finally
		{
			modelA.endUpdate();
		}

		A.flush();
		await broker.drain();
		await sleep(150);

		// c2 deletes B
		B.ui.editor.graph.removeCells([modelB.getCell('us17_b')], false);
		B.flush();
		await broker.drain();
		await sleep(150);

		// c2 undoes the delete, but the live diff never reaches c1 -
		// it arrives through the save and the cleanup instead, so B is
		// a NEW object on c1
		A.unjoined = true;
		B.ui.undo();
		B.flush();
		await broker.drain();
		broker.liveLog = [];
		A.unjoined = false;
		await B.save(0);
		await broker.drain();
		await sleep(150);
		A.cleanupNow();
		await broker.drain();
		await sleep(150);

		if (findCellAnyPage(A, 'us17_b') == null)
		{
			report.fail('undo-stale-reconnect-setup',
				'the revived terminal did not reach client0 via cleanup');

			return;
		}

		var st17 = function(label)
		{
			var out = [];

			for (var ci = 0; ci < 2; ci++)
			{
				var e = findCellAnyPage(clients[ci], 'us17_e');
				var b = findCellAnyPage(clients[ci], 'us17_b');
				var t = (e != null) ? e.getTerminal(false) : null;
				var tp = (e != null && e.getGeometry() != null) ?
					e.getGeometry().getTerminalPoint(false) : null;
				out.push(clients[ci].name + ': tgt=' +
					((t == null) ? 'null' : t.getId() +
						((b != null && t == b) ? '(live)' : '(STALE)')) +
					' pt=' + ((tp != null) ? tp.x + ',' + tp.y : '-') +
					' B=' + (b != null));
			}

			report.log('c17[' + label + '] ' + out.join(' | '));
		};

		// c1 undoes its disconnect: the reconnect must resolve to the
		// replaced object
		st17('before-c1-undo');
		A.ui.undo();
		st17('c1-undo-local');
		A.flush();
		await broker.drain();
		await sleep(150);
		st17('c1-undo-flushed');

		// c2 redoes its delete
		B.ui.redo();
		B.flush();
		await broker.drain();
		await sleep(150);
		st17('c2-redo');

		// ONE undo on c2 must bring B back, connected
		B.ui.undo();
		st17('c2-undo-local');
		B.flush();
		await broker.drain();
		await sleep(250);
		st17('c2-undo-flushed');

		for (var ci = 0; ci < 2; ci++)
		{
			var b17 = findCellAnyPage(clients[ci], 'us17_b');
			var edge17 = findCellAnyPage(clients[ci], 'us17_e');

			if (b17 == null)
			{
				report.fail('undo-stale-reconnect', clients[ci].name +
					' did not restore the terminal with ONE undo ' +
					'(phantom history step)');
			}

			if (edge17 == null)
			{
				report.fail('undo-stale-reconnect', clients[ci].name +
					' lost the edge');
			}
			else if (b17 != null &&
				edge17.getTerminal(false) != b17)
			{
				var tp = (edge17.getGeometry() != null) ?
					edge17.getGeometry().getTerminalPoint(false) : null;
				report.fail('undo-stale-reconnect', clients[ci].name +
					' edge is not connected to the restored terminal ' +
					'(target=' + ((edge17.getTerminal(false) != null) ?
						edge17.getTerminal(false).getId() : 'null') +
					' point=' + ((tp != null) ? tp.x + ',' + tp.y : '-') +
					')');
			}
		}

		scanClient(A, 'undo-stale-reconnect');
		scanClient(B, 'undo-stale-reconnect');

		// Convergence: BOTH clients save (B's deletes and resurrect are
		// unconfirmed until saved - cleanup restores unconfirmed remote
		// deletes on screen by design), then cleanups adopt the saved
		// state and the trees must be equal
		await A.save(0);
		await broker.drain();
		await sleep(120);
		await B.save(0);
		await broker.drain();
		await sleep(120);

		if (!B.file.isModified())
		{
			B.cleanupNow();
		}

		if (!A.file.isModified())
		{
			A.cleanupNow();
		}

		await sleep(120);
		scanClient(A, 'undo-stale-final');
		scanClient(B, 'undo-stale-final');

		if (A.getPagesHash() != B.getPagesHash())
		{
			report.fail('undo-stale-convergence',
				'clients did not converge after save/cleanup: A=' +
				A.getCanonicalXml().substring(0, 600) + ' B=' +
				B.getCanonicalXml().substring(0, 600));
		}
	};

	// A peer can legally reverse a container relation after a local drag.
	// Reject the whole conflicting undo/redo, including sibling geometry.
	async function runUndoAncestryCycle(clients, broker, report)
	{
		var A = clients[0];
		var B = clients[1];
		var ga = A.ui.editor.graph;
		var gb = B.ui.editor.graph;
		var ma = ga.model;
		var mb = gb.model;
		var history = A.ui.editor.undoManager;
		var settle = async function(client)
		{
			client.flush();
			await broker.drain();
			await sleep(150);
		};
		var check = function(condition, detail)
		{
			if (!condition)
			{
				report.fail('undo-ancestry-cycle', detail);
			}
		};
		var replay = function(direction)
		{
			var before = history.indexOfNextAdd;
			var length = history.history.length;
			A.ui[direction]();
			check(history.indexOfNextAdd == before + (direction == 'undo' ? -1 : 1) &&
				history.history.length == length, direction + ' must consume exactly one step');
		};
		var rect = function(cell)
		{
			var g = cell.geometry;
			return [g.x, g.y, g.width, g.height].join(',');
		};
		var style = 'container=1;collapsible=0;recursiveResize=0;';
		var fixture = async function(id, nested)
		{
			var g = ga.insertVertex(null, id + 'g', 'G', 100, 100, 600, 500, style);
			var x = ga.insertVertex(nested ? g : null, id + 'x', 'X', 30, 40, 300, 200, style);
			var h = ga.insertVertex(null, id + 'h', 'H', 1500, 100, 900, 700, style);
			await settle(A);
			await A.save(0);
			await broker.drain();
			await sleep(150);
			history.clear();
			B.ui.editor.undoManager.clear();
			return {g: g, x: x, h: h};
		};
		var peerMove = async function(cell, target)
		{
			gb.moveCells([mb.getCell(cell.id)], 0, 0, false,
				target == null ? gb.getDefaultParent() : mb.getCell(target.id));
			await settle(B);
		};
		var frozenIntents = function(edit)
		{
			return JSON.stringify(edit.changes.map(function(c)
			{
				var intent = c.repairIntent;
				return intent == null ? null : {next: intent.next, ids: intent.ids,
					indices: intent.indices, values: intent.values,
					undoParent: intent.objs && intent.objs.undo && intent.objs.undo.id,
					redoParent: intent.objs && intent.objs.redo && intent.objs.redo.id};
			}));
		};
		var unchangedReplay = async function(direction, edit, frozen, context)
		{
			var before = A.getCanonicalXml();
			var peerBefore = B.getCanonicalXml();
			replay(direction);
			check(A.getCanonicalXml() == before, context + ': partial operation changed document');
			check(edit.undone == (direction == 'undo') && edit.redone == (direction == 'redo'),
				context + ': edit flags disagree with history');
			check(frozenIntents(edit) == frozen,
				context + ': rejected pair changed frozen intentions');
			await settle(A);
			check(B.getCanonicalXml() == peerBefore, context + ': inert replay changed peer');
		};

		// A safety interlock makes the unpatched regression fail promptly,
		// even though the core model would hang. It is never reached with
		// the fix; the exact uninstrumented model is tested by the bounded
		// Node probe below. Do not run a browser hang without this boundary.
		var parentChanged = ma.parentForCellChanged;
		var unsafeWrites = 0;
		ma.parentForCellChanged = function(child, parent)
		{
			if (parent != null && this.isAncestor(child, parent))
			{
				unsafeWrites++;
				return child.parent;
			}

			return parentChanged.apply(this, arguments);
		};

		try
		{
			var f = await fixture('uac_undo_', true);
			var original = rect(f.x);
			ga.moveCells([f.x], 700, 0, false, ga.getDefaultParent());
			var moved = rect(f.x);
			await settle(A);
			var edit = history.history[history.history.length - 1];
			var frozen = frozenIntents(edit);
			check(edit.changes.some(function(c) { return c instanceof A.win.mxGeometryChange; }) &&
				edit.changes.some(function(c) { return c instanceof A.win.mxChildChange; }),
				'fixture must record real drag geometry and reparenting');
			await peerMove(f.g, f.x);
			await unchangedReplay('undo', edit, frozen, 'first conflict');
			await unchangedReplay('redo', edit, frozen, 'paired redo');
			await unchangedReplay('undo', edit, frozen, 'repeated conflict');
			await peerMove(f.g, null);
			await unchangedReplay('redo', edit, frozen, 'peer fixed hierarchy before paired redo');
			replay('undo');
			check(f.x.parent == f.g && rect(f.x) == original, 'retry did not restore original parent/geometry');
			await settle(A);
			await peerMove(f.x, f.h);
			replay('redo');
			check(f.x.parent == ga.getDefaultParent() && rect(f.x) == moved,
				'redo lost frozen target after peer reparent');
			await settle(A);
			await peerMove(f.x, f.h);
			replay('undo');
			check(f.x.parent == f.g && rect(f.x) == original,
				'undo lost frozen target after another peer reparent');
			await settle(A);

			// Redo runs geometry BEFORE the child change, so a guard only
			// at the parent write would still partially apply this drag.
			f = await fixture('uac_redo_', false);
			ga.moveCells([f.x], 100, 20, false, f.g);
			var inside = rect(f.x);
			await settle(A);
			replay('undo');
			await settle(A);
			edit = history.history[history.history.length - 1];
			frozen = frozenIntents(edit);
			await peerMove(f.g, f.x);
			await unchangedReplay('redo', edit, frozen, 'redo conflict');
			await unchangedReplay('undo', edit, frozen, 'paired undo');
			await unchangedReplay('redo', edit, frozen, 'repeated redo conflict');
			await peerMove(f.g, null);
			await unchangedReplay('undo', edit, frozen, 'peer fixed hierarchy before paired undo');
			replay('redo');
			check(f.x.parent == f.g && rect(f.x) == inside, 'redo retry lost its frozen intention');
			await settle(A);

			// One operation reverses the nesting legally in two moves. In
			// both directions the first move makes the second safe.
			f = await fixture('uac_order_', true);
			var before = A.getCanonicalXml();
			ma.beginUpdate();
			try
			{
				ga.moveCells([f.x], 700, 0, false, ga.getDefaultParent());
				ga.moveCells([f.g], 0, 0, false, f.x);
			}
			finally
			{
				ma.endUpdate();
			}
			var after = A.getCanonicalXml();
			for (var pass = 0; pass < 2; pass++)
			{
				replay('undo');
				check(A.getCanonicalXml() == before, 'ordered composite undo falsely rejected');
				replay('redo');
				check(A.getCanonicalXml() == after, 'ordered composite redo falsely rejected');
			}
			await settle(A);

			// A skipped composite may contain custom toggle-only changes.
			// Neither half of the inert pair may execute that sibling.
			f = await fixture('uac_custom_', true);
			var value = 'before';
			var custom = {previous: 'after', execute: function()
			{
				var tmp = value;
				value = this.previous;
				this.previous = tmp;
			}};
			ma.beginUpdate();
			try
			{
				ma.execute(custom);
				ga.moveCells([f.x], 700, 0, false, ga.getDefaultParent());
			}
			finally
			{
				ma.endUpdate();
			}
			await settle(A);
			await peerMove(f.g, f.x);
			replay('undo');
			replay('redo');
			check(value == 'after' && custom.previous == 'before', 'custom toggle changed in inert pair');
			await peerMove(f.g, null);
			replay('undo');
			check(value == 'before' && custom.previous == 'after', 'custom toggle lost undo state');
			replay('redo');
			check(value == 'after' && custom.previous == 'before', 'custom toggle lost redo state');
			await settle(A);
			// A page selection grouped with the drag must also stay inert
			// on a conflict. Repeated cell ids on the other page must not
			// affect canonical resolution or receive the rejected geometry.
			var home = A.ui.currentPage;
			var other = A.ui.insertPage();
			var sentinel = ga.insertVertex(null, 'uac_pages_x', 'sentinel', 40, 50, 80, 60);
			await settle(A);
			A.ui.selectPage(home, true);
			f = await fixture('uac_pages_', true);
			original = rect(f.x);
			ma.beginUpdate();
			try
			{
				ga.moveCells([f.x], 700, 0, false, ga.getDefaultParent());
				// selectPage() deliberately creates a separate history edit;
				// explicitly group its real change type for this composite control.
				ma.execute(new A.win.SelectPage(A.ui, other));
			}
			finally
			{
				ma.endUpdate();
			}
			await settle(A);
			edit = history.history[history.history.length - 1];
			check(history.history.length == 1 && edit.changes.some(function(c)
			{ return c instanceof A.win.SelectPage; }), 'page switch must be part of the same composite');
			frozen = frozenIntents(edit);
			await peerMove(f.g, f.x);
			await unchangedReplay('undo', edit, frozen, 'mixed page conflict');
			check(A.ui.currentPage == other && sentinel.geometry.x == 40,
				'rejected edit selected a page or changed a same-id sentinel');
			await peerMove(f.g, null);
			await unchangedReplay('redo', edit, frozen, 'mixed page paired redo');
			replay('undo');
			check(A.ui.currentPage == home && f.x.parent == f.g && rect(f.x) == original,
				'mixed page retry: page=' + A.ui.currentPage.getId() + ', expected=' + home.getId() +
				', parent=' + f.x.parent.id + ', rect=' + rect(f.x) + ', expected rect=' + original);
			check(sentinel.geometry.x == 40 && sentinel.value == 'sentinel',
				'mixed page retry mutated foreign same-id content');
			await settle(A);
			check(unsafeWrites == 0, 'attempted ' + unsafeWrites + ' cyclic model writes');
			report.log('undo-ancestry-cycle: real drags, both directions, retries, ordered composites, custom siblings checked');
		}
		finally
		{
			ma.parentForCellChanged = parentChanged;
		}
	};

	// Whole-page removal and re-insertion replaces BOTH DiagramPage and
	// its cells. History must follow the page ID without crossing into
	// another page with the same cell IDs, and must stay inert while absent.
	async function runPageRevivalUndo(clients, broker, report)
	{
		var A = clients[0];
		var B = clients[1];
		var graph = A.ui.editor.graph;
		var model = graph.model;
		var page = function(client, id)
		{
			return client.ui.pages.filter(function(p) { return p.getId() == id; })[0];
		};
		var cells = function(client, id, pages)
		{
			var p = (pages != null) ? pages.filter(function(p)
			{
				return p.getId() == id;
			})[0] : page(client, id);
			client.ui.updatePageRoot(p);
			return client.ui.createCellLookup(p.root);
		};
		var settle = async function(client, save)
		{
			client.flush();
			await broker.drain();
			await sleep(150);

			if (save)
			{
				await client.save(0);
				await broker.drain();
				await sleep(150);
			}
		};
		var check = function(ok, detail)
		{
			if (!ok) report.fail('page-revival-undo', detail);
		};
		A.ui.selectPage(page(A, 'page-a'));
		graph.insertVertex(null, 'pr_x', 'OTHER PAGE', 5, 6, 80, 40,
			'fillColor=#00ff00;');
		await settle(A, true);
		var treeXml = function(root)
		{
			var codec = new A.win.mxCodec();
			var node = codec.document.createElement('root');
			codec.encodeCell(root, node);
			return A.win.mxUtils.getXml(node);
		};
		var sentinel = cells(A, 'page-a').pr_x.cell;
		var sentinelXml = A.win.mxUtils.getXml(new A.win.mxCodec().encode(sentinel));
		var kinds = ['style', 'geometry', 'value', 'visible', 'collapsed',
			'terminal', 'reparent', 'delete', 'absent-style', 'absent-reparent'];

		for (var k = 0; k < kinds.length; k++)
		{
			var kind = kinds[k];
			A.ui.selectPage(page(A, 'page-b'));
			graph.removeCells((model.getChildren(graph.getDefaultParent()) || []).slice());
			var group = graph.insertVertex(null, 'pr_g', 'G', 100, 100, 400, 300,
				'container=1;');
			var x = graph.insertVertex(null, 'pr_x', 'X', 40, 40, 80, 40,
				'fillColor=#ffffff;');
			var y = graph.insertVertex(null, 'pr_y', 'Y', 250, 40, 80, 40);
			var edge = graph.insertEdge(null, 'pr_e', 'E', x, y);
			await settle(A, true);
			A.ui.editor.undoManager.clear();
			B.ui.editor.undoManager.clear();
			var snapshot = function(client, pages)
			{
				var lookup = cells(client, 'page-b', pages);
				var v = lookup.pr_x != null ? lookup.pr_x.cell : null;
				var e = lookup.pr_e != null ? lookup.pr_e.cell : null;
				return JSON.stringify({present: v != null,
					style: v != null ? v.style : null,
					value: v != null ? v.value : null,
					visible: v != null ? !!v.visible : null,
					collapsed: v != null ? !!v.collapsed : null,
					parent: v != null ? v.parent.id : null,
					geometry: v != null ? [v.geometry.x, v.geometry.y] : null,
					source: e != null && e.source != null ? e.source.id : null,
					target: e != null && e.target != null ? e.target.id : null});
			};
			var before = snapshot(A);
			var oldPage = A.ui.currentPage;

			if (kind == 'style' || kind == 'absent-style')
				graph.setCellStyles('fillColor', '#ff0000', [x]);
			if (kind == 'geometry') graph.moveCells([x], 70, 20);
			if (kind == 'value') graph.cellLabelChanged(x, 'LOCAL');
			if (kind == 'visible') model.setVisible(x, false);
			if (kind == 'collapsed') model.setCollapsed(x, true);
			if (kind == 'terminal') graph.connectCell(edge, group, false);
			if (kind == 'reparent' || kind == 'absent-reparent')
				graph.moveCells([x], 180, 100, false, group);
			if (kind == 'delete') graph.removeCells([x]);
			await settle(A, true);
			var applied = snapshot(A);
			check(before != applied, kind + ': setup edit did not change state');
			var oldXml = treeXml(oldPage.root);
			var history = A.ui.editor.undoManager;
			check(history.history.length == 1, kind + ': expected one local edit');

			B.ui.removePage(page(B, 'page-b'));
			await settle(B, k % 2 == 1);
			var absent = kind.indexOf('absent-') == 0;

			if (absent)
			{
				A.ui.undo();
				await settle(A, false);
				check(page(A, 'page-b') == null && page(B, 'page-b') == null,
					kind + ': cell undo resurrected an absent page');
				check(history.indexOfNextAdd == 0, kind + ': absent undo cursor');
				check(treeXml(oldPage.root) == oldXml,
					kind + ': absent replay mutated the abandoned page');
			}

			B.ui.undo();
			await settle(B, k % 2 == 1);
			check(page(A, 'page-b') != oldPage, kind + ': page object was not replaced');
			check(kind == 'delete' || cells(A, 'page-b').pr_x.cell != x,
				kind + ': cell object was not replaced');

			if (kind == 'style')
			{
				// Page names and positions are not identity.
				B.ui.editor.graph.model.execute(new B.win.RenamePage(B.ui,
					page(B, 'page-b'), 'Revived page'));
				B.ui.movePage(B.ui.pages.indexOf(page(B, 'page-b')), 0);
				await settle(B, true);
				// Ordinary tab navigation creates its own undo entry.
				A.ui.selectPage(page(A, 'page-b'));
				A.ui.undo();
				check(A.ui.currentPage.getId() == 'page-a', 'tab undo did not return to A');
			}

			var directions = absent ? ['redo', 'undo', 'redo', 'undo'] :
				['undo', 'redo', 'undo', 'redo', 'undo'];

			for (var r = 0; r < directions.length; r++)
			{
				var direction = directions[r];
				A.ui[direction]();
				var expected = direction == 'undo' ? before : applied;
				check(snapshot(A) == expected, kind + ': local ' + direction + ' ' + r +
					' expected ' + expected + ', got ' + snapshot(A));
				check(history.indexOfNextAdd == (direction == 'undo' ? 0 : 1),
					kind + ': wrong history direction');
				if (kind != 'delete')
					check(treeXml(oldPage.root) == oldXml,
						kind + ': replay mutated the abandoned page');
				var lookup = cells(A, 'page-b');
				if (lookup.pr_e != null)
				{
					var liveEdge = lookup.pr_e.cell;
					check(liveEdge.source == lookup.pr_x.cell && liveEdge.target != null &&
						liveEdge.target == lookup[liveEdge.target.id].cell,
						kind + ': edge references a stale terminal');
				}
				await settle(A, false);
				check(snapshot(B) == expected, kind + ': peer ' + direction + ' ' + r);
			}

			if (kind == 'delete')
			{
				if (cells(A, 'page-b').pr_x == null || cells(B, 'page-b').pr_x == null)
				{
					check(false, 'delete: restore prerequisite missing for inbound-edge control');
					continue;
				}

				// A peer creates a new inbound edge AFTER the local delete
				// has been undone on the revived page. Replaying that delete
				// from page A must sever/reconnect it in page B, not A's map.
				B.ui.selectPage(page(B, 'page-b'), true);
				var bg = B.ui.editor.graph;
				bg.insertEdge(null, 'pr_peer', 'PEER', bg.model.getCell('pr_x'),
					bg.model.getCell('pr_y'));
				await settle(B, true);

				for (var pass = 0; pass < 2; pass++)
				{
					A.ui.redo();
					var peerEdge = cells(A, 'page-b').pr_peer.cell;
					check(peerEdge.source == null && peerEdge.geometry.sourcePoint != null,
						'delete: offscreen replay retained a dead inbound terminal');
					await settle(A, false);
					A.ui.undo();
					var live = cells(A, 'page-b');
					check(live.pr_peer != null && live.pr_x != null &&
						live.pr_peer.cell.source == live.pr_x.cell,
						'delete: offscreen undo did not reconnect canonical endpoint');
					await settle(A, false);
				}
			}

			if (kind == 'reparent')
			{
				// Resolve again on every direction after a SECOND remote
				// object replacement inside the revived page.
				B.ui.selectPage(page(B, 'page-b'), true);
				var bg = B.ui.editor.graph;
				var prior = cells(A, 'page-b').pr_x.cell;
				bg.removeCells([bg.model.getCell('pr_x')]);
				await settle(B, true);
				B.ui.undo();
				await settle(B, true);
				check(cells(A, 'page-b').pr_x.cell != prior, 'reparent: second replacement missing');
				A.ui.redo();
				check(snapshot(A) == applied, 'reparent: redo used the old cell incarnation');
				await settle(A, false);
				A.ui.undo();
				check(snapshot(A) == before, 'reparent: repeated replacement erased undo intent');
				await settle(A, false);
			}

			check(A.win.mxUtils.getXml(new A.win.mxCodec().encode(sentinel)) == sentinelXml,
				kind + ': another page with the same cell ID changed');
			check(snapshot(A, A.ui.getPagesForXml(A.ui.getFileData(true))) == before,
				kind + ': offscreen page XML cache is stale');
			await settle(A, true);
			var savedPages = A.ui.getPagesForXml(broker.lastSavedData);
			check(snapshot(A, savedPages) == before,
				kind + ': saved file omitted the offscreen undo');
			check(savedPages.every(function(p)
			{
				A.ui.updatePageRoot(p);
				return treeXml(p.root).indexOf('repairPage') < 0;
			}), kind + ': runtime provenance leaked into saved XML');
			report.log('page-revival-undo: ' + kind + ' checked');
		}

		// A composite can own changes on two pages. Missing B must not
		// prevent A's part from replaying, even with matching content IDs.
		A.ui.selectPage(page(A, 'page-b'), true);
		var bx = cells(A, 'page-b').pr_x.cell;
		var originalA = sentinel.style;
		var originalB = bx.style;
		A.ui.editor.undoManager.clear();
		B.ui.editor.undoManager.clear();
		model.beginUpdate();
		try
		{
			model.setStyle(sentinel, 'fillColor=#123456;');
			model.setStyle(bx, 'fillColor=#654321;');
		}
		finally
		{
			model.endUpdate();
		}
		await settle(A, true);
		B.ui.removePage(page(B, 'page-b'));
		await settle(B, true);
		A.ui.undo();
		check(sentinel.style == originalA && bx.style == 'fillColor=#654321;',
			'mixed edit: absent B blocked A or mutated old B');
		await settle(A, true);
		B.ui.undo();
		await settle(B, true);
		A.ui.redo();
		check(cells(A, 'page-b').pr_x.cell.style == 'fillColor=#654321;',
			'mixed edit: restored B did not follow redo direction');
		await settle(A, true);
		A.ui.undo();
		check(cells(A, 'page-b').pr_x.cell.style == originalB && sentinel.style == originalA,
			'mixed edit: original per-page intentions were lost');
		await settle(A, true);

		// A different file can repeat the same page IDs. Retained stale
		// changes must not apply across that identity boundary, even if an
		// integration accidentally kept the history during its file switch.
		var originalGetFile = A.ui.getCurrentFile;
		var otherFile = Object.create(A.file);
		A.ui.getCurrentFile = function() { return otherFile; };
		try
		{
			A.ui.editor.undoManager.redo();
			check(cells(A, 'page-b').pr_x.cell.style == originalB && sentinel.style == originalA,
				'file identity: old history changed a different file');
		}
		finally
		{
			A.ui.getCurrentFile = originalGetFile;
		}
		A.ui.undo();
		await settle(A, true);

		// Exact wrapper control: custom root/layer IDs, a lazy unrelated
		// page, and a temporarily empty root inside a composite replay.
		// Resolution must not call updatePageRoot to synthesize a layer.
		var root = new A.win.mxCell();
		root.setId('custom-root');
		var layer = new A.win.mxCell();
		layer.setId('custom-layer');
		root.insert(layer);
		var testModel = new A.win.mxGraphModel(root);
		var owned = A.ui.createPage('Control', 'wrapper-control');
		owned.root = root;
		var lazy = A.ui.createPage('Lazy', 'lazy-control');
		var normalizations = 0;
		testModel.repairUi = {pages: [lazy, owned], currentPage: owned,
			getCurrentFile: function() { return A.file; },
			updatePageRoot: function(p) { normalizations++; return p; }};
		var property = new A.win.mxStyleChange(testModel, layer, 'fillColor=red;');
		property.execute();
		var removal = new A.win.mxChildChange(testModel, null, layer);
		removal.execute();
		property.execute();
		check(root.getChildCount() == 0 && normalizations == 0 && layer.style == null,
			'wrapper control: empty-root replay created a layer or lost detached property');
	};

	// Integration of page-scoped replay and atomic cycle rejection.
	async function runRevivedAncestryCycle(clients, broker, report)
	{
		var A = clients[0], B = clients[1];
		var graph = A.ui.editor.graph, model = graph.model;
		var peer = B.ui.editor.graph;
		var history = A.ui.editor.undoManager;
		var check = function(ok, detail)
		{
			if (!ok) report.fail('revived-ancestry-cycle', detail);
		};
		var page = function(client, id)
		{
			return client.ui.pages.filter(function(p) { return p.getId() == id; })[0];
		};
		var settle = async function(client)
		{
			client.flush();
			await broker.drain();
			await sleep(150);
			await client.save(0);
			await broker.drain();
			await sleep(150);
		};
		var modelNode = function(root)
		{
			var codec = new A.win.mxCodec();
			var node = codec.document.createElement('mxGraphModel');
			var cells = codec.document.createElement('root');
			node.appendChild(cells);
			codec.encodeCell(root, cells);
			return node;
		};
		var xml = function(root) { return A.win.mxUtils.getXml(modelNode(root)); };
		var home = A.ui.currentPage;
		var sentinel = graph.insertVertex(null, 'rac_x', 'sentinel', 10, 20, 80, 60);
		var owned = A.ui.insertPage();
		var ownedId = owned.getId();
		var group = graph.insertVertex(null, 'rac_g', 'G', 100, 100, 500, 400, 'container=1;');
		var child = graph.insertVertex(group, 'rac_x', 'X', 30, 40, 200, 150, 'container=1;');
		await settle(A);
		history.clear();
		B.ui.editor.undoManager.clear();
		model.beginUpdate();
		try
		{
			graph.moveCells([child], 700, 0, false, graph.getDefaultParent());
			model.execute(new A.win.SelectPage(A.ui, home));
		}
		finally { model.endUpdate(); }
		await settle(A);
		var edit = history.history[0];
		check(history.history.length == 1, 'drag and selection must form one edit');

		// Reverse ancestry only AFTER revival so the abandoned tree is
		// acyclic. A tree-only preflight incorrectly approves this undo.
		B.ui.removePage(page(B, ownedId));
		await settle(B);
		B.ui.undo();
		await settle(B);
		B.ui.selectPage(page(B, ownedId), true);
		peer.moveCells([peer.model.getCell('rac_g')], 0, 0, false, peer.model.getCell('rac_x'));
		await settle(B);
		var live = page(A, ownedId);
		check(live != owned && live.root != owned.root, 'remote revival must replace the owning tree');
		var oldXml = xml(owned.root);
		var originalTreeXml = oldXml;
		var before = A.getCanonicalXml();
		A.ui.undo();
		check(A.getCanonicalXml() == before && A.ui.currentPage == home &&
			edit.repairSkippedDirection == 'undo', 'revived cycle partially replayed the drag or page switch');
		check(xml(owned.root) == oldXml && sentinel.geometry.x == 10,
			'rejected replay changed abandoned or same-ID foreign content');
		A.ui.redo();
		check(A.getCanonicalXml() == before, 'paired redo changed the revived document');

		// Exercise a lazy incarnation using its real serialized cells.
		// Call the undo manager directly to isolate replay from the UI's
		// later terminal scan, which legitimately materializes page roots.
		var node = live.node.cloneNode(false);
		node.appendChild(modelNode(live.root));
		var lazy = new A.win.DiagramPage(node);
		var pageIndex = A.ui.pages.indexOf(live);
		A.ui.pages[pageIndex] = lazy;
		var lazyXml = A.win.mxUtils.getXml(node);
		try
		{
			history.undo();
			check(lazy.root == null && A.win.mxUtils.getXml(node) == lazyXml &&
				edit.repairSkippedDirection == 'undo' && A.ui.currentPage == home,
				'lazy cycle was missed or preflight modified the real lazy page');
			history.redo();
		}
		finally { A.ui.pages[pageIndex] = live; }

		peer.moveCells([peer.model.getCell('rac_g')], 0, 0, false, peer.getDefaultParent());
		await settle(B);
		A.ui.undo();
		var lookup = A.ui.createCellLookup(page(A, ownedId).root);
		check(A.ui.currentPage.getId() == ownedId && lookup.rac_x.cell.parent == lookup.rac_g.cell &&
			lookup.rac_x.cell.geometry.x == 30 && lookup.rac_x.cell.geometry.y == 40,
			'safe retry did not resolve the revived parent, child and original geometry');
		await settle(A);

		// A now-absent page may retain a conflicting old hierarchy, but
		// that must not suppress the live page's part of a mixed edit.
		history.clear();
		B.ui.editor.undoManager.clear();
		model.beginUpdate();
		try
		{
			model.setValue(sentinel, 'local value');
			graph.moveCells([lookup.rac_x.cell], 700, 0, false, graph.getDefaultParent());
			model.execute(new A.win.SelectPage(A.ui, home));
		}
		finally { model.endUpdate(); }
		await settle(A);
		peer.moveCells([peer.model.getCell('rac_g')], 0, 0, false, peer.model.getCell('rac_x'));
		await settle(B);
		var removed = page(A, ownedId);
		B.ui.removePage(page(B, ownedId));
		await settle(B);
		oldXml = xml(removed.root);
		edit = history.history[0];
		A.ui.undo();
		check(sentinel.value == 'sentinel' && xml(removed.root) == oldXml &&
			page(A, ownedId) == null && edit.repairSkippedDirection == null,
			'absent cyclic page blocked its live sibling or changed the removed tree');
		await settle(A);
		A.ui.redo();
		check(sentinel.value == 'local value' && page(A, ownedId) == null,
			'absent-page redo lost the independent live-page intention');
		await settle(A);
		B.ui.undo();
		await settle(B);
		check(xml(owned.root) == originalTreeXml,
			'original abandoned tree unexpectedly changed');
		report.log('revived-ancestry-cycle: canonical revival, lazy rejection, safe retry and absent-page siblings checked');
	};

	// An undo reconnecting to a terminal removed by a peer must keep
	// the old attachment in the EDGE PARENT's coordinate system.
	// Equal client XML alone cannot detect the same shifted end on both.
	async function runNestedUndoEndpoint(clients, broker, report)
	{
		var A = clients[0];
		var B = clients[1];
		var graphA = A.ui.editor.graph;
		var modelA = graphA.getModel();
		var graphB = B.ui.editor.graph;
		var modelB = graphB.getModel();
		A.ui.selectPage(A.ui.pages[0], true);
		B.ui.selectPage(B.ui.pages[0], true);

		var settle = async function(client, save)
		{
			client.flush();
			await broker.drain();
			await sleep(150);

			if (save)
			{
				await client.save(0);
				await broker.drain();
				await sleep(150);
			}
		};
		var cases = [
			{name: 'root-target', depth: 0, source: false},
			{name: 'group-target', depth: 1, source: false},
			{name: 'nested-source-zoom', depth: 2, source: true, zoom: true},
			{name: 'group-source-disconnect', depth: 1, source: true, compound: true},
			{name: 'nested-target-disconnect-zoom', depth: 2, source: false,
				compound: true, zoom: true}
		];

		for (var i = 0; i < cases.length; i++)
		{
			var config = cases[i];
			var id = 'nue' + i + '_';
			var parent = graphA.getDefaultParent();
			var origin = {x: 0, y: 0};

			for (var depth = 0; depth < config.depth; depth++)
			{
				var gx = (depth == 0) ? 300 : 70;
				var gy = (depth == 0) ? 200 : 90;
				parent = graphA.insertVertex(parent, id + 'g' + depth,
					'', gx, gy, 600, 300, 'group;');
				origin.x += gx;
				origin.y += gy;
			}

			var a = graphA.insertVertex(parent, id + 'a', 'A', 20, 30, 40, 40);
			var b = graphA.insertVertex(parent, id + 'b', 'B', 140, 30, 40, 40);
			var c = graphA.insertVertex(parent, id + 'c', 'C', 260, 30, 40, 40);
			var edge = graphA.insertEdge(parent, id + 'e', '', a, b);
			await settle(A, true);
			graphA.view.scaleAndTranslate((config.zoom) ? 1.5 : 1,
				(config.zoom) ? 80 : 0, (config.zoom) ? -35 : 0);
			graphA.view.validate();
			A.ui.editor.undoManager.clear();
			B.ui.editor.undoManager.clear();
			var points = graphA.view.getState(edge).absolutePoints;
			var pt = points[(config.source) ? 0 : points.length - 1];
			var expectedAbsolute = {x: pt.x / graphA.view.scale - graphA.view.translate.x,
				y: pt.y / graphA.view.scale - graphA.view.translate.y};
			var expected = {x: expectedAbsolute.x - origin.x,
				y: expectedAbsolute.y - origin.y};

			if (config.compound)
			{
				// mxEdgeHandler's drag-disconnect order: undo replays
				// the terminal BEFORE geometry, so the queue must put
				// the correctly localized point back after the edit.
				modelA.beginUpdate();

				try
				{
					var geo = edge.getGeometry().clone();
					geo.setTerminalPoint(new A.win.mxPoint(500, 180), config.source);
					modelA.setGeometry(edge, geo);
					graphA.connectCell(edge, null, config.source);
				}
				finally
				{
					modelA.endUpdate();
				}
			}
			else
			{
				graphA.connectCell(edge, c, config.source);
			}

			await settle(A, false);
			graphB.removeCells([modelB.getCell(id + ((config.source) ? 'a' : 'b'))], false);
			await settle(B, true);

			var checkEdge = function(cell, context, graph)
			{
				var geo = (cell != null) ? cell.getGeometry() : null;
				var point = (geo != null) ? geo.getTerminalPoint(config.source) : null;

				if (cell == null || cell.getTerminal(config.source) != null ||
					point == null || Math.abs(point.x - expected.x) > 0.01 ||
					Math.abs(point.y - expected.y) > 0.01)
				{
					report.fail('nested-undo-endpoint', config.name + ' ' + context +
						': expected open end at ' + JSON.stringify(expected) +
						', got ' + JSON.stringify(point));
				}

				if (graph != null)
				{
					var state = (cell != null) ? graph.view.getState(cell) : null;
					var points = (state != null) ? state.absolutePoints : null;
					var rendered = (points != null) ?
						points[(config.source) ? 0 : points.length - 1] : null;

					if (rendered == null ||
						Math.abs(rendered.x / graph.view.scale - graph.view.translate.x -
							expectedAbsolute.x) > 0.01 ||
						Math.abs(rendered.y / graph.view.scale - graph.view.translate.y -
							expectedAbsolute.y) > 0.01)
					{
						report.fail('nested-undo-endpoint-render', config.name + ' ' +
							context + ': the rendered end moved from its original attachment');
					}
				}
			};

			// Exercise both the first repair and repeated replay. The
			// living reconnect must remove the transient point again.
			for (var replay = 0; replay < 2; replay++)
			{
				A.ui.undo();
				checkEdge(modelA.getCell(id + 'e'), 'local undo ' + replay, graphA);
				await settle(A, false);
				checkEdge(modelB.getCell(id + 'e'), 'peer undo ' + replay, graphB);

				if (replay == 0)
				{
					A.ui.redo();
					var redone = modelA.getCell(id + 'e');
					var terminal = redone.getTerminal(config.source);

					if (config.compound ? terminal != null :
						(terminal != modelA.getCell(id + 'c') ||
						 redone.getGeometry().getTerminalPoint(config.source) != null))
					{
						report.fail('nested-undo-endpoint-redo', config.name +
							': redo did not restore the recorded reconnect/disconnect');
					}

					await settle(A, false);
				}
			}

			await settle(A, true);
			var savedPages = A.ui.getPagesForXml(broker.lastSavedData);
			A.ui.updatePageRoot(savedPages[0]);
			var savedModel = new A.win.mxGraphModel(savedPages[0].root);
			checkEdge(savedModel.getCell(id + 'e'), 'persisted XML', null);
			report.log('nested-undo-endpoint: ' + config.name + ' checked');
		}
	};

	// Deterministic repro of the write-revoke case: a client loses the
	// write permission DURING the session - realtime keeps sending,
	// but every save fails permanently (403). Its transient edits can
	// never be confirmed and are rolled back to the last file state;
	// the rollback goes out as a final live diff, the file becomes
	// read-only, and the collaborators converge without the edits.
	// Replay resolution against trees that are no longer part of the
	// document. mxGraphModel detaches only the TOPMOST removed cell and
	// leaves its descendants attached to it, so a subtree a peer
	// deleted looks exactly like a live foreign page: a tree whose root
	// is not this model's root. Two consequences, both invisible to
	// every content-comparing verdict because all clients agree.
	async function runDetachedSubtreeUndo(clients, broker, report)
	{
		var A = clients[0];
		var B = clients[1];
		A.ui.selectPage(A.ui.pages[0], true);
		B.ui.selectPage(B.ui.pages[0], true);

		var countById = function(client, id)
		{
			var found = 0;

			var walk = function(cell)
			{
				if (cell.getId() == id)
				{
					found++;
				}

				for (var i = 0; i < cell.getChildCount(); i++)
				{
					walk(cell.getChildAt(i));
				}
			};

			for (var i = 0; i < client.ui.pages.length; i++)
			{
				client.ui.updatePageRoot(client.ui.pages[i]);

				if (client.ui.pages[i].root != null)
				{
					walk(client.ui.pages[i].root);
				}
			}

			return found;
		};

		// Phase 1: the frozen parent sits inside a subtree whose
		// ANCESTOR a peer removed, so it is not its own root and the
		// orphan rule misses it. Resolving in that dead tree answers
		// with the dead container, and the replay moves a LIVE shape
		// into it - out of the document, on every client.
		var graphA = A.ui.editor.graph;
		var g = graphA.insertVertex(null, 'ds_g', 'G', 20, 20, 320, 220);
		var p = graphA.insertVertex(g, 'ds_p', 'P', 20, 20, 220, 140);
		graphA.insertVertex(p, 'ds_s', 'S', 20, 20, 80, 40);
		A.flush();
		await broker.drain();
		await sleep(150);
		await A.save(0);
		await broker.drain();
		await sleep(150);

		// Drags S out of P onto the layer (records previous = P)
		graphA.moveCells([graphA.getModel().getCell('ds_s')],
			400, 0, false, graphA.getDefaultParent());
		A.flush();
		await broker.drain();
		await sleep(150);
		await A.save(0);
		await broker.drain();
		await sleep(150);

		var gOnB = B.ui.editor.graph.getModel().getCell('ds_g');

		if (gOnB == null)
		{
			report.fail('detached-subtree-undo',
				'setup: the group never reached the peer');

			return;
		}

		B.ui.editor.graph.removeCells([gOnB], true);
		B.flush();
		await broker.drain();
		await sleep(150);

		A.ui.undo();
		await sleep(150);

		if (findCellAnyPage(A, 'ds_s') == null)
		{
			report.fail('detached-subtree-undo', 'the undo moved the shape ' +
				'into a container that had left the document, which took ' +
				'the shape out of the document with it');
		}

		A.flush();
		await broker.drain();
		await sleep(150);

		if (findCellAnyPage(B, 'ds_s') == null)
		{
			report.fail('detached-subtree-undo', 'the peer lost the shape ' +
				'too - both clients converged on the loss');
		}

		// Phase 2: a restored subtree is pruned of stale copies of live
		// ids, but liveness was decided in the CURRENT page's cell map
		// while the subtree is restored into a FOREIGN page. Nothing
		// matched there, the stale copy survived and the id existed
		// twice - a state no diff can represent, so the clients' hashes
		// disagree forever. Same contradictory-undo construction as
		// undo-stale case 12, but the undo is fired from another page.
		A.ui.insertPage();
		var other = A.ui.pages[A.ui.pages.length - 1];
		A.ui.selectPage(A.ui.pages[0], true);
		A.flush();
		await broker.drain();
		await sleep(150);

		B.ui.editor.graph.insertVertex(null, 'ds2_s', 'S2',
			40, 400, 80, 40);
		B.flush();
		await broker.drain();
		await sleep(150);
		await B.save(0);
		await broker.drain();
		await sleep(150);

		graphA.insertVertex(null, 'ds2_c', 'C',
			300, 380, 200, 160, 'swimlane;whiteSpace=wrap;html=1;');
		A.flush();
		await broker.drain();
		await sleep(150);

		if (findCellAnyPage(B, 'ds2_c') == null)
		{
			report.fail('detached-subtree-undo',
				'setup: the container did not reach the peer');

			return;
		}

		// B moves the shape INTO the container
		var modelB = B.ui.editor.graph.getModel();
		modelB.beginUpdate();

		try
		{
			modelB.add(modelB.getCell('ds2_c'), modelB.getCell('ds2_s'));
		}
		finally
		{
			modelB.endUpdate();
		}

		B.flush();
		await broker.drain();
		await sleep(150);

		// A deletes the container, the shape goes with it
		A.ui.editor.graph.removeCells(
			[graphA.getModel().getCell('ds2_c')], false);
		A.flush();
		await broker.drain();
		await sleep(150);

		// B undoes its move: the shape is re-materialized at top level
		// and reaches A as an insert, so it is LIVE on A again
		B.ui.undo();
		B.flush();
		await broker.drain();
		await sleep(150);

		if (findCellAnyPage(A, 'ds2_s') == null)
		{
			report.fail('detached-subtree-undo', 'setup: the undo of the ' +
				'peer did not bring the shape back, nothing can collide');

			return;
		}

		// The undo is fired from ANOTHER page: the restore reaches into
		// the first page's tree, which the current model's map knows
		// nothing about
		A.ui.selectPage(other, true);
		A.ui.undo();
		await sleep(150);

		var copies = countById(A, 'ds2_s');

		if (copies > 1)
		{
			report.fail('detached-subtree-undo', 'the restored subtree kept ' +
				'a stale copy of a live id: ds2_s exists ' + copies +
				' times after the cross-page undo');
		}

		A.flush();
		await broker.drain();
		await sleep(150);
		await A.save(0);
		await broker.drain();
		await sleep(200);

		if (countById(B, 'ds2_s') > 1)
		{
			report.fail('detached-subtree-undo',
				'the duplicate id replicated to the peer');
		}

		A.ui.selectPage(A.ui.pages[0], true);

		// Phase 3: when a removal replay severs an edge a peer attached
		// AFTER the recorded delete, it plants a terminal point so the
		// open end stays drawable. That point must sit at the
		// terminal's rendered centre - the absolute origin already
		// carries the terminal's own offset, and adding it again put
		// the dangling end at roughly twice the offset, broadcast to
		// every client. Case 17 covers the connectivity of this path
		// but logs the point without asserting it.
		var cont = graphA.insertVertex(null, 'ds3_c', 'C3',
			300, 600, 260, 200, 'swimlane;whiteSpace=wrap;html=1;');
		graphA.insertVertex(cont, 'ds3_t', 'T3', 100, 50, 80, 40);
		graphA.insertVertex(null, 'ds3_s', 'S3', 40, 600, 80, 40);
		A.flush();
		await broker.drain();
		await sleep(150);
		await A.save(0);
		await broker.drain();
		await sleep(150);

		// Records the delete, then takes it back so the edge below is
		// attached AFTER the recorded edit
		A.ui.editor.graph.removeCells(
			[graphA.getModel().getCell('ds3_c')], false);
		A.flush();
		await broker.drain();
		await sleep(150);
		A.ui.undo();
		A.flush();
		await broker.drain();
		await sleep(150);

		var modelA3 = graphA.getModel();

		if (modelA3.getCell('ds3_t') == null)
		{
			report.fail('detached-subtree-undo',
				'setup: the container was not restored');

			return;
		}

		// The PEER attaches the edge: doing it locally would truncate
		// this client's redo stack and the replay below would be a no-op
		var modelB3 = B.ui.editor.graph.getModel();

		if (modelB3.getCell('ds3_t') == null)
		{
			report.fail('detached-subtree-undo',
				'setup: the restored container did not reach the peer');

			return;
		}

		B.ui.editor.graph.insertEdge(null, 'ds3_e', '',
			modelB3.getCell('ds3_s'), modelB3.getCell('ds3_t'));
		B.flush();
		await broker.drain();
		await sleep(150);

		if (findCellAnyPage(A, 'ds3_e') == null)
		{
			report.fail('detached-subtree-undo',
				'setup: the edge did not reach the redoing client');

			return;
		}

		// The redo removes the container again and must sever the edge
		A.ui.redo();
		await sleep(150);

		var edge = findCellAnyPage(A, 'ds3_e');

		if (edge == null)
		{
			report.fail('detached-subtree-undo',
				'the redo of the delete took the attached edge with it');
		}
		else
		{
			var geo = edge.getGeometry();
			var point = (geo != null) ? geo.getTerminalPoint(false) : null;

			if (edge.getTerminal(false) != null)
			{
				report.fail('detached-subtree-undo', 'the redo left the ' +
					'edge attached to a terminal inside the removed ' +
					'subtree');
			}
			else if (point == null)
			{
				report.fail('detached-subtree-undo', 'the severed edge ' +
					'has neither a terminal nor a point and cannot be ' +
					'drawn');
			}
			else if (Math.abs(point.x - 440) > 2 ||
				Math.abs(point.y - 670) > 2)
			{
				report.fail('detached-subtree-undo', 'the severed end was ' +
					'planted at ' + point.x + ',' + point.y + ' instead of ' +
					'the terminal centre 440,670 - the absolute origin ' +
					'already carries the terminal offset');
			}
		}
	};

	// The REAL DriveFile.verifyWriteRevoked against a stubbed
	// descriptor load. No scenario reaches it - the file double stubs
	// the whole method out (the harness runs LocalFile) - so this is
	// the only place that holds its contract: it answers from the
	// freshly loaded descriptor and must NOT adopt it. A descriptor
	// carries the head revision, and adopting one that a peer advanced
	// moves the known revision past content the shadow never saw, after
	// which the peer's save notification is skipped as already seen and
	// the next save overwrites their committed revision.
	function assertVerifyWriteRevokedKeepsRevision(client, report)
	{
		var win = client.win;

		if (win.DriveFile == null)
		{
			report.fail('write-revoked', 'DriveFile is not loaded, the ' +
				'descriptor contract is unguarded');

			return;
		}

		var check = function(name, loaded, expected)
		{
			var probe = {
				desc: {editable: true, headRevisionId: 'rev-old'},
				writeRevoked: false,
				ui: client.ui,
				loadDescriptor: function(success)
				{
					success(loaded);
				},
				getDescriptor: function()
				{
					return this.desc;
				},
				setDescriptor: function(desc)
				{
					this.desc = desc;
				},
				isEditable: win.DriveFile.prototype.isEditable
			};

			var answer = null;
			win.DriveFile.prototype.verifyWriteRevoked.call(probe,
				function(revoked)
				{
					answer = revoked;
				});

			if (answer !== expected)
			{
				report.fail('write-revoked', 'verifyWriteRevoked (' + name +
					') answered ' + answer + ' instead of ' + expected);
			}

			if (probe.desc.headRevisionId != 'rev-old')
			{
				report.fail('write-revoked', 'verifyWriteRevoked (' + name +
					') adopted the loaded descriptor: the known revision ' +
					'moved to ' + probe.desc.headRevisionId +
					' without the content ever being merged');
			}
		};

		check('still editable', {editable: true,
			headRevisionId: 'rev-new'}, false);
		check('revoked', {editable: false,
			headRevisionId: 'rev-new'}, true);
	};

	// Named lifecycle regressions: file attrs and placeholder labels need
	// explicit intent checks because page hashes do not include vars.
	// Several cases intentionally fail until pre-RT ownership and vars
	// resend are implemented. See the README for their current status.
	async function runFileVarsLifecycle(clients, broker, report, ctx)
	{
		var A = clients[0];
		var B = clients[1];
		var C = clients[2];
		var name = ctx.config.scenario;
		var base = JSON.stringify({reviewVar: 'saved'});
		var first = JSON.stringify({reviewVar: 'first-offline'});
		var second = JSON.stringify({reviewVar: 'second-online'});
		var peer = JSON.stringify({reviewVar: 'peer'});
		var getVars = function(client)
		{
			return client.ui.fileNode.getAttribute('vars');
		};
		var setVars = function(client, value)
		{
			// Run the actual FilePropertiesDialog Edit Data callback.
			// Capture its temporary model and apply the same value edit
			// as the data form, without reproducing the vars listener:
			// a future ownership hook there must be exercised here too.
			var win = client.win;
			var OriginalDialog = win.EditDataDialog;
			var dataCell = null;
			var dataGraph = null;
			win.EditDataDialog = function(ui, cell, graph)
			{
				dataCell = cell;
				dataGraph = graph;
				return new OriginalDialog(ui, cell, graph);
			};

			try
			{
				var dialog = new win.FilePropertiesDialog(client.ui);
				var buttons = dialog.container.getElementsByTagName('button');

				for (var i = 0; i < buttons.length; i++)
				{
					if (buttons[i].textContent == win.mxResources.get('editData') + '...')
					{
						buttons[i].click();
						break;
					}
				}

				if (dataCell == null || dataGraph == null)
				{
					throw new Error('File Properties did not open Edit Data');
				}

				var obj = win.mxUtils.createXmlDocument().createElement('object');
				var vars = (value === null) ? {} : JSON.parse(value);
				var keys = Object.keys(vars);

				for (var i = 0; i < keys.length; i++)
				{
					obj.setAttribute(keys[i], vars[keys[i]]);
				}

				dataGraph.getModel().setValue(dataCell, obj);
			}
			finally
			{
				win.EditDataDialog = OriginalDialog;
				client.ui.hideDialog();
			}
		};
		var settle = async function()
		{
			await broker.drain();
			await sleep(160);
		};
		var waitFor = async function(predicate, stage)
		{
			var deadline = Date.now() + 7000;

			while (!predicate() && Date.now() < deadline)
			{
				await sleep(50);
			}

			if (!predicate())
			{
				throw new Error(name + ': timed out waiting for ' + stage);
			}
		};
		var check = function(client, expected, stage)
		{
			var actual = getVars(client);

			if (actual !== expected)
			{
				report.fail('file-vars-live', stage + ' ' + client.name +
					' vars=' + JSON.stringify(actual) +
					' expected=' + JSON.stringify(expected));
			}

			var cell = findCellAnyPage(client, 'vars_label');
			var label = (cell != null) ?
				client.ui.editor.graph.getLabel(cell) : null;
			var expectedLabel = (expected === null) ?
				'%reviewVar%' : JSON.parse(expected).reviewVar;

			if (label !== expectedLabel)
			{
				report.fail('file-vars-label', stage + ' ' + client.name +
					' label=' + JSON.stringify(label) +
					' expected=' + JSON.stringify(expectedLabel));
			}
		};
		var checkAll = function(expected, stage)
		{
			for (var i = 0; i < clients.length; i++)
			{
				check(clients[i], expected, stage);
			}
		};
		var checkSaved = function(expected, stage)
		{
			var root = A.win.mxUtils.parseXml(
				broker.lastSavedData).documentElement;
			root = A.ui.editor.extractGraphModel(root, true, true) || root;
			var actual = root.getAttribute('vars');
			report.log(name + ' ' + stage + ' saved vars=' +
				JSON.stringify(actual));

			if (actual !== expected)
			{
				report.fail('file-vars-saved', stage + ' vars=' +
					JSON.stringify(actual) + ' expected=' +
					JSON.stringify(expected));
			}
		};
		var peerSave = async function(expected)
		{
			B.ui.editor.graph.insertVertex(null, 'vars_marker',
				'peer edit', 220, 40, 80, 40);
			B.flush();
			await settle();
			await B.save(0);
			await settle();
			checkSaved(expected, 'authorized peer save');
		};
		var revoke = async function()
		{
			A.revokeWrite = true;
			await A.save(0);
			await settle();

			if (A.file.isEditable() || !A.file.writeRevoked)
			{
				report.fail('file-vars-revoke-setup',
					'did not reach descriptor-confirmed read-only');
			}
		};

		// Hold automatic storage writes in BOTH timer modes so that an
		// autosave cannot hide missing live propagation. All explicit
		// saves still use the normal harness/provider completion chain.
		for (var i = 0; i < clients.length; i++)
		{
			clients[i].file.autosave = function() {};
		}

		var obj = A.win.mxUtils.createXmlDocument().createElement('object');
		obj.setAttribute('label', '%reviewVar%');
		obj.setAttribute('placeholders', '1');
		A.ui.editor.graph.insertVertex(null, 'vars_label', obj,
			40, 40, 140, 40);
		setVars(A, base);
		A.flush();
		await settle();
		await A.save(0);
		await settle();
		checkAll(base, 'saved baseline');
		checkSaved(base, 'saved baseline');

		if (name.indexOf('vars-off-') == 0 ||
			name.indexOf('vars-before-sync-') == 0)
		{
			var transport = A.sync.p2pCollab;
			A.file.isRealtimeEnabled = function() { return false; };
			A.sync.updateRealtime();

			if (A.file.isRealtime())
			{
				throw new Error('RT did not turn off');
			}

			// Isolate mutation without a sync object; this is not a
			// full new-provider bootstrap test.
			if (name.indexOf('vars-before-sync-') == 0)
			{
				A.file.sync = null;
			}

			try
			{
				setVars(A, (name == 'vars-off-remove-revoke') ? null : first);

				if (name == 'vars-before-sync-save-revoke')
				{
					await A.save(0);
					await settle();
					checkSaved(first, 'saved without sync');
					base = first;
					setVars(A, second);
				}
			}
			finally
			{
				A.file.sync = A.sync;
			}

			A.file.isRealtimeEnabled = function() { return true; };
			A.sync.p2pCollab = transport;
			A.sync.updateRealtime();
			A.sync.sendUnconfirmedChanges();
			await settle();

			if (!A.file.isRealtime())
			{
				throw new Error('RT did not turn on');
			}

			if (name == 'vars-off-save')
			{
				await A.save(0);
				await settle();
				checkAll(first, 'authorized save fallback');
				checkSaved(first, 'authorized save fallback');
			}
			else
			{
				if (name == 'vars-off-reedit-revoke' ||
					name == 'vars-off-remove-revoke')
				{
					setVars(A, second);
					A.flush();
					await settle();
					checkAll(second, 'later RT edit');
				}

				await revoke();
				checkAll(base, 'retract all unsaved local vars');
				await peerSave(base);

				for (var i = 0; i < clients.length; i++)
				{
					clients[i].cleanupNow();
				}

				await settle();
				checkAll(base, 'after peer save and cleanup');
			}
		}
		else if (name == 'vars-reconnect' ||
			name == 'vars-reconnect-remove' ||
			name == 'vars-reconnect-unflushed')
		{
			var value = (name == 'vars-reconnect-remove') ? null : first;
			A.offline = true;
			setVars(A, value);

			if (name != 'vars-reconnect-unflushed')
			{
				A.flush();
			}

			A.offline = false;
			A.sync.sendUnconfirmedChanges();
			await settle();
			checkAll(value, 'reconnect without a save');
			await peerSave(value);
			await A.save(0);
			await settle();
			checkAll(value, 'eventual author save');
			checkSaved(value, 'eventual author save');
		}
		else if (name == 'vars-reconnect-foreign')
		{
			setVars(A, first);
			A.flush();
			await settle();
			// Independently chosen equal serialization is still a
			// foreign write and must end A's ownership interval.
			B.sync.doSendLocalChanges([{}, {f: {vars: first}}]);
			await settle();
			checkAll(first, 'equal foreign write');
			A.unjoined = true;
			setVars(C, peer);
			C.flush();
			await settle();
			A.unjoined = false;
			check(A, first, 'A missed newer foreign write');
			check(B, peer, 'B received newer foreign write');
			A.sync.sendUnconfirmedChanges();
			await settle();
			check(B, peer, 'resend excludes stale adopted vars');
			check(C, peer, 'resend excludes stale adopted vars');
			await peerSave(peer);
			checkAll(peer, 'authorized peer confirms current value');
		}
		else if (name == 'vars-p2p-reconnect')
		{
			var server = new FakeRtServer();
			enableRealP2P(A, server);
			await waitFor(function() { return A.sync.isRealtimeConnected(); },
				'A socket join');
			enableRealP2P(B, server);
			await waitFor(function() { return B.sync.isRealtimeConnected(); },
				'B socket join');
			// Establish end-to-end delivery before dropping the socket.
			setVars(A, second);
			A.flush();
			await waitFor(function() { return getVars(B) === second; },
				'live vars before disconnect');
			await A.save(0);
			await settle();
			var resends = 0;
			var originalResend = A.sync.sendUnconfirmedChanges;
			A.sync.sendUnconfirmedChanges = function()
			{
				resends++;
				return originalResend.apply(this, arguments);
			};

			try
			{
				server.dropClient(A);
				await waitFor(function() { return !A.sync.isRealtimeConnected(); },
					'socket disconnection');
				setVars(A, first);
				A.flush();
				await waitFor(function()
				{
					return resends > 0 && A.sync.isRealtimeConnected();
				}, 'rejoin and first-peer resend');
				await sleep(200);
				report.log('actual P2P reconnect resends=' + resends);
				check(B, first, 'actual reconnect without a save');
				await peerSave(first);
				await A.save(0);
				await settle();
				checkAll(first, 'save after P2P reconnect');
				checkSaved(first, 'save after P2P reconnect');
			}
			finally
			{
				A.sync.sendUnconfirmedChanges = originalResend;
			}
		}
		else if (name == 'vars-save-interval')
		{
			setVars(A, first);
			A.flush();
			await settle();
			// Hold success at the fileSaved boundary rather than assume
			// edits beat a fixed save latency on a busy machine. The
			// stored bytes are first; confirmation has not run yet.
			var originalSaved = A.file.fileSaved;
			var completeSave = null;
			A.file.fileSaved = function()
			{
				var args = arguments;
				completeSave = function()
				{
					return originalSaved.apply(A.file, args);
				};
			};

			try
			{
				var saving = A.save(0);
				await waitFor(function() { return completeSave != null; },
					'serialized save completion');
				checkSaved(first, 'held save bytes');
				setVars(B, peer);
				B.flush();
				await settle();
				setVars(A, second);
				A.flush();
				await settle();
				completeSave();
				await saving;
				await settle();
			}
			finally
			{
				A.file.fileSaved = originalSaved;
			}

			await revoke();
			checkAll(peer, 'old completion preserves foreign rollback base');
			await peerSave(peer);
		}
		else
		{
			throw new Error('Unknown file-vars lifecycle case: ' + name);
		}
	};

	// File variables are outside diffPages, so page/checksum equality
	// cannot detect a failed retraction. Seeds select explicit semantic
	// cases; each runs the real descriptor-confirmed 403 path and checks
	// both live fileNodes and the next authorized peer's saved XML.
	async function runRevokedFileVars(clients, broker, report, ctx)
	{
		var A = clients[0];
		var B = clients[1];
		var variant = (ctx.config.seed - 1) % 20 + 1;
		var baseline = JSON.stringify({reviewVar: 'confirmed'});
		var own = JSON.stringify({reviewVar: 'revoked'});
		var peer = JSON.stringify({reviewVar: 'peer'});
		var expected = null;
		var setVars = function(client, value)
		{
			if (value == null)
			{
				client.ui.fileNode.removeAttribute('vars');
			}
			else
			{
				client.ui.fileNode.setAttribute('vars', value);
			}

			// Same notification path as the file-data dialog.
			client.ui.updateFileVars();
			client.ui.editor.graph.refresh();
			client.file.fileChanged();
		};
		var settle = async function()
		{
			await broker.drain();
			await sleep(120);
		};
		var check = function(stage, value)
		{
			for (var i = 0; i < clients.length; i++)
			{
				var actual = clients[i].ui.fileNode.getAttribute('vars');

				if (actual !== value)
				{
					report.fail('revoked-file-vars', 'case ' + variant +
						' ' + stage + ' ' + clients[i].name +
						' vars=' + JSON.stringify(actual) +
						' expected=' + JSON.stringify(value));
				}
			}
		};

		report.log('revoked-file-vars case ' + variant);

		if (variant == 19 || variant == 20)
		{
			// Editable SVG/HTML wrap the mxfile. Its vars, rather than
			// attributes on the outer export, are the persisted state.
			A.file.title = B.file.title = 'rt-test.' +
				(variant == 19 ? 'svg' : 'html');
		}

		// Saved baseline; case 1 also locks a genuinely absent attr.
		if (variant != 1 && variant != 7)
		{
			setVars(A, baseline);
			A.flush();
			await settle();
			await A.save(0);
			await settle();
			expected = baseline;
			check('saved baseline', baseline);
		}

		// A peer value (or its removal) displaced by the local edit
		// must be restored even though it has not been saved yet.
		if (variant == 4 || variant == 9)
		{
			expected = variant == 9 ? null : peer;
			setVars(B, expected);
			B.flush();
			await settle();
		}

		if (variant != 10)
		{
			setVars(A, variant == 3 ? null : own);

			if (variant != 2)
			{
				A.flush();
				await settle();
			}
		}

		if (variant == 7)
		{
			// Repeated own edits must keep the original displaced base.
			setVars(A, JSON.stringify({reviewVar: 'revoked again'}));
			A.flush();
			await settle();
		}
		else if (variant == 5)
		{
			// A newer foreign value supersedes revoked ownership.
			expected = peer;
			setVars(B, peer);
			B.flush();
			await settle();
		}
		else if (variant == 6)
		{
			// Equal serialization is still a foreign write. The direct
			// send models a peer independently choosing the same value
			// before it received A's value, without changing the wire.
			expected = own;
			B.sync.doSendLocalChanges([{}, {f: {vars: own}}]);
			await settle();
		}
		else if (variant == 8 || variant == 11 || variant == 12)
		{
			// The saved bytes contain own, while a later unflushed edit
			// is made during the write. Only the saved value is durable.
			expected = own;
			var saving = A.save(500);

			if (variant == 12)
			{
				// A foreign write ends the saved ownership interval.
				// A new own edit must roll back to that newer peer value.
				expected = peer;
				setVars(B, peer);
				B.flush();
				await settle();
			}

			setVars(A, JSON.stringify({reviewVar: 'during save'}));

			if (variant != 8)
			{
				A.flush();
			}

			await saving;
			await settle();
		}
		else if (variant == 13)
		{
			// An authorized peer can confirm the live value before
			// revocation; then it belongs to the saved file.
			expected = own;
			await B.save(0);
			await settle();
		}

		if (variant == 14 || variant == 15)
		{
			// Full-file fallback bypasses sync.merge (cache patches).
			// Do not deliver the live vars diff, so only mergeFile can
			// acknowledge the foreign value or removal.
			expected = variant == 15 ? null : peer;
			setVars(B, expected);
			B.flush();
			broker.queues[0] = [];
			var data = B.file.createData();
			var incoming = {
				initialData: data,
				getShadowPages: function()
				{
					return A.ui.getPagesForXml(data, true);
				},
				getCurrentRevisionId: function() { return null; },
				getDescriptor: function() { return null; }
			};
			await new Promise(function(resolve)
			{
				A.file.mergeFile(incoming, resolve, function(err)
				{
					report.fail('revoked-file-vars-merge', String(err));
					resolve();
				});
			});
			await settle();
			check('after full-file merge', expected);
		}

		if (variant == 16 || variant == 17)
		{
			// OneDrive's optimistic realtime success bypasses
			// sync.fileSaved, but must confirm exactly the saved vars.
			expected = own;
			A.file.isOptimisticSync = function() { return true; };
			var optimisticSave = A.save(250);

			if (variant == 17)
			{
				setVars(A, JSON.stringify({reviewVar: 'during optimistic save'}));
			}

			await optimisticSave;
			await settle();
		}

		if (variant == 18)
		{
			// Toggle realtime off/on while an identified own vars write
			// remains unsaved. Resetting model copies is not a save.
			var transport = A.sync.p2pCollab;
			A.file.isRealtimeEnabled = function() { return false; };
			A.sync.updateRealtime();
			A.file.isRealtimeEnabled = function() { return true; };
			// The broker replaces socket joining; reconnect its test
			// transport after updateRealtime destroys the old session.
			A.sync.p2pCollab = transport;
			A.sync.updateRealtime();
		}

		A.revokeWrite = true;
		await A.save(0);
		await settle();
		check('after revoke', expected);

		if (A.file.isEditable() || !A.file.writeRevoked)
		{
			report.fail('revoked-file-vars', 'case ' + variant +
				' did not reach descriptor-confirmed read-only');
		}

		// A real peer edit ensures the next save is more than a noop.
		B.ui.editor.graph.insertVertex(null, 'rv_saved_marker',
			'peer keeps editing', 40, 40, 120, 40);
		B.flush();
		await settle();
		await B.save(0);
		await settle();
		var savedRoot = B.win.mxUtils.parseXml(
			broker.lastSavedData).documentElement;
		savedRoot = B.ui.editor.extractGraphModel(savedRoot, true, true) || savedRoot;
		var saved = savedRoot.getAttribute('vars');

		if (saved !== expected)
		{
			report.fail('revoked-file-vars-saved', 'case ' + variant +
				' peer saved vars=' + JSON.stringify(saved) +
				' expected=' + JSON.stringify(expected));
		}

		A.cleanupNow();
		B.cleanupNow();
		await settle();
		check('after peer save and cleanup', expected);
	};

	async function runWriteRevoked(clients, broker, report)
	{
		var A = clients[0];
		var B = clients[1];
		A.ui.selectPage(A.ui.pages[0], true);
		B.ui.selectPage(B.ui.pages[0], true);

		assertVerifyWriteRevokedKeepsRevision(A, report);

		// Confirmed base: one vertex from A, saved
		var graphA = A.ui.editor.graph;
		var modelA = graphA.getModel();
		graphA.insertVertex(null, 'wr_a1', 'A1', 40, 40, 80, 40);
		A.flush();
		await broker.drain();
		await sleep(120);
		await A.save(0);
		await broker.drain();
		await sleep(120);

		// Phase 0: a lone 403 is NOT the revoke signal - the descriptor
		// verification reports still-editable, so the file stays
		// modified and editable and the retry save succeeds
		graphA.insertVertex(null, 'wr_t1', 'T1', 280, 40, 80, 40);
		A.flush();
		await broker.drain();
		await sleep(120);
		A.transient403 = true;
		await A.save(0);
		await sleep(200);

		if (A.file.writeRevoked || !A.file.isEditable())
		{
			report.fail('write-revoked-transient',
				'a transient 403 revoked the file');
		}

		if (!A.file.isModified())
		{
			report.fail('write-revoked-transient',
				'the transient 403 dropped the modified state');
		}

		await A.save(0);
		await broker.drain();
		await sleep(120);

		if (A.file.isModified())
		{
			report.fail('write-revoked-transient',
				'the retry save after the transient 403 did not succeed');
		}

		// Transient edits after the (unknown) permission loss: a new
		// vertex and a style change, flushed live to B
		graphA.insertVertex(null, 'wr_a2', 'A2', 160, 40, 80, 40);
		modelA.setStyle(modelA.getCell('wr_a1'), 'fillColor=#ff0000;');
		A.flush();
		await broker.drain();
		await sleep(120);

		var modelB = B.ui.editor.graph.getModel();

		if (modelB.getCell('wr_a2') == null)
		{
			report.fail('write-revoked-setup',
				'transient edits not delivered');

			return;
		}

		// An UNFLUSHED edit: ownPages only holds changes up to the last
		// flush, so an edit made inside the debounce window (or during
		// the descriptor round trip) must still be retracted - it can
		// never be confirmed by a save on this file either
		graphA.insertVertex(null, 'wr_unflushed', 'U', 380, 40, 80, 40);

		// The save hits the injected 403 and must trigger the rollback
		A.revokeWrite = true;
		await A.save(0);
		await broker.drain();
		await sleep(200);

		// A shows the confirmed file state: no wr_a2, original style
		if (modelA.getCell('wr_a2') != null)
		{
			report.fail('write-revoked-rollback',
				'client0 still shows the retracted vertex');
		}

		if (modelA.getCell('wr_unflushed') != null)
		{
			report.fail('write-revoked-rollback', 'an edit made inside ' +
				'the flush debounce escaped the retraction and stays on ' +
				'screen as durable work on a file that can never save');
		}

		var a1 = modelA.getCell('wr_a1');

		if (a1 == null || (a1.getStyle() || '').indexOf('#ff0000') >= 0)
		{
			report.fail('write-revoked-rollback',
				'client0 still shows the retracted style');
		}

		if (A.file.isEditable())
		{
			report.fail('write-revoked-readonly',
				'client0 file still editable after revoke');
		}

		if (A.file.isModified())
		{
			report.fail('write-revoked-modified',
				'client0 still modified after rollback');
		}

		// The retraction reached B live
		if (modelB.getCell('wr_a2') != null)
		{
			report.fail('write-revoked-retraction',
				'client1 still shows the retracted vertex');
		}

		// B keeps working and saves; everyone converges on the file
		// state without A's retracted edits
		B.ui.editor.graph.insertVertex(null, 'wr_b1', 'B1',
			40, 140, 80, 40);
		B.flush();
		await broker.drain();
		await sleep(120);
		await B.save(0);
		await broker.drain();
		await sleep(120);

		if (!A.file.isModified())
		{
			A.cleanupNow();
		}

		if (!B.file.isModified())
		{
			B.cleanupNow();
		}

		await sleep(120);

		if (A.getPagesHash() != B.getPagesHash())
		{
			report.fail('write-revoked-convergence',
				'clients did not converge after the revoke');
		}
	};

	// Minimal crossing-author case from the review: a single nested
	// peer insert, followed directly by revocation and the peer's save.
	async function runRevokedChild(clients, broker, report)
	{
		var A = clients[0];
		var B = clients[1];
		A.ui.selectPage(A.ui.pages[0], true);
		B.ui.selectPage(B.ui.pages[0], true);
		var graphA = A.ui.editor.graph;
		var graphB = B.ui.editor.graph;
		graphA.insertVertex(null, 'rc_base', 'Saved', 0, 0, 80, 40);
		A.flush();
		await broker.drain();
		await sleep(120);
		await A.save(0);
		await broker.drain();
		await sleep(120);
		graphA.insertVertex(null, 'rc_group', 'Group',
			100, 100, 300, 200, 'container=1;');
		A.flush();
		await broker.drain();
		await sleep(120);
		graphB.insertVertex(graphB.getModel().getCell('rc_group'),
			'rc_child', 'Peer child', 20, 20, 80, 40);
		B.flush();
		await broker.drain();
		await sleep(120);

		if (graphA.getModel().getCell('rc_child') == null)
		{
			report.fail('revoked-child-setup', 'peer child was not delivered');
			return;
		}

		var ownPage = B.ui.getPageById(B.ui.currentPage.getId(), B.file.ownPages);
		B.ui.updatePageRoot(ownPage);

		if (new B.win.mxGraphModel(ownPage.root).getCell('rc_child') == null)
		{
			report.fail('revoked-child-adoption',
				'local child is missing from own pages before revocation');
		}

		A.revokeWrite = true;
		await A.save(0);
		await broker.drain();
		await sleep(200);

		function check(model, phase)
		{
			var child = model.getCell('rc_child');
			var parent = model.getCell('rc_group');

			if (child == null || parent == null || child.parent != parent ||
				child.value != 'Peer child' || child.geometry.x != 20 ||
				child.geometry.y != 20)
			{
				report.fail('revoked-child', phase + ' lost or changed the peer child');
			}
		};

		check(graphA.getModel(), 'revoked client');
		check(graphB.getModel(), 'peer after retraction');
		await B.save(0);
		await broker.drain();
		await sleep(150);
		var savedPages = B.ui.getPagesForXml(broker.lastSavedData);
		B.ui.updatePageRoot(savedPages[0]);
		check(new B.win.mxGraphModel(savedPages[0].root), 'peer save');
		A.cleanupNow();
		B.cleanupNow();
		await sleep(150);
		check(graphA.getModel(), 'revoked client after cleanup');
		check(graphB.getModel(), 'peer after cleanup');
	};

	// A retracts its unsaved containers after a confirmed write revoke.
	// B's children depend on those containers but belong to B; agreement
	// after deleting them is still data loss, so check the saved XML too.
	async function runRevokedDescendants(clients, broker, report)
	{
		var A = clients[0];
		var B = clients[1];
		A.ui.selectPage(A.ui.pages[0], true);
		B.ui.selectPage(B.ui.pages[0], true);
		var savedPageId = A.ui.currentPage.getId();
		A.ui.editor.graph.insertVertex(null, 'rd_base', 'Saved',
			20, 20, 80, 40);
		A.flush();
		await broker.drain();
		await sleep(120);
		await A.save(0);
		await broker.drain();
		await sleep(120);

		function addOwnContainers(prefix)
		{
			var graph = A.ui.editor.graph;
			var outer = graph.insertVertex(null, prefix + '_outer',
				'Outer', 200, 100, 400, 300, 'container=1;');
			var inner = graph.insertVertex(outer, prefix + '_inner',
				'Inner', 30, 40, 300, 200, 'container=1;');
			graph.insertVertex(inner, prefix + '_own', 'Retract',
				10, 120, 80, 40);
			var unused = graph.insertVertex(outer, prefix + '_unused',
				'Retract subtree', 340, 20, 50, 50, 'container=1;');
			graph.insertVertex(unused, prefix + '_unused_child',
				'Retract child', 5, 5, 30, 20);
		};

		addOwnContainers('rd_saved');
		var newPage = A.ui.insertPage();
		addOwnContainers('rd_new');
		var emptyPage = A.ui.insertPage();
		A.ui.editor.graph.insertVertex(null, 'rd_empty_own',
			'Retract page', 20, 20, 80, 40);
		A.ui.selectPage(newPage, true);
		A.flush();
		await broker.drain();
		await sleep(120);

		var cases = [{pageId: savedPageId, prefix: 'rd_saved'},
			{pageId: newPage.getId(), prefix: 'rd_new'}];

		for (var i = 0; i < cases.length; i++)
		{
			var item = cases[i];
			var page = B.ui.getPageById(item.pageId);

			if (page == null)
			{
				report.fail('revoked-descendants-setup', 'missing peer page');
				return;
			}

			B.ui.selectPage(page, true);
			var graph = B.ui.editor.graph;
			var inner = graph.getModel().getCell(item.prefix + '_inner');
			var first = graph.insertVertex(inner, item.prefix + '_peer1',
				'Peer one', 20, 20, 80, 40);
			var second = graph.insertVertex(inner, item.prefix + '_peer2',
				'Peer two', 160, 20, 80, 40);
			// All three local inserts share one flush. Their unsaved
			// ancestors must be adopted together with the new cells.
			graph.insertEdge(inner, item.prefix + '_edge', 'Peer edge',
				first, second);
			B.flush();
			await broker.drain();
			await sleep(120);
		}

		B.flush();
		await broker.drain();
		await sleep(120);

		if (findCellAnyPage(A, 'rd_new_peer1') == null)
		{
			report.fail('revoked-descendants-setup', 'peer child not delivered');
			return;
		}

		for (var i = 0; i < cases.length; i++)
		{
			var ownPage = B.ui.getPageById(cases[i].pageId, B.file.ownPages);
			B.ui.updatePageRoot(ownPage);

			if (new B.win.mxGraphModel(ownPage.root).getCell(
				cases[i].prefix + '_edge') == null)
			{
				report.fail('revoked-descendants-setup',
					'peer edge is absent from own pages before revocation');
				return;
			}
		}

		A.revokeWrite = true;
		await A.save(0);
		await broker.drain();
		await sleep(200);

		function checkPages(client, pages, phase, afterSave)
		{
			for (var i = 0; i < cases.length; i++)
			{
				var item = cases[i];
				var page = null;

				for (var j = 0; j < pages.length; j++)
				{
					if (pages[j].getId() == item.pageId)
					{
						page = pages[j];
					}

					if (pages[j].getId() == emptyPage.getId())
					{
						report.fail('revoked-descendants', phase +
							' kept a page with only revoked work');
					}
				}

				if (page == null)
				{
					report.fail('revoked-descendants', phase + ' lost ' + item.pageId);
					continue;
				}

				client.ui.updatePageRoot(page);
				var model = new client.win.mxGraphModel(page.root);
				var prefix = item.prefix;
				var outer = model.getCell(prefix + '_outer');
				var inner = model.getCell(prefix + '_inner');
				var first = model.getCell(prefix + '_peer1');
				var second = model.getCell(prefix + '_peer2');
				var edge = model.getCell(prefix + '_edge');

				if (outer == null || inner == null || first == null ||
					second == null || edge == null)
				{
					report.fail('revoked-descendants', phase + ' lost peer ' +
						'content or its necessary ancestors on ' + prefix);
					continue;
				}

				if (inner.parent != outer || first.parent != inner ||
					second.parent != inner || edge.parent != inner ||
					first.value != 'Peer one' || second.value != 'Peer two' ||
					first.geometry.x != 20 || first.geometry.y != 20 ||
					outer.geometry.x != 200 || inner.geometry.x != 30 ||
					edge.getTerminal(true) != first ||
					edge.getTerminal(false) != second)
				{
					report.fail('revoked-descendants', phase +
						' changed peer content, placement or connectivity on ' + prefix);
				}

				// Whole-page adoption already copied these siblings into B's
				// pending new page, so B may confirm them in its later save.
				if ((!afterSave || item.pageId == savedPageId) &&
					(model.getCell(prefix + '_own') != null ||
					model.getCell(prefix + '_unused') != null ||
					model.getCell(prefix + '_unused_child') != null))
				{
					report.fail('revoked-descendants', phase +
						' kept solely revoked content on ' + prefix);
				}
			}
		};

		checkPages(A, A.ui.pages, 'revoked client');
		checkPages(B, B.ui.pages, 'peer after retraction');

		if (A.file.isEditable() || A.file.isModified())
		{
			report.fail('revoked-descendants', 'revoked file is editable or modified');
		}

		await B.save(0);
		await broker.drain();
		await sleep(150);
		checkPages(B, B.ui.getPagesForXml(broker.lastSavedData), 'peer save', true);
		A.cleanupNow();
		B.cleanupNow();
		await sleep(150);
		checkPages(A, A.ui.pages, 'revoked client after cleanup', true);
		checkPages(B, B.ui.pages, 'peer after cleanup', true);
	};

	// Deterministic lock for jgraph/drawio-desktop#2382: the desktop
	// watcher merges an externally changed file through mergeFile ->
	// patch (NON-realtime branch) while the undo history holds edits
	// on cells the merge removes and later re-inserts as new objects.
	// Pre-fix, replaying such an edit hit cellAdded's id-collision
	// rename and gave birth to a permanent distinct-id duplicate
	// ("ghost cell"). The history invalidation runs on every
	// non-undoable patch, so the stale edits are dropped instead.
	// Client A runs the non-realtime merge branch (isRealtime false
	// for the duration), client B is an OFFLINE xml factory for the
	// external file versions.
	async function runDesktopMerge(clients, broker, report)
	{
		var A = clients[0];
		var B = clients[1];
		A.ui.selectPage(A.ui.pages[0], true);
		B.ui.selectPage(B.ui.pages[0], true);

		var graphA = A.ui.editor.graph;
		var modelA = graphA.getModel();

		var scan = function(context)
		{
			for (var pi = 0; pi < A.ui.pages.length; pi++)
			{
				A.ui.updatePageRoot(A.ui.pages[pi]);
				var counts = {};
				var objects = [];
				var edges = [];

				var walk = function(cell)
				{
					objects.push(cell);
					var id = cell.getId();

					if (id != null)
					{
						counts[id] = (counts[id] || 0) + 1;

						if (/^\d+$/.test(id) && parseInt(id, 10) > 1)
						{
							report.fail(context, A.name +
								': ghost cell from collision rename: ' + id);
						}
					}

					if (cell.edge)
					{
						edges.push(cell);
					}

					for (var ci = 0; ci < cell.getChildCount(); ci++)
					{
						walk(cell.getChildAt(ci));
					}
				};

				if (A.ui.pages[pi].root != null)
				{
					walk(A.ui.pages[pi].root);
				}

				for (var id in counts)
				{
					if (counts[id] > 1)
					{
						report.fail(context, A.name +
							': duplicate id in tree: ' + id);
					}
				}

				for (var ei = 0; ei < edges.length; ei++)
				{
					var src = edges[ei].getTerminal(true);
					var trg = edges[ei].getTerminal(false);

					if ((src != null && objects.indexOf(src) < 0) ||
						(trg != null && objects.indexOf(trg) < 0))
					{
						report.fail(context, A.name +
							': dangling terminal on ' + edges[ei].getId());
					}
				}
			}
		};

		// Parses in the MERGING client's realm (cross-realm cells would
		// break instanceof checks in its codecs)
		var externalVersion = function(data, client)
		{
			return {
				initialData: data,
				getShadowPages: function()
				{
					return client.ui.getPagesForXml(data);
				},
				getCurrentRevisionId: function() { return null; },
				getDescriptor: function() { return null; }
			};
		};

		var mergeExternal = function(data)
		{
			return new Promise(function(resolve)
			{
				A.file.mergeFile(externalVersion(data, A), resolve,
					function(err)
					{
						report.fail('desktop-merge-error', A.name + ': ' +
							((err != null && err.message != null) ?
								err.message : String(err)));
						resolve();
					});
			});
		};

		// Base: two vertices and an edge, shared by both clients
		graphA.insertVertex(null, 'dm_v1', 'V1', 40, 40, 80, 40);
		graphA.insertVertex(null, 'dm_v2', 'V2', 200, 40, 80, 40);
		graphA.insertEdge(null, 'dm_e1', '',
			modelA.getCell('dm_v1'), modelA.getCell('dm_v2'));
		A.flush();
		await broker.drain();
		await sleep(120);
		await A.save(0);
		await broker.drain();
		await sleep(120);

		// B holds the shared base and now goes offline: a pure xml
		// factory for the external file versions
		B.setOffline(true);

		// The watcher path is the NON-realtime merge branch: mergeFile
		// branches on isRealtime() (ownPages presence), so that is what
		// must report false - like a desktop file without realtime
		A.file.isRealtime = function() { return false; };

		// Undoable edits whose objects the external merges replace
		graphA.orderCells(false, [modelA.getCell('dm_v1')]);
		graphA.connectCell(modelA.getCell('dm_e1'),
			modelA.getCell('dm_v1'), false);

		// External version 1: dm_v1 removed (B edits the file offline)
		var modelB = B.ui.editor.graph.getModel();
		B.ui.editor.graph.removeCells([modelB.getCell('dm_v1')], false);
		B.file.updateFileData();
		var external1 = B.file.getData();

		// External version 2: dm_v1 back as a NEW object
		B.ui.undo();
		B.file.updateFileData();
		var external2 = B.file.getData();

		await mergeExternal(external1);
		await sleep(120);

		// The merge must have reached the visible document (the cell
		// object of the history edits is now detached)
		if (modelA.getCell('dm_v1') != null)
		{
			report.fail('desktop-merge-setup',
				'external remove did not reach the visible pages');
		}

		await mergeExternal(external2);
		await sleep(120);

		// ...and the re-insert materialized a NEW object for the id
		if (modelA.getCell('dm_v1') == null)
		{
			report.fail('desktop-merge-setup',
				'external re-insert did not reach the visible pages');
		}

		// Pre-fix: the preserved edits replay against the replaced
		// object - the undo re-adds the old dm_v1 while the id is
		// taken (cellAdded renames it into a ghost) and restores the
		// removed terminal on dm_e1
		A.ui.undo();
		A.ui.undo();

		if (A.ui.editor.undoManager.canRedo())
		{
			A.ui.redo();
		}

		scan('desktop-merge');

		// Restores the realtime invariants for the standard verdicts
		delete A.file.isRealtime;
		A.sync.snapshot = A.ui.clonePages(A.ui.pages);
		A.sync.dirtyPageIds = A.win.Object.create(null);
		A.sync.localFileWasChanged = false;
		A.file.ownPages = A.ui.clonePages(A.ui.pages);
		A.file.theirPages = A.ui.clonePages(A.ui.pages);
		A.file.setShadowPages(A.ui.clonePages(A.ui.pages));
		A.file.setModified(false);
		B.setOffline(false);
		B.file.setModified(false);

		// B adopts A's state so the convergence verdicts compare equal
		// trees (B was only the offline xml factory)
		var finalData = (function()
		{
			A.file.updateFileData();
			return A.file.getData();
		})();

		await new Promise(function(resolve)
		{
			B.file.mergeFile(externalVersion(finalData, B), resolve,
				function() { resolve(); });
		});

		B.sync.snapshot = B.ui.clonePages(B.ui.pages);
		B.file.ownPages = B.ui.clonePages(B.ui.pages);
		B.file.theirPages = B.ui.clonePages(B.ui.pages);
		B.file.setShadowPages(B.ui.clonePages(B.ui.pages));
		B.file.setModified(false);
	};

	// Late joiner in a RUNNING session: A and B edit and save a base,
	// keep editing live WITHOUT saving, then C joins from the saved
	// base plus the live-log catchup and must see everything - the
	// saved cells AND the unsaved live diffs - then participates.
	async function runJoinMidSession(clients, broker, report)
	{
		var A = clients[0];
		var B = clients[1];
		var C = clients[2];
		A.ui.selectPage(A.ui.pages[0], true);
		B.ui.selectPage(B.ui.pages[0], true);

		// Saved base
		A.ui.editor.graph.insertVertex(null, 'jm_a1', 'A1',
			40, 40, 80, 40);
		A.flush();
		await broker.drain();
		await sleep(120);
		await A.save(0);
		await broker.drain();
		await sleep(120);

		// Unsaved live traffic after the base save
		A.ui.editor.graph.insertVertex(null, 'jm_a2', 'A2',
			160, 40, 80, 40);
		A.flush();
		await broker.drain();
		await sleep(120);
		B.ui.editor.graph.insertVertex(null, 'jm_b1', 'B1',
			40, 140, 80, 40);
		B.flush();
		await broker.drain();
		await sleep(120);

		// C joins mid-session
		C.joinLate(broker, true);
		await sleep(200);

		var modelC = C.ui.editor.graph.getModel();

		if (modelC.getCell('jm_a1') == null)
		{
			report.fail('join-mid-session', 'joiner misses the saved base');
		}

		if (modelC.getCell('jm_a2') == null ||
			modelC.getCell('jm_b1') == null)
		{
			report.fail('join-mid-session',
				'joiner misses the unsaved live diffs');
		}

		// C participates and everyone sees it
		C.ui.editor.graph.insertVertex(null, 'jm_c1', 'C1',
			160, 140, 80, 40);
		C.flush();
		await broker.drain();
		await sleep(120);

		if (A.ui.editor.graph.getModel().getCell('jm_c1') == null ||
			B.ui.editor.graph.getModel().getCell('jm_c1') == null)
		{
			report.fail('join-mid-session',
				'joiner edit did not reach the session');
		}

		// More traffic across all three, then the standard anchors
		// arbitrate convergence
		B.ui.editor.graph.insertVertex(null, 'jm_b2', 'B2',
			280, 140, 80, 40);
		B.flush();
		A.ui.editor.graph.insertVertex(null, 'jm_a3', 'A3',
			280, 40, 80, 40);
		A.flush();
		await broker.drain();
		await sleep(120);
	};

	// Mixed protocol versions end to end: client C simulates PROTOCOL
	// v6 (DrawioFileSync.PROTOCOL in its frame drives both the sent v
	// and the receive check). v7 peers must IGNORE C's live diffs and
	// converge with C only through the save cycle; C ignores the
	// newer-version payloads without crashing. A second section arms
	// minRemoteAppVersion on A and verifies the av gate degrades B to
	// file sync until the save arrives.
	async function runMixedVersion(clients, broker, report)
	{
		var A = clients[0];
		var B = clients[1];
		var C = clients[2];
		A.ui.selectPage(A.ui.pages[0], true);
		B.ui.selectPage(B.ui.pages[0], true);
		C.ui.selectPage(C.ui.pages[0], true);

		C.win.DrawioFileSync.PROTOCOL = 6;

		// C's live diff must NOT reach the v7 peers
		C.ui.editor.graph.insertVertex(null, 'mv_c1', 'C1',
			40, 40, 80, 40);
		C.flush();
		await broker.drain();
		await sleep(150);

		if (A.ui.editor.graph.getModel().getCell('mv_c1') != null ||
			B.ui.editor.graph.getModel().getCell('mv_c1') != null)
		{
			report.fail('mixed-version-gate',
				'v6 live diff was applied by a v7 peer');
		}

		// Save the v6 author's bytes before a newer-protocol message asks
		// that client to reload. Saving after that redirect latch bypassed
		// fileSaved's callback and the old timeout silently hid it.
		await C.mustCommit();
		await RtTestBackend.drain(broker);

		// A's v7 diff reaches B but must not be applied by C
		A.ui.editor.graph.insertVertex(null, 'mv_a1', 'A1',
			160, 40, 80, 40);
		A.flush();
		await broker.drain();
		await sleep(150);

		if (B.ui.editor.graph.getModel().getCell('mv_a1') == null)
		{
			report.fail('mixed-version-setup',
				'v7 diff did not reach the v7 peer');
		}

		if (C.ui.editor.graph.getModel().getCell('mv_a1') != null)
		{
			report.fail('mixed-version-gate',
				'newer-version payload was applied by the v6 client');
		}

		// The save cycle converges across the version gate: saves reach
		// every client through the merge (into ownPages) and the idle
		// cleanup brings them onto the screen - the gate never applies
		// the live payload, so this path is the ONLY route
		await A.mustCommit(0);
		await broker.drain();
		await sleep(150);

		// Back to v7 and clear the redirect latch the v7 message set on
		// the v6 client (in production the user reloads into the new
		// app; here the client rejoins the current protocol)
		C.win.DrawioFileSync.PROTOCOL = 7;
		C.file.redirectDialogShowing = false;

		for (var i = 0; i < clients.length; i++)
		{
			if (!clients[i].file.isModified())
			{
				clients[i].cleanupNow();
			}
		}

		await sleep(150);

		var hasCell = function(client, id)
		{
			for (var pi = 0; pi < client.ui.pages.length; pi++)
			{
				client.ui.updatePageRoot(client.ui.pages[pi]);

				if (new client.win.mxGraphModel(
					client.ui.pages[pi].root).getCell(id) != null)
				{
					return true;
				}
			}

			return false;
		};

		if (!hasCell(A, 'mv_c1'))
		{
			report.fail('mixed-version-converge',
				'v6 changes did not arrive via the save cycle');
		}

		if (!hasCell(C, 'mv_a1'))
		{
			report.fail('mixed-version-converge',
				'v7 changes did not reach the v6 client via the merge');
		}

		// --- av gate: A requires a minimum remote app version and
		// must degrade B's live diffs to the file fallback. B gets an
		// explicit parseable old version: the gate is deliberately
		// fail-open for unparsable versions (dev builds), so the test
		// must not rely on EditorUi.VERSION
		var oldVersionB = B.win.EditorUi.VERSION;
		B.win.EditorUi.VERSION = '1.0.0';
		A.sync.minRemoteAppVersion = '2.0.0';

		B.ui.editor.graph.insertVertex(null, 'mv_b1', 'B1',
			40, 140, 80, 40);
		B.flush();
		await broker.drain();
		await sleep(150);

		if (A.ui.editor.graph.getModel().getCell('mv_b1') != null)
		{
			report.fail('mixed-version-av',
				'outdated-av live diff was applied despite the gate');
		}

		if (C.ui.editor.graph.getModel().getCell('mv_b1') == null)
		{
			report.fail('mixed-version-av',
				'ungated peer missed the live diff');
		}

		await B.mustCommit(0);
		await broker.drain();
		await sleep(150);

		if (!A.file.isModified())
		{
			A.cleanupNow();
		}

		await sleep(150);

		if (!hasCell(A, 'mv_b1'))
		{
			report.fail('mixed-version-av',
				'gated changes did not arrive via the save cycle');
		}

		A.sync.minRemoteAppVersion = null;
		B.win.EditorUi.VERSION = oldVersionB;
	};

	// Base editor semantics: every fundamental operation must survive
	// the full replay cycle op -> undo (exact state before) -> redo
	// (exact state after) -> undo, verified by full-XML comparison.
	// The convergence verdicts of the other scenarios cannot catch a
	// consistently inert undo (it converges everywhere), which let a
	// broken connect-undo slip through - this layer guards the BASE
	// editor behavior of a production app, without any remote traffic
	// interfering (client B only participates in the final anchors).
	async function runEditorSemantics(clients, broker, report)
	{
		var A = clients[0];
		A.ui.selectPage(A.ui.pages[0], true);
		var graphA = A.ui.editor.graph;
		var modelA = graphA.getModel();

		// Committed base so the cycles have material to work on
		graphA.insertVertex(null, 'es_v1', 'V1', 40, 40, 80, 40);
		graphA.insertVertex(null, 'es_v2', 'V2', 200, 40, 80, 40);
		graphA.insertVertex(null, 'es_v3', 'V3', 360, 40, 80, 40);
		graphA.insertEdge(null, 'es_e1', '',
			modelA.getCell('es_v1'), modelA.getCell('es_v2'));
		var cont = graphA.insertVertex(null, 'es_c1', 'Box',
			40, 160, 200, 120);
		graphA.insertVertex(cont, 'es_k1', 'Kid', 10, 30, 60, 30);
		A.flush();
		await broker.drain();
		await sleep(120);
		await A.save(0);
		await broker.drain();
		await sleep(120);
		A.ui.editor.undoManager.clear();
		var baseData = A.file.getData();

		var cycle = function(label, op)
		{
			try
			{
				var before = A.getCanonicalXml();
				op();
				var after = A.getCanonicalXml();

				if (after == before)
				{
					report.fail('editor-semantics',
						label + ': operation had no effect');

					return;
				}

				A.ui.undo();

				if (A.getCanonicalXml() != before)
				{
					report.fail('editor-semantics',
						label + ': undo did not restore the state');
				}

				A.ui.redo();

				if (A.getCanonicalXml() != after)
				{
					report.fail('editor-semantics',
						label + ': redo did not restore the operation');
				}

				A.ui.undo();

				if (A.getCanonicalXml() != before)
				{
					report.fail('editor-semantics',
						label + ': second undo did not restore the state');
				}
			}
			catch (e)
			{
				report.fail('editor-semantics', label + ': ' + e.message);
			}
		};

		cycle('add-vertex', function()
		{
			graphA.insertVertex(null, 'es_n1', 'N1', 40, 320, 80, 40);
		});

		cycle('add-edge', function()
		{
			graphA.insertEdge(null, 'es_n2', '',
				modelA.getCell('es_v2'), modelA.getCell('es_v3'));
		});

		cycle('connect-open-end', function()
		{
			// The manual find: connecting an open edge end, undo must
			// disconnect again
			graphA.connectCell(modelA.getCell('es_e1'),
				modelA.getCell('es_v3'), false);
		});

		cycle('reconnect-terminal', function()
		{
			graphA.connectCell(modelA.getCell('es_e1'),
				modelA.getCell('es_v3'), true);
		});

		cycle('set-waypoints', function()
		{
			var geo = modelA.getCell('es_e1').getGeometry().clone();
			geo.points = [new A.win.mxPoint(150, 100)];
			modelA.setGeometry(modelA.getCell('es_e1'), geo);
		});

		cycle('delete-vertex-with-edge', function()
		{
			graphA.removeCells([modelA.getCell('es_v1')]);
		});

		// A group whose internal edge is a child of the group: delete
		// with connections lists the edge AFTER the group, so the undo
		// restores the edge while its parent is still detached and only
		// comes back with the next change of the same edit. The
		// execute-time repair took the detached parent for gone and put
		// the edge into the default layer (2026-09-07 review)
		var grp = graphA.insertVertex(null, 'es_g1', '',
			300, 160, 200, 120, 'group');
		var grpA = graphA.insertVertex(grp, 'es_g1a', 'a', 10, 10, 40, 30);
		var grpB = graphA.insertVertex(grp, 'es_g1b', 'b', 120, 60, 40, 30);
		graphA.insertEdge(grp, 'es_g1e', '', grpA, grpB);

		cycle('delete-group-with-connections', function()
		{
			graphA.setSelectionCell(grp);
			A.ui.actions.get('deleteAll').funct();
		});

		// The same shape through a plain delete: removeCells appends the
		// edges that are not rendered, which is every edge inside a
		// collapsed group
		graphA.foldCells(true, false, [grp]);

		cycle('delete-collapsed-group', function()
		{
			graphA.setSelectionCell(grp);
			A.ui.actions.get('delete').funct();
		});

		graphA.foldCells(false, false, [grp]);

		cycle('group-cells', function()
		{
			graphA.setSelectionCells([modelA.getCell('es_v2'),
				modelA.getCell('es_v3')]);
			graphA.groupCells(null, 20);
			graphA.clearSelection();
		});

		cycle('move-into-container', function()
		{
			graphA.moveCells([modelA.getCell('es_v2')],
				0, 0, false, modelA.getCell('es_c1'));
		});

		cycle('order-to-front', function()
		{
			graphA.orderCells(false, [modelA.getCell('es_v1')]);
		});

		cycle('set-style', function()
		{
			modelA.setStyle(modelA.getCell('es_v1'),
				'rounded=1;fillColor=#ff0000;');
		});

		cycle('set-label', function()
		{
			modelA.setValue(modelA.getCell('es_v1'), 'renamed');
		});

		cycle('set-geometry', function()
		{
			var vgeo = modelA.getCell('es_v1').getGeometry().clone();
			vgeo.x += 50;
			vgeo.y += 30;
			modelA.setGeometry(modelA.getCell('es_v1'), vgeo);
		});

		cycle('paste-copy', function()
		{
			A.win.mxClipboard.copy(graphA, [modelA.getCell('es_v1')]);
			A.win.mxClipboard.paste(graphA);
			graphA.clearSelection();
		});

		cycle('add-page', function()
		{
			A.ui.insertPage();
		});

		cycle('rename-page', function()
		{
			A.ui.editor.graph.model.execute(new A.win.RenamePage(
				A.ui, A.ui.pages[A.ui.pages.length - 1], 'sem-renamed'));
		});

		cycle('remove-page', function()
		{
			A.ui.removePage(A.ui.pages[A.ui.pages.length - 1]);
		});

		// A wholesale replacement (revision restore, external merge,
		// conflict path) is ONE undoable step: undone it brings the
		// previous document back exactly, redone it re-applies the
		// replacement. The restored data is the committed base from
		// before the cycles, which differs from the document by now
		cycle('restore-file-data', function()
		{
			A.ui.replaceFileData(baseData);

			if (A.file.sync != null)
			{
				A.file.sync.fileRestored();
			}
		});

		// Publishes the final state for the standard anchors
		A.flush();
		await broker.drain();
		await sleep(120);
	};

	async function runAdoptionEditRace(clients, broker, report)
	{
		var A = clients[0];
		var B = clients[1];
		A.ui.selectPage(A.ui.pages[0], true);
		B.ui.selectPage(B.ui.pages[0], true);

		// A creates the stack and flushes WITHOUT saving
		var graphA = A.ui.editor.graph;
		var stack = graphA.insertVertex(null, 'as0', 'List',
			40, 40, 140, 120, OpGenerator.STACK_STYLE);
		graphA.insertVertex(stack, 'ai0', 'Item 1', 0, 0, 140, 30,
			OpGenerator.STACK_ITEM_STYLE);
		graphA.insertVertex(stack, 'ai1', 'Item 2', 0, 0, 140, 30,
			OpGenerator.STACK_ITEM_STYLE);
		A.flush();
		await broker.drain();
		await sleep(120);

		var modelB = B.ui.editor.graph.getModel();

		if (modelB.getCell('ai1') == null)
		{
			report.fail('edit-race-setup', 'stack not delivered');

			return;
		}

		// B adopts by relabeling, flushes and starts a save with
		// latency: the save diff is computed synchronously at save
		// start and carries 'Item X'
		modelB.setValue(modelB.getCell('ai1'), 'Item X');
		B.flush();
		await broker.drain();
		await sleep(120);
		var savePromise = B.save(250);
		await sleep(50);

		// A edits the same cell AFTER the save diff exists and
		// flushes: A's own pages and visible pages now carry the
		// newer value while B's save still carries the older one
		var modelA = A.ui.editor.graph.getModel();
		modelA.setValue(modelA.getCell('ai1'), 'Item Z');
		A.flush();
		await broker.drain();
		await sleep(60);

		await savePromise;
		await broker.drain();
		await sleep(120);

		var checkAi1 = function(pages, context)
		{
			var value = null;

			try
			{
				var cell = new A.win.mxGraphModel(pages[0].root)
					.getCell('ai1');
				value = (cell != null) ? cell.getValue() : null;
			}
			catch (e)
			{
				value = 'ERROR: ' + e.message;
			}

			if (value != 'Item Z')
			{
				report.fail(context, 'older saved value won over the ' +
					'newer local edit: ' + JSON.stringify(value));
			}
			else
			{
				report.log(context + ' newer local edit preserved');
			}
		};

		// A's newer label must survive the merge in A's own pages
		// and in A's next save
		checkAi1(A.file.ownPages, 'edited-later-own');
		await A.save(0);
		checkAi1(A.ui.getPagesForXml(A.file.getData()),
			'edited-later-save');
		await broker.drain();
		await sleep(120);
	};

	// Deterministic repro of the 2026-07-23 'Snapshot out of sync'
	// incident class: A inserts a stackLayout List container, B edits
	// and reorders its children BEFORE A's save lands (B's patchRealtime
	// drops those updates from ownPages -> layout-inconsistent drift),
	// then A saves, B merges and an idle cleanup patches the visible
	// document. Pre-fix the live stack layout corrected the current
	// page during cleanup's patch while the headless snapshot kept the
	// raw patch (test=1 assertion alert, caught via the alert hook);
	// post-fix (current page re-cloned into the snapshot) this is green.
	async function runLayoutRace(clients, broker, report)
	{
		var A = clients[0];
		var B = clients[1];

		// Both clients stay on the first page so the layout manager
		// reacts on the live model of the affected page
		A.ui.selectPage(A.ui.pages[0], true);
		B.ui.selectPage(B.ui.pages[0], true);

		// Phase 0: A inserts the List container with two items and
		// SAVES, so container and items are in both clients' ownPages
		var graphA = A.ui.editor.graph;
		var stack = graphA.insertVertex(null, 'ls0', 'List',
			40, 40, 140, 90, OpGenerator.STACK_STYLE);
		graphA.insertVertex(stack, 'li0', 'Item 1', 0, 0, 140, 30,
			OpGenerator.STACK_ITEM_STYLE);
		graphA.insertVertex(stack, 'li1', 'Item 2', 0, 0, 140, 30,
			OpGenerator.STACK_ITEM_STYLE);
		A.flush();
		await broker.drain();
		await sleep(120);
		await A.save(0);
		await broker.drain();
		await sleep(120);

		// Phase 1: A adds a third, UNSAVED item
		graphA.insertVertex(A.ui.editor.graph.getModel().getCell('ls0'),
			'li2', 'Item 3', 0, 0, 140, 30, OpGenerator.STACK_ITEM_STYLE);
		A.flush();
		await broker.drain();
		await sleep(120);

		// Phase 2: B reorders across the saved/unsaved mix and edits
		// the saved items. B's patchRealtime applies the updates for
		// saved cells to ownPages but drops those for the unsaved li2
		// ("Updated cell not found") -> ownPages holds a partially
		// applied, layout-inconsistent state (the incident state)
		var modelB = B.ui.editor.graph.getModel();
		var stackB = modelB.getCell('ls0');

		if (stackB == null || modelB.getChildCount(stackB) < 3)
		{
			report.fail('layout-race-setup',
				'stack not delivered to client1');

			return;
		}

		modelB.beginUpdate();
		try
		{
			modelB.add(stackB, modelB.getCell('li2'), 0);
			var geo = modelB.getCell('li0').getGeometry().clone();
			geo.height = 50;
			modelB.setGeometry(modelB.getCell('li0'), geo);
			modelB.setValue(modelB.getCell('li1'), 'Item X');
		}
		finally
		{
			modelB.endUpdate();
		}

		B.flush();
		await broker.drain();
		await sleep(120);

		// Phase 3: B saves the (inconsistent) ownPages state - this is
		// how the incident state reached the saved file - and A merges
		await B.save(0);
		await broker.drain();
		await sleep(120);

		// Phase 4: idle cleanup applies diff(pages, ownPages); the
		// pre-fix assertion fired here during cleanup's file.patch as
		// the live stack layout corrected the current page while the
		// headless snapshot kept the raw patch
		if (!B.file.isModified())
		{
			B.cleanupNow();
		}

		if (!A.file.isModified())
		{
			A.cleanupNow();
		}

		await sleep(120);
	};

	// Deterministic repro of the 2026-07-24 incident (page out of sync
	// with a stackLayout List): concurrent conflicting reorders where
	// only client A has the stack page as its CURRENT page. A's stack
	// layout re-runs when B's change is applied and corrects the merged
	// order; B (on another page, temp-model patching, no layout) keeps
	// the raw merge. B saves LAST and A never saves again: if A's
	// correction is client-local (silent absorption), the saved file
	// keeps a state no stack layout can produce and the clients
	// diverge permanently. The correction must instead be flushed as a
	// local change of A.
	async function runLayoutPassive(clients, broker, report)
	{
		var A = clients[0];
		var B = clients[1];

		A.ui.selectPage(A.ui.pages[0], true);
		B.ui.selectPage(B.ui.pages[0], true);

		// Baseline: stack with three items on page one, saved
		var graphA = A.ui.editor.graph;
		var stack = graphA.insertVertex(null, 'lp0', 'List',
			40, 40, 140, 120, OpGenerator.STACK_STYLE);

		for (var i = 0; i < 3; i++)
		{
			graphA.insertVertex(stack, 'lp' + (i + 1), 'Item ' + (i + 1),
				0, 0, 140, 30, OpGenerator.STACK_ITEM_STYLE);
		}

		A.flush();
		await broker.drain();
		await sleep(120);
		await A.save(0);
		await broker.drain();
		await sleep(120);

		// B moves to the second page: no layout runs on B for page one
		B.ui.selectPage(B.ui.pages[1], true);
		await sleep(60);

		// A reorders item 3 to the front and resizes item 1, flushes
		// AND saves before anything is delivered: A is unmodified
		// afterwards, so A will never autosave again
		var modelA = A.ui.editor.graph.getModel();
		var stackA = modelA.getCell('lp0');
		modelA.beginUpdate();
		try
		{
			modelA.add(stackA, modelA.getCell('lp3'), 0);
			var geo = modelA.getCell('lp1').getGeometry().clone();
			geo.height = 50;
			modelA.setGeometry(modelA.getCell('lp1'), geo);
		}
		finally
		{
			modelA.endUpdate();
		}

		A.flush();
		await A.save(0);

		// B edits CONCURRENTLY on the stale base (nothing delivered
		// yet): different item to the front, layout runs on B for its
		// own state
		B.ui.selectPage(B.ui.pages[0], true);
		var modelB = B.ui.editor.graph.getModel();
		var stackB = modelB.getCell('lp0');

		if (stackB == null)
		{
			report.fail('layout-passive-setup', 'stack missing on client1');

			return;
		}

		modelB.add(stackB, modelB.getCell('lp2'), 0);
		B.ui.selectPage(B.ui.pages[1], true);
		B.flush();

		// Cross-delivery: A (current page, unmodified) applies B's
		// stale-based diff, its stack layout corrects the merged order;
		// B applies A's changes through a temp model without layout
		await broker.drain();
		await sleep(160);

		// Only B is modified and saves; A's correction must reach the
		// file through B, not through an artificial save by A
		await B.save(0);
		await broker.drain();
		await sleep(160);

		// Idle reconciliation on both
		if (!A.file.isModified())
		{
			A.cleanupNow();
		}

		if (!B.file.isModified())
		{
			B.cleanupNow();
		}

		await sleep(120);

		// The saved-file consistency is asserted after quiescence on
		// the LAST saver (the corrective save may come from A)
	};

	// Post-quiescence check for the layout-passive scenario: the data
	// of the last saving client is the current file and must be
	// layout-consistent (XML child order and stacked geometry agree)
	function assertFinalStackConsistent(clients, broker, report, stackId)
	{
		if (broker.lastSaver != null)
		{
			assertSavedStackConsistent(clients[broker.lastSaver],
				stackId, report, 'final-saved-stack');
		}
		else
		{
			report.fail('final-saved-stack', 'no client ever saved');
		}
	};

	// Finds a cell by id across all pages of a client (any-page lookup
	// mirroring OpGenerator.findCell, shared by the scripted scenarios)
	function findCellAnyPage(client, id)
	{
		var ui = client.ui;

		for (var i = 0; i < ui.pages.length; i++)
		{
			ui.updatePageRoot(ui.pages[i]);
			var m = (ui.pages[i] == ui.currentPage) ?
				ui.editor.graph.getModel() :
				new client.win.mxGraphModel(ui.pages[i].root);
			var cell = m.getCell(id);

			if (cell != null)
			{
				return cell;
			}
		}

		return null;
	};

	function findPageById(client, id)
	{
		for (var i = 0; i < client.ui.pages.length; i++)
		{
			if (client.ui.pages[i].getId() == id)
			{
				return client.ui.pages[i];
			}
		}

		return null;
	};

	// --- currentpage-delete ----------------------------------------------
	// A remote peer deletes the page the local client is viewing (both
	// directions, with flushed, unflushed and in-flight edits on the
	// dying page). The patch path must land the viewer on a surviving
	// page, the deletion must win over crossing content edits, undo and
	// redo must not resurrect the page or throw, and both sessions stay
	// fully editable afterwards.
	async function runCurrentPageDelete(clients, broker, report, ctx)
	{
		var A = clients[0];
		var B = clients[1];

		// --- Phase 1: B deletes the page A is viewing while A holds a
		// flushed and an unflushed edit on it
		A.ui.selectPage(A.ui.pages[1], true);
		B.ui.selectPage(B.ui.pages[0], true);
		var graphA = A.ui.editor.graph;
		graphA.insertVertex(null, 'cpd_a1', 'A1', 40, 40, 80, 40);
		A.flush();
		await broker.drain();
		await sleep(120);

		if (findCellAnyPage(B, 'cpd_a1') == null)
		{
			report.fail('currentpage-delete-setup',
				'flushed edit did not reach client1');

			return;
		}

		// Unflushed local edit on the doomed page
		graphA.insertVertex(null, 'cpd_a2', 'A2', 160, 40, 80, 40);

		B.ui.removePage(B.ui.pages[1]);
		B.flush();
		await broker.drain();
		await sleep(200);

		if (A.ui.currentPage == null ||
			A.ui.pages.indexOf(A.ui.currentPage) < 0)
		{
			report.fail('currentpage-delete',
				'client0 current page invalid after remote delete');
		}

		if (A.ui.pages.length != 1 || B.ui.pages.length != 1)
		{
			report.fail('currentpage-delete',
				'page count after delete: A=' + A.ui.pages.length +
				' B=' + B.ui.pages.length);
		}

		// Undo/redo over history entries whose page died must be inert
		// (invalidated), never resurrect the page and never throw
		var before = A.getCanonicalXml();

		for (var i = 0; i < 3; i++)
		{
			A.ui.undo();
		}

		if (A.ui.pages.length != 1 || A.getCanonicalXml() != before)
		{
			report.fail('currentpage-delete',
				'undo resurrected state from the deleted page on client0');
		}

		for (var i = 0; i < 3; i++)
		{
			A.ui.redo();
		}

		if (A.ui.pages.length != 1 || A.getCanonicalXml() != before)
		{
			report.fail('currentpage-delete',
				'redo resurrected state from the deleted page on client0');
		}

		// --- Phase 2: a fresh page; B views and edits it while A
		// deletes it, both flushes cross in flight
		var pageC = A.ui.insertPage();
		pageC = (pageC != null) ? pageC : A.ui.pages[A.ui.pages.length - 1];
		var pageCId = pageC.getId();
		A.ui.selectPage(A.ui.pages[0], true);
		A.flush();
		await broker.drain();
		await sleep(150);

		var bPageC = findPageById(B, pageCId);

		if (bPageC == null)
		{
			report.fail('currentpage-delete-setup',
				'new page did not reach client1');

			return;
		}

		B.ui.selectPage(bPageC, true);
		B.ui.editor.graph.insertVertex(null, 'cpd_b1', 'B1',
			40, 40, 80, 40);
		B.flush();
		await broker.drain();
		await sleep(120);

		// Crossing: B edits and flushes while A deletes and flushes
		B.ui.editor.graph.insertVertex(null, 'cpd_b2', 'B2',
			160, 40, 80, 40);
		A.ui.removePage(findPageById(A, pageCId));
		B.flush();
		A.flush();
		await broker.drain();
		await sleep(250);

		if (B.ui.currentPage == null ||
			B.ui.pages.indexOf(B.ui.currentPage) < 0)
		{
			report.fail('currentpage-delete',
				'client1 current page invalid after crossing delete');
		}

		if (findPageById(A, pageCId) != null ||
			findPageById(B, pageCId) != null)
		{
			report.fail('currentpage-delete',
				'deleted page resurrected by crossing edits');
		}

		// B's undo must not resurrect the dead page or its cells. The
		// entries on the deleted page are invalidated and REMOVED, so
		// undo legitimately reaches B's next older valid entry (the
		// own Phase-1 removePage - restoring an own page delete stays
		// undoable, and the restore replicates like any local change).
		for (var i = 0; i < 2; i++)
		{
			B.ui.undo();
		}

		if (findPageById(B, pageCId) != null ||
			findCellAnyPage(B, 'cpd_b1') != null ||
			findCellAnyPage(B, 'cpd_b2') != null)
		{
			report.fail('currentpage-delete',
				'undo resurrected the crossing-deleted page on client1');
		}

		B.flush();
		await broker.drain();
		await sleep(150);

		// Both sessions stay editable and convergent
		B.ui.editor.graph.insertVertex(null, 'cpd_b3', 'B3',
			40, 240, 80, 40);
		B.flush();
		await broker.drain();
		await sleep(150);

		if (findCellAnyPage(A, 'cpd_b3') == null)
		{
			report.fail('currentpage-delete',
				'client1 edit after the delete did not replicate');
		}
	};

	// --- paste-ids --------------------------------------------------------
	// Concurrent pastes mint fresh ids on both clients: the ids must
	// stay disjoint, each paste replicates exactly once (no collision
	// rename, no ghost duplicates), and each side's paste stays cleanly
	// undoable and redoable - including a paste that crosses a save
	// merge (the local history entry must survive the merge).
	async function runPasteIds(clients, broker, report, ctx)
	{
		var A = clients[0];
		var B = clients[1];
		A.ui.selectPage(A.ui.pages[0], true);
		B.ui.selectPage(B.ui.pages[0], true);
		var graphA = A.ui.editor.graph;

		graphA.insertVertex(null, 'pi_v1', 'V1', 40, 40, 80, 40);
		graphA.insertVertex(null, 'pi_v2', 'V2', 240, 40, 80, 40);
		graphA.insertEdge(null, 'pi_e1', 'link',
			graphA.getModel().getCell('pi_v1'),
			graphA.getModel().getCell('pi_v2'));
		A.flush();
		await broker.drain();
		await sleep(120);
		await A.save(0);
		await broker.drain();
		await sleep(120);

		function edgeIds(client)
		{
			var m = client.ui.editor.graph.getModel();
			var ids = [];

			for (var id in m.cells)
			{
				if (m.isEdge(m.cells[id]))
				{
					ids.push(m.cells[id].getId());
				}
			}

			return ids;
		};

		// Real clipboard path: fresh ids minted by the paste
		function pasteEdge(client, label)
		{
			var g = client.ui.editor.graph;
			var before = edgeIds(client);
			g.setSelectionCell(g.getModel().getCell('pi_e1'));
			client.win.mxClipboard.copy(g);
			client.win.mxClipboard.paste(g);
			var fresh = edgeIds(client).filter(function(id)
			{
				return before.indexOf(id) < 0;
			});

			if (fresh.length != 1)
			{
				report.fail('paste-ids', label + ': paste minted ' +
					fresh.length + ' edges instead of 1');

				return null;
			}

			return fresh[0];
		};

		// Concurrent pastes, flushes cross
		var idA = pasteEdge(A, 'clientA');
		var idB = pasteEdge(B, 'clientB');

		if (idA == null || idB == null)
		{
			return;
		}

		if (idA == idB)
		{
			report.fail('paste-ids', 'both clients minted the same id ' + idA);
		}

		A.flush();
		B.flush();
		await broker.drain();
		await sleep(200);

		for (var i = 0; i < 2; i++)
		{
			var n = edgeIds(clients[i]).length;

			if (n != 3 || findCellAnyPage(clients[i], idA) == null ||
				findCellAnyPage(clients[i], idB) == null)
			{
				report.fail('paste-ids', clients[i].name + ' has ' + n +
					' edges after concurrent paste (expected 3 incl. ' +
					idA + ',' + idB + ')');
			}
		}

		// Undo on A removes exactly A's paste everywhere, redo restores
		A.ui.undo();
		A.flush();
		await broker.drain();
		await sleep(150);

		if (findCellAnyPage(A, idA) != null ||
			findCellAnyPage(B, idA) != null ||
			findCellAnyPage(B, idB) == null)
		{
			report.fail('paste-ids',
				'undo did not retract exactly the own paste');
		}

		A.ui.redo();
		A.flush();
		await broker.drain();
		await sleep(150);

		if (findCellAnyPage(A, idA) == null ||
			findCellAnyPage(B, idA) == null)
		{
			report.fail('paste-ids', 'redo did not restore the paste');
		}

		// A paste crossing a save merge: the paste survives (LWW keeps
		// unsaved local inserts) and its history entry survives too
		var savePromise = B.save(150);
		await sleep(30);
		var histBefore = A.ui.editor.undoManager.history.length;
		var idA2 = pasteEdge(A, 'clientA-crossing');

		if (idA2 == null)
		{
			return;
		}

		await savePromise;
		await broker.drain();
		await sleep(200);

		if (findCellAnyPage(A, idA2) == null)
		{
			report.fail('paste-ids',
				'paste was lost to the crossing save merge');
		}

		if (A.ui.editor.undoManager.history.length < histBefore + 1)
		{
			report.fail('paste-ids',
				'history entry of the paste was lost in the merge');
		}

		A.flush();
		await broker.drain();
		await sleep(150);

		if (findCellAnyPage(B, idA2) == null)
		{
			report.fail('paste-ids',
				'crossing paste did not replicate');
		}

		A.ui.undo();
		A.flush();
		await broker.drain();
		await sleep(150);

		if (findCellAnyPage(A, idA2) != null ||
			findCellAnyPage(B, idA2) != null)
		{
			report.fail('paste-ids',
				'undo after the crossing merge did not retract the paste');
		}

		A.ui.redo();
		A.flush();
		await broker.drain();
		await sleep(150);

		if (findCellAnyPage(A, idA2) == null ||
			findCellAnyPage(B, idA2) == null)
		{
			report.fail('paste-ids',
				'redo after the crossing merge did not restore the paste');
		}
	};

	// --- crash-reload -----------------------------------------------------
	// A client dies mid-session (unflushed work is lost like in a real
	// browser crash) and reloads from the last save plus a SYNTHETIC live log.
	// Production reopen is covered separately by crash-commit-no-ack. Flushed and saved work survives
	// everywhere, the lost transient exists nowhere, the fleet is
	// unaffected and the reloaded client rejoins with a fresh history
	// and full participation.
	async function runCrashReload(clients, broker, report, ctx)
	{
		var resumeAutosaves = RtTestBackend.pauseAutosaves(clients);
		try
		{
		var A = clients[0];
		var B = clients[1];
		var C = clients[2];
		A.ui.selectPage(A.ui.pages[0], true);
		B.ui.selectPage(B.ui.pages[0], true);
		C.ui.selectPage(C.ui.pages[0], true);

		// Committed storm base from A and B (seed-varied)
		for (var r = 0; r < 2; r++)
		{
			for (var i = 0; i < 3; i++)
			{
				ctx.generator.randomOp(A);
				ctx.generator.randomOp(B);
			}

			A.flush();
			B.flush();
			await RtTestBackend.drain(broker);
		}

		await A.mustCommit(0);
		await RtTestBackend.drain(broker);

		// C contributes flushed and unflushed work, then crashes. The
		// cr_ cells go onto the SAVED page-a deterministically: content
		// on an unsaved foreign page (a storm addPage) legitimately
		// reaches a joiner only with that page's next save, which is
		// join-mid-session territory, not this scenario's assert.
		C.ui.selectPage(findPageById(C, 'page-a'), true);
		C.ui.editor.graph.insertVertex(null, 'cr_c1', 'C1',
			40, 400, 80, 40);
		C.flush();
		await RtTestBackend.drain(broker);
		C.ui.editor.graph.insertVertex(null, 'cr_c2', 'C2',
			160, 400, 80, 40);

		C.crash();

		// Traffic keeps flowing while C is down; the live log replays
		// it into the reloaded client
		B.ui.selectPage(findPageById(B, 'page-a'), true);
		B.ui.editor.graph.insertVertex(null, 'cr_b1', 'B1',
			40, 480, 80, 40);
		B.flush();
		await RtTestBackend.drain(broker);

		await C.reloadFromSave(broker, true);
		await RtTestBackend.drain(broker);

		// The unflushed transient died with the crash - everywhere
		for (var i = 0; i < 3; i++)
		{
			if (findCellAnyPage(clients[i], 'cr_c2') != null)
			{
				report.fail('crash-reload', clients[i].name +
					' still has the crashed transient cr_c2');
			}

			if (findCellAnyPage(clients[i], 'cr_c1') == null)
			{
				report.fail('crash-reload', clients[i].name +
					' lost the flushed pre-crash edit cr_c1');
			}

			if (findCellAnyPage(clients[i], 'cr_b1') == null)
			{
				report.fail('crash-reload', clients[i].name +
					' lost the while-down edit cr_b1');
			}
		}

		// Fresh session: no stale history to replay
		if (C.ui.editor.undoManager.history.length != 0)
		{
			report.fail('crash-reload',
				'reloaded client has stale undo history entries: ' +
				C.ui.editor.undoManager.history.length);
		}

		// Full participation after the reload
		C.ui.selectPage(findPageById(C, 'page-a'), true);
		C.ui.editor.graph.insertVertex(null, 'cr_c3', 'C3',
			280, 400, 80, 40);
		C.flush();
		await RtTestBackend.drain(broker);

		if (findCellAnyPage(A, 'cr_c3') == null ||
			findCellAnyPage(B, 'cr_c3') == null)
		{
			report.fail('crash-reload',
				'post-reload edit did not replicate');
		}

		// Acknowledged save survives this synthetic-replay crash. The actual
		// commit-before-ack interval is exercised by crash-commit-no-ack.
		await C.mustCommit(0);
		await RtTestBackend.drain(broker);
		C.crash();
		B.ui.selectPage(findPageById(B, 'page-a'), true);
		B.ui.editor.graph.insertVertex(null, 'cr_b2', 'B2',
			160, 480, 80, 40);
		B.flush();
		await RtTestBackend.drain(broker);
		await C.reloadFromSave(broker, true);
		await RtTestBackend.drain(broker);

		if (findCellAnyPage(C, 'cr_c3') == null)
		{
			report.fail('crash-reload',
				'reload lost the own committed save');
		}

		if (findCellAnyPage(C, 'cr_b2') == null)
		{
			report.fail('crash-reload',
				'reload missed the while-down edit cr_b2');
		}
		}
		finally { resumeAutosaves(); }
	};

	// --- revoke-storm -----------------------------------------------------
	// The write permission dies mid-storm: the 403 rollback and live
	// retraction race crossing edits from two active peers. The revoked
	// client ends read-only on the confirmed state but keeps receiving,
	// its transients vanish everywhere, the crossing peer edits and the
	// peers' undo histories survive intact.
	async function runRevokeStorm(clients, broker, report, ctx)
	{
		var A = clients[0];
		var B = clients[1];
		var C = clients[2];
		A.ui.selectPage(A.ui.pages[0], true);
		B.ui.selectPage(B.ui.pages[0], true);
		C.ui.selectPage(C.ui.pages[0], true);

		// Committed base storm from all three (seed-varied)
		for (var r = 0; r < 2; r++)
		{
			for (var i = 0; i < 3; i++)
			{
				ctx.generator.randomOp(A);
				ctx.generator.randomOp(B);
				ctx.generator.randomOp(C);
			}

			A.flush();
			B.flush();
			C.flush();
			await broker.drain();
			await sleep(100);
		}

		await B.save(0);
		await broker.drain();
		await sleep(150);

		// A's doomed transients go live to everyone
		A.ui.selectPage(A.ui.pages[0], true);
		A.ui.editor.graph.insertVertex(null, 'rs_a1', 'A1',
			40, 400, 80, 40);
		A.flush();
		await broker.drain();
		await sleep(120);

		if (findCellAnyPage(B, 'rs_a1') == null)
		{
			report.fail('revoke-storm-setup',
				'transient did not reach the peers');

			return;
		}

		// Peers edit while the revoke hits; their flushes cross the
		// rollback retraction both before and after the 403
		B.ui.selectPage(B.ui.pages[0], true);
		C.ui.selectPage(C.ui.pages[0], true);
		B.ui.editor.graph.insertVertex(null, 'rs_b1', 'B1',
			40, 480, 80, 40);
		C.ui.editor.graph.insertVertex(null, 'rs_c1', 'C1',
			240, 480, 80, 40);
		B.flush();
		C.flush();

		A.revokeWrite = true;
		var savePromise = A.save(0);

		B.ui.editor.graph.insertVertex(null, 'rs_b2', 'B2',
			140, 480, 80, 40);
		C.ui.editor.graph.insertVertex(null, 'rs_c2', 'C2',
			340, 480, 80, 40);
		B.flush();
		C.flush();

		await savePromise;
		await broker.drain();
		await sleep(250);

		if (A.file.isEditable())
		{
			report.fail('revoke-storm',
				'revoked client still editable');
		}

		if (A.file.isModified())
		{
			report.fail('revoke-storm',
				'revoked client still modified after rollback');
		}

		for (var i = 0; i < 3; i++)
		{
			if (findCellAnyPage(clients[i], 'rs_a1') != null)
			{
				report.fail('revoke-storm', clients[i].name +
					' still shows the retracted transient rs_a1');
			}

			var ids = ['rs_b1', 'rs_b2', 'rs_c1', 'rs_c2'];

			for (var j = 0; j < ids.length; j++)
			{
				if (findCellAnyPage(clients[i], ids[j]) == null)
				{
					report.fail('revoke-storm', clients[i].name +
						' lost the crossing peer edit ' + ids[j]);
				}
			}
		}

		// Peer undo/redo works through the retraction aftermath: cell
		// invalidation may legitimately eat entries whose cells the
		// retraction removed (peer edits ON retracted cells), so the
		// history is checked functionally on the peer's own entries
		B.ui.undo();
		B.flush();
		await broker.drain();
		await sleep(150);

		if (findCellAnyPage(A, 'rs_b2') != null ||
			findCellAnyPage(C, 'rs_b2') != null)
		{
			report.fail('revoke-storm',
				'peer undo did not retract through the fleet');
		}

		B.ui.redo();
		B.flush();
		await broker.drain();
		await sleep(150);

		if (findCellAnyPage(A, 'rs_b2') == null ||
			findCellAnyPage(C, 'rs_b2') == null)
		{
			report.fail('revoke-storm',
				'peer redo did not restore through the fleet');
		}

		// Both peer entries stay functional: the double cycle walks
		// down to rs_b1 and back
		B.ui.undo();
		B.ui.undo();
		B.flush();
		await broker.drain();
		await sleep(150);

		if (findCellAnyPage(C, 'rs_b2') != null ||
			findCellAnyPage(C, 'rs_b1') != null)
		{
			report.fail('revoke-storm',
				'peer double undo did not retract both own entries');
		}

		B.ui.redo();
		B.ui.redo();
		B.flush();
		await broker.drain();
		await sleep(150);

		if (findCellAnyPage(C, 'rs_b2') == null ||
			findCellAnyPage(C, 'rs_b1') == null)
		{
			report.fail('revoke-storm',
				'peer double redo did not restore both own entries');
		}

		// The revoked client keeps receiving as a viewer
		B.ui.editor.graph.insertVertex(null, 'rs_b3', 'B3',
			40, 560, 80, 40);
		B.flush();
		await broker.drain();
		await sleep(150);

		if (findCellAnyPage(A, 'rs_b3') == null)
		{
			report.fail('revoke-storm',
				'revoked client no longer receives live updates');
		}
	};

	// --- real P2P layer ---------------------------------------------------
	// In-memory socket server implementing the channel protocol
	// (clientsList, newClient, clientLeft, message relay with sender
	// id) so the REAL P2PCollab runs inside the frames - roster, alone
	// gate, announce and rejoin included. The production loss that
	// motivated this (a lost newClient) is injectable via dropNewClient.
	function FakeRtServer()
	{
		this.sockets = [];
		this.nextId = 1;
		this.dropNewClient = false;
	};

	FakeRtServer.prototype.deliver = function(entry, data)
	{
		var payload = JSON.stringify(data);

		// Async like a real socket, no reentrancy into app code
		window.setTimeout(function()
		{
			if (entry.ws.readyState == 1)
			{
				entry.ws.dispatch('message', {data: payload});
			}
		}, 0);
	};

	FakeRtServer.prototype.connect = function(ws)
	{
		var cId = 'fc' + (this.nextId++);
		var list = [];

		for (var i = 0; i < this.sockets.length; i++)
		{
			list.push(this.sockets[i].cId);
		}

		var entry = {ws: ws, cId: cId};
		this.sockets.push(entry);
		this.deliver(entry, {action: 'clientsList',
			msg: {cId: cId, list: list}});

		for (var i = 0; i < this.sockets.length - 1; i++)
		{
			if (!this.dropNewClient)
			{
				this.deliver(this.sockets[i],
					{action: 'newClient', msg: cId});
			}
		}
	};

	FakeRtServer.prototype.onSend = function(ws, str)
	{
		var data = JSON.parse(str);
		var sender = null;

		for (var i = 0; i < this.sockets.length; i++)
		{
			if (this.sockets[i].ws == ws)
			{
				sender = this.sockets[i].cId;
			}
		}

		// Mirrors the worker's sendSignal, INCLUDING the stamped
		// sender: the payload's own from is written by the client that
		// sent it, and the receiver keys its peer connection and its
		// roster entry on it
		if (data.action == 'sendSignal')
		{
			var target = (data.msg != null) ? data.msg.to : null;

			for (var i = 0; i < this.sockets.length; i++)
			{
				if (this.sockets[i].cId == target)
				{
					var msg = {};

					for (var k in data.msg)
					{
						msg[k] = data.msg[k];
					}

					msg.from = sender;
					this.deliver(this.sockets[i],
						{action: 'signal', msg: msg});
				}
			}
		}

		if (data.action == 'message')
		{
			var from = sender;

			for (var i = 0; i < this.sockets.length; i++)
			{
				if (this.sockets[i].ws != ws)
				{
					this.deliver(this.sockets[i],
						{action: 'message', msg: data.msg, from: from});
				}
			}
		}
	};

	FakeRtServer.prototype.disconnect = function(ws)
	{
		for (var i = this.sockets.length - 1; i >= 0; i--)
		{
			if (this.sockets[i].ws == ws)
			{
				var cId = this.sockets[i].cId;
				this.sockets.splice(i, 1);

				for (var j = 0; j < this.sockets.length; j++)
				{
					this.deliver(this.sockets[j],
						{action: 'clientLeft', msg: cId});
				}
			}
		}
	};

	// Network drop for one client: its live socket dies (close event
	// fires in the frame and triggers the rejoin backoff)
	FakeRtServer.prototype.dropClient = function(client)
	{
		for (var i = this.sockets.length - 1; i >= 0; i--)
		{
			var entry = this.sockets[i];

			if (entry.ws.owner == client)
			{
				entry.ws.readyState = 3;
				this.disconnect(entry.ws);

				(function(ws)
				{
					window.setTimeout(function()
					{
						ws.dispatch('close', {code: 1006});
					}, 0);
				})(entry.ws);
			}
		}
	};

	FakeRtServer.prototype.makeSocket = function(client)
	{
		var server = this;

		var ws = {
			readyState: 0,
			owner: client,
			listeners: {},
			addEventListener: function(type, fn)
			{
				(this.listeners[type] = this.listeners[type] || []).push(fn);
			},
			removeEventListener: function(type, fn)
			{
				var l = this.listeners[type];

				if (l != null && l.indexOf(fn) >= 0)
				{
					l.splice(l.indexOf(fn), 1);
				}
			},
			dispatch: function(type, evt)
			{
				var l = (this.listeners[type] || []).slice();

				for (var i = 0; i < l.length; i++)
				{
					try
					{
						l[i](evt);
					}
					catch (e)
					{
						if (window.console != null)
						{
							console.error('FakeRtServer listener', e);
						}
					}
				}
			},
			send: function(str)
			{
				if (this.readyState != 1)
				{
					throw new Error('socket not open');
				}

				server.onSend(this, str);
			},
			close: function(code)
			{
				if (this.readyState != 3)
				{
					this.readyState = 3;
					server.disconnect(this);
					var s = this;

					window.setTimeout(function()
					{
						s.dispatch('close', {code: code || 1000});
					}, 0);
				}
			}
		};

		window.setTimeout(function()
		{
			if (ws.readyState == 0)
			{
				ws.readyState = 1;
				server.connect(ws);
				ws.dispatch('open', {});
			}
		}, 0);

		return ws;
	};

	// Swaps the transport stub for the real P2PCollab wired to the fake
	// server; from here on the frame runs the production roster code
	function enableRealP2P(client, server)
	{
		var win = client.win;

		client.file.getCurrentUser = function()
		{
			return {id: 'user' + client.idx,
				displayName: 'User ' + client.idx};
		};

		win.P2PCollab.createSocket = function(url)
		{
			client.socketUrls = client.socketUrls || [];
			client.socketUrls.push(url);
			return server.makeSocket(client);
		};

		client.p2p = new win.P2PCollab(client.ui, client.sync, 'chan-test');
		client.sync.p2pCollab = client.p2p;
		client.p2p.joinFile();
	};

	// The observed production failure: the server never announces the
	// later client to the earlier one. Phase 0 proves the deadlock
	// exists with the announce disabled (red-proof built in), phase 1
	// proves the announce heals it and the resend delivers the content
	async function runP2pJoinRace(clients, broker, report, ctx)
	{
		var A = clients[0];
		var B = clients[1];
		A.ui.selectPage(A.ui.pages[0], true);
		B.ui.selectPage(B.ui.pages[0], true);
		var server = new FakeRtServer();

		// Phase 0: no announce, newClient lost
		A.win.urlParams['join-announce'] = '0';
		B.win.urlParams['join-announce'] = '0';
		enableRealP2P(A, server);
		await sleep(200);
		server.dropNewClient = true;
		enableRealP2P(B, server);
		await sleep(300);

		A.ui.editor.graph.insertVertex(null, 'pj_dead', 'DEAD',
			40, 40, 80, 40);
		A.flush();
		await sleep(350);

		if (findCellAnyPage(B, 'pj_dead') != null)
		{
			report.fail('p2p-join-race', 'phase 0: the diff reached the ' +
				'peer without the announce - the deadlock repro is broken ' +
				'and this scenario no longer proves anything');

			return;
		}

		// Phase 1: announce on, the later client rejoins (the drop is
		// still active, so ONLY the announce can heal the roster)
		A.win.urlParams['join-announce'] = '1';
		B.win.urlParams['join-announce'] = '1';
		B.p2p.joinFile();
		await sleep(500);

		// A's addPeer on the announce must have resent the content
		if (findCellAnyPage(B, 'pj_dead') == null)
		{
			report.fail('p2p-join-race',
				'the announce did not heal the roster: the content made ' +
				'while mutually invisible never reached the peer');
		}

		// And the live path must be open now in both directions
		A.ui.editor.graph.insertVertex(null, 'pj_live', 'LIVE',
			40, 120, 80, 40);
		A.flush();
		B.ui.editor.graph.insertVertex(null, 'pj_live_b', 'LIVEB',
			200, 120, 80, 40);
		B.flush();
		await sleep(350);

		if (findCellAnyPage(B, 'pj_live') == null ||
			findCellAnyPage(A, 'pj_live_b') == null)
		{
			report.fail('p2p-join-race',
				'live diffs still gated after the roster healed');
		}
	};

	// Impersonation on the WebRTC signalling path. A signal is relayed
	// to ONE target, and the receiver keys its peer connection and its
	// roster entry on the sender - which the payload used to carry
	// itself, written by whoever sent it. Anyone on the channel could
	// therefore claim another client's identity in the negotiation.
	// The server stamps the authenticated sender now; this asserts the
	// receiver acts on that and not on the claim.
	async function runSignalImpersonation(clients, broker, report)
	{
		var A = clients[0];
		var B = clients[1];
		A.ui.selectPage(A.ui.pages[0], true);
		B.ui.selectPage(B.ui.pages[0], true);
		var server = new FakeRtServer();

		enableRealP2P(A, server);
		await sleep(200);
		enableRealP2P(B, server);
		await sleep(300);

		var entryOf = function(client)
		{
			for (var i = 0; i < server.sockets.length; i++)
			{
				if (server.sockets[i].ws.owner == client)
				{
					return server.sockets[i];
				}
			}

			return null;
		};

		var aEntry = entryOf(A);
		var bEntry = entryOf(B);

		if (aEntry == null || bEntry == null)
		{
			report.fail('signal-impersonation',
				'setup: the clients did not register on the server');

			return;
		}

		var forged = 'ghost-impersonated';

		// Sent through the REAL socket, so the server sees the true
		// sender exactly as in production, while the payload claims
		// somebody else
		server.onSend(aEntry.ws, JSON.stringify({action: 'sendSignal',
			msg: {to: bEntry.cId, from: forged, signal: {type: 'offer'}}}));
		await sleep(200);

		var peers = B.p2p.getPeers();

		if (peers.indexOf(forged) >= 0)
		{
			report.fail('signal-impersonation', 'the receiver acted on the ' +
				'CLAIMED sender (' + forged + ') - any client on the ' +
				'channel can impersonate another one in the negotiation');
		}

		if (peers.indexOf(aEntry.cId) < 0)
		{
			report.fail('signal-impersonation', 'the receiver did not ' +
				'attribute the signal to its real sender (peers=' +
				peers.join(',') + ')');
		}

		// A signal claiming to come from the receiver itself must not
		// roster it. Held by addPeer's own self-check today, so this
		// locks the property rather than the guard in signal()
		server.onSend(aEntry.ws, JSON.stringify({action: 'sendSignal',
			msg: {to: bEntry.cId, from: bEntry.cId,
				signal: {type: 'offer'}}}));
		await sleep(150);

		if (B.p2p.getPeers().indexOf(bEntry.cId) >= 0)
		{
			report.fail('signal-impersonation',
				'the receiver added ITSELF to its peer roster');
		}

		// And the session keeps working after the forged signals
		A.ui.editor.graph.insertVertex(null, 'si_ok', 'OK', 40, 40, 80, 40);
		A.flush();
		await sleep(350);

		if (findCellAnyPage(B, 'si_ok') == null)
		{
			report.fail('signal-impersonation',
				'the forged signals broke the live channel');
		}
	};

	// The version gates on the PRODUCTION transport. mixed-version
	// drives the same gates through changeListener, but production live
	// diffs never take that path: they travel over the socket into
	// P2PCollab.processMsg, which used to hand the payload straight to
	// receiveRemoteChanges. The suite therefore certified a gate the
	// product did not have on the path that matters - this scenario
	// runs the REAL P2PCollab so the gate is proven where it ships.
	async function runP2pVersionGate(clients, broker, report, ctx)
	{
		var A = clients[0];
		var B = clients[1];
		A.ui.selectPage(A.ui.pages[0], true);
		B.ui.selectPage(B.ui.pages[0], true);
		var server = new FakeRtServer();

		enableRealP2P(A, server);
		await sleep(200);
		enableRealP2P(B, server);
		await sleep(300);

		// Baseline: the socket path is open, so a gated cell later
		// proves the gate and not a broken transport
		A.ui.editor.graph.insertVertex(null, 'vg_base', 'BASE',
			40, 40, 80, 40);
		A.flush();
		await sleep(350);

		if (findCellAnyPage(B, 'vg_base') == null)
		{
			report.fail('p2p-version-gate', 'setup: the real socket path ' +
				'did not deliver - the gate assertions below would pass ' +
				'for the wrong reason');

			return;
		}

		// Phase 1: newer payload at an older client. B reads v7 as
		// "app too new" and must redirect instead of applying it
		B.win.DrawioFileSync.PROTOCOL = 6;

		A.ui.editor.graph.insertVertex(null, 'vg_a1', 'A1',
			40, 120, 80, 40);
		A.flush();
		await sleep(350);

		if (findCellAnyPage(B, 'vg_a1') != null)
		{
			report.fail('p2p-version-gate', 'phase 1: the v6 client applied ' +
				'a v7 live diff from the socket - the protocol gate is ' +
				'missing on the production transport');
		}

		if (!B.file.redirectDialogShowing)
		{
			report.fail('p2p-version-gate', 'phase 1: the newer payload did ' +
				'not trigger the redirect on the older client');
		}

		// Phase 2: older payload at a newer client. A must ignore the
		// v6 diff (its semantics are not safe to apply) and fall back
		// to the file instead of dropping the sender's work silently
		var notifiedBefore = A.sync.fileChangedNotifyCount || 0;
		A.sync.fileChangedNotifyCount = notifiedBefore;
		var origNotify = A.sync.fileChangedNotify;
		A.sync.fileChangedNotify = function()
		{
			A.sync.fileChangedNotifyCount++;

			return origNotify.apply(this, arguments);
		};

		B.ui.editor.graph.insertVertex(null, 'vg_b1', 'B1',
			200, 120, 80, 40);
		B.flush();
		await sleep(350);

		if (findCellAnyPage(A, 'vg_b1') != null)
		{
			report.fail('p2p-version-gate', 'phase 2: the v7 client applied ' +
				'a v6 live diff from the socket');
		}

		if (A.sync.fileChangedNotifyCount <= notifiedBefore)
		{
			report.fail('p2p-version-gate', 'phase 2: the gated payload did ' +
				'not degrade to the file fallback, so the sender\'s work ' +
				'would be lost until an unrelated save');
		}

		A.sync.fileChangedNotify = origNotify;

		// Phase 2b: PRESENCE survives the payload gate. Cursors and
		// selections are view state - they never enter the model, the
		// own pages, the snapshot or the file - so a version mismatch
		// cannot corrupt anything through them. Gating them would make
		// an outdated collaborator invisible while they keep editing
		// and saving, which is strictly worse for the user than seeing
		// where they are. B is still on the old protocol here
		var highlighted = [];
		var origHighlight = A.ui.editor.graph.highlightCell;

		A.ui.editor.graph.highlightCell = function(cell)
		{
			highlighted.push((cell != null) ? cell.id : null);

			return origHighlight.apply(this, arguments);
		};

		B.ui.editor.graph.setSelectionCell(
			B.ui.editor.graph.getModel().getCell('vg_base'));
		B.p2p.selectionChangeListener();
		await sleep(400);

		A.ui.editor.graph.highlightCell = origHighlight;

		if (highlighted.indexOf('vg_base') < 0)
		{
			report.fail('p2p-version-gate', 'phase 2b: the gated client\'s ' +
				'selection no longer reaches the peer - presence must not ' +
				'be gated with the document payload');
		}

		// Phase 3: same protocol, but the app version is below the
		// minimum the receiver accepts (the runtime rollout hook)
		B.win.DrawioFileSync.PROTOCOL = 7;
		B.file.redirectDialogShowing = false;
		var origVersion = B.win.EditorUi.VERSION;
		B.win.EditorUi.VERSION = '1.0.0';
		A.sync.minRemoteAppVersion = '99.0.0';

		B.ui.editor.graph.insertVertex(null, 'vg_b2', 'B2',
			200, 200, 80, 40);
		B.flush();
		await sleep(350);

		if (findCellAnyPage(A, 'vg_b2') != null)
		{
			report.fail('p2p-version-gate', 'phase 3: a payload below ' +
				'minRemoteAppVersion was applied from the socket');
		}

		// Phase 4: gates lifted, the saves carry everything across the
		// version boundary - the only route while a gate is active
		B.win.EditorUi.VERSION = origVersion;
		A.sync.minRemoteAppVersion = null;

		await A.save(0);
		await broker.drain();
		await sleep(200);
		await B.save(0);
		await broker.drain();
		await sleep(200);

		for (var i = 0; i < clients.length; i++)
		{
			if (!clients[i].file.isModified())
			{
				clients[i].cleanupNow();
			}
		}

		await sleep(250);

		var ids = ['vg_base', 'vg_a1', 'vg_b1', 'vg_b2'];

		for (var i = 0; i < ids.length; i++)
		{
			if (findCellAnyPage(A, ids[i]) == null ||
				findCellAnyPage(B, ids[i]) == null)
			{
				report.fail('p2p-version-gate', 'phase 4: ' + ids[i] +
					' did not survive the save cycle on both clients - ' +
					'gating must delay content, never lose it');
			}
		}
	};

	// A client keeps editing through a network drop; the rejoin plus
	// the first-peer resend must deliver the offline edits WITHOUT any
	// save (scenario 7 of the manual list, now automated end to end)
	async function runP2pOfflineRejoin(clients, broker, report, ctx)
	{
		var A = clients[0];
		var B = clients[1];
		A.ui.selectPage(A.ui.pages[0], true);
		B.ui.selectPage(B.ui.pages[0], true);
		var server = new FakeRtServer();

		enableRealP2P(A, server);
		await sleep(200);
		enableRealP2P(B, server);
		await sleep(500);

		// Sanity: live flow works
		A.ui.editor.graph.insertVertex(null, 'po_live', 'LIVE',
			40, 40, 80, 40);
		A.flush();
		await sleep(350);

		if (findCellAnyPage(B, 'po_live') == null)
		{
			report.fail('p2p-offline-rejoin-setup',
				'live diff did not flow before the drop');

			return;
		}

		// The network drops for A; A keeps editing
		server.dropClient(A);
		await sleep(100);
		A.ui.editor.graph.insertVertex(null, 'po_off', 'OFF',
			40, 120, 80, 40);
		A.flush();
		var modelA = A.ui.editor.graph.getModel();
		modelA.setValue(modelA.getCell('po_live'), 'RENAMED');
		A.flush();

		// The rejoin backoff fires after ~2s; the fresh clientsList
		// contains the peer, whose addPeer triggers the resend. Under
		// REAL timers the autosave legitimately races the rejoin: the
		// save advances the shadow (empty resend, correct) and the
		// content arrives via the merge path instead - so the arrival
		// is polled and the no-save claim only holds in neutralized
		// mode, where no autosave can interfere.
		var realTiming = /[?&]timing=real/.test(
			window.location.search);
		// Real timers: save (~2s) + notify/catchup/merge (~4s) + lazy
		// cleanup (15s) - the arrival is correct-but-lazy by design
		var deadline = (realTiming) ? 30000 : 3600;
		var waited = 0;

		while (waited < deadline)
		{
			var liveCell = findCellAnyPage(B, 'po_live');

			if (findCellAnyPage(B, 'po_off') != null && liveCell != null &&
				liveCell.value == 'RENAMED')
			{
				break;
			}

			// Diagnostic heartbeat: which guard keeps the merged
			// content invisible on the idle peer?
			if (waited % 2000 == 0)
			{
				var uiVsOwn = '?';

				try
				{
					uiVsOwn = JSON.stringify(B.ui.diffPages(B.ui.pages,
						B.file.ownPages)).substring(0, 90);
				}
				catch (e)
				{
					uiVsOwn = 'err:' + e.message;
				}

				report.log('p8 t=' + waited +
					' modified=' + B.file.isModified() +
					' changed=' + B.sync.localFileWasChanged +
					' thread=' + (B.sync.cleanupThread != null) +
					' immediate=' + B.sync.cleanupImmediatePending +
					' uiVsOwn=' + uiVsOwn);
			}

			// The broker delivers saves on drain only - without this
			// the autosave that carries the offline edits under real
			// timers never reached the peer and the poll starved (the
			// merge under suspicion in task #8 had simply never run)
			await broker.drain();
			await sleep(400);
			waited += 400;
		}

		var live = findCellAnyPage(B, 'po_live');

		if (findCellAnyPage(B, 'po_off') == null)
		{
			report.fail('p2p-offline-rejoin', 'the offline insert never ' +
				'reached the peer after the rejoin' +
				((realTiming) ? '' : ' (no save involved)'));
		}

		if (live == null || live.value != 'RENAMED')
		{
			report.fail('p2p-offline-rejoin', 'the offline rename never ' +
				'reached the peer after the rejoin (value=' +
				((live != null) ? live.value : 'null') + ')');
		}

		report.log('p2p-offline-rejoin: delivered after ' + waited +
			'ms (' + ((realTiming) ? 'real timers, save may carry' :
				'neutralized, resend only') + ')');

		// And the reconnected client keeps receiving (polled: under
		// full-matrix load the fake-server delivery can exceed a
		// fixed sleep)
		B.ui.editor.graph.insertVertex(null, 'po_back', 'BACK',
			200, 120, 80, 40);
		B.flush();
		var backWait = 0;

		while (findCellAnyPage(A, 'po_back') == null && backWait < 4000)
		{
			await sleep(250);
			backWait += 250;
		}

		if (findCellAnyPage(A, 'po_back') == null)
		{
			report.fail('p2p-offline-rejoin',
				'the rejoined client no longer receives live diffs');
		}
	};

	// --- exploratory scenarios --------------------------------------------
	// Derived from the manually found bug patterns (dead view targets,
	// undo across structure boundaries, lifecycle windows, echo): these
	// assert invariants FIRST instead of locking a known bug - a red
	// here is a new finding, not a regression.

	// Cells with the given value across all pages (duplicates never
	// share an id inside one model, they show up as extra ids)
	function exploreCountValue(client, value)
	{
		var n = 0;

		var walk = function(c)
		{
			if (c.value == value)
			{
				n++;
			}

			for (var i = 0; i < c.getChildCount(); i++)
			{
				walk(c.getChildAt(i));
			}
		};

		for (var p = 0; p < client.ui.pages.length; p++)
		{
			client.ui.updatePageRoot(client.ui.pages[p]);
			walk(client.ui.pages[p].root);
		}

		return n;
	};

	function exploreRootOf(cell)
	{
		while (cell != null && cell.getParent() != null)
		{
			cell = cell.getParent();
		}

		return cell;
	};

	// The drilled-into container (enter group) is transient view state:
	// a peer deleting it leaves currentRoot pointing at a DEAD object,
	// which no verdict covered (the render walk starts at currentRoot)
	async function runDrillIn(clients, broker, report, ctx)
	{
		var A = clients[0];
		var B = clients[1];
		A.ui.selectPage(A.ui.pages[0], true);
		B.ui.selectPage(B.ui.pages[0], true);
		var graphA = A.ui.editor.graph;
		var modelA = graphA.getModel();

		var g = graphA.insertVertex(null, 'di_g', 'G', 100, 80, 240, 200,
			'swimlane;whiteSpace=wrap;html=1;');
		graphA.insertVertex(g, 'di_c', 'C', 40, 60, 80, 40);
		A.flush();
		await broker.drain();
		await sleep(120);
		await A.save(0);
		await broker.drain();
		await sleep(120);

		graphA.enterGroup(modelA.getCell('di_g'));

		if (graphA.view.currentRoot != modelA.getCell('di_g'))
		{
			report.fail('drill-in-setup', 'enterGroup did not set the root');

			return;
		}

		// The peer removes the drilled-into container
		B.ui.editor.graph.removeCells(
			[B.ui.editor.graph.getModel().getCell('di_g')]);
		B.flush();
		await broker.drain();
		await sleep(200);

		var root = graphA.view.currentRoot;

		if (root != null && modelA.getCell(root.getId()) != root)
		{
			report.fail('drill-in', 'client0 currentRoot is a dead object ' +
				'after the peer removed the drilled-into container');

			// Heals the view so the remaining asserts test the model
			try
			{
				graphA.home();
			}
			catch (e)
			{
				report.fail('drill-in', 'home() threw: ' + e.message);
			}
		}

		// Editing must still work and reach the peer
		graphA.insertVertex(null, 'di_probe', 'P', 60, 400, 60, 30);
		A.flush();
		await broker.drain();
		await sleep(200);

		if (findCellAnyPage(B, 'di_probe') == null)
		{
			report.fail('drill-in',
				'insert after the dead-root window never reached the peer');
		}

		// And the peer restoring the container must not confuse A
		B.ui.undo();
		B.flush();
		await broker.drain();
		await sleep(200);

		if (findCellAnyPage(A, 'di_g') == null)
		{
			report.fail('drill-in', 'client0 missed the restored container');
		}
	};

	// The render verdict skips cells under collapsed ancestors, so a
	// remote insert into a collapsed container is only verifiable after
	// expanding - a stale or missing view state here was never caught
	async function runCollapsedInsert(clients, broker, report, ctx)
	{
		var A = clients[0];
		var B = clients[1];
		A.ui.selectPage(A.ui.pages[0], true);
		B.ui.selectPage(B.ui.pages[0], true);
		var graphA = A.ui.editor.graph;
		var modelA = graphA.getModel();
		var graphB = B.ui.editor.graph;
		var modelB = graphB.getModel();

		var g = graphA.insertVertex(null, 'ci_g', 'G', 400, 80, 200, 160,
			'swimlane;whiteSpace=wrap;html=1;');
		graphA.insertVertex(g, 'ci_c1', 'C1', 30, 50, 80, 30);
		A.flush();
		await broker.drain();
		await sleep(120);
		await A.save(0);
		await broker.drain();
		await sleep(120);

		graphA.foldCells(true, false, [modelA.getCell('ci_g')]);
		A.flush();
		await broker.drain();
		await sleep(150);

		if (!modelB.getCell('ci_g').isCollapsed())
		{
			report.fail('collapsed-insert-setup',
				'collapse did not reach the peer');

			return;
		}

		// The peer adds content INSIDE the collapsed container
		graphB.insertVertex(modelB.getCell('ci_g'), 'ci_c2', 'C2',
			30, 100, 80, 30);
		graphB.insertEdge(modelB.getCell('ci_g'), 'ci_e', '',
			modelB.getCell('ci_c1'), modelB.getCell('ci_c2'));
		B.flush();
		await broker.drain();
		await sleep(150);

		graphA.foldCells(false, false, [modelA.getCell('ci_g')]);
		A.flush();
		await broker.drain();
		await sleep(250);

		// After expanding, the remote content must actually render
		var c2 = modelA.getCell('ci_c2');
		var e = modelA.getCell('ci_e');

		if (c2 == null || e == null)
		{
			report.fail('collapsed-insert',
				'remote insert into the collapsed container missing');
		}
		else
		{
			if (graphA.view.getState(c2) == null)
			{
				report.fail('collapsed-insert', 'client0 does not render ' +
					'the remotely inserted child after expanding');
			}

			if (graphA.view.getState(e) == null)
			{
				report.fail('collapsed-insert', 'client0 does not render ' +
					'the remotely inserted edge after expanding');
			}
		}
	};

	// Edge labels are children with RELATIVE geometry - the repair
	// paths mostly reason about absolute geometries, so a label move
	// replayed across the peer deleting the edge is untested ground
	async function runEdgeLabel(clients, broker, report, ctx)
	{
		var A = clients[0];
		var B = clients[1];
		A.ui.selectPage(A.ui.pages[0], true);
		B.ui.selectPage(B.ui.pages[0], true);
		var graphA = A.ui.editor.graph;
		var modelA = graphA.getModel();

		var v1 = graphA.insertVertex(null, 'el_v1', 'V1', 40, 40, 80, 40);
		var v2 = graphA.insertVertex(null, 'el_v2', 'V2', 300, 40, 80, 40);
		var e = graphA.insertEdge(null, 'el_e', '', v1, v2,
			'edgeStyle=orthogonalEdgeStyle;html=1;');
		var l = graphA.insertVertex(e, 'el_l', 'LBL', 0, 0, 0, 0,
			'edgeLabel;html=1;resizable=0;', true);
		A.flush();
		await broker.drain();
		await sleep(120);
		await A.save(0);
		await broker.drain();
		await sleep(120);

		// Moves the label along the edge (relative x) with an offset
		var geo = modelA.getGeometry(modelA.getCell('el_l')).clone();
		geo.x = -0.5;
		geo.offset = new A.win.mxPoint(10, 10);
		modelA.setGeometry(modelA.getCell('el_l'), geo);
		A.flush();
		await broker.drain();
		await sleep(150);

		// The peer deletes the edge - the label dies with it
		B.ui.editor.graph.removeCells(
			[B.ui.editor.graph.getModel().getCell('el_e')]);
		B.flush();
		await broker.drain();
		await sleep(150);

		// Undo and redo of the label move against the dead label: no
		// ghost may be born, nothing may crash
		A.ui.undo();
		A.flush();
		await broker.drain();
		await sleep(150);
		A.ui.redo();
		A.flush();
		await broker.drain();
		await sleep(150);

		for (var ci = 0; ci < 2; ci++)
		{
			if (findCellAnyPage(clients[ci], 'el_l') != null ||
				findCellAnyPage(clients[ci], 'el_e') != null)
			{
				report.fail('edge-label', clients[ci].name +
					' resurrected the deleted edge or label via the replay');
			}
		}

		// The peer revives the edge subtree; a further replay must then
		// resolve the REVIVED label and apply the recorded geometry
		B.ui.undo();
		B.flush();
		await broker.drain();
		await sleep(150);
		A.ui.undo();
		A.flush();
		await broker.drain();
		await sleep(200);

		for (var ci = 0; ci < 2; ci++)
		{
			var lc = findCellAnyPage(clients[ci], 'el_l');

			if (lc == null)
			{
				report.fail('edge-label', clients[ci].name +
					' lost the label after the revive');
			}
			else if (lc.getGeometry() == null || !lc.getGeometry().relative)
			{
				report.fail('edge-label', clients[ci].name +
					' label geometry lost its relative flag');
			}
		}
	};

	// A page delete raced by edits on that page, then undone: the
	// restore must bring back a consistent page on every client and
	// both fates of the raced edit must at least AGREE across clients
	async function runPageDeleteUndo(clients, broker, report, ctx)
	{
		var A = clients[0];
		var B = clients[1];
		A.ui.selectPage(A.ui.pages[0], true);
		B.ui.selectPage(B.ui.pages[0], true);

		A.ui.insertPage();
		A.flush();
		await broker.drain();
		await sleep(150);
		var pgId = A.ui.pages[1].getId();
		A.ui.selectPage(A.ui.pages[1], true);
		A.ui.editor.graph.insertVertex(null, 'pd_v1', 'P1', 40, 40, 80, 40);
		A.flush();
		await broker.drain();
		await sleep(120);
		await A.save(0);
		await broker.drain();
		await sleep(120);

		if (findPageById(B, pgId) == null)
		{
			report.fail('page-delete-undo-setup', 'page did not sync');

			return;
		}

		// The peer edits the page WHILE the delete crosses it
		B.ui.selectPage(findPageById(B, pgId), true);
		B.ui.editor.graph.insertVertex(null, 'pd_v2', 'P2', 40, 120, 80, 40);
		A.ui.removePage(A.ui.pages[1]);
		B.flush();
		A.flush();
		await broker.drain();
		await sleep(250);

		if (findPageById(A, pgId) != null || findPageById(B, pgId) != null)
		{
			// Divergence here would surface in the final verdicts too
			report.log('page-delete-undo: page still present after delete');
		}

		// The deleter undoes: the page must come back everywhere with
		// its content as of delete time
		A.ui.undo();
		A.flush();
		await broker.drain();
		await sleep(250);

		for (var ci = 0; ci < 2; ci++)
		{
			if (findPageById(clients[ci], pgId) == null)
			{
				report.fail('page-delete-undo', clients[ci].name +
					' did not restore the page on undo');
			}

			if (findCellAnyPage(clients[ci], 'pd_v1') == null)
			{
				report.fail('page-delete-undo', clients[ci].name +
					' lost the saved content of the restored page');
			}
		}

		// The raced edit may win or lose - but identically on both
		var onA = findCellAnyPage(A, 'pd_v2') != null;
		var onB = findCellAnyPage(B, 'pd_v2') != null;
		report.log('page-delete-undo: raced edit present A=' + onA +
			' B=' + onB);

		if (onA != onB)
		{
			report.fail('page-delete-undo',
				'clients disagree about the raced edit (split brain)');
		}

		// The peer's history was invalidated for the dead page - its
		// undo must stay functional and convergent regardless
		B.ui.undo();
		B.flush();
		await broker.drain();
		await sleep(200);
	};

	// An undo fired from ANOTHER page replays into the edited page's
	// tree (the foreign-root branch of the replay resolution); the peer
	// deleting the target forces the orphan branch at the same time
	async function runCrossPageUndo(clients, broker, report, ctx)
	{
		var A = clients[0];
		var B = clients[1];
		A.ui.selectPage(A.ui.pages[0], true);
		B.ui.selectPage(B.ui.pages[0], true);
		var graphA = A.ui.editor.graph;
		var modelA = graphA.getModel();

		graphA.insertVertex(null, 'cp_v', 'V', 40, 40, 80, 40);
		graphA.insertVertex(null, 'cp_g', 'G', 300, 20, 200, 160,
			'swimlane;whiteSpace=wrap;html=1;');
		A.flush();
		await broker.drain();
		await sleep(120);
		A.ui.insertPage();
		A.flush();
		await broker.drain();
		await sleep(120);
		await A.save(0);
		await broker.drain();
		await sleep(120);

		// The edit that will be undone: move the shape into the
		// container (on page 1)
		A.ui.selectPage(A.ui.pages[0], true);
		modelA.beginUpdate();

		try
		{
			modelA.add(modelA.getCell('cp_g'), modelA.getCell('cp_v'));
		}
		finally
		{
			modelA.endUpdate();
		}

		A.flush();
		await broker.drain();
		await sleep(150);

		// A moves to page 2, the peer deletes the container on page 1
		A.ui.selectPage(A.ui.pages[1], true);
		B.ui.editor.graph.removeCells(
			[B.ui.editor.graph.getModel().getCell('cp_g')]);
		B.flush();
		await broker.drain();
		await sleep(150);

		// Undo from page 2: must repair into page 1, not leak here
		A.ui.undo();
		A.flush();
		await broker.drain();
		await sleep(200);

		for (var ci = 0; ci < 2; ci++)
		{
			var v = findCellAnyPage(clients[ci], 'cp_v');

			if (v == null)
			{
				report.fail('cross-page-undo', clients[ci].name +
					' lost the shape');
			}
			else if (exploreRootOf(v) !=
				clients[ci].ui.pages[0].root)
			{
				report.fail('cross-page-undo', clients[ci].name +
					' shape leaked off page 1 (root mismatch)');
			}

			if (exploreCountValue(clients[ci], 'V') != 1)
			{
				report.fail('cross-page-undo', clients[ci].name +
					' shape duplicated across pages');
			}
		}

		// Redo against the dead container from the foreign page
		A.ui.redo();
		A.flush();
		await broker.drain();
		await sleep(200);

		for (var ci = 0; ci < 2; ci++)
		{
			if (exploreCountValue(clients[ci], 'V') != 1)
			{
				report.fail('cross-page-undo', clients[ci].name +
					' redo lost or duplicated the shape');
			}
		}
	};

	// Group and ungroup replays raced by a peer moving a member out -
	// the composite cousin of the reparent cases
	async function runGroupRace(clients, broker, report, ctx)
	{
		var A = clients[0];
		var B = clients[1];
		A.ui.selectPage(A.ui.pages[0], true);
		B.ui.selectPage(B.ui.pages[0], true);
		var graphA = A.ui.editor.graph;
		var modelA = graphA.getModel();
		var graphB = B.ui.editor.graph;
		var modelB = graphB.getModel();

		var v1 = graphA.insertVertex(null, 'gr_v1', 'G1', 40, 40, 80, 40);
		var v2 = graphA.insertVertex(null, 'gr_v2', 'G2', 160, 40, 80, 40);
		A.flush();
		await broker.drain();
		await sleep(120);
		await A.save(0);
		await broker.drain();
		await sleep(120);

		var group = graphA.groupCells(null, 20,
			[modelA.getCell('gr_v1'), modelA.getCell('gr_v2')]);
		var groupId = group.getId();
		A.flush();
		await broker.drain();
		await sleep(150);

		// The peer pulls a member out of the group
		modelB.beginUpdate();

		try
		{
			modelB.add(graphB.getDefaultParent(), modelB.getCell('gr_v2'));
		}
		finally
		{
			modelB.endUpdate();
		}

		B.flush();
		await broker.drain();
		await sleep(150);

		graphA.ungroupCells([modelA.getCell(groupId)]);
		A.flush();
		await broker.drain();
		await sleep(200);

		var checkSingles = function(label)
		{
			for (var ci = 0; ci < 2; ci++)
			{
				if (exploreCountValue(clients[ci], 'G1') != 1 ||
					exploreCountValue(clients[ci], 'G2') != 1)
				{
					report.fail('group-race', clients[ci].name + ' ' + label +
						': members lost or duplicated (G1=' +
						exploreCountValue(clients[ci], 'G1') + ' G2=' +
						exploreCountValue(clients[ci], 'G2') + ')');
				}
			}
		};

		checkSingles('after ungroup');

		// Replay the composite backwards across the interference
		A.ui.undo();
		A.flush();
		await broker.drain();
		await sleep(200);
		checkSingles('after ungroup-undo');

		A.ui.undo();
		A.flush();
		await broker.drain();
		await sleep(200);
		checkSingles('after group-undo');
	};

	// Both clients edited while mutually unjoined (the symmetric join
	// race): both resends must cross-merge without losing either side
	async function runDualResend(clients, broker, report, ctx)
	{
		var A = clients[0];
		var B = clients[1];
		A.ui.selectPage(A.ui.pages[0], true);
		B.ui.selectPage(B.ui.pages[0], true);

		A.ui.editor.graph.insertVertex(null, 'dr_base', 'BASE',
			40, 40, 80, 40);
		A.flush();
		await broker.drain();
		await sleep(120);
		await A.save(0);
		await broker.drain();
		await sleep(120);

		A.unjoined = true;
		B.unjoined = true;
		A.ui.editor.graph.insertVertex(null, 'dr_a', 'FROM-A',
			40, 120, 80, 40);
		B.ui.editor.graph.insertVertex(null, 'dr_b', 'FROM-B',
			200, 120, 80, 40);
		A.flush();
		B.flush();
		await broker.drain();
		broker.liveLog = [];
		A.unjoined = false;
		B.unjoined = false;

		// Both sides resend what no save confirmed (the announce path
		// triggers exactly this on the first roster peer)
		A.sync.sendUnconfirmedChanges();
		B.sync.sendUnconfirmedChanges();
		await broker.drain();
		await sleep(250);

		for (var ci = 0; ci < 2; ci++)
		{
			if (findCellAnyPage(clients[ci], 'dr_a') == null ||
				findCellAnyPage(clients[ci], 'dr_b') == null)
			{
				report.fail('dual-resend', clients[ci].name +
					' lost one side of the crossed resends');
			}

			if (exploreCountValue(clients[ci], 'FROM-A') != 1 ||
				exploreCountValue(clients[ci], 'FROM-B') != 1)
			{
				report.fail('dual-resend', clients[ci].name +
					' duplicated content in the crossed resends');
			}
		}
	};

	// Restoring an older revision while the peer edits live: a
	// wholesale rewrite racing normal diffs must neither crash nor
	// split-brain; the fate of each edit must agree across clients
	async function runRevisionRestore(clients, broker, report, ctx)
	{
		var A = clients[0];
		var B = clients[1];
		A.ui.selectPage(A.ui.pages[0], true);
		B.ui.selectPage(B.ui.pages[0], true);

		A.ui.editor.graph.insertVertex(null, 'rr_v1', 'R1', 40, 40, 80, 40);
		A.flush();
		await broker.drain();
		await sleep(120);
		await A.save(0);
		await broker.drain();
		await sleep(120);
		var oldData = A.file.getData();

		A.ui.editor.graph.insertVertex(null, 'rr_v2', 'R2', 40, 120, 80, 40);
		A.flush();
		await broker.drain();
		await sleep(120);
		await A.save(0);
		await broker.drain();
		await sleep(120);

		if (typeof A.ui.replaceFileData !== 'function')
		{
			report.log('revision-restore: replaceFileData unavailable, ' +
				'scenario skipped');

			return;
		}

		// The peer types while the restore is applied
		B.ui.editor.graph.insertVertex(null, 'rr_b', 'RB', 200, 120, 80, 40);
		B.flush();

		try
		{
			A.ui.replaceFileData(oldData);

			// The restore must flow through the sync like the
			// RevisionDialog does it
			if (A.file.sync != null)
			{
				A.file.sync.fileRestored();
			}
		}
		catch (e)
		{
			report.fail('revision-restore', 'replaceFileData threw: ' +
				e.message);

			return;
		}

		A.flush();
		await broker.drain();
		await sleep(300);
		await A.save(0);
		await broker.drain();
		await sleep(250);

		// The peer holds pending state of its own, so the save merge
		// reaches only its own pages and the visible reconciliation
		// waits for the lazy cleanup (production: up to 15s; the
		// harness neutralizes the timer). The peer's own content
		// additionally needs ITS next save to enter the own pages of
		// the restorer - the production autosave choreography, driven
		// explicitly here so the agreement assert is deterministic
		report.log('revision-restore window: rr_v2 A=' +
			(findCellAnyPage(A, 'rr_v2') != null) + ' B=' +
			(findCellAnyPage(B, 'rr_v2') != null));
		await B.save(0);
		await broker.drain();
		await sleep(200);
		A.cleanupNow();
		B.cleanupNow();
		await broker.drain();
		await sleep(250);

		var v2A = findCellAnyPage(A, 'rr_v2') != null;
		var v2B = findCellAnyPage(B, 'rr_v2') != null;
		var bA = findCellAnyPage(A, 'rr_b') != null;
		var bB = findCellAnyPage(B, 'rr_b') != null;
		report.log('revision-restore: rr_v2 A=' + v2A + ' B=' + v2B +
			' rr_b A=' + bA + ' B=' + bB);

		if (v2A != v2B || bA != bB)
		{
			report.fail('revision-restore',
				'clients disagree about an edit after the restore and ' +
				'cleanup (split brain)');
		}

		if (findCellAnyPage(A, 'rr_v1') == null ||
			findCellAnyPage(B, 'rr_v1') == null)
		{
			report.fail('revision-restore', 'restored base content missing');
		}
	};

	// The web sibling of the desktop save-echo class: a client with
	// pending local changes receives a save that echoes its own earlier
	// content - nothing may duplicate or roll back
	async function runWebEcho(clients, broker, report, ctx)
	{
		var A = clients[0];
		var B = clients[1];
		A.ui.selectPage(A.ui.pages[0], true);
		B.ui.selectPage(B.ui.pages[0], true);

		B.ui.editor.graph.insertVertex(null, 'we_b1', 'E1', 40, 40, 80, 40);
		B.flush();
		await broker.drain();
		await sleep(150);

		// Second local change stays UNFLUSHED while the peer saves the
		// state that already contains the first one
		B.ui.editor.graph.insertVertex(null, 'we_b2', 'E2', 40, 120, 80, 40);
		await A.save(0);
		await broker.drain();
		await sleep(250);

		B.flush();
		await broker.drain();
		await sleep(200);

		for (var ci = 0; ci < 2; ci++)
		{
			if (exploreCountValue(clients[ci], 'E1') != 1 ||
				exploreCountValue(clients[ci], 'E2') != 1)
			{
				report.fail('web-echo', clients[ci].name +
					' lost or duplicated content through the save echo ' +
					'(E1=' + exploreCountValue(clients[ci], 'E1') +
					' E2=' + exploreCountValue(clients[ci], 'E2') + ')');
			}
		}

		// History must survive the echo merge
		B.ui.undo();
		B.flush();
		await broker.drain();
		await sleep(150);

		if (findCellAnyPage(B, 'we_b2') != null)
		{
			report.fail('web-echo', 'undo after the echo merge did not ' +
				'remove the pending insert');
		}

		B.ui.redo();
		B.flush();
		await broker.drain();
		await sleep(200);

		if (findCellAnyPage(B, 'we_b2') == null ||
			findCellAnyPage(A, 'we_b2') == null)
		{
			report.fail('web-echo', 'redo after the echo merge lost the ' +
				'pending insert');
		}
	};

	// --- delivery-matrix --------------------------------------------------
	// The SAME structural sequence run once per delivery path. Case 17
	// only became visible because the peer's undo arrived through the
	// save and cleanup instead of live: the delivery path decides
	// whether a cell keeps its object identity or is re-materialized,
	// which is exactly what the replay repairs reason about. Every
	// path must produce the same end state.
	async function runDeliveryMatrix(clients, broker, report, ctx)
	{
		var A = clients[0];
		var B = clients[1];
		// 'resend' is deliberately NOT a mode here: after a delete and
		// its undo the peer holds nothing unconfirmed against the
		// file, so the resend path carries no intent by construction
		var modes = ['live', 'cleanup', 'duplicate'];
		var results = [];

		for (var m = 0; m < modes.length; m++)
		{
			var mode = modes[m];
			var sfx = '_' + mode;
			A.ui.selectPage(A.ui.pages[0], true);
			B.ui.selectPage(B.ui.pages[0], true);
			var graphA = A.ui.editor.graph;
			var modelA = graphA.getModel();
			var modelB = B.ui.editor.graph.getModel();

			graphA.insertVertex(null, 'dm_s' + sfx, 'S' + sfx,
				40, 40 + m * 200, 80, 40);
			graphA.insertVertex(null, 'dm_c' + sfx, 'C' + sfx,
				300, 30 + m * 200, 200, 160,
				'swimlane;whiteSpace=wrap;html=1;');
			A.flush();
			await broker.drain();
			await sleep(120);
			await A.save(0);
			await broker.drain();
			await sleep(120);

			// A moves the shape into the container and undoes it
			modelA.beginUpdate();

			try
			{
				modelA.add(modelA.getCell('dm_c' + sfx),
					modelA.getCell('dm_s' + sfx));
			}
			finally
			{
				modelA.endUpdate();
			}

			A.flush();
			await broker.drain();
			await sleep(120);
			A.ui.undo();
			A.flush();
			await broker.drain();
			await sleep(120);

			// The peer deletes the container and undoes that - the
			// revive travels along the path under test
			B.ui.editor.graph.removeCells(
				[modelB.getCell('dm_c' + sfx)], false);
			B.flush();
			await broker.drain();
			await sleep(120);

			if (mode == 'live')
			{
				B.ui.undo();
				B.flush();
				await broker.drain();
				await sleep(150);
			}
			else if (mode == 'cleanup')
			{
				A.unjoined = true;
				B.ui.undo();
				B.flush();
				await broker.drain();
				broker.liveLog = [];
				A.unjoined = false;
				await B.save(0);
				await broker.drain();
				await sleep(120);
				A.cleanupNow();
				await broker.drain();
				await sleep(150);
			}
			else
			{
				// The revive is delivered TWICE (duplicate delivery is
				// a real network condition and must be idempotent for
				// a re-materializing patch)
				var mark = broker.liveLog.length;
				B.ui.undo();
				B.flush();
				await broker.drain();
				await sleep(120);

				for (var q = mark; q < broker.liveLog.length; q++)
				{
					A.receive(broker.liveLog[q].msg);
				}

				await broker.drain();
				await sleep(150);
			}

			if (findCellAnyPage(A, 'dm_c' + sfx) == null)
			{
				report.fail('delivery-matrix', mode +
					': the revived container never reached client0');

				continue;
			}

			// A redoes its move against the revived container
			A.ui.redo();
			A.flush();
			await broker.drain();
			await sleep(200);

			var shape = findCellAnyPage(A, 'dm_s' + sfx);
			var cont = findCellAnyPage(A, 'dm_c' + sfx);
			var state = (shape == null) ? 'LOST' :
				((cont != null && shape.getParent() == cont) ?
					'inside' : 'outside');
			results.push(mode + '=' + state);

			if (shape == null)
			{
				report.fail('delivery-matrix', mode +
					': the shape was LOST by the redo');
			}

			for (var ci = 0; ci < 2; ci++)
			{
				var n = 0;
				var mm = clients[ci].ui.editor.graph.getModel();

				for (var id in mm.cells)
				{
					if (mm.cells[id].value == 'S' + sfx)
					{
						n++;
					}
				}

				if (n != 1)
				{
					report.fail('delivery-matrix', mode + ': ' +
						clients[ci].name + ' has ' + n +
						' copies of the shape');
				}
			}
		}

		report.log('delivery-matrix: ' + results.join(' '));

		// The delivery path must not change the outcome
		var distinct = {};

		for (var i = 0; i < results.length; i++)
		{
			distinct[results[i].split('=')[1]] = true;
		}

		if (Object.keys(distinct).length > 1)
		{
			report.fail('delivery-matrix', 'the delivery path changed ' +
				'the outcome of the same sequence: ' + results.join(' '));
		}
	};

	// --- hostile-content --------------------------------------------------
	// Labels, user objects, styles and file variables all travel
	// through the collaboration channel and end up being PARSED and
	// RENDERED on every receiver. A malicious collaborator therefore
	// has a path from "sends a message" to "content in my DOM", which
	// is the stored-XSS threat model of the whole app. Also covers XML
	// entity expansion, which the project invariants call out but no
	// test held.
	async function runHostileContent(clients, broker, report, ctx)
	{
		var A = clients[0];
		var B = clients[1];
		A.ui.selectPage(A.ui.pages[0], true);
		B.ui.selectPage(B.ui.pages[0], true);

		A.ui.editor.graph.insertVertex(null, 'hc_v', 'V', 40, 40, 160, 60);
		A.flush();
		await broker.drain();
		await sleep(120);
		await A.save(0);
		await broker.drain();
		await sleep(120);

		var pageId = A.ui.pages[0].getId();

		var cellPatch = function(cellDiff)
		{
			var pages = {};
			pages[pageId] = {cells: {u: {hc_v: cellDiff}}};

			return {u: pages};
		};

		// Quadratic blowup: a bounded parser refuses or ignores it, an
		// unbounded one hangs the tab
		var laughs = '<?xml version="1.0"?><!DOCTYPE root [' +
			'<!ENTITY a "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa">' +
			'<!ENTITY b "&a;&a;&a;&a;&a;&a;&a;&a;&a;&a;">' +
			'<!ENTITY c "&b;&b;&b;&b;&b;&b;&b;&b;&b;&b;">' +
			'<!ENTITY d "&c;&c;&c;&c;&c;&c;&c;&c;&c;&c;">' +
			'<!ENTITY e "&d;&d;&d;&d;&d;&d;&d;&d;&d;&d;">' +
			']><UserObject label="&e;" id="hc_v"><mxCell/></UserObject>';

		// External entity: must never be resolved (no file access, no
		// outbound request)
		var external = '<?xml version="1.0"?><!DOCTYPE root [' +
			'<!ENTITY xxe SYSTEM "http://127.0.0.1:1/xxe-probe">' +
			']><UserObject label="&xxe;" id="hc_v"><mxCell/></UserObject>';

		var attacks = [
			{name: 'entity expansion', patch: cellPatch(
				{xmlValue: laughs})},
			{name: 'external entity', patch: cellPatch(
				{xmlValue: external})},
			{name: 'script in label', patch: cellPatch(
				{value: '<img src=x onerror="window.__xss=1">' +
					'<script>window.__xss=2<\/script>'})},
			{name: 'script in user object label', patch: cellPatch(
				{xmlValue: '<UserObject label="&lt;img src=x ' +
					'onerror=&quot;window.__xss=3&quot;&gt;" id="hc_v">' +
					'<mxCell/></UserObject>'})},
			{name: 'javascript image style', patch: cellPatch(
				{style: 'shape=image;image=javascript:window.__xss=4;'})},
			{name: 'data uri script style', patch: cellPatch(
				{style: 'shape=image;image=data:text/html,' +
					'<script>window.__xss=5<\/script>;'})},
			{name: 'hostile link style', patch: cellPatch(
				{style: 'html=1;link=javascript:window.__xss=6;'})},
			{name: 'proto file attribute', patch: {f:
				(function()
				{
					var f = {};
					f['__proto__'] = 'polluted';
					f['constructor'] = 'polluted';

					return f;
				})()}},
			{name: 'script in file variable', patch: {f: {vars:
				'{"evil":"<img src=x onerror=\\"window.__xss=7\\">"}'}}},
			{name: 'placeholder label using the variable',
				patch: cellPatch({value: '%evil%'})}
		];

		for (var i = 0; i < attacks.length; i++)
		{
			var t0 = new Date().getTime();

			try
			{
				B.sync.doReceiveRemoteChanges([{}, attacks[i].patch]);
			}
			catch (e)
			{
				report.fail('hostile-content', 'client1 threw on "' +
					attacks[i].name + '": ' + e.message);
			}

			// Forces a render pass so the label reaches the DOM
			try
			{
				B.ui.editor.graph.refresh();
			}
			catch (e)
			{
				report.fail('hostile-content', 'render threw on "' +
					attacks[i].name + '": ' + e.message);
			}

			var elapsed = new Date().getTime() - t0;

			if (elapsed > 5000)
			{
				report.fail('hostile-content', '"' + attacks[i].name +
					'" took ' + elapsed + 'ms - unbounded parsing or ' +
					'rendering is a denial of service');
			}

			// The executable-content probes: nothing may have run
			if (B.win.__xss != null)
			{
				report.fail('hostile-content', 'EXECUTED hostile content ' +
					'from "' + attacks[i].name + '" (marker ' +
					B.win.__xss + ')');
				B.win.__xss = null;
			}

			var probe = new B.win.Object();

			if (probe.vars != null || probe.evil != null)
			{
				report.fail('hostile-content', 'prototype polluted by "' +
					attacks[i].name + '"');
			}

			// And nothing executable may sit in the rendered DOM
			var container = B.ui.editor.graph.container;
			var scripts = container.getElementsByTagName('script');

			if (scripts.length > 0)
			{
				report.fail('hostile-content', '"' + attacks[i].name +
					'" put ' + scripts.length + ' script element(s) in ' +
					'the rendered document');
			}

			var all = container.getElementsByTagName('*');

			for (var j = 0; j < all.length; j++)
			{
				var attrs = all[j].attributes;

				for (var k = 0; attrs != null && k < attrs.length; k++)
				{
					var an = attrs[k].name.toLowerCase();
					var av = String(attrs[k].value);

					if (an.substring(0, 2) == 'on')
					{
						report.fail('hostile-content', '"' +
							attacks[i].name + '" left an event handler ' +
							'attribute in the DOM (' + an + ')');
					}

					if ((an == 'href' || an == 'src' ||
						an == 'xlink:href') &&
						av.toLowerCase().indexOf('javascript:') == 0)
					{
						report.fail('hostile-content', '"' +
							attacks[i].name + '" left a javascript: ' +
							an + ' in the DOM');
					}
				}
			}
		}

		// The session survives all of it
		A.ui.editor.graph.insertVertex(null, 'hc_after', 'AFTER',
			40, 200, 80, 40);
		A.flush();
		await broker.drain();
		await sleep(200);

		if (findCellAnyPage(B, 'hc_after') == null)
		{
			report.fail('hostile-content',
				'the session stopped syncing after the hostile content');
		}

		B.cleanupNow();
		await broker.drain();
		await sleep(200);
	};

	// --- remote-grace -----------------------------------------------------
	// Live-delivered content is HELD while its sender still has a
	// chance to save it, instead of being reverted by the next cleanup
	// (measured in production: a collaborator's colours arrived,
	// vanished and came back seconds later). After the grace period it
	// is dropped again, which is what expels content no collaborator
	// ever confirms.
	async function runRemoteGrace(clients, broker, report, ctx)
	{
		var A = clients[0];
		var B = clients[1];
		A.ui.selectPage(A.ui.pages[0], true);
		B.ui.selectPage(B.ui.pages[0], true);

		A.ui.editor.graph.insertVertex(null, 'rg_v', 'RG', 40, 40, 80, 40);
		A.flush();
		await broker.drain();
		await sleep(120);
		await A.save(0);
		await broker.drain();
		await sleep(120);

		// Phase 1: HOLD. A recolours live and does not save.
		B.sync.remoteGraceDelay = 60000;
		var modelA = A.ui.editor.graph.getModel();
		modelA.setStyle(modelA.getCell('rg_v'),
			'rounded=0;whiteSpace=wrap;html=1;fillColor=#ff0000;');
		A.flush();
		await broker.drain();
		await sleep(150);

		var styleB = B.ui.editor.graph.getModel().getCell('rg_v').getStyle();

		if (styleB.indexOf('#ff0000') < 0)
		{
			report.fail('remote-grace-setup',
				'the live style change never reached the peer');

			return;
		}

		// Cleanups during the grace period must NOT revert it
		for (var i = 0; i < 3; i++)
		{
			B.cleanupNow();
			await broker.drain();
			await sleep(150);
		}

		styleB = B.ui.editor.graph.getModel().getCell('rg_v').getStyle();

		if (styleB.indexOf('#ff0000') < 0)
		{
			report.fail('remote-grace', 'the cleanup reverted live ' +
				'content while its sender could still save it (style=' +
				styleB.substring(0, 60) + ')');
		}

		// The sender's save confirms it: it stays, and now for good
		await A.save(0);
		await broker.drain();
		await sleep(200);
		B.cleanupNow();
		await broker.drain();
		await sleep(200);

		styleB = B.ui.editor.graph.getModel().getCell('rg_v').getStyle();

		if (styleB.indexOf('#ff0000') < 0)
		{
			report.fail('remote-grace',
				'confirmed content was lost after the save');
		}

		if (!B.win.mxUtils.isEmptyObject(B.ui.diffPages(
			B.ui.pages, B.file.ownPages)))
		{
			report.fail('remote-grace',
				'client1 ui and own pages differ after the confirming save');
		}

		// Phase 2: DROP. Content that no save ever confirms is expelled
		// once the grace has passed (modelled by expiring it).
		B.sync.doReceiveRemoteChanges([{}, {u: (function()
		{
			var pages = {};
			pages[A.ui.pages[0].getId()] = {cells: {i: [{id: 'rg_ghost',
				vertex: 1, parent: '1', value: 'GHOST',
				geometry: '<mxGeometry x="10" y="200" width="40" ' +
					'height="20"/>'}]}};

			return pages;
		})()}]);
		await sleep(120);

		if (findCellAnyPage(B, 'rg_ghost') == null)
		{
			report.fail('remote-grace-setup',
				'the unconfirmed content was not applied at all');

			return;
		}

		B.sync.remoteGraceDelay = 0;
		B.cleanupNow();
		await broker.drain();
		await sleep(200);

		if (findCellAnyPage(B, 'rg_ghost') != null)
		{
			report.fail('remote-grace', 'content that no save ever ' +
				'confirmed survived the grace period');
		}

		// Phase 3: the window must track the CURRENT unconfirmed
		// content. The timestamp marks the oldest arrival, so a save
		// that brought all of it into the own pages has to end it -
		// otherwise the stamp of the session's FIRST live diff decides
		// the fate of content that arrived seconds ago, which is
		// exactly the came/went/came-back symptom the grace prevents.
		// The cleanup's convergence pass is the only other place that
		// clears the stamp, and continuous traffic never lets one run.
		B.sync.remoteGraceDelay = 60000;

		A.ui.editor.graph.insertVertex(null, 'rg_old', 'OLD',
			200, 40, 60, 30);
		A.flush();
		await broker.drain();
		await sleep(150);
		await A.save(0);
		await broker.drain();
		await sleep(200);

		// Models a session that has been live longer than the grace
		// window without a completed cleanup. With the stamp correctly
		// cleared by the confirming save there is nothing to backdate.
		if (B.sync.unconfirmedRemoteSince != null)
		{
			B.sync.unconfirmedRemoteSince -=
				(B.sync.remoteGraceDelay + 1000);
		}

		A.ui.editor.graph.insertVertex(null, 'rg_fresh', 'FRESH',
			200, 100, 60, 30);
		A.flush();
		await broker.drain();
		await sleep(150);

		if (findCellAnyPage(B, 'rg_fresh') == null)
		{
			report.fail('remote-grace-setup',
				'the fresh live content never reached the peer');

			return;
		}

		B.cleanupNow();
		await broker.drain();
		await sleep(200);

		if (findCellAnyPage(B, 'rg_fresh') == null)
		{
			report.fail('remote-grace', 'a stale timestamp expelled ' +
				'content that arrived seconds ago - the window must ' +
				'track the current unconfirmed content, not the first ' +
				'live diff of the session');
		}

		// Confirms it and returns the scenario to the suite default so
		// the quiescence cleanups behave as everywhere else
		await A.save(0);
		await broker.drain();
		await sleep(200);
		B.sync.remoteGraceDelay = 0;
	};

	// --- transient-revert -------------------------------------------------
	// The documented design note as an assertion: content delivered as
	// a live diff is in the visible and their pages but reaches the own
	// pages only with the next save merge, so a cleanup in that window
	// converges the screen to the own pages and REVERTS it. That is
	// intended (it is the same mechanism that expels injected content),
	// but it must be strictly bounded - the sender's save has to bring
	// it back. Without this test the window could silently become
	// permanence.
	async function runTransientRevert(clients, broker, report, ctx)
	{
		var A = clients[0];
		var B = clients[1];
		A.ui.selectPage(A.ui.pages[0], true);
		B.ui.selectPage(B.ui.pages[0], true);

		A.ui.editor.graph.insertVertex(null, 'tr_base', 'BASE',
			40, 40, 80, 40);
		A.flush();
		await broker.drain();
		await sleep(120);
		await A.save(0);
		await broker.drain();
		await sleep(120);

		// A edits live but does NOT save
		A.ui.editor.graph.insertVertex(null, 'tr_live', 'LIVE',
			40, 140, 80, 40);
		var modelA = A.ui.editor.graph.getModel();
		modelA.setValue(modelA.getCell('tr_base'), 'RENAMED');
		A.flush();
		await broker.drain();
		await sleep(150);

		var got = findCellAnyPage(B, 'tr_live');

		if (got == null)
		{
			report.fail('transient-revert-setup',
				'the live diff never reached the peer');

			return;
		}

		// A cleanup before the save may revert it - by design, since
		// the own pages do not hold it yet
		B.cleanupNow();
		await broker.drain();
		await sleep(200);
		var reverted = findCellAnyPage(B, 'tr_live') == null;
		var baseCell = B.ui.editor.graph.getModel().getCell('tr_base');
		report.log('transient-revert: reverted=' + reverted +
			' base=' + ((baseCell != null) ? baseCell.value : 'null'));

		// The bound: the sender's save must restore it, whether it was
		// reverted or not
		await A.save(0);
		await broker.drain();
		await sleep(200);
		B.cleanupNow();
		await broker.drain();
		await sleep(200);

		var healed = findCellAnyPage(B, 'tr_live');
		var healedBase = B.ui.editor.graph.getModel().getCell('tr_base');

		if (healed == null)
		{
			report.fail('transient-revert', 'the reverted content did ' +
				'NOT come back after the save - the transient window ' +
				'became permanent content loss');
		}

		if (healedBase == null || healedBase.value != 'RENAMED')
		{
			report.fail('transient-revert', 'the reverted label did not ' +
				'come back after the save (value=' +
				((healedBase != null) ? healedBase.value : 'null') + ')');
		}

		// And the peer keeps its own unsaved work through all of it
		B.ui.editor.graph.insertVertex(null, 'tr_own', 'OWN',
			300, 140, 80, 40);
		B.flush();
		await broker.drain();
		await sleep(150);
		B.cleanupNow();
		await broker.drain();
		await sleep(200);

		if (findCellAnyPage(B, 'tr_own') == null)
		{
			report.fail('transient-revert',
				'the cleanup discarded the peers OWN flushed work');
		}
	};

	// --- restore-undo -----------------------------------------------------
	// Undo across a wholesale file replacement: the history spans the
	// restore, so replaying a pre-restore edit runs every repair path
	// at once (the objects it references were replaced by
	// replaceFileData). It must neither resurrect stale objects nor
	// break the session - and the peer must end up with whatever the
	// restorer ends up with.
	async function runRestoreUndo(clients, broker, report, ctx)
	{
		var A = clients[0];
		var B = clients[1];
		A.ui.selectPage(A.ui.pages[0], true);
		B.ui.selectPage(B.ui.pages[0], true);
		var graphA = A.ui.editor.graph;
		var modelA = graphA.getModel();

		graphA.insertVertex(null, 'ru_a', 'RA', 40, 40, 80, 40);
		graphA.insertVertex(null, 'ru_b', 'RB', 200, 40, 80, 40);

		// Two more pages that the restored document keeps; the restorer
		// views the middle one during the restore (see below). Not the
		// last page: the heal of a dangling current page picks the
		// first page left, which in the intermediate states of the
		// replay is the last restored one, so a kept LAST page made the
		// wrong mechanism land on the right page
		var keptPage = A.ui.insertPage();
		A.ui.insertPage();
		A.ui.selectPage(A.ui.pages[0], true);
		A.flush();
		await broker.drain();
		await sleep(120);
		await A.save(0);
		await broker.drain();
		await sleep(120);
		var oldData = A.file.getData();

		// Edits AFTER the snapshot that will be restored
		modelA.setValue(modelA.getCell('ru_a'), 'EDITED');
		A.flush();
		await broker.drain();
		await sleep(120);
		graphA.insertVertex(null, 'ru_c', 'RC', 360, 40, 80, 40);
		A.flush();
		await broker.drain();
		await sleep(120);
		await A.save(0);
		await broker.drain();
		await sleep(120);

		if (typeof A.ui.replaceFileData != 'function')
		{
			report.log('restore-undo: replaceFileData unavailable');

			return;
		}

		var preRestoreXml = A.getCanonicalXml();

		// The restorer views the second page during the restore
		A.ui.selectPage(keptPage, true);
		A.ui.replaceFileData(oldData);

		if (A.file.sync != null)
		{
			A.file.sync.fileRestored();
		}

		A.flush();
		await broker.drain();
		await sleep(200);
		var postRestoreXml = A.getCanonicalXml();

		// The viewed page survives the restore when the restored document
		// holds a page of the same id (the restorer stays where the peers
		// stay), and the undo brings it back selected
		if (A.ui.currentPage == null ||
			A.ui.currentPage.getId() != keptPage.getId())
		{
			report.fail('restore-undo',
				'the restore did not keep the viewed page');
		}

		// The restore is ONE undoable step: one undo brings the
		// pre-restore document back exactly, on the restorer and,
		// through the flush, on the peer; one redo re-applies it. The
		// page replays used to skip the old pages as "already present"
		// (same ids as their restored twins) and then removed the
		// twins - an empty document on every client.
		// Each replay switches the page exactly once: the heal of a
		// dangling current page is drained after the replay, not per
		// replayed page (a full render each, the undo took seconds)
		var switches = 0;
		var countSwitch = function() { switches++; };
		A.ui.editor.addListener('pageSelected', countSwitch);
		A.ui.undo();
		var undoSwitches = switches;
		A.flush();
		await broker.drain();
		await sleep(200);

		if (A.getCanonicalXml() != preRestoreXml)
		{
			report.fail('restore-undo',
				'one undo did not bring the pre-restore document back');
		}

		if (A.ui.currentPage == null ||
			A.ui.currentPage.getId() != keptPage.getId())
		{
			report.fail('restore-undo',
				'the undo of the restore did not reselect the viewed page');
		}

		if (undoSwitches != 1)
		{
			report.fail('restore-undo', 'the undo of the restore switched ' +
				'the page ' + undoSwitches + ' times instead of once');
		}

		if (B.getPagesHash() != A.getPagesHash())
		{
			report.fail('restore-undo',
				'the peer did not follow the undo of the restore');
		}

		switches = 0;
		A.ui.redo();
		var redoSwitches = switches;
		A.ui.editor.removeListener(countSwitch);
		A.flush();
		await broker.drain();
		await sleep(200);

		if (A.getCanonicalXml() != postRestoreXml)
		{
			report.fail('restore-undo',
				'one redo did not re-apply the restore');
		}

		// The redo brings the viewed page back as well: with the base
		// toggle the inert undo step left the select pointing at the
		// old page and the redo ended on the last page
		if (A.ui.currentPage == null ||
			A.ui.currentPage.getId() != keptPage.getId())
		{
			report.fail('restore-undo',
				'the redo of the restore did not reselect the viewed page');
		}

		if (redoSwitches != 1)
		{
			report.fail('restore-undo', 'the redo of the restore switched ' +
				'the page ' + redoSwitches + ' times instead of once');
		}

		if (B.getPagesHash() != A.getPagesHash())
		{
			report.fail('restore-undo',
				'the peer did not follow the redo of the restore');
		}

		// Undo now replays the restore and then edits whose cell
		// objects the restore replaced - the repair paths must resolve
		// them canonically
		for (var i = 0; i < 3; i++)
		{
			if (A.ui.editor.undoManager.canUndo())
			{
				A.ui.undo();
			}
		}

		A.flush();
		await broker.drain();
		await sleep(200);

		// Nothing may exist twice and the session must still work
		var counts = {};

		for (var ci = 0; ci < 2; ci++)
		{
			var m = clients[ci].ui.editor.graph.getModel();
			var seen = {};

			for (var id in m.cells)
			{
				var v = m.cells[id].value;

				if (v == 'RA' || v == 'EDITED' || v == 'RB' || v == 'RC')
				{
					seen[v] = (seen[v] || 0) + 1;

					if (seen[v] > 1)
					{
						report.fail('restore-undo', clients[ci].name +
							' has ' + seen[v] + ' cells labelled "' + v +
							'" after undoing across the restore');
					}
				}
			}

			counts[clients[ci].name] = JSON.stringify(seen);
		}

		report.log('restore-undo: ' + JSON.stringify(counts));

		// Both clients still collaborate afterwards
		A.ui.editor.graph.insertVertex(null, 'ru_after', 'AFTER',
			40, 240, 80, 40);
		A.flush();
		await broker.drain();
		await sleep(200);

		if (findCellAnyPage(B, 'ru_after') == null)
		{
			report.fail('restore-undo',
				'the session stopped syncing after the restore undos');
		}

		await A.save(0);
		await broker.drain();
		await sleep(200);
	};

	// --- adversarial-patch ------------------------------------------------
	// Patches arrive over the collaboration channel, so every field is
	// attacker controlled: any collaborator (or anyone who obtained the
	// channel id) can send arbitrary JSON. The guards exist in the
	// product (prototype-pollution keys, null-prototype maps, defensive
	// parsing) but no test held them. Each hostile patch must leave the
	// receiver alive, unpolluted and still converging with an innocent
	// third client that keeps editing throughout.
	// A page-switch replay resolves against previousPage, which is what
	// indexes the pages array AND becomes the new current page. The
	// repair canonicalized only this.page - a marker - so after a peer
	// deleted the page the replay pointed at a dead object, its index
	// was -1, the whole body was skipped and the viewed page stayed one
	// that had just been spliced out of the document. Everything typed
	// there reaches no flush and no save, and vanishes without a trace
	// when the next incoming patch heals the dangling reference
	async function runPhantomCurrentPage(clients, broker, report)
	{
		var A = clients[0];
		var B = clients[1];
		A.ui.selectPage(A.ui.pages[0], true);
		B.ui.selectPage(B.ui.pages[0], true);

		// Base: a saved second page both clients know
		A.ui.editor.graph.insertVertex(null, 'pc_base', 'BASE',
			40, 40, 80, 40);
		A.flush();
		await broker.drain();
		await sleep(120);
		await A.save(0);
		await broker.drain();
		await sleep(150);

		var p1 = A.ui.pages[0].getId();

		// A inserts P2 through the production path: the ChangePage
		// records a SelectPage whose target is the new page, so after
		// execute previousPage is P1
		A.ui.insertPage();
		var p2 = A.ui.pages[A.ui.pages.length - 1].getId();
		A.flush();
		await broker.drain();
		await sleep(150);

		// The peer deletes P1, which A applies as a patch - A stays on
		// P2 while the object its history points back to is gone
		var idxB = -1;

		for (var i = 0; i < B.ui.pages.length; i++)
		{
			if (B.ui.pages[i].getId() == p1)
			{
				idxB = i;
			}
		}

		if (idxB < 0)
		{
			report.fail('phantom-current-page', 'setup: the peer does not ' +
				'have the base page');

			return;
		}

		B.ui.selectPage(B.ui.pages[(idxB == 0) ? 1 : 0], true);
		B.ui.removePage(B.ui.pages[idxB]);
		B.flush();
		await broker.drain();
		await sleep(150);

		// The undo replays the page insert backwards: the ChangePage
		// splices P2 out and the SelectPage that follows must not leave
		// the client viewing it
		A.ui.undo();
		await sleep(150);

		var ids = [];

		for (var i = 0; i < A.ui.pages.length; i++)
		{
			ids.push(A.ui.pages[i].getId());
		}

		if (A.ui.currentPage == null || ids.indexOf(
			A.ui.currentPage.getId()) < 0)
		{
			report.fail('phantom-current-page', 'after the undo the viewed ' +
				'page is ' + ((A.ui.currentPage != null) ?
				A.ui.currentPage.getId() : 'null') + ', which is not in [' +
				ids.join(',') + ']');
		}

		// The decisive consequence: work done after the replay must
		// still reach the peer and the file
		A.ui.editor.graph.insertVertex(null, 'pc_edit', 'EDIT',
			40, 200, 80, 40);
		A.flush();
		await broker.drain();
		await sleep(150);
		await A.save(0);
		await broker.drain();
		await sleep(200);

		if (findCellAnyPage(A, 'pc_edit') == null)
		{
			report.fail('phantom-current-page', 'the edit made after the ' +
				'replay is gone from its own client');
		}

		if (findCellAnyPage(B, 'pc_edit') == null)
		{
			report.fail('phantom-current-page', 'the edit made after the ' +
				'replay never reached the peer - it was typed onto a page ' +
				'that is in no diff');
		}

		if ((broker.lastSavedData || '').indexOf('pc_edit') < 0)
		{
			report.fail('phantom-current-page', 'the edit made after the ' +
				'replay never reached the file');
		}
	};

	// Totality of the live receive path AND the liveness of the receive
	// channel behind it. adversarial-patch calls doReceiveRemoteChanges
	// directly inside its own try/catch, so it can neither see an
	// exception escaping the batch timer nor the latch it leaves set.
	// A malformed but decodable diff used to throw out of that timer,
	// so receivedData was never cleared and EVERY later live message
	// queued into an array nothing drains - the victim stopped
	// receiving for the rest of the session while still broadcasting.
	async function runPoisonLiveDiff(clients, broker, report, ctx)
	{
		var A = clients[0];
		var B = clients[1];
		var C = clients[2];
		A.ui.selectPage(A.ui.pages[0], true);
		B.ui.selectPage(B.ui.pages[0], true);
		C.ui.selectPage(C.ui.pages[0], true);

		A.ui.editor.graph.insertVertex(null, 'pp_base', 'BASE',
			40, 40, 80, 40);
		A.flush();
		await broker.drain();
		await sleep(120);
		await A.save(0);
		await broker.drain();
		await sleep(150);

		var pageId = A.ui.pages[0].getId();
		var counter = 0;

		// Delivers through the PRODUCTION entry with no scenario-side
		// try/catch: changeListener decodes the envelope in B's realm
		// and the batch runs on its own timer, exactly like a real
		// message
		var poison = function(changes)
		{
			counter++;
			var msg = A.sync.createMessage({a: 'change', c: changes,
				id: 'poison.' + counter, t: 1});
			B.sync.changeListener(A.sync.objectToString(msg));
		};

		var poisons = [
			{name: 'null page update entry', changes: [{u: (function()
			{
				var pages = Object.create(null);
				pages[pageId] = null;

				return pages;
			})()}]},
			{name: 'null cell update entry', changes: [{u: (function()
			{
				var pages = Object.create(null);
				pages[pageId] = {cells: {u: {pp_base: null}}};

				return pages;
			})()}]},
			{name: 'primitive cell update entry', changes: [{u: (function()
			{
				var pages = Object.create(null);
				pages[pageId] = {cells: {u: {pp_base: 'gone'}}};

				return pages;
			})()}]},
			{name: 'primitive page update entry', changes: [{u: (function()
			{
				var pages = Object.create(null);
				pages[pageId] = 7;

				return pages;
			})()}]},
			{name: 'update map as a string', changes: [{u: 'not-a-map'}]},
			{name: 'cell update map as an array', changes: [{u: (function()
			{
				var pages = Object.create(null);
				pages[pageId] = {cells: {u: ['x', 'y']}};

				return pages;
			})()}]},
			// The top-level list itself: walked index by index by
			// ignorePatches and applyPatches, a huge length spins the
			// receiver inside the socket handler without any exception
			{name: 'changes as an object with a huge length',
				changes: {length: 1e15}},
			{name: 'changes as a string', changes: 'not-a-list'}
		];

		for (var i = 0; i < poisons.length; i++)
		{
			poison(poisons[i].changes);
			await sleep(120);

			// The channel must be DRAINED: a set latch means the batch
			// threw and nothing will ever be applied again
			if (B.sync.receivedData != null)
			{
				report.fail('poison-live-diff', '"' + poisons[i].name +
					'" left the receive latch set - the client stops ' +
					'applying every later live message');
			}

			// And the channel must still carry legitimate traffic
			var probe = 'pp_ok' + i;
			A.ui.editor.graph.insertVertex(null, probe, 'OK',
				40, 100 + i * 30, 60, 20);
			A.flush();
			await broker.drain();
			await sleep(150);

			if (findCellAnyPage(B, probe) == null)
			{
				report.fail('poison-live-diff', '"' + poisons[i].name +
					'" killed the live channel: the next legitimate ' +
					'diff never arrived');

				return;
			}

			if (findCellAnyPage(B, 'pp_base') == null)
			{
				report.fail('poison-live-diff', '"' + poisons[i].name +
					'" dropped a saved cell from the document');
			}
		}

		// The innocent third client must be untouched and everyone
		// converges through the normal cycle
		await A.save(0);
		await broker.drain();
		await sleep(150);

		for (var i = 0; i < clients.length; i++)
		{
			if (!clients[i].file.isModified())
			{
				clients[i].cleanupNow();
			}
		}

		await sleep(200);

		for (var i = 0; i < poisons.length; i++)
		{
			if (findCellAnyPage(C, 'pp_ok' + i) == null)
			{
				report.fail('poison-live-diff', 'innocent client lost ' +
					'pp_ok' + i);
			}
		}
	};

	// The bounded lifetime of injected content, attacked through the
	// EDGE REPAIR. An unrenderable edge (no terminal, no point) is
	// repaired so it stays drawable, and that repair used to be a
	// first-class local change: the flush ran it through the
	// cross-reference resolution, which pulls the edge AND its
	// ancestors into the own pages, and the next save persisted them.
	// Injected content would then outlive every cleanup - the property
	// adversarial-patch asserts is what keeps a hostile patch harmless.
	async function runRepairAdoption(clients, broker, report)
	{
		var A = clients[0];
		var B = clients[1];
		A.ui.selectPage(A.ui.pages[0], true);
		B.ui.selectPage(B.ui.pages[0], true);

		A.ui.editor.graph.insertVertex(null, 'ra_base', 'BASE',
			40, 40, 80, 40);
		A.flush();
		await broker.drain();
		await sleep(150);
		await A.save(0);
		await broker.drain();
		await sleep(150);

		// A SECOND page, and the victim keeps viewing the first one.
		// DrawioFile.patch only repairs the CURRENT page, so the
		// injected edge below is reached exclusively by the repair
		// inside the flush - the path that used to have no gate at all
		A.ui.insertPage();
		var otherId = A.ui.pages[A.ui.pages.length - 1].getId();
		A.ui.selectPage(A.ui.pages[0], true);
		A.flush();
		await broker.drain();
		await sleep(150);
		await A.save(0);
		await broker.drain();
		await sleep(150);

		var pageId = otherId;

		// A hostile vertex plus an edge under it with a geometry but
		// neither terminals nor terminal points: unrenderable, so the
		// repair fires on the receiver
		B.sync.doReceiveRemoteChanges([{}, {u: (function()
		{
			var pages = Object.create(null);
			pages[pageId] = {cells: {i: [
				{id: 'ra_evil', vertex: 1, parent: '1', value: 'EVIL',
					geometry: '<mxGeometry x="500" y="500" ' +
						'width="80" height="40"/>'},
				{id: 'ra_edge', edge: 1, parent: 'ra_evil',
					geometry: '<mxGeometry relative="1"/>'}]}};

			return pages;
		})()}]);
		await sleep(150);

		if (findCellAnyPage(B, 'ra_edge') == null)
		{
			report.fail('repair-adoption',
				'setup: the injected edge was not applied at all');

			return;
		}

		// Any ordinary local edit marks the page dirty and flushes,
		// which is where the second, formerly ungated repair sits
		B.ui.editor.graph.insertVertex(null, 'ra_own', 'OWN',
			40, 200, 80, 40);
		// Unknown change source: every page is treated as dirty, which
		// is what brings the injected page into the flush sanitizer
		B.sync.dirtyPageIds = null;
		B.flush();
		await broker.drain();
		await sleep(150);
		await B.save(0);
		await broker.drain();
		await sleep(200);

		// The victim's own work must be saved, the injected content
		// must NOT have become part of the file
		var saved = broker.lastSavedData || '';

		if (saved.indexOf('ra_own') < 0)
		{
			report.fail('repair-adoption',
				'setup: the own edit of the victim never reached the file');
		}

		if (saved.indexOf('ra_evil') >= 0 || saved.indexOf('ra_edge') >= 0)
		{
			report.fail('repair-adoption', 'the edge repair adopted ' +
				'unconfirmed remote content into the own pages and the ' +
				'save persisted it - injected content must expire with ' +
				'the next cleanup');
		}

		// And the cleanup must still be able to expel it
		B.cleanupNow();
		await broker.drain();
		await sleep(200);

		if (findCellAnyPage(B, 'ra_edge') != null)
		{
			report.fail('repair-adoption', 'the cleanup could not expel ' +
				'the injected content any more');
		}

		if (findCellAnyPage(B, 'ra_own') == null)
		{
			report.fail('repair-adoption',
				'the cleanup removed the own work of the victim');
		}
	};

	async function runAdversarialPatch(clients, broker, report, ctx)
	{
		var A = clients[0];
		var B = clients[1];
		var C = clients[2];
		A.ui.selectPage(A.ui.pages[0], true);
		B.ui.selectPage(B.ui.pages[0], true);
		C.ui.selectPage(C.ui.pages[0], true);

		A.ui.editor.graph.insertVertex(null, 'ap_base', 'BASE',
			40, 40, 80, 40);
		A.flush();
		await broker.drain();
		await sleep(120);
		await A.save(0);
		await broker.drain();
		await sleep(120);

		var pageId = A.ui.pages[0].getId();

		// Every entry is delivered to B as a live diff exactly like a
		// well-formed one - the transport does not validate
		var attacks = [
			{name: 'proto key in cell map', patch: {u: (function()
			{
				var cells = {u: {}};
				cells.u['__proto__'] = {value: 'POLLUTED',
					style: 'polluted'};
				var pages = {};
				pages[pageId] = {cells: cells};

				return pages;
			})()}},
			{name: 'proto page id', patch: {u: (function()
			{
				var pages = {};
				pages['__proto__'] = {cells: {u: {}}};

				return pages;
			})()}},
			{name: 'constructor cell id', patch: {u: (function()
			{
				var pages = {};
				pages[pageId] = {cells: {u: {constructor:
					{value: 'X'}, prototype: {value: 'Y'}}}};

				return pages;
			})()}},
			{name: 'insert with proto id', patch: {u: (function()
			{
				var pages = {};
				pages[pageId] = {cells: {i: [{id: '__proto__',
					vertex: 1, parent: '1', value: 'P',
					geometry: '<mxGeometry x="0" y="0" width="10" ' +
						'height="10"/>'}]}};

				return pages;
			})()}},
			{name: 'duplicate ids in one patch', patch: {u: (function()
			{
				var pages = {};
				pages[pageId] = {cells: {i: [
					{id: 'ap_dup', vertex: 1, parent: '1', value: 'D1'},
					{id: 'ap_dup', vertex: 1, parent: '1', value: 'D2'}]}};

				return pages;
			})()}},
			{name: 'broken previous chain', patch: {u: (function()
			{
				var pages = {};
				pages[pageId] = {cells: {i: [{id: 'ap_orphan', vertex: 1,
					parent: 'does-not-exist', previous: 'also-missing',
					value: 'O'}]}};

				return pages;
			})()}},
			{name: 'self-parenting cell', patch: {u: (function()
			{
				var pages = {};
				pages[pageId] = {cells: {u: {ap_base:
					{parent: 'ap_base'}}}};

				return pages;
			})()}},
			{name: 'remove of root and layer', patch: {u: (function()
			{
				var pages = {};
				pages[pageId] = {cells: {r: ['0', '1']}};

				return pages;
			})()}},
			{name: 'garbage geometry and style', patch: {u: (function()
			{
				var pages = {};
				pages[pageId] = {cells: {u: {ap_base: {
					geometry: '<not-xml', style: 'x'.repeat(20000)}}}};

				return pages;
			})()}},
			{name: 'wrong types', patch: {u: (function()
			{
				var pages = {};
				pages[pageId] = {cells: {i: 'not-an-array',
					u: {ap_base: {value: {nested: true}}}, r: {}}};

				return pages;
			})()}},
			{name: 'page node garbage', patch: {u: (function()
			{
				var pages = {};
				pages[pageId] = {name: {}, view: 'nope',
					cells: {u: {}}};

				return pages;
			})()}},
			// Type confusion on the remaining cell fields: every one of
			// them is read by code that assumes a specific type
			{name: 'geometry as object', patch: {u: (function()
			{
				var pages = {};
				pages[pageId] = {cells: {u: {ap_base:
					{geometry: {x: 1, y: 2}}}}};

				return pages;
			})()}},
			{name: 'style and id as numbers', patch: {u: (function()
			{
				var pages = {};
				pages[pageId] = {cells: {u: {ap_base: {style: 42}},
					i: [{id: 7, vertex: 1, parent: 1, value: 5}]}};

				return pages;
			})()}},
			{name: 'previous and parent as objects',
				patch: {u: (function()
			{
				var pages = {};
				pages[pageId] = {cells: {i: [{id: 'ap_weird', vertex: 1,
					parent: {evil: true}, previous: [1, 2],
					value: 'W'}]}};

				return pages;
			})()}},
			{name: 'view state garbage', patch: {u: (function()
			{
				var pages = {};
				pages[pageId] = {view: {background: {}, pageFormat: 'x',
					extFonts: 'not-an-array', mathEnabled: 'yes'},
					cells: {u: {}}};

				return pages;
			})()}},
			{name: 'terminals as objects', patch: {u: (function()
			{
				var pages = {};
				pages[pageId] = {cells: {u: {ap_base:
					{source: {}, target: []}}}};

				return pages;
			})()}},
			// A page insert whose body is not readable: the parse, the
			// diagram decompression (atob) and updatePageRoot all throw
			// from the middle of the patch, which leaves the pages half
			// applied
			{name: 'page insert with unparsable data',
				patch: {i: [{id: 'ap_bad', previous: '',
					data: '<<<not xml'}]}},
			{name: 'page insert with undecodable diagram',
				patch: {i: [{id: 'ap_bad2', previous: '',
					data: '<diagram id="ap_bad2">%%not-base64%%</diagram>'}]}},
			// The entry announces one id and the payload carries
			// another: the announced id was already excluded from the
			// implicit page order as a collision, so honoring the
			// payload would silently drop THAT page
			{name: 'page insert id mismatch', patch: {i: [(function()
			{
				return {id: pageId, previous: '',
					data: '<diagram id="ap_decoy" name="Decoy">' +
						'<mxGraphModel><root><mxCell id="0"/>' +
						'<mxCell id="1" parent="0"/></root>' +
						'</mxGraphModel></diagram>'};
			})()]}},
			// An insert without an id reaches cellAdded with an
			// undefined id, which MINTS one - and every model copy mints
			// a different one
			// Geometry and user object on the INSERT path are typed
			// like on the update path: parseXml dereferences a
			// non-string and throws from the middle of the patch
			{name: 'insert with typed geometry and xmlValue',
				patch: {u: (function()
			{
				var pages = Object.create(null);
				pages[pageId] = {cells: {i: [{id: 'ap_typed', vertex: 1,
					parent: '1', geometry: {x: 1, y: 2},
					xmlValue: {evil: true}}]}};

				return pages;
			})()}},
			{name: 'insert with an object value', patch: {u: (function()
			{
				var pages = Object.create(null);
				pages[pageId] = {cells: {i: [{id: 'ap_objval', vertex: 1,
					parent: '1', value: {nested: true},
					geometry: '<mxGeometry x="0" y="0" width="10" ' +
						'height="10"/>'}]}};

				return pages;
			})()}},
			{name: 'cell insert without an id', patch: {u: (function()
			{
				var pages = {};
				pages[pageId] = {cells: {i: [{vertex: 1, parent: '1',
					value: 'NOID', geometry: '<mxGeometry x="0" y="0" ' +
						'width="10" height="10"/>'}]}};

				return pages;
			})()}},
			// The custom-property catch-all copied any unknown key onto
			// the live cell: a prototype method name shadowed the method
			// and every later encode, diff and flush of the session threw
			{name: 'root insert without children', patch: {u: (function()
			{
				// A legitimate root change brings its layers as further
				// insert entries; this one does not, so the receiver
				// must keep its previous root and layer (the swap
				// happens before the walk and is rolled back after it)
				var pages = {};
				pages[pageId] = {cells: {i: [{id: 'ap_root', vertex: 1,
					geometry: '<mxGeometry x="0" y="0" width="10" height="10"/>'}]}};

				return pages;
			})()}},
			{name: 'prototype method names as properties', patch: {u: (function()
			{
				var pages = {};
				pages[pageId] = {cells: {u: {ap_base: {getId: 1, clone: 'x',
					getChildCount: {}, toString: 'y'}}}};

				return pages;
			})()}}
		];

		for (var i = 0; i < attacks.length; i++)
		{
			var before = B.ui.pages.length;

			try
			{
				// Straight into the live receive path, bypassing only
				// the transport (the wire cannot validate this either)
				B.sync.doReceiveRemoteChanges([{}, attacks[i].patch]);
			}
			catch (e)
			{
				report.fail('adversarial-patch', 'client1 threw on "' +
					attacks[i].name + '": ' + e.message);
			}

			// Prototype pollution is checked on fresh objects in the
			// RECEIVER realm - a polluted Object.prototype leaks there
			var probe = new B.win.Object();

			if (probe.value != null || probe.style != null ||
				probe.cells != null)
			{
				report.fail('adversarial-patch', 'client1 Object ' +
					'prototype polluted by "' + attacks[i].name +
					'" (value=' + probe.value + ' style=' + probe.style +
					' cells=' + probe.cells + ')');
			}

			if (B.ui.pages.length < 1)
			{
				report.fail('adversarial-patch', 'client1 lost all pages ' +
					'on "' + attacks[i].name + '" (had ' + before + ')');
			}

			if (B.ui.editor.graph.getModel().getRoot() == null)
			{
				report.fail('adversarial-patch', 'client1 model root gone ' +
					'after "' + attacks[i].name + '"');
			}
			else if (B.ui.editor.graph.getModel().getChildCount(
				B.ui.editor.graph.getModel().getRoot()) == 0)
			{
				report.fail('adversarial-patch', 'client1 left without a ' +
					'layer after "' + attacks[i].name + '"');
			}

			// The innocent client keeps working after every attack
			var probeId = 'ap_ok' + i;
			C.ui.editor.graph.insertVertex(null, probeId, 'OK' + i,
				40, 200 + i * 30, 60, 20);
			C.flush();
			await broker.drain();
			await sleep(120);

			if (findCellAnyPage(A, probeId) == null)
			{
				report.fail('adversarial-patch', 'the innocent clients ' +
					'stopped syncing after "' + attacks[i].name + '"');
			}

			// Tracks the shared cell: in the map, in the tree, parent
			var mb = B.ui.editor.graph.getModel();
			var base = mb.cells['ap_base'];
			var inTree = false;
			var walker = base;
			var guard = 0;

			while (walker != null && guard++ < 20)
			{
				if (walker == mb.getRoot())
				{
					inTree = true;
					break;
				}

				walker = walker.getParent();
			}

			report.log('ap[' + attacks[i].name + '] base=' +
				(base != null) + ' inTree=' + inTree + ' parent=' +
				((base != null && base.getParent() != null) ?
					base.getParent().getId() : 'null'));

			// A remote entry must never shadow a method on the live cell
			if (base != null && (typeof base.getId != 'function' ||
				typeof base.clone != 'function' ||
				typeof base.getChildCount != 'function' ||
				typeof base.toString != 'function'))
			{
				report.fail('adversarial-patch', 'client1 cell methods ' +
					'shadowed by "' + attacks[i].name + '"');
			}
		}

		// SELF-HEALING: content that reached only this client and was
		// never saved lives in its visible pages but never in its own
		// pages, so the cleanup - which converges the screen to the
		// own pages - must remove it again. Injected content therefore
		// has a bounded lifetime by construction, and the client
		// returns to the shared state without a reload.
		B.cleanupNow();
		await broker.drain();
		await sleep(200);
		B.cleanupNow();
		await broker.drain();
		await sleep(200);

		var injected = ['ap_dup', 'ap_orphan'];

		for (var i = 0; i < injected.length; i++)
		{
			if (findCellAnyPage(B, injected[i]) != null)
			{
				report.fail('adversarial-patch', 'injected cell ' +
					injected[i] + ' survived the cleanup on client1 - ' +
					'unsaved foreign content must not persist');
			}
		}

		var healed = B.ui.editor.graph.getModel().getCell('ap_base');

		if (healed == null || healed.value != 'BASE')
		{
			report.fail('adversarial-patch', 'the hostile update to the ' +
				'shared cell survived the cleanup on client1 (value=' +
				((healed != null) ? healed.value : 'null') + ')');
		}

		// B must still be a functioning collaborator: it edits, the
		// others receive, and a save round leaves everyone converged
		B.ui.editor.graph.insertVertex(null, 'ap_after', 'AFTER',
			300, 40, 80, 40);
		B.flush();
		await broker.drain();
		await sleep(200);

		if (findCellAnyPage(A, 'ap_after') == null ||
			findCellAnyPage(C, 'ap_after') == null)
		{
			report.fail('adversarial-patch',
				'client1 could not contribute after the hostile patches');
		}

		await B.save(0);
		await broker.drain();
		await sleep(200);
	};

	// --- solo-resend ------------------------------------------------------
	// While no peer is connected the transport skips outgoing diffs (no
	// consumer). A client joining right after such a skip never learns
	// about those changes: the diff is gone and only the next save
	// would carry it - which is why two clients loading at the same
	// time can end up with different documents ("skipped message while
	// alone" with peers actually present, the roster of a simultaneous
	// join is confirmed before the other client registers). The first
	// peer in the roster must therefore trigger a resend of everything
	// no save has confirmed yet.
	async function runSoloResend(clients, broker, report, ctx)
	{
		var A = clients[0];
		var B = clients[1];
		A.ui.selectPage(A.ui.pages[0], true);
		B.ui.selectPage(B.ui.pages[0], true);

		// Confirmed base
		var graphA = A.ui.editor.graph;
		graphA.insertVertex(null, 'sr_v1', 'BASE', 40, 40, 120, 40);
		A.flush();
		await broker.drain();
		await sleep(120);
		await A.save(0);
		await broker.drain();
		await sleep(120);

		// B leaves the channel: A is alone and the gate drops its
		// outgoing diffs (modelled by the broker skipping unjoined
		// clients)
		B.unjoined = true;

		graphA.insertVertex(null, 'sr_v2', 'ALONE', 40, 140, 120, 40);
		A.ui.editor.graph.getModel().setValue(
			A.ui.editor.graph.getModel().getCell('sr_v1'), 'RENAMED');
		A.flush();
		await broker.drain();
		await sleep(120);

		// The live diffs are ephemeral: nothing survives for the joiner
		broker.liveLog = [];
		B.unjoined = false;

		if (findCellAnyPage(B, 'sr_v2') != null)
		{
			report.fail('solo-resend-setup',
				'client1 saw the diff it was supposed to miss');

			return;
		}

		// The first peer in the roster: A has to resend what no save
		// has confirmed. NO save happens in this scenario on purpose.
		A.sync.sendUnconfirmedChanges();
		await broker.drain();
		await sleep(200);

		var joined = findCellAnyPage(B, 'sr_v2');
		var renamed = findCellAnyPage(B, 'sr_v1');

		if (joined == null)
		{
			report.fail('solo-resend',
				'client1 never received the shape added while alone');
		}

		if (renamed == null || renamed.value != 'RENAMED')
		{
			report.fail('solo-resend',
				'client1 never received the label changed while alone ' +
				'(value=' + ((renamed != null) ? renamed.value : 'null') +
				')');
		}

		// And the resend must not disturb the sender
		if (findCellAnyPage(A, 'sr_v2') == null)
		{
			report.fail('solo-resend',
				'the resend damaged the senders own state');
		}
	};

	// --- join-visibility --------------------------------------------------
	// A change broadcast WHILE a client is still loading never reaches it
	// live: the joiner subscribes afterwards and the live diff is
	// ephemeral. The content then arrives with the next save - but a save
	// merge only reaches the own pages, so the screen stayed blind until
	// the lazy cleanup fired (manual find: 15s of a stale label right
	// after opening a file someone else is editing, and the merge gate
	// asks whether the client is connected NOW, not whether it was
	// connected WHEN the diff was sent).
	async function runJoinVisibility(clients, broker, report, ctx)
	{
		var A = clients[0];
		var B = clients[1];
		A.ui.selectPage(A.ui.pages[0], true);
		B.ui.selectPage(B.ui.pages[0], true);

		// Confirmed base both clients share
		var graphA = A.ui.editor.graph;
		var modelA = graphA.getModel();
		graphA.insertVertex(null, 'jv_v1', 'BEFORE', 40, 40, 120, 40);
		A.flush();
		await broker.drain();
		await sleep(120);
		await A.save(0);
		await broker.drain();
		await sleep(120);

		if (findCellAnyPage(B, 'jv_v1') == null)
		{
			report.fail('join-visibility-setup',
				'base did not reach client1');

			return;
		}

		// B leaves the channel like a client that is still loading
		B.unjoined = true;

		// A relabels and flushes: the live diff cannot reach B
		modelA.setValue(modelA.getCell('jv_v1'), 'AFTER');
		A.flush();
		await broker.drain();
		await sleep(120);

		// The live diff is ephemeral - it is gone by the time B is in
		// the channel (the production cache serves saves, not live
		// diffs sent before the subscription)
		broker.liveLog = [];
		B.unjoined = false;

		if (B.ui.editor.graph.getModel().getCell('jv_v1').value != 'BEFORE')
		{
			report.fail('join-visibility-setup',
				'client1 saw the live diff it was supposed to miss');

			return;
		}

		// A saves: the merge is the FIRST time the content reaches B
		await A.save(0);
		await broker.drain();
		await sleep(300);

		// No cleanupNow() here on purpose: the screen must be current
		// without the scenario driving the cleanup, ie. the merge has
		// to reconcile it immediately instead of waiting for the lazy
		// cleanup delay (an hour in this harness, 15s in production)
		var visible = B.ui.editor.graph.getModel().getCell('jv_v1');

		if (visible == null || visible.value != 'AFTER')
		{
			report.fail('join-visibility', 'client1 still shows "' +
				((visible != null) ? visible.value : 'null') +
				'" after the merge - the joiner stays blind until the ' +
				'lazy cleanup');
		}

		// And the own pages agree, so the next flush sends nothing
		if (!B.win.mxUtils.isEmptyObject(B.ui.diffPages(
			B.ui.pages, B.file.ownPages)))
		{
			report.fail('join-visibility',
				'client1 ui and own pages differ after the merge');
		}

		// The immediate-cleanup latch must not outlive a cleanup that
		// ran directly (synchronizeFile and resetRealtime call cleanup()
		// themselves): a stranded latch makes every later lazy request
		// return early and the client stops reconciling until the next
		// immediate one
		B.sync.scheduleCleanup(false);
		B.sync.cleanup();
		B.sync.scheduleCleanup();

		if (B.sync.cleanupThread == null)
		{
			report.fail('join-visibility', 'a direct cleanup stranded the ' +
				'immediate latch: the next lazy request scheduled nothing');
		}

		B.win.clearTimeout(B.sync.cleanupThread);
		B.sync.cleanupThread = null;
		B.sync.cleanupImmediatePending = false;
	};

	// --- perf-gate --------------------------------------------------------
	// Order-of-magnitude guard for the sync hot paths on a 900-cell
	// page: diff, patch, checksum, undo/redo of the bulk edit and the
	// full flush->deliver->apply pipeline. Budgets are ~10x a slow
	// laptop so only complexity regressions (accidental O(n^2)) trip
	// them, never machine variance.
	async function runPerfGate(clients, broker, report, ctx)
	{
		var A = clients[0];
		var B = clients[1];
		A.ui.selectPage(A.ui.pages[0], true);
		B.ui.selectPage(B.ui.pages[0], true);
		var graphA = A.ui.editor.graph;
		var modelA = graphA.getModel();

		var base = A.ui.clonePages(A.ui.pages);
		var t0 = performance.now();
		modelA.beginUpdate();

		try
		{
			var prev = null;

			for (var i = 0; i < 600; i++)
			{
				var v = graphA.insertVertex(null, 'pg_v' + i, 'N' + i,
					(i % 30) * 60, Math.floor(i / 30) * 60, 40, 24);

				if (i % 2 == 1)
				{
					graphA.insertEdge(null, 'pg_e' + i, '', prev, v);
				}

				prev = v;
			}
		}
		finally
		{
			modelA.endUpdate();
		}

		var buildMs = performance.now() - t0;

		// Undo/redo of the 900-cell composite edit
		t0 = performance.now();
		A.ui.undo();
		A.ui.redo();
		var undoMs = performance.now() - t0;

		// Undo/redo of a delete of the whole page: the replay repair must
		// validate the view ONCE per replay, not once per severed edge
		// (measured before the batching: 13s for 1000 cells)
		graphA.selectAll();
		A.ui.actions.get('delete').funct();
		t0 = performance.now();
		A.ui.undo();
		A.ui.redo();
		A.ui.undo();
		var deleteUndoMs = performance.now() - t0;

		var big = A.ui.pages;
		t0 = performance.now();
		var diff = null;

		for (var n = 0; n < 10; n++)
		{
			diff = A.ui.diffPages(base, big);
		}

		var diffMs = performance.now() - t0;
		t0 = performance.now();

		for (var n = 0; n < 10; n++)
		{
			A.ui.patchPages(A.ui.clonePages(base), diff);
		}

		var patchMs = performance.now() - t0;
		t0 = performance.now();

		for (var n = 0; n < 10; n++)
		{
			A.ui.getHashValueForPages(big);
		}

		var hashMs = performance.now() - t0;

		// End-to-end: one flush carries the whole page to B
		t0 = performance.now();
		A.flush();
		await broker.drain();
		await sleep(60);
		var e2eMs = performance.now() - t0;

		// Correctness at scale before the budgets
		var cellsB = Object.keys(
			B.ui.editor.graph.getModel().cells).length;

		if (cellsB < 900)
		{
			report.fail('perf-gate',
				'large page did not arrive: ' + cellsB + ' cells');
		}

		report.stats.perf = {build: Math.round(buildMs),
			undoRedo: Math.round(undoMs),
			deleteUndo: Math.round(deleteUndoMs), diff10: Math.round(diffMs),
			patch10: Math.round(patchMs), hash10: Math.round(hashMs),
			e2e: Math.round(e2eMs)};
		report.log('perf ' + JSON.stringify(report.stats.perf));

		var budgets = {diff10: [diffMs, 5000], patch10: [patchMs, 6000],
			hash10: [hashMs, 3000], undoRedo: [undoMs, 4000],
			deleteUndo: [deleteUndoMs, 4000], e2e: [e2eMs, 10000]};

		for (var key in budgets)
		{
			if (budgets[key][0] > budgets[key][1])
			{
				report.fail('perf-gate', key + ' took ' +
					Math.round(budgets[key][0]) + 'ms (budget ' +
					budgets[key][1] + 'ms)');
			}
		}
	};

	// --- contradicting-ops ------------------------------------------------
	// Concurrent, CONTRADICTING operations on the same cells from two
	// active clients while a third one only watches (it acts in the
	// three-way case): grouping, connecting, deleting and adding cross on
	// the live channel (both diffs are computed before either is
	// received). The histories are then replayed against each other in
	// every way the product allows: the crossing undone and redone as a
	// crossing, a follow-up edit per author on the contested cells, the
	// replays stepped one client at a time with every step delivered
	// before the next (each replay lands on the peers as a remote change
	// and the next replay resolves against it), and finally everything
	// undone and redone crossing again. Every phase settles through the
	// production choreography (flush, serialized saves, cleanup) and
	// asserts convergence, singleness and renderable edges on its own, so
	// a divergence is attributed to the phase that caused it. Two passes:
	// crossing only, and with a save racing every delivery (the seed
	// picks the saver, so revives and reparents arrive through the save
	// path as well as live). Under the -net preset the seed also varies
	// jitter, cross-sender reorder and duplicate delivery.
	async function runContradictingOps(clients, broker, report, ctx)
	{
		var A = clients[0];
		var B = clients[1];
		var C = clients[2];

		for (var i = 0; i < clients.length; i++)
		{
			clients[i].ui.selectPage(clients[i].ui.pages[0], true);
		}

		var summary = [];
		var raceSave = false;

		var g = function(client)
		{
			return client.ui.editor.graph;
		};

		var m = function(client)
		{
			return client.ui.editor.graph.getModel();
		};

		var firstDiff = function()
		{
			var base = clients[0].getCanonicalXml();

			for (var i = 1; i < clients.length; i++)
			{
				var other = clients[i].getCanonicalXml();

				if (other != base)
				{
					var at = 0;

					while (at < base.length && at < other.length &&
						base.charAt(at) == other.charAt(at))
					{
						at++;
					}

					return ' (' + clients[i].name + ' differs from ' +
						clients[0].name + ' at ' + at + ': ...' +
						base.substring(Math.max(0, at - 60), at + 120) +
						'... vs ...' + other.substring(
							Math.max(0, at - 60), at + 120) + '...)';
				}
			}

			return '';
		};

		// The quiescence choreography of the orchestrator, per phase:
		// flush everything, let the modified clients save one after
		// the other, clean up, until nothing is pending and every
		// screen equals its own pages and the other screens
		var settle = async function(label)
		{
			var converged = false;
			var cycle = 0;

			for (cycle = 1; cycle <= 6 && !converged; cycle++)
			{
				for (var k = 0; k < 4; k++)
				{
					for (var i = 0; i < clients.length; i++)
					{
						clients[i].flush();
					}

					await broker.drain();
					await sleep(60);

					if (!broker.hasPending())
					{
						break;
					}
				}

				for (var i = 0; i < clients.length; i++)
				{
					if (clients[i].file.isModified())
					{
						await clients[i].save(0);
						await broker.drain();
						await sleep(60);
					}
				}

				for (var i = 0; i < clients.length; i++)
				{
					clients[i].cleanupNow();
				}

				await broker.drain();
				await sleep(60);
				converged = !broker.hasPending();

				for (var i = 0; i < clients.length && converged; i++)
				{
					converged = !clients[i].sync.localFileWasChanged &&
						clients[i].win.mxUtils.isEmptyObject(
							clients[i].ui.diffPages(clients[i].ui.pages,
								clients[i].file.ownPages)) &&
						(i == 0 || clients[i].getPagesHash() ==
							clients[0].getPagesHash());
				}
			}

			if (!converged)
			{
				report.fail('contradicting-ops', label +
					': not converged after 6 cycles' + firstDiff());
			}
			else
			{
				summary.push(label + '=' + (cycle - 1));
			}

			ctx.asserter.assertRenderableEdges(label);

			return converged;
		};

		// A label must exist exactly once on every client, or on none
		var agree = function(label, values)
		{
			for (var v = 0; v < values.length; v++)
			{
				var counts = [];

				for (var i = 0; i < clients.length; i++)
				{
					counts.push(exploreCountValue(clients[i], values[v]));
				}

				for (var i = 0; i < counts.length; i++)
				{
					if (counts[i] > 1 || counts[i] != counts[0])
					{
						report.fail('contradicting-ops', label + ': "' +
							values[v] + '" exists ' + counts.join('/') +
							' times on ' + clients.map(function(c)
							{
								return c.name;
							}).join('/'));

						break;
					}
				}
			}
		};

		// Delivers what the actors flushed. With several actors every
		// flush leaves before any delivery (a crossing). With raceSave a
		// seed-chosen actor saves on top of its flush before the traffic
		// is delivered, so the save merges against a state that lacks
		// the other side's diff (nasty's "saves racing live traffic")
		// and the receivers get the saved state and the live diff in
		// either order
		var deliver = async function(actors)
		{
			for (var i = 0; i < actors.length; i++)
			{
				actors[i].flush();
			}

			if (raceSave)
			{
				await actors[ctx.rand.int(actors.length)].save(0);
			}

			await broker.drain();
			await sleep(150);
		};

		var canUndo = function(client)
		{
			return client.ui.editor.undoManager.canUndo();
		};

		var canRedo = function(client)
		{
			return client.ui.editor.undoManager.canRedo();
		};

		var undoAll = function(client)
		{
			for (var n = 0; n < 10 && canUndo(client); n++)
			{
				client.ui.undo();
			}
		};

		var redoAll = function(client)
		{
			for (var n = 0; n < 10 && canRedo(client); n++)
			{
				client.ui.redo();
			}
		};

		// Committed and delivered base for a case; the histories start
		// empty so the undo loops replay exactly the case's edits
		var committedBase = async function(build)
		{
			build();
			A.flush();
			await broker.drain();
			await sleep(120);
			await A.save(0);
			await broker.drain();
			await sleep(120);

			for (var i = 0; i < clients.length; i++)
			{
				clients[i].ui.editor.undoManager.clear();
			}
		};

		// Guarded edits: the contested cell may be dead on this client
		// by now, and an edit on a dead cell is skipped rather than
		// invented (the undo loops replay what is actually there)
		var addVertex = function(client, id, label, x, y, parentId)
		{
			var parent = (parentId != null) ? m(client).getCell(parentId) : null;

			if (parentId == null || parent != null)
			{
				g(client).insertVertex(parent, id, label, x, y, 80, 40);
			}
		};

		var relabel = function(client, id, value)
		{
			var cell = m(client).getCell(id);

			if (cell != null)
			{
				g(client).cellLabelChanged(cell, value);
			}
		};

		var nudge = function(client, id)
		{
			var cell = m(client).getCell(id);

			if (cell != null)
			{
				g(client).moveCells([cell], 7, 7);
			}
		};

		// Moves the container of the given cell (a group it was put in)
		var nudgeParent = function(client, id)
		{
			var cell = m(client).getCell(id);
			var parent = (cell != null) ? m(client).getParent(cell) : null;

			if (parent != null && parent != g(client).getDefaultParent())
			{
				g(client).moveCells([parent], 7, 7);
			}
		};

		var waypoint = function(client, id, x, y)
		{
			var cell = m(client).getCell(id);
			var geo = (cell != null && m(client).isEdge(cell)) ?
				m(client).getGeometry(cell) : null;

			if (geo != null)
			{
				geo = geo.clone();
				geo.points = [new client.win.mxPoint(x, y)];
				m(client).setGeometry(cell, geo);
			}
		};

		var restyle = function(client, id, key, value)
		{
			var cell = m(client).getCell(id);

			if (cell != null)
			{
				g(client).setCellStyles(key, value, [cell]);
			}
		};

		var cases = [
			// Grouping a member the peer deletes at the same time
			{name: 'group-vs-delete', values: ['X', 'Y', 'Y2'],
				build: function(p)
				{
					addVertex(A, p + 'x', p + 'X', 40, 40);
					addVertex(A, p + 'y', p + 'Y', 160, 40);
				},
				ops: function(p)
				{
					g(A).groupCells(null, 20,
						[m(A).getCell(p + 'x'), m(A).getCell(p + 'y')]);
					g(B).removeCells([m(B).getCell(p + 'x')], true);
				},
				follow: [function(p)
				{
					nudgeParent(A, p + 'y');
				}, function(p)
				{
					relabel(B, p + 'y', p + 'Y2');
				}]},
			// Connecting to a terminal the peer deletes at the same time
			{name: 'connect-vs-delete', values: ['X', 'Y', 'E', 'X2'],
				build: function(p)
				{
					addVertex(A, p + 'x', p + 'X', 40, 140);
					addVertex(A, p + 'y', p + 'Y', 200, 140);
				},
				ops: function(p)
				{
					g(A).insertEdge(null, p + 'e', p + 'E',
						m(A).getCell(p + 'x'), m(A).getCell(p + 'y'));
					g(B).removeCells([m(B).getCell(p + 'y')], true);
				},
				follow: [function(p)
				{
					waypoint(A, p + 'e', 120, 100);
				}, function(p)
				{
					relabel(B, p + 'x', p + 'X2');
				}]},
			// Two groups claiming the same member
			{name: 'group-vs-group', values: ['X', 'Y', 'Z'],
				build: function(p)
				{
					addVertex(A, p + 'x', p + 'X', 40, 240);
					addVertex(A, p + 'y', p + 'Y', 160, 240);
					addVertex(A, p + 'z', p + 'Z', 280, 240);
				},
				ops: function(p)
				{
					g(A).groupCells(null, 20,
						[m(A).getCell(p + 'x'), m(A).getCell(p + 'y')]);
					g(B).groupCells(null, 20,
						[m(B).getCell(p + 'y'), m(B).getCell(p + 'z')]);
				},
				follow: [function(p)
				{
					nudgeParent(A, p + 'x');
				}, function(p)
				{
					nudgeParent(B, p + 'z');
				}]},
			// The same shape moved into two different containers
			{name: 'reparent-vs-reparent', values: ['X', 'C1', 'C2', 'X2'],
				build: function(p)
				{
					addVertex(A, p + 'x', p + 'X', 40, 340);
					g(A).insertVertex(null, p + 'c1', p + 'C1', 200, 320,
						200, 120, 'swimlane;whiteSpace=wrap;html=1;');
					g(A).insertVertex(null, p + 'c2', p + 'C2', 440, 320,
						200, 120, 'swimlane;whiteSpace=wrap;html=1;');
				},
				ops: function(p)
				{
					var actors = [A, B];
					var targets = [p + 'c1', p + 'c2'];

					for (var i = 0; i < actors.length; i++)
					{
						var model = m(actors[i]);
						model.beginUpdate();

						try
						{
							model.add(model.getCell(targets[i]),
								model.getCell(p + 'x'));
						}
						finally
						{
							model.endUpdate();
						}
					}
				},
				follow: [function(p)
				{
					nudge(A, p + 'x');
				}, function(p)
				{
					relabel(B, p + 'x', p + 'X2');
				}]},
			// Deleting a shape the peer edits at the same time
			{name: 'delete-vs-edit', values: ['X', 'X-edited', 'V2', 'V3'],
				build: function(p)
				{
					addVertex(A, p + 'x', p + 'X', 40, 460);
				},
				ops: function(p)
				{
					g(A).removeCells([m(A).getCell(p + 'x')], true);
					var model = m(B);
					model.beginUpdate();

					try
					{
						g(B).cellLabelChanged(model.getCell(p + 'x'),
							p + 'X-edited');
						var geo = model.getGeometry(model.getCell(p + 'x')).clone();
						geo.x += 50;
						model.setGeometry(model.getCell(p + 'x'), geo);
					}
					finally
					{
						model.endUpdate();
					}
				},
				follow: [function(p)
				{
					addVertex(A, p + 'v2', p + 'V2', 200, 460);
				}, function(p)
				{
					if (m(B).getCell(p + 'x') != null)
					{
						nudge(B, p + 'x');
					}
					else
					{
						addVertex(B, p + 'v3', p + 'V3', 320, 460);
					}
				}]},
			// Connecting into a group the peer deletes at the same time
			{name: 'connect-into-deleted-group',
				values: ['X', 'Y', 'W', 'E', 'V2'],
				build: function(p)
				{
					addVertex(A, p + 'x', p + 'X', 40, 560);
					addVertex(A, p + 'y', p + 'Y', 160, 560);
					addVertex(A, p + 'w', p + 'W', 360, 560);
					this.groupId = g(A).groupCells(null, 20,
						[m(A).getCell(p + 'x'), m(A).getCell(p + 'y')]).getId();
				},
				ops: function(p)
				{
					g(A).removeCells([m(A).getCell(this.groupId)], true);
					g(B).insertEdge(null, p + 'e', p + 'E',
						m(B).getCell(p + 'w'), m(B).getCell(p + 'x'));
				},
				follow: [function(p)
				{
					addVertex(A, p + 'v2', p + 'V2', 520, 560);
				}, function(p)
				{
					waypoint(B, p + 'e', 300, 520);
				}]},
			// Ungrouping while the peer adds a child to the group
			{name: 'ungroup-vs-add-child', values: ['X', 'Y', 'N', 'N2'],
				build: function(p)
				{
					addVertex(A, p + 'x', p + 'X', 40, 660);
					addVertex(A, p + 'y', p + 'Y', 160, 660);
					this.groupId = g(A).groupCells(null, 20,
						[m(A).getCell(p + 'x'), m(A).getCell(p + 'y')]).getId();
				},
				ops: function(p)
				{
					g(A).ungroupCells([m(A).getCell(this.groupId)]);
					addVertex(B, p + 'n', p + 'N', 10, 10, this.groupId);
				},
				follow: [function(p)
				{
					nudge(A, p + 'x');
				}, function(p)
				{
					relabel(B, p + 'n', p + 'N2');
				}]},
			// The same edge reconnected to two different targets
			{name: 'reconnect-vs-reconnect', values: ['E', 'E2'],
				build: function(p)
				{
					addVertex(A, p + 'x', p + 'X', 40, 760);
					addVertex(A, p + 'y', p + 'Y', 200, 760);
					addVertex(A, p + 'z', p + 'Z', 360, 760);
					addVertex(A, p + 'w', p + 'W', 520, 760);
					g(A).insertEdge(null, p + 'e', p + 'E',
						m(A).getCell(p + 'x'), m(A).getCell(p + 'y'));
				},
				ops: function(p)
				{
					g(A).connectCell(m(A).getCell(p + 'e'),
						m(A).getCell(p + 'z'), false);
					g(B).connectCell(m(B).getCell(p + 'e'),
						m(B).getCell(p + 'w'), false);
				},
				follow: [function(p)
				{
					restyle(A, p + 'e', 'strokeColor', '#ff0000');
				}, function(p)
				{
					relabel(B, p + 'e', p + 'E2');
				}]},
			// Deleting an edge the peer reconnects at the same time
			{name: 'delete-edge-vs-reconnect', values: ['E', 'V2'],
				build: function(p)
				{
					addVertex(A, p + 'x', p + 'X', 40, 860);
					addVertex(A, p + 'y', p + 'Y', 200, 860);
					addVertex(A, p + 'z', p + 'Z', 360, 860);
					g(A).insertEdge(null, p + 'e', p + 'E',
						m(A).getCell(p + 'x'), m(A).getCell(p + 'y'));
				},
				ops: function(p)
				{
					g(A).removeCells([m(A).getCell(p + 'e')], true);
					g(B).connectCell(m(B).getCell(p + 'e'),
						m(B).getCell(p + 'z'), false);
				},
				follow: [function(p)
				{
					addVertex(A, p + 'v2', p + 'V2', 520, 860);
				}, function(p)
				{
					restyle(B, p + 'e', 'strokeColor', '#0000ff');
				}]},
			// Three clients on one shape: grouped, deleted and connected
			// to at the same time, then every author replays
			{name: 'three-way', actors: [A, B, C],
				values: ['X', 'Y', 'Z', 'E', 'X2', 'V2', 'E2'],
				build: function(p)
				{
					addVertex(A, p + 'x', p + 'X', 40, 960);
					addVertex(A, p + 'y', p + 'Y', 160, 960);
					addVertex(A, p + 'z', p + 'Z', 360, 960);
				},
				ops: function(p)
				{
					g(A).groupCells(null, 20,
						[m(A).getCell(p + 'x'), m(A).getCell(p + 'y')]);
					g(B).removeCells([m(B).getCell(p + 'y')], true);
					g(C).insertEdge(null, p + 'e', p + 'E',
						m(C).getCell(p + 'z'), m(C).getCell(p + 'y'));
				},
				follow: [function(p)
				{
					relabel(A, p + 'x', p + 'X2');
				}, function(p)
				{
					addVertex(B, p + 'v2', p + 'V2', 520, 960);
				}, function(p)
				{
					relabel(C, p + 'e', p + 'E2');
				}]}
		];

		var runCase = async function(cs, p)
		{
			var actors = (cs.actors != null) ? cs.actors : [A, B];
			var values = [];

			for (var i = 0; i < cs.values.length; i++)
			{
				values.push(p + cs.values[i]);
			}

			var phase = async function(label)
			{
				await settle(p + cs.name + ' ' + label);
				agree(p + cs.name + ' ' + label, values);
			};

			await committedBase(function()
			{
				cs.build(p);
			});

			cs.ops(p);
			await deliver(actors);
			await phase('crossing');

			// The crossing undone and redone as a crossing
			for (var i = 0; i < actors.length; i++)
			{
				undoAll(actors[i]);
			}

			await deliver(actors);
			await phase('undo crossing');

			for (var i = 0; i < actors.length; i++)
			{
				redoAll(actors[i]);
			}

			await deliver(actors);
			await phase('redo crossing');

			// Follow-ups on the contested cells, delivered one by one
			for (var i = 0; i < actors.length; i++)
			{
				if (cs.follow[i] != null)
				{
					cs.follow[i](p);
					await deliver([actors[i]]);
				}
			}

			await phase('follow-up');

			// Replays stepped one client at a time, each delivered
			// before the next one: every replay lands on the peers as a
			// remote change and the next replay resolves against it
			var more = true;

			for (var guard = 0; guard < 8 && more; guard++)
			{
				more = false;

				for (var i = 0; i < actors.length; i++)
				{
					if (canUndo(actors[i]))
					{
						actors[i].ui.undo();
						await deliver([actors[i]]);
						more = true;
					}
				}
			}

			await phase('undo steps');
			more = true;

			for (var guard = 0; guard < 8 && more; guard++)
			{
				more = false;

				for (var i = 0; i < actors.length; i++)
				{
					if (canRedo(actors[i]))
					{
						actors[i].ui.redo();
						await deliver([actors[i]]);
						more = true;
					}
				}
			}

			await phase('redo steps');

			// Everything undone and redone as a crossing
			for (var i = 0; i < actors.length; i++)
			{
				undoAll(actors[i]);
			}

			await deliver(actors);
			await phase('undo all crossing');

			for (var i = 0; i < actors.length; i++)
			{
				redoAll(actors[i]);
			}

			await deliver(actors);
			await phase('redo all crossing');
		};

		for (var pass = 0; pass < 2; pass++)
		{
			raceSave = (pass == 1);

			for (var c = 0; c < cases.length; c++)
			{
				var label = cases[c].name + ((raceSave) ? ' +save' : '');
				var before = report.failures.length;

				try
				{
					await runCase(cases[c], 'co' + pass + '_' + c + '_');
				}
				catch (e)
				{
					report.fail('contradicting-ops', label + ': ' + e.message);
				}

				report.log('contradicting-ops: ' + label + ' ' +
					((report.failures.length == before) ? 'ok' : 'FAILED'));
			}
		}

		// Quiescence cycles per phase, in the results file even for a
		// green run: a phase that suddenly needs more cycles to converge
		// is a regression signal before it becomes a failure
		report.stats.contradicting = summary;
		report.log('contradicting-ops cycles: ' + summary.join(' '));
	};

	// --- sync-latency -----------------------------------------------------
	// MEASUREMENT, not a lock: how long the screen stays behind the
	// file under PRODUCTION timers while the user keeps editing. Two
	// numbers per run, in ms:
	// - conflictVisibleMs (per client): both clients relabel the same
	//   cell at once, the diffs cross, and the file resolves the
	//   conflict through the save cycle; measured from the moment a
	//   client's screen and own pages disagree about the cell until
	//   they agree again. The screen is reconciled by cleanup only.
	// - expelMs: a live diff whose sender never saves (autosave
	//   disabled on the sender); measured from its arrival on the peer
	//   until the cleanup expels it.
	// The peer keeps typing into another cell during both windows
	// (typing= ms, default 12000): every local change, flush and
	// autosave re-arms the lazy cleanup, which is what starves it in
	// production. The grace period is grace= ms (default 5000; the
	// production 60000 makes the run a minute longer per number).
	// Requires --timing real: with mock timers the numbers are
	// meaningless, so the scenario logs and returns.
	async function runSyncLatency(clients, broker, report, ctx)
	{
		if (!RtHarness.realTiming)
		{
			report.log('sync-latency: requires --timing real, skipped');

			return;
		}

		var A = clients[0];
		var B = clients[1];
		var search = A.win.location.search || '';
		var graceMatch = /[?&]grace=(\d+)/.exec(search);
		var typingMatch = /[?&]typing=(\d+)/.exec(search);
		var graceMs = (graceMatch != null) ? parseInt(graceMatch[1], 10) : 5000;
		var typingMs = (typingMatch != null) ? parseInt(typingMatch[1], 10) : 12000;
		var capMs = 90000;
		A.sync.remoteGraceDelay = graceMs;
		B.sync.remoteGraceDelay = graceMs;
		A.ui.selectPage(A.ui.pages[0], true);
		B.ui.selectPage(B.ui.pages[0], true);

		// The broker delivers on drain only: a pump keeps live diffs
		// and saves flowing like a socket while the timers run
		var pumping = true;

		(async function()
		{
			while (pumping)
			{
				await broker.drain();
				await sleep(50);
			}
		})();

		var cleanups = 0;
		var origCleanup = A.sync.cleanup;

		A.sync.cleanup = function()
		{
			cleanups++;

			return origCleanup.apply(this, arguments);
		};

		var ownValue = function(client, id)
		{
			var pages = client.file.ownPages;

			for (var i = 0; pages != null && i < pages.length; i++)
			{
				var cell = new client.win.mxGraphModel(pages[i].root).getCell(id);

				if (cell != null)
				{
					return cell.value;
				}
			}

			return null;
		};

		var uiValue = function(client, id)
		{
			var cell = findCellAnyPage(client, id);

			return (cell != null) ? cell.value : null;
		};

		var pollUntil = async function(pred)
		{
			var t0 = Date.now();

			while (Date.now() - t0 < capMs)
			{
				if (pred())
				{
					return Date.now();
				}

				await sleep(50);
			}

			return null;
		};

		// Human typing into a cell of its own: a relabel every 400ms
		var typeInto = async function(client, id, ms)
		{
			var t0 = Date.now();
			var n = 0;

			while (Date.now() - t0 < ms)
			{
				var model = client.ui.editor.graph.getModel();
				model.setValue(model.getCell(id), 'T' + (n++));
				await sleep(400);
			}
		};

		var waitSaved = async function(client)
		{
			await RtTestBackend.waitFor(client.name + ' idle after autosave', function()
			{
				return !client.file.isModified() && !client.file.savingFile;
			}, capMs, function() { return RtTestBackend.state(broker); });
		};

		// Base: the conflict cell and the typing cell, saved
		var graphA = A.ui.editor.graph;
		graphA.insertVertex(null, 'sl_c', 'C0', 40, 40, 80, 40);
		graphA.insertVertex(null, 'sl_t', 'T', 200, 40, 80, 40);
		await waitSaved(A);
		await sleep(500);

		if (findCellAnyPage(B, 'sl_c') == null || findCellAnyPage(B, 'sl_t') == null)
		{
			report.fail('sync-latency-setup', 'the base did not reach the peer');
			pumping = false;

			return;
		}

		// Phase 1: crossing relabels of the same cell
		var modelA = A.ui.editor.graph.getModel();
		var modelB = B.ui.editor.graph.getModel();
		modelA.setValue(modelA.getCell('sl_c'), 'A1');
		modelB.setValue(modelB.getCell('sl_c'), 'B1');
		A.flush();
		B.flush();
		var typing = typeInto(A, 'sl_t', typingMs);
		var latency = {graceMs: graceMs, typingMs: typingMs,
			conflictVisibleMs: {}};

		for (var i = 0; i < 2; i++)
		{
			(function(client)
			{
				latency.conflictVisibleMs[client.name] = null;
			})(clients[i]);
		}

		var measureConflict = async function(client)
		{
			var tDiverge = await pollUntil(function()
			{
				return uiValue(client, 'sl_c') != ownValue(client, 'sl_c');
			});

			if (tDiverge == null)
			{
				// Never diverged: the screen and the file agreed all
				// along (eg. the other side's diff lost the race)
				latency.conflictVisibleMs[client.name] = 0;

				return;
			}

			var tConverge = await pollUntil(function()
			{
				return uiValue(client, 'sl_c') == ownValue(client, 'sl_c');
			});

			if (tConverge == null)
			{
				report.fail('sync-latency', client.name + ': the screen ' +
					'did not converge to the own pages within ' + capMs +
					'ms (ui=' + uiValue(client, 'sl_c') + ' own=' +
					ownValue(client, 'sl_c') + ')');
			}
			else
			{
				latency.conflictVisibleMs[client.name] = tConverge - tDiverge;
			}
		};

		await Promise.all([measureConflict(A), measureConflict(B), typing]);
		await waitSaved(A);
		await waitSaved(B);
		await sleep(500);

		if (uiValue(A, 'sl_c') != uiValue(B, 'sl_c'))
		{
			report.fail('sync-latency', 'the clients disagree about the ' +
				'conflict cell after convergence (' + uiValue(A, 'sl_c') +
				' vs ' + uiValue(B, 'sl_c') + ')');
		}

		// Phase 2: live content whose sender never saves
		var origAutosave = B.file.autosave;
		B.file.autosave = function() {};
		B.ui.editor.graph.insertVertex(null, 'sl_ghost', 'GHOST', 40, 200, 80, 40);
		B.flush();
		var tArrive = await pollUntil(function()
		{
			return findCellAnyPage(A, 'sl_ghost') != null;
		});

		if (tArrive == null)
		{
			report.fail('sync-latency-setup', 'the live diff never arrived');
		}
		else
		{
			typing = typeInto(A, 'sl_t', typingMs);
			var tExpel = await pollUntil(function()
			{
				return findCellAnyPage(A, 'sl_ghost') == null;
			});
			await typing;

			if (tExpel == null)
			{
				report.fail('sync-latency', 'unsaved remote content was not ' +
					'expelled within ' + capMs + 'ms');
			}
			else
			{
				latency.expelMs = tExpel - tArrive;
			}
		}

		// The sender drops its unsaved content too, so the final
		// arbitration sees one document
		B.ui.undo();
		B.flush();
		B.file.autosave = origAutosave;

		if (B.file.isModified())
		{
			B.file.autosave();
		}

		await waitSaved(A);
		await waitSaved(B);
		await sleep(500);
		pumping = false;
		A.sync.cleanup = origCleanup;
		latency.cleanupsA = cleanups;
		report.stats.latency = latency;
		report.log('sync-latency ' + JSON.stringify(latency));
	};

	// --- conflict-window-diff -------------------------------------------
	// A client whose save was rejected (412) is in conflict state until
	// the catchup's merge completes: a second or more per crossing save,
	// and two autosaving clients cross saves all the time.
	// handleRemoteMessage dropped EVERY message in that state, live
	// diffs included, so a peer's insert sent into the window never
	// reached the screen live: it arrived with the peer's save in the
	// own pages only and waited there for the cleanup, behind the grace
	// period of whatever unconfirmed content happened to be on screen
	// (production find: an insert visible after 70s). Live diffs touch
	// the visible and the remote pages, which the save conflict does
	// not, so they must be applied in the window.
	async function runConflictWindowDiff(clients, broker, report, ctx)
	{
		var A = clients[0];
		var B = clients[1];
		A.ui.selectPage(A.ui.pages[0], true);
		B.ui.selectPage(B.ui.pages[0], true);

		// Base both clients know
		A.ui.editor.graph.insertVertex(null, 'cw_a', 'A', 40, 40, 80, 40);
		A.flush();
		await broker.drain();
		await sleep(120);
		await A.save(0);
		await broker.drain();
		await sleep(120);

		// B saves; A saves on the stale base BEFORE it merged B's save
		// and is rejected: A is in conflict state now. B's save is held
		// back in A's queue: in production the peer's live diff races
		// the catchup of the rejected save and arrives before the merge
		// that ends the conflict state, but the broker delivers in order
		B.ui.editor.graph.insertVertex(null, 'cw_b', 'B', 160, 40, 80, 40);
		B.flush();
		await broker.drain();
		await sleep(120);
		await B.save(0);
		var held = [];

		for (var i = broker.queues[0].length - 1; i >= 0; i--)
		{
			if (broker.queues[0][i].msg.a == 'rt-test-save')
			{
				held.unshift(broker.queues[0].splice(i, 1)[0]);
			}
		}

		A.ui.editor.graph.insertVertex(null, 'cw_a2', 'A2', 40, 160, 80, 40);
		A.flush();
		await A.save(0);

		if (!A.file.inConflictState || held.length == 0)
		{
			report.fail('conflict-window-diff-setup',
				'the stale save did not put the client in conflict state');

			return;
		}

		// B's live insert lands in A's conflict window
		B.ui.editor.graph.insertVertex(null, 'cw_live', 'LIVE', 160, 160, 80, 40);
		B.flush();
		await broker.drain();
		await sleep(150);

		if (!A.file.inConflictState)
		{
			report.fail('conflict-window-diff-setup',
				'the conflict state ended before the held save was merged');
		}

		if (findCellAnyPage(A, 'cw_live') == null)
		{
			report.fail('conflict-window-diff', 'a live diff sent while ' +
				'the receiver was in conflict state was dropped');
		}

		// The held save arrives: its merge ends the conflict state, the
		// retried save succeeds and everything converges
		for (var i = 0; i < held.length; i++)
		{
			broker.queues[0].push(held[i]);
		}

		await broker.drain();
		await sleep(150);

		if (A.file.inConflictState)
		{
			report.fail('conflict-window-diff', 'the merge of the peer save ' +
				'did not end the conflict state');
		}

		await A.save(0);
		await broker.drain();
		await sleep(150);

		A.flush();
		B.flush();
		await broker.drain();
		await sleep(120);
	};

	// --- deferred-notify ------------------------------------------------
	// A file-changed notification that arrives while a save is in
	// flight is deferred (remoteFileChanged) and replayed when the save
	// succeeds. A save that FAILED dropped it - the twin of the
	// descriptor deferral already fixed once - so the peer's save was
	// never merged: the own pages lacked its content, the screen showed
	// it as unconfirmed live content, and the cleanup expelled it after
	// the grace period until the client's next successful save (412,
	// catchup) brought it back. The harness bypasses the notify chain
	// (saves reach peers as merges), so the deferral is checked at its
	// entry: the catchup trigger is counted instead of run.
	async function runDeferredNotify(clients, broker, report, ctx)
	{
		var B = clients[1];
		var calls = 0;
		var origFileChanged = B.sync.fileChanged;

		B.sync.fileChanged = function()
		{
			calls++;

			return null;
		};

		try
		{
			B.file.savingFile = true;
			B.sync.fileChangedNotify();

			if (!B.sync.remoteFileChanged || calls != 0)
			{
				report.fail('deferred-notify-setup',
					'a notification during a save was not deferred');

				return;
			}

			// The save fails (not a conflict): the deferral is replayed
			B.file.savingFile = false;
			B.file.handleFileError({message: 'injected save failure'});

			if (calls != 1 || B.sync.remoteFileChanged)
			{
				report.fail('deferred-notify', 'a file-changed notification ' +
					'deferred during a save was dropped when the save failed');
			}

			// A conflict runs its own catchup: the deferral waits for it
			B.file.savingFile = true;
			B.sync.fileChangedNotify();
			B.file.savingFile = false;
			B.file.inConflictState = true;
			B.sync.flushRemoteFileChanged();

			if (calls != 1 || !B.sync.remoteFileChanged)
			{
				report.fail('deferred-notify', 'the deferral was replayed ' +
					'into a running conflict resolution');
			}
		}
		finally
		{
			B.sync.fileChanged = origFileChanged;
			B.sync.remoteFileChanged = false;
			B.file.savingFile = false;
			B.file.inConflictState = false;
		}
	};

	// --- batch-isolation ------------------------------------------------
	// Live diffs that arrive within the receive window are applied in
	// one batch. The batch loop aborted at the first exception, so a
	// message that failed took every message batched behind it down
	// with it - silently for the screen, which only the save merge and
	// the cleanup caught up with later. The poison hardening made the
	// known malformed shapes not throw, which is why poison-live-diff
	// could not see this: the failure is injected here.
	async function runBatchIsolation(clients, broker, report, ctx)
	{
		var A = clients[0];
		var B = clients[1];
		A.ui.selectPage(A.ui.pages[0], true);
		B.ui.selectPage(B.ui.pages[0], true);
		var pageId = A.ui.pages[0].getId();
		var origPatch = B.file.patch;
		var origLogError = B.win.EditorUi.logError;
		var thrown = 0;
		var logged = 0;

		B.file.patch = function(patches)
		{
			if (JSON.stringify(patches).indexOf('bi_boom') >= 0)
			{
				thrown++;
				throw new Error('injected patch failure');
			}

			return origPatch.apply(this, arguments);
		};

		B.win.EditorUi.logError = function()
		{
			logged++;
		};

		var message = function(cellId, counter)
		{
			var pages = Object.create(null);
			pages[pageId] = {cells: {i: [{id: cellId, vertex: 1, parent: '1',
				value: cellId, geometry: '<mxGeometry x="10" y="' +
				(40 * counter) + '" width="60" height="30"/>'}]}};

			return A.sync.objectToString(A.sync.createMessage(
				{a: 'change', c: [{}, {u: pages}], id: 'bi.' + counter, t: 1}));
		};

		try
		{
			// Back-to-back deliveries land in the same receive window
			B.sync.changeListener(message('bi_boom', 1));
			B.sync.changeListener(message('bi_ok', 2));
			await sleep(250);
		}
		finally
		{
			B.file.patch = origPatch;
			B.win.EditorUi.logError = origLogError;
		}

		if (thrown != 1)
		{
			report.fail('batch-isolation-setup', 'the injected failure did ' +
				'not fire (' + thrown + ')');
		}

		if (findCellAnyPage(B, 'bi_ok') == null)
		{
			report.fail('batch-isolation', 'a failing message took the rest ' +
				'of its receive batch down');
		}

		if (logged < 1)
		{
			report.fail('batch-isolation', 'the message failure was not reported');
		}

		// The injected content is unconfirmed and expires; everything
		// converges through the normal cycle
		await broker.drain();
		await sleep(120);
	};

	return {
		FakeRtServer: FakeRtServer,
		enableRealP2P: enableRealP2P,
		Rand: Rand,
		Report: Report,
		Broker: Broker,
		Client: Client,
		OpGenerator: OpGenerator,
		Asserter: Asserter,
		runLayoutRace: runLayoutRace,
		runLayoutPassive: runLayoutPassive,
		assertFinalStackConsistent: assertFinalStackConsistent,
		runAdoptionRace: runAdoptionRace,
		runPageOrderRace: runPageOrderRace,
		runPageAdoptionRace: runPageAdoptionRace,
		runPageAdoptionEditRace: runPageAdoptionEditRace,
		assertFinalPageAdoptionEdits: assertFinalPageAdoptionEdits,
		runUndoStale: runUndoStale,
		runNestedUndoEndpoint: runNestedUndoEndpoint,
		runUndoAncestryCycle: runUndoAncestryCycle,
		runPageRevivalUndo: runPageRevivalUndo,
		runRevivedAncestryCycle: runRevivedAncestryCycle,
		runWriteRevoked: runWriteRevoked,
		runRevokedDescendants: runRevokedDescendants,
		runRevokedChild: runRevokedChild,
		runRevokedFileVars: runRevokedFileVars,
		runFileVarsLifecycle: runFileVarsLifecycle,
		runJoinMidSession: runJoinMidSession,
		runMixedVersion: runMixedVersion,
		runEditorSemantics: runEditorSemantics,
		runDesktopMerge: runDesktopMerge,
		runAdoptionEditRace: runAdoptionEditRace,
		runOfflineRejoin: runOfflineRejoin,
		runRootChange: runRootChange,
		runStrayRoot: runStrayRoot,
		runCurrentPageDelete: runCurrentPageDelete,
		runJoinVisibility: runJoinVisibility,
		runSoloResend: runSoloResend,
		runAdversarialPatch: runAdversarialPatch,
		runHostileContent: runHostileContent,
		runDeliveryMatrix: runDeliveryMatrix,
		runRemoteGrace: runRemoteGrace,
		runTransientRevert: runTransientRevert,
		runRestoreUndo: runRestoreUndo,
		runDrillIn: runDrillIn,
		runCollapsedInsert: runCollapsedInsert,
		runEdgeLabel: runEdgeLabel,
		runPageDeleteUndo: runPageDeleteUndo,
		runCrossPageUndo: runCrossPageUndo,
		runGroupRace: runGroupRace,
		runDualResend: runDualResend,
		runRevisionRestore: runRevisionRestore,
		runWebEcho: runWebEcho,
		runP2pJoinRace: runP2pJoinRace,
		runSignalImpersonation: runSignalImpersonation,
		runRepairAdoption: runRepairAdoption,
		runDetachedSubtreeUndo: runDetachedSubtreeUndo,
		runPhantomCurrentPage: runPhantomCurrentPage,
		runPoisonLiveDiff: runPoisonLiveDiff,
		runLivePageInsertRevert: runLivePageInsertRevert,
		runStaleResolve: runStaleResolve,
		runP2pVersionGate: runP2pVersionGate,
		runP2pOfflineRejoin: runP2pOfflineRejoin,
		runPasteIds: runPasteIds,
		runCrashReload: runCrashReload,
		runRevokeStorm: runRevokeStorm,
		runPerfGate: runPerfGate,
		runContradictingOps: runContradictingOps,
		runSyncLatency: runSyncLatency,
		runConflictWindowDiff: runConflictWindowDiff,
		runDeferredNotify: runDeferredNotify,
		runBatchIsolation: runBatchIsolation,
		sleep: sleep
	};
})();
