/**
 * Copyright (c) 2006-2012, JGraph Ltd
 */
/**
 * Constructs a new graph editor
 */
Menus = function(editorUi)
{
	this.editorUi = editorUi;
	this.menus = new Object();
	this.init();
	
	// Pre-fetches checkmark image
	if (!mxClient.IS_SVG)
	{
		new Image().src = this.checkmarkImage;
	}
};

/**
 * Sets the default font family.
 */
Menus.prototype.defaultFont = 'Helvetica';

/**
 * Sets the default font size.
 */
Menus.prototype.defaultFontSize = '12';

/**
 * Sets the default font size.
 */
Menus.prototype.defaultMenuItems = ['file', 'edit', 'view', 'arrange', 'extras', 'help'];

/**
 * Adds the label menu items to the given menu and parent.
 */
Menus.prototype.defaultFonts = ['Helvetica', 'Verdana', 'Times New Roman', 'Garamond', 'Comic Sans MS',
           		             'Courier New', 'Georgia', 'Lucida Console', 'Tahoma'];

/**
 * Adds the label menu items to the given menu and parent.
 */
Menus.prototype.init = function()
{
	var graph = this.editorUi.editor.graph;
	var isGraphEnabled = mxUtils.bind(graph, graph.isEnabled);

	this.customFonts = [];
	this.customFontSizes = [];

	this.put('fontFamily', new Menu(mxUtils.bind(this, function(menu, parent)
	{
		var addItem = mxUtils.bind(this, function(fontname)
		{
			var tr = this.styleChange(menu, fontname, [mxConstants.STYLE_FONTFAMILY], [fontname], null, parent, function()
			{
				document.execCommand('fontname', false, fontname);
			});
			tr.firstChild.nextSibling.style.fontFamily = fontname;
		});
		
		for (var i = 0; i < this.defaultFonts.length; i++)
		{
			addItem(this.defaultFonts[i]);
		}

		menu.addSeparator(parent);
		
		if (this.customFonts.length > 0)
		{
			for (var i = 0; i < this.customFonts.length; i++)
			{
				addItem(this.customFonts[i]);
			}
			
			menu.addSeparator(parent);
			
			menu.addItem(mxResources.get('reset'), null, mxUtils.bind(this, function()
			{
				this.customFonts = [];
			}), parent);
			
			menu.addSeparator(parent);
		}
		
		this.promptChange(menu, mxResources.get('custom') + '...', '', mxConstants.DEFAULT_FONTFAMILY, mxConstants.STYLE_FONTFAMILY, parent, true, mxUtils.bind(this, function(newValue)
		{
			this.customFonts.push(newValue);
		}));
	})));
	this.put('formatBlock', new Menu(mxUtils.bind(this, function(menu, parent)
	{
		function addItem(label, tag)
		{
			return menu.addItem(label, null, mxUtils.bind(this, function()
			{
				// TODO: Check if visible
				graph.cellEditor.textarea.focus();
	      		document.execCommand('formatBlock', false, '<' + tag + '>');
			}), parent);
		};
		
		addItem(mxResources.get('normal'), 'p');
		
		addItem('', 'h1').firstChild.nextSibling.innerHTML = '<h1 style="margin:0px;">' + mxResources.get('heading') + ' 1</h1>';
		addItem('', 'h2').firstChild.nextSibling.innerHTML = '<h2 style="margin:0px;">' + mxResources.get('heading') + ' 2</h2>';
		addItem('', 'h3').firstChild.nextSibling.innerHTML = '<h3 style="margin:0px;">' + mxResources.get('heading') + ' 3</h3>';
		addItem('', 'h4').firstChild.nextSibling.innerHTML = '<h4 style="margin:0px;">' + mxResources.get('heading') + ' 4</h4>';
		addItem('', 'h5').firstChild.nextSibling.innerHTML = '<h5 style="margin:0px;">' + mxResources.get('heading') + ' 5</h5>';
		addItem('', 'h6').firstChild.nextSibling.innerHTML = '<h6 style="margin:0px;">' + mxResources.get('heading') + ' 6</h6>';
		
		addItem('', 'pre').firstChild.nextSibling.innerHTML = '<pre style="margin:0px;">' + mxResources.get('formatted') + '</pre>';
		addItem('', 'blockquote').firstChild.nextSibling.innerHTML = '<blockquote style="margin-top:0px;margin-bottom:0px;">' + mxResources.get('blockquote') + '</blockquote>';
	})));
	this.put('fontSize', new Menu(mxUtils.bind(this, function(menu, parent)
	{
		var sizes = [6, 8, 9, 10, 11, 12, 14, 18, 24, 36, 48, 72];
		
		var addItem = mxUtils.bind(this, function(fontsize)
		{
			this.styleChange(menu, fontsize, [mxConstants.STYLE_FONTSIZE], [fontsize], null, parent, function()
			{
				// Creates an element with arbitrary size 3
				document.execCommand('fontSize', false, '3');
				
				// Changes the css font size of the first font element inside the in-place editor with size 3
				// hopefully the above element that we've just created. LATER: Check for new element using
				// previous result of getElementsByTagName (see other actions)
				var elts = graph.cellEditor.textarea.getElementsByTagName('font');
				
				for (var i = 0; i < elts.length; i++)
				{
					if (elts[i].getAttribute('size') == '3')
					{
						elts[i].removeAttribute('size');
						elts[i].style.fontSize = fontsize + 'px';
						
						break;
					}
				}
			});
		});
		
		for (var i = 0; i < sizes.length; i++)
		{
			addItem(sizes[i]);
		}

		menu.addSeparator(parent);
		
		if (this.customFontSizes.length > 0)
		{
			for (var i = 0; i < this.customFontSizes.length; i++)
			{
				addItem(this.customFontSizes[i]);
			}
			
			menu.addSeparator(parent);
			
			menu.addItem(mxResources.get('reset'), null, mxUtils.bind(this, function()
			{
				this.customFontSizes = [];
			}), parent);
			
			menu.addSeparator(parent);
		}
		
		this.promptChange(menu, mxResources.get('custom') + '...', '(pt)', '12', mxConstants.STYLE_FONTSIZE, parent, true, mxUtils.bind(this, function(newValue)
		{
			this.customFontSizes.push(newValue);
		}));
	})));
	this.put('direction', new Menu(mxUtils.bind(this, function(menu, parent)
	{
		menu.addItem(mxResources.get('flipH'), null, function() { graph.toggleCellStyles(mxConstants.STYLE_FLIPH, false); }, parent);
		menu.addItem(mxResources.get('flipV'), null, function() { graph.toggleCellStyles(mxConstants.STYLE_FLIPV, false); }, parent);
		this.addMenuItems(menu, ['-', 'rotation'], parent);
	})));
	this.put('align', new Menu(mxUtils.bind(this, function(menu, parent)
	{
		menu.addItem(mxResources.get('leftAlign'), null, function() { graph.alignCells(mxConstants.ALIGN_LEFT); }, parent);
		menu.addItem(mxResources.get('center'), null, function() { graph.alignCells(mxConstants.ALIGN_CENTER); }, parent);
		menu.addItem(mxResources.get('rightAlign'), null, function() { graph.alignCells(mxConstants.ALIGN_RIGHT); }, parent);
		menu.addSeparator(parent);
		menu.addItem(mxResources.get('topAlign'), null, function() { graph.alignCells(mxConstants.ALIGN_TOP); }, parent);
		menu.addItem(mxResources.get('middle'), null, function() { graph.alignCells(mxConstants.ALIGN_MIDDLE); }, parent);
		menu.addItem(mxResources.get('bottomAlign'), null, function() { graph.alignCells(mxConstants.ALIGN_BOTTOM); }, parent);
	})));
	this.put('distribute', new Menu(mxUtils.bind(this, function(menu, parent)
	{
		menu.addItem(mxResources.get('horizontal'), null, function() { graph.distributeCells(true); }, parent);
		menu.addItem(mxResources.get('vertical'), null, function() { graph.distributeCells(false); }, parent);
	})));
	this.put('layout', new Menu(mxUtils.bind(this, function(menu, parent)
	{
		var promptSpacing = mxUtils.bind(this, function(defaultValue, fn)
		{
			var dlg = new FilenameDialog(this.editorUi, defaultValue, mxResources.get('apply'), function(newValue)
			{
				fn(parseFloat(newValue));
			}, mxResources.get('spacing'));
			this.editorUi.showDialog(dlg.container, 300, 80, true, true);
			dlg.init();
		});
		
		menu.addItem(mxResources.get('horizontalFlow'), null, mxUtils.bind(this, function()
		{
			var layout = new mxHierarchicalLayout(graph, mxConstants.DIRECTION_WEST);
			
    		this.editorUi.executeLayout(function()
    		{
    			var selectionCells = graph.getSelectionCells();
    			layout.execute(graph.getDefaultParent(), selectionCells.length == 0 ? null : selectionCells);
    		}, true);
		}), parent);
		menu.addItem(mxResources.get('verticalFlow'), null, mxUtils.bind(this, function()
		{
			var layout = new mxHierarchicalLayout(graph, mxConstants.DIRECTION_NORTH);
			
    		this.editorUi.executeLayout(function()
    		{
    			var selectionCells = graph.getSelectionCells();
    			layout.execute(graph.getDefaultParent(), selectionCells.length == 0 ? null : selectionCells);
    		}, true);
		}), parent);
		menu.addSeparator(parent);
		menu.addItem(mxResources.get('horizontalTree'), null, mxUtils.bind(this, function()
		{
			var tmp = graph.getSelectionCell();
			var roots = null;
			
			if (tmp == null || graph.getModel().getChildCount(tmp) == 0)
			{
				if (graph.getModel().getEdgeCount(tmp) == 0)
				{
					roots = graph.findTreeRoots(graph.getDefaultParent());
				}
			}
			else
			{
				roots = graph.findTreeRoots(tmp);
			}

			if (roots != null && roots.length > 0)
			{
				tmp = roots[0];
			}
			
			if (tmp != null)
			{
				var layout = new mxCompactTreeLayout(graph, true);
				layout.edgeRouting = false;
				layout.levelDistance = 30;
				
				promptSpacing(layout.levelDistance, mxUtils.bind(this, function(newValue)
				{
					layout.levelDistance = newValue;
					
					this.editorUi.executeLayout(function()
		    		{
						layout.execute(graph.getDefaultParent(), tmp);
		    		}, true);
				}));
			}
		}), parent);
		menu.addItem(mxResources.get('verticalTree'), null, mxUtils.bind(this, function()
		{
			var tmp = graph.getSelectionCell();
			var roots = null;
			
			if (tmp == null || graph.getModel().getChildCount(tmp) == 0)
			{
				if (graph.getModel().getEdgeCount(tmp) == 0)
				{
					roots = graph.findTreeRoots(graph.getDefaultParent());
				}
			}
			else
			{
				roots = graph.findTreeRoots(tmp);
			}

			if (roots != null && roots.length > 0)
			{
				tmp = roots[0];
			}
			
			if (tmp != null)
			{
				var layout = new mxCompactTreeLayout(graph, false);
				layout.edgeRouting = false;
				layout.levelDistance = 30;
				
				promptSpacing(layout.levelDistance, mxUtils.bind(this, function(newValue)
				{
					layout.levelDistance = newValue;
					
					this.editorUi.executeLayout(function()
		    		{
						layout.execute(graph.getDefaultParent(), tmp);
		    		}, true);
				}));
			}
		}), parent);
		menu.addItem(mxResources.get('radialTree'), null, mxUtils.bind(this, function()
		{
			var tmp = graph.getSelectionCell();
			var roots = null;
			
			if (tmp == null || graph.getModel().getChildCount(tmp) == 0)
			{
				if (graph.getModel().getEdgeCount(tmp) == 0)
				{
					roots = graph.findTreeRoots(graph.getDefaultParent());
				}
			}
			else
			{
				roots = graph.findTreeRoots(tmp);
			}

			if (roots != null && roots.length > 0)
			{
				tmp = roots[0];
			}
			
			if (tmp != null)
			{
				var layout = new mxRadialTreeLayout(graph, false);
				layout.levelDistance = 80;
				layout.autoRadius = true;
				
				promptSpacing(layout.levelDistance, mxUtils.bind(this, function(newValue)
				{
					layout.levelDistance = newValue;
					
					this.editorUi.executeLayout(function()
		    		{
		    			layout.execute(graph.getDefaultParent(), tmp);
		    			
		    			if (!graph.isSelectionEmpty())
		    			{
			    			tmp = graph.getModel().getParent(tmp);
			    			
			    			if (graph.getModel().isVertex(tmp))
			    			{
			    				graph.updateGroupBounds([tmp], graph.gridSize * 2, true);
			    			}
		    			}
		    		}, true);
				}));
			}
		}), parent);
		menu.addSeparator(parent);
		menu.addItem(mxResources.get('organic'), null, mxUtils.bind(this, function()
		{
			var layout = new mxFastOrganicLayout(graph);
			
			promptSpacing(layout.forceConstant, mxUtils.bind(this, function(newValue)
			{
				layout.forceConstant = newValue;
				
	    		this.editorUi.executeLayout(function()
	    		{
	    			var tmp = graph.getSelectionCell();
	    			
	    			if (tmp == null || graph.getModel().getChildCount(tmp) == 0)
	    			{
	    				tmp = graph.getDefaultParent();
	    			}
	    			
	    			layout.execute(tmp);
	    			
	    			if (graph.getModel().isVertex(tmp))
	    			{
	    				graph.updateGroupBounds([tmp], graph.gridSize * 2, true);
	    			}
	    		}, true);
			}));
		}), parent);
		menu.addItem(mxResources.get('circle'), null, mxUtils.bind(this, function()
		{
			var layout = new mxCircleLayout(graph);
			
    		this.editorUi.executeLayout(function()
    		{
    			var tmp = graph.getSelectionCell();
    			
    			if (tmp == null || graph.getModel().getChildCount(tmp) == 0)
    			{
    				tmp = graph.getDefaultParent();
    			}
    			
    			layout.execute(tmp);
    			
    			if (graph.getModel().isVertex(tmp))
    			{
    				graph.updateGroupBounds([tmp], graph.gridSize * 2, true);
    			}
    		}, true);
		}), parent);
	})));
	this.put('navigation', new Menu(mxUtils.bind(this, function(menu, parent)
	{
		this.addMenuItems(menu, ['home', '-', 'exitGroup', 'enterGroup', '-', 'expand', 'collapse', '-', 'collapsible'], parent);
	})));
	this.put('arrange', new Menu(mxUtils.bind(this, function(menu, parent)
	{
		this.addMenuItems(menu, ['toFront', 'toBack', '-'], parent);
		this.addSubmenu('direction', menu, parent);
		this.addMenuItems(menu, ['turn', '-'], parent);
		this.addSubmenu('align', menu, parent);
		this.addSubmenu('distribute', menu, parent);
		menu.addSeparator(parent);
		this.addSubmenu('navigation', menu, parent);
		this.addSubmenu('insert', menu, parent);
		this.addSubmenu('layout', menu, parent);
		this.addMenuItems(menu, ['-', 'group', 'ungroup', 'removeFromGroup', '-', 'clearWaypoints', 'autosize'], parent);
	}))).isEnabled = isGraphEnabled;
	this.put('insert', new Menu(mxUtils.bind(this, function(menu, parent)
	{
		this.addMenuItems(menu, ['insertLink', 'insertImage'], parent);
	})));
	this.put('view', new Menu(mxUtils.bind(this, function(menu, parent)
	{
		this.addMenuItems(menu, ((this.editorUi.format != null) ? ['formatPanel'] : []).
			concat(['outline', 'layers', '-', 'pageView', 'pageScale', '-', 'scrollbars', 'tooltips', '-',
			        'grid', 'guides', '-', 'connectionArrows', 'connectionPoints', '-',
			        'resetView', 'zoomIn', 'zoomOut'], parent));
	})));
	// Two special dropdowns that are only used in the toolbar
	this.put('viewPanels', new Menu(mxUtils.bind(this, function(menu, parent)
	{
		if (this.editorUi.format != null)
		{
			this.addMenuItems(menu, ['formatPanel'], parent);
		}
		
		this.addMenuItems(menu, ['outline', 'layers'], parent);
	})));
	this.put('viewZoom', new Menu(mxUtils.bind(this, function(menu, parent)
	{
		this.addMenuItems(menu, ['resetView', '-'], parent);
		var scales = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3, 4];
		
		for (var i = 0; i < scales.length; i++)
		{
			(function(scale)
			{
				menu.addItem((scale * 100) + '%', null, function()
				{
					graph.zoomTo(scale);
				}, parent);
			})(scales[i]);
		}

		this.addMenuItems(menu, ['-', 'fitWindow', 'fitPageWidth', 'fitPage', 'fitTwoPages', '-', 'customZoom'], parent);
	})));
	this.put('file', new Menu(mxUtils.bind(this, function(menu, parent)
	{
		this.addMenuItems(menu, ['new', 'open', '-', 'save', 'saveAs', '-', 'import', 'export', '-', 'pageSetup', 'print'], parent);
	})));
	this.put('edit', new Menu(mxUtils.bind(this, function(menu, parent)
	{
		this.addMenuItems(menu, ['undo', 'redo', '-', 'cut', 'copy', 'paste', 'delete', '-', 'duplicate', '-',
		                         'editData', 'editTooltip', 'editStyle', '-', 'edit', '-', 'editLink', 'openLink', '-',
		                         'selectVertices', 'selectEdges', 'selectAll', 'selectNone', '-', 'lockUnlock']);
	})));
	this.put('extras', new Menu(mxUtils.bind(this, function(menu, parent)
	{
		this.addMenuItems(menu, ['copyConnect', 'collapseExpand', '-', 'editDiagram']);
	})));
	this.put('help', new Menu(mxUtils.bind(this, function(menu, parent)
	{
		this.addMenuItems(menu, ['help', '-', 'about']);
	})));
};

/**
 * Adds the label menu items to the given menu and parent.
 */
Menus.prototype.put = function(name, menu)
{
	this.menus[name] = menu;
	
	return menu;
};

/**
 * Adds the label menu items to the given menu and parent.
 */
Menus.prototype.get = function(name)
{
	return this.menus[name];
};

/**
 * Adds the given submenu.
 */
Menus.prototype.addSubmenu = function(name, menu, parent)
{
	var enabled = this.get(name).isEnabled();
	
	if (menu.showDisabled || enabled)
	{
		var submenu = menu.addItem(mxResources.get(name), null, null, parent, null, enabled);
		this.addMenu(name, menu, submenu);
	}
};

/**
 * Adds the label menu items to the given menu and parent.
 */
Menus.prototype.addMenu = function(name, popupMenu, parent)
{
	var menu = this.get(name);
	
	if (menu != null && (popupMenu.showDisabled || menu.isEnabled()))
	{
		this.get(name).execute(popupMenu, parent);
	}
};

/**
 * Adds a menu item to insert a table.
 */
Menus.prototype.addInsertTableItem = function(menu)
{
	// KNOWN: Does not work in IE8 standards and quirks
	var graph = this.editorUi.editor.graph;
	
	function createTable(rows, cols)
	{
		var html = ['<table>'];
		
		for (var i = 0; i < rows; i++)
		{
			html.push('<tr>');
			
			for (var j = 0; j < cols; j++)
			{
				html.push('<td><br></td>');
			}
			
			html.push('</tr>');
		}
		
		html.push('</table>');
		
		return html.join('');
	};
	
	// Show table size dialog
	var elt2 = menu.addItem('', null, mxUtils.bind(this, function(evt)
	{
		var td = graph.getParentByName(mxEvent.getSource(evt), 'TD');
		
		if (td != null)
		{
			var row2 = graph.getParentByName(td, 'TR');
			
			// To find the new link, we create a list of all existing links first
    		// LATER: Refactor for reuse with code for finding inserted image below
			var tmp = graph.cellEditor.textarea.getElementsByTagName('table');
			var oldTables = [];
			
			for (var i = 0; i < tmp.length; i++)
			{
				oldTables.push(tmp[i]);
			}
			
			// Finding the new table will work with insertHTML, but IE does not support that
			graph.container.focus();
			graph.pasteHtmlAtCaret(createTable(row2.sectionRowIndex + 1, td.cellIndex + 1));
			
			// Moves cursor to first table cell
			var newTables = graph.cellEditor.textarea.getElementsByTagName('table');
			
			if (newTables.length == oldTables.length + 1)
			{
				// Inverse order in favor of appended tables
				for (var i = newTables.length - 1; i >= 0; i--)
				{
					if (i == 0 || newTables[i] != oldTables[i - 1])
					{
						graph.selectNode(newTables[i].rows[0].cells[0]);
						break;
					}
				}
			}
		}
	}));
	
	// Quirks mode does not add cell padding if cell is empty, needs good old spacer solution
	var quirksCellHtml = '<img src="' + mxClient.imageBasePath + '/transparent.gif' + '" width="16" height="16"/>';

	function createPicker(rows, cols)
	{
		var table2 = document.createElement('table');
		table2.setAttribute('border', '1');
		table2.style.borderCollapse = 'collapse';

		if (!mxClient.IS_QUIRKS)
		{
			table2.setAttribute('cellPadding', '8');
		}
		
		for (var i = 0; i < rows; i++)
		{
			var row = table2.insertRow(i);
			
			for (var j = 0; j < cols; j++)
			{
				var cell = row.insertCell(-1);
				
				if (mxClient.IS_QUIRKS)
				{
					cell.innerHTML = quirksCellHtml;
				}
			}
		}
		
		return table2;
	};

	function extendPicker(picker, rows, cols)
	{
		for (var i = picker.rows.length; i < rows; i++)
		{
			var row = picker.insertRow(i);
			
			for (var j = 0; j < picker.rows[0].cells.length; j++)
			{
				var cell = row.insertCell(-1);
				
				if (mxClient.IS_QUIRKS)
				{
					cell.innerHTML = quirksCellHtml;
				}
			}
		}
		
		for (var i = 0; i < picker.rows.length; i++)
		{
			var row = picker.rows[i];
			
			for (var j = row.cells.length; j < cols; j++)
			{
				var cell = row.insertCell(-1);
				
				if (mxClient.IS_QUIRKS)
				{
					cell.innerHTML = quirksCellHtml;
				}
			}
		}
	};
	
	elt2.firstChild.innerHTML = '';
	var picker = createPicker(5, 5);
	elt2.firstChild.appendChild(picker);
	
	var label = document.createElement('div');
	label.style.padding = '4px';
	label.style.fontSize = Menus.prototype.defaultFontSize + 'px';
	label.innerHTML = '1x1';
	elt2.firstChild.appendChild(label);
	
	mxEvent.addListener(picker, 'mouseover', function(e)
	{
		var td = graph.getParentByName(mxEvent.getSource(e), 'TD');
		
		if (td != null)
		{
			var row2 = graph.getParentByName(td, 'TR');
			extendPicker(picker, Math.min(20, row2.sectionRowIndex + 2), Math.min(20, td.cellIndex + 2));
			label.innerHTML = (td.cellIndex + 1) + 'x' + (row2.sectionRowIndex + 1);
			
			for (var i = 0; i < picker.rows.length; i++)
			{
				var r = picker.rows[i];
				
				for (var j = 0; j < r.cells.length; j++)
				{
					var cell = r.cells[j];
					
					if (i <= row2.sectionRowIndex && j <= td.cellIndex)
					{
						cell.style.backgroundColor = 'blue';
					}
					else
					{
						cell.style.backgroundColor = 'white';
					}
				}
			}
			
			mxEvent.consume(e);
		}
	});
};

/**
 * Adds a style change item to the given menu.
 */
Menus.prototype.edgeStyleChange = function(menu, label, keys, values, sprite, parent, reset)
{
	return menu.addItem(label, null, mxUtils.bind(this, function()
	{
		var graph = this.editorUi.editor.graph;
		graph.stopEditing(false);
		
		graph.getModel().beginUpdate();
		try
		{
			var cells = graph.getSelectionCells();
			var edges = [];
			
			for (var i = 0; i < cells.length; i++)
			{
				var cell = cells[i];
				
				if (graph.getModel().isEdge(cell))
				{
					if (reset)
					{
						var geo = graph.getCellGeometry(cell);
			
						// Resets all edge points
						if (geo != null)
						{
							geo = geo.clone();
							geo.points = null;
							graph.getModel().setGeometry(cell, geo);
						}
					}
					
					for (var j = 0; j < keys.length; j++)
					{
						graph.setCellStyles(keys[j], values[j], [cell]);
					}
					
					edges.push(cell);
				}
			}
			
			this.editorUi.fireEvent(new mxEventObject('styleChanged', 'keys', keys,
				'values', values, 'cells', edges));
		}
		finally
		{
			graph.getModel().endUpdate();
		}
	}), parent, sprite);
};

/**
 * Adds a style change item to the given menu.
 */
Menus.prototype.styleChange = function(menu, label, keys, values, sprite, parent, fn)
{
	var apply = this.createStyleChangeFunction(keys, values);
	
	return menu.addItem(label, null, mxUtils.bind(this, function()
	{
		var graph = this.editorUi.editor.graph;
		
		if (fn != null && graph.cellEditor.isContentEditing())
		{
			fn();
		}
		else
		{
			apply();
		}
	}), parent, sprite);
};

/**
 * 
 */
Menus.prototype.createStyleChangeFunction = function(keys, values)
{
	return mxUtils.bind(this, function()
	{
		var graph = this.editorUi.editor.graph;
		graph.stopEditing(false);
		
		graph.getModel().beginUpdate();
		try
		{
			for (var i = 0; i < keys.length; i++)
			{
				graph.setCellStyles(keys[i], values[i]);
			}
			
			this.editorUi.fireEvent(new mxEventObject('styleChanged', 'keys', keys, 'values', values,
				'cells', graph.getSelectionCells()));
		}
		finally
		{
			graph.getModel().endUpdate();
		}
	});
};

/**
 * Adds a style change item with a prompt to the given menu.
 */
Menus.prototype.promptChange = function(menu, label, hint, defaultValue, key, parent, enabled, fn, sprite)
{
	return menu.addItem(label, null, mxUtils.bind(this, function()
	{
		var graph = this.editorUi.editor.graph;
		var value = defaultValue;
    	var state = graph.getView().getState(graph.getSelectionCell());
    	
    	if (state != null)
    	{
    		value = state.style[key] || value;
    	}
    	
		var dlg = new FilenameDialog(this.editorUi, value, mxResources.get('apply'), mxUtils.bind(this, function(newValue)
		{
			if (newValue != null && newValue.length > 0)
			{
				graph.getModel().beginUpdate();
				try
				{
					graph.stopEditing(false);
					graph.setCellStyles(key, newValue);
				}
				finally
				{
					graph.getModel().endUpdate();
				}
				
				if (fn != null)
				{
					fn(newValue);
				}
			}
		}), mxResources.get('enterValue') + ((hint.length > 0) ? (' ' + hint) : ''));
		this.editorUi.showDialog(dlg.container, 300, 80, true, true);
		dlg.init();
	}), parent, sprite, enabled);
};

/**
 * Adds a handler for showing a menu in the given element.
 */
Menus.prototype.pickColor = function(key, cmd, defaultValue)
{
	var graph = this.editorUi.editor.graph;
	
	if (cmd != null && graph.cellEditor.isContentEditing())
	{
		// Saves and restores text selection for in-place editor
		var selState = graph.cellEditor.saveSelection();
		
		var dlg = new ColorDialog(this.editorUi, defaultValue || '000000', mxUtils.bind(this, function(color)
		{
			graph.cellEditor.restoreSelection(selState);
			document.execCommand(cmd, false, (color != mxConstants.NONE) ? color : 'transparent');
		}), function()
		{
			graph.cellEditor.restoreSelection(selState);
		});
		this.editorUi.showDialog(dlg.container, 220, 430, true, true);
		dlg.init();
	}
	else
	{
		if (this.colorDialog == null)
		{
			this.colorDialog = new ColorDialog(this.editorUi);
		}
	
		this.colorDialog.currentColorKey = key;
		var state = graph.getView().getState(graph.getSelectionCell());
		var color = 'none';
		
		if (state != null)
		{
			color = state.style[key] || color;
		}
		
		if (color == 'none')
		{
			color = 'ffffff';
			this.colorDialog.picker.fromString('ffffff');
			this.colorDialog.colorInput.value = 'none';
		}
		else
		{
			this.colorDialog.picker.fromString(color);
		}
	
		this.editorUi.showDialog(this.colorDialog.container, 220, 430, true, true);
		this.colorDialog.init();
	}
};

/**
 * Adds a handler for showing a menu in the given element.
 */
Menus.prototype.toggleStyle = function(key, defaultValue)
{
	var graph = this.editorUi.editor.graph;
	var value = graph.toggleCellStyles(key, defaultValue);
	this.editorUi.fireEvent(new mxEventObject('styleChanged', 'keys', [key], 'values', [value],
			'cells', graph.getSelectionCells()));
};

/**
 * Creates the keyboard event handler for the current graph and history.
 */
Menus.prototype.addMenuItem = function(menu, key, parent, trigger, sprite)
{
	var action = this.editorUi.actions.get(key);

	if (action != null && (menu.showDisabled || action.isEnabled()) && action.visible)
	{
		var item = menu.addItem(action.label, null, function()
		{
			action.funct(trigger);
		}, parent, sprite, action.isEnabled());
		
		// Adds checkmark image
		if (action.toggleAction && action.isSelected())
		{
			menu.addCheckmark(item, Editor.checkmarkImage);
		}

		this.addShortcut(item, action);
		
		return item;
	}
	
	return null;
};

/**
 * Adds a checkmark to the given menuitem.
 */
Menus.prototype.addShortcut = function(item, action)
{
	if (action.shortcut != null)
	{
		var td = item.firstChild.nextSibling.nextSibling;
		var span = document.createElement('span');
		span.style.color = 'gray';
		mxUtils.write(span, action.shortcut);
		td.appendChild(span);
	}
};

/**
 * Creates the keyboard event handler for the current graph and history.
 */
Menus.prototype.addMenuItems = function(menu, keys, parent, trigger, sprites)
{
	for (var i = 0; i < keys.length; i++)
	{
		if (keys[i] == '-')
		{
			menu.addSeparator(parent);
		}
		else
		{
			this.addMenuItem(menu, keys[i], parent, trigger, (sprites != null) ? sprites[i] : null);
		}
	}
};

/**
 * Creates the keyboard event handler for the current graph and history.
 */
Menus.prototype.createPopupMenu = function(menu, cell, evt)
{
	var graph = this.editorUi.editor.graph;
	menu.smartSeparators = true;
	
	if (graph.isSelectionEmpty())
	{
		this.addMenuItems(menu, ['undo', 'redo', '-', 'pasteHere'], null, evt);
	}
	else
	{
		this.addMenuItems(menu, ['delete', '-', 'cut', 'copy', '-', 'duplicate'], null, evt);

	}

	if (!graph.isSelectionEmpty())
	{
		if (graph.getSelectionCount() == 1)
		{
			this.addMenuItems(menu, ['setAsDefaultStyle'], null, evt);
		}
		
		menu.addSeparator();
		
		cell = graph.getSelectionCell();
		var state = graph.view.getState(cell);

		if (state != null)
		{
			var hasWaypoints = false;
			this.addMenuItems(menu, ['toFront', 'toBack', '-'], null, evt);

			if (graph.getModel().isEdge(cell) && mxUtils.getValue(state.style, mxConstants.STYLE_EDGE, null) != 'entityRelationEdgeStyle' &&
				mxUtils.getValue(state.style, mxConstants.STYLE_SHAPE, null) != 'arrow')
			{
				var handler = graph.selectionCellsHandler.getHandler(cell);
				var isWaypoint = false;
				
				if (handler instanceof mxEdgeHandler && handler.bends != null && handler.bends.length > 2)
				{
					var index = handler.getHandleForEvent(graph.updateMouseEvent(new mxMouseEvent(evt)));
					
					// Configures removeWaypoint action before execution
					// Using trigger parameter is cleaner but have to find waypoint here anyway.
					var rmWaypointAction = this.editorUi.actions.get('removeWaypoint');
					rmWaypointAction.handler = handler;
					rmWaypointAction.index = index;

					isWaypoint = index > 0 && index < handler.bends.length - 1;
				}
				
				this.addMenuItems(menu, ['-', (isWaypoint) ? 'removeWaypoint' : 'addWaypoint'], null, evt);
	
				// Adds reset waypoints option if waypoints exist
				var geo = graph.getModel().getGeometry(cell);
				hasWaypoints = geo != null && geo.points != null && geo.points.length > 0;
			}

			if (graph.getSelectionCount() == 1 && (hasWaypoints || (graph.getModel().isVertex(cell) &&
				graph.getModel().getEdgeCount(cell) > 0)))
			{
				this.addMenuItems(menu, ['clearWaypoints'], null, evt);
			}
			
			if (graph.getSelectionCount() > 1)	
			{
				menu.addSeparator();
				this.addMenuItems(menu, ['group'], null, evt);
			}
			else if (graph.getSelectionCount() == 1 && !graph.getModel().isEdge(cell) && !graph.isSwimlane(cell) &&
					graph.getModel().getChildCount(cell) > 0)
			{
				menu.addSeparator();
				this.addMenuItems(menu, ['ungroup'], null, evt);
			}
			
			if (graph.getSelectionCount() == 1)
			{
				menu.addSeparator();
				this.addMenuItems(menu, ['edit', '-', 'editData', 'editLink'], null, evt);

				// Shows edit image action if there is an image in the style
				if (graph.getModel().isVertex(cell) && mxUtils.getValue(state.style, mxConstants.STYLE_IMAGE, null) != null)
				{
					menu.addSeparator();
					this.addMenuItem(menu, 'image', null, evt).firstChild.nextSibling.innerHTML = mxResources.get('editImage') + '...';
				}
			}
		}
	}
	else
	{
		this.addMenuItems(menu, ['-', 'selectVertices', 'selectEdges', '-', 'selectAll'], null, evt);
	}
};

/**
 * Creates the keyboard event handler for the current graph and history.
 */
Menus.prototype.createMenubar = function(container)
{
	var menubar = new Menubar(this.editorUi, container);
	var menus = this.defaultMenuItems;
	
	for (var i = 0; i < menus.length; i++)
	{
		(mxUtils.bind(this, function(menu)
		{
			var elt = menubar.addMenu(mxResources.get(menus[i]), mxUtils.bind(this, function()
			{
				// Allows extensions of menu.funct
				menu.funct.apply(this, arguments);
			}));
			
			this.menuCreated(menu, elt);
		}))(this.get(menus[i]));
	}

	return menubar;
};

/**
 * Creates the keyboard event handler for the current graph and history.
 */
Menus.prototype.menuCreated = function(menu, elt)
{
	if (elt != null)
	{
		menu.addListener('stateChanged', function()
		{
			elt.enabled = menu.enabled;
			
			if (!menu.enabled)
			{
				elt.className = 'geItem mxDisabled';
				
				if (document.documentMode == 8)
				{
					elt.style.color = '#c3c3c3';
				}
			}
			else
			{
				elt.className = 'geItem';
				
				if (document.documentMode == 8)
				{
					elt.style.color = '';
				}
			}
		});
	}
};

/**
 * Construcs a new menubar for the given editor.
 */
function Menubar(editorUi, container)
{
	this.editorUi = editorUi;
	this.container = container;
};

/**
 * Adds the menubar elements.
 */
Menubar.prototype.hideMenu = function()
{
	this.editorUi.hideCurrentMenu();
};

/**
 * Adds a submenu to this menubar.
 */
Menubar.prototype.addMenu = function(label, funct)
{
	var elt = document.createElement('a');
	elt.setAttribute('href', 'javascript:void(0);');
	elt.className = 'geItem';
	mxUtils.write(elt, label);

	this.addMenuHandler(elt, funct);
	this.container.appendChild(elt);
	
	return elt;
};

/**
 * Adds a handler for showing a menu in the given element.
 */
Menubar.prototype.addMenuHandler = function(elt, funct)
{
	if (funct != null)
	{
		var show = true;
		
		var clickHandler = mxUtils.bind(this, function(evt)
		{
			if (show && elt.enabled == null || elt.enabled)
			{
				this.editorUi.editor.graph.popupMenuHandler.hideMenu();
				var menu = new mxPopupMenu(funct);
				menu.div.className += ' geMenubarMenu';
				menu.smartSeparators = true;
				menu.showDisabled = true;
				menu.autoExpand = true;
				
				// Disables autoexpand and destroys menu when hidden
				menu.hideMenu = mxUtils.bind(this, function()
				{
					mxPopupMenu.prototype.hideMenu.apply(menu, arguments);
					this.editorUi.resetCurrentMenu();
					menu.destroy();
				});

				var offset = mxUtils.getOffset(elt);
				menu.popup(offset.x, offset.y + elt.offsetHeight, null, evt);
				this.editorUi.setCurrentMenu(menu, elt);
			}
			
			mxEvent.consume(evt);
		});
		
		// Shows menu automatically while in expanded state
		mxEvent.addListener(elt, 'mousemove', mxUtils.bind(this, function(evt)
		{
			if (this.editorUi.currentMenu != null && this.editorUi.currentMenuElt != elt)
			{
				this.editorUi.hideCurrentMenu();
				clickHandler(evt);
			}
		}));

		// Hides menu if already showing
		mxEvent.addListener(elt, 'mousedown', mxUtils.bind(this, function()
		{
			show = this.currentElt != elt;
		}));
		
		mxEvent.addListener(elt, 'click', mxUtils.bind(this, function(evt)
		{
			clickHandler(evt);
			show = true;
		}));
	}
};

/**
 * Creates the keyboard event handler for the current graph and history.
 */
Menubar.prototype.destroy = function()
{
	// do nothing
};

/**
 * Constructs a new action for the given parameters.
 */
function Menu(funct, enabled)
{
	mxEventSource.call(this);
	this.funct = funct;
	this.enabled = (enabled != null) ? enabled : true;
};

// Menu inherits from mxEventSource
mxUtils.extend(Menu, mxEventSource);

/**
 * Sets the enabled state of the action and fires a stateChanged event.
 */
Menu.prototype.isEnabled = function()
{
	return this.enabled;
};

/**
 * Sets the enabled state of the action and fires a stateChanged event.
 */
Menu.prototype.setEnabled = function(value)
{
	if (this.enabled != value)
	{
		this.enabled = value;
		this.fireEvent(new mxEventObject('stateChanged'));
	}
};

/**
 * Sets the enabled state of the action and fires a stateChanged event.
 */
Menu.prototype.execute = function(menu, parent)
{
	this.funct(menu, parent);
};

/**
 * "Installs" menus in EditorUi.
 */
EditorUi.prototype.createMenus = function()
{
	return new Menus(this);
};
