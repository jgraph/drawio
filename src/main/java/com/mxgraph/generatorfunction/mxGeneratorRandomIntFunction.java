package com.mxgraph.generatorfunction;

import com.mxgraph.view.mxCellState;

/**
 * @author Mate
 * A generator random cost function
 * It will generate random integer edge weights in the range of (<b>minWeight</b>, <b>maxWeight</b>) and rounds the values to <b>roundToDecimals</b>
 */
public class mxGeneratorRandomIntFunction extends mxGeneratorFunction
{
	private double maxWeight = 10;

	private double minWeight = 0;

	public mxGeneratorRandomIntFunction(double minWeight, double maxWeight)
	{
		setWeightRange(minWeight, maxWeight);
	};

	public double getCost(mxCellState state)
	{
		//assumed future parameters
		//		mxGraph graph = state.getView().getGraph();
		//		Object cell = state.getCell();

		if (minWeight == maxWeight)
		{
			return minWeight;
		}

		double currValue = minWeight + Math.round((Math.random() * (maxWeight - minWeight)));
		return currValue;
	};

	public double getMaxWeight()
	{
		return maxWeight;
	};

	public void setWeightRange(double minWeight, double maxWeight)
	{
		this.maxWeight = Math.round(Math.max(minWeight, maxWeight));
		this.minWeight = Math.round(Math.min(minWeight, maxWeight));
	};

	public double getMinWeight()
	{
		return minWeight;
	};
};
