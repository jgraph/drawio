/**
 * Copyright (c) 2007, Gaudenz Alder
 */
package com.mxgraph.model;

import com.mxgraph.util.mxEventSource.mxIEventListener;
import com.mxgraph.util.mxUndoableEdit.mxUndoableChange;

/**
 * Defines the requirements for a graph model to be used with mxGraph.
 */
public interface mxIGraphModel
{

	/**
	 * Defines the interface for an atomic change of the graph model.
	 */
	public abstract class mxAtomicGraphModelChange implements mxUndoableChange
	{
		/**
		 * Holds the model where the change happened.
		 */
		protected mxIGraphModel model;

		/**
		 * Constructs an empty atomic graph model change.
		 */
		public mxAtomicGraphModelChange()
		{
			this(null);
		}

		/**
		 * Constructs an atomic graph model change for the given model.
		 */
		public mxAtomicGraphModelChange(mxIGraphModel model)
		{
			this.model = model;
		}

		/**
		 * Returns the model where the change happened.
		 */
		public mxIGraphModel getModel()
		{
			return model;
		}

		/**
		 * Sets the model where the change is to be carried out.
		 */
		public void setModel(mxIGraphModel model)
		{
			this.model = model;
		}

		/**
		 * Executes the change on the model.
		 */
		public abstract void execute();

	}

	/**
	 * Returns the root of the model or the topmost parent of the given cell.
	 * 
	 * @return Returns the root cell.
	 */
	Object getRoot();

	/**
	 * Sets the root of the model and resets all structures.
	 * 
	 * @param root Cell that specifies the new root.
	 */
	Object setRoot(Object root);

	/**
	 * Returns an array of clones for the given array of cells.
	 * Depending on the value of includeChildren, a deep clone is created for
	 * each cell. Connections are restored based if the corresponding
	 * cell is contained in the passed in array.
	 * 
	 * @param cells Array of cells to be cloned.
	 * @param includeChildren Boolean indicating if the cells should be cloned
	 * with all descendants.
	 * @return Returns a cloned array of cells.
	 */
	Object[] cloneCells(Object[] cells, boolean includeChildren);

	/**
	 * Returns true if the given parent is an ancestor of the given child.
	 * 
	 * @param parent Cell that specifies the parent.
	 * @param child Cell that specifies the child.
	 * @return Returns true if child is an ancestor of parent.
	 */
	boolean isAncestor(Object parent, Object child);

	/**
	 * Returns true if the model contains the given cell.
	 * 
	 * @param cell Cell to be checked.
	 * @return Returns true if the cell is in the model.
	 */
	boolean contains(Object cell);

	/**
	 * Returns the parent of the given cell.
	 *
	 * @param child Cell whose parent should be returned.
	 * @return Returns the parent of the given cell.
	 */
	Object getParent(Object child);

	/**
	 * Adds the specified child to the parent at the given index. If no index
	 * is specified then the child is appended to the parent's array of
	 * children.
	 * 
	 * @param parent Cell that specifies the parent to contain the child.
	 * @param child Cell that specifies the child to be inserted.
	 * @param index Integer that specifies the index of the child.
	 * @return Returns the inserted child.
	 */
	Object add(Object parent, Object child, int index);

	/**
	 * Removes the specified cell from the model. This operation will remove
	 * the cell and all of its children from the model.
	 * 
	 * @param cell Cell that should be removed.
	 * @return Returns the removed cell.
	 */
	Object remove(Object cell);

	/**
	 * Returns the number of children in the given cell.
	 *
	 * @param cell Cell whose number of children should be returned.
	 * @return Returns the number of children in the given cell.
	 */
	int getChildCount(Object cell);

	/**
	 * Returns the child of the given parent at the given index.
	 * 
	 * @param parent Cell that represents the parent.
	 * @param index Integer that specifies the index of the child to be
	 * returned.
	 * @return Returns the child at index in parent.
	 */
	Object getChildAt(Object parent, int index);

	/**
	 * Returns the source or target terminal of the given edge depending on the
	 * value of the boolean parameter.
	 * 
	 * @param edge Cell that specifies the edge.
	 * @param isSource Boolean indicating which end of the edge should be
	 * returned.
	 * @return Returns the source or target of the given edge.
	 */
	Object getTerminal(Object edge, boolean isSource);

	/**
	 * Sets the source or target terminal of the given edge using.
	 * 
	 * @param edge Cell that specifies the edge.
	 * @param terminal Cell that specifies the new terminal.
	 * @param isSource Boolean indicating if the terminal is the new source or
	 * target terminal of the edge.
	 * @return Returns the new terminal.
	 */
	Object setTerminal(Object edge, Object terminal, boolean isSource);

	/**
	 * Returns the number of distinct edges connected to the given cell.
	 * 
	 * @param cell Cell that represents the vertex.
	 * @return Returns the number of edges connected to cell.
	 */
	int getEdgeCount(Object cell);

	/**
	 * Returns the edge of cell at the given index.
	 * 
	 * @param cell Cell that specifies the vertex.
	 * @param index Integer that specifies the index of the edge to return.
	 * @return Returns the edge at the given index.
	 */
	Object getEdgeAt(Object cell, int index);

	/**
	 * Returns true if the given cell is a vertex.
	 * 
	 * @param cell Cell that represents the possible vertex.
	 * @return Returns true if the given cell is a vertex.
	 */
	boolean isVertex(Object cell);

	/**
	 * Returns true if the given cell is an edge.
	 * 
	 * @param cell Cell that represents the possible edge.
	 * @return Returns true if the given cell is an edge.
	 */
	boolean isEdge(Object cell);

	/**
	 * Returns true if the given cell is connectable.
	 * 
	 * @param cell Cell whose connectable state should be returned.
	 * @return Returns the connectable state of the given cell.
	 */
	boolean isConnectable(Object cell);

	/**
	 * Returns the user object of the given cell.
	 * 
	 * @param cell Cell whose user object should be returned.
	 * @return Returns the user object of the given cell.
	 */
	Object getValue(Object cell);

	/**
	 * Sets the user object of then given cell.
	 * 
	 * @param cell Cell whose user object should be changed.
	 * @param value Object that defines the new user object.
	 * @return Returns the new value.
	 */
	Object setValue(Object cell, Object value);

	/**
	 * Returns the geometry of the given cell.
	 * 
	 * @param cell Cell whose geometry should be returned.
	 * @return Returns the geometry of the given cell.
	 */
	mxGeometry getGeometry(Object cell);

	/**
	 * Sets the geometry of the given cell.
	 * 
	 * @param cell Cell whose geometry should be changed.
	 * @param geometry Object that defines the new geometry.
	 * @return Returns the new geometry.
	 */
	mxGeometry setGeometry(Object cell, mxGeometry geometry);

	/**
	 * Returns the style of the given cell.
	 * 
	 * @param cell Cell whose style should be returned.
	 * @return Returns the style of the given cell.
	 */
	String getStyle(Object cell);

	/**
	 * Sets the style of the given cell.
	 * 
	 * @param cell Cell whose style should be changed.
	 * @param style String of the form stylename[;key=value] to specify
	 * the new cell style.
	 * @return Returns the new style.
	 */
	String setStyle(Object cell, String style);

	/**
	 * Returns true if the given cell is collapsed.
	 * 
	 * @param cell Cell whose collapsed state should be returned.
	 * @return Returns the collapsed state of the given cell.
	 */
	boolean isCollapsed(Object cell);

	/**
	 * Sets the collapsed state of the given cell.
	 * 
	 * @param cell Cell whose collapsed state should be changed.
	 * @param collapsed Boolean that specifies the new collpased state.
	 * @return Returns the new collapsed state.
	 */
	boolean setCollapsed(Object cell, boolean collapsed);

	/**
	 * Returns true if the given cell is visible.
	 * 
	 * @param cell Cell whose visible state should be returned.
	 * @return Returns the visible state of the given cell.
	 */
	boolean isVisible(Object cell);

	/**
	 * Sets the visible state of the given cell.
	 * 
	 * @param cell Cell whose visible state should be changed.
	 * @param visible Boolean that specifies the new visible state.
	 * @return Returns the new visible state.
	 */
	boolean setVisible(Object cell, boolean visible);

	/**
	 * Increments the updateLevel by one. The event notification is queued
	 * until updateLevel reaches 0 by use of endUpdate.
	 */
	void beginUpdate();

	/**
	 * Decrements the updateLevel by one and fires a notification event if the
	 * updateLevel reaches 0.
	 */
	void endUpdate();

	/**
	 * Binds the specified function to the given event name. If no event name
	 * is given, then the listener is registered for all events.
	 */
	void addListener(String eventName, mxIEventListener listener);

	/**
	 * Function: removeListener
	 *
	 * Removes the given listener from the list of listeners.
	 */
	void removeListener(mxIEventListener listener);

	/**
	 * Function: removeListener
	 *
	 * Removes the given listener from the list of listeners.
	 */
	void removeListener(mxIEventListener listener, String eventName);

}
