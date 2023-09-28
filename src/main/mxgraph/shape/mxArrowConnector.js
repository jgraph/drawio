/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: mxArrowConnector
 *
 * Extends <mxShape> to implement an new rounded arrow shape with support for
 * waypoints and double arrows. (The shape is used to represent edges, not
 * vertices.) This shape is registered under <mxConstants.SHAPE_ARROW_CONNECTOR>
 * in <mxCellRenderer>.
 * 
 * Constructor: mxArrowConnector
 *
 * Constructs a new arrow shape.
 * 
 * Parameters:
 * 
 * points - Array of <mxPoints> that define the points. This is stored in
 * <mxShape.points>.
 * fill - String that defines the fill color. This is stored in <fill>.
 * stroke - String that defines the stroke color. This is stored in <stroke>.
 * strokewidth - Optional integer that defines the stroke width. Default is
 * 1. This is stored in <strokewidth>.
 * arrowWidth - Optional integer that defines the arrow width. Default is
 * <mxConstants.ARROW_WIDTH>. This is stored in <arrowWidth>.
 * spacing - Optional integer that defines the spacing between the arrow shape
 * and its endpoints. Default is <mxConstants.ARROW_SPACING>. This is stored in
 * <spacing>.
 * endSize - Optional integer that defines the size of the arrowhead. Default
 * is <mxConstants.ARROW_SIZE>. This is stored in <endSize>.
 */
function mxArrowConnector(points, fill, stroke, strokewidth, arrowWidth, spacing, endSize)
{
	mxShape.call(this);
	this.points = points;
	this.fill = fill;
	this.stroke = stroke;
	this.strokewidth = (strokewidth != null) ? strokewidth : 1;
	this.arrowWidth = (arrowWidth != null) ? arrowWidth : mxConstants.ARROW_WIDTH;
	this.arrowSpacing = (spacing != null) ? spacing : mxConstants.ARROW_SPACING;
	this.startSize = mxConstants.ARROW_SIZE / 5;
	this.endSize = mxConstants.ARROW_SIZE / 5;
};

/**
 * Extends mxShape.
 */
mxUtils.extend(mxArrowConnector, mxShape);

/**
 * Variable: useSvgBoundingBox
 * 
 * Allows to use the SVG bounding box in SVG. Default is false for performance
 * reasons.
 */
mxArrowConnector.prototype.useSvgBoundingBox = true;

/**
 * Function: isRoundable
 * 
 * Hook for subclassers.
 */
mxArrowConnector.prototype.isRoundable = function()
{
	return true;
};

/**
 * Variable: resetStyles
 * 
 * Overrides mxShape to reset spacing.
 */
mxArrowConnector.prototype.resetStyles = function()
{
	mxShape.prototype.resetStyles.apply(this, arguments);
	
	this.arrowSpacing = mxConstants.ARROW_SPACING;
};

/**
 * Overrides apply to get smooth transition from default start- and endsize.
 */
mxArrowConnector.prototype.apply = function(state)
{
	mxShape.prototype.apply.apply(this, arguments);

	if (this.style != null)
	{
		this.startSize = mxUtils.getNumber(this.style, mxConstants.STYLE_STARTSIZE, mxConstants.ARROW_SIZE / 5) * 3;
		this.endSize = mxUtils.getNumber(this.style, mxConstants.STYLE_ENDSIZE, mxConstants.ARROW_SIZE / 5) * 3;
	}
};

/**
 * Function: augmentBoundingBox
 *
 * Augments the bounding box with the edge width and markers.
 */
mxArrowConnector.prototype.augmentBoundingBox = function(bbox)
{
	mxShape.prototype.augmentBoundingBox.apply(this, arguments);
	
	var w = this.getEdgeWidth();
	
	if (this.isMarkerStart())
	{
		w = Math.max(w, this.getStartArrowWidth());
	}
	
	if (this.isMarkerEnd())
	{
		w = Math.max(w, this.getEndArrowWidth());
	}
	
	bbox.grow((w / 2 + this.strokewidth) * this.scale);
};

/**
 * Function: paintEdgeShape
 * 
 * Paints the line shape.
 */
mxArrowConnector.prototype.paintEdgeShape = function(c, pts)
{
	// Geometry of arrow
	var strokeWidth = this.strokewidth;
	
	if (this.outline)
	{
		strokeWidth = Math.max(1, mxUtils.getNumber(this.style, mxConstants.STYLE_STROKEWIDTH, this.strokewidth));
	}
	
	var startWidth = this.getStartArrowWidth() + strokeWidth;
	var endWidth = this.getEndArrowWidth() + strokeWidth;
	var edgeWidth = this.outline ? this.getEdgeWidth() + strokeWidth : this.getEdgeWidth();
	var openEnded = this.isOpenEnded();
	var markerStart = this.isMarkerStart();
	var markerEnd = this.isMarkerEnd();
	var spacing = (openEnded) ? 0 : this.arrowSpacing + strokeWidth / 2;
	var startSize = this.startSize + strokeWidth;
	var endSize = this.endSize + strokeWidth;
	var isRounded = this.isArrowRounded();
	
	// Base vector (between first points)
	var pe = pts[pts.length - 1];
	var dx = pts[1].x - pts[0].x;
	var dy = pts[1].y - pts[0].y;
	var dist = Math.sqrt(dx * dx + dy * dy);
	
	if (dist == 0)
	{
		return;
	}
	
	// Computes the norm and the inverse norm
	var nx = dx / dist;
	var nx2, nx1 = nx;
	var ny = dy / dist;
	var ny2, ny1 = ny;
	var orthx = edgeWidth * ny;
	var orthy = -edgeWidth * nx;
	
	// Stores the inbound function calls in reverse order in fns
	var fns = [];
	
	if (isRounded)
	{
		c.setLineJoin('round');
	}
	else if (pts.length > 2)
	{
		// Only mitre if there are waypoints
		c.setMiterLimit(1.42);
	}

	c.begin();

	var startNx = nx;
	var startNy = ny;

	if (markerStart && !openEnded)
	{
		this.paintMarker(c, pts[0].x, pts[0].y, nx, ny, startSize, startWidth, edgeWidth, spacing, true);
	}
	else
	{
		var outStartX = pts[0].x + orthx / 2 + spacing * nx;
		var outStartY = pts[0].y + orthy / 2 + spacing * ny;
		var inEndX = pts[0].x - orthx / 2 + spacing * nx;
		var inEndY = pts[0].y - orthy / 2 + spacing * ny;
		
		if (openEnded)
		{
			c.moveTo(outStartX, outStartY);
			
			fns.push(function()
			{
				c.lineTo(inEndX, inEndY);
			});
		}
		else
		{
			c.moveTo(inEndX, inEndY);
			c.lineTo(outStartX, outStartY);
		}
	}
	
	var dx1 = 0;
	var dy1 = 0;
	var dist1 = 0;

	for (var i = 0; i < pts.length - 2; i++)
	{
		// Work out in which direction the line is bending
		var pos = mxUtils.relativeCcw(pts[i].x, pts[i].y,
				pts[i + 1].x, pts[i + 1].y,
				pts[i + 2].x, pts[i + 2].y);

		dx1 = pts[i + 2].x - pts[i + 1].x;
		dy1 = pts[i + 2].y - pts[i + 1].y;

		dist1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
		
		if (dist1 != 0)
		{
			nx1 = dx1 / dist1;
			ny1 = dy1 / dist1;
			
			var tmp1 = nx * nx1 + ny * ny1;
			var tmp = Math.max(Math.sqrt((tmp1 + 1) / 2), 0.04);
			
			// Work out the normal orthogonal to the line through the control point and the edge sides intersection
			nx2 = (nx + nx1);
			ny2 = (ny + ny1);
	
			var dist2 = Math.sqrt(nx2 * nx2 + ny2 * ny2);
			
			if (dist2 != 0)
			{
				nx2 = nx2 / dist2;
				ny2 = ny2 / dist2;
				
				// Higher strokewidths require a larger minimum bend, 0.35 covers all but the most extreme cases
				var strokeWidthFactor = Math.max(tmp, Math.min(this.strokewidth / 200 + 0.04, 0.35));
				var angleFactor = (pos != 0 && isRounded) ? Math.max(0.1, strokeWidthFactor) : Math.max(tmp, 0.06);

				var outX = pts[i + 1].x + ny2 * edgeWidth / 2 / angleFactor;
				var outY = pts[i + 1].y - nx2 * edgeWidth / 2 / angleFactor;
				var inX = pts[i + 1].x - ny2 * edgeWidth / 2 / angleFactor;
				var inY = pts[i + 1].y + nx2 * edgeWidth / 2 / angleFactor;
				
				if (pos == 0 || !isRounded)
				{
					// If the two segments are aligned, or if we're not drawing curved sections between segments
					// just draw straight to the intersection point
					c.lineTo(outX, outY);
					
					(function(x, y)
					{
						fns.push(function()
						{
							c.lineTo(x, y);
						});
					})(inX, inY);
				}
				else if (pos == -1)
				{
					var c1x = inX + ny * edgeWidth;
					var c1y = inY - nx * edgeWidth;
					var c2x = inX + ny1 * edgeWidth;
					var c2y = inY - nx1 * edgeWidth;
					c.lineTo(c1x, c1y);
					c.quadTo(outX, outY, c2x, c2y);
					
					(function(x, y)
					{
						fns.push(function()
						{
							c.lineTo(x, y);
						});
					})(inX, inY);
				}
				else
				{
					c.lineTo(outX, outY);
					
					(function(x, y)
					{
						var c1x = outX - ny * edgeWidth;
						var c1y = outY + nx * edgeWidth;
						var c2x = outX - ny1 * edgeWidth;
						var c2y = outY + nx1 * edgeWidth;
						
						fns.push(function()
						{
							c.quadTo(x, y, c1x, c1y);
						});
						fns.push(function()
						{
							c.lineTo(c2x, c2y);
						});
					})(inX, inY);
				}
				
				nx = nx1;
				ny = ny1;
			}
		}
	}
	
	orthx = edgeWidth * ny1;
	orthy = - edgeWidth * nx1;

	if (markerEnd && !openEnded)
	{
		this.paintMarker(c, pe.x, pe.y, -nx, -ny, endSize, endWidth, edgeWidth, spacing, false);
	}
	else
	{
		c.lineTo(pe.x - spacing * nx1 + orthx / 2, pe.y - spacing * ny1 + orthy / 2);
		
		var inStartX = pe.x - spacing * nx1 - orthx / 2;
		var inStartY = pe.y - spacing * ny1 - orthy / 2;

		if (!openEnded)
		{
			c.lineTo(inStartX, inStartY);
		}
		else
		{
			c.moveTo(inStartX, inStartY);
			
			fns.splice(0, 0, function()
			{
				c.moveTo(inStartX, inStartY);
			});
		}
	}
	
	for (var i = fns.length - 1; i >= 0; i--)
	{
		fns[i]();
	}

	if (openEnded)
	{
		c.end();
		c.stroke();
	}
	else
	{
		c.close();
		c.fillAndStroke();
	}
	
	// Workaround for shadow on top of base arrow
	c.setShadow(false);
	
	// Need to redraw the markers without the low miter limit
	c.setMiterLimit(4);
	
	if (isRounded)
	{
		c.setLineJoin('flat');
	}

	if (pts.length > 2)
	{
		// Only to repaint markers if no waypoints
		// Need to redraw the markers without the low miter limit
		c.setMiterLimit(4);
		if (markerStart && !openEnded)
		{
			c.begin();
			this.paintMarker(c, pts[0].x, pts[0].y, startNx, startNy, startSize, startWidth, edgeWidth, spacing, true);
			c.stroke();
			c.end();
		}
		
		if (markerEnd && !openEnded)
		{
			c.begin();
			this.paintMarker(c, pe.x, pe.y, -nx, -ny, endSize, endWidth, edgeWidth, spacing, true);
			c.stroke();
			c.end();
		}
	}
};

/**
 * Function: paintMarker
 * 
 * Paints the marker.
 */
mxArrowConnector.prototype.paintMarker = function(c, ptX, ptY, nx, ny, size, arrowWidth, edgeWidth, spacing, initialMove)
{
	var widthArrowRatio = edgeWidth / arrowWidth;
	var orthx = edgeWidth * ny / 2;
	var orthy = -edgeWidth * nx / 2;

	var spaceX = (spacing + size) * nx;
	var spaceY = (spacing + size) * ny;

	if (initialMove)
	{
		c.moveTo(ptX - orthx + spaceX, ptY - orthy + spaceY);
	}
	else
	{
		c.lineTo(ptX - orthx + spaceX, ptY - orthy + spaceY);
	}

	c.lineTo(ptX - orthx / widthArrowRatio + spaceX, ptY - orthy / widthArrowRatio + spaceY);
	c.lineTo(ptX + spacing * nx, ptY + spacing * ny);
	c.lineTo(ptX + orthx / widthArrowRatio + spaceX, ptY + orthy / widthArrowRatio + spaceY);
	c.lineTo(ptX + orthx + spaceX, ptY + orthy + spaceY);
}

/**
 * Function: isArrowRounded
 * 
 * Returns wether the arrow is rounded
 */
mxArrowConnector.prototype.isArrowRounded = function()
{
	return this.isRounded;
};

/**
 * Function: getStartArrowWidth
 * 
 * Returns the width of the start arrow
 */
mxArrowConnector.prototype.getStartArrowWidth = function()
{
	return mxConstants.ARROW_WIDTH;
};

/**
 * Function: getEndArrowWidth
 * 
 * Returns the width of the end arrow
 */
mxArrowConnector.prototype.getEndArrowWidth = function()
{
	return mxConstants.ARROW_WIDTH;
};

/**
 * Function: getEdgeWidth
 * 
 * Returns the width of the body of the edge
 */
mxArrowConnector.prototype.getEdgeWidth = function()
{
	return mxConstants.ARROW_WIDTH / 3;
};

/**
 * Function: isOpenEnded
 * 
 * Returns whether the ends of the shape are drawn
 */
mxArrowConnector.prototype.isOpenEnded = function()
{
	return false;
};

/**
 * Function: isMarkerStart
 * 
 * Returns whether the start marker is drawn
 */
mxArrowConnector.prototype.isMarkerStart = function()
{
	return (mxUtils.getValue(this.style, mxConstants.STYLE_STARTARROW, mxConstants.NONE) != mxConstants.NONE);
};

/**
 * Function: isMarkerEnd
 * 
 * Returns whether the end marker is drawn
 */
mxArrowConnector.prototype.isMarkerEnd = function()
{
	return (mxUtils.getValue(this.style, mxConstants.STYLE_ENDARROW, mxConstants.NONE) != mxConstants.NONE);
};