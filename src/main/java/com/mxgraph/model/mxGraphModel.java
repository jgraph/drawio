/**
 * Copyright (c) 2007, Gaudenz Alder
 */
package com.mxgraph.model;

import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashSet;
import java.util.Hashtable;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;

import com.mxgraph.util.mxEvent;
import com.mxgraph.util.mxEventObject;
import com.mxgraph.util.mxEventSource;
import com.mxgraph.util.mxPoint;
import com.mxgraph.util.mxUndoableEdit;

/**
 * Extends mxEventSource to implement a graph model. The graph model acts as
 * a wrapper around the cells which are in charge of storing the actual graph
 * datastructure. The model acts as a transactional wrapper with event
 * notification for all changes, whereas the cells contain the atomic
 * operations for updating the actual datastructure.
 * 
 * Layers:
 * 
 * The cell hierarchy in the model must have a top-level root cell which
 * contains the layers (typically one default layer), which in turn contain the
 * top-level cells of the layers. This means each cell is contained in a layer.
 * If no layers are required, then all new cells should be added to the default
 * layer.
 * 
 * Layers are useful for hiding and showing groups of cells, or for placing
 * groups of cells on top of other cells in the display. To identify a layer,
 * the <isLayer> function is used. It returns true if the parent of the given
 * cell is the root of the model.
 * 
 * This class fires the following events:
 * 
 * mxEvent.CHANGE fires when an undoable edit is dispatched. The <code>edit</code>
 * property contains the mxUndoableEdit. The <code>changes</code> property
 * contains the list of undoable changes inside the undoable edit. The changes
 * property is deprecated, please use edit.getChanges() instead.
 * 
 * mxEvent.EXECUTE fires between begin- and endUpdate and after an atomic
 * change was executed in the model. The <code>change</code> property contains
 * the atomic change that was executed.
 * 
 * mxEvent.BEGIN_UPDATE fires after the updateLevel was incremented in
 * beginUpdate. This event contains no properties.
 * 
 * mxEvent.END_UPDATE fires after the updateLevel was decreased in endUpdate
 * but before any notification or change dispatching. The <code>edit</code>
 * property contains the current mxUndoableEdit.
 * 
 * mxEvent.BEFORE_UNDO fires before the change is dispatched after the update
 * level has reached 0 in endUpdate. The <code>edit</code> property contains
 * the current mxUndoableEdit.
 * 
 * mxEvent.UNDO fires after the change was dispatched in endUpdate. The
 * <code>edit</code> property contains the current mxUndoableEdit.
 */
public class mxGraphModel extends mxEventSource implements mxIGraphModel,
		Serializable
{

	private static final Logger log = Logger.getLogger(mxGraphModel.class.getName());

	/**
	 * Holds the root cell, which in turn contains the cells that represent the
	 * layers of the diagram as child cells. That is, the actual element of the
	 * diagram are supposed to live in the third generation of cells and below.
	 */
	protected mxICell root;

	/**
	 * Maps from Ids to cells.
	 */
	protected Map<String, Object> cells;

	/**
	 * Specifies if edges should automatically be moved into the nearest common
	 * ancestor of their terminals. Default is true.
	 */
	protected boolean maintainEdgeParent = true;

	/**
	 * Specifies if the model should automatically create Ids for new cells.
	 * Default is true.
	 */
	protected boolean createIds = true;

	/**
	 * Specifies the next Id to be created. Initial value is 0.
	 */
	protected int nextId = 0;

	/**
	 * Holds the changes for the current transaction. If the transaction is
	 * closed then a new object is created for this variable using
	 * createUndoableEdit.
	 */
	protected transient mxUndoableEdit currentEdit;

	/**
	 * Counter for the depth of nested transactions. Each call to beginUpdate
	 * increments this counter and each call to endUpdate decrements it. When
	 * the counter reaches 0, the transaction is closed and the respective
	 * events are fired. Initial value is 0.
	 */
	protected transient int updateLevel = 0;

	/**
	 * 
	 */
	protected transient boolean endingUpdate = false;

	/**
	 * Constructs a new empty graph model.
	 */
	public mxGraphModel()
	{
		this(null);
	}

	/**
	 * Constructs a new graph model. If no root is specified
	 * then a new root mxCell with a default layer is created.
	 * 
	 * @param root Cell that represents the root cell.
	 */
	public mxGraphModel(Object root)
	{
		currentEdit = createUndoableEdit();

		if (root != null)
		{
			setRoot(root);
		}
		else
		{
			clear();
		}
	}

	/**
	 * Sets a new root using createRoot.
	 */
	public void clear()
	{
		setRoot(createRoot());
	}

	/**
	 * 
	 */
	public int getUpdateLevel()
	{
		return updateLevel;
	}

	/**
	 * Creates a new root cell with a default layer (child 0).
	 */
	public Object createRoot()
	{
		mxCell root = new mxCell();
		root.insert(new mxCell());

		return root;
	}

	/**
	 * Returns the internal lookup table that is used to map from Ids to cells.
	 */
	public Map<String, Object> getCells()
	{
		return cells;
	}

	/**
	 * Returns the cell for the specified Id or null if no cell can be
	 * found for the given Id.
	 * 
	 * @param id A string representing the Id of the cell.
	 * @return Returns the cell for the given Id.
	 */
	public Object getCell(String id)
	{
		Object result = null;

		if (cells != null)
		{
			result = cells.get(id);
		}
		return result;
	}

	/**
	 * Returns true if the model automatically update parents of edges so that
	 * the edge is contained in the nearest-common-ancestor of its terminals.
	 * 
	 * @return Returns true if the model maintains edge parents.
	 */
	public boolean isMaintainEdgeParent()
	{
		return maintainEdgeParent;
	}

	/**
	 * Specifies if the model automatically updates parents of edges so that
	 * the edge is contained in the nearest-common-ancestor of its terminals.
	 * 
	 * @param maintainEdgeParent Boolean indicating if the model should
	 * maintain edge parents.
	 */
	public void setMaintainEdgeParent(boolean maintainEdgeParent)
	{
		this.maintainEdgeParent = maintainEdgeParent;
	}

	/**
	 * Returns true if the model automatically creates Ids and resolves Id
	 * collisions.
	 * 
	 * @return Returns true if the model creates Ids.
	 */
	public boolean isCreateIds()
	{
		return createIds;
	}

	/**
	 * Specifies if the model automatically creates Ids for new cells and
	 * resolves Id collisions.
	 * 
	 * @param value Boolean indicating if the model should created Ids.
	 */
	public void setCreateIds(boolean value)
	{
		createIds = value;
	}

	/* (non-Javadoc)
	 * @see com.mxgraph.model.mxIGraphModel#getRoot()
	 */
	public Object getRoot()
	{
		return root;
	}

	/* (non-Javadoc)
	 * @see com.mxgraph.model.mxIGraphModel#setRoot(Object)
	 */
	public Object setRoot(Object root)
	{
		execute(new mxRootChange(this, root));

		return root;
	}

	/**
	 * Inner callback to change the root of the model and update the internal
	 * datastructures, such as cells and nextId. Returns the previous root.
	 */
	protected Object rootChanged(Object root)
	{
		Object oldRoot = this.root;
		this.root = (mxICell) root;

		// Resets counters and datastructures
		nextId = 0;
		cells = null;
		cellAdded(root);

		return oldRoot;
	}

	/**
	 * Creates a new undoable edit.
	 */
	protected mxUndoableEdit createUndoableEdit()
	{
		return new mxUndoableEdit(this)
		{
			public void dispatch()
			{
				// LATER: Remove changes property (deprecated)
				((mxGraphModel) source).fireEvent(new mxEventObject(
						mxEvent.CHANGE, "edit", this, "changes", changes));
			}
		};
	}

	/* (non-Javadoc)
	 * @see com.mxgraph.model.mxIGraphModel#cloneCells(Object[], boolean)
	 */
	public Object[] cloneCells(Object[] cells, boolean includeChildren)
	{
		Map<Object, Object> mapping = new Hashtable<Object, Object>();
		Object[] clones = new Object[cells.length];

		for (int i = 0; i < cells.length; i++)
		{
			try
			{
				clones[i] = cloneCell(cells[i], mapping, includeChildren);
			}
			catch (CloneNotSupportedException e)
			{
				log.log(Level.SEVERE, "Failed to clone cells", e);
			}
		}

		for (int i = 0; i < cells.length; i++)
		{
			restoreClone(clones[i], cells[i], mapping);
		}

		return clones;
	}

	/**
	 * Inner helper method for cloning cells recursively.
	 */
	protected Object cloneCell(Object cell, Map<Object, Object> mapping,
			boolean includeChildren) throws CloneNotSupportedException
	{
		if (cell instanceof mxICell)
		{
			mxICell mxc = (mxICell) mapping.get(cell);
			
			if (mxc == null)
			{			
				mxc = (mxICell) ((mxICell) cell).clone();
				mapping.put(cell, mxc);
	
				if (includeChildren)
				{
					int childCount = getChildCount(cell);
	
					for (int i = 0; i < childCount; i++)
					{
						Object clone = cloneCell(getChildAt(cell, i), mapping, true);
						mxc.insert((mxICell) clone);
					}
				}
			}
			
			return mxc;
		}

		return null;
	}

	/**
	 * Inner helper method for restoring the connections in
	 * a network of cloned cells.
	 */
	protected void restoreClone(Object clone, Object cell,
			Map<Object, Object> mapping)
	{
		if (clone instanceof mxICell)
		{
			mxICell mxc = (mxICell) clone;
			Object source = getTerminal(cell, true);

			if (source instanceof mxICell)
			{
				mxICell tmp = (mxICell) mapping.get(source);

				if (tmp != null)
				{
					tmp.insertEdge(mxc, true);
				}
			}

			Object target = getTerminal(cell, false);

			if (target instanceof mxICell)
			{
				mxICell tmp = (mxICell) mapping.get(target);

				if (tmp != null)
				{
					tmp.insertEdge(mxc, false);
				}
			}
		}

		int childCount = getChildCount(clone);

		for (int i = 0; i < childCount; i++)
		{
			restoreClone(getChildAt(clone, i), getChildAt(cell, i), mapping);
		}
	}

	/* (non-Javadoc)
	 * @see com.mxgraph.model.mxIGraphModel#isAncestor(Object, Object)
	 */
	public boolean isAncestor(Object parent, Object child)
	{
		while (child != null && child != parent)
		{
			child = getParent(child);
		}

		return child == parent;
	}

	/* (non-Javadoc)
	 * @see com.mxgraph.model.mxIGraphModel#contains(Object)
	 */
	public boolean contains(Object cell)
	{
		return isAncestor(getRoot(), cell);
	}

	/* (non-Javadoc)
	 * @see com.mxgraph.model.mxIGraphModel#getParent(Object)
	 */
	public Object getParent(Object child)
	{
		return (child instanceof mxICell) ? ((mxICell) child).getParent()
				: null;
	}

	/* (non-Javadoc)
	 * @see com.mxgraph.model.mxIGraphModel#add(Object, Object, int)
	 */
	public Object add(Object parent, Object child, int index)
	{
		if (child != parent && parent != null && child != null)
		{
			boolean parentChanged = parent != getParent(child);
			execute(new mxChildChange(this, parent, child, index));

			// Maintains the edges parents by moving the edges
			// into the nearest common ancestor of its
			// terminals
			if (maintainEdgeParent && parentChanged)
			{
				updateEdgeParents(child);
			}
		}

		return child;
	}

	/**
	 * Invoked after a cell has been added to a parent. This recursively
	 * creates an Id for the new cell and/or resolves Id collisions.
	 * 
	 * @param cell Cell that has been added.
	 */
	protected void cellAdded(Object cell)
	{
		if (cell instanceof mxICell)
		{
			mxICell mxc = (mxICell) cell;

			if (mxc.getId() == null && isCreateIds())
			{
				mxc.setId(createId(cell));
			}

			if (mxc.getId() != null)
			{
				Object collision = getCell(mxc.getId());

				if (collision != cell)
				{
					while (collision != null)
					{
						mxc.setId(createId(cell));
						collision = getCell(mxc.getId());
					}

					if (cells == null)
					{
						cells = new Hashtable<String, Object>();
					}

					cells.put(mxc.getId(), cell);
				}
			}

			// Makes sure IDs of deleted cells are not reused
			try
			{
				int id = Integer.parseInt(mxc.getId());
				nextId = Math.max(nextId, id + 1);
			}
			catch (NumberFormatException e)
			{
				// most likely this just means a custom cell id and that it's
				// not a simple number - should be safe to skip
				log.log(Level.FINEST, "Failed to parse cell id", e);
			}

			int childCount = mxc.getChildCount();

			for (int i = 0; i < childCount; i++)
			{
				cellAdded(mxc.getChildAt(i));
			}
		}
	}

	/**
	 * Creates a new Id for the given cell and increments the global counter
	 * for creating new Ids.
	 * 
	 * @param cell Cell for which a new Id should be created.
	 * @return Returns a new Id for the given cell.
	 */
	public String createId(Object cell)
	{
		String id = String.valueOf(nextId);
		nextId++;

		return id;
	}

	/* (non-Javadoc)
	 * @see com.mxgraph.model.mxIGraphModel#remove(Object)
	 */
	public Object remove(Object cell)
	{
		if (cell == root)
		{
			setRoot(null);
		}
		else if (getParent(cell) != null)
		{
			execute(new mxChildChange(this, null, cell));
		}

		return cell;
	}

	/**
	 * Invoked after a cell has been removed from the model. This recursively
	 * removes the cell from its terminals and removes the mapping from the Id
	 * to the cell.
	 * 
	 * @param cell Cell that has been removed.
	 */
	protected void cellRemoved(Object cell)
	{
		if (cell instanceof mxICell)
		{
			mxICell mxc = (mxICell) cell;
			int childCount = mxc.getChildCount();

			for (int i = 0; i < childCount; i++)
			{
				cellRemoved(mxc.getChildAt(i));
			}

			if (cells != null && mxc.getId() != null)
			{
				cells.remove(mxc.getId());
			}
		}
	}

	/**
	 * Inner callback to update the parent of a cell using mxCell.insert
	 * on the parent and return the previous parent.
	 */
	protected Object parentForCellChanged(Object cell, Object parent, int index)
	{
		mxICell child = (mxICell) cell;
		mxICell previous = (mxICell) getParent(cell);

		if (parent != null)
		{
			if (parent != previous || previous.getIndex(child) != index)
			{
				((mxICell) parent).insert(child, index);
			}
		}
		else if (previous != null)
		{
			int oldIndex = previous.getIndex(child);
			previous.remove(oldIndex);
		}

		// Checks if the previous parent was already in the
		// model and avoids calling cellAdded if it was.
		if (!contains(previous) && parent != null)
		{
			cellAdded(cell);
		}
		else if (parent == null)
		{
			cellRemoved(cell);
		}

		return previous;
	}

	/* (non-Javadoc)
	 * @see com.mxgraph.model.mxIGraphModel#getChildCount(Object)
	 */
	public int getChildCount(Object cell)
	{
		return (cell instanceof mxICell) ? ((mxICell) cell).getChildCount() : 0;
	}

	/* (non-Javadoc)
	 * @see com.mxgraph.model.mxIGraphModel#getChildAt(Object, int)
	 */
	public Object getChildAt(Object parent, int index)
	{
		return (parent instanceof mxICell) ? ((mxICell) parent)
				.getChildAt(index) : null;
	}

	/* (non-Javadoc)
	 * @see com.mxgraph.model.mxIGraphModel#getTerminal(Object, boolean)
	 */
	public Object getTerminal(Object edge, boolean isSource)
	{
		return (edge instanceof mxICell) ? ((mxICell) edge)
				.getTerminal(isSource) : null;
	}

	/* (non-Javadoc)
	 * @see com.mxgraph.model.mxIGraphModel#setTerminal(Object, Object, boolean)
	 */
	public Object setTerminal(Object edge, Object terminal, boolean isSource)
	{
		boolean terminalChanged = terminal != getTerminal(edge, isSource);
		execute(new mxTerminalChange(this, edge, terminal, isSource));

		if (maintainEdgeParent && terminalChanged)
		{
			updateEdgeParent(edge, getRoot());
		}

		return terminal;
	}

	/**
	 * Inner helper function to update the terminal of the edge using
	 * mxCell.insertEdge and return the previous terminal.
	 */
	protected Object terminalForCellChanged(Object edge, Object terminal,
			boolean isSource)
	{
		mxICell previous = (mxICell) getTerminal(edge, isSource);

		if (terminal != null)
		{
			((mxICell) terminal).insertEdge((mxICell) edge, isSource);
		}
		else if (previous != null)
		{
			previous.removeEdge((mxICell) edge, isSource);
		}

		return previous;
	}

	/**
	 * Updates the parents of the edges connected to the given cell and all its
	 * descendants so that each edge is contained in the nearest common
	 * ancestor.
	 * 
	 * @param cell Cell whose edges should be checked and updated.
	 */
	public void updateEdgeParents(Object cell)
	{
		updateEdgeParents(cell, getRoot());
	}

	/**
	 * Updates the parents of the edges connected to the given cell and all its
	 * descendants so that the edge is contained in the nearest-common-ancestor.
	 * 
	 * @param cell Cell whose edges should be checked and updated.
	 * @param root Root of the cell hierarchy that contains all cells.
	 */
	public void updateEdgeParents(Object cell, Object root)
	{
		// Updates edges on children first
		int childCount = getChildCount(cell);

		for (int i = 0; i < childCount; i++)
		{
			Object child = getChildAt(cell, i);
			updateEdgeParents(child, root);
		}

		// Updates the parents of all connected edges
		int edgeCount = getEdgeCount(cell);
		List<Object> edges = new ArrayList<Object>(edgeCount);

		for (int i = 0; i < edgeCount; i++)
		{
			edges.add(getEdgeAt(cell, i));
		}

		Iterator<Object> it = edges.iterator();

		while (it.hasNext())
		{
			Object edge = it.next();

			// Updates edge parent if edge and child have
			// a common root node (does not need to be the
			// model root node)
			if (isAncestor(root, edge))
			{
				updateEdgeParent(edge, root);
			}
		}
	}

	/**
	 * Inner helper method to update the parent of the specified edge to the
	 * nearest-common-ancestor of its two terminals.
	 *
	 * @param edge Specifies the edge to be updated.
	 * @param root Current root of the model.
	 */
	public void updateEdgeParent(Object edge, Object root)
	{
		Object source = getTerminal(edge, true);
		Object target = getTerminal(edge, false);
		Object cell = null;
		
		// Uses the first non-relative descendants of the source terminal
		while (source != null && !isEdge(source) &&
			getGeometry(source) != null && getGeometry(source).isRelative())
		{
			source = getParent(source);
		}
		
		// Uses the first non-relative descendants of the target terminal
		while (target != null && !isEdge(target) &&
			getGeometry(target) != null && getGeometry(target).isRelative())
		{
			target = getParent(target);
		}
		
		if (isAncestor(root, source) && isAncestor(root, target))
		{
			if (source == target)
			{
				cell = getParent(source);
			}
			else
			{
				cell = getNearestCommonAncestor(source, target);
			}

			// Keeps the edge in the same layer
			if (cell != null
					&& (getParent(cell) != root || isAncestor(cell, edge))
					&& getParent(edge) != cell)
			{
				mxGeometry geo = getGeometry(edge);

				if (geo != null)
				{
					mxPoint origin1 = getOrigin(getParent(edge));
					mxPoint origin2 = getOrigin(cell);

					double dx = origin2.getX() - origin1.getX();
					double dy = origin2.getY() - origin1.getY();

					geo = (mxGeometry) geo.clone();
					geo.translate(-dx, -dy);
					setGeometry(edge, geo);
				}

				add(cell, edge, getChildCount(cell));
			}
		}
	}

	/**
	 * Returns the absolute, accumulated origin for the children inside the
	 * given parent. 
	 */
	public mxPoint getOrigin(Object cell)
	{
		mxPoint result = null;

		if (cell != null)
		{
			result = getOrigin(getParent(cell));

			if (!isEdge(cell))
			{
				mxGeometry geo = getGeometry(cell);

				if (geo != null)
				{
					result.setX(result.getX() + geo.getX());
					result.setY(result.getY() + geo.getY());
				}
			}
		}
		else
		{
			result = new mxPoint();
		}

		return result;
	}

	/**
	 * Returns the nearest common ancestor for the specified cells.
	 *
	 * @param cell1 Cell that specifies the first cell in the tree.
	 * @param cell2 Cell that specifies the second cell in the tree.
	 * @return Returns the nearest common ancestor of the given cells.
	 */
	public Object getNearestCommonAncestor(Object cell1, Object cell2)
	{
		if (cell1 != null && cell2 != null)
		{
			// Creates the cell path for the second cell
			String path = mxCellPath.create((mxICell) cell2);

			if (path != null && path.length() > 0)
			{
				// Bubbles through the ancestors of the first
				// cell to find the nearest common ancestor.
				Object cell = cell1;
				String current = mxCellPath.create((mxICell) cell);

				while (cell != null)
				{
					Object parent = getParent(cell);

					// Checks if the cell path is equal to the beginning
					// of the given cell path
					if (path.indexOf(current + mxCellPath.PATH_SEPARATOR) == 0
							&& parent != null)
					{
						return cell;
					}

					current = mxCellPath.getParentPath(current);
					cell = parent;
				}
			}
		}

		return null;
	}

	/* (non-Javadoc)
	 * @see com.mxgraph.model.mxIGraphModel#getEdgeCount(Object)
	 */
	public int getEdgeCount(Object cell)
	{
		return (cell instanceof mxICell) ? ((mxICell) cell).getEdgeCount() : 0;
	}

	/* (non-Javadoc)
	 * @see com.mxgraph.model.mxIGraphModel#getEdgeAt(Object, int)
	 */
	public Object getEdgeAt(Object parent, int index)
	{
		return (parent instanceof mxICell) ? ((mxICell) parent)
				.getEdgeAt(index) : null;
	}

	/* (non-Javadoc)
	 * @see com.mxgraph.model.mxIGraphModel#isVertex(Object)
	 */
	public boolean isVertex(Object cell)
	{
		return (cell instanceof mxICell) ? ((mxICell) cell).isVertex() : false;
	}

	/* (non-Javadoc)
	 * @see com.mxgraph.model.mxIGraphModel#isEdge(Object)
	 */
	public boolean isEdge(Object cell)
	{
		return (cell instanceof mxICell) ? ((mxICell) cell).isEdge() : false;
	}

	/* (non-Javadoc)
	 * @see com.mxgraph.model.mxIGraphModel#isConnectable(Object)
	 */
	public boolean isConnectable(Object cell)
	{
		return (cell instanceof mxICell) ? ((mxICell) cell).isConnectable()
				: true;
	}

	/* (non-Javadoc)
	 * @see com.mxgraph.model.mxIGraphModel#getValue(Object)
	 */
	public Object getValue(Object cell)
	{
		return (cell instanceof mxICell) ? ((mxICell) cell).getValue() : null;
	}

	/* (non-Javadoc)
	 * @see com.mxgraph.model.mxIGraphModel#setValue(Object, Object)
	 */
	public Object setValue(Object cell, Object value)
	{
		execute(new mxValueChange(this, cell, value));

		return value;
	}

	/**
	 * Inner callback to update the user object of the given mxCell
	 * using mxCell.setValue and return the previous value,
	 * that is, the return value of mxCell.getValue.
	 */
	protected Object valueForCellChanged(Object cell, Object value)
	{
		Object oldValue = ((mxICell) cell).getValue();
		((mxICell) cell).setValue(value);

		return oldValue;
	}

	/* (non-Javadoc)
	 * @see com.mxgraph.model.mxIGraphModel#getGeometry(Object)
	 */
	public mxGeometry getGeometry(Object cell)
	{
		return (cell instanceof mxICell) ? ((mxICell) cell).getGeometry()
				: null;
	}

	/* (non-Javadoc)
	 * @see com.mxgraph.model.mxIGraphModel#setGeometry(Object, mxGeometry)
	 */
	public mxGeometry setGeometry(Object cell, mxGeometry geometry)
	{
		if (geometry != getGeometry(cell))
		{
			execute(new mxGeometryChange(this, cell, geometry));
		}

		return geometry;
	}

	/**
	 * Inner callback to update the mxGeometry of the given mxCell using
	 * mxCell.setGeometry and return the previous mxGeometry.
	 */
	protected mxGeometry geometryForCellChanged(Object cell, mxGeometry geometry)
	{
		mxGeometry previous = getGeometry(cell);
		((mxICell) cell).setGeometry(geometry);

		return previous;
	}

	/* (non-Javadoc)
	 * @see com.mxgraph.model.mxIGraphModel#getStyle(Object)
	 */
	public String getStyle(Object cell)
	{
		return (cell instanceof mxICell) ? ((mxICell) cell).getStyle() : null;
	}

	/* (non-Javadoc)
	 * @see com.mxgraph.model.mxIGraphModel#setStyle(Object, String)
	 */
	public String setStyle(Object cell, String style)
	{
		if (style == null || !style.equals(getStyle(cell)))
		{
			execute(new mxStyleChange(this, cell, style));
		}

		return style;
	}

	/**
	 * Inner callback to update the style of the given mxCell
	 * using mxCell.setStyle and return the previous style.
	 */
	protected String styleForCellChanged(Object cell, String style)
	{
		String previous = getStyle(cell);
		((mxICell) cell).setStyle(style);

		return previous;
	}

	/* (non-Javadoc)
	 * @see com.mxgraph.model.mxIGraphModel#isCollapsed(Object)
	 */
	public boolean isCollapsed(Object cell)
	{
		return (cell instanceof mxICell) ? ((mxICell) cell).isCollapsed()
				: false;
	}

	/* (non-Javadoc)
	 * @see com.mxgraph.model.mxIGraphModel#setCollapsed(Object, boolean)
	 */
	public boolean setCollapsed(Object cell, boolean collapsed)
	{
		if (collapsed != isCollapsed(cell))
		{
			execute(new mxCollapseChange(this, cell, collapsed));
		}

		return collapsed;
	}

	/**
	 * Inner callback to update the collapsed state of the
	 * given mxCell using mxCell.setCollapsed and return
	 * the previous collapsed state.
	 */
	protected boolean collapsedStateForCellChanged(Object cell,
			boolean collapsed)
	{
		boolean previous = isCollapsed(cell);
		((mxICell) cell).setCollapsed(collapsed);

		return previous;
	}

	/* (non-Javadoc)
	 * @see com.mxgraph.model.mxIGraphModel#isVisible(Object)
	 */
	public boolean isVisible(Object cell)
	{
		return (cell instanceof mxICell) ? ((mxICell) cell).isVisible() : false;
	}

	/* (non-Javadoc)
	 * @see com.mxgraph.model.mxIGraphModel#setVisible(Object, boolean)
	 */
	public boolean setVisible(Object cell, boolean visible)
	{
		if (visible != isVisible(cell))
		{
			execute(new mxVisibleChange(this, cell, visible));
		}

		return visible;
	}

	/**
	 * Sets the visible state of the given mxCell using mxVisibleChange and
	 * adds the change to the current transaction.
	 */
	protected boolean visibleStateForCellChanged(Object cell, boolean visible)
	{
		boolean previous = isVisible(cell);
		((mxICell) cell).setVisible(visible);

		return previous;
	}

	/**
	 * Executes the given atomic change and adds it to the current edit.
	 * 
	 * @param change Atomic change to be executed.
	 */
	public void execute(mxAtomicGraphModelChange change)
	{
		change.execute();
		beginUpdate();
		currentEdit.add(change);
		fireEvent(new mxEventObject(mxEvent.EXECUTE, "change", change));
		endUpdate();
	}

	/* (non-Javadoc)
	 * @see com.mxgraph.model.mxIGraphModel#beginUpdate()
	 */
	public void beginUpdate()
	{
		updateLevel++;
		fireEvent(new mxEventObject(mxEvent.BEGIN_UPDATE));
	}

	/* (non-Javadoc)
	 * @see com.mxgraph.model.mxIGraphModel#endUpdate()
	 */
	public void endUpdate()
	{
		updateLevel--;

		if (!endingUpdate)
		{
			endingUpdate = updateLevel == 0;
			fireEvent(new mxEventObject(mxEvent.END_UPDATE, "edit", currentEdit));

			try
			{
				if (endingUpdate && !currentEdit.isEmpty())
				{
					fireEvent(new mxEventObject(mxEvent.BEFORE_UNDO, "edit",
							currentEdit));
					mxUndoableEdit tmp = currentEdit;
					currentEdit = createUndoableEdit();
					tmp.dispatch();
					fireEvent(new mxEventObject(mxEvent.UNDO, "edit", tmp));
				}
			}
			finally
			{
				endingUpdate = false;
			}
		}
	}

	/**
	 * Merges the children of the given cell into the given target cell inside
	 * this model. All cells are cloned unless there is a corresponding cell in
	 * the model with the same id, in which case the source cell is ignored and
	 * all edges are connected to the corresponding cell in this model. Edges
	 * are considered to have no identity and are always cloned unless the
	 * cloneAllEdges flag is set to false, in which case edges with the same
	 * id in the target model are reconnected to reflect the terminals of the
	 * source edges.
	 * 
	 * @param from
	 * @param to
	 * @param cloneAllEdges
	 */
	public void mergeChildren(mxICell from, mxICell to, boolean cloneAllEdges)
			throws CloneNotSupportedException
	{
		beginUpdate();
		try
		{
			Hashtable<Object, Object> mapping = new Hashtable<Object, Object>();
			mergeChildrenImpl(from, to, cloneAllEdges, mapping);

			// Post-processes all edges in the mapping and
			// reconnects the terminals to the corresponding
			// cells in the target model
			Iterator<Object> it = mapping.keySet().iterator();

			while (it.hasNext())
			{
				Object edge = it.next();
				Object cell = mapping.get(edge);
				Object terminal = getTerminal(edge, true);

				if (terminal != null)
				{
					terminal = mapping.get(terminal);
					setTerminal(cell, terminal, true);
				}

				terminal = getTerminal(edge, false);

				if (terminal != null)
				{
					terminal = mapping.get(terminal);
					setTerminal(cell, terminal, false);
				}
			}
		}
		finally
		{
			endUpdate();
		}
	}

	/**
	 * Clones the children of the source cell into the given target cell in
	 * this model and adds an entry to the mapping that maps from the source
	 * cell to the target cell with the same id or the clone of the source cell
	 * that was inserted into this model.
	 */
	protected void mergeChildrenImpl(mxICell from, mxICell to,
			boolean cloneAllEdges, Hashtable<Object, Object> mapping)
			throws CloneNotSupportedException
	{
		beginUpdate();
		try
		{
			int childCount = from.getChildCount();

			for (int i = 0; i < childCount; i++)
			{
				mxICell cell = from.getChildAt(i);
				String id = cell.getId();
				mxICell target = (mxICell) ((id != null && (!isEdge(cell) || !cloneAllEdges)) ? getCell(id)
						: null);

				// Clones and adds the child if no cell exists for the id
				if (target == null)
				{
					mxCell clone = (mxCell) cell.clone();
					clone.setId(id);

					// Do *NOT* use model.add as this will move the edge away
					// from the parent in updateEdgeParent if maintainEdgeParent
					// is enabled in the target model
					target = to.insert(clone);
					cellAdded(target);
				}

				// Stores the mapping for later reconnecting edges
				mapping.put(cell, target);

				// Recurses
				mergeChildrenImpl(cell, target, cloneAllEdges, mapping);
			}
		}
		finally
		{
			endUpdate();
		}
	}

	/**
	 * Initializes the currentEdit field if the model is deserialized.
	 */
	private void readObject(ObjectInputStream ois) throws IOException,
			ClassNotFoundException
	{
		ois.defaultReadObject();
		currentEdit = createUndoableEdit();
	}

	/**
	 * Returns the number of incoming or outgoing edges.
	 * 
	 * @param model Graph model that contains the connection data.
	 * @param cell Cell whose edges should be counted.
	 * @param outgoing Boolean that specifies if the number of outgoing or
	 * incoming edges should be returned.
	 * @return Returns the number of incoming or outgoing edges.
	 */
	public static int getDirectedEdgeCount(mxIGraphModel model, Object cell,
			boolean outgoing)
	{
		return getDirectedEdgeCount(model, cell, outgoing, null);
	}

	/**
	 * Returns the number of incoming or outgoing edges, ignoring the given
	 * edge.
	 *
	 * @param model Graph model that contains the connection data.
	 * @param cell Cell whose edges should be counted.
	 * @param outgoing Boolean that specifies if the number of outgoing or
	 * incoming edges should be returned.
	 * @param ignoredEdge Object that represents an edge to be ignored.
	 * @return Returns the number of incoming or outgoing edges.
	 */
	public static int getDirectedEdgeCount(mxIGraphModel model, Object cell,
			boolean outgoing, Object ignoredEdge)
	{
		int count = 0;
		int edgeCount = model.getEdgeCount(cell);

		for (int i = 0; i < edgeCount; i++)
		{
			Object edge = model.getEdgeAt(cell, i);

			if (edge != ignoredEdge
					&& model.getTerminal(edge, outgoing) == cell)
			{
				count++;
			}
		}

		return count;
	}

	/**
	 * Returns all edges connected to this cell including loops.
	 *
	 * @param model Model that contains the connection information.
	 * @param cell Cell whose connections should be returned.
	 * @return Returns the array of connected edges for the given cell.
	 */
	public static Object[] getEdges(mxIGraphModel model, Object cell)
	{
		return getEdges(model, cell, true, true, true);
	}

	/**
	 * Returns all edges connected to this cell without loops.
	 *
	 * @param model Model that contains the connection information.
	 * @param cell Cell whose connections should be returned.
	 * @return Returns the connected edges for the given cell.
	 */
	public static Object[] getConnections(mxIGraphModel model, Object cell)
	{
		return getEdges(model, cell, true, true, false);
	}

	/**
	 * Returns the incoming edges of the given cell without loops.
	 * 
	 * @param model Graphmodel that contains the edges.
	 * @param cell Cell whose incoming edges should be returned.
	 * @return Returns the incoming edges for the given cell.
	 */
	public static Object[] getIncomingEdges(mxIGraphModel model, Object cell)
	{
		return getEdges(model, cell, true, false, false);
	}

	/**
	 * Returns the outgoing edges of the given cell without loops.
	 * 
	 * @param model Graphmodel that contains the edges.
	 * @param cell Cell whose outgoing edges should be returned.
	 * @return Returns the outgoing edges for the given cell.
	 */
	public static Object[] getOutgoingEdges(mxIGraphModel model, Object cell)
	{
		return getEdges(model, cell, false, true, false);
	}

	/**
	 * Returns all distinct edges connected to this cell.
	 *
	 * @param model Model that contains the connection information.
	 * @param cell Cell whose connections should be returned.
	 * @param incoming Specifies if incoming edges should be returned.
	 * @param outgoing Specifies if outgoing edges should be returned.
	 * @param includeLoops Specifies if loops should be returned.
	 * @return Returns the array of connected edges for the given cell.
	 */
	public static Object[] getEdges(mxIGraphModel model, Object cell,
			boolean incoming, boolean outgoing, boolean includeLoops)
	{
		int edgeCount = model.getEdgeCount(cell);
		List<Object> result = new ArrayList<Object>(edgeCount);

		for (int i = 0; i < edgeCount; i++)
		{
			Object edge = model.getEdgeAt(cell, i);
			Object source = model.getTerminal(edge, true);
			Object target = model.getTerminal(edge, false);

			if ((includeLoops && source == target)
					|| ((source != target) && ((incoming && target == cell) || (outgoing && source == cell))))
			{
				result.add(edge);
			}
		}

		return result.toArray();
	}

	/**
	 * Returns all edges from the given source to the given target.
	 * 
	 * @param model The graph model that contains the graph.
	 * @param source Object that defines the source cell.
	 * @param target Object that defines the target cell.
	 * @return Returns all edges from source to target.
	 */
	public static Object[] getEdgesBetween(mxIGraphModel model, Object source,
			Object target)
	{
		return getEdgesBetween(model, source, target, false);
	}

	/**
	 * Returns all edges between the given source and target pair. If directed
	 * is true, then only edges from the source to the target are returned,
	 * otherwise, all edges between the two cells are returned.
	 * 
	 * @param model The graph model that contains the graph.
	 * @param source Object that defines the source cell.
	 * @param target Object that defines the target cell.
	 * @param directed Boolean that specifies if the direction of the edge
	 * should be taken into account.
	 * @return Returns all edges between the given source and target.
	 */
	public static Object[] getEdgesBetween(mxIGraphModel model, Object source,
			Object target, boolean directed)
	{
		int tmp1 = model.getEdgeCount(source);
		int tmp2 = model.getEdgeCount(target);

		// Assumes the source has less connected edges
		Object terminal = source;
		int edgeCount = tmp1;

		// Uses the smaller array of connected edges
		// for searching the edge
		if (tmp2 < tmp1)
		{
			edgeCount = tmp2;
			terminal = target;
		}

		List<Object> result = new ArrayList<Object>(edgeCount);

		// Checks if the edge is connected to the correct
		// cell and returns the first match
		for (int i = 0; i < edgeCount; i++)
		{
			Object edge = model.getEdgeAt(terminal, i);
			Object src = model.getTerminal(edge, true);
			Object trg = model.getTerminal(edge, false);
			boolean directedMatch = (src == source) && (trg == target);
			boolean oppositeMatch = (trg == source) && (src == target);

			if (directedMatch || (!directed && oppositeMatch))
			{
				result.add(edge);
			}
		}

		return result.toArray();
	}

	/**
	 * Returns all opposite cells of terminal for the given edges.
	 * 
	 * @param model Model that contains the connection information.
	 * @param edges Array of edges to be examined.
	 * @param terminal Cell that specifies the known end of the edges.
	 * @return Returns the opposite cells of the given terminal.
	 */
	public static Object[] getOpposites(mxIGraphModel model, Object[] edges,
			Object terminal)
	{
		return getOpposites(model, edges, terminal, true, true);
	}

	/**
	 * Returns all opposite vertices wrt terminal for the given edges, only
	 * returning sources and/or targets as specified. The result is returned as
	 * an array of mxCells.
	 * 
	 * @param model Model that contains the connection information.
	 * @param edges Array of edges to be examined.
	 * @param terminal Cell that specifies the known end of the edges.
	 * @param sources Boolean that specifies if source terminals should
	 * be contained in the result. Default is true.
	 * @param targets Boolean that specifies if target terminals should
	 * be contained in the result. Default is true.
	 * @return Returns the array of opposite terminals for the given edges.
	 */
	public static Object[] getOpposites(mxIGraphModel model, Object[] edges,
			Object terminal, boolean sources, boolean targets)
	{
		List<Object> terminals = new ArrayList<Object>();

		if (edges != null)
		{
			for (int i = 0; i < edges.length; i++)
			{
				Object source = model.getTerminal(edges[i], true);
				Object target = model.getTerminal(edges[i], false);

				// Checks if the terminal is the source of
				// the edge and if the target should be
				// stored in the result
				if (targets && source == terminal && target != null
						&& target != terminal)
				{
					terminals.add(target);
				}

				// Checks if the terminal is the taget of
				// the edge and if the source should be
				// stored in the result
				else if (sources && target == terminal && source != null
						&& source != terminal)
				{
					terminals.add(source);
				}
			}
		}

		return terminals.toArray();
	}

	/**
	 * Sets the source and target of the given edge in a single atomic change.
	 * 
	 * @param edge Cell that specifies the edge.
	 * @param source Cell that specifies the new source terminal.
	 * @param target Cell that specifies the new target terminal.
	 */
	public static void setTerminals(mxIGraphModel model, Object edge,
			Object source, Object target)
	{
		model.beginUpdate();
		try
		{
			model.setTerminal(edge, source, true);
			model.setTerminal(edge, target, false);
		}
		finally
		{
			model.endUpdate();
		}
	}

	/**
	 * Returns all children of the given cell regardless of their type.
	 *
	 * @param model Model that contains the hierarchical information.
	 * @param parent Cell whose child vertices or edges should be returned.
	 * @return Returns the child vertices and/or edges of the given parent.
	 */
	public static Object[] getChildren(mxIGraphModel model, Object parent)
	{
		return getChildCells(model, parent, false, false);
	}

	/**
	 * Returns the child vertices of the given parent.
	 *
	 * @param model Model that contains the hierarchical information.
	 * @param parent Cell whose child vertices should be returned.
	 * @return Returns the child vertices of the given parent.
	 */
	public static Object[] getChildVertices(mxIGraphModel model, Object parent)
	{
		return getChildCells(model, parent, true, false);
	}

	/**
	 * Returns the child edges of the given parent.
	 *
	 * @param model Model that contains the hierarchical information.
	 * @param parent Cell whose child edges should be returned.
	 * @return Returns the child edges of the given parent.
	 */
	public static Object[] getChildEdges(mxIGraphModel model, Object parent)
	{
		return getChildCells(model, parent, false, true);
	}

	/**
	 * Returns the children of the given cell that are vertices and/or edges
	 * depending on the arguments. If both arguments are false then all
	 * children are returned regardless of their type.
	 *
	 * @param model Model that contains the hierarchical information.
	 * @param parent Cell whose child vertices or edges should be returned.
	 * @param vertices Boolean indicating if child vertices should be returned.
	 * @param edges Boolean indicating if child edges should be returned.
	 * @return Returns the child vertices and/or edges of the given parent.
	 */
	public static Object[] getChildCells(mxIGraphModel model, Object parent,
			boolean vertices, boolean edges)
	{
		int childCount = model.getChildCount(parent);
		List<Object> result = new ArrayList<Object>(childCount);

		for (int i = 0; i < childCount; i++)
		{
			Object child = model.getChildAt(parent, i);

			if ((!edges && !vertices) || (edges && model.isEdge(child))
					|| (vertices && model.isVertex(child)))
			{
				result.add(child);
			}
		}

		return result.toArray();
	}

	/**
	 * 
	 */
	public static Object[] getParents(mxIGraphModel model, Object[] cells)
	{
		HashSet<Object> parents = new HashSet<Object>();

		if (cells != null)
		{
			for (int i = 0; i < cells.length; i++)
			{
				Object parent = model.getParent(cells[i]);

				if (parent != null)
				{
					parents.add(parent);
				}
			}
		}

		return parents.toArray();
	}

	/**
	 * 
	 */
	public static Object[] filterCells(Object[] cells, Filter filter)
	{
		ArrayList<Object> result = null;

		if (cells != null)
		{
			result = new ArrayList<Object>(cells.length);

			for (int i = 0; i < cells.length; i++)
			{
				if (filter.filter(cells[i]))
				{
					result.add(cells[i]);
				}
			}
		}

		return (result != null) ? result.toArray() : null;
	}

	/**
	 * Returns a all descendants of the given cell and the cell itself
	 * as a collection.
	 */
	public static Collection<Object> getDescendants(mxIGraphModel model,
			Object parent)
	{
		return filterDescendants(model, null, parent);
	}

	/**
	 * Creates a collection of cells using the visitor pattern.
	 */
	public static Collection<Object> filterDescendants(mxIGraphModel model,
			Filter filter)
	{
		return filterDescendants(model, filter, model.getRoot());
	}

	/**
	 * Creates a collection of cells using the visitor pattern.
	 */
	public static Collection<Object> filterDescendants(mxIGraphModel model,
			Filter filter, Object parent)
	{
		List<Object> result = new ArrayList<Object>();

		if (filter == null || filter.filter(parent))
		{
			result.add(parent);
		}

		int childCount = model.getChildCount(parent);

		for (int i = 0; i < childCount; i++)
		{
			Object child = model.getChildAt(parent, i);
			result.addAll(filterDescendants(model, filter, child));
		}

		return result;
	}

	/**
	 * Function: getTopmostCells
	 * 
	 * Returns the topmost cells of the hierarchy in an array that contains no
	 * desceandants for each <mxCell> that it contains. Duplicates should be
	 * removed in the cells array to improve performance.
	 * 
	 * Parameters:
	 * 
	 * cells - Array of <mxCells> whose topmost ancestors should be returned.
	 */
	public static Object[] getTopmostCells(mxIGraphModel model, Object[] cells)
	{
		Set<Object> hash = new HashSet<Object>();
		hash.addAll(Arrays.asList(cells));
		List<Object> result = new ArrayList<Object>(cells.length);

		for (int i = 0; i < cells.length; i++)
		{
			Object cell = cells[i];
			boolean topmost = true;
			Object parent = model.getParent(cell);

			while (parent != null)
			{
				if (hash.contains(parent))
				{
					topmost = false;
					break;
				}

				parent = model.getParent(parent);
			}

			if (topmost)
			{
				result.add(cell);
			}
		}

		return result.toArray();
	}
	
	@Override
	public String toString()
	{
		StringBuilder builder = new StringBuilder();
		builder.append(getClass().getSimpleName());
		builder.append(" [");
		builder.append("root=");
		builder.append(root);
		builder.append(", cells=");
		
		if (cells != null)
		{
			builder.append("<");
			builder.append(cells.size());
			builder.append(" entries>");
		}
		else
		{
			builder.append("null");
		}
		
		builder.append(", maintainEdgeParent=");
		builder.append(maintainEdgeParent);
		builder.append(", createIds=");
		builder.append(createIds);
		builder.append(", nextId=");
		builder.append(nextId);
		builder.append(", currentEdit=");
		builder.append(currentEdit);
		builder.append(", updateLevel=");
		builder.append(updateLevel);
		builder.append(", endingUpdate=");
		builder.append(endingUpdate);
		builder.append("]");
		
		return builder.toString();
	}
	
	//
	// Visitor patterns
	//

	/**
	 * 
	 */
	public static interface Filter
	{

		/**
		 * 
		 */
		boolean filter(Object cell);
	}

	//
	// Atomic changes
	//

	public static class mxRootChange extends mxAtomicGraphModelChange
	{

		/**
		 * Holds the new and previous root cell.
		 */
		protected Object root, previous;

		/**
		 * 
		 */
		public mxRootChange()
		{
			this(null, null);
		}

		/**
		 * 
		 */
		public mxRootChange(mxGraphModel model, Object root)
		{
			super(model);
			this.root = root;
			previous = root;
		}

		/**
		 * 
		 */
		public void setRoot(Object value)
		{
			root = value;
		}

		/**
		 * @return the root
		 */
		public Object getRoot()
		{
			return root;
		}

		/**
		 * 
		 */
		public void setPrevious(Object value)
		{
			previous = value;
		}

		/**
		 * @return the previous
		 */
		public Object getPrevious()
		{
			return previous;
		}

		/**
		 * Changes the root of the model.
		 */
		public void execute()
		{
			root = previous;
			previous = ((mxGraphModel) model).rootChanged(previous);
		}

	}

	public static class mxChildChange extends mxAtomicGraphModelChange
	{

		/**
		 *
		 */
		protected Object parent, previous, child;

		/**
		 * 
		 */
		protected int index, previousIndex;

		/**
		 * 
		 */
		public mxChildChange()
		{
			this(null, null, null, 0);
		}

		/**
		 * 
		 */
		public mxChildChange(mxGraphModel model, Object parent, Object child)
		{
			this(model, parent, child, 0);
		}

		/**
		 * 
		 */
		public mxChildChange(mxGraphModel model, Object parent, Object child,
				int index)
		{
			super(model);
			this.parent = parent;
			previous = this.parent;
			this.child = child;
			this.index = index;
			previousIndex = index;
		}

		/**
		 *
		 */
		public void setParent(Object value)
		{
			parent = value;
		}

		/**
		 * @return the parent
		 */
		public Object getParent()
		{
			return parent;
		}

		/**
		 *
		 */
		public void setPrevious(Object value)
		{
			previous = value;
		}

		/**
		 * @return the previous
		 */
		public Object getPrevious()
		{
			return previous;
		}

		/**
		 *
		 */
		public void setChild(Object value)
		{
			child = value;
		}

		/**
		 * @return the child
		 */
		public Object getChild()
		{
			return child;
		}

		/**
		 *
		 */
		public void setIndex(int value)
		{
			index = value;
		}

		/**
		 * @return the index
		 */
		public int getIndex()
		{
			return index;
		}

		/**
		 *
		 */
		public void setPreviousIndex(int value)
		{
			previousIndex = value;
		}

		/**
		 * @return the previousIndex
		 */
		public int getPreviousIndex()
		{
			return previousIndex;
		}

		/**
		 * Gets the source or target terminal field for the given
		 * edge even if the edge is not stored as an incoming or
		 * outgoing edge in the respective terminal.
		 */
		protected Object getTerminal(Object edge, boolean source)
		{
			return model.getTerminal(edge, source);
		}

		/**
		 * Sets the source or target terminal field for the given edge
		 * without inserting an incoming or outgoing edge in the
		 * respective terminal.
		 */
		protected void setTerminal(Object edge, Object terminal, boolean source)
		{
			((mxICell) edge).setTerminal((mxICell) terminal, source);
		}

		/**
		 * 
		 */
		protected void connect(Object cell, boolean isConnect)
		{
			Object source = getTerminal(cell, true);
			Object target = getTerminal(cell, false);

			if (source != null)
			{
				if (isConnect)
				{
					((mxGraphModel) model).terminalForCellChanged(cell, source,
							true);
				}
				else
				{
					((mxGraphModel) model).terminalForCellChanged(cell, null,
							true);
				}
			}

			if (target != null)
			{
				if (isConnect)
				{
					((mxGraphModel) model).terminalForCellChanged(cell, target,
							false);
				}
				else
				{
					((mxGraphModel) model).terminalForCellChanged(cell, null,
							false);
				}
			}

			// Stores the previous terminals in the edge
			setTerminal(cell, source, true);
			setTerminal(cell, target, false);

			int childCount = model.getChildCount(cell);

			for (int i = 0; i < childCount; i++)
			{
				connect(model.getChildAt(cell, i), isConnect);
			}
		}

		/**
		 * Returns the index of the given child inside the given parent.
		 */
		protected int getChildIndex(Object parent, Object child)
		{
			return (parent instanceof mxICell && child instanceof mxICell) ? ((mxICell) parent)
					.getIndex((mxICell) child) : 0;
		}

		/**
		 * Changes the root of the model.
		 */
		public void execute()
		{
			Object tmp = model.getParent(child);
			int tmp2 = getChildIndex(tmp, child);

			if (previous == null)
			{
				connect(child, false);
			}

			tmp = ((mxGraphModel) model).parentForCellChanged(child, previous,
					previousIndex);

			if (previous != null)
			{
				connect(child, true);
			}

			parent = previous;
			previous = tmp;
			index = previousIndex;
			previousIndex = tmp2;
		}

	}

	public static class mxTerminalChange extends mxAtomicGraphModelChange
	{

		/**
		 *
		 */
		protected Object cell, terminal, previous;

		/**
		 * 
		 */
		protected boolean source;

		/**
		 * 
		 */
		public mxTerminalChange()
		{
			this(null, null, null, false);
		}

		/**
		 * 
		 */
		public mxTerminalChange(mxGraphModel model, Object cell,
				Object terminal, boolean source)
		{
			super(model);
			this.cell = cell;
			this.terminal = terminal;
			this.previous = this.terminal;
			this.source = source;
		}

		/**
		 * 
		 */
		public void setCell(Object value)
		{
			cell = value;
		}

		/**
		 * @return the cell
		 */
		public Object getCell()
		{
			return cell;
		}

		/**
		 * 
		 */
		public void setTerminal(Object value)
		{
			terminal = value;
		}

		/**
		 * @return the terminal
		 */
		public Object getTerminal()
		{
			return terminal;
		}

		/**
		 * 
		 */
		public void setPrevious(Object value)
		{
			previous = value;
		}

		/**
		 * @return the previous
		 */
		public Object getPrevious()
		{
			return previous;
		}

		/**
		 * 
		 */
		public void setSource(boolean value)
		{
			source = value;
		}

		/**
		 * @return the isSource
		 */
		public boolean isSource()
		{
			return source;
		}

		/**
		 * Changes the root of the model.
		 */
		public void execute()
		{
			terminal = previous;
			previous = ((mxGraphModel) model).terminalForCellChanged(cell,
					previous, source);
		}

	}

	public static class mxValueChange extends mxAtomicGraphModelChange
	{

		/**
		 *
		 */
		protected Object cell, value, previous;

		/**
		 * 
		 */
		public mxValueChange()
		{
			this(null, null, null);
		}

		/**
		 * 
		 */
		public mxValueChange(mxGraphModel model, Object cell, Object value)
		{
			super(model);
			this.cell = cell;
			this.value = value;
			this.previous = this.value;
		}

		/**
		 * 
		 */
		public void setCell(Object value)
		{
			cell = value;
		}

		/**
		 * @return the cell
		 */
		public Object getCell()
		{
			return cell;
		}

		/**
		 * 
		 */
		public void setValue(Object value)
		{
			this.value = value;
		}

		/**
		 * @return the value
		 */
		public Object getValue()
		{
			return value;
		}

		/**
		 * 
		 */
		public void setPrevious(Object value)
		{
			previous = value;
		}

		/**
		 * @return the previous
		 */
		public Object getPrevious()
		{
			return previous;
		}

		/**
		 * Changes the root of the model.
		 */
		public void execute()
		{
			value = previous;
			previous = ((mxGraphModel) model).valueForCellChanged(cell,
					previous);
		}

	}

	public static class mxStyleChange extends mxAtomicGraphModelChange
	{

		/**
		 *
		 */
		protected Object cell;

		/**
		 * 
		 */
		protected String style, previous;

		/**
		 * 
		 */
		public mxStyleChange()
		{
			this(null, null, null);
		}

		/**
		 * 
		 */
		public mxStyleChange(mxGraphModel model, Object cell, String style)
		{
			super(model);
			this.cell = cell;
			this.style = style;
			this.previous = this.style;
		}

		/**
		 * 
		 */
		public void setCell(Object value)
		{
			cell = value;
		}

		/**
		 * @return the cell
		 */
		public Object getCell()
		{
			return cell;
		}

		/**
		 * 
		 */
		public void setStyle(String value)
		{
			style = value;
		}

		/**
		 * @return the style
		 */
		public String getStyle()
		{
			return style;
		}

		/**
		 * 
		 */
		public void setPrevious(String value)
		{
			previous = value;
		}

		/**
		 * @return the previous
		 */
		public String getPrevious()
		{
			return previous;
		}

		/**
		 * Changes the root of the model.
		 */
		public void execute()
		{
			style = previous;
			previous = ((mxGraphModel) model).styleForCellChanged(cell,
					previous);
		}

	}

	public static class mxGeometryChange extends mxAtomicGraphModelChange
	{

		/**
		 *
		 */
		protected Object cell;

		/**
		 * 
		 */
		protected mxGeometry geometry, previous;

		/**
		 * 
		 */
		public mxGeometryChange()
		{
			this(null, null, null);
		}

		/**
		 * 
		 */
		public mxGeometryChange(mxGraphModel model, Object cell,
				mxGeometry geometry)
		{
			super(model);
			this.cell = cell;
			this.geometry = geometry;
			this.previous = this.geometry;
		}

		/**
		 * 
		 */
		public void setCell(Object value)
		{
			cell = value;
		}

		/**
		 * @return the cell
		 */
		public Object getCell()
		{
			return cell;
		}

		/**
		 *
		 */
		public void setGeometry(mxGeometry value)
		{
			geometry = value;
		}

		/**
		 * @return the geometry
		 */
		public mxGeometry getGeometry()
		{
			return geometry;
		}

		/**
		 *
		 */
		public void setPrevious(mxGeometry value)
		{
			previous = value;
		}

		/**
		 * @return the previous
		 */
		public mxGeometry getPrevious()
		{
			return previous;
		}

		/**
		 * Changes the root of the model.
		 */
		public void execute()
		{
			geometry = previous;
			previous = ((mxGraphModel) model).geometryForCellChanged(cell,
					previous);
		}

	}

	public static class mxCollapseChange extends mxAtomicGraphModelChange
	{

		/**
		 *
		 */
		protected Object cell;

		/**
		 * 
		 */
		protected boolean collapsed, previous;

		/**
		 * 
		 */
		public mxCollapseChange()
		{
			this(null, null, false);
		}

		/**
		 * 
		 */
		public mxCollapseChange(mxGraphModel model, Object cell,
				boolean collapsed)
		{
			super(model);
			this.cell = cell;
			this.collapsed = collapsed;
			this.previous = this.collapsed;
		}

		/**
		 * 
		 */
		public void setCell(Object value)
		{
			cell = value;
		}

		/**
		 * @return the cell
		 */
		public Object getCell()
		{
			return cell;
		}

		/**
		 * 
		 */
		public void setCollapsed(boolean value)
		{
			collapsed = value;
		}

		/**
		 * @return the collapsed
		 */
		public boolean isCollapsed()
		{
			return collapsed;
		}

		/**
		 * 
		 */
		public void setPrevious(boolean value)
		{
			previous = value;
		}

		/**
		 * @return the previous
		 */
		public boolean getPrevious()
		{
			return previous;
		}

		/**
		 * Changes the root of the model.
		 */
		public void execute()
		{
			collapsed = previous;
			previous = ((mxGraphModel) model).collapsedStateForCellChanged(
					cell, previous);
		}

	}

	public static class mxVisibleChange extends mxAtomicGraphModelChange
	{

		/**
		 *
		 */
		protected Object cell;

		/**
		 * 
		 */
		protected boolean visible, previous;

		/**
		 * 
		 */
		public mxVisibleChange()
		{
			this(null, null, false);
		}

		/**
		 * 
		 */
		public mxVisibleChange(mxGraphModel model, Object cell, boolean visible)
		{
			super(model);
			this.cell = cell;
			this.visible = visible;
			this.previous = this.visible;
		}

		/**
		 * 
		 */
		public void setCell(Object value)
		{
			cell = value;
		}

		/**
		 * @return the cell
		 */
		public Object getCell()
		{
			return cell;
		}

		/**
		 * 
		 */
		public void setVisible(boolean value)
		{
			visible = value;
		}

		/**
		 * @return the visible
		 */
		public boolean isVisible()
		{
			return visible;
		}

		/**
		 * 
		 */
		public void setPrevious(boolean value)
		{
			previous = value;
		}

		/**
		 * @return the previous
		 */
		public boolean getPrevious()
		{
			return previous;
		}

		/**
		 * Changes the root of the model.
		 */
		public void execute()
		{
			visible = previous;
			previous = ((mxGraphModel) model).visibleStateForCellChanged(cell,
					previous);
		}

	}

}
