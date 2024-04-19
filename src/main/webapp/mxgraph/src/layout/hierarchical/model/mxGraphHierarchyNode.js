/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: mxGraphHierarchyNode
 * 
 * An abstraction of a hierarchical edge for the hierarchy layout
 * 
 * Constructor: mxGraphHierarchyNode
 *
 * Constructs an internal node to represent the specified real graph cell
 *
 * Arguments:
 * 
 * cell - the real graph cell this node represents
 */
function mxGraphHierarchyNode(cell)
{
	mxGraphAbstractHierarchyCell.apply(this, arguments);
	this.cell = cell;
	this.id = mxObjectIdentity.get(cell);
	this.connectsAsTarget = [];
	this.connectsAsSource = [];
};

/**
 * Extends mxGraphAbstractHierarchyCell.
 */
mxGraphHierarchyNode.prototype = new mxGraphAbstractHierarchyCell();
mxGraphHierarchyNode.prototype.constructor = mxGraphHierarchyNode;

/**
 * Variable: cell
 * 
 * The graph cell this object represents.
 */
mxGraphHierarchyNode.prototype.cell = null;

/**
 * Variable: id
 * 
 * The object identity of the wrapped cell
 */
mxGraphHierarchyNode.prototype.id = null;

/**
 * Variable: connectsAsTarget
 * 
 * Collection of hierarchy edges that have this node as a target
 */
mxGraphHierarchyNode.prototype.connectsAsTarget = null;

/**
 * Variable: connectsAsSource
 * 
 * Collection of hierarchy edges that have this node as a source
 */
mxGraphHierarchyNode.prototype.connectsAsSource = null;

/**
 * Variable: hashCode
 * 
 * Assigns a unique hashcode for each node. Used by the model dfs instead
 * of copying HashSets
 */
mxGraphHierarchyNode.prototype.hashCode = false;

/**
 * Function: getRankValue
 * 
 * Returns the integer value of the layer that this node resides in
 */
mxGraphHierarchyNode.prototype.getRankValue = function(layer)
{
	return this.maxRank;
};

/**
 * Function: getNextLayerConnectedCells
 * 
 * Returns the cells this cell connects to on the next layer up
 */
mxGraphHierarchyNode.prototype.getNextLayerConnectedCells = function(layer)
{
	if (this.nextLayerConnectedCells == null)
	{
		this.nextLayerConnectedCells = [];
		this.nextLayerConnectedCells[0] = [];
		
		for (var i = 0; i < this.connectsAsTarget.length; i++)
		{
			var edge = this.connectsAsTarget[i];

			if (edge.maxRank == -1 || edge.maxRank == layer + 1)
			{
				// Either edge is not in any rank or
				// no dummy nodes in edge, add node of other side of edge
				this.nextLayerConnectedCells[0].push(edge.source);
			}
			else
			{
				// Edge spans at least two layers, add edge
				this.nextLayerConnectedCells[0].push(edge);
			}
		}
	}

	return this.nextLayerConnectedCells[0];
};

/**
 * Function: getPreviousLayerConnectedCells
 * 
 * Returns the cells this cell connects to on the next layer down
 */
mxGraphHierarchyNode.prototype.getPreviousLayerConnectedCells = function(layer)
{
	if (this.previousLayerConnectedCells == null)
	{
		this.previousLayerConnectedCells = [];
		this.previousLayerConnectedCells[0] = [];
		
		for (var i = 0; i < this.connectsAsSource.length; i++)
		{
			var edge = this.connectsAsSource[i];

			if (edge.minRank == -1 || edge.minRank == layer - 1)
			{
				// No dummy nodes in edge, add node of other side of edge
				this.previousLayerConnectedCells[0].push(edge.target);
			}
			else
			{
				// Edge spans at least two layers, add edge
				this.previousLayerConnectedCells[0].push(edge);
			}
		}
	}

	return this.previousLayerConnectedCells[0];
};

/**
 * Function: isVertex
 * 
 * Returns true.
 */
mxGraphHierarchyNode.prototype.isVertex = function()
{
	return true;
};

/**
 * Function: getGeneralPurposeVariable
 * 
 * Gets the value of temp for the specified layer
 */
mxGraphHierarchyNode.prototype.getGeneralPurposeVariable = function(layer)
{
	return this.temp[0];
};

/**
 * Function: setGeneralPurposeVariable
 * 
 * Set the value of temp for the specified layer
 */
mxGraphHierarchyNode.prototype.setGeneralPurposeVariable = function(layer, value)
{
	this.temp[0] = value;
};

/**
 * Function: isAncestor
 */
mxGraphHierarchyNode.prototype.isAncestor = function(otherNode)
{
	// Firstly, the hash code of this node needs to be shorter than the
	// other node
	if (otherNode != null && this.hashCode != null && otherNode.hashCode != null
			&& this.hashCode.length < otherNode.hashCode.length)
	{
		if (this.hashCode == otherNode.hashCode)
		{
			return true;
		}
		
		if (this.hashCode == null || this.hashCode == null)
		{
			return false;
		}
		
		// Secondly, this hash code must match the start of the other
		// node's hash code. Arrays.equals cannot be used here since
		// the arrays are different length, and we do not want to
		// perform another array copy.
		for (var i = 0; i < this.hashCode.length; i++)
		{
			if (this.hashCode[i] != otherNode.hashCode[i])
			{
				return false;
			}
		}

		return true;
	}

	return false;
};

/**
 * Function: getCoreCell
 * 
 * Gets the core vertex associated with this wrapper
 */
mxGraphHierarchyNode.prototype.getCoreCell = function()
{
	return this.cell;
};
