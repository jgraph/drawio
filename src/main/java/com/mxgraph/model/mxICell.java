/**
 * Copyright (c) 2007, Gaudenz Alder
 */
package com.mxgraph.model;

/**
 * Defines the requirements for a cell that can be used in an mxGraphModel.
 */
public interface mxICell
{

	/**
	 * Returns the Id of the cell as a string.
	 * 
	 * @return Returns the Id.
	 */
	String getId();

	/**
	 * Sets the Id of the cell to the given string.
	 * 
	 * @param id String that represents the new Id.
	 */
	void setId(String id);

	/**
	 * Returns the user object of the cell.
	 * 
	 * @return Returns the user object.
	 */
	Object getValue();

	/**
	 * Sets the user object of the cell.
	 * 
	 * @param value Object that represents the new value.
	 */
	void setValue(Object value);

	/**
	 * Returns the object that describes the geometry.
	 * 
	 * @return Returns the cell geometry.
	 */
	mxGeometry getGeometry();

	/**
	 * Sets the object to be used as the geometry.
	 */
	void setGeometry(mxGeometry geometry);

	/**
	 * Returns the string that describes the style.
	 * 
	 * @return Returns the cell style.
	 */
	String getStyle();

	/**
	 * Sets the string to be used as the style.
	 */
	void setStyle(String style);

	/**
	 * Returns true if the cell is a vertex.
	 * 
	 * @return Returns true if the cell is a vertex.
	 */
	boolean isVertex();

	/**
	 * Returns true if the cell is an edge.
	 * 
	 * @return Returns true if the cell is an edge.
	 */
	boolean isEdge();

	/**
	 * Returns true if the cell is connectable.
	 * 
	 * @return Returns the connectable state.
	 */
	boolean isConnectable();

	/**
	 * Returns true if the cell is visibile.
	 * 
	 * @return Returns the visible state.
	 */
	boolean isVisible();

	/**
	 * Specifies if the cell is visible.
	 * 
	 * @param visible Boolean that specifies the new visible state.
	 */
	void setVisible(boolean visible);

	/**
	 * Returns true if the cell is collapsed.
	 * 
	 * @return Returns the collapsed state.
	 */
	boolean isCollapsed();

	/**
	 * Sets the collapsed state.
	 * 
	 * @param collapsed Boolean that specifies the new collapsed state.
	 */
	void setCollapsed(boolean collapsed);

	/**
	 * Returns the cell's parent.
	 * 
	 * @return Returns the parent cell.
	 */
	mxICell getParent();

	/**
	 * Sets the parent cell.
	 * 
	 * @param parent Cell that represents the new parent.
	 */
	void setParent(mxICell parent);

	/**
	 * Returns the source or target terminal.
	 * 
	 * @param source Boolean that specifies if the source terminal should be
	 * returned.
	 * @return Returns the source or target terminal.
	 */
	mxICell getTerminal(boolean source);

	/**
	 * Sets the source or target terminal and returns the new terminal.
	 * 
	 * @param terminal Cell that represents the new source or target terminal.
	 * @param isSource Boolean that specifies if the source or target terminal
	 * should be set.
	 * @return Returns the new terminal.
	 */
	mxICell setTerminal(mxICell terminal, boolean isSource);

	/**
	 * Returns the number of child cells.
	 * 
	 * @return Returns the number of children.
	 */
	int getChildCount();

	/**
	 * Returns the index of the specified child in the child array.
	 * 
	 * @param child Child whose index should be returned.
	 * @return Returns the index of the given child.
	 */
	int getIndex(mxICell child);

	/**
	 * Returns the child at the specified index.
	 * 
	 * @param index Integer that specifies the child to be returned.
	 * @return Returns the child at the given index.
	 */
	mxICell getChildAt(int index);

	/**
	 * Appends the specified child into the child array and updates the parent
	 * reference of the child. Returns the appended child.
	 * 
	 * @param child Cell to be appended to the child array.
	 * @return Returns the new child.
	 */
	mxICell insert(mxICell child);

	/**
	 * Inserts the specified child into the child array at the specified index
	 * and updates the parent reference of the child. Returns the inserted child.
	 * 
	 * @param child Cell to be inserted into the child array.
	 * @param index Integer that specifies the index at which the child should
	 * be inserted into the child array.
	 * @return Returns the new child.
	 */
	mxICell insert(mxICell child, int index);

	/**
	 * Removes the child at the specified index from the child array and
	 * returns the child that was removed. Will remove the parent reference of
	 * the child.
	 * 
	 * @param index Integer that specifies the index of the child to be
	 * removed.
	 * @return Returns the child that was removed.
	 */
	mxICell remove(int index);

	/**
	 * Removes the given child from the child array and returns it. Will remove
	 * the parent reference of the child.
	 * 
	 * @param child Cell that represents the child to be removed.
	 * @return Returns the child that was removed.
	 */
	mxICell remove(mxICell child);

	/**
	 * Removes the cell from its parent.
	 */
	void removeFromParent();

	/**
	 * Returns the number of edges in the edge array.
	 * 
	 * @return Returns the number of edges.
	 */
	int getEdgeCount();

	/**
	 * Returns the index of the specified edge in the edge array.
	 * 
	 * @param edge Cell whose index should be returned.
	 * @return Returns the index of the given edge.
	 */
	int getEdgeIndex(mxICell edge);

	/**
	 * Returns the edge at the specified index in the edge array.
	 * 
	 * @param index Integer that specifies the index of the edge to be
	 * returned.
	 * @return Returns the edge at the given index.
	 */
	mxICell getEdgeAt(int index);

	/**
	 * Inserts the specified edge into the edge array and returns the edge.
	 * Will update the respective terminal reference of the edge.
	 * 
	 * @param edge Cell to be inserted into the edge array.
	 * @param isOutgoing Boolean that specifies if the edge is outgoing.
	 * @return Returns the new edge.
	 */
	mxICell insertEdge(mxICell edge, boolean isOutgoing);

	/**
	 * Removes the specified edge from the edge array and returns the edge.
	 * Will remove the respective terminal reference from the edge.
	 * 
	 * @param edge Cell to be removed from the edge array.
	 * @param isOutgoing Boolean that specifies if the edge is outgoing.
	 * @return Returns the edge that was removed.
	 */
	mxICell removeEdge(mxICell edge, boolean isOutgoing);

	/**
	 * Removes the edge from its source or target terminal.
	 * 
	 * @param isSource Boolean that specifies if the edge should be removed
	 * from its source or target terminal.
	 */
	void removeFromTerminal(boolean isSource);

	/**
	 * Returns a clone of this cell.
	 * 
	 * @return Returns a clone of this cell.
	 */
	Object clone() throws CloneNotSupportedException;

}
