// Smoke test for a DOMPurify update: runs the old and the new purify.min.js
// with the DOM_PURIFY_CONFIG from grapheditor/Init.js and hooks shaped like the
// ones in grapheditor/Graph.js. Attack inputs must not survive (checked after a
// second parse for mutation XSS), and the html labels of the bundled templates
// must sanitize to the same output as before.
//
// Usage (jsdom is not a dependency of this repo, install it anywhere):
//   npm install --prefix /tmp/smoke jsdom
//   git show origin/dev:src/main/webapp/js/sanitizer/purify.min.js > /tmp/old.min.js
//   NODE_PATH=/tmp/smoke/node_modules node etc/dependencies/dompurify-smoke.js \
//     /tmp/old.min.js src/main/webapp/js/sanitizer/purify.min.js .
//
// Exit 0 = pass, 1 = attack survived or the file does not load, 2 = pass but
// benign output differs from the old version (review the printed diffs).
'use strict';
var fs = require('fs'), path = require('path'), zlib = require('zlib');
var JSDOM = require('jsdom').JSDOM;
var oldFile = process.argv[2], newFile = process.argv[3], repo = process.argv[4];

// draw.io's real config, taken from Init.js
var initJs = fs.readFileSync(path.join(repo, 'src/main/webapp/js/grapheditor/Init.js'), 'utf8');
var cfgMatch = /window\.DOM_PURIFY_CONFIG\s*=\s*window\.DOM_PURIFY_CONFIG\s*\|\|\s*(\{[\s\S]*?\]\});/.exec(initJs);
if (!cfgMatch) { console.log('FAIL: DOM_PURIFY_CONFIG not found in Init.js'); process.exit(1); }

function load(file)
{
	var dom = new JSDOM('<!DOCTYPE html><body></body>', {runScripts: 'outside-only'});
	var win = dom.window;
	win.eval(fs.readFileSync(file, 'utf8'));
	var P = win.DOMPurify;
	if (!P || typeof P.sanitize != 'function' || !P.isSupported) throw new Error('DOMPurify not usable from ' + file);
	var config = win.eval('(' + cfgMatch[1] + ')');

	// Same shape as the hooks in grapheditor/Graph.js: a hook that detaches
	// nodes during the walk and one that rewrites and drops attributes
	P.addHook('afterSanitizeAttributes', function(node)
	{
		if (node.nodeName == 'use' && ((node.getAttribute('xlink:href') != null &&
			!node.getAttribute('xlink:href').startsWith('#')) ||
			(node.getAttribute('href') != null && !node.getAttribute('href').startsWith('#'))))
		{
			node.remove();
		}
		else if (node.nodeName.toLowerCase() == 'style' && /url\s*\(|@import/i.test(node.textContent))
		{
			node.remove();
		}
	});
	P.addHook('uponSanitizeAttribute', function(node, data)
	{
		data.attrValue = data.attrValue.replace(/[￾￿]/g, '');
		if (/^\s*</.test(data.attrValue)) data.keepAttr = false;
		if (data.attrName == 'style' && /url\s*\(/i.test(data.attrValue)) data.keepAttr = false;
	});

	return {
		version: P.version, win: win,
		str: function(v) { config.IN_PLACE = false; return P.sanitize(v, config); },
		inPlace: function(v)
		{
			var div = win.document.createElement('div');
			div.innerHTML = v;
			config.IN_PLACE = true;
			P.sanitize(div, config);
			return div.innerHTML;
		}
	};
}

// Real labels: value of every html=1 cell in the bundled templates
function labels()
{
	var out = [], dir = path.join(repo, 'src/main/webapp/templates');
	(function walk(d)
	{
		fs.readdirSync(d).forEach(function(f)
		{
			var p = path.join(d, f);
			if (fs.statSync(p).isDirectory()) return walk(p);
			if (!/\.xml$/.test(f)) return;
			var xml = fs.readFileSync(p, 'utf8');
			var parts = [xml];
			// compressed pages: <diagram ...>base64 deflate-raw of encodeURIComponent(xml)</diagram>
			xml.replace(/<diagram[^>]*>([A-Za-z0-9+\/=\s]+)<\/diagram>/g, function(m, b64)
			{
				try { parts.push(decodeURIComponent(zlib.inflateRawSync(Buffer.from(b64, 'base64')).toString('latin1'))); } catch (e) { }
			});
			parts.forEach(function(x)
			{
				var dom = new JSDOM(x, {contentType: 'text/xml'});
				dom.window.document.querySelectorAll('mxCell[value]').forEach(function(c)
				{
					var s = c.getAttribute('style') || '', v = c.getAttribute('value');
					if (/(^|;)html=1/.test(s) && /</.test(v)) out.push(v);
				});
			});
		});
	})(dir);
	return out;
}

var benign = labels().concat([
	'<b>bold</b> <i>italic</i> <u>u</u><br><font color="#ff0000" face="Helvetica">font</font>',
	'<div style="text-align: center;"><span style="font-size: 14px; background-color: rgb(255, 255, 255);">x</span></div>',
	'<a href="https://www.drawio.com" target="_blank">link</a>',
	'<table border="1"><tbody><tr><td>a</td><td style="border-color: red;">b</td></tr></tbody></table>',
	'<ul><li>one</li><li>two</li></ul><ol><li>1</li></ol><hr><h1>H</h1><pre>code</pre>',
	'<img src="data:image/png;base64,iVBORw0KGgo=" width="10" height="10">',
	'<span data-font-src="https://fonts.googleapis.com/css?family=Roboto" style="font-family: Roboto;">font</span>',
	'<svg><use href="#local"/><foreignObject><div>fo</div></foreignObject></svg>',
	'<span style="font-family: &quot;Courier New&quot;;">q</span>&nbsp;&lt;tag&gt; &amp;'
]);

var attacks = [
	'<img src=x onerror=alert(1)>',
	'<svg onload=alert(1)>',
	'<a href="javascript:alert(1)">x</a>',
	'<a href="JaVaScRiPt:alert(1)">x</a>',
	'<a href="java\tscript:alert(1)">x</a>',
	'<a href="java&#65535;script:alert(1)">x</a>',
	'<script>alert(1)</script>',
	'<iframe src="javascript:alert(1)"></iframe>',
	'<form action="javascript:alert(1)"><button>x</button></form>',
	'<math><mtext><table><mglyph><style><img src=x onerror=alert(1)></style></mglyph></table></mtext></math>',
	'<svg></p><style><a id="</style><img src=1 onerror=alert(1)>">',
	'<noscript><p title="</noscript><img src=x onerror=alert(1)>">',
	'<svg><use href="data:image/svg+xml,<svg id=x xmlns=http://www.w3.org/2000/svg><image href=1 onerror=alert(1) /></svg>#x"/></svg>',
	'<svg><foreignObject><img src=x onerror=alert(1)></foreignObject></svg>',
	'<div data-icon="<img src=x onerror=alert(1)>" data-foo="x">x</div>',
	'<a class="shared-item-trigger" href="<img src=x onerror=alert(1)>">x</a>',
	'<object data="javascript:alert(1)"></object><embed src="javascript:alert(1)">',
	'<div style="background:url(https://evil.example/x)">x</div>',
	'<style>@import "https://evil.example/x.css";</style>'
];

// Unsafe if any element carries an event handler, a javascript: URL, a
// forbidden tag or a denied attribute, checked after one parse and after a
// second serialize/parse round trip, which is where mutation XSS shows up
function unsafe(win, html)
{
	var div = win.document.createElement('div');
	div.innerHTML = html;
	var div2 = win.document.createElement('div');
	div2.innerHTML = div.innerHTML;
	var bad = [];
	Array.prototype.slice.call(div.querySelectorAll('*')).concat(
		Array.prototype.slice.call(div2.querySelectorAll('*'))).forEach(function(el)
	{
		var n = el.nodeName.toLowerCase();
		if (/^(script|iframe|form|object|embed)$/.test(n)) bad.push('<' + n + '>');
		if (n == 'use' && !/^#/.test(el.getAttribute('href') || el.getAttribute('xlink:href') || '#')) bad.push('external <use>');
		if (n == 'style' && /url\s*\(|@import/i.test(el.textContent)) bad.push('external CSS in <style>');
		Array.prototype.forEach.call(el.attributes, function(a)
		{
			var v = a.value.replace(/[\u0000- ￾￿]/g, '');
			if (/^on/i.test(a.name)) bad.push(n + ' ' + a.name);
			if (/^javascript:/i.test(v)) bad.push(n + ' ' + a.name + '=javascript:');
			if (/^data-icon/.test(a.name) || (/^data-/.test(a.name) && !/^data-(font-src|action|title|message|link|effect|lucid-type|lucid-content)$/.test(a.name))) bad.push(n + ' ' + a.name);
			if (/^\s*</.test(a.value)) bad.push(n + ' ' + a.name + ' starts with markup');
			if (a.name == 'style' && /url\s*\(/i.test(a.value)) bad.push(n + ' style url()');
		});
	});
	return bad;
}

var status = 0;
var o, n;
try { o = load(oldFile); n = load(newFile); }
catch (e) { console.log('FAIL: ' + e.message); process.exit(1); }
console.log('DOMPurify ' + o.version + ' -> ' + n.version + ', ' + benign.length + ' benign inputs (incl. template labels), ' + attacks.length + ' attack inputs');

['str', 'inPlace'].forEach(function(mode)
{
	attacks.forEach(function(a)
	{
		var out;
		try { out = n[mode](a); } catch (e) { out = null; } // a throw is fail-closed
		var bad = out == null ? [] : unsafe(n.win, out);
		if (bad.length) { status = 1; console.log('FAIL [' + mode + '] ' + JSON.stringify(a) + ' -> ' + JSON.stringify(out) + ' (' + bad.join(', ') + ')'); }
	});
});

var diffs = 0;
['str', 'inPlace'].forEach(function(mode)
{
	benign.forEach(function(b)
	{
		var a1, a2;
		try { a1 = o[mode](b); } catch (e) { a1 = 'THROWS ' + e.message; }
		try { a2 = n[mode](b); } catch (e) { a2 = 'THROWS ' + e.message; }
		if (a1 !== a2)
		{
			if (++diffs <= 10) console.log('DIFF [' + mode + '] ' + JSON.stringify(b).substring(0, 200) + '\n  old: ' + JSON.stringify(a1).substring(0, 300) + '\n  new: ' + JSON.stringify(a2).substring(0, 300));
		}
	});
});

if (status == 0 && diffs > 0) status = 2;
console.log(status == 1 ? 'RESULT: FAIL' : (diffs ? 'RESULT: PASS WITH ' + diffs + ' BENIGN OUTPUT DIFFERENCES' : 'RESULT: PASS (no attack survived, benign output identical)'));
process.exit(status);
