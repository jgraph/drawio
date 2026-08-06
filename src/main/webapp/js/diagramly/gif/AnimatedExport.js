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
		var duration = options.duration || AnimatedGifExport.detectDuration(animInfos) || 1000;
		var totalFrames = Math.max(2, Math.round(fps * duration / 1000));

		// Remove CSS animation from paths (we'll set offsets manually)
		AnimatedGifExport.removeAnimationCss(svgRoot, animInfos);

		// Embed external images once before frame loop
		editor.convertImages(svgRoot, mxUtils.bind(this, function(convertedSvg)
		{
			try
			{
				this.renderFrames(convertedSvg, animInfos, totalFrames,
					fps, scale, transparent, repeat, bg, theme, callback, errorCallback);
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
 * Renders all frames and assembles the GIF.
 */
AnimatedGifExport.prototype.renderFrames = function(svgRoot, animInfos,
	totalFrames, fps, scale, transparent, repeat, bg, theme, callback, errorCallback)
{
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
		var t = (totalFrames > 1) ? frameIndex / totalFrames : 0;

		for (var i = 0; i < animInfos.length; i++)
		{
			var info = animInfos[i];
			var offset;

			if (info.direction === 'alternate' || info.direction === 'alternate-reverse')
			{
				// Triangular wave: t maps 0→1→0 over one GIF loop
				var halfT = (t < 0.5) ? t * 2 : (1 - t) * 2;

				if (info.direction === 'alternate')
				{
					offset = info.dashSum * (1 - halfT);
				}
				else
				{
					offset = info.dashSum * halfT;
				}
			}
			else if (info.direction === 'reverse')
			{
				offset = info.dashSum * t;
			}
			else
			{
				offset = info.dashSum * (1 - t);
			}

			info.node.style.strokeDashoffset = offset;
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
 * Finds all SVG path elements that have flow animation applied.
 * Returns array of {node, dashSum, duration, direction} objects.
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

			if (!isNaN(dashOffset) && dashOffset > 0)
			{
				// Parse direction from animation shorthand
				var direction = 'normal';

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

				// Parse duration from animation shorthand (e.g. "ge-flow-animation-xxx 500ms linear infinite normal")
				var durationMs = 500;
				var match = (typeof animation === 'string') ?
					animation.match(/(\d+)ms/) : null;

				if (match != null)
				{
					durationMs = parseInt(match[1]);
				}

				results.push({
					node: path,
					dashSum: dashOffset,
					duration: durationMs,
					direction: direction
				});
			}
		}
	}

	return results;
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
