/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: mxGraphSelectionModel
 *
 * Implements the selection model for a graph. Here is a listener that handles
 * all removed selection cells.
 * 
 * (code)
 * graph.getSelectionModel().addListener(mxEvent.CHANGE, function(sender, evt)
 * {
 *   var cells = evt.getProperty('added');
 *   
 *   for (var i = 0; i < cells.length; i++)
 *   {
 *     // Handle cells[i]...
 *   }
 * });
 * (end)
 * 
 * Event: mxEvent.UNDO
 * 
 * Fires after the selection was changed in <changeSelection>. The
 * <code>edit</code> property contains the <mxUndoableEdit> which contains the
 * <mxSelectionChange>.
 * 
 * Event: mxEvent.CHANGE
 * 
 * Fires after the selection changes by executing an <mxSelectionChange>. The
 * <code>added</code> and <code>removed</code> properties contain arrays of
 * cells that have been added to or removed from the selection, respectively.
 * The names are inverted due to historic reasons. This cannot be changed.
 * 
 * Constructor: mxGraphSelectionModel
 *
 * Constructs a new graph selection model for the given <mxGraph>.
 * 
 * Parameters:
 * 
 * graph - Reference to the enclosing <mxGraph>.
 */
function mxGraphSelectionModel(graph)
{
	this.graph = graph;
	this.cells = [];
};

/**
 * Extends mxEventSource.
 */
mxGraphSelectionModel.prototype = new mxEventSource();
mxGraphSelectionModel.prototype.constructor = mxGraphSelectionModel;

/**
 * Variable: doneResource
 * 
 * Specifies the resource key for the status message after a long operation.
 * If the resource for this key does not exist then the value is used as
 * the status message. Default is 'done'.
 */
mxGraphSelectionModel.prototype.doneResource = (mxClient.language != 'none') ? 'done' : '';

/**
 * Variable: updatingSelectionResource
 *
 * Specifies the resource key for the status message while the selection is
 * being updated. If the resource for this key does not exist then the
 * value is used as the status message. Default is 'updatingSelection'.
 */
mxGraphSelectionModel.prototype.updatingSelectionResource = (mxClient.language != 'none') ? 'updatingSelection' : '';

/**
 * Variable: graph
 * 
 * Reference to the enclosing <mxGraph>.
 */
mxGraphSelectionModel.prototype.graph = null;

/**
 * Variable: singleSelection
 *
 * Specifies if only one selected item at a time is allowed.
 * Default is false.
 */
mxGraphSelectionModel.prototype.singleSelection = false;

/**
 * Function: isSingleSelection
 *
 * Returns <singleSelection> as a boolean.
 */
mxGraphSelectionModel.prototype.isSingleSelection = function()
{
	return this.singleSelection;
};

/**
 * Function: setSingleSelection
 *
 * Sets the <singleSelection> flag.
 * 
 * Parameters:
 * 
 * singleSelection - Boolean that specifies the new value for
 * <singleSelection>.
 */
mxGraphSelectionModel.prototype.setSingleSelection = function(singleSelection)
{
	this.singleSelection = singleSelection;
};

/**
 * Function: isSelected
 *
 * Returns true if the given <mxCell> is selected.
 */
mxGraphSelectionModel.prototype.isSelected = function(cell)
{
	if (cell != null)
	{
		return mxUtils.indexOf(this.cells, cell) >= 0;
	}
	
	return false;
};

/**
 * Function: isEmpty
 *
 * Returns true if no cells are currently selected.
 */
mxGraphSelectionModel.prototype.isEmpty = function()
{
	return this.cells.length == 0;
};

/**
 * Function: clear
 *
 * Clears the selection and fires a <change> event if the selection was not
 * empty.
 */
mxGraphSelectionModel.prototype.clear = function()
{
	this.changeSelection(null, this.cells);
};

/**
 * Function: setCell
 *
 * Selects the specified <mxCell> using <setCells>.
 * 
 * Parameters:
 * 
 * cell - <mxCell> to be selected.
 */
mxGraphSelectionModel.prototype.setCell = function(cell)
{
	if (cell != null)
	{
		this.setCells([cell]);
	}
};

/**
 * Function: setCells
 *
 * Selects the given array of <mxCells> and fires a <change> event.
 * 
 * Parameters:
 * 
 * cells - Array of <mxCells> to be selected.
 */
mxGraphSelectionModel.prototype.setCells = function(cells)
{
	if (cells != null)
	{
		if (this.singleSelection)
		{
			cells = [this.getFirstSelectableCell(cells)];
		}
	
		var tmp = [];
		
		for (var i = 0; i < cells.length; i++)
		{
			if (this.graph.isCellSelectable(cells[i]))
			{
				tmp.push(cells[i]);
			}	
		}

		this.changeSelection(tmp, this.cells);
	}
};

/**
 * Function: getFirstSelectableCell
 *
 * Returns the first selectable cell in the given array of cells.
 */
mxGraphSelectionModel.prototype.getFirstSelectableCell = function(cells)
{
	if (cells != null)
	{
		for (var i = 0; i < cells.length; i++)
		{
			if (this.graph.isCellSelectable(cells[i]))
			{
				return cells[i];
			}
		}
	}
	
	return null;
};

/**
 * Function: addCell
 * 
 * Adds the given <mxCell> to the selection and fires a <select> event.
 * 
 * Parameters:
 * 
 * cell - <mxCell> to add to the selection.
 */
mxGraphSelectionModel.prototype.addCell = function(cell)
{
	if (cell != null)
	{
		this.addCells([cell]);
	}
};

/**
 * Function: addCells
 * 
 * Adds the given array of <mxCells> to the selection and fires a <select>
 * event.
 * 
 * Parameters:
 * 
 * cells - Array of <mxCells> to add to the selection.
 */
mxGraphSelectionModel.prototype.addCells = function(cells)
{
	if (cells != null)
	{
		var remove = null;
		
		if (this.singleSelection)
		{
			remove = this.cells;
			cells = [this.getFirstSelectableCell(cells)];
		}

		var tmp = [];
		
		for (var i = 0; i < cells.length; i++)
		{
			if (!this.isSelected(cells[i]) &&
				this.graph.isCellSelectable(cells[i]))
			{
				tmp.push(cells[i]);
			}	
		}

		this.changeSelection(tmp, remove);
	}
};

/**
 * Function: removeCell
 *
 * Removes the specified <mxCell> from the selection and fires a <select>
 * event for the remaining cells.
 * 
 * Parameters:
 * 
 * cell - <mxCell> to remove from the selection.
 */
mxGraphSelectionModel.prototype.removeCell = function(cell)
{
	if (cell != null)
	{
		this.removeCells([cell]);
	}
};

/**
 * Function: removeCells
 */
mxGraphSelectionModel.prototype.removeCells = function(cells)
{
	if (cells != null)
	{
		var tmp = [];
		
		for (var i = 0; i < cells.length; i++)
		{
			if (this.isSelected(cells[i]))
			{
				tmp.push(cells[i]);
			}
		}
		
		this.changeSelection(null, tmp);	
	}
};

/**
 * Function: changeSelection
 *
 * Adds/removes the specified arrays of <mxCell> to/from the selection.
 * 
 * Parameters:
 * 
 * added - Array of <mxCell> to add to the selection.
 * remove - Array of <mxCell> to remove from the selection.
 */
mxGraphSelectionModel.prototype.changeSelection = function(added, removed)
{
	if ((added != null &&
		added.length > 0 &&
		added[0] != null) ||
		(removed != null &&
		removed.length > 0 &&
		removed[0] != null))
	{
		var change = new mxSelectionChange(this, added, removed);
		change.execute();
		var edit = new mxUndoableEdit(this, false);
		edit.add(change);
		this.fireEvent(new mxEventObject(mxEvent.UNDO, 'edit', edit));
	}
};

/**
 * Function: cellAdded
 *
 * Inner callback to add the specified <mxCell> to the selection. No event
 * is fired in this implementation.
 * 
 * Paramters:
 * 
 * cell - <mxCell> to add to the selection.
 */
mxGraphSelectionModel.prototype.cellAdded = function(cell)
{
	if (cell != null &&
		!this.isSelected(cell))
	{
		this.cells.push(cell);
	}
};

/**
 * Function: cellRemoved
 *
 * Inner callback to remove the specified <mxCell> from the selection. No
 * event is fired in this implementation.
 * 
 * Parameters:
 * 
 * cell - <mxCell> to remove from the selection.
 */
mxGraphSelectionModel.prototype.cellRemoved = function(cell)
{
	if (cell != null)
	{
		var index = mxUtils.indexOf(this.cells, cell);
		
		if (index >= 0)
		{
			this.cells.splice(index, 1);
		}
	}
};

/**
 * Class: mxSelectionChange
 *
 * Action to change the current root in a view.
 *
 * Constructor: mxCurrentRootChange
 *
 * Constructs a change of the current root in the given view.
 */
function mxSelectionChange(selectionModel, added, removed)
{
	this.selectionModel = selectionModel;
	this.added = (added != null) ? added.slice() : null;
	this.removed = (removed != null) ? removed.slice() : null;
};

/**
 * Function: execute
 *
 * Changes the current root of the view.
 */
mxSelectionChange.prototype.execute = function()
{
	var t0 = mxLog.enter('mxSelectionChange.execute');
	window.status = mxResources.get(
		this.selectionModel.updatingSelectionResource) ||
		this.selectionModel.updatingSelectionResource;

	if (this.removed != null)
	{
		for (var i = 0; i < this.removed.length; i++)
		{
			this.selectionModel.cellRemoved(this.removed[i]);
		}
	}

	if (this.added != null)
	{
		for (var i = 0; i < this.added.length; i++)
		{
			this.selectionModel.cellAdded(this.added[i]);
		}
	}
	
	var tmp = this.added;
	this.added = this.removed;
	this.removed = tmp;

	window.status = mxResources.get(this.selectionModel.doneResource) ||
		this.selectionModel.doneResource;
	mxLog.leave('mxSelectionChange.execute', t0);
	
	this.selectionModel.fireEvent(new mxEventObject(mxEvent.CHANGE,
			'added', this.added, 'removed', this.removed));
};
