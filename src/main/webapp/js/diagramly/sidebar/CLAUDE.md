# diagramly/sidebar — shape palettes

60+ `Sidebar-*.js` modules (AWS, Azure, GCP, Cisco, UML25, BPMN, Kubernetes,
…), compiled into `sidebar.min.js` and bundled into `app.min.js`. `Sidebar.js`
here holds the draw.io-side sidebar extensions (entry registration in
`updateEntries`); the palette framework lives in `grapheditor/Sidebar.js`.

## More Shapes preview PNGs (`images/sidebar-*.png`)

Wired per set in `Sidebar.prototype.updateEntries` (Sidebar.js here).
Generated with the developer-only **`?savesidebar=1`** URL param
(bootstrap.js): it renders sidebar thumbs at 64×64 (diagramly/EditorUi.js) and
the `addFoldingHandler` override (same Sidebar.js, below `updateEntries`) adds
a **Save** button to every palette title that composites the palette to a
432px-wide PNG — icons in a 6-column/68px grid at
`(12 + (i%6)*68, 24 + row*68)`, bold 14px `rgb(80,80,80)` title at x=6 — and
downloads it via `saveCanvas`. Stack the per-palette PNGs vertically into one
strip (see the comment above `updateEntries`). For headless capture, point
Cloudflare Browser Rendering (screenshot API, `url` parameter) at the
`savesidebar=1` URL — the export workers in `cf-workers/` (puppeteer,
drawio-export-cf) are XML-export only and cannot screenshot arbitrary URLs.
