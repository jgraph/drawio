/**
 * Copyright (c) 2006-2016, JGraph Ltd
 * Copyright (c) 2006-2016, Gaudenz Alder
 */
/**
 * Class: mxConnectionHandler
 *
 * Graph event handler that creates new connections. Uses <mxTerminalMarker>
 * for finding and highlighting the source and target vertices and
 * <factoryMethod> to create the edge instance. This handler is built-into
 * <mxGraph.connectionHandler> and enabled using <mxGraph.setConnectable>.
 *
 * Example:
 * 
 * (code)
 * new mxConnectionHandler(graph, function(source, target, style)
 * {
 *   edge = new mxCell('', new mxGeometry());
 *   edge.setEdge(true);
 *   edge.setStyle(style);
 *   edge.geometry.relative = true;
 *   return edge;
 * });
 * (end)
 * 
 * Here is an alternative solution that just sets a specific user object for
 * new edges by overriding <insertEdge>.
 *
 * (code)
 * mxConnectionHandlerInsertEdge = mxConnectionHandler.prototype.insertEdge;
 * mxConnectionHandler.prototype.insertEdge = function(parent, id, value, source, target, style)
 * {
 *   value = 'Test';
 * 
 *   return mxConnectionHandlerInsertEdge.apply(this, arguments);
 * };
 * (end)
 * 
 * Using images to trigger connections:
 * 
 * This handler uses mxTerminalMarker to find the source and target cell for
 * the new connection and creates a new edge using <connect>. The new edge is
 * created using <createEdge> which in turn uses <factoryMethod> or creates a
 * new default edge.
 * 
 * The handler uses a "highlight-paradigm" for indicating if a cell is being
 * used as a source or target terminal, as seen in other diagramming products.
 * In order to allow both, moving and connecting cells at the same time,
 * <mxConstants.DEFAULT_HOTSPOT> is used in the handler to determine the hotspot
 * of a cell, that is, the region of the cell which is used to trigger a new
 * connection. The constant is a value between 0 and 1 that specifies the
 * amount of the width and height around the center to be used for the hotspot
 * of a cell and its default value is 0.5. In addition,
 * <mxConstants.MIN_HOTSPOT_SIZE> defines the minimum number of pixels for the
 * width and height of the hotspot.
 * 
 * This solution, while standards compliant, may be somewhat confusing because
 * there is no visual indicator for the hotspot and the highlight is seen to
 * switch on and off while the mouse is being moved in and out. Furthermore,
 * this paradigm does not allow to create different connections depending on
 * the highlighted hotspot as there is only one hotspot per cell and it
 * normally does not allow cells to be moved and connected at the same time as
 * there is no clear indication of the connectable area of the cell.
 * 
 * To come across these issues, the handle has an additional <createIcons> hook
 * with a default implementation that allows to create one icon to be used to
 * trigger new connections. If this icon is specified, then new connections can
 * only be created if the image is clicked while the cell is being highlighted.
 * The <createIcons> hook may be overridden to create more than one
 * <mxImageShape> for creating new connections, but the default implementation
 * supports one image and is used as follows:
 * 
 * In order to display the "connect image" whenever the mouse is over the cell,
 * an DEFAULT_HOTSPOT of 1 should be used:
 * 
 * (code)
 * mxConstants.DEFAULT_HOTSPOT = 1;
 * (end)
 * 
 * In order to avoid confusion with the highlighting, the highlight color
 * should not be used with a connect image:
 * 
 * (code)
 * mxConstants.HIGHLIGHT_COLOR = null;
 * (end)
 * 
 * To install the image, the connectImage field of the mxConnectionHandler must
 * be assigned a new <mxImage> instance:
 * 
 * (code)
 * mxConnectionHandler.prototype.connectImage = new mxImage('images/green-dot.gif', 14, 14);
 * (end)
 * 
 * This will use the green-dot.gif with a width and height of 14 pixels as the
 * image to trigger new connections. In createIcons the icon field of the
 * handler will be set in order to remember the icon that has been clicked for
 * creating the new connection. This field will be available under selectedIcon
 * in the connect method, which may be overridden to take the icon that
 * triggered the new connection into account. This is useful if more than one
 * icon may be used to create a connection.
 *
 * Group: Events
 * 
 * Event: mxEvent.START
 * 
 * Fires when a new connection is being created by the user. The <code>state</code>
 * property contains the state of the source cell.
 * 
 * Event: mxEvent.CONNECT
 * 
 * Fires between begin- and endUpdate in <connect>. The <code>cell</code>
 * property contains the inserted edge, the <code>event</code> and <code>target</code> 
 * properties contain the respective arguments that were passed to <connect> (where
 * target corresponds to the dropTarget argument). Finally, the <code>terminal</code>
 * property corresponds to the target argument in <connect> or the clone of the source
 * terminal if <createTarget> is enabled.
 * 
 * Note that the target is the cell under the mouse where the mouse button was released.
 * Depending on the logic in the handler, this doesn't necessarily have to be the target
 * of the inserted edge. To print the source, target or any optional ports IDs that the
 * edge is connected to, the following code can be used. To get more details about the
 * actual connection point, <mxGraph.getConnectionConstraint> can be used. To resolve
 * the port IDs, use <mxGraphModel.getCell>.
 * 
 * (code)
 * graph.connectionHandler.addListener(mxEvent.CONNECT, function(sender, evt)
 * {
 *   var edge = evt.getProperty('cell');
 *   var source = graph.getModel().getTerminal(edge, true);
 *   var target = graph.getModel().getTerminal(edge, false);
 *   
 *   var style = graph.getCellStyle(edge);
 *   var sourcePortId = style[mxConstants.STYLE_SOURCE_PORT];
 *   var targetPortId = style[mxConstants.STYLE_TARGET_PORT];
 *   
 *   mxLog.show();
 *   mxLog.debug('connect', edge, source.id, target.id, sourcePortId, targetPortId);
 * });
 * (end)
 *
 * Event: mxEvent.RESET
 * 
 * Fires when the <reset> method is invoked.
 *
 * Constructor: mxConnectionHandler
 *
 * Constructs an event handler that connects vertices using the specified
 * factory method to create the new edges. Modify
 * <mxConstants.ACTIVE_REGION> to setup the region on a cell which triggers
 * the creation of a new connection or use connect icons as explained
 * above.
 * 
 * Parameters:
 * 
 * graph - Reference to the enclosing <mxGraph>.
 * factoryMethod - Optional function to create the edge. The function takes
 * the source and target <mxCell> as the first and second argument and an
 * optional cell style from the preview as the third argument. It returns
 * the <mxCell> that represents the new edge.
 */
function mxConnectionHandler(graph, factoryMethod)
{
	mxEventSource.call(this);
	
	if (graph != null)
	{
		this.graph = graph;
		this.factoryMethod = factoryMethod;
		this.init();
		
		// Handles escape keystrokes
		this.escapeHandler = mxUtils.bind(this, function(sender, evt)
		{
			this.reset();
		});
		
		this.graph.addListener(mxEvent.ESCAPE, this.escapeHandler);
	}
};

/**
 * Extends mxEventSource.
 */
mxUtils.extend(mxConnectionHandler, mxEventSource);

/**
 * Variable: graph
 * 
 * Reference to the enclosing <mxGraph>.
 */
mxConnectionHandler.prototype.graph = null;

/**
 * Variable: factoryMethod
 * 
 * Function that is used for creating new edges. The function takes the
 * source and target <mxCell> as the first and second argument and returns
 * a new <mxCell> that represents the edge. This is used in <createEdge>.
 */
mxConnectionHandler.prototype.factoryMethod = true;

/**
 * Variable: moveIconFront
 * 
 * Specifies if icons should be displayed inside the graph container instead
 * of the overlay pane. This is used for HTML labels on vertices which hide
 * the connect icon. This has precendence over <moveIconBack> when set
 * to true. Default is false.
 */
mxConnectionHandler.prototype.moveIconFront = false;

/**
 * Variable: moveIconBack
 * 
 * Specifies if icons should be moved to the back of the overlay pane. This can
 * be set to true if the icons of the connection handler conflict with other
 * handles, such as the vertex label move handle. Default is false.
 */
mxConnectionHandler.prototype.moveIconBack = false;

/**
 * Variable: connectImage
 * 
 * <mxImage> that is used to trigger the creation of a new connection. This
 * is used in <createIcons>. Default is null.
 */
mxConnectionHandler.prototype.connectImage = null;

/**
 * Variable: targetConnectImage
 * 
 * Specifies if the connect icon should be centered on the target state
 * while connections are being previewed. Default is false.
 */
mxConnectionHandler.prototype.targetConnectImage = false;

/**
 * Variable: enabled
 * 
 * Specifies if events are handled. Default is true.
 */
mxConnectionHandler.prototype.enabled = true;

/**
 * Variable: select
 * 
 * Specifies if new edges should be selected. Default is true.
 */
mxConnectionHandler.prototype.select = true;

/**
 * Variable: createTarget
 * 
 * Specifies if <createTargetVertex> should be called if no target was under the
 * mouse for the new connection. Setting this to true means the connection
 * will be drawn as valid if no target is under the mouse, and
 * <createTargetVertex> will be called before the connection is created between
 * the source cell and the newly created vertex in <createTargetVertex>, which
 * can be overridden to create a new target. Default is false.
 */
mxConnectionHandler.prototype.createTarget = false;

/**
 * Variable: marker
 * 
 * Holds the <mxTerminalMarker> used for finding source and target cells.
 */
mxConnectionHandler.prototype.marker = null;

/**
 * Variable: constraintHandler
 * 
 * Holds the <mxConstraintHandler> used for drawing and highlighting
 * constraints.
 */
mxConnectionHandler.prototype.constraintHandler = null;

/**
 * Variable: error
 * 
 * Holds the current validation error while connections are being created.
 */
mxConnectionHandler.prototype.error = null;

/**
 * Variable: waypointsEnabled
 * 
 * Specifies if single clicks should add waypoints on the new edge. Default is
 * false.
 */
mxConnectionHandler.prototype.waypointsEnabled = false;

/**
 * Variable: ignoreMouseDown
 * 
 * Specifies if the connection handler should ignore the state of the mouse
 * button when highlighting the source. Default is false, that is, the
 * handler only highlights the source if no button is being pressed.
 */
mxConnectionHandler.prototype.ignoreMouseDown = false;

/**
 * Variable: first
 * 
 * Holds the <mxPoint> where the mouseDown took place while the handler is
 * active.
 */
mxConnectionHandler.prototype.first = null;

/**
 * Variable: connectIconOffset
 * 
 * Holds the offset for connect icons during connection preview.
 * Default is mxPoint(0, <mxConstants.TOOLTIP_VERTICAL_OFFSET>).
 * Note that placing the icon under the mouse pointer with an
 * offset of (0,0) will affect hit detection.
 */
mxConnectionHandler.prototype.connectIconOffset = new mxPoint(0, mxConstants.TOOLTIP_VERTICAL_OFFSET);

/**
 * Variable: edgeState
 * 
 * Optional <mxCellState> that represents the preview edge while the
 * handler is active. This is created in <createEdgeState>.
 */
mxConnectionHandler.prototype.edgeState = null;

/**
 * Variable: changeHandler
 * 
 * Holds the change event listener for later removal.
 */
mxConnectionHandler.prototype.changeHandler = null;

/**
 * Variable: drillHandler
 * 
 * Holds the drill event listener for later removal.
 */
mxConnectionHandler.prototype.drillHandler = null;

/**
 * Variable: mouseDownCounter
 * 
 * Counts the number of mouseDown events since the start. The initial mouse
 * down event counts as 1.
 */
mxConnectionHandler.prototype.mouseDownCounter = 0;

/**
 * Variable: movePreviewAway
 * 
 * Switch to enable moving the preview away from the mousepointer. This is required in browsers
 * where the preview cannot be made transparent to events and if the built-in hit detection on
 * the HTML elements in the page should be used. Default is the value of false.
 */
mxConnectionHandler.prototype.movePreviewAway = false;

/**
 * Variable: outlineConnect
 * 
 * Specifies if connections to the outline of a highlighted target should be
 * enabled. This will allow to place the connection point along the outline of
 * the highlighted target. Default is false.
 */
mxConnectionHandler.prototype.outlineConnect = false;

/**
 * Variable: livePreview
 * 
 * Specifies if the actual shape of the edge state should be used for the preview.
 * Default is false. (Ignored if no edge state is created in <createEdgeState>.)
 */
mxConnectionHandler.prototype.livePreview = false;

/**
 * Variable: cursor
 * 
 * Specifies the cursor to be used while the handler is active. Default is null.
 */
mxConnectionHandler.prototype.cursor = null;

/**
 * Variable: insertBeforeSource
 * 
 * Specifies if new edges should be inserted before the source vertex in the
 * cell hierarchy. Default is false for backwards compatibility.
 */
mxConnectionHandler.prototype.insertBeforeSource = false;

/**
 * Function: isEnabled
 * 
 * Returns true if events are handled. This implementation
 * returns <enabled>.
 */
mxConnectionHandler.prototype.isEnabled = function()
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
 * enabled - Boolean that specifies the new enabled state.
 */
mxConnectionHandler.prototype.setEnabled = function(enabled)
{
	this.enabled = enabled;
};

/**
 * Function: isInsertBefore
 * 
 * Returns <insertBeforeSource> for non-loops and false for loops.
 *
 * Parameters:
 * 
 * edge - <mxCell> that represents the edge to be inserted.
 * source - <mxCell> that represents the source terminal.
 * target - <mxCell> that represents the target terminal.
 * evt - Mousedown event of the connect gesture.
 * dropTarget - <mxCell> that represents the cell under the mouse when it was
 * released.
 */
mxConnectionHandler.prototype.isInsertBefore = function(edge, source, target, evt, dropTarget)
{
	return this.insertBeforeSource && source != target &&
		this.graph.model.getParent(edge) ==
		this.graph.model.getParent(source);
};

/**
 * Function: isCreateTarget
 * 
 * Returns <createTarget>.
 *
 * Parameters:
 *
 * evt - Current active native pointer event.
 */
mxConnectionHandler.prototype.isCreateTarget = function(evt)
{
	return this.createTarget;
};

/**
 * Function: setCreateTarget
 * 
 * Sets <createTarget>.
 */
mxConnectionHandler.prototype.setCreateTarget = function(value)
{
	this.createTarget = value;
};

/**
 * Function: createShape
 * 
 * Creates the preview shape for new connections.
 */
mxConnectionHandler.prototype.createShape = function()
{
	// Creates the edge preview
	var shape = (this.livePreview && this.edgeState != null) ?
		this.graph.cellRenderer.createShape(this.edgeState) :
		new mxPolyline([], mxConstants.INVALID_COLOR);
	shape.dialect = mxConstants.DIALECT_SVG;
	shape.scale = this.graph.view.scale;
	shape.svgStrokeTolerance = 0;
	shape.pointerEvents = false;
	shape.isDashed = true;
	shape.init(this.graph.getView().getOverlayPane());
	mxEvent.redirectMouseEvents(shape.node, this.graph, null);

	return shape;
};

/**
 * Function: init
 * 
 * Initializes the shapes required for this connection handler. This should
 * be invoked if <mxGraph.container> is assigned after the connection
 * handler has been created.
 */
mxConnectionHandler.prototype.init = function()
{
	this.graph.addMouseListener(this);
	this.marker = this.createMarker();
	this.constraintHandler = new mxConstraintHandler(this.graph);

	// Redraws the icons if the graph changes
	this.changeHandler = mxUtils.bind(this, function(sender)
	{
		if (this.iconState != null)
		{
			this.iconState = this.graph.getView().getState(this.iconState.cell);
		}
		
		if (this.iconState != null)
		{
			this.redrawIcons(this.icons, this.iconState);
			this.constraintHandler.reset();
		}
		else if (this.previous != null && this.graph.view.getState(this.previous.cell) == null)
		{
			this.reset();
		}
	});
	
	this.graph.getModel().addListener(mxEvent.CHANGE, this.changeHandler);
	this.graph.getView().addListener(mxEvent.SCALE, this.changeHandler);
	this.graph.getView().addListener(mxEvent.TRANSLATE, this.changeHandler);
	this.graph.getView().addListener(mxEvent.SCALE_AND_TRANSLATE, this.changeHandler);
	
	// Removes the icon if we step into/up or start editing
	this.drillHandler = mxUtils.bind(this, function(sender)
	{
		this.reset();
	});
	
	this.graph.addListener(mxEvent.START_EDITING, this.drillHandler);
	this.graph.getView().addListener(mxEvent.DOWN, this.drillHandler);
	this.graph.getView().addListener(mxEvent.UP, this.drillHandler);
};

/**
 * Function: isConnectableCell
 * 
 * Returns true if the given cell is connectable. This is a hook to
 * disable floating connections. This implementation returns true.
 */
mxConnectionHandler.prototype.isConnectableCell = function(cell)
{
	return true;
};

/**
 * Function: createMarker
 * 
 * Creates and returns the <mxCellMarker> used in <marker>.
 */
mxConnectionHandler.prototype.createMarker = function()
{
	var marker = new mxCellMarker(this.graph);
	marker.hotspotEnabled = true;

	// Overrides to return cell at location only if valid (so that
	// there is no highlight for invalid cells)
	marker.getCell = mxUtils.bind(this, function(me)
	{
		var cell = mxCellMarker.prototype.getCell.apply(marker, arguments);
		this.error = null;
		
		// Checks for cell at preview point (with grid)
		if (cell == null && this.currentPoint != null)
		{
			cell = this.graph.getCellAt(this.currentPoint.x, this.currentPoint.y);
		}
		
		// Uses connectable parent vertex if one exists
		if (cell != null && !this.graph.isCellConnectable(cell))
		{
			var parent = this.graph.getModel().getParent(cell);
			
			if (this.graph.getModel().isVertex(parent) && this.graph.isCellConnectable(parent))
			{
				cell = parent;
			}
		}
		
		if ((this.graph.isSwimlane(cell) && this.currentPoint != null &&
			this.graph.hitsSwimlaneContent(cell, this.currentPoint.x, this.currentPoint.y)) ||
			!this.isConnectableCell(cell))
		{
			cell = null;
		}
		
		if (cell != null)
		{
			if (this.isConnecting())
			{
				if (this.previous != null)
				{
					this.error = this.validateConnection(this.previous.cell, cell);
					
					if (this.error != null && this.error.length == 0)
					{
						cell = null;
						
						// Enables create target inside groups
						if (this.isCreateTarget(me.getEvent()))
						{
							this.error = null;
						}
					}
				}
			}
			else if (!this.isValidSource(cell, me))
			{
				cell = null;
			}
		}
		else if (this.isConnecting() && !this.isCreateTarget(me.getEvent()) &&
				!this.graph.allowDanglingEdges)
		{
			this.error = '';
		}

		return cell;
	});

	// Sets the highlight color according to validateConnection
	marker.isValidState = mxUtils.bind(this, function(state)
	{
		if (this.isConnecting())
		{
			return this.error == null;
		}
		else
		{
			return mxCellMarker.prototype.isValidState.apply(marker, arguments);
		}
	});

	// Overrides to use marker color only in highlight mode or for
	// target selection
	marker.getMarkerColor = mxUtils.bind(this, function(evt, state, isValid)
	{
		return (this.connectImage == null || this.isConnecting()) ?
			mxCellMarker.prototype.getMarkerColor.apply(marker, arguments) :
			null;
	});

	// Overrides to use hotspot only for source selection otherwise
	// intersects always returns true when over a cell
	marker.intersects = mxUtils.bind(this, function(state, evt)
	{
		if (this.connectImage != null || this.isConnecting())
		{
			return true;
		}
		
		return mxCellMarker.prototype.intersects.apply(marker, arguments);
	});

	return marker;
};

/**
 * Function: start
 * 
 * Starts a new connection for the given state and coordinates.
 */
mxConnectionHandler.prototype.start = function(state, x, y, edgeState)
{
	this.previous = state;
	this.first = new mxPoint(x, y);
	this.edgeState = (edgeState != null) ? edgeState : this.createEdgeState(null);
	
	// Marks the source state
	this.marker.currentColor = this.marker.validColor;
	this.marker.markedState = state;
	this.marker.mark();

	this.fireEvent(new mxEventObject(mxEvent.START, 'state', this.previous));
};

/**
 * Function: isConnecting
 * 
 * Returns true if the source terminal has been clicked and a new
 * connection is currently being previewed.
 */
mxConnectionHandler.prototype.isConnecting = function()
{
	return this.first != null && this.shape != null;
};

/**
 * Function: isValidSource
 * 
 * Returns <mxGraph.isValidSource> for the given source terminal.
 * 
 * Parameters:
 * 
 * cell - <mxCell> that represents the source terminal.
 * me - <mxMouseEvent> that is associated with this call.
 */
mxConnectionHandler.prototype.isValidSource = function(cell, me)
{
	return this.graph.isValidSource(cell);
};

/**
 * Function: isValidTarget
 * 
 * Returns true. The call to <mxGraph.isValidTarget> is implicit by calling
 * <mxGraph.getEdgeValidationError> in <validateConnection>. This is an
 * additional hook for disabling certain targets in this specific handler.
 * 
 * Parameters:
 * 
 * cell - <mxCell> that represents the target terminal.
 */
mxConnectionHandler.prototype.isValidTarget = function(cell)
{
	return true;
};

/**
 * Function: validateConnection
 * 
 * Returns the error message or an empty string if the connection for the
 * given source target pair is not valid. Otherwise it returns null. This
 * implementation uses <mxGraph.getEdgeValidationError>.
 * 
 * Parameters:
 * 
 * source - <mxCell> that represents the source terminal.
 * target - <mxCell> that represents the target terminal.
 */
mxConnectionHandler.prototype.validateConnection = function(source, target)
{
	if (!this.isValidTarget(target))
	{
		return '';
	}
	
	return this.graph.getEdgeValidationError(null, source, target);
};

/**
 * Function: getConnectImage
 * 
 * Hook to return the <mxImage> used for the connection icon of the given
 * <mxCellState>. This implementation returns <connectImage>.
 * 
 * Parameters:
 * 
 * state - <mxCellState> whose connect image should be returned.
 */
mxConnectionHandler.prototype.getConnectImage = function(state)
{
	return this.connectImage;
};

/**
 * Function: isMoveIconToFrontForState
 * 
 * Returns true if the state has a HTML label in the graph's container, otherwise
 * it returns <moveIconFront>.
 * 
 * Parameters:
 * 
 * state - <mxCellState> whose connect icons should be returned.
 */
mxConnectionHandler.prototype.isMoveIconToFrontForState = function(state)
{
	if (state.text != null && state.text.node.parentNode == this.graph.container)
	{
		return true;
	}
	
	return this.moveIconFront;
};

/**
 * Function: createIcons
 * 
 * Creates the array <mxImageShapes> that represent the connect icons for
 * the given <mxCellState>.
 * 
 * Parameters:
 * 
 * state - <mxCellState> whose connect icons should be returned.
 */
mxConnectionHandler.prototype.createIcons = function(state)
{
	var image = this.getConnectImage(state);
	
	if (image != null && state != null)
	{
		this.iconState = state;
		var icons = [];

		// Cannot use HTML for the connect icons because the icon receives all
		// mouse move events in IE, must use SVG instead even if the
		// connect-icon appears behind the selection border and the selection
		// border consumes the events before the icon gets a chance
		var bounds = new mxRectangle(0, 0, image.width, image.height);
		var icon = new mxImageShape(bounds, image.src, null, null, 0);
		icon.preserveImageAspect = false;
		
		if (this.isMoveIconToFrontForState(state))
		{
			icon.dialect = mxConstants.DIALECT_STRICTHTML;
			icon.init(this.graph.container);
		}
		else
		{
			icon.dialect = mxConstants.DIALECT_SVG;
			icon.init(this.graph.getView().getOverlayPane());

			// Move the icon back in the overlay pane
			if (this.moveIconBack && icon.node.previousSibling != null)
			{
				icon.node.parentNode.insertBefore(icon.node, icon.node.parentNode.firstChild);
			}
		}

		icon.node.style.cursor = mxConstants.CURSOR_CONNECT;

		// Events transparency
		var getState = mxUtils.bind(this, function()
		{
			return (this.currentState != null) ? this.currentState : state;
		});
		
		// Updates the local icon before firing the mouse down event.
		var mouseDown = mxUtils.bind(this, function(evt)
		{
			if (!mxEvent.isConsumed(evt))
			{
				this.icon = icon;
				this.graph.fireMouseEvent(mxEvent.MOUSE_DOWN,
					new mxMouseEvent(evt, getState()));
			}
		});

		mxEvent.redirectMouseEvents(icon.node, this.graph, getState, mouseDown);
		
		icons.push(icon);
		this.redrawIcons(icons, this.iconState);
		
		return icons;
	}
	
	return null;
};

/**
 * Function: redrawIcons
 * 
 * Redraws the given array of <mxImageShapes>.
 * 
 * Parameters:
 * 
 * icons - Optional array of <mxImageShapes> to be redrawn.
 */
mxConnectionHandler.prototype.redrawIcons = function(icons, state)
{
	if (icons != null && icons[0] != null && state != null)
	{
		var pos = this.getIconPosition(icons[0], state);
		icons[0].bounds.x = pos.x;
		icons[0].bounds.y = pos.y;
		icons[0].redraw();
	}
};

/**
 * Function: getIconPosition
 * 
 * Returns the center position of the given icon.
 * 
 * Parameters:
 * 
 * icon - The connect icon of <mxImageShape> with the mouse.
 * state - <mxCellState> under the mouse.
 */
mxConnectionHandler.prototype.getIconPosition = function(icon, state)
{
	var scale = this.graph.getView().scale;
	var cx = state.getCenterX();
	var cy = state.getCenterY();
	
	if (this.graph.isSwimlane(state.cell))
	{
		var size = this.graph.getStartSize(state.cell);
		
		cx = (size.width != 0) ? state.x + size.width * scale / 2 : cx;
		cy = (size.height != 0) ? state.y + size.height * scale / 2 : cy;
		
		var alpha = mxUtils.toRadians(mxUtils.getValue(state.style, mxConstants.STYLE_ROTATION) || 0);
		
		if (alpha != 0)
		{
			var cos = Math.cos(alpha);
			var sin = Math.sin(alpha);
			var ct = new mxPoint(state.getCenterX(), state.getCenterY());
			var pt = mxUtils.getRotatedPoint(new mxPoint(cx, cy), cos, sin, ct);
			cx = pt.x;
			cy = pt.y;
		}
	}

	return new mxPoint(cx - icon.bounds.width / 2,
			cy - icon.bounds.height / 2);
};

/**
 * Function: destroyIcons
 * 
 * Destroys the connect icons and resets the respective state.
 */
mxConnectionHandler.prototype.destroyIcons = function()
{
	if (this.icons != null)
	{
		for (var i = 0; i < this.icons.length; i++)
		{
			this.icons[i].destroy();
		}
		
		this.icons = null;
		this.icon = null;
		this.selectedIcon = null;
		this.iconState = null;
	}
};

/**
 * Function: isStartEvent
 * 
 * Returns true if the given mouse down event should start this handler. The
 * This implementation returns true if the event does not force marquee
 * selection, and the currentConstraint and currentFocus of the
 * <constraintHandler> are not null, or <previous> and <error> are not null and
 * <icons> is null or <icons> and <icon> are not null.
 */
mxConnectionHandler.prototype.isStartEvent = function(me)
{
	return ((this.constraintHandler.currentFocus != null && this.constraintHandler.currentConstraint != null) ||
		(this.previous != null && this.error == null && (this.icons == null || (this.icons != null &&
		this.icon != null))));
};

/**
 * Function: mouseDown
 * 
 * Handles the event by initiating a new connection.
 */
mxConnectionHandler.prototype.mouseDown = function(sender, me)
{
	this.mouseDownCounter++;
	
	if (this.isEnabled() && this.graph.isEnabled() && !me.isConsumed() &&
		!this.isConnecting() && this.isStartEvent(me))
	{
		if (this.constraintHandler.currentConstraint != null &&
			this.constraintHandler.currentFocus != null &&
			this.constraintHandler.currentPoint != null)
		{
			this.sourceConstraint = this.constraintHandler.currentConstraint;
			this.previous = this.constraintHandler.currentFocus;
			this.first = this.constraintHandler.currentPoint.clone();
		}
		else
		{
			// Stores the location of the initial mousedown
			this.first = new mxPoint(me.getGraphX(), me.getGraphY());
		}
	
		this.edgeState = this.createEdgeState(me);
		this.mouseDownCounter = 1;
		
		if (this.waypointsEnabled && this.shape == null)
		{
			this.waypoints = null;
			this.shape = this.createShape();
			
			if (this.edgeState != null)
			{
				this.shape.apply(this.edgeState);
			}
		}

		// Stores the starting point in the geometry of the preview
		if (this.previous == null && this.edgeState != null)
		{
			var pt = this.graph.getPointForEvent(me.getEvent());
			this.edgeState.cell.geometry.setTerminalPoint(pt, true);
		}
		
		this.fireEvent(new mxEventObject(mxEvent.START, 'state', this.previous));

		me.consume();
	}

	this.selectedIcon = this.icon;
	this.icon = null;
};

/**
 * Function: isImmediateConnectSource
 * 
 * Returns true if a tap on the given source state should immediately start
 * connecting. This implementation returns true if the state is not movable
 * in the graph. 
 */
mxConnectionHandler.prototype.isImmediateConnectSource = function(state)
{
	return !this.graph.isCellMovable(state.cell);
};

/**
 * Function: createEdgeState
 * 
 * Hook to return an <mxCellState> which may be used during the preview.
 * This implementation returns null.
 * 
 * Use the following code to create a preview for an existing edge style:
 * 
 * (code)
 * graph.connectionHandler.createEdgeState = function(me)
 * {
 *   var edge = graph.createEdge(null, null, null, null, null, 'edgeStyle=elbowEdgeStyle');
 *   
 *   return new mxCellState(this.graph.view, edge, this.graph.getCellStyle(edge));
 * };
 * (end)
 */
mxConnectionHandler.prototype.createEdgeState = function(me)
{
	return null;
};

/**
 * Function: isOutlineConnectEvent
 * 
 * Returns true if <outlineConnect> is true and the source of the event is the
 * outline shape or shift is pressed.
 */
mxConnectionHandler.prototype.isOutlineConnectEvent = function(me)
{
	if (mxEvent.isShiftDown(me.getEvent()) && mxEvent.isAltDown(me.getEvent()))
	{
		return false;
	}
	else
	{
		var offset = mxUtils.getOffset(this.graph.container);
		var evt = me.getEvent();
		
		var clientX = mxEvent.getClientX(evt);
		var clientY = mxEvent.getClientY(evt);
		
		var doc = document.documentElement;
		var left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
		var top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
		
		var gridX = this.currentPoint.x - this.graph.container.scrollLeft + offset.x - left;
		var gridY = this.currentPoint.y - this.graph.container.scrollTop + offset.y - top;

		return this.outlineConnect && ((mxEvent.isShiftDown(me.getEvent()) &&
			!mxEvent.isAltDown(me.getEvent())) || (me.isSource(this.marker.highlight.shape) ||
			(!mxEvent.isShiftDown(me.getEvent()) && mxEvent.isAltDown(me.getEvent()) &&
			me.getState() != null) || this.marker.highlight.isHighlightAt(clientX, clientY) ||
			((gridX != clientX || gridY != clientY) && me.getState() == null &&
			this.marker.highlight.isHighlightAt(gridX, gridY))));
	}
};

/**
 * Function: updateCurrentState
 * 
 * Updates the current state for a given mouse move event by using
 * the <marker>.
 */
mxConnectionHandler.prototype.updateCurrentState = function(me, point)
{
	this.constraintHandler.update(me, this.first == null, false, (this.first == null ||
		me.isSource(this.marker.highlight.shape)) ? null : point);
	
	if (this.constraintHandler.currentFocus != null && this.constraintHandler.currentConstraint != null)
	{
		// Handles special case where grid is large and connection point is at actual point in which
		// case the outline is not followed as long as we're < gridSize / 2 away from that point
		if (this.marker.highlight != null && this.marker.highlight.state != null &&
			this.marker.highlight.state.cell == this.constraintHandler.currentFocus.cell)
		{
			// Direct repaint needed if cell already highlighted
			if (this.marker.highlight.shape.stroke != 'transparent')
			{
				this.marker.highlight.shape.stroke = 'transparent';
				this.marker.highlight.repaint();
			}
		}
		else
		{
			this.marker.markCell(this.constraintHandler.currentFocus.cell, 'transparent');
		}

		// Updates validation state
		if (this.previous != null)
		{
			this.error = this.validateConnection(this.previous.cell, this.constraintHandler.currentFocus.cell);
			
			if (this.error == null)
			{
				this.currentState = this.constraintHandler.currentFocus;
			}
					
			if (this.error != null || (this.currentState != null &&
				!this.isCellEnabled(this.currentState.cell)))
			{
				this.constraintHandler.reset();
			}
		}
	}
	else
	{
		if (this.graph.isIgnoreTerminalEvent(me.getEvent()))
		{
			this.marker.reset();
			this.currentState = null;
		}
		else
		{
			this.marker.process(me);
			this.currentState = this.marker.getValidState();
		}
			
		if (this.currentState != null && !this.isCellEnabled(this.currentState.cell))
		{
			this.constraintHandler.reset();
			this.marker.reset();
			this.currentState = null;
		}

		var outline = this.isOutlineConnectEvent(me);

		if (this.currentState != null && outline)
		{
			// Handles special case where mouse is on outline away from actual end point
			// in which case the grid is ignored and mouse point is used instead
			if (me.isSource(this.marker.highlight.shape))
			{
				point = new mxPoint(me.getGraphX(), me.getGraphY());
			}
			
			var constraint = this.graph.getOutlineConstraint(point, this.currentState, me);
			this.constraintHandler.setFocus(me, this.currentState, false);
			this.constraintHandler.currentConstraint = constraint;
			this.constraintHandler.currentPoint = point;
		}

		if (this.outlineConnect)
		{
			if (this.marker.highlight != null && this.marker.highlight.shape != null)
			{
				var s = this.graph.view.scale;
				
				if (this.constraintHandler.currentConstraint != null &&
					this.constraintHandler.currentFocus != null)
				{
					this.marker.highlight.shape.stroke = mxConstants.OUTLINE_HIGHLIGHT_COLOR;
					this.marker.highlight.shape.strokewidth = mxConstants.OUTLINE_HIGHLIGHT_STROKEWIDTH / s / s;
					this.marker.highlight.repaint();
				} 
				else if (this.marker.hasValidState())
				{
					// Handles special case where actual end point of edge and current mouse point
					// are not equal (due to grid snapping) and there is no hit on shape or highlight
					// but ignores cases where parent is used for non-connectable child cells
					if (this.graph.isCellConnectable(me.getCell()) &&
						this.marker.getValidState() != me.getState())
					{
						this.marker.highlight.shape.stroke = 'transparent';
						this.currentState = null;
					}
					else
					{
						this.marker.highlight.shape.stroke = mxConstants.DEFAULT_VALID_COLOR;
					}
	
					this.marker.highlight.shape.strokewidth = mxConstants.HIGHLIGHT_STROKEWIDTH / s / s;
					this.marker.highlight.repaint();
				}
			}
		}
	}
};

/**
 * Function: isCellEnabled
 * 
 * Returns true if the given cell allows new connections to be created. This implementation
 * always returns true.
 */
mxConnectionHandler.prototype.isCellEnabled = function(cell)
{
	return true;
};

/**
 * Function: convertWaypoint
 * 
 * Converts the given point from screen coordinates to model coordinates.
 */
mxConnectionHandler.prototype.convertWaypoint = function(point)
{
	var scale = this.graph.getView().getScale();
	var tr = this.graph.getView().getTranslate();
	
	point.x = point.x / scale - tr.x;
	point.y = point.y / scale - tr.y;
};

/**
 * Function: snapToPreview
 * 
 * Called to snap the given point to the current preview. This snaps to the
 * first point of the preview if alt is not pressed.
 */
mxConnectionHandler.prototype.snapToPreview = function(me, point)
{
	if (!mxEvent.isAltDown(me.getEvent()) && this.previous != null)
	{
		var tol = this.graph.gridSize * this.graph.view.scale / 2;	
		var tmp = (this.sourceConstraint != null) ? this.first :
			new mxPoint(this.previous.getCenterX(), this.previous.getCenterY());

		if (Math.abs(tmp.x - me.getGraphX()) < tol)
		{
			point.x = tmp.x;
		}
		
		if (Math.abs(tmp.y - me.getGraphY()) < tol)
		{
			point.y = tmp.y;
		}
	}	
};

/**
 * Function: mouseMove
 * 
 * Handles the event by updating the preview edge or by highlighting
 * a possible source or target terminal.
 */
mxConnectionHandler.prototype.mouseMove = function(sender, me)
{
	if (!me.isConsumed() && (this.ignoreMouseDown || this.first != null || !this.graph.isMouseDown))
	{
		// Handles special case when handler is disabled during highlight
		if (!this.isEnabled() && this.currentState != null)
		{
			this.destroyIcons();
			this.currentState = null;
		}

		var view = this.graph.getView();
		var scale = view.scale;
		var tr = view.translate;
		var point = new mxPoint(me.getGraphX(), me.getGraphY());
		this.error = null;

		if (this.graph.isGridEnabledEvent(me.getEvent()))
		{
			point = new mxPoint((this.graph.snap(point.x / scale - tr.x) + tr.x) * scale,
				(this.graph.snap(point.y / scale - tr.y) + tr.y) * scale);
		}
		
		this.snapToPreview(me, point);
		this.currentPoint = point;
		
		if ((this.first != null || (this.isEnabled() && this.graph.isEnabled())) &&
			(this.shape != null || this.first == null ||
			Math.abs(me.getGraphX() - this.first.x) > this.graph.tolerance ||
			Math.abs(me.getGraphY() - this.first.y) > this.graph.tolerance))
		{
			this.updateCurrentState(me, point);
		}

		if (this.first != null)
		{
			var constraint = null;
			var current = point;
			
			// Uses the current point from the constraint handler if available
			if (this.constraintHandler.currentConstraint != null &&
				this.constraintHandler.currentFocus != null &&
				this.constraintHandler.currentPoint != null)
			{
				constraint = this.constraintHandler.currentConstraint;
				current = this.constraintHandler.currentPoint.clone();
			}
			else if (this.previous != null && mxEvent.isShiftDown(me.getEvent()) &&
				!this.graph.isIgnoreTerminalEvent(me.getEvent()))
			{
				var pt = new mxPoint(this.previous.getCenterX(), this.previous.getCenterY());
				
				if (this.sourceConstraint != null)
				{
					pt = this.first;
				}
				
				if (Math.abs(pt.x - point.x) <
					Math.abs(pt.y - point.y))
				{
					point.x = pt.x;
				}
				else
				{
					point.y = pt.y;
				}
			}
			
			var pt2 = this.first;
			
			// Moves the connect icon with the mouse
			if (this.selectedIcon != null)
			{
				var w = this.selectedIcon.bounds.width;
				var h = this.selectedIcon.bounds.height;
				
				if (this.currentState != null && this.targetConnectImage)
				{
					var pos = this.getIconPosition(this.selectedIcon, this.currentState);
					this.selectedIcon.bounds.x = pos.x;
					this.selectedIcon.bounds.y = pos.y;
				}
				else
				{
					var bounds = new mxRectangle(me.getGraphX() + this.connectIconOffset.x,
						me.getGraphY() + this.connectIconOffset.y, w, h);
					this.selectedIcon.bounds = bounds;
				}
				
				this.selectedIcon.redraw();
			}

			// Uses edge state to compute the terminal points
			if (this.edgeState != null)
			{
				this.updateEdgeState(current, constraint);
				current = this.edgeState.absolutePoints[this.edgeState.absolutePoints.length - 1];
				pt2 = this.edgeState.absolutePoints[0];
			}
			else
			{
				if (this.currentState != null)
				{
					if (this.constraintHandler.currentConstraint == null)
					{
						var tmp = this.getTargetPerimeterPoint(this.currentState, me);
						
						if (tmp != null)
						{
							current = tmp;
						}
					}
				}
				
				// Computes the source perimeter point
				if (this.sourceConstraint == null && this.previous != null)
				{
					var next = (this.waypoints != null && this.waypoints.length > 0) ?
							this.waypoints[0] : current;
					var tmp = this.getSourcePerimeterPoint(this.previous, next, me);
					
					if (tmp != null)
					{
						pt2 = tmp;
					}
				}
			}

			// Makes sure the cell under the mousepointer can be detected
			// by moving the preview shape away from the mouse. This
			// makes sure the preview shape does not prevent the detection
			// of the cell under the mousepointer even for slow gestures.
			if (this.currentState == null && this.movePreviewAway)
			{
				var tmp = pt2; 
				
				if (this.edgeState != null && this.edgeState.absolutePoints.length >= 2)
				{
					var tmp2 = this.edgeState.absolutePoints[this.edgeState.absolutePoints.length - 2];
					
					if (tmp2 != null)
					{
						tmp = tmp2;
					}
				}
				
				var dx = current.x - tmp.x;
				var dy = current.y - tmp.y;
				
				var len = Math.sqrt(dx * dx + dy * dy);
				
				if (len == 0)
				{
					return;
				}

				// Stores old point to reuse when creating edge
				this.originalPoint = current.clone();
				current.x -= dx * 4 / len;
				current.y -= dy * 4 / len;
			}
			else
			{
				this.originalPoint = null;
			}
			
			// Creates the preview shape (lazy)
			if (this.shape == null)
			{
				var dx = Math.abs(me.getGraphX() - this.first.x);
				var dy = Math.abs(me.getGraphY() - this.first.y);

				if (dx > this.graph.tolerance || dy > this.graph.tolerance)
				{
					this.shape = this.createShape();

					if (this.edgeState != null)
					{
						this.shape.apply(this.edgeState);
					}
					
					// Revalidates current connection
					this.updateCurrentState(me, point);
				}
			}

			// Updates the points in the preview edge
			if (this.shape != null)
			{
				if (this.edgeState != null)
				{
					this.shape.points = this.edgeState.absolutePoints;
				}
				else
				{
					var pts = [pt2];
					
					if (this.waypoints != null)
					{
						pts = pts.concat(this.waypoints);
					}

					pts.push(current);
					this.shape.points = pts;
				}
				
				this.drawPreview();
			}
			
			// Makes sure endpoint of edge is visible during connect
			if (this.cursor != null)
			{
				this.graph.container.style.cursor = this.cursor;
			}
			
			mxEvent.consume(me.getEvent());
			me.consume();
		}
		else if (!this.isEnabled() || !this.graph.isEnabled())
		{
			this.constraintHandler.reset();
		}
		else if (this.previous != this.currentState && this.edgeState == null)
		{
			this.destroyIcons();
			
			// Sets the cursor on the current shape				
			if (this.currentState != null && this.error == null && this.constraintHandler.currentConstraint == null)
			{
				this.icons = this.createIcons(this.currentState);

				if (this.icons == null)
				{
					this.currentState.setCursor(mxConstants.CURSOR_CONNECT);
					me.consume();
				}
			}

			this.previous = this.currentState;
		}
		else if (this.previous == this.currentState && this.currentState != null && this.icons == null &&
			!this.graph.isMouseDown)
		{
			// Makes sure that no cursors are changed
			me.consume();
		}

		if (!this.graph.isMouseDown && this.currentState != null && this.icons != null)
		{
			var hitsIcon = false;
			var target = me.getSource();
			
			for (var i = 0; i < this.icons.length && !hitsIcon; i++)
			{
				hitsIcon = target == this.icons[i].node || target.parentNode == this.icons[i].node;
			}

			if (!hitsIcon)
			{
				this.updateIcons(this.currentState, this.icons, me);
			}
		}
	}
	else
	{
		this.constraintHandler.reset();
	}
};

/**
 * Function: updateEdgeState
 * 
 * Updates <edgeState>.
 */
mxConnectionHandler.prototype.updateEdgeState = function(current, constraint)
{
	// TODO: Use generic method for writing constraint to style
	if (this.sourceConstraint != null && this.sourceConstraint.point != null)
	{
		this.edgeState.style[mxConstants.STYLE_EXIT_X] = this.sourceConstraint.point.x;
		this.edgeState.style[mxConstants.STYLE_EXIT_Y] = this.sourceConstraint.point.y;
	}

	if (constraint != null && constraint.point != null)
	{
		this.edgeState.style[mxConstants.STYLE_ENTRY_X] = constraint.point.x;
		this.edgeState.style[mxConstants.STYLE_ENTRY_Y] = constraint.point.y;
	}
	else
	{
		delete this.edgeState.style[mxConstants.STYLE_ENTRY_X];
		delete this.edgeState.style[mxConstants.STYLE_ENTRY_Y];
	}
	
	this.edgeState.absolutePoints = [null, (this.currentState != null) ? null : current];
	this.graph.view.updateFixedTerminalPoint(this.edgeState, this.previous, true, this.sourceConstraint);
	
	if (this.currentState != null)
	{
		if (constraint == null)
		{
			constraint = this.graph.getConnectionConstraint(this.edgeState, this.previous, false);
		}
		
		this.edgeState.setAbsoluteTerminalPoint(null, false);
		this.graph.view.updateFixedTerminalPoint(this.edgeState, this.currentState, false, constraint);
	}
	
	// Scales and translates the waypoints to the model
	var realPoints = null;
	
	if (this.waypoints != null)
	{
		realPoints = [];
		
		for (var i = 0; i < this.waypoints.length; i++)
		{
			var pt = this.waypoints[i].clone();
			this.convertWaypoint(pt);
			realPoints[i] = pt;
		}
	}
	
	this.graph.view.updatePoints(this.edgeState, realPoints, this.previous, this.currentState);
	this.graph.view.updateFloatingTerminalPoints(this.edgeState, this.previous, this.currentState);
};

/**
 * Function: getTargetPerimeterPoint
 * 
 * Returns the perimeter point for the given target state.
 * 
 * Parameters:
 * 
 * state - <mxCellState> that represents the target cell state.
 * me - <mxMouseEvent> that represents the mouse move.
 */
mxConnectionHandler.prototype.getTargetPerimeterPoint = function(state, me)
{
	var result = null;
	var view = state.view;
	var targetPerimeter = view.getPerimeterFunction(state);
	
	if (targetPerimeter != null)
	{
		var next = (this.waypoints != null && this.waypoints.length > 0) ?
				this.waypoints[this.waypoints.length - 1] :
				new mxPoint(this.previous.getCenterX(), this.previous.getCenterY());
		var tmp = targetPerimeter(view.getPerimeterBounds(state),
			this.edgeState, next, false);
			
		if (tmp != null)
		{
			result = tmp;
		}
	}
	else
	{
		result = new mxPoint(state.getCenterX(), state.getCenterY());
	}
	
	return result;
};

/**
 * Function: getSourcePerimeterPoint
 * 
 * Hook to update the icon position(s) based on a mouseOver event. This is
 * an empty implementation.
 * 
 * Parameters:
 * 
 * state - <mxCellState> that represents the target cell state.
 * next - <mxPoint> that represents the next point along the previewed edge.
 * me - <mxMouseEvent> that represents the mouse move.
 */
mxConnectionHandler.prototype.getSourcePerimeterPoint = function(state, next, me)
{
	var result = null;
	var view = state.view;
	var sourcePerimeter = view.getPerimeterFunction(state);
	var c = new mxPoint(state.getCenterX(), state.getCenterY());
	
	if (sourcePerimeter != null)
	{
		var theta = mxUtils.getValue(state.style, mxConstants.STYLE_ROTATION, 0);
		var rad = -theta * (Math.PI / 180);
		
		if (theta != 0)
		{
			next = mxUtils.getRotatedPoint(new mxPoint(next.x, next.y), Math.cos(rad), Math.sin(rad), c);
		}
		
		var tmp = sourcePerimeter(view.getPerimeterBounds(state), state, next, false);
			
		if (tmp != null)
		{
			if (theta != 0)
			{
				tmp = mxUtils.getRotatedPoint(new mxPoint(tmp.x, tmp.y), Math.cos(-rad), Math.sin(-rad), c);
			}
			
			result = tmp;
		}
	}
	else
	{
		result = c;
	}
	
	return result;
};


/**
 * Function: updateIcons
 * 
 * Hook to update the icon position(s) based on a mouseOver event. This is
 * an empty implementation.
 * 
 * Parameters:
 * 
 * state - <mxCellState> under the mouse.
 * icons - Array of currently displayed icons.
 * me - <mxMouseEvent> that contains the mouse event.
 */
mxConnectionHandler.prototype.updateIcons = function(state, icons, me)
{
	// empty
};

/**
 * Function: isStopEvent
 * 
 * Returns true if the given mouse up event should stop this handler. The
 * connection will be created if <error> is null. Note that this is only
 * called if <waypointsEnabled> is true. This implemtation returns true
 * if there is a cell state in the given event.
 */
mxConnectionHandler.prototype.isStopEvent = function(me)
{
	return me.getState() != null;
};

/**
 * Function: addWaypoint
 * 
 * Adds the waypoint for the given event to <waypoints>.
 */
mxConnectionHandler.prototype.addWaypointForEvent = function(me)
{
	var point = mxUtils.convertPoint(this.graph.container, me.getX(), me.getY());
	var dx = Math.abs(point.x - this.first.x);
	var dy = Math.abs(point.y - this.first.y);
	var addPoint = this.waypoints != null || (this.mouseDownCounter > 1 &&
			(dx > this.graph.tolerance || dy > this.graph.tolerance));

	if (addPoint)
	{
		if (this.waypoints == null)
		{
			this.waypoints = [];
		}
		
		var scale = this.graph.view.scale;
		var point = new mxPoint(this.graph.snap(me.getGraphX() / scale) * scale,
				this.graph.snap(me.getGraphY() / scale) * scale);
		this.waypoints.push(point);
	}
};

/**
 * Function: checkConstraints
 * 
 * Returns true if the connection for the given constraints is valid. This
 * implementation returns true if the constraints are not pointing to the
 * same fixed connection point.
 */
mxConnectionHandler.prototype.checkConstraints = function(c1, c2)
{
	return (c1 == null || c2 == null || c1.point == null || c2.point == null ||
		!c1.point.equals(c2.point) || c1.dx != c2.dx || c1.dy != c2.dy ||
		c1.perimeter != c2.perimeter);
};

/**
 * Function: mouseUp
 * 
 * Handles the event by inserting the new connection.
 */
mxConnectionHandler.prototype.mouseUp = function(sender, me)
{
	if (!me.isConsumed() && this.isConnecting())
	{
		if (this.waypointsEnabled && !this.isStopEvent(me))
		{
			this.addWaypointForEvent(me);
			me.consume();
			
			return;
		}
		
		var c1 = this.sourceConstraint;
		var c2 = this.constraintHandler.currentConstraint;

		var source = (this.previous != null) ? this.previous.cell : null;
		var target = null;
		
		if (this.constraintHandler.currentConstraint != null &&
			this.constraintHandler.currentFocus != null)
		{
			target = this.constraintHandler.currentFocus.cell;
		}
		
		if (target == null && this.currentState != null)
		{
			target = this.currentState.cell;
		}
		
		// Inserts the edge if no validation error exists and if constraints differ
		if (this.error == null && (source == null || target == null ||
			source != target || this.checkConstraints(c1, c2)))
		{
			this.connect(source, target, me.getEvent(), me.getCell());
		}
		else
		{
			// Selects the source terminal for self-references
			if (this.previous != null && this.marker.validState != null &&
				this.previous.cell == this.marker.validState.cell)
			{
				this.graph.selectCellForEvent(this.marker.source, me.getEvent());
			}
			
			// Displays the error message if it is not an empty string,
			// for empty error messages, the event is silently dropped
			if (this.error != null && this.error.length > 0)
			{
				this.graph.validationAlert(this.error);
			}
		}
		
		// Redraws the connect icons and resets the handler state
		this.destroyIcons();
		me.consume();
	}

	if (this.first != null)
	{
		this.reset();
	}
};

/**
 * Function: reset
 * 
 * Resets the state of this handler.
 */
mxConnectionHandler.prototype.reset = function()
{
	if (this.shape != null)
	{
		this.shape.destroy();
		this.shape = null;
	}
	
	// Resets the cursor on the container
	if (this.cursor != null && this.graph.container != null)
	{
		this.graph.container.style.cursor = '';
	}
	
	this.destroyIcons();
	this.marker.reset();
	this.constraintHandler.reset();
	this.originalPoint = null;
	this.currentPoint = null;
	this.edgeState = null;
	this.previous = null;
	this.error = null;
	this.sourceConstraint = null;
	this.mouseDownCounter = 0;
	this.first = null;

	this.fireEvent(new mxEventObject(mxEvent.RESET));
};

/**
 * Function: drawPreview
 * 
 * Redraws the preview edge using the color and width returned by
 * <getEdgeColor> and <getEdgeWidth>.
 */
mxConnectionHandler.prototype.drawPreview = function()
{
	this.updatePreview(this.error == null);

	if (this.edgeState != null)
	{
		this.edgeState.shape = this.shape;
		this.graph.cellRenderer.postConfigureShape(this.edgeState);
		this.edgeState.shape = null;
	}

	this.shape.redraw();
};

/**
 * Function: getEdgeColor
 * 
 * Returns the color used to draw the preview edge. This returns green if
 * there is no edge validation error and red otherwise.
 * 
 * Parameters:
 * 
 * valid - Boolean indicating if the color for a valid edge should be
 * returned.
 */
mxConnectionHandler.prototype.updatePreview = function(valid)
{
	this.shape.strokewidth = this.getEdgeWidth(valid);
	this.shape.stroke = this.getEdgeColor(valid);
};

/**
 * Function: getEdgeColor
 * 
 * Returns the color used to draw the preview edge. This returns green if
 * there is no edge validation error and red otherwise.
 * 
 * Parameters:
 * 
 * valid - Boolean indicating if the color for a valid edge should be
 * returned.
 */
mxConnectionHandler.prototype.getEdgeColor = function(valid)
{
	return (valid) ? mxConstants.VALID_COLOR : mxConstants.INVALID_COLOR;
};
	
/**
 * Function: getEdgeWidth
 * 
 * Returns the width used to draw the preview edge. This returns 3 if
 * there is no edge validation error and 1 otherwise.
 * 
 * Parameters:
 * 
 * valid - Boolean indicating if the width for a valid edge should be
 * returned.
 */
mxConnectionHandler.prototype.getEdgeWidth = function(valid)
{
	return (valid) ? 3 : 1;
};

/**
 * Function: connect
 * 
 * Connects the given source and target using a new edge. This
 * implementation uses <createEdge> to create the edge.
 * 
 * Parameters:
 * 
 * source - <mxCell> that represents the source terminal.
 * target - <mxCell> that represents the target terminal.
 * evt - Mousedown event of the connect gesture.
 * dropTarget - <mxCell> that represents the cell under the mouse when it was
 * released.
 */
mxConnectionHandler.prototype.connect = function(source, target, evt, dropTarget)
{
	if (target != null || this.isCreateTarget(evt) || this.graph.allowDanglingEdges)
	{
		// Uses the common parent of source and target or
		// the default parent to insert the edge
		var model = this.graph.getModel();
		var terminalInserted = false;
		var edge = null;

		model.beginUpdate();
		try
		{
			if (source != null && target == null && !this.graph.isIgnoreTerminalEvent(evt) && this.isCreateTarget(evt))
			{
				target = this.createTargetVertex(evt, source);
				
				if (target != null)
				{
					dropTarget = this.graph.getDropTarget([target], evt, dropTarget);
					terminalInserted = true;
					
					// Disables edges as drop targets if the target cell was created
					// FIXME: Should not shift if vertex was aligned (same in Java)
					if (dropTarget == null || !this.graph.getModel().isEdge(dropTarget))
					{
						var pstate = this.graph.getView().getState(dropTarget);
						
						if (pstate != null)
						{
							var tmp = model.getGeometry(target);
							tmp.x -= pstate.origin.x;
							tmp.y -= pstate.origin.y;
						}
					}
					else
					{
						dropTarget = this.graph.getDefaultParent();
					}
						
					this.graph.addCell(target, dropTarget);
				}
			}

			var parent = this.graph.getDefaultParent();
			var refSource = this.graph.getReferenceTerminal(source);
			var refTarget = this.graph.getReferenceTerminal(target);
			var refParent = parent;

			if (refSource != null && refTarget != null)
			{
				refParent = model.getNearestCommonAncestor(refSource, refTarget);
			}
			else if (refSource != null)
			{
				refParent = model.getParent(refSource);
			}

			if (refParent != null && !model.isEdge(refParent) &&
				refParent != model.getRoot())
			{
				parent = refParent;
			}

			// Uses the value of the preview edge state for inserting
			// the new edge into the graph
			var value = null;
			var style = null;
			
			if (this.edgeState != null)
			{
				value = this.edgeState.cell.value;
				style = this.edgeState.cell.style;
			}

			edge = this.insertEdge(parent, null, value, source, target, style);
			
			if (edge != null)
			{
				// Updates the connection constraints
				this.graph.setConnectionConstraint(edge, source, true, this.sourceConstraint);
				this.graph.setConnectionConstraint(edge, target, false, this.constraintHandler.currentConstraint);
				
				// Uses geometry of the preview edge state
				if (this.edgeState != null)
				{
					model.setGeometry(edge, this.edgeState.cell.geometry);
				}

				// Inserts non-overlapping edge before source
				if (this.isInsertBefore(edge, source, target, evt, dropTarget) &&
					(this.constraintHandler.currentConstraint == null ||
					this.constraintHandler.currentConstraint.perimeter))
				{
					var tmp = source;

					while (tmp.parent != null && tmp.geometry != null &&
						tmp.geometry.relative && tmp.parent != edge.parent)
					{
						tmp = this.graph.model.getParent(tmp);
					}

					if (tmp != null && tmp.parent != null && tmp.parent == edge.parent)
					{
						model.add(parent, edge, tmp.parent.getIndex(tmp));
					}
				}
				
				// Makes sure the edge has a non-null, relative geometry
				var geo = model.getGeometry(edge);

				if (geo == null)
				{
					geo = new mxGeometry();
					geo.relative = true;
					
					model.setGeometry(edge, geo);
				}
				
				// Uses scaled waypoints in geometry
				if (this.waypoints != null && this.waypoints.length > 0)
				{
					var s = this.graph.view.scale;
					var tr = this.graph.view.translate;
					geo.points = [];
					
					for (var i = 0; i < this.waypoints.length; i++)
					{
						var pt = this.waypoints[i];
						geo.points.push(new mxPoint(pt.x / s - tr.x, pt.y / s - tr.y));
					}
				}

				if (target == null)
				{
					var t = this.graph.view.translate;
					var s = this.graph.view.scale;
					var pt = (this.originalPoint != null) ?
							new mxPoint(this.originalPoint.x / s - t.x, this.originalPoint.y / s - t.y) :
						new mxPoint(this.currentPoint.x / s - t.x, this.currentPoint.y / s - t.y);
					pt.x -= this.graph.panDx / this.graph.view.scale;
					pt.y -= this.graph.panDy / this.graph.view.scale;
					
					var pstate = this.graph.getView().getState(model.getParent(edge))
					
					if (pstate != null)
					{
						pt.x -= pstate.origin.x;
						pt.y -= pstate.origin.y;
					}
					
					geo.setTerminalPoint(pt, false);
				}
				
				this.fireEvent(new mxEventObject(mxEvent.CONNECT, 'cell', edge, 'terminal', target,
					'event', evt, 'target', dropTarget, 'terminalInserted', terminalInserted));
			}
		}
		catch (e)
		{
			mxLog.show();
			mxLog.debug(e.message);
		}
		finally
		{
			model.endUpdate();
		}
		
		if (this.select)
		{
			this.selectCells(edge, (terminalInserted) ? target : null);
		}
	}
};

/**
 * Function: selectCells
 * 
 * Selects the given edge after adding a new connection. The target argument
 * contains the target vertex if one has been inserted.
 */
mxConnectionHandler.prototype.selectCells = function(edge, target)
{
	this.graph.setSelectionCell(edge);
};

/**
 * Function: insertEdge
 * 
 * Creates, inserts and returns the new edge for the given parameters. This
 * implementation does only use <createEdge> if <factoryMethod> is defined,
 * otherwise <mxGraph.insertEdge> will be used.
 */
mxConnectionHandler.prototype.insertEdge = function(parent, id, value, source, target, style)
{
	if (this.factoryMethod == null)
	{
		return this.graph.insertEdge(parent, id, value, source, target, style);
	}
	else
	{
		var edge = this.createEdge(value, source, target, style);
		edge = this.graph.addEdge(edge, parent, source, target);
		
		return edge;
	}
};

/**
 * Function: createTargetVertex
 * 
 * Hook method for creating new vertices on the fly if no target was
 * under the mouse. This is only called if <createTarget> is true and
 * returns null.
 * 
 * Parameters:
 * 
 * evt - Mousedown event of the connect gesture.
 * source - <mxCell> that represents the source terminal.
 */
mxConnectionHandler.prototype.createTargetVertex = function(evt, source)
{
	// Uses the first non-relative source
	var geo = this.graph.getCellGeometry(source);
	
	while (geo != null && geo.relative)
	{
		source = this.graph.getModel().getParent(source);
		geo = this.graph.getCellGeometry(source);
	}
	
	var clone = this.graph.cloneCell(source);
	var geo = this.graph.getModel().getGeometry(clone);
	
	if (geo != null)
	{
		var t = this.graph.view.translate;
		var s = this.graph.view.scale;
		var point = new mxPoint(this.currentPoint.x / s - t.x, this.currentPoint.y / s - t.y);
		geo.x = Math.round(point.x - geo.width / 2 - this.graph.panDx / s);
		geo.y = Math.round(point.y - geo.height / 2 - this.graph.panDy / s);

		// Aligns with source if within certain tolerance
		var tol = this.getAlignmentTolerance();
		
		if (tol > 0)
		{
			var sourceState = this.graph.view.getState(source);
			
			if (sourceState != null)
			{
				var x = sourceState.x / s - t.x;
				var y = sourceState.y / s - t.y;
				
				if (Math.abs(x - geo.x) <= tol)
				{
					geo.x = Math.round(x);
				}
				
				if (Math.abs(y - geo.y) <= tol)
				{
					geo.y = Math.round(y);
				}
			}
		}
	}

	return clone;		
};

/**
 * Function: getAlignmentTolerance
 * 
 * Returns the tolerance for aligning new targets to sources. This returns the grid size / 2.
 */
mxConnectionHandler.prototype.getAlignmentTolerance = function(evt)
{
	return (this.graph.isGridEnabled()) ? this.graph.gridSize / 2 : this.graph.tolerance;
};

/**
 * Function: createEdge
 * 
 * Creates and returns a new edge using <factoryMethod> if one exists. If
 * no factory method is defined, then a new default edge is returned. The
 * source and target arguments are informal, the actual connection is
 * setup later by the caller of this function.
 * 
 * Parameters:
 * 
 * value - Value to be used for creating the edge.
 * source - <mxCell> that represents the source terminal.
 * target - <mxCell> that represents the target terminal.
 * style - Optional style from the preview edge.
 */
mxConnectionHandler.prototype.createEdge = function(value, source, target, style)
{
	var edge = null;
	
	// Creates a new edge using the factoryMethod
	if (this.factoryMethod != null)
	{
		edge = this.factoryMethod(source, target, style);
	}
	
	if (edge == null)
	{
		edge = new mxCell(value || '');
		edge.setEdge(true);
		edge.setStyle(style);
		
		var geo = new mxGeometry();
		geo.relative = true;
		edge.setGeometry(geo);
	}

	return edge;
};

/**
 * Function: destroy
 * 
 * Destroys the handler and all its resources and DOM nodes. This should be
 * called on all instances. It is called automatically for the built-in
 * instance created for each <mxGraph>.
 */
mxConnectionHandler.prototype.destroy = function()
{
	this.graph.removeMouseListener(this);
	
	if (this.shape != null)
	{
		this.shape.destroy();
		this.shape = null;
	}
	
	if (this.marker != null)
	{
		this.marker.destroy();
		this.marker = null;
	}

	if (this.constraintHandler != null)
	{
		this.constraintHandler.destroy();
		this.constraintHandler = null;
	}

	if (this.changeHandler != null)
	{
		this.graph.getModel().removeListener(this.changeHandler);
		this.graph.getView().removeListener(this.changeHandler);
		this.changeHandler = null;
	}
	
	if (this.drillHandler != null)
	{
		this.graph.removeListener(this.drillHandler);
		this.graph.getView().removeListener(this.drillHandler);
		this.drillHandler = null;
	}
	
	if (this.escapeHandler != null)
	{
		this.graph.removeListener(this.escapeHandler);
		this.escapeHandler = null;
	}
};
