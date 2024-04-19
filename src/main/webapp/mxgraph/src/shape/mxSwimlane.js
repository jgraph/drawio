/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: mxSwimlane
 *
 * Extends <mxShape> to implement a swimlane shape. This shape is registered
 * under <mxConstants.SHAPE_SWIMLANE> in <mxCellRenderer>. Use the
 * <mxConstants.STYLE_STYLE_STARTSIZE> to define the size of the title
 * region, <mxConstants.STYLE_SWIMLANE_FILLCOLOR> for the content area fill,
 * <mxConstants.STYLE_SEPARATORCOLOR> to draw an additional vertical separator
 * and <mxConstants.STYLE_SWIMLANE_LINE> to hide the line between the title
 * region and the content area. The <mxConstants.STYLE_HORIZONTAL> affects
 * the orientation of this shape, not only its label.
 * 
 * Constructor: mxSwimlane
 *
 * Constructs a new swimlane shape.
 * 
 * Parameters:
 * 
 * bounds - <mxRectangle> that defines the bounds. This is stored in
 * <mxShape.bounds>.
 * fill - String that defines the fill color. This is stored in <fill>.
 * stroke - String that defines the stroke color. This is stored in <stroke>.
 * strokewidth - Optional integer that defines the stroke width. Default is
 * 1. This is stored in <strokewidth>.
 */
function mxSwimlane(bounds, fill, stroke, strokewidth)
{
	mxShape.call(this);
	this.bounds = bounds;
	this.fill = fill;
	this.stroke = stroke;
	this.strokewidth = (strokewidth != null) ? strokewidth : 1;
};

/**
 * Extends mxShape.
 */
mxUtils.extend(mxSwimlane, mxShape);

/**
 * Variable: imageSize
 *
 * Default imagewidth and imageheight if an image but no imagewidth
 * and imageheight are defined in the style. Value is 16.
 */
mxSwimlane.prototype.imageSize = 16;

/**
 * Function: apply
 * 
 * Extends mxShape to update the swimlane styles.
 *
 * Parameters:
 *
 * state - <mxCellState> of the corresponding cell.
 */
 mxSwimlane.prototype.apply = function(state)
{
	var old = this.spacing;
	mxShape.prototype.apply.apply(this, arguments);
	
	if (this.style != null)
	{
		this.laneFill = mxUtils.getValue(this.style,
			mxConstants.STYLE_SWIMLANE_FILLCOLOR,
			mxConstants.NONE);
	}
};

/**
 * Function: isRoundable
 * 
 * Adds roundable support.
 */
mxSwimlane.prototype.isRoundable = function()
{
	return true;
};

/**
 * Function: getTitleSize
 * 
 * Returns the title size.
 */
mxSwimlane.prototype.getTitleSize = function()
{
	return Math.max(0, mxUtils.getValue(this.style,
		mxConstants.STYLE_STARTSIZE,
		mxConstants.DEFAULT_STARTSIZE));
};

/**
 * Function: getLabelBounds
 * 
 * Returns the bounding box for the label.
 */
mxSwimlane.prototype.getLabelBounds = function(rect)
{
	var flipH = mxUtils.getValue(this.style, mxConstants.STYLE_FLIPH, 0) == 1;
	var flipV = mxUtils.getValue(this.style, mxConstants.STYLE_FLIPV, 0) == 1;
	var bounds = new mxRectangle(rect.x, rect.y, rect.width, rect.height);	
	var horizontal = this.isHorizontal();
	var start = this.getTitleSize();
	
	// East is default
	var shapeVertical = (this.direction == mxConstants.DIRECTION_NORTH ||
			this.direction == mxConstants.DIRECTION_SOUTH);
	var realHorizontal = horizontal == !shapeVertical;
	var realFlipH = !realHorizontal && flipH !=
		(this.direction == mxConstants.DIRECTION_SOUTH ||
		this.direction == mxConstants.DIRECTION_WEST);
	var realFlipV = realHorizontal && flipV !=
		(this.direction == mxConstants.DIRECTION_SOUTH ||
		this.direction == mxConstants.DIRECTION_WEST);

	// Shape is horizontal
	if (!shapeVertical)
	{
		var tmp = Math.min(bounds.height, start * this.scale);

		if (realFlipH || realFlipV)
		{
			bounds.y += bounds.height - tmp;
		}

		bounds.height = tmp;
	}
	else
	{
		var tmp = Math.min(bounds.width, start * this.scale);
		
		if (realFlipH || realFlipV)
		{
			bounds.x += bounds.width - tmp;	
		}

		bounds.width = tmp;
	}
	
	return bounds;
};

/**
 * Function: getGradientBounds
 * 
 * Returns the bounding box for the gradient box for this shape.
 */
mxSwimlane.prototype.getGradientBounds = function(c, x, y, w, h)
{
	var start = this.getTitleSize();
	
	if (this.isHorizontal())
	{
		return new mxRectangle(x, y, w, Math.min(start, h));
	}
	else
	{
		return new mxRectangle(x, y, Math.min(start, w), h);
	}
};

/**
 * Function: getSwimlaneArcSize
 * 
 * Returns the arcsize for the swimlane.
 */
mxSwimlane.prototype.getSwimlaneArcSize = function(w, h, start)
{
	if (mxUtils.getValue(this.style, mxConstants.STYLE_ABSOLUTE_ARCSIZE, 0) == '1')
	{
		return Math.min(w / 2, Math.min(h / 2, mxUtils.getValue(this.style,
			mxConstants.STYLE_ARCSIZE, mxConstants.LINE_ARCSIZE) / 2));
	}
	else
	{
		var f = mxUtils.getValue(this.style, mxConstants.STYLE_ARCSIZE,
			mxConstants.RECTANGLE_ROUNDING_FACTOR * 100) / 100;

		return start * f * 3; 
	}
};

/**
 * Function: isHorizontal
 *
 * Paints the swimlane vertex shape.
 */
mxSwimlane.prototype.isHorizontal = function()
{
	return mxUtils.getValue(this.style, mxConstants.STYLE_HORIZONTAL, 1) == 1;
};

/**
 * Function: paintVertexShape
 *
 * Paints the swimlane vertex shape.
 */
mxSwimlane.prototype.paintVertexShape = function(c, x, y, w, h)
{
	if (!this.outline)
	{
		var start = this.getTitleSize();
		var r = 0;
		
		if (this.isHorizontal())
		{
			start = Math.min(start, h);
		}
		else
		{
			start = Math.min(start, w);
		}
		
		c.translate(x, y);
		
		if (!this.isRounded)
		{
			this.paintSwimlane(c, x, y, w, h, start);
		}
		else
		{
			r = this.getSwimlaneArcSize(w, h, start);
			r = Math.min(((this.isHorizontal()) ? h : w) - start, Math.min(start, r));
			this.paintRoundedSwimlane(c, x, y, w, h, start, r);
		}
		
		var sep = mxUtils.getValue(this.style, mxConstants.STYLE_SEPARATORCOLOR, mxConstants.NONE);
		this.paintSeparator(c, x, y, w, h, start, sep);

		if (this.image != null)
		{
			var bounds = this.getImageBounds(x, y, w, h);
			var clipPath = mxUtils.getValue(this.style, mxConstants.STYLE_CLIP_PATH, null);
			c.image(bounds.x - x, bounds.y - y, bounds.width, bounds.height,
					this.image, false, false, false, clipPath);
		}
		
		if (this.glass)
		{
			c.setShadow(false);
			this.paintGlassEffect(c, 0, 0, w, start, r);
		}
	}
};

/**
 * Function: configurePointerEvents
 *
 * Paints the swimlane vertex shape.
 */
mxSwimlane.prototype.configurePointerEvents = function(c)
{
	var events = true;
	var head = true;
	var body = true;
	
	if (this.style != null)
	{
		events = mxUtils.getValue(this.style, mxConstants.STYLE_POINTER_EVENTS, '1') == '1';
		head = mxUtils.getValue(this.style, mxConstants.STYLE_SWIMLANE_HEAD, 1) == 1;
		body = mxUtils.getValue(this.style, mxConstants.STYLE_SWIMLANE_BODY, 1) == 1;
	}
	if (events || head || body)
	{
		mxShape.prototype.configurePointerEvents.apply(this, arguments);
	}
};

/**
 * Function: paintSwimlane
 *
 * Paints the swimlane vertex shape.
 */
mxSwimlane.prototype.paintSwimlane = function(c, x, y, w, h, start)
{
	var fill = this.laneFill;
	var events = true;
	var line = true;
	var head = true;
	var body = true;
	
	if (this.style != null)
	{
		events = mxUtils.getValue(this.style, mxConstants.STYLE_POINTER_EVENTS, '1') == '1';
		line = mxUtils.getValue(this.style, mxConstants.STYLE_SWIMLANE_LINE, 1) == 1;
		head = mxUtils.getValue(this.style, mxConstants.STYLE_SWIMLANE_HEAD, 1) == 1;
		body = mxUtils.getValue(this.style, mxConstants.STYLE_SWIMLANE_BODY, 1) == 1;
	}

	if (this.isHorizontal())
	{
		c.begin();
		c.moveTo(0, start);
		c.lineTo(0, 0);
		c.lineTo(w, 0);
		c.lineTo(w, start);

		if (head)
		{
			c.fillAndStroke();
		}
		else
		{
			c.fill();
		}

		if (start < h)
		{
			if (fill == mxConstants.NONE || !events)
			{
				c.pointerEvents = false;
			}
			
			if (fill != mxConstants.NONE)
			{
				c.setFillColor(fill);
			}
			
			c.begin();
			c.moveTo(0, start);
			c.lineTo(0, h);
			c.lineTo(w, h);
			c.lineTo(w, start);

			if (body)
			{
				if (fill == mxConstants.NONE)
				{
					c.stroke();
				}
				else if (body)
				{
					c.fillAndStroke();
				}
			}
			else if (fill != mxConstants.NONE)
			{
				c.fill();
			}
		}
	}
	else
	{
		c.begin();
		c.moveTo(start, 0);
		c.lineTo(0, 0);
		c.lineTo(0, h);
		c.lineTo(start, h);

		if (head)
		{
			c.fillAndStroke();
		}
		else
		{
			c.fill();
		}

		if (start < w)
		{
			if (fill == mxConstants.NONE || !events)
			{
				c.pointerEvents = false;
			}
			
			if (fill != mxConstants.NONE)
			{
				c.setFillColor(fill);
			}
			
			c.begin();
			c.moveTo(start, 0);
			c.lineTo(w, 0);
			c.lineTo(w, h);
			c.lineTo(start, h);
			
			if (body)
			{
				if (fill == mxConstants.NONE)
				{
					c.stroke();
				}
				else if (body)
				{
					c.fillAndStroke();
				}
			}
			else if (fill != mxConstants.NONE)
			{
				c.fill();
			}
		}
	}
	
	if (line)
	{
		this.paintDivider(c, x, y, w, h, start, fill == mxConstants.NONE);
	}
};

/**
 * Function: paintRoundedSwimlane
 *
 * Paints the swimlane vertex shape.
 */
mxSwimlane.prototype.paintRoundedSwimlane = function(c, x, y, w, h, start, r)
{
	var fill = this.laneFill;
	var events = true;
	var line = true;
	var head = true;
	var body = true;
	
	if (this.style != null)
	{
		events = mxUtils.getValue(this.style, mxConstants.STYLE_POINTER_EVENTS, '1') == '1';
		line = mxUtils.getValue(this.style, mxConstants.STYLE_SWIMLANE_LINE, 1) == 1;
		head = mxUtils.getValue(this.style, mxConstants.STYLE_SWIMLANE_HEAD, 1) == 1;
		body = mxUtils.getValue(this.style, mxConstants.STYLE_SWIMLANE_BODY, 1) == 1;
	}

	if (this.isHorizontal())
	{
		c.begin();
		c.moveTo(w, start);
		c.lineTo(w, r);
		c.quadTo(w, 0, w - Math.min(w / 2, r), 0);
		c.lineTo(Math.min(w / 2, r), 0);
		c.quadTo(0, 0, 0, r);
		c.lineTo(0, start);

		if (head)
		{
			c.fillAndStroke();
		}
		else
		{
			c.fill();
		}

		if (start < h)
		{
			if (fill == mxConstants.NONE || !events)
			{
				c.pointerEvents = false;
			}
			
			if (fill != mxConstants.NONE)
			{
				c.setFillColor(fill);
			}
			
			c.begin();
			c.moveTo(0, start);
			c.lineTo(0, h - r);
			c.quadTo(0, h, Math.min(w / 2, r), h);
			c.lineTo(w - Math.min(w / 2, r), h);
			c.quadTo(w, h, w, h - r);
			c.lineTo(w, start);
			
			if (body)
			{
				if (fill == mxConstants.NONE)
				{
					c.stroke();
				}
				else if (body)
				{
					c.fillAndStroke();
				}
			}
			else if (fill != mxConstants.NONE)
			{
				c.fill();
			}
		}
	}
	else
	{
		c.begin();
		c.moveTo(start, 0);
		c.lineTo(r, 0);
		c.quadTo(0, 0, 0, Math.min(h / 2, r));
		c.lineTo(0, h - Math.min(h / 2, r));
		c.quadTo(0, h, r, h);
		c.lineTo(start, h);

		if (head)
		{
			c.fillAndStroke();
		}
		else
		{
			c.fill();
		}

		if (start < w)
		{
			if (fill == mxConstants.NONE || !events)
			{
				c.pointerEvents = false;
			}
			
			if (fill != mxConstants.NONE)
			{
				c.setFillColor(fill);
			}
			
			c.begin();
			c.moveTo(start, h);
			c.lineTo(w - r, h);
			c.quadTo(w, h, w, h - Math.min(h / 2, r));
			c.lineTo(w, Math.min(h / 2, r));
			c.quadTo(w, 0, w - r, 0);
			c.lineTo(start, 0);

			if (body)
			{
				if (fill == mxConstants.NONE)
				{
					c.stroke();
				}
				else if (body)
				{
					c.fillAndStroke();
				}
			}
			else if (fill != mxConstants.NONE)
			{
				c.fill();
			}
		}
	}

	if (line)
	{
		this.paintDivider(c, x, y, w, h, start, fill == mxConstants.NONE);
	}
};

/**
 * Function: paintDivider
 *
 * Paints the divider between swimlane title and content area.
 */
mxSwimlane.prototype.paintDivider = function(c, x, y, w, h, start, shadow)
{
	if (start != 0)
	{
		if (!shadow)
		{
			c.setShadow(false);
		}

		c.begin();
		
		if (this.isHorizontal())
		{
			c.moveTo(0, start);
			c.lineTo(w, start);
		}
		else
		{
			c.moveTo(start, 0);
			c.lineTo(start, h);
		}

		c.stroke();
	}
};

/**
 * Function: paintSeparator
 *
 * Paints the vertical or horizontal separator line between swimlanes.
 */
mxSwimlane.prototype.paintSeparator = function(c, x, y, w, h, start, color)
{
	if (color != mxConstants.NONE)
	{
		c.setStrokeColor(color);
		c.setDashed(true);
		c.begin();
		
		if (this.isHorizontal())
		{
			c.moveTo(w, start);
			c.lineTo(w, h);
		}
		else
		{
			c.moveTo(start, 0);
			c.lineTo(w, 0);
		}
		
		c.stroke();
		c.setDashed(false);
	}
};

/**
 * Function: getImageBounds
 *
 * Paints the swimlane vertex shape.
 */
mxSwimlane.prototype.getImageBounds = function(x, y, w, h)
{
	if (this.isHorizontal())
	{
		return new mxRectangle(x + w - this.imageSize, y, this.imageSize, this.imageSize);
	}
	else
	{
		return new mxRectangle(x, y, this.imageSize, this.imageSize);
	}
};
