/**
 * Explore plugin.
 */
Draw.loadPlugin(function(editorUi)
{
	// Adds resource for action
	mxResources.parse('animation=Animation...');

	// Adds action
	editorUi.actions.addAction('animation', function()
	{
		if (this.animationWindow == null)
		{
			// LATER: Check outline window for initial placement
			this.animationWindow = new AnimationWindow(editorUi, (document.body.offsetWidth - 480) / 2,
				120, 640, 480);
			this.animationWindow.window.setVisible(true);
		}
		else
		{
			this.animationWindow.window.setVisible(!this.animationWindow.window.isVisible());
		}
	});
	
	var menu = editorUi.menus.get('extras');
	var oldFunct = menu.funct;
	
	menu.funct = function(menu, parent)
	{
		oldFunct.apply(this, arguments);
		
		editorUi.menus.addMenuItems(menu, ['-', 'animation'], parent);
	};
	
	// For animation and fading
	function getNodesForCells(graph, cells)
	{
		var nodes = [];
		
		for (var i = 0; i < cells.length; i++)
		{
			var state = graph.view.getState(cells[i]);
			
			if (state != null)
			{
				var shapes = graph.cellRenderer.getShapesForState(state);
				
				for (var j = 0; j < shapes.length; j++)
				{
					if (shapes[j] != null && shapes[j].node != null)
					{
						nodes.push(shapes[j].node);
					}
				}
				
				// Adds folding icon
				if (state.control != null && state.control.node != null)
				{
					nodes.push(state.control.node);
				}
			}
		}
		
		return nodes;
	};
	
	function fadeIn(nodes)
	{
		if (nodes != null)
		{
			for (var i = 0; i < nodes.length; i++)
			{
				mxUtils.setPrefixedStyle(nodes[i].style, 'transition', null);
				nodes[i].style.opacity = '0';
			}
			
			window.setTimeout(function()
			{
				for (var i = 0; i < nodes.length; i++)
				{
					mxUtils.setPrefixedStyle(nodes[i].style, 'transition', 'all 1s ease-in-out');
					nodes[i].style.opacity = '1';
				}
			}, 0);
		}
	};
	
	function fadeOut(nodes)
	{
		if (nodes != null)
		{
			for (var i = 0; i < nodes.length; i++)
			{
				mxUtils.setPrefixedStyle(nodes[i].style, 'transition', null);
				nodes[i].style.opacity = '1';
			}
			
			window.setTimeout(function()
			{
				for (var i = 0; i < nodes.length; i++)
				{
					mxUtils.setPrefixedStyle(nodes[i].style, 'transition', 'all 1s ease-in-out');
					nodes[i].style.opacity = '0';
				}
			}, 0);
		}
	};
	
	function createEdgeAnimation(state)
	{
		var pts = state.absolutePoints.slice();
		var segs = state.segments;
		var total = state.length;
		var n = pts.length;

		return {
			execute: function(step, steps)
			{
				if (state.shape != null)
				{
					var pts2 = [pts[0]];
					var dist = total * step / steps;
					
					for (var i = 1; i < n; i++)
					{
						if (dist <= segs[i - 1])
						{
							pts2.push(new mxPoint(pts[i - 1].x + (pts[i].x - pts[i - 1].x) * dist / segs[i - 1],
								pts[i - 1].y + (pts[i].y - pts[i - 1].y) * dist / segs[i - 1]));
							
							break;
						}
						else
						{
							dist -= segs[i - 1];
							pts2.push(pts[i]);
						}
					}
					
					state.shape.points = pts2;
					state.shape.redraw();
				}
			},
			stop: function()
			{
				if (state.shape != null)
				{
					state.shape.points = pts;
					state.shape.redraw();
				}
			}
		};
	};
	
	function createVertexAnimation(state)
	{
		var bds = new mxRectangle.fromRectangle(state.shape.bounds);
		var ttr = null;
		
		if (state.text != null && state.text.node != null && state.text.node.firstChild != null)
		{
			ttr = state.text.node.firstChild.getAttribute('transform');
		}
		
		return {
			execute: function(step, steps)
			{
				if (state.shape != null)
				{
					var f = step / steps;
					state.shape.bounds = new mxRectangle(bds.x, bds.y, bds.width * f, bds.height);
					state.shape.redraw();
					
					// Text is animated using CSS3 transitions
					if (ttr != null)
					{
						state.text.node.firstChild.setAttribute('transform', ttr + ' scale(' + f + ',1)');
					}
				}
			},
			stop: function()
			{
				if (state.shape != null)
				{
					state.shape.bounds = bds;
					state.shape.redraw();
					
					if (ttr != null)
					{
						state.text.node.firstChild.setAttribute('transform', ttr);
					}
				}
			}
		};
	};

	function animateCells(graph, cells, steps, delay)
	{
		steps = (steps != null) ? steps : 30;
		delay = (delay != null) ? delay : 30;
		
		var animations = [];
		
		for (var i = 0; i < cells.length; i++)
		{
			var state = graph.view.getState(cells[i]);

			if (state != null && state.shape != null && graph.model.isEdge(state.cell) &&
				state.absolutePoints != null && state.absolutePoints.length > 1)
			{
				animations.push(createEdgeAnimation(state));
			}
			else if (state != null && graph.model.isVertex(state.cell) &&
					state.shape != null && state.shape.bounds != null)
			{
				animations.push(createVertexAnimation(state));
				// TODO: include descendants
			}
		}
		
		var step = 0;
		
		function animate()
		{
			if (step == steps)
			{
				window.clearInterval(thread);
				
				for (var i = 0; i < animations.length; i++)
				{
					animations[i].stop();
				}
			}
			else
			{
				for (var i = 0; i < animations.length; i++)
				{
					animations[i].execute(step, steps);
				}
				
				step++;							
			}
		}
		
		var thread = window.setInterval(animate, delay);
		animate();
	};
	
	function mapCell(cell, clone, mapping)
	{
		mapping = (mapping != null) ? mapping : new Object();
		mapping[cell.id] = clone;
		
		var childCount = cell.getChildCount();
		
		for (var i = 0; i < childCount; i++)
		{
			mapCell(cell.getChildAt(i), clone.getChildAt(i), mapping);
		}
		
		return mapping;
	};
	
	var allowedToRun = false;
	var running = false;
	
	function stop()
	{
		allowedToRun = false;
	};
	
	function run(graph, steps, loop)
	{
		if (!running)
		{
			allowedToRun = true;
			running = true;

			graph.getModel().beginUpdate();
			try
			{
				for (var id in graph.getModel().cells)
				{
					var cell = graph.getModel().cells[id];
					
					if (graph.getModel().isVertex(cell) || graph.getModel().isEdge(cell))
					{
						graph.setCellStyles('opacity', '0', [cell]);
						graph.setCellStyles('noLabel', '1', [cell]);
					}
				}
			}
			finally
			{
				graph.getModel().endUpdate();
			}
			
			var mapping = mapCell(editorUi.editor.graph.getModel().getRoot(), graph.getModel().getRoot());
			var step = 0;
			
			function next()
			{
				if (allowedToRun && step < steps.length)
				{
					var tokens = steps[step].split(' ');
					
					if (tokens.length > 0)
					{
						if (tokens[0] == 'wait' && tokens.length > 1)
						{
							window.setTimeout(function()
							{
								step++;
								next();
							}, parseFloat(tokens[1]));
						}
						else
						{
							if (tokens.length > 1)
							{
								var cell = mapping[tokens[1]];
								
								if (cell != null)
								{
									if (tokens[0] == 'show')
									{
										graph.setCellStyles('opacity', '100', [cell]);
										graph.setCellStyles('noLabel', null, [cell]);
										
										if (tokens.length > 2 && tokens[2] == 'fade')
										{
											fadeIn(getNodesForCells(graph, [cell]));
										}
										else
										{
											animateCells(graph, [cell]);
										}
									}
									else if (tokens[0] == 'hide')
									{
										fadeOut(getNodesForCells(graph, [cell]));
									}
								}
								else
								{
									console.log('cell not found', id, steps[step]);
								}
							}
							
							step++;
							next();
						}
					}
				}
				else
				{
					running = false;
					
					if (loop)
					{
						// Workaround for edge animation
						graph.refresh();
						run(graph, steps, loop);
					}
				}
			};
	
			next();
		}
	};
	
	/**
	 * 
	 */
	var AnimationWindow = function(editorUi, x, y, w, h)
	{
		var table = document.createElement('table');
		table.style.width = '100%';
		table.style.height = '100%';
		var tbody = document.createElement('tbody');
		var tr1 = document.createElement('tr');
		var td11 = document.createElement('td');
		td11.style.width = '140px';
		var td12 = document.createElement('td');
		var tr2 = document.createElement('tr');
		tr2.style.height = '40px';
		var td21 = document.createElement('td');
		td21.setAttribute('colspan', '2');
		
		var list = document.createElement('textarea');
		list.style.overflow = 'auto';
		list.style.width = '100%';
		list.style.height = '100%';
		td11.appendChild(list);
		
		var root = editorUi.editor.graph.getModel().getRoot();
		
		if (root.value != null && typeof(root.value) == 'object')
		{
			list.value = root.value.getAttribute('animation');
		}
		
		var container = document.createElement('div');
		container.style.border = '1px solid lightGray';
		container.style.background = '#ffffff';
		container.style.width = '100%';
		container.style.height = '100%';
		container.style.overflow = 'auto';
		
		mxEvent.disableContextMenu(container);
		td12.appendChild(container);
		
		var graph = new Graph(container);
		graph.setEnabled(false);
		graph.setPanning(true);
		graph.foldingEnabled = false;
		graph.panningHandler.ignoreCell = true;
		graph.panningHandler.useLeftButtonForPanning = true;
		graph.minFitScale = null;
		graph.maxFitScale = null;
		graph.centerZoom = true;

		var fadeInBtn = mxUtils.button('Fade In', function()
		{
			var cells = editorUi.editor.graph.getSelectionCells();
			
			if (cells.length > 0)
			{
				for (var i = 0; i < cells.length; i++)
				{
					list.value = list.value + 'show ' + cells[i].id + ' fade\n';
				}
				
				list.value = list.value + 'wait 1000\n';
			}
		});
		td21.appendChild(fadeInBtn);
		
		var animateBtn = mxUtils.button('Wipe In', function()
		{
			var cells = editorUi.editor.graph.getSelectionCells();
			
			if (cells.length > 0)
			{
				for (var i = 0; i < cells.length; i++)
				{
					list.value = list.value + 'show ' + cells[i].id + '\n';
				}
				
				list.value = list.value + 'wait 1000\n';
			}
		});
		td21.appendChild(animateBtn);
		
		var addBtn = mxUtils.button('Fade Out', function()
		{
			var cells = editorUi.editor.graph.getSelectionCells();
			
			if (cells.length > 0)
			{
				for (var i = 0; i < cells.length; i++)
				{
					list.value = list.value + 'hide ' + cells[i].id + '\n';
				}

				list.value = list.value + 'wait 1000\n';
			}
		});
		td21.appendChild(addBtn);
		
		var waitBtn = mxUtils.button('Wait', function()
		{
			list.value = list.value + 'wait 1000\n';
		});
		td21.appendChild(waitBtn);
		
		var runBtn = mxUtils.button('Preview', function()
		{
			graph.getModel().clear();
			graph.getModel().setRoot(graph.cloneCells([editorUi.editor.graph.getModel().getRoot()])[0]);
			graph.maxFitScale = 1;
			graph.fit(8);
			graph.center();
			
			run(graph, list.value.split('\n'));
		});
		td21.appendChild(runBtn);
		
		var stopBtn = mxUtils.button('Stop', function()
		{
			graph.getModel().clear();
			stop();
		});
		td21.appendChild(stopBtn);
		
		var applyBtn = mxUtils.button('Apply', function()
		{
			editorUi.editor.graph.setAttributeForCell(root, 'animation', list.value);
		});
		td21.appendChild(applyBtn);
		
		tr1.appendChild(td11);
		tr1.appendChild(td12);
		tbody.appendChild(tr1);
		tr2.appendChild(td21);
		tbody.appendChild(tr2);
		table.appendChild(tbody);

		this.window = new mxWindow('Animation', table, x, y, w, h, true, true);
		this.window.destroyOnClose = false;
		this.window.setMaximizable(false);
		this.window.setResizable(true);
		this.window.setClosable(true);
		this.window.setVisible(true);
	};
	
	// Autostart in chromeless mode
	if (editorUi.editor.isChromelessView())
	{
		function startAnimation()
		{
			var root = editorUi.editor.graph.getModel().getRoot();
			var result = false;
			
			if (root.value != null && typeof(root.value) == 'object')
			{
				var desc = root.value.getAttribute('animation');
				
				if (desc != null)
				{
					run(editorUi.editor.graph, desc.split('\n'), true);
					result = true;
				}
			}
			
			return result;
		};
		
		// Wait for file to be loaded if no animation data is present
		if (!startAnimation())
		{
			editorUi.editor.addListener('fileLoaded', startAnimation);
		}
	}
});
