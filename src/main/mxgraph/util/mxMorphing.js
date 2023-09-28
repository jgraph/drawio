/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 *
 * Class: mxMorphing
 * 
 * Implements animation for morphing cells. Here is an example of
 * using this class for animating the result of a layout algorithm:
 * 
 * (code)
 * graph.getModel().beginUpdate();
 * try
 * {
 *   var circleLayout = new mxCircleLayout(graph);
 *   circleLayout.execute(graph.getDefaultParent());
 * }
 * finally
 * {
 *   var morph = new mxMorphing(graph);
 *   morph.addListener(mxEvent.DONE, function()
 *   {
 *     graph.getModel().endUpdate();
 *   });
 *   
 *   morph.startAnimation();
 * }
 * (end)
 * 
 * Constructor: mxMorphing
 * 
 * Constructs an animation.
 * 
 * Parameters:
 * 
 * graph - Reference to the enclosing <mxGraph>.
 * steps - Optional number of steps in the morphing animation. Default is 6.
 * ease - Optional easing constant for the animation. Default is 1.5.
 * delay - Optional delay between the animation steps. Passed to <mxAnimation>.
 */
function mxMorphing(graph, steps, ease, delay)
{
	mxAnimation.call(this, delay);
	this.graph = graph;
	this.steps = (steps != null) ? steps : 6;
	this.ease = (ease != null) ? ease : 1.5;
};

/**
 * Extends mxEventSource.
 */
mxMorphing.prototype = new mxAnimation();
mxMorphing.prototype.constructor = mxMorphing;

/**
 * Variable: graph
 * 
 * Specifies the delay between the animation steps. Defaul is 30ms.
 */
mxMorphing.prototype.graph = null;

/**
 * Variable: steps
 * 
 * Specifies the maximum number of steps for the morphing.
 */
mxMorphing.prototype.steps = null;

/**
 * Variable: step
 * 
 * Contains the current step.
 */
mxMorphing.prototype.step = 0;

/**
 * Variable: ease
 * 
 * Ease-off for movement towards the given vector. Larger values are
 * slower and smoother. Default is 4.
 */
mxMorphing.prototype.ease = null;

/**
 * Variable: cells
 * 
 * Optional array of cells to be animated. If this is not specified
 * then all cells are checked and animated if they have been moved
 * in the current transaction.
 */
mxMorphing.prototype.cells = null;

/**
 * Function: updateAnimation
 *
 * Animation step.
 */
mxMorphing.prototype.updateAnimation = function()
{
	mxAnimation.prototype.updateAnimation.apply(this, arguments);
	var move = new mxCellStatePreview(this.graph);

	if (this.cells != null)
	{
		// Animates the given cells individually without recursion
		for (var i = 0; i < this.cells.length; i++)
		{
			this.animateCell(this.cells[i], move, false);
		}
	}
	else
	{
		// Animates all changed cells by using recursion to find
		// the changed cells but not for the animation itself
		this.animateCell(this.graph.getModel().getRoot(), move, true);
	}
	
	this.show(move);
	
	if (move.isEmpty() || this.step++ >= this.steps)
	{
		this.stopAnimation();
	}
};

/**
 * Function: show
 *
 * Shows the changes in the given <mxCellStatePreview>.
 */
mxMorphing.prototype.show = function(move)
{
	move.show();
};

/**
 * Function: animateCell
 *
 * Animates the given cell state using <mxCellStatePreview.moveState>.
 */
mxMorphing.prototype.animateCell = function(cell, move, recurse)
{
	var state = this.graph.getView().getState(cell);
	var delta = null;

	if (state != null)
	{
		// Moves the animated state from where it will be after the model
		// change by subtracting the given delta vector from that location
		delta = this.getDelta(state);

		if (this.graph.getModel().isVertex(cell) && (delta.x != 0 || delta.y != 0))
		{
			var translate = this.graph.view.getTranslate();
			var scale = this.graph.view.getScale();
			
			delta.x += translate.x * scale;
			delta.y += translate.y * scale;
			
			move.moveState(state, -delta.x / this.ease, -delta.y / this.ease);
		}
	}
	
	if (recurse && !this.stopRecursion(state, delta))
	{
		var childCount = this.graph.getModel().getChildCount(cell);

		for (var i = 0; i < childCount; i++)
		{
			this.animateCell(this.graph.getModel().getChildAt(cell, i), move, recurse);
		}
	}
};

/**
 * Function: stopRecursion
 *
 * Returns true if the animation should not recursively find more
 * deltas for children if the given parent state has been animated.
 */
mxMorphing.prototype.stopRecursion = function(state, delta)
{
	return delta != null && (delta.x != 0 || delta.y != 0);
};

/**
 * Function: getDelta
 *
 * Returns the vector between the current rendered state and the future
 * location of the state after the display will be updated.
 */
mxMorphing.prototype.getDelta = function(state)
{
	var origin = this.getOriginForCell(state.cell);
	var translate = this.graph.getView().getTranslate();
	var scale = this.graph.getView().getScale();
	var x = state.x / scale - translate.x;
	var y = state.y / scale - translate.y;

	return new mxPoint((origin.x - x) * scale, (origin.y - y) * scale);
};

/**
 * Function: getOriginForCell
 *
 * Returns the top, left corner of the given cell. TODO: Improve performance
 * by using caching inside this method as the result per cell never changes
 * during the lifecycle of this object.
 */
mxMorphing.prototype.getOriginForCell = function(cell)
{
	var result = null;
	
	if (cell != null)
	{
		var parent = this.graph.getModel().getParent(cell);
		var geo = this.graph.getCellGeometry(cell);
		result = this.getOriginForCell(parent);
		
		// TODO: Handle offsets
		if (geo != null)
		{
			if (geo.relative)
			{
				var pgeo = this.graph.getCellGeometry(parent);
				
				if (pgeo != null)
				{
					result.x += geo.x * pgeo.width;
					result.y += geo.y * pgeo.height;
				}
			}
			else
			{
				result.x += geo.x;
				result.y += geo.y;
			}
		}
	}
	
	if (result == null)
	{
		var t = this.graph.view.getTranslate();
		result = new mxPoint(-t.x, -t.y);
	}
	
	return result;
};
