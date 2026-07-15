# Native bundles: drawio-elk, drawio-mermaid, drawio-libavoid

Three native-JS ports live in **private sibling repos** of `drawio-dev` and
produce the committed browser bundles that the rest of draw.io consumes via
plain `<script>` tags. The bundles are committed so the default Ant build
stays npm-free — clone a sibling only when you need to rebuild its bundle.
(They were once git submodules under `modules/`; removed to avoid friction
with frequent dev-branch merges while the ports are in active development.)

| Sibling repo | Produces | Exposes | Consumed by |
|---|---|---|---|
| `../drawio-elk` (`jgraph/drawio-elk`) | `js/elk/drawio-elk.min.js` | `window.ELK` + `ElkLayout`/`ElkAdapter`/`ElkApplier` (incl. `DEFAULTS`/`MENU_PRESETS`/`CANONICAL_EDGE`) | `diagramly/ElkLayout.js` (editor UI statics), `drawio-mermaid` (reads `globalThis.ELK`), drawio-mcp (vendored copy) |
| `../drawio-mermaid` (`jgraph/drawio-mermaid`) | `js/mermaid/drawio-mermaid.min.js` | `mxMermaidToDrawio` | `EditorUi.parseMermaidDiagram`, `Devel.js`, `export3.html` |
| `../drawio-libavoid` (`jgraph/drawio-libavoid`) | `js/libavoid-js/libavoid.min.js` | `globalThis.Avoid` (+ `window.__libavoidReady`) | `js/libavoid-js/libavoid-routing.js` (core) + `diagramly/LibavoidRouting.js` (adapter) |

## Load order (fixed)

`drawio-elk` **must** load before `drawio-mermaid` so `window.ELK` is defined
when mermaid's layout bridge reads `globalThis.ELK`. libavoid loads bundle →
routing core → adapter (`libavoid.min.js` → `libavoid-routing.js` →
`diagramly/LibavoidRouting.js`). Enforced in three places — keep all in sync:

1. `Devel.js` — `?dev=1` script tag order
2. `EditorUi.loadMermaid` — `mxscript` chain for the runtime loader
   (elk + mermaid)
3. `etc/build/github-build.xml` — fileset order in the `extensions.min.js`
   vendor concat (flows transitively into `atlas`/`integrate`/desktop)

`export3.html` (desktop/headless export) loads the script tags in the same
order.

## Rebuilding

```bash
cd etc/build
ant bundles
```

The `bundles` target lives in the **internal** `build.xml`, not the public
`github-build.xml` — the sibling repos are private, so public-repo
contributors rely on the committed artifacts instead. It runs `npm run build`
in each of `../drawio-elk`, `../drawio-mermaid` and `../drawio-libavoid`
(the last needs the Emscripten SDK; the other two only Node) and copies each
output in — e.g. `../drawio-libavoid/dist/libavoid.js` →
`js/libavoid-js/libavoid.min.js`. Standalone — not a dependency of `merge`,
`app`, `atlas`, or `integrate`. Full build docs: `etc/build/CLAUDE.md`;
one-time sibling clone instructions are in its `bundles` section.

Never hand-edit a `.min.js` bundle — fix the sibling repo and re-run
`ant bundles`.

## libavoid bundle: pure JS, synchronous, no CSP gate

`libavoid.min.js` compiles the published Adaptagrams libavoid C++ plus a
draw.io-authored **embind** binding into a single self-contained pure-JS file
(Emscripten wasm2js, `-sWASM=0 -sDYNAMIC_EXECUTION=0
-sWASM_ASYNC_COMPILATION=0`). **No WebAssembly, no `new Function`/`eval`** —
it needs neither `'unsafe-eval'` nor `'wasm-unsafe-eval'` and runs under any
CSP. That is *why* it is pure JS: the earlier WASM builds needed
`'wasm-unsafe-eval'`, and embedders like Atlassian Forge that grant only
`'unsafe-eval'` blocked the wasm compile. It also initializes
**synchronously**: on load the bundle calls its own `initAvoidModule` factory
(embind classes are on the module object before the call returns), sets
`globalThis.Avoid`, `window.__libavoidReady = Promise.resolve(Avoid)`
(back-compat for awaiting callers), and a `printErr` filter (demotes
libavoid's non-actionable "skipping checkpoint" stderr to `console.debug`) —
all baked into the sibling's `--extern-post-js`, so there is **no drawio-dev
loader file**. The sibling build hard-fails if the output contains
`new Function`/`eval(`. History: this replaced (a) vendoring the upstream
`libavoid-js@0.5.0-beta.5` npm package, whose embind glue needed CSP
`'unsafe-eval'` and was regex-patched at vendor time, and (b) a brief
from-source WASM build that still needed `'wasm-unsafe-eval'` and async
loading.

Because there is no CSP or availability risk, the former graceful-fallback
machinery is gone: no loader CSP probe, no `__LIBAVOID_UNAVAILABLE`, and **no
`LibavoidRouting.isSupported()`**. Every routing UI entry point — the
Arrange > Layout item (diagramly/Menus.js), the auto-route picks in the
edge-style pickers (grapheditor Menus.js / Format.js / InlineToolbar.js), the
custom-layout dialog's Add dropdown (`EditorUi.createLayoutAddSelect`), the
auto-routing listener install (diagramly `EditorUi.init`) — gates ONLY on
`typeof LibavoidRouting !== 'undefined'`, i.e. whether `extensions.min.js`
(which carries libavoid) is loaded; they no-op in viewers/configs without it.
**Keep any new libavoid entry point behind that same `typeof` guard.**
Programmatic callers (JSON layout specs, embed actions, Run Last Layout
replays) still surface the translated `libavoidUnavailable` error if the
bundle somehow failed to init (e.g. `run()` awaits `window.__libavoidReady`,
which resolves to null on an init throw).

Routing behavior and invariants: `docs/claude/libavoid-routing.md`. Canonical
routing core + drawio-mcp sync rules:
`src/main/webapp/js/libavoid-js/CLAUDE.md`.
