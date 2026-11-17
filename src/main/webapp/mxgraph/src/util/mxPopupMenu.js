/**
 * Copyright (c) 2006-2015, JGraph Holdings Ltd
 * Copyright (c) 2006-2015, draw.io AG
 */
/**
 * Class: mxPopupMenu
 * 
 * Basic popup menu. To add a vertical scrollbar to a given submenu, the
 * following code can be used.
 * 
 * (code)
 * var mxPopupMenuShowMenu = mxPopupMenu.prototype.showMenu;
 * mxPopupMenu.prototype.showMenu = function()
 * {
 *   mxPopupMenuShowMenu.apply(this, arguments);
 *   
 *   this.div.style.overflowY = 'auto';
 *   this.div.style.overflowX = 'hidden';
 *   this.div.style.maxHeight = '160px';
 * };
 * (end)
 * 
 * Constructor: mxPopupMenu
 * 
 * Constructs a popupmenu.
 * 
 * Event: mxEvent.SHOW
 *
 * Fires after the menu has been shown in <popup>.
 */
function mxPopupMenu(factoryMethod)
{
	this.factoryMethod = factoryMethod;
	
	if (factoryMethod != null)
	{
		this.init();
	}
};

/**
 * Extends mxEventSource.
 */
mxPopupMenu.prototype = new mxEventSource();
mxPopupMenu.prototype.constructor = mxPopupMenu;

/**
 * Variable: submenuImage
 * 
 * URL of the image to be used for the submenu icon.
 */
mxPopupMenu.prototype.submenuImage = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAtOTYwIDk2MCA5NjAiIHdpZHRoPSIyNHB4IiBmaWxsPSIjMDAwMDAwIj48cGF0aCBkPSJNNDAwLTI4MHYtNDAwbDIwMCAyMDAtMjAwIDIwMFoiLz48L3N2Zz4=';

/**
 * Variable: zIndex
 * 
 * Specifies the zIndex for the popupmenu and its shadow. Default is 10006.
 */
mxPopupMenu.prototype.zIndex = 10006;

/**
 * Variable: factoryMethod
 * 
 * Function that is used to create the popup menu. The function takes the
 * current panning handler, the <mxCell> under the mouse and the mouse
 * event that triggered the call as arguments.
 */
mxPopupMenu.prototype.factoryMethod = null;

/**
 * Variable: useLeftButtonForPopup
 * 
 * Specifies if popupmenus should be activated by clicking the left mouse
 * button. Default is false.
 */
mxPopupMenu.prototype.useLeftButtonForPopup = false;

/**
 * Variable: enabled
 * 
 * Specifies if events are handled. Default is true.
 */
mxPopupMenu.prototype.enabled = true;

/**
 * Variable: itemCount
 * 
 * Contains the number of times <addItem> has been called for a new menu.
 */
mxPopupMenu.prototype.itemCount = 0;

/**
 * Variable: autoExpand
 * 
 * Specifies if submenus should be expanded on mouseover. Default is false.
 */
mxPopupMenu.prototype.autoExpand = false;

/**
 * Variable: smartSeparators
 * 
 * Specifies if separators should only be added if a menu item follows them.
 * Default is false.
 */
mxPopupMenu.prototype.smartSeparators = false;

/**
 * Variable: labels
 * 
 * Specifies if any labels should be visible. Default is true.
 */
mxPopupMenu.prototype.labels = true;

/**
 * Variable: returnFocus
 *
 * Element that gets the focus when the menu is closed with Escape or Tab.
 * This is reset in <popup>. Default is null.
 */
mxPopupMenu.prototype.returnFocus = null;

/**
 * Variable: actionFocus
 *
 * Element that gets the focus after an item was selected with the keyboard
 * if the action did not move the focus, eg. into a dialog. Default is null,
 * which uses <returnFocus>.
 */
mxPopupMenu.prototype.actionFocus = null;

/**
 * Function: init
 * 
 * Initializes the shapes required for this vertex handler.
 */
mxPopupMenu.prototype.init = function()
{
	// Adds the inner table
	this.table = document.createElement('table');
	this.table.className = 'mxPopupMenu';
	this.table.setAttribute('role', 'menu');

	this.tbody = document.createElement('tbody');
	this.tbody.setAttribute('role', 'none');
	this.table.appendChild(this.tbody);

	// Adds the outer div
	this.div = document.createElement('div');
	this.div.className = 'mxPopupMenu';
	this.div.style.display = 'inline';
	this.div.style.zIndex = this.zIndex;
	this.div.appendChild(this.table);

	// Disables the context menu on the outer div
	mxEvent.disableContextMenu(this.div);
	this.installKeyHandler(this.div);
};

/**
 * Function: isEnabled
 * 
 * Returns true if events are handled. This implementation
 * returns <enabled>.
 */
mxPopupMenu.prototype.isEnabled = function()
{
	return this.enabled;
};
	
/**
 * Function: setEnabled
 * 
 * Enables or disables event handling. This implementation
 * updates <enabled>.
 */
mxPopupMenu.prototype.setEnabled = function(enabled)
{
	this.enabled = enabled;
};

/**
 * Function: isPopupTrigger
 * 
 * Returns true if the given event is a popupmenu trigger for the optional
 * given cell.
 * 
 * Parameters:
 * 
 * me - <mxMouseEvent> that represents the mouse event.
 */
mxPopupMenu.prototype.isPopupTrigger = function(me)
{
	return me.isPopupTrigger() || (this.useLeftButtonForPopup && mxEvent.isLeftMouseButton(me.getEvent()));
};

/**
 * Function: addItem
 * 
 * Adds the given item to the given parent item. If no parent item is specified
 * then the item is added to the top-level menu. The return value may be used
 * as the parent argument, ie. as a submenu item. The return value is the table
 * row that represents the item.
 * 
 * Paramters:
 * 
 * title - String that represents the title of the menu item.
 * image - Optional URL for the image icon.
 * funct - Function associated that takes a mouseup or touchend event.
 * parent - Optional item returned by <addItem>.
 * iconCls - Optional string that represents the CSS class for the image icon.
 * IconsCls is ignored if image is given.
 * enabled - Optional boolean indicating if the item is enabled. Default is true.
 * active - Optional boolean indicating if the menu should implement any event handling.
 * Default is true.
 * noHover - Optional boolean to disable hover state.
 */
mxPopupMenu.prototype.addItem = function(title, image, funct, parent, iconCls, enabled, active, noHover)
{
	parent = parent || this;
	this.itemCount++;
	
	// Smart separators only added if element contains items
	if (parent.willAddSeparator)
	{
		if (parent.containsItems)
		{
			this.addSeparator(parent, true);
		}

		parent.willAddSeparator = false;
	}

	parent.containsItems = true;
	var tr = document.createElement('tr');
	tr.className = 'mxPopupMenuItem';
	tr.setAttribute('role', 'menuitem');

	if (enabled != null && !enabled)
	{
		tr.setAttribute('aria-disabled', 'true');
	}

	var col1 = document.createElement('td');
	col1.className = 'mxPopupMenuIcon';
	col1.setAttribute('role', 'none');

	// Adds the given image into the first column
	if (image != null)
	{
		var img = document.createElement('img');
		img.src = image;
		col1.appendChild(img);
	}
	else if (iconCls != null)
	{
		var div = document.createElement('div');
		div.className = iconCls;
		col1.appendChild(div);
	}
	
	tr.appendChild(col1);
	
	if (this.labels)
	{
		var col2 = document.createElement('td');
		col2.className = 'mxPopupMenuItem' +
			((enabled != null && !enabled) ? ' mxDisabled' : '');
		col2.setAttribute('role', 'none');

		mxUtils.write(col2, title);
		col2.align = 'left';
		tr.appendChild(col2);

		var col3 = document.createElement('td');
		col3.className = 'mxPopupMenuItem' +
			((enabled != null && !enabled) ? ' mxDisabled' : '');
		col3.setAttribute('role', 'none');
		col3.style.paddingRight = '6px';
		col3.style.textAlign = 'right';
		
		tr.appendChild(col3);
		
		if (parent.div == null)
		{
			this.createSubmenu(parent);
		}
	}
	
	parent.tbody.appendChild(tr);

	// Items for the keyboard (see keyDown), rows with other content have no hover.
	// The focused item is the only highlighted item in its menu.
	if (active != false && !noHover)
	{
		tr.menuParent = parent;

		mxEvent.addListener(tr, 'focus', mxUtils.bind(this, function()
		{
			var items = this.getItems(parent);

			// Only the highlighted item changes its class, so items with other
			// content keep theirs
			for (var i = 0; i < items.length; i++)
			{
				if (items[i].className == 'mxPopupMenuItemHover')
				{
					items[i].className = 'mxPopupMenuItem';
				}
			}

			tr.className = 'mxPopupMenuItemHover';
		}));

		mxEvent.addListener(tr, 'blur', mxUtils.bind(this, function()
		{
			if (!this.isHighlightedItem(tr))
			{
				tr.className = 'mxPopupMenuItem';
			}
		}));
	}

	if (active != false && enabled != false)
	{
		var currentSelection = null;

		// Selects the item with the keyboard
		tr.activate = mxUtils.bind(this, function(evt)
		{
			this.hideMenu();

			if (funct != null)
			{
				funct(evt);
			}
		});
		
		mxEvent.addGestureListeners(tr,
			mxUtils.bind(this, function(evt)
			{
				this.eventReceiver = tr;
				
				if (parent.activeRow != tr && parent.activeRow != parent)
				{
					if (parent.activeRow != null && parent.activeRow.div.parentNode != null)
					{
						this.hideSubmenu(parent);
					}
					
					if (tr.div != null)
					{
						this.showSubmenu(parent, tr);
						parent.activeRow = tr;
					}
				}
				
				// Workaround for lost current selection in page because of focus in IE
				if (document.selection != null && document.documentMode == 8)
				{
					currentSelection = document.selection.createRange();
				}
				
				mxEvent.consume(evt);
			}),
			mxUtils.bind(this, function(evt)
			{
				if (parent.activeRow != tr && parent.activeRow != parent)
				{
					if (parent.activeRow != null && parent.activeRow.div.parentNode != null)
					{
						this.hideSubmenu(parent);
					}
					
					if (this.autoExpand && tr.div != null)
					{
						this.showSubmenu(parent, tr);
						parent.activeRow = tr;
					}
				}
		
				// Sets hover style because TR in IE doesn't have hover
				if (!noHover)
				{
					tr.className = 'mxPopupMenuItemHover';
				}

				// Moves the keyboard focus to the item under the mouse
				if (tr.menuParent != null && this.isMenuElement(document.activeElement))
				{
					this.focusItem(tr, true);
				}
			}),
			mxUtils.bind(this, function(evt)
			{
				// EventReceiver avoids clicks on a submenu item
				// which has just been shown in the mousedown
				if (this.eventReceiver == tr)
				{
					if (parent.activeRow != tr)
					{
						this.hideMenu();
					}
					
					// Workaround for lost current selection in page because of focus in IE
					if (currentSelection != null)
					{
						// Workaround for "unspecified error" in IE8 standards
						try
						{
							currentSelection.select();
						}
						catch (e)
						{
							// ignore
						}

						currentSelection = null;
					}
					
					if (funct != null)
					{
						funct(evt);
					}
				}
				
				this.eventReceiver = null;
				mxEvent.consume(evt);
			})
		);
	
		// Resets hover style because TR in IE doesn't have hover
		if (!noHover)
		{
			mxEvent.addListener(tr, 'mouseout',
				mxUtils.bind(this, function(evt)
				{
					if (!this.isHighlightedItem(tr))
					{
						tr.className = 'mxPopupMenuItem';
					}
				})
			);
		}
	}
	
	return tr;
};

/**
 * Adds a checkmark to the given menuitem.
 */
mxPopupMenu.prototype.addCheckmark = function(item, icon)
{
	item.setAttribute('role', 'menuitemcheckbox');
	item.setAttribute('aria-checked', 'true');
	var img = this.addImage(item.firstChild.nextSibling, icon);
	img.style.marginTop = '-2px';
	img.style.left = '6px';
};

/**
 * Adds a checkmark to the given menuitem.
 */
mxPopupMenu.prototype.addImage = function(parent, icon)
{
	var img = document.createElement('div');
	img.style.position = 'absolute';
	img.style.display = 'inline-block';
	img.style.backgroundRepeat = 'no-repeat';
	img.style.backgroundPosition = 'center center';
	img.style.backgroundImage = 'url(' + icon + ')';
	img.style.backgroundSize = '22px';
	img.style.height = '22px';
	img.style.width = '22px';
	parent.appendChild(img);

	return img;
};

/**
 * Function: createSubmenu
 * 
 * Creates the nodes required to add submenu items inside the given parent
 * item. This is called in <addItem> if a parent item is used for the first
 * time. This adds various DOM nodes and a <submenuImage> to the parent.
 * 
 * Parameters:
 * 
 * parent - An item returned by <addItem>.
 */
mxPopupMenu.prototype.createSubmenu = function(parent)
{
	parent.table = document.createElement('table');
	parent.table.className = 'mxPopupMenu';
	parent.table.setAttribute('role', 'menu');

	parent.tbody = document.createElement('tbody');
	parent.tbody.setAttribute('role', 'none');
	parent.table.appendChild(parent.tbody);

	parent.div = document.createElement('div');
	parent.div.className = 'mxPopupMenu';

	parent.div.style.position = 'absolute';
	parent.div.style.display = 'inline';
	parent.div.style.zIndex = this.zIndex;

	parent.div.appendChild(parent.table);
	parent.setAttribute('aria-haspopup', 'menu');
	parent.setAttribute('aria-expanded', 'false');
	this.installKeyHandler(parent.div);

	var img = this.addImage(parent.firstChild.nextSibling.nextSibling, this.submenuImage);
	img.style.marginLeft = '-18px';
	img.style.marginTop = '-11px';
};

/**
 * Function: showSubmenu
 * 
 * Shows the submenu inside the given parent row.
 */
mxPopupMenu.prototype.showSubmenu = function(parent, row)
{
	if (row.div != null)
	{
		row.div.style.left = (parent.div.offsetLeft +
			row.offsetLeft + row.offsetWidth - 1) + 'px';
		row.div.style.top = (parent.div.offsetTop + row.offsetTop) + 'px';
		document.body.appendChild(row.div);
		row.setAttribute('aria-expanded', 'true');
		
		// Moves the submenu to the left side if there is no space
		var left = parseInt(row.div.offsetLeft);
		var width = parseInt(row.div.offsetWidth);
		var offset = mxUtils.getDocumentScrollOrigin(document);
		
		var b = document.body;
		var d = document.documentElement;
		
		var right = offset.x + (b.clientWidth || d.clientWidth);
		
		if (left + width > right)
		{
			row.div.style.left = Math.max(0, parent.div.offsetLeft - width + 16) + 'px';
		}
		
		//Show scrollbar if menu is larger than available height
		row.div.style.overflowY = 'auto';
		row.div.style.overflowX = 'hidden';
		var h0 = Math.max(document.body.clientHeight, document.documentElement.clientHeight);
		row.div.style.maxHeight = (h0 - 10) + 'px';
		
		mxUtils.fit(row.div);
	}
};

/**
 * Function: addSeparator
 * 
 * Adds a horizontal separator in the given parent item or the top-level menu
 * if no parent is specified.
 * 
 * Parameters:
 * 
 * parent - Optional item returned by <addItem>.
 * force - Optional boolean to ignore <smartSeparators>. Default is false.
 */
mxPopupMenu.prototype.addSeparator = function(parent, force)
{
	parent = parent || this;
	
	if (this.smartSeparators && !force)
	{
		parent.willAddSeparator = true;
	}
	else if (parent.tbody != null)
	{
		parent.willAddSeparator = false;
		var tr = document.createElement('tr');
		tr.setAttribute('role', 'separator');

		var col1 = document.createElement('td');
		col1.className = 'mxPopupMenuIcon';
		col1.setAttribute('role', 'none');
		col1.style.padding = '0 0 0 0px';

		tr.appendChild(col1);

		var col2 = document.createElement('td');
		col2.setAttribute('role', 'none');
		col2.style.padding = '0 0 0 0px';
		col2.setAttribute('colSpan', '2');
	
		var hr = document.createElement('hr');
		hr.setAttribute('size', '1');
		col2.appendChild(hr);
		
		tr.appendChild(col2);
		
		parent.tbody.appendChild(tr);
	}
};

/**
 * Function: popup
 * 
 * Shows the popup menu for the given event and cell.
 * 
 * Example:
 * 
 * (code)
 * graph.panningHandler.popup = function(x, y, cell, evt)
 * {
 *   mxUtils.alert('Hello, World!');
 * }
 * (end)
 */
mxPopupMenu.prototype.popup = function(x, y, cell, evt)
{
	if (this.div != null && this.tbody != null && this.factoryMethod != null)
	{
		// The focus to return to is set for each menu, eg. after it is shown
		this.returnFocus = null;
		this.div.style.left = x + 'px';
		this.div.style.top = y + 'px';
		
		// Removes all child nodes from the existing menu
		while (this.tbody.firstChild != null)
		{
			mxEvent.release(this.tbody.firstChild);
			this.tbody.removeChild(this.tbody.firstChild);
		}
		
		this.itemCount = 0;
		this.factoryMethod(this, cell, evt);
		
		if (this.itemCount > 0)
		{
			this.showMenu();
			this.fireEvent(new mxEventObject(mxEvent.SHOW));
		}
	}
};

/**
 * Function: isMenuShowing
 * 
 * Returns true if the menu is showing.
 */
mxPopupMenu.prototype.isMenuShowing = function()
{
	return this.div != null && this.div.parentNode == document.body;
};

/**
 * Function: showMenu
 * 
 * Shows the menu.
 */
mxPopupMenu.prototype.showMenu = function()
{
	// Disables filter-based shadow in IE9 standards mode
	if (document.documentMode >= 9)
	{
		this.div.style.filter = 'none';
	}
	
	// Fits the div inside the viewport
	document.body.appendChild(this.div);

	// Handles keystrokes if the focus is outside of the menu
	if (this.documentKeyHandler == null)
	{
		this.documentKeyHandler = mxUtils.bind(this, this.documentKeyDown);
		document.addEventListener('keydown', this.documentKeyHandler, true);
	}

	window.setTimeout(mxUtils.bind(this, function()
	{
		if (this.div != null)
		{
			mxUtils.fit(this.div);
		}
	}), 0);
};

/**
 * Function: hideMenu
 * 
 * Removes the menu and all submenus.
 */
mxPopupMenu.prototype.hideMenu = function()
{
	this.removeDocumentKeyHandler();

	if (this.div != null)
	{
		if (this.div.parentNode != null)
		{
			this.div.parentNode.removeChild(this.div);
		}
		
		this.hideSubmenu(this);
		this.containsItems = false;
		this.fireEvent(new mxEventObject(mxEvent.HIDE));
	}
};

/**
 * Function: hideSubmenu
 * 
 * Removes all submenus inside the given parent.
 * 
 * Parameters:
 * 
 * parent - An item returned by <addItem>.
 */
mxPopupMenu.prototype.hideSubmenu = function(parent)
{
	if (parent.activeRow != null)
	{
		this.hideSubmenu(parent.activeRow);
		
		if (parent.activeRow.div.parentNode != null)
		{
			parent.activeRow.div.parentNode.removeChild(parent.activeRow.div);
		}

		parent.activeRow.setAttribute('aria-expanded', 'false');

		if (document.activeElement != parent.activeRow)
		{
			parent.activeRow.className = 'mxPopupMenuItem';
		}

		parent.activeRow = null;
	}
};

/**
 * Function: installKeyHandler
 *
 * Handles the keystrokes in the given menu or submenu DIV and hides the
 * menu if the focus moves to an element outside of the menu.
 */
mxPopupMenu.prototype.installKeyHandler = function(div)
{
	mxEvent.addListener(div, 'keydown', mxUtils.bind(this, function(evt)
	{
		var row = mxEvent.getSource(evt);

		if (row.menuParent != null)
		{
			if (this.keyDown(evt, row))
			{
				mxEvent.consume(evt);
			}
		}
		// Arrow Up and Down in the text field of a menu, eg. the search field
		// of a help menu, move to its last or first item (see getMenuInput)
		else if ((evt.keyCode == 38 /* Up */ || evt.keyCode == 40 /* Down */) &&
			!mxEvent.isAltDown(evt) && !mxEvent.isControlDown(evt) &&
			!mxEvent.isMetaDown(evt) && !mxEvent.isShiftDown(evt))
		{
			var parent = this.getInputParent(row);

			if (parent != null && row == this.getMenuInput(parent))
			{
				this.focusFirstItem(evt.keyCode == 38, parent);
				mxEvent.consume(evt);
			}
		}
	}));

	mxEvent.addListener(div, 'focusout', mxUtils.bind(this, function(evt)
	{
		if (evt.relatedTarget != null && this.isMenuShowing() &&
			!this.isMenuElement(evt.relatedTarget))
		{
			this.hideMenu();
		}
	}));
};

/**
 * Function: isMenuElement
 *
 * Returns true if the given element is in the menu or in a submenu that is
 * showing.
 */
mxPopupMenu.prototype.isMenuElement = function(elt)
{
	var parent = this;
	var result = mxUtils.isAncestorNode(this.div, elt);

	while (!result && parent.activeRow != null)
	{
		parent = parent.activeRow;
		result = mxUtils.isAncestorNode(parent.div, elt);
	}

	return result;
};

/**
 * Function: getMenuInput
 *
 * Returns the single-line text field of the given parent item or top-level
 * menu that is not in an item, eg. the search field of a help menu, or null
 * if there is none. The arrow keys move between it and the items as if it
 * came before the first item (see <keyDown>).
 */
mxPopupMenu.prototype.getMenuInput = function(parent)
{
	var inputs = (parent.tbody != null) ? parent.tbody.getElementsByTagName('input') : [];

	for (var i = 0; i < inputs.length; i++)
	{
		var row = inputs[i];

		while (row != null && row.parentNode != parent.tbody)
		{
			row = row.parentNode;
		}

		if (row != null && row.menuParent == null && inputs[i].list == null &&
			/^(text|search|email|url|tel|password)$/.test(inputs[i].type))
		{
			return inputs[i];
		}
	}

	return null;
};

/**
 * Function: getInputParent
 *
 * Returns the parent item or top-level menu of the items next to the given
 * element of the menu, or null if it has no items.
 */
mxPopupMenu.prototype.getInputParent = function(elt)
{
	while (elt != null && elt.nodeName != 'TBODY')
	{
		elt = elt.parentNode;
	}

	for (var row = (elt != null) ? elt.firstChild : null; row != null; row = row.nextSibling)
	{
		if (row.menuParent != null)
		{
			return row.menuParent;
		}
	}

	return null;
};

/**
 * Function: getItems
 *
 * Returns the visible items for the keyboard in the given parent item or
 * the top-level menu.
 */
mxPopupMenu.prototype.getItems = function(parent)
{
	var items = [];

	for (var row = parent.tbody.firstChild; row != null; row = row.nextSibling)
	{
		if (row.menuParent == parent && row.style.display != 'none')
		{
			items.push(row);
		}
	}

	return items;
};

/**
 * Function: isHighlightedItem
 *
 * Returns true if the given item keeps its highlight, ie. if it has the
 * focus or shows its submenu.
 */
mxPopupMenu.prototype.isHighlightedItem = function(row)
{
	return document.activeElement == row || row.getAttribute('aria-expanded') == 'true';
};

/**
 * Function: getHoverItem
 *
 * Returns the highlighted item in the innermost menu that has one, eg. the
 * item under the mouse, or null if there is none.
 */
mxPopupMenu.prototype.getHoverItem = function()
{
	var result = null;

	for (var parent = this; parent != null; parent = parent.activeRow)
	{
		var items = this.getItems(parent);

		for (var i = 0; i < items.length; i++)
		{
			if (items[i].className == 'mxPopupMenuItemHover')
			{
				result = items[i];
			}
		}
	}

	return result;
};

/**
 * Function: focusItem
 *
 * Moves the focus to the given item. Items are only focusable once they
 * get the focus from the keyboard so that a click keeps the focus.
 */
mxPopupMenu.prototype.focusItem = function(row, preventScroll)
{
	if (row != null)
	{
		row.tabIndex = -1;
		row.focus({preventScroll: preventScroll == true});
	}
};

/**
 * Function: isTextInputEvent
 *
 * Returns true if the given keystroke is for a text field outside of the
 * menu, eg. the search field that shows the menu. Such keystrokes are not
 * handled in <documentKeyDown>.
 */
mxPopupMenu.prototype.isTextInputEvent = function(evt)
{
	var source = mxEvent.getSource(evt);

	return source.isContentEditable || source.nodeName == 'TEXTAREA' ||
		source.nodeName == 'SELECT' || (source.nodeName == 'INPUT' &&
		!/^(button|checkbox|color|file|image|radio|range|reset|submit)$/.test(source.type));
};

/**
 * Function: documentKeyDown
 *
 * Handles keystrokes while the menu is showing and the focus is outside of
 * it, eg. if the menu was opened with the mouse. Escape hides the menu, the
 * arrow keys, Home, End, Enter and Space continue from the item under the
 * mouse as in <keyDown>, or the arrow keys, Home and End move the focus to
 * the first or last item and Arrow Left and Right to the previous or next
 * menu. Keystrokes for text fields are ignored.
 */
mxPopupMenu.prototype.documentKeyDown = function(evt)
{
	var source = mxEvent.getSource(evt);

	if (this.isMenuShowing() && !this.isMenuElement(source) && !this.isTextInputEvent(evt) &&
		!mxEvent.isAltDown(evt) && !mxEvent.isControlDown(evt) && !mxEvent.isMetaDown(evt))
	{
		// Shift+arrow keys move the focus outside of the menu (see keyDown)
		var shift = mxEvent.isShiftDown(evt);
		var arrow = !shift && evt.keyCode >= 35 /* End */ && evt.keyCode <= 40 /* Down */;
		var row = this.getHoverItem();

		// Escape in the menu returns to the element that had the focus
		if (this.returnFocus == null && source != document.body)
		{
			this.returnFocus = source;
		}

		if (evt.keyCode == 27 /* Escape */)
		{
			this.hideMenu();
			mxEvent.consume(evt);
		}
		else if (row != null && (arrow || evt.keyCode == 13 /* Enter */ || evt.keyCode == 32 /* Space */))
		{
			this.focusItem(row, true);
			this.keyDown(evt, row);
			mxEvent.consume(evt);
		}
		else if (!shift && (evt.keyCode == 37 /* Left */ || evt.keyCode == 39 /* Right */))
		{
			this.moveToSiblingMenu(evt.keyCode == 37, evt);
			mxEvent.consume(evt);
		}
		else if (arrow)
		{
			this.focusFirstItem(evt.keyCode == 38 /* Up */ || evt.keyCode == 35 /* End */);
			mxEvent.consume(evt);
		}
	}
};

/**
 * Function: removeDocumentKeyHandler
 *
 * Removes the handler for keystrokes outside of the menu (see <showMenu>).
 */
mxPopupMenu.prototype.removeDocumentKeyHandler = function()
{
	if (this.documentKeyHandler != null)
	{
		document.removeEventListener('keydown', this.documentKeyHandler, true);
		this.documentKeyHandler = null;
	}
};

/**
 * Function: focusFirstItem
 *
 * Moves the focus to the first or last item in the given parent item or in
 * the top-level menu, eg. if the menu was opened with the keyboard.
 */
mxPopupMenu.prototype.focusFirstItem = function(last, parent)
{
	var items = this.getItems(parent || this);
	this.focusItem(items[(last) ? items.length - 1 : 0]);
};

/**
 * Function: moveToSiblingMenu
 *
 * Hook to open the previous or next menu, eg. of a menubar, for the given
 * left or right arrow keystroke. Returns true if the keystroke was handled.
 * This implementation returns false.
 */
mxPopupMenu.prototype.moveToSiblingMenu = function(previous, evt)
{
	return false;
};

/**
 * Function: keyDown
 *
 * Handles the given keystroke in the given item and returns true if it was
 * handled. Arrow keys, Home and End move the focus, Arrow Up and Down also
 * to the text field of the menu before the first item (see <getMenuInput>),
 * Enter and Space select the item, Arrow Right opens a submenu, Arrow Left
 * and Escape close it, Escape and Tab close the menu and a character moves
 * the focus to the next item that starts with it. Shift+Arrow Left and Right
 * never open or close submenus: like Tab, they close the menu and are not
 * handled, so that they move on from the restored focus.
 */
mxPopupMenu.prototype.keyDown = function(evt, row)
{
	var parent = row.menuParent;
	var items = this.getItems(parent);
	var index = mxUtils.indexOf(items, row);
	var enabled = row.getAttribute('aria-disabled') != 'true';
	var handled = !mxEvent.isAltDown(evt) && !mxEvent.isControlDown(evt) &&
		!mxEvent.isMetaDown(evt);

	if (handled)
	{
		if (mxEvent.isShiftDown(evt) && (evt.keyCode == 37 /* Left */ ||
			evt.keyCode == 39 /* Right */))
		{
			this.hideMenu();
			this.restoreFocus(this.returnFocus);
			handled = false;
		}
		else if (evt.keyCode == 38 /* Up */ || evt.keyCode == 40 /* Down */ ||
			evt.keyCode == 36 /* Home */ || evt.keyCode == 35 /* End */)
		{
			// The text field of the menu comes before the first item
			var input = ((evt.keyCode == 38 && index == 0) ||
				(evt.keyCode == 40 && index == items.length - 1)) ?
				this.getMenuInput(parent) : null;
			this.hideSubmenu(parent);

			if (input != null)
			{
				input.focus();
			}
			else
			{
				this.focusItem(items[(evt.keyCode == 36) ? 0 : ((evt.keyCode == 35) ?
					items.length - 1 : (index + ((evt.keyCode == 38) ?
					items.length - 1 : 1)) % items.length)]);
			}
		}
		else if (row.div != null && enabled && (evt.keyCode == 39 /* Right */ ||
			evt.keyCode == 13 /* Enter */ || evt.keyCode == 32 /* Space */))
		{
			if (parent.activeRow != row)
			{
				this.hideSubmenu(parent);
				this.showSubmenu(parent, row);
				parent.activeRow = row;
			}

			this.focusFirstItem(false, row);
		}
		else if (evt.keyCode == 13 /* Enter */ || evt.keyCode == 32 /* Space */)
		{
			if (row.activate != null)
			{
				var focus = (this.actionFocus != null) ? this.actionFocus : this.returnFocus;
				row.activate(evt);

				// Restores the focus unless the action moved it, eg. into a dialog
				if (document.activeElement == null || document.activeElement == document.body)
				{
					this.restoreFocus(focus);
				}
			}
		}
		else if (parent != this && (evt.keyCode == 37 /* Left */ || evt.keyCode == 27 /* Escape */))
		{
			this.hideSubmenu(parent.menuParent);
			this.focusItem(parent);
		}
		else if (evt.keyCode == 37 /* Left */ || evt.keyCode == 39 /* Right */)
		{
			handled = this.moveToSiblingMenu(evt.keyCode == 37, evt);
		}
		else if (evt.keyCode == 27 /* Escape */ || evt.keyCode == 9 /* Tab */)
		{
			// Tab moves on from the restored focus
			this.hideMenu();
			this.restoreFocus(this.returnFocus);
			handled = evt.keyCode == 27;
		}
		// Characters without a matching item are not handled, eg. for shortcuts
		else if (evt.key != null && evt.key.length == 1 && evt.key != ' ')
		{
			var key = evt.key.toLowerCase();
			handled = false;

			for (var i = 1; i <= items.length && !handled; i++)
			{
				var item = items[(index + i) % items.length];

				if (item.textContent.trim().toLowerCase().charAt(0) == key)
				{
					this.hideSubmenu(parent);
					this.focusItem(item);
					handled = true;
				}
			}
		}
		else
		{
			handled = false;
		}
	}

	return handled;
};

/**
 * Function: restoreFocus
 *
 * Moves the focus to the given element if it is visible.
 */
mxPopupMenu.prototype.restoreFocus = function(elt)
{
	if (elt != null && elt.getClientRects().length > 0)
	{
		elt.focus();
	}
};

/**
 * Function: destroy
 * 
 * Destroys the handler and all its resources and DOM nodes.
 */
mxPopupMenu.prototype.destroy = function()
{
	this.removeDocumentKeyHandler();

	if (this.div != null)
	{
		mxEvent.release(this.div);
		
		if (this.div.parentNode != null)
		{
			this.div.parentNode.removeChild(this.div);
		}
		
		this.div = null;
	}
};
