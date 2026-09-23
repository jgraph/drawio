/** Persistence and notification regressions; no application implementation is patched. */
var RtCoverage = (function()
{
	'use strict';
	var T = RtTestBackend, D = RtDescriptorBackend;
	function vertex(c, id)
	{
		return c.ui.editor.graph.insertVertex(null, id, id, 40, 40, 80, 40);
	}
	function vars(c, value)
	{
		if (value == null) c.ui.fileNode.removeAttribute('vars');
		else c.ui.fileNode.setAttribute('vars', value);
		c.ui.updateFileVars();
		c.file.fileChanged();
	}
	function needCell(c, id, pages) { T.check(T.cell(c, id, pages), c.name + ' missing ' + id); }
	function cold(c, receipt, ids, expectedVars)
	{
		var record = c.broker.commits[receipt.committedRevision];
		T.check(record && record.sha256 == receipt.sha256, 'cold oracle requires committed bytes');
		var parsed = T.parse(c, record.data);
		ids.forEach(function(id) { needCell(c, id, parsed.pages); });
		if (expectedVars !== undefined) T.check(parsed.vars === expectedVars,
			'persisted vars: expected ' + expectedVars + ', got ' + parsed.vars);
		return parsed;
	}
	async function settle(b) { await T.drain(b); }
	async function saved(c, b)
	{
		var r = await c.mustCommit();
		if (b.backend == 'descriptor' && !b.holdNotifications)
		{
			await Promise.all(b.clients.filter(function(x) { return x.file && !x.offline && !x.unjoined; })
				.map(function(x) { return D.revision(x, r.committedRevision); }));
		}
		else await settle(b);
		return r;
	}
	async function saveOutcomes(cs, b, report)
	{
		var A = cs[0];
		vertex(A, 'receipt'); A.flush(); await settle(b);
		var first = await saved(A, b); cold(A, first, ['receipt']);
		A.holdSaveCommit = true;
		var pending = A.save(), held = A.lastSaveAttempt;
		T.check((await A.save()).status == 'busy', 'busy save reported success');
		await held.commit(); T.check((await pending).status == 'committed', 'held save did not commit');
		A.holdSaveCommit = false;
		await settle(b);
		A.nextSaveFailure = 'failed';
		var rev = b.revision;
		T.check((await A.save()).status == 'failed' && b.revision == rev, 'failed save advanced storage');
		A.nextSaveFailure = 'conflict';
		T.check((await A.save()).status == 'conflict' && b.revision == rev, 'conflict reported a commit');
		A.file.inConflictState = false; // Fixture-only injected 412; storage is unchanged.
		A.holdSaveCommit = true; A.saveTimeout = 50; A.expectSaveTimeout = true;
		T.check((await A.save()).status == 'timeout' && b.revision == rev, 'timeout reported a commit');
		A.holdSaveCommit = false; A.saveTimeout = null; A.expectSaveTimeout = false;
		A.file.savingFile = false;
		A.nextSaveNoop = true;
		T.check((await A.save()).status == 'noop' && b.revision == rev, 'no-op callback was counted as a write');
		A.nextSaveNoop = true;
		var rejected = false;
		try { await A.mustCommit(); } catch (e) { rejected = true; }
		T.check(rejected, 'mustCommit accepted a no-op success callback');
		report.stats.saveOutcomeControl = true;
	}
	async function notifySave(cs, b, kind)
	{
		var A = cs[0], B = cs[1];
		b.holdNotifications = true;
		var saving, attempt;
		if (kind != 'success')
		{
			// Capture revision 0 before A commits. The commit-time etag check is real.
			vertex(B, 'local'); B.flush(); await settle(b);
			B.holdSaveCommit = true;
			if (kind == 'failure') B.nextSaveFailure = 'failed';
			saving = B.save(); attempt = B.lastSaveAttempt;
		}
		vertex(A, 'remote'); A.flush(); await settle(b);
		await saved(A, b);
		if (kind == 'success')
		{
			D.deliver(b); await D.revision(B, b.revision);
			vertex(B, 'local'); B.flush(); await settle(b);
			B.holdSaveAck = true; saving = B.save(); attempt = B.lastSaveAttempt;
			await T.waitFor('B durable commit before ack', function() { return attempt.committedRevision != null; });
			// Another client loads those durable bytes and saves revision 3 while
			// B still awaits its revision-2 callback. No fabricated notify is needed.
			await new Promise(function(resolve, reject) { A.file.updateFile(resolve, reject); });
			vertex(A, 'during-ack'); A.flush(); await settle(b); await saved(A, b);
			D.deliver(b);
			T.check(B.sync.remoteFileChanged, 'notification not deferred during save');
			B.holdSaveAck = false; attempt.ack();
			T.check((await saving).status == 'committed', 'ack did not finish save');
		}
		else
		{
			D.deliver(b);
			T.check(B.sync.remoteFileChanged, 'incoming notification did not defer');
			await attempt.commit();
			T.check((await saving).status == (kind == 'failure' ? 'failed' : 'conflict'), 'incorrect save outcome');
			B.holdSaveCommit = false;
			if (kind == 'conflict')
			{
				await new Promise(function(resolve, reject) { B.sync.fileConflict(null, resolve, reject); });
			}
		}
		await D.revision(B, b.revision);
		await T.waitFor('deferred notification drained', function() { return !B.sync.remoteFileChanged && !B.testIo; },
			10000, function() { return T.state(b); });
		needCell(B, 'remote', B.file.getShadowPages());
		if (kind == 'success') needCell(B, 'during-ack', B.file.getShadowPages());
		T.check(b.requests.some(function(r) { return r.kind == 'cache-get' && r.client == B.idx; }),
			'notification never reached cache catchup');
		b.holdNotifications = false; D.deliver(b);
		var receipt = await saved(B, b); cold(B, receipt, ['local', 'remote']);
	}
	async function cacheRange(cs, b, variant)
	{
		var A = cs[0], B = cs[1];
		b.holdNotifications = true;
		vertex(A, 'range1'); A.flush(); await settle(b); await saved(A, b);
		vertex(A, 'range2'); A.flush(); await settle(b); var receipt = await saved(A, b);
		var msgs = b.notifications.splice(0);
		if (variant == 'notify-order') msgs = [msgs[msgs.length - 1], msgs[0], msgs[msgs.length - 1]];
		D.deliver(b, msgs, [B]); await D.revision(B, receipt.committedRevision);
		needCell(B, 'range1', B.file.getShadowPages()); needCell(B, 'range2', B.file.getShadowPages());
		var merges = b.requests.filter(function(r) { return r.kind == 'merge' && r.client == B.idx; });
		T.check(merges.length == 1 && merges[0].patches == 2, 'catchup did not merge the full ordered range once: ' + JSON.stringify(merges));
		T.check(!b.requests.some(function(r) { return r.kind == 'latest'; }), 'valid cache range unexpectedly reloaded');
		cold(A, receipt, ['range1', 'range2']);
		b.holdNotifications = false;
	}
	async function cacheFallback(cs, b, mode)
	{
		var A = cs[0], B = cs[1];
		b.holdNotifications = true;
		// No live delivery: the persisted file is the only source of this shape.
		B.setOffline(true); vertex(A, 'fallback'); A.flush(); await settle(b);
		if (mode == 'oversize') A.sync.maxCacheEntrySize = 1;
		var receipt = await saved(A, b); B.setOffline(false);
		vertex(B, 'fallback-pending');
		B.cacheResponse = mode;
		if (mode == 'old-app') B.sync.minRemoteAppVersion = B.win.EditorUi.VERSION;
		D.deliver(b); await D.revision(B, receipt.committedRevision);
		needCell(B, 'fallback'); needCell(B, 'fallback', B.file.getShadowPages());
		T.check(b.requests.filter(function(r) { return r.kind == 'latest' && r.client == B.idx; }).length == 1,
			mode + ': expected exactly one full-file fallback');
		cold(A, receipt, ['fallback']);
		needCell(B, 'fallback-pending');
		T.check(!T.cell(B, 'fallback-pending', B.file.getShadowPages()), 'pending edit silently confirmed');
		B.cacheResponse = null; b.holdNotifications = false;
		var own = await saved(B, b); cold(B, own, ['fallback', 'fallback-pending']);
	}
	async function cacheDelayed(cs, b)
	{
		var A = cs[0], B = cs[1]; b.holdNotifications = true;
		vertex(A, 'cache-late'); A.flush(); await settle(b); var receipt = await saved(A, b);
		B.cacheResponses = ['empty', 'valid']; D.deliver(b); await D.revision(B, receipt.committedRevision);
		T.check(b.requests.filter(function(r) { return r.kind == 'cache-get'; }).length == 2, 'cache readiness was not retried');
		T.check(!b.requests.some(function(r) { return r.kind == 'latest'; }), 'transient miss reloaded');
		needCell(B, 'cache-late', B.file.getShadowPages()); b.holdNotifications = false;
	}
	async function metadata(cs, b, mode, noCache)
	{
		var A = cs[0], B = cs[1]; b.holdNotifications = true;
		vertex(A, 'metadata-shape'); A.flush(); await settle(b); await saved(A, b);
		D.deliver(b); await D.revision(B, b.revision);
		var hash = A.getPagesHash();
		if (noCache) B.setOffline(true);
		if (mode == 'name') A.ui.editor.graph.model.execute(new A.win.RenamePage(A.ui, A.ui.pages[0], 'Saved name'));
		else if (mode == 'vars') vars(A, '{"owner":"saved"}');
		else if (mode == 'format') A.ui.setPageFormat(new A.win.mxRectangle(0, 0, 700, 900));
		else if (mode == 'fold') A.ui.actions.get('collapseExpand').funct();
		A.flush(); await settle(b);
		var receipt = await saved(A, b);
		T.check(A.getPagesHash() == hash, mode + ' fixture unexpectedly changes the content checksum');
		if (noCache) { B.setOffline(false); B.win.Editor.enableRealtimeCache = false; }
		D.deliver(b); await D.revision(B, receipt.committedRevision);
		var parsed = cold(A, receipt, ['metadata-shape'], mode == 'vars' ? '{"owner":"saved"}' : undefined);
		function assert(pages, fileVars, live)
		{
			if (mode == 'name') T.check(pages[0].getName() == 'Saved name', 'saved page name lost');
			if (mode == 'vars') T.check(fileVars == '{"owner":"saved"}', 'saved vars lost');
			if (mode == 'fold')
			{
				var folding = live ? B.ui.editor.graph.foldingEnabled : pages[0].viewState.foldingEnabled;
				T.check(folding === false, 'saved folding setting lost');
			}
			if (mode == 'format')
			{
				var vs = live ? B.ui.editor.graph.getViewState() : pages[0].viewState;
				T.check(vs && vs.pageFormat && vs.pageFormat.width == 700 && vs.pageFormat.height == 900, 'saved page format lost');
			}
		}
		assert(parsed.pages, parsed.vars, false);
		assert(B.file.getShadowPages(), B.file.getShadowVars(), false);
		B.cleanupNow(); await settle(b);
		assert(B.ui.pages, B.ui.fileNode.getAttribute('vars'), true);
		T.check(!b.requests.some(function(r) { return r.kind == 'fast-forward'; }), 'metadata took checksum fast-forward');
		if (noCache)
		{
			T.check(b.requests.some(function(r) { return r.kind == 'latest' && r.client == B.idx; }), 'metadata bypassed full-file fallback');
			B.win.Editor.enableRealtimeCache = true;
		}
		b.holdNotifications = false;
	}
	async function fastForward(cs, b)
	{
		var A = cs[0], B = cs[1]; b.holdNotifications = true;
		vertex(A, 'ff'); A.flush(); await settle(b); var receipt = await saved(A, b);
		B.win.Editor.enableRealtimeCache = false;
		D.deliver(b); await D.revision(B, receipt.committedRevision);
		T.check(b.requests.some(function(r) { return r.kind == 'latest' && r.client == B.idx; }), 'matching clean document bypassed full-file fallback');
		T.check(!b.requests.some(function(r) { return r.kind == 'fast-forward'; }), 'checksum-only fast-forward skipped saved bytes');
		needCell(B, 'ff', B.file.getShadowPages());
		// Dirty checksum-invisible local metadata must not be absorbed into shadow.
		vars(B, '{"local":true}');
		await saved(A, b); D.deliver(b); await D.revision(B, b.revision);
		T.check(b.requests.some(function(r) { return r.kind == 'latest' && r.client == B.idx; }), 'modified document bypassed full-file fallback');
		T.check(B.file.getShadowVars() == null, 'unsaved vars silently became confirmed');
		B.win.Editor.enableRealtimeCache = true; b.holdNotifications = false;
		var final = await saved(B, b); cold(B, final, ['ff'], '{"local":true}');
	}
	async function fastForwardMetadata(cs, b, report)
	{
		var A = cs[0], B = cs[1]; b.holdNotifications = true;
		B.setOffline(true);
		A.ui.editor.graph.model.execute(new A.win.RenamePage(A.ui, A.ui.pages[0], 'Persisted metadata'));
		A.flush(); await settle(b); var receipt = await saved(A, b);
		B.setOffline(false); B.win.Editor.enableRealtimeCache = false;
		D.deliver(b); await D.revision(B, receipt.committedRevision);
		T.check(cold(A, receipt, []).pages[0].getName() == 'Persisted metadata', 'metadata was not committed');
		if (B.ui.pages[0].getName() != 'Persisted metadata' || B.file.getShadowPages()[0].getName() != 'Persisted metadata')
			report.fail('fast-forward-metadata', 'descriptor advanced despite missing persisted page name');
		b.holdNotifications = false;
		// Full-file control repairs the fixture after recording the regression.
		await new Promise(function(resolve, reject) { B.file.updateFile(resolve, reject); });
		B.win.Editor.enableRealtimeCache = true;
	}

	async function crashAck(cs, b)
	{
		var A = cs[0], B = cs[1];
		vertex(A, 'durable-before-ack'); vars(A, '{"durable":true}'); A.flush(); await settle(b);
		A.holdSaveAck = true;
		var promise = A.save(), attempt = A.lastSaveAttempt, generation = A.generation;
		await T.waitFor('storage commit with callback held', function() { return attempt.committedRevision != null; });
		T.check(!attempt.acknowledged && A.file.savingFile, 'crash fixture already acknowledged');
		A.crash(); await A.reloadFromSave(b, false);
		A.holdSaveAck = false; attempt.ack();
		var receipt = await promise;
		T.check(receipt.status == 'committed' && !receipt.acknowledged && A.generation != generation,
			'old-frame ack was applied to a new session');
		needCell(A, 'durable-before-ack');
		cold(A, receipt, ['durable-before-ack'], '{"durable":true}');
		T.check(A.ui.fileNode.getAttribute('vars') == '{"durable":true}', 'cold reopen lost vars');
		T.check(A.ui.editor.undoManager.history.length == 0, 'crashed undo history survived');
		vertex(A, 'after-reopen'); A.flush(); await settle(b); needCell(B, 'after-reopen');
		await saved(A, b);
	}
	async function joined(cs)
	{
		await T.waitFor('P2P sessions joined', function()
		{
			return cs.every(function(c) { return c.p2p.isFileJoined() && c.p2p.getState() == 1; });
		});
	}
	async function joinThird(cs, b)
	{
		var A = cs[0], B = cs[1], C = cs[2], server = new RtHarness.FakeRtServer();
		vertex(A, 'join-base'); A.flush(); await settle(b); await saved(A, b);
		[A, B].forEach(function(c) { RtHarness.enableRealP2P(c, server); });
		await joined([A, B]);
		vertex(A, 'join-live'); A.flush();
		await T.waitFor('existing peer sees unsaved edit', function() { return !!T.cell(B, 'join-live'); });
		C.joinLate(b, false);
		var restore = T.pauseAutosaves([C]);
		try
		{
			needCell(C, 'join-base'); T.check(!T.cell(C, 'join-live'), 'fixture replayed historical live messages');
			RtHarness.enableRealP2P(C, server); await joined([C]);
			vertex(C, 'join-third'); C.flush();
			await T.waitFor('third client participates', function() { return !!T.cell(A, 'join-third') && !!T.cell(B, 'join-third'); });
			// Third-peer arrival does not promise a historical live resend. Record
			// availability separately, then require persistence after a named save.
			b.report.stats.thirdJoinBeforeSave = !!T.cell(C, 'join-live');
			var receipt = await saved(A, b); cold(A, receipt, ['join-base', 'join-live']);
			needCell(C, 'join-live', C.file.getShadowPages());
			await saved(C, b);
		}
		finally { restore(); }
	}
	async function joinFirst(cs, b)
	{
		var A = cs[0], B = cs[1], server = new RtHarness.FakeRtServer();
		vertex(A, 'first-base'); A.flush(); await settle(b); await saved(A, b);
		RtHarness.enableRealP2P(A, server); await joined([A]);
		vertex(A, 'first-live'); A.flush();
		var revision = b.revision;
		B.joinLate(b, false); var restore = T.pauseAutosaves([B]);
		try
		{
			T.check(!T.cell(B, 'first-live'), 'first peer unexpectedly got synthetic replay');
			RtHarness.enableRealP2P(B, server); await joined([B]);
			await T.waitFor('first peer receives real resend', function() { return !!T.cell(B, 'first-live'); });
			T.check(b.revision == revision, 'a save hid a missing first-peer resend');
			await saved(A, b);
		}
		finally { restore(); }
	}
	async function crossPage(cs, b, mode, report)
	{
		var A = cs[0], B = cs[1], ga = A.ui.editor.graph, gb = B.ui.editor.graph;
		var source = vertex(A, 'reach-source'), target = vertex(A, 'reach-target');
		A.flush(); await settle(b); await saved(A, b); A.ui.editor.undoManager.clear();
		ga.removeCells([target], false); A.flush(); await settle(b);
		A.ui.actions.get('undo').funct(); A.flush(); await settle(b);
		gb.insertEdge(null, 'reach-edge', '', T.cell(B, 'reach-source'), T.cell(B, 'reach-target'));
		B.flush(); await settle(b);
		var um = A.ui.editor.undoManager, idx = um.indexOfNextAdd;
		if (mode == 'api') A.ui.selectPage(A.ui.pages[1], true);
		if (mode == 'tab')
		{
			var tab = A.win.document.querySelector('.gePageTab[title*="(page-b)"]');
			T.check(tab, 'ordinary page tab missing');
			['mousedown', 'mouseup', 'click'].forEach(function(type)
			{
				tab.dispatchEvent(new A.win.MouseEvent(type, {bubbles: true, button: 0}));
			});
			T.check(A.ui.currentPage.getId() == 'page-b', 'page-tab handler did not navigate');
			T.check(!um.canRedo(), 'ordinary navigation unexpectedly preserved the delete redo');
			A.ui.actions.get('undo').funct();
			T.check(T.cell(A, 'reach-target'), 'undo navigation deleted the terminal');
			return;
		}
		T.check(um.canRedo() && um.indexOfNextAdd == idx, 'fixture lost the redo before exercise');
		A.ui.actions.get('redo').funct(); A.flush(); await settle(b);
		T.check(!T.cell(A, 'reach-target'), 'redo did not delete the terminal');
		A.ui.actions.get('undo').funct(); A.flush(); await settle(b);
		cs.forEach(function(c)
		{
			var e = T.cell(c, 'reach-edge');
			if (!e || !e.target || e.target.getId() != 'reach-target')
				report.fail('cross-page-connection', mode + ': undo failed to restore collaborator edge target on ' + c.name);
		});
	}
	async function socketNotify(cs, b)
	{
		var server = new RtHarness.FakeRtServer(), notifications = 0;
		var send = server.onSend;
		server.onSend = function(ws, str)
		{
			var data = JSON.parse(str);
			if (data.action == 'message')
			{
				var message = JSON.parse(data.msg);
				if (message.bytes) message = ws.owner.sync.stringToObject(message.bytes);
				if (message.type == 'notify') notifications++;
			}
			return send.apply(this, arguments);
		};
		cs.forEach(function(c)
		{
			c.win.Editor.p2pSyncNotify = true;
			RtHarness.enableRealP2P(c, server);
		});
		await T.waitFor('socket sessions joined', function()
		{
			return cs.every(function(c) { return c.p2p.isFileJoined() && c.p2p.getState() == 1; });
		});
		vertex(cs[0], 'socket-saved'); cs[0].flush();
		var receipt = await saved(cs[0], b);
		b.report.stats.socketNotifications = notifications;
		T.check(notifications > 0, 'save did not traverse real P2PCollab.sendNotification');
		needCell(cs[1], 'socket-saved', cs[1].file.getShadowPages());
		cold(cs[0], receipt, ['socket-saved']);
		T.check(b.requests.some(function(r) { return r.kind == 'cache-get' && r.client == 1; }), 'socket notification bypassed catchup');
	}

	async function optimistic(cs, b, report, afterCommit, deferred)
	{
		var A = cs[0], B = cs[1];
		b.holdNotifications = true;
		var completing = null;
		if (deferred)
		{
			B.holdSaveAck = deferred == 'success';
			B.holdSaveCommit = deferred == 'failure';
			completing = B.save();
			await T.waitFor('receiver HTTP write held', function() { return !!B.lastSaveAttempt.commit; });
			if (deferred == 'success')
			{
				await T.waitFor('receiver committed without ack', function() { return !!B.lastSaveAttempt.ack; });
				D.deliver(b, null, [A]);
				await T.waitFor('sender reads receiver commit', function() { return A.file.getCurrentEtag() == 'etag-1'; });
			}
		}
		vertex(A, 'optimistic-saved'); A.flush(); await settle(b);
		A.holdSaveCommit = true;
		var saving = A.save();
		await T.waitFor('real OneDrive HTTP PUT', function() { return !!A.lastSaveAttempt.commit; });
		T.check(A.file instanceof A.win.OneDriveFile && A.file.isOptimisticSync(), 'not a real OneDrive file');
		T.check(b.notifications.length > 0, 'fileSaving did not emit its optimistic notification');
		if (!afterCommit)
		{
			var requestStart = b.requests.length, precommitRevision = b.revision;
			D.deliver(b);
			if (deferred)
			{
				T.check(B.file.savingFile && B.sync.remoteFileChanged, 'notification was not deferred during receiver save');
				if (deferred == 'success') B.lastSaveAttempt.ack();
				else B.lastSaveAttempt.fail();
				var completed = await completing;
				T.check(completed.status == (deferred == 'success' ? 'committed' : 'failed'), 'receiver save outcome did not match');
				// The caller of OneDriveFile.save owns status/error completion.
				if (deferred == 'success') B.file.handleFileSuccess(true);
				else B.file.handleFileError({code: 500, message: 'injected OneDrive write failure'});
				B.holdSaveAck = B.holdSaveCommit = false;
			}
			// Observe a completed read of the OLD revision before releasing
			// storage. A deferred notification must retain the retry hint;
			// merely doing its first read after the commit would hide loss.
			await T.waitFor('completed precommit read', function()
			{
				return b.requests.slice(requestStart).some(function(r)
				{
					return r.client == B.idx && r.kind == 'onedrive-latest' &&
						r.revision == precommitRevision && r.completed;
				});
			});
		}
		await A.lastSaveAttempt.commit(); A.holdSaveCommit = false;
		if (afterCommit) D.deliver(b);
		var receipt = await saving; cold(A, receipt, ['optimistic-saved']);
		try
		{
			await T.waitFor('optimistic notification retries until committed revision', function()
			{
				return B.file.getCurrentEtag() == A.file.getCurrentEtag();
			}, 6000, function() { return b.requests; });
			needCell(B, 'optimistic-saved', B.file.getShadowPages());
		}
		catch (e) { report.fail('optimistic-notify', e.message); }
		b.holdNotifications = false;
		// An explicit later refresh is a separate control, never the regression verdict above.
		await new Promise(function(resolve, reject) { B.sync.fileChanged(resolve, reject); });
	}

	// The host-side save loop that every EmbedFile integration implements
	// (plugins/cConf-1-4-8.js, monday.js, nextcloud.js and OneDriveFile):
	// a conflict hands control to sync.fileConflict(desc, retry, giveUp),
	// the retry re-issues the identical save and the error callback
	// surfaces the timeout to the user and abandons the save.
	function hostConflict(c)
	{
		return new Promise(function(resolve)
		{
			c.file.inConflictState = true;
			c.file.savingFile = true;
			c.sync.fileConflict(null, function()
			{
				c.file.savingFile = false;
				resolve({outcome: 'retry'});
			}, function(err)
			{
				c.file.savingFile = false;
				resolve({outcome: 'giveUp', err: err});
			});
		});
	}

	// The retry budget of a conflict episode must not be consumed by
	// conflicts of EARLIER, fully recovered episodes. catchupRetryCount
	// is reset in DrawioFileSync.fileSaved, which DrawioFile.fileSaved
	// skips for an optimistic-sync file, so for those files it counts
	// the lifetime conflicts of the session and the maxCatchupRetries-th
	// conflict is refused with ERROR_TIMEOUT without any catchup.
	async function conflictBudget(cs, b, report, optimistic)
	{
		var A = cs[0];
		A.file.isOptimisticSync = function() { return optimistic; };
		A.sync.maxCatchupRetries = 3;
		vertex(A, 'budget-base'); A.flush(); await settle(b);
		await saved(A, b);
		var episodes = [];

		for (var i = 0; i < A.sync.maxCatchupRetries; i++)
		{
			// One isolated conflict, fully recovered by the retry.
			A.nextSaveFailure = 'conflict';
			var rejected = await A.save();
			T.check(rejected.status == 'conflict', A.name +
				' expected an injected conflict, got ' + rejected.status);
			var episode = await hostConflict(A);
			var entry = {episode: i + 1, outcome: episode.outcome,
				code: episode.err && episode.err.code,
				usedBeforeSave: A.sync.catchupRetryCount};
			episodes.push(entry);

			if (episode.outcome == 'retry')
			{
				vertex(A, 'budget-' + i); A.flush(); await settle(b);
				await saved(A, b);
			}

			entry.usedAfterSave = A.sync.catchupRetryCount;
		}

		report.stats.conflictBudget = {optimistic: optimistic,
			maxCatchupRetries: A.sync.maxCatchupRetries, episodes: episodes};
		var carried = episodes.filter(function(e) { return e.usedAfterSave != 0; });
		var refused = episodes.filter(function(e) { return e.outcome != 'retry'; });
		T.check(carried.length == 0, A.name + ' carried the retry budget of a ' +
			'RECOVERED conflict into the next episode: ' + JSON.stringify(episodes));
		T.check(refused.length == 0, A.name + ' refused an isolated conflict ' +
			'without attempting a catchup: ' + JSON.stringify(episodes));
	}

	async function run(cs, b, report, ctx)
	{
		var restore = T.pauseAutosaves(cs.filter(function(c) { return c.file; }));
		var name = ctx.config.scenario;
		report.stats.phaseAutosaves = 'held until scripted phases finish';
		try
		{
			if (name.indexOf('optimistic-notify') == 0) await optimistic(cs, b, report, name == 'optimistic-notify-after-commit',
				name == 'optimistic-notify-save-success' ? 'success' : name == 'optimistic-notify-save-failure' ? 'failure' : null);
			else if (name == 'notify-socket') await socketNotify(cs, b);
			else if (name == 'save-outcomes') await saveOutcomes(cs, b, report);
			else if (name == 'conflict-budget-optimistic') await conflictBudget(cs, b, report, true);
			else if (name == 'conflict-budget-cached') await conflictBudget(cs, b, report, false);
			else if (name.indexOf('notify-save-') == 0) await notifySave(cs, b, name.substring(12));
			else if (name == 'notify-order' || name == 'cache-range-catchup') await cacheRange(cs, b, name);
			else if (name.indexOf('cache-fallback-') == 0) await cacheFallback(cs, b, name.substring(15));
			else if (name == 'cache-delayed') await cacheDelayed(cs, b);
			else if (name.indexOf('metadata-no-cache-') == 0) await metadata(cs, b, name.substring('metadata-no-cache-'.length), true);
			else if (name.indexOf('metadata-') == 0) await metadata(cs, b, name.substring(9));
			else if (name == 'descriptor-fast-forward-metadata') await fastForwardMetadata(cs, b, report);
			else if (name == 'descriptor-fast-forward') await fastForward(cs, b);
			else if (name == 'crash-commit-no-ack') await crashAck(cs, b);
			else if (name == 'join-first-peer-resend') await joinFirst(cs, b);
			else if (name == 'join-third-no-replay') await joinThird(cs, b);
			else if (name.indexOf('undo-connection-') == 0) await crossPage(cs, b, name.substring(16), report);
			else throw new Error('Unknown coverage scenario ' + name);
		}
		finally
		{
			restore();
			report.stats.storage = b.attempts.map(function(a)
			{
				return {attempt: a.id, status: a.status, revision: a.committedRevision,
					sha256: a.sha256, acknowledged: a.acknowledged};
			});
			report.stats.requests = b.requests || [];
		}
	}
	return {run: run};
})();
