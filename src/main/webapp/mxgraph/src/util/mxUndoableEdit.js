/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: mxUndoableEdit
 * 
 * Implements a composite undoable edit. Here is an example for a custom change
 * which gets executed via the model:
 * 
 * (code)
 * function CustomChange(model, name)
 * {
 *   this.model = model;
 *   this.name = name;
 *   this.previous = name;
 * };
 * 
 * CustomChange.prototype.execute = function()
 * {
 *   var tmp = this.model.name;
 *   this.model.name = this.previous;
 *   this.previous = tmp;
 * };
 * 
 * var name = prompt('Enter name');
 * graph.model.execute(new CustomChange(graph.model, name));
 * (end)
 * 
 * Event: mxEvent.EXECUTED
 * 
 * Fires between START_EDIT and END_EDIT after an atomic change was executed.
 * The <code>change</code> property contains the change that was executed.
 * 
 * Event: mxEvent.START_EDIT
 * 
 * Fires before a set of changes will be executed in <undo> or <redo>.
 * This event contains no properties.
 * 
 * Event: mxEvent.END_EDIT
 *
 * Fires after a set of changeswas executed in <undo> or <redo>.
 * This event contains no properties.
 * 
 * Constructor: mxUndoableEdit
 * 
 * Constructs a new undoable edit for the given source.
 */
function mxUndoableEdit(source, significant)
{
	this.source = source;
	this.changes = [];
	this.significant = (significant != null) ? significant : true;
};

/**
 * Variable: source
 * 
 * Specifies the source of the edit.
 */
mxUndoableEdit.prototype.source = null;

/**
 * Variable: changes
 * 
 * Array that contains the changes that make up this edit. The changes are
 * expected to either have an undo and redo function, or an execute
 * function. Default is an empty array.
 */
mxUndoableEdit.prototype.changes = null;

/**
 * Variable: significant
 * 
 * Specifies if the undoable change is significant.
 * Default is true.
 */
mxUndoableEdit.prototype.significant = null;

/**
 * Variable: undone
 * 
 * Specifies if this edit has been undone. Default is false.
 */
mxUndoableEdit.prototype.undone = false;

/**
 * Variable: redone
 * 
 * Specifies if this edit has been redone. Default is false.
 */
mxUndoableEdit.prototype.redone = false;

/**
 * Function: isEmpty
 * 
 * Returns true if the this edit contains no changes.
 */
mxUndoableEdit.prototype.isEmpty = function()
{
	return this.changes.length == 0;
};

/**
 * Function: isSignificant
 * 
 * Returns <significant>.
 */
mxUndoableEdit.prototype.isSignificant = function()
{
	return this.significant;
};

/**
 * Function: add
 * 
 * Adds the specified change to this edit. The change is an object that is
 * expected to either have an undo and redo, or an execute function.
 */
mxUndoableEdit.prototype.add = function(change)
{
	this.changes.push(change);
};

/**
 * Function: notify
 * 
 * Hook to notify any listeners of the changes after an <undo> or <redo>
 * has been carried out. This implementation is empty.
 */
mxUndoableEdit.prototype.notify = function() { };

/**
 * Function: die
 * 
 * Hook to free resources after the edit has been removed from the command
 * history. This implementation is empty.
 */
mxUndoableEdit.prototype.die = function() { };

/**
 * Function: undo
 * 
 * Undoes all changes in this edit.
 */
mxUndoableEdit.prototype.undo = function()
{
	if (!this.undone)
	{
		this.source.fireEvent(new mxEventObject(mxEvent.START_EDIT));
		var count = this.changes.length;
		
		for (var i = count - 1; i >= 0; i--)
		{
			var change = this.changes[i];
			
			if (change.execute != null)
			{
				change.execute();
			}
			else if (change.undo != null)
			{
				change.undo();
			}
			
			// New global executed event
			this.source.fireEvent(new mxEventObject(mxEvent.EXECUTED, 'change', change));
		}
		
		this.undone = true;
		this.redone = false;
		this.source.fireEvent(new mxEventObject(mxEvent.END_EDIT));
	}
	
	this.notify();
};

/**
 * Function: redo
 * 
 * Redoes all changes in this edit.
 */
mxUndoableEdit.prototype.redo = function()
{
	if (!this.redone)
	{
		this.source.fireEvent(new mxEventObject(mxEvent.START_EDIT));
		var count = this.changes.length;
		
		for (var i = 0; i < count; i++)
		{
			var change = this.changes[i];
			
			if (change.execute != null)
			{
				change.execute();
			}
			else if (change.redo != null)
			{
				change.redo();
			}
			
			// New global executed event
			this.source.fireEvent(new mxEventObject(mxEvent.EXECUTED, 'change', change));
		}
		
		this.undone = false;
		this.redone = true;
		this.source.fireEvent(new mxEventObject(mxEvent.END_EDIT));
	}
	
	this.notify();
};
