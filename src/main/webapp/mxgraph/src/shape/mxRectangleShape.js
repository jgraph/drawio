/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
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
 * Function: paintForeground
 * 
 * Generic background painting implementation.
 */
mxRectangleShape.prototype.paintForeground = function(c, x, y, w, h)
{
	if (this.glass && !this.outline && this.fill != null && this.fill != mxConstants.NONE)
	{
		this.paintGlassEffect(c, x, y, w, h, this.getArcSize(w + this.strokewidth, h + this.strokewidth));
	}
};
