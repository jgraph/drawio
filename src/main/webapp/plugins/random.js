/**
 * Text extraction plugin.
 */
Draw.loadPlugin(function(ui)
{
	var defaultDelay = 2000;
	var defaultMax = 50;
	var graph = ui.editor.graph;

	// Adds resource for action
	mxResources.parse('randomLabel=Random Label...');
	
	// Adds action
	ui.actions.addAction('randomLabel', function()
	{
		var cells = graph.getSelectionCells().slice();
		
		if (cells.length > 0)
		{
			var delay = parseInt(prompt('Delay (ms)', defaultDelay));
			var max = parseInt(prompt('Cycles', defaultMax));
			var counter = 0;

			function schedule()
			{
				var jitter = 1 + 0.3 * (Math.random() - 0.5);
				
				window.setTimeout(function()
				{
					for (var i = 0; i < cells.length; i++)
					{
						graph.labelChanged(cells[i], 'Test ' + Math.round(Math.random() * 100));
					}
					
					if (ui.dialog != null)
					{
						console.log('randomLabel halted');
					}
					else
					{
						ui.saveFile(null, function()
						{
							if (counter++ < max && ui.dialog == null)
							{
								console.log('randomLabel', counter);
								schedule();
							}
							else
							{
								console.log('randomLabel halted');
							}
						});
					}
				}, delay * jitter);
			}
			
			schedule();
		}
		else
		{
			ui.alert(mxResources.get('nothingIsSelected'));
		}
	});
	
	// Adds resource for action
	mxResources.parse('swapChildren=Swap children...');

	// Adds action
	ui.actions.addAction('swapChildren', function()
	{
		var cells = graph.getSelectionCells().slice();
		
		if (cells.length > 1)
		{
			var delay = parseInt(prompt('Delay (ms)', defaultDelay));
			var max = parseInt(prompt('Cycles', defaultMax));
			var counter = 0;
			
			function schedule()
			{
				var jitter = 1 + 0.3 * (Math.random() - 0.5);
				
				window.setTimeout(function()
				{
					// assuming parent is the first cell selected
					var parentA = cells[0];
					var parentB = cells[1];
					
					var childrenA = parentA.children;
					var childrenB = parentB.children;
					
					var numberA = childrenA.length;
					var numberB = childrenB.length;
					
					if (childrenA != null && childrenA.length > 1 || childrenB != null && childrenB.length > 1)
					{
						graph.getModel().beginUpdate();
						try
						{
							// permute children
							var passes = Math.floor(Math.random() * numberA) + 1;
							console.log(counter + " - swapping " + passes + " children from parent A to parent B");
							
							for (var i = 0; i < passes; i++)
							{
								// which child to select from parent A
								var k = Math.floor(Math.random() * numberA);
								// where to insert it to parent B
								var l = Math.floor(Math.random() * (numberB + 1));
								graph.model.add(parentB, childrenA[k], l);
								
								numberA -= 1;
								numberB += 1;
							}

							var passes = Math.floor(Math.random() * numberB) + 1;
							console.log(counter + " - swapping " + passes + " children from parent B to parent A");
							
							for (var i = 0; i < passes; i++)
							{
								// which child to select from parent A
								var k = Math.floor(Math.random() * numberB);
								// where to insert it to parent B
								var l = Math.floor(Math.random() * (numberA + 1));
								graph.model.add(parentA, childrenB[k], l);
								numberA += 1;
								numberB -= 1;
							}
						}
						finally
						{
							graph.getModel().endUpdate();
						}
					}
					
					if (ui.dialog != null)
					{
						console.log('swapChildren halted');
					}
					else
					{
						ui.saveFile(null, function()
						{
							if (counter++ < max && ui.dialog == null)
							{
								console.log('swapChildren', counter);
								schedule();
							}
							else
							{
								console.log('swapChildren halted');
							}
						});
					}
				}, delay * jitter);
			}
			
			schedule();
		}
		else
		{
			ui.alert(mxResources.get('nothingIsSelected'));
		}
	});
	
	// Adds resource for action
	mxResources.parse('reorderChildren=Reorder children...');

	// Adds action
	ui.actions.addAction('reorderChildren', function()
	{
		var cells = graph.getSelectionCells().slice();
		
		if (cells.length > 0)
		{
			var delay = parseInt(prompt('Delay (ms)', defaultDelay));
			var max = parseInt(prompt('Cycles', defaultMax));
			var counter = 0;
			
			function schedule()
			{
				var jitter = 1 + 0.3 * (Math.random() - 0.5);
				
				window.setTimeout(function()
				{
					// assuming parent is the first cell selected
					var parent = cells[0];
					
					var children = parent.children;
					if (children != null && children.length > 1)
					{
						graph.getModel().beginUpdate();
						try
						{
							// permute children
							var number = children.length;

							var passes = Math.floor(Math.random() * number) + 1;
							console.log(counter + " - reordering in " + passes + " passes");
							
							for (var i = 0; i < passes; i++)
							{
								var k = Math.floor(Math.random() * number);
								graph.orderCells(true, [children[k]]);
							}
						}
						finally
						{
							graph.getModel().endUpdate();
						}
					}
					
					if (ui.dialog != null)
					{
						console.log('reorderChildren halted');
					}
					else
					{
						ui.saveFile(null, function()
						{
							if (counter++ < max && ui.dialog == null)
							{
								console.log('reorderChildren', counter);
								schedule();
							}
							else
							{
								console.log('reorderChildren halted');
							}
						});
					}
				}, delay * jitter);
			}
			
			schedule();
		}
		else
		{
			ui.alert(mxResources.get('nothingIsSelected'));
		}
	});
	
	var menu = ui.menus.get('extras');
	var oldFunct = menu.funct;
	
	menu.funct = function(menu, parent)
	{
		oldFunct.apply(this, arguments);
		
		ui.menus.addMenuItems(menu, ['-', 'randomLabel', 'reorderChildren', 'swapChildren'], parent);
	};
});
