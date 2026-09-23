/** Real v6 receive/codec regression. The runner pins the WHOLE historical app. */
var RtRollout = (function()
{
	'use strict';
	var V6 = 'c6c7ce5b31bb7b1f1377f97a9e25d4b94be0c073';
	function check(value, message) { if (!value) throw new Error(message); }
	function value(c, id, pages)
	{
		var cell = RtTestBackend.cell(c, id, pages);
		return cell == null ? null : cell.value;
	}

	async function oldCatchup(A, B, scenario)
	{
		var outcome = {reloads: 0, fastForwards: 0, merges: 0, requests: 0, redirects: 0};
		var sync = Object.create(B.win.DrawioFileSync.prototype);
		sync.file = {stats: {bytesReceived: 0, cacheFail: 0, cacheMiss: 0, cacheHits: 0},
			getCurrentRevisionId: function() { return 1; },
			getDescriptorRevisionId: function() { return 2; },
			getDescriptorChecksum: function() { return scenario == 'matching-checksum' ? 123 : 456; },
			getDescriptorSecret: function() { return 'public-test-secret'; },
			redirectToNewApp: function() { outcome.redirects++; }};
		sync.ui = {pages: [], getHashValueForPages: function() { return 123; }, timeout: 1000};
		sync.isValidState = function() { return true; };
		sync.scheduleCleanup = function() {};
		sync.channelId = 'synthetic-rollout';
		sync.maxCacheReadyRetries = 0;
		sync.cacheReadyDelay = 0;
		sync.key = B.sync.key;
		sync.fastForward = function() { outcome.fastForwards++; };
		sync.reload = function(ok) { outcome.reloads++; if (ok) ok(); };
		sync.merge = function() { outcome.merges++; };
		var cache = B.win.Editor.enableRealtimeCache, get = B.win.mxUtils.get;
		B.win.Editor.enableRealtimeCache = scenario != 'cache-off';
		var cached = A.sync.objectToString(A.sync.createMessage({patch: {}, checksum: 456,
			label: scenario == 'cache-bad-percent' ? '100%' : 'café'}));
		B.win.mxUtils.get = function(url, ok)
		{
			outcome.requests++;
			ok({getStatus: function() { return scenario == 'cache-503' ? 503 : 200; },
				getText: function() { return JSON.stringify([cached]); }});
		};
		try
		{
			await new Promise(function(ok, fail)
			{
				var timer = window.setTimeout(function() { fail(new Error('Old catchup timeout: ' + scenario)); }, 3000);
				sync.catchup({revision: 2}, function() { window.clearTimeout(timer); ok(); },
					function(e) { window.clearTimeout(timer); fail(e); });
			});
		}
		finally { B.win.mxUtils.get = get; B.win.Editor.enableRealtimeCache = cache; }
		check(outcome.redirects == 0 && outcome.merges == 0, 'Old catchup must not upgrade or merge v7: ' + scenario);
		check(scenario == 'matching-checksum' ? outcome.fastForwards == 1 && outcome.requests == 0 :
			outcome.reloads == 1, 'Old catchup fallback: ' + scenario);
		return outcome;
	}

	async function run(clients, broker, report, params)
	{
		var A = clients[0], B = clients[1], C = clients[2];
		check(B.win.DrawioFileSync.PROTOCOL == 6 &&
			typeof B.win.DrawioFileSync.prototype.handleRemoteMessage == 'undefined',
			'Historical fixture must contain the real old receiver');
		check(B.sync.createMessage({}).d != null && A.sync.createMessage({}).p != null,
			'Historical and candidate envelope identities');
		report.stats.historicalSource = V6;
		var encrypted = params.encrypted != '0';
		report.stats.encrypted = encrypted;
		// These are explicit schedule tests. Keep production receive batching in
		// --timing real, but hold automatic saves while asserting live isolation.
		RtTestBackend.pauseAutosaves(clients);
		clients.forEach(function(c)
		{
			c.ui.selectPage(c.ui.pages[0], true);
			c.win.Editor.enableRealtimeCache = false;
			if (encrypted) c.sync.key = 'public-rollout-regression-key';
			c.fallbacks = 0; c.redirects = 0; c.decodes = 0;
			c.sync.fileChangedNotify = function() { c.fallbacks++; };
			c.file.redirectToNewApp = function() { c.redirects++; this.redirectDialogShowing = true; };
			var decode = c.sync.stringToObject;
			c.sync.stringToObject = function(data) { c.decodes++; return decode.call(this, data); };
		});
		// Never bypass the protocol boundary by delivering a broker save patch
		// directly to the historical merge. Persist the real serialized bytes.
		broker.sendSave = function() { broker.revision++; };
		var server = new RtHarness.FakeRtServer();
		report.stats.socketFrames = 0;
		var onSend = server.onSend;
		server.onSend = function(ws, data)
		{
			report.stats.socketFrames++;
			return onSend.call(this, ws, data);
		};
		RtHarness.enableRealP2P(B, server);
		await RtTestBackend.waitFor('old socket open', function() { return B.p2p.isFileJoined(); });
		RtHarness.enableRealP2P(A, server);
		RtHarness.enableRealP2P(C, server);
		await RtTestBackend.waitFor('candidate sockets open', function()
		{
			return A.p2p.isFileJoined() && C.p2p.isFileJoined();
		});
		check(new URL(A.socketUrls[0]).searchParams.get('pv') == '7', 'Join advertises protocol');
		check(new URL(B.socketUrls[0]).searchParams.get('pv') == null, 'Old join has no protocol');

		var labels = ['ASCII', 'café 漢字 😀', '100%', '%41', '%20', '%25', '%C3%A9', '%E9', '%22', '%5C'];
		for (var i = 0; i < labels.length; i++)
		{
			var id = 'rollout_' + i, before = B.decodes;
			A.ui.editor.graph.insertVertex(null, id, labels[i], 40 + i * 10, 40, 80, 40);
			A.flush();
			await RtTestBackend.waitFor('both socket deliveries ' + id, function()
			{
				return B.decodes > before && value(C, id) === labels[i];
			});
			check(value(B, id) == null, 'v6 applied candidate live content: ' + labels[i]);
		}
		check(B.redirects == 0, 'Old socket does not implement an upgrade prompt');
		// Candidate saved bytes keep the exact intent despite incompatible peers.
		await RtTestBackend.mustCommit(A, 0);
		var saved = RtTestBackend.parse(A, broker.lastSavedData);
		labels.forEach(function(label, i)
		{
			check(value(A, 'rollout_' + i, saved.pages) === label, 'Saved label changed: ' + label);
			check(value(B, 'rollout_' + i, RtTestBackend.parse(B, broker.lastSavedData).pages) === label,
				'Old full-file codec changed a saved label');
		});

		// Socket notifications fail closed under the p envelope, even without cache.
		for (var cache of [false, true])
		{
			A.win.Editor.enableRealtimeCache = cache;
			A.win.Editor.p2pSyncNotify = true;
			var decodes = B.decodes, fallbacks = B.fallbacks;
			A.sync.notify(A.sync.createMessage({m: Date.now()}));
			await RtTestBackend.waitFor('socket notification decode', function() { return B.decodes > decodes; });
			check(B.fallbacks == fallbacks && B.redirects == 0, 'v6 dispatched a candidate socket notification');
		}
		// Cache listener checks v before looking for d, if decoding succeeds.
		B.sync.isConnected = function() { return true; };
		for (var text of ['café 漢字 😀', '%41', '100%', '%22'])
		{
			B.file.redirectDialogShowing = false;
			var redirects = B.redirects, fallbacks = B.fallbacks;
			B.sync.changeListener(A.sync.objectToString(A.sync.createMessage({label: text})));
			var decodable = text == 'café 漢字 😀' || text == '%41';
			check(B.redirects - redirects == (decodable ? 1 : 0), 'Cache gate/decode order: ' + text);
			check(B.fallbacks - fallbacks == (decodable ? 0 : 1), 'Cache failure fallback: ' + text);
		}
		B.file.redirectDialogShowing = false;

		report.stats.oldCatchup = {};
		for (var scenario of ['matching-checksum', 'cache-off', 'cache-v7', 'cache-bad-percent', 'cache-503'])
		{
			report.stats.oldCatchup[scenario] = await oldCatchup(A, B, scenario);
		}

		// Real old encoding reaches the candidate gate and falls back to file sync.
		var notified = A.fallbacks;
		B.ui.editor.graph.insertVertex(null, 'old-only', 'old café 100%', 40, 120, 80, 40);
		B.flush();
		await RtTestBackend.waitFor('v7 rejects old source', function() { return A.fallbacks > notified; });
		check(value(A, 'old-only') == null, 'Candidate applied a v6 live diff');

		// Red proof: a d-envelope reaches the very same old receiver and corrupts
		// percent text. This control must stay isolated from the safe save above.
		var patch = {u: {}};
		patch.u[B.ui.currentPage.getId()] = {cells: {i: [{id: 'red-proof', vertex: 1,
			parent: '1', value: '%41', geometry: '<mxGeometry x="40" y="160" width="80" height="40"/>'}]}};
		A.p2p.sendDiff({v: 7, d: {a: 'change', c: [patch], id: 'red-proof'}});
		await RtTestBackend.waitFor('real old unsafe control', function() { return value(B, 'red-proof') === 'A'; });
		B.ui.editor.graph.getModel().setStyle(RtTestBackend.cell(B, 'red-proof'), 'fillColor=#ff0000;');
		B.flush();
		// Read serialized bytes rather than relying on agreement/checksums.
		B.file.updateFileData();
		check(value(B, 'red-proof', RtTestBackend.parse(B, B.file.getData()).pages) === 'A',
			'Old source red proof must reach persisted representation');

		// Server rejection preserves dirty content, stops retries and blocks the
		// real base save entry point (the provider double overrides file.save).
		A.win.Editor.enableRealtimeCache = false;
		A.ui.editor.graph.insertVertex(null, 'pending-export', 'keep me', 40, 200, 80, 40);
		var entry = server.sockets.find(function(e) { return e.ws.owner === A; });
		server.deliver(entry, {action: 'admission', msg: {minProtocol: 7, minAppVersion: '31.2.0'}});
		await RtTestBackend.waitFor('app floor delivered', function() { return A.sync.minRemoteAppVersion === '31.2.0'; });
		server.deliver(entry, {action: 'admission', msg: {minProtocol: 7, minAppVersion: null}});
		await RtTestBackend.waitFor('app floor cleared', function() { return A.sync.minRemoteAppVersion == null; });
		var cancel = null, confirm = A.ui.confirm;
		A.ui.confirm = function(msg, onCancel) { cancel = onCancel; };
		A.file.redirectToNewApp = A.win.DrawioFile.prototype.redirectToNewApp;
		server.deliver(entry, {action: 'upgradeRequired', msg: {minProtocol: 8}});
		await RtTestBackend.waitFor('upgrade latch', function() { return A.file.appUpgradeRequired; });
		check(A.file.isModified() && value(A, 'pending-export') === 'keep me', 'Upgrade discarded unsaved edits');
		check(typeof cancel == 'function', 'Dirty upgrade must offer cancellation');
		cancel(); // Actual dialog cancellation callback, keeping export available
		A.ui.confirm = confirm;
		check(!A.file.redirectDialogShowing && A.file.isModified(), 'Cancellation discarded dirty state');
		var saves = 0, denied = 0;
		A.win.DrawioFile.prototype.save.call(A.file, false, function() { saves++; }, function() { denied++; }, false, true);
		check(saves == 0 && denied == 1, 'Canceled upgrade/overwrite bypassed save guard');
		check(value(A, 'pending-export', RtTestBackend.parse(A, A.ui.getFileData(true)).pages) === 'keep me',
			'Pending document remains exportable');
		check(!A.sync.isValidState(), 'Canceled upgrade resumed file synchronization');
		var joins = A.socketUrls.length;
		A.p2p.joinFile(true);
		entry.ws.dispatch('close', {code: 4001});
		A.win.dispatchEvent(new A.win.Event('focus'));
		check(A.socketUrls.length == joins, 'Rejected client rejoined on focus or explicit retry');
		// Compatible v7 peer is still able to edit after the rejected tab stops.
		check(!C.file.appUpgradeRequired, 'Upgrade leaked to a different client');
		// A close frame alone is sufficient even if the preceding notice is lost.
		// Cover a save already waiting for fonts and a queued receive batch.
		var resume = null, prepared = 0, deniedPending = 0, received = 0;
		C.file.loadFonts = function(next) { resume = next; };
		C.win.DrawioFile.prototype.save.call(C.file, false, function() { prepared++; },
			function() { deniedPending++; });
		check(typeof resume == 'function', 'Save did not enter asynchronous preparation');
		C.sync.doReceiveRemoteChanges = function() { received++; };
		C.sync.receiveRemoteChanges({c: [{}], id: 'queued-before-upgrade'});
		var cEntry = server.sockets.find(function(e) { return e.ws.owner === C; });
		cEntry.ws.dispatch('close', {code: 4001});
		check(C.file.appUpgradeRequired, 'Close-only rejection did not stop the client');
		resume();
		check(prepared == 0 && deniedPending == 1, 'Upgrade during save preparation reached provider callback');
		await RtTestBackend.waitFor('rejected receive batch cleared', function() { return !C.sync.receivedData; });
		check(received == 0, 'Queued patch mutated the document after rejection');
		clients.forEach(function(c) { check(c.errors.length == 0, c.name + ' app errors: ' + c.errors.join('; ')); });
	}
	return {run: run};
})();
