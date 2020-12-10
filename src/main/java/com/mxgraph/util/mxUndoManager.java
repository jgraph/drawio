/**
 * Copyright (c) 2007-2010, Gaudenz Alder, David Benson
 */
package com.mxgraph.util;

import java.util.ArrayList;
import java.util.List;

/**
 * Implements an undo history.
 * 
 * This class fires the following events:
 * 
 * mxEvent.CLEAR fires after clear was executed. The event has no properties.
 * 
 * mxEvent.UNDO fires afer a significant edit was undone in undo. The
 * <code>edit</code> property contains the mxUndoableEdit that was undone.
 * 
 * mxEvent.REDO fires afer a significant edit was redone in redo. The
 * <code>edit</code> property contains the mxUndoableEdit that was redone.
 * 
 * mxEvent.ADD fires after an undoable edit was added to the history. The
 * <code>edit</code> property contains the mxUndoableEdit that was added.
 */
public class mxUndoManager extends mxEventSource
{

	/**
	 * Maximum command history size. 0 means unlimited history. Default is 100.
	 */
	protected int size;

	/**
	 * List that contains the steps of the command history.
	 */
	protected List<mxUndoableEdit> history;

	/**
	 * Index of the element to be added next.
	 */
	protected int indexOfNextAdd;

	/**
	 * Constructs a new undo manager with a default history size.
	 */
	public mxUndoManager()
	{
		this(100);
	}

	/**
	 * Constructs a new undo manager for the specified size.
	 */
	public mxUndoManager(int size)
	{
		this.size = size;
		clear();
	}

	/**
	 * 
	 */
	public boolean isEmpty()
	{
		return history.isEmpty();
	}

	/**
	 * Clears the command history.
	 */
	public void clear()
	{
		history = new ArrayList<mxUndoableEdit>(size);
		indexOfNextAdd = 0;
		fireEvent(new mxEventObject(mxEvent.CLEAR));
	}

	/**
	 * Returns true if an undo is possible.
	 */
	public boolean canUndo()
	{
		return indexOfNextAdd > 0;
	}

	/**
	 * Undoes the last change.
	 */
	public void undo()
	{
		while (indexOfNextAdd > 0)
		{
			mxUndoableEdit edit = history.get(--indexOfNextAdd);
			edit.undo();

			if (edit.isSignificant())
			{
				fireEvent(new mxEventObject(mxEvent.UNDO, "edit", edit));
				break;
			}
		}
	}

	/**
	 * Returns true if a redo is possible.
	 */
	public boolean canRedo()
	{
		return indexOfNextAdd < history.size();
	}

	/**
	 * Redoes the last change.
	 */
	public void redo()
	{
		int n = history.size();

		while (indexOfNextAdd < n)
		{
			mxUndoableEdit edit = history.get(indexOfNextAdd++);
			edit.redo();

			if (edit.isSignificant())
			{
				fireEvent(new mxEventObject(mxEvent.REDO, "edit", edit));
				break;
			}
		}
	}

	/**
	 * Method to be called to add new undoable edits to the history.
	 */
	public void undoableEditHappened(mxUndoableEdit undoableEdit)
	{
		trim();

		if (size > 0 && size == history.size())
		{
			history.remove(0);
		}

		history.add(undoableEdit);
		indexOfNextAdd = history.size();
		fireEvent(new mxEventObject(mxEvent.ADD, "edit", undoableEdit));
	}

	/**
	 * Removes all pending steps after indexOfNextAdd from the history,
	 * invoking die on each edit. This is called from undoableEditHappened.
	 */
	protected void trim()
	{
		while (history.size() > indexOfNextAdd)
		{
			mxUndoableEdit edit = history
					.remove(indexOfNextAdd);
			edit.die();
		}
	}

}
