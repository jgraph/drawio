/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
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
	mxSvgCanvas2D.prototype.useDomParser = !mxClient.IS_IE && typeof DOMParser === 'function' && typeof XMLSerializer === 'function';
	
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
	mxSvgCanvas2D.prototype.useAbsoluteIds = !mxClient.IS_CHROMEAPP && !mxClient.IS_IE && !mxClient.IS_IE11 &&
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
 * Variable: cacheOffsetSize
 * 
 * Specifies if offsetWidth and offsetHeight should be cached. Default is true.
 * This is used to speed up repaint of text in <updateText>.
 */
mxSvgCanvas2D.prototype.cacheOffsetSize = true;

/**
 * Function: addForeignObject
 * 
 * Creates a foreignObject for the given string and adds it to the given root.
 */
mxSvgCanvas2D.prototype.setCssText = function(elt, css)
{
	if (elt != null)
	{
		if (mxClient.IS_IE || mxClient.IS_IE11)
		{
			elt.setAttribute('style', css);
		}
		else if (elt.style != null)
		{
			elt.style.cssText = css;
		}
	}
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
	
		var alt = this.createElement('text');
		alt.setAttribute('x', Math.round(x + s.dx));
		alt.setAttribute('y', Math.round(y + s.dy + dy * s.fontSize));
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
		}
		
		mxUtils.write(alt, text);
		
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
	start = mxUtils.rgba2hex(start);

	// Removes illegal characters from gradient ID
	if (start.charAt(0) == '#')
	{
		start = start.substring(1);
	}
	
	end = mxUtils.rgba2hex(end);
	
	if (end.charAt(0) == '#')
	{
		end = end.substring(1);
	}
	
	// Workaround for gradient IDs not working in Safari 5 / Chrome 6
	// if they contain uppercase characters
	start = start.toLowerCase() + '-' + alpha1;
	end = end.toLowerCase() + '-' + alpha2;

	// Wrong gradient directions possible?
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
	
	return 'mx-gradient-' + start + '-' + end + '-' + dir;
};

/**
 * Function: getSvgGradient
 * 
 * Private helper function to create SVG elements
 */
mxSvgCanvas2D.prototype.getSvgGradient = function(start, end, alpha1, alpha2, direction)
{
	var id = this.createGradientId(start, end, alpha1, alpha2, direction);
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
	stop.style.stopColor = start;
	stop.style.stopOpacity = alpha1;
	gradient.appendChild(stop);
	
	stop = this.createElement('stop');
	stop.setAttribute('offset', '100%');
	stop.style.stopColor = end;
	stop.style.stopOpacity = alpha2;
	gradient.appendChild(stop);
	
	return gradient;
};

/**
 * Function: createFillPatternId
 * 
 * Private helper function to create fillPattern Id
 */
mxSvgCanvas2D.prototype.createFillPatternId = function(type, strokeSize, color)
{
	color = mxUtils.rgba2hex(color);

	// Removes illegal characters from gradient ID
	if (color.charAt(0) == '#')
	{
		color = color.substring(1);
	}

	return ('mx-pattern-' + type + '-' + strokeSize + '-' + color).toLowerCase();
};

/**
 * Function: getFillPattern
 * 
 * Private helper function to create FillPattern SVG elements
 */
mxSvgCanvas2D.prototype.getFillPattern = function(type, strokeSize, color, scale)
{
	var id = this.createFillPatternId(type, strokeSize, color);
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

	return fillPattern.getAttribute('id');
};

mxSvgCanvas2D.prototype.createHatchPattern = function(strokeSize, color, scale)
{
	var sw = strokeSize * 1.5 * scale;
	var size = this.format((10 + sw) * scale);

	var fillPattern = this.createElement('pattern');
	fillPattern.setAttribute('patternUnits', 'userSpaceOnUse');
	fillPattern.setAttribute('width', size);
	fillPattern.setAttribute('height', size);
	fillPattern.setAttribute('x', '0');
	fillPattern.setAttribute('y', '0');	 
	fillPattern.setAttribute('patternTransform', 'rotate(45)');
	
	var line = this.createElement('line');
	line.setAttribute('x1', '0');
	line.setAttribute('y1', '0');
	line.setAttribute('x2', '0');
	line.setAttribute('y2', size);
	line.setAttribute('stroke', color); //TODO Is Gradient Color possible?
	line.setAttribute('stroke-width', sw);
	
	fillPattern.appendChild(line);
	return fillPattern;
};

mxSvgCanvas2D.prototype.createDashedPattern = function(strokeSize, color, scale)
{
	var sw = strokeSize * 1.5 * scale;
	var size = this.format((10 + sw) * scale);

	var fillPattern = this.createElement('pattern');
	fillPattern.setAttribute('patternUnits', 'userSpaceOnUse');
	fillPattern.setAttribute('width', size);
	fillPattern.setAttribute('height', size);
	fillPattern.setAttribute('x', '0');
	fillPattern.setAttribute('y', '0');	 
	fillPattern.setAttribute('patternTransform', 'rotate(45)');
	
	var line = this.createElement('line');
	line.setAttribute('x1', '0');
	line.setAttribute('y1', size / 4);
	line.setAttribute('x2', '0');
	line.setAttribute('y2', 3 * size / 4);
	line.setAttribute('stroke', color); //TODO Is Gradient Color possible?
	line.setAttribute('stroke-width', sw);
	
	fillPattern.appendChild(line);
	return fillPattern;
};

mxSvgCanvas2D.prototype.createZigZagLinePattern = function(strokeSize, color, scale)
{
	var sw = strokeSize * 1.5 * scale;
	var size = this.format((10 + sw) * scale);

	var fillPattern = this.createElement('pattern');
	fillPattern.setAttribute('patternUnits', 'userSpaceOnUse');
	fillPattern.setAttribute('width', size);
	fillPattern.setAttribute('height', size);
	fillPattern.setAttribute('x', '0');
	fillPattern.setAttribute('y', '0');	 
	fillPattern.setAttribute('patternTransform', 'rotate(45)');
	
	var path = this.createElement('path');
	var s1_4 = size / 4, s3_4 = 3 * size / 4;
	path.setAttribute('d', 'M ' + s1_4 + ' 0 L ' + s3_4 + ' 0 L ' + s1_4 + ' ' + size + ' L ' + s3_4 + ' ' + size);
	path.setAttribute('stroke', color); //TODO Is Gradient Color possible?
	path.setAttribute('stroke-width', sw);
	path.setAttribute('fill', 'none');

	fillPattern.appendChild(path);
	return fillPattern;
};

mxSvgCanvas2D.prototype.createCrossHatchPattern = function(strokeSize, color, scale)
{
	var sw = strokeSize * 0.5 * scale;
	var size = this.format(1.5 * (10 + sw) * scale);

	var fillPattern = this.createElement('pattern');
	fillPattern.setAttribute('patternUnits', 'userSpaceOnUse');
	fillPattern.setAttribute('width', size);
	fillPattern.setAttribute('height', size);
	fillPattern.setAttribute('x', '0');
	fillPattern.setAttribute('y', '0');	 
	fillPattern.setAttribute('patternTransform', 'rotate(45)');
	
	var rect = this.createElement('rect');
	rect.setAttribute('x', 0);
	rect.setAttribute('y', 0);
	rect.setAttribute('width', size);
	rect.setAttribute('height', size);
	rect.setAttribute('stroke', color); //TODO Is Gradient Color possible?
	rect.setAttribute('stroke-width', sw);
	rect.setAttribute('fill', 'none');
	
	fillPattern.appendChild(rect);
	return fillPattern;
};

mxSvgCanvas2D.prototype.createDotsPattern = function(strokeSize, color, scale)
{
	var size = this.format((10 + strokeSize) * scale);

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
	circle.setAttribute('fill', color); //TODO Is Gradient Color possible?
	
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
	
	var fill, isGradient = false;

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
		}
		else
		{
			fill = String(s.fillColor).toLowerCase()
		}
	}

	var pId = (s.fillStyle == null || s.fillStyle == 'auto' || s.fillStyle == 'solid') ? null :
		this.getFillPattern(s.fillStyle, this.getCurrentStrokeWidth(), fill, s.scale);

	if (isGradient || pId == null)
	{
		this.node.setAttribute('fill', fill);
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

	this.node.setAttribute('stroke', String(s.strokeColor).toLowerCase());
	
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
 * Private helper function to create SVG elements
 */
mxSvgCanvas2D.prototype.image = function(x, y, w, h, src, aspect, flipH, flipV, clipPath)
{
	src = this.converter.convert(src);
	
	// LATER: Add option for embedding images as base64.
	aspect = (aspect != null) ? aspect : true;
	flipH = (flipH != null) ? flipH : false;
	flipV = (flipV != null) ? flipV : false;
	
	var s = this.state;
	x += s.dx;
	y += s.dy;
	
	var node = this.createElement('image');
	node.setAttribute('x', this.format(x * s.scale) + this.imageOffset);
	node.setAttribute('y', this.format(y * s.scale) + this.imageOffset);
	node.setAttribute('width', this.format(w * s.scale));
	node.setAttribute('height', this.format(h * s.scale));
	
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

	// IE uses this code for export as it cannot render foreignObjects
	if (!mxClient.IS_IE && !mxClient.IS_IE11 && document.createElementNS)
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
	if (node != null && node.firstChild != null && node.firstChild.firstChild != null)
	{
		this.updateTextNodes(x, y, w, h, align, valign, wrap, overflow, clip, rotation, dir, node.firstChild);
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
	
	mxSvgCanvas2D.createCss(w + this.foreignObjectPadding, h, align, valign, wrap, overflow, clip, dir,
		(this.state.fontBackgroundColor != null) ? this.state.fontBackgroundColor : null,
		(this.state.fontBorderColor != null) ? this.state.fontBorderColor : null,
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
		
		var div = fo.firstChild;
		var box = div.firstChild;
		var text = box.firstChild;
		var r = ((this.rotateHtml) ? this.state.rotation : 0) + ((rotation != null) ? rotation : 0);
		var t = ((this.foOffset != 0) ? 'translate(' + this.foOffset + ' ' + this.foOffset + ')' : '') +
			((s != 1) ? 'scale(' + s + ')' : '');
		
		this.setCssText(text, block);
		this.setCssText(box, item);

		// Required for rgba-selectors as alpha=1 is removed in CSS
		box.setAttribute('data-drawio-colors', 'color: ' +  this.state.fontColor + '; ' +
			((this.state.fontBackgroundColor == null) ? '' :
				'background-color: ' + this.state.fontBackgroundColor + '; ') +
			((this.state.fontBorderColor == null) ? '' :
				'border-color: ' + this.state.fontBorderColor + '; '));
		
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
		bgc += 'border: 1px solid ' + border + '; ';
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
		mxUtils.htmlEntities(s.fontColor) + '; line-height: ' + mxUtils.htmlEntities(lh) +
		'; pointer-events: ' + ((this.pointerEvents) ?
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
		css += 'text-decoration: ' + deco.join(' ') + '; ';
	}

	return css;
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
				if (dir != null && dir.substring(0, 9) != 'vertical-')
				{
					div.setAttribute('dir', dir);
				}
				
				this.addForeignObject(x, y, w, h, str, align, valign, wrap,
					format, overflow, clip, rotation, dir, div, this.root);
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
	if (this.defs != null)
	{
		this.defs.appendChild(c);
	}
	else
	{
		// Makes sure clip is removed with referencing node
		this.root.appendChild(c);
	}
	
	if (!mxClient.IS_CHROMEAPP && !mxClient.IS_IE && !mxClient.IS_IE11 &&
		!mxClient.IS_EDGE && this.root.ownerDocument == document)
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
mxSvgCanvas2D.prototype.plainText = function(x, y, w, h, str, align, valign, wrap, overflow, clip, rotation, dir)
{
	rotation = (rotation != null) ? rotation : 0;
	
	var s = this.state;
	var size = s.fontSize;
	var tr = s.transform || '';

	var node = this.addTitle(this.createElement('g'));
	this.updateFont(node);
				
	// Ignores pointer events
	if (!this.pointerEvents && this.originalRoot == null)
	{
		node.setAttribute('pointer-events', 'none');
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

	// Default is left
	var anchor = (align == mxConstants.ALIGN_RIGHT) ? 'end' :
		(align == mxConstants.ALIGN_CENTER) ? 'middle' : 'start';

	// Text-anchor start is default in SVG
	if (anchor != 'start')
	{
		node.setAttribute('text-anchor', anchor);
	}
	
	if (!this.styleEnabled || size != mxConstants.DEFAULT_FONTSIZE)
	{
		node.setAttribute('font-size', (size * s.scale) + 'px');
	}
	
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
	var textHeight = size + (lines.length - 1) * lh;

	var cy = y + size - 1;

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
			var dy = (this.matchHtmlAlignment && clip && h > 0) ? Math.min(textHeight, h) : textHeight;
			cy -= dy + 1;
		}
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

	node.setAttribute('fill', s.fontColor);
	
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
				var ie = mxClient.IS_IE && mxClient.IS_SVG;
				bbox = new mxRectangle(bbox.x, bbox.y + ((ie) ? 0 : 1), bbox.width, bbox.height + ((ie) ? 1 : 0));
			}
			catch (e)
			{
				// Ignores NS_ERROR_FAILURE in FF if container display is none.
			}
		}
		
		if (bbox == null || bbox.width == 0 || bbox.height == 0)
		{
			// Computes size if not in document or no getBBox available
			var div = document.createElement('div');

			// Wrapping and clipping can be ignored here
			div.style.lineHeight = (mxConstants.ABSOLUTE_LINE_HEIGHT) ?
				(s.fontSize * mxConstants.LINE_HEIGHT) + 'px' :
				mxConstants.LINE_HEIGHT;
			div.style.fontSize = s.fontSize + 'px';
			div.style.fontFamily = mxUtils.parseCssFontFamily(s.fontFamily);
			div.style.whiteSpace = 'nowrap';
			div.style.position = 'absolute';
			div.style.visibility = 'hidden';
			div.style.display = 'inline-block';
			div.style.zoom = '1';
			
			if ((s.fontStyle & mxConstants.FONT_BOLD) == mxConstants.FONT_BOLD)
			{
				div.style.fontWeight = 'bold';
			}

			if ((s.fontStyle & mxConstants.FONT_ITALIC) == mxConstants.FONT_ITALIC)
			{
				div.style.fontStyle = 'italic';
			}
			
			str = mxUtils.htmlEntities(str, false);
			div.innerHTML = str.replace(/\n/g, '<br/>');
			
			document.body.appendChild(div);
			var w = div.offsetWidth;
			var h = div.offsetHeight;
			div.parentNode.removeChild(div);
			
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
			n.setAttribute('fill', s.fontBackgroundColor || 'none');
			n.setAttribute('stroke', s.fontBorderColor || 'none');
			n.setAttribute('x', Math.floor(bbox.x - 1));
			n.setAttribute('y', Math.floor(bbox.y - 1));
			n.setAttribute('width', Math.ceil(bbox.width + 2));
			n.setAttribute('height', Math.ceil(bbox.height));

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
