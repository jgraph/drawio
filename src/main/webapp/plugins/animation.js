/**
 * Animations plugin.
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
					// fix : we create an overlay foreignObject if node contains one to ensure animation (foreignObjects are not corectly positionned)
					if (nodes[i].firstChild != null && nodes[i].firstChild.firstChild != null && nodes[i].firstChild.firstChild.nodeName == "foreignObject") {
						var fo = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
						fo.setAttribute("pointer-events", "none");
						fo.setAttribute("width", graph.view.graphBounds.width.toString());
						fo.setAttribute("height", graph.view.graphBounds.height.toString());
						fo.setAttribute("x", graph.view.graphBounds.x.toString());
						fo.setAttribute("y", graph.view.graphBounds.y.toString());
						nodes[i].firstChild.appendChild(fo);

						window.setTimeout(function() {fo.parentElement.removeChild(fo);},2000);
					}

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
					// fix : we create an overlay foreignObject if node contains one to ensure animation (foreignObjects are not corectly positionned)
					if (nodes[i].firstChild != null && nodes[i].firstChild.firstChild != null && nodes[i].firstChild.firstChild.nodeName == "foreignObject") {
						var fo = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
						fo.setAttribute("pointer-events", "none");
						fo.setAttribute("width", graph.view.graphBounds.width.toString());
						fo.setAttribute("height", graph.view.graphBounds.height.toString());
						fo.setAttribute("x", graph.view.graphBounds.x.toString());
						fo.setAttribute("y", graph.view.graphBounds.y.toString());
						nodes[i].firstChild.appendChild(fo);

						window.setTimeout(function() {fo.parentElement.removeChild(fo);},2000);
					}

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
			execute: function(lstep, lsteps)
			{
				if (state.shape != null)
				{
					var pts2 = [pts[0]];
					var dist = total * lstep / lsteps;
					
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
			execute: function(lstep, lsteps)
			{
				if (state.shape != null)
				{
					var f = lstep / lsteps;
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

	function animateCells(graph, cells, lsteps, delay)
	{
		lsteps = (lsteps != null) ? lsteps : 30;
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
		
		var lstep = 0;
		
		function animate()
		{
			if (lstep == lsteps)
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
					animations[i].execute(lstep, lsteps);
				}
				
				lstep++;							
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
	
	var animations = [];
	var animation = null;
	var mapping = null;
	var steps = [];
	var stepsBack = [];
	var step = 0;
	var graph = null;
	var loop = false;
	var waitId = null;


	function next()
	{
		var stepBack = '';

		if (step < steps.length)
		{
			var tokens = steps[step].split(' ');

			if (tokens.length > 0)
			{
				if (tokens[0] == 'wait' && tokens.length > 1)
				{
					stepBack = steps[step];
					stepsBack.unshift(stepBack);

					if (allowedToRun) {
						waitId = window.setTimeout(function()
						{
							waitId = null;
							step++;
							next();
						}, parseFloat(tokens[1]));
					}
					else
					{
						step++;

						if (step >= steps.length) {
							toggleNextButton(false);
						}
						if (step > 0) {
							togglePrevButton(true);
						}
					}
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
								stepBack = 'hide ' + tokens[1];
								if (graph.model.isLayer(cell))
								{
									graph.model.setVisible(cell, true);
								}
								else
								{
									graph.setCellStyles('opacity', '100', [cell]);
									graph.setCellStyles('noLabel', null, [cell]);

									if (tokens.length > 2 && tokens[2] == 'fade')
									{
										stepBack = stepBack + ' fade';
										fadeIn(getNodesForCells(graph, [cell]));
									}
									else
									{
										animateCells(graph, [cell]);
									}
								}
								stepsBack.unshift(stepBack);
							}
							else if (tokens[0] == 'flow')
							{
								stepBack = 'flow ' + tokens[1];
								if (tokens[2] == 'start') {
									stepBack = stepBack + ' stop';
								} else if (tokens[2] == 'stop') {
									stepBack = stepBack + 'start';
								}
                                stepsBack.unshift(stepBack);

								if (graph.model.isEdge(cell))
								{
								  toggleFlowAnim(graph, [cell], tokens[2]);
								}
							}
							else if (tokens[0] == 'hide')
							{
								stepBack = 'show ' + tokens[1];

								//if (graph.model.isLayer(cell))
								//{
								//	graph.model.setVisible(cell, false);
								//}
								//else
								{
									fadeOut(getNodesForCells(graph, [cell]));
									stepBack = stepBack + ' fade';
								}
								stepsBack.unshift(stepBack);
							}
							else if (tokens[0] == 'center')
							{
								stepBack = 'scroll ' + graph.container.scrollLeft.toString() + ' ' + graph.container.scrollTop.toString();
								stepsBack.unshift(stepBack);

								var cellX = cell.geometry.x;
								var cellY = cell.geometry.y;
								var refCell = cell;

								while ((refCell.parent != null) && refCell.parent.geometry != undefined) {
									cellX = cellX + refCell.parent.geometry.x;
									cellY = cellY + refCell.parent.geometry.y;
									refCell = refCell.parent;
								}


								graph.container.scrollTo({
									left : graph.view.scale*(cellX + (cell.geometry.width/2) - graph.view.graphBounds.x) - graph.container.clientWidth/2,
									top : graph.view.scale*(cellY + (cell.geometry.height/2) - graph.view.graphBounds.y) - graph.container.clientHeight/2,
									behavior : 'smooth'
								});
							}
							else if (tokens[0] == 'highlight')
							{
								graph.highlightCell(cell);
								stepsBack.unshift('highlight ' + tokens[1]);
							}
						}
						else if (tokens[0] == 'scale') 
						{
							stepBack = 'scale ' + graph.view.scale.toString();
							stepsBack.unshift(stepBack);

							function stepScale(scaleStep, maxSteps){
								//console.log('scale', graph.view.scale, scaleStep, maxSteps);
								graph.zoomTo(graph.view.scale + scaleStep);
								if (editorUi.editor.isChromelessView()) {
								  editorUi.chromelessResize(!1)	
								}
								if (maxSteps > 1) {
									window.setTimeout(stepScale, 10, scaleStep, maxSteps - 1);
								}
							};


							stepScale((parseFloat(tokens[1]) - graph.view.scale)/10, 10);

						}
                        else if (tokens[0] == 'scroll')
						{
							stepBack = 'scroll ' + graph.container.scrollLeft.toString() + ' ' + graph.container.scrollTop.toString();
							stepsBack.unshift(stepBack);

							graph.container.scrollTo({
								left : parseInt(tokens[1]),
								top : parseInt(tokens[2]),
								behavior : 'smooth'
							});

						}
						else if (tokens[0] == '//') 
						{
							stepBack = steps[step];
							stepsBack.unshift(stepBack);
							// Nothing, comment
							// console.log('comment', tokens[1]);
						}
						else
						{
							console.log('cell not found', tokens[1], steps[step]);
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

			if (loop && allowedToRun)
			{
				// Workaround for edge animation
				graph.refresh();
				run();
			}
		}

		if (step >= steps.length) {
			toggleNextButton(false);
		}
		else {
			toggleNextButton(true);
		}

		if (step > 0) {
			togglePrevButton(true);
		}
		else {
			togglePrevButton(false);
		}
	};


	function run()
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
			


				for (var id in graph.getModel().cells)
				{
					var cell = graph.getModel().cells[id];
					// just to be sure... (shapes with alpha stencils still show up)
					var nodes = getNodesForCells(graph, [cell]);
					for (var i = 0; i < nodes.length; i++)
					{
						nodes[i].style.opacity = '0';
					}
				}

			mapping = mapCell(editorUi.editor.graph.getModel().getRoot(), graph.getModel().getRoot());
			step = 0;
			stepsBack = [];
			
	
	        togglePlayPauseButton('pause');
	        togglePrevButton(false);
	        toggleNextButton(true);
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

		mxEvent.addListener(list, "change", function() {
			activeAnim.steps = list.value;
		});

		var root = editorUi.editor.graph.getModel().getRoot();
		var animations = [];
		
		if (root.value != null && typeof(root.value) == 'object')
		{
			var animationAttribute = root.value.getAttribute('animation');
			if (animationAttribute.substring(0,1) == '[') {
				animations = JSON.parse(animationAttribute);
			}
			else {
				var animation = new Object();
				animation.name = 'Default';
				animation.steps = animationAttribute;
				animations.push(animation);
			}

			//list.value = root.value.getAttribute('animation');
		}
		else {
			var animation = new Object();
			animation.name = 'Default';
			animation.steps = '';
			animations.push(animation);
		}
		
		var container = document.createElement('div');
		container.style.border = '1px solid lightGray';
		container.style.background = '#ffffff';
		container.style.width = '100%';
		container.style.height = '100%';
		container.style.overflow = 'auto';
		
		mxEvent.disableContextMenu(container);
		td12.appendChild(container);
		
		graph = new Graph(container);
		graph.setEnabled(false);
		graph.setPanning(true);
		graph.foldingEnabled = false;
		graph.panningHandler.ignoreCell = true;
		graph.panningHandler.useLeftButtonForPanning = true;
		graph.minFitScale = null;
		graph.maxFitScale = null;
		graph.centerZoom = true;

	    var buttons = {
	      'Fade In': 'show CELL fade',
	      'Wipe In': 'show CELL',
	      'Fade Out': 'hide CELL',
	      'Flow On': 'flow CELL start',
	      'Flow Off': 'flow CELL stop',
	      'Flow Toggle': 'flow CELL',
	      'Highlight' : 'highlight CELL',
	      'Center on cell': 'center CELL',
	      'Wait': '', // added by default
	    }
	    
	    var bkeys = Object.keys(buttons);
	    
	    for (var i = 0; i < bkeys.length; i++)
	    {
	      var wait = 'wait 1000\n';
	    	  
	      (function(key)
	      {
		      var btn = mxUtils.button(key, function()
		      {
		        // we have a cell object
		        var val = buttons[key]
		        
		        if (val.indexOf('CELL') > -1)
		        {
		          var cells = editorUi.editor.graph.getSelectionCells();
		          
		          if (cells.length > 0)
		          {
		            for (var i = 0; i < cells.length; i++)
		            {
		              var tmp = val.replace('CELL', cells[i].id)
		              list.value += tmp + '\n'
		            }
		            
		            list.value += wait
		          }
		        }
		        else
		        {
		          if (val)
		          {
		            list.value += val + '\n'
		          }
		           
		          list.value += wait
		        }

				// Save animation steps
				var evt = document.createEvent("HTMLEvents");
				evt.initEvent("change", false, true);
				list.dispatchEvent(evt);
		
		      });
		      td21.appendChild(btn);
	      })(bkeys[i]);
	    }

		
        var scaleBtn = mxUtils.button('Set Scale', function()
		{
			list.value += 'scale '+ parseFloat(editorUi.editor.graph.view.scale) +'\n';

			// Save animation steps
			var evt = document.createEvent("HTMLEvents");
			evt.initEvent("change", false, true);
			list.dispatchEvent(evt);
		});
		td21.appendChild(scaleBtn);
		
		
		var runBtn = mxUtils.button('Preview', function()
		{
			graph.getModel().clear();
			graph.getModel().setRoot(graph.cloneCells([editorUi.editor.graph.getModel().getRoot()])[0]);
			graph.maxFitScale = 1;
			graph.fit(8);
			graph.center();
			

			steps = list.value.split('\n');
			stepsBack = [];
			run();
		});
		runBtn.style.marginLeft = '20px';
		td21.appendChild(runBtn);
		
		var stopBtn = mxUtils.button('Stop', function()
		{
			graph.getModel().clear();
			stop();
		});
		td21.appendChild(stopBtn);
		
		var applyBtn = mxUtils.button('Apply', function()
		{
			//editorUi.editor.graph.setAttributeForCell(root, 'animation', list.value);
			editorUi.editor.graph.setAttributeForCell(root, 'animation', JSON.stringify(animations));
		});
		td21.appendChild(applyBtn);

		// animation selector
		var trAnimations = document.createElement('tr');
		trAnimations.style.height = '20px';
		var tdAnimations = document.createElement('td');
		tdAnimations.setAttribute('colspan', '2');
		trAnimations.appendChild(tdAnimations);

        var label = document.createElement('label');
        label.style.cssText = 'float: left; display: inline-table;';
        label.setAttribute('for', 'animations-select');
        label.innerText = 'Select animation : ';
        tdAnimations.appendChild(label);

        var activeAnim = null;
        var activeOption = null;

		var selectElement = document.createElement('select');
		selectElement.id = 'animations-select';
		selectElement.style.cssText = 'float: left; margin-right: 10px; width: 150px;';
		tdAnimations.appendChild(selectElement);
		mxEvent.addListener(selectElement, "change", function() {
			activeOption = this.selectedOptions[0];
			activeAnim = activeOption.attachedAnimation;
			list.value = activeAnim.steps;
		});
	    
	    animations.forEach(animation => {
            var option = document.createElement('option');
            option.text = animation.name;
            option.attachedAnimation = animation;
            selectElement.appendChild(option);
	    });

		function controlUniqueName(name, anim) {
			var result = true;
			animations.forEach(animItem => {
				if (animItem.name == name) {
					if (anim == null || anim != animItem) {
						result = false;
					}
				}
			});
			return result;
		}

		var renameAnimBtn = mxUtils.button('Rename', function()
		{
			tdAnimations.childNodes.forEach(element => {
				element.style.displaySave = element.style.display; 
				element.style.display = 'none';
			});

			var span = document.createElement('span');
			span.contentEditable = 'true';
			span.style.cssText = 'float: left; height: 100%; width: 200px; border: 1px solid black; background-color: white; margin-right: 10px; margin-left: 10px;';
			span.innerText = activeAnim.name;
			tdAnimations.appendChild(span);
			span.focus();

			var okBtn = mxUtils.button('Ok', function()
			{
				if (controlUniqueName(span.innerText, activeAnim)) {
					activeAnim.name = span.innerText;
					activeOption.innerText = activeAnim.name;
					tdAnimations.removeChild(span);
					tdAnimations.removeChild(okBtn);

					tdAnimations.childNodes.forEach(element => {
						element.style.display = element.style.displaySave;
					});
				}
				else {
					alert('Name must be unique');
				}
			})
			tdAnimations.appendChild(okBtn);

		});
		tdAnimations.appendChild(renameAnimBtn);

		var newAnimBtn = mxUtils.button('New', function()
		{
			tdAnimations.childNodes.forEach(element => {
				element.style.displaySave = element.style.display; 
				element.style.display = 'none';
			});

			var span = document.createElement('span');
			span.contentEditable = 'true';
			span.style.cssText = 'float: left; height: 100%; width: 200px; border: 1px solid black; background-color: white; margin-right: 10px; margin-left: 10px;';
			tdAnimations.appendChild(span);
			span.focus();

			var okBtn = mxUtils.button('Ok', function()
			{
				if (controlUniqueName(span.innerText)) {
                    var anim = new Object();
					anim.name = span.innerText;
					anim.steps = '';
					animations.push(anim);

            		var option = document.createElement('option');
					option.text = anim.name;
					option.attachedAnimation = anim;
					selectElement.appendChild(option);
					option.selected = true;

					// load animation steps
					var evt = document.createEvent("HTMLEvents");
					evt.initEvent("change", false, true);
					selectElement.dispatchEvent(evt);

					tdAnimations.removeChild(span);
					tdAnimations.removeChild(okBtn);

					tdAnimations.childNodes.forEach(element => {
						element.style.display = element.style.displaySave;
					});
				}
				else {
					alert('Name must be unique');
				}
			})
			tdAnimations.appendChild(okBtn);
		});
		tdAnimations.appendChild(newAnimBtn);

		var deleteAnimBtn = mxUtils.button('Delete', function()
		{
			if (confirm('Do you realy want to delete this animation?')) {
				animations.splice(animations.findIndex(elt => elt == activeAnim), 1);
				selectElement.removeChild(activeOption);

				if (animations.length == 0) {
					var anim = new Object();
					anim.name = 'Default';
					anim.steps = '';
					animations.push(anim);

					var option = document.createElement('option');
					option.text = anim.name;
					option.attachedAnimation = anim;
					selectElement.appendChild(option);
				}

				// load animation steps
				var evt = document.createEvent("HTMLEvents");
				evt.initEvent("change", false, true);
				selectElement.dispatchEvent(evt);
			}
		});
		tdAnimations.appendChild(deleteAnimBtn);

		
		tr1.appendChild(td11);
		tr1.appendChild(td12);
		tbody.appendChild(tr1);

		tbody.appendChild(trAnimations);

		tr2.appendChild(td21);
		tbody.appendChild(tr2);
		table.appendChild(tbody);

		this.window = new mxWindow('Animation', table, x, y, w, h, true, true);
		this.window.destroyOnClose = false;
		this.window.setMaximizable(false);
		this.window.setResizable(true);
		this.window.setClosable(true);
		this.window.setVisible(true);

		// load animation steps
		var evt = document.createEvent("HTMLEvents");
        evt.initEvent("change", false, true);
        selectElement.dispatchEvent(evt);

	};

	function togglePrevButton(enabled) {
		if (editorUi.editor.isChromelessView()) {
			if (enabled) {
				document.getElementById('animPrev').firstElementChild.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAA7EAAAOxAGVKw4bAAABmElEQVRYhe3Wr0tdcRjH8S+Xi4gsDJEbDAtDDItiMotBlpbGwuJYGmaDTfYHLIjJYBAxGEwGk2FpmGRhcUFkyAljiIi8DOde/XrvPT++51oG99Pfn+dzDs/3eZ4QxhrrfxU62BmBn8VWU/gdLnHdkP+AK1ykgi+x61E3ifwM9iP+Twq8jN+e6jaBX8VFH39VB5zCN9wZ1F0N/gW2h7DVAbCInwVwZQAs4VcJnxWBbWzgtgQGBfwENmvwgwEwh+9VhSO1+vg3+FGTzWIw4BP+JhR/CIAW1nCdwGa94h0cJRbuqY1XOGnAZkXPI0UfkTVks1YIYTqEMFXWzRXqhBAmR+BDwGucNvyKtrzxzpr8gThEG+u4STTpNeEEvqrxdIcGiIIs4Dw1QMRXDZ/yAF2TsvH7RAV82fitDhAZrRhcQLGqRvFb5S+sPEDXZBp7TQJ0+RkcFvDV2zAyei8/ImLVWsfyKTtsXtQP0DWaxXFkkHqQ9E/M+gdJZBLwWb4zkk8y+c74gn+4TA4QGc3haAR+HgeNA4w11nPpHtAEth9ywLrXAAAAAElFTkSuQmCC';
			}
			else {
				document.getElementById('animPrev').firstElementChild.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAB/0lEQVRYhe3WT4hNYRjH8Y+ZIclC0iTNStPElPyJSDbkT2kUFjJSslEs2FmQ/DbCYrLAhiSkLCmlLCwtbZQdCwsrTXchSbpZnEvXvXfuPedQNvPbnfd9vu/zO885z/u+zGte/1kL6oJJRnE9ycma/CpcGqoJH8ZbHK3JH2vxB0cqgstwE8dbQ98r8itwG0daQ59LG0iyG/cx1jZcuoJJ9uMeVrbzAw0kWYLrONMj4UADSZZiBqd6zfc1kGQzHmHNoERz8NvxAONzhPSuQJIRXMClASZ7ViDJIlzG+QF8dxsmGVe89bZ+YJuGkzTb+MkWv6kE2/jtLgnFd5rB0pLJfyvJEM7iKhaX5Ra04FHFHzpVNTEWYpWiQ3ZVZBvDrfZ4oVzJeuk9nmFtDfbbEJZjSc3kMKpCyTv16xOsVrTLjhprLMQEHmNDRbYx1DLwATtxUcXtFc0k77AV1/CjCtyrDTcp2miy5BqdbTho82lXo2sjSfIGW3ALzS6kO77Z8fwaG3GnhIH+94EkexXtOTZHSDPJcB9+Cnf9eQC1q7sCHQu8xHo86RfXh3+OdXg6R0izzGk2m2Qa05jtXKAE/xmHcAKNzvkq5/kTxdu8rGKgxUryUFHNV+18pStZkk/Yh9P4UtZAG/8Re3AOX9H8m0vpOG4kOVCTn8CVuvnnNa9/pp/7FpJFAN0P7wAAAABJRU5ErkJggg==';
			}
    	}
	}

	function togglePlayPauseButton(action) {
		if (editorUi.editor.isChromelessView()) {
			if (action == 'play') {
				document.getElementById('animPlayPause').firstElementChild.title = 'Play animation';
				document.getElementById('animPlayPause').firstElementChild.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAA7EAAAOxAGVKw4bAAABbklEQVRYhcXXIWhVURjA8e885DHGkCELFmUMkyAMMYrJJiyaTEaDadkwEIPRYJLlJRkmg8HkimksrAwMMsvCCyo6x2/h7cAd+Lb7tnPu/YdbXvh+vHfuvd+LOAlPsY9PuB9dhsDI6TZwsyvAwP/7iReYrQ0YTgDkvuExqgFmzgHkPmO5TwAc4i0WSgJmpwDkDvAcV/oC5LbxsE9A7j2WLgqYKwCA33iFub4Aue94ou1tWwGQ+4J7fQLgCOu4fhbgakVAboRVDPsC5HZwN89OGRARo3Ynpkg/IuJGSunfoMOhzYYRMYh86bi9iHiUUvrbNeBXRKxFxJ2U0tapTzBf+eBtYHEirSLgKx6c+91UAOwbL7ntfuKCgD94bXxbt68QYBO3phrcAFzmSVhkIbkI4ADPFFrJpgEc4g2uXXpwA9D2dfwRt4sNngKwi5XigxuASf8LJr/DCwMGxgtl7gjvnLXFVEC8ND7ZHzQWhtodA2cv/dGKqugBAAAAAElFTkSuQmCC';
			}
			else {
				document.getElementById('animPlayPause').firstElementChild.title = 'Pause animation';
				document.getElementById('animPlayPause').firstElementChild.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAA7EAAAOxAGVKw4bAAABAklEQVRYhe2XPQ6CQBBGd41nMBaewdLKigN4ayorC2MsKCyIGv8uYHg2QIiAM7CLaMKXbEKyM29eJttgTBpgDoTAGbgVzgU4AhsgMEKABbCu4cTp3bKqMUROrBDYKji7rH5U6J1KcGPMFBgLNTMFZ1IlIIGzeqlOw8lrmgq897S5rxXQxofAqPTRQOZ3BQAlwk1ABW4j4GtII+ZfbsBrfG/ASaDLnu/ABoFB4FsCSVcCXsFtBHpJXxvIZ/l+A4lwX4rvDWgZlRto3OyQbgSstVpOZ2/ASeD5DwKJok7DyWuKAldF491aKw04KTjlWelv9R541JwDsJLIQABEHzhR8Tf/BWpDDa4MCaj+AAAAAElFTkSuQmCC';
			}
		}
	}

	function toggleNextButton(enabled) {
		if (editorUi.editor.isChromelessView()) {
			if (enabled) {
				document.getElementById('animNextStep').firstElementChild.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAA7EAAAOxAGVKw4bAAABdUlEQVRYhe3WvyuFURzH8aebJJkkSTJIMhhlkNkgGQ0GmQwG+QNk9QdIBoPJIIPBZJDJYDKaTJIkSbpJur0M1+W6z/3xnPMMlvvZ3895d77P+ZyTJO2089/BHgZz8AcYyCNwj2csRfJFPGExVuDRb47RF8i/V/GH6A0VePI3D5gP4D9q+DvMhgg8q5999GTgP+uwJeygO48A3GI6QqCSG0zlEfC9wDY6G/ClDPwWOmIFKrnGRB0+a64wVk/gJeAj79hAIUIA3rCKaIFKzjGMQgQLp+jPI+CbW45kKffPXCE1k+zpSpKkPyffF7sD15gQP4JLjMSMIHUkAxf+wKbqIxkgcIuZ2n0MWPwGk6lByNYDDWtZ6yIqYVejWm4h8ICFZn+S5lV8r9XF1ETgROWsxgkcyXI1S1/Hr1hR3VbN+drrOOxx4++D5ALDmeEk9SA5w1AInyjPuYh1VR0fwBeVO34t667VfuAI4+HkD3+K0Vi+nXb+PV9NIKo780jEUgAAAABJRU5ErkJggg==';
			}
			else {
				document.getElementById('animNextStep').firstElementChild.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAB30lEQVRYhe2UMWhUQRRFj8siIhYSFgnBykIsFBUxQpoUgmnESlIERBZFCxW1S6MeK1OlEbQwkESIoDaigpAiqKggKihapJAUEkRSRBGxEA0Wkx8+y+7fP5Mizd7ufzjv3vfmzUBHHa211Jtqzyr4cbU7la8AR4CP6lBijcFlfjA1QBXoAqbU+2otoUYNuKtOqV2xcCX3fZTQzeHIGpmGgA/qodQAAN3AI/WWuikyAMBW4Il6Xd0YC+d1ktBNX4kQzeqeBd6pvakBALYBz9Rr6vqEGjuAl+pltZoSAMKSDgOv1Z0JNarA1eUg25vBZUIA7AHeqBfUskxevYQjOaWu/Fynfgc2RxabAerAPPAvIcxj4IS6kBoA4AdwHphMYAEWgHrKKDNtALaskq+lBngP7AdGE/lXwF71dmyAv8AIcED9pC5F8n+AS0C/OgfhipTVHHBcfRFpmmkWOKa+zf+sAGW6GAN2tzBvxy8BN4B9jebQfgLfgNPqwzYGrY7yK1BXp1vBRTvwgNB1kXmR7gG7iswhTKBxhD8J93si/2IVqJFfBM6pd8rAjQGeEhbtSxm4SYBpwgs3XxbOlvA3oeuDkeZZgF/AGWAgxhzCBJ4DV9TZSONMM8BF9XMi31FHa6v/fYeilDxAAAoAAAAASUVORK5CYII=';
			}
    	}
	}
	
	// Autostart in chromeless mode
	if (editorUi.editor.isChromelessView())
	{
        // insert control panel
        var controlPanel = document.createElement('div');
        controlPanel.class = 'animationControlPanel';
        controlPanel.style.cssText = 'position: fixed; overflow: hidden; box-sizing: border-box; white-space: nowrap; background-color: rgb(0, 0, 0); padding: 10px 10px 8px; left: 20px; border-radius: 20px; transition: opacity 600ms ease-in-out 0s; bottom: 20px; opacity: 0.6;';

        // Prev. Step
        var ctrlPanButton = document.createElement('span');
        ctrlPanButton.id = 'animPrev';
        ctrlPanButton.title = 'Prev. Step';
        ctrlPanButton.style.cssText = 'padding-left: 0px;padding-right: 10px;cursor: pointer;';
        mxEvent.addListener(ctrlPanButton, "click", function(c) {
			if (waitId != null) {
				clearTimeout(waitId);
				waitId = null;
			}
			
			allowedToRun = false;
			running = false;
			togglePlayPauseButton('play');

        	if (stepsBack[0].substring(0, 4) == 'wait') {
        		stepsBack.shift();
        		step--;
        	}

        	var saveSteps = Array.from(steps);
        	var saveStep = step;
        	var saveStepsBack = Array.from(stepsBack);

            steps = Array.from(stepsBack);
        	step = 0;
        	
        	next();

        	steps = Array.from(saveSteps);
        	stepsBack = Array.from(saveStepsBack);

        	for (var i = 0; i < step - 1; i++) {
                stepsBack.shift();
        		saveStep--;
        	}

        	step = saveStep;

			if (step >= steps.length) {
				toggleNextButton(false);
			}
			else {
				toggleNextButton(true);
			}

        	if (step <= 0) {
        		togglePrevButton(false);
        	}
        	else {
        		togglePrevButton(true);
        	}
        });

        var ctrlPanImg = document.createElement('img');
        ctrlPanImg.border = 0;
        ctrlPanImg.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAA7EAAAOxAGVKw4bAAABmElEQVRYhe3Wr0tdcRjH8S+Xi4gsDJEbDAtDDItiMotBlpbGwuJYGmaDTfYHLIjJYBAxGEwGk2FpmGRhcUFkyAljiIi8DOde/XrvPT++51oG99Pfn+dzDs/3eZ4QxhrrfxU62BmBn8VWU/gdLnHdkP+AK1ykgi+x61E3ifwM9iP+Twq8jN+e6jaBX8VFH39VB5zCN9wZ1F0N/gW2h7DVAbCInwVwZQAs4VcJnxWBbWzgtgQGBfwENmvwgwEwh+9VhSO1+vg3+FGTzWIw4BP+JhR/CIAW1nCdwGa94h0cJRbuqY1XOGnAZkXPI0UfkTVks1YIYTqEMFXWzRXqhBAmR+BDwGucNvyKtrzxzpr8gThEG+u4STTpNeEEvqrxdIcGiIIs4Dw1QMRXDZ/yAF2TsvH7RAV82fitDhAZrRhcQLGqRvFb5S+sPEDXZBp7TQJ0+RkcFvDV2zAyei8/ImLVWsfyKTtsXtQP0DWaxXFkkHqQ9E/M+gdJZBLwWb4zkk8y+c74gn+4TA4QGc3haAR+HgeNA4w11nPpHtAEth9ywLrXAAAAAElFTkSuQmCC';

        ctrlPanButton.appendChild(ctrlPanImg);
        controlPanel.appendChild(ctrlPanButton);

        // Play / Pause
        ctrlPanButton = document.createElement('span');
        ctrlPanButton.id = 'animPlayPause';
        ctrlPanButton.title = 'Pause animation';
        ctrlPanButton.style.cssText = 'padding-left: 0px;padding-right: 10px;cursor: pointer;';
        mxEvent.addListener(ctrlPanButton, "click", function(c) {
			if (waitId != null) {
				clearTimeout(waitId);
				waitId = null;
			}
			
        	if (running) {
        		allowedToRun = false;
        		running = false;
        		togglePlayPauseButton('play');
        	}
        	else {
        		allowedToRun = true;
        		running = true;
        		togglePlayPauseButton('pause');
        		next();
        	}
        });

        ctrlPanImg = document.createElement('img');
        ctrlPanImg.border = 0;
        ctrlPanImg.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAA7EAAAOxAGVKw4bAAABAklEQVRYhe2XPQ6CQBBGd41nMBaewdLKigN4ayorC2MsKCyIGv8uYHg2QIiAM7CLaMKXbEKyM29eJttgTBpgDoTAGbgVzgU4AhsgMEKABbCu4cTp3bKqMUROrBDYKji7rH5U6J1KcGPMFBgLNTMFZ1IlIIGzeqlOw8lrmgq897S5rxXQxofAqPTRQOZ3BQAlwk1ABW4j4GtII+ZfbsBrfG/ASaDLnu/ABoFB4FsCSVcCXsFtBHpJXxvIZ/l+A4lwX4rvDWgZlRto3OyQbgSstVpOZ2/ASeD5DwKJok7DyWuKAldF491aKw04KTjlWelv9R541JwDsJLIQABEHzhR8Tf/BWpDDa4MCaj+AAAAAElFTkSuQmCC';

        ctrlPanButton.appendChild(ctrlPanImg);
        controlPanel.appendChild(ctrlPanButton);

        // Next Step
        ctrlPanButton = document.createElement('span');
        ctrlPanButton.id = 'animNextStep';
        ctrlPanButton.title = 'Next Step';
        ctrlPanButton.style.cssText = 'padding-left: 0px;padding-right: 10px;cursor: pointer;';
        mxEvent.addListener(ctrlPanButton, "click", function(c) {
			if (waitId != null) {
				clearTimeout(waitId);
				waitId = null;
			}
			
        	allowedToRun = false;
        	running = false;
        	togglePlayPauseButton('play');
        	next();
        });

        ctrlPanImg = document.createElement('img');
        ctrlPanImg.border = 0;
        ctrlPanImg.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAA7EAAAOxAGVKw4bAAABdUlEQVRYhe3WvyuFURzH8aebJJkkSTJIMhhlkNkgGQ0GmQwG+QNk9QdIBoPJIIPBZJDJYDKaTJIkSbpJur0M1+W6z/3xnPMMlvvZ3895d77P+ZyTJO2089/BHgZz8AcYyCNwj2csRfJFPGExVuDRb47RF8i/V/GH6A0VePI3D5gP4D9q+DvMhgg8q5999GTgP+uwJeygO48A3GI6QqCSG0zlEfC9wDY6G/ClDPwWOmIFKrnGRB0+a64wVk/gJeAj79hAIUIA3rCKaIFKzjGMQgQLp+jPI+CbW45kKffPXCE1k+zpSpKkPyffF7sD15gQP4JLjMSMIHUkAxf+wKbqIxkgcIuZ2n0MWPwGk6lByNYDDWtZ6yIqYVejWm4h8ICFZn+S5lV8r9XF1ETgROWsxgkcyXI1S1/Hr1hR3VbN+drrOOxx4++D5ALDmeEk9SA5w1AInyjPuYh1VR0fwBeVO34t667VfuAI4+HkD3+K0Vi+nXb+PV9NIKo780jEUgAAAABJRU5ErkJggg==';

        ctrlPanButton.appendChild(ctrlPanImg);
        controlPanel.appendChild(ctrlPanButton);

        // Restart Animation
        ctrlPanButton = document.createElement('span');
        ctrlPanButton.id = 'animRestart';
        ctrlPanButton.title = 'Restart animation';
        ctrlPanButton.style.cssText = 'padding-left: 0px;padding-right: 10px;cursor: pointer;';
        mxEvent.addListener(ctrlPanButton, "click", function(c) {
			if (waitId != null) {
				clearTimeout(waitId);
				waitId = null;
			}
			
            allowedToRun = false;
        	running = false;
        	window.setTimeout(startAnimation(), 10);
        });

        ctrlPanImg = document.createElement('img');
        ctrlPanImg.border = 0;
        ctrlPanImg.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAA7EAAAOxAGVKw4bAAACp0lEQVRYhb2XzUtUURjGnzOIiESLGEQGkRhCokWLEBEXUhYRIdHHqk1/Q8uIEPoDRCIkJNy2ifaChbm0XNguog/UiuiDUUYbicZfi3sunjlz7vWad+bZzb3v+z7Pue+Z9zzHKCOATkkXJJ2XdEZSWdIRSX8lbUlak7Qi6YWk58aYnay19yMuAZPAL7KjAkwBpcMQdwB3geoBiH1sAxP26wVhEsj7JD2VNJyQtyPpo6Sf9ndRUUu6EuJfSbpmjPnqcByXtBEiLwOrCauZAc4CTURAFzAGPLaxPj4BZRs7CmwC036Rkg10UbdFexJWF1pELzBrc12sArfYa+uCm9QBLHkJVeB6VuKAkKuk76EPbvC9APnI/5I7dYft5w7hRxxUorFvdeDKYckdEXcSBFTigEnvxWyO5KMpbajEu9cdMttAb07kQynkAJWCpDFJx5y8J8aYb3kIkDQiKXEISdowwJSk287Dc8aYlzkJiM+QPkk9ko5qb1jtSHorYNH5JDVSxmYrUFA0QmO8N8b8abeAbuf393aSxwJ220kInLJtXwROi8aD500bBCw4fPMFSZ+d9wOt3IS29pDzqKsgadl9oGQPkAeG1bjnVgqS5r2gmy0U4Neej0dxxelLFSjmzQwUvbFcITY2wANvRs+0QMC0x/HQfdlH83E8niP5JRrdUQ3o94Puewo3gcEcyAdpNiQTocBO4HVAxOVDkI8HyJdI+qvbVqx7CXUiN3wQU1q0Ob4pXSey/KnJA4RteRV4RORwmlZAZGpHiDZbyIR8AU76eWkXk2dqnFoufkt6p+hisqvorD+h6K4YwrKkG8aYtdTVeyI6iTZmLbCarKixz9Usi5B++1mTrHUIVZvTv1/9YAsShHRLuqjG63lsr9zr+YKkOWPMVpa6/wBaV6hN8fnlZgAAAABJRU5ErkJggg==';

        ctrlPanButton.appendChild(ctrlPanImg);
        controlPanel.appendChild(ctrlPanButton);

        document.querySelector("body > div.geDiagramContainer").appendChild(controlPanel);

		function startAnimation()
		{
			if (animation != null)
			{
				steps = animation.steps.split('\n');
				stepsBack = [];
				graph = editorUi.editor.graph; 
				loop = true;
				run();
				result = true;
			}
		};
		
		// Wait for file to be loaded
		editorUi.editor.addListener('fileLoaded', function() {
			
			// Load animations from document
			var root = editorUi.editor.graph.getModel().getRoot();

			if (root.value != null && typeof(root.value) == 'object')
			{
				var desc = root.value.getAttribute('animation');
				if (desc.substring(0,1) == '[') {
					animations = JSON.parse(desc);
				}
				else if (desc != '') {
					animation = new Object();
					animation.name = 'Default';
					animation.steps = desc;
					animations.push(animation);
				}
			}

            if (animations.length > 0) {
				animation = animations[0];
				if (animations.length > 1) {
                    // TODO : if multiple animations, build a selector. If animation name specified in url, preselect animation

                    if ('animation' in urlParams) {
                    	animations.forEach(a => {
                    		if (a.name == decodeURIComponent(urlParams.animation)) {
                    			animation = a;
                    		}
                    	});
                    }

                    var divContAnimSelector = document.createElement('div');
                    divContAnimSelector.style.cssText = 'overflow: hidden; width: 150px; display: inline-block; margin-right: 20px;';
                    controlPanel.insertBefore(divContAnimSelector, controlPanel.firstChild);
                    
                    var spanSelectedAnim = document.createElement('span');
                    spanSelectedAnim.style.cssText = 'padding-left: 0px;padding-right: 10px;cursor: pointer;color: white;font-size: 14px;top: 17px;position: absolute;width: 150px;overflow: hidden;border-right: 1px solid white;text-overflow: ellipsis;';
                    spanSelectedAnim.innerText = animation.name;
                    spanSelectedAnim.title = 'Select animation';
                    divContAnimSelector.appendChild(spanSelectedAnim);

					var divAnimations = document.createElement('div');
					divAnimations.style.cssText = 'position: fixed; overflow: hidden; box-sizing: border-box; white-space: nowrap; background-color: rgb(0, 0, 0); padding: 10px 10px 8px; left: 35px; border-radius: 20px; transition: opacity 600ms ease-in-out 0s; bottom: 75px; opacity: 0.6;'	
					divAnimations.style.display = 'none';
					document.querySelector("body > div.geDiagramContainer").appendChild(divAnimations);
					animations.forEach(a => {
						var divAnimation = document.createElement('div');
						divAnimation.style.width = '150px';
						divAnimation.style.position = 'relative';
						divAnimation.style.height = '24px';
						divAnimations.appendChild(divAnimation);

						var imgCheckedAnim = document.createElement('img');
						imgCheckedAnim.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAA7EAAAOxAGVKw4bAAABEUlEQVQ4jaXSL0vkQRgH8M/KYjLKJdPhhQFBOcFouFdguCADVywLBotFmHBcGIyiYDEqznHxwBdw2WA6nGKQDaaNInIcYvkJy7qr7vqk4fvneb7Pw/COKjXPtd5h/oyHSc0fSs170J7API2f6MDUmGY4xN8Y0tUkCTbxFZ+egDcnKDV/wT52Y0i9sRqUmj/iF25w0M+9ukKpeQa/MYtvMaT7fv7FBKXmKZxgARcog5p2qXkJt+jGkP4N8D+w1ry3Y0jPPk4bvWbKaqn5Bl1c4w4bje4shvRnWMpWX9SdZuLgXf5jMYZ0ObLBU5WaV3CK+T74KIbUGWZm4IgxpHMs47iBbvF9lPnFKjWvl5q3XtM9AuGNTayRGjKyAAAAAElFTkSuQmCC';
						divAnimation.appendChild(imgCheckedAnim);

						if (a == animation) {
						    imgCheckedAnim.style.visibility = 'visible';
						}
						else {
							imgCheckedAnim.style.visibility = 'hidden';
						}

						var spanAnimation = document.createElement('span');
						spanAnimation.style.cssText = 'padding-left: 10px; padding-right: 10px; cursor: pointer; color: white; font-size: 14px; top: 17px; width: 150px; overflow: hidden; text-overflow: ellipsis;';
						spanAnimation.innerText = a.name;
						divAnimation.attachedAnimation = a;
						divAnimation.appendChild(spanAnimation);

						mxEvent.addListener(divAnimation, "click", function() {
							if (waitId != null) {
								clearTimeout(waitId);
								waitId = null;
							}

							allowedToRun = false;
							running = false;
							animation = this.attachedAnimation;
							window.setTimeout(startAnimation(), 10);

							spanSelectedAnim.innerText = animation.name;
							divAnimations.style.display = 'none';

							divAnimations.childNodes.forEach(n => {
							    n.childNodes[0].style.visibility = 'hidden';
							});

							this.childNodes[0].style.visibility = 'visible';
						});
					});
					
					mxEvent.addListener(divContAnimSelector, "click", function() {
					  if (divAnimations.style.display == 'block') {
					  	divAnimations.style.display = 'none';
					  }
					  else {
					  	divAnimations.style.display = 'block';
					  }
					});
				}

				window.setTimeout(startAnimation(), 100);
            }
            else {
            	controlPanel.style.display = 'none';
            }
		});
	}

	// Add flow capability
	function toggleFlowAnim(graph, cells, status)
	{
	    if (!status)
	    {
	      status = 'toggle'
	    }
	    
		for (var i = 0; i < cells.length; i++)
		{
			if (editorUi.editor.graph.model.isEdge(cells[i]))
			{
				var state = graph.view.getState(cells[i]);
				
				if (state && state.shape != null)
				{
					var paths = state.shape.node.getElementsByTagName('path');
					
					if (paths.length > 1)
					{
						if ((status == 'toggle' && paths[1].getAttribute('class') == 'mxEdgeFlow') || status == 'stop')
						{
							paths[1].removeAttribute('class');

							if (mxUtils.getValue(state.style, mxConstants.STYLE_DASHED, '0') != '1')
							{
								paths[1].removeAttribute('stroke-dasharray');
							}
						}
						else if ((status == 'toggle' && paths[1].getAttribute('class') != 'mxEdgeFlow') || status == 'start')
						{
							paths[1].setAttribute('class', 'mxEdgeFlow');
			
							if (mxUtils.getValue(state.style, mxConstants.STYLE_DASHED, '0') != '1')
							{
								paths[1].setAttribute('stroke-dasharray', '8');
							}
						}
					}
				}
			}
		}
	};

  function showCell(graph, cell)
  {
    graph.setCellStyles('opacity', '100', cell);
    graph.setCellStyles('noLabel', null, [cell]);
		nodes = getNodesForCells(graph, [cell]);
		if (nodes != null)
    {
			for (var i = 0; i < nodes.length; i++)
      {
        mxUtils.setPrefixedStyle(nodes[i].style, 'transition', null);
        nodes[i].style.opacity = '0';
      }
    }
  }

	try
	{
		var style = document.createElement('style')
		style.type = 'text/css';
		style.innerHTML = ['.mxEdgeFlow {',
			  'animation: mxEdgeFlow 0.5s linear;',
			  'animation-iteration-count: infinite;',
			'}',
			'@keyframes mxEdgeFlow {',
			  'to {',
			    'stroke-dashoffset: -16;',
			  '}',
			'}'].join('\n');
		document.getElementsByTagName('head')[0].appendChild(style);
	}
	catch (e)
	{
		// ignore
	}
});