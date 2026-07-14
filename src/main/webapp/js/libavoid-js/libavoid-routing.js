/*
 * libavoid-routing.js — the draw.io routing core over the libavoid solver.
 * Hand-authored; engine-agnostic (takes the `Avoid` namespace as a parameter,
 * so it works whether the host loads libavoid as WASM or pure JS) and never
 * changes with the libavoid build.
 *
 * CANONICAL SOURCE: this file (drawio-dev js/libavoid-js/). drawio-mcp vendors
 * verbatim copies (mcp-app-server/vendor/libavoid/ and
 * mcp-tool-server/vendor/libavoid/) — copy this file over when it changes.
 *
 * A plain script defining globalThis.AvoidRouting, so the SAME artifact is:
 *  - concatenated into extensions.min.js here (glue → wasm → loader → this →
 *    the Closure-compiled LibavoidRouting editor binding),
 *  - inlined into (or CDN-loaded by) the drawio-mcp app-server viewer,
 *  - side-effect imported from Node by the drawio-mcp tool server
 *    (import the file, then read globalThis.AvoidRouting).
 * It does not depend on the glue/loader — every entry point takes the Avoid
 * namespace as a parameter — and must stay dependency-free (no mxGraph, no
 * DOM): anything editor-specific belongs in js/diagramly/LibavoidRouting.js.
 *
 * libavoid API gotchas baked in here (empirically verified against the
 * vendored build, libavoid-js 0.5.0-beta.5):
 *  - Router flag is an integer: RouterFlag.OrthogonalRouting.value
 *  - setRoutingParameter takes the enum OBJECT (RoutingParameter.x), not
 *    .value (the integer silently no-ops and routes run flush against boxes)
 *  - cleanup is router.delete() (embind), not Avoid.destroy()
 *  - Point/Rectangle/ConnEnd/Checkpoint(+vector) are embind wrappers COPIED
 *    into the objects they parameterize and NOT freed by router.delete();
 *    free each temporary with .delete()
 *  - a directed ShapeConnectionPin gives the route NO minimum straight
 *    lead-out (it may turn at the anchor and run flush along the shape); a
 *    minimum stub needs a routing checkpoint at the stub tip. Checkpoint
 *    DIRECTION flags have an inverted vertical convention in this build —
 *    use plain 1-arg checkpoints only.
 */
(function()
{
	var AvoidRouting = {};

	// libavoid ConnDirFlags (the enum isn't exposed by the JS bindings): a
	// bitmask of the directions a connector may approach an endpoint.
	AvoidRouting.DIR = {up: 1, down: 2, left: 4, right: 8, all: 15};

	/**
	 * Clamp to [0,1] — the ShapeConnectionPin proportional-offset domain.
	 */
	AvoidRouting.clamp01 = function(v)
	{
		return (v < 0) ? 0 : ((v > 1) ? 1 : v);
	};

	/**
	 * ConnDirFlags for a proportional connection point: perpendicular to the
	 * nearest shape edge (x<=0 left, x>=1 right, y<=0 up, y>=1 down), else any
	 * direction.
	 */
	AvoidRouting.dirForPoint = function(x, y)
	{
		var DIR = AvoidRouting.DIR;
		var d = 0;

		if (x <= 0) { d |= DIR.left; }
		else if (x >= 1) { d |= DIR.right; }

		if (y <= 0) { d |= DIR.up; }
		else if (y >= 1) { d |= DIR.down; }

		return (d != 0) ? d : DIR.all;
	};

	/**
	 * A fixed connection point as a routing constraint {x, y, dir}: the
	 * proportional position clamped to [0,1] (some shapes' connection points
	 * sit slightly outside, e.g. a hexagon tip at y=-0.017, which
	 * ShapeConnectionPin rejects) plus the ConnDirFlags direction derived from
	 * the ORIGINAL values so it still points off the correct edge. Returns
	 * null when either coordinate is missing/not a number (floating endpoint).
	 */
	AvoidRouting.constraintForPoint = function(x, y)
	{
		if (x == null || y == null || isNaN(x) || isNaN(y))
		{
			return null;
		}

		return {x: AvoidRouting.clamp01(x), y: AvoidRouting.clamp01(y),
			dir: AvoidRouting.dirForPoint(x, y)};
	};

	/**
	 * Proportional pin points for one masked side of bounds b ({x,y,w,h}):
	 * one pin per ~20px of side length (1..9, spread evenly so a single pin
	 * sits at the side midpoint), each directed off its side. Side letters
	 * follow the mxGraph port-constraint vocabulary (N/S/E/W). Used by
	 * computeRoutes' sourceSides/targetSides handling — the pins of all
	 * allowed sides share one pin class, so libavoid picks the side AND the
	 * position that route best.
	 */
	AvoidRouting.maskPinPoints = function(side, b)
	{
		var DIR = AvoidRouting.DIR;
		var horizontal = (side == 'N' || side == 'S');
		var len = horizontal ? b.w : b.h;
		var n = Math.max(1, Math.min(9, Math.round(len / 20)));
		var pts = [];

		for (var i = 0; i < n; i++)
		{
			var f = (i + 0.5) / n;

			pts.push((side == 'N') ? {x: f, y: 0, dir: DIR.up} :
				(side == 'S') ? {x: f, y: 1, dir: DIR.down} :
				(side == 'W') ? {x: 0, y: f, dir: DIR.left} :
					{x: 1, y: f, dir: DIR.right});
		}

		return pts;
	};

	/**
	 * True when the point lies strictly inside any of the obstacles. A pinned
	 * anchor sits ON its own shape's boundary, so the strict test never
	 * matches the point's own shape.
	 */
	AvoidRouting.insideAny = function(x, y, obstacles)
	{
		if (obstacles != null)
		{
			for (var i = 0; i < obstacles.length; i++)
			{
				var v = obstacles[i];

				if (v != null && x > v.x && x < v.x + v.w && y > v.y && y < v.y + v.h)
				{
					return true;
				}
			}
		}

		return false;
	};

	/**
	 * The stub tip a jetty checkpoint pins the route through: the constrained
	 * anchor on bounds b ({x,y,w,h}), moved jetty px outward along the pin's
	 * single ConnDirFlags direction. Returns {x, y} or null when there is
	 * nothing to enforce: no constraint, non-positive jetty, an ambiguous
	 * direction (corner/interior anchors carry 2+ direction bits), or a tip
	 * inside an obstacle ({x,y,w,h} array) INFLATED by the solve's buffer —
	 * libavoid's orthogonal visibility network stays clear of the buffered
	 * zones, so a checkpoint there is unreachable and libavoid warns
	 * ("Warning: skipping checkpoint for connector ...") on the console and
	 * ignores it; not requesting it keeps the route identical without the
	 * noise. The stub's OWN shape (matched by bounds) is exempt from the
	 * inflation — the pin's lead-out segment crosses its own buffer zone
	 * legitimately (verified against the WASM: no warning there).
	 */
	AvoidRouting.jettyStub = function(constraint, jetty, b, obstacles, buffer)
	{
		if (constraint == null || !(jetty > 0))
		{
			return null;
		}

		var d = constraint.dir;
		var DIR = AvoidRouting.DIR;

		if (d != DIR.up && d != DIR.down && d != DIR.left && d != DIR.right)
		{
			return null;
		}

		var x = b.x + constraint.x * b.w +
			((d == DIR.right) ? jetty : ((d == DIR.left) ? -jetty : 0));
		var y = b.y + constraint.y * b.h +
			((d == DIR.down) ? jetty : ((d == DIR.up) ? -jetty : 0));

		if (obstacles != null)
		{
			var inflate = (buffer > 0) ? buffer : 0;

			for (var i = 0; i < obstacles.length; i++)
			{
				var v = obstacles[i];

				if (v == null ||
					(v.x == b.x && v.y == b.y && v.w == b.w && v.h == b.h))
				{
					continue;
				}

				if (x > v.x - inflate && x < v.x + v.w + inflate &&
					y > v.y - inflate && y < v.y + v.h + inflate)
				{
					return null;
				}
			}
		}

		return {x: x, y: y};
	};

	/**
	 * One end's jetty capped to the clearance toward the OTHER terminal along
	 * the stub's own axis: half the directed gap (stub's base side to the
	 * facing side of the other shape) minus the 4px routing channel — so two
	 * facing stubs can never cross and a capped tip lands on the corridor
	 * channel's boundary; an uncapped stub in a tight gap puts its checkpoint
	 * past the channel and libavoid answers with a self-overlapping hairpin
	 * that nudging splays into flat side-loops. No cap when the end floats,
	 * the anchor is a corner/interior one (2+ direction bits — jettyStub
	 * skips those ends anyway), the stub points away from the other shape, or
	 * the shapes overlap along the stub's axis: such a stub never enters the
	 * pair's corridor, so a narrow gap along the OTHER axis must not shorten
	 * it (only the center segment squeezes through that gap, e.g. an L around
	 * a 15px horizontal gap keeps its full vertical lead-out).
	 */
	AvoidRouting.cappedJetty = function(jetty, constraint, from, to)
	{
		// A dangling (free-point) end has no bounds to measure the gap against.
		if (from == null || to == null)
		{
			return jetty;
		}

		var DIR = AvoidRouting.DIR;
		var d = (constraint != null) ? constraint.dir : 0;
		var dgap = (d == DIR.down) ? to.y - (from.y + from.h) :
			((d == DIR.up) ? from.y - (to.y + to.h) :
			((d == DIR.right) ? to.x - (from.x + from.w) :
			((d == DIR.left) ? from.x - (to.x + to.w) : 0)));

		if (dgap > 0)
		{
			var half = Math.max(2, Math.floor((dgap - 4) / 2));

			if (jetty > half)
			{
				return half;
			}
		}

		return jetty;
	};

	/**
	 * Obstacles minus ENCLOSING shapes: a shape whose bounds fully contain a
	 * routed edge's terminal (and that is not itself a terminal of one of the
	 * edges) is the container/pool/group the terminal lives IN, not something
	 * to route around. Registering it starves the solve of corridors (both
	 * endpoints sit inside a hard obstacle, so routes escape it or degenerate)
	 * and suppresses the terminals' jetty stubs (jettyStub refuses tips inside
	 * any obstacle). Model ancestry is unknown here (this file is model-free),
	 * so containment is geometric: rect-contains-rect, inclusive. Terminals of
	 * the routed edges are never dropped (their ShapeRefs carry the connection
	 * pins). Returns a filtered copy; the input arrays are not modified.
	 */
	AvoidRouting.filterEnclosing = function(vertices, edges)
	{
		if (vertices == null || edges == null || edges.length === 0)
		{
			return vertices;
		}

		var terminalIds = {};
		var i;

		for (i = 0; i < edges.length; i++)
		{
			if (edges[i] != null)
			{
				terminalIds[edges[i].source] = true;
				terminalIds[edges[i].target] = true;
			}
		}

		var terminals = [];

		for (i = 0; i < vertices.length; i++)
		{
			var v = vertices[i];

			if (v != null && terminalIds[v.id] === true)
			{
				terminals.push(v);
			}
		}

		var out = [];

		for (i = 0; i < vertices.length; i++)
		{
			var v = vertices[i];

			if (v == null)
			{
				continue;
			}

			var enclosing = false;

			if (terminalIds[v.id] !== true)
			{
				for (var j = 0; j < terminals.length; j++)
				{
					var t = terminals[j];

					if (v.x <= t.x && v.y <= t.y &&
						v.x + v.w >= t.x + t.w && v.y + v.h >= t.y + t.h)
					{
						enclosing = true;
						break;
					}
				}
			}

			if (!enclosing)
			{
				out.push(v);
			}
		}

		return out;
	};

	/**
	 * Compute obstacle-avoiding orthogonal routes for a set of edges.
	 *
	 * @param {object} Avoid - the libavoid instance (AvoidLib.getInstance()).
	 * @param {Array<{id:string,x:number,y:number,w:number,h:number}>} vertices
	 *        Obstacles, in ABSOLUTE coordinates. Shapes enclosing a terminal
	 *        of a routed edge are dropped (filterEnclosing).
	 * @param {Array<{id,source,target,sourcePoint?,targetPoint?,
	 *        sourceConstraint?,targetConstraint?,
	 *        sourcePoints?,targetPoints?,sourceSides?,targetSides?,
	 *        sourceJetty?,targetJetty?}>} edges
	 *        Edges referencing vertex ids. An end may instead be a DANGLING free
	 *        point — sourcePoint/targetPoint {x,y} in absolute coords, used when
	 *        that terminal has no vertex (an unconnected endpoint): it routes to
	 *        a plain Point ConnEnd (no shape, no direction), matching the
	 *        drag-preview, and takes no constraint/pin/mask/jetty. An edge is
	 *        skipped only when an end is neither a vertex nor a free point.
	 *        *Constraint = {x,y,dir} (constraintForPoint): a
	 *        fixed connection point routed via a directed ShapeConnectionPin;
	 *        absent => the endpoint floats at the shape centre. *Points = an
	 *        array of {x,y,dir} candidate anchors (draw.io's snapToPoint —
	 *        the shape's declared connection points): non-exclusive directed
	 *        pins at each candidate under one pin class, libavoid picks the
	 *        anchor that routes best; beaten by a *Constraint on the same end
	 *        (an explicit anchor wins) and beats a *Sides mask (the renderer's
	 *        snapToPoint branch runs before mask enforcement). *Sides = an
	 *        array of allowed attach sides ('N'/'S'/'E'/'W', the legacy
	 *        mxGraph portConstraint masks): non-exclusive pins spread along
	 *        the allowed sides under one pin class, libavoid picks side and
	 *        position. *Jetty = the minimum length of the first/last
	 *        segment in px (draw.io's jettySize), enforced for ends with a
	 *        *Constraint by a routing checkpoint at the stub tip — requested
	 *        lazily, only for edges whose natural route falls short of the
	 *        minimum; snapped and masked ends behave like floating ones here
	 *        (their first bend naturally sits ~shapeBufferDistance out).
	 * @param {{shapeBufferDistance?:number,idealNudgingDistance?:number}} [opts]
	 *        Defaults: 16 / 14.
	 * @returns {Object<string, Array<{x:number,y:number}>>} edge id -> interior
	 *        bend points (ABSOLUTE, collinear-filtered). The first/last route
	 *        points (endpoints) are dropped — a floating endpoint connects at
	 *        the shape side midpoint, which is where a floating
	 *        orthogonalEdgeStyle endpoint lands anyway. An edge with a
	 *        straight (bend-free) route maps to [].
	 */
	AvoidRouting.computeRoutes = function(Avoid, vertices, edges, opts)
	{
		var out = {};

		if (Avoid == null || vertices == null || edges == null)
		{
			return out;
		}

		var buffer = (opts && opts.shapeBufferDistance != null) ? opts.shapeBufferDistance : 16;
		var nudge = (opts && opts.idealNudgingDistance != null) ? opts.idealNudgingDistance : 14;

		// Containers the terminals live in are not obstacles (also feeds the
		// jettyStub checks below, so stubs inside a container are preserved).
		vertices = AvoidRouting.filterEnclosing(vertices, edges);

		function collinear(a, b, c)
		{
			// Zero cross product (1px tolerance) => b lies on segment a..c (redundant).
			return Math.abs((b.x - a.x) * (c.y - a.y) - (c.x - a.x) * (b.y - a.y)) < 1;
		}

		var router = new Avoid.Router(Avoid.RouterFlag.OrthogonalRouting.value);

		try { router.setRoutingParameter(Avoid.RoutingParameter.shapeBufferDistance, buffer); } catch (e) {}
		try { router.setRoutingParameter(Avoid.RoutingParameter.idealNudgingDistance, nudge); } catch (e) {}

		var bounds = {};
		var shapeRefs = {};
		var pinClass = 0;
		var i;

		for (i = 0; i < vertices.length; i++)
		{
			var v = vertices[i];

			if (v == null || v.id == null || !(v.w > 0) || !(v.h > 0))
			{
				continue;
			}

			bounds[v.id] = v;
			// Point/Rectangle are embind value wrappers that COPY into the
			// ShapeRef and are NOT freed by router.delete(); free the temporaries.
			var rp1 = new Avoid.Point(v.x, v.y);
			var rp2 = new Avoid.Point(v.x + v.w, v.y + v.h);
			var rect = new Avoid.Rectangle(rp1, rp2);
			shapeRefs[v.id] = new Avoid.ShapeRef(router, rect);
			rect.delete();
			rp1.delete();
			rp2.delete();
		}

		// An endpoint is FLOATING (ConnEnd at the shape centre) unless the edge
		// gives a fixed connection point — a directed ShapeConnectionPin makes
		// the route leave/enter the anchor perpendicular to the shape edge
		// instead of cutting through it — a snap-point set (draw.io's
		// snapToPoint: the shape's declared connection points as candidate
		// anchors, one non-exclusive directed pin each, sharing ONE pin class
		// so libavoid picks the anchor that routes best) — or a side MASK (the
		// legacy mxGraph portConstraint vocabulary): pins spread along every
		// allowed side (maskPinPoints), all sharing ONE pin class, so libavoid
		// picks the side and the position that route best. Snap/mask pins are
		// non-exclusive: several edges may share a pin and nudging separates
		// their corridors, like the render-time router spreading floating
		// attaches. Precedence per end mirrors the renderer: a fixed
		// constraint (pinned exit/entry) wins over both, and a snap-point set
		// wins over a mask (the snapToPoint branch of
		// updateFloatingTerminalPoint runs before any mask enforcement).
		function makeEnd(vid, b, constraint, sides, points, freePoint)
		{
			// Dangling end: no vertex bounds, just a free point (the edge's
			// unconnected endpoint). Route to a plain Point ConnEnd — no shape,
			// no direction — exactly as the warm-session drag preview does, so a
			// committed edge with an unconnected end matches its live preview.
			if (b == null)
			{
				var dp = new Avoid.Point(freePoint.x, freePoint.y);
				var dce = new Avoid.ConnEnd(dp);
				dp.delete();
				return dce;
			}

			if (constraint != null && constraint.dir != null && shapeRefs[vid] != null)
			{
				pinClass++;
				new Avoid.ShapeConnectionPin(shapeRefs[vid], pinClass,
					constraint.x, constraint.y, true, 0, constraint.dir);
				return new Avoid.ConnEnd(shapeRefs[vid], pinClass);
			}

			if (points != null && points.length > 0 && shapeRefs[vid] != null)
			{
				pinClass++;

				for (var q = 0; q < points.length; q++)
				{
					// Registers itself with the ShapeRef (freed with the
					// router), like the mask pins below.
					var spin = new Avoid.ShapeConnectionPin(shapeRefs[vid],
						pinClass, points[q].x, points[q].y, true, 0,
						(points[q].dir != null) ? points[q].dir : AvoidRouting.DIR.all);
					spin.setExclusive(false);
				}

				return new Avoid.ConnEnd(shapeRefs[vid], pinClass);
			}

			if (sides != null && sides.length > 0 && shapeRefs[vid] != null)
			{
				pinClass++;

				for (var s = 0; s < sides.length; s++)
				{
					var pts = AvoidRouting.maskPinPoints(sides[s], b);

					for (var p = 0; p < pts.length; p++)
					{
						// The pin registers itself with the ShapeRef (freed
						// with the router); the wrapper is only kept long
						// enough to make it shareable.
						var pin = new Avoid.ShapeConnectionPin(shapeRefs[vid],
							pinClass, pts[p].x, pts[p].y, true, 0, pts[p].dir);
						pin.setExclusive(false);
					}
				}

				return new Avoid.ConnEnd(shapeRefs[vid], pinClass);
			}

			// Free the temporary centre Point (copied into the ConnEnd); the
			// ConnEnd itself is freed by the ConnRef caller below.
			var cp = new Avoid.Point(b.x + b.w / 2, b.y + b.h / 2);
			var ce = new Avoid.ConnEnd(cp);
			cp.delete();

			return ce;
		}

		// Endpoint anchor: the free point for a dangling end, else the fixed
		// connection point, else the shape centre — the point the ConnEnd routes
		// from.
		function anchor(b, constraint, freePoint)
		{
			if (b == null)
			{
				return freePoint;
			}

			return (constraint != null) ?
				{x: b.x + constraint.x * b.w, y: b.y + constraint.y * b.h} :
				{x: b.x + b.w / 2, y: b.y + b.h / 2};
		}

		// Wrap a stub tip as a routing checkpoint. Checkpoint copies the Point
		// and the vector copies the Checkpoint — free both embind wrappers.
		function addCheckpoint(vec, p)
		{
			if (p != null)
			{
				var pt = new Avoid.Point(p.x, p.y);
				var cp = new Avoid.Checkpoint(pt);
				vec.push_back(cp);
				cp.delete();
				pt.delete();
			}
		}

		var conns = [];

		for (i = 0; i < edges.length; i++)
		{
			var e = edges[i];

			if (e == null)
			{
				continue;
			}

			var sb = bounds[e.source];
			var tb = bounds[e.target];

			// An end is either a known vertex (sb/tb) or a dangling free point
			// (e.sourcePoint / e.targetPoint, absolute coords) for an unconnected
			// endpoint. Skip only when an end is neither.
			if ((sb == null && e.sourcePoint == null) ||
				(tb == null && e.targetPoint == null))
			{
				continue;
			}

			// ConnRef copies the ConnEnds, so free them after construction
			// (they are not owned by the router).
			var se = makeEnd(e.source, sb, e.sourceConstraint, e.sourceSides, e.sourcePoints, e.sourcePoint);
			var de = makeEnd(e.target, tb, e.targetConstraint, e.targetSides, e.targetPoints, e.targetPoint);
			var conn = new Avoid.ConnRef(router, se, de);
			se.delete();
			de.delete();

			// Jetty stubs: force the route through a checkpoint jetty px
			// outward of each constrained anchor, so the first/last segment is
			// at least that long. Capped per end to the clearance the terminal
			// pair's gap allows along the stub's axis (cappedJetty). Skipped
			// for ends where there is nothing to enforce (jettyStub), and for
			// the whole edge when the anchors are closer than the summed
			// stubs — the same too-short guard as mxEdgeStyle.OrthConnector —
			// so a short edge isn't forced to double back through its
			// checkpoints. The stubs are computed here but requested LAZILY
			// after the first solve (see below).
			var sourceJetty = AvoidRouting.cappedJetty(e.sourceJetty, e.sourceConstraint, sb, tb);
			var targetJetty = AvoidRouting.cappedJetty(e.targetJetty, e.targetConstraint, tb, sb);
			var sa = anchor(sb, e.sourceConstraint, e.sourcePoint);
			var ta = anchor(tb, e.targetConstraint, e.targetPoint);

			// A pinned anchor buried inside ANOTHER obstacle (a shape dragged
			// over the terminal) puts the whole route into libavoid's escape /
			// degenerate mode: checkpoints on such a route are unreachable and
			// libavoid warns ("skipping checkpoint") for EVERY end — including
			// tips in perfectly clear space — before discarding them. Skip BOTH
			// stubs for the edge instead (verified against the WASM: same
			// route, no console noise).
			var buried = (e.sourceConstraint != null &&
					AvoidRouting.insideAny(sa.x, sa.y, vertices)) ||
				(e.targetConstraint != null &&
					AvoidRouting.insideAny(ta.x, ta.y, vertices));

			var scp = buried ? null :
				AvoidRouting.jettyStub(e.sourceConstraint, sourceJetty, sb, vertices, buffer);
			var tcp = buried ? null :
				AvoidRouting.jettyStub(e.targetConstraint, targetJetty, tb, vertices, buffer);

			if (scp != null || tcp != null)
			{
				var dx = ta.x - sa.x;
				var dy = ta.y - sa.y;
				var total = ((scp != null) ? sourceJetty : 0) +
					((tcp != null) ? targetJetty : 0);

				if (dx * dx + dy * dy < total * total)
				{
					scp = null;
					tcp = null;
				}
			}

			conns.push({id: e.id, conn: conn, scp: scp, tcp: tcp,
				sourceJetty: sourceJetty, targetJetty: targetJetty});
		}

		if (conns.length === 0)
		{
			router.delete();
			return out;
		}

		router.processTransaction();

		// LAZY jetty enforcement: the first solve runs WITHOUT the stub
		// checkpoints; they are requested only for edges whose natural route
		// violates a jetty minimum, and the transaction re-processed once. A
		// checkpoint is a hard point the route must touch: when libavoid
		// TURNS at one instead of crossing it mid-segment, the adjacent bend
		// is pinned at the stub tip and nudging cannot center the segment in
		// its channel — lopsided lead-outs (e.g. 30/10 on one edge next to a
		// centered 20/20 twin) on routes that met the minimum for free.
		// Enforcing lazily keeps the nudged, evenly distributed route
		// wherever it already satisfies the jetty, and falls back to the
		// checkpointed solve only where it does not.
		function endSegment(route, atStart)
		{
			var n = route.size();

			if (n < 2)
			{
				// Degenerate route; checkpoints cannot improve it.
				return Infinity;
			}

			var a = route.at(atStart ? 0 : n - 1);
			var b = route.at(atStart ? 1 : n - 2);
			var horizontal = Math.abs(b.x - a.x) >= Math.abs(b.y - a.y);
			var len = 0;

			// Merge collinear raw points (libavoid may split a straight
			// lead-out): the run ends at the first point that leaves the
			// terminal's row/column.
			for (var k = atStart ? 1 : n - 2; k >= 0 && k < n; k += atStart ? 1 : -1)
			{
				var p = route.at(k);

				if (Math.abs(horizontal ? p.y - a.y : p.x - a.x) > 0.5)
				{
					break;
				}

				len = Math.abs(horizontal ? p.x - a.x : p.y - a.y);
			}

			return len;
		}

		var dirty = false;

		for (i = 0; i < conns.length; i++)
		{
			var c = conns[i];

			if (c.scp == null && c.tcp == null)
			{
				continue;
			}

			// 0.5px tolerance: sub-pixel misses vanish in the output rounding
			// and do not warrant pinning the route to the checkpoints.
			var r0 = c.conn.displayRoute();

			if ((c.scp != null && endSegment(r0, true) < c.sourceJetty - 0.5) ||
				(c.tcp != null && endSegment(r0, false) < c.targetJetty - 0.5))
			{
				// In route order (source first); setRoutingCheckpoints copies
				// the vector, so free the wrapper.
				var cps = new Avoid.CheckpointVector();
				addCheckpoint(cps, c.scp);
				addCheckpoint(cps, c.tcp);
				c.conn.setRoutingCheckpoints(cps);
				cps.delete();
				dirty = true;
			}
		}

		if (dirty)
		{
			router.processTransaction();
		}

		for (i = 0; i < conns.length; i++)
		{
			var route = conns[i].conn.displayRoute();
			var n = route.size();
			var wps = [];

			if (n >= 2)
			{
				var pts = [];
				var k;

				for (k = 0; k < n; k++)
				{
					var p = route.at(k);
					pts.push({x: p.x, y: p.y});
				}

				for (k = 1; k < n - 1; k++)
				{
					if (collinear(pts[k - 1], pts[k], pts[k + 1]))
					{
						continue;
					}

					wps.push({x: Math.round(pts[k].x), y: Math.round(pts[k].y)});
				}
			}

			out[conns[i].id] = wps;
		}

		router.delete();
		return out;
	};

	globalThis.AvoidRouting = AvoidRouting;
})();
