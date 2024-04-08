/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: mxGraphHandler
 * 
 * Graph event handler that handles selection. Individual cells are handled
 * separately using <mxVertexHandler> or one of the edge handlers. These
 * handlers are created using <mxGraph.createHandler> in
 * <mxGraphSelectionModel.cellAdded>.
 * 
 * To avoid the container to scroll a moved cell into view, set
 * <scrollAfterMove> to false.
 * 
 * Constructor: mxGraphHandler
 * 
 * Constructs an event handler that creates handles for the
 * selection cells.
 * 
 * Parameters:
 * 
 * graph - Reference to the enclosing <mxGraph>.
 */
function mxGraphHandler(graph)
{
	this.graph = graph;
	this.graph.addMouseListener(this);
	
	// Repaints the handler after autoscroll
	this.panHandler = mxUtils.bind(this, function()
	{
		if (!this.suspended)
		{
			this.updatePreview();
			this.updateHint();
		}
	});
	
	this.graph.addListener(mxEvent.PAN, this.panHandler);
	
	// Handles escape keystrokes
	this.escapeHandler = mxUtils.bind(this, function(sender, evt)
	{
		this.reset();
	});
	
	this.graph.addListener(mxEvent.ESCAPE, this.escapeHandler);
	
	// Updates the preview box for remote changes
	this.refreshHandler = mxUtils.bind(this, function(sender, evt)
	{
		// Merges multiple pending calls
		if (this.refreshThread)
		{
			window.clearTimeout(this.refreshThread);
		}

		// Waits for the states and handlers to be updated
		this.refreshThread = window.setTimeout(mxUtils.bind(this, function()
		{
			this.refreshThread = null;
			
			if (this.first != null && !this.suspended)
			{
				// Updates preview with no translate to compute bounding box
				var dx = this.currentDx;
				var dy = this.currentDy;
				this.currentDx = 0;
				this.currentDy = 0;
				this.updatePreview();
				this.bounds = this.graph.getView().getBounds(this.cells);
				this.pBounds = this.getPreviewBounds(this.cells);

				if (this.pBounds == null && !this.livePreviewUsed)
				{
					this.reset();
				}
				else
				{
					// Restores translate and updates preview
					this.currentDx = dx;
					this.currentDy = dy;
					this.updatePreview();
					this.updateHint();

					if (this.livePreviewUsed)
					{
						// Forces update to ignore last visible state
						this.setHandlesVisibleForCells(
							this.graph.selectionCellsHandler.
							getHandledSelectionCells(), false, true);
						this.updatePreview();
					}
				}
			}
		}), 0);
	});
	
	this.graph.getModel().addListener(mxEvent.CHANGE, this.refreshHandler);
	this.graph.addListener(mxEvent.REFRESH, this.refreshHandler);
	
	this.keyHandler = mxUtils.bind(this, function(e)
	{
		if (this.graph.container != null && this.graph.container.style.visibility != 'hidden' &&
			this.first != null && !this.suspended)
		{
			var clone = this.graph.isCloneEvent(e) &&
				this.graph.isCellsCloneable() &&
				this.isCloneEnabled();
			
			if (clone != this.cloning)
			{
				this.cloning = clone;
				this.checkPreview();
				this.updatePreview();
			}
		}
	});
	
	mxEvent.addListener(document, 'keydown', this.keyHandler);
	mxEvent.addListener(document, 'keyup', this.keyHandler);
};

/**
 * Variable: graph
 * 
 * Reference to the enclosing <mxGraph>.
 */
mxGraphHandler.prototype.graph = null;

/**
 * Variable: maxCells
 * 
 * Defines the maximum number of cells to paint subhandles
 * for. Default is 50 for Firefox and 20 for IE. Set this
 * to 0 if you want an unlimited number of handles to be
 * displayed. This is only recommended if the number of
 * cells in the graph is limited to a small number.
 */
mxGraphHandler.prototype.maxCells = (mxClient.IS_IE) ? 20 : 50;

/**
 * Variable: enabled
 * 
 * Specifies if events are handled. Default is true.
 */
mxGraphHandler.prototype.enabled = true;

/**
 * Variable: highlightEnabled
 * 
 * Specifies if drop targets under the mouse should be enabled. Default is
 * true.
 */
mxGraphHandler.prototype.highlightEnabled = true;

/**
 * Variable: cloneEnabled
 * 
 * Specifies if cloning by control-drag is enabled. Default is true.
 */
mxGraphHandler.prototype.cloneEnabled = true;

/**
 * Variable: moveEnabled
 * 
 * Specifies if moving is enabled. Default is true.
 */
mxGraphHandler.prototype.moveEnabled = true;

/**
 * Variable: guidesEnabled
 * 
 * Specifies if other cells should be used for snapping the right, center or
 * left side of the current selection. Default is false.
 */
mxGraphHandler.prototype.guidesEnabled = false;

/**
 * Variable: handlesVisible
 * 
 * Whether the handles of the selection are currently visible.
 */
mxGraphHandler.prototype.handlesVisible = true;

/**
 * Variable: guide
 * 
 * Holds the <mxGuide> instance that is used for alignment.
 */
mxGraphHandler.prototype.guide = null;

/**
 * Variable: currentDx
 * 
 * Stores the x-coordinate of the current mouse move.
 */
mxGraphHandler.prototype.currentDx = null;

/**
 * Variable: currentDy
 * 
 * Stores the y-coordinate of the current mouse move.
 */
mxGraphHandler.prototype.currentDy = null;

/**
 * Variable: updateCursor
 * 
 * Specifies if a move cursor should be shown if the mouse is over a movable
 * cell. Default is true.
 */
mxGraphHandler.prototype.updateCursor = true;

/**
 * Variable: selectEnabled
 * 
 * Specifies if selecting is enabled. Default is true.
 */
mxGraphHandler.prototype.selectEnabled = true;

/**
 * Variable: removeCellsFromParent
 * 
 * Specifies if cells may be moved out of their parents. Default is true.
 */
mxGraphHandler.prototype.removeCellsFromParent = true;

/**
 * Variable: removeEmptyParents
 * 
 * If empty parents should be removed from the model after all child cells
 * have been moved out. Default is true.
 */
mxGraphHandler.prototype.removeEmptyParents = false;

/**
 * Variable: connectOnDrop
 * 
 * Specifies if drop events are interpreted as new connections if no other
 * drop action is defined. Default is false.
 */
mxGraphHandler.prototype.connectOnDrop = false;

/**
 * Variable: scrollOnMove
 * 
 * Specifies if the view should be scrolled so that a moved cell is
 * visible. Default is true.
 */
mxGraphHandler.prototype.scrollOnMove = true;

/**
 * Variable: minimumSize
 * 
 * Specifies the minimum number of pixels for the width and height of a
 * selection border. Default is 6.
 */
mxGraphHandler.prototype.minimumSize = 6;

/**
 * Variable: previewColor
 * 
 * Specifies the color of the preview shape. Default is black.
 */
mxGraphHandler.prototype.previewColor = 'black';

/**
 * Variable: htmlPreview
 * 
 * Specifies if the graph container should be used for preview. If this is used
 * then drop target detection relies entirely on <mxGraph.getCellAt> because
 * the HTML preview does not "let events through". Default is false.
 */
mxGraphHandler.prototype.htmlPreview = false;

/**
 * Variable: shape
 * 
 * Reference to the <mxShape> that represents the preview.
 */
mxGraphHandler.prototype.shape = null;

/**
 * Variable: scaleGrid
 * 
 * Specifies if the grid should be scaled. Default is false.
 */
mxGraphHandler.prototype.scaleGrid = false;

/**
 * Variable: rotationEnabled
 * 
 * Specifies if the bounding box should allow for rotation. Default is true.
 */
mxGraphHandler.prototype.rotationEnabled = true;

/**
 * Variable: maxLivePreview
 * 
 * Maximum number of cells for which live preview should be used. Default is 0
 * which means no live preview.
 */
mxGraphHandler.prototype.maxLivePreview = 0;

/**
 * Variable: allowLivePreview
 * 
 * If live preview is allowed on this system. Default is true for systems with
 * SVG support.
 */
mxGraphHandler.prototype.allowLivePreview = mxClient.IS_SVG;

/**
 * Function: isEnabled
 * 
 * Returns <enabled>.
 */
mxGraphHandler.prototype.isEnabled = function()
{
	return this.enabled;
};

/**
 * Function: setEnabled
 * 
 * Sets <enabled>.
 */
mxGraphHandler.prototype.setEnabled = function(value)
{
	this.enabled = value;
};

/**
 * Function: isCloneEnabled
 * 
 * Returns <cloneEnabled>.
 */
mxGraphHandler.prototype.isCloneEnabled = function()
{
	return this.cloneEnabled;
};

/**
 * Function: setCloneEnabled
 * 
 * Sets <cloneEnabled>.
 * 
 * Parameters:
 * 
 * value - Boolean that specifies the new clone enabled state.
 */
mxGraphHandler.prototype.setCloneEnabled = function(value)
{
	this.cloneEnabled = value;
};

/**
 * Function: isMoveEnabled
 * 
 * Returns <moveEnabled>.
 */
mxGraphHandler.prototype.isMoveEnabled = function()
{
	return this.moveEnabled;
};

/**
 * Function: setMoveEnabled
 * 
 * Sets <moveEnabled>.
 */
mxGraphHandler.prototype.setMoveEnabled = function(value)
{
	this.moveEnabled = value;
};

/**
 * Function: isSelectEnabled
 * 
 * Returns <selectEnabled>.
 */
mxGraphHandler.prototype.isSelectEnabled = function()
{
	return this.selectEnabled;
};

/**
 * Function: setSelectEnabled
 * 
 * Sets <selectEnabled>.
 */
mxGraphHandler.prototype.setSelectEnabled = function(value)
{
	this.selectEnabled = value;
};

/**
 * Function: isRemoveCellsFromParent
 * 
 * Returns <removeCellsFromParent>.
 */
mxGraphHandler.prototype.isRemoveCellsFromParent = function()
{
	return this.removeCellsFromParent;
};

/**
 * Function: setRemoveCellsFromParent
 * 
 * Sets <removeCellsFromParent>.
 */
mxGraphHandler.prototype.setRemoveCellsFromParent = function(value)
{
	this.removeCellsFromParent = value;
};

/**
 * Function: isPropagateSelectionCell
 * 
 * Returns true if the given cell and parent should propagate
 * selection state to the parent.
 */
mxGraphHandler.prototype.isPropagateSelectionCell = function(cell, immediate, me)
{
	var parent = this.graph.model.getParent(cell);

	if (immediate)
	{
		var geo = (this.graph.model.isEdge(cell)) ? null :
			this.graph.getCellGeometry(cell);
		
		return !this.graph.isSiblingSelected(cell) &&
			((geo != null && geo.relative) ||
			!this.graph.isSwimlane(parent));
	}
	else
	{
		return (!this.graph.isToggleEvent(me.getEvent()) ||
			(!this.graph.isSiblingSelected(cell) &&
			!this.graph.isCellSelected(cell) &&
			(!this.graph.isSwimlane(parent)) ||
			this.graph.isCellSelected(parent))) &&
			(this.graph.isToggleEvent(me.getEvent()) ||
			!this.graph.isCellSelected(parent));
	}
};

/**
 * Function: getInitialCellForEvent
 * 
 * Hook to return initial cell for the given event. This returns
 * the topmost cell that is not a swimlane or is selected.
 */
mxGraphHandler.prototype.getInitialCellForEvent = function(me)
{
	var state = me.getState();
	
	if ((!this.graph.isToggleEvent(me.getEvent()) || !mxEvent.isAltDown(me.getEvent())) &&
		state != null && !this.graph.isCellSelected(state.cell))
	{
		var model = this.graph.model;
		var next = this.graph.view.getState(model.getParent(state.cell));

		while (next != null && !this.graph.isCellSelected(next.cell) &&
			(model.isVertex(next.cell) || model.isEdge(next.cell)) &&
			this.isPropagateSelectionCell(state.cell, true, me) &&
			next.cell != this.graph.getCurrentRoot())
		{
			state = next;
			next = this.graph.view.getState(this.graph.getModel().getParent(state.cell));
		}
	}
	
	return (state != null) ? state.cell : null;
};

/**
 * Function: isDelayedSelection
 * 
 * Returns true if the cell or one of its ancestors is selected.
 */
mxGraphHandler.prototype.isDelayedSelection = function(cell, me)
{
	if (!this.graph.isToggleEvent(me.getEvent()) || !mxEvent.isAltDown(me.getEvent()))
	{
		while (cell != null)
		{
			if (this.graph.selectionCellsHandler.isHandled(cell))
			{
				return this.graph.cellEditor.getEditingCell() != cell;
			}
			
			cell = this.graph.model.getParent(cell);
		}
	}
	
	return this.graph.isToggleEvent(me.getEvent());
};

/**
 * Function: selectDelayed
 * 
 * Implements the delayed selection for the given mouse event.
 */
mxGraphHandler.prototype.selectDelayed = function(me)
{
	if (!this.graph.popupMenuHandler.isPopupTrigger(me))
	{
		var cell = me.getCell();

		if (cell == null)
		{
			cell = this.cell;
		}
		
		this.selectCellForEvent(cell, me);
	}
};

/**
 * Function: selectCellForEvent
 * 
 * Selects the given cell for the given <mxMouseEvent>.
 */
mxGraphHandler.prototype.selectCellForEvent = function(cell, me)
{
	var state = this.graph.view.getState(cell);
	
	if (state != null)
	{
		if (me.isSource(state.control))
		{
			this.graph.selectCellForEvent(cell, me.getEvent());
		}
		else
		{
			if (!this.graph.isToggleEvent(me.getEvent()) ||
				!mxEvent.isAltDown(me.getEvent()))
			{
				var model = this.graph.getModel();
				var parent = model.getParent(cell);
				
				while (this.graph.view.getState(parent) != null &&
					(model.isVertex(parent) || (model.isEdge(parent) &&
					!this.graph.isToggleEvent(me.getEvent()))) &&
					this.isPropagateSelectionCell(cell, false, me) &&
					parent != this.graph.getCurrentRoot())
				{
					cell = parent;
					parent = model.getParent(cell);
				}
			}

			this.graph.selectCellForEvent(cell, me.getEvent());
		}
	}
	
	return cell;
};

/**
 * Function: consumeMouseEvent
 * 
 * Consumes the given mouse event. NOTE: This may be used to enable click
 * events for links in labels on iOS as follows as consuming the initial
 * touchStart disables firing the subsequent click event on the link.
 * 
 * <code>
 * mxGraphHandler.prototype.consumeMouseEvent = function(evtName, me)
 * {
 *   var source = mxEvent.getSource(me.getEvent());
 *   
 *   if (!mxEvent.isTouchEvent(me.getEvent()) || source.nodeName != 'A')
 *   {
 *     me.consume();
 *   }
 * }
 * </code>
 */
mxGraphHandler.prototype.consumeMouseEvent = function(evtName, me)
{
	me.consume();
};

/**
 * Function: mouseDown
 * 
 * Handles the event by selecing the given cell and creating a handle for
 * it. By consuming the event all subsequent events of the gesture are
 * redirected to this handler.
 */
mxGraphHandler.prototype.mouseDown = function(sender, me)
{
	this.mouseDownX = me.getX();
	this.mouseDownY = me.getY();
	var evt = me.getEvent();

	var forceMove = mxEvent.isAltDown(evt) && mxEvent.isShiftDown(evt) &&
		!this.graph.isSelectionEmpty();

	if (!me.isConsumed() && this.isEnabled() && this.graph.isEnabled() &&
		(me.getState() != null || forceMove) && !mxEvent.isMultiTouchEvent(evt))
	{
		var cell = this.getInitialCellForEvent(me);
		this.delayedSelection = this.isDelayedSelection(cell, me);
		this.cell = null;

		if (cell == null && forceMove)
		{
			cell = this.graph.getSelectionCell();
		}

		var selectionCount = this.graph.getSelectionCount();

		if (this.isSelectEnabled() && !this.delayedSelection)
		{
			this.graph.selectCellForEvent(cell, evt);
		}

		if (mxEvent.isTouchEvent(me.getEvent()) && this.graph.isCellSelected(cell) &&
			selectionCount > 0)
		{
			this.blockDelayedSelection = true;
			this.delayedSelection = true;
		}
		
		if (this.isMoveEnabled())
		{
			if (this.delayedSelection)
			{
				this.cell = cell;
			}
			else
			{
				this.start(cell, me.getX(), me.getY());
			}

			this.cellWasClicked = true;

			if (!this.graph.isCellLocked(cell))
			{
				this.consumeMouseEvent(mxEvent.MOUSE_DOWN, me);
			}
		}
	}
};

/**
 * Function: getGuideStates
 * 
 * Creates an array of cell states which should be used as guides.
 */
mxGraphHandler.prototype.getGuideStates = function()
{
	var parent = this.graph.getDefaultParent();
	var model = this.graph.getModel();
	
	var filter = mxUtils.bind(this, function(cell)
	{
		return this.graph.view.getState(cell) != null &&
			model.isVertex(cell) &&
			model.getGeometry(cell) != null &&
			!model.getGeometry(cell).relative;
	});
	
	return this.graph.view.getCellStates(model.filterDescendants(filter, parent));
};

/**
 * Function: getCells
 * 
 * Returns the cells to be modified by this handler. This implementation
 * returns all selection cells that are movable, or the given initial cell if
 * the given cell is not selected and movable. This handles the case of moving
 * unselectable or unselected cells.
 * 
 * Parameters:
 * 
 * initialCell - <mxCell> that triggered this handler.
 */
mxGraphHandler.prototype.getCells = function(initialCell, cells)
{
	if (cells == null && !this.delayedSelection &&
		this.graph.isCellMovable(initialCell))
	{
		return [this.graph.getCompositeParent(initialCell)];
	}
	else
	{
		cells = (cells != null) ? cells : this.graph.getSelectionCells();
		var dict = new mxDictionary();

		// Gets composite parents
		var comp = [];

		for (var i = 0; i < cells.length; i++)
		{
			var cell = this.graph.getCompositeParent(cells[i]);

			if (dict.get(cell) == null)
			{
				dict.put(cell, true);
				comp.push(cell);
			}
		}

		// Removes descendants
		var result = [];

		for (var i = 0; i < comp.length; i++)
		{
			var temp = this.graph.model.getParent(comp[i]);

			while (dict.get(temp) == null && temp != null)
			{
				temp = this.graph.model.getParent(temp);
			}

			if (temp == null)
			{
				result.push(comp[i]);
			}
		}

		return this.graph.getMovableCells(result);
	}
};

/**
 * Function: getPreviewBounds
 * 
 * Returns the <mxRectangle> used as the preview bounds for
 * moving the given cells.
 */
mxGraphHandler.prototype.getPreviewBounds = function(cells)
{
	var bounds = this.getBoundingBox(cells);
	
	if (bounds != null)
	{
		// Corrects width and height
		bounds.width = Math.max(0, bounds.width - 1);
		bounds.height = Math.max(0, bounds.height - 1);
		
		if (bounds.width < this.minimumSize)
		{
			var dx = this.minimumSize - bounds.width;
			bounds.x -= dx / 2;
			bounds.width = this.minimumSize;
		}
		else
		{
			bounds.x = Math.round(bounds.x);
			bounds.width = Math.ceil(bounds.width);
		}
		
		var tr = this.graph.view.translate;
		var s = this.graph.view.scale;
		
		if (bounds.height < this.minimumSize)
		{
			var dy = this.minimumSize - bounds.height;
			bounds.y -= dy / 2;
			bounds.height = this.minimumSize;
		}
		else
		{
			bounds.y = Math.round(bounds.y);
			bounds.height = Math.ceil(bounds.height);
		}
	}
	
	return bounds;
};

/**
 * Function: getBoundingBox
 * 
 * Returns the union of the <mxCellStates> for the given array of <mxCells>.
 * For vertices, this method uses the bounding box of the corresponding shape
 * if one exists. The bounding box of the corresponding text label and all
 * controls and overlays are ignored. See also: <mxGraphView.getBounds> and
 * <mxGraph.getBoundingBox>.
 *
 * Parameters:
 *
 * cells - Array of <mxCells> whose bounding box should be returned.
 */
mxGraphHandler.prototype.getBoundingBox = function(cells)
{
	var result = null;
	
	if (cells != null && cells.length > 0)
	{
		var model = this.graph.getModel();
		
		for (var i = 0; i < cells.length; i++)
		{
			if (model.isVertex(cells[i]) || model.isEdge(cells[i]))
			{
				var state = this.graph.view.getState(cells[i]);
			
				if (state != null)
				{
					var bbox = state;
					
					if (model.isVertex(cells[i]) && state.shape != null && state.shape.boundingBox != null)
					{
						bbox = state.shape.boundingBox;
					}
					
					if (result == null)
					{
						result = mxRectangle.fromRectangle(bbox);
					}
					else
					{
						result.add(bbox);
					}
				}
			}
		}
	}
	
	return result;
};

/**
 * Function: createPreviewShape
 * 
 * Creates the shape used to draw the preview for the given bounds.
 */
mxGraphHandler.prototype.createPreviewShape = function(bounds)
{
	var shape = new mxRectangleShape(bounds, null, this.previewColor);
	shape.isDashed = true;
	
	if (this.htmlPreview)
	{
		shape.dialect = mxConstants.DIALECT_STRICTHTML;
		shape.init(this.graph.container);
	}
	else
	{
		// Makes sure to use either SVG shapes in order to implement
		// event-transparency on the background area of the rectangle since
		// HTML shapes do not let mouseevents through even when transparent
		shape.dialect = mxConstants.DIALECT_SVG;
		shape.init(this.graph.getView().getOverlayPane());
		shape.pointerEvents = false;
		
		// Workaround for artifacts on iOS
		if (mxClient.IS_IOS)
		{
			shape.getSvgScreenOffset = function()
			{
				return 0;
			};
		}
	}
	
	return shape;
};

/**
 * Function: start
 * 
 * Starts the handling of the mouse gesture.
 */
mxGraphHandler.prototype.start = function(cell, x, y, cells)
{
	var model = this.graph.model;
	var geo = model.getGeometry(cell);

	if (this.first == null && (this.graph.isCellMovable(cell) && ((!model.isEdge(cell) ||
		this.graph.getSelectionCount() > 1 || (geo.points != null && geo.points.length > 0) ||
		model.getTerminal(cell, true) == null || model.getTerminal(cell, false) == null) ||
		this.graph.allowDanglingEdges)))
	{
		this.cell = cell;
		this.first = mxUtils.convertPoint(this.graph.container, x, y);
		this.cells = (cells != null) ? cells : this.getCells(this.cell);
		this.bounds = this.graph.getView().getBounds(this.cells);
		this.pBounds = this.getPreviewBounds(this.cells);
		this.allCells = new mxDictionary();
		this.cloning = false;
		this.cellCount = 0;
		
		for (var i = 0; i < this.cells.length; i++)
		{
			this.cellCount += this.addStates(this.cells[i], this.allCells);
		}
		
		if (this.guidesEnabled)
		{
			this.guide = new mxGuide(this.graph, this.getGuideStates());
			var parent = this.graph.model.getParent(cell);
			var ignore = this.graph.model.getChildCount(parent) < 2;
			
			// Uses connected states as guides
			var connected = new mxDictionary();
			var opps = this.graph.getOpposites(this.graph.getEdges(this.cell), this.cell);
			
			for (var i = 0; i < opps.length; i++)
			{
				var state = this.graph.view.getState(opps[i]);
				
				if (state != null && !connected.get(state))
				{
					connected.put(state, true);
				}
			}

			this.guide.isStateIgnored = mxUtils.bind(this, function(state)
			{
				var p = this.graph.model.getParent(state.cell);
				
				return state.cell != null && ((!this.cloning &&
					this.isCellMoving(state.cell)) ||
					(state.cell != (this.target || parent) && !ignore &&
					!connected.get(state) &&
					(this.target == null || this.graph.model.getChildCount(
					this.target) >= 2) && p != (this.target || parent)));  
			});
		}
	}
};

/**
 * Function: addStates
 * 
 * Adds the states for the given cell recursively to the given dictionary.
 */
mxGraphHandler.prototype.addStates = function(cell, dict)
{
	var state = this.graph.view.getState(cell);
	var count = 0;
	
	if (state != null && dict.get(cell) == null)
	{
		dict.put(cell, state);
		count++;
		
		var childCount = this.graph.model.getChildCount(cell);
		
		for (var i = 0; i < childCount; i++)
		{
			count += this.addStates(this.graph.model.getChildAt(cell, i), dict);
		}
	}
	
	return count;
};

/**
 * Function: isCellMoving
 * 
 * Returns true if the given cell is currently being moved.
 */
mxGraphHandler.prototype.isCellMoving = function(cell)
{
	return this.allCells.get(cell) != null;
};

/**
 * Function: useGuidesForEvent
 * 
 * Returns true if the guides should be used for the given <mxMouseEvent>.
 * This implementation returns <mxGuide.isEnabledForEvent>.
 */
mxGraphHandler.prototype.useGuidesForEvent = function(me)
{
	return (this.guide != null) ? this.guide.isEnabledForEvent(me.getEvent()) &&
		!this.isConstrainedEvent(me) : true;
};


/**
 * Function: snap
 * 
 * Snaps the given vector to the grid and returns the given mxPoint instance.
 */
mxGraphHandler.prototype.snap = function(vector)
{
	var scale = (this.scaleGrid) ? this.graph.view.scale : 1;
	
	vector.x = this.graph.snap(vector.x / scale) * scale;
	vector.y = this.graph.snap(vector.y / scale) * scale;
	
	return vector;
};

/**
 * Function: getDelta
 * 
 * Returns an <mxPoint> that represents the vector for moving the cells
 * for the given <mxMouseEvent>.
 */
mxGraphHandler.prototype.getDelta = function(me)
{
	var point = mxUtils.convertPoint(this.graph.container, me.getX(), me.getY());
	
	return new mxPoint(point.x - this.first.x - this.graph.panDx,
		point.y - this.first.y - this.graph.panDy);
};

/**
 * Function: updateHint
 * 
 * Hook for subclassers do show details while the handler is active.
 */
mxGraphHandler.prototype.updateHint = function(me) { };

/**
 * Function: removeHint
 * 
 * Hooks for subclassers to hide details when the handler gets inactive.
 */
mxGraphHandler.prototype.removeHint = function() { };

/**
 * Function: roundLength
 * 
 * Hook for rounding the unscaled vector. Allows for half steps in the raster so
 * numbers coming in should be rounded if no half steps are allowed (ie for non
 * aligned standard moving where pixel steps should be preferred).
 */
mxGraphHandler.prototype.roundLength = function(length)
{
	return Math.round(length * 100) / 100;
};

/**
 * Function: isValidDropTarget
 * 
 * Returns true if the given cell is a valid drop target.
 */
mxGraphHandler.prototype.isValidDropTarget = function(target, me)
{
	for (var i = 0; i < this.cells.length; i++)
	{
		if (this.graph.model.getParent(this.cells[i]) != target)
		{
			return true;
		}
	}

	return false;
};

/**
 * Function: checkPreview
 * 
 * Updates the preview if cloning state has changed.
 */
mxGraphHandler.prototype.checkPreview = function()
{
	if (this.livePreviewActive && this.cloning)
	{
		this.resetLivePreview();
		this.livePreviewActive = false;
	}
	else if (this.maxLivePreview >= this.cellCount && !this.livePreviewActive && this.allowLivePreview)
	{
		if (!this.cloning || !this.livePreviewActive)
		{
			this.livePreviewActive = true;
			this.livePreviewUsed = true;
		}
	}
	else if (!this.livePreviewUsed && this.shape == null)
	{
		this.shape = this.createPreviewShape(this.bounds);
	}
};

/**
 * Function: mouseMove
 * 
 * Handles the event by highlighting possible drop targets and updating the
 * preview.
 */
mxGraphHandler.prototype.mouseMove = function(sender, me)
{
	var graph = this.graph;
	var tol = graph.tolerance;

	// Adds cell to selection and start moving cells
	if (this.first == null && this.delayedSelection && this.cell != null &&
		this.mouseDownX != null && this.mouseDownY != null &&
		(Math.abs(this.mouseDownX - me.getX()) > tol ||
		Math.abs(this.mouseDownY - me.getY()) > tol))
	{
		this.delayedSelection = false;
		this.cellWasClicked = true;

		if (!this.graph.isCellSelected(this.cell) &&
			!mxEvent.isAltDown(me.getEvent()))
		{
			if (this.graph.isToggleEvent(me.getEvent()))
			{
				graph.addSelectionCell(this.cell);
			}
			else if (!this.graph.isAncestorSelected(this.cell))
			{
				graph.setSelectionCell(this.cell);
			}
		}

		var cells = graph.getSelectionCells();

		if (!this.graph.isToggleEvent(me.getEvent()) ||
			!mxEvent.isAltDown(me.getEvent()) ||
			graph.isSelectionEmpty())
		{
			cells = cells.concat(this.cell);
		}

		this.start(this.cell, this.mouseDownX, this.mouseDownY,
			this.getCells(null, cells));
	}

	var delta = (this.first != null) ? this.getDelta(me) : null;

	if (!me.isConsumed() && graph.isMouseDown && this.cell != null &&
		delta != null && this.bounds != null && !this.suspended)
	{
		// Stops moving if a multi touch event is received
		if (mxEvent.isMultiTouchEvent(me.getEvent()))
		{
			this.reset();
			return;
		}
		
		if (this.shape != null || this.livePreviewActive || this.cloning ||
			Math.abs(delta.x) > tol || Math.abs(delta.y) > tol)
		{
			// Highlight is used for highlighting drop targets
			if (this.highlight == null)
			{
				this.highlight = new mxCellHighlight(this.graph,
					mxConstants.DROP_TARGET_COLOR, 3);
			}

			var clone = graph.isCloneEvent(me.getEvent()) &&
				graph.isCellsCloneable() &&
				this.isCloneEnabled();
			var gridEnabled = graph.isGridEnabledEvent(me.getEvent());
			var cell = me.getCell();
			cell = (cell != null && mxUtils.indexOf(this.cells, cell) < 0) ? cell :
				graph.getCellAt(me.getGraphX(), me.getGraphY(), null, null, null,
				mxUtils.bind(this, function(state, x, y)
			{
				return mxUtils.indexOf(this.cells, state.cell) >= 0;
			}));
			
			var hideGuide = true;
			var target = null;
			this.cloning = clone;

			if (graph.isDropEnabled() && this.highlightEnabled)
			{
				// Contains a call to getCellAt to find the cell under the mouse
				target = graph.getDropTarget(this.cells, me.getEvent(), cell, clone);
			}

			var state = graph.getView().getState(target);
			var highlight = false;
			
			if (state != null && (clone || this.isValidDropTarget(target, me)))
			{
			    if (this.target != target)
			    {
				    this.target = target;
				    this.setHighlightColor(mxConstants.DROP_TARGET_COLOR);
				}
			    
			    highlight = true;
			}
			else
			{
				this.target = null;

				if (this.connectOnDrop && cell != null && this.cells.length == 1 &&
					graph.getModel().isVertex(cell) && graph.isCellConnectable(cell))
				{
					state = graph.getView().getState(cell);
					
					if (state != null)
					{
						var error = graph.getEdgeValidationError(null, this.cell, cell);
						var color = (error == null) ?
							mxConstants.VALID_COLOR :
							mxConstants.INVALID_CONNECT_TARGET_COLOR;
						this.setHighlightColor(color);
						highlight = true;
					}
				}
			}
			
			if (state != null && highlight)
			{
				this.highlight.highlight(state);
			}
			else
			{
				this.highlight.hide();
			}

			if (this.guide != null && this.useGuidesForEvent(me))
			{
				delta = this.guide.move(this.bounds, delta, gridEnabled, clone);
				hideGuide = false;
			}
			else
			{
				delta = graph.snapDelta(delta, this.bounds, !gridEnabled, false, false);
			}
			
			if (this.guide != null && hideGuide)
			{
				this.guide.hide();
			}

			// Constrained movement if shift key is pressed
			if (this.isConstrainedEvent(me))
			{
				if (Math.abs(delta.x) > Math.abs(delta.y))
				{
					delta.y = 0;
				}
				else
				{
					delta.x = 0;
				}
			}
			
			this.checkPreview();
			
			if (this.currentDx != delta.x || this.currentDy != delta.y)
			{
				this.currentDx = delta.x;
				this.currentDy = delta.y;
				this.updatePreview();
			}
		}

		this.updateHint(me);
		this.consumeMouseEvent(mxEvent.MOUSE_MOVE, me);
		
		// Cancels the bubbling of events to the container so
		// that the droptarget is not reset due to an mouseMove
		// fired on the container with no associated state.
		mxEvent.consume(me.getEvent());
	}
	else if ((this.isMoveEnabled() || this.isCloneEnabled()) && this.updateCursor && !me.isConsumed() &&
			(me.getState() != null || me.sourceState != null) && !graph.isMouseDown)
	{
		var cursor = graph.getCursorForMouseEvent(me);
		
		if (cursor == null && graph.isEnabled() && graph.isCellMovable(me.getCell()))
		{
			if (graph.getModel().isEdge(me.getCell()))
			{
				cursor = mxConstants.CURSOR_MOVABLE_EDGE;
			}
			else
			{
				cursor = mxConstants.CURSOR_MOVABLE_VERTEX;
			}
		}

		// Sets the cursor on the original source state under the mouse
		// instead of the event source state which can be the parent
		if (cursor != null && me.sourceState != null)
		{
			me.sourceState.setCursor(cursor);
		}
	}
};

/**
 * Function: isConstrainedEvent
 * 
 * Returns true if the given event is constrained.
 */
mxGraphHandler.prototype.isConstrainedEvent = function(me)
{
	return (this.target == null || this.graph.isCloneEvent(me.getEvent())) &&
		this.graph.isConstrainedEvent(me.getEvent());
};

/**
 * Function: updatePreview
 * 
 * Updates the bounds of the preview shape.
 */
mxGraphHandler.prototype.updatePreview = function(remote)
{
	if (this.livePreviewUsed && !remote)
	{
		if (this.cells != null)
		{
			this.setHandlesVisibleForCells(
				this.graph.selectionCellsHandler.
				getHandledSelectionCells(), false);
			this.updateLivePreview(this.currentDx, this.currentDy);
		}
	}
	else
	{
		this.updatePreviewShape();
	}
};

/**
 * Function: updatePreviewShape
 * 
 * Updates the bounds of the preview shape.
 */
mxGraphHandler.prototype.updatePreviewShape = function()
{
	if (this.shape != null && this.pBounds != null)
	{
		this.shape.bounds = new mxRectangle(Math.round(this.pBounds.x + this.currentDx),
				Math.round(this.pBounds.y + this.currentDy), this.pBounds.width, this.pBounds.height);
		this.shape.redraw();
	}
};

/**
 * Function: updateLivePreview
 * 
 * Updates the bounds of the preview shape.
 */
mxGraphHandler.prototype.updateLivePreview = function(dx, dy)
{
	if (!this.suspended)
	{
		var states = [];
		
		if (this.allCells != null)
		{
			this.allCells.visit(mxUtils.bind(this, function(key, state)
			{
				var realState = this.graph.view.getState(state.cell);
				
				// Checks if cell was removed or replaced
				if (realState != state)
				{
					state.destroy();
					
					if (realState != null)
					{
						this.allCells.put(state.cell, realState);
					}
					else
					{
						this.allCells.remove(state.cell);
					}
					
					state = realState;
				}
				
				if (state != null)
				{
					// Saves current state
					var tempState = state.clone();
					states.push([state, tempState]);
		
					// Makes transparent for events to detect drop targets
					if (state.shape != null)
					{
						if (state.shape.originalPointerEvents == null)
						{
							state.shape.originalPointerEvents = state.shape.pointerEvents;
						}
						
						state.shape.pointerEvents = false;
		
						if (state.text != null)
						{
							if (state.text.originalPointerEvents == null)
							{
								state.text.originalPointerEvents = state.text.pointerEvents;
							}
						
							state.text.pointerEvents = false;
						}
					}
		
					// Temporarily changes position
					if (this.graph.model.isVertex(state.cell))
					{
						if (!this.cloning || this.graph.isCellCloneable(state.cell))
						{
							state.x += dx;
							state.y += dy;
						}
						
						// Draws the live preview
						if (!this.cloning)
						{
							state.view.graph.cellRenderer.redraw(state, true);
							
							// Forces redraw of connected edges after all states
							// have been updated but avoids update of state
							state.view.invalidate(state.cell);
							state.invalid = false;
							
							// Hides folding icon
							if (state.control != null && state.control.node != null)
							{
								state.control.node.style.visibility = 'hidden';
							}
						}
						// Clone live preview may use text bounds
						else if (state.text != null)
						{
							state.text.updateBoundingBox();
							
							// Fixes preview box for edge labels
							if (state.text.boundingBox != null)
							{
								state.text.boundingBox.x += dx;
								state.text.boundingBox.y += dy;
							}
							
							if (state.text.unrotatedBoundingBox != null)
							{
								state.text.unrotatedBoundingBox.x += dx;
								state.text.unrotatedBoundingBox.y += dy;
							}
						}
					}
				}
			}));
		}
		
		// Resets the handler if everything was removed
		if (states.length == 0)
		{
			this.reset();
		}
		else
		{
			// Redraws connected edges
			var s = this.graph.view.scale;
			
			for (var i = 0; i < states.length; i++)
			{
				var state = states[i][0];
				
				if (this.graph.model.isEdge(state.cell) && (!this.cloning ||
					this.graph.isCellCloneable(state.cell)))
				{
					var geometry = this.graph.getCellGeometry(state.cell);
					var points = [];
					
					if (geometry != null && geometry.points != null)
					{
						for (var j = 0; j < geometry.points.length; j++)
						{
							if (geometry.points[j] != null)
							{
								points.push(new mxPoint(
									geometry.points[j].x + dx / s,
									geometry.points[j].y + dy / s));
							}
						}
					}
		
					var source = state.visibleSourceState;
					var target = state.visibleTargetState;
					var pts = states[i][1].absolutePoints;
					
					if (source == null || !this.isCellMoving(source.cell))
					{
						var pt0 = pts[0];
						state.setAbsoluteTerminalPoint(new mxPoint(pt0.x + dx, pt0.y + dy), true);
						source = null;
					}
					else
					{
						state.view.updateFixedTerminalPoint(state, source, true,
							this.graph.getConnectionConstraint(state, source, true));
					}
					
					if (target == null || !this.isCellMoving(target.cell))
					{
						var ptn = pts[pts.length - 1];
						state.setAbsoluteTerminalPoint(new mxPoint(ptn.x + dx, ptn.y + dy), false);
						target = null;
					}
					else
					{
						state.view.updateFixedTerminalPoint(state, target, false,
							this.graph.getConnectionConstraint(state, target, false));
					}
					
					state.view.updatePoints(state, points, source, target);
					state.view.updateFloatingTerminalPoints(state, source, target);
					state.view.updateEdgeLabelOffset(state);
					state.invalid = false;
	
					// Draws the live preview but avoids update of state
					if (!this.cloning)
					{
						state.view.graph.cellRenderer.redraw(state, true);
					}
				}
			}
		
			this.graph.view.validate();
			this.redrawHandles(states);
			this.resetPreviewStates(states);
		}
	}
};

/**
 * Function: redrawHandles
 * 
 * Redraws the preview shape for the given states array.
 */
mxGraphHandler.prototype.redrawHandles = function(states)
{
	for (var i = 0; i < states.length; i++)
	{
		var handler = this.graph.selectionCellsHandler.getHandler(states[i][0].cell);
		
		if (handler != null)
		{
			handler.redraw(true);
		}
	}
};

/**
 * Function: resetPreviewStates
 * 
 * Resets the given preview states array.
 */
mxGraphHandler.prototype.resetPreviewStates = function(states)
{
	for (var i = 0; i < states.length; i++)
	{
		states[i][0].setState(states[i][1]);
	}
};

/**
 * Function: suspend
 * 
 * Suspends the livew preview.
 */
mxGraphHandler.prototype.suspend = function()
{
	if (!this.suspended)
	{
		if (this.livePreviewUsed)
		{
			this.updateLivePreview(0, 0);
		}
		
		if (this.shape != null)
		{
			this.shape.node.style.visibility = 'hidden';
		} 
	
		if (this.guide != null)
		{
			this.guide.setVisible(false);
		}
		
		this.suspended = true;
	}
};

/**
 * Function: resume
 * 
 * Suspends the livew preview.
 */
mxGraphHandler.prototype.resume = function()
{
	if (this.suspended)
	{
		this.suspended = null;
		
		if (this.livePreviewUsed)
		{
			this.livePreviewActive = true;
		}
		
		if (this.shape != null)
		{
			this.shape.node.style.visibility = 'visible';
		}
		
		if (this.guide != null)
		{
			this.guide.setVisible(true);
		}
	}
};

/**
 * Function: resetLivePreview
 * 
 * Resets the livew preview.
 */
mxGraphHandler.prototype.resetLivePreview = function()
{
	if (this.allCells != null)
	{
		this.allCells.visit(mxUtils.bind(this, function(key, state)
		{
			// Restores event handling
			if (state.shape != null && state.shape.originalPointerEvents != null)
			{
				state.shape.pointerEvents = state.shape.originalPointerEvents;
				state.shape.originalPointerEvents = null;
				
				// Forces repaint even if not moved to update pointer events
				state.shape.bounds = null;
				
				if (state.text != null)
				{
					state.text.pointerEvents = state.text.originalPointerEvents;
					state.text.originalPointerEvents = null;
				}
			}

			// Shows folding icon
			if (state.control != null && state.control.node != null &&
				state.control.node.style.visibility == 'hidden')
			{
				state.control.node.style.visibility = '';
			}
			
			// Fixes preview box for edge labels
			if (!this.cloning)
			{
				if (state.text != null)
				{
					state.text.updateBoundingBox();
				}
			}
			
			// Forces repaint of connected edges
			state.view.invalidate(state.cell);
		}));

		// Repaints all invalid states
		this.graph.view.validate();
	}
};

/**
 * Function: setHandlesVisibleForCells
 * 
 * Sets wether the handles attached to the given cells are visible.
 * 
 * Parameters:
 * 
 * cells - Array of <mxCells>.
 * visible - Boolean that specifies if the handles should be visible.
 * force - Forces an update of the handler regardless of the last used value.
 */
mxGraphHandler.prototype.setHandlesVisibleForCells = function(cells, visible, force)
{
	if (force || this.handlesVisible != visible)
	{
		this.handlesVisible = visible;
	
		for (var i = 0; i < cells.length; i++)
		{
			var handler = this.graph.selectionCellsHandler.getHandler(cells[i]);
			
			if (handler != null)
			{
				handler.setHandlesVisible(visible);
				
				if (visible)
				{
					handler.redraw();
				}
			}
		}
	}
};

/**
 * Function: setHighlightColor
 * 
 * Sets the color of the rectangle used to highlight drop targets.
 * 
 * Parameters:
 * 
 * color - String that represents the new highlight color.
 */
mxGraphHandler.prototype.setHighlightColor = function(color)
{
	if (this.highlight != null)
	{
		this.highlight.setHighlightColor(color);
	}
};

/**
 * Function: mouseUp
 * 
 * Handles the event by applying the changes to the selection cells.
 */
mxGraphHandler.prototype.mouseUp = function(sender, me)
{
	if (!me.isConsumed())
	{
		if (this.livePreviewUsed)
		{
			this.resetLivePreview();
		}

		if (this.cell != null && this.first != null &&
			this.currentDx != null && this.currentDy != null &&
			(this.shape != null || this.livePreviewUsed || this.cloning))
		{
			var graph = this.graph;
			var cell = me.getCell();
			
			if (this.connectOnDrop && this.target == null && cell != null && graph.getModel().isVertex(cell) &&
				graph.isCellConnectable(cell) && graph.isEdgeValid(null, this.cell, cell))
			{
				graph.connectionHandler.connect(this.cell, cell, me.getEvent());
			}
			else
			{
				var scale = graph.getView().scale;
				var dx = this.roundLength(this.currentDx / scale);
				var dy = this.roundLength(this.currentDy / scale);
				var target = this.target;
				
				if (graph.isSplitEnabled() && graph.isSplitTarget(target, this.cells, me.getEvent()))
				{
					graph.splitEdge(target, this.cells, null, dx, dy,
						me.getGraphX(), me.getGraphY());
				}
				else
				{
					this.moveCells(this.cells, dx, dy, this.cloning, this.target, me.getEvent());
				}
			}
		}
		else if (this.isSelectEnabled() && this.delayedSelection &&
			!this.blockDelayedSelection && this.cell != null)
		{
			this.selectDelayed(me);
		}
	}

	// Consumes the event if a cell was initially clicked
	if (this.cellWasClicked)
	{
		this.consumeMouseEvent(mxEvent.MOUSE_UP, me);
	}

	this.reset();
};

/**
 * Function: reset
 * 
 * Resets the state of this handler.
 */
mxGraphHandler.prototype.reset = function()
{
	if (this.livePreviewUsed)
	{
		this.resetLivePreview();
		this.setHandlesVisibleForCells(
			this.graph.selectionCellsHandler.
			getHandledSelectionCells(), true);
	}
	
	this.destroyShapes();
	this.removeHint();

	this.blockDelayedSelection = false;
	this.delayedSelection = false;
	this.livePreviewActive = null;
	this.livePreviewUsed = null;
	this.cellWasClicked = false;
	this.suspended = null;
	this.currentDx = null;
	this.currentDy = null;
	this.cellCount = null;
	this.cloning = false;
	this.allCells = null;
	this.pBounds = null;
	this.guides = null;
	this.target = null;
	this.first = null;
	this.cells = null;
	this.cell = null;
};

/**
 * Function: shouldRemoveCellsFromParent
 * 
 * Returns true if the given cells should be removed from the parent for the specified
 * mousereleased event.
 */
mxGraphHandler.prototype.shouldRemoveCellsFromParent = function(parent, cells, evt)
{
	if (this.graph.getModel().isVertex(parent))
	{
		var pState = this.graph.getView().getState(parent);
		
		if (pState != null)
		{
			var pt = mxUtils.convertPoint(this.graph.container,
				mxEvent.getClientX(evt), mxEvent.getClientY(evt));
			var alpha = mxUtils.toRadians(mxUtils.getValue(pState.style, mxConstants.STYLE_ROTATION) || 0);
			
			if (alpha != 0)
			{
				var cos = Math.cos(-alpha);
				var sin = Math.sin(-alpha);
				var cx = new mxPoint(pState.getCenterX(), pState.getCenterY());
				pt = mxUtils.getRotatedPoint(pt, cos, sin, cx);
			}
		
			return !mxUtils.contains(pState, pt.x, pt.y);
		}
	}
	
	return false;
};

/**
 * Function: moveCells
 * 
 * Moves the given cells by the specified amount.
 */
mxGraphHandler.prototype.moveCells = function(cells, dx, dy, clone, target, evt)
{
	if (clone)
	{
		cells = this.graph.getCloneableCells(cells);
	}
	
	// Removes cells from parent
	var parent = this.graph.getModel().getParent(this.cell);

	// Handles transparent group being dragged via child cells
	if (!this.graph.isCellSelected(this.cell) && this.graph.isCellSelected(parent))
	{
		parent = this.graph.getModel().getParent(parent);
	}

	if (target == null && evt != null && this.isRemoveCellsFromParent() &&
		this.shouldRemoveCellsFromParent(parent, cells, evt))
	{
		target = this.graph.getDefaultParent();
	}
	
	// Cloning into locked cells is not allowed
	clone = clone && !this.graph.isCellLocked(target || this.graph.getDefaultParent());

	this.graph.getModel().beginUpdate();
	try
	{
		var parents = [];
		
		// Removes parent if all child cells are removed
		if (!clone && target != null && this.removeEmptyParents)
		{
			// Collects all non-selected parents
			var dict = new mxDictionary();
			
			for (var i = 0; i < cells.length; i++)
			{
				dict.put(cells[i], true);
			}
			
			// LATER: Recurse up the cell hierarchy
			for (var i = 0; i < cells.length; i++)
			{
				var par = this.graph.model.getParent(cells[i]);

				if (par != null && !dict.get(par))
				{
					dict.put(par, true);
					parents.push(par);
				}
			}
		}
		
		// Passes all selected cells in order to correctly clone or move into
		// the target cell. The method checks for each cell if its movable.
		cells = this.graph.moveCells(cells, dx, dy, clone, target, evt);

		// Removes parent if all child cells are removed
		var temp = [];
		
		for (var i = 0; i < parents.length; i++)
		{
			if (this.shouldRemoveParent(parents[i]))
			{
				temp.push(parents[i]);
			}
		}
		
		this.graph.removeCells(temp, false);
	}
	finally
	{
		this.graph.getModel().endUpdate();
	}

	// Selects the new cells if cells have been cloned
	if (clone)
	{
		this.graph.setSelectionCells(cells);
	}

	if (this.isSelectEnabled() && this.scrollOnMove)
	{
		this.graph.scrollCellToVisible(cells[0]);
	}
};

/**
 * Function: shouldRemoveParent
 * 
 * Returns true if the given parent should be removed after removal of child cells.
 */
mxGraphHandler.prototype.shouldRemoveParent = function(parent)
{
	var state = this.graph.view.getState(parent);
	
	return state != null && (this.graph.model.isEdge(state.cell) || this.graph.model.isVertex(state.cell)) &&
		this.graph.isCellDeletable(state.cell) && this.graph.model.getChildCount(state.cell) == 0 &&
		this.graph.isTransparentState(state);
};

/**
 * Function: destroyShapes
 * 
 * Destroy the preview and highlight shapes.
 */
mxGraphHandler.prototype.destroyShapes = function()
{
	// Destroys the preview dashed rectangle
	if (this.shape != null)
	{
		this.shape.destroy();
		this.shape = null;
	}
	
	if (this.guide != null)
	{
		this.guide.destroy();
		this.guide = null;
	}
	
	// Destroys the drop target highlight
	if (this.highlight != null)
	{
		this.highlight.destroy();
		this.highlight = null;
	}
};

/**
 * Function: destroy
 * 
 * Destroys the handler and all its resources and DOM nodes.
 */
mxGraphHandler.prototype.destroy = function()
{
	this.graph.removeMouseListener(this);
	this.graph.removeListener(this.panHandler);
	
	if (this.escapeHandler != null)
	{
		this.graph.removeListener(this.escapeHandler);
		this.escapeHandler = null;
	}
	
	if (this.refreshHandler != null)
	{
		this.graph.getModel().removeListener(this.refreshHandler);
		this.graph.removeListener(this.refreshHandler);
		this.refreshHandler = null;
	}
	
	mxEvent.removeListener(document, 'keydown', this.keyHandler);
	mxEvent.removeListener(document, 'keyup', this.keyHandler);
	
	this.destroyShapes();
	this.removeHint();
};
