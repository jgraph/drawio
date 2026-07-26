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
(`graph.getAllConnectionConstraints` on the terminal's view STATE — stencil
constraints need the rendered shape; each constraint's dx/dy folds into the
fraction over the model size) at the same call sites as the masks:
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

## Auto-routing solves at BEFORE_UNDO, after childLayouts (July 2026)

The auto-routing graph events (CELLS_ADDED / CELL_CONNECTED / CELLS_MOVED /
CELLS_RESIZED, `installAutoRouting`) only COLLECT affected cells;
`autoReroute` parks the solve on the graph (`__libavoidPendingReroute`) and
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
previews carry the same gate.

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
`buildPreviewSession` and `updatePreviewCheckpoint` toggles it per frame
against the too-short guard. Checkpoint direction flags are deliberately NOT
used (vertical-axis convention is inverted in the WASM build; plain point
checkpoints suffice).
