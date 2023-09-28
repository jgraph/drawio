/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: mxHandle
 * 
 * Implements a single custom handle for vertices.
 * 
 * Constructor: mxHandle
 * 
 * Constructs a new handle for the given state.
 * 
 * Parameters:
 * 
 * state - <mxCellState> of the cell to be handled.
 */
function mxHandle(state, cursor, image, shape)
{
	this.graph = state.view.graph;
	this.state = state;
	this.cursor = (cursor != null) ? cursor : this.cursor;
	this.image = (image != null) ? image : this.image;
	this.shape = (shape != null) ? shape : null;
	this.init();
};

/**
 * Variable: cursor
 * 
 * Specifies the cursor to be used for this handle. Default is 'default'.
 */
mxHandle.prototype.cursor = 'default';

/**
 * Variable: image
 * 
 * Specifies the <mxImage> to be used to render the handle. Default is null.
 */
mxHandle.prototype.image = null;

/**
 * Variable: ignoreGrid
 * 
 * Default is false.
 */
mxHandle.prototype.ignoreGrid = false;

/**
 * Function: getPosition
 * 
 * Hook for subclassers to return the current position of the handle.
 */
mxHandle.prototype.getPosition = function(bounds) { };

/**
 * Function: setPosition
 * 
 * Hooks for subclassers to update the style in the <state>.
 */
mxHandle.prototype.setPosition = function(bounds, pt, me) { };

/**
 * Function: execute
 * 
 * Hook for subclassers to execute the handle.
 */
mxHandle.prototype.execute = function(me) { };

/**
 * Function: copyStyle
 * 
 * Sets the cell style with the given name to the corresponding value in <state>.
 */
mxHandle.prototype.copyStyle = function(key)
{
	this.graph.setCellStyles(key, this.state.style[key], [this.state.cell]);
};

/**
 * Function: processEvent
 * 
 * Processes the given <mxMouseEvent> and invokes <setPosition>.
 */
mxHandle.prototype.processEvent = function(me)
{
	var scale = this.graph.view.scale;
	var tr = this.graph.view.translate;
	var pt = new mxPoint(me.getGraphX() / scale - tr.x, me.getGraphY() / scale - tr.y);
	
	// Center shape on mouse cursor
	if (this.shape != null && this.shape.bounds != null)
	{
		pt.x -= this.shape.bounds.width / scale / 4;
		pt.y -= this.shape.bounds.height / scale / 4;
	}

	// Snaps to grid for the rotated position then applies the rotation for the direction after that
	var alpha1 = -mxUtils.toRadians(this.getRotation());
	var alpha2 = -mxUtils.toRadians(this.getTotalRotation()) - alpha1;
	pt = this.flipPoint(this.rotatePoint(this.snapPoint(this.rotatePoint(pt, alpha1),
			this.ignoreGrid || !this.graph.isGridEnabledEvent(me.getEvent())), alpha2));
	this.setPosition(this.state.getPaintBounds(), pt, me);
	this.redraw();
};

/**
 * Function: positionChanged
 * 
 * Should be called after <setPosition> in <processEvent>.
 * This repaints the state using <mxCellRenderer>.
 */
mxHandle.prototype.positionChanged = function()
{
	if (this.state.text != null)
	{
		this.state.text.apply(this.state);
	}
	
	if (this.state.shape != null)
	{
		this.graph.cellRenderer.configureShape(this.state);
	}
	
	this.graph.cellRenderer.redraw(this.state, true);
};

/**
 * Function: getRotation
 * 
 * Returns the rotation defined in the style of the cell.
 */
mxHandle.prototype.getRotation = function()
{
	if (this.state.shape != null)
	{
		return this.state.shape.getRotation();
	}
	
	return 0;
};

/**
 * Function: getTotalRotation
 * 
 * Returns the rotation from the style and the rotation from the direction of
 * the cell.
 */
mxHandle.prototype.getTotalRotation = function()
{
	if (this.state.shape != null)
	{
		return this.state.shape.getShapeRotation();
	}
	
	return 0;
};

/**
 * Function: init
 * 
 * Creates and initializes the shapes required for this handle.
 */
mxHandle.prototype.init = function()
{
	var html = this.isHtmlRequired();
	
	if (this.image != null)
	{
		this.shape = new mxImageShape(new mxRectangle(0, 0, this.image.width, this.image.height), this.image.src);
		this.shape.preserveImageAspect = false;
	}
	else if (this.shape == null)
	{
		this.shape = this.createShape(html);
	}
	
	this.initShape(html);
};

/**
 * Function: createShape
 * 
 * Creates and returns the shape for this handle.
 */
mxHandle.prototype.createShape = function(html)
{
	var bounds = new mxRectangle(0, 0, mxConstants.HANDLE_SIZE, mxConstants.HANDLE_SIZE);
	
	return new mxRectangleShape(bounds, mxConstants.HANDLE_FILLCOLOR, mxConstants.HANDLE_STROKECOLOR);
};

/**
 * Function: initShape
 * 
 * Initializes <shape> and sets its cursor.
 */
mxHandle.prototype.initShape = function(html)
{
	if (html && this.shape.isHtmlAllowed())
	{
		this.shape.dialect = mxConstants.DIALECT_STRICTHTML;
		this.shape.init(this.graph.container);
	}
	else
	{
		this.shape.dialect = (this.graph.dialect != mxConstants.DIALECT_SVG) ?
			mxConstants.DIALECT_MIXEDHTML : mxConstants.DIALECT_SVG;
		
		if (this.cursor != null)
		{
			this.shape.init(this.graph.getView().getOverlayPane());
		}
	}

	mxEvent.redirectMouseEvents(this.shape.node, this.graph, this.state);
	this.shape.node.style.cursor = this.cursor;
};

/**
 * Function: redraw
 * 
 * Renders the shape for this handle.
 */
mxHandle.prototype.redraw = function()
{
	if (this.shape != null && this.state.shape != null)
	{
		var pt = this.getPosition(this.state.getPaintBounds());
		
		if (pt != null)
		{
			var alpha = mxUtils.toRadians(this.getTotalRotation());
			pt = this.rotatePoint(this.flipPoint(pt), alpha);
	
			var scale = this.graph.view.scale;
			var tr = this.graph.view.translate;
			this.shape.bounds.x = Math.floor((pt.x + tr.x) * scale - this.shape.bounds.width / 2);
			this.shape.bounds.y = Math.floor((pt.y + tr.y) * scale - this.shape.bounds.height / 2);
			
			// Needed to force update of text bounds
			this.shape.redraw();
		}
	}
};

/**
 * Function: isHtmlRequired
 * 
 * Returns true if this handle should be rendered in HTML. This returns true if
 * the text node is in the graph container.
 */
mxHandle.prototype.isHtmlRequired = function()
{
	return this.state.text != null && this.state.text.node.parentNode == this.graph.container;
};

/**
 * Function: rotatePoint
 * 
 * Rotates the point by the given angle.
 */
mxHandle.prototype.rotatePoint = function(pt, alpha)
{
	var bounds = this.state.getCellBounds();
	var cx = new mxPoint(bounds.getCenterX(), bounds.getCenterY());
	var cos = Math.cos(alpha);
	var sin = Math.sin(alpha); 

	return mxUtils.getRotatedPoint(pt, cos, sin, cx);
};

/**
 * Function: flipPoint
 * 
 * Flips the given point vertically and/or horizontally.
 */
mxHandle.prototype.flipPoint = function(pt)
{
	if (this.state.shape != null)
	{
		var bounds = this.state.getCellBounds();
		
		if (this.state.shape.flipH)
		{
			pt.x = 2 * bounds.x + bounds.width - pt.x;
		}
		
		if (this.state.shape.flipV)
		{
			pt.y = 2 * bounds.y + bounds.height - pt.y;
		}
	}
	
	return pt;
};

/**
 * Function: snapPoint
 * 
 * Snaps the given point to the grid if ignore is false. This modifies
 * the given point in-place and also returns it.
 */
mxHandle.prototype.snapPoint = function(pt, ignore)
{
	if (!ignore)
	{
		pt.x = this.graph.snap(pt.x);
		pt.y = this.graph.snap(pt.y);
	}
	
	return pt;
};

/**
 * Function: setVisible
 * 
 * Shows or hides this handle.
 */
mxHandle.prototype.setVisible = function(visible)
{
	if (this.shape != null && this.shape.node != null)
	{
		this.shape.node.style.display = (visible) ? '' : 'none';
	}
};

/**
 * Function: reset
 * 
 * Resets the state of this handle by setting its visibility to true.
 */
mxHandle.prototype.reset = function()
{
	this.setVisible(true);
	this.state.style = this.graph.getCellStyle(this.state.cell);
	this.positionChanged();
};

/**
 * Function: destroy
 * 
 * Destroys this handle.
 */
mxHandle.prototype.destroy = function()
{
	if (this.shape != null)
	{
		this.shape.destroy();
		this.shape = null;
	}
};
