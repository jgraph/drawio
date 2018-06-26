/**
 * WebCola layout plugin.
 */
Draw.loadPlugin(function(ui)
{
	mxscript("js/diagramly/plugins/webcola/cola.min.js");
	mxscript("js/diagramly/plugins/webcola/mxWebColaAdaptor.js");
	mxscript("js/diagramly/plugins/webcola/mxWebColaLayout.js");
	
	// Adds resource for action
	mxResources.parse('webColaLayout=WebCola Layout...');

	// Adds action
	ui.actions.addAction('Apply WebCola layout', function()
	{
		var graph = ui.editor.graph;
		var layout = mxWebColaLayout(graph);
		var parent = graph.getDefaultParent(); 
		layout.execute(parent);
	});
	
	var menu = ui.menus.get('extras');
	var oldFunct = menu.funct;
	
	menu.funct = function(menu, parent)
	{
		oldFunct.apply(this, arguments);
		
		ui.menus.addMenuItems(menu, ['-', 'webColaLayout'], parent);
	};
});
