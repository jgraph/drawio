/**
 * Encodes canvas frames to an MP4 video via WebCodecs. Frames get explicit
 * timestamps (frame index / fps) so the video has the exact timing of the
 * animation, independent of how long a frame takes to render. The encoded
 * chunks are written into a minimal MP4 container (single video track,
 * moov before mdat) by Mp4Encoder.createMp4.
 *
 * Usage:
 *   var enc = new Mp4Encoder(width, height, fps);
 *   enc.init(function() { enc.addFrame(canvas, next, error); ... }, error);
 *   enc.finish(function(blob) { ... }, error);
 */
function Mp4Encoder(width, height, fps)
{
	// Encoders require even dimensions (4:2:0 chroma subsampling)
	this.width = width + (width % 2);
	this.height = height + (height % 2);
	this.fps = fps;
	this.frameIndex = 0;
	this.samples = [];
	this.description = null;
	this.encoder = null;
	this.codec = null;
	this.failed = null;
};

/**
 * Codecs in order of preference. H.264 plays everywhere, VP9 in MP4 is the
 * fallback for browsers without an H.264 encoder.
 */
Mp4Encoder.codecs = [
	{codec: 'avc1.640028', type: 'avc'}, // High, level 4.0
	{codec: 'avc1.4d0028', type: 'avc'}, // Main, level 4.0
	{codec: 'avc1.42e01f', type: 'avc'}, // Constrained baseline, level 3.1
	{codec: 'vp09.00.31.08', type: 'vp9'} // Profile 0, level 3.1, 8 bit
];

/**
 * Timescale of the video track (ticks per second).
 */
Mp4Encoder.timescale = 90000;

/**
 * Seconds between key frames.
 */
Mp4Encoder.keyFrameInterval = 2;

/**
 * Returns true if the browser has the WebCodecs API for encoding video.
 */
Mp4Encoder.isSupported = function()
{
	return typeof window.VideoEncoder === 'function' &&
		typeof window.VideoFrame === 'function';
};

/**
 * Finds a supported codec and configures the encoder.
 */
Mp4Encoder.prototype.init = function(success, error)
{
	var self = this;
	var index = 0;

	var tryNext = function()
	{
		if (index >= Mp4Encoder.codecs.length)
		{
			error(new Error(mxResources.get('videoEncodingNotSupported')));

			return;
		}

		var candidate = Mp4Encoder.codecs[index++];
		var config = {
			codec: candidate.codec,
			width: self.width,
			height: self.height,
			bitrate: 6000000,
			framerate: self.fps
		};

		if (candidate.type == 'avc')
		{
			// Length-prefixed NAL units with the parameter sets in
			// the decoder config, which is the MP4 sample format
			config.avc = {format: 'avc'};
		}

		VideoEncoder.isConfigSupported(config).then(function(result)
		{
			if (result != null && result.supported)
			{
				try
				{
					self.codec = candidate;
					self.encoder = new VideoEncoder({
						output: function(chunk, meta)
						{
							self.addChunk(chunk, meta);
						},
						error: function(e)
						{
							self.failed = e;
						}
					});

					self.encoder.configure(config);
					success();
				}
				catch (e)
				{
					error(e);
				}
			}
			else
			{
				tryNext();
			}
		})['catch'](function()
		{
			tryNext();
		});
	};

	tryNext();
};

/**
 * Stores an encoded chunk.
 */
Mp4Encoder.prototype.addChunk = function(chunk, meta)
{
	if (meta != null && meta.decoderConfig != null &&
		meta.decoderConfig.description != null)
	{
		var desc = meta.decoderConfig.description;
		this.description = (desc instanceof ArrayBuffer) ?
			new Uint8Array(desc.slice(0)) :
			new Uint8Array(desc.buffer.slice(desc.byteOffset,
				desc.byteOffset + desc.byteLength));
	}

	var data = new Uint8Array(chunk.byteLength);
	chunk.copyTo(data);

	this.samples.push({data: data, key: chunk.type == 'key',
		timestamp: chunk.timestamp});
};

/**
 * Encodes the given canvas as the next frame. Invokes next once the
 * encoder is ready for more input.
 */
Mp4Encoder.prototype.addFrame = function(canvas, next, error)
{
	if (this.failed != null)
	{
		error(this.failed);

		return;
	}

	try
	{
		var frameDuration = 1000000 / this.fps;
		var frame = new VideoFrame(canvas, {
			timestamp: Math.round(this.frameIndex * frameDuration),
			duration: Math.round(frameDuration)
		});

		var keyFrame = (this.frameIndex % Math.max(1,
			Math.round(this.fps * Mp4Encoder.keyFrameInterval))) == 0;
		this.encoder.encode(frame, {keyFrame: keyFrame});
		frame.close();
		this.frameIndex++;
	}
	catch (e)
	{
		error(e);

		return;
	}

	// Limits the queue of frames waiting to be encoded
	var encoder = this.encoder;

	var wait = function()
	{
		if (encoder.encodeQueueSize > 4)
		{
			window.setTimeout(wait, 5);
		}
		else
		{
			next();
		}
	};

	wait();
};

/**
 * Flushes the encoder and returns the MP4 file as a Blob.
 */
Mp4Encoder.prototype.finish = function(success, error)
{
	var self = this;

	this.encoder.flush().then(function()
	{
		try
		{
			self.encoder.close();

			if (self.failed != null)
			{
				error(self.failed);
			}
			else if (self.samples.length == 0 ||
				(self.codec.type == 'avc' && self.description == null))
			{
				error(new Error(mxResources.get('videoEncodingNotSupported')));
			}
			else
			{
				success(Mp4Encoder.createMp4(self.samples,
					self.width, self.height, self.fps,
					self.codec.type, self.description));
			}
		}
		catch (e)
		{
			error(e);
		}
	})['catch'](function(e)
	{
		error((self.failed != null) ? self.failed : e);
	});
};

/**
 * Stops encoding and discards all frames.
 */
Mp4Encoder.prototype.cancel = function()
{
	try
	{
		if (this.encoder != null && this.encoder.state != 'closed')
		{
			this.encoder.close();
		}
	}
	catch (e)
	{
		// ignore
	}

	this.samples = [];
};

/**
 * Returns an MP4 file (ISO BMFF) with a single video track that contains
 * the given samples as a Blob. Samples must be in presentation order, which
 * holds for WebCodecs encoders as they do not reorder frames. type is 'avc'
 * (description is the avcC record) or 'vp9'.
 */
Mp4Encoder.createMp4 = function(samples, width, height, fps, type, description)
{
	var timescale = Mp4Encoder.timescale;
	var frameTicks = Math.round(timescale / fps);
	var count = samples.length;
	var durations = [];
	var total = 0;

	for (var i = 0; i < count; i++)
	{
		var ticks = frameTicks;

		if (i + 1 < count)
		{
			var delta = Math.round((samples[i + 1].timestamp -
				samples[i].timestamp) * timescale / 1000000);

			if (delta > 0)
			{
				ticks = delta;
			}
		}

		durations.push(ticks);
		total += ticks;
	}

	var enc = new TextEncoder();

	var u32 = function(n)
	{
		return [(n >>> 24) & 0xFF, (n >>> 16) & 0xFF, (n >>> 8) & 0xFF, n & 0xFF];
	};

	var u16 = function(n)
	{
		return [(n >>> 8) & 0xFF, n & 0xFF];
	};

	var zeros = function(n)
	{
		return new Array(n).fill(0);
	};

	var concat = function(parts)
	{
		var len = 0;

		for (var i = 0; i < parts.length; i++)
		{
			len += parts[i].length;
		}

		var result = new Uint8Array(len);
		var off = 0;

		for (var i = 0; i < parts.length; i++)
		{
			result.set(parts[i], off);
			off += parts[i].length;
		}

		return result;
	};

	// Creates a box from the type and a list of byte arrays or boxes
	var box = function(type, parts)
	{
		var content = concat((parts || []).map(function(p)
		{
			return (p instanceof Uint8Array) ? p : new Uint8Array(p);
		}));

		return concat([new Uint8Array(u32(content.length + 8)),
			enc.encode(type), content]);
	};

	var fullBox = function(type, version, flags, parts)
	{
		return box(type, [[version].concat(u32(flags).slice(1))].concat(parts));
	};

	var matrix = [].concat(u32(0x00010000), u32(0), u32(0), u32(0),
		u32(0x00010000), u32(0), u32(0), u32(0), u32(0x40000000));

	var mvhd = fullBox('mvhd', 0, 0, [u32(0), u32(0), u32(timescale),
		u32(total), u32(0x00010000), u16(0x0100), zeros(10), matrix,
		zeros(24), u32(2)]);

	var tkhd = fullBox('tkhd', 0, 3, [u32(0), u32(0), u32(1), u32(0),
		u32(total), zeros(8), u16(0), u16(0), u16(0), u16(0), matrix,
		u32(width << 16), u32(height << 16)]);

	var mdhd = fullBox('mdhd', 0, 0, [u32(0), u32(0), u32(timescale),
		u32(total), u16(0x55C4), u16(0)]);

	var hdlr = fullBox('hdlr', 0, 0, [u32(0), enc.encode('vide'),
		zeros(12), enc.encode('VideoHandler'), [0]]);

	var codecConfig = (type == 'avc') ? box('avcC', [description]) :
		// Profile 0, level 3.1, 8 bit 4:2:0, BT.709, limited range
		fullBox('vpcC', 1, 0, [[0, 31, (8 << 4) | (1 << 1) | 0, 1, 1, 1], u16(0)]);

	var sampleEntry = box((type == 'avc') ? 'avc1' : 'vp09', [zeros(6), u16(1),
		zeros(16), u16(width), u16(height), u32(0x00480000), u32(0x00480000),
		u32(0), u16(1), zeros(32), u16(0x0018), u16(0xFFFF), codecConfig]);

	var stsd = fullBox('stsd', 0, 0, [u32(1), sampleEntry]);

	// Run-length encoded sample durations
	var stts = [];
	var runs = 0;

	for (var i = 0; i < count; i++)
	{
		if (i > 0 && durations[i] == durations[i - 1])
		{
			var last = stts[stts.length - 1];
			last[0]++;
		}
		else
		{
			stts.push([1, durations[i]]);
			runs++;
		}
	}

	var sttsBytes = [u32(runs)];

	for (var i = 0; i < stts.length; i++)
	{
		sttsBytes.push(u32(stts[i][0]), u32(stts[i][1]));
	}

	var keys = [];
	var sizes = [u32(0), u32(count)];
	var mdatSize = 0;

	for (var i = 0; i < count; i++)
	{
		if (samples[i].key)
		{
			keys.push(u32(i + 1));
		}

		sizes.push(u32(samples[i].data.length));
		mdatSize += samples[i].data.length;
	}

	var ftyp = box('ftyp', [enc.encode('isom'), u32(0x200),
		enc.encode('isomiso2' + ((type == 'avc') ? 'avc1' : 'vp09') + 'mp41')]);

	// All samples are stored in one chunk directly after the moov box
	var createMoov = function(offset)
	{
		var stblParts = [stsd, fullBox('stts', 0, 0, sttsBytes)];

		if (keys.length < count)
		{
			stblParts.push(fullBox('stss', 0, 0, [u32(keys.length)].concat(keys)));
		}

		stblParts.push(fullBox('stsc', 0, 0, [u32(1), u32(1), u32(count), u32(1)]));
		stblParts.push(fullBox('stsz', 0, 0, sizes));
		stblParts.push(fullBox('stco', 0, 0, [u32(1), u32(offset)]));

		var minf = box('minf', [fullBox('vmhd', 0, 1, [zeros(8)]),
			box('dinf', [fullBox('dref', 0, 0, [u32(1),
				fullBox('url ', 0, 1, [])])]),
			box('stbl', stblParts)]);

		return box('moov', [mvhd, box('trak', [tkhd,
			box('mdia', [mdhd, hdlr, minf])])]);
	};

	var moovSize = createMoov(0).length;
	var moov = createMoov(ftyp.length + moovSize + 8);
	var parts = [ftyp, moov, new Uint8Array(u32(mdatSize + 8)),
		enc.encode('mdat')];

	for (var i = 0; i < count; i++)
	{
		parts.push(samples[i].data);
	}

	return new Blob(parts, {type: 'video/mp4'});
};
