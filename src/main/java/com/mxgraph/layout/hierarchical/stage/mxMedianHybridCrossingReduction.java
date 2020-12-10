/*
 * Copyright (c) 2005-2009, JGraph Ltd
 *
 * All rights reserved.
 *
 * This file is licensed under the JGraph software license, a copy of which
 * will have been provided to you in the file LICENSE at the root of your
 * installation directory. If you are unable to locate this file please
 * contact JGraph sales for another copy.
 */

package com.mxgraph.layout.hierarchical.stage;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import com.mxgraph.layout.hierarchical.mxHierarchicalLayout;
import com.mxgraph.layout.hierarchical.model.mxGraphAbstractHierarchyCell;
import com.mxgraph.layout.hierarchical.model.mxGraphHierarchyModel;
import com.mxgraph.layout.hierarchical.model.mxGraphHierarchyRank;

/**
 * Performs a vertex ordering within ranks as described by Gansner et al 1993
 */
public class mxMedianHybridCrossingReduction implements
		mxHierarchicalLayoutStage/*, JGraphLayout.Stoppable*/
{
	/**
	 * Reference to the enclosing layout algorithm
	 */
	protected mxHierarchicalLayout layout;

	/**
	 * The maximum number of iterations to perform whilst reducing edge
	 * crossings
	 */
	protected int maxIterations = 24;

	/**
	 * Stores each rank as a collection of cells in the best order found for
	 * each layer so far
	 */
	protected mxGraphAbstractHierarchyCell[][] nestedBestRanks = null;

	/**
	 * The total number of crossings found in the best configuration so far
	 */
	protected int currentBestCrossings = 0;

	protected int iterationsWithoutImprovement = 0;

	protected int maxNoImprovementIterations = 2;

	/**
	 * Constructor that has the roots specified
	 */
	public mxMedianHybridCrossingReduction(mxHierarchicalLayout layout)
	{
		this.layout = layout;
	}

	/**
	 * Performs a vertex ordering within ranks as described by Gansner et al
	 * 1993
	 */
	public void execute(Object parent)
	{
		mxGraphHierarchyModel model = layout.getModel();

		// Stores initial ordering as being the best one found so far
		nestedBestRanks = new mxGraphAbstractHierarchyCell[model.ranks.size()][];

		for (int i = 0; i < nestedBestRanks.length; i++)
		{
			mxGraphHierarchyRank rank = model.ranks.get(new Integer(i));
			nestedBestRanks[i] = new mxGraphAbstractHierarchyCell[rank.size()];
			rank.toArray(nestedBestRanks[i]);
		}

		iterationsWithoutImprovement = 0;
		currentBestCrossings = calculateCrossings(model);

		for (int i = 0; i < maxIterations
				&& iterationsWithoutImprovement < maxNoImprovementIterations; i++)
		{
			weightedMedian(i, model);
			transpose(i, model);
			int candidateCrossings = calculateCrossings(model);

			if (candidateCrossings < currentBestCrossings)
			{
				currentBestCrossings = candidateCrossings;
				iterationsWithoutImprovement = 0;

				// Store the current rankings as the best ones
				for (int j = 0; j < nestedBestRanks.length; j++)
				{
					mxGraphHierarchyRank rank = model.ranks.get(new Integer(j));
					Iterator<mxGraphAbstractHierarchyCell> iter = rank
							.iterator();

					for (int k = 0; k < rank.size(); k++)
					{
						mxGraphAbstractHierarchyCell cell = iter
								.next();
						nestedBestRanks[j][cell.getGeneralPurposeVariable(j)] = cell;
					}
				}
			}
			else
			{
				// Increase count of iterations where we haven't improved the
				// layout
				iterationsWithoutImprovement++;

				// Restore the best values to the cells
				for (int j = 0; j < nestedBestRanks.length; j++)
				{
					mxGraphHierarchyRank rank = model.ranks.get(new Integer(j));
					Iterator<mxGraphAbstractHierarchyCell> iter = rank
							.iterator();

					for (int k = 0; k < rank.size(); k++)
					{
						mxGraphAbstractHierarchyCell cell = iter
								.next();
						cell.setGeneralPurposeVariable(j, k);
					}
				}
			}

			if (currentBestCrossings == 0)
			{
				// Do nothing further
				break;
			}
		}

		// Store the best rankings but in the model
		Map<Integer, mxGraphHierarchyRank> ranks = new LinkedHashMap<Integer, mxGraphHierarchyRank>(
				model.maxRank + 1);
		mxGraphHierarchyRank[] rankList = new mxGraphHierarchyRank[model.maxRank + 1];

		for (int i = 0; i < model.maxRank + 1; i++)
		{
			rankList[i] = new mxGraphHierarchyRank();
			ranks.put(new Integer(i), rankList[i]);
		}

		for (int i = 0; i < nestedBestRanks.length; i++)
		{
			for (int j = 0; j < nestedBestRanks[i].length; j++)
			{
				rankList[i].add(nestedBestRanks[i][j]);
			}
		}

		model.ranks = ranks;
	}

	/**
	 * Calculates the total number of edge crossing in the current graph
	 * 
	 * @param model
	 *            the internal model describing the hierarchy
	 * @return the current number of edge crossings in the hierarchy graph model
	 *         in the current candidate layout
	 */
	private int calculateCrossings(mxGraphHierarchyModel model)
	{
		// The intra-rank order of cells are stored within the temp variables
		// on cells
		int numRanks = model.ranks.size();
		int totalCrossings = 0;

		for (int i = 1; i < numRanks; i++)
		{
			totalCrossings += calculateRankCrossing(i, model);
		}

		return totalCrossings;
	}

	/**
	 * Calculates the number of edges crossings between the specified rank and
	 * the rank below it
	 * 
	 * @param i
	 *            the topmost rank of the pair ( higher rank value )
	 * @param model
	 *            the internal hierarchy model of the graph
	 * @return the number of edges crossings with the rank beneath
	 */
	protected int calculateRankCrossing(int i, mxGraphHierarchyModel model)
	{
		int totalCrossings = 0;
		mxGraphHierarchyRank rank = model.ranks.get(new Integer(i));
		mxGraphHierarchyRank previousRank = model.ranks.get(new Integer(i - 1));

		// Create an array of connections between these two levels
		int currentRankSize = rank.size();
		int previousRankSize = previousRank.size();
		int[][] connections = new int[currentRankSize][previousRankSize];

		// Iterate over the top rank and fill in the connection information
		Iterator<mxGraphAbstractHierarchyCell> iter = rank.iterator();

		while (iter.hasNext())
		{
			mxGraphAbstractHierarchyCell cell = iter.next();
			int rankPosition = cell.getGeneralPurposeVariable(i);
			Collection<mxGraphAbstractHierarchyCell> connectedCells = cell
					.getPreviousLayerConnectedCells(i);
			Iterator<mxGraphAbstractHierarchyCell> iter2 = connectedCells
					.iterator();

			while (iter2.hasNext())
			{
				mxGraphAbstractHierarchyCell connectedCell = iter2.next();
				int otherCellRankPosition = connectedCell
						.getGeneralPurposeVariable(i - 1);
				connections[rankPosition][otherCellRankPosition] = 201207;
			}
		}

		// Iterate through the connection matrix, crossing edges are
		// indicated by other connected edges with a greater rank position
		// on one rank and lower position on the other
		for (int j = 0; j < currentRankSize; j++)
		{
			for (int k = 0; k < previousRankSize; k++)
			{
				if (connections[j][k] == 201207)
				{
					// Draw a grid of connections, crossings are top right
					// and lower left from this crossing pair
					for (int j2 = j + 1; j2 < currentRankSize; j2++)
					{
						for (int k2 = 0; k2 < k; k2++)
						{
							if (connections[j2][k2] == 201207)
							{
								totalCrossings++;
							}
						}
					}

					for (int j2 = 0; j2 < j; j2++)
					{
						for (int k2 = k + 1; k2 < previousRankSize; k2++)
						{
							if (connections[j2][k2] == 201207)
							{
								totalCrossings++;
							}
						}
					}

				}
			}
		}

		return totalCrossings / 2;
	}

	/**
	 * Takes each possible adjacent cell pair on each rank and checks if
	 * swapping them around reduces the number of crossing
	 * 
	 * @param mainLoopIteration
	 *            the iteration number of the main loop
	 * @param model
	 *            the internal model describing the hierarchy
	 */
	private void transpose(int mainLoopIteration, mxGraphHierarchyModel model)
	{
		boolean improved = true;

		// Track the number of iterations in case of looping
		int count = 0;
		int maxCount = 10;

		while (improved && count++ < maxCount)
		{
			// On certain iterations allow allow swapping of cell pairs with
			// equal edge crossings switched or not switched. This help to
			// nudge a stuck layout into a lower crossing total.
			boolean nudge = mainLoopIteration % 2 == 1 && count % 2 == 1;
			improved = false;

			for (int i = 0; i < model.ranks.size(); i++)
			{
				mxGraphHierarchyRank rank = model.ranks.get(new Integer(i));
				mxGraphAbstractHierarchyCell[] orderedCells = new mxGraphAbstractHierarchyCell[rank
						.size()];
				Iterator<mxGraphAbstractHierarchyCell> iter = rank.iterator();

				for (int j = 0; j < orderedCells.length; j++)
				{
					mxGraphAbstractHierarchyCell cell = iter
							.next();
					orderedCells[cell.getGeneralPurposeVariable(i)] = cell;
				}

				List<mxGraphAbstractHierarchyCell> leftCellAboveConnections = null;
				List<mxGraphAbstractHierarchyCell> leftCellBelowConnections = null;
				List<mxGraphAbstractHierarchyCell> rightCellAboveConnections = null;
				List<mxGraphAbstractHierarchyCell> rightCellBelowConnections = null;

				int[] leftAbovePositions = null;
				int[] leftBelowPositions = null;
				int[] rightAbovePositions = null;
				int[] rightBelowPositions = null;

				mxGraphAbstractHierarchyCell leftCell = null;
				mxGraphAbstractHierarchyCell rightCell = null;

				for (int j = 0; j < (rank.size() - 1); j++)
				{
					// For each intra-rank adjacent pair of cells
					// see if swapping them around would reduce the
					// number of edges crossing they cause in total
					// On every cell pair except the first on each rank, we
					// can save processing using the previous values for the
					// right cell on the new left cell
					if (j == 0)
					{
						leftCell = orderedCells[j];
						leftCellAboveConnections = leftCell
								.getNextLayerConnectedCells(i);
						leftCellBelowConnections = leftCell
								.getPreviousLayerConnectedCells(i);

						leftAbovePositions = new int[leftCellAboveConnections
								.size()];
						leftBelowPositions = new int[leftCellBelowConnections
								.size()];

						for (int k = 0; k < leftAbovePositions.length; k++)
						{
							leftAbovePositions[k] = leftCellAboveConnections
									.get(k).getGeneralPurposeVariable(i + 1);
						}

						for (int k = 0; k < leftBelowPositions.length; k++)
						{
							leftBelowPositions[k] = (leftCellBelowConnections
									.get(k)).getGeneralPurposeVariable(i - 1);
						}
					}
					else
					{
						leftCellAboveConnections = rightCellAboveConnections;
						leftCellBelowConnections = rightCellBelowConnections;
						leftAbovePositions = rightAbovePositions;
						leftBelowPositions = rightBelowPositions;
						leftCell = rightCell;
					}

					rightCell = orderedCells[j + 1];
					rightCellAboveConnections = rightCell
							.getNextLayerConnectedCells(i);
					rightCellBelowConnections = rightCell
							.getPreviousLayerConnectedCells(i);

					rightAbovePositions = new int[rightCellAboveConnections
							.size()];
					rightBelowPositions = new int[rightCellBelowConnections
							.size()];

					for (int k = 0; k < rightAbovePositions.length; k++)
					{
						rightAbovePositions[k] = (rightCellAboveConnections
								.get(k)).getGeneralPurposeVariable(i + 1);
					}

					for (int k = 0; k < rightBelowPositions.length; k++)
					{
						rightBelowPositions[k] = (rightCellBelowConnections
								.get(k)).getGeneralPurposeVariable(i - 1);
					}

					int totalCurrentCrossings = 0;
					int totalSwitchedCrossings = 0;

					for (int k = 0; k < leftAbovePositions.length; k++)
					{
						for (int ik = 0; ik < rightAbovePositions.length; ik++)
						{
							if (leftAbovePositions[k] > rightAbovePositions[ik])
							{
								totalCurrentCrossings++;
							}

							if (leftAbovePositions[k] < rightAbovePositions[ik])
							{
								totalSwitchedCrossings++;
							}
						}
					}

					for (int k = 0; k < leftBelowPositions.length; k++)
					{
						for (int ik = 0; ik < rightBelowPositions.length; ik++)
						{
							if (leftBelowPositions[k] > rightBelowPositions[ik])
							{
								totalCurrentCrossings++;
							}

							if (leftBelowPositions[k] < rightBelowPositions[ik])
							{
								totalSwitchedCrossings++;
							}
						}
					}

					if ((totalSwitchedCrossings < totalCurrentCrossings)
							|| (totalSwitchedCrossings == totalCurrentCrossings && nudge))
					{
						int temp = leftCell.getGeneralPurposeVariable(i);
						leftCell.setGeneralPurposeVariable(i, rightCell
								.getGeneralPurposeVariable(i));
						rightCell.setGeneralPurposeVariable(i, temp);
						// With this pair exchanged we have to switch all of
						// values for the left cell to the right cell so the
						// next iteration for this rank uses it as the left
						// cell again
						rightCellAboveConnections = leftCellAboveConnections;
						rightCellBelowConnections = leftCellBelowConnections;
						rightAbovePositions = leftAbovePositions;
						rightBelowPositions = leftBelowPositions;
						rightCell = leftCell;

						if (!nudge)
						{
							// Don't count nudges as improvement or we'll end
							// up stuck in two combinations and not finishing
							// as early as we should
							improved = true;
						}
					}
				}
			}
		}
	}

	/**
	 * Sweeps up or down the layout attempting to minimise the median placement
	 * of connected cells on adjacent ranks
	 * 
	 * @param iteration
	 *            the iteration number of the main loop
	 * @param model
	 *            the internal model describing the hierarchy
	 */
	private void weightedMedian(int iteration, mxGraphHierarchyModel model)
	{
		// Reverse sweep direction each time through this method
		boolean downwardSweep = (iteration % 2 == 0);

		if (downwardSweep)
		{
			for (int j = model.maxRank - 1; j >= 0; j--)
			{
				medianRank(j, downwardSweep);
			}
		}
		else
		{
			for (int j = 1; j < model.maxRank; j++)
			{
				medianRank(j, downwardSweep);
			}
		}
	}

	/**
	 * Attempts to minimise the median placement of connected cells on this rank
	 * and one of the adjacent ranks
	 * 
	 * @param rankValue
	 *            the layer number of this rank
	 * @param downwardSweep
	 *            whether or not this is a downward sweep through the graph
	 */
	private void medianRank(int rankValue, boolean downwardSweep)
	{
		int numCellsForRank = nestedBestRanks[rankValue].length;
		ArrayList<MedianCellSorter> medianValues = new ArrayList<MedianCellSorter>(numCellsForRank);
		boolean[] reservedPositions = new boolean[numCellsForRank];

		for (int i = 0; i < numCellsForRank; i++)
		{
			mxGraphAbstractHierarchyCell cell = nestedBestRanks[rankValue][i];
			MedianCellSorter sorterEntry = new MedianCellSorter();
			sorterEntry.cell = cell;

			// Flip whether or not equal medians are flipped on up and down
			// sweeps
			// todo reimplement some kind of nudging depending on sweep
			//nudge = !downwardSweep;
			Collection<mxGraphAbstractHierarchyCell> nextLevelConnectedCells;

			if (downwardSweep)
			{
				nextLevelConnectedCells = cell
						.getNextLayerConnectedCells(rankValue);
			}
			else
			{
				nextLevelConnectedCells = cell
						.getPreviousLayerConnectedCells(rankValue);
			}

			int nextRankValue;

			if (downwardSweep)
			{
				nextRankValue = rankValue + 1;
			}
			else
			{
				nextRankValue = rankValue - 1;
			}

			if (nextLevelConnectedCells != null
					&& nextLevelConnectedCells.size() != 0)
			{
				sorterEntry.medianValue = medianValue(
						nextLevelConnectedCells, nextRankValue);
				medianValues.add(sorterEntry);
			}
			else
			{
				// Nodes with no adjacent vertices are flagged in the reserved array 
				// to indicate they should be left in their current position.
				reservedPositions[cell.getGeneralPurposeVariable(rankValue)] = true;
			}
		}

		MedianCellSorter[] medianArray = medianValues.toArray(new MedianCellSorter[medianValues.size()]);
		Arrays.sort(medianArray);

		// Set the new position of each node within the rank using
		// its temp variable
		int index = 0;
		
		for (int i = 0; i < numCellsForRank; i++)
		{
			if (!reservedPositions[i])
			{
				MedianCellSorter wrapper = medianArray[index++];
				wrapper.cell.setGeneralPurposeVariable(rankValue, i);
			}
		}
	}

	/**
	 * Calculates the median rank order positioning for the specified cell using
	 * the connected cells on the specified rank
	 * 
	 * @param connectedCells
	 *            the cells on the specified rank connected to the specified
	 *            cell
	 * @param rankValue
	 *            the rank that the connected cell lie upon
	 * @return the median rank ordering value of the connected cells
	 */
	private double medianValue(
			Collection<mxGraphAbstractHierarchyCell> connectedCells,
			int rankValue)
	{
		double[] medianValues = new double[connectedCells.size()];
		int arrayCount = 0;
		Iterator<mxGraphAbstractHierarchyCell> iter = connectedCells.iterator();

		while (iter.hasNext())
		{
			medianValues[arrayCount++] = (iter
					.next()).getGeneralPurposeVariable(rankValue);
		}

		Arrays.sort(medianValues);

		if (arrayCount % 2 == 1)
		{
			// For odd numbers of adjacent vertices return the median
			return medianValues[arrayCount / 2];
		}
		else if (arrayCount == 2)
		{
			return ((medianValues[0] + medianValues[1]) / 2.0);
		}
		else
		{
			int medianPoint = arrayCount / 2;
			double leftMedian = medianValues[medianPoint - 1] - medianValues[0];
			double rightMedian = medianValues[arrayCount - 1]
					- medianValues[medianPoint];

			return (medianValues[medianPoint - 1] * rightMedian + medianValues[medianPoint]
					* leftMedian)
					/ (leftMedian + rightMedian);
		}
	}

	/**
	 * A utility class used to track cells whilst sorting occurs on the median
	 * values. Does not violate (x.compareTo(y)==0) == (x.equals(y))
	 */
	protected class MedianCellSorter implements Comparable<Object>
	{

		/**
		 * The median value of the cell stored
		 */
		public double medianValue = 0.0;

		/**
		 * The cell whose median value is being calculated
		 */
		mxGraphAbstractHierarchyCell cell = null;

		/**
		 * comparator on the medianValue
		 * 
		 * @param arg0
		 *            the object to be compared to
		 * @return the standard return you would expect when comparing two
		 *         double
		 */
		public int compareTo(Object arg0)
		{
			if (arg0 instanceof MedianCellSorter)
			{
				if (medianValue < ((MedianCellSorter) arg0).medianValue)
				{
					return -1;
				}
				else if (medianValue > ((MedianCellSorter) arg0).medianValue)
				{
					return 1;
				}
			}
			
			return 0;
		}
	}
}