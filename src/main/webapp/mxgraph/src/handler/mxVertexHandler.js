/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: mxVertexHandler
 * 
 * Event handler for resizing cells. This handler is automatically created in
 * <mxGraph.createHandler>.
 * 
 * Constructor: mxVertexHandler
 * 
 * Constructs an event handler that allows to resize vertices
 * and groups.
 * 
 * Parameters:
 * 
 * state - <mxCellState> of the cell to be resized.
 */
function mxVertexHandler(state)
{
	if (state != null)
	{
		this.state = state;
		this.init();
		
		// Handles escape keystrokes
		this.escapeHandler = mxUtils.bind(this, function(sender, evt)
		{
			if (this.livePreview && this.index != null)
			{
				// Redraws the live preview
				this.state.view.graph.cellRenderer.redraw(this.state, true);
				
				// Redraws connected edges
				this.state.view.invalidate(this.state.cell);
				this.state.invalid = false;
				this.state.view.validate();
			}
			
			this.reset();
		});
		
		this.state.view.graph.addListener(mxEvent.ESCAPE, this.escapeHandler);
	}
};

/**
 * Variable: graph
 * 
 * Reference to the enclosing <mxGraph>.
 */
mxVertexHandler.prototype.graph = null;

/**
 * Variable: state
 * 
 * Reference to the <mxCellState> being modified.
 */
mxVertexHandler.prototype.state = null;

/**
 * Variable: singleSizer
 * 
 * Specifies if only one sizer handle at the bottom, right corner should be
 * used. Default is false.
 */
mxVertexHandler.prototype.singleSizer = false;

/**
 * Variable: index
 * 
 * Holds the index of the current handle.
 */
mxVertexHandler.prototype.index = null;

/**
 * Variable: allowHandleBoundsCheck
 * 
 * Specifies if the bounds of handles should be used for hit-detection in IE or
 * if <tolerance> > 0. Default is true.
 */
mxVertexHandler.prototype.allowHandleBoundsCheck = true;

/**
 * Variable: handleImage
 * 
 * Optional <mxImage> to be used as handles. Default is null.
 */
mxVertexHandler.prototype.handleImage = null;

/**
 * Variable: handlesVisible
 * 
 * If handles are currently visible.
 */
mxVertexHandler.prototype.handlesVisible = true;

/**
 * Variable: tolerance
 * 
 * Optional tolerance for hit-detection in <getHandleForEvent>. Default is 0.
 */
mxVertexHandler.prototype.tolerance = 0;

/**
 * Variable: rotationEnabled
 * 
 * Specifies if a rotation handle should be visible. Default is false.
 */
mxVertexHandler.prototype.rotationEnabled = false;

/**
 * Variable: parentHighlightEnabled
 * 
 * Specifies if the parent should be highlighted if a child cell is selected.
 * Default is false.
 */
mxVertexHandler.prototype.parentHighlightEnabled = false;

/**
 * Variable: rotationRaster
 * 
 * Specifies if rotation steps should be "rasterized" depening on the distance
 * to the handle. Default is true.
 */
mxVertexHandler.prototype.rotationRaster = true;

/**
 * Variable: rotationCursor
 * 
 * Specifies the cursor for the rotation handle. Default is 'crosshair'.
 */
mxVertexHandler.prototype.rotationCursor = 'crosshair';

/**
 * Variable: livePreview
 * 
 * Specifies if resize should change the cell in-place. This is an experimental
 * feature for non-touch devices. Default is false.
 */
mxVertexHandler.prototype.livePreview = false;

/**
 * Variable: movePreviewToFront
 * 
 * Specifies if the live preview should be moved to the front.
 */
mxVertexHandler.prototype.movePreviewToFront = false;

/**
 * Variable: manageSizers
 * 
 * Specifies if sizers should be hidden and spaced if the vertex is small.
 * Default is false.
 */
mxVertexHandler.prototype.manageSizers = false;

/**
 * Variable: constrainGroupByChildren
 * 
 * Specifies if the size of groups should be constrained by the children.
 * Default is false.
 */
mxVertexHandler.prototype.constrainGroupByChildren = false;

/**
 * Variable: rotationHandleVSpacing
 * 
 * Vertical spacing for rotation icon. Default is -16.
 */
mxVertexHandler.prototype.rotationHandleVSpacing = -16;

/**
 * Variable: horizontalOffset
 * 
 * The horizontal offset for the handles. This is updated in <redrawHandles>
 * if <manageSizers> is true and the sizers are offset horizontally.
 */
mxVertexHandler.prototype.horizontalOffset = 0;

/**
 * Variable: verticalOffset
 * 
 * The horizontal offset for the handles. This is updated in <redrawHandles>
 * if <manageSizers> is true and the sizers are offset vertically.
 */
mxVertexHandler.prototype.verticalOffset = 0;

/**
 * Function: init
 * 
 * Initializes the shapes required for this vertex handler.
 */
mxVertexHandler.prototype.init = function()
{
	this.graph = this.state.view.graph;
	this.selectionBounds = this.getSelectionBounds(this.state);
	this.bounds = new mxRectangle(this.selectionBounds.x, this.selectionBounds.y, this.selectionBounds.width, this.selectionBounds.height);
	this.selectionBorder = this.createSelectionShape(this.bounds);
	this.selectionBorder.dialect = mxConstants.DIALECT_SVG;
	this.selectionBorder.svgStrokeTolerance = 0;
	this.selectionBorder.pointerEvents = false;
	this.selectionBorder.rotation = Number(this.state.style[mxConstants.STYLE_ROTATION] || '0');
	this.selectionBorder.init(this.graph.getView().getOverlayPane());
	mxEvent.redirectMouseEvents(this.selectionBorder.node, this.graph, this.state);
	
	if (this.graph.isCellMovable(this.state.cell) && !this.graph.isCellLocked(this.state.cell))
	{
		this.selectionBorder.setCursor(mxConstants.CURSOR_MOVABLE_VERTEX);
	}

	this.refresh();
	this.redraw();
	
	if (this.constrainGroupByChildren)
	{
		this.updateMinBounds();
	}
};

/**
 * Function: isHandlesVisible
 * 
 * Returns true if all handles should be visible.
 */
mxVertexHandler.prototype.isHandlesVisible = function()
{
	return !this.graph.isCellLocked(this.state.cell) &&
		(mxGraphHandler.prototype.maxCells <= 0 ||
		this.graph.getSelectionCount() <= mxGraphHandler.prototype.maxCells);
};

/**
 * Function: refresh
 * 
 * Initializes the shapes required for this vertex handler.
 */
mxVertexHandler.prototype.refresh = function()
{
	if (this.selectionBorder != null)
	{
		this.selectionBorder.strokewidth = this.getSelectionStrokeWidth();
		this.selectionBorder.isDashed = this.isSelectionDashed();
		this.selectionBorder.stroke = this.getSelectionColor();
		this.selectionBorder.redraw();
	}

	if (this.sizers != null)
	{
		this.destroySizers();
	}
	
	if (this.isHandlesVisible())
	{
		this.sizers = this.createSizers();
	}

	if (this.customHandles != null)
	{
		this.destroyCustomHandles();
	}

	if (this.isHandlesVisible())
	{
		this.customHandles = this.createCustomHandles();
	}
};

/**
 * Function: isRotationHandleVisible
 * 
 * Returns true if the rotation handle should be showing.
 */
mxVertexHandler.prototype.isRotationHandleVisible = function()
{
	return this.graph.isEnabled() && this.rotationEnabled  &&
		this.graph.isCellRotatable(this.state.cell);
};

/**
 * Function: isConstrainedEvent
 * 
 * Returns true if the aspect ratio if the cell should be maintained.
 */
mxVertexHandler.prototype.isConstrainedEvent = function(me)
{
	return mxEvent.isShiftDown(me.getEvent()) || this.state.style[mxConstants.STYLE_ASPECT] == 'fixed';
};

/**
 * Function: isCenteredEvent
 * 
 * Returns true if the center of the vertex should be maintained during the resize.
 */
mxVertexHandler.prototype.isCenteredEvent = function(state, me)
{
	return false;
};

/**
 * Function: createCustomHandles
 * 
 * Returns an array of custom handles. This implementation returns null.
 */
mxVertexHandler.prototype.createCustomHandles = function()
{
	return null;
};

/**
 * Function: updateMinBounds
 * 
 * Initializes the shapes required for this vertex handler.
 */
mxVertexHandler.prototype.updateMinBounds = function()
{
	var children = this.graph.getChildCells(this.state.cell);
	
	if (children.length > 0)
	{
		this.minBounds = this.graph.view.getBounds(children);
		
		if (this.minBounds != null)
		{
			var s = this.state.view.scale;
			var t = this.state.view.translate;

			this.minBounds.x -= this.state.x;
			this.minBounds.y -= this.state.y;
			this.minBounds.x /= s;
			this.minBounds.y /= s;
			this.minBounds.width /= s;
			this.minBounds.height /= s;
			this.x0 = this.state.x / s - t.x;
			this.y0 = this.state.y / s - t.y;
		}
	}
};

/**
 * Function: getSelectionBounds
 * 
 * Returns the mxRectangle that defines the bounds of the selection
 * border.
 */
mxVertexHandler.prototype.getSelectionBounds = function(state)
{
	return new mxRectangle(Math.round(state.x), Math.round(state.y), Math.round(state.width), Math.round(state.height));
};

/**
 * Function: createParentHighlightShape
 * 
 * Creates the shape used to draw the selection border.
 */
mxVertexHandler.prototype.createParentHighlightShape = function(bounds)
{
	return this.createSelectionShape(bounds);
};

/**
 * Function: createSelectionShape
 * 
 * Creates the shape used to draw the selection border.
 */
mxVertexHandler.prototype.createSelectionShape = function(bounds)
{
	var shape = new mxRectangleShape(
		mxRectangle.fromRectangle(bounds),
		null, this.getSelectionColor());
	shape.strokewidth = this.getSelectionStrokeWidth();
	shape.isDashed = this.isSelectionDashed();
	
	return shape;
};

/**
 * Function: getSelectionColor
 * 
 * Returns <mxConstants.VERTEX_SELECTION_COLOR>.
 */
mxVertexHandler.prototype.getSelectionColor = function()
{
	return (this.graph.isCellEditable(this.state.cell)) ?
		mxConstants.VERTEX_SELECTION_COLOR :
		mxConstants.LOCKED_HANDLE_FILLCOLOR;
};

/**
 * Function: getSelectionStrokeWidth
 * 
 * Returns <mxConstants.VERTEX_SELECTION_STROKEWIDTH>.
 */
mxVertexHandler.prototype.getSelectionStrokeWidth = function()
{
	return mxConstants.VERTEX_SELECTION_STROKEWIDTH;
};

/**
 * Function: isSelectionDashed
 * 
 * Returns <mxConstants.VERTEX_SELECTION_DASHED>.
 */
mxVertexHandler.prototype.isSelectionDashed = function()
{
	return mxConstants.VERTEX_SELECTION_DASHED;
};

/**
 * Function: createSizer
 * 
 * Creates a sizer handle for the specified cursor and index and returns
 * the new <mxRectangleShape> that represents the handle.
 */
mxVertexHandler.prototype.createSizer = function(cursor, index, size, fillColor)
{
	size = size || mxConstants.HANDLE_SIZE;
	
	var bounds = new mxRectangle(0, 0, size, size);
	var sizer = this.createSizerShape(bounds, index, fillColor, this.handleImage);

	if (sizer.isHtmlAllowed() && this.state.text != null && this.state.text.node.parentNode == this.graph.container)
	{
		sizer.bounds.height -= 1;
		sizer.bounds.width -= 1;
		sizer.dialect = mxConstants.DIALECT_STRICTHTML;
		sizer.init(this.graph.container);
	}
	else
	{
		sizer.dialect = (this.graph.dialect != mxConstants.DIALECT_SVG) ?
				mxConstants.DIALECT_MIXEDHTML : mxConstants.DIALECT_SVG;
		sizer.init(this.graph.getView().getOverlayPane());
	}

	mxEvent.redirectMouseEvents(sizer.node, this.graph, this.state);
	
	if (this.graph.isEnabled())
	{
		sizer.setCursor(cursor);
	}
	
	if (!this.isSizerVisible(index))
	{
		sizer.visible = false;
	}
	
	return sizer;
};

/**
 * Function: isSizerVisible
 * 
 * Returns true if the sizer for the given index is visible.
 * This returns true for all given indices.
 */
mxVertexHandler.prototype.isSizerVisible = function(index)
{
	return true;
};

/**
 * Function: createSizerShape
 * 
 * Creates the shape used for the sizer handle for the specified bounds an
 * index. Only images and rectangles should be returned if support for HTML
 * labels with not foreign objects is required.
 */
mxVertexHandler.prototype.createSizerShape = function(bounds, index, fillColor, image)
{
	if (image != null)
	{
		bounds = new mxRectangle(bounds.x, bounds.y, image.width, image.height);
		var shape = new mxImageShape(bounds, image.src);
		
		// Allows HTML rendering of the images
		shape.preserveImageAspect = false;

		return shape;
	}
	else if (index == mxEvent.ROTATION_HANDLE)
	{
		return new mxEllipse(bounds, fillColor || mxConstants.HANDLE_FILLCOLOR, mxConstants.HANDLE_STROKECOLOR);
	}
	else
	{
		return new mxRectangleShape(bounds, fillColor || mxConstants.HANDLE_FILLCOLOR, mxConstants.HANDLE_STROKECOLOR);
	}
};

/**
 * Function: createBounds
 * 
 * Helper method to create an <mxRectangle> around the given centerpoint
 * with a width and height of 2*s or 6, if no s is given.
 */
mxVertexHandler.prototype.moveSizerTo = function(shape, x, y)
{
	if (shape != null)
	{
		shape.bounds.x = Math.floor(x - shape.bounds.width / 2);
		shape.bounds.y = Math.floor(y - shape.bounds.height / 2);
		
		// Fixes visible inactive handles in . TODO, remove?
		if (shape.node != null && shape.node.style.display != 'none')
		{
			shape.redraw();
		}
	}
};

/**
 * Function: getHandleForEvent
 * 
 * Returns the index of the handle for the given event. This returns the index
 * of the sizer from where the event originated or <mxEvent.LABEL_INDEX>.
 */
mxVertexHandler.prototype.getHandleForEvent = function(me)
{
	// Connection highlight may consume events before they reach sizer handle
	var tol = (!mxEvent.isMouseEvent(me.getEvent())) ? this.tolerance : 1;
	var hit = (this.allowHandleBoundsCheck && (mxClient.IS_IE || tol > 0)) ?
		new mxRectangle(me.getGraphX() - tol, me.getGraphY() - tol, 2 * tol, 2 * tol) : null;

	var checkShape = mxUtils.bind(this, function(shape)
	{
		var st = (shape != null && shape.constructor != mxImageShape &&
			this.allowHandleBoundsCheck) ? shape.strokewidth + shape.svgStrokeTolerance : null;
		var real = (st != null) ? new mxRectangle(me.getGraphX() - Math.floor(st / 2),
			me.getGraphY() - Math.floor(st / 2), st, st) : hit;

		return shape != null && (me.isSource(shape) || shape.intersectsRectangle(real));
	});
	
	if (checkShape(this.rotationShape))
	{
		return mxEvent.ROTATION_HANDLE;
	}
	else if (checkShape(this.labelShape))
	{
		return mxEvent.LABEL_HANDLE;
	}

	if (this.sizers != null)
	{
		for (var i = 0; i < this.sizers.length; i++)
		{
			if (checkShape(this.sizers[i]))
			{
				return i;
			}
		}
	}

	if (this.customHandles != null && this.isCustomHandleEvent(me))
	{
		// Inverse loop order to match display order
		for (var i = this.customHandles.length - 1; i >= 0; i--)
		{
			if (this.customHandles[i] != null &&
				checkShape(this.customHandles[i].shape))
			{
				// LATER: Return reference to active shape
				return mxEvent.CUSTOM_HANDLE - i;
			}
		}
	}

	return null;
};

/**
 * Function: isCustomHandleEvent
 * 
 * Returns true if the given event allows custom handles to be changed. This
 * implementation returns true.
 */
mxVertexHandler.prototype.isCustomHandleEvent = function(me)
{
	return true;
};

/**
 * Function: mouseDown
 * 
 * Handles the event if a handle has been clicked. By consuming the
 * event all subsequent events of the gesture are redirected to this
 * handler.
 */
mxVertexHandler.prototype.mouseDown = function(sender, me)
{
	if (!me.isConsumed() && this.graph.isEnabled() &&
		(!mxEvent.isAltDown(me.getEvent()) ||
		!mxEvent.isShiftDown(me.getEvent())))
	{
		var handle = this.getHandleForEvent(me);

		if (handle != null)
		{
			this.start(me.getGraphX(), me.getGraphY(), handle);
			me.consume();
		}
	}
};

/**
 * Function: isLivePreviewBorder
 * 
 * Called if <livePreview> is enabled to check if a border should be painted.
 * This implementation returns true if the shape is transparent.
 */
mxVertexHandler.prototype.isLivePreviewBorder = function()
{
	return this.state.shape != null && this.state.shape.fill == null && this.state.shape.stroke == null;
};

/**
 * Function: start
 * 
 * Starts the handling of the mouse gesture.
 */
mxVertexHandler.prototype.start = function(x, y, index)
{
	if (this.selectionBorder != null)
	{
		this.livePreviewActive = this.livePreview && this.graph.model.getChildCount(this.state.cell) == 0;
		this.inTolerance = true;
		this.childOffsetX = 0;
		this.childOffsetY = 0;
		this.index = index;
		this.startX = x;
		this.startY = y;
		
		if (this.index <= mxEvent.CUSTOM_HANDLE && this.isGhostPreview())
		{
			this.ghostPreview = this.createGhostPreview();
		}
		else
		{
			// Saves reference to parent state
			var model = this.state.view.graph.model;
			var parent = model.getParent(this.state.cell);
			
			if (this.state.view.currentRoot != parent && (model.isVertex(parent) || model.isEdge(parent)))
			{
				this.parentState = this.state.view.graph.view.getState(parent);
			}
			
			// Creates a preview that can be on top of any HTML label
			this.selectionBorder.node.style.display = (index == mxEvent.ROTATION_HANDLE) ? 'inline' : 'none';
			
			// Creates the border that represents the new bounds
			if (!this.livePreviewActive || this.isLivePreviewBorder())
			{
				this.preview = this.createSelectionShape(this.bounds);
				
				if (!(mxClient.IS_SVG && Number(this.state.style[mxConstants.STYLE_ROTATION] || '0') != 0) &&
					this.state.text != null && this.state.text.node.parentNode == this.graph.container)
				{
					this.preview.dialect = mxConstants.DIALECT_STRICTHTML;
					this.preview.init(this.graph.container);
				}
				else
				{
					this.preview.dialect = mxConstants.DIALECT_SVG;
					this.preview.init(this.graph.view.getOverlayPane());
				}
			}
			
			if (index == mxEvent.ROTATION_HANDLE)
			{
				// With the rotation handle in a corner, need the angle and distance
				var pos = this.getRotationHandlePosition();
				
				var dx = pos.x - this.state.getCenterX();
				var dy = pos.y - this.state.getCenterY();
				
				this.startAngle = (dx != 0) ? Math.atan(dy / dx) * 180 / Math.PI + 90 : 0;
				this.startDist = Math.sqrt(dx * dx + dy * dy);
			}
	
			// Prepares the handles for live preview
			if (this.livePreviewActive)
			{
				this.hideSizers();
				
				if (index == mxEvent.ROTATION_HANDLE)
				{
					this.rotationShape.node.style.display = '';
				}
				else if (index == mxEvent.LABEL_HANDLE)
				{
					this.labelShape.node.style.display = '';
				}
				else if (this.sizers != null && this.sizers[index] != null)
				{
					this.sizers[index].node.style.display = '';
				}
				else if (index <= mxEvent.CUSTOM_HANDLE && this.customHandles != null &&
					this.customHandles[mxEvent.CUSTOM_HANDLE - index] != null)
				{
					this.customHandles[mxEvent.CUSTOM_HANDLE - index].setVisible(true);
				}
				
				// Gets the array of connected edge handlers for redrawing
				var edges = this.graph.getEdges(this.state.cell);
				this.edgeHandlers = [];
				
				for (var i = 0; i < edges.length; i++)
				{
					var handler = this.graph.selectionCellsHandler.getHandler(edges[i]);
					
					if (handler != null)
					{
						this.edgeHandlers.push(handler);
					}
				}
			}
		}
	}
};

/**
 * Function: createGhostPreview
 * 
 * Starts the handling of the mouse gesture.
 */
mxVertexHandler.prototype.createGhostPreview = function()
{
	var shape = this.graph.cellRenderer.createShape(this.state);
	shape.init(this.graph.view.getOverlayPane());
	shape.scale = this.state.view.scale;
	shape.bounds = this.bounds;
	shape.outline = true;
	
	return shape;
};

/**
 * Function: hideHandles
 * 
 * Shortcut to <hideSizers>.
 */
mxVertexHandler.prototype.setHandlesVisible = function(visible)
{
	this.handlesVisible = visible;
	
	if (this.sizers != null)
	{
		for (var i = 0; i < this.sizers.length; i++)
		{
			this.sizers[i].node.style.display = (visible) ? '' : 'none';
		}
	}

	if (this.customHandles != null)
	{
		for (var i = 0; i < this.customHandles.length; i++)
		{
			if (this.customHandles[i] != null)
			{
				this.customHandles[i].setVisible(visible);
			}
		}
	}
};

/**
 * Function: hideSizers
 * 
 * Hides all sizers except.
 * 
 * Starts the handling of the mouse gesture.
 */
mxVertexHandler.prototype.hideSizers = function()
{
	this.setHandlesVisible(false);
};

/**
 * Function: checkTolerance
 * 
 * Checks if the coordinates for the given event are within the
 * <mxGraph.tolerance>. If the event is a mouse event then the tolerance is
 * ignored.
 */
mxVertexHandler.prototype.checkTolerance = function(me)
{
	if (this.inTolerance && this.startX != null && this.startY != null)
	{
		if (mxEvent.isMouseEvent(me.getEvent()) ||
			Math.abs(me.getGraphX() - this.startX) > this.graph.tolerance ||
			Math.abs(me.getGraphY() - this.startY) > this.graph.tolerance)
		{
			this.inTolerance = false;
		}
	}
};

/**
 * Function: updateHint
 * 
 * Hook for subclassers do show details while the handler is active.
 */
mxVertexHandler.prototype.updateHint = function(me) { };

/**
 * Function: removeHint
 * 
 * Hooks for subclassers to hide details when the handler gets inactive.
 */
mxVertexHandler.prototype.removeHint = function() { };

/**
 * Function: roundAngle
 * 
 * Hook for rounding the angle. This uses Math.round.
 */
mxVertexHandler.prototype.roundAngle = function(angle)
{
	return Math.round(angle * 10) / 10;
};

/**
 * Function: roundLength
 * 
 * Hook for rounding the unscaled width or height. This uses Math.round.
 */
mxVertexHandler.prototype.roundLength = function(length)
{
	return Math.round(length * 100) / 100;
};

/**
 * Function: mouseMove
 * 
 * Handles the event by updating the preview.
 */
mxVertexHandler.prototype.mouseMove = function(sender, me)
{
	if (!me.isConsumed() && this.index != null)
	{
		// Checks tolerance for ignoring single clicks
		this.checkTolerance(me);

		if (!this.inTolerance)
		{
			if (this.index <= mxEvent.CUSTOM_HANDLE)
			{
				if (this.customHandles != null && this.customHandles[mxEvent.CUSTOM_HANDLE - this.index] != null)
				{
					this.customHandles[mxEvent.CUSTOM_HANDLE - this.index].processEvent(me);
					this.customHandles[mxEvent.CUSTOM_HANDLE - this.index].active = true;
					
					if (this.ghostPreview != null)
					{
						this.ghostPreview.apply(this.state);
						this.ghostPreview.strokewidth = this.getSelectionStrokeWidth() /
							this.ghostPreview.scale / this.ghostPreview.scale;
						this.ghostPreview.isDashed = this.isSelectionDashed();
						this.ghostPreview.stroke = this.getSelectionColor();
						this.ghostPreview.redraw();
						
						if (this.selectionBounds != null)
						{
							this.selectionBorder.node.style.display = 'none';
						}
					}
					else
					{
						if (this.movePreviewToFront)
						{
							this.moveToFront();
						}
						
						this.customHandles[mxEvent.CUSTOM_HANDLE - this.index].positionChanged();
					}
				}
			}
			else if (this.index == mxEvent.LABEL_HANDLE)
			{
				this.moveLabel(me);
			}
			else
			{
				if (this.index == mxEvent.ROTATION_HANDLE)
				{
					this.rotateVertex(me);
				}
				else
				{
					this.resizeVertex(me);
				}

				this.updateHint(me);
			}
		}
		
		me.consume();
	}
	// Workaround for disabling the connect highlight when over handle
	else if (!this.graph.isMouseDown && this.getHandleForEvent(me) != null)
	{
		me.consume(false);
	}
};

/**
 * Function: isGhostPreview
 * 
 * Returns true if a ghost preview should be used for custom handles.
 */
mxVertexHandler.prototype.isGhostPreview = function()
{
	return this.state.view.graph.model.getChildCount(this.state.cell) > 0;
};

/**
 * Function: moveLabel
 * 
 * Moves the label.
 */
mxVertexHandler.prototype.moveLabel = function(me)
{
	var point = new mxPoint(me.getGraphX(), me.getGraphY());
	var tr = this.graph.view.translate;
	var scale = this.graph.view.scale;
	
	if (this.graph.isGridEnabledEvent(me.getEvent()))
	{
		point.x = (this.graph.snap(point.x / scale - tr.x) + tr.x) * scale;
		point.y = (this.graph.snap(point.y / scale - tr.y) + tr.y) * scale;
	}

	var index = (this.rotationShape != null) ? this.sizers.length - 2 : this.sizers.length - 1;
	this.moveSizerTo(this.sizers[index], point.x, point.y);
};

/**
 * Function: rotateVertex
 * 
 * Rotates the vertex.
 */
mxVertexHandler.prototype.rotateVertex = function(me)
{
	var point = new mxPoint(me.getGraphX(), me.getGraphY());
	var dx = this.state.x + this.state.width / 2 - point.x;
	var dy = this.state.y + this.state.height / 2 - point.y;
	this.currentAlpha = (dx != 0) ? Math.atan(dy / dx) * 180 / Math.PI + 90 : ((dy < 0) ? 180 : 0);
	
	if (dx > 0)
	{
		this.currentAlpha -= 180;
	}
	
	this.currentAlpha -= this.startAngle;
	
	// Rotation raster
	if (this.rotationRaster && this.graph.isGridEnabledEvent(me.getEvent()))
	{
		var dx = point.x - this.state.getCenterX();
		var dy = point.y - this.state.getCenterY();
		var dist = Math.sqrt(dx * dx + dy * dy);
		
		if (dist - this.startDist < 2)
		{
			raster = 15;
		}
		else if (dist - this.startDist < 25)
		{
			raster = 5;
		}
		else
		{
			raster = 1;
		}
		
		this.currentAlpha = Math.round(this.currentAlpha / raster) * raster;
	}
	else
	{
		this.currentAlpha = this.roundAngle(this.currentAlpha);
	}

	this.selectionBorder.rotation = this.currentAlpha;
	this.selectionBorder.redraw();
					
	if (this.livePreviewActive)
	{
		this.redrawHandles();
	}
};

/**
 * Function: resizeVertex
 * 
 * Risizes the vertex.
 */
mxVertexHandler.prototype.resizeVertex = function(me)
{
	var ct = new mxPoint(this.state.getCenterX(), this.state.getCenterY());
	var alpha = mxUtils.toRadians(this.state.style[mxConstants.STYLE_ROTATION] || '0');
	var point = new mxPoint(me.getGraphX(), me.getGraphY());
	var tr = this.graph.view.translate;
	var scale = this.graph.view.scale;
	var cos = Math.cos(-alpha);
	var sin = Math.sin(-alpha);
	
	var dx = point.x - this.startX;
	var dy = point.y - this.startY;

	// Rotates vector for mouse gesture
	var tx = cos * dx - sin * dy;
	var ty = sin * dx + cos * dy;
	
	dx = tx;
	dy = ty;

	var geo = this.graph.getCellGeometry(this.state.cell);
	this.unscaledBounds = this.union(geo, dx / scale, dy / scale, this.index,
		this.graph.isGridEnabledEvent(me.getEvent()), 1,
		new mxPoint(0, 0), this.isConstrainedEvent(me),
		this.isCenteredEvent(this.state, me));
	
	// Keeps vertex within maximum graph or parent bounds
	if (!geo.relative)
	{
		var max = this.graph.getMaximumGraphBounds();
		
		// Handles child cells
		if (max != null && this.parentState != null)
		{
			max = mxRectangle.fromRectangle(max);
			
			max.x -= (this.parentState.x - tr.x * scale) / scale;
			max.y -= (this.parentState.y - tr.y * scale) / scale;
		}
		
		if (this.graph.isConstrainChild(this.state.cell))
		{
			var tmp = this.graph.getCellContainmentArea(this.state.cell);
			
			if (tmp != null)
			{
				var overlap = this.graph.getOverlap(this.state.cell);
				
				if (overlap > 0)
				{
					tmp = mxRectangle.fromRectangle(tmp);
					
					tmp.x -= tmp.width * overlap;
					tmp.y -= tmp.height * overlap;
					tmp.width += 2 * tmp.width * overlap;
					tmp.height += 2 * tmp.height * overlap;
				}
				
				if (max == null)
				{
					max = tmp;
				}
				else
				{
					max = mxRectangle.fromRectangle(max);
					max.intersect(tmp);
				}
			}
		}
	
		if (max != null)
		{
			if (this.unscaledBounds.x < max.x)
			{
				this.unscaledBounds.width -= max.x - this.unscaledBounds.x;
				this.unscaledBounds.x = max.x;
			}
			
			if (this.unscaledBounds.y < max.y)
			{
				this.unscaledBounds.height -= max.y - this.unscaledBounds.y;
				this.unscaledBounds.y = max.y;
			}
			
			if (this.unscaledBounds.x + this.unscaledBounds.width > max.x + max.width)
			{
				this.unscaledBounds.width -= this.unscaledBounds.x +
					this.unscaledBounds.width - max.x - max.width;
			}
			
			if (this.unscaledBounds.y + this.unscaledBounds.height > max.y + max.height)
			{
				this.unscaledBounds.height -= this.unscaledBounds.y +
					this.unscaledBounds.height - max.y - max.height;
			}
		}
	}
	
	var old = this.bounds;
	this.bounds = new mxRectangle(((this.parentState != null) ? this.parentState.x : tr.x * scale) +
		(this.unscaledBounds.x) * scale, ((this.parentState != null) ? this.parentState.y : tr.y * scale) +
		(this.unscaledBounds.y) * scale, this.unscaledBounds.width * scale, this.unscaledBounds.height * scale);

	if (geo.relative && this.parentState != null)
	{
		this.bounds.x += this.state.x - this.parentState.x;
		this.bounds.y += this.state.y - this.parentState.y;
	}

	cos = Math.cos(alpha);
	sin = Math.sin(alpha);
	
	var c2 = new mxPoint(this.bounds.getCenterX(), this.bounds.getCenterY());

	var dx = c2.x - ct.x;
	var dy = c2.y - ct.y;
	
	var dx2 = cos * dx - sin * dy;
	var dy2 = sin * dx + cos * dy;
	
	var dx3 = dx2 - dx;
	var dy3 = dy2 - dy;
	
	var dx4 = this.bounds.x - this.state.x;
	var dy4 = this.bounds.y - this.state.y;
	
	var dx5 = cos * dx4 - sin * dy4;
	var dy5 = sin * dx4 + cos * dy4;
	
	this.bounds.x += dx3;
	this.bounds.y += dy3;
	
	// Rounds unscaled bounds to int
	this.unscaledBounds.x = this.roundLength(this.unscaledBounds.x + dx3 / scale);
	this.unscaledBounds.y = this.roundLength(this.unscaledBounds.y + dy3 / scale);
	this.unscaledBounds.width = this.roundLength(this.unscaledBounds.width);
	this.unscaledBounds.height = this.roundLength(this.unscaledBounds.height);
	
	// Shifts the children according to parent offset
	if (!this.graph.isCellCollapsed(this.state.cell) && (dx3 != 0 || dy3 != 0))
	{
		this.childOffsetX = this.state.x - this.bounds.x + dx5;
		this.childOffsetY = this.state.y - this.bounds.y + dy5;
	}
	else
	{
		this.childOffsetX = 0;
		this.childOffsetY = 0;
	}
			
	if (!old.equals(this.bounds))
	{	
		if (this.livePreviewActive)
		{
			this.updateLivePreview(me);
		}
		
		if (this.preview != null)
		{
			this.drawPreview();
		}
		else
		{
			this.updateParentHighlight();
		}
	}
};

/**
 * Function: updateLivePreview
 * 
 * Repaints the live preview.
 */
mxVertexHandler.prototype.updateLivePreview = function(me)
{
	// TODO: Apply child offset to children in live preview
	var scale = this.graph.view.scale;
	var tr = this.graph.view.translate;
	
	// Saves current state
	var tempState = this.state.clone();

	// Temporarily changes size and origin
	this.state.x = this.bounds.x;
	this.state.y = this.bounds.y;
	this.state.origin = new mxPoint(this.state.x / scale - tr.x, this.state.y / scale - tr.y);
	this.state.width = this.bounds.width;
	this.state.height = this.bounds.height;
	
	// Redraws cell and handles
	var off = this.state.absoluteOffset;
	off = new mxPoint(off.x, off.y);

	// Required to store and reset absolute offset for updating label position
	this.state.absoluteOffset.x = 0;
	this.state.absoluteOffset.y = 0;
	var geo = this.graph.getCellGeometry(this.state.cell);				

	if (geo != null)
	{
		var offset = geo.offset || this.EMPTY_POINT;

		if (offset != null && !geo.relative)
		{
			this.state.absoluteOffset.x = this.state.view.scale * offset.x;
			this.state.absoluteOffset.y = this.state.view.scale * offset.y;
		}
		
		this.state.view.updateVertexLabelOffset(this.state);
	}
	
	// Draws the live preview
	this.state.view.graph.cellRenderer.redraw(this.state, true);
	
	// Redraws connected edges TODO: Include child edges
	this.state.view.invalidate(this.state.cell);
	this.state.invalid = false;
	this.state.view.validate();
	this.redrawHandles();
	
	// Moves live preview to front
	if (this.movePreviewToFront)
	{
		this.moveToFront();
	}
	
	// Hides folding icon
	if (this.state.control != null && this.state.control.node != null)
	{
		this.state.control.node.style.visibility = 'hidden';
	}
	
	// Restores current state
	this.state.setState(tempState);
};

/**
 * Function: moveToFront
 * 
 * Handles the event by applying the changes to the geometry.
 */
mxVertexHandler.prototype.moveToFront = function()
{
	if ((this.state.text != null && this.state.text.node != null &&
		this.state.text.node.nextSibling != null) ||
		(this.state.shape != null && this.state.shape.node != null &&
		this.state.shape.node.nextSibling != null && (this.state.text == null ||
		this.state.shape.node.nextSibling != this.state.text.node)))
	{
		if (this.state.shape != null && this.state.shape.node != null)
		{
			this.state.shape.node.parentNode.appendChild(this.state.shape.node);
		}
		
		if (this.state.text != null && this.state.text.node != null)
		{
			this.state.text.node.parentNode.appendChild(this.state.text.node);
		}
	}
};

/**
 * Function: mouseUp
 * 
 * Handles the event by applying the changes to the geometry.
 */
mxVertexHandler.prototype.mouseUp = function(sender, me)
{
	if (this.index != null && this.state != null)
	{
		var point = new mxPoint(me.getGraphX(), me.getGraphY());
		var index = this.index;
		this.index = null;
	
		if (this.ghostPreview == null)
		{
			// Marks as invalid to ensure reset of order
			this.state.view.invalidate(this.state.cell, false, false);
		}
		
		this.graph.getModel().beginUpdate();
		try
		{
			if (index <= mxEvent.CUSTOM_HANDLE)
			{
				if (this.customHandles != null && this.customHandles[mxEvent.CUSTOM_HANDLE - index] != null)
				{
					// Creates style before changing cell state
					var style = this.state.view.graph.getCellStyle(this.state.cell);
					
					this.customHandles[mxEvent.CUSTOM_HANDLE - index].active = false;
					this.customHandles[mxEvent.CUSTOM_HANDLE - index].execute(me);
					
					// Sets style and apply on shape to force repaint and
					// check if execute has removed custom handles
					if (this.customHandles != null &&
						this.customHandles[mxEvent.CUSTOM_HANDLE - index] != null)
					{
						this.state.style = style;
						this.customHandles[mxEvent.CUSTOM_HANDLE - index].positionChanged();
					}
				}
			}
			else if (index == mxEvent.ROTATION_HANDLE)
			{
				if (this.currentAlpha != null)
				{
					var delta = this.currentAlpha - (this.state.style[mxConstants.STYLE_ROTATION] || 0);
					
					if (delta != 0)
					{
						this.rotateCell(this.state.cell, delta);
					}
				}
				else
				{
					this.rotateClick();
				}
			}
			else
			{
				var gridEnabled = this.graph.isGridEnabledEvent(me.getEvent());
				var alpha = mxUtils.toRadians(this.state.style[mxConstants.STYLE_ROTATION] || '0');
				var cos = Math.cos(-alpha);
				var sin = Math.sin(-alpha);
				
				var dx = point.x - this.startX;
				var dy = point.y - this.startY;
				
				// Rotates vector for mouse gesture
				var tx = cos * dx - sin * dy;
				var ty = sin * dx + cos * dy;
				
				dx = tx;
				dy = ty;
				
				var s = this.graph.view.scale;
				var recurse = this.isRecursiveResize(this.state, me);
				this.resizeCell(this.state.cell, this.roundLength(dx / s), this.roundLength(dy / s),
					index, gridEnabled, this.isConstrainedEvent(me), recurse);
			}
		}
		finally
		{
			this.graph.getModel().endUpdate();
		}

		// Restores order if cell wasn't changed in model
		if (this.state.invalid)
		{
			this.state.view.validate();
		}

		me.consume();
		this.reset();
		this.redrawHandles();
	}
};

/**
 * Function: isRecursiveResize
 * 
 * Returns the recursiveResize of the give state.
 * 
 * Parameters:
 * 
 * state - the given <mxCellState>. This implementation takes 
 * the value of this state.
 * me - the mouse event.
 */
mxVertexHandler.prototype.isRecursiveResize = function(state, me)
{
	return this.graph.isRecursiveResize(this.state);
};

/**
 * Function: rotateClick
 * 
 * Hook for subclassers to implement a single click on the rotation handle.
 * This code is executed as part of the model transaction. This implementation
 * is empty.
 */
mxVertexHandler.prototype.rotateClick = function() { };

/**
 * Function: rotateCell
 * 
 * Rotates the given cell and its children by the given angle in degrees.
 * 
 * Parameters:
 * 
 * cell - <mxCell> to be rotated.
 * angle - Angle in degrees.
 */
mxVertexHandler.prototype.rotateCell = function(cell, angle, parent)
{
	if (angle != 0)
	{
		var model = this.graph.getModel();

		if (model.isVertex(cell) || model.isEdge(cell))
		{
			if (!model.isEdge(cell))
			{
				var style = this.graph.getCurrentCellStyle(cell);
				var total = (style[mxConstants.STYLE_ROTATION] || 0) + angle;
				this.graph.setCellStyles(mxConstants.STYLE_ROTATION, total, [cell]);
			}
			
			var geo = this.graph.getCellGeometry(cell);
			
			if (geo != null)
			{
				var pgeo = this.graph.getCellGeometry(parent);
				
				if (pgeo != null && !model.isEdge(parent))
				{
					geo = geo.clone();
					geo.rotate(angle, new mxPoint(pgeo.width / 2, pgeo.height / 2));
					model.setGeometry(cell, geo);
				}
				
				if ((model.isVertex(cell) && !geo.relative) || model.isEdge(cell))
				{
					// Recursive rotation
					var childCount = model.getChildCount(cell);
					
					for (var i = 0; i < childCount; i++)
					{
						this.rotateCell(model.getChildAt(cell, i), angle, cell);
					}
				}
			}
		}
	}
};

/**
 * Function: reset
 * 
 * Resets the state of this handler.
 */
mxVertexHandler.prototype.reset = function()
{
	if (this.sizers != null && this.index != null && this.sizers[this.index] != null &&
		this.sizers[this.index].node.style.display == 'none')
	{
		this.sizers[this.index].node.style.display = '';
	}

	this.currentAlpha = null;
	this.inTolerance = null;
	this.index = null;

	// TODO: Reset and redraw cell states for live preview
	if (this.preview != null)
	{
		this.preview.destroy();
		this.preview = null;
	}
	
	if (this.ghostPreview != null)
	{
		this.ghostPreview.destroy();
		this.ghostPreview = null;
	}

	if (this.livePreviewActive && this.sizers != null)
	{
		for (var i = 0; i < this.sizers.length; i++)
		{
			if (this.sizers[i] != null)
			{
				this.sizers[i].node.style.display = '';
			}
		}
		
		// Shows folding icon
		if (this.state.control != null && this.state.control.node != null)
		{
			this.state.control.node.style.visibility = '';
		}
	}

	if (this.customHandles != null)
	{
		for (var i = 0; i < this.customHandles.length; i++)
		{
			if (this.customHandles[i] != null)
			{
				if (this.customHandles[i].active)
				{
					this.customHandles[i].active = false;
					this.customHandles[i].reset();
				}
				else
				{
					this.customHandles[i].setVisible(true);
				}
			}
		}
	}
	
	// Checks if handler has been destroyed
	if (this.selectionBorder != null)
	{
		this.selectionBorder.node.style.display = 'inline';
		this.selectionBounds = this.getSelectionBounds(this.state);
		this.bounds = new mxRectangle(this.selectionBounds.x, this.selectionBounds.y,
			this.selectionBounds.width, this.selectionBounds.height);
		this.drawPreview();
	}

	this.removeHint();
	this.redrawHandles();
	this.edgeHandlers = null;
	this.handlesVisible = true;
	this.unscaledBounds = null;
	this.livePreviewActive = null;
};

/**
 * Function: resizeCell
 * 
 * Uses the given vector to change the bounds of the given cell
 * in the graph using <mxGraph.resizeCell>.
 */
mxVertexHandler.prototype.resizeCell = function(cell, dx, dy, index, gridEnabled, constrained, recurse)
{
	var geo = this.graph.model.getGeometry(cell);
	
	if (geo != null)
	{
		if (index == mxEvent.LABEL_HANDLE)
		{
			var alpha = -mxUtils.toRadians(this.state.style[mxConstants.STYLE_ROTATION] || '0');
			var horz = mxUtils.getValue(this.state.style, mxConstants.STYLE_HORIZONTAL, true) == 1;
			var cos = Math.cos(alpha);
			var sin = Math.sin(alpha);
			var scale = this.graph.view.scale;
			var pt = mxUtils.getRotatedPoint(new mxPoint(
				Math.round((this.labelShape.bounds.getCenterX() - this.startX) / scale),
				Math.round((this.labelShape.bounds.getCenterY() - this.startY) / scale)),
				cos, sin);

			if (!horz)
			{
				pt.y = -pt.y;
			}

			geo = geo.clone();
			
			if (geo.offset == null)
			{
				geo.offset = pt;
			}
			else
			{
				geo.offset.x += pt.x;
				geo.offset.y += pt.y;
			}
			
			this.graph.model.setGeometry(cell, geo);
		}
		else if (this.unscaledBounds != null)
		{
			var scale = this.graph.view.scale;

			if (this.childOffsetX != 0 || this.childOffsetY != 0)
			{
				this.moveChildren(cell, Math.round(this.childOffsetX / scale), Math.round(this.childOffsetY / scale));
			}

			this.graph.resizeCell(cell, this.unscaledBounds, recurse);
		}
	}
};

/**
 * Function: moveChildren
 * 
 * Moves the children of the given cell by the given vector.
 */
mxVertexHandler.prototype.moveChildren = function(cell, dx, dy)
{
	var model = this.graph.getModel();
	var childCount = model.getChildCount(cell);
	
	for (var i = 0; i < childCount; i++)
	{
		var child = model.getChildAt(cell, i);
		var geo = this.graph.getCellGeometry(child);
		
		if (geo != null)
		{
			geo = geo.clone();
			geo.translate(dx, dy);
			model.setGeometry(child, geo);
		}
	}
};
/**
 * Function: union
 * 
 * Returns the union of the given bounds and location for the specified
 * handle index.
 * 
 * To override this to limit the size of vertex via a minWidth/-Height style,
 * the following code can be used.
 * 
 * (code)
 * var vertexHandlerUnion = mxVertexHandler.prototype.union;
 * mxVertexHandler.prototype.union = function(bounds, dx, dy, index, gridEnabled, scale, tr, constrained)
 * {
 *   var result = vertexHandlerUnion.apply(this, arguments);
 *   
 *   result.width = Math.max(result.width, mxUtils.getNumber(this.state.style, 'minWidth', 0));
 *   result.height = Math.max(result.height, mxUtils.getNumber(this.state.style, 'minHeight', 0));
 *   
 *   return result;
 * };
 * (end)
 * 
 * The minWidth/-Height style can then be used as follows:
 * 
 * (code)
 * graph.insertVertex(parent, null, 'Hello,', 20, 20, 80, 30, 'minWidth=100;minHeight=100;');
 * (end)
 * 
 * To override this to update the height for a wrapped text if the width of a vertex is
 * changed, the following can be used.
 * 
 * (code)
 * var mxVertexHandlerUnion = mxVertexHandler.prototype.union;
 * mxVertexHandler.prototype.union = function(bounds, dx, dy, index, gridEnabled, scale, tr, constrained)
 * {
 *   var result = mxVertexHandlerUnion.apply(this, arguments);
 *   var s = this.state;
 *   
 *   if (this.graph.isHtmlLabel(s.cell) && (index == 3 || index == 4) &&
 *       s.text != null && s.style[mxConstants.STYLE_WHITE_SPACE] == 'wrap')
 *   {
 *     var label = this.graph.getLabel(s.cell);
 *     var fontSize = mxUtils.getNumber(s.style, mxConstants.STYLE_FONTSIZE, mxConstants.DEFAULT_FONTSIZE);
 *     var ww = result.width / s.view.scale - s.text.spacingRight - s.text.spacingLeft
 *     
 *     result.height = mxUtils.getSizeForString(label, fontSize, s.style[mxConstants.STYLE_FONTFAMILY], ww).height;
 *   }
 *   
 *   return result;
 * };
 * (end)
 */
mxVertexHandler.prototype.union = function(bounds, dx, dy, index, gridEnabled, scale, tr, constrained, centered)
{
	gridEnabled = (gridEnabled != null) ? gridEnabled && this.graph.gridEnabled : this.graph.gridEnabled;
	
	if (this.singleSizer)
	{
		var x = bounds.x + bounds.width + dx;
		var y = bounds.y + bounds.height + dy;
		
		if (gridEnabled)
		{
			x = this.graph.snap(x / scale) * scale;
			y = this.graph.snap(y / scale) * scale;
		}
		
		var rect = new mxRectangle(bounds.x, bounds.y, 0, 0);
		rect.add(new mxRectangle(x, y, 0, 0));
		
		return rect;
	}
	else
	{
		var w0 = bounds.width;
		var h0 = bounds.height;
		var left = bounds.x - tr.x * scale;
		var right = left + w0;
		var top = bounds.y - tr.y * scale;
		var bottom = top + h0;
		
		var cx = left + w0 / 2;
		var cy = top + h0 / 2;
		
		if (index > 4 /* Bottom Row */)
		{
			bottom = bottom + dy;
			
			if (gridEnabled)
			{
				bottom = this.graph.snap(bottom / scale) * scale;
			}
			else
			{
				bottom = Math.round(bottom / scale) * scale;
			}
		}
		else if (index < 3 /* Top Row */)
		{
			top = top + dy;
			
			if (gridEnabled)
			{
				top = this.graph.snap(top / scale) * scale;
			}
			else
			{
				top = Math.round(top / scale) * scale;
			}
		}
		
		if (index == 0 || index == 3 || index == 5 /* Left */)
		{
			left += dx;
			
			if (gridEnabled)
			{
				left = this.graph.snap(left / scale) * scale;
			}
			else
			{
				left = Math.round(left / scale) * scale;
			}
		}
		else if (index == 2 || index == 4 || index == 7 /* Right */)
		{
			right += dx;
			
			if (gridEnabled)
			{
				right = this.graph.snap(right / scale) * scale;
			}
			else
			{
				right = Math.round(right / scale) * scale;
			}
		}
		
		var width = right - left;
		var height = bottom - top;

		if (constrained)
		{
			var geo = this.graph.getCellGeometry(this.state.cell);

			if (geo != null)
			{
				var aspect = geo.width / geo.height;
				
				if (index== 1 || index== 2 || index == 7 || index == 6)
				{
					width = height * aspect;
				}
				else
				{
					height = width / aspect;
				}
				
				if (index == 0)
				{
					left = right - width;
					top = bottom - height;
				}
			}
		}

		if (centered)
		{
			width += (width - w0);
			height += (height - h0);
			
			var cdx = cx - (left + width / 2);
			var cdy = cy - (top + height / 2);

			left += cdx;
			top += cdy;
			right += cdx;
			bottom += cdy;
		}

		// Flips over left side
		if (width < 0)
		{
			left += width;
			width = Math.abs(width);
		}
		
		// Flips over top side
		if (height < 0)
		{
			top += height;
			height = Math.abs(height);
		}

		var result = new mxRectangle(left + tr.x * scale, top + tr.y * scale, width, height);
		
		if (this.minBounds != null)
		{
			result.width = Math.max(result.width, this.minBounds.x * scale + this.minBounds.width * scale +
				Math.max(0, this.x0 * scale - result.x));
			result.height = Math.max(result.height, this.minBounds.y * scale + this.minBounds.height * scale +
				Math.max(0, this.y0 * scale - result.y));
		}
		
		return result;
	}
};

/**
 * Function: redraw
 * 
 * Redraws the handles and the preview.
 */
mxVertexHandler.prototype.redraw = function(ignoreHandles)
{
	this.selectionBounds = this.getSelectionBounds(this.state);
	this.bounds = new mxRectangle(this.selectionBounds.x, this.selectionBounds.y,
		this.selectionBounds.width, this.selectionBounds.height);
	this.drawPreview();

	if (!ignoreHandles)
	{
		this.redrawHandles();
	}
};

/**
 * Returns the padding to be used for drawing handles for the current <bounds>.
 */
mxVertexHandler.prototype.getHandlePadding = function()
{
	// KNOWN: Tolerance depends on event type (eg. 0 for mouse events)
	var result = new mxPoint(0, 0);
	var tol = this.tolerance;

	if (this.sizers != null && this.sizers.length > 0 && this.sizers[0] != null &&
		(this.bounds.width < 2 * this.sizers[0].bounds.width + 2 * tol ||
		this.bounds.height < 2 * this.sizers[0].bounds.height + 2 * tol))
	{
		tol /= 2;
		
		result.x = this.sizers[0].bounds.width + tol;
		result.y = this.sizers[0].bounds.height + tol;
	}
	
	return result;
};

/**
 * Function: getSizerBounds
 * 
 * Returns the bounds used to paint the resize handles.
 */
mxVertexHandler.prototype.getSizerBounds = function()
{
	return this.bounds;
};

/**
 * Function: redrawHandles
 * 
 * Redraws the handles. To hide certain handles the following code can be used.
 * 
 * (code)
 * mxVertexHandler.prototype.redrawHandles = function()
 * {
 *   mxVertexHandlerRedrawHandles.apply(this, arguments);
 *   
 *   if (this.sizers != null && this.sizers.length > 7)
 *   {
 *     this.sizers[1].node.style.display = 'none';
 *     this.sizers[6].node.style.display = 'none';
 *   }
 * };
 * (end)
 */
mxVertexHandler.prototype.redrawHandles = function()
{
	var s = this.getSizerBounds();
	var tol = this.tolerance;
	this.horizontalOffset = 0;
	this.verticalOffset = 0;
	
	if (this.customHandles != null)
	{
		for (var i = 0; i < this.customHandles.length; i++)
		{
			if (this.customHandles[i] != null)
			{
				var temp = this.customHandles[i].shape.node.style.display;
				this.customHandles[i].redraw();
				this.customHandles[i].shape.node.style.display = temp;

				// Hides custom handles during text editing
				this.customHandles[i].shape.node.style.visibility =
					(!this.handlesVisible || !this.isHandlesVisible() ||
					!this.isCustomHandleVisible(this.customHandles[i]) ||
					this.graph.isEditing()) ?
						'hidden' : '';
			}
		}
	}

	if (this.sizers != null && this.sizers.length > 0 && this.sizers[0] != null)
	{
		if (this.index == null && this.manageSizers && this.sizers.length >= 8)
		{
			// KNOWN: Tolerance depends on event type (eg. 0 for mouse events)
			var padding = this.getHandlePadding();
			this.horizontalOffset = padding.x;
			this.verticalOffset = padding.y;
			
			if (this.horizontalOffset != 0 || this.verticalOffset != 0)
			{
				s = new mxRectangle(s.x, s.y, s.width, s.height);

				s.x -= this.horizontalOffset / 2;
				s.width += this.horizontalOffset;
				s.y -= this.verticalOffset / 2;
				s.height += this.verticalOffset;
			}
			
			if (this.sizers.length >= 8)
			{
				if ((s.width < 2 * this.sizers[0].bounds.width + 2 * tol) ||
					(s.height < 2 * this.sizers[0].bounds.height + 2 * tol))
				{
					this.sizers[0].node.style.display = 'none';
					this.sizers[2].node.style.display = 'none';
					this.sizers[5].node.style.display = 'none';
					this.sizers[7].node.style.display = 'none';
				}
				else if (this.handlesVisible)
				{
					this.sizers[0].node.style.display = '';
					this.sizers[2].node.style.display = '';
					this.sizers[5].node.style.display = '';
					this.sizers[7].node.style.display = '';
				}
			}
		}

		var r = s.x + s.width;
		var b = s.y + s.height;
		
		if (this.singleSizer)
		{
			this.moveSizerTo(this.sizers[0], r, b);
		}
		else
		{
			var cx = s.x + s.width / 2;
			var cy = s.y + s.height / 2;
			
			if (this.sizers.length >= 8)
			{
				var crs = ['nw-resize', 'n-resize', 'ne-resize', 'e-resize', 'se-resize', 's-resize', 'sw-resize', 'w-resize'];
				
				var alpha = mxUtils.toRadians(this.state.style[mxConstants.STYLE_ROTATION] || '0');
				var cos = Math.cos(alpha);
				var sin = Math.sin(alpha);
				
				var da = Math.round(alpha * 4 / Math.PI);
				
				var ct = new mxPoint(s.getCenterX(), s.getCenterY());
				var pt = mxUtils.getRotatedPoint(new mxPoint(s.x, s.y), cos, sin, ct);
				
				this.moveSizerTo(this.sizers[0], pt.x, pt.y);
				this.sizers[0].setCursor(crs[mxUtils.mod(0 + da, crs.length)]);
				
				pt.x = cx;
				pt.y = s.y;
				pt = mxUtils.getRotatedPoint(pt, cos, sin, ct);
				
				this.moveSizerTo(this.sizers[1], pt.x, pt.y);
				this.sizers[1].setCursor(crs[mxUtils.mod(1 + da, crs.length)]);
				
				pt.x = r;
				pt.y = s.y;
				pt = mxUtils.getRotatedPoint(pt, cos, sin, ct);
				
				this.moveSizerTo(this.sizers[2], pt.x, pt.y);
				this.sizers[2].setCursor(crs[mxUtils.mod(2 + da, crs.length)]);
				
				pt.x = s.x;
				pt.y = cy;
				pt = mxUtils.getRotatedPoint(pt, cos, sin, ct);
				
				this.moveSizerTo(this.sizers[3], pt.x, pt.y);
				this.sizers[3].setCursor(crs[mxUtils.mod(7 + da, crs.length)]);

				pt.x = r;
				pt.y = cy;
				pt = mxUtils.getRotatedPoint(pt, cos, sin, ct);
				
				this.moveSizerTo(this.sizers[4], pt.x, pt.y);
				this.sizers[4].setCursor(crs[mxUtils.mod(3 + da, crs.length)]);

				pt.x = s.x;
				pt.y = b;
				pt = mxUtils.getRotatedPoint(pt, cos, sin, ct);
				
				this.moveSizerTo(this.sizers[5], pt.x, pt.y);
				this.sizers[5].setCursor(crs[mxUtils.mod(6 + da, crs.length)]);

				pt.x = cx;
				pt.y = b;
				pt = mxUtils.getRotatedPoint(pt, cos, sin, ct);
				
				this.moveSizerTo(this.sizers[6], pt.x, pt.y);
				this.sizers[6].setCursor(crs[mxUtils.mod(5 + da, crs.length)]);

				pt.x = r;
				pt.y = b;
				pt = mxUtils.getRotatedPoint(pt, cos, sin, ct);
				
				this.moveSizerTo(this.sizers[7], pt.x, pt.y);
				this.sizers[7].setCursor(crs[mxUtils.mod(4 + da, crs.length)]);
				
				var horz = mxUtils.getValue(this.state.style, mxConstants.STYLE_HORIZONTAL, true) == 1;
				pt.x = cx + this.state.absoluteOffset.x;
				pt.y = cy + ((horz ? 1 : -1) * this.state.absoluteOffset.y);
				pt = mxUtils.getRotatedPoint(pt, cos, sin, ct);
				this.moveSizerTo(this.sizers[8], pt.x, pt.y);
			}
			else if (this.state.width >= 2 && this.state.height >= 2 &&
				this.state.absoluteOffset != null)
			{
				this.moveSizerTo(this.sizers[0], cx + this.state.absoluteOffset.x,
					cy + this.state.absoluteOffset.y);
			}
			else
			{
				this.moveSizerTo(this.sizers[0], this.state.x, this.state.y);
			}
		}
	}

	if (this.sizers != null)
	{
		for (var i = 0; i < this.sizers.length; i++)
		{
			this.sizers[i].node.style.visibility = (this.isHandlesVisible()) ? '' : 'hidden';
		}
	}

	if (this.rotationShape != null)
	{
		var alpha = mxUtils.toRadians((this.currentAlpha != null) ? this.currentAlpha : this.state.style[mxConstants.STYLE_ROTATION] || '0');
		var cos = Math.cos(alpha);
		var sin = Math.sin(alpha);
		
		var ct = new mxPoint(this.state.getCenterX(), this.state.getCenterY());
		var pt = mxUtils.getRotatedPoint(this.getRotationHandlePosition(), cos, sin, ct);

		if (this.rotationShape.node != null)
		{
			this.moveSizerTo(this.rotationShape, pt.x, pt.y);

			// Hides rotation handle during text editing
			this.rotationShape.node.style.visibility =
				(this.state.view.graph.isEditing() ||
				!this.handlesVisible || !this.isHandlesVisible() ||
				!this.isRotationHandleVisible()) ?
					'hidden' : '';
		}
	}
	
	if (this.selectionBorder != null)
	{
		this.selectionBorder.rotation = Number(this.state.style[mxConstants.STYLE_ROTATION] || '0');
	}
	
	if (this.edgeHandlers != null)
	{		
		for (var i = 0; i < this.edgeHandlers.length; i++)
		{
			this.edgeHandlers[i].redraw();
		}
	}
};

/**
 * Function: isCustomHandleVisible
 * 
 * Returns true if the given custom handle is visible.
 */
mxVertexHandler.prototype.isCustomHandleVisible = function(handle)
{
	return this.state.view.graph.getSelectionCount() == 1;
};

/**
 * Function: getRotationHandlePosition
 * 
 * Returns an <mxPoint> that defines the rotation handle position.
 */
mxVertexHandler.prototype.getRotationHandlePosition = function()
{
	return new mxPoint(this.bounds.x + this.bounds.width / 2, this.bounds.y + this.rotationHandleVSpacing)
};

/**
 * Function: isParentHighlightVisible
 * 
 * Returns true if the parent highlight should be visible. This implementation
 * always returns true.
 */
mxVertexHandler.prototype.isParentHighlightVisible = function()
{
	return !this.graph.isCellSelected(this.graph.model.getParent(this.state.cell));
};

/**
 * Function: destroyParentHighlight
 * 
 * Destroys the parent highlight.
 */
mxVertexHandler.prototype.destroyParentHighlight = function()
{
	if (this.parentHighlight.state != null)
	{
		delete this.parentHighlight.state.parentHighlight;
		delete this.parentHighlight.state;
	}
	
	this.parentHighlight.destroy();
	this.parentHighlight = null;
};

/**
 * Function: updateParentHighlight
 * 
 * Updates the highlight of the parent if <parentHighlightEnabled> is true.
 */
mxVertexHandler.prototype.updateParentHighlight = function()
{
	if (!this.isDestroyed())
	{
		var visible = this.isParentHighlightVisible();
		var parent = this.graph.model.getParent(this.state.cell);
		var pstate = this.graph.view.getState(parent);

		if (this.parentHighlight != null)
		{
			if (this.graph.model.isVertex(parent) && visible)
			{
				var b = this.parentHighlight.bounds;
				
				if (pstate != null && (b.x != pstate.x || b.y != pstate.y ||
					b.width != pstate.width || b.height != pstate.height))
				{
					this.parentHighlight.bounds = mxRectangle.fromRectangle(pstate);
					this.parentHighlight.redraw();
				}
			}
			else
			{
				this.destroyParentHighlight();
			}
		}
		else if (this.parentHighlightEnabled && visible)
		{
			if (this.graph.model.isVertex(parent) && pstate != null &&
				pstate.parentHighlight == null)
			{
				this.parentHighlight = this.createParentHighlightShape(pstate);
				this.parentHighlight.dialect = mxConstants.DIALECT_SVG;
				this.parentHighlight.svgStrokeTolerance = 0;
				this.parentHighlight.pointerEvents = false;
				this.parentHighlight.rotation = Number(pstate.style[mxConstants.STYLE_ROTATION] || '0');
				this.parentHighlight.init(this.graph.getView().getOverlayPane());
				this.parentHighlight.redraw();
				
				// Shows highlight once per parent
				pstate.parentHighlight = this.parentHighlight;
				this.parentHighlight.state = pstate;
			}
		}
	}
};

/**
 * Function: drawPreview
 * 
 * Redraws the preview.
 */
mxVertexHandler.prototype.drawPreview = function()
{
	if (this.preview != null)
	{
		this.preview.bounds = this.bounds;
		
		if (this.preview.node.parentNode == this.graph.container)
		{
			this.preview.bounds.width = Math.max(0, this.preview.bounds.width - 1);
			this.preview.bounds.height = Math.max(0, this.preview.bounds.height - 1);
		}
	
		this.preview.rotation = Number(this.state.style[mxConstants.STYLE_ROTATION] || '0');
		this.preview.redraw();
	}
	
	this.selectionBorder.bounds = this.getSelectionBorderBounds();
	this.selectionBorder.redraw();
	this.updateParentHighlight();
};

/**
 * Function: getSelectionBorderBounds
 * 
 * Returns the bounds for the selection border.
 */
mxVertexHandler.prototype.getSelectionBorderBounds = function()
{
	return this.bounds;
};

/**
 * Function: createSizers
 * 
 * Destroys the handler and all its resources and DOM nodes.
 */
mxVertexHandler.prototype.createSizers = function()
{
	var resizable = this.graph.isCellResizable(this.state.cell) &&
		!this.graph.isCellLocked(this.state.cell);
	var sizers = [];

	if (resizable || (this.graph.isLabelMovable(this.state.cell) &&
		this.state.width >= 2 && this.state.height >= 2))
	{
		var i = 0;

		if (resizable)
		{
			if (!this.singleSizer)
			{
				sizers.push(this.createSizer('nw-resize', i++));
				sizers.push(this.createSizer('n-resize', i++));
				sizers.push(this.createSizer('ne-resize', i++));
				sizers.push(this.createSizer('w-resize', i++));
				sizers.push(this.createSizer('e-resize', i++));
				sizers.push(this.createSizer('sw-resize', i++));
				sizers.push(this.createSizer('s-resize', i++));
			}
			
			sizers.push(this.createSizer('se-resize', i++));
		}
		
		var geo = this.graph.model.getGeometry(this.state.cell);
		
		if (geo != null && !geo.relative && !this.graph.isSwimlane(this.state.cell) &&
			this.graph.isLabelMovable(this.state.cell))
		{
			// Marks this as the label handle for getHandleForEvent
			this.labelShape = this.createSizer(mxConstants.CURSOR_LABEL_HANDLE, mxEvent.LABEL_HANDLE,
				mxConstants.LABEL_HANDLE_SIZE, mxConstants.LABEL_HANDLE_FILLCOLOR);
			sizers.push(this.labelShape);
		}
	}
	else if (this.graph.isCellMovable(this.state.cell) && !resizable &&
		this.state.width < 2 && this.state.height < 2)
	{
		this.labelShape = this.createSizer(mxConstants.CURSOR_MOVABLE_VERTEX,
			mxEvent.LABEL_HANDLE, null, mxConstants.LABEL_HANDLE_FILLCOLOR);
		sizers.push(this.labelShape);
	}

	// Adds the rotation handler
	if (this.rotationShape == null)
	{
		this.rotationShape = this.createSizer(this.rotationCursor, mxEvent.ROTATION_HANDLE,
			mxConstants.HANDLE_SIZE + 3, mxConstants.HANDLE_FILLCOLOR);
		sizers.push(this.rotationShape);
	}

	return sizers;
};

/**
 * Function: destroyCustomHandles
 * 
 * Destroys the handler and all its resources and DOM nodes.
 */
mxVertexHandler.prototype.destroyCustomHandles = function()
{
	if (this.customHandles != null)
	{
		for (var i = 0; i < this.customHandles.length; i++)
		{
			if (this.customHandles[i] != null)
			{
				this.customHandles[i].destroy();
			}
		}
		
		this.customHandles = null;
	}
};

/**
 * Function: destroySizers
 * 
 * Destroys the handler and all its resources and DOM nodes.
 */
mxVertexHandler.prototype.destroySizers = function()
{
	if (this.sizers != null)
	{
		for (var i = 0; i < this.sizers.length; i++)
		{
			this.sizers[i].destroy();
		}
		
		this.sizers = null;
		this.rotationShape = null;
	}
};

/**
 * Function: isDestroyed
 * 
 * Returns true if this handler was destroyed or not initialized.
 */
mxVertexHandler.prototype.isDestroyed = function()
{
	return this.selectionBorder == null;
};

/**
 * Function: destroy
 * 
 * Destroys the handler and all its resources and DOM nodes.
 */
mxVertexHandler.prototype.destroy = function()
{
	if (this.escapeHandler != null)
	{
		this.state.view.graph.removeListener(this.escapeHandler);
		this.escapeHandler = null;
	}
	
	if (this.preview != null)
	{
		this.preview.destroy();
		this.preview = null;
	}
	
	if (this.ghostPreview != null)
	{
		this.ghostPreview.destroy();
		this.ghostPreview = null;
	}

	if (this.selectionBorder != null)
	{
		this.selectionBorder.destroy();
		this.selectionBorder = null;
	}
	
	if (this.parentHighlight != null)
	{
		this.destroyParentHighlight();
	}
	
	this.labelShape = null;
	this.removeHint();
	this.destroySizers();
	this.destroyCustomHandles();
};
