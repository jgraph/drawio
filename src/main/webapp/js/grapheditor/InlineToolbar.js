/**
 * Floating toolbar that appears when a single edge or, if
 * Editor.enableShapeInlineToolbar is true, a single vertex is
 * selected, providing quick access to style changes.
 */
InlineToolbar = function(editorUi)
{
	this.editorUi = editorUi;
	this.graph = editorUi.editor.graph;
	this.popoverUpdates = [];
	this.init();
};

/**
 * Size of the icon button in pixels.
 */
InlineToolbar.prototype.iconSize = 24;

/**
 * Offset from the cell midpoint in pixels.
 */
InlineToolbar.prototype.offset = 16;

/**
 * Distance to the area of the selected vertices or cells and their
 * handles in pixels.
 */
InlineToolbar.prototype.vertexOffset = 8;

/**
 * State of the first selected cell.
 */
InlineToolbar.prototype.currentState = null;

/**
 * Selected cells.
 */
InlineToolbar.prototype.currentCells = null;

/**
 * Bounds of the selected cells in the last repaint (see getSelectionBounds).
 */
InlineToolbar.prototype.selectionBounds = null;

/**
 * SVG icon for the line style button.
 */
InlineToolbar.lineStyleIcon = Graph.createSvgImage(16, 16,
	'<line x1="2" y1="8" x2="14" y2="8" stroke="black" stroke-width="1.5"/>', 16, 16);

/**
 * SVG icon for the line endings button.
 */
InlineToolbar.lineEndIcon = Graph.createSvgImage(16, 16,
	'<path d="M 2 8 L 10 8 M 10 4 L 14 8 L 10 12 Z" stroke="black" stroke-width="1.5" fill="black"/>', 16, 16);

/**
 * SVG icon for the connection style button (static fallback).
 */
InlineToolbar.connStyleIcon = Graph.createSvgImage(16, 16,
	'<path d="M 3 13 L 3 6 Q 3 3 6 3 L 13 3" stroke="black" stroke-width="1.5" fill="none"/>', 16, 16);

/**
 * SVG icon for the fill button.
 */
InlineToolbar.fillIcon = Graph.createSvgImage(16, 16,
	'<rect x="2.75" y="2.75" width="10.5" height="10.5" rx="2" fill="black" fill-opacity="0.4" ' +
	'stroke="black" stroke-width="1.5"/>', 16, 16);

/**
 * SVG icon for the text button.
 */
InlineToolbar.textIcon = Graph.createSvgImage(16, 16,
	'<path d="M 3.5 13.5 L 8 2.5 L 12.5 13.5 M 5.25 9.5 L 10.75 9.5" stroke="black" ' +
	'stroke-width="1.5" fill="none"/>', 16, 16);

/**
 * Initializes the toolbar icon and event listeners.
 */
InlineToolbar.prototype.init = function()
{
	// Container for buttons
	this.toolbar = document.createElement('div');
	this.toolbar.style.position = 'absolute';
	this.toolbar.style.display = 'none';
	this.toolbar.style.zIndex = 1;
	this.toolbar.style.borderRadius = '12px';
	this.toolbar.style.backgroundColor = 'light-dark(white, var(--dark-color))';
	this.toolbar.style.border = '1px solid light-dark(#d0d0d0, #505050)';
	this.toolbar.style.opacity = '0.9';
	this.toolbar.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
	this.toolbar.style.whiteSpace = 'nowrap';
	this.toolbar.style.padding = '4px';

	var btnSize = this.iconSize - 4;

	// Creates a button that toggles the popover shown by the given function
	var createButton = mxUtils.bind(this, function(title, icon, showMenu)
	{
		var btn = document.createElement('div');
		btn.style.width = btnSize + 'px';
		btn.style.height = btnSize + 'px';
		btn.style.backgroundImage = 'url(' + icon.src + ')';
		btn.style.backgroundSize = '16px';
		btn.style.backgroundRepeat = 'no-repeat';
		btn.style.backgroundPosition = 'center';
		btn.style.cursor = 'pointer';
		btn.style.display = 'inline-block';
		btn.style.verticalAlign = 'top';
		btn.style.borderRadius = '6px';
		btn.className = 'geAdaptiveAsset';
		btn.setAttribute('title', title);

		mxEvent.addListener(btn, 'click', mxUtils.bind(this, function(evt)
		{
			if (this.graph.isEnabled())
			{
				if (this.currentPopoverAnchor == btn)
				{
					this.hidePopover();
				}
				else
				{
					showMenu.call(this, evt);
				}

				mxEvent.consume(evt);
			}
		}));

		this.toolbar.appendChild(btn);

		return btn;
	});

	// Line style (dash, weight, color)
	this.lineStyleBtn = createButton(mxResources.get('line'),
		InlineToolbar.lineStyleIcon, this.showLineStyleMenu);

	// Fill, gradient and pattern of vertices
	this.fillBtn = createButton(mxResources.get('fill'),
		InlineToolbar.fillIcon, this.showFillMenu);

	// Line endings (start/end arrow markers) of edges
	this.lineEndBtn = createButton(mxResources.get('lineend'),
		InlineToolbar.lineEndIcon, this.showLineEndMenu);

	// Connection style (routing/waypoints) of edges
	this.connStyleBtn = createButton(mxResources.get('connection'),
		InlineToolbar.connStyleIcon, this.showConnStyleMenu);

	// Text style of labels
	this.textBtn = createButton(mxResources.get('text'),
		InlineToolbar.textIcon, this.showTextMenu);

	// Append container to DOM
	this.graph.container.appendChild(this.toolbar);

	// Prevent mousedown from deselecting the cell
	mxEvent.addListener(this.toolbar, 'mousedown', mxUtils.bind(this, function(evt)
	{
		if (this.graph.isEnabled())
		{
			mxEvent.consume(evt);
		}
	}));

	this.selectionHandler = mxUtils.bind(this, function()
	{
		this.updateSelection();
	});

	this.repaintHandler = mxUtils.bind(this, function()
	{
		this.selectionBounds = null;
		this.repaint();
	});

	// Scrolling does not change the bounds of the selection
	this.scrollHandler = mxUtils.bind(this, function()
	{
		this.repaint();
	});

	this.modelHandler = mxUtils.bind(this, function()
	{
		this.updateSelection();
		this.updatePopover();
	});

	this.hideHandler = mxUtils.bind(this, function()
	{
		this.hide();
	});

	this.graph.selectionModel.addListener(mxEvent.CHANGE, this.selectionHandler);
	this.graph.model.addListener(mxEvent.CHANGE, this.modelHandler);
	this.graph.view.addListener(mxEvent.SCALE_AND_TRANSLATE, this.repaintHandler);
	this.graph.view.addListener(mxEvent.TRANSLATE, this.repaintHandler);
	this.graph.view.addListener(mxEvent.SCALE, this.repaintHandler);
	this.graph.view.addListener(mxEvent.DOWN, this.repaintHandler);
	this.graph.view.addListener(mxEvent.UP, this.repaintHandler);
	this.graph.addListener(mxEvent.ROOT, this.repaintHandler);
	this.graph.addListener(mxEvent.ESCAPE, this.selectionHandler);
	this.graph.addListener(mxEvent.START_EDITING, this.hideHandler);
	this.graph.addListener(mxEvent.EDITING_STOPPED, this.selectionHandler);
	mxEvent.addListener(this.graph.container, 'scroll', this.scrollHandler);
};

/**
 * Returns true if the toolbar is shown for the given selection cells: a
 * single edge or, if Editor.enableShapeInlineToolbar is true, any
 * selection without locked cells.
 */
InlineToolbar.prototype.isToolbarSelection = function(cells)
{
	var result = cells.length > 0 && (Editor.enableShapeInlineToolbar ||
		(cells.length == 1 && this.graph.model.isEdge(cells[0])));

	for (var i = 0; i < cells.length && result; i++)
	{
		result = !this.graph.isCellLocked(cells[i]);
	}

	return result;
};

/**
 * Updates visibility based on the current selection.
 */
InlineToolbar.prototype.updateSelection = function()
{
	var cells = this.graph.getSelectionCells();
	var state = null;
	this.selectionBounds = null;

	if (this.graph.isEnabled() && !this.graph.isEditing() &&
		this.isToolbarSelection(cells))
	{
		state = this.graph.view.getState(cells[0]);
	}

	if (state != null)
	{
		// The popover applies to the cells it was opened for
		var same = this.currentCells != null && this.currentCells.length == cells.length;

		for (var i = 0; i < cells.length && same; i++)
		{
			same = this.currentCells[i] == cells[i];
		}

		if (!same)
		{
			this.hidePopover(true);
		}

		this.currentState = state;
		this.currentCells = cells;
		this.show();
	}
	else
	{
		this.currentState = null;
		this.currentCells = null;
		this.hide();
	}
};

/**
 * Returns the common style of the selected cells (see Graph.mergeStyle).
 */
InlineToolbar.prototype.getCurrentStyle = function()
{
	var style = {};
	var initial = true;

	for (var i = 0; i < this.currentCells.length; i++)
	{
		var state = this.graph.view.getState(this.currentCells[i]);

		if (state != null)
		{
			this.graph.mergeStyle(state.style, style, initial);
			initial = false;
		}
	}

	return style;
};

/**
 * Returns true if the given function returns true for the states of all
 * selected cells.
 */
InlineToolbar.prototype.isSelectionState = function(fn)
{
	var result = this.currentCells != null && this.currentCells.length > 0;

	for (var i = 0; result && i < this.currentCells.length; i++)
	{
		var state = this.graph.view.getState(this.currentCells[i]);
		result = state != null && fn(state);
	}

	return result;
};

/**
 * Returns true if all selected cells are edges.
 */
InlineToolbar.prototype.isEdgeSelection = function()
{
	return this.isSelectionState(mxUtils.bind(this, function(state)
	{
		return this.graph.model.isEdge(state.cell);
	}));
};

/**
 * Returns true if the fill or, if gradient is true, the gradient of all
 * selected cells can be changed.
 */
InlineToolbar.prototype.isFillSelection = function(gradient)
{
	return this.isSelectionState(mxUtils.bind(this, function(state)
	{
		return (gradient) ? this.graph.isGradientState(state) :
			this.graph.isFillState(state);
	}));
};

/**
 * Returns true if the given cell has a label.
 */
InlineToolbar.prototype.hasLabel = function(cell)
{
	var label = this.graph.convertValueToString(cell);

	return label != null && mxUtils.trim(String(label)).length > 0;
};

/**
 * Returns true if the given cell is a label cell, such as a label cell of
 * an edge: a vertex without a width or a height, which has no line or fill
 * (see containsLabel in EditorUi.getSelectionState). The bounds of cells
 * with transparentBounds are derived from their children.
 */
InlineToolbar.prototype.isLabelCell = function(cell)
{
	var geo = this.graph.getCellGeometry(cell);

	return geo != null && this.graph.model.isVertex(cell) &&
		!(geo.width > 0 && geo.height > 0) &&
		!this.graph.isTransparentBounds(cell);
};

/**
 * Shows the buttons that apply to the selected cells and returns true if
 * a button is shown.
 */
InlineToolbar.prototype.updateButtons = function()
{
	var edges = this.isEdgeSelection();
	var shapes = true;
	var label = false;

	for (var i = 0; i < this.currentCells.length; i++)
	{
		shapes = shapes && !this.isLabelCell(this.currentCells[i]);
		label = label || this.hasLabel(this.currentCells[i]);
	}

	var display = function(visible)
	{
		return (visible) ? 'inline-block' : 'none';
	};

	this.lineStyleBtn.style.display = display(shapes);
	this.fillBtn.style.display = display(shapes && !edges && this.isFillSelection());
	this.lineEndBtn.style.display = display(edges);
	this.connStyleBtn.style.display = display(edges);
	this.textBtn.style.display = display(label);

	// Spacing to the previous visible button
	var first = true;

	for (var btn = this.toolbar.firstChild; btn != null; btn = btn.nextSibling)
	{
		if (btn.style.display != 'none')
		{
			btn.style.marginLeft = (first) ? '' : '4px';
			first = false;
		}
	}

	return shapes || label;
};

/**
 * Computes the midpoint along the edge path.
 */
InlineToolbar.prototype.getEdgeMidpoint = function(state)
{
	var pts = state.absolutePoints;

	if (pts == null || pts.length < 2)
	{
		return null;
	}

	// Compute total path length
	var totalLength = 0;
	var segments = [];

	for (var i = 1; i < pts.length; i++)
	{
		if (pts[i] != null && pts[i - 1] != null)
		{
			var dx = pts[i].x - pts[i - 1].x;
			var dy = pts[i].y - pts[i - 1].y;
			var len = Math.sqrt(dx * dx + dy * dy);
			segments.push(len);
			totalLength += len;
		}
		else
		{
			segments.push(0);
		}
	}

	// Find point at half-length
	var halfLength = totalLength / 2;
	var accumulated = 0;

	for (var i = 0; i < segments.length; i++)
	{
		if (accumulated + segments[i] >= halfLength)
		{
			var remaining = halfLength - accumulated;
			var ratio = (segments[i] > 0) ? remaining / segments[i] : 0;
			var p1 = pts[i];
			var p2 = pts[i + 1];

			if (p1 != null && p2 != null)
			{
				return new mxPoint(
					p1.x + (p2.x - p1.x) * ratio,
					p1.y + (p2.y - p1.y) * ratio
				);
			}

			break;
		}

		accumulated += segments[i];
	}

	// Fallback: midpoint of first and last
	var first = pts[0];
	var last = pts[pts.length - 1];

	if (first != null && last != null)
	{
		return new mxPoint((first.x + last.x) / 2, (first.y + last.y) / 2);
	}

	return null;
};

/**
 * Toolbar fade animation duration in ms.
 */
InlineToolbar.prototype.toolbarAnimDuration = 150;

/**
 * Shows the toolbar with a fade-in.
 */
InlineToolbar.prototype.show = function()
{
	// Label cells without a label have no options
	if (!this.updateButtons())
	{
		this.hide();

		return;
	}

	this.updateIcons();

	if (this.hideTimeout != null)
	{
		window.clearTimeout(this.hideTimeout);
		this.hideTimeout = null;
	}

	// Fades in only if hidden or fading out, not after each change of the cell
	if (this.toolbar.style.display == 'none' || this.toolbar.style.opacity == '0')
	{
		this.toolbar.style.transition = 'none';
		this.toolbar.style.opacity = '0';
		this.toolbar.style.display = 'block';
		this.repaint();

		// Force layout then fade in
		this.toolbar.offsetHeight;
		this.toolbar.style.transition = 'opacity ' + this.toolbarAnimDuration + 'ms ease-out';
		this.toolbar.style.opacity = '0.9';
	}
	else
	{
		this.repaint();
	}
};

/**
 * Hides the toolbar with a fade-out.
 */
InlineToolbar.prototype.hide = function()
{
	this.hidePopover(true);

	if (this.hideTimeout != null)
	{
		window.clearTimeout(this.hideTimeout);
		this.hideTimeout = null;
	}

	if (this.toolbar.style.display == 'none')
	{
		return;
	}

	this.toolbar.style.transition = 'opacity ' + this.toolbarAnimDuration + 'ms ease-in';
	this.toolbar.style.opacity = '0';

	this.hideTimeout = window.setTimeout(mxUtils.bind(this, function()
	{
		this.toolbar.style.display = 'none';
		this.hideTimeout = null;
	}), this.toolbarAnimDuration);
};

/**
 * Returns true if the current edge shape supports the curved bend style.
 */
InlineToolbar.prototype.supportsCurvedBend = function(style)
{
	return Graph.edgeSupportsCurved(style);
};

/**
 * Updates button icons to match the current cell style.
 * All three buttons use static icons for visual consistency;
 * the active style is shown inside the popover instead.
 */
InlineToolbar.prototype.updateIcons = function()
{
};

/**
 * Returns true if the line segment from (x1,y1) to (x2,y2) intersects
 * the axis-aligned rectangle at (rx, ry) with size (rw, rh).
 * Uses the Liang-Barsky clipping algorithm.
 */
InlineToolbar.prototype.segmentIntersectsRect = function(x1, y1, x2, y2, rx, ry, rw, rh)
{
	var dx = x2 - x1;
	var dy = y2 - y1;
	var p = [-dx, dx, -dy, dy];
	var q = [x1 - rx, rx + rw - x1, y1 - ry, ry + rh - y1];
	var tMin = 0;
	var tMax = 1;

	for (var i = 0; i < 4; i++)
	{
		if (p[i] == 0)
		{
			if (q[i] < 0)
			{
				return false;
			}
		}
		else
		{
			var t = q[i] / p[i];

			if (p[i] < 0)
			{
				tMin = Math.max(tMin, t);
			}
			else
			{
				tMax = Math.min(tMax, t);
			}

			if (tMin > tMax)
			{
				return false;
			}
		}
	}

	return true;
};

/**
 * Returns the area of the given cell that the toolbar does not cover: the
 * shape, its label, the visible handles and, for vertices, the space of the
 * connection arrows around the shape (see HoverIcons.repaint).
 */
InlineToolbar.prototype.getCellBounds = function(state)
{
	var graph = this.graph;
	var hoverIcons = this.editorUi.hoverIcons;
	var handler = graph.selectionCellsHandler.getHandler(state.cell);
	var shape = mxRectangle.fromRectangle((state.shape != null &&
		state.shape.boundingBox != null) ? state.shape.boundingBox : state);
	var result = shape.clone();
	var handles = [];

	var isVisible = function(handle)
	{
		return handle != null && handle.node != null && handle.bounds != null &&
			handle.node.style.visibility != 'hidden' &&
			handle.node.style.display != 'none';
	};

	if (state.text != null && state.text.boundingBox != null)
	{
		result.add(state.text.boundingBox);
	}

	if (handler != null)
	{
		handles = [].concat(handler.sizers || [], handler.bends || [],
			handler.virtualBends || []);

		if (handler.customHandles != null)
		{
			for (var i = 0; i < handler.customHandles.length; i++)
			{
				handles.push(handler.customHandles[i].shape);
			}
		}

		for (var i = 0; i < handles.length; i++)
		{
			if (isVisible(handles[i]))
			{
				result.add(handles[i].bounds);
			}
		}
	}

	if (hoverIcons != null && graph.connectionArrowsEnabled &&
		graph.model.isVertex(state.cell) && graph.isCellConnectable(state.cell))
	{
		var arrowWidth = hoverIcons.triangleUp.width + 2 * hoverIcons.tolerance;
		var arrowHeight = hoverIcons.triangleUp.height + 2 * hoverIcons.tolerance;
		var arrows = shape.clone();
		arrows.grow(graph.tolerance + hoverIcons.arrowSpacing + arrowHeight +
			((handler != null) ? Math.max(handler.horizontalOffset,
				handler.verticalOffset) / 2 : 0));
		result.add(arrows);

		// The arrow above the shape moves above the rotation handle
		var rotation = (handler != null) ? handler.rotationShape : null;
		var cx = state.getCenterX();

		if (isVisible(rotation) && rotation.bounds.x < cx + arrowWidth / 2 &&
			rotation.bounds.x + rotation.bounds.width > cx - arrowWidth / 2)
		{
			result.add(new mxRectangle(rotation.bounds.x, rotation.bounds.y -
				arrowHeight, rotation.bounds.width, arrowHeight));
		}
	}

	return result;
};

/**
 * Returns the area of the selected cells that the toolbar does not cover
 * (see getCellBounds).
 */
InlineToolbar.prototype.getSelectionBounds = function()
{
	var result = null;

	for (var i = 0; i < this.currentCells.length; i++)
	{
		var state = this.graph.view.getState(this.currentCells[i]);

		if (state != null)
		{
			var bounds = this.getCellBounds(state);

			if (result == null)
			{
				result = bounds;
			}
			else
			{
				result.add(bounds);
			}
		}
	}

	return result;
};

/**
 * Repositions the toolbar above the selected vertex or at the edge midpoint,
 * avoiding overlap with handles, connection arrows and edge segments.
 */
InlineToolbar.prototype.repaint = function()
{
	if (this.currentState != null && this.toolbar.style.display != 'none')
	{
		// Refresh state in case cell was deleted or edge changed
		var state = this.graph.view.getState(this.currentState.cell);

		if (state != null)
		{
			this.currentState = state;
			this.updateIcons();
			var container = this.graph.container;

			// A single edge has the toolbar at its midpoint, other selections
			// above the area of the selected cells
			var edge = this.currentCells.length == 1 && this.graph.model.isEdge(state.cell);
			// The bounds are kept while the diagram is scrolled
			if (!edge && this.selectionBounds == null)
			{
				this.selectionBounds = this.getSelectionBounds();
			}

			var bounds = (edge) ? null : this.selectionBounds;
			var mid = (edge) ? this.getEdgeMidpoint(state) :
				new mxPoint(bounds.getCenterX(), bounds.y);

			if (mid != null)
			{
				var toolbarWidth = this.toolbar.offsetWidth;
				var toolbarHeight = this.toolbar.offsetHeight;

				// Default position: above the selection or edge midpoint, centered
				var x = mid.x - toolbarWidth / 2;
				var y = mid.y - toolbarHeight - ((edge) ? this.offset : this.vertexOffset);

				// Below the selection if there is no room above
				if (!edge && y < container.scrollTop + 4 && bounds.y + bounds.height +
					this.vertexOffset + toolbarHeight <= container.scrollTop +
					container.clientHeight - 4)
				{
					mid.y = bounds.y + bounds.height;
					y = mid.y + this.vertexOffset;
				}

				// Check for overlap with edge handler bends and reposition if needed
				var handler = (edge) ? this.graph.selectionCellsHandler.getHandler(
					state.cell) : null;

				if (handler != null)
				{
					var minGap = 8;
					var allBends = (handler.bends || []).concat(handler.virtualBends || []);

					var checkOverlap = mxUtils.bind(this, function(tx, ty)
					{
						var bounds = new mxRectangle(Math.round(tx) - minGap,
							Math.round(ty) - minGap, toolbarWidth + 2 * minGap,
							toolbarHeight + 2 * minGap);

						for (var i = 0; i < allBends.length; i++)
						{
							if (allBends[i] != null && allBends[i].bounds != null &&
								allBends[i].node.style.visibility !== 'hidden' &&
								mxUtils.intersects(bounds, allBends[i].bounds))
							{
								return true;
							}
						}

						// Check intersection with edge segments
						var pts = state.absolutePoints;

						if (pts != null)
						{
							for (var i = 1; i < pts.length; i++)
							{
								if (pts[i] != null && pts[i - 1] != null &&
									this.segmentIntersectsRect(
										pts[i - 1].x, pts[i - 1].y,
										pts[i].x, pts[i].y,
										bounds.x, bounds.y,
										bounds.width, bounds.height))
								{
									return true;
								}
							}
						}

						// Check overlap with edge label
						if (state.text != null && state.text.boundingBox != null &&
							mxUtils.intersects(bounds, state.text.boundingBox))
						{
							return true;
						}

						// Check overlap with edge child elements
						var model = this.graph.getModel();
						var childCount = model.getChildCount(state.cell);

						for (var i = 0; i < childCount; i++)
						{
							var childState = this.graph.view.getState(
								model.getChildAt(state.cell, i));

							if (childState != null)
							{
								if (childState.shape != null &&
									childState.shape.boundingBox != null &&
									mxUtils.intersects(bounds, childState.shape.boundingBox))
								{
									return true;
								}

								if (childState.text != null &&
									childState.text.boundingBox != null &&
									mxUtils.intersects(bounds, childState.text.boundingBox))
								{
									return true;
								}
							}
						}

						return false;
					});

					if (checkOverlap(x, y))
					{
						// Try below the edge midpoint instead
						var belowY = mid.y + this.offset;
						var found = false;

						if (!checkOverlap(x, belowY))
						{
							y = belowY;
							found = true;
						}

						// Try left/right of the edge midpoint
						if (!found)
						{
							var centerY = mid.y - toolbarHeight / 2;
							var leftX = mid.x - toolbarWidth - this.offset;
							var rightX = mid.x + this.offset;

							if (!checkOverlap(leftX, centerY))
							{
								x = leftX;
								y = centerY;
								found = true;
							}
							else if (!checkOverlap(rightX, centerY))
							{
								x = rightX;
								y = centerY;
								found = true;
							}
						}

						// Find nearest non-overlapping position by
						// moving further away from the midpoint
						if (!found)
						{
							var centerY = mid.y - toolbarHeight / 2;

							for (var d = this.offset + minGap; d < 100; d += minGap)
							{
								if (!checkOverlap(x, mid.y - toolbarHeight - d))
								{
									y = mid.y - toolbarHeight - d;
									break;
								}
								else if (!checkOverlap(x, mid.y + d))
								{
									y = mid.y + d;
									break;
								}
								else if (!checkOverlap(mid.x - toolbarWidth - d, centerY))
								{
									x = mid.x - toolbarWidth - d;
									y = centerY;
									break;
								}
								else if (!checkOverlap(mid.x + d, centerY))
								{
									x = mid.x + d;
									y = centerY;
									break;
								}
							}
						}
					}
				}

				// Clamp to visible viewport so toolbar stays inside the
				// diagram container (not clipped behind sidebar/overflow).
				// Not clamped while the edge midpoint or the selection is
				// outside the viewport so that the toolbar moves out of view
				// with the cells when the diagram is panned or scrolled.
				var minX = container.scrollLeft + 4;
				var maxX = container.scrollLeft + container.clientWidth - toolbarWidth - 4;
				var minY = container.scrollTop + 4;
				var maxY = container.scrollTop + container.clientHeight - toolbarHeight - 4;
				var viewport = new mxRectangle(container.scrollLeft, container.scrollTop,
					container.clientWidth, container.clientHeight);

				if ((edge) ? mxUtils.contains(viewport, mid.x, mid.y) :
					mxUtils.intersects(viewport, bounds))
				{
					if (maxX > minX)
					{
						x = Math.max(minX, Math.min(x, maxX));
					}

					if (maxY > minY)
					{
						y = Math.max(minY, Math.min(y, maxY));
					}
				}

				this.toolbar.style.left = Math.round(x) + 'px';
				this.toolbar.style.top = Math.round(y) + 'px';

				// Keeps the popover at its button
				if (this.positionPopover != null)
				{
					this.positionPopover();
				}
			}
		}
	}
};

/**
 * Clamps a position (in container scroll coordinates) so an element of the
 * given size stays within the container's visible viewport. When the element
 * is larger than the viewport along an axis it is pinned to the top/left edge
 * so its start stays visible. Returns the clamped point.
 */
InlineToolbar.prototype.clampToContainer = function(x, y, w, h)
{
	var c = this.graph.container;
	var minX = c.scrollLeft + 4;
	var maxX = c.scrollLeft + c.clientWidth - w - 4;
	var minY = c.scrollTop + 4;
	var maxY = c.scrollTop + c.clientHeight - h - 4;

	return new mxPoint(
		(maxX > minX) ? Math.max(minX, Math.min(x, maxX)) : minX,
		(maxY > minY) ? Math.max(minY, Math.min(y, maxY)) : minY);
};

/**
 * Returns the index of the item whose icon matches the given image source,
 * or -1 if none matches. The routing and shape sections mirror the Format
 * panel's "waypoints" and "connection" dropdowns, which resolve the current
 * cell style to exactly one icon via EditorUi.getImageForEdgeStyle /
 * getImageForEdgeShape. Selecting the item that carries that canonical icon
 * keeps the inline toolbar's highlight in sync with the Format panel and
 * guarantees a single active item, even when the edge carries unrelated
 * style attributes (dash pattern, arrow sizes, width) that a strict
 * key/value match would trip over.
 */
InlineToolbar.prototype.getActiveIndexForImage = function(items, imageSrc)
{
	for (var i = 0; i < items.length; i++)
	{
		if (items[i].img === imageSrc)
		{
			return i;
		}
	}

	return -1;
};

/**
 * Number of items per row in the popover grid.
 */
InlineToolbar.prototype.popoverColumns = 4;

/**
 * Popover animation duration in ms.
 */
InlineToolbar.prototype.popoverAnimDuration = 220;

/**
 * Creates a popover shell anchored to the given button and returns its body element.
 * The popover includes arrow, positioning, animation and close handlers.
 * Options: persistOnClick (default false) keeps popover open when clicking inside.
 */
InlineToolbar.prototype.createPopover = function(anchorBtn, opts)
{
	this.hidePopover(true);

	var persistOnClick = opts != null && opts.persistOnClick;
	var container = this.graph.container;

	// Outer wrapper for positioning (no visual styling)
	var popover = document.createElement('div');
	popover.style.position = 'absolute';
	popover.style.zIndex = 2;
	popover.style.cursor = 'default';

	// Arrow: a rotated square split into border and fill layers
	var arrowSize = 12;
	var arrowOffset = Math.round(arrowSize * Math.SQRT2 / 2);

	var arrowBorder = document.createElement('div');
	arrowBorder.style.position = 'absolute';
	arrowBorder.style.width = arrowSize + 'px';
	arrowBorder.style.height = arrowSize + 'px';
	arrowBorder.style.backgroundColor = 'light-dark(#d0d0d0, #505050)';
	arrowBorder.style.transform = 'rotate(45deg)';
	arrowBorder.style.top = Math.round(arrowOffset - arrowSize / 2) + 'px';
	arrowBorder.style.zIndex = 1;
	popover.appendChild(arrowBorder);

	var arrowFill = document.createElement('div');
	arrowFill.style.position = 'absolute';
	arrowFill.style.width = (arrowSize - 2) + 'px';
	arrowFill.style.height = (arrowSize - 2) + 'px';
	arrowFill.style.backgroundColor = 'light-dark(white, var(--dark-color))';
	arrowFill.style.transform = 'rotate(45deg)';
	arrowFill.style.top = Math.round(arrowOffset - arrowSize / 2 + 1) + 'px';
	arrowFill.style.zIndex = 3;
	popover.appendChild(arrowFill);

	// Popover body
	var body = document.createElement('div');
	body.style.position = 'relative';
	body.style.marginTop = arrowOffset + 'px';
	body.style.backgroundColor = 'light-dark(white, var(--dark-color))';
	body.style.border = '1px solid light-dark(#d0d0d0, #505050)';
	body.style.borderRadius = '12px';
	body.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
	body.style.padding = '8px';
	body.style.zIndex = 2;
	popover.appendChild(body);

	// Prevent mousedown from deselecting edge
	mxEvent.addListener(popover, 'mousedown', function(e)
	{
		mxEvent.consume(e);
	});

	// Keeps keys typed in inputs away from the shortcuts of the graph, which
	// handles key events from its container (Backspace would delete and Enter
	// edit the selected cells). Escape closes the popover.
	mxEvent.addListener(popover, 'keydown', function(e)
	{
		if (mxEvent.getSource(e).nodeName == 'INPUT' && e.keyCode != 27)
		{
			e.stopPropagation();
		}
	});

	// Start hidden for animation
	popover.style.opacity = '0';
	popover.style.transform = 'scale(0)';
	container.appendChild(popover);

	// Position function — call after body content is added
	var positionPopover = mxUtils.bind(this, function()
	{
		var toolbarRect = this.toolbar.getBoundingClientRect();
		var btnRect = anchorBtn.getBoundingClientRect();
		var containerRect = container.getBoundingClientRect();
		var scrollLeft = container.scrollLeft;
		var scrollTop = container.scrollTop;

		var popoverWidth = popover.offsetWidth;
		var popoverHeight = popover.offsetHeight;
		var btnCenterX = btnRect.left + btnRect.width / 2 - containerRect.left + scrollLeft;
		var popX = btnCenterX - popoverWidth / 2;

		// Decide above/below from the room available on each side WITHIN the
		// container's visible viewport (not the window — the inline editor's
		// container can be shorter than the window). Prefer below; flip above
		// only when below does not fit and above is the roomier side.
		var spaceAbove = toolbarRect.top - containerRect.top;
		var spaceBelow = (containerRect.top + container.clientHeight) - toolbarRect.bottom;
		var fitsBelow = spaceBelow >= popoverHeight + 4;
		var fitsAbove = spaceAbove >= popoverHeight + 4;
		var showAbove = !fitsBelow && (fitsAbove || spaceAbove > spaceBelow);
		var popY;

		if (showAbove)
		{
			popY = toolbarRect.top - containerRect.top + scrollTop - popoverHeight - 2;

			// Move arrow to bottom
			var arrowBottom = Math.round(arrowOffset - arrowSize / 2);
			arrowBorder.style.top = '';
			arrowBorder.style.bottom = arrowBottom + 'px';
			arrowFill.style.top = '';
			arrowFill.style.bottom = (arrowBottom + 1) + 'px';
			body.style.marginTop = '0';
			body.style.marginBottom = arrowOffset + 'px';
		}
		else
		{
			popY = toolbarRect.bottom - containerRect.top + scrollTop + 2;

			// Arrow at the top (the popover is repositioned after changes)
			var arrowTop = Math.round(arrowOffset - arrowSize / 2);
			arrowBorder.style.bottom = '';
			arrowBorder.style.top = arrowTop + 'px';
			arrowFill.style.bottom = '';
			arrowFill.style.top = (arrowTop + 1) + 'px';
			body.style.marginTop = arrowOffset + 'px';
			body.style.marginBottom = '0';
		}

		// Clamp to the visible viewport so the popover is never clipped by a
		// container edge (e.g. the inline editor's top border).
		var unclampedY = popY;
		var clamped = this.clampToContainer(popX, popY, popoverWidth, popoverHeight);
		popX = clamped.x;
		popY = clamped.y;

		// In the degenerate case where the popover fits on neither side and the
		// clamp detaches it from the toolbar edge, the fixed arrow would point
		// at empty space — hide it rather than show a dangling pointer.
		arrowBorder.style.display = (popY != unclampedY) ? 'none' : '';
		arrowFill.style.display = arrowBorder.style.display;

		popover.style.left = Math.round(popX) + 'px';
		popover.style.top = Math.round(popY) + 'px';

		var arrowHalf = Math.round(arrowSize / 2);
		var arrowX = btnCenterX - popX - arrowHalf;
		arrowX = Math.max(14, Math.min(arrowX, popoverWidth - arrowSize - 14));
		arrowBorder.style.left = Math.round(arrowX) + 'px';
		arrowFill.style.left = Math.round(arrowX + 1) + 'px';

		var originX = Math.round(arrowX + arrowHalf);
		popover.style.transformOrigin = originX + 'px ' +
			(showAbove ? popoverHeight + 'px' : '0px');
	});

	// Animate in function — call after positioning
	var animateIn = mxUtils.bind(this, function()
	{
		popover.style.transition = 'transform ' + this.popoverAnimDuration +
			'ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity ' +
			Math.round(this.popoverAnimDuration * 0.5) + 'ms ease-out';

		popover.offsetHeight;
		popover.style.opacity = '1';
		popover.style.transform = 'scale(1)';
	});

	this.currentPopover = popover;
	this.currentPopoverAnchor = anchorBtn;
	this.positionPopover = positionPopover;

	// Close handlers
	this.popoverCloseHandler = mxUtils.bind(this, function(e)
	{
		var target = e.target || e.srcElement;
		var cw = this.editorUi.colorWindow;

		// Menus opened from the popover, such as the font menu
		var menu = this.editorUi.currentMenu;

		if (!mxEvent.isConsumed(e) && !popover.contains(target) &&
			!this.toolbar.contains(target) &&
			(this.currentSubPanel == null || !this.currentSubPanel.contains(target)) &&
			(cw == null || cw.window == null || !cw.window.div.contains(target)) &&
			(menu == null || menu.div == null || !menu.div.contains(target)))
		{
			this.hidePopover();
		}
	});

	this.popoverScrollHandler = mxUtils.bind(this, function()
	{
		this.hidePopover();
	});

	this.popoverKeyHandler = mxUtils.bind(this, function(e)
	{
		if (e.keyCode == 27)
		{
			this.hidePopover();
			mxEvent.consume(e);
		}
	});

	window.setTimeout(mxUtils.bind(this, function()
	{
		document.addEventListener('mousedown', this.popoverCloseHandler, true);
		container.addEventListener('scroll', this.popoverScrollHandler);
		document.addEventListener('keydown', this.popoverKeyHandler);
	}), 0);

	return {body: body, popover: popover, position: positionPopover, animateIn: animateIn};
};

/**
 * Builds a grid of icon items inside a body element.
 * Returns the grid element.
 */
InlineToolbar.prototype.buildIconGrid = function(body, items, activeIndex, callback)
{
	var itemSize = this.iconSize + 8;
	var cols = Math.min(this.popoverColumns, items.length);
	var grid = document.createElement('div');
	grid.style.display = 'grid';
	grid.style.gridTemplateColumns = 'repeat(' + cols + ', ' + itemSize + 'px)';
	grid.style.gap = '2px';

	for (var i = 0; i < items.length; i++)
	{
		if (items[i].separator && i > 0)
		{
			var sep = document.createElement('div');
			sep.style.gridColumn = '1 / -1';
			sep.style.height = '1px';
			sep.style.backgroundColor = 'light-dark(#d0d0d0, #505050)';
			sep.style.margin = '3px 0';
			grid.appendChild(sep);
		}

		var cell = document.createElement('div');
		cell.style.width = itemSize + 'px';
		cell.style.height = itemSize + 'px';
		cell.style.display = 'flex';
		cell.style.alignItems = 'center';
		cell.style.justifyContent = 'center';
		cell.style.borderRadius = '6px';
		cell.style.cursor = 'pointer';
		cell.style.position = 'relative';
		cell.style.boxSizing = 'border-box';
		cell.setAttribute('title', items[i].title);

		if (i == activeIndex)
		{
			cell.style.backgroundColor = 'light-dark(#e8f0fe, #3c4043)';
			cell.style.border = '2px solid light-dark(#1a73e8, #8ab4f8)';
		}

		var img = document.createElement('img');
		img.src = items[i].img;
		img.style.width = '20px';
		img.style.height = '20px';
		img.className = 'geAdaptiveAsset';
		cell.appendChild(img);

		(function(item, cellElt, idx)
		{
			mxEvent.addListener(cellElt, 'mouseenter', function()
			{
				if (idx != activeIndex)
				{
					cellElt.style.backgroundColor = 'light-dark(#f0f0f0, #4a4a4a)';
				}
			});

			mxEvent.addListener(cellElt, 'mouseleave', function()
			{
				if (idx != activeIndex)
				{
					cellElt.style.backgroundColor = '';
				}
			});

			mxEvent.addListener(cellElt, 'click', function(e)
			{
				callback(item);
				mxEvent.consume(e);
			});
		})(items[i], cell, i);

		grid.appendChild(cell);
	}

	body.appendChild(grid);

	return grid;
};

/**
 * Creates a clickable color swatch that opens the color picker for the
 * given style key and applies the chosen color to the given cells.
 * Picking a color (or closing the picker) hides the toolbar, matching
 * the behaviour of the other color swatches. The style key can be a
 * function that returns the key for a given cell. The optional post
 * function is called with the color and the cells in the same edit.
 */
InlineToolbar.prototype.createColorSwatch = function(title, currentColor, styleKey,
	defaultColorValue, post)
{
	var graph = this.graph;

	var getKey = function(cell)
	{
		return (typeof styleKey === 'function') ? styleKey(cell) : styleKey;
	};
	var swatch = document.createElement('div');
	swatch.style.width = '28px';
	swatch.style.height = '28px';
	swatch.style.borderRadius = '6px';
	swatch.style.border = '1px solid light-dark(#d0d0d0, #505050)';
	swatch.style.cursor = 'pointer';
	swatch.style.boxSizing = 'border-box';
	swatch.style.flexShrink = '0';
	swatch.setAttribute('title', title);

	var updateSwatch = function(color)
	{
		if (color == 'default')
		{
			color = defaultColorValue;
		}

		if (color == null || color == 'none')
		{
			swatch.style.background = 'linear-gradient(135deg, white 45%, red 45%, red 55%, white 55%)';
			swatch.style.backgroundColor = '';
		}
		else
		{
			var cssColor = mxUtils.getLightDarkColor(color);

			if (mxUtils.isLightDarkColor(color) &&
				cssColor.light != cssColor.dark)
			{
				swatch.style.background = 'linear-gradient(to right bottom, ' +
					cssColor.cssText + ' 50%, ' + mxUtils.invertLightDarkColor(cssColor).
					cssText + ' 50.3%)';
			}
			else
			{
				swatch.style.background = '';
				swatch.style.backgroundColor = cssColor.cssText;
			}
		}
	};

	updateSwatch(currentColor);

	this.addPopoverUpdate(mxUtils.bind(this, function(style)
	{
		updateSwatch(style[getKey(this.currentState.cell)]);
	}));

	mxEvent.addListener(swatch, 'click', mxUtils.bind(this, function(e)
	{
		// Reads the current selection's color for this style key. The color
		// picker is a non-modal window that stays open across selection
		// changes; passing this lets ColorWindow re-sync its swatch to the
		// new selection (it refreshes from getColorFn on selectionChange/
		// styleChanged), matching the Format panel and font color menus.
		var getColorFn = function()
		{
			var cell = graph.getSelectionCell();
			var cellStyle = (cell != null) ? graph.resolveInheritedLabelStyles(cell,
				graph.getCellStyle(cell, false)) : null;

			return (cellStyle != null) ? (cellStyle[getKey(cell)] || mxConstants.NONE) :
				mxConstants.NONE;
		};

		this.editorUi.pickColor(getColorFn(),
			mxUtils.bind(this, function(color)
			{
				// Apply to the live selection read at apply time, not the cells
				// captured when the swatch was built. Same reason as above:
				// the selection may have changed while the picker was open.
				var cells = this.editorUi.getSelectionState().cells;
				graph.stopEditing(false);
				graph.getModel().beginUpdate();

				try
				{
					for (var i = 0; i < cells.length; i++)
					{
						graph.setCellStyles(getKey(cells[i]), color, [cells[i]]);
					}

					if (post != null)
					{
						post(color, cells);
					}
				}
				finally
				{
					graph.getModel().endUpdate();
				}

				this.hide();
			}), 'default', defaultColorValue, null, title, getColorFn);

		var cw = this.editorUi.colorWindow;

		if (cw != null)
		{
			var hideListener = mxUtils.bind(this, function()
			{
				cw.window.removeListener(hideListener);
				this.hide();
			});

			cw.window.addListener(mxEvent.HIDE, hideListener);
		}

		mxEvent.consume(e);
	}));

	return swatch;
};

/**
 * Creates a text label for the rows of a popover.
 */
InlineToolbar.prototype.createLabel = function(text)
{
	var label = document.createElement('span');
	label.style.fontSize = '11px';
	label.style.color = 'light-dark(#333, #ccc)';
	label.style.whiteSpace = 'nowrap';
	label.style.overflow = 'hidden';
	label.style.textOverflow = 'ellipsis';
	mxUtils.write(label, text);

	return label;
};

/**
 * Creates a label with a color swatch (see createColorSwatch).
 */
InlineToolbar.prototype.createColorGroup = function(labelText, title, color,
	styleKey, defaultColorValue)
{
	var group = document.createElement('div');
	group.style.display = 'flex';
	group.style.alignItems = 'center';
	group.style.gap = '6px';
	group.appendChild(this.createLabel(labelText));
	group.appendChild(this.createColorSwatch(title, color, styleKey,
		defaultColorValue));

	return group;
};

/**
 * Creates the button of a dropdown. The first child of the button
 * shows the current value.
 */
InlineToolbar.prototype.createDropdownButton = function(title)
{
	var dropdown = document.createElement('div');
	dropdown.style.display = 'flex';
	dropdown.style.alignItems = 'center';
	dropdown.style.border = '1px solid light-dark(#d0d0d0, #505050)';
	dropdown.style.borderRadius = '6px';
	dropdown.style.height = '28px';
	dropdown.style.padding = '0 6px';
	dropdown.style.cursor = 'pointer';
	dropdown.style.gap = '4px';

	if (title != null)
	{
		dropdown.setAttribute('title', title);
	}

	var preview = document.createElement('div');
	preview.style.flex = '1';
	preview.style.display = 'flex';
	preview.style.alignItems = 'center';
	preview.style.minWidth = '0';
	dropdown.appendChild(preview);

	var chevron = document.createElement('span');
	chevron.style.fontSize = '8px';
	chevron.style.color = 'light-dark(#666, #999)';
	chevron.style.flexShrink = '0';
	chevron.innerHTML = '&#9660;';
	dropdown.appendChild(chevron);

	mxEvent.addListener(dropdown, 'mouseenter', function()
	{
		dropdown.style.backgroundColor = 'light-dark(#f0f0f0, #4a4a4a)';
	});

	mxEvent.addListener(dropdown, 'mouseleave', function()
	{
		dropdown.style.backgroundColor = '';
	});

	return dropdown;
};

/**
 * Creates a dropdown that lists the given items in a sub-panel below itself.
 * getActiveIndex returns the index of the item for the given style,
 * createContent returns the element that shows the given item and onSelect
 * applies the given item.
 */
InlineToolbar.prototype.createDropdown = function(title, items, getActiveIndex,
	createContent, onSelect)
{
	var dropdown = this.createDropdownButton(title);
	var preview = dropdown.firstChild;
	var activeIndex = -1;

	var update = function(style)
	{
		activeIndex = getActiveIndex(style);
		preview.innerHTML = '';

		if (activeIndex >= 0)
		{
			preview.appendChild(createContent(items[activeIndex]));
		}
	};

	update(this.getCurrentStyle());
	this.addPopoverUpdate(update);

	mxEvent.addListener(dropdown, 'click', mxUtils.bind(this, function(e)
	{
		// Toggle: close if already open for this dropdown
		var open = this.currentSubPanel != null &&
			this.currentSubPanel._ownerDropdown === dropdown;
		this.hideSubPanel();

		if (!open)
		{
			var container = this.graph.container;
			var panel = document.createElement('div');
			panel.style.position = 'absolute';
			panel.style.zIndex = 10;
			panel.style.boxSizing = 'border-box';
			panel.style.minWidth = dropdown.offsetWidth + 'px';
			panel.style.backgroundColor = 'light-dark(white, var(--dark-color))';
			panel.style.border = '1px solid light-dark(#d0d0d0, #505050)';
			panel.style.borderRadius = '12px';
			panel.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
			panel.style.padding = '4px';

			for (var i = 0; i < items.length; i++)
			{
				var row = document.createElement('div');
				row.style.display = 'flex';
				row.style.alignItems = 'center';
				row.style.padding = '4px 8px';
				row.style.borderRadius = '6px';
				row.style.cursor = 'pointer';
				row.setAttribute('title', items[i].label);

				if (i == activeIndex)
				{
					row.style.backgroundColor = 'light-dark(#e8f0fe, #3c4043)';
				}

				row.appendChild(createContent(items[i]));

				(function(item, rowElt, idx)
				{
					mxEvent.addListener(rowElt, 'mouseenter', function()
					{
						if (idx != activeIndex)
						{
							rowElt.style.backgroundColor = 'light-dark(#f0f0f0, #4a4a4a)';
						}
					});

					mxEvent.addListener(rowElt, 'mouseleave', function()
					{
						if (idx != activeIndex)
						{
							rowElt.style.backgroundColor = '';
						}
					});

					mxEvent.addListener(rowElt, 'click', mxUtils.bind(this, function(ce)
					{
						this.hideSubPanel();
						onSelect(item);
						mxEvent.consume(ce);
					}));
				}).call(this, items[i], row, i);

				panel.appendChild(row);
			}

			mxEvent.addListener(panel, 'mousedown', function(me)
			{
				mxEvent.consume(me);
			});

			container.appendChild(panel);
			this.currentSubPanel = panel;
			panel._ownerDropdown = dropdown;

			// Position below the dropdown, clamped to the visible viewport.
			var ddRect = dropdown.getBoundingClientRect();
			var containerRect = container.getBoundingClientRect();
			var clamped = this.clampToContainer(
				ddRect.left - containerRect.left + container.scrollLeft,
				ddRect.bottom - containerRect.top + container.scrollTop + 4,
				panel.offsetWidth, panel.offsetHeight);

			panel.style.left = Math.round(clamped.x) + 'px';
			panel.style.top = Math.round(clamped.y) + 'px';
		}

		mxEvent.consume(e);
	}));

	return dropdown;
};

/**
 * Creates a number input with a stepper for the value returned by getValue
 * for the given style. apply is called with a new value and true if the
 * value was changed by a step.
 */
InlineToolbar.prototype.createNumberInput = function(title, unit, min, max,
	getValue, apply)
{
	var graph = this.graph;
	var container = document.createElement('div');
	container.style.display = 'flex';
	container.style.alignItems = 'center';
	container.style.border = '1px solid light-dark(#d0d0d0, #505050)';
	container.style.borderRadius = '6px';
	container.style.height = '28px';
	container.style.overflow = 'hidden';
	container.setAttribute('title', title);

	var input = document.createElement('input');
	input.type = 'text';
	input.style.width = '40px';
	input.style.border = 'none';
	input.style.outline = 'none';
	input.style.textAlign = 'center';
	input.style.fontSize = '11px';
	input.style.padding = '0 2px';
	input.style.backgroundColor = 'transparent';
	input.style.color = 'inherit';

	var update = function(style)
	{
		if (document.activeElement != input)
		{
			input.value = getValue(style) + ' ' + unit;
		}
	};

	update(this.getCurrentStyle());
	this.addPopoverUpdate(update);

	var changed = false;

	var applyValue = function(val, stepped)
	{
		val = Math.max(min, Math.min(max, parseFloat(val) || 0));
		input.value = val + ' ' + unit;
		changed = false;
		graph.stopEditing(false);
		apply(val, stepped);
	};

	// Applies typed values only so that selected cells with different
	// values, which show the default value, keep their values
	var commit = mxUtils.bind(this, function()
	{
		if (changed)
		{
			applyValue(input.value, false);
		}
		else if (this.currentCells != null)
		{
			input.value = getValue(this.getCurrentStyle()) + ' ' + unit;
		}
	});

	var step = function(delta)
	{
		applyValue((parseFloat(input.value) || 0) + delta, true);
	};

	mxEvent.addListener(input, 'focus', function()
	{
		input.value = parseFloat(input.value) || 0;
		input.select();
	});

	mxEvent.addListener(input, 'input', function()
	{
		changed = true;
	});

	mxEvent.addListener(input, 'blur', commit);

	mxEvent.addListener(input, 'keydown', function(e)
	{
		if (e.keyCode == 13)
		{
			commit();
			input.blur();
		}
		else if (e.keyCode == 38)
		{
			step(1);
			e.preventDefault();
		}
		else if (e.keyCode == 40)
		{
			step(-1);
			e.preventDefault();
		}
	});

	container.appendChild(input);

	// Stepper buttons
	var stepperDiv = document.createElement('div');
	stepperDiv.style.display = 'flex';
	stepperDiv.style.flexDirection = 'column';
	stepperDiv.style.borderLeft = '1px solid light-dark(#d0d0d0, #505050)';

	var createStepButton = function(html, delta)
	{
		var btn = document.createElement('div');
		btn.innerHTML = html;
		btn.style.fontSize = '7px';
		btn.style.lineHeight = '14px';
		btn.style.textAlign = 'center';
		btn.style.cursor = 'pointer';
		btn.style.width = '16px';
		btn.style.userSelect = 'none';

		mxEvent.addListener(btn, 'click', function(e)
		{
			step(delta);
			mxEvent.consume(e);
		});

		stepperDiv.appendChild(btn);
	};

	createStepButton('&#9650;', 1);
	createStepButton('&#9660;', -1);
	container.appendChild(stepperDiv);

	return container;
};

/**
 * Creates a button with the given image for the rows of a popover that is
 * highlighted if isSelected returns true for the style of the cell.
 */
InlineToolbar.prototype.createToggleButton = function(title, image, isSelected, fn)
{
	var btn = document.createElement('div');
	btn.style.width = '28px';
	btn.style.height = '28px';
	btn.style.display = 'flex';
	btn.style.alignItems = 'center';
	btn.style.justifyContent = 'center';
	btn.style.borderRadius = '6px';
	btn.style.cursor = 'pointer';
	btn.style.flexShrink = '0';
	btn.setAttribute('title', title);

	var img = document.createElement('img');
	img.src = image;
	img.style.width = '18px';
	img.style.height = '18px';
	img.className = 'geAdaptiveAsset';
	btn.appendChild(img);

	var selected = false;

	var update = function(style)
	{
		selected = isSelected(style);
		btn.style.backgroundColor = (selected) ? 'light-dark(#e8f0fe, #3c4043)' : '';
	};

	update(this.getCurrentStyle());
	this.addPopoverUpdate(update);

	mxEvent.addListener(btn, 'mouseenter', function()
	{
		if (!selected)
		{
			btn.style.backgroundColor = 'light-dark(#f0f0f0, #4a4a4a)';
		}
	});

	mxEvent.addListener(btn, 'mouseleave', function()
	{
		if (!selected)
		{
			btn.style.backgroundColor = '';
		}
	});

	mxEvent.addListener(btn, 'click', function(e)
	{
		fn();
		mxEvent.consume(e);
	});

	return btn;
};

/**
 * Shows the line style popover: dash pattern, stroke width, stroke color
 * and, for edge shapes that support them, fill and gradient color.
 */
InlineToolbar.prototype.showLineStyleMenu = function(evt)
{
	this.editorUi.hideCurrentMenu();

	if (this.currentState == null)
	{
		return;
	}

	var graph = this.graph;
	var style = this.getCurrentStyle();
	var cells = graph.getSelectionCells();

	var p = this.createPopover(this.lineStyleBtn, {persistOnClick: true});
	var body = p.body;

	// Row 1: Dash pattern dropdown
	var dashItems = [
		{label: mxResources.get('solid'), values: [null, null], pattern: null},
		{label: mxResources.get('dashed') + ' (1)', values: ['1', null], pattern: '8 4'},
		{label: mxResources.get('dashed') + ' (2)', values: ['1', '8 8'], pattern: '8 8'},
		{label: mxResources.get('dashed') + ' (3)', values: ['1', '12 12'], pattern: '12 12'},
		{label: mxResources.get('dashed') + ' (4)', values: ['1', '8 4 1 4'], pattern: '8 4 1 4'},
		{label: mxResources.get('dotted') + ' (1)', values: ['1', '1 1'], pattern: '1 1'},
		{label: mxResources.get('dotted') + ' (2)', values: ['1', '1 2'], pattern: '1 2'},
		{label: mxResources.get('dotted') + ' (3)', values: ['1', '1 4'], pattern: '1 4'}
	];

	// Helper to create an SVG dash preview image
	var previewWidth = 80;

	var createDashPreview = function(item)
	{
		var da = (item.pattern != null) ? ' stroke-dasharray="' + item.pattern + '"' : '';
		var svgImg = Graph.createSvgImage(previewWidth, 2,
			'<line x1="0" y1="1" x2="' + previewWidth + '" y2="1" stroke="black" stroke-width="2"' +
			da + '/>', previewWidth, 2);
		var img = document.createElement('img');
		img.src = svgImg.src;
		img.style.width = previewWidth + 'px';
		img.style.height = '2px';
		img.className = 'geAdaptiveAsset';

		return img;
	};

	var dashDropdown = this.createDropdown(mxResources.get('pattern'), dashItems,
		function(style)
		{
			var dashed = mxUtils.getValue(style, mxConstants.STYLE_DASHED, null);
			var dashPattern = mxUtils.getValue(style, mxConstants.STYLE_DASH_PATTERN, null);

			for (var i = 0; i < dashItems.length; i++)
			{
				var dv = dashItems[i].values[0];
				var pv = dashItems[i].values[1];

				if ((dv == null ? null : String(dv)) == (dashed == null ? null : String(dashed)) &&
					(pv == null ? null : String(pv)) == (dashPattern == null ? null : String(dashPattern)))
				{
					return i;
				}
			}

			return 0;
		}, createDashPreview, function(item)
		{
			graph.stopEditing(false);
			graph.getModel().beginUpdate();

			try
			{
				graph.setCellStyles(mxConstants.STYLE_DASHED, item.values[0], cells);
				graph.setCellStyles(mxConstants.STYLE_DASH_PATTERN, item.values[1], cells);
			}
			finally
			{
				graph.getModel().endUpdate();
			}
		});

	dashDropdown.style.marginBottom = '8px';
	body.appendChild(dashDropdown);

	// Row 2: Stroke width + color
	var row2 = document.createElement('div');
	row2.style.display = 'flex';
	row2.style.alignItems = 'center';
	row2.style.gap = '8px';

	row2.appendChild(this.createNumberInput(mxResources.get('linewidth'), 'pt', 0, 999,
		function(style)
		{
			return parseFloat(mxUtils.getValue(style, mxConstants.STYLE_STROKEWIDTH, '1'));
		}, function(value)
		{
			graph.setCellStyles(mxConstants.STYLE_STROKEWIDTH, value, cells);
		}));

	// Stroke color swatch (the border of images)
	var strokeKey = (style[mxConstants.STYLE_SHAPE] == 'image') ?
		mxConstants.STYLE_IMAGE_BORDER : mxConstants.STYLE_STROKECOLOR;
	row2.appendChild(this.createColorSwatch(mxResources.get('strokeColor'),
		mxUtils.getValue(style, strokeKey, null), strokeKey,
		graph.shapeForegroundColor));
	body.appendChild(row2);

	// Row 3: Fill and gradient color, shown only for edge shapes that
	// support them (filled edge, flex arrow, arrow, pipe, wire, …).
	// Vertices have a fill popover.
	if (this.isEdgeSelection() && this.isFillSelection())
	{
		var fillColor = mxUtils.getValue(style, mxConstants.STYLE_FILLCOLOR, null);
		var row3 = document.createElement('div');
		row3.style.display = 'flex';
		row3.style.alignItems = 'center';
		row3.style.gap = '14px';
		row3.style.marginTop = '8px';
		row3.appendChild(this.createColorGroup(mxResources.get('fill'),
			mxResources.get('fillColor'), fillColor, mxConstants.STYLE_FILLCOLOR,
			graph.shapeBackgroundColor));

		// Gradient needs a fill color and a shape that supports gradients
		// (excludes wire/pipe).
		if (this.isFillSelection(true) && fillColor != null &&
			fillColor != mxConstants.NONE)
		{
			row3.appendChild(this.createColorGroup(mxResources.get('gradient'),
				mxResources.get('gradientColor'), mxUtils.getValue(style,
				mxConstants.STYLE_GRADIENTCOLOR, null), mxConstants.STYLE_GRADIENTCOLOR,
				graph.shapeForegroundColor));
		}

		body.appendChild(row3);
	}

	// Position and animate
	p.position();
	p.animateIn();
};

/**
 * Shows the fill popover of vertices: fill and gradient color, gradient
 * direction and fill pattern (see StyleFormatPanel.addFill).
 */
InlineToolbar.prototype.showFillMenu = function(evt)
{
	this.editorUi.hideCurrentMenu();

	if (this.currentState == null)
	{
		return;
	}

	var ui = this.editorUi;
	var graph = this.graph;
	var style = this.getCurrentStyle();
	var image = style[mxConstants.STYLE_SHAPE] == 'image';
	var gradient = !image && this.isFillSelection(true);

	// Tables and rows without a title are filled with the lane color
	var fillKey = (image) ? mxConstants.STYLE_IMAGE_BACKGROUND : function(cell)
	{
		return graph.getFillColorKey(cell);
	};

	// Key of the fill in the style of the first cell
	var fillKeyName = (image) ? fillKey : fillKey(this.currentState.cell);

	var p = this.createPopover(this.fillBtn, {persistOnClick: true});
	var body = p.body;

	// Row 1: Fill and gradient color
	var colorRow = document.createElement('div');
	colorRow.style.display = 'flex';
	colorRow.style.alignItems = 'center';
	colorRow.style.gap = '14px';
	colorRow.appendChild(this.createColorGroup(mxResources.get('fill'),
		mxResources.get('fillColor'), mxUtils.getValue(style, fillKeyName, null),
		fillKey, graph.getDefaultColor(style, fillKeyName, graph.shapeBackgroundColor)));

	var gradientGroup = this.createColorGroup(mxResources.get('gradient'),
		mxResources.get('gradientColor'), mxUtils.getValue(style,
		mxConstants.STYLE_GRADIENTCOLOR, null), mxConstants.STYLE_GRADIENTCOLOR,
		graph.getDefaultColor(style, mxConstants.STYLE_GRADIENTCOLOR,
		graph.shapeForegroundColor));
	colorRow.appendChild(gradientGroup);
	body.appendChild(colorRow);

	var createLabel = mxUtils.bind(this, function(item)
	{
		return this.createLabel(item.label);
	});

	var applyStyle = function(key, value)
	{
		ui.menus.createStyleChangeFunction([key], [value])();
	};

	// Rows 2 and 3 with aligned labels
	var grid = document.createElement('div');
	grid.style.display = 'grid';
	grid.style.gridTemplateColumns = 'auto 1fr';
	grid.style.alignItems = 'center';
	grid.style.gap = '8px 6px';
	grid.style.marginTop = '8px';
	body.appendChild(grid);

	// Row 2: Gradient direction
	var directions = [mxConstants.DIRECTION_NORTH, mxConstants.DIRECTION_EAST,
		mxConstants.DIRECTION_SOUTH, mxConstants.DIRECTION_WEST,
		mxConstants.DIRECTION_RADIAL];
	var directionItems = [];

	for (var i = 0; i < directions.length; i++)
	{
		directionItems.push({label: mxResources.get(directions[i]), value: directions[i]});
	}

	var directionDropdown = this.createDropdown(mxResources.get('direction'),
		directionItems, function(style)
		{
			// Empty values are south (see StyleFormatPanel.addFill)
			var index = mxUtils.indexOf(directions, mxUtils.getValue(style,
				mxConstants.STYLE_GRADIENT_DIRECTION, mxConstants.DIRECTION_SOUTH));

			return (index >= 0) ? index : 2;
		}, createLabel, function(item)
		{
			applyStyle(mxConstants.STYLE_GRADIENT_DIRECTION, item.value);
		});

	var directionLabel = this.createLabel(mxResources.get('direction'));
	grid.appendChild(directionLabel);
	grid.appendChild(directionDropdown);

	// Row 3: Fill pattern
	var fillStyles = (style['sketch'] == '1') ? Editor.roughFillStyles : Editor.fillStyles;
	var patternItems = [];

	for (var i = 0; i < fillStyles.length; i++)
	{
		patternItems.push({label: mxResources.get(fillStyles[i].res), value: fillStyles[i].val});
	}

	var patternDropdown = this.createDropdown(mxResources.get('pattern'),
		patternItems, function(style)
		{
			var value = mxUtils.getValue(style, 'fillStyle', 'auto');

			for (var i = 0; i < patternItems.length; i++)
			{
				if (patternItems[i].value == value)
				{
					return i;
				}
			}

			// Automatic if the pattern is not in the list
			return 0;
		}, createLabel, function(item)
		{
			applyStyle('fillStyle', item.value);
		});

	var patternLabel = this.createLabel(mxResources.get('pattern'));
	grid.appendChild(patternLabel);
	grid.appendChild(patternDropdown);

	// Shows the options for the current fill (see StyleFormatPanel.addFill)
	var update = function(style)
	{
		var fillColor = mxUtils.getValue(style, fillKeyName, null);
		var gradientColor = mxUtils.getValue(style, mxConstants.STYLE_GRADIENTCOLOR, null);
		var fillStyle = mxUtils.getValue(style, 'fillStyle', 'auto');
		var sketch = style['sketch'] == '1';
		var filled = gradient && fillColor != null && fillColor != mxConstants.NONE;
		var showGradient = filled && (!sketch || fillStyle == 'solid' || fillStyle == 'auto');

		var showDirection = showGradient && gradientColor != null &&
			gradientColor != mxConstants.NONE;
		var showPattern = filled && (sketch || gradientColor == null ||
			gradientColor == mxConstants.NONE);

		gradientGroup.style.display = (showGradient) ? 'flex' : 'none';
		directionLabel.style.display = (showDirection) ? '' : 'none';
		directionDropdown.style.display = (showDirection) ? 'flex' : 'none';
		patternLabel.style.display = (showPattern) ? '' : 'none';
		patternDropdown.style.display = (showPattern) ? 'flex' : 'none';
		grid.style.display = (showDirection || showPattern) ? 'grid' : 'none';
	};

	update(style);
	this.addPopoverUpdate(update);

	// Position and animate
	p.position();
	p.animateIn();
};

/**
 * Shows the text popover: font family, size and color, font style and
 * horizontal alignment of the label (see TextFormatPanel.addFont).
 */
InlineToolbar.prototype.showTextMenu = function(evt)
{
	this.editorUi.hideCurrentMenu();

	if (this.currentState == null)
	{
		return;
	}

	var ui = this.editorUi;
	var graph = this.graph;
	var style = this.getCurrentStyle();

	var p = this.createPopover(this.textBtn, {persistOnClick: true});
	var body = p.body;

	// Row 1: Font family, opens the font menu
	if (style[mxConstants.STYLE_FONTFAMILY] != 'inherit')
	{
		var fontDropdown = this.createDropdownButton(mxResources.get('fontFamily'));
		fontDropdown.style.marginBottom = '8px';

		var updateFont = mxUtils.bind(this, function(style)
		{
			var preview = fontDropdown.firstChild;
			var label = this.createLabel(mxUtils.getValue(style,
				mxConstants.STYLE_FONTFAMILY, Menus.prototype.defaultFont));

			// Long font names do not widen the popover
			label.style.maxWidth = '140px';
			preview.innerHTML = '';
			preview.appendChild(label);
		});

		updateFont(style);
		this.addPopoverUpdate(updateFont);

		mxEvent.addListener(fontDropdown, 'click', mxUtils.bind(this, function(e)
		{
			var rect = fontDropdown.getBoundingClientRect();
			var origin = mxUtils.getDocumentScrollOrigin(document);
			this.hideSubPanel();

			ui.showPopupMenu(function(menu, parent)
			{
				ui.menus.get('fontFamily').funct(menu, parent);
			}, rect.left + origin.x, rect.bottom + origin.y + 4, e);

			mxEvent.consume(e);
		}));

		body.appendChild(fontDropdown);
	}

	// Row 2: Font size and color
	var row2 = document.createElement('div');
	row2.style.display = 'flex';
	row2.style.alignItems = 'center';
	row2.style.gap = '8px';

	if (style[mxConstants.STYLE_FONTSIZE] != 'inherit')
	{
		row2.appendChild(this.createNumberInput(mxResources.get('fontSize'),
			Editor.fontSizeUnit, 1, 999, function(style)
			{
				return parseFloat(mxUtils.getValue(style, mxConstants.STYLE_FONTSIZE,
					Menus.prototype.defaultFontSize));
			}, function(value, stepped)
			{
				// Same as the font size in the Format panel (see installInputHandler)
				graph.getModel().beginUpdate();

				try
				{
					var cells = graph.getEditableCells(graph.getSelectionCells());

					// Steps keep the size of parts of HTML labels relative to the label
					if (stepped)
					{
						graph.changeFontSize(cells, function()
						{
							return value;
						});
					}
					else
					{
						graph.setCellStyles(mxConstants.STYLE_FONTSIZE, value, cells);
						graph.updateLabelElements(cells, function(elt)
						{
							elt.removeAttribute('size');
							elt.style.fontSize = '';

							if (elt.getAttribute('style') == '')
							{
								elt.removeAttribute('style');
							}
						});
					}

					for (var i = 0; i < cells.length; i++)
					{
						if (graph.model.getChildCount(cells[i]) == 0)
						{
							graph.autoSizeCell(cells[i], false);
						}
					}
				}
				finally
				{
					graph.getModel().endUpdate();
				}
			}));
	}

	if (style[mxConstants.STYLE_FONTCOLOR] != 'inherit')
	{
		row2.appendChild(this.createColorSwatch(mxResources.get('fontColor'),
			mxUtils.getValue(style, mxConstants.STYLE_FONTCOLOR, null),
			mxConstants.STYLE_FONTCOLOR, graph.shapeForegroundColor,
			function(color, cells)
			{
				// Same as the font color in the Format panel
				graph.setCellStyles(mxConstants.STYLE_NOLABEL,
					(color == mxConstants.NONE) ? '1' : null, cells);
				graph.updateLabelElements(cells, function(elt)
				{
					elt.removeAttribute('color');
					elt.style.color = null;
				});
			}));
	}

	// Row 3: Bold, italic, underline and alignment
	var row3 = document.createElement('div');
	row3.style.display = 'flex';
	row3.style.alignItems = 'center';
	row3.style.gap = '2px';

	if (row2.firstChild != null)
	{
		row3.style.marginTop = '8px';
		body.appendChild(row2);
	}

	var addFontStyle = mxUtils.bind(this, function(name, image, flag)
	{
		var action = ui.actions.get(name);

		row3.appendChild(this.createToggleButton(mxResources.get(name) +
			' (' + action.shortcut + ')', image, function(style)
			{
				var fontStyle = parseInt(mxUtils.getValue(style,
					mxConstants.STYLE_FONTSTYLE, 0));

				return (fontStyle & flag) == flag;
			}, function()
			{
				action.funct();
			}));
	});

	var addAlign = mxUtils.bind(this, function(name, image, align)
	{
		row3.appendChild(this.createToggleButton(mxResources.get(name), image,
			function(style)
			{
				return mxUtils.getValue(style, mxConstants.STYLE_ALIGN,
					mxConstants.ALIGN_CENTER) == align;
			}, function()
			{
				ui.menus.createStyleChangeFunction([mxConstants.STYLE_ALIGN], [align])();
			}));
	});

	addFontStyle('bold', Editor.boldImage, mxConstants.FONT_BOLD);
	addFontStyle('italic', Editor.italicImage, mxConstants.FONT_ITALIC);
	addFontStyle('underline', Editor.underlineImage, mxConstants.FONT_UNDERLINE);
	addAlign('left', Editor.alignLeftImage, mxConstants.ALIGN_LEFT);
	addAlign('center', Editor.alignCenterImage, mxConstants.ALIGN_CENTER);
	addAlign('right', Editor.alignRightImage, mxConstants.ALIGN_RIGHT);

	// Separates the font style from the alignment
	row3.childNodes[3].style.marginLeft = '8px';
	body.appendChild(row3);

	// Position and animate
	p.position();
	p.animateIn();
};

/**
 * Shows the line endings popover: start/end arrow marker dropdowns.
 */
InlineToolbar.prototype.showLineEndMenu = function(evt)
{
	this.editorUi.hideCurrentMenu();

	if (this.currentState == null)
	{
		return;
	}

	var graph = this.graph;
	var style = this.getCurrentStyle();
	var shape = mxUtils.getValue(style, mxConstants.STYLE_SHAPE, null);
	var cells = graph.getSelectionCells();

	var p = this.createPopover(this.lineEndBtn, {persistOnClick: true});
	var body = p.body;

	// Title
	var title = document.createElement('div');
	title.style.fontWeight = 'bold';
	title.style.fontSize = '12px';
	title.style.marginBottom = '8px';
	title.style.color = 'light-dark(#333, #ccc)';
	mxUtils.write(title, mxResources.get('lineend'));
	body.appendChild(title);

	// Build marker items list based on shape
	var buildMarkerItems = mxUtils.bind(this, function()
	{
		var items = [];

		items.push({marker: mxConstants.NONE, fill: 0, img: Format.noMarkerImage.src,
			title: mxResources.get('none')});

		if (shape == 'connector' || shape == 'filledEdge' ||
			shape == 'wire' || shape == 'pipe' ||
			shape == 'mxgraph.basic.arc' || shape == null)
		{
			items.push({marker: mxConstants.ARROW_CLASSIC, fill: 1, img: Format.classicFilledMarkerImage.src});
			items.push({marker: mxConstants.ARROW_CLASSIC_THIN, fill: 1, img: Format.classicThinFilledMarkerImage.src});
			items.push({marker: mxConstants.ARROW_OPEN, fill: 0, img: Format.openFilledMarkerImage.src});
			items.push({marker: mxConstants.ARROW_OPEN_THIN, fill: 0, img: Format.openThinFilledMarkerImage.src});
			items.push({marker: 'openAsync', fill: 0, img: Format.openAsyncFilledMarkerImage.src});
			items.push({marker: mxConstants.ARROW_BLOCK, fill: 1, img: Format.blockFilledMarkerImage.src});
			items.push({marker: mxConstants.ARROW_BLOCK_THIN, fill: 1, img: Format.blockThinFilledMarkerImage.src});
			items.push({marker: 'async', fill: 1, img: Format.asyncFilledMarkerImage.src});
			items.push({marker: mxConstants.ARROW_OVAL, fill: 1, img: Format.ovalFilledMarkerImage.src});
			items.push({marker: mxConstants.ARROW_DIAMOND, fill: 1, img: Format.diamondFilledMarkerImage.src});
			items.push({marker: mxConstants.ARROW_DIAMOND_THIN, fill: 1, img: Format.diamondThinFilledMarkerImage.src});
			items.push({marker: mxConstants.ARROW_CLASSIC, fill: 0, img: Format.classicMarkerImage.src});
			items.push({marker: mxConstants.ARROW_CLASSIC_THIN, fill: 0, img: Format.classicThinMarkerImage.src});
			items.push({marker: mxConstants.ARROW_BLOCK, fill: 0, img: Format.blockMarkerImage.src});
			items.push({marker: mxConstants.ARROW_BLOCK_THIN, fill: 0, img: Format.blockThinMarkerImage.src});
			items.push({marker: 'async', fill: 0, img: Format.asyncMarkerImage.src});
			items.push({marker: mxConstants.ARROW_OVAL, fill: 0, img: Format.ovalMarkerImage.src});
			items.push({marker: mxConstants.ARROW_DIAMOND, fill: 0, img: Format.diamondMarkerImage.src});
			items.push({marker: mxConstants.ARROW_DIAMOND_THIN, fill: 0, img: Format.diamondThinMarkerImage.src});
			items.push({marker: 'box', fill: 0, img: Format.boxMarkerImage.src});
			items.push({marker: 'halfCircle', fill: 0, img: Format.halfCircleMarkerImage.src});
			items.push({marker: 'dash', fill: 0, img: Format.dashMarkerImage.src});
			items.push({marker: 'cross', fill: 0, img: Format.crossMarkerImage.src});
			items.push({marker: 'circlePlus', fill: 0, img: Format.circlePlusMarkerImage.src});
			items.push({marker: 'circle', fill: 1, img: Format.circleMarkerImage.src});
			items.push({marker: 'baseDash', fill: 0, img: Format.baseDashMarkerImage.src});
			items.push({marker: 'ERone', fill: 0, img: Format.EROneMarkerImage.src});
			items.push({marker: 'ERmandOne', fill: 0, img: Format.ERmandOneMarkerImage.src});
			items.push({marker: 'ERmany', fill: 0, img: Format.ERmanyMarkerImage.src});
			items.push({marker: 'ERoneToMany', fill: 0, img: Format.ERoneToManyMarkerImage.src});
			items.push({marker: 'ERzeroToOne', fill: 0, img: Format.ERzeroToOneMarkerImage.src});
			items.push({marker: 'ERzeroToMany', fill: 0, img: Format.ERzeroToManyMarkerImage.src});
			items.push({marker: 'doubleBlock', fill: 0, img: Format.doubleBlockMarkerImage.src});
			items.push({marker: 'doubleBlock', fill: 1, img: Format.doubleBlockFilledMarkerImage.src});
		}
		else if (shape == 'flexArrow')
		{
			items.push({marker: mxConstants.ARROW_BLOCK, fill: 0, img: Format.blockMarkerImage.src,
				title: mxResources.get('block')});
		}

		return items;
	});

	var markerItems = buildMarkerItems();

	// Create dropdown button for a marker (start or end)
	var createMarkerDropdown = mxUtils.bind(this, function(prefix)
	{
		var arrowKey = (prefix == 'start') ? mxConstants.STYLE_STARTARROW : mxConstants.STYLE_ENDARROW;
		var fillKey = prefix + 'Fill';
		var currentMarker = mxUtils.getValue(style, arrowKey, mxConstants.NONE);
		var currentFill = mxUtils.getValue(style, fillKey, '1');

		var dropdown = document.createElement('div');
		dropdown.style.display = 'flex';
		dropdown.style.alignItems = 'center';
		dropdown.style.border = '1px solid light-dark(#d0d0d0, #505050)';
		dropdown.style.borderRadius = '6px';
		dropdown.style.height = '32px';
		dropdown.style.padding = '0 6px';
		dropdown.style.cursor = 'pointer';
		dropdown.style.flex = '1';
		dropdown.style.minWidth = '0';
		dropdown.style.gap = '4px';

		// Preview container
		var preview = document.createElement('div');
		preview.style.flex = '1';
		preview.style.display = 'flex';
		preview.style.alignItems = 'center';
		preview.style.justifyContent = 'center';
		preview.style.minWidth = '0';

		var updatePreview = function()
		{
			preview.innerHTML = '';

			var src = null;

			if (currentMarker != mxConstants.NONE && currentMarker != null)
			{
				// Find matching item to get the image
				for (var i = 0; i < markerItems.length; i++)
				{
					if (markerItems[i].marker == currentMarker &&
						String(markerItems[i].fill) == String(currentFill))
					{
						src = markerItems[i].img;
						break;
					}
				}

				// Fallback: try without fill match
				if (src == null)
				{
					for (var i = 0; i < markerItems.length; i++)
					{
						if (markerItems[i].marker == currentMarker)
						{
							src = markerItems[i].img;
							break;
						}
					}
				}
			}

			if (src != null)
			{
				var img = document.createElement('img');
				img.src = src;
				img.style.height = '16px';
				img.className = 'geAdaptiveAsset';

				if (prefix == 'end')
				{
					img.style.transform = 'scaleX(-1)';
				}

				preview.appendChild(img);
			}
			else
			{
				var noneText = document.createElement('span');
				noneText.style.fontSize = '11px';
				noneText.style.color = 'light-dark(#666, #999)';
				mxUtils.write(noneText, mxResources.get('none'));
				preview.appendChild(noneText);
			}
		};

		updatePreview();
		dropdown.appendChild(preview);

		// Chevron
		var chevron = document.createElement('span');
		chevron.style.fontSize = '8px';
		chevron.style.color = 'light-dark(#666, #999)';
		chevron.style.flexShrink = '0';
		chevron.innerHTML = '&#9660;';
		dropdown.appendChild(chevron);

		// Hover effect
		mxEvent.addListener(dropdown, 'mouseenter', function()
		{
			dropdown.style.backgroundColor = 'light-dark(#f0f0f0, #4a4a4a)';
		});

		mxEvent.addListener(dropdown, 'mouseleave', function()
		{
			dropdown.style.backgroundColor = '';
		});

		// Click toggles sub-panel
		mxEvent.addListener(dropdown, 'click', mxUtils.bind(this, function(e)
		{
			// Toggle: close if already open for this dropdown
			if (this.currentSubPanel != null && this.currentSubPanel._ownerDropdown === dropdown)
			{
				if (this.currentSubPanel.parentNode != null)
				{
					this.currentSubPanel.parentNode.removeChild(this.currentSubPanel);
				}

				this.currentSubPanel = null;
				mxEvent.consume(e);

				return;
			}

			this.showMarkerSubPanel(dropdown, prefix, markerItems, currentMarker,
				currentFill, cells, shape, function(marker, fill)
			{
				currentMarker = marker;
				currentFill = fill;
				updatePreview();
			});

			mxEvent.consume(e);
		}));

		return dropdown;
	});

	// Dropdown row
	var dropdownRow = document.createElement('div');
	dropdownRow.style.display = 'flex';
	dropdownRow.style.gap = '8px';
	dropdownRow.appendChild(createMarkerDropdown('start'));
	dropdownRow.appendChild(createMarkerDropdown('end'));
	body.appendChild(dropdownRow);

	// Position and animate
	p.position();
	p.animateIn();
};

/**
 * Opens a sub-panel grid of marker icons below the given dropdown.
 */
InlineToolbar.prototype.showMarkerSubPanel = function(dropdown, prefix, items, currentMarker,
	currentFill, cells, shape, onSelect)
{
	// Close existing sub-panel
	if (this.currentSubPanel != null && this.currentSubPanel.parentNode != null)
	{
		this.currentSubPanel.parentNode.removeChild(this.currentSubPanel);
		this.currentSubPanel = null;
	}

	var graph = this.graph;
	var container = graph.container;
	var arrowKey = (prefix == 'start') ? mxConstants.STYLE_STARTARROW : mxConstants.STYLE_ENDARROW;
	var fillKey = prefix + 'Fill';
	var itemSize = this.iconSize + 8;
	var cols = this.popoverColumns;

	var panel = document.createElement('div');
	panel.style.position = 'absolute';
	panel.style.zIndex = 10;
	panel.style.backgroundColor = 'light-dark(white, var(--dark-color))';
	panel.style.border = '1px solid light-dark(#d0d0d0, #505050)';
	panel.style.borderRadius = '12px';
	panel.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
	panel.style.padding = '8px';

	// Determine active index
	var activeIndex = -1;

	for (var i = 0; i < items.length; i++)
	{
		if (items[i].marker == currentMarker &&
			String(items[i].fill) == String(currentFill))
		{
			activeIndex = i;
			break;
		}
	}

	// No-marker selected and first item is "none"
	if (activeIndex == -1 && (currentMarker == mxConstants.NONE || currentMarker == null))
	{
		activeIndex = 0;
	}

	var grid = document.createElement('div');
	grid.style.display = 'grid';
	grid.style.gridTemplateColumns = 'repeat(' + cols + ', ' + itemSize + 'px)';
	grid.style.gap = '2px';

	for (var i = 0; i < items.length; i++)
	{
		var cell = document.createElement('div');
		cell.style.width = itemSize + 'px';
		cell.style.height = itemSize + 'px';
		cell.style.display = 'flex';
		cell.style.alignItems = 'center';
		cell.style.justifyContent = 'center';
		cell.style.borderRadius = '6px';
		cell.style.cursor = 'pointer';
		cell.style.boxSizing = 'border-box';

		if (items[i].title != null)
		{
			cell.setAttribute('title', items[i].title);
		}

		if (i == activeIndex)
		{
			cell.style.backgroundColor = 'light-dark(#e8f0fe, #3c4043)';
			cell.style.border = '2px solid light-dark(#1a73e8, #8ab4f8)';
		}

		var img = document.createElement('img');
		img.src = items[i].img;
		img.style.width = '20px';
		img.style.height = '20px';
		img.className = 'geAdaptiveAsset';

		if (prefix == 'end')
		{
			img.style.transform = 'scaleX(-1)';
		}

		cell.appendChild(img);

		(function(item, cellElt, idx)
		{
			mxEvent.addListener(cellElt, 'mouseenter', function()
			{
				if (idx != activeIndex)
				{
					cellElt.style.backgroundColor = 'light-dark(#f0f0f0, #4a4a4a)';
				}
			});

			mxEvent.addListener(cellElt, 'mouseleave', function()
			{
				if (idx != activeIndex)
				{
					cellElt.style.backgroundColor = '';
				}
			});

			mxEvent.addListener(cellElt, 'click', mxUtils.bind(this, function(e)
			{
				graph.stopEditing(false);

				// Reports the new styles like an arrange action (see
				// Graph.beginArrange): the arrow sets the jetty of a
				// jettySize=auto end
				var arrange = graph.beginArrange();

				try
				{
					graph.setCellStyles(arrowKey, item.marker, cells);
					graph.setCellStyles(fillKey, item.fill, cells);
				}
				finally
				{
					graph.endArrange(arrange);
				}

				onSelect(item.marker, String(item.fill));

				// Close sub-panel
				if (panel.parentNode != null)
				{
					panel.parentNode.removeChild(panel);
				}

				this.currentSubPanel = null;
				mxEvent.consume(e);
			}));
		}).call(this, items[i], cell, i);

		grid.appendChild(cell);
	}

	panel.appendChild(grid);

	// Prevent mousedown from bubbling
	mxEvent.addListener(panel, 'mousedown', function(e)
	{
		mxEvent.consume(e);
	});

	container.appendChild(panel);
	this.currentSubPanel = panel;
	panel._ownerDropdown = dropdown;

	// Position below the dropdown
	var dropdownRect = dropdown.getBoundingClientRect();
	var containerRect = container.getBoundingClientRect();
	var scrollLeft = container.scrollLeft;
	var scrollTop = container.scrollTop;

	// Clamp to the visible viewport (both axes) so a panel near the bottom
	// edge shifts up to stay visible instead of being clipped.
	var clamped = this.clampToContainer(
		dropdownRect.left - containerRect.left + scrollLeft,
		dropdownRect.bottom - containerRect.top + scrollTop + 4,
		panel.offsetWidth, panel.offsetHeight);

	panel.style.left = Math.round(clamped.x) + 'px';
	panel.style.top = Math.round(clamped.y) + 'px';
};

/**
 * Shows the connection style popover: routing style grid.
 */
InlineToolbar.prototype.showConnStyleMenu = function(evt)
{
	this.editorUi.hideCurrentMenu();

	if (this.currentState == null)
	{
		return;
	}

	var graph = this.graph;
	var style = this.getCurrentStyle();
	var shape = mxUtils.getValue(style, mxConstants.STYLE_SHAPE, null);

	var p = this.createPopover(this.connStyleBtn);
	var body = p.body;

	// Title
	var titleDiv = document.createElement('div');
	titleDiv.style.fontWeight = 'bold';
	titleDiv.style.fontSize = '12px';
	titleDiv.style.marginBottom = '8px';
	titleDiv.style.color = 'light-dark(#333, #ccc)';
	mxUtils.write(titleDiv, mxResources.get('connection'));
	body.appendChild(titleDiv);

	// Shared callback for applying style items
	var applyItem = mxUtils.bind(this, function(item)
	{
		graph.stopEditing(false);
		graph.getModel().beginUpdate();

		try
		{
			var selCells = graph.getSelectionCells();
			var edges = [];

			for (var i = 0; i < selCells.length; i++)
			{
				if (graph.getModel().isEdge(selCells[i]))
				{
					if (item.reset)
					{
						var geo = graph.getCellGeometry(selCells[i]);

						if (geo != null)
						{
							geo = geo.clone();
							geo.points = null;
							graph.getModel().setGeometry(selCells[i], geo);
						}

						// Clears the inner-loop flag along with the waypoints it
						// describes (mirrors Menus.edgeStyleChange)
						graph.setCellStyles('innerLoopWaypoints', null, [selCells[i]]);
					}

					for (var j = 0; j < item.keys.length; j++)
					{
						graph.setCellStyles(item.keys[j], item.values[j], [selCells[i]]);
					}

					edges.push(selCells[i]);
				}
			}

			// Optional follow-up inside the same update (libavoid routes the edges
			// immediately after the style is applied, atomically with it).
			if (item.postFn != null)
			{
				item.postFn(graph, edges);
			}
		}
		finally
		{
			graph.getModel().endUpdate();
		}

		this.updateIcons();
		this.hidePopover();
	});

	var addDivider = function()
	{
		var div = document.createElement('div');
		div.style.height = '1px';
		div.style.backgroundColor = 'light-dark(#d0d0d0, #505050)';
		div.style.margin = '6px 0';
		body.appendChild(div);
	};

	// Section 1: Routing styles
	var routingItems = [];

	if (shape != 'arrow')
	{
		// Each routing item also carries libavoidRouting so picking any plain
		// routing clears the flag, keeping the choices mutually exclusive. The
		// active-item highlight is resolved via getImageForEdgeStyle, which
		// already distinguishes a libavoid edge from a plain orthogonal one.
		// Straight keeps curved (see Format for the Line style control)
		routingItems.push({img: Format.straightImage.src, title: mxResources.get('straight'),
			keys: [mxConstants.STYLE_EDGE, mxConstants.STYLE_NOEDGESTYLE, 'libavoidRouting'],
			values: [null, null, null], reset: true});
		routingItems.push({img: Format.orthogonalImage.src, title: mxResources.get('orthogonal'),
			keys: [mxConstants.STYLE_EDGE, mxConstants.STYLE_CURVED, mxConstants.STYLE_NOEDGESTYLE, 'libavoidRouting'],
			values: ['orthogonalEdgeStyle', null, null, null], reset: true});

		// Shown only when the libavoid extensions bundle is loaded (a no-op in
		// viewers / configs without extensions.min.js).
		if (typeof LibavoidRouting !== 'undefined')
		{
			routingItems.push({img: Format.libavoidImage.src, title: mxResources.get('libavoidAutoRoute'),
				keys: [mxConstants.STYLE_EDGE, mxConstants.STYLE_CURVED, mxConstants.STYLE_NOEDGESTYLE, 'libavoidRouting'],
				values: ['orthogonalEdgeStyle', null, null, '1'], reset: true,
				postFn: function(graph, edges) { LibavoidRouting.autoReroute(graph, edges); }});
		}

		routingItems.push({img: Format.verticalElbowImage.src, title: mxResources.get('horizontal'),
			keys: [mxConstants.STYLE_EDGE, mxConstants.STYLE_ELBOW, mxConstants.STYLE_CURVED, mxConstants.STYLE_NOEDGESTYLE, 'libavoidRouting'],
			values: ['elbowEdgeStyle', 'vertical', null, null, null], reset: true});
		routingItems.push({img: Format.horizontalElbowImage.src, title: mxResources.get('vertical'),
			keys: [mxConstants.STYLE_EDGE, mxConstants.STYLE_ELBOW, mxConstants.STYLE_CURVED, mxConstants.STYLE_NOEDGESTYLE, 'libavoidRouting'],
			values: ['elbowEdgeStyle', null, null, null, null], reset: true});
		routingItems.push({img: Format.horizontalIsometricImage.src, title: mxResources.get('isometric'),
			keys: [mxConstants.STYLE_EDGE, mxConstants.STYLE_ELBOW, mxConstants.STYLE_CURVED, mxConstants.STYLE_NOEDGESTYLE, 'libavoidRouting'],
			values: ['isometricEdgeStyle', null, null, null, null], reset: true});
		routingItems.push({img: Format.verticalIsometricImage.src, title: mxResources.get('isometric'),
			keys: [mxConstants.STYLE_EDGE, mxConstants.STYLE_ELBOW, mxConstants.STYLE_CURVED, mxConstants.STYLE_NOEDGESTYLE, 'libavoidRouting'],
			values: ['isometricEdgeStyle', 'vertical', null, null, null], reset: true});

		if (this.supportsCurvedBend(style))
		{
			routingItems.push({img: Format.curvedImage.src, title: mxResources.get('curved'),
				keys: [mxConstants.STYLE_EDGE, mxConstants.STYLE_CURVED, mxConstants.STYLE_NOEDGESTYLE, 'libavoidRouting'],
				values: ['orthogonalEdgeStyle', '1', null, null], reset: true});
		}

		routingItems.push({img: Format.entityImage.src, title: mxResources.get('entityRelation'),
			keys: [mxConstants.STYLE_EDGE, mxConstants.STYLE_CURVED, mxConstants.STYLE_NOEDGESTYLE, 'libavoidRouting'],
			values: ['entityRelationEdgeStyle', null, null, null], reset: true});

		// Offered only for edges on lifelines (see Menus.addSequenceEdgeStyleItem)
		var selCells = graph.getSelectionCells();

		for (var i = 0; i < selCells.length; i++)
		{
			if (graph.isSequenceMessageCandidate(selCells[i]))
			{
				routingItems.push({img: Format.sequenceImage.src, title: mxResources.get('sequenceDiagram'),
					keys: [mxConstants.STYLE_EDGE, mxConstants.STYLE_ELBOW, mxConstants.STYLE_CURVED, mxConstants.STYLE_NOEDGESTYLE, 'libavoidRouting'],
					values: ['sequenceEdgeStyle', null, null, null, null], reset: true,
					postFn: function(graph, edges) { graph.makeSequenceMessages(edges); }});

				break;
			}
		}
	}

	if (routingItems.length > 0)
	{
		this.buildIconGrid(body, routingItems,
			this.getActiveIndexForImage(routingItems,
				this.editorUi.getImageForEdgeStyle(style)), applyItem);
	}

	// Section 2: Edge shape
	var shapeKeys = [mxConstants.STYLE_SHAPE, mxConstants.STYLE_STARTSIZE,
		mxConstants.STYLE_ENDSIZE, mxConstants.STYLE_DASHED, 'width',
		'startWidth', 'endWidth', 'defaultFillColor', 'defaultGradientColor'];

	var shapeItems = [];
	shapeItems.push({img: Format.connectionImage.src, title: mxResources.get('line'),
		keys: shapeKeys, values: [null, null, null, null, null, null, null, null, null]});
	shapeItems.push({img: Format.linkEdgeImage.src, title: mxResources.get('link'),
		keys: shapeKeys, values: ['link', null, null, null, null, null, null, null, null]});
	shapeItems.push({img: Format.arrowImage.src, title: mxResources.get('arrow'),
		keys: shapeKeys, values: ['flexArrow', null, null, null, null, null, null, null, null]});
	shapeItems.push({img: Format.simpleArrowImage.src, title: mxResources.get('simpleArrow'),
		keys: shapeKeys, values: ['arrow', null, null, null, null, null, null, null, null]});
	shapeItems.push({img: Format.taperedArrowImage.src, title: mxResources.get('taperedArrow'),
		keys: shapeKeys, values: ['taperedArrow', null, null, null, null, null, null, null, null]});
	shapeItems.push({img: Format.filledEdgeImage.src, title: mxResources.get('filledEdge'),
		keys: shapeKeys, values: ['filledEdge', null, null, null, null, null, null, null, null]});
	shapeItems.push({img: Format.pipeEdgeImage.src, title: mxResources.get('pipe'),
		keys: shapeKeys, values: ['pipe', null, null, null, null, null, null, null, null]});
	shapeItems.push({img: Format.wireEdgeImage.src, title: mxResources.get('wire'),
		keys: shapeKeys, values: ['wire', null, null, '1', null, null, null, null, null]});

	if (routingItems.length > 0)
	{
		addDivider();
	}

	this.buildIconGrid(body, shapeItems,
		this.getActiveIndexForImage(shapeItems,
			this.editorUi.getImageForEdgeShape(style)), applyItem);

	// Section 3: Bend style
	var bendKeys = [mxConstants.STYLE_ROUNDED, mxConstants.STYLE_CURVED];
	var bendItems = [];
	bendItems.push({img: Format.sharpBendImage.src, title: mxResources.get('sharp'),
		keys: bendKeys, values: ['0', '0']});
	bendItems.push({img: Format.roundedBendImage.src, title: mxResources.get('rounded'),
		keys: bendKeys, values: ['1', '0']});

	if (this.supportsCurvedBend(style))
	{
		bendItems.push({img: Format.curvedBendImage.src, title: mxResources.get('curved'),
			keys: bendKeys, values: ['0', '1']});
	}

	// Determine active bend
	var activeBend = -1;
	var rounded = mxUtils.getValue(style, mxConstants.STYLE_ROUNDED, '0');
	var curvedVal = mxUtils.getValue(style, mxConstants.STYLE_CURVED, '0');

	if (curvedVal == '1')
	{
		activeBend = 2;
	}
	else if (rounded == '1')
	{
		activeBend = 1;
	}
	else
	{
		activeBend = 0;
	}

	var state = graph.view.getState(this.currentState.cell);
	var showBend = this.supportsCurvedBend(style) ||
		(state != null && graph.isRoundedState(state));

	if (showBend)
	{
		addDivider();
		this.buildIconGrid(body, bendItems, activeBend, applyItem);
	}

	// Position and animate
	p.position();
	p.animateIn();
};

/**
 * Removes the current sub-panel of a dropdown in the popover.
 */
InlineToolbar.prototype.hideSubPanel = function()
{
	if (this.currentSubPanel != null)
	{
		if (this.currentSubPanel.parentNode != null)
		{
			this.currentSubPanel.parentNode.removeChild(this.currentSubPanel);
		}

		this.currentSubPanel = null;
	}
};

/**
 * Adds a function that updates a control in the current popover after
 * changes of the model.
 */
InlineToolbar.prototype.addPopoverUpdate = function(fn)
{
	this.popoverUpdates.push(fn);
};

/**
 * Updates the controls in the current popover for the style of the
 * current cell.
 */
InlineToolbar.prototype.updatePopover = function()
{
	if (this.currentPopover != null && this.currentState != null)
	{
		var style = this.getCurrentStyle();

		for (var i = 0; i < this.popoverUpdates.length; i++)
		{
			this.popoverUpdates[i](style);
		}

		this.positionPopover();
	}
};

/**
 * Hides the current popover if visible. If immediate is true,
 * removes without animation.
 */
InlineToolbar.prototype.hidePopover = function(immediate)
{
	// Close sub-panel first
	this.hideSubPanel();
	this.popoverUpdates = [];
	this.positionPopover = null;

	if (this.popoverCloseHandler != null)
	{
		document.removeEventListener('mousedown', this.popoverCloseHandler, true);
		this.popoverCloseHandler = null;
	}

	if (this.popoverScrollHandler != null)
	{
		this.graph.container.removeEventListener('scroll', this.popoverScrollHandler);
		this.popoverScrollHandler = null;
	}

	if (this.popoverKeyHandler != null)
	{
		document.removeEventListener('keydown', this.popoverKeyHandler);
		this.popoverKeyHandler = null;
	}

	if (this.currentPopover != null)
	{
		var popover = this.currentPopover;
		this.currentPopover = null;
		this.currentPopoverAnchor = null;

		if (immediate || popover.parentNode == null)
		{
			if (popover.parentNode != null)
			{
				popover.parentNode.removeChild(popover);
			}
		}
		else
		{
			// Animate out
			var duration = Math.round(this.popoverAnimDuration * 0.6);
			popover.style.transition = 'transform ' + duration +
				'ms cubic-bezier(0.5, 0, 0.7, 0.4), opacity ' +
				duration + 'ms ease-in';
			popover.style.opacity = '0';
			popover.style.transform = 'scale(0.3)';
			popover.style.pointerEvents = 'none';

			window.setTimeout(function()
			{
				if (popover.parentNode != null)
				{
					popover.parentNode.removeChild(popover);
				}
			}, duration);
		}
	}
};

/**
 * Removes all listeners and DOM elements.
 */
InlineToolbar.prototype.destroy = function()
{
	this.hidePopover(true);

	if (this.hideTimeout != null)
	{
		window.clearTimeout(this.hideTimeout);
		this.hideTimeout = null;
	}

	this.graph.selectionModel.removeListener(this.selectionHandler);
	this.graph.model.removeListener(this.modelHandler);
	this.graph.view.removeListener(this.repaintHandler);
	this.graph.removeListener(this.selectionHandler);
	this.graph.removeListener(this.repaintHandler);
	this.graph.removeListener(this.hideHandler);
	mxEvent.removeListener(this.graph.container, 'scroll', this.scrollHandler);

	if (this.toolbar.parentNode != null)
	{
		this.toolbar.parentNode.removeChild(this.toolbar);
	}
};

/**
 * Overrides the hook to create an InlineToolbar instance.
 */
EditorUi.prototype.createInlineToolbar = function()
{
	return new InlineToolbar(this);
};
