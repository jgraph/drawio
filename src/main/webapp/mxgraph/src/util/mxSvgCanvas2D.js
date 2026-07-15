/**
 * Copyright (c) 2006-2015, JGraph Holdings Ltd
 * Copyright (c) 2006-2015, draw.io AG
 */
/**
 * Class: mxSvgCanvas2D
 *
 * Extends <mxAbstractCanvas2D> to implement a canvas for SVG. This canvas writes all
 * calls as SVG output to the given SVG root node.
 * 
 * (code)
 * var svgDoc = mxUtils.createXmlDocument();
 * var root = (svgDoc.createElementNS != null) ?
 * 		svgDoc.createElementNS(mxConstants.NS_SVG, 'svg') : svgDoc.createElement('svg');
 * 
 * if (svgDoc.createElementNS == null)
 * {
 *   root.setAttribute('xmlns', mxConstants.NS_SVG);
 *   root.setAttribute('xmlns:xlink', mxConstants.NS_XLINK);
 * }
 * else
 * {
 *   root.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:xlink', mxConstants.NS_XLINK);
 * }
 * 
 * var bounds = graph.getGraphBounds();
 * root.setAttribute('width', (bounds.x + bounds.width + 4) + 'px');
 * root.setAttribute('height', (bounds.y + bounds.height + 4) + 'px');
 * root.setAttribute('version', '1.1');
 * 
 * svgDoc.appendChild(root);
 * 
 * var svgCanvas = new mxSvgCanvas2D(root);
 * (end)
 * 
 * A description of the public API is available in <mxXmlCanvas2D>.
 * 
 * To disable anti-aliasing in the output, use the following code.
 * 
 * (code)
 * graph.view.canvas.ownerSVGElement.setAttribute('shape-rendering', 'crispEdges');
 * (end)
 * 
 * Or set the respective attribute in the SVG element directly.
 * 
 * Constructor: mxSvgCanvas2D
 *
 * Constructs a new SVG canvas.
 * 
 * Parameters:
 * 
 * root - SVG container for the output.
 * styleEnabled - Optional boolean that specifies if a style section should be
 * added. The style section sets the default font-size, font-family and
 * stroke-miterlimit globally. Default is false.
 */
function mxSvgCanvas2D(root, styleEnabled)
{
	mxAbstractCanvas2D.call(this);

	/**
	 * Variable: root
	 * 
	 * Reference to the container for the SVG content.
	 */
	this.root = root;

	/**
	 * Variable: idPrefix
	 * 
	 * Prefix for element IDs inside this canvas.
	 */
	this.idPrefix = '';

	/**
	 * Variable: gradients
	 * 
	 * Local cache of gradients for quick lookups.
	 */
	this.gradients = [];

	/**
	  * Variable: fillPatterns
	  * 
	  * Local cache of fill patterns for quick lookups.
	  */
	this.fillPatterns = [];

	/**
	 * Variable: viewTranslate
	 *
	 * Optional view translate used to anchor fill patterns to diagram
	 * coordinates. Set from the shape's view translate.
	 */
	this.viewTranslate = null;

	/**
	 * Variable: defs
	 *
	 * Reference to the defs section of the SVG document. Only for export.
	 */
	this.defs = null;
	
	/**
	 * Variable: styleEnabled
	 * 
	 * Stores the value of styleEnabled passed to the constructor.
	 */
	this.styleEnabled = (styleEnabled != null) ? styleEnabled : false;
	
	/**
	 * Variable: styleEnabled
	 * 
	 * Stores the value of styleEnabled passed to the constructor.
	 */
	this.adaptiveColors = null;
	
	/**
	 * Holds the SVG root.
	 */
	var svg = null;
	
	// Adds optional defs section for export
	if (root.ownerDocument != document)
	{
		var node = root;

		// Finds owner SVG element in XML DOM
		while (node != null && node.nodeName != 'svg')
		{
			node = node.parentNode;
		}
		
		svg = node;
	}

	if (svg != null)
	{
		// Tries to get existing defs section
		var tmp = svg.getElementsByTagName('defs');
		
		if (tmp.length > 0)
		{
			this.defs = svg.getElementsByTagName('defs')[0];
		}
		
		// Adds defs section if none exists
		if (this.defs == null)
		{
			this.defs = this.createElement('defs');
			
			if (svg.firstChild != null)
			{
				svg.insertBefore(this.defs, svg.firstChild);
			}
			else
			{
				svg.appendChild(this.defs);
			}
		}

		// Adds stylesheet
		if (this.styleEnabled)
		{
			this.defs.appendChild(this.createStyle());
		}
	}
};

/**
 * Extends mxAbstractCanvas2D
 */
mxUtils.extend(mxSvgCanvas2D, mxAbstractCanvas2D);

/**
 * Capability check for DOM parser and checks if base tag is used.
 */
(function()
{
	mxSvgCanvas2D.prototype.useDomParser = typeof DOMParser === 'function' && typeof XMLSerializer === 'function';
	
	if (mxSvgCanvas2D.prototype.useDomParser)
	{
		// Checks using a generic test text if the parsing actually works. This is a workaround
		// for older browsers where the capability check returns true but the parsing fails.
		try
		{
			var doc = new DOMParser().parseFromString('test text', 'text/html');
			mxSvgCanvas2D.prototype.useDomParser = doc != null;
		}
		catch (e)
		{
			mxSvgCanvas2D.prototype.useDomParser = false;
		}
	}
	
	// Activates workaround for gradient ID resolution if base tag is used.
	mxSvgCanvas2D.prototype.useAbsoluteIds = !mxClient.IS_CHROMEAPP &&
		!mxClient.IS_EDGE && document.getElementsByTagName('base').length > 0;
})();

/**
 * Variable: path
 * 
 * Holds the current DOM node.
 */
mxSvgCanvas2D.prototype.node = null;

/**
 * Variable: matchHtmlAlignment
 * 
 * Specifies if plain text output should match the vertical HTML alignment.
 * Defaul is true.
 */
mxSvgCanvas2D.prototype.matchHtmlAlignment = true;

/**
 * Variable: textEnabled
 * 
 * Specifies if text output should be enabled. Default is true.
 */
mxSvgCanvas2D.prototype.textEnabled = true;

/**
 * Variable: foEnabled
 * 
 * Specifies if use of foreignObject for HTML markup is allowed. Default is true.
 */
mxSvgCanvas2D.prototype.foEnabled = true;

/**
 * Variable: foAltText
 * 
 * Specifies the fallback text for unsupported foreignObjects in exported
 * documents. Default is '[Object]'. If this is set to null then no fallback
 * text is added to the exported document.
 */
mxSvgCanvas2D.prototype.foAltText = '[Object]';

/**
 * Variable: foOffset
 * 
 * Offset to be used for foreignObjects.
 */
mxSvgCanvas2D.prototype.foOffset = 0;

/**
 * Variable: textOffset
 * 
 * Offset to be used for text elements.
 */
mxSvgCanvas2D.prototype.textOffset = 0;

/**
 * Variable: imageOffset
 * 
 * Offset to be used for image elements.
 */
mxSvgCanvas2D.prototype.imageOffset = 0;

/**
 * Variable: strokeTolerance
 * 
 * Adds transparent paths for strokes.
 */
mxSvgCanvas2D.prototype.strokeTolerance = 0;

/**
 * Variable: minStrokeWidth
 * 
 * Minimum stroke width for output.
 */
mxSvgCanvas2D.prototype.minStrokeWidth = 1;

/**
 * Variable: refCount
 * 
 * Local counter for references in SVG export.
 */
mxSvgCanvas2D.prototype.refCount = 0;

/**
 * Variable: lineHeightCorrection
 * 
 * Correction factor for <mxConstants.LINE_HEIGHT> in HTML output. Default is 1.
 */
mxSvgCanvas2D.prototype.lineHeightCorrection = 1;

/**
 * Variable: pointerEventsValue
 * 
 * Default value for active pointer events. Default is all.
 */
mxSvgCanvas2D.prototype.pointerEventsValue = 'all';

/**
 * Variable: fontMetricsPadding
 * 
 * Padding to be added for text that is not wrapped to account for differences
 * in font metrics on different platforms in pixels. Default is 10.
 */
mxSvgCanvas2D.prototype.fontMetricsPadding = 10;

/**
 * Variable: foreignObjectPadding
 * 
 * Padding to be added to render text in foreignObject. Default is 2.
 */
mxSvgCanvas2D.prototype.foreignObjectPadding = 2;

/**
 * Variable: allowConvertHtmlToSvg
 * 
 * Specifies if convertHtmlToSvg should be allowed. Default is false.
 */
mxSvgCanvas2D.prototype.allowConvertHtmlToSvg = false;

/**
 * Function: addForeignObject
 * 
 * Creates a foreignObject for the given string and adds it to the given root.
 */
mxSvgCanvas2D.prototype.setCssText = function(elt, css)
{
	if (elt != null && typeof elt.setAttribute === 'function')
	{
		elt.setAttribute('style', css);
	}
};

/**
 * Function: getLightDarkColor
 * 
 * Gets the light dark color for the given color taking into account
 * the current value of adaptiveColors of this canvas.
 */
mxSvgCanvas2D.prototype.getLightDarkColor = function(color)
{
	return mxUtils.getLightDarkColor(color, null,
		null, this.adaptiveColors == 'simple');
};

/**
 * Function: format
 * 
 * Rounds all numbers to 2 decimal points.
 */
mxSvgCanvas2D.prototype.format = function(value)
{
	return parseFloat(parseFloat(value).toFixed(2));
};

/**
 * Function: getBaseUrl
 * 
 * Returns the URL of the page without the hash part. This needs to use href to
 * include any search part with no params (ie question mark alone). This is a
 * workaround for the fact that window.location.search is empty if there is
 * no search string behind the question mark.
 */
mxSvgCanvas2D.prototype.getBaseUrl = function()
{
	var href = window.location.href;
	var hash = href.indexOf('#');
	
	if (hash > 0)
	{
		href = href.substring(0, hash);
	}
	
	return href;
};

/**
 * Function: reset
 * 
 * Returns any offsets for rendering pixels.
 */
mxSvgCanvas2D.prototype.reset = function()
{
	mxAbstractCanvas2D.prototype.reset.apply(this, arguments);
	this.gradients = [];
	this.fillPatterns = [];
};

/**
 * Function: createStyle
 * 
 * Creates the optional style section.
 */
mxSvgCanvas2D.prototype.createStyle = function(x)
{
	var style = this.createElement('style');
	style.setAttribute('type', 'text/css');
	mxUtils.write(style, 'svg{font-family:' + mxConstants.DEFAULT_FONTFAMILY +
			';font-size:' + mxConstants.DEFAULT_FONTSIZE +
			';fill:none;stroke-miterlimit:10}');
	
	return style;
};

/**
 * Function: createElement
 * 
 * Private helper function to create SVG elements
 */
mxSvgCanvas2D.prototype.createElement = function(tagName, namespace)
{
	if (this.root.ownerDocument.createElementNS != null)
	{
		return this.root.ownerDocument.createElementNS(namespace || mxConstants.NS_SVG, tagName);
	}
	else
	{
		var elt = this.root.ownerDocument.createElement(tagName);
		
		if (namespace != null)
		{
			elt.setAttribute('xmlns', namespace);
		}
		
		return elt;
	}
};

/**
 * Function: getAlternateText
 * 
 * Returns the alternate text string for the given foreignObject.
 */
mxSvgCanvas2D.prototype.getAlternateText = function(fo, x, y, w, h, str, align, valign, wrap, format, overflow, clip, rotation)
{
	return (str != null) ? this.foAltText : null;
};

/**
 * Function: getAlternateTextLines
 *
 * Returns the alternate text for the given foreignObject as an array of
 * lines. Splits the text at linefeeds, applies word wrapping at the given
 * width if wrap is enabled and truncates the lines to the visible box if
 * the label is clipped, so that the fallback approximates the layout of
 * the foreignObject in viewers with no support for foreignObjects.
 */
mxSvgCanvas2D.prototype.getAlternateTextLines = function(text, w, h, wrap, overflow, clip)
{
	var s = this.state;
	var lines = text.split(/\r\n|\r|\n/);
	var doWrap = (wrap || overflow == 'fill' || overflow == 'width') && w > 0;
	var maxWidth = w + this.foreignObjectPadding;
	var ctx = null;

	if (doWrap || (clip && w > 0))
	{
		// Uses canvas text measuring with the current font. This is an
		// approximation as the fonts in the target viewer may differ.
		ctx = document.createElement('canvas').getContext('2d');
		ctx.font = (((s.fontStyle & mxConstants.FONT_ITALIC) ==
				mxConstants.FONT_ITALIC) ? 'italic ' : '') +
			(((s.fontStyle & mxConstants.FONT_BOLD) ==
				mxConstants.FONT_BOLD) ? 'bold ' : '') +
			s.fontSize + 'px ' + mxUtils.parseCssFontFamily(s.fontFamily);
	}

	// Applies word wrapping at the wrapping width of the foreignObject
	if (doWrap && ctx != null)
	{
		var wrapped = [];

		for (var i = 0; i < lines.length; i++)
		{
			var words = lines[i].split(/\s+/);
			var line = '';

			for (var j = 0; j < words.length; j++)
			{
				if (words[j].length > 0)
				{
					var next = (line.length > 0) ? line + ' ' + words[j] : words[j];

					if (line.length > 0 && ctx.measureText(next).width > maxWidth)
					{
						wrapped.push(line);
						line = words[j];
					}
					else
					{
						line = next;
					}

					// Breaks CJK text that is wider than the wrapping width
					// at character level like the browser as it contains no
					// word boundaries (other overflowing content is left to
					// overflow like HTML with word-wrap normal)
					while (line.length > 1 && ctx.measureText(line).width > maxWidth &&
						/[\u2E80-\uFAFF\uFE30-\uFE4F\uFF00-\uFFEF]/.test(line))
					{
						var index = line.length - 1;

						while (index > 1 && ctx.measureText(line.substring(0, index)).width > maxWidth)
						{
							index--;
						}

						wrapped.push(line.substring(0, index));
						line = line.substring(index);
					}
				}
			}

			wrapped.push(line);
		}

		lines = wrapped;
	}

	// Removes lines that are not visible if the label is clipped
	if ((clip || overflow == 'fill') && h > 0)
	{
		var visibleLines = Math.max(1, Math.floor(h / Math.round(
			mxConstants.LINE_HEIGHT * s.fontSize)));

		if (lines.length > visibleLines)
		{
			lines = lines.slice(0, visibleLines);
			lines[lines.length - 1] += '...';
		}
	}

	// Truncates the lines at the width if the label is clipped without wrapping
	if (clip && !doWrap && ctx != null)
	{
		for (var i = 0; i < lines.length; i++)
		{
			if (ctx.measureText(lines[i]).width > maxWidth)
			{
				var index = lines[i].length - 1;

				while (index > 1 && ctx.measureText(
					lines[i].substring(0, index) + '...').width > maxWidth)
				{
					index--;
				}

				lines[i] = mxUtils.trim(lines[i].substring(0, index)) + '...';
			}
		}
	}

	return lines;
};

/**
 * Function: getAlternateContent
 *
 * Returns the alternate content for the given foreignObject.
 */
mxSvgCanvas2D.prototype.createAlternateContent = function(fo, x, y, w, h, str, align, valign, wrap, format, overflow, clip, rotation)
{
	var text = this.getAlternateText(fo, x, y, w, h, str, align, valign, wrap, format, overflow, clip, rotation);
	var s = this.state;

	if (text != null && s.fontSize > 0)
	{
		var dy = (valign == mxConstants.ALIGN_TOP) ? 1 :
			(valign == mxConstants.ALIGN_BOTTOM) ? 0 : 0.3;
		var anchor = (align == mxConstants.ALIGN_RIGHT) ? 'end' :
			(align == mxConstants.ALIGN_LEFT) ? 'start' :
			'middle';

		var lines = this.getAlternateTextLines(text, w, h, wrap, overflow, clip);
		var lh = Math.round(mxConstants.LINE_HEIGHT * s.fontSize);
		var x0 = Math.round(x + s.dx);

		// Aligns the block of lines vertically at the anchor point like the
		// flex layout of the foreignObject: hanging below the anchor for top,
		// centered for middle and above the anchor for bottom alignment
		var y0 = y + s.dy + dy * s.fontSize -
			((valign == mxConstants.ALIGN_TOP) ? 0 :
			((valign == mxConstants.ALIGN_BOTTOM) ? (lines.length - 1) * lh :
			(lines.length - 1) * lh / 2));

		var alt = this.createElement('text');
		alt.setAttribute('x', x0);
		alt.setAttribute('y', Math.round(y0));
		alt.setAttribute('fill', s.fontColor || 'black');
		alt.setAttribute('font-family', mxUtils.parseCssFontFamily(s.fontFamily));
		alt.setAttribute('font-size', Math.round(s.fontSize) + 'px');

		// Text-anchor start is default in SVG
		if (anchor != 'start')
		{
			alt.setAttribute('text-anchor', anchor);
		}
		
		if ((s.fontStyle & mxConstants.FONT_BOLD) == mxConstants.FONT_BOLD)
		{
			alt.setAttribute('font-weight', 'bold');
		}
		
		if ((s.fontStyle & mxConstants.FONT_ITALIC) == mxConstants.FONT_ITALIC)
		{
			alt.setAttribute('font-style', 'italic');
		}
		
		var txtDecor = [];
		
		if ((s.fontStyle & mxConstants.FONT_UNDERLINE) == mxConstants.FONT_UNDERLINE)
		{
			txtDecor.push('underline');
		}
		
		if ((s.fontStyle & mxConstants.FONT_STRIKETHROUGH) == mxConstants.FONT_STRIKETHROUGH)
		{
			txtDecor.push('line-through');
		}

		if (txtDecor.length > 0)
		{
			alt.setAttribute('text-decoration', txtDecor.join(' '));

			if ((s.fontStyle & mxConstants.FONT_UNDERLINE_DOTTED) == mxConstants.FONT_UNDERLINE_DOTTED)
			{
				alt.style.textDecorationStyle = 'dotted';
			}
		}

		if (lines.length > 1)
		{
			for (var i = 0; i < lines.length; i++)
			{
				var tspan = this.createElement('tspan');
				tspan.setAttribute('x', x0);
				tspan.setAttribute('y', Math.round(y0 + i * lh));
				mxUtils.write(tspan, lines[i]);
				alt.appendChild(tspan);
			}
		}
		else
		{
			mxUtils.write(alt, lines[0]);
		}

		return alt;
	}
	else
	{
		return null;
	}
};

/**
 * Function: createGradientId
 * 
 * Private helper function to create SVG elements
 */
mxSvgCanvas2D.prototype.createGradientId = function(start, end, alpha1, alpha2, direction)
{
	// Workaround for gradient IDs not working in Safari 5 / Chrome 6
	// if they contain uppercase characters
	start = start.toLowerCase() + '-' + alpha1;
	end = end.toLowerCase() + '-' + alpha2;
	var dir = null;
	
	if (direction == null || direction == mxConstants.DIRECTION_SOUTH)
	{
		dir = 's';
	}
	else if (direction == mxConstants.DIRECTION_EAST)
	{
		dir = 'e';
	}
	else if (direction == mxConstants.DIRECTION_RADIAL)
	{
		dir = 'r';
	}
	else
	{
		var tmp = start;
		start = end;
		end = tmp;
		
		if (direction == mxConstants.DIRECTION_NORTH)
		{
			dir = 's';
		}
		else if (direction == mxConstants.DIRECTION_WEST)
		{
			dir = 'e';
		}
	}

	var prefix = (this.idPrefix != '') ? this.idPrefix : 'mx';
	
	return (prefix + '-gradient-' +
		start + '-' + end + '-' + dir).
		replace(/^[^a-z]+|[^\w:.-]+/gi, '_');
};

/**
 * Function: getSvgGradient
 * 
 * Private helper function to create SVG elements
 */
mxSvgCanvas2D.prototype.getSvgGradient = function(start, end, alpha1, alpha2, direction)
{
	start = this.getLightDarkColor(start);
	end = this.getLightDarkColor(end);

	var id = this.createGradientId(start.cssText, end.cssText, alpha1, alpha2, direction);
	var gradient = this.gradients[id];
	
	if (gradient == null)
	{
		var svg = this.root.ownerSVGElement;

		var counter = 0;
		var tmpId = id + '-' + counter;

		if (svg != null)
		{
			gradient = svg.ownerDocument.getElementById(tmpId);
			
			while (gradient != null && gradient.ownerSVGElement != svg)
			{
				tmpId = id + '-' + counter++;
				gradient = svg.ownerDocument.getElementById(tmpId);
			}
		}
		else
		{
			// Uses shorter IDs for export
			tmpId = 'id' + (++this.refCount);
		}
		
		if (gradient == null)
		{
			gradient = this.createSvgGradient(start, end, alpha1, alpha2, direction);
			gradient.setAttribute('id', tmpId);
			
			if (this.defs != null)
			{
				this.defs.appendChild(gradient);
			}
			else
			{
				svg.appendChild(gradient);
			}
		}

		this.gradients[id] = gradient;
	}

	return gradient.getAttribute('id');
};

/**
 * Function: createSvgGradient
 * 
 * Creates the given SVG gradient.
 */
mxSvgCanvas2D.prototype.createSvgGradient = function(start, end, alpha1, alpha2, direction)
{
	var gradient = this.createElement((direction == mxConstants.DIRECTION_RADIAL) ? 'radialGradient' : 'linearGradient');
	gradient.setAttribute('x1', '0%');
	gradient.setAttribute('y1', '0%');
	gradient.setAttribute('x2', '0%');
	gradient.setAttribute('y2', '0%');
	
	if (direction == null || direction == mxConstants.DIRECTION_SOUTH)
	{
		gradient.setAttribute('y2', '100%');
	}
	else if (direction == mxConstants.DIRECTION_EAST)
	{
		gradient.setAttribute('x2', '100%');
	}
	else if (direction == mxConstants.DIRECTION_NORTH)
	{
		gradient.setAttribute('y1', '100%');
	}
	else if (direction == mxConstants.DIRECTION_WEST)
	{
		gradient.setAttribute('x1', '100%');
	}

	var stop = this.createElement('stop');
	stop.setAttribute('offset', '0%');
	stop.setAttribute('stop-color', start.light);
	stop.style.stopColor = start.cssText;
	stop.setAttribute('stop-opacity', alpha1);
	stop.style.stopOpacity = alpha1;
	gradient.appendChild(stop);
	
	stop = this.createElement('stop');
	stop.setAttribute('offset', '100%');
	stop.setAttribute('stop-color', end.light);
	stop.style.stopColor = end.cssText;
	stop.setAttribute('stop-opacity', alpha2);
	stop.style.stopOpacity = alpha2;
	gradient.appendChild(stop);
	
	return gradient;
};

/**
 * Function: createFillPatternId
 *
 * Private helper function to create fillPattern Id. The id must encode every
 * input that affects the resulting pattern element (type, dimensions, stroke
 * width, both light and dark color components, scale) so that two patterns
 * that differ in any of those attributes get distinct ids and are never
 * shared via getElementById lookups across shapes.
 */
mxSvgCanvas2D.prototype.createFillPatternId = function(type, strokeSize, color, scale)
{
	var parts = ['mx-pattern', type,
		Math.round(strokeSize * 100),
		color.light, color.dark,
		Math.round(scale * 100)];

	// Removes illegal characters from gradient ID
	return parts.join('-').toLowerCase().replace(/^[^a-z]+|[^\w:.-]+/gi, '_');
};

/**
 * Function: getFillPattern
 *
 * Private helper function to create FillPattern SVG elements
 */
mxSvgCanvas2D.prototype.getFillPattern = function(type, strokeSize, color, scale)
{
	color = this.getLightDarkColor(color);
	var id = this.createFillPatternId(type, strokeSize, color, scale);
	var fillPattern = this.fillPatterns[id];

	if (fillPattern == null)
	{
		var svg = this.root.ownerSVGElement;

		var counter = 0;
		var tmpId = id + '-' + counter;

		if (svg != null)
		{
			fillPattern = svg.ownerDocument.getElementById(tmpId);

			while (fillPattern != null && fillPattern.ownerSVGElement != svg)
			{
				tmpId = id + '-' + counter++;
				fillPattern = svg.ownerDocument.getElementById(tmpId);
			}
		}
		else
		{
			 // Uses shorter IDs for export
			tmpId = 'id' + (++this.refCount);
		}

		if (fillPattern == null)
		{
			switch(type)
			{
				case 'hatch':
					fillPattern = this.createHatchPattern(strokeSize, color, scale);
					break;
				case 'dots':
					fillPattern = this.createDotsPattern(strokeSize, color, scale);
					break;
				case 'cross-hatch':
					fillPattern = this.createCrossHatchPattern(strokeSize, color, scale);
					break;
				case 'dashed':
					fillPattern = this.createDashedPattern(strokeSize, color, scale);
					break;
				case 'zigzag': //TODO Add this pattern
				case 'zigzag-line':
					fillPattern = this.createZigZagLinePattern(strokeSize, color, scale);
					break;
				default:
					return null;
			}

			fillPattern.setAttribute('id', tmpId);

			if (this.defs != null)
			{
				this.defs.appendChild(fillPattern);
			}
			else
			{
				svg.appendChild(fillPattern);
			}
		}

		this.fillPatterns[id] = fillPattern;
	}

	// Updates patternTransform to anchor pattern to diagram coordinates.
	// The view translate is baked into shape SVG positions. By including
	// it in the pattern transform, the pattern phase depends only on the
	// shape's diagram position, not the view translate or zoom level.
	var vt = this.viewTranslate;
	var tx = (vt != null) ? this.format(vt.x * scale) : 0;
	var ty = (vt != null) ? this.format(vt.y * scale) : 0;
	var hasRotate = (type !== 'dots');

	fillPattern.setAttribute('patternTransform',
		'translate(' + tx + ',' + ty + ')' +
		(hasRotate ? ' rotate(45)' : '') +
		' scale(' + scale + ')');

	return fillPattern.getAttribute('id');
};

mxSvgCanvas2D.prototype.createHatchPattern = function(strokeSize, color, scale)
{
	var baseSW = strokeSize * 1.5;
	var size = this.format(10 + baseSW);

	var fillPattern = this.createElement('pattern');
	fillPattern.setAttribute('patternUnits', 'userSpaceOnUse');
	fillPattern.setAttribute('width', size);
	fillPattern.setAttribute('height', size);
	fillPattern.setAttribute('x', '0');
	fillPattern.setAttribute('y', '0');

	var line = this.createElement('line');
	line.setAttribute('x1', '0');
	line.setAttribute('y1', '0');
	line.setAttribute('x2', '0');
	line.setAttribute('y2', size);
	line.setAttribute('stroke', color.light); // TODO Is Gradient Color possible?
	line.style.stroke = color.cssText;
	line.setAttribute('stroke-width', baseSW);

	fillPattern.appendChild(line);
	return fillPattern;
};

mxSvgCanvas2D.prototype.createDashedPattern = function(strokeSize, color, scale)
{
	var baseSW = strokeSize * 1.5;
	var size = this.format(10 + baseSW);

	var fillPattern = this.createElement('pattern');
	fillPattern.setAttribute('patternUnits', 'userSpaceOnUse');
	fillPattern.setAttribute('width', size);
	fillPattern.setAttribute('height', size);
	fillPattern.setAttribute('x', '0');
	fillPattern.setAttribute('y', '0');

	var line = this.createElement('line');
	line.setAttribute('x1', '0');
	line.setAttribute('y1', size / 4);
	line.setAttribute('x2', '0');
	line.setAttribute('y2', 3 * size / 4);
	line.setAttribute('stroke', color.light); // TODO Is Gradient Color possible?
	line.style.stroke = color.cssText;
	line.setAttribute('stroke-width', baseSW);

	fillPattern.appendChild(line);
	return fillPattern;
};

mxSvgCanvas2D.prototype.createZigZagLinePattern = function(strokeSize, color, scale)
{
	var baseSW = strokeSize * 1.5;
	var size = this.format(10 + baseSW);

	var fillPattern = this.createElement('pattern');
	fillPattern.setAttribute('patternUnits', 'userSpaceOnUse');
	fillPattern.setAttribute('width', size);
	fillPattern.setAttribute('height', size);
	fillPattern.setAttribute('x', '0');
	fillPattern.setAttribute('y', '0');

	var path = this.createElement('path');
	var s1_4 = size / 4, s3_4 = 3 * size / 4;
	path.setAttribute('d', 'M ' + s1_4 + ' 0 L ' + s3_4 + ' 0 L ' + s1_4 + ' ' + size + ' L ' + s3_4 + ' ' + size);
	path.setAttribute('stroke', color.light); // TODO Is Gradient Color possible?
	path.style.stroke = color.cssText;
	path.setAttribute('stroke-width', baseSW);
	path.setAttribute('fill', 'none');

	fillPattern.appendChild(path);
	return fillPattern;
};

mxSvgCanvas2D.prototype.createCrossHatchPattern = function(strokeSize, color, scale)
{
	var baseSW = strokeSize * 0.5;
	var size = this.format(1.5 * (10 + baseSW));

	var fillPattern = this.createElement('pattern');
	fillPattern.setAttribute('patternUnits', 'userSpaceOnUse');
	fillPattern.setAttribute('width', size);
	fillPattern.setAttribute('height', size);
	fillPattern.setAttribute('x', '0');
	fillPattern.setAttribute('y', '0');

	var rect = this.createElement('rect');
	rect.setAttribute('x', 0);
	rect.setAttribute('y', 0);
	rect.setAttribute('width', size);
	rect.setAttribute('height', size);
	rect.setAttribute('stroke', color.light); // TODO Is Gradient Color possible?
	rect.style.stroke = color.cssText;
	rect.setAttribute('stroke-width', baseSW);
	rect.setAttribute('fill', 'none');

	fillPattern.appendChild(rect);
	return fillPattern;
};

mxSvgCanvas2D.prototype.createDotsPattern = function(strokeSize, color, scale)
{
	var size = this.format(10 + strokeSize);

	var fillPattern = this.createElement('pattern');
	fillPattern.setAttribute('patternUnits', 'userSpaceOnUse');
	fillPattern.setAttribute('width', size);
	fillPattern.setAttribute('height', size);
	fillPattern.setAttribute('x', '0');
	fillPattern.setAttribute('y', '0');

	var circle = this.createElement('circle');
	circle.setAttribute('cx', size / 2);
	circle.setAttribute('cy', size / 2);
	circle.setAttribute('r', size / 4);
	circle.setAttribute('stroke', 'none');
	circle.setAttribute('fill', color.light); // TODO Is Gradient Color possible?
	circle.style.fill = color.cssText;

	fillPattern.appendChild(circle);
	return fillPattern;
}; 

/**
 * Function: addTitle
 * 
 * Private helper function to add title tags to nodes.
 */
mxSvgCanvas2D.prototype.addTitle = function(node)
{
	if (node != null && this.title != null)
	{
		var temp = this.createElement('title');
		mxUtils.write(temp, this.title);
		node.appendChild(temp);
	}

	return node;
};

/**
 * Function: addNode
 * 
 * Private helper function to create SVG elements
 */
mxSvgCanvas2D.prototype.addNode = function(filled, stroked)
{
	var node = this.addTitle(this.node);
	var s = this.state;

	if (node != null)
	{
		if (node.nodeName == 'path')
		{
			// Checks if the path is not empty
			if (this.path != null && this.path.length > 0)
			{
				node.setAttribute('d', this.path.join(' '));
			}
			else
			{
				return;
			}
		}

		if (filled && s.fillColor != null)
		{
			this.updateFill();
		}
		else if (!this.styleEnabled)
		{
			// Workaround for https://bugzilla.mozilla.org/show_bug.cgi?id=814952
			if (node.nodeName == 'ellipse' && mxClient.IS_FF)
			{
				node.setAttribute('fill', 'transparent');
			}
			else
			{
				node.setAttribute('fill', 'none');
			}
			
			// Sets the actual filled state for stroke tolerance
			filled = false;
		}
		
		if (stroked && s.strokeColor != null)
		{
			this.updateStroke();
		}
		else if (!this.styleEnabled)
		{
			node.setAttribute('stroke', 'none');
		}
		
		if (s.transform != null && s.transform.length > 0)
		{
			node.setAttribute('transform', s.transform);
		}

		// Adds pointer events
		if (this.pointerEvents)
		{
			node.setAttribute('pointer-events', this.pointerEventsValue);
		}
		// Enables clicks for nodes inside a link element
		else if (!this.pointerEvents && this.originalRoot == null)
		{
			node.setAttribute('pointer-events', 'none');
		}
		
		// Adds stroke tolerance
		if (this.strokeTolerance > 0 && (!filled || s.fillColor == null ||
			(!mxShape.forceFilledPointerEvents && !this.pointerEvents &&
				this.originalRoot == null)))
		{
			this.addTolerance(node);
		}

		// Removes invisible nodes from output if they don't handle events
		if ((node.nodeName != 'rect' && node.nodeName != 'path' && node.nodeName != 'ellipse') ||
			(node.getAttribute('fill') != 'none' && node.getAttribute('fill') != 'transparent') ||
			node.getAttribute('stroke') != 'none' || node.getAttribute('pointer-events') != 'none')
		{
			// LATER: Update existing DOM for performance		
			this.root.appendChild(node);
		}
		
		this.node = null;
	}
};

/**
 * Function: addTolerance
 * 
 * Transfers the stroke attributes from <state> to <node>.
 */
mxSvgCanvas2D.prototype.getShadowFilter = function()
{
	var s = this.state;
	var tmp = s.shadowStyle;

	if (s.scale != 1)
	{
		var tok = tmp.split('(');

		if (tok.length > 0)
		{
			var args = tok[1].split(' ');

			if (args.length > 3)
			{
				function arg(index)
				{
					return Math.round(parseFloat(args[index]) *
						s.scale * 100) / 100 + 'px';
				};

				tmp = tok[0] + '(' + arg(0) + ' ' + arg(1) + ' ' + arg(2) + ' ' +
					args.slice(3).join(' ')  + ((tok.length > 2) ?
					'(' + tok.slice(2).join('(') : '');
			}
		}
	}

	return tmp;
};

/**
 * Function: addTolerance
 * 
 * Transfers the stroke attributes from <state> to <node>.
 */
mxSvgCanvas2D.prototype.addTolerance = function(node)
{
	this.root.appendChild(this.createTolerance(node));
};

/**
 * Function: updateFill
 * 
 * Transfers the stroke attributes from <state> to <node>.
 */
mxSvgCanvas2D.prototype.updateFill = function()
{
	var s = this.state;
	
	if (s.alpha < 1 || s.fillAlpha < 1)
	{
		this.node.setAttribute('fill-opacity', s.alpha * s.fillAlpha);
	}
	
	var fill, lightFill, isGradient = false;

	if (s.fillColor != null)
	{
		if (s.gradientColor != null && s.gradientColor != mxConstants.NONE)
		{
			isGradient = true;
			var id = this.getSvgGradient(String(s.fillColor), String(s.gradientColor),
				s.gradientFillAlpha, s.gradientAlpha, s.gradientDirection);

			if (this.root.ownerDocument == document && this.useAbsoluteIds)
			{
				// Workaround for no fill with base tag in page (escape brackets)
				var base = this.getBaseUrl().replace(/([\(\)])/g, '\\$1');
				fill = 'url(' + base + '#' + id + ')';
			}
			else
			{
				fill = 'url(#' + id + ')';
			}

			lightFill = fill;
		}
		else
		{
			var cssFill = this.getLightDarkColor(String(s.fillColor).toLowerCase());
			lightFill = cssFill.light;
			fill = cssFill.cssText;
		}
	}

	var baseStrokeWidth = Math.max(this.minStrokeWidth, Math.max(0.01,
		this.format(s.strokeWidth)));
	var pId = (s.fillStyle == null || s.fillStyle == 'auto' || s.fillStyle == 'solid') ? null :
		this.getFillPattern(s.fillStyle, baseStrokeWidth, fill, s.scale);

	if (isGradient || pId == null)
	{
		this.node.setAttribute('fill', lightFill);
		this.node.style.fill = fill;
	}
	else if (this.root.ownerDocument == document && this.useAbsoluteIds)
	{
		// Workaround for no fill with base tag in page (escape brackets)
		var base = this.getBaseUrl().replace(/([\(\)])/g, '\\$1');
		this.node.setAttribute('fill', 'url(' + base + '#' + pId + ')');
	}
	else
	{
		this.node.setAttribute('fill', 'url(#' + pId + ')');
	}
};

/**
 * Function: getCurrentStrokeWidth
 * 
 * Returns the current stroke width (>= 1), ie. max(1, this.format(this.state.strokeWidth * this.state.scale)).
 */
mxSvgCanvas2D.prototype.getCurrentStrokeWidth = function()
{
	return Math.max(this.minStrokeWidth, Math.max(0.01, this.format(this.state.strokeWidth * this.state.scale)));
};

/**
 * Function: updateStroke
 * 
 * Transfers the stroke attributes from <state> to <node>.
 */
mxSvgCanvas2D.prototype.updateStroke = function()
{
	var s = this.state;

	var cssStroke = this.getLightDarkColor(String(s.strokeColor).toLowerCase());
	this.node.setAttribute('stroke', cssStroke.light);
	this.node.style.stroke = cssStroke.cssText;
	
	if (s.alpha < 1 || s.strokeAlpha < 1)
	{
		this.node.setAttribute('stroke-opacity', s.alpha * s.strokeAlpha);
	}
	
	var sw = this.getCurrentStrokeWidth();
	
	if (sw != 1)
	{
		this.node.setAttribute('stroke-width', sw);
	}
	
	if (this.node.nodeName == 'path')
	{
		this.updateStrokeAttributes();
	}
	
	if (s.dashed)
	{
		this.node.setAttribute('stroke-dasharray', this.createDashPattern(
			((s.fixDash) ? 1 : s.strokeWidth) * s.scale));
	}
};

/**
 * Function: updateStrokeAttributes
 * 
 * Transfers the stroke attributes from <state> to <node>.
 */
mxSvgCanvas2D.prototype.updateStrokeAttributes = function()
{
	var s = this.state;
	
	// Linejoin miter is default in SVG
	if (s.lineJoin != null && s.lineJoin != 'miter')
	{
		this.node.setAttribute('stroke-linejoin', s.lineJoin);
	}
	
	if (s.lineCap != null)
	{
		// flat is called butt in SVG
		var value = s.lineCap;
		
		if (value == 'flat')
		{
			value = 'butt';
		}
		
		// Linecap butt is default in SVG
		if (value != 'butt')
		{
			this.node.setAttribute('stroke-linecap', value);
		}
	}
	
	// Miterlimit 10 is default in our document
	if (s.miterLimit != null && (!this.styleEnabled || s.miterLimit != 10))
	{
		this.node.setAttribute('stroke-miterlimit', s.miterLimit);
	}
};

/**
 * Function: createDashPattern
 * 
 * Creates the SVG dash pattern for the given state.
 */
mxSvgCanvas2D.prototype.createDashPattern = function(scale)
{
	var pat = [];
	
	if (typeof(this.state.dashPattern) === 'string')
	{
		var dash = this.state.dashPattern.split(' ');
		
		if (dash.length > 0)
		{
			for (var i = 0; i < dash.length; i++)
			{
				pat[i] = Math.round(Number(dash[i]) * scale * 100) / 100;
			}
		}
	}
	
	return pat.join(' ');
};

/**
 * Function: createTolerance
 * 
 * Creates a hit detection tolerance shape for the given node.
 */
mxSvgCanvas2D.prototype.createTolerance = function(node)
{
	var tol = node.cloneNode(true);
	var sw = parseFloat(tol.getAttribute('stroke-width') || 1) + this.strokeTolerance;
	tol.setAttribute('pointer-events', 'stroke');
	tol.setAttribute('visibility', 'hidden');
	tol.removeAttribute('stroke-dasharray');
	tol.setAttribute('stroke-width', sw);
	tol.setAttribute('fill', 'none');
	
	// Workaround for Opera ignoring the visiblity attribute above while
	// other browsers need a stroke color to perform the hit-detection but
	// do not ignore the visibility attribute. Side-effect is that Opera's
	// hit detection for horizontal/vertical edges seems to ignore the tol.
	tol.setAttribute('stroke', (mxClient.IS_OT) ? 'none' : 'white');
	
	return tol;
};

/**
 * Function: createShadow
 * 
 * Creates a shadow for the given node.
 */
mxSvgCanvas2D.prototype.createShadow = function(node)
{
	var shadow = node.cloneNode(true);
	var s = this.state;

	// Firefox uses transparent for no fill in ellipses
	if (shadow.getAttribute('fill') != 'none' && (!mxClient.IS_FF || shadow.getAttribute('fill') != 'transparent'))
	{
		shadow.setAttribute('fill', s.shadowColor);
	}
	
	if (shadow.getAttribute('stroke') != 'none')
	{
		shadow.setAttribute('stroke', s.shadowColor);
	}

	shadow.setAttribute('transform', 'translate(' + this.format(s.shadowDx * s.scale) +
		',' + this.format(s.shadowDy * s.scale) + ')' + (s.transform || ''));
	shadow.setAttribute('opacity', s.shadowAlpha);
	
	return shadow;
};

/**
 * Function: setTitle
 * 
 * Sets the current title text.
 */
mxSvgCanvas2D.prototype.setTitle = function(title)
{
	this.title = title;
};

/**
 * Function: setLink
 * 
 * Experimental implementation for hyperlinks.
 */
mxSvgCanvas2D.prototype.setLink = function(link, target)
{
	if (link == null)
	{
		this.root = this.originalRoot;
	}
	else
	{
		this.originalRoot = this.root;
		
		var node = this.createElement('a');
		
		// Workaround for implicit namespace handling in HTML5 export, IE adds NS1 namespace so use code below
		// in all IE versions except quirks mode. KNOWN: Adds xlink namespace to each image tag in output.
		if (node.setAttributeNS == null || (this.root.ownerDocument != document && document.documentMode == null))
		{
			node.setAttribute('xlink:href', link);
		}
		else
		{
			node.setAttributeNS(mxConstants.NS_XLINK, 'xlink:href', link);
		}
		
		if (target != null)
		{
			node.setAttribute('target', target);
		}
		
		this.root.appendChild(node);
		this.root = node;
	}
};

/**
 * Function: rotate
 * 
 * Sets the rotation of the canvas. Note that rotation cannot be concatenated.
 */
mxSvgCanvas2D.prototype.rotate = function(theta, flipH, flipV, cx, cy)
{
	if (theta != 0 || flipH || flipV)
	{
		var s = this.state;
		cx += s.dx;
		cy += s.dy;
	
		cx *= s.scale;
		cy *= s.scale;

		s.transform = s.transform || '';
		
		// This implementation uses custom scale/translate and built-in rotation
		// Rotation state is part of the AffineTransform in state.transform
		if (flipH && flipV)
		{
			theta += 180;
		}
		else if (flipH != flipV)
		{
			var tx = (flipH) ? cx : 0;
			var sx = (flipH) ? -1 : 1;
	
			var ty = (flipV) ? cy : 0;
			var sy = (flipV) ? -1 : 1;

			s.transform += 'translate(' + this.format(tx) + ',' + this.format(ty) + ')' +
				'scale(' + this.format(sx) + ',' + this.format(sy) + ')' +
				'translate(' + this.format(-tx) + ',' + this.format(-ty) + ')';
		}
		
		if (flipH ? !flipV : flipV)
		{
			theta *= -1;
		}
		
		if (theta != 0)
		{
			s.transform += 'rotate(' + this.format(theta) + ',' + this.format(cx) + ',' + this.format(cy) + ')';
		}
		
		s.rotation = s.rotation + theta;
		s.rotationCx = cx;
		s.rotationCy = cy;
	}
};

/**
 * Function: begin
 * 
 * Extends superclass to create path.
 */
mxSvgCanvas2D.prototype.begin = function()
{
	mxAbstractCanvas2D.prototype.begin.apply(this, arguments);
	this.node = this.createElement('path');
};

/**
 * Function: rect
 * 
 * Private helper function to create SVG elements
 */
mxSvgCanvas2D.prototype.rect = function(x, y, w, h)
{
	var s = this.state;
	var n = this.createElement('rect');
	n.setAttribute('x', this.format((x + s.dx) * s.scale));
	n.setAttribute('y', this.format((y + s.dy) * s.scale));
	n.setAttribute('width', this.format(w * s.scale));
	n.setAttribute('height', this.format(h * s.scale));
	
	this.node = n;
};

/**
 * Function: roundrect
 * 
 * Private helper function to create SVG elements
 */
mxSvgCanvas2D.prototype.roundrect = function(x, y, w, h, dx, dy)
{
	this.rect(x, y, w, h);
	
	if (dx > 0)
	{
		this.node.setAttribute('rx', this.format(dx * this.state.scale));
	}
	
	if (dy > 0)
	{
		this.node.setAttribute('ry', this.format(dy * this.state.scale));
	}
};

/**
 * Function: ellipse
 * 
 * Private helper function to create SVG elements
 */
mxSvgCanvas2D.prototype.ellipse = function(x, y, w, h)
{
	var s = this.state;
	var n = this.createElement('ellipse');
	// No rounding for consistent output with 1.x
	n.setAttribute('cx', this.format((x + w / 2 + s.dx) * s.scale));
	n.setAttribute('cy', this.format((y + h / 2 + s.dy) * s.scale));
	n.setAttribute('rx', w / 2 * s.scale);
	n.setAttribute('ry', h / 2 * s.scale);
	this.node = n;
};

/**
 * Function: image
 *
 * Private helper function to create SVG elements. The optional cssVars
 * renders the image as a use tag with the given CSS declarations in its
 * style attribute, so that CSS variables apply to the referenced SVG
 * content. Note that external references are not loaded where SVG is
 * rendered as an image, eg. in PNG export.
 */
mxSvgCanvas2D.prototype.image = function(x, y, w, h, src, aspect, flipH, flipV, clipPath, cssVars)
{
	src = this.converter.convert(src);

	// LATER: Add option for embedding images as base64.
	aspect = (aspect != null) ? aspect : true;
	flipH = (flipH != null) ? flipH : false;
	flipV = (flipV != null) ? flipV : false;

	var s = this.state;
	x += s.dx;
	y += s.dy;

	var node = null;

	if (cssVars != null)
	{
		// Inlines themed SVG images as shared symbols via the
		// createImageSymbol hook where available
		var ref = (this.createImageSymbol != null) ?
			this.createImageSymbol(src, aspect) : null;

		// Data URIs are not supported in use tags so the theming
		// is ignored if no symbol was created for the image
		if (ref != null || src.substring(0, 5) != 'data:')
		{
			var href = (ref != null) ? '#' + ref : src;
			node = this.createElement('use');

			// Empty declarations share the image without theming
			if (cssVars != '')
			{
				node.setAttribute('style', cssVars);
			}

			node.setAttribute('href', href);

			if (node.setAttributeNS != null)
			{
				node.setAttributeNS(mxConstants.NS_XLINK, 'xlink:href', href);
			}
		}
	}

	if (node == null && this.dedupImages && this.defs != null)
	{
		// Shares repeated images via a definition and use tags
		var def = '#' + this.getImageDef(src, w * s.scale, h * s.scale, aspect);
		node = this.createElement('use');
		node.setAttribute('href', def);

		if (node.setAttributeNS != null)
		{
			node.setAttributeNS(mxConstants.NS_XLINK, 'xlink:href', def);
		}
	}
	else if (node == null)
	{
		node = this.createElement('image');

		// Workaround for missing namespace support
		if (node.setAttributeNS == null)
		{
			node.setAttribute('xlink:href', src);
		}
		else
		{
			node.setAttributeNS(mxConstants.NS_XLINK, 'xlink:href', src);
		}

		if (!aspect)
		{
			node.setAttribute('preserveAspectRatio', 'none');
		}
	}

	node.setAttribute('x', this.format(x * s.scale) + this.imageOffset);
	node.setAttribute('y', this.format(y * s.scale) + this.imageOffset);
	node.setAttribute('width', this.format(w * s.scale));
	node.setAttribute('height', this.format(h * s.scale));

	if (s.alpha < 1 || s.fillAlpha < 1)
	{
		node.setAttribute('opacity', s.alpha * s.fillAlpha);
	}
	
	var tr = this.state.transform || '';
	
	if (flipH || flipV)
	{
		var sx = 1;
		var sy = 1;
		var dx = 0;
		var dy = 0;
		
		if (flipH)
		{
			sx = -1;
			dx = -w - 2 * x;
		}
		
		if (flipV)
		{
			sy = -1;
			dy = -h - 2 * y;
		}
		
		// Adds image tansformation to existing transform
		tr += 'scale(' + sx + ',' + sy + ')translate(' + (dx * s.scale) + ',' + (dy * s.scale) + ')';
	}

	if (tr.length > 0)
	{
		node.setAttribute('transform', tr);
	}
	
	if (!this.pointerEvents)
	{
		node.setAttribute('pointer-events', 'none');
	}

	if (clipPath != null)
	{
		this.processClipPath(node, clipPath, new mxRectangle(x, y, w, h));
	}
	
	this.root.appendChild(node);
};

/**
 * Function: getImageDef
 *
 * Returns the ID of the definition for the given image with the given
 * size, adding the definition to <defs> if it does not yet exist. The
 * image is wrapped in a symbol so that all sizes with the same aspect
 * ratio share one definition, as the use tags scale the symbol via its
 * viewBox. Used if <dedupImages> is enabled.
 */
mxSvgCanvas2D.prototype.getImageDef = function(src, w, h, aspect)
{
	if (this.imageDefs == null)
	{
		this.imageDefs = {};
		this.imageDefIds = {};
	}

	// All aspect ratios are equivalent if the aspect is not preserved
	var key = src + '|' + aspect + '|' +
		((aspect && h != 0) ? (w / h).toFixed(4) : '');
	var id = this.imageDefs[key];

	if (id == null)
	{
		id = 'mx-image-' + mxUtils.hashCode(key);

		// Resolves hash collisions between different keys
		while (this.imageDefIds[id] != null)
		{
			id += '-1';
		}

		var symbol = this.createElement('symbol');
		symbol.setAttribute('id', id);
		symbol.setAttribute('viewBox', '0 0 ' + this.format(w) +
			' ' + this.format(h));

		var img = this.createElement('image');
		img.setAttribute('width', this.format(w));
		img.setAttribute('height', this.format(h));

		// Workaround for missing namespace support
		if (img.setAttributeNS == null)
		{
			img.setAttribute('xlink:href', src);
		}
		else
		{
			img.setAttributeNS(mxConstants.NS_XLINK, 'xlink:href', src);
		}

		if (!aspect)
		{
			symbol.setAttribute('preserveAspectRatio', 'none');
			img.setAttribute('preserveAspectRatio', 'none');
		}

		symbol.appendChild(img);
		this.defs.appendChild(symbol);
		this.imageDefs[key] = id;
		this.imageDefIds[id] = key;
	}

	return id;
};

/**
 * Function: processClipPath
 * 
 * Converts the given HTML string to XHTML.
 */
mxSvgCanvas2D.prototype.processClipPath = function(node, clipPath, bounds)
{
	try
	{
		var clip = this.createElement('clipPath');
		clip.setAttribute('id', this.createClipPathId(clipPath));
		clip.setAttribute('clipPathUnits', 'objectBoundingBox');
		var bbox = this.appendClipPath(clip, clipPath, bounds);

		if (bbox != null)
		{
			var s = this.state;
			node.setAttribute('x', (bounds.x * s.scale - (bounds.width *
				s.scale * bbox.x) / bbox.width) + this.imageOffset);
			node.setAttribute('y', (bounds.y * s.scale - (bounds.height *
				s.scale * bbox.y) / bbox.height) + this.imageOffset);
			node.setAttribute('width', (bounds.width * s.scale / bbox.width));
			node.setAttribute('height', (bounds.height * s.scale / bbox.height));
		}
 
		this.setClip(node, clip);
	}
	catch (e)
	{
		// ignores parsing errors in clipPath
	}
};

/**
 * Function: convertHtml
 * 
 * Converts the given HTML string to XHTML.
 */
mxSvgCanvas2D.prototype.convertHtml = function(val)
{
	if (this.useDomParser)
	{
		var doc = new DOMParser().parseFromString(val, 'text/html');

		if (doc != null)
		{
			val = new XMLSerializer().serializeToString(doc.body);
			
			// Extracts body content from DOM
			if (val.substring(0, 5) == '<body')
			{
				val = val.substring(val.indexOf('>', 5) + 1);
			}
			
			if (val.substring(val.length - 7, val.length) == '</body>')
			{
				val = val.substring(0, val.length - 7);
			}
		}
	}
	else if (document.implementation != null && document.implementation.createDocument != null)
	{
		var xd = document.implementation.createDocument('http://www.w3.org/1999/xhtml', 'html', null);
		var xb = xd.createElement('body');
		xd.documentElement.appendChild(xb);
		
		var div = document.createElement('div');
		div.innerHTML = val;
		var child = div.firstChild;
		
		while (child != null)
		{
			var next = child.nextSibling;
			xb.appendChild(xd.adoptNode(child));
			child = next;
		}
		
		return xb.innerHTML;
	}
	else
	{
		var ta = document.createElement('textarea');
		
		// Handles special HTML entities < and > and double escaping
		// and converts unclosed br, hr and img tags to XHTML
		// LATER: Convert all unclosed tags
		ta.innerHTML = val.replace(/&amp;/g, '&amp;amp;').
			replace(/&#60;/g, '&amp;lt;').replace(/&#62;/g, '&amp;gt;').
			replace(/&lt;/g, '&amp;lt;').replace(/&gt;/g, '&amp;gt;').
			replace(/</g, '&lt;').replace(/>/g, '&gt;');
		val = ta.value.replace(/&/g, '&amp;').replace(/&amp;lt;/g, '&lt;').
			replace(/&amp;gt;/g, '&gt;').replace(/&amp;amp;/g, '&amp;').
			replace(/<br>/g, '<br />').replace(/<hr>/g, '<hr />').
			replace(/(<img[^>]+)>/gm, "$1 />");
	}
	
	return val;
};

/**
 * Function: createDiv
 * 
 * Private helper function to create SVG elements
 */
mxSvgCanvas2D.prototype.createDiv = function(str)
{
	var val = str;
	
	if (!mxUtils.isNode(val))
	{
		val = '<div><div>' + this.convertHtml(val) + '</div></div>';
	}

	if (document.createElementNS)
	{
		var div = document.createElementNS('http://www.w3.org/1999/xhtml', 'div');
		
		if (mxUtils.isNode(val))
		{
			var div2 = document.createElement('div');
			var div3 = div2.cloneNode(false);
			
			// Creates a copy for export
			if (this.root.ownerDocument != document)
			{
				div2.appendChild(val.cloneNode(true));
			}
			else
			{
				div2.appendChild(val);
			}
			
			div3.appendChild(div2);
			div.appendChild(div3);
		}
		else
		{
			div.innerHTML = val;
		}
		
		return div;
	}
	else
	{
		if (mxUtils.isNode(val))
		{
			val = '<div><div>' + mxUtils.getXml(val) + '</div></div>';
		}
		
		val = '<div xmlns="http://www.w3.org/1999/xhtml">' + val + '</div>';

		// NOTE: FF 3.6 crashes if content CSS contains "height:100%"
		return  mxUtils.parseXml(val).documentElement;
	}
};

/**
 * Updates existing DOM nodes for text rendering. LATER: Merge common parts with text function below.
 */
mxSvgCanvas2D.prototype.updateText = function(x, y, w, h, align, valign, wrap, overflow, clip, rotation, dir, node)
{
	if (node != null && node.firstChild != null)
	{
		if (node.firstChild.firstChild != null && node.firstChild.firstChild.nodeName == 'foreignObject')
		{
			this.updateTextNodes(x, y, w, h, align, valign, wrap, overflow, clip, rotation, dir, node.firstChild);
		}
		else if (node.nodeName == 'g')
		{
			// Checks for block mode (stored during initial render)
			var innerG = node.firstChild;
			var blockTextHeight = innerG.getAttribute('data-blockTextHeight');

			if (blockTextHeight != null)
			{
				var storedWidth = innerG.getAttribute('data-htmlContentWidth');
				var hcw = (storedWidth != null) ? parseFloat(storedWidth) : null;

				this.plainText(x, y, w, h, '', align, valign, wrap, overflow, clip, rotation, dir,
					null, innerG, parseFloat(blockTextHeight), (hcw != null && !isNaN(hcw)) ? hcw : null);
			}
			else
			{
				this.plainText(x, y, w, h, '', align, valign, wrap, overflow, clip, rotation, dir,
					null, innerG);
			}
		}
	}
};

/**
 * Function: addForeignObject
 * 
 * Creates a foreignObject for the given string and adds it to the given root.
 */
mxSvgCanvas2D.prototype.addForeignObject = function(x, y, w, h, str, align, valign, wrap, format, overflow, clip, rotation, dir, div, root)
{
	var group = this.addTitle(this.createElement('g'));
	var fo = this.createElement('foreignObject');
	
	// Workarounds for print clipping and static position in Safari
	this.setCssText(fo, 'overflow: visible; text-align: left;');
	fo.setAttribute('pointer-events', 'none');
	
	// Import needed for older versions of IE
	if (div.ownerDocument != document)
	{
		div = mxUtils.importNodeImplementation(fo.ownerDocument, div, true);
	}
	
	fo.appendChild(div);
	group.appendChild(fo);
	this.updateTextNodes(x, y, w, h, align, valign, wrap, overflow, clip, rotation, dir, group);
	
	// Alternate content if foreignObject not supported
	if (this.root.ownerDocument != document)
	{
		var alt = this.createAlternateContent(fo, x, y, w, h, str, align, valign, wrap, format, overflow, clip, rotation);
		
		if (alt != null)
		{
			fo.setAttribute('requiredFeatures', 'http://www.w3.org/TR/SVG11/feature#Extensibility');
			var sw = this.createElement('switch');
			sw.appendChild(fo);
			sw.appendChild(alt);
			group.appendChild(sw);
		}
	}
	
	root.appendChild(group);
};

/**
 * Updates existing DOM nodes for text rendering.
 */
mxSvgCanvas2D.prototype.updateTextNodes = function(x, y, w, h, align, valign, wrap, overflow, clip, rotation, dir, g)
{
	var s = this.state.scale;

	var vertical = dir != null && dir.substring(0, 9) == 'vertical-';
	var justifyContent = '';
	var alignItems = '';

	if (vertical)
	{
		var rl = dir.substring(dir.length - 3) == '-rl';
		
		alignItems = ((align == mxConstants.ALIGN_LEFT) ?
			(rl ? 'flex-end' : 'flex-start') :
			((align == mxConstants.ALIGN_RIGHT) ?
			(rl ? 'flex-start' : 'flex-end') : 'center'))
		justifyContent = ((valign == mxConstants.ALIGN_TOP) ? 'flex-start' :
			((valign == mxConstants.ALIGN_BOTTOM) ? 'flex-end' : 'center'))
	}
	else
	{
		alignItems = ((valign == mxConstants.ALIGN_TOP) ? 'flex-start' :
			((valign == mxConstants.ALIGN_BOTTOM) ? 'flex-end' : 'center'))
		justifyContent = ((align == mxConstants.ALIGN_LEFT) ? 'flex-start' :
			((align == mxConstants.ALIGN_RIGHT) ? 'flex-end' : 'center'))
	}

	var cssBg = (this.state.fontBackgroundColor != null) ?
		this.getLightDarkColor(this.state.fontBackgroundColor) : null;
	var cssBorder = (this.state.fontBorderColor != null) ?
		this.getLightDarkColor(this.state.fontBorderColor) : null;
	
	mxSvgCanvas2D.createCss(w + this.foreignObjectPadding, h, align, valign, wrap, overflow, clip, dir,
		(cssBg != null) ? cssBg.cssText : null, (cssBorder != null) ? cssBorder.cssText : null,
		'display: flex; align-items: unsafe ' + alignItems + '; ' +
		'justify-content: unsafe ' + justifyContent + '; ' +
		((dir != null && dir.substring(0, 9) == 'vertical-') ? 'writing-mode: ' + dir + ';' : ''),
		this.getTextCss(), s, mxUtils.bind(this, function(dx, dy, flex, item, block)
	{
		x += this.state.dx;
		y += this.state.dy;

		var fo = g.firstChild;

		if (fo.nodeName == 'title')
		{
			fo = fo.nextSibling;
		}

		// Fallback text, background and border color in parent block
		item += 'color: ' + this.getLightDarkColor(this.state.fontColor).light + '; ';
		item += (cssBg != null) ? 'background-color: ' + cssBg.light + '; ' : '';
		item += (cssBorder != null) ? 'border-color: ' + cssBorder.light + '; ' : '';
		
		var div = fo.firstChild;
		var box = div.firstChild;
		var text = box.firstChild;
		var r = ((this.rotateHtml) ? this.state.rotation : 0) + ((rotation != null) ? rotation : 0);
		var t = ((this.foOffset != 0) ? 'translate(' + this.foOffset + ' ' + this.foOffset + ')' : '') +
			((s != 1) ? 'scale(' + s + ')' : '');
		
		this.setCssText(text, block);
		this.setCssText(box, item);
		
		// Workaround for clipping in Webkit with scrolling and zoom
		fo.setAttribute('width', Math.ceil(1 / Math.min(1, s) * 100) + '%');
		fo.setAttribute('height', Math.ceil(1 / Math.min(1, s) * 100) + '%');
		var yp = Math.round(y + dy);
		
		// Allows for negative values which are causing problems with
		// transformed content where the top edge of the foreignObject
		// limits the text box being moved further up in the diagram.
		// KNOWN: Possible clipping problems with zoom and scrolling
		// but this is normally not used with scrollbars as the
		// coordinates are always positive with scrollbars.
		// Margin-top is ignored in Safari and no negative values allowed
		// for padding.
		if (yp < 0)
		{
			fo.setAttribute('y', yp);
			flex += 'padding-top: 0; '; // To override padding-top in previous calls
		}
		else
		{
			fo.removeAttribute('y');
			flex += 'padding-top: ' + yp + 'px; ';
		}
		
		this.setCssText(div, flex + 'margin-left: ' + Math.round(x + dx) + 'px;');
		t += ((r != 0) ? ('rotate(' + r + ' ' + x + ' ' + y + ')') : '');

		// Output allows for reflow but Safari cannot use absolute position,
		// transforms or opacity. https://bugs.webkit.org/show_bug.cgi?id=23113
		if (t != '')
		{	
			g.setAttribute('transform', t);
		}
		else
		{
			g.removeAttribute('transform');
		}
		
		if (this.state.alpha != 1)
		{
			g.setAttribute('opacity', this.state.alpha);
		}
		else
		{
			g.removeAttribute('opacity');
		}
	}));
};

/**
 * Updates existing DOM nodes for text rendering.
 */
mxSvgCanvas2D.createCss = function(w, h, align, valign, wrap, overflow, clip, dir, bg, border, flex, block, s, callback)
{
	var vertical = dir != null && dir.substring(0, 9) == 'vertical-';
	var item = 'box-sizing: border-box; font-size: 0; ';

	if (vertical)
	{
		item += 'text-align: ' + ((valign == mxConstants.ALIGN_TOP) ? 'left' :
			((valign == mxConstants.ALIGN_BOTTOM) ? 'right' : 'center')) + '; ';
	}
	else
	{
		item += 'text-align: ' + ((align == mxConstants.ALIGN_LEFT) ? 'left' :
			((align == mxConstants.ALIGN_RIGHT) ? 'right' : 'center')) + '; ';
	}
	
	var pt = mxUtils.getAlignmentAsPoint(align, valign);
	var ofl = 'overflow: hidden; ';
	var fw = 'width: 1px; ';
	var fh = 'height: 1px; ';
	var dx = pt.x * w;
	var dy = pt.y * h;
	
	if (clip)
	{
		fw = 'width: ' + Math.round(w) + 'px; ';
		item += 'max-height: ' + Math.round(h) + 'px; ';
		dy = 0;
	}
	else if (overflow == 'fill')
	{
		fw = 'width: ' + Math.round(w) + 'px; ';
		fh = 'height: ' + Math.round(h) + 'px; ';
		block += 'width: 100%; height: 100%; ';
		item += 'width: ' + Math.round(w - 2) + 'px; ' + fh;
	}
	else if (overflow == 'width')
	{
		fw = 'width: ' + Math.round(w - 2) + 'px; ';
		block += 'width: 100%; ';
		item += fw;
		dy = 0;
		
		if (h > 0)
		{
			item += 'max-height: ' + Math.round(h) + 'px; ';
		}
	}
	else if (overflow == 'block')
	{
		fw = 'width: ' + Math.round(w - 2) + 'px; ';
		block += 'width: 100%; ';
		ofl = '';
		dy = 0;
		
		// Use value in px not 100% for NO_FO to work
		item += fw;
		
		if (valign == 'middle')
		{
			item += 'max-height: ' + Math.round(h) + 'px; ';
		}
	}
	else
	{
		ofl = '';

		if (vertical)
		{
			dx = 0;
		}
		else
		{
			dy = 0;
		}
	}
	
	var bgc = '';
	
	if (bg != null)
	{
		bgc += 'background-color: ' + bg + '; ';
	}
	
	if (border != null)
	{
		// Duplicates border properties for inherit color fallback over border CSS
		bgc += 'border-width: 1px; border-style: solid; border-color: inherit; border: 1px solid ' + border + '; ';
	}

	if (ofl == '' || clip)
	{
		block += bgc;
	}
	else
	{
		item += bgc;
	}

	if (wrap && ((vertical && h > 0) || (!vertical && w > 0)))
	{
		block += 'white-space: normal; word-wrap: ' + mxConstants.WORD_WRAP + '; ';

		if (vertical)
		{
			fh = 'height: ' + Math.round(h) + 'px; ';
		}
		else
		{
			fw = 'width: ' + Math.round(w) + 'px; ';
		}

		if (ofl != '' && overflow != 'fill')
		{
			if (vertical)
			{
				dx = 0;
			}
			else
			{
				dy = 0;
			}
		}
	}
	else
	{
		block += 'white-space: nowrap; ';
		
		if (ofl == '' && overflow != 'block')
		{
			dx = 0;
		}
	}

	callback(dx, dy, flex + fw + fh, item + ofl, block, ofl);
};

/**
 * Function: getTextCss
 * 
 * Private helper function to create SVG elements
 */
mxSvgCanvas2D.prototype.getTextCss = function()
{
	var s = this.state;
	var lh = (mxConstants.ABSOLUTE_LINE_HEIGHT) ? (s.fontSize * mxConstants.LINE_HEIGHT) + 'px' :
		(mxConstants.LINE_HEIGHT * this.lineHeightCorrection);

	var css = 'display: inline-block; font-size: ' + mxUtils.htmlEntities(s.fontSize) + 'px; ' +
		'font-family: ' + mxUtils.parseCssFontFamily(s.fontFamily, true) + '; color: ' +
		this.getLightDarkColor(mxUtils.htmlEntities(s.fontColor)).cssText + '; line-height: ' +
		mxUtils.htmlEntities(lh) + '; pointer-events: ' + ((this.pointerEvents) ?
			mxUtils.htmlEntities(this.pointerEventsValue) : 'none') + '; ';
	
	if ((s.fontStyle & mxConstants.FONT_BOLD) == mxConstants.FONT_BOLD)
	{
		css += 'font-weight: bold; ';
	}

	if ((s.fontStyle & mxConstants.FONT_ITALIC) == mxConstants.FONT_ITALIC)
	{
		css += 'font-style: italic; ';
	}

	var deco = [];
	
	if ((s.fontStyle & mxConstants.FONT_UNDERLINE) == mxConstants.FONT_UNDERLINE)
	{
		deco.push('underline');
	}
	
	if ((s.fontStyle & mxConstants.FONT_STRIKETHROUGH) == mxConstants.FONT_STRIKETHROUGH)
	{
		deco.push('line-through');
	}

	if (deco.length > 0)
	{
		if ((s.fontStyle & mxConstants.FONT_UNDERLINE_DOTTED) == mxConstants.FONT_UNDERLINE_DOTTED)
		{
			deco.push('dotted');
		}

		css += 'text-decoration: ' + deco.join(' ') + '; ';
	}

	return css;
};

/**
 * Function: convertHtmlToSvg
 * 
 * Converts the child nodes of the given HTML element to SVG text and tspan
 * elements using <mxUtils.convertHtmlToSvg> and returns true if the
 * conversion was possible. Returns false if the content cannot be converted
 * (eg. unsupported HTML or vertical writing-mode), in which case the caller
 * falls back to foreignObject.
 */
mxSvgCanvas2D.prototype.convertHtmlToSvg = function(elt, text, offset, fontScale, dir)
{
	return mxUtils.convertHtmlToSvg(elt, text, offset, {dir: dir,
		fontScale: fontScale, fontSize: this.state.fontSize,
		createElement: mxUtils.bind(this, this.createElement)});
};
/**
 * Function: wrapSvgTextElement
 *
 * Wraps a single SVG <text> element (with tspan children) into multiple
 * <text> elements if the content exceeds maxWidth. Handles nested tspan
 * trees by flattening into leaf segments with accumulated styling.
 * Returns null if no wrapping is needed, otherwise returns
 * {elements, totalHeight}.
 */
mxSvgCanvas2D.prototype.wrapSvgTextElement = function(textEl, maxWidth)
{
	var s = this.state;
	var fontSize = s.fontSize;
	var fontFamily = s.fontFamily;
	var fontStyleBits = s.fontStyle;
	var self = this;

	// Step 1: Flatten the tspan tree into leaf segments with accumulated styling.
	// Each leaf has: text, all inherited SVG attributes and CSS, and the
	// absolute dy offset (for superscript/subscript positioning).
	var segments = [];
	var runningDy = 0;

	function collectLeaves(parent, inherited)
	{
		for (var i = 0; i < parent.childNodes.length; i++)
		{
			var child = parent.childNodes[i];

			if (child.nodeType == mxConstants.NODETYPE_TEXT)
			{
				if (child.nodeValue.length > 0)
				{
					segments.push({
						text: child.nodeValue,
						attrs: copyObj(inherited.attrs),
						css: copyObj(inherited.css),
						absoluteDy: runningDy
					});
				}
			}
			else if (child.nodeType == mxConstants.NODETYPE_ELEMENT)
			{
				var newInherited = {
					attrs: copyObj(inherited.attrs),
					css: copyObj(inherited.css)
				};

				// Merge SVG attributes from this element
				var attrNames = ['font-weight', 'font-style', 'fill', 'text-decoration'];

				for (var a = 0; a < attrNames.length; a++)
				{
					var val = child.getAttribute(attrNames[a]);

					if (val != null)
					{
						newInherited.attrs[attrNames[a]] = val;
					}
				}

				// Merge CSS styles from this element
				if (child.style != null)
				{
					if (child.style.cssText != '')
					{
						// Parse individual CSS properties from cssText
						var props = child.style.cssText.split(';');

						for (var p = 0; p < props.length; p++)
						{
							var parts = props[p].split(':');

							if (parts.length == 2)
							{
								var key = parts[0].trim();
								var val = parts[1].trim();

								if (key.length > 0 && val.length > 0)
								{
									newInherited.css[key] = val;
								}
							}
						}
					}

					// CSS fill overrides color for SVG
					if (child.style.fill)
					{
						newInherited.css['fill'] = child.style.fill;
					}
				}

				// Track dy for superscript/subscript
				var dyAttr = child.getAttribute('dy');

				if (dyAttr != null)
				{
					runningDy += parseFloat(dyAttr);
				}

				collectLeaves(child, newInherited);
			}
		}
	}

	function copyObj(obj)
	{
		var result = {};

		for (var key in obj)
		{
			if (obj.hasOwnProperty(key))
			{
				result[key] = obj[key];
			}
		}

		return result;
	}

	collectLeaves(textEl, {attrs: {}, css: {}});

	if (segments.length == 0)
	{
		return null;
	}

	// Step 2: Split segments into word tokens
	var tokens = [];

	for (var i = 0; i < segments.length; i++)
	{
		var parts = segments[i].text.split(/(\s+)/);

		for (var j = 0; j < parts.length; j++)
		{
			if (parts[j].length > 0)
			{
				tokens.push({
					text: parts[j],
					segIdx: i,
					isSpace: /^\s+$/.test(parts[j])
				});
			}
		}
	}

	// Step 3: Measure words using canvas
	var canvas = document.createElement('canvas');
	var ctx = canvas.getContext('2d');

	function getFont(segIdx)
	{
		var seg = segments[segIdx];
		var fw = seg.attrs['font-weight'] || '';
		var fs = seg.attrs['font-style'] || '';
		var ff = fontFamily;
		var fz = fontSize;

		// CSS properties override attributes
		if (seg.css['font-weight'])
		{
			fw = seg.css['font-weight'];
		}

		if (seg.css['font-style'])
		{
			fs = seg.css['font-style'];
		}

		if (seg.css['font-family'])
		{
			ff = seg.css['font-family'];
		}

		if (seg.css['font-size'])
		{
			var sz = seg.css['font-size'];

			if (sz == 'smaller')
			{
				fz = fontSize / 1.2;
			}
			else if (sz.indexOf('em') >= 0)
			{
				fz = parseFloat(sz) * fontSize;
			}
			else if (sz.indexOf('px') >= 0)
			{
				fz = parseFloat(sz);
			}
		}

		// Inherit base font style if no explicit style
		if (!fw && (fontStyleBits & mxConstants.FONT_BOLD) == mxConstants.FONT_BOLD)
		{
			fw = 'bold';
		}

		if (!fs && (fontStyleBits & mxConstants.FONT_ITALIC) == mxConstants.FONT_ITALIC)
		{
			fs = 'italic';
		}

		return fs + ' ' + fw + ' ' + fz + 'px ' + ff;
	}

	function getFontSize(segIdx)
	{
		var seg = segments[segIdx];
		var fz = fontSize;

		var sz = seg.css['font-size'];

		if (sz != null)
		{
			if (sz == 'smaller')
			{
				fz = fontSize / 1.2;
			}
			else if (sz.indexOf('em') >= 0)
			{
				fz = parseFloat(sz) * fontSize;
			}
			else if (sz.indexOf('px') >= 0)
			{
				fz = parseFloat(sz);
			}
		}

		return fz;
	}

	function measureWord(token)
	{
		ctx.font = getFont(token.segIdx);

		return ctx.measureText(token.text).width;
	}

	// Step 4: Layout tokens into lines
	var lines = [[]];
	var lineWidth = 0;

	for (var i = 0; i < tokens.length; i++)
	{
		var token = tokens[i];
		var w = measureWord(token);
		token.width = w;

		if (token.isSpace)
		{
			if (lineWidth > 0)
			{
				lines[lines.length - 1].push(token);
				lineWidth += w;
			}

			continue;
		}

		// Only wrap at word boundaries (where previous token was whitespace).
		// Tokens from adjacent segments without whitespace between them
		// (e.g. "Second" + <sup>"2"</sup> + "line") form a single word.
		var atWordBoundary = i > 0 && tokens[i - 1].isSpace;

		if (lineWidth + w > maxWidth && lineWidth > 0 && atWordBoundary)
		{
			// Remove trailing space from current line
			var curLine = lines[lines.length - 1];

			if (curLine.length > 0 && curLine[curLine.length - 1].isSpace)
			{
				curLine.pop();
			}

			lines.push([]);
			lineWidth = 0;
		}

		lines[lines.length - 1].push(token);
		lineWidth += w;
	}

	// Widest rendered line (trailing whitespace trimmed), measured with the
	// same canvas metrics used for the wrap decision. adjustBlockTextOverflow
	// uses this as the content width to start-anchor overflowing clipped text,
	// so the overflow shift works without getBBox (which returns nothing when
	// the group is not in the live document, e.g. during SVG export).
	var maxLineWidth = 0;

	for (var li = 0; li < lines.length; li++)
	{
		var measuredLine = lines[li];
		var lineEnd = measuredLine.length;

		while (lineEnd > 0 && measuredLine[lineEnd - 1].isSpace)
		{
			lineEnd--;
		}

		var measuredWidth = 0;

		for (var lk = 0; lk < lineEnd; lk++)
		{
			measuredWidth += measuredLine[lk].width;
		}

		if (measuredWidth > maxLineWidth)
		{
			maxLineWidth = measuredWidth;
		}
	}

	if (lines.length <= 1)
	{
		// No wrapping needed, but expose the single-line width so block-mode
		// overflow anchoring still works for unbreakable content wider than
		// the cell.
		return {elements: null, totalHeight: 0, maxLineWidth: maxLineWidth};
	}

	// Step 5: Build SVG text elements for each line with proper styling.
	// Uses per-line max font size for line height to match HTML line box
	// behavior (same as getMaxInlineFontSize in convertHtmlBlocksToSvg).
	var result = [];
	var cursorY = 0;

	for (var i = 0; i < lines.length; i++)
	{
		var line = lines[i];

		if (line.length == 0)
		{
			continue;
		}

		// Finds the maximum font size on this line
		var lineFontSize = fontSize;

		for (var k = 0; k < line.length; k++)
		{
			if (!line[k].isSpace)
			{
				lineFontSize = Math.max(lineFontSize,
					getFontSize(line[k].segIdx));
			}
		}

		// Adds baseline (ascent) for this line
		cursorY += lineFontSize;

		var newText = self.createElement('text');
		newText.setAttribute('y', self.format(cursorY));

		// Group consecutive tokens from the same segment and build tspans
		var j = 0;
		var prevAbsDy = 0;

		while (j < line.length)
		{
			var segIdx = line[j].segIdx;
			var combined = '';

			while (j < line.length && line[j].segIdx == segIdx)
			{
				combined += line[j].text;
				j++;
			}

			// Trim trailing whitespace from last group on the line
			if (j == line.length)
			{
				combined = combined.replace(/\s+$/, '');
			}

			if (combined.length > 0)
			{
				var seg = segments[segIdx];
				var tspan = self.createElement('tspan');

				// Apply SVG attributes
				for (var key in seg.attrs)
				{
					if (seg.attrs.hasOwnProperty(key))
					{
						tspan.setAttribute(key, seg.attrs[key]);
					}
				}

				// Apply CSS properties
				var cssText = '';

				for (var key in seg.css)
				{
					if (seg.css.hasOwnProperty(key) && key != 'color' &&
						key != 'fill')
					{
						cssText += key + ': ' + seg.css[key] + '; ';
					}
				}

				if (cssText.length > 0)
				{
					tspan.style.cssText = cssText;
				}

				// Apply CSS fill separately (mapped from color)
				if (seg.css['fill'])
				{
					tspan.style.fill = seg.css['fill'];
				}

				// Handle dy for superscript/subscript within this line
				// absoluteDy is set by convertHtmlInlineToSvg
				var targetDy = seg.absoluteDy;

				if (targetDy != prevAbsDy)
				{
					tspan.setAttribute('dy', Math.round((targetDy - prevAbsDy) * 100) / 100);
					prevAbsDy = targetDy;
				}

				tspan.textContent = combined;
				newText.appendChild(tspan);
			}
		}

		result.push(newText);

		// Adds descender to match HTML line box height
		var lineDescender = lineFontSize * (mxConstants.LINE_HEIGHT - 1);

		// Checks for sup/sub segments on this line and expands line box
		var minDy = 0;
		var maxDy = 0;

		var minDyFontSize = null;
		var maxDyFontSize = null;

		for (var k = 0; k < line.length; k++)
		{
			if (!line[k].isSpace)
			{
				var seg = segments[line[k].segIdx];
				var segDy = seg.absoluteDy;

				if (segDy < minDy)
				{
					minDy = segDy;
					minDyFontSize = getFontSize(line[k].segIdx);
				}

				if (segDy > maxDy)
				{
					maxDy = segDy;
					maxDyFontSize = getFontSize(line[k].segIdx);
				}
			}
		}

		if (minDy < 0)
		{
			lineDescender += mxUtils.getSupSubLineExpansion(
				lineFontSize, minDy, null, minDyFontSize, null);
		}

		if (maxDy > 0)
		{
			lineDescender += mxUtils.getSupSubLineExpansion(
				lineFontSize, null, maxDy, null, maxDyFontSize);
		}

		cursorY += lineDescender;
	}

	return {
		elements: result,
		totalHeight: cursorY,
		maxLineWidth: maxLineWidth
	};
};

/**
 * Function: wrapSvgBlockElements
 *
 * Wraps text within each <text> element of a block-mode group. Replaces
 * wide text elements with multiple wrapped lines and adjusts y positions.
 * Modifies the group and offset.textHeight in place, and sets
 * offset.maxLineWidth to the widest rendered line across all blocks.
 */
mxSvgCanvas2D.prototype.wrapSvgBlockElements = function(group, maxWidth, offset)
{
	var fontSize = this.state.fontSize;
	var lh = Math.round(fontSize * mxConstants.LINE_HEIGHT);
	var children = [];

	for (var i = 0; i < group.childNodes.length; i++)
	{
		if (group.childNodes[i].nodeName == 'text')
		{
			children.push(group.childNodes[i]);
		}
	}

	var heightDelta = 0;
	var maxLineWidth = 0;

	for (var i = 0; i < children.length; i++)
	{
		var textEl = children[i];
		var blockFontSize = parseFloat(textEl.getAttribute('font-size')) || fontSize;
		var wrapped = this.wrapSvgTextElement(textEl, maxWidth);

		// Tracks the widest line across all blocks (set whether or not the
		// block itself wrapped) for the overflow anchoring in plainText.
		if (wrapped != null && wrapped.maxLineWidth > maxLineWidth)
		{
			maxLineWidth = wrapped.maxLineWidth;
		}

		if (wrapped != null && wrapped.elements != null)
		{
			var origY = parseFloat(textEl.getAttribute('y')) || 0;
			origY += heightDelta;

			// Uses y positions from wrapSvgTextElement which account for
			// per-line font size variations (mixed font sizes within text)
			var firstWrappedY = parseFloat(wrapped.elements[0].getAttribute('y')) || 0;
			var lineFontSize = parseFloat(textEl.getAttribute('data-line-font-size')) || blockFontSize;

			// Adjusts origin when the first wrapped line has a smaller max
			// font than the original unwrapped line. In HTML, the line box
			// height is determined by the tallest element on that specific
			// line, not across all lines. When wrapping moves the tall
			// element to a later line, the first line's ascent shrinks.
			var ascentAdjustment = lineFontSize - firstWrappedY;
			origY -= ascentAdjustment;

			for (var j = 0; j < wrapped.elements.length; j++)
			{
				var newEl = wrapped.elements[j];
				var wrappedY = parseFloat(newEl.getAttribute('y')) || 0;
				newEl.setAttribute('y', this.format(origY + (wrappedY - firstWrappedY)));

				// Copy block-level attributes from original
				if (textEl.getAttribute('font-size'))
				{
					newEl.setAttribute('font-size', textEl.getAttribute('font-size'));
				}

				if (textEl.getAttribute('font-weight'))
				{
					newEl.setAttribute('font-weight', textEl.getAttribute('font-weight'));
				}

				if (textEl.getAttribute('font-family'))
				{
					newEl.setAttribute('font-family', textEl.getAttribute('font-family'));
				}

				if (textEl.getAttribute('fill'))
				{
					newEl.setAttribute('fill', textEl.getAttribute('fill'));
					newEl.style.fill = textEl.style.fill;
				}

				group.insertBefore(newEl, textEl);
			}

			group.removeChild(textEl);

			// Height delta accounts for both the reduced ascent on the first
			// line and the extra height from additional wrapped lines.
			heightDelta += wrapped.totalHeight - lineFontSize * mxConstants.LINE_HEIGHT;
		}
		else if (heightDelta != 0)
		{
			// Shift this element down by the accumulated delta
			var origY = parseFloat(textEl.getAttribute('y')) || 0;
			textEl.setAttribute('y', this.format(origY + heightDelta));
		}
	}

	if (heightDelta != 0)
	{
		offset.textHeight += heightDelta;
	}

	offset.maxLineWidth = maxLineWidth;
};

/**
 * Function: text
 *
 * Paints the given text. Possible values for format are empty string for plain
 * text and html for HTML markup. Note that HTML markup is only supported if
 * foreignObject is supported and <foEnabled> is true. (This means IE9 and later
 * does currently not support HTML text as part of shapes.)
 */
mxSvgCanvas2D.prototype.text = function(x, y, w, h, str, align, valign, wrap, format, overflow, clip, rotation, dir)
{
	if (this.textEnabled && str != null)
	{
		rotation = (rotation != null) ? rotation : 0;

		if (this.foEnabled && format == 'html')
		{
			var div = this.createDiv(str);

			// Ignores invalid XHTML labels
			if (div != null)
			{
				// Checks if it can be rendered using native SVG
				var text = this.createElement('text');
				var offset = new mxPoint(0, 0);

				// Falls back to foreignObject if the conversion is not possible,
				// eg. for unsupported HTML or vertical writing-mode (see
				// mxUtils.convertHtmlToSvg, which contains the checks)
				if (this.allowConvertHtmlToSvg &&
					this.convertHtmlToSvg(div.firstChild.firstChild, text, offset, null, dir))
				{
					if (offset.textHeight != null)
					{
						// Block mode: text contains multiple <text> elements
						var group = this.createElement('g');

						while (text.firstChild)
						{
							group.appendChild(text.firstChild);
						}

						// Applies word wrapping within each block element
						if (wrap && w > 0)
						{
							this.wrapSvgBlockElements(group,
								w + this.foreignObjectPadding, offset);
						}

						// Measures HTML content width for overflow adjustment so
						// centered/right clipped content wider than the cell is
						// start-anchored (matching HTML overflow:hidden). For
						// wrapped text this is the widest wrapped line, already
						// measured by wrapSvgBlockElements with the same canvas
						// metrics used for the wrap decision; for non-wrapped
						// text it is measured from the live DOM. Both avoid
						// getBBox, which is unavailable during SVG export.
						var htmlContentWidth = null;

						if (wrap)
						{
							htmlContentWidth = (offset.maxLineWidth != null) ?
								offset.maxLineWidth : null;
						}
						else if (clip && (align == mxConstants.ALIGN_CENTER ||
							align == mxConstants.ALIGN_RIGHT))
						{
							htmlContentWidth = this.measureHtmlContentWidth(
								div.firstChild.firstChild);
						}

						this.plainText(x + this.state.dx, y + this.state.dy, w, h, '',
							align, valign, wrap, overflow, clip, rotation, dir, group,
							null, offset.textHeight, htmlContentWidth);
					}
					else
					{
						// Applies word wrapping for inline SVG text
						if (wrap && w > 0)
						{
							var wrapped = this.wrapSvgTextElement(text,
								w + this.foreignObjectPadding);

							if (wrapped != null && wrapped.elements != null)
							{
								var group = this.createElement('g');

								for (var i = 0; i < wrapped.elements.length; i++)
								{
									group.appendChild(wrapped.elements[i]);
								}

								// Word wrap applied: pass the widest wrapped line (canvas-measured)
								// as content width so overflow anchoring works without getBBox.
								this.plainText(x + this.state.dx, y + this.state.dy, w, h, '',
									align, valign, wrap, overflow, clip, rotation, dir, group,
									null, wrapped.totalHeight, wrapped.maxLineWidth);

								return;
							}
						}

						if (offset.y < 0 && valign == mxConstants.ALIGN_TOP)
						{
							text.style.transform = 'translateY(' + (-offset.y) + 'em)';
						}
						else if (offset.y > 0 && valign == mxConstants.ALIGN_BOTTOM)
						{
							text.style.transform = 'translateY(' + (-offset.y) + 'em)';
						}
						else if (offset.y > 0 && valign == mxConstants.ALIGN_TOP)
						{
							text.style.transform = 'translateY(' + offset.y + 'em)';
						}

						this.plainText(x + this.state.dx, y + this.state.dy, w, h, '',
							align, valign, wrap, overflow, clip, rotation, dir, text);
					}
				}
				else
				{
					if (dir != null && dir.substring(0, 9) != 'vertical-')
					{
						div.setAttribute('dir', dir);
					}

					this.addForeignObject(x, y, w, h, str, align, valign, wrap,
						format, overflow, clip, rotation, dir, div, this.root);
				}
			}
		}
		else
		{
			this.plainText(x + this.state.dx, y + this.state.dy, w, h, str,
				align, valign, wrap, overflow, clip, rotation, dir);
		}
	}
};

/**
 * Function: createClip
 * 
 * Creates a clip for the given coordinates.
 */
mxSvgCanvas2D.prototype.createClip = function(x, y, w, h)
{
	x = Math.round(x);
	y = Math.round(y);
	w = Math.round(w);
	h = Math.round(h);
	
	var id = 'mx-clip-' + x + '-' + y + '-' + w + '-' + h;

	var counter = 0;
	var tmp = id + '-' + counter;
	
	// Resolves ID conflicts
	while (document.getElementById(tmp) != null)
	{
		tmp = id + '-' + (++counter);
	}
	
	var clip = this.createElement('clipPath');
	clip.setAttribute('id', tmp);
	
	var rect = this.createElement('rect');
	rect.setAttribute('x', x);
	rect.setAttribute('y', y);
	rect.setAttribute('width', w);
	rect.setAttribute('height', h);
		
	clip.appendChild(rect);
	
	return clip;
};

/**
 * Function: createClipPathId
 * 
 * Returns a unique ID for the given clip path.
 */
mxSvgCanvas2D.prototype.createClipPathId = function(clipPath)
{
	var id = 'mx-clippath-' + clipPath.replace(/[^a-zA-Z0-9]+/g, '-');
	var dash = (id.charAt(id.length - 1) == '-') ? '' : '-';
	var counter = 0;
	var tmp = id + dash + counter;
	
	// Checks for existing IDs
	while (document.getElementById(tmp) != null)
	{
		tmp = id + dash + (++counter);
	}

	return tmp;
};

/**
 * Function: appendClipPath
 * 
 * Parses and appends the nodes for the given clip path and returns the
 * bounding box for the clip path.
 */
mxSvgCanvas2D.prototype.appendClipPath = function(clip, clipPath, bounds)
{
	var tokens = clipPath.match(/\(([^)]+)\)/);
	var result = null;

	if (clipPath.substring(0, 7) == 'polygon')
	{
		result = this.appendPolygonClip(tokens[1], clip, bounds);
	}
	else if (clipPath.substring(0, 6) == 'circle')
	{
		result = this.appendCircleClip(tokens[1], clip, bounds);
	}
	else if (clipPath.substring(0, 7) == 'ellipse')
	{
		result = this.appendEllipseClip(tokens[1], clip, bounds);
	}
	else if (clipPath.substring(0, 5) == 'inset')
	{
		result = this.appendInsetClip(tokens[1], clip, bounds);
	}

	return result;
};

/**
 * Function: appendPolygonClip
 * 
 * Appends an SVG shape for the given polygon clip-path.
 */
mxSvgCanvas2D.prototype.appendPolygonClip = function(args, clip, bounds)
{
	var shape = this.createElement('polygon');
	var values = args.split(/[ ,]+/);
	var minX = null;
	var minY = null;
	var maxX = null;
	var maxY = null;
	var pts = [];

	for (var i = 0; i < values.length; i++)
	{
		var value = this.parseClipValue(values, i);

		if (i % 2 == 0)
		{
			if (minX == null || minX > value)
			{
				minX = value;
			}
			
			if (maxX == null || maxX < value)
			{
				maxX = value;
			}
		}
		else
		{
			if (minY == null || minY > value)
			{
				minY = value;
			}

			if (maxY == null || maxY < value)
			{
				maxY = value;
			}
		}

		pts.push(value);
	}

	shape.setAttribute('points', pts.join(','));
	clip.appendChild(shape);

	return new mxRectangle(minX, minY, maxX - minX, maxY - minY);
};

/**
 * Function: appendCircleClip
 * 
 * Appends an SVG shape for the given circle clip-path.
 */
mxSvgCanvas2D.prototype.appendCircleClip = function(args, clip, bounds)
{
	var shape = this.createElement('circle');
	var values = args.split(/[ ,]+/);

	var r = this.parseClipValue(values, 0);
	var cx = this.parseClipValue(values, 2);
	var cy = this.parseClipValue(values, 3);

	shape.setAttribute('r', r);
	shape.setAttribute('cx', cx);
	shape.setAttribute('cy', cy);
	clip.appendChild(shape);

	return new mxRectangle(cx - r, cy - r, 2 * r, 2 * r);
};

/**
 * Function: appendEllipseClip
 * 
 * Appends an SVG shape for the given ellipse clip-path.
 */
mxSvgCanvas2D.prototype.appendEllipseClip = function(args, clip, bounds)
{
	var shape = this.createElement('ellipse');
	var values = args.split(/[ ,]+/);

	var rx = this.parseClipValue(values, 0);
	var ry = this.parseClipValue(values, 1);
	var cx = this.parseClipValue(values, 3);
	var cy = this.parseClipValue(values, 4);

	shape.setAttribute('rx', rx);
	shape.setAttribute('ry', ry);
	shape.setAttribute('cx', cx);
	shape.setAttribute('cy', cy);
	clip.appendChild(shape);

	return new mxRectangle(cx - rx, cy - ry, 2 * rx, 2 * ry);
};

/**
 * Function: appendInsetClip
 * 
 * Appends an SVG shape for the given inset clip-path.
 */
mxSvgCanvas2D.prototype.appendInsetClip = function(args, clip, bounds)
{
	var shape = this.createElement('rect');
	var values = args.split(/[ ,]+/);

	var top = this.parseClipValue(values, 0);
	var right = this.parseClipValue(values, 1);
	var bottom = this.parseClipValue(values, 2);
	var left = this.parseClipValue(values, 3);
	var w = 1 - right - left;
	var h = 1 - top - bottom;

	shape.setAttribute('x', left);
	shape.setAttribute('y', top);
	shape.setAttribute('width', w);
	shape.setAttribute('height', h);

	if (values.length > 4 && values[4] == 'round')
	{
		var r = this.parseClipValue(values, 5);
		shape.setAttribute('rx', r);
		shape.setAttribute('ry', r);
	}

	clip.appendChild(shape);

	return new mxRectangle(left, top, w, h);
};

/**
 * Function: parseClipValue
 * 
 * Parses the given clip value as a relative number between 0 and 1.
 */
mxSvgCanvas2D.prototype.parseClipValue = function(values, index)
{
	var str = values[Math.min(index, values.length - 1)];
	var value = 1;

	if (str == 'center')
	{
		value = 0.5;
	}
	else if (str == 'top' || str == 'left')
	{
		value = 0;
	}
	else
	{
		var temp = parseFloat(str);

		if (!isNaN(temp))
		{
			value = Math.max(0, Math.min(1, temp / 100));
		}
	}

	return value;
};

/**
 * Function: setClip
 * 
 * Paints the given text. Possible values for format are empty string for
 * plain text and html for HTML markup.
 */
mxSvgCanvas2D.prototype.setClip = function(node, c)
{
	// Removes previous clip-path
	if (node.getAttribute('clip-path') != null)
	{
		var id = node.getAttribute('clip-path').replace(/url\(.*#/, '').replace(/\)$/, '');
		var clipNode = document.getElementById(id);
		
		if (clipNode != null && clipNode.parentNode != null)
		{
			clipNode.parentNode.removeChild(clipNode);
		}
	}
	
	if (this.defs != null)
	{
		this.defs.appendChild(c);
	}
	else
	{
		// Makes sure clip is removed with referencing node
		this.root.appendChild(c);
	}
	
	if (!mxClient.IS_CHROMEAPP && this.root.ownerDocument == document)
	{
		// Workaround for potential base tag
		var base = this.getBaseUrl().replace(/([\(\)])/g, '\\$1');
		node.setAttribute('clip-path', 'url(' + base + '#' + c.getAttribute('id') + ')');
	}
	else
	{
		node.setAttribute('clip-path', 'url(#' + c.getAttribute('id') + ')');
	}
};

/**
 * Function: plainText
 * 
 * Paints the given text. Possible values for format are empty string for
 * plain text and html for HTML markup.
 */
mxSvgCanvas2D.prototype.plainText = function(x, y, w, h, str, align, valign, wrap, overflow, clip, rotation, dir, textElement, node, blockTextHeight, htmlContentWidth)
{
	rotation = (rotation != null) ? rotation : 0;

	var s = this.state;
	var size = s.fontSize;
	var tr = s.transform || '';

	node = (node != null) ? node : this.addTitle(this.createElement('g'));
	this.updateFont(node);

	// Ignores pointer events
	if (!this.pointerEvents && this.originalRoot == null)
	{
		node.setAttribute('pointer-events', 'none');
	}
	else
	{
		node.removeAttribute('pointer-events');
	}

	// Non-rotated text
	if (rotation != 0)
	{
		tr += 'rotate(' + rotation  + ',' + this.format(x * s.scale) + ',' + this.format(y * s.scale) + ')';
	}

	if (dir != null && dir.substring(0, 9) != 'vertical-')
	{
		node.setAttribute('direction', dir);
	}

	// Default is left
	var anchor = (align == mxConstants.ALIGN_RIGHT) ? 'end' :
		(align == mxConstants.ALIGN_CENTER) ? 'middle' : 'start';

	// Always set text-anchor explicitly to avoid inheriting
	// a different value from a parent element
	node.setAttribute('text-anchor', anchor);

	if (tr.length > 0)
	{
		node.setAttribute('transform', tr);
	}

	if (s.alpha < 1)
	{
		node.setAttribute('opacity', s.alpha);
	}

	var lines = str.split('\n');
	var lh = Math.round(size * mxConstants.LINE_HEIGHT);
	var textHeight = (blockTextHeight != null) ? blockTextHeight :
		size + (lines.length - 1) * lh;

	// For block mode, y offsets on child elements already include baseline
	var cy = (blockTextHeight != null) ? y : y + size - 1;

	if (valign == mxConstants.ALIGN_MIDDLE)
	{
		if (overflow == 'fill')
		{
			cy -= h / 2;
		}
		else
		{
			var dy = ((this.matchHtmlAlignment && clip && h > 0) ? Math.min(textHeight, h) : textHeight) / 2;
			cy -= dy;
		}
	}
	else if (valign == mxConstants.ALIGN_BOTTOM)
	{
		if (overflow == 'fill')
		{
			cy -= h;
		}
		else
		{
			var dy = (this.matchHtmlAlignment && clip && h > 0) ?
				Math.min(textHeight, h) : textHeight;
			cy -= dy + 1;
		}
	}

	if (textElement != null)
	{
		if (blockTextHeight != null)
		{
			// Block mode: textElement is a <g> with multiple <text> children
			// Uses transform with scale to position the group; child y offsets
			// and font-sizes remain in unscaled coordinates so that only the
			// group transform needs updating on zoom change
			var tx = this.format(x * s.scale) + this.textOffset;
			var ty = this.format(cy * s.scale) + this.textOffset;
			textElement.setAttribute('transform', 'translate(' + tx + ',' + ty + ') scale(' + s.scale + ')');

			// Stores block text height for updateText
			node.setAttribute('data-blockTextHeight', blockTextHeight);

			// Stores HTML content width for updateText overflow adjustment
			if (htmlContentWidth != null)
			{
				node.setAttribute('data-htmlContentWidth', htmlContentWidth);
			}

			// Sets x on each child <text> for horizontal alignment
			var children = textElement.childNodes;

			for (var i = 0; i < children.length; i++)
			{
				if (children[i].nodeName == 'text')
				{
					var existingDx = parseFloat(children[i].getAttribute('dx')) || 0;

					// Adjusts indent based on alignment direction:
					// start (left): positive x pushes text right
					// end (right): negative x pulls text end left
					// middle (center): no indent offset
					var indentX = (anchor == 'start') ? existingDx :
						((anchor == 'end') ? -existingDx : 0);
					children[i].setAttribute('x', indentX);
					children[i].removeAttribute('dx');
				}
			}

			node.appendChild(textElement);
			this.root.appendChild(node);
			node.setAttribute('font-size', size + 'px');

			// Adjusts position to match HTML overflow:hidden behavior where
			// centered/right content wider than the container is left-aligned
			if (clip && (anchor == 'middle' || anchor == 'end'))
			{
				this.adjustBlockTextOverflow(textElement, x, cy, w, s.scale, htmlContentWidth, align);
			}
		}
		else
		{
			// Inline mode: wraps text in a <g> with translate+scale transform,
			// consistent with block mode so that dy values on tspan children
			// (computed from unscaled font sizes) scale correctly with zoom
			var inlineGroup = this.createElement('g');
			var tx = this.format(x * s.scale) + this.textOffset;
			var ty = this.format(cy * s.scale) + this.textOffset;
			inlineGroup.setAttribute('transform', 'translate(' + tx + ',' + ty + ') scale(' + s.scale + ')');
			inlineGroup.appendChild(textElement);
			node.appendChild(inlineGroup);
			this.root.appendChild(node);

			node.setAttribute('font-size', size + 'px');
		}
	}
	else if (node.parentNode != null)
	{
		if (blockTextHeight != null)
		{
			// Block mode update: find the <g> textElement and update its transform
			var textGroup = node.firstChild;

			if (textGroup != null && textGroup.nodeName == 'title')
			{
				textGroup = textGroup.nextSibling;
			}

			if (textGroup != null && textGroup.nodeName == 'g')
			{
				var tx = this.format(x * s.scale) + this.textOffset;
				var ty = this.format(cy * s.scale) + this.textOffset;
				textGroup.setAttribute('transform', 'translate(' + tx + ',' + ty + ') scale(' + s.scale + ')');

				// Adjusts position to match HTML overflow:hidden behavior
				if (clip && (align == mxConstants.ALIGN_CENTER ||
					align == mxConstants.ALIGN_RIGHT))
				{
					var storedWidth = parseFloat(node.getAttribute('data-htmlContentWidth'));
					this.adjustBlockTextOverflow(textGroup, x, cy, w, s.scale,
						isNaN(storedWidth) ? null : storedWidth, align);
				}
			}

			node.setAttribute('font-size', size + 'px');
		}
		else
		{
			// Inline mode update: uses transform with scale, consistent with initial render
			var textChild = node.firstChild;

			if (textChild != null && textChild.nodeName == 'title')
			{
				textChild = textChild.nextSibling;
			}

			var tx = this.format(x * s.scale) + this.textOffset;
			var ty = this.format(cy * s.scale) + this.textOffset;
			textChild.setAttribute('transform', 'translate(' + tx + ',' + ty + ') scale(' + s.scale + ')');

			node.setAttribute('font-size', size + 'px');
		}
	}
	else
	{
		if (!this.styleEnabled || size != mxConstants.DEFAULT_FONTSIZE)
		{
			node.setAttribute('font-size', (size * s.scale) + 'px');
		}

		for (var i = 0; i < lines.length; i++)
		{
			// Workaround for bounding box of empty lines and spaces
			if (lines[i].length > 0 && mxUtils.trim(lines[i]).length > 0)
			{
				var text = this.createElement('text');
				// LATER: Match horizontal HTML alignment
				text.setAttribute('x', this.format(x * s.scale) + this.textOffset);
				text.setAttribute('y', this.format(cy * s.scale) + this.textOffset);

				mxUtils.write(text, lines[i]);
				node.appendChild(text);
			}

			cy += lh;
		}

		this.root.appendChild(node);
		this.addTextBackground(node, str, x, y, w, (overflow == 'fill') ? h : textHeight, align, valign, overflow);
	}

	if (clip && w > 0 && h > 0)
	{
		var cx = x;
		var cy = y;

		if (align == mxConstants.ALIGN_CENTER)
		{
			cx -= w / 2;
		}
		else if (align == mxConstants.ALIGN_RIGHT)
		{
			cx -= w;
		}

		if (overflow != 'fill')
		{
			if (valign == mxConstants.ALIGN_MIDDLE)
			{
				cy -= h / 2;
			}
			else if (valign == mxConstants.ALIGN_BOTTOM)
			{
				cy -= h;
			}
		}

		// LATER: Remove spacing from clip rectangle
		this.setClip(node, this.createClip(
			cx * s.scale - 2, cy * s.scale - 2,
			w * s.scale + 4, h * s.scale + 4));
	}
};

/**
 * Function: measureHtmlContentWidth
 *
 * Measures the max-content width of an HTML element by temporarily rendering
 * it in the document. Returns the width in CSS pixels, or null on failure.
 */
mxSvgCanvas2D.prototype.measureHtmlContentWidth = function(contentElt)
{
	try
	{
		var s = this.state;
		var container = document.createElement('div');
		container.style.cssText = 'position:absolute;visibility:hidden;' +
			'display:inline-block;white-space:nowrap;' +
			'font-size:' + s.fontSize + 'px;' +
			'font-family:' + mxUtils.parseCssFontFamily(s.fontFamily, true) + ';' +
			'line-height:' + (s.fontSize * mxConstants.LINE_HEIGHT) + 'px;';

		if ((s.fontStyle & mxConstants.FONT_BOLD) == mxConstants.FONT_BOLD)
		{
			container.style.fontWeight = 'bold';
		}

		if ((s.fontStyle & mxConstants.FONT_ITALIC) == mxConstants.FONT_ITALIC)
		{
			container.style.fontStyle = 'italic';
		}

		for (var i = 0; i < contentElt.childNodes.length; i++)
		{
			container.appendChild(contentElt.childNodes[i].cloneNode(true));
		}

		document.body.appendChild(container);
		var width = container.offsetWidth;
		document.body.removeChild(container);

		return width;
	}
	catch (e)
	{
		return null;
	}
};

/**
 * Function: adjustBlockTextOverflow
 *
 * Adjusts block text group position to match HTML overflow:hidden behavior.
 * In HTML, when centered content is wider than its overflow:hidden container,
 * the content is left-aligned (starts at the container's left edge) rather
 * than centered. This shifts the SVG text group to match that behavior.
 */
mxSvgCanvas2D.prototype.adjustBlockTextOverflow = function(textGroup, x, cy, w, scale, contentWidth, align)
{
	try
	{
		if (contentWidth == null)
		{
			contentWidth = textGroup.getBBox().width;
		}

		if (contentWidth > w)
		{
			var shift = (align == mxConstants.ALIGN_CENTER) ?
				(contentWidth - w) / 2 : (contentWidth - w);
			var tx = this.format((x + shift) * scale) + this.textOffset;
			var ty = this.format(cy * scale) + this.textOffset;
			textGroup.setAttribute('transform',
				'translate(' + tx + ',' + ty + ') scale(' + scale + ')');
		}
	}
	catch (e)
	{
		// getBBox may not be available (e.g. element not in DOM)
	}
};

/**
 * Function: updateFont
 *
 * Updates the text properties for the given node. (NOTE: For this to work in
 * IE, the given node must be a text or tspan element.)
 */
mxSvgCanvas2D.prototype.updateFont = function(node)
{
	var s = this.state;
	var cssFontColor = this.getLightDarkColor(s.fontColor);
	node.setAttribute('fill', cssFontColor.light);
	node.style.fill = cssFontColor.cssText;

	if (!this.styleEnabled || s.fontFamily != mxConstants.DEFAULT_FONTFAMILY)
	{
		node.setAttribute('font-family', mxUtils.parseCssFontFamily(s.fontFamily));
	}

	if ((s.fontStyle & mxConstants.FONT_BOLD) == mxConstants.FONT_BOLD)
	{
		node.setAttribute('font-weight', 'bold');
	}

	if ((s.fontStyle & mxConstants.FONT_ITALIC) == mxConstants.FONT_ITALIC)
	{
		node.setAttribute('font-style', 'italic');
	}
	
	var txtDecor = [];
	
	if ((s.fontStyle & mxConstants.FONT_UNDERLINE) == mxConstants.FONT_UNDERLINE)
	{
		txtDecor.push('underline');
	}
	
	if ((s.fontStyle & mxConstants.FONT_STRIKETHROUGH) == mxConstants.FONT_STRIKETHROUGH)
	{
		txtDecor.push('line-through');
	}

	if (txtDecor.length > 0)
	{
		node.setAttribute('text-decoration', txtDecor.join(' '));

		if ((s.fontStyle & mxConstants.FONT_UNDERLINE_DOTTED) == mxConstants.FONT_UNDERLINE_DOTTED)
		{
			node.style.textDecorationStyle = 'dotted';
		}
	}
};

/**
 * Function: addTextBackground
 * 
 * Background color and border
 */
mxSvgCanvas2D.prototype.addTextBackground = function(node, str, x, y, w, h, align, valign, overflow)
{
	var s = this.state;

	if (document.body != null && (s.fontBackgroundColor != null ||
		s.fontBorderColor != null))
	{
		var bbox = null;
		
		if (overflow == 'fill' || overflow == 'width')
		{
			if (align == mxConstants.ALIGN_CENTER)
			{
				x -= w / 2;
			}
			else if (align == mxConstants.ALIGN_RIGHT)
			{
				x -= w;
			}
			
			if (valign == mxConstants.ALIGN_MIDDLE)
			{
				y -= h / 2;
			}
			else if (valign == mxConstants.ALIGN_BOTTOM)
			{
				y -= h;
			}
			
			bbox = new mxRectangle((x + 1) * s.scale, y * s.scale, (w - 2) * s.scale, (h + 2) * s.scale);
		}
		else if (node.getBBox != null && this.root.ownerDocument == document)
		{
			// Uses getBBox only if inside document for correct size
			try
			{
				bbox = node.getBBox();
				bbox = new mxRectangle(bbox.x, bbox.y + 1, bbox.width, bbox.height);
			}
			catch (e)
			{
				// Ignores NS_ERROR_FAILURE in FF if container display is none.
			}
		}
		
		if (bbox == null || bbox.width == 0 || bbox.height == 0)
		{
			// Computes size if not in document or no getBBox available
			var size = mxUtils.getSizeForString(
				mxUtils.htmlEntities(str, false).replace(/\n/g, '<br/>'),
				s.fontSize, s.fontFamily, null, s.fontStyle);
			var w = size.width;
			var h = size.height;

			if (align == mxConstants.ALIGN_CENTER)
			{
				x -= w / 2;
			}
			else if (align == mxConstants.ALIGN_RIGHT)
			{
				x -= w;
			}

			if (valign == mxConstants.ALIGN_MIDDLE)
			{
				y -= h / 2;
			}
			else if (valign == mxConstants.ALIGN_BOTTOM)
			{
				y -= h;
			}

			bbox = new mxRectangle((x + 1) * s.scale, (y + 2) * s.scale, w * s.scale, (h + 1) * s.scale);
		}
		
		if (bbox != null)
		{
			var n = this.createElement('rect');
			var cssBg = (s.fontBackgroundColor != null &&
				s.fontBackgroundColor != mxConstants.NONE) ?
				this.getLightDarkColor(s.fontBackgroundColor) : null;
			var cssBorder = (s.fontBorderColor != null &&
				s.fontBorderColor != mxConstants.NONE) ?
				this.getLightDarkColor(s.fontBorderColor) : null;

			n.setAttribute('fill', (cssBg != null) ? cssBg.light : 'none');
			n.setAttribute('stroke', (cssBorder != null) ? cssBorder.light : 'none');
			n.setAttribute('x', Math.floor(bbox.x - 1));
			n.setAttribute('y', Math.floor(bbox.y - 1));
			n.setAttribute('width', Math.ceil(bbox.width + 2));
			n.setAttribute('height', Math.ceil(bbox.height));

			if (cssBg != null)
			{
				n.style.fill = cssBg.cssText;
			}

			if (cssBorder)
			{
				n.style.stroke = cssBorder.cssText;
			}

			var sw = (s.fontBorderColor != null) ? Math.max(1, this.format(s.scale)) : 0;
			n.setAttribute('stroke-width', sw);
			
			// Workaround for crisp rendering - only required if not exporting
			if (this.root.ownerDocument == document && mxUtils.mod(sw, 2) == 1)
			{
				n.setAttribute('transform', 'translate(0.5, 0.5)');
			}
			
			node.insertBefore(n, node.firstChild);
		}
	}
};

/**
 * Function: stroke
 * 
 * Paints the outline of the current path.
 */
mxSvgCanvas2D.prototype.stroke = function()
{
	this.addNode(false, true);
};

/**
 * Function: fill
 * 
 * Fills the current path.
 */
mxSvgCanvas2D.prototype.fill = function()
{
	this.addNode(true, false);
};

/**
 * Function: fillAndStroke
 * 
 * Fills and paints the outline of the current path.
 */
mxSvgCanvas2D.prototype.fillAndStroke = function()
{
	this.addNode(true, true);
};
