/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: mxMinimumCycleRemover
 * 
 * An implementation of the first stage of the Sugiyama layout. Straightforward
 * longest path calculation of layer assignment
 * 
 * Constructor: mxMinimumCycleRemover
 *
 * Creates a cycle remover for the given internal model.
 */
function mxMinimumCycleRemover(layout)
{
	this.layout = layout;
};

/**
 * Extends mxHierarchicalLayoutStage.
 */
mxMinimumCycleRemover.prototype = new mxHierarchicalLayoutStage();
mxMinimumCycleRemover.prototype.constructor = mxMinimumCycleRemover;

/**
 * Variable: layout
 * 
 * Reference to the enclosing <mxHierarchicalLayout>.
 */
mxMinimumCycleRemover.prototype.layout = null;

/**
 * Function: execute
 * 
 * Takes the graph detail and configuration information within the facade
 * and creates the resulting laid out graph within that facade for further
 * use.
 */
mxMinimumCycleRemover.prototype.execute = function(parent)
{
	var model = this.layout.getModel();
	var seenNodes = new Object();
	var unseenNodesArray = model.vertexMapper.getValues();
	var unseenNodes = new Object();
	
	for (var i = 0; i < unseenNodesArray.length; i++)
	{
		unseenNodes[unseenNodesArray[i].id] = unseenNodesArray[i];
	}
	
	// Perform a dfs through the internal model. If a cycle is found,
	// reverse it.
	var rootsArray = null;
	
	if (model.roots != null)
	{
		var modelRoots = model.roots;
		rootsArray = [];
		
		for (var i = 0; i < modelRoots.length; i++)
		{
			rootsArray[i] = model.vertexMapper.get(modelRoots[i]);
		}
	}

	model.visit(function(parent, node, connectingEdge, layer, seen)
	{
		// Check if the cell is in it's own ancestor list, if so
		// invert the connecting edge and reverse the target/source
		// relationship to that edge in the parent and the cell
		if (node.isAncestor(parent))
		{
			connectingEdge.invert();
			mxUtils.remove(connectingEdge, parent.connectsAsSource);
			parent.connectsAsTarget.push(connectingEdge);
			mxUtils.remove(connectingEdge, node.connectsAsTarget);
			node.connectsAsSource.push(connectingEdge);
		}
		
		seenNodes[node.id] = node;
		delete unseenNodes[node.id];
	}, rootsArray, true, null);

	// If there are any nodes that should be nodes that the dfs can miss
	// these need to be processed with the dfs and the roots assigned
	// correctly to form a correct internal model
	var seenNodesCopy = mxUtils.clone(seenNodes, null, true);

	// Pick a random cell and dfs from it
	model.visit(function(parent, node, connectingEdge, layer, seen)
	{
		// Check if the cell is in it's own ancestor list, if so
		// invert the connecting edge and reverse the target/source
		// relationship to that edge in the parent and the cell
		if (node.isAncestor(parent))
		{
			connectingEdge.invert();
			mxUtils.remove(connectingEdge, parent.connectsAsSource);
			node.connectsAsSource.push(connectingEdge);
			parent.connectsAsTarget.push(connectingEdge);
			mxUtils.remove(connectingEdge, node.connectsAsTarget);
		}
		
		seenNodes[node.id] = node;
		delete unseenNodes[node.id];
	}, unseenNodes, true, seenNodesCopy);
};
