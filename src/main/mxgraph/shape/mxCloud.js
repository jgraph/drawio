/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: mxCloud
 *
 * Extends <mxActor> to implement a cloud shape.
 * 
 * This shape is registered under <mxConstants.SHAPE_CLOUD> in
 * <mxCellRenderer>.
 * 
 * Constructor: mxCloud
 *
 * Constructs a new cloud shape.
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
function mxCloud(bounds, fill, stroke, strokewidth)
{
	mxActor.call(this);
	this.bounds = bounds;
	this.fill = fill;
	this.stroke = stroke;
	this.strokewidth = (strokewidth != null) ? strokewidth : 1;
};

/**
 * Extends mxActor.
 */
mxUtils.extend(mxCloud, mxActor);

/**
 * Function: redrawPath
 *
 * Draws the path for this shape.
 */
mxCloud.prototype.redrawPath = function(c, x, y, w, h)
{
	c.moveTo(0.25 * w, 0.25 * h);
	c.curveTo(0.05 * w, 0.25 * h, 0, 0.5 * h, 0.16 * w, 0.55 * h);
	c.curveTo(0, 0.66 * h, 0.18 * w, 0.9 * h, 0.31 * w, 0.8 * h);
	c.curveTo(0.4 * w, h, 0.7 * w, h, 0.8 * w, 0.8 * h);
	c.curveTo(w, 0.8 * h, w, 0.6 * h, 0.875 * w, 0.5 * h);
	c.curveTo(w, 0.3 * h, 0.8 * w, 0.1 * h, 0.625 * w, 0.2 * h);
	c.curveTo(0.5 * w, 0.05 * h, 0.3 * w, 0.05 * h, 0.25 * w, 0.25 * h);
	c.close();
};
