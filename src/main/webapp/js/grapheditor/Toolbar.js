/**
 * Copyright (c) 2006-2012, JGraph Holdings Ltd
 */
/**
 * Construcs a new toolbar for the given editor.
 */
function Toolbar(editorUi, container)
{
	this.editorUi = editorUi;
	this.container = container;
	this.init();

	// Global handler to hide the current menu
	this.gestureHandler = mxUtils.bind(this, function(evt)
	{
		if (this.editorUi.isHideCurrentMenuEvent(evt))
		{
			this.hideMenu();
		}
	});

	mxEvent.addGestureListeners(document, this.gestureHandler);
};

/**
 * Adds the toolbar elements.
 */
Toolbar.prototype.init = function()
{
	var minWidth = (urlParams['embed'] == '1') ? 1050 : 720;
	
	var viewMenu = this.addMenu(this.editorUi.menus.get('viewPanels'), null, Editor.dockRightImage);
	this.addSeparator();

	var zoomInput = this.editorUi.createZoomInput();
	zoomInput.setAttribute('data-min-width', minWidth - 60);
	this.container.appendChild(zoomInput);
	this.addSeparator(null, minWidth - 60);

	this.addItems(['zoomIn', 'zoomOut'], null, null,
		[Editor.zoomInImage, Editor.zoomOutImage], minWidth - 260);
	this.addSeparator(null, minWidth - 260);

	this.addItems(['undo', 'redo'], null, null, [Editor.undoImage, Editor.redoImage]);
	this.addSeparator(null, minWidth - 460);
	this.addItems(['delete'], null, null, [Editor.trashImage], minWidth - 460);
	this.addSeparator(null, minWidth - 420);
	this.addItems(['toFront', 'toBack'], null, null, [Editor.toFrontImage, Editor.toBackImage], minWidth + 80);
	this.addSeparator(null, minWidth + 80);
	this.addItems(['fillColor'], null, null, [Editor.fillColorImage], minWidth + 100);
	this.addItems(['strokeColor'], null, null, [Editor.strokeColorImage], minWidth + 120);
	this.addItems(['shadow'], null, null, [Editor.shadowImage], minWidth + 180);
	this.addSeparator(null, minWidth + 180);
	this.edgeShapeMenu = this.addMenu(this.editorUi.menus.get('edgeShape'));
	this.edgeShapeMenu.setAttribute('data-min-width', minWidth - 280);
	this.edgeStyleMenu = this.addMenu(this.editorUi.menus.get('edgeStyle'));
	this.edgeStyleMenu.setAttribute('data-min-width', minWidth - 220);
	this.addSeparator(null, minWidth - 260);

	var insertMenu = this.addMenu(this.editorUi.menus.get('insert'), null, Editor.plusImage);
	insertMenu.setAttribute('data-min-width', minWidth - 420);
	var shapesElt = insertMenu.cloneNode(true);
	shapesElt.setAttribute('data-min-width', minWidth - 390);
	shapesElt.style.backgroundImage = 'url(' + Editor.shapesImage + ')';
	this.editorUi.addShapePicker(shapesElt, true);
	this.container.appendChild(shapesElt);
	var tableMenu = this.addTableDropDown();
	tableMenu.setAttribute('data-min-width', minWidth - 360);
	this.addSeparator(null, minWidth - 120);
	this.addItems(['insertFreehand', 'generate'], null, null,
		[Editor.freehandImage, Editor.sparklesImage], minWidth - 120);
	var layoutMenu = this.addMenu(this.editorUi.menus.get('layout'), null, Editor.layoutImage);
	layoutMenu.setAttribute('data-min-width', minWidth - 120);

	this.editorUi.dependsOnLanguage(mxUtils.bind(this, function()
	{
		if (this.edgeShapeMenu != null)
		{
			this.edgeShapeMenu.setAttribute('title', mxResources.get('connection'));
		}
		
		if (this.edgeStyleMenu != null)
		{
			this.edgeStyleMenu.setAttribute('title', mxResources.get('waypoints'));
		}
		
		viewMenu.setAttribute('title', mxResources.get('view') + ' (' + mxResources.get('panTooltip') + ')');
		insertMenu.setAttribute('title', mxResources.get('insert') + ' (' + mxResources.get('doubleClickTooltip') + ')');
		shapesElt.setAttribute('title', mxResources.get('shapes'));
		tableMenu.setAttribute('title', mxResources.get('table'));
		layoutMenu.setAttribute('title', mxResources.get('layout'));
	}));
};

/**
 * Adds the toolbar elements.
 */
Toolbar.prototype.appendDropDownImageHtml = function(elt)
{
	elt.style.backgroundImage = 'url(' + Editor.thinExpandImage + ')';
	elt.style.backgroundPosition = 'right 0px top 50%';
	elt.style.paddingRight = '16px';
};

/**
 * Adds the toolbar elements.
 */
Toolbar.prototype.addTableDropDown = function()
{
	var menuElt = this.addMenu(new Menu(mxUtils.bind(this, function(menu)
	{
		this.editorUi.menus.addInsertTableCellItem(menu);
	})), null, Editor.tableImage);

	// Connects to insert menu enabled state
	var menu = this.editorUi.menus.get('insert');
	
	// Workaround for possible not a function
	// when extending HTML objects
	if (menu != null && typeof menuElt.setEnabled === 'function')
	{
		menu.addListener('stateChanged', function()
		{
			menuElt.setEnabled(menu.enabled);
		});
	}
	
	return menuElt;
};

/**
 * Sets the current font name.
 */
Toolbar.prototype.setFontName = function(value)
{
	if (this.fontMenu != null)
	{
		this.fontMenu.innerText = '';
		var div = document.createElement('span');
		mxUtils.write(div, value);
		this.fontMenu.appendChild(div);

		this.appendDropDownImageHtml(this.fontMenu);
	}
};

/**
 * Sets the current font name.
 */
Toolbar.prototype.setFontSize = function(value)
{
	if (this.sizeMenu != null)
	{
		this.sizeMenu.innerText = '';
		var div = document.createElement('span');
		mxUtils.write(div, value);
		this.sizeMenu.appendChild(div);
		this.appendDropDownImageHtml(this.sizeMenu);
	}
};

/**
 * Hides the current menu.
 */
Toolbar.prototype.createTextToolbar = function()
{
	var ui = this.editorUi;
	var graph = ui.editor.graph;

	var styleElt = this.addMenu(this.editorUi.menus.get('formatBlock'), '');
	styleElt.style.width = '54px';
	styleElt.setAttribute('data-min-width', 360);
	this.appendDropDownImageHtml(styleElt);
	this.addSeparator(null, 360);

	var fontMenu = this.addMenu(this.editorUi.menus.get('fontFamily'), '');
	this.fontMenu = fontMenu
	this.fontMenu.style.width = '82px';
	this.fontMenu.setAttribute('data-min-width', 240);
	this.setFontName(Menus.prototype.defaultFont);
	this.addSeparator(null, 280);
	
	var sizeMenu = this.addMenu(this.editorUi.menus.get('fontSize'), Menus.prototype.defaultFontSize);
	this.sizeMenu = sizeMenu;
	this.sizeMenu.style.width = '36px';
	this.sizeMenu.setAttribute('data-min-width', 280);
	this.setFontSize(Menus.prototype.defaultFontSize);

	this.addItems(['-', 'undo', 'redo'], null, null,
		[null, Editor.undoImage, Editor.redoImage], 560);
	this.addItems(['-', 'bold', 'italic', 'underline'], null, null,
		[null, Editor.boldImage, Editor.italicImage, Editor.underlineImage], 460);
	
	// KNOWN: Lost focus after click on submenu with text (not icon) in quirks and IE8. This is because the TD seems
	// to catch the focus on click in these browsers. NOTE: Workaround in mxPopupMenu for icon items (without text).
	var alignMenu = this.addMenu(new Menu(mxUtils.bind(this, function(menu)
	{
		elt = menu.addItem('', Editor.alignLeftImage, mxUtils.bind(this, function(evt)
		{
			graph.cellEditor.alignText(mxConstants.ALIGN_LEFT, evt);
			ui.fireEvent(new mxEventObject('styleChanged',
				'keys', [mxConstants.STYLE_ALIGN],
				'values', [mxConstants.ALIGN_LEFT],
				'cells', [graph.cellEditor.getEditingCell()]));
		}));
		elt.setAttribute('title', mxResources.get('left'));

		elt = menu.addItem('', Editor.alignCenterImage, mxUtils.bind(this, function(evt)
		{
			graph.cellEditor.alignText(mxConstants.ALIGN_CENTER, evt);
			ui.fireEvent(new mxEventObject('styleChanged',
				'keys', [mxConstants.STYLE_ALIGN],
				'values', [mxConstants.ALIGN_CENTER],
				'cells', [graph.cellEditor.getEditingCell()]));
		}));
		elt.setAttribute('title', mxResources.get('center'));

		elt = menu.addItem('', Editor.alignRightImage, mxUtils.bind(this, function(evt)
		{
			graph.cellEditor.alignText(mxConstants.ALIGN_RIGHT, evt);
			ui.fireEvent(new mxEventObject('styleChanged',
				'keys', [mxConstants.STYLE_ALIGN],
				'values', [mxConstants.ALIGN_RIGHT],
				'cells', [graph.cellEditor.getEditingCell()]));
		}));
		elt.setAttribute('title', mxResources.get('right'));

		elt = menu.addItem('', Editor.alignJustifyImage, mxUtils.bind(this, function()
		{
			document.execCommand('justifyfull', false, null);
		}));
		elt.setAttribute('title', mxResources.get('justifyfull'));
		
		elt = menu.addItem('', Editor.orderedListImage, mxUtils.bind(this, function()
		{
			document.execCommand('insertorderedlist', false, null);
		}));
		elt.setAttribute('title', mxResources.get('numberedList'));
		
		elt = menu.addItem('', Editor.unorderedListImage, mxUtils.bind(this, function()
		{
			document.execCommand('insertunorderedlist', false, null);
		}));
		elt.setAttribute('title', mxResources.get('bulletedList'));
				
		elt = menu.addItem('', Editor.indentImage, mxUtils.bind(this, function()
		{
			document.execCommand('indent', false, null);
		}));
		elt.setAttribute('title', mxResources.get('increaseIndent'));

		elt = menu.addItem('', Editor.outdentImage, mxUtils.bind(this, function()
		{
			document.execCommand('outdent', false, null);
		}));
		elt.setAttribute('title', mxResources.get('decreaseIndent'));
	})), null, Editor.alignLeftImage);

	alignMenu.setAttribute('data-min-width', 600);
	
	var formatMenu = this.addMenu(new Menu(mxUtils.bind(this, function(menu)
	{
		elt = menu.addItem('', Editor.subscriptImage, this.editorUi.actions.get('subscript').funct);
		elt.setAttribute('title', mxResources.get('subscript') + ' (' + Editor.ctrlKey + '+,)');
		
		elt = menu.addItem('', Editor.superscriptImage, this.editorUi.actions.get('superscript').funct);
		elt.setAttribute('title', mxResources.get('superscript') + ' (' + Editor.ctrlKey + '+.)');

		// KNOWN: IE+FF don't return keyboard focus after color dialog (calling focus doesn't help)
		elt = menu.addItem('', Editor.fontColorImage, this.editorUi.actions.get('fontColor').funct);
		elt.setAttribute('title', mxResources.get('fontColor'));
		
		elt = menu.addItem('', Editor.backgroundColorImage, this.editorUi.actions.get('backgroundColor').funct);
		elt.setAttribute('title', mxResources.get('backgroundColor'));

		elt = menu.addItem('', Editor.removeFormatImage, mxUtils.bind(this, function()
		{
			document.execCommand('removeformat', false, null);
		}));
		elt.setAttribute('title', mxResources.get('removeFormat'));
	})), null, Editor.textFormatImage);

	formatMenu.setAttribute('data-min-width', 640);
	this.addSeparator(null, 780);

	this.editorUi.addButton(Editor.codeImage, mxResources.get('html'), function()
	{
		graph.cellEditor.toggleViewMode();
		
		if (graph.cellEditor.textarea.innerHTML.length > 0 &&
			(graph.cellEditor.textarea.innerHTML != '&nbsp;' ||
				!graph.cellEditor.clearOnChange))
		{
			window.setTimeout(function()
			{
				document.execCommand('selectAll', false, null);
			});
		}
	}, this.container).setAttribute('data-min-width', 780);
	
	this.addSeparator(null, 740);
	
	var insertMenu = this.addMenu(new Menu(mxUtils.bind(this, function(menu)
	{
		menu.addItem(mxResources.get('insertLink'), null, mxUtils.bind(this, function()
		{
			this.editorUi.actions.get('link').funct();
		}));
		
		menu.addItem(mxResources.get('insertImage'), null, mxUtils.bind(this, function()
		{
			this.editorUi.actions.get('image').funct();
		}));
		
		menu.addItem(mxResources.get('insertHorizontalRule'), null, mxUtils.bind(this, function()
		{
			document.execCommand('inserthorizontalrule', false, null);
		}));
	})), null, Editor.plusImage);
	
	insertMenu.setAttribute('data-min-width', 700);
	this.addSeparator(null, 700);
	
	// Table changes do no work with undo/redo
	var tableMenu = this.addMenu(new Menu(mxUtils.bind(this, function(menu)
	{
		var elt = graph.getSelectedElement();
		var cell = graph.getParentByNames(elt, ['TD', 'TH'], graph.cellEditor.text2);
		var row = graph.getParentByName(elt, 'TR', graph.cellEditor.text2);

		if (row == null)
    	{
			this.editorUi.menus.addInsertTableItem(menu);
    	}
		else
    	{
			var table = graph.getParentByName(row, 'TABLE', graph.cellEditor.text2);

			elt = menu.addItem('', Editor.addColumnLeftImage, mxUtils.bind(this, function()
			{
				try
				{
					graph.selectNode(graph.insertColumn(table, (cell != null) ? cell.cellIndex : 0));
				}
				catch (e)
				{
					this.editorUi.handleError(e);
				}
			}));
			elt.setAttribute('title', mxResources.get('insertColumnBefore'));
			
			elt = menu.addItem('', Editor.addColumnRightImage, mxUtils.bind(this, function()
			{	
				try
				{
					graph.selectNode(graph.insertColumn(table, (cell != null) ? cell.cellIndex + 1 : -1));
				}
				catch (e)
				{
					this.editorUi.handleError(e);
				}
			}));
			elt.setAttribute('title', mxResources.get('insertColumnAfter'));

			elt = menu.addItem('Delete column', Editor.removeColumnImage, mxUtils.bind(this, function()
			{
				if (cell != null)
				{
					try
					{
						graph.deleteColumn(table, cell.cellIndex);
					}
					catch (e)
					{
						this.editorUi.handleError(e);
					}
				}
			}));
			elt.setAttribute('title', mxResources.get('deleteColumn'));
			
			elt = menu.addItem('', Editor.addRowAboveImage, mxUtils.bind(this, function()
			{
				try
				{
					graph.selectNode(graph.insertRow(table, row.sectionRowIndex));
				}
				catch (e)
				{
					this.editorUi.handleError(e);
				}
			}));
			elt.setAttribute('title', mxResources.get('insertRowBefore'));

			elt = menu.addItem('', Editor.addRowBelowImage, mxUtils.bind(this, function()
			{
				try
				{
					graph.selectNode(graph.insertRow(table, row.sectionRowIndex + 1));
				}
				catch (e)
				{
					this.editorUi.handleError(e);
				}
			}));
			elt.setAttribute('title', mxResources.get('insertRowAfter'));

			elt = menu.addItem('', Editor.removeRowImage, mxUtils.bind(this, function()
			{
				try
				{
					graph.deleteRow(table, row.sectionRowIndex);
				}
				catch (e)
				{
					this.editorUi.handleError(e);
				}
			}));
			elt.setAttribute('title', mxResources.get('deleteRow'));
			
			elt = menu.addItem('', Editor.strokeColorImage, mxUtils.bind(this, function()
			{
				// Converts rgb(r,g,b) values
				var color = table.style.borderColor.replace(
					    /\brgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/g,
					    function($0, $1, $2, $3) {
					        return "#" + ("0"+Number($1).toString(16)).substr(-2) + ("0"+Number($2).toString(16)).substr(-2) + ("0"+Number($3).toString(16)).substr(-2);
					    });
				this.editorUi.pickColor(color, function(newColor)
				{
					if (newColor == null || newColor == mxConstants.NONE)
					{
						table.removeAttribute('border');
						table.style.border = '';
						table.style.borderCollapse = '';
					}
					else
					{
						table.setAttribute('border', '1');
						table.style.border = '1px solid ' + newColor;
						table.style.borderCollapse = 'collapse';
					}
				}, null, null, null, mxResources.get('borderColor'));
			}));
			elt.setAttribute('title', mxResources.get('borderColor'));

			elt = menu.addItem('', Editor.fillColorImage, mxUtils.bind(this, function()
			{
				// Converts rgb(r,g,b) values
				var color = table.style.backgroundColor.replace(
					    /\brgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/g,
					    function($0, $1, $2, $3) {
					        return "#" + ("0"+Number($1).toString(16)).substr(-2) + ("0"+Number($2).toString(16)).substr(-2) + ("0"+Number($3).toString(16)).substr(-2);
					    });
				this.editorUi.pickColor(color, function(newColor)
				{
					if (newColor == null || newColor == mxConstants.NONE)
					{
						table.style.backgroundColor = '';
					}
					else
					{
						table.style.backgroundColor = newColor;
					}
				}, null, null, null, mxResources.get('backgroundColor'));
			}));
			elt.setAttribute('title', mxResources.get('backgroundColor'));
			
			elt = menu.addItem('', Editor.spacingImage, mxUtils.bind(this, function()
			{
				var value = table.getAttribute('cellPadding') || 0;
				
				var dlg = new FilenameDialog(this.editorUi, value, mxResources.get('apply'),
					mxUtils.bind(this, function(newValue)
				{
					if (newValue != null && newValue.length > 0)
					{
						table.setAttribute('cellPadding', newValue);
					}
					else
					{
						table.removeAttribute('cellPadding');
					}
				}), mxResources.get('spacing'));
				this.editorUi.showDialog(dlg.container, 300, 80, true, true);
				dlg.init();
			}));
			elt.setAttribute('title', mxResources.get('spacing'));
			
			elt = menu.addItem('', Editor.alignLeftImage, mxUtils.bind(this, function()
			{
				table.setAttribute('align', 'left');
			}));
			elt.setAttribute('title', mxResources.get('left'));

			elt = menu.addItem('', Editor.alignCenterImage, mxUtils.bind(this, function()
			{
				table.setAttribute('align', 'center');
			}));
			elt.setAttribute('title', mxResources.get('center'));
				
			elt = menu.addItem('', Editor.alignRightImage, mxUtils.bind(this, function()
			{
				table.setAttribute('align', 'right');
			}));
			elt.setAttribute('title', mxResources.get('right'));
    	}
	})), null, Editor.tableImage);

	tableMenu.setAttribute('data-min-width', 740);

	this.editorUi.dependsOnLanguage(mxUtils.bind(this, function()
	{
		styleElt.innerText = mxResources.get('style');
		formatMenu.setAttribute('title', mxResources.get('format'));
		styleElt.setAttribute('title', mxResources.get('style'));
		fontMenu.setAttribute('title', mxResources.get('fontFamily'));
		sizeMenu.setAttribute('title', mxResources.get('fontSize'));
		insertMenu.setAttribute('title', mxResources.get('insert'));
		tableMenu.setAttribute('title', mxResources.get('table'));
	}));
};

/**
 * Hides the current menu.
 */
Toolbar.prototype.hideMenu = function()
{
	this.editorUi.hideCurrentMenu();
};

/**
 * Adds a label to the toolbar.
 */
Toolbar.prototype.setMenuText = function(menu, text)
{
	menu.getElementsByTagName('span')[0].innerText = text
};

/**
 * Adds a label to the toolbar.
 */
Toolbar.prototype.setMenuIcon = function(menu, icon)
{
	menu.style.backgroundImage = 'url(' + icon + ')';
};

/**
 * Adds a label to the toolbar.
 */
Toolbar.prototype.addMenu = function(menu, label, icon, container)
{
	var elt = this.editorUi.createMenuElement('', menu.funct);
	this.editorUi.menus.menuCreated(menu, elt, 'geButton');
	
	if (icon != null)
	{
		elt.style.backgroundImage = 'url(' + icon + ')';
	}
	else if (label != null)
	{
		var span = document.createElement('span');
		mxUtils.write(span, label);
		elt.appendChild(span);
	}

	container = (container != null) ? container : this.container;
	container.appendChild(elt);

	return elt;
};

/**
 * Adds a separator to the separator.
 */
Toolbar.prototype.addSeparator = function(c, minWidth)
{
	c = (c != null) ? c : this.container;
	var elt = document.createElement('div');
	elt.className = 'geSeparator';
	c.appendChild(elt);

	if (minWidth != null)
	{
		elt.setAttribute('data-min-width', minWidth);
	}
	
	return elt;
};

/**
 * Adds given action item
 */
Toolbar.prototype.addItems = function(keys, c, noListeners, icons, minWidth)
{
	var items = [];
	
	for (var i = 0; i < keys.length; i++)
	{
		var key = keys[i];
		
		if (key == '-')
		{
			items.push(this.addSeparator(c, minWidth));
		}
		else
		{
			var elt = this.addItem((icons != null) ?
				icons[i] : null, key, c, noListeners);

			if (elt != null)
			{
				items.push(elt);

				if (minWidth != null)
				{
					elt.setAttribute('data-min-width', minWidth);
				}
			}
		}
	}
	
	return items;
};

/**
 * Adds given action item
 */
Toolbar.prototype.addItem = function(sprite, key, container, noListeners)
{
	var action = this.editorUi.actions.get(key);
	var elt = null;
	
	if (action != null)
	{
		elt = this.editorUi.addButton(sprite, '', action.funct,
			(container != null) ? container : this.container);

		var stateChangedListener = mxUtils.bind(this, function(sender, evt)
		{
			if (evt != null && evt.getProperty('attribute') == 'visible')
			{
				if (!action.isVisible())
				{
					elt.style.display = 'none';
				}
				else
				{
					elt.style.display = '';
				}
			}
			else if (action.enabled)
			{
				elt.removeAttribute('disabled');
			}
			else
			{
				elt.setAttribute('disabled', 'disabled');
			}
		});

		if (!noListeners)
		{
			this.editorUi.dependsOnLanguage(mxUtils.bind(this, function()
			{
				var tooltip = action.getTitle();
			
				if (action.shortcut != null)
				{
					tooltip += ' (' + action.shortcut + ')';
				}
				
				elt.setAttribute('title', tooltip);
			}));

			action.addListener('stateChanged', stateChangedListener);
		}
		
		stateChangedListener();
	}
	
	return elt;
};

/**
 * Adds a handler for showing a menu in the given element.
 */
Toolbar.prototype.destroy = function()
{
	if (this.gestureHandler != null)
	{	
		mxEvent.removeGestureListeners(document, this.gestureHandler);
		this.gestureHandler = null;
	}
};
