/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: mxWindow
 * 
 * Basic window inside a document.
 * 
 * Examples:
 * 
 * Creating a simple window.
 *
 * (code)
 * var tb = document.createElement('div');
 * var wnd = new mxWindow('Title', tb, 100, 100, 200, 200, true, true);
 * wnd.setVisible(true); 
 * (end)
 *
 * Creating a window that contains an iframe. 
 * 
 * (code)
 * var frame = document.createElement('iframe');
 * frame.setAttribute('width', '192px');
 * frame.setAttribute('height', '172px');
 * frame.setAttribute('src', 'http://www.example.com/');
 * frame.style.backgroundColor = 'white';
 * 
 * var w = document.body.clientWidth;
 * var h = (document.body.clientHeight || document.documentElement.clientHeight);
 * var wnd = new mxWindow('Title', frame, (w-200)/2, (h-200)/3, 200, 200);
 * wnd.setVisible(true);
 * (end)
 * 
 * To limit the movement of a window, eg. to keep it from being moved beyond
 * the top, left corner the following method can be overridden (recommended):
 * 
 * (code)
 * wnd.setLocation = function(x, y)
 * {
 *   x = Math.max(0, x);
 *   y = Math.max(0, y);
 *   mxWindow.prototype.setLocation.apply(this, arguments);
 * };
 * (end)
 * 
 * Or the following event handler can be used:
 * 
 * (code)
 * wnd.addListener(mxEvent.MOVE, function(e)
 * {
 *   wnd.setLocation(Math.max(0, wnd.getX()), Math.max(0, wnd.getY()));
 * });
 * (end)
 * 
 * To keep a window inside the current window:
 * 
 * (code)
 * mxEvent.addListener(window, 'resize', mxUtils.bind(this, function()
 * {
 *   var iw = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
 *   var ih = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
 *   
 *   var x = this.window.getX();
 *   var y = this.window.getY();
 *   
 *   if (x + this.window.table.clientWidth > iw)
 *   {
 *     x = Math.max(0, iw - this.window.table.clientWidth);
 *   }
 *   
 *   if (y + this.window.table.clientHeight > ih)
 *   {
 *     y = Math.max(0, ih - this.window.table.clientHeight);
 *   }
 *   
 *   if (this.window.getX() != x || this.window.getY() != y)
 *   {
 *     this.window.setLocation(x, y);
 *   }
 * }));
 * (end)
 *
 * Event: mxEvent.MOVE_START
 *
 * Fires before the window is moved. The <code>event</code> property contains
 * the corresponding mouse event.
 *
 * Event: mxEvent.MOVE
 *
 * Fires while the window is being moved. The <code>event</code> property
 * contains the corresponding mouse event.
 *
 * Event: mxEvent.MOVE_END
 *
 * Fires after the window is moved. The <code>event</code> property contains
 * the corresponding mouse event.
 *
 * Event: mxEvent.RESIZE_START
 *
 * Fires before the window is resized. The <code>event</code> property contains
 * the corresponding mouse event.
 *
 * Event: mxEvent.RESIZE
 *
 * Fires while the window is being resized. The <code>event</code> property
 * contains the corresponding mouse event.
 *
 * Event: mxEvent.RESIZE_END
 *
 * Fires after the window is resized. The <code>event</code> property contains
 * the corresponding mouse event.
 *
 * Event: mxEvent.MAXIMIZE
 * 
 * Fires after the window is maximized. The <code>event</code> property
 * contains the corresponding mouse event.
 * 
 * Event: mxEvent.MINIMIZE
 * 
 * Fires after the window is minimized. The <code>event</code> property
 * contains the corresponding mouse event.
 * 
 * Event: mxEvent.NORMALIZE
 * 
 * Fires after the window is normalized, that is, it returned from
 * maximized or minimized state. The <code>event</code> property contains the
 * corresponding mouse event.
 *  
 * Event: mxEvent.ACTIVATE
 * 
 * Fires after a window is activated. The <code>previousWindow</code> property
 * contains the previous window. The event sender is the active window.
 * 
 * Event: mxEvent.SHOW
 * 
 * Fires after the window is shown. This event has no properties.
 * 
 * Event: mxEvent.HIDE
 * 
 * Fires after the window is hidden. This event has no properties.
 * 
 * Event: mxEvent.CLOSE
 * 
 * Fires before the window is closed. The <code>event</code> property contains
 * the corresponding mouse event.
 * 
 * Event: mxEvent.DESTROY
 * 
 * Fires before the window is destroyed. This event has no properties.
 * 
 * Constructor: mxWindow
 * 
 * Constructs a new window with the given dimension and title to display
 * the specified content. The window elements use the given style as a
 * prefix for the classnames of the respective window elements, namely,
 * the window title and window pane. The respective postfixes are appended
 * to the given stylename as follows:
 * 
 *   style - Base style for the window.
 *   style+Title - Style for the window title.
 *   style+Pane - Style for the window pane.
 * 
 * The default value for style is mxWindow, resulting in the following
 * classnames for the window elements: mxWindow, mxWindowTitle and
 * mxWindowPane.
 * 
 * If replaceNode is given then the window replaces the given DOM node in
 * the document.
 * 
 * Parameters:
 * 
 * title - String that represents the title of the new window.
 * content - DOM node that is used as the window content.
 * x - X-coordinate of the window location.
 * y - Y-coordinate of the window location.
 * width - Width of the window.
 * height - Optional height of the window. Default is to match the height
 * of the content at the specified width.
 * minimizable - Optional boolean indicating if the window is minimizable.
 * Default is true.
 * movable - Optional boolean indicating if the window is movable. Default
 * is true.
 * replaceNode - Optional DOM node that the window should replace.
 * style - Optional base classname for the window elements. Default is
 * mxWindow.
 */
function mxWindow(title, content, x, y, width, height, minimizable, movable, replaceNode, style)
{
	if (content != null)
	{
		minimizable = (minimizable != null) ? minimizable : true;
		this.content = content;
		this.init(x, y, width, height, style);
		
		this.installMaximizeHandler();
		this.installMinimizeHandler();
		this.installCloseHandler();
		this.setMinimizable(minimizable);
		this.setTitle(title);
		
		if (movable == null || movable)
		{
			this.installMoveHandler();
		}

		if (replaceNode != null && replaceNode.parentNode != null)
		{
			replaceNode.parentNode.replaceChild(this.div, replaceNode);
		}
		else
		{
			document.body.appendChild(this.div);
		}
	}
};

/**
 * Extends mxEventSource.
 */
mxWindow.prototype = new mxEventSource();
mxWindow.prototype.constructor = mxWindow;

/**
 * Variable: closeImage
 * 
 * URL of the image to be used for the close icon in the titlebar.
 */
mxWindow.prototype.closeImage = mxClient.imageBasePath + '/close.gif';

/**
 * Variable: minimizeImage
 * 
 * URL of the image to be used for the minimize icon in the titlebar.
 */
mxWindow.prototype.minimizeImage = mxClient.imageBasePath + '/minimize.gif';
	
/**
 * Variable: normalizeImage
 * 
 * URL of the image to be used for the normalize icon in the titlebar.
 */
mxWindow.prototype.normalizeImage = mxClient.imageBasePath + '/normalize.gif';
	
/**
 * Variable: maximizeImage
 * 
 * URL of the image to be used for the maximize icon in the titlebar.
 */
mxWindow.prototype.maximizeImage = mxClient.imageBasePath + '/maximize.gif';

/**
 * Variable: resizeImage
 * 
 * URL of the image to be used for the resize icon.
 */
mxWindow.prototype.resizeImage = mxClient.imageBasePath + '/resize.gif';

/**
 * Variable: visible
 * 
 * Boolean flag that represents the visible state of the window.
 */
mxWindow.prototype.visible = false;

/**
 * Variable: minimumSize
 * 
 * <mxRectangle> that specifies the minimum width and height of the window.
 * Default is (50, 40).
 */
mxWindow.prototype.minimumSize = new mxRectangle(0, 0, 50, 40);

/**
 * Variable: destroyOnClose
 * 
 * Specifies if the window should be destroyed when it is closed. If this
 * is false then the window is hidden using <setVisible>. Default is true.
 */
mxWindow.prototype.destroyOnClose = true;

/**
 * Variable: contentHeightCorrection
 * 
 * Defines the correction factor for computing the height of the contentWrapper.
 * Default is 6 for IE 7/8 standards mode and 2 for all other browsers and modes.
 */
mxWindow.prototype.contentHeightCorrection = (document.documentMode == 8 || document.documentMode == 7) ? 6 : 2;

/**
 * Variable: title
 * 
 * Reference to the DOM node (TD) that contains the title.
 */
mxWindow.prototype.title = null;

/**
 * Variable: content
 * 
 * Reference to the DOM node that represents the window content.
 */
mxWindow.prototype.content = null;

/**
 * Function: init
 * 
 * Initializes the DOM tree that represents the window.
 */
mxWindow.prototype.init = function(x, y, width, height, style)
{
	style = (style != null) ? style : 'mxWindow';
	
	this.div = document.createElement('div');
	this.div.className = style;

	this.div.style.left = x + 'px';
	this.div.style.top = y + 'px';
	this.table = document.createElement('table');
	this.table.className = style;

	// Disables built-in pan and zoom in IE10 and later
	if (mxClient.IS_POINTER)
	{
		this.div.style.touchAction = 'none';
	}
	
	// Workaround for table size problems in FF
	if (width != null)
	{
		this.div.style.width = width + 'px'; 
		this.table.style.width = width + 'px';
	} 
	
	if (height != null)
	{
		this.div.style.height = height + 'px';
		this.table.style.height = height + 'px';
	}		
	
	// Creates title row
	var tbody = document.createElement('tbody');
	var tr = document.createElement('tr');
	
	this.title = document.createElement('td');
	this.title.className = style + 'Title';
	
	this.buttons = document.createElement('div');
	this.buttons.style.position = 'absolute';
	this.buttons.style.display = 'inline-block';
	this.buttons.style.right = '4px';
	this.buttons.style.top = '5px';
	this.title.appendChild(this.buttons);
	
	tr.appendChild(this.title);
	tbody.appendChild(tr);
	
	// Creates content row and table cell
	tr = document.createElement('tr');
	this.td = document.createElement('td');
	this.td.className = style + 'Pane';
	
	if (document.documentMode == 7)
	{
		this.td.style.height = '100%';
	}

	this.contentWrapper = document.createElement('div');
	this.contentWrapper.className = style + 'Pane';
	this.contentWrapper.style.width = '100%';
	this.contentWrapper.appendChild(this.content);

	// Workaround for div around div restricts height
	// of inner div if outerdiv has hidden overflow
	if (this.content.nodeName.toUpperCase() != 'DIV')
	{
		this.contentWrapper.style.height = '100%';
	}

	// Puts all content into the DOM
	this.td.appendChild(this.contentWrapper);
	tr.appendChild(this.td);
	tbody.appendChild(tr);
	this.table.appendChild(tbody);
	this.div.appendChild(this.table);
	
	// Puts the window on top of other windows when clicked
	var activator = mxUtils.bind(this, function(evt)
	{
		this.activate();
	});
	
	mxEvent.addGestureListeners(this.title, activator);
	mxEvent.addGestureListeners(this.table, activator);

	this.hide();
};

/**
 * Function: setTitle
 * 
 * Sets the window title to the given string. HTML markup inside the title
 * will be escaped.
 */
mxWindow.prototype.setTitle = function(title)
{
	// Removes all text content nodes (normally just one)
	var child = this.title.firstChild;
	
	while (child != null)
	{
		var next = child.nextSibling;
		
		if (child.nodeType == mxConstants.NODETYPE_TEXT)
		{
			child.parentNode.removeChild(child);
		}
		
		child = next;
	}
	
	mxUtils.write(this.title, title || '');
	this.title.appendChild(this.buttons);
};

/**
 * Function: setScrollable
 * 
 * Sets if the window contents should be scrollable.
 */
mxWindow.prototype.setScrollable = function(scrollable)
{
	// Workaround for hang in Presto 2.5.22 (Opera 10.5)
	if (navigator.userAgent == null ||
		navigator.userAgent.indexOf('Presto/2.5') < 0)
	{
		if (scrollable)
		{
			this.contentWrapper.style.overflow = 'auto';
		}
		else
		{
			this.contentWrapper.style.overflow = 'hidden';
		}
	}
};

/**
 * Function: activate
 * 
 * Puts the window on top of all other windows.
 */
mxWindow.prototype.activate = function()
{
	if (mxWindow.activeWindow != this)
	{
		var style = mxUtils.getCurrentStyle(this.getElement());
		var index = (style != null) ? style.zIndex : 3;

		if (mxWindow.activeWindow)
		{
			var elt = mxWindow.activeWindow.getElement();
			
			if (elt != null && elt.style != null)
			{
				elt.style.zIndex = index;
			}
		}
		
		var previousWindow = mxWindow.activeWindow;
		this.getElement().style.zIndex = parseInt(index) + 1;
		mxWindow.activeWindow = this;
		
		this.fireEvent(new mxEventObject(mxEvent.ACTIVATE, 'previousWindow', previousWindow));
	}
};

/**
 * Function: getElement
 * 
 * Returuns the outermost DOM node that makes up the window.
 */
mxWindow.prototype.getElement = function()
{
	return this.div;
};

/**
 * Function: fit
 * 
 * Makes sure the window is inside the client area of the window.
 */
mxWindow.prototype.fit = function()
{
	mxUtils.fit(this.div);
};

/**
 * Function: isResizable
 * 
 * Returns true if the window is resizable.
 */
mxWindow.prototype.isResizable = function()
{
	if (this.resize != null)
	{
		return this.resize.style.display != 'none';
	}
	
	return false;
};

/**
 * Function: setResizable
 * 
 * Sets if the window should be resizable. To avoid interference with some
 * built-in features of IE10 and later, the use of the following code is
 * recommended if there are resizable <mxWindow>s in the page:
 * 
 * (code)
 * if (mxClient.IS_POINTER)
 * {
 *   document.body.style.msTouchAction = 'none';
 * }
 * (end)
 */
mxWindow.prototype.setResizable = function(resizable)
{
	if (resizable)
	{
		if (this.resize == null)
		{
			this.resize = document.createElement('img');
			this.resize.style.position = 'absolute';
			this.resize.style.bottom = '0px';
			this.resize.style.right = '0px';
			this.resize.style.zIndex = '2';

			this.resize.setAttribute('src', this.resizeImage);
			this.resize.style.cursor = 'nwse-resize';
			
			var startX = null;
			var startY = null;
			var width = null;
			var height = null;
			
			var start = mxUtils.bind(this, function(evt)
			{
				// LATER: pointerdown starting on border of resize does start
				// the drag operation but does not fire consecutive events via
				// one of the listeners below (does pan instead).
				// Workaround: document.body.style.msTouchAction = 'none'
				this.activate();
				startX = mxEvent.getClientX(evt);
				startY = mxEvent.getClientY(evt);
				width = this.div.offsetWidth;
				height = this.div.offsetHeight;
				
				mxEvent.addGestureListeners(document, null, dragHandler, dropHandler);
				this.fireEvent(new mxEventObject(mxEvent.RESIZE_START, 'event', evt));
				mxEvent.consume(evt);
			});

			// Adds a temporary pair of listeners to intercept
			// the gesture event in the document
			var dragHandler = mxUtils.bind(this, function(evt)
			{
				if (startX != null && startY != null)
				{
					var dx = mxEvent.getClientX(evt) - startX;
					var dy = mxEvent.getClientY(evt) - startY;
	
					this.setSize(width + dx, height + dy);
	
					this.fireEvent(new mxEventObject(mxEvent.RESIZE, 'event', evt));
					mxEvent.consume(evt);
				}
			});
			
			var dropHandler = mxUtils.bind(this, function(evt)
			{
				if (startX != null && startY != null)
				{
					startX = null;
					startY = null;
					mxEvent.removeGestureListeners(document, null, dragHandler, dropHandler);
					this.fireEvent(new mxEventObject(mxEvent.RESIZE_END, 'event', evt));
					mxEvent.consume(evt);
				}
			});
			
			mxEvent.addGestureListeners(this.resize, start, dragHandler, dropHandler);
			this.div.appendChild(this.resize);
		}
		else 
		{
			this.resize.style.display = 'inline';
		}
	}
	else if (this.resize != null)
	{
		this.resize.style.display = 'none';
	}
};
	
/**
 * Function: setSize
 * 
 * Sets the size of the window.
 */
mxWindow.prototype.setSize = function(width, height)
{
	width = Math.max(this.minimumSize.width, width);
	height = Math.max(this.minimumSize.height, height);

	// Workaround for table size problems in FF
	this.div.style.width =  width + 'px';
	this.div.style.height = height + 'px';
	
	this.table.style.width =  width + 'px';
	this.table.style.height = height + 'px';

	this.contentWrapper.style.height = (this.div.offsetHeight -
		this.title.offsetHeight - this.contentHeightCorrection) + 'px';
};
	
/**
 * Function: setMinimizable
 * 
 * Sets if the window is minimizable.
 */
mxWindow.prototype.setMinimizable = function(minimizable)
{
	this.minimizeImg.style.display = (minimizable) ? '' : 'none';
};

/**
 * Function: getMinimumSize
 * 
 * Returns an <mxRectangle> that specifies the size for the minimized window.
 * A width or height of 0 means keep the existing width or height. This
 * implementation returns the height of the window title and keeps the width.
 */
mxWindow.prototype.getMinimumSize = function()
{
	return new mxRectangle(0, 0, 0, this.title.offsetHeight);
};

/**
 * Function: toggleMinimized
 * 
 * Minimizes the window.
 */
mxWindow.prototype.toggleMinimized = function(evt)
{
	this.activate();
	
	if (!this.minimized)
	{
		this.minimized = true;
		
		this.minimizeImg.setAttribute('src', this.normalizeImage);
		this.minimizeImg.setAttribute('title', 'Normalize');
		this.contentWrapper.style.display = 'none';
		this.maxDisplay = this.maximize.style.display;
		
		this.maximize.style.display = 'none';
		this.height = this.table.style.height;
		
		var minSize = this.getMinimumSize();
		
		if (minSize.height > 0)
		{
			this.div.style.height = minSize.height + 'px';
			this.table.style.height = minSize.height + 'px';
		}
		
		if (minSize.width > 0)
		{
			this.div.style.width = minSize.width + 'px';
			this.table.style.width = minSize.width + 'px';
		}
		
		if (this.resize != null)
		{
			this.resize.style.visibility = 'hidden';
		}
		
		this.fireEvent(new mxEventObject(mxEvent.MINIMIZE, 'event', evt));
	}
	else
	{
		this.minimized = false;
		
		this.minimizeImg.setAttribute('src', this.minimizeImage);
		this.minimizeImg.setAttribute('title', 'Minimize');
		this.contentWrapper.style.display = ''; // default
		this.maximize.style.display = this.maxDisplay;
		
		this.div.style.height = this.height;
		this.table.style.height = this.height;

		if (this.resize != null)
		{
			this.resize.style.visibility = '';
		}
		
		this.fireEvent(new mxEventObject(mxEvent.NORMALIZE, 'event', evt));
	}
};

/**
 * Function: installMinimizeHandler
 * 
 * Installs the event listeners required for minimizing the window.
 */
mxWindow.prototype.installMinimizeHandler = function()
{
	this.minimizeImg = document.createElement('img');
	
	this.minimizeImg.setAttribute('src', this.minimizeImage);
	this.minimizeImg.setAttribute('title', 'Minimize');
	this.minimizeImg.style.cursor = 'pointer';
	this.minimizeImg.style.marginLeft = '2px';
	this.minimizeImg.style.display = 'none';
	
	this.buttons.appendChild(this.minimizeImg);
	
	this.minimized = false;
	this.maxDisplay = null;
	this.height = null;

	var funct = mxUtils.bind(this, function(evt)
	{
		this.toggleMinimized(evt);
		mxEvent.consume(evt);
	});
	
	mxEvent.addGestureListeners(this.minimizeImg, funct);
};
	
/**
 * Function: setMaximizable
 * 
 * Sets if the window is maximizable.
 */
mxWindow.prototype.setMaximizable = function(maximizable)
{
	this.maximize.style.display = (maximizable) ? '' : 'none';
};

/**
 * Function: installMaximizeHandler
 * 
 * Installs the event listeners required for maximizing the window.
 */
mxWindow.prototype.installMaximizeHandler = function()
{
	this.maximize = document.createElement('img');
	
	this.maximize.setAttribute('src', this.maximizeImage);
	this.maximize.setAttribute('title', 'Maximize');
	this.maximize.style.cursor = 'default';
	this.maximize.style.marginLeft = '2px';
	this.maximize.style.cursor = 'pointer';
	this.maximize.style.display = 'none';
	
	this.buttons.appendChild(this.maximize);
	
	var maximized = false;
	var x = null;
	var y = null;
	var height = null;
	var width = null;
	var minDisplay = null;

	var funct = mxUtils.bind(this, function(evt)
	{
		this.activate();
		
		if (this.maximize.style.display != 'none')
		{
			if (!maximized)
			{
				maximized = true;
				
				this.maximize.setAttribute('src', this.normalizeImage);
				this.maximize.setAttribute('title', 'Normalize');
				this.contentWrapper.style.display = '';
				minDisplay = this.minimizeImg.style.display;
				this.minimizeImg.style.display = 'none';
				
				// Saves window state
				x = parseInt(this.div.style.left);
				y = parseInt(this.div.style.top);
				height = this.table.style.height;
				width = this.table.style.width;

				this.div.style.left = '0px';
				this.div.style.top = '0px';
				var docHeight = Math.max(document.body.clientHeight || 0, document.documentElement.clientHeight || 0);

				this.div.style.width = (document.body.clientWidth - 2) + 'px';
				this.div.style.height = (docHeight - 2) + 'px';

				this.table.style.width = (document.body.clientWidth - 2) + 'px';
				this.table.style.height = (docHeight - 2) + 'px';
				
				if (this.resize != null)
				{
					this.resize.style.visibility = 'hidden';
				}

				var style = mxUtils.getCurrentStyle(this.contentWrapper);
	
				if (style.overflow == 'auto' || this.resize != null)
				{
					this.contentWrapper.style.height = (this.div.offsetHeight -
						this.title.offsetHeight - this.contentHeightCorrection) + 'px';
				}

				this.fireEvent(new mxEventObject(mxEvent.MAXIMIZE, 'event', evt));
			}
			else
			{
				maximized = false;
				
				this.maximize.setAttribute('src', this.maximizeImage);
				this.maximize.setAttribute('title', 'Maximize');
				this.contentWrapper.style.display = '';
				this.minimizeImg.style.display = minDisplay;

				// Restores window state
				this.div.style.left = x+'px';
				this.div.style.top = y+'px';

				this.div.style.height = height;
				this.div.style.width = width;

				var style = mxUtils.getCurrentStyle(this.contentWrapper);
	
				if (style.overflow == 'auto' || this.resize != null)
				{
					this.contentWrapper.style.height = (this.div.offsetHeight -
						this.title.offsetHeight - this.contentHeightCorrection) + 'px';
				}
				
				this.table.style.height = height;
				this.table.style.width = width;

				if (this.resize != null)
				{
					this.resize.style.visibility = '';
				}
				
				this.fireEvent(new mxEventObject(mxEvent.NORMALIZE, 'event', evt));
			}
			
			mxEvent.consume(evt);
		}
	});
	
	mxEvent.addGestureListeners(this.maximize, funct);
	mxEvent.addListener(this.title, 'dblclick', funct);
};
	
/**
 * Function: installMoveHandler
 * 
 * Installs the event listeners required for moving the window.
 */
mxWindow.prototype.installMoveHandler = function()
{
	this.title.style.cursor = 'move';
	
	mxEvent.addGestureListeners(this.title,
		mxUtils.bind(this, function(evt)
		{
			var startX = mxEvent.getClientX(evt);
			var startY = mxEvent.getClientY(evt);
			var x = this.getX();
			var y = this.getY();
						
			// Adds a temporary pair of listeners to intercept
			// the gesture event in the document
			var dragHandler = mxUtils.bind(this, function(evt)
			{
				var dx = mxEvent.getClientX(evt) - startX;
				var dy = mxEvent.getClientY(evt) - startY;
				this.setLocation(x + dx, y + dy);
				this.fireEvent(new mxEventObject(mxEvent.MOVE, 'event', evt));
				mxEvent.consume(evt);
			});
			
			var dropHandler = mxUtils.bind(this, function(evt)
			{
				mxEvent.removeGestureListeners(document, null, dragHandler, dropHandler);
				this.fireEvent(new mxEventObject(mxEvent.MOVE_END, 'event', evt));
				mxEvent.consume(evt);
			});
			
			mxEvent.addGestureListeners(document, null, dragHandler, dropHandler);
			this.fireEvent(new mxEventObject(mxEvent.MOVE_START, 'event', evt));
			mxEvent.consume(evt);
		}));
	
	// Disables built-in pan and zoom in IE10 and later
	if (mxClient.IS_POINTER)
	{
		this.title.style.touchAction = 'none';
	}
};

/**
 * Function: setLocation
 * 
 * Sets the upper, left corner of the window.
 */
 mxWindow.prototype.setLocation = function(x, y)
 {
	this.div.style.left = x + 'px';
	this.div.style.top = y + 'px';
 };

/**
 * Function: getX
 *
 * Returns the current position on the x-axis.
 */
mxWindow.prototype.getX = function()
{
	return parseInt(this.div.style.left);
};

/**
 * Function: getY
 *
 * Returns the current position on the y-axis.
 */
mxWindow.prototype.getY = function()
{
	return parseInt(this.div.style.top);
};

/**
 * Function: installCloseHandler
 *
 * Adds the <closeImage> as a new image node in <closeImg> and installs the
 * <close> event.
 */
mxWindow.prototype.installCloseHandler = function()
{
	this.closeImg = document.createElement('img');
	
	this.closeImg.setAttribute('src', this.closeImage);
	this.closeImg.setAttribute('title', 'Close');
	this.closeImg.style.marginLeft = '2px';
	this.closeImg.style.cursor = 'pointer';
	this.closeImg.style.display = 'none';
	
	this.buttons.appendChild(this.closeImg);

	mxEvent.addGestureListeners(this.closeImg,
		mxUtils.bind(this, function(evt)
		{
			this.fireEvent(new mxEventObject(mxEvent.CLOSE, 'event', evt));
			
			if (this.destroyOnClose)
			{
				this.destroy();
			}
			else
			{
				this.setVisible(false);
			}
			
			mxEvent.consume(evt);
		}));
};

/**
 * Function: setImage
 * 
 * Sets the image associated with the window.
 * 
 * Parameters:
 * 
 * image - URL of the image to be used.
 */
mxWindow.prototype.setImage = function(image)
{
	this.image = document.createElement('img');
	this.image.setAttribute('src', image);
	this.image.setAttribute('align', 'left');
	this.image.style.marginRight = '4px';
	this.image.style.marginLeft = '0px';
	this.image.style.marginTop = '-2px';
	
	this.title.insertBefore(this.image, this.title.firstChild);
};

/**
 * Function: setClosable
 * 
 * Sets the image associated with the window.
 * 
 * Parameters:
 * 
 * closable - Boolean specifying if the window should be closable.
 */
mxWindow.prototype.setClosable = function(closable)
{
	this.closeImg.style.display = (closable) ? '' : 'none';
};

/**
 * Function: isVisible
 * 
 * Returns true if the window is visible.
 */
mxWindow.prototype.isVisible = function()
{
	if (this.div != null)
	{
		return this.div.style.display != 'none';
	}
	
	return false;
};

/**
 * Function: setVisible
 *
 * Shows or hides the window depending on the given flag.
 * 
 * Parameters:
 * 
 * visible - Boolean indicating if the window should be made visible.
 */
mxWindow.prototype.setVisible = function(visible)
{
	if (this.div != null)
	{
		if (this.isVisible() != visible)
		{
			if (visible)
			{
				this.show();
			}
			else
			{
				this.hide();
			}
		}
		else
		{
			this.fireEvent(new mxEventObject((visible) ?
				mxEvent.SHOW : mxEvent.HIDE));
		}
	}
};

/**
 * Function: show
 *
 * Shows the window.
 */
mxWindow.prototype.show = function()
{
	this.div.style.display = '';
	this.activate();
	
	var style = mxUtils.getCurrentStyle(this.contentWrapper);
	
	if ((style.overflow == 'auto' || this.resize != null) &&
		this.contentWrapper.style.display != 'none')
	{
		this.contentWrapper.style.height = (this.div.offsetHeight -
				this.title.offsetHeight - this.contentHeightCorrection) + 'px';
	}
	
	this.fireEvent(new mxEventObject(mxEvent.SHOW));
};

/**
 * Function: hide
 *
 * Hides the window.
 */
mxWindow.prototype.hide = function()
{
	this.div.style.display = 'none';
	this.fireEvent(new mxEventObject(mxEvent.HIDE));
};

/**
 * Function: destroy
 *
 * Destroys the window and removes all associated resources. Fires a
 * <destroy> event prior to destroying the window.
 */
mxWindow.prototype.destroy = function()
{
	this.fireEvent(new mxEventObject(mxEvent.DESTROY));
	
	if (this.div != null)
	{
		mxEvent.release(this.div);
		this.div.parentNode.removeChild(this.div);
		this.div = null;
	}
	
	this.title = null;
	this.content = null;
	this.contentWrapper = null;
};
