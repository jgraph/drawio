/**
 * Copyright (c) 2006-2026, JGraph Holdings Ltd
 * Copyright (c) 2006-2026, draw.io AG
 */
/**
 * Spring move: a round handle on the selected shapes if one of them has
 * connections. Dragging the handle moves the selected shapes and their
 * connected shapes (two hops, Shift: one hop) follow on springs. Shapes beyond
 * the hops and locked shapes are anchors, other shapes are obstacles. After
 * the release the springs come to rest at once, the shapes move to their rest
 * positions and the result is applied in one undoable edit. Esc cancels.
 * Hover icons and selection borders are hidden until then.
 *
 * The preview does not change the model: the states of the moving shapes
 * are moved, their painted nodes are translated and only the connectors are
 * repainted. Waypoints follow their terminals (see getFollowedPreviewPoints).
 *
 * In extensions.min.js. The handle is added by SpringHandle.js.
 */
/**
 * Starts a spring move of the given sibling cells of the graph of the given
 * editor UI for the given pointer event (see SpringMove.getCells).
 */
function SpringMove(ui, cells, evt)
{
	this.ui = ui;
	this.graph = ui.editor.graph;
	this.cells = cells;
	this.maxHops = (mxEvent.isShiftDown(evt)) ? 1 : 2;
	this.frames = [];
	this.alpha = 1;
	this.ticks = 0;
	this.frameThread = null;
	this.frameHandler = mxUtils.bind(this, this.frame);
	this.init(evt);
};

/**
 * Physics parameters in model units per frame. The springs pull like the
 * links of the explorer (see ForceExplorer.tick), so the speed of the
 * selected shapes carries over to the connected shapes.
 */
SpringMove.prototype.springStrength = 0.3;
SpringMove.prototype.homeStrength = 0.03;

/**
 * Share of the movement of the dragged shape that the shapes follow in all
 * directions, by the number of connections from the dragged shape. The
 * springs only pull along the connectors.
 */
SpringMove.prototype.moveAlong = [1, 0.4, 0.2];
SpringMove.prototype.friction = 0.3;
SpringMove.prototype.maxSpeed = 60;
SpringMove.prototype.collidePadding = 10;
SpringMove.prototype.collideStrength = 0.5;
SpringMove.prototype.alphaDecay = 0.95;
SpringMove.prototype.maxSettleTicks = 200;

/**
 * Duration in milliseconds of the movement to the rest positions after the
 * release (see startSettle).
 */
SpringMove.prototype.settleDuration = 180;

/**
 * Minimum time in milliseconds between the routes of the connectors with
 * automatic routing during the drag, the duration of a route up to which the
 * connectors are also routed while the pointer moves (else only when it
 * rests for routeInterval), and the duration after which they are only
 * routed after the release (see updateRoutes).
 */
SpringMove.prototype.routeInterval = 100;
SpringMove.prototype.movingRouteTime = 12;
SpringMove.prototype.maxRouteTime = 120;
SpringMove.prototype.maxMovers = 80;
SpringMove.prototype.obstacleMargin = 400;
SpringMove.prototype.maxObstacles = 500;

/**
 * Returns the selected vertices of the given graph for a spring move, or
 * null if they do not have the same parent, are not movable, are more than
 * maxMovers or none of them has connections.
 */
SpringMove.getCells = function(graph)
{
	var model = graph.model;
	var cells = graph.getSelectionCells();
	var result = [];
	var parent = null;
	var connected = false;

	for (var i = 0; i < cells.length; i++)
	{
		if (model.isVertex(cells[i]))
		{
			var geo = model.getGeometry(cells[i]);
			var p = model.getParent(cells[i]);

			if (geo == null || geo.relative || (parent != null && p != parent) ||
				model.isEdge(p) || !graph.isCellMovable(cells[i]) ||
				result.length >= SpringMove.prototype.maxMovers)
			{
				return null;
			}

			parent = p;
			connected = connected || model.getEdgeCount(cells[i]) > 0;
			result.push(cells[i]);
		}
	}

	return (connected) ? result : null;
};

/**
 * Collects the moving shapes, anchors, obstacles and springs and starts
 * the gesture.
 */
SpringMove.prototype.init = function(evt)
{
	var graph = this.graph;
	var model = graph.model;
	this.parent = model.getParent(this.cells[0]);
	this.nodes = [];
	this.byCell = new mxDictionary();

	// Moving shapes up to maxHops connections away, anchors behind them (at
	// most maxObstacles)
	var hops = new mxDictionary();
	var queue = [];
	var anchors = 0;

	for (var i = 0; i < this.cells.length; i++)
	{
		hops.put(this.cells[i], 0);
		this.addNode(this.cells[i], true, 0).dragged = true;
		queue.push(this.cells[i]);
	}

	while (queue.length > 0)
	{
		var cell = queue.shift();
		var hop = hops.get(cell);
		var edges = model.getEdges(cell);

		for (var i = 0; i < edges.length; i++)
		{
			var opposite = this.getOpposite(edges[i], cell);

			if (opposite != null && hops.get(opposite) == null)
			{
				hops.put(opposite, hop + 1);

				if (hop + 1 <= this.maxHops && graph.isCellMovable(opposite) &&
					this.nodes.length < this.maxMovers)
				{
					this.addNode(opposite, true, hop + 1);
					queue.push(opposite);
				}
				else if (anchors < this.maxObstacles)
				{
					this.addNode(opposite, false, hop + 1);
					anchors++;
				}
			}
		}
	}

	// Springs along the connectors between the shapes, with the current
	// distance as the rest length
	this.links = [];
	var linked = Object.create(null);

	for (var i = 0; i < this.nodes.length; i++)
	{
		var edges = model.getEdges(this.nodes[i].cell);

		for (var j = 0; j < edges.length; j++)
		{
			var opposite = this.getOpposite(edges[j], this.nodes[i].cell);
			var other = (opposite != null) ? this.byCell.get(opposite) : null;

			if (other != null && (this.nodes[i].mover || other.mover))
			{
				var key = Math.min(this.nodes[i].id, other.id) + '_' +
					Math.max(this.nodes[i].id, other.id);

				if (linked[key] == null)
				{
					linked[key] = true;
					var dx = other.x0 + other.w / 2 - this.nodes[i].x0 - this.nodes[i].w / 2;
					var dy = other.y0 + other.h / 2 - this.nodes[i].y0 - this.nodes[i].h / 2;
					this.links.push({a: this.nodes[i], b: other,
						length: Math.sqrt(dx * dx + dy * dy)});
					this.nodes[i].degree++;
					other.degree++;
				}
			}
		}
	}

	this.addObstacles();
	this.initCollisions();
	this.initStates();
	this.initRouting();

	// Start point and movement of the selected shapes in the coordinates
	// of the parent
	var pt = this.getPoint(evt);
	this.startX = pt.x;
	this.startY = pt.y;
	this.dx = 0;
	this.dy = 0;

	graph.springMove = this;
	graph.graphHandler.setHandlesVisibleForCells(graph.getSelectionCells(), false, true);
	this.setSelectionBorderVisible(false);

	if (this.ui.hoverIcons != null)
	{
		this.ui.hoverIcons.reset();
	}

	// Like for a move of the selection (see EditorUi)
	if (this.ui.inlineToolbar != null)
	{
		this.ui.inlineToolbar.hide();
	}

	// Connection points of the shape under the handle
	if (graph.connectionHandler.constraintHandler != null)
	{
		graph.connectionHandler.constraintHandler.reset();
	}

	this.installListeners();
	this.phase = 'drag';
	this.schedule();
};

/**
 * Returns the other end of the given connector if it is a visible sibling
 * shape of the selected shapes.
 */
SpringMove.prototype.getOpposite = function(edge, cell)
{
	var graph = this.graph;
	var model = graph.model;
	var s = model.getTerminal(edge, true);
	var opposite = (s == cell) ? model.getTerminal(edge, false) : s;
	var geo = model.getGeometry(opposite);

	return (graph.isCellVisible(edge) && opposite != null && opposite != cell &&
		model.isVertex(opposite) && model.getParent(opposite) == this.parent &&
		graph.isCellVisible(opposite) && geo != null && !geo.relative) ? opposite : null;
};

/**
 * Adds a node for the given cell, which is the given number of connections
 * away from the selected shapes. Movers move, all others are fixed.
 */
SpringMove.prototype.addNode = function(cell, mover, hop)
{
	var geo = this.graph.model.getGeometry(cell);
	var node = {id: this.nodes.length, cell: cell, mover: mover, hop: hop,
		x0: geo.x, y0: geo.y, x: geo.x, y: geo.y, w: geo.width, h: geo.height,
		vx: 0, vy: 0, degree: 0};
	this.nodes.push(node);
	this.byCell.put(cell, node);

	return node;
};

/**
 * Adds the sibling shapes around the moving shapes as fixed obstacles.
 */
SpringMove.prototype.addObstacles = function()
{
	var model = this.graph.model;
	var bounds = null;

	for (var i = 0; i < this.nodes.length; i++)
	{
		var n = this.nodes[i];
		var rect = new mxRectangle(n.x0, n.y0, n.w, n.h);

		if (bounds == null)
		{
			bounds = rect;
		}
		else
		{
			bounds.add(rect);
		}
	}

	bounds.grow(this.obstacleMargin);
	var count = 0;

	for (var i = 0; i < model.getChildCount(this.parent) && count < this.maxObstacles; i++)
	{
		var child = model.getChildAt(this.parent, i);
		var geo = model.getGeometry(child);

		if (model.isVertex(child) && this.byCell.get(child) == null && geo != null &&
			!geo.relative && this.graph.isCellVisible(child) &&
			mxUtils.intersects(bounds, new mxRectangle(geo.x, geo.y, geo.width, geo.height)))
		{
			this.addNode(child, false, null).obstacle = true;
			count++;
		}
	}
};

/**
 * Exempts the pairs that overlap at the start from collisions, eg. shapes
 * on top of a background rectangle.
 */
SpringMove.prototype.initCollisions = function()
{
	var n = this.nodes.length;
	this.exempt = new Uint8Array(n * n);

	for (var i = 0; i < n; i++)
	{
		if (this.nodes[i].mover)
		{
			for (var j = 0; j < n; j++)
			{
				if (i != j && this.overlaps(this.nodes[i], this.nodes[j], 0))
				{
					this.exempt[i * n + j] = 1;
					this.exempt[j * n + i] = 1;
				}
			}
		}
	}
};

/**
 * Returns true if the given nodes overlap with the given padding.
 */
SpringMove.prototype.overlaps = function(a, b, pad)
{
	return Math.abs(a.x + a.w / 2 - b.x - b.w / 2) < (a.w + b.w) / 2 + pad &&
		Math.abs(a.y + a.h / 2 - b.y - b.h / 2) < (a.h + b.h) / 2 + pad;
};

/**
 * Records the states of the moving shapes and their descendants and
 * their painted positions, and the connectors to repaint.
 */
SpringMove.prototype.initStates = function()
{
	var view = this.graph.view;
	var model = this.graph.model;
	var edges = new mxDictionary();
	this.edges = [];
	this.hooked = [];

	for (var i = 0; i < this.nodes.length; i++)
	{
		var n = this.nodes[i];

		if (n.mover)
		{
			var cells = model.getDescendants(n.cell);
			n.entries = [];

			for (var j = 0; j < cells.length; j++)
			{
				var state = view.getState(cells[j]);

				if (model.isVertex(cells[j]))
				{
					if (state != null)
					{
						var pt = this.getModelPosition(state);
						n.entries.push({cell: cells[j], x: pt.x, y: pt.y,
							ox: state.origin.x, oy: state.origin.y});
						this.hookShape(state, state.shape);
						this.hookShape(state, state.text);
						this.hookShape(state, state.control);
					}

					for (var k = 0; k < model.getEdgeCount(cells[j]); k++)
					{
						var edge = model.getEdgeAt(cells[j], k);

						if (!edges.get(edge))
						{
							edges.put(edge, true);
							this.edges.push(edge);
						}
					}
				}
				else if (model.isEdge(cells[j]) && !edges.get(cells[j]))
				{
					edges.put(cells[j], true);
					this.edges.push(cells[j]);
				}
			}
		}
	}

	// Moving nodes that each connector depends on: its terminals and the
	// moving node that contains it
	this.edgeNodes = [];

	for (var i = 0; i < this.edges.length; i++)
	{
		var nodes = [];
		var cells = [model.getTerminal(this.edges[i], true),
			model.getTerminal(this.edges[i], false), this.edges[i]];

		for (var j = 0; j < cells.length; j++)
		{
			var node = this.getMovingAncestor(cells[j]);

			if (node != null && mxUtils.indexOf(nodes, node) < 0)
			{
				nodes.push(node);
			}
		}

		this.edgeNodes.push(nodes);
	}

	// Connectors with waypoints follow their terminals in the preview
	this.followed = [];

	for (var i = 0; i < this.edges.length; i++)
	{
		var geo = model.getGeometry(this.edges[i]);

		if (geo != null && geo.points != null && geo.points.length > 0)
		{
			this.followed.push(this.edges[i]);
		}
	}
};

/**
 * Collects the obstacles and the routes of the connectors with automatic
 * routing for the preview if the routing is loaded (see
 * LibavoidRouting.routeMovedEdges), while the view states are at the
 * positions of the model. The functions are checked as the routing comes
 * with the extensions, which can be older.
 */
SpringMove.prototype.initRouting = function()
{
	var graph = this.graph;
	this.routes = null;

	if (typeof LibavoidRouting !== 'undefined' && window.Avoid != null &&
		LibavoidRouting.routeMovedEdges != null)
	{
		for (var i = 0; i < this.edges.length && this.routes == null; i++)
		{
			if (LibavoidRouting.isAutoEdge(graph, this.edges[i]))
			{
				this.routes = Object.create(null);
				this.routeVertices = LibavoidRouting.collectVertices(graph);
				this.routeEdgeBounds = LibavoidRouting.getAutoEdgeBounds(graph);
				this.routeTime = 0;
				this.routeCost = 0;
				this.routeKey = null;
			}
		}
	}
};

/**
 * Returns the offset {x, y} of the given cell, which is the movement of its
 * moving ancestor at the current or snapped rest position, or null if it does
 * not move.
 */
SpringMove.prototype.getOffset = function(cell, rest)
{
	var node = this.getMovingAncestor(cell);
	var result = null;

	if (node != null)
	{
		var dx = (rest) ? this.snapDelta(node.tx - node.x0, this.lastEvent) : node.x - node.x0;
		var dy = (rest) ? this.snapDelta(node.ty - node.y0, this.lastEvent) : node.y - node.y0;

		if (dx != 0 || dy != 0)
		{
			result = {x: dx, y: dy};
		}
	}

	return result;
};

/**
 * Routes the connectors with automatic routing that the commit routes, for
 * the current or the snapped rest positions, and repaints the connectors
 * whose routes changed. The routes stop during the drag if they take longer
 * than maxRouteTime.
 */
SpringMove.prototype.updateRoutes = function(rest)
{
	var graph = this.graph;
	var model = graph.model;
	var offset = mxUtils.bind(this, function(cell)
	{
		return this.getOffset(cell, rest);
	});

	// Skips the routes if nothing moved since the last routes
	var cells = [];
	var key = [];

	for (var i = 0; i < this.nodes.length; i++)
	{
		var o = (this.nodes[i].mover) ? offset(this.nodes[i].cell) : null;

		if (o != null)
		{
			cells.push(this.nodes[i].cell);
			key.push(i, Math.round(o.x), Math.round(o.y));
		}
	}

	key = key.join(',');

	if (key != this.routeKey)
	{
		var t0 = performance.now();
		var routes = Object.create(null);

		try
		{
			var edges = LibavoidRouting.getMovedEdges(graph, cells, offset,
				this.routeEdgeBounds);
			var bends = LibavoidRouting.routeMovedEdges(graph, window.Avoid,
				this.routeVertices, edges, offset);

			for (var i = 0; i < edges.length; i++)
			{
				var id = edges[i].getId();

				if (bends[id] != null)
				{
					routes[id] = {edge: edges[i], points: bends[id],
						source: offset(model.getTerminal(edges[i], true)),
						target: offset(model.getTerminal(edges[i], false))};
				}
			}
		}
		catch (e)
		{
			routes = null;
		}

		this.routeKey = key;
		this.routeCost = performance.now() - t0;
		this.setRoutes((routes != null && (rest || this.routeCost <= this.maxRouteTime)) ?
			routes : null);
	}
};

/**
 * Sets the given routes, or none, and repaints the connectors whose routes
 * changed in the next render.
 */
SpringMove.prototype.setRoutes = function(routes)
{
	var repaint = this.repaintEdges || [];

	for (var id in this.routes)
	{
		repaint.push(this.routes[id].edge);
	}

	for (var id in routes)
	{
		repaint.push(routes[id].edge);
	}

	this.repaintEdges = repaint;
	this.routes = routes;
};

/**
 * Adds the bends of the routes to the given waypoints of the preview (see
 * Graph.getFollowedPreviewPoints). The bends move with the terminals until
 * the next route.
 */
SpringMove.prototype.addRoutePoints = function(points)
{
	var graph = this.graph;
	var model = graph.model;

	for (var id in this.routes)
	{
		var r = this.routes[id];
		var shift = this.getRouteShift(r);
		var off = LibavoidRouting.getAbsoluteParentOffset(graph, r.edge);
		var po = this.getOffset(model.getParent(r.edge), false) || {x: 0, y: 0};
		var pts = [];

		for (var i = 0; i < r.points.length; i++)
		{
			pts.push(new mxPoint(r.points[i].x + shift.x - off.x - po.x,
				r.points[i].y + shift.y - off.y - po.y));
		}

		points.put(r.edge, pts);
	}
};

/**
 * Returns the mean movement of the terminals of the given route since it was
 * computed.
 */
SpringMove.prototype.getRouteShift = function(route)
{
	var model = this.graph.model;
	var result = {x: 0, y: 0};
	var count = 0;

	for (var i = 0; i < 2; i++)
	{
		var terminal = model.getTerminal(route.edge, i == 0);

		if (terminal != null)
		{
			var now = this.getOffset(terminal, false) || {x: 0, y: 0};
			var then = ((i == 0) ? route.source : route.target) || {x: 0, y: 0};
			result.x += now.x - then.x;
			result.y += now.y - then.y;
			count++;
		}
	}

	if (count > 1)
	{
		result.x /= count;
		result.y /= count;
	}

	return result;
};

/**
 * Moves the states of the moving shapes back to the positions of the model
 * without repainting them, eg. for the routing in the commit, which uses the
 * labels of the states.
 */
SpringMove.prototype.resetStates = function()
{
	var view = this.graph.view;
	var s = view.scale;
	var tr = view.translate;

	for (var i = 0; i < this.nodes.length; i++)
	{
		var n = this.nodes[i];

		for (var j = 0; n.mover && j < n.entries.length; j++)
		{
			var e = n.entries[j];
			var state = view.getState(e.cell);

			if (state != null && !state.invalid)
			{
				state.x = (e.x + tr.x) * s;
				state.y = (e.y + tr.y) * s;
				state.origin.x = e.ox;
				state.origin.y = e.oy;
				state.updateCachedBounds();
			}
		}
	}
};

/**
 * Returns the moving node of the given cell or its ancestors.
 */
SpringMove.prototype.getMovingAncestor = function(cell)
{
	var model = this.graph.model;

	while (cell != null)
	{
		var node = this.byCell.get(cell);

		if (node != null && node.mover)
		{
			return node;
		}

		cell = model.getParent(cell);
	}

	return null;
};

/**
 * Returns the absolute position of the given state in model units.
 */
SpringMove.prototype.getModelPosition = function(state)
{
	var view = this.graph.view;

	return new mxPoint(state.x / view.scale - view.translate.x,
		state.y / view.scale - view.translate.y);
};

/**
 * Records the painted position of the given shape of the given state,
 * which is the origin of its translate, also after a repaint.
 */
SpringMove.prototype.hookShape = function(state, shape)
{
	if (shape != null && shape.node != null && shape.springPainted == null)
	{
		var move = this;
		var redraw = shape.redraw;
		shape.springPainted = this.getModelPosition(state);
		shape.springOwnRedraw = shape.hasOwnProperty('redraw') ? redraw : null;

		shape.redraw = function()
		{
			redraw.apply(this, arguments);
			this.springPainted = move.getModelPosition(state);
			move.dirty = true;
		};

		this.hooked.push(shape);
	}
};

/**
 * Restores the redraw of the hooked shapes.
 */
SpringMove.prototype.unhookShapes = function()
{
	for (var i = 0; i < this.hooked.length; i++)
	{
		var shape = this.hooked[i];

		if (shape.springOwnRedraw != null)
		{
			shape.redraw = shape.springOwnRedraw;
		}
		else
		{
			delete shape.redraw;
		}

		delete shape.springPainted;
		delete shape.springOwnRedraw;
	}

	this.hooked = [];
};

/**
 * Returns the point of the given event in the coordinates of the parent.
 */
SpringMove.prototype.getPoint = function(evt)
{
	var view = this.graph.view;
	var pt = mxUtils.convertPoint(this.graph.container,
		mxEvent.getClientX(evt), mxEvent.getClientY(evt));
	var pState = view.getState(this.parent);
	var origin = (pState != null) ? pState.origin : new mxPoint();

	return new mxPoint(pt.x / view.scale - view.translate.x - origin.x,
		pt.y / view.scale - view.translate.y - origin.y);
};

/**
 * Returns the given delta snapped to the grid if the grid is enabled for
 * the given event, or rounded.
 */
SpringMove.prototype.snapDelta = function(value, evt)
{
	return (this.graph.isGridEnabledEvent(evt)) ? this.graph.snap(value) : Math.round(value);
};

/**
 * Installs the pointer and keyboard listeners. Pointer events are handled
 * in the capture phase, so that the graph does not see them and shows no
 * hover effects until the springs have settled.
 */
SpringMove.prototype.installListeners = function()
{
	this.moveHandler = mxUtils.bind(this, function(evt)
	{
		if (this.phase == 'settle')
		{
			mxEvent.consume(evt);
		}
		else if (this.phase == 'drag')
		{
			var pt = this.getPoint(evt);
			this.dx = this.snapDelta(pt.x - this.startX, evt);
			this.dy = this.snapDelta(pt.y - this.startY, evt);
			this.moveTime = performance.now();

			for (var i = 0; i < this.cells.length; i++)
			{
				var node = this.nodes[i];
				node.x = node.x0 + this.dx;
				node.y = node.y0 + this.dy;
			}

			this.lastEvent = evt;
			this.schedule();
			mxEvent.consume(evt);
		}
	});

	this.upHandler = mxUtils.bind(this, function(evt)
	{
		if (this.phase == 'drag')
		{
			this.lastEvent = evt;
			this.startSettle();
			this.schedule();
			mxEvent.consume(evt);
		}
	});

	// A new gesture while the springs settle applies the current result
	this.downHandler = mxUtils.bind(this, function(evt)
	{
		if (this.phase == 'settle')
		{
			this.finish();
		}
	});

	this.keyHandler = mxUtils.bind(this, function(evt)
	{
		if (evt.keyCode == 27)
		{
			this.cancel();
			mxEvent.consume(evt);
		}
	});

	// Mouse and touch events, which the graph uses instead of pointer
	// events on some platforms (see mxClient.IS_POINTER)
	this.blockHandler = mxUtils.bind(this, function(evt)
	{
		if (this.phase != null)
		{
			mxEvent.consume(evt);
		}
	});

	// Changes of the model during the gesture, eg. from collaborators
	this.changeHandler = mxUtils.bind(this, function()
	{
		if (!this.committing)
		{
			this.cancel();
		}
	});

	window.addEventListener('pointermove', this.moveHandler, true);
	window.addEventListener('pointerup', this.upHandler, true);
	window.addEventListener('pointercancel', this.upHandler, true);
	window.addEventListener('pointerdown', this.downHandler, true);
	window.addEventListener('keydown', this.keyHandler, true);

	for (var i = 0; i < this.blockedEvents.length; i++)
	{
		window.addEventListener(this.blockedEvents[i], this.blockHandler,
			{capture: true, passive: false});
	}

	this.graph.model.addListener(mxEvent.CHANGE, this.changeHandler);
};

/**
 * Mouse and touch events that the graph does not see during the gesture.
 */
SpringMove.prototype.blockedEvents = ['mousemove', 'mouseup', 'touchmove', 'touchend'];

/**
 * Removes the listeners.
 */
SpringMove.prototype.removeListeners = function()
{
	window.removeEventListener('pointermove', this.moveHandler, true);
	window.removeEventListener('pointerup', this.upHandler, true);
	window.removeEventListener('pointercancel', this.upHandler, true);
	window.removeEventListener('pointerdown', this.downHandler, true);
	window.removeEventListener('keydown', this.keyHandler, true);

	for (var i = 0; i < this.blockedEvents.length; i++)
	{
		window.removeEventListener(this.blockedEvents[i], this.blockHandler, true);
	}

	this.graph.model.removeListener(this.changeHandler);
};

/**
 * Requests the next frame.
 */
SpringMove.prototype.schedule = function()
{
	if (this.frameThread == null && this.phase != null)
	{
		this.frameThread = window.requestAnimationFrame(this.frameHandler);
	}
};

/**
 * Runs one step of the simulation and paints it.
 */
SpringMove.prototype.frame = function(time)
{
	this.frameThread = null;

	if (this.phase != null)
	{
		var t0 = performance.now();
		var done = false;

		if (this.phase == 'settle')
		{
			done = this.updateSettle(t0);
		}
		else
		{
			this.tick();

			if (this.routes != null && t0 - this.routeTime >=
				Math.max(this.routeInterval, 3 * this.routeCost) &&
				(this.routeCost <= this.movingRouteTime || this.moveTime == null ||
				t0 - this.moveTime >= this.routeInterval))
			{
				this.routeTime = t0;
				this.updateRoutes(false);
			}
		}

		var t1 = performance.now();

		if (done)
		{
			this.finish();
		}
		else
		{
			this.render();
			this.schedule();
		}

		var t2 = performance.now();
		this.frames.push({interval: (this.lastTime != null) ? time - this.lastTime : null,
			tick: t1 - t0, render: t2 - t1, total: t2 - t0});
		this.lastTime = time;
	}
};

/**
 * Runs the springs to rest without painting and starts the movement of the
 * shapes from their current to their rest positions (see updateSettle).
 */
SpringMove.prototype.startSettle = function()
{
	var nodes = this.nodes;
	var start = [];

	for (var i = 0; i < nodes.length; i++)
	{
		start.push(nodes[i].x, nodes[i].y);
	}

	this.phase = 'settle';

	while (this.tick() && this.ticks < this.maxSettleTicks)
	{
		// Ticks until the shapes are at rest
	}

	for (var i = 0; i < nodes.length; i++)
	{
		var n = nodes[i];
		n.tx = n.x;
		n.ty = n.y;
		n.x = start[2 * i];
		n.y = start[2 * i + 1];
		n.sx = n.x;
		n.sy = n.y;
	}

	// The routes of the commit, which the connectors show while the shapes
	// move to the rest positions
	if (this.routes != null)
	{
		this.updateRoutes(true);
	}

	this.settleTime = null;
};

/**
 * Moves the shapes towards their rest positions with an ease-out for the
 * given time. Returns true if they arrived.
 */
SpringMove.prototype.updateSettle = function(t)
{
	if (this.settleTime == null)
	{
		this.settleTime = t;
	}

	var reduced = window.matchMedia != null &&
		window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	var k = (this.settleDuration > 0 && !reduced) ?
		Math.min(1, (t - this.settleTime) / this.settleDuration) : 1;
	var e = 1 - Math.pow(1 - k, 3);

	for (var i = 0; i < this.nodes.length; i++)
	{
		var n = this.nodes[i];
		n.x = n.sx + (n.tx - n.sx) * e;
		n.y = n.sy + (n.ty - n.sy) * e;
	}

	return k >= 1;
};

/**
 * Runs one step of the springs, the pull to the start positions and the
 * collisions. Returns true if a shape is still moving.
 */
SpringMove.prototype.tick = function()
{
	var nodes = this.nodes;

	if (this.phase == 'settle')
	{
		this.alpha *= this.alphaDecay;
		this.ticks++;
	}

	var alpha = this.alpha;

	// The velocity of the selected shapes is their movement since the last tick
	for (var i = 0; i < nodes.length; i++)
	{
		var n = nodes[i];

		if (n.dragged)
		{
			n.vx = (n.px != null) ? n.x - n.px : 0;
			n.vy = (n.py != null) ? n.y - n.py : 0;
			n.px = n.x;
			n.py = n.y;
		}
	}

	// Springs between the next positions, weaker for shapes with more
	// connections, like the links of the explorer
	for (var i = 0; i < this.links.length; i++)
	{
		var a = this.links[i].a;
		var b = this.links[i].b;
		var dx = b.x + b.vx + b.w / 2 - a.x - a.vx - a.w / 2;
		var dy = b.y + b.vy + b.h / 2 - a.y - a.vy - a.h / 2;
		var d = Math.sqrt(dx * dx + dy * dy) || 1e-6;
		var f = (d - this.links[i].length) / d * this.springStrength * alpha /
			Math.max(1, Math.min(a.degree, b.degree));
		var ma = this.isFree(a);
		var mb = this.isFree(b);
		var wa = (ma && mb) ? 0.5 : ((ma) ? 1 : 0);
		var wb = (ma && mb) ? 0.5 : ((mb) ? 1 : 0);
		a.vx += dx * f * wa;
		a.vy += dy * f * wa;
		b.vx -= dx * f * wb;
		b.vy -= dy * f * wb;
	}

	var maxV = 0;
	var dx = this.dx;
	var dy = this.dy;

	for (var i = 0; i < nodes.length; i++)
	{
		var n = nodes[i];

		if (this.isFree(n))
		{
			// Pulls to the start position moved by a share of the movement of
			// the selected shapes
			var f = this.moveAlong[n.hop] || 0;
			n.vx += (n.x0 + dx * f - n.x) * this.homeStrength * alpha;
			n.vy += (n.y0 + dy * f - n.y) * this.homeStrength * alpha;
			n.vx *= 1 - this.friction;
			n.vy *= 1 - this.friction;
			var v = Math.sqrt(n.vx * n.vx + n.vy * n.vy);

			if (v > this.maxSpeed)
			{
				n.vx *= this.maxSpeed / v;
				n.vy *= this.maxSpeed / v;
				v = this.maxSpeed;
			}

			n.x += n.vx;
			n.y += n.vy;
			maxV = Math.max(maxV, v);
		}
	}

	// Separates overlapping shapes along the axis of the smaller overlap
	var pad = this.collidePadding;
	var count = nodes.length;

	for (var i = 0; i < nodes.length; i++)
	{
		var a = nodes[i];

		if (a.mover)
		{
			for (var j = 0; j < nodes.length; j++)
			{
				var b = nodes[j];

				if (i != j && (!b.mover || j > i) && this.exempt[i * count + j] == 0)
				{
					var dx = b.x + b.w / 2 - a.x - a.w / 2;
					var dy = b.y + b.h / 2 - a.y - a.h / 2;
					var ox = (a.w + b.w) / 2 + pad - Math.abs(dx);
					var oy = (a.h + b.h) / 2 + pad - Math.abs(dy);

					if (ox > 0 && oy > 0)
					{
						var ma = this.isFree(a);
						var mb = this.isFree(b);
						var wa = (ma && mb) ? 0.5 : ((ma) ? 1 : 0);
						var wb = (ma && mb) ? 0.5 : ((mb) ? 1 : 0);

						if (ox < oy)
						{
							var s = ((dx < 0) ? -1 : 1) * ox * this.collideStrength;
							a.x -= s * wa;
							b.x += s * wb;
						}
						else
						{
							var s = ((dy < 0) ? -1 : 1) * oy * this.collideStrength;
							a.y -= s * wa;
							b.y += s * wb;
						}
					}
				}
			}
		}
	}

	return maxV > 0.05 || alpha > 0.05;
};

/**
 * Returns true if the given node is moved by the simulation.
 */
SpringMove.prototype.isFree = function(node)
{
	return node.mover && !node.dragged;
};

/**
 * Returns the geometry of the given cell for the given positions of the
 * nodes, or null if the cell does not move.
 */
SpringMove.prototype.getMovedGeometry = function(cell, positions)
{
	var node = this.byCell.get(cell);
	var geo = null;

	if (node != null && node.mover)
	{
		var pt = positions(node);

		if (pt.x != node.x0 || pt.y != node.y0)
		{
			geo = this.graph.model.getGeometry(cell).clone();
			geo.x = pt.x;
			geo.y = pt.y;
		}
	}

	return geo;
};

/**
 * Returns the followed waypoints of the connectors for the given positions
 * of the nodes (see Graph.getFollowedPreviewPoints).
 */
SpringMove.prototype.getFollowedPoints = function(positions)
{
	return (this.followed.length > 0) ? this.graph.getFollowedPreviewPoints(
		this.followed, mxUtils.bind(this, function(cell)
		{
			return this.getMovedGeometry(cell, positions);
		})) : null;
};

/**
 * Moves the states of the moving shapes without changing the model,
 * translates their painted nodes and repaints the connectors.
 */
SpringMove.prototype.render = function()
{
	var view = this.graph.view;
	var s = view.scale;
	var tr = view.translate;
	var all = this.dirty || this.lastScale != s || this.lastTx != tr.x || this.lastTy != tr.y;
	this.dirty = false;
	this.lastScale = s;
	this.lastTx = tr.x;
	this.lastTy = tr.y;

	for (var i = 0; i < this.nodes.length; i++)
	{
		var n = this.nodes[i];
		n.moved = n.mover && (all || n.x != n.rx || n.y != n.ry);

		if (n.moved)
		{
			n.rx = n.x;
			n.ry = n.y;
			var dx = n.x - n.x0;
			var dy = n.y - n.y0;

			for (var j = 0; j < n.entries.length; j++)
			{
				var e = n.entries[j];
				var state = view.getState(e.cell);

				if (state != null && !state.invalid)
				{
					state.x = (e.x + dx + tr.x) * s;
					state.y = (e.y + dy + tr.y) * s;
					state.origin.x = e.ox + dx;
					state.origin.y = e.oy + dy;
					state.updateCachedBounds();
					this.transformShape(state, state.shape);
					this.transformShape(state, state.text);
					this.transformShape(state, state.control);
				}
			}
		}
	}

	var points = this.getFollowedPoints(function(node)
	{
		return node;
	});

	if (this.routes != null)
	{
		points = (points != null) ? points : new mxDictionary();
		this.addRoutePoints(points);
	}

	view.followedPoints = points;

	try
	{
		var edges = this.repaintEdges || [];
		this.repaintEdges = null;

		for (var i = 0; i < this.edges.length; i++)
		{
			var moved = false;

			for (var j = 0; j < this.edgeNodes[i].length && !moved; j++)
			{
				moved = this.edgeNodes[i][j].moved;
			}

			if (moved)
			{
				edges.push(this.edges[i]);
			}
		}

		for (var i = 0; i < edges.length; i++)
		{
			if (view.getState(edges[i]) != null)
			{
				view.invalidate(edges[i], true, false);
				view.validateCellState(edges[i], true);
			}
		}
	}
	finally
	{
		view.followedPoints = null;
	}
};

/**
 * Translates the painted node of the given shape to the position of the
 * given state.
 */
SpringMove.prototype.transformShape = function(state, shape)
{
	if (shape != null && shape.node != null && shape.springPainted != null)
	{
		var view = this.graph.view;
		var k = (view.modelCoordinates) ? 1 : view.scale;
		var pt = this.getModelPosition(state);
		var dx = (pt.x - shape.springPainted.x) * k;
		var dy = (pt.y - shape.springPainted.y) * k;
		var t = (dx != 0 || dy != 0) ? 'translate(' + dx + ',' + dy + ')' : '';
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
	}
};

/**
 * Applies the positions in one undoable edit and ends the gesture.
 */
SpringMove.prototype.finish = function()
{
	if (this.phase != null)
	{
		// Applies the rest positions, eg. for a new gesture during the movement
		if (this.phase == 'settle')
		{
			for (var i = 0; i < this.nodes.length; i++)
			{
				this.nodes[i].x = this.nodes[i].tx;
				this.nodes[i].y = this.nodes[i].ty;
			}
		}

		var graph = this.graph;
		var model = graph.model;
		var evt = this.lastEvent;
		var snap = mxUtils.bind(this, function(node)
		{
			return new mxPoint(node.x0 + this.snapDelta(node.x - node.x0, evt),
				node.y0 + this.snapDelta(node.y - node.y0, evt));
		});

		this.end();
		this.resetStates();
		var points = this.getFollowedPoints(snap);
		this.committing = true;
		var arrange = graph.beginArrange();

		try
		{
			for (var i = 0; i < this.nodes.length; i++)
			{
				var geo = this.getMovedGeometry(this.nodes[i].cell, snap);

				if (geo != null)
				{
					model.setGeometry(this.nodes[i].cell, geo);
				}
			}

			if (points != null)
			{
				for (var i = 0; i < this.followed.length; i++)
				{
					// The routing of the commit routes these connectors
					var pts = (this.routes == null || !LibavoidRouting.isAutoEdge(graph,
						this.followed[i])) ? points.get(this.followed[i]) : null;

					if (pts != null)
					{
						var geo = model.getGeometry(this.followed[i]).clone();
						geo.points = pts;
						model.setGeometry(this.followed[i], geo);
					}
				}
			}
		}
		finally
		{
			graph.endArrange(arrange);
			this.committing = false;
		}

		this.restore();
	}
};

/**
 * Restores the start positions and ends the gesture.
 */
SpringMove.prototype.cancel = function()
{
	if (this.phase != null)
	{
		this.end();
		this.restore();
	}
};

/**
 * Stops the frames and removes the listeners.
 */
SpringMove.prototype.end = function()
{
	this.phase = null;
	this.removeListeners();

	if (this.frameThread != null)
	{
		window.cancelAnimationFrame(this.frameThread);
		this.frameThread = null;
	}

	this.graph.springMoveStats = this.frames;

	if (this.graph.springMove == this)
	{
		this.graph.springMove = null;
	}
};

/**
 * Repaints the moving shapes and their connectors from the model, which
 * resets their transforms, and shows the handles and the inline toolbar.
 */
SpringMove.prototype.restore = function()
{
	var graph = this.graph;
	var view = graph.view;
	this.unhookShapes();

	for (var i = 0; i < this.nodes.length; i++)
	{
		if (this.nodes[i].mover)
		{
			view.invalidate(this.nodes[i].cell, true, true);
		}
	}

	for (var i = 0; i < this.edges.length; i++)
	{
		view.invalidate(this.edges[i], true, false);
	}

	// Connectors that the routes changed, eg. crossed by a moving shape
	for (var id in this.routes)
	{
		view.invalidate(this.routes[id].edge, true, false);
	}

	for (var i = 0; this.repaintEdges != null && i < this.repaintEdges.length; i++)
	{
		view.invalidate(this.repaintEdges[i], true, false);
	}

	this.repaintEdges = null;
	view.validate();
	graph.graphHandler.setHandlesVisibleForCells(graph.getSelectionCells(), true, true);
	this.setSelectionBorderVisible(true);

	if (this.ui.inlineToolbar != null)
	{
		this.ui.inlineToolbar.updateSelection();
	}
};

/**
 * Shows or hides the selection borders of the selected shapes and
 * connectors, which stay at the start positions while the shapes move.
 */
SpringMove.prototype.setSelectionBorderVisible = function(visible)
{
	this.graph.selectionCellsHandler.handlers.visit(function(key, handler)
	{
		var shape = (handler.selectionBorder != null) ?
			handler.selectionBorder : handler.shape;

		if (shape != null && shape.node != null)
		{
			shape.node.style.display = (visible) ? '' : 'none';
		}
	});
};
