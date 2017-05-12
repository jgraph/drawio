/**
 * Plugin for Freemind import.
 * See https://github.com/jiangxin/freemind-mmx/tree/master/freemind
 */
Draw.loadPlugin(function(ui) {
	var graph = ui.editor.graph;
	
	// Adds resource for action
	mxResources.parse('importFreemind=Freemind');
	
	// Parses Freemind data
	function importFreemindData(data)
	{
		// Gets the default parent for inserting new cells. This
		// is normally the first child of the root (ie. layer 0).
		var parent = graph.getDefaultParent();
		var cells = [];
		
		// Makes the import one undoable edit
		graph.getModel().beginUpdate();
		try
		{
			// Gets point for free space in the graph for insert
			var pt = graph.getFreeInsertPoint();

			//
			// TODO: Import freemind data at pt.x/pt.y like so...
			//
			cells.push(graph.insertVertex(parent, null, data, pt.x, pt.y, 80, 30));
			
			// Applies current styles to new cells (might not be needed)
			graph.fireEvent(new mxEventObject('cellsInserted', 'cells', cells));
		}
		finally
		{
			graph.getModel().endUpdate();
		}
		
		// Selects new cells and scrolls into view
		graph.setSelectionCells(cells);
       	graph.scrollCellToVisible(graph.getSelectionCell());
	};

  	// Adds action
	ui.actions.addAction('importFreemind...', function()
	{
		// Only modern browsers for now. We'll move the import
		// code above to the main codebase later
		if (Graph.fileSupport && !mxClient.IS_IE && !mxClient.IS_IE11)
		{
			var input = document.createElement('input');
			input.setAttribute('type', 'file');
			
			mxEvent.addListener(input, 'change', function()
			{
				if (input.files != null)
				{
					// Only one file for now...
					var reader = new FileReader();
					
					reader.onload = function(e)
					{
						importFreemindData(e.target.result);
					};
					
					reader.readAsText(input.files[0]);
				}
			});

			input.click();
		}
	});
	
	// Adds menu
	ui.menubar.addMenu('Import', function(menu, parent)
	{
		ui.menus.addMenuItem(menu, 'importFreemind');
	});
	
	// Moves import menu to before help menu
	ui.menubar.container.insertBefore(ui.menubar.container.lastChild,
		ui.menubar.container.lastChild.previousSibling.previousSibling.previousSibling);
});