/**
 * Text extraction plugin.
 */
Draw.loadPlugin(function(ui)
{
	// Adds resource for action
	mxResources.parse('randomLabel=Random Label...');

	// Adds action
	ui.actions.addAction('randomLabel', function()
	{
		var graph = ui.editor.graph;
		var cells = graph.getSelectionCells().slice();
		
		if (cells.length > 0)
		{
			var counter = 0;
			var max = 50; //parseInt(prompt('Cycles', '50'));
			
			function schedule()
			{
				var jitter = 1 + 0.3 * (Math.random() - 0.5);
				
				window.setTimeout(function()
				{
					for (var i = 0; i < cells.length; i++)
					{
						graph.labelChanged(cells[i], 'Test ' + Math.round(Math.random() * 100));
					}
					
					if (counter++ < max && ui.dialog == null)
					{
						schedule();
					}
				}, 3500 * jitter);
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
		var graph = ui.editor.graph;
		var cells = graph.getSelectionCells().slice();
		
		if (cells.length > 1)
		{

			var counter = 0;
//			var max = 1;
			var max = parseInt(prompt('Cycles', '100'));
			
			
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
					
					if (counter++ < max && ui.dialog == null)
					{
						schedule();
					}
				}, 15000 * jitter);
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
		var graph = ui.editor.graph;
		var cells = graph.getSelectionCells().slice();
		
		if (cells.length > 0)
		{

			var counter = 0;
//			var max = 1;
			var max = parseInt(prompt('Cycles', '100'));
			
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
					
					if (counter++ < max && ui.dialog == null)
					{
						schedule();
					}
				}, 5000 * jitter);
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
