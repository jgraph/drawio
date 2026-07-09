# libavoid-js (vendored)

Obstacle-avoiding **orthogonal edge routing** for the Arrange &gt; Layout &gt;
**Orthogonal Routing** menu item. libavoid never moves a vertex — it only
computes edge paths that route around the vertices as obstacles. Vendored from
the upstream [`libavoid-js`](https://github.com/Aksem/libavoid-js) npm package,
the Emscripten/WASM port of [libavoid](https://www.adaptagrams.org/).

This is the **only** part of the build that ships a WebAssembly binary, and
unlike `js/elk` / `js/mermaid` (which load bundles from a CDN in some contexts)
libavoid must ship fully inline: the offline PWA and the sandboxed embed can't
`fetch` the `.wasm`. So the `.wasm` is base64-inlined and handed to the
Emscripten module as `wasmBinary` — it instantiates with no network access.

**CSP requirement**: pages loading this module need `'wasm-unsafe-eval'` (or
`'unsafe-eval'`) in `script-src`, and nothing more. Upstream is built without
Emscripten's `-sDYNAMIC_EXECUTION=0`, so its embind glue also generated JS
invokers via `new Function(...)` at module init — needing full
`'unsafe-eval'` and aborting under the diagrams.net CSP even after the wasm
compiled. `vendor-libavoid.js` (`patchEmbindDynamicExecution`) replaces both
codegen sites with eval-free equivalents at vendor time (the `.wasm` is
untouched), and hard-fails if a future upstream bump reintroduces dynamic
code generation. On CSP failure the loader still degrades gracefully:
`window.__libavoidReady` resolves to `null` and routing is disabled.

## Artifacts

| File | Origin | Purpose |
|---|---|---|
| `libavoid.min.js` | **generated** from upstream `dist/index.js` | Emscripten glue: IIFE-wrapped, `import.meta.url` neutralized, loader patched to take an inlined `wasmBinary` + an optional `printErr` (`globalThis.__LIBAVOID_PRINT_ERR`), embind's `new Function` codegen replaced with eval-free invokers (CSP, see above), source-map pointer dropped, ESM export stripped, `globalThis.AvoidLib` aliased. |
| `libavoid-wasm.js` | **generated** from upstream `dist/libavoid.wasm` | `window.__LIBAVOID_WASM_B64 = "<base64>"` (~640 KB). |
| `libavoid-loader.js` | **hand-authored** | Decodes the base64 → `globalThis.__LIBAVOID_WASM_BINARY`, defines `__LIBAVOID_PRINT_ERR` (demotes libavoid's non-actionable "skipping checkpoint" stderr warnings to `console.debug`), calls `AvoidLib.load()`, parks the promise on `window.__libavoidReady` (resolves to the `Avoid` namespace, or `null` on failure). |
| `libavoid-routing.js` | **hand-authored** | The shared routing core, `globalThis.AvoidRouting`: `computeRoutes` (obstacle-avoiding solve incl. fixed-connection-point pins and jettySize stub checkpoints) plus the pure geometry helpers (`constraintForPoint`, `jettyStub`, `filterEnclosing`, `insideAny`, `dirForPoint`, `clamp01`). **Canonical source** — drawio-mcp vendors verbatim copies (see Algorithm sync). |
| `LICENSE` | upstream | LGPL-2.1 — shipped for attribution (libavoid is LGPL). |

The editor adapter lives next to the other layouts:
[`js/diagramly/LibavoidRouting.js`](../diagramly/LibavoidRouting.js).

## Load order (fixed)

`libavoid.min.js` → `libavoid-wasm.js` → `libavoid-loader.js` →
`libavoid-routing.js` → `LibavoidRouting.js`. Enforced in `Devel.js` (dev)
and the `extensions.min.js` concat in `etc/build/github-build.xml` (prod).
(`libavoid-routing.js` itself has no load-order dependency — every entry
point takes the `Avoid` namespace as a parameter — it is simply kept in the
block.) libavoid flows transitively into `atlas.min.js`, `integrate.min.js`,
and the desktop build because they include `extensions.min.js` whole.

## Refreshing

```sh
cd etc/build
ant vendor-libavoid          # npm pack libavoid-js@<version>, transform, write artifacts
# or, from a local copy of the upstream files:
node vendor-libavoid.js --from /path/to/dir/with/libavoid.min.js+libavoid.wasm
```

Regenerates `libavoid.min.js`, `libavoid-wasm.js`, `LICENSE`.
`libavoid-loader.js`, `libavoid-routing.js` and this README are hand-authored —
not regenerated. The pinned version lives in `etc/build/vendor-libavoid.js`
(`VERSION`).

**Currently vendored: `libavoid-js@0.5.0-beta.5`.**

If an upstream bump changes the minified loader signature, the
`wasmBinary` patch in `vendor-libavoid.js` hard-fails ("Could not patch libavoid
loader…") instead of silently shipping a fetch-on-load bundle — update the regex.

## Algorithm sync

`libavoid-routing.js` here is the **canonical** routing core. drawio-mcp
vendors verbatim copies (`mcp-app-server/vendor/libavoid/` for the inlined
viewer, `mcp-tool-server/vendor/libavoid/` for the node-side pass — the
latter side-effect imports the plain script and reads
`globalThis.AvoidRouting`). When this file changes, copy it over both. The
WASM globals (`AvoidLib` / `window.Avoid` / `window.__libavoidReady`) are
deliberately identical across both repos.
