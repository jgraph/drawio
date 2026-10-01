# grapheditor — generic editor layer

Generic diagram editor on top of mxGraph. **No draw.io-specific code here** —
grapheditor must never reference diagramly classes (diagramly extends and
overrides these prototypes; new hooks added here should be override-friendly).

**Key files**: `Editor.js` (editor core, modal `Dialog` framework, dialog
resize handles), `EditorUi.js` (chrome/panel wiring), `Graph.js` (mxGraph
subclass: styles, edge rendering, `initLayoutManager` + async layout
scheduling, custom-action/animation primitives, `getTransparentBounds`,
`normalizeModel`),
`Sidebar.js` (shape palette framework), `Format.js` (format panel),
`Shapes.js` (shape implementations), `Actions.js`, `Menus.js`, `Toolbar.js`,
`Dialogs.js`.

**Direct vertex geometry writes in forward actions** (not via
`moveCells`/`resizeCells`, e.g. `model.setGeometry` in a panel, arrange action
or layout) must run between `graph.beginArrange()` and
`graph.endArrange(arrange)` instead of `beginUpdate`/`endUpdate`: the pair
fires `cellsArranged` (`cells` + `previous` geometries), the forward-gesture
signal that libavoid auto-routing listens to next to CELLS_MOVED/RESIZED.
`EditorUi.executeLayout` already wraps every layout run. The pair also
reports the style writes inside it (`restyled` + `previousStyles`), so a
forward action that writes styles outside the Format panel (Edit Style,
`updateShapes`, Paste Style, Edit Connection Points, Edit Shape, the inline
toolbar arrows, the embed `updates` message, CSV import updates) uses it
too — `styleChanged` there would also feed the sticky default styles
(`updateDefaultStyle`).

Cross-cutting contracts documented in the repo-root guides:

- `docs/claude/layouts.md` — `Graph.createLayouts`,
  `encode`/`decodeChildLayout`, `scheduleAsyncLayout`/`runAsyncLayout`,
  layout-manager convergence contract (a converged layout must produce an
  EMPTY model edit).
- `docs/claude/animations.md` — animation primitives
  (`createWipeAnimations`, `fadeNodes`, `executeAnimations`,
  `mxShape.getFlowAnimationPath` sketch-path selection).
- `docs/claude/libavoid-routing.md` — edge-style picker auto-route gating.
- `docs/dialog-style-guide.md` — dialog look & feel.
