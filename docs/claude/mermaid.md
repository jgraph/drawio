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
error dialog. It also fails a result without any vertex or edge ("Nothing to
draw: …"): the parsers skip statements they do not recognize, so invalid input
converts to an empty model, which the insert dialog would silently drop (losing
the input) and a desktop CLI export would fail on without a reason or write as
an empty file. The check lives here rather than in `parseText`, whose compare
pipeline locks a valid empty diagram (`docs-gantt-7`). (There is no
keyword-gated telemetry logging in `parseMermaidDiagram` — an earlier version
of this note described an `EditorUi.mermaidDiagramTypeKeywords` mirror that
no longer exists.)

Deleted along with the bundle: `generateMermaidImage`, `createMermaidXml`,
`mermaidSvgToDataUri`, `removeMermaidErrors`, `isSupportedMermaidDiagramType`,
the `DRAWIO_NATIVE_MERMAID_ONLY` flag, the `mermaidFallbackHits` counters,
and the `enableParser` parameter of `parseMermaidDiagram` /
`generateOpenAiMermaidDiagram` (parsing is now always on). `loadMermaid`
guards on `typeof mxMermaidToDrawio` and loads only drawio-elk +
drawio-mermaid.

## Swimlane diagrams (`swimlane-beta`)

Mermaid 11.16 swimlanes (`swimlane-beta LR|TB|…`; every top-level
`subgraph` is a lane) parse through the native bundle's flowchart parser
with a dedicated lane-aware layout (`drawio-mermaid/src/swimlaneLayout.js`,
a port of mermaid's node placement). Lanes come back as draw.io `swimlane`
containers — rotated left title strip for LR/RL pools, title band on top
for TB/BT, loose nodes in an unlabelled first lane — with the nodes as
their children, so the result is an editable pool.

The bundle emits the edges UNROUTED (`orthogonalEdgeStyle;rounded=1`, no
waypoints) but with `sourcePortConstraint`/`targetPortConstraint` derived
from the lane geometry (hand-offs leave through the side facing the other
lane and enter along the flow axis, same-lane edges over a sibling loop
over the top; aligned pairs stay unconstrained so they render as straight
lines — see `assignPortSides` in the sibling's swimlaneLayout.js).
Mermaid's own swimlane router is not ported, and a same-lane edge would
cut straight through the nodes between its terminals. So for
`EditorUi.isMermaidSwimlane(data)` sources `parseMermaidDiagram` runs
`EditorUi.applyMermaidSwimlaneRouting` before `success`: decode into an
offscreen `Graph`, `LibavoidRouting.routeCells` over every edge, encode
back (the same shape as `applyMermaidElkPostPass`, but synchronous —
the libavoid bundle initializes on load, see native-bundles.md). It is
gated on `typeof LibavoidRouting !== 'undefined'` like every libavoid
entry point and returns the unrouted XML when libavoid is missing or
throws, so viewers without `extensions.min.js` still get the placed
diagram. drawio-mermaid's compare pipeline (`test/cli/render-drawio.js`)
mirrors the post-pass so its `-new.svg` shows what users see.

## Defaults version — new diagrams follow Mermaid 12, existing ones don't change

Mermaid 12 changed what unconfigured diagrams look like: ELK replaces dagre as
the default layout, and flowchart, class, state, ER, requirement, sequence,
swimlane, venn, use case and agent flow diagrams default to the `redux-color`
theme and `neo` look. Existing cells must keep their look, new ones should get
the new defaults, so the defaults are **versioned** and stored per cell:
`mermaidData` is `{data, config, version}`, where `version` is the Mermaid major
version whose defaults the cell was created with. A cell without `version`
(everything inserted before this existed) keeps Mermaid 11's defaults (dagre,
default theme, classic look) forever, also when it is re-edited.

- The version comes from the bundle: `EditorUi.getInsertMermaidVersion()` =
  `mxMermaidToDrawio.DEFAULTS_VERSION` (`'12'`; null with an older bundle, which
  stores no version). The converter keeps a per-version defaults table
  (`VERSION_DEFAULTS` in drawio-mermaid's `mermaid2drawio.js`) that ranks below
  the host config and the diagram's own config, like Mermaid's own per-type
  defaults rank below `initialize()` and front matter. When Mermaid changes its
  defaults again, the bundle adds a version and new cells pick it up, while
  every stored cell keeps the one it has.
- `parseMermaidDiagram(data, config, success, error, parseErrorHandler,
  version)` passes it to `parseText(text, config, {version})` and to
  `isMermaidElkFlowchart(data, config, version)`, which asks the bundle
  instead of matching the text. Bundles with
  `mxMermaidToDrawio.getElkLayoutOptions` lay ELK diagrams (explicit
  `layout: elk`, the `flowchart-elk` keyword, version 12 defaults) out with
  Mermaid's own ELK options and return `postPass: false`, so
  `applyMermaidElkPostPass` (draw.io's ElkLayout run again) is skipped; it
  takes the bundle's algorithm and options when a bundle asks for it, and
  keeps its fixed layered preset for older bundles.
- **New cells store the insert version**: Insert > Mermaid (diagram and image,
  and its preview), the AI generation paths, `create=` (`value.version`
  overrides it), via `wrapGroup(xml, text, config, {version})` and
  `createMermaidImageXml(..., version)` / `EditorUi.createMermaidData`.
- **Existing cells re-use their stored version** on every path: the edit
  dialog (apply, preview, and switching between diagram and image),
  `replaceLockedGroupChildren(..., version)`, `updateMermaidImage(...,
  version)` and `refreshMermaidImage`.
- **Embed descriptors and the CLI export keep Mermaid 11's defaults** unless
  given a version (`descriptor.version`): integrators and `.mmd` files convert
  the same stored source on every load, so a new default would restyle diagrams
  their users already have.
- The `mermaid` config key is unaffected: a configured `theme`/`look`/`layout`
  outranks the version's defaults, and an unconfigured deployment still stores
  `config: null` (only the `version` field is new).
- Version 12's redux themes draw labels in the Recursive web font, and the
  converter measures labels while parsing, so `parseMermaidDiagram` first
  loads the fonts the bundle names for the diagram
  (`mxMermaidToDrawio.getFonts` → `EditorUi.loadMermaidFonts`: `Graph.addFont`
  plus `document.fonts.load`, at most `EditorUi.mermaidFontTimeout` ms, then
  it parses with fallback fonts). Diagrams that need no web font still parse
  synchronously. Their sequence lifelines use the opt-in `lifelineColor`
  style of `umlLifeline` (line in the ink color under a palette-colored head).

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
