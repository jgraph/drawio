/**
 * Copyright (c) 2007, Gaudenz Alder
 */
package com.mxgraph.layout;

/**
 * Defines the requirements for an object that implements a graph layout.
 */
public interface mxIGraphLayout
{

	/**
	 * Executes the layout for the children of the specified parent.
	 * 
	 * @param parent Parent cell that contains the children to be layed out.
	 */
	void execute(Object parent);

	/**
	 * Notified when a cell is being moved in a parent that has automatic
	 * layout to update the cell state (eg. index) so that the outcome of the
	 * layout will position the vertex as close to the point (x, y) as
	 * possible.
	 * 
	 * @param cell Cell which is being moved.
	 * @param x X-coordinate of the new cell location.
	 * @param y Y-coordinate of the new cell location.
	 */
	void moveCell(Object cell, double x, double y);

}
