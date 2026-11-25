/**
 * Floating toolbar that appears when cells are selected, providing quick
 * access to style changes, if Editor.isInlineToolbarEnabled returns true, for
 * selections with shapes only if Editor.isShapeInlineToolbarEnabled returns
 * true as well (see isToolbarSelection). It is the toolbar of Fusion in
 * every theme: this file has its buttons, its popovers and their controls,
 * InlineToolbarLook.js (needed, loaded after it) their look, the tool pill
 * with the outline glyphs, popovers in sections with heads and More with the
 * effects, the order and the actions. The colors are the variables of the
 * theme (geInlineToolbarUi in grapheditor.css), Fusion has its tokens
 * (fusion.css).
 */
InlineToolbar = function(editorUi)
{
	this.editorUi = editorUi;
	this.graph = editorUi.editor.graph;
	this.popoverUpdates = [];
	this.init();

	// Hides the hover icons while a popover is open, as they would show next
	// to it or on top of it. Chains the function that was there, an own one
	// of the hover icons or the one of their prototype at the time of the
	// call, so that overrides of HoverIcons.isSuspended still apply.
	var hoverIcons = editorUi.hoverIcons;

	if (hoverIcons != null)
	{
		var toolbar = this;
		var previous = (Object.prototype.hasOwnProperty.call(hoverIcons,
			'isSuspended')) ? hoverIcons.isSuspended : null;
		this.previousHoverIconsSuspended = previous;

		this.hoverIconsSuspended = function()
		{
			var fn = (previous != null) ? previous :
				Object.getPrototypeOf(hoverIcons).isSuspended;

			return toolbar.currentPopover != null ||
				(fn != null && fn.apply(this, arguments));
		};

		hoverIcons.isSuspended = this.hoverIconsSuspended;
	}
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
 * Kind of the options in the current popover (see getTargetCells).
 */
InlineToolbar.prototype.popoverKind = null;

/**
 * True while the popover shows a menu of its own (see showPopoverMenu).
 */
InlineToolbar.prototype.showingPopoverMenu = false;

/**
 * Bounds of the selected cells in the last repaint (see getSelectionBounds).
 */
InlineToolbar.prototype.selectionBounds = null;

/**
 * Bounds of the handles in the last repaint (see getHandleBounds).
 */
InlineToolbar.prototype.handleBounds = null;

/**
 * Positions of the toolbar and other cells near the selection in the last
 * repaint (see getPlacement).
 */
InlineToolbar.prototype.placement = null;

/**
 * Position of the pointer over the diagram in client coordinates, or null
 * if it left the diagram (see getPointerPoint).
 */
InlineToolbar.prototype.pointerPoint = null;

/**
 * Bounds of the toolbar where it was placed for the selected cells, or null
 * while it is hidden (see getPosition).
 */
InlineToolbar.prototype.placedBounds = null;

/**
 * The pointerPoint with which the toolbar was placed where it is while it
 * avoided the pointer, or null (see getPosition). The pointer is on its way
 * to the toolbar or on it only if it moved since, as the diagram may move
 * under the pointer.
 */
InlineToolbar.prototype.placedPointer = null;

/**
 * Side of the edge midpoint or the selected cells where the toolbar was
 * placed in the last repaint: 'above', 'below', 'left', 'right' or null
 * for a corner of the viewport (see getPosition).
 */
InlineToolbar.prototype.toolbarSide = null;

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
 * SVG icon for the arrange button.
 */
InlineToolbar.arrangeIcon = Graph.createSvgImage(16, 16,
	'<path d="M 2.75 1.5 L 2.75 14.5" stroke="black" stroke-width="1.5"/>' +
	'<rect x="5.25" y="3.25" width="8.5" height="3.5" rx="1" fill="black" fill-opacity="0.4" ' +
	'stroke="black" stroke-width="1.5"/><rect x="5.25" y="9.25" width="5" height="3.5" rx="1" ' +
	'fill="black" fill-opacity="0.4" stroke="black" stroke-width="1.5"/>', 16, 16);

/**
 * SVG image for distributing the shapes horizontally.
 */
InlineToolbar.distributeHorizontalImage = Graph.createSvgImage(24, 24,
	'<path d="M 2 2 H 4 V 22 H 2 Z M 10.5 7 H 13.5 V 17 H 10.5 Z M 20 2 H 22 V 22 H 20 Z" ' +
	'fill="black"/>', 24, 24).src;

/**
 * SVG image for distributing the shapes vertically.
 */
InlineToolbar.distributeVerticalImage = Graph.createSvgImage(24, 24,
	'<path d="M 2 2 H 22 V 4 H 2 Z M 7 10.5 H 17 V 13.5 H 7 Z M 2 20 H 22 V 22 H 2 Z" ' +
	'fill="black"/>', 24, 24).src;

/**
 * SVG icon for the table button.
 */
InlineToolbar.tableIcon = Graph.createSvgImage(16, 16,
	'<rect x="2.75" y="2.75" width="10.5" height="10.5" rx="2" fill="none" ' +
	'stroke="black" stroke-width="1.5"/><path d="M 2.75 6.5 H 13.25 M 2.75 10 ' +
	'H 13.25 M 8 6.5 V 13.25" stroke="black" stroke-width="1.5" fill="none"/>', 16, 16);

/**
 * SVG image for the collapsed borders of tables.
 */
InlineToolbar.collapsedBordersImage = Graph.createSvgImage(24, 24,
	'<path d="M 3 3 H 21 V 21 H 3 Z M 3 9 H 21 M 3 15 H 21 M 9 3 V 21 M 15 3 V 21" ' +
	'stroke="black" stroke-width="2" fill="none"/>', 24, 24).src;

/**
 * SVG icon for the button that changes the shape.
 */
InlineToolbar.shapeIcon = Graph.createSvgImage(16, 16,
	'<rect x="2.25" y="6.75" width="7" height="7" rx="1" fill="black" fill-opacity="0.4" ' +
	'stroke="black" stroke-width="1.5"/><circle cx="10.25" cy="5.75" r="3.5" fill="black" ' +
	'fill-opacity="0.4" stroke="black" stroke-width="1.5"/>', 16, 16);

/**
 * SVG icon for the button with the options of a single selected cell.
 */
InlineToolbar.moreIcon = Graph.createSvgImage(16, 16,
	'<circle cx="3.5" cy="8" r="1.5" fill="black"/><circle cx="8" cy="8" r="1.5" ' +
	'fill="black"/><circle cx="12.5" cy="8" r="1.5" fill="black"/>', 16, 16);

/**
 * SVG images for the options of a single selected cell (see getCellOptions).
 */
InlineToolbar.clearWaypointsImage = Graph.createSvgImage(24, 24,
	'<path d="M 3 20 L 10 6 L 21 20" stroke="black" stroke-width="2" fill="none"/>' +
	'<circle cx="10" cy="6" r="3" stroke="black" stroke-width="2" fill="white"/>' +
	'<path d="M 8.5 4.5 L 11.5 7.5 M 11.5 4.5 L 8.5 7.5" stroke="black" stroke-width="1.5"/>',
	24, 24).src;

InlineToolbar.bringForwardImage = Graph.createSvgImage(24, 24,
	'<rect x="3" y="9" width="12" height="12" rx="1.5" stroke="black" stroke-width="2" fill="none"/>' +
	'<path d="M 19 15 V 4 M 15.5 7.5 L 19 4 L 22.5 7.5" stroke="black" stroke-width="2" ' +
	'stroke-linejoin="round" stroke-linecap="round" fill="none"/>', 24, 24).src;

InlineToolbar.sendBackwardImage = Graph.createSvgImage(24, 24,
	'<rect x="3" y="3" width="12" height="12" rx="1.5" stroke="black" stroke-width="2" fill="none"/>' +
	'<path d="M 19 9 V 20 M 15.5 16.5 L 19 20 L 22.5 16.5" stroke="black" stroke-width="2" ' +
	'stroke-linejoin="round" stroke-linecap="round" fill="none"/>', 24, 24).src;

InlineToolbar.resetLabelImage = Graph.createSvgImage(24, 24,
	'<path d="M 2 12 H 7 M 17 12 H 22" stroke="black" stroke-width="2"/>' +
	'<rect x="7" y="8" width="10" height="8" rx="1.5" stroke="black" stroke-width="2" ' +
	'fill="none"/>', 24, 24).src;

InlineToolbar.collapseImage = Graph.createSvgImage(24, 24,
	'<rect x="4" y="4" width="16" height="16" rx="2" stroke="black" stroke-width="2" ' +
	'fill="none"/><path d="M 8 12 H 16" stroke="black" stroke-width="2"/>', 24, 24).src;

InlineToolbar.expandImage = Graph.createSvgImage(24, 24,
	'<rect x="4" y="4" width="16" height="16" rx="2" stroke="black" stroke-width="2" ' +
	'fill="none"/><path d="M 8 12 H 16 M 12 8 V 16" stroke="black" stroke-width="2"/>',
	24, 24).src;

InlineToolbar.enterGroupImage = Graph.createSvgImage(24, 24,
	'<rect x="9" y="4" width="12" height="16" rx="2" stroke="black" stroke-width="2" ' +
	'fill="none"/><path d="M 2 12 H 14 M 10.5 8.5 L 14 12 L 10.5 15.5" stroke="black" ' +
	'stroke-width="2" fill="none"/>', 24, 24).src;

InlineToolbar.cropImage = Graph.createSvgImage(24, 24,
	'<path d="M 7 2 V 17 H 22 M 2 7 H 17 V 22" stroke="black" stroke-width="2" ' +
	'fill="none"/>', 24, 24).src;

InlineToolbar.noteImage = Graph.createSvgImage(24, 24,
	'<path d="M 5 4 H 19 V 14 L 14 20 H 5 Z M 14 20 V 14 H 19 M 8 8 H 16 M 8 11 H 13" ' +
	'stroke="black" stroke-width="2" stroke-linejoin="round" fill="none"/>', 24, 24).src;

InlineToolbar.dataImage = Graph.createSvgImage(24, 24,
	'<path d="M 4 7 H 8 M 11 7 H 20 M 4 12 H 8 M 11 12 H 20 M 4 17 H 8 M 11 17 H 20" ' +
	'stroke="black" stroke-width="2"/>', 24, 24).src;

InlineToolbar.polygonImage = Graph.createSvgImage(24, 24,
	'<path d="M 5 18 L 7 5 L 19 8 L 19 19 Z" stroke="black" stroke-width="2" ' +
	'stroke-linejoin="round" fill="none"/><path d="M 3.5 16.5 h 3 v 3 h -3 Z ' +
	'M 5.5 3.5 h 3 v 3 h -3 Z M 17.5 6.5 h 3 v 3 h -3 Z M 17.5 17.5 h 3 v 3 h -3 Z" ' +
	'fill="black"/>', 24, 24).src;

InlineToolbar.connectionPointsImage = Graph.createSvgImage(24, 24,
	'<rect x="5" y="5" width="14" height="14" stroke="black" stroke-width="2" ' +
	'fill="none"/><path d="M 10.5 3.5 L 13.5 6.5 M 13.5 3.5 L 10.5 6.5 M 10.5 17.5 ' +
	'L 13.5 20.5 M 13.5 17.5 L 10.5 20.5 M 3.5 10.5 L 6.5 13.5 M 6.5 10.5 L 3.5 13.5 ' +
	'M 17.5 10.5 L 20.5 13.5 M 20.5 10.5 L 17.5 13.5" stroke="black" stroke-width="1.5"/>',
	24, 24).src;

InlineToolbar.copyStyleImage = Graph.createSvgImage(24, 24,
	'<rect x="4" y="3" width="13" height="6" rx="1.5" stroke="black" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" fill="none"/>' +
	'<path d="M 17 6 H 20 V 12 H 11 V 15" stroke="black" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" fill="none"/>' +
	'<rect x="9" y="15" width="4" height="6" rx="1" fill="black"/>' +
	'<path d="M 19 21 V 15.5 M 16.8 17.5 L 19 15.3 L 21.2 17.5" stroke="black" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" fill="none"/>',
	24, 24).src;

InlineToolbar.pasteStyleImage = Graph.createSvgImage(24, 24,
	'<rect x="4" y="3" width="13" height="6" rx="1.5" stroke="black" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" fill="none"/>' +
	'<path d="M 17 6 H 20 V 12 H 11 V 15" stroke="black" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" fill="none"/>' +
	'<rect x="9" y="15" width="4" height="6" rx="1" fill="black"/>' +
	'<path d="M 19 15 V 20.5 M 16.8 18.5 L 19 20.7 L 21.2 18.5" stroke="black" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" fill="none"/>',
	24, 24).src;

InlineToolbar.roundedImage = Graph.createSvgImage(24, 24,
	'<path d="M 4 20 V 12 Q 4 4 12 4 H 20" stroke="black" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" fill="none"/>' +
	'<path d="M 20 8.5 V 9 M 20 12.5 V 13 M 20 16.5 V 17 M 20 20 H 19.5 M 16.5 20 H 16 ' +
	'M 12.5 20 H 12 M 8.5 20 H 8" stroke="black" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>', 24, 24).src;

InlineToolbar.glassImage = Graph.createSvgImage(24, 24,
	'<rect x="3" y="3" width="18" height="18" rx="3" stroke="black" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" fill="none"/>' +
	'<path d="M 5 11.5 Q 12 8 19 11.5 V 6.5 Q 19 5 17.5 5 H 6.5 Q 5 5 5 6.5 Z" ' +
	'fill="black" fill-opacity="0.35"/>', 24, 24).src;

InlineToolbar.flowAnimationImage = Graph.createSvgImage(24, 24,
	'<path d="M 3 12 H 5.5 M 8.5 12 H 11 M 14 12 H 18 M 15 7 L 20 12 L 15 17" stroke="black" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" ' +
	'fill="none"/>', 24, 24).src;

InlineToolbar.sketchImage = Graph.createSvgImage(24, 24,
	'<path d="M 4 5.5 C 8 4.6 14 5.4 20 4.8 M 19.4 4 C 19.9 9 19.2 14.5 19.8 20.2 ' +
	'M 20.5 19.6 C 14.5 19.1 9.5 20 3.6 19.4 M 4.3 20.3 C 3.8 15 4.6 10 4 4.4" stroke="black" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" ' +
	'fill="none"/><path d="M 7.5 16.5 L 11 8.5 M 11 16.5 L 14.5 8.5 M 14.5 16.5 L 16.5 12" ' +
	'stroke="black" stroke-width="1.5" stroke-linecap="round"/>', 24, 24).src;

InlineToolbar.shadowImage = Graph.createSvgImage(24, 24,
	'<rect x="7" y="7" width="14" height="14" rx="2" fill="black" fill-opacity="0.35"/>' +
	'<rect x="3" y="3" width="14" height="14" rx="2" stroke="black" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" fill="white"/>', 24, 24).src;

InlineToolbar.multipleImage = Graph.createSvgImage(24, 24,
	'<rect x="9" y="3" width="12" height="10" rx="1.5" stroke="black" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" fill="white"/>' +
	'<rect x="6" y="6" width="12" height="10" rx="1.5" stroke="black" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" fill="white"/>' +
	'<rect x="3" y="9" width="12" height="10" rx="1.5" stroke="black" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" fill="white"/>', 24, 24).src;

InlineToolbar.rotateWithEdgeImage = Graph.createSvgImage(24, 24,
	'<path d="M 3 21 L 21 3" stroke="black" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/><rect x="6.5" y="9.5" width="11" height="5" rx="1" ' +
	'transform="rotate(-45 12 12)" stroke="black" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" fill="white"/>', 24, 24).src;

InlineToolbar.dataSourcesImage = Graph.createSvgImage(24, 24,
	'<ellipse cx="12" cy="6" rx="7" ry="3" stroke="black" stroke-width="2" fill="none"/>' +
	'<path d="M 5 6 V 18 A 7 3 0 0 0 19 18 V 6 M 5 12 A 7 3 0 0 0 19 12" stroke="black" ' +
	'stroke-width="2" fill="none"/>', 24, 24).src;

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

	// Shapes of the shape picker for basic shapes (see isShapeSelection)
	this.shapeBtn = createButton(mxResources.get('shape'),
		InlineToolbar.shapeIcon, this.showShapeMenu);

	// Line endings (start/end arrow markers) of edges
	this.lineEndBtn = createButton(mxResources.get('lineend'),
		InlineToolbar.lineEndIcon, this.showLineEndMenu);

	// Connection style (routing/waypoints) of edges
	this.connStyleBtn = createButton(mxResources.get('connection'),
		InlineToolbar.connStyleIcon, this.showConnStyleMenu);

	// Text style of labels
	this.textBtn = createButton(mxResources.get('text'),
		InlineToolbar.textIcon, this.showTextMenu);

	// Rows, columns and borders of tables
	this.tableBtn = createButton(mxResources.get('table'),
		InlineToolbar.tableIcon, this.showTableMenu);

	// Align, distribute and group shapes
	this.arrangeBtn = createButton(mxResources.get('arrange'),
		InlineToolbar.arrangeIcon, this.showArrangeMenu);

	// Options of the selected cells (see getOptions)
	this.moreBtn = createButton(mxResources.get('more'),
		InlineToolbar.moreIcon, this.showMoreMenu);

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
		this.handleBounds = null;
		this.placement = null;
		this.callFromListener(this.repaint);
	});

	// Scrolling does not change the bounds of the selection
	this.scrollHandler = mxUtils.bind(this, function()
	{
		this.callFromListener(this.repaint);
	});

	this.modelHandler = mxUtils.bind(this, function()
	{
		this.updateSelection();
		this.callFromListener(this.updatePopover);
	});

	this.hideHandler = mxUtils.bind(this, function()
	{
		this.hide();
	});

	// The context menu closes the dropdown, also where no mousedown reaches
	// popoverCloseHandler (Shift+F10, the Menu key, a tap on touch devices or
	// a right click whose pointerdown the diagram consumes)
	this.contextMenuHandler = mxUtils.bind(this, function()
	{
		this.hidePopover();
	});

	this.graph.popupMenuHandler.addListener(mxEvent.SHOW, this.contextMenuHandler);
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

	// A gesture cancelled by the system has no mouse up (see isPointerDown)
	this.graph.addListener(mxEvent.CANCEL_MOUSE_GESTURE, this.selectionHandler);
	mxEvent.addListener(this.graph.container, 'scroll', this.scrollHandler);

	// The toolbar is not placed under the pointer (see getPointerPoint). In
	// the capture phase, as the handlers of the diagram may stop the events
	// and show the toolbar on the mouse up.
	this.pointerHandler = mxUtils.bind(this, function(evt)
	{
		this.pointerPoint = new mxPoint(mxEvent.getClientX(evt), mxEvent.getClientY(evt));
	});

	this.pointerLeaveHandler = mxUtils.bind(this, function()
	{
		this.pointerPoint = null;
	});

	var pointer = window.PointerEvent != null;
	this.pointerEvents = (pointer) ? ['pointerdown', 'pointermove', 'pointerup'] :
		['mousedown', 'mousemove', 'mouseup', 'touchstart', 'touchmove', 'touchend'];
	this.pointerLeaveEvent = (pointer) ? 'pointerleave' : 'mouseleave';

	for (var i = 0; i < this.pointerEvents.length; i++)
	{
		this.graph.container.addEventListener(this.pointerEvents[i], this.pointerHandler, true);
	}

	this.graph.container.addEventListener(this.pointerLeaveEvent, this.pointerLeaveHandler);

	// The default of the switch depends on the theme
	this.editorUi.addListener('currentThemeChanged', this.selectionHandler);
};

/**
 * Returns true if the toolbar is shown for the given selection cells: if
 * Editor.isInlineToolbarEnabled returns true, any selection without locked
 * cells or a single cell that can be unlocked (see isUnlockable), as before
 * the two switches were split again on 22 November 2026; a selection with a
 * shape also needs Editor.isShapeInlineToolbarEnabled, which a selection of
 * connectors does not (see isConnectorSelection), so that connectors, also
 * several with Bundle and Draw a tie, their labels and their ties keep the
 * toolbar in every theme (the driver, 22 November 2026: "nichts wegnehmen und nichts
 * hinzu bei der inline toolbar bedingungen").
 */
InlineToolbar.prototype.isToolbarSelection = function(cells)
{
	var result = cells.length > 0 && Editor.isInlineToolbarEnabled() &&
		(this.isConnectorSelection(cells) || Editor.isShapeInlineToolbarEnabled());

	if (result && cells.length == 1 && this.isUnlockable(cells[0]))
	{
		return true;
	}

	for (var i = 0; i < cells.length && result; i++)
	{
		result = !this.graph.isCellLocked(cells[i]);
	}

	return result;
};

/**
 * Returns true if the given cells are connectors, labels of connectors (see
 * Graph.isEdgeLabelCell) and ties of connectors (see Graph.isTie) only,
 * without a shape: the selections that Editor.isInlineToolbarEnabled switches
 * alone (see isToolbarSelection).
 */
InlineToolbar.prototype.isConnectorSelection = function(cells)
{
	var result = cells.length > 0;

	for (var i = 0; i < cells.length && result; i++)
	{
		result = this.graph.model.isEdge(cells[i]) ||
			this.graph.isEdgeLabelCell(cells[i]) ||
			this.graph.isTie(cells[i]);
	}

	return result;
};

/**
 * Returns true if the given cell is locked by its own style and not by a
 * locked layer or container, so that Lock/Unlock unlocks it.
 */
InlineToolbar.prototype.isUnlockable = function(cell)
{
	return mxUtils.getValue(this.graph.getCurrentCellStyle(cell), 'locked', '0') == '1' &&
		!this.graph.isCellLocked(this.graph.model.getParent(cell));
};

/**
 * Specifies if the toolbar is hidden, eg. while a shape picker is shown (see
 * EditorUi.showShapePicker). Default is false.
 */
InlineToolbar.prototype.suspended = false;

/**
 * Hides the toolbar while the given value is true and shows it for the
 * selection again when it is false.
 */
InlineToolbar.prototype.setSuspended = function(suspended)
{
	this.suspended = suspended;
	this.updateSelection();
};

/**
 * Returns true while a mouse button, a finger or a pen is down in the
 * diagram (mxGraph.isMouseDown). A press on a shape selects it on the mouse
 * down and then starts a move, which hides the toolbar until the mouse up
 * (see EditorUi), and a tap and hold of touch and pen changes the selection
 * while the finger is down (Graph), so the toolbar shows a new selection only
 * once the gesture ends: the mouse up of the graph handler and of the
 * handlers of the selection calls updateSelection, as does a cancelled
 * gesture.
 */
InlineToolbar.prototype.isPointerDown = function()
{
	return this.graph.isMouseDown;
};

/**
 * Returns true if the toolbar is shown or fading in.
 */
InlineToolbar.prototype.isShowing = function()
{
	return this.toolbar.style.display != 'none' && this.toolbar.style.opacity != '0';
};

/**
 * Updates visibility based on the current selection. While the pointer is
 * down, a new selection is not shown before the gesture ends (see
 * isPointerDown).
 */
InlineToolbar.prototype.updateSelection = function()
{
	var cells = this.graph.getSelectionCells();
	var state = null;
	this.selectionBounds = null;
	this.handleBounds = null;
	this.placement = null;

	if (!this.suspended && this.graph.isEnabled() && !this.graph.isEditing() &&
		!this.editorUi.isInlineToolbarSuppressed() && this.isToolbarSelection(cells))
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
			// The toolbar of other cells does not wait for a popover that
			// shrinks (see show)
			this.closingPopover = null;
			this.repaintAfterClose = false;
			this.hidePopover(true);
			this.placedBounds = null;
		}

		this.currentState = state;
		this.currentCells = cells;

		// A selection made while the pointer is down shows once the gesture
		// ends (see isPointerDown), so that a press does not show the toolbar
		// before the move it starts hides it. A toolbar that is shown for the
		// same cells stays, eg. while the diagram is panned.
		if (this.isPointerDown() && (!same || !this.isShowing()))
		{
			this.hide();
		}
		else
		{
			this.callFromListener(this.show);
		}
	}
	else
	{
		this.currentState = null;
		this.currentCells = null;
		this.hide();
	}
};

/**
 * Thread that throws the first error of the current event (see
 * callFromListener).
 */
InlineToolbar.prototype.errorThread = null;

/**
 * Calls the given function of this toolbar for a listener of the selection,
 * the model or the view or for the mouse up of a handler. If it fails, the
 * toolbar is hidden and the error is thrown after the event: an error in a
 * listener skips the listeners after it (see mxEventSource.fireEvent), so
 * that the change would not be marked as modified, saved, shared or undone,
 * and the move or resize that ends with the mouse up would be lost.
 */
InlineToolbar.prototype.callFromListener = function(fn)
{
	try
	{
		fn.call(this);
	}
	catch (e)
	{
		this.hide();

		// One for all listeners of an event, as each shows a dialog
		if (this.errorThread == null)
		{
			this.errorThread = window.setTimeout(mxUtils.bind(this, function()
			{
				this.errorThread = null;

				throw e;
			}), 0);
		}
	}
};

/**
 * Returns the given or selected cells that the options of the given kind
 * apply to: 'line' for the line of shapes and edges, 'fill' for the cells
 * with a fill, 'edge' for the line ends and the connection of edges,
 * 'arrange' for aligning, distributing and grouping shapes, 'table' for the
 * borders and stripes of tables and 'text' or null for all cells. Label
 * cells, such as the label cells of edges, only have text options so that
 * a selection with labels keeps the options of the other cells.
 */
InlineToolbar.prototype.getTargetCells = function(kind, cells)
{
	cells = (cells != null) ? cells : this.currentCells;
	var result = [];

	// Keeps the styles of the parents while the cells are checked: isTableRow
	// and isTableCell resolve the style of the parent of each cell, once per
	// child for many children of a cell with a long style
	this.graph.cacheChildLayoutStyles(mxUtils.bind(this, function()
	{
		for (var i = 0; cells != null && i < cells.length; i++)
		{
			var state = this.graph.view.getState(cells[i]);

			if (state != null && this.isTargetState(kind, state))
			{
				result.push(cells[i]);
			}
		}
	}));

	return result;
};

/**
 * Returns true if the options of the given kind apply to the given state
 * (see getTargetCells).
 */
InlineToolbar.prototype.isTargetState = function(kind, state)
{
	var graph = this.graph;
	var cell = state.cell;

	if (kind == null || kind == 'text')
	{
		return true;
	}
	else if (this.isLabelCell(cell))
	{
		return false;
	}
	else if (kind == 'fill')
	{
		return graph.isFillState(state);
	}
	else if (kind == 'edge')
	{
		return graph.model.isEdge(cell);
	}
	else if (kind == 'arrange')
	{
		return graph.model.isVertex(cell) && !graph.isTableRow(cell) &&
			!graph.isTableCell(cell);
	}
	else if (kind == 'table')
	{
		return graph.isTable(cell);
	}
	else
	{
		return true;
	}
};

/**
 * Returns the common style of the given cells or of the cells of the
 * current popover (see Graph.mergeStyle).
 */
InlineToolbar.prototype.getCurrentStyle = function(cells)
{
	cells = (cells != null) ? cells : this.getTargetCells(this.popoverKind);
	var style = {};
	var initial = true;

	for (var i = 0; i < cells.length; i++)
	{
		var state = this.graph.view.getState(cells[i]);

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
 * given cells or of all cells of the current popover.
 */
InlineToolbar.prototype.isSelectionState = function(fn, cells)
{
	cells = (cells != null) ? cells : this.getTargetCells(this.popoverKind);
	var result = cells.length > 0;

	for (var i = 0; result && i < cells.length; i++)
	{
		var state = this.graph.view.getState(cells[i]);
		result = state != null && fn(state);
	}

	return result;
};

/**
 * Returns true if all given cells or all cells of the current popover
 * are edges.
 */
InlineToolbar.prototype.isEdgeSelection = function(cells)
{
	return this.isSelectionState(mxUtils.bind(this, function(state)
	{
		return this.graph.model.isEdge(state.cell);
	}), cells);
};

/**
 * Returns true if the fill or, if gradient is true, the gradient of all
 * given cells or of all cells of the current popover can be changed.
 */
InlineToolbar.prototype.isFillSelection = function(gradient, cells)
{
	return this.isSelectionState(mxUtils.bind(this, function(state)
	{
		return (gradient) ? this.graph.isGradientState(state) :
			this.graph.isFillState(state);
	}), cells);
};

/**
 * Returns the given shapes that are groups or containers with children
 * (see Graph.getCellsForUngroup).
 */
InlineToolbar.prototype.getUngroupCells = function(cells)
{
	var result = [];

	for (var i = 0; i < cells.length; i++)
	{
		if (this.graph.model.getChildCount(cells[i]) > 0 &&
			!this.graph.isTable(cells[i]))
		{
			result.push(cells[i]);
		}
	}

	return result;
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
 * Shows the buttons that apply to some of the selected cells (see
 * getTargetCells) and returns true if a button is shown.
 */
InlineToolbar.prototype.updateButtons = function()
{
	var lines = this.getTargetCells('line');
	var fills = this.getTargetCells('fill');
	var edges = this.getTargetCells('edge');
	var shapes = this.getTargetCells('arrange');
	var arrange = shapes.length > 1 || this.getUngroupCells(shapes).length > 0;
	var options = this.getOptions();
	var label = false;

	for (var i = 0; i < this.currentCells.length && !label; i++)
	{
		label = this.hasLabel(this.currentCells[i]);
	}

	// A locked cell only has the option to unlock it
	var unlocked = this.currentCells.length != 1 ||
		!this.isUnlockable(this.currentCells[0]);

	var display = function(visible)
	{
		return (visible) ? 'inline-block' : 'none';
	};

	// Edges with a fill have the fill options in the line popover
	this.lineStyleBtn.style.display = display(unlocked && lines.length > 0);
	this.fillBtn.style.display = display(unlocked && fills.length > 0 &&
		!this.isEdgeSelection(fills));
	this.shapeBtn.style.display = display(unlocked && this.isShapeSelection());
	this.lineEndBtn.style.display = display(unlocked && edges.length > 0);
	this.connStyleBtn.style.display = display(unlocked && edges.length > 0);
	this.textBtn.style.display = display(unlocked);
	this.tableBtn.style.display = display(unlocked && this.getTableRange() != null);
	this.arrangeBtn.style.display = display(unlocked && arrange);
	// More has the order and the actions (see showSimpleMoreMenu)
	this.moreBtn.style.display = display(options.length > 0 || (unlocked &&
		this.currentCells.length > 0));

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

	return (unlocked && (lines.length > 0 || label)) || options.length > 0;
};

/**
 * Returns true if the given point has coordinates. The points of an edge have
 * none for a style value that is no number, eg. exitX=abc.
 */
InlineToolbar.prototype.isFinitePoint = function(pt)
{
	return pt != null && isFinite(pt.x) && isFinite(pt.y);
};

/**
 * Returns true if the given rectangle has a place and a size. The bounds of
 * a shape and its handles have none for a style value that is no number (eg.
 * strokeWidth=2px or rotation=abc), or if the style has no value for a custom
 * handle, as mxRectangle calculates with what it gets.
 */
InlineToolbar.prototype.isFiniteBounds = function(rect)
{
	return rect != null && isFinite(rect.x) && isFinite(rect.y) &&
		isFinite(rect.width) && isFinite(rect.height);
};

/**
 * Computes the midpoint along the edge path, without the points that have no
 * coordinates (see isFinitePoint). Returns null if there is none.
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
		if (this.isFinitePoint(pts[i]) && this.isFinitePoint(pts[i - 1]))
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

			if (this.isFinitePoint(p1) && this.isFinitePoint(p2))
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

	if (this.isFinitePoint(first) && this.isFinitePoint(last))
	{
		return new mxPoint((first.x + last.x) / 2, (first.y + last.y) / 2);
	}

	return null;
};

/**
 * Toolbar fade animation duration in ms. Default is 0: the toolbar appears
 * and disappears at once in every theme, as in Fusion (motion catalogue,
 * concept 3.8: no entrance effects; the driver, 19 November 2026: Fusion is
 * the reference of the toolbar). It faded in and out in 150 ms before.
 */
InlineToolbar.prototype.toolbarAnimDuration = 0;

/**
 * Shows the toolbar with a fade-in.
 */
InlineToolbar.prototype.show = function()
{
	// While a popover shrinks towards its button after a change made in it,
	// the toolbar keeps its buttons and its place: both change after that
	// (see popoverClosed), so that the button stays where the popover goes
	if (this.closingPopover != null && this.isShowing())
	{
		this.repaintAfterClose = true;

		return;
	}

	// Label cells without a label have no options. The checks of all buttons
	// share the styles of the parents (see getTargetCells).
	if (!this.graph.cacheChildLayoutStyles(mxUtils.bind(this, this.updateButtons)))
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

		// Force layout then fade in, unless there is no place for it
		if (this.placedBounds != null)
		{
			this.toolbar.offsetHeight;
			this.toolbar.style.transition = 'opacity ' + this.toolbarAnimDuration + 'ms ease-out';
			this.toolbar.style.opacity = '0.9';
		}
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
	this.closingPopover = null;
	this.repaintAfterClose = false;
	this.hidePopover(true);
	this.placedBounds = null;

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
 * Returns true if the given handle shape is shown. A handle without a place
 * (see isFiniteBounds) is not.
 */
InlineToolbar.prototype.isHandleVisible = function(shape)
{
	return shape != null && shape.node != null && this.isFiniteBounds(shape.bounds) &&
		shape.node.style.visibility != 'hidden' &&
		shape.node.style.display != 'none';
};

/**
 * Adds the bounds of the visible handles and the link hint of the given
 * vertex, edge or multiple selection handler to the given array.
 */
InlineToolbar.prototype.addHandleBounds = function(handler, result)
{
	var shapes = [].concat(handler.sizers || [], handler.bends || [],
		handler.virtualBends || [], handler.moveHandles || [],
		handler.cornerHandles || []);

	// The sizers of vertices contain the label and rotation handles
	if (mxUtils.indexOf(shapes, handler.labelShape) < 0)
	{
		shapes.push(handler.labelShape);
	}

	if (mxUtils.indexOf(shapes, handler.rotationShape) < 0)
	{
		shapes.push(handler.rotationShape);
	}

	if (handler.customHandles != null)
	{
		// Handlers keep null entries for custom handles that are not
		// created (see mxVertexHandler)
		for (var i = 0; i < handler.customHandles.length; i++)
		{
			if (handler.customHandles[i] != null)
			{
				shapes.push(handler.customHandles[i].shape);
			}
		}
	}

	for (var i = 0; i < shapes.length; i++)
	{
		if (this.isHandleVisible(shapes[i]))
		{
			result.push(shapes[i].bounds);
		}
	}

	var hint = handler.linkHint;
	var container = this.graph.container;

	if (hint != null && hint.parentNode == container && hint.style.display != 'none')
	{
		var origin = container.getBoundingClientRect();
		var rect = hint.getBoundingClientRect();
		result.push(new mxRectangle(rect.left - origin.left - container.clientLeft +
			container.scrollLeft, rect.top - origin.top - container.clientTop +
			container.scrollTop, rect.width, rect.height));
	}
};

/**
 * Returns the bounds of the elements that the toolbar must not cover: the
 * visible handles of all selection handlers, which include the handlers
 * of the tables and groups of the selected cells, and the folding icons
 * and overlays of the selected cells.
 */
InlineToolbar.prototype.getHandleBounds = function()
{
	var cellsHandler = this.graph.selectionCellsHandler;
	var result = [];

	cellsHandler.handlers.visit(mxUtils.bind(this, function(key, handler)
	{
		this.addHandleBounds(handler, result);
	}));

	if (cellsHandler.multiSelectionHandler != null)
	{
		this.addHandleBounds(cellsHandler.multiSelectionHandler, result);
	}

	var addShape = mxUtils.bind(this, function(key, shape)
	{
		if (this.isHandleVisible(shape))
		{
			result.push(shape.bounds);
		}
	});

	for (var i = 0; i < this.currentCells.length; i++)
	{
		var state = this.graph.view.getState(this.currentCells[i]);

		if (state != null)
		{
			addShape(null, state.control);

			if (state.overlays != null)
			{
				state.overlays.visit(addShape);
			}
		}
	}

	return result;
};

/**
 * Returns the area of the given cell that the toolbar does not cover: the
 * shape, its label, the visible handles and, for vertices, the space of the
 * connection arrows around the shape (see HoverIcons.repaint). Takes the
 * bounds of the state if those of the shape are no numbers and returns null
 * if those of the state are none either (see isFiniteBounds).
 */
InlineToolbar.prototype.getCellBounds = function(state)
{
	var graph = this.graph;
	var hoverIcons = this.editorUi.hoverIcons;
	var handler = graph.selectionCellsHandler.getHandler(state.cell);
	var bounds = (state.shape != null && this.isFiniteBounds(
		state.shape.boundingBox)) ? state.shape.boundingBox : state;

	if (!this.isFiniteBounds(bounds))
	{
		return null;
	}

	var shape = mxRectangle.fromRectangle(bounds);
	var result = shape.clone();

	if (state.text != null && this.isFiniteBounds(state.text.boundingBox))
	{
		result.add(state.text.boundingBox);
	}

	if (handler != null)
	{
		var handles = [];
		this.addHandleBounds(handler, handles);

		for (var i = 0; i < handles.length; i++)
		{
			result.add(handles[i]);
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

		if (this.isHandleVisible(rotation) && rotation.bounds.x < cx + arrowWidth / 2 &&
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
 * (see getCellBounds) with the handles of the box around multiple
 * selected cells, or null if none of the cells has an area.
 */
InlineToolbar.prototype.getSelectionBounds = function()
{
	var handler = this.graph.selectionCellsHandler.multiSelectionHandler;
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
			else if (bounds != null)
			{
				result.add(bounds);
			}
		}
	}

	if (result != null && handler != null)
	{
		var handles = [];
		this.addHandleBounds(handler, handles);

		for (var i = 0; i < handles.length; i++)
		{
			result.add(handles[i]);
		}
	}

	return result;
};

/**
 * Repositions the toolbar next to the selected vertex or along the edge,
 * avoiding overlap with the pointer, handles, connection arrows, edge
 * segments and other cells (see getPosition). Hides it if the selected cells
 * have no place, eg. if their geometry is no number.
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

			// A single edge has the toolbar at its midpoint, other selections
			// above the area of the selected cells
			var edge = this.currentCells.length == 1 && this.graph.model.isEdge(state.cell);

			// The bounds are kept while the diagram is scrolled
			if (this.handleBounds == null)
			{
				this.handleBounds = this.getHandleBounds();
			}

			if (!edge && this.selectionBounds == null)
			{
				this.selectionBounds = this.getSelectionBounds();
			}

			var mid = (edge) ? this.getEdgeMidpoint(state) : null;
			var area = (edge) ? ((mid != null) ? new mxRectangle(mid.x, mid.y, 0, 0) :
				null) : this.selectionBounds;

			var pt = (this.isFiniteBounds(area)) ?
				this.getPosition(state, area, edge) : null;

			if (pt != null)
			{
				this.toolbar.style.left = Math.round(pt.x) + 'px';
				this.toolbar.style.top = Math.round(pt.y) + 'px';
				this.placedBounds = new mxRectangle(Math.round(pt.x), Math.round(pt.y),
					this.toolbar.offsetWidth, this.toolbar.offsetHeight);

				// Keeps the popover at its button
				if (this.positionPopover != null)
				{
					this.positionPopover();
				}
			}
			else
			{
				this.hide();
			}
		}
	}
};

/**
 * Returns the position of the toolbar for the given area, which is the
 * midpoint of the given edge or the area of the selected cells: the nearest
 * of the positions of getCandidates, which are along the whole edge and
 * around the label for an edge and around the area for other selections,
 * that is not under the pointer and covers no handles, no area of the
 * selected cells, no segments and labels of the edge and no other cells
 * (see getObstacles). Without such a position, the one that is not under
 * the pointer, covers the fewest handles, then not the selection and then
 * the least of the other cells (see getCoverage). A toolbar that is shown
 * for the selected cells stays where it is while that is one of these
 * positions and covers nothing but the pointer on its way to the toolbar
 * (see pointerSpacing); a pointer on the toolbar is not avoided where it
 * moves. The positions are clamped
 * to the viewport before they are checked, so the toolbar is never moved
 * onto a handle or a cell afterwards. This checks a fixed number of
 * positions against the handles and the cells in the viewport, which is
 * linear in their number. Returns null if there is no position and the area
 * is outside the viewport.
 */
InlineToolbar.prototype.getPosition = function(state, area, edge)
{
	var container = this.graph.container;
	var w = this.toolbar.offsetWidth;
	var h = this.toolbar.offsetHeight;
	var gap = (edge) ? this.offset : this.vertexOffset;

	// Space around the toolbar that must be free. Less than the gap for
	// shapes as the area of the selected cells contains their handles.
	var pad = (edge) ? 8 : this.vertexOffset / 2;

	// Not clamped while the edge midpoint or the selection is outside the
	// viewport so that the toolbar moves out of view with the cells when
	// the diagram is panned or scrolled
	var viewport = new mxRectangle(container.scrollLeft, container.scrollTop,
		container.clientWidth - this.getRightInset(),
		container.clientHeight - this.getBottomInset());
	var clamp = (edge) ? mxUtils.contains(viewport, area.x, area.y) :
		mxUtils.intersects(viewport, area);
	var minX = viewport.x + 4;
	var maxX = viewport.x + viewport.width - w - 4;
	var minY = viewport.y + 4 + this.getTopInset();
	var maxY = viewport.y + viewport.height - h - 4;

	// Only handles in the viewport can be covered
	var handles = [];

	for (var i = 0; i < this.handleBounds.length; i++)
	{
		if (mxUtils.intersects(viewport, this.handleBounds[i]))
		{
			handles.push(this.handleBounds[i]);
		}
	}

	// The positions and the other cells are kept while the diagram is
	// scrolled, as the handles
	var placement = this.getPlacement(state, area, edge, w, h, gap, pad);
	var candidates = placement.candidates;

	// The pointer, but not for the place of the toolbar while the pointer is
	// on it or on the way to it, so that the toolbar does not move away from
	// it, and not while it is on the toolbar, which may then move under it
	// (eg. while the selected cells are moved with the keyboard). Only if
	// the pointer moved since the toolbar was placed, as the toolbar moves
	// to the pointer if the diagram moves before it is scrolled back.
	var pointer = this.getPointerPoint();
	var near = false;

	if (pointer != null && this.placedBounds != null &&
		this.pointerPoint !== this.placedPointer)
	{
		var placed = mxRectangle.fromRectangle(this.placedBounds);

		if (mxUtils.contains(placed, pointer.x, pointer.y))
		{
			pointer = null;
		}
		else
		{
			placed.grow(this.pointerSpacing);
			near = mxUtils.contains(placed, pointer.x, pointer.y);
		}
	}

	var best = null;
	var bestCost = null;
	var bestSide = null;

	// Returns the given position, clamped to the viewport
	var clampPoint = function(x, y)
	{
		if (clamp)
		{
			x = (maxX > minX) ? Math.max(minX, Math.min(x, maxX)) : x;
			y = (maxY > minY) ? Math.max(minY, Math.min(y, maxY)) : y;
		}

		return new mxPoint(x, y);
	};

	// Returns the cost of the given position: the pointer, unless it is
	// ignored, the number of handles, the selection and the other cells that
	// it covers. Stops adding the other cells once it costs more than the
	// given cost.
	var getCost = mxUtils.bind(this, function(pt, limit, ignorePointer)
	{
		var rect = new mxRectangle(pt.x - pad, pt.y - pad, w + 2 * pad, h + 2 * pad);
		var cost = [(!ignorePointer && pointer != null && mxUtils.contains(rect,
			pointer.x, pointer.y)) ? 1 : 0, 0, 0, 0];

		for (var i = 0; i < handles.length; i++)
		{
			if (mxUtils.intersects(rect, handles[i]))
			{
				cost[1]++;
			}
		}

		cost[2] = (((edge) ? this.coversEdge(state, rect) :
			mxUtils.intersects(rect, area))) ? 1 : 0;

		var c = 0;

		for (var i = 0; i < 3 && limit != null && c == 0; i++)
		{
			c = cost[i] - limit[i];
		}

		if (c <= 0)
		{
			cost[3] = this.getObstacleCost(rect, placement,
				(limit != null && c == 0) ? limit[3] : null);
		}

		return cost;
	});

	var isFree = function(cost)
	{
		return cost[0] == 0 && cost[1] == 0 && cost[2] == 0 && cost[3] == 0;
	};

	// Keeps the best position and its side of the area and returns true if
	// it covers nothing
	var check = mxUtils.bind(this, function(x, y, side)
	{
		var pt = clampPoint(x, y);
		var cost = getCost(pt, bestCost);

		if (best == null || this.compareCosts(cost, bestCost) < 0)
		{
			best = pt;
			bestCost = cost;
			bestSide = (side != null) ? side : null;
		}

		return isFree(cost);
	});

	// The toolbar stays where it is for the selected cells while that is
	// one of their positions and covers nothing, eg. while their style
	// changes, a popover is open or the pointer is on the toolbar
	if (this.placedBounds != null)
	{
		for (var i = 0; i < candidates.length; i++)
		{
			var pt = clampPoint(candidates[i].x, candidates[i].y);

			if (Math.abs(Math.round(pt.x) - this.placedBounds.x) < 1 &&
				Math.abs(Math.round(pt.y) - this.placedBounds.y) < 1)
			{
				if (isFree(getCost(pt, null, near)))
				{
					this.toolbarSide = candidates[i].side;

					return pt;
				}

				break;
			}
		}
	}

	for (var i = 0; i < candidates.length; i++)
	{
		if (check(candidates[i].x, candidates[i].y, candidates[i].side))
		{
			break;
		}
	}

	// The clamped positions are on handles, eg. if the selection is larger
	// than the viewport, or there are none, so the corners of the viewport
	// are checked
	if (clamp && (best == null || bestCost[1] > 0))
	{
		check(minX, minY) || check(maxX, minY) ||
			check(minX, maxY) || check(maxX, maxY);
	}

	this.toolbarSide = bestSide;
	this.placedPointer = (pointer != null) ? this.pointerPoint : null;

	return best;
};

/**
 * Distance in pixels around the placed toolbar in which the pointer is on
 * its way to the toolbar, so that the toolbar does not move away from it
 * while it can stay where it is (see getPosition).
 */
InlineToolbar.prototype.pointerSpacing = 16;

/**
 * Returns a negative number if the first of the given costs of a position
 * (see getPosition) is lower than the second, a positive number if it is
 * higher and 0 if both are equal: the pointer, then the handles, then the
 * selection and then the other cells.
 */
InlineToolbar.prototype.compareCosts = function(a, b)
{
	for (var i = 0; i < a.length; i++)
	{
		if (Math.abs(a[i] - b[i]) > 1e-6)
		{
			return a[i] - b[i];
		}
	}

	return 0;
};

/**
 * Size in pixels of the cells of the grid of the other cells near the
 * selection (see getPlacement).
 */
InlineToolbar.prototype.placementGridSize = 64;

/**
 * Number of cells of the grid of the other cells (see getPlacement) above
 * which another cell is not added to the grid but checked for every
 * position, so that the grid does not grow with the area of the selection
 * and the other cells, eg. of a long connector next to a large selection.
 */
InlineToolbar.prototype.placementGridLimit = 64;

/**
 * Distance in pixels from the origin of the view up to which the toolbar
 * checks other cells (see getPlacement). Browsers place elements and scroll
 * up to 2^25 device pixels, which are 2^27 pixels at a zoom of the browser
 * of 25 %, so no position further away is on the screen. The coordinates are
 * those of the file and can be any number, but the columns and rows of the
 * grid must be exact integers: from 2^53 on, adding 1 may not change a number
 * and a loop over them may not end.
 */
InlineToolbar.prototype.placementLimit = 134217728;

/**
 * Returns the positions of the toolbar of the given size for the given
 * selection (see getCandidates) and the other cells that they may cover
 * (see getObstacles) with a grid of these cells and the large cells (see
 * placementGridLimit and getObstacleCost), in the part of the diagram that
 * can be on the screen (see placementLimit). It is kept until the selection,
 * the view or the size of the toolbar change.
 */
InlineToolbar.prototype.getPlacement = function(state, area, edge, w, h, gap, pad)
{
	var placement = this.placement;

	if (placement == null || placement.w != w || placement.h != h)
	{
		var candidates = this.getCandidates(state, area, edge, w, h, gap);
		var max = this.placementLimit;
		var region = null;

		var limit = function(value)
		{
			return Math.max(-max, Math.min(max, value));
		};

		// Each position is limited before it is added, as adding one that is
		// far away to the region would lose the digits of the near ones
		for (var i = 0; i < candidates.length; i++)
		{
			var x = candidates[i].x - pad;
			var y = candidates[i].y - pad;

			if (!isNaN(x) && !isNaN(y))
			{
				var rect = new mxRectangle(limit(x), limit(y), 0, 0);
				rect.width = limit(x + w + 2 * pad) - rect.x;
				rect.height = limit(y + h + 2 * pad) - rect.y;

				if (region == null)
				{
					region = rect;
				}
				else
				{
					region.add(rect);
				}
			}
		}

		var obstacles = (region != null) ? this.getObstacles(new mxPoint(
			area.getCenterX(), area.getCenterY()), region) : [];
		var size = this.placementGridSize;
		var x0 = (region != null) ? Math.floor(region.x / size) : 0;
		var y0 = (region != null) ? Math.floor(region.y / size) : 0;
		var cols = (region != null) ? Math.floor((region.x + region.width) / size) - x0 + 1 : 0;
		var rows = (region != null) ? Math.floor((region.y + region.height) / size) - y0 + 1 : 0;
		var grid = [];
		var large = [];

		// The cells of the grid that each other cell intersects in the region,
		// or the large cells
		for (var i = 0; i < obstacles.length; i++)
		{
			var b = obstacles[i].bounds;
			var c0 = Math.max(0, Math.floor(b.x / size) - x0);
			var c1 = Math.min(cols - 1, Math.floor((b.x + b.width) / size) - x0);
			var r0 = Math.max(0, Math.floor(b.y / size) - y0);
			var r1 = Math.min(rows - 1, Math.floor((b.y + b.height) / size) - y0);

			// Outside of the grid, eg. a rotated cell whose state is in the region
			if (!(c0 <= c1 && r0 <= r1))
			{
				continue;
			}

			if ((c1 - c0 + 1) * (r1 - r0 + 1) > this.placementGridLimit)
			{
				large.push(i);
				continue;
			}

			for (var c = c0; c <= c1; c++)
			{
				for (var r = r0; r <= r1; r++)
				{
					var key = c * rows + r;

					if (grid[key] == null)
					{
						grid[key] = [];
					}

					grid[key].push(i);
				}
			}
		}

		placement = {w: w, h: h, candidates: candidates, obstacles: obstacles,
			grid: grid, large: large, size: size, x0: x0, y0: y0, cols: cols,
			rows: rows, seen: [], stamp: 0};
		this.placement = placement;
	}

	return placement;
};

/**
 * Returns how much the given rectangle covers the other cells of the given
 * placement (see getPlacement and getCoverage), the large cells and the
 * cells in the cells of its grid that the rectangle intersects. Stops once
 * it is more than the given limit, if any.
 */
InlineToolbar.prototype.getObstacleCost = function(rect, placement, limit)
{
	var size = placement.size;
	var stamp = ++placement.stamp;
	var c0 = Math.max(0, Math.floor(rect.x / size) - placement.x0);
	var c1 = Math.min(placement.cols - 1, Math.floor((rect.x + rect.width) / size) - placement.x0);
	var r0 = Math.max(0, Math.floor(rect.y / size) - placement.y0);
	var r1 = Math.min(placement.rows - 1, Math.floor((rect.y + rect.height) / size) - placement.y0);
	var cost = 0;

	for (var i = 0; i < placement.large.length; i++)
	{
		cost += this.getCoverage(rect, placement.obstacles[placement.large[i]]);

		if (limit != null && cost > limit + 1e-6)
		{
			return cost;
		}
	}

	for (var c = c0; c <= c1; c++)
	{
		for (var r = r0; r <= r1; r++)
		{
			var cell = placement.grid[c * placement.rows + r];

			for (var i = 0; cell != null && i < cell.length; i++)
			{
				if (placement.seen[cell[i]] != stamp)
				{
					placement.seen[cell[i]] = stamp;
					cost += this.getCoverage(rect, placement.obstacles[cell[i]]);

					if (limit != null && cost > limit + 1e-6)
					{
						return cost;
					}
				}
			}
		}
	}

	return cost;
};

/**
 * Returns the positions of the toolbar of the given size to check (see
 * getPosition), sorted by their rank: for an edge above, below, left and
 * right of its midpoint (the given area) at growing distances, of points
 * every 24 pixels along the edge up to 240 pixels from the midpoint and
 * every 96 pixels further away, of the middle of each segment further away
 * and of the label (see getEdgeAnchors), so that there are positions on
 * both sides of every segment and along long segments; for other selections above,
 * below, left and right of the given area, centered and moved along its
 * side in steps of 16 pixels. Each position is an object with x, y, the
 * side of the point or the area and the rank: the distance from the point
 * or the area and half the distance of the point from the midpoint along
 * the edge or half the distance it is moved along the side. Positions of
 * the same rank keep their order: above, below, left, right. Positions that
 * are no numbers are left out, as they can be neither checked nor sorted.
 */
InlineToolbar.prototype.getCandidates = function(state, area, edge, w, h, gap)
{
	var result = [];

	var add = function(x, y, side, rank)
	{
		if (isFinite(x) && isFinite(y) && isFinite(rank))
		{
			result.push({x: x, y: y, side: side, rank: rank, index: result.length});
		}
	};

	if (edge)
	{
		var anchors = this.getEdgeAnchors(state, area);

		for (var i = 0; i < anchors.length; i++)
		{
			var r = anchors[i].bounds;
			var cx = r.getCenterX();
			var cy = r.getCenterY();

			// Farther from the midpoint than from points along the edge
			var max = (anchors[i].along == 0) ? 100 : gap + 32;

			for (var d = gap; d < max; d += 8)
			{
				var rank = d + anchors[i].along / 2;
				add(cx - w / 2, r.y - h - d, 'above', rank);
				add(cx - w / 2, r.y + r.height + d, 'below', rank);
				add(r.x - w - d, cy - h / 2, 'left', rank);
				add(r.x + r.width + d, cy - h / 2, 'right', rank);
			}
		}
	}
	else
	{
		var cx = area.getCenterX();
		var cy = area.getCenterY();
		var maxDx = Math.min(192, (w + area.width) / 2);
		var maxDy = Math.min(192, (h + area.height) / 2);

		for (var d = gap; d < 100; d += 8)
		{
			for (var s = 0; s <= Math.max(maxDx, maxDy); s += 16)
			{
				for (var sign = (s == 0) ? 1 : -1; sign <= 1; sign += 2)
				{
					var rank = d + s / 2;

					if (s <= maxDx)
					{
						add(cx - w / 2 + sign * s, area.y - h - d, 'above', rank);
						add(cx - w / 2 + sign * s, area.y + area.height + d, 'below', rank);
					}

					if (s <= maxDy)
					{
						add(area.x - w - d, cy - h / 2 + sign * s, 'left', rank);
						add(area.x + area.width + d, cy - h / 2 + sign * s, 'right', rank);
					}
				}
			}
		}
	}

	result.sort(function(a, b)
	{
		return (a.rank - b.rank) || (a.index - b.index);
	});

	return result;
};

/**
 * Returns the places of the given edge with the given midpoint that the
 * toolbar is placed around (see getCandidates), as objects with the
 * bounds of the place and its distance from the midpoint along the edge
 * (along): the midpoint, points every 24 pixels up to 240 pixels on both
 * sides of it, then every 96 pixels up to 2544 pixels, the middle of the
 * 16 nearest segments that are further away and the label of the edge.
 */
InlineToolbar.prototype.getEdgeAnchors = function(state, mid)
{
	var result = [{bounds: mxRectangle.fromRectangle(mid), along: 0}];
	var pts = state.absolutePoints;

	if (pts != null && pts.length > 1)
	{
		var lengths = [];
		var total = 0;

		for (var i = 1; i < pts.length; i++)
		{
			var len = (this.isFinitePoint(pts[i]) && this.isFinitePoint(pts[i - 1])) ?
				Math.sqrt(Math.pow(pts[i].x - pts[i - 1].x, 2) +
				Math.pow(pts[i].y - pts[i - 1].y, 2)) : 0;
			lengths.push(len);
			total += len;
		}

		// The point at the given distance from the start of the edge
		var pointAt = function(dist)
		{
			for (var i = 0; i < lengths.length; i++)
			{
				if (lengths[i] > 0 && (dist <= lengths[i] || i == lengths.length - 1))
				{
					var f = Math.max(0, Math.min(1, dist / lengths[i]));

					return new mxPoint(pts[i].x + (pts[i + 1].x - pts[i].x) * f,
						pts[i].y + (pts[i + 1].y - pts[i].y) * f);
				}

				dist -= lengths[i];
			}

			return null;
		};

		var addPoint = function(dist, along)
		{
			var pt = pointAt(dist);

			if (pt != null)
			{
				result.push({bounds: new mxRectangle(pt.x, pt.y, 0, 0), along: along});
			}
		};

		var half = total / 2;

		for (var along = 24; along <= 240 && along <= half; along += 24)
		{
			addPoint(half - along, along);
			addPoint(half + along, along);
		}

		// Points further away for the free parts of long segments
		for (var along = 336, n = 0; along <= half && n < 24; along += 96, n++)
		{
			addPoint(half - along, along);
			addPoint(half + along, along);
		}

		// The middle of the segments that are further away, nearest first
		var middles = [];
		var start = 0;

		for (var i = 0; i < lengths.length; i++)
		{
			var along = Math.abs(start + lengths[i] / 2 - half);

			if (lengths[i] > 0 && along > 240)
			{
				middles.push({dist: start + lengths[i] / 2, along: along});
			}

			start += lengths[i];
		}

		middles.sort(function(a, b)
		{
			return a.along - b.along;
		});

		for (var i = 0; i < middles.length && i < 16; i++)
		{
			addPoint(middles[i].dist, middles[i].along);
		}
	}

	if (state.text != null && state.text.boundingBox != null)
	{
		var label = mxRectangle.fromRectangle(state.text.boundingBox);
		result.push({bounds: label, along: Math.sqrt(Math.pow(label.getCenterX() -
			mid.getCenterX(), 2) + Math.pow(label.getCenterY() - mid.getCenterY(), 2))});
	}

	return result;
};

/**
 * Returns the other cells that the toolbar should not cover (see
 * getPosition) as objects with the bounds of the cell and its label
 * (bounds), of its shape (shape) and its label (text), which are those of
 * the view and are kept until the view changes (see getPlacement), and, for
 * edges, its points (pts), the half width of its line (spacing), the bounds
 * of its arrows (markers, see getEdgeMarkers) and their length: the cells
 * with a shape or a label but the selected cells, their descendants, which
 * include the labels of edges, and their ancestors, whose shape or label
 * is in the given region. Shapes behind the selected cells that contain
 * the given point of the selection are covered by every position near the
 * selection and are left out.
 */
InlineToolbar.prototype.getObstacles = function(pt, region)
{
	var model = this.graph.model;
	var scale = this.graph.view.scale;

	// By the ids of the cells, which come from the diagram, without a
	// prototype so that ids such as constructor are not found there
	var selected = Object.create(null);
	var ancestors = Object.create(null);
	var result = [];

	var getPath = function(cell)
	{
		return mxCellPath.create(cell).split(mxCellPath.PATH_SEPARATOR);
	};

	// Returns true if the given cell is painted before the selected cells,
	// which are sorted once if there is such a cell (see mxUtils.sortCells)
	var first = null;

	var isBehind = mxUtils.bind(this, function(cell)
	{
		if (first == null)
		{
			first = getPath(mxUtils.sortCells(this.currentCells.slice(), true)[0]);
		}

		return mxCellPath.compare(getPath(cell), first) < 0;
	});

	for (var i = 0; i < this.currentCells.length; i++)
	{
		selected[this.currentCells[i].id] = true;
		var parent = model.getParent(this.currentCells[i]);

		while (parent != null)
		{
			ancestors[parent.id] = true;
			parent = model.getParent(parent);
		}
	}

	// The region grown by the strokes and markers of the shapes, whose
	// bounds can be larger than those of their states
	var x0 = region.x - 10;
	var y0 = region.y - 10;
	var x1 = region.x + region.width + 10;
	var y1 = region.y + region.height + 10;

	var inRegion = function(b)
	{
		return b != null && b.x < x1 && b.x + b.width > x0 && b.y < y1 && b.y + b.height > y0;
	};

	this.graph.view.states.visit(mxUtils.bind(this, function(key, state)
	{
		var cell = state.cell;
		var text = (state.text != null) ? state.text.boundingBox : null;

		// The bounds of the state first, which are the most common, then
		// those of the shape, which can be rotated
		if ((state.shape == null && text == null) || !((state.shape != null &&
			(inRegion(state) || inRegion(state.shape.boundingBox))) ||
			inRegion(text)) || selected[cell.id] || ancestors[cell.id])
		{
			return;
		}

		for (var parent = model.getParent(cell); parent != null;
			parent = model.getParent(parent))
		{
			if (selected[parent.id])
			{
				return;
			}
		}

		var edge = model.isEdge(cell);
		var shape = (state.shape != null) ? ((state.shape.boundingBox != null) ?
			state.shape.boundingBox : state) : null;

		if (!edge && shape != null && mxUtils.contains(shape, pt.x, pt.y) &&
			isBehind(cell))
		{
			return;
		}

		var bounds = mxRectangle.fromRectangle((shape != null) ? shape : text);

		if (shape != null && text != null)
		{
			bounds.add(text);
		}

		var obstacle = {bounds: bounds, shape: shape, text: text};

		if (edge && state.absolutePoints != null)
		{
			var pts = this.getPaintedPoints(state);
			var sw = (state.shape != null && !isNaN(state.shape.strokewidth)) ?
				Math.max(0, state.shape.strokewidth) : 1;
			var width = (state.shape != null && typeof state.shape.getEdgeWidth ===
				'function') ? state.shape.getEdgeWidth() + sw : sw;
			obstacle.pts = pts;
			obstacle.spacing = (isNaN(width)) ? sw * scale / 2 : width * scale / 2;
			obstacle.markers = this.getEdgeMarkers(state, sw);
			obstacle.length = 0;

			for (var i = 1; i < pts.length; i++)
			{
				if (pts[i] != null && pts[i - 1] != null)
				{
					obstacle.length += Math.sqrt(Math.pow(pts[i].x - pts[i - 1].x, 2) +
						Math.pow(pts[i].y - pts[i - 1].y, 2));
				}
			}

			for (var i = 0; i < obstacle.markers.length; i++)
			{
				obstacle.length += obstacle.markers[i].length;
			}
		}

		result.push(obstacle);
	}));

	return result;
};

/**
 * Returns the points of the line that the given edge state paints: its
 * absolute points, or points along the curve of a curved or bezier
 * connector (see mxPolyline.paintCurvedLine and paintBezierLine), whose
 * curve leaves the straight lines between its points.
 */
InlineToolbar.prototype.getPaintedPoints = function(state)
{
	var pts = state.absolutePoints;
	var style = state.style;
	var n = (pts != null) ? pts.length : 0;

	if (n < 3 || style == null || !(state.shape instanceof mxPolyline))
	{
		return pts;
	}

	var bezier = style[mxConstants.STYLE_BEZIER] == 1;

	if (!bezier && style[mxConstants.STYLE_CURVED] != 1)
	{
		return pts;
	}

	for (var i = 0; i < n; i++)
	{
		if (pts[i] == null)
		{
			return pts;
		}
	}

	var steps = 16;
	var result = [pts[0]];

	// Adds the points of the curve from p0 with the given control points
	// to p3 (a quadratic curve with one control point if c2 is null)
	var addCurve = function(p0, c1, c2, p3)
	{
		for (var j = 1; j <= steps; j++)
		{
			var t = j / steps;
			var u = 1 - t;

			if (c2 == null)
			{
				result.push(new mxPoint(u * u * p0.x + 2 * u * t * c1.x + t * t * p3.x,
					u * u * p0.y + 2 * u * t * c1.y + t * t * p3.y));
			}
			else
			{
				result.push(new mxPoint(u * u * u * p0.x + 3 * u * u * t * c1.x +
					3 * u * t * t * c2.x + t * t * t * p3.x, u * u * u * p0.y +
					3 * u * u * t * c1.y + 3 * u * t * t * c2.y + t * t * t * p3.y));
			}
		}
	};

	if (bezier && (n - 1) % 3 == 0)
	{
		for (var i = 1; i + 2 < n; i += 3)
		{
			addCurve(pts[i - 1], pts[i], pts[i + 1], pts[i + 2]);
		}
	}
	else
	{
		var start = pts[0];

		for (var i = 1; i < n - 2; i++)
		{
			var mid = new mxPoint((pts[i].x + pts[i + 1].x) / 2,
				(pts[i].y + pts[i + 1].y) / 2);
			addCurve(start, pts[i], null, mid);
			start = mid;
		}

		addCurve(start, pts[n - 2], null, pts[n - 1]);
	}

	return result;
};

/**
 * Returns the arrows at the ends of the given edge state with the given
 * stroke width as objects with the bounds of the arrow (bounds), which
 * contain the arrow in every direction around the end of the edge, and its
 * length (length).
 */
InlineToolbar.prototype.getEdgeMarkers = function(state, sw)
{
	var pts = state.absolutePoints;
	var shape = state.shape;
	var scale = this.graph.view.scale;
	var result = [];
	var ends = [[pts[0], mxConstants.STYLE_STARTARROW, mxConstants.STYLE_STARTSIZE,
		'getStartArrowWidth'], [pts[pts.length - 1], mxConstants.STYLE_ENDARROW,
		mxConstants.STYLE_ENDSIZE, 'getEndArrowWidth']];

	for (var i = 0; i < ends.length; i++)
	{
		var pt = ends[i][0];

		if (pt != null && mxUtils.getValue(state.style, ends[i][1],
			mxConstants.NONE) != mxConstants.NONE)
		{
			// The size of the arrow along the edge or the width of the arrow
			// of an arrow connector, with the stroke
			var size = mxUtils.getNumber(state.style, ends[i][2],
				mxConstants.DEFAULT_MARKERSIZE);

			if (shape != null && typeof shape[ends[i][3]] === 'function')
			{
				size = Math.max(size, shape[ends[i][3]]());
			}

			var d = (isNaN(size)) ? 0 : Math.max(0, size + sw) * scale;

			if (d > 0)
			{
				result.push({bounds: new mxRectangle(pt.x - d, pt.y - d, 2 * d, 2 * d),
					length: d});
			}
		}
	}

	return result;
};

/**
 * Returns how much the given rectangle covers the given other cell (see
 * getObstacles): 0 if it misses it, else 0.25 and the part of the cell
 * that it covers (of the area of a shape or a label, of the length of an
 * edge with its arrows, whose line is as wide as it is painted), so that a
 * position that covers a small cell completely costs more than one that
 * touches large cells.
 */
InlineToolbar.prototype.getCoverage = function(rect, obstacle)
{
	if (!mxUtils.intersects(rect, obstacle.bounds))
	{
		return 0;
	}

	var part = 0;

	if (obstacle.pts != null)
	{
		var pts = obstacle.pts;
		var t = obstacle.spacing || 0;
		var covered = 0;

		for (var i = 1; i < pts.length; i++)
		{
			if (pts[i] != null && pts[i - 1] != null)
			{
				var inside = this.getSegmentCoverage(pts[i - 1].x, pts[i - 1].y,
					pts[i].x, pts[i].y, rect.x - t, rect.y - t, rect.width + 2 * t,
					rect.height + 2 * t);

				if (inside > 0)
				{
					covered += inside * Math.sqrt(Math.pow(pts[i].x - pts[i - 1].x, 2) +
						Math.pow(pts[i].y - pts[i - 1].y, 2));
				}
			}
		}

		for (var i = 0; obstacle.markers != null && i < obstacle.markers.length; i++)
		{
			covered += this.getAreaCoverage(rect, obstacle.markers[i].bounds) *
				obstacle.markers[i].length;
		}

		part = (obstacle.length > 0) ? covered / obstacle.length : 0;
	}
	else if (obstacle.shape != null)
	{
		part = this.getAreaCoverage(rect, obstacle.shape);
	}

	if (obstacle.text != null)
	{
		part = Math.max(part, this.getAreaCoverage(rect, obstacle.text));
	}

	return (part > 0) ? 0.25 + part : 0;
};

/**
 * Returns the part of the area of the second given rectangle that the
 * first covers, between 0 and 1 (1 for an empty rectangle inside it).
 */
InlineToolbar.prototype.getAreaCoverage = function(rect, bounds)
{
	var w = Math.min(rect.x + rect.width, bounds.x + bounds.width) - Math.max(rect.x, bounds.x);
	var h = Math.min(rect.y + rect.height, bounds.y + bounds.height) - Math.max(rect.y, bounds.y);
	var area = bounds.width * bounds.height;

	if (w < 0 || h < 0)
	{
		return 0;
	}

	return (area > 0) ? (w * h) / area : 1;
};

/**
 * Returns the part of the line segment from (x1,y1) to (x2,y2) inside the
 * axis-aligned rectangle at (rx, ry) with size (rw, rh), between 0 and 1.
 * Uses the Liang-Barsky clipping algorithm (see segmentIntersectsRect).
 */
InlineToolbar.prototype.getSegmentCoverage = function(x1, y1, x2, y2, rx, ry, rw, rh)
{
	// Most of the segments of a connector with many waypoints
	if (Math.max(x1, x2) < rx || Math.min(x1, x2) > rx + rw ||
		Math.max(y1, y2) < ry || Math.min(y1, y2) > ry + rh)
	{
		return 0;
	}

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
				return 0;
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
				return 0;
			}
		}
	}

	return tMax - tMin;
};

/**
 * Returns the position of the pointer over the diagram in the coordinates
 * of the toolbar (see getPosition), or null if the pointer is not over the
 * diagram or a popover is open, as the pointer is then in the popover or on
 * the way to it (see pointerHandler in init).
 */
InlineToolbar.prototype.getPointerPoint = function()
{
	var pt = this.pointerPoint;

	if (pt == null || this.currentPopover != null)
	{
		return null;
	}

	var container = this.graph.container;
	var origin = container.getBoundingClientRect();

	return new mxPoint(pt.x - origin.left - container.clientLeft +
		container.scrollLeft, pt.y - origin.top - container.clientTop +
		container.scrollTop);
};

/**
 * Returns true if the given rectangle covers a segment, the label or a
 * label cell of the given edge.
 */
InlineToolbar.prototype.coversEdge = function(state, rect)
{
	var pts = state.absolutePoints;

	if (pts != null)
	{
		for (var i = 1; i < pts.length; i++)
		{
			if (this.isFinitePoint(pts[i]) && this.isFinitePoint(pts[i - 1]) &&
				this.segmentIntersectsRect(pts[i - 1].x, pts[i - 1].y,
					pts[i].x, pts[i].y, rect.x, rect.y, rect.width, rect.height))
			{
				return true;
			}
		}
	}

	if (state.text != null && state.text.boundingBox != null &&
		mxUtils.intersects(rect, state.text.boundingBox))
	{
		return true;
	}

	var model = this.graph.getModel();
	var childCount = model.getChildCount(state.cell);

	for (var i = 0; i < childCount; i++)
	{
		var childState = this.graph.view.getState(model.getChildAt(state.cell, i));

		if (childState != null && ((childState.shape != null &&
			childState.shape.boundingBox != null &&
			mxUtils.intersects(rect, childState.shape.boundingBox)) ||
			(childState.text != null && childState.text.boundingBox != null &&
			mxUtils.intersects(rect, childState.text.boundingBox))))
		{
			return true;
		}
	}

	return false;
};

/**
 * Returns the height at the top of the container that other parts of the UI
 * cover (eg. a top bar that floats over the canvas), which the toolbar and
 * its popovers keep clear of. Default is 0.
 */
InlineToolbar.prototype.getTopInset = function()
{
	return 0;
};

/**
 * Returns the width at the right of the container that other parts of the UI
 * cover (eg. a panel that floats over the canvas), which the toolbar and its
 * popovers keep clear of. Default is 0.
 */
InlineToolbar.prototype.getRightInset = function()
{
	return 0;
};

/**
 * Returns the height at the bottom of the container that other parts of the
 * UI cover (eg. a sheet that floats over the canvas), which the toolbar and
 * its popovers keep clear of. Default is 0.
 */
InlineToolbar.prototype.getBottomInset = function()
{
	return 0;
};

/**
 * Limits the height of the given panel to the visible height of the
 * container between the top and bottom insets (see getTopInset and
 * getBottomInset), so a taller panel scrolls instead of running past the
 * bottom. Only with an inset, else the panel is unchanged.
 */
InlineToolbar.prototype.limitPanelHeight = function(panel)
{
	var inset = this.getTopInset() + this.getBottomInset();
	var max = this.graph.container.clientHeight - 8 - inset;

	if (inset > 0 && max > 0 && panel.offsetHeight > max)
	{
		panel.style.boxSizing = 'border-box';
		panel.style.maxHeight = max + 'px';
		panel.style.overflowY = 'auto';
		panel.style.overscrollBehavior = 'contain';
	}
};

/**
 * Clamps a position (in container scroll coordinates) so an element of the
 * given size stays within the container's visible viewport, without the
 * parts that other UI covers (see getTopInset, getRightInset and
 * getBottomInset). When the element
 * is larger than the viewport along an axis it is pinned to the top/left edge
 * so its start stays visible. Returns the clamped point.
 */
InlineToolbar.prototype.clampToContainer = function(x, y, w, h)
{
	var c = this.graph.container;
	var minX = c.scrollLeft + 4;
	var maxX = c.scrollLeft + c.clientWidth - this.getRightInset() - w - 4;
	var minY = c.scrollTop + 4 + this.getTopInset();
	var maxY = c.scrollTop + c.clientHeight - this.getBottomInset() - h - 4;

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
 * The popover that shrinks after it was closed, or null (see hidePopover).
 * Until it is gone, a change does not move the toolbar of the same cells or
 * change its buttons, so that the popover shrinks towards its button (see
 * show and popoverClosed).
 */
InlineToolbar.prototype.closingPopover = null;

/**
 * True if a change came in while the popover shrank (see closingPopover),
 * so that the toolbar is placed again after that.
 */
InlineToolbar.prototype.repaintAfterClose = false;

/**
 * Scrolls the scrollable content of the given element of the toolbar with
 * the mouse wheel instead of zooming or panning the diagram behind it (see
 * mxEvent.addMouseWheelListener in EditorUi, which listens to the window).
 * Pinch gestures and the mouse wheel with the control key still zoom.
 */
InlineToolbar.prototype.installWheelHandler = function(elt)
{
	mxEvent.addListener(elt, 'wheel', function(evt)
	{
		if (!evt.ctrlKey)
		{
			evt.stopPropagation();
		}
	});
};

/**
 * Creates a popover shell anchored to the given button and returns its body element.
 * The popover includes arrow, positioning, animation and close handlers.
 * Options: persistOnClick (default false) keeps popover open when clicking inside,
 * kind is the kind of the options in the popover (see getTargetCells). Parts
 * of the body that scroll on their own are added to scrolls as {elt, maxHeight}.
 */
InlineToolbar.prototype.createPopover = function(anchorBtn, opts)
{
	this.hidePopover(true);
	this.hidePopupMenus();

	// A new popover opens at the place of the toolbar for the last change
	if (this.closingPopover != null)
	{
		this.popoverClosed();
	}

	this.popoverKind = (opts != null) ? opts.kind : null;

	// Tooltips would cover the popover
	this.graph.tooltipHandler.hide();

	if (this.editorUi.hoverIcons != null)
	{
		this.editorUi.hoverIcons.reset();
	}

	var persistOnClick = opts != null && opts.persistOnClick;
	var container = this.graph.container;

	// Outer wrapper for positioning (no visual styling)
	var popover = document.createElement('div');
	popover.style.position = 'absolute';
	popover.style.zIndex = 2;
	popover.style.cursor = 'default';
	this.installWheelHandler(popover);

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

	// Parts of the body that scroll on their own, as {elt, maxHeight}
	var scrolls = [];

	// Position function — call after body content is added
	var positionPopover = mxUtils.bind(this, function()
	{
		// A popover higher than the container scrolls inside of it, eg. the
		// shapes in an inline editor that is no higher than the diagram (see
		// clampToContainer for the 4 px margins). Its parts that scroll on
		// their own then show all of their content, so that the wheel moves
		// the one scrollbar everywhere. Measuring resets the scroll position
		// of the body, which is kept for repositioning after changes.
		var bodyScrollTop = body.scrollTop;
		body.style.maxHeight = '';
		body.style.overflowY = '';
		body.style.overflowX = '';
		body.style.paddingRight = '8px';

		// Measures with the room of the arrow, whatever the last place was:
		// next to the shapes (no arrow) the popover was 8 px lower, so one
		// that fit below the toolbar only without that room changed its place
		// at every update (eg. in a Classic window 600 px high)
		body.style.marginTop = arrowOffset + 'px';
		body.style.marginBottom = '0';

		// Measures at the left of the container, whatever the last place was:
		// further right, the width of the popover was limited to the room to
		// the right of it in the container, so it was narrower after its
		// first place and moved at the first update. It keeps that width
		// (minWidth) at its place.
		popover.style.minWidth = '';
		popover.style.left = '0px';

		for (var i = 0; i < scrolls.length; i++)
		{
			scrolls[i].elt.style.maxHeight = scrolls[i].maxHeight;
			scrolls[i].elt.style.overflowY = 'auto';
			scrolls[i].elt.style.overflowX = 'hidden';
		}

		var maxBodyHeight = container.clientHeight - 8 - this.getTopInset() -
			this.getBottomInset() - (popover.offsetHeight - body.offsetHeight);

		if (maxBodyHeight > 0 && body.offsetHeight > maxBodyHeight)
		{
			// Without overflow, they do not stop the wheel (overscrollBehavior)
			for (var i = 0; i < scrolls.length; i++)
			{
				scrolls[i].elt.style.maxHeight = '';
				scrolls[i].elt.style.overflowY = '';
				scrolls[i].elt.style.overflowX = '';
			}

			body.style.boxSizing = 'border-box';
			body.style.maxHeight = maxBodyHeight + 'px';
			body.style.overflowY = 'auto';
			body.style.overflowX = 'hidden';
			body.style.overscrollBehavior = 'contain';

			// Room for a scrollbar that takes up space (the borders are 2 px)
			var scrollbar = body.offsetWidth - body.clientWidth - 2;

			if (scrollbar > 0)
			{
				body.style.paddingRight = (8 + scrollbar) + 'px';
			}

			body.scrollTop = bodyScrollTop;
		}

		this.updatePopoverScrollbars(body, scrolls);
		var toolbarRect = this.toolbar.getBoundingClientRect();
		var btnRect = anchorBtn.getBoundingClientRect();
		var containerRect = container.getBoundingClientRect();
		var scrollLeft = container.scrollLeft;
		var scrollTop = container.scrollTop;

		var popoverWidth = popover.offsetWidth;
		var popoverHeight = popover.offsetHeight;
		popover.style.minWidth = popoverWidth + 'px';
		var btnCenterX = btnRect.left + btnRect.width / 2 - containerRect.left + scrollLeft;
		var popX = btnCenterX - popoverWidth / 2;

		// Decide above/below from the room available on each side WITHIN the
		// container's visible viewport (not the window — the inline editor's
		// container can be shorter than the window). Prefer below; flip above
		// only when below does not fit and above is the roomier side. It fits
		// with its gap of 2 to the toolbar and the margin of 4 of
		// clampToContainer, which would else move it and hide its arrow. The
		// room on each side leaves out the parts that other UI covers, which
		// the clamp keeps it out of (getTopInset, getBottomInset).
		var spaceAbove = toolbarRect.top - containerRect.top - this.getTopInset();
		var spaceBelow = (containerRect.top + container.clientHeight -
			this.getBottomInset()) - toolbarRect.bottom;
		var fitsBelow = spaceBelow >= popoverHeight + 6;
		var fitsAbove = spaceAbove >= popoverHeight + 6;
		var showAbove = !fitsBelow && (fitsAbove || spaceAbove > spaceBelow);
		var popY;

		// For shapes, the popover goes on the side of the toolbar away from
		// them if the toolbar is above or below the selection, so that it
		// does not cover what it changes. Without room there, it takes the
		// other side if it misses the shapes there, else it goes next to the
		// shapes (the inline editor is often no higher than the diagram).
		var sel = (this.currentCells != null && !this.isEdgeSelection()) ?
			this.getSelectionBounds() : null;
		var side = this.toolbarSide;
		var sideX = null;
		var sideY = null;

		// A toolbar left or right of the shapes has the popover above or below
		// itself, so it does not cover the toolbar, moved away from the shapes.
		// Without room above and below, it goes next to the toolbar.
		if (sel != null && (side == 'left' || side == 'right'))
		{
			if (fitsAbove || fitsBelow)
			{
				popX = (side == 'right') ? Math.max(popX, sel.x + sel.width + 8) :
					Math.min(popX, sel.x - 8 - popoverWidth);
			}
			else
			{
				sideX = (side == 'right') ? toolbarRect.right - containerRect.left +
					scrollLeft + 4 : toolbarRect.left - containerRect.left +
					scrollLeft - 4 - popoverWidth;
				sideY = toolbarRect.top - containerRect.top + scrollTop;
			}
		}
		else if (sel != null)
		{
			var aboveY = toolbarRect.top - containerRect.top + scrollTop - popoverHeight - 2;
			var belowY = toolbarRect.bottom - containerRect.top + scrollTop + 2;
			var toolbarY = (toolbarRect.top + toolbarRect.bottom) / 2 - containerRect.top + scrollTop;
			var awayAbove = toolbarY < sel.getCenterY();

			var misses = function(y)
			{
				return !mxUtils.intersects(new mxRectangle(popX, y,
					popoverWidth, popoverHeight), sel);
			};

			if (awayAbove ? fitsAbove : fitsBelow)
			{
				showAbove = awayAbove;
			}
			else if ((awayAbove ? fitsBelow : fitsAbove) &&
				misses(awayAbove ? belowY : aboveY))
			{
				showAbove = !awayAbove;
			}
			else if (sel.x + sel.width + 8 + popoverWidth <=
				scrollLeft + container.clientWidth - this.getRightInset() - 4)
			{
				sideX = sel.x + sel.width + 8;
			}
			else if (sel.x - 8 - popoverWidth >= scrollLeft + 4)
			{
				sideX = sel.x - 8 - popoverWidth;
			}
		}

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

		// Next to the shapes, aligned with their top, or next to the toolbar,
		// without an arrow
		if (sideX != null)
		{
			popX = sideX;
			popY = (sideY != null) ? sideY : sel.y;
			body.style.marginTop = '0';
			body.style.marginBottom = '0';
			popoverHeight = popover.offsetHeight;
		}

		// Clamp to the visible viewport so the popover is never clipped by a
		// container edge (e.g. the inline editor's top border).
		var unclampedY = popY;
		var clamped = this.clampToContainer(popX, popY, popoverWidth, popoverHeight);
		popX = clamped.x;
		popY = clamped.y;

		// In the degenerate case where the popover fits on neither side and the
		// clamp detaches it from the toolbar edge, the fixed arrow would point
		// at empty space — hide it rather than show a dangling pointer. Next to
		// the shapes, it points at nothing either.
		arrowBorder.style.display = (popY != unclampedY || sideX != null) ? 'none' : '';
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

	// A scroll of the container closes the popover, except while a text field
	// in it has the focus (the search of the shapes, the steppers): on phones
	// the browser scrolls the container to show a field that the on-screen
	// keyboard would cover, and the popover moves with the container
	this.popoverScrollHandler = mxUtils.bind(this, function()
	{
		var active = document.activeElement;

		if (active == null || !popover.contains(active) ||
			!this.editorUi.isTextInputElement(active))
		{
			this.hidePopover();
		}
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

	return {body: body, popover: popover, position: positionPopover, animateIn: animateIn,
		scrolls: scrolls};
};

/**
 * Hook for the scrollbars of a popover after createPopover limited the
 * height of the given body or of its parts that scroll on their own (scrolls)
 * and before it places the popover. This implementation does nothing.
 */
InlineToolbar.prototype.updatePopoverScrollbars = function(body, scrolls)
{
	// Hook for subclassers
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
 * The color applies to the selected cells for the options of the
 * current popover (see getTargetCells).
 */
InlineToolbar.prototype.createColorSwatch = function(title, currentColor, styleKey,
	defaultColorValue, post)
{
	var graph = this.graph;
	var kind = this.popoverKind;

	var getKey = function(cell)
	{
		return (typeof styleKey === 'function') ? styleKey(cell) : styleKey;
	};

	// First cell of the popover for the key of the current color
	var getCell = mxUtils.bind(this, function()
	{
		var cells = this.getTargetCells(kind);

		return (cells.length > 0) ? cells[0] : this.currentState.cell;
	});
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
		updateSwatch(style[getKey(getCell())]);
	}));

	mxEvent.addListener(swatch, 'click', mxUtils.bind(this, function(e)
	{
		// Reads the current selection's color for this style key. The color
		// picker is a non-modal window that stays open across selection
		// changes; passing this lets ColorWindow re-sync its swatch to the
		// new selection (it refreshes from getColorFn on selectionChange/
		// styleChanged), matching the Format panel and font color menus.
		var getColorFn = mxUtils.bind(this, function()
		{
			var cells = this.getTargetCells(kind, graph.getSelectionCells());
			var cell = (cells.length > 0) ? cells[0] : null;
			var cellStyle = (cell != null) ? graph.resolveInheritedLabelStyles(cell,
				graph.getCellStyle(cell, false)) : null;

			return (cellStyle != null) ? (cellStyle[getKey(cell)] || mxConstants.NONE) :
				mxConstants.NONE;
		});

		this.editorUi.pickColor(getColorFn(),
			mxUtils.bind(this, function(color)
			{
				// Apply to the live selection read at apply time, not the cells
				// captured when the swatch was built. Same reason as above:
				// the selection may have changed while the picker was open.
				var cells = this.getTargetCells(kind,
					this.editorUi.getSelectionState().cells);
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
	styleKey, defaultColorValue, post)
{
	var group = document.createElement('div');
	group.style.display = 'flex';
	group.style.alignItems = 'center';
	group.style.gap = '6px';
	group.appendChild(this.createLabel(labelText));
	group.appendChild(this.createColorSwatch(title, color, styleKey,
		defaultColorValue, post));

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
			// Tooltips would cover the panel
			this.graph.tooltipHandler.hide();

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

			this.installWheelHandler(panel);
			this.hidePopupMenus();
			container.appendChild(panel);
			this.currentSubPanel = panel;
			panel._ownerDropdown = dropdown;

			// Position below the dropdown, clamped to the visible viewport.
			this.limitPanelHeight(panel);
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
 * Creates a button with the given label and title for the rows of a popover.
 */
InlineToolbar.prototype.createTextButton = function(label, title, fn)
{
	var btn = this.createDropdownButton(title);
	btn.style.flex = '1';
	btn.style.justifyContent = 'center';

	// Replaces the preview and the chevron of the dropdown
	btn.innerHTML = '';
	btn.appendChild(this.createLabel(label));

	mxEvent.addListener(btn, 'click', function(e)
	{
		fn();
		mxEvent.consume(e);
	});

	return btn;
};

/**
 * Sets the given style keys to the given values for the given cells (see
 * Menus.createStyleChangeFunction, which changes the selected cells).
 */
InlineToolbar.prototype.setCellStyles = function(keys, values, cells)
{
	var graph = this.graph;
	graph.stopEditing(false);
	graph.getModel().beginUpdate();

	try
	{
		cells = graph.getEditableCells(cells);

		for (var i = 0; i < keys.length; i++)
		{
			graph.setCellStyles(keys[i], values[i], cells);
		}

		this.editorUi.fireEvent(new mxEventObject('styleChanged',
			'keys', keys, 'values', values, 'cells', cells));
	}
	finally
	{
		graph.getModel().endUpdate();
	}
};

/**
 * Names the given element of a popover as the given part (a property of the
 * element), so the sections and the look of a theme find it (see findPart).
 * Returns the element.
 */
InlineToolbar.prototype.setPart = function(elt, name)
{
	if (elt != null)
	{
		elt.toolbarPart = name;
	}

	return elt;
};

/**
 * Returns the first of the given elements that is the part of the given
 * name (see setPart) or null.
 */
InlineToolbar.prototype.findPart = function(parts, name)
{
	for (var i = 0; i < parts.length; i++)
	{
		if (parts[i] != null && parts[i].toolbarPart == name)
		{
			return parts[i];
		}
	}

	return null;
};

/**
 * Returns the opacity (0 to 100) of the cells of the given kind of popover
 * (see getTargetCells).
 */
InlineToolbar.prototype.getOpacity = function(kind)
{
	var value = parseFloat(mxUtils.getValue(this.getCurrentStyle(
		this.getTargetCells(kind)), mxConstants.STYLE_OPACITY, 100));

	return (isFinite(value)) ? Math.max(0, Math.min(100, value)) : 100;
};

/**
 * Sets the opacity of the cells of the given kind of popover in one edit.
 */
InlineToolbar.prototype.setOpacity = function(kind, value)
{
	this.setCellStyles([mxConstants.STYLE_OPACITY], [value], this.getTargetCells(kind));
};

/**
 * Returns the option rounded of the selected cells (see getOptions) or null
 * if they cannot have rounded corners.
 */
InlineToolbar.prototype.getCornersOption = function()
{
	var options = this.getOptions();

	for (var i = 0; i < options.length; i++)
	{
		if (options[i].styleKey == mxConstants.STYLE_ROUNDED)
		{
			return options[i];
		}
	}

	return null;
};

/**
 * Returns true if the selected cells have rounded corners.
 */
InlineToolbar.prototype.isRoundedCorners = function(option)
{
	option = (option != null) ? option : this.getCornersOption();

	return option != null && option.isSelected(this.getCurrentStyle(this.currentCells));
};

/**
 * Sets sharp or rounded corners for the selected cells in one edit with the
 * keys of the option rounded (see getOptions).
 */
InlineToolbar.prototype.setRoundedCorners = function(rounded)
{
	this.setCellStyles([mxConstants.STYLE_ROUNDED, 'roundedPerimeter'],
		(rounded) ? ['1', '1'] : ['0', null], this.currentCells);
};

/**
 * Returns true if the given style has the font style strikethrough.
 */
InlineToolbar.prototype.isStrikethrough = function(style)
{
	var fontStyle = parseInt(mxUtils.getValue(style, mxConstants.STYLE_FONTSTYLE, 0));

	return (fontStyle & mxConstants.FONT_STRIKETHROUGH) == mxConstants.FONT_STRIKETHROUGH;
};

/**
 * Toggles strikethrough of the selected text while a label is edited, else
 * the flag of the font style of the selected cells in one edit, like bold.
 */
InlineToolbar.prototype.toggleStrikethrough = function()
{
	var graph = this.graph;

	if (graph.cellEditor.isContentEditing())
	{
		document.execCommand('strikeThrough', false, null);
	}
	else
	{
		graph.stopEditing(false);
		graph.getModel().beginUpdate();

		try
		{
			graph.toggleCellStyleFlags(mxConstants.STYLE_FONTSTYLE,
				mxConstants.FONT_STRIKETHROUGH,
				graph.getEditableCells(graph.getSelectionCells()));
		}
		finally
		{
			graph.getModel().endUpdate();
		}
	}
};

/**
 * The vertical alignments of the text popover: the name, the image and the
 * value of verticalAlign.
 */
InlineToolbar.prototype.verticalAlignments = [['top', 'alignTopImage', 'top'],
	['middle', 'alignMiddleImage', 'middle'], ['bottom', 'alignBottomImage', 'bottom']];

/**
 * Sets the vertical alignment of the selected cells in one edit.
 */
InlineToolbar.prototype.setVerticalAlign = function(value)
{
	this.editorUi.menus.createStyleChangeFunction([mxConstants.STYLE_VERTICAL_ALIGN], [value])();
};

/**
 * Returns the action Clear Waypoints if a connector of the connection
 * popover has waypoints that it can remove, else null.
 */
InlineToolbar.prototype.getClearWaypointsAction = function()
{
	var action = this.editorUi.actions.get('clearWaypoints');
	var edges = this.getTargetCells('edge');
	var points = false;

	for (var i = 0; i < edges.length && !points; i++)
	{
		var geo = this.graph.getCellGeometry(edges[i]);
		points = geo != null && geo.points != null && geo.points.length > 0;
	}

	return (points && action != null && action.isEnabled() &&
		this.isActionVisible('clearWaypoints')) ? action : null;
};

/**
 * The actions of the section Order in More, which keep the popover open.
 */
InlineToolbar.prototype.orderActions = ['toFront', 'bringForward', 'sendBackward', 'toBack'];

/**
 * The actions of the section Actions in More, which close the popover.
 */
InlineToolbar.prototype.moreActions = ['duplicate', 'copyStyle', 'pasteStyle',
	'editLink', 'lockUnlock', 'delete'];

/**
 * The images of the actions of the sections of More.
 */
InlineToolbar.prototype.actionImages = {'toFront': 'toFrontImage',
	'bringForward': 'bringForwardImage', 'sendBackward': 'sendBackwardImage',
	'toBack': 'toBackImage', 'duplicate': 'duplicateImage',
	'copyStyle': 'copyStyleImage', 'pasteStyle': 'pasteStyleImage',
	'editLink': 'linkImage', 'lock': 'lockedImage', 'unlock': 'unlockedImage',
	'delete': 'trashImage'};

/**
 * Returns true if the action of the given name may be shown in the
 * toolbar: it exists, is visible and is not hidden by the configuration
 * (hideMenuItems, the rule of Menus.addMenuItem). This is a hook for themes.
 */
InlineToolbar.prototype.isActionVisible = function(name)
{
	var action = this.editorUi.actions.get(name);
	var hidden = (this.editorUi.menus != null) ?
		this.editorUi.menus.hiddenMenuItems : null;

	return action != null && action.visible !== false &&
		(hidden == null || !hidden[name]);
};

/**
 * Returns true if the action of the given name can run for the selection.
 * Copy Style is enabled for any selection but copies only the style of a
 * single cell.
 */
InlineToolbar.prototype.isActionEnabled = function(name, action)
{
	return action.isEnabled() && (name != 'copyStyle' ||
		this.graph.getSelectionCount() == 1);
};

/**
 * Returns the entry of the action of the given name for the sections of
 * More, or null if there is no such action or it is hidden: the action, the
 * key of its resource and image (lock or unlock as lockUnlock does), its
 * label, its title with its key, its key, its image and if it is enabled
 * (see isActionEnabled).
 */
InlineToolbar.prototype.getActionEntry = function(name)
{
	var action = this.editorUi.actions.get(name);

	if (action == null || !this.isActionVisible(name))
	{
		return null;
	}

	var key = name;

	// Lock or unlock as the action does (see lockUnlock)
	if (key == 'lockUnlock')
	{
		var cell = this.graph.getSelectionCell();
		key = (cell == null || mxUtils.getValue(this.graph.getCurrentCellStyle(cell),
			mxConstants.STYLE_EDITABLE, 1) == 1) ? 'lock' : 'unlock';
	}

	var label = mxResources.get(key);

	if (label == null || label == '')
	{
		label = action.label;
	}

	var image = this.actionImages[key];

	return {name: name, key: key, action: action, label: label, shortcut: action.shortcut,
		title: label + ((action.shortcut != null) ? ' (' + action.shortcut + ')' : ''),
		image: (image != null) ? (InlineToolbar[image] || Editor[image]) : null,
		enabled: this.isActionEnabled(name, action)};
};

/**
 * Runs the given action from a popover: ends editing and closes the popover
 * unless keepOpen is true.
 */
InlineToolbar.prototype.runAction = function(action, keepOpen)
{
	this.graph.stopEditing(false);

	if (!keepOpen)
	{
		this.hidePopover();
	}

	try
	{
		action.funct();
	}
	catch (e)
	{
		this.editorUi.handleError(e);
	}
};

/**
 * Shows the line style popover: dash pattern, stroke width, stroke color,
 * Corners for shapes and Opacity for connectors and, for edge shapes that
 * support them, fill and gradient color, in the sections Line and Fill (see
 * decorateSimplePopover).
 */
InlineToolbar.prototype.showLineStyleMenu = function(evt)
{
	this.editorUi.hideCurrentMenu();

	if (this.currentState == null)
	{
		return;
	}

	var graph = this.graph;
	var cells = this.getTargetCells('line');
	var style = this.getCurrentStyle(cells);

	var p = this.createPopover(this.lineStyleBtn, {persistOnClick: true, kind: 'line'});
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
	body.appendChild(this.setPart(dashDropdown, 'pattern'));

	// Row 2: Stroke width + color
	var row2 = this.setPart(document.createElement('div'), 'stroke');
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

	// Corners for shapes and Opacity for connectors in Line
	var corners = this.createCornersRow();
	var opacity = (this.isEdgeSelection(cells)) ?
		this.createOpacityRow('line') : null;

	if (corners != null)
	{
		body.appendChild(corners);
	}

	if (opacity != null)
	{
		body.appendChild(opacity);
	}

	// Row 3: Fill and gradient color, shown only for edge shapes that
	// support them (filled edge, flex arrow, arrow, pipe, wire, …).
	// Vertices have a fill popover.
	var row3 = null;

	if (this.isEdgeSelection(cells) && this.isFillSelection(false, cells))
	{
		var fillColor = mxUtils.getValue(style, mxConstants.STYLE_FILLCOLOR, null);
		row3 = this.setPart(document.createElement('div'), 'fill');
		row3.style.display = 'flex';
		row3.style.alignItems = 'center';
		row3.style.gap = '14px';
		row3.style.marginTop = '8px';
		row3.appendChild(this.createColorGroup(mxResources.get('fill'),
			mxResources.get('fillColor'), fillColor, mxConstants.STYLE_FILLCOLOR,
			graph.shapeBackgroundColor));

		// Gradient needs a fill color and a shape that supports gradients
		// (excludes wire/pipe).
		if (this.isFillSelection(true, cells) && fillColor != null &&
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
 * direction, fill pattern (see StyleFormatPanel.addFill) and Opacity, in
 * the section Fill (see decorateSimplePopover).
 */
InlineToolbar.prototype.showFillMenu = function(evt)
{
	this.editorUi.hideCurrentMenu();

	if (this.currentState == null)
	{
		return;
	}

	var graph = this.graph;
	var cells = this.getTargetCells('fill');
	var style = this.getCurrentStyle(cells);
	var image = style[mxConstants.STYLE_SHAPE] == 'image';
	var gradient = !image && this.isFillSelection(true, cells);

	// Tables and rows without a title are filled with the lane color
	var fillKey = (image) ? mxConstants.STYLE_IMAGE_BACKGROUND : function(cell)
	{
		return graph.getFillColorKey(cell);
	};

	// Key of the fill in the style of the first cell
	var fillKeyName = (image) ? fillKey : fillKey(cells[0]);

	var p = this.createPopover(this.fillBtn, {persistOnClick: true, kind: 'fill'});
	var body = p.body;

	// Row 1: Fill and gradient color
	var colorRow = this.setPart(document.createElement('div'), 'colors');
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

	var applyStyle = mxUtils.bind(this, function(key, value)
	{
		this.setCellStyles([key], [value], cells);
	});

	// Rows 2 and 3 with aligned labels
	var grid = this.setPart(document.createElement('div'), 'grid');
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

	// Opacity, last in Fill
	body.appendChild(this.createOpacityRow('fill'));

	// Position and animate
	p.position();
	p.animateIn();
};

/**
 * Shows the text popover: font family, size and color, font style with
 * strikethrough and the horizontal and vertical alignment of the label (see
 * TextFormatPanel.addFont), in the sections Font, Alignment and Background
 * (see decorateSimplePopover).
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
	var style = this.getCurrentStyle(this.getTargetCells('text'));

	var p = this.createPopover(this.textBtn, {persistOnClick: true, kind: 'text'});
	var body = p.body;
	var fontDropdown = null;

	// Row 1: Font family, opens the font menu
	if (style[mxConstants.STYLE_FONTFAMILY] != 'inherit')
	{
		fontDropdown = this.setPart(this.createDropdownButton(
			mxResources.get('fontFamily')), 'font');
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

			this.showPopoverMenu(function(menu, parent)
			{
				ui.menus.get('fontFamily').funct(menu, parent);
			}, rect.left + origin.x, rect.bottom + origin.y + 4, e);

			mxEvent.consume(e);
		}));

		body.appendChild(fontDropdown);
	}

	// Row 2: Font size and color
	var row2 = this.setPart(document.createElement('div'), 'fields');
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

	// Row 3: Bold, italic, underline and strikethrough, and the alignments
	// in a row of their own
	var row3 = this.setPart(document.createElement('div'), 'styles');
	row3.style.display = 'flex';
	row3.style.alignItems = 'center';
	row3.style.gap = '2px';

	var alignRow = this.setPart(document.createElement('div'), 'align');
	alignRow.style.display = 'flex';
	alignRow.style.alignItems = 'center';
	alignRow.style.gap = '2px';

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
		alignRow.appendChild(this.createToggleButton(mxResources.get(name), image,
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

	// Strikethrough after underline (the flag of the font style, or the
	// selected text while it is edited, like bold)
	row3.appendChild(this.createToggleButton(mxResources.get('strikethrough'),
		Editor.strikethroughImage, mxUtils.bind(this, function(style)
		{
			return this.isStrikethrough(style);
		}), mxUtils.bind(this, function()
		{
			this.toggleStrikethrough();
		})));

	addAlign('left', Editor.alignLeftImage, mxConstants.ALIGN_LEFT);
	addAlign('center', Editor.alignCenterImage, mxConstants.ALIGN_CENTER);
	addAlign('right', Editor.alignRightImage, mxConstants.ALIGN_RIGHT);

	// The vertical alignment after the horizontal one, as in the Format
	// panel, which has both
	for (var i = 0; i < this.verticalAlignments.length; i++)
	{
		(mxUtils.bind(this, function(name, image, value)
		{
			alignRow.appendChild(this.createToggleButton(mxResources.get(name), Editor[image],
				function(style)
				{
					return mxUtils.getValue(style, mxConstants.STYLE_VERTICAL_ALIGN,
						mxConstants.ALIGN_MIDDLE) == value;
				}, mxUtils.bind(this, function()
				{
					this.setVerticalAlign(value);
				})));
		})).apply(this, this.verticalAlignments[i]);
	}

	body.appendChild(row3);
	body.appendChild(alignRow);

	// Row 4: Background of the labels of edges and of their label cells (see
	// createLabelBackgroundOption in TextFormatPanel): none, solid with the
	// color of the swatch or transparent, which cuts the label out of the edge
	var cells = this.getTargetCells('text');
	var edgeLabels = cells.length > 0;
	var row4 = null;

	for (var i = 0; i < cells.length && edgeLabels; i++)
	{
		edgeLabels = graph.model.isEdge(cells[i]) || graph.isEdgeLabelCell(cells[i]);
	}

	if (edgeLabels)
	{
		var key = mxConstants.STYLE_LABEL_BACKGROUNDCOLOR;

		// Resolves the styles that label cells inherit from their edge
		var getStyle = function()
		{
			return graph.resolveInheritedLabelStyles(cells[0], graph.getCellStyle(cells[0], false));
		};

		var getValue = function()
		{
			var style = getStyle();
			var color = mxUtils.getValue(style, key, mxConstants.NONE);
			var page = mxUtils.getValue(style, 'defaultLabelBackgroundColor', null);

			return (color == mxConstants.NONE) ? 'none' : ((color == 'default' &&
				(page == 'page' || page == 'gap')) ? 'transparent' : 'solid');
		};

		var items = [{value: 'none'}, {value: 'solid'}, {value: 'transparent'}];

		var dropdown = this.createDropdown(mxResources.get('background'), items, function()
		{
			return mxUtils.indexOf(['none', 'solid', 'transparent'], getValue());
		}, mxUtils.bind(this, function(item)
		{
			return this.createLabel(mxResources.get(item.value));
		}), mxUtils.bind(this, function(item)
		{
			var color = mxUtils.getValue(getStyle(), key, mxConstants.NONE);
			var bg = (item.value == 'none') ? mxConstants.NONE :
				((item.value == 'solid' && color != mxConstants.NONE) ? color : 'default');
			var pg = (item.value == 'transparent') ? 'page' : null;

			graph.stopEditing(false);
			graph.getModel().beginUpdate();

			try
			{
				graph.setCellStyles(key, bg, cells);
				graph.setCellStyles('defaultLabelBackgroundColor', pg, cells);
				graph.updateLabelElements(cells, function(elt)
				{
					elt.style.backgroundColor = null;
				});

				ui.fireEvent(new mxEventObject('styleChanged',
					'keys', [key, 'defaultLabelBackgroundColor'],
					'values', [bg, pg], 'cells', cells));
			}
			finally
			{
				graph.getModel().endUpdate();
			}
		}));

		dropdown.style.flex = '1';

		// The color of solid backgrounds without the page of transparent ones
		var swatch = this.createColorSwatch(mxResources.get('backgroundColor'),
			mxUtils.getValue(getStyle(), key, mxConstants.NONE), key,
			graph.shapeBackgroundColor, function(color, cells)
			{
				graph.setCellStyles('defaultLabelBackgroundColor', null, cells);
			});

		var updateSwatch = function()
		{
			swatch.style.display = (getValue() == 'solid') ? '' : 'none';
		};

		updateSwatch();
		this.addPopoverUpdate(updateSwatch);

		row4 = this.setPart(document.createElement('div'), 'background');
		row4.style.display = 'flex';
		row4.style.alignItems = 'center';
		row4.style.gap = '8px';
		row4.style.marginTop = '8px';

		// The head of the section names the background
		row4.appendChild(dropdown);
		row4.appendChild(swatch);
		body.appendChild(row4);
	}

	// Row 5: Use Connector Style for label cells of edges with own text
	// styles (see matchConnector in TextFormatPanel), hidden once they
	// inherit the text styles of their edge
	var matchConnector = ui.actions.get('matchConnector');
	var labelCells = [];
	var row5 = null;

	for (var i = 0; i < cells.length; i++)
	{
		if (graph.isEdgeLabelCell(cells[i]))
		{
			labelCells.push(cells[i]);
		}
	}

	if (matchConnector != null && labelCells.length > 0)
	{
		row5 = this.setPart(document.createElement('div'), 'match');
		row5.style.display = 'flex';
		row5.style.marginTop = '8px';
		row5.appendChild(this.createTextButton(mxResources.get('matchConnector'),
			mxResources.get('matchConnector'), function()
			{
				matchConnector.funct();
			}));

		var updateMatch = function()
		{
			var own = false;

			for (var i = 0; i < labelCells.length && !own; i++)
			{
				own = !graph.isLabelStyleInherited(labelCells[i]);
			}

			row5.style.display = (own) ? 'flex' : 'none';
		};

		updateMatch();
		this.addPopoverUpdate(updateMatch);
		body.appendChild(row5);
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

	var cells = this.getTargetCells('edge');
	var style = this.getCurrentStyle(cells);
	var shape = mxUtils.getValue(style, mxConstants.STYLE_SHAPE, null);

	var p = this.createPopover(this.lineEndBtn, {persistOnClick: true, kind: 'edge'});
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

	// Tooltips would cover the panel
	graph.tooltipHandler.hide();
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

	this.installWheelHandler(panel);
	this.hidePopupMenus();
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
	this.limitPanelHeight(panel);
	var clamped = this.clampToContainer(
		dropdownRect.left - containerRect.left + scrollLeft,
		dropdownRect.bottom - containerRect.top + scrollTop + 4,
		panel.offsetWidth, panel.offsetHeight);

	panel.style.left = Math.round(clamped.x) + 'px';
	panel.style.top = Math.round(clamped.y) + 'px';
};

/**
 * Shows the connection style popover: the grids of the routing, the shape
 * and the corners of connectors in the sections Waypoints, with Clear
 * Waypoints for connectors with waypoints, Connection and Corners (see
 * decorateSimplePopover).
 */
InlineToolbar.prototype.showConnStyleMenu = function(evt)
{
	this.editorUi.hideCurrentMenu();

	if (this.currentState == null)
	{
		return;
	}

	var graph = this.graph;
	var edges = this.getTargetCells('edge');
	var style = this.getCurrentStyle(edges);
	var shape = mxUtils.getValue(style, mxConstants.STYLE_SHAPE, null);

	var p = this.createPopover(this.connStyleBtn, {kind: 'edge'});
	var body = p.body;

	// Shared callback for applying style items
	var applyItem = mxUtils.bind(this, function(item)
	{
		graph.stopEditing(false);

		// Closes first, so that the popover shrinks where it is, towards its
		// button, as a new route moves the toolbar (after that, see show)
		this.hidePopover();
		graph.getModel().beginUpdate();

		try
		{
			for (var i = 0; i < edges.length; i++)
			{
				if (item.reset)
				{
					var geo = graph.getCellGeometry(edges[i]);

					if (geo != null)
					{
						geo = geo.clone();
						geo.points = null;
						graph.getModel().setGeometry(edges[i], geo);
					}

					// Clears the inner-loop flag along with the waypoints it
					// describes (mirrors Menus.edgeStyleChange)
					graph.setCellStyles('innerLoopWaypoints', null, [edges[i]]);
				}

				for (var j = 0; j < item.keys.length; j++)
				{
					graph.setCellStyles(item.keys[j], item.values[j], [edges[i]]);
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
	});

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
		for (var i = 0; i < edges.length; i++)
		{
			if (graph.isSequenceMessageCandidate(edges[i]))
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

	// Clear Waypoints for connectors with waypoints
	var clearRow = this.createClearWaypointsRow();

	if (clearRow != null)
	{
		body.appendChild(clearRow);
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

	var state = graph.view.getState(edges[0]);
	var showBend = this.supportsCurvedBend(style) ||
		(state != null && graph.isRoundedState(state));

	if (showBend)
	{
		this.buildIconGrid(body, bendItems, activeBend, applyItem);
	}

	// Position and animate
	p.position();
	p.animateIn();
};

/**
 * Shows the arrange popover: alignment and distribution of the selected
 * shapes, group and ungroup (see ArrangePanel). Label cells, such as the
 * label cells of edges, are not changed.
 */
InlineToolbar.prototype.showArrangeMenu = function(evt)
{
	this.editorUi.hideCurrentMenu();

	if (this.currentState == null)
	{
		return;
	}

	var ui = this.editorUi;
	var graph = this.graph;
	var shapes = this.getTargetCells('arrange');
	var lines = this.getTargetCells('line');

	var p = this.createPopover(this.arrangeBtn, {kind: 'arrange'});
	var body = p.body;

	// Row 1: Alignment and distribution, which keep the popover open
	var row1 = document.createElement('div');
	row1.style.display = 'flex';
	row1.style.alignItems = 'center';
	row1.style.gap = '2px';

	var addButton = mxUtils.bind(this, function(title, image, fn)
	{
		var btn = this.createToggleButton(title, image, function()
		{
			return false;
		}, function()
		{
			graph.stopEditing(false);
			fn();
		});

		row1.appendChild(btn);

		return btn;
	});

	var addAlign = function(name, image, align)
	{
		return addButton(mxResources.get(name), image, function()
		{
			graph.alignCells(align, graph.getMovableCells(shapes));
		});
	};

	var addDistribute = function(name, image, horizontal)
	{
		return addButton(mxResources.get('distribute') + ' (' +
			mxResources.get(name) + ')', image, function()
		{
			graph.distributeCells(horizontal, shapes);
		});
	};

	if (shapes.length > 1)
	{
		addAlign('left', Editor.alignHorizontalLeftImage, mxConstants.ALIGN_LEFT);
		addAlign('center', Editor.alignHorizontalCenterImage, mxConstants.ALIGN_CENTER);
		addAlign('right', Editor.alignHorizontalRightImage, mxConstants.ALIGN_RIGHT);

		// Separates the horizontal from the vertical alignment
		addAlign('top', Editor.alignVerticalTopImage,
			mxConstants.ALIGN_TOP).style.marginLeft = '8px';
		addAlign('middle', Editor.alignVerticalMiddleImage, mxConstants.ALIGN_MIDDLE);
		addAlign('bottom', Editor.alignVerticalBottomImage, mxConstants.ALIGN_BOTTOM);

		// Distributing two shapes does not move them
		if (shapes.length > 2)
		{
			addDistribute('horizontal', InlineToolbar.distributeHorizontalImage,
				true).style.marginLeft = '8px';
			addDistribute('vertical', InlineToolbar.distributeVerticalImage, false);
		}

		body.appendChild(row1);
	}

	// Row 2: Group and ungroup the shapes and edges without the label cells,
	// which stay in their edges. The actions change the selection.
	var row2 = document.createElement('div');
	row2.style.display = 'flex';
	row2.style.alignItems = 'center';
	row2.style.gap = '8px';

	var addAction = mxUtils.bind(this, function(name)
	{
		var action = ui.actions.get(name);

		row2.appendChild(this.createTextButton(mxResources.get(name),
			mxResources.get(name) + ((action.shortcut != null) ?
			' (' + action.shortcut + ')' : ''), function()
			{
				graph.setSelectionCells(lines);
				action.funct();
			}));
	});

	if (shapes.length > 1)
	{
		addAction('group');
	}

	if (this.getUngroupCells(shapes).length > 0)
	{
		addAction('ungroup');
	}

	if (row2.firstChild != null)
	{
		if (row1.parentNode != null)
		{
			row2.style.marginTop = '8px';
		}

		body.appendChild(row2);
	}

	// Position and animate
	p.position();
	p.animateIn();
};

/**
 * Returns the table of the given or selected cells if they are a table or
 * rows and cells of a single table, else null. Several tables are arranged
 * like other shapes. In the result, whole is true if the table is selected,
 * rows are the selected rows and the rows of the selected cells and cols
 * has a selected cell for each selected column, in the order of the table.
 */
InlineToolbar.prototype.getTableRange = function(cells)
{
	cells = (cells != null) ? cells : this.currentCells;
	var graph = this.graph;
	var model = graph.model;
	var seen = new mxDictionary();
	var positions = new mxDictionary();
	var indices = {};
	var range = null;

	// Indices of the children of each parent, as getIndex searches the
	// children, which was quadratic for many selected cells in a row
	var getIndex = function(cell)
	{
		var parent = model.getParent(cell);
		var lookup = positions.get(parent);

		if (lookup == null)
		{
			lookup = new mxDictionary();
			positions.put(parent, lookup);
			var childCount = model.getChildCount(parent);

			for (var j = 0; j < childCount; j++)
			{
				lookup.put(model.getChildAt(parent, j), j);
			}
		}

		return lookup.get(cell);
	};

	for (var i = 0; cells != null && i < cells.length; i++)
	{
		var cell = cells[i];
		var row = (graph.isTableCell(cell)) ? model.getParent(cell) :
			((graph.isTableRow(cell)) ? cell : null);
		var table = (row != null) ? model.getParent(row) :
			((graph.isTable(cell)) ? cell : null);

		if (table == null || (range != null && range.table != table))
		{
			return null;
		}
		else if (range == null)
		{
			range = {table: table, whole: false, rows: [], cols: []};
		}

		if (cell == table)
		{
			range.whole = true;
		}
		else
		{
			if (seen.get(row) == null)
			{
				seen.put(row, true);
				range.rows.push(row);
			}

			var index = (cell != row) ? getIndex(cell) : null;

			if (index != null && indices[index] == null)
			{
				indices[index] = true;
				range.cols.push(cell);
			}
		}
	}

	if (range != null)
	{
		var compare = function(a, b)
		{
			return getIndex(a) - getIndex(b);
		};

		range.rows.sort(compare);
		range.cols.sort(compare);
	}

	return range;
};

/**
 * Calls the given function for the table of the selection (see
 * getTableRange) in one edit that reports the changed geometries (see
 * Graph.beginArrange).
 */
InlineToolbar.prototype.changeTable = function(fn)
{
	var graph = this.graph;
	var range = this.getTableRange(graph.getSelectionCells());

	if (range != null)
	{
		graph.stopEditing(false);
		var arrange = graph.beginArrange();

		try
		{
			fn(range);
		}
		catch (e)
		{
			this.editorUi.handleError(e);
		}
		finally
		{
			graph.endArrange(arrange);
		}
	}
};

/**
 * Shows the table popover. For selected cells: insert a column left of the
 * first and right of the last selected column, delete the selected columns,
 * the same for rows, and merge or unmerge the cells. For selected rows:
 * insert a row above or below and delete the rows. For a selected table:
 * insert columns and rows at the sides, make the rows and columns the same
 * size and change the collapsed borders and the stripes (see addTable in
 * ArrangePanel).
 */
InlineToolbar.prototype.showTableMenu = function(evt)
{
	this.editorUi.hideCurrentMenu();
	var range = this.getTableRange();

	if (this.currentState == null || range == null)
	{
		return;
	}

	var ui = this.editorUi;
	var graph = this.graph;
	var model = graph.model;
	var p = this.createPopover(this.tableBtn, {kind: 'table'});
	var body = p.body;

	// Row 1: Columns, rows and their sizes, which keep the popover open
	var row1 = document.createElement('div');
	row1.style.display = 'flex';
	row1.style.alignItems = 'center';
	row1.style.gap = '2px';

	// Buttons of different groups are separated
	var addButton = mxUtils.bind(this, function(name, image, group, fn)
	{
		var btn = this.createToggleButton(mxResources.get(name), image, function()
		{
			return false;
		}, mxUtils.bind(this, function()
		{
			this.changeTable(fn);
		}));

		if (row1.lastChild != null && row1.lastChild.group != group)
		{
			btn.style.marginLeft = '8px';
		}

		btn.group = group;
		row1.appendChild(btn);
	});

	var insertColumn = function(before)
	{
		return function(range)
		{
			graph.insertTableColumn((range.cols.length > 0) ? range.cols[(before) ?
				0 : range.cols.length - 1] : range.table, before);
		};
	};

	var insertRow = function(before)
	{
		return function(range)
		{
			graph.insertTableRow((range.rows.length > 0) ? range.rows[(before) ?
				0 : range.rows.length - 1] : range.table, before);
		};
	};

	if (range.whole || range.cols.length > 0)
	{
		addButton('insertColumnBefore', Editor.addColumnLeftImage, 'cols', insertColumn(true));
		addButton('insertColumnAfter', Editor.addColumnRightImage, 'cols', insertColumn(false));
	}

	// Deletes the table with its last column or row
	if (range.cols.length > 0)
	{
		addButton('deleteColumn', Editor.removeColumnImage, 'cols', function(range)
		{
			for (var i = 0; i < range.cols.length; i++)
			{
				if (model.contains(range.cols[i]))
				{
					graph.deleteTableColumn(range.cols[i]);
				}
			}
		});
	}

	addButton('insertRowBefore', Editor.addRowAboveImage, 'rows', insertRow(true));
	addButton('insertRowAfter', Editor.addRowBelowImage, 'rows', insertRow(false));

	if (range.rows.length > 0)
	{
		addButton('deleteRow', Editor.removeRowImage, 'rows', function(range)
		{
			for (var i = 0; i < range.rows.length; i++)
			{
				if (model.contains(range.rows[i]))
				{
					graph.deleteTableRow(range.rows[i]);
				}
			}
		});
	}

	if (range.whole)
	{
		addButton('distributeVertical', InlineToolbar.distributeVerticalImage,
			'size', function(range)
			{
				graph.distributeRows(range.table);
			});

		addButton('distributeHorizontal', InlineToolbar.distributeHorizontalImage,
			'size', function(range)
			{
				graph.distributeColumns(range.table);
			});
	}

	body.appendChild(row1);

	// Row 2: Merge or unmerge the selected cells
	if (range.cols.length > 0)
	{
		var row2 = document.createElement('div');
		row2.style.display = 'flex';
		row2.style.alignItems = 'center';
		row2.style.gap = '8px';
		row2.style.marginTop = '8px';

		var addAction = mxUtils.bind(this, function(name, label)
		{
			var action = ui.actions.get(name);

			row2.appendChild(this.createTextButton(mxResources.get(label),
				mxResources.get(label), function()
				{
					graph.stopEditing(false);
					action.funct();
				}));
		});

		var merged = false;

		for (var i = 0; i < this.currentCells.length && !merged; i++)
		{
			var style = graph.getCurrentCellStyle(this.currentCells[i]);
			merged = graph.isTableCell(this.currentCells[i]) &&
				(mxUtils.getValue(style, 'colspan', 1) > 1 ||
				mxUtils.getValue(style, 'rowspan', 1) > 1);
		}

		if (ui.getSelectionState().mergeCell != null)
		{
			addAction('mergeCells', 'merge');
		}

		if (merged)
		{
			addAction('unmergeCells', 'unmerge');
		}

		if (row2.firstChild != null)
		{
			body.appendChild(row2);
		}
	}

	// Row 3: Collapsed borders and stripes of the selected table
	if (range.whole)
	{
		var style = this.getCurrentStyle();
		var stripe = ArrangePanel.prototype.defaultStripeColor;
		var row3 = document.createElement('div');
		row3.style.display = 'flex';
		row3.style.alignItems = 'center';
		row3.style.gap = '14px';
		row3.style.marginTop = '8px';

		row3.appendChild(this.createToggleButton(mxResources.get('collapsedBorders'),
			InlineToolbar.collapsedBordersImage, function(style)
			{
				return style['tableRender'] == 'collapsed';
			}, mxUtils.bind(this, function()
			{
				this.setCellStyles(['tableRender'], [(this.getCurrentStyle()
					['tableRender'] == 'collapsed') ? null : 'collapsed'],
					this.getTargetCells('table'));
			})));

		// The default color of the picker is the default color of the stripes
		var addStripes = mxUtils.bind(this, function(name, key)
		{
			row3.appendChild(this.createColorGroup(mxResources.get(name),
				mxResources.get(name), mxUtils.getValue(style, key, mxConstants.NONE),
				key, stripe, function(color, cells)
				{
					if (color == 'default')
					{
						graph.setCellStyles(key, stripe, cells);
					}
				}));
		});

		addStripes('rowStripes', 'evenRowColor');
		addStripes('columnStripes', 'evenColumnColor');
		body.appendChild(row3);
	}

	// Position and animate
	p.position();
	p.animateIn();
};

/**
 * Adds an option for the action with the given name to the given options if
 * the action is defined (eg. not in the viewer). The label is the given
 * title or the label of the action, and the title has the shortcut. An
 * option without an image is a text button. The option keeps the name of
 * the action and its shortcut.
 */
InlineToolbar.prototype.addActionOption = function(options, name, image, group, title)
{
	var action = this.editorUi.actions.get(name);

	if (action != null)
	{
		var label = (title != null) ? title : mxResources.get(name) +
			((/\.\.\.$/.test(action.label)) ? '...' : '');

		options.push({label: label, title: label + ((action.shortcut != null) ?
			' (' + action.shortcut + ')' : ''), image: image, group: group,
			action: name, shortcut: action.shortcut, fn: function()
			{
				action.funct();
			}});
	}
};

/**
 * Returns the options of the given cell for the More button: Unlock for a
 * cell that is locked by its own style (see isUnlockable), else the options
 * of its type: clear the waypoints and reset the label positions of edges
 * and edge labels, collapse, expand and enter groups and containers, insert
 * and delete the lanes of stacks (see addTable in ArrangePanel), edit and
 * crop images, and edit the link, tooltip, note and data of all cells. Each
 * option has a title, an image, a group, a function and keepOpen if the
 * popover stays open. This is a hook for adding options.
 */
InlineToolbar.prototype.getCellOptions = function(cell)
{
	var graph = this.graph;
	var model = graph.model;
	var state = graph.view.getState(cell);
	var result = [];

	if (state == null)
	{
		return result;
	}
	else if (this.isUnlockable(cell))
	{
		this.addActionOption(result, 'lockUnlock', Editor.unlockedImage,
			'lock', mxResources.get('unlock'));

		return result;
	}

	var geo = graph.getCellGeometry(cell);

	if (model.isEdge(cell))
	{
		if (geo != null && geo.points != null && geo.points.length > 0)
		{
			this.addActionOption(result, 'clearWaypoints',
				InlineToolbar.clearWaypointsImage, 'edge');
		}

		if (this.hasLabel(cell) || model.getChildCount(cell) > 0)
		{
			this.addActionOption(result, 'resetLabelPositions',
				InlineToolbar.resetLabelImage, 'edge');
		}

		if (Editor.enableAutoRotateLabels && this.hasLabel(cell))
		{
			this.addToggleOption(result, 'autoRotateLabel', InlineToolbar.rotateWithEdgeImage,
				'edge', 'labelAutoRotate');
		}
	}
	else if (graph.isEdgeLabelCell(cell))
	{
		this.addActionOption(result, 'resetLabelPositions',
			InlineToolbar.resetLabelImage, 'edge');

		if (Editor.enableAutoRotateLabels)
		{
			this.addToggleOption(result, 'autoRotateLabel', InlineToolbar.rotateWithEdgeImage,
				'edge', 'labelAutoRotate');
		}
	}
	else if (!graph.isTable(cell) && !graph.isTableRow(cell) && !graph.isTableCell(cell))
	{
		if (graph.isCellFoldable(cell))
		{
			var collapsed = graph.isCellCollapsed(cell);
			this.addActionOption(result, (collapsed) ? 'expand' : 'collapse',
				(collapsed) ? InlineToolbar.expandImage : InlineToolbar.collapseImage,
				'container');
		}

		if (model.getChildCount(cell) > 0 && graph.isValidRoot(cell))
		{
			this.addActionOption(result, 'enterGroup', InlineToolbar.enterGroupImage,
				'container');
		}

		// Lanes are columns of horizontal and rows of vertical stacks
		if (graph.isStack(cell) || graph.isStackChild(cell))
		{
			var rows = graph.getCellStyle((graph.isStack(cell)) ? cell :
				model.getParent(cell))['horizontalStack'] == '0';

			var addLane = mxUtils.bind(this, function(name, image, fn)
			{
				result.push({title: mxResources.get(name), image: image, group: 'lanes',
					keepOpen: true, fn: mxUtils.bind(this, function()
					{
						var arrange = graph.beginArrange();

						try
						{
							fn();
						}
						catch (e)
						{
							this.editorUi.handleError(e);
						}
						finally
						{
							graph.endArrange(arrange);
						}
					})});
			});

			addLane((rows) ? 'insertRowBefore' : 'insertColumnBefore', (rows) ?
				Editor.addRowAboveImage : Editor.addColumnLeftImage, function()
				{
					graph.insertLane(cell, true);
				});

			addLane((rows) ? 'insertRowAfter' : 'insertColumnAfter', (rows) ?
				Editor.addRowBelowImage : Editor.addColumnRightImage, function()
				{
					graph.insertLane(cell, false);
				});

			if (graph.isStackChild(cell))
			{
				addLane((rows) ? 'deleteRow' : 'deleteColumn', (rows) ?
					Editor.removeRowImage : Editor.removeColumnImage, function()
					{
						graph.deleteLane(cell);
					});
			}
		}

		if (graph.isImageState(state))
		{
			this.addActionOption(result, 'editImage', Editor.imageImage, 'image');
			this.addActionOption(result, 'crop', InlineToolbar.cropImage, 'image');
		}
	}

	if (graph.getLinkForCell(cell) != null)
	{
		this.addActionOption(result, 'editLink', Editor.linkImage, 'data');
	}

	if (mxUtils.trim(graph.getAttributeForCell(cell, 'tooltip', '')).length > 0)
	{
		this.addActionOption(result, 'editTooltip', Editor.tooltipImage, 'data');
	}

	if (mxUtils.trim(graph.getAttributeForCell(cell, 'note', '')).length > 0)
	{
		this.addActionOption(result, 'editNote', InlineToolbar.noteImage, 'data');
	}

	// Data other than the label and the options above
	if (mxUtils.isNode(cell.value))
	{
		var attrs = cell.value.attributes;

		for (var i = 0; i < attrs.length; i++)
		{
			if (mxUtils.indexOf(['label', 'placeholders', 'link', 'tooltip', 'note'],
				attrs[i].nodeName) < 0)
			{
				this.addActionOption(result, 'editData', InlineToolbar.dataImage, 'data');
				break;
			}
		}
	}

	return result;
};

/**
 * Shapes of the shape picker that a shape can be changed to (see
 * getShapeEntries).
 */
InlineToolbar.prototype.shapeEntries = null;

/**
 * Returns the key of the shape in the given style for the shapes of the
 * shape picker: the name of the shape, and for rectangles whether the
 * corners are rounded. Labels, the default shape, are rectangles.
 */
InlineToolbar.prototype.getShapeKey = function(style)
{
	var shape = mxUtils.getValue(style, mxConstants.STYLE_SHAPE, mxConstants.SHAPE_LABEL);

	if (shape == mxConstants.SHAPE_LABEL)
	{
		shape = mxConstants.SHAPE_RECTANGLE;
	}

	return (shape == mxConstants.SHAPE_RECTANGLE) ? shape + ((mxUtils.getValue(style,
		mxConstants.STYLE_ROUNDED, '0') == '1') ? ':rounded' : '') : shape;
};

/**
 * Basic shapes of the General palette that are not in the shape picker as
 * the style, the width, the height, the resource key and the default of the
 * title (see getShapeEntries).
 */
InlineToolbar.prototype.basicShapes = [
	['shape=cylinder3;whiteSpace=wrap;html=1;boundedLbl=1;backgroundOutline=1;size=15;',
		60, 80, 'cylinder', 'Cylinder'],
	['shape=cube;whiteSpace=wrap;html=1;boundedLbl=1;backgroundOutline=1;darkOpacity=0.05;' +
		'darkOpacity2=0.1;', 120, 80, 'cube', 'Cube'],
	['shape=internalStorage;whiteSpace=wrap;html=1;backgroundOutline=1;',
		80, 80, 'internalStorage', 'Internal Storage'],
	['shape=dataStorage;whiteSpace=wrap;html=1;shapeInside=1;fixedSize=1;',
		100, 80, 'dataStorage', 'Data Storage'],
	['shape=note;whiteSpace=wrap;html=1;backgroundOutline=1;darkOpacity=0.05;',
		80, 100, 'note', 'Note'],
	['shape=card;whiteSpace=wrap;html=1;', 80, 100, 'card', 'Card'],
	['shape=callout;whiteSpace=wrap;html=1;perimeter=calloutPerimeter;',
		120, 80, 'callout', 'Callout'],
	['shape=wedgeCallout;whiteSpace=wrap;html=1;', 120, 80, 'wedgeCallout', 'Wedge Callout'],
	['shape=xor;whiteSpace=wrap;html=1;shapeInside=1;', 60, 80, 'or', 'Or'],
	['shape=or;whiteSpace=wrap;html=1;shapeInside=1;', 60, 80, 'and', 'And']];

/**
 * Returns the shapes of the shape picker (see EditorUi.getCellsForShapePicker),
 * including configured shapes, and the other basic shapes of the General
 * palette (see basicShapes) that a shape can be changed to: vertices without
 * children with a line or fill that can be resized, eg. not the text and the
 * waypoint, once for each shape. Each entry has the cell, the key of its
 * shape (see getShapeKey) and a title.
 */
InlineToolbar.prototype.getShapeEntries = function()
{
	if (this.shapeEntries == null)
	{
		var graph = this.graph;
		var cells = this.editorUi.getCellsForShapePicker(null, false, false);
		var titles = {'rectangle:rounded': mxResources.get('rectangle') + ' (' +
			mxResources.get('rounded') + ')', 'singleArrow': mxResources.get('arrow')};
		var seen = {};
		this.shapeEntries = [];

		for (var i = 0; i < this.basicShapes.length; i++)
		{
			var shape = this.basicShapes[i];
			var cell = graph.createVertex(null, null, '', 0, 0, shape[1], shape[2], shape[0]);
			titles[this.getShapeKey(graph.getCellStyle(cell))] =
				mxResources.get(shape[3], null, shape[4]);
			cells.push(cell);
		}

		for (var i = 0; i < cells.length; i++)
		{
			var style = graph.getCellStyle(cells[i]);
			var key = this.getShapeKey(style);

			if (graph.model.isVertex(cells[i]) && graph.model.getChildCount(cells[i]) == 0 &&
				seen[key] == null &&
				mxUtils.getValue(style, mxConstants.STYLE_RESIZABLE, '1') != '0' &&
				(mxUtils.getValue(style, mxConstants.STYLE_FILLCOLOR, mxConstants.NONE) != mxConstants.NONE ||
				mxUtils.getValue(style, mxConstants.STYLE_STROKECOLOR, mxConstants.NONE) != mxConstants.NONE) &&
				style[mxConstants.STYLE_IMAGE] == null && key != null)
			{
				seen[key] = true;
				this.shapeEntries.push({cell: cells[i], key: key, title: mxResources.get(key,
					null, (titles[key] != null) ? titles[key] : key.split('.').pop())});
			}
		}
	}

	return this.shapeEntries;
};

/**
 * Returns true if the shape of the given or selected cells can be changed
 * (see getShapeSelection).
 */
InlineToolbar.prototype.isShapeSelection = function(cells)
{
	return this.getShapeSelection(cells) != null;
};

/**
 * Returns an empty string if the given or selected cells are shapes of the
 * shape picker (see getShapeEntries), else the ID of the palette of the
 * sidebar that has all of them (see getShapePalette), eg. flowchart for
 * flowchart shapes, else an empty string for a single shape, else null. The
 * empty string is not the ID of a palette, unlike basic for the Basic palette.
 * Groups, containers, parts of tables, text and label cells have no shape to
 * change, and images are not basic shapes.
 */
InlineToolbar.prototype.getShapeSelection = function(cells)
{
	cells = (cells != null) ? cells : this.currentCells;
	var graph = this.graph;
	var model = graph.model;
	var result = this.editorUi.sidebar != null && cells != null && cells.length > 0;
	var basic = result;
	var keys = null;

	// Keeps the styles of the parents while the cells are checked (see
	// getTargetCells)
	graph.cacheChildLayoutStyles(mxUtils.bind(this, function()
	{
		for (var i = 0; result && i < cells.length; i++)
		{
			var state = graph.view.getState(cells[i]);
			result = state != null && model.isVertex(cells[i]) &&
				model.getChildCount(cells[i]) == 0 && !this.isLabelCell(cells[i]) &&
				!graph.isSwimlane(cells[i]) && !graph.isContainer(cells[i]) &&
				!graph.isTable(cells[i]) && !graph.isTableRow(cells[i]) &&
				!graph.isTableCell(cells[i]) && !graph.isTransparentState(state);

			if (result && basic)
			{
				// Shape names of the entries, without rounded corners
				if (keys == null)
				{
					var entries = this.getShapeEntries();
					keys = {};

					for (var j = 0; j < entries.length; j++)
					{
						keys[entries[j].key.split(':')[0]] = true;
					}
				}

				basic = !graph.isImageState(state) &&
					keys[this.getShapeKey(state.style).split(':')[0]] == true;
			}
		}
	}));

	var palette = null;

	if (result && basic)
	{
		palette = '';
	}
	else if (result)
	{
		for (var i = 0; palette !== '' && i < cells.length; i++)
		{
			var id = this.getShapePalette(cells[i]);

			// Other single shapes can be changed to basic shapes
			if (id == null || (palette != null && id != palette))
			{
				result = cells.length == 1;
				id = '';
			}

			palette = id;
		}
	}

	return (result) ? palette : null;
};

/**
 * Returns the ID of the first palette of the sidebar that has the shape of
 * the given cell (see Sidebar.getShapeMatches) or null. The shapes of the
 * palettes are found in idle time after startup.
 */
InlineToolbar.prototype.getShapePalette = function(cell)
{
	var sidebar = this.editorUi.sidebar;
	var matches = (sidebar != null) ? sidebar.getShapeMatches(this.graph.model.getStyle(cell)) : null;

	return (matches != null) ? sidebar.getPaletteIdForLibrary(matches[0].lib) : null;
};

/**
 * Returns the shapes of the palette of the sidebar with the given ID that a
 * shape can be changed to: vertices without children, once for each key of
 * their style (see Sidebar.getPaletteShapes). Each entry has the cell, the
 * key and a title.
 */
InlineToolbar.prototype.getPaletteEntries = function(id)
{
	var shapes = this.editorUi.sidebar.getPaletteShapes(id);
	var seen = Object.create(null);
	var result = [];

	for (var i = 0; i < shapes.length; i++)
	{
		var key = shapes[i].key;

		if (this.graph.model.getChildCount(shapes[i].cell) == 0 &&
			key.length > 0 && seen[key] == null)
		{
			seen[key] = true;
			result.push(shapes[i]);
		}
	}

	return result;
};

/**
 * Shows the shapes that the selected shapes can be changed to and marks the
 * current shape. For basic shapes and single shapes of no palette, these are
 * the shapes of the shape picker in the style of the first selected shape
 * (see getShapeEntries), which keep the styles of the shapes (see
 * Graph.updateShapes). For shapes of a palette in the sidebar, these are
 * the shapes of the palette under its title (see getPaletteEntries) with
 * their style, as if they were inserted from the sidebar, and the formatting
 * of the shapes (see EditorUi.getPaletteStyle). Both keep the labels, sizes
 * and connections. The search above the shapes finds the shapes of all
 * libraries like the search of the shape picker (see
 * EditorUi.searchShapePickerCells), or filters the shapes of the popover
 * where the app has no such search. The popover stays open.
 */
InlineToolbar.prototype.showShapeMenu = function(evt)
{
	this.editorUi.hideCurrentMenu();
	var palette = this.getShapeSelection();

	if (this.currentState == null || palette == null)
	{
		return;
	}

	var ui = this.editorUi;
	var graph = this.graph;
	var sidebar = ui.sidebar;
	var basic = palette === '';
	var entries = (basic) ? this.getShapeEntries() : this.getPaletteEntries(palette);
	var style = graph.copyStyle(this.currentCells[0]);
	var p = this.createPopover(this.shapeBtn, {kind: 'shape'});
	var itemSize = this.iconSize + 8;
	var items = [];

	// The tiles of the shapes that the search found (see find)
	var foundItems = [];

	// The tile of the search that was applied last with the cells and the
	// styles that it gave them (see update)
	var applied = null;

	var grid = document.createElement('div');
	grid.style.display = 'grid';
	grid.style.gridTemplateColumns = 'repeat(' + Math.max(1, Math.min(7, entries.length)) +
		', ' + itemSize + 'px)';
	grid.style.gap = '2px';

	// Returns the key of the shape of the given cell for the entries, which is
	// the key of the closest shape of the palette for shapes of a palette, eg.
	// if they were rotated (see Sidebar.getPaletteShape)
	var getKey = mxUtils.bind(this, function(cell)
	{
		var key = null;

		if (basic)
		{
			key = this.getShapeKey(graph.getCurrentCellStyle(cell));
		}
		else
		{
			var entry = sidebar.getPaletteShape(graph.model.getStyle(cell), function(lib)
			{
				return sidebar.getPaletteIdForLibrary(lib) == palette;
			});

			key = (entry != null) ? entry.key : null;
		}

		return key;
	});

	// Marks the shape of the selected shapes if they have the same shape
	var update = mxUtils.bind(this, function()
	{
		var key = null;

		for (var i = 0; i < this.currentCells.length; i++)
		{
			var next = getKey(this.currentCells[i]);

			if (i > 0 && next != key)
			{
				key = null;
				break;
			}

			key = next;
		}

		// The tile of the search that was applied is marked while the selected
		// shapes keep the styles that it gave them, which marks a shape of
		// another library in a palette and one of several tiles of the same
		// basic shape. Else the first tile of the search with the key.
		var last = (applied != null && applied.cells.length == this.currentCells.length) ?
			applied.item : null;

		for (var i = 0; i < this.currentCells.length && last != null; i++)
		{
			if (applied.cells[i] != this.currentCells[i] ||
				graph.model.getStyle(this.currentCells[i]) != applied.styles[i])
			{
				last = null;
			}
		}

		var all = items.concat(foundItems);
		var marked = false;

		for (var i = 0; i < all.length; i++)
		{
			var active = false;

			if (i < items.length)
			{
				active = key != null && all[i].key == key;
			}
			else if (last != null)
			{
				active = all[i] == last;
			}
			else
			{
				active = !marked && key != null && all[i].key == key;
				marked = marked || active;
			}

			all[i].elt.style.backgroundColor = (active) ? 'light-dark(#e8f0fe, #3c4043)' : '';
			all[i].elt.style.border = (active) ? '2px solid light-dark(#1a73e8, #8ab4f8)' :
				'2px solid transparent';
			all[i].active = active;
		}
	});

	// Thumbnails of large palettes are created when they are scrolled into view
	var observer = (!basic && typeof window.IntersectionObserver === 'function') ?
		new IntersectionObserver(function(changes)
		{
			for (var i = 0; i < changes.length; i++)
			{
				if (changes[i].isIntersecting && changes[i].target.render != null)
				{
					changes[i].target.render();
					changes[i].target.render = null;
					observer.unobserve(changes[i].target);
				}
			}
		}, {root: null}) : null;

	// Adds the tile of the given entry to the given grid and list. Shapes that
	// change like basic shapes are shown in the style of the selected shape,
	// the others with the style of their palette.
	var addEntry = mxUtils.bind(this, function(entry, parent, list, asBasic)
	{
		// Shows a basic shape in the style of the selected shape (see showShapePicker).
		// Rectangles keep their corners, which are the difference of the shapes.
		var rect = asBasic && entry.key.split(':')[0] == mxConstants.SHAPE_RECTANGLE;
		var cell = graph.model.cloneCell(entry.cell);

		if (asBasic)
		{
			var temp = mxUtils.clone(style);

			if (rect)
			{
				delete temp[mxConstants.STYLE_ROUNDED];
			}

			sidebar.graph.pasteStyle(temp, [cell]);
		}

		var elt = document.createElement('div');
		elt.style.width = itemSize + 'px';
		elt.style.height = itemSize + 'px';
		elt.style.boxSizing = 'border-box';
		elt.style.borderRadius = '6px';
		elt.style.cursor = 'pointer';
		elt.style.display = 'flex';
		elt.style.alignItems = 'center';
		elt.style.justifyContent = 'center';
		elt.setAttribute('title', entry.title);
		elt.setAttribute('tabindex', '-1');

		var thumb = document.createElement('div');
		thumb.style.width = '24px';
		thumb.style.height = '24px';
		elt.appendChild(thumb);

		var render = function()
		{
			var temp = graph.model.cloneCell(cell);

			// Free text found by the search shows its text in the size of
			// the tile, as in the shape picker (see Sidebar.fitThumbToLabel);
			// the other thumbnails have no labels
			var label = sidebar.isThumbFitToLabel(entry.cell);

			if (label)
			{
				sidebar.fitThumbToLabel(temp);
			}

			sidebar.createThumb([temp], 24, 24, thumb, null, label, false,
				null, null, null, 0);
		};

		// The shapes found are few and shown at once
		if (observer != null && list == items)
		{
			thumb.render = render;
			observer.observe(thumb);
		}
		else
		{
			render();
		}

		// The text that the filter finds: the title and the name of the shape
		var name = (basic) ? entry.key.split(':')[0].split('.').pop() :
			((entry.name != null) ? entry.name.split('.').pop() : '');
		var item = {entry: entry, key: entry.key, elt: elt, active: false,
			text: (entry.title + ' ' + name).toLowerCase()};
		list.push(item);

		mxEvent.addListener(elt, 'mouseenter', function()
		{
			if (!item.active)
			{
				elt.style.backgroundColor = 'light-dark(#f0f0f0, #4a4a4a)';
			}
		});

		mxEvent.addListener(elt, 'mouseleave', function()
		{
			if (!item.active)
			{
				elt.style.backgroundColor = '';
			}
		});

		// Basic shapes keep their own styles (see Graph.updateShapes), so the
		// style of the first shape in the preview is not used for the other
		// shapes. Shapes of a palette get the style of the palette, as if they
		// were inserted from the sidebar, so that they are found in it again,
		// with the formatting of each shape (see EditorUi.getPaletteStyle).
		mxEvent.addListener(elt, 'click', mxUtils.bind(this, function(e)
		{
			var cells = graph.getEditableCells(this.currentCells);
			graph.stopEditing(false);

			if (asBasic)
			{
				graph.updateShapes(graph.model.cloneCell(entry.cell), cells, false,
					(rect) ? [mxConstants.STYLE_ROUNDED] : null);
			}
			else
			{
				var arrange = graph.beginArrange();

				try
				{
					for (var i = 0; i < cells.length; i++)
					{
						var previous = null;

						if (!basic)
						{
							var key = getKey(cells[i]);

							for (var j = 0; j < entries.length && previous == null; j++)
							{
								if (entries[j].key == key)
								{
									previous = entries[j];
								}
							}
						}

						// A shape that is in no entry of the palette, such as a
						// shape of another library that the search found and that
						// a tile of the palette changes back, changes from the
						// closest shape of the sidebar, so that it gets no styles
						// of the other library
						if (previous == null)
						{
							previous = sidebar.getPaletteShape(graph.model.getStyle(cells[i]));
						}

						graph.model.setStyle(cells[i], ui.getPaletteStyle(
							cells[i], entry, previous));
					}
				}
				finally
				{
					graph.endArrange(arrange);
				}

				sidebar.addRecentShapes([entry.cell]);
			}

			// The result of the search that was applied is marked (see update)
			applied = null;

			if (list != items)
			{
				var styles = [];

				for (var i = 0; i < cells.length; i++)
				{
					styles.push(graph.model.getStyle(cells[i]));
				}

				applied = {item: item, cells: cells, styles: styles};
			}

			this.updatePopover();
			mxEvent.consume(e);
		}));

		parent.appendChild(elt);
	});

	for (var i = 0; i < entries.length; i++)
	{
		addEntry(entries[i], grid, items, basic);
	}

	update();
	this.addPopoverUpdate(update);

	// The search of the shapes (the driver, 17 November 2026: "Hat die beim
	// Shape Dropdown eine Suche, das wäre noch cool") searches all libraries
	// like the shape picker (the driver, 18 November 2026: "ich will eine
	// echte Suche")
	var search = this.setPart(document.createElement('input'), 'search');
	search.setAttribute('type', 'search');
	search.setAttribute('placeholder', mxResources.get('searchShapes'));
	search.setAttribute('aria-label', mxResources.get('searchShapes'));
	search.setAttribute('autocomplete', 'off');
	search.setAttribute('spellcheck', 'false');
	search.style.display = 'block';
	search.style.boxSizing = 'border-box';
	search.style.width = '100%';
	search.style.marginBottom = '6px';
	p.body.appendChild(search);

	// The popover consumes the mouse down (so the cells stay selected), which
	// would keep a click or a tap from focusing the search and placing the
	// caret: it stops at the search without preventing the default
	mxEvent.addListener(search, 'mousedown', function(evt)
	{
		evt.stopPropagation();
	});

	// The shapes, the shapes found and the note if the search finds none or
	// waits for the icon service; the shapes of a palette scroll after 5 rows
	// under the title of the palette
	var results = document.createElement('div');
	results.style.boxSizing = 'border-box';
	results.appendChild(grid);

	var foundGrid = this.setPart(document.createElement('div'), 'found');
	foundGrid.style.setProperty('display', 'none', 'important');
	foundGrid.style.gridTemplateColumns = grid.style.gridTemplateColumns;
	foundGrid.style.gap = grid.style.gap;
	results.appendChild(foundGrid);

	var empty = this.setPart(document.createElement('div'), 'empty');
	empty.style.display = 'none';
	empty.style.padding = '8px 4px';
	empty.style.fontSize = '12px';
	empty.style.overflowWrap = 'anywhere';
	empty.setAttribute('role', 'status');
	results.appendChild(empty);

	var title = null;

	if (!basic)
	{
		title = this.setPart(this.createLabel(sidebar.getPaletteTitle(palette)), 'title');
		title.style.display = 'block';
		title.style.marginBottom = '6px';
		p.body.appendChild(title);

		// Scrolls unless the popover scrolls (see createPopover)
		p.scrolls.push({elt: results, maxHeight: (5 * (itemSize + 2)) + 'px'});
	}

	// The end of the list does not scroll the diagram (the list of the
	// basic shapes scrolls after More Results, see prepare), which would
	// close the popover
	results.style.overscrollBehavior = 'contain';

	p.body.appendChild(results);

	// More Results below the shapes found, as in the search of the sidebar
	// (the driver, 22 November 2026: "würde hier ein "more results" noch sinn
	// machen? damit nicht nur 12 results"): it adds the next shapes below them
	// and the list scrolls to the first new row; hidden without more shapes.
	// It stays below the list that scrolls, so it stays under the mouse.
	var more = this.setPart(document.createElement('div'), 'more');
	more.style.display = 'none';
	more.style.paddingTop = '6px';

	var moreButton = this.createTextButton(mxResources.get('moreResults'),
		mxResources.get('moreResults'), function()
	{
		loadMore();
	});

	moreButton.setAttribute('role', 'button');
	moreButton.setAttribute('tabindex', '0');
	more.appendChild(moreButton);
	p.body.appendChild(more);

	// The popover keeps its size while the search changes the shapes, so it
	// stays at its place
	var keepSize = function()
	{
		if (results.style.minHeight == '')
		{
			results.style.minHeight = results.offsetHeight + 'px';
		}
	};

	// The room of the shapes found (see prepare): the height of the shapes of
	// the popover and of the name of a palette, which hides while searching,
	// and how the shapes found fill it (columns, the height of a shape, the
	// gap between the rows, the padding of the list and the height of More
	// Results), the entry of the list in the parts that scroll (see
	// createPopover) and its height without the search
	var room = null;
	var layout = null;
	var scroll = null;
	var scrollMax = null;
	var minHeight = null;

	// The result of the last search for More Results (null if there are no
	// more shapes), its words and true while More Results waits for the icon
	// service
	var next = null;
	var lastTerm = null;
	var loadingMore = false;

	// Shows the given note (none if null)
	var showNote = function(text)
	{
		empty.textContent = '';

		if (text != null)
		{
			mxUtils.write(empty, text);
		}

		empty.style.display = (text != null) ? '' : 'none';
		results.scrollTop = 0;
	};

	// True while the shapes found (or the note of the search) are shown in
	// place of the shapes of the popover
	var searching = false;
	var real = ui.canSearchShapePickerCells();

	// True while the search waits for the icon service, and the key (Enter or
	// Arrow Down) pressed in the search meanwhile, which goes to the shapes
	// found when they come
	var loading = false;
	var pending = null;
	var counter = 0;
	var thread = null;

	// Returns the tiles of the shapes that are shown
	var getShown = function()
	{
		var list = (searching) ? foundItems : items;
		var result = [];

		for (var i = 0; i < list.length; i++)
		{
			if (list[i].elt.style.display != 'none')
			{
				result.push(list[i].elt);
			}
		}

		return result;
	};

	// Enter applies the first shape shown, Arrow Down moves to it
	var goToShapes = function(keyCode)
	{
		var shown = getShown();

		if (shown.length > 0)
		{
			if (keyCode == 13)
			{
				shown[0].click();
			}
			else
			{
				shown[0].focus();
			}
		}

		return shown.length > 0;
	};

	// Shows the shapes of the popover (searching is false) or the shapes
	// found and hides the title of the palette, as they are of all libraries.
	// The look of a theme may give the grids a display with priority.
	var setSearching = mxUtils.bind(this, function(value)
	{
		searching = value;
		grid.style.setProperty('display', (value) ? 'none' : 'grid', 'important');
		foundGrid.style.setProperty('display', (value && foundItems.length > 0) ?
			'grid' : 'none', 'important');

		if (title != null)
		{
			title.style.display = (value) ? 'none' : 'block';
		}

		updateMore();
	});

	// Shows More Results while the search shows shapes and has more of them
	// (see find). The shapes found and their note take the room of the shapes
	// of the popover and of the name of a palette, less More Results while
	// it is shown, so the popover keeps its height (the driver, 19 November
	// 2026: nothing slides away under the mouse); the shapes found scroll
	// in it. The popover applies the height (see createPopover).
	var updateMore = function()
	{
		var shown = searching && next != null && foundItems.length > 0;
		more.style.display = (shown) ? '' : 'none';

		if (room != null)
		{
			var height = (searching) ? (room - ((shown) ? layout.more : 0)) + 'px' : null;
			results.style.minHeight = (height != null) ? height : minHeight;
			scroll.maxHeight = (height != null) ? height : scrollMax;
		}
	};

	// Shows the given label on More Results and the busy state while it
	// waits for the icon service
	var setMoreLabel = function(label, busy)
	{
		var elt = (moreButton.firstChild != null && moreButton.firstChild.nodeType ==
			mxConstants.NODETYPE_ELEMENT) ? moreButton.firstChild : moreButton;
		elt.textContent = '';
		mxUtils.write(elt, label);
		moreButton.setAttribute('aria-label', label);
		moreButton.style.cursor = (busy) ? 'wait' : '';

		if (busy)
		{
			moreButton.setAttribute('aria-disabled', 'true');
		}
		else
		{
			moreButton.removeAttribute('aria-disabled');
		}
	};

	// Measures the room of the shapes found when the first search starts,
	// while the shapes of the popover are shown: their columns and rows, and
	// the name of a palette, which the search hides (the look of a theme
	// hides its head when the popover updates). It has at least two rows of
	// shapes and More Results, as a small palette has less room.
	var prepare = mxUtils.bind(this, function()
	{
		if (room == null)
		{
			keepSize();
			minHeight = results.style.minHeight;
			var cs = mxUtils.getCurrentStyle(grid);
			var rs = mxUtils.getCurrentStyle(results);
			var cols = 0;

			if (cs != null && typeof cs.gridTemplateColumns === 'string')
			{
				var tracks = cs.gridTemplateColumns.split(/\s+/);

				for (var i = 0; i < tracks.length; i++)
				{
					cols += (/^[\d.]+px$/.test(tracks[i])) ? 1 : 0;
				}
			}

			// The shapes in the first row where the columns cannot be read
			for (var i = 0; cols == 0 && i < items.length; i++)
			{
				if (i > 0 && items[i].elt.offsetTop != items[0].elt.offsetTop)
				{
					cols = i;
				}
			}

			more.style.display = '';
			layout = {cols: Math.max(1, (cols > 0) ? cols : items.length),
				tile: (items.length > 0 && items[0].elt.offsetHeight > 0) ?
					items[0].elt.offsetHeight : itemSize,
				gap: (cs != null) ? (parseFloat(cs.rowGap) || 0) : 0,
				pad: (rs != null) ? ((parseFloat(rs.paddingTop) || 0) +
					(parseFloat(rs.paddingBottom) || 0)) : 0,
				more: more.offsetHeight};
			more.style.display = 'none';

			for (var i = 0; i < p.scrolls.length && scroll == null; i++)
			{
				if (p.scrolls[i].elt == results)
				{
					scroll = p.scrolls[i];
				}
			}

			// The shapes of the popover do not scroll, the shapes found do
			if (scroll == null)
			{
				scroll = {elt: results, maxHeight: ''};
				p.scrolls.push(scroll);
			}

			// The height of the list where it scrolls on its own (a popover
			// higher than the diagram shows all of it, see createPopover),
			// without the height that it keeps (see keepSize), which is the
			// height of all its shapes there
			scrollMax = scroll.maxHeight;
			var maxHeight = results.style.maxHeight;
			var full = results.offsetHeight;
			results.style.minHeight = '';

			if (scrollMax != null && scrollMax !== '')
			{
				results.style.maxHeight = scrollMax;
			}

			room = results.offsetHeight;
			results.style.maxHeight = maxHeight;
			results.style.minHeight = minHeight;

			// A popover that scrolls as a whole keeps its height: the list
			// keeps at least the part of it that the popover shows
			var overflow = p.body.scrollHeight - p.body.clientHeight;

			if (overflow > 0)
			{
				room = Math.max(room, full - overflow);
			}

			// The room of the name of a palette: the list moves up to the search
			var getGap = function()
			{
				return results.getBoundingClientRect().top - search.getBoundingClientRect().bottom;
			};

			var gap = getGap();
			setSearching(true);
			this.updatePopover();
			room = Math.max(room + Math.max(0, Math.round(gap - getGap())),
				2 * layout.tile + layout.gap + layout.pad + layout.more);
			updateMore();
		}
	});

	// Returns the number of shapes found that fill the room above More
	// Results in whole rows
	var getPageSize = function()
	{
		var rows = Math.floor((room - layout.more - layout.pad + layout.gap) /
			(layout.tile + layout.gap));

		return Math.max(2, rows) * layout.cols;
	};

	// Shows the shapes that have all words of the search in their title or
	// name where the app cannot search all libraries
	var filter = function()
	{
		var words = search.value.toLowerCase().split(/\s+/);
		var found = 0;
		keepSize();

		for (var i = 0; i < items.length; i++)
		{
			var match = true;

			for (var j = 0; j < words.length && match; j++)
			{
				match = items[i].text.indexOf(words[j]) >= 0;
			}

			items[i].elt.style.display = (match) ? 'flex' : 'none';
			found += (match) ? 1 : 0;
		}

		showNote((found == 0) ? mxResources.get('noResultsFor', [search.value]) : null);
	};

	// Basic shapes of the popover that the search found change like the
	// basic shapes of the popover, in the style of the selected shape
	var isBasic = mxUtils.bind(this, function(cell, key)
	{
		var cellStyle = graph.getCellStyle(cell);
		var result = basic && cellStyle[mxConstants.STYLE_IMAGE] == null &&
			mxUtils.getValue(cellStyle, mxConstants.STYLE_RESIZABLE, '1') != '0' &&
			(mxUtils.getValue(cellStyle, mxConstants.STYLE_FILLCOLOR, mxConstants.NONE) != mxConstants.NONE ||
			mxUtils.getValue(cellStyle, mxConstants.STYLE_STROKECOLOR, mxConstants.NONE) != mxConstants.NONE);

		for (var i = 0; result && i < entries.length; i++)
		{
			if (entries[i].key == key)
			{
				return true;
			}
		}

		return false;
	});

	// The popover changes shapes, so it takes no shapes with children
	var accept = function(cell)
	{
		return graph.model.getChildCount(cell) == 0;
	};

	// Searches the shapes for the given words that fill the room of the list
	// (see getPageSize), after the given result of the search before (null
	// for the first shapes), and calls the given function with them, as More
	// Results of the shape picker does (EditorUi.searchShapePickerPage: the
	// search goes on after pages with no shapes for the popover while there
	// are more). Returns true if the function is called later.
	var searchCells = function(term, fn, isCurrent, from)
	{
		return ui.searchShapePickerPage(term, fn, isCurrent, accept, getPageSize(), from);
	};

	// Adds the tiles of the given shapes found by the search
	var addFound = mxUtils.bind(this, function(found)
	{
		for (var i = 0; i < found.cells.length; i++)
		{
			var cell = found.cells[i];
			var key = (basic) ? this.getShapeKey(graph.getCellStyle(cell)) :
				sidebar.getKeyStyle(graph.model.getStyle(cell));
			var name = sidebar.getShapeName(graph.model.getStyle(cell));
			var text = (found.titles[i] != null && found.titles[i] != '') ?
				found.titles[i] : name.split('.').pop();

			addEntry({cell: cell, key: key, name: name, title: text},
				foundGrid, foundItems, isBasic(cell, key));
		}

		next = (found.more) ? found : null;
	});

	// Adds the next shapes of the last search below the shapes found (More
	// Results), as many as fill the room of the list, and scrolls the list
	// so that their first row is at its top (as far as it scrolls). The
	// button says that it is loading while the icon service is asked. If it
	// has the focus when it hides, as there are no more shapes, the focus
	// goes to the first new shape (not if the focus moved meanwhile).
	var loadMore = mxUtils.bind(this, function()
	{
		if (next != null && !loadingMore && searching)
		{
			var from = next;
			var term = lastTerm;
			var current = counter;
			loadingMore = true;

			var isCurrent = mxUtils.bind(this, function()
			{
				return current == counter && this.currentPopover == p.popover &&
					term == mxUtils.trim(search.value);
			});

			var waiting = searchCells(term, mxUtils.bind(this, function(found)
			{
				if (isCurrent())
				{
					var first = foundItems.length;
					var focused = document.activeElement == moreButton;
					loadingMore = false;
					setMoreLabel(mxResources.get('moreResults'), false);
					addFound(found);
					updateMore();
					update();
					this.updatePopover();

					if (first < foundItems.length)
					{
						var elt = foundItems[first].elt;
						var scroller = (results.scrollHeight > results.clientHeight) ? results : p.body;
						var offset = (scroller == results) ? (parseFloat(mxUtils.getCurrentStyle(
							results).paddingTop) || 0) : 0;
						scroller.scrollTop += elt.getBoundingClientRect().top -
							scroller.getBoundingClientRect().top - offset;

						if (focused && next == null)
						{
							elt.focus({preventScroll: true});
						}
					}
					else if (focused && next == null && foundItems.length > 0)
					{
						foundItems[foundItems.length - 1].elt.focus({preventScroll: true});
					}
				}
			}), isCurrent, from);

			if (waiting && isCurrent())
			{
				setMoreLabel(mxResources.get('loading') + '...', true);
			}
		}
	});

	// Shows the shapes of all libraries that the search of the shape picker
	// finds for the words of the search: the same shapes in the same order
	// (EditorUi.searchShapePickerCells) as tiles of the popover, as many as
	// fill its room (see prepare), a note while the icon service is asked
	// and if none is found, and More Results if there are more shapes
	var find = mxUtils.bind(this, function(value)
	{
		var term = mxUtils.trim(value);
		var current = ++counter;
		pending = null;
		loading = false;
		keepSize();

		for (var i = 0; i < foundItems.length; i++)
		{
			foundGrid.removeChild(foundItems[i].elt);
		}

		foundItems = [];
		applied = null;
		next = null;
		lastTerm = term;

		if (loadingMore)
		{
			loadingMore = false;
			setMoreLabel(mxResources.get('moreResults'), false);
		}

		if (term.length == 0)
		{
			setSearching(false);
			showNote(null);
			this.updatePopover();
		}
		else
		{
			prepare();

			// An answer for words that are no longer in the search or for a
			// popover that closed changes nothing
			var isCurrent = mxUtils.bind(this, function()
			{
				return current == counter && this.currentPopover == p.popover &&
					term == mxUtils.trim(search.value);
			});

			var waiting = searchCells(term, mxUtils.bind(this, function(found)
			{
				if (isCurrent())
				{
					var last = pending;
					pending = null;
					loading = false;
					addFound(found);
					setSearching(true);
					showNote((foundItems.length == 0) ? mxResources.get('noResultsFor', [term]) : null);
					update();
					this.updatePopover();

					// A key pressed in the search while the icon service was
					// asked goes to the shapes now
					if (last != null && document.activeElement == search)
					{
						goToShapes(last);
					}
				}
			}), isCurrent, null);

			if (waiting && isCurrent())
			{
				setSearching(true);
				showNote(mxResources.get('loading') + '...');
				loading = true;

				// The look hides the head of the palette with the title
				this.updatePopover();
			}
		}
	});

	// Searches now if the last keystroke is still waiting
	var flush = function()
	{
		if (thread != null)
		{
			window.clearTimeout(thread);
			thread = null;
			find(search.value);
		}
	};

	// Searches 200 ms after the last keystroke, like the shape picker, at
	// once for an empty search
	var changed = mxUtils.bind(this, function()
	{
		if (real)
		{
			window.clearTimeout(thread);
			thread = null;

			if (search.value == '')
			{
				find('');
			}
			else
			{
				thread = window.setTimeout(mxUtils.bind(this, function()
				{
					thread = null;

					if (this.currentPopover == p.popover)
					{
						find(search.value);
					}
				}), 200);
			}
		}
		else
		{
			filter();
		}
	});

	mxEvent.addListener(search, 'input', changed);

	// Arrow Down moves to the shapes, Enter applies the first one (when they
	// come if the icon service is asked) and Escape clears the search before
	// it closes the popover
	mxEvent.addListener(search, 'keydown', function(evt)
	{
		if (evt.isComposing)
		{
			return;
		}
		else if (evt.keyCode == 40 || evt.keyCode == 13)
		{
			flush();

			if (!goToShapes(evt.keyCode) && loading)
			{
				pending = evt.keyCode;
			}

			mxEvent.consume(evt);
		}
		else if (evt.keyCode == 27 && search.value != '')
		{
			search.value = '';
			changed();
			mxEvent.consume(evt);
		}
	});

	// The arrow keys move between the shapes (up and down by the columns of
	// the grid, up from the first row to the search, down from the last row
	// to More Results), Enter and Space apply the focused shape, other keys
	// do not reach the diagram
	mxEvent.addListener(results, 'keydown', function(evt)
	{
		var shown = getShown();
		var index = mxUtils.indexOf(shown, document.activeElement);

		if (index >= 0)
		{
			if (evt.keyCode == 13 || evt.keyCode == 32)
			{
				// A key held down applies no shape: the focus comes to the
				// first new shape while Enter or Space on More Results repeats
				if (!evt.repeat)
				{
					shown[index].click();
				}

				mxEvent.consume(evt);
			}
			else if (evt.keyCode >= 37 && evt.keyCode <= 40)
			{
				var cols = 1;

				while (cols < shown.length && shown[cols].offsetTop == shown[0].offsetTop)
				{
					cols++;
				}

				var row = Math.floor(index / cols);
				var last = row >= Math.floor((shown.length - 1) / cols);
				var target = (evt.keyCode == 37) ? Math.max(0, index - 1) :
					((evt.keyCode == 39) ? Math.min(shown.length - 1, index + 1) :
					((evt.keyCode == 38) ? index - cols :
					((!last) ? Math.min(shown.length - 1, index + cols) : index)));

				if (target < 0)
				{
					search.focus();
				}
				else if (evt.keyCode == 40 && last && more.style.display != 'none')
				{
					moreButton.focus();
				}
				else
				{
					shown[target].focus();
				}

				mxEvent.consume(evt);
			}
			else if (evt.key != null && evt.key.length == 1 && !evt.ctrlKey &&
				!evt.metaKey && !evt.altKey)
			{
				// Typing goes on in the search
				search.focus();
				evt.stopPropagation();
			}
			else if (evt.keyCode != 27 && evt.keyCode != 9)
			{
				evt.stopPropagation();
			}
		}
	});

	// Enter and Space on More Results add the next shapes, Arrow Up moves to
	// the last shape, typing goes on in the search, other keys but Escape and
	// Tab do not reach the diagram
	mxEvent.addListener(moreButton, 'keydown', function(evt)
	{
		if (evt.keyCode == 13 || evt.keyCode == 32)
		{
			loadMore();
			mxEvent.consume(evt);
		}
		else if (evt.keyCode == 38)
		{
			var shown = getShown();

			if (shown.length > 0)
			{
				shown[shown.length - 1].focus();
			}

			mxEvent.consume(evt);
		}
		else if (evt.key != null && evt.key.length == 1 && !evt.ctrlKey &&
			!evt.metaKey && !evt.altKey)
		{
			search.focus();
			evt.stopPropagation();
		}
		else if (evt.keyCode != 27 && evt.keyCode != 9)
		{
			evt.stopPropagation();
		}
	});

	p.position();
	p.animateIn();

	// The focus is in the search, except on touch devices, where the keyboard
	// would cover the shapes
	if (!(window.matchMedia != null && window.matchMedia('(pointer: coarse)').matches))
	{
		search.focus({preventScroll: true});
	}
};

/**
 * Adds an option that turns the given style key of the selected cells on (1)
 * or off (0, which overrides named styles such as label or fancy, see
 * createCellOption in Format) and that is marked if it is on for all of
 * them. The optional keys and values are set with the key and removed with
 * it, eg. the curve fitting of sketch. The popover stays open. The option
 * keeps the style key (styleKey).
 */
InlineToolbar.prototype.addToggleOption = function(options, name, image, group, key, keys, values)
{
	options.push({title: mxResources.get(name), image: image, group: group, keepOpen: true,
		styleKey: key, isSelected: function(style)
		{
			return mxUtils.getValue(style, key, '0') == '1';
		},
		fn: mxUtils.bind(this, function()
		{
			var on = mxUtils.getValue(this.getCurrentStyle(this.currentCells), key, '0') == '1';
			var allKeys = [key].concat((keys != null) ? keys : []);
			var allValues = (on) ? ['0'].concat(allKeys.slice(1).map(function() { return null; })) :
				['1'].concat((values != null) ? values : []);

			this.setCellStyles(allKeys, allValues, this.currentCells);
		})});
};

/**
 * Returns the options of the given or selected cells for the More button: the
 * options of a single cell (see getCellOptions) and the effects of shapes and
 * edges (rounded, sketch, glass, shadow, multiple shapes and flow animation,
 * see addEffects in Format). This is a hook for adding options of all
 * selections.
 */
InlineToolbar.prototype.getOptions = function(cells)
{
	cells = (cells != null) ? cells : this.currentCells;
	var result = (cells != null && cells.length == 1) ? this.getCellOptions(cells[0]) : [];
	var graph = this.graph;
	var model = graph.model;
	var effects = cells != null && cells.length > 0 && (cells.length > 1 ||
		!this.isUnlockable(cells[0]));
	var vertices = effects;
	var edges = effects;
	var rounded = effects;
	var glass = effects;

	// Label cells have no effects, rounded and glass are only for shapes
	// that support them (see EditorUi.getSelectionState)
	for (var i = 0; effects && i < cells.length; i++)
	{
		var state = graph.view.getState(cells[i]);
		effects = state != null && !this.isLabelCell(cells[i]) && !graph.isEdgeLabelCell(cells[i]);
		vertices = vertices && model.isVertex(cells[i]);
		edges = edges && model.isEdge(cells[i]);
		rounded = rounded && state != null && graph.isRoundedState(state);
		glass = glass && state != null && graph.isGlassState(state);
	}

	if (effects)
	{
		// Connection points follow the rounded outline (see addEffects in Format)
		if (vertices && rounded)
		{
			this.addToggleOption(result, 'rounded', InlineToolbar.roundedImage, 'effects',
				mxConstants.STYLE_ROUNDED, ['roundedPerimeter'], ['1']);
		}

		this.addToggleOption(result, 'sketch', InlineToolbar.sketchImage, 'effects', 'sketch',
			['curveFitting', 'jiggle'], [Editor.sketchDefaultCurveFitting, Editor.sketchDefaultJiggle]);

		if (vertices && glass)
		{
			this.addToggleOption(result, 'glass', InlineToolbar.glassImage, 'effects',
				mxConstants.STYLE_GLASS);
		}

		if (Editor.enableShadowOption !== false)
		{
			this.addToggleOption(result, 'shadow', InlineToolbar.shadowImage,
				'effects', mxConstants.STYLE_SHADOW);
		}

		if (vertices)
		{
			this.addToggleOption(result, 'multiple', InlineToolbar.multipleImage,
				'effects', 'multiple');
		}

		if (edges)
		{
			this.addToggleOption(result, 'flowAnimation', InlineToolbar.flowAnimationImage,
				'effects', 'flowAnimation');
		}
	}

	return result;
};

/**
 * Hides the context menu and the current menu of the user interface (eg. a
 * menu of the menubar or the font menu of Text) when a dropdown or one of its
 * lists opens: the dropdowns and the menus are mutually exclusive. The
 * gesture listeners of the document that hide the menus miss a click of the
 * toolbar where they listen to the mousedown that the toolbar and the
 * popover consume (mouse events on the Mac) and a dropdown that the keyboard
 * opens.
 */
InlineToolbar.prototype.hidePopupMenus = function()
{
	this.graph.popupMenuHandler.hideMenu();
	this.editorUi.hideCurrentMenu();
};

/**
 * Hides the popover when a menu of the user interface is shown (see
 * EditorUi.setCurrentMenu), except a menu of the popover itself (see
 * showPopoverMenu).
 */
InlineToolbar.prototype.currentMenuShown = function(menu)
{
	if (!this.showingPopoverMenu)
	{
		this.hidePopover();
	}
};

/**
 * Shows the popup menu of the given function as a menu of the popover, eg.
 * the fonts of Text, which keeps the popover open (see currentMenuShown).
 */
InlineToolbar.prototype.showPopoverMenu = function(fn, x, y, evt)
{
	this.showingPopoverMenu = true;

	try
	{
		this.editorUi.showPopupMenu(fn, x, y, evt);
	}
	finally
	{
		this.showingPopoverMenu = false;
	}
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
	this.popoverKind = null;

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

			// It shrinks where it is, towards its button, and a change in the
			// meantime moves the toolbar after that (see show)
			this.closingPopover = popover;

			window.setTimeout(mxUtils.bind(this, function()
			{
				if (popover.parentNode != null)
				{
					popover.parentNode.removeChild(popover);
				}

				if (this.closingPopover == popover)
				{
					this.popoverClosed();
				}
			}), duration);
		}
	}
};

/**
 * Called when the popover that shrank after it was closed is gone or
 * another popover opens: shows the buttons and the place of the toolbar for
 * a change that came in while it shrank (see closingPopover).
 */
InlineToolbar.prototype.popoverClosed = function()
{
	this.closingPopover = null;

	if (this.repaintAfterClose)
	{
		this.repaintAfterClose = false;
		this.show();
	}
};

/**
 * Removes all listeners and DOM elements.
 */
InlineToolbar.prototype.destroy = function()
{
	this.hidePopover(true);
	this.closingPopover = null;
	this.repaintAfterClose = false;

	if (this.editorUi.hoverIcons != null &&
		this.editorUi.hoverIcons.isSuspended == this.hoverIconsSuspended)
	{
		if (this.previousHoverIconsSuspended != null)
		{
			this.editorUi.hoverIcons.isSuspended = this.previousHoverIconsSuspended;
		}
		else
		{
			delete this.editorUi.hoverIcons.isSuspended;
		}
	}

	if (this.hideTimeout != null)
	{
		window.clearTimeout(this.hideTimeout);
		this.hideTimeout = null;
	}

	this.graph.popupMenuHandler.removeListener(this.contextMenuHandler);
	this.graph.selectionModel.removeListener(this.selectionHandler);
	this.graph.model.removeListener(this.modelHandler);
	this.graph.view.removeListener(this.repaintHandler);
	this.graph.removeListener(this.selectionHandler);
	this.graph.removeListener(this.repaintHandler);
	this.graph.removeListener(this.hideHandler);
	this.editorUi.removeListener(this.selectionHandler);
	mxEvent.removeListener(this.graph.container, 'scroll', this.scrollHandler);

	for (var i = 0; i < this.pointerEvents.length; i++)
	{
		this.graph.container.removeEventListener(this.pointerEvents[i], this.pointerHandler, true);
	}

	this.graph.container.removeEventListener(this.pointerLeaveEvent, this.pointerLeaveHandler);

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

/**
 * Returns true if the inline toolbar is hidden for the current state of the
 * UI (eg. while a panel shows the format of the selection). This
 * implementation returns false.
 */
EditorUi.prototype.isInlineToolbarSuppressed = function()
{
	return false;
};
