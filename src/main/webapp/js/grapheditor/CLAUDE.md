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

**`stencil.desc` may not be DOM.** Bundled stencils from `stencils.min.js`
are light `StencilNode` objects. Readers of `mxStencil.desc` (labelBounds in
`Shapes.js`, stencil colors in `EditorUi.js`, Edit Shape) may only use
`nodeName`, `getAttribute`, `firstChild`/`nextSibling`,
`getElementsByTagName` and `attributes`. In drawio-dev `?dev=1` loads the
XML instead of the bundle, so test with built JS. See `etc/build/CLAUDE.md`.

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

**Collapsed tables** (`tableRender=collapsed` on a `shape=table` cell, the
default for new tables): `TableShape.paintCollapsedTable` paints all fills and
borders of the rows and cells (rules in `Graph.getCollapsedTableBorders`:
the partialRectangle `top`/`left`/`bottom`/`right` flags of rows and cells
are visibility, missing = 1, and 0 on either side of a shared piece (or on
the inside of the outline) hides it; a visible piece takes the most specific
stroke: a cell whose resolved stroke differs from its row's > a row that
differs from the table > the table, then thicker, then top/left). New rows
and cells of collapsed tables have no flags (`getDefaultTableSides`), while
0 in separate tables means "the table paints the grid", so changing
`tableRender` converts the flags (`convertTableSides`, hooked into
`Graph.setCellStyles`). Row and cell shapes keep their resolved colors in
`shape.collapsedTableStyle` and paint only a transparent event area
(`postConfigureShape` override; `resolveColor` resolves `inherit` from the
saved colors). A repainted row or cell schedules a repaint
of its table (`scheduleCollapsedTableRepaint`, flushed in
`validateCellState`). Tables without the key must keep rendering exactly as
before (`paintTableCellLines`, `getTableLines`).

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
