/**
 * Sample plugin.
 */
Draw.loadPlugin(function(ui) {
	
	var div = document.createElement('div');
	div.style.background = (uiTheme == 'dark') ? '#2a2a2a' : '#ffffff';
	div.style.border = '1px solid gray';
	div.style.opacity = '0.8';
	div.style.position = 'absolute';
	div.style.padding = '10px';
	div.style.paddingTop = '0px';
	div.style.width = '20%';
	div.style.minWidth = '200px';
	div.style.top = '40px';
	div.style.right = '20px';
	
	var graph = ui.editor.graph;
	
	// Made for chromeless mode
	if (!ui.editor.isChromelessView())
	{
		div.style.top = '100px';
		div.style.right = '260px';
	}
	
	div.innerHTML = '<p><i>Select a shape.</i></p>';
	document.body.appendChild(div);
	
	// Highlights current cell
	var highlight = new mxCellHighlight(graph, '#00ff00', 8);

	/**
	 * Updates the properties panel
	 */
	function cellClicked(cell)
	{
		// Forces focusout in IE
		graph.container.focus();

		// Gets the selection cell
		if (cell == null)
		{
			highlight.highlight(null);
			div.innerHTML = '<p><i>Select a shape.</i></p>';
		}
		else
		{
			var attrs = (cell.value != null) ? cell.value.attributes : null;
			highlight.highlight(graph.view.getState(cell));
	
			if (attrs != null)
			{
				var ignored = ['label', 'tooltip', 'placeholders'];
				var label = graph.sanitizeHtml(graph.getLabel(cell));
				
				if (label != null && label.length > 0)
				{
					div.innerHTML = '<h1>' + label + '</h1>';
				}
				else
				{
					div.innerHTML = '';
				}
				
				for (var i = 0; i < attrs.length; i++)
				{
					if (mxUtils.indexOf(ignored, attrs[i].nodeName) < 0 &&
						attrs[i].nodeValue.length > 0)
					{
						div.innerHTML += '<h2>' + graph.sanitizeHtml(attrs[i].nodeName) + '</h2>' +
							'<p>' + graph.sanitizeHtml(attrs[i].nodeValue) + '</p>';
					}
				}
			}
			else
			{
				var label = graph.convertValueToString(cell);
				
				if (label != null)
				{
					div.innerHTML = '<h1>' + graph.sanitizeHtml(label) + '</h1>';
				}
				else
				{
					div.innerHTML = '';
				}
			}
		}
	};

	/**
	 * Creates the textfield for the given property.
	 */
	function createTextField(graph, form, cell, attribute)
	{
		var input = form.addText(attribute.nodeName + ':', attribute.nodeValue);

		var applyHandler = function()
		{
			var newValue = input.value || '';
			var oldValue = cell.getAttribute(attribute.nodeName, '');

			if (newValue != oldValue)
			{
				graph.getModel().beginUpdate();
                
                try
                {
                	var edit = new mxCellAttributeChange(
                           cell, attribute.nodeName,
                           newValue);
                   	graph.getModel().execute(edit);
                   	graph.updateCellSize(cell);
                }
                finally
                {
                    graph.getModel().endUpdate();
                }
			}
		}; 

		mxEvent.addListener(input, 'keypress', function (evt)
		{
			// Needs to take shift into account for textareas
			if (evt.keyCode == /*enter*/13 &&
				!mxEvent.isShiftDown(evt))
			{
				input.blur();
			}
		});

		if (mxClient.IS_IE)
		{
			mxEvent.addListener(input, 'focusout', applyHandler);
		}
		else
		{
			// Note: Known problem is the blurring of fields in
			// Firefox by changing the selection, in which case
			// no event is fired in FF and the change is lost.
			// As a workaround you should use a local variable
			// that stores the focused field and invoke blur
			// explicitely where we do the graph.focus above.
			mxEvent.addListener(input, 'blur', applyHandler);
		}
	};
	
	graph.click = function(me)
	{
		// Async required to enable hyperlinks in labels
		window.setTimeout(function()
		{
			cellClicked(me.getCell());
		}, 0);
	};
});