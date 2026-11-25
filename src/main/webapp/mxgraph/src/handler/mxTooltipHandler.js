/**
 * Copyright (c) 2006-2015, JGraph Holdings Ltd
 * Copyright (c) 2006-2015, draw.io AG
 */
/**
 * Class: mxTooltipHandler
 * 
 * Graph event handler that displays tooltips. <mxGraph.getTooltip> is used to
 * get the tooltip for a cell or handle. This handler is built-into
 * <mxGraph.tooltipHandler> and enabled using <mxGraph.setTooltips>.
 *
 * Example:
 * 
 * (code>
 * new mxTooltipHandler(graph);
 * (end)
 * 
 * Constructor: mxTooltipHandler
 * 
 * Constructs an event handler that displays tooltips with the specified
 * delay (in milliseconds). If no delay is specified then a default delay
 * of 500 ms (0.5 sec) is used.
 * 
 * Parameters:
 * 
 * graph - Reference to the enclosing <mxGraph>.
 * delay - Optional delay in milliseconds.
 */
function mxTooltipHandler(graph, delay)
{
	if (graph != null)
	{
		this.graph = graph;
		this.delay = delay || 500;
		this.graph.addMouseListener(this);
	}
};

/**
 * Variable: zIndex
 * 
 * Specifies the zIndex for the tooltip and its shadow. Default is 10005.
 */
mxTooltipHandler.prototype.zIndex = 10005;

/**
 * Variable: graph
 * 
 * Reference to the enclosing <mxGraph>.
 */
mxTooltipHandler.prototype.graph = null;

/**
 * Variable: delay
 * 
 * Delay to show the tooltip in milliseconds. Default is 500.
 */
mxTooltipHandler.prototype.delay = null;

/**
 * Variable: ignoreTouchEvents
 * 
 * Specifies if touch and pen events should be ignored. Default is true.
 */
mxTooltipHandler.prototype.ignoreTouchEvents = true;

/**
 * Variable: showOnPenHover
 *
 * Specifies if tooltips should be shown for hovering pens (eg. Apple Pencil
 * hover) if <ignoreTouchEvents> is true. Default is true.
 */
mxTooltipHandler.prototype.showOnPenHover = true;

/**
 * Variable: hideOnHover
 * 
 * Specifies if the tooltip should be hidden if the mouse is moved over the
 * current cell. Default is false.
 */
mxTooltipHandler.prototype.hideOnHover = false;

/**
 * Variable: safeZonePadding
 * 
 * Padding in pixels of the safe zone of a tooltip with links. The safe zone
 * is the tooltip, the polygon from the point where the mouse left the cell
 * to the tooltip and the gap between the cell and the tooltip. See
 * <isInSafeZone>. Default is 4.
 */
mxTooltipHandler.prototype.safeZonePadding = 4;

/**
 * Variable: safeZoneDelay
 * 
 * Delay in milliseconds after which a tooltip with links is hidden once the
 * mouse is outside its cell and its safe zone, so that a jitter at the edge
 * does not hide it. A tooltip is also hidden after this delay once the mouse
 * has left it for anything but its cell or its safe zone, see <init>. Default
 * is 120.
 */
mxTooltipHandler.prototype.safeZoneDelay = 120;

/**
 * Variable: tooltipKept
 * 
 * True if the last mouse move left the cell of the visible tooltip with
 * links, which stays visible while the mouse is in its safe zone or until
 * <safeZoneDelay> has passed. See <isTooltipKept>.
 */
mxTooltipHandler.prototype.tooltipKept = false;

/**
 * Variable: destroyed
 * 
 * True if this handler was destroyed using <destroy>.
 */
mxTooltipHandler.prototype.destroyed = false;

/**
 * Variable: enabled
 * 
 * Specifies if events are handled. Default is false.
 */
mxTooltipHandler.prototype.enabled = false;

/**
 * Function: isEnabled
 * 
 * Returns true if events are handled. This implementation
 * returns <enabled>.
 */
mxTooltipHandler.prototype.isEnabled = function()
{
	return this.enabled;
};

/**
 * Function: setEnabled
 * 
 * Enables or disables event handling. This implementation
 * updates <enabled>.
 */
mxTooltipHandler.prototype.setEnabled = function(enabled)
{
	this.enabled = enabled;
};

/**
 * Function: isHideOnHover
 * 
 * Returns <hideOnHover>.
 */
mxTooltipHandler.prototype.isHideOnHover = function()
{
	return this.hideOnHover;
};

/**
 * Function: setHideOnHover
 * 
 * Sets <hideOnHover>.
 */
mxTooltipHandler.prototype.setHideOnHover = function(value)
{
	this.hideOnHover = value;
};

/**
 * Function: init
 * 
 * Initializes the DOM nodes required for this tooltip handler.
 */
mxTooltipHandler.prototype.init = function()
{
	if (document.body != null)
	{
		this.div = document.createElement('div');
		this.div.className = 'mxTooltip';
		this.div.style.visibility = 'hidden';

		document.body.appendChild(this.div);

		mxEvent.addGestureListeners(this.div, mxUtils.bind(this, function(evt)
		{
			// Lets clicks on links through, also on markup inside links and
			// on SVG links (lowercase, eg. typeset math with \href), but not
			// on markup that is placed outside of the tooltip
			var source = mxEvent.getSource(evt);

			while (source != null && source != this.div &&
				source.nodeName.toLowerCase() != 'a')
			{
				source = source.parentNode;
			}
			
			if (source == null || source.nodeName.toLowerCase() != 'a' ||
				!this.isInTooltip(mxEvent.getClientX(evt), mxEvent.getClientY(evt)))
			{
				this.hideTooltip();
			}
		}));

		// The tooltip is not in the container of the graph, so the graph gets
		// no mouse moves while the mouse is on it. Stops the timer of the safe
		// zone when the mouse enters the tooltip and starts it when the mouse
		// leaves the tooltip: the mouse move in the graph that follows stops
		// it again on the cell and in the safe zone, and there is no such move
		// if the mouse is outside the container (eg. on a toolbar). Uses the
		// same kind of events as the mouse moves of the graph, as the browser
		// fires the leave event before the move event of that kind.
		// The markup of a tooltip comes from the diagram and can be placed
		// outside of the tooltip (eg. with position:fixed, over the whole
		// window), where the mouse is still on a node inside the tooltip:
		// only the box of the tooltip keeps it open and such markup hides it.
		var mouseOnTooltip = mxUtils.bind(this, function(evt)
		{
			if (this.isInTooltip(mxEvent.getClientX(evt), mxEvent.getClientY(evt)))
			{
				this.resetSafeZoneTimer();
			}
			else
			{
				this.hideTooltip();
			}
		});

		mxEvent.addListener(this.div, (mxClient.IS_POINTER) ? 'pointerenter' : 'mouseenter', mouseOnTooltip);
		mxEvent.addListener(this.div, (mxClient.IS_POINTER) ? 'pointermove' : 'mousemove', mouseOnTooltip);

		mxEvent.addListener(this.div, (mxClient.IS_POINTER) ? 'pointerleave' : 'mouseleave',
			mxUtils.bind(this, function(evt)
		{
			// Ignores touch events, where the finger leaves the tooltip
			// when it is lifted (eg. after a tap on a link)
			if (!mxEvent.isTouchEvent(evt))
			{
				// Handles the next mouse move in the graph also if it is
				// at the point of the last one, to stop the timer there
				this.lastX = null;
				this.lastY = null;
				this.startSafeZoneTimer();
			}
		}));
	}
};

/**
 * Function: getStateForEvent
 * 
 * Returns the <mxCellState> to be used for showing a tooltip for this event.
 */
mxTooltipHandler.prototype.getStateForEvent = function(me)
{
	return me.getState();
};

/**
 * Function: mouseDown
 * 
 * Handles the event by initiating a rubberband selection. By consuming the
 * event all subsequent events of the gesture are redirected to this
 * handler.
 */
mxTooltipHandler.prototype.mouseDown = function(sender, me)
{
	this.reset(me, false);
	this.hideTooltip();
};

/**
 * Function: mouseMove
 * 
 * Handles the event by updating the rubberband selection.
 */
mxTooltipHandler.prototype.mouseMove = function(sender, me)
{
	if (me.getX() != this.lastX || me.getY() != this.lastY)
	{
		this.reset(me, true);
		var state = this.getStateForEvent(me);
		var onCell = !(this.isHideOnHover() || state != this.state || (me.getSource() != this.node &&
			(!this.stateSource || (state != null && this.stateSource ==
			(me.isSource(state.shape) || !me.isSource(state.text))))));
		this.tooltipKept = false;

		// Keeps a tooltip with links while the mouse is on the label or the
		// shape of its cell or in its safe zone, and hides it after a short
		// delay once the mouse has left all of them
		if (!onCell && !this.isHideOnHover() && this.isLinkTooltip())
		{
			onCell = this.stateSource && state != null && state == this.state &&
				(me.isSource(state.shape) || me.isSource(state.text));
			this.tooltipKept = true;

			if (!onCell)
			{
				if (this.isInSafeZone(me.getX(), me.getY()))
				{
					this.resetSafeZoneTimer();
				}
				else
				{
					this.startSafeZoneTimer();
				}
			}
		}

		if (onCell)
		{
			// Last point on the cell is the start of the safe polygon
			this.resetSafeZoneTimer();
			this.anchorX = me.getX();
			this.anchorY = me.getY();
		}
		else if (!this.tooltipKept)
		{
			this.hideTooltip();
		}
	}
	
	this.lastX = me.getX();
	this.lastY = me.getY();
};

/**
 * Function: isTooltipKept
 * 
 * Returns <tooltipKept>.
 */
mxTooltipHandler.prototype.isTooltipKept = function()
{
	return this.tooltipKept;
};

/**
 * Function: isLinkTooltip
 * 
 * Returns true if the tooltip is visible and contains links.
 */
mxTooltipHandler.prototype.isLinkTooltip = function()
{
	return this.div != null && this.div.style.visibility != 'hidden' &&
		this.div.getElementsByTagName('a').length > 0;
};

/**
 * Function: startSafeZoneTimer
 * 
 * Starts the timer that hides the visible tooltip after <safeZoneDelay> if
 * it is not running.
 */
mxTooltipHandler.prototype.startSafeZoneTimer = function()
{
	if (this.safeZoneThread == null && this.div != null &&
		this.div.style.visibility != 'hidden')
	{
		this.safeZoneThread = window.setTimeout(mxUtils.bind(this, function()
		{
			this.safeZoneThread = null;
			this.hideTooltip();
		}), this.safeZoneDelay);
	}
};

/**
 * Function: resetSafeZoneTimer
 * 
 * Stops the timer that hides a tooltip with links after the mouse has left
 * its safe zone.
 */
mxTooltipHandler.prototype.resetSafeZoneTimer = function()
{
	if (this.safeZoneThread != null)
	{
		window.clearTimeout(this.safeZoneThread);
		this.safeZoneThread = null;
	}
};

/**
 * Function: getCellBounds
 * 
 * Returns the bounds of the shape and the label of the cell of the tooltip
 * in client coordinates or null if they are not painted.
 */
mxTooltipHandler.prototype.getCellBounds = function()
{
	var result = null;

	if (this.state != null)
	{
		var nodes = [(this.state.shape != null) ? this.state.shape.node : null,
			(this.state.text != null) ? this.state.text.node : null];

		for (var i = 0; i < nodes.length; i++)
		{
			if (nodes[i] != null && nodes[i].parentNode != null)
			{
				var r = nodes[i].getBoundingClientRect();

				if (r.width > 0 || r.height > 0)
				{
					result = (result == null) ? {left: r.left, top: r.top, right: r.right, bottom: r.bottom} :
						{left: Math.min(result.left, r.left), top: Math.min(result.top, r.top),
						right: Math.max(result.right, r.right), bottom: Math.max(result.bottom, r.bottom)};
				}
			}
		}
	}

	return result;
};

/**
 * Function: isInTooltip
 * 
 * Returns true if the given point in client coordinates is in the box of the
 * visible tooltip, extended by <safeZonePadding> (the browser rounds the box
 * and the coordinates of mouse events, so the mouse can enter the tooltip
 * more than a pixel outside of its bounds). The markup of a tooltip can be
 * placed outside of this box (eg. with position:fixed), where the mouse is
 * on a node inside the tooltip but does not keep it open and where clicks do
 * not reach links. This includes content that overflows the tooltip (eg. an
 * image that is wider than a tooltip with a maximum width): the scroll size
 * of the tooltip is not used, as markup can put a transparent link of any
 * size there (eg. with position:absolute, a width or a margin), which would
 * keep the tooltip open and take the clicks beside and below it.
 * 
 * Parameters:
 * 
 * x - X-coordinate of the mouse in client coordinates.
 * y - Y-coordinate of the mouse in client coordinates.
 */
mxTooltipHandler.prototype.isInTooltip = function(x, y)
{
	if (this.div == null || this.div.style.visibility == 'hidden')
	{
		return false;
	}

	var pad = this.safeZonePadding;
	var t = this.div.getBoundingClientRect();

	return x >= t.left - pad && x <= t.right + pad && y >= t.top - pad && y <= t.bottom + pad;
};

/**
 * Function: isInSafeZone
 * 
 * Returns true if the given point in client coordinates is in the safe zone
 * of the visible tooltip, extended by <safeZonePadding>: in the tooltip, in
 * the polygon from the last point on the cell to the near corners of the
 * tooltip (the convex hull of that point and the tooltip) or in the gap
 * between the bounds of the cell and the tooltip.
 * 
 * Parameters:
 * 
 * x - X-coordinate of the mouse in client coordinates.
 * y - Y-coordinate of the mouse in client coordinates.
 */
mxTooltipHandler.prototype.isInSafeZone = function(x, y)
{
	if (this.div == null)
	{
		return false;
	}

	var pad = this.safeZonePadding;
	var t = this.div.getBoundingClientRect();
	var inside = function(left, top, right, bottom)
	{
		return left <= right && top <= bottom && x >= left - pad &&
			x <= right + pad && y >= top - pad && y <= bottom + pad;
	};

	if (inside(t.left, t.top, t.right, t.bottom))
	{
		return true;
	}

	// Gap between the cell and the tooltip if they overlap horizontally
	// or vertically
	var c = this.getCellBounds();

	if (c != null && ((t.top >= c.bottom && inside(Math.max(c.left, t.left), c.bottom,
		Math.min(c.right, t.right), t.top)) || (t.bottom <= c.top &&
		inside(Math.max(c.left, t.left), t.bottom, Math.min(c.right, t.right), c.top)) ||
		(t.left >= c.right && inside(c.right, Math.max(c.top, t.top), t.left,
		Math.min(c.bottom, t.bottom))) || (t.right <= c.left && inside(t.right,
		Math.max(c.top, t.top), c.left, Math.min(c.bottom, t.bottom)))))
	{
		return true;
	}

	if (this.anchorX == null || this.anchorY == null)
	{
		return false;
	}

	// The convex hull of the anchor and the tooltip is the union of the
	// boxes that interpolate between the square around the anchor (k = 0)
	// and the tooltip (k = 1), each extended by the padding. Finds the
	// range of k where the box contains the point.
	var ax = this.anchorX;
	var ay = this.anchorY;
	var k0 = 0;
	var k1 = 1;

	// Limits k to k * d >= v
	var clip = function(d, v)
	{
		if (d > 0)
		{
			k0 = Math.max(k0, v / d);
		}
		else if (d < 0)
		{
			k1 = Math.min(k1, v / d);
		}
		else if (v > 0)
		{
			k1 = -1;
		}
	};

	clip(ax - t.left, ax - pad - x);
	clip(t.right - ax, x - ax - pad);
	clip(ay - t.top, ay - pad - y);
	clip(t.bottom - ay, y - ay - pad);

	return k0 <= k1;
};

/**
 * Function: mouseUp
 * 
 * Handles the event by resetting the tooltip timer or hiding the existing
 * tooltip.
 */
mxTooltipHandler.prototype.mouseUp = function(sender, me)
{
	this.reset(me, true);
	this.hideTooltip();
};


/**
 * Function: resetTimer
 * 
 * Resets the timer.
 */
mxTooltipHandler.prototype.resetTimer = function()
{
	if (this.thread != null)
	{
		window.clearTimeout(this.thread);
		this.thread = null;
	}
};

/**
 * Function: isPenHoverEvent
 *
 * Returns true if the given pen event is a move without contact.
 */
mxTooltipHandler.prototype.isPenHoverEvent = function(evt)
{
	return evt.type == 'pointermove' && evt.buttons == 0;
};

/**
 * Function: reset
 *
 * Resets and/or restarts the timer to trigger the display of the tooltip.
 */
mxTooltipHandler.prototype.reset = function(me, restart, state)
{
	var evt = me.getEvent();
	var pen = this.showOnPenHover && mxEvent.isPenEvent(evt);

	if (!this.ignoreTouchEvents || mxEvent.isMouseEvent(evt) || pen)
	{
		this.resetTimer();

		// Pens only start the timer while hovering (no contact)
		restart = restart && (!this.ignoreTouchEvents || !pen ||
			this.isPenHoverEvent(evt));
		state = (state != null) ? state : this.getStateForEvent(me);
		
		if (restart && this.isEnabled() && state != null && (this.div == null ||
			this.div.style.visibility == 'hidden'))
		{
			var node = me.getSource();
			var x = me.getX();
			var y = me.getY();
			var stateSource = me.isSource(state.shape) || me.isSource(state.text);
	
			this.thread = window.setTimeout(mxUtils.bind(this, function()
			{
				if (!this.graph.isEditing() && !this.graph.popupMenuHandler.isMenuShowing() && !this.graph.isMouseDown)
				{
					// Uses information from inside event cause using the event at
					// this (delayed) point in time is not possible in IE as it no
					// longer contains the required information (member not found)
					var tip = this.graph.getTooltip(state, node, x, y);
					this.show(tip, x, y);
					this.state = state;
					this.node = node;
					this.stateSource = stateSource;
				}
			}), this.delay);
		}
	}
};

/**
 * Function: hide
 * 
 * Hides the tooltip and resets the timer.
 */
mxTooltipHandler.prototype.hide = function()
{
	this.resetTimer();
	this.hideTooltip();
};

/**
 * Function: hideTooltip
 * 
 * Hides the tooltip.
 */
mxTooltipHandler.prototype.hideTooltip = function()
{
	this.resetSafeZoneTimer();
	this.tooltipKept = false;

	if (this.div != null)
	{
		this.div.style.visibility = 'hidden';
		this.div.innerText = '';
	}
};

/**
 * Function: show
 * 
 * Shows the tooltip for the specified cell and optional index at the
 * specified location (with a vertical offset of 10 pixels).
 */
mxTooltipHandler.prototype.show = function(tip, x, y)
{
	if (!this.destroyed && tip != null && tip.length > 0)
	{
		// Initializes the DOM nodes if required
		if (this.div == null)
		{
			this.init();
		}
		
		var origin = mxUtils.getScrollOrigin();
		this.resetSafeZoneTimer();
		this.tooltipKept = false;
		this.anchorX = x;
		this.anchorY = y;

		this.div.style.zIndex = this.zIndex;
		this.div.style.left = (x + origin.x) + 'px';
		this.div.style.top = (y + mxConstants.TOOLTIP_VERTICAL_OFFSET +
			origin.y) + 'px';

		if (!mxUtils.isNode(tip))
		{
			this.div.style.whiteSpace = 'pre-line';
			this.div.innerHTML = tip;
		}
		else
		{
			this.div.style.whiteSpace = '';
			this.div.innerText = '';
			this.div.appendChild(tip);
		}
		
		this.div.style.visibility = '';
		mxUtils.fit(this.div);
	}
};

/**
 * Function: destroy
 * 
 * Destroys the handler and all its resources and DOM nodes.
 */
mxTooltipHandler.prototype.destroy = function()
{
	if (!this.destroyed)
	{
		this.resetTimer();
		this.resetSafeZoneTimer();
		this.graph.removeMouseListener(this);
		mxEvent.release(this.div);
		
		if (this.div != null && this.div.parentNode != null)
		{
			this.div.parentNode.removeChild(this.div);
		}
		
		this.destroyed = true;
		this.div = null;
	}
};
