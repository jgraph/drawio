// Repro rig for jgraph/drawio-desktop#2382 (duplicate pasted edges with
// OneDrive local sync). Launches drawio-desktop with an isolated APPDATA,
// drives the renderer over CDP (trusted input for the EditorUi capture)
// and interleaves paste/save ops with OneDrive-style external writes to
// the open file. Modes:
//   node drive2382.js probe             deterministic mechanics walkthrough
//   node drive2382.js storm --seed N --rounds M   randomized race hunt
'use strict';

var fs = require('fs');
var path = require('path');
var cp = require('child_process');
var lib = require('./cdp');

var RIG = __dirname;
var WORK = path.join(RIG, 'work');
var APPDATA = path.join(RIG, 'appdata');
var SNAPS = path.join(RIG, 'snaps');
// drawio-desktop sibling checkout with node_modules installed
var DESKTOP = process.env.DRAWIO_DESKTOP ||
	path.resolve(__dirname, '../../../../drawio-desktop');
var ELECTRON = path.join(DESKTOP, 'node_modules', 'electron', 'dist',
	(process.platform == 'win32') ? 'electron.exe' :
	(process.platform == 'darwin') ?
		'Electron.app/Contents/MacOS/Electron' : 'electron');
var PORT = 9333;
var FILE = path.join(WORK, 'test2382.drawio');

var mode = process.argv[2] || 'probe';
var seed = 1;
var rounds = 20;

var autosaveArg = null;
var devMode = false;

for (var i = 0; i < process.argv.length; i++)
{
	if (process.argv[i] == '--seed') seed = parseInt(process.argv[i + 1], 10);
	if (process.argv[i] == '--rounds') rounds = parseInt(process.argv[i + 1], 10);
	if (process.argv[i] == '--autosave') autosaveArg = process.argv[i + 1] == '1';
	if (process.argv[i] == '--dev') devMode = process.argv[i + 1] == '1';
}

var logLines = [];

function log(s)
{
	var line = new Date().toISOString().substr(11, 12) + ' ' + s;
	console.log(line);
	logLines.push(line);
}

function flushLog()
{
	try
	{
		fs.writeFileSync(path.join(RIG, 'log-' + mode + '-' + seed + '.txt'),
			logLines.join('\n') + '\n');
	}
	catch (e) {}
}

// mulberry32
function rngFor(a)
{
	return function()
	{
		a |= 0; a = a + 0x6D2B79F5 | 0;
		var t = Math.imul(a ^ a >>> 15, 1 | a);
		t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
		return ((t ^ t >>> 14) >>> 0) / 4294967296;
	};
}

var rnd = rngFor(seed * 7919 + 13);

function sleep(ms)
{
	return new Promise(function(r) { setTimeout(r, ms); });
}

function seedXml()
{
	var cells = ['<mxCell id="0"/>', '<mxCell id="1" parent="0"/>',
		'<mxCell id="v1" value="A" style="rounded=0;whiteSpace=wrap;html=1;" vertex="1" parent="1"><mxGeometry x="80" y="80" width="120" height="60" as="geometry"/></mxCell>',
		'<mxCell id="v2" value="B" style="rounded=0;whiteSpace=wrap;html=1;" vertex="1" parent="1"><mxGeometry x="400" y="80" width="120" height="60" as="geometry"/></mxCell>',
		'<mxCell id="e1" value="link" style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;" edge="1" parent="1" source="v1" target="v2"><mxGeometry relative="1" as="geometry"/></mxCell>'];

	for (var i = 1; i <= 4; i++)
	{
		cells.push('<mxCell id="f' + i + '" value="F' + i +
			'" style="ellipse;whiteSpace=wrap;html=1;" vertex="1" parent="1">' +
			'<mxGeometry x="' + (80 + i * 90) + '" y="300" width="70" height="50" as="geometry"/></mxCell>');
	}

	return '<mxfile host="Electron" type="device" version="30.0.4">' +
		'<diagram id="page1" name="Page-1"><mxGraphModel dx="800" dy="600" ' +
		'grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" ' +
		'fold="1" page="1" pageScale="1" pageWidth="850" pageHeight="1100" ' +
		'math="0" shadow="0"><root>' + cells.join('') +
		'</root></mxGraphModel></diagram></mxfile>';
}

function rmrf(p)
{
	try { fs.rmSync(p, {recursive: true, force: true}); } catch (e) {}
}

var proc = null;
var cdp = null;

async function shot(name)
{
	try
	{
		var r = await cdp.call('Page.captureScreenshot', {format: 'png'});
		fs.writeFileSync(path.join(SNAPS, name + '.png'),
			Buffer.from(r.data, 'base64'));
		log('shot ' + name);
	}
	catch (e)
	{
		log('shot ' + name + ' failed: ' + e.message);
	}
}

async function ev(expr)
{
	return await cdp.eval(expr);
}

async function evJson(expr)
{
	var v = await cdp.eval(expr);
	return (v == null) ? null : JSON.parse(v);
}

async function click(x, y)
{
	await cdp.call('Input.dispatchMouseEvent', {type: 'mousePressed',
		x: x, y: y, button: 'left', clickCount: 1});
	await cdp.call('Input.dispatchMouseEvent', {type: 'mouseReleased',
		x: x, y: y, button: 'left', clickCount: 1});
}

var STATE_EXPR = '(function(){' +
	'var ui = window.__ui; if (ui == null) return null;' +
	'var f = ui.getCurrentFile(); if (f == null) return null;' +
	'var g = ui.editor.graph; var m = g.model; var edges = [];' +
	'for (var id in m.cells) { var c = m.cells[id]; if (m.isEdge(c)) {' +
	'edges.push({id: c.getId(), value: c.value || \'\', style: c.getStyle() || \'\',' +
	'src: (c.source != null) ? c.source.getId() : null,' +
	'trg: (c.target != null) ? c.target.getId() : null,' +
	'geo: (c.geometry != null) ? JSON.stringify({x: c.geometry.x, y: c.geometry.y,' +
	'pts: c.geometry.points, rel: c.geometry.relative}) : null}); } }' +
	'var sh = null, uh = null;' +
	'try { sh = ui.getHashValueForPages(f.getShadowPages());' +
	'uh = ui.getHashValueForPages(ui.pages); } catch (e) {}' +
	'var sc = ui.statusContainer;' +
	'var alertEl = (sc != null) ? sc.querySelector(\'.geStatusAlert\') : null;' +
	'return JSON.stringify({edges: edges,' +
	'cells: Object.keys(m.cells).length, modified: f.isModified(),' +
	'conflict: f.inConflictState, invalid: f.invalidChecksum,' +
	'saving: f.savingFile, autosave: ui.editor.autosave,' +
	'shadowHash: sh, uiHash: uh,' +
	'statMtime: (f.stat != null) ? f.stat.mtimeMs : null,' +
	'alert: (alertEl != null) ? alertEl.textContent : null,' +
	'status: (sc != null) ? sc.textContent : null});' +
	'})()';

function fmtState(s)
{
	if (s == null) return 'state=null';

	return 'cells=' + s.cells + ' edges=' + s.edges.length +
		' [' + s.edges.map(function(e)
		{
			return e.id + (e.src == null && e.trg == null ? '*' : '');
		}).join(',') + ']' +
		' mod=' + s.modified + ' conf=' + s.conflict +
		' inv=' + s.invalid + ' saving=' + s.saving +
		' shadow' + (s.shadowHash == s.uiHash ? '==' : '!=') + 'ui' +
		(s.alert != null ? ' ALERT="' + s.alert.substring(0, 60) + '"' :
			(s.status ? ' status="' + s.status.substring(0, 40) + '"' : ''));
}

async function state()
{
	return await evJson(STATE_EXPR);
}

// --- file side (the "OneDrive") ------------------------------------------
var contentHistory = [];

function snapshotContent(tag)
{
	try
	{
		var data = fs.readFileSync(FILE, 'utf8');

		if (contentHistory.length == 0 ||
			contentHistory[contentHistory.length - 1].data != data)
		{
			contentHistory.push({tag: tag, data: data});
			log('history +' + tag + ' (' + data.length + ' bytes, ' +
				countEdges(data) + ' edges)');
		}

		return data;
	}
	catch (e)
	{
		log('history read failed: ' + e.message);
		return null;
	}
}

function countEdges(xml)
{
	var m = xml.match(/edge="1"/g);
	return (m == null) ? 0 : m.length;
}

function extWrite(kind)
{
	try
	{
		if (kind == 'ident')
		{
			var cur = fs.readFileSync(FILE, 'utf8');
			fs.writeFileSync(FILE, cur);
		}
		else if (kind == 'touch')
		{
			var now = new Date();
			fs.utimesSync(FILE, now, now);
		}
		else if (kind == 'old')
		{
			if (contentHistory.length < 2)
			{
				log('extWrite old SKIPPED (history=' +
					contentHistory.length + ')');
				return false;
			}

			var old = contentHistory[contentHistory.length - 2];
			fs.writeFileSync(FILE, old.data);
		}
		else if (kind == 'replace')
		{
			var cur2 = fs.readFileSync(FILE, 'utf8');
			var tmp = FILE + '.tmp-sync';
			fs.writeFileSync(tmp, cur2);
			fs.rmSync(FILE);
			fs.renameSync(tmp, FILE);
		}

		log('extWrite ' + kind);
		return true;
	}
	catch (e)
	{
		log('extWrite ' + kind + ' failed: ' + e.message);
		return false;
	}
}

function extWriteData(tag, data)
{
	try
	{
		fs.writeFileSync(FILE, data);
		log('extWriteData ' + tag + ' (' + data.length + ' bytes, ' +
			countEdges(data) + ' edges)');
		return true;
	}
	catch (e)
	{
		log('extWriteData ' + tag + ' failed: ' + e.message);
		return false;
	}
}

// --- app ops --------------------------------------------------------------
var EDGE_IDS_EXPR = '(function(){ var m = window.__ui.editor.graph.model;' +
	'var ids = []; for (var id in m.cells) { if (m.isEdge(m.cells[id]))' +
	'ids.push(m.cells[id].getId()); } return JSON.stringify(ids); })()';

// Paste imports asynchronously (EditorUi.importXml), so new ids are
// detected via a model delta, not the selection
async function pasteEdge()
{
	var before = await evJson(EDGE_IDS_EXPR);
	await ev('(function(){' +
		'var ui = window.__ui; var g = ui.editor.graph;' +
		'var e = g.model.getCell(\'e1\');' +
		'g.setSelectionCell(e);' +
		'ui.actions.get(\'copy\').funct();' +
		'ui.actions.get(\'paste\').funct();' +
		'})()');
	var fresh = [];

	for (var i = 0; i < 10 && fresh.length == 0; i++)
	{
		await sleep(200);
		var after = await evJson(EDGE_IDS_EXPR);
		fresh = after.filter(function(id) { return before.indexOf(id) < 0; });
	}

	log('pasted -> ' + JSON.stringify(fresh));
	return fresh;
}

async function moveFiller()
{
	var dx = Math.floor(rnd() * 60) - 30;
	await ev('(function(){' +
		'var g = window.__ui.editor.graph; var m = g.model;' +
		'var c = m.getCell(\'f' + (1 + Math.floor(rnd() * 4)) + '\');' +
		'if (c == null) return; m.beginUpdate();' +
		'try { var geo = c.geometry.clone(); geo.x += ' + dx + ';' +
		'm.setGeometry(c, geo); } finally { m.endUpdate(); }' +
		'})()');
	log('moveFiller dx=' + dx);
}

// Waits until async imports settled (stable edge count over 400ms)
async function quiesce()
{
	var prev = null;

	for (var i = 0; i < 15; i++)
	{
		var ids = await evJson(EDGE_IDS_EXPR);
		var key = ids.join(',');

		if (key === prev) return;
		prev = key;
		await sleep(400);
	}
}

async function save()
{
	await quiesce();
	await ev('window.__ui.actions.get(\'save\').funct()');

	for (var i = 0; i < 40; i++)
	{
		await sleep(250);
		var s = await state();

		if (s != null && !s.saving && !s.modified)
		{
			log('saved (' + (i * 250) + 'ms)');
			snapshotContent('save');
			return true;
		}
	}

	log('SAVE DID NOT SETTLE');
	snapshotContent('save-unsettled');
	return false;
}

async function resolveConflict()
{
	// The conflict banner is the .geStatusAlert element; links[0] can be
	// the unrelated "Click here to save" status
	var link = await evJson('(function(){' +
		'var sc = window.__ui.statusContainer;' +
		'if (sc == null) return null;' +
		'var els = sc.querySelectorAll(\'.geStatusAlert\');' +
		'for (var i = 0; i < els.length; i++) {' +
		'if (/synchroni/i.test(els[i].textContent)) {' +
		'var r = els[i].getBoundingClientRect();' +
		'return JSON.stringify({x: r.left + r.width / 2,' +
		'y: r.top + r.height / 2, text: els[i].textContent}); } }' +
		'return null; })()');

	if (link != null)
	{
		log('conflict alert "' + link.text + '" -> click');
		await click(link.x, link.y);
		return 'click';
	}

	log('no status link, calling synchronizeFile directly');
	await ev('(function(){ var f = window.__ui.getCurrentFile();' +
		'window.__syncDone = false; window.__syncErr = null;' +
		'f.synchronizeFile(function() { window.__syncDone = true; },' +
		'function(e) { window.__syncErr = (e != null) ? (e.message || String(e)) : \'err\';' +
		'window.__syncDone = true; }); })()');

	for (var i = 0; i < 20; i++)
	{
		await sleep(250);
		if (await ev('window.__syncDone === true')) break;
	}

	var err = await ev('window.__syncErr');
	log('synchronizeFile done, err=' + err);
	return 'direct';
}

// Waits for the fs.watchFile poll (5s default) to deliver + app to react
async function waitWatcher(label, maxMs)
{
	var t0 = Date.now();

	while (Date.now() - t0 < maxMs)
	{
		await sleep(500);
		var s = await state();

		// inConflictState only: the unsaved-changes status is also a
		// geStatusAlert, so the alert text alone is ambiguous
		if (s != null && s.conflict)
		{
			log('watcher reacted after ' + (Date.now() - t0) + 'ms [' +
				label + ']: ' + fmtState(s));
			return s;
		}
	}

	var s2 = await state();
	log('watcher quiet after ' + maxMs + 'ms [' + label + ']: ' + fmtState(s2));
	return s2;
}

function snapXml(name)
{
	try
	{
		var data = fs.readFileSync(FILE, 'utf8');
		fs.writeFileSync(path.join(SNAPS, name + '.xml'), data);
	}
	catch (e) {}
}

async function dumpModel(name)
{
	try
	{
		var xml = await ev('(function(){ var ui = window.__ui;' +
			'return mxUtils.getXml(ui.editor.getGraphXml()); })()');
		fs.writeFileSync(path.join(SNAPS, name + '-model.xml'), xml);
	}
	catch (e)
	{
		log('dumpModel failed: ' + e.message);
	}
}

// --- red predicate --------------------------------------------------------
// aliveFloating: ids of pasted (unattached) edges the driver believes exist
function judge(s, aliveFloating)
{
	if (s == null) return null;
	var seen = {};
	var verdicts = [];

	for (var i = 0; i < s.edges.length; i++)
	{
		var e = s.edges[i];
		var key = e.style + '|' + e.value + '|' + (e.src == null) + (e.trg == null);
		(seen[key] = seen[key] || []).push(e);
	}

	// R2: identical twins (same style+value+geometry, different ids)
	for (var k in seen)
	{
		var group = seen[k];

		for (var a = 0; a < group.length; a++)
		{
			for (var b = a + 1; b < group.length; b++)
			{
				if (group[a].geo != null && group[a].geo == group[b].geo)
				{
					verdicts.push('R2 identical twins ' + group[a].id +
						'/' + group[b].id + ' key=' + k.substring(0, 40));
				}
			}
		}
	}

	// R1: unattached edge that the driver does not know about (ghost)
	for (var i = 0; i < s.edges.length; i++)
	{
		var e = s.edges[i];

		if (e.src == null && e.trg == null && e.id != 'e1' &&
			aliveFloating[e.id] == null)
		{
			verdicts.push('R1 ghost floating edge ' + e.id);
		}
	}

	if (s.invalid)
	{
		verdicts.push('R3 invalidChecksum');
	}

	return verdicts;
}

// --- boot -----------------------------------------------------------------
async function boot()
{
	rmrf(WORK); rmrf(APPDATA); rmrf(SNAPS);
	fs.mkdirSync(WORK, {recursive: true});
	fs.mkdirSync(APPDATA, {recursive: true});
	fs.mkdirSync(SNAPS, {recursive: true});
	fs.writeFileSync(path.join(RIG, 'urlParams.json'),
		JSON.stringify(devMode ? {test: 1, splash: 0, dev: 1} :
			{test: 1, splash: 0}));
	fs.writeFileSync(FILE, seedXml());
	snapshotContent('seed');

	log('spawning electron');
	proc = cp.spawn(ELECTRON, [DESKTOP,
		'--remote-debugging-port=' + PORT, FILE],
		{cwd: RIG, env: Object.assign({}, process.env, {APPDATA: APPDATA}),
		stdio: ['ignore', 'pipe', 'pipe']});
	proc.stdout.on('data', function(d)
	{
		var s = String(d).trim();
		if (s.length > 0) log('[main] ' + s.substring(0, 300));
	});
	proc.stderr.on('data', function(d)
	{
		var s = String(d).trim();
		if (s.length > 0 && !/Fontconfig|GetVSyncParameters/.test(s))
			log('[main-err] ' + s.substring(0, 300));
	});
	proc.on('exit', function(code)
	{
		log('electron exited code=' + code);
	});

	var target = null;

	for (var i = 0; i < 120 && target == null; i++)
	{
		await sleep(500);

		try
		{
			var list = await lib.httpGetJson(
				'http://127.0.0.1:' + PORT + '/json/list');
			target = list.find(function(t)
			{
				return t.type == 'page' && /index\.html/.test(t.url);
			});
		}
		catch (e) {}
	}

	if (target == null) throw new Error('no CDP page target');
	log('CDP target: ' + target.url.substring(0, 120));

	var u = new URL(target.webSocketDebuggerUrl);
	var ws = await lib.WS.connect('127.0.0.1', parseInt(u.port, 10), u.pathname);
	cdp = new lib.CDP(ws);
	await cdp.call('Runtime.enable');
	await cdp.call('Page.enable');

	cdp.on('Runtime.consoleAPICalled', function(p)
	{
		try
		{
			var s = p.args.map(function(a)
			{
				return (a.value != null) ? String(a.value) :
					(a.description || a.type);
			}).join(' ');

			if (/mergeFile|handleFileChange|synchronizeFile|updateFile|fileChanged|conflict|checksum|patch|Error|error/i.test(s))
			{
				log('[console] ' + s.substring(0, 500));
			}
		}
		catch (e) {}
	});

	// App ready
	for (var i = 0; i < 120; i++)
	{
		await sleep(500);

		try
		{
			var ready = await ev('typeof App !== \'undefined\' && ' +
				'document.querySelector(\'.geDiagramContainer\') != null');
			if (ready) break;
		}
		catch (e) {}
	}

	await sleep(2000);
	await shot('boot');

	// Capture the EditorUi via prototype hook + trusted click
	await ev('(function(){ if (window.__hookDone) return;' +
		'window.__hookDone = true;' +
		'var orig = EditorUi.prototype.getCurrentFile;' +
		'EditorUi.prototype.getCurrentFile = function() {' +
		'window.__ui = this; return orig.apply(this, arguments); };' +
		'})()');

	for (var i = 0; i < 30; i++)
	{
		var rect = await evJson('(function(){' +
			'var c = document.querySelector(\'.geDiagramContainer\');' +
			'if (c == null) return null;' +
			'var r = c.getBoundingClientRect();' +
			'return JSON.stringify({x: r.left + 30, y: r.bottom - 30});' +
			'})()');

		if (rect != null)
		{
			await click(rect.x, rect.y);
		}

		if (await ev('window.__ui != null')) break;
		await sleep(400);
	}

	if (!(await ev('window.__ui != null')))
	{
		await shot('capture-failed');
		throw new Error('EditorUi capture failed');
	}

	// Wait for the file to be loaded
	for (var i = 0; i < 40; i++)
	{
		var s = await state();
		if (s != null) break;
		await sleep(500);
	}

	var s0 = await state();
	log('booted: ' + fmtState(s0));

	if (s0 == null || s0.cells < 5)
	{
		await shot('bad-boot');
		throw new Error('file not loaded as expected');
	}

	var wantAuto = (autosaveArg != null) ? autosaveArg : (mode == 'storm');
	await ev('window.__ui.editor.setAutosave(' + wantAuto + ')');
	log('autosave set to ' + wantAuto);

	return s0;
}

// --- modes ----------------------------------------------------------------
async function probe()
{
	await boot();

	log('--- P1: paste one edge, save');
	var pasted = await pasteEdge();
	log(fmtState(await state()));
	await save();
	log(fmtState(await state()));

	log('--- P2: external identical rewrite');
	extWrite('ident');
	var s = await waitWatcher('ident', 9000);
	await shot('p2');

	if (s != null && s.conflict)
	{
		await resolveConflict();
		await sleep(1500);
		log(fmtState(await state()));
	}

	log('--- P3: external touch (mtime only)');
	extWrite('touch');
	s = await waitWatcher('touch', 9000);

	if (s != null && s.conflict)
	{
		await resolveConflict();
		await sleep(1500);
		log(fmtState(await state()));
	}

	log('--- P4: external OLD content (rollback)');
	extWrite('old');
	s = await waitWatcher('old', 9000);
	await shot('p4');

	if (s != null && s.conflict)
	{
		await resolveConflict();
		await sleep(2000);
		s = await state();
		log('after rollback merge: ' + fmtState(s));
	}

	log('--- P5: user re-pastes (compensation), saves');
	var pasted2 = await pasteEdge();
	await save();
	log(fmtState(await state()));

	log('--- P6: external NEWER echo (content from before rollback)');
	// the pre-rollback save is the last-but-one entry now
	extWrite('old');
	s = await waitWatcher('echo', 9000);
	await shot('p6');

	if (s != null && s.conflict)
	{
		await resolveConflict();
		await sleep(2000);
		s = await state();
		log('after echo merge: ' + fmtState(s));
	}

	var alive = {};
	pasted.concat(pasted2).forEach(function(id) { alive[id] = true; });
	var verdicts = judge(await state(), alive);
	log('verdicts: ' + JSON.stringify(verdicts));
	await dumpModel('probe-final');
	snapXml('probe-final-file');
	await shot('final');
}

async function dialogButtons()
{
	return await evJson('(function(){ var ui = window.__ui;' +
		'if (ui.dialog == null) return null; var btns = [];' +
		'var els = document.querySelectorAll(' +
		'\'.geDialog button, .geDialog .geBtn\');' +
		'for (var i = 0; i < els.length; i++) {' +
		'var r = els[i].getBoundingClientRect();' +
		'btns.push({text: els[i].textContent.trim(),' +
		'x: r.left + r.width / 2, y: r.top + r.height / 2}); }' +
		'return JSON.stringify(btns); })()');
}

async function clickDialogButton(re)
{
	var btns = await dialogButtons();
	if (btns == null || btns.length == 0) return false;
	log('dialog buttons: ' + btns.map(function(b)
	{
		return b.text;
	}).join(' | '));
	var rx = new RegExp(re, 'i');
	var b = btns.find(function(x) { return rx.test(x.text); });
	if (b == null) return false;
	log('clicking dialog "' + b.text + '"');
	await click(b.x, b.y);
	return true;
}

// With the stale-rewrite guard in place the app shows a confirm dialog
// instead of silently merging; this clicks the requested choice
var sawStaleDialog = false;

async function maybeStaleDialog(choice)
{
	await sleep(800);

	for (var i = 0; i < 3; i++)
	{
		if (await clickDialogButton(choice))
		{
			sawStaleDialog = true;
			await sleep(600);
			return true;
		}

		await sleep(500);
	}

	return false;
}

// Deterministic duplicate repro: OneDrive rollback removes the user's
// pasted edge, the user pastes it again, then the OneDrive echo of the
// first save re-inserts the old copy while the compensation is unsaved.
async function dup()
{
	await boot();
	var seedData = seedXml();

	log('--- D1: paste edge, save (disk_A)');
	var p1 = await pasteEdge();
	await save();
	var diskA = fs.readFileSync(FILE, 'utf8');
	log(fmtState(await state()));

	log('--- D2: OneDrive rollback to seed -> merge removes the paste');
	extWriteData('rollback-seed', seedData);
	var s = await waitWatcher('rollback', 9000);

	if (s == null || !s.conflict)
	{
		throw new Error('no conflict after rollback');
	}

	await resolveConflict();
	var dlg2 = await maybeStaleDialog('synchron');
	log('D2 stale dialog: ' + dlg2);
	await sleep(2000);
	s = await state();
	log('after rollback merge: ' + fmtState(s));

	if (s.edges.some(function(e) { return e.id == p1[0]; }))
	{
		throw new Error('rollback merge did not remove the pasted edge');
	}

	log('--- D3: user compensates (re-paste), NO save');
	var p2 = await pasteEdge();
	log(fmtState(await state()));

	log('--- D4: OneDrive echo of disk_A arrives -> merge');
	extWriteData('echo-diskA', diskA);
	s = await waitWatcher('echo', 9000);

	if (s != null && s.conflict)
	{
		await resolveConflict();
		var dlg4 = await maybeStaleDialog('overwrite');
		log('D4 stale dialog: ' + dlg4);
		await sleep(2000);
	}

	s = await state();
	log('after echo merge: ' + fmtState(s));

	var alive = {};
	p2.forEach(function(id) { alive[id] = true; });
	var verdicts = judge(s, alive);
	log('verdicts: ' + JSON.stringify(verdicts));
	await dumpModel('dup-final');
	await shot('dup-final');

	log('--- D5: save and check persisted file');
	await quiesce();
	await ev('window.__ui.actions.get(\'save\').funct()');
	await sleep(2500);

	if (await clickDialogButton('synchron'))
	{
		await sleep(2500);
	}
	else if (await clickDialogButton('overwrite|berschreiben'))
	{
		await sleep(1500);
	}

	for (var i = 0; i < 24; i++)
	{
		var st = await state();

		if (st != null && !st.saving && !st.modified) break;
		await sleep(500);
	}

	snapshotContent('final-save');
	var xml = fs.readFileSync(FILE, 'utf8');
	log('persisted edges=' + countEdges(xml));
	snapXml('dup-final-file');
	var sFinal = await state();
	log('final: ' + fmtState(sFinal));
	var verdicts2 = judge(sFinal, alive);
	log('final verdicts: ' + JSON.stringify(verdicts2));

	var red = (verdicts != null && verdicts.length > 0) ||
		(verdicts2 != null && verdicts2.length > 0);

	if (sawStaleDialog)
	{
		log('--- D6: genuinely new external content must merge without dialog');
		var cur = fs.readFileSync(FILE, 'utf8');
		extWriteData('newer-external', cur.replace('</root>',
			'<mxCell id="n1" value="N" style="rounded=0;whiteSpace=wrap;html=1;" ' +
			'vertex="1" parent="1"><mxGeometry x="600" y="300" width="80" ' +
			'height="40" as="geometry"/></mxCell></root>'));
		s = await waitWatcher('newer', 9000);

		if (s != null && s.conflict)
		{
			await resolveConflict();

			if (await maybeStaleDialog('overwrite|synchron'))
			{
				log('D6 FAIL: stale dialog appeared for genuinely new content');
				red = true;
			}
		}

		await sleep(2000);
		s = await state();
		var hasN1 = await ev(
			'window.__ui.editor.graph.model.getCell(\'n1\') != null');
		log('after newer-content merge: ' + fmtState(s) + ' n1=' + hasN1);

		if (!hasN1)
		{
			log('D6 FAIL: new external cell was not merged');
			red = true;
		}

		var v3 = judge(s, alive);

		if (v3 != null && v3.length > 0)
		{
			log('D6 verdicts: ' + JSON.stringify(v3));
			red = true;
		}

		log(red ?
			'RESULT: RED (guard present but duplication/regression remains)' :
			'RESULT: GREEN (stale-rewrite guard active, no duplicate, ' +
			'new content merges)');
	}
	else
	{
		log(red ? 'RESULT: RED (duplicate reproduced)' :
			'RESULT: green (no duplicate)');
	}
}

async function storm()
{
	await boot();
	var alive = {};
	var vanished = {};
	var red = null;

	for (var r = 1; r <= rounds && red == null; r++)
	{
		log('=== round ' + r + '/' + rounds);

		// user ops
		if (rnd() < 0.7)
		{
			var ids = await pasteEdge();
			ids.forEach(function(id) { alive[id] = true; });
		}

		// compensation: re-paste for edges the user "lost"
		var lost = Object.keys(vanished);

		if (lost.length > 0 && rnd() < 0.8)
		{
			log('user compensates for lost ' + lost.join(','));
			var ids2 = await pasteEdge();
			ids2.forEach(function(id) { alive[id] = true; });
			vanished = {};
		}

		if (rnd() < 0.5)
		{
			await moveFiller();
		}

		// save + external write interleaving
		var kind = ['ident', 'old', 'replace', 'touch'][Math.floor(rnd() * 4)];
		var during = rnd() < 0.35;

		if (during)
		{
			// fire save, inject external write into the save window
			ev('window.__ui.actions.get(\'save\').funct()');
			await sleep(Math.floor(rnd() * 250));
			extWrite(kind);
			await sleep(1500);
			snapshotContent('save-during');
		}
		else
		{
			var st = await state();

			if (st != null && st.modified)
			{
				await save();
			}

			await sleep(Math.floor(rnd() * 1200));
			extWrite(kind);
		}

		var s = await waitWatcher('r' + r, 8000);

		if (s != null && (s.conflict || (s.status || '').length > 0))
		{
			if (rnd() < 0.9)
			{
				await resolveConflict();
				await sleep(2000);
				s = await state();
				log('after resolve: ' + fmtState(s));
			}
			else
			{
				log('leaving conflict pending this round');
			}
		}

		// reconcile driver bookkeeping with observed model
		if (s != null)
		{
			var present = {};
			s.edges.forEach(function(e) { present[e.id] = true; });

			Object.keys(alive).forEach(function(id)
			{
				if (!present[id])
				{
					log('[DELTA] pasted edge ' + id + ' vanished');
					vanished[id] = true;
					delete alive[id];
				}
			});

			var verdicts = judge(s, alive);

			if (verdicts != null && verdicts.length > 0)
			{
				red = verdicts;
				log('!!! RED in round ' + r + ': ' + JSON.stringify(verdicts));
				await dumpModel('red-r' + r);
				snapXml('red-r' + r + '-file');
				await shot('red-r' + r);
			}
		}

		if (r % 5 == 0)
		{
			await dumpModel('r' + r);
			snapXml('r' + r + '-file');
		}

		flushLog();
	}

	log(red != null ? 'RESULT: RED ' + JSON.stringify(red) :
		'RESULT: no duplication observed in ' + rounds + ' rounds (seed ' +
		seed + ')');
}

async function main()
{
	try
	{
		if (mode == 'probe') await probe();
		else if (mode == 'dup') await dup();
		else if (mode == 'storm') await storm();
		else throw new Error('unknown mode ' + mode);
	}
	finally
	{
		flushLog();

		if (proc != null)
		{
			try { proc.kill(); } catch (e) {}
			await sleep(500);

			if (process.platform == 'win32')
			{
				try
				{
					cp.execSync('taskkill /F /T /PID ' + proc.pid + ' 2>nul');
				}
				catch (e) {}
			}
		}
	}
}

main().then(function()
{
	log('done');
	flushLog();
	process.exit(0);
}, function(e)
{
	log('FATAL: ' + (e.stack || e.message));
	flushLog();
	process.exit(1);
});
