/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: mxGraphAbstractHierarchyCell
 * 
 * An abstraction of an internal hierarchy node or edge
 * 
 * Constructor: mxGraphAbstractHierarchyCell
 *
 * Constructs a new hierarchical layout algorithm.
 */
function mxGraphAbstractHierarchyCell()
{
	this.x = [];
	this.y = [];
	this.temp = [];
};

/**
 * Variable: maxRank
 * 
 * The maximum rank this cell occupies. Default is -1.
 */
mxGraphAbstractHierarchyCell.prototype.maxRank = -1;

/**
 * Variable: minRank
 * 
 * The minimum rank this cell occupies. Default is -1.
 */
mxGraphAbstractHierarchyCell.prototype.minRank = -1;

/**
 * Variable: x
 * 
 * The x position of this cell for each layer it occupies
 */
mxGraphAbstractHierarchyCell.prototype.x = null;

/**
 * Variable: y
 * 
 * The y position of this cell for each layer it occupies
 */
mxGraphAbstractHierarchyCell.prototype.y = null;

/**
 * Variable: width
 * 
 * The width of this cell. Default is 0.
 */
mxGraphAbstractHierarchyCell.prototype.width = 0;

/**
 * Variable: height
 * 
 * The height of this cell. Default is 0.
 */
mxGraphAbstractHierarchyCell.prototype.height = 0;

/**
 * Variable: nextLayerConnectedCells
 * 
 * A cached version of the cells this cell connects to on the next layer up
 */
mxGraphAbstractHierarchyCell.prototype.nextLayerConnectedCells = null;

/**
 * Variable: previousLayerConnectedCells
 * 
 * A cached version of the cells this cell connects to on the next layer down
 */
mxGraphAbstractHierarchyCell.prototype.previousLayerConnectedCells = null;

/**
 * Variable: temp
 * 
 * Temporary variable for general use. Generally, try to avoid
 * carrying information between stages. Currently, the longest
 * path layering sets temp to the rank position in fixRanks()
 * and the crossing reduction uses this. This meant temp couldn't
 * be used for hashing the nodes in the model dfs and so hashCode
 * was created
 */
mxGraphAbstractHierarchyCell.prototype.temp = null;

/**
 * Function: getNextLayerConnectedCells
 * 
 * Returns the cells this cell connects to on the next layer up
 */
mxGraphAbstractHierarchyCell.prototype.getNextLayerConnectedCells = function(layer)
{
	return null;
};

/**
 * Function: getPreviousLayerConnectedCells
 * 
 * Returns the cells this cell connects to on the next layer down
 */
mxGraphAbstractHierarchyCell.prototype.getPreviousLayerConnectedCells = function(layer)
{
	return null;
};

/**
 * Function: isEdge
 * 
 * Returns whether or not this cell is an edge
 */
mxGraphAbstractHierarchyCell.prototype.isEdge = function()
{
	return false;
};

/**
 * Function: isVertex
 * 
 * Returns whether or not this cell is a node
 */
mxGraphAbstractHierarchyCell.prototype.isVertex = function()
{
	return false;
};

/**
 * Function: getGeneralPurposeVariable
 * 
 * Gets the value of temp for the specified layer
 */
mxGraphAbstractHierarchyCell.prototype.getGeneralPurposeVariable = function(layer)
{
	return null;
};

/**
 * Function: setGeneralPurposeVariable
 * 
 * Set the value of temp for the specified layer
 */
mxGraphAbstractHierarchyCell.prototype.setGeneralPurposeVariable = function(layer, value)
{
	return null;
};

/**
 * Function: setX
 * 
 * Set the value of x for the specified layer
 */
mxGraphAbstractHierarchyCell.prototype.setX = function(layer, value)
{
	if (this.isVertex())
	{
		this.x[0] = value;
	}
	else if (this.isEdge())
	{
		this.x[layer - this.minRank - 1] = value;
	}
};

/**
 * Function: getX
 * 
 * Gets the value of x on the specified layer
 */
mxGraphAbstractHierarchyCell.prototype.getX = function(layer)
{
	if (this.isVertex())
	{
		return this.x[0];
	}
	else if (this.isEdge())
	{
		return this.x[layer - this.minRank - 1];
	}

	return 0.0;
};

/**
 * Function: setY
 * 
 * Set the value of y for the specified layer
 */
mxGraphAbstractHierarchyCell.prototype.setY = function(layer, value)
{
	if (this.isVertex())
	{
		this.y[0] = value;
	}
	else if (this.isEdge())
	{
		this.y[layer -this. minRank - 1] = value;
	}
};
