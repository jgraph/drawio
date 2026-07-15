# grapheditor — generic editor layer

Generic diagram editor on top of mxGraph. **No draw.io-specific code here** —
grapheditor must never reference diagramly classes (diagramly extends and
overrides these prototypes; new hooks added here should be override-friendly).

**Key files**: `Editor.js` (editor core, modal `Dialog` framework, dialog
resize handles), `EditorUi.js` (chrome/panel wiring), `Graph.js` (mxGraph
subclass: styles, edge rendering, `initLayoutManager` + async layout
scheduling, custom-action/animation primitives, `getTransparentBounds`),
`Sidebar.js` (shape palette framework), `Format.js` (format panel),
`Shapes.js` (shape implementations), `Actions.js`, `Menus.js`, `Toolbar.js`,
`Dialogs.js`.

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
