/**
 * Explore plugin.
 */
Draw.loadPlugin(function(editorUi)
{
	var div = document.createElement('div');
	var keep = '\n\t`~!@#$%^&*()_+{}|:"<>?-=[]\;\'.\/,\n\t';
	
	// Adds resource for action
	mxResources.parse('anonymizeCurrentPage=Anonymize Current Page');
	
	function anonymizeString(text)
	{
		var result = [];
		
		for (var i = 0; i < text.length; i++)
		{
			var c = text.charAt(i);
			
			if (keep.indexOf(c) >= 0)
			{
				result.push(c);
			}
			else if (!isNaN(parseInt(c)))
			{
				result.push(Math.round(Math.random() * 9));
			}
			else if (c.toLowerCase() != c)
			{
				result.push(String.fromCharCode(65 + Math.round(Math.random() * 25)));
			}
			else if (c.toUpperCase() != c)
			{
				result.push(String.fromCharCode(97 + Math.round(Math.random() * 25)));
			}
			else if (/\s/.test(c))
			{
				/* any whitespace */
				result.push(' ');
			}
			else
			{
				result.push('�');
			}
		}
		
		return result.join('');
	};
	
	function replaceTextContent(elt)
	{
		if (elt.nodeValue != null)
		{
			elt.nodeValue = anonymizeString(elt.nodeValue);
		}
		
		if (elt.nodeType == mxConstants.NODETYPE_ELEMENT)
		{
			var tmp = elt.firstChild;
			
			while (tmp != null)
			{
				replaceTextContent(tmp);
				tmp = tmp.nextSibling;
			}
		}
	};

	
	function anonymizeHtml(html)
	{
		div.innerHTML = html;
		
		replaceTextContent(div);
		
		return div.innerHTML;
	};

	// Adds action
	editorUi.actions.addAction('anonymizeCurrentPage', function()
	{
		var graph = editorUi.editor.graph;
		var model = graph.model;
		
		model.beginUpdate();
		try
		{
			// Queue used to fix ancestor placeholders
			var queue = [];

			for (var id in model.cells)
			{
				var cell = model.cells[id];
				var label = graph.getLabel(cell);
				
				if (graph.isHtmlLabel(cell))
				{
					label = anonymizeHtml(label);
				}
				else
				{
					label = anonymizeString(label);
				}
				
				queue.push({cell: cell, label: label});
			}
			
			for (var i = 0; i < queue.length; i++)
			{
				model.setValue(queue[i].cell, queue[i].label);
			}
		}
		finally
		{
			model.endUpdate();
		}
	});
	
	var menu = editorUi.menus.get('extras');
	var oldFunct = menu.funct;
	
	menu.funct = function(menu, parent)
	{
		oldFunct.apply(this, arguments);
		
		editorUi.menus.addMenuItems(menu, ['-', 'anonymizeCurrentPage'], parent);
	};

});
