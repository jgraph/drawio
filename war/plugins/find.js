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
	var lastFound = null;

	mxUtils.write(div, 'Find:');
	mxUtils.br(div);
	
	var searchInput = document.createElement('input');
	searchInput.setAttribute('type', 'text');
	searchInput.style.marginTop = '4px';
	searchInput.style.width = '170px';
	div.appendChild(searchInput);

	var tmp = document.createElement('div');
	
	function search(next)
	{
		var cells = graph.model.getDescendants(graph.model.getRoot());
		var search = searchInput.value.toLowerCase();
		var active = !next || lastFound == null;
		var firstMatch = null;
		
		if (search.length > 0)
		{
			for (var i = 0; i < cells.length; i++)
			{
				var state = graph.view.getState(cells[i]);
				
				if (state != null && (active || firstMatch == null) &&
					graph.model.isVertex(state.cell) || graph.model.isEdge(state.cell))
				{
					if (graph.isHtmlLabel(state.cell))
					{
						tmp.innerHTML = graph.getLabel(state.cell);
						label = mxUtils.extractTextWithWhitespace([tmp]);
					}
					else
					{					
						label = graph.getLabel(state.cell);
					}
		
					label = mxUtils.trim(label.replace(/[\x00-\x1F\x7F-\x9F]|\s+/g, ' ')).toLowerCase();
					
					if (label.substring(0, search.length) == search)
					{
						if (active)
						{
							firstMatch = state;
						
							break;
						}
						else if (firstMatch == null)
						{
							firstMatch = state;
						}
					}
				}
	
				active = active || state == lastFound;
			}
		}
					
		if (firstMatch != null)
		{
			lastFound = firstMatch;
			graph.setSelectionCell(lastFound.cell);
			graph.scrollCellToVisible(lastFound.cell);
		}
		else
		{
			graph.clearSelection();
		}
		
		return search.length == 0 || firstMatch != null;
	};

	mxUtils.br(div);

	var resetBtn = mxUtils.button(mxResources.get('reset'), function()
	{
		searchInput.value = '';
		searchInput.style.backgroundColor = '';
		lastFound = null;
		searchInput.focus();
	});
	
	resetBtn.style.marginTop = '8px';
	resetBtn.style.marginRight = '4px';
	resetBtn.style.padding = '4px';
	div.appendChild(resetBtn);

	var btn = mxUtils.button('Find Again', function()
	{
		searchInput.style.backgroundColor = search(true) ? '' : '#ffcfcf';
	});
	
	btn.style.marginTop = '8px';
	btn.style.padding = '4px';
	div.appendChild(btn);
	
	mxEvent.addListener(searchInput, 'keyup', function(evt)
	{
		searchInput.style.backgroundColor = search(evt.keyCode == 13) ? '' : '#ffcfcf';
	});

	var wnd = new mxWindow('Find', div, document.body.offsetWidth - 300, 140, 200, 120, true, true);
	wnd.destroyOnClose = false;
	wnd.setMaximizable(false);
	wnd.setResizable(false);
	wnd.setClosable(true);
	
	// Extends Extras menu
	mxResources.parse('find=Find');

    // Adds action
    ui.actions.addAction('find...', function()
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
    }, null, null, 'Ctrl+Space');
	
	var menu = ui.menus.get('edit');
	var oldFunct = menu.funct;
	
	menu.funct = function(menu, parent)
	{
		oldFunct.apply(this, arguments);
		
		ui.menus.addMenuItems(menu, ['-', 'find'], parent);
	};
	
	var findAction = ui.actions.get('find');
	
	var keyHandlerKeyDown = ui.keyHandler.keyDown;

	ui.keyHandler.keyDown = function(evt)
	{
		if (evt.keyCode == 32 && mxEvent.isControlDown(evt))
		{
			findAction.funct();
			mxEvent.consume(evt);
		}
		else
		{
			return keyHandlerKeyDown.apply(this, arguments);
		}
	};
});
