/**
 * Copyright (c) 2017, CTI LOGIC
 * Copyright (c) 2006-2017, JGraph Ltd
 * Copyright (c) 2006-2017, Gaudenz Alder
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
(function ()
{
	mxConnector.prototype.defaultJumpSize = 6;

	mxConnector.prototype.checkLineIntersection = function (line1Start, line1End, line2Start, line2End)
	{
		// if the lines intersect, the result contains the the
		// intersection point if both line segment 1 and line segment 2 contain the point
		// null otherwise
		var denominator = ((line2End.y - line2Start.y) * (line1End.x - line1Start.x)) -
			((line2End.x - line2Start.x) * (line1End.y - line1Start.y));

		if (denominator == 0)
		{
			return null;
		}
		else
		{
			var a = line1Start.y - line2Start.y;
			var b = line1Start.x - line2Start.x;
			var numerator1 = ((line2End.x - line2Start.x) * a) - ((line2End.y - line2Start.y) * b);
			var numerator2 = ((line1End.x - line1Start.x) * a) - ((line1End.y - line1Start.y) * b);
			a = numerator1 / denominator;
			b = numerator2 / denominator;

			// if we cast these lines infinitely in both directions, they intersect here:
			var x = line1Start.x + (a * (line1End.x - line1Start.x));
			var y = line1Start.y + (a * (line1End.y - line1Start.y));

			 // on both lines?
			if (a > 0 && a < 1 && b > 0 && b < 1)
			{
				return new mxPoint(x, y);
			}
			else
			{
				return null;
			}
		}
	};

	// Code from https://stackoverflow.com/questions/27664298/calculating-intersection-point-of-quadratic-bezier-curve
	mxConnector.prototype.calcQLintersects = function (p1, p2, p3, a1, a2)
	{
		//linear interpolation utility
		var lerp = function (a, b, x)
		{
			return (a + x * (b - a));
		};

		var intersections = [];

		// inverse line normal
		var normal = {
			x: a1.y - a2.y,
			y: a2.x - a1.x,
		};

		// Q-coefficients
		var c2 = {
			x: p1.x + p2.x * -2 + p3.x,
			y: p1.y + p2.y * -2 + p3.y
		};

		var c1 = {
			x: p1.x * -2 + p2.x * 2,
			y: p1.y * -2 + p2.y * 2,
		};

		var c0 = {
			x: p1.x,
			y: p1.y
		};

		// Transform to line 
		var coefficient = a1.x * a2.y - a2.x * a1.y;
		var a = normal.x * c2.x + normal.y * c2.y;
		var b = (normal.x * c1.x + normal.y * c1.y) / a;
		var c = (normal.x * c0.x + normal.y * c0.y + coefficient) / a;

		// solve the roots
		var roots = [];
		d = b * b - 4 * c;
		
		if (d > 0)
		{
			var e = Math.sqrt(d);
			roots.push((-b + Math.sqrt(d)) / 2);
			roots.push((-b - Math.sqrt(d)) / 2);
		}
		else if (d == 0)
		{
			roots.push(-b / 2);
		}

		// calc the solution points
		for (var i = 0; i < roots.length; i++)
		{
			var minX = Math.min(a1.x, a2.x);
			var minY = Math.min(a1.y, a2.y);
			var maxX = Math.max(a1.x, a2.x);
			var maxY = Math.max(a1.y, a2.y);
			var t = roots[i];
			
			if (t >= 0 && t <= 1)
			{
				// possible point -- pending bounds check
				var point = {
					x: lerp(lerp(p1.x, p2.x, t), lerp(p2.x, p3.x, t), t),
					y: lerp(lerp(p1.y, p2.y, t), lerp(p2.y, p3.y, t), t)
				}
				
				var x = point.x;
				var y = point.y;
				
				// bounds checks
				if (a1.x == a2.x && y >= minY && y <= maxY)
				{
					// vertical line
					intersections.push(point);
				}
				else if (a1.y == a2.y && x >= minX && x <= maxX)
				{
					// horizontal line
					intersections.push(point);
				}
				else if (x >= minX && y >= minY && x <= maxX && y <= maxY)
				{
					// line passed bounds check
					intersections.push(point);
				}
			}
		}
		
		return intersections;
	};

	mxConnector.prototype.getOnLinePointAtDist = function (x1, x2, y1, y2)
	{
		var dx = x1 - x2;
		var dy = y1 - y2;
		var d = Math.sqrt(dy * dy + dx * dx);
		var t = this.jumpSize / d;

		return new mxPoint((1 - t) * x1 + t * x2, (1 - t) * y1 + t * y2);
	};

	mxConnector.prototype.addBridgePoints = function (intersectPt, result, l2p1, l2p2, otherId, eState)
	{
		// instead of reordering, get the order and the top edge has the bridge
		var dx = result.x - l2p2.x;
		var dy = result.y - l2p2.y;
		var dist = Math.sqrt(dx * dx + dy * dy);
		dx /= dist;
		dy /= dist;

		intersectPt.push(this.getOnLinePointAtDist(result.x, l2p1.x, result.y, l2p1.y));
		intersectPt.push(new mxPoint(result.x + this.jumpSize * dy, result.y - this.jumpSize * dx));
		intersectPt.push(this.getOnLinePointAtDist(result.x, l2p2.x, result.y, l2p2.y));

		// add others id here since here is the actual bridge!
		if (eState.oldIntersectIds != null)
		{
			eState.oldIntersectIds[otherId] = true;
		}
		else
		{
			eState.oldIntersectIds = {otherId: true};
		}
	};

	mxConnector.prototype.scalePoint = function (point, scale)
	{
		return {
			x: point.x / scale,
			y: point.y / scale
		};
	};

	//TODO Add curves support for curve edges (paintCurvedLine) for curve intersecting another curve
	var mxConnectorPaintLine = mxConnector.prototype.paintLine;

	mxConnector.prototype.paintLine = function (canvas, pts, rounded)
	{
		this.jumpSize = parseInt(mxUtils.getValue(this.style, 'jumpSize', this.defaultJumpSize));
		var jumpStyle = mxUtils.getValue(this.style, 'jumpStyle', 'none');

		if (this.outline || jumpStyle === 'none')
		{
			mxConnectorPaintLine.apply(this, arguments);
		}
		else
		{
			var arcSize = mxUtils.getValue(this.style, mxConstants.STYLE_ARCSIZE, mxConstants.LINE_ARCSIZE) / 2;
			canvas.begin();

			var ptsCln = pts;
			var state = this.state;
			var graph = state.view.graph;

			// during DnD we can save the extra calculations
			var model = graph.getModel();
			var noRedraw = state.redrawEdge;
			ptsCln = [];

			if (state.oldIntersectIds)
			{
				for (var id in state.oldIntersectIds)
				{
					var c = model.getCell(id);

					if (c != null)
					{
						var eState = graph.view.getState(c);

						if (eState != null && eState.style != null)
						{
							eState.redrawEdge = true;
							eState.shape.redraw();
						}
					}
				}
				
				delete state.oldIntersectIds;
			}

			// for each pair find the intersection
			for (var i = 0; i < pts.length - 1; i++)
			{
				var l2p1 = pts[i];
				var l2p2 = pts[i + 1];
				ptsCln.push(l2p1);
				var intersectPt = [];

				for (var id in model.cells)
				{
					var edge = model.cells[id];

					if (edge.isEdge() && edge != state.cell)
					{
						var eState = graph.view.getState(edge);

						if (eState != null && eState.absolutePoints != null)
						{
							var eScale = eState.view.scale;

							if (eState.style == null || eState.style[mxConstants.STYLE_CURVED] != 1) //line edge
							{
								for (var j = 0; j < eState.absolutePoints.length - 1; j++)
								{
									var l1p1 = eState.absolutePoints[j];
									var l1p2 = eState.absolutePoints[j + 1];
									//the absolute points of current edge is scaled before calling this function, so we have to scale others to get correct intersections
									var result = this.checkLineIntersection(this.scalePoint(l1p1, eScale), this.scalePoint(l1p2, eScale), l2p1, l2p2);

									if (result != null)
									{
										var getEdgeOrder = function (edge1, edge2)
										{
											var p1 = edge1.getParent();
											var p2 = edge2.getParent();

											if (p1 == p2)
											{
												return p1.getIndex(edge1) - p1.getIndex(edge2); //+ve edge1 on top, -ve edge2 on top
											}
											else
											{
												return 0; //not the same parent, so we cannot determine
											}
										};

										if (getEdgeOrder(state.cell, eState.cell) > 0) //instead of reordering, get the order and the top edge has the bridge
										{
											this.addBridgePoints(intersectPt, result, l2p1, l2p2, state.cell.id, eState);
										}
										else if (!noRedraw)
										{
											eState.redrawEdge = true;
											eState.shape.redraw();
										}
									}
								}
							}
							else // curve edge (guad Bezier)
							{
								// We'll not check edge order here as always line will have bridges as it is better than curve bridges
								var ePts = eState.absolutePoints;
								var pt = this.scalePoint(ePts[0], eScale);
								var n = ePts.length;

								var allPts = [];

								for (var k = 1; k < n - 2; k++)
								{
									var p0 = this.scalePoint(ePts[k], eScale);
									var p1 = this.scalePoint(ePts[k + 1], eScale);
									
									var ip = {
										x: (p0.x + p1.x) / 2,
										y: (p0.y + p1.y) / 2
									};

									allPts.push.apply(allPts, this.calcQLintersects(pt, p0, ip, l2p1, l2p2));

									pt = ip;
								}

								var p0 = this.scalePoint(ePts[n - 2], eScale);
								var p1 = this.scalePoint(ePts[n - 1], eScale);

								allPts.push.apply(allPts, this.calcQLintersects(pt, p0, p1, l2p1, l2p2));

								if (allPts.length > 0)
								{
									for (var o = 0; o < allPts.length; o++)
									{
										this.addBridgePoints(intersectPt, allPts[o], l2p1, l2p2, state.cell.id, eState);
									}
								}
							}
						}
					}
				}

				if (intersectPt.length > 0)
				{
					// sort points and then add them
					intersectPt.sort(function (p1, p2)
					{
						var dx1 = p1.x - l2p1.x;
						var dy1 = p1.y - l2p1.y;
						var d1 = dx1 * dx1 + dy1 * dy1;

						var dx2 = p2.x - l2p1.x;
						var dy2 = p2.y - l2p1.y;
						var d2 = dx2 * dx2 + dy2 * dy2;

						return d1 - d2;
					});

					ptsCln.push(intersectPt[0]);
					this.addPoints(canvas, ptsCln, rounded, arcSize, false);
					ptsCln = [intersectPt[intersectPt.length - 1]];
					
					if (jumpStyle !== 'gap')
					{
						this.addPoints(canvas, intersectPt, jumpStyle !== 'square', arcSize, false);
					}
				}

				ptsCln.push(l2p2);
			}

			if (noRedraw)
			{
				state.redrawEdge = false;
			}

			this.addPoints(canvas, ptsCln, rounded, arcSize, false);
			canvas.stroke();
		}
	};
})();
