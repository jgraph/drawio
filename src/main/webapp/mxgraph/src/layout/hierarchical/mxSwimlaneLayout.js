/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: mxSwimlaneLayout
 * 
 * A hierarchical layout algorithm.
 * 
 * Constructor: mxSwimlaneLayout
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
function mxSwimlaneLayout(graph, orientation, deterministic)
{
	mxGraphLayout.call(this, graph);
	this.orientation = (orientation != null) ? orientation : mxConstants.DIRECTION_NORTH;
	this.deterministic = (deterministic != null) ? deterministic : true;
};

/**
 * Extends mxGraphLayout.
 */
mxSwimlaneLayout.prototype = new mxGraphLayout();
mxSwimlaneLayout.prototype.constructor = mxSwimlaneLayout;

/**
 * Variable: roots
 * 
 * Holds the array of <mxCell> that this layout contains.
 */
mxSwimlaneLayout.prototype.roots = null;

/**
 * Variable: swimlanes
 * 
 * Holds the array of <mxCell> of the ordered swimlanes to lay out
 */
mxSwimlaneLayout.prototype.swimlanes = null;

/**
 * Variable: dummyVertexWidth
 * 
 * The cell width of any dummy vertices inserted
 */
mxSwimlaneLayout.prototype.dummyVertexWidth = 50;

/**
 * Variable: resizeParent
 * 
 * Specifies if the parent should be resized after the layout so that it
 * contains all the child cells. Default is false. See also <parentBorder>.
 */
mxSwimlaneLayout.prototype.resizeParent = false;

/**
 * Variable: maintainParentLocation
 * 
 * Specifies if the parent location should be maintained, so that the
 * top, left corner stays the same before and after execution of
 * the layout. Default is false for backwards compatibility.
 */
mxSwimlaneLayout.prototype.maintainParentLocation = false;

/**
 * Variable: moveParent
 * 
 * Specifies if the parent should be moved if <resizeParent> is enabled.
 * Default is false.
 */
mxSwimlaneLayout.prototype.moveParent = false;

/**
 * Variable: parentBorder
 * 
 * The border to be added around the children if the parent is to be
 * resized using <resizeParent>. Default is 30.
 */
mxSwimlaneLayout.prototype.parentBorder = 30;

/**
 * Variable: intraCellSpacing
 * 
 * The spacing buffer added between cells on the same layer. Default is 30.
 */
mxSwimlaneLayout.prototype.intraCellSpacing = 30;

/**
 * Variable: interRankCellSpacing
 * 
 * The spacing buffer added between cell on adjacent layers. Default is 100.
 */
mxSwimlaneLayout.prototype.interRankCellSpacing = 100;

/**
 * Variable: interHierarchySpacing
 * 
 * The spacing buffer between unconnected hierarchies. Default is 60.
 */
mxSwimlaneLayout.prototype.interHierarchySpacing = 60;

/**
 * Variable: parallelEdgeSpacing
 * 
 * The distance between each parallel edge on each ranks for long edges.
 * Default is 10.
 */
mxSwimlaneLayout.prototype.parallelEdgeSpacing = 10;

/**
 * Variable: orientation
 * 
 * The position of the root node(s) relative to the laid out graph in.
 * Default is <mxConstants.DIRECTION_NORTH>.
 */
mxSwimlaneLayout.prototype.orientation = mxConstants.DIRECTION_NORTH;

/**
 * Variable: fineTuning
 * 
 * Whether or not to perform local optimisations and iterate multiple times
 * through the algorithm. Default is true.
 */
mxSwimlaneLayout.prototype.fineTuning = true;

/**
 * Variable: tightenToSource
 * 
 * Whether or not to tighten the assigned ranks of vertices up towards
 * the source cells. Default is true.
 */
mxSwimlaneLayout.prototype.tightenToSource = true;

/**
 * Variable: disableEdgeStyle
 * 
 * Specifies if the STYLE_NOEDGESTYLE flag should be set on edges that are
 * modified by the result. Default is true.
 */
mxSwimlaneLayout.prototype.disableEdgeStyle = true;

/**
 * Variable: traverseAncestors
 * 
 * Whether or not to drill into child cells and layout in reverse
 * group order. This also cause the layout to navigate edges whose 
 * terminal vertices have different parents but are in the same
 * ancestry chain. Default is true.
 */
mxSwimlaneLayout.prototype.traverseAncestors = true;

/**
 * Variable: model
 * 
 * The internal <mxSwimlaneModel> formed of the layout.
 */
mxSwimlaneLayout.prototype.model = null;

/**
 * Variable: edgesSet
 * 
 * A cache of edges whose source terminal is the key
 */
mxSwimlaneLayout.prototype.edgesCache = null;

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
 * Returns the internal <mxSwimlaneModel> for this layout algorithm.
 */
mxSwimlaneLayout.prototype.getModel = function()
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
 * swimlanes - Ordered array of swimlanes to be laid out
 */
mxSwimlaneLayout.prototype.execute = function(parent, swimlanes)
{
	this.parent = parent;
	var model = this.graph.model;
	this.edgesCache = new mxDictionary();
	this.edgeSourceTermCache = new mxDictionary();
	this.edgesTargetTermCache = new mxDictionary();

	// If the roots are set and the parent is set, only
	// use the roots that are some dependent of the that
	// parent.
	// If just the root are set, use them as-is
	// If just the parent is set use it's immediate
	// children as the initial set

	if (swimlanes == null || swimlanes.length < 1)
	{
		// TODO indicate the problem
		return;
	}

	if (parent == null)
	{
		parent = model.getParent(swimlanes[0]);
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

	this.swimlanes = swimlanes;
	var dummyVertices = [];
	// Check the swimlanes all have vertices
	// in them
	for (var i = 0; i < swimlanes.length; i++)
	{
		var children = this.graph.getChildCells(swimlanes[i]);
		
		if (children == null || children.length == 0)
		{
			var vertex = this.graph.insertVertex(swimlanes[i], null, null, 0, 0, this.dummyVertexWidth, 0);
			dummyVertices.push(vertex);
		}
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

		this.graph.removeCells(dummyVertices);
	}
	finally
	{
		model.endUpdate();
	}
};

/**
 * Function: updateGroupBounds
 * 
 * Updates the bounds of the given array of groups so that it includes
 * all child vertices.
 * 
 */
mxSwimlaneLayout.prototype.updateGroupBounds = function()
{
	// Get all vertices and edge in the layout
	var cells = [];
	var model = this.model;
	
	for (var key in model.edgeMapper)
	{
		var edge = model.edgeMapper[key];
		
		for (var i = 0; i < edge.edges.length; i++)
		{
			cells.push(edge.edges[i]);
		}
	}
	
	var layoutBounds = this.graph.getBoundingBoxFromGeometry(cells, true);
	var childBounds = [];

	for (var i = 0; i < this.swimlanes.length; i++)
	{
		var lane = this.swimlanes[i];
		var geo = this.graph.getCellGeometry(lane);
		
		if (geo != null)
		{
			var children = this.graph.getChildCells(lane);
			
			var size = (this.graph.isSwimlane(lane)) ?
					this.graph.getStartSize(lane) : new mxRectangle();

			var bounds = this.graph.getBoundingBoxFromGeometry(children);
			childBounds[i] = bounds;
			var childrenY = bounds.y + geo.y - size.height - this.parentBorder;
			var maxChildrenY = bounds.y + geo.y + bounds.height;

			if (layoutBounds == null)
			{
				layoutBounds = new mxRectangle(0, childrenY, 0, maxChildrenY - childrenY);
			}
			else
			{
				layoutBounds.y = Math.min(layoutBounds.y, childrenY);
				var maxY = Math.max(layoutBounds.y + layoutBounds.height, maxChildrenY);
				layoutBounds.height = maxY - layoutBounds.y;
			}
		}
	}

	
	for (var i = 0; i < this.swimlanes.length; i++)
	{
		var lane = this.swimlanes[i];
		var geo = this.graph.getCellGeometry(lane);
		
		if (geo != null)
		{
			var children = this.graph.getChildCells(lane);
			
			var size = (this.graph.isSwimlane(lane)) ?
					this.graph.getStartSize(lane) : new mxRectangle();

			var newGeo = geo.clone();
			
			var leftGroupBorder = (i == 0) ? this.parentBorder : this.interRankCellSpacing/2;
			var w = size.width + leftGroupBorder;
			var x = childBounds[i].x - w;
			var y = layoutBounds.y - this.parentBorder;

			newGeo.x += x;
			newGeo.y = y;
			
			newGeo.width = childBounds[i].width + w + this.interRankCellSpacing/2;
			newGeo.height = layoutBounds.height + size.height + 2 * this.parentBorder;
			
			this.graph.model.setGeometry(lane, newGeo);
			this.graph.moveCells(children, -x, geo.y - y);
		}
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
mxSwimlaneLayout.prototype.findRoots = function(parent, vertices)
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

			if (cell != null && model.isVertex(cell) && this.graph.isCellVisible(cell) && model.isAncestor(parent, cell))
			{
				var conns = this.getEdges(cell);
				var fanOut = 0;
				var fanIn = 0;

				for (var k = 0; k < conns.length; k++)
				{
					var src = this.getVisibleTerminal(conns[k], true);

					if (src == cell)
					{
						// Only count connection within this swimlane
						var other = this.getVisibleTerminal(conns[k], false);
						
						if (model.isAncestor(parent, other))
						{
							fanOut++;
						}
					}
					else if (model.isAncestor(parent, src))
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
mxSwimlaneLayout.prototype.getEdges = function(cell)
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
		
		if ((source == target) || ((source != target) && ((target == cell && (this.parent == null || this.graph.isValidAncestor(source, this.parent, this.traverseAncestors))) ||
			(source == cell && (this.parent == null ||
					this.graph.isValidAncestor(target, this.parent, this.traverseAncestors))))))
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
mxSwimlaneLayout.prototype.getVisibleTerminal = function(edge, source)
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
mxSwimlaneLayout.prototype.run = function(parent)
{
	// Separate out unconnected hierarchies
	var hierarchyVertices = [];
	var allVertexSet = Object();

	if (this.swimlanes != null && this.swimlanes.length > 0 && parent != null)
	{
		var filledVertexSet = Object();
		
		for (var i = 0; i < this.swimlanes.length; i++)
		{
			this.filterDescendants(this.swimlanes[i], filledVertexSet);
		}

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

		// Only test for candidates in each swimlane in order
		var laneCounter = 0;

		while (!filledVertexSetEmpty && laneCounter < this.swimlanes.length)
		{
			var candidateRoots = this.findRoots(this.swimlanes[laneCounter], filledVertexSet);
			
			if (candidateRoots.length == 0)
			{
				laneCounter++;
				continue;
			}
			
			// If the candidate root is an unconnected group cell, remove it from
			// the layout. We may need a custom set that holds such groups and forces
			// them to be processed for resizing and/or moving.
			for (var i = 0; i < candidateRoots.length; i++)
			{
				var vertexSet = Object();
				hierarchyVertices.push(vertexSet);

				this.traverse(candidateRoots[i], true, null, allVertexSet, vertexSet,
						hierarchyVertices, filledVertexSet, laneCounter);
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

	var tmp = [];
	
	for (var key in allVertexSet)
	{
		tmp.push(allVertexSet[key]);
	}
	
	this.model = new mxSwimlaneModel(this, tmp, this.roots,
		parent, this.tightenToSource);

	this.cycleStage(parent);
	this.layeringStage();
	
	this.crossingStage(parent);
	this.placementStage(0, parent);
};

/**
 * Function: filterDescendants
 * 
 * Creates an array of descendant cells
 */
mxSwimlaneLayout.prototype.filterDescendants = function(cell, result)
{
	var model = this.graph.model;

	if (model.isVertex(cell) && cell != this.parent && model.getParent(cell) != this.parent && this.graph.isCellVisible(cell))
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
mxSwimlaneLayout.prototype.isPort = function(cell)
{
	if (cell.geometry.relative)
	{
		return true;
	}
	
	return false;
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
mxSwimlaneLayout.prototype.getEdgesBetween = function(source, target, directed)
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
 * swimlaneIndex - the laid out order index of the swimlane vertex is contained in
 */
mxSwimlaneLayout.prototype.traverse = function(vertex, directed, edge, allVertices, currentComp,
											hierarchyVertices, filledVertexSet, swimlaneIndex)
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
			var model = this.graph.model;

			for (var i = 0; i < edges.length; i++)
			{
				var otherVertex = this.getVisibleTerminal(edges[i], true);
				var isSource = otherVertex == vertex;
				
				if (isSource)
				{
					otherVertex = this.getVisibleTerminal(edges[i], false);
				}

				var otherIndex = 0;
				// Get the swimlane index of the other terminal
				while (otherIndex < this.swimlanes.length && !model.isAncestor(this.swimlanes[otherIndex], otherVertex))
				{
					otherIndex++
				}
				
				if (otherIndex >= this.swimlanes.length)
				{
					continue;
				}

				// Traverse if the other vertex is within the same swimlane as
				// as the current vertex, or if the swimlane index of the other
				// vertex is greater than that of this vertex
				if ((otherIndex > swimlaneIndex) ||
						((!directed || isSource) && otherIndex == swimlaneIndex))
				{
					currentComp = this.traverse(otherVertex, directed, edges[i], allVertices,
							currentComp, hierarchyVertices,
							filledVertexSet, otherIndex);
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
mxSwimlaneLayout.prototype.cycleStage = function(parent)
{
	var cycleStage = new mxSwimlaneOrdering(this);
	cycleStage.execute(parent);
};

/**
 * Function: layeringStage
 * 
 * Implements first stage of a Sugiyama layout.
 */
mxSwimlaneLayout.prototype.layeringStage = function()
{
	this.model.initialRank();
	this.model.fixRanks();
};

/**
 * Function: crossingStage
 * 
 * Executes the crossing stage using mxMedianHybridCrossingReduction.
 */
mxSwimlaneLayout.prototype.crossingStage = function(parent)
{
	var crossingStage = new mxMedianHybridCrossingReduction(this);
	crossingStage.execute(parent);
};

/**
 * Function: placementStage
 * 
 * Executes the placement stage using mxCoordinateAssignment.
 */
mxSwimlaneLayout.prototype.placementStage = function(initialX, parent)
{
	var placementStage = new mxCoordinateAssignment(this, this.intraCellSpacing,
			this.interRankCellSpacing, this.orientation, initialX,
			this.parallelEdgeSpacing);
	placementStage.fineTuning = this.fineTuning;
	placementStage.execute(parent);
	
	return placementStage.limitX + this.interHierarchySpacing;
};
