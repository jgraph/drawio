# diagramly — draw.io application layer

draw.io-specific code on top of grapheditor (which it extends/overrides;
grapheditor and mxgraph must never reference diagramly).

**Key files**: `App.js` (main app, extends EditorUi), `Editor.js` /
`EditorUi.js` (app-level extensions of the grapheditor classes), `Init.js`
(config globals), `DrawioFile.js` (file abstraction), `Pages.js` (multi-page),
`DiffSync.js` (collab diff/patch), `Menus.js`, `Settings.js` (mxSettings),
`Extensions.js` (Lucidchart/VSDX/Gliffy import), `GraphViewer.js` (read-only
viewer), `Minimal.js` (sketch theme), `Simple.js` (simple toolbar), `Trees.js`
(tree containers), `ElkLayout.js` (ELK editor statics), `LibavoidRouting.js`
(libavoid editor binding).

**Cloud storage**: per provider `*Client.js` / `*File.js` / `*Library.js` —
Drive, Dropbox, OneDrive, GitHub, GitLab (extends GitHub), Trello.
`sidebar/` holds the 60+ shape palettes (see `sidebar/CLAUDE.md`), `vsdx/`
the Visio codec (see `vsdx/CLAUDE.md`).

## Read the matching guide first (repo root)

| Working on | Guide |
|---|---|
| Layouts, childLayout containers, ELK dialogs, layout specs | `docs/claude/layouts.md` |
| Orthogonal Routing / libavoid (`LibavoidRouting.js`) | `docs/claude/libavoid-routing.md` |
| elk/mermaid/libavoid bundles, load order | `docs/claude/native-bundles.md` |
| Mermaid insert/edit/image cells | `docs/claude/mermaid.md` |
| Animations, custom-link actions (`AnimationDialog`) | `docs/claude/animations.md` |
| Checksum errors, DiffSync | `docs/claude/collab-checksum.md` |
| Export/print dialogs | `docs/claude/export-dialogs.md` + `docs/dialog-style-guide.md` |
| Release channels (`checkReleaseChannel`, `?channel=`, SW registration) | `docs/claude/release-channels.md` |

## Hard invariants (details in the guides)

- **Mermaid gating**: every mermaid entry point gates on
  `EditorUi.isMermaidSupported()` — never a bare `isMermaidEnabled` or
  `typeof mxMermaidToDrawio` check.
- **libavoid gating**: routing UI entry points gate on
  `typeof LibavoidRouting !== 'undefined'` — there is no `isSupported()`/CSP
  probe.
- **childLayout JSON specs are URL-encoded in styles**: write via
  `Graph.encodeChildLayout`, read via `Graph.decodeChildLayout` — never
  concatenate raw JSON into a `key=value;` style.
- **Layout convergence**: a converged (unchanged) layout result must produce
  an EMPTY model edit, or the layout manager loops the app
  (see `docs/claude/layouts.md` §Convergence contract).
- **Routing tuning** belongs in the canonical core
  `js/libavoid-js/libavoid-routing.js`, not in `LibavoidRouting.js`
  (editor binding only).
- **Release channel = the SW registration URL** (`service-worker.js` vs
  `stable/service-worker.js`); channel state in localStorage
  `.drawio-channel` holds LITERALS only, and the SW cache-key derivation
  must never change (installed-cache adoption) — see
  `docs/claude/release-channels.md` before touching App.main's
  registration block, `checkReleaseChannel` or `GenerateServiceWorker`.
