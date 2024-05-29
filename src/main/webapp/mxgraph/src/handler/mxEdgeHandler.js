/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: mxEdgeHandler
 *
 * Graph event handler that reconnects edges and modifies control points and
 * the edge label location. Uses <mxTerminalMarker> for finding and
 * highlighting new source and target vertices. This handler is automatically
 * created in <mxGraph.createHandler> for each selected edge.
 * 
 * To enable adding/removing control points, the following code can be used:
 * 
 * (code)
 * mxEdgeHandler.prototype.addEnabled = true;
 * mxEdgeHandler.prototype.removeEnabled = true;
 * (end)
 * 
 * Note: This experimental feature is not recommended for production use.
 * 
 * Constructor: mxEdgeHandler
 *
 * Constructs an edge handler for the specified <mxCellState>.
 * 
 * Parameters:
 * 
 * state - <mxCellState> of the cell to be handled.
 */
function mxEdgeHandler(state)
{
	if (state != null && state.shape != null)
	{
		this.state = state;
		this.init();
		
		// Handles escape keystrokes
		this.escapeHandler = mxUtils.bind(this, function(sender, evt)
		{
			var dirty = this.index != null;
			this.reset();
			
			if (dirty)
			{
				this.graph.cellRenderer.redraw(this.state,
					false, state.view.isRendering());
			}
		});
		
		this.state.view.graph.addListener(mxEvent.ESCAPE, this.escapeHandler);
	}
};

/**
 * Variable: graph
 * 
 * Reference to the enclosing <mxGraph>.
 */
mxEdgeHandler.prototype.graph = null;

/**
 * Variable: state
 * 
 * Reference to the <mxCellState> being modified.
 */
mxEdgeHandler.prototype.state = null;

/**
 * Variable: marker
 * 
 * Holds the <mxTerminalMarker> which is used for highlighting terminals.
 */
mxEdgeHandler.prototype.marker = null;

/**
 * Variable: constraintHandler
 * 
 * Holds the <mxConstraintHandler> used for drawing and highlighting
 * constraints.
 */
mxEdgeHandler.prototype.constraintHandler = null;

/**
 * Variable: error
 * 
 * Holds the current validation error while a connection is being changed.
 */
mxEdgeHandler.prototype.error = null;

/**
 * Variable: shape
 * 
 * Holds the <mxShape> that represents the preview edge.
 */
mxEdgeHandler.prototype.shape = null;

/**
 * Variable: bends
 * 
 * Holds the <mxShapes> that represent the points.
 */
mxEdgeHandler.prototype.bends = null;

/**
 * Variable: labelShape
 * 
 * Holds the <mxShape> that represents the label position.
 */
mxEdgeHandler.prototype.labelShape = null;

/**
 * Variable: cloneEnabled
 * 
 * Specifies if cloning by control-drag is enabled. Default is true.
 */
mxEdgeHandler.prototype.cloneEnabled = true;

/**
 * Variable: addEnabled
 * 
 * Specifies if adding bends by shift-click is enabled. Default is false.
 * Note: This experimental feature is not recommended for production use.
 */
mxEdgeHandler.prototype.addEnabled = false;

/**
 * Variable: removeEnabled
 * 
 * Specifies if removing bends by shift-click is enabled. Default is false.
 * Note: This experimental feature is not recommended for production use.
 */
mxEdgeHandler.prototype.removeEnabled = false;

/**
 * Variable: dblClickRemoveEnabled
 * 
 * Specifies if removing bends by double click is enabled. Default is false.
 */
mxEdgeHandler.prototype.dblClickRemoveEnabled = false;

/**
 * Variable: mergeRemoveEnabled
 * 
 * Specifies if removing bends by dropping them on other bends is enabled.
 * Default is false.
 */
mxEdgeHandler.prototype.mergeRemoveEnabled = false;

/**
 * Variable: straightRemoveEnabled
 * 
 * Specifies if removing bends by creating straight segments should be enabled.
 * If enabled, this can be overridden by holding down the alt key while moving.
 * Default is false.
 */
mxEdgeHandler.prototype.straightRemoveEnabled = false;

/**
 * Variable: virtualBendsEnabled
 * 
 * Specifies if virtual bends should be added in the center of each
 * segments. These bends can then be used to add new waypoints.
 * Default is false.
 */
mxEdgeHandler.prototype.virtualBendsEnabled = false;

/**
 * Variable: virtualBendOpacity
 * 
 * Opacity to be used for virtual bends (see <virtualBendsEnabled>).
 * Default is 40.
 */
mxEdgeHandler.prototype.virtualBendOpacity = 40;

/**
 * Variable: parentHighlightEnabled
 * 
 * Specifies if the parent should be highlighted if a child cell is selected.
 * Default is false.
 */
mxEdgeHandler.prototype.parentHighlightEnabled = false;

/**
 * Variable: preferHtml
 * 
 * Specifies if bends should be added to the graph container. This is updated
 * in <init> based on whether the edge or one of its terminals has an HTML
 * label in the container.
 */
mxEdgeHandler.prototype.preferHtml = false;

/**
 * Variable: allowHandleBoundsCheck
 * 
 * Specifies if the bounds of handles should be used for hit-detection in IE
 * Default is true.
 */
mxEdgeHandler.prototype.allowHandleBoundsCheck = true;

/**
 * Variable: snapToTerminals
 * 
 * Specifies if waypoints should snap to the routing centers of terminals.
 * Default is false.
 */
mxEdgeHandler.prototype.snapToTerminals = false;

/**
 * Variable: handleImage
 * 
 * Optional <mxImage> to be used as handles. Default is null.
 */
mxEdgeHandler.prototype.handleImage = null;

/**
 * Variable: tolerance
 * 
 * Optional tolerance for hit-detection in <getHandleForEvent>. Default is 0.
 */
mxEdgeHandler.prototype.tolerance = 0;

/**
 * Variable: outlineConnect
 * 
 * Specifies if connections to the outline of a highlighted target should be
 * enabled. This will allow to place the connection point along the outline of
 * the highlighted target. Default is false.
 */
mxEdgeHandler.prototype.outlineConnect = false;

/**
 * Variable: manageLabelHandle
 * 
 * Specifies if the label handle should be moved if it intersects with another
 * handle. Uses <checkLabelHandle> for checking and moving. Default is false.
 */
mxEdgeHandler.prototype.manageLabelHandle = false;

/**
 * Function: init
 * 
 * Initializes the shapes required for this edge handler.
 */
mxEdgeHandler.prototype.init = function()
{
	this.graph = this.state.view.graph;
	this.marker = this.createMarker();
	
	// Clones the original points from the cell
	// and makes sure at least one point exists
	this.points = [];
	
	// Uses the absolute points of the state
	// for the initial configuration and preview
	this.abspoints = this.getSelectionPoints(this.state);
	this.shape = this.createSelectionShape(this.abspoints);
	this.shape.dialect = (this.graph.dialect != mxConstants.DIALECT_SVG) ?
		mxConstants.DIALECT_MIXEDHTML : mxConstants.DIALECT_SVG;
	this.shape.init(this.graph.getView().getOverlayPane());
	this.shape.svgStrokeTolerance = 0;
	this.shape.pointerEvents = false;
	mxEvent.redirectMouseEvents(this.shape.node, this.graph, this.state);

	if (this.graph.isCellMovable(this.state.cell))
	{
		this.shape.setCursor(mxConstants.CURSOR_MOVABLE_EDGE);
	}

	// Updates preferHtml
	this.preferHtml = this.state.text != null &&
		this.state.text.node.parentNode == this.graph.container;
	
	if (!this.preferHtml)
	{
		// Checks source terminal
		var sourceState = this.state.getVisibleTerminalState(true);
		
		if (sourceState != null)
		{
			this.preferHtml = sourceState.text != null &&
				sourceState.text.node.parentNode == this.graph.container;
		}
		
		if (!this.preferHtml)
		{
			// Checks target terminal
			var targetState = this.state.getVisibleTerminalState(false);
			
			if (targetState != null)
			{
				this.preferHtml = targetState.text != null &&
				targetState.text.node.parentNode == this.graph.container;
			}
		}
	}

	this.updateParentHighlight();
	this.refresh();
	this.redraw();
};

/**
 * Function: createLabelShape
 * 
 * Creates, initializes and returns the label shape.
 */
mxEdgeHandler.prototype.createLabelShape = function()
{
	var shape = this.createLabelHandleShape();
	this.initBend(shape);

	return shape;
};

/**
 * Function: getConstraintHandler
 * 
 * Returns the constraint handler. This implementation creates a new
 * <mxConstraintHandler> if one does not yet exist.
 */
mxEdgeHandler.prototype.getConstraintHandler = function()
{
	if (this.constraintHandler == null)
	{
		this.constraintHandler = this.createConstraintHandler();
	}

	return this.constraintHandler;
};

/**
 * Function: createConstraintHandler
 * 
 * Creates and returns a new <mxConstraintHandler> for this handler.
 */
mxEdgeHandler.prototype.createConstraintHandler = function()
{
	return new mxConstraintHandler(this.graph);
};

/**
 * Function: isParentHighlightVisible
 * 
 * Returns true if the parent highlight should be visible. This implementation
 * always returns true.
 */
mxEdgeHandler.prototype.isParentHighlightVisible = mxVertexHandler.prototype.isParentHighlightVisible;

/**
 * Function: destroyParentHighlight
 * 
 * Destroys the parent highlight.
 */
mxEdgeHandler.prototype.destroyParentHighlight = mxVertexHandler.prototype.destroyParentHighlight;

/**
 * Function: updateParentHighlight
 * 
 * Updates the highlight of the parent if <parentHighlightEnabled> is true.
 */
mxEdgeHandler.prototype.updateParentHighlight = mxVertexHandler.prototype.updateParentHighlight;

/**
 * Function: createCustomHandles
 * 
 * Returns an array of custom handles. This implementation returns null.
 */
mxEdgeHandler.prototype.createCustomHandles = function()
{
	return null;
};

/**
 * Function: isVirtualBendsEnabled
 * 
 * Returns true if virtual bends should be added. This returns true if
 * <virtualBendsEnabled> is true and the current style allows and
 * renders custom waypoints.
 */
mxEdgeHandler.prototype.isVirtualBendsEnabled = function(evt)
{
	return this.virtualBendsEnabled && (this.state.style[mxConstants.STYLE_EDGE] == null ||
			this.state.style[mxConstants.STYLE_EDGE] == mxConstants.NONE ||
			this.state.style[mxConstants.STYLE_NOEDGESTYLE] == 1)  &&
			mxUtils.getValue(this.state.style, mxConstants.STYLE_SHAPE, null) != 'arrow';
};

/**
 * Function: isCellEnabled
 * 
 * Returns true if the given cell allows new connections to be created. This implementation
 * always returns true.
 */
mxEdgeHandler.prototype.isCellEnabled = function(cell)
{
	return true;
};

/**
 * Function: isAddPointEvent
 * 
 * Returns true if the given event is a trigger to add a new point. This
 * implementation returns true if shift is pressed.
 */
mxEdgeHandler.prototype.isAddPointEvent = function(evt)
{
	return mxEvent.isShiftDown(evt);
};

/**
 * Function: isRemovePointEvent
 * 
 * Returns true if the given event is a trigger to remove a point. This
 * implementation returns true if shift is pressed.
 */
mxEdgeHandler.prototype.isRemovePointEvent = function(evt)
{
	return mxEvent.isShiftDown(evt);
};

/**
 * Function: getSelectionPoints
 * 
 * Returns the list of points that defines the selection stroke.
 */
mxEdgeHandler.prototype.getSelectionPoints = function(state)
{
	return state.absolutePoints;
};

/**
 * Function: createParentHighlightShape
 * 
 * Creates the shape used to draw the selection border.
 */
mxEdgeHandler.prototype.createParentHighlightShape = function(bounds)
{
	var shape = new mxRectangleShape(mxRectangle.fromRectangle(bounds),
		null, this.getSelectionColor());
	shape.strokewidth = this.getSelectionStrokeWidth();
	shape.isDashed = this.isSelectionDashed();
	
	return shape;
};

/**
 * Function: createSelectionShape
 * 
 * Creates the shape used to draw the selection border.
 */
mxEdgeHandler.prototype.createSelectionShape = function(points)
{
	var shape = new this.state.shape.constructor();
	shape.outline = true;
	shape.apply(this.state);
	
	shape.isDashed = this.isSelectionDashed();
	shape.stroke = this.getSelectionColor();
	shape.isShadow = false;
	
	return shape;
};

/**
 * Function: getSelectionColor
 * 
 * Returns <mxConstants.EDGE_SELECTION_COLOR>.
 */
mxEdgeHandler.prototype.getSelectionColor = function()
{
	return (this.graph.isCellEditable(this.state.cell)) ?
		mxConstants.EDGE_SELECTION_COLOR :
		mxConstants.LOCKED_HANDLE_FILLCOLOR;
};

/**
 * Function: getSelectionStrokeWidth
 * 
 * Returns <mxConstants.EDGE_SELECTION_STROKEWIDTH>.
 */
mxEdgeHandler.prototype.getSelectionStrokeWidth = function()
{
	return mxConstants.EDGE_SELECTION_STROKEWIDTH;
};

/**
 * Function: isSelectionDashed
 * 
 * Returns <mxConstants.EDGE_SELECTION_DASHED>.
 */
mxEdgeHandler.prototype.isSelectionDashed = function()
{
	return mxConstants.EDGE_SELECTION_DASHED;
};

/**
 * Function: isConnectableCell
 * 
 * Returns true if the given cell is connectable. This is a hook to
 * disable floating connections. This implementation returns true.
 */
mxEdgeHandler.prototype.isConnectableCell = function(cell)
{
	return true;
};

/**
 * Function: getCellAt
 * 
 * Creates and returns the <mxCellMarker> used in <marker>.
 */
mxEdgeHandler.prototype.getCellAt = function(x, y)
{
	return (!this.outlineConnect) ? this.graph.getCellAt(x, y) : null;
};

/**
 * Function: createMarker
 * 
 * Creates and returns the <mxCellMarker> used in <marker>.
 */
mxEdgeHandler.prototype.createMarker = function()
{
	var marker = new mxCellMarker(this.graph);
	var self = this; // closure

	// Only returns edges if they are connectable and never returns
	// the edge that is currently being modified
	marker.getCell = function(me)
	{
		var cell = mxCellMarker.prototype.getCell.apply(this, arguments);

		// Checks for cell at preview point (with grid)
		if ((cell == self.state.cell || cell == null) && self.currentPoint != null)
		{
			cell = self.graph.getCellAt(self.currentPoint.x, self.currentPoint.y);
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
		
		var model = self.graph.getModel();
		
		if ((this.graph.isSwimlane(cell) && self.currentPoint != null &&
			this.graph.hitsSwimlaneContent(cell, self.currentPoint.x, self.currentPoint.y)) ||
			(!self.isConnectableCell(cell)) || (cell == self.state.cell ||
			(cell != null && !self.graph.connectableEdges && model.isEdge(cell))) ||
			model.isAncestor(self.state.cell, cell))
		{
			cell = null;
		}
		
		if (!this.graph.isCellConnectable(cell))
		{
			cell = null;
		}
		
		return cell;
	};

	// Sets the highlight color according to validateConnection
	marker.isValidState = function(state)
	{
		var model = self.graph.getModel();
		var other = self.graph.view.getTerminalPort(state,
			self.graph.view.getState(model.getTerminal(self.state.cell,
			!self.isSource)), !self.isSource);
		var otherCell = (other != null) ? other.cell : null;
		var source = (self.isSource) ? state.cell : otherCell;
		var target = (self.isSource) ? otherCell : state.cell;
		
		// Updates the error message of the handler
		self.error = self.validateConnection(source, target);

		return self.error == null;
	};
	
	return marker;
};

/**
 * Function: validateConnection
 * 
 * Returns the error message or an empty string if the connection for the
 * given source, target pair is not valid. Otherwise it returns null. This
 * implementation uses <mxGraph.getEdgeValidationError>.
 * 
 * Parameters:
 * 
 * source - <mxCell> that represents the source terminal.
 * target - <mxCell> that represents the target terminal.
 */
mxEdgeHandler.prototype.validateConnection = function(source, target)
{
	return this.graph.getEdgeValidationError(this.state.cell, source, target);
};

/**
 * Function: createBends
 * 
 * Creates and returns the bends used for modifying the edge. This is
 * typically an array of <mxRectangleShapes>.
 */
 mxEdgeHandler.prototype.createBends = function()
 {
	var cell = this.state.cell;
	var bends = [];

	if (this.abspoints != null)
	{
		for (var i = 0; i < this.abspoints.length; i++)
		{
			if (this.isHandleVisible(i))
			{
				var source = i == 0;
				var target = i == this.abspoints.length - 1;
				var terminal = source || target;

				if (terminal || this.graph.isCellBendable(cell))
				{
					(mxUtils.bind(this, function(index)
					{
						var bend = this.createHandleShape(index, null, index == this.abspoints.length - 1);
						this.initBend(bend, mxUtils.bind(this, mxUtils.bind(this, function()
						{
							if (this.dblClickRemoveEnabled)
							{
								this.removePoint(this.state, index);
							}
						})));
		
						if (this.isHandleEnabled(i))
						{
							bend.setCursor((terminal) ? mxConstants.CURSOR_TERMINAL_HANDLE : mxConstants.CURSOR_BEND_HANDLE);
						}
						
						bends.push(bend);
					
						if (!terminal)
						{
							this.points.push(new mxPoint(0,0));
							bend.node.style.visibility = 'hidden';
						}
					}))(i);
				}
			}
		}
	}

	return bends;
};

/**
 * Function: createVirtualBends
 * 
 * Creates and returns the bends used for modifying the edge. This is
 * typically an array of <mxRectangleShapes>.
 */
 mxEdgeHandler.prototype.createVirtualBends = function()
 {
	var bends = [];

	if (this.abspoints != null && this.abspoints.length > 0 &&
		this.graph.isCellBendable(this.state.cell))
	{
		for (var i = 1; i < this.abspoints.length; i++)
		{
			(mxUtils.bind(this, function(bend)
			{
				this.initBend(bend);
				bend.setCursor(mxConstants.CURSOR_VIRTUAL_BEND_HANDLE);
				bends.push(bend);
			}))(this.createHandleShape());
		}
	}

	return bends;
};

/**
 * Function: isHandleEnabled
 * 
 * Creates the shape used to display the given bend.
 */
mxEdgeHandler.prototype.isHandleEnabled = function(index)
{
	return true;
};

/**
 * Function: isHandleVisible
 * 
 * Returns true if the handle at the given index is visible.
 */
mxEdgeHandler.prototype.isHandleVisible = function(index)
{
	var source = this.state.getVisibleTerminalState(true);
	var target = this.state.getVisibleTerminalState(false);
	var geo = this.graph.getCellGeometry(this.state.cell);
	var edgeStyle = (geo != null) ? this.graph.view.getEdgeStyle(this.state, geo.points, source, target) : null;

	return edgeStyle != mxEdgeStyle.EntityRelation || index == 0 || index == this.abspoints.length - 1;
};

/**
 * Function: createHandleShape
 * 
 * Creates the shape used to display the given bend. Note that the index may be
 * null for special cases, such as when called from
 * <mxElbowEdgeHandler.createVirtualBend>. Only images and rectangles should be
 * returned if support for HTML labels with not foreign objects is required.
 * Index if null for virtual handles.
 */
mxEdgeHandler.prototype.createHandleShape = function(index)
{
	if (this.handleImage != null)
	{
		var shape = new mxImageShape(new mxRectangle(0, 0, this.handleImage.width, this.handleImage.height), this.handleImage.src);
		
		// Allows HTML rendering of the images
		shape.preserveImageAspect = false;

		return shape;
	}
	else
	{
		var s = mxConstants.HANDLE_SIZE;
		
		if (this.preferHtml)
		{
			s -= 1;
		}
		
		return new mxRectangleShape(new mxRectangle(0, 0, s, s), mxConstants.HANDLE_FILLCOLOR, mxConstants.HANDLE_STROKECOLOR);
	}
};

/**
 * Function: createLabelHandleShape
 * 
 * Creates the shape used to display the the label handle.
 */
mxEdgeHandler.prototype.createLabelHandleShape = function()
{
	if (this.labelHandleImage != null)
	{
		var shape = new mxImageShape(new mxRectangle(0, 0, this.labelHandleImage.width, this.labelHandleImage.height), this.labelHandleImage.src);
		
		// Allows HTML rendering of the images
		shape.preserveImageAspect = false;

		return shape;
	}
	else
	{
		var s = mxConstants.LABEL_HANDLE_SIZE;
		return new mxRectangleShape(new mxRectangle(0, 0, s, s), mxConstants.LABEL_HANDLE_FILLCOLOR, mxConstants.HANDLE_STROKECOLOR);
	}
};

/**
 * Function: initBend
 * 
 * Helper method to initialize the given bend.
 * 
 * Parameters:
 * 
 * bend - <mxShape> that represents the bend to be initialized.
 */
mxEdgeHandler.prototype.initBend = function(bend, dblClick)
{
	if (this.preferHtml)
	{
		bend.dialect = mxConstants.DIALECT_STRICTHTML;
		bend.init(this.graph.container);
	}
	else
	{
		bend.dialect = (this.graph.dialect != mxConstants.DIALECT_SVG) ?
			mxConstants.DIALECT_MIXEDHTML : mxConstants.DIALECT_SVG;
		bend.init(this.graph.getView().getOverlayPane());
	}

	mxEvent.redirectMouseEvents(bend.node, this.graph, this.state,
			null, null, null, dblClick);
	
	if (mxClient.IS_TOUCH)
	{
		bend.node.setAttribute('pointer-events', 'none');
	}
};

/**
 * Function: getHandleForEvent
 * 
 * Returns the index of the handle for the given event.
 */
mxEdgeHandler.prototype.getHandleForEvent = function(me)
{
	var result = null;
	
	if (this.state != null)
	{
		// Connection highlight may consume events before they reach sizer handle
		var tol = (!mxEvent.isMouseEvent(me.getEvent())) ? 2 * this.tolerance : 0;
		var hit = (!this.allowHandleBoundsCheck) ? null :
			new mxRectangle(me.getGraphX() - tol, me.getGraphY() - tol, tol, tol);
		var minDistSq = null;
	
		function checkShape(shape)
		{
			if (shape != null && (me.isSource(shape) ||
				shape.intersectsRectangle(hit)))
			{
				var dx = me.getGraphX() - shape.bounds.getCenterX();
				var dy = me.getGraphY() - shape.bounds.getCenterY();
				var tmp = dx * dx + dy * dy;
				
				if (minDistSq == null || tmp <= minDistSq)
				{
					minDistSq = tmp;
				
					return true;
				}
			}
			
			return false;
		}
		
		if (this.customHandles != null && this.isCustomHandleEvent(me))
		{
			// Inverse loop order to match display order
			for (var i = this.customHandles.length - 1; i >= 0; i--)
			{
				if (checkShape(this.customHandles[i].shape))
				{
					// LATER: Return reference to active shape
					return mxEvent.CUSTOM_HANDLE - i;
				}
			}
		}
		
		if (this.state.text != null && (me.isSource(this.state.text) ||
			checkShape(this.labelShape)))
		{
			result = mxEvent.LABEL_HANDLE;
		}
		
		if (this.bends != null)
		{
			for (var i = 0; i < this.bends.length; i++)
			{
				if (checkShape(this.bends[i]))
				{
					result = i;
				}
			}
		}
		
		if (this.virtualBends != null && this.isAddVirtualBendEvent(me))
		{
			for (var i = 0; i < this.virtualBends.length; i++)
			{
				if (checkShape(this.virtualBends[i]))
				{
					result = mxEvent.VIRTUAL_HANDLE - i;
				}
			}
		}
	}

	return result;
};

/**
 * Function: isAddVirtualBendEvent
 * 
 * Returns true if the given event allows virtual bends to be added. This
 * implementation returns true.
 */
mxEdgeHandler.prototype.isAddVirtualBendEvent = function(me)
{
	return true;
};

/**
 * Function: isCustomHandleEvent
 * 
 * Returns true if the given event allows custom handles to be changed. This
 * implementation returns true.
 */
mxEdgeHandler.prototype.isCustomHandleEvent = function(me)
{
	return true;
};

/**
 * Function: mouseDown
 * 
 * Handles the event by checking if a special element of the handler
 * was clicked, in which case the index parameter is non-null. The
 * indices may be one of <LABEL_HANDLE> or the number of the respective
 * control point. The source and target points are used for reconnecting
 * the edge.
 */
mxEdgeHandler.prototype.mouseDown = function(sender, me)
{
	if (this.graph.isCellEditable(this.state.cell))
	{
		var handle = this.getHandleForEvent(me);
		
		if (this.bends != null && this.bends[handle] != null)
		{
			var b = this.bends[handle].bounds;
			this.snapPoint = new mxPoint(b.getCenterX(), b.getCenterY());
		}
		
		if (this.addEnabled && handle == null && this.isAddPointEvent(me.getEvent()))
		{
			this.addPoint(this.state, me.getEvent());
			me.consume();
		}
		else if (handle != null && !me.isConsumed() && this.graph.isEnabled())
		{
			if (this.removeEnabled && this.isRemovePointEvent(me.getEvent()))
			{
				this.removePoint(this.state, handle);
			}
			else if (handle != mxEvent.LABEL_HANDLE || this.graph.isLabelMovable(me.getCell()))
			{
				if (handle <= mxEvent.VIRTUAL_HANDLE)
				{
					mxUtils.setOpacity(this.virtualBends[mxEvent.VIRTUAL_HANDLE - handle].node, 100);
				}

				this.mouseDownX = me.getX();
				this.mouseDownY = me.getY();
				this.handle = handle;
			}

			if (!mxEvent.isShiftDown(me.getEvent()))
			{
				me.consume();
			}
		}
	}
};

/**
 * Function: start
 * 
 * Starts the handling of the mouse gesture.
 */
mxEdgeHandler.prototype.start = function(x, y, index)
{
	this.startX = x;
	this.startY = y;

	this.isSource = (this.bends == null) ? false : index == 0;
	this.isTarget = (this.bends == null) ? false : index == this.bends.length - 1;
	this.isLabel = index == mxEvent.LABEL_HANDLE;

	if (this.isSource || this.isTarget)
	{
		var cell = this.state.cell;
		var terminal = this.graph.model.getTerminal(cell, this.isSource);

		if ((terminal == null && this.graph.isTerminalPointMovable(cell, this.isSource)) ||
			(terminal != null && this.graph.isCellDisconnectable(cell, terminal, this.isSource)))
		{
			this.index = index;
		}
	}
	else
	{
		this.index = index;
	}
	
	// Hides other custom handles
	if (this.index <= mxEvent.CUSTOM_HANDLE && this.index > mxEvent.VIRTUAL_HANDLE)
	{
		if (this.customHandles != null)
		{
			for (var i = 0; i < this.customHandles.length; i++)
			{
				if (i != mxEvent.CUSTOM_HANDLE - this.index)
				{
					this.customHandles[i].setVisible(false);
				}
			}
		}
	}
};

/**
 * Function: clonePreviewState
 * 
 * Returns a clone of the current preview state for the given point and terminal.
 */
mxEdgeHandler.prototype.clonePreviewState = function(point, terminal)
{
	return this.state.clone();
};

/**
 * Function: getSnapToTerminalTolerance
 * 
 * Returns the tolerance for the guides. Default value is 2.
 */
mxEdgeHandler.prototype.getSnapToTerminalTolerance = function()
{
	return 2;
};

/**
 * Function: updateHint
 * 
 * Hook for subclassers do show details while the handler is active.
 */
mxEdgeHandler.prototype.updateHint = function(me, point) { };

/**
 * Function: removeHint
 * 
 * Hooks for subclassers to hide details when the handler gets inactive.
 */
mxEdgeHandler.prototype.removeHint = function() { };

/**
 * Function: roundLength
 * 
 * Hook for rounding the unscaled width or height. This uses Math.round.
 */
mxEdgeHandler.prototype.roundLength = function(length)
{
	return Math.round(length);
};

/**
 * Function: isSnapToTerminalsEvent
 * 
 * Returns true if <snapToTerminals> is true and if alt is not pressed.
 */
mxEdgeHandler.prototype.isSnapToTerminalsEvent = function(me)
{
	return this.snapToTerminals && !mxEvent.isAltDown(me.getEvent());
};

/**
 * Function: getPointForEvent
 * 
 * Returns the point for the given event.
 */
mxEdgeHandler.prototype.getPointForEvent = function(me)
{
	var view = this.graph.getView();
	var scale = view.scale;
	var point = new mxPoint(this.roundLength(me.getGraphX() / scale) * scale,
		this.roundLength(me.getGraphY() / scale) * scale);
	
	var tt = this.getSnapToTerminalTolerance();
	var overrideX = false;
	var overrideY = false;		
	
	if (tt > 0 && this.isSnapToTerminalsEvent(me))
	{
		function snapToPoint(pt)
		{
			if (pt != null)
			{
				var x = pt.x;

				if (Math.abs(point.x - x) < tt)
				{
					point.x = x;
					overrideX = true;
				}
				
				var y = pt.y;

				if (Math.abs(point.y - y) < tt)
				{
					point.y = y;
					overrideY = true;
				}
			}
		}

		function snapToTerminal(terminal)
		{
			if (terminal != null)
			{
				snapToPoint.call(this, new mxPoint(view.getRoutingCenterX(terminal),
						view.getRoutingCenterY(terminal)));
			}
		};

		snapToTerminal.call(this, this.state.getVisibleTerminalState(true));
		snapToTerminal.call(this, this.state.getVisibleTerminalState(false));
		var pts = this.state.absolutePoints;

		if (pts != null)
		{
			for (var i = 0; i < pts.length; i++)
			{
				if ((i > 0 || !this.state.isFloatingTerminalPoint(true)) &&
					(i < pts.length - 1 || !this.state.isFloatingTerminalPoint(false)))
				{
					snapToPoint.call(this, this.state.absolutePoints[i]);
				}
			}
		}
	}

	if (this.graph.isGridEnabledEvent(me.getEvent()))
	{
		var tr = view.translate;
		
		if (!overrideX)
		{
			point.x = (this.graph.snap(point.x / scale - tr.x) + tr.x) * scale;
		}
		
		if (!overrideY)
		{
			point.y = (this.graph.snap(point.y / scale - tr.y) + tr.y) * scale;
		}
	}
	
	return point;
};

/**
 * Function: getPreviewTerminalState
 * 
 * Updates the given preview state taking into account the state of the constraint handler.
 */
mxEdgeHandler.prototype.getPreviewTerminalState = function(me)
{
	var constraintHandler = this.getConstraintHandler();
	constraintHandler.update(me, this.isSource, true, me.isSource(this.marker.highlight.shape) ? null : this.currentPoint);
	
	if (constraintHandler.currentFocus != null && constraintHandler.currentConstraint != null)
	{
		// Handles special case where grid is large and connection point is at actual point in which
		// case the outline is not followed as long as we're < gridSize / 2 away from that point
		if (this.marker.highlight != null && this.marker.highlight.state != null &&
			this.marker.highlight.state.cell == constraintHandler.currentFocus.cell)
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
			this.marker.markCell(constraintHandler.currentFocus.cell, 'transparent');
		}
		
		var model = this.graph.getModel();
		var other = this.graph.view.getTerminalPort(this.state,
				this.graph.view.getState(model.getTerminal(this.state.cell,
			!this.isSource)), !this.isSource);
		var otherCell = (other != null) ? other.cell : null;
		var source = (this.isSource) ? constraintHandler.currentFocus.cell : otherCell;
		var target = (this.isSource) ? otherCell : constraintHandler.currentFocus.cell;
		
		// Updates the error message of the handler
		this.error = this.validateConnection(source, target);
		var result = null;
		
		if (this.error == null)
		{
			result = constraintHandler.currentFocus;
		}
		
		if (this.error != null || (result != null &&
			!this.isCellEnabled(result.cell)))
		{
			constraintHandler.reset();
		}
		
		return result;
	}
	else if (!this.graph.isIgnoreTerminalEvent(me.getEvent()))
	{
		this.marker.process(me);
		var state = this.marker.getValidState();
		
		if (state != null && !this.isCellEnabled(state.cell))
		{
			constraintHandler.reset();
			this.marker.reset();
		}
		
		return this.marker.getValidState();
	}
	else
	{
		this.marker.reset();
		
		return null;
	}
};

/**
 * Function: getPreviewPoints
 * 
 * Updates the given preview state taking into account the state of the constraint handler.
 * 
 * Parameters:
 * 
 * pt - <mxPoint> that contains the current pointer position.
 * me - Optional <mxMouseEvent> that contains the current event.
 */
mxEdgeHandler.prototype.getPreviewPoints = function(pt, me)
{
	var geometry = this.graph.getCellGeometry(this.state.cell);
	var points = (geometry.points != null) ? geometry.points.slice() : null;
	var point = new mxPoint(pt.x, pt.y);
	var result = null;
	
	if (!this.isSource && !this.isTarget)
	{
		this.convertPoint(point, false);
		
		if (points == null)
		{
			points = [point];
		}
		else
		{
			// Adds point from virtual bend
			if (this.index <= mxEvent.VIRTUAL_HANDLE)
			{
				points.splice(mxEvent.VIRTUAL_HANDLE - this.index, 0, point);
			}

			// Removes point if dragged on terminal point
			if (!this.isSource && !this.isTarget)
			{
				for (var i = 0; i < this.bends.length; i++)
				{
					if (i != this.index)
					{
						var bend = this.bends[i];
						
						if (bend != null && mxUtils.contains(bend.bounds, pt.x, pt.y))
						{
							if (this.index <= mxEvent.VIRTUAL_HANDLE)
							{
								points.splice(mxEvent.VIRTUAL_HANDLE - this.index, 1);
							}
							else
							{
								points.splice(this.index - 1, 1);
							}
							
							result = points;
						}
					}
				}
				
				// Removes point if user tries to straighten a segment
				if (result == null && this.straightRemoveEnabled && (me == null || !mxEvent.isAltDown(me.getEvent())))
				{
					var tol = this.graph.tolerance * this.graph.tolerance;
					var abs = this.state.absolutePoints.slice();
					abs[this.index] = pt;
					
					// Handes special case where removing waypoint affects tolerance (flickering)
					var src = this.state.getVisibleTerminalState(true);
					
					if (src != null)
					{
						var c = this.graph.getConnectionConstraint(this.state, src, true);
						
						// Checks if point is not fixed
						if (c == null || this.graph.getConnectionPoint(src, c) == null)
						{
							abs[0] = new mxPoint(src.view.getRoutingCenterX(src), src.view.getRoutingCenterY(src));
						}
					}
					
					var trg = this.state.getVisibleTerminalState(false);
					
					if (trg != null)
					{
						var c = this.graph.getConnectionConstraint(this.state, trg, false);
						
						// Checks if point is not fixed
						if (c == null || this.graph.getConnectionPoint(trg, c) == null)
						{
							abs[abs.length - 1] = new mxPoint(trg.view.getRoutingCenterX(trg), trg.view.getRoutingCenterY(trg));
						}
					}

					function checkRemove(idx, tmp)
					{
						if (idx > 0 && idx < abs.length - 1 &&
							mxUtils.ptSegDistSq(abs[idx - 1].x, abs[idx - 1].y,
								abs[idx + 1].x, abs[idx + 1].y, tmp.x, tmp.y) < tol)
						{
							points.splice(idx - 1, 1);
							result = points;
						}
					};
					
					// LATER: Check if other points can be removed if a segment is made straight
					checkRemove(this.index, pt);
				}
			}
			
			// Updates existing point
			if (result == null && this.index > mxEvent.VIRTUAL_HANDLE)
			{
				points[this.index - 1] = point;
			}
		}
	}
	else if (this.graph.resetEdgesOnConnect)
	{
		points = null;
	}
	
	return (result != null) ? result : points;
};

/**
 * Function: isOutlineConnectEvent
 * 
 * Returns true if <outlineConnect> is true and the source of the event is the
 * outline shape or shift is pressed.
 */
mxEdgeHandler.prototype.isOutlineConnectEvent = function(me)
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
 * Function: updatePreviewState
 * 
 * Updates the given preview state taking into account the state of the constraint handler.
 */
mxEdgeHandler.prototype.updatePreviewState = function(edge, point, terminalState, me, outline)
{
	// Computes the points for the edge style and terminals
	var sourceState = (this.isSource) ? terminalState : this.state.getVisibleTerminalState(true);
	var targetState = (this.isTarget) ? terminalState : this.state.getVisibleTerminalState(false);
	
	var sourceConstraint = this.graph.getConnectionConstraint(edge, sourceState, true);
	var targetConstraint = this.graph.getConnectionConstraint(edge, targetState, false);

	var constraintHandler = this.getConstraintHandler();
	var constraint = constraintHandler.currentConstraint;

	if (constraint == null && outline)
	{
		if (terminalState != null)
		{
			// Handles special case where mouse is on outline away from actual end point
			// in which case the grid is ignored and mouse point is used instead
			if (me.isSource(this.marker.highlight.shape))
			{
				point = new mxPoint(me.getGraphX(), me.getGraphY());
			}
			
			constraint = this.graph.getOutlineConstraint(point, terminalState, me);
			constraintHandler.setFocus(me, terminalState, this.isSource);
			constraintHandler.currentConstraint = constraint;
			constraintHandler.currentPoint = point;
		}
		else
		{
			constraint = new mxConnectionConstraint();
		}
	}
	
	if (this.outlineConnect && this.marker.highlight != null && this.marker.highlight.shape != null)
	{
		var s = this.graph.view.scale;
		
		if (constraintHandler.currentConstraint != null &&
			constraintHandler.currentFocus != null)
		{
			this.marker.highlight.shape.stroke = (outline) ? mxConstants.OUTLINE_HIGHLIGHT_COLOR : 'transparent';
			this.marker.highlight.shape.strokewidth = mxConstants.OUTLINE_HIGHLIGHT_STROKEWIDTH / s / s;
			this.marker.highlight.repaint();
		}
		else if (this.marker.hasValidState())
		{
			this.marker.highlight.shape.stroke = (this.graph.isCellConnectable(me.getCell()) &&
				this.marker.getValidState() != me.getState()) ?
				'transparent' : mxConstants.DEFAULT_VALID_COLOR;
			this.marker.highlight.shape.strokewidth = mxConstants.HIGHLIGHT_STROKEWIDTH / s / s;
			this.marker.highlight.repaint();
		}
	}
	
	if (this.isSource)
	{
		sourceConstraint = constraint;
	}
	else if (this.isTarget)
	{
		targetConstraint = constraint;
	}
	
	if (this.isSource || this.isTarget)
	{
		if (constraint != null && constraint.point != null)
		{
			edge.style[(this.isSource) ? mxConstants.STYLE_EXIT_X : mxConstants.STYLE_ENTRY_X] = constraint.point.x;
			edge.style[(this.isSource) ? mxConstants.STYLE_EXIT_Y : mxConstants.STYLE_ENTRY_Y] = constraint.point.y;
		}
		else
		{
			delete edge.style[(this.isSource) ? mxConstants.STYLE_EXIT_X : mxConstants.STYLE_ENTRY_X];
			delete edge.style[(this.isSource) ? mxConstants.STYLE_EXIT_Y : mxConstants.STYLE_ENTRY_Y];
		}
	}
	
	edge.setVisibleTerminalState(sourceState, true);
	edge.setVisibleTerminalState(targetState, false);
	
	if (!this.isSource || sourceState != null)
	{
		edge.view.updateFixedTerminalPoint(edge, sourceState, true, sourceConstraint);
	}
	
	if (!this.isTarget || targetState != null)
	{
		edge.view.updateFixedTerminalPoint(edge, targetState, false, targetConstraint);
	}
	
	if ((this.isSource || this.isTarget) && terminalState == null)
	{
		edge.setAbsoluteTerminalPoint(point, this.isSource);

		if (this.marker.getMarkedState() == null)
		{
			this.error = (this.graph.allowDanglingEdges) ? null : '';
		}
	}
	
	edge.view.updatePoints(edge, this.points, sourceState, targetState);
	edge.view.updateFloatingTerminalPoints(edge, sourceState, targetState);
};

/**
 * Function: mouseMove
 * 
 * Handles the event by updating the preview.
 */
mxEdgeHandler.prototype.mouseMove = function(sender, me)
{
	if (this.index != null && this.marker != null)
	{
		var constraintHandler = this.getConstraintHandler();
		this.currentPoint = this.getPointForEvent(me);
		this.error = null;
		
		// Uses the current point from the constraint handler if available
		if (this.snapPoint != null && mxEvent.isShiftDown(me.getEvent()) &&
			!this.graph.isIgnoreTerminalEvent(me.getEvent()) &&
			constraintHandler.currentFocus == null &&
			constraintHandler.currentFocus != this.state)
		{
			if (Math.abs(this.snapPoint.x - this.currentPoint.x) <
				Math.abs(this.snapPoint.y - this.currentPoint.y))
			{
				this.currentPoint.x = this.snapPoint.x;
			}
			else
			{
				this.currentPoint.y = this.snapPoint.y;
			}
		}
		
		if (this.index <= mxEvent.CUSTOM_HANDLE && this.index > mxEvent.VIRTUAL_HANDLE)
		{
			if (this.customHandles != null)
			{
				this.customHandles[mxEvent.CUSTOM_HANDLE - this.index].processEvent(me);
				this.customHandles[mxEvent.CUSTOM_HANDLE - this.index].positionChanged();
				
				if (this.shape != null && this.shape.node != null)
				{
					this.shape.node.style.display = 'none';
				}
			}
		}
		else if (this.isLabel)
		{
			this.label.x = this.currentPoint.x;
			this.label.y = this.currentPoint.y;
		}
		else
		{
			this.points = this.getPreviewPoints(this.currentPoint, me);
			var terminalState = (this.isSource || this.isTarget) ? this.getPreviewTerminalState(me) : null;
			
			if (constraintHandler.currentConstraint != null &&
				constraintHandler.currentFocus != null &&
				constraintHandler.currentPoint != null)
			{
				this.currentPoint = constraintHandler.currentPoint.clone();
			}
			else if (this.outlineConnect)
			{
				// Need to check outline before cloning terminal state
				var outline = (this.isSource || this.isTarget) ? this.isOutlineConnectEvent(me) : false
						
				if (outline)
				{
					terminalState = this.marker.highlight.state;
				}
				else if (terminalState != null && terminalState != me.getState() &&
					this.graph.isCellConnectable(me.getCell()) &&
					this.marker.highlight.shape != null)
				{
					this.marker.highlight.shape.stroke = 'transparent';
					this.marker.highlight.repaint();
					terminalState = null;
				}
			}
			
			if (terminalState != null && !this.isCellEnabled(terminalState.cell))
			{
				terminalState = null;
				this.marker.reset();
			}
			
			var clone = this.clonePreviewState(this.currentPoint, (terminalState != null) ? terminalState.cell : null);
			this.updatePreviewState(clone, this.currentPoint, terminalState, me, outline);

			// Sets the color of the preview to valid or invalid, updates the
			// points of the preview and redraws
			var color = (this.error == null) ? this.marker.validColor : this.marker.invalidColor;
			this.setPreviewColor(color);
			this.abspoints = clone.absolutePoints;
			this.active = true;
			this.updateHint(me, this.currentPoint, clone);
		}

		// This should go before calling isOutlineConnectEvent above. As a workaround
		// we add an offset of gridSize to the hint to avoid problem with hit detection
		// in highlight.isHighlightAt (which uses comonentFromPoint)
		this.drawPreview();
		mxEvent.consume(me.getEvent());
		me.consume();
	}
	else if (!mxEvent.isShiftDown(me.getEvent()) && this.handle != null &&
		this.mouseDownX != null && this.mouseDownY != null)
	{
		var tol = this.graph.tolerance;

		if ((Math.abs(this.mouseDownX - me.getX()) > tol ||
			Math.abs(this.mouseDownY - me.getY()) > tol))
		{
			this.start(this.mouseDownX, this.mouseDownY, this.handle);
		}
	}
};

/**
 * Function: mouseUp
 * 
 * Handles the event to applying the previewed changes on the edge by
 * using <moveLabel>, <connect> or <changePoints>.
 */
mxEdgeHandler.prototype.mouseUp = function(sender, me)
{
	// Workaround for wrong event source in Webkit
	if (this.index != null && this.marker != null)
	{
		if (this.shape != null && this.shape.node != null)
		{
			this.shape.node.style.display = '';
		}
		
		var edge = this.state.cell;
		var index = this.index;
		this.index = null;

		// Ignores event if mouse has not been moved
		if (me.getX() != this.startX || me.getY() != this.startY)
		{
			var clone = !this.graph.isIgnoreTerminalEvent(me.getEvent()) &&
				this.cloneEnabled && this.graph.isCloneEvent(me.getEvent()) &&
				this.graph.isCellsCloneable();
			
			// Displays the reason for not carriying out the change
			// if there is an error message with non-zero length
			if (this.error != null)
			{
				if (this.error.length > 0)
				{
					this.graph.validationAlert(this.error);
				}
			}
			else if (index <= mxEvent.CUSTOM_HANDLE && index > mxEvent.VIRTUAL_HANDLE)
			{
				if (this.customHandles != null)
				{
					var model = this.graph.getModel();
					
					model.beginUpdate();
					try
					{
						this.customHandles[mxEvent.CUSTOM_HANDLE - index].execute(me);
										
						if (this.shape != null && this.shape.node != null)
						{
							this.shape.apply(this.state);
							this.shape.redraw();
						}
					}
					finally
					{
						model.endUpdate();
					}
				}
			}
			else if (this.isLabel)
			{
				this.moveLabel(this.state, this.label.x, this.label.y);
			}
			else if (this.isSource || this.isTarget)
			{
				var terminal = null;

				if (this.constraintHandler != null &&
					this.constraintHandler.currentConstraint != null &&
					this.constraintHandler.currentFocus != null)
				{
					terminal = this.constraintHandler.currentFocus.cell;
				}
				
				if (terminal == null && this.marker.hasValidState() && this.marker.highlight != null &&
					this.marker.highlight.shape != null &&
					this.marker.highlight.shape.stroke != 'transparent' &&
					this.marker.highlight.shape.stroke != 'white')
				{
					terminal = this.marker.validState.cell;
				}
				
				if (terminal != null)
				{
					var model = this.graph.getModel();
					var parent = model.getParent(edge);
					
					model.beginUpdate();
					try
					{
						// Clones and adds the cell
						if (clone)
						{
							var geo = model.getGeometry(edge);
							var clonedEdge = this.graph.cloneCell(edge);
							model.add(parent, clonedEdge, model.getChildCount(parent));
							
							if (geo != null)
							{
								geo = geo.clone();
								model.setGeometry(clonedEdge, geo);
							}
							
							var other = model.getTerminal(edge, !this.isSource);
							this.graph.connectCell(clonedEdge, other, !this.isSource);
							edge = clonedEdge;
						}
						
						edge = this.connect(edge, terminal, this.isSource, clone, me);
					}
					finally
					{
						model.endUpdate();
					}
				}
				else if (this.graph.isAllowDanglingEdges())
				{
					var pt = this.abspoints[(this.isSource) ? 0 : this.abspoints.length - 1];
					pt.x = this.roundLength(pt.x / this.graph.view.scale - this.graph.view.translate.x);
					pt.y = this.roundLength(pt.y / this.graph.view.scale - this.graph.view.translate.y);

					var pstate = this.graph.getView().getState(
							this.graph.getModel().getParent(edge));
							
					if (pstate != null)
					{
						pt.x -= pstate.origin.x;
						pt.y -= pstate.origin.y;
					}
					
					pt.x -= this.graph.panDx / this.graph.view.scale;
					pt.y -= this.graph.panDy / this.graph.view.scale;
										
					// Destroys and recreates this handler
					edge = this.changeTerminalPoint(edge, pt, this.isSource, clone);
				}
			}
			else if (this.active)
			{
				edge = this.changePoints(edge, this.points, clone);
			}
			else
			{
				this.graph.getView().invalidate(this.state.cell);
				this.graph.getView().validate(this.state.cell);
			}
		}
		else if (this.graph.isToggleEvent(me.getEvent()))
		{
			this.graph.selectCellForEvent(this.state.cell, me.getEvent());
		}

		// Resets the preview color the state of the handler if this
		// handler has not been recreated
		if (this.marker != null)
		{
			this.reset();

			// Updates the selection if the edge has been cloned
			if (edge != this.state.cell)
			{
				this.graph.setSelectionCell(edge);
			}
		}

		me.consume();
	}
	else if (this.handle != null && this.bends != null &&
		!mxEvent.isAltDown(me.getEvent()) && (this.handle == 0 ||
		this.handle == this.bends.length - 1))
	{
		var terminal = this.state.getVisibleTerminal(this.handle == 0);

		if (terminal != null)
		{
			this.graph.selectCellForEvent(terminal, me.getEvent());
			me.consume();
		}
	}
	
	this.handle = null;
	this.mouseDownX = null;
	this.mouseDownY = null;
};

/**
 * Function: reset
 * 
 * Resets the state of this handler.
 */
mxEdgeHandler.prototype.reset = function()
{
	if (this.active)
	{
		this.refresh();
	}
	
	this.error = null;
	this.index = null;
	this.label = null;
	this.points = null;
	this.handle = null;
	this.startX = null;
	this.startY = null;
	this.mouseDownX = null;
	this.mouseDownY = null;
	this.snapPoint = null;
	this.isLabel = false;
	this.isSource = false;
	this.isTarget = false;
	this.active = false;
	
	if (this.livePreview && this.sizers != null)
	{
		for (var i = 0; i < this.sizers.length; i++)
		{
			if (this.sizers[i] != null)
			{
				this.sizers[i].node.style.display = '';
			}
		}
	}

	if (this.marker != null)
	{
		this.marker.reset();
	}
	
	if (this.constraintHandler != null)
	{
		this.constraintHandler.reset();
	}
	
	if (this.customHandles != null)
	{
		for (var i = 0; i < this.customHandles.length; i++)
		{
			this.customHandles[i].reset();
		}
	}

	this.setPreviewColor(mxConstants.EDGE_SELECTION_COLOR);
	this.removeHint();
	this.redraw();
};

/**
 * Function: setPreviewColor
 * 
 * Sets the color of the preview to the given value.
 */
mxEdgeHandler.prototype.setPreviewColor = function(color)
{
	if (this.shape != null)
	{
		this.shape.stroke = color;
	}
};


/**
 * Function: convertPoint
 * 
 * Converts the given point in-place from screen to unscaled, untranslated
 * graph coordinates and applies the grid. Returns the given, modified
 * point instance.
 * 
 * Parameters:
 * 
 * point - <mxPoint> to be converted.
 * gridEnabled - Boolean that specifies if the grid should be applied.
 */
mxEdgeHandler.prototype.convertPoint = function(point, gridEnabled)
{
	var scale = this.graph.getView().getScale();
	var tr = this.graph.getView().getTranslate();
		
	if (gridEnabled)
	{
		point.x = this.graph.snap(point.x);
		point.y = this.graph.snap(point.y);
	}
	
	point.x = Math.round(point.x / scale - tr.x);
	point.y = Math.round(point.y / scale - tr.y);

	var pstate = this.graph.getView().getState(
		this.graph.getModel().getParent(this.state.cell));

	if (pstate != null)
	{
		point.x -= pstate.origin.x;
		point.y -= pstate.origin.y;
	}

	return point;
};

/**
 * Function: moveLabel
 * 
 * Changes the coordinates for the label of the given edge.
 * 
 * Parameters:
 * 
 * edge - <mxCell> that represents the edge.
 * x - Integer that specifies the x-coordinate of the new location.
 * y - Integer that specifies the y-coordinate of the new location.
 */
mxEdgeHandler.prototype.moveLabel = function(edgeState, x, y)
{
	var model = this.graph.getModel();
	var geometry = model.getGeometry(edgeState.cell);
	
	if (geometry != null)
	{
		var scale = this.graph.getView().scale;
		geometry = geometry.clone();
		
		if (geometry.relative)
		{
			// Resets the relative location stored inside the geometry
			var pt = this.graph.getView().getRelativePoint(edgeState, x, y);
			geometry.x = Math.round(pt.x * 10000) / 10000;
			geometry.y = Math.round(pt.y);
			
			// Resets the offset inside the geometry to find the offset
			// from the resulting point
			geometry.offset = new mxPoint(0, 0);
			var pt = this.graph.view.getPoint(edgeState, geometry);
			geometry.offset = new mxPoint(Math.round((x - pt.x) / scale), Math.round((y - pt.y) / scale));
		}
		else
		{
			var points = edgeState.absolutePoints;
			var p0 = points[0];
			var pe = points[points.length - 1];
			
			if (p0 != null && pe != null)
			{
				var cx = p0.x + (pe.x - p0.x) / 2;
				var cy = p0.y + (pe.y - p0.y) / 2;
				
				geometry.offset = new mxPoint(Math.round((x - cx) / scale), Math.round((y - cy) / scale));
				geometry.x = 0;
				geometry.y = 0;
			}
		}

		model.setGeometry(edgeState.cell, geometry);
	}
};

/**
 * Function: connect
 * 
 * Changes the terminal or terminal point of the given edge in the graph
 * model.
 * 
 * Parameters:
 * 
 * edge - <mxCell> that represents the edge to be reconnected.
 * terminal - <mxCell> that represents the new terminal.
 * isSource - Boolean indicating if the new terminal is the source or
 * target terminal.
 * isClone - Boolean indicating if the new connection should be a clone of
 * the old edge.
 * me - <mxMouseEvent> that contains the mouse up event.
 */
mxEdgeHandler.prototype.connect = function(edge, terminal, isSource, isClone, me)
{
	var model = this.graph.getModel();
	
	model.beginUpdate();
	try
	{
		var constraint = (this.constraintHandler != null) ?
			this.constraintHandler.currentConstraint : null;
		
		if (constraint == null)
		{
			constraint = new mxConnectionConstraint();
		}

		this.graph.connectCell(edge, terminal, isSource, constraint);
	}
	finally
	{
		model.endUpdate();
	}
	
	return edge;
};

/**
 * Function: changeTerminalPoint
 * 
 * Changes the terminal point of the given edge.
 */
mxEdgeHandler.prototype.changeTerminalPoint = function(edge, point, isSource, clone)
{
	var model = this.graph.getModel();

	model.beginUpdate();
	try
	{
		if (clone)
		{
			var parent = model.getParent(edge);
			var terminal = model.getTerminal(edge, !isSource);
			edge = this.graph.cloneCell(edge);
			model.add(parent, edge, model.getChildCount(parent));
			model.setTerminal(edge, terminal, !isSource);
		}

		var geo = model.getGeometry(edge);
		
		if (geo != null)
		{
			geo = geo.clone();
			geo.setTerminalPoint(point, isSource);
			model.setGeometry(edge, geo);
			this.graph.connectCell(edge, null, isSource, new mxConnectionConstraint());
		}
	}
	finally
	{
		model.endUpdate();
	}
	
	return edge;
};

/**
 * Function: changePoints
 * 
 * Changes the control points of the given edge in the graph model.
 */
mxEdgeHandler.prototype.changePoints = function(edge, points, clone)
{
	var model = this.graph.getModel();
	model.beginUpdate();
	try
	{
		if (clone)
		{
			var parent = model.getParent(edge);
			var source = model.getTerminal(edge, true);
			var target = model.getTerminal(edge, false);
			edge = this.graph.cloneCell(edge);
			model.add(parent, edge, model.getChildCount(parent));
			model.setTerminal(edge, source, true);
			model.setTerminal(edge, target, false);
		}
		
		var geo = model.getGeometry(edge);
		
		if (geo != null)
		{
			geo = geo.clone();
			geo.points = points;
			
			model.setGeometry(edge, geo);
		}
	}
	finally
	{
		model.endUpdate();
	}
	
	return edge;
};

/**
 * Function: addPoint
 * 
 * Adds a control point for the given state and event.
 */
mxEdgeHandler.prototype.addPoint = function(state, evt)
{
	var pt = mxUtils.convertPoint(this.graph.container, mxEvent.getClientX(evt),
			mxEvent.getClientY(evt));
	var gridEnabled = this.graph.isGridEnabledEvent(evt);
	this.convertPoint(pt, gridEnabled);
	this.addPointAt(state, pt.x, pt.y);
	mxEvent.consume(evt);
};

/**
 * Function: addPointAt
 * 
 * Adds a control point at the given point.
 */
mxEdgeHandler.prototype.addPointAt = function(state, x, y)
{
	var geo = this.graph.getCellGeometry(state.cell);
	var pt = new mxPoint(x, y);
	
	if (geo != null)
	{
		geo = geo.clone();
		var t = this.graph.view.translate;
		var s = this.graph.view.scale;
		var offset = new mxPoint(t.x * s, t.y * s);
		
		var parent = this.graph.model.getParent(this.state.cell);
		
		if (this.graph.model.isVertex(parent))
		{
			var pState = this.graph.view.getState(parent);
			offset = new mxPoint(pState.x, pState.y);
		}
		
		var index = mxUtils.findNearestSegment(state, pt.x * s + offset.x, pt.y * s + offset.y);

		if (geo.points == null)
		{
			geo.points = [pt];
		}
		else
		{
			geo.points.splice(index, 0, pt);
		}
		
		this.graph.getModel().setGeometry(state.cell, geo);
		this.refresh();	
		this.redraw();
	}
};

/**
 * Function: removePoint
 * 
 * Removes the control point at the given index from the given state.
 */
mxEdgeHandler.prototype.removePoint = function(state, index)
{
	if (index > 0 && index < this.abspoints.length - 1)
	{
		var geo = this.graph.getCellGeometry(this.state.cell);
		
		if (geo != null && geo.points != null)
		{
			geo = geo.clone();
			geo.points.splice(index - 1, 1);
			this.graph.getModel().setGeometry(state.cell, geo);
			this.refresh();
			this.redraw();
		}
	}
};

/**
 * Function: getHandleFillColor
 * 
 * Returns the fillcolor for the handle at the given index.
 */
mxEdgeHandler.prototype.getHandleFillColor = function(index)
{
	var isSource = index == 0;
	var cell = this.state.cell;
	var terminal = this.graph.getModel().getTerminal(cell, isSource);
	var color = mxConstants.HANDLE_FILLCOLOR;
	
	if ((terminal != null && !this.graph.isCellDisconnectable(cell, terminal, isSource)) ||
		(terminal == null && !this.graph.isTerminalPointMovable(cell, isSource)))
	{
		color = mxConstants.LOCKED_HANDLE_FILLCOLOR;
	}
	else if (terminal != null && this.graph.isCellDisconnectable(cell, terminal, isSource))
	{
		color = mxConstants.CONNECT_HANDLE_FILLCOLOR;
	}
	
	return color;
};

/**
 * Function: redraw
 * 
 * Redraws the preview, and the bends- and label control points.
 */
mxEdgeHandler.prototype.redraw = function(ignoreHandles)
{
	if (this.state != null && this.state.absolutePoints != null)
	{
		this.abspoints = this.state.absolutePoints.slice();
		var g = this.graph.getModel().getGeometry(this.state.cell);
		
		if (g != null)
		{
			var pts = g.points;
		
			if (this.bends != null && this.bends.length > 0)
			{
				if (pts != null)
				{
					if (this.points == null)
					{
						this.points = [];
					}
					
					for (var i = 1; i < this.bends.length - 1; i++)
					{
						if (this.bends[i] != null && this.abspoints[i] != null)
						{
							this.points[i - 1] = pts[i - 1];
						}
					}
				}
			}
		}
		
		this.drawPreview();
		
		if (!ignoreHandles)
		{
			this.redrawHandles();
		}
	}
};

/**
 * Function: isTerminalHandleVisible
 * 
 * Redraws the handles.
 */
mxEdgeHandler.prototype.isTerminalHandleVisible = function(source)
{
	return true;
};

/**
 * Function: redrawHandles
 * 
 * Redraws the handles.
 */
mxEdgeHandler.prototype.redrawHandles = function()
{
	var cell = this.state.cell;

	// Updates the handle for the label position
	if (this.labelShape != null)
	{
		var b = this.labelShape.bounds;
		this.label = new mxPoint(this.state.absoluteOffset.x, this.state.absoluteOffset.y);
		this.labelShape.bounds = new mxRectangle(Math.round(this.label.x - b.width / 2),
			Math.round(this.label.y - b.height / 2), b.width, b.height);

		// Shows or hides the label handle depending on the label
		var lab = this.graph.getLabel(cell);
		this.labelShape.visible = lab != null && lab.length > 0 &&
			this.graph.isCellEditable(this.state.cell) &&
			this.graph.isLabelMovable(cell) &&
			this.isHandlesVisible();
	}
	
	if (this.bends != null && this.bends.length > 0)
	{
		var n = this.abspoints.length - 1;
		
		var p0 = this.abspoints[0];
		var x0 = p0.x;
		var y0 = p0.y;
		
		b = this.bends[0].bounds;
		this.bends[0].bounds = new mxRectangle(Math.floor(x0 - b.width / 2),
				Math.floor(y0 - b.height / 2), b.width, b.height);
		this.bends[0].fill = this.getHandleFillColor(0);
		this.bends[0].redraw();
		
		if (this.manageLabelHandle)
		{
			this.checkLabelHandle(this.bends[0].bounds);
		}

		this.bends[0].node.style.visibility = (!this.isHandlesVisible() ||
			!this.isTerminalHandleVisible(true)) ? 'hidden' : '';
			
		var pe = this.abspoints[n];
		var xn = pe.x;
		var yn = pe.y;
		
		var bn = this.bends.length - 1;
		b = this.bends[bn].bounds;
		this.bends[bn].bounds = new mxRectangle(Math.floor(xn - b.width / 2),
				Math.floor(yn - b.height / 2), b.width, b.height);
		this.bends[bn].fill = this.getHandleFillColor(bn);
		this.bends[bn].redraw();
				
		if (this.manageLabelHandle)
		{
			this.checkLabelHandle(this.bends[bn].bounds);
		}

		this.bends[bn].node.style.visibility = (!this.isHandlesVisible() ||
			!this.isTerminalHandleVisible(false)) ? 'hidden' : '';
		this.redrawInnerBends(p0, pe);
	}

	if (this.abspoints != null && this.virtualBends != null && this.virtualBends.length > 0)
	{
		var last = this.abspoints[0];
		
		for (var i = 0; i < this.virtualBends.length; i++)
		{
			if (this.virtualBends[i] != null && this.abspoints[i + 1] != null)
			{
				var pt = this.abspoints[i + 1];
				var b = this.virtualBends[i];
				var x = last.x + (pt.x - last.x) / 2;
				var y = last.y + (pt.y - last.y) / 2;
				b.bounds = new mxRectangle(Math.floor(x - b.bounds.width / 2),
						Math.floor(y - b.bounds.height / 2), b.bounds.width, b.bounds.height);
				b.redraw();
				mxUtils.setOpacity(b.node, this.virtualBendOpacity);
				last = pt;
				
				if (this.manageLabelHandle)
				{
					this.checkLabelHandle(b.bounds);
				}

				b.node.style.visibility = (!this.isHandlesVisible()) ? 'hidden' : '';
			}
		}
	}
	
	if (this.labelShape != null)
	{
		this.labelShape.redraw();
	}
	
	if (this.customHandles != null)
	{
		for (var i = 0; i < this.customHandles.length; i++)
		{
			var temp = this.customHandles[i].shape.node.style.display;
			this.customHandles[i].redraw();
			this.customHandles[i].shape.node.style.display = temp;

			// Hides custom handles during text editing
			this.customHandles[i].shape.node.style.visibility =
				(this.graph.isEditing() || !this.isHandlesVisible() ||
				!this.isCustomHandleVisible(this.customHandles[i])) ?
					'hidden' : '';
		}
	}
};

/**
 * Function: isCustomHandleVisible
 * 
 * Returns true if the given custom handle is visible.
 */
mxEdgeHandler.prototype.isCustomHandleVisible = function(handle)
{
	return this.state.view.graph.getSelectionCount() == 1;
};

/**
 * Function: hideHandles
 * 
 * Shortcut to <hideSizers>.
 */
mxEdgeHandler.prototype.setHandlesVisible = function(visible)
{
	if (this.bends != null)
	{
		for (var i = 0; i < this.bends.length; i++)
		{
			if (this.bends[i] != null)
			{
				this.bends[i].node.style.display = (visible) ? '' : 'none';
			}
		}
	}
	
	if (this.virtualBends != null)
	{
		for (var i = 0; i < this.virtualBends.length; i++)
		{
			if (this.virtualBends[i] != null)
			{
				this.virtualBends[i].node.style.display = (visible) ? '' : 'none';
			}
		}
	}

	if (this.labelShape != null)
	{
		this.labelShape.node.style.display = (visible) ? '' : 'none';
	}
	
	if (this.customHandles != null)
	{
		for (var i = 0; i < this.customHandles.length; i++)
		{
			this.customHandles[i].setVisible(visible);
		}
	}
};

/**
 * Function: redrawInnerBends
 * 
 * Updates and redraws the inner bends.
 * 
 * Parameters:
 * 
 * p0 - <mxPoint> that represents the location of the first point.
 * pe - <mxPoint> that represents the location of the last point.
 */
mxEdgeHandler.prototype.redrawInnerBends = function(p0, pe)
{
	for (var i = 1; i < this.bends.length - 1; i++)
	{
		if (this.bends[i] != null)
		{
			if (this.abspoints[i] != null)
			{
				var x = this.abspoints[i].x;
				var y = this.abspoints[i].y;
				
				var b = this.bends[i].bounds;
				this.bends[i].bounds = new mxRectangle(Math.round(x - b.width / 2),
						Math.round(y - b.height / 2), b.width, b.height);
				
				if (this.manageLabelHandle)
				{
					this.checkLabelHandle(this.bends[i].bounds);
				}
				else if (this.handleImage == null && this.labelShape.visible && mxUtils.intersects(this.bends[i].bounds, this.labelShape.bounds))
				{
					w = mxConstants.HANDLE_SIZE + 3;
					h = mxConstants.HANDLE_SIZE + 3;
					this.bends[i].bounds = new mxRectangle(Math.round(x - w / 2), Math.round(y - h / 2), w, h);
				}
				
				this.bends[i].redraw();
				this.bends[i].node.style.visibility = (!this.isHandlesVisible()) ? 'hidden' : '';
			}
			else
			{
				this.bends[i].destroy();
				this.bends[i] = null;
			}
		}
	}
};

/**
 * Function: checkLabelHandle
 * 
 * Checks if the label handle intersects the given bounds and moves it if it
 * intersects.
 */
mxEdgeHandler.prototype.checkLabelHandle = function(b)
{
	if (this.labelShape != null)
	{
		var b2 = this.labelShape.bounds;
		
		if (mxUtils.intersects(b, b2))
		{
			if (b.getCenterY() < b2.getCenterY())
			{
				b2.y = b.y + b.height;
			}
			else
			{
				b2.y = b.y - b2.height;
			}
		}
	}
};

/**
 * Function: drawPreview
 * 
 * Redraws the preview.
 */
mxEdgeHandler.prototype.drawPreview = function()
{
	try
	{
		if (this.isLabel)
		{
			var b = this.labelShape.bounds;
			var bounds = new mxRectangle(Math.round(this.label.x - b.width / 2),
				Math.round(this.label.y - b.height / 2), b.width, b.height);
			
			if (!this.labelShape.bounds.equals(bounds))
			{
				this.labelShape.bounds = bounds;
				this.labelShape.redraw();
			}
		}
		
		if (this.shape != null && !mxUtils.equalPoints(this.shape.points, this.abspoints))
		{
			this.shape.apply(this.state);
			this.shape.points = this.abspoints.slice();
			this.shape.scale = this.state.view.scale;
			this.shape.isDashed = this.isSelectionDashed();
			this.shape.stroke = this.getSelectionColor();
			this.shape.strokewidth = this.getSelectionStrokeWidth() / this.shape.scale / this.shape.scale;
			this.shape.isShadow = false;
			this.shape.redraw();
		}
		
		this.updateParentHighlight();
	}
	catch (e)
	{
		// ignore
	}
};

/**
 * Function: isHandlesVisible
 * 
 * Returns true if all handles should be visible.
 */
mxEdgeHandler.prototype.isHandlesVisible = function()
{
	return !this.graph.isCellLocked(this.state.cell) &&
		(mxGraphHandler.prototype.maxCells <= 0 ||
		this.graph.getSelectionCount() <= mxGraphHandler.prototype.maxCells);
};

/**
 * Function: refresh
 * 
 * Refreshes the bends of this handler.
 */
mxEdgeHandler.prototype.refresh = function()
{
	if (this.state != null)
	{
		this.abspoints = this.getSelectionPoints(this.state);
		this.points = [];

		if (this.shape != null)
		{
			this.shape.isDashed = this.isSelectionDashed();
			this.shape.stroke = this.getSelectionColor();
			this.shape.isShadow = false;
			this.shape.redraw();
		}

		if (this.bends != null)
		{
			this.destroyBends(this.bends);
			this.bends = null;
		}
		
		if (this.isHandlesVisible())
		{
			this.bends = this.createBends();
		}

		if (this.virtualBends != null)
		{
			this.destroyBends(this.virtualBends);
			this.virtualBends = null;
		}
		
		if (this.isHandlesVisible())
		{
			this.virtualBends = this.createVirtualBends();
		}

		if (this.customHandles != null)
		{
			this.destroyBends(this.customHandles);
			this.customHandles = null;
		}
		
		if (this.isHandlesVisible())
		{
			this.customHandles = this.createCustomHandles();
		}

		if (this.labelShape != null)
		{
			this.labelShape.destroy();
			this.labelShape = null;
		}

		if (this.isHandlesVisible())
		{
			this.labelShape = this.createLabelShape();

			// Puts label node on top of bends
			if (this.labelShape != null && this.labelShape.node != null &&
				this.labelShape.node.parentNode != null)
			{
				this.labelShape.node.parentNode.appendChild(this.labelShape.node);
			}
		}
	}
};

/**
 * Function: isDestroyed
 * 
 * Returns true if <destroy> was called.
 */
mxEdgeHandler.prototype.isDestroyed = function()
{
	return this.shape == null;
};

/**
 * Function: destroyBends
 * 
 * Destroys all elements in <bends>.
 */
mxEdgeHandler.prototype.destroyBends = function(bends)
{
	if (bends != null)
	{
		for (var i = 0; i < bends.length; i++)
		{
			if (bends[i] != null)
			{
				bends[i].destroy();
			}
		}
	}
};

/**
 * Function: destroy
 * 
 * Destroys the handler and all its resources and DOM nodes. This does
 * normally not need to be called as handlers are destroyed automatically
 * when the corresponding cell is deselected.
 */
mxEdgeHandler.prototype.destroy = function()
{
	if (this.escapeHandler != null)
	{
		this.state.view.graph.removeListener(this.escapeHandler);
		this.escapeHandler = null;
	}
	
	if (this.marker != null)
	{
		this.marker.destroy();
		this.marker = null;
	}
	
	if (this.shape != null)
	{
		this.shape.destroy();
		this.shape = null;
	}
	
	if (this.labelShape != null)
	{
		this.labelShape.destroy();
		this.labelShape = null;
	}

	if (this.constraintHandler != null)
	{
		this.constraintHandler.destroy();
		this.constraintHandler = null;
	}
	
	if (this.parentHighlight != null)
	{
		this.destroyParentHighlight();
	}
	
	this.destroyBends(this.virtualBends);
	this.virtualBends = null;
	
	this.destroyBends(this.customHandles);
	this.customHandles = null;

	this.destroyBends(this.bends);
	this.bends = null;
	
	this.removeHint();
};
