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
own `visible` (`getLayerCells`). `descendants: true` (Sept 2026) adds every
descendant of the resolved cells in `getCellsForAction`, looked up at
execution time, so an effect on a group or container reaches its contents
and follows children added later; without it only the listed cells are
affected (a bare group has no visible shape, so a fade on it shows nothing —
Kym, 2026-08-28). Gaudenz chose the explicit flag over expanding groups
implicitly, which would have made a frame-only fade impossible. Dialog: a
"Descendants" toggle in the Cells chip menu (reuses the `descendants`
resource), the chip shows "+ Descendants" while on; the preview snapshot
covers the descendants since it resolves through the same call. Multiple
keys in one step run in parallel; consecutive steps are sequential unless
`immediate:true`.

`cells`, `tags` and `layers` resolve as a UNION, so a step can target all
three. In the dialog they read as alternative modes, though: a new step is
seeded with the canvas selection, and picking layers or tags right after
that is meant to CHANGE the target, not grow it (Kym, 2026-09-18). The
dialog therefore tracks the selector objects whose `cells` came from that
seed (`seededSelectors`, a WeakSet keyed on the selector object) and drops
the seeded list when the layer or tag picker commits a non-empty
selection. Any explicit edit of the cells chip clears the mark, so a list
the user picked themselves is never taken away and unions stay buildable
(cells first, then layers). The chip menu's clear-the-target item is
labelled `none` ("None", the counterpart of "All cells") — `reset`
suggested restoring a default and "Remove" next to "All cells" reads as
deleting the shapes.

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
they're one-shot user triggers. Checking **Disabled** dims the step list and
the raw textarea (`geAnimationDisabledArea`) and disables Loop, so an
animation that won't autoplay can't be mistaken for one that will — the lone
checkbox was too easy to overlook (Kym, 2026-09-18). The steps stay editable
and previewable on purpose: that is what the off-switch is for, so do not
turn the dimming into `pointer-events:none`.

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
  (`toggleCellStylesTransient` ↔ `toggleCellStyleValues`).

**`toggleStyle` value semantics** (`Graph.nextToggleStyleValue`, Sept 2026):
with `value` the key flips between `value` and `defaultValue` — no default
REMOVES the key so the stylesheet default applies (`strokeWidth 10` toggles
10 ↔ 1, `fontStyle 2` italic ↔ plain). Without `value` it is the legacy
boolean toggle ('0' ↔ '1'; `defaultValue` is what a missing key counts as),
now with the string `'0'` counted as off — the old `truthy ? 0 : 1` test
made a toggle on a missing key write 0 forever. The dialog shows Key /
Value / Default value; the model path keeps mxGraph's first-cell-decides
rule, the transient path toggles per cell.

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

**Saving an empty action removes the link**: with no steps left the adapter
calls `onSave('')` instead of writing `{"actions":[]}`, and every
`showLinkDialog` callback reads the empty string as "remove the link"
(`setLinkForCell(cell, null)` / `insertLink('')` / anchor unwrap). Before,
deleting the last action left a dead link, its title and the link
decoration on the cell (Kym, 2026-09-18).

**Attaching one action to several cells** (Sept 2026, grapheditor):
`editLink` resolves `getEditableCells(getSelectionCells())` when it opens
and writes to all of them in one undo step; `updateActionStates` enables it
for `cells.length > 0`. The cells are captured at open time, NOT read back
in the save callback — the action editor is non-modal so the canvas
selection has usually moved on to the action's target cells by the time it
saves. The field is prefilled only when every selected cell carries the
same link. To copy a link to other shapes, use Copy/Paste Data,
which carries `link` and `linkTarget` along with the other attributes.

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
`cell.style`). The style helpers repaint through `redrawTransientStyle`
(resetStyles + `cellRenderer.configureShape` + redraw, the renderer's own
style-change sequence) — a bare `shape.apply` keeps the previously painted
field value, so a REMOVED key (toggle-off without default, `style` with an
empty value) never took effect visually. The player only hides `show`/`hide`-referenced cells (records
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

**Deleted targets are reported, never pruned** (Sept 2026): the engine
skips IDs that no longer resolve, so a step whose cells were deleted used
to sit in the list reading "4 cells" while doing nothing (tester report,
2026-09-21). The cells and layers chips now count only the entries that
still exist and call out the rest ("2 cells, 3 deleted" / "0 cells, 4
deleted" — `nDeleted`; the tester asked for "deleted" over "missing",
amber `geSelChipWarn`, dead IDs marked `(?)` in the hover
list); a step whose selector resolves to no cell at all through
`getCellsForAction` gets a ⚠ marker behind its label (`stepNoEffect`
tooltip). The dialog re-renders on model changes that add or remove
cells (`mxChildChange` with a null parent/previous) unless a row input
has focus, so the non-modal dialog stays truthful during canvas edits
and undo. Cleanup is explicit — "Remove deleted cells" in the chip menu;
the layer picker drops IDs it cannot list on the next commit — and
nothing touches the stored data on its own: deleting a cell must not
parse every page animation and custom link (cost), and a pruned
reference cannot come back with the cell via undo or paste (Gaudenz,
2026-09-21). Do not turn the marker into auto-removal of the step.

`immediate` toggle per row: ⏩ + "Immediate" (on) / ⏱ + "Wait" (off); each
glyph carries U+FE0E to force monochrome. Hidden on row 0.

**Style-key picker** (Sept 2026): the Key field of Set Style / Toggle Style
(`styleKey: true` in `CustomActionDialog.SCHEMAS`) gets a `<datalist>` of
common keys labelled with the Format panel resources
(`AnimationDialog.STYLE_KEYS`, one datalist per dialog inside the dialog
element so it goes away with it, options rebuilt on language change via
`staticRefreshers`) and a "use selected
cells" icon button that lists the selected cell's raw `key=value` pairs
(`AnimationDialog.getStylePairs`) in a `selectorChips.openMenuPopover`;
picking one writes the key and — when the schema has a `value` field — the
value, then `refresh()` re-renders the row. Replaces the idea of appending
style keys to the Format panel tooltips (many controls map to several keys).

Around that field (Sept 2026, all from Kym's 2026-09-18 pass):

- The placeholder is `enterStyleKey` ("Enter style key…"), not an example
  key — an example reads as a value that is already set. Same reason the
  Value / Default fields lost their `1` / `0` placeholders, and why
  `.geAnimationDialog ::placeholder` is pinned to the faint text color and
  italicized (the browser default was too close to a real value in dark
  mode).
- An empty key marks the field (`geAnimationFieldWarn`): such a step does
  nothing at all and otherwise looked configured.
- On `change` (not per keystroke) a known key typed in the wrong case is
  corrected to its canonical spelling — `AnimationDialog.canonicalStyleKey`
  over a lowercase→canonical map of every `mxConstants.STYLE_*` plus
  `STYLE_KEYS`, built on `Object.create(null)` since it is keyed by typed
  input. mxGraph style keys are case sensitive, so `fillcolor` silently
  painted nothing; that, not `light-dark()`, was why adaptive colors
  appeared broken.
- Fields flagged `colorValue` (Set Style's value, Toggle Style's value and
  default value) get a swatch whenever the step's key names a color
  (`AnimationDialog.isColorStyleKey`, decided by the `/colou?r$/` name —
  the per-shape property tables only type the few custom color props).
  It opens `editorUi.pickColor`, whose dark-color field writes
  `light-dark(light,dark)`, and previews through the file's
  `getAdaptiveColors()` mode ('auto' inverts a plain color for dark mode,
  'simple' keeps it, 'none' pins the diagram to the light color). An
  explicit pair paints as a diagonal split (`cssText` / the inverted pair,
  like the Format panel swatches) so both colors show in either theme.
  **Both parts are validated as colors through the CSSOM first** (`asColor`
  assigns to a probe's `color`): the value comes from the diagram, and an
  unchecked string in the `background` shorthand could close the gradient
  and add a fetched `url()` layer. `mxUtils.isLightDarkColor` is only a
  prefix test, so a value reaching it is not guaranteed to have passed the
  strict `lightDarkColorRegex`.

**One action editor at a time**: `LinkDialog.editCustomAction` keeps a single
`editorUi.actionWindow`. Edit… for the SAME cells (the LinkDialog's
`graph.getSelectionCells()` at click time, compared by identity) refocuses it;
for other cells it calls the dialog's `requestClose(onClosed)` — the Cancel
button's discard prompt when dirty, nothing happens if the user keeps the
open editor — and opens a fresh one bound to the new cells. Before, the
reuse guard silently refocused the window bound to the OTHER cell's save
callback (Kym, 2026-08-28), so edits would have saved onto the wrong cell.

**Preview cleanup (`endPreviewSession`)** — order matters: (1)
`previewSession.restoreOpacity()` (undoes opacity-only effects:
`opacity`/`fadeIn`/`fadeOut`/`fadeTo`/`show`/`hide`); (2)
`toggleFlowAnimation(...,'stop')` on referenced edges (strips `mxEdgeFlow`);
(3) `graph.refresh()` (re-validates from `cell.style`, wiping transient
`style`/`toggleStyle`/`toggle`/`show`/`hide` mutations). Opacity restore is
first because the SVG group's inline `style.opacity` survives
`shape.clear()`. Page-switch and chromeless replay re-render from scratch and
skip this. `startPreviewSession` snapshots on EVERY preview (the session
player keeps the live `data`, and `snapshotOpacity` only adds nodes not yet
recorded, keeping the first value) — before, only the cells referenced at
the session's first preview were recorded, so a Set Opacity step added or
retargeted later left its cell faded after Reset/close with nothing in the
editor able to clear an inline node opacity (Kym, 2026-09-02). Transient
effects otherwise stay until another action changes them — by design, no
model edit resets them. The **Preview button** seeds `player.snapshot = []`
so the player's restore-on-done is a no-op and the canvas stays at the final
state until Reset — `play()` therefore only snapshots when `snapshot ==
null` (the loop restore nulls it, so a looping lightbox player still
snapshots per pass). Before that guard the loop snapshotted unconditionally
and undid every opacity effect (a `toggle` on the edited cell) the moment
the last step finished, while transient style steps stayed visible
(Gaudenz, 2026-09-16).

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
- `grapheditor/Actions.js` — `editLink` (whole selection); enable state in
  `grapheditor/EditorUi.js` (`updateActionStates`)
- `resources/dia.txt` — UI strings (translations in `resources/dia_*.txt`)
- `plugins/animation.js` — back-compat Extras entry + inline `animation`
  resource key
