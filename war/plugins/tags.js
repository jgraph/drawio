/**
 * Explore plugin.
 */
Draw.loadPlugin(function(ui)
{
	var div = document.createElement('div');
	div.style.userSelect = 'none';
	div.style.overflow = 'hidden';
	div.style.padding = '10px';
	div.style.height = '100%';

	var graph = ui.editor.graph;

	var verbSelect = document.createElement('select');
	verbSelect.style.width = '170px';
	
	var showOption = document.createElement('option');
	mxUtils.write(showOption, 'Show all but...');
	showOption.setAttribute('value', 'show');
	showOption.setAttribute('selected', 'selected');
	verbSelect.appendChild(showOption);
	
	var hideOption = document.createElement('option');
	mxUtils.write(hideOption, 'Hide all but...');
	hideOption.setAttribute('value', 'hide');
	verbSelect.appendChild(hideOption);
	
	div.appendChild(verbSelect);

	var tagInput = document.createElement('input');
	tagInput.setAttribute('type', 'text');
	tagInput.style.marginTop = '4px';
	tagInput.style.width = '170px';
	mxUtils.br(div);
	div.appendChild(tagInput);

	function isCellVisible(cell, tagList)
	{
		if (cell.value != null && typeof(cell.value) == 'object')
		{
			var tags = cell.value.getAttribute('tags');
			
			if (tags != null && tags.length > 0)
			{
				var tmp = tags.split(' ');
				
				for (var i = 0; i < tagList.length; i++)
				{
					if (mxUtils.indexOf(tmp, tagList[i]) >= 0)
					{
						return verbSelect.value != 'show';
					}
				}
			}
		}
		
		return verbSelect.value == 'show'
	};

	function updateVisibleStates()
	{	
		var tagList = tagInput.value.split(' ');
		
		graph.model.beginUpdate();
		try
		{
			for (var key in graph.model.cells)
			{
				var cell = graph.model.cells[key];
				
				if (graph.model.isVertex(cell) || graph.model.isEdge(cell))
				{
					graph.model.setVisible(cell, isCellVisible(cell, tagList));
				}
			}
		}
		finally
		{
			graph.model.endUpdate();
		}
	};

	mxUtils.br(div);

	var resetBtn = mxUtils.button(mxResources.get('reset'), function()
	{
		tagInput.value = '';
		verbSelect.value = 'show';
		updateVisibleStates();
	});
	
	resetBtn.style.marginTop = '4px';
	resetBtn.style.padding = '4px';
	div.appendChild(resetBtn);

	var btn = mxUtils.button(mxResources.get('apply'), function()
	{
		updateVisibleStates();
	});
	
	btn.style.marginTop = '4px';
	btn.style.padding = '4px';
	div.appendChild(btn);
	
	
	var wnd = new mxWindow('Tags', div, document.body.offsetWidth - 300, 140, 200, 120, true, true);
	wnd.destroyOnClose = false;
	wnd.setMaximizable(false);
	wnd.setResizable(false);
	wnd.setClosable(true);
	
	// Extends Extras menu
	mxResources.parse('tags=Tags');

    // Adds action
    ui.actions.addAction('tags', function()
    {
		wnd.setVisible(!wnd.isVisible());	
    });
	
	var extrasMenu = ui.menus.get('extras');
	var oldExtrasMenu = extrasMenu.funct;
	
	extrasMenu.funct = function(menu, parent)
	{
		oldExtrasMenu.apply(this, arguments);
		
		menu.addSeparator(parent);
		ui.menus.addMenuItems(menu, ['tags'], parent);
	};
});
