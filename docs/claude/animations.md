# Step-based animations & custom-link actions

Each page can carry a step-based animation as the `animation` attribute on the
model root. The same step format powers the `{animation:{steps:[...]}}`
custom-link action attachable to any cell (`data:action/json,...`). Engine +
dialog are core.

**Entry point**: Edit > Page Setup > Lightbox animation > Edit… opens the
non-modal AnimationDialog (non-modal so cells stay pickable in the canvas
while editing). The legacy **Extras > Animation** entry and `?p=anim` URLs are
surfaced only by `plugins/animation.js` (which also registers the `animation`
resource key inline, since core no longer ships it).

**Chromeless autoplay**: in lightbox/embed mode `EditorUi.prototype.init`
plays on file load and restarts on page switch (`mxEvent.ROOT`). `?animate=0`
opts out. *Deferred first step — do NOT remove*: `playAnimationOnGraph`
defaults `defer: true` so `AnimationPlayer.play` runs the first `iter()` via
`setTimeout(…,0)`; otherwise a leading `viewbox`/`scroll` step is clobbered by
the lightbox's initial fit (`lightboxFit`/`chromelessResize`), which runs
synchronously just after `mxEvent.ROOT` inside `fileLoaded`. `iter()` guards
on `cancelled` so a `stop()` before the tick is safe. The dialog preview calls
`play()` *without* `defer` (no initial fit to clobber it) — do not make
`defer` unconditional.

## JSON format

A `{steps:[...]}` object. Each step is a regular custom-link action targeting
cells via `cells`/`tags`/`layers`/`excludeCells` selectors (incl. `"*"`
wildcard). `layers` holds layer cell IDs; all descendants resolve in via
`getCellsForLayers`, so later-added cells are picked up. Exception: visibility
actions (`toggle`/`show`/`hide`) with `transient:false` flip the layer cell's
own `visible` (`getLayerCells`). Multiple keys in one step run in parallel;
consecutive steps are sequential unless `immediate:true`.

```json
{"animation": {"loop": false, "steps": [
  {"opacity": {"cells": ["*"], "value": 0}},
  {"fadeIn":  {"cells": ["cellA"], "delay": 400}},
  {"fadeIn":  {"cells": ["cellB"], "delay": 400}, "immediate": true},
  {"wait": 200},
  {"fadeTo":  {"cells": ["cellC"], "value": 0.5, "delay": 400}},
  {"flow":    {"cells": ["edgeA"], "start": true}}
]}}
```

**Action keys** (every `CustomActionDialog.SCHEMAS` type; picker groups them
Visibility/Effects/Style/Navigation/Tags/Timing): `toggle`, `show`, `hide`,
`select`, `wait`, `opacity`, `fadeIn`, `fadeOut`, `fadeTo`, `wipeIn`,
`wipeOut`, `popIn`, `popOut`, `flow`, `style`, `toggleStyle`, `highlight`,
`scroll`, `viewbox`, `open`, `tags`. `fadeIn`/`fadeOut` are hardcoded 0→1 /
1→0; `fadeTo` animates from current opacity to `value`. Picker defaults come
from each field's `def`; `viewbox` with an empty canvas selection pre-fills
the current viewport (one-click snapshot, static x/y/w/h — the picker
deliberately skips the `"*"` wildcard fallback), with cells selected it
becomes a dynamic cell-bound viewbox instead (see below).

**`loop` / `enabled` (page mode only)**: booleans, default `true`.
`enabled:false` makes `playAnimationOnGraph` return `null` (script kept, no
autoplay). Both are persisted only when `false` (default implicit, keeps XML
minimal). Dialog header has **Loop** and **Disabled** (= inverse of `enabled`,
reuses the `disabled` resource) checkboxes. Custom-link actions have neither —
they're one-shot user triggers.

## Transient — context-dependent default, `transient` flag overrides

Cell-affecting actions can run two ways: **transient** (paint the current
viewer's DOM only — not in undo, not synced, not saved; `graph.refresh()`
reverts them) or **model-mutating** (the legacy path that flips `cell.visible`
/ cell style). The default depends on *who fired the action*
(`isTransient`/`defaultTransient` in `executeCustomActions`, keyed on whether
`cell` is non-null):

- **Animation steps** and the **dialog preview** (`cell == null`): **transient
  by default** — so playback never touches the saved diagram / collaborators /
  undo.
- **Custom-link clicks** (`cell != null`, a user clicking a cell link):
  **model-mutating by default** — the long-standing interactive-diagram
  contract. A transient opacity toggle *cannot reveal a model-hidden cell*
  (`visible="0"` cells have no state/DOM node, so `getNodesForCells` → `[]`
  and the action silently no-ops); these diagrams rely on flipping
  `cell.visible`. **Regression history**: making these transient-by-default
  (30.0.4) broke every "click-to-reveal hidden layer/group" diagram — restored
  by the per-context default.

Either default is overridden per action with an explicit
`transient: true|false` (NOT surfaced in the picker):
`{"show":{"cells":["A"],"transient":false}}`.

- **Always transient** (view-only, no model path either way): `opacity`
  (`setOpacityForNodes`), `fadeIn`/`fadeOut`/`fadeTo`
  (`fadeNodes`/`setTransitionForNodes`), `wipeIn`/`wipeOut`
  (`createWipeAnimations`), `popIn`/`popOut` (`createPopAnimations`), `flow`
  (`toggleFlowAnimation` adds/removes the `mxEdgeFlow` CSS class — NOT the
  persistent `flowAnimation` style attr), `highlight`, `select`, `scroll`,
  `viewbox`, `open`, `tags` (`graph.hiddenTags`), `wait`.
- **Has both paths** (transient ↔ model, default per the rule above): `toggle`
  (`toggleCellsTransient` flips SVG opacity ↔ `toggleCells` flips
  `cell.visible`), `show`/`hide` (`setOpacityForNodes` ↔ + `setCellsVisible`),
  `style` (`setCellStylesTransient` ↔ `setCellStyles`), `toggleStyle`
  (`toggleCellStylesTransient` ↔ `toggleCellStyles`).

`scroll`/`viewbox` with `smooth:true` are the only viewport actions that
**block the chain** (~600 ms): the dispatcher bumps `waitCounter` and resumes
via `waitAndExecute` after the transition; teardown
(`stoppingCustomActions`) skips smooth for an instant snap. The CSS-transform
transition is armed for a single transform change only
(`Graph.applyTransformTransition` sets `armTransformTransition`,
`updateCssTransform` consumes it and strips `transition` from all other
transform updates) so toolbar/wheel/programmatic zoom still snaps instantly.
`scroll` centers by default; optional `border` (screen px) brings the cell
into view with minimal scroll (`scrollCellToVisible*`). `scroll` pans only
(never changes zoom) and targets `cells[0]`; `viewbox` sets pan + zoom.

**Dynamic viewbox** [jgraph/drawio#4584]: a `viewbox` with a
`cells`/`tags`/`layers` selector ignores static x/y/w/h and fits the union
of the resolved cells' bounds at execution time (`getBoundingBox`,
normalized to graph coords — screen coords in the editor, graph coords in
`useCssTransforms` mode, same as `fitDiagramToWindow`; uncapped scale like
Ctrl+Shift+H fit-selection). An unresolvable selector (hidden cells have no
state) skips the action, like `scroll`. Dynamic `border` is breathing room
**per side** (screen px, like scroll's border): the fit paths reserve the
border once per axis (`clientWidth - border`, → border/2 per side, swallowed
by the 0.05 scale quantization), so the executor doubles it — static viewbox
border keeps the old weak semantics for compat. Dialog: selector chips gray
out the `staticOnly` x/y/w/h fields; "Use Current" converts back to static
by capturing the viewport AND clearing the selector.

## `immediate` — parallel steps

`immediate:true` (step root, peer to action keys) runs the step in the same
dispatcher iteration as the previous one. The batch shares one `waitCounter`;
the chain advances when every blocking effect in it finishes. `stop()`
short-circuits batching. **Critical**: dispatch the whole immediate batch in
one `executeCustomActions` call — `AnimationPlayer.runStep` slices
`steps.slice(idx,endIdx)`; passing one step at a time makes the
`actions[i].immediate` check never fire and the chain silently runs
sequentially. `actions[0].immediate` is a no-op. Persisted only when `true`.
Preview highlights the whole active batch via a `playingSteps` Set and
`opts.onStep(start,end)` (exclusive `end`).

## Legacy text format (back-compat)

Newline-separated script (`show CELL fade`, `wait 1000`, …).
`Editor.parseAnimationData` sniffs `{` vs text; `Editor.convertLegacyAnimation`
converts (uses `parseAnimationScript`). Conversion prepends
`{opacity:{cells:["*"],value:0}}` (legacy implicit hide-initial) and merges
consecutive non-`wait` lines into one step (legacy fired them overlapping; the
new dispatcher awaits each step) — `wait` stays its own step; does NOT emit
`immediate`. Grammar:

```
show CELL [fade|pop|wipe] [DUR]   reveal (default wipe)
hide CELL [DUR]                   fade out
flow CELL [start|stop]            toggle edge flow
wait MS                           pause
setOpacity CELL VALUE [DUR]       transition opacity to VALUE (0–1)
```

`CELL` = cell id or `*` (legacy `all` still works unless a cell is named
"all"). Default durations: fades/setOpacity `Editor.animationFadeDelay`
(400 ms), wipe/pop ~900 ms.

**Optional initial hiding**: the player blanks every cell referenced by
`show`/`hide` before step 0 (so fades/wipes are visible) — default, matches
legacy. Opt out via the **Hide cells initially** checkbox →
`animationHideInitial='0'` on the model root (default implicit).

## Custom-link actions

A cell link `data:action/json,{"actions":[...]}` may contain
`{"animation":{"steps":[...]}}`; `Graph.flattenAnimationActions` inlines it so
each step runs through `executeCustomActions` with parallel/sequential
semantics intact. The Edit Link dialog's "Action" radio → Edit… closes the
modal LinkDialog and opens the non-modal `CustomActionDialog` (cells must stay
pickable). `CustomActionDialog` is a thin format-adapter over
`AnimationDialog` (`kind:'action'`, `showTitle:true`, save serializes back to
the link format); all UI lives in AnimationDialog.
`CustomActionDialog.SCHEMAS` defines each action's metadata (icon, label,
fields, selector flag, `allowLayers`).

## Engine — `Editor.AnimationPlayer` (diagramly/Editor.js)

`parseAnimationData(value)` → normalized `{steps}`;
`convertLegacyAnimation(text)`; `parseAnimationScript(text)` (legacy parser);
`Graph.flattenAnimationActions(actions)`; `new Editor.AnimationPlayer(graph,
data)` (string or parsed); `.play({loop,done})` (delegates to
`graph.executeCustomActions`, snapshots DOM opacity); `.stop()` (sets
`graph.stoppingCustomActions`, restores opacity).
`Editor.playAnimationOnGraph(graph, opts)` reads the root script (null if
none). `Editor.toggleFlowAnimation(graph, edges, status)` toggles the
`mxEdgeFlow` class; CSS keyframes installed once via
`Editor.installAnimationStyles()`.

Path selection for the persistent `flowAnimation=1` paint hook, its SVG-export
twin (`getSvg`'s drawCellState wrapper) AND `toggleFlowAnimation` is
`mxShape.getFlowAnimationPath` (grapheditor/Graph.js), which makes flow
animation work on `sketch=1` edges (July 2026). Its walk: hidden tolerance
clones seed the expected line `d` (the rough.js stroke only matches its OWN
clone, never the plain hit path's d); `stroke=none` event paths (the sketch
double paint's invisible plain-geometry pass) are skipped and CLEAR the
tracked d when they consume their own clone — required because the sketch
paint bypasses addTolerance for FILLED shapes, so their rough stroke arrives
clone-less; rough hachure fill paths are skipped via the `data-rough-fill` tag
stamped in `Editor.createRoughCanvas`'s fillSketch (they are stroked in the
fill color and would win the walk); and the first counted match LOCKS the line
d so a marker's tolerance clone cannot re-seed an indexed walk (`PipeShape`
uses `index=2` for the inner stroke, falling back to the casing for hollow
pipes). Do not reintroduce index-based `paths[1]` selection (the pre-fix
toggleFlowAnimation bug).

Transient helpers on `Graph.prototype` (Editor.js): `toggleCellsTransient`,
`setCellStylesTransient`, `toggleCellStylesTransient` — all reverted by
`graph.refresh()` (next `view.validate()` re-reads `state.style` from
`cell.style`). The player only hides `show`/`hide`-referenced cells (records
original opacity, `stop()` restores exactly); the model is never mutated.

## Dialog — `AnimationDialog` (Dialogs.js)

Non-modal floating window; state persisted via
`installWindowPersistence('animation',…)` (CustomActionDialog uses key
`'customAction'`). Two views toggled by **Edit as text**: structured list
(each row: selection checkbox, drag handle ⋮⋮, immediate toggle, action icon,
label, cell name(s), inline opacity/duration, select-cells ⊕, preview ▶ — no
per-row delete; deletion goes through the selection, see below) and raw text
(canonical source of truth — the list re-renders from it on every mutation). A
single "Pick animation…" `<select>` adds steps; opacity/wait inputs feed the
Fade To / Wait picks; cell-targeting picks default to the current selection
else `*`. Re-binds per page on `mxEvent.ROOT` (persisting unsaved edits
first). Dirty state swaps Save/Preview primary styling and prompts on close.
Footer: Reset / Preview / Cancel / Save (Reset disabled until a preview
session is active).

**Step selection operations** ([jgraph/drawio#5672]): row checkboxes select
steps (shift-click = range from the last toggled row); Copy / Paste /
Duplicate / Delete icon buttons sit next to the Add picker, with Ctrl/Cmd+C/V/D
and Delete/Backspace equivalents on non-text targets inside the dialog.
Clipboard = `AnimationDialog.stepsClipboard` static (deep clones; paste clones
again), shared across AnimationDialog/CustomActionDialog instances so
sequences move between pages and cell actions; Copy also mirrors the JSON to
the system clipboard (best effort). Paste inserts after the selected block
(else appends), Duplicate inserts behind the selection; both select the
inserted block. Delete removes the selected steps and clears the selection;
reorder / Delete All / raw-JSON edits / page switch also clear it. JSON parse
errors in the text view resolve V8's "at position N" to a line/column suffix
(`describeJsonError`).

`immediate` toggle per row: ⏩ + "Immediate" (on) / ⏱ + "Wait" (off); each
glyph carries U+FE0E to force monochrome. Hidden on row 0.

**Preview cleanup (`endPreviewSession`)** — order matters: (1)
`previewSession.restoreOpacity()` (undoes opacity-only effects:
`opacity`/`fadeIn`/`fadeOut`/`fadeTo`/`show`/`hide`); (2)
`toggleFlowAnimation(...,'stop')` on referenced edges (strips `mxEdgeFlow`);
(3) `graph.refresh()` (re-validates from `cell.style`, wiping transient
`style`/`toggleStyle`/`toggle`/`show`/`hide` mutations). Opacity restore is
first because the SVG group's inline `style.opacity` survives
`shape.clear()`. Page-switch and chromeless replay re-render from scratch and
skip this.

**Multi-corner resize** (every resizable mxWindow + every modal `Dialog`, in
grapheditor/Editor.js): `installDialogEdgeResizeHandles(container, addHandle)`
adds 7 transparent edge/corner handles (skips bottom-right, owned by caller)
and delegates drag math to a host callback; `Dialog.prototype.addResizeHandler`
and a module-scope wrapper on `mxWindow.prototype.setResizable` wire it up
(the mxWindow callback fires `MOVE_START`/`MOVE_END` first to undock). The
`RESIZE_*` events feed the persistence listeners.

## Naming — two different menu entries

- **View > Flow Animations** (action `'animations'`, key `animations`):
  toggles `Editor.enableAnimations` — global gate for flowing-dash edge
  animation.
- **Extras > Animation…** (action `'animation'`, key `animation`): opens this
  step editor.

## Files

- `diagramly/Editor.js` — engine (AnimationPlayer, parsing, flow toggle,
  opacity recording, CSS install, transient helpers)
- `diagramly/Dialogs.js` — `AnimationDialog`
- `diagramly/Menus.js` — `'animation'` action + Extras entry
- `diagramly/EditorUi.js` — chromeless autostart in `init`
- `grapheditor/Graph.js` — primitives (`createWipeAnimations`,
  `createPopAnimations`, `fadeNodes`, `executeAnimations`)
- `grapheditor/Editor.js` — `PageSetupDialog` "Lightbox animation" entry;
  resize handles
- `resources/dia.txt` — UI strings (translations in `resources/dia_*.txt`)
- `plugins/animation.js` — back-compat Extras entry + inline `animation`
  resource key
