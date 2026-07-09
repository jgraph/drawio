/**
 * Floating toolbar that appears when a single edge is selected,
 * providing quick access to edge style changes.
 */
InlineToolbar = function(editorUi)
{
	this.editorUi = editorUi;
	this.graph = editorUi.editor.graph;
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
 * Current cell state.
 */
InlineToolbar.prototype.currentState = null;

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

	var createButton = mxUtils.bind(this, function(title)
	{
		var btn = document.createElement('div');
		btn.style.width = btnSize + 'px';
		btn.style.height = btnSize + 'px';
		btn.style.backgroundSize = '16px';
		btn.style.backgroundRepeat = 'no-repeat';
		btn.style.backgroundPosition = 'center';
		btn.style.cursor = 'pointer';
		btn.style.display = 'inline-block';
		btn.style.verticalAlign = 'top';
		btn.style.borderRadius = '6px';
		btn.className = 'geAdaptiveAsset';
		btn.setAttribute('title', title);

		return btn;
	});

	var createSpacer = function()
	{
		var sp = document.createElement('div');
		sp.style.display = 'inline-block';
		sp.style.width = '4px';

		return sp;
	};

	// Button 1: Line style (dash, weight, color)
	this.lineStyleBtn = createButton(mxResources.get('line'));
	this.lineStyleBtn.style.backgroundImage = 'url(' + InlineToolbar.lineStyleIcon.src + ')';
	this.toolbar.appendChild(this.lineStyleBtn);

	this.toolbar.appendChild(createSpacer());

	// Button 2: Line endings (start/end arrow markers)
	this.lineEndBtn = createButton(mxResources.get('lineend'));
	this.lineEndBtn.style.backgroundImage = 'url(' + InlineToolbar.lineEndIcon.src + ')';
	this.toolbar.appendChild(this.lineEndBtn);

	this.toolbar.appendChild(createSpacer());

	// Button 3: Connection style (routing/waypoints)
	this.connStyleBtn = createButton(mxResources.get('connection'));
	this.connStyleBtn.style.backgroundImage = 'url(' + InlineToolbar.connStyleIcon.src + ')';
	this.toolbar.appendChild(this.connStyleBtn);

	// Append container to DOM
	this.graph.container.appendChild(this.toolbar);

	// Prevent mousedown from deselecting the edge
	mxEvent.addListener(this.toolbar, 'mousedown', mxUtils.bind(this, function(evt)
	{
		if (this.graph.isEnabled())
		{
			mxEvent.consume(evt);
		}
	}));

	// Click handlers for each button
	mxEvent.addListener(this.lineStyleBtn, 'click', mxUtils.bind(this, function(evt)
	{
		if (this.graph.isEnabled())
		{
			if (this.currentPopoverAnchor == this.lineStyleBtn)
			{
				this.hidePopover();
			}
			else
			{
				this.showLineStyleMenu(evt);
			}

			mxEvent.consume(evt);
		}
	}));

	mxEvent.addListener(this.lineEndBtn, 'click', mxUtils.bind(this, function(evt)
	{
		if (this.graph.isEnabled())
		{
			if (this.currentPopoverAnchor == this.lineEndBtn)
			{
				this.hidePopover();
			}
			else
			{
				this.showLineEndMenu(evt);
			}

			mxEvent.consume(evt);
		}
	}));

	mxEvent.addListener(this.connStyleBtn, 'click', mxUtils.bind(this, function(evt)
	{
		if (this.graph.isEnabled())
		{
			if (this.currentPopoverAnchor == this.connStyleBtn)
			{
				this.hidePopover();
			}
			else
			{
				this.showConnStyleMenu(evt);
			}

			mxEvent.consume(evt);
		}
	}));

	this.selectionHandler = mxUtils.bind(this, function()
	{
		this.updateSelection();
	});

	this.repaintHandler = mxUtils.bind(this, function()
	{
		this.repaint();
	});

	this.modelHandler = mxUtils.bind(this, function()
	{
		this.updateSelection();
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
	mxEvent.addListener(this.graph.container, 'scroll', this.repaintHandler);
};

/**
 * Updates visibility based on the current selection.
 */
InlineToolbar.prototype.updateSelection = function()
{
	var cells = this.graph.getSelectionCells();
	var state = null;

	if (cells.length == 1 && this.graph.model.isEdge(cells[0]) &&
		this.graph.isEnabled() && !this.graph.isCellLocked(cells[0]))
	{
		state = this.graph.view.getState(cells[0]);
	}

	if (state != null)
	{
		this.currentState = state;
		this.show();
	}
	else
	{
		this.currentState = null;
		this.hide();
	}
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
	this.updateIcons();

	if (this.hideTimeout != null)
	{
		window.clearTimeout(this.hideTimeout);
		this.hideTimeout = null;
	}

	this.toolbar.style.transition = 'none';
	this.toolbar.style.opacity = '0';
	this.toolbar.style.display = 'block';
	this.repaint();

	// Force layout then fade in
	this.toolbar.offsetHeight;
	this.toolbar.style.transition = 'opacity ' + this.toolbarAnimDuration + 'ms ease-out';
	this.toolbar.style.opacity = '0.9';
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
	var shape = mxUtils.getValue(style, mxConstants.STYLE_SHAPE, null);

	return shape == null || shape == 'connector' ||
		shape == 'filledEdge' || shape == 'wire' || shape == 'pipe';
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
 * Repositions the toolbar at the cell midpoint, avoiding overlap with
 * edge waypoint handles and edge segments.
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
			var mid = this.getEdgeMidpoint(state);

			if (mid != null)
			{
				// Toolbar dimensions: 3 buttons + 2 spacers (4px) + padding (4px each side) + border (1px each side)
				var btnSize = this.iconSize - 4;
				var toolbarWidth = btnSize * 3 + 4 * 2 + 10;
				var toolbarHeight = btnSize + 10;

				// Default position: above the edge midpoint, centered
				var x = mid.x - toolbarWidth / 2;
				var y = mid.y - toolbarHeight - this.offset;

				// Check for overlap with edge handler bends and reposition if needed
				var handler = this.graph.selectionCellsHandler.getHandler(state.cell);

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
				var container = this.graph.container;
				var minX = container.scrollLeft + 4;
				var maxX = container.scrollLeft + container.clientWidth - toolbarWidth - 4;
				var minY = container.scrollTop + 4;
				var maxY = container.scrollTop + container.clientHeight - toolbarHeight - 4;

				if (maxX > minX)
				{
					x = Math.max(minX, Math.min(x, maxX));
				}

				if (maxY > minY)
				{
					y = Math.max(minY, Math.min(y, maxY));
				}

				this.toolbar.style.left = Math.round(x) + 'px';
				this.toolbar.style.top = Math.round(y) + 'px';
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
		if (popY != unclampedY)
		{
			arrowBorder.style.display = 'none';
			arrowFill.style.display = 'none';
		}

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

	// Close handlers
	this.popoverCloseHandler = mxUtils.bind(this, function(e)
	{
		var target = e.target || e.srcElement;
		var cw = this.editorUi.colorWindow;

		if (!mxEvent.isConsumed(e) && !popover.contains(target) &&
			!this.toolbar.contains(target) &&
			(this.currentSubPanel == null || !this.currentSubPanel.contains(target)) &&
			(cw == null || cw.window == null || !cw.window.div.contains(target)))
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
 * the behaviour of the other color swatches.
 */
InlineToolbar.prototype.createColorSwatch = function(title, currentColor, styleKey, defaultColorValue)
{
	var graph = this.graph;
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
			var cellStyle = (cell != null) ? graph.getCellStyle(cell, false) : null;

			return (cellStyle != null) ? (cellStyle[styleKey] || mxConstants.NONE) :
				mxConstants.NONE;
		};

		this.editorUi.pickColor(getColorFn(),
			mxUtils.bind(this, function(color)
			{
				// Apply to the live selection read at apply time, not the cells
				// captured when the swatch was built. Same reason as above:
				// the selection may have changed while the picker was open.
				graph.stopEditing(false);
				graph.setCellStyles(styleKey, color, this.editorUi.getSelectionState().cells);
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
	var style = graph.getCurrentCellStyle(this.currentState.cell);
	var cells = graph.getSelectionCells();

	var p = this.createPopover(this.lineStyleBtn, {persistOnClick: true});
	var body = p.body;

	// Row 1: Dash pattern dropdown
	var dashKeys = [mxConstants.STYLE_DASHED, mxConstants.STYLE_DASH_PATTERN];
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

	// Determine active dash pattern
	var dashed = mxUtils.getValue(style, mxConstants.STYLE_DASHED, null);
	var dashPattern = mxUtils.getValue(style, mxConstants.STYLE_DASH_PATTERN, null);
	var activeDashIndex = 0;

	for (var i = 0; i < dashItems.length; i++)
	{
		var dv = dashItems[i].values[0];
		var pv = dashItems[i].values[1];

		if ((dv == null ? null : String(dv)) == (dashed == null ? null : String(dashed)) &&
			(pv == null ? null : String(pv)) == (dashPattern == null ? null : String(dashPattern)))
		{
			activeDashIndex = i;
			break;
		}
	}

	// Helper to create an SVG dash preview image
	var previewWidth = 80;

	var createDashPreview = function(pattern)
	{
		var da = (pattern != null) ? ' stroke-dasharray="' + pattern + '"' : '';
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

	// Dropdown button
	var dashDropdown = document.createElement('div');
	dashDropdown.style.display = 'flex';
	dashDropdown.style.alignItems = 'center';
	dashDropdown.style.border = '1px solid light-dark(#d0d0d0, #505050)';
	dashDropdown.style.borderRadius = '6px';
	dashDropdown.style.height = '28px';
	dashDropdown.style.padding = '0 6px';
	dashDropdown.style.cursor = 'pointer';
	dashDropdown.style.marginBottom = '8px';
	dashDropdown.style.gap = '4px';

	var dashPreview = document.createElement('div');
	dashPreview.style.flex = '1';
	dashPreview.style.display = 'flex';
	dashPreview.style.alignItems = 'center';
	dashPreview.appendChild(createDashPreview(dashItems[activeDashIndex].pattern));
	dashDropdown.appendChild(dashPreview);

	var dashChevron = document.createElement('span');
	dashChevron.style.fontSize = '8px';
	dashChevron.style.color = 'light-dark(#666, #999)';
	dashChevron.style.flexShrink = '0';
	dashChevron.innerHTML = '&#9660;';
	dashDropdown.appendChild(dashChevron);

	mxEvent.addListener(dashDropdown, 'mouseenter', function()
	{
		dashDropdown.style.backgroundColor = 'light-dark(#f0f0f0, #4a4a4a)';
	});

	mxEvent.addListener(dashDropdown, 'mouseleave', function()
	{
		dashDropdown.style.backgroundColor = '';
	});

	mxEvent.addListener(dashDropdown, 'click', mxUtils.bind(this, function(e)
	{
		// Toggle: close if already open for this dropdown
		if (this.currentSubPanel != null && this.currentSubPanel._ownerDropdown === dashDropdown)
		{
			if (this.currentSubPanel.parentNode != null)
			{
				this.currentSubPanel.parentNode.removeChild(this.currentSubPanel);
			}

			this.currentSubPanel = null;
			mxEvent.consume(e);

			return;
		}

		// Close existing sub-panel from a different dropdown
		if (this.currentSubPanel != null && this.currentSubPanel.parentNode != null)
		{
			this.currentSubPanel.parentNode.removeChild(this.currentSubPanel);
			this.currentSubPanel = null;
		}

		var container = graph.container;
		var panel = document.createElement('div');
		panel.style.position = 'absolute';
		panel.style.zIndex = 10;
		panel.style.backgroundColor = 'light-dark(white, var(--dark-color))';
		panel.style.border = '1px solid light-dark(#d0d0d0, #505050)';
		panel.style.borderRadius = '12px';
		panel.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
		panel.style.padding = '4px';

		for (var i = 0; i < dashItems.length; i++)
		{
			var row = document.createElement('div');
			row.style.display = 'flex';
			row.style.alignItems = 'center';
			row.style.padding = '4px 8px';
			row.style.borderRadius = '6px';
			row.style.cursor = 'pointer';
			row.style.minWidth = (previewWidth + 16) + 'px';
			row.setAttribute('title', dashItems[i].label);

			if (i == activeDashIndex)
			{
				row.style.backgroundColor = 'light-dark(#e8f0fe, #3c4043)';
			}

			row.appendChild(createDashPreview(dashItems[i].pattern));

			(function(item, rowElt, idx)
			{
				mxEvent.addListener(rowElt, 'mouseenter', function()
				{
					if (idx != activeDashIndex)
					{
						rowElt.style.backgroundColor = 'light-dark(#f0f0f0, #4a4a4a)';
					}
				});

				mxEvent.addListener(rowElt, 'mouseleave', function()
				{
					if (idx != activeDashIndex)
					{
						rowElt.style.backgroundColor = '';
					}
				});

				mxEvent.addListener(rowElt, 'click', mxUtils.bind(this, function(ce)
				{
					graph.stopEditing(false);
					graph.getModel().beginUpdate();

					try
					{
						graph.setCellStyles(dashKeys[0], item.values[0], cells);
						graph.setCellStyles(dashKeys[1], item.values[1], cells);
					}
					finally
					{
						graph.getModel().endUpdate();
					}

					activeDashIndex = idx;

					// Update preview in dropdown
					dashPreview.innerHTML = '';
					dashPreview.appendChild(createDashPreview(item.pattern));

					// Close sub-panel
					if (panel.parentNode != null)
					{
						panel.parentNode.removeChild(panel);
					}

					this.currentSubPanel = null;
					mxEvent.consume(ce);
				}));
			}).call(this, dashItems[i], row, i);

			panel.appendChild(row);
		}

		mxEvent.addListener(panel, 'mousedown', function(me)
		{
			mxEvent.consume(me);
		});

		container.appendChild(panel);
		this.currentSubPanel = panel;
		panel._ownerDropdown = dashDropdown;

		// Position below the dropdown
		var ddRect = dashDropdown.getBoundingClientRect();
		var containerRect = container.getBoundingClientRect();
		var scrollLeft = container.scrollLeft;
		var scrollTop = container.scrollTop;

		// Position below the dropdown, clamped to the visible viewport.
		var clamped = this.clampToContainer(
			ddRect.left - containerRect.left + scrollLeft,
			ddRect.bottom - containerRect.top + scrollTop + 4,
			panel.offsetWidth, panel.offsetHeight);

		panel.style.left = Math.round(clamped.x) + 'px';
		panel.style.top = Math.round(clamped.y) + 'px';

		mxEvent.consume(e);
	}));

	body.appendChild(dashDropdown);

	// Row 2: Stroke width + color
	var row2 = document.createElement('div');
	row2.style.display = 'flex';
	row2.style.alignItems = 'center';
	row2.style.gap = '8px';

	// Stroke width input with stepper
	var currentWidth = parseInt(mxUtils.getValue(style, mxConstants.STYLE_STROKEWIDTH, '1'));
	var widthContainer = document.createElement('div');
	widthContainer.style.display = 'flex';
	widthContainer.style.alignItems = 'center';
	widthContainer.style.border = '1px solid light-dark(#d0d0d0, #505050)';
	widthContainer.style.borderRadius = '6px';
	widthContainer.style.height = '28px';
	widthContainer.style.overflow = 'hidden';

	var widthInput = document.createElement('input');
	widthInput.type = 'text';
	widthInput.value = currentWidth + ' pt';
	widthInput.style.width = '40px';
	widthInput.style.border = 'none';
	widthInput.style.outline = 'none';
	widthInput.style.textAlign = 'center';
	widthInput.style.fontSize = '11px';
	widthInput.style.padding = '0 2px';
	widthInput.style.backgroundColor = 'transparent';
	widthInput.style.color = 'inherit';

	var applyWidth = function(val)
	{
		val = Math.max(0, Math.min(999, parseInt(val) || 0));
		widthInput.value = val + ' pt';

		graph.stopEditing(false);
		graph.setCellStyles(mxConstants.STYLE_STROKEWIDTH, val, cells);
	};

	mxEvent.addListener(widthInput, 'focus', function()
	{
		widthInput.value = parseInt(widthInput.value) || 0;
		widthInput.select();
	});

	mxEvent.addListener(widthInput, 'blur', function()
	{
		applyWidth(widthInput.value);
	});

	mxEvent.addListener(widthInput, 'keydown', function(e)
	{
		if (e.keyCode == 13)
		{
			applyWidth(widthInput.value);
			widthInput.blur();
		}
		else if (e.keyCode == 38)
		{
			var v = (parseInt(widthInput.value) || 0) + 1;
			applyWidth(v);
			e.preventDefault();
		}
		else if (e.keyCode == 40)
		{
			var v = (parseInt(widthInput.value) || 0) - 1;
			applyWidth(v);
			e.preventDefault();
		}
	});

	widthContainer.appendChild(widthInput);

	// Stepper buttons
	var stepperDiv = document.createElement('div');
	stepperDiv.style.display = 'flex';
	stepperDiv.style.flexDirection = 'column';
	stepperDiv.style.borderLeft = '1px solid light-dark(#d0d0d0, #505050)';

	var upBtn = document.createElement('div');
	upBtn.innerHTML = '&#9650;';
	upBtn.style.fontSize = '7px';
	upBtn.style.lineHeight = '14px';
	upBtn.style.textAlign = 'center';
	upBtn.style.cursor = 'pointer';
	upBtn.style.width = '16px';
	upBtn.style.userSelect = 'none';

	mxEvent.addListener(upBtn, 'click', function(e)
	{
		var v = (parseInt(widthInput.value) || 0) + 1;
		applyWidth(v);
		mxEvent.consume(e);
	});

	var downBtn = document.createElement('div');
	downBtn.innerHTML = '&#9660;';
	downBtn.style.fontSize = '7px';
	downBtn.style.lineHeight = '14px';
	downBtn.style.textAlign = 'center';
	downBtn.style.cursor = 'pointer';
	downBtn.style.width = '16px';
	downBtn.style.userSelect = 'none';

	mxEvent.addListener(downBtn, 'click', function(e)
	{
		var v = (parseInt(widthInput.value) || 0) - 1;
		applyWidth(v);
		mxEvent.consume(e);
	});

	stepperDiv.appendChild(upBtn);
	stepperDiv.appendChild(downBtn);
	widthContainer.appendChild(stepperDiv);
	row2.appendChild(widthContainer);

	// Stroke color swatch
	var strokeColor = mxUtils.getValue(style, mxConstants.STYLE_STROKECOLOR, '#000000');
	row2.appendChild(this.createColorSwatch(mxResources.get('strokeColor'),
		strokeColor, mxConstants.STYLE_STROKECOLOR, graph.shapeForegroundColor));
	body.appendChild(row2);

	// Row 3: Fill and gradient color, shown only for edge shapes that
	// support them (filled edge, flex arrow, arrow, pipe, wire, …).
	var state = this.currentState;

	if (state != null && graph.isFillState(state))
	{
		var fillColor = mxUtils.getValue(style, mxConstants.STYLE_FILLCOLOR, null);
		var row3 = document.createElement('div');
		row3.style.display = 'flex';
		row3.style.alignItems = 'center';
		row3.style.gap = '6px';
		row3.style.marginTop = '8px';

		var addColorGroup = mxUtils.bind(this, function(labelText, title, color,
			styleKey, defaultColorValue, extraGap)
		{
			var label = document.createElement('span');
			label.style.fontSize = '11px';
			label.style.color = 'light-dark(#333, #ccc)';

			if (extraGap)
			{
				label.style.marginLeft = '8px';
			}

			mxUtils.write(label, labelText);
			row3.appendChild(label);
			row3.appendChild(this.createColorSwatch(title, color, styleKey,
				defaultColorValue));
		});

		addColorGroup(mxResources.get('fill'), mxResources.get('fillColor'),
			fillColor, mxConstants.STYLE_FILLCOLOR, graph.shapeBackgroundColor, false);

		// Gradient needs a fill color and a shape that supports gradients
		// (excludes wire/pipe).
		if (graph.isGradientState(state) && fillColor != null &&
			fillColor != mxConstants.NONE)
		{
			var gradientColor = mxUtils.getValue(style,
				mxConstants.STYLE_GRADIENTCOLOR, null);
			addColorGroup(mxResources.get('gradient'), mxResources.get('gradientColor'),
				gradientColor, mxConstants.STYLE_GRADIENTCOLOR,
				graph.shapeForegroundColor, true);
		}

		body.appendChild(row3);
	}

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
	var style = graph.getCurrentCellStyle(this.currentState.cell);
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
				graph.getModel().beginUpdate();

				try
				{
					graph.setCellStyles(arrowKey, item.marker, cells);
					graph.setCellStyles(fillKey, item.fill, cells);
				}
				finally
				{
					graph.getModel().endUpdate();
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
	var style = graph.getCurrentCellStyle(this.currentState.cell);
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
		routingItems.push({img: Format.straightImage.src, title: mxResources.get('straight'),
			keys: [mxConstants.STYLE_EDGE, mxConstants.STYLE_CURVED, mxConstants.STYLE_NOEDGESTYLE, 'libavoidRouting'],
			values: [null, null, null, null], reset: true});
		routingItems.push({img: Format.orthogonalImage.src, title: mxResources.get('orthogonal'),
			keys: [mxConstants.STYLE_EDGE, mxConstants.STYLE_CURVED, mxConstants.STYLE_NOEDGESTYLE, 'libavoidRouting'],
			values: ['orthogonalEdgeStyle', null, null, null], reset: true});

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

		if (shape == null || shape == 'connector')
		{
			routingItems.push({img: Format.curvedImage.src, title: mxResources.get('curved'),
				keys: [mxConstants.STYLE_EDGE, mxConstants.STYLE_CURVED, mxConstants.STYLE_NOEDGESTYLE, 'libavoidRouting'],
				values: ['orthogonalEdgeStyle', '1', null, null], reset: true});
		}

		routingItems.push({img: Format.entityImage.src, title: mxResources.get('entityRelation'),
			keys: [mxConstants.STYLE_EDGE, mxConstants.STYLE_CURVED, mxConstants.STYLE_NOEDGESTYLE, 'libavoidRouting'],
			values: ['entityRelationEdgeStyle', null, null, null], reset: true});
	}

	if (routingItems.length > 0)
	{
		this.buildIconGrid(body, routingItems,
			this.getActiveIndexForImage(routingItems,
				this.editorUi.getImageForEdgeStyle(style)), applyItem);
	}

	// Section 2: Edge shape
	var shapeKeys = [mxConstants.STYLE_SHAPE, mxConstants.STYLE_STARTSIZE,
		mxConstants.STYLE_ENDSIZE, mxConstants.STYLE_DASHED, 'width'];

	var shapeItems = [];
	shapeItems.push({img: Format.connectionImage.src, title: mxResources.get('line'),
		keys: shapeKeys, values: [null, null, null, null, null]});
	shapeItems.push({img: Format.linkEdgeImage.src, title: mxResources.get('link'),
		keys: shapeKeys, values: ['link', null, null, null, null]});
	shapeItems.push({img: Format.arrowImage.src, title: mxResources.get('arrow'),
		keys: shapeKeys, values: ['flexArrow', null, null, null, null]});
	shapeItems.push({img: Format.simpleArrowImage.src, title: mxResources.get('simpleArrow'),
		keys: shapeKeys, values: ['arrow', null, null, null, null]});
	shapeItems.push({img: Format.filledEdgeImage.src, title: 'Filled Edge',
		keys: shapeKeys, values: ['filledEdge', null, null, null, null]});
	shapeItems.push({img: Format.pipeEdgeImage.src, title: 'Pipe',
		keys: shapeKeys, values: ['pipe', null, null, null, null]});
	shapeItems.push({img: Format.wireEdgeImage.src, title: 'Wire',
		keys: shapeKeys, values: ['wire', null, null, '1', null]});

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
 * Hides the current popover if visible. If immediate is true,
 * removes without animation.
 */
InlineToolbar.prototype.hidePopover = function(immediate)
{
	// Close sub-panel first
	if (this.currentSubPanel != null)
	{
		if (this.currentSubPanel.parentNode != null)
		{
			this.currentSubPanel.parentNode.removeChild(this.currentSubPanel);
		}

		this.currentSubPanel = null;
	}

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
	mxEvent.removeListener(this.graph.container, 'scroll', this.repaintHandler);

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
