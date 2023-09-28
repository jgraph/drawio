/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: mxRhombus
 *
 * Extends <mxShape> to implement a rhombus (aka diamond) shape.
 * This shape is registered under <mxConstants.SHAPE_RHOMBUS>
 * in <mxCellRenderer>.
 * 
 * Constructor: mxRhombus
 *
 * Constructs a new rhombus shape.
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
function mxRhombus(bounds, fill, stroke, strokewidth)
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
mxUtils.extend(mxRhombus, mxShape);

/**
 * Function: isRoundable
 * 
 * Adds roundable support.
 */
mxRhombus.prototype.isRoundable = function()
{
	return true;
};

/**
 * Function: paintVertexShape
 * 
 * Generic painting implementation.
 */
mxRhombus.prototype.paintVertexShape = function(c, x, y, w, h)
{
	var hw = w / 2;
	var hh = h / 2;
	
	var arcSize = mxUtils.getValue(this.style, mxConstants.STYLE_ARCSIZE, mxConstants.LINE_ARCSIZE) / 2;
	c.begin();
	this.addPoints(c, [new mxPoint(x + hw, y), new mxPoint(x + w, y + hh), new mxPoint(x + hw, y + h),
	     new mxPoint(x, y + hh)], this.isRounded, arcSize, true);
	c.fillAndStroke();
};
