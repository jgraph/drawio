/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
function mxEdgeSegmentHandler(state)
{
	mxEdgeHandler.call(this, state);
};

/**
 * Extends mxEdgeHandler.
 */
mxUtils.extend(mxEdgeSegmentHandler, mxElbowEdgeHandler);

/**
 * Function: getCurrentPoints
 * 
 * Returns the current absolute points.
 */
mxEdgeSegmentHandler.prototype.getCurrentPoints = function()
{
	var pts = this.state.absolutePoints;
	
	if (pts != null)
	{
		// Special case for straight edges where we add a virtual middle handle for moving the edge
		var tol = Math.max(1, this.graph.view.scale);
		
		if (pts.length == 2 || (pts.length == 3 &&
			(Math.abs(pts[0].x - pts[1].x) < tol && Math.abs(pts[1].x - pts[2].x) < tol ||
			Math.abs(pts[0].y - pts[1].y) < tol && Math.abs(pts[1].y - pts[2].y) < tol)))
		{
			var cx = pts[0].x + (pts[pts.length - 1].x - pts[0].x) / 2;
			var cy = pts[0].y + (pts[pts.length - 1].y - pts[0].y) / 2;
			
			pts = [pts[0], new mxPoint(cx, cy), new mxPoint(cx, cy), pts[pts.length - 1]];	
		}
	}

	return pts;
};

/**
 * Function: getPreviewPoints
 * 
 * Updates the given preview state taking into account the state of the constraint handler.
 */
mxEdgeSegmentHandler.prototype.getPreviewPoints = function(point)
{
	if (this.isSource || this.isTarget)
	{
		return mxElbowEdgeHandler.prototype.getPreviewPoints.apply(this, arguments);
	}
	else
	{
		var pts = this.getCurrentPoints();
		var last = this.convertPoint(pts[0].clone(), false);
		point = this.convertPoint(point.clone(), false);
		var result = [];

		for (var i = 1; i < pts.length; i++)
		{
			var pt = this.convertPoint(pts[i].clone(), false);
			
			if (i == this.index)
			{
				if (Math.round(last.x - pt.x) == 0)
		 		{
					last.x = point.x;
					pt.x = point.x;
		 		}
		 		
				if (Math.round(last.y - pt.y) == 0)
		 		{
		 			last.y = point.y;
		 			pt.y = point.y;
		 		}
			}

			if (i < pts.length - 1)
			{
				result.push(pt);
			}

			last = pt;
		}
		
		// Replaces single point that intersects with source or target
		if (result.length == 1)
		{
			var source = this.state.getVisibleTerminalState(true);
			var target = this.state.getVisibleTerminalState(false);
			var scale = this.state.view.getScale();
			var tr = this.state.view.getTranslate();
			
			var x = result[0].x * scale + tr.x;
			var y = result[0].y * scale + tr.y;
			
			if ((source != null && mxUtils.contains(source, x, y)) ||
				(target != null && mxUtils.contains(target, x, y)))
			{
				result = [point, point];
			}
		}

		return result;
	}
};

/**
 * Function: updatePreviewState
 * 
 * Overridden to perform optimization of the edge style result.
 */
mxEdgeSegmentHandler.prototype.updatePreviewState = function(edge, point, terminalState, me)
{
	mxEdgeHandler.prototype.updatePreviewState.apply(this, arguments);

	// Checks and corrects preview by running edge style again
	if (!this.isSource && !this.isTarget)
	{
		point = this.convertPoint(point.clone(), false);
		var pts = edge.absolutePoints;
		var pt0 = pts[0];
		var pt1 = pts[1];

		var result = [];
		
		for (var i = 2; i < pts.length; i++)
		{
			var pt2 = pts[i];
		
			// Merges adjacent segments only if more than 2 to allow for straight edges
			if ((Math.round(pt0.x - pt1.x) != 0 || Math.round(pt1.x - pt2.x) != 0) &&
				(Math.round(pt0.y - pt1.y) != 0 || Math.round(pt1.y - pt2.y) != 0))
			{
				result.push(this.convertPoint(pt1.clone(), false));
			}

			pt0 = pt1;
			pt1 = pt2;
		}
		
		var source = this.state.getVisibleTerminalState(true);
		var target = this.state.getVisibleTerminalState(false);
		var rpts = this.state.absolutePoints;
		
		// A straight line is represented by 3 handles
		if (result.length == 0 && (Math.round(pts[0].x - pts[pts.length - 1].x) == 0 ||
			Math.round(pts[0].y - pts[pts.length - 1].y) == 0))
		{
			result = [point, point];
		}
		// Handles special case of transitions from straight vertical to routed
		else if (pts.length == 5 && result.length == 2 && source != null && target != null &&
				rpts != null && Math.round(rpts[0].x - rpts[rpts.length - 1].x) == 0)
		{
			var view = this.graph.getView();
			var scale = view.getScale();
			var tr = view.getTranslate();
			
			var y0 = view.getRoutingCenterY(source) / scale - tr.y;
			
			// Use fixed connection point y-coordinate if one exists
			var sc = this.graph.getConnectionConstraint(edge, source, true);
			
			if (sc != null)
			{
				var pt = this.graph.getConnectionPoint(source, sc);
				
				if (pt != null)
				{
					this.convertPoint(pt, false);
					y0 = pt.y;
				}
			}
			
			var ye = view.getRoutingCenterY(target) / scale - tr.y;
			
			// Use fixed connection point y-coordinate if one exists
			var tc = this.graph.getConnectionConstraint(edge, target, false);
			
			if (tc)
			{
				var pt = this.graph.getConnectionPoint(target, tc);
				
				if (pt != null)
				{
					this.convertPoint(pt, false);
					ye = pt.y;
				}
			}
			
			result = [new mxPoint(point.x, y0), new mxPoint(point.x, ye)];
		}

		this.points = result;

		// LATER: Check if points and result are different
		edge.view.updateFixedTerminalPoints(edge, source, target);
		edge.view.updatePoints(edge, this.points, source, target);
		edge.view.updateFloatingTerminalPoints(edge, source, target);
	}
};

/**
 * Overriden to merge edge segments.
 */
mxEdgeSegmentHandler.prototype.connect = function(edge, terminal, isSource, isClone, me)
{
	var model = this.graph.getModel();
	var geo = model.getGeometry(edge);
	var result = null;
	
	// Merges adjacent edge segments
	if (geo != null && geo.points != null && geo.points.length > 0)
	{
		var pts = this.abspoints;
		var pt0 = pts[0];
		var pt1 = pts[1];
		result = [];
		
		for (var i = 2; i < pts.length; i++)
		{
			var pt2 = pts[i];
		
			// Merges adjacent segments only if more than 2 to allow for straight edges
			if ((Math.round(pt0.x - pt1.x) != 0 || Math.round(pt1.x - pt2.x) != 0) &&
				(Math.round(pt0.y - pt1.y) != 0 || Math.round(pt1.y - pt2.y) != 0))
			{
				result.push(this.convertPoint(pt1.clone(), false));
			}
	
			pt0 = pt1;
			pt1 = pt2;
		}
	}
	
	model.beginUpdate();
	try
	{
		if (result != null)
		{
			var geo = model.getGeometry(edge);
			
			if (geo != null)
			{
				geo = geo.clone();
				geo.points = result;
				
				model.setGeometry(edge, geo);
			}
		}
		
		edge = mxEdgeHandler.prototype.connect.apply(this, arguments);
	}
	finally
	{
		model.endUpdate();
	}
	
	return edge;
};

/**
 * Function: getTooltipForNode
 * 
 * Returns no tooltips.
 */
mxEdgeSegmentHandler.prototype.getTooltipForNode = function(node)
{
	return null;
};

/**
 * Function: start
 * 
 * Starts the handling of the mouse gesture.
 */
mxEdgeSegmentHandler.prototype.start = function(x, y, index)
{
	mxEdgeHandler.prototype.start.apply(this, arguments);
	
	if (this.bends != null && this.bends[index] != null &&
		!this.isSource && !this.isTarget)
	{
		mxUtils.setOpacity(this.bends[index].node, 100);
	}
};

/**
 * Function: createBends
 * 
 * Adds custom bends for the center of each segment.
 */
mxEdgeSegmentHandler.prototype.createBends = function()
{
	var bends = [];
	var pts = this.getCurrentPoints();

	if (pts != null)
	{
		// Source
		var bend = this.createHandleShape(0);
		this.initBend(bend);
		bend.setCursor(mxConstants.CURSOR_TERMINAL_HANDLE);
		bends.push(bend);

		// Waypoints (segment handles)
		if (this.graph.isCellBendable(this.state.cell))
		{
			if (this.points == null)
			{
				this.points = [];
			}

			for (var i = 0; i < pts.length - 1; i++)
			{
				bend = this.createVirtualBend();
				bends.push(bend);
				var horizontal = Math.round(pts[i].x - pts[i + 1].x) == 0;
				
				// Special case where dy is 0 as well
				if (Math.round(pts[i].y - pts[i + 1].y) == 0 && i < pts.length - 2)
				{
					horizontal = Math.round(pts[i].x - pts[i + 2].x) == 0;
				}
				
				bend.setCursor((horizontal) ? 'col-resize' : 'row-resize');
				this.points.push(new mxPoint(0,0));
			}
		}

		// Target
		var bend = this.createHandleShape(pts.length, null, true);
		this.initBend(bend);
		bend.setCursor(mxConstants.CURSOR_TERMINAL_HANDLE);
		bends.push(bend);
	}

	return bends;
};

/**
 * Function: createVirtualBends
 * 
 * Returns null.
 */
mxEdgeSegmentHandler.prototype.createVirtualBends = function()
{
	return null;
};

/**
 * Function: redrawInnerBends
 * 
 * Updates the position of the custom bends.
 */
mxEdgeSegmentHandler.prototype.redrawInnerBends = function(p0, pe)
{
	if (this.graph.isCellBendable(this.state.cell))
	{
		var pts = this.getCurrentPoints();
		
		if (pts != null && pts.length > 1)
		{
			var straight = false;
			
			// Puts handle in the center of straight edges
			if (pts.length == 4 && Math.round(pts[1].x - pts[2].x) == 0 && Math.round(pts[1].y - pts[2].y) == 0)
			{
				straight = true;
				
				if (Math.round(pts[0].y - pts[pts.length - 1].y) == 0)
				{
					var cx = pts[0].x + (pts[pts.length - 1].x - pts[0].x) / 2;
					pts[1] = new mxPoint(cx, pts[1].y);
					pts[2] = new mxPoint(cx, pts[2].y);
				}
				else
				{
					var cy = pts[0].y + (pts[pts.length - 1].y - pts[0].y) / 2;
					pts[1] = new mxPoint(pts[1].x, cy);
					pts[2] = new mxPoint(pts[2].x, cy);
				}
			}
			
			for (var i = 0; i < pts.length - 1; i++)
			{
				if (this.bends[i + 1] != null)
				{
		 			var p0 = pts[i];
	 				var pe = pts[i + 1];
			 		var pt = new mxPoint(p0.x + (pe.x - p0.x) / 2, p0.y + (pe.y - p0.y) / 2);
			 		var b = this.bends[i + 1].bounds;
			 		this.bends[i + 1].bounds = new mxRectangle(Math.floor(pt.x - b.width / 2),
			 				Math.floor(pt.y - b.height / 2), b.width, b.height);
				 	this.bends[i + 1].redraw();
				 	
				 	if (this.manageLabelHandle)
					{
						this.checkLabelHandle(this.bends[i + 1].bounds);
					}
				}
			}
			
			if (straight)
			{
				mxUtils.setOpacity(this.bends[1].node, this.virtualBendOpacity);
				mxUtils.setOpacity(this.bends[3].node, this.virtualBendOpacity);
			}
		}
	}
};
