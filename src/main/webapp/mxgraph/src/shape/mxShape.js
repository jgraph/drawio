/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: mxShape
 *
 * Base class for all shapes. A shape in mxGraph is a
 * separate implementation for SVG and HTML. Which
 * implementation to use is controlled by the <dialect>
 * property which is assigned from within the <mxCellRenderer>
 * when the shape is created. The dialect must be assigned
 * for a shape, and it does normally depend on the browser and
 * the confiuration of the graph (see <mxGraph> rendering hint).
 *
 * For each supported shape in SVG, a corresponding
 * shape exists in mxGraph, namely for text, image, rectangle,
 * rhombus, ellipse and polyline. The other shapes are a
 * combination of these shapes (eg. label and swimlane)
 * or they consist of one or more (filled) path objects
 * (eg. actor and cylinder). The HTML implementation is
 * optional but may be required for a HTML-only view of
 * the graph.
 *
 * Custom Shapes:
 *
 * To extend from this class, the basic code looks as follows.
 * In the special case where the custom shape consists only of
 * one filled region or one filled region and an additional stroke
 * the <mxActor> and <mxCylinder> should be subclassed,
 * respectively.
 *
 * (code)
 * function CustomShape() { }
 * 
 * CustomShape.prototype = new mxShape();
 * CustomShape.prototype.constructor = CustomShape; 
 * (end)
 *
 * To register a custom shape in an existing graph instance,
 * one must register the shape under a new name in the graph's
 * cell renderer as follows:
 *
 * (code)
 * mxCellRenderer.registerShape('customShape', CustomShape);
 * (end)
 *
 * The second argument is the name of the constructor.
 *
 * In order to use the shape you can refer to the given name above
 * in a stylesheet. For example, to change the shape for the default
 * vertex style, the following code is used:
 *
 * (code)
 * var style = graph.getStylesheet().getDefaultVertexStyle();
 * style[mxConstants.STYLE_SHAPE] = 'customShape';
 * (end)
 * 
 * Constructor: mxShape
 *
 * Constructs a new shape.
 */
function mxShape(stencil)
{
	this.stencil = stencil;
	this.initStyles();
};

/**
 * Variable: forceFilledPointerEvents
 *
 * Specifies if pointerEvents should be forced for filled shapes. Default is
 * false.
 */
mxShape.forceFilledPointerEvents = true;

/**
 * Variable: dialect
 *
 * Holds the dialect in which the shape is to be painted.
 * This can be one of the DIALECT constants in <mxConstants>.
 */
mxShape.prototype.dialect = null;

/**
 * Variable: scale
 *
 * Holds the scale in which the shape is being painted.
 */
mxShape.prototype.scale = 1;

/**
 * Variable: antiAlias
 * 
 * Rendering hint for configuring the canvas.
 */
mxShape.prototype.antiAlias = true;

/**
 * Variable: minSvgStrokeWidth
 * 
 * Minimum stroke width for SVG output.
 */
mxShape.prototype.minSvgStrokeWidth = 1;

/**
 * Variable: bounds
 *
 * Holds the <mxRectangle> that specifies the bounds of this shape.
 */
mxShape.prototype.bounds = null;

/**
 * Variable: points
 *
 * Holds the array of <mxPoints> that specify the points of this shape.
 */
mxShape.prototype.points = null;

/**
 * Variable: node
 *
 * Holds the outermost DOM node that represents this shape.
 */
mxShape.prototype.node = null;
 
/**
 * Variable: state
 * 
 * Optional reference to the corresponding <mxCellState>.
 */
mxShape.prototype.state = null;

/**
 * Variable: style
 *
 * Optional reference to the style of the corresponding <mxCellState>.
 */
mxShape.prototype.style = null;

/**
 * Variable: boundingBox
 *
 * Contains the bounding box of the shape, that is, the smallest rectangle
 * that includes all pixels of the shape.
 */
mxShape.prototype.boundingBox = null;

/**
 * Variable: stencil
 *
 * Holds the <mxStencil> that defines the shape.
 */
mxShape.prototype.stencil = null;

/**
 * Variable: svgStrokeTolerance
 *
 * Event-tolerance for SVG strokes (in px). Default is 8. This is only passed
 * to the canvas in <createSvgCanvas> if <pointerEvents> is true.
 */
mxShape.prototype.svgStrokeTolerance = 8;

/**
 * Variable: pointerEvents
 * 
 * Specifies if pointer events should be handled. Default is true.
 */
mxShape.prototype.pointerEvents = true;

/**
 * Variable: svgPointerEvents
 * 
 * Specifies if pointer events should be handled. Default is true.
 */
mxShape.prototype.svgPointerEvents = 'all';

/**
 * Variable: shapePointerEvents
 * 
 * Specifies if pointer events outside of shape should be handled. Default
 * is false.
 */
mxShape.prototype.shapePointerEvents = false;

/**
 * Variable: stencilPointerEvents
 * 
 * Specifies if pointer events outside of stencils should be handled. Default
 * is false. Set this to true for backwards compatibility with the 1.x branch.
 */
mxShape.prototype.stencilPointerEvents = false;

/**
 * Variable: outline
 * 
 * Specifies if the shape should be drawn as an outline. This disables all
 * fill colors and can be used to disable other drawing states that should
 * not be painted for outlines. Default is false. This should be set before
 * calling <apply>.
 */
mxShape.prototype.outline = false;

/**
 * Variable: visible
 * 
 * Specifies if the shape is visible. Default is true.
 */
mxShape.prototype.visible = true;

/**
 * Variable: useSvgBoundingBox
 * 
 * Allows to use the SVG bounding box in SVG. Default is false for performance
 * reasons.
 */
mxShape.prototype.useSvgBoundingBox = false;

/**
 * Function: init
 *
 * Initializes the shape by creaing the DOM node using <create>
 * and adding it into the given container.
 *
 * Parameters:
 *
 * container - DOM node that will contain the shape.
 */
mxShape.prototype.init = function(container)
{
	if (this.node == null)
	{
		this.node = this.create(container);
		
		if (container != null)
		{
			container.appendChild(this.node);
		}
	}
};

/**
 * Function: initStyles
 *
 * Sets the styles to their default values.
 */
mxShape.prototype.initStyles = function(container)
{
	this.strokewidth = 1;
	this.rotation = 0;
	this.opacity = 100;
	this.fillOpacity = 100;
	this.strokeOpacity = 100;
	this.flipH = false;
	this.flipV = false;
};

/**
 * Function: isHtmlAllowed
 * 
 * Returns true if HTML is allowed for this shape. This implementation always
 * returns false.
 */
mxShape.prototype.isHtmlAllowed = function()
{
	return false;
};

/**
 * Function: getSvgScreenOffset
 * 
 * Returns 0, or 0.5 if <strokewidth> % 2 == 1.
 */
mxShape.prototype.getSvgScreenOffset = function()
{
	var sw = this.stencil && this.stencil.strokewidth != 'inherit' ? Number(this.stencil.strokewidth) : this.strokewidth;
	
	return (mxUtils.mod(Math.max(1, Math.round(sw * this.scale)), 2) == 1) ? 0.5 : 0;
};

/**
 * Function: create
 *
 * Creates and returns the DOM node(s) for the shape in
 * the given container. This implementation invokes
 * <createSvg> or <createHtml> depending container
 * type.
 *
 * Parameters:
 *
 * container - DOM node that will contain the shape.
 */
mxShape.prototype.create = function(container)
{
	var node = null;
	
	if (container != null && container.ownerSVGElement != null)
	{
		node = this.createSvg(container);
	}
	else
	{
		node = this.createHtml(container);
	}
	
	return node;
};

/**
 * Function: createSvg
 *
 * Creates and returns the SVG node(s) to represent this shape.
 */
mxShape.prototype.createSvg = function()
{
	return document.createElementNS(mxConstants.NS_SVG, 'g');
};

/**
 * Function: createHtml
 *
 * Creates and returns the HTML DOM node(s) to represent
 * this shape.
 */
mxShape.prototype.createHtml = function()
{
	var node = document.createElement('div');
	node.style.position = 'absolute';
	
	return node;
};

/**
 * Function: reconfigure
 *
 * Reconfigures this shape. This will update the colors etc in
 * addition to the bounds or points.
 */
mxShape.prototype.reconfigure = function()
{
	this.redraw();
};

/**
 * Function: redraw
 *
 * Creates and returns the SVG node(s) to represent this shape.
 */
mxShape.prototype.redraw = function()
{
	this.updateBoundsFromPoints();
	
	if (this.visible && this.checkBounds())
	{
		this.node.style.visibility = 'visible';
		this.clear();
		
		if (this.node.nodeName == 'DIV')
		{
			this.redrawHtmlShape();
		}
		else
		{	
			this.redrawShape();
		}
	}
	else
	{
		this.node.style.visibility = 'hidden';
		this.boundingBox = null;
	}
};

/**
 * Function: clear
 * 
 * Removes all child nodes and resets all CSS.
 */
mxShape.prototype.clear = function()
{
	if (this.node.ownerSVGElement != null)
	{
		while (this.node.lastChild != null)
		{
			this.node.removeChild(this.node.lastChild);
		}
	}
	else
	{
		this.node.style.cssText = 'position:absolute;' + ((this.cursor != null) ?
			('cursor:' + this.cursor + ';') : '');
		this.node.innerText = '';
	}
};

/**
 * Function: updateBoundsFromPoints
 * 
 * Updates the bounds based on the points.
 */
mxShape.prototype.updateBoundsFromPoints = function()
{
	var pts = this.points;
	
	if (pts != null && pts.length > 0 && pts[0] != null)
	{
		this.bounds = new mxRectangle(Number(pts[0].x), Number(pts[0].y), this.scale, this.scale);
		
		for (var i = 1; i < this.points.length; i++)
		{
			if (pts[i] != null)
			{
				this.bounds.add(new mxRectangle(Number(pts[i].x), Number(pts[i].y), this.scale, this.scale));
			}
		}
	}
};

/**
 * Function: getLabelBounds
 * 
 * Returns the <mxRectangle> for the label bounds of this shape, based on the
 * given scaled and translated bounds of the shape. This method should not
 * change the rectangle in-place. This implementation returns the given rect.
 */
mxShape.prototype.getLabelBounds = function(rect)
{
	var d = mxUtils.getValue(this.style, mxConstants.STYLE_DIRECTION, mxConstants.DIRECTION_EAST);
	var bounds = rect;
	
	// Normalizes argument for getLabelMargins hook
	if (d != mxConstants.DIRECTION_SOUTH && d != mxConstants.DIRECTION_NORTH &&
		this.state != null && this.state.text != null &&
		this.state.text.isPaintBoundsInverted())
	{
		bounds = bounds.clone();
		var tmp = bounds.width;
		bounds.width = bounds.height;
		bounds.height = tmp;
	}
		
	var m = this.getLabelMargins(bounds);
	
	if (m != null)
	{
		var flipH = mxUtils.getValue(this.style, mxConstants.STYLE_FLIPH, false) == '1';
		var flipV = mxUtils.getValue(this.style, mxConstants.STYLE_FLIPV, false) == '1';
		
		// Handles special case for vertical labels
		if (this.state != null && this.state.text != null &&
			this.state.text.isPaintBoundsInverted())
		{
			var tmp = m.x;
			m.x = m.height;
			m.height = m.width;
			m.width = m.y;
			m.y = tmp;

			tmp = flipH;
			flipH = flipV;
			flipV = tmp;
		}
		
		return mxUtils.getDirectedBounds(rect, m, this.style, flipH, flipV);
	}
	
	return rect;
};

/**
 * Function: getLabelMargins
 * 
 * Returns the scaled top, left, bottom and right margin to be used for
 * computing the label bounds as an <mxRectangle>, where the bottom and right
 * margin are defined in the width and height of the rectangle, respectively.
 */
mxShape.prototype.getLabelMargins= function(rect)
{
	return null;
};

/**
 * Function: checkBounds
 * 
 * Returns true if the bounds are not null and all of its variables are numeric.
 */
mxShape.prototype.checkBounds = function()
{
	return (!isNaN(this.scale) && isFinite(this.scale) && this.scale > 0 &&
		this.bounds != null && !isNaN(this.bounds.x) && !isNaN(this.bounds.y) &&
		!isNaN(this.bounds.width) && !isNaN(this.bounds.height) &&
		this.bounds.width > 0 && this.bounds.height > 0);
};

/**
 * Function: getShadowStyle
 * 
 * Removes all child nodes and resets all CSS.
 */
mxShape.prototype.getShadowStyle = function()
{
	var s = {
		dx: mxConstants.SHADOW_OFFSET_X,
		dy: mxConstants.SHADOW_OFFSET_Y,
		blur: mxConstants.SHADOW_BLUR,
		color: mxConstants.SHADOWCOLOR,
		opacity: mxConstants.SHADOW_OPACITY * 100
	};

	if (this.style != null)
	{
		s.dx = mxUtils.getValue(this.style,
			mxConstants.STYLE_SHADOW_OFFSET_X, s.dx);
		s.dy = mxUtils.getValue(this.style,
			mxConstants.STYLE_SHADOW_OFFSET_Y, s.dy);
		s.blur = mxUtils.getValue(this.style,
			mxConstants.STYLE_SHADOW_BLUR, s.blur);
		s.color = mxUtils.getValue(this.style,
			mxConstants.STYLE_SHADOWCOLOR, s.color);
		s.opacity = mxUtils.getValue(this.style,
			mxConstants.STYLE_SHADOW_OPACITY, s.opacity);
	}

	return s;
};

/**
 * Function: createDropShadow
 * 
 * Removes all child nodes and resets all CSS.
 */
mxShape.prototype.createDropShadow = function(style, scale)
{
	return 'drop-shadow(' + Math.round(style.dx * scale * 100) / 100 + 'px ' +
		Math.round(style.dy * scale * 100) / 100 + 'px ' +
		Math.round(style.blur * scale * 100) / 100 + 'px ' +
		mxUtils.hex2rgba(style.color, style.opacity / 100) + ')';
};

/**
 * Function: updateSvgFilters
 * 
 * Removes all child nodes and resets all CSS.
 */
mxShape.prototype.updateSvgFilters = function(scale)
{
	this.node.style.filter = (this.isShadowEnabled()) ?
		this.createDropShadow(this.getShadowStyle(), scale) : '';
};

/**
 * Function: isShadowEnabled
 * 
 * Removes all child nodes and resets all CSS.
 */
mxShape.prototype.isShadowEnabled = function()
{
	return this.isShadow;
};

/**
 * Function: redrawShape
 *
 * Updates the SVG shape.
 */
mxShape.prototype.redrawShape = function()
{
	var canvas = this.createCanvas();
	
	if (canvas != null)
	{
		// Specifies if events should be handled
		canvas.pointerEvents = this.pointerEvents;
		this.beforePaint(canvas);
		this.paint(canvas);
		this.afterPaint(canvas);
		this.destroyCanvas(canvas);
	}
};

/**
 * Function: createCanvas
 * 
 * Creates a new canvas for drawing this shape. May return null.
 */
mxShape.prototype.createCanvas = function()
{
	var canvas = null;
	
	// LATER: Check if reusing existing DOM nodes improves performance
	if (this.node.ownerSVGElement != null)
	{
		canvas = this.createSvgCanvas();
	}
	
	if (canvas != null && this.outline)
	{
		canvas.setStrokeWidth(this.strokewidth);
		canvas.setStrokeColor(this.stroke);
		
		if (this.isDashed != null)
		{
			canvas.setDashed(this.isDashed);
		}
		
		canvas.setStrokeWidth = function() {};
		canvas.setStrokeColor = function() {};
		canvas.setFillColor = function() {};
		canvas.setGradient = function() {};
		canvas.setDashed = function() {};
		canvas.image = function() {};
		canvas.text = function() {};
	}

	return canvas;
};

/**
 * Function: createSvgCanvas
 * 
 * Creates and returns an <mxSvgCanvas2D> for rendering this shape.
 */
mxShape.prototype.createSvgCanvas = function()
{
	var canvas = new mxSvgCanvas2D(this.node, false);
	canvas.strokeTolerance = this.svgStrokeTolerance;
	canvas.pointerEventsValue = this.svgPointerEvents;
	var off = this.getSvgScreenOffset();

	if (off != 0)
	{
		this.node.setAttribute('transform', 'translate(' + off + ',' + off + ')');
	}
	else
	{
		this.node.removeAttribute('transform');
	}

	canvas.minStrokeWidth = this.minSvgStrokeWidth;
	
	if (!this.antiAlias)
	{
		// Rounds all numbers in the SVG output to integers
		canvas.format = function(value)
		{
			return Math.round(parseFloat(value));
		};
	}
	
	return canvas;
};

/**
 * Function: redrawHtml
 *
 * Redraw HTML
 */
mxShape.prototype.redrawHtmlShape = function()
{
	// LATER: Refactor methods
	this.updateHtmlBounds(this.node);
	this.updateHtmlFilters(this.node);
	this.updateHtmlColors(this.node);
};

/**
 * Function: updateHtmlFilters
 *
 * Update HTML filters
 */
mxShape.prototype.updateHtmlFilters = function(node)
{
	var f = '';
	
	if (this.opacity < 100)
	{
		f += 'alpha(opacity=' + (this.opacity) + ')';
	}
	
	if (this.isShadow)
	{
		// FIXME: Cannot implement shadow transparency with filter
		f += 'progid:DXImageTransform.Microsoft.dropShadow (' +
			'OffX=\'' + Math.round(mxConstants.SHADOW_OFFSET_X * this.scale) + '\', ' +
			'OffY=\'' + Math.round(mxConstants.SHADOW_OFFSET_Y * this.scale) + '\', ' +
			'Color=\'' + mxConstants.VML_SHADOWCOLOR + '\')';
	}
	
	if (this.fill != null && this.fill != mxConstants.NONE &&
		this.gradient && this.gradient != mxConstants.NONE)
	{
		var start = this.fill;
		var end = this.gradient;
		var type = '0';
		
		var lookup = {east:0,south:1,west:2,north:3};
		var dir = (this.direction != null) ? lookup[this.direction] : 0;
		
		if (this.gradientDirection != null)
		{
			dir = mxUtils.mod(dir + lookup[this.gradientDirection] - 1, 4);
		}

		if (dir == 1)
		{
			type = '1';
			var tmp = start;
			start = end;
			end = tmp;
		}
		else if (dir == 2)
		{
			var tmp = start;
			start = end;
			end = tmp;
		}
		else if (dir == 3)
		{
			type = '1';
		}
		
		f += 'progid:DXImageTransform.Microsoft.gradient(' +
			'startColorStr=\'' + start + '\', endColorStr=\'' + end +
			'\', gradientType=\'' + type + '\')';
	}

	node.style.filter = f;
};

/**
 * Function: updateHtmlColors
 *
 * Allow optimization by replacing VML with HTML.
 */
mxShape.prototype.updateHtmlColors = function(node)
{
	var color = this.stroke;
	
	if (color != null && color != mxConstants.NONE)
	{
		node.style.borderColor = color;

		if (this.isDashed)
		{
			node.style.borderStyle = 'dashed';
		}
		else if (this.strokewidth > 0)
		{
			node.style.borderStyle = 'solid';
		}

		node.style.borderWidth = Math.max(1, Math.ceil(this.strokewidth * this.scale)) + 'px';
	}
	else
	{
		node.style.borderWidth = '0px';
	}

	color = (this.outline) ? null : this.fill;
	
	if (color != null && color != mxConstants.NONE)
	{
		node.style.backgroundColor = color;
		node.style.backgroundImage = 'none';
	}
	else if (this.pointerEvents)
	{
		 node.style.backgroundColor = 'transparent';
	}
	else
	{
		this.setTransparentBackgroundImage(node);
	}
};

/**
 * Function: updateHtmlBounds
 *
 * Allow optimization by replacing VML with HTML.
 */
mxShape.prototype.updateHtmlBounds = function(node)
{
	var sw = Math.ceil(this.strokewidth * this.scale);
	node.style.borderWidth = Math.max(1, sw) + 'px';
	node.style.overflow = 'hidden';
	
	node.style.left = Math.round(this.bounds.x - sw / 2) + 'px';
	node.style.top = Math.round(this.bounds.y - sw / 2) + 'px';

	if (document.compatMode == 'CSS1Compat')
	{
		sw = -sw;
	}
	
	node.style.width = Math.round(Math.max(0, this.bounds.width + sw)) + 'px';
	node.style.height = Math.round(Math.max(0, this.bounds.height + sw)) + 'px';
};

/**
 * Function: destroyCanvas
 * 
 * Destroys the given canvas which was used for drawing. This implementation
 * increments the reference counts on all shared gradients used in the canvas.
 */
mxShape.prototype.destroyCanvas = function(canvas)
{
	// Manages reference counts
	if (canvas instanceof mxSvgCanvas2D)
	{
		// Increments ref counts
		for (var key in canvas.gradients)
		{
			var gradient = canvas.gradients[key];
			
			if (gradient != null)
			{
				gradient.mxRefCount = (gradient.mxRefCount || 0) + 1;
			}
		}

		for (var key in canvas.fillPatterns)
		{
			var pattern = canvas.fillPatterns[key];
			
			if (pattern != null)
			{
				pattern.mxRefCount = (pattern.mxRefCount || 0) + 1;
			}
		}

		this.releaseSvgGradients(this.oldGradients);
		this.releaseSvgFillPatterns(this.oldFillPatterns);
		this.oldGradients = canvas.gradients;
		this.oldFillPatterns = canvas.fillPatterns;
	}
};

/**
 * Function: beforePaint
 * 
 * Invoked before paint is called.
 */
mxShape.prototype.beforePaint = function(c) { };

/**
 * Function: afterPaint
 * 
 * Invokes after paint was called.
 */
mxShape.prototype.afterPaint = function(c) { };

/**
 * Function: paint
 * 
 * Generic rendering code.
 */
mxShape.prototype.paint = function(c)
{
	var pointerEvents = c.pointerEvents;
	var strokeDrawn = false;
	
	if (c != null && this.outline)
	{
		var stroke = c.stroke;
		
		c.stroke = function()
		{
			strokeDrawn = true;
			stroke.apply(this, arguments);
		};

		c.fillAndStroke = c.stroke;
	}

	// Scale is passed-through to canvas
	var s = this.scale;
	var x = this.bounds.x / s;
	var y = this.bounds.y / s;
	var w = this.bounds.width / s;
	var h = this.bounds.height / s;

	if (this.isPaintBoundsInverted())
	{
		var t = (w - h) / 2;
		x += t;
		y -= t;
		var tmp = w;
		w = h;
		h = tmp;
	}
	
	this.updateTransform(c, x, y, w, h);
	this.configureCanvas(c, x, y, w, h);
	this.updateSvgFilters((c != null) ? c.state.scale : s);

	// Adds background rectangle to capture events
	var bg = null;
	
	if ((this.stencil == null && this.points == null && this.shapePointerEvents) ||
		(this.stencil != null && this.stencilPointerEvents))
	{
		var bb = this.createBoundingBox();
		
		if (this.dialect == mxConstants.DIALECT_SVG)
		{
			bg = this.createTransparentSvgRectangle(bb.x, bb.y, bb.width, bb.height);
			this.node.appendChild(bg);
		}
		else
		{
			var rect = c.createRect('rect', bb.x / s, bb.y / s, bb.width / s, bb.height / s);
			rect.appendChild(c.createTransparentFill());
			rect.stroked = 'false';
			c.root.appendChild(rect);
		}
	}

	if (this.stencil != null)
	{
		this.stencil.drawShape(c, this, x, y, w, h);
	}
	else
	{
		// Stencils have separate strokewidth
		c.setStrokeWidth(this.strokewidth);
		var pts = this.getWaypoints();
		
		if (pts != null)
		{
			// Paints edge shape
			if (pts.length > 1)
			{
				this.paintEdgeShape(c, pts);
			}
		}
		else
		{
			// Paints vertex shape and resets translates
			var dx = c.state.dx;
			var dy = c.state.dy;
			this.paintVertexShape(c, x, y, w, h);
			c.state.dx = dx;
			c.state.dy = dy;
		}
	}
	
	if (bg != null && c.state != null && c.state.transform != null)
	{
		bg.setAttribute('transform', c.state.transform);
	}
	
	// Draws highlight rectangle if no stroke was used
	if (c != null && this.outline && !strokeDrawn)
	{
		c.rect(x, y, w, h);
		c.stroke();
	}

	c.pointerEvents = pointerEvents;
};

/**
 * Function: getWaypoints
 *
 * Returns the array of non-overlapping, unscaled points.
 */
mxShape.prototype.getWaypoints = function()
{
	var pts = this.points;
	var result = null;
	
	if (pts != null)
	{
		result = [];
	
		if (pts.length > 0)
		{
			var s = this.scale;
			var t = Math.max(s, 1);
			var p0 = pts[0];
			result.push(new mxPoint(p0.x / s, p0.y / s));
			
			for (var i = 1; i < pts.length; i++)
			{
				var pe = pts[i];
				
				if (Math.abs(p0.x - pe.x) >= t ||
					Math.abs(p0.y - pe.y) >= t)
				{
					result.push(new mxPoint(pe.x / s, pe.y / s));
				}
				
				p0 = pe;
			}
		}
	}
	
	return result;
};

/**
 * Function: configureCanvas
 * 
 * Sets the state of the canvas for drawing the shape.
 */
mxShape.prototype.configureCanvas = function(c, x, y, w, h)
{
	var dash = null;
	
	if (this.style != null)
	{
		dash = this.style['dashPattern'];		
	}

	c.setAlpha(this.opacity / 100);
	c.setFillAlpha(this.fillOpacity / 100);
	c.setStrokeAlpha(this.strokeOpacity / 100);

	// Sets alpha, colors and gradients
	if (this.isShadow != null)
	{
		c.setShadow(this.isShadow, this.shadowStyle);
	}
	
	// Dash pattern
	if (this.isDashed != null)
	{
		c.setDashed(this.isDashed, (this.style != null) ? mxUtils.getValue(
			this.style, mxConstants.STYLE_FIX_DASH, false) == 1 : false);
	}

	if (dash != null)
	{
		c.setDashPattern(dash);
	}

	if (this.fill != null && this.fill != mxConstants.NONE &&
		this.gradient && this.gradient != mxConstants.NONE)
	{
		var b = this.getGradientBounds(c, x, y, w, h);
		c.setGradient(this.fill, this.gradient, b.x, b.y,
			b.width, b.height, this.gradientDirection);
	}
	else
	{
		c.setFillColor(this.fill);
		c.setFillStyle(this.fillStyle);
	}

	if (this.style != null)
	{
		if (this.style['linecap'] != null)
		{
			c.setLineCap(this.style['linecap']);
		}

		if (this.style['linejoin'] != null)
		{
			c.setLineJoin(this.style['linejoin']);
		}
	}

	c.setStrokeColor(this.stroke);
	this.configurePointerEvents(c);
};

/**
 * Function: configurePointerEvents
 * 
 * Configures the pointer events for the given canvas.
 */
mxShape.prototype.configurePointerEvents = function(c)
{
	if (this.style != null && (!mxShape.forceFilledPointerEvents ||
		(this.fill == null || this.fill == mxConstants.NONE ||
		this.opacity == 0 || this.fillOpacity == 0)) &&
		mxUtils.getValue(this.style, mxConstants.STYLE_POINTER_EVENTS, '1') == '0')
	{
		c.pointerEvents = false;
	}
};

/**
 * Function: getGradientBounds
 * 
 * Returns the bounding box for the gradient box for this shape.
 */
mxShape.prototype.getGradientBounds = function(c, x, y, w, h)
{
	return new mxRectangle(x, y, w, h);
};

/**
 * Function: updateTransform
 * 
 * Sets the scale and rotation on the given canvas.
 */
mxShape.prototype.updateTransform = function(c, x, y, w, h)
{
	// NOTE: Currently, scale is implemented in state and canvas. This will
	// move to canvas in a later version, so that the states are unscaled
	// and untranslated and do not need an update after zooming or panning.
	c.scale(this.scale);
	c.rotate(this.getShapeRotation(), this.flipH, this.flipV, x + w / 2, y + h / 2);
};

/**
 * Function: paintVertexShape
 * 
 * Paints the vertex shape.
 */
mxShape.prototype.paintVertexShape = function(c, x, y, w, h)
{
	this.paintBackground(c, x, y, w, h);
	
	if (!this.outline || this.style == null || mxUtils.getValue(
		this.style, mxConstants.STYLE_BACKGROUND_OUTLINE, 0) == 0)
	{
		c.setShadow(false);
		this.paintForeground(c, x, y, w, h);
	}
};

/**
 * Function: paintBackground
 * 
 * Hook for subclassers. This implementation is empty.
 */
mxShape.prototype.paintBackground = function(c, x, y, w, h) { };

/**
 * Function: paintForeground
 * 
 * Hook for subclassers. This implementation is empty.
 */
mxShape.prototype.paintForeground = function(c, x, y, w, h) { };

/**
 * Function: paintEdgeShape
 * 
 * Hook for subclassers. This implementation is empty.
 */
mxShape.prototype.paintEdgeShape = function(c, pts) { };

/**
 * Function: getArcSize
 * 
 * Returns the arc size for the given dimension.
 */
mxShape.prototype.getArcSize = function(w, h)
{
	var r = 0;
	
	if (mxUtils.getValue(this.style, mxConstants.STYLE_ABSOLUTE_ARCSIZE, 0) == '1')
	{
		r = Math.min(w / 2, Math.min(h / 2, mxUtils.getValue(this.style,
			mxConstants.STYLE_ARCSIZE, mxConstants.LINE_ARCSIZE) / 2));
	}
	else
	{
		var f = mxUtils.getValue(this.style, mxConstants.STYLE_ARCSIZE,
			mxConstants.RECTANGLE_ROUNDING_FACTOR * 100) / 100;
		r = Math.min(w * f, h * f);
	}
	
	return r;
};

/**
 * Function: paintGlassEffect
 * 
 * Paints the glass gradient effect.
 */
mxShape.prototype.paintGlassEffect = function(c, x, y, w, h, arc)
{
	var sw = Math.ceil(this.strokewidth / 2);
	var size = 0.4;
	
	c.setGradient('#ffffff', '#ffffff', x, y, w, h * 0.6, 'south', 0.9, 0.1);
	c.begin();
	arc += 2 * sw;
		
	if (this.isRounded)
	{
		c.moveTo(x - sw + arc, y - sw);
		c.quadTo(x - sw, y - sw, x - sw, y - sw + arc);
		c.lineTo(x - sw, y + h * size);
		c.quadTo(x + w * 0.5, y + h * 0.7, x + w + sw, y + h * size);
		c.lineTo(x + w + sw, y - sw + arc);
		c.quadTo(x + w + sw, y - sw, x + w + sw - arc, y - sw);
	}
	else
	{
		c.moveTo(x - sw, y - sw);
		c.lineTo(x - sw, y + h * size);
		c.quadTo(x + w * 0.5, y + h * 0.7, x + w + sw, y + h * size);
		c.lineTo(x + w + sw, y - sw);
	}
	
	c.close();
	c.fill();
};

/**
 * Function: addPoints
 * 
 * Paints the given points with rounded corners.
 */
mxShape.prototype.addPoints = function(c, pts, rounded, arcSize, close, exclude, initialMove)
{
	if (pts != null && pts.length > 0)
	{
		initialMove = (initialMove != null) ? initialMove : true;
		var pe = pts[pts.length - 1];
		
		// Adds virtual waypoint in the center between start and end point
		if (close && rounded)
		{
			pts = pts.slice();
			var p0 = pts[0];
			var wp = new mxPoint(pe.x + (p0.x - pe.x) / 2, pe.y + (p0.y - pe.y) / 2);
			pts.splice(0, 0, wp);
		}
	
		var pt = pts[0];
		var i = 1;
	
		// Draws the line segments
		if (initialMove)
		{
			c.moveTo(pt.x, pt.y);
		}
		else
		{
			c.lineTo(pt.x, pt.y);
		}
		
		while (i < ((close) ? pts.length : pts.length - 1))
		{
			var tmp = pts[mxUtils.mod(i, pts.length)];
			var dx = pt.x - tmp.x;
			var dy = pt.y - tmp.y;
	
			if (rounded && (dx != 0 || dy != 0) && (exclude == null || mxUtils.indexOf(exclude, i - 1) < 0))
			{
				// Draws a line from the last point to the current
				// point with a spacing of size off the current point
				// into direction of the last point
				var dist = Math.sqrt(dx * dx + dy * dy);
				var nx1 = dx * Math.min(arcSize, dist / 2) / dist;
				var ny1 = dy * Math.min(arcSize, dist / 2) / dist;
	
				var x1 = tmp.x + nx1;
				var y1 = tmp.y + ny1;
				c.lineTo(x1, y1);
	
				// Draws a curve from the last point to the current
				// point with a spacing of size off the current point
				// into direction of the next point
				var next = pts[mxUtils.mod(i + 1, pts.length)];
				
				// Uses next non-overlapping point
				while (i < pts.length - 2 && Math.round(next.x - tmp.x) == 0 && Math.round(next.y - tmp.y) == 0)
				{
					next = pts[mxUtils.mod(i + 2, pts.length)];
					i++;
				}
				
				dx = next.x - tmp.x;
				dy = next.y - tmp.y;
	
				dist = Math.max(1, Math.sqrt(dx * dx + dy * dy));
				var nx2 = dx * Math.min(arcSize, dist / 2) / dist;
				var ny2 = dy * Math.min(arcSize, dist / 2) / dist;
	
				var x2 = tmp.x + nx2;
				var y2 = tmp.y + ny2;
	
				c.quadTo(tmp.x, tmp.y, x2, y2);
				tmp = new mxPoint(x2, y2);
			}
			else
			{
				c.lineTo(tmp.x, tmp.y);
			}
	
			pt = tmp;
			i++;
		}
	
		if (close)
		{
			c.close();
		}
		else
		{
			c.lineTo(pe.x, pe.y);
		}
	}
};

/**
 * Function: resetStyles
 * 
 * Resets all styles.
 */
mxShape.prototype.resetStyles = function()
{
	this.initStyles();
	this.spacing = 0;
	
	delete this.fill;
	delete this.gradient;
	delete this.gradientDirection;
	delete this.stroke;
	delete this.startSize;
	delete this.endSize;
	delete this.startArrow;
	delete this.endArrow;
	delete this.direction;
	delete this.isShadow;
	delete this.isDashed;
	delete this.isRounded;
	delete this.glass;
};

/**
 * Function: apply
 * 
 * Applies the style of the given <mxCellState> to the shape. This
 * implementation assigns the following styles to local fields:
 * 
 * - <mxConstants.STYLE_FILLCOLOR> => fill
 * - <mxConstants.STYLE_GRADIENTCOLOR> => gradient
 * - <mxConstants.STYLE_GRADIENT_DIRECTION> => gradientDirection
 * - <mxConstants.STYLE_OPACITY> => opacity
 * - <mxConstants.STYLE_FILL_OPACITY> => fillOpacity
 * - <mxConstants.STYLE_STROKE_OPACITY> => strokeOpacity
 * - <mxConstants.STYLE_STROKECOLOR> => stroke
 * - <mxConstants.STYLE_STROKEWIDTH> => strokewidth
 * - <mxConstants.STYLE_SHADOW> => isShadow
 * - <mxConstants.STYLE_DASHED> => isDashed
 * - <mxConstants.STYLE_SPACING> => spacing
 * - <mxConstants.STYLE_STARTSIZE> => startSize
 * - <mxConstants.STYLE_ENDSIZE> => endSize
 * - <mxConstants.STYLE_ROUNDED> => isRounded
 * - <mxConstants.STYLE_STARTARROW> => startArrow
 * - <mxConstants.STYLE_ENDARROW> => endArrow
 * - <mxConstants.STYLE_ROTATION> => rotation
 * - <mxConstants.STYLE_DIRECTION> => direction
 * - <mxConstants.STYLE_GLASS> => glass
 *
 * This keeps a reference to the <style>. If you need to keep a reference to
 * the cell, you can override this method and store a local reference to
 * state.cell or the <mxCellState> itself. If <outline> should be true, make
 * sure to set it before calling this method.
 *
 * Parameters:
 *
 * state - <mxCellState> of the corresponding cell.
 */
mxShape.prototype.apply = function(state)
{
	this.state = state;
	this.style = state.style;

	if (this.style != null)
	{
		this.fill = mxUtils.getValue(this.style, mxConstants.STYLE_FILLCOLOR, this.fill);
		this.gradient = mxUtils.getValue(this.style, mxConstants.STYLE_GRADIENTCOLOR, this.gradient);
		this.gradientDirection = mxUtils.getValue(this.style, mxConstants.STYLE_GRADIENT_DIRECTION, this.gradientDirection);
		this.opacity = mxUtils.getValue(this.style, mxConstants.STYLE_OPACITY, this.opacity);
		this.fillOpacity = mxUtils.getValue(this.style, mxConstants.STYLE_FILL_OPACITY, this.fillOpacity);
		this.fillStyle = mxUtils.getValue(this.style,  mxConstants.STYLE_FILL_STYLE, this.fillStyle);
		this.strokeOpacity = mxUtils.getValue(this.style, mxConstants.STYLE_STROKE_OPACITY, this.strokeOpacity);
		this.stroke = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, this.stroke);
		this.strokewidth = mxUtils.getNumber(this.style, mxConstants.STYLE_STROKEWIDTH, this.strokewidth);
		this.spacing = mxUtils.getValue(this.style, mxConstants.STYLE_SPACING, this.spacing);
		this.startSize = mxUtils.getNumber(this.style, mxConstants.STYLE_STARTSIZE, this.startSize);
		this.endSize = mxUtils.getNumber(this.style, mxConstants.STYLE_ENDSIZE, this.endSize);
		this.startArrow = mxUtils.getValue(this.style, mxConstants.STYLE_STARTARROW, this.startArrow);
		this.endArrow = mxUtils.getValue(this.style, mxConstants.STYLE_ENDARROW, this.endArrow);
		this.rotation = mxUtils.getValue(this.style, mxConstants.STYLE_ROTATION, this.rotation);
		this.direction = mxUtils.getValue(this.style, mxConstants.STYLE_DIRECTION, this.direction);
		this.flipH = mxUtils.getValue(this.style, mxConstants.STYLE_FLIPH, 0) == 1;
		this.flipV = mxUtils.getValue(this.style, mxConstants.STYLE_FLIPV, 0) == 1;	
		
		// Legacy support for stencilFlipH/V
		if (this.stencil != null)
		{
			this.flipH = mxUtils.getValue(this.style, 'stencilFlipH', 0) == 1 || this.flipH;
			this.flipV = mxUtils.getValue(this.style, 'stencilFlipV', 0) == 1 || this.flipV;
		}
		
		if (this.direction == mxConstants.DIRECTION_NORTH || this.direction == mxConstants.DIRECTION_SOUTH)
		{
			var tmp = this.flipH;
			this.flipH = this.flipV;
			this.flipV = tmp;
		}

		this.isShadow = mxUtils.getValue(this.style, mxConstants.STYLE_SHADOW, this.isShadow) == 1;
		this.isDashed = mxUtils.getValue(this.style, mxConstants.STYLE_DASHED, this.isDashed) == 1;
		this.isRounded = mxUtils.getValue(this.style, mxConstants.STYLE_ROUNDED, this.isRounded) == 1;
		this.glass = mxUtils.getValue(this.style, mxConstants.STYLE_GLASS, this.glass) == 1;

		if (this.fill == mxConstants.NONE)
		{
			this.fill = null;
		}

		if (this.gradient == mxConstants.NONE)
		{
			this.gradient = null;
		}

		if (this.stroke == mxConstants.NONE)
		{
			this.stroke = null;
		}
	}
};

/**
 * Function: setCursor
 * 
 * Sets the cursor on the given shape.
 *
 * Parameters:
 *
 * cursor - The cursor to be used.
 */
mxShape.prototype.setCursor = function(cursor)
{
	if (cursor == null)
	{
		cursor = '';
	}
	
	this.cursor = cursor;

	if (this.node != null)
	{
		this.node.style.cursor = cursor;
	}
};

/**
 * Function: getCursor
 * 
 * Returns the current cursor.
 */
mxShape.prototype.getCursor = function()
{
	return this.cursor;
};

/**
 * Function: isRoundable
 * 
 * Hook for subclassers.
 */
mxShape.prototype.isRoundable = function()
{
	return false;
};

/**
 * Function: getSvgBoundingBox
 *
 * Returns the SVG bounding box.
 */
mxShape.prototype.getSvgBoundingBox = function()
{
	var result = null;

	if (this.node != null && this.node.ownerSVGElement != null)
	{
		try
		{
			var b = this.node.getBBox();
	
			if (b.width > 0 && b.height > 0)
			{
				result = new mxRectangle(b.x, b.y, b.width, b.height);
				
				// Adds stroke width
				if (this.stroke != null)
				{
					result.grow(this.strokewidth * this.scale / 2);
				}
			}
		}
		catch(e)
		{
			// fallback to shape bbox
		}
	}

	return result;
};

/**
 * Function: getShapeBoundingBox
 *
 * Returns the shape bounding box.
 */
mxShape.prototype.getShapeBoundingBox = function()
{
	var bbox = null;

	if (this.bounds != null)
	{
		bbox = this.createBoundingBox();
		
		if (bbox != null)
		{
			this.augmentBoundingBox(bbox);
			var rot = this.getShapeRotation();
			
			if (rot != 0)
			{
				bbox = mxUtils.getBoundingBox(bbox, rot);
			}
		}
	}

	return bbox;
};

/**
 * Function: createBoundingBox
 *
 * Returns a new rectangle that represents the bounding box of the bare shape
 * with no shadows or strokewidths.
 */
mxShape.prototype.createBoundingBox = function()
{
	var bb = this.bounds.clone();

	if ((this.stencil != null && (this.direction == mxConstants.DIRECTION_NORTH ||
		this.direction == mxConstants.DIRECTION_SOUTH)) || this.isPaintBoundsInverted())
	{
		bb.rotate90();
	}
	
	return bb;
};

/**
 * Function: augmentBoundingBox
 *
 * Augments the bounding box with the strokewidth and shadow offsets.
 */
mxShape.prototype.augmentBoundingBox = function(bbox)
{
	if (this.isShadow)
	{
		var ss = this.getShadowStyle();

		if (ss.dx < 0)
		{
			bbox.x += ss.dx;
			bbox.width -= ss.dx;
		}

		if (ss.dy < 0)
		{
			bbox.y += ss.dy;
			bbox.height -= ss.dy;
		}

		bbox.grow(Math.max(ss.blur, 0) * this.scale * 2);
		bbox.width += Math.ceil(Math.max(ss.dx, 0) * this.scale);
		bbox.height += Math.ceil(Math.max(ss.dy, 0) * this.scale);
	}
	
	// Adds stroke width
	if (this.stroke != null)
	{
		bbox.grow(this.strokewidth * this.scale / 2);
	}
};

/**
 * Function: updateBoundingBox
 *
 * Updates the <boundingBox> for this shape using <createBoundingBox> and
 * <augmentBoundingBox> and stores the result in <boundingBox>.
 */
mxShape.prototype.updateBoundingBox = function()
{
	var bbox = (this.useSvgBoundingBox) ? this.getSvgBoundingBox() : null;

	if (bbox == null)
	{
		bbox = this.getShapeBoundingBox();
	}

	this.boundingBox = bbox;
};

/**
 * Function: isPaintBoundsInverted
 * 
 * Returns true if the bounds should be inverted.
 */
mxShape.prototype.isPaintBoundsInverted = function()
{
	// Stencil implements inversion via aspect
	return this.stencil == null && (this.direction == mxConstants.DIRECTION_NORTH ||
			this.direction == mxConstants.DIRECTION_SOUTH);
};

/**
 * Function: getRotation
 * 
 * Returns the rotation from the style.
 */
mxShape.prototype.getRotation = function()
{
	return (this.rotation != null) ? this.rotation : 0;
};

/**
 * Function: getTextRotation
 * 
 * Returns the rotation for the text label.
 */
mxShape.prototype.getTextRotation = function()
{
	var rot = this.getRotation();
	
	if (mxUtils.getValue(this.style, mxConstants.STYLE_HORIZONTAL, 1) != 1)
	{
		rot += mxText.prototype.verticalTextRotation;
	}
	
	return rot;
};

/**
 * Function: getShapeRotation
 * 
 * Returns the actual rotation of the shape.
 */
mxShape.prototype.getShapeRotation = function()
{
	var rot = this.getRotation();
	
	if (this.direction != null)
	{
		if (this.direction == mxConstants.DIRECTION_NORTH)
		{
			rot += 270;
		}
		else if (this.direction == mxConstants.DIRECTION_WEST)
		{
			rot += 180;
		}
		else if (this.direction == mxConstants.DIRECTION_SOUTH)
		{
			rot += 90;
		}
	}
	
	return rot;
};

/**
 * Function: createTransparentSvgRectangle
 * 
 * Adds a transparent rectangle that catches all events.
 */
mxShape.prototype.createTransparentSvgRectangle = function(x, y, w, h)
{
	var rect = document.createElementNS(mxConstants.NS_SVG, 'rect');
	rect.setAttribute('x', x);
	rect.setAttribute('y', y);
	rect.setAttribute('width', w);
	rect.setAttribute('height', h);
	rect.setAttribute('fill', 'none');
	rect.setAttribute('stroke', 'none');
	rect.setAttribute('pointer-events', 'all');
	
	return rect;
};

/**
 * Function: setTransparentBackgroundImage
 * 
 * Sets a transparent background CSS style to catch all events.
 * 
 * Paints the line shape.
 */
mxShape.prototype.setTransparentBackgroundImage = function(node)
{
	node.style.backgroundImage = 'url(\'' + mxClient.imageBasePath + '/transparent.gif\')';
};

/**
 * Function: intersectsRectangle
 * 
 * Returns true if the shape intersects the given rectangle.
 */
mxShape.prototype.intersectsRectangle = function(rect, ignoreNode)
{
	return rect != null && (ignoreNode || (this.node != null && this.node.style.display != 'none' &&
		this.node.style.visibility != 'hidden')) && mxUtils.intersects(this.bounds, rect, true);
};

/**
 * Function: releaseSvgGradients
 * 
 * Paints the line shape.
 */
mxShape.prototype.releaseSvgGradients = function(grads)
{
	if (grads != null)
	{
		for (var key in grads)
		{
			var gradient = grads[key];
			
			if (gradient != null)
			{
				gradient.mxRefCount = (gradient.mxRefCount || 0) - 1;
				
				if (gradient.mxRefCount == 0 && gradient.parentNode != null)
				{
					gradient.parentNode.removeChild(gradient);
				}
			}
		}
	}
};

/**
 * Function: releaseSvgFillPatterns
 * 
 * Release not needed Svg Patterns.
 */
mxShape.prototype.releaseSvgFillPatterns = function(patterns)
{
	if (patterns != null)
	{
		for (var key in patterns)
		{
			var pattern = patterns[key];
			
			if (pattern != null)
			{
				pattern.mxRefCount = (pattern.mxRefCount || 0) - 1;
				
				if (pattern.mxRefCount == 0 && pattern.parentNode != null)
				{
					pattern.parentNode.removeChild(pattern);
				}
			}
		}
	}
};

/**
 * Function: destroy
 *
 * Destroys the shape by removing it from the DOM and releasing the DOM
 * node associated with the shape using <mxEvent.release>.
 */
mxShape.prototype.destroy = function()
{
	if (this.node != null)
	{
		mxEvent.release(this.node);
		
		if (this.node.parentNode != null)
		{
			this.node.parentNode.removeChild(this.node);
		}
		
		this.node = null;
	}
	
	// Decrements refCount and removes unused
	this.releaseSvgGradients(this.oldGradients);
	this.releaseSvgFillPatterns(this.oldFillPatterns);
	this.oldGradients = null;
	this.oldFillPatterns = null;
};
