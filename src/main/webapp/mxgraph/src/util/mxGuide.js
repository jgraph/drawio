/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: mxGuide
 *
 * Implements the alignment of selection cells to other cells in the graph.
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
		var tt = this.getGuideTolerance(gridEnabled) * scale;
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

		// Moves cells to the raster if not aligned
		this.graph.snapDelta(delta, bounds, !gridEnabled, overrideX, overrideY);
		delta = this.getDelta(bounds, stateX, delta.x, stateY, delta.y)
		
		// Redraws the guides
		var c = this.graph.container;
		
		if (!overrideX && this.guideX != null)
		{
			this.guideX.node.style.visibility = 'hidden';
		}
		else if (this.guideX != null)
		{
			var minY = null;
        	var maxY = null;
        	
			if (stateX != null && bounds != null)
			{
				minY = Math.min(bounds.y + delta.y - this.graph.panDy, stateX.y);
				maxY = Math.max(bounds.y + bounds.height + delta.y - this.graph.panDy, stateX.y + stateX.height);
			}
			
			if (minY != null && maxY != null)
			{
				this.guideX.points = [new mxPoint(valueX, minY), new mxPoint(valueX, maxY)];
			}
			else
			{
				this.guideX.points = [new mxPoint(valueX, -this.graph.panDy),
					new mxPoint(valueX, c.scrollHeight - 3 - this.graph.panDy)];
			}
			
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
			var minX = null;
        	var maxX = null;
        	
			if (stateY != null && bounds != null)
			{
				minX = Math.min(bounds.x + delta.x - this.graph.panDx, stateY.x);
				maxX = Math.max(bounds.x + bounds.width + delta.x - this.graph.panDx, stateY.x + stateY.width);
			}
			
			if (minX != null && maxX != null)
			{
				this.guideY.points = [new mxPoint(minX, valueY), new mxPoint(maxX, valueY)];
			}
			else
			{
				this.guideY.points = [new mxPoint(-this.graph.panDx, valueY),
					new mxPoint(c.scrollWidth - 3 - this.graph.panDx, valueY)];
			}
			
			this.guideY.stroke = this.getGuideColor(stateY, false);
			this.guideY.node.style.visibility = 'visible';
			this.guideY.redraw();
		}
	}
	
	return delta;
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
	if (this.guideX != null)
	{
		this.guideX.node.style.visibility = (visible) ? 'visible' : 'hidden';
	}
	
	if (this.guideY != null)
	{
		this.guideY.node.style.visibility = (visible) ? 'visible' : 'hidden';
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
};
