/**
 * Explore plugin.
 */
Draw.loadPlugin(function(ui)
{
	// Adds resource for action
	mxResources.parse('exploreFromHere=Explore from here...');
	
	var uiCreatePopupMenu = ui.menus.createPopupMenu;
	ui.menus.createPopupMenu = function(menu, cell, evt)
	{
		uiCreatePopupMenu.apply(this, arguments);
		
		var graph = ui.editor.graph;
		
		if (graph.getEdges(graph.getSelectionCell()).length > 0)
		{
			this.addMenuItems(menu, ['-', 'exploreFromHere'], null, evt);
		}
	};

	// Adds action
	ui.actions.addAction('exploreFromHere', function()
	{
		Graph.exploreFromCell(ui.editor.graph, ui.editor.graph.getSelectionCell());
	});
	
	// Click handler for chromeless mode
	if (ui.editor.isChromelessView())
	{
		ui.editor.graph.click = function(me)
		{
			if (ui.editor.graph.model.isVertex(me.getCell()) &&
				ui.editor.graph.model.getEdgeCount(me.getCell()) > 0 &&
				this.getLinkForCell(me.getCell()) == null)
			{
				Graph.exploreFromCell(ui.editor.graph, me.getCell());
			}
		};
	}
});
