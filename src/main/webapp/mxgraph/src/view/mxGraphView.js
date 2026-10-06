/**
 * Copyright (c) 2006-2015, JGraph Holdings Ltd
 * Copyright (c) 2006-2015, draw.io AG
 */
/**
 * Class: mxGraphView
 *
 * Extends <mxEventSource> to implement a view for a graph. This class is in
 * charge of computing the absolute coordinates for the relative child
 * geometries, the points for perimeters and edge styles and keeping them
 * cached in <mxCellStates> for faster retrieval. The states are updated
 * whenever the model or the view state (translate, scale) changes. The scale
 * and translate are honoured in the bounds.
 * 
 * Event: mxEvent.UNDO
 * 
 * Fires after the root was changed in <setCurrentRoot>. The <code>edit</code>
 * property contains the <mxUndoableEdit> which contains the
 * <mxCurrentRootChange>.
 * 
 * Event: mxEvent.SCALE_AND_TRANSLATE
 * 
 * Fires after the scale and translate have been changed in <scaleAndTranslate>.
 * The <code>scale</code>, <code>previousScale</code>, <code>translate</code>
 * and <code>previousTranslate</code> properties contain the new and previous
 * scale and translate, respectively.
 * 
 * Event: mxEvent.SCALE
 * 
 * Fires after the scale was changed in <setScale>. The <code>scale</code> and
 * <code>previousScale</code> properties contain the new and previous scale.
 * 
 * Event: mxEvent.TRANSLATE
 * 
 * Fires after the translate was changed in <setTranslate>. The
 * <code>translate</code> and <code>previousTranslate</code> properties contain
 * the new and previous value for translate.
 * 
 * Event: mxEvent.DOWN and mxEvent.UP
 * 
 * Fire if the current root is changed by executing an <mxCurrentRootChange>.
 * The event name depends on the location of the root in the cell hierarchy
 * with respect to the current root. The <code>root</code> and
 * <code>previous</code> properties contain the new and previous root,
 * respectively.
 * 
 * Constructor: mxGraphView
 *
 * Constructs a new view for the given <mxGraph>.
 * 
 * Parameters:
 * 
 * graph - Reference to the enclosing <mxGraph>.
 */
function mxGraphView(graph)
{
	this.graph = graph;
	this.translate = new mxPoint();
	this.graphBounds = new mxRectangle();
	this.states = new mxDictionary();
};

/**
 * Extends mxEventSource.
 */
mxGraphView.prototype = new mxEventSource();
mxGraphView.prototype.constructor = mxGraphView;

/**
 *
 */
mxGraphView.prototype.EMPTY_POINT = new mxPoint();

/**
 * Variable: doneResource
 * 
 * Specifies the resource key for the status message after a long operation.
 * If the resource for this key does not exist then the value is used as
 * the status message. Default is 'done'.
 */
mxGraphView.prototype.doneResource = (mxClient.language != 'none') ? 'done' : '';

/**
 * Function: updatingDocumentResource
 *
 * Specifies the resource key for the status message while the document is
 * being updated. If the resource for this key does not exist then the
 * value is used as the status message. Default is 'updatingDocument'.
 */
mxGraphView.prototype.updatingDocumentResource = (mxClient.language != 'none') ? 'updatingDocument' : '';

/**
 * Variable: allowEval
 * 
 * Specifies if string values in cell styles should be evaluated using
 * <mxUtils.eval>. This will only be used if the string values can't be mapped
 * to objects using <mxStyleRegistry>. Default is false. NOTE: Enabling this
 * switch carries a possible security risk.
 */
mxGraphView.prototype.allowEval = false;

/**
 * Variable: captureDocumentGesture
 * 
 * Specifies if a gesture should be captured when it goes outside of the
 * graph container. Default is true.
 */
mxGraphView.prototype.captureDocumentGesture = true;

/**
 * Variable: labelBoundingBoxDelay
 *
 * Delay in milliseconds for measuring the labels again after fonts or
 * images in labels have loaded. See <scheduleLabelBoundingBoxUpdate>.
 * Default is 100.
 */
mxGraphView.prototype.labelBoundingBoxDelay = 100;

/**
 * Variable: rendering
 * 
 * Specifies if shapes should be created, updated and destroyed using the
 * methods of <mxCellRenderer> in <graph>. Default is true.
 */
mxGraphView.prototype.rendering = true;

/**
 * Variable: checkCachedBounds
 *
 * Specifies if the fields of the cell states in model units should be
 * checked for debugging. If this is true then differences between the
 * screen fields and the fields in model units after <validate>, and
 * changes of the fields in model units in <revalidate> are written to
 * the console. Default is false.
 */
mxGraphView.prototype.checkCachedBounds = false;

/**
 * Variable: modelCoordinates
 *
 * Specifies if the cells are painted in model units in the <drawPane> with
 * a single transform for the scale and translate, so that changes of the
 * scale and translate update the screen fields of the cell states from
 * their fields in model units without repainting the cells. This must be
 * set before the first validation. Default is false.
 */
mxGraphView.prototype.modelCoordinates = false;

/**
 * Variable: stateScale
 *
 * Scale of the screen fields of the cell states if <modelCoordinates> is
 * true.
 */
mxGraphView.prototype.stateScale = null;

/**
 * Variable: stateTranslate
 *
 * Translate of the screen fields of the cell states if <modelCoordinates>
 * is true.
 */
mxGraphView.prototype.stateTranslate = null;

/**
 * Variable: modelGraphBounds
 *
 * <graphBounds> in model units, updated in <setGraphBounds>. This is reused
 * in <validate> if <modelCoordinates> is true and no cells were updated.
 */
mxGraphView.prototype.modelGraphBounds = null;

/**
 * Variable: graphBoundsInvalid
 *
 * Specifies if <modelGraphBounds> must be updated in the next validation.
 */
mxGraphView.prototype.graphBoundsInvalid = true;

/**
 * Variable: incrementalValidation
 *
 * Specifies if <validate> only validates the cells that were invalidated
 * or whose states were created since the last validation instead of
 * walking all cells (see <validateInvalidCells>). Default is true.
 */
mxGraphView.prototype.incrementalValidation = true;

/**
 * Variable: maxInvalidCells
 *
 * Maximum number of invalid cells for <validateInvalidCells>. If more
 * cells are invalid then <validate> walks all cells. Default is 1000.
 */
mxGraphView.prototype.maxInvalidCells = 1000;

/**
 * Variable: invalidCells
 *
 * Holds the cells that were invalidated (see <invalidate>) or whose states
 * were created outside of <validate> since the last validation, or null if
 * the next validation must walk all cells. See <addInvalidCell>.
 */
mxGraphView.prototype.invalidCells = null;

/**
 * Variable: invalidCellsRoot
 *
 * Holds the root of the validation for which <invalidCells> are collected.
 */
mxGraphView.prototype.invalidCellsRoot = null;

/**
 * Variable: createdCells
 *
 * Holds the cells whose states were created in <validateInvalidCells>.
 */
mxGraphView.prototype.createdCells = null;

/**
 * Variable: validatingAllCells
 *
 * Specifies if <validate> is walking all cells.
 */
mxGraphView.prototype.validatingAllCells = false;

/**
 * Variable: fullValidationRequired
 *
 * Specifies if <validate> must walk all cells because the validation of a
 * state depends on the states before it in the walk (eg. line jumps). This
 * is set while validating states and reset before walking all cells.
 * Default is false.
 */
mxGraphView.prototype.fullValidationRequired = false;

/**
 * Variable: invalidBoundingBoxes
 *
 * Holds the states whose shapes or labels were repainted since the graph
 * bounds were computed in <validate>, or null if the next validation must
 * add the bounding boxes of all states. See <invalidateBoundingBox>.
 */
mxGraphView.prototype.invalidBoundingBoxes = null;

/**
 * Variable: removedBoundingBoxes
 *
 * Holds the bounding boxes of the states that were removed since the graph
 * bounds were computed in <validate>. See <invalidBoundingBoxes>.
 */
mxGraphView.prototype.removedBoundingBoxes = null;

/**
 * Variable: addedGraphBounds
 *
 * Holds the graph bounds that were computed from the bounding boxes of the
 * states in the last <validate> with the scale and translate they were
 * computed for, or null. See <getChangedGraphBounds>.
 */
mxGraphView.prototype.addedGraphBounds = null;

/**
 * Variable: stateFieldNames
 *
 * Names of the fields returned by <getStateFields> for debugging.
 */
mxGraphView.prototype.stateFieldNames = ['bounds', 'points', 'offset',
	'segments', 'length', 'terminalDistance'];

/**
 * Variable: graph
 *
 * Reference to the enclosing <mxGraph>.
 */
mxGraphView.prototype.graph = null;

/**
 * Variable: currentRoot
 *
 * <mxCell> that acts as the root of the displayed cell hierarchy.
 */
mxGraphView.prototype.currentRoot = null;

/**
 * Variable: graphBounds
 *
 * <mxRectangle> that caches the scales, translated bounds of the current view.
 */
mxGraphView.prototype.graphBounds = null;

/**
 * Variable: scale
 * 
 * Specifies the scale. Default is 1 (100%).
 */
mxGraphView.prototype.scale = 1;
	
/**
 * Variable: translate
 *
 * <mxPoint> that specifies the current translation. Default is a new
 * empty <mxPoint>.
 */
mxGraphView.prototype.translate = null;

/**
 * Variable: states
 * 
 * <mxDictionary> that maps from cell IDs to <mxCellStates>.
 */
mxGraphView.prototype.states = null;

/**
 * Variable: updateStyle
 * 
 * Specifies if the style should be updated in each validation step. If this
 * is false then the style is only updated if the state is created or if the
 * style of the cell was changed. Default is false.
 */
mxGraphView.prototype.updateStyle = false;

/**
 * Variable: lastNode
 * 
 * During validation, this contains the last DOM node that was processed.
 */
mxGraphView.prototype.lastNode = null;

/**
 * Variable: lastHtmlNode
 * 
 * During validation, this contains the last HTML DOM node that was processed.
 */
mxGraphView.prototype.lastHtmlNode = null;

/**
 * Variable: lastForegroundNode
 * 
 * During validation, this contains the last edge's DOM node that was processed.
 */
mxGraphView.prototype.lastForegroundNode = null;

/**
 * Variable: lastForegroundHtmlNode
 * 
 * During validation, this contains the last edge HTML DOM node that was processed.
 */
mxGraphView.prototype.lastForegroundHtmlNode = null;

/**
 * Function: getGraphBounds
 *
 * Returns <graphBounds>.
 */
mxGraphView.prototype.getGraphBounds = function()
{
	return this.graphBounds;
};

/**
 * Function: getModelGraphBounds
 *
 * Returns <graphBounds> in model units, that is, without the scale and
 * translate of the view.
 */
mxGraphView.prototype.getModelGraphBounds = function()
{
	var b = this.getGraphBounds();
	var s = this.scale;
	var t = this.translate;

	return new mxRectangle(mxUtils.unscale(b.x, s, t.x),
		mxUtils.unscale(b.y, s, t.y), mxUtils.unscale(b.width, s),
		mxUtils.unscale(b.height, s));
};

/**
 * Function: setGraphBounds
 *
 * Sets <graphBounds> and updates <modelGraphBounds>, so that bounds that are
 * set outside of <validate>, eg. after labels changed their size, are kept
 * if the scale or translate changes.
 */
mxGraphView.prototype.setGraphBounds = function(value)
{
	this.graphBounds = value;
	this.modelGraphBounds = (value != null) ? new mxRectangle(
		mxUtils.unscale(value.x, this.scale, this.translate.x),
		mxUtils.unscale(value.y, this.scale, this.translate.y),
		mxUtils.unscale(value.width, this.scale),
		mxUtils.unscale(value.height, this.scale)) : null;
};

/**
 * Function: getBounds
 * 
 * Returns the union of all <mxCellStates> for the given array of <mxCells>.
 *
 * Parameters:
 *
 * cells - Array of <mxCells> whose bounds should be returned.
 */
mxGraphView.prototype.getBounds = function(cells)
{
	var result = null;
	
	if (cells != null && cells.length > 0)
	{
		var model = this.graph.getModel();
		
		for (var i = 0; i < cells.length; i++)
		{
			if (model.isVertex(cells[i]) || model.isEdge(cells[i]))
			{
				var state = this.getState(cells[i]);
			
				if (state != null)
				{
					if (result == null)
					{
						result = mxRectangle.fromRectangle(state);
					}
					else
					{
						result.add(state);
					}
				}
			}
		}
	}
	
	return result;
};

/**
 * Function: setCurrentRoot
 *
 * Sets and returns the current root and fires an <undo> event before
 * calling <mxGraph.sizeDidChange>.
 *
 * Parameters:
 *
 * root - <mxCell> that specifies the root of the displayed cell hierarchy.
 */
mxGraphView.prototype.setCurrentRoot = function(root)
{
	if (this.currentRoot != root)
	{
		var change = new mxCurrentRootChange(this, root);
		change.execute();
		var edit = new mxUndoableEdit(this, true);
		edit.add(change);
		this.fireEvent(new mxEventObject(mxEvent.UNDO, 'edit', edit));
		this.graph.sizeDidChange();
	}
	
	return root;
};

/**
 * Function: scaleAndTranslate
 *
 * Sets the scale and translation and fires a <scale> and <translate> event
 * before calling <revalidate> followed by <mxGraph.sizeDidChange>.
 *
 * Parameters:
 *
 * scale - Decimal value that specifies the new scale (1 is 100%).
 * dx - X-coordinate of the translation.
 * dy - Y-coordinate of the translation.
 */
mxGraphView.prototype.scaleAndTranslate = function(scale, dx, dy)
{
	var previousScale = this.scale;
	var previousTranslate = new mxPoint(this.translate.x, this.translate.y);
	
	if (this.scale != scale || this.translate.x != dx || this.translate.y != dy)
	{
		this.scale = scale;
		
		this.translate.x = dx;
		this.translate.y = dy;

		if (this.isEventsEnabled())
		{
			this.viewStateChanged();
		}
	}
	
	this.fireEvent(new mxEventObject(mxEvent.SCALE_AND_TRANSLATE,
		'scale', scale, 'previousScale', previousScale,
		'translate', this.translate, 'previousTranslate', previousTranslate));
};

/**
 * Function: getScale
 * 
 * Returns the <scale>.
 */
mxGraphView.prototype.getScale = function()
{
	return this.scale;
};

/**
 * Function: setScale
 *
 * Sets the scale and fires a <scale> event before calling <revalidate> followed
 * by <mxGraph.sizeDidChange>.
 *
 * Parameters:
 *
 * value - Decimal value that specifies the new scale (1 is 100%).
 */
mxGraphView.prototype.setScale = function(value)
{
	var previousScale = this.scale;
	
	if (this.scale != value)
	{
		this.scale = value;

		if (this.isEventsEnabled())
		{
			this.viewStateChanged();
		}
	}
	
	this.fireEvent(new mxEventObject(mxEvent.SCALE,
		'scale', value, 'previousScale', previousScale));
};

/**
 * Function: getTranslate
 * 
 * Returns the <translate>.
 */
mxGraphView.prototype.getTranslate = function()
{
	return this.translate;
};

/**
 * Function: setTranslate
 *
 * Sets the translation and fires a <translate> event before calling
 * <revalidate> followed by <mxGraph.sizeDidChange>. The translation is the
 * negative of the origin.
 *
 * Parameters:
 *
 * dx - X-coordinate of the translation.
 * dy - Y-coordinate of the translation.
 */
mxGraphView.prototype.setTranslate = function(dx, dy)
{
	var previousTranslate = new mxPoint(this.translate.x, this.translate.y);
	
	if (this.translate.x != dx || this.translate.y != dy)
	{
		this.translate.x = dx;
		this.translate.y = dy;

		if (this.isEventsEnabled())
		{
			this.viewStateChanged();
		}
	}
	
	this.fireEvent(new mxEventObject(mxEvent.TRANSLATE,
		'translate', this.translate, 'previousTranslate', previousTranslate));
};

/**
 * Function: viewStateChanged
 * 
 * Invoked after <scale> and/or <translate> has changed.
 */
mxGraphView.prototype.viewStateChanged = function()
{
	if (this.modelCoordinates)
	{
		// Reads the size of the container before the validation changes the
		// transform, which would otherwise force a layout of all cells when
		// sizeDidChange reads it (see mxGraph.updateContainerMetrics)
		this.graph.updateContainerMetrics(mxUtils.bind(this, function()
		{
			this.validate();
			this.graph.sizeDidChange();
		}));
	}
	else
	{
		this.revalidate();
		this.graph.sizeDidChange();
	}
};

/**
 * Function: updateScreenStates
 *
 * Updates the screen fields of all cell states and their shapes if the
 * scale or translate changed since the last call. This is used if
 * <modelCoordinates> is true.
 */
mxGraphView.prototype.updateScreenStates = function()
{
	var s = this.stateScale;
	var tr = this.stateTranslate;

	if (s != null && (s != this.scale || tr.x != this.translate.x ||
		tr.y != this.translate.y))
	{
		var states = this.states.getValues();

		for (var i = 0; i < states.length; i++)
		{
			states[i].updateScreenBounds();
			this.graph.cellRenderer.updateScreenBounds(states[i], s, tr);
		}
	}

	this.stateScale = this.scale;
	this.stateTranslate = this.translate.clone();
};

/**
 * Function: updateDrawPaneTransform
 *
 * Applies the scale and translate to the <drawPane> if <modelCoordinates>
 * is true.
 */
mxGraphView.prototype.updateDrawPaneTransform = function()
{
	if (this.drawPane != null)
	{
		var s = this.scale;
		var tr = this.translate;
		this.drawPane.setAttribute('transform', 'translate(' + (tr.x * s) + ',' +
			(tr.y * s) + ') scale(' + s + ')');

		// Updates the scale for the width of the transparent paths for strokes
		var name = mxSvgCanvas2D.prototype.toleranceScaleVariable;

		if (name != null)
		{
			if (this.drawPane.style.getPropertyValue(name) == '')
			{
				this.updateToleranceScale();
			}
			else
			{
				this.scheduleToleranceScaleUpdate();
			}
		}
	}
};

/**
 * Variable: toleranceScaleDelay
 *
 * Delay in milliseconds after the last change of the scale for updating the
 * CSS variable with the scale for the width of the transparent paths for
 * strokes (see <mxSvgCanvas2D.toleranceScaleVariable>), which restyles all
 * cells, so that zooming does not wait for it. Default is 250.
 */
mxGraphView.prototype.toleranceScaleDelay = 250;

/**
 * Variable: toleranceScaleThread
 *
 * Holds the timeout of <scheduleToleranceScaleUpdate>.
 */
mxGraphView.prototype.toleranceScaleThread = null;

/**
 * Function: scheduleToleranceScaleUpdate
 *
 * Calls <updateToleranceScale> after <toleranceScaleDelay>.
 */
mxGraphView.prototype.scheduleToleranceScaleUpdate = function()
{
	window.clearTimeout(this.toleranceScaleThread);
	this.toleranceScaleThread = window.setTimeout(mxUtils.bind(this, function()
	{
		this.toleranceScaleThread = null;
		this.updateToleranceScale();
	}), this.toleranceScaleDelay);
};

/**
 * Function: updateToleranceScale
 *
 * Sets the CSS variable with the scale for the width of the transparent
 * paths for strokes in the <drawPane> to <getToleranceScale>.
 */
mxGraphView.prototype.updateToleranceScale = function()
{
	var name = mxSvgCanvas2D.prototype.toleranceScaleVariable;

	if (this.drawPane != null && name != null)
	{
		var ts = String(this.getToleranceScale());

		if (this.drawPane.style.getPropertyValue(name) != ts)
		{
			this.drawPane.style.setProperty(name, ts);
		}
	}
};

/**
 * Function: getPixelSize
 *
 * Returns the length of a screen pixel for paint and routing rules that
 * use pixel constants, such as perimeters that keep a pixel away from a
 * line. This returns 1, or the scale in model coordinates, where the
 * result of the rules is kept in model units for all scales, so that it
 * is linear in the scale and the same as at 100% on the old path.
 */
mxGraphView.prototype.getPixelSize = function()
{
	return (this.modelCoordinates) ? this.scale : 1;
};

/**
 * Function: getToleranceScale
 *
 * Returns the scale of the drawing on the screen, which the width of the
 * transparent paths for strokes is divided by (see
 * <mxSvgCanvas2D.toleranceScaleVariable>). This implementation returns
 * <scale>.
 */
mxGraphView.prototype.getToleranceScale = function()
{
	return this.scale;
};

/**
 * Function: refresh
 *
 * Clears the view if <currentRoot> is not null and revalidates.
 */
mxGraphView.prototype.refresh = function()
{
	if (this.currentRoot != null)
	{
		this.clear();
	}
	
	this.revalidate();
};

/**
 * Function: revalidate
 *
 * Revalidates the complete view with all cell states.
 */
mxGraphView.prototype.revalidate = function()
{
	var cached = (this.checkCachedBounds) ? this.getCachedBounds() : null;

	this.invalidate();
	this.validate();

	if (cached != null)
	{
		this.compareCachedBounds(cached);
	}
};

/**
 * Function: getStateFields
 *
 * Returns an array with the bounds, points, offset, segments, length and
 * terminal distance of the given state in model units if cached is true
 * or in screen units otherwise. See <stateFieldNames>.
 */
mxGraphView.prototype.getStateFields = function(state, cached)
{
	return (cached) ? [state.cellBounds, state.cellPoints, state.cellOffset,
		state.cellSegments, state.cellLength, state.cellTerminalDistance] :
		[new mxRectangle(state.x, state.y, state.width, state.height),
		state.absolutePoints, state.absoluteOffset, state.segments,
		state.length, state.terminalDistance];
};

/**
 * Function: getCachedBounds
 *
 * Returns an <mxDictionary> that maps from cells to the fields of their
 * states in model units. See <getStateFields>.
 */
mxGraphView.prototype.getCachedBounds = function()
{
	var result = new mxDictionary();
	var states = this.states.getValues();

	for (var i = 0; i < states.length; i++)
	{
		result.put(states[i].cell, this.getStateFields(states[i], true));
	}

	return result;
};

/**
 * Function: compareCachedBounds
 *
 * Writes the fields in model units that differ from the given result of
 * <getCachedBounds> to the console.
 */
mxGraphView.prototype.compareCachedBounds = function(previous)
{
	var states = this.states.getValues();
	var diffs = [];

	for (var i = 0; i < states.length; i++)
	{
		var fields = previous.get(states[i].cell);

		if (fields != null)
		{
			this.addFieldDifferences(diffs, states[i], fields,
				this.getStateFields(states[i], true), 1e-5);
		}
	}

	this.writeFieldDifferences('Revalidation changed fields in model units', diffs);
};

/**
 * Function: compareScreenBounds
 *
 * Writes the screen fields of the given states that differ from the fields
 * in model units to the console. See <mxCellState.updateScreenBounds>.
 */
mxGraphView.prototype.compareScreenBounds = function(states)
{
	var tol = 1e-4 * Math.max(1, this.scale);
	var diffs = [];

	for (var i = 0; i < states.length; i++)
	{
		var state = states[i];
		var tmp = new mxCellState(this, state.cell, state.style);
		tmp.cellBounds = state.cellBounds;
		tmp.cellPoints = state.cellPoints;
		tmp.cellOffset = state.cellOffset;
		tmp.cellSegments = state.cellSegments;
		tmp.cellLength = state.cellLength;
		tmp.cellTerminalDistance = state.cellTerminalDistance;
		tmp.updateScreenBounds();

		this.addFieldDifferences(diffs, state, this.getStateFields(state),
			this.getStateFields(tmp), tol);
	}

	this.writeFieldDifferences('Screen fields differ from fields in model units', diffs);
};

/**
 * Function: addFieldDifferences
 *
 * Adds the names and values of the fields that differ between the given
 * results of <getStateFields> to the given array.
 */
mxGraphView.prototype.addFieldDifferences = function(diffs, state, fields, other, tolerance)
{
	for (var i = 0; i < fields.length; i++)
	{
		if (!this.equalsWithTolerance(fields[i], other[i], tolerance))
		{
			diffs.push({id: state.cell.id, field: this.stateFieldNames[i],
				value: JSON.stringify(fields[i]), expected: JSON.stringify(other[i])});
		}
	}
};

/**
 * Function: equalsWithTolerance
 *
 * Returns true if the given numbers, points, rectangles or arrays thereof
 * are equal within the given tolerance.
 */
mxGraphView.prototype.equalsWithTolerance = function(a, b, tolerance)
{
	var result = a == b;

	if (!result && a != null && b != null)
	{
		if (typeof a === 'number')
		{
			result = Math.abs(a - b) <= tolerance;
		}
		else if (a.length != null)
		{
			result = a.length == b.length;

			for (var i = 0; i < a.length && result; i++)
			{
				result = this.equalsWithTolerance(a[i], b[i], tolerance);
			}
		}
		else
		{
			result = this.equalsWithTolerance(a.x, b.x, tolerance) &&
				this.equalsWithTolerance(a.y, b.y, tolerance) &&
				this.equalsWithTolerance(a.width, b.width, tolerance) &&
				this.equalsWithTolerance(a.height, b.height, tolerance);
		}
	}

	return result;
};

/**
 * Function: writeFieldDifferences
 *
 * Writes the given message and the first differences to the console.
 */
mxGraphView.prototype.writeFieldDifferences = function(message, diffs)
{
	if (diffs.length > 0 && window.console != null)
	{
		console.warn('mxGraphView: ' + message + ' (' + diffs.length + '): ' +
			JSON.stringify(diffs.slice(0, 10)));
	}
};

/**
 * Function: clear
 *
 * Removes the state of the given cell and all descendants if the given
 * cell is not the current root.
 * 
 * Parameters:
 * 
 * cell - Optional <mxCell> for which the state should be removed. Default
 * is the root of the model.
 * force - Boolean indicating if the current root should be ignored for
 * recursion.
 */
mxGraphView.prototype.clear = function(cell, force, recurse)
{
	var model = this.graph.getModel();
	cell = cell || model.getRoot();
	force = (force != null) ? force : false;
	recurse = (recurse != null) ? recurse : true;
	
	// Creates the removed states in the next validation
	this.addInvalidCell(cell);
	this.removeState(cell);
	
	if (recurse && (force || cell != this.currentRoot))
	{
		var childCount = model.getChildCount(cell);
		
		for (var i = 0; i < childCount; i++)
		{
			this.clear(model.getChildAt(cell, i), force);
		}
	}
	else
	{
		this.invalidate(cell);
	}
};

/**
 * Function: invalidate
 * 
 * Invalidates the state of the given cell, all its descendants and
 * connected edges.
 * 
 * Parameters:
 * 
 * cell - Optional <mxCell> to be invalidated. Default is the root of the
 * model.
 */
mxGraphView.prototype.invalidate = function(cell, recurse, includeEdges)
{
	var model = this.graph.getModel();
	cell = cell || model.getRoot();

	if (cell != null)
	{
		recurse = (recurse != null) ? recurse : true;
		includeEdges = (includeEdges != null) ? includeEdges : true;
		
		var state = this.getState(cell);
		
		if (state != null)
		{
			state.invalid = true;
		}
		
		// Avoids infinite loops for invalid graphs
		if (!cell.invalidating)
		{
			cell.invalidating = true;
			this.addInvalidCell(cell);
			
			// Recursively invalidates all descendants
			if (recurse)
			{
				var childCount = model.getChildCount(cell);
				
				for (var i = 0; i < childCount; i++)
				{
					var child = model.getChildAt(cell, i);
					this.invalidate(child, recurse, includeEdges);
				}
			}
			
			// Propagates invalidation to all connected edges
			if (includeEdges)
			{
				var edgeCount = model.getEdgeCount(cell);
				
				for (var i = 0; i < edgeCount; i++)
				{
					this.invalidate(model.getEdgeAt(cell, i), recurse, includeEdges);
				}
			}
			
			delete cell.invalidating;
		}
	}
};

/**
 * Function: validate
 * 
 * Calls <validateCell> and <validateCellState> and updates the <graphBounds>
 * using <getBoundingBox>. Finally the background is validated using
 * <validateBackground>.
 * 
 * Parameters:
 * 
 * cell - Optional <mxCell> to be used as the root of the validation.
 * Default is <currentRoot> or the root of the model.
 */
mxGraphView.prototype.validate = function(cell)
{
	var t0 = mxLog.enter('mxGraphView.validate');
	window.status = mxResources.get(this.updatingDocumentResource) ||
		this.updatingDocumentResource;
	
	this.resetValidationState();
	this.validatedStates = (this.checkCachedBounds) ? [] : null;

	if (this.modelCoordinates)
	{
		this.updateScreenStates();
	}

	var root = (this.currentRoot != null) ? this.currentRoot :
		this.graph.getModel().getRoot();
	var cell = (cell != null) ? cell : root;
	var state = null;

	// Validates only the invalidated cells if possible
	if (cell == root && this.validateInvalidCells(root))
	{
		state = this.getState(root);
	}
	else
	{
		// Collects the cells that are invalidated from now on
		if (cell == root)
		{
			this.invalidCells = [];
			this.invalidCellsRoot = root;
			this.fullValidationRequired = false;
		}

		this.validatingAllCells = true;

		try
		{
			state = this.validateCellState(this.validateCell(cell));
		}
		finally
		{
			this.validatingAllCells = false;
		}
	}

	var b = this.modelGraphBounds;

	// Previous graph bounds for the current scale and translate, which may
	// have changed since the last validation (eg. in sizeDidChange)
	var prev = (b != null) ? new mxRectangle((b.x + this.translate.x) * this.scale,
		(b.y + this.translate.y) * this.scale, b.width * this.scale,
		b.height * this.scale) : null;
	var graphBounds = null;

	// Reuses the graph bounds in model units if no cells were updated
	if (this.modelCoordinates && !this.graphBoundsInvalid && prev != null)
	{
		graphBounds = prev;
	}
	else
	{
		// Adds the changed bounding boxes to the graph bounds if possible
		graphBounds = (cell == root) ? this.getChangedGraphBounds() : null;

		if (graphBounds == null)
		{
			graphBounds = this.getBoundingBox(state, true, true);
		}

		// Validating a part of the graph adds its bounds to the graph bounds,
		// which are computed again in the next validation of the graph
		if (cell != root)
		{
			if (prev != null && (prev.width > 0 || prev.height > 0))
			{
				prev.add(graphBounds);
				graphBounds = prev;
			}

			this.addedGraphBounds = null;
		}
		else
		{
			this.setAddedGraphBounds(graphBounds);
		}

		this.graphBoundsInvalid = cell != root;
	}

	this.setGraphBounds((graphBounds != null) ?
		graphBounds : this.getEmptyBounds());
	this.validateBackground();

	if (this.modelCoordinates)
	{
		this.updateDrawPaneTransform();
	}

	if (this.validatedStates != null)
	{
		this.compareScreenBounds(this.validatedStates);
		this.validatedStates = null;
	}

	this.resetValidationState();
	
	window.status = mxResources.get(this.doneResource) ||
		this.doneResource;
	mxLog.leave('mxGraphView.validate', t0);
};

/**
 * Function: addInvalidCell
 *
 * Adds the given cell to <invalidCells> for the next validation. If the
 * cell is the root of the model or if there are more than <maxInvalidCells>
 * invalid cells then the next validation walks all cells. Cells without a
 * parent were removed from the model and are ignored.
 *
 * Parameters:
 *
 * cell - <mxCell> that was invalidated or whose state was created.
 */
mxGraphView.prototype.addInvalidCell = function(cell)
{
	if (this.invalidCells != null)
	{
		var model = this.graph.getModel();

		if (cell == model.getRoot() ||
			this.invalidCells.length >= this.maxInvalidCells)
		{
			this.invalidCells = null;
		}
		else if (model.getParent(cell) != null)
		{
			this.invalidCells.push(cell);
		}
	}
};

/**
 * Function: isIncrementalValidation
 *
 * Returns true if <validate> can validate the cells in <invalidCells>
 * instead of walking all cells under the given root. This returns false if
 * the root changed or lost its state (eg. after the root of the model was
 * replaced) and if the order of the DOM nodes depends on more than one
 * sequence of nodes (keepEdgesInForeground, keepEdgesInBackground and HTML
 * labels without foreignObjects).
 *
 * Parameters:
 *
 * root - <mxCell> that is the root of the validation.
 */
mxGraphView.prototype.isIncrementalValidation = function(root)
{
	return this.incrementalValidation && this.invalidCells != null &&
		!this.fullValidationRequired && this.invalidCellsRoot == root &&
		this.getState(root) != null && !mxClient.NO_FO &&
		!this.graph.keepEdgesInForeground && !this.graph.keepEdgesInBackground;
};

/**
 * Function: validateInvalidCells
 *
 * Validates the cells in <invalidCells> and the cells whose states are
 * created while doing so with the same results as walking all cells under
 * the given root in <validate>: the states are created, removed and
 * validated and the DOM nodes are ordered as in <validateCell> and
 * <validateCellState>. Returns false if all cells must be walked instead
 * (see <isIncrementalValidation> and <fullValidationRequired>).
 *
 * Parameters:
 *
 * root - <mxCell> that is the root of the validation.
 */
mxGraphView.prototype.validateInvalidCells = function(root)
{
	if (!this.isIncrementalValidation(root))
	{
		return false;
	}

	var cells = this.invalidCells;
	var visited = new mxDictionary();
	var list = [];
	var i;

	this.invalidCells = [];
	this.createdCells = [];

	try
	{
		// Creates and removes the states of the invalid cells and their
		// descendants as in the walk over all cells
		for (i = 0; i < cells.length; i++)
		{
			if (!visited.get(cells[i]))
			{
				visited.put(cells[i], true);
				var visible = this.getValidationVisibility(cells[i], root);

				if (visible != null)
				{
					this.validateCell(cells[i], visible);
					list.push(cells[i]);
				}
			}
		}

		for (i = 0; i < this.createdCells.length; i++)
		{
			if (!visited.get(this.createdCells[i]))
			{
				visited.put(this.createdCells[i], true);
				list.push(this.createdCells[i]);
			}
		}
	}
	finally
	{
		this.createdCells = null;
	}

	// Validates the states in the order of the walk over all cells
	var paths = new mxDictionary();

	for (i = 0; i < list.length; i++)
	{
		paths.put(list[i], mxCellPath.create(list[i]).split(
			mxCellPath.PATH_SEPARATOR));
	}

	list.sort(function(c1, c2)
	{
		return mxCellPath.compare(paths.get(c1), paths.get(c2));
	});

	var states = [];

	for (i = 0; i < list.length; i++)
	{
		var state = this.validateInvalidCell(list[i], root);

		if (state != null)
		{
			states.push(state);
		}
	}

	return !this.fullValidationRequired &&
		this.updateStateOrder(states, root) &&
		!this.fullValidationRequired;
};

/**
 * Function: getValidationVisibility
 *
 * Returns the visible argument that <validateCell> gets for the given cell
 * in the walk over all cells under the given root, or null if the cell is
 * not in that walk.
 *
 * Parameters:
 *
 * cell - <mxCell> whose visible argument should be returned.
 * root - <mxCell> that is the root of the validation.
 */
mxGraphView.prototype.getValidationVisibility = function(cell, root)
{
	if (cell == root)
	{
		return true;
	}

	var model = this.graph.getModel();
	var ancestors = [];
	var parent = model.getParent(cell);

	while (parent != null && parent != root)
	{
		ancestors.push(parent);
		parent = model.getParent(parent);
	}

	if (parent == null)
	{
		return null;
	}

	ancestors.push(root);
	var visible = true;

	for (var i = ancestors.length - 1; i >= 0; i--)
	{
		visible = visible && this.graph.isCellVisible(ancestors[i]) &&
			(!this.isCellCollapsed(ancestors[i]) ||
			ancestors[i] == this.currentRoot);
	}

	return visible;
};

/**
 * Function: validateInvalidCell
 *
 * Validates the state of the given cell and its ancestors and returns the
 * state if the walk over all cells reaches it, that is, if the states of
 * all its ancestors up to the given root are valid, or null otherwise.
 *
 * Parameters:
 *
 * cell - <mxCell> whose state should be validated.
 * root - <mxCell> that is the root of the validation.
 */
mxGraphView.prototype.validateInvalidCell = function(cell, root)
{
	var model = this.graph.getModel();
	var state = this.getState(cell);

	if (state != null && cell != root)
	{
		var parent = model.getParent(cell);
		this.validateCellState(parent, false);

		for (var p = parent; p != null && state != null;
			p = (p != root) ? model.getParent(p) : null)
		{
			var tmp = this.getState(p);

			if (tmp == null || tmp.invalid)
			{
				state = null;
			}
		}
	}

	if (state != null)
	{
		state = this.validateCellState(cell, false);
	}

	return (state != null && !state.invalid) ? state : null;
};

/**
 * Function: updateStateOrder
 *
 * Inserts the DOM nodes of the given states, which are in the order of the
 * walk over all cells, after the nodes of the states before them in that
 * walk as <stateValidated> does in the walk. Returns false if a node is not
 * in the <drawPane> or <overlayPane>, which <validate> then handles by
 * walking all cells.
 *
 * Parameters:
 *
 * states - Array of <mxCellStates> whose DOM nodes should be ordered.
 * root - <mxCell> that is the root of the validation.
 */
mxGraphView.prototype.updateStateOrder = function(states, root)
{
	for (var i = 0; i < states.length; i++)
	{
		var state = states[i];

		if (state.shape != null)
		{
			var shapes = this.graph.cellRenderer.getShapesForState(state);

			for (var j = 0; j < shapes.length; j++)
			{
				if (shapes[j] != null && shapes[j].node != null &&
					!this.isPaneNode(shapes[j].node))
				{
					return false;
				}
			}

			this.lastNode = this.getPreviousNode(state.cell, root);
			this.lastHtmlNode = null;
			this.stateValidated(state);
		}
	}

	return true;
};

/**
 * Function: isPaneNode
 *
 * Returns true if the given DOM node of a shape is in the <drawPane> or
 * <overlayPane>, which <mxCellRenderer.insertStateAfter> orders as one
 * sequence of nodes.
 *
 * Parameters:
 *
 * node - DOM node of a shape.
 */
mxGraphView.prototype.isPaneNode = function(node)
{
	return node.parentNode == this.getDrawPane() ||
		node.parentNode == this.getOverlayPane();
};

/**
 * Function: getPreviousNode
 *
 * Returns the last DOM node of the states before the given cell in the walk
 * over all cells under the given root, which is the node after which
 * <stateValidated> inserts the nodes of the state of the cell in that walk,
 * or null if there is no such node.
 *
 * Parameters:
 *
 * cell - <mxCell> whose previous node should be returned.
 * root - <mxCell> that is the root of the validation.
 */
mxGraphView.prototype.getPreviousNode = function(cell, root)
{
	var prev = this.getPreviousCell(cell, root);

	while (prev != null)
	{
		var state = this.getState(prev);

		if (state != null && state.shape != null)
		{
			var shapes = this.graph.cellRenderer.getShapesForState(state);

			for (var i = shapes.length - 1; i >= 0; i--)
			{
				if (shapes[i] != null && shapes[i].node != null &&
					this.isPaneNode(shapes[i].node))
				{
					return shapes[i].node;
				}
			}
		}

		prev = this.getPreviousCell(prev, root);
	}

	return null;
};

/**
 * Function: getPreviousCell
 *
 * Returns the cell before the given cell in the walk over all cells under
 * the given root, or null if the cell is the root. The walk visits a cell
 * before its children and only visits cells with valid states.
 *
 * Parameters:
 *
 * cell - <mxCell> whose previous cell should be returned.
 * root - <mxCell> that is the root of the validation.
 */
mxGraphView.prototype.getPreviousCell = function(cell, root)
{
	if (cell == root)
	{
		return null;
	}

	var model = this.graph.getModel();
	var parent = model.getParent(cell);

	for (var i = parent.getIndex(cell) - 1; i >= 0; i--)
	{
		var child = model.getChildAt(parent, i);

		if (this.isValidState(child))
		{
			return this.getLastCell(child);
		}
	}

	return parent;
};

/**
 * Function: getLastCell
 *
 * Returns the last cell of the walk over all cells under the given cell.
 *
 * Parameters:
 *
 * cell - <mxCell> whose last cell should be returned.
 */
mxGraphView.prototype.getLastCell = function(cell)
{
	var model = this.graph.getModel();
	var next = cell;

	while (next != null)
	{
		cell = next;
		next = null;

		for (var i = model.getChildCount(cell) - 1; i >= 0 && next == null; i--)
		{
			var child = model.getChildAt(cell, i);

			if (this.isValidState(child))
			{
				next = child;
			}
		}
	}

	return cell;
};

/**
 * Function: isValidState
 *
 * Returns true if the given cell has a valid state, that is, if it is in
 * the walk over all cells if its parent is.
 *
 * Parameters:
 *
 * cell - <mxCell> to be checked.
 */
mxGraphView.prototype.isValidState = function(cell)
{
	var state = this.getState(cell);

	return state != null && !state.invalid;
};

/**
 * Function: getEmptyBounds
 * 
 * Returns the bounds for an empty graph. This returns a rectangle at
 * <translate> with the size of 0 x 0.
 */
mxGraphView.prototype.getEmptyBounds = function()
{
	return new mxRectangle(this.translate.x * this.scale, this.translate.y * this.scale);
};

/**
 * Function: updateBoundingBox
 *
 * Updates the bounding boxes for the given cell state. Only the bounding
 * boxes of the shape and label that were redrawn since their last update
 * are updated (see <mxShape.invalidBoundingBox>), so a validation measures
 * the changed cells only.
 *
 * Parameters:
 *
 * state - <mxCellState> whose bounding boxes should be updated.
 */
mxGraphView.prototype.updateBoundingBox = function(state)
{
	if (state.shape != null && state.shape.invalidBoundingBox)
	{
		state.shape.updateBoundingBox();
		state.shape.invalidBoundingBox = false;
	}

	if (state.text != null && state.text.invalidBoundingBox)
	{
		state.text.updateBoundingBox();
		state.text.invalidBoundingBox = false;
	}
};

/**
 * Function: getBoundingBox
 * 
 * Returns the bounding box of the shape and the label for the given
 * <mxCellState> and its children if recurse is true.
 * 
 * Parameters:
 * 
 * state - <mxCellState> whose bounding box should be returned.
 * recurse - Optional boolean indicating if the children should be included.
 * Default is true.
 * update - Optional boolean indicating if the invalid bounding boxes
 * should be updated (see <updateBoundingBox>). Default is false.
 */
mxGraphView.prototype.getBoundingBox = function(state, recurse, update)
{
	recurse = (recurse != null) ? recurse : true;
	update = (update != null) ? update : false;

	var bbox = null;

	if (state != null)
	{
		bbox = this.addBoundingBox(null, state, recurse, update);
	}

	return bbox;
};

/**
 * Function: addBoundingBox
 *
 * Adds the bounding box of the shape and the label for the given
 * <mxCellState> and its children if recurse is true to the given
 * rectangle and returns the result. This creates a new rectangle only if
 * the given rectangle is null. See <getBoundingBox>.
 *
 * Parameters:
 *
 * bbox - <mxRectangle> to add the bounding boxes to or null.
 * state - <mxCellState> whose bounding box should be added.
 * recurse - Boolean indicating if the children should be included.
 * update - Boolean indicating if the invalid bounding boxes should be
 * updated (see <updateBoundingBox>). This also stores the bounding box of
 * each state in <mxCellState.graphBoundingBox>.
 */
mxGraphView.prototype.addBoundingBox = function(bbox, state, recurse, update)
{
	if (update)
	{
		this.updateBoundingBox(state);
		state.graphBoundingBox = this.getStateBoundingBox(state);
		state.invalidBoundingBox = false;
	}

	bbox = this.addShapeBoundingBox(bbox, state.shape);
	bbox = this.addShapeBoundingBox(bbox, state.text);

	if (recurse)
	{
		var model = this.graph.getModel();
		var childCount = model.getChildCount(state.cell);

		for (var i = 0; i < childCount; i++)
		{
			var child = this.getState(model.getChildAt(state.cell, i));

			if (child != null)
			{
				bbox = this.addBoundingBox(bbox, child, recurse, update);
			}
		}
	}

	return bbox;
};

/**
 * Function: addShapeBoundingBox
 *
 * Adds the <mxShape.boundingBox> of the given shape to the given rectangle
 * if it is a number and returns the result, which is a new rectangle if
 * the given rectangle is null.
 *
 * Parameters:
 *
 * bbox - <mxRectangle> to add the bounding box to or null.
 * shape - <mxShape> whose bounding box should be added.
 */
mxGraphView.prototype.addShapeBoundingBox = function(bbox, shape)
{
	var b = (shape != null) ? shape.boundingBox : null;

	if (b != null && !isNaN(b.x) && !isNaN(b.y) &&
		!isNaN(b.width) && !isNaN(b.height))
	{
		if (bbox == null)
		{
			bbox = mxRectangle.fromRectangle(b);
		}
		else
		{
			bbox.add(b);
		}
	}

	return bbox;
};

/**
 * Function: getStateBoundingBox
 *
 * Returns a new rectangle with the bounding box of the shape and the label
 * of the given state, or null if neither has a bounding box.
 *
 * Parameters:
 *
 * state - <mxCellState> whose bounding box should be returned.
 */
mxGraphView.prototype.getStateBoundingBox = function(state)
{
	return this.addShapeBoundingBox(this.addShapeBoundingBox(
		null, state.shape), state.text);
};

/**
 * Function: invalidateBoundingBox
 *
 * Adds the given state to <invalidBoundingBoxes> after its shape or label
 * was repainted, so that the next <validate> adds its new bounding box to
 * the graph bounds without adding the bounding boxes of all states. This
 * is called in <mxShape.redraw>.
 *
 * Parameters:
 *
 * state - <mxCellState> whose shape or label was repainted.
 */
mxGraphView.prototype.invalidateBoundingBox = function(state)
{
	// Graph bounds must be updated if the bounding box of a state changes
	// without a validation of the state (eg. in the live preview)
	this.graphBoundsInvalid = true;

	if (!state.invalidBoundingBox)
	{
		state.invalidBoundingBox = true;

		if (this.invalidBoundingBoxes != null)
		{
			this.invalidBoundingBoxes.push(state);
		}
	}
};

/**
 * Function: getChangedGraphBounds
 *
 * Returns the graph bounds of the last <validate> with the bounding boxes
 * of the states in <invalidBoundingBoxes> added, or null if all bounding
 * boxes must be added. The bounding boxes of the changed and removed
 * states are not removed from the graph bounds, which is correct if each
 * of them was inside the graph bounds without touching their border. The
 * graph bounds are then defined by the other states. All bounding boxes
 * are added if any of them touched the border, if the scale or translate
 * changed or if the graph bounds were changed outside of <validate>.
 */
mxGraphView.prototype.getChangedGraphBounds = function()
{
	var added = this.addedGraphBounds;
	var states = this.invalidBoundingBoxes;
	var removed = this.removedBoundingBoxes;

	if (added == null || states == null || removed == null ||
		added.scale != this.scale || added.x != this.translate.x ||
		added.y != this.translate.y || this.graphBounds == null ||
		!this.graphBounds.equals(added.bounds))
	{
		return null;
	}

	var bounds = added.bounds;
	var result = mxRectangle.fromRectangle(bounds);
	var tol = 0.001;

	// Returns true if the given box is inside the bounds and does not touch
	// their border, so that its removal does not change the graph bounds
	function isInside(box)
	{
		return box.x > bounds.x + tol && box.y > bounds.y + tol &&
			box.x + box.width < bounds.x + bounds.width - tol &&
			box.y + box.height < bounds.y + bounds.height - tol;
	};

	for (var i = 0; i < removed.length; i++)
	{
		if (!isInside(removed[i]))
		{
			return null;
		}
	}

	for (var i = 0; i < states.length; i++)
	{
		var state = states[i];
		state.invalidBoundingBox = false;

		if (this.getState(state.cell) == state)
		{
			if (state.graphBoundingBox != null && !isInside(state.graphBoundingBox))
			{
				return null;
			}

			this.updateBoundingBox(state);
			var box = this.getStateBoundingBox(state);
			state.graphBoundingBox = box;

			// Adds only boxes that extend the result to keep its values
			if (box != null && (box.x < result.x || box.y < result.y ||
				box.x + box.width > result.x + result.width ||
				box.y + box.height > result.y + result.height))
			{
				result.add(box);
			}
		}
	}

	return result;
};

/**
 * Function: setAddedGraphBounds
 *
 * Stores the given graph bounds that were computed from the bounding boxes
 * of all states or by <getChangedGraphBounds> for the current scale and
 * translate and starts collecting the changed bounding boxes.
 */
mxGraphView.prototype.setAddedGraphBounds = function(bounds)
{
	this.addedGraphBounds = (bounds != null) ? {bounds: mxRectangle.fromRectangle(bounds),
		scale: this.scale, x: this.translate.x, y: this.translate.y} : null;
	this.invalidBoundingBoxes = [];
	this.removedBoundingBoxes = [];
};

/**
 * Function: createBackgroundPageShape
 *
 * Creates and returns the shape used as the background page.
 * 
 * Parameters:
 * 
 * bounds - <mxRectangle> that represents the bounds of the shape.
 */
mxGraphView.prototype.createBackgroundPageShape = function(bounds)
{
	return new mxRectangleShape(bounds, 'white', 'black');
};

/**
 * Function: validateBackground
 *
 * Calls <validateBackgroundImage> and <validateBackgroundPage>.
 */
mxGraphView.prototype.validateBackground = function()
{
	this.validateBackgroundImage();
	this.validateBackgroundPage();
};

/**
 * Function: validateBackgroundImage
 * 
 * Validates the background image.
 */
mxGraphView.prototype.validateBackgroundImage = function()
{
	var bg = this.graph.getBackgroundImage();
	
	if (bg != null)
	{
		if (this.backgroundImage == null || this.backgroundImage.image != bg.src)
		{
			if (this.backgroundImage != null)
			{
				this.backgroundImage.destroy();
			}
			
			var bounds = new mxRectangle(0, 0, 1, 1);
			
			this.backgroundImage = new mxImageShape(bounds, bg.src);
			this.backgroundImage.dialect = this.graph.dialect;
			this.backgroundImage.init(this.backgroundPane);
			this.backgroundImage.redraw();
		}
		
		this.redrawBackgroundImage(this.backgroundImage, bg);
	}
	else if (this.backgroundImage != null)
	{
		this.backgroundImage.destroy();
		this.backgroundImage = null;
	}
};

/**
 * Function: validateBackgroundPage
 * 
 * Validates the background page.
 */
mxGraphView.prototype.validateBackgroundPage = function()
{
	if (this.graph.pageVisible)
	{
		var bounds = this.getBackgroundPageBounds();
		
		if (this.backgroundPageShape == null)
		{
			this.backgroundPageShape = this.createBackgroundPageShape(bounds);
			this.backgroundPageShape.scale = this.scale;
			this.backgroundPageShape.isShadow = true;
			this.backgroundPageShape.dialect = this.graph.dialect;
			this.backgroundPageShape.init(this.backgroundPane);
			this.backgroundPageShape.redraw();
			
			// Adds listener for double click handling on background
			if (this.graph.nativeDblClickEnabled)
			{
				mxEvent.addListener(this.backgroundPageShape.node, 'dblclick', mxUtils.bind(this, function(evt)
				{
					this.graph.dblClick(evt);
				}));
			}

			// Adds basic listeners for graph event dispatching outside of the
			// container and finishing the handling of a single gesture
			mxEvent.addGestureListeners(this.backgroundPageShape.node,
				mxUtils.bind(this, function(evt)
				{
					this.graph.fireMouseEvent(mxEvent.MOUSE_DOWN, new mxMouseEvent(evt));
				}),
				mxUtils.bind(this, function(evt)
				{
					// Hides the tooltip if mouse is outside container
					if (this.graph.tooltipHandler != null && this.graph.tooltipHandler.isHideOnHover())
					{
						this.graph.tooltipHandler.hide();
					}
					
					if (this.graph.isMouseDown && !mxEvent.isConsumed(evt))
					{
						this.graph.fireMouseEvent(mxEvent.MOUSE_MOVE, new mxMouseEvent(evt));
					}
				}),
				mxUtils.bind(this, function(evt)
				{
					this.graph.fireMouseEvent(mxEvent.MOUSE_UP, new mxMouseEvent(evt));
				})
			);
		}
		else
		{
			this.backgroundPageShape.scale = this.scale;
			this.backgroundPageShape.bounds = bounds;
			this.backgroundPageShape.redraw();
		}
	}
	else if (this.backgroundPageShape != null)
	{
		this.backgroundPageShape.destroy();
		this.backgroundPageShape = null;
	}
};

/**
 * Function: getBackgroundPageBounds
 * 
 * Returns the bounds for the background page.
 */
mxGraphView.prototype.getBackgroundPageBounds = function()
{
	var fmt = this.graph.pageFormat;
	var ps = this.scale * this.graph.pageScale;
	var bounds = new mxRectangle(this.scale * this.translate.x, this.scale * this.translate.y,
			fmt.width * ps, fmt.height * ps);
	
	return bounds;
};

/**
 * Function: redrawBackgroundImage
 *
 * Updates the bounds and redraws the background image.
 * 
 * Example:
 * 
 * If the background image should not be scaled, this can be replaced with
 * the following.
 * 
 * (code)
 * mxGraphView.prototype.redrawBackground = function(backgroundImage, bg)
 * {
 *   backgroundImage.bounds.x = this.translate.x;
 *   backgroundImage.bounds.y = this.translate.y;
 *   backgroundImage.bounds.width = bg.width;
 *   backgroundImage.bounds.height = bg.height;
 *
 *   backgroundImage.redraw();
 * };
 * (end)
 * 
 * Parameters:
 * 
 * backgroundImage - <mxImageShape> that represents the background image.
 * bg - <mxImage> that specifies the image and its dimensions.
 */
mxGraphView.prototype.redrawBackgroundImage = function(backgroundImage, bg)
{
	var bounds = new mxRectangle(
		this.scale * (this.translate.x + bg.x),
		this.scale * (this.translate.y + bg.y),
		this.scale * bg.width, this.scale * bg.height);
	
	if (backgroundImage.scale != this.scale ||
		!bounds.equals(backgroundImage.bounds))
	{
		backgroundImage.scale = this.scale;
		backgroundImage.bounds = bounds;

		// Updates bounds of image or svg to keep rendered content
		if (backgroundImage.node != null && backgroundImage.node.nodeName == 'g' &&
			(backgroundImage.node.firstChild.nodeName == 'image' ||
			backgroundImage.node.firstChild.nodeName == 'svg'))
		{
			backgroundImage.node.firstChild.setAttribute('x', bounds.x);
			backgroundImage.node.firstChild.setAttribute('y', bounds.y);
			backgroundImage.node.firstChild.setAttribute('width', bounds.width);
			backgroundImage.node.firstChild.setAttribute('height', bounds.height);
		}
		else
		{
			backgroundImage.redraw();
		}
	}
};

/**
 * Function: validateCell
 * 
 * Recursively creates the cell state for the given cell if visible is true and
 * the given cell is visible. If the cell is not visible but the state exists
 * then it is removed using <removeState>.
 * 
 * Parameters:
 * 
 * cell - <mxCell> whose <mxCellState> should be created.
 * visible - Optional boolean indicating if the cell should be visible. Default
 * is true.
 */
mxGraphView.prototype.validateCell = function(cell, visible)
{
	visible = (visible != null) ? visible : true;
	
	if (cell != null)
	{
		visible = visible && this.graph.isCellVisible(cell);
		var state = this.getState(cell, visible);
		
		if (state != null && !visible)
		{
			this.removeState(cell);
		}
		else
		{
			var model = this.graph.getModel();
			var childCount = model.getChildCount(cell);
			
			for (var i = 0; i < childCount; i++)
			{
				this.validateCell(model.getChildAt(cell, i), visible &&
					(!this.isCellCollapsed(cell) || cell == this.currentRoot));
			}
		}
	}
	
	return cell;
};

/**
 * Function: validateCellState
 * 
 * Validates and repaints the <mxCellState> for the given <mxCell>.
 * 
 * Parameters:
 * 
 * cell - <mxCell> whose <mxCellState> should be validated.
 * recurse - Optional boolean indicating if the children of the cell should be
 * validated. Default is true.
 */
mxGraphView.prototype.validateCellState = function(cell, recurse)
{
	recurse = (recurse != null) ? recurse : true;
	var state = null;
	
	if (cell != null)
	{
		state = this.getState(cell);
		
		if (state != null)
		{
			var model = this.graph.getModel();
			
			if (state.invalid)
			{
				state.invalid = false;
				this.graphBoundsInvalid = true;

				if (this.validatedStates != null)
				{
					this.validatedStates.push(state);
				}
				
				if (state.style == null || state.invalidStyle)
				{
					state.style = this.graph.getCellStyle(state.cell);
					state.invalidStyle = false;
				}
				
				if (cell != this.currentRoot)
				{
					this.validateCellState(model.getParent(cell), false);
				}

				state.setVisibleTerminalState(this.validateCellState(this.getVisibleTerminal(cell, true), false), true);
				state.setVisibleTerminalState(this.validateCellState(this.getVisibleTerminal(cell, false), false), false);
				
				this.updateCellState(state);
				
				// Repaint happens immediately after the cell is validated
				if (cell != this.currentRoot && !state.invalid)
				{
					this.graph.cellRenderer.redraw(state, false, this.isRendering());

					// Handles changes to invertex paintbounds after update of rendering shape
					state.updateCachedBounds();
				}
			}

			if (recurse && !state.invalid)
			{
				// Updates order in DOM if recursively traversing
				if (state.shape != null)
				{
					this.stateValidated(state);
				}
			
				var childCount = model.getChildCount(cell);
				
				for (var i = 0; i < childCount; i++)
				{
					this.validateCellState(model.getChildAt(cell, i));
				}
			}
		}
	}
	
	return state;
};

/**
 * Function: updateCellState
 * 
 * Updates the given <mxCellState>.
 * 
 * Parameters:
 * 
 * state - <mxCellState> to be updated.
 */
mxGraphView.prototype.updateCellState = function(state)
{
	state.absoluteOffset.x = 0;
	state.absoluteOffset.y = 0;
	state.origin.x = 0;
	state.origin.y = 0;
	state.length = 0;
	
	if (state.cell != this.currentRoot)
	{
		var model = this.graph.getModel();
		var pState = this.getState(model.getParent(state.cell)); 
		
		if (pState != null && pState.cell != this.currentRoot)
		{
			state.origin.x += pState.origin.x;
			state.origin.y += pState.origin.y;
		}
		
		var offset = this.graph.getChildOffsetForCell(state.cell);
		
		if (offset != null)
		{
			state.origin.x += offset.x;
			state.origin.y += offset.y;
		}
		
		var geo = this.graph.getCellGeometry(state.cell);				
	
		if (geo != null)
		{
			if (!model.isEdge(state.cell))
			{
				offset = (geo.offset != null) ? geo.offset : this.EMPTY_POINT;
	
				if (geo.relative && pState != null)
				{
					if (model.isEdge(pState.cell))
					{
						var origin = this.getPoint(pState, geo);

						if (origin != null)
						{
							state.origin.x += (origin.x / this.scale) - pState.origin.x - this.translate.x;
							state.origin.y += (origin.y / this.scale) - pState.origin.y - this.translate.y;
						}
					}
					else
					{
						state.origin.x += geo.x * pState.unscaledWidth + offset.x;
						state.origin.y += geo.y * pState.unscaledHeight + offset.y;
					}
				}
				else
				{
					state.absoluteOffset.x = this.scale * offset.x;
					state.absoluteOffset.y = this.scale * offset.y;
					state.origin.x += geo.x;
					state.origin.y += geo.y;
				}
			}
	
			state.x = this.scale * (this.translate.x + state.origin.x);
			state.y = this.scale * (this.translate.y + state.origin.y);
			state.width = this.scale * geo.width;
			state.unscaledWidth = geo.width;
			state.height = this.scale * geo.height;
			state.unscaledHeight = geo.height;
			
			if (model.isVertex(state.cell))
			{
				this.updateVertexState(state, geo);
			}
			
			if (model.isEdge(state.cell))
			{
				this.updateEdgeState(state, geo);
			}
		}
	}

	state.updateCachedBounds();
};

/**
 * Function: isCellCollapsed
 * 
 * Returns true if the children of the given cell should not be visible in the
 * view. This implementation uses <mxGraph.isCellVisible> but it can be
 * overidden to use a separate condition.
 */
mxGraphView.prototype.isCellCollapsed = function(cell)
{
	return this.graph.isCellCollapsed(cell);
};

/**
 * Function: updateVertexState
 * 
 * Validates the given cell state.
 */
mxGraphView.prototype.updateVertexState = function(state, geo)
{
	var model = this.graph.getModel();
	var pState = this.getState(model.getParent(state.cell));
	
	if (geo.relative && pState != null && !model.isEdge(pState.cell))
	{
		var alpha = mxUtils.toRadians(pState.style[mxConstants.STYLE_ROTATION] || '0');
		
		if (alpha != 0)
		{
			var cos = Math.cos(alpha);
			var sin = Math.sin(alpha);

			var ct = new mxPoint(state.getCenterX(), state.getCenterY());
			var cx = new mxPoint(pState.getCenterX(), pState.getCenterY());
			var pt = mxUtils.getRotatedPoint(ct, cos, sin, cx);
			state.x = pt.x - state.width / 2;
			state.y = pt.y - state.height / 2;
		}
	}
	
	this.updateVertexLabelOffset(state);
};

/**
 * Function: updateEdgeState
 * 
 * Validates the given cell state.
 */
mxGraphView.prototype.updateEdgeState = function(state, geo)
{
	var source = state.getVisibleTerminalState(true);
	var target = state.getVisibleTerminalState(false);
	var hasGtp = typeof geo.getTerminalPoint === 'function';

	// This will remove edges with no terminals and no terminal points
	// as such edges are invalid and produce NPEs in the edge styles.
	// Also removes connected edges that have no visible terminals.
	if ((this.graph.model.getTerminal(state.cell, true) != null && source == null) ||
		(source == null && (!hasGtp || geo.getTerminalPoint(true) == null)) ||
		(this.graph.model.getTerminal(state.cell, false) != null && target == null) ||
		(target == null && (!hasGtp || geo.getTerminalPoint(false) == null)))
	{
		this.clear(state.cell, true);
	}
	else
	{
		this.updateFixedTerminalPoints(state, source, target);
		this.updatePoints(state, geo.points, source, target);
		this.updateFloatingTerminalPoints(state, source, target);
		this.removeDuplicatePoints(state, geo.points, source, target);

		var pts = state.absolutePoints;
		
		if (state.cell != this.currentRoot && (pts == null || pts.length < 2 ||
			pts[0] == null || pts[pts.length - 1] == null))
		{
			// This will remove edges with invalid points from the list of states in the view.
			// Happens if the one of the terminals and the corresponding terminal point is null.
			this.clear(state.cell, true);
		}
		else
		{
			this.updateEdgeBounds(state);
			this.updateEdgeLabelOffset(state);
		}
	}
};

/**
 * Function: updateVertexLabelOffset
 * 
 * Updates the absoluteOffset of the given vertex cell state. This takes
 * into account the label position styles.
 * 
 * Parameters:
 * 
 * state - <mxCellState> whose absolute offset should be updated.
 */
mxGraphView.prototype.updateVertexLabelOffset = function(state)
{
	var h = mxUtils.getValue(state.style, mxConstants.STYLE_LABEL_POSITION, mxConstants.ALIGN_CENTER);

	if (h == mxConstants.ALIGN_LEFT)
	{
		var lw = mxUtils.getValue(state.style, mxConstants.STYLE_LABEL_WIDTH, null);
		
		if (lw != null)
		{
			lw *= this.scale;
		}
		else
		{
			lw = state.width;
		}
		
		state.absoluteOffset.x -= lw;
	}
	else if (h == mxConstants.ALIGN_RIGHT)
	{
		state.absoluteOffset.x += state.width;
	}
	else if (h == mxConstants.ALIGN_CENTER)
	{
		var lw = mxUtils.getValue(state.style, mxConstants.STYLE_LABEL_WIDTH, null);
		
		if (lw != null)
		{
			// Aligns text block with given width inside the vertex width
			var align = mxUtils.getValue(state.style, mxConstants.STYLE_ALIGN, mxConstants.ALIGN_CENTER);
			var dx = 0;
			
			if (align == mxConstants.ALIGN_CENTER)
			{
				dx = 0.5;
			}
			else if (align == mxConstants.ALIGN_RIGHT)
			{
				dx = 1;
			}
			
			if (dx != 0)
			{
				state.absoluteOffset.x -= (lw * this.scale - state.width) * dx;
			}
		}
	}
	
	var v = mxUtils.getValue(state.style, mxConstants.STYLE_VERTICAL_LABEL_POSITION, mxConstants.ALIGN_MIDDLE);
	
	if (v == mxConstants.ALIGN_TOP)
	{
		state.absoluteOffset.y -= state.height;
	}
	else if (v == mxConstants.ALIGN_BOTTOM)
	{
		state.absoluteOffset.y += state.height;
	}
};

/**
 * Function: resetValidationState
 *
 * Resets the current validation state.
 */
mxGraphView.prototype.resetValidationState = function()
{
	this.lastNode = null;
	this.lastHtmlNode = null;
	this.lastForegroundNode = null;
	this.lastForegroundHtmlNode = null;
};

/**
 * Function: stateValidated
 * 
 * Invoked when a state has been processed in <validatePoints>. This is used
 * to update the order of the DOM nodes of the shape.
 * 
 * Parameters:
 * 
 * state - <mxCellState> that represents the cell state.
 */
mxGraphView.prototype.stateValidated = function(state)
{
	var fg = (this.graph.getModel().isEdge(state.cell) && this.graph.keepEdgesInForeground) ||
		(this.graph.getModel().isVertex(state.cell) && this.graph.keepEdgesInBackground);
	var htmlNode = (fg) ? this.lastForegroundHtmlNode || this.lastHtmlNode : this.lastHtmlNode;
	var node = (fg) ? this.lastForegroundNode || this.lastNode : this.lastNode;
	var result = this.graph.cellRenderer.insertStateAfter(state, node, htmlNode);

	if (fg)
	{
		this.lastForegroundHtmlNode = result[1];
		this.lastForegroundNode = result[0];
	}
	else
	{
		this.lastHtmlNode = result[1];
		this.lastNode = result[0];
	}
};

/**
 * Function: updateFixedTerminalPoints
 *
 * Sets the initial absolute terminal points in the given state before the edge
 * style is computed.
 * 
 * Parameters:
 * 
 * edge - <mxCellState> whose initial terminal points should be updated.
 * source - <mxCellState> which represents the source terminal.
 * target - <mxCellState> which represents the target terminal.
 */
mxGraphView.prototype.updateFixedTerminalPoints = function(edge, source, target)
{
	this.updateFixedTerminalPoint(edge, source, true,
		this.graph.getConnectionConstraint(edge, source, true));
	this.updateFixedTerminalPoint(edge, target, false,
		this.graph.getConnectionConstraint(edge, target, false));
};

/**
 * Function: updateFixedTerminalPoint
 *
 * Sets the fixed source or target terminal point on the given edge.
 * 
 * Parameters:
 * 
 * edge - <mxCellState> whose terminal point should be updated.
 * terminal - <mxCellState> which represents the actual terminal.
 * source - Boolean that specifies if the terminal is the source.
 * constraint - <mxConnectionConstraint> that specifies the connection.
 */
mxGraphView.prototype.updateFixedTerminalPoint = function(edge, terminal, source, constraint)
{
	edge.setAbsoluteTerminalPoint(this.getFixedTerminalPoint(edge, terminal, source, constraint), source);
};

/**
 * Function: getFixedTerminalPoint
 *
 * Returns the fixed source or target terminal point for the given edge.
 * 
 * Parameters:
 * 
 * edge - <mxCellState> whose terminal point should be returned.
 * terminal - <mxCellState> which represents the actual terminal.
 * source - Boolean that specifies if the terminal is the source.
 * constraint - <mxConnectionConstraint> that specifies the connection.
 */
mxGraphView.prototype.getFixedTerminalPoint = function(edge, terminal, source, constraint)
{
	var pt = null;
	
	if (constraint != null)
	{
		pt = this.graph.getConnectionPoint(terminal, constraint, false); // FIXME Rounding introduced bugs when calculating label positions -> , this.graph.isOrthogonal(edge));
	}
	
	if (pt == null && terminal == null)
	{
		var s = this.scale;
		var tr = this.translate;
		var orig = edge.origin;
		var geo = this.graph.getCellGeometry(edge.cell);
		pt = geo.getTerminalPoint(source);
		
		if (pt != null)
		{
			pt = new mxPoint(s * (tr.x + pt.x + orig.x),
							 s * (tr.y + pt.y + orig.y));
		}
	}
	
	return pt;
};

/**
 * Function: updateBoundsFromStencil
 * 
 * Updates the bounds of the given cell state to reflect the bounds of the stencil
 * if it has a fixed aspect and returns the previous bounds as an <mxRectangle> if
 * the bounds have been modified or null otherwise.
 * 
 * Parameters:
 * 
 * edge - <mxCellState> whose bounds should be updated.
 */
mxGraphView.prototype.updateBoundsFromStencil = function(state)
{
	var previous = null;

	if (state != null && state.shape != null && state.shape.stencil != null && state.shape.stencil.aspect == 'fixed')
	{
		previous = mxRectangle.fromRectangle(state);
		var direction = state.style[mxConstants.STYLE_DIRECTION];
		var inverse = (direction == mxConstants.DIRECTION_NORTH || direction == mxConstants.DIRECTION_SOUTH);
		var sw = inverse ? state.shape.stencil.h0 : state.shape.stencil.w0;
		var sh = inverse ? state.shape.stencil.w0 : state.shape.stencil.h0;
		var s = Math.min(state.width / sw, state.height / sh);

		state.setRect(state.x + (state.width - sw * s) / 2,
			state.y + (state.height - sh * s) / 2, sw * s, sh * s);
	}

	return previous;
};

/**
 * Function: updatePoints
 *
 * Updates the absolute points in the given state using the specified array
 * of <mxPoints> as the relative points.
 * 
 * Parameters:
 * 
 * edge - <mxCellState> whose absolute points should be updated.
 * points - Array of <mxPoints> that constitute the relative points.
 * source - <mxCellState> that represents the source terminal.
 * target - <mxCellState> that represents the target terminal.
 */
mxGraphView.prototype.updatePoints = function(edge, points, source, target)
{
	if (edge != null && edge.absolutePoints != null &&
		edge.absolutePoints.length > 0)
	{
		// Control points of the expanded layout are not used while a
		// terminal is replaced by a collapsed ancestor (collapsedPoints=0)
		if (points != null && points.length > 0 &&
			this.isCollapsedPointsIgnored(edge.cell, edge.style))
		{
			points = null;
		}

		var pts = [];
		pts.push(edge.absolutePoints[0]);
		var edgeStyle = this.getEdgeStyle(edge, points, source, target);
		
		if (edgeStyle != null)
		{
			var src = this.getTerminalPort(edge, source, true);
			var trg = this.getTerminalPort(edge, target, false);
			
			// Uses the stencil bounds for routing and restores after routing
			var srcBounds = this.updateBoundsFromStencil(src);
			var trgBounds = (src != trg) ? this.updateBoundsFromStencil(trg) : null;

			try
			{
				edgeStyle(edge, src, trg, points, pts);
			}
			finally
			{
				// Restores previous bounds
				if (srcBounds != null)
				{
					src.setRect(srcBounds.x, srcBounds.y, srcBounds.width, srcBounds.height);
				}

				if (trgBounds != null)
				{
					trg.setRect(trgBounds.x, trgBounds.y, trgBounds.width, trgBounds.height);
				}
			}
		}
		else if (points != null)
		{
			for (var i = 0; i < points.length; i++)
			{
				if (points[i] != null)
				{
					var pt = mxUtils.clone(points[i]);
					pts.push(this.transformControlPoint(edge, pt));
				}
			}
		}
		
		var tmp = edge.absolutePoints;
		pts.push(tmp[tmp.length-1]);

		edge.absolutePoints = pts;
	}
};

/**
 * Function: isCollapsedPointsIgnored
 *
 * Returns true if the control points of the given edge are ignored. This
 * is true if <mxConstants.STYLE_COLLAPSED_POINTS> is 0 in the given style
 * and a terminal of the edge is replaced by a collapsed ancestor, that is,
 * if the visible terminal differs from the terminal in the model.
 *
 * Parameters:
 *
 * edge - <mxCell> that represents the edge.
 * style - Style of the edge.
 */
mxGraphView.prototype.isCollapsedPointsIgnored = function(edge, style)
{
	if (edge != null && style != null && mxUtils.getValue(style,
		mxConstants.STYLE_COLLAPSED_POINTS, '1') == '0')
	{
		var model = this.graph.getModel();

		for (var i = 0; i < 2; i++)
		{
			var terminal = model.getTerminal(edge, i == 0);

			if (terminal != null)
			{
				var visible = this.getVisibleTerminal(edge, i == 0);

				if (visible != null && visible != terminal)
				{
					return true;
				}
			}
		}
	}

	return false;
};

/**
 * Function: transformControlPoint
 *
 * Transforms the given control point to an absolute point.
 */
mxGraphView.prototype.transformControlPoint = function(state, pt, ignoreScale)
{
	if (state != null && pt != null)
	{
		var orig = state.origin;
		var scale = ignoreScale ? 1 : this.scale
		
	    return new mxPoint(scale * (pt.x + this.translate.x + orig.x),
	    		scale * (pt.y + this.translate.y + orig.y));
	}
	
	return null;
};

/**
 * Function: isLoopStyleEnabled
 * 
 * Returns true if the given edge should be routed with <mxGraph.defaultLoopStyle>
 * or the <mxConstants.STYLE_LOOP> defined for the given edge. This implementation
 * returns true if the given edge is a loop and does not have connections constraints
 * associated.
 */
mxGraphView.prototype.isLoopStyleEnabled = function(edge, points, source, target)
{
	var sc = this.graph.getConnectionConstraint(edge, source, true);
	var tc = this.graph.getConnectionConstraint(edge, target, false);

	if ((points == null || points.length < 2) &&
		(!mxUtils.getValue(edge.style, mxConstants.STYLE_ORTHOGONAL_LOOP, false) ||
		((sc == null || sc.point == null) && (tc == null || tc.point == null))))
	{
		return source != null && source == target;
	}

	return false;
};

/**
 * Function: getEdgeStyle
 * 
 * Returns the edge style function to be used to render the given edge state.
 */
mxGraphView.prototype.getEdgeStyle = function(edge, points, source, target)
{
	var edgeStyle = this.isLoopStyleEnabled(edge, points, source, target) ?
		mxUtils.getValue(edge.style, mxConstants.STYLE_LOOP, this.graph.defaultLoopStyle) :
		(!mxUtils.getValue(edge.style, mxConstants.STYLE_NOEDGESTYLE, false) ?
		edge.style[mxConstants.STYLE_EDGE] : null);

	// Converts string values to objects
	if (typeof(edgeStyle) == "string")
	{
		var tmp = mxStyleRegistry.getValue(edgeStyle);
		
		if (tmp == null && this.isAllowEval())
		{
 			tmp = mxUtils.eval(edgeStyle);
		}
		
		edgeStyle = tmp;
	}
	
	if (typeof(edgeStyle) == "function")
	{
		return edgeStyle;
	}
	
	return null;
};

/**
 * Function: updateFloatingTerminalPoints
 *
 * Updates the terminal points in the given state after the edge style was
 * computed for the edge.
 * 
 * Parameters:
 * 
 * state - <mxCellState> whose terminal points should be updated.
 * source - <mxCellState> that represents the source terminal.
 * target - <mxCellState> that represents the target terminal.
 */
mxGraphView.prototype.updateFloatingTerminalPoints = function(state, source, target)
{
	var pts = state.absolutePoints;

	if (pts != null)
	{
		var p0 = pts[0];
		var pe = pts[pts.length - 1];

		if (pe == null && target != null)
		{
			this.updateFloatingTerminalPoint(state, target, source, false);
		}

		if (p0 == null && source != null)
		{
			this.updateFloatingTerminalPoint(state, source, target, true);
		}

		// Connected ends that were already set are fixed connection points
		if (state.style != null && mxUtils.getValue(state.style,
			mxConstants.STYLE_FIXED_POINT_SPACING, 0) == 1)
		{
			this.updateFixedPointSpacing(state, p0 != null && source != null,
				pe != null && target != null);
		}
	}
};

/**
 * Function: removeDuplicatePoints
 * 
 * Removes the waypoints of the given edge state that are equal to the point
 * before or after them. This happens if a route ends inside a terminal, eg.
 * if the terminals are closer than the jetty size or overlap, or if two
 * elbows of a route are at the same location. This is only done if
 * <isDuplicatePointsRemoved> returns true. The terminal points are not
 * removed.
 * 
 * Parameters:
 * 
 * state - <mxCellState> that represents the edge.
 * points - Array of <mxPoints> that constitute the control points.
 * source - <mxCellState> that represents the source terminal.
 * target - <mxCellState> that represents the target terminal.
 */
mxGraphView.prototype.removeDuplicatePoints = function(state, points, source, target)
{
	var pts = state.absolutePoints;

	if (pts != null && pts.length > 2)
	{
		var tol = 0.01 * this.scale;

		var equals = function(a, b)
		{
			return a != null && b != null && Math.abs(a.x - b.x) < tol &&
				Math.abs(a.y - b.y) < tol;
		};

		var duplicates = false;

		for (var i = 1; i < pts.length && !duplicates; i++)
		{
			duplicates = equals(pts[i - 1], pts[i]);
		}

		if (duplicates && this.isDuplicatePointsRemoved(state,
			this.getEdgeStyle(state, points, source, target), points))
		{
			for (var i = pts.length - 2; i > 0 && pts.length > 2; i--)
			{
				if (equals(pts[i], pts[i + 1]) || equals(pts[i], pts[i - 1]))
				{
					pts.splice(i, 1);
				}
			}
		}
	}
};

/**
 * Function: isDuplicatePointsRemoved
 * 
 * Returns true if <removeDuplicatePoints> should remove the duplicate
 * waypoints of the given edge state. This returns true for edge styles that
 * compute the waypoints and do not map them to control points, which are
 * <mxEdgeStyle.OrthConnector> without control points, the elbow styles and
 * <mxEdgeStyle.EntityRelation>.
 * 
 * Parameters:
 * 
 * state - <mxCellState> that represents the edge.
 * edgeStyle - Edge style function that routes the edge.
 * points - Array of <mxPoints> that constitute the control points.
 */
mxGraphView.prototype.isDuplicatePointsRemoved = function(state, edgeStyle, points)
{
	return (edgeStyle == mxEdgeStyle.OrthConnector && (points == null || points.length == 0)) ||
		edgeStyle == mxEdgeStyle.ElbowConnector || edgeStyle == mxEdgeStyle.SideToSide ||
		edgeStyle == mxEdgeStyle.TopToBottom || edgeStyle == mxEdgeStyle.EntityRelation;
};

/**
 * Function: updateFixedPointSpacing
 *
 * Moves the source and/or target end of the given edge state, which are
 * attached to fixed connection points, by <mxConstants.STYLE_SOURCE_PERIMETER_SPACING>
 * and <mxConstants.STYLE_TARGET_PERIMETER_SPACING> towards the neighbouring
 * point of the route. Negative values move the end away from that point
 * along the same line. An end is never moved past its neighbouring point.
 * This is invoked after routing from <updateFloatingTerminalPoints> if
 * <mxConstants.STYLE_FIXED_POINT_SPACING> is 1 so that the edge style input
 * is unchanged.
 *
 * Parameters:
 *
 * state - <mxCellState> that represents the edge.
 * source - Boolean that specifies if the source end should be moved.
 * target - Boolean that specifies if the target end should be moved.
 */
mxGraphView.prototype.updateFixedPointSpacing = function(state, source, target)
{
	var pts = state.absolutePoints;
	var n = (pts != null) ? pts.length : 0;

	if (n > 1 && pts[0] != null && pts[n - 1] != null)
	{
		var scale = this.scale;

		var getSpacing = function(key)
		{
			var value = parseFloat(state.style[key] || 0);

			return (isNaN(value) || !isFinite(value)) ? 0 : value * scale;
		};

		// Returns the index of the first point that differs from the end
		var getNeighbour = function(index, step)
		{
			var pt = pts[index];

			for (var i = index + step; i >= 0 && i < n; i += step)
			{
				if (pts[i] != null && (pts[i].x != pt.x || pts[i].y != pt.y))
				{
					return i;
				}
			}

			return -1;
		};

		var p0 = pts[0];
		var pe = pts[n - 1];
		var ds = (source) ? getSpacing(mxConstants.STYLE_SOURCE_PERIMETER_SPACING) : 0;
		var dt = (target) ? getSpacing(mxConstants.STYLE_TARGET_PERIMETER_SPACING) : 0;
		var ns = (ds != 0) ? getNeighbour(0, 1) : -1;
		var nt = (dt != 0) ? getNeighbour(n - 1, -1) : -1;

		// Neighbours are taken before any end is moved
		var qs = (ns >= 0) ? pts[ns] : null;
		var qt = (nt >= 0) ? pts[nt] : null;
		var ls = (qs != null) ? Math.sqrt((qs.x - p0.x) * (qs.x - p0.x) +
			(qs.y - p0.y) * (qs.y - p0.y)) : 0;
		var lt = (qt != null) ? Math.sqrt((qt.x - pe.x) * (qt.x - pe.x) +
			(qt.y - pe.y) * (qt.y - pe.y)) : 0;

		// Clamps to the segment and splits a segment that is shared by both ends,
		// keeping 1px of the segment so that the direction of markers is defined
		var ms = Math.max(0, ls - 1);
		ds = Math.min(ds, ms);
		dt = Math.min(dt, Math.max(0, lt - 1));

		if (ns == n - 1 && nt == 0 && ds > 0 && dt > 0 && ds + dt > ms)
		{
			var f = ms / (ds + dt);
			ds *= f;
			dt *= f;
		}

		if (qs != null && ds != 0)
		{
			state.setAbsoluteTerminalPoint(new mxPoint(
				p0.x + (qs.x - p0.x) * ds / ls,
				p0.y + (qs.y - p0.y) * ds / ls), true);
		}

		if (qt != null && dt != 0)
		{
			state.setAbsoluteTerminalPoint(new mxPoint(
				pe.x + (qt.x - pe.x) * dt / lt,
				pe.y + (qt.y - pe.y) * dt / lt), false);
		}
	}
};

/**
 * Function: updateFloatingTerminalPoint
 *
 * Updates the absolute terminal point in the given state for the given
 * start and end state, where start is the source if source is true.
 * 
 * Parameters:
 * 
 * edge - <mxCellState> whose terminal point should be updated.
 * start - <mxCellState> for the terminal on "this" side of the edge.
 * end - <mxCellState> for the terminal on the other side of the edge.
 * source - Boolean indicating if start is the source terminal state.
 */
mxGraphView.prototype.updateFloatingTerminalPoint = function(edge, start, end, source)
{
	edge.setAbsoluteTerminalPoint(this.getFloatingTerminalPoint(edge, start, end, source), source);
};

/**
 * Function: getFloatingTerminalPoint
 * 
 * Returns the floating terminal point for the given edge, start and end
 * state, where start is the source if source is true.
 * 
 * Parameters:
 * 
 * edge - <mxCellState> whose terminal point should be returned.
 * start - <mxCellState> for the terminal on "this" side of the edge.
 * end - <mxCellState> for the terminal on the other side of the edge.
 * source - Boolean indicating if start is the source terminal state.
 */
mxGraphView.prototype.getFloatingTerminalPoint = function(edge, start, end, source)
{
	start = this.getTerminalPort(edge, start, source);
	var next = this.getNextPoint(edge, end, source);
	
	var orth = this.graph.isOrthogonal(edge);
	var alpha = mxUtils.toRadians(Number(start.style[mxConstants.STYLE_ROTATION] || '0'));
	var center = new mxPoint(start.getCenterX(), start.getCenterY());
	
	if (alpha != 0)
	{
		var cos = Math.cos(-alpha);
		var sin = Math.sin(-alpha);
		next = mxUtils.getRotatedPoint(next, cos, sin, center);
	}
	
	var border = parseFloat(edge.style[mxConstants.STYLE_PERIMETER_SPACING] || 0);
	border += parseFloat(edge.style[(source) ?
		mxConstants.STYLE_SOURCE_PERIMETER_SPACING :
		mxConstants.STYLE_TARGET_PERIMETER_SPACING] || 0);
	var pt = this.getPerimeterPoint(start, next, alpha == 0 && orth, border);

	if (alpha != 0)
	{
		var cos = Math.cos(alpha);
		var sin = Math.sin(alpha);
		pt = mxUtils.getRotatedPoint(pt, cos, sin, center);
	}

	return pt;
};

/**
 * Function: getTerminalPort
 * 
 * Returns an <mxCellState> that represents the source or target terminal or
 * port for the given edge.
 * 
 * Parameters:
 * 
 * state - <mxCellState> that represents the state of the edge.
 * terminal - <mxCellState> that represents the terminal.
 * source - Boolean indicating if the given terminal is the source terminal.
 */
mxGraphView.prototype.getTerminalPort = function(state, terminal, source)
{
	var key = (source) ? mxConstants.STYLE_SOURCE_PORT :
		mxConstants.STYLE_TARGET_PORT;
	var id = mxUtils.getValue(state.style, key);
	
	if (id != null)
	{
		var tmp = this.getState(this.graph.getModel().getCell(id));
		
		// Only uses ports where a cell state exists
		if (tmp != null)
		{
			terminal = tmp;
		}
	}
	
	return terminal;
};

/**
 * Function: getPerimeterPoint
 *
 * Returns an <mxPoint> that defines the location of the intersection point between
 * the perimeter and the line between the center of the shape and the given point.
 * 
 * Parameters:
 * 
 * terminal - <mxCellState> for the source or target terminal.
 * next - <mxPoint> that lies outside of the given terminal.
 * orthogonal - Boolean that specifies if the orthogonal projection onto
 * the perimeter should be returned. If this is false then the intersection
 * of the perimeter and the line between the next and the center point is
 * returned.
 * border - Optional border between the perimeter and the shape.
 */
mxGraphView.prototype.getPerimeterPoint = function(terminal, next, orthogonal, border)
{
	var point = null;
	
	if (terminal != null)
	{
		var perimeter = this.getPerimeterFunction(terminal);
		
		if (perimeter != null && next != null)
		{
			var bounds = this.getPerimeterBounds(terminal, border);

			if (bounds.width > 0 || bounds.height > 0)
			{
				point = new mxPoint(next.x, next.y);
				var flipH = false;
				var flipV = false;	
				
				if (this.graph.model.isVertex(terminal.cell))
				{
					flipH = mxUtils.getValue(terminal.style, mxConstants.STYLE_FLIPH, 0) == 1;
					flipV = mxUtils.getValue(terminal.style, mxConstants.STYLE_FLIPV, 0) == 1;	
	
					// Legacy support for stencilFlipH/V
					if (terminal.shape != null && terminal.shape.stencil != null)
					{
						flipH = (mxUtils.getValue(terminal.style, 'stencilFlipH', 0) == 1) || flipH;
						flipV = (mxUtils.getValue(terminal.style, 'stencilFlipV', 0) == 1) || flipV;
					}
	
					if (flipH)
					{
						point.x = 2 * bounds.getCenterX() - point.x;
					}
					
					if (flipV)
					{
						point.y = 2 * bounds.getCenterY() - point.y;
					}
				}
				
				point = perimeter(bounds, terminal, point, orthogonal);

				if (point != null)
				{
					if (flipH)
					{
						point.x = 2 * bounds.getCenterX() - point.x;
					}
					
					if (flipV)
					{
						point.y = 2 * bounds.getCenterY() - point.y;
					}
				}
			}
		}
		
		if (point == null)
		{
			point = this.getPoint(terminal);
		}
	}
	
	return point;
};

/**
 * Function: getRoutingCenterX
 * 
 * Returns the x-coordinate of the center point for automatic routing.
 */
mxGraphView.prototype.getRoutingCenterX = function (state)
{
	var f = (state.style != null) ? parseFloat(state.style
		[mxConstants.STYLE_ROUTING_CENTER_X]) || 0 : 0;

	return state.getCenterX() + f * state.width;
};

/**
 * Function: getRoutingCenterY
 * 
 * Returns the y-coordinate of the center point for automatic routing.
 */
mxGraphView.prototype.getRoutingCenterY = function (state)
{
	var f = (state.style != null) ? parseFloat(state.style
		[mxConstants.STYLE_ROUTING_CENTER_Y]) || 0 : 0;

	return state.getCenterY() + f * state.height;
};

/**
 * Function: getPerimeterBounds
 *
 * Returns the perimeter bounds for the given terminal, edge pair as an
 * <mxRectangle>.
 * 
 * If you have a model where each terminal has a relative child that should
 * act as the graphical endpoint for a connection from/to the terminal, then
 * this method can be replaced as follows:
 * 
 * (code)
 * var oldGetPerimeterBounds = mxGraphView.prototype.getPerimeterBounds;
 * mxGraphView.prototype.getPerimeterBounds = function(terminal, edge, isSource)
 * {
 *   var model = this.graph.getModel();
 *   var childCount = model.getChildCount(terminal.cell);
 * 
 *   if (childCount > 0)
 *   {
 *     var child = model.getChildAt(terminal.cell, 0);
 *     var geo = model.getGeometry(child);
 *
 *     if (geo != null &&
 *         geo.relative)
 *     {
 *       var state = this.getState(child);
 *       
 *       if (state != null)
 *       {
 *         terminal = state;
 *       }
 *     }
 *   }
 *   
 *   return oldGetPerimeterBounds.apply(this, arguments);
 * };
 * (end)
 * 
 * Parameters:
 * 
 * terminal - <mxCellState> that represents the terminal.
 * border - Number that adds a border between the shape and the perimeter.
 */
mxGraphView.prototype.getPerimeterBounds = function(terminal, border)
{
	border = (border != null) ? border : 0;

	if (terminal != null)
	{
		border += parseFloat(terminal.style[mxConstants.STYLE_PERIMETER_SPACING] || 0);
	}

	return terminal.getPerimeterBounds(border * this.scale);
};

/**
 * Function: getPerimeterFunction
 *
 * Returns the perimeter function for the given state.
 */
mxGraphView.prototype.getPerimeterFunction = function(state)
{
	var perimeter = state.style[mxConstants.STYLE_PERIMETER];

	// Converts string values to objects
	if (typeof(perimeter) == "string")
	{
		var tmp = mxStyleRegistry.getValue(perimeter);
		
		if (tmp == null && this.isAllowEval())
		{
 			tmp = mxUtils.eval(perimeter);
		}

		perimeter = tmp;
	}
	
	if (typeof(perimeter) == "function")
	{
		return perimeter;
	}
	
	return null;
};

/**
 * Function: getNextPoint
 *
 * Returns the nearest point in the list of absolute points or the center
 * of the opposite terminal.
 * 
 * Parameters:
 * 
 * edge - <mxCellState> that represents the edge.
 * opposite - <mxCellState> that represents the opposite terminal.
 * source - Boolean indicating if the next point for the source or target
 * should be returned.
 */
mxGraphView.prototype.getNextPoint = function(edge, opposite, source)
{
	var pts = edge.absolutePoints;
	var point = null;
	
	if (pts != null && pts.length >= 2)
	{
		var count = pts.length;
		point = pts[(source) ? Math.min(1, count - 1) : Math.max(0, count - 2)];
	}
	
	if (point == null && opposite != null)
	{
		point = new mxPoint(opposite.getCenterX(), opposite.getCenterY());
	}
	
	return point;
};

/**
 * Function: getVisibleTerminal
 *
 * Returns the nearest ancestor terminal that is visible. The edge appears
 * to be connected to this terminal on the display. The result of this method
 * is cached in <mxCellState.getVisibleTerminalState>.
 * 
 * Parameters:
 * 
 * edge - <mxCell> whose visible terminal should be returned.
 * source - Boolean that specifies if the source or target terminal
 * should be returned.
 */
mxGraphView.prototype.getVisibleTerminal = function(edge, source)
{
	var model = this.graph.getModel();
	var result = model.getTerminal(edge, source);
	var best = result;
	
	while (result != null && result != this.currentRoot)
	{
		if (!this.graph.isCellVisible(best) || this.isCellCollapsed(result))
		{
			best = result;
		}
		
		result = model.getParent(result);
	}

	// Checks if the result is valid for the current view state
	if (best != null && (!model.contains(best) ||
		model.getParent(best) == model.getRoot() ||
		best == this.currentRoot))
	{
		best = null;
	}
	
	return best;
};

/**
 * Function: updateEdgeBounds
 *
 * Updates the given state using the bounding box of t
 * he absolute points.
 * Also updates <mxCellState.terminalDistance>, <mxCellState.length> and
 * <mxCellState.segments>.
 * 
 * Parameters:
 * 
 * state - <mxCellState> whose bounds should be updated.
 */
mxGraphView.prototype.updateEdgeBounds = function(state)
{
	var points = state.absolutePoints;
	var p0 = points[0];
	var pe = points[points.length - 1];
	
	if (p0.x != pe.x || p0.y != pe.y)
	{
		var dx = pe.x - p0.x;
		var dy = pe.y - p0.y;
		state.terminalDistance = Math.sqrt(dx * dx + dy * dy);
	}
	else
	{
		state.terminalDistance = 0;
	}
	
	var length = 0;
	var segments = [];
	var pt = p0;
	
	if (pt != null)
	{
		var minX = pt.x;
		var minY = pt.y;
		var maxX = minX;
		var maxY = minY;
		
		for (var i = 1; i < points.length; i++)
		{
			var tmp = points[i];
			
			if (tmp != null)
			{
				var dx = pt.x - tmp.x;
				var dy = pt.y - tmp.y;
				
				var segment = Math.sqrt(dx * dx + dy * dy);
				segments.push(segment);
				length += segment;
				
				pt = tmp;
				
				minX = Math.min(pt.x, minX);
				minY = Math.min(pt.y, minY);
				maxX = Math.max(pt.x, maxX);
				maxY = Math.max(pt.y, maxY);
			}
		}
		
		state.length = length;
		state.segments = segments;
		
		// Minimum size of 1 in model units (TODO: include marker size)
		var markerSize = this.scale;

		state.x = minX;
		state.y = minY;
		state.width = Math.max(markerSize, maxX - minX);
		state.height = Math.max(markerSize, maxY - minY);
	}
};

/**
 * Function: getPoint
 *
 * Returns the absolute point on the edge for the given relative
 * <mxGeometry> as an <mxPoint>. The edge is represented by the given
 * <mxCellState>.
 * 
 * Parameters:
 * 
 * state - <mxCellState> that represents the state of the parent edge.
 * geometry - <mxGeometry> that represents the relative location.
 */
mxGraphView.prototype.getPoint = function(state, geometry)
{
	var x = state.getCenterX();
	var y = state.getCenterY();
	
	if (state.segments != null && (geometry == null || geometry.relative))
	{
		var gx = (geometry != null) ? geometry.x / 2 : 0;
		var pointCount = state.absolutePoints.length;
		// Rounds in model units so that the result does not depend on the scale
		var dist = Math.round(mxUtils.unscale((gx + 0.5) * state.length, this.scale)) * this.scale;
		var segment = state.segments[0];
		var length = 0;				
		var index = 1;

		while (dist >= Math.round(mxUtils.unscale(length + segment, this.scale)) * this.scale &&
			index < pointCount - 1)
		{
			length += segment;
			segment = state.segments[index++];
		}

		var factor = (segment == 0) ? 0 : (dist - length) / segment;
		var p0 = state.absolutePoints[index-1];
		var pe = state.absolutePoints[index];

		if (p0 != null && pe != null)
		{
			var gy = 0;
			var offsetX = 0;
			var offsetY = 0;

			if (geometry != null)
			{
				gy = geometry.y;
				var offset = geometry.offset;
				
				if (offset != null)
				{
					offsetX = offset.x;
					offsetY = offset.y;
				}
			}

			var dx = pe.x - p0.x;
			var dy = pe.y - p0.y;
			var nx = (segment == 0) ? 0 : dy / segment;
			var ny = (segment == 0) ? 0 : dx / segment;
			
			x = p0.x + dx * factor + (nx * gy + offsetX) * this.scale;
			y = p0.y + dy * factor - (ny * gy - offsetY) * this.scale;
		}
	}
	else if (geometry != null)
	{
		var offset = geometry.offset;
		
		if (offset != null)
		{
			x += offset.x;
			y += offset.y;
		}
	}
	
	return new mxPoint(x, y);		
};

/**
 * Function: getRelativePoint
 *
 * Gets the relative point that describes the given, absolute label
 * position for the given edge state.
 * 
 * Parameters:
 * 
 * state - <mxCellState> that represents the state of the parent edge.
 * x - Specifies the x-coordinate of the absolute label location.
 * y - Specifies the y-coordinate of the absolute label location.
 */
mxGraphView.prototype.getRelativePoint = function(edgeState, x, y)
{
	var model = this.graph.getModel();
	var geometry = model.getGeometry(edgeState.cell);
	
	if (geometry != null)
	{
		var pointCount = edgeState.absolutePoints.length;
		
		if (geometry.relative && pointCount > 1)
		{
			var totalLength = edgeState.length;
			var segments = edgeState.segments;

			// Works out which line segment the point of the label is closest to
			var p0 = edgeState.absolutePoints[0];
			var pe = edgeState.absolutePoints[1];
			var minDist = mxUtils.ptSegDistSq(p0.x, p0.y, pe.x, pe.y, x, y);
			var length = 0;
			var index = 0;
			var tmp = 0;
			
			for (var i = 2; i < pointCount; i++)
			{
				p0 = pe;
				pe = edgeState.absolutePoints[i];
				var dist = mxUtils.ptSegDistSq(p0.x, p0.y, pe.x, pe.y, x, y);
				tmp += segments[i - 2];
				
				if (dist <= minDist)
				{
					minDist = dist;
					index = i - 1;
					length = tmp;
				}
			}
			
			var seg = segments[index];
			p0 = edgeState.absolutePoints[index];
			pe = edgeState.absolutePoints[index + 1];
			
			var x2 = p0.x;
			var y2 = p0.y;
			
			var x1 = pe.x;
			var y1 = pe.y;
			
			var px = x;
			var py = y;
			
			var xSegment = x2 - x1;
			var ySegment = y2 - y1;
			
			px -= x1;
			py -= y1;
			var projlenSq = 0;
			
			px = xSegment - px;
			py = ySegment - py;
			var dotprod = px * xSegment + py * ySegment;

			if (dotprod <= 0.0)
			{
				projlenSq = 0;
			}
			else
			{
				projlenSq = dotprod * dotprod
						/ (xSegment * xSegment + ySegment * ySegment);
			}

			var projlen = Math.sqrt(projlenSq);

			if (projlen > seg)
			{
				projlen = seg;
			}

			var yDistance = Math.sqrt(mxUtils.ptSegDistSq(p0.x, p0.y, pe
					.x, pe.y, x, y));
			var direction = mxUtils.relativeCcw(p0.x, p0.y, pe.x, pe.y, x, y);

			if (direction == -1)
			{
				yDistance = -yDistance;
			}

			// Constructs the relative point for the label
			return new mxPoint((totalLength > 0) ? ((totalLength / 2 - length - projlen) / totalLength) * -2 : 0,
						yDistance / this.scale);
		}
	}
	
	return new mxPoint();
};

/**
 * Function: updateEdgeLabelOffset
 *
 * Updates <mxCellState.absoluteOffset> for the given state. The absolute
 * offset is normally used for the position of the edge label. Is is
 * calculated from the geometry as an absolute offset from the center
 * between the two endpoints if the geometry is absolute, or as the
 * relative distance between the center along the line and the absolute
 * orthogonal distance if the geometry is relative.
 * 
 * Parameters:
 * 
 * state - <mxCellState> whose absolute offset should be updated.
 */
mxGraphView.prototype.updateEdgeLabelOffset = function(state)
{
	var points = state.absolutePoints;
	
	state.absoluteOffset.x = state.getCenterX();
	state.absoluteOffset.y = state.getCenterY();

	if (points != null && points.length > 0 && state.segments != null)
	{
		var geometry = this.graph.getCellGeometry(state.cell);
		
		if (geometry.relative)
		{
			var offset = this.getPoint(state, geometry);
			
			if (offset != null)
			{
				state.absoluteOffset = offset;
			}
		}
		else
		{
			var p0 = points[0];
			var pe = points[points.length - 1];
			
			if (p0 != null && pe != null)
			{
				var dx = pe.x - p0.x;
				var dy = pe.y - p0.y;
				var x0 = 0;
				var y0 = 0;

				var off = geometry.offset;
				
				if (off != null)
				{
					x0 = off.x;
					y0 = off.y;
				}
				
				var x = p0.x + dx / 2 + x0 * this.scale;
				var y = p0.y + dy / 2 + y0 * this.scale;
				
				state.absoluteOffset.x = x;
				state.absoluteOffset.y = y;
			}
		}
	}
};

/**
 * Function: getState
 *
 * Returns the <mxCellState> for the given cell. If create is true, then
 * the state is created if it does not yet exist.
 * 
 * Parameters:
 * 
 * cell - <mxCell> for which the <mxCellState> should be returned.
 * create - Optional boolean indicating if a new state should be created
 * if it does not yet exist. Default is false.
 */
mxGraphView.prototype.getState = function(cell, create)
{
	create = create || false;
	var state = null;
	
	if (cell != null)
	{
		state = this.states.get(cell);
		
		if (create && (state == null || this.updateStyle) && this.graph.isCellVisible(cell))
		{
			if (state == null)
			{
				state = this.createState(cell);
				this.states.put(cell, state);

				// Validates the new state in the next validation
				if (this.createdCells != null)
				{
					this.createdCells.push(cell);
				}
				else if (!this.validatingAllCells)
				{
					this.addInvalidCell(cell);
				}
			}
			else
			{
				state.style = this.graph.getCellStyle(cell);
			}
		}
	}

	return state;
};

/**
 * Function: isRendering
 *
 * Returns <rendering>.
 */
mxGraphView.prototype.isRendering = function()
{
	return this.rendering;
};

/**
 * Function: setRendering
 *
 * Sets <rendering>.
 */
mxGraphView.prototype.setRendering = function(value)
{
	this.rendering = value;
};

/**
 * Function: isAllowEval
 *
 * Returns <allowEval>.
 */
mxGraphView.prototype.isAllowEval = function()
{
	return this.allowEval;
};

/**
 * Function: setAllowEval
 *
 * Sets <allowEval>.
 */
mxGraphView.prototype.setAllowEval = function(value)
{
	this.allowEval = value;
};

/**
 * Function: getStates
 *
 * Returns <states>.
 */
mxGraphView.prototype.getStates = function()
{
	return this.states;
};

/**
 * Function: setStates
 *
 * Sets <states>.
 */
mxGraphView.prototype.setStates = function(value)
{
	this.states = value;

	// Walks all cells and adds the bounding boxes of all new states in the
	// next validation
	this.invalidCells = null;
	this.addedGraphBounds = null;
	this.invalidBoundingBoxes = null;
	this.removedBoundingBoxes = null;
};

/**
 * Function: getCellStates
 *
 * Returns the <mxCellStates> for the given array of <mxCells>. The array
 * contains all states that are not null, that is, the returned array may
 * have less elements than the given array. If no argument is given, then
 * this returns <states>.
 */
mxGraphView.prototype.getCellStates = function(cells)
{
	if (cells == null)
	{
		return this.states;
	}
	else
	{
		var result = [];
		
		for (var i = 0; i < cells.length; i++)
		{
			var state = this.getState(cells[i]);
			
			if (state != null)
			{
				result.push(state);
			}
		}
		
		return result;
	}
};

/**
 * Function: removeState
 *
 * Removes and returns the <mxCellState> for the given cell.
 * 
 * Parameters:
 * 
 * cell - <mxCell> for which the <mxCellState> should be removed.
 */
mxGraphView.prototype.removeState = function(cell)
{
	var state = null;
	
	if (cell != null)
	{
		state = this.states.remove(cell);

		if (state != null)
		{
			this.graphBoundsInvalid = true;

			if (state.graphBoundingBox != null && this.removedBoundingBoxes != null)
			{
				this.removedBoundingBoxes.push(state.graphBoundingBox);
			}

			this.graph.cellRenderer.destroy(state);
			state.invalid = true;
			state.destroy();
		}
	}
	
	return state;
};

/**
 * Function: createState
 *
 * Creates and returns an <mxCellState> for the given cell and initializes
 * it using <mxCellRenderer.initialize>.
 * 
 * Parameters:
 * 
 * cell - <mxCell> for which a new <mxCellState> should be created.
 */
mxGraphView.prototype.createState = function(cell)
{
	return new mxCellState(this, cell, this.graph.getCellStyle(cell));
};

/**
 * Function: getCanvas
 *
 * Returns the DOM node that contains the background-, draw- and
 * overlay- and decoratorpanes.
 */
mxGraphView.prototype.getCanvas = function()
{
	return this.canvas;
};

/**
 * Function: getBackgroundPane
 *
 * Returns the DOM node that represents the background layer.
 */
mxGraphView.prototype.getBackgroundPane = function()
{
	return this.backgroundPane;
};

/**
 * Function: getDrawPane
 *
 * Returns the DOM node that represents the main drawing layer.
 */
mxGraphView.prototype.getDrawPane = function()
{
	return this.drawPane;
};

/**
 * Function: getOverlayPane
 *
 * Returns the DOM node that represents the layer above the drawing layer.
 */
mxGraphView.prototype.getOverlayPane = function()
{
	return this.overlayPane;
};

/**
 * Function: getDecoratorPane
 *
 * Returns the DOM node that represents the topmost drawing layer.
 */
mxGraphView.prototype.getDecoratorPane = function()
{
	return this.decoratorPane;
};

/**
 * Function: isContainerEvent
 * 
 * Returns true if the event origin is one of the drawing panes or
 * containers of the view.
 */
mxGraphView.prototype.isContainerEvent = function(evt)
{
	var source = mxEvent.getSource(evt);
	
	return source == this.graph.container ||
		this.backgroundPane.contains(source) ||
		source == this.canvas.parentNode ||
		source == this.canvas ||
		source == this.drawPane ||
		source == this.overlayPane ||
		source == this.decoratorPane;
};

/**
 * Function: isScrollEvent
 * 
 * Returns true if the event origin is one of the scrollbars of the
 * container in IE. Such events are ignored.
 */
 mxGraphView.prototype.isScrollEvent = function(evt)
{
	var offset = mxUtils.getOffset(this.graph.container);
	var pt = new mxPoint(evt.clientX - offset.x, evt.clientY - offset.y);

	var outWidth = this.graph.container.offsetWidth;
	var inWidth = this.graph.container.clientWidth;

	if (outWidth > inWidth && pt.x > inWidth + 2 && pt.x <= outWidth)
	{
		return true;
	}

	var outHeight = this.graph.container.offsetHeight;
	var inHeight = this.graph.container.clientHeight;
	
	if (outHeight > inHeight && pt.y > inHeight + 2 && pt.y <= outHeight)
	{
		return true;
	}
	
	return false;
};

/**
 * Function: init
 *
 * Initializes the graph event dispatch loop for the specified container
 * and invokes <create> to create the required DOM nodes for the display.
 */
mxGraphView.prototype.init = function()
{
	this.installListeners();
	
	// Creates the DOM nodes for the respective display dialect
	var graph = this.graph;
	
	if (graph.dialect == mxConstants.DIALECT_SVG)
	{
		this.createSvg();
	}
	else
	{
		this.createHtml();
	}
};

/**
 * Function: installListeners
 *
 * Installs the required listeners in the container.
 */
mxGraphView.prototype.installListeners = function()
{
	var graph = this.graph;
	var container = graph.container;
	
	if (container != null)
	{
		// Support for touch device gestures (eg. pinch to zoom)
		// Double-tap handling is implemented in mxGraph.fireMouseEvent
		if (mxClient.IS_TOUCH)
		{
			mxEvent.addListener(container, 'gesturestart', mxUtils.bind(this, function(evt)
			{
				graph.fireGestureEvent(evt);
				mxEvent.consume(evt);
			}));
			
			mxEvent.addListener(container, 'gesturechange', mxUtils.bind(this, function(evt)
			{
				graph.fireGestureEvent(evt);
				mxEvent.consume(evt);
			}));

			mxEvent.addListener(container, 'gestureend', mxUtils.bind(this, function(evt)
			{
				graph.fireGestureEvent(evt);
				mxEvent.consume(evt);
			}));
		}
		
		// Adds basic listeners for graph event dispatching
		mxEvent.addGestureListeners(container, mxUtils.bind(this, function(evt)
		{
			// Condition to avoid scrollbar events starting a rubberband selection
			if (this.isContainerEvent(evt) && ((!mxClient.IS_GC &&
				!mxClient.IS_OP && !mxClient.IS_SF) ||
				!this.isScrollEvent(evt)))
			{
				graph.fireMouseEvent(mxEvent.MOUSE_DOWN, new mxMouseEvent(evt));
			}
		}),
		mxUtils.bind(this, function(evt)
		{
			if (this.isContainerEvent(evt))
			{
				graph.fireMouseEvent(mxEvent.MOUSE_MOVE, new mxMouseEvent(evt));
			}
		}),
		mxUtils.bind(this, function(evt)
		{
			if (this.isContainerEvent(evt))
			{
				graph.fireMouseEvent(mxEvent.MOUSE_UP, new mxMouseEvent(evt));
			}
		}));
		
		// Adds listener for double click handling on background, this does always
		// use native event handler, we assume that the DOM of the background
		// does not change during the double click
		mxEvent.addListener(container, 'dblclick', mxUtils.bind(this, function(evt)
		{
			if (this.isContainerEvent(evt))
			{
				graph.dblClick(evt);
			}
		}));

		// Workaround for touch events which started on some DOM node
		// on top of the container, in which case the cells under the
		// mouse for the move and up events are not detected.
		var getState = function(evt)
		{
			var state = null;
			
			// Workaround for touch events which started on some DOM node
			// on top of the container, in which case the cells under the
			// mouse for the move and up events are not detected.
			if (mxClient.IS_TOUCH)
			{
				var x = mxEvent.getClientX(evt);
				var y = mxEvent.getClientY(evt);
				
				// Dispatches the drop event to the graph which
				// consumes and executes the source function
				var pt = mxUtils.convertPoint(container, x, y);
				state = graph.view.getState(graph.getCellAt(pt.x, pt.y));
			}
			
			return state;
		};
		
		// Adds basic listeners for graph event dispatching outside of the
		// container and finishing the handling of a single gesture
		// Implemented via graph event dispatch loop to avoid duplicate events
		// in Firefox and Chrome
		graph.addMouseListener(
		{
			mouseDown: function(sender, me)
			{
				graph.popupMenuHandler.hideMenu();
			},
			mouseMove: function() { },
			mouseUp: function() { }
		});
		
		this.moveHandler = mxUtils.bind(this, function(evt)
		{
			// Hides the tooltip if mouse is outside container
			if (graph.tooltipHandler != null && graph.tooltipHandler.isHideOnHover())
			{
				graph.tooltipHandler.hide();
			}

			if (this.captureDocumentGesture && graph.isMouseDown && graph.container != null &&
				!this.isContainerEvent(evt) && graph.container.style.display != 'none' &&
				graph.container.style.visibility != 'hidden' && !mxEvent.isConsumed(evt))
			{
				graph.fireMouseEvent(mxEvent.MOUSE_MOVE, new mxMouseEvent(evt, getState(evt)));
			}
		});
		
		this.endHandler = mxUtils.bind(this, function(evt)
		{
			if (this.captureDocumentGesture && graph.isMouseDown && graph.container != null &&
				!this.isContainerEvent(evt) && graph.container.style.display != 'none' &&
				graph.container.style.visibility != 'hidden')
			{
				graph.fireMouseEvent(mxEvent.MOUSE_UP, new mxMouseEvent(evt));
			}
		});
		
		mxEvent.addGestureListeners(document, null, this.moveHandler, this.endHandler);

		// Measures the labels again when fonts or images in labels have loaded
		// as this changes their size without a repaint. Load events do not
		// bubble but they are dispatched to capturing listeners.
		this.labelSizeHandler = mxUtils.bind(this, function(evt)
		{
			if (evt.type == 'loadingdone' || (evt.target != null &&
				evt.target.nodeName == 'IMG'))
			{
				this.scheduleLabelBoundingBoxUpdate();
			}
		});

		container.addEventListener('load', this.labelSizeHandler, true);
		container.addEventListener('error', this.labelSizeHandler, true);
		this.fontFaceSet = container.ownerDocument.fonts;

		if (this.fontFaceSet != null && typeof this.fontFaceSet.addEventListener === 'function')
		{
			this.fontFaceSet.addEventListener('loadingdone', this.labelSizeHandler);
		}
	}
};

/**
 * Function: scheduleLabelBoundingBoxUpdate
 *
 * Schedules <updateLabelBoundingBoxes> after <labelBoundingBoxDelay> so
 * that the loading of multiple fonts and images is handled once.
 */
mxGraphView.prototype.scheduleLabelBoundingBoxUpdate = function()
{
	if (this.labelBoundingBoxThread == null)
	{
		this.labelBoundingBoxThread = window.setTimeout(mxUtils.bind(this, function()
		{
			this.labelBoundingBoxThread = null;
			this.updateLabelBoundingBoxes();
		}), this.labelBoundingBoxDelay);
	}
};

/**
 * Function: updateLabelBoundingBoxes
 *
 * Measures the bounding boxes of all labels again and updates the graph
 * bounds. This is used after fonts or images in labels have loaded, which
 * changes the size of the labels without repainting them. The labels are
 * measured in the next validation if the model is being changed.
 */
mxGraphView.prototype.updateLabelBoundingBoxes = function()
{
	if (this.canvas != null)
	{
		this.states.visit(function(key, state)
		{
			if (state.text != null)
			{
				state.text.invalidateBoundingBox();
				state.text.offsetWidth = null;
				state.text.offsetHeight = null;
			}
		});

		this.graphBoundsInvalid = true;

		if (this.graph.model.updateLevel == 0)
		{
			var bounds = mxRectangle.fromRectangle(this.getGraphBounds());
			this.validate();

			if (!bounds.equals(this.getGraphBounds()))
			{
				this.graph.sizeDidChange();
			}
		}
	}
};

/**
 * Function: createHtml
 *
 * Creates the DOM nodes for the HTML display.
 */
mxGraphView.prototype.createHtml = function()
{
	var container = this.graph.container;
	
	if (container != null)
	{
		this.canvas = this.createHtmlPane('100%', '100%');
		this.canvas.style.overflow = 'hidden';
	
		// Uses minimal size for inner DIVs on Canvas. This is required
		// for correct event processing in IE. If we have an overlapping
		// DIV then the events on the cells are only fired for labels.
		this.backgroundPane = this.createHtmlPane('1px', '1px');
		this.drawPane = this.createHtmlPane('1px', '1px');
		this.overlayPane = this.createHtmlPane('1px', '1px');
		this.decoratorPane = this.createHtmlPane('1px', '1px');
		
		this.canvas.appendChild(this.backgroundPane);
		this.canvas.appendChild(this.drawPane);
		this.canvas.appendChild(this.overlayPane);
		this.canvas.appendChild(this.decoratorPane);

		container.appendChild(this.canvas);
		this.updateContainerStyle(container);
	}
};

/**
 * Function: updateHtmlCanvasSize
 * 
 * Updates the size of the HTML canvas.
 */
mxGraphView.prototype.updateHtmlCanvasSize = function(width, height)
{
	if (this.graph.container != null)
	{
		var ow = this.graph.container.offsetWidth;
		var oh = this.graph.container.offsetHeight;

		if (ow < width)
		{
			this.canvas.style.width = width + 'px';
		}
		else
		{
			this.canvas.style.width = '100%';
		}

		if (oh < height)
		{
			this.canvas.style.height = height + 'px';
		}
		else
		{
			this.canvas.style.height = '100%';
		}
	}
};

/**
 * Function: createHtmlPane
 * 
 * Creates and returns a drawing pane in HTML (DIV).
 */
mxGraphView.prototype.createHtmlPane = function(width, height)
{
	var pane = document.createElement('DIV');
	
	if (width != null && height != null)
	{
		pane.style.position = 'absolute';
		pane.style.left = '0px';
		pane.style.top = '0px';

		pane.style.width = width;
		pane.style.height = height;
	}
	else
	{
		pane.style.position = 'relative';
	}
	
	return pane;
};

/**
 * Function: createSvg
 *
 * Creates and returns the DOM nodes for the SVG display.
 */
mxGraphView.prototype.createSvg = function()
{
	var container = this.graph.container;
	this.canvas = document.createElementNS(mxConstants.NS_SVG, 'g');
	
	// For background image
	this.backgroundPane = document.createElementNS(mxConstants.NS_SVG, 'g');
	this.canvas.appendChild(this.backgroundPane);

	// Adds two layers (background is early feature)
	this.drawPane = document.createElementNS(mxConstants.NS_SVG, 'g');
	this.canvas.appendChild(this.drawPane);

	this.overlayPane = document.createElementNS(mxConstants.NS_SVG, 'g');
	this.canvas.appendChild(this.overlayPane);
	
	this.decoratorPane = document.createElementNS(mxConstants.NS_SVG, 'g');
	this.canvas.appendChild(this.decoratorPane);
	
	var root = document.createElementNS(mxConstants.NS_SVG, 'svg');
	root.style.left = '0px';
	root.style.top = '0px';
	root.style.width = '100%';
	root.style.height = '100%';
	
	// NOTE: In standards mode, the SVG must have block layout
	// in order for the container DIV to not show scrollbars.
	root.style.display = 'block';
	root.appendChild(this.canvas);
	
	if (container != null)
	{
		container.appendChild(root);
		this.updateContainerStyle(container);
	}
};

/**
 * Function: updateContainerStyle
 * 
 * Updates the style of the container after installing the SVG DOM elements.
 */
mxGraphView.prototype.updateContainerStyle = function(container)
{
	// Workaround for offset of container
	var style = mxUtils.getCurrentStyle(container);
	
	if (style != null && style.position == 'static')
	{
		container.style.position = 'relative';
	}
	
	// Disables built-in pan and zoom in IE10 and later
	if (mxClient.IS_POINTER)
	{
		container.style.touchAction = 'none';
	}
};

/**
 * Function: destroy
 * 
 * Destroys the view and all its resources.
 */
mxGraphView.prototype.destroy = function()
{
	var root = (this.canvas != null) ? this.canvas.ownerSVGElement : null;
	
	if (root == null)
	{
		root = this.canvas;
	}
	
	if (root != null && root.parentNode != null)
	{
		this.clear(this.currentRoot, true);
		mxEvent.removeGestureListeners(document, null, this.moveHandler, this.endHandler);
		mxEvent.release(this.graph.container);
		root.parentNode.removeChild(root);

		if (this.labelSizeHandler != null)
		{
			this.graph.container.removeEventListener('load', this.labelSizeHandler, true);
			this.graph.container.removeEventListener('error', this.labelSizeHandler, true);

			if (this.fontFaceSet != null && typeof this.fontFaceSet.removeEventListener === 'function')
			{
				this.fontFaceSet.removeEventListener('loadingdone', this.labelSizeHandler);
			}

			window.clearTimeout(this.labelBoundingBoxThread);
			this.labelBoundingBoxThread = null;
			this.labelSizeHandler = null;
			this.fontFaceSet = null;
		}

		window.clearTimeout(this.toleranceScaleThread);
		this.toleranceScaleThread = null;

		this.moveHandler = null;
		this.endHandler = null;
		this.canvas = null;
		this.backgroundPane = null;
		this.drawPane = null;
		this.overlayPane = null;
		this.decoratorPane = null;
	}
};

/**
 * Class: mxCurrentRootChange
 *
 * Action to change the current root in a view.
 *
 * Constructor: mxCurrentRootChange
 *
 * Constructs a change of the current root in the given view.
 */
function mxCurrentRootChange(view, root)
{
	this.view = view;
	this.root = root;
	this.previous = root;
	this.isUp = root == null;
	
	if (!this.isUp)
	{
		var tmp = this.view.currentRoot;
		var model = this.view.graph.getModel();
		
		while (tmp != null)
		{
			if (tmp == root)
			{
				this.isUp = true;
				break;
			}
			
			tmp = model.getParent(tmp);
		}
	}
};

/**
 * Function: execute
 *
 * Changes the current root of the view.
 */
mxCurrentRootChange.prototype.execute = function()
{
	var tmp = this.view.currentRoot;
	this.view.currentRoot = this.previous;
	this.previous = tmp;

	var translate = this.view.graph.getTranslateForRoot(this.view.currentRoot);
	
	if (translate != null)
	{
		this.view.translate = new mxPoint(-translate.x, -translate.y);
	}

	if (this.isUp)
	{
		this.view.clear(this.view.currentRoot, true);
		this.view.validate();
	}
	else
	{
		this.view.refresh();
	}
	
	var name = (this.isUp) ? mxEvent.UP : mxEvent.DOWN;
	this.view.fireEvent(new mxEventObject(name,
		'root', this.view.currentRoot, 'previous', this.previous));
	this.isUp = !this.isUp;
};
