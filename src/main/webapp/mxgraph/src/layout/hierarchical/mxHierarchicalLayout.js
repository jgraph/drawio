/**
 * Copyright (c) 2006-2018, JGraph Ltd
 * Copyright (c) 2006-2018, Gaudenz Alder
 */
/**
 * Class: mxHierarchicalLayout
 * 
 * A hierarchical layout algorithm.
 * 
 * Constructor: mxHierarchicalLayout
 *
 * Constructs a new hierarchical layout algorithm.
 *
 * Arguments:
 * 
 * graph - Reference to the enclosing <mxGraph>.
 * orientation - Optional constant that defines the orientation of this
 * layout.
 * deterministic - Optional boolean that specifies if this layout should be
 * deterministic. Default is true.
 */
function mxHierarchicalLayout(graph, orientation, deterministic)
{
	mxGraphLayout.call(this, graph);
	this.orientation = (orientation != null) ? orientation : mxConstants.DIRECTION_NORTH;
	this.deterministic = (deterministic != null) ? deterministic : true;
};

var mxHierarchicalEdgeStyle =
{
	ORTHOGONAL: 1,
	POLYLINE: 2,
	STRAIGHT: 3,
	CURVE: 4
};

/**
 * Extends mxGraphLayout.
 */
mxHierarchicalLayout.prototype = new mxGraphLayout();
mxHierarchicalLayout.prototype.constructor = mxHierarchicalLayout;

/**
 * Variable: roots
 * 
 * Holds the array of <mxCell> that this layout contains.
 */
mxHierarchicalLayout.prototype.roots = null;

/**
 * Variable: resizeParent
 * 
 * Specifies if the parent should be resized after the layout so that it
 * contains all the child cells. Default is false. See also <parentBorder>.
 */
mxHierarchicalLayout.prototype.resizeParent = false;

/**
 * Variable: maintainParentLocation
 * 
 * Specifies if the parent location should be maintained, so that the
 * top, left corner stays the same before and after execution of
 * the layout. Default is false for backwards compatibility.
 */
mxHierarchicalLayout.prototype.maintainParentLocation = false;

/**
 * Variable: moveParent
 * 
 * Specifies if the parent should be moved if <resizeParent> is enabled.
 * Default is false.
 */
mxHierarchicalLayout.prototype.moveParent = false;

/**
 * Variable: parentBorder
 * 
 * The border to be added around the children if the parent is to be
 * resized using <resizeParent>. Default is 0.
 */
mxHierarchicalLayout.prototype.parentBorder = 0;

/**
 * Variable: intraCellSpacing
 * 
 * The spacing buffer added between cells on the same layer. Default is 30.
 */
mxHierarchicalLayout.prototype.intraCellSpacing = 30;

/**
 * Variable: interRankCellSpacing
 * 
 * The spacing buffer added between cell on adjacent layers. Default is 100.
 */
mxHierarchicalLayout.prototype.interRankCellSpacing = 100;

/**
 * Variable: interHierarchySpacing
 * 
 * The spacing buffer between unconnected hierarchies. Default is 60.
 */
mxHierarchicalLayout.prototype.interHierarchySpacing = 60;

/**
 * Variable: parallelEdgeSpacing
 * 
 * The distance between each parallel edge on each ranks for long edges.
 * Default is 10.
 */
mxHierarchicalLayout.prototype.parallelEdgeSpacing = 10;

/**
 * Variable: orientation
 * 
 * The position of the root node(s) relative to the laid out graph in.
 * Default is <mxConstants.DIRECTION_NORTH>.
 */
mxHierarchicalLayout.prototype.orientation = mxConstants.DIRECTION_NORTH;

/**
 * Variable: fineTuning
 * 
 * Whether or not to perform local optimisations and iterate multiple times
 * through the algorithm. Default is true.
 */
mxHierarchicalLayout.prototype.fineTuning = true;

/**
 * 
 * Variable: tightenToSource
 * 
 * Whether or not to tighten the assigned ranks of vertices up towards
 * the source cells. Default is true.
 */
mxHierarchicalLayout.prototype.tightenToSource = true;

/**
 * Variable: disableEdgeStyle
 * 
 * Specifies if the STYLE_NOEDGESTYLE flag should be set on edges that are
 * modified by the result. Default is true.
 */
mxHierarchicalLayout.prototype.disableEdgeStyle = true;

/**
 * Variable: resetEdgeLabels
 * 
 * Specifies if edge label positions should be reset to the center of the
 * edge. Default is true.
 */
mxHierarchicalLayout.prototype.resetEdgeLabels = true;

/**
 * Variable: traverseAncestors
 * 
 * Whether or not to drill into child cells and layout in reverse
 * group order. This also cause the layout to navigate edges whose 
 * terminal vertices have different parents but are in the same 
 * ancestry chain. Default is true.
 */
mxHierarchicalLayout.prototype.traverseAncestors = true;

/**
 * Variable: model
 * 
 * The internal <mxGraphHierarchyModel> formed of the layout.
 */
mxHierarchicalLayout.prototype.model = null;

/**
 * Variable: edgesSet
 * 
 * A cache of edges whose source terminal is the key
 */
mxHierarchicalLayout.prototype.edgesCache = null;

/**
 * Variable: edgesSet
 * 
 * A cache of edges whose source terminal is the key
 */
mxHierarchicalLayout.prototype.edgeSourceTermCache = null;

/**
 * Variable: edgesSet
 * 
 * A cache of edges whose source terminal is the key
 */
mxHierarchicalLayout.prototype.edgesTargetTermCache = null;

/**
 * Variable: edgeStyle
 * 
 * The style to apply between cell layers to edge segments.
 * Default is <mxHierarchicalEdgeStyle.POLYLINE>.
 */
mxHierarchicalLayout.prototype.edgeStyle = mxHierarchicalEdgeStyle.POLYLINE;

/**
 * Function: getModel
 * 
 * Returns the internal <mxGraphHierarchyModel> for this layout algorithm.
 */
mxHierarchicalLayout.prototype.getModel = function()
{
	return this.model;
};

/**
 * Function: execute
 * 
 * Executes the layout for the children of the specified parent.
 * 
 * Parameters:
 * 
 * parent - Parent <mxCell> that contains the children to be laid out.
 * roots - Optional starting roots of the layout.
 */
mxHierarchicalLayout.prototype.execute = function(parent, roots)
{
	this.parent = parent;
	var model = this.graph.model;
	this.edgesCache = new mxDictionary();
	this.edgeSourceTermCache = new mxDictionary();
	this.edgesTargetTermCache = new mxDictionary();

	if (roots != null && !(roots instanceof Array))
	{
		roots = [roots];
	}
	
	// If the roots are set and the parent is set, only
	// use the roots that are some dependent of the that
	// parent.
	// If just the root are set, use them as-is
	// If just the parent is set use it's immediate
	// children as the initial set

	if (roots == null && parent == null)
	{
		// TODO indicate the problem
		return;
	}
	
	//  Maintaining parent location
	this.parentX = null;
	this.parentY = null;
	
	if (parent != this.root && model.isVertex(parent) != null && this.maintainParentLocation)
	{
		var geo = this.graph.getCellGeometry(parent);
		
		if (geo != null)
		{
			this.parentX = geo.x;
			this.parentY = geo.y;
		}
	}
	
	if (roots != null)
	{
		var rootsCopy = [];

		for (var i = 0; i < roots.length; i++)
		{
			var ancestor = parent != null ? model.isAncestor(parent, roots[i]) : true;
			
			if (ancestor && model.isVertex(roots[i]))
			{
				rootsCopy.push(roots[i]);
			}
		}

		this.roots = rootsCopy;
	}
	
	model.beginUpdate();
	try
	{
		this.run(parent);
		
		if (this.resizeParent && !this.graph.isCellCollapsed(parent))
		{
			this.graph.updateGroupBounds([parent], this.parentBorder, this.moveParent);
		}
		
		// Maintaining parent location
		if (this.parentX != null && this.parentY != null)
		{
			var geo = this.graph.getCellGeometry(parent);
			
			if (geo != null)
			{
				geo = geo.clone();
				geo.x = this.parentX;
				geo.y = this.parentY;
				model.setGeometry(parent, geo);
			}
		}
	}
	finally
	{
		model.endUpdate();
	}
};

/**
 * Function: findRoots
 * 
 * Returns all visible children in the given parent which do not have
 * incoming edges. If the result is empty then the children with the
 * maximum difference between incoming and outgoing edges are returned.
 * This takes into account edges that are being promoted to the given
 * root due to invisible children or collapsed cells.
 * 
 * Parameters:
 * 
 * parent - <mxCell> whose children should be checked.
 * vertices - array of vertices to limit search to
 */
mxHierarchicalLayout.prototype.findRoots = function(parent, vertices)
{
	var roots = [];
	
	if (parent != null && vertices != null)
	{
		var model = this.graph.model;
		var best = null;
		var maxDiff = -100000;
		
		for (var i in vertices)
		{
			var cell = vertices[i];

			if (model.isVertex(cell) && this.graph.isCellVisible(cell))
			{
				var conns = this.getEdges(cell);
				var fanOut = 0;
				var fanIn = 0;

				for (var k = 0; k < conns.length; k++)
				{
					var src = this.getVisibleTerminal(conns[k], true);

					if (src == cell)
					{
						fanOut++;
					}
					else
					{
						fanIn++;
					}
				}

				if (fanIn == 0 && fanOut > 0)
				{
					roots.push(cell);
				}

				var diff = fanOut - fanIn;

				if (diff > maxDiff)
				{
					maxDiff = diff;
					best = cell;
				}
			}
		}
		
		if (roots.length == 0 && best != null)
		{
			roots.push(best);
		}
	}
	
	return roots;
};

/**
 * Function: getEdges
 * 
 * Returns the connected edges for the given cell.
 * 
 * Parameters:
 * 
 * cell - <mxCell> whose edges should be returned.
 */
mxHierarchicalLayout.prototype.getEdges = function(cell)
{
	var cachedEdges = this.edgesCache.get(cell);
	
	if (cachedEdges != null)
	{
		return cachedEdges;
	}

	var model = this.graph.model;
	var edges = [];
	var isCollapsed = this.graph.isCellCollapsed(cell);
	var childCount = model.getChildCount(cell);

	for (var i = 0; i < childCount; i++)
	{
		var child = model.getChildAt(cell, i);

		if (this.isPort(child))
		{
			edges = edges.concat(model.getEdges(child, true, true));
		}
		else if (isCollapsed || !this.graph.isCellVisible(child))
		{
			edges = edges.concat(model.getEdges(child, true, true));
		}
	}

	edges = edges.concat(model.getEdges(cell, true, true));
	var result = [];
	
	for (var i = 0; i < edges.length; i++)
	{
		var source = this.getVisibleTerminal(edges[i], true);
		var target = this.getVisibleTerminal(edges[i], false);
		
		if ((source == target) ||
				((source != target) &&
						((target == cell && (this.parent == null || this.isAncestor(this.parent, source, this.traverseAncestors))) ||
						 	(source == cell && (this.parent == null || this.isAncestor(this.parent, target, this.traverseAncestors))))))
		{
			result.push(edges[i]);
		}
	}

	this.edgesCache.put(cell, result);

	return result;
};

/**
 * Function: getVisibleTerminal
 * 
 * Helper function to return visible terminal for edge allowing for ports
 * 
 * Parameters:
 * 
 * edge - <mxCell> whose edges should be returned.
 * source - Boolean that specifies whether the source or target terminal is to be returned
 */
mxHierarchicalLayout.prototype.getVisibleTerminal = function(edge, source)
{
	var terminalCache = this.edgesTargetTermCache;
	
	if (source)
	{
		terminalCache = this.edgeSourceTermCache;
	}

	var term = terminalCache.get(edge);

	if (term != null)
	{
		return term;
	}

	var state = this.graph.view.getState(edge);
	
	var terminal = (state != null) ? state.getVisibleTerminal(source) : this.graph.view.getVisibleTerminal(edge, source);
	
	if (terminal == null)
	{
		terminal = (state != null) ? state.getVisibleTerminal(source) : this.graph.view.getVisibleTerminal(edge, source);
	}

	if (terminal != null)
	{
		if (this.isPort(terminal))
		{
			terminal = this.graph.model.getParent(terminal);
		}
		
		terminalCache.put(edge, terminal);
	}

	return terminal;
};

/**
 * Function: run
 * 
 * The API method used to exercise the layout upon the graph description
 * and produce a separate description of the vertex position and edge
 * routing changes made. It runs each stage of the layout that has been
 * created.
 */
mxHierarchicalLayout.prototype.run = function(parent)
{
	// Separate out unconnected hierarchies
	var hierarchyVertices = [];
	var allVertexSet = [];

	if (this.roots == null && parent != null)
	{
		var filledVertexSet = Object();
		this.filterDescendants(parent, filledVertexSet);

		this.roots = [];
		var filledVertexSetEmpty = true;

		// Poor man's isSetEmpty
		for (var key in filledVertexSet)
		{
			if (filledVertexSet[key] != null)
			{
				filledVertexSetEmpty = false;
				break;
			}
		}

		while (!filledVertexSetEmpty)
		{
			var candidateRoots = this.findRoots(parent, filledVertexSet);
			
			// If the candidate root is an unconnected group cell, remove it from
			// the layout. We may need a custom set that holds such groups and forces
			// them to be processed for resizing and/or moving.
			

			for (var i = 0; i < candidateRoots.length; i++)
			{
				var vertexSet = Object();
				hierarchyVertices.push(vertexSet);

				this.traverse(candidateRoots[i], true, null, allVertexSet, vertexSet,
						hierarchyVertices, filledVertexSet);
			}

			for (var i = 0; i < candidateRoots.length; i++)
			{
				this.roots.push(candidateRoots[i]);
			}
			
			filledVertexSetEmpty = true;
			
			// Poor man's isSetEmpty
			for (var key in filledVertexSet)
			{
				if (filledVertexSet[key] != null)
				{
					filledVertexSetEmpty = false;
					break;
				}
			}
		}
	}
	else
	{
		// Find vertex set as directed traversal from roots

		for (var i = 0; i < this.roots.length; i++)
		{
			var vertexSet = Object();
			hierarchyVertices.push(vertexSet);

			this.traverse(this.roots[i], true, null, allVertexSet, vertexSet,
					hierarchyVertices, null);
		}
	}

	// Iterate through the result removing parents who have children in this layout
	
	// Perform a layout for each seperate hierarchy
	// Track initial coordinate x-positioning
	var initialX = 0;

	for (var i = 0; i < hierarchyVertices.length; i++)
	{
		var vertexSet = hierarchyVertices[i];
		var tmp = [];
		
		for (var key in vertexSet)
		{
			tmp.push(vertexSet[key]);
		}
		
		this.model = new mxGraphHierarchyModel(this, tmp, this.roots,
			parent, this.tightenToSource);

		this.cycleStage(parent);
		this.layeringStage();
		
		this.crossingStage(parent);
		initialX = this.placementStage(initialX, parent);
	}
};

/**
 * Function: filterDescendants
 * 
 * Creates an array of descendant cells
 */
mxHierarchicalLayout.prototype.filterDescendants = function(cell, result)
{
	var model = this.graph.model;

	if (model.isVertex(cell) && cell != this.parent && this.graph.isCellVisible(cell))
	{
		result[mxObjectIdentity.get(cell)] = cell;
	}

	if (this.traverseAncestors || cell == this.parent
			&& this.graph.isCellVisible(cell))
	{
		var childCount = model.getChildCount(cell);

		for (var i = 0; i < childCount; i++)
		{
			var child = model.getChildAt(cell, i);
			
			// Ignore ports in the layout vertex list, they are dealt with
			// in the traversal mechanisms
			if (!this.isPort(child))
			{
				this.filterDescendants(child, result);
			}
		}
	}
};

/**
 * Function: isPort
 * 
 * Returns true if the given cell is a "port", that is, when connecting to
 * it, its parent is the connecting vertex in terms of graph traversal
 * 
 * Parameters:
 * 
 * cell - <mxCell> that represents the port.
 */
mxHierarchicalLayout.prototype.isPort = function(cell)
{
	if (cell != null && cell.geometry != null)
	{
		return cell.geometry.relative;
	}
	else
	{
		return false;
	}
};

/**
 * Function: getEdgesBetween
 * 
 * Returns the edges between the given source and target. This takes into
 * account collapsed and invisible cells and ports.
 * 
 * Parameters:
 * 
 * source -
 * target -
 * directed -
 */
mxHierarchicalLayout.prototype.getEdgesBetween = function(source, target, directed)
{
	directed = (directed != null) ? directed : false;
	var edges = this.getEdges(source);
	var result = [];

	// Checks if the edge is connected to the correct
	// cell and returns the first match
	for (var i = 0; i < edges.length; i++)
	{
		var src = this.getVisibleTerminal(edges[i], true);
		var trg = this.getVisibleTerminal(edges[i], false);

		if ((src == source && trg == target) || (!directed && src == target && trg == source))
		{
			result.push(edges[i]);
		}
	}

	return result;
};

/**
 * Traverses the (directed) graph invoking the given function for each
 * visited vertex and edge. The function is invoked with the current vertex
 * and the incoming edge as a parameter. This implementation makes sure
 * each vertex is only visited once. The function may return false if the
 * traversal should stop at the given vertex.
 * 
 * Parameters:
 * 
 * vertex - <mxCell> that represents the vertex where the traversal starts.
 * directed - boolean indicating if edges should only be traversed
 * from source to target. Default is true.
 * edge - Optional <mxCell> that represents the incoming edge. This is
 * null for the first step of the traversal.
 * allVertices - Array of cell paths for the visited cells.
 */
mxHierarchicalLayout.prototype.traverse = function(vertex, directed, edge, allVertices, currentComp,
											hierarchyVertices, filledVertexSet)
{
	if (vertex != null && allVertices != null)
	{
		// Has this vertex been seen before in any traversal
		// And if the filled vertex set is populated, only 
		// process vertices in that it contains
		var vertexID = mxObjectIdentity.get(vertex);
		
		if ((allVertices[vertexID] == null)
				&& (filledVertexSet == null ? true : filledVertexSet[vertexID] != null))
		{
			if (currentComp[vertexID] == null)
			{
				currentComp[vertexID] = vertex;
			}
			if (allVertices[vertexID] == null)
			{
				allVertices[vertexID] = vertex;
			}

			if (filledVertexSet !== null)
			{
				delete filledVertexSet[vertexID];
			}

			var edges = this.getEdges(vertex);
			var edgeIsSource = [];

			for (var i = 0; i < edges.length; i++)
			{
				edgeIsSource[i] = (this.getVisibleTerminal(edges[i], true) == vertex);
			}

			for (var i = 0; i < edges.length; i++)
			{
				if (!directed || edgeIsSource[i])
				{
					var next = this.getVisibleTerminal(edges[i], !edgeIsSource[i]);
					
					// Check whether there are more edges incoming from the target vertex than outgoing
					// The hierarchical model treats bi-directional parallel edges as being sourced
					// from the more "sourced" terminal. If the directions are equal in number, the direction
					// is that of the natural direction from the roots of the layout.
					// The checks below are slightly more verbose than need be for performance reasons
					var netCount = 1;

					for (var j = 0; j < edges.length; j++)
					{
						if (j == i)
						{
							continue;
						}
						else
						{
							var isSource2 = edgeIsSource[j];
							var otherTerm = this.getVisibleTerminal(edges[j], !isSource2);
							
							if (otherTerm == next)
							{
								if (isSource2)
								{
									netCount++;
								}
								else
								{
									netCount--;
								}
							}
						}
					}

					if (netCount >= 0)
					{
						currentComp = this.traverse(next, directed, edges[i], allVertices,
							currentComp, hierarchyVertices,
							filledVertexSet);
					}
				}
			}
		}
		else
		{
			if (currentComp[vertexID] == null)
			{
				// We've seen this vertex before, but not in the current component
				// This component and the one it's in need to be merged

				for (var i = 0; i < hierarchyVertices.length; i++)
				{
					var comp = hierarchyVertices[i];

					if (comp[vertexID] != null)
					{
						for (var key in comp)
						{
							currentComp[key] = comp[key];
						}
						
						// Remove the current component from the hierarchy set
						hierarchyVertices.splice(i, 1);
						return currentComp;
					}
				}
			}
		}
	}
	
	return currentComp;
};

/**
 * Function: cycleStage
 * 
 * Executes the cycle stage using mxMinimumCycleRemover.
 */
mxHierarchicalLayout.prototype.cycleStage = function(parent)
{
	var cycleStage = new mxMinimumCycleRemover(this);
	cycleStage.execute(parent);
};

/**
 * Function: layeringStage
 * 
 * Implements first stage of a Sugiyama layout.
 */
mxHierarchicalLayout.prototype.layeringStage = function()
{
	this.model.initialRank();
	this.model.fixRanks();
};

/**
 * Function: crossingStage
 * 
 * Executes the crossing stage using mxMedianHybridCrossingReduction.
 */
mxHierarchicalLayout.prototype.crossingStage = function(parent)
{
	var crossingStage = new mxMedianHybridCrossingReduction(this);
	crossingStage.execute(parent);
};

/**
 * Function: placementStage
 * 
 * Executes the placement stage using mxCoordinateAssignment.
 */
mxHierarchicalLayout.prototype.placementStage = function(initialX, parent)
{
	var placementStage = new mxCoordinateAssignment(this, this.intraCellSpacing,
			this.interRankCellSpacing, this.orientation, initialX,
			this.parallelEdgeSpacing);
	placementStage.fineTuning = this.fineTuning;
	placementStage.execute(parent);
	
	return placementStage.limitX + this.interHierarchySpacing;
};
