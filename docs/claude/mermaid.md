# Mermaid: native parser, image cells, feature gate

Mermaid support runs entirely on the native port `drawio-mermaid` (sibling
repo, exposes `mxMermaidToDrawio` — see `docs/claude/native-bundles.md`; it
requires drawio-elk loaded first).

## Feature gate — always use the helper

Every mermaid entry point (insert menu/dialog, AI generation, embed
descriptors, double-click edit, headless export, and `parseMermaidDiagram`
itself) gates on the single helper `EditorUi.isMermaidSupported()` =
`window.isMermaidEnabled` (browser has `structuredClone`, which the native
bundle needs) + presence of `mxMermaidToDrawio.parseText`. Checking
`parseText` — not just the `mxMermaidToDrawio` global — matters:
`extensions.min.js` artifacts built before the native-parser switch define a
legacy bridge function of the same name without it, so a bare `typeof` gate
advertises features that then fail on use. **Do not add bare
`isMermaidEnabled` or `typeof mxMermaidToDrawio` gates; call the helper.**
(Non-gates that intentionally stay direct: `loadMermaid`'s am-I-loaded check
and the dead `Editor.mermaidToDrawio` hook.)

## Native-only (upstream bundle removed June 2026)

The legacy upstream bundle `js/mermaid/mermaid.min.js` (~2.7 MB) and its
runtime-fallback plumbing were removed; the native parser is the only path.

`parseText`'s error contract: `null` strictly means "unsupported diagram
type"; a supported diagram that fails to parse/lay out/convert **throws** a
`MermaidConversionError` (real message, original error on `.cause`) — it
never swallows errors into null, so coverage gaps and parser bugs are
distinguishable in telemetry. On either failure `parseMermaidDiagram`
dispatches to `parseErrorHandler`/`error`/`handleError`, which surfaces the
error dialog — but logs via `EditorUi.logError` (error message + diagram-type
keyword, never the diagram source) only when the input's first token is a
recognized mermaid keyword (`EditorUi.mermaidDiagramTypeKeywords`, a
lowercase mirror of the parser's `TYPE_MAP` — keep in sync). An unknown token
means the input wasn't mermaid (e.g. prose pasted into the insert dialog):
logging it would drown telemetry in user input mistakes and leak a fragment
of the pasted text.

Deleted along with the bundle: `generateMermaidImage`, `createMermaidXml`,
`mermaidSvgToDataUri`, `removeMermaidErrors`, `isSupportedMermaidDiagramType`,
the `DRAWIO_NATIVE_MERMAID_ONLY` flag, the `mermaidFallbackHits` counters,
and the `enableParser` parameter of `parseMermaidDiagram` /
`generateOpenAiMermaidDiagram` (parsing is now always on). `loadMermaid`
guards on `typeof mxMermaidToDrawio` and loads only drawio-elk +
drawio-mermaid.

## Mermaid as image (restored static-image output)

Every mermaid-creation path can produce a static **SVG image** cell instead of
an editable diagram group (the legacy image option restored after
[jgraph/drawio#5643](https://github.com/jgraph/drawio/discussions/5643)). The
upstream renderer is gone, so the image is draw.io's own SVG render of the
parsed cells (via `getSvgForXml`), wrapped in a
`shape=image;…;image=<svg-data-uri>` cell that still carries the mermaid
source on `mermaidData` for re-editing.

Shared helpers on `EditorUi.prototype` (diagramly/EditorUi.js):
`getMermaidImageForXml` (parsed XML → `{data,width,height}`, renders via
`getSvgForXml` with a border), `createMermaidImageXml` (→ image cell XML,
mirrors the removed `createMermaidXml`; stores `mermaidData` as
`{data, config:null}` like legacy image cells), `parseMermaidImage` (parse +
build, parses with `EditorUi.legacyMermaidConfig` so images match the previous
default config), and `updateMermaidImage` (re-render a cell in place).

The image padding is the `groupPadding` cell style, stamped on the image
cell — the same key the editable wrapper groups use, so the margin
round-trips across image/diagram switches (`getMermaidImageBorder` resolves
style > legacy stored `mermaidData.border` > the `EditorUi.mermaidImageBorder`
default of 10, which is kept in sync with the wrapper groups' `groupPadding`;
`0` removes it). The diagram→image render uses the wrapper's value, the
image→diagram switch re-applies it to the new wrapper, and a groupPadding
style change on an image cell re-renders it live (`refreshMermaidImage` via a
model BEFORE_UNDO hook in `EditorUi.init` — the endingUpdate latch folds the
re-render into the same undoable edit; legacy `format` PlantUML payloads are
skipped). The legacy `border` field is still read but no longer written.

Entry points:

- **Insert > Mermaid dialog** — restored Diagram/Image `<select>` in
  `ParseDialog` (type `mermaid` vs `mermaidImage`); hidden for embedded
  services (non-draw.io/atlassian) where only Diagram is used.
- **Double-click edit dialog** — the same Diagram/Image `<select>` is exposed
  in `editMermaidData`'s `SimpleTextareaDialog` (via its optional
  `headerControl` param), pre-set to the cell's current type and gated on the
  same service check. Changing it switches the cell's representation (below).
- **Embed descriptor** — `image:true` (peer to `wrap`), EditorUi.js.
- **`create=` hash** — `value.image:true`, `App.executeCreateObject`.
- **Desktop CLI** — `--mermaid-image 1` flag opens a `.mmd`/`.mermaid` file as
  an image. Parsed in the `drawio-desktop` main process (`args.js` →
  `args-obj` message); the renderer reads `argsObj.mermaidImage` in
  `ElectronApp.loadArgs` and threads it through `readGraphFile`.

On double-click edit, a cell **keeps its current representation by default**
but can be switched via the dialog's Diagram/Image dropdown. `editMermaidData`
reads the dropdown (`asImage`) and picks the parse config by the **target**
type — image → `legacyMermaidConfig` (so it matches the previous default
look), diagram → the stored diagram config (null for a cell that was an
image). Same-type edits update in place (image → `updateMermaidImage`, keeping
the stored config null and preserving the `border`; diagram →
`replaceLockedGroupChildren`). A type change calls
`EditorUi.replaceMermaidCell`, which imports the other representation
(`createMermaidImageXml` or `mxMermaidToDrawio.wrapGroup`) at the old cell's
position and removes the old cell — landing in the current layer, like the
Insert path.
