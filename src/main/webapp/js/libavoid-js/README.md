# libavoid (pure-JS, built from source)

Obstacle-avoiding **orthogonal edge routing** for the Arrange &gt; Layout &gt;
**Orthogonal Routing** menu item (and the `orthogonalEdge` childLayout).
libavoid never moves a vertex — it only computes edge paths that route around
the vertices as obstacles.

The bundle here is **built from source** in the sibling repo
[`../drawio-libavoid`](https://github.com/jgraph/drawio-libavoid) — the same
pattern as `drawio-elk` / `drawio-mermaid`, down to the refresh path
(`ant bundles`) and being a **single, self-contained, self-publishing** bundle
loaded via one `<script>` tag. That repo compiles the published
[libavoid](https://www.adaptagrams.org/) C++ (from the Adaptagrams submodule,
LGPL-2.1) with a small draw.io-authored **embind** binding into one pure-JS file
(Emscripten wasm2js, `-sWASM=0`). Like `drawio-mermaid` publishes
`mxMermaidToDrawio`, this bundle publishes `window.Avoid` itself on load — there
is **no separate loader file** and no bespoke vendor script.

**No WebAssembly, no dynamic loading.** Earlier versions shipped a WASM binary
(base64-inlined, decoded and instantiated asynchronously). That is gone:

- **CSP**: pure JS built with `-sDYNAMIC_EXECUTION=0` needs **neither
  `'unsafe-eval'` nor `'wasm-unsafe-eval'`** — it runs under any `script-src`.
- **Synchronous init**: built with `-sWASM_ASYNC_COMPILATION=0`, so
  `initAvoidModule(mod)` populates the embind classes on `mod` before it
  returns. The bundle's own bootstrap (baked in via `--extern-post-js`) calls it
  and publishes `globalThis.Avoid` in one tick — no promise to await, no CSP
  probe, no availability race, no separate loader.

The tradeoff is size/speed (pure JS is ~2–4× the old wasm and slower per solve),
which is acceptable: routing runs on user gestures, not a hot loop, and
universal CSP compatibility is the goal.

## Artifacts

| File | Origin | Purpose |
|---|---|---|
| `libavoid.min.js` | **copied** from `../drawio-libavoid/dist/libavoid.js` (by `ant bundles`) | The pure-JS module (wasm2js, embind, `DYNAMIC_EXECUTION=0`, synchronous). Self-publishing: on load it calls its own `initAvoidModule` factory synchronously, sets `window.Avoid` (and `window.__libavoidReady = Promise.resolve(Avoid)` for back-compat), and installs the `printErr` filter (demotes libavoid's non-actionable "skipping checkpoint" stderr to `console.debug`). Compiled **exception-free**: a C++ throw would abort the module and kill routing for the session, so the build patches VPSC's internal throw/catch into explicit control flow and defines `-DNDEBUG` — see `../drawio-libavoid/build/patches/`. |
| `libavoid-routing.js` | **hand-authored** | The shared routing core, `globalThis.AvoidRouting`: `computeRoutes` (obstacle-avoiding solve incl. fixed-connection-point pins and jettySize stub checkpoints) plus the pure geometry helpers (`constraintForPoint`, `jettyStub`, `filterEnclosing`, `insideAny`, `dirForPoint`, `clamp01`). **Canonical source** — drawio-mcp vendors verbatim copies (see Algorithm sync). |
| `LICENSE` | upstream | LGPL-2.1 — shipped for attribution (libavoid is LGPL). |

The editor adapter lives next to the other layouts:
[`js/diagramly/LibavoidRouting.js`](../diagramly/LibavoidRouting.js). It reads
`window.Avoid` directly (always set at load). The routing UI entry points gate
only on `typeof LibavoidRouting !== 'undefined'` — i.e. whether the extensions
bundle is loaded (a no-op in viewers). There is no availability/CSP probe: the
bundle is pure JS and can't be blocked by a CSP, so the old `isSupported()`
helper and the wasm-unsafe-eval fallback are gone.

## Load order (fixed)

`libavoid.min.js` → `libavoid-routing.js` → `LibavoidRouting.js`. Enforced in
`Devel.js` (dev) and the `extensions.min.js` concat in
`etc/build/github-build.xml` (prod). (`libavoid-routing.js` itself has no
load-order dependency — every entry point takes the `Avoid` namespace as a
parameter — it is simply kept in the block.) libavoid flows transitively into
`atlas.min.js`, `integrate.min.js`, and the desktop build because they include
`extensions.min.js` whole.

## Refreshing

Exactly like `drawio-elk` / `drawio-mermaid` — via the internal `bundles` Ant
target, which rebuilds all three sibling bundles and copies them in:

```sh
cd drawio-dev/etc/build
ant bundles     # runs `npm run build` in each sibling, copies the outputs
```

libavoid's `npm run build` needs the Emscripten SDK (the other two need only
Node). `libavoid-routing.js` and this README are hand-authored — not copied. The
C++ version is pinned by the adaptagrams submodule commit in `../drawio-libavoid`.

## Algorithm sync

`libavoid-routing.js` here is the **canonical** routing core. It reaches its
consumers through the viewer.diagrams.net CDN whenever a draw.io release
ships this directory
(`https://viewer.diagrams.net/js/libavoid-js/libavoid-routing.js`):

- The **drawio-mcp app server** loads it straight from the CDN in its
  sandboxed iframe (ETag-versioned URLs,
  `mcp-app-server/src/libavoid-versions.js`) — no vendored copy.
- The **drawio-mcp tool server** (node-side pass) loads the CURRENT core
  through an ETag-revalidated per-user disk cache
  (`mcp-tool-server/src/routing-core-cache.js`, revalidated against the CDN
  once per process), so routing fixes land there automatically too. Its
  vendored `mcp-tool-server/vendor/libavoid/libavoid-routing.js` is a
  verbatim copy kept only as the cold-cache/offline/pre-release fallback —
  refresh it when this file changes (lagging between releases is expected;
  the runtime cache wins whenever the CDN is reachable).

Only the routing core is shared — never loaders: every `AvoidRouting` entry
point takes the `Avoid` namespace as a parameter, so each consumer
loads/publishes `Avoid` its own way (this repo synchronously via the pure-JS
bundle; the mcp tool server via its vendored node WASM build).
