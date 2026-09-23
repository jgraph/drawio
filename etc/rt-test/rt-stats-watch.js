#!/usr/bin/env node
/**
 * Release telemetry (temporary, remove after the v7 soak): polls the
 * fast-rt stats endpoint and prints the connected sockets in total and
 * per advertised protocol version, so socket liveness and the v6 -> v7
 * migration can be watched during a release. Pre-v7 clients advertise
 * no protocol and are counted as "none".
 *
 *   node etc/rt-test/rt-stats-watch.js                # every 120s
 *   node etc/rt-test/rt-stats-watch.js --interval 60
 *   node etc/rt-test/rt-stats-watch.js --once
 *
 * The endpoint requires a draw.io referer; nothing else is sent.
 */
'use strict';

var https = require('https');

var argv = process.argv.slice(2);
var interval = 120;
var once = false;
var host = 'app.diagrams.net';

for (var i = 0; i < argv.length; i++)
{
	if (argv[i] == '--interval')
	{
		interval = Math.max(10, parseInt(argv[++i], 10) || 120);
	}
	else if (argv[i] == '--once')
	{
		once = true;
	}
	else if (argv[i] == '--host')
	{
		host = argv[++i];
	}
}

var first = null;

function pad(value)
{
	return (value < 10 ? '0' : '') + value;
}

function sample()
{
	var req = https.get({host: host, path: '/rt?stats=1',
		headers: {'Referer': 'https://' + host + '/'}, timeout: 60000}, function(res)
	{
		var body = '';
		res.on('data', function(chunk) { body += chunk; });
		res.on('end', function()
		{
			var now = new Date();
			var total = /Total: (\d+)/.exec(body);
			var protocols = /Protocols: (\{.*\})/.exec(body);
			var line = pad(now.getUTCHours()) + ':' + pad(now.getUTCMinutes()) +
				':' + pad(now.getUTCSeconds()) + 'Z';

			if (res.statusCode != 200 || total == null)
			{
				console.log(line + ' error status=' + res.statusCode);
			}
			else
			{
				var count = parseInt(total[1], 10);

				if (first == null)
				{
					first = count;
				}

				var delta = count - first;
				line += ' total=' + count + ' (' + (delta >= 0 ? '+' : '') + delta + ')';

				if (protocols != null)
				{
					try
					{
						var p = JSON.parse(protocols[1]);
						var keys = Object.keys(p).sort();

						for (var j = 0; j < keys.length; j++)
						{
							line += ' pv' + keys[j] + '=' + p[keys[j]] +
								' (' + Math.round(100 * p[keys[j]] / count) + '%)';
						}
					}
					catch (e)
					{
						line += ' protocols=unreadable';
					}
				}
				else
				{
					line += ' protocols=n/a (worker without protocol counts)';
				}

				console.log(line);
			}

			if (!once)
			{
				setTimeout(sample, interval * 1000);
			}
		});
	});

	req.on('error', function(err)
	{
		console.log(new Date().toISOString() + ' error ' + err.message);

		if (!once)
		{
			setTimeout(sample, interval * 1000);
		}
	});

	req.on('timeout', function() { req.destroy(new Error('timeout')); });
}

sample();
