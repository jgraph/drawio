# js/libavoid-js — libavoid bundle + canonical routing core

`README.md` here covers artifact provenance, load order and refresh; routing
behavior/invariants live in `docs/claude/libavoid-routing.md` (repo root),
bundle topology in `docs/claude/native-bundles.md`.

- **`libavoid.min.js` is a build artifact** — built from the private sibling
  `../drawio-libavoid` (pure-JS Emscripten build: no WASM, no eval, publishes
  `globalThis.Avoid` synchronously). Never hand-edit; refresh via
  `ant bundles` (needs emsdk). The build is exception-free BY PATCH: upstream
  VPSC throws/catches internally for unsatisfiable nudging systems, which
  aborts a DISABLE_EXCEPTION_CATCHING module and leaves it dead for the
  session — `../drawio-libavoid/build/patches/vpsc-exception-free.patch`
  (+ `-DNDEBUG` for COLA_ASSERT) converts those paths to the catch handler's
  own relaxation. `Router.processTransaction` must never throw.
- **`libavoid-routing.js` is the CANONICAL shared routing core**, hand-authored
  (`globalThis.AvoidRouting`: `computeRoutes` + pure geometry helpers).
  Routing/algorithm tuning belongs HERE — the editor binding
  (`diagramly/LibavoidRouting.js`) is model access/events/previews/styles
  only. The core is model-free and takes the `Avoid` namespace as a parameter.

## Sync with drawio-mcp (when `libavoid-routing.js` changes)

The core reaches drawio-mcp automatically via the viewer.diagrams.net CDN
(`.../js/libavoid-js/libavoid-routing.js`, updates whenever a draw.io release
ships this directory): the mcp app server CDN-loads it (ETag-versioned URLs,
`mcp-app-server/src/libavoid-versions.js`) and the mcp tool server
revalidates it into a per-user disk cache at runtime
(`mcp-tool-server/src/routing-core-cache.js`). The only manual step: refresh
the tool server's cold-cache/offline/pre-release fallback copy —
`mcp-tool-server/vendor/libavoid/libavoid-routing.js` — verbatim when the
canonical file changes here. Never sync loaders (the core takes the `Avoid`
namespace as a parameter; drawio-dev publishes it synchronously from the
pure-JS bundle, mcp's tool server uses its own vendored node WASM build).
