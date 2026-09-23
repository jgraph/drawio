/** Descriptor/cache fixtures. The application owns notification, catchup and merge. */
var RtDescriptorBackend = (function()
{
	'use strict';
	var copy = RtTestBackend.copy;

	function install(c, b, xml)
	{
		var w = c.win, f = c.file, s = c.sync;
		b.cache = b.cache || Object.create(null);
		b.notifications = b.notifications || [];
		b.requests = b.requests || [];
		c.testIo = 0;
		c.descriptor = copy(b.commits[b.revision].desc || {revision: 0, etag: 'etag-0',
			checksum: c.ui.getHashValueForPages(c.ui.pages), secret: 'test-secret', modified: 1, editable: true});
		c.knownRevision = c.descriptor.revision;
		w.Editor.enableRealtimeCache = true;
		w.Editor.p2pSyncNotify = false;
		// Cache health is an HTTP boundary too; route its probe locally below.
		w.EditorUi.cacheUrl = '/rt-fixture-cache';
		s.cacheReadyDelay = RtHarness.realTiming ? s.cacheReadyDelay : 20;
		f.getDescriptor = function() { return c.descriptor; };
		f.setDescriptor = function(d) { c.descriptor = copy(d); c.knownRevision = d.revision; };
		f.patchDescriptor = function(d, patch)
		{
			Object.keys(patch).forEach(function(k) { d[k] = patch[k]; });
			c.knownRevision = d.revision;
		};
		f.getDescriptorRevisionId = function(d) { return d && d.revision; };
		f.setDescriptorRevisionId = function(d, r) { d.revision = r; };
		f.getDescriptorEtag = function(d) { return d && d.etag; };
		f.getDescriptorChecksum = function(d) { return d && d.checksum; };
		f.getDescriptorSecret = function(d) { return d && d.secret; };
		f.getLastModifiedDate = function() { return new w.Date(c.descriptor.modified); };
		f.loadPatchDescriptor = f.loadDescriptor = function(success)
		{
			var d = copy(b.commits[b.revision].desc || c.descriptor);
			b.requests.push({kind: 'descriptor', client: c.idx, revision: d.revision});
			later(function() { success(d); });
		};
		f.getLatestVersion = function(success)
		{
			var record = b.commits[b.revision];
			b.requests.push({kind: 'latest', client: c.idx, revision: record.revision, sha256: record.sha256});
			later(function()
			{
				var pages = RtTestBackend.parse(c, record.data).pages;
				success({initialData: record.data, getShadowPages: function() { return pages; },
					getDescriptor: function() { return copy(record.desc); },
					getCurrentRevisionId: function() { return record.revision; }});
			});
		};
		// Replace the legacy harness reload shortcut with production reload/updateFile.
		s.reload = function()
		{
			b.report.stats.reloads = (b.report.stats.reloads || 0) + 1;
			return w.DrawioFileSync.prototype.reload.apply(this, arguments);
		};
		var merge = s.merge;
		s.merge = function(patches)
		{
			b.requests.push({kind: 'merge', client: c.idx, patches: patches.length});
			return merge.apply(this, arguments);
		};
		var fastForward = s.fastForward;
		s.fastForward = function(d)
		{
			b.requests.push({kind: 'fast-forward', client: c.idx, revision: d.revision});
			return fastForward.apply(this, arguments);
		};
		// A connected notification service, with delivery under scenario control.
		s.pusher = {connection: {state: 'connected', bind: function() {}, unbind: function() {}},
			unsubscribe: function() {}, disconnect: function() {}};
		s.p2pCollab.sendNotification = function(msg) { queue(c, b, s.objectToString(msg)); };

		function later(fn)
		{
			c.testIo++;
			window.setTimeout(function()
			{
				try { if (c.file === f) fn(); }
				catch (e) { b.report.fail('fixture-callback', e.stack || e.message); }
				finally { if (c.file === f) c.testIo--; }
			}, c.ioLatency || 0);
		}
		var get = w.mxUtils.get, post = w.mxUtils.post;
		w.mxUtils.post = function(url, body, success, error)
		{
			if (url != w.EditorUi.cacheUrl) return post.apply(this, arguments);
			var p = new URLSearchParams(body);
			b.requests.push({kind: 'cache-post', client: c.idx, from: p.get('from'), to: p.get('to')});
			if (p.has('data')) b.cache[p.get('from') + ':' + p.get('to')] = p.get('data');
			if (p.has('msg')) queue(c, b, p.get('msg'));
			later(function() { if (success) success(response(200, '')); });
		};
		w.mxUtils.get = function(url, success, error)
		{
			if (url.split('?')[0] != w.EditorUi.cacheUrl) return get.apply(this, arguments);
			var p = new URL(url, window.location.href).searchParams;
			if (!p.has('from')) { later(function() { success(response(200, '')); }); return; }
			var from = Number(p.get('from')), to = Number(p.get('to'));
			var entries = [];
			for (var r = from; r < to; r++)
			{
				var entry = b.cache[r + ':' + (r + 1)];
				if (entry == null) { entries = []; break; }
				entries.push(entry);
			}
			var mode = (c.cacheResponses || []).shift() || c.cacheResponse || 'valid';
			var status = /^\d+$/.test(mode) ? Number(mode) : 200;
			if (mode == 'empty') entries = [];
			if ((mode == 'checksum' || mode == 'future' || mode == 'old-app') && entries.length)
			{
				var bad = s.stringToObject(entries[entries.length - 1]);
				if (mode == 'checksum') bad.p.checksum = 'wrong-checksum';
				if (mode == 'future') bad.v = w.DrawioFileSync.PROTOCOL + 1;
				if (mode == 'old-app') bad.av = '1.0.0';
				entries[entries.length - 1] = s.objectToString(bad);
			}
			var body = mode == 'malformed' ? '{broken' : JSON.stringify(entries);
			b.requests.push({kind: 'cache-get', client: c.idx, from: from, to: to, mode: mode});
			later(function() { success(response(status, body)); });
		};
		b.report.stats.cacheReadyDelay = s.cacheReadyDelay;
	}

	function loadOneDrive(c)
	{
		// od=0 prevents SDK/auth setup during boot. Load only the local provider
		// class for this fixture; never create a picker or an authenticated client.
		return new Promise(function(resolve, reject)
		{
			var script = c.win.document.createElement('script');
			script.src = '/js/diagramly/OneDriveClient.js';
			script.onload = resolve; script.onerror = function() { reject(new Error('OneDrive fixture class failed to load')); };
			c.win.document.head.appendChild(script);
		});
	}
	function createOneDrive(c, b, xml)
	{
		var w = c.win;
		var initial = {id: 'fixture-item', name: 'fixture.drawio', eTag: 'etag-0', revision: 0,
			createdDateTime: '2026-01-01T00:00:00Z', lastModifiedDateTime: '2026-01-01T00:00:00Z',
			createdBy: {user: {id: 'fixture-user'}}, webUrl: 'https://example.invalid/fixture.drawio',
			parentReference: {driveId: 'fixture-drive', id: 'fixture-folder'}, file: {}, size: xml.length};
		b.commits = b.commits || {0: {revision: 0, data: xml, desc: initial}};
		var service = Object.create(w.OneDriveClient.prototype);
		service.ui = c.ui;
		service.user = {id: 'fixture-user', displayName: 'Fixture User'};
		service.getItemURL = function() { return '/rt-fixture-onedrive'; };
		service.executeRequest = function(url, success)
		{
			var record = b.commits[b.revision];
			b.requests.push({kind: 'onedrive-descriptor', client: c.idx, revision: record.revision});
			window.setTimeout(function() { success(response(200, JSON.stringify(record.desc))); }, 0);
		};
		service.getFile = function(id, success)
		{
			var record = b.commits[b.revision];
			var request = {kind: 'onedrive-latest', client: c.idx, revision: record.revision, completed: false};
			b.requests.push(request);
			window.setTimeout(function()
			{
				success(new w.OneDriveFile(c.ui, record.data, copy(record.desc)));
				request.completed = true;
			}, 0);
		};
		// The real OneDriveClient.saveFile serializer calls this HTTP write boundary.
		service.writeFile = function(url, data, method, contentType, success, error, etag)
		{
			var a = c.lastSaveAttempt;
			a.data = data;
			b.requests.push({kind: 'onedrive-put', client: c.idx, etag: etag});
			a.commit = async function()
			{
				if (a.committing) return;
				a.committing = true;
				a.sha256 = await RtTestBackend.digest(data);
				if (etag != null && etag != b.commits[b.revision].desc.eTag)
				{
					error({message: 'fixture etag mismatch'}, response(412, ''));
					return;
				}
				var desc = copy(b.commits[b.revision].desc);
				desc.revision = ++b.revision; desc.eTag = 'etag-' + b.revision;
				desc.lastModifiedDateTime = new Date().toISOString(); desc.size = data.length;
				a.committedRevision = b.revision;
				b.commits[b.revision] = {revision: b.revision, data: data, desc: desc,
					sha256: a.sha256, attempt: a.id};
				b.lastSavedData = data; b.report.stats.saves++;
				a.ack = function() { success(copy(desc)); };
				if (!c.holdSaveAck) a.ack();
			};
			a.fail = function() { error({code: 500, message: 'injected OneDrive write failure'}, response(500, '')); };
			if (!c.holdSaveCommit) window.setTimeout(function() { a.commit().catch(error); }, 0);
		};
		c.ui.oneDrive = service;
		return new w.OneDriveFile(c.ui, xml, copy(b.commits[b.revision].desc));
	}
	function installOneDrive(c, b, xml)
	{
		install(c, b, xml);
		var f = c.file;
		// Restore the real provider's descriptor/read methods after common transport setup.
		['getDescriptor', 'setDescriptor', 'patchDescriptor', 'getDescriptorRevisionId',
			'setDescriptorRevisionId', 'getDescriptorEtag', 'getDescriptorChecksum',
			'getDescriptorSecret', 'getLastModifiedDate', 'loadPatchDescriptor',
			'loadDescriptor', 'getLatestVersion'].forEach(function(name) { delete f[name]; });
		var save = f.save;
		f.save = function(revision, success, error)
		{
			var a = {id: b.attempts.length + 1, status: 'started', baseRevision: b.revision,
				committedRevision: null, acknowledged: false, generation: c.generation};
			b.attempts.push(a); c.lastSaveAttempt = a;
			var timer = window.setTimeout(function()
			{
				a.status = 'timeout'; b.report.fail('save-timeout', 'OneDrive callback missing');
				if (error) error({rtOutcome: a});
			}, 10000);
			return save.call(this, revision, function()
			{
				window.clearTimeout(timer); a.status = 'committed'; a.acknowledged = true;
				c.knownRevision = a.committedRevision;
				if (success) success({attempt: a.id, status: a.status, committedRevision: a.committedRevision,
					sha256: a.sha256, acknowledged: true, generation: a.generation});
			}, function(err)
			{
				window.clearTimeout(timer); a.status = 'failed';
				if (error) error({rtOutcome: {status: 'failed', error: String(err)}});
			});
		};
		b.report.stats.backend = 'onedrive-http-fixture';
	}

	function response(status, text)
	{
		return {getStatus: function() { return status; }, getText: function() { return text; }};
	}
	function queue(c, b, enc)
	{
		b.notifications.push({from: c.idx, enc: enc, revision: b.revision});
		b.report.log('notification-queued ' + c.name + ' revision=' + b.revision);
		if (!b.holdNotifications) deliver(b);
	}
	function deliver(b, messages, recipients)
	{
		(messages || b.notifications.splice(0)).forEach(function(msg)
		{
			(recipients || b.clients).forEach(function(c)
			{
				if (c.idx != msg.from && c.sync && !c.offline && !c.unjoined)
				{
					b.requests.push({kind: 'notification', client: c.idx, revision: msg.revision});
					c.sync.changeListener(msg.enc);
				}
			});
		});
	}
	async function revision(c, expected)
	{
		await RtTestBackend.waitFor(c.name + ' descriptor revision ' + expected, function()
		{
			return c.file.getCurrentRevisionId() == expected && c.testIo == 0;
		}, 10000, function() { return RtTestBackend.state(c.broker); });
		await RtTestBackend.drain(c.broker);
	}
	return {install: install, installOneDrive: installOneDrive, createOneDrive: createOneDrive, loadOneDrive: loadOneDrive, deliver: deliver, revision: revision};
})();
