/**
 * Copyright (c) 2007-2017, JGraph Ltd
 */
package com.mxgraph.analysis;

import com.mxgraph.util.mxPoint;
import com.mxgraph.view.mxCellState;

/**
 * Implements a cost function for the Euclidean length of an edge.
 */
public class mxDistanceCostFunction implements mxICostFunction
{

	/**
	 * Returns the Euclidean length of the edge defined by the absolute
	 * points in the given state or 0 if no points are defined.
	 */
	public double getCost(mxCellState state)
	{
		double cost = 0;
		int pointCount = state.getAbsolutePointCount();

		if (pointCount > 0)
		{
			mxPoint last = state.getAbsolutePoint(0);

			for (int i = 1; i < pointCount; i++)
			{
				mxPoint point = state.getAbsolutePoint(i);
				cost += point.getPoint().distance(last.getPoint());
				last = point;
			}
		}

		return cost;
	}
}
