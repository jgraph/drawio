/**
 * Copyright (c) 2006-2015, JGraph Holdings Ltd
 * Copyright (c) 2006-2015, draw.io AG
 */
/**
 * Class: mxCellState
 * 
 * Represents the current state of a cell in a given <mxGraphView>.
 * 
 * For edges, the edge label position is stored in <absoluteOffset>.
 * 
 * The size for oversize labels can be retrieved using the boundingBox property
 * of the <text> field as shown below.
 * 
 * (code)
 * var bbox = (state.text != null) ? state.text.boundingBox : null;
 * (end)
 * 
 * Constructor: mxCellState
 * 
 * Constructs a new object that represents the current state of the given
 * cell in the specified view.
 * 
 * Parameters:
 * 
 * view - <mxGraphView> that contains the state.
 * cell - <mxCell> that this state represents.
 * style - Array of key, value pairs that constitute the style.
 */
function mxCellState(view, cell, style)
{
	this.view = view;
	this.cell = cell;
	this.style = (style != null) ? style : {};
	
	this.origin = new mxPoint();
	this.absoluteOffset = new mxPoint();
};

/**
 * Extends mxRectangle.
 */
mxCellState.prototype = new mxRectangle();
mxCellState.prototype.constructor = mxCellState;

/**
 * Variable: view
 * 
 * Reference to the enclosing <mxGraphView>.
 */
mxCellState.prototype.view = null;

/**
 * Variable: cell
 *
 * Reference to the <mxCell> that is represented by this state.
 */
mxCellState.prototype.cell = null;

/**
 * Variable: style
 * 
 * Contains an array of key, value pairs that represent the style of the
 * cell.
 */
mxCellState.prototype.style = null;

/**
 * Variable: invalidStyle
 * 
 * Specifies if the style is invalid. Default is false.
 */
mxCellState.prototype.invalidStyle = false;

/**
 * Variable: invalid
 *
 * Specifies if the state is invalid. Default is true.
 */
mxCellState.prototype.invalid = true;

/**
 * Variable: graphBoundingBox
 *
 * Holds the bounding box of the shape and label of this state as it was
 * last added to the graph bounds in <mxGraphView.validate>, or null.
 */
mxCellState.prototype.graphBoundingBox = null;

/**
 * Variable: invalidBoundingBox
 *
 * Specifies if the shape or label of this state was repainted since its
 * bounding box was last added to the graph bounds. See
 * <mxGraphView.invalidateBoundingBox>. Default is false.
 */
mxCellState.prototype.invalidBoundingBox = false;

/**
 * Variable: origin
 *
 * <mxPoint> that holds the origin for all child cells. Default is a new
 * empty <mxPoint>.
 */
mxCellState.prototype.origin = null;

/**
 * Variable: absolutePoints
 * 
 * Holds an array of <mxPoints> that represent the absolute points of an
 * edge.
 */
mxCellState.prototype.absolutePoints = null;

/**
 * Variable: absoluteOffset
 *
 * <mxPoint> that holds the absolute offset. For edges, this is the
 * absolute coordinates of the label position. For vertices, this is the
 * offset of the label relative to the top, left corner of the vertex. 
 */
mxCellState.prototype.absoluteOffset = null;

/**
 * Variable: visibleSourceState
 * 
 * Caches the visible source terminal state.
 */
mxCellState.prototype.visibleSourceState = null;

/**
 * Variable: visibleTargetState
 * 
 * Caches the visible target terminal state.
 */
mxCellState.prototype.visibleTargetState = null;

/**
 * Variable: terminalDistance
 * 
 * Caches the distance between the end points for an edge.
 */
mxCellState.prototype.terminalDistance = 0;

/**
 * Variable: length
 *
 * Caches the length of an edge.
 */
mxCellState.prototype.length = 0;

/**
 * Variable: segments
 * 
 * Array of numbers that represent the cached length of each segment of the
 * edge.
 */
mxCellState.prototype.segments = null;

/**
 * Variable: shape
 * 
 * Holds the <mxShape> that represents the cell graphically.
 */
mxCellState.prototype.shape = null;

/**
 * Variable: text
 * 
 * Holds the <mxText> that represents the label of the cell. Thi smay be
 * null if the cell has no label.
 */
mxCellState.prototype.text = null;

/**
 * Variable: unscaledWidth
 * 
 * Holds the unscaled width of the state.
 */
mxCellState.prototype.unscaledWidth = null;

/**
 * Variable: unscaledHeight
 * 
 * Holds the unscaled height of the state.
 */
mxCellState.prototype.unscaledHeight = null;

/**
 * Variable: cellPoints
 *
 * Holds the <absolutePoints> in model units. This is updated in
 * <updateCachedBounds>. Default is null.
 */
mxCellState.prototype.cellPoints = null;

/**
 * Variable: cellOffset
 *
 * Holds the <absoluteOffset> in model units. This is updated in
 * <updateCachedBounds>. Default is null.
 */
mxCellState.prototype.cellOffset = null;

/**
 * Variable: cellSegments
 *
 * Holds the <segments> in model units. This is updated in
 * <updateCachedBounds>. Default is null.
 */
mxCellState.prototype.cellSegments = null;

/**
 * Variable: cellLength
 *
 * Holds the <length> in model units. This is updated in
 * <updateCachedBounds>. Default is null.
 */
mxCellState.prototype.cellLength = null;

/**
 * Variable: cellTerminalDistance
 *
 * Holds the <terminalDistance> in model units. This is updated in
 * <updateCachedBounds>. Default is null.
 */
mxCellState.prototype.cellTerminalDistance = null;

/**
 * Function: getPerimeterBounds
 * 
 * Returns the <mxRectangle> that should be used as the perimeter of the
 * cell.
 * 
 * Parameters:
 * 
 * border - Optional border to be added around the perimeter bounds.
 * bounds - Optional <mxRectangle> to be used as the initial bounds.
 */
mxCellState.prototype.getPerimeterBounds = function(border, bounds)
{
	border = border || 0;
	bounds = (bounds != null) ? bounds : new mxRectangle(this.x, this.y, this.width, this.height);
	
	if (this.shape != null && this.shape.stencil != null && this.shape.stencil.aspect == 'fixed')
	{
		var direction = this.style[mxConstants.STYLE_DIRECTION];
		var inverse = (direction == mxConstants.DIRECTION_NORTH || direction == mxConstants.DIRECTION_SOUTH);
		var sw = inverse ? this.shape.stencil.h0 : this.shape.stencil.w0;
		var sh = inverse ? this.shape.stencil.w0 : this.shape.stencil.h0;
		var s = Math.min(bounds.width / sw, bounds.height / sh);

		bounds.x += (bounds.width - sw * s) / 2;
		bounds.y += (bounds.height - sh * s) / 2;
		bounds.width = sw * s;
		bounds.height = sh * s;
	}
	
	if (border != 0)
	{
		bounds.grow(border);
	}
	
	return bounds;
};

/**
 * Function: setAbsoluteTerminalPoint
 * 
 * Sets the first or last point in <absolutePoints> depending on isSource.
 * 
 * Parameters:
 * 
 * point - <mxPoint> that represents the terminal point.
 * isSource - Boolean that specifies if the first or last point should
 * be assigned.
 */
mxCellState.prototype.setAbsoluteTerminalPoint = function(point, isSource)
{
	if (isSource)
	{
		if (this.absolutePoints == null)
		{
			this.absolutePoints = [];
		}
		
		if (this.absolutePoints.length == 0)
		{
			this.absolutePoints.push(point);
		}
		else
		{
			this.absolutePoints[0] = point;
		}
	}
	else
	{
		if (this.absolutePoints == null)
		{
			this.absolutePoints = [];
			this.absolutePoints.push(null);
			this.absolutePoints.push(point);
		}
		else if (this.absolutePoints.length == 1)
		{
			this.absolutePoints.push(point);
		}
		else
		{
			this.absolutePoints[this.absolutePoints.length - 1] = point;
		}
	}
};

/**
 * Function: setCursor
 * 
 * Sets the given cursor on the shape and text shape.
 */
mxCellState.prototype.setCursor = function(cursor)
{
	if (this.shape != null)
	{
		this.shape.setCursor(cursor);
	}
	
	if (this.text != null)
	{
		this.text.setCursor(cursor);
	}
};

/**
 * Function: isFloatingTerminalPoint
 *
 * Returns true if the terminal point for the source or target is floating.
 * 
 * Parameters:
 * 
 * source - Boolean that specifies the source or target terminal.
 */
mxCellState.prototype.isFloatingTerminalPoint = function(source)
{
	var terminal = this.getVisibleTerminalState(source);

	if (terminal == null)
	{
		return false;
	}
	else
	{
		var constraint = this.view.graph.getConnectionConstraint(this, terminal, source)

		return constraint == null || constraint.point == null;
	}
};

/**
 * Function: getVisibleTerminal
 * 
 * Returns the visible source or target terminal cell.
 * 
 * Parameters:
 * 
 * source - Boolean that specifies if the source or target cell should be
 * returned.
 */
mxCellState.prototype.getVisibleTerminal = function(source)
{
	var tmp = this.getVisibleTerminalState(source);
	
	return (tmp != null) ? tmp.cell : null;
};

/**
 * Function: getVisibleTerminalState
 * 
 * Returns the visible source or target terminal state.
 * 
 * Parameters:
 * 
 * source - Boolean that specifies if the source or target state should be
 * returned.
 */
mxCellState.prototype.getVisibleTerminalState = function(source)
{
	return (source) ? this.visibleSourceState : this.visibleTargetState;
};

/**
 * Function: setVisibleTerminalState
 * 
 * Sets the visible source or target terminal state.
 * 
 * Parameters:
 * 
 * terminalState - <mxCellState> that represents the terminal.
 * source - Boolean that specifies if the source or target state should be set.
 */
mxCellState.prototype.setVisibleTerminalState = function(terminalState, source)
{
	if (source)
	{
		this.visibleSourceState = terminalState;
	}
	else
	{
		this.visibleTargetState = terminalState;
	}
};

/**
 * Function: getCellBounds
 * 
 * Returns the unscaled, untranslated bounds.
 */
mxCellState.prototype.getCellBounds = function()
{
	return this.cellBounds;
};

/**
 * Function: getPaintBounds
 * 
 * Returns the unscaled, untranslated paint bounds. This is the same as
 * <getCellBounds> but with a 90 degree rotation if the shape's
 * isPaintBoundsInverted returns true.
 */
mxCellState.prototype.getPaintBounds = function()
{
	return this.paintBounds;
};

/**
 * Function: updateCachedBounds
 *
 * Updates the cellBounds and paintBounds and the other cached fields in
 * model units, that is, without the scale and translate of the view. The
 * values are converted with <mxUtils.unscale> so that they do not depend
 * on the scale or translate. <updateScreenBounds> does the reverse.
 */
mxCellState.prototype.updateCachedBounds = function()
{
	var tr = this.view.translate;
	var s = this.view.scale;
	this.cellBounds = null;
	this.paintBounds = null;

	// Cells without a geometry and the current root are not positioned
	if (this.cell != this.view.currentRoot &&
		this.view.graph.getCellGeometry(this.cell) != null)
	{
		this.cellBounds = new mxRectangle(mxUtils.unscale(this.x, s, tr.x),
			mxUtils.unscale(this.y, s, tr.y), mxUtils.unscale(this.width, s),
			mxUtils.unscale(this.height, s));
		this.paintBounds = mxRectangle.fromRectangle(this.cellBounds);

		if (this.shape != null && this.shape.isPaintBoundsInverted())
		{
			this.paintBounds.rotate90();
		}
	}

	this.cellPoints = null;

	if (this.absolutePoints != null)
	{
		this.cellPoints = [];

		for (var i = 0; i < this.absolutePoints.length; i++)
		{
			var pt = this.absolutePoints[i];
			this.cellPoints.push((pt != null) ? new mxPoint(mxUtils.unscale(pt.x, s, tr.x),
				mxUtils.unscale(pt.y, s, tr.y)) : null);
		}
	}

	this.cellOffset = null;

	if (this.absoluteOffset != null)
	{
		var abs = this.isAbsoluteOffset();
		var dx = (abs) ? tr.x : 0;
		var dy = (abs) ? tr.y : 0;
		this.cellOffset = new mxPoint(mxUtils.unscale(this.absoluteOffset.x, s, dx),
			mxUtils.unscale(this.absoluteOffset.y, s, dy));
	}

	this.cellSegments = null;

	if (this.segments != null)
	{
		this.cellSegments = [];

		for (var i = 0; i < this.segments.length; i++)
		{
			this.cellSegments.push(mxUtils.unscale(this.segments[i], s));
		}
	}

	this.cellLength = mxUtils.unscale(this.length, s);
	this.cellTerminalDistance = mxUtils.unscale(this.terminalDistance, s);
};

/**
 * Function: updateScreenBounds
 *
 * Updates the bounds, <absolutePoints>, <absoluteOffset>, <segments>,
 * <length> and <terminalDistance> from the cached fields in model units
 * for the current scale and translate of the view. This is the reverse
 * of <updateCachedBounds>.
 */
mxCellState.prototype.updateScreenBounds = function()
{
	var tr = this.view.translate;
	var s = this.view.scale;

	if (this.cellBounds != null)
	{
		this.x = (this.cellBounds.x + tr.x) * s;
		this.y = (this.cellBounds.y + tr.y) * s;
		this.width = this.cellBounds.width * s;
		this.height = this.cellBounds.height * s;
	}

	if (this.cellPoints != null)
	{
		this.absolutePoints = [];

		for (var i = 0; i < this.cellPoints.length; i++)
		{
			var pt = this.cellPoints[i];
			this.absolutePoints.push((pt != null) ? new mxPoint(
				(pt.x + tr.x) * s, (pt.y + tr.y) * s) : null);
		}
	}

	if (this.cellOffset != null)
	{
		var abs = this.isAbsoluteOffset();
		var dx = (abs) ? tr.x : 0;
		var dy = (abs) ? tr.y : 0;
		this.absoluteOffset = new mxPoint((this.cellOffset.x + dx) * s,
			(this.cellOffset.y + dy) * s);
	}

	if (this.cellSegments != null)
	{
		this.segments = [];

		for (var i = 0; i < this.cellSegments.length; i++)
		{
			this.segments.push(this.cellSegments[i] * s);
		}
	}

	if (this.cellLength != null)
	{
		this.length = this.cellLength * s;
	}

	if (this.cellTerminalDistance != null)
	{
		this.terminalDistance = this.cellTerminalDistance * s;
	}
};

/**
 * Function: isAbsoluteOffset
 *
 * Returns true if <absoluteOffset> is an absolute position, which is the
 * case for edges, or false if it is an offset relative to the bounds.
 */
mxCellState.prototype.isAbsoluteOffset = function()
{
	return this.view.graph.model.isEdge(this.cell);
};

/**
 * Destructor: setState
 * 
 * Copies all fields from the given state to this state.
 */
mxCellState.prototype.setState = function(state)
{
	this.view = state.view;
	this.cell = state.cell;
	this.style = state.style;
	this.absolutePoints = state.absolutePoints;
	this.origin = state.origin;
	this.absoluteOffset = state.absoluteOffset;
	this.boundingBox = state.boundingBox;
	this.terminalDistance = state.terminalDistance;
	this.segments = state.segments;
	this.length = state.length;
	this.x = state.x;
	this.y = state.y;
	this.width = state.width;
	this.height = state.height;
	this.unscaledWidth = state.unscaledWidth;
	this.unscaledHeight = state.unscaledHeight;
};

/**
 * Function: clone
 *
 * Returns a clone of this <mxPoint>.
 */
mxCellState.prototype.clone = function()
{
 	var clone = new mxCellState(this.view, this.cell,
		(this.style != null) ? mxUtils.clone(this.style) : null);
	
	// Clones the absolute points
	if (this.absolutePoints != null)
	{
		clone.absolutePoints = [];
		
		for (var i = 0; i < this.absolutePoints.length; i++)
		{
			clone.absolutePoints[i] = this.absolutePoints[i] != null ?
					this.absolutePoints[i].clone() : null;
		}
	}

	if (this.origin != null)
	{
		clone.origin = this.origin.clone();
	}

	if (this.absoluteOffset != null)
	{
		clone.absoluteOffset = this.absoluteOffset.clone();
	}

	if (this.boundingBox != null)
	{
		clone.boundingBox = this.boundingBox.clone();
	}

	clone.terminalDistance = this.terminalDistance;
	clone.segments = this.segments;
	clone.length = this.length;
	clone.x = this.x;
	clone.y = this.y;
	clone.width = this.width;
	clone.height = this.height;
	clone.unscaledWidth = this.unscaledWidth;
	clone.unscaledHeight = this.unscaledHeight;
	
	return clone;
};

/**
 * Destructor: destroy
 * 
 * Destroys the state and all associated resources.
 */
mxCellState.prototype.destroy = function()
{
	this.view.graph.cellRenderer.destroy(this);
};
