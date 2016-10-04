/**
 * Explore plugin.
 */
Draw.loadPlugin(function(ui)
{
	var div = document.createElement('div');
	div.style.userSelect = 'none';
	div.style.background = 'whiteSmoke';
	div.style.border = '1px solid whiteSmoke';
	div.style.padding = '10px';
	div.style.height = '100%';
	div.style.marginBottom = '10px';
	div.style.overflow = 'auto';

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

	var tagList = [];
	var graphIsCellVisible = graph.isCellVisible;
	
	graph.isCellVisible = function(cell)
	{
		if (graphIsCellVisible.apply(this, arguments))
		{
			if (!this.model.isVertex(cell) && !this.model.isEdge(cell))
			{
				return true;
			}
			else if (cell.value != null && typeof(cell.value) == 'object')
			{
				var tags = cell.value.getAttribute('tags');
				
				if (tags != null)
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
		}
		
		return false;
	};

	mxUtils.br(div);

	var resetBtn = mxUtils.button(mxResources.get('reset'), function()
	{
		tagInput.value = '';
		tagList = [];
		verbSelect.value = 'show';
		graph.refresh();	
	});
	resetBtn.style.marginTop = '4px';
	resetBtn.style.padding = '4px';
	div.appendChild(resetBtn);

	var btn = mxUtils.button(mxResources.get('apply'), function()
	{
		tagList = tagInput.value.split(' ');
		graph.refresh();	
	});
	btn.style.marginTop = '4px';
	btn.style.padding = '4px';
	div.appendChild(btn);
	
	var wnd = new mxWindow('Tags', div, 0, 0, 200, 120, true, true);
	wnd.destroyOnClose = false;
	wnd.setMaximizable(false);
	wnd.setResizable(true);
	wnd.setClosable(false);
	wnd.setVisible(true);
});
