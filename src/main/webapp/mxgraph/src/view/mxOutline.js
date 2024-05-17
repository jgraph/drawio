/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: mxOutline
 *
 * Implements an outline (aka overview) for a graph. Set <updateOnPan> to true
 * to enable updates while the source graph is panning.
 * 
 * Example:
 * 
 * (code)
 * var outline = new mxOutline(graph, div);
 * (end)
 * 
 * If an outline is used in an <mxWindow> in IE8 standards mode, the following
 * code makes sure that the shadow filter is not inherited and that any
 * transparent elements in the graph do not show the page background, but the
 * background of the graph container.
 * 
 * (code)
 * if (document.documentMode == 8)
 * {
 *   container.style.filter = 'progid:DXImageTransform.Microsoft.alpha(opacity=100)';
 * }
 * (end)
 * 
 * To move the graph to the top, left corner the following code can be used.
 * 
 * (code)
 * var scale = graph.view.scale;
 * var bounds = graph.getGraphBounds();
 * graph.view.setTranslate(-bounds.x / scale, -bounds.y / scale);
 * (end)
 * 
 * To toggle the suspended mode, the following can be used.
 * 
 * (code)
 * outline.setSuspended(!outline.isSuspended());
 * (end)
 * 
 * Constructor: mxOutline
 *
 * Constructs a new outline for the specified graph inside the given
 * container.
 * 
 * Parameters:
 * 
 * source - <mxGraph> to create the outline for.
 * container - DOM node that will contain the outline.
 */
function mxOutline(source, container)
{
	this.source = source;

	if (container != null)
	{
		this.init(container);
	}
};

/**
 * Function: source
 * 
 * Reference to the source <mxGraph>.
 */
mxOutline.prototype.source = null;

/**
 * Function: container
 * 
 * Reference to the DOM node containing the outline.
 */
mxOutline.prototype.container = null;

/**
 * Function: enabled
 * 
 * Reference to the <mxGraph> that renders the outline.
 */
mxOutline.prototype.enabled = true;

/**
 * Variable: suspended
 * 
 * Optional boolean flag to suspend updates. Default is false.
 */
mxOutline.prototype.suspended = false;

/**
 * Variable: border
 * 
 * Border to be added at the bottom and right. Default is 10.
 */
mxOutline.prototype.border = 14;

/**
 * Variable: opacity
 */
mxOutline.prototype.opacity = (mxClient.IS_IE11) ? 0.9 : 0.7;

/**
 * Function: init
 * 
 * Initializes the outline inside the given container.
 */
mxOutline.prototype.init = function(container)
{
	this.container = container;

	this.updateHandler = mxUtils.bind(this, function(sender, evt)
	{
		this.update(true);
	});
	
	// Updates the scale of the outline after a change of the main graph
	this.source.getModel().addListener(mxEvent.CHANGE, this.updateHandler);
	this.source.addListener(mxEvent.REFRESH, this.updateHandler);
		
	// Adds listeners to keep the outline in sync with the source graph
	var view = this.source.getView();
	view.addListener(mxEvent.UP, this.updateHandler);
	view.addListener(mxEvent.DOWN, this.updateHandler);
	view.addListener(mxEvent.SCALE, this.updateHandler);
	view.addListener(mxEvent.TRANSLATE, this.updateHandler);
	view.addListener(mxEvent.SCALE_AND_TRANSLATE, this.updateHandler);
	
	this.scrollHandler = mxUtils.bind(this, function(sender, evt)
	{
		this.update(false);
	});
	
	// Updates blue rectangle on scroll
	mxEvent.addListener(this.source.container, 'scroll', this.scrollHandler);
	this.source.addListener(mxEvent.PAN, this.scrollHandler);
	this.update(true);
};

/**
 * Function: isEnabled
 * 
 * Returns true if events are handled. This implementation
 * returns <enabled>.
 */
mxOutline.prototype.isEnabled = function()
{
	return this.enabled;
};

/**
 * Function: setEnabled
 * 
 * Enables or disables event handling. This implementation
 * updates <enabled>.
 * 
 * Parameters:
 * 
 * value - Boolean that specifies the new enabled state.
 */
mxOutline.prototype.setEnabled = function(value)
{
	this.enabled = value;
};

/**
 * Function: isSuspended
 * 
 * Returns true if events are handled. This implementation
 * returns <enabled>.
 */
mxOutline.prototype.isSuspended = function()
{
	return this.suspended;
};

/**
 * Function: setSuspended
 * 
 * Enables or disables event handling. This implementation
 * updates <enabled>.
 * 
 * Parameters:
 * 
 * value - Boolean that specifies the new enabled state.
 */
mxOutline.prototype.setSuspended = function(value)
{
	this.suspended = value;
	this.update(true);
};

/**
 * Function: isScrolling
 * 
 * Returns true if scrollbars should be used for panning.
 */
mxOutline.prototype.isScrolling = function()
{
	return this.source.useScrollbarsForPanning &&
		mxUtils.hasScrollbars(this.source.container);
};

/**
 * Function: createSvg
 * 
 * Updates the outline.
 */
mxOutline.prototype.createSvg = function()
{
	var root = document.createElementNS(mxConstants.NS_SVG, 'svg');
	root.style.position = 'absolute';
	root.style.left = '0px';
	root.style.top = '0px';
	root.style.width = '100%';
	root.style.height = '100%';
	root.style.display = 'block';
	root.style.padding = this.border + 'px';
	root.style.boxSizing = 'border-box';
	root.style.overflow = 'visible';
	root.style.cursor = 'default';
	
	root.setAttribute('shape-rendering', 'optimizeSpeed');
	root.setAttribute('image-rendering', 'optimizeSpeed');
	
	return root;
};

/**
 * Function: processSvg
 * 
 * Updates the outline.
 */
mxOutline.prototype.addGestureListeners = function(svg)
{
	var p0 = null;
	var x0 = 0;
	var y0 = 0;
	var s = 1;
	
	var start = mxUtils.bind(this, function(evt)
	{
		if (this.isEnabled())
		{
			p0 = new mxPoint(mxEvent.getClientX(evt), mxEvent.getClientY(evt));
			var w = svg.clientWidth - 2 * this.border;
			var h = svg.clientHeight - 2 * this.border;
			var b = this.getViewBox();
			
			s = Math.max(b.width / w, b.height / h);

			// Sets initial position if outside viewport
			if (mxEvent.getSource(evt) != this.viewport)
			{						
				if (this.isScrolling())
				{
					var dx = w - b.width / s;
					var dy = h - b.height / s;
					var r = this.svg.getBoundingClientRect();
					this.source.container.scrollLeft = b.x - dx * s / 2 +
						(p0.x - this.border - r.left) * s;
					this.source.container.scrollTop = b.y - dy * s / 2 +
						(p0.y - this.border - r.top) * s;
				}
				else
				{
					var t = this.source.view.translate;
					var v = this.viewport.getBoundingClientRect();
					var dx = (mxEvent.getClientX(evt) - v.left) * s / this.source.view.scale;
					var dy = (mxEvent.getClientY(evt) - v.top) * s / this.source.view.scale;
					this.source.getView().setTranslate(t.x - dx, t.y - dy);
					this.source.panGraph(0, 0);
				}
			}
			
			mxEvent.addGestureListeners(document, null, dragHandler, dropHandler);
			x0 = this.source.container.scrollLeft;
			y0 = this.source.container.scrollTop;
			mxEvent.consume(evt);
		}
	});

	// Adds a temporary pair of listeners to intercept the gesture in the document
	var dragHandler = mxUtils.bind(this, function(evt)
	{
		if (this.isEnabled() && p0 != null)
		{
			if (this.isScrolling())
			{
				this.source.container.scrollLeft = x0 +
					(mxEvent.getClientX(evt) - p0.x) * s;
				this.source.container.scrollTop = y0 +
					(mxEvent.getClientY(evt) - p0.y) * s;
			}
			else
			{			
				this.source.panGraph((p0.x - mxEvent.getClientX(evt)) * s,
					(p0.y - mxEvent.getClientY(evt)) * s);
			}
			
			mxEvent.consume(evt);
		}
	});
	
	var dropHandler = mxUtils.bind(this, function(evt)
	{
		if (this.isEnabled() && p0 != null)
		{
			if (!this.isScrolling())
			{
				var dx = (mxEvent.getClientX(evt) - p0.x) * s / this.source.view.scale;
				var dy = (mxEvent.getClientY(evt) - p0.y) * s / this.source.view.scale;
				var t = this.source.view.translate;
				this.source.getView().setTranslate(t.x - dx, t.y - dy);
				this.source.panGraph(0, 0);
			}
		
			mxEvent.removeGestureListeners(document, null, dragHandler, dropHandler);
			mxEvent.consume(evt);
			p0 = null;
		}
	});
	
	mxEvent.addGestureListeners(svg, start, dragHandler, dropHandler);
};

/**
 * Function: getViewBox
 *
 * Returns the rectangle that is used for clipping the svg tree.
 */
mxOutline.prototype.getViewBox = function()
{
	return this.source.getGraphBounds();
};

/**
 * Function: updateSvg
 * 
 * Returns the graph bound boxing of the source.
 */
mxOutline.prototype.updateSvg = function()
{
	if (this.svg == null)
	{
		this.svg = this.createSvg();
		this.addGestureListeners(this.svg);
		this.container.appendChild(this.svg);
	}

	var b = this.getViewBox();
	this.svg.setAttribute('viewBox',
		Math.round(b.x) + ' ' + Math.round(b.y) + ' ' +
		Math.round(b.width) + ' ' + Math.round(b.height));
	
	var bg = this.source.background;
	this.svg.style.backgroundColor = (bg == mxConstants.NONE) ? '' : bg;
	this.updateDrawPane();
};

/**
 * Function: updateDrawPane
 * 
 * Returns the graph bound boxing of the source.
 */
mxOutline.prototype.updateDrawPane = function()
{
	if (this.drawPane != null)
	{
		this.drawPane.parentNode.removeChild(this.drawPane);
	}
	
	this.drawPane = this.source.view.getDrawPane().cloneNode(true);
	this.drawPane.style.opacity = this.opacity;
	this.processSvg(this.drawPane);
	
	if (this.viewport != null)
	{
		this.svg.insertBefore(this.drawPane, this.viewport);
	}
	else
	{
		this.svg.appendChild(this.drawPane);
	}
};

/**
 * Function: processSvg
 * 
 * Removes cursor, hidden elements and text and fixes stroke widths and scaling.
 */
mxOutline.prototype.processSvg = function(svg)
{
	var s = (mxClient.IS_IE11) ? Math.max(1, this.source.view.scale) : this.source.view.scale;
	
	Array.prototype.slice.call(svg.getElementsByTagName('*')).forEach(
	  mxUtils.bind(this, function(item) {
		if (item.nodeName == 'text' || item.nodeName == 'foreignObject' ||
			item.getAttribute('visibility') == 'hidden' ||
			!(item instanceof SVGElement))
		{
	    	item.parentNode.removeChild(item);
		}
		else
		{
			var sw = parseInt(item.getAttribute('stroke-width') || 1);
			
			if (!isNaN(sw))
			{
				item.setAttribute('stroke-width', Math.max((mxClient.IS_IE11) ? 4 : 1, sw / (5 * s)));
			}
			
			item.setAttribute('vector-effect', 'non-scaling-stroke');
			item.style.cursor = '';
		}
	}));
};

/**
 * Function: updateViewport
 * 
 * Updates the outline.
 */
mxOutline.prototype.updateViewport = function()
{
	if (this.svg != null)
	{
		if (this.viewport == null)
		{
			this.viewport = this.createViewport();
			this.svg.appendChild(this.viewport);
		}
		
		var c = this.source.container;
		var v = new mxRectangle(c.scrollLeft, c.scrollTop, c.clientWidth, c.clientHeight);
	
		if (!this.isScrolling())
		{
			v.x = -this.source.panDx;
			v.y = -this.source.panDy;
		}
	
		this.viewport.setAttribute('x', v.x);
		this.viewport.setAttribute('y', v.y);
		this.viewport.setAttribute('width', v.width);
		this.viewport.setAttribute('height', v.height);
	}
};

/**
 * Function: createRect
 * 
 * Updates the outline.
 */
mxOutline.prototype.createViewport = function()
{
	var v = this.svg.ownerDocument.createElementNS(mxConstants.NS_SVG, 'rect');
	v.setAttribute('stroke-width', (mxClient.IS_IE11) ? '12' : '3');
	v.setAttribute('stroke', HoverIcons.prototype.arrowFill);
	v.setAttribute('fill', HoverIcons.prototype.arrowFill);
	v.setAttribute('vector-effect', 'non-scaling-stroke');
	v.setAttribute('fill-opacity', 0.2);
	v.style.cursor = 'move';
	
	return v;
};

/**
 * Function: update
 * 
 * Updates the outline.
 */
mxOutline.prototype.update = function(fullUpdate)
{
	if (this.source != null && this.source.container != null)
	{
		if (this.thread != null)
		{
			window.clearTimeout(this.thread);
			this.thread = null;
		}
		
		this.fullUpdate = this.fullUpdate || fullUpdate;
		
		this.thread = window.setTimeout(mxUtils.bind(this, function()
		{
			if (!this.isSuspended())
			{
				if (this.fullUpdate)
				{
					this.updateSvg();
				}
				
				this.updateViewport();
			}
			
			this.fullUpdate = null;
			this.thread = null;
		}), (this.isScrolling() ? 10 : 0));
	}
};

/**
 * Function: destroy
 * 
 * Destroy this outline and removes all listeners from <source>.
 */
mxOutline.prototype.destroy = function()
{
	if (this.svg != null)
	{
		this.svg.parentNode.removeChild(this.svg);
		this.svg = null;
	}
	
	if (this.source != null)
	{
		this.source.removeListener(this.scrollHandler);
		this.source.removeListener(this.updateHandler);
		this.source.getView().removeListener(this.updateHandler);
		this.source.getModel().removeListener(this.updateHandler);
		mxEvent.removeListener(this.source.container, 'scroll', this.scrollHandler);
		this.source = null;
	}
};
