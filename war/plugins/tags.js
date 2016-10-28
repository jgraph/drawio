/**
 * Explore plugin.
 */
Draw.loadPlugin(function(ui)
{
	var graph = ui.editor.graph;
	var propertyName = 'tags';

	var div = document.createElement('div');
	div.style.userSelect = 'none';
	div.style.overflow = 'hidden';
	div.style.padding = '10px';
	div.style.height = '100%';
	
	var searchInput = document.createElement('input');
	searchInput.setAttribute('placeholder', 'All Tags');
	searchInput.setAttribute('type', 'text');
	searchInput.style.marginTop = '4px';
	searchInput.style.width = '170px';
	searchInput.style.fontSize = '12px';
	searchInput.style.borderRadius = '4px';
	searchInput.style.padding = '6px';
	div.appendChild(searchInput);
	
	mxEvent.addListener(searchInput, 'dblclick', function()
	{
		var dlg = new FilenameDialog(ui, propertyName, mxResources.get('ok'), mxUtils.bind(this, function(name)
		{
			if (name != null && name.length > 0)
			{
				propertyName = name;
			}
		}), mxResources.get('enterPropertyName'));
		ui.showDialog(dlg.container, 300, 80, true, true);
		dlg.init();
	});
	
	searchInput.setAttribute('title', 'Doubleclick to set property name');

	function searchCells(cells)
	{
		cells = (cells != null) ? cells : graph.model.getDescendants(graph.model.getRoot());
		var tagList = searchInput.value.split(' ');
		var result = [];
		
		for (var i = 0; i < cells.length; i++)
		{
			if (graph.model.isVertex(cells[i]) || graph.model.isEdge(cells[i]))
			{
				var tags = (cells[i].value != null && typeof(cells[i].value) == 'object') ?
					mxUtils.trim(cells[i].value.getAttribute(propertyName) || '') : '';
				var match = true;

				if (tags.length > 0)
				{
					var tmp = tags.toLowerCase().split(' ');
					
					for (var j = 0; j < tagList.length && match; j++)
					{
						var tag = mxUtils.trim(tagList[j]).toLowerCase();
						
						match = match && (tag.length == 0 || mxUtils.indexOf(tmp, tag) >= 0);
					}
				}
				else
				{
					match = mxUtils.trim(searchInput.value).length == 0;
				}
				
				if (match)
				{
					result.push(cells[i]);
				}
			}
		}
		
		return result;
	};

	function setCellsVisible(cells, visible)
	{	
		graph.model.beginUpdate();
		try
		{
			for (var i = 0; i < cells.length; i++)
			{
				graph.model.setVisible(cells[i], visible);
			}
		}
		finally
		{
			graph.model.endUpdate();
		}
	};
	
	mxUtils.br(div);

	var hideBtn = mxUtils.button(mxResources.get('hide'), function()
	{
		setCellsVisible(searchCells(), false);
	});
	
	hideBtn.setAttribute('title', mxResources.get('hide'));
	hideBtn.style.marginTop = '8px';
	hideBtn.style.marginRight = '4px';
	hideBtn.style.backgroundColor = '#f5f5f5';
	hideBtn.style.backgroundImage = 'none';
	hideBtn.className = 'geBtn';
	
	div.appendChild(hideBtn);

	var btn = mxUtils.button(mxResources.get('show'), function()
	{
		var cells = searchCells();
		setCellsVisible(cells, true);
		graph.setSelectionCells(cells);
	});
	
	btn.setAttribute('title', mxResources.get('show') + ' (Enter)');
	btn.style.marginTop = '8px';
	btn.style.backgroundColor = '#4d90fe';
	btn.style.backgroundImage = 'none';
	btn.className = 'geBtn gePrimaryBtn';
	
	div.appendChild(btn);
	
	mxEvent.addListener(searchInput, 'keyup', function(evt)
	{
		// Ctrl or Cmd keys
		if (evt.keyCode == 91 || evt.keyCode == 17)
		{
			// Workaround for lost focus on show
			mxEvent.consume(evt);
		}
		else if (evt.keyCode == 13)
		{
			btn.click();
		}
	});
	
	// Extends Extras menu
	mxResources.parse('tags=Tags');

	var wnd = new mxWindow(mxResources.get('tags'), div, document.body.offsetWidth - 300, 230, 204, 116, true, true);
	wnd.destroyOnClose = false;
	wnd.setMaximizable(false);
	wnd.setResizable(false);
	wnd.setClosable(true);

    // Adds action
    ui.actions.addAction('tags...', function()
    {
		wnd.setVisible(!wnd.isVisible());
		
		if (wnd.isVisible())
		{
			searchInput.focus();
			
			if (mxClient.IS_FF || document.documentMode >= 5 || mxClient.IS_QUIRKS)
			{
				searchInput.select();
			}
			else
			{
				document.execCommand('selectAll', false, null);
			}
		}
		else
		{
			graph.container.focus();
		}
    });
	
    
	var action = ui.actions.get('tags');
	
    action.setToggleAction(true);
	action.setSelectedCallback(function() { return wnd.isVisible(); });
    
	var menu = ui.menus.get('extras');
	var oldFunct = menu.funct;
	
	menu.funct = function(menu, parent)
	{
		oldFunct.apply(this, arguments);
		
		ui.menus.addMenuItems(menu, ['-', 'tags'], parent);
	};
});
