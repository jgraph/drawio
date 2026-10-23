/**
 * Copyright (c) 2006-2015, JGraph Holdings Ltd
 * Copyright (c) 2006-2015, draw.io AG
 */
/**
 * Class: mxRectangleShape
 *
 * Extends <mxShape> to implement a rectangle shape.
 * This shape is registered under <mxConstants.SHAPE_RECTANGLE>
 * in <mxCellRenderer>.
 * 
 * Constructor: mxRectangleShape
 *
 * Constructs a new rectangle shape.
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
function mxRectangleShape(bounds, fill, stroke, strokewidth)
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
mxUtils.extend(mxRectangleShape, mxShape);

/**
 * Function: isHtmlAllowed
 *
 * Returns true for non-rounded, non-rotated shapes with no glass gradient.
 */
mxRectangleShape.prototype.isHtmlAllowed = function()
{
	var events = true;
	
	if (this.style != null)
	{
		events = mxUtils.getValue(this.style, mxConstants.STYLE_POINTER_EVENTS, '1') == '1';		
	}
	
	return !this.isRounded && !this.glass && this.rotation == 0 && (events ||
		(this.fill != null && this.fill != mxConstants.NONE));
};

/**
 * Function: paintBackground
 * 
 * Generic background painting implementation.
 */
mxRectangleShape.prototype.paintBackground = function(c, x, y, w, h)
{
	if (this.isRounded)
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
		
		c.roundrect(x, y, w, h, r, r);
	}
	else
	{
		c.rect(x, y, w, h);
	}
		
	c.fillAndStroke();
};

/**
 * Function: isRoundable
 * 
 * Adds roundable support.
 */
mxRectangleShape.prototype.isRoundable = function()
{
	return true;
};

/**
 * Function: isGlassable
 *
 * Adds glass support.
 */
mxRectangleShape.prototype.isGlassable = function()
{
	return true;
};

/**
 * Function: getFooterSize
 *
 * Returns the size of the footer, the filled and bordered region painted at
 * the bottom of the rectangle. Default is 0 (no footer).
 */
mxRectangleShape.prototype.getFooterSize = function()
{
	return Math.max(0, mxUtils.getValue(this.style,
		mxConstants.STYLE_FOOTER_SIZE, 0));
};

/**
 * Function: getLabelBounds
 *
 * Excludes the footer region from the label bounds.
 */
mxRectangleShape.prototype.getLabelBounds = function(rect)
{
	var footer = this.getFooterSize() * this.scale;

	if (footer > 0)
	{
		rect = new mxRectangle(rect.x, rect.y, rect.width,
			rect.height - Math.min(rect.height, footer));
	}

	return rect;
};

/**
 * Function: paintForeground
 *
 * Generic background painting implementation.
 */
mxRectangleShape.prototype.paintForeground = function(c, x, y, w, h)
{
	var footer = Math.min(h, this.getFooterSize());

	if (footer > 0 && !this.outline)
	{
		this.paintFooter(c, x, y, w, h, footer);
	}

	if (this.glass && !this.outline && this.fill != null && this.fill != mxConstants.NONE)
	{
		this.paintGlassEffect(c, x, y, w, h, this.getArcSize(w + this.strokewidth, h + this.strokewidth));
	}
};

/**
 * Function: paintFooter
 *
 * Paints the footer, a filled region at the bottom of the rectangle. The
 * footer follows the rounded corners of the rectangle when rounded, tracing
 * the border exactly even when the footer is shorter than the arc radius.
 * The path is filled and stroked with <mxConstants.STYLE_FOOTER_COLOR>
 * (default is the stroke color), so the footer paints over the bottom
 * border and reaches the outer edge of the shape.
 */
mxRectangleShape.prototype.paintFooter = function(c, x, y, w, h, footer)
{
	var color = mxUtils.getValue(this.style,
		mxConstants.STYLE_FOOTER_COLOR, this.stroke);
	var r = (this.isRounded) ? this.getArcSize(w, h) : 0;
	var rr = Math.min(w / 2, r);

	if (color != null && color != mxConstants.NONE)
	{
		c.setFillColor(color);
		c.setStrokeColor(color);
	}

	c.setShadow(false);
	c.begin();

	if (footer >= r)
	{
		// Footer clears the corners: straight sides plus the full rounding
		c.moveTo(x, y + h - footer);
		c.lineTo(x, y + h - r);
		c.quadTo(x, y + h, x + rr, y + h);
		c.lineTo(x + w - rr, y + h);
		c.quadTo(x + w, y + h, x + w, y + h - r);
		c.lineTo(x + w, y + h - footer);
	}
	else
	{
		// Footer falls inside the corners: trace the border (radius r)
		// from where its quadratic crosses y = h - footer (split at t)
		var t = 1 - Math.sqrt(footer / r);
		var px = rr * t * t;
		var bx = rr * t;
		c.moveTo(x + px, y + h - footer);
		c.quadTo(x + bx, y + h, x + rr, y + h);
		c.lineTo(x + w - rr, y + h);
		c.quadTo(x + w - bx, y + h, x + w - px, y + h - footer);
	}

	c.close();

	if (color != null && color != mxConstants.NONE)
	{
		c.fillAndStroke();
	}
	else
	{
		c.stroke();
	}
};
