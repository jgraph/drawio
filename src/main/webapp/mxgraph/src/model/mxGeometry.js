/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: mxGeometry
 * 
 * Extends <mxRectangle> to represent the geometry of a cell.
 * 
 * For vertices, the geometry consists of the x- and y-location, and the width
 * and height. For edges, the geometry consists of the optional terminal- and
 * control points. The terminal points are only required if an edge is
 * unconnected, and are stored in the <sourcePoint> and <targetPoint>
 * variables, respectively.
 * 
 * Example:
 * 
 * If an edge is unconnected, that is, it has no source or target terminal,
 * then a geometry with terminal points for a new edge can be defined as
 * follows.
 * 
 * (code)
 * geometry.setTerminalPoint(new mxPoint(x1, y1), true);
 * geometry.points = [new mxPoint(x2, y2)];
 * geometry.setTerminalPoint(new mxPoint(x3, y3), false);
 * (end)
 * 
 * Control points are used regardless of the connected state of an edge and may
 * be ignored or interpreted differently depending on the edge's <mxEdgeStyle>.
 * 
 * To disable automatic reset of control points after a cell has been moved or
 * resized, the the <mxGraph.resizeEdgesOnMove> and
 * <mxGraph.resetEdgesOnResize> may be used.
 *
 * Edge Labels:
 * 
 * Using the x- and y-coordinates of a cell's geometry, it is possible to
 * position the label on edges on a specific location on the actual edge shape
 * as it appears on the screen. The x-coordinate of an edge's geometry is used
 * to describe the distance from the center of the edge from -1 to 1 with 0
 * being the center of the edge and the default value. The y-coordinate of an
 * edge's geometry is used to describe the absolute, orthogonal distance in
 * pixels from that point. In addition, the <mxGeometry.offset> is used as an
 * absolute offset vector from the resulting point.
 * 
 * This coordinate system is applied if <relative> is true, otherwise the
 * offset defines the absolute vector from the edge's center point to the
 * label and the values for <x> and <y> are ignored.
 * 
 * The width and height parameter for edge geometries can be used to set the
 * label width and height (eg. for word wrapping).
 * 
 * Ports:
 * 
 * The term "port" refers to a relatively positioned, connectable child cell,
 * which is used to specify the connection between the parent and another cell
 * in the graph. Ports are typically modeled as vertices with relative
 * geometries.
 * 
 * Offsets:
 * 
 * The <offset> field is interpreted in 3 different ways, depending on the cell
 * and the geometry. For edges, the offset defines the absolute offset for the
 * edge label. For relative geometries, the offset defines the absolute offset
 * for the origin (top, left corner) of the vertex, otherwise the offset
 * defines the absolute offset for the label inside the vertex or group.
 * 
 * Constructor: mxGeometry
 *
 * Constructs a new object to describe the size and location of a vertex or
 * the control points of an edge.
 */
function mxGeometry(x, y, width, height)
{
	mxRectangle.call(this, x, y, width, height);
};

/**
 * Extends mxRectangle.
 */
mxGeometry.prototype = new mxRectangle();
mxGeometry.prototype.constructor = mxGeometry;

/**
 * Variable: TRANSLATE_CONTROL_POINTS
 * 
 * Global switch to translate the points in translate. Default is true.
 */
mxGeometry.prototype.TRANSLATE_CONTROL_POINTS = true;

/**
 * Variable: alternateBounds
 *
 * Stores alternate values for x, y, width and height in a rectangle. See
 * <swap> to exchange the values. Default is null.
 */
mxGeometry.prototype.alternateBounds = null;

/**
 * Variable: sourcePoint
 *
 * Defines the source <mxPoint> of the edge. This is used if the
 * corresponding edge does not have a source vertex. Otherwise it is
 * ignored. Default is  null.
 */
mxGeometry.prototype.sourcePoint = null;

/**
 * Variable: targetPoint
 *
 * Defines the target <mxPoint> of the edge. This is used if the
 * corresponding edge does not have a target vertex. Otherwise it is
 * ignored. Default is null.
 */
mxGeometry.prototype.targetPoint = null;

/**
 * Variable: points
 *
 * Array of <mxPoints> which specifies the control points along the edge.
 * These points are the intermediate points on the edge, for the endpoints
 * use <targetPoint> and <sourcePoint> or set the terminals of the edge to
 * a non-null value. Default is null.
 */
mxGeometry.prototype.points = null;

/**
 * Variable: offset
 *
 * For edges, this holds the offset (in pixels) from the position defined
 * by <x> and <y> on the edge. For relative geometries (for vertices), this
 * defines the absolute offset from the point defined by the relative
 * coordinates. For absolute geometries (for vertices), this defines the
 * offset for the label. Default is null.
 */
mxGeometry.prototype.offset = null;

/**
 * Variable: relative
 *
 * Specifies if the coordinates in the geometry are to be interpreted as
 * relative coordinates. For edges, this is used to define the location of
 * the edge label relative to the edge as rendered on the display. For
 * vertices, this specifies the relative location inside the bounds of the
 * parent cell.
 * 
 * If this is false, then the coordinates are relative to the origin of the
 * parent cell or, for edges, the edge label position is relative to the
 * center of the edge as rendered on screen.
 * 
 * Default is false.
 */
mxGeometry.prototype.relative = false;

/**
 * Function: swap
 * 
 * Swaps the x, y, width and height with the values stored in
 * <alternateBounds> and puts the previous values into <alternateBounds> as
 * a rectangle. This operation is carried-out in-place, that is, using the
 * existing geometry instance. If this operation is called during a graph
 * model transactional change, then the geometry should be cloned before
 * calling this method and setting the geometry of the cell using
 * <mxGraphModel.setGeometry>.
 */
mxGeometry.prototype.swap = function()
{
	if (this.alternateBounds != null)
	{
		var old = new mxRectangle(
			this.x, this.y, this.width, this.height);

		this.x = this.alternateBounds.x;
		this.y = this.alternateBounds.y;
		this.width = this.alternateBounds.width;
		this.height = this.alternateBounds.height;

		this.alternateBounds = old;
	}
};

/**
 * Function: getTerminalPoint
 * 
 * Returns the <mxPoint> representing the source or target point of this
 * edge. This is only used if the edge has no source or target vertex.
 * 
 * Parameters:
 * 
 * isSource - Boolean that specifies if the source or target point
 * should be returned.
 */
mxGeometry.prototype.getTerminalPoint = function(isSource)
{
	return (isSource) ? this.sourcePoint : this.targetPoint;
};

/**
 * Function: setTerminalPoint
 * 
 * Sets the <sourcePoint> or <targetPoint> to the given <mxPoint> and
 * returns the new point.
 * 
 * Parameters:
 * 
 * point - Point to be used as the new source or target point.
 * isSource - Boolean that specifies if the source or target point
 * should be set.
 */
mxGeometry.prototype.setTerminalPoint = function(point, isSource)
{
	if (isSource)
	{
		this.sourcePoint = point;
	}
	else
	{
		this.targetPoint = point;
	}
	
	return point;
};

/**
 * Function: rotate
 * 
 * Rotates the geometry by the given angle around the given center. That is,
 * <x> and <y> of the geometry, the <sourcePoint>, <targetPoint> and all
 * <points> are translated by the given amount. <x> and <y> are only
 * translated if <relative> is false.
 * 
 * Parameters:
 * 
 * angle - Number that specifies the rotation angle in degrees.
 * cx - <mxPoint> that specifies the center of the rotation.
 */
mxGeometry.prototype.rotate = function(angle, cx)
{
	var rad = mxUtils.toRadians(angle);
	var cos = Math.cos(rad);
	var sin = Math.sin(rad);
	
	// Rotates the geometry
	if (!this.relative)
	{
		var ct = new mxPoint(this.getCenterX(), this.getCenterY());
		var pt = mxUtils.getRotatedPoint(ct, cos, sin, cx);
		
		this.x = Math.round(pt.x - this.width / 2);
		this.y = Math.round(pt.y - this.height / 2);
	}

	// Rotates the source point
	if (this.sourcePoint != null)
	{
		var pt = mxUtils.getRotatedPoint(this.sourcePoint, cos, sin, cx);
		this.sourcePoint.x = Math.round(pt.x);
		this.sourcePoint.y = Math.round(pt.y);
	}
	
	// Translates the target point
	if (this.targetPoint != null)
	{
		var pt = mxUtils.getRotatedPoint(this.targetPoint, cos, sin, cx);
		this.targetPoint.x = Math.round(pt.x);
		this.targetPoint.y = Math.round(pt.y);	
	}
	
	// Translate the control points
	if (this.points != null)
	{
		for (var i = 0; i < this.points.length; i++)
		{
			if (this.points[i] != null)
			{
				var pt = mxUtils.getRotatedPoint(this.points[i], cos, sin, cx);
				this.points[i].x = Math.round(pt.x);
				this.points[i].y = Math.round(pt.y);
			}
		}
	}
};

/**
 * Function: translate
 * 
 * Translates the geometry by the specified amount. That is, <x> and <y> of the
 * geometry, the <sourcePoint>, <targetPoint> and all <points> are translated
 * by the given amount. <x> and <y> are only translated if <relative> is false.
 * If <TRANSLATE_CONTROL_POINTS> is false, then <points> are not modified by
 * this function.
 * 
 * Parameters:
 * 
 * dx - Number that specifies the x-coordinate of the translation.
 * dy - Number that specifies the y-coordinate of the translation.
 * ignorePosition - Specifies if the position should be ignored.
 */
mxGeometry.prototype.translate = function(dx, dy, ignorePosition)
{
	dx = parseFloat(dx);
	dy = parseFloat(dy);
	
	// Translates the geometry
	if (!this.relative && !ignorePosition)
	{
		this.x = parseFloat(this.x) + dx;
		this.y = parseFloat(this.y) + dy;
	}

	// Translates the source point
	if (this.sourcePoint != null)
	{
		this.sourcePoint.x = parseFloat(this.sourcePoint.x) + dx;
		this.sourcePoint.y = parseFloat(this.sourcePoint.y) + dy;
	}
	
	// Translates the target point
	if (this.targetPoint != null)
	{
		this.targetPoint.x = parseFloat(this.targetPoint.x) + dx;
		this.targetPoint.y = parseFloat(this.targetPoint.y) + dy;		
	}

	// Translate the control points
	if (this.TRANSLATE_CONTROL_POINTS && this.points != null)
	{
		for (var i = 0; i < this.points.length; i++)
		{
			if (this.points[i] != null)
			{
				this.points[i].x = parseFloat(this.points[i].x) + dx;
				this.points[i].y = parseFloat(this.points[i].y) + dy;
			}
		}
	}
};

/**
 * Function: scale
 * 
 * Scales the geometry by the given amount. That is, <x> and <y> of the
 * geometry, the <sourcePoint>, <targetPoint> and all <points> are scaled
 * by the given amount. <x>, <y>, <width> and <height> are only scaled if
 * <relative> is false. If <fixedAspect> is true, then the smaller value
 * is used to scale the width and the height.
 * 
 * Parameters:
 * 
 * sx - Number that specifies the horizontal scale factor.
 * sy - Number that specifies the vertical scale factor.
 * fixedAspect - Optional boolean to keep the aspect ratio fixed.
 */
mxGeometry.prototype.scale = function(sx, sy, fixedAspect)
{
	sx = parseFloat(sx);
	sy = parseFloat(sy);

	// Translates the source point
	if (this.sourcePoint != null)
	{
		this.sourcePoint.x = parseFloat(this.sourcePoint.x) * sx;
		this.sourcePoint.y = parseFloat(this.sourcePoint.y) * sy;
	}
	
	// Translates the target point
	if (this.targetPoint != null)
	{
		this.targetPoint.x = parseFloat(this.targetPoint.x) * sx;
		this.targetPoint.y = parseFloat(this.targetPoint.y) * sy;		
	}

	// Translate the control points
	if (this.points != null)
	{
		for (var i = 0; i < this.points.length; i++)
		{
			if (this.points[i] != null)
			{
				this.points[i].x = parseFloat(this.points[i].x) * sx;
				this.points[i].y = parseFloat(this.points[i].y) * sy;
			}
		}
	}
	
	// Translates the geometry
	if (!this.relative)
	{
		this.x = parseFloat(this.x) * sx;
		this.y = parseFloat(this.y) * sy;

		if (fixedAspect)
		{
			sy = sx = Math.min(sx, sy);
		}
		
		this.width = parseFloat(this.width) * sx;
		this.height = parseFloat(this.height) * sy;
	}
};

/**
 * Function: equals
 * 
 * Returns true if the given object equals this geometry.
 */
mxGeometry.prototype.equals = function(obj)
{
	return mxRectangle.prototype.equals.apply(this, arguments) &&
		this.relative == obj.relative &&
		((this.sourcePoint == null && obj.sourcePoint == null) || (this.sourcePoint != null && this.sourcePoint.equals(obj.sourcePoint))) &&
		((this.targetPoint == null && obj.targetPoint == null) || (this.targetPoint != null && this.targetPoint.equals(obj.targetPoint))) &&
		((this.points == null && obj.points == null) || (this.points != null && mxUtils.equalPoints(this.points, obj.points))) &&
		((this.alternateBounds == null && obj.alternateBounds == null) || (this.alternateBounds != null && this.alternateBounds.equals(obj.alternateBounds))) &&
		((this.offset == null && obj.offset == null) || (this.offset != null && this.offset.equals(obj.offset)));
};
