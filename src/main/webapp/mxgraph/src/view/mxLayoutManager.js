/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: mxLayoutManager
 * 
 * Implements a layout manager that runs a given layout after any changes to the graph:
 * 
 * Example:
 * 
 * (code)
 * var layoutMgr = new mxLayoutManager(graph);
 * layoutMgr.getLayout = function(cell, eventName)
 * {
 *   return layout;
 * };
 * (end)
 * 
 * See <getLayout> for a description of the possible eventNames.
 * 
 * Event: mxEvent.LAYOUT_CELLS
 * 
 * Fires between begin- and endUpdate after all cells have been layouted in
 * <layoutCells>. The <code>cells</code> property contains all cells that have
 * been passed to <layoutCells>.
 * 
 * Constructor: mxLayoutManager
 *
 * Constructs a new automatic layout for the given graph.
 *
 * Arguments:
 * 
 * graph - Reference to the enclosing graph. 
 */
function mxLayoutManager(graph)
{
	// Executes the layout before the changes are dispatched
	this.undoHandler = mxUtils.bind(this, function(sender, evt)
	{
		if (this.isEnabled())
		{
			this.beforeUndo(evt.getProperty('edit'));
		}
	});
	
	// Notifies the layout of a move operation inside a parent
	this.moveHandler = mxUtils.bind(this, function(sender, evt)
	{
		if (this.isEnabled())
		{
			this.cellsMoved(evt.getProperty('cells'), evt.getProperty('event'));
		}
	});
		
	// Notifies the layout of a move operation inside a parent
	this.resizeHandler = mxUtils.bind(this, function(sender, evt)
	{
		if (this.isEnabled())
		{
			this.cellsResized(evt.getProperty('cells'), evt.getProperty('bounds'),
				evt.getProperty('previous'));
		}
	});
	
	this.setGraph(graph);
};

/**
 * Extends mxEventSource.
 */
mxLayoutManager.prototype = new mxEventSource();
mxLayoutManager.prototype.constructor = mxLayoutManager;

/**
 * Variable: graph
 * 
 * Reference to the enclosing <mxGraph>.
 */
mxLayoutManager.prototype.graph = null;

/**
 * Variable: bubbling
 * 
 * Specifies if the layout should bubble along
 * the cell hierarchy. Default is true.
 */
mxLayoutManager.prototype.bubbling = true;

/**
 * Variable: enabled
 * 
 * Specifies if event handling is enabled. Default is true.
 */
mxLayoutManager.prototype.enabled = true;

/**
 * Variable: undoHandler
 * 
 * Holds the function that handles the endUpdate event.
 */
mxLayoutManager.prototype.undoHandler = null;

/**
 * Variable: moveHandler
 * 
 * Holds the function that handles the move event.
 */
mxLayoutManager.prototype.moveHandler = null;

/**
 * Variable: resizeHandler
 * 
 * Holds the function that handles the resize event.
 */
mxLayoutManager.prototype.resizeHandler = null;

/**
 * Function: isEnabled
 * 
 * Returns true if events are handled. This implementation
 * returns <enabled>.
 */
mxLayoutManager.prototype.isEnabled = function()
{
	return this.enabled;
};

/**
 * Function: setEnabled
 * 
 * Enables or disables event handling. This implementation
 * updates <enabled>.
 * 
 * Parameters:
 * 
 * enabled - Boolean that specifies the new enabled state.
 */
mxLayoutManager.prototype.setEnabled = function(enabled)
{
	this.enabled = enabled;
};

/**
 * Function: isBubbling
 * 
 * Returns true if a layout should bubble, that is, if the parent layout
 * should be executed whenever a cell layout (layout of the children of
 * a cell) has been executed. This implementation returns <bubbling>.
 */
mxLayoutManager.prototype.isBubbling = function()
{
	return this.bubbling;
};

/**
 * Function: setBubbling
 * 
 * Sets <bubbling>.
 */
mxLayoutManager.prototype.setBubbling = function(value)
{
	this.bubbling = value;
};

/**
 * Function: getGraph
 * 
 * Returns the graph that this layout operates on.
 */
mxLayoutManager.prototype.getGraph = function()
{
	return this.graph;
};

/**
 * Function: setGraph
 * 
 * Sets the graph that the layouts operate on.
 */
mxLayoutManager.prototype.setGraph = function(graph)
{
	if (this.graph != null)
	{
		var model = this.graph.getModel();		
		model.removeListener(this.undoHandler);
		this.graph.removeListener(this.moveHandler);
		this.graph.removeListener(this.resizeHandler);
	}
	
	this.graph = graph;
	
	if (this.graph != null)
	{
		var model = this.graph.getModel();	
		model.addListener(mxEvent.BEFORE_UNDO, this.undoHandler);
		this.graph.addListener(mxEvent.MOVE_CELLS, this.moveHandler);
		this.graph.addListener(mxEvent.RESIZE_CELLS, this.resizeHandler);
	}
};

/**
 * Function: hasLayout
 * 
 * Returns true if the given cell has a layout. This implementation invokes
 * <getLayout> with <mxEvent.LAYOUT_CELLS> as the eventName. Override this
 * if creating layouts in <getLayout> is expensive and return true if
 * <getLayout> will return a layout for the given cell for
 * <mxEvent.BEGIN_UPDATE> or <mxEvent.END_UPDATE>.
 */
mxLayoutManager.prototype.hasLayout = function(cell)
{
	return this.getLayout(cell, mxEvent.LAYOUT_CELLS) != null;
};

/**
 * Function: getLayout
 * 
 * Returns the layout for the given cell and eventName. Possible
 * event names are <mxEvent.MOVE_CELLS> and <mxEvent.RESIZE_CELLS>
 * when cells are moved or resized and <mxEvent.BEGIN_UPDATE> or
 * <mxEvent.END_UPDATE> for the bottom up and top down phases after
 * changes to the graph model. <mxEvent.LAYOUT_CELLS> is used to
 * check if a layout exists for the given cell. This is called
 * from <hasLayout>.
 */
mxLayoutManager.prototype.getLayout = function(cell, eventName)
{
	return null;
};

/**
 * Function: beforeUndo
 * 
 * Called from <undoHandler>.
 *
 * Parameters:
 * 
 * cell - Array of <mxCells> that have been moved.
 * evt - Mouse event that represents the mousedown.
 */
mxLayoutManager.prototype.beforeUndo = function(undoableEdit)
{
	this.executeLayoutForCells(this.getCellsForChanges(undoableEdit.changes));
};

/**
 * Function: cellsMoved
 * 
 * Called from <moveHandler>.
 *
 * Parameters:
 * 
 * cell - Array of <mxCells> that have been moved.
 * evt - Mouse event that represents the mousedown.
 */
mxLayoutManager.prototype.cellsMoved = function(cells, evt)
{
	if (cells != null && evt != null)
	{
		var point = mxUtils.convertPoint(this.getGraph().container,
			mxEvent.getClientX(evt), mxEvent.getClientY(evt));
		var model = this.getGraph().getModel();
		
		for (var i = 0; i < cells.length; i++)
		{
			var layout = this.getLayout(model.getParent(cells[i]), mxEvent.MOVE_CELLS);

			if (layout != null)
			{
				layout.moveCell(cells[i], point.x, point.y);
			}
		}
	}
};

/**
 * Function: cellsResized
 * 
 * Called from <resizeHandler>.
 *
 * Parameters:
 * 
 * cell - Array of <mxCells> that have been resized.
 * bounds - <mxRectangle> taht represents the new bounds.
 */
mxLayoutManager.prototype.cellsResized = function(cells, bounds, prev)
{
	if (cells != null && bounds != null)
	{
		var model = this.getGraph().getModel();
		
		for (var i = 0; i < cells.length; i++)
		{
			var layout = this.getLayout(model.getParent(cells[i]), mxEvent.RESIZE_CELLS);

			if (layout != null)
			{
				layout.resizeCell(cells[i], bounds[i], prev[i]);
			}
		}
	}
};

/**
 * Function: getCellsForChanges
 * 
 * Returns the cells for which a layout should be executed.
 */
mxLayoutManager.prototype.getCellsForChanges = function(changes)
{
	var result = [];
	
	for (var i = 0; i < changes.length; i++)
	{
		var change = changes[i];
		
		if (change instanceof mxRootChange)
		{
			return [];
		}
		else
		{
			result = result.concat(this.getCellsForChange(change));
		}
	}
	
	return result;
};

/**
 * Function: getCellsForChange
 * 
 * Executes all layouts which have been scheduled during the
 * changes.
 */
mxLayoutManager.prototype.getCellsForChange = function(change)
{
	if (change instanceof mxChildChange)
	{
		return this.addCellsWithLayout(change.child,
			this.addCellsWithLayout(change.previous));
	}
	else if (change instanceof mxValueChange ||
		change instanceof mxTerminalChange ||
		change instanceof mxGeometryChange ||
		change instanceof mxVisibleChange ||
		change instanceof mxStyleChange)
	{
		return this.addCellsWithLayout(change.cell);
	}
	
	return [];
};

/**
 * Function: addCellsWithLayout
 * 
 * Adds all ancestors of the given cell that have a layout.
 */
mxLayoutManager.prototype.addCellsWithLayout = function(cell, result)
{
	return this.addDescendantsWithLayout(cell,
		this.addAncestorsWithLayout(cell, result));
};

/**
 * Function: addAncestorsWithLayout
 * 
 * Adds all ancestors of the given cell that have a layout.
 */
mxLayoutManager.prototype.addAncestorsWithLayout = function(cell, result)
{
	result = (result != null) ? result : [];
	
	if (cell != null)
	{
		if (this.hasLayout(cell))
		{
			result.push(cell);
		}
		
		if (this.isBubbling())
		{
			var model = this.getGraph().getModel();
			this.addAncestorsWithLayout(
				model.getParent(cell), result);
		}
	}
	
	return result;
};

/**
 * Function: addDescendantsWithLayout
 * 
 * Adds all descendants of the given cell that have a layout.
 */
mxLayoutManager.prototype.addDescendantsWithLayout = function(cell, result)
{
	result = (result != null) ? result : [];
	
	if (cell != null && this.hasLayout(cell))
	{
		var model = this.getGraph().getModel();
		
		for (var i = 0; i < model.getChildCount(cell); i++)
		{
			var child = model.getChildAt(cell, i);
			
			if (this.hasLayout(child))
			{
				result.push(child);
				this.addDescendantsWithLayout(child, result);
			}
		}
	}
	
	return result;
};

/**
 * Function: executeLayoutForCells
 * 
 * Executes all layouts for the given cells in two phases: In the first phase
 * layouts for child cells are executed before layouts for parent cells with
 * <mxEvent.BEGIN_UPDATE>, in the second phase layouts for parent cells are
 * executed before layouts for child cells with <mxEvent.END_UPDATE>.
 */
mxLayoutManager.prototype.executeLayoutForCells = function(cells)
{
	var model = this.getGraph().getModel();
	
	model.beginUpdate();
	try 
	{
		var sorted = mxUtils.sortCells(cells, false);
		this.layoutCells(sorted, true);
		this.layoutCells(sorted.reverse(), false);
	}
	finally
	{
		model.endUpdate();
	}
};

/**
 * Function: layoutCells
 * 
 * Executes all layouts which have been scheduled during the changes.
 */
mxLayoutManager.prototype.layoutCells = function(cells, bubble)
{
	if (cells.length > 0)
	{
		// Invokes the layouts while removing duplicates
		var model = this.getGraph().getModel();
		
		model.beginUpdate();
		try 
		{
			var last = null;
			
			for (var i = 0; i < cells.length; i++)
			{
				if (cells[i] != model.getRoot() && cells[i] != last)
				{
					this.executeLayout(cells[i], bubble);
					last = cells[i];
				}
			}
			
			this.fireEvent(new mxEventObject(mxEvent.LAYOUT_CELLS, 'cells', cells));
		}
		finally
		{
			model.endUpdate();
		}
	}
};

/**
 * Function: executeLayout
 * 
 * Executes the given layout on the given parent.
 */
mxLayoutManager.prototype.executeLayout = function(cell, bubble)
{
	var layout = this.getLayout(cell, (bubble) ?
		mxEvent.BEGIN_UPDATE : mxEvent.END_UPDATE);

	if (layout != null)
	{
		layout.execute(cell);
	}
};

/**
 * Function: destroy
 * 
 * Removes all handlers from the <graph> and deletes the reference to it.
 */
mxLayoutManager.prototype.destroy = function()
{
	this.setGraph(null);
};
