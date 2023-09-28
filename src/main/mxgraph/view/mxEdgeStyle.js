/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
var mxEdgeStyle =
{
	/**
	 * Class: mxEdgeStyle
	 * 
	 * Provides various edge styles to be used as the values for
	 * <mxConstants.STYLE_EDGE> in a cell style.
	 *
	 * Example:
	 * 
	 * (code)
	 * var style = stylesheet.getDefaultEdgeStyle();
	 * style[mxConstants.STYLE_EDGE] = mxEdgeStyle.ElbowConnector;
	 * (end)
	 * 
	 * Sets the default edge style to <ElbowConnector>.
	 * 
	 * Custom edge style:
	 * 
	 * To write a custom edge style, a function must be added to the mxEdgeStyle
	 * object as follows:
	 * 
	 * (code)
	 * mxEdgeStyle.MyStyle = function(state, source, target, points, result)
	 * {
	 *   if (source != null && target != null)
	 *   {
	 *     var pt = new mxPoint(target.getCenterX(), source.getCenterY());
	 * 
	 *     if (mxUtils.contains(source, pt.x, pt.y))
	 *     {
	 *       pt.y = source.y + source.height;
	 *     }
	 * 
	 *     result.push(pt);
	 *   }
	 * };
	 * (end)
	 * 
	 * In the above example, a right angle is created using a point on the
	 * horizontal center of the target vertex and the vertical center of the source
	 * vertex. The code checks if that point intersects the source vertex and makes
	 * the edge straight if it does. The point is then added into the result array,
	 * which acts as the return value of the function.
	 *
	 * The new edge style should then be registered in the <mxStyleRegistry> as follows:
	 * (code)
	 * mxStyleRegistry.putValue('myEdgeStyle', mxEdgeStyle.MyStyle);
	 * (end)
	 * 
	 * The custom edge style above can now be used in a specific edge as follows:
	 * 
	 * (code)
	 * model.setStyle(edge, 'edgeStyle=myEdgeStyle');
	 * (end)
	 * 
	 * Note that the key of the <mxStyleRegistry> entry for the function should
	 * be used in string values, unless <mxGraphView.allowEval> is true, in
	 * which case you can also use mxEdgeStyle.MyStyle for the value in the
	 * cell style above.
	 * 
	 * Or it can be used for all edges in the graph as follows:
	 * 
	 * (code)
	 * var style = graph.getStylesheet().getDefaultEdgeStyle();
	 * style[mxConstants.STYLE_EDGE] = mxEdgeStyle.MyStyle;
	 * (end)
	 * 
	 * Note that the object can be used directly when programmatically setting
	 * the value, but the key in the <mxStyleRegistry> should be used when
	 * setting the value via a key, value pair in a cell style.
	 * 
	 * Function: EntityRelation
	 * 
	 * Implements an entity relation style for edges (as used in database
	 * schema diagrams). At the time the function is called, the result
	 * array contains a placeholder (null) for the first absolute point,
	 * that is, the point where the edge and source terminal are connected.
	 * The implementation of the style then adds all intermediate waypoints
	 * except for the last point, that is, the connection point between the
	 * edge and the target terminal. The first ant the last point in the
	 * result array are then replaced with mxPoints that take into account
	 * the terminal's perimeter and next point on the edge.
	 *
	 * Parameters:
	 * 
	 * state - <mxCellState> that represents the edge to be updated.
	 * source - <mxCellState> that represents the source terminal.
	 * target - <mxCellState> that represents the target terminal.
	 * points - List of relative control points.
	 * result - Array of <mxPoints> that represent the actual points of the
	 * edge.
	 */
	 EntityRelation: function(state, source, target, points, result)
	 {
		var view = state.view;
	 	var graph = view.graph;
	 	var segment = mxUtils.getValue(state.style,
	 			mxConstants.STYLE_SEGMENT,
	 			mxConstants.ENTITY_SEGMENT) * view.scale;
	 	
		var pts = state.absolutePoints;
		var p0 = pts[0];
		var pe = pts[pts.length-1];

	 	var isSourceLeft = false;
	 	
	 	if (source != null)
	 	{
 			var sourceGeometry = graph.getCellGeometry(source.cell);
	
		 	if (sourceGeometry.relative)
		 	{
		 		isSourceLeft = sourceGeometry.x <= 0.5;
		 	}
		 	else if (target != null)
		 	{
		 		isSourceLeft = ((pe != null) ? pe.x : target.x + target.width) < ((p0 != null) ? p0.x : source.x);
		 	}
	 	}

		if (p0 != null)
		{
			source = new mxCellState();
			source.x = p0.x;
			source.y = p0.y;
		}
		else if (source != null)
		{
			var constraint = mxUtils.getPortConstraints(source, state, true, mxConstants.DIRECTION_MASK_NONE);
			
			if (constraint != mxConstants.DIRECTION_MASK_NONE && constraint != mxConstants.DIRECTION_MASK_WEST +
				mxConstants.DIRECTION_MASK_EAST)
			{
				isSourceLeft = constraint == mxConstants.DIRECTION_MASK_WEST;
			}
		}
		else
		{
			return;
		}
	 	
	 	var isTargetLeft = true;
	 	
	 	if (target != null)
	 	{
		 	var targetGeometry = graph.getCellGeometry(target.cell);
	
		 	if (targetGeometry.relative)
		 	{
		 		isTargetLeft = targetGeometry.x <= 0.5;
		 	}
		 	else if (source != null)
		 	{
		 		isTargetLeft = ((p0 != null) ? p0.x : source.x + source.width) < ((pe != null) ? pe.x : target.x);
		 	}
	 	}
		
		if (pe != null)
		{
			target = new mxCellState();
			target.x = pe.x;
			target.y = pe.y;
		}
		else if (target != null)
	 	{
			var constraint = mxUtils.getPortConstraints(target, state, false, mxConstants.DIRECTION_MASK_NONE);

			if (constraint != mxConstants.DIRECTION_MASK_NONE && constraint != mxConstants.DIRECTION_MASK_WEST +
				mxConstants.DIRECTION_MASK_EAST)
			{
				isTargetLeft = constraint == mxConstants.DIRECTION_MASK_WEST;
			}
	 	}
		
		if (source != null && target != null)
		{
			var x0 = (isSourceLeft) ? source.x : source.x + source.width;
			var y0 = view.getRoutingCenterY(source);
			
			var xe = (isTargetLeft) ? target.x : target.x + target.width;
			var ye = view.getRoutingCenterY(target);
	
			var seg = segment;
	
			var dx = (isSourceLeft) ? -seg : seg;
			var dep = new mxPoint(x0 + dx, y0);
					
			dx = (isTargetLeft) ? -seg : seg;
			var arr = new mxPoint(xe + dx, ye);
			
			// Adds intermediate points if both go out on same side
			if (isSourceLeft == isTargetLeft)
			{
				var x = (isSourceLeft) ?
					Math.min(x0, xe)-segment :
					Math.max(x0, xe)+segment;
	
				result.push(new mxPoint(x, y0));
				result.push(new mxPoint(x, ye));
			}
			else if ((dep.x < arr.x) == isSourceLeft)
			{
				var midY = y0 + (ye - y0) / 2;
	
				result.push(dep);
				result.push(new mxPoint(dep.x, midY));
				result.push(new mxPoint(arr.x, midY));
				result.push(arr);
			}
			else
			{
				result.push(dep);
				result.push(arr);
			}
		}
	 },

	 /**
	 * Function: Loop
	 * 
	 * Implements a self-reference, aka. loop.
	 */
	Loop: function(state, source, target, points, result)
	{
		var pts = state.absolutePoints;
		
		var p0 = pts[0];
		var pe = pts[pts.length-1];

		if (p0 != null && pe != null)
		{
			if (points != null && points.length > 0)
			{
				for (var i = 0; i < points.length; i++)
				{
					var pt = points[i];
					pt = state.view.transformControlPoint(state, pt);
					result.push(new mxPoint(pt.x, pt.y));
				}
			}

			return;
		}
		
		if (source != null)
		{
			var view = state.view;
			var graph = view.graph;
			var pt = (points != null && points.length > 0) ? points[0] : null;

			if (pt != null)
			{
				pt = view.transformControlPoint(state, pt);
					
				if (mxUtils.contains(source, pt.x, pt.y))
				{
					pt = null;
				}
			}
			
			var x = 0;
			var dx = 0;
			var y = 0;
			var dy = 0;
			
		 	var seg = mxUtils.getValue(state.style, mxConstants.STYLE_SEGMENT,
		 		graph.gridSize) * view.scale;
			var dir = mxUtils.getValue(state.style, mxConstants.STYLE_DIRECTION,
				mxConstants.DIRECTION_WEST);
			
			if (dir == mxConstants.DIRECTION_NORTH ||
				dir == mxConstants.DIRECTION_SOUTH)
			{
				x = view.getRoutingCenterX(source);
				dx = seg;
			}
			else
			{
				y = view.getRoutingCenterY(source);
				dy = seg;
			}
			
			if (pt == null ||
				pt.x < source.x ||
				pt.x > source.x + source.width)
			{
				if (pt != null)
				{
					x = pt.x;
					dy = Math.max(Math.abs(y - pt.y), dy);
				}
				else
				{
					if (dir == mxConstants.DIRECTION_NORTH)
					{
						y = source.y - 2 * dx;
					}
					else if (dir == mxConstants.DIRECTION_SOUTH)
					{
						y = source.y + source.height + 2 * dx;
					}
					else if (dir == mxConstants.DIRECTION_EAST)
					{
						x = source.x - 2 * dy;
					}
					else
					{
						x = source.x + source.width + 2 * dy;
					}
				}
			}
			else if (pt != null)
			{
				x = view.getRoutingCenterX(source);
				dx = Math.max(Math.abs(x - pt.x), dy);
				y = pt.y;
				dy = 0;
			}
			
			result.push(new mxPoint(x - dx, y - dy));
			result.push(new mxPoint(x + dx, y + dy));
		}
	},
	
	/**
	 * Function: ElbowConnector
	 * 
	 * Uses either <SideToSide> or <TopToBottom> depending on the horizontal
	 * flag in the cell style. <SideToSide> is used if horizontal is true or
	 * unspecified. See <EntityRelation> for a description of the
	 * parameters.
	 */
	ElbowConnector: function(state, source, target, points, result)
	{
		var pt = (points != null && points.length > 0) ? points[0] : null;

		var vertical = false;
		var horizontal = false;
		
		if (source != null && target != null)
		{
			if (pt != null)
			{
				var left = Math.min(source.x, target.x);
				var right = Math.max(source.x + source.width,
					target.x + target.width);
	
				var top = Math.min(source.y, target.y);
				var bottom = Math.max(source.y + source.height,
					target.y + target.height);

				pt = state.view.transformControlPoint(state, pt);
					
				vertical = pt.y < top || pt.y > bottom;
				horizontal = pt.x < left || pt.x > right;
			}
			else
			{
				var left = Math.max(source.x, target.x);
				var right = Math.min(source.x + source.width,
					target.x + target.width);
					
				vertical = left == right;
				
				if (!vertical)
				{
					var top = Math.max(source.y, target.y);
					var bottom = Math.min(source.y + source.height,
						target.y + target.height);
						
					horizontal = top == bottom;
				}
			}
		}

		if (!horizontal && (vertical ||
			state.style[mxConstants.STYLE_ELBOW] == mxConstants.ELBOW_VERTICAL))
		{
			mxEdgeStyle.TopToBottom(state, source, target, points, result);
		}
		else
		{
			mxEdgeStyle.SideToSide(state, source, target, points, result);
		}
	},

	/**
	 * Function: SideToSide
	 * 
	 * Implements a vertical elbow edge. See <EntityRelation> for a description
	 * of the parameters.
	 */
	SideToSide: function(state, source, target, points, result)
	{
		var view = state.view;
		var pt = (points != null && points.length > 0) ? points[0] : null;
		var pts = state.absolutePoints;
		var p0 = pts[0];
		var pe = pts[pts.length-1];
		
		if (pt != null)
		{
			pt = view.transformControlPoint(state, pt);
		}
		
		if (p0 != null)
		{
			source = new mxCellState();
			source.x = p0.x;
			source.y = p0.y;
		}
		
		if (pe != null)
		{
			target = new mxCellState();
			target.x = pe.x;
			target.y = pe.y;
		}
		
		if (source != null && target != null)
		{
			var l = Math.max(source.x, target.x);
			var r = Math.min(source.x + source.width,
							 target.x + target.width);
	
			var x = (pt != null) ? pt.x : Math.round(r + (l - r) / 2);
	
			var y1 = view.getRoutingCenterY(source);
			var y2 = view.getRoutingCenterY(target);
	
			if (pt != null)
			{
				if (pt.y >= source.y && pt.y <= source.y + source.height)
				{
					y1 = pt.y;
				}
				
				if (pt.y >= target.y && pt.y <= target.y + target.height)
				{
					y2 = pt.y;
				}
			}
			
			if (!mxUtils.contains(target, x, y1) &&
				!mxUtils.contains(source, x, y1))
			{
				result.push(new mxPoint(x,  y1));
			}
	
			if (!mxUtils.contains(target, x, y2) &&
				!mxUtils.contains(source, x, y2))
			{
				result.push(new mxPoint(x, y2));
			}
	
			if (result.length == 1)
			{
				if (pt != null)
				{
					if (!mxUtils.contains(target, x, pt.y) &&
						!mxUtils.contains(source, x, pt.y))
					{
						result.push(new mxPoint(x, pt.y));
					}
				}
				else
				{	
					var t = Math.max(source.y, target.y);
					var b = Math.min(source.y + source.height,
							 target.y + target.height);
						 
					result.push(new mxPoint(x, t + (b - t) / 2));
				}
			}
		}
	},

	/**
	 * Function: TopToBottom
	 * 
	 * Implements a horizontal elbow edge. See <EntityRelation> for a
	 * description of the parameters.
	 */
	TopToBottom: function(state, source, target, points, result)
	{
		var view = state.view;
		var pt = (points != null && points.length > 0) ? points[0] : null;
		var pts = state.absolutePoints;
		var p0 = pts[0];
		var pe = pts[pts.length-1];
		
		if (pt != null)
		{
			pt = view.transformControlPoint(state, pt);
		}
		
		if (p0 != null)
		{
			source = new mxCellState();
			source.x = p0.x;
			source.y = p0.y;
		}
		
		if (pe != null)
		{
			target = new mxCellState();
			target.x = pe.x;
			target.y = pe.y;
		}

		if (source != null && target != null)
		{
			var t = Math.max(source.y, target.y);
			var b = Math.min(source.y + source.height,
							 target.y + target.height);
	
			var x = view.getRoutingCenterX(source);
			
			if (pt != null &&
				pt.x >= source.x &&
				pt.x <= source.x + source.width)
			{
				x = pt.x;
			}
			
			var y = (pt != null) ? pt.y : Math.round(b + (t - b) / 2);
			
			if (!mxUtils.contains(target, x, y) &&
				!mxUtils.contains(source, x, y))
			{
				result.push(new mxPoint(x, y));						
			}
			
			if (pt != null &&
				pt.x >= target.x &&
				pt.x <= target.x + target.width)
			{
				x = pt.x;
			}
			else
			{
				x = view.getRoutingCenterX(target);
			}
			
			if (!mxUtils.contains(target, x, y) &&
				!mxUtils.contains(source, x, y))
			{
				result.push(new mxPoint(x, y));						
			}
			
			if (result.length == 1)
			{
				if (pt != null && result.length == 1)
				{
					if (!mxUtils.contains(target, pt.x, y) &&
						!mxUtils.contains(source, pt.x, y))
					{
						result.push(new mxPoint(pt.x, y));
					}
				}
				else
				{
					var l = Math.max(source.x, target.x);
					var r = Math.min(source.x + source.width,
							 target.x + target.width);
						 
					result.push(new mxPoint(l + (r - l) / 2, y));
				}
			}
		}
	},

	/**
	 * Function: SegmentConnector
	 * 
	 * Implements an orthogonal edge style. Use <mxEdgeSegmentHandler>
	 * as an interactive handler for this style.
	 * 
	 * state - <mxCellState> that represents the edge to be updated.
	 * sourceScaled - <mxCellState> that represents the source terminal.
	 * targetScaled - <mxCellState> that represents the target terminal.
	 * controlHints - List of relative control points.
	 * result - Array of <mxPoints> that represent the actual points of the
	 * edge.
	 */
	SegmentConnector: function(state, sourceScaled, targetScaled, controlHints, result)
	{
		// Creates array of all way- and terminalpoints
		var pts = mxEdgeStyle.scalePointArray(state.absolutePoints, state.view.scale);
		var source = mxEdgeStyle.scaleCellState(sourceScaled, state.view.scale);
		var target = mxEdgeStyle.scaleCellState(targetScaled, state.view.scale);
		var tol = 1;
		
		// Adds translated unscaled points for precise collision checks
		var tempPoints = []; 

		function addPoint(pt)
		{
			tempPoints.push(pt);
		};
		
		// Whether the first segment outgoing from the source end is horizontal
		var lastPushed = (result.length > 0) ? result[0] : null;
		var horizontal = true;
		var hint = null;
		
		// Adds waypoints only if outside of tolerance
		function pushPoint(pt)
		{
			pt.x = Math.round(pt.x * state.view.scale * 10) / 10;
			pt.y = Math.round(pt.y * state.view.scale * 10) / 10;

			if (lastPushed == null || Math.abs(lastPushed.x - pt.x) >= tol || Math.abs(lastPushed.y - pt.y) >= Math.max(1, state.view.scale))
			{
				result.push(pt);
				lastPushed = pt;
			}
			
			return lastPushed;
		};

		// Adds the first point
		var pt = pts[0];
		
		if (pt == null && source != null)
		{
			pt = new mxPoint(state.view.getRoutingCenterX(source), state.view.getRoutingCenterY(source));
		}
		else if (pt != null)
		{
			pt = pt.clone();
		}
		
		var lastInx = pts.length - 1;

		// Adds the waypoints
		if (controlHints != null && controlHints.length > 0)
		{
			// Converts all hints and removes nulls
			var hints = [];
			
			for (var i = 0; i < controlHints.length; i++)
			{
				var tmp = state.view.transformControlPoint(state, controlHints[i], true);
				
				if (tmp != null)
				{
					hints.push(tmp);
				}
			}
			
			if (hints.length == 0)
			{
				return;
			}
			
			// Aligns source and target hint to fixed points
			if (pt != null && hints[0] != null)
			{
				if (Math.abs(hints[0].x - pt.x) < tol)
				{
					hints[0].x = pt.x;
				}
				
				if (Math.abs(hints[0].y - pt.y) < tol)
				{
					hints[0].y = pt.y;
				}
			}
			
			var pe = pts[lastInx];
			
			if (pe != null && hints[hints.length - 1] != null)
			{
				if (Math.abs(hints[hints.length - 1].x - pe.x) < tol)
				{
					hints[hints.length - 1].x = pe.x;
				}
				
				if (Math.abs(hints[hints.length - 1].y - pe.y) < tol)
				{
					hints[hints.length - 1].y = pe.y;
				}
			}
			
			hint = hints[0];

			var currentTerm = source;
			var currentPt = pts[0];
			var hozChan = false;
			var vertChan = false;
			var currentHint = hint;
			
			if (currentPt != null)
			{
				currentTerm = null;
			}
			
			// Check for alignment with fixed points and with channels
			// at source and target segments only
			for (var i = 0; i < 2; i++)
			{
				var fixedVertAlign = currentPt != null && currentPt.x == currentHint.x;
				var fixedHozAlign = currentPt != null && currentPt.y == currentHint.y;
				
				var inHozChan = currentTerm != null && (currentHint.y >= currentTerm.y &&
						currentHint.y <= currentTerm.y + currentTerm.height);
				var inVertChan = currentTerm != null && (currentHint.x >= currentTerm.x &&
						currentHint.x <= currentTerm.x + currentTerm.width);

				hozChan = fixedHozAlign || (currentPt == null && inHozChan);
				vertChan = fixedVertAlign || (currentPt == null && inVertChan);
				
				// If the current hint falls in both the hor and vert channels in the case
				// of a floating port, or if the hint is exactly co-incident with a 
				// fixed point, ignore the source and try to work out the orientation
				// from the target end
				if (i==0 && ((hozChan && vertChan) || (fixedVertAlign && fixedHozAlign)))
				{
				}
				else
				{
					if (currentPt != null && (!fixedHozAlign && !fixedVertAlign) && (inHozChan || inVertChan)) 
					{
						horizontal = inHozChan ? false : true;
						break;
					}
			
					if (vertChan || hozChan)
					{
						horizontal = hozChan;
						
						if (i == 1)
						{
							// Work back from target end
							horizontal = hints.length % 2 == 0 ? hozChan : vertChan;
						}
	
						break;
					}
				}
				
				currentTerm = target;
				currentPt = pts[lastInx];
				
				if (currentPt != null)
				{
					currentTerm = null;
				}
				
				currentHint = hints[hints.length - 1];
				
				if (fixedVertAlign && fixedHozAlign)
				{
					hints = hints.slice(1);
				}
			}

			if (horizontal && ((pts[0] != null && pts[0].y != hint.y) ||
				(pts[0] == null && source != null &&
				(hint.y < source.y || hint.y > source.y + source.height))))
			{
				addPoint(new mxPoint(pt.x, hint.y));
			}
			else if (!horizontal && ((pts[0] != null && pts[0].x != hint.x) ||
					(pts[0] == null && source != null &&
					(hint.x < source.x || hint.x > source.x + source.width))))
			{
				addPoint(new mxPoint(hint.x, pt.y));
			}
			
			if (horizontal)
			{
				pt.y = hint.y;
			}
			else
			{
				pt.x = hint.x;
			}
		
			for (var i = 0; i < hints.length; i++)
			{
				horizontal = !horizontal;
				hint = hints[i];
				
//				mxLog.show();
//				mxLog.debug('hint', i, hint.x, hint.y);
				
				if (horizontal)
				{
					pt.y = hint.y;
				}
				else
				{
					pt.x = hint.x;
				}
		
				addPoint(pt.clone());
			}
		}
		else
		{
			hint = pt;
			// FIXME: First click in connect preview toggles orientation
			horizontal = true;
		}

		// Adds the last point
		pt = pts[lastInx];

		if (pt == null && target != null)
		{
			pt = new mxPoint(state.view.getRoutingCenterX(target), state.view.getRoutingCenterY(target));
		}
		
		if (pt != null)
		{
			if (hint != null)
			{
				if (horizontal && ((pts[lastInx] != null && pts[lastInx].y != hint.y) ||
					(pts[lastInx] == null && target != null &&
					(hint.y < target.y || hint.y > target.y + target.height))))
				{
					addPoint(new mxPoint(pt.x, hint.y));
				}
				else if (!horizontal && ((pts[lastInx] != null && pts[lastInx].x != hint.x) ||
						(pts[lastInx] == null && target != null &&
						(hint.x < target.x || hint.x > target.x + target.width))))
				{
					addPoint(new mxPoint(hint.x, pt.y));
				}
			}
		}
		
		// Removes bends inside the source terminal
		if (pts[0] == null && source != null)
		{
			while (tempPoints.length > 0 && tempPoints[0] != null &&
				mxUtils.contains(source, tempPoints[0].x, tempPoints[0].y))
			{
				tempPoints.splice(0, 1);
			}
		}
		
		// Removes bends inside the target terminal
		if (pts[lastInx] == null && target != null)
		{
			while (tempPoints.length > 0 && tempPoints[tempPoints.length - 1] != null &&
				mxUtils.contains(target, tempPoints[tempPoints.length - 1].x, tempPoints[tempPoints.length - 1].y))
			{
				tempPoints.splice(tempPoints.length - 1, 1);
			}
		}
		
		// Scales and smoothens edges
		for (var i = 0; i < tempPoints.length; i++)
		{
			pushPoint(tempPoints[i]);
		}
		
		// Removes last point if inside tolerance with end point
		if (pe != null && result[result.length - 1] != null &&
			Math.abs(pe.x - result[result.length - 1].x) <= tol &&
			Math.abs(pe.y - result[result.length - 1].y) <= tol)
		{
			result.splice(result.length - 1, 1);
			
			// Lines up second last point in result with end point
			if (result[result.length - 1] != null)
			{
				if (Math.abs(result[result.length - 1].x - pe.x) < tol)
				{
					result[result.length - 1].x = pe.x;
				}
				
				if (Math.abs(result[result.length - 1].y - pe.y) < tol)
				{
					result[result.length - 1].y = pe.y;
				}
			}
		}
	},
	
	orthBuffer: 10,
	
	orthPointsFallback: true,

	dirVectors: [ [ -1, 0 ],
			[ 0, -1 ], [ 1, 0 ], [ 0, 1 ], [ -1, 0 ], [ 0, -1 ], [ 1, 0 ] ],

	wayPoints1: [ [ 0, 0], [ 0, 0],  [ 0, 0], [ 0, 0], [ 0, 0],  [ 0, 0],
	              [ 0, 0],  [ 0, 0], [ 0, 0],  [ 0, 0], [ 0, 0],  [ 0, 0] ],

	routePatterns: [
		[ [ 513, 2308, 2081, 2562 ], [ 513, 1090, 514, 2184, 2114, 2561 ],
			[ 513, 1090, 514, 2564, 2184, 2562 ],
			[ 513, 2308, 2561, 1090, 514, 2568, 2308 ] ],
	[ [ 514, 1057, 513, 2308, 2081, 2562 ], [ 514, 2184, 2114, 2561 ],
			[ 514, 2184, 2562, 1057, 513, 2564, 2184 ],
			[ 514, 1057, 513, 2568, 2308, 2561 ] ],
	[ [ 1090, 514, 1057, 513, 2308, 2081, 2562 ], [ 2114, 2561 ],
			[ 1090, 2562, 1057, 513, 2564, 2184 ],
			[ 1090, 514, 1057, 513, 2308, 2561, 2568 ] ],
	[ [ 2081, 2562 ], [ 1057, 513, 1090, 514, 2184, 2114, 2561 ],
			[ 1057, 513, 1090, 514, 2184, 2562, 2564 ],
			[ 1057, 2561, 1090, 514, 2568, 2308 ] ] ],
	
	inlineRoutePatterns: [
			[ null, [ 2114, 2568 ], null, null ],
			[ null, [ 514, 2081, 2114, 2568 ] , null, null ],
			[ null, [ 2114, 2561 ], null, null ],
			[ [ 2081, 2562 ], [ 1057, 2114, 2568 ],
					[ 2184, 2562 ],
					null ] ],
	vertexSeperations: [],

	limits: [
	       [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
	       [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ] ],

	LEFT_MASK: 32,

	TOP_MASK: 64,

	RIGHT_MASK: 128,

	BOTTOM_MASK: 256,

	LEFT: 1,

	TOP: 2,

	RIGHT: 4,

	BOTTOM: 8,

	// TODO remove magic numbers
	SIDE_MASK: 480,
	//mxEdgeStyle.LEFT_MASK | mxEdgeStyle.TOP_MASK | mxEdgeStyle.RIGHT_MASK
	//| mxEdgeStyle.BOTTOM_MASK,

	CENTER_MASK: 512,

	SOURCE_MASK: 1024,

	TARGET_MASK: 2048,

	VERTEX_MASK: 3072,
	// mxEdgeStyle.SOURCE_MASK | mxEdgeStyle.TARGET_MASK,
	
	getJettySize: function(state, isSource)
	{
		var value = mxUtils.getValue(state.style, (isSource) ? mxConstants.STYLE_SOURCE_JETTY_SIZE :
			mxConstants.STYLE_TARGET_JETTY_SIZE, mxUtils.getValue(state.style,
					mxConstants.STYLE_JETTY_SIZE, mxEdgeStyle.orthBuffer));
		
		if (value == 'auto')
		{
			// Computes the automatic jetty size
			var type = mxUtils.getValue(state.style, (isSource) ? mxConstants.STYLE_STARTARROW : mxConstants.STYLE_ENDARROW, mxConstants.NONE);
			
			if (type != mxConstants.NONE)
			{
				var size = mxUtils.getNumber(state.style, (isSource) ? mxConstants.STYLE_STARTSIZE : mxConstants.STYLE_ENDSIZE, mxConstants.DEFAULT_MARKERSIZE);
				value = Math.max(2, Math.ceil((size + mxEdgeStyle.orthBuffer) / mxEdgeStyle.orthBuffer)) * mxEdgeStyle.orthBuffer;
			}
			else
			{
				value = 2 * mxEdgeStyle.orthBuffer;
			}
		}
		
		return value;
	},
	
	/**
	 * Function: scalePointArray
	 * 
	 * Scales an array of <mxPoint>
	 * 
	 * Parameters:
	 * 
	 * points - array of <mxPoint> to scale
	 * scale - the scaling to divide by
	 * 
	 */
	scalePointArray: function(points, scale)
	{
		var result = [];

		if (points != null)
		{
			for (var i = 0; i < points.length; i++)
			{
				if (points[i] != null)
				{
					var pt = new mxPoint(Math.round(points[i].x / scale * 10) / 10,
										Math.round(points[i].y / scale * 10) / 10);
					result[i] = pt;
				}
				else
				{
					result[i] = null;
				}
			}
		}
		else
		{
			result = null;
		}
		
		return result;
	},
	
	/**
	 * Function: scaleCellState
	 * 
	 * Scales an <mxCellState>
	 * 
	 * Parameters:
	 * 
	 * state - <mxCellState> to scale
	 * scale - the scaling to divide by
	 * 
	 */
	scaleCellState: function(state, scale)
	{
		var result = null;

		if (state != null)
		{
			result = state.clone();
			result.setRect(Math.round(state.x / scale * 10) / 10,
							Math.round(state.y / scale * 10) / 10,
							Math.round(state.width / scale * 10) / 10,
							Math.round(state.height / scale * 10) / 10);
		}
		else
		{
			result = null;
		}
		
		return result;
	},

	/**
	 * Function: OrthConnector
	 * 
	 * Implements a local orthogonal router between the given
	 * cells.
	 * 
	 * Parameters:
	 * 
	 * state - <mxCellState> that represents the edge to be updated.
	 * sourceScaled - <mxCellState> that represents the source terminal.
	 * targetScaled - <mxCellState> that represents the target terminal.
	 * controlHints - List of relative control points.
	 * result - Array of <mxPoints> that represent the actual points of the
	 * edge.
	 * 
	 */
	OrthConnector: function(state, sourceScaled, targetScaled, controlHints, result)
	{
		var graph = state.view.graph;
		var sourceEdge = source == null ? false : graph.getModel().isEdge(source.cell);
		var targetEdge = target == null ? false : graph.getModel().isEdge(target.cell);

		var pts = mxEdgeStyle.scalePointArray(state.absolutePoints, state.view.scale);
		var source = mxEdgeStyle.scaleCellState(sourceScaled, state.view.scale);
		var target = mxEdgeStyle.scaleCellState(targetScaled, state.view.scale);

		var p0 = pts[0];
		var pe = pts[pts.length-1];
		
		var sourceX = source != null ? source.x : p0.x;
		var sourceY = source != null ? source.y : p0.y;
		var sourceWidth = source != null ? source.width : 1;
		var sourceHeight = source != null ? source.height : 1;
		
		var targetX = target != null ? target.x : pe.x;
		var targetY = target != null ? target.y : pe.y;
		var targetWidth = target != null ? target.width : 1;
		var targetHeight = target != null ? target.height : 1;

		var sourceBuffer = mxEdgeStyle.getJettySize(state, true);
		var targetBuffer = mxEdgeStyle.getJettySize(state, false);
		
		//console.log('sourceBuffer', sourceBuffer);
		//console.log('targetBuffer', targetBuffer);
		// Workaround for loop routing within buffer zone
		if (source != null && target == source)
		{
			targetBuffer = Math.max(sourceBuffer, targetBuffer);
			sourceBuffer = targetBuffer;
		}
		
		var totalBuffer = targetBuffer + sourceBuffer;
		// console.log('totalBuffer', totalBuffer);
		var tooShort = false;
		
		// Checks minimum distance for fixed points and falls back to segment connector
		if (p0 != null && pe != null)
		{
			var dx = pe.x - p0.x;
			var dy = pe.y - p0.y;
			
			tooShort = dx * dx + dy * dy < totalBuffer * totalBuffer;
		}

		if (tooShort || (mxEdgeStyle.orthPointsFallback && (controlHints != null &&
				controlHints.length > 0)) || sourceEdge || targetEdge)
		{
			mxEdgeStyle.SegmentConnector(state, sourceScaled, targetScaled, controlHints, result);
			
			return;
		}

		// Determine the side(s) of the source and target vertices
		// that the edge may connect to
		// portConstraint [source, target]
		var portConstraint = [mxConstants.DIRECTION_MASK_ALL, mxConstants.DIRECTION_MASK_ALL];
		var rotation = 0;
		
		if (source != null)
		{
			portConstraint[0] = mxUtils.getPortConstraints(source, state, true, 
					mxConstants.DIRECTION_MASK_ALL);
			rotation = mxUtils.getValue(source.style, mxConstants.STYLE_ROTATION, 0);
			
			//console.log('source rotation', rotation);
			
			if (rotation != 0)
			{
				var newRect = mxUtils.getBoundingBox(new mxRectangle(sourceX, sourceY, sourceWidth, sourceHeight), rotation);
				sourceX = newRect.x; 
				sourceY = newRect.y;
				sourceWidth = newRect.width;
				sourceHeight = newRect.height;
			}
		}

		if (target != null)
		{
			portConstraint[1] = mxUtils.getPortConstraints(target, state, false,
				mxConstants.DIRECTION_MASK_ALL);
			rotation = mxUtils.getValue(target.style, mxConstants.STYLE_ROTATION, 0);
			
			//console.log('target rotation', rotation);

			if (rotation != 0)
			{
				var newRect = mxUtils.getBoundingBox(new mxRectangle(targetX, targetY, targetWidth, targetHeight), rotation);
				targetX = newRect.x;
				targetY = newRect.y;
				targetWidth = newRect.width;
				targetHeight = newRect.height;
			}
		}

		//console.log('source' , sourceX, sourceY, sourceWidth, sourceHeight);
		//console.log('targetX' , targetX, targetY, targetWidth, targetHeight);
		
		if (sourceWidth == 0 || sourceHeight == 0 ||
			targetWidth == 0 || targetHeight == 0)
		{
			return;
		}

		var dir = [0, 0];

		// Work out which faces of the vertices present against each other
		// in a way that would allow a 3-segment connection if port constraints
		// permitted.
		// geo -> [source, target] [x, y, width, height]
		var geo = [ [sourceX, sourceY, sourceWidth, sourceHeight] ,
		            [targetX, targetY, targetWidth, targetHeight] ];
		var buffer = [sourceBuffer, targetBuffer];

		for (var i = 0; i < 2; i++)
		{
			mxEdgeStyle.limits[i][1] = geo[i][0] - buffer[i];
			mxEdgeStyle.limits[i][2] = geo[i][1] - buffer[i];
			mxEdgeStyle.limits[i][4] = geo[i][0] + geo[i][2] + buffer[i];
			mxEdgeStyle.limits[i][8] = geo[i][1] + geo[i][3] + buffer[i];
		}
		
		// Work out which quad the target is in
		var sourceCenX = geo[0][0] + geo[0][2] / 2.0;
		var sourceCenY = geo[0][1] + geo[0][3] / 2.0;
		var targetCenX = geo[1][0] + geo[1][2] / 2.0;
		var targetCenY = geo[1][1] + geo[1][3] / 2.0;
		
		var dx = sourceCenX - targetCenX;
		var dy = sourceCenY - targetCenY;

		var quad = 0;

		// 0 | 1
		// -----
		// 3 | 2
		
		if (dx < 0)
		{
			if (dy < 0)
			{
				quad = 2;
			}
			else
			{
				quad = 1;
			}
		}
		else
		{
			if (dy <= 0)
			{
				quad = 3;
				
				// Special case on x = 0 and negative y
				if (dx == 0)
				{
					quad = 2;
				}
			}
		}

		//console.log('quad', quad);

		// Check for connection constraints
		var currentTerm = null;
		
		if (source != null)
		{
			currentTerm = p0;
		}

		var constraint = [ [0.5, 0.5] , [0.5, 0.5] ];

		for (var i = 0; i < 2; i++)
		{
			if (currentTerm != null)
			{
				constraint[i][0] = (currentTerm.x - geo[i][0]) / geo[i][2];
				
				if (Math.abs(currentTerm.x - geo[i][0]) <= 1)
				{
					dir[i] = mxConstants.DIRECTION_MASK_WEST;
				}
				else if (Math.abs(currentTerm.x - geo[i][0] - geo[i][2]) <= 1)
				{
					dir[i] = mxConstants.DIRECTION_MASK_EAST;
				}

				constraint[i][1] = (currentTerm.y - geo[i][1]) / geo[i][3];

				if (Math.abs(currentTerm.y - geo[i][1]) <= 1)
				{
					dir[i] = mxConstants.DIRECTION_MASK_NORTH;
				}
				else if (Math.abs(currentTerm.y - geo[i][1] - geo[i][3]) <= 1)
				{
					dir[i] = mxConstants.DIRECTION_MASK_SOUTH;
				}
			}

			currentTerm = null;
			
			if (target != null)
			{
				currentTerm = pe;
			}
		}

		var sourceTopDist = geo[0][1] - (geo[1][1] + geo[1][3]);
		var sourceLeftDist = geo[0][0] - (geo[1][0] + geo[1][2]);
		var sourceBottomDist = geo[1][1] - (geo[0][1] + geo[0][3]);
		var sourceRightDist = geo[1][0] - (geo[0][0] + geo[0][2]);

		mxEdgeStyle.vertexSeperations[1] = Math.max(sourceLeftDist - totalBuffer, 0);
		mxEdgeStyle.vertexSeperations[2] = Math.max(sourceTopDist - totalBuffer, 0);
		mxEdgeStyle.vertexSeperations[4] = Math.max(sourceBottomDist - totalBuffer, 0);
		mxEdgeStyle.vertexSeperations[3] = Math.max(sourceRightDist - totalBuffer, 0);
				
		//==============================================================
		// Start of source and target direction determination

		// Work through the preferred orientations by relative positioning
		// of the vertices and list them in preferred and available order
		
		var dirPref = [];
		var horPref = [];
		var vertPref = [];

		horPref[0] = (sourceLeftDist >= sourceRightDist) ? mxConstants.DIRECTION_MASK_WEST
				: mxConstants.DIRECTION_MASK_EAST;
		vertPref[0] = (sourceTopDist >= sourceBottomDist) ? mxConstants.DIRECTION_MASK_NORTH
				: mxConstants.DIRECTION_MASK_SOUTH;

		horPref[1] = mxUtils.reversePortConstraints(horPref[0]);
		vertPref[1] = mxUtils.reversePortConstraints(vertPref[0]);
		
		var preferredHorizDist = sourceLeftDist >= sourceRightDist ? sourceLeftDist
				: sourceRightDist;
		var preferredVertDist = sourceTopDist >= sourceBottomDist ? sourceTopDist
				: sourceBottomDist;

		var prefOrdering = [ [0, 0] , [0, 0] ];
		var preferredOrderSet = false;

		// If the preferred port isn't available, switch it
		for (var i = 0; i < 2; i++)
		{
			if (dir[i] != 0x0)
			{
				continue;
			}

			if ((horPref[i] & portConstraint[i]) == 0)
			{
				horPref[i] = mxUtils.reversePortConstraints(horPref[i]);
			}

			if ((vertPref[i] & portConstraint[i]) == 0)
			{
				vertPref[i] = mxUtils
						.reversePortConstraints(vertPref[i]);
			}

			prefOrdering[i][0] = vertPref[i];
			prefOrdering[i][1] = horPref[i];
		}

		if (preferredVertDist > 0
				&& preferredHorizDist > 0)
		{
			// Possibility of two segment edge connection
			if (((horPref[0] & portConstraint[0]) > 0)
					&& ((vertPref[1] & portConstraint[1]) > 0))
			{
				prefOrdering[0][0] = horPref[0];
				prefOrdering[0][1] = vertPref[0];
				prefOrdering[1][0] = vertPref[1];
				prefOrdering[1][1] = horPref[1];
				preferredOrderSet = true;
			}
			else if (((vertPref[0] & portConstraint[0]) > 0)
					&& ((horPref[1] & portConstraint[1]) > 0))
			{
				prefOrdering[0][0] = vertPref[0];
				prefOrdering[0][1] = horPref[0];
				prefOrdering[1][0] = horPref[1];
				prefOrdering[1][1] = vertPref[1];
				preferredOrderSet = true;
			}
		}
		
		if (preferredVertDist > 0 && !preferredOrderSet)
		{
			prefOrdering[0][0] = vertPref[0];
			prefOrdering[0][1] = horPref[0];
			prefOrdering[1][0] = vertPref[1];
			prefOrdering[1][1] = horPref[1];
			preferredOrderSet = true;

		}
		
		if (preferredHorizDist > 0 && !preferredOrderSet)
		{
			prefOrdering[0][0] = horPref[0];
			prefOrdering[0][1] = vertPref[0];
			prefOrdering[1][0] = horPref[1];
			prefOrdering[1][1] = vertPref[1];
			preferredOrderSet = true;
		}

		// The source and target prefs are now an ordered list of
		// the preferred port selections
		// If the list contains gaps, compact it

		for (var i = 0; i < 2; i++)
		{
			if (dir[i] != 0x0)
			{
				continue;
			}

			if ((prefOrdering[i][0] & portConstraint[i]) == 0)
			{
				prefOrdering[i][0] = prefOrdering[i][1];
			}

			dirPref[i] = prefOrdering[i][0] & portConstraint[i];
			dirPref[i] |= (prefOrdering[i][1] & portConstraint[i]) << 8;
			dirPref[i] |= (prefOrdering[1 - i][i] & portConstraint[i]) << 16;
			dirPref[i] |= (prefOrdering[1 - i][1 - i] & portConstraint[i]) << 24;

			if ((dirPref[i] & 0xF) == 0)
			{
				dirPref[i] = dirPref[i] << 8;
			}
			
			if ((dirPref[i] & 0xF00) == 0)
			{
				dirPref[i] = (dirPref[i] & 0xF) | dirPref[i] >> 8;
			}
			
			if ((dirPref[i] & 0xF0000) == 0)
			{
				dirPref[i] = (dirPref[i] & 0xFFFF)
						| ((dirPref[i] & 0xF000000) >> 8);
			}

			dir[i] = dirPref[i] & 0xF;

			if (portConstraint[i] == mxConstants.DIRECTION_MASK_WEST
					|| portConstraint[i] == mxConstants.DIRECTION_MASK_NORTH
					|| portConstraint[i] == mxConstants.DIRECTION_MASK_EAST
					|| portConstraint[i] == mxConstants.DIRECTION_MASK_SOUTH)
			{
				dir[i] = portConstraint[i];
			}
		}

		//==============================================================
		// End of source and target direction determination

		var sourceIndex = dir[0] == mxConstants.DIRECTION_MASK_EAST ? 3
				: dir[0];
		var targetIndex = dir[1] == mxConstants.DIRECTION_MASK_EAST ? 3
				: dir[1];

		sourceIndex -= quad;
		targetIndex -= quad;

		if (sourceIndex < 1)
		{
			sourceIndex += 4;
		}
		
		if (targetIndex < 1)
		{
			targetIndex += 4;
		}

		var routePattern = mxEdgeStyle.routePatterns[sourceIndex - 1][targetIndex - 1];
		
		//console.log('routePattern', routePattern);

		mxEdgeStyle.wayPoints1[0][0] = geo[0][0];
		mxEdgeStyle.wayPoints1[0][1] = geo[0][1];

		switch (dir[0])
		{
			case mxConstants.DIRECTION_MASK_WEST:
				mxEdgeStyle.wayPoints1[0][0] -= sourceBuffer;
				mxEdgeStyle.wayPoints1[0][1] += constraint[0][1] * geo[0][3];
				break;
			case mxConstants.DIRECTION_MASK_SOUTH:
				mxEdgeStyle.wayPoints1[0][0] += constraint[0][0] * geo[0][2];
				mxEdgeStyle.wayPoints1[0][1] += geo[0][3] + sourceBuffer;
				break;
			case mxConstants.DIRECTION_MASK_EAST:
				mxEdgeStyle.wayPoints1[0][0] += geo[0][2] + sourceBuffer;
				mxEdgeStyle.wayPoints1[0][1] += constraint[0][1] * geo[0][3];
				break;
			case mxConstants.DIRECTION_MASK_NORTH:
				mxEdgeStyle.wayPoints1[0][0] += constraint[0][0] * geo[0][2];
				mxEdgeStyle.wayPoints1[0][1] -= sourceBuffer;
				break;
		}

		var currentIndex = 0;

		// Orientation, 0 horizontal, 1 vertical
		var lastOrientation = (dir[0] & (mxConstants.DIRECTION_MASK_EAST | mxConstants.DIRECTION_MASK_WEST)) > 0 ? 0
				: 1;
		var initialOrientation = lastOrientation;
		var currentOrientation = 0;

		for (var i = 0; i < routePattern.length; i++)
		{
			var nextDirection = routePattern[i] & 0xF;

			// Rotate the index of this direction by the quad
			// to get the real direction
			var directionIndex = nextDirection == mxConstants.DIRECTION_MASK_EAST ? 3
					: nextDirection;

			directionIndex += quad;

			if (directionIndex > 4)
			{
				directionIndex -= 4;
			}

			var direction = mxEdgeStyle.dirVectors[directionIndex - 1];

			currentOrientation = (directionIndex % 2 > 0) ? 0 : 1;
			// Only update the current index if the point moved
			// in the direction of the current segment move,
			// otherwise the same point is moved until there is 
			// a segment direction change
			if (currentOrientation != lastOrientation)
			{
				currentIndex++;
				// Copy the previous way point into the new one
				// We can't base the new position on index - 1
				// because sometime elbows turn out not to exist,
				// then we'd have to rewind.
				mxEdgeStyle.wayPoints1[currentIndex][0] = mxEdgeStyle.wayPoints1[currentIndex - 1][0];
				mxEdgeStyle.wayPoints1[currentIndex][1] = mxEdgeStyle.wayPoints1[currentIndex - 1][1];
			}

			var tar = (routePattern[i] & mxEdgeStyle.TARGET_MASK) > 0;
			var sou = (routePattern[i] & mxEdgeStyle.SOURCE_MASK) > 0;
			var side = (routePattern[i] & mxEdgeStyle.SIDE_MASK) >> 5;
			side = side << quad;

			if (side > 0xF)
			{
				side = side >> 4;
			}

			var center = (routePattern[i] & mxEdgeStyle.CENTER_MASK) > 0;

			if ((sou || tar) && side < 9)
			{
				var limit = 0;
				var souTar = sou ? 0 : 1;

				if (center && currentOrientation == 0)
				{
					limit = geo[souTar][0] + constraint[souTar][0] * geo[souTar][2];
				}
				else if (center)
				{
					limit = geo[souTar][1] + constraint[souTar][1] * geo[souTar][3];
				}
				else
				{
					limit = mxEdgeStyle.limits[souTar][side];
				}
				
				if (currentOrientation == 0)
				{
					var lastX = mxEdgeStyle.wayPoints1[currentIndex][0];
					var deltaX = (limit - lastX) * direction[0];

					if (deltaX > 0)
					{
						mxEdgeStyle.wayPoints1[currentIndex][0] += direction[0]
								* deltaX;
					}
				}
				else
				{
					var lastY = mxEdgeStyle.wayPoints1[currentIndex][1];
					var deltaY = (limit - lastY) * direction[1];

					if (deltaY > 0)
					{
						mxEdgeStyle.wayPoints1[currentIndex][1] += direction[1]
								* deltaY;
					}
				}
			}

			else if (center)
			{
				// Which center we're travelling to depend on the current direction
				mxEdgeStyle.wayPoints1[currentIndex][0] += direction[0]
						* Math.abs(mxEdgeStyle.vertexSeperations[directionIndex] / 2);
				mxEdgeStyle.wayPoints1[currentIndex][1] += direction[1]
						* Math.abs(mxEdgeStyle.vertexSeperations[directionIndex] / 2);
			}

			if (currentIndex > 0
					&& mxEdgeStyle.wayPoints1[currentIndex][currentOrientation] == mxEdgeStyle.wayPoints1[currentIndex - 1][currentOrientation])
			{
				currentIndex--;
			}
			else
			{
				lastOrientation = currentOrientation;
			}
		}

		for (var i = 0; i <= currentIndex; i++)
		{
			if (i == currentIndex)
			{
				// Last point can cause last segment to be in
				// same direction as jetty/approach. If so,
				// check the number of points is consistent
				// with the relative orientation of source and target
				// jx. Same orientation requires an even
				// number of turns (points), different requires
				// odd.
				var targetOrientation = (dir[1] & (mxConstants.DIRECTION_MASK_EAST | mxConstants.DIRECTION_MASK_WEST)) > 0 ? 0
						: 1;
				var sameOrient = targetOrientation == initialOrientation ? 0 : 1;

				// (currentIndex + 1) % 2 is 0 for even number of points,
				// 1 for odd
				if (sameOrient != (currentIndex + 1) % 2)
				{
					// The last point isn't required
					break;
				}
			}
			
			result.push(new mxPoint(Math.round(mxEdgeStyle.wayPoints1[i][0] * state.view.scale * 10) / 10,
									Math.round(mxEdgeStyle.wayPoints1[i][1] * state.view.scale * 10) / 10));
		}
		
		//console.log(result);

		// Removes duplicates
		var index = 1;
		
		while (index < result.length)
		{
			if (result[index - 1] == null || result[index] == null ||
				result[index - 1].x != result[index].x ||
				result[index - 1].y != result[index].y)
			{
				index++;
			}
			else
			{
				result.splice(index, 1);
			}
		}
	},
	
	getRoutePattern: function(dir, quad, dx, dy)
	{
		var sourceIndex = dir[0] == mxConstants.DIRECTION_MASK_EAST ? 3
				: dir[0];
		var targetIndex = dir[1] == mxConstants.DIRECTION_MASK_EAST ? 3
				: dir[1];

		sourceIndex -= quad;
		targetIndex -= quad;

		if (sourceIndex < 1)
		{
			sourceIndex += 4;
		}
		if (targetIndex < 1)
		{
			targetIndex += 4;
		}

		var result = routePatterns[sourceIndex - 1][targetIndex - 1];

		if (dx == 0 || dy == 0)
		{
			if (inlineRoutePatterns[sourceIndex - 1][targetIndex - 1] != null)
			{
				result = inlineRoutePatterns[sourceIndex - 1][targetIndex - 1];
			}
		}

		return result;
	}
};