/** Test-only storage boundary. Application synchronization methods stay real. */
var RtTestBackend = (function()
{
	'use strict';

	function copy(value) { return value == null ? value : JSON.parse(JSON.stringify(value)); }
	function check(value, message) { if (!value) throw new Error(message); }
	function delay(ms) { return new Promise(function(resolve) { window.setTimeout(resolve, ms); }); }

	async function waitFor(label, predicate, timeout, state)
	{
		var end = Date.now() + (timeout == null ? 5000 : timeout);
		do
		{
			if (await predicate()) return;
			await delay(10);
		} while (Date.now() < end);
		throw new Error('Timeout waiting for ' + label + ': ' +
			JSON.stringify(state != null ? state() : null));
	}

	function state(broker)
	{
		return {revision: broker.revision, deliveries: broker.pending,
			queues: broker.queues.map(function(q) { return q.length; }),
			clients: broker.clients.map(function(c)
			{
				return {name: c.name, revision: c.knownRevision, saving: c.file && c.file.savingFile,
					conflict: c.file && c.file.inConflictState, batch: !!(c.sync && c.sync.receivedData),
					merging: c.merging, queue: (c.mergeQueue || []).length,
					local: c.sync && c.sync.localFileWasChanged, io: c.testIo || 0};
			})};
	}

	async function drain(broker)
	{
		await waitFor('released deliveries and receive/merge completion', async function()
		{
			await broker.drain();
			return !broker.hasPending() && !broker.pending && broker.clients.every(function(c)
			{
				return !c.sync || (!c.sync.receivedData && !c.merging && !(c.mergeQueue || []).length);
			});
		}, 30000, function() { return state(broker); });
	}

	function pauseAutosaves(clients)
	{
		var restores = clients.map(function(c)
		{
			var f = c.file, old = f.autosave;
			c.win.clearTimeout(f.autosaveThread);
			f.autosaveThread = null;
			f.autosave = function() {};
			return function() { if (c.file === f) f.autosave = old; };
		});
		return function() { restores.forEach(function(f) { f(); }); };
	}

	function parse(client, data)
	{
		var root = client.win.mxUtils.parseXml(data).documentElement;
		root = client.ui.editor.extractGraphModel(root, true, true) || root;
		return {pages: client.ui.getPagesForNode(root, null, true),
			vars: root.nodeName == 'mxfile' ? root.getAttribute('vars') : null};
	}

	// Read-only traversal: constructing a model around a live foreign root can rename cells.
	function cell(client, id, pages)
	{
		var found = null;
		function walk(c)
		{
			if (c.getId() == id) found = c;
			for (var i = 0; i < c.getChildCount(); i++) walk(c.getChildAt(i));
		}
		(pages || client.ui.pages).forEach(function(p) { client.ui.updatePageRoot(p); walk(p.root); });
		return found;
	}

	async function digest(data)
	{
		var bytes = await window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(data));
		return Array.from(new Uint8Array(bytes)).map(function(b) { return b.toString(16).padStart(2, '0'); }).join('');
	}

	function summary(a)
	{
		return {attempt: a.id, status: a.status, baseRevision: a.baseRevision,
			committedRevision: a.committedRevision, sha256: a.sha256,
			acknowledged: a.acknowledged, generation: a.generation};
	}

	function install(client, broker, xml)
	{
		var file = client.file, sync = client.sync;
		client.generation = (client.generation || 0) + 1;
		broker.commits = broker.commits || Object.create(null);
		broker.attempts = broker.attempts || [];
		if (!broker.commits[0]) broker.commits[0] = {revision: 0, data: xml};
		broker.report.stats.backend = broker.backend || 'direct';
		broker.report.stats.timers = {profile: RtHarness.realTiming ? 'real' : 'controlled',
			grace: sync.remoteGraceDelay, receive: sync.syncReceiveMessageDelay,
			flush: sync.syncSendMessageDelay, cleanup: sync.cleanupDelay, autosave: file.autosaveDelay};
		if (broker.backend == 'onedrive')
		{
			RtDescriptorBackend.installOneDrive(client, broker, xml);
			return;
		}
		file.save = function(revision, success, error)
		{
			var a = {id: broker.attempts.length + 1, status: 'started',
				baseRevision: client.knownRevision || 0, committedRevision: null,
				acknowledged: false, generation: client.generation};
			broker.attempts.push(a);
			client.lastSaveAttempt = a;
			var ended = false;
			var timer = window.setTimeout(function() { finish('timeout', {message: 'save outcome timed out'}); },
				client.saveTimeout || (client.saveLatency || 0) + 5000);
			function finish(status, err)
			{
				if (ended) return;
				ended = true;
				window.clearTimeout(timer);
				if (status == 'timeout' && !client.expectSaveTimeout)
					broker.report.fail('save-timeout', client.name + ': ' + JSON.stringify(state(broker)));
				a.status = status;
				var counts = broker.report.stats.saveOutcomes || (broker.report.stats.saveOutcomes = {});
				counts[status] = (counts[status] || 0) + 1;
				broker.report.log('save-outcome ' + client.name + ' ' + JSON.stringify(summary(a)));
				if (err == null) { if (success) success(summary(a)); }
				else if (error) { err.rtOutcome = summary(a); error(err); }
			}
			if (file.savingFile) { finish('busy', {message: 'busy'}); return; }
			if (client.nextSaveNoop)
			{
				client.nextSaveNoop = false; finish('noop', null); return;
			}
			file.savingFile = true;
			var failure = client.nextSaveFailure;
			client.nextSaveFailure = null;
			if (client.transient403 || client.revokeWrite)
			{
				client.transient403 = false;
				file.savingFile = false;
				var denied = {code: 403, message: 'injected permission error'};
				file.handleFileError(denied);
				finish('failed', denied);
				return;
			}
			if (a.baseRevision != broker.revision)
			{
				file.savingFile = false; file.inConflictState = true;
				finish('conflict', {code: 412, message: 'stale revision (412)'});
				return;
			}
			file.updateFileData();
			a.data = file.getData();
			var saved = parse(client, a.data);
			var patch = client.ui.diffPages(file.getShadowPages(), saved.pages);
			if (saved.vars !== file.getShadowVars()) patch[client.win.EditorUi.DIFF_FILE] = {vars: saved.vars};
			var checksum = client.ui.getHashValueForPages(saved.pages);
			var oldDesc = copy(file.getDescriptor());
			broker.report.log('save-serialized ' + client.name + ' attempt=' + a.id);
			client.saveCount = (client.saveCount || 0) + 1;
			if (client.saveFailEvery > 0 && client.saveCount % client.saveFailEvery == 0) failure = 'failed';
			if (broker.backend == 'descriptor') sync.fileSaving();
			a.ack = function()
			{
				if (ended) return;
				if (client.file !== file || client.generation != a.generation)
				{
					finish('committed', null); // Durable, but no old-frame callback is run.
					return;
				}
				file.savingFile = false;
				file.setModified(false);
				client.knownRevision = a.committedRevision;
				if (broker.backend == 'descriptor') file.setDescriptor(copy(broker.commits[a.committedRevision].desc));
				file.fileSaved(a.data, oldDesc, function()
				{
					a.acknowledged = true;
					if (broker.backend == 'descriptor') file.handleFileSuccess(true);
					finish('committed', null);
				}, function(err)
				{
					broker.report.fail('save-error', client.name + ': ' + String(err && err.message));
					finish('failed', err || {message: 'fileSaved failed'});
				},
					broker.backend == 'descriptor' ? 'test-token' : null);
			};
			a.commit = async function()
			{
				if (a.committing || ended) return;
				a.committing = true;
				a.sha256 = await digest(a.data);
				if (ended) return;
				if (failure || broker.revision != a.baseRevision)
				{
					var conflict = !failure || failure == 'conflict';
					file.savingFile = false;
					file.inConflictState = conflict;
					var err = {code: conflict ? 412 : 500, message: conflict ? 'stale revision (412)' : 'injected save failure'};
					if (broker.backend == 'descriptor' && !conflict) file.handleFileError(err);
					finish(conflict ? 'conflict' : 'failed', err);
					return;
				}
				broker.lastSavedData = a.data;
				if (broker.backend == 'descriptor') broker.revision++;
				else broker.sendSave(client.idx, JSON.stringify(patch), checksum);
				a.committedRevision = broker.revision;
				broker.lastSaver = client.idx;
				broker.commits[broker.revision] = {revision: broker.revision, data: a.data,
					sha256: a.sha256, attempt: a.id, desc: {revision: broker.revision,
					etag: 'etag-' + broker.revision, checksum: checksum, secret: 'test-secret',
					modified: Date.now(), editable: true}};
				broker.report.stats.saves++;
				broker.report.log('save-commit ' + client.name + ' ' + JSON.stringify(summary(a)));
				if (!client.holdSaveAck) a.ack();
			};
			if (!client.holdSaveCommit)
			{
				window.setTimeout(function() { a.commit().catch(function(e)
				{
					broker.report.fail('save-exception', client.name + ': ' + e.message);
					finish('failed', e);
				}); }, client.saveLatency || 0);
			}
		};

		if (broker.backend == 'descriptor') installDescriptor(client, broker, xml);
	}

	function save(client, latency)
	{
		client.saveLatency = latency || 0;
		return new Promise(function(resolve)
		{
			client.file.save(false, resolve, function(err)
			{
				resolve(err && err.rtOutcome || {status: 'failed', error: String(err)});
			});
		});
	}

	async function mustCommit(client, latency)
	{
		var result = await save(client, latency);
		check(result && result.status == 'committed' && result.committedRevision != null,
			client.name + ' required a commit: ' + JSON.stringify(result));
		var committed = client.broker.commits[result.committedRevision];
		check(committed && committed.attempt == result.attempt && committed.sha256 == result.sha256,
			'Commit receipt does not identify the stored revision');
		check(await digest(committed.data) == result.sha256, 'Committed bytes do not match their receipt');
		return result;
	}

	// Installed below; only these scenarios opt in to descriptor-driven storage.
	function installDescriptor(client, broker, xml)
	{
		RtDescriptorBackend.install(client, broker, xml);
	}

	return {install: install, save: save, mustCommit: mustCommit, waitFor: waitFor,
		drain: drain, state: state, pauseAutosaves: pauseAutosaves, parse: parse,
		cell: cell, check: check, copy: copy, digest: digest};
})();
