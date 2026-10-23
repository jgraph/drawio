/**
 * Copyright (c) 2006-2026, JGraph Holdings Ltd
 * Copyright (c) 2006-2026, draw.io AG
 */
/**
 * Opens a force-directed explorer for the given vertex of the given graph.
 * Config: depth (initial number of levels, default 1), maxChildren (default
 * 12), maxNodes (default 150), reducedMotion (default from the media query),
 * instant (opens without the zoom from the cell, default false), mode
 * ('transform' or 'model', see below) and modelCoordinates (default true).
 *
 * Shows the neighbourhood of a cell in a live force simulation: a click
 * moves a cell to the center, dragging a cell pulls its neighbours along and
 * zooming out adds levels of neighbours (zooming in removes them). Arrows run
 * along the connectors from their source to their target.
 *
 * Layout: the shapes, their labels and the labels of the connectors are kept
 * apart (see measure). The explorer opens with a zoom that shows the levels
 * inside of the container, and zooming out adds a level only if its nodes
 * are inside of the container (see updateDepth), also for large shapes.
 *
 * Rendering: the simulation writes the positions into the geometries of the
 * overlay model without model events. The states of the moved vertices are
 * updated without a repaint and their painted SVG nodes are moved with a
 * translate (mode 'transform', the default). Only the connectors are
 * repainted in each frame. The mode 'model' writes the positions through the
 * model instead, which repaints all moved cells, for comparison.
 */
function ForceExplorer(sourceGraph, cell, config)
{
	config = (config != null) ? config : {};
	this.sourceGraph = sourceGraph;
	this.mode = (config.mode == 'model') ? 'model' : 'transform';
	this.maxChildren = ForceExplorer.getIntOption(config.maxChildren, 1, 100, 12);
	this.maxNodes = ForceExplorer.getIntOption(config.maxNodes, 1, 500, 150);
	this.reducedMotion = (config.reducedMotion != null) ? config.reducedMotion :
		ForceExplorer.isReducedMotion();
	this.instant = config.instant === true;
	this.nodes = [];
	this.links = [];
	this.history = [];
	this.depth = Math.max(1, Math.min(this.maxDepth,
		parseInt(config.depth) || 1));

	// Maps from IDs of the diagram, which are untrusted
	this.nodeBySource = Object.create(null);
	this.linkBySource = Object.create(null);
	this.caps = Object.create(null);
	this.groups = Object.create(null);

	this.nextId = 0;
	this.alpha = 1;
	this.alphaTarget = 0;
	this.renderStamp = 0;
	this.wheelTime = 0;
	this.frameThread = null;
	this.frameHandler = mxUtils.bind(this, this.frame);
	this.resetStats();
	this.init(cell, config.modelCoordinates != false);
};

/**
 * Returns the given integer option in the given range or the default.
 */
ForceExplorer.getIntOption = function(value, min, max, defaultValue)
{
	value = parseInt(value);

	return (isNaN(value)) ? defaultValue : Math.max(min, Math.min(max, value));
};

/**
 * Simulation parameters, see d3-force. Distances are in model units.
 */
ForceExplorer.prototype.alphaMin = 0.001;
ForceExplorer.prototype.alphaDecay = 1 - Math.pow(0.001, 1 / 300);
ForceExplorer.prototype.velocityDecay = 0.4;
ForceExplorer.prototype.linkGap = 50;
ForceExplorer.prototype.chargeFactor = 6;
ForceExplorer.prototype.chargeDistanceMax = 600;
ForceExplorer.prototype.collidePadding = 10;
ForceExplorer.prototype.collideStrength = 0.7;
ForceExplorer.prototype.labelPadding = 8;
ForceExplorer.prototype.chargeDistanceMin = 10;
ForceExplorer.prototype.focusCenterStrength = 0.1;
ForceExplorer.prototype.radialStrength = 0.15;
ForceExplorer.prototype.maxSpeed = 100;

/**
 * Scale below which the next level of neighbours is shown, the factor for
 * each further level, which is also the step of the zoom buttons and keys,
 * and the hysteresis that keeps the levels from flickering at a threshold.
 * One step of a mouse wheel adds about one level.
 */
ForceExplorer.prototype.levelScale = 0.9;
ForceExplorer.prototype.levelScaleFactor = 0.8;
ForceExplorer.prototype.levelHysteresis = 1.03;
ForceExplorer.prototype.maxDepth = 6;

/**
 * Space at the border and at the top of the container, where the title and
 * the buttons are, in screen units that the nodes of the levels must not
 * use, the maximum number of steps and the time in
 * milliseconds for predicting the layout of the levels (see predictBounds),
 * the tolerance for the differences between the predicted and the actual
 * layout and the hysteresis for removing levels that no longer fit.
 */
ForceExplorer.prototype.fitMargin = 24;
ForceExplorer.prototype.fitTop = 56;
ForceExplorer.prototype.maxPredictTicks = 300;
ForceExplorer.prototype.maxPredictTime = 60;
ForceExplorer.prototype.predictTolerance = 1.1;
ForceExplorer.prototype.fitHysteresis = 1.15;

/**
 * Animation parameters. Durations are in milliseconds, the bullet
 * spacing in model units and the speed in model units per second.
 */
ForceExplorer.prototype.appearDuration = 500;
ForceExplorer.prototype.leaveDuration = 350;
ForceExplorer.prototype.focusDuration = 700;
ForceExplorer.prototype.cameraDuration = 350;
ForceExplorer.prototype.bulletSpacing = 110;
ForceExplorer.prototype.bulletSpeed = 60;
ForceExplorer.prototype.bulletMargin = 10;
ForceExplorer.prototype.maxBullets = 20;
ForceExplorer.prototype.maxTotalBullets = 1000;

/**
 * Maximum number of connectors between two nodes and in total, and of the
 * labels at each end of a connector that are placed next to the shapes (see
 * initEndLabels).
 */
ForceExplorer.prototype.maxParallelLinks = 4;
ForceExplorer.prototype.maxLinks = 1000;
ForceExplorer.prototype.maxEndLabels = 10;
ForceExplorer.prototype.parallelSpacing = 40;
ForceExplorer.prototype.dragTolerance = 4;
ForceExplorer.prototype.dimOpacity = 0.25;
ForceExplorer.prototype.accentColor = '#1a73e8';

/**
 * Size and styles of the node for hidden neighbours and its connector.
 */
ForceExplorer.prototype.moreWidth = 44;
ForceExplorer.prototype.moreHeight = 26;
ForceExplorer.prototype.moreStyle = 'rounded=1;arcSize=50;html=0;' +
	'whiteSpace=nowrap;fillColor=#f5f5f5;strokeColor=#999999;' +
	'fontColor=#666666;fontSize=11;';
ForceExplorer.prototype.moreEdgeStyle = 'endArrow=none;dashed=1;' +
	'strokeColor=#999999;';

/**
 * Edge style keys that are removed from the cloned connectors, which
 * are straight lines between the cells.
 */
ForceExplorer.prototype.removedEdgeStyles = ['edgeStyle', 'elbow', 'curved',
	'entryX', 'entryY', 'entryDx', 'entryDy', 'entryPerimeter',
	'exitX', 'exitY', 'exitDx', 'exitDy', 'exitPerimeter',
	'jumpStyle', 'jettySize', 'orthogonalLoop', 'portConstraint',
	'sourcePortConstraint', 'targetPortConstraint'];

/**
 * Creates the overlay and the graph and shows the given cell.
 */
ForceExplorer.prototype.init = function(cell, modelCoordinates)
{
	var sourceGraph = this.sourceGraph;
	var container = document.createElement('div');
	container.style.position = 'absolute';
	container.style.left = '0px';
	container.style.top = '0px';
	container.style.width = '100%';
	container.style.height = '100%';
	container.style.overflow = 'hidden';
	container.style.touchAction = 'none';

	// Above the view of the source graph, eg. in presentation mode
	var zIndex = parseInt(mxUtils.getCurrentStyle(sourceGraph.container).zIndex);
	container.style.zIndex = (isNaN(zIndex)) ? 2 : zIndex + 2;
	container.style.userSelect = 'none';
	container.style.fontFamily = 'Helvetica, Arial, sans-serif';
	container.style.color = (Editor.isDarkMode()) ? '#e6e6e6' : '#333333';
	container.style.backgroundColor = (Graph.isSafeCssColor(sourceGraph.background)) ?
		sourceGraph.background : Editor.getDefaultPageBackgroundColor();
	container.setAttribute('role', 'dialog');
	container.setAttribute('aria-modal', 'true');
	container.setAttribute('aria-label', mxResources.get('explore'));
	document.body.appendChild(container);
	this.container = container;

	// Takes the keyboard focus and gives it back after closing
	this.previousFocus = document.activeElement;
	container.setAttribute('tabindex', '-1');
	container.style.outline = 'none';
	container.focus({preventScroll: true});

	var graph = new Graph(container);
	graph.view.modelCoordinates = modelCoordinates;
	graph.setStylesheet(sourceGraph.getStylesheet());
	graph.setEnabled(false);
	graph.setPanning(false);
	graph.setTooltips(false);
	this.graph = graph;

	graph.getFoldingImage = function()
	{
		return null;
	};

	graph.getCursorForCell = function(cell)
	{
		return (this.model.isVertex(cell)) ? 'pointer' : null;
	};

	// Clicks are handled in mouseUp, also for cells with links
	graph.click = function() {};

	// Places the labels at the ends of the connectors next to the shapes
	var explorer = this;
	var viewGetPoint = graph.view.getPoint;

	graph.view.getPoint = function(state, geometry)
	{
		var pt = (geometry != null && geometry.forceEnd != null) ?
			explorer.getEndLabelPoint(state, geometry) : null;

		return (pt != null) ? pt : viewGetPoint.apply(this, arguments);
	};

	// Resolves placeholders with the cells in the diagram, whose ancestors,
	// page and file provide values that the clones do not have
	var graphReplacePlaceholders = graph.replacePlaceholders;

	graph.replacePlaceholders = function(cell, str, vars, translate)
	{
		var source = (cell != null) ? cell.forceSource : null;

		return (source != null && sourceGraph.model.contains(source)) ?
			sourceGraph.replacePlaceholders(source, str, vars, translate) :
			graphReplacePlaceholders.apply(this, arguments);
	};

	// Tooltips of the source graph, also pending ones, would be shown above
	// the explorer and never hidden as the explorer gets the mouse events
	if (sourceGraph.tooltipHandler != null)
	{
		sourceGraph.tooltipHandler.hide();
	}

	this.installRenderHooks();
	this.installListeners();
	this.addSpotlight();
	this.addControls();

	// Puts the origin of the model in the middle of the container
	var s = this.getScaleForDepth(this.depth);
	graph.view.scaleAndTranslate(s, container.clientWidth / 2 / s,
		container.clientHeight / 2 / s);

	// Keeps the center in the middle if the size changes, eg. if the
	// container had no size yet
	this.size = new mxRectangle(0, 0, container.clientWidth, container.clientHeight);

	if (window.ResizeObserver != null)
	{
		this.resizeObserver = new ResizeObserver(mxUtils.bind(this, this.sizeChanged));
		this.resizeObserver.observe(container);
	}
	this.updateGrid();

	this.focusSource = cell;
	this.update();

	// Zooms out once before the nodes are shown so that they fit when they
	// settled, eg. for large shapes. The zoom never changes by itself after
	// that, and the levels only change when the user zooms.
	var fs = this.getFitScale(this.predictBounds(this.depth));

	if (fs < s)
	{
		graph.view.scaleAndTranslate(fs, container.clientWidth / 2 / fs,
			container.clientHeight / 2 / fs);
	}

	this.depthScale = graph.view.scale;
	this.animateFrame(true, cell);
	ForceExplorer.active = this;
	ForceExplorer.fireChange();
};

/**
 * Fires change when the state of the open explorer or of presentation mode
 * changes, and input on user input in them, eg. for following the view of a
 * presenter (see EditorUi.getSharedViewMode).
 */
ForceExplorer.events = new mxEventSource();

/**
 * The open explorer or null.
 */
ForceExplorer.active = null;

/**
 * Fires a change event (see events).
 */
ForceExplorer.fireChange = function()
{
	ForceExplorer.events.fireEvent(new mxEventObject('change'));
};

/**
 * Fires an input event (see events).
 */
ForceExplorer.fireInput = function()
{
	ForceExplorer.events.fireEvent(new mxEventObject('input'));
};

/**
 * Durations of the zoom of the frame when the explorer opens and closes in
 * milliseconds.
 */
ForceExplorer.prototype.openDuration = 300;
ForceExplorer.prototype.closeDuration = 220;

/**
 * Returns the center of the given cell in the diagram in client coordinates
 * within the window, or null if it has no state.
 */
ForceExplorer.prototype.getCellOrigin = function(cell)
{
	var g = this.sourceGraph;
	var state = (cell != null) ? g.view.getState(cell) : null;
	var result = null;

	if (state != null)
	{
		var rect = g.container.getBoundingClientRect();
		result = new mxPoint(Math.max(0, Math.min(window.innerWidth,
			rect.left + state.getCenterX() - g.container.scrollLeft)),
			Math.max(0, Math.min(window.innerHeight,
			rect.top + state.getCenterY() - g.container.scrollTop)));
	}

	return result;
};

/**
 * Shows or hides the frame of the explorer with a zoom from or into the
 * given cell of the diagram and invokes done at the end. Shows the frame at
 * once if instant is true, eg. for the initial view of a #create link.
 */
ForceExplorer.prototype.animateFrame = function(show, cell, done)
{
	ForceExplorer.animateFrame(this.container, show, this.getCellOrigin(cell),
		(show) ? this.openDuration : this.closeDuration, done,
		this.reducedMotion || (show && this.instant));
};

/**
 * Returns true if the user prefers reduced motion.
 */
ForceExplorer.isReducedMotion = function()
{
	return window.matchMedia != null && window.matchMedia(
		'(prefers-reduced-motion: reduce)').matches;
};

/**
 * Shows or hides the given element, which covers the window, with a fade
 * and a zoom from or into the given point in client coordinates (default is
 * the center) in the given duration and invokes done at the end. Shows or
 * hides the element at once if instant is true. Also used for presentation
 * mode.
 */
ForceExplorer.animateFrame = function(elt, show, origin, duration, done, instant)
{
	var hidden = function()
	{
		elt.style.opacity = '0';
		elt.style.transform = 'scale(0.85)';
	};

	var visible = function()
	{
		elt.style.opacity = '';
		elt.style.transform = '';
	};

	if (instant)
	{
		if (show)
		{
			visible();
		}
		else
		{
			hidden();
		}

		if (done != null)
		{
			done();
		}
	}
	else
	{
		elt.style.transformOrigin = (origin != null) ? origin.x + 'px ' +
			origin.y + 'px' : '50% 50%';
		elt.style.transition = 'none';

		if (show)
		{
			hidden();
		}
		else
		{
			visible();
		}

		// Applies the start values before the transition
		elt.getBoundingClientRect();
		elt.style.transition = 'opacity ' + duration + 'ms ease-out, transform ' +
			duration + 'ms ' + ((show) ? 'cubic-bezier(0.2, 0.8, 0.2, 1)' :
			'cubic-bezier(0.4, 0, 1, 1)');

		if (show)
		{
			visible();
		}
		else
		{
			hidden();
		}

		window.setTimeout(function()
		{
			elt.style.transition = '';

			if (show)
			{
				elt.style.transformOrigin = '';
			}

			if (done != null)
			{
				done();
			}
		}, duration);
	}
};

/**
 * Adds the light behind the focused cell to the background pane, which
 * is in screen units.
 */
ForceExplorer.prototype.addSpotlight = function()
{
	var id = 'geForceExploreSpot-' + Editor.guid();
	var g = document.createElementNS(mxConstants.NS_SVG, 'g');
	g.setAttribute('pointer-events', 'none');

	var defs = document.createElementNS(mxConstants.NS_SVG, 'defs');
	var gradient = document.createElementNS(mxConstants.NS_SVG, 'radialGradient');
	gradient.setAttribute('id', id);

	var stop = document.createElementNS(mxConstants.NS_SVG, 'stop');
	stop.setAttribute('offset', '0');
	stop.setAttribute('stop-color', this.accentColor);
	stop.setAttribute('stop-opacity', '0.22');
	gradient.appendChild(stop);

	stop = document.createElementNS(mxConstants.NS_SVG, 'stop');
	stop.setAttribute('offset', '1');
	stop.setAttribute('stop-color', this.accentColor);
	stop.setAttribute('stop-opacity', '0');
	gradient.appendChild(stop);
	defs.appendChild(gradient);
	g.appendChild(defs);

	this.spotlight = document.createElementNS(mxConstants.NS_SVG, 'circle');
	this.spotlight.setAttribute('fill', 'url(#' + id + ')');
	g.appendChild(this.spotlight);

	this.ring = document.createElementNS(mxConstants.NS_SVG, 'circle');
	this.ring.setAttribute('fill', 'none');
	this.ring.setAttribute('stroke', this.accentColor);
	this.ring.setAttribute('stroke-width', '2');
	g.appendChild(this.ring);

	this.graph.view.getBackgroundPane().appendChild(g);
	this.spotlightLayer = g;
};

/**
 * Creates a round button with the given text and handler.
 */
ForceExplorer.prototype.createButton = function(text, title, funct)
{
	return ForceExplorer.createButton(text, title, funct);
};

/**
 * Creates a round button with the given text or node, title and handler,
 * also used for the controls of presentation mode. The title is the name of
 * the button for assistive technologies. Keyboard focus shows an outline
 * (see handleButtonKeys).
 */
ForceExplorer.createButton = function(content, title, funct)
{
	var btn = document.createElement('button');
	btn.setAttribute('type', 'button');
	btn.style.width = '36px';
	btn.style.height = '36px';
	btn.style.margin = '0';
	btn.style.padding = '0';
	btn.style.display = 'flex';
	btn.style.alignItems = 'center';
	btn.style.justifyContent = 'center';
	btn.style.borderRadius = '10px';
	btn.style.fontFamily = 'inherit';
	btn.style.fontSize = '18px';
	btn.style.color = 'inherit';
	btn.style.cursor = 'pointer';
	btn.style.backgroundColor = 'rgba(127, 127, 127, 0.12)';
	btn.style.border = '1px solid rgba(127, 127, 127, 0.3)';
	btn.style.backdropFilter = 'blur(6px)';
	btn.style.outlineOffset = '2px';
	btn.setAttribute('title', title);
	btn.setAttribute('aria-label', title);

	if (typeof content === 'string')
	{
		var label = document.createElement('span');
		label.setAttribute('aria-hidden', 'true');
		mxUtils.write(label, content);
		btn.appendChild(label);
	}
	else if (content != null)
	{
		// Icons are not dragged and have no callout, the button gets the press
		content.setAttribute('aria-hidden', 'true');
		content.style.pointerEvents = 'none';
		btn.appendChild(content);
	}

	// Outline for keyboard focus only
	mxEvent.addListener(btn, 'focus', function()
	{
		btn.style.outline = (btn.matches == null || btn.matches(':focus-visible')) ?
			'2px solid #1a73e8' : 'none';
	});

	mxEvent.addListener(btn, 'blur', function()
	{
		btn.style.outline = '';
	});

	mxEvent.addListener(btn, 'click', function(evt)
	{
		ForceExplorer.fireInput();
		funct(evt);
		mxEvent.consume(evt);
	});

	// Keeps the gestures of the diagram behind the button from starting. The
	// default action is kept: a consumed touchstart suppresses the click in
	// iOS, where mxClient.IS_POINTER is false and touch events are used.
	mxEvent.addGestureListeners(btn, function(evt)
	{
		evt.stopPropagation();
	});

	// No double tap zoom for quick taps
	btn.style.touchAction = 'manipulation';

	return btn;
};

/**
 * Returns the visible and enabled buttons in the given container.
 */
ForceExplorer.getButtons = function(container)
{
	var buttons = container.getElementsByTagName('button');
	var result = [];

	for (var i = 0; i < buttons.length; i++)
	{
		if (!buttons[i].disabled && buttons[i].getClientRects().length > 0 &&
			mxUtils.getCurrentStyle(buttons[i]).visibility != 'hidden')
		{
			result.push(buttons[i]);
		}
	}

	return result;
};

/**
 * Handles the keys for the buttons in the given overlay: Tab and Shift+Tab
 * move the focus to the next or previous button and keep it in the overlay,
 * Enter and Space click the focused button. Returns true if the given
 * event was handled.
 */
ForceExplorer.handleButtonKeys = function(container, evt)
{
	var active = document.activeElement;

	if (evt.keyCode == 9 && !mxEvent.isControlDown(evt) &&
		!mxEvent.isMetaDown(evt) && !mxEvent.isAltDown(evt))
	{
		var buttons = ForceExplorer.getButtons(container);

		if (buttons.length > 0)
		{
			var n = buttons.length;
			var i = mxUtils.indexOf(buttons, active);
			var back = mxEvent.isShiftDown(evt);
			buttons[(i < 0) ? ((back) ? n - 1 : 0) :
				(i + ((back) ? n - 1 : 1)) % n].focus();
		}

		mxEvent.consume(evt);

		return true;
	}
	else if ((evt.keyCode == 13 || evt.keyCode == 32) && active != null &&
		active.nodeName == 'BUTTON' && container.contains(active))
	{
		active.click();
		mxEvent.consume(evt);

		return true;
	}

	return false;
};

/**
 * Moves the focus to the given element if it is still in the document, eg.
 * back to the element that had the focus before an overlay was shown.
 */
ForceExplorer.restoreFocus = function(elt)
{
	if (elt != null && elt != document.body && elt.focus != null &&
		document.documentElement.contains(elt))
	{
		try
		{
			elt.focus({preventScroll: true});
		}
		catch (e)
		{
			// ignore
		}
	}
};

/**
 * Adds the info panel, the zoom buttons, the close button and the hint.
 */
ForceExplorer.prototype.addControls = function()
{
	// Leaves space for the select and close buttons on the right
	var panel = document.createElement('div');
	panel.style.position = 'absolute';
	panel.style.left = '14px';
	panel.style.right = '104px';
	panel.style.top = '12px';
	panel.style.pointerEvents = 'none';
	panel.style.display = 'flex';
	panel.style.alignItems = 'center';
	panel.style.gap = '10px';
	panel.style.zIndex = 1;

	this.backButton = this.createButton('‹', mxResources.get('back'),
		mxUtils.bind(this, this.back));
	this.backButton.style.visibility = 'hidden';
	this.backButton.style.pointerEvents = 'auto';
	this.backButton.style.flexShrink = '0';
	panel.appendChild(this.backButton);

	var info = document.createElement('div');
	info.style.pointerEvents = 'none';
	info.style.minWidth = '0';
	this.titleElt = document.createElement('div');
	this.titleElt.style.fontSize = '16px';
	this.titleElt.style.fontWeight = 'bold';
	info.appendChild(this.titleElt);
	this.levelElt = document.createElement('div');
	this.levelElt.style.fontSize = '12px';
	this.levelElt.style.opacity = '0.7';
	info.appendChild(this.levelElt);
	panel.appendChild(info);
	this.container.appendChild(panel);

	var tools = document.createElement('div');
	tools.style.position = 'absolute';
	tools.style.right = '14px';
	tools.style.bottom = '14px';
	tools.style.display = 'flex';
	tools.style.flexDirection = 'column';
	tools.style.gap = '6px';
	tools.style.zIndex = 1;

	tools.appendChild(this.createButton('+', mxResources.get('zoomIn'),
		mxUtils.bind(this, function()
	{
		this.zoomBy(1 / this.levelScaleFactor);
	})));
	tools.appendChild(this.createButton('−', mxResources.get('zoomOut'),
		mxUtils.bind(this, function()
	{
		this.zoomBy(this.levelScaleFactor);
	})));
	tools.appendChild(this.createButton('⌂', mxResources.get('reset'),
		mxUtils.bind(this, function()
	{
		this.moveCamera(Math.min(1, this.getFitScale(this.getBounds(1))));
	})));
	this.container.appendChild(tools);

	// Selects the focused cell in the diagram and closes, next to close
	var actions = document.createElement('div');
	actions.style.position = 'absolute';
	actions.style.right = '14px';
	actions.style.top = '12px';
	actions.style.display = 'flex';
	actions.style.gap = '6px';
	actions.style.zIndex = 1;

	var select = this.createButton('', mxResources.get('selectCellsInDiagram'),
		mxUtils.bind(this, function()
	{
		this.selectInDiagram(this.focusSource);
	}));
	select.appendChild(this.createTargetIcon());
	actions.appendChild(select);

	// Read-only views must be able to show the cell (see Graph.focusCell)
	if (!this.sourceGraph.isEnabled() && this.sourceGraph.focusCell == null)
	{
		select.style.display = 'none';
	}

	var close = this.createButton('\u2715', mxResources.get('close'),
		mxUtils.bind(this, this.destroy));
	close.style.fontSize = '14px';
	actions.appendChild(close);
	this.container.appendChild(actions);
};

/**
 * Returns a crosshair icon in the color of the text.
 */
ForceExplorer.prototype.createTargetIcon = function()
{
	var svg = document.createElementNS(mxConstants.NS_SVG, 'svg');
	svg.setAttribute('width', '18');
	svg.setAttribute('height', '18');
	svg.setAttribute('viewBox', '0 0 18 18');

	var circle = document.createElementNS(mxConstants.NS_SVG, 'circle');
	circle.setAttribute('cx', '9');
	circle.setAttribute('cy', '9');
	circle.setAttribute('r', '5');
	svg.appendChild(circle);

	var path = document.createElementNS(mxConstants.NS_SVG, 'path');
	path.setAttribute('d', 'M 9 1 V 5 M 9 13 V 17 M 1 9 H 5 M 13 9 H 17');
	svg.appendChild(path);

	for (var i = 0; i < svg.childNodes.length; i++)
	{
		svg.childNodes[i].setAttribute('fill', 'none');
		svg.childNodes[i].setAttribute('stroke', 'currentColor');
		svg.childNodes[i].setAttribute('stroke-width', '1.5');
	}

	return svg;
};

/**
 * Updates the title, the levels and the back button.
 */
ForceExplorer.prototype.updateInfo = function()
{
	var count = 0;

	for (var i = 0; i < this.nodes.length; i++)
	{
		if (this.nodes[i].source != null && this.nodes[i].leaving == null)
		{
			count++;
		}
	}

	this.titleElt.textContent = this.getPlainLabel(this.focusSource) ||
		mxResources.get('explore');
	this.levelElt.textContent = mxResources.get('exploreLevels',
		[this.depth, count], 'Levels: {1} · Shapes: {2}');
	this.backButton.style.visibility = (this.history.length > 0) ?
		'visible' : 'hidden';
};

/**
 * Returns the label of the given cell of the source graph as plain text.
 */
ForceExplorer.prototype.getPlainLabel = function(cell)
{
	var graph = this.sourceGraph;
	var label = graph.getLabel(cell);

	if (label != null && graph.isHtmlLabel(cell))
	{
		// Parses into an inert document, which runs no scripts and loads nothing
		var doc = new DOMParser().parseFromString(String(label), 'text/html');
		var breaks = doc.body.querySelectorAll('br, div, p, li, tr');

		// Separates the words of lines
		for (var i = 0; i < breaks.length; i++)
		{
			breaks[i].parentNode.insertBefore(doc.createTextNode(' '),
				breaks[i].nextSibling);
		}

		label = doc.body.textContent;
	}

	label = (label != null) ? mxUtils.trim(String(label).replace(/\s+/g, ' ')) : '';

	return (label.length > 60) ? label.substring(0, 59) + '…' : label;
};

/**
 * Moves the view by half of the change of the size of the container.
 */
ForceExplorer.prototype.sizeChanged = function()
{
	if (this.graph != null)
	{
		var w = this.container.clientWidth;
		var h = this.container.clientHeight;
		var view = this.graph.view;
		var dx = (w - this.size.width) / 2 / view.scale;
		var dy = (h - this.size.height) / 2 / view.scale;
		this.size = new mxRectangle(0, 0, w, h);

		if (dx != 0 || dy != 0)
		{
			view.setTranslate(view.translate.x + dx, view.translate.y + dy);
		}
	}
};

/**
 * Updates the dot grid of the background for the scale and translate.
 */
ForceExplorer.prototype.updateGrid = function()
{
	var view = this.graph.view;
	var size = 24 * view.scale;

	while (size < 14)
	{
		size *= 2;
	}

	while (size > 48)
	{
		size /= 2;
	}

	var dot = (Editor.isDarkMode()) ? 'rgba(255, 255, 255, 0.12)' :
		'rgba(0, 0, 0, 0.12)';
	this.container.style.backgroundImage = 'radial-gradient(circle, ' +
		dot + ' 1px, transparent 1.5px)';
	this.container.style.backgroundSize = size + 'px ' + size + 'px';
	this.container.style.backgroundPosition =
		mxUtils.mod(view.translate.x * view.scale, size) + 'px ' +
		mxUtils.mod(view.translate.y * view.scale, size) + 'px';
};

/**
 * Records the position at which the shapes and labels of vertices were
 * painted, which is the origin of their translate. A repaint resets the
 * transform of the node (see mxShape.createSvgCanvas).
 */
ForceExplorer.prototype.installRenderHooks = function()
{
	var explorer = this;
	var cr = this.graph.cellRenderer;

	var crInitializeShape = cr.initializeShape;
	cr.initializeShape = function(state)
	{
		crInitializeShape.apply(this, arguments);
		explorer.hookShape(state, state.shape);
	};

	var crInitializeLabel = cr.initializeLabel;
	cr.initializeLabel = function(state, shape)
	{
		crInitializeLabel.apply(this, arguments);
		explorer.hookShape(state, shape);
	};
};

/**
 * Wraps the redraw of the given shape of the given vertex state.
 */
ForceExplorer.prototype.hookShape = function(state, shape)
{
	if (shape != null && this.graph.model.isVertex(state.cell))
	{
		var shapeRedraw = shape.redraw;
		var explorer = this;

		shape.redraw = function()
		{
			shapeRedraw.apply(this, arguments);
			var view = state.view;
			this.forcePainted = new mxPoint(state.x / view.scale - view.translate.x,
				state.y / view.scale - view.translate.y);
			this.forceFilter = null;
			explorer.dirty = true;
		};
	}
};

/**
 * Installs the mouse, wheel, keyboard and view listeners.
 */
ForceExplorer.prototype.installListeners = function()
{
	var graph = this.graph;

	this.mouseListener =
	{
		mouseDown: mxUtils.bind(this, function(sender, me)
		{
			this.mouseDown(me);
		}),
		mouseMove: mxUtils.bind(this, function(sender, me)
		{
			this.mouseMove(me);
		}),
		mouseUp: mxUtils.bind(this, function(sender, me)
		{
			this.mouseUp(me);
		})
	};

	graph.addMouseListener(this.mouseListener);

	// A double click or tap is two clicks, the select button shows the
	// focused cell in the diagram. Without the detection of double taps
	// the second tap is a click. The cell renderer consumes double clicks
	// on cells and calls dblClick.
	graph.doubleTapEnabled = false;
	graph.dblClick = function() {};

	this.wheelHandler = mxUtils.bind(this, function(evt)
	{
		evt.preventDefault();
		ForceExplorer.fireInput();

		// No highlights while zooming over the cells
		this.wheelTime = performance.now();
		this.setHover(null);

		if (!evt.ctrlKey && Math.abs(evt.deltaX) > Math.abs(evt.deltaY))
		{
			var s = graph.view.scale;
			graph.view.setTranslate(graph.view.translate.x - evt.deltaX / s,
				graph.view.translate.y);
		}
		else
		{
			var rect = this.container.getBoundingClientRect();

			// Pinch gestures send wheel events with ctrlKey and small deltas
			this.zoomAt(Math.exp(-evt.deltaY * ((evt.ctrlKey) ? 0.01 : 0.002)),
				evt.clientX - rect.left, evt.clientY - rect.top);
		}
	});

	this.container.addEventListener('wheel', this.wheelHandler, {passive: false});

	// Pinch gestures zoom around the center between the fingers and move the
	// view with it, also in Android, which has no gesture events. The gesture
	// events of Safari would zoom around the top left corner.
	graph.panningHandler.setPinchEnabled(false);

	var touchOptions = {passive: true, capture: true};

	this.touchHandler = mxUtils.bind(this, function(evt)
	{
		var touches = evt.touches;

		// A single new finger starts a new gesture
		if (evt.type == 'touchstart' && touches != null && touches.length == 1)
		{
			this.pinch = null;
		}

		if (touches != null && touches.length > 1)
		{
			var rect = this.container.getBoundingClientRect();
			var x = (touches[0].clientX + touches[1].clientX) / 2 - rect.left;
			var y = (touches[0].clientY + touches[1].clientY) / 2 - rect.top;
			var d = Math.max(1, Math.sqrt(Math.pow(touches[0].clientX - touches[1].clientX, 2) +
				Math.pow(touches[0].clientY - touches[1].clientY, 2)));

			// Ends what the first finger started, eg. dragging a node
			if (this.pinch == null)
			{
				this.cancelGesture();
			}
			else if (this.pinch.d != null && evt.type == 'touchmove')
			{
				// Other events change the fingers of the center and distance
				this.zoomAt(d / this.pinch.d, this.pinch.x, this.pinch.y, x, y);
			}

			this.pinch = {x: x, y: y, d: d};
			this.wheelTime = performance.now();
			ForceExplorer.fireInput();
		}
		else if (this.pinch != null)
		{
			// The remaining finger neither pans nor clicks, and a second finger
			// starts from its own position
			this.pinch = (touches != null && touches.length > 0) ? {} : null;
		}

		if (touches == null || touches.length == 0)
		{
			this.removeTouchTargets();
		}
	});

	// Touch events go to the element where the touch started, which is
	// replaced if its cell is painted again, so the listeners are also added
	// to that element. An event that is handled twice changes nothing.
	this.touchTargets = [];

	this.touchStartHandler = mxUtils.bind(this, function(evt)
	{
		var target = evt.target;

		if (target != null && target != this.container && target.addEventListener != null &&
			mxUtils.indexOf(this.touchTargets, target) < 0)
		{
			this.touchTargets.push(target);
			target.addEventListener('touchmove', this.touchHandler, touchOptions);
			target.addEventListener('touchend', this.touchHandler, touchOptions);
			target.addEventListener('touchcancel', this.touchHandler, touchOptions);
		}

		this.touchHandler(evt);
	});

	this.container.addEventListener('touchstart', this.touchStartHandler, touchOptions);

	// Releases a dragged node if the system cancels the gesture
	graph.addListener(mxEvent.CANCEL_MOUSE_GESTURE, mxUtils.bind(this, function()
	{
		this.cancelGesture();
	}));
	this.container.addEventListener('touchmove', this.touchHandler, touchOptions);
	this.container.addEventListener('touchend', this.touchHandler, touchOptions);
	this.container.addEventListener('touchcancel', this.touchHandler, touchOptions);

	// Handles keys before the editor, which must not delete or change
	// cells of the diagram behind the overlay. Shortcuts with the control
	// or meta key are passed on, eg. for saving.
	this.keyHandler = mxUtils.bind(this, function(evt)
	{
		if (!mxEvent.isControlDown(evt) && !mxEvent.isMetaDown(evt))
		{
			ForceExplorer.fireInput();

			if (ForceExplorer.handleButtonKeys(this.container, evt))
			{
				// handled
			}
			else if (evt.keyCode == 27)
			{
				this.destroy();
			}
			else if (evt.keyCode == 8 || evt.keyCode == 37)
			{
				this.back();
			}
			else if (evt.key == '+' || evt.key == '=')
			{
				this.zoomBy(1 / this.levelScaleFactor);
			}
			else if (evt.key == '-')
			{
				this.zoomBy(this.levelScaleFactor);
			}

			mxEvent.consume(evt);
		}
	});

	window.addEventListener('keydown', this.keyHandler, true);

	this.visibilityHandler = mxUtils.bind(this, function()
	{
		if (!document.hidden)
		{
			this.schedule();
		}
	});

	mxEvent.addListener(document, 'visibilitychange', this.visibilityHandler);

	// Camera changes may rewrite the transforms (see updateSvgScreenOffset)
	// or repaint all cells if the view is not in model coordinates. The
	// scale defines the number of levels.
	var cameraHandler = mxUtils.bind(this, function()
	{
		this.updateGrid();
		this.dirty = true;
		this.schedule();
		ForceExplorer.fireChange();
	});

	graph.view.addListener(mxEvent.SCALE, cameraHandler);
	graph.view.addListener(mxEvent.TRANSLATE, cameraHandler);
	graph.view.addListener(mxEvent.SCALE_AND_TRANSLATE, cameraHandler);
};

/**
 * Returns the point of the given event in model units.
 */
ForceExplorer.prototype.getModelPoint = function(evt)
{
	var view = this.graph.view;
	var pt = mxUtils.convertPoint(this.container,
		mxEvent.getClientX(evt), mxEvent.getClientY(evt));

	return new mxPoint(pt.x / view.scale - view.translate.x,
		pt.y / view.scale - view.translate.y);
};

/**
 * Returns the node of the given cell or its ancestors.
 */
ForceExplorer.prototype.getNodeForCell = function(cell)
{
	var model = this.graph.model;

	while (cell != null && cell.forceNode == null)
	{
		cell = model.getParent(cell);
	}

	return (cell != null && cell.forceNode.leaving == null) ? cell.forceNode : null;
};

/**
 * Starts dragging a node or panning.
 */
ForceExplorer.prototype.mouseDown = function(me)
{
	var evt = me.getEvent();

	// A primary pointer starts a new gesture (pointer events come before
	// the touch events)
	if (evt.isPrimary)
	{
		this.pinch = null;
	}

	if (this.pinch != null || mxEvent.isMultiTouchEvent(evt))
	{
		me.consume();

		return;
	}

	var node = this.getNodeForCell(me.getCell());
	var pt = this.getModelPoint(evt);
	var tr = this.graph.view.translate;

	ForceExplorer.fireInput();
	this.gesture = {node: node, x0: mxEvent.getClientX(evt),
		y0: mxEvent.getClientY(evt), tx: tr.x, ty: tr.y,
		dx: (node != null) ? node.x - pt.x : 0,
		dy: (node != null) ? node.y - pt.y : 0,
		moved: false};
	this.cameraTween = null;
	me.consume();
};

/**
 * Drags the node, pans or highlights the node under the mouse.
 */
ForceExplorer.prototype.mouseMove = function(me)
{
	var g = this.gesture;

	if (this.pinch != null)
	{
		me.consume();
	}
	else if (g != null)
	{
		var evt = me.getEvent();
		var dx = mxEvent.getClientX(evt) - g.x0;
		var dy = mxEvent.getClientY(evt) - g.y0;

		if (!g.moved && Math.abs(dx) + Math.abs(dy) > this.dragTolerance)
		{
			g.moved = true;
			this.container.style.cursor = 'grabbing';
		}

		if (g.moved)
		{
			if (g.node != null && g.node.leaving == null)
			{
				var pt = this.getModelPoint(evt);
				g.node.focusTween = null;
				g.node.fx = pt.x + g.dx;
				g.node.fy = pt.y + g.dy;
				this.alphaTarget = 0.3;
				this.alpha = Math.max(this.alpha, 0.3);
				this.schedule();
			}
			else if (g.node == null)
			{
				var s = this.graph.view.scale;
				this.graph.view.setTranslate(g.tx + dx / s, g.ty + dy / s);
			}
		}

		me.consume();
	}
	else if (performance.now() - this.wheelTime > 300)
	{
		this.setHover(this.getNodeForCell(me.getCell()));
	}
};

/**
 * Releases the node or focuses it if it was clicked.
 */
ForceExplorer.prototype.mouseUp = function(me)
{
	var g = this.gesture;
	this.gesture = null;
	this.container.style.cursor = '';

	if (g != null && g.node != null)
	{
		if (g.moved)
		{
			this.releaseNode(g.node);
		}
		else if (g.node.leaving == null)
		{
			this.click(g.node);
		}

		me.consume();
	}
};

/**
 * Removes the touch listeners from the elements where touches started.
 */
ForceExplorer.prototype.removeTouchTargets = function()
{
	for (var i = 0; i < this.touchTargets.length; i++)
	{
		this.touchTargets[i].removeEventListener('touchmove', this.touchHandler, true);
		this.touchTargets[i].removeEventListener('touchend', this.touchHandler, true);
		this.touchTargets[i].removeEventListener('touchcancel', this.touchHandler, true);
	}

	this.touchTargets = [];
};

/**
 * Releases the given dragged node.
 */
ForceExplorer.prototype.releaseNode = function(node)
{
	node.fx = null;
	node.fy = null;
	this.alphaTarget = 0;

	// The focused node springs back to the center
	if (node == this.focus)
	{
		this.startFocusTween(node);
	}

	this.schedule();
};

/**
 * Ends the current drag or pan without a click, eg. if a pinch starts.
 */
ForceExplorer.prototype.cancelGesture = function()
{
	var g = this.gesture;
	this.gesture = null;
	this.container.style.cursor = '';
	this.setHover(null);

	if (g != null && g.node != null && g.moved)
	{
		this.releaseNode(g.node);
	}
};

/**
 * Highlights the given node and its neighbours.
 */
ForceExplorer.prototype.setHover = function(node)
{
	if (node != this.hover)
	{
		this.hover = node;
		this.hoverNeighbors = null;
		ForceExplorer.fireChange();

		// Highlights the neighbours of all nodes but the focused node
		if (node != null && node != this.focus)
		{
			this.hoverNeighbors = Object.create(null);
			this.hoverNeighbors[node.id] = true;

			for (var i = 0; i < this.links.length; i++)
			{
				var link = this.links[i];

				if (link.source == node || link.target == node)
				{
					this.hoverNeighbors[link.source.id] = true;
					this.hoverNeighbors[link.target.id] = true;
				}
			}
		}

		this.schedule();
	}
};

/**
 * Handles a click on the given node.
 */
ForceExplorer.prototype.click = function(node)
{
	if (node.more)
	{
		var owner = node.parent.source;
		this.caps[owner.id] = (this.caps[owner.id] || this.maxChildren) +
			this.maxChildren;
		this.update();
	}
	else if (node != this.focus)
	{
		this.history.push(this.focusSource);
		this.setFocus(node.source);
	}
};

/**
 * Focuses the previous cell.
 */
ForceExplorer.prototype.back = function()
{
	if (this.history.length > 0)
	{
		this.setFocus(this.history.pop());
	}
};

/**
 * Maximum number of positions and caps in the shared state.
 */
ForceExplorer.prototype.maxSharedEntries = 500;

/**
 * Returns the state of this explorer for the collaborators that follow this
 * client: the focused cell, the levels, the camera (scale and center in model
 * units), the highlighted cell, the caps of the shown neighbours and, once
 * the nodes settled, their positions. Cells are identified by the IDs of the
 * cells in the diagram.
 */
ForceExplorer.prototype.getSharedState = function()
{
	var view = this.graph.view;
	var s = view.scale;
	var state = {focus: this.focusSource.id, depth: this.depth,
		scale: Math.round(s * 1000) / 1000,
		x: Math.round(this.container.clientWidth / 2 / s - view.translate.x),
		y: Math.round(this.container.clientHeight / 2 / s - view.translate.y),
		hover: (this.hover != null && this.hover.source != null) ?
			this.hover.source.id : null, caps: [], nodes: null};

	for (var id in this.caps)
	{
		state.caps.push([id, this.caps[id]]);
	}

	if (this.settled)
	{
		state.nodes = [];

		for (var i = 0; i < this.nodes.length; i++)
		{
			var n = this.nodes[i];

			if (n.source != null && n.leaving == null)
			{
				state.nodes.push([n.source.id, Math.round(n.x), Math.round(n.y)]);
			}
		}
	}

	return state;
};

/**
 * Applies the given state of the explorer of a presenter (see
 * getSharedState). The state comes from a collaborator, so the values are
 * checked and cells that do not exist or cannot be explored are ignored.
 */
ForceExplorer.prototype.applySharedState = function(state)
{
	if (this.graph != null && state != null && typeof state === 'object')
	{
		var model = this.sourceGraph.model;
		var getCell = function(id)
		{
			var cell = (id != null) ? model.getCell(String(id)) : null;

			return (cell instanceof mxCell) ? cell : null;
		};

		// Caps of the shown neighbours
		var caps = Object.create(null);
		var changed = false;

		if (Array.isArray(state.caps))
		{
			for (var i = 0; i < state.caps.length && i < this.maxSharedEntries; i++)
			{
				var entry = state.caps[i];

				if (Array.isArray(entry) && entry.length == 2)
				{
					caps[String(entry[0])] = ForceExplorer.getIntOption(entry[1], 1, 10000, this.maxChildren);
				}
			}
		}

		for (var id in caps)
		{
			changed = changed || this.caps[id] != caps[id];
		}

		for (var id in this.caps)
		{
			changed = changed || caps[id] == null;
		}

		this.caps = caps;

		// Levels, which also follow the scale below
		var depth = ForceExplorer.getIntOption(state.depth, 1, this.maxDepth, this.depth);

		if (depth != this.depth)
		{
			this.depth = depth;
			changed = true;
		}

		// Focused cell
		var focus = getCell(state.focus);

		if (focus != null && focus != this.focusSource &&
			ForceExplorer.getConnectionCount(this.sourceGraph, focus) > 0)
		{
			this.history.push(this.focusSource);
			this.setFocus(focus);
		}
		else if (changed)
		{
			this.update();
		}

		// Camera
		var s = parseFloat(state.scale);
		var x = parseFloat(state.x);
		var y = parseFloat(state.y);

		if (isFinite(s) && Math.abs(x) < 1e6 && Math.abs(y) < 1e6)
		{
			this.startCameraTween(Math.max(0.05, Math.min(8, s)), new mxPoint(x, y),
				new mxPoint(this.container.clientWidth / 2, this.container.clientHeight / 2));
			this.cameraTween.follow = true;
		}

		// Highlighted cell
		var hover = getCell(state.hover);
		this.setHover((hover != null) ? this.nodeBySource[hover.id] || null : null);

		// Positions of the settled nodes
		if (Array.isArray(state.nodes))
		{
			var t0 = performance.now();

			for (var i = 0; i < state.nodes.length && i < this.maxSharedEntries; i++)
			{
				var entry = state.nodes[i];
				var node = (Array.isArray(entry) && entry.length == 3) ?
					this.nodeBySource[String(entry[0])] : null;
				var nx = (node != null) ? parseFloat(entry[1]) : NaN;
				var ny = (node != null) ? parseFloat(entry[2]) : NaN;

				if (node != null && node.leaving == null && node != this.focus &&
					isFinite(nx) && isFinite(ny) && Math.abs(nx) < 1e6 && Math.abs(ny) < 1e6 &&
					(Math.abs(node.x - nx) > 1 || Math.abs(node.y - ny) > 1))
				{
					node.syncTween = {t0: t0, x0: node.x, y0: node.y, x1: nx, y1: ny};
				}
			}

			this.schedule();
		}
	}
};

/**
 * Moves the given cell of the source graph to the center and shows its
 * neighbourhood.
 */
ForceExplorer.prototype.setFocus = function(cell)
{
	this.focusSource = cell;
	this.update();
	this.startFocusTween(this.focus);
	this.moveCamera(this.graph.view.scale);
	ForceExplorer.fireChange();
};

/**
 * Moves the given node to the origin.
 */
ForceExplorer.prototype.startFocusTween = function(node)
{
	node.focusTween = {t0: performance.now(), x0: node.x, y0: node.y};
	this.reheat(0.5);
};

/**
 * Closes the explorer and selects the given cell in the diagram.
 */
ForceExplorer.prototype.selectInDiagram = function(cell)
{
	var graph = this.sourceGraph;

	// Scrolls before closing so that the frame zooms into the cell. Read-only
	// views, eg. presentation mode, move the cell to the center instead.
	if (graph.model.contains(cell))
	{
		if (graph.isEnabled())
		{
			graph.setSelectionCell(cell);
			graph.scrollCellToVisible(cell);
		}
		else if (graph.focusCell != null)
		{
			graph.focusCell(cell);
		}

		this.focusSource = cell;
	}

	this.destroy();
};

/**
 * Zooms by the given factor around the center of the container.
 */
ForceExplorer.prototype.zoomBy = function(factor)
{
	var view = this.graph.view;
	var w = this.container.clientWidth / 2;
	var h = this.container.clientHeight / 2;
	var s = (this.cameraTween != null) ? this.cameraTween.s1 : view.scale;
	var s1 = Math.min(8, Math.max(0.05, s * factor));

	this.startCameraTween(s1, new mxPoint(w / view.scale - view.translate.x,
		h / view.scale - view.translate.y), new mxPoint(w, h));
};

/**
 * Zooms by the given factor around the given point in the container and
 * moves that point to x1, y1 if given.
 */
ForceExplorer.prototype.zoomAt = function(factor, x, y, x1, y1)
{
	var view = this.graph.view;
	var s = view.scale;
	var s1 = Math.min(8, Math.max(0.05, s * factor));
	var px = x / s - view.translate.x;
	var py = y / s - view.translate.y;
	x1 = (x1 != null) ? x1 : x;
	y1 = (y1 != null) ? y1 : y;
	this.cameraTween = null;
	view.scaleAndTranslate(s1, x1 / s1 - px, y1 / s1 - py);
};

/**
 * Moves the origin to the center of the container with the given scale.
 */
ForceExplorer.prototype.moveCamera = function(scale)
{
	this.startCameraTween(scale, new mxPoint(0, 0), new mxPoint(
		this.container.clientWidth / 2, this.container.clientHeight / 2));
};

/**
 * Animates the scale to the given value and moves the given point in
 * model units to the given point in the container.
 */
ForceExplorer.prototype.startCameraTween = function(s1, pt, target)
{
	var view = this.graph.view;
	this.cameraTween = {t0: performance.now(), s0: view.scale, s1: s1, pt: pt,
		x0: (pt.x + view.translate.x) * view.scale,
		y0: (pt.y + view.translate.y) * view.scale,
		x1: target.x, y1: target.y};
	this.schedule();
};

/**
 * Returns the number of levels for the given scale.
 */
ForceExplorer.prototype.getDepthForScale = function(scale)
{
	var depth = 1;
	var t = this.levelScale;

	while (scale < t && depth < this.maxDepth)
	{
		depth++;
		t *= this.levelScaleFactor;
	}

	return depth;
};

/**
 * Returns a scale that shows the given number of levels.
 */
ForceExplorer.prototype.getScaleForDepth = function(depth)
{
	var s = 1;

	if (depth > 1)
	{
		s = this.levelScale * Math.pow(this.levelScaleFactor, depth - 2) * 0.9;
	}

	return s;
};

/**
 * Updates the number of levels when the scale of the view changes (see
 * levelHysteresis). Zooming out adds the next levels only if their nodes are
 * inside of the container once they settled (see predictBounds), and zooming
 * in removes the outer levels whose nodes are no longer inside (see
 * fitHysteresis).
 */
ForceExplorer.prototype.updateDepth = function()
{
	var s = this.graph.view.scale;

	// The levels of a followed explorer are set with its camera
	if (s == this.depthScale || (this.cameraTween != null && this.cameraTween.follow))
	{
		return;
	}

	var zoomIn = s > this.depthScale;
	var depth = this.getDepthForScale(s);
	this.depthScale = s;

	if (depth > this.depth)
	{
		var max = (zoomIn) ? this.depth : Math.max(this.depth,
			this.getDepthForScale(s * this.levelHysteresis));
		depth = this.depth;

		while (depth < max && this.isInside(this.getPredictedBounds(depth + 1),
			s * this.predictTolerance))
		{
			depth++;
		}
	}
	else if (depth < this.depth)
	{
		depth = Math.min(this.depth, this.getDepthForScale(s / this.levelHysteresis));
	}

	while (zoomIn && depth > 1 && !this.isInside(this.getBounds(depth),
		s / this.fitHysteresis))
	{
		depth--;
	}

	if (depth != this.depth)
	{
		this.depth = depth;
		this.update();
	}
};

/**
 * Returns true if the given bounds of nodes relative to the origin in model
 * units are inside of the container with the given scale and the origin, where
 * the focused node is pinned, in the middle. The pan is ignored so that
 * panning or zooming around the mouse does not change the levels.
 */
ForceExplorer.prototype.isInside = function(bounds, scale)
{
	var x = this.container.clientWidth / 2;
	var y = this.container.clientHeight / 2;
	var m = this.fitMargin;

	return bounds == null || (x + bounds.x * scale >= m &&
		y + bounds.y * scale >= this.fitTop &&
		x + (bounds.x + bounds.width) * scale <= this.container.clientWidth - m &&
		y + (bounds.y + bounds.height) * scale <= this.container.clientHeight - m);
};

/**
 * Returns the largest scale that shows the given bounds of nodes relative to
 * the origin in model units inside of the container with the origin in the
 * middle.
 */
ForceExplorer.prototype.getFitScale = function(bounds)
{
	var w = this.container.clientWidth / 2 - this.fitMargin;
	var h = this.container.clientHeight / 2 - Math.max(this.fitMargin, this.fitTop);
	var s = 8;

	if (bounds != null && w > 0 && h > 0)
	{
		var bw = Math.max(-bounds.x, bounds.x + bounds.width);
		var bh = Math.max(-bounds.y, bounds.y + bounds.height);
		s = Math.min(s, (bw > 0) ? w / bw : s, (bh > 0) ? h / bh : s);
	}

	return Math.max(0.05, s);
};

/**
 * Returns the bounds of the shown nodes of the given number of levels
 * relative to the origin in model units, or null if there are none.
 */
ForceExplorer.prototype.getBounds = function(depth)
{
	var result = null;

	for (var i = 0; i < this.nodes.length; i++)
	{
		var n = this.nodes[i];

		if (n.leaving == null && n.level <= depth)
		{
			var e = n.extent;
			var rect = new mxRectangle(n.x + e.x, n.y + e.y, e.width, e.height);

			if (result == null)
			{
				result = rect;
			}
			else
			{
				result.add(rect);
			}
		}
	}

	return result;
};

/**
 * Returns the predicted bounds for the given number of levels, which are
 * kept until the shown nodes change (see predictBounds).
 */
ForceExplorer.prototype.getPredictedBounds = function(depth)
{
	if (this.predicted == null)
	{
		this.predicted = [];
	}

	if (this.predicted[depth] === undefined)
	{
		this.predicted[depth] = this.predictBounds(depth);
	}

	return this.predicted[depth];
};

/**
 * Returns the bounds of the nodes of the given number of levels relative to
 * the origin in model units once they settled, or null if there are none.
 * The layout is simulated with copies of the shown nodes and estimates of
 * the new nodes, whose sizes are those of the cells and labels in the
 * diagram, before the new nodes are shown.
 */
ForceExplorer.prototype.predictBounds = function(depth)
{
	var model = this.sourceGraph.model;
	var current = this.depth;
	this.depth = depth;
	var visible = this.getVisibleCells();
	this.depth = current;

	var nodes = [];
	var links = [];
	var byId = Object.create(null);
	var counts = Object.create(null);
	var spawned = Object.create(null);

	var add = function(node, level, parent)
	{
		node.id = nodes.length;
		node.vx = 0;
		node.vy = 0;
		node.links = 0;
		node.level = level;
		node.parentNode = parent;
		nodes.push(node);

		return node;
	};

	for (var i = 0; i < visible.entries.length; i++)
	{
		var entry = visible.entries[i];

		if (entry.parent != null && this.nodeBySource[entry.cell.id] == null)
		{
			counts[entry.parent.id] = (counts[entry.parent.id] || 0) + 1;
		}
	}

	for (var i = 0; i < visible.entries.length; i++)
	{
		var entry = visible.entries[i];
		var n = this.nodeBySource[entry.cell.id];
		var parent = (entry.parent != null) ? byId[entry.parent.id] : null;
		var node = null;

		if (n != null)
		{
			node = {x: n.x, y: n.y, fx: n.fx, fy: n.fy, r: n.r, extent: n.extent, cell: n.cell};
		}
		else
		{
			// New nodes start at their parents like in update
			var geo = model.getGeometry(entry.cell);
			var e = this.getSourceExtent(entry.cell);
			var w = Math.max(-e.x, e.x + e.width);
			var h = Math.max(-e.y, e.y + e.height);
			var k = spawned[entry.parent.id] || 0;
			spawned[entry.parent.id] = k + 1;
			var pt = this.getSpawnPoint(parent, parent.parentNode, k, counts[entry.parent.id]);
			node = {x: pt.x, y: pt.y, fx: null, fy: null, r: Math.sqrt(w * w + h * h),
				extent: e, cell: {geometry: new mxRectangle(0, 0, geo.width, geo.height)}};
		}

		// The focused node settles at the origin
		if (entry.level == 0)
		{
			node.fx = 0;
			node.fy = 0;
		}

		node.source = entry.cell;
		byId[entry.cell.id] = add(node, entry.level, parent);
	}

	var seen = Object.create(null);
	var groups = Object.create(null);

	for (var i = 0; i < nodes.length && links.length < this.maxLinks; i++)
	{
		var a = nodes[i];
		var edges = this.getSourceEdges(a.source);

		for (var j = 0; j < edges.length && links.length < this.maxLinks; j++)
		{
			var e = edges[j];
			var opposite = this.getOpposite(e, a.source);
			var b = (opposite != null) ? byId[opposite.id] : null;
			var key = (b != null) ? Math.min(a.id, b.id) + '_' + Math.max(a.id, b.id) : null;

			if (b != null && !seen[e.id] && (groups[key] || 0) < this.maxParallelLinks)
			{
				var link = this.linkBySource[e.id];
				var forward = model.getTerminal(e, true) == a.source;
				seen[e.id] = true;
				groups[key] = (groups[key] || 0) + 1;
				links.push({source: (forward) ? a : b, target: (forward) ? b : a,
					labels: (link != null && link.measured) ? link.labels :
						this.getSourceLabels(e)});
				a.links++;
				b.links++;
			}
		}
	}

	for (var i = 0; i < visible.more.length; i++)
	{
		var owner = byId[visible.more[i].owner.id];

		if (owner != null)
		{
			var a = Math.atan2(owner.y, owner.x);
			var w = this.moreWidth;
			var h = this.moreHeight;
			var node = add({x: owner.x + Math.cos(a) * owner.r, y: owner.y + Math.sin(a) * owner.r,
				fx: null, fy: null, r: Math.sqrt(w * w + h * h) / 2,
				extent: new mxRectangle(-w / 2, -h / 2, w, h),
				cell: {geometry: new mxRectangle(0, 0, w, h)}, more: true},
				owner.level + 1, owner);
			links.push({source: owner, target: node, more: true, labels: null});
			owner.links++;
			node.links++;
		}
	}

	// Runs the simulation with the copies
	var saved = [this.nodes, this.links, this.focus, this.alpha,
		this.alphaTarget, this.levelDistance];

	try
	{
		this.nodes = nodes;
		this.links = links;
		this.focus = (nodes.length > 0) ? nodes[0] : null;
		this.alpha = Math.max(this.alpha, 0.6);
		this.alphaTarget = 0;
		this.updateLevelDistance();
		var t0 = performance.now();

		for (var i = 0; i < this.maxPredictTicks && this.alpha >= this.alphaMin &&
			performance.now() - t0 < this.maxPredictTime; i++)
		{
			this.tick();
		}

		return this.getBounds(depth);
	}
	finally
	{
		this.nodes = saved[0];
		this.links = saved[1];
		this.focus = saved[2];
		this.alpha = saved[3];
		this.alphaTarget = saved[4];
		this.levelDistance = saved[5];
	}
};

/**
 * Returns the bounds of the shape, label and descendants of the given cell in
 * the diagram relative to its center in model units, which estimate the
 * extent of a node that is not painted yet (see measureNode).
 */
ForceExplorer.prototype.getSourceExtent = function(cell)
{
	var graph = this.sourceGraph;
	var geo = graph.model.getGeometry(cell);
	var result = new mxRectangle(-geo.width / 2, -geo.height / 2, geo.width, geo.height);
	var state = graph.view.getState(cell);
	var bbox = (state != null) ? graph.view.getBoundingBox(state, true) : null;

	if (bbox != null)
	{
		var s = graph.view.scale;
		result.add(new mxRectangle((bbox.x - state.getCenterX()) / s,
			(bbox.y - state.getCenterY()) / s, bbox.width / s, bbox.height / s));
	}

	return result;
};

/**
 * Returns the sizes of the labels of the given connector in the diagram,
 * which estimate the labels of a link that is not painted yet (see
 * measureLink).
 */
ForceExplorer.prototype.getSourceLabels = function(edge)
{
	var graph = this.sourceGraph;
	var counts = {source: 0, target: 0};

	// Like initEndLabels
	return ForceExplorer.getLabelSizes(graph.view, edge, mxUtils.bind(this, function(cell)
	{
		var end = null;

		if (this.isEndLabel(graph, cell))
		{
			var key = (cell.geometry.x < 0) ? 'source' : 'target';
			end = (++counts[key] <= this.maxEndLabels) ? ((key == 'source') ? -1 : 1) : 0;
		}

		return end;
	}));
};

/**
 * Returns the connectors of the given cell of the source graph that are
 * visible and connected on both ends, without loops.
 */
ForceExplorer.prototype.getSourceEdges = function(cell)
{
	return ForceExplorer.getEdges(this.sourceGraph, cell);
};

/**
 * Returns the other end of the given connector or null if it cannot be
 * shown as a node.
 */
ForceExplorer.prototype.getOpposite = function(edge, cell)
{
	return ForceExplorer.getOpposite(this.sourceGraph, edge, cell);
};

/**
 * Returns the connectors of the given cell of the given graph that are
 * visible and connected on both ends, without loops.
 */
ForceExplorer.getEdges = function(g, cell)
{
	var model = g.model;
	var edges = model.getEdges(cell);
	var result = [];

	for (var i = 0; i < edges.length; i++)
	{
		var e = edges[i];
		var s = model.getTerminal(e, true);
		var t = model.getTerminal(e, false);

		if (s != null && t != null && s != t && g.isCellVisible(e) &&
			!g.isEdgeIgnored(e) && g.isCellVisible(s) && g.isCellVisible(t) &&
			g.isCellVisible(g.getLayerForCell(e)))
		{
			result.push(e);
		}
	}

	return result;
};

/**
 * Returns the other end of the given connector of the given cell of the given
 * graph or null if it cannot be shown as a node.
 */
ForceExplorer.getOpposite = function(graph, edge, cell)
{
	var model = graph.model;
	var s = model.getTerminal(edge, true);
	var opposite = (s == cell) ? model.getTerminal(edge, false) : s;
	var geo = model.getGeometry(opposite);

	return (model.isVertex(opposite) && geo != null && !geo.relative) ? opposite : null;
};

/**
 * Returns the number of connections of the given cell of the given graph
 * that the explorer shows, or 0 if the cell cannot be explored.
 */
ForceExplorer.getConnectionCount = function(graph, cell)
{
	var model = graph.model;
	var geo = model.getGeometry(cell);
	var count = 0;

	if (model.isVertex(cell) && geo != null && !geo.relative && graph.isCellVisible(cell))
	{
		var edges = ForceExplorer.getEdges(graph, cell);

		for (var i = 0; i < edges.length; i++)
		{
			if (ForceExplorer.getOpposite(graph, edges[i], cell) != null)
			{
				count++;
			}
		}
	}

	return count;
};

/**
 * Returns the cells of the source graph within the current number of
 * levels of the focused cell, breadth first. Each cell shows up to its
 * cap of neighbours, preferring the shown ones, and more contains the
 * number of hidden neighbours of the cells. The cells and the nodes for
 * the hidden neighbours are at most maxNodes.
 */
ForceExplorer.prototype.getVisibleCells = function()
{
	var result = {entries: [], byId: Object.create(null), more: []};

	var add = function(cell, level, parent)
	{
		var entry = {cell: cell, level: level, parent: parent};
		result.entries.push(entry);
		result.byId[cell.id] = entry;
	};

	add(this.focusSource, 0, null);

	for (var i = 0; i < result.entries.length; i++)
	{
		var entry = result.entries[i];

		if (entry.level < this.depth)
		{
			var edges = this.getSourceEdges(entry.cell);
			var seen = Object.create(null);
			var shown = [];
			var hidden = [];

			for (var j = 0; j < edges.length; j++)
			{
				var opposite = this.getOpposite(edges[j], entry.cell);

				if (opposite != null && result.byId[opposite.id] == null &&
					seen[opposite.id] == null)
				{
					seen[opposite.id] = true;
					var node = this.nodeBySource[opposite.id];
					((node != null && node.leaving == null) ? shown : hidden).push(opposite);
				}
			}

			var candidates = shown.concat(hidden);
			var free = Math.max(0, this.maxNodes - result.entries.length - result.more.length);
			var cap = Math.min(candidates.length, this.caps[entry.cell.id] ||
				this.maxChildren, free);

			// Keeps a node for the hidden neighbours within maxNodes
			if (cap == free && cap < candidates.length)
			{
				cap = Math.max(0, cap - 1);
			}

			for (var j = 0; j < cap; j++)
			{
				add(candidates[j], entry.level + 1, entry.cell);
			}

			if (candidates.length > cap && result.entries.length +
				result.more.length < this.maxNodes)
			{
				result.more.push({owner: entry.cell, count: candidates.length - cap});
			}
		}
	}

	return result;
};

/**
 * Shows the cells within the levels of the focused cell. New cells start
 * at their parent and are pushed out by the simulation, cells that are no
 * longer shown move into their parent.
 */
ForceExplorer.prototype.update = function()
{
	var visible = this.getVisibleCells();
	var model = this.graph.model;
	var t0 = performance.now();

	model.beginUpdate();
	try
	{
		var revived = [];
		var more = [];

		for (var i = 0; i < this.nodes.length; i++)
		{
			var n = this.nodes[i];

			if (n.more)
			{
				more.push(n);
			}
			else
			{
				var entry = visible.byId[n.source.id];

				if (entry != null)
				{
					if (n.leaving != null)
					{
						n.leaving = null;
						n.born = t0;
						revived.push(n);
					}

					n.level = entry.level;
					n.parentSource = entry.parent;
				}
				else if (n.leaving == null)
				{
					var target = (n.parentSource != null) ?
						this.nodeBySource[n.parentSource.id] : null;
					n.fx = null;
					n.fy = null;
					n.focusTween = null;
					n.leaving = {t0: t0, x0: n.x, y0: n.y, target: (target != null &&
						visible.byId[target.source.id] != null) ? target : null};
				}
			}
		}

		this.removeNodes(more);
		var shownKeys = this.getShownKeys(visible.byId);
		var added = [];
		var spawned = Object.create(null);
		var counts = Object.create(null);

		for (var i = 0; i < visible.entries.length; i++)
		{
			var entry = visible.entries[i];

			if (entry.parent != null && this.nodeBySource[entry.cell.id] == null)
			{
				counts[entry.parent.id] = (counts[entry.parent.id] || 0) + 1;
			}
		}

		for (var i = 0; i < visible.entries.length; i++)
		{
			var entry = visible.entries[i];

			if (this.nodeBySource[entry.cell.id] == null)
			{
				var parent = (entry.parent != null) ?
					this.nodeBySource[entry.parent.id] : null;
				var x = 0;
				var y = 0;

				if (parent != null)
				{
					var grand = (parent.parentSource != null) ?
						this.nodeBySource[parent.parentSource.id] : null;
					var k = spawned[parent.id] || 0;
					spawned[parent.id] = k + 1;
					var pt = this.getSpawnPoint(parent, grand, k, counts[entry.parent.id]);
					x = pt.x;
					y = pt.y;
				}

				var node = this.addNode(entry.cell, parent, x, y, null, visible.byId);
				node.shownKey = shownKeys[entry.cell.id];
				node.level = entry.level;
				node.parentSource = entry.parent;
				added.push(node);
			}
		}

		this.updateShownCells(visible.byId, shownKeys);
		added = added.concat(revived);

		for (var i = 0; i < added.length; i++)
		{
			this.addLinks(added[i]);
		}

		for (var i = 0; i < visible.more.length; i++)
		{
			var owner = this.nodeBySource[visible.more[i].owner.id];

			if (owner != null)
			{
				this.addMoreNode(owner, visible.more[i].count);
			}
		}

		var prev = this.focus;
		this.focus = this.nodeBySource[this.focusSource.id];

		// The focused node is pinned to the origin unless it is dragged
		if (prev != this.focus)
		{
			if (prev != null && (this.gesture == null || this.gesture.node != prev))
			{
				prev.focusTween = null;
				prev.fx = null;
				prev.fy = null;
			}

			if (this.focus.fx == null && this.focus.x == 0 && this.focus.y == 0)
			{
				this.focus.fx = 0;
				this.focus.fy = 0;
			}
		}
	}
	finally
	{
		model.endUpdate();
	}

	this.measure();
	this.updateLevelDistance();
	this.predicted = null;
	this.setHover(null);
	this.updateInfo();
	this.reheat(0.6);
	ForceExplorer.fireChange();
};

/**
 * Returns the start position of the given new child of the given parent
 * node, which spreads the new nodes around their parent, away from the given
 * grandparent, or all around the parent if it has no parent.
 */
ForceExplorer.prototype.getSpawnPoint = function(parent, grand, k, count)
{
	var a = (grand == null) ? 2 * Math.PI * k / count - Math.PI / 2 :
		Math.atan2(parent.y - grand.y, parent.x - grand.x) +
		((k % 2 == 0) ? 1 : -1) * Math.ceil(k / 2) * 0.5;

	return new mxPoint(parent.x + Math.cos(a) * parent.r * 0.4,
		parent.y + Math.sin(a) * parent.r * 0.4);
};

/**
 * Updates the distance of the rings of the levels for the average size
 * of the shown nodes and the space that the neighbours of the focused node
 * and the labels of their connectors need on the first ring, up to twice
 * the distance for the size. More neighbours and the nodes of the other
 * levels are spread by the collisions.
 */
ForceExplorer.prototype.updateLevelDistance = function()
{
	var sum = 0;
	var count = 0;
	var nodes = 0;
	var labels = 0;

	for (var i = 0; i < this.nodes.length; i++)
	{
		var n = this.nodes[i];

		if (n.leaving == null)
		{
			if (!n.more)
			{
				sum += n.r;
				count++;
			}

			if (n.level == 1)
			{
				nodes += 2 * (n.r + this.collidePadding);
			}
		}
	}

	for (var i = 0; i < this.links.length; i++)
	{
		var link = this.links[i];

		if (link.labels != null && link.labels.width > 0 && (link.source == this.focus ||
			link.target == this.focus) && link.source.leaving == null &&
			link.target.leaving == null)
		{
			labels += (link.labels.width + link.labels.height) / 2 +
				2 * this.labelPadding;
		}
	}

	// The nodes are on the ring and the labels in the middle of the ring
	var d = 2.2 * ((count > 0) ? sum / count : 50) + this.linkGap;
	this.levelDistance = Math.max(d, Math.min(2 * d, Math.max(nodes / (2 * Math.PI),
		labels / Math.PI)));
};

/**
 * Measures the painted shapes and labels of the new nodes and the labels of
 * the new connectors, which need space in the layout.
 */
ForceExplorer.prototype.measure = function()
{
	for (var i = 0; i < this.nodes.length; i++)
	{
		if (!this.nodes[i].measured)
		{
			this.measureNode(this.nodes[i]);
		}
	}

	for (var i = 0; i < this.links.length; i++)
	{
		if (!this.links[i].measured)
		{
			this.measureLink(this.links[i]);
		}
	}
};

/**
 * Returns the bounds of the painted shape and label of the given state and
 * its descendants in model units relative to the position at which the
 * shape was painted, or null if it was not painted.
 */
ForceExplorer.prototype.getPaintedBounds = function(state)
{
	var shape = (state != null) ? state.shape : null;
	var result = null;

	if (shape != null && shape.forcePainted != null)
	{
		var view = this.graph.view;
		var bbox = view.getBoundingBox(state, true);

		if (bbox != null)
		{
			var s = view.scale;
			result = new mxRectangle(bbox.x / s - view.translate.x - shape.forcePainted.x,
				bbox.y / s - view.translate.y - shape.forcePainted.y,
				bbox.width / s, bbox.height / s);
		}
	}

	return result;
};

/**
 * Adds the bounds of the painted label and descendants of the given node to
 * its extent, which is relative to the center of the node, and updates the
 * radius around the center that contains the extent.
 */
ForceExplorer.prototype.measureNode = function(node)
{
	var geo = node.cell.geometry;
	var bounds = this.getPaintedBounds(this.graph.view.getState(node.cell));
	node.measured = true;

	if (bounds != null)
	{
		bounds.x -= geo.width / 2;
		bounds.y -= geo.height / 2;
		bounds.add(node.extent);
		node.extent = bounds;
	}

	var e = node.extent;
	var w = Math.max(-e.x, e.x + e.width);
	var h = Math.max(-e.y, e.y + e.height);
	node.r = Math.sqrt(w * w + h * h);
};

/**
 * Stores the size of the painted labels of the given link and the index of
 * each label at an end (see getEndLabelPoint).
 */
ForceExplorer.prototype.measureLink = function(link)
{
	var graph = this.graph;
	link.measured = true;

	// Ignores the labels at the ends after maxEndLabels (see initEndLabels)
	link.labels = ForceExplorer.getLabelSizes(graph.view, link.cell, mxUtils.bind(this, function(cell)
	{
		return (cell.geometry.forceEnd != null) ? cell.geometry.forceEnd :
			((this.isEndLabel(graph, cell)) ? 0 : null);
	}));

	if (link.labels != null)
	{
		var ends = [link.labels.source, link.labels.target];

		for (var i = 0; i < ends.length; i++)
		{
			for (var j = 0; j < ends[i].length; j++)
			{
				ends[i][j].cell.geometry.forceIndex = j;
			}
		}
	}
};

/**
 * Returns the sizes of the painted labels of the given connector in the
 * given view in model units, and the sizes of its arrows, or null if it has
 * no labels. The labels at the ends, for which the given function returns
 * -1 or 1 for the source or target, are in source and target in the order
 * of the children. The function returns null for labels in the middle and 0
 * for labels that are ignored.
 */
ForceExplorer.getLabelSizes = function(view, edge, getEnd)
{
	var model = view.graph.model;
	var s = view.scale;
	var state = view.getState(edge);
	var result = null;

	// Sizes are from the style, which is untrusted
	var getMarkerSize = function(arrow, size)
	{
		return (state != null && mxUtils.getValue(state.style, arrow,
			mxConstants.NONE) != mxConstants.NONE) ? Math.min(100, Math.max(0, parseFloat(
			mxUtils.getValue(state.style, size, mxConstants.DEFAULT_MARKERSIZE)) || 0)) : 0;
	};

	var add = function(cell, end)
	{
		var ls = view.getState(cell);
		var bbox = (ls != null && ls.text != null) ? ls.text.boundingBox : null;

		if (bbox != null && bbox.width > 0 && bbox.height > 0)
		{
			var size = new mxRectangle(0, 0, bbox.width / s, bbox.height / s);

			if (result == null)
			{
				result = {width: 0, height: 0, source: [], target: [],
					sourceMarker: getMarkerSize(mxConstants.STYLE_STARTARROW, 'startSize'),
					targetMarker: getMarkerSize(mxConstants.STYLE_ENDARROW, 'endSize')};
			}

			if (end == null)
			{
				result.width = Math.max(result.width, size.width);
				result.height = Math.max(result.height, size.height);
			}
			else
			{
				size.cell = cell;
				result[(end < 0) ? 'source' : 'target'].push(size);
			}
		}
	};

	add(edge);

	for (var i = 0; i < model.getChildCount(edge); i++)
	{
		var child = model.getChildAt(edge, i);
		var geo = model.getGeometry(child);

		if (geo != null && geo.relative)
		{
			var end = getEnd(child);

			if (end !== 0)
			{
				add(child, end);
			}
		}
	}

	return result;
};

/**
 * Returns the distance from the origin to the border of the given rectangle,
 * which contains the origin, in the direction of the given unit vector. The
 * rectangle is enlarged by dx and dy on each side if given.
 */
ForceExplorer.getExtent = function(rect, ux, uy, dx, dy)
{
	dx = (dx != null) ? dx : 0;
	dy = (dy != null) ? dy : 0;
	var tx = (ux > 0) ? (rect.x + rect.width + dx) / ux : ((ux < 0) ? (rect.x - dx) / ux : Infinity);
	var ty = (uy > 0) ? (rect.y + rect.height + dy) / uy : ((uy < 0) ? (rect.y - dy) / uy : Infinity);
	var d = Math.min(tx, ty);

	return (isFinite(d)) ? Math.max(0, d) : 0;
};

/**
 * Returns the distances from the center of the given node to the centers of
 * the given labels at the end of a connector that leaves the node in the
 * direction of the given unit vector, and the distance to the end of the
 * last label as the last entry. The first label is next to the extent of the
 * node and the arrow of the given size, the others follow on the line.
 */
ForceExplorer.prototype.getEndLabelDistances = function(node, labels, marker, ux, uy)
{
	var ax = Math.abs(ux);
	var ay = Math.abs(uy);
	var pad = this.labelPadding;
	var result = [];
	var d = 0;
	var size = 0;

	for (var i = 0; i < labels.length; i++)
	{
		var w = labels[i].width;
		var h = labels[i].height;
		var next = ax * w + ay * h;

		// The box of the first label is outside of the extent of the node
		d = (i == 0) ? ForceExplorer.getExtent(node.extent, ux, uy,
			w / 2 + pad + marker, h / 2 + pad + marker) :
			d + size / 2 + pad + next / 2;
		size = next;
		result.push(d);
	}

	result.push((labels.length > 0) ? d + size / 2 :
		ForceExplorer.getExtent(node.extent, ux, uy));

	return result;
};

/**
 * Returns the distance between the centers of the nodes of the given link in
 * the direction of the given unit vector, so that the extents of the nodes
 * do not overlap and the labels of the connector fit between them. The label
 * is in the middle of the line between the shapes and the labels at the
 * ends are next to the extents of the nodes (see getEndLabelPoint).
 */
ForceExplorer.prototype.getLinkDistance = function(link, ux, uy)
{
	var s = link.source;
	var t = link.target;
	var es = ForceExplorer.getExtent(s.extent, ux, uy);
	var et = ForceExplorer.getExtent(t.extent, -ux, -uy);
	var dist = es + et + ((link.more) ? 2 * this.collidePadding : this.linkGap);
	var labels = link.labels;

	if (labels != null)
	{
		var pad = this.labelPadding;
		var ends = this.getEndLabelDistances(s, labels.source,
			labels.sourceMarker, ux, uy);
		var a = ends[ends.length - 1];
		ends = this.getEndLabelDistances(t, labels.target,
			labels.targetMarker, -ux, -uy);
		var b = ends[ends.length - 1];

		if (labels.width > 0)
		{
			var ax = Math.abs(ux);
			var ay = Math.abs(uy);
			var gs = s.cell.geometry;
			var gt = t.cell.geometry;
			var m = (ax * labels.width + ay * labels.height) / 2 + pad;
			var mw = labels.width / 2 + pad;
			var mh = labels.height / 2 + pad;

			// The center of the label is outside of the extents and arrows and
			// after the labels at the ends
			a = Math.max(ForceExplorer.getExtent(s.extent, ux, uy, mw + labels.sourceMarker,
				mh + labels.sourceMarker), (labels.source.length > 0) ? a + m : 0);
			b = Math.max(ForceExplorer.getExtent(t.extent, -ux, -uy, mw + labels.targetMarker,
				mh + labels.targetMarker), (labels.target.length > 0) ? b + m : 0);

			// The center is in the middle of the line, which ends at the shapes
			var cs = ForceExplorer.getExtent(new mxRectangle(-gs.width / 2,
				-gs.height / 2, gs.width, gs.height), ax, ay);
			var ct = ForceExplorer.getExtent(new mxRectangle(-gt.width / 2,
				-gt.height / 2, gt.width, gt.height), ax, ay);
			dist = Math.max(dist, 2 * a - cs + ct, 2 * b + cs - ct);
		}
		else
		{
			dist = Math.max(dist, a + b + pad);
		}
	}

	return dist;
};

/**
 * Returns the center of the label with the given geometry at an end of the
 * connector of the given state in screen units, which is next to the extent
 * of the node at that end and after the labels before it, or null if the
 * connector has no line.
 */
ForceExplorer.prototype.getEndLabelPoint = function(state, geo)
{
	var link = state.cell.forceLink;
	var pts = state.absolutePoints;
	var result = null;

	if (link != null && pts != null && pts.length > 1)
	{
		var target = geo.forceEnd > 0;
		var p0 = pts[(target) ? pts.length - 1 : 0];
		var p1 = pts[(target) ? pts.length - 2 : 1];
		var dx = (p0 != null && p1 != null) ? p1.x - p0.x : 0;
		var dy = (p0 != null && p1 != null) ? p1.y - p0.y : 0;
		var l = Math.sqrt(dx * dx + dy * dy);

		if (l > 0)
		{
			var view = this.graph.view;
			var node = (target) ? link.target : link.source;
			var labels = link.labels;
			var ux = dx / l;
			var uy = dy / l;
			var d = ForceExplorer.getExtent(node.extent, ux, uy) + this.labelPadding;

			// Labels are measured after they were painted
			if (labels != null && typeof geo.forceIndex === 'number')
			{
				var sizes = labels[(target) ? 'target' : 'source'];

				if (geo.forceIndex >= 0 && geo.forceIndex < sizes.length)
				{
					d = this.getEndLabelDistances(node, sizes, labels[(target) ?
						'targetMarker' : 'sourceMarker'], ux, uy)[geo.forceIndex];
				}
			}

			var s = view.scale;
			result = new mxPoint((node.x + ux * d + view.translate.x - geo.width / 2) * s,
				(node.y + uy * d + view.translate.y - geo.height / 2) * s);
		}
	}

	return result;
};

/**
 * Maximum number of labels of connectors that are kept apart from each other
 * and from the nodes (see collideLabels).
 */
ForceExplorer.prototype.maxLabelCollisions = 200;

/**
 * Moves the nodes and the labels in the middle of the connectors of other
 * nodes apart, and the labels apart from each other, with the next positions.
 * A label moves with the nodes of its connector, and a connector whose label
 * is on one of its nodes gets longer.
 */
ForceExplorer.prototype.collideLabels = function()
{
	var nodes = this.nodes;
	var links = this.links;
	var boxes = [];

	for (var i = 0; i < links.length && boxes.length < this.maxLabelCollisions; i++)
	{
		var link = links[i];
		var labels = link.labels;
		var s = link.source;
		var t = link.target;

		if (labels != null && labels.width > 0 && s.leaving == null && t.leaving == null)
		{
			var sx = s.x + s.vx;
			var sy = s.y + s.vy;
			var dx = t.x + t.vx - sx;
			var dy = t.y + t.vy - sy;
			var l = Math.sqrt(dx * dx + dy * dy);

			if (l > 0)
			{
				// Middle of the line between the shapes
				var ux = dx / l;
				var uy = dy / l;
				var gs = s.cell.geometry;
				var gt = t.cell.geometry;
				var cs = ForceExplorer.getExtent(new mxRectangle(-gs.width / 2,
					-gs.height / 2, gs.width, gs.height), ux, uy);
				var ct = ForceExplorer.getExtent(new mxRectangle(-gt.width / 2,
					-gt.height / 2, gt.width, gt.height), -ux, -uy);
				var c = (l + cs - ct) / 2;
				boxes.push({link: link, x: sx + ux * c - labels.width / 2,
					y: sy + uy * c - labels.height / 2,
					width: labels.width, height: labels.height, ux: ux, uy: uy});
			}
		}
	}

	var p = 2 * this.labelPadding;
	var k = this.collideStrength / 2;

	// Returns the smaller overlap of the given boxes with the given padding
	// as a vector from the center of a to the center of b, or null if they
	// do not overlap. The labels of connectors from the same node move
	// sideways, which turns the connectors, as the springs keep their lengths.
	var getOverlap = function(a, b, pad)
	{
		var ox = Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x) + pad;
		var oy = Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y) + pad;

		if (ox > 0 && oy > 0)
		{
			var dx = b.x + b.width / 2 - a.x - a.width / 2;
			var dy = b.y + b.height / 2 - a.y - a.height / 2;
			var l = Math.sqrt(dx * dx + dy * dy);
			var o = Math.min(ox, oy);

			return (l > 0) ? {x: dx / l * o, y: dy / l * o} : {x: o, y: 0};
		}

		return null;
	};

	var move = function(link, dx, dy)
	{
		link.source.vx += dx;
		link.source.vy += dy;
		link.target.vx += dx;
		link.target.vy += dy;
	};

	for (var i = 0; i < boxes.length; i++)
	{
		var a = boxes[i];

		for (var j = 0; j < nodes.length; j++)
		{
			var n = nodes[j];

			if (n.leaving == null)
			{
				// The length of the connector keeps the padding to its nodes
				var own = n == a.link.source || n == a.link.target;
				var e = n.extent;
				var o = getOverlap(a, {x: n.x + n.vx + e.x, y: n.y + n.vy + e.y,
					width: e.width, height: e.height}, (own) ? 0 : p);

				if (o != null)
				{
					// Makes the connector longer if the label is on one of its nodes
					if (own)
					{
						var l = Math.sqrt(o.x * o.x + o.y * o.y) * k;
						a.link.source.vx -= a.ux * l;
						a.link.source.vy -= a.uy * l;
						a.link.target.vx += a.ux * l;
						a.link.target.vy += a.uy * l;
					}
					else
					{
						n.vx += o.x * k;
						n.vy += o.y * k;
						move(a.link, -o.x * k, -o.y * k);
					}
				}
			}
		}

		for (var j = i + 1; j < boxes.length; j++)
		{
			var o = getOverlap(a, boxes[j], p);

			if (o != null)
			{
				move(boxes[j].link, o.x * k, o.y * k);
				move(a.link, -o.x * k, -o.y * k);
			}
		}
	}
};

/**
 * Adds a node for the given cell of the source graph, or the given
 * cell if no source cell is given, centered at the given point. The
 * descendants of the cell that are in the given map of shown cells are not
 * cloned (see cloneSourceCells).
 */
ForceExplorer.prototype.addNode = function(source, parent, x, y, cell, shown)
{
	if (cell == null)
	{
		cell = this.cloneSourceCells([source], shown)[0];
	}

	var geo = cell.geometry;
	geo.x = x - geo.width / 2;
	geo.y = y - geo.height / 2;

	// The extent and radius are updated with the label (see measureNode)
	var node = {id: this.nextId++, cell: cell, source: source, parent: parent,
		x: x, y: y, vx: 0, vy: 0, fx: null, fy: null, links: 0, level: 0,
		r: Math.sqrt(geo.width * geo.width + geo.height * geo.height) / 2,
		extent: new mxRectangle(-geo.width / 2, -geo.height / 2, geo.width, geo.height),
		born: performance.now(), scale: 1, opacity: 1, levelAlpha: 1, dim: 1};
	cell.forceNode = node;
	this.nodes.push(node);

	if (source != null)
	{
		this.nodeBySource[source.id] = node;
	}

	this.graph.model.add(this.graph.getDefaultParent(), cell);

	return node;
};

/**
 * Stores the cells in the diagram of the given clone and its descendants,
 * which are cloned in the same order, in forceSource.
 */
ForceExplorer.prototype.setSourceCells = function(clone, source)
{
	var clones = this.graph.model.getDescendants(clone);
	var sources = this.sourceGraph.model.getDescendants(source);

	if (clones.length == sources.length)
	{
		for (var i = 0; i < clones.length; i++)
		{
			clones[i].forceSource = sources[i];
		}
	}
	else
	{
		clone.forceSource = source;
	}
};

/**
 * Returns a map from the IDs of the cells in the given map of shown cells
 * (from IDs to entries, see getVisibleCells) to a string for the shown cells
 * inside of them (see cloneSourceCells).
 */
ForceExplorer.prototype.getShownKeys = function(shown)
{
	var model = this.sourceGraph.model;
	var inside = Object.create(null);
	var keys = Object.create(null);

	for (var id in shown)
	{
		var cell = shown[id].cell;
		var parent = model.getParent(cell);
		keys[id] = '[]';

		while (parent != null)
		{
			if (shown[parent.id] != null)
			{
				inside[parent.id] = inside[parent.id] || [];
				inside[parent.id].push(cell.id);
			}

			parent = model.getParent(parent);
		}
	}

	for (var id in inside)
	{
		keys[id] = JSON.stringify(inside[id].sort());
	}

	return keys;
};

/**
 * Returns clones of the given cells of the source graph with their
 * descendants, except the descendants that are in the given map of shown
 * cells (from IDs to entries, see getVisibleCells), as they are shown as nodes
 * of their own. Each cell of the diagram is shown once, also if nested
 * containers are shown, which would otherwise clone the cells in the innermost
 * container once for each container. Connectors to cells that are not cloned
 * have no terminal, as in mxGraphModel.cloneCells. The clones keep the cells in
 * the diagram in forceSource. The optional mapping from object IDs of cells in
 * the diagram (see mxObjectIdentity) to clones is used for the terminals.
 */
ForceExplorer.prototype.cloneSourceCells = function(cells, shown, mapping)
{
	var model = this.sourceGraph.model;
	mapping = (mapping != null) ? mapping : Object.create(null);
	var sources = [];
	var clones = [];
	var result = [];

	for (var i = 0; i < cells.length; i++)
	{
		// Clones the cells in the same order as mxGraphModel.cloneCells
		var stack = [{cell: cells[i], parent: null}];

		while (stack.length > 0)
		{
			var entry = stack.pop();
			var cell = entry.cell;
			var clone = model.cellCloned(cell);
			clone.forceSource = cell;
			mapping[mxObjectIdentity.get(cell)] = clone;
			sources.push(cell);
			clones.push(clone);

			if (entry.parent != null)
			{
				entry.parent.insert(clone);
			}
			else
			{
				result.push(clone);
			}

			for (var j = model.getChildCount(cell) - 1; j >= 0; j--)
			{
				var child = model.getChildAt(cell, j);

				if (shown == null || shown[child.id] == null)
				{
					stack.push({cell: child, parent: clone});
				}
			}
		}
	}

	// Connects the clones like the cells (see mxGraphModel.restoreClone)
	for (var i = 0; i < sources.length; i++)
	{
		for (var j = 0; j < 2; j++)
		{
			var terminal = model.getTerminal(sources[i], j == 0);
			var tmp = (terminal != null) ? mapping[mxObjectIdentity.get(terminal)] : null;

			if (tmp != null)
			{
				tmp.insertEdge(clones[i], j == 0);
			}
		}
	}

	return result;
};

/**
 * Clones the descendants of the shown nodes again if the cells inside of
 * them that are shown as nodes of their own have changed, eg. if a cell
 * inside of a node is no longer shown (see cloneSourceCells). The given
 * maps are from getVisibleCells and getShownKeys.
 */
ForceExplorer.prototype.updateShownCells = function(shown, shownKeys)
{
	var model = this.graph.model;
	var sourceModel = this.sourceGraph.model;

	for (var i = 0; i < this.nodes.length; i++)
	{
		var node = this.nodes[i];

		if (node.source != null && node.leaving == null)
		{
			var key = shownKeys[node.source.id];

			if (key != null && node.shownKey != key)
			{
				node.shownKey = key;

				for (var j = model.getChildCount(node.cell) - 1; j >= 0; j--)
				{
					model.remove(model.getChildAt(node.cell, j));
				}

				var children = [];

				for (var j = 0; j < sourceModel.getChildCount(node.source); j++)
				{
					var child = sourceModel.getChildAt(node.source, j);

					if (shown[child.id] == null)
					{
						children.push(child);
					}
				}

				// Clones the children at once to keep the connectors between them
				// and to the cell of the node
				var mapping = Object.create(null);
				mapping[mxObjectIdentity.get(node.source)] = node.cell;
				var clones = this.cloneSourceCells(children, shown, mapping);

				for (var j = 0; j < clones.length; j++)
				{
					model.add(node.cell, clones[j]);
				}

				// The extent is measured again with the new descendants
				var geo = node.cell.geometry;
				node.extent = new mxRectangle(-geo.width / 2, -geo.height / 2,
					geo.width, geo.height);
				node.measured = false;
			}
		}
	}
};

/**
 * Adds the node that shows the given number of hidden neighbours.
 */
ForceExplorer.prototype.addMoreNode = function(owner, count)
{
	var cell = new mxCell('+' + count, new mxGeometry(0, 0,
		this.moreWidth, this.moreHeight), this.moreStyle);
	cell.vertex = true;

	// Starts outside of the owner, away from the origin
	var a = Math.atan2(owner.y, owner.x) + Math.random() - 0.5;
	var node = this.addNode(null, owner, owner.x + Math.cos(a) * owner.r,
		owner.y + Math.sin(a) * owner.r, cell);
	node.level = owner.level + 1;
	node.more = true;

	var edge = new mxCell('', new mxGeometry(), this.moreEdgeStyle);
	edge.geometry.relative = true;
	edge.edge = true;
	this.addLink(edge, owner, node, null);
};

/**
 * Adds the connectors of the source graph between the given node and
 * all shown nodes.
 */
ForceExplorer.prototype.addLinks = function(node)
{
	var edges = this.getSourceEdges(node.source);
	var model = this.sourceGraph.model;

	for (var i = 0; i < edges.length; i++)
	{
		var e = edges[i];
		var opposite = this.getOpposite(e, node.source);
		var other = (opposite != null) ? this.nodeBySource[opposite.id] : null;
		var group = (other != null) ? this.groups[Math.min(node.id, other.id) +
			'_' + Math.max(node.id, other.id)] : null;

		if (other != null && other.leaving == null && this.linkBySource[e.id] == null &&
			this.links.length < this.maxLinks && (group == null ||
			group.length < this.maxParallelLinks))
		{
			var clone = this.graph.cloneCells([e], true)[0];
			this.setSourceCells(clone, e);
			var style = clone.getStyle();

			for (var j = 0; j < this.removedEdgeStyles.length; j++)
			{
				style = mxUtils.setStyle(style, this.removedEdgeStyles[j], null);
			}

			clone.setStyle(mxUtils.setStyle(style, 'noEdgeStyle', '1'));
			clone.geometry.points = null;
			clone.geometry.x = 0;
			clone.geometry.y = 0;
			this.initEndLabels(clone);

			var forward = model.getTerminal(e, true) == node.source;
			this.addLink(clone, (forward) ? node : other, (forward) ? other : node, e);
		}
	}
};

/**
 * Returns true if the given cell of the given graph is a label at an end of
 * its connector, and not a symbol.
 */
ForceExplorer.prototype.isEndLabel = function(graph, cell)
{
	var geo = cell.geometry;
	var result = false;

	if (cell.vertex && geo != null && geo.relative && Math.abs(geo.x) > 0.5)
	{
		var style = graph.getCellStyle(cell);
		result = geo.width == 0 || geo.height == 0 ||
			(mxUtils.getValue(style, mxConstants.STYLE_FILLCOLOR,
				mxConstants.NONE) == mxConstants.NONE &&
			mxUtils.getValue(style, mxConstants.STYLE_STROKECOLOR,
				mxConstants.NONE) == mxConstants.NONE);
	}

	return result;
};

/**
 * Centers the labels at the ends of the given clone of a connector on the
 * line, where they are placed next to the shapes (see getEndLabelPoint).
 * Their offsets and alignments are for the connector in the diagram, which
 * may run in another direction. Labels after maxEndLabels at an end keep
 * their positions.
 */
ForceExplorer.prototype.initEndLabels = function(edge)
{
	var source = 0;
	var target = 0;

	// The geometries of the diagram may contain the fields of the explorer
	ForceExplorer.resetEndLabel(edge.geometry);

	for (var i = 0; i < edge.getChildCount(); i++)
	{
		var child = edge.getChildAt(i);
		ForceExplorer.resetEndLabel(child.geometry);

		if (this.isEndLabel(this.graph, child))
		{
			var end = (child.geometry.x < 0) ? -1 : 1;
			var count = (end < 0) ? ++source : ++target;

			if (count <= this.maxEndLabels)
			{
				var style = this.graph.getCellStyle(child);
				var s = child.getStyle();
				s = mxUtils.setStyle(s, mxConstants.STYLE_ALIGN, mxConstants.ALIGN_CENTER);
				s = mxUtils.setStyle(s, mxConstants.STYLE_VERTICAL_ALIGN, mxConstants.ALIGN_MIDDLE);
				s = mxUtils.setStyle(s, mxConstants.STYLE_LABEL_POSITION, null);
				s = mxUtils.setStyle(s, mxConstants.STYLE_VERTICAL_LABEL_POSITION, null);

				// Hides the line behind the label
				if (mxUtils.getValue(style, mxConstants.STYLE_LABEL_BACKGROUNDCOLOR,
					mxConstants.NONE) == mxConstants.NONE)
				{
					s = mxUtils.setStyle(s, mxConstants.STYLE_LABEL_BACKGROUNDCOLOR, 'default');
				}

				child.setStyle(s);
				child.geometry.forceEnd = end;
			}
		}
	}
};

/**
 * Removes the fields of the explorer for labels at the ends of connectors
 * from the given geometry, which is a clone of a geometry in the diagram.
 */
ForceExplorer.resetEndLabel = function(geo)
{
	if (geo != null)
	{
		delete geo.forceEnd;
		delete geo.forceIndex;
	}
};

/**
 * Adds the given connector between the given nodes.
 */
ForceExplorer.prototype.addLink = function(cell, source, target, sourceEdge)
{
	var model = this.graph.model;
	model.add(this.graph.getDefaultParent(), cell, 0);
	model.setTerminal(cell, source.cell, true);
	model.setTerminal(cell, target.cell, false);

	var key = Math.min(source.id, target.id) + '_' + Math.max(source.id, target.id);
	var link = {cell: cell, source: source, target: target, key: key,
		more: sourceEdge == null, bullets: [], dim: 1};
	cell.forceLink = link;
	this.links.push(link);
	source.links++;
	target.links++;

	if (sourceEdge != null)
	{
		this.linkBySource[sourceEdge.id] = link;
		link.sourceEdge = sourceEdge;
	}

	// Parallel connectors are curved around the line between the nodes
	var group = this.groups[key];

	if (group == null)
	{
		group = [];
		this.groups[key] = group;
	}

	group.push(link);

	if (group.length > 1)
	{
		var curved = (group.length == 2) ? group : [link];

		for (var i = 0; i < curved.length; i++)
		{
			model.setStyle(curved[i].cell, mxUtils.setStyle(
				model.getStyle(curved[i].cell), 'curved', '1'));
		}
	}
};

/**
 * Removes the given nodes and their connectors.
 */
ForceExplorer.prototype.removeNodes = function(nodes)
{
	if (nodes.length == 0)
	{
		return;
	}

	var model = this.graph.model;
	var removed = Object.create(null);

	for (var i = 0; i < nodes.length; i++)
	{
		removed[nodes[i].id] = true;
	}

	model.beginUpdate();
	try
	{
		var links = [];

		for (var i = 0; i < this.links.length; i++)
		{
			var link = this.links[i];

			if (removed[link.source.id] || removed[link.target.id])
			{
				this.removeBullets(link, 0);
				link.source.links--;
				link.target.links--;
				model.remove(link.cell);

				if (link.sourceEdge != null)
				{
					delete this.linkBySource[link.sourceEdge.id];
				}

				var group = this.groups[link.key];
				group.splice(mxUtils.indexOf(group, link), 1);

				if (group.length == 0)
				{
					delete this.groups[link.key];
				}
			}
			else
			{
				links.push(link);
			}
		}

		this.links = links;

		for (var i = 0; i < nodes.length; i++)
		{
			var node = nodes[i];
			model.remove(node.cell);

			if (node.source != null && this.nodeBySource[node.source.id] == node)
			{
				delete this.nodeBySource[node.source.id];
			}
		}

		var remaining = [];

		for (var i = 0; i < this.nodes.length; i++)
		{
			if (!removed[this.nodes[i].id])
			{
				remaining.push(this.nodes[i]);
			}
		}

		this.nodes = remaining;
	}
	finally
	{
		model.endUpdate();
	}

	if (this.hover != null && removed[this.hover.id])
	{
		this.setHover(null);
	}
};

/**
 * Restarts the simulation with the given alpha.
 */
ForceExplorer.prototype.reheat = function(alpha)
{
	this.alpha = Math.max(this.alpha, alpha);
	this.schedule();
};

/**
 * Requests the next frame.
 */
ForceExplorer.prototype.schedule = function()
{
	if (this.frameThread == null && this.graph != null)
	{
		this.frameThread = window.requestAnimationFrame(this.frameHandler);
	}
};

/**
 * Runs one step of the simulation and the animations and paints them.
 */
ForceExplorer.prototype.frame = function(time)
{
	this.frameThread = null;

	if (this.graph == null)
	{
		return;
	}

	var t0 = performance.now();
	var tween = this.updateTweens(t0);
	this.updateDepth();
	var simulate = this.alpha >= this.alphaMin || this.alphaTarget > 0;

	if (simulate)
	{
		this.tick();
	}

	var t1 = performance.now();
	var animate = this.updateAnimations(t0) || tween;

	if (simulate || animate || this.dirty)
	{
		this.dirty = false;

		if (this.mode == 'model')
		{
			this.renderModel();
		}
		else
		{
			this.renderTransform();
		}
	}

	var t2 = performance.now();
	var bullets = this.updateBullets(t0);
	this.updateSpotlight(t0);
	var t3 = performance.now();
	this.recordFrame(time, t0, t1, t2, t3, simulate || animate);

	if (simulate || animate || this.dirty || (bullets && !this.reducedMotion &&
		!document.hidden))
	{
		this.schedule();
	}

	// Sends the positions of the nodes once they settled
	var settled = !simulate && !animate;

	if (settled != this.settled)
	{
		this.settled = settled;

		if (settled)
		{
			ForceExplorer.fireChange();
		}
	}
};

/**
 * Updates the camera and the movement of the focused node to the
 * origin. Returns true if a tween is running.
 */
ForceExplorer.prototype.updateTweens = function(t)
{
	var result = false;
	var ct = this.cameraTween;

	if (ct != null)
	{
		var k = Math.min(1, (t - ct.t0) / this.cameraDuration);
		var e = 1 - Math.pow(1 - k, 3);
		var s = ct.s0 * Math.pow(ct.s1 / ct.s0, e);
		var x = ct.x0 + (ct.x1 - ct.x0) * e;
		var y = ct.y0 + (ct.y1 - ct.y0) * e;
		this.graph.view.scaleAndTranslate(s, x / s - ct.pt.x, y / s - ct.pt.y);

		if (k >= 1)
		{
			// Keeps the levels of a followed explorer (see updateDepth)
			if (ct.follow)
			{
				this.depthScale = s;
			}

			this.cameraTween = null;
		}

		result = true;
	}

	for (var i = 0; i < this.nodes.length; i++)
	{
		var n = this.nodes[i];
		var ft = n.focusTween;

		if (ft != null)
		{
			var k = Math.min(1, (t - ft.t0) / this.focusDuration);
			var e = (k < 0.5) ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
			n.fx = ft.x0 * (1 - e);
			n.fy = ft.y0 * (1 - e);
			this.alpha = Math.max(this.alpha, 0.1);

			if (k >= 1)
			{
				n.focusTween = null;
				n.fx = (n == this.focus) ? 0 : null;
				n.fy = (n == this.focus) ? 0 : null;
			}

			result = true;
		}

		// Moves the node to the position of a followed explorer
		var st = n.syncTween;

		if (st != null && ft == null && n.leaving == null)
		{
			var k = Math.min(1, (t - st.t0) / this.focusDuration);
			var e = 1 - Math.pow(1 - k, 3);
			n.x = st.x0 + (st.x1 - st.x0) * e;
			n.y = st.y0 + (st.y1 - st.y0) * e;
			n.vx = 0;
			n.vy = 0;

			if (k >= 1)
			{
				n.syncTween = null;
			}

			result = true;
		}
	}

	return result;
};

/**
 * Runs one step of the simulation (see d3-force).
 */
ForceExplorer.prototype.tick = function()
{
	var nodes = this.nodes;
	var links = this.links;
	this.alpha += (this.alphaTarget - this.alpha) * this.alphaDecay;
	var alpha = this.alpha;

	// Springs along the connectors
	for (var i = 0; i < links.length; i++)
	{
		var s = links[i].source;
		var t = links[i].target;

		if (s.leaving == null && t.leaving == null)
		{
			var x = t.x + t.vx - s.x - s.vx || this.jiggle();
			var y = t.y + t.vy - s.y - s.vy || this.jiggle();
			var l = Math.sqrt(x * x + y * y);
			var dist = this.getLinkDistance(links[i], x / l, y / l);

			// Sizes are from the diagram, which is untrusted
			if (!isFinite(dist))
			{
				dist = s.r + t.r + this.linkGap;
			}
			l = (l - dist) / l * alpha / Math.min(s.links, t.links);
			x *= l;
			y *= l;
			var b = s.links / (s.links + t.links);
			t.vx -= x * b;
			t.vy -= y * b;
			s.vx += x * (1 - b);
			s.vy += y * (1 - b);
		}
	}

	// Repulsion and collision of all pairs
	var dmax2 = this.chargeDistanceMax * this.chargeDistanceMax;
	var dmin2 = this.chargeDistanceMin * this.chargeDistanceMin;

	for (var i = 0; i < nodes.length; i++)
	{
		var a = nodes[i];

		if (a.leaving == null)
		{
			for (var j = i + 1; j < nodes.length; j++)
			{
				var b = nodes[j];

				if (b.leaving == null)
				{
					var dx = b.x - a.x || this.jiggle();
					var dy = b.y - a.y || this.jiggle();
					var l2 = dx * dx + dy * dy;

					if (l2 < dmax2)
					{
						// Limits the force for close nodes, collisions separate them
						var w = alpha * this.chargeFactor / Math.max(l2, dmin2);
						a.vx -= dx * b.r * w;
						a.vy -= dy * b.r * w;
						b.vx += dx * a.r * w;
						b.vy += dy * a.r * w;
					}

					// Collision of the extents, which contain the labels, with the
					// next positions. Overlaps are removed along the axis with the
					// smaller overlap.
					var ea = a.extent;
					var eb = b.extent;
					var ax = a.x + a.vx + ea.x;
					var ay = a.y + a.vy + ea.y;
					var bx = b.x + b.vx + eb.x;
					var by = b.y + b.vy + eb.y;
					var p = 2 * this.collidePadding;
					var ox = Math.min(ax + ea.width, bx + eb.width) - Math.max(ax, bx) + p;
					var oy = Math.min(ay + ea.height, by + eb.height) - Math.max(ay, by) + p;

					if (ox > 0 && oy > 0)
					{
						var aa = ea.width * ea.height;
						var ab = eb.width * eb.height;
						var wa = (aa + ab > 0) ? ab / (aa + ab) : 0.5;

						if (ox < oy)
						{
							var m = ((bx + eb.width / 2 > ax + ea.width / 2) ? ox : -ox) *
								this.collideStrength;
							a.vx -= m * wa;
							b.vx += m * (1 - wa);
						}
						else
						{
							var m = ((by + eb.height / 2 > ay + ea.height / 2) ? oy : -oy) *
								this.collideStrength;
							a.vy -= m * wa;
							b.vy += m * (1 - wa);
						}
					}
				}
			}

			// Keeps the focused node at the origin and the levels on rings
			if (a == this.focus)
			{
				a.vx -= a.x * alpha * this.focusCenterStrength;
				a.vy -= a.y * alpha * this.focusCenterStrength;
			}
			else
			{
				var l = Math.sqrt(a.x * a.x + a.y * a.y) || 1;
				var k = (a.level * this.levelDistance - l) / l *
					alpha * this.radialStrength;
				a.vx += a.x * k;
				a.vy += a.y * k;
			}
		}
	}

	this.collideLabels();

	for (var i = 0; i < nodes.length; i++)
	{
		var n = nodes[i];

		if (n.leaving == null)
		{
			if (n.fx != null)
			{
				n.x = n.fx;
				n.y = n.fy;
				n.vx = 0;
				n.vy = 0;
			}
			else
			{
				n.vx *= 1 - this.velocityDecay;
				n.vy *= 1 - this.velocityDecay;
				var v = Math.sqrt(n.vx * n.vx + n.vy * n.vy);

				if (v > this.maxSpeed)
				{
					n.vx *= this.maxSpeed / v;
					n.vy *= this.maxSpeed / v;
				}

				n.x += n.vx;
				n.y += n.vy;
			}
		}
	}
};

/**
 * Returns a tiny random value for separating coincident nodes.
 */
ForceExplorer.prototype.jiggle = function()
{
	return (Math.random() - 0.5) * 1e-6;
};

/**
 * Returns the opacity of the given level.
 */
ForceExplorer.prototype.getLevelOpacity = function(level)
{
	return Math.max(0.55, 1 - Math.max(0, level - 1) * 0.15);
};

/**
 * Moves the given value towards the given target. Returns the new value.
 */
ForceExplorer.prototype.approach = function(value, target)
{
	var d = target - value;

	return (Math.abs(d) < 0.01) ? target : value + d * 0.2;
};

/**
 * Updates the scale and opacity of appearing nodes, moves leaving nodes
 * into their target and fades the levels and the highlight. Returns
 * true if an animation is running.
 */
ForceExplorer.prototype.updateAnimations = function(t)
{
	var active = false;
	var done = [];

	for (var i = 0; i < this.nodes.length; i++)
	{
		var n = this.nodes[i];

		if (n.leaving != null)
		{
			var target = (n.leaving.target != null) ? n.leaving.target : this.focus;
			var k = Math.min(1, (t - n.leaving.t0) / this.leaveDuration);
			var e = k * k;
			n.x = n.leaving.x0 + (target.x - n.leaving.x0) * e;
			n.y = n.leaving.y0 + (target.y - n.leaving.y0) * e;
			n.scale = 1 - 0.7 * e;
			n.opacity = 1 - e;
			active = true;

			if (k >= 1)
			{
				done.push(n);
			}
		}
		else if (n.born != null)
		{
			// Ease out back, which overshoots a little
			var k = Math.min(1, (t - n.born) / this.appearDuration);
			var e = 1 + 2.70158 * Math.pow(k - 1, 3) + 1.70158 * Math.pow(k - 1, 2);
			n.scale = 0.2 + 0.8 * e;
			n.opacity = Math.min(1, k * 2);
			active = true;

			if (k >= 1)
			{
				n.born = null;
			}
		}

		var levelAlpha = this.approach(n.levelAlpha, this.getLevelOpacity(n.level));
		var dim = this.approach(n.dim, (this.hoverNeighbors == null ||
			this.hoverNeighbors[n.id]) ? 1 : this.dimOpacity);

		if (levelAlpha != n.levelAlpha || dim != n.dim)
		{
			n.levelAlpha = levelAlpha;
			n.dim = dim;
			active = true;
		}
	}

	for (var i = 0; i < this.links.length; i++)
	{
		var link = this.links[i];
		var dim = this.approach(link.dim, (this.hoverNeighbors == null ||
			link.source == this.hover || link.target == this.hover) ?
			1 : this.dimOpacity * 0.5);

		if (dim != link.dim)
		{
			link.dim = dim;
			active = true;
		}
	}

	if (done.length > 0)
	{
		this.removeNodes(done);
		this.updateInfo();
	}

	return active;
};

/**
 * Updates the curve points of parallel connectors and passes the
 * changed connectors and their new points to the given function.
 */
ForceExplorer.prototype.updateParallelEdges = function(callback)
{
	for (var key in this.groups)
	{
		var group = this.groups[key];
		var a = (group[0].source.id < group[0].target.id) ?
			group[0].source : group[0].target;
		var b = (a == group[0].source) ? group[0].target : group[0].source;
		var dx = b.x - a.x;
		var dy = b.y - a.y;
		var l = Math.sqrt(dx * dx + dy * dy) || 1;

		for (var i = 0; i < group.length; i++)
		{
			var geo = group[i].cell.geometry;

			if (group.length > 1)
			{
				var d = (i - (group.length - 1) / 2) * this.parallelSpacing;
				var pt = new mxPoint((a.x + b.x) / 2 - dy / l * d,
					(a.y + b.y) / 2 + dx / l * d);

				if (geo.points == null || geo.points.length != 1 ||
					!geo.points[0].equals(pt))
				{
					callback(group[i].cell, [pt]);
				}
			}
			else if (geo.points != null)
			{
				callback(group[i].cell, null);
			}
		}
	}
};

/**
 * Returns the opacity of the given node.
 */
ForceExplorer.prototype.getNodeOpacity = function(node)
{
	return node.opacity * node.levelAlpha * node.dim;
};

/**
 * Writes the positions into the geometries without model events,
 * updates the states of the moved vertices without a repaint, moves
 * their painted nodes and repaints their connectors.
 */
ForceExplorer.prototype.renderTransform = function()
{
	var view = this.graph.view;
	var model = this.graph.model;
	var stamp = ++this.renderStamp;
	var edges = [];

	var addEdge = function(edge)
	{
		if (edge.forceStamp != stamp)
		{
			edge.forceStamp = stamp;
			edges.push(edge);
		}
	};

	for (var i = 0; i < this.nodes.length; i++)
	{
		var n = this.nodes[i];
		var geo = n.cell.geometry;
		var x = n.x - geo.width / 2;
		var y = n.y - geo.height / 2;
		var moved = geo.x != x || geo.y != y;

		if (moved)
		{
			geo.x = x;
			geo.y = y;
		}

		var cells = (model.getChildCount(n.cell) > 0) ?
			model.getDescendants(n.cell) : [n.cell];

		for (var j = 0; j < cells.length; j++)
		{
			var cell = cells[j];
			var state = view.getState(cell);

			if (model.isVertex(cell))
			{
				if (state != null && !state.invalid)
				{
					if (moved)
					{
						view.updateCellState(state);
						state.updateCachedBounds();
					}

					this.applyTransform(state, n);
				}

				if (moved)
				{
					for (var k = 0; k < model.getEdgeCount(cell); k++)
					{
						addEdge(model.getEdgeAt(cell, k));
					}
				}
			}
			else if (moved && model.isEdge(cell))
			{
				addEdge(cell);
			}
		}
	}

	this.updateParallelEdges(function(edge, points)
	{
		edge.geometry.points = points;
		addEdge(edge);
	});

	for (var i = 0; i < edges.length; i++)
	{
		if (view.getState(edges[i]) != null)
		{
			view.invalidate(edges[i], true, false);
			view.validateCellState(edges[i], true);
		}
	}

	this.updateLinkOpacity();
};

/**
 * Applies the opacity of the links to their connectors.
 */
ForceExplorer.prototype.updateLinkOpacity = function()
{
	var view = this.graph.view;

	for (var i = 0; i < this.links.length; i++)
	{
		var link = this.links[i];
		var state = view.getState(link.cell);

		if (state != null)
		{
			var opacity = link.dim * Math.min(this.getNodeOpacity(link.source),
				this.getNodeOpacity(link.target));
			var value = (opacity < 1) ? String(opacity) : '';

			if (state.shape != null && state.shape.node != null &&
				state.shape.node.style.opacity != value)
			{
				state.shape.node.style.opacity = value;
			}

			if (state.text != null && state.text.node != null &&
				state.text.node.style.opacity != value)
			{
				state.text.node.style.opacity = value;
			}
		}
	}
};

/**
 * Moves the painted shape and label of the given vertex state to the
 * current position and applies the scale and opacity of the given node.
 */
ForceExplorer.prototype.applyTransform = function(state, node)
{
	var view = state.view;
	var x = state.x / view.scale - view.translate.x;
	var y = state.y / view.scale - view.translate.y;
	var opacity = this.getNodeOpacity(node);
	var filter = (node == this.hover && node != this.focus) ?
		'drop-shadow(0 0 6px ' + this.accentColor + ')' : '';

	this.transformShape(state.shape, x, y, node, opacity, filter);
	this.transformShape(state.text, x, y, node, opacity, '');
};

/**
 * Sets the transform of the given shape for the given position in model
 * units and the scale of the given node, and the given opacity and filter.
 */
ForceExplorer.prototype.transformShape = function(shape, x, y, node, opacity, filter)
{
	if (shape != null && shape.node != null && shape.forcePainted != null)
	{
		var view = this.graph.view;
		var mc = view.modelCoordinates;
		var s = (mc) ? 1 : view.scale;
		var dx = x - shape.forcePainted.x;
		var dy = y - shape.forcePainted.y;
		var t = '';

		if (dx != 0 || dy != 0)
		{
			t = 'translate(' + (dx * s) + ',' + (dy * s) + ')';
		}

		if (node.scale != 1)
		{
			// Scales around the painted center of the node
			var cx = node.x - dx;
			var cy = node.y - dy;

			if (!mc)
			{
				cx = (cx + view.translate.x) * view.scale;
				cy = (cy + view.translate.y) * view.scale;
			}

			t += ' translate(' + cx + ',' + cy + ') scale(' + node.scale +
				') translate(' + (-cx) + ',' + (-cy) + ')';
		}

		var off = shape.svgScreenOffset;

		if (off)
		{
			t += ' translate(' + off + ',' + off + ')';
		}

		if (t != '')
		{
			shape.node.setAttribute('transform', t);
		}
		else
		{
			shape.node.removeAttribute('transform');
		}

		shape.node.style.opacity = (opacity < 1) ? opacity : '';

		if (shape.forceFilter != filter)
		{
			shape.forceFilter = filter;
			shape.node.style.filter = filter;
		}
	}
};

/**
 * Writes the positions through the model, which repaints the moved
 * cells and their connectors.
 */
ForceExplorer.prototype.renderModel = function()
{
	var view = this.graph.view;
	var model = this.graph.model;

	model.beginUpdate();
	try
	{
		for (var i = 0; i < this.nodes.length; i++)
		{
			var n = this.nodes[i];
			var geo = n.cell.geometry;
			var x = n.x - geo.width / 2;
			var y = n.y - geo.height / 2;

			if (geo.x != x || geo.y != y)
			{
				geo = geo.clone();
				geo.x = x;
				geo.y = y;
				model.setGeometry(n.cell, geo);
			}
		}

		this.updateParallelEdges(function(edge, points)
		{
			var geo = edge.geometry.clone();
			geo.points = points;
			model.setGeometry(edge, geo);
		});
	}
	finally
	{
		model.endUpdate();
	}

	for (var i = 0; i < this.nodes.length; i++)
	{
		var n = this.nodes[i];
		var state = view.getState(n.cell);

		if (state != null)
		{
			var opacity = this.getNodeOpacity(n);
			opacity = (opacity < 1) ? opacity : '';

			if (state.shape != null && state.shape.node != null)
			{
				state.shape.node.style.opacity = opacity;
			}

			if (state.text != null && state.text.node != null)
			{
				state.text.node.style.opacity = opacity;
			}
		}
	}

	this.updateLinkOpacity();
};

/**
 * Moves the light and the pulsing ring to the focused node.
 */
ForceExplorer.prototype.updateSpotlight = function(t)
{
	var view = this.graph.view;
	var n = this.focus;

	if (n != null)
	{
		var s = view.scale;
		var x = (n.x + view.translate.x) * s;
		var y = (n.y + view.translate.y) * s;
		this.spotlight.setAttribute('cx', x);
		this.spotlight.setAttribute('cy', y);
		this.spotlight.setAttribute('r', n.r * 2.4 * s);

		if (this.reducedMotion)
		{
			this.ring.setAttribute('visibility', 'hidden');
		}
		else
		{
			var k = mxUtils.mod(t, 2200) / 2200;
			this.ring.setAttribute('cx', x);
			this.ring.setAttribute('cy', y);
			this.ring.setAttribute('r', (n.r + 4 + k * 40) * s);
			this.ring.setAttribute('stroke-opacity', 0.45 * (1 - k));
		}
	}
};

/**
 * Returns the painted line of the connector of the given link.
 */
ForceExplorer.prototype.getLinePath = function(link)
{
	var state = this.graph.view.getState(link.cell);

	if (state != null && state.shape != null && state.shape.node != null)
	{
		var paths = state.shape.node.getElementsByTagName('path');

		for (var i = 0; i < paths.length; i++)
		{
			if (paths[i].getAttribute('visibility') != 'hidden')
			{
				return paths[i];
			}
		}
	}

	return null;
};

/**
 * Returns the length of the given polyline and a function that returns the
 * point and the angle for a distance along the line.
 */
ForceExplorer.createPolyline = function(xs, ys)
{
	var lengths = [0];

	for (var i = 1; i < xs.length; i++)
	{
		var dx = xs[i] - xs[i - 1];
		var dy = ys[i] - ys[i - 1];
		lengths.push(lengths[i - 1] + Math.sqrt(dx * dx + dy * dy));
	}

	return {length: lengths[lengths.length - 1], pointAt: function(d)
	{
		var i = 1;

		while (i < lengths.length - 1 && lengths[i] < d)
		{
			i++;
		}

		var seg = lengths[i] - lengths[i - 1];
		var k = (seg > 0) ? (d - lengths[i - 1]) / seg : 0;

		return {x: xs[i - 1] + (xs[i] - xs[i - 1]) * k,
			y: ys[i - 1] + (ys[i] - ys[i - 1]) * k,
			angle: Math.atan2(ys[i] - ys[i - 1], xs[i] - xs[i - 1])};
	}};
};

/**
 * Returns the polyline for the given path data with absolute move, line,
 * quadratic and cubic commands as painted by mxSvgCanvas2D, or null for
 * other commands. Curves are split into segments.
 */
ForceExplorer.flattenPath = function(d)
{
	var tokens = (d != null) ? d.match(/[A-Za-z]|-?[0-9.]+(?:e-?[0-9]+)?/g) : null;
	var xs = [];
	var ys = [];
	var i = 0;
	var num = function()
	{
		return parseFloat(tokens[i++]);
	};

	while (tokens != null && i < tokens.length)
	{
		var cmd = tokens[i++];
		var x0 = xs[xs.length - 1];
		var y0 = ys[ys.length - 1];

		if ((cmd == 'M' && xs.length == 0) || cmd == 'L')
		{
			xs.push(num());
			ys.push(num());
		}
		else if ((cmd == 'Q' || cmd == 'C') && xs.length > 0)
		{
			var c = [num(), num(), num(), num()];

			if (cmd == 'C')
			{
				c.push(num(), num());
			}

			var n = (cmd == 'C') ? 12 : 8;

			for (var j = 1; j <= n; j++)
			{
				var t = j / n;
				var u = 1 - t;

				if (cmd == 'Q')
				{
					xs.push(u * u * x0 + 2 * u * t * c[0] + t * t * c[2]);
					ys.push(u * u * y0 + 2 * u * t * c[1] + t * t * c[3]);
				}
				else
				{
					xs.push(u * u * u * x0 + 3 * u * u * t * c[0] + 3 * u * t * t * c[2] + t * t * t * c[4]);
					ys.push(u * u * u * y0 + 3 * u * u * t * c[1] + 3 * u * t * t * c[3] + t * t * t * c[5]);
				}
			}
		}
		else
		{
			return null;
		}

		if (isNaN(xs[xs.length - 1]) || isNaN(ys[ys.length - 1]))
		{
			return null;
		}
	}

	return (xs.length > 1) ? ForceExplorer.createPolyline(xs, ys) : null;
};

/**
 * Returns the length of the painted line of the given link and a function
 * that returns the point and the angle for a distance along the line, in the
 * units of the draw pane. Straight lines use the points of the state and
 * curves the data of the path, which is much faster than measuring the path.
 */
ForceExplorer.prototype.getLineGeometry = function(link, path)
{
	var view = this.graph.view;
	var state = view.getState(link.cell);
	var pts = (state != null) ? state.absolutePoints : null;

	if (pts != null && pts.length > 1 && mxUtils.getValue(state.style, 'curved', '0') != '1')
	{
		var mc = view.modelCoordinates;
		var s = view.scale;
		var tr = view.translate;
		var xs = [];
		var ys = [];

		for (var i = 0; i < pts.length; i++)
		{
			if (pts[i] == null)
			{
				return null;
			}

			xs.push((mc) ? pts[i].x / s - tr.x : pts[i].x);
			ys.push((mc) ? pts[i].y / s - tr.y : pts[i].y);
		}

		return ForceExplorer.createPolyline(xs, ys);
	}

	var d = path.getAttribute('d');

	if (link.pathData != d)
	{
		link.pathData = d;
		link.line = ForceExplorer.flattenPath(d);
	}

	if (link.line != null)
	{
		return link.line;
	}
	else
	{
		if (link.path != path)
		{
			link.path = path;
			link.length = path.getTotalLength();
		}

		return {length: link.length, pointAt: function(d)
		{
			var p = path.getPointAtLength(d);
			var q = path.getPointAtLength(Math.min(link.length, d + 1));

			return {x: p.x, y: p.y, angle: Math.atan2(q.y - p.y, q.x - p.x)};
		}};
	}
};

/**
 * Moves the arrows along the connectors. Returns true if there are
 * arrows.
 */
ForceExplorer.prototype.updateBullets = function(t)
{
	var view = this.graph.view;
	var pane = view.getDrawPane();

	if (this.bulletLayer == null)
	{
		this.bulletLayer = document.createElementNS(mxConstants.NS_SVG, 'g');
		this.bulletLayer.setAttribute('pointer-events', 'none');
	}

	// Arrows are above all cells and only run between the cells
	if (this.bulletLayer.parentNode != pane || this.bulletLayer.nextSibling != null)
	{
		pane.appendChild(this.bulletLayer);
	}

	var s = (view.modelCoordinates) ? 1 : view.scale;
	var spacing = this.bulletSpacing * s;
	var margin = this.bulletMargin * s;
	var offset = (this.reducedMotion) ? null : t / 1000 * this.bulletSpeed * s;
	var budget = this.maxTotalBullets;
	var dark = Editor.isDarkMode();
	var result = false;

	for (var i = 0; i < this.links.length; i++)
	{
		var link = this.links[i];
		var count = 0;

		if (!link.more && link.source.leaving == null && link.target.leaving == null &&
			link.source.born == null && link.target.born == null)
		{
			var path = this.getLinePath(link);
			var line = (path != null) ? this.getLineGeometry(link, path) : null;

			if (line != null)
			{
				// The stroke attribute is only the light color, the style has
				// the light-dark color, eg. with a var() for the default color.
				// The paths are new in each frame, so the computed color is
				// only updated if the stroke or the color scheme changes.
				var stroke = (path.style.stroke || path.getAttribute('stroke')) +
					((dark) ? ' dark' : '');

				if (link.colorStroke != stroke)
				{
					link.colorStroke = stroke;
					var color = window.getComputedStyle(path).stroke;
					link.color = (Graph.isSafeCssColor(color)) ? color : '#808080';
				}

				var usable = line.length - 2 * margin;

				if (usable > margin)
				{
					var opacity = link.dim * Math.min(this.getNodeOpacity(link.source),
						this.getNodeOpacity(link.target));
					var labels = link.labels;
					var center = line.length / 2;
					var half = 0;

					// The arrows fade out behind the label in the middle
					if (labels != null && labels.width > 0)
					{
						var angle = line.pointAt(center).angle;
						half = (Math.abs(Math.cos(angle)) * labels.width +
							Math.abs(Math.sin(angle)) * labels.height) / 2 * s;
					}
					count = Math.min(budget, (offset == null) ? 1 : Math.min(this.maxBullets,
						Math.max(1, Math.round(usable / spacing))));
					budget -= count;
					var step = usable / Math.max(1, count);

					// Without motion the arrow is in the middle, or after the label if
					// there is space
					var after = (offset == null && half > 0 && usable + margin -
						center - half > 2 * margin);
					var phase = (offset != null) ? offset % step : ((after) ?
						(center + half + usable + margin) / 2 - margin : usable / 2);

					for (var j = 0; j < count; j++)
					{
						var d = margin + phase + j * step;
						var p = line.pointAt(d);
						var fade = (offset == null) ? 1 : Math.min(1, (d - margin) /
							(2 * margin), (usable + margin - d) / (2 * margin));

						if (half > 0 && (offset != null || after))
						{
							fade = Math.min(fade, (Math.abs(d - center) - half) / margin);
						}

						var elt = link.bullets[j];

						if (elt == null)
						{
							elt = document.createElementNS(mxConstants.NS_SVG, 'path');
							elt.setAttribute('d', 'M -8 -5 L 8 0 L -8 5 L -5 0 Z');
							this.bulletLayer.appendChild(elt);
							link.bullets.push(elt);
						}

						elt.setAttribute('fill', link.color);
						elt.setAttribute('fill-opacity', Math.max(0, fade * opacity));
						elt.setAttribute('transform', 'translate(' + p.x + ',' + p.y +
							') rotate(' + (p.angle * 180 / Math.PI) + ')' +
							((s != 1) ? ' scale(' + s + ')' : ''));
					}

					result = true;
				}
			}
		}

		this.removeBullets(link, count);
	}

	return result;
};

/**
 * Removes the arrows of the given link after the given count.
 */
ForceExplorer.prototype.removeBullets = function(link, count)
{
	while (link.bullets.length > count)
	{
		var elt = link.bullets.pop();

		if (elt.parentNode != null)
		{
			elt.parentNode.removeChild(elt);
		}
	}
};

/**
 * Resets the frame statistics.
 */
ForceExplorer.prototype.resetStats = function()
{
	this.frames = [];
	this.lastFrameTime = null;
};

/**
 * Records the timings of a frame.
 */
ForceExplorer.prototype.recordFrame = function(time, t0, t1, t2, t3, active)
{
	if (this.frames.length < 10000)
	{
		this.frames.push({interval: (this.lastFrameTime != null) ?
			time - this.lastFrameTime : null, tick: t1 - t0,
			render: t2 - t1, bullets: t3 - t2, total: t3 - t0,
			active: active, nodes: this.nodes.length, links: this.links.length});
	}

	this.lastFrameTime = time;
};

/**
 * Returns the average and 95th percentile of the recorded frames.
 */
ForceExplorer.prototype.getStats = function()
{
	var result = {frames: this.frames.length};
	var keys = ['interval', 'tick', 'render', 'bullets', 'total'];

	for (var i = 0; i < keys.length; i++)
	{
		var values = [];

		for (var j = 0; j < this.frames.length; j++)
		{
			if (this.frames[j][keys[i]] != null)
			{
				values.push(this.frames[j][keys[i]]);
			}
		}

		values.sort(mxUtils.compareNumbers);
		var sum = 0;

		for (var j = 0; j < values.length; j++)
		{
			sum += values[j];
		}

		result[keys[i]] = {avg: (values.length > 0) ? sum / values.length : null,
			p95: (values.length > 0) ? values[Math.min(values.length - 1,
				Math.floor(values.length * 0.95))] : null};
	}

	return result;
};

/**
 * Closes the explorer.
 */
ForceExplorer.prototype.destroy = function()
{
	if (this.graph != null)
	{
		if (this.frameThread != null)
		{
			window.cancelAnimationFrame(this.frameThread);
			this.frameThread = null;
		}

		this.container.removeEventListener('wheel', this.wheelHandler);
		this.container.removeEventListener('touchstart', this.touchStartHandler, true);
		this.container.removeEventListener('touchmove', this.touchHandler, true);
		this.container.removeEventListener('touchend', this.touchHandler, true);
		this.container.removeEventListener('touchcancel', this.touchHandler, true);
		this.removeTouchTargets();

		if (this.resizeObserver != null)
		{
			this.resizeObserver.disconnect();
			this.resizeObserver = null;
		}

		window.removeEventListener('keydown', this.keyHandler, true);
		mxEvent.removeListener(document, 'visibilitychange', this.visibilityHandler);

		// Gives the focus back if it was in the explorer
		var active = document.activeElement;

		if (active == null || active == document.body || this.container.contains(active))
		{
			ForceExplorer.restoreFocus(this.previousFocus);
		}

		if (ForceExplorer.active == this)
		{
			ForceExplorer.active = null;
		}

		ForceExplorer.fireChange();

		// The editor gets the input while the frame zooms into the focused cell.
		// The shapes still get mouse events (their pointer-events attribute
		// overrides the style of the container), so the handlers are removed,
		// also the redirect of a touch that ends after the graph is destroyed.
		var graph = this.graph;
		var container = this.container;
		container.style.pointerEvents = 'none';
		graph.removeMouseListener(this.mouseListener);
		graph.removeEventSourceRedirect();
		graph.dblClick = function() {};
		this.graph = null;

		this.animateFrame(false, this.focusSource, function()
		{
			graph.destroy();

			if (container.parentNode != null)
			{
				container.parentNode.removeChild(container);
			}
		});
	}
};

/**
 * Icon of the explore button in presentation mode.
 */
Editor.exploreImage = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDI0IDI0IiB3aWR0aD0iMjRweCIgZmlsbD0iIzAwMDAwMCI+PHBhdGggZD0iTTYuNiA2LjZMMTAgMTBNMTcuNCA2LjZMMTQgMTBNMTIgMTV2MyIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2Utd2lkdGg9IjEuNiIgZmlsbD0ibm9uZSIvPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjMiLz48Y2lyY2xlIGN4PSI1IiBjeT0iNSIgcj0iMi4yIi8+PGNpcmNsZSBjeD0iMTkiIGN5PSI1IiByPSIyLjIiLz48Y2lyY2xlIGN4PSIxMiIgY3k9IjIwIiByPSIyLjIiLz48L3N2Zz4=';

/**
 * Opens the explorer for the given options of the #create hash: page (ID of
 * the page), cell (ID of the vertex, default is the vertex with the most
 * connections), depth, maxNodes and maxChildren. The values are untrusted.
 * The explorer is the initial view, so it opens without a transition.
 */
EditorUi.prototype.openExplorer = function(options)
{
	options = (options != null && typeof options === 'object') ? options : {};

	if (options.page != null && this.pages != null)
	{
		var page = this.getPageById(String(options.page));

		if (page != null && page != this.currentPage)
		{
			this.selectPage(page);
		}
	}

	var graph = this.editor.graph;
	var cell = (options.cell != null) ? graph.model.getCell(String(options.cell)) : null;
	cell = this.getExploreCell((cell instanceof mxCell) ? cell : null, true);

	return (cell != null) ? Graph.exploreFromCell(graph, cell, {depth: options.depth,
		maxNodes: options.maxNodes, maxChildren: options.maxChildren,
		instant: true}) : null;
};

/**
 * Returns the given cell, or the source of the given connector, if it can be
 * explored. Otherwise returns the vertex of the current page with the most
 * connections if fallback is true, or null if there is none.
 */
EditorUi.prototype.getExploreCell = function(cell, fallback)
{
	var graph = this.editor.graph;
	var model = graph.model;

	if (model.isEdge(cell))
	{
		cell = model.getTerminal(cell, true);
	}

	if (cell == null || !model.contains(cell) ||
		ForceExplorer.getConnectionCount(graph, cell) == 0)
	{
		cell = null;

		if (fallback)
		{
			var cells = model.getDescendants(model.getRoot());
			var max = 0;

			for (var i = 0; i < cells.length; i++)
			{
				var count = ForceExplorer.getConnectionCount(graph, cells[i]);

				if (count > max)
				{
					cell = cells[i];
					max = count;
				}
			}
		}
	}

	return cell;
};

/**
 * Opens the force-directed explorer instead of the classic Explore view for
 * the explore action, custom link actions and plugins, unless forceExplore is
 * false in the configuration or classic is true in the given options (custom
 * link actions). Opens the explorer for the given cell, or the source of the
 * given connector, if it has connections. The options of custom links are
 * untrusted, the explorer only uses depth, maxNodes, maxChildren and instant.
 */
(function()
{
	var graphExploreFromCell = Graph.exploreFromCell;

	Graph.exploreFromCell = function(sourceGraph, cell, config)
	{
		var result = null;

		// Opening the explorer is own input and ends the follow of a
		// presenter. The follow opens it without this function (see
		// EditorUi.applySharedViewMode).
		ForceExplorer.fireInput();

		if (!Editor.forceExplore || (config != null && config.classic === true))
		{
			result = graphExploreFromCell.apply(this, arguments);
		}
		else
		{
			if (sourceGraph.model.isEdge(cell))
			{
				cell = sourceGraph.model.getTerminal(cell, true);
			}

			config = (config != null && typeof config === 'object') ? config : {};

			if (cell != null && ForceExplorer.getConnectionCount(sourceGraph, cell) > 0)
			{
				result = new ForceExplorer(sourceGraph, cell, {depth: config.depth,
					maxNodes: config.maxNodes, maxChildren: config.maxChildren,
					instant: config.instant});
			}
		}

		return result;
	};

	var actionsInit = Actions.prototype.init;

	Actions.prototype.init = function()
	{
		actionsInit.apply(this, arguments);
		var ui = this.editorUi;
		var graph = ui.editor.graph;

		// Publish menu: explores the selected shape or the shape with the
		// most connections, disabled if no shape has connections
		var exploreMode = this.put('exploreMode', new Action(
			mxResources.get('explore') + '...', function()
		{
			var cell = ui.getExploreCell(graph.getSelectionCell(), true);

			if (cell != null)
			{
				Graph.exploreFromCell(graph, cell);
			}
		}));

		exploreMode.isEnabled = function()
		{
			return Action.prototype.isEnabled.apply(this, arguments) &&
				ui.getExploreCell(graph.getSelectionCell(), true) != null;
		};

		// Arrange panel: explores the selected shape, disabled if it has no
		// connections
		var explore = this.addAction('explore', function()
		{
			var cell = ui.getExploreCell(graph.getSelectionCell());

			if (cell != null)
			{
				Graph.exploreFromCell(graph, cell);
			}
		});

		explore.isEnabled = function()
		{
			return Action.prototype.isEnabled.apply(this, arguments) &&
				ui.getExploreCell(graph.getSelectionCell()) != null;
		};
	};
})();
