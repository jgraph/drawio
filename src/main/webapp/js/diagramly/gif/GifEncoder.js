/**
 * Minimal GIF89a encoder with no external dependencies.
 * Supports animated GIFs with per-frame delay, looping, and transparency.
 *
 * Usage:
 *   var enc = new GifEncoder(width, height);
 *   enc.setRepeat(0);    // 0 = loop forever
 *   enc.setDelay(100);   // default ms between frames
 *   enc.setPalette(GifEncoder.createPalette([imageData1.data, ...]));
 *   enc.addFrame(canvas);
 *   enc.addFrame(canvas2, 400); // per-frame delay
 *   var blob = enc.finish();
 *
 * Without setPalette the palette is quantized from the first frame. Opaque
 * frames are written as the changed rectangle of the previous frame (disposal
 * "do not dispose"), and frames identical to the previous one extend its delay
 * instead of being written again. Transparent output keeps full frames that
 * restore to the background, as a pixel cannot turn transparent otherwise.
 */
function GifEncoder(width, height)
{
	this.width = width;
	this.height = height;
	this.delay = 100;
	this.repeat = 0;
	this.transparent = false;
	this.palette = null;
	this.transparentIndex = -1;
	this.out = new GifEncoder.ByteArray();
	this.frameCount = 0;
	this.started = false;
	this.pending = null;
	this.previous = null;
	this.colorCache = null;
	this.time = 0;
	this.written = 0;
};

/**
 * Sets the default delay between frames in milliseconds.
 */
GifEncoder.prototype.setDelay = function(ms)
{
	this.delay = Math.max(10, Math.round(ms));
};

/**
 * Sets the number of times the animation should loop.
 * 0 = loop forever, -1 = no repeat.
 */
GifEncoder.prototype.setRepeat = function(count)
{
	this.repeat = count;
};

/**
 * Enables or disables transparent background.
 */
GifEncoder.prototype.setTransparent = function(enabled)
{
	this.transparent = enabled;
};

/**
 * Sets the global palette as an array of [r, g, b] entries (see
 * GifEncoder.createPalette). Must be called before the first frame.
 */
GifEncoder.prototype.setPalette = function(palette)
{
	this.palette = palette.slice(0, (this.transparent) ? 255 : 256);

	while (this.palette.length < 2)
	{
		this.palette.push([0, 0, 0]);
	}

	if (this.transparent)
	{
		this.transparentIndex = this.palette.length;
		this.palette.push([0, 0, 0]);
	}
};

/**
 * Adds a frame from an HTML5 canvas element. The optional delay (ms)
 * overrides the default delay for this frame.
 */
GifEncoder.prototype.addFrame = function(canvas, delay)
{
	var ctx = canvas.getContext('2d');
	var pixels = ctx.getImageData(0, 0, this.width, this.height).data;
	delay = (delay != null) ? delay : this.delay;

	if (!this.started)
	{
		if (this.palette == null)
		{
			this.setPalette(GifEncoder.createPalette([pixels],
				256, this.transparent));
		}

		this.started = true;
		this.colorCache = new Map();
		this.writeHeader();
		this.writeLogicalScreenDescriptor(this.palette);
		this.writeGlobalColorTable(this.palette);

		if (this.repeat >= 0)
		{
			this.writeNetscapeExtension();
		}
	}

	var indexed = this.mapPixels(pixels);
	var rect = {x: 0, y: 0, width: this.width, height: this.height};

	if (this.previous != null)
	{
		var changed = GifEncoder.getChangedRect(this.previous,
			indexed, this.width, this.height);

		if (changed == null)
		{
			// Same image as the previous frame
			this.pending.delay += delay;

			return;
		}
		else if (!this.transparent)
		{
			rect = changed;
		}
	}

	this.flushPending();
	this.pending = {rect: rect, delay: delay, pixels:
		GifEncoder.cropPixels(indexed, this.width, rect)};
	this.previous = indexed;
};

/**
 * Maps the given RGBA pixels to palette indices.
 */
GifEncoder.prototype.mapPixels = function(pixels)
{
	var numPixels = pixels.length / 4;
	var indexed = new Uint8Array(numPixels);
	var palette = this.palette;
	var cache = this.colorCache;
	var ti = this.transparentIndex;

	for (var i = 0; i < numPixels; i++)
	{
		var off = i * 4;

		if (ti >= 0 && pixels[off + 3] < 128)
		{
			indexed[i] = ti;
		}
		else
		{
			var key = (pixels[off] << 16) | (pixels[off + 1] << 8) | pixels[off + 2];
			var idx = cache.get(key);

			if (idx === undefined)
			{
				idx = GifEncoder.findClosest(palette, pixels[off],
					pixels[off + 1], pixels[off + 2], ti);
				cache.set(key, idx);
			}

			indexed[i] = idx;
		}
	}

	return indexed;
};

/**
 * Writes the frame waiting for its final delay.
 */
GifEncoder.prototype.flushPending = function()
{
	if (this.pending != null)
	{
		// Distributes the rounding to 1/100 s over the frames so that
		// the total duration stays exact. Browsers slow down delays
		// below 2/100 s to 1/10 s so they are clamped at 2/100 s.
		this.time += this.pending.delay;
		var cs = Math.max(2, Math.round(this.time / 10) - this.written);
		this.written += cs;

		this.writeGraphicControlExtension(this.transparentIndex, cs);
		this.writeImageDescriptor(this.pending.rect);
		this.writeImageData(this.pending.pixels, this.palette);
		this.frameCount++;
		this.pending = null;
	}
};

/**
 * Finishes encoding and returns the result as a Blob.
 */
GifEncoder.prototype.finish = function()
{
	if (!this.started)
	{
		return null;
	}

	this.flushPending();
	this.out.push(0x3B); // GIF trailer

	return new Blob([this.out.toUint8Array()], {type: 'image/gif'});
};

/**
 * Writes GIF89a header.
 */
GifEncoder.prototype.writeHeader = function()
{
	this.writeString('GIF89a');
};

/**
 * Writes the logical screen descriptor.
 */
GifEncoder.prototype.writeLogicalScreenDescriptor = function(palette)
{
	this.writeShort(this.width);
	this.writeShort(this.height);

	var colorTableSize = GifEncoder.colorTableSizeFor(palette.length);

	// Packed field: GCT flag (1) | color resolution (3) | sort (1) | GCT size (3)
	var packed = 0x80 | // global color table flag
		((7) << 4) | // color resolution (8 bits per primary)
		0 | // sort flag
		colorTableSize; // size of GCT
	this.out.push(packed);
	this.out.push(0); // background color index
	this.out.push(0); // pixel aspect ratio
};

/**
 * Writes the global color table.
 */
GifEncoder.prototype.writeGlobalColorTable = function(palette)
{
	var tableSize = GifEncoder.colorTableEntries(palette.length);

	for (var i = 0; i < tableSize; i++)
	{
		if (i < palette.length)
		{
			this.out.push(palette[i][0]); // R
			this.out.push(palette[i][1]); // G
			this.out.push(palette[i][2]); // B
		}
		else
		{
			this.out.push(0);
			this.out.push(0);
			this.out.push(0);
		}
	}
};

/**
 * Writes the Netscape 2.0 application extension for looping.
 */
GifEncoder.prototype.writeNetscapeExtension = function()
{
	this.out.push(0x21); // extension introducer
	this.out.push(0xFF); // application extension
	this.out.push(11);   // block size
	this.writeString('NETSCAPE2.0');
	this.out.push(3);    // sub-block size
	this.out.push(1);    // sub-block index
	this.writeShort(this.repeat); // loop count (0 = forever)
	this.out.push(0);    // block terminator
};

/**
 * Writes the graphic control extension for the current frame with the
 * given delay in 1/100 seconds.
 */
GifEncoder.prototype.writeGraphicControlExtension = function(transparentIndex, delay)
{
	this.out.push(0x21); // extension introducer
	this.out.push(0xF9); // graphic control label
	this.out.push(4);    // block size

	var hasTransparency = (transparentIndex >= 0);
	// Disposal 2 restores to background for transparent full frames,
	// disposal 1 keeps the frame so that the next one can be a subimage
	var dispose = (this.transparent) ? 2 : 1;

	// Packed: reserved (3) | disposal (3) | user input (1) | transparent (1)
	var packed = (dispose << 2) | (hasTransparency ? 1 : 0);
	this.out.push(packed);
	this.writeShort(Math.min(0xFFFF, delay));
	this.out.push(hasTransparency ? transparentIndex : 0);
	this.out.push(0); // block terminator
};

/**
 * Writes the image descriptor for the given frame rectangle.
 */
GifEncoder.prototype.writeImageDescriptor = function(rect)
{
	this.out.push(0x2C); // image separator
	this.writeShort(rect.x);
	this.writeShort(rect.y);
	this.writeShort(rect.width);
	this.writeShort(rect.height);
	this.out.push(0);    // no local color table, no interlace
};

/**
 * Writes LZW-compressed image data.
 */
GifEncoder.prototype.writeImageData = function(indexedPixels, palette)
{
	var colorDepth = GifEncoder.colorDepthFor(palette.length);
	var minCodeSize = Math.max(2, colorDepth);

	this.out.push(minCodeSize);

	var encoded = GifEncoder.lzwEncode(indexedPixels, minCodeSize);

	// Write in sub-blocks of max 255 bytes
	var offset = 0;

	while (offset < encoded.length)
	{
		var blockSize = Math.min(255, encoded.length - offset);
		this.out.push(blockSize);
		this.out.pushArray(encoded, offset, blockSize);
		offset += blockSize;
	}

	this.out.push(0); // block terminator
};

/**
 * Writes a 16-bit little-endian value.
 */
GifEncoder.prototype.writeShort = function(val)
{
	this.out.push(val & 0xFF);
	this.out.push((val >> 8) & 0xFF);
};

/**
 * Writes a string as bytes.
 */
GifEncoder.prototype.writeString = function(str)
{
	for (var i = 0; i < str.length; i++)
	{
		this.out.push(str.charCodeAt(i));
	}
};

// --- Static methods ---

/**
 * Growable byte buffer.
 */
GifEncoder.ByteArray = function()
{
	this.data = new Uint8Array(65536);
	this.length = 0;
};

/**
 * Makes room for the given number of additional bytes.
 */
GifEncoder.ByteArray.prototype.ensure = function(n)
{
	if (this.length + n > this.data.length)
	{
		var size = this.data.length * 2;

		while (size < this.length + n)
		{
			size *= 2;
		}

		var tmp = new Uint8Array(size);
		tmp.set(this.data.subarray(0, this.length));
		this.data = tmp;
	}
};

/**
 * Appends a byte.
 */
GifEncoder.ByteArray.prototype.push = function(value)
{
	this.ensure(1);
	this.data[this.length++] = value;
};

/**
 * Appends count bytes of the given array starting at offset.
 */
GifEncoder.ByteArray.prototype.pushArray = function(arr, offset, count)
{
	this.ensure(count);
	this.data.set(arr.subarray(offset, offset + count), this.length);
	this.length += count;
};

/**
 * Returns the written bytes.
 */
GifEncoder.ByteArray.prototype.toUint8Array = function()
{
	return this.data.slice(0, this.length);
};

/**
 * Returns the bounding rectangle of the pixels that differ between the
 * given indexed frames or null if the frames are identical.
 */
GifEncoder.getChangedRect = function(prev, next, width, height)
{
	var minX = width, minY = height, maxX = -1, maxY = -1;

	for (var y = 0; y < height; y++)
	{
		var row = y * width;
		var x0 = 0;

		while (x0 < width && prev[row + x0] == next[row + x0])
		{
			x0++;
		}

		if (x0 < width)
		{
			var x1 = width - 1;

			while (x1 > x0 && prev[row + x1] == next[row + x1])
			{
				x1--;
			}

			minX = Math.min(minX, x0);
			maxX = Math.max(maxX, x1);
			minY = Math.min(minY, y);
			maxY = y;
		}
	}

	return (maxY < 0) ? null : {x: minX, y: minY,
		width: maxX - minX + 1, height: maxY - minY + 1};
};

/**
 * Returns the indexed pixels inside the given rectangle.
 */
GifEncoder.cropPixels = function(indexed, width, rect)
{
	if (rect.x == 0 && rect.y == 0 && rect.width == width &&
		rect.height * width == indexed.length)
	{
		return indexed;
	}

	var result = new Uint8Array(rect.width * rect.height);

	for (var y = 0; y < rect.height; y++)
	{
		var start = (rect.y + y) * width + rect.x;
		result.set(indexed.subarray(start, start + rect.width), y * rect.width);
	}

	return result;
};

/**
 * Returns the GIF color table size field value for the given palette length.
 */
GifEncoder.colorTableSizeFor = function(paletteLength)
{
	var n = 0;

	while ((2 << n) < paletteLength)
	{
		n++;
	}

	return Math.min(n, 7);
};

/**
 * Returns the number of entries in the color table (must be power of 2).
 */
GifEncoder.colorTableEntries = function(paletteLength)
{
	var size = 2;

	while (size < paletteLength)
	{
		size *= 2;
	}

	return Math.min(size, 256);
};

/**
 * Returns bits needed to represent the palette.
 */
GifEncoder.colorDepthFor = function(paletteLength)
{
	var bits = 1;

	while ((1 << bits) < paletteLength)
	{
		bits++;
	}

	return bits;
};

/**
 * Creates a palette of at most maxColors [r, g, b] entries (one less if
 * useTransparency is true, as setPalette adds the transparent entry) for
 * the given list of RGBA pixel arrays, eg. a few sampled frames of an
 * animation. Frequent colors (the flat fills, strokes and text of a
 * diagram) are kept exactly, the remaining colors (anti-aliasing) are
 * reduced via median cut.
 */
GifEncoder.createPalette = function(pixelArrays, maxColors, useTransparency)
{
	maxColors = ((maxColors != null) ? maxColors : 256) -
		((useTransparency) ? 1 : 0);
	var total = 0;

	for (var i = 0; i < pixelArrays.length; i++)
	{
		total += pixelArrays[i].length / 4;
	}

	var step = Math.max(1, Math.floor(total / 500000));
	var counts = new Map();
	var samples = 0;

	for (var i = 0; i < pixelArrays.length; i++)
	{
		var pixels = pixelArrays[i];
		var numPixels = pixels.length / 4;

		for (var j = 0; j < numPixels; j += step)
		{
			var off = j * 4;

			if (pixels[off + 3] >= 128)
			{
				var key = (pixels[off] << 16) | (pixels[off + 1] << 8) | pixels[off + 2];
				counts.set(key, (counts.get(key) || 0) + 1);
				samples++;
			}
		}
	}

	var entries = [];

	counts.forEach(function(count, key)
	{
		entries.push([key, count]);
	});

	var toColor = function(key)
	{
		return [(key >> 16) & 0xFF, (key >> 8) & 0xFF, key & 0xFF];
	};

	var palette = [];

	if (entries.length <= maxColors)
	{
		for (var i = 0; i < entries.length; i++)
		{
			palette.push(toColor(entries[i][0]));
		}
	}
	else
	{
		entries.sort(function(a, b)
		{
			return b[1] - a[1];
		});

		var maxExact = Math.floor(maxColors * 0.6);
		var threshold = Math.max(2, samples * 0.0005);
		var i = 0;

		while (i < entries.length && i < maxExact && entries[i][1] >= threshold)
		{
			palette.push(toColor(entries[i][0]));
			i++;
		}

		// Weights the remaining colors by their (capped) frequency
		var rest = [];

		for (; i < entries.length; i++)
		{
			var color = toColor(entries[i][0]);

			for (var j = Math.min(8, entries[i][1]); j > 0; j--)
			{
				rest.push(color);
			}
		}

		// Limits the cost of sorting in the median cut
		if (rest.length > 100000)
		{
			var stride = rest.length / 100000;
			var sampled = [];

			for (var j = 0; j < rest.length; j += stride)
			{
				sampled.push(rest[Math.floor(j)]);
			}

			rest = sampled;
		}

		palette = palette.concat(GifEncoder.medianCut(rest,
			maxColors - palette.length));
	}

	// Ensure at least 2 colors (GIF minimum)
	while (palette.length < 2)
	{
		palette.push([0, 0, 0]);
	}

	return palette;
};

/**
 * Median-cut color quantization.
 * Reduces RGBA pixel data to at most maxColors RGB palette entries.
 * Returns {palette, indexedPixels, transparentIndex}.
 */
GifEncoder.quantize = function(pixels, maxColors, useTransparency)
{
	var palette = GifEncoder.createPalette([pixels], maxColors, useTransparency);
	var transparentIndex = -1;

	if (useTransparency)
	{
		transparentIndex = palette.length;
		palette.push([0, 0, 0]);
	}

	var numPixels = pixels.length / 4;
	var indexedPixels = new Uint8Array(numPixels);

	for (var i = 0; i < numPixels; i++)
	{
		var off = i * 4;

		if (useTransparency && pixels[off + 3] < 128)
		{
			indexedPixels[i] = transparentIndex;
		}
		else
		{
			indexedPixels[i] = GifEncoder.findClosest(
				palette, pixels[off], pixels[off + 1], pixels[off + 2],
				transparentIndex);
		}
	}

	return {
		palette: palette,
		indexedPixels: indexedPixels,
		transparentIndex: transparentIndex
	};
};

/**
 * Returns array of unique [r,g,b] values from the input.
 */
GifEncoder.uniqueColors = function(colors)
{
	var seen = {};
	var result = [];

	for (var i = 0; i < colors.length; i++)
	{
		var key = (colors[i][0] << 16) | (colors[i][1] << 8) | colors[i][2];

		if (seen[key] == null)
		{
			seen[key] = true;
			result.push(colors[i]);
		}
	}

	return result;
};

/**
 * Median-cut quantization. Recursively splits color space.
 */
GifEncoder.medianCut = function(colors, maxColors)
{
	if (colors.length == 0 || maxColors <= 0)
	{
		return [];
	}

	var buckets = [colors];

	while (buckets.length < maxColors)
	{
		// Find bucket with greatest range
		var maxRange = -1;
		var maxIdx = 0;

		for (var i = 0; i < buckets.length; i++)
		{
			if (buckets[i].length <= 1)
			{
				continue;
			}

			var range = GifEncoder.colorRange(buckets[i]);

			if (range.maxRange > maxRange)
			{
				maxRange = range.maxRange;
				maxIdx = i;
			}
		}

		if (maxRange <= 0)
		{
			break;
		}

		var bucket = buckets[maxIdx];
		var range = GifEncoder.colorRange(bucket);

		// Sort by the channel with the largest range
		bucket.sort(function(a, b)
		{
			return a[range.channel] - b[range.channel];
		});

		var mid = Math.floor(bucket.length / 2);
		buckets.splice(maxIdx, 1, bucket.slice(0, mid), bucket.slice(mid));
	}

	// Average each bucket to get palette colors
	var palette = [];

	for (var i = 0; i < buckets.length; i++)
	{
		var b = buckets[i];
		var r = 0, g = 0, bl = 0;

		for (var j = 0; j < b.length; j++)
		{
			r += b[j][0];
			g += b[j][1];
			bl += b[j][2];
		}

		palette.push([
			Math.round(r / b.length),
			Math.round(g / b.length),
			Math.round(bl / b.length)
		]);
	}

	return palette;
};

/**
 * Returns the channel with the largest range and its magnitude.
 */
GifEncoder.colorRange = function(colors)
{
	var minR = 255, maxR = 0, minG = 255, maxG = 0, minB = 255, maxB = 0;

	for (var i = 0; i < colors.length; i++)
	{
		var c = colors[i];

		if (c[0] < minR) minR = c[0]; if (c[0] > maxR) maxR = c[0];
		if (c[1] < minG) minG = c[1]; if (c[1] > maxG) maxG = c[1];
		if (c[2] < minB) minB = c[2]; if (c[2] > maxB) maxB = c[2];
	}

	var rangeR = maxR - minR;
	var rangeG = maxG - minG;
	var rangeB = maxB - minB;

	if (rangeR >= rangeG && rangeR >= rangeB)
	{
		return {channel: 0, maxRange: rangeR};
	}
	else if (rangeG >= rangeR && rangeG >= rangeB)
	{
		return {channel: 1, maxRange: rangeG};
	}
	else
	{
		return {channel: 2, maxRange: rangeB};
	}
};

/**
 * Finds the closest palette color index using squared Euclidean distance.
 */
GifEncoder.findClosest = function(palette, r, g, b, skipIndex)
{
	var minDist = Infinity;
	var minIdx = 0;

	for (var i = 0; i < palette.length; i++)
	{
		if (i === skipIndex)
		{
			continue;
		}

		var dr = r - palette[i][0];
		var dg = g - palette[i][1];
		var db = b - palette[i][2];
		var dist = dr * dr + dg * dg + db * db;

		if (dist < minDist)
		{
			minDist = dist;
			minIdx = i;

			if (dist == 0)
			{
				break;
			}
		}
	}

	return minIdx;
};

/**
 * LZW encodes the indexed pixel data.
 * Returns a Uint8Array of the compressed bytes.
 */
GifEncoder.lzwEncode = function(indexedPixels, minCodeSize)
{
	var clearCode = 1 << minCodeSize;
	var eoiCode = clearCode + 1;
	var codeSize = minCodeSize + 1;
	var nextCode = eoiCode + 1;
	var maxCode = (1 << codeSize);

	// Maps (prefix code << 8 | pixel) to the code of the sequence
	var codeTable = new Map();
	var bitBuffer = 0;
	var bitsInBuffer = 0;
	var output = new GifEncoder.ByteArray();

	var emitCode = function(code)
	{
		bitBuffer |= (code << bitsInBuffer);
		bitsInBuffer += codeSize;

		while (bitsInBuffer >= 8)
		{
			output.push(bitBuffer & 0xFF);
			bitBuffer >>= 8;
			bitsInBuffer -= 8;
		}
	};

	// Start with clear code
	emitCode(clearCode);

	if (indexedPixels.length == 0)
	{
		emitCode(eoiCode);

		if (bitsInBuffer > 0)
		{
			output.push(bitBuffer & 0xFF);
		}

		return output.toUint8Array();
	}

	// Single pixel values are their own codes
	var current = indexedPixels[0];

	for (var i = 1; i < indexedPixels.length; i++)
	{
		var pixel = indexedPixels[i];
		var key = (current << 8) | pixel;
		var code = codeTable.get(key);

		if (code !== undefined)
		{
			current = code;
		}
		else
		{
			emitCode(current);

			if (nextCode < 4096)
			{
				codeTable.set(key, nextCode);
				nextCode++;

				if (nextCode > maxCode && codeSize < 12)
				{
					codeSize++;
					maxCode = (1 << codeSize);
				}
			}
			else
			{
				// Reset code table
				emitCode(clearCode);
				codeTable.clear();
				codeSize = minCodeSize + 1;
				nextCode = eoiCode + 1;
				maxCode = (1 << codeSize);
			}

			current = pixel;
		}
	}

	// Emit remaining
	emitCode(current);
	emitCode(eoiCode);

	if (bitsInBuffer > 0)
	{
		output.push(bitBuffer & 0xFF);
	}

	return output.toUint8Array();
};
