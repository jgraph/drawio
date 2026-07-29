/**
 * Copyright (c) 2006-2015, JGraph Holdings Ltd
 * Copyright (c) 2006-2015, draw.io AG
 *
 * The equal-distance guides are based on code Copyright (c) 2017, CTI LOGIC,
 * contributed under the following license:
 *
 * Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
 *
 * 3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY
 * AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
 * WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
/**
 * Class: mxGuide
 *
 * Implements the alignment of selection cells to other cells in the graph,
 * both by aligned positions and by equal distances between cells.
 *
 * Constructor: mxGuide
 *
 * Constructs a new guide object.
 */
function mxGuide(graph, states)
{
	this.graph = graph;
	this.setStates(states);
};

/**
 * Variable: graph
 *
 * Reference to the enclosing <mxGraph> instance.
 */
mxGuide.prototype.graph = null;

/**
 * Variable: states
 *
 * Contains the <mxCellStates> that are used for alignment.
 */
mxGuide.prototype.states = null;

/**
 * Variable: horizontal
 *
 * Specifies if horizontal guides are enabled. Default is true.
 */
mxGuide.prototype.horizontal = true;

/**
 * Variable: vertical
 *
 * Specifies if vertical guides are enabled. Default is true.
 */
mxGuide.prototype.vertical = true;

/**
 * Variable: positionEnabled
 *
 * Specifies if guides for aligned positions are enabled. Default is true.
 */
mxGuide.prototype.positionEnabled = true;

/**
 * Variable: distanceEnabled
 *
 * Specifies if guides for equal distances between cells are enabled.
 * Default is true.
 */
mxGuide.prototype.distanceEnabled = true;

/**
 * Variable: guideX
 *
 * Holds the <mxShape> for the horizontal guide.
 */
mxGuide.prototype.guideX = null;

/**
 * Variable: guideY
 *
 * Holds the <mxShape> for the vertical guide.
 */
mxGuide.prototype.guideY = null;

/**
 * Variable: distanceGuidesX
 *
 * Holds the array of <mxShapes> for the equal distances along the x-axis.
 */
mxGuide.prototype.distanceGuidesX = null;

/**
 * Variable: distanceGuidesY
 *
 * Holds the array of <mxShapes> for the equal distances along the y-axis.
 */
mxGuide.prototype.distanceGuidesY = null;

/**
 * Variable: rounded
 *
 * Specifies if rounded coordinates should be used. Default is false.
 */
mxGuide.prototype.rounded = false;

/**
 * Variable: tolerance
 *
 * Default tolerance in px if grid is disabled. Default is 2.
 */
mxGuide.prototype.tolerance = 2;

/**
 * Function: setStates
 *
 * Sets the <mxCellStates> that should be used for alignment.
 */
mxGuide.prototype.setStates = function(states)
{
	this.states = states;
};

/**
 * Function: isEnabledForEvent
 *
 * Returns true if the guide should be enabled for the given native event. This
 * implementation always returns true.
 */
mxGuide.prototype.isEnabledForEvent = function(evt)
{
	return true;
};

/**
 * Function: getGuideTolerance
 *
 * Returns the tolerance for the guides. Default value is gridSize / 2.
 */
mxGuide.prototype.getGuideTolerance = function(gridEnabled)
{
	return (gridEnabled && this.graph.gridEnabled) ? this.graph.gridSize / 2 : this.tolerance;
};

/**
 * Function: createGuideShape
 *
 * Returns the mxShape to be used for painting the respective guide. This
 * implementation returns a new, dashed and crisp <mxPolyline> using
 * <mxConstants.GUIDE_COLOR> and <mxConstants.GUIDE_STROKEWIDTH> as the format.
 *
 * Parameters:
 *
 * horizontal - Boolean that specifies which guide should be created.
 */
mxGuide.prototype.createGuideShape = function(horizontal)
{
	var guide = new mxPolyline([], mxConstants.GUIDE_COLOR, mxConstants.GUIDE_STROKEWIDTH);
	guide.isDashed = true;

	return guide;
};

/**
 * Function: createDistanceGuideShape
 *
 * Returns the mxShape to be used for painting the guides for equal
 * distances. This implementation returns a new, solid and crisp
 * <mxPolyline> using <mxConstants.GUIDE_COLOR> and
 * <mxConstants.GUIDE_STROKEWIDTH> as the format.
 *
 * Parameters:
 *
 * horizontal - Boolean that specifies the axis of the guide.
 */
mxGuide.prototype.createDistanceGuideShape = function(horizontal)
{
	return new mxPolyline([], mxConstants.GUIDE_COLOR, mxConstants.GUIDE_STROKEWIDTH);
};

/**
 * Function: isStateIgnored
 *
 * Returns true if the given state should be ignored.
 */
mxGuide.prototype.isStateIgnored = function(state)
{
	return false;
};

/**
 * Function: move
 *
 * Moves the <bounds> by the given <mxPoint> and returnt the snapped point.
 */
mxGuide.prototype.move = function(bounds, delta, gridEnabled, clone)
{
	if (this.states != null && (this.horizontal || this.vertical) && bounds != null && delta != null)
	{
		var scale = this.graph.getView().scale;
		// Minimum of 2px keeps the guides usable at low zoom levels
		var tt = Math.max(2, this.getGuideTolerance(gridEnabled) * scale);

		// Equal distances snap first and the result is applied to the delta
		// for the alignment pass below so that alignment guides are only
		// kept where they agree with the equal distances
		var dist = (this.distanceEnabled) ? this.moveDistance(
			bounds, delta, Math.max(2, tt / 2)) : null;
		var distX = (dist != null) ? dist.x : null;
		var distY = (dist != null) ? dist.y : null;

		if (distX != null)
		{
			delta.x = distX;
		}

		if (distY != null)
		{
			delta.y = distY;
		}

		var b = bounds.clone();
		b.x += delta.x;
		b.y += delta.y;
		var overrideX = false;
		var stateX = null;
		var valueX = null;
		var overrideY = false;
		var stateY = null;
		var valueY = null;
		var ttX = tt;
		var ttY = tt;
		var left = b.x;
		var right = b.x + b.width;
		var center = b.getCenterX();
		var top = b.y;
		var bottom = b.y + b.height;
		var middle = b.getCenterY();

		// Snaps the left, center and right to the given x-coordinate
		function snapX(x, state, centerAlign)
		{
			var override = false;

			if (centerAlign && Math.abs(x - center) < ttX)
			{
				delta.x = x - bounds.getCenterX();
				ttX = Math.abs(x - center);
				override = true;
			}
			else if (!centerAlign)
			{
				if (Math.abs(x - left) < ttX)
				{
					delta.x = x - bounds.x;
					ttX = Math.abs(x - left);
					override = true;
				}
				else if (Math.abs(x - right) < ttX)
				{
					delta.x = x - bounds.x - bounds.width;
					ttX = Math.abs(x - right);
					override = true;
				}
			}

			if (override)
			{
				stateX = state;
				valueX = x;

				if (this.guideX == null)
				{
					this.guideX = this.createGuideShape(true);

					// Makes sure to use either SVG shapes in order to implement
					// event-transparency on the background area of the rectangle since
					// HTML shapes do not let mouseevents through even when transparent
					this.guideX.dialect = mxConstants.DIALECT_SVG;
					this.guideX.pointerEvents = false;
					this.guideX.init(this.graph.getView().getOverlayPane());
				}
			}

			overrideX = overrideX || override;
		};

		// Snaps the top, middle or bottom to the given y-coordinate
		function snapY(y, state, centerAlign)
		{
			var override = false;

			if (centerAlign && Math.abs(y - middle) < ttY)
			{
				delta.y = y - bounds.getCenterY();
				ttY = Math.abs(y -  middle);
				override = true;
			}
			else if (!centerAlign)
			{
				if (Math.abs(y - top) < ttY)
				{
					delta.y = y - bounds.y;
					ttY = Math.abs(y - top);
					override = true;
				}
				else if (Math.abs(y - bottom) < ttY)
				{
					delta.y = y - bounds.y - bounds.height;
					ttY = Math.abs(y - bottom);
					override = true;
				}
			}

			if (override)
			{
				stateY = state;
				valueY = y;

				if (this.guideY == null)
				{
					this.guideY = this.createGuideShape(false);

					// Makes sure to use either SVG shapes in order to implement
					// event-transparency on the background area of the rectangle since
					// HTML shapes do not let mouseevents through even when transparent
					this.guideY.dialect = mxConstants.DIALECT_SVG;
					this.guideY.pointerEvents = false;
					this.guideY.init(this.graph.getView().getOverlayPane());
				}
			}

			overrideY = overrideY || override;
		};

		if (this.positionEnabled)
		{
			for (var i = 0; i < this.states.length; i++)
			{
				var state =  this.states[i];

				if (state != null && !this.isStateIgnored(state))
				{
					// Align x
					if (this.horizontal)
					{
						snapX.call(this, state.getCenterX(), state, true);
						snapX.call(this, state.x, state, false);
						snapX.call(this, state.x + state.width, state, false);

						// Aligns left and right of shape to center of page
						if (state.cell == null)
						{
							snapX.call(this, state.getCenterX(), state, false);
						}
					}

					// Align y
					if (this.vertical)
					{
						snapY.call(this, state.getCenterY(), state, true);
						snapY.call(this, state.y, state, false);
						snapY.call(this, state.y + state.height, state, false);

						// Aligns left and right of shape to center of page
						if (state.cell == null)
						{
							snapY.call(this, state.getCenterY(), state, false);
						}
					}
				}
			}
		}

		// Equal distances win over conflicting alignments
		if (distX != null && delta.x != distX)
		{
			delta.x = distX;
			overrideX = false;
		}

		if (distY != null && delta.y != distY)
		{
			delta.y = distY;
			overrideY = false;
		}

		// Moves cells to the raster if not aligned
		this.graph.snapDelta(delta, bounds, !gridEnabled,
			overrideX || distX != null, overrideY || distY != null);
		delta = this.getDelta(bounds, stateX, delta.x, stateY, delta.y)

		// Redraws the guides
		if (!overrideX && this.guideX != null)
		{
			this.guideX.node.style.visibility = 'hidden';
		}
		else if (this.guideX != null)
		{
			var minY = Math.min(bounds.y + delta.y - this.graph.panDy, stateX.y);
			var maxY = Math.max(bounds.y + bounds.height + delta.y - this.graph.panDy, stateX.y + stateX.height);

			this.guideX.points = [new mxPoint(valueX, minY), new mxPoint(valueX, maxY)];
			this.guideX.stroke = this.getGuideColor(stateX, true);
			this.guideX.node.style.visibility = 'visible';
			this.guideX.redraw();
		}

		if (!overrideY && this.guideY != null)
		{
			this.guideY.node.style.visibility = 'hidden';
		}
		else if (this.guideY != null)
		{
			var minX = Math.min(bounds.x + delta.x - this.graph.panDx, stateY.x);
			var maxX = Math.max(bounds.x + bounds.width + delta.x - this.graph.panDx, stateY.x + stateY.width);

			this.guideY.points = [new mxPoint(minX, valueY), new mxPoint(maxX, valueY)];
			this.guideY.stroke = this.getGuideColor(stateY, false);
			this.guideY.node.style.visibility = 'visible';
			this.guideY.redraw();
		}
	}

	return delta;
};

/**
 * Function: moveDistance
 *
 * Snaps the <bounds> moved by the given <mxPoint> to positions where the
 * distances to the cells before and after the moved cell along one axis
 * are equal, using the given tolerance in screen pixels. Returns an object
 * with the snapped x- and y-delta or null for each axis, or null if there
 * is no such position. Cells that overlap the moved bounds on one axis and
 * do not overlap on the other axis are used as candidates for the
 * respective axis.
 */
mxGuide.prototype.moveDistance = function(bounds, delta, tolerance)
{
	var b = new mxRectangle(bounds.x + delta.x, bounds.y + delta.y,
		bounds.width, bounds.height);
	var horizontalCells = [];
	var verticalCells = [];

	for (var i = 0; i < this.states.length; i++)
	{
		var state = this.states[i];

		if (state != null && state.cell != null && !this.isStateIgnored(state))
		{
			// A minimum distance of 4px avoids matches with a distance of 0
			// which would produce a guide for three overlapping cells
			if (((b.x >= state.x && b.x <= state.x + state.width) ||
				(state.x >= b.x && state.x <= b.x + b.width)) &&
				(b.y > state.y + state.height + 4 ||
				b.y + b.height + 4 < state.y))
			{
				verticalCells.push(state);
			}
			else if (((b.y >= state.y && b.y <= state.y + state.height) ||
				(state.y >= b.y && state.y <= b.y + b.height)) &&
				(b.x > state.x + state.width + 4 ||
				b.x + b.width + 4 < state.x))
			{
				horizontalCells.push(state);
			}
		}
	}

	var x = (this.horizontal && horizontalCells.length > 1) ?
		this.snapDistance(horizontalCells, b, true, tolerance) : null;
	var y = (this.vertical && verticalCells.length > 1) ?
		this.snapDistance(verticalCells, b, false, tolerance) : null;

	if (x == null)
	{
		this.hideDistanceGuides(true, false);
	}

	if (y == null)
	{
		this.hideDistanceGuides(false, true);
	}

	return (x != null || y != null) ? {x: (x != null) ? x - bounds.x : null,
		y: (y != null) ? y - bounds.y : null} : null;
};

/**
 * Function: snapDistance
 *
 * Returns the position along the given axis where the distances between
 * the given moved bounds and the cells before and after it are equal, or
 * null if there is no such position. The cells and the returned position
 * are in screen coordinates and the guides for the equal distances are
 * redrawn if a position is found.
 *
 * Parameters:
 *
 * cells - Array of <mxCellStates> that do not overlap the moved bounds.
 * b - <mxRectangle> of the moved bounds.
 * horizontal - Boolean that specifies the axis.
 * tolerance - Tolerance in screen pixels for the distances.
 */
mxGuide.prototype.snapDistance = function(cells, b, horizontal, tolerance)
{
	function pos(state)
	{
		return (horizontal) ? state.x : state.y;
	};

	function len(state)
	{
		return (horizontal) ? state.width : state.height;
	};

	cells.push(b);

	cells.sort(function(c1, c2)
	{
		return pos(c1) - pos(c2);
	});

	var firstMoving = cells[0] == b;
	var lastMoving = cells[cells.length - 1] == b;
	var passed = false;
	var eqCount = 0;
	var dist = 0;
	var fixedDist = 0;
	var midDist = 0;

	// Uses the mid space as the target distance if the moved
	// bounds are between two cells
	if (!firstMoving && !lastMoving)
	{
		for (var i = 1; i < cells.length - 1; i++)
		{
			if (cells[i] == b)
			{
				midDist = (pos(cells[i + 1]) - pos(cells[i - 1]) -
					len(cells[i - 1]) - len(b)) / 2;
				dist = midDist;
				fixedDist = dist;
				break;
			}
		}
	}

	for (var i = 0; i < cells.length - 1; i++)
	{
		var s1 = cells[i];
		var s2 = cells[i + 1];
		var moving = s1 == b || s2 == b;
		var cur = pos(s2) - pos(s1) - len(s1);
		passed = passed || s1 == b;

		if (dist == 0 && eqCount == 0)
		{
			dist = cur;
			eqCount = 1;
		}
		// Distances not adjacent to the moved bounds must match exactly, with
		// the exception of the second distance while the first cell is moving
		// and no fixed distance has been found
		else if (Math.abs(dist - cur) <= ((moving ||
			(i == 1 && passed)) ? tolerance : 0))
		{
			eqCount += 1;
		}
		// Stops and ignores the following cells
		else if (eqCount > 1 && passed)
		{
			cells = cells.slice(0, i + 1);
			break;
		}
		// Resets and starts counting again
		else if (cells.length - i >= 3 && !passed)
		{
			eqCount = 0;
			dist = (midDist != 0) ? midDist : 0;
			fixedDist = dist;
			cells.splice(0, (i == 0) ? 1 : i);
			i = -1;
		}
		else
		{
			break;
		}

		if (fixedDist == 0 && !moving)
		{
			fixedDist = cur;
			// Uses the fixed distance so that the following
			// distances must match without tolerance
			dist = fixedDist;
		}
	}

	// Three cells with the moved bounds in the middle have no
	// fixed distance and snap to the mid space instead
	var midSpace = cells.length == 3 && cells[1] == b;

	if (midSpace)
	{
		fixedDist = 0;
	}

	// A fixed distance of 0 (two adjacent cells that touch exactly) is
	// indistinguishable from no fixed distance having been found, so the
	// mid-space fallback below must not be used for any other layout: it
	// reads cells[0] and cells[2] as the fixed neighbours, which for a
	// moved bounds outside the middle computes a position from the moved
	// bounds itself and jumps it onto a neighbour [jgraph/drawio#5722]
	if (eqCount > 1 && eqCount == cells.length - 1 &&
		(fixedDist > 0 || midSpace))
	{
		// Guides are drawn at the far side of the first cell that
		// does not move so that they do not move with the cell
		var first = cells[(cells[0] == b) ? 1 : 0];
		var cross = (horizontal) ? first.y + first.height :
			first.x + first.width;
		var shift = 5 * this.graph.getView().scale;
		var points = [];
		var result = 0;

		if (fixedDist > 0)
		{
			for (var i = 0; i < cells.length - 1; i++)
			{
				var s1 = cells[i];
				var s2 = cells[i + 1];

				if (s1 == b)
				{
					result = this.roundToPixel(pos(s2) - len(b) - fixedDist);
					points.push(result + len(b) + shift);
					points.push(pos(s2) - shift);
				}
				else if (s2 == b)
				{
					points.push(pos(s1) + len(s1) + shift);
					result = this.roundToPixel(pos(s1) + len(s1) + fixedDist);
					points.push(result - shift);
				}
				else
				{
					points.push(pos(s1) + len(s1) + shift);
					points.push(pos(s2) - shift);
				}
			}
		}
		else
		{
			var s1 = cells[0];
			var s3 = cells[2];
			result = this.roundToPixel(pos(s1) + len(s1) +
				(pos(s3) - pos(s1) - len(s1) - len(b)) / 2);
			points.push(pos(s1) + len(s1) + shift);
			points.push(result - shift);
			points.push(result + len(b) + shift);
			points.push(pos(s3) - shift);
		}

		this.redrawDistanceGuides(horizontal, cross, points, shift);

		return result;
	}

	return null;
};

/**
 * Function: redrawDistanceGuides
 *
 * Redraws the guides for equal distances along the given axis, one guide
 * for each pair of values in the given points, drawn at the given cross
 * coordinate on the other axis with marks of the given length at both
 * ends. Existing guides are recycled and unused guides are destroyed.
 */
mxGuide.prototype.redrawDistanceGuides = function(horizontal, cross, points, shift)
{
	var guides = (horizontal) ? this.distanceGuidesX : this.distanceGuidesY;
	guides = (guides != null) ? guides : [];

	for (var i = 0; i < points.length; i += 2)
	{
		var guide = guides[i / 2];
		var p1 = (horizontal) ? new mxPoint(points[i], cross) :
			new mxPoint(cross, points[i]);
		var p2 = (horizontal) ? new mxPoint(points[i + 1], cross) :
			new mxPoint(cross, points[i + 1]);
		var dx = (horizontal) ? 0 : shift;
		var dy = (horizontal) ? shift : 0;

		if (guide == null)
		{
			guide = this.createDistanceGuideShape(horizontal);

			// Makes sure to use SVG shapes in order to implement
			// event-transparency on the guides
			guide.dialect = mxConstants.DIALECT_SVG;
			guide.pointerEvents = false;
			guide.init(this.graph.getView().getOverlayPane());
			guides[i / 2] = guide;
		}

		guide.points = [new mxPoint(p1.x - dx, p1.y - dy),
			new mxPoint(p1.x + dx, p1.y + dy), p1, p2,
			new mxPoint(p2.x - dx, p2.y - dy),
			new mxPoint(p2.x + dx, p2.y + dy)];
		guide.node.style.visibility = 'visible';
		guide.redraw();
	}

	// Destroys unused guides
	for (var i = points.length / 2; i < guides.length; i++)
	{
		guides[i].destroy();
	}

	guides.splice(points.length / 2, guides.length - points.length / 2);

	if (horizontal)
	{
		this.distanceGuidesX = guides;
	}
	else
	{
		this.distanceGuidesY = guides;
	}
};

/**
 * Function: hideDistanceGuides
 *
 * Hides the guides for equal distances for the given axes.
 */
mxGuide.prototype.hideDistanceGuides = function(horizontal, vertical)
{
	if (horizontal && this.distanceGuidesX != null)
	{
		for (var i = 0; i < this.distanceGuidesX.length; i++)
		{
			this.distanceGuidesX[i].node.style.visibility = 'hidden';
		}
	}

	if (vertical && this.distanceGuidesY != null)
	{
		for (var i = 0; i < this.distanceGuidesY.length; i++)
		{
			this.distanceGuidesY[i].node.style.visibility = 'hidden';
		}
	}
};

/**
 * Function: roundToPixel
 *
 * Rounds the given screen coordinate to unscaled pixels so that snapping
 * does not produce fractional cell positions.
 */
mxGuide.prototype.roundToPixel = function(value)
{
	var s = this.graph.getView().scale;

	return Math.round(value / s) * s;
};

/**
 * Function: getDelta
 *
 * Rounds to pixels for virtual states (eg. page guides)
 */
mxGuide.prototype.getDelta = function(bounds, stateX, dx, stateY, dy)
{
	var s = this.graph.view.scale;

	if (this.rounded || (stateX != null && stateX.cell == null))
	{
		dx = Math.round((bounds.x + dx) / s) * s - bounds.x;
	}

	if (this.rounded || (stateY != null && stateY.cell == null))
	{
		dy = Math.round((bounds.y + dy) / s) * s - bounds.y;
	}

	return new mxPoint(dx, dy);
};

/**
 * Function: getGuideColor
 *
 * Returns the color for the given state.
 */
mxGuide.prototype.getGuideColor = function(state, horizontal)
{
	return mxConstants.GUIDE_COLOR;
};

/**
 * Function: hide
 *
 * Hides all current guides.
 */
mxGuide.prototype.hide = function()
{
	this.setVisible(false);
};

/**
 * Function: setVisible
 *
 * Shows or hides the current guides.
 */
mxGuide.prototype.setVisible = function(visible)
{
	var visibility = (visible) ? 'visible' : 'hidden';

	if (this.guideX != null)
	{
		this.guideX.node.style.visibility = visibility;
	}

	if (this.guideY != null)
	{
		this.guideY.node.style.visibility = visibility;
	}

	if (this.distanceGuidesX != null)
	{
		for (var i = 0; i < this.distanceGuidesX.length; i++)
		{
			this.distanceGuidesX[i].node.style.visibility = visibility;
		}
	}

	if (this.distanceGuidesY != null)
	{
		for (var i = 0; i < this.distanceGuidesY.length; i++)
		{
			this.distanceGuidesY[i].node.style.visibility = visibility;
		}
	}
};

/**
 * Function: destroy
 *
 * Destroys all resources that this object uses.
 */
mxGuide.prototype.destroy = function()
{
	if (this.guideX != null)
	{
		this.guideX.destroy();
		this.guideX = null;
	}

	if (this.guideY != null)
	{
		this.guideY.destroy();
		this.guideY = null;
	}

	if (this.distanceGuidesX != null)
	{
		for (var i = 0; i < this.distanceGuidesX.length; i++)
		{
			this.distanceGuidesX[i].destroy();
		}

		this.distanceGuidesX = null;
	}

	if (this.distanceGuidesY != null)
	{
		for (var i = 0; i < this.distanceGuidesY.length; i++)
		{
			this.distanceGuidesY[i].destroy();
		}

		this.distanceGuidesY = null;
	}
};
