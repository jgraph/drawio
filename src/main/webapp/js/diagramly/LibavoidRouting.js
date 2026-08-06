/**
 * LibavoidRouting — draw.io editor binding for the vendored libavoid-js WASM
 * obstacle-avoiding orthogonal edge router (js/libavoid-js/). It ROUTES edges
 * rather than placing nodes: every vertex becomes an obstacle, the target edges
 * are re-routed around them, and the bend points are written back as edge
 * waypoints. Vertices are never moved.
 *
 * Two entry points:
 *   - run()  — one-shot Arrange > Layout > Orthogonal Routing menu action
 *     (diagramly/Menus.js): routes the selected edges (or all edges) once,
 *     converting them to orthogonalEdgeStyle.
 *   - installAutoRouting() — live auto-routing for edges carrying the
 *     `libavoidRouting=1` style flag: re-routes them when they are inserted,
 *     reconnected, or a connected shape is moved/resized, as long as the user
 *     hasn't taken manual control (a manual waypoint edit clears the flag — see
 *     mxEdgeHandler.changePoints in grapheditor/Graph.js) and the edge lives
 *     outside any live layout container (a childLayout ancestor owns its
 *     children's edge geometry and would overwrite every route — see
 *     isAutoEdge/layoutContainerOf; the flag stays on the style, inert). Wired
 *     from the diagramly EditorUi.init (guarded by `typeof LibavoidRouting`).
 *
 * Auto-routing listens on the GRAPH events (CELLS_ADDED / CELL_CONNECTED /
 * CELLS_MOVED / CELLS_RESIZED), not the model CHANGE event: those fire only for
 * forward user actions (never on undo/redo replay), and the route is written via
 * model.setGeometry (a model-level change that does NOT re-fire these graph
 * events) — so there is no re-entry and no fighting with undo. The events only
 * COLLECT the affected cells; the solve is PARKED until the model's BEFORE_UNDO
 * (see autoReroute), which fires after the layout manager has run the edit's
 * synchronous childLayouts — so a terminal dropped into a stack/table/tree
 * container is routed against its final laid-out slot, not the drop point
 * (layout writes are model-level and would never re-trigger an event-time
 * solve). BEFORE_UNDO fires before the edit closes and the endingUpdate latch
 * folds the handler's writes in, so a warm-WASM route still merges into the
 * same undoable edit as the move (one Ctrl+Z reverts both).
 *
 * The routing core (AvoidRouting: computeRoutes + the pure geometry helpers)
 * lives in js/libavoid-js/libavoid-routing.js — the canonical shared artifact
 * that drawio-mcp vendors verbatim for its app-server viewer and node tool
 * server. This file is the EDITOR binding only (mxGraph model access, events,
 * previews, styles); anything editor-independent belongs in the core.
 */
var LibavoidRouting =
{
	// Default shape buffer (obstacle clearance) and nudging distance, in model
	// px. shapeBufferDistance is overridable via the menu's spacing prompt.
	shapeBufferDistance: 16,
	idealNudgingDistance: 14,

	// Routing strategy switch (configurable):
	//   false (default) — one multi-edge computeRoutes: libavoid nudging separates
	//          shared paths (nicer for parallel edges), and it's faster (a single
	//          solve), but competing edges between the same shape pair route
	//          non-deterministically and can oscillate during the live preview.
	//   true  — route each edge in its OWN single-connector solve
	//          (computeRoutesIndependent): deterministic, so competing edges don't
	//          oscillate, but no edge-edge nudging (shared paths can overlap).
	// Toggle live from the console (LibavoidRouting.independentRouting = true) or per
	// session with the ?libavoid-independent=0|1 URL param.
	independentRouting: false,

	// Edge style flag: '1' means "auto-route this edge via libavoid". Paired with
	// edgeStyle=orthogonalEdgeStyle (set together by the Format checkbox and the
	// default-edge-style). Cleared on manual waypoint edits so the user's points
	// win. Listed in Graph.edgeStyles + Graph.createCurrentEdgeStyle so it
	// propagates to new edges and copies as a default like any edge style.
	STYLE: 'libavoidRouting',

	// JSON layout-spec name / shorthand (see Graph.createLayouts). Routes the page's
	// edges via libavoid through the generic layout pipeline — custom-layout dialog,
	// embed 'layout' action, executeLayoutSpec (URL / desktop --layout) and headless
	// export — like elk*/mxParallelEdgeLayout. Display label is the 'orthogonalRouting'
	// resource; this is the technical name used in the JSON {layout:...} field.
	LAYOUT_NAME: 'orthogonalEdge',

	// User-facing shorthand accepted wherever a layout spec names a layout
	// without JSON (EditorUi.resolveLayoutList): the CSV `# layout:` line, the
	// embed 'layout' action / load option, the #create hash and the desktop
	// --layout flag. Resolves to [{layout: LAYOUT_NAME}].
	SHORTHAND: 'libavoid'
};

/**
 * One-shot menu action. Awaits WASM readiness, then routes the selected edges
 * (or all edges if none selected), converting them to orthogonalEdgeStyle.
 *
 * @param {EditorUi} editorUi
 * @param {{shapeBufferDistance?:number, idealNudgingDistance?:number}} [opts]
 * @param {function(boolean)} [done]
 */
LibavoidRouting.run = function(editorUi, opts, done)
{
	var finish = function(applied)
	{
		if (typeof done === 'function')
		{
			done(applied);
		}
	};

	var ready = (typeof window !== 'undefined') ? window.__libavoidReady : null;

	if (ready == null)
	{
		editorUi.handleError(new Error(mxResources.get('libavoidUnavailable')));
		finish(false);
		return;
	}

	var spinner = editorUi.spinner;

	if (spinner != null && spinner.spin != null)
	{
		spinner.spin(document.body, mxResources.get('loading'));
	}

	ready.then(function(Avoid)
	{
		if (spinner != null && spinner.stop != null)
		{
			spinner.stop();
		}

		if (Avoid == null)
		{
			editorUi.handleError(new Error(mxResources.get('libavoidUnavailable')));
			finish(false);
			return;
		}

		try
		{
			var graph = editorUi.editor.graph;

			// Records the run for Arrange > Layout > Run Last Layout (replayed
			// through the shared layout-spec pipeline, see
			// EditorUi.executeLayoutSpec).
			var spec = {layout: LibavoidRouting.LAYOUT_NAME};

			if (opts != null)
			{
				spec.config = opts;
			}

			editorUi.lastLayoutSpec = [spec];

			// A single selected layout container takes the run as its new
			// childLayout — live orthogonal routing of the container's edges —
			// instead of a one-shot routing pass.
			var container = editorUi.getSelectedLayoutContainer();

			if (container != null)
			{
				editorUi.setContainerChildLayout(container, editorUi.lastLayoutSpec);
				finish(true);
				return;
			}

			var edgeCells = LibavoidRouting.getTargetEdges(graph);

			editorUi.executeLayout(function()
			{
				LibavoidRouting.routeCells(graph, Avoid, edgeCells, opts, true);
			}, false, function()
			{
				finish(true);
			});
		}
		catch (e)
		{
			editorUi.handleError(e);
			finish(false);
		}
	});
};

/**
 * A layout-pipeline adapter (NOT an mxGraphLayout) that routes the page's edges via
 * libavoid. Like ElkLayout it is asynchronous — the WASM may still be loading — so it
 * exposes prepare(parent, callback): callback(err) on failure, else callback(null,
 * applyFn) where applyFn does the routing. The caller (EditorUi.executeLayouts and the
 * headless export runner) wraps applyFn in the model update, so applyFn must NOT open
 * its own. Built from Graph.createLayouts when the JSON {layout: LAYOUT_NAME} is run.
 *
 * @param {mxGraph} graph
 * @param {{shapeBufferDistance?:number, idealNudgingDistance?:number}} [config]
 *        computeRoutes options; null/absent uses the LibavoidRouting defaults.
 */
LibavoidRouting.createLayout = function(graph, config)
{
	var opts = (config != null) ? config : null;

	// Collect and route the run's edges — synchronous once the WASM
	// namespace exists. Shared by executeSync and the prepare apply
	// closure.
	var runRouting = function(Avoid, parent)
	{
		var model = graph.getModel();
		var edges;

		if (layout.cellFilter != null)
		{
			// Scoped run: route the subset's edges regardless of
			// the current selection.
			edges = [];

			for (var id in model.cells)
			{
				var cell = model.cells[id];

				if (model.isEdge(cell) && layout.cellFilter(cell))
				{
					edges.push(cell);
				}
			}
		}
		else if (parent != null && model.isVertex(parent) &&
			graph.getCellStyle(parent)['childLayout'] != null)
		{
			// A childLayout run: the layout root is a container, so
			// route its descendant edges — not the page or the
			// current selection, which a manager-triggered re-run
			// must not depend on. One-shot pipeline runs keep the
			// legacy selected-or-all scope: their prepare parent is
			// the default parent, which is a layer or (after Enter
			// Group) a plain vertex without childLayout.
			edges = [];

			var collect = function(cell)
			{
				for (var i = 0; i < model.getChildCount(cell); i++)
				{
					var child = model.getChildAt(cell, i);

					if (model.isEdge(child))
					{
						edges.push(child);
					}
					else
					{
						collect(child);
					}
				}
			};

			collect(parent);
		}
		else
		{
			edges = LibavoidRouting.getTargetEdges(graph);
		}

		LibavoidRouting.routeCells(graph, Avoid, edges, opts, true);
	};

	var layout = {
		// Set by EditorUi.scopeLayoutsToCells to restrict the routing to a
		// cell subset (a CSV import only routes the edges it just created);
		// null routes the selected (or all) edges.
		cellFilter: null,

		// mxLayoutManager delegates interactive child moves/resizes to the
		// container's layout via mxCompositeLayout when this runs as a
		// childLayout; edge routing has nothing to do per-cell, so these
		// are no-ops (same as ElkLayout's) — without moveCell, dragging a
		// child inside an orthogonalEdge container throws.
		moveCell: function() { },
		resizeCell: function() { },

		// Sync execution once the WASM is loaded, so Graph.
		// canExecuteLayoutSync routes a composite childLayout containing
		// this adapter through the manager's sync path (inside the
		// triggering edit, where the endingUpdate latch makes re-triggering
		// impossible). Without these the WHOLE composite — including its
		// ELK members — was forced onto the async scheduler, whose
		// cross-container termination depends on converged applies being
		// empty edits: two NESTED containers with e.g.
		// [elkLayered, orthogonalEdge] childLayouts could re-schedule each
		// other forever (an autosave loop). Only the WASM load window still
		// uses prepare below.
		canExecuteSync: function()
		{
			return typeof window !== 'undefined' && window.Avoid != null;
		},

		executeSync: function(parent)
		{
			runRouting(window.Avoid, parent);
		},

		prepare: function(parent, callback)
		{
			var run = function(Avoid)
			{
				if (Avoid == null)
				{
					callback(new Error(mxResources.get('libavoidUnavailable')));
					return;
				}

				callback(null, function()
				{
					runRouting(Avoid, parent);
				});
			};

			if (typeof window !== 'undefined' && window.Avoid != null)
			{
				run(window.Avoid);
			}
			else if (typeof window !== 'undefined' && window.__libavoidReady != null)
			{
				window.__libavoidReady.then(run);
			}
			else
			{
				run(null);
			}
		}
	};

	return layout;
};

/**
 * Install the live auto-routing listeners for `libavoidRouting=1` edges on the
 * given editor's graph. Called once per editor from diagramly EditorUi.init.
 */
LibavoidRouting.installAutoRouting = function(editorUi)
{
	var graph = editorUi.editor.graph;
	var model = graph.getModel();

	// Per-session override of the routing strategy: ?libavoid-independent=0 forces the
	// previous multi-edge/nudged routing; =1 forces independent per-edge routing.
	if (typeof urlParams !== 'undefined' && urlParams != null &&
		urlParams['libavoid-independent'] != null)
	{
		LibavoidRouting.independentRouting = urlParams['libavoid-independent'] != '0';
	}

	var values = function(map)
	{
		var a = [];

		for (var id in map)
		{
			a.push(map[id]);
		}

		return a;
	};

	// Inserted cells: route flagged edges that were added, and re-route existing
	// flagged edges that a newly inserted SHAPE now overlaps (same idea as a move
	// dropping a shape onto an edge). Atomic with the insert (CELLS_ADDED fires
	// inside the insert's update).
	graph.addListener(mxEvent.CELLS_ADDED, function(sender, evt)
	{
		var cells = evt.getProperty('cells');

		if (cells == null)
		{
			return;
		}

		var map = Object.create(null);
		var regions = [];
		var inserted = [];

		for (var i = 0; i < cells.length; i++)
		{
			if (LibavoidRouting.isAutoEdge(graph, cells[i]))
			{
				map[cells[i].getId()] = cells[i];
			}
			else if (model.isVertex(cells[i]))
			{
				inserted.push(cells[i]);
				var b = LibavoidRouting.getAbsoluteModelBounds(graph, cells[i]);

				if (b != null)
				{
					regions.push({x: b.x, y: b.y, width: b.w, height: b.h});
				}
			}
		}

		LibavoidRouting.collectOverlappingEdges(graph, regions, map);
		LibavoidRouting.autoReroute(graph, values(map), inserted);
	});

	// Edge reconnected to a different terminal.
	graph.addListener(mxEvent.CELL_CONNECTED, function(sender, evt)
	{
		var edge = evt.getProperty('edge');

		if (LibavoidRouting.isAutoEdge(graph, edge))
		{
			LibavoidRouting.autoReroute(graph, [edge]);
		}
	});

	// New edge finished via the connection handler (hover-icon drag). Re-route it
	// here, not just at CELLS_ADDED: a FIXED connection point (exitX/entryX) is set
	// by setConnectionConstraint AFTER the edge is added, and mxEvent.CONNECT fires
	// after that (still inside the connect update, so the re-route is atomic). The
	// drag preview routed center-to-center (it doesn't see the constraint), so this
	// is what makes the committed route honour the fixed anchor's direction.
	if (graph.connectionHandler != null)
	{
		graph.connectionHandler.addListener(mxEvent.CONNECT, function(sender, evt)
		{
			var edge = evt.getProperty('cell');

			if (LibavoidRouting.isAutoEdge(graph, edge))
			{
				LibavoidRouting.autoReroute(graph, [edge]);
			}
		});
	}

	// Port-constraint edits re-route the affected flagged edges: the masks are
	// routing input (maskSides), but they arrive as pure STYLE writes from the
	// Format panel (property grid Constraint / Source & Target Constraint /
	// Rotate Constraint rows), which fire none of the graph events above. The
	// editor's 'styleChanged' event is the forward-gesture signal for those —
	// fired by the panel editors only, never on undo/redo replay, so the
	// no-model-CHANGE-listener rule above holds. A vertex mask affects every
	// flagged edge at the shape; a rotation edit only matters for terminals
	// whose mask rotates with the shape (portConstraintRotation=1).
	editorUi.addListener('styleChanged', function(sender, evt)
	{
		var keys = evt.getProperty('keys');
		var cells = evt.getProperty('cells');

		if (keys == null || cells == null)
		{
			return;
		}

		var constraintKeys = {portConstraint: true, portConstraintRotation: true,
			sourcePortConstraint: true, targetPortConstraint: true};
		var relevant = false;
		var rotationOnly = true;
		var i, j;

		for (i = 0; i < keys.length; i++)
		{
			if (constraintKeys[keys[i]])
			{
				relevant = true;
				rotationOnly = false;
			}
			else if (keys[i] == 'rotation')
			{
				relevant = true;
			}
		}

		if (!relevant)
		{
			return;
		}

		var map = Object.create(null);

		for (i = 0; i < cells.length; i++)
		{
			var cell = cells[i];

			if (!rotationOnly && LibavoidRouting.isAutoEdge(graph, cell))
			{
				map[cell.getId()] = cell;
			}
			else if (model.isVertex(cell))
			{
				if (rotationOnly && mxUtils.getValue(graph.getCellStyle(cell),
					'portConstraintRotation', null) != 1)
				{
					continue;
				}

				var edges = model.getEdges(cell);

				for (j = 0; j < edges.length; j++)
				{
					if (LibavoidRouting.isAutoEdge(graph, edges[j]))
					{
						map[edges[j].getId()] = edges[j];
					}
				}
			}
		}

		LibavoidRouting.autoReroute(graph, values(map));
	});

	// A shape moved or resized => re-route flagged edges that are affected: the
	// ones CONNECTED to it, plus any whose route the shape now overlaps (an
	// obstacle dropped onto an edge) or just vacated. autoReroute parks the solve
	// until this edit's BEFORE_UNDO (after any childLayout of the gesture has
	// run), still atomic with the move (one undo).
	var onMoveResize = function(sender, evt)
	{
		var cells = evt.getProperty('cells');

		if (cells == null)
		{
			return;
		}

		var dx = evt.getProperty('dx'), dy = evt.getProperty('dy');   // CELLS_MOVED
		var previous = evt.getProperty('previous');                   // CELLS_RESIZED
		var map = Object.create(null);
		var regions = [];
		var moved = [];
		var i, j;

		for (i = 0; i < cells.length; i++)
		{
			if (!model.isVertex(cells[i]))
			{
				continue;
			}

			moved.push(cells[i]);

			// Connected auto-edges always re-route.
			var edges = model.getEdges(cells[i]);

			for (j = 0; j < edges.length; j++)
			{
				if (LibavoidRouting.isAutoEdge(graph, edges[j]))
				{
					map[edges[j].getId()] = edges[j];
				}
			}

			// Affected region = union of the shape's OLD and NEW model bounds.
			var nb = LibavoidRouting.getAbsoluteModelBounds(graph, cells[i]);

			if (nb == null)
			{
				continue;
			}

			var ox = nb.x, oy = nb.y, ow = nb.w, oh = nb.h;

			if (previous != null && previous[i] != null)
			{
				var off = LibavoidRouting.getAbsoluteParentOffset(graph, cells[i]);
				ox = previous[i].x + off.x; oy = previous[i].y + off.y;
				ow = previous[i].width; oh = previous[i].height;
			}
			else if (dx != null && dy != null)
			{
				ox = nb.x - dx; oy = nb.y - dy;
			}

			var ux = Math.min(ox, nb.x), uy = Math.min(oy, nb.y);
			regions.push({x: ux, y: uy,
				width: Math.max(ox + ow, nb.x + nb.w) - ux,
				height: Math.max(oy + oh, nb.y + nb.h) - uy});
		}

		LibavoidRouting.collectOverlappingEdges(graph, regions, map);

		// Re-route the affected edges (routeCells uses the same configured strategy as
		// the live preview, so the dropped route matches what was previewed). The moved
		// vertices ride along so the parked flush can re-expand the affected set
		// against their POST-childLayout positions.
		LibavoidRouting.autoReroute(graph, values(map), moved);
	};

	graph.addListener(mxEvent.CELLS_MOVED, onMoveResize);
	graph.addListener(mxEvent.CELLS_RESIZED, onMoveResize);
};

/**
 * Add to `map` every auto-edge (not already present) whose route bbox overlaps
 * any of the given regions ({x,y,width,height}, absolute model coords). Inclusive
 * test so zero-width vertical / zero-height horizontal edges still match; over-
 * inclusion is harmless (re-routing an unaffected edge yields the same geometry,
 * which routeCells then skips writing — see samePoints). O(cells) — callers run it
 * on commit (drag-end / insert), not per frame.
 */
LibavoidRouting.collectOverlappingEdges = function(graph, regions, map)
{
	if (regions == null || regions.length == 0)
	{
		return;
	}

	var model = graph.getModel();

	for (var id in model.cells)
	{
		var c = model.cells[id];

		if (map[id] != null || !LibavoidRouting.isAutoEdge(graph, c))
		{
			continue;
		}

		var bb = LibavoidRouting.edgeRouteBounds(graph, c);

		if (bb == null)
		{
			continue;
		}

		for (var j = 0; j < regions.length; j++)
		{
			var r = regions[j];

			if (bb.x <= r.x + r.width && r.x <= bb.x + bb.width &&
				bb.y <= r.y + r.height && r.y <= bb.y + bb.height)
			{
				map[id] = c;
				break;
			}
		}
	}
};

/**
 * Re-route the given flagged edge cells, honoring any pending childLayout of
 * the same edit. Called inside a model update (every auto-routing event fires
 * within one), the request is PARKED and solved on the model's BEFORE_UNDO
 * instead of immediately: the layout manager runs the edit's synchronous
 * childLayouts from its own BEFORE_UNDO handler (registered at Graph
 * construction, i.e. before the lazily installed flush below), so a terminal
 * dropped into a stack/table/tree container is routed against its final
 * laid-out position — an event-time solve would route against the drop point,
 * and the layout's own writes are model-level, so they re-fire no graph event
 * that could fix it up. BEFORE_UNDO fires before the edit is closed and the
 * endingUpdate latch swallows nested dispatches, so the deferred route still
 * joins the same undoable edit (one undo reverts move + layout + route).
 * Outside an update the solve runs immediately as before.
 *
 * vertexCells (optional) are the gesture's moved/resized/inserted vertices:
 * the flush re-expands the affected-edge set against their post-layout
 * positions (see flushReroute). An edge-less park only matters when such a
 * vertex sits under a live layout container — anywhere else nothing moves
 * after the event — so plain-canvas gestures skip the parking entirely.
 */
LibavoidRouting.autoReroute = function(graph, edgeCells, vertexCells)
{
	var hasEdges = (edgeCells != null && edgeCells.length > 0);

	if (graph.getModel().updateLevel > 0)
	{
		if (hasEdges || LibavoidRouting.anyInLayoutContainer(graph, vertexCells))
		{
			LibavoidRouting.parkReroute(graph, edgeCells, vertexCells);
		}
	}
	else if (hasEdges)
	{
		LibavoidRouting.solveReroute(graph, edgeCells);
	}
};

/**
 * True if any of the given cells lives under a childLayout ancestor — the only
 * case an edge-less gesture park matters (the container's layout re-runs at
 * BEFORE_UNDO and can move cells over flagged edges).
 */
LibavoidRouting.anyInLayoutContainer = function(graph, cells)
{
	if (cells != null)
	{
		for (var i = 0; i < cells.length; i++)
		{
			if (cells[i] != null &&
				LibavoidRouting.layoutContainerOf(graph, cells[i]) != null)
			{
				return true;
			}
		}
	}

	return false;
};

/**
 * Parks a reroute request until the current edit's BEFORE_UNDO (see
 * autoReroute). The flush listener is installed lazily on first use, which
 * puts it AFTER the layout manager's own BEFORE_UNDO handler in the model's
 * listener list — so the flush runs once the edit's synchronous childLayouts
 * have written their geometry. The parked vertices' childLayout ancestors are
 * resolved and measured NOW as well as at flush time: at park time the chain
 * and bounds still reflect the pre-layout state (a vertex dragged OUT of a
 * stack records the container it left before resizeParent shrinks it), the
 * flush adds the post-layout boxes.
 */
LibavoidRouting.parkReroute = function(graph, edgeCells, vertexCells)
{
	var pending = graph.__libavoidPendingReroute;
	var i;

	if (pending == null)
	{
		pending = graph.__libavoidPendingReroute = {edges: Object.create(null),
			vertices: Object.create(null), containers: Object.create(null),
			regions: []};
	}

	if (edgeCells != null)
	{
		for (i = 0; i < edgeCells.length; i++)
		{
			if (edgeCells[i] != null)
			{
				pending.edges[edgeCells[i].getId()] = edgeCells[i];
			}
		}
	}

	if (vertexCells != null)
	{
		for (i = 0; i < vertexCells.length; i++)
		{
			if (vertexCells[i] != null)
			{
				pending.vertices[vertexCells[i].getId()] = vertexCells[i];
				LibavoidRouting.addLayoutContainers(graph, vertexCells[i],
					pending.containers, pending.regions);
			}
		}
	}

	if (!graph.__libavoidRerouteFlush)
	{
		graph.__libavoidRerouteFlush = true;

		// Fires per non-empty edit; a null pending returns immediately. The
		// theoretical leak — parking into an edit that ends up EMPTY, so its
		// BEFORE_UNDO never fires — can't happen from the auto-routing events
		// (they all record model changes), and a leftover would only re-solve
		// already-routed edges (samePoints skips the writes).
		graph.getModel().addListener(mxEvent.BEFORE_UNDO, function()
		{
			LibavoidRouting.flushReroute(graph);
		});
	}
};

/**
 * Adds every childLayout ancestor of the cell (nested containers all re-run
 * under the layout manager) to the containers map; a NEWLY seen container also
 * pushes its current absolute bounds onto regions (when non-null) as an
 * affected region.
 */
LibavoidRouting.addLayoutContainers = function(graph, cell, containers, regions)
{
	var model = graph.getModel();
	var p = model.getParent(cell);

	while (p != null && model.isVertex(p))
	{
		if (containers[p.getId()] == null &&
			graph.getCurrentCellStyle(p)['childLayout'] != null)
		{
			containers[p.getId()] = p;

			if (regions != null)
			{
				var b = LibavoidRouting.getAbsoluteModelBounds(graph, p);

				if (b != null)
				{
					regions.push({x: b.x, y: b.y, width: b.w, height: b.h});
				}
			}
		}

		p = model.getParent(p);
	}
};

/**
 * Solves a parked reroute request from the model's BEFORE_UNDO, after the
 * layout manager has run the edit's synchronous childLayouts (see
 * autoReroute). The affected-edge set is re-expanded against the POST-layout
 * state: the parked vertices' current bounds plus the current bounds of every
 * childLayout ancestor — resolved both at park time (the pre-gesture chain and
 * boxes) and now (a drop INTO a container resolves its new chain only here;
 * CELLS_MOVED fires before the reparent) — become overlap regions, so edges
 * whose obstacles the layout shifted (a stack re-flowing its items,
 * resizeParent growing the container) are caught even though those writes fire
 * no graph events. Cleared before solving so a listener firing mid-flush
 * starts a new cycle instead of extending this one.
 */
LibavoidRouting.flushReroute = function(graph)
{
	var pending = graph.__libavoidPendingReroute;

	if (pending == null)
	{
		return;
	}

	graph.__libavoidPendingReroute = null;

	var regions = pending.regions;
	var id, b;

	for (id in pending.vertices)
	{
		b = LibavoidRouting.getAbsoluteModelBounds(graph, pending.vertices[id]);

		if (b != null)
		{
			regions.push({x: b.x, y: b.y, width: b.w, height: b.h});
		}

		LibavoidRouting.addLayoutContainers(graph, pending.vertices[id],
			pending.containers, null);
	}

	for (id in pending.containers)
	{
		b = LibavoidRouting.getAbsoluteModelBounds(graph, pending.containers[id]);

		if (b != null)
		{
			regions.push({x: b.x, y: b.y, width: b.w, height: b.h});
		}
	}

	LibavoidRouting.collectOverlappingEdges(graph, regions, pending.edges);

	var edges = [];

	for (id in pending.edges)
	{
		edges.push(pending.edges[id]);
	}

	LibavoidRouting.solveReroute(graph, edges);
};

/**
 * Runs the actual solve for the given flagged edges: synchronously when the
 * WASM is already warm (so it merges into the caller's ongoing edit for atomic
 * undo), else deferred until the loader resolves (cold start, first use only).
 * Writes only waypoints — the edge already carries orthogonalEdgeStyle (paired
 * with the flag), so no style churn per move.
 */
LibavoidRouting.solveReroute = function(graph, edgeCells)
{
	if (edgeCells == null || edgeCells.length == 0)
	{
		return;
	}

	var run = function(Avoid)
	{
		if (Avoid == null)
		{
			return;
		}

		// Re-check at solve time. On a cold start this runs only after the
		// __libavoidReady promise resolves, by when the user may have switched the
		// edge to another routing style, added a manual waypoint (both clear the
		// flag via isAutoEdge), or deleted it (contains) — don't overwrite that.
		var model = graph.getModel();
		var live = [];

		for (var i = 0; i < edgeCells.length; i++)
		{
			if (model.contains(edgeCells[i]) &&
				LibavoidRouting.isAutoEdge(graph, edgeCells[i]))
			{
				live.push(edgeCells[i]);
			}
		}

		if (live.length == 0)
		{
			return;
		}

		model.beginUpdate();

		try
		{
			LibavoidRouting.routeCells(graph, Avoid, live, null, false);
		}
		finally
		{
			model.endUpdate();
		}
	};

	if (typeof window === 'undefined')
	{
		return;
	}

	if (window.Avoid != null)
	{
		run(window.Avoid);
	}
	else if (window.__libavoidReady != null)
	{
		window.__libavoidReady.then(run);
	}
};

/**
 * The nearest ancestor vertex carrying a childLayout style (the same test as
 * the mxLayoutManager.hasLayout override in grapheditor/Graph.js), or null.
 * Such a LIVE LAYOUT CONTAINER owns the geometry of everything inside it: the
 * manager re-runs its layout on every change within the container, so any
 * route libavoid writes to a child edge is immediately overwritten (and a
 * live preview of that route shows bends that never commit).
 */
LibavoidRouting.layoutContainerOf = function(graph, cell)
{
	var model = graph.getModel();
	var p = model.getParent(cell);

	while (p != null && model.isVertex(p))
	{
		if (graph.getCurrentCellStyle(p)['childLayout'] != null)
		{
			return p;
		}

		p = model.getParent(p);
	}

	return null;
};

/**
 * True if the cell is an edge carrying the auto-routing flag AND living
 * outside any live layout container: inside one, the container's childLayout
 * owns the edge geometry (see layoutContainerOf), so the flag stays on the
 * style but is inert — it takes effect again when the edge leaves the
 * container (e.g. is copied out onto the canvas).
 */
LibavoidRouting.isAutoEdge = function(graph, edge)
{
	if (edge == null || !graph.getModel().isEdge(edge))
	{
		return false;
	}

	var style = graph.getCellStyle(edge);

	return style != null && mxUtils.getValue(style, LibavoidRouting.STYLE, null) == '1' &&
		LibavoidRouting.layoutContainerOf(graph, edge) == null;
};

/**
 * Turn libavoid auto-routing OFF (libavoidRouting=0) on every visible edge
 * under parent that carries the flag, honoring the optional cell filter
 * (function(cell) -> boolean, e.g. an ELK run's selection-as-root component
 * scope; a filtered-out cell is skipped INCLUDING its subtree, matching the
 * adapter's cellFilter semantics). Called by layouts that stamp their own
 * edge routing (diagramly/ElkLayout.js wraps ElkLayout._applyResult):
 * leaving the flag enabled would let the next gesture re-route the
 * just-laid-out edges per-edge via libavoid — with the layout's stamped
 * exit/entry pins forcing fanned detours. Writes only where the flag is
 * currently '1', so converged childLayout re-runs stay empty edits, and
 * runs inside the caller's model edit (one undo reverts layout + flags).
 */
LibavoidRouting.releaseEdges = function(graph, parent, filter)
{
	var model = graph.getModel();
	var release = [];

	var collect = function(cell)
	{
		var n = model.getChildCount(cell);

		for (var i = 0; i < n; i++)
		{
			var child = model.getChildAt(cell, i);

			if (filter == null || filter(child))
			{
				if (model.isEdge(child) && model.isVisible(child) &&
					mxUtils.getValue(graph.getCellStyle(child),
						LibavoidRouting.STYLE, null) == '1')
				{
					release.push(child);
				}

				collect(child);
			}
		}
	};

	collect(parent);

	if (release.length > 0)
	{
		graph.setCellStyles(LibavoidRouting.STYLE, '0', release);
	}
};

/**
 * The edges the menu action should route: selected edges if any, else all edges.
 */
LibavoidRouting.getTargetEdges = function(graph)
{
	var model = graph.getModel();
	var out = [];

	if (!graph.isSelectionEmpty())
	{
		var sel = graph.getSelectionCells();

		for (var i = 0; i < sel.length; i++)
		{
			if (model.isEdge(sel[i]))
			{
				out.push(sel[i]);
			}
		}

		if (out.length > 0)
		{
			return out;
		}
	}

	for (var id in model.cells)
	{
		if (model.isEdge(model.cells[id]))
		{
			out.push(model.cells[id]);
		}
	}

	return out;
};

/**
 * A fixed connection point on one end of an edge (exitX/exitY for the source,
 * entryX/entryY for the target), as {x, y, dir}: proportional position in [0,1]
 * plus the ConnDirFlags approach direction inferred from which shape edge the
 * point sits on (AvoidRouting.constraintForPoint — it clamps to the pin's
 * [0,1] domain and derives the direction from the ORIGINAL values). Returns
 * null for a floating endpoint (no fixed point).
 */
LibavoidRouting.fixedConstraint = function(style, source)
{
	var fx = mxUtils.getValue(style, source ? 'exitX' : 'entryX', null);
	var fy = mxUtils.getValue(style, source ? 'exitY' : 'entryY', null);

	return (fx != null && fy != null) ?
		AvoidRouting.constraintForPoint(parseFloat(fx), parseFloat(fy)) : null;
};

/**
 * Allowed attach sides for one end of an edge per the legacy mxGraph
 * port-constraint styles — the terminal's `portConstraint` (rotated with the
 * shape when portConstraintRotation=1), else the edge's
 * `sourcePortConstraint`/`targetPortConstraint` — as AvoidRouting side
 * letters ('N'/'S'/'E'/'W') for computeRoutes' sourceSides/targetSides, or
 * null when the end is unconstrained. Resolved through
 * mxUtils.getPortConstraints, the exact semantics the orthogonal router
 * enforces on floating ends at render time, so the committed route and the
 * rendered attach agree. Takes parsed STYLE maps like fixedConstraint (the
 * function only reads .style, so plain wrappers suffice).
 */
LibavoidRouting.maskSides = function(edgeStyle, terminalStyle, source)
{
	if (edgeStyle == null || terminalStyle == null)
	{
		return null;
	}

	var mask = mxUtils.getPortConstraints({style: terminalStyle},
		{style: edgeStyle}, source, mxConstants.DIRECTION_MASK_NONE);

	if (mask == mxConstants.DIRECTION_MASK_NONE ||
		mask == mxConstants.DIRECTION_MASK_ALL)
	{
		return null;
	}

	var sides = [];

	if ((mask & mxConstants.DIRECTION_MASK_NORTH) != 0) sides.push('N');
	if ((mask & mxConstants.DIRECTION_MASK_SOUTH) != 0) sides.push('S');
	if ((mask & mxConstants.DIRECTION_MASK_WEST) != 0) sides.push('W');
	if ((mask & mxConstants.DIRECTION_MASK_EAST) != 0) sides.push('E');

	return (sides.length > 0) ? sides : null;
};

/**
 * The terminal's declared connection points for one end of an edge as routing
 * pin candidates [{x, y, dir}] for computeRoutes' sourcePoints/targetPoints,
 * or null when snapToPoint doesn't apply. Mirrors the render-time gate
 * (mxGraphView.updateFloatingTerminalPoint in grapheditor/Graph.js: the
 * terminal OR the edge carries snapToPoint=1) so the committed route attaches
 * where the floating end will snap at render time. The anchors come from
 * graph.getAllConnectionConstraints on the terminal's view STATE (stencil and
 * shape constraints need the rendered shape; no state — e.g. a hidden
 * terminal — means no snap, matching a render that draws nothing). Each
 * constraint's dx/dy offset (model px) is folded into the fraction over the
 * terminal's routing box (getAbsoluteModelBounds — the same frame the
 * obstacle box uses, incl. the derived hull of transparentBounds cells) and
 * the approach direction derives from the resulting point (constraintForPoint).
 * Only meaningful for FLOATING ends: the callers' precedence gives an
 * explicit exit/entry anchor the win, like the renderer.
 */
LibavoidRouting.snapPoints = function(graph, terminal, edgeStyle, terminalStyle)
{
	if (terminal == null || edgeStyle == null || terminalStyle == null)
	{
		return null;
	}

	if (mxUtils.getValue(terminalStyle, 'snapToPoint', '0') != '1' &&
		mxUtils.getValue(edgeStyle, 'snapToPoint', '0') != '1')
	{
		return null;
	}

	var state = graph.view.getState(terminal);

	if (state == null)
	{
		return null;
	}

	var constraints = graph.getAllConnectionConstraints(state);
	var b = LibavoidRouting.getAbsoluteModelBounds(graph, terminal);

	if (constraints == null || constraints.length == 0 || b == null ||
		!(b.w > 0) || !(b.h > 0))
	{
		return null;
	}

	var points = [];

	for (var i = 0; i < constraints.length; i++)
	{
		var c = constraints[i];

		if (c == null || c.point == null)
		{
			continue;
		}

		var p = AvoidRouting.constraintForPoint(
			c.point.x + ((c.dx || 0) / b.w),
			c.point.y + ((c.dy || 0) / b.h));

		if (p != null)
		{
			points.push(p);
		}
	}

	return (points.length > 0) ? points : null;
};

/**
 * Resolved jetty size for one end of an edge (the minimum length of the first/
 * last visible segment, model px) from the edge's parsed style. Same lookup as
 * mxEdgeStyle.getJettySize — sourceJettySize/targetJettySize over jettySize over
 * orthBuffer, with 'auto' derived from the end's arrow size — but returning a
 * number (the style map holds strings). Routed edges render via SegmentConnector
 * (orthogonalEdgeStyle + waypoints trips mxEdgeStyle.orthPointsFallback), which
 * has no jetty of its own, so the stub only exists if the ROUTE respects it.
 */
LibavoidRouting.jettyFor = function(style, source)
{
	var value = mxUtils.getValue(style, (source) ? mxConstants.STYLE_SOURCE_JETTY_SIZE :
		mxConstants.STYLE_TARGET_JETTY_SIZE, mxUtils.getValue(style,
			mxConstants.STYLE_JETTY_SIZE, mxEdgeStyle.orthBuffer));

	if (value == 'auto')
	{
		var type = mxUtils.getValue(style, (source) ? mxConstants.STYLE_STARTARROW :
			mxConstants.STYLE_ENDARROW, mxConstants.NONE);

		if (type != mxConstants.NONE)
		{
			var size = mxUtils.getNumber(style, (source) ? mxConstants.STYLE_STARTSIZE :
				mxConstants.STYLE_ENDSIZE, mxConstants.DEFAULT_MARKERSIZE);
			value = Math.max(2, Math.ceil((size + mxEdgeStyle.orthBuffer) /
				mxEdgeStyle.orthBuffer)) * mxEdgeStyle.orthBuffer;
		}
		else
		{
			value = 2 * mxEdgeStyle.orthBuffer;
		}
	}

	value = parseFloat(value);

	return (isNaN(value)) ? 0 : value;
};

/**
 * Two waypoint lists equal? Treats null/empty as equal and compares rounded
 * coordinates (routeCells rounds its bends), so it matches when a re-route produces
 * the same geometry. Used to avoid recording no-op mxGeometryChanges.
 */
LibavoidRouting.samePoints = function(a, b)
{
	var an = (a != null) ? a.length : 0;
	var bn = (b != null) ? b.length : 0;

	if (an !== bn)
	{
		return false;
	}

	for (var i = 0; i < an; i++)
	{
		var p = a[i], q = b[i];

		if (p == null || q == null)
		{
			if (p !== q)
			{
				return false;
			}
		}
		else if (Math.round(p.x) !== Math.round(q.x) || Math.round(p.y) !== Math.round(q.y))
		{
			return false;
		}
	}

	return true;
};

/**
 * Collect, route, and write back: registers every vertex as an obstacle, routes
 * the given edge cells (those with both terminals on vertices), and writes the
 * bend points back parent-relative. Pure model mutations — the caller owns the
 * update (executeLayout for the menu, a plain beginUpdate for auto). When
 * setStyle is true, also forces orthogonalEdgeStyle (the menu converts edges);
 * auto-routing leaves the style alone (the flag already pairs with it).
 *
 * @returns {boolean} whether any edge was routed.
 */
/**
 * The absolute-model free point of a DANGLING (unconnected) edge end, or null
 * when that end is connected to a terminal cell. Reads the edge geometry's
 * terminal point (parent-relative) and shifts it by the edge's absolute parent
 * offset — the same frame collectVertices and the committed waypoints use — so
 * the core can route an unconnected end to the exact point the drag preview
 * showed (computeRoutes' sourcePoint/targetPoint).
 */
LibavoidRouting.danglingPoint = function(graph, edge, source)
{
	var geo = graph.getModel().getGeometry(edge);
	var p = (geo != null) ? geo.getTerminalPoint(source) : null;

	if (p == null)
	{
		return null;
	}

	var off = LibavoidRouting.getAbsoluteParentOffset(graph, edge);

	return {x: p.x + off.x, y: p.y + off.y};
};

LibavoidRouting.routeCells = function(graph, Avoid, edgeCells, opts, setStyle)
{
	var model = graph.getModel();
	var vertices = LibavoidRouting.collectVertices(graph);
	var edges = [];
	var byId = Object.create(null);
	var added = Object.create(null);
	var i;

	for (i = 0; i < edgeCells.length; i++)
	{
		var c = edgeCells[i];

		if (c == null || !model.isEdge(c))
		{
			continue;
		}

		var s = model.getTerminal(c, true);
		var t = model.getTerminal(c, false);
		var sVertex = (s != null && model.isVertex(s));
		var tVertex = (t != null && model.isVertex(t));

		// A DANGLING end (no terminal vertex) routes to its free point, so a
		// committed edge with one unconnected end matches its drag preview
		// (which routes source-vertex -> free Point via the warm session).
		var sPoint = sVertex ? null : LibavoidRouting.danglingPoint(graph, c, true);
		var tPoint = tVertex ? null : LibavoidRouting.danglingPoint(graph, c, false);

		// Need at least one real vertex end (like the preview, which routes from a
		// fixed shape); an edge dangling at BOTH ends is left alone.
		if ((sVertex || sPoint != null) && (tVertex || tPoint != null) &&
			(sVertex || tVertex))
		{
			// transparentBounds terminals are not in collectVertices —
			// register their derived hull so the core can route from/to them.
			if (sVertex) { LibavoidRouting.addTerminalVertex(graph, vertices, added, s); }
			if (tVertex) { LibavoidRouting.addTerminalVertex(graph, vertices, added, t); }

			// getCellStyle (parses the cell's current style string), NOT
			// getCurrentCellStyle (the cached state style): on a fresh insert the
			// state hasn't re-validated yet, so its cached style is missing the
			// exitX/entryX that setConnectionConstraint just set. A dangling end
			// takes no constraint/pin/mask/jetty — it's a bare free point.
			var st = graph.getCellStyle(c);
			edges.push({id: c.getId(),
				source: sVertex ? s.getId() : null,
				target: tVertex ? t.getId() : null,
				sourcePoint: sPoint, targetPoint: tPoint,
				sourceConstraint: sVertex ? LibavoidRouting.fixedConstraint(st, true) : null,
				targetConstraint: tVertex ? LibavoidRouting.fixedConstraint(st, false) : null,
				sourcePoints: sVertex ? LibavoidRouting.snapPoints(graph, s, st, graph.getCellStyle(s)) : null,
				targetPoints: tVertex ? LibavoidRouting.snapPoints(graph, t, st, graph.getCellStyle(t)) : null,
				sourceSides: sVertex ? LibavoidRouting.maskSides(st, graph.getCellStyle(s), true) : null,
				targetSides: tVertex ? LibavoidRouting.maskSides(st, graph.getCellStyle(t), false) : null,
				sourceJetty: sVertex ? LibavoidRouting.jettyFor(st, true) : 0,
				targetJetty: tVertex ? LibavoidRouting.jettyFor(st, false) : 0});
			byId[c.getId()] = c;
		}
	}

	if (edges.length == 0)
	{
		return false;
	}

	// Route via the configured strategy (independentRouting). Independent per-edge
	// solves route competing edges deterministically (no live-preview oscillation) at
	// the cost of edge-edge nudging; the multi-edge path nudges but is non-deterministic
	// for competing edges. Same strategy here as in the preview, so they match.
	var routes = LibavoidRouting.routeEdgeSet(Avoid, vertices, edges, opts);
	var routedEdges = [];

	// libavoid waypoints are absolute; convert to each edge's parent frame.
	for (var id in routes)
	{
		var edge = byId[id];

		if (edge == null)
		{
			continue;
		}

		var wpsAbs = routes[id];
		var off = LibavoidRouting.getAbsoluteParentOffset(graph, edge);
		var pts = [];

		for (var k = 0; k < wpsAbs.length; k++)
		{
			pts.push(new mxPoint(wpsAbs[k].x - off.x, wpsAbs[k].y - off.y));
		}

		var newPoints = (pts.length > 0) ? pts : null;
		var geo = model.getGeometry(edge);

		// Skip the model write when the route is unchanged: setGeometry only
		// reference-compares, so a fresh clone would always record an
		// mxGeometryChange (undo noise, dirty flag, redundant collab deltas) even for
		// a byte-identical route — common because collectOverlappingEdges is
		// deliberately over-inclusive. Still track the edge (for the style pass below).
		if (geo == null || !LibavoidRouting.samePoints(geo.points, newPoints))
		{
			geo = (geo != null) ? geo.clone() : new mxGeometry();
			geo.points = newPoints;
			model.setGeometry(edge, geo);
		}

		routedEdges.push(edge);
	}

	if (routedEdges.length > 0 && setStyle)
	{
		// Keep orthogonalEdgeStyle (libavoid is already orthogonal) so segments
		// stay draggable; leave endpoints floating — each route meets a shape at
		// a side midpoint, which is where a floating orthogonal endpoint connects.
		graph.setCellStyles(mxConstants.STYLE_EDGE, 'orthogonalEdgeStyle', routedEdges);
		graph.setCellStyles(mxConstants.STYLE_CURVED, '0', routedEdges);
	}

	return routedEdges.length > 0;
};

/**
 * Every vertex as a libavoid obstacle, in absolute model coordinates.
 */
LibavoidRouting.collectVertices = function(graph)
{
	var model = graph.getModel();
	var vertices = [];

	for (var id in model.cells)
	{
		var c = model.cells[id];

		if (c != null && model.isVertex(c))
		{
			// transparentBounds groups (Mermaid/PlantUML wrappers, layout
			// containers) are not general obstacles: their children are
			// obstacles individually and the padding band inside the hull
			// stays crossable. As a routed edge's TERMINAL the derived
			// hull is registered ad hoc — see addTerminalVertex.
			if (graph.isTransparentBounds(c))
			{
				continue;
			}

			var b = LibavoidRouting.getAbsoluteModelBounds(graph, c);

			if (b != null && b.w > 0 && b.h > 0)
			{
				vertices.push({id: id, x: b.x, y: b.y, w: b.w, h: b.h});
			}
		}
	}

	return vertices;
};

/**
 * Registers a routed edge's transparentBounds terminal as an obstacle:
 * collectVertices skips these hulls (not general obstacles), but the core
 * resolves terminal boxes from the obstacle list by id — without an entry
 * the edge is silently dropped (bounds[id] == null in computeRoutes). The
 * derived hull is the box the view renders, so anchors, mask pins and jetty
 * stubs land where the user sees them; filterEnclosing never drops a routed
 * edge's own terminals, so for its own edge the hull always stays. No-op for
 * other cells; added dedupes across calls (collectVertices never emits
 * transparentBounds entries, so only appended ids can repeat).
 */
LibavoidRouting.addTerminalVertex = function(graph, vertices, added, cell)
{
	if (cell == null || !graph.getModel().isVertex(cell) ||
		!graph.isTransparentBounds(cell))
	{
		return;
	}

	var id = cell.getId();

	if (added[id])
	{
		return;
	}

	added[id] = true;

	var b = LibavoidRouting.getAbsoluteModelBounds(graph, cell);

	if (b != null && b.w > 0 && b.h > 0)
	{
		vertices.push({id: id, x: b.x, y: b.y, w: b.w, h: b.h});
	}
};

/**
 * Absolute model-coordinate offset of a cell's parent chain. Geometry is stored
 * relative to the parent; for flat diagrams (parent = the default layer) this is
 * {0,0}, but a cell nested in a container needs its ancestors' positions summed.
 * Stops at the layer (non-vertex). Ported from drawio-mcp.
 */
LibavoidRouting.getAbsoluteParentOffset = function(graph, cell)
{
	var model = graph.getModel();
	var x = 0, y = 0;
	var p = model.getParent(cell);

	while (p != null && model.isVertex(p))
	{
		var pg = model.getGeometry(p);

		if (pg != null)
		{
			x += pg.x;
			y += pg.y;
		}

		p = model.getParent(p);
	}

	return {x: x, y: y};
};

/**
 * A vertex's bounds in absolute model coordinates (geometry + parent offset).
 * For a transparentBounds cell the stored geometry is a pinned origin by
 * design ((0,0,0,0) for layout containers) — its routing box is the DERIVED
 * hull the view renders (children + padding, Graph.getTransparentBounds, in
 * the cell's local space), shifted by that origin. Ported from drawio-mcp.
 */
LibavoidRouting.getAbsoluteModelBounds = function(graph, cell)
{
	var geo = graph.getModel().getGeometry(cell);

	if (geo == null)
	{
		return null;
	}

	var off = LibavoidRouting.getAbsoluteParentOffset(graph, cell);

	if (graph.isTransparentBounds(cell))
	{
		var local = graph.getTransparentBounds(cell);

		return (local == null) ? null : {x: geo.x + off.x + local.x,
			y: geo.y + off.y + local.y, w: local.width, h: local.height};
	}

	return {x: geo.x + off.x, y: geo.y + off.y, w: geo.width, h: geo.height};
};

/**
 * The bounding box of an edge's route in ABSOLUTE MODEL coords — source + target
 * centres plus any waypoints. Used to detect auto-edges a moved shape overlaps.
 * Returns {x, y, width, height} (a coarse over-approximation; harmless since
 * re-routing is idempotent) or null if either terminal isn't a vertex.
 */
LibavoidRouting.edgeRouteBounds = function(graph, edge)
{
	var model = graph.getModel();
	var s = model.getTerminal(edge, true);
	var t = model.getTerminal(edge, false);
	var sVertex = (s != null && model.isVertex(s));
	var tVertex = (t != null && model.isVertex(t));

	// A dangling end contributes its free point (not a terminal centre) to the
	// route bbox, so a moved shape still detects the auto-edge it's connected to.
	// Need at least one vertex end.
	if (!sVertex && !tVertex)
	{
		return null;
	}

	var sb = sVertex ? LibavoidRouting.getAbsoluteModelBounds(graph, s) : null;
	var tb = tVertex ? LibavoidRouting.getAbsoluteModelBounds(graph, t) : null;
	var sPt = sVertex ? null : LibavoidRouting.danglingPoint(graph, edge, true);
	var tPt = tVertex ? null : LibavoidRouting.danglingPoint(graph, edge, false);

	if ((sVertex && sb == null) || (tVertex && tb == null) ||
		(sPt == null && !sVertex) || (tPt == null && !tVertex))
	{
		return null;
	}

	var scx = sVertex ? sb.x + sb.w / 2 : sPt.x, scy = sVertex ? sb.y + sb.h / 2 : sPt.y;
	var tcx = tVertex ? tb.x + tb.w / 2 : tPt.x, tcy = tVertex ? tb.y + tb.h / 2 : tPt.y;
	var minX = Math.min(scx, tcx), maxX = Math.max(scx, tcx);
	var minY = Math.min(scy, tcy), maxY = Math.max(scy, tcy);

	var geo = model.getGeometry(edge);

	if (geo != null && geo.points != null)
	{
		var off = LibavoidRouting.getAbsoluteParentOffset(graph, edge);

		for (var k = 0; k < geo.points.length; k++)
		{
			if (geo.points[k] == null)
			{
				continue;
			}

			var px = geo.points[k].x + off.x, py = geo.points[k].y + off.y;
			minX = Math.min(minX, px); maxX = Math.max(maxX, px);
			minY = Math.min(minY, py); maxY = Math.max(maxY, py);
		}
	}

	return {x: minX, y: minY, width: maxX - minX, height: maxY - minY};
};

// ── Live endpoint-drag preview (tier 2) ──────────────────────────────────────
// While the user drags an edge's source/target handle, route the dashed preview
// EXACTLY the way the drop commits. Wired from mxEdgeSegmentHandler.getPreviewPoints
// (orthogonal edges use that handler) and mxEdgeHandler.reset in
// grapheditor/Graph.js. Only for flagged edges with no manual waypoints; requires
// the WASM warm (window.Avoid) — synchronous, no async preview.
//
// The route is computed in ABSOLUTE MODEL coords over ALL model vertices
// (collectVertices, buffer 16) for a single connector
// fixedCellCenter -> (targetCellCenter when hovering a target, else cursor-model
// point), and bends are converted to control points via getAbsoluteParentOffset —
// byte-for-byte the same pipeline as routeCells/computeRoutes. When the cursor is
// over a valid target cell, the preview connector is identical to the one the
// commit builds (fixed center -> target center over the same obstacles + buffer),
// so the preview route == the committed route.
//
// A warm per-drag Router is kept on the handler: obstacles are registered once in
// MODEL coords; only the dragged ConnEnd is moved each frame (cheap re-solve). A
// ~30ms throttle bounds the per-frame cost; the warm Router is freed in
// endPreview (mxEdgeHandler.reset).

// Min ms between preview re-solves (between them the last result is reused).
LibavoidRouting.previewThrottleMs = 30;

/**
 * Fresh obstacle-avoiding route between two cells — the SAME computeRoutes call the
 * commit (routeCells) makes, so a preview built from it is byte-identical to the
 * dropped route. Used for the PINNED previews: a fixed ShapeConnectionPin can't be
 * moved like a floating endpoint, and re-pinning the warm per-drag session every
 * frame piles stale pins on the shape and corrupts the route (libavoid degenerates
 * to a straight 2-point line). Returns interior bends in ABSOLUTE model coords.
 */
LibavoidRouting.previewRouteToCell = function(graph, Avoid, sourceCell, targetCell, srcConstr, dstConstr, srcJetty, dstJetty, srcSides, dstSides, srcPoints, dstPoints)
{
	if (sourceCell == null || targetCell == null || sourceCell == targetCell)
	{
		return [];
	}

	var vertices = LibavoidRouting.collectVertices(graph);
	var added = Object.create(null);

	// transparentBounds terminals are registered ad hoc, like the commit.
	LibavoidRouting.addTerminalVertex(graph, vertices, added, sourceCell);
	LibavoidRouting.addTerminalVertex(graph, vertices, added, targetCell);

	var routes = LibavoidRouting.computeRoutes(Avoid, vertices, [{
		id: 'preview', source: sourceCell.getId(), target: targetCell.getId(),
		sourceConstraint: srcConstr || null, targetConstraint: dstConstr || null,
		sourcePoints: srcPoints || null, targetPoints: dstPoints || null,
		sourceSides: srcSides || null, targetSides: dstSides || null,
		sourceJetty: srcJetty || 0, targetJetty: dstJetty || 0
	}], null);

	return routes['preview'] || [];
};

/**
 * Fresh commit-parity solve from the fixed cell to a FREE POINT — used when
 * the cursor tracks over empty space INSIDE an obstacle, where the warm
 * session's escape route and incremental state diverge from the fresh solve
 * the commit runs. Mirrors routeCells' dangling-end descriptor exactly, so
 * releasing the endpoint there commits this route: the dragged end is a bare
 * free point with no constraint, pins, mask or jetty.
 */
LibavoidRouting.previewRouteToPoint = function(graph, Avoid, fixedCell, draggingSource, point, fixedConstr, fixedJetty, fixedSides, fixedPoints)
{
	if (fixedCell == null || point == null)
	{
		return [];
	}

	var vertices = LibavoidRouting.collectVertices(graph);

	// transparentBounds terminals are registered ad hoc, like the commit.
	LibavoidRouting.addTerminalVertex(graph, vertices, Object.create(null), fixedCell);

	var fixedId = fixedCell.getId();
	var edge = (draggingSource) ?
		{id: 'preview', source: null, target: fixedId,
			sourcePoint: {x: point.x, y: point.y}, targetPoint: null,
			sourceConstraint: null, targetConstraint: fixedConstr || null,
			sourcePoints: null, targetPoints: fixedPoints || null,
			sourceSides: null, targetSides: fixedSides || null,
			sourceJetty: 0, targetJetty: fixedJetty || 0} :
		{id: 'preview', source: fixedId, target: null,
			sourcePoint: null, targetPoint: {x: point.x, y: point.y},
			sourceConstraint: fixedConstr || null, targetConstraint: null,
			sourcePoints: fixedPoints || null, targetPoints: null,
			sourceSides: fixedSides || null, targetSides: null,
			sourceJetty: fixedJetty || 0, targetJetty: 0};

	var routes = LibavoidRouting.computeRoutes(Avoid, vertices, [edge], null);

	return routes['preview'] || [];
};

/**
 * Toggle the warm preview session's fixed-end jetty checkpoint to match what the
 * commit would do: applied while the dragged endpoint is at least the fixed
 * end's jetty away from its anchor (computeRoutes' too-short guard), cleared
 * when closer. No-op when the fixed end has no stub (sess.fixedCp == null).
 * Called on every re-solve BEFORE the endpoint move; both preview paths share it.
 */
LibavoidRouting.updatePreviewCheckpoint = function(sess, Avoid, dragModel)
{
	if (sess.fixedCp == null)
	{
		return;
	}

	var dx = dragModel.x - sess.fixedAnchor.x;
	var dy = dragModel.y - sess.fixedAnchor.y;
	var want = dx * dx + dy * dy >= sess.fixedJetty * sess.fixedJetty;

	if (want == sess.cpApplied)
	{
		return;
	}

	// An empty vector clears the connector's checkpoints; the vector is copied,
	// so free the embind wrappers (cf. computeRoutes' addCheckpoint).
	var cps = new Avoid.CheckpointVector();

	if (want)
	{
		var pt = new Avoid.Point(sess.fixedCp.x, sess.fixedCp.y);
		var cp = new Avoid.Checkpoint(pt);
		cps.push_back(cp);
		cp.delete();
		pt.delete();
	}

	sess.conn.setRoutingCheckpoints(cps);
	cps.delete();
	sess.cpApplied = want;
};

/**
 * @returns {Array.<mxPoint>|null} preview control points (parent-relative), or
 *          null to fall back to the handler's default preview.
 */
LibavoidRouting.previewEndpointDrag = function(handler, point)
{
	if (typeof window === 'undefined' || window.Avoid == null)
	{
		return null; // not warm: no live preview (commit-time routing still runs)
	}

	if (!(handler.isSource || handler.isTarget))
	{
		return null;
	}

	var graph = handler.graph;
	var edge = handler.state.cell;

	// isAutoEdge, not just the style flag: inside a live layout container the
	// commit is the container's layout re-run, not a libavoid route — reconnect
	// does not re-parent the edge, so the current parent chain decides.
	if (!LibavoidRouting.isAutoEdge(graph, edge))
	{
		return null;
	}

	// NOTE: do NOT bail when geo.points are present. We've already confirmed the
	// edge is flagged (above), and a manual waypoint edit CLEARS the flag
	// (mxEdgeHandler.changePoints) — so a flagged edge's geo.points are always
	// libavoid's own auto-routed bends, not user waypoints. Bailing here made the
	// endpoint-drag preview fall back to the default the moment an auto-edge had
	// any bend (e.g. after it routed around an obstacle, or after a shape move
	// committed a bent route), which read as "the preview stopped working".

	// Fixed terminal (the end NOT being dragged): its STATE gives the model cell,
	// and computeRoutes uses the cell's model-coord center — same as the commit.
	var source = handler.state.getVisibleTerminalState(true);
	var target = handler.state.getVisibleTerminalState(false);
	var fixedState = handler.isSource ? target : source;

	if (fixedState == null)
	{
		return null; // need a fixed shape to route from
	}

	var fixedCell = fixedState.cell;

	if (fixedCell == null || !graph.getModel().isVertex(fixedCell))
	{
		return null;
	}

	// Prospective target cell under the cursor, resolved by the base handler's
	// previous mouseMove (getPreviewTerminalState ran AFTER getPreviewPoints, so
	// marker/constraint state here reflects the prior frame — a one-frame lag the
	// throttle already tolerates). null over empty space.
	var targetCell = LibavoidRouting.getPreviewTargetCell(handler, fixedCell);

	// Skip self-loops (target resolves back to the fixed cell).
	if (targetCell != null && targetCell == fixedCell)
	{
		return null;
	}

	var sess = handler.__libavoidPreview;

	if (sess == null)
	{
		// Fixed end's connection constraint: dragging the SOURCE leaves the TARGET
		// fixed (entryX/entryY); dragging the TARGET leaves the SOURCE fixed
		// (exitX/exitY). fixedConstraint(style, source) reads exit* when source=true,
		// so pass handler.isTarget. Same source-selector for the fixed end's jetty,
		// its snapToPoint anchor set and its port-constraint mask (an explicit
		// anchor wins over both, like the commit).
		var fixedConstr = LibavoidRouting.fixedConstraint(handler.state.style, handler.isTarget);
		var fixedSides = (fixedConstr == null) ? LibavoidRouting.maskSides(
			handler.state.style, fixedState.style, handler.isTarget) : null;
		var fixedPoints = (fixedConstr == null) ? LibavoidRouting.snapPoints(
			graph, fixedCell, handler.state.style, fixedState.style) : null;
		sess = handler.__libavoidPreview = LibavoidRouting.buildPreviewSession(
			graph, window.Avoid, fixedCell, handler.isSource, fixedConstr,
			LibavoidRouting.jettyFor(handler.state.style, handler.isTarget),
			fixedSides, fixedPoints);

		if (sess != null)
		{
			sess.fixedConstr = fixedConstr; // stable for the drag; reused by the pinned path
			// The edge's per-end jetty (stable for the drag) for the pinned path.
			sess.srcJetty = LibavoidRouting.jettyFor(handler.state.style, true);
			sess.dstJetty = LibavoidRouting.jettyFor(handler.state.style, false);
		}
	}

	if (sess == null)
	{
		return null;
	}

	// Does the dragged end snap to a FIXED connection point on the target? If so the
	// commit pins it (exitX/entryX) — preview to that anchor too, with a directed pin,
	// not the shape centre. The constraint must belong to the resolved target.
	var ch = (handler.getConstraintHandler != null) ? handler.getConstraintHandler() :
		handler.constraintHandler;
	var dragConstraint = null;

	if (targetCell != null && ch != null && ch.currentFocus != null &&
		ch.currentFocus.cell == targetCell && ch.currentConstraint != null &&
		ch.currentConstraint.point != null)
	{
		var cp = ch.currentConstraint.point;
		dragConstraint = AvoidRouting.constraintForPoint(cp.x, cp.y);
	}

	// The dragged endpoint, in ABSOLUTE MODEL coords:
	//  - snapped to a target connection point => that anchor's model position (a pin
	//    is attached below so the route enters perpendicular, like the commit).
	//  - hovering a target cell (no snap)      => the target's model-coord center.
	//  - empty space (no target)               => the cursor point in model coords.
	var dragModel;

	if (targetCell != null)
	{
		var tb = LibavoidRouting.getAbsoluteModelBounds(graph, targetCell);

		if (tb == null)
		{
			return null;
		}

		dragModel = (dragConstraint != null) ?
			{x: tb.x + dragConstraint.x * tb.w, y: tb.y + dragConstraint.y * tb.h} :
			{x: tb.x + tb.w / 2, y: tb.y + tb.h / 2};
	}
	else
	{
		dragModel = LibavoidRouting.viewToModelPoint(graph, point);
	}

	// A snapToPoint anchor set or a port-constraint mask on the hovered target
	// (dragged end): route through the fresh path with the commit's candidate
	// pins, like a snapped anchor — the warm session's per-frame endpoint move
	// can't express pins without accumulating them. An explicit anchor snap
	// wins over both (computeRoutes' makeEnd precedence).
	var dragSides = null;
	var dragPoints = null;

	if (targetCell != null && dragConstraint == null)
	{
		var dts = graph.view.getState(targetCell);
		var dtStyle = (dts != null) ? dts.style : graph.getCellStyle(targetCell);
		dragSides = LibavoidRouting.maskSides(handler.state.style, dtStyle,
			handler.isSource);
		dragPoints = LibavoidRouting.snapPoints(graph, targetCell,
			handler.state.style, dtStyle);
	}

	// Throttle: reuse the last result between re-solves (the dragged endpoint
	// itself is rendered by the handler, so only the bends lag, briefly). Re-solve
	// immediately when the dragged endpoint snaps to/from a target center, so the
	// commit-matching route appears the instant the cursor enters a shape. The
	// pinned flag is part of the key so float<->pin transitions always re-solve.
	// EVERY resolved hover target routes through the fresh path: the warm
	// session approximates a hovered cell as a free point at its centre, which
	// sits INSIDE the target's own obstacle — for large targets (a container
	// as terminal) libavoid's escape route and the warm router's incremental
	// state pick a different side than the fresh commit solve (first seen as a
	// reconnect preview entering a swimlane from below while the drop
	// committed a left-side entry). This also covers targets inside a
	// container (the commit drops the enclosing container via filterEnclosing,
	// the once-built session cannot) and transparentBounds targets (never in
	// the session's shapeRefs — the fresh path registers its derived hull
	// itself). The warm session remains for empty-space cursor tracking.
	var pinned = (targetCell != null && sess.shapeRefs != null &&
		(sess.shapeRefs[targetCell.getId()] != null ||
			graph.isTransparentBounds(targetCell)));
	// The cursor over empty space INSIDE an obstacle solves fresh too: the
	// warm free point escapes the obstacle biased by the router's route
	// history, the commit's dangling solve does not (previewRouteToPoint).
	var freePinned = (targetCell == null && sess.vertices != null &&
		AvoidRouting.insideAny(dragModel.x, dragModel.y, sess.vertices));
	var now = Date.now();

	if (sess.lastResult !== undefined && (now - sess.lastT) < LibavoidRouting.previewThrottleMs &&
		sess.lastDragX === dragModel.x && sess.lastDragY === dragModel.y &&
		sess.lastPinned === (pinned || freePinned))
	{
		return sess.lastResult;
	}

	var Avoid = window.Avoid;
	var result = [];
	var off = LibavoidRouting.getAbsoluteParentOffset(graph, edge);

	if (pinned)
	{
		// Fresh computeRoutes — byte-identical to the commit (routeCells) and free of
		// the warm session's pin accumulation (re-pinning every frame piled stale pins
		// on the target and libavoid collapsed to a straight 2-point route). Keep the
		// edge's source->target order (dragged end first when dragging the source) so
		// the preview control points line up with the committed geometry.
		var bendsAbs = handler.isSource ?
			LibavoidRouting.previewRouteToCell(graph, Avoid, targetCell, fixedCell,
				dragConstraint, sess.fixedConstr, sess.srcJetty, sess.dstJetty,
				dragSides, sess.fixedSides, dragPoints, sess.fixedPoints) :
			LibavoidRouting.previewRouteToCell(graph, Avoid, fixedCell, targetCell,
				sess.fixedConstr, dragConstraint, sess.srcJetty, sess.dstJetty,
				sess.fixedSides, dragSides, sess.fixedPoints, dragPoints);

		for (var bi = 0; bi < bendsAbs.length; bi++)
		{
			result.push(new mxPoint(bendsAbs[bi].x - off.x, bendsAbs[bi].y - off.y));
		}
	}
	else if (freePinned)
	{
		// Fresh dangling solve — same descriptor as routeCells for an
		// unconnected end, so a release at this point commits this route.
		var freeBends = LibavoidRouting.previewRouteToPoint(graph, Avoid,
			fixedCell, handler.isSource, dragModel, sess.fixedConstr,
			sess.fixedJetty, sess.fixedSides, sess.fixedPoints);

		for (var fi = 0; fi < freeBends.length; fi++)
		{
			result.push(new mxPoint(freeBends[fi].x - off.x, freeBends[fi].y - off.y));
		}
	}
	else
	{
		// Warm per-drag session: move the floating dragged endpoint and re-solve —
		// cheap, and no pins so nothing accumulates. The fixed end's jetty
		// checkpoint follows the commit's too-short guard per frame.
		LibavoidRouting.updatePreviewCheckpoint(sess, Avoid, dragModel);
		var p = new Avoid.Point(dragModel.x, dragModel.y);
		var ce = new Avoid.ConnEnd(p);

		if (sess.draggingSource)
		{
			sess.conn.setSourceEndpoint(ce);
		}
		else
		{
			sess.conn.setDestEndpoint(ce);
		}

		ce.delete();
		p.delete();
		sess.router.processTransaction();

		// Convert the absolute-model route to parent-relative control points the SAME
		// way the commit does: drop endpoints, collinear-filter in MODEL space (1px)
		// with Math.round, then subtract getAbsoluteParentOffset(edge).
		var route = sess.conn.displayRoute();
		var n = route.size();

		if (n >= 2)
		{
			var raw = [];
			var k;

			for (k = 0; k < n; k++)
			{
				var rp = route.at(k);
				raw.push({x: rp.x, y: rp.y});
			}

			for (k = 1; k < n - 1; k++)
			{
				var a = raw[k - 1], b = raw[k], c = raw[k + 1];

				// Collinear (1px, MODEL space) => redundant bend. Identical test to
				// computeRoutes' collinear().
				if (Math.abs((b.x - a.x) * (c.y - a.y) - (c.x - a.x) * (b.y - a.y)) < 1)
				{
					continue;
				}

				result.push(new mxPoint(
					Math.round(b.x) - off.x, Math.round(b.y) - off.y));
			}
		}
	}

	sess.lastT = now;
	sess.lastDragX = dragModel.x;
	sess.lastDragY = dragModel.y;
	sess.lastPinned = pinned || freePinned;
	// A successful solve is authoritative even when its route is STRAIGHT: keep the
	// (possibly empty) bend list, never collapse it to null. Empty => "preview with no
	// waypoints" (a straight line, matching the commit, which writes geo.points=null).
	// null is reserved for the not-applicable/cold early-returns above — returning it
	// here would make getPreviewPoints fall back to the DEFAULT preview, which re-reads
	// the edge's stale committed geo.points (the old route's waypoint) and draws the
	// pre-drag detour instead of the straight route the drop will produce.
	sess.lastResult = result;

	return sess.lastResult;
};

/**
 * The prospective target vertex under the cursor during an endpoint drag, or null
 * over empty space. Reads the base mxEdgeHandler's resolved drag state:
 * constraintHandler.currentFocus with a SNAPPED currentConstraint (the drop
 * will pin to that anchor), else marker.validState (a floating target STATE —
 * the drop's actual connect decision). These are set by the prior mouseMove
 * (mxEdgeHandler.getPreviewTerminalState). A focus WITHOUT a snapped
 * constraint is not a target: the focused cell merely displays its
 * connection points and the release does not connect — e.g. hovering a
 * container's body focuses the container while the marker never validates
 * it, and the drop commits a dangling end at the cursor. The fixed cell is
 * excluded so a hover over the opposite terminal isn't treated as the target.
 */
LibavoidRouting.getPreviewTargetCell = function(handler, fixedCell)
{
	var ch = (handler.getConstraintHandler != null) ? handler.getConstraintHandler() :
		handler.constraintHandler;
	var state = null;

	if (ch != null && ch.currentFocus != null && ch.currentConstraint != null)
	{
		state = ch.currentFocus;
	}
	else if (handler.marker != null)
	{
		state = (handler.marker.validState != null) ? handler.marker.validState :
			((handler.marker.getValidState != null) ? handler.marker.getValidState() : null);
	}

	if (state == null || state.cell == null)
	{
		return null;
	}

	var model = handler.graph.getModel();

	return (model.isVertex(state.cell) && state.cell != fixedCell) ? state.cell : null;
};

/**
 * Convert a scaled-view point (the getPreviewPoints `point` arg) to ABSOLUTE
 * MODEL coords — mxEdgeHandler.convertPoint's scale/translate math WITHOUT its final
 * Math.round (intentional: sub-pixel cursor tracking; bends are rounded downstream).
 * Used only for the empty-space endpoint (no target cell), so the preview tracks the
 * cursor in model space.
 */
LibavoidRouting.viewToModelPoint = function(graph, point)
{
	var view = graph.getView();
	var scale = view.getScale();
	var tr = view.getTranslate();

	return {x: point.x / scale - tr.x, y: point.y / scale - tr.y};
};

/**
 * Build a per-drag Router in ABSOLUTE MODEL coords — IDENTICAL setup to
 * computeRoutes: every model vertex as an obstacle (collectVertices), buffer 16
 * (no scale), plus one connector from the fixed cell's model-coord center to a
 * placeholder dragged endpoint. Obstacles are registered once; only the dragged
 * ConnEnd moves per frame. Construction wrappers are released; the router (which
 * owns the shapes + connector) is freed in endPreview. fixedJetty is the fixed
 * end's resolved jetty (jettyFor) — its stub checkpoint is precomputed here and
 * toggled per frame by updatePreviewCheckpoint.
 */
LibavoidRouting.buildPreviewSession = function(graph, Avoid, fixedCell, draggingSource, fixedConstraint, fixedJetty, fixedSides, fixedPoints)
{
	var router = new Avoid.Router(Avoid.RouterFlag.OrthogonalRouting.value);
	try { router.setRoutingParameter(Avoid.RoutingParameter.shapeBufferDistance, LibavoidRouting.shapeBufferDistance); } catch (e) {}
	try { router.setRoutingParameter(Avoid.RoutingParameter.idealNudgingDistance, LibavoidRouting.idealNudgingDistance); } catch (e) {}

	// Same obstacle set as the commit: all model vertices in absolute model
	// coords, minus shapes enclosing the fixed terminal (computeRoutes drops
	// the routed terminals' containers via filterEnclosing; the dragged end
	// is a free point with no bounds to test, and hover TARGETS never solve
	// here — every resolved target routes through the fresh pinned path, the
	// warm session only tracks the cursor over empty space). Keep a vertexId
	// -> ShapeRef map so the fixed terminal can anchor to a directed
	// connection pin (matching computeRoutes), not merely the shape centre.
	var fixedId = fixedCell.getId();
	var vertices = LibavoidRouting.collectVertices(graph);

	// A transparentBounds fixed terminal is not in collectVertices — register
	// its derived hull so the pin branches below get a ShapeRef, like the
	// commit (filterEnclosing keeps it: terminals are never dropped).
	LibavoidRouting.addTerminalVertex(graph, vertices, {}, fixedCell);

	vertices = AvoidRouting.filterEnclosing(vertices,
		[{source: fixedId, target: fixedId}]);
	var shapeRefs = Object.create(null);
	var i;

	for (i = 0; i < vertices.length; i++)
	{
		var v = vertices[i];
		var p1 = new Avoid.Point(v.x, v.y);
		var p2 = new Avoid.Point(v.x + v.w, v.y + v.h);
		var rect = new Avoid.Rectangle(p1, p2);
		shapeRefs[v.id] = new Avoid.ShapeRef(router, rect); // owned by router (freed on router.delete)
		rect.delete();
		p1.delete();
		p2.delete();
	}

	var fb = LibavoidRouting.getAbsoluteModelBounds(graph, fixedCell);

	if (fb == null)
	{
		router.delete();
		return null;
	}

	var fx = fb.x + fb.w / 2, fy = fb.y + fb.h / 2;

	// Fixed terminal (the end NOT being dragged): if it carries a fixed connection
	// point, route to a directed ShapeConnectionPin (same as computeRoutes) so the
	// preview leaves/enters the anchor exactly like the dropped route — otherwise the
	// preview floated to the shape centre and snapped to the anchor only on release.
	// A snapToPoint anchor set or a port-constraint MASK on the fixed end gets the
	// commit's candidate pins instead (created once here, so nothing accumulates
	// over the drag) — the preview then leaves through a declared anchor / an
	// allowed side like the dropped route. Same precedence as computeRoutes'
	// makeEnd: constraint > snap points > mask.
	var fixedRef = shapeRefs[fixedCell.getId()];
	var fixedEnd;

	if (fixedConstraint != null && fixedConstraint.dir != null && fixedRef != null)
	{
		new Avoid.ShapeConnectionPin(fixedRef, 1, fixedConstraint.x, fixedConstraint.y, true, 0, fixedConstraint.dir);
		fixedEnd = new Avoid.ConnEnd(fixedRef, 1);
	}
	else if (fixedPoints != null && fixedPoints.length > 0 && fixedRef != null)
	{
		for (var fq = 0; fq < fixedPoints.length; fq++)
		{
			var qpin = new Avoid.ShapeConnectionPin(fixedRef, 1,
				fixedPoints[fq].x, fixedPoints[fq].y, true, 0, fixedPoints[fq].dir);
			qpin.setExclusive(false);
		}

		fixedEnd = new Avoid.ConnEnd(fixedRef, 1);
	}
	else if (fixedSides != null && fixedSides.length > 0 && fixedRef != null)
	{
		for (var fs = 0; fs < fixedSides.length; fs++)
		{
			var fpts = AvoidRouting.maskPinPoints(fixedSides[fs], fb);

			for (var fp = 0; fp < fpts.length; fp++)
			{
				var fpin = new Avoid.ShapeConnectionPin(fixedRef, 1,
					fpts[fp].x, fpts[fp].y, true, 0, fpts[fp].dir);
				fpin.setExclusive(false);
			}
		}

		fixedEnd = new Avoid.ConnEnd(fixedRef, 1);
	}
	else
	{
		var fc = new Avoid.Point(fx, fy);
		fixedEnd = new Avoid.ConnEnd(fc);
		fc.delete();
	}

	var dp = new Avoid.Point(fx, fy);
	var draggedEnd = new Avoid.ConnEnd(dp);
	dp.delete();

	var se = draggingSource ? draggedEnd : fixedEnd;
	var de = draggingSource ? fixedEnd : draggedEnd;
	var conn = new Avoid.ConnRef(router, se, de);
	fixedEnd.delete();
	draggedEnd.delete();

	// Jetty stub for the pinned fixed end (commit parity — see computeRoutes):
	// computed once here, applied/cleared per frame by updatePreviewCheckpoint,
	// because the commit's too-short guard depends on the moving dragged end.
	var fixedCp = null;
	var fixedAnchor = null;

	if (fixedConstraint != null && fixedConstraint.dir != null && fixedRef != null)
	{
		fixedAnchor = {x: fb.x + fixedConstraint.x * fb.w,
			y: fb.y + fixedConstraint.y * fb.h};
		// No stub when the anchor is buried under another shape — commit
		// parity with computeRoutes' buried-anchor skip.
		fixedCp = AvoidRouting.insideAny(fixedAnchor.x, fixedAnchor.y, vertices) ? null :
			AvoidRouting.jettyStub(fixedConstraint, fixedJetty, fb, vertices,
				LibavoidRouting.shapeBufferDistance);
	}

	// vertices: the session's obstacle list, for the cursor-inside-obstacle
	// test that routes such free points through the fresh path.
	return {router: router, conn: conn, draggingSource: draggingSource, shapeRefs: shapeRefs,
		vertices: vertices, fixedCp: fixedCp, fixedAnchor: fixedAnchor, fixedJetty: fixedJetty,
		fixedSides: fixedSides || null, fixedPoints: fixedPoints || null, cpApplied: false};
};

/**
 * Tear down the per-drag preview Router (frees its WASM shapes + connector).
 * Wired from mxEdgeHandler.reset (endpoint drag) and mxConnectionHandler.reset
 * (new-edge drag).
 */
LibavoidRouting.endPreview = function(handler)
{
	if (handler != null && handler.__libavoidPreview != null)
	{
		try { handler.__libavoidPreview.router.delete(); } catch (e) {}
		handler.__libavoidPreview = null;
	}
};

/**
 * Live route for a NEW edge dragged from the connection handler (hover-icon blue
 * arrows). When the preview edge carries libavoidRouting=1 (libavoid is the
 * current edge style), routes it source-centre -> target-cell-centre (or cursor)
 * around obstacles — the same model-coord pipeline as the commit. Returns the
 * interior bend points in ABSOLUTE MODEL coords (mxPoint[]) or null. Reuses the
 * warm per-drag session (freed in endPreview on mxConnectionHandler.reset).
 */
LibavoidRouting.connectionPreview = function(handler)
{
	if (typeof window === 'undefined' || window.Avoid == null)
	{
		return null;
	}

	var es = handler.edgeState;

	if (es == null || mxUtils.getValue(es.style, LibavoidRouting.STYLE, null) != '1')
	{
		return null;
	}

	var graph = handler.graph;
	var model = graph.getModel();
	var sourceState = handler.previous;

	if (sourceState == null || sourceState.cell == null || !model.isVertex(sourceState.cell))
	{
		return null;
	}

	var sess = handler.__libavoidPreview;

	if (sess == null)
	{
		// Source's fixed exit, if the drag started on a connection point
		// (handler.sourceConstraint; the commit pins it via setConnectionConstraint).
		// Usually null for a hover-icon drag => source floats to centre, like the commit.
		var srcConstr = null;

		if (handler.sourceConstraint != null && handler.sourceConstraint.point != null)
		{
			var sp = handler.sourceConstraint.point;
			srcConstr = AvoidRouting.constraintForPoint(sp.x, sp.y);
		}

		// The source's snapToPoint anchor set and port-constraint mask, unless
		// the drag started on an explicit anchor (which wins, like the commit).
		var srcSides = (srcConstr == null) ? LibavoidRouting.maskSides(
			es.style, sourceState.style, true) : null;
		var srcPoints = (srcConstr == null) ? LibavoidRouting.snapPoints(
			graph, sourceState.cell, es.style, sourceState.style) : null;

		sess = handler.__libavoidPreview = LibavoidRouting.buildPreviewSession(
			graph, window.Avoid, sourceState.cell, false, srcConstr,
			LibavoidRouting.jettyFor(es.style, true), srcSides, srcPoints);

		if (sess != null)
		{
			sess.srcConstr = srcConstr; // stable for the drag; reused by the pinned path
			// The preview edge's per-end jetty (stable for the drag) for the pinned path.
			sess.srcJetty = LibavoidRouting.jettyFor(es.style, true);
			sess.dstJetty = LibavoidRouting.jettyFor(es.style, false);
		}
	}

	if (sess == null)
	{
		return null;
	}

	var targetState = handler.currentState;
	var targetCell = (targetState != null && model.isVertex(targetState.cell)) ? targetState.cell : null;

	// Both ends inside the same live layout container => the connect inserts the
	// edge into that container (common parent) and its childLayout routes it, so
	// a libavoid preview would show a route that never commits. Cross-boundary
	// drags (target outside, edge lands in the default parent) keep the preview.
	if (targetCell != null)
	{
		var slc = LibavoidRouting.layoutContainerOf(graph, sourceState.cell);

		if (slc != null && slc == LibavoidRouting.layoutContainerOf(graph, targetCell))
		{
			return null;
		}
	}

	// Dragged (dest) end snapped to a fixed connection point on the target? The
	// commit pins it (constraintHandler.currentConstraint, setConnectionConstraint) —
	// preview to that anchor with a directed pin, else to the shape centre.
	var ch = handler.constraintHandler;
	var dragConstraint = null;

	if (targetCell != null && ch != null && ch.currentFocus != null &&
		ch.currentFocus.cell == targetCell && ch.currentConstraint != null &&
		ch.currentConstraint.point != null)
	{
		var cp = ch.currentConstraint.point;
		dragConstraint = AvoidRouting.constraintForPoint(cp.x, cp.y);
	}

	// Dragged (dest) endpoint in model coords: snapped anchor pos, else target centre
	// (matches the committed route), else the cursor point over empty space.
	var dragModel;

	if (targetCell != null)
	{
		var tb = LibavoidRouting.getAbsoluteModelBounds(graph, targetCell);

		if (tb == null)
		{
			return null;
		}

		dragModel = (dragConstraint != null) ?
			{x: tb.x + dragConstraint.x * tb.w, y: tb.y + dragConstraint.y * tb.h} :
			{x: tb.x + tb.w / 2, y: tb.y + tb.h / 2};
	}
	else if (handler.currentPoint != null)
	{
		dragModel = LibavoidRouting.viewToModelPoint(graph, handler.currentPoint);
	}
	else
	{
		return null;
	}

	// A snapToPoint anchor set or a port-constraint mask on the hovered target
	// routes through the fresh path with the commit's candidate pins (an
	// explicit anchor snap wins over both).
	var dragSides = null;
	var dragPoints = null;

	if (targetCell != null && dragConstraint == null)
	{
		var tgStyle = (targetState != null) ? targetState.style :
			graph.getCellStyle(targetCell);
		dragSides = LibavoidRouting.maskSides(es.style, tgStyle, false);
		dragPoints = LibavoidRouting.snapPoints(graph, targetCell, es.style, tgStyle);
	}

	// EVERY resolved hover target routes through the fresh path — the warm
	// session's free-point-at-centre approximation sits inside the target's
	// own obstacle and inherits the warm router's incremental state, both of
	// which can pick a different entry side than the fresh commit solve (see
	// previewEndpointDrag). The warm session remains for cursor tracking
	// over empty space. A transparentBounds target is never in the session's
	// shapeRefs — the fresh path registers its derived hull itself.
	var pinned = (targetCell != null && sess.shapeRefs != null &&
		(sess.shapeRefs[targetCell.getId()] != null ||
			graph.isTransparentBounds(targetCell)));
	// The cursor over empty space INSIDE an obstacle solves fresh too (see
	// previewEndpointDrag).
	var freePinned = (targetCell == null && sess.vertices != null &&
		AvoidRouting.insideAny(dragModel.x, dragModel.y, sess.vertices));
	var now = Date.now();

	if (sess.lastResult !== undefined && (now - sess.lastT) < LibavoidRouting.previewThrottleMs &&
		sess.lastDragX === dragModel.x && sess.lastDragY === dragModel.y &&
		sess.lastPinned === (pinned || freePinned))
	{
		return sess.lastResult;
	}

	var Avoid = window.Avoid;
	var out = [];

	if (pinned)
	{
		// Fresh computeRoutes — byte-identical to the commit (routeCells), and free of
		// the warm session's pin accumulation (re-pinning every frame piled stale pins
		// on the target and libavoid collapsed to a straight 2-point route).
		var bendsAbs = LibavoidRouting.previewRouteToCell(graph, Avoid,
			sourceState.cell, targetCell, sess.srcConstr, dragConstraint,
			sess.srcJetty, sess.dstJetty, sess.fixedSides, dragSides,
			sess.fixedPoints, dragPoints);

		for (var bi = 0; bi < bendsAbs.length; bi++)
		{
			out.push(new mxPoint(bendsAbs[bi].x, bendsAbs[bi].y));
		}
	}
	else if (freePinned)
	{
		// Fresh dangling solve — same descriptor as routeCells for an
		// unconnected end, so a release at this point commits this route.
		var freeBends = LibavoidRouting.previewRouteToPoint(graph, Avoid,
			sourceState.cell, false, dragModel, sess.srcConstr,
			sess.fixedJetty, sess.fixedSides, sess.fixedPoints);

		for (var fi = 0; fi < freeBends.length; fi++)
		{
			out.push(new mxPoint(freeBends[fi].x, freeBends[fi].y));
		}
	}
	else
	{
		// Warm per-drag session: move the floating dest endpoint (cursor / target
		// centre) and re-solve — cheap, and no pins so nothing accumulates. The
		// fixed end's jetty checkpoint follows the commit's too-short guard.
		LibavoidRouting.updatePreviewCheckpoint(sess, Avoid, dragModel);
		var p = new Avoid.Point(dragModel.x, dragModel.y);
		var ce = new Avoid.ConnEnd(p);
		sess.conn.setDestEndpoint(ce);
		ce.delete();
		p.delete();
		sess.router.processTransaction();

		// Interior bends in ABSOLUTE MODEL coords, dropping endpoints + collinear bends.
		var route = sess.conn.displayRoute();
		var n = route.size();

		if (n >= 2)
		{
			var raw = [];
			var k;

			for (k = 0; k < n; k++)
			{
				var rp = route.at(k);
				raw.push({x: rp.x, y: rp.y});
			}

			for (k = 1; k < n - 1; k++)
			{
				var a = raw[k - 1], b = raw[k], c = raw[k + 1];

				if (Math.abs((b.x - a.x) * (c.y - a.y) - (c.x - a.x) * (b.y - a.y)) < 1)
				{
					continue;
				}

				out.push(new mxPoint(Math.round(b.x), Math.round(b.y)));
			}
		}
	}

	sess.lastT = now;
	sess.lastDragX = dragModel.x;
	sess.lastDragY = dragModel.y;
	sess.lastPinned = pinned || freePinned;
	sess.lastResult = (out.length > 0) ? out : null;

	return sess.lastResult;
};

/**
 * Apply the connection-handler preview route to handler.edgeState: store the
 * bends on the PREVIEW edge's geometry (so mxConnectionHandler.connect copies the
 * route onto the committed edge — it does setGeometry(edge, edgeState.cell.geometry)
 * after insert) AND re-run the edge style so the dashed preview renders orthogonally
 * routed via the connection handler's OWN waypoint machinery.
 *
 * The bends are fed in as handler.waypoints (in scaled-VIEW coords, the space
 * mxConnectionHandler uses): the base updateEdgeState then routes the preview
 * through them with orthogonalEdgeStyle — identical to user-added waypoints, so
 * the endpoint segments stay orthogonal (setting absolutePoints directly left
 * diagonal endpoints) — and mxConnectionHandler.connect bakes them into the
 * committed edge's geometry.points. Returns the waypoints (mxPoint[] in view
 * coords), or null for a straight route / unflagged edge / cold WASM.
 */
LibavoidRouting.connectionWaypoints = function(handler)
{
	var es = handler.edgeState;

	if (es == null || mxUtils.getValue(es.style, LibavoidRouting.STYLE, null) != '1')
	{
		return null;
	}

	var bends = LibavoidRouting.connectionPreview(handler); // absolute model coords

	if (bends == null || bends.length == 0)
	{
		return null;
	}

	var view = handler.graph.view;
	var scale = view.scale, tr = view.translate;
	var wp = [];

	for (var i = 0; i < bends.length; i++)
	{
		wp.push(new mxPoint((bends[i].x + tr.x) * scale, (bends[i].y + tr.y) * scale));
	}

	return wp;
};

/**
 * One obstacle-avoiding solve for a shape-move preview at drag delta (mdx,mdy) in
 * MODEL coords: the affected edge set (connected auto-edges of the moving shapes PLUS
 * edges whose route a moving shape now overlaps) routed (via routeEdgeSet — the
 * configured strategy) with the moving shapes at their preview position. Returns
 * {routes:{edgeId->absolute bends}, byId:{edgeId->edge cell}} or null when there are
 * no routable edges. The SAME pipeline + strategy as the commit (onMoveResize/
 * routeCells), so the dropped route matches the preview (and with independent
 * per-edge routing it's deterministic, with no caching needed).
 *
 * Edges that move RIGIDLY with the drag (edge and both terminals in the moving
 * set — e.g. the whole container/selection dragged) are skipped: the base
 * preview has already translated their displayed route, which IS the correct
 * preview, and a fresh solve would visibly replace it for no reason. They are
 * re-routed only when their translated route could newly conflict with a
 * STATIONARY obstacle (buffer-inflated bbox test).
 */
LibavoidRouting.solveMovePreview = function(graph, handler, mdx, mdy)
{
	var model = graph.getModel();
	var id, c, i;
	var map = Object.create(null);
	var regions = [];

	for (id in model.cells)
	{
		c = model.cells[id];

		if (c == null || !model.isVertex(c) || !handler.isCellMoving(c))
		{
			continue;
		}

		var conn = model.getEdges(c);

		for (i = 0; i < conn.length; i++)
		{
			if (LibavoidRouting.isAutoEdge(graph, conn[i]))
			{
				map[conn[i].getId()] = conn[i];
			}
		}

		var mb = LibavoidRouting.getAbsoluteModelBounds(graph, c);

		if (mb != null)
		{
			var nx = mb.x + mdx, ny = mb.y + mdy;
			var rx = Math.min(mb.x, nx), ry = Math.min(mb.y, ny);
			regions.push({x: rx, y: ry,
				width: Math.max(mb.x + mb.w, nx + mb.w) - rx,
				height: Math.max(mb.y + mb.h, ny + mb.h) - ry});
		}
	}

	LibavoidRouting.collectOverlappingEdges(graph, regions, map);

	var hasEdges = false;

	for (id in map)
	{
		hasEdges = true;
		break;
	}

	if (!hasEdges)
	{
		return null;
	}

	// Obstacles: the SAME collection as the commit (collectVertices, incl. its
	// transparentBounds skip), moving ones at their preview position (model
	// bounds + the drag delta in model coords). Stationary ones are kept aside
	// for the rigid-translation test below.
	var vertices = LibavoidRouting.collectVertices(graph);
	var added = Object.create(null);

	// transparentBounds terminals of the affected edges are registered ad hoc,
	// like the commit — before the preview shift below, so a moving container
	// hull rides the drag like any obstacle.
	for (id in map)
	{
		LibavoidRouting.addTerminalVertex(graph, vertices, added,
			model.getTerminal(map[id], true));
		LibavoidRouting.addTerminalVertex(graph, vertices, added,
			model.getTerminal(map[id], false));
	}

	var stationary = [];

	for (i = 0; i < vertices.length; i++)
	{
		c = model.getCell(vertices[i].id);

		if (c != null && handler.isCellMoving(c))
		{
			vertices[i].x += mdx;
			vertices[i].y += mdy;
		}
		else
		{
			stationary.push(vertices[i]);
		}
	}

	var buffer = LibavoidRouting.shapeBufferDistance;
	var edgeArray = [];
	var byId = Object.create(null);

	for (id in map)
	{
		c = map[id];
		var s = model.getTerminal(c, true);
		var t = model.getTerminal(c, false);
		var sVertex = (s != null && model.isVertex(s));
		var tVertex = (t != null && model.isVertex(t));

		// A dangling end re-routes to its (stationary) free point when the
		// connected shape moves — same as routeCells. Need one vertex end.
		var sPoint = sVertex ? null : LibavoidRouting.danglingPoint(graph, c, true);
		var tPoint = tVertex ? null : LibavoidRouting.danglingPoint(graph, c, false);

		// The free point rides the drag when the edge itself moves, as the
		// commit translates the edge geometry including its terminal points
		if (handler.isCellMoving(c))
		{
			if (sPoint != null)
			{
				sPoint.x += mdx;
				sPoint.y += mdy;
			}

			if (tPoint != null)
			{
				tPoint.x += mdx;
				tPoint.y += mdy;
			}
		}

		if (!((sVertex || sPoint != null) && (tVertex || tPoint != null) &&
			(sVertex || tVertex)))
		{
			continue;
		}

		// Rigid move (edge + both terminals share the one drag delta): the base
		// preview's translation of the displayed route is already correct — skip
		// the re-solve unless the translated route lands within buffer distance
		// of a stationary obstacle (only those can newly conflict; everything
		// moving keeps its relative geometry). Only applies with two vertex ends;
		// a dangling end's free point stays put, so always re-solve those.
		if (sVertex && tVertex &&
			handler.isCellMoving(c) && handler.isCellMoving(s) && handler.isCellMoving(t))
		{
			var bb = LibavoidRouting.edgeRouteBounds(graph, c);

			if (bb != null)
			{
				var hit = false;

				for (i = 0; i < stationary.length; i++)
				{
					var o = stationary[i];

					if (bb.x + mdx <= o.x + o.w + buffer && o.x - buffer <= bb.x + mdx + bb.width &&
						bb.y + mdy <= o.y + o.h + buffer && o.y - buffer <= bb.y + mdy + bb.height)
					{
						hit = true;
						break;
					}
				}

				if (!hit)
				{
					continue;
				}
			}
		}

		var est = graph.getCellStyle(c);
		edgeArray.push({id: c.getId(),
			source: sVertex ? s.getId() : null,
			target: tVertex ? t.getId() : null,
			sourcePoint: sPoint, targetPoint: tPoint,
			sourceConstraint: sVertex ? LibavoidRouting.fixedConstraint(est, true) : null,
			targetConstraint: tVertex ? LibavoidRouting.fixedConstraint(est, false) : null,
			sourcePoints: sVertex ? LibavoidRouting.snapPoints(graph, s, est, graph.getCellStyle(s)) : null,
			targetPoints: tVertex ? LibavoidRouting.snapPoints(graph, t, est, graph.getCellStyle(t)) : null,
			sourceSides: sVertex ? LibavoidRouting.maskSides(est, graph.getCellStyle(s), true) : null,
			targetSides: tVertex ? LibavoidRouting.maskSides(est, graph.getCellStyle(t), false) : null,
			sourceJetty: sVertex ? LibavoidRouting.jettyFor(est, true) : 0,
			targetJetty: tVertex ? LibavoidRouting.jettyFor(est, false) : 0});
		byId[c.getId()] = c;
	}

	if (edgeArray.length == 0)
	{
		return null;
	}

	return {routes: LibavoidRouting.routeEdgeSet(window.Avoid, vertices, edgeArray, null), byId: byId};
};

/**
 * Live preview while DRAGGING a shape (mxGraphHandler): re-route the affected
 * libavoidRouting=1 edges around obstacles at the shape's CURRENT preview position,
 * transiently (edge STATES only — the model is untouched and reverts on cancel; the
 * real CELLS_MOVED re-route commits the final geometry on drop).
 *
 * Routes come from solveMovePreview via routeEdgeSet (the configured strategy):
 * independent per-edge routing is deterministic and matches the commit exactly (no
 * flicker); the multi-edge default nudges but can oscillate for competing edges.
 * Either way the preview and commit use the same strategy, so no caching is needed.
 * Wired from an mxGraphHandler.updateLivePreview override (Graph.js), after the base
 * has translated the moving cell states.
 *
 * @param {mxGraphHandler} handler
 * @param {number} dx,dy  drag delta in SCALED-VIEW px (model delta = d/scale).
 */
LibavoidRouting.livePreviewMove = function(handler, dx, dy)
{
	if (typeof window === 'undefined' || window.Avoid == null)
	{
		return;
	}

	var graph = handler.graph;
	var model = graph.getModel();
	var view = graph.view;
	var mdx = dx / view.scale, mdy = dy / view.scale;
	var id, c;

	// Clone drags leave the originals in place (the preview moves the handler
	// borders only), so there is nothing to re-route — the clone's edges are
	// routed by the CELLS_MOVED commit on drop. The empty route set drops
	// every touched edge from the affected set below, so edges routed before
	// a mid-drag switch to cloning revert to their model route.
	var fr = (handler.cloning) ? null :
		LibavoidRouting.solveMovePreview(graph, handler, mdx, mdy);
	var routes = (fr != null) ? fr.routes : Object.create(null);
	var byId = (fr != null) ? fr.byId : Object.create(null);

	// Transient-state lifecycle: every edge state this preview mutates is
	// recorded on the handler until the drag ends (endMovePreview, wired from
	// mxGraphHandler.reset, restores them all). An edge that leaves the
	// affected set mid-drag (the drag moved off its corridor) is restored
	// HERE: its state keeps the last transient route (invalid == false, model
	// untouched), and neither the base preview nor a later validate would
	// ever repaint it — the ghost route would survive the drop and be
	// un-undoable. Edges that are themselves moving are left to the base
	// preview (it re-derives their states every frame; invalidating them here
	// would flash them at the model position for a frame).
	var touched = handler.__libavoidMoveTouched;

	if (touched == null)
	{
		touched = handler.__libavoidMoveTouched = Object.create(null);
	}

	var stale = false;

	for (id in touched)
	{
		if (routes[id] == null && !handler.isCellMoving(touched[id]))
		{
			view.invalidate(touched[id]);
			delete touched[id];
			stale = true;
		}
	}

	if (stale)
	{
		view.validate();
	}

	if (fr == null)
	{
		return;
	}

	// mxGraphHandler.updateLivePreview translates the moving cell STATES (state.x +=
	// dx) but RESETS them at its end (resetPreviewStates), so by the time this runs
	// the moving terminals are back at their original positions. Re-apply the drag
	// offset to those states while we re-route: otherwise updatePoints derives the
	// segment directions from the ORIGINAL terminal position while the endpoint sits
	// at the moved one, skewing the preview route. Restored in the finally so the
	// post-condition (states reset, DOM moved) matches the base.
	var movedStates = [];

	for (id in model.cells)
	{
		c = model.cells[id];

		if (c != null && model.isVertex(c) && handler.isCellMoving(c))
		{
			var vst = view.getState(c);

			if (vst != null)
			{
				vst.x += dx;
				vst.y += dy;
				movedStates.push(vst);
			}
		}
	}

	try
	{
		// Apply each route to the edge STATE (transient) and redraw. updatePoints
		// feeds the bends through the edge style so endpoints stay orthogonal; the
		// moved terminal states give the preview endpoints.
		for (id in routes)
		{
			var edge = byId[id];
			var state = view.getState(edge);

			if (state == null)
			{
				continue;
			}

			var wpsAbs = routes[id];
			var off = LibavoidRouting.getAbsoluteParentOffset(graph, edge);
			var pts = [];

			for (var k = 0; k < wpsAbs.length; k++)
			{
				pts.push(new mxPoint(wpsAbs[k].x - off.x, wpsAbs[k].y - off.y));
			}

			var src = state.getVisibleTerminalState(true);
			var trg = state.getVisibleTerminalState(false);

			// Replicate mxGraphView.updateEdgeState exactly (with the libavoid bends
			// as the control points). updateFixedTerminalPoints FIRST is essential:
			// it resets the floating endpoints to null (and sets fixed exit/entry),
			// so updateFloatingTerminalPoints then recomputes them toward the NEW
			// route. Without it the base's default-route endpoints survive (non-null
			// => updateFloatingTerminalPoints skips them) and the bends meet the
			// shape on the wrong side — the preview skews while the dropped route,
			// which goes through the full updateEdgeState, is correct.
			view.updateFixedTerminalPoints(state, src, trg);

			// A dangling terminal point of a moving edge rides the drag like
			// in the base preview: updateFixedTerminalPoints reads it from
			// the model geometry, which only translates when the drop commits
			if (handler.isCellMoving(edge) && state.absolutePoints != null)
			{
				if (src == null && state.absolutePoints[0] != null)
				{
					var p0 = state.absolutePoints[0];
					state.setAbsoluteTerminalPoint(
						new mxPoint(p0.x + dx, p0.y + dy), true);
				}

				var pn = state.absolutePoints[state.absolutePoints.length - 1];

				if (trg == null && pn != null)
				{
					state.setAbsoluteTerminalPoint(
						new mxPoint(pn.x + dx, pn.y + dy), false);
				}
			}

			view.updatePoints(state, pts, src, trg);
			view.updateFloatingTerminalPoints(state, src, trg);
			view.updateEdgeBounds(state);
			view.updateEdgeLabelOffset(state);

			// Refresh the line-jump cache from the new absolutePoints. A jumpStyle edge
			// renders from state.routedPoints (the cache updateLineJumps builds during
			// validate), NOT directly from absolutePoints — so without this the redraw
			// repaints the stale (base) route and the live preview appears to do nothing.
			if (typeof view.updateLineJumps === 'function')
			{
				view.updateLineJumps(state);
			}

			state.invalid = false;
			graph.cellRenderer.redraw(state, true);
			touched[id] = edge;

			// Repositions the edge's child labels: their states derive from the
			// parent edge state only at validation time, which the transient
			// preview bypasses (and the base preview never re-validates edges
			// that are merely crossed by the drag), so they would keep painting
			// on the old route. The restore paths need no equivalent —
			// invalidate recurses into the children.
			var childCount = model.getChildCount(edge);

			for (var j = 0; j < childCount; j++)
			{
				var childState = view.getState(model.getChildAt(edge, j));

				if (childState != null)
				{
					view.updateCellState(childState);
					childState.invalid = false;
					graph.cellRenderer.redraw(childState, true);
				}
			}
		}
	}
	finally
	{
		for (var m = 0; m < movedStates.length; m++)
		{
			movedStates[m].x -= dx;
			movedStates[m].y -= dy;
		}
	}
};

/**
 * End-of-drag cleanup for the shape-move preview: restore every edge state
 * livePreviewMove mutated during the drag. Wired from mxGraphHandler.reset
 * (grapheditor/Graph.js), which runs on BOTH drop (after moveCells committed —
 * the model already carries any re-routes, so re-deriving shows them) and
 * cancel/escape. Without this, an edge whose commit ends up writing nothing
 * (the drag crossed it and moved on, so the re-route equals the stored route
 * and samePoints skips the write) keeps the transient preview route on
 * screen: a ghost that is not in the model, survives the drop, and cannot be
 * undone.
 */
LibavoidRouting.endMovePreview = function(handler)
{
	var touched = (handler != null) ? handler.__libavoidMoveTouched : null;

	if (touched == null)
	{
		return;
	}

	handler.__libavoidMoveTouched = null;

	var view = handler.graph.view;
	var any = false;

	for (var id in touched)
	{
		view.invalidate(touched[id]);
		any = true;
	}

	if (any)
	{
		view.validate();
	}
};

/**
 * Compute obstacle-avoiding orthogonal routes for a set of edges. Thin wrapper
 * around AvoidRouting.computeRoutes (js/libavoid-js/libavoid-routing.js — the
 * shared routing core, vendored verbatim by drawio-mcp) that fills the option
 * defaults from the LibavoidRouting statics, so the menu's spacing prompt and
 * console overrides keep working. Same contract: edge id -> interior bend
 * points (ABSOLUTE, collinear-filtered); endpoints dropped; straight => [].
 */
LibavoidRouting.computeRoutes = function(Avoid, vertices, edges, opts)
{
	var buffer = (opts != null && opts.shapeBufferDistance != null) ?
		opts.shapeBufferDistance : LibavoidRouting.shapeBufferDistance;
	var nudge = (opts != null && opts.idealNudgingDistance != null) ?
		opts.idealNudgingDistance : LibavoidRouting.idealNudgingDistance;

	// Cap the clearance PER EDGE to what the terminal pair's gap physically
	// allows: 2*buffer + a 4px routing channel must fit between the shapes,
	// or the buffered obstacles swallow the corridor and the jetty
	// checkpoints force degenerate side-jogs (visible on compact Mermaid/
	// PlantUML layouts with 32px row gaps at the default 16). The buffer is
	// a per-Router parameter, so edges are BUCKETED by their effective
	// buffer and each bucket routed in its own solve; roomy edges keep the
	// configured buffer (single bucket = single solve, as before). The
	// jetty minimums get the matching per-end treatment INSIDE the core
	// (AvoidRouting.cappedJetty — clearance along each stub's own axis),
	// so drawio-mcp's direct core callers inherit it. Applies to every
	// strategy and to the previews, which route through this wrapper too —
	// commit and preview stay byte-identical.
	var byId = Object.create(null);
	var i;

	if (vertices != null)
	{
		for (i = 0; i < vertices.length; i++)
		{
			if (vertices[i] != null)
			{
				byId[vertices[i].id] = vertices[i];
			}
		}
	}

	var buckets = {};

	for (i = 0; i < edges.length; i++)
	{
		var e = edges[i];

		if (e == null)
		{
			continue;
		}

		var eff = buffer;
		var s = byId[e.source];
		var t = byId[e.target];

		if (s != null && t != null)
		{
			var gap = Math.max(
				Math.max(s.x, t.x) - Math.min(s.x + s.w, t.x + t.w),
				Math.max(s.y, t.y) - Math.min(s.y + s.h, t.y + t.h));

			if (gap > 0 && Math.floor((gap - 4) / 2) < buffer)
			{
				eff = Math.max(2, Math.floor((gap - 4) / 2));
			}
		}

		(buckets[eff] = buckets[eff] || []).push(e);
	}

	var out = Object.create(null);

	for (var key in buckets)
	{
		var r = AvoidRouting.computeRoutes(Avoid, vertices, buckets[key], {
			shapeBufferDistance: parseFloat(key),
			idealNudgingDistance: nudge
		});

		for (var id in r)
		{
			out[id] = r[id];
		}
	}

	return out;
};

/**
 * Route each edge in its OWN single-connector libavoid solve (all vertices as
 * obstacles, exactly ONE connector per Router), merging the results. With a single
 * connector there is no other connector to compete with, so libavoid's route is
 * DETERMINISTIC — this avoids the non-deterministic "which competing edge takes the
 * detour" tie that makes a multi-edge solve flip between equal-cost topologies across
 * calls (the live-preview oscillation, observed only when 2+ edges run between the
 * same shape pair). Because each edge is solved in isolation, its route is also
 * independent of which OTHER edges are in the batch, so the live preview and the
 * commit produce identical routes with no need for caching/hysteresis.
 *
 * Trade-off vs computeRoutes: no edge-edge nudging — two edges that share a path are
 * not separated (they can overlap). Same {edgeId -> bends} contract as computeRoutes.
 * App-only: drawio-mcp routes multi-edge via AvoidRouting.computeRoutes directly
 * (server-side one-shot routing never oscillates).
 */
LibavoidRouting.computeRoutesIndependent = function(Avoid, vertices, edges, opts)
{
	var out = Object.create(null);

	if (edges == null)
	{
		return out;
	}

	for (var i = 0; i < edges.length; i++)
	{
		if (edges[i] == null)
		{
			continue;
		}

		var r = LibavoidRouting.computeRoutes(Avoid, vertices, [edges[i]], opts);

		for (var id in r)
		{
			out[id] = r[id];
		}
	}

	return out;
};

/**
 * Route a set of edges using the configured strategy (LibavoidRouting.
 * independentRouting): independent per-edge solves (deterministic, no nudging) or a
 * single multi-edge computeRoutes (nudged, non-deterministic for competing edges).
 * Same {edgeId -> bends} contract. Used by both routeCells (commit) and
 * solveMovePreview (live preview) so they always agree.
 */
LibavoidRouting.routeEdgeSet = function(Avoid, vertices, edges, opts)
{
	return LibavoidRouting.independentRouting ?
		LibavoidRouting.computeRoutesIndependent(Avoid, vertices, edges, opts) :
		LibavoidRouting.computeRoutes(Avoid, vertices, edges, opts);
};
