/**
 * Explore plugin.
 */
Draw.loadPlugin(function(ui)
{
	var graph = ui.editor.graph;
	var lastFound = null;

	var div = document.createElement('div');
	div.style.userSelect = 'none';
	div.style.overflow = 'hidden';
	div.style.padding = '10px';
	div.style.height = '100%';

	var searchInput = document.createElement('input');
	searchInput.setAttribute('placeholder', 'Find');
	searchInput.setAttribute('type', 'text');
	searchInput.style.marginTop = '4px';
	searchInput.style.width = '170px';
	searchInput.style.fontSize = '12px';
	searchInput.style.borderRadius = '4px';
	searchInput.style.padding = '6px';
	div.appendChild(searchInput);

	var tmp = document.createElement('div');
	
	function testMeta(re, cell)
	{
		if (typeof cell.value === 'object' && cell.value.attributes != null)
		{
			var attrs = cell.value.attributes;
			
			for (var i = 0; i < attrs.length; i++)
			{
				if (re.test(attrs[i].nodeValue))
				{
					return true;
				}	
			}
		}
		
		return false;
	};
	
	function search(next)
	{
		var cells = graph.model.getDescendants(graph.model.getRoot());
		var search = searchInput.value.toLowerCase();
		var re = new RegExp(search);
		var active = !next || lastFound == null;
		var firstMatch = null;
		
		if (graph.isEnabled() && search.length > 0)
		{
			for (var i = 0; i < cells.length; i++)
			{
				var state = graph.view.getState(cells[i]);
				
				if (state != null && state.cell.value != null && (active || firstMatch == null) &&
					(graph.model.isVertex(state.cell) || graph.model.isEdge(state.cell)))
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
					
					if (re.test(label) || testMeta(re, state.cell))
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
		
		return !graph.isEnabled() || search.length == 0 || firstMatch != null;
	};

	mxUtils.br(div);

	var resetBtn = mxUtils.button(mxResources.get('reset'), function()
	{
		searchInput.value = '';
		searchInput.style.backgroundColor = '';
		lastFound = null;
		searchInput.focus();
	});
	
	resetBtn.setAttribute('title', mxResources.get('reset'));
	resetBtn.style.marginTop = '8px';
	resetBtn.style.marginRight = '4px';
	resetBtn.style.backgroundColor = '#f5f5f5';
	resetBtn.style.backgroundImage = 'none';
	resetBtn.className = 'geBtn';
	
	div.appendChild(resetBtn);

	var btn = mxUtils.button('Find Again', function()
	{
		searchInput.style.backgroundColor = search(true) ? '' : '#ffcfcf';
	});
	
	btn.setAttribute('title', 'Find Again (Enter)');
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
		else
		{
			searchInput.style.backgroundColor = search(evt.keyCode == 13) ? '' : '#ffcfcf';
		}
	});

	var wnd = new mxWindow('Find', div, document.body.offsetWidth - 300, 110, 204, 116, true, true);
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
    }, null, null, 'Ctrl+F');
	
    
	var findAction = ui.actions.get('find');
	
    findAction.setToggleAction(true);
	findAction.setSelectedCallback(function() { return wnd.isVisible(); });
    
	var menu = ui.menus.get('edit');
	var oldFunct = menu.funct;
	
	menu.funct = function(menu, parent)
	{
		oldFunct.apply(this, arguments);
		
		ui.menus.addMenuItems(menu, ['-', 'find'], parent);
	};
	
	ui.keyHandler.bindAction(70, true, 'find'); // Ctrl+F
	
	mxEvent.addListener(div, 'keydown', function(evt)
	{
		if (evt.keyCode == 70 && ui.keyHandler.isControlDown(evt) && !mxEvent.isShiftDown(evt))
		{
			findAction.funct();
			mxEvent.consume(evt);
		}
	});
});
