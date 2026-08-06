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
`{data, config}` with the resolved config), `parseMermaidImage` (parse +
build; new images use the configured default config — see the config model
below), and `updateMermaidImage` (re-render a cell in place).

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
but can be switched via the dialog's Diagram/Image dropdown. A type change
calls `EditorUi.replaceMermaidCell`, which imports the other representation
(`createMermaidImageXml` or `mxMermaidToDrawio.wrapGroup`) at the old cell's
position and removes the old cell — landing in the current layer, like the
Insert path; same-type edits update in place (image → `updateMermaidImage`,
diagram → `replaceLockedGroupChildren`), preserving the `border`.

## Config model — self-describing cells + the `mermaid` config key

The default parse config is `EditorUi.defaultMermaidConfig` (empty by default,
set as a whole by the `mermaid` **config key** in `Editor.configure`), so a
deployment can enforce one Mermaid look (`theme`, `themeVariables`, …).
`getMermaidConfig(data, config)` uses `config` when non-null, else clones
`defaultMermaidConfig`, then **always** re-stamps the security keys
(`securityLevel:'strict'`, `startOnLoad:false`, `maxTextSize`) — an admin
config can never weaken those.

**When no config is set, nothing changes** — this is a hard requirement.
`EditorUi.getInsertMermaidConfig()` returns `null` unless
`EditorUi.isMermaidConfigured()` (a non-empty `defaultMermaidConfig`), so an
unconfigured deployment stores `config:null` in new cells and parses with a null
config exactly as it did before the config key existed (diagrams still render
the parser's own default theme, images still use `legacyMermaidConfig`). The new
self-describing behaviour only switches on once a `mermaid` config is set.

**When a config is set, new diagrams store the resolved config** they were
created with (`{data, config}` in `mermaidData`, via `getInsertMermaidConfig()`
at each insert site). This makes diagrams **self-describing**: on re-edit they
re-parse with their *own* stored config, so a diagram made under one deployment's
config renders identically when edited under another — it does not adopt the
local default. The config is cloned for the parse (getMermaidConfig mutates that
clone with the security keys), so the stored copy stays clean.

**New images** follow the same `isMermaidConfigured()` gate (`parseMermaidImage`).
Configured → the image stores the resolved config, self-describing like a
diagram. Unconfigured → it parses with `legacyMermaidConfig` and stores a
**null** config, exactly like a legacy image, keeping the previous image look
(neutral theme + sequence/gantt tuning). So an unconfigured diagram and image of
the same source still differ (parser default vs neutral) — the pre-existing
behaviour, unchanged.

`editMermaidData` resolves the config as: **legacy image** (an image cell whose
stored config is `null`) re-edited *as an image* keeps `legacyMermaidConfig` and
the `null` contract; **every other case** reuses `obj.config`, or
`getInsertMermaidConfig()` when it is `null` (an old `null` diagram, or a legacy
image converted to a diagram) — which is itself `null` when unconfigured, so such
a cell stays `null`. Here **legacy image** means any image with a `null` stored
config — both pre-existing image cells and new images inserted while unconfigured,
so they share one code path. `refreshMermaidImage` (the padding re-render) parses
with the cell's stored config (falling back to `legacyMermaidConfig` when it is
`null`) and writes the config back **unchanged** — it must never wipe a
self-describing image's config.
