/**
 * Copyright (c) 2006-2018, JGraph Ltd
 * Copyright (c) 2006-2018, Gaudenz Alder
 */
/**
 * Class: mxCoordinateAssignment
 * 
 * Sets the horizontal locations of node and edge dummy nodes on each layer.
 * Uses median down and up weighings as well as heuristics to straighten edges as
 * far as possible.
 * 
 * Constructor: mxCoordinateAssignment
 *
 * Creates a coordinate assignment.
 * 
 * Arguments:
 * 
 * intraCellSpacing - the minimum buffer between cells on the same rank
 * interRankCellSpacing - the minimum distance between cells on adjacent ranks
 * orientation - the position of the root node(s) relative to the graph
 * initialX - the leftmost coordinate node placement starts at
 */
function mxCoordinateAssignment(layout, intraCellSpacing, interRankCellSpacing,
	orientation, initialX, parallelEdgeSpacing)
{
	this.layout = layout;
	this.intraCellSpacing = intraCellSpacing;
	this.interRankCellSpacing = interRankCellSpacing;
	this.orientation = orientation;
	this.initialX = initialX;
	this.parallelEdgeSpacing = parallelEdgeSpacing;
};

/**
 * Extends mxHierarchicalLayoutStage.
 */
mxCoordinateAssignment.prototype = new mxHierarchicalLayoutStage();
mxCoordinateAssignment.prototype.constructor = mxCoordinateAssignment;

/**
 * Variable: layout
 * 
 * Reference to the enclosing <mxHierarchicalLayout>.
 */
mxCoordinateAssignment.prototype.layout = null;

/**
 * Variable: intraCellSpacing
 * 
 * The minimum buffer between cells on the same rank. Default is 30.
 */
mxCoordinateAssignment.prototype.intraCellSpacing = 30;

/**
 * Variable: interRankCellSpacing
 * 
 * The minimum distance between cells on adjacent ranks. Default is 100.
 */
mxCoordinateAssignment.prototype.interRankCellSpacing = 100;

/**
 * Variable: parallelEdgeSpacing
 * 
 * The distance between each parallel edge on each ranks for long edges.
 * Default is 10.
 */
mxCoordinateAssignment.prototype.parallelEdgeSpacing = 10;

/**
 * Variable: maxIterations
 * 
 * The number of heuristic iterations to run. Default is 8.
 */
mxCoordinateAssignment.prototype.maxIterations = 8;

/**
 * Variable: prefHozEdgeSep
 * 
 * The preferred horizontal distance between edges exiting a vertex Default is 5.
 */
mxCoordinateAssignment.prototype.prefHozEdgeSep = 5;

/**
 * Variable: prefVertEdgeOff
 * 
 * The preferred vertical offset between edges exiting a vertex Default is 2.
 */
mxCoordinateAssignment.prototype.prefVertEdgeOff = 2;

/**
 * Variable: minEdgeJetty
 * 
 * The minimum distance for an edge jetty from a vertex Default is 12.
 */
mxCoordinateAssignment.prototype.minEdgeJetty = 12;

/**
 * Variable: channelBuffer
 * 
 * The size of the vertical buffer in the center of inter-rank channels
 * where edge control points should not be placed Default is 4.
 */
mxCoordinateAssignment.prototype.channelBuffer = 4;

/**
 * Variable: jettyPositions
 * 
 * Map of internal edges and (x,y) pair of positions of the start and end jetty
 * for that edge where it connects to the source and target vertices.
 * Note this should technically be a WeakHashMap, but since JS does not
 * have an equivalent, housekeeping must be performed before using.
 * i.e. check all edges are still in the model and clear the values.
 * Note that the y co-ord is the offset of the jetty, not the
 * absolute point
 */
mxCoordinateAssignment.prototype.jettyPositions = null;

/**
 * Variable: orientation
 * 
 * The position of the root ( start ) node(s) relative to the rest of the
 * laid out graph. Default is <mxConstants.DIRECTION_NORTH>.
 */
mxCoordinateAssignment.prototype.orientation = mxConstants.DIRECTION_NORTH;

/**
 * Variable: initialX
 * 
 * The minimum x position node placement starts at
 */
mxCoordinateAssignment.prototype.initialX = null;

/**
 * Variable: limitX
 * 
 * The maximum x value this positioning lays up to
 */
mxCoordinateAssignment.prototype.limitX = null;

/**
 * Variable: currentXDelta
 * 
 * The sum of x-displacements for the current iteration
 */
mxCoordinateAssignment.prototype.currentXDelta = null;

/**
 * Variable: widestRank
 * 
 * The rank that has the widest x position
 */
mxCoordinateAssignment.prototype.widestRank = null;

/**
 * Variable: rankTopY
 * 
 * Internal cache of top-most values of Y for each rank
 */
mxCoordinateAssignment.prototype.rankTopY = null;

/**
 * Variable: rankBottomY
 * 
 * Internal cache of bottom-most value of Y for each rank
 */
mxCoordinateAssignment.prototype.rankBottomY = null;

/**
 * Variable: widestRankValue
 * 
 * The X-coordinate of the edge of the widest rank
 */
mxCoordinateAssignment.prototype.widestRankValue = null;

/**
 * Variable: rankWidths
 * 
 * The width of all the ranks
 */
mxCoordinateAssignment.prototype.rankWidths = null;

/**
 * Variable: rankY
 * 
 * The Y-coordinate of all the ranks
 */
mxCoordinateAssignment.prototype.rankY = null;

/**
 * Variable: fineTuning
 * 
 * Whether or not to perform local optimisations and iterate multiple times
 * through the algorithm. Default is true.
 */
mxCoordinateAssignment.prototype.fineTuning = true;

/**
 * Variable: nextLayerConnectedCache
 * 
 * A store of connections to the layer above for speed
 */
mxCoordinateAssignment.prototype.nextLayerConnectedCache = null;

/**
 * Variable: previousLayerConnectedCache
 * 
 * A store of connections to the layer below for speed
 */
mxCoordinateAssignment.prototype.previousLayerConnectedCache = null;

/**
 * Variable: groupPadding
 * 
 * Padding added to resized parents Default is 10.
 */
mxCoordinateAssignment.prototype.groupPadding = 10;

/**
 * Utility method to display current positions
 */
mxCoordinateAssignment.prototype.printStatus = function()
{
	var model = this.layout.getModel();
	mxLog.show();

	mxLog.writeln('======Coord assignment debug=======');

	for (var j = 0; j < model.ranks.length; j++)
	{
		mxLog.write('Rank ', j, ' : ' );
		var rank = model.ranks[j];
		
		for (var k = 0; k < rank.length; k++)
		{
			var cell = rank[k];
			
			mxLog.write(cell.getGeneralPurposeVariable(j), '  ');
		}
		mxLog.writeln();
	}
	
	mxLog.writeln('====================================');
};

/**
 * Function: execute
 * 
 * A basic horizontal coordinate assignment algorithm
 */
mxCoordinateAssignment.prototype.execute = function(parent)
{
	this.jettyPositions = Object();
	var model = this.layout.getModel();
	this.currentXDelta = 0.0;

	this.initialCoords(this.layout.getGraph(), model);
	
//	this.printStatus();
	
	if (this.fineTuning)
	{
		this.minNode(model);
	}
	
	var bestXDelta = 100000000.0;
	
	if (this.fineTuning)
	{
		for (var i = 0; i < this.maxIterations; i++)
		{
//			this.printStatus();
		
			// Median Heuristic
			if (i != 0)
			{
				this.medianPos(i, model);
				this.minNode(model);
			}
			
			// if the total offset is less for the current positioning,
			// there are less heavily angled edges and so the current
			// positioning is used
			if (this.currentXDelta < bestXDelta)
			{
				for (var j = 0; j < model.ranks.length; j++)
				{
					var rank = model.ranks[j];
					
					for (var k = 0; k < rank.length; k++)
					{
						var cell = rank[k];
						cell.setX(j, cell.getGeneralPurposeVariable(j));
					}
				}
				
				bestXDelta = this.currentXDelta;
			}
			else
			{
				// Restore the best positions
				for (var j = 0; j < model.ranks.length; j++)
				{
					var rank = model.ranks[j];
					
					for (var k = 0; k < rank.length; k++)
					{
						var cell = rank[k];
						cell.setGeneralPurposeVariable(j, cell.getX(j));
					}
				}
			}
			
			this.minPath(this.layout.getGraph(), model);
			
			this.currentXDelta = 0;
		}
	}
	
	this.setCellLocations(this.layout.getGraph(), model);
};

/**
 * Function: minNode
 * 
 * Performs one median positioning sweep in both directions
 */
mxCoordinateAssignment.prototype.minNode = function(model)
{
	// Queue all nodes
	var nodeList = [];
	
	// Need to be able to map from cell to cellWrapper
	var map = new mxDictionary();
	var rank = [];
	
	for (var i = 0; i <= model.maxRank; i++)
	{
		rank[i] = model.ranks[i];
		
		for (var j = 0; j < rank[i].length; j++)
		{
			// Use the weight to store the rank and visited to store whether
			// or not the cell is in the list
			var node = rank[i][j];
			var nodeWrapper = new WeightedCellSorter(node, i);
			nodeWrapper.rankIndex = j;
			nodeWrapper.visited = true;
			nodeList.push(nodeWrapper);
			
			map.put(node, nodeWrapper);
		}
	}
	
	// Set a limit of the maximum number of times we will access the queue
	// in case a loop appears
	var maxTries = nodeList.length * 10;
	var count = 0;
	
	// Don't move cell within this value of their median
	var tolerance = 1;
	
	while (nodeList.length > 0 && count <= maxTries)
	{
		var cellWrapper = nodeList.shift();
		var cell = cellWrapper.cell;
		
		var rankValue = cellWrapper.weightedValue;
		var rankIndex = parseInt(cellWrapper.rankIndex);
		
		var nextLayerConnectedCells = cell.getNextLayerConnectedCells(rankValue);
		var previousLayerConnectedCells = cell.getPreviousLayerConnectedCells(rankValue);
		
		var numNextLayerConnected = nextLayerConnectedCells.length;
		var numPreviousLayerConnected = previousLayerConnectedCells.length;

		var medianNextLevel = this.medianXValue(nextLayerConnectedCells,
				rankValue + 1);
		var medianPreviousLevel = this.medianXValue(previousLayerConnectedCells,
				rankValue - 1);

		var numConnectedNeighbours = numNextLayerConnected
				+ numPreviousLayerConnected;
		var currentPosition = cell.getGeneralPurposeVariable(rankValue);
		var cellMedian = currentPosition;
		
		if (numConnectedNeighbours > 0)
		{
			cellMedian = (medianNextLevel * numNextLayerConnected + medianPreviousLevel
					* numPreviousLayerConnected)
					/ numConnectedNeighbours;
		}

		// Flag storing whether or not position has changed
		var positionChanged = false;
		
		if (cellMedian < currentPosition - tolerance)
		{
			if (rankIndex == 0)
			{
				cell.setGeneralPurposeVariable(rankValue, cellMedian);
				positionChanged = true;
			}
			else
			{
				var leftCell = rank[rankValue][rankIndex - 1];
				var leftLimit = leftCell
						.getGeneralPurposeVariable(rankValue);
				leftLimit = leftLimit + leftCell.width / 2
						+ this.intraCellSpacing + cell.width / 2;

				if (leftLimit < cellMedian)
				{
					cell.setGeneralPurposeVariable(rankValue, cellMedian);
					positionChanged = true;
				}
				else if (leftLimit < cell
						.getGeneralPurposeVariable(rankValue)
						- tolerance)
				{
					cell.setGeneralPurposeVariable(rankValue, leftLimit);
					positionChanged = true;
				}
			}
		}
		else if (cellMedian > currentPosition + tolerance)
		{
			var rankSize = rank[rankValue].length;
			
			if (rankIndex == rankSize - 1)
			{
				cell.setGeneralPurposeVariable(rankValue, cellMedian);
				positionChanged = true;
			}
			else
			{
				var rightCell = rank[rankValue][rankIndex + 1];
				var rightLimit = rightCell
						.getGeneralPurposeVariable(rankValue);
				rightLimit = rightLimit - rightCell.width / 2
						- this.intraCellSpacing - cell.width / 2;
				
				if (rightLimit > cellMedian)
				{
					cell.setGeneralPurposeVariable(rankValue, cellMedian);
					positionChanged = true;
				}
				else if (rightLimit > cell
						.getGeneralPurposeVariable(rankValue)
						+ tolerance)
				{
					cell.setGeneralPurposeVariable(rankValue, rightLimit);
					positionChanged = true;
				}
			}
		}
		
		if (positionChanged)
		{
			// Add connected nodes to map and list
			for (var i = 0; i < nextLayerConnectedCells.length; i++)
			{
				var connectedCell = nextLayerConnectedCells[i];
				var connectedCellWrapper = map.get(connectedCell);
				
				if (connectedCellWrapper != null)
				{
					if (connectedCellWrapper.visited == false)
					{
						connectedCellWrapper.visited = true;
						nodeList.push(connectedCellWrapper);
					}
				}
			}

			// Add connected nodes to map and list
			for (var i = 0; i < previousLayerConnectedCells.length; i++)
			{
				var connectedCell = previousLayerConnectedCells[i];
				var connectedCellWrapper = map.get(connectedCell);

				if (connectedCellWrapper != null)
				{
					if (connectedCellWrapper.visited == false)
					{
						connectedCellWrapper.visited = true;
						nodeList.push(connectedCellWrapper);
					}
				}
			}
		}
		
		cellWrapper.visited = false;
		count++;
	}
};

/**
 * Function: medianPos
 * 
 * Performs one median positioning sweep in one direction
 * 
 * Parameters:
 * 
 * i - the iteration of the whole process
 * model - an internal model of the hierarchical layout
 */
mxCoordinateAssignment.prototype.medianPos = function(i, model)
{
	// Reverse sweep direction each time through this method
	var downwardSweep = (i % 2 == 0);
	
	if (downwardSweep)
	{
		for (var j = model.maxRank; j > 0; j--)
		{
			this.rankMedianPosition(j - 1, model, j);
		}
	}
	else
	{
		for (var j = 0; j < model.maxRank - 1; j++)
		{
			this.rankMedianPosition(j + 1, model, j);
		}
	}
};

/**
 * Function: rankMedianPosition
 * 
 * Performs median minimisation over one rank.
 * 
 * Parameters:
 * 
 * rankValue - the layer number of this rank
 * model - an internal model of the hierarchical layout
 * nextRankValue - the layer number whose connected cels are to be laid out
 * relative to
 */
mxCoordinateAssignment.prototype.rankMedianPosition = function(rankValue, model, nextRankValue)
{
	var rank = model.ranks[rankValue];

	// Form an array of the order in which the cell are to be processed
	// , the order is given by the weighted sum of the in or out edges,
	// depending on whether we're traveling up or down the hierarchy.
	var weightedValues = [];
	var cellMap = new Object();

	for (var i = 0; i < rank.length; i++)
	{
		var currentCell = rank[i];
		weightedValues[i] = new WeightedCellSorter();
		weightedValues[i].cell = currentCell;
		weightedValues[i].rankIndex = i;
		cellMap[currentCell.id] = weightedValues[i];
		var nextLayerConnectedCells = null;
		
		if (nextRankValue < rankValue)
		{
			nextLayerConnectedCells = currentCell
					.getPreviousLayerConnectedCells(rankValue);
		}
		else
		{
			nextLayerConnectedCells = currentCell
					.getNextLayerConnectedCells(rankValue);
		}

		// Calculate the weighing based on this node type and those this
		// node is connected to on the next layer
		weightedValues[i].weightedValue = this.calculatedWeightedValue(
				currentCell, nextLayerConnectedCells);
	}

	weightedValues.sort(WeightedCellSorter.prototype.compare);

	// Set the new position of each node within the rank using
	// its temp variable
	
	for (var i = 0; i < weightedValues.length; i++)
	{
		var numConnectionsNextLevel = 0;
		var cell = weightedValues[i].cell;
		var nextLayerConnectedCells = null;
		var medianNextLevel = 0;

		if (nextRankValue < rankValue)
		{
			nextLayerConnectedCells = cell.getPreviousLayerConnectedCells(
					rankValue).slice();
		}
		else
		{
			nextLayerConnectedCells = cell.getNextLayerConnectedCells(
					rankValue).slice();
		}

		if (nextLayerConnectedCells != null)
		{
			numConnectionsNextLevel = nextLayerConnectedCells.length;
			
			if (numConnectionsNextLevel > 0)
			{
				medianNextLevel = this.medianXValue(nextLayerConnectedCells,
						nextRankValue);
			}
			else
			{
				// For case of no connections on the next level set the
				// median to be the current position and try to be
				// positioned there
				medianNextLevel = cell.getGeneralPurposeVariable(rankValue);
			}
		}

		var leftBuffer = 0.0;
		var leftLimit = -100000000.0;
		
		for (var j = weightedValues[i].rankIndex - 1; j >= 0;)
		{
			var weightedValue = cellMap[rank[j].id];
			
			if (weightedValue != null)
			{
				var leftCell = weightedValue.cell;
				
				if (weightedValue.visited)
				{
					// The left limit is the right hand limit of that
					// cell plus any allowance for unallocated cells
					// in-between
					leftLimit = leftCell
							.getGeneralPurposeVariable(rankValue)
							+ leftCell.width
							/ 2.0
							+ this.intraCellSpacing
							+ leftBuffer + cell.width / 2.0;
					j = -1;
				}
				else
				{
					leftBuffer += leftCell.width + this.intraCellSpacing;
					j--;
				}
			}
		}

		var rightBuffer = 0.0;
		var rightLimit = 100000000.0;
		
		for (var j = weightedValues[i].rankIndex + 1; j < weightedValues.length;)
		{
			var weightedValue = cellMap[rank[j].id];
			
			if (weightedValue != null)
			{
				var rightCell = weightedValue.cell;
				
				if (weightedValue.visited)
				{
					// The left limit is the right hand limit of that
					// cell plus any allowance for unallocated cells
					// in-between
					rightLimit = rightCell
							.getGeneralPurposeVariable(rankValue)
							- rightCell.width
							/ 2.0
							- this.intraCellSpacing
							- rightBuffer - cell.width / 2.0;
					j = weightedValues.length;
				}
				else
				{
					rightBuffer += rightCell.width + this.intraCellSpacing;
					j++;
				}
			}
		}
		
		if (medianNextLevel >= leftLimit && medianNextLevel <= rightLimit)
		{
			cell.setGeneralPurposeVariable(rankValue, medianNextLevel);
		}
		else if (medianNextLevel < leftLimit)
		{
			// Couldn't place at median value, place as close to that
			// value as possible
			cell.setGeneralPurposeVariable(rankValue, leftLimit);
			this.currentXDelta += leftLimit - medianNextLevel;
		}
		else if (medianNextLevel > rightLimit)
		{
			// Couldn't place at median value, place as close to that
			// value as possible
			cell.setGeneralPurposeVariable(rankValue, rightLimit);
			this.currentXDelta += medianNextLevel - rightLimit;
		}

		weightedValues[i].visited = true;
	}
};

/**
 * Function: calculatedWeightedValue
 * 
 * Calculates the priority the specified cell has based on the type of its
 * cell and the cells it is connected to on the next layer
 * 
 * Parameters:
 * 
 * currentCell - the cell whose weight is to be calculated
 * collection - the cells the specified cell is connected to
 */
mxCoordinateAssignment.prototype.calculatedWeightedValue = function(currentCell, collection)
{
	var totalWeight = 0;
	
	for (var i = 0; i < collection.length; i++)
	{
		var cell = collection[i];

		if (currentCell.isVertex() && cell.isVertex())
		{
			totalWeight++;
		}
		else if (currentCell.isEdge() && cell.isEdge())
		{
			totalWeight += 8;
		}
		else
		{
			totalWeight += 2;
		}
	}

	return totalWeight;
};

/**
 * Function: medianXValue
 * 
 * Calculates the median position of the connected cell on the specified
 * rank
 * 
 * Parameters:
 * 
 * connectedCells - the cells the candidate connects to on this level
 * rankValue - the layer number of this rank
 */
mxCoordinateAssignment.prototype.medianXValue = function(connectedCells, rankValue)
{
	if (connectedCells.length == 0)
	{
		return 0;
	}

	var medianValues = [];

	for (var i = 0; i < connectedCells.length; i++)
	{
		medianValues[i] = connectedCells[i].getGeneralPurposeVariable(rankValue);
	}

	medianValues.sort(function(a,b){return a - b;});
	
	if (connectedCells.length % 2 == 1)
	{
		// For odd numbers of adjacent vertices return the median
		return medianValues[Math.floor(connectedCells.length / 2)];
	}
	else
	{
		var medianPoint = connectedCells.length / 2;
		var leftMedian = medianValues[medianPoint - 1];
		var rightMedian = medianValues[medianPoint];

		return ((leftMedian + rightMedian) / 2);
	}
};

/**
 * Function: initialCoords
 * 
 * Sets up the layout in an initial positioning. The ranks are all centered
 * as much as possible along the middle vertex in each rank. The other cells
 * are then placed as close as possible on either side.
 * 
 * Parameters:
 * 
 * facade - the facade describing the input graph
 * model - an internal model of the hierarchical layout
 */
mxCoordinateAssignment.prototype.initialCoords = function(facade, model)
{
	this.calculateWidestRank(facade, model);

	// Sweep up and down from the widest rank
	for (var i = this.widestRank; i >= 0; i--)
	{
		if (i < model.maxRank)
		{
			this.rankCoordinates(i, facade, model);
		}
	}

	for (var i = this.widestRank+1; i <= model.maxRank; i++)
	{
		if (i > 0)
		{
			this.rankCoordinates(i, facade, model);
		}
	}
};

/**
 * Function: rankCoordinates
 * 
 * Sets up the layout in an initial positioning. All the first cells in each
 * rank are moved to the left and the rest of the rank inserted as close
 * together as their size and buffering permits. This method works on just
 * the specified rank.
 * 
 * Parameters:
 * 
 * rankValue - the current rank being processed
 * graph - the facade describing the input graph
 * model - an internal model of the hierarchical layout
 */
mxCoordinateAssignment.prototype.rankCoordinates = function(rankValue, graph, model)
{
	var rank = model.ranks[rankValue];
	var maxY = 0.0;
	var localX = this.initialX + (this.widestRankValue - this.rankWidths[rankValue])
			/ 2;

	// Store whether or not any of the cells' bounds were unavailable so
	// to only issue the warning once for all cells
	var boundsWarning = false;
	
	for (var i = 0; i < rank.length; i++)
	{
		var node = rank[i];
		
		if (node.isVertex())
		{
			var bounds = this.layout.getVertexBounds(node.cell);

			if (bounds != null)
			{
				if (this.orientation == mxConstants.DIRECTION_NORTH ||
					this.orientation == mxConstants.DIRECTION_SOUTH)
				{
					node.width = bounds.width;
					node.height = bounds.height;
				}
				else
				{
					node.width = bounds.height;
					node.height = bounds.width;
				}
			}
			else
			{
				boundsWarning = true;
			}

			maxY = Math.max(maxY, node.height);
		}
		else if (node.isEdge())
		{
			// The width is the number of additional parallel edges
			// time the parallel edge spacing
			var numEdges = 1;

			if (node.edges != null)
			{
				numEdges = node.edges.length;
			}
			else
			{
				mxLog.warn('edge.edges is null');
			}

			node.width = (numEdges - 1) * this.parallelEdgeSpacing;
		}

		// Set the initial x-value as being the best result so far
		localX += node.width / 2.0;
		node.setX(rankValue, localX);
		node.setGeneralPurposeVariable(rankValue, localX);
		localX += node.width / 2.0;
		localX += this.intraCellSpacing;
	}

	if (boundsWarning == true)
	{
		mxLog.warn('At least one cell has no bounds');
	}
};

/**
 * Function: calculateWidestRank
 * 
 * Calculates the width rank in the hierarchy. Also set the y value of each
 * rank whilst performing the calculation
 * 
 * Parameters:
 * 
 * graph - the facade describing the input graph
 * model - an internal model of the hierarchical layout
 */
mxCoordinateAssignment.prototype.calculateWidestRank = function(graph, model)
{
	// Starting y co-ordinate
	var y = -this.interRankCellSpacing;
	
	// Track the widest cell on the last rank since the y
	// difference depends on it
	var lastRankMaxCellHeight = 0.0;
	this.rankWidths = [];
	this.rankY = [];

	for (var rankValue = model.maxRank; rankValue >= 0; rankValue--)
	{
		// Keep track of the widest cell on this rank
		var maxCellHeight = 0.0;
		var rank = model.ranks[rankValue];
		var localX = this.initialX;

		// Store whether or not any of the cells' bounds were unavailable so
		// to only issue the warning once for all cells
		var boundsWarning = false;
		
		for (var i = 0; i < rank.length; i++)
		{
			var node = rank[i];

			if (node.isVertex())
			{
				var bounds = this.layout.getVertexBounds(node.cell);

				if (bounds != null)
				{
					if (this.orientation == mxConstants.DIRECTION_NORTH ||
						this.orientation == mxConstants.DIRECTION_SOUTH)
					{
						node.width = bounds.width;
						node.height = bounds.height;
					}
					else
					{
						node.width = bounds.height;
						node.height = bounds.width;
					}
				}
				else
				{
					boundsWarning = true;
				}

				maxCellHeight = Math.max(maxCellHeight, node.height);
			}
			else if (node.isEdge())
			{
				// The width is the number of additional parallel edges
				// time the parallel edge spacing
				var numEdges = 1;

				if (node.edges != null)
				{
					numEdges = node.edges.length;
				}
				else
				{
					mxLog.warn('edge.edges is null');
				}

				node.width = (numEdges - 1) * this.parallelEdgeSpacing;
			}

			// Set the initial x-value as being the best result so far
			localX += node.width / 2.0;
			node.setX(rankValue, localX);
			node.setGeneralPurposeVariable(rankValue, localX);
			localX += node.width / 2.0;
			localX += this.intraCellSpacing;

			if (localX > this.widestRankValue)
			{
				this.widestRankValue = localX;
				this.widestRank = rankValue;
			}

			this.rankWidths[rankValue] = localX;
		}

		if (boundsWarning == true)
		{
			mxLog.warn('At least one cell has no bounds');
		}

		this.rankY[rankValue] = y;
		var distanceToNextRank = maxCellHeight / 2.0
				+ lastRankMaxCellHeight / 2.0 + this.interRankCellSpacing;
		lastRankMaxCellHeight = maxCellHeight;

		if (this.orientation == mxConstants.DIRECTION_NORTH ||
			this.orientation == mxConstants.DIRECTION_WEST)
		{
			y += distanceToNextRank;
		}
		else
		{
			y -= distanceToNextRank;
		}

		for (var i = 0; i < rank.length; i++)
		{
			var cell = rank[i];
			cell.setY(rankValue, y);
		}
	}
};

/**
 * Function: minPath
 * 
 * Straightens out chains of virtual nodes where possibleacade to those stored after this layout
 * processing step has completed.
 * 
 * Parameters:
 *
 * graph - the facade describing the input graph
 * model - an internal model of the hierarchical layout
 */
mxCoordinateAssignment.prototype.minPath = function(graph, model)
{
	// Work down and up each edge with at least 2 control points
	// trying to straighten each one out. If the same number of
	// straight segments are formed in both directions, the 
	// preferred direction used is the one where the final
	// control points have the least offset from the connectable 
	// region of the terminating vertices
	var edges = model.edgeMapper.getValues();
	
	for (var j = 0; j < edges.length; j++)
	{
		var cell = edges[j];
		
		if (cell.maxRank - cell.minRank - 1 < 1)
		{
			continue;
		}

		// At least two virtual nodes in the edge
		// Check first whether the edge is already straight
		var referenceX = cell
				.getGeneralPurposeVariable(cell.minRank + 1);
		var edgeStraight = true;
		var refSegCount = 0;
		
		for (var i = cell.minRank + 2; i < cell.maxRank; i++)
		{
			var x = cell.getGeneralPurposeVariable(i);

			if (referenceX != x)
			{
				edgeStraight = false;
				referenceX = x;
			}
			else
			{
				refSegCount++;
			}
		}

		if (!edgeStraight)
		{
			var upSegCount = 0;
			var downSegCount = 0;
			var upXPositions = [];
			var downXPositions = [];

			var currentX = cell.getGeneralPurposeVariable(cell.minRank + 1);

			for (var i = cell.minRank + 1; i < cell.maxRank - 1; i++)
			{
				// Attempt to straight out the control point on the
				// next segment up with the current control point.
				var nextX = cell.getX(i + 1);

				if (currentX == nextX)
				{
					upXPositions[i - cell.minRank - 1] = currentX;
					upSegCount++;
				}
				else if (this.repositionValid(model, cell, i + 1, currentX))
				{
					upXPositions[i - cell.minRank - 1] = currentX;
					upSegCount++;
					// Leave currentX at same value
				}
				else
				{
					upXPositions[i - cell.minRank - 1] = nextX;
					currentX = nextX;
				}				
			}

			currentX = cell.getX(i);

			for (var i = cell.maxRank - 1; i > cell.minRank + 1; i--)
			{
				// Attempt to straight out the control point on the
				// next segment down with the current control point.
				var nextX = cell.getX(i - 1);

				if (currentX == nextX)
				{
					downXPositions[i - cell.minRank - 2] = currentX;
					downSegCount++;
				}
				else if (this.repositionValid(model, cell, i - 1, currentX))
				{
					downXPositions[i - cell.minRank - 2] = currentX;
					downSegCount++;
					// Leave currentX at same value
				}
				else
				{
					downXPositions[i - cell.minRank - 2] = cell.getX(i-1);
					currentX = nextX;
				}
			}

			if (downSegCount > refSegCount || upSegCount > refSegCount)
			{
				if (downSegCount >= upSegCount)
				{
					// Apply down calculation values
					for (var i = cell.maxRank - 2; i > cell.minRank; i--)
					{
						cell.setX(i, downXPositions[i - cell.minRank - 1]);
					}
				}
				else if (upSegCount > downSegCount)
				{
					// Apply up calculation values
					for (var i = cell.minRank + 2; i < cell.maxRank; i++)
					{
						cell.setX(i, upXPositions[i - cell.minRank - 2]);
					}
				}
				else
				{
					// Neither direction provided a favourable result
					// But both calculations are better than the
					// existing solution, so apply the one with minimal
					// offset to attached vertices at either end.
				}
			}
		}
	}
};

/**
 * Function: repositionValid
 * 
 * Determines whether or not a node may be moved to the specified x 
 * position on the specified rank
 * 
 * Parameters:
 *
 * model - the layout model
 * cell - the cell being analysed
 * rank - the layer of the cell
 * position - the x position being sought
 */
mxCoordinateAssignment.prototype.repositionValid = function(model, cell, rank, position)
{
	var rankArray = model.ranks[rank];
	var rankIndex = -1;

	for (var i = 0; i < rankArray.length; i++)
	{
		if (cell == rankArray[i])
		{
			rankIndex = i;
			break;
		}
	}

	if (rankIndex < 0)
	{
		return false;
	}

	var currentX = cell.getGeneralPurposeVariable(rank);

	if (position < currentX)
	{
		// Trying to move node to the left.
		if (rankIndex == 0)
		{
			// Left-most node, can move anywhere
			return true;
		}

		var leftCell = rankArray[rankIndex - 1];
		var leftLimit = leftCell.getGeneralPurposeVariable(rank);
		leftLimit = leftLimit + leftCell.width / 2
				+ this.intraCellSpacing + cell.width / 2;

		if (leftLimit <= position)
		{
			return true;
		}
		else
		{
			return false;
		}
	}
	else if (position > currentX)
	{
		// Trying to move node to the right.
		if (rankIndex == rankArray.length - 1)
		{
			// Right-most node, can move anywhere
			return true;
		}

		var rightCell = rankArray[rankIndex + 1];
		var rightLimit = rightCell.getGeneralPurposeVariable(rank);
		rightLimit = rightLimit - rightCell.width / 2
				- this.intraCellSpacing - cell.width / 2;

		if (rightLimit >= position)
		{
			return true;
		}
		else
		{
			return false;
		}
	}

	return true;
};

/**
 * Function: setCellLocations
 * 
 * Sets the cell locations in the facade to those stored after this layout
 * processing step has completed.
 * 
 * Parameters:
 *
 * graph - the input graph
 * model - the layout model
 */
mxCoordinateAssignment.prototype.setCellLocations = function(graph, model)
{
	this.rankTopY = [];
	this.rankBottomY = [];

	for (var i = 0; i < model.ranks.length; i++)
	{
		this.rankTopY[i] = Number.MAX_VALUE;
		this.rankBottomY[i] = -Number.MAX_VALUE;
	}
	
	var vertices = model.vertexMapper.getValues();

	// Process vertices all first, since they define the lower and 
	// limits of each rank. Between these limits lie the channels
	// where the edges can be routed across the graph

	for (var i = 0; i < vertices.length; i++)
	{
		this.setVertexLocation(vertices[i]);
	}
	
	// Post process edge styles. Needs the vertex locations set for initial
	// values of the top and bottoms of each rank
	if (this.layout.edgeStyle == mxHierarchicalEdgeStyle.ORTHOGONAL
			|| this.layout.edgeStyle == mxHierarchicalEdgeStyle.POLYLINE
			|| this.layout.edgeStyle == mxHierarchicalEdgeStyle.CURVE)
	{
		this.localEdgeProcessing(model);
	}

	var edges = model.edgeMapper.getValues();

	for (var i = 0; i < edges.length; i++)
	{
		this.setEdgePosition(edges[i]);
	}
};

/**
 * Function: localEdgeProcessing
 * 
 * Separates the x position of edges as they connect to vertices
 * 
 * Parameters:
 *
 * model - the layout model
 */
mxCoordinateAssignment.prototype.localEdgeProcessing = function(model)
{
	// Iterate through each vertex, look at the edges connected in
	// both directions.
	for (var rankIndex = 0; rankIndex < model.ranks.length; rankIndex++)
	{
		var rank = model.ranks[rankIndex];

		for (var cellIndex = 0; cellIndex < rank.length; cellIndex++)
		{
			var cell = rank[cellIndex];

			if (cell.isVertex())
			{
				var currentCells = cell.getPreviousLayerConnectedCells(rankIndex);

				var currentRank = rankIndex - 1;

				// Two loops, last connected cells, and next
				for (var k = 0; k < 2; k++)
				{
					if (currentRank > -1
							&& currentRank < model.ranks.length
							&& currentCells != null
							&& currentCells.length > 0)
					{
						var sortedCells = [];

						for (var j = 0; j < currentCells.length; j++)
						{
							var sorter = new WeightedCellSorter(
									currentCells[j], currentCells[j].getX(currentRank));
							sortedCells.push(sorter);
						}

						sortedCells.sort(WeightedCellSorter.prototype.compare);

						var leftLimit = cell.x[0] - cell.width / 2;
						var rightLimit = leftLimit + cell.width;

						// Connected edge count starts at 1 to allow for buffer
						// with edge of vertex
						var connectedEdgeCount = 0;
						var connectedEdgeGroupCount = 0;
						var connectedEdges = [];
						// Calculate width requirements for all connected edges
						for (var j = 0; j < sortedCells.length; j++)
						{
							var innerCell = sortedCells[j].cell;
							var connections;

							if (innerCell.isVertex())
							{
								// Get the connecting edge
								if (k == 0)
								{
									connections = cell.connectsAsSource;

								}
								else
								{
									connections = cell.connectsAsTarget;
								}

								for (var connIndex = 0; connIndex < connections.length; connIndex++)
								{
									if (connections[connIndex].source == innerCell
											|| connections[connIndex].target == innerCell)
									{
										connectedEdgeCount += connections[connIndex].edges
												.length;
										connectedEdgeGroupCount++;

										connectedEdges.push(connections[connIndex]);
									}
								}
							}
							else
							{
								connectedEdgeCount += innerCell.edges.length;
								connectedEdgeGroupCount++;
								connectedEdges.push(innerCell);
							}
						}

						var requiredWidth = (connectedEdgeCount + 1)
								* this.prefHozEdgeSep;

						// Add a buffer on the edges of the vertex if the edge count allows
						if (cell.width > requiredWidth
								+ (2 * this.prefHozEdgeSep))
						{
							leftLimit += this.prefHozEdgeSep;
							rightLimit -= this.prefHozEdgeSep;
						}

						var availableWidth = rightLimit - leftLimit;
						var edgeSpacing = availableWidth / connectedEdgeCount;

						var currentX = leftLimit + edgeSpacing / 2.0;
						var currentYOffset = this.minEdgeJetty - this.prefVertEdgeOff;
						var maxYOffset = 0;

						for (var j = 0; j < connectedEdges.length; j++)
						{
							var numActualEdges = connectedEdges[j].edges
									.length;
							var pos = this.jettyPositions[connectedEdges[j].ids[0]];
							
							if (pos == null)
							{
								pos = [];
								this.jettyPositions[connectedEdges[j].ids[0]] = pos;
							}

							if (j < connectedEdgeCount / 2)
							{
								currentYOffset += this.prefVertEdgeOff;
							}
							else if (j > connectedEdgeCount / 2)
							{
								currentYOffset -= this.prefVertEdgeOff;
							}
							// Ignore the case if equals, this means the second of 2
							// jettys with the same y (even number of edges)

							for (var m = 0; m < numActualEdges; m++)
							{
								pos[m * 4 + k * 2] = currentX;
								currentX += edgeSpacing;
								pos[m * 4 + k * 2 + 1] = currentYOffset;
							}
							
							maxYOffset = Math.max(maxYOffset,
									currentYOffset);
						}
					}

					currentCells = cell.getNextLayerConnectedCells(rankIndex);

					currentRank = rankIndex + 1;
				}
			}
		}
	}
};

/**
 * Function: setEdgePosition
 * 
 * Fixes the control points
 */
mxCoordinateAssignment.prototype.setEdgePosition = function(cell)
{
	// For parallel edges we need to seperate out the points a
	// little
	var offsetX = 0;
	// Only set the edge control points once

	if (cell.temp[0] != 101207)
	{
		var maxRank = cell.maxRank;
		var minRank = cell.minRank;
		
		if (maxRank == minRank)
		{
			maxRank = cell.source.maxRank;
			minRank = cell.target.minRank;
		}
		
		var parallelEdgeCount = 0;
		var jettys = this.jettyPositions[cell.ids[0]];

		var source = cell.isReversed ? cell.target.cell : cell.source.cell;
		var graph = this.layout.graph;
		var layoutReversed = this.orientation == mxConstants.DIRECTION_EAST
				|| this.orientation == mxConstants.DIRECTION_SOUTH;

		for (var i = 0; i < cell.edges.length; i++)
		{
			var realEdge = cell.edges[i];
			var realSource = this.layout.getVisibleTerminal(realEdge, true);

			//List oldPoints = graph.getPoints(realEdge);
			var newPoints = [];

			// Single length reversed edges end up with the jettys in the wrong
			// places. Since single length edges only have jettys, not segment
			// control points, we just say the edge isn't reversed in this section
			var reversed = cell.isReversed;
			
			if (realSource != source)
			{
				// The real edges include all core model edges and these can go
				// in both directions. If the source of the hierarchical model edge
				// isn't the source of the specific real edge in this iteration
				// treat if as reversed
				reversed = !reversed;
			}

			// First jetty of edge
			if (jettys != null)
			{
				var arrayOffset = reversed ? 2 : 0;
				var y = reversed ?
						(layoutReversed ? this.rankBottomY[minRank] : this.rankTopY[minRank]) :
							(layoutReversed ? this.rankTopY[maxRank] : this.rankBottomY[maxRank]);
				var jetty = jettys[parallelEdgeCount * 4 + 1 + arrayOffset];
				
				if (reversed != layoutReversed)
				{
					jetty = -jetty;
				}
				
				y += jetty;
				var x = jettys[parallelEdgeCount * 4 + arrayOffset];
				
				var modelSource = graph.model.getTerminal(realEdge, true);

				if (this.layout.isPort(modelSource) && graph.model.getParent(modelSource) == realSource)
				{
					var state = graph.view.getState(modelSource);
					
					if (state != null)
					{
						x = state.x;
					}
					else
					{
						x = realSource.geometry.x + cell.source.width * modelSource.geometry.x;
					}
				}

				if (this.orientation == mxConstants.DIRECTION_NORTH
						|| this.orientation == mxConstants.DIRECTION_SOUTH)
				{
					newPoints.push(new mxPoint(x, y));
					
					if (this.layout.edgeStyle == mxHierarchicalEdgeStyle.CURVE)
					{
						newPoints.push(new mxPoint(x, y + jetty));
					}
				}
				else
				{
					newPoints.push(new mxPoint(y, x));
					
					if (this.layout.edgeStyle == mxHierarchicalEdgeStyle.CURVE)
					{
						newPoints.push(new mxPoint(y + jetty, x));
					}
				}
			}

			// Declare variables to define loop through edge points and 
			// change direction if edge is reversed

			var loopStart = cell.x.length - 1;
			var loopLimit = -1;
			var loopDelta = -1;
			var currentRank = cell.maxRank - 1;

			if (reversed)
			{
				loopStart = 0;
				loopLimit = cell.x.length;
				loopDelta = 1;
				currentRank = cell.minRank + 1;
			}
			// Reversed edges need the points inserted in
			// reverse order
			for (var j = loopStart; (cell.maxRank != cell.minRank) && j != loopLimit; j += loopDelta)
			{
				// The horizontal position in a vertical layout
				var positionX = cell.x[j] + offsetX;

				// Work out the vertical positions in a vertical layout
				// in the edge buffer channels above and below this rank
				var topChannelY = (this.rankTopY[currentRank] + this.rankBottomY[currentRank + 1]) / 2.0;
				var bottomChannelY = (this.rankTopY[currentRank - 1] + this.rankBottomY[currentRank]) / 2.0;

				if (reversed)
				{
					var tmp = topChannelY;
					topChannelY = bottomChannelY;
					bottomChannelY = tmp;
				}

				if (this.orientation == mxConstants.DIRECTION_NORTH ||
					this.orientation == mxConstants.DIRECTION_SOUTH)
				{
					newPoints.push(new mxPoint(positionX, topChannelY));
					newPoints.push(new mxPoint(positionX, bottomChannelY));
				}
				else
				{
					newPoints.push(new mxPoint(topChannelY, positionX));
					newPoints.push(new mxPoint(bottomChannelY, positionX));
				}

				this.limitX = Math.max(this.limitX, positionX);
				currentRank += loopDelta;
			}

			// Second jetty of edge
			if (jettys != null)
			{
				var arrayOffset = reversed ? 2 : 0;
				var rankY = reversed ?
						(layoutReversed ? this.rankTopY[maxRank] : this.rankBottomY[maxRank]) :
							(layoutReversed ? this.rankBottomY[minRank] : this.rankTopY[minRank]);
				var jetty = jettys[parallelEdgeCount * 4 + 3 - arrayOffset];
				
				if (reversed != layoutReversed)
				{
					jetty = -jetty;
				}
				var y = rankY - jetty;
				var x = jettys[parallelEdgeCount * 4 + 2 - arrayOffset];
				
				var modelTarget = graph.model.getTerminal(realEdge, false);
				var realTarget = this.layout.getVisibleTerminal(realEdge, false);

				if (this.layout.isPort(modelTarget) && graph.model.getParent(modelTarget) == realTarget)
				{
					var state = graph.view.getState(modelTarget);
					
					if (state != null)
					{
						x = state.x;
					}
					else
					{
						x = realTarget.geometry.x + cell.target.width * modelTarget.geometry.x;
					}
				}

				if (this.orientation == mxConstants.DIRECTION_NORTH ||
						this.orientation == mxConstants.DIRECTION_SOUTH)
				{
					if (this.layout.edgeStyle == mxHierarchicalEdgeStyle.CURVE)
					{
						newPoints.push(new mxPoint(x, y - jetty));
					}

					newPoints.push(new mxPoint(x, y));
				}
				else
				{
					if (this.layout.edgeStyle == mxHierarchicalEdgeStyle.CURVE)
					{
						newPoints.push(new mxPoint(y - jetty, x));
					}

					newPoints.push(new mxPoint(y, x));
				}
			}

			if (cell.isReversed)
			{
				this.processReversedEdge(cell, realEdge);
			}

			this.layout.setEdgePoints(realEdge, newPoints);
			
			// Resets edge label position
			if (this.layout.resetEdgeLabels &&
				realEdge.geometry != null)
			{
				geometry = realEdge.geometry.clone();
				geometry.relative = true;
				geometry.x = 0;
				geometry.y = 0;

				graph.model.setGeometry(realEdge, geometry);
			}

			// Increase offset so next edge is drawn next to
			// this one
			if (offsetX == 0.0)
			{
				offsetX = this.parallelEdgeSpacing;
			}
			else if (offsetX > 0)
			{
				offsetX = -offsetX;
			}
			else
			{
				offsetX = -offsetX + this.parallelEdgeSpacing;
			}
			
			parallelEdgeCount++;
		}

		cell.temp[0] = 101207;
	}
};


/**
 * Function: setVertexLocation
 * 
 * Fixes the position of the specified vertex.
 * 
 * Parameters:
 * 
 * cell - the vertex to position
 */
mxCoordinateAssignment.prototype.setVertexLocation = function(cell)
{
	var realCell = cell.cell;
	var positionX = cell.x[0] - cell.width / 2;
	var positionY = cell.y[0] - cell.height / 2;

	this.rankTopY[cell.minRank] = Math.min(this.rankTopY[cell.minRank], positionY);
	this.rankBottomY[cell.minRank] = Math.max(this.rankBottomY[cell.minRank],
			positionY + cell.height);

	if (this.orientation == mxConstants.DIRECTION_NORTH ||
		this.orientation == mxConstants.DIRECTION_SOUTH)
	{
		this.layout.setVertexLocation(realCell, positionX, positionY);
	}
	else
	{
		this.layout.setVertexLocation(realCell, positionY, positionX);
	}

	this.limitX = Math.max(this.limitX, positionX + cell.width);
};

/**
 * Function: processReversedEdge
 * 
 * Hook to add additional processing
 * 
 * Parameters:
 * 
 * edge - the hierarchical model edge
 * realEdge - the real edge in the graph
 */
mxCoordinateAssignment.prototype.processReversedEdge = function(graph, model)
{
	// hook for subclassers
};
