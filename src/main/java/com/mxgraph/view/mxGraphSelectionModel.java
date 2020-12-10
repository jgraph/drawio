/*
 * Copyright (c) 2001-2005, Gaudenz Alder
 * 
 * All rights reserved.
 * 
 * See LICENSE file for license details. If you are unable to locate
 * this file please contact info (at) jgraph (dot) com.
 */
package com.mxgraph.view;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

import com.mxgraph.util.mxEvent;
import com.mxgraph.util.mxEventObject;
import com.mxgraph.util.mxEventSource;
import com.mxgraph.util.mxUndoableEdit;
import com.mxgraph.util.mxUndoableEdit.mxUndoableChange;

/**
 * Implements the selection model for a graph.
 * 
 * This class fires the following events:
 * 
 * mxEvent.UNDO fires after the selection was changed in changeSelection. The
 * <code>edit</code> property contains the mxUndoableEdit which contains the
 * mxSelectionChange.
 * 
 * mxEvent.CHANGE fires after the selection changes by executing an
 * mxSelectionChange. The <code>added</code> and <code>removed</code>
 * properties contain Collections of cells that have been added to or removed
 * from the selection, respectively.
 * 
 * NOTE: Due to a historic bug that cannot be changed at this point the
 * names of the properties are "reversed".
 *  
 * To add a change listener to the graph selection model:
 * 
 * <code>
 * addListener(
 *   mxEvent.CHANGE, new mxIEventListener()
 *   {
 *     public void invoke(Object sender, mxEventObject evt)
 *     {
 *       mxGraphSelectionModel model = (mxSelectionModel) sender;
 *       Collection added = (Collection) evt.getProperty("added");
 *       Collection removed = (Collection) evt.getProperty("removed");
 *       selectionChanged(model, added, removed);
 *     }
 *   });
 * </code>
 */
public class mxGraphSelectionModel extends mxEventSource
{

	/**
	 * Reference to the enclosing graph.
	 */
	protected mxGraph graph;

	/**
	 * Specifies if only one selected item at a time is allowed.
	 * Default is false.
	 */
	protected boolean singleSelection = false;

	/**
	 * Holds the selection cells.
	 */
	protected Set<Object> cells = new LinkedHashSet<Object>();

	/**
	 * Constructs a new selection model for the specified graph.
	 * 
	 * @param graph
	 */
	public mxGraphSelectionModel(mxGraph graph)
	{
		this.graph = graph;
	}

	/**
	 * @return the singleSelection
	 */
	public boolean isSingleSelection()
	{
		return singleSelection;
	}

	/**
	 * @param singleSelection the singleSelection to set
	 */
	public void setSingleSelection(boolean singleSelection)
	{
		this.singleSelection = singleSelection;
	}

	/**
	 * Returns true if the given cell is selected.
	 * 
	 * @param cell
	 * @return Returns true if the given cell is selected.
	 */
	public boolean isSelected(Object cell)
	{
		return (cell == null) ? false : cells.contains(cell);
	}

	/**
	 * Returns true if no cells are selected.
	 */
	public boolean isEmpty()
	{
		return cells.isEmpty();
	}

	/**
	 * Returns the number of selected cells.
	 */
	public int size()
	{
		return cells.size();
	}

	/**
	 * Clears the selection.
	 */
	public void clear()
	{
		changeSelection(null, cells);
	}

	/**
	 * Returns the first selected cell.
	 */
	public Object getCell()
	{
		return (cells.isEmpty()) ? null : cells.iterator().next();
	}

	/**
	 * Returns the selection cells.
	 */
	public Object[] getCells()
	{
		return cells.toArray();
	}

	/**
	 * Clears the selection and adds the given cell to the selection.
	 */
	public void setCell(Object cell)
	{
		if (cell != null)
		{
			setCells(new Object[] { cell });
		}
		else
		{
			clear();
		}
	}

	/**
	 * Clears the selection and adds the given cells.
	 */
	public void setCells(Object[] cells)
	{
		if (cells != null)
		{
			if (singleSelection)
			{
				cells = new Object[] { getFirstSelectableCell(cells) };
			}

			List<Object> tmp = new ArrayList<Object>(cells.length);

			for (int i = 0; i < cells.length; i++)
			{
				if (graph.isCellSelectable(cells[i]))
				{
					tmp.add(cells[i]);
				}
			}

			changeSelection(tmp, this.cells);
		}
		else
		{
			clear();
		}
	}

	/**
	 * Returns the first selectable cell in the given array of cells.
	 * 
	 * @param cells Array of cells to return the first selectable cell for.
	 * @return Returns the first cell that may be selected.
	 */
	protected Object getFirstSelectableCell(Object[] cells)
	{
		if (cells != null)
		{
			for (int i = 0; i < cells.length; i++)
			{
				if (graph.isCellSelectable(cells[i]))
				{
					return cells[i];
				}
			}
		}

		return null;
	}

	/**
	 * Adds the given cell to the selection.
	 */
	public void addCell(Object cell)
	{
		if (cell != null)
		{
			addCells(new Object[] { cell });
		}
	}

	/**
	 * 
	 */
	public void addCells(Object[] cells)
	{
		if (cells != null)
		{
			Collection<Object> remove = null;

			if (singleSelection)
			{
				remove = this.cells;
				cells = new Object[] { getFirstSelectableCell(cells) };
			}

			List<Object> tmp = new ArrayList<Object>(cells.length);

			for (int i = 0; i < cells.length; i++)
			{
				if (!isSelected(cells[i]) && graph.isCellSelectable(cells[i]))
				{
					tmp.add(cells[i]);
				}
			}

			changeSelection(tmp, remove);
		}
	}

	/**
	 * Removes the given cell from the selection.
	 */
	public void removeCell(Object cell)
	{
		if (cell != null)
		{
			removeCells(new Object[] { cell });
		}
	}

	/**
	 * 
	 */
	public void removeCells(Object[] cells)
	{
		if (cells != null)
		{
			List<Object> tmp = new ArrayList<Object>(cells.length);

			for (int i = 0; i < cells.length; i++)
			{
				if (isSelected(cells[i]))
				{
					tmp.add(cells[i]);
				}
			}

			changeSelection(null, tmp);
		}
	}

	/**
	 * 
	 */
	protected void changeSelection(Collection<Object> added,
			Collection<Object> removed)
	{
		if ((added != null && !added.isEmpty())
				|| (removed != null && !removed.isEmpty()))
		{
			mxSelectionChange change = new mxSelectionChange(this, added,
					removed);
			change.execute();
			mxUndoableEdit edit = new mxUndoableEdit(this, false);
			edit.add(change);
			fireEvent(new mxEventObject(mxEvent.UNDO, "edit", edit));
		}
	}

	/**
	 * 
	 */
	protected void cellAdded(Object cell)
	{
		if (cell != null)
		{
			cells.add(cell);
		}
	}

	/**
	 * 
	 */
	protected void cellRemoved(Object cell)
	{
		if (cell != null)
		{
			cells.remove(cell);
		}
	}

	/**
	 *
	 */
	public static class mxSelectionChange implements mxUndoableChange
	{

		/**
		 * 
		 */
		protected mxGraphSelectionModel model;

		/**
		 * 
		 */
		protected Collection<Object> added, removed;

		/**
		 * 
		 * @param model
		 * @param added
		 * @param removed
		 */
		public mxSelectionChange(mxGraphSelectionModel model,
				Collection<Object> added, Collection<Object> removed)
		{
			this.model = model;
			this.added = (added != null) ? new ArrayList<Object>(added) : null;
			this.removed = (removed != null) ? new ArrayList<Object>(removed)
					: null;
		}

		/**
		 * 
		 */
		public void execute()
		{
			if (removed != null)
			{
				Iterator<Object> it = removed.iterator();

				while (it.hasNext())
				{
					model.cellRemoved(it.next());
				}
			}

			if (added != null)
			{
				Iterator<Object> it = added.iterator();

				while (it.hasNext())
				{
					model.cellAdded(it.next());
				}
			}

			Collection<Object> tmp = added;
			added = removed;
			removed = tmp;
			model.fireEvent(new mxEventObject(mxEvent.CHANGE, "added", added,
					"removed", removed));
		}

	}

}
