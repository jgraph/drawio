// Minimal dependency-free WebSocket client + CDP session (client frames
// are masked per RFC6455; server frames arrive unmasked; control frames
// are answered inline and never interleave into fragmented messages).
'use strict';

var http = require('http');
var net = require('net');
var crypto = require('crypto');

function httpGetJson(url)
{
	return new Promise(function(resolve, reject)
	{
		http.get(url, function(res)
		{
			var b = '';
			res.on('data', function(c) { b += c; });
			res.on('end', function()
			{
				try { resolve(JSON.parse(b)); } catch (e) { reject(e); }
			});
		}).on('error', reject);
	});
}

function WS(sock)
{
	this.sock = sock;
	this.buf = Buffer.alloc(0);
	this.parts = [];
	this.onmessage = null;
	this.onclose = null;
	var self = this;
	sock.on('data', function(d) { self._data(d); });
	sock.on('close', function() { if (self.onclose) self.onclose(); });
	sock.on('error', function() {});
}

WS.connect = function(host, port, path)
{
	return new Promise(function(resolve, reject)
	{
		var key = crypto.randomBytes(16).toString('base64');
		var sock = net.connect(port, host, function()
		{
			sock.write('GET ' + path + ' HTTP/1.1\r\n' +
				'Host: ' + host + ':' + port + '\r\n' +
				'Upgrade: websocket\r\nConnection: Upgrade\r\n' +
				'Sec-WebSocket-Key: ' + key + '\r\n' +
				'Sec-WebSocket-Version: 13\r\n\r\n');
		});
		var hs = Buffer.alloc(0);
		var onData = function(d)
		{
			hs = Buffer.concat([hs, d]);
			var idx = hs.indexOf('\r\n\r\n');

			if (idx >= 0)
			{
				sock.removeListener('data', onData);
				var status = hs.slice(0, idx).toString().split('\r\n')[0];

				if (status.indexOf(' 101 ') < 0)
				{
					reject(new Error('WS handshake: ' + status));
					sock.destroy();
					return;
				}

				var ws = new WS(sock);
				resolve(ws);

				if (idx + 4 < hs.length)
				{
					ws._data(hs.slice(idx + 4));
				}
			}
		};
		sock.on('data', onData);
		sock.on('error', reject);
	});
};

WS.prototype._data = function(d)
{
	this.buf = Buffer.concat([this.buf, d]);

	while (true)
	{
		var b = this.buf;
		if (b.length < 2) break;
		var fin = (b[0] & 0x80) != 0;
		var op = b[0] & 0x0f;
		var len = b[1] & 0x7f;
		var off = 2;

		if (len == 126)
		{
			if (b.length < 4) break;
			len = b.readUInt16BE(2);
			off = 4;
		}
		else if (len == 127)
		{
			if (b.length < 10) break;
			len = Number(b.readBigUInt64BE(2));
			off = 10;
		}

		if ((b[1] & 0x80) != 0) off += 4;
		if (b.length < off + len) break;
		var payload = b.slice(off, off + len);
		this.buf = b.slice(off + len);

		if (op == 9) { this._send(10, payload); continue; }
		if (op == 8) { this.sock.destroy(); break; }

		this.parts.push(payload);

		if (fin)
		{
			var msg = Buffer.concat(this.parts).toString('utf8');
			this.parts = [];
			if (this.onmessage) this.onmessage(msg);
		}
	}
};

WS.prototype._send = function(op, payload)
{
	var mask = crypto.randomBytes(4);
	var len = payload.length;
	var head;

	if (len < 126)
	{
		head = Buffer.alloc(2);
		head[1] = 0x80 | len;
	}
	else if (len < 65536)
	{
		head = Buffer.alloc(4);
		head[1] = 0x80 | 126;
		head.writeUInt16BE(len, 2);
	}
	else
	{
		head = Buffer.alloc(10);
		head[1] = 0x80 | 127;
		head.writeBigUInt64BE(BigInt(len), 2);
	}

	head[0] = 0x80 | op;
	var body = Buffer.from(payload);
	for (var i = 0; i < body.length; i++) body[i] ^= mask[i & 3];
	this.sock.write(Buffer.concat([head, mask, body]));
};

WS.prototype.send = function(text)
{
	this._send(1, Buffer.from(text, 'utf8'));
};

function CDP(ws)
{
	this.ws = ws;
	this.nextId = 0;
	this.pending = {};
	this.handlers = {};
	var self = this;
	ws.onmessage = function(m)
	{
		var o;
		try { o = JSON.parse(m); } catch (e) { return; }

		if (o.id != null && self.pending[o.id] != null)
		{
			var p = self.pending[o.id];
			delete self.pending[o.id];
			if (o.error) p.reject(new Error(o.error.message));
			else p.resolve(o.result);
		}
		else if (o.method != null)
		{
			(self.handlers[o.method] || []).forEach(function(h)
			{
				try { h(o.params); } catch (e) {}
			});
		}
	};
}

CDP.prototype.call = function(method, params)
{
	var self = this;
	return new Promise(function(resolve, reject)
	{
		var id = ++self.nextId;
		self.pending[id] = {resolve: resolve, reject: reject};
		self.ws.send(JSON.stringify({id: id, method: method,
			params: params || {}}));
	});
};

CDP.prototype.on = function(method, handler)
{
	(this.handlers[method] = this.handlers[method] || []).push(handler);
};

// Evaluates the expression in the page, returns the JSON value
CDP.prototype.eval = async function(expr)
{
	var r = await this.call('Runtime.evaluate', {expression: expr,
		returnByValue: true, awaitPromise: true});

	if (r.exceptionDetails != null)
	{
		var d = r.exceptionDetails;
		throw new Error('eval: ' + ((d.exception != null &&
			d.exception.description != null) ? d.exception.description :
			d.text));
	}

	return (r.result != null) ? r.result.value : undefined;
};

module.exports = {httpGetJson: httpGetJson, WS: WS, CDP: CDP};
