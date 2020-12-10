/**
 * Copyright (c) 2007, Gaudenz Alder
 */
package com.mxgraph.analysis;

import com.mxgraph.view.mxCellState;

/**
 * The cost function takes a cell and returns it's cost as a double. Two typical
 * examples of cost functions are the euclidian length of edges or a constant
 * number for each edge. To use one of the built-in cost functions, use either
 * <code>new mxDistanceCostFunction(graph)</code> or
 * <code>new mxConstantCostFunction(1)</code>.
 */
public interface mxICostFunction
{

	/**
	 * Evaluates the cost of the given cell state.
	 * 
	 * @param state The cell state to be evaluated
	 * @return Returns the cost to traverse the given cell state.
	 */
	double getCost(mxCellState state);

}
