# Layout system: JSON specs, ELK bridge, live layout containers

Covers the layout-spec resolver, `Run Last Layout`, retargeting to a selected
container, the ELK childLayout containers behind Insert > Layout, and the
contracts the drawio-elk bridge must uphold (convergence, pin/anchor/mask
handling). The bridge itself (`ElkAdapter`/`ElkApplier`) lives in the sibling
repo `../drawio-elk` — see `docs/claude/native-bundles.md`. libavoid routing
details: `docs/claude/libavoid-routing.md`.

## Layout-spec resolver

`EditorUi.resolveLayoutList` (diagramly/EditorUi.js) is the single resolver
for layout specs — JSON custom-layout arrays, the `libavoid` shorthand
(`LibavoidRouting.SHORTHAND`; the technical name `orthogonalEdge` also works),
`parallels` (mxParallelEdgeLayout with menu defaults) and the
`ElkLayout.MENU_PRESETS` preset names (normalized to `{layout: elk*, config}`
entries via `Graph.elkLayoutNameForAlgorithm`/`elkOptionsToConfig`; LAYERED
presets merge `ElkLayout.CANONICAL_EDGE` — since July 2026 the strict
`orthogonalEdgeStyle` mode, one "orthogonal" connector for the dialog, MCP and
mermaid-edit alike after the perpendicular pins made conservative and strict
renders identical; the ELK dialog folds a saved `orthogonalStrict` onto
'orthogonal'. Non-layered presets take only the `corners` half — mrtree keeps
edge mode 'auto', radial/organic straight spokes. The conservative
`orthogonal`/`elkCompat` modes stay supported in specs). Used by
`executeLayoutSpec` (desktop `--layout`, embed `layout` action, embed load
`layout` option, `#create` hash) and by `doImportCsv` (`# layout:` line;
CSV-reserved names incl. `organic` and the `CSV_ELK_LAYOUTS` keys keep their
own branches and never reach the resolver).

Every user-facing layout run (`executeLayoutSpec`, `ElkLayout.run`,
`LibavoidRouting.run`, the Parallels menu item, custom layout dialog) records
a custom-layout array on `ui.lastLayoutSpec`, which Arrange > Layout >
**Run Last Layout** (first menu item, grayed while null) replays via
`executeLayoutSpec`. The Layout menu is also a toolbar dropdown
(`Editor.layoutImage`, Material `flowchart` glyph) next to the generate icon
in the classic toolbar (grapheditor/Toolbar.js) and the sketch/simple picker
(diagramly/Simple.js). Shorthand lists are documented in the CSV dialog text
(`Editor.defaultCsvValue`), drawusaurus json-layout-specification.md and
`../drawio-tools/tools/csv.html`.

## Layout runs retarget a selected layout container

With exactly one vertex selected whose style carries a replaceable
`childLayout` (not the structural `tableLayout`/`stackLayout`/`rack`), the
user-gesture layout runs (`ElkLayout.run`, `LibavoidRouting.run`, the
Parallels and circle menu items, the custom layout dialog, and
`executeLayoutSpec` ONLY with its `retargetSelection` flag — passed by Run
Last Layout; the programmatic callers (embed layout action, `#create`,
desktop `--layout`) stay whole-page so a transient selection can't hijack a
host-triggered run) rewrite the container's `childLayout` to that spec instead
of running one-shot — `EditorUi.getSelectedLayoutContainer` +
`EditorUi.setContainerChildLayout` (diagramly/EditorUi.js). The style write
triggers the layout manager, so the new layout runs in the same undoable edit
(mxStyleChange → `addCellsWithLayout(cell)` includes the cell's own layout);
an unchanged value produces no model change, so the helper re-runs via
`layoutManager.executeLayout(cell, false)` to keep the gesture from no-oping
(if that run writes, the manager runs once more at endUpdate and converges —
deliberate trade-off so the common converged case stays a clean no-op with no
undo step).

Specs must be non-empty custom-layout ARRAYS: the helper throws for anything
else (a non-array would serialize to a live-layout-killing `[]`), the two JSON
call sites (custom dialog, executeLayoutSpec) gate the divert on
`Array.isArray` so other parsed JSON keeps the legacy one-shot path, and
container-unsafe names are rejected (`mxRadialTreeLayout` crashes on
delete-triggered re-runs; `mxOrgChartLayout` doesn't exist before
loadOrgChartLayouts, so a persisted reference is dead next session;
`mxFastOrganicLayout` seeds coincident cells with `Math.random` and restarts
its force sim from the current positions, so it rescrambles every re-run — use
`elkOrganic`; `mxCircleLayout` as JSON misses the getLayout branch's
transparent-anchor handling and drifts by a constant offset per run —
container circles must use the raw `circleLayout` string).
`Graph.createLayouts` additionally skips a config key whose current value is a
FUNCTION, so a spec like `{"config":{"execute":"x"}}` can't clobber a layout
method and throw out of the manager's BEFORE_UNDO dispatch on every edit
(which would kill the container's undo history). Before writing, elk* entries
are cloned with `rootCellIds` stripped (cell ids don't belong in a style; the
container IS the root — the ELK dialog also hides its selection-as-root
checkbox when Apply will divert) and absent-only container defaults filled to
match `Menus.layoutContainers`: `resizeNodes:false`, `resizeLayoutRoot:true`,
and `extractIsolated:false` for elkLayered (extraction never converges under
the manager). The circle item writes the raw `circleLayout` string (the JSON
`mxCircleLayout` form would miss the getLayout branch's transparent-anchor
handling); the list form is validated via `graph.createLayouts` and written
URL-encoded (`Graph.encodeChildLayout`); the `;` rejection guards only the raw
string path.

An `orthogonalEdge` childLayout routes only the container's descendant edges:
`LibavoidRouting.createLayout` scopes to a vertex layout root that CARRIES
childLayout (after Enter Group the default parent is a plain vertex, which
keeps the legacy selected-or-all scope), and the adapter carries no-op
`moveCell`/`resizeCell` — mxCompositeLayout delegates interactive child drags
to `layouts[0].moveCell`, which threw before the no-ops existed. The Legacy
Layouts submenu, orgChart and the CSV/import paths keep one-shot behavior
(they never recorded specs).

## ELK childLayout containers (Insert > Layout)

Insert > Layout inserts a **live layout container** + small seed graph instead
of the old CreateGraphDialog (removed June 2026). Flows, trees, radial and
organic use ELK via the JSON childLayout form
(`[{"layout":"elkLayered","config":{...}}]`, resolved by
`Graph.createLayouts`); circle stays sync `childLayout=circleLayout`. The
layout manager re-runs the layout on every change inside the container, so
diagrams are assembled on the real canvas with full editing UX.

The JSON form is **URL-encoded in the style** (`childLayout=%5B%7B...` — July
2026, same idiom as `fontSource`) so no `;`/`=` from the JSON can corrupt the
`key=value;` style parsing: writers use `Graph.encodeChildLayout` (the
`Menus.layoutContainers` builder and `EditorUi.setContainerChildLayout` — the
only two JSON writers), the single reader (`initLayoutManager`'s getLayout
`childLayout` branch) goes through `Graph.decodeChildLayout`, which also still
accepts the raw `[` JSON written by older versions (existing files must keep
their live layouts; legacy plain-string values decode to null and keep their
own branches). All other childLayout code is presence/equality checks on the
plain-string values and is unaffected.

The containers are **transparentBounds=1;groupPadding=20** (July 2026): stored
geometry pinned at (0,0,0,0), children carry the absolute position, visible
box derived from children + groupPadding (+ swimlane title bar, see
`Graph.getTransparentBounds`). Every layout run **anchors at the content's
current top-left** — the ELK bridge does this for any transparent layout root
(drawio-elk `_applyResult`, which also skips the `resizeLayoutRoot` geometry
write there; without the anchor each run re-planted the content at ELK's
near-(0,0) output frame, snapping the container to the page origin after every
drag since dragging a transparent group translates its children). The circle
getLayout branch mirrors the anchor by shifting the ring back to the pre-run
content min for transparent parents (its moveCircle/x0/y0 frame is
parent-relative); the legacy childLayout branches disable resizeParent via the
shared `transparentParent` flag.

Container styles live in the `Menus.layoutContainers` static
(diagramly/Menus.js) in two variants built from one config source: `style`
(borderless `group;…` — used by Insert > Layout, inserted with an empty value
and the seed cells placed at the insert point + 20 while the container stays
pinned) and `sidebarStyle` (titled transparent `swimlane;…` — used by the
Advanced sidebar templates, Sidebar-Advanced.js; same pattern as the Trees.js
"Tree Container"). The configs carry explicit spacing matched to the legacy
flowLayout/treeLayout sidebar containers: 50 between ranks/levels
(`elk.layered.spacing.nodeNodeBetweenLayers`; mrtree's single
`elk.spacing.nodeNode=40` covers level AND sibling gaps), 30/40 between
siblings. `elk.padding` is inert while the container is transparent (the
anchor cancels any uniform frame offset) but keeps the legacy margins if
transparentBounds is toggled off. The sidebar seed cells are authored at the
exact positions ELK computes — the layout can't run for the palette thumbnail,
and a drop then converges without moving anything; with the anchor only the
RELATIVE positions must match ELK's output. When ELK output changes
(spacing/defaults), re-measure and update those seeds.

## Sync by default, async fallback

**Sync**: the native drawio-elk port computes on the calling thread
(`ELK.layoutSync`; the Promise `layout()` is an elkjs-compat wrapper), so the
bridge exposes `ElkLayout.executeSync` (convert → layoutSync → apply in one
stack; gate on `canExecuteSync`). The manager override in `initLayoutManager`
runs ELK childLayouts through it INSIDE the triggering edit — the manager
fires from the model's BEFORE_UNDO hook, whose `endingUpdate` latch folds
handler writes into the same undoable edit: single undo step, exactly one run
per outermost transaction, no re-trigger possible. `Graph.executeLayoutSync`
try/catches per member (a throw during BEFORE_UNDO would abort the user's own
edit). The manager's `executeLayout` override skips cells not contained in the
model (same guard as the async scheduler): the sidebar tooltip preview styles
its clones via `pasteCellStyles` — an `mxStyleChange` transaction the manager
reacts to — BEFORE inserting them, so a childLayout container used to reach
ELK as an id-less cell tree (JsonImportException on every hover); the insert
that follows re-triggers the layout properly.

**Async fallback**: prepare-based layouts that can't run sync (engines without
layoutSync — see `Graph.canExecuteLayoutSync`) queue on
`Graph.scheduleAsyncLayout` / `runAsyncLayout` (grapheditor/Graph.js):
per-cell dedupe, next-tick chained runs (children before parents), a
dirty-flag rerun for changes arriving while the engine computes,
`model.contains` guards against deleted/queued-stale containers, and an
`asyncLayoutsApplying` guard so the apply edit can't re-trigger its own
container. On this path the apply lands in its own undoable edit (gesture = 2
undo steps). The libavoid childLayout adapter carries
`canExecuteSync`/`executeSync` — without it a composite like
`[elkLayered, orthogonalEdge]` forced the WHOLE composite async.

## Convergence contract (critical)

An unchanged layout result MUST produce an EMPTY model edit — the manager
re-runs the layout after every non-empty edit, so any unconditional write in
the apply path is an infinite async loop there (the sync path is immune — its
writes join the triggering edit and the `endingUpdate` latch bounds it to one
manager pass per transaction). The 2026-06-21 production release looped
exactly this way (bundle `743419f` predates every guard; hand-authoring a
childLayout JSON style froze the app in a `fileChanged` autosave loop).
"Empty" means NO writes, not net-zero writes: the async scheduler's
cross-container termination (nested containers re-schedule each other via the
manager's ancestor walk — `asyncLayoutsApplying` only guards the applying
container itself) relies on it, so write-then-revert patterns are loop fuel.

drawio-elk enforces it with: value-equal geometry skips (nodes/edges; a
converged transparent-leaf shift no-ops via the `< 0.01` guard), the
preserveOrigin/transparent-root anchor FOLDED into the applier writes as an
offset (`resultContentTopLeft` — never write-raw-then-shift-back; only
extracted-isolated runs keep the legacy post-shift, and they never run under
the manager), one value-guarded style write per cell via the shared
`StyleBatch` (never strip-then-rewrite pins per key), and `_applyEdgeStyle`
skipping `resetEdge` for applier-routed edges (`routedEdges` set).
`verify-bridge-convergence.mjs` locks the contract (zero-write run 2 on the
reported production model, all edge modes). Keep all guards regardless of path
— they also keep collab diffs, undo history and the modified-state minimal.

## Container options in drawio-elk

All pass through `Graph.elkConfigToOptions`: `resizeLayoutRoot` (write ELK's
computed root box onto the layout parent, position untouched — the
mxGraphLayout resizeParent + maintainParentLocation equivalent),
`extractIsolated:false` (keep unconnected cells in the layered input — the
stack-above placement targets the layout parent now but its shift-then-stack
write pattern never converges under the manager), root `elk.padding` derived
from a vertex parent's startSize (side-title `horizontal=0` swimlanes pad left
instead of top), and no-op `moveCell`/`resizeCell`
(mxLayoutManager/mxCompositeLayout delegate to them for interactive moves).
mxRadialTreeLayout is NOT container-safe (ignores the parent frame, crashes on
delete-triggered re-runs) — that's why radial had to wait for ELK.

Edge treatment per entry: flows stamp `edgeStyle:'orthogonalEdgeStyle'` +
`corners:'rounded'`; trees keep edge mode 'auto' (explicit strict-orthogonal
on mrtree renders badly) but stamp `corners:'rounded'`, so an edge drawn with
the session's default style has its corners normalized to the seeded look on
the next run; radial/organic pass no edge config at all (straight spokes —
corners have no visual effect). Radial's DEFAULTS carry
`elk.edgeRouting:POLYLINE` so 'auto' resolves to straight spokes instead of
orthogonal staircases. Every mrtree run also collapses the AVOID_OVERLAP stem
spread onto the parent's side center (`ElkLayout.collapseTreeStems` in the
bridge): all child edges share one outgoing segment and exit pin before
fanning out in the level channel — the legacy mxCompactTreeLayout look. Opt
out per run with the bare config key `sharedStems:false` (recognized by
`Graph.elkConfigToOptions`/`elkOptionsToConfig`, documented in drawusaurus
json-layout-specification.md); an explicit `portSpread` also skips the
collapse. The core mrtree router stays fixture-faithful to upstream ELK; only
the bridge restyles the result.

## Per-edge corner picks survive manager re-runs (July 2026)

The manager builds childLayout ELK layouts with `enforceCorners:false`
(`initLayoutManager` → `Graph.createLayouts(list, {enforceCorners:false})`),
which makes the bridge's corners stamp a DEFAULT instead of an enforcement: it
writes `rounded`/`curved` only on edges whose style has no explicit `curved`
key yet. The key's presence is the provenance marker for "corners were
decided" — the Format panel line dropdown always writes `rounded` AND `curved`
together, the stamp materializes both (so normalization is one-shot), while a
freshly drawn session-default edge carries `rounded` but no `curved`. A user's
sharp/rounded/curved pick on an edge therefore sticks across edits (before
this, the pick was reverted INSIDE its own edit — the style change triggers
the manager, whose restyle pass stamped the config back), and new edges still
normalize to the container look. Explicit gestures still enforce:
`EditorUi.setContainerChildLayout` re-themes all descendant edges via the
bridge static `ElkLayout.applyCorners(graph, cell, corners)` (same walk as the
restyle pass — plain groups yes, nested childLayout leaves never;
value-guarded StyleBatch) in the same edit as the spec write, so the ELK
dialog's corners dropdown re-themes existing edges even though the manager run
it triggers is soft. One-shot runs (whole-page layouts, CSV/mermaid import,
drawio-mcp) keep the historic enforce-always default. Known quirk: the
right-click waypoint-style menu items write `curved=null`, re-virginizing an
edge's corners — the next run re-adopts the container look (accepted for a
style-family change). Locked by verify-bridge-corners-retention.mjs.

## Legacy port-constraint masks are honored (July 2026)

The mxGraph constraint styles the pre-ELK pipeline's orthogonal router
enforced — vertex `portConstraint` (+`portConstraintRotation`), edge
`sourcePortConstraint`/`targetPortConstraint`, direction-substring values
(`east`, `eastwest`, `northsouth`, …) — constrain ELK runs: the adapter emits
a FIXED_SIDE mask port per constrained end
(`ElkAdapter._portConstraintSides`/`_createMaskPort`; multi-side masks resolve
to the flow-natural side per `elk.direction`, then geometry), and the applier
leaves masked ends FLOATING like climbed ends (adapter `getMaskedEnds` →
applier `maskedEnds`; the `srcNoPin`/`tgtNoPin` union) — a stamped pin would
override mxGraph's render-time mask enforcement and freeze the chosen side.
Exception: a masked end whose terminal (or edge) carries `snapToPoint=1` SNAPS
and pins instead — the renderer's snap branch runs before mask enforcement, so
a floated end was render-snapped to an anchor while the route ended at the
mask port's position (an angled final segment); the mask still constrains the
ROUTE via its FIXED_SIDE port, and the bare pin re-derives every run. An
explicitly styled jettySize rides the mask port as a `borderOffset` stub (see
below). User masks are provenance-free (no layout writes these keys), so there
is no freeze trap; explicit exit/entry pin honoring
(`respectConnectionConstraints`) remains a separate, unwired opt-in. All four
keys live in the Format panel property grid (Editor.js
commonVertex/EdgeProperties, incl. the combined `northsouth`/`eastwest` values
the shape libraries use). Locked by verify-bridge-port-masks.mjs.

## User fixed anchors survive ELK runs (July 2026)

Connecting an edge end to a fixed connection point goes through
`mxGraph.setConnectionConstraint`, which ALWAYS writes `exitDx`/`exitDy`
(`entryDx`/`entryDy`) alongside the fraction — even as 0 — while the ELK
applier's stamped pins are bare `exitX`/`exitY`. The Dx key is therefore
reliable provenance for "the user chose this exact spot"
(`ElkAdapter._anchoredPoint`): anchored ends become FIXED_POS constraint ports
(fraction × size + dx/dy, `_ensureConstraintPort`; FIXED_POS wins over a mask
port's FIXED_SIDE on the same node) so ELK routes to the anchor, and every
strip/stamp path (the applier's blanket strip via `anchoredEnds`, the pin
writers via the `srcNoPin`/`tgtNoPin` union, and ElkLayout's restyle pass via
an `exitDx`/`entryDx` style probe) leaves the end's style VERBATIM. An
explicit anchor beats the terminal's port-constraint mask (same precedence as
the renderer). libavoid needed nothing — `LibavoidRouting.fixedConstraint`
already reads `exitX`/`entryX` into directed ShapeConnectionPins; ELK just had
to stop clobbering them. Reconnecting an end floating clears all five keys and
un-anchors it. In files whose layouts ran before this landed, the Dx fossil
survived while the fraction was re-stamped — those ends freeze at the stamped
(approximately-user) position; connects made since keep exact values.

A node carrying a FIXED_POS port (anchor constraint port or real port cell)
fixes EVERY port position on itself, and ELK's layered importer parks
port-less edge ends on such a node at a default (0,0) corner port — so a
convert() post-pass (`ElkAdapter._portFixedPosFreeEnds`) gives every port-less
end an explicit flow-side port instead: sources with the flow, targets against
it, ends sharing a side spread in the CROSS-AXIS ORDER OF THEIR OTHER TERMINAL
(`_endCrossCoord`, current model centers — FIXED_POS ports are exempt from
crossing minimization, so a model-order spread forced fan-out edges to cross).
The ends stay unmarked: pins stamp from the routed endpoints like any free
end, so re-runs re-derive and converge. Locked by
verify-bridge-anchored-pins.mjs.

## snapToPoint in ELK runs (July 2026)

A pinnable end whose terminal (or edge) carries `snapToPoint=1` gets its pin
stamped AT one of the terminal's declared connection points — the renderer's
snapToPoint contract (`updateFloatingTerminalPoint`), which an arbitrary
side-fraction pin used to override. The applier moves the route endpoint onto
the nearest declared anchor IN PLACE before any fraction math
(`ElkApplier._snapEndpointToAnchor` → per-run-cached `_terminalAnchors`:
`graph.getAllConnectionConstraints` on the view state when one exists, else
the style `points` JSON — drawio's own resolution order), so every pin writer
stamps the anchor fractions and the existing geometry repairs
(align/Z/L-bend) straighten the approach. Snapped ends skip the writers'
neighbor cross-axis realignment and the perpendicular-perimeter projection
(both would slide the pin off the anchor); anchored and climbed ends are
exempt (user anchors verbatim, a climbed end has no meaningful frame), while
MASKED ends snap and pin like free ends — the renderer's snap branch precedes
mask enforcement, so floating them left the route at the mask port's position
while the render snapped to an anchor (angled final segment). On zero-bend
routes the synthesized Z's corners are spliced into the polyline so the pin
writers' neighbor is the Z corner, not the far endpoint; a jetty stub tip's
collinear run is re-aligned onto the anchor row (`_appendAnchorPoint` — ELK
routes to the 1×1 port's CENTER, a half-pixel slant otherwise). Deterministic,
so converged re-runs stay empty edits. Locked by
verify-bridge-snap-points.mjs.

## jettySize at anchored and masked ends in ELK runs (July 2026)

An anchored end honors the edge's
`jettySize`/`sourceJettySize`/`targetJettySize` — the same resolution as
`mxEdgeStyle.getJettySize`/`LibavoidRouting.jettyFor` (per-end key >
`jettySize` > orthBuffer default 10, `'auto'` from the end's arrow size) — as
a minimum first/last segment. The adapter puts the FIXED_POS constraint port
at the STUB TIP via `elk.port.borderOffset`
(`ElkAdapter._jettyStubFor`/`_ensureConstraintPort`) — NOT by offsetting the
port coordinate, which the node-size port placement recomputes from
borderOffset (or flush to the border) even under FIXED_POS
(`PortPlacementCalculator`); node margins then reserve the stub room, so ELK
plans spacing WITH the stub. The applier re-attaches the anchor by appending
it to the polyline (adapter `getJettyEnds` → applier `jettyEnds` →
`_appendAnchorPoint`, anchor read from the end's own verbatim pins), so the
tip becomes a waypoint — usually collinear and simplified away, but a route
that turns at the tip keeps its bend there instead of cutting the corner down
to the anchor. Guards mirror libavoid's jettyStub: ORTHOGONAL runs only, no
stub for corner/interior anchors (no single outward normal), and same-parent
anchors closer than the summed stubs skip both (OrthConnector's too-short
rule). A MASKED end honors an EXPLICITLY styled jettySize the same way — the
FIXED_SIDE mask port carries the borderOffset stub (`ElkAdapter._maskJettyFor`
→ `_createMaskPort`), so the rendered floating approach (last bend →
perimeter) comes out at least jettySize long. Explicit-only, unlike anchored
ends: a masked end floats and already takes its natural lead-in from ELK's
channel spacing, so the orthBuffer default would only shift every existing
masked route outward for no visible gain. No applier work: the tip is the
dropped route endpoint, collinear with the final approach, and ELK's
margin-derived layer/channel spacing keeps facing stubs apart (the layout
makes room — no libavoid-style too-short cap). Free/climbed ends are untouched
(their lead-outs come from ELK's channel spacing). Locked by
verify-bridge-jetty.mjs.

## Containers as ELK layout children (July 2026)

The adapter treats a child vertex whose style carries its own `childLayout` as
an atomic LEAF — its layout owns the interior; recursing had the outer run and
the inner manager layout rewriting the same cells (never converges; also
scrambled `tableLayout` rows). The gate is mirrored in
`_applyEdgeStyleRecursive` (the outer restyle pass must not reset interior
edge routing the inner layout wrote) and edge ends into a leaf's descendants
climb to the container via `_resolveEdgeTerminal` like collapsed groups —
climbed ends are recorded (`ElkAdapter.getClimbedEnds` → applier `climbedEnds`
option) and never get exit/entry pins (a fraction computed against the model
terminal's frame from a container-border endpoint clamps to garbage corners;
they float instead).

Shape constituents ride with their parent (`ElkAdapter._isShapePart`):
relative-geometry children (the UML component's docked module icon — its 20×20
size trips the port size heuristic) and `part=1` members are never converted
as nodes and never count toward compound-ness (neither directly nor via
`_subtreeHasEdge` — an edge connected to a part must not get the composite's
interior re-arranged), and a docked child becomes an ELK port only when it is
a real connection point (not `part=1`, and `_hasLayoutableEdge`: at least one
VISIBLE, cellFilter-passing edge — a hidden-layer edge must not keep a port
emitted). Emitted ports are `FIXED_POS` routing hints at their authored
position and are NEVER written back (`_applyPorts` was deleted; connected
constituents are fixed shape features too) — previously `FIXED_SIDE` placement
redistributed them and the write-back rewrote the authored fraction/offset on
every run. Two carve-outs: a `part=1` cell whose parent is a LAYER (pasted
directly on the canvas) stays a normal node (no shape to ride with, and the
layout root is no climb terminus — its edges would silently drop), and when a
compound with real structure also carries non-relative `part=1` constituents,
the applier floors its size writes to `shapePartExtent` so ELK's
content-derived frame can never shrink out from under an authored corner badge
(ELK's `elk.nodeSize.minimum` is ignored for hierarchical nodes, so the floor
lives in the applier, not the input).

transparentBounds groups work as layout children: their ELK input box is the
model-derived visible box (`transparentBounds()` in the bridge's
ElkApplier.js, mirroring `Graph.getTransparentBounds` — model-only, so
headless-safe and correct mid-edit where the view state lags), a transparent
LEAF's children are translated so the derived box lands at ELK's assigned
position (the pinned (0,0,0,0) geometry is never written; `shiftContent`
recurses nested transparents; the layered isolated-node placement and its
shift-down pass do the same), children of a transparent COMPOUND are re-based
to the derived-box origin in the ELK input (parent-relative frames), and a
transparent compound's `elk.padding` mirrors the rendered-box derivation
exactly (its `groupPadding` style + swimlane startSize with the 40
DEFAULT_STARTSIZE fallback, defaults 0 — never the run option or the generic
defaults, or the reserved frame and the rendered box diverge). For the same
parity reason transparentBounds cells never emit LABELS into ELK (the label
paints inside the derived box without enlarging it; a reserved title inset /
label minimum would be phantom padding).

Compound padding generally (`ElkAdapter._getGroupPadding`): base = cell
`groupPadding` style > run option `groupPadding` (number or CSS TRBL string;
"Group Padding" field in every ELK layout dialog, bare config key via
`Graph.elkConfigToOptions`/`elkOptionsToConfig`, documented in drawusaurus
json-layout-specification.md) > defaults (top 20 for label room, 10 elsewhere;
titled cells use 10 on the title side too), and a swimlane/container=1
title-bar startSize is ADDED on the title side — children used to sit flush
under the title. Because style beats option and transparent containers render
from the style, a layout run diverted to a selected container
(`EditorUi.setContainerChildLayout`) mirrors the config's `groupPadding` into
the container's style (and the ELK dialog seeds its field from that style),
otherwise the dialog value would be inert for the very container being tuned.
