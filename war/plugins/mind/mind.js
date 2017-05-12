/**
 * Mindmaps plugin.
 */
Draw.loadPlugin(function(ui)
{
	var graph = ui.editor.graph;
	var model = graph.getModel();
	
	// Global layout instance
	var layout = new mxCompactTreeLayout(graph, true);
	layout.edgeRouting = false;
	layout.levelDistance = 100;
	
	function isMindMapCell(cell)
	{
		var result = false;
		
		if (cell != null)
		{
			graph.traverse(cell, true, function(vertex)
			{
				var tmp = graph.view.getState(vertex);
				result = tmp.style['mindmapRoot'] == '1';
				
				return !result;
			}, null, null, true);
		}
		
		return result;
	};
	
	var graphFoldCells = graph.foldCells;
	
	graph.foldCells = function(collapse, recurse, cells, checkFoldable, evt)
	{
		//console.log('cells', cells, collapse);
		this.stopEditing();
		
		this.model.beginUpdate();
		try
		{
			var newCells = cells.splice();
			var tmp = [];
			
			for (var i = 0; i < cells.length; i++)
			{
				if (isMindMapCell(cells[i]))
				{
					graph.traverse(cells[i], true, function(vertex, edge)
					{
						if (edge != null)
						{
							tmp.push(edge);
						}
						
						if (vertex != cells[i])
						{
							tmp.push(vertex);
						}
						
						// Stop traversal on collapsed vertices
						return vertex == cells[i] || !graph.model.isCollapsed(vertex);
					});
					
					graph.model.setCollapsed(cells[i], collapse);
				}
			}

			for (var i = 0; i < tmp.length; i++)
			{
				graph.model.setVisible(tmp[i], !collapse);
			}
			
			cells = newCells;
			graphFoldCells.apply(this, arguments);
		}
		finally
		{
			this.model.endUpdate();
		}
	};
	
	var graphRemoveCells = graph.removeCells;
	
	graph.removeCells = function(cells, includeEdges)
	{
		var tmp = [];
		
		for (var i = 0; i < cells.length; i++)
		{
			if (isMindMapCell(cells[i]))
			{
				graph.traverse(cells[i], true, function(vertex, edge)
				{
					tmp.push(edge);
					tmp.push(vertex);
					
					return true;
				});
				
				var edges = graph.getIncomingEdges(cells[i]);
				cells = cells.concat(edges);
			}
			else
			{
				tmp.push(cells[i]);
			}
		}
		
		cells = tmp;
		
		graphRemoveCells.apply(this, arguments);
	};
	
	var graphConnectVertex = graph.connectVertex;
	
	ui.hoverIcons.getStateAt = function(state, x, y)
	{
		return (isMindMapCell(state.cell)) ? null : this.graph.view.getState(this.graph.getCellAt(x, y));
	};
	
	graph.connectVertex = function(source, direction, length, evt, forceClone)
	{
		var state = graph.view.getState(source);
		
		if (isMindMapCell(state.cell))
		{
			var sw = parseInt(state.style['strokeWidth'] || 1);
			
	    	var cell = new mxCell('Sub Topic', new mxGeometry(0, 0, 80, 20),
	    		'shape=partialRectangle;top=0;left=0;bottom=1;right=0;autosize=1;points=[[0,1],[1,1]];snapToPoint=1;' +
	    		'strokeColor=#000000;fillColor=none;align=center;verticalAlign=middle;collapsible=1;spacingLeft=14;' +
	    		'strokeWidth=' + sw + ';');
	    	cell.vertex = true;

	    	var edge = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=entityRelationEdgeStyle;curved=1;' +
				'startArrow=none;endArrow=none;endFill=0;jettySize=auto;entryX=0;entryY=1;' +
	    		'strokeWidth=' + sw + ';' + ((state.style['mindmapRoot'] == '1') ? '' : 'exitX=1;exitY=1;'));
			edge.geometry.setTerminalPoint(new mxPoint(-100, 60), true);
			edge.geometry.relative = true;
			edge.edge = true;
			
			cell.insertEdge(edge, false);
	    				
			model.beginUpdate();
			try
			{
				graph.addCell(cell, model.getParent(source));
				graph.addEdge(edge, model.getParent(source), source, cell);
				
				if (state.style['mindmapRoot'] != '1' && graph.getOutgoingEdges(source).length > 1)
				{
					graph.moveCells([state.cell], 0, 30);
				}
				
				layout.execute(model.getParent(source), source);

				this.fireEvent(new mxEventObject('cellsInserted', 'cells', [cell, edge]));
			}
			finally
			{
				model.endUpdate();
			}
			
			graph.startEditingAtCell(cell);
			
			// Selects only vertex
			return [cell];
		}
		else
		{
			return graphConnectVertex.apply(this, arguments);
		}
	};
	
	var graphHandlerGetCells = graph.graphHandler.getCells;

	graph.graphHandler.getCells = function(initialCell)
	{
		var cells = graphHandlerGetCells.apply(this, arguments);
		var state = graph.view.getState(initialCell);
		
		if (state != null && isMindMapCell(state.cell))
		{
			// Gets the subtree from cell downwards
			graph.traverse(initialCell, true, function(vertex)
			{
				// TODO: Use dictionary to avoid duplicates
				if (mxUtils.indexOf(cells, vertex) < 0)
				{
					cells.push(vertex);
				}
				
				return true;
			});
		}
		
		return cells;
	};
	
//	var ignoreMove = false;
//	
//	graph.addListener(mxEvent.MOVE_CELLS, function(sender, evt)
//	{
//		if (!ignoreMove)
//		{
//			var cells = evt.getProperty('cells');
//			var dx = evt.getProperty('dx');
//			var dy = evt.getProperty('dy');
//			ignoreMove = true;
//			
//			for (var i = 0; i < cells.length; i++)
//			{
//				var state = graph.view.getState(cells[i]);
//				
//				if (state != null && state.style['mindmapRoot'] == '1')
//				{
//					// TODO: Move subtree by same dx/dy
//					//layout.execute(model.getParent(state.cell), state.cell);
//					
//					// Gets the subtree from cell downwards
//					var tmp = [];
//					graph.traverse(cells[i], true, function(vertex)
//					{
//						tmp.push(vertex);
//						
//						return true;
//					});
//					
//					mxUtils.remove(cells[i], tmp);
//					graph.moveCells(tmp, dx, dy);
//				}
//			}
//
//			ignoreMove = false;
//		}
//	});
	
	// Defines a new class for all icons
	function mxIconSet(state)
	{
		this.images = [];
		var graph = state.view.graph;
		
		// Icon1
//		var img = mxUtils.createImage('images/handle-connect.png');
//		img.setAttribute('title', 'Duplicate');
//		img.style.position = 'absolute';
//		img.style.cursor = 'pointer';
//		img.style.width = '26px';
//		img.style.height = '26px';
//		img.style.left = (state.x - 13) + 'px';
//		img.style.top = (state.getCenterY() - 13) + 'px';
//		
//		mxEvent.addGestureListeners(img,
//			mxUtils.bind(this, function(evt)
//			{
//				var s = graph.gridSize;
//				graph.setSelectionCells(graph.moveCells([state.cell], s, s, true));
//				mxEvent.consume(evt);
//				this.destroy();
//			})
//		);
//		
//		state.view.graph.container.appendChild(img);
//		this.images.push(img);
		
		// Delete
		var img = mxUtils.createImage('plugins/mind/handle-move.gif');
		img.setAttribute('title', 'Move Cell without Subtree');
		img.style.position = 'absolute';
		img.style.cursor = 'pointer';
		img.style.width = '26px';
		img.style.height = '26px';
		img.style.left = (state.getCenterX() - 13) + 'px';
		img.style.top = (state.getCenterY() - 13) + 'px';
		
		mxEvent.addGestureListeners(img,
			mxUtils.bind(this, function(evt)
			{
				graph.stopEditing(false);
				graph.graphHandler.start(state.cell,
					mxEvent.getClientX(evt), mxEvent.getClientY(evt));
				
//				var tmp = [];
//				graph.traverse(state.cell, true, function(vertex)
//				{
//					tmp.push(vertex);
//					
//					return true;
//				});
				
				graph.graphHandler.cells = [state.cell];
				graph.graphHandler.bounds = graph.graphHandler.graph.getView().getBounds(graph.graphHandler.cells);
				graph.graphHandler.pBounds = graph.graphHandler.getPreviewBounds(graph.graphHandler.cells);
				
				
				graph.graphHandler.cellWasClicked = true;
				graph.isMouseDown = true;
				graph.isMouseTrigger = mxEvent.isMouseEvent(evt);
				mxEvent.consume(evt);
				
				// Disables dragging the image
				mxEvent.consume(evt);
				this.destroy();
			})
		);
		
//		mxEvent.addListener(img, 'click',
//			mxUtils.bind(this, function(evt)
//			{
//				//graph.removeCells([state.cell]);
//				mxEvent.consume(evt);
//				this.destroy();
//			})
//		);
		
		state.view.graph.container.appendChild(img);
		this.images.push(img);
	};
	
	mxIconSet.prototype.destroy = function()
	{
		if (this.images != null)
		{
			for (var i = 0; i < this.images.length; i++)
			{
				var img = this.images[i];
				img.parentNode.removeChild(img);
			}
		}
		
		this.images = null;
	};
	
	// Defines the tolerance before removing the icons
	var iconTolerance = 20;

	// Shows icons if the mouse is over a cell
	graph.addMouseListener(
	{
	    currentState: null,
	    currentIconSet: null,
	    mouseDown: function(sender, me)
	    {
	    	// Hides icons on mouse down
        	if (this.currentState != null)
        	{
          		this.dragLeave(me.getEvent(), this.currentState);
          		this.currentState = null;
        	}
	    },
	    mouseMove: function(sender, me)
	    {
	    	if (this.currentState != null && (me.getState() == this.currentState ||
	    		me.getState() == null))
	    	{
	    		var tol = iconTolerance;
	    		var tmp = new mxRectangle(me.getGraphX() - tol,
	    			me.getGraphY() - tol, 2 * tol, 2 * tol);

	    		if (mxUtils.intersects(tmp, this.currentState))
	    		{
	    			return;
	    		}
	    	}
	    	
			var tmp = graph.view.getState(me.getCell());
			
	    	// Ignores everything but vertices
			if (graph.isMouseDown || graph.isEditing() || (tmp != null &&
				(!graph.getModel().isVertex(tmp.cell) || !isMindMapCell(me.getCell()))))
			{
				tmp = null;
			}

	      	if (tmp != this.currentState)
	      	{
	        	if (this.currentState != null)
	        	{
	          		this.dragLeave(me.getEvent(), this.currentState);
	        	}
	        
        		this.currentState = tmp;
	        
	        	if (this.currentState != null)
	        	{
	          		this.dragEnter(me.getEvent(), this.currentState);
	        	}
	      	}
	    },
	    mouseUp: function(sender, me) { },
	    dragEnter: function(evt, state)
	    {
	    	if (this.currentIconSet == null)
	    	{
    			this.currentIconSet = new mxIconSet(state);
	    	}
	    },
	    dragLeave: function(evt, state)
	    {
	    	if (this.currentIconSet != null)
	    	{
    			this.currentIconSet.destroy();
    			this.currentIconSet = null;
	    	}
	    }
	});
	
	// Animates the changes in the graph model
	// TODO: Avoid geometry change if not needed
//	model.addListener(mxEvent.BEFORE_UNDO, function(sender, evt)
//	{
//		// TODO: State may not exist at this point
//		var states = graph.view.getStates();
//		
//		states.visit(function(id, state)
//		{
//			if (state.style['mindmapRoot'] == '1')
//			{
//				layout.execute(model.getParent(state.cell), state.cell);
//			}
//		});
//	});
	
	// Implements additional styles
//	graph.isCellDisconnectable = function(cell, terminal, source)
//	{
//		var state = this.view.getState(cell);
//		var style = (state != null) ? state.style : this.getCellStyle(cell);
//		
//		return style['disconnectable'] != '0';
//	};

	// Adds sidebar entries
	var sb = ui.sidebar;
	
    sb.addPalette('mindmaps', 'Mindmaps', true, function(content)
    {
    	var sw = 1;
    	
    	content.appendChild(ui.sidebar.createVertexTemplate('ellipse;whiteSpace=wrap;html=1;mindmapRoot=1;' +
    		'strokeWidth=' + sw + ';collapsible=0;container=1;recursiveResize=0;align=center;',
        	120, 60, 'Main Topic', 'Mindmap Root'));

        (function()
        {
	    	var cell = new mxCell('Sub Topic', new mxGeometry(0, 0, 80, 20),
	    		'whiteSpace=wrap;html=1;shape=partialRectangle;top=0;left=0;bottom=1;right=0;points=[[0,1],[1,1]];' +
	    		'strokeColor=#000000;fillColor=none;align=center;verticalAlign=bottom;routingCenterY=0.5;' +
	    		'snapToPoint=1;collapsible=0;container=1;recursiveResize=0;strokeWidth=' + sw + ';');
	    	cell.vertex = true;

	    	var edge = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=entityRelationEdgeStyle;curved=1;' +
				'startArrow=none;endArrow=none;segment=10;strokeWidth=' + sw + ';');
			edge.geometry.setTerminalPoint(new mxPoint(-60, 40), true);
			edge.geometry.relative = true;
			edge.edge = true;

			cell.insertEdge(edge, false);
	
			content.appendChild(sb.createVertexTemplateFromCells([cell, edge], 80, 20, 'Sub Topic'));
        })();
        
        (function()
        {
	    	var cell = new mxCell('Sub Topic', new mxGeometry(0, 0, 100, 30),
	    		'whiteSpace=wrap;html=1;rounded=1;arcSize=50;align=center;verticalAlign=middle;collapsible=1;' +
	    		'collapsible=0;container=1;recursiveResize=0;strokeWidth=' + sw + ';');
	    	cell.vertex = true;

	    	var edge = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=entityRelationEdgeStyle;curved=1;' +
				'startArrow=none;endArrow=none;segment=10;strokeWidth=' + sw + ';');
			edge.geometry.setTerminalPoint(new mxPoint(-60, 40), true);
			edge.geometry.relative = true;
			edge.edge = true;

			cell.insertEdge(edge, false);

			content.appendChild(sb.createVertexTemplateFromCells([cell, edge], 100, 30, 'Sub Topic'));
        })();
    });
    
    // Collapses default sidebar entry and inserts this before
    var c = ui.sidebar.container;
    var general = c.getElementsByTagName('a')[0];
    general.click();
    c.insertBefore(c.lastChild.previousSibling, general);
    c.insertBefore(c.lastChild, general);
});