/**
 * Copyright (c) 2006-2017, JGraph Holdings Ltd
 * Copyright (c) 2006-2017, draw.io AG
 */
(function()
{

	/**
	 * Overrides folding based on treeFolding style.
	 */
	var graphFoldCells = Graph.prototype.foldCells;
	
	Graph.prototype.foldCells = function(collapse, recurse, cells, checkFoldable, evt)
	{
		recurse = (recurse != null) ? recurse : false;
		
		if (cells == null)
		{
			cells = this.getFoldableCells(this.getSelectionCells(), collapse);
		}

		this.stopEditing();
		
		this.model.beginUpdate();
		try
		{
			var newCells = cells.slice();
			
			for (var i = 0; i < cells.length; i++)
			{
				if (mxUtils.getValue(this.getCurrentCellStyle(cells[i]),
					'treeFolding', '0') == '1')
				{
					this.foldTreeCell(collapse, cells[i]);
				}
			}
			
			cells = newCells;
			cells = graphFoldCells.apply(this, arguments);
		}
		finally
		{
			this.model.endUpdate();
		}
		
		return cells;
	};
	
	/**
	 * Implements folding a tree cell.
	 */
	Graph.prototype.foldTreeCell = function(collapse, cell)
	{
		this.model.beginUpdate();
		try
		{
			var tmp = [];

			this.traverse(cell, true, mxUtils.bind(this, function(vertex, edge)
			{
				var treeEdge = edge != null && this.isTreeEdge(edge);
				
				if (treeEdge)
				{
					tmp.push(edge);
				}
				
				if (vertex != cell && (edge == null || treeEdge))
				{
					tmp.push(vertex);
				}
				
				// Stops traversal on collapsed vertices
				return (edge == null || treeEdge) &&
					(vertex == cell || !this.model.isCollapsed(vertex));
			}));
					
			this.model.setCollapsed(cell, collapse);

			for (var i = 0; i < tmp.length; i++)
			{
				this.model.setVisible(tmp[i], !collapse);
			}
		}
		finally
		{
			this.model.endUpdate();
		}
	};
	
	/**
	 * Implements folding a tree cell.
	 */
	Graph.prototype.isTreeEdge = function(cell)
	{
		return !this.isEdgeIgnored(cell);
	};
	
	/**
	 * Returns all tree edges for the given cell.
	 */
	Graph.prototype.getTreeEdges = function(cell, parent, incoming, outgoing, includeLoops, recurse)
	{
		return this.model.filterCells(this.getEdges(cell, parent, incoming, outgoing, includeLoops, recurse), mxUtils.bind(this, function(cell)
		{
			return this.isTreeEdge(cell);
		}));
	};
		
	/**
	 * Returns all incoming tree edges for the given cell.
	 */
	Graph.prototype.getIncomingTreeEdges = function(cell, parent)
	{
		return this.getTreeEdges(cell, parent, true, false, false);
	};

	/**
	 * Returns all outgoing tree edges for the given cell.
	 */
	Graph.prototype.getOutgoingTreeEdges = function(cell, parent)
	{
		return this.getTreeEdges(cell, parent, false, true, false);
	};

	/**
	 * Returns true if the given cell has an outgoing tree edge in the
	 * model. Unlike getOutgoingTreeEdges this does not resolve visible
	 * terminals, which are not yet valid while the terminal states are
	 * revalidated (eg. for the folding icon after inserting an edge).
	 */
	Graph.prototype.hasOutgoingTreeEdge = function(cell)
	{
		var count = this.model.getEdgeCount(cell);

		for (var i = 0; i < count; i++)
		{
			var edge = this.model.getEdgeAt(cell, i);

			if (this.model.getTerminal(edge, true) == cell &&
				this.model.getTerminal(edge, false) != cell &&
				this.isTreeEdge(edge))
			{
				return true;
			}
		}

		return false;
	};

	/**
	 * Hides the folding icon on leaves: expanded tree cells are only
	 * foldable with outgoing tree edges. Collapsed cells stay foldable
	 * so they can always be expanded.
	 */
	var graphIsTreeCellFoldable = Graph.prototype.isTreeCellFoldable;

	Graph.prototype.isTreeCellFoldable = function(cell, style)
	{
		return graphIsTreeCellFoldable.apply(this, arguments) &&
			(this.isCellCollapsed(cell) ||
			this.hasOutgoingTreeEdge(cell));
	};

	/**
	 * Refreshes the folding icon on the source terminals of added, removed
	 * or reconnected edges. The base change handling only invalidates the
	 * edge itself, so the icon would not appear on the first child edge or
	 * disappear with the last one until an unrelated revalidation.
	 */
	var graphProcessChange = Graph.prototype.processChange;

	Graph.prototype.processChange = function(change)
	{
		graphProcessChange.apply(this, arguments);

		if (change instanceof mxChildChange && this.model.isEdge(change.child))
		{
			this.invalidateTreeFolding(this.model.getTerminal(change.child, true));
		}
		else if (change instanceof mxTerminalChange && change.source)
		{
			this.invalidateTreeFolding(change.terminal);
			this.invalidateTreeFolding(change.previous);
		}
	};

	/**
	 * Invalidates the state of the given cell if its folding icon depends
	 * on outgoing tree edges. A cell without a state has no icon to update
	 * (its state gets one when it is created), and its style is not resolved
	 * here, as a source added with many edges (eg. in an import) would be
	 * resolved once for each edge.
	 */
	Graph.prototype.invalidateTreeFolding = function(cell)
	{
		var state = (cell != null) ? this.view.getState(cell) : null;

		if (state != null && !this.model.isCollapsed(cell) &&
			mxUtils.getValue(state.style, 'treeFolding', '0') == '1')
		{
			this.view.invalidate(cell, false, false);
		}
	};

	/**
	 * Overrides functionality in editor.
	 */
	var editorUiInit = EditorUi.prototype.init;
	
	EditorUi.prototype.init = function()
	{
		editorUiInit.apply(this, arguments);
		
		if (!this.editor.isChromelessView() || this.editor.editable)
		{
			this.addTrees();
		}
	};

	EditorUi.prototype.addTrees = function()
	{
		var ui = this;
		var graph = ui.editor.graph;
		var model = graph.getModel();
		var spacing = 10;
		var level = 40;
	
		function isTreeVertex(cell)
		{
			return model.isVertex(cell) && hasTreeParent(cell);
		};

		function isTreeMoving(cell)
		{
			var result = false;
			
			if (cell != null)
			{
				var style = graph.getCurrentCellStyle(cell);
	
				result = style['treeMoving'] == '1';
			}
			
			return result;
		};
	
		function hasTreeParent(cell)
		{
			var result = false;
			
			if (cell != null)
			{
				var parent = model.getParent(cell);
				var pstate = graph.view.getState(parent);
				var style = (pstate != null) ? pstate.style : graph.getCellStyle(parent);
	
				result = style['containerType'] == 'tree';
			}

			return result;
		};

		// Returns the nearest ancestor with containerType=tree, or null
		function treeContainerOf(cell)
		{
			while (cell != null && !hasTreeParent(cell))
			{
				cell = model.getParent(cell);
			}

			return (cell != null) ? model.getParent(cell) : null;
		};

		// True if the hover arrows in the given tree container add a child
		// connected from the hovered cell instead of following the tree
		// rules: the container runs a layered (flow) layout (the JSON
		// childLayout decodes to elkLayered, or the legacy flowLayout string)
		// or a balloon tree, where the arrows have no direction. Flow
		// containers carry containerType=tree for the subtree delete/move
		// semantics only — a flowchart has no siblings or parents to insert
		// (a perpendicular arrow used to add a sibling, ie. a second
		// successor of the previous shape).
		function isChildArrowContainer(container)
		{
			if (container != null)
			{
				var style = graph.getCurrentCellStyle(container);
				var value = (style != null) ? style['childLayout'] : null;

				if (value == 'flowLayout')
				{
					return true;
				}

				try
				{
					var list = Graph.decodeChildLayout(value);

					return list != null && list.length > 0 && list[0] != null &&
						(list[0].layout == 'elkLayered' ||
						list[0].layout == 'BalloonTreeLayout');
				}
				catch (e)
				{
					// Malformed childLayout JSON is not a flow container
				}
			}

			return false;
		};

		function hasLayoutParent(cell)
		{
			var result = false;
			
			if (cell != null)
			{
				var parent = model.getParent(cell);
				var pstate = graph.view.getState(parent);
				
				var state = graph.view.getState(parent);
				var style = (pstate != null) ? pstate.style : graph.getCellStyle(parent);
				
				result = style['childLayout'] != null;
			}
			
			return result;
		};
		
		// Returns the selection actions of trees for the selected cell (… ›
		// Edit of Simple Modern, see SimpleMenus.js)
		ui.getTreeSelectActions = function()
		{
			var keys = [];

			if (graph.getSelectionCount() == 1)
			{
				var cell = graph.getSelectionCell();
				var tree = isTreeVertex(cell);

				if (graph.getOutgoingTreeEdges(cell).length > 0)
				{
					if (tree)
					{
						keys.push('selectChildren');
					}

					keys.push('selectDescendants');
				}

				if (tree)
				{
					if (graph.getIncomingTreeEdges(cell).length > 0)
					{
						keys.push('selectSiblings', 'selectParent');
					}
				}
				else if (graph.model.getEdgeCount(cell) > 0)
				{
					keys.push('selectConnections');
				}
			}

			return keys;
		};

		var uiCreatePopupMenu = ui.menus.createPopupMenu;
		ui.menus.createPopupMenu = function(menu, cell, evt)
		{
			uiCreatePopupMenu.apply(this, arguments);
			
			// The context menu of Simple Modern has no selection items of trees
			if (graph.getSelectionCount() == 1 && !(typeof this.isSimpleContextMenu === 'function' &&
				this.isSimpleContextMenu()))
			{
				var cell = graph.getSelectionCell();
				var sib = graph.getOutgoingTreeEdges(cell);
				menu.addSeparator();
				
				if (sib.length > 0)
				{
					if (isTreeVertex(graph.getSelectionCell()))
					{
						this.addMenuItems(menu, ['selectChildren'], null, evt);	
					}
					
					this.addMenuItems(menu, ['selectDescendants'], null, evt);
				}
				
				if (isTreeVertex(graph.getSelectionCell()))
				{
					menu.addSeparator();
					
					if (graph.getIncomingTreeEdges(cell).length > 0)
					{
						this.addMenuItems(menu, ['selectSiblings', 'selectParent'], null, evt);
					}
				}
				else if (graph.model.getEdgeCount(cell) > 0)
				{
					this.addMenuItems(menu, ['selectConnections'], null, evt);
				}
			}
		};

		// Adds actions
		ui.actions.addAction('selectChildren', function(evt)
		{
			if (graph.isEnabled() && graph.getSelectionCount() == 1)
			{
				var cell = graph.getSelectionCell();
				var sib = mxEvent.isControlDown(evt) ? null :
					graph.getOutgoingTreeEdges(cell);
				
				if (sib != null && sib.length > 0)
				{
					var tmp = [];
					
					for (var i = 0; i < sib.length; i++)
					{
						tmp.push(graph.model.getTerminal(sib[i], false));
					}
					
					graph.setSelectionCells(tmp);
				}
				else
				{
					graph.setSelectionCells(graph.model.getChildren(cell));
				}
			}
		}, null, null,  Editor.altKey + '+' + Editor.shiftKey + '+C');
		
		ui.actions.addAction('selectDescendants', function(evt)
		{
			var cell = graph.getSelectionCell();
			
			if (graph.isEnabled() && cell != null)
			{
				var tmp = [];

				if (!mxEvent.isControlDown(evt))
				{
					graph.traverse(cell, true, function(vertex, edge)
					{
						var treeEdge = edge != null && graph.isTreeEdge(edge);
				
						if (treeEdge && mxEvent.isControlDown(evt))
						{
							tmp.push(edge);
						}
						
						if (edge == null || treeEdge)
						{
							tmp.push(vertex);
						}
						
						return edge == null || treeEdge;
					});
				}
				
				if (tmp.length == 0 || (tmp.length == 1 &&
					tmp[0] == cell))
				{
					tmp = graph.model.getDescendants(cell);
				}
				
				graph.setSelectionCells(tmp);
			}
		}, null, null,  Editor.altKey + '+' + Editor.shiftKey + '+X');
		
		// Adds actions
		ui.actions.addAction('selectParent', function(evt)
		{
			var cell = graph.getSelectionCell();

			if (graph.isEnabled() && cell != null)
			{
				var edges = mxEvent.isControlDown(evt) ? null :
					graph.getIncomingTreeEdges(cell);
	
				if (edges != null && edges.length > 0)
				{
					graph.setSelectionCell(graph.model.getTerminal(edges[0], true));
				}
				else
				{
					graph.selectParentCell();
				}
			}
		}, null, null,  Editor.altKey + '+' + Editor.shiftKey + '+P');
		
		// Adds actions
		ui.actions.addAction('selectSiblings', function(evt)
		{
			if (graph.isEnabled() && graph.getSelectionCount() == 1)
			{
				var cell = graph.getSelectionCell();
				var edges = mxEvent.isControlDown(evt) ? null :
					graph.getIncomingTreeEdges(cell);
				var tmp = [];
	
				if (edges != null && edges.length > 0)
				{
					var sib = graph.getOutgoingTreeEdges(graph.model.getTerminal(edges[0], true));
					
					if (sib != null)
					{
						for (var i = 0; i < sib.length; i++)
						{
							tmp.push(graph.model.getTerminal(sib[i], false));
						}
					}
				}

				if (tmp.length == 0)
				{
					tmp = graph.model.getChildren(graph.model.getParent(cell));
				}

				graph.setSelectionCells(tmp);
			}
		}, null, null,  Editor.altKey + '+' + Editor.shiftKey + '+S');
		
		/**
		 * Overriddes
		 */
		// Returns the cells removed for the given explicitly deleted cells:
		// a vertex inside a tree container takes all edges connected to it
		// or its descendants with it (edges in a tree are structural and
		// must not be left dangling) and the removal cascades down the tree
		// to vertices orphaned by it, except inside the containers in the
		// optional noCascade dictionary. Only SHAPE deletions seed the
		// cascade: an explicitly deleted edge removes just itself and cuts
		// the branch below it loose instead of taking it along
		function collectTreeRemoval(cells, noCascade)
		{
			var result = {cells: [], deleted: new mxDictionary(),
				cut: new mxDictionary(), cascaded: []};
			var queued = new mxDictionary();
			var queue = [];

			// Marks an edge for removal; a cut on behalf of a removed VERTEX
			// (cascade) also schedules the orphan check for the edge's target
			// in the cascade below (a cut edge no longer counts as a
			// connection to the parent — explicitly deleted edges count as
			// cut in those checks too, they just never seed one). The source
			// terminal is never checked so a removal never propagates
			// towards the root. Scheduling is independent of the cut marking
			// because the same edge can arrive both ways: with includeEdges
			// the explicit cells contain a removed vertex's incident edges
			// too, so the vertex removal may reach an edge that is already
			// cut but not yet scheduled.
			function cutEdge(edge, cascade)
			{
				if (edge != null)
				{
					if (!result.cut.get(edge))
					{
						result.cut.put(edge, true);
						result.cells.push(edge);
					}

					if (cascade && !queued.get(edge))
					{
						queued.put(edge, true);
						queue.push(edge);
					}
				}
			};

			function removeVertex(vertex)
			{
				if (!result.deleted.get(vertex))
				{
					result.deleted.put(vertex, true);
					result.cells.push(vertex);

					var edges = graph.getAllEdges([vertex]);

					for (var j = 0; j < edges.length; j++)
					{
						cutEdge(edges[j], true);
					}
				}
			};

			for (var i = 0; i < cells.length; i++)
			{
				var target = cells[i];

				if (model.isEdge(target))
				{
					// No cascade: deleting an edge keeps the branch below it
					// in place (disconnected), so a wrong edge can be removed
					// and redrawn without losing the subtree
					cutEdge(target, false);
				}
				else if (model.isVertex(target) && treeContainerOf(target) != null)
				{
					removeVertex(target);
				}
				else if (target != null)
				{
					result.cells.push(target);
				}
			}

			// Cascades the removal down the tree: a vertex reached by an
			// edge cut for a removed vertex is itself removed only if it is
			// inside a tree container and all of its incoming edges are cut,
			// ie. it is orphaned by this deletion; otherwise only the edge
			// is removed and the vertex and the subtree below it are kept,
			// connected to their other parent(s)
			while (queue.length > 0)
			{
				var child = model.getTerminal(queue.shift(), false);

				if (child != null && !result.deleted.get(child) &&
					model.isVertex(child))
				{
					var container = treeContainerOf(child);

					if (container != null && (noCascade == null ||
						!noCascade.get(container)))
					{
						var incoming = graph.getIncomingTreeEdges(child);
						var orphaned = true;

						for (var j = 0; j < incoming.length; j++)
						{
							if (!result.cut.get(incoming[j]))
							{
								orphaned = false;
								break;
							}
						}

						if (orphaned)
						{
							result.cascaded.push(child);
							removeVertex(child);
						}
					}
				}
			}

			return result;
		};

		// Returns true if a vertex below the container survives the removal
		// with at least one of its edges, ie. some of the graph remains
		function hasConnectedSurvivor(container, result)
		{
			var stack = [container];

			while (stack.length > 0)
			{
				var cell = stack.pop();

				for (var i = 0; i < model.getChildCount(cell); i++)
				{
					var child = model.getChildAt(cell, i);

					if (model.isVertex(child) && !result.deleted.get(child))
					{
						for (var j = 0; j < model.getEdgeCount(child); j++)
						{
							if (!result.cut.get(model.getEdgeAt(child, j)))
							{
								return true;
							}
						}
					}

					stack.push(child);
				}
			}

			return false;
		};

		// Returns a dictionary of the tree containers where the cascade
		// would remove the whole graph inside the container, or null
		function getWipedTreeContainers(result)
		{
			var checked = new mxDictionary();
			var wiped = null;

			for (var i = 0; i < result.cascaded.length; i++)
			{
				var container = treeContainerOf(result.cascaded[i]);

				if (container != null && !checked.get(container))
				{
					checked.put(container, true);

					if (!hasConnectedSurvivor(container, result))
					{
						wiped = (wiped != null) ? wiped : new mxDictionary();
						wiped.put(container, true);
					}
				}
			}

			return wiped;
		};

		// Returns the result of collectTreeRemoval for the given cells. A
		// cascade that would delete the whole graph inside a tree container
		// is more than the gesture intends - falls back to the minimal set
		// with no dangling edges for those containers: a vertex takes only
		// its incident edges with it and a selected edge removes just itself
		function getTreeRemoval(cells)
		{
			var result = collectTreeRemoval(cells, null);
			var wiped = getWipedTreeContainers(result);

			if (wiped != null)
			{
				result = collectTreeRemoval(cells, wiped);
			}

			return result;
		};

		var graphRemoveCells = graph.removeCells;

		graph.removeCells = function(cells, includeEdges)
		{
			includeEdges = (includeEdges != null) ? includeEdges : true;

			if (cells == null)
			{
				cells = this.getDeletableCells(this.getSelectionCells());
			}

			// Adds all edges to the cells
			if (includeEdges)
			{
				// FIXME: Remove duplicate cells in result or do not add if
				// in cells or descendant of cells
				cells = this.getDeletableCells(this.addAllEdges(cells));
			}

			cells = getTreeRemoval(cells).cells;

			return graphRemoveCells.apply(this, arguments);
		};

		var graphGetCutCells = graph.getCutCells;

		// Cutting a vertex in a tree removes the branch below it (see
		// removeCells) so the branch is copied as well to be restored by
		// pasting. Edges to vertices that are not cut are removed but not
		// copied unless they were cut explicitly, as they would be dangling.
		graph.getCutCells = function(cells)
		{
			cells = graphGetCutCells.apply(this, arguments);
			var result = getTreeRemoval(cells);

			if (result.cascaded.length > 0)
			{
				var explicit = new mxDictionary();

				for (var i = 0; i < cells.length; i++)
				{
					explicit.put(cells[i], true);
				}

				cells = [];

				for (var i = 0; i < result.cells.length; i++)
				{
					var cell = result.cells[i];

					if (explicit.get(cell) || !model.isEdge(cell) ||
						(result.deleted.get(model.getTerminal(cell, true)) &&
						result.deleted.get(model.getTerminal(cell, false))))
					{
						cells.push(cell);
					}
				}
			}

			return cells;
		};
	
		ui.hoverIcons.getStateAt = function(state, x, y)
		{
			return (isTreeVertex(state.cell)) ? null : this.graph.view.getState(this.graph.getCellAt(x, y));
		};
		
		var graphDuplicateCells = graph.duplicateCells;
		
		graph.duplicateCells = function(cells, append)
		{
			cells = (cells != null) ? cells : this.getSelectionCells();
			var temp = cells.slice(0);
			
			for (var i = 0; i < temp.length; i++)
			{
				var cell = temp[i];
				var state = graph.view.getState(cell);
				
				if (state != null && isTreeVertex(state.cell))
				{
					// Avoids disconnecting subtree by removing all incoming edges
					var edges = graph.getIncomingTreeEdges(state.cell);
					
					for (var j = 0; j < edges.length; j++)
					{
						mxUtils.remove(edges[j], cells);
					}
				}
			}
			
			this.model.beginUpdate();
			try
			{
				var result = graphDuplicateCells.call(this, cells, append);
	
				if (result.length == cells.length)
				{
					for (var i = 0; i < cells.length; i++)
					{
						if (isTreeVertex(cells[i]))
						{
							var newEdges = graph.getIncomingTreeEdges(result[i]);
							var edges = graph.getIncomingTreeEdges(cells[i]);
							
							if (newEdges.length == 0 && edges.length > 0)
							{
								var clone = this.cloneCell(edges[0]);
								this.addEdge(clone, graph.getDefaultParent(),
									this.model.getTerminal(edges[0], true), result[i]);
								removeTerminalPoints(clone);
							}
						}
					}
				}
			}
			finally
			{
				this.model.endUpdate();
			}
			
			return result;
		};
	
		var graphMoveCells = graph.moveCells;
		
		graph.moveCells = function(cells, dx, dy, clone, target, evt, mapping)
		{
			var result = null;

			// Adds collapsed subtrees, or the hidden cells below collapsed cells
			// in layout containers, whose layouts ignore hidden cells
			var allCells = [];

			for (var i = 0; i < cells.length; i++)
			{
				if ((isTreeMoving(cells[i]) || isTreeVertex(cells[i])) &&
					this.isCellCollapsed(cells[i]))
				{
					var subtree = (hasLayoutParent(cells[i])) ?
						getTreeCells(cells[i], true) : this.getSubtree(cells[i]);

					for (var j = 0; j < subtree.length; j++)
					{
						allCells.push(subtree[j]);
					}
				}
				else
				{
					allCells.push(cells[i]);
				}
			}

			cells = mxUtils.removeDuplicates(allCells);
			
			this.model.beginUpdate();
			try
			{
				var newSource = target;
				var style = this.getCurrentCellStyle(target);

				if (cells != null && isTreeVertex(target) && mxUtils.getValue(style, 'treeFolding', '0') == '1')
				{
					// Handles only drag from tree or from sidebar with dangling edges
					for (var i = 0; i < cells.length; i++)
					{
						if (isTreeVertex(cells[i]) || (graph.model.isEdge(cells[i]) &&
							graph.model.getTerminal(cells[i], true) == null))
						{
							target = graph.model.getParent(cells[i]);
							break;
						}
					}
	
					// Applies distance between previous and current parent for non-sidebar drags
					if (newSource != null && target != newSource && this.view.getState(cells[0]) != null)
					{
						var edges = graph.getIncomingTreeEdges(cells[0]);
						
						if (edges.length > 0)
						{
							var state1 = graph.view.getState(graph.model.getTerminal(edges[0], true));
							
							if (state1 != null)
							{
								var state2 = graph.view.getState(newSource);
								
								if (state2 != null)
								{
									dx = (state2.getCenterX() - state1.getCenterX()) / graph.view.scale;
									dy = (state2.getCenterY() - state1.getCenterY()) / graph.view.scale;
								}
							}
						}
					}
				}

				result = graphMoveCells.apply(this, arguments);
				
				if (result != null && cells != null && result.length == cells.length)
				{
					for (var i = 0; i < result.length; i++)
					{
						// Connects all dangling edges from the sidebar
						// when dropped into drop target (not hover icon)
						if (this.model.isEdge(result[i]))
						{
							if (isTreeVertex(newSource) && mxUtils.indexOf(result,
								this.model.getTerminal(result[i], true)) < 0)
							{
								this.model.setTerminal(result[i], newSource, true);
							}
						}
						else if (isTreeVertex(cells[i]))
						{
							var edges = graph.getIncomingTreeEdges(cells[i]);
	
							if (edges.length > 0)
							{
								if (!clone)
								{
									if (isTreeVertex(newSource) && mxUtils.indexOf(cells,
										this.model.getTerminal(edges[0], true)) < 0)
									{
										this.model.setTerminal(edges[0], newSource, true);
									}
								}
								else
								{
									var newEdges = graph.getIncomingTreeEdges(result[i]);
									
									if (newEdges.length == 0)
									{
										var temp = newSource;
										
										if (temp == null || temp == graph.model.getParent(cells[i]))
										{
											temp = graph.model.getTerminal(edges[0], true);
										}
										
										var clone = this.cloneCell(edges[0]);
										this.addEdge(clone, graph.getDefaultParent(), temp, result[i]);
										removeTerminalPoints(clone);
									}
								}
							}
						}
					}
				}
			}
			finally
			{
				this.model.endUpdate();
			}
			
			return result;
		};
		
		// Connects all dangling edges from the sidebar (by
		// default only first dangling edge gets connected)
		if (ui.sidebar != null)
		{
			var sidebarDropAndConnect = ui.sidebar.dropAndConnect;
			
			ui.sidebar.dropAndConnect = function(source, targets, direction, dropCellIndex)
			{
				var model = graph.model;
				var result = null;
			
				model.beginUpdate();
				try
				{
					result = sidebarDropAndConnect.apply(this, arguments);
					
					if (isTreeVertex(source))
					{
						for (var i = 0; i < result.length; i++)
						{
							if (model.isEdge(result[i]) && model.getTerminal(result[i], true) == null)
							{
								model.setTerminal(result[i], source, true);
								var geo = graph.getCellGeometry(result[i]);
								geo.points = null;
								
								if (geo.getTerminalPoint(true) != null)
								{
									geo.setTerminalPoint(null, true);
								}
							}
						}
					}
				}
				finally
				{
					model.endUpdate();
				}
				
				return result;
			};
		}
	
		/**
		 * Checks source point of incoming edge relative to target terminal.
		 */
		function getTreeDirection(cell)
		{
			var state = graph.view.getState(cell);
			
			if (state != null)
			{
				var edges = graph.getIncomingTreeEdges(state.cell);
				
				if (edges.length > 0)
				{
					var edgeState = graph.view.getState(edges[0]);
					
					if (edgeState != null)
					{
						var abs = edgeState.absolutePoints;
						
						if (abs != null && abs.length > 0)
						{
							var pt = abs[abs.length - 1];
							var prev = (abs.length > 1) ? abs[abs.length - 2] : null;

							// A connector that ends on a corner (eg. the bottom corners of a
							// branch in a mindmap) enters in the direction of its last
							// segment, as rounding puts its end on one or the other side
							var corner = pt != null && prev != null && (prev.x != pt.x || prev.y != pt.y) &&
								Math.abs(Math.abs(pt.x - state.getCenterX()) - state.width / 2) < 1 &&
								Math.abs(Math.abs(pt.y - state.getCenterY()) - state.height / 2) < 1;

							if (corner)
							{
								return (Math.abs(pt.x - prev.x) >= Math.abs(pt.y - prev.y)) ?
									((pt.x > prev.x) ? mxConstants.DIRECTION_EAST : mxConstants.DIRECTION_WEST) :
									((pt.y > prev.y) ? mxConstants.DIRECTION_SOUTH : mxConstants.DIRECTION_NORTH);
							}
							else if (pt != null)
							{
								if (pt.y == state.y && Math.abs(pt.x - state.getCenterX()) < state.width / 2)
								{
									return mxConstants.DIRECTION_SOUTH;
								}
								else if (pt.y == state.y + state.height && Math.abs(pt.x - state.getCenterX()) < state.width / 2)
								{
									return mxConstants.DIRECTION_NORTH;
								}
								else if (pt.x > state.getCenterX())
								{
									return mxConstants.DIRECTION_WEST;
								} 
							}
						}
					}
				}
			}
			
			return mxConstants.DIRECTION_EAST;
		};

		/**
		 * Replaces the cloned source vertex in clones with the given target
		 * cell (eg. from the shape picker), moved to the position of the
		 * source cell so that the relative placement logic in the callers
		 * works unchanged. Tree behaviour styles are copied from the source
		 * cell so that the new cell works like a clone of the source.
		 */
		function replaceTargetCell(clones, cell, targetCell)
		{
			if (targetCell != null)
			{
				var style = graph.getCurrentCellStyle(cell);
				var keys = ['treeFolding', 'treeMoving', 'newEdgeStyle'];

				for (var i = 0; i < keys.length; i++)
				{
					if (style[keys[i]] != null && (targetCell.style == null ||
						targetCell.style.indexOf(keys[i] + '=') < 0))
					{
						targetCell.style = mxUtils.setStyle(
							targetCell.style, keys[i], style[keys[i]]);
					}
				}

				if (targetCell.geometry != null && cell.geometry != null)
				{
					targetCell.geometry.x = cell.geometry.x;
					targetCell.geometry.y = cell.geometry.y;
				}

				if (graph.model.getTerminal(clones[0], false) == clones[1])
				{
					graph.model.setTerminal(clones[0], targetCell, false);
				}

				clones[1] = targetCell;
			}

			return clones;
		};

		/**
		 * Removes the terminal points of the connected ends of the given
		 * edge, cloned in the current edit. mxGraph.cloneCells sets them at
		 * the old terminal of ends whose terminal is not cloned, and an end
		 * that is disconnected later (eg. by the undo of a collaborator)
		 * would dangle there.
		 */
		function removeTerminalPoints(edge)
		{
			if (edge.geometry != null)
			{
				for (var i = 0; i < 2; i++)
				{
					if (graph.model.getTerminal(edge, i == 0) != null)
					{
						edge.geometry.setTerminalPoint(null, i == 0);
					}
				}
			}
		};

		function addSibling(cell, after, targetCell)
		{
			after = (after != null) ? after : true;

			graph.model.beginUpdate();
			try
			{
				var parent = graph.model.getParent(cell);
				var edges = graph.getIncomingTreeEdges(cell);
				var clones = replaceTargetCell(graph.cloneCells(
					[edges[0], cell]), cell, targetCell);
				graph.model.setTerminal(clones[0], graph.model.getTerminal(edges[0], true), true);
				var dir = getTreeDirection(cell);
				var pgeo = parent.geometry;
				
				if (dir == mxConstants.DIRECTION_SOUTH || dir == mxConstants.DIRECTION_NORTH)
				{
					clones[1].geometry.x += (after) ? cell.geometry.width + spacing :
						-clones[1].geometry.width - spacing;
				}
				else
				{
					clones[1].geometry.y += (after) ? cell.geometry.height + spacing :
						-clones[1].geometry.height - spacing;
				}
				
				if (graph.view.currentRoot != parent)
				{
					clones[1].geometry.x -= pgeo.x;
					clones[1].geometry.y -= pgeo.y;
				}
				
				// Moves existing siblings
				var state = graph.view.getState(cell);
				var s = graph.view.scale;
				
				if (state != null)
				{
					var bbox = mxRectangle.fromRectangle(state);
					
					if (dir == mxConstants.DIRECTION_SOUTH ||
						dir == mxConstants.DIRECTION_NORTH)
					{
						bbox.x += ((after) ? cell.geometry.width + spacing :
							-clones[1].geometry.width - spacing) * s;
					}
					else
					{
						bbox.y += ((after) ? cell.geometry.height + spacing :
							-clones[1].geometry.height - spacing) * s;
					}
					
					var sib = graph.getOutgoingTreeEdges(graph.model.getTerminal(edges[0], true));
					
					if (sib != null)
					{
						var hor = (dir == mxConstants.DIRECTION_SOUTH || dir == mxConstants.DIRECTION_NORTH);
						var dx = 0;
						var dy = 0;
						
						for (var i = 0; i < sib.length; i++)
						{
							var temp = graph.model.getTerminal(sib[i], false);
							
							if (dir == getTreeDirection(temp))
							{
								var sibling = graph.view.getState(temp);
								
								if (temp != cell && sibling != null)
								{
									if ((hor && after != sibling.getCenterX() < state.getCenterX()) ||
										(!hor && after != sibling.getCenterY() < state.getCenterY()))
									{
										if (mxUtils.intersects(bbox, sibling))
										{
											dx = spacing + Math.max(dx, (Math.min(bbox.x + bbox.width,
												sibling.x + sibling.width) - Math.max(bbox.x, sibling.x)) / s);
											dy = spacing + Math.max(dy, (Math.min(bbox.y + bbox.height,
												sibling.y + sibling.height) - Math.max(bbox.y, sibling.y)) / s);
										}
									}
								}
							}
						}
						
						if (hor)
						{
							dy = 0;
						}
						else
						{
							dx = 0;
						}
						
						for (var i = 0; i < sib.length; i++)
						{
							var temp = graph.model.getTerminal(sib[i], false);
							
							if (dir == getTreeDirection(temp))
							{
								var sibling = graph.view.getState(temp);
								
								if (temp != cell && sibling != null)
								{
									if ((hor && after != sibling.getCenterX() < state.getCenterX()) ||
										(!hor && after != sibling.getCenterY() < state.getCenterY()))
									{
										var subtree = [];
										
										graph.traverse(sibling.cell, true, function(vertex, edge)
										{
											var treeEdge = edge != null && graph.isTreeEdge(edge);
											
											if (treeEdge)
											{
												subtree.push(edge);
											}
		
											if (edge == null || treeEdge)
											{
												subtree.push(vertex);
											}
											
											return edge == null || treeEdge;
										});
										
										graph.moveCells(subtree, ((after) ? 1 : -1) * dx, ((after) ? 1 : -1) * dy);
									}
								}
							}
						}
					}
				}
				
				removeTerminalPoints(clones[0]);

				return graph.addCells(clones, parent);
			}
			finally
			{
				graph.model.endUpdate();
			}
		};
	
		function addParent(cell, targetCell)
		{
			graph.model.beginUpdate();
			try
			{
				var dir = getTreeDirection(cell);
				var edges = graph.getIncomingTreeEdges(cell);
				var clones = replaceTargetCell(graph.cloneCells(
					[edges[0], cell]), cell, targetCell);
				graph.model.setTerminal(edges[0], clones[1], false);
				graph.model.setTerminal(clones[0], clones[1], true);
				graph.model.setTerminal(clones[0], cell, false);
	
				// Makes space for new parent
				var parent = graph.model.getParent(cell);
				var pgeo = parent.geometry;
				var subtree = [];
				
				if (graph.view.currentRoot != parent)
				{
					clones[1].geometry.x -= pgeo.x;
					clones[1].geometry.y -= pgeo.y;
				}
				
				graph.traverse(cell, true, function(vertex, edge)
				{
					var treeEdge = edge != null && graph.isTreeEdge(edge);
				
					if (treeEdge)
					{
						subtree.push(edge);
					}
	
					if (edge == null || treeEdge)
					{
						subtree.push(vertex);
					}
					
					return edge == null || treeEdge;
				});
				
				var dx = cell.geometry.width + level;
				var dy = cell.geometry.height + level;
				
				if (dir == mxConstants.DIRECTION_SOUTH)
				{
					dx = 0;
				}
				else if (dir == mxConstants.DIRECTION_NORTH)
				{
					dx = 0;
					dy = -dy;
				}
				else if (dir == mxConstants.DIRECTION_WEST)
				{
					dx = -dx;
					dy = 0;
				}
				else if (dir == mxConstants.DIRECTION_EAST)
				{
					dy = 0;
				}
				
				graph.moveCells(subtree, dx, dy);
	
				removeTerminalPoints(clones[0]);

				return graph.addCells(clones, parent);
			}
			finally
			{
				graph.model.endUpdate();
			}
		};
	
		function addChild(cell, direction, targetCell)
		{
			graph.model.beginUpdate();
			try
			{
				var parent = graph.model.getParent(cell);
				var edges = graph.getIncomingTreeEdges(cell);
				var dir = getTreeDirection(cell);

				// Handles special case for click on tree root
				if (edges.length == 0)
				{
					edges = [graph.createEdge(parent, null, '', null, null,
						graph.createCurrentEdgeStyle())];
					dir = direction;
				}

				var clones = replaceTargetCell(graph.cloneCells(
					[edges[0], cell]), cell, targetCell);
				graph.model.setTerminal(clones[0], cell, true);
				
				if (graph.model.getTerminal(clones[0], false) == null)
				{
					graph.model.setTerminal(clones[0], clones[1], false);
					graph.applyNewEdgeStyle(clones[1], [clones[0]], dir);
				}
				
				// Finds free space
				var edges = graph.getOutgoingTreeEdges(cell);
				var pgeo = parent.geometry;
				var targets = [];
				
				// Not offset if inside group
				if (graph.view.currentRoot == parent)
				{
					pgeo = new mxRectangle();
				}
	
				for (var i = 0; i < edges.length; i++)
				{
					var target = graph.model.getTerminal(edges[i], false);
					
					if (target != null)
					{
						targets.push(target);
					}
				}
				
				var bbox = graph.view.getBounds(targets);
				var tr = graph.view.translate;
				var s = graph.view.scale;
				
				if (dir == mxConstants.DIRECTION_SOUTH)
				{
					clones[1].geometry.x = (bbox == null) ? cell.geometry.x + (cell.geometry.width -
						clones[1].geometry.width) / 2 : (bbox.x + bbox.width) / s - tr.x -
						pgeo.x + spacing;
					clones[1].geometry.y += cell.geometry.height - pgeo.y + level;
				}
				else if (dir == mxConstants.DIRECTION_NORTH)
				{
					clones[1].geometry.x = (bbox == null) ? cell.geometry.x + (cell.geometry.width -
						clones[1].geometry.width) / 2 : (bbox.x + bbox.width) / s - tr.x + -
						pgeo.x + spacing; 
					clones[1].geometry.y -= clones[1].geometry.height + pgeo.y + level;
				}
				else if (dir == mxConstants.DIRECTION_WEST)
				{
					clones[1].geometry.x -= clones[1].geometry.width + pgeo.x + level;
					clones[1].geometry.y = (bbox == null) ? cell.geometry.y + (cell.geometry.height -
						clones[1].geometry.height) / 2 : (bbox.y + bbox.height) / s - tr.y + -
						pgeo.y + spacing; 
				}
				else
				{
					clones[1].geometry.x += cell.geometry.width - pgeo.x + level;
					clones[1].geometry.y = (bbox == null) ? cell.geometry.y + (cell.geometry.height -
						clones[1].geometry.height) / 2 : (bbox.y + bbox.height) / s - tr.y + -
						pgeo.y + spacing;
				}
	
				removeTerminalPoints(clones[0]);

				return graph.addCells(clones, parent);
			}
			finally
			{
				graph.model.endUpdate();
			}
		};
		
		function getOrderedTargets(cell, horizontal, ref)
		{
			var sib = graph.getOutgoingTreeEdges(cell);
			var state = graph.view.getState(ref);
			var targets = [];
			
			if (state != null && sib != null)
			{
				for (var i = 0; i < sib.length; i++)
				{
					var temp = graph.view.getState(graph.model.getTerminal(sib[i], false));
					
					if (temp != null && ((!horizontal && (Math.min(temp.x + temp.width,
						state.x + state.width) >= Math.max(temp.x, state.x))) ||
						(horizontal && (Math.min(temp.y + temp.height, state.y + state.height) >=
						Math.max(temp.y, state.y)))))
					{
						targets.push(temp);
					}
				}
				
				targets.sort(function(a, b)
				{
					// The sums can be infinite for large geometries
					return (horizontal) ? mxUtils.compareNumbers(a.x + a.width, b.x + b.width) :
						mxUtils.compareNumbers(a.y + a.height, b.y + b.height);
				});
			}
			
			return targets;
		};
		
		function selectCell(cell, direction)
		{
			var dir = getTreeDirection(cell);
			var h1 = dir == mxConstants.DIRECTION_EAST || dir == mxConstants.DIRECTION_WEST;
			var h2 = direction == mxConstants.DIRECTION_EAST || direction == mxConstants.DIRECTION_WEST;
			
			if (h1 == h2 && dir != direction)
			{
				ui.actions.get('selectParent').funct();
			}
			else if (dir == direction)
			{
				var sib = graph.getOutgoingTreeEdges(cell);
				
				if (sib != null && sib.length > 0)
				{
					graph.setSelectionCell(graph.model.getTerminal(sib[0], false));
				}	
			}
			else
			{
				var edges = graph.getIncomingTreeEdges(cell);
	
				if (edges != null && edges.length > 0)
				{
					var targets = getOrderedTargets(graph.model.getTerminal(edges[0], true), h2, cell);
					var state = graph.view.getState(cell);
					
					if (state != null)
					{
						var idx = mxUtils.indexOf(targets, state);
						
						if (idx >= 0)
						{
							idx += (direction == mxConstants.DIRECTION_NORTH || direction == mxConstants.DIRECTION_WEST) ? -1 : 1;
							
							if (idx >= 0 && idx <= targets.length - 1)
							{
								graph.setSelectionCell(targets[idx].cell);
							}
						}
					}
				}	
			}
		};
			
		// Overrides keyboard shortcuts inside tree containers
		var altShiftActions = {67: ui.actions.get('selectChildren'), // Alt+Shift+C
				88: ui.actions.get('selectDescendants'), // Alt+Shift+X
				80: ui.actions.get('selectParent'), // Alt+Shift+P
				83: ui.actions.get('selectSiblings')} // Alt+Shift+S
		
		// New keyboard shortcuts for copy-/pasteStyle
		var altActions = {67: ui.actions.get('copyStyle'), // Alt+C
			86: ui.actions.get('pasteStyle')}; // Alt+V
		var editorUiOnKeyDown = ui.onKeyDown;
		
		ui.onKeyDown = function(evt)
		{
			try
			{
				var cell = graph.getSelectionCell();

				if (graph.isEnabled() && !graph.isEditing() && cell != null)
				{
					// Ctrl/Cmd+Alt(+Shift) is left to the key handler (eg. Ctrl+Alt+C)
					var action = (!mxEvent.isAltDown(evt) || mxEvent.isControlDown(evt) ||
						mxEvent.isMetaDown(evt)) ? null : ((mxEvent.isShiftDown(evt)) ?
							altShiftActions[evt.keyCode] : altActions[evt.keyCode]);

					if (action != null)
					{
						if (action.isEnabled())
						{
							action.funct(evt);
						}

						mxEvent.consume(evt);
					}
					else if (isTreeVertex(cell))
					{
						var cells = null;

						// Ctrl+Shift+Enter adds a child, Ctrl+Alt+Enter a parent, Ctrl+Enter a
						// sibling after and Shift+Enter a sibling before, while Tab moves the
						// focus and Enter edits the label
						if (evt.which == 13 && graph.getIncomingTreeEdges(cell).length > 0)
						{
							var control = mxEvent.isControlDown(evt) ||
								(mxClient.IS_MAC && mxEvent.isMetaDown(evt));
							var shift = mxEvent.isShiftDown(evt);
							var alt = mxEvent.isAltDown(evt);

							if (control && shift && !alt)
							{
								cells = addChild(cell);
							}
							else if (control && alt && !shift)
							{
								cells = addParent(cell);
							}
							else if (control != shift && !alt)
							{
								cells = addSibling(cell, control);
							}
						}
						
						if (cells != null && cells.length > 0)
						{
							if (cells.length == 1 && graph.model.isEdge(cells[0]))
							{
								graph.setSelectionCell(graph.model.getTerminal(cells[0], false));
							}
							else
							{
								graph.setSelectionCell(cells[cells.length - 1]);
							}
							
							// Edits the new cell
							var newCell = graph.getSelectionCell();

							if (ui.hoverIcons != null)
							{
								ui.hoverIcons.update(graph.view.getState(newCell));
							}
							
							graph.startEditingAtCell(newCell);
							mxEvent.consume(evt);
						}
						else if (evt.keyCode == 37) // left
						{
							selectCell(cell, mxConstants.DIRECTION_WEST);
							mxEvent.consume(evt);
						}
						else if (evt.keyCode == 38) // up
						{
							selectCell(cell, mxConstants.DIRECTION_NORTH);
							mxEvent.consume(evt);
						}
						else if (evt.keyCode == 39) // right
						{
							selectCell(cell, mxConstants.DIRECTION_EAST);
							mxEvent.consume(evt);
						}
						else if (evt.keyCode == 40) // down
						{
							selectCell(cell, mxConstants.DIRECTION_SOUTH);
							mxEvent.consume(evt);
						}
					}
				}
			}
			catch (e)
			{
				ui.handleError(e);
			}
			
			if (!mxEvent.isConsumed(evt))
			{
				editorUiOnKeyDown.apply(this, arguments);
			}
		};
	
		var graphConnectVertex = graph.connectVertex;

		graph.connectVertex = function(source, direction, length, evt, forceClone, ignoreCellAt, createTarget, done, targetCell)
		{
			var edges = graph.getIncomingTreeEdges(source);

			if (isTreeVertex(source))
			{
				var dir = getTreeDirection(source);
				var h1 = dir == mxConstants.DIRECTION_EAST || dir == mxConstants.DIRECTION_WEST;
				var h2 = direction == mxConstants.DIRECTION_EAST || direction == mxConstants.DIRECTION_WEST;
				var result = null;

				if (dir == direction || edges.length == 0 ||
					isChildArrowContainer(model.getParent(source)))
				{
					result = addChild(source, direction, targetCell);
				}
				else if (h1 == h2)
				{
					result = addParent(source, targetCell);
				}
				else
				{
					result = addSibling(source, direction != mxConstants.DIRECTION_NORTH &&
						direction != mxConstants.DIRECTION_WEST, targetCell);
				}

				// Invokes the callback like the base function so that the
				// caller selects the inserted cells (eg. hover arrow click)
				if (done != null)
				{
					done(result);
				}
				else
				{
					return result;
				}
			}
			else
			{
				return graphConnectVertex.apply(this, arguments);
			}
		};

		// True if the given cell is a shape in a tree, balloon or mindmap box
		// (see EditorUi.getOutlineLayout)
		function isOutlineTreeVertex(cell)
		{
			return isTreeVertex(cell) && typeof ui.getOutlineLayout === 'function' &&
				ui.getOutlineLayout(model.getParent(cell)) != null;
		};

		var graphStyleDroppedConnection = graph.styleDroppedConnection;

		// A shape dropped onto a hover arrow of a shape in a tree, balloon or
		// mindmap box takes the style of that shape, its parent, like the
		// shapes of the shape picker of the arrows (see createShapePicker and
		// replaceTargetCell), instead of the current style, and its connector
		// the style of the connector of a click on the arrow
		graph.styleDroppedConnection = function(source, target, edge, direction, keepStyle)
		{
			if (isOutlineTreeVertex(source))
			{
				var result = [];
				var sourceState = graph.view.getState(source);

				// Like the shape picker, transparent shapes give no style (else
				// the new shape would be invisible), and copies of the shapes of
				// the diagram (smUsedCopy, see SimpleUsedShapes.js) keep theirs
				if (!keepStyle && (target.smUsedCopy == null ||
					target.smUsedCopy !== EditorUi.simpleUsedShapeCopy) && (sourceState == null ||
					!graph.isTransparentState(sourceState)))
				{
					graph.pasteStyle(graph.copyStyle(source), [target]);
					result.push(target);
				}

				var style = graph.getCurrentCellStyle(source);
				var targetStyle = model.getStyle(target);
				var keys = ['treeFolding', 'treeMoving', 'newEdgeStyle'];

				for (var i = 0; i < keys.length; i++)
				{
					if (style[keys[i]] != null && (targetStyle == null ||
						targetStyle.indexOf(keys[i] + '=') < 0))
					{
						graph.setCellStyles(keys[i], style[keys[i]], [target]);
					}
				}

				// The connector of a click on the arrow (see addChild): the style
				// of the incoming connector of the shape, else for a root the
				// current style with the newEdgeStyle of the shape (eg. without
				// arrows in balloon and mindmap boxes)
				var edges = graph.getIncomingTreeEdges(source);

				if (edges.length > 0)
				{
					// Ties belong to the copied connector (see connector-ties.md)
					model.setStyle(edge, mxUtils.setStyle(
						model.getStyle(edges[0]), 'ties', null));
				}
				else
				{
					graph.applyNewEdgeStyle(source, [edge], direction);
				}

				result.push(edge);

				return result;
			}
			else
			{
				return graphStyleDroppedConnection.apply(this, arguments);
			}
		};

		/**
		 * Returns the given cell with the vertices and tree edges below it, or
		 * only with the hidden ones (see Graph.foldTreeCell) if hidden is true.
		 */
		function getTreeCells(initialCell, hidden)
		{
			var cells = [initialCell];
			var seen = new mxDictionary();
			seen.put(initialCell, true);

			// Gets the subtree from cell downwards
			traverseTree(initialCell, function(vertex, edge)
			{
				var treeEdge = edge != null && graph.isTreeEdge(edge);
				var result = (edge == null || treeEdge) && (!hidden ||
					vertex == initialCell || !model.isVisible(vertex));

				if (result && edge != null && !seen.get(edge))
				{
					seen.put(edge, true);
					cells.push(edge);
				}

				if (result && !seen.get(vertex))
				{
					seen.put(vertex, true);
					cells.push(vertex);
				}

				return result;
			});

			return cells;
		};

		/**
		 * Calls func for the given vertex and for the targets of its outgoing
		 * edges in the order of graph.traverse, each edge once, and goes on
		 * from each vertex for which func does not return false. Walks without
		 * recursion, as hidden subtrees of collapsed cells can be deep.
		 */
		function traverseTree(initialCell, func)
		{
			var visited = new mxDictionary();
			var stack = [];

			var visit = function(vertex, edge)
			{
				if (vertex != null && (edge == null || !visited.get(edge)))
				{
					if (edge != null)
					{
						visited.put(edge, true);
					}

					var result = func(vertex, edge);

					if (result == null || result)
					{
						stack.push({vertex: vertex, index: 0,
							count: model.getEdgeCount(vertex)});
					}
				}
			};

			visit(initialCell, null);

			while (stack.length > 0)
			{
				var frame = stack[stack.length - 1];

				if (frame.index < frame.count)
				{
					var edge = model.getEdgeAt(frame.vertex, frame.index++);

					if (model.getTerminal(edge, true) == frame.vertex)
					{
						visit(model.getTerminal(edge, false), edge);
					}
				}
				else
				{
					stack.pop();
				}
			}
		};

		graph.getSubtree = function(initialCell)
		{
			return ((isTreeMoving(initialCell) || isTreeVertex(initialCell)) &&
				!hasLayoutParent(initialCell)) ? getTreeCells(initialCell) : [initialCell];
		};
		
		/**
		 * Returns true if the given cell shows the move icon handle (top-left
		 * corner, see createCustomHandles in Graph.js) for moving its subtree.
		 */
		function isSubtreeMovable(cell)
		{
			return ((isTreeMoving(cell) || isTreeVertex(cell)) &&
				!hasLayoutParent(cell)) && graph.getOutgoingTreeEdges(
				cell).length > 0 && !graph.isCellCollapsed(cell);
		};

		var graphIsMoveIconVisible = graph.isMoveIconVisible;

		graph.isMoveIconVisible = function(cell)
		{
			return graphIsMoveIconVisible.apply(this, arguments) ||
				isSubtreeMovable(cell);
		};

		// Drags the whole subtree when the move icon is used
		var graphGetMoveIconDragCells = graph.getMoveIconDragCells;

		graph.getMoveIconDragCells = function(cell)
		{
			return (isSubtreeMovable(cell)) ? this.getSubtree(cell) :
				graphGetMoveIconDragCells.apply(this, arguments);
		};
	};

	/**
	 * Adds shapes to sidebar in edit mode.
	 */
	if (typeof Sidebar !== 'undefined')
	{
		var sidebarCreateAdvancedShapes = Sidebar.prototype.createAdvancedShapes;
		Sidebar.prototype.createAdvancedShapes = function()
		{
			var result = sidebarCreateAdvancedShapes.apply(this, arguments);
			var graph = this.graph;
			var sb = this;

			// Style that defines the key, value pairs to be used for creating styles of new connections if no incoming edge exists
			var orgEdgeStyle = 'edgeStyle=elbowEdgeStyle;elbow=vertical;sourcePerimeterSpacing=0;' +
				'targetPerimeterSpacing=0;startArrow=none;endArrow=none;rounded=0;curved=0;';
			var mmEdgeStyle = 'newEdgeStyle={"edgeStyle":"entityRelationEdgeStyle","startArrow":"none","endArrow":"none",' +
				'"segment":10,"curved":1,"sourcePerimeterSpacing":0,"targetPerimeterSpacing":0};';
			var treeEdgeStyle = 'newEdgeStyle={"edgeStyle":"elbowEdgeStyle","startArrow":"none","endArrow":"none"};';

			// The tree containers are only "semi layouted" — the tree tools place
			// new cells but nothing ever resizes the group, so children can end
			// up outside the box or flush against its border. transparentBounds
			// derives the visible bounds from the children instead (padded by
			// groupPadding plus the title bar), with the stored geometry pinned
			// at (0,0,0,0) per the transparentBounds convention.
			var treeContainerStyle = 'swimlane;startSize=20;horizontal=1;' +
				'containerType=tree;transparentBounds=1;groupPadding=20;';

			// The mindmap is a live layout container (see MindmapLayout), its
			// cells are authored at the positions of the layout so that a drop
			// moves nothing
			var mindmapLayout = 'childLayout=' + Graph.encodeChildLayout([{layout: 'MindmapLayout',
				config: {levelDistance: 40, nodeDistance: 10}}]) + ';';

			return result.concat([
				this.addEntry('tree container', function()
				{
					var cell = new mxCell('Tree Container', new mxGeometry(0, 0, 0, 0),
						treeContainerStyle);
					cell.vertex = true;
					
			    	var cell2 = new mxCell('Parent', new mxGeometry(140, 60, 120, 40),
			    		'whiteSpace=wrap;html=1;treeFolding=1;treeMoving=1;' + treeEdgeStyle);
			    	cell2.vertex = true;
			    	
			    	var cell3 = new mxCell('Child', new mxGeometry(140, 140, 120, 40),
			    		'whiteSpace=wrap;html=1;treeFolding=1;treeMoving=1;' + treeEdgeStyle);
			    	cell3.vertex = true;
	
			    	var edge = new mxCell('', new mxGeometry(0, 0, 0, 0), orgEdgeStyle);
					edge.geometry.relative = true;
					edge.edge = true;
	
					cell2.insertEdge(edge, true);
					cell3.insertEdge(edge, false);
					
			    	cell.insert(edge);
			    	cell.insert(cell2);
			    	cell.insert(cell3);
					
			    	// Thumbnail size = derived bounds (children bbox + padding + title)
			    	return sb.createVertexTemplateFromCells([cell], 160, 180, cell.value);
				}),
				this.addEntry('tree mindmap mindmaps central idea branch topic', function()
				{
					var mindmap = new mxCell('Mindmap', new mxGeometry(0, 0, 0, 0),
						treeContainerStyle + mindmapLayout);
					mindmap.vertex = true;
					
					var cell = new mxCell('Central Idea', new mxGeometry(140, 48, 100, 40),
				    	'ellipse;whiteSpace=wrap;html=1;align=center;' +
				    	'treeFolding=1;treeMoving=1;' + mmEdgeStyle);
			    	cell.vertex = true;
			    	
			    	var cell2 = new mxCell('Topic', new mxGeometry(280, 40, 80, 20),
				    	'whiteSpace=wrap;html=1;rounded=1;arcSize=50;align=center;verticalAlign=middle;' +
		    			'strokeWidth=1;autosize=1;spacing=4;treeFolding=1;treeMoving=1;' + mmEdgeStyle);
			    	cell2.vertex = true;

			    	var edge = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=entityRelationEdgeStyle;' +
						'startArrow=none;endArrow=none;segment=10;curved=1;sourcePerimeterSpacing=0;' +
						'targetPerimeterSpacing=0;');
					edge.geometry.relative = true;
					edge.edge = true;
	
					cell.insertEdge(edge, true);
					cell2.insertEdge(edge, false);
					
			    	var cell3 = new mxCell('Branch', new mxGeometry(280, 70, 72, 26),
			    		'whiteSpace=wrap;html=1;shape=partialRectangle;top=0;left=0;bottom=1;right=0;points=[[0,1],[1,1]];' +
			    		'fillColor=none;align=center;verticalAlign=bottom;routingCenterY=0.5;' +
			    		'snapToPoint=1;autosize=1;treeFolding=1;treeMoving=1;' + mmEdgeStyle);
			    	cell3.vertex = true;

			    	var edge2 = new mxCell('', new mxGeometry(0, 0, 0, 0), edge.style);
					edge2.geometry.relative = true;
					edge2.edge = true;
	
					cell.insertEdge(edge2, true);
					cell3.insertEdge(edge2, false);
			    	
			    	var cell4 = new mxCell('Topic', new mxGeometry(20, 40, 80, 20),
				    	'whiteSpace=wrap;html=1;rounded=1;arcSize=50;align=center;verticalAlign=middle;' +
		    			'strokeWidth=1;autosize=1;spacing=4;treeFolding=1;treeMoving=1;' + mmEdgeStyle);
			    	cell4.vertex = true;
	
			    	var edge3 = new mxCell('', new mxGeometry(0, 0, 0, 0), edge.style);
					edge3.geometry.relative = true;
					edge3.edge = true;
		
					cell.insertEdge(edge3, true);
					cell4.insertEdge(edge3, false);
					
			    	var cell5 = new mxCell('Branch', new mxGeometry(28, 70, 72, 26),
			    		'whiteSpace=wrap;html=1;shape=partialRectangle;top=0;left=0;bottom=1;right=0;points=[[0,1],[1,1]];' +
			    		'fillColor=none;align=center;verticalAlign=bottom;routingCenterY=0.5;' +
			    		'snapToPoint=1;autosize=1;treeFolding=1;treeMoving=1;' + mmEdgeStyle);
			    	cell5.vertex = true;
	
			    	var edge4 = new mxCell('', new mxGeometry(0, 0, 0, 0), edge.style);
					edge4.geometry.relative = true;
					edge4.edge = true;
	
					cell.insertEdge(edge4, true);
					cell5.insertEdge(edge4, false);
				    	
					mindmap.insert(edge);
					mindmap.insert(edge2);
					mindmap.insert(edge3);
					mindmap.insert(edge4);
					mindmap.insert(cell);
					mindmap.insert(cell2);
					mindmap.insert(cell3);
					mindmap.insert(cell4);
					mindmap.insert(cell5);
					
					// Thumbnail size = derived bounds (children bbox + padding + title)
					return sb.createVertexTemplateFromCells([mindmap], 380, 116, mindmap.value);
				}),
				this.addEntry('tree mindmap mindmaps central idea', function()
				{
					var cell = new mxCell('Central Idea', new mxGeometry(0, 0, 100, 40),
				    	'ellipse;whiteSpace=wrap;html=1;align=center;' + mmEdgeStyle +
				    	'treeFolding=1;treeMoving=1;');
			    	cell.vertex = true;
			    	
			    	return sb.createVertexTemplateFromCells([cell], cell.geometry.width,
			    		cell.geometry.height, cell.value);
				}),
				this.addEntry('tree mindmap mindmaps branch', function()
				{
			    	var cell = new mxCell('Branch', new mxGeometry(0, 0, 80, 20),
			    		'whiteSpace=wrap;html=1;shape=partialRectangle;top=0;left=0;bottom=1;right=0;points=[[0,1],[1,1]];' +
			    		'fillColor=none;align=center;verticalAlign=bottom;routingCenterY=0.5;' +
			    		'snapToPoint=1;recursiveResize=0;autosize=1;treeFolding=1;treeMoving=1;' + mmEdgeStyle);
			    	cell.vertex = true;
	
			    	var edge = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=entityRelationEdgeStyle;' +
						'startArrow=none;endArrow=none;segment=10;curved=1;sourcePerimeterSpacing=0;' +
						'targetPerimeterSpacing=0;');
					edge.geometry.setTerminalPoint(new mxPoint(-40, 40), true);
					edge.geometry.relative = true;
					edge.edge = true;
	
					cell.insertEdge(edge, false);
					
					return sb.createVertexTemplateFromCells([cell, edge], cell.geometry.width,
						cell.geometry.height, cell.value);
				}),
				this.addEntry('tree mindmap mindmaps sub topic', function()
				{
			   		var cell = new mxCell('Sub Topic', new mxGeometry(0, 0, 80, 26),
			    		'whiteSpace=wrap;html=1;rounded=1;arcSize=50;align=center;verticalAlign=middle;' +
			    		'strokeWidth=1;autosize=1;spacing=4;treeFolding=1;treeMoving=1;' + mmEdgeStyle);
			    	cell.vertex = true;
	
			    	var edge = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=entityRelationEdgeStyle;startArrow=none;' +
			    		'endArrow=none;segment=10;curved=1;sourcePerimeterSpacing=0;' +
						'targetPerimeterSpacing=0;');
					edge.geometry.setTerminalPoint(new mxPoint(-40, 40), true);
					edge.geometry.relative = true;
					edge.edge = true;
	
					cell.insertEdge(edge, false);
					
					return sb.createVertexTemplateFromCells([cell, edge], cell.geometry.width,
						cell.geometry.height, cell.value);
				}),
				this.addEntry('tree orgchart organization division', function()
				{
					var orgchart = new mxCell('Orgchart', new mxGeometry(0, 0, 0, 0),
						treeContainerStyle + treeEdgeStyle);
					orgchart.vertex = true;
				
			    	var cell = new mxCell('Organization', new mxGeometry(80, 40, 120, 60),
			    		'whiteSpace=wrap;html=1;align=center;treeFolding=1;treeMoving=1;' + treeEdgeStyle);
				    graph.setAttributeForCell(cell, 'treeRoot', '1');
			    	cell.vertex = true;
			    	
			    	var cell2 = new mxCell('Division', new mxGeometry(20, 140, 100, 60),
			    		'whiteSpace=wrap;html=1;align=center;verticalAlign=middle;treeFolding=1;treeMoving=1;' + treeEdgeStyle);
			    	cell2.vertex = true;
	
			    	var edge = new mxCell('', new mxGeometry(0, 0, 0, 0), orgEdgeStyle);
					edge.geometry.relative = true;
					edge.edge = true;
	
					cell.insertEdge(edge, true);
					cell2.insertEdge(edge, false);
			    	
			    	var cell3 = new mxCell('Division', new mxGeometry(160, 140, 100, 60),
			    		'whiteSpace=wrap;html=1;align=center;verticalAlign=middle;treeFolding=1;treeMoving=1;' + treeEdgeStyle);
			    	cell3.vertex = true;
	
			    	var edge2 = new mxCell('', new mxGeometry(0, 0, 0, 0), orgEdgeStyle);
					edge2.geometry.relative = true;
					edge2.edge = true;
	
					cell.insertEdge(edge2, true);
					cell3.insertEdge(edge2, false);
					
					orgchart.insert(edge);
					orgchart.insert(edge2);
					orgchart.insert(cell);
					orgchart.insert(cell2);
					orgchart.insert(cell3);
					
					// Thumbnail size = derived bounds (children bbox + padding + title)
					return sb.createVertexTemplateFromCells([orgchart], 280, 220, orgchart.value);
				}),
				this.addEntry('tree root', function()
				{
			    	var cell = new mxCell('Organization', new mxGeometry(0, 0, 120, 60),
			    		'whiteSpace=wrap;html=1;align=center;treeFolding=1;treeMoving=1;' + treeEdgeStyle);
				    graph.setAttributeForCell(cell, 'treeRoot', '1');
			    	cell.vertex = true;
			
			    	return sb.createVertexTemplateFromCells([cell], cell.geometry.width,
				    		cell.geometry.height, cell.value);
				}),
				this.addEntry('tree division', function()
				{
		    		var cell = new mxCell('Division', new mxGeometry(20, 40, 100, 60),
			    		'whiteSpace=wrap;html=1;align=center;verticalAlign=middle;treeFolding=1;treeMoving=1;' + treeEdgeStyle);
			    	cell.vertex = true;
			    	
			    	var edge = new mxCell('', new mxGeometry(0, 0, 0, 0), orgEdgeStyle);
			    	edge.geometry.setTerminalPoint(new mxPoint(0, 0), true);
					edge.geometry.relative = true;
					edge.edge = true;
	
					cell.insertEdge(edge, false);
				    	
					return sb.createVertexTemplateFromCells([cell, edge], cell.geometry.width,
						cell.geometry.height, cell.value);
				}),
				this.addEntry('tree sub sections', function()
				{
			    	var cell = new mxCell('Sub Section', new mxGeometry(0, 0, 100, 60),
			    		'whiteSpace=wrap;html=1;align=center;verticalAlign=middle;treeFolding=1;treeMoving=1;');
			    	cell.vertex = true;
	
			    	var edge = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=orthogonalEdgeStyle;sourcePerimeterSpacing=0;targetPerimeterSpacing=0;' +
						'startArrow=none;endArrow=none;rounded=0;targetPortConstraint=eastwest;sourcePortConstraint=northsouth;curved=0;rounded=0;');
					edge.geometry.setTerminalPoint(new mxPoint(110, -40), true);
					edge.geometry.relative = true;
					edge.edge = true;
	
					cell.insertEdge(edge, false);
	
			    	var cell2 = new mxCell('Sub Section', new mxGeometry(120, 0, 100, 60),
			    		'whiteSpace=wrap;html=1;align=center;verticalAlign=middle;treeFolding=1;treeMoving=1;');
			    	cell2.vertex = true;
	
			    	var edge2 = new mxCell('', new mxGeometry(0, 0, 0, 0), edge.style);
					edge2.geometry.setTerminalPoint(new mxPoint(110, -40), true);
					edge2.geometry.relative = true;
					edge2.edge = true;
	
					cell2.insertEdge(edge2, false);
										
				    return sb.createVertexTemplateFromCells([edge, edge2, cell, cell2], 220, 60, 'Sub Sections');
				})
			]);
		};
	}
})();
