# libavoid edge routing (Arrange > Layout > Orthogonal Routing)

Obstacle-avoiding orthogonal edge routing via the pure-JS libavoid port
(`diagramly/Menus.js`, next to Parallels). Unlike a node layout it never moves
a vertex — it only re-routes edges around the vertices as obstacles.

**Files**: `js/libavoid-js/libavoid.min.js` (bundle — see
`docs/claude/native-bundles.md`), `js/libavoid-js/libavoid-routing.js`
(**canonical** shared routing core, `globalThis.AvoidRouting`:
`computeRoutes` + the pure geometry helpers `constraintForPoint`/`jettyStub`/
`filterEnclosing`/`dirForPoint`/`clamp01`; sync rules with drawio-mcp in
`js/libavoid-js/CLAUDE.md`), `diagramly/LibavoidRouting.js` (editor binding
only: model access, events, previews, styles; its `computeRoutes` is a thin
wrapper that injects the `LibavoidRouting.shapeBufferDistance`/
`idealNudgingDistance` statics as option defaults). **Routing/algorithm tuning
goes in the canonical core, not the editor binding.** The core is model-free —
it only needs the `Avoid` namespace passed into its entry points. Both repos
support fixed connection points (`sourceConstraint`/`targetConstraint`
`{x,y,dir}` → directed `ShapeConnectionPin`) and per-end jetty stubs.

Entry-point gating (`typeof LibavoidRouting !== 'undefined'`, no CSP probe):
see `docs/claude/native-bundles.md`. Layout specs, `Run Last Layout`,
retargeting a selected container, and the `orthogonalEdge` childLayout:
see `docs/claude/layouts.md`.

## Solver aborts — exception-free bundle (July 2026)

`Router.processTransaction` must never throw. The bundle compiles with
Emscripten's exception catching DISABLED, so any C++ `throw` → `Aborted(...)`
→ the module is dead for the rest of the session (every later solve fails,
including previews). Upstream libavoid throws as NORMAL internal control flow:
VPSC's `findMinLMBetween` throws `UnsatisfiableException` for infeasible
nudging separation systems (legitimately reachable — ~7% of drag positions on
an ordinary 4-shape/6-edge diagram; first seen as a move-preview
`Aborted(undefined)` from `solveMovePreview`) and `IncSolver::satisfy()`
catches it to relax the constraint. The fix is in the SIBLING repo, not here:
`../drawio-libavoid/build/patches/vpsc-exception-free.patch` rewrites both
VPSC throw sites into that same relaxation (routes stay byte-identical
wherever the old build didn't abort), and the build defines `-DNDEBUG` so
`COLA_ASSERT` failures can't abort either. Don't add try/catch around
`processTransaction` in the JS layers — after an Emscripten abort the module
is unrecoverable anyway (every embind call throws), so catching would only
mask the next real regression; headless repro harness pattern: load
`libavoid.min.js` + `libavoid-routing.js` in Node via `vm.runInThisContext`,
call `AvoidRouting.computeRoutes` directly.

## Route read-back and heap addresses (Sep 2026)

libavoid breaks ties between equal coordinates by object ADDRESS
(`CmpNodePos` in scanline.cpp, `CmpVertInf` in orthogonal.cpp,
`CmpVisEdgeRotation` in makepath.cpp, the `ConnRef*`-keyed crossing map in
router.cpp), so a solve's routes depend on where its objects are allocated —
identical input routes identically only while every solve starts from the
same heap. The core therefore must leave the module's heap exactly as it
found it. `readRoute` (in `computeRoutes`) copies each route into plain
`{x, y}` points and frees what the binding handed out: draw.io's own binding
(drawio-libavoid) returns `displayRoute()`/`PolyLine.at()` as UNOWNED
references (never delete — that destroys the route in place), the upstream
libavoid-js build the mcp tool server runs returns a fresh OWNED copy per
call (must delete); two calls alias one object only for references
(`isAliasOf`), probed once per solve. Before this the core leaked those
copies on the tool server, every call shifted the next one's allocations,
and a long-lived process routed the same diagram differently call to call
(electrical_2 template: one connector alternated between a 4-bend route and
libavoid's unrouted fallback).

## Shared pins, unrouted connectors, clearance retry (Sep 2026)

**Two pins must never sit at one point.** libavoid's orthogonal visibility
sweep assumes no two breakpoints coincide (`COLA_ASSERT` in orthogonal.cpp,
compiled out by `-DNDEBUG`); two pins at the same point in different classes
leave the connector registered second with NO route. The core used to give
every edge end its own pin class, so every fan-out/fan-in on one fixed
connection point, snap-point set or side mask lost all but one connector
(electrical_2: 3 of 7). `computeRoutes` now registers ONE non-exclusive pin
class per distinct candidate set on a shape (`endPins` + `pinClassFor`, the
key is order-free) and every end with that set shares it.

**No route ≠ straight route.** When the search fails, libavoid returns the
straight segment between the two end vertices — for a pinned end, the pin
class's dummy vertex at the shape CENTRE. `AvoidRouting.isFallbackRoute`
recognises it (two points, diagonal or a pinned end off its pins); such a
connector gets no jetty checkpoints and NO entry in the result, so callers
leave the edge as authored instead of wiping its waypoints with `[]` and
tagging it (routeCells, the move preview and both drag previews already
treat a missing id as "not routed").

**Retry at half the clearance.** Most failures are a pinned end facing a gap
narrower than `2 × shapeBufferDistance` (a label or marker a few px beside
the shape — electrical_2's current arrows sit 30 px from the resistors at a
32 px requirement). The failed connectors ALONE are re-solved at half the
buffer, down to 2 px; the rest keep the configured clearance and are not
nudged against the retried ones (same trade-off as the wrapper's per-buffer
buckets). The retry also clears partial pin overlaps (a fixed anchor inside
another end's snap set): the other end's pins are not in the retry solve.
Across 990 template edges this took unrouted connectors from 22 to 1 (a pin
buried inside another shape — genuinely unroutable) for +16 % solve time;
routes changed elsewhere only on the one page with shared anchors. The drag
previews match: the pinned paths already go through `computeRoutes`, and the
warm session (one clearance, no retry) returns null from
`solvePreviewSession` when its solve is a fallback (against the fixed end's
pins, `sess.fixedPins`), so the preview switches to the fresh dangling solve
(`previewRouteToPoint`) — the drop's own solve, retries included. It used to
show the fallback's straight line where the drop found a route.

## Rotated, turned and flipped shapes (Sep 2026)

Routing used to take every shape unrotated: obstacles were the model
geometry and `exitX`/`entryX` pins the unrotated positions, so on a rotated
terminal (electrical_2: 5 of 6 components at `rotation=-90`) routes attached
where the unrotated ends would be and cut through the drawn shapes. Now each
vertex descriptor carries `frame = AvoidRouting.shapeFrame(style, isStencil)`
(rotation, direction, flipH/V + legacy stencilFlipH/V, anchorPointDirection,
legacyAnchorPoints) and `computeRoutes` first runs `toWorldFrame`: the
obstacle becomes `obstacleBounds` (the bounds rotated about their centre;
direction/flips turn the drawing INSIDE the bounds, so they don't move it)
and every end's constraint and snap points go through `shapePin`, which
reproduces the renderer — draw.io's default `Graph.getLegacyConnectionPoint`
(flips only apply to a point with `exitPerimeter=0`; the perimeter projection
undoes them), or `mxGraph.getConnectionPoint` under `legacyAnchorPoints=0` —
and turns the approach direction with the point. Verified against the live
`graph.getConnectionPoint` over 15,680 point/style combinations (every
rotation incl. non-90°, direction, flip, anchorPointDirection, legacy mode,
perimeter on/off): exact, except `legacyAnchorPoints=0` +
`anchorPointDirection=0` + north/south, where draw.io itself places the
point outside the shape's box (clamped onto it here). Side masks are taken
as already turned (`maskSides` resolves `portConstraintRotation`).
Constraints carry `perimeter` (`constraintForPoint`'s 3rd arg, from
`exitPerimeter`/`entryPerimeter` or `mxConnectionConstraint.perimeter`).

Editor adapter: `getVertex` (bounds + frame; `getCellStyle`, not the cached
state style), `getAbsoluteObstacleBounds` (the drawn box — used for every
changed-shape region and the per-edge clearance cap), `getAbsoluteAnchor`
(a snapped drag target's drawn anchor). `buildPreviewSession` maps its
obstacles and fixed pins through the same `toWorldFrame`, but returns
`fixedPoints`/`fixedSides` unmapped — the fresh path hands them to
`computeRoutes`, which maps them. A Format-panel rotation/direction/flip
edit (`styleChanged`) re-routes every connected auto-edge plus those crossing
the new box; Arrange > Direction flips and the Rotation dialog fire
`styleChanged` inside their update for this (they fired nothing, leaving the
route on the old side of a flipped shape); Ctrl+R goes through
`cellsArranged`. Style writes inside an arrange
(`Graph.beginArrange` also tracks `mxStyleChange`s: `cellsArranged` carries
`restyled` + `previousStyles`) are handled like a `styleChanged` edit of the
routing keys that differ (`getChangedStyles` over `constraintStyles` +
`frameStyles` + `endStyles`, the keys `maskSides`/`shapeFrame`/
`fixedConstraint`/`snapPoints`/`jettyFor` read, plus `libavoidRouting` so
that turning the flag on routes the edge; a `jettySize=auto` end whose arrow
changes the resolved jetty counts as a `jettySize` change). Edit Style wraps its
`setCellStyle` in the pair (it fired nothing — a rotation, flip, direction or
port constraint typed there left the route stale), so does the shape
replacement `Graph.updateShapes` (Shift+click in the sidebar or shape picker,
Shift+drop onto a shape: a lost rotation, a new direction, the size of a
group source), Paste Style (a pasted `libavoidRouting=1` routes the edge),
Edit Connection Points, Edit Shape, the inline toolbar arrows (the jetty of a
`jettySize=auto` end), the embed `updates` message (styles and geometries)
and the identity updates of a CSV import, and the Flip buttons
(`Graph.flipCells`) and Ctrl+R on a swimlane, which turns only its
`direction`, are covered by their existing arrange. On the `styleChanged`
path an arrow edit (`arrowStyles`) re-routes an edge with a `jettySize=auto`
end (`hasAutoJetty`). Not `styleChanged` for
Edit Style: that event also feeds the sticky default styles
(`updateDefaultStyle`, `copyCellStyles`). The rotate HANDLE (drag
→ `mxVertexHandler.rotateCell`, click → `rotateClick`) writes the style
directly; the drag's top-level arrange reports the new style, but a click on
an unfilled shape is a plain `setCellStyles`, and neither gives the drawn box
BEFORE the rotation, so `installAutoRouting` wraps both on the
handlers of its graph (`graph.createVertexHandler`, per instance — no
prototype patch, nothing in Graph.js): the gesture's top-level call records
the drawn boxes of the shape and its descendants before and after and
re-routes their connected auto-edges plus those crossing any of the boxes,
inside the handler's model update (one undo step). A group's children,
turned by the recursive `rotateCell(child, angle, parent)`, ride along.

## Port-constraint masks (July 2026)

The same legacy mask vocabulary the ELK bridge honors constrains libavoid
routes. The core takes per-end `sourceSides`/`targetSides` (arrays of
'N'/'S'/'E'/'W'): non-exclusive directed pins spread along every allowed side
(`AvoidRouting.maskPinPoints`, ~20px apart, 1–9 per side) share ONE pin class,
so libavoid picks the side AND position that route best — no pre-picking one
side like ELK's FIXED_SIDE needs. A `*Constraint` (fixed anchor) wins over the
mask on the same end; masked ends have no jetty stubs (they behave like
floating ends). The editor binding resolves masks via
`LibavoidRouting.maskSides` (thin wrapper over `mxUtils.getPortConstraints`,
so rotation and terminal-over-edge precedence match the renderer exactly) in
the commit path (`routeCells`), the shape-drag re-route (`solveMovePreview`),
and both drag previews: the fixed end's mask pins are built once per warm
session (`buildPreviewSession`), a masked hover-target routes through the
fresh `previewRouteToCell` path like an anchor snap. Masks produce no style
writes — the router re-enforces them on the floating attach at render time,
so routes and render agree with zero freeze risk.

## snapToPoint (July 2026)

Floating ends whose terminal (or edge) carries `snapToPoint=1` route to one of
the shape's DECLARED connection points, mirroring the render-time snap
(`updateFloatingTerminalPoint`'s snapToPoint branch, grapheditor/Graph.js).
The core takes per-end `sourcePoints`/`targetPoints` (arrays of `{x,y,dir}`
candidate anchors): one non-exclusive directed pin per candidate under ONE pin
class, so libavoid picks the anchor that routes best. Per-end precedence
mirrors the renderer: `*Constraint` (explicit pinned anchor) > `*Points` (the
render snap branch runs before mask enforcement) > `*Sides`; snapped ends have
no jetty stubs, like masked ends, and produce no style writes. The editor
binding resolves the set via `LibavoidRouting.snapPoints`
(`graph.getAllConnectionConstraints` for the CURRENT terminal style and a
shape at the routing size — the auto-routing solves at BEFORE_UNDO, before
the view revalidates, so the view state can still hold the `points` or shape
from before an Edit Style; the rendered shape serves as the prototype while
the shape name is unchanged, as `mxgraph.bpmn.shape` declares its
constraints only when painted; a terminal added in the same edit has no view
state yet, so "rendered" is `isRendered`, the view's own visibility rule;
each constraint's dx/dy folds into the fraction over the model size) at the
same call sites as the masks:
`routeCells`, `solveMovePreview`, and both drag previews (fixed-end pins once
per warm session, snap hover-targets through the fresh `previewRouteToCell`
path).

## Enclosing obstacles

`AvoidRouting.computeRoutes` drops obstacles whose bounds fully contain a
routed edge's terminal (`filterEnclosing`; terminals themselves are never
dropped) — the swimlane/pool/group the terminals live IN is not something to
route around. Registering it starved the solve of corridors (routes could cut
straight through sibling shapes) and suppressed the terminals' jetty stubs
(`jettyStub` refuses tips inside any obstacle). Containment is geometric (the
core is model-free); the warm endpoint-drag preview session
(`buildPreviewSession`) applies the same filter against its fixed cell.

The hovered-target side (Aug 2026): EVERY resolved hover target routes
through the fresh `previewRouteToCell` path — the `pinned` gates in both drag
previews are simply "target resolved and expressible" (in the session's
shapeRefs or transparentBounds); the warm session solves only the
empty-space cursor tracking. Two regressions forced this generalization
before it settled: (1) a plain hover target INSIDE a container solved WITH
that container as an obstacle while the commit drops it via
`filterEnclosing` — the session's obstacle set is filtered once, against the
FIXED end only (connect preview entered a swimlane's child from the left,
the drop committed a route through the swimlane's bottom); (2) a CONTAINER
as the hover target itself: the warm path approximates the target as a free
point at its centre, which sits inside the target's own obstacle, and the
warm router's incremental state biases the escape side — a reconnect
preview entered the swimlane from below while the drop committed a
left-side entry, even though commit and warm endpoint were identical (the
fresh solve has no route history). The same bias hits (3) the cursor over
empty space INSIDE an obstacle — released there as a dangling end, the
commit runs a fresh dangling solve: such cursor positions route through
`previewRouteToPoint` (`insideAny` against the session's obstacle list;
same dangling descriptor as `routeCells`, bare free point, no
constraint/pins/jetty on the dragged end). Open-space cursor tracking
stays on the warm session. Cost is bounded by the existing 30ms preview
throttle, like masked/snap/anchor targets before.

## Self-loops (Aug 2026)

The core `computeRoutes` SKIPS self-loop edges (`source === target`; an edge
with no route entry is never written) — obstacle avoidance between identical
endpoints is meaningless, and libavoid's orthogonal router degenerates to a
buffer-sized hook beside the shape. Self-loops belong to the editor's loop
styling: creating one stamps `orthogonalEdgeStyle` + `innerLoopWaypoints=1` +
default east-loop waypoints (`Graph.applyLoopStyle`), which the auto-route at
BEFORE_UNDO used to clobber right after the stamp (first seen as a connect
onto the source's own anchor committing a 16x15px hook at the buffer
distance). Both drag previews already skipped self-loops per-frame (default
preview while hovering the fixed/source cell), and `isAutoEdge` deliberately
stays true for flagged loops: an endpoint drag that UN-loops the edge onto
another shape previews and commits through libavoid as usual — the flag on a
loop is inert, not cleared.

## Dangling (unconnected) ends (July 2026)

An edge end with no terminal vertex routes to a free point instead of being
skipped, so a committed edge with an unconnected end matches its drag preview
(previously the commit fell back to plain `orthogonalEdgeStyle` + stale
waypoints while the warm-session preview routed to the cursor —
`computeRoutes`/`routeCells` required BOTH ends on vertices). The core
`computeRoutes` accepts `sourcePoint`/`targetPoint` `{x,y}` (absolute) for an
end with no `source`/`target` vertex: a plain `Point` ConnEnd, no
shape/direction/pin/mask/jetty (`makeEnd`/`anchor` free-point branches;
`cappedJetty` no-ops when a bound is missing; skip only when an end is neither
vertex nor point). The editor binding resolves the free point via
`LibavoidRouting.danglingPoint` (edge geometry's terminal point + absolute
parent offset) at every auto-route path — `routeCells`, `edgeRouteBounds` (so
a moved shape still detects the dangling edge), and `solveMovePreview` (the
free point stays put while the connected shape moves; the rigid-move shortcut
needs both vertex ends). At least ONE vertex end is required (like the
preview's fixed cell); both-dangling edges are left alone.

## transparentBounds terminals (July 2026)

A transparentBounds group (mermaid/PlantUML wrappers, layout containers) works
as a routed edge's terminal. `LibavoidRouting.getAbsoluteModelBounds` resolves
these cells to their DERIVED hull (`Graph.getTransparentBounds` in the cell's
local space, shifted by the stored origin) — the stored geometry is a pinned
origin by design, so routing against it put the terminal at the page origin:
the connect preview committed garbage bends (e.g. a `(620,0)` waypoint) and
every maintenance pass then silently skipped the edge via the core's
`bounds[id] == null` guard. The hulls stay OUT of `collectVertices` (children
are the obstacles; the padding band stays crossable) — each solve registers a
routed edge's transparentBounds terminals ad hoc via
`LibavoidRouting.addTerminalVertex` (routeCells; solveMovePreview before its
preview shift, so a dragged hull rides the drag; previewRouteToCell;
buildPreviewSession — filterEnclosing keeps them, a routed edge's own
terminals are never dropped). The drag previews' `pinned` gates accept
transparentBounds targets (never in the warm session's shapeRefs — the fresh
path registers them itself); the warm float-hover preview approximates
(endpoint at the derived center, no hull obstacle in the session), the drop
commits exact. `snapPoints` folds constraint dx/dy over the same routing box,
and the derived boxes fix the move/resize overlap regions for dragged
containers. Editor-binding only — the canonical core is untouched (nothing to
sync to drawio-mcp).

## Relative and edge children (Oct 2026)

`getAbsoluteModelBounds` and `getAbsoluteParentOffset` (which also converts
routes into an edge's parent frame) must place a vertex where the VIEW draws
it, or the solve routes from and around a box that is not there. The plain
`geometry + ancestor geometries` sum got three cases wrong. All three fixes
are in the editor binding only (the core takes absolute boxes, nothing to
sync to drawio-mcp):

- **Relative children of vertices (ports)**: `geo.x`/`geo.y` are fractions
  of the parent's size and were read as coordinates. A port at (0.25, 0.5)
  on a 400x300 shape routed from the shape's top-left corner, so the one
  bend sat at the corner's height and the route climbed to the parent's top
  edge and came down onto the target (6030a3ebe5). `getGeometryOrigin`
  follows `mxGraphView.updateCellState`: the fraction of the parent's size
  (the derived hull for a transparentBounds parent) plus `geo.offset`.
  `getAbsoluteGeometryBounds` follows `updateVertexState`: a relative child
  of a ROTATED parent turns about the parent's centre (a non-numeric
  rotation counts as none, as in `shapeFrame`). The resize/arrange affected
  region places the PREVIOUS geometry through the same helper.
- **Relative children of edges (edge labels)**: the view places them along
  the edge's drawn route (`mxGraphView.getPoint`), which the model does not
  give and the routing itself changes. They were obstacles at their
  geometry's x/y (the position along the edge, -1..1), a stray box at the
  page origin in every solve, common with sized labels from VSDX and
  Lucidchart imports. `isOnEdge` (the cell or a vertex ancestor is a
  relative child of an edge) makes `getAbsoluteModelBounds` return null: no
  obstacle, and an edge connected to such a label stays as authored
  (916c8f2922). Every consumer handles the null box.
- **Absolute children of edges**: the offset walk stopped at the edge and
  lost the offset of the edge's container. An edge adds nothing (the view
  places its absolute children in the edge's parent frame), so the walk now
  passes through it (58758f12c4).

In-page check: for every vertex with a state, `getAbsoluteModelBounds` equals
the state's unscaled box (`state.x / scale - translate.x`, `state.width /
scale`); cells on edges are the expected nulls.

## Auto-routing solves at BEFORE_UNDO, after childLayouts (July 2026)

The auto-routing graph events (CELLS_ADDED / CELL_CONNECTED / CELLS_MOVED /
CELLS_RESIZED / `cellsArranged`, `installAutoRouting`) only COLLECT affected
cells. `cellsArranged` (Sept 2026) is fired by `Graph.endArrange` for arrange
actions that write vertex geometries directly — Arrange panel
position/size, Edit Geometry, Paste Size, distribute, turn, transparentBounds
align and every layout run through `EditorUi.executeLayout` — which
previously re-routed nothing until
the next gesture touched the edge; it carries `cells` + `previous` geometries
like CELLS_RESIZED (plus `restyled` + `previousStyles` for the style writes
of the arrange, see the rotated shapes section) and never fires on undo/redo
or remote patches. It is a
separate event on purpose: firing CELLS_MOVED/RESIZED from those paths would
also trigger every other listener of those events. `autoReroute` parks the
solve on the graph (`__libavoidPendingReroute`) and
flushes it from the model's BEFORE_UNDO — lazily registered, so it sits after
mxLayoutManager's handler and runs once the edit's synchronous childLayouts
(stack/table/tree, sync-path ELK) have written their geometry. Solving inside
the event routed a terminal dropped into a stack against the DROP position:
the layout re-slots the cell and resizes the container afterwards via
model-level writes that re-fire no graph events, so the stale route stuck
until the next gesture. BEFORE_UNDO fires before the edit closes (the
endingUpdate latch swallows the flush's nested dispatch), so the route still
joins the gesture's single undoable edit; undo/redo replay and remote collab
edits never park (the pending store is fed only by the forward-gesture
events). The flush re-expands the affected set against the POST-layout state:
parked vertices' current bounds plus every childLayout ancestor's bounds —
ancestors resolved at park time (pre-gesture chain/boxes: a drag OUT of a
stack records the container before resizeParent shrinks it) and at flush time
(a drop INTO one reparents after CELLS_MOVED) — feed a second
`collectOverlappingEdges` pass, so edges over re-flowed siblings or the grown
container re-route too. Plain-canvas gestures skip parking when the event
found no flagged edges and no vertex under a layout container. The ASYNC
layout fallback still applies in its own later edit — edges attached into
such a container's children from outside stay stale there (pre-existing,
accepted). Outside any update (cold-start resolve) `solveReroute` runs
immediately as before, now also skipping edges no longer contained in the
model.

## Auto-routing ownership

`libavoidRouting=1` edges are NOT auto-routed inside a live layout container —
`LibavoidRouting.isAutoEdge` is false when a vertex ancestor carries
`childLayout` (`layoutContainerOf`, same test as the mxLayoutManager
`hasLayout` override), because the manager's layout re-run inside the same
edit overwrites every libavoid write, so previews showed routes that never
commit (the flag stays on the style, inert until the edge leaves the
container, e.g. by copy-paste to the canvas). The endpoint-drag and new-edge
previews carry the same gate; the new-edge preview predicts the committed
edge's parent as the terminals' nearest COMMON ANCESTOR (what
`mxGraphModel.maintainEdgeParent` re-parents to) and gates when that sits in
or under a childLayout container — comparing the two ends' own nearest
containers misses cross-level connects (nested list → outer list), where
`connect()` then baked the preview bends as ABSOLUTE `geometry.points` into
the container parent's frame with no re-route to clean them up (July 2026).

The shape-drag live preview (`solveMovePreview`) additionally skips RIGIDLY
moving edges (edge + both terminals in the drag's moving set — e.g. a whole
container or selection dragged): the base mxGraphHandler preview already
translates the displayed route, which is the correct preview; they are
re-solved only when the translated route comes within `shapeBufferDistance` of
a stationary obstacle. Its obstacles come from `collectVertices` (same
`transparentBounds` skip as the commit path). The preview's transient edge
STATES have an explicit lifecycle (`handler.__libavoidMoveTouched`): an edge
that leaves the affected set mid-drag is invalidated per frame, and
`endMovePreview` (wired from `mxGraphHandler.reset`, i.e. drop AND
cancel/escape) restores everything the drag touched — otherwise an edge the
drag crossed and left kept the preview route on screen with nothing in the
model (an un-undoable ghost; the committed re-routes themselves join the
move's single undoable edit via the warm synchronous `autoReroute`).
CLONE drags (`handler.cloning`) skip the solve — the originals stay in place
and the clone's edges are routed by the CELLS_MOVED commit on drop — but the
empty route set keeps that touched cleanup running, so transient routes from
before a mid-drag switch to cloning revert to the model route. A dangling
free point rides the drag when its edge is itself in the moving set (the
commit translates the edge geometry including terminal points) — applied in
BOTH halves: the solve descriptor (`solveMovePreview`) and the state
application (`livePreviewMove`, where `updateFixedTerminalPoints` would
otherwise re-derive the end from the not-yet-translated model geometry); a
stationary edge's free point stays anchored like the commit's re-route.
The base `mxGraphHandler.updateLivePreview` must derive a dangling end from
the GEOMETRY per frame (`getFixedTerminalPoint`), not from the state's last
points: the application leaves the ridden route in the state across frames,
so `state-point + delta` double-counts — the dashed handler border (drawn
inside the base pass, BEFORE the application corrects the state) visibly ran
away from the edge at twice the drag speed.

A layout run that STAMPS its own edge routing takes the edges over:
`diagramly/ElkLayout.js` wraps `ElkLayout._applyResult` (both attach paths of
the staged bindings) to call `LibavoidRouting.releaseEdges`, which sets
`libavoidRouting=0` on flagged visible edges under the layout parent (honoring
the run's cellFilter scope; only-when-'1' keeps converged childLayout re-runs
empty). `edgeStyleMode` `'keep'` skips the release. Without it, the next
gesture re-routed the just-laid-out edges per-edge via libavoid against the
stamped exit/entry pins.

## jettySize

Routed edges honour the `jettySize`/`sourceJettySize`/`targetJettySize` edge
style for the first/last segment at **fixed connection points**
(`exitX`/`entryX`…): `jettyFor` resolves the value like
`mxEdgeStyle.getJettySize` (incl. `'auto'`), and `computeRoutes` forces the
route through a plain `Avoid.Checkpoint` at the stub tip (anchor + jetty
outward). This is necessary because a directed pin gives no minimum lead-out
(the route may turn at the anchor and run flush along the shape),
`ConnEnd(Point, dirs)` isn't bound in the WASM build, and routed edges render
via `SegmentConnector` (waypoints trip `orthPointsFallback`), which has no
jetty of its own.

The checkpoints are requested LAZILY (July 2026): the first solve runs without
them, each end's straight lead-out is measured on the raw route
(collinear-merged), and only edges falling short of a jetty get their
checkpoints set and the transaction re-processed once — a route that TURNS at
a checkpoint has that bend pinned to the stub tip (nudging cannot center the
pinned segment in its channel), which produced lopsided lead-outs like 30/10
next to a centered 20/20 twin on mermaid-import diamonds (default jetty =
`orthBuffer` 10 when the style has no `jettySize`; the jetty is a MINIMUM —
routes center when there is room, they do not bend at exactly jettySize).
The re-process needs the connector QUEUED: draw.io's own pure-JS build does
not queue it on `setRoutingCheckpoints` (the libavoid-js WASM build of
drawio-mcp does), so the core sets the connector's source end again and
`solvePreviewSession` its dragged end. From the switch to that build
(462228cc15, July 14) until Oct 2026 the second pass was a no-op: every
jetty was ignored in the editor, by the commit and the preview alike.

Guards in `jettyStub`/`computeRoutes`: skipped for corner/interior anchors
(2+ direction bits), for stub tips inside an obstacle, and for edges shorter
than the summed stubs (OrthConnector's too-short rule). The core additionally
caps each end's jetty to the clearance along the stub's OWN axis toward the
other terminal (`AvoidRouting.cappedJetty` — in the core, not the editor
wrapper, so drawio-mcp's direct callers inherit it: half the directed gap
minus the 4px channel, the same split as the wrapper's buffer cap, so facing
stubs can never cross): a longer stub extending into the pair's gap puts its
checkpoint past the corridor channel (or across the other end's tip) and
libavoid answers with a self-overlapping hairpin that nudging splays into flat
side-loops; the Euclidean too-short guard misses this whenever a lateral
offset inflates the anchor distance past the summed stubs (July 2026, first
seen as `jettySize=auto` mangling in 32px-gap rows). Stubs along the other
axis or pointing away from the other shape keep the full jettySize — a narrow
gap squeezes only the center segment, not the lead-outs (e.g. an L-shaped edge
around a 15px horizontal gap). Floating ends are unaffected (their first bend
naturally sits ~`shapeBufferDistance` out).

Preview parity: the pinned drag previews route through `computeRoutes`; the
warm per-drag session precomputes the fixed end's stub in
`buildPreviewSession`, and `solvePreviewSession` enforces it per frame
exactly as the commit's lazy check does — natural solve first, stub only
when the dragged end passes the too-short guard, the route is not a fallback
and its fixed-end lead-out (`AvoidRouting.endSegment`, shared with the core)
is short of the jetty. The session used to apply the stub whenever the end
was far enough away, so the preview turned at the stub tip where the drop
did not (a line jumping ~6px on release; 58% of a 392-case sweep differed,
now none of 1,568). Checkpoint direction flags are deliberately NOT
used (vertical-axis convention is inverted in the WASM build; plain point
checkpoints suffice).
