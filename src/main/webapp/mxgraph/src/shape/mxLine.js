/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: mxLine
 *
 * Extends <mxShape> to implement a horizontal line shape.
 * This shape is registered under <mxConstants.SHAPE_LINE> in
 * <mxCellRenderer>.
 * 
 * Constructor: mxLine
 *
 * Constructs a new line shape.
 * 
 * Parameters:
 * 
 * bounds - <mxRectangle> that defines the bounds. This is stored in
 * <mxShape.bounds>.
 * stroke - String that defines the stroke color. Default is 'black'. This is
 * stored in <stroke>.
 * strokewidth - Optional integer that defines the stroke width. Default is
 * 1. This is stored in <strokewidth>.
 */
function mxLine(bounds, stroke, strokewidth, vertical)
{
	mxShape.call(this);
	this.bounds = bounds;
	this.stroke = stroke;
	this.strokewidth = (strokewidth != null) ? strokewidth : 1;
	this.vertical = (vertical != null) ? vertical : this.vertical;
};

/**
 * Extends mxShape.
 */
mxUtils.extend(mxLine, mxShape);

/**
 * Function: vertical
 * 
 * Whether to paint a vertical line.
 */
mxLine.prototype.vertical = false;

/**
 * Function: paintVertexShape
 * 
 * Redirects to redrawPath for subclasses to work.
 */
mxLine.prototype.paintVertexShape = function(c, x, y, w, h)
{
	c.begin();

	if (this.vertical)
	{
		var mid = x + w / 2;
		c.moveTo(mid, y);
		c.lineTo(mid, y + h);
	}
	else
	{
		var mid = y + h / 2;
		c.moveTo(x, mid);
		c.lineTo(x + w, mid);
	}

	c.stroke();
};
