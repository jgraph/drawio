/**
 * Orchestrates animated GIF export of flow animations.
 * Captures frames by stepping stroke-dashoffset values on animated edges
 * and rasterizing each frame to canvas.
 *
 * Usage:
 *   var exp = new AnimatedGifExport(editorUi);
 *   exp.doExport({fps: 15, duration: 1000, scale: 1, ...}, function(blob) { ... });
 */
function AnimatedGifExport(editorUi)
{
	this.editorUi = editorUi;
};

/**
 * Exports the current diagram as an animated GIF.
 *
 * Options:
 *   fps: frames per second (default 15)
 *   duration: total animation duration in ms (default auto-detect)
 *   scale: zoom scale (default 1)
 *   border: padding in pixels (default 0)
 *   transparent: transparent background (default false)
 *   repeat: loop count, 0 = forever (default 0)
 *   background: background color (default white or dark page background)
 *   theme: 'light' or 'dark' (default null for light)
 *
 * Callback receives the GIF Blob or null on error.
 */
AnimatedGifExport.prototype.doExport = function(options, callback, errorCallback)
{
	var graph = this.editorUi.editor.graph;
	var editor = this.editorUi.editor;
	options = options || {};

	var fps = options.fps || 15;
	var scale = options.scale || 1;
	var border = options.border || 0;
	var transparent = options.transparent || false;
	var repeat = (options.repeat != null) ? options.repeat : 0;
	var bg = transparent ? null :
		((options.background != null && options.background != mxConstants.NONE) ?
			options.background : Editor.getDefaultPageBackgroundColor());
	var theme = options.theme || null;

	try
	{
		// Get SVG with flow animation styles embedded
		var svgRoot = graph.getSvg(bg, scale, border, true, null, true,
			null, null, null, graph.shadowVisible, null, theme);

		// Find animated paths and collect animation info
		var animInfos = AnimatedGifExport.findAnimatedPaths(svgRoot);

		if (animInfos.length == 0)
		{
			if (errorCallback != null)
			{
				errorCallback(new Error(mxResources.get('noAnimationsInDiagram')));
			}

			return;
		}

		// Auto-detect duration from animation CSS or use provided value
		var duration = options.duration || AnimatedGifExport.getLoopDuration(animInfos) || 1000;
		var totalFrames = Math.max(2, Math.round(fps * duration / 1000));

		// Remove CSS animation from paths (we'll set offsets manually)
		AnimatedGifExport.removeAnimationCss(svgRoot, animInfos);

		// Embed external images once before frame loop
		editor.convertImages(svgRoot, mxUtils.bind(this, function(convertedSvg)
		{
			try
			{
				this.renderFrames(convertedSvg, animInfos, totalFrames, fps, scale,
					transparent, repeat, bg, theme, callback, errorCallback, duration);
			}
			catch (e)
			{
				if (errorCallback != null)
				{
					errorCallback(e);
				}
			}
		}), null, editor.createImageUrlConverter());
	}
	catch (e)
	{
		if (errorCallback != null)
		{
			errorCallback(e);
		}
	}
};

/**
 * Renders all frames and assembles the GIF. The frames cover the given
 * duration in ms (default is the number of frames at the given fps).
 */
AnimatedGifExport.prototype.renderFrames = function(svgRoot, animInfos,
	totalFrames, fps, scale, transparent, repeat, bg, theme, callback,
	errorCallback, duration)
{
	duration = (duration != null) ? duration : totalFrames * 1000 / fps;

	var w = parseInt(svgRoot.getAttribute('width'));
	var h = parseInt(svgRoot.getAttribute('height'));

	if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0)
	{
		if (errorCallback != null)
		{
			errorCallback(new Error('Invalid SVG dimensions'));
		}

		return;
	}

	// Cap canvas size
	var maxScale = this.editorUi.editor.getMaxCanvasScale(w, h, 1);

	if (maxScale < 1)
	{
		w = Math.ceil(w * maxScale);
		h = Math.ceil(h * maxScale);
	}

	var encoder = new GifEncoder(w, h);
	encoder.setDelay(Math.round(1000 / fps));
	encoder.setRepeat(repeat);
	encoder.setTransparent(transparent);

	// Resolves light-dark() backgrounds to the exported theme as
	// canvas fillStyle is not resolved against the SVG color-scheme
	var fillStyle = null;

	if (bg != null)
	{
		var cssBg = mxUtils.getLightDarkColor(bg);
		fillStyle = (theme == 'dark' &&
			this.editorUi.editor.graph.getAdaptiveColors() != 'none') ?
			cssBg.dark : cssBg.light;
	}

	var frameIndex = 0;

	var renderNextFrame = mxUtils.bind(this, function()
	{
		if (frameIndex >= totalFrames)
		{
			// All frames rendered
			try
			{
				var blob = encoder.finish();
				callback(blob);
			}
			catch (e)
			{
				if (errorCallback != null)
				{
					errorCallback(e);
				}
			}

			return;
		}

		// Set stroke-dashoffset for this frame
		var time = (totalFrames > 1) ? frameIndex * duration / totalFrames : 0;

		for (var i = 0; i < animInfos.length; i++)
		{
			animInfos[i].node.style.strokeDashoffset =
				AnimatedGifExport.getDashOffset(animInfos[i], time);
		}

		// Rasterize SVG to canvas
		var svgData = Editor.createSvgDataUri(mxUtils.getXml(svgRoot));
		var img = new Image();

		img.onload = function()
		{
			try
			{
				var canvas = document.createElement('canvas');
				canvas.width = w;
				canvas.height = h;
				var ctx = canvas.getContext('2d');

				if (fillStyle != null)
				{
					ctx.fillStyle = fillStyle;
					ctx.fillRect(0, 0, w, h);
				}

				if (maxScale < 1)
				{
					ctx.scale(maxScale, maxScale);
				}

				ctx.drawImage(img, 0, 0);
				encoder.addFrame(canvas);

				frameIndex++;

				// Use setTimeout to avoid blocking UI and allow progress
				setTimeout(renderNextFrame, 0);
			}
			catch (e)
			{
				if (errorCallback != null)
				{
					errorCallback(e);
				}
			}
		};

		img.onerror = function()
		{
			if (errorCallback != null)
			{
				errorCallback(new Error('Failed to render SVG frame'));
			}
		};

		img.src = svgData;
	});

	renderNextFrame();
};

// --- Static methods ---

/**
 * Longest duration in ms of a GIF that loops all flow animations (see
 * getLoopDuration).
 */
AnimatedGifExport.maxLoopDuration = 10000;

/**
 * Longest duration in ms of a GIF of the flow animations.
 */
AnimatedGifExport.maxDuration = 30000;

/**
 * Finds all SVG path elements that have flow animation applied.
 * Returns array of {node, dashSum, dashShift, restOffset, duration, delay,
 * direction, once} objects. The dash offset goes from dashShift + dashSum
 * to dashShift in each iteration and is restOffset without the animation,
 * e.g. after a single pass (once).
 */
AnimatedGifExport.findAnimatedPaths = function(svgRoot)
{
	var results = [];
	var allPaths = svgRoot.getElementsByTagName('path');

	for (var i = 0; i < allPaths.length; i++)
	{
		var path = allPaths[i];
		var animation = path.style.animation || path.getAttribute('style');

		if (animation != null && animation.indexOf('ge-flow-animation') >= 0)
		{
			var dashOffset = parseFloat(path.style.strokeDashoffset);

			if (isNaN(dashOffset))
			{
				dashOffset = parseFloat(path.getAttribute('stroke-dashoffset'));
			}

			var restOffset = dashOffset;
			var once = path.style.animationIterationCount == '1' ||
				String(animation).indexOf('-ring-once') >= 0;
			var dashShift = 0;

			// The dashes of rings and dots move by flowRingPeriod in a loop
			// and by two times flowRingPeriod to a negative offset in a
			// single pass (see Graph.addFlowRingsToNode)
			if (path.getAttribute('pathLength') != null)
			{
				dashShift = (once) ? -2 * Graph.flowRingPeriod : 0;
				dashOffset = ((once) ? 2 : 1) * Graph.flowRingPeriod;
			}

			if (!isNaN(dashOffset) && dashOffset > 0)
			{
				// Parse direction from animation shorthand
				var direction = path.style.animationDirection;

				if (mxUtils.indexOf(['normal', 'reverse', 'alternate',
					'alternate-reverse'], direction) < 0)
				{
					direction = 'normal';

					if (typeof animation === 'string')
					{
						if (animation.indexOf('alternate-reverse') >= 0)
						{
							direction = 'alternate-reverse';
						}
						else if (animation.indexOf('alternate') >= 0)
						{
							direction = 'alternate';
						}
						else if (animation.indexOf('reverse') >= 0)
						{
							direction = 'reverse';
						}
					}
				}

				// Parse duration from animation shorthand (e.g. "ge-flow-animation-xxx 500ms linear infinite normal")
				var durationMs = AnimatedGifExport.parseTime(path.style.animationDuration);

				if (durationMs == null)
				{
					var match = (typeof animation === 'string') ?
						animation.match(/(\d+)ms/) : null;
					durationMs = (match != null) ? parseInt(match[1]) : 500;
				}

				results.push({
					node: path,
					dashSum: dashOffset,
					dashShift: dashShift,
					restOffset: (isNaN(restOffset)) ? dashShift + dashOffset : restOffset,
					duration: Math.max(1, durationMs),
					delay: AnimatedGifExport.parseTime(path.style.animationDelay) || 0,
					direction: direction,
					once: once
				});
			}
		}
	}

	return results;
};

/**
 * Returns the given CSS time in ms or null if it is not a time.
 */
AnimatedGifExport.parseTime = function(value)
{
	var match = /^\s*(-?(\d+\.?\d*|\.\d+))(ms|s)\s*$/.exec(String(value));

	return (match != null) ? parseFloat(match[1]) *
		((match[3] == 's') ? 1000 : 1) : null;
};

/**
 * Returns the dash offset of the given animation info (see findAnimatedPaths)
 * at the given time in ms after the start of the animation, with the delay,
 * direction and iterations of the CSS animation and linear timing. A single
 * pass has the offset without the animation (restOffset) after its end.
 */
AnimatedGifExport.getDashOffset = function(info, time)
{
	var local = time - (info.delay || 0);
	var offset = info.restOffset;

	if (local >= 0 && (!info.once || local < info.duration))
	{
		var iteration = Math.floor(local / info.duration);
		var t = mxUtils.mod(local, info.duration) / info.duration;
		var reverse = info.direction == 'reverse' ||
			(info.direction == 'alternate' && iteration % 2 == 1) ||
			(info.direction == 'alternate-reverse' && iteration % 2 == 0);
		offset = (info.dashShift || 0) + info.dashSum * ((reverse) ? t : 1 - t);
	}

	return Math.round(offset * 100) / 100;
};

/**
 * Returns the duration in ms of a GIF that loops all given animations at
 * their speed: the least common multiple of their periods (two times the
 * duration for alternating directions) or the longest period if that is
 * longer than maxLoopDuration, repeated until all single passes have ended
 * and at most maxDuration.
 */
AnimatedGifExport.getLoopDuration = function(animInfos)
{
	var gcd = function(a, b)
	{
		while (b > 0)
		{
			var temp = a % b;
			a = b;
			b = temp;
		}

		return a;
	};

	var lcm = 0;
	var longest = 0;
	var end = 0;

	for (var i = 0; i < animInfos.length; i++)
	{
		var info = animInfos[i];

		if (info.once)
		{
			end = Math.max(end, info.delay + info.duration);
		}
		else
		{
			var period = Math.max(1, Math.round(info.duration *
				((info.direction == 'alternate' ||
				info.direction == 'alternate-reverse') ? 2 : 1)));
			longest = Math.max(longest, period);
			lcm = (lcm == 0) ? period : ((lcm <= AnimatedGifExport.maxLoopDuration) ?
				lcm / gcd(lcm, period) * period : lcm);
		}
	}

	var duration = (lcm <= AnimatedGifExport.maxLoopDuration) ? lcm : longest;
	duration = (duration > 0) ? duration * Math.max(1, Math.ceil(end / duration)) : end;

	return Math.min(AnimatedGifExport.maxDuration, duration);
};

/**
 * Detects animation duration from collected animation info.
 * Returns the longest duration in ms.
 */
AnimatedGifExport.detectDuration = function(animInfos)
{
	var maxDuration = 0;

	for (var i = 0; i < animInfos.length; i++)
	{
		if (animInfos[i].duration > maxDuration)
		{
			maxDuration = animInfos[i].duration;
		}
	}

	return maxDuration;
};

/**
 * Removes CSS animation properties from animated paths and
 * removes the @keyframes style element so that manual offsets are used.
 */
AnimatedGifExport.removeAnimationCss = function(svgRoot, animInfos)
{
	// Remove animation CSS from each path
	for (var i = 0; i < animInfos.length; i++)
	{
		animInfos[i].node.style.animation = '';
		animInfos[i].node.style.animationName = '';
	}

	// Remove @keyframes style elements from defs
	var defs = svgRoot.getElementsByTagName('defs');

	if (defs.length > 0)
	{
		var styles = defs[0].getElementsByTagName('style');

		for (var i = styles.length - 1; i >= 0; i--)
		{
			if (styles[i].innerHTML != null &&
				styles[i].innerHTML.indexOf('ge-flow-animation') >= 0)
			{
				styles[i].parentNode.removeChild(styles[i]);
			}
		}
	}
};
