/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: mxConnector
 * 
 * Extends <mxShape> to implement a connector shape. The connector
 * shape allows for arrow heads on either side.
 * 
 * This shape is registered under <mxConstants.SHAPE_CONNECTOR> in
 * <mxCellRenderer>.
 * 
 * Constructor: mxConnector
 * 
 * Constructs a new connector shape.
 * 
 * Parameters:
 * 
 * points - Array of <mxPoints> that define the points. This is stored in
 * <mxShape.points>.
 * stroke - String that defines the stroke color. This is stored in <stroke>.
 * Default is 'black'.
 * strokewidth - Optional integer that defines the stroke width. Default is
 * 1. This is stored in <strokewidth>.
 */
function mxConnector(points, stroke, strokewidth)
{
	mxPolyline.call(this, points, stroke, strokewidth);
};

/**
 * Extends mxPolyline.
 */
mxUtils.extend(mxConnector, mxPolyline);

/**
 * Function: updateBoundingBox
 *
 * Updates the <boundingBox> for this shape using <createBoundingBox> and
 * <augmentBoundingBox> and stores the result in <boundingBox>.
 */
mxConnector.prototype.updateBoundingBox = function()
{
	this.useSvgBoundingBox = this.style != null && this.style[mxConstants.STYLE_CURVED] == 1;
	mxShape.prototype.updateBoundingBox.apply(this, arguments);
};

/**
 * Function: paintEdgeShape
 * 
 * Paints the line shape.
 */
mxConnector.prototype.paintEdgeShape = function(c, pts)
{
	// The indirection via functions for markers is needed in
	// order to apply the offsets before painting the line and
	// paint the markers after painting the line.
	var sourceMarker = this.createMarker(c, pts, true);
	var targetMarker = this.createMarker(c, pts, false);
	mxPolyline.prototype.paintEdgeShape.apply(this, arguments);

	// Disables shadows, dashed styles and fixes fill color for markers
	c.setShadow(false);
	c.setDashed(false);
	
	if (sourceMarker != null)
	{
		c.setFillColor(mxUtils.getValue(this.style,
			mxConstants.STYLE_STARTFILLCOLOR, this.stroke));
		sourceMarker();
	}
	
	if (targetMarker != null)
	{
		c.setFillColor(mxUtils.getValue(this.style,
			mxConstants.STYLE_ENDFILLCOLOR, this.stroke));
		targetMarker();
	}
};

/**
 * Function: createMarker
 * 
 * Prepares the marker by adding offsets in pts and returning a function to
 * paint the marker.
 */
mxConnector.prototype.createMarker = function(c, pts, source)
{
	var result = null;
	var n = pts.length;
	var type = mxUtils.getValue(this.style, (source) ?
		mxConstants.STYLE_STARTARROW : mxConstants.STYLE_ENDARROW);
	var p0 = (source) ? pts[1] : pts[n - 2];
	var pe = (source) ? pts[0] : pts[n - 1];

	if (type != null && p0 != null && pe != null)
	{
		// Computes the norm and the inverse norm
		var dx = pe.x - p0.x;
		var dy = pe.y - p0.y;
		var dist = Math.sqrt(dx * dx + dy * dy);
		
		var unitX = dx / dist;
		var unitY = dy / dist;
		
		var size = mxUtils.getNumber(this.style, (source) ? mxConstants.STYLE_STARTSIZE :
			mxConstants.STYLE_ENDSIZE, mxConstants.DEFAULT_MARKERSIZE);
		
		// Allow for stroke width in the end point used and the 
		// orthogonal vectors describing the direction of the marker
		var filled = this.style[(source) ? mxConstants.STYLE_STARTFILL :
			mxConstants.STYLE_ENDFILL] != 0;
		
		result = mxMarker.createMarker(c, this, type, pe, unitX, unitY,
			size, source, this.strokewidth, filled);
	}
	
	return result;
};

/**
 * Function: augmentBoundingBox
 *
 * Augments the bounding box with the strokewidth and shadow offsets.
 */
mxConnector.prototype.augmentBoundingBox = function(bbox)
{
	mxShape.prototype.augmentBoundingBox.apply(this, arguments);
	
	// Adds marker sizes
	var size = 0;
	
	if (mxUtils.getValue(this.style, mxConstants.STYLE_STARTARROW, mxConstants.NONE) != mxConstants.NONE)
	{
		size = mxUtils.getNumber(this.style, mxConstants.STYLE_STARTSIZE, mxConstants.DEFAULT_MARKERSIZE) + 1;
	}
	
	if (mxUtils.getValue(this.style, mxConstants.STYLE_ENDARROW, mxConstants.NONE) != mxConstants.NONE)
	{
		size = Math.max(size, mxUtils.getNumber(this.style, mxConstants.STYLE_ENDSIZE, mxConstants.DEFAULT_MARKERSIZE)) + 1;
	}
	
	bbox.grow(size * this.scale);
};
