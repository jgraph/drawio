#!/usr/bin/env node
/**
 * Headless runner for the realtime sync test harness. Zero dependencies.
 *
 * Serves the webapp at / and etc/rt-test at /rt-test, receives the
 * verdict via POST /rt-result and drives headless Chrome through a
 * seed x scenario sweep. Exit code 0 iff every run passed; failing
 * seeds are printed with a repro URL and written to results.jsonl.
 *
 *   node run.js                          # default sweep
 *   node run.js --scenarios all --seeds 1-5   # the full gate
 *   node run.js --scenarios all --seeds 1 --timing real
 *   node run.js --scenarios nasty --seeds 1-50
 *   node run.js --serve-only             # just start the server (manual runs)
 *   node run.js --url-only --seeds 7 --scenarios jitter  # print repro URL
 */
'use strict';

var http = require('http');
var fs = require('fs');
var os = require('os');
var path = require('path');
var childProcess = require('child_process');
var crypto = require('crypto');

var REPO = path.resolve(__dirname, '../..');
var WEBAPP = path.join(REPO, 'src/main/webapp');
var RTTEST = __dirname;

// Returns the first existing Chromium binary for the platform (Edge is
// the Windows fallback - same engine, same headless flags)
function findChrome()
{
	var candidates = (process.platform == 'darwin') ? [
		'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
	] : (process.platform == 'win32') ? [
		(process.env['PROGRAMFILES'] || 'C:\\Program Files') +
			'\\Google\\Chrome\\Application\\chrome.exe',
		(process.env['PROGRAMFILES(X86)'] || 'C:\\Program Files (x86)') +
			'\\Google\\Chrome\\Application\\chrome.exe',
		(process.env['LOCALAPPDATA'] || '') +
			'\\Google\\Chrome\\Application\\chrome.exe',
		(process.env['PROGRAMFILES'] || 'C:\\Program Files') +
			'\\Microsoft\\Edge\\Application\\msedge.exe',
		(process.env['PROGRAMFILES(X86)'] || 'C:\\Program Files (x86)') +
			'\\Microsoft\\Edge\\Application\\msedge.exe'
	] : [
		'/usr/bin/google-chrome',
		'/usr/bin/google-chrome-stable',
		'/usr/bin/chromium',
		'/usr/bin/chromium-browser',
		'/snap/bin/chromium'
	];

	for (var i = 0; i < candidates.length; i++)
	{
		if (candidates[i] != '' && fs.existsSync(candidates[i]))
		{
			return candidates[i];
		}
	}

	return candidates[0];
}

var CHROME = process.env.CHROME_BIN || findChrome();

var MIME = {
	'.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
	'.png': 'image/png', '.gif': 'image/gif', '.svg': 'image/svg+xml',
	'.json': 'application/json', '.txt': 'text/plain', '.xml': 'text/xml',
	'.woff': 'font/woff', '.woff2': 'font/woff2', '.map': 'application/json'
};

function parseArgs(argv)
{
	var args = {scenarios: 'instant,jitter,reorder,conflict,nasty',
		seeds: '1-5', port: 0, serveOnly: false, urlOnly: false,
		timeout: 300000, keep: false};

	for (var i = 2; i < argv.length; i++)
	{
		if (argv[i] == '--scenarios')
		{
			args.scenarios = argv[++i];
		}
		else if (argv[i] == '--seeds')
		{
			args.seeds = argv[++i];
		}
		else if (argv[i] == '--port')
		{
			args.port = parseInt(argv[++i], 10);
		}
		else if (argv[i] == '--timeout')
		{
			args.timeout = parseInt(argv[++i], 10);
		}
		else if (argv[i] == '--serve-only')
		{
			args.serveOnly = true;
		}
		else if (argv[i] == '--url-only')
		{
			args.urlOnly = true;
		}
		else if (argv[i] == '--keep')
		{
			args.keep = true;
		}
		else if (argv[i] == '--timing')
		{
			// First-class flag rather than a remembered --extra string:
			// the mock timers set the sync's wallclock timers to
			// infinity, so a whole class of ordering bugs is invisible
			// to the default sweep
			args.timing = argv[++i];
		}
		else if (argv[i] == '--extra')
		{
			// Extra orchestrator URL parameters, eg. clients=4&rounds=20
			args.extra = argv[++i];
		}
		else if (argv[i] == '--watch')
		{
			// Visible Chrome instead of headless: watch every case
			// live (roughly 4-10x slower per run than headless)
			args.watch = true;
		}
		else
		{
			console.error('unknown argument: ' + argv[i]);
			process.exit(2);
		}
	}

	return args;
}

function expandSeeds(spec)
{
	var result = [];

	spec.split(',').forEach(function(part)
	{
		var m = part.match(/^(\d+)-(\d+)$/);

		if (m != null)
		{
			for (var s = parseInt(m[1], 10); s <= parseInt(m[2], 10); s++)
			{
				result.push(s);
			}
		}
		else if (part.length > 0)
		{
			result.push(parseInt(part, 10));
		}
	});

	return result;
}

// --- Server -------------------------------------------------------------
var resultWaiter = null;

function createServer()
{
	return http.createServer(function(req, res)
	{
		var url = req.url.split('?')[0];

		if (req.method == 'POST' && url == '/rt-result')
		{
			var body = '';
			req.on('data', function(chunk) { body += chunk; });
			req.on('end', function()
			{
				res.writeHead(204);
				res.end();

				if (resultWaiter != null)
				{
					var waiter = resultWaiter;
					resultWaiter = null;

					try
					{
						waiter.resolve(JSON.parse(body));
					}
					catch (e)
					{
						waiter.reject(new Error('bad result JSON'));
					}
				}
			});

			return;
		}

		// Full historical app, not a v7 receiver with a changed constant.
		// Fixed revision/path prefix: requests cannot choose a Git ref or read
		// files outside the historical webapp. Requires normal Git history.
		if (url.indexOf('/rt-v6/') == 0)
		{
			var relative = url.substring('/rt-v6/'.length);
			if (!/^[a-zA-Z0-9_./ -]+$/.test(relative) || relative.split('/').indexOf('..') >= 0)
			{
				res.writeHead(403); res.end(); return;
			}
			try
			{
				var bytes = childProcess.execFileSync('git', ['show',
					'c6c7ce5b31bb7b1f1377f97a9e25d4b94be0c073:src/main/webapp/' + relative],
					{cwd: REPO, maxBuffer: 64 * 1024 * 1024, stdio: ['ignore', 'pipe', 'ignore']});
				res.writeHead(200, {'Content-Type': MIME[path.extname(relative)] ||
					'application/octet-stream', 'Cache-Control': 'no-store'});
				res.end(bytes);
			}
			catch (e) { res.writeHead(404); res.end('Historical v6 asset unavailable'); }
			return;
		}

		// /rt-test/* -> etc/rt-test, everything else -> webapp
		var file = (url.indexOf('/rt-test/') == 0) ?
			path.join(RTTEST, url.substring('/rt-test/'.length)) :
			path.join(WEBAPP, url == '/' ? 'index.html' : url);

		// Containment check against path traversal
		file = path.normalize(file);

		if (file.indexOf(RTTEST) != 0 && file.indexOf(WEBAPP) != 0)
		{
			res.writeHead(403);
			res.end();

			return;
		}

		fs.readFile(file, function(err, data)
		{
			if (err != null)
			{
				res.writeHead(404);
				res.end();

				return;
			}

			res.writeHead(200, {'Content-Type':
				MIME[path.extname(file)] || 'application/octet-stream',
				'Cache-Control': 'no-store'});
			res.end(data);
		});
	});
}

// --- Chrome -------------------------------------------------------------
function runOnce(port, scenario, seed, timeoutMs, profileDir, extra, watch)
{
	return new Promise(function(resolve)
	{
		var url = 'http://127.0.0.1:' + port +
			'/rt-test/orchestrator.html?report=1&scenario=' + scenario +
			'&seed=' + seed + '&watchdog=' +
			Math.max(60, Math.round(timeoutMs / 1000) - 30) +
			((extra != null) ? '&' + extra : '');
		var chromeArgs = (watch) ? [
			'--no-first-run', '--no-default-browser-check', '--mute-audio',
			'--window-size=1400,1000'
		] : [
			'--headless=new', '--disable-gpu', '--no-first-run',
			'--no-default-browser-check', '--mute-audio',
			'--disable-background-timer-throttling',
			'--disable-renderer-backgrounding',
			'--disable-backgrounding-occluded-windows',
			'--window-size=1200,900'
		];
		chromeArgs.push('--user-data-dir=' + profileDir, url);
		var chrome = childProcess.spawn(CHROME, chromeArgs,
			{stdio: 'ignore'});

		var done = false;

		// Kills the chrome process tree and runs fn only after the process
		// has exited: resolving while chrome is still shutting down makes
		// the profileDir cleanup in main() race its file locks, which on
		// Windows leaks the whole profile dir (~90MB per run)
		var stopChrome = function(fn)
		{
			var finished = false;
			var fallback = null;

			var onExit = function()
			{
				if (!finished)
				{
					finished = true;
					clearTimeout(fallback);
					fn();
				}
			};

			if (chrome.exitCode != null)
			{
				onExit();
				return;
			}

			chrome.once('exit', onExit);
			fallback = setTimeout(onExit, 5000);

			if (process.platform == 'win32')
			{
				// SIGKILL only terminates the browser process; renderer
				// children keep profileDir locked past its exit event
				childProcess.spawn('taskkill',
					['/pid', String(chrome.pid), '/T', '/F'],
					{stdio: 'ignore'});
			}
			else
			{
				chrome.kill('SIGKILL');
			}
		};

		var timer = setTimeout(function()
		{
			if (!done)
			{
				done = true;
				resultWaiter = null;
				stopChrome(function()
				{
					resolve({pass: false, seed: seed, scenario: scenario,
						failures: [{kind: 'timeout',
							detail: 'no result after ' + timeoutMs + 'ms'}]});
				});
			}
		}, timeoutMs);

		resultWaiter = {
			resolve: function(result)
			{
				if (!done)
				{
					done = true;
					clearTimeout(timer);
					stopChrome(function()
					{
						resolve(result);
					});
				}
			},
			reject: function(err)
			{
				if (!done)
				{
					done = true;
					clearTimeout(timer);
					stopChrome(function()
					{
						resolve({pass: false, seed: seed,
							scenario: scenario,
							failures: [{kind: 'runner',
								detail: err.message}]});
					});
				}
			}
		};

		chrome.on('exit', function()
		{
			if (!done)
			{
				done = true;
				clearTimeout(timer);
				resultWaiter = null;
				resolve({pass: false, seed: seed, scenario: scenario,
					failures: [{kind: 'chrome-exit',
						detail: 'chrome exited before reporting'}]});
			}
		});
	});
}

// Removes profile dirs orphaned by aborted or crashed earlier runs; a
// dir older than an hour cannot belong to a live runner (runOnce is
// bounded by --timeout, well below that)
function sweepStaleProfiles()
{
	var cutoff = Date.now() - 3600000;

	try
	{
		fs.readdirSync(os.tmpdir()).forEach(function(name)
		{
			if (name.indexOf('rt-test-chrome-') == 0)
			{
				var dir = path.join(os.tmpdir(), name);

				try
				{
					if (fs.statSync(dir).mtimeMs < cutoff)
					{
						fs.rmSync(dir, {recursive: true, force: true,
							maxRetries: 2, retryDelay: 100});
					}
				}
				catch (e)
				{
					// locked or vanished: leave it for the next sweep
				}
			}
		});
	}
	catch (e)
	{
		// tmpdir not readable: nothing to sweep
	}
}

// --- Main ---------------------------------------------------------------
// Expands the 'all' keyword to every scenario defined in the
// orchestrator. Parsed from the source rather than duplicated here, so
// a newly added scenario joins the gate by existing - the previous
// default ran the five random scenarios only, which left every
// scripted permanent lock out unless someone typed its name.
function allScenarios()
{
	var src = fs.readFileSync(path.join(RTTEST, 'orchestrator.html'), 'utf8');
	var re = /^\s+'([\w-]+)':\s*\{/gm;
	var result = [];
	var m = null;

	while ((m = re.exec(src)) != null)
	{
		result.push(m[1]);
	}

	return result;
}

function expandScenarios(value)
{
	var result = [];

	value.split(',').forEach(function(name)
	{
		if (name == 'all')
		{
			result = result.concat(allScenarios());
		}
		else if (name != '')
		{
			result.push(name);
		}
	});

	return result;
}

// Pin evidence to the code actually loaded, including uncommitted fixture edits.
function provenance(args)
{
	function git(argv)
	{
		try { return childProcess.execFileSync('git', argv, {cwd: REPO, encoding: 'utf8'}).trim(); }
		catch (e) { return null; }
	}
	var files = ['etc/rt-test/run.js', 'etc/rt-test/harness.js', 'etc/rt-test/backend.js',
		'etc/rt-test/rollout.js', 'etc/rt-test/descriptor-backend.js', 'etc/rt-test/coverage.js', 'etc/rt-test/orchestrator.html'];
	var hash = crypto.createHash('sha256');
	files.forEach(function(file) { hash.update(file + '\0'); hash.update(fs.readFileSync(path.join(REPO, file))); });
	var browser = null;
	try { browser = childProcess.execFileSync(CHROME, ['--version'], {encoding: 'utf8'}).trim(); } catch (e) {}
	return {head: git(['rev-parse', 'HEAD']), dirty: git(['status', '--porcelain', '--untracked-files=no']) != '',
		fixtureSha256: hash.digest('hex'), browser: browser, node: process.version, platform: process.platform,
		timing: args.timing || 'controlled', extra: args.extra || '', startedAt: new Date().toISOString()};
}

async function main()
{
	var args = parseArgs(process.argv);

	if (args.timing == 'real')
	{
		args.extra = (args.extra != '' && args.extra != null) ?
			args.extra + '&timing=real' : 'timing=real';
	}

	var seeds = expandSeeds(args.seeds);
	var scenarios = expandScenarios(args.scenarios);
	if (scenarios.indexOf('rollout-mixed-source') >= 0)
	{
		try { childProcess.execFileSync('git', ['cat-file', '-e',
			'c6c7ce5b31bb7b1f1377f97a9e25d4b94be0c073:src/main/webapp/index.html'], {cwd: REPO}); }
		catch (e) { throw new Error('Fetch historical v6 commit c6c7ce5b31bb7b1f1377f97a9e25d4b94be0c073 before running rollout-mixed-source'); }
	}

	var server = createServer();

	await new Promise(function(resolve)
	{
		server.listen(args.port, '127.0.0.1', resolve);
	});

	var port = server.address().port;
	var base = 'http://127.0.0.1:' + port;

	if (args.urlOnly)
	{
		scenarios.forEach(function(scenario)
		{
			seeds.forEach(function(seed)
			{
				console.log(base + '/rt-test/orchestrator.html?scenario=' +
					scenario + '&seed=' + seed);
			});
		});
		console.log('server running on ' + base + ' (ctrl-c to stop)');

		return;
	}

	if (args.serveOnly)
	{
		console.log('serving webapp + /rt-test on ' + base +
			' (ctrl-c to stop)');

		return;
	}

	if (!fs.existsSync(CHROME))
	{
		console.error('Chrome not found at ' + CHROME +
			' (set CHROME_BIN)');
		process.exit(2);
	}

	sweepStaleProfiles();

	// Per-process results file: concurrent runners (other sessions
	// validating in parallel) must not truncate each other's rows
	var logPath = path.join(RTTEST, 'results-' + process.pid + '.jsonl');
	fs.writeFileSync(logPath, '');
	var failures = [];
	var total = 0;

	for (var s = 0; s < scenarios.length; s++)
	{
		for (var i = 0; i < seeds.length; i++)
		{
			var scenario = scenarios[s];
			var seed = seeds[i];
			var profileDir = fs.mkdtempSync(
				path.join(os.tmpdir(), 'rt-test-chrome-'));
			total++;

			var started = Date.now();
			var evidence = provenance(args);
			var result = await runOnce(port, scenario, seed,
				args.timeout, profileDir, args.extra, args.watch);
			var secs = Math.round((Date.now() - started) / 100) / 10;

			evidence.fixtureUnchangedDuringRun = provenance(args).fixtureSha256 == evidence.fixtureSha256;
			result.provenance = evidence;
			fs.appendFileSync(logPath, JSON.stringify(result) + '\n');

			if (!args.keep)
			{
				try
				{
					fs.rmSync(profileDir, {recursive: true, force: true,
						maxRetries: 10, retryDelay: 500});
				}
				catch (e)
				{
					console.log('warning: profile dir not removed: ' +
						profileDir + ' (' + e.message + ')');
				}
			}

			if (result.pass)
			{
				console.log('PASS ' + scenario + ' seed=' + seed +
					' (' + secs + 's, ' +
					((result.stats != null) ? result.stats.messages : '?') +
					' msgs)' + ((result.stats != null &&
					result.stats.latency != null) ? ' latency=' +
					JSON.stringify(result.stats.latency) : ''));
			}
			else
			{
				failures.push(result);
				console.log('FAIL ' + scenario + ' seed=' + seed +
					' (' + secs + 's)');
				result.failures.slice(0, 6).forEach(function(f)
				{
					console.log('     - ' + f.kind + ': ' +
						String(f.detail).substring(0, 300));
				});
				console.log('     repro: ' + base +
					'/rt-test/orchestrator.html?scenario=' +
					scenario + '&seed=' + seed);
			}
		}
	}

	console.log('\n' + (total - failures.length) + '/' + total +
		' passed' + ((failures.length > 0) ? ', ' + failures.length +
		' FAILED' : '') + ' (results: ' + logPath + ')');
	server.close();
	process.exit(failures.length > 0 ? 1 : 0);
}

main().catch(function(e)
{
	console.error(e);
	process.exit(2);
});
