# VSDX Import/Export Module

## Overview

This folder implements complete **VSDX (Microsoft Visio 2013+ XML)** file format support for draw.io. VSDX files are ZIP archives containing XML documents following the Open Packaging Conventions (OPC) standard.

**4 JavaScript files, ~940 KB total, ~16,500 lines of code.** The import
also uses code outside this folder (see Related code below).

**Testing — run before and after every importer change:** the regression
suite in [test/vsdx/import](../../../../../../test/vsdx/import/README.md)
(drawio-dev only; `test/vsdx/` is not mirrored to the public repo) imports
~317 files (Visio-authored feature files, stencil sheets, `.vssx` libraries,
crafted security/robustness files, licensed public samples) with the
working-copy `importer.js`, diffs against golden snapshots, scores renders
against Visio's own output and scans for injected active content. The files
and snapshots live in the private test set repository
`jgraph/drawio-visio-test` (`vsdx-import/`), cloned next to drawio.
`cd test/vsdx/import && npm install && node run.js` (then `--view`,
`--update`). A bug fix comes with a reproducing test (see that folder's
CLAUDE.md); snapshot changes are committed in drawio-visio-test.

| File | Lines | Size | Purpose |
|------|-------|------|---------|
| `importer.js` | ~14,000 | ~830 KB | VSDX/VSSX → draw.io import (JSweet-generated from Java) |
| `VsdxExport.js` | 993 | 73 KB | draw.io → VSDX export |
| `mxVsdxCanvas2D.js` | 1,153 | 30 KB | Canvas adapter capturing shape rendering as VSDX geometry |
| `bmpDecoder.js` | 287 | 9 KB | BMP image format decoder for embedded images |

### Related code outside this folder

| Where | Role |
|-------|------|
| `EditorUi.importVisio` / `doImportVisio` (`../EditorUi.js`) | App entry points. Binary `.vsd`/`.vss`/`.vst` files are first converted to Visio XML in the browser (`convertBinaryVisio`, `js/vsd/drawio-vsd.min.js`); `.vdx` and files the converter cannot read go to `VSS_CONVERT_URL`. |
| `../emf/emf-svg.js` | `window.emfToSvg`: EMF → SVG for embedded images (bundled in `extensions.min.js`) |
| `vsdxImporter.html` + `js/vsdxImporter.js` (webapp root) | Standalone importer page. Nothing in this repo loads it, but drawio-desktop's command-line export does (messages `import` → `import-success` / `import-error`), and so do headless tools that use the hosted page (file input → `#doneDiv`, `window.importResXML`). Keep both contracts. |
| `connect/vsdx/importer.js` | `convertVSDXtoMX`, a reduced `importVisio` for the Confluence/Jira connector pages; loads `extensions.min.js` on first use |

---

## Architecture

```
┌─────────────────────── IMPORT ───────────────────────┐
│                                                       │
│  VSDX ZIP  →  mxVsdxCodec.decodeVsdx()               │
│                   │                                   │
│                   ├── JSZip extraction                 │
│                   ├── XML parsing (docData map)        │
│                   ├── Media extraction (mediaData map) │
│                   │     ├── EMF → SVG (client-side)    │
│                   │     ├── BMP → JPEG (BmpDecoder)    │
│                   │     └── PNG/JPEG → base64          │
│                   │                                   │
│                   ▼                                   │
│              mxVsdxModel                              │
│                   ├── Stylesheets                     │
│                   ├── Themes (mxVsdxTheme)            │
│                   ├── Masters (mxVsdxMaster)          │
│                   └── Pages (mxVsdxPage)              │
│                         └── Shapes (VsdxShape)        │
│                               ├── Geometry (Rows)     │
│                               ├── Style resolution    │
│                               └── Master inheritance  │
│                   │                                   │
│                   ▼                                   │
│              importPage() → mxGraph model → XML       │
│                                                       │
└───────────────────────────────────────────────────────┘

┌─────────────────────── EXPORT ───────────────────────┐
│                                                       │
│  mxGraph  →  VsdxExport.exportCurrentDiagrams()       │
│                   │                                   │
│                   ├── createVsdxSkeleton() (ZIP init)  │
│                   │                                   │
│                   ▼                                   │
│              convertMxModel2Page()                    │
│                   ├── convertMxCell2Shape() per cell   │
│                   │     ├── createShape() (vertices)   │
│                   │     ├── createEdge() (connectors)  │
│                   │     └── mxVsdxCanvas2D (rendering) │
│                   ├── applyMxCellStyle()              │
│                   └── addPagesXML() + addImagesRels() │
│                   │                                   │
│                   ▼                                   │
│              JSZip.generateAsync() → .vsdx download   │
│                                                       │
└───────────────────────────────────────────────────────┘
```

---

## File Details

### importer.js

**Origin**: Generated from Java via **JSweet 2.0.0-rc1** transpiler. Uses nested namespaces: `com.mxgraph.io.*`.

**Namespace structure**:
```
com.mxgraph.io.mxVsdxCodec         — Main VSDX codec
com.mxgraph.io.mxVssxCodec         — Library (VSSX) codec (extends mxVsdxCodec)
com.mxgraph.io.vsdx.Shape          — Base shape wrapper
com.mxgraph.io.vsdx.VsdxShape      — VSDX-specific shape (extends Shape)
com.mxgraph.io.vsdx.mxVsdxModel    — Document model container
com.mxgraph.io.vsdx.mxVsdxPage     — Page representation
com.mxgraph.io.vsdx.mxVsdxMaster   — Master shape template
com.mxgraph.io.vsdx.mxVsdxTheme    — OOXML theme parser
com.mxgraph.io.vsdx.mxVsdxConnect  — Connection definition
com.mxgraph.io.vsdx.mxVsdxUtils    — XML/style utilities
com.mxgraph.io.vsdx.mxVsdxConstants — XML element/attribute constants
com.mxgraph.io.vsdx.mxPropertiesManager — Color palette manager
com.mxgraph.io.vsdx.mxVsdxGeometry — Single geometry section
com.mxgraph.io.vsdx.mxVsdxGeometryList — Collection of geometry sections
com.mxgraph.io.vsdx.geometry.Row   — Base geometry row
com.mxgraph.io.vsdx.geometry.*     — 16 Row subclasses
com.mxgraph.io.vsdx.theme.*        — Theme/color classes (OoxmlColor, etc.)
```

#### Key Classes

**mxVsdxCodec** — Main entry point for VSDX import.

| Method | Purpose |
|--------|---------|
| `decodeVsdx(file, callback, charset, onerror)` | Main async entry: extracts ZIP, parses XML, builds model, imports pages |
| `createMxGraph()` | Creates configured Graph instance for import |
| `importPage(page, graph, parent, noSanitize)` | Orchestrates page import: shapes → edges → layers (3-pass) |
| `processPage(graph, page)` | Encodes mxGraph model to compressed XML `<diagram>` element |
| `postImportPage(page, graph, callback)` | Async post-processing (image cropping) |
| `addShape(graph, shape, parent, pageId, parentHeight)` | Routes shapes to addVertex/addGroup/edgeShapeMap |
| `addVertex(graph, shape, parent, pageId, parentHeight)` | Creates vertex cell with style and geometry |
| `addGroup(graph, shape, parent, pageId, parentHeight, forceNoFill)` | Creates group container, recursively adds children |
| `addConnectedEdge(graph, connect, pageId, pageHeight)` | Creates edge connecting source/target vertices |
| `addUnconnectedEdge(graph, parent, edgeShape, pageHeight)` | Creates standalone edge (no connections) |
| `processEdgeGeo(edgeShape, edge, parentHeight)` | Handles special edge geometry (line jumps, NURBS curves) |
| `scaleGraph(graph, scale)` | Rescales entire graph for page scale adjustments |
| `sanitiseGraph(graph)` | Post-import cleanup and validation |

**mxVssxCodec** — Library/stencil file importer (extends mxVsdxCodec).

| Method | Purpose |
|--------|---------|
| `decodeVssx(file, callback, charset, onerror)` | Import VSSX library file |
| `normalizeGraph(graph)` | Normalize shapes for library consistency |
| `processPage(graph, page)` | Override: normalizes before encoding |

**mxVsdxModel** — Top-level document model.

| Method | Purpose |
|--------|---------|
| `constructor(doc, docData, mediaData)` | Parses document.xml, initializes stylesheets/themes/masters/pages |
| `initThemes()` | Loads theme XML files, creates mxVsdxTheme objects |
| `initStylesheets()` | Loads StyleSheet elements and resolves references |
| `initMasters()` | Loads masters/masters.xml, creates mxVsdxMaster objects |
| `initPages()` | Loads pages/pages.xml, creates mxVsdxPage objects, links backgrounds |
| `getPages()` / `getMaster(id)` / `getThemes()` | Model accessors |

**mxVsdxPage** — Single page within the VSDX document.

| Method | Purpose |
|--------|---------|
| `constructor(pageElem, model)` | Parses page element, extracts shapes/connects/layers |
| `parseShapes(shapesElement, master, recurse)` | Creates VsdxShape objects from Shape XML elements |
| `createCell(shapeElem, vertex, master)` | Factory for VsdxShape creation |
| `isEdge(shape)` | Detects edges via BeginX/BeginY/EndX/EndY cells |
| `getShapes()` / `getConnects()` / `getLayers()` | Page content accessors |
| `getPageDimensions()` / `getPageScale()` / `getDrawingScale()` | Page metrics |

**VsdxShape** (extends Shape) — Wrapper for VSDX shape elements with master/theme resolution.

| Method | Purpose |
|--------|---------|
| `constructor(page, shape, vertex, masters, master, model)` | Resolves master, calculates rotation, applies theme, processes geometry |
| `getTextLabel()` | Returns text content with HTML formatting |
| `getStyleFromShape()` | Returns map of draw.io style properties |
| `getOriginPoint(parentHeight, convertCoords)` | Converts VSDX coordinates to mxGraph (flips Y axis) |
| `getDimensions()` | Returns shape width and height |
| `getGeomList()` | Returns mxVsdxGeometryList path definition |
| `getHyperlink()` | Extracts page links and external links |
| `getProperties()` | Returns custom shape properties array |
| `getControlPoints(parentHeight)` | Returns NURBS control points for curved edges |
| `setThemeAndVariant(theme, variantClr, variantStl)` | Applies theme colors and style variant |

**Shape** (base class) — Wraps VSDX shape XML element with style/text/geometry parsing.

| Method | Purpose |
|--------|---------|
| `constructor(shape, model)` | Parses Cell/Section elements, extracts text and geometry |
| `getValue(cellElem, defaultValue)` | Gets cell value with formula handling |
| `getCellElement(name)` | Looks up Cell by N attribute |
| `getScreenNumericalValue(cellElem, defaultValue)` | Gets coordinate in screen units |
| `getStyleFromShape()` | Returns fill/line/text style properties |
| `getTextLabel()` | Returns formatted text content |

**mxVsdxTheme** — OOXML color theme parser.

| Method | Purpose |
|--------|---------|
| `constructor(themeElem)` | Parses a:clrScheme, a:fontScheme, a:fmtScheme |
| `getThemeColor(index, tint, shade)` | Resolves theme color with tint/shade modifications |

**Geometry Row hierarchy** — Path operations for shape outlines:

| Row Type | Parameters | Purpose |
|----------|-----------|---------|
| `MoveTo` | x, y | Start new subpath |
| `LineTo` | x, y | Line segment |
| `ArcTo` | x, y, a (radius) | Elliptical arc |
| `Ellipse` | x, y, a, b, c, d | Complete ellipse |
| `EllipticalArcTo` | x, y, a, b, c, d | Elliptical arc with rotation |
| `NURBSTo` | x, y, a, b, c, d, e | NURBS curve |
| `PolylineTo` | x, y, a | Series of line segments |
| `RelCubBezTo` | x, y, a, b, c, d | Cubic Bezier (relative) |
| `RelQuadBezTo` | x, y, a, b | Quadratic Bezier (relative) |
| `RelLineTo` | x, y | Relative line |
| `RelMoveTo` | x, y | Relative move |
| `RelEllipticalArcTo` | x, y, a, b, c, d | Relative elliptical arc |
| `SplineStart` | x, y, a, b, c, d | Spline definition start |
| `SplineKnot` | x, y, a | Spline knot point |
| `InfiniteLine` | x, y, a, b | Infinite line through two points |
| `DelRow` | index | Row deletion marker |

---

### VsdxExport.js

**Pattern**: Closure-based module. Constructor `VsdxExport(editorUi)` defines all functions as closures with shared state.

#### Functions (all internal closures)

| Function | Purpose |
|----------|---------|
| `exportCurrentDiagrams(currentPageOnly)` | Main entry point: collects pages, builds ZIP, triggers download |
| `createVsdxSkeleton(zip, pageCount)` | Creates complete static VSDX directory structure and template files |
| `getCellVsdxId(cellId)` | Maps mxGraph cell IDs → sequential VSDX shape IDs |
| `getGraphAttributes(graph)` | Extracts page properties (dimensions, grid, scale) |
| `applyMxCellStyle(state, shape, xmlDoc)` | Converts mxGraph styles to VSDX Cell elements (fill, line, font, text) |
| `createShape(id, geo, layerIndex, xmlDoc, parentHeight, isChild)` | Creates VSDX Shape element with XForm geometry |
| `createEdge(cell, layerIndex, graph, xmlDoc, parentHeight, isChild)` | Creates edge Shape with connector master and waypoints |
| `convertMxCell2Shape(cell, layerIndex, graph, xmlDoc, parentHeight, parentGeo, isChild)` | Main dispatcher: routes to createShape/createEdge, handles groups |
| `convertMxModel2Page(graph, modelAttrib)` | Converts entire mxGraph to PageContents XML |
| `addPagesXML(zip, pages, pageLayers, modelsAttr)` | Creates pages.xml and pages.xml.rels in ZIP |
| `addImagesRels(zip, pIndex)` | Creates relationship files for embedded images |
| `writeXmlDoc2Zip(zip, name, xmlDoc, noHeader)` | Serializes XML document into ZIP file entry |
| `createCellElem(name, val, xmlDoc, formula)` | Creates VSDX `<Cell>` element |
| `createCellElemScaled(name, val, xmlDoc, formula)` | Creates `<Cell>` with CONVERSION_FACTOR scaling |
| `createRow(type, index, x, y, xmlDoc)` | Creates geometry `<Row>` element |
| `getStyleColor(color)` | Normalizes color to VSDX format |
| `getArrowType(arrow, isFilled)` | Maps draw.io arrow name to VSDX arrow ID |
| `getArrowSize(size)` | Maps draw.io arrow size to VSDX arrow size value |
| `collectLayers(graph, diagramName)` | Extracts layer definitions from graph |
| `exportPage(page)` | Exports a single page (called in sequence) |

#### Constants

```javascript
CONVERSION_FACTOR = 40 * 2.54  // = 101.6 (screen coordinates per cm × cm per inch)
PAGES_TYPE = "http://schemas.microsoft.com/visio/2010/relationships/page"
RELS_XMLNS = "http://schemas.openxmlformats.org/package/2006/relationships"
XMLNS = "http://schemas.microsoft.com/office/visio/2012/main"
XMLNS_R = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"

// Arrow type mapping: "drawioType|filled" → VSDX arrow ID
ARROWS_MAP = {
    "none|1": 0, "none|0": 0,
    "open|1": 1, "open|0": 1,
    "block|1": 4, "block|0": 14,
    "classic|1": 5, "classic|0": 17,
    "oval|1": 10, "oval|0": 20,
    "diamond|1": 11, "diamond|0": 22,
    "blockThin|1": 2, "blockThin|0": 15,
    "dash|1": 23, "dash|0": 23,
    "ERone|1": 24, "ERmandOne|1": 25,
    "ERmany|1": 27, "ERoneToMany|1": 28,
    "ERzeroToMany|1": 29, "ERzeroToOne|1": 30,
    "openAsync|1": 9, "openAsync|0": 9
}
```

---

### mxVsdxCanvas2D.js

**Inheritance**: `mxAbstractCanvas2D` → `mxVsdxCanvas2D` (via `mxUtils.extend`)

Intercepts mxGraph shape rendering calls and converts them to VSDX geometry XML instead of drawing to screen.

#### Methods

| Method | Signature | Purpose |
|--------|-----------|---------|
| `init(zip)` | `(JSZip)` | Initialize for new VSDX file |
| `onFilesLoaded()` | `()` | Hook called after pending files finish loading |
| `newShape(shape, cellState, xmlDoc)` | `(XMLElement, mxCellState, XMLDocument)` | Start capturing geometry for a vertex |
| `newEdge(shape, cellState, xmlDoc)` | `(XMLElement, mxCellState, XMLDocument)` | Start capturing geometry for an edge |
| `endShape()` | `()` | Finalize current shape (flush foreign data) |
| `newPage()` | `()` | Reset image list for new page |
| `getShapeType()` | → `string` | Returns captured shape type |
| `getShapeGeo()` | → `XMLElement` | Returns captured geometry section |
| `createGeoSec()` | `()` | Creates new Geometry Section element |
| `createElt(name)` | `(string)` → `XMLElement` | Creates namespaced XML element |
| `createCellElemScaled(name, val, formula)` | `(string, number, string?)` | Creates Cell with CONVERSION_FACTOR scaling |
| `createCellElem(name, val, formula)` | `(string, number, string?)` | Creates Cell element |
| `createRowScaled(type, ix, x, y, ...)` | `(string, number, ...)` | Creates geometry Row with scaled coordinates |
| `createRowRel(type, ix, x, y, ...)` | `(string, number, ...)` | Creates relative geometry Row |
| `begin()` | `()` | Start new path |
| `rect(x, y, w, h)` | `(number × 4)` | Rectangle via MoveTo/LineTo sequence |
| `roundrect(x, y, w, h, dx, dy)` | `(number × 6)` | Rounded rectangle with ArcTo corners |
| `ellipse(x, y, w, h)` | `(number × 4)` | Ellipse geometry row |
| `moveTo(x, y)` | `(number × 2)` | MoveTo geometry row |
| `lineTo(x, y)` | `(number × 2)` | LineTo geometry row |
| `quadTo(x1, y1, x2, y2)` | `(number × 4)` | Quadratic Bezier → RelQuadBezTo |
| `curveTo(x1, y1, x2, y2, x3, y3)` | `(number × 6)` | Cubic Bezier → RelCubBezTo |
| `close()` | `()` | Close path (implicit LineTo back to start) |
| `image(x, y, w, h, src, aspect, flipH, flipV)` | `(number × 4, string, boolean × 3)` | Embed image: handles SVG→PNG, BMP→PNG conversion. Data URIs may be base64 or URL encoded (UTF-8 SVGs are rendered as `data:image/svg+xml,%3Csvg…`); undecodable data skips the image. The media file type comes from the untrusted MIME type or URL, so it is reduced to `[\w+.-]` (no path separators in zip entries) |
| `text(x, y, w, h, str, align, valign, wrap, format, overflow, clip, rotation, dir)` | `(number × 4, string, ...)` | Text with HTML parsing → VSDX Paragraph/Character/Text sections |
| `convertSvg2Png(svgData, w, h, isBase64, callback)` | `(string, number × 2, boolean, Function)` | Renders SVG on canvas, exports PNG |
| `addForeignData(type, index)` | `(string, number)` | Creates ForeignData element for embedded images |
| `rotate(theta, flipH, flipV, cx, cy)` | `(number, boolean × 2, number × 2)` | Captures rotation state |
| `stroke()` / `fill()` / `fillAndStroke()` | `()` | No-ops (geometry captured via path methods) |

---

### bmpDecoder.js

Standalone BMP image format decoder. No dependencies on other module files.

#### Constructor
```javascript
BmpDecoder(buffer, is_with_alpha)
// buffer: Uint8Array containing BMP file data
// is_with_alpha: Boolean for alpha channel support
```

#### Methods

| Method | Purpose |
|--------|---------|
| `parseHeader()` | Extracts file size, dimensions, bit depth, compression, palette |
| `parseBGR()` | Routes to bit-depth specific decoder |
| `bit1()` | 1-bit monochrome (2-color palette lookup) |
| `bit4()` | 4-bit 16-color (palette lookup) |
| `bit8()` | 8-bit 256-color (palette lookup) |
| `bit15()` | 15-bit RGB 5:5:5 |
| `bit16()` | 16-bit RGB 5:6:5 (partial support) |
| `bit24()` | 24-bit BGR → RGBA |
| `bit32()` | 32-bit BGRA → RGBA |
| `getData()` | Returns Uint8ClampedArray of RGBA pixel data |

---

## Import Flow (VSDX → draw.io)

### Phase 1: ZIP Extraction
```
mxVsdxCodec.decodeVsdx(file, callback)
  → JSZip.loadAsync(file)
  → For each entry in ZIP:
      .xml/.rels  → parseXml() → docData[path]
                    (handles UTF-8 BOM, UTF-16LE fallback, entity fixing)
      .emf        → window.emfToSvg() → SVG base64 → mediaData[path]
                    (client-side, ../emf/emf-svg.js; no server involved)
      .bmp        → BmpDecoder → canvas → JPEG base64 → mediaData[path]
      other media → base64 encode → mediaData[path]
```

### Phase 2: Model Initialization
```
allDone()
  → importNodes(document.xml)         // Resolve OPC relationships recursively
  → new mxVsdxModel(doc, docData, mediaData)
      ├── initStylesheets()            // Parse StyleSheet elements
      ├── initThemes()                 // Load theme1.xml, theme2.xml, ...
      ├── initMasters()                // Load masters/masters.xml
      └── initPages()                  // Load pages/pages.xml, link backgrounds
```

### Phase 3: Page Import (per page)
```
For each page in model.getPages():
  createMxGraph()                     // New Graph with VSDX-specific config
  graph.getModel().beginUpdate()

  importPage(page, graph, root):
    Pass 1 — Vertices:                // addShape() → addVertex()/addGroup()
      - Resolve master shape template
      - Apply theme + QuickStyle colors
      - Convert VSDX geometry to draw.io stencil
      - Convert coordinates (flip Y axis)
      - Create vertex cells
      - Extract hyperlinks and custom properties
      - Map layer membership to tags

    Pass 2 — Connected edges:          // addConnectedEdge()
      - Look up source/target in vertexMap
      - Create edge cells with graph.insertEdge()
      - Apply line style, arrows, routing
      - Process special geometry (line jumps, NURBS)

    Pass 3 — Unconnected edges:        // addUnconnectedEdge()
      - Standalone lines with waypoints

    Pass 4 — Layers:                   // Layer tag finalization
      - Set hidden layer visibility

  graph.getModel().endUpdate()
  scaleGraph(graph, pageScale/drawingScale)
  postImportPage(page, graph)          // Async image cropping
  sanitiseGraph(graph)
  processPage(graph, page)             // Encode → compress → <diagram> XML
```

### Phase 4: Output
```
Wrap all <diagram> elements in:
  <?xml version="1.0" encoding="UTF-8"?><mxfile>...</mxfile>
→ callback(xmlString)
```

---

## Export Flow (draw.io → VSDX)

```
VsdxExport(editorUi).exportCurrentDiagrams(currentPageOnly)
  │
  ├── Collect pages to export
  ├── createVsdxSkeleton(zip, pageCount)      // Template VSDX structure
  │
  ├── For each page:
  │     ├── getGraphAttributes(graph)          // Page dimensions, grid, scale
  │     ├── collectLayers(graph)               // Layer definitions
  │     ├── convertMxModel2Page(graph, attrs)
  │     │     ├── Get all cells from model
  │     │     ├── For each cell:
  │     │     │     convertMxCell2Shape(cell, ...)
  │     │     │       ├── Vertex: render via mxVsdxCanvas2D → createShape()
  │     │     │       ├── Edge: createEdge() with arrow mapping
  │     │     │       └── Group: recursive processing
  │     │     └── Build PageContents XML tree
  │     └── addImagesRels(zip, pageIndex)
  │
  ├── addPagesXML(zip, pages, layers, attrs)   // pages.xml + relationships
  └── JSZip.generateAsync({type: "blob"})      // → .vsdx download
```

---

## VSDX File Format (as understood by this code)

A VSDX file is a ZIP archive with this structure:

```
[Content_Types].xml              ← MIME type mappings
_rels/.rels                      ← Package relationships
docProps/
  app.xml                        ← Application metadata
  core.xml                       ← Document metadata (creator, dates)
  custom.xml                     ← Custom properties
visio/
  document.xml                   ← Root document: settings, colors, fonts, stylesheets
  document.xml.rels              ← Relationships to pages, masters, themes
  windows.xml                    ← Application window state
  pages/
    pages.xml                    ← Page listing with names, IDs, background refs
    pages.xml.rels               ← Relationships to individual page files
    page1.xml                    ← PageContents: shapes, connects
    page2.xml
    _rels/
      page1.xml.rels             ← Per-page relationships (images)
  masters/
    masters.xml                  ← Master shape listing
    master1.xml                  ← MasterContents: template shapes
    _rels/
      masters.xml.rels
  theme/
    theme1.xml                   ← OOXML color/font/effect theme
  media/
    image1.png                   ← Embedded images
    image2.jpg
```

---

## Coordinate System Conversion

| | VSDX | draw.io |
|---|------|---------|
| **Origin** | Bottom-left | Top-left |
| **Y direction** | Up (+) | Down (+) |
| **Units** | Inches (default) | Pixels |
| **Conversion** | `mxGraph_Y = pageHeight - vsdx_Y` | |
| **Scale factor** | `CONVERSION_FACTOR = 101.6` (40 × 2.54) | |

---

## Style Property Mapping

### Fill
| VSDX | draw.io |
|------|---------|
| FillForegnd | fillColor |
| FillBkgnd / FillGradient | gradientColor |
| FillForegndTrans | opacity |
| FillPattern (0) | fillColor=none |

### Line
| VSDX | draw.io |
|------|---------|
| LineColor | strokeColor |
| LineWeight | strokeWidth |
| LinePattern | dashed (+ dashPattern) |
| BeginArrow | startArrow |
| EndArrow | endArrow |
| BeginArrowSize / EndArrowSize | startSize / endSize |

### Text
| VSDX | draw.io |
|------|---------|
| Char.Font | fontFamily |
| Char.Size | fontSize |
| Char.Color | fontColor |
| Char.Style (bold bit) | bold=1 |
| Char.Style (italic bit) | italic=1 |
| Char.Style (underline bit) | underline=1 |
| Para.HorzAlign | align (left/center/right) |
| VerticalAlign | verticalAlign (top/middle/bottom) |

### Shape Type Detection (Import)
- **Vertex**: No BeginX/BeginY/EndX/EndY cells
- **Edge**: Has BeginX/BeginY/EndX/EndY cells
- **Group**: Has `<Shapes>` child element containing sub-shapes

---

## Theme System

VSDX uses OOXML themes with a QuickStyle overlay:

```
Shape cells:
  ThemeIndex          → Which color scheme (0-11)
  VariationColorIndex → Color variant
  VariationStyleIndex → Style variant
  QuickStyleFillColor → Theme fill color override
  QuickStyleFontColor → Theme font color override
  QuickStyleLineColor → Theme line color override

Theme provides:
  12 accent colors (accent1-6, dark1-2, light1-2, hyperlink, followed-hyperlink)
  Fill style definitions (NoFill, SolidFill, GradFill)
  Line style definitions
  Font definitions (major/minor)
```

Color resolution: `getThemeColor(index, tint, shade)` applies tint (lighten) or shade (darken) transformations to the base theme color.

---

## Master Shape Resolution

```
Instance shape in page
  ├── Master attribute → lookup mxVsdxMaster by ID
  │     └── Contains geometry, default style, connection points
  ├── MasterShape attribute → specific sub-shape within master
  └── Instance overrides master properties (cells override master cells)
```

Master shapes provide template geometry and styling. Instance shapes inherit from their master and can override individual properties.

---

## Dependencies

### Internal (draw.io)
- **mxGraph library**: mxAbstractCanvas2D, mxUtils, mxConstants, mxCell, mxGeometry, mxRectangle, mxPoint, mxCellState, mxCodec, mxEventSource
- **Graph class**: Extended mxGraph used by draw.io (for insertVertex, insertEdge, etc.)
- **EditorUi/App**: Application instance for file operations

### External Libraries
- **JSZip**: ZIP file creation and extraction
- **pako**: zlib compression/decompression (for compressed ForeignData in shapes)
- **DOMPurify**: HTML sanitization (optional, for text processing)

### Browser APIs
- Canvas 2D Context (import: BMP → JPEG, image cropping; export: SVG → PNG)
- XMLHttpRequest (export only: fetches image URLs to embed)
- DOMParser / mxUtils.parseXml (XML parsing)
- Typed Arrays (Uint8Array, Uint8ClampedArray, DataView)

---

## Known Limitations and Issues

### Import Limitations
- **Layer model mismatch**: VSDX layers are virtual groupings where parts of a group can belong to different layers. draw.io cannot represent this — layers are mapped to tags instead.
- **Shape-data attribute names are sanitized** (`mxVsdxCodec.sanitizeAttributeName`):
  Visio property labels are arbitrary text (`Input Voltage (V)`), but they become
  XML attribute names on the UserObject. Browsers' `setAttribute` accepts names
  that strict XML parsers reject (parentheses!), and one bad attribute used to
  make the WHOLE encoded model unparseable — library entries and pages silently
  came back empty (seen with VisioCafe Dell stencils). Names are reduced to an
  NCName subset; do not bypass the sanitizer when adding attributes. Non-ASCII
  letters are kept (`名前`, `Größe`), but only those of XML 1.0 4th edition
  (`Graph.xmlNameStartChars`/`xmlNameChars`, shared with the Edit Data dialog):
  Firefox parses with expat, which still
  rejects the characters that only the 5th edition allows (fullwidth letters,
  Khmer, CJK Extension A), and one such name fails the whole page there.
  Test: `features/P02`.
- **Colors from the file are validated** (`mxVsdxUtils.sanitizeColor`): cell
  values and the document color table (`ColorEntry RGB`) are concatenated into
  style strings and label markup, so a value like `#F00;shape=image` or
  `#000" onmouseover="…` used to add style keys, CSS or attributes. Only
  `#rgb`/`#rrggbb`/`#rrggbbaa` pass; anything else becomes the missing-value
  default. Read colors through `Style.getColor`/`getTextColor`/`getTextBkgndColor`
  (or `sanitizeColor`), never `getValue` directly. Theme colors are parsed into
  numbers and are safe. Tests: `security/X02`, `X10`, `X11`.
- **Font names and text direction are validated** (`mxVsdxUtils.sanitizeFontName`
  in `Style.getTextFont`, `getRtlText`, `getTextDirection`): the label HTML is
  built by concatenation (`<font style="…">` in `getTextCharFormated`,
  `<p style="…">` via `insertAttributes`), and `Graph.sanitizeHtml` keeps style
  attributes, so CSS injected there survives rendering (one cell's
  `position:fixed` covered the whole diagram). Font names may only contain
  letters, digits, space, `-_.,` and characters from U+00A0 up (localized
  names); anything else becomes `""`, which leaves the cell's default font.
  Direction is `rtl` for `1` and `ltr` for anything else. Every other value in
  these style attributes is a number or an enum; keep new ones that way.
  (`getRtlText` reads RTLText from the Paragraph section, although Visio writes
  it in Character rows.) Tests: `security/X01`, `X12`.
- **Text fields show Visio's display text** (`VsdxShape.getFieldText`): Visio
  writes the formatted text of each field (dates, units, percentages) as the
  `<fld>` element's content, while the Field row's Value holds the raw value
  (ISO date, inches, radians). The label uses the `<fld>` text, escaped like any
  text run (`processLblTxt`). The Field row is only a fallback
  (`getFieldValue`): for an empty `<fld>`, and for an instance that inherits the
  master's text but has its own Field row (that `<fld>` shows the master's
  value, Visio shows the instance's). Such a row only holds the overridden
  Value, so missing cells (Format) come from the master's row
  (`parseSection` keeps the raw cells in `fieldCells`). Only DATE values are
  formatted, as UTC (Visio dates have no time zone); numbers, strings and
  formats the fallback does not know (`esc(n)`, `{<n>}`) are shown raw.
  `initLabels`/`createHybridLabel` (non-HTML labels) have no callers.
  Tests: `features/E05`, `R02`.
- **Themes are keyed by their theme scheme ID** (`initThemes`,
  `mxVsdxModel.getThemeSchemeIndex`: `vt:themeScheme/vt:schemeID` in the
  theme's extension list), which is what a page's `ThemeIndex` refers to. The
  `themesIds` name table is only a fallback, registered as an alias where no
  theme has that ID: producers disagree on it (OfficeIMO's "Office" is 60, the
  table says 33). The color scheme's ID is not the theme's when a theme uses
  another theme's colors (Type-C-HW1: "Daybreak" 39 with "Parallel" colors
  40). Themes are still processed lazily, which the purity tie-break between
  two copies of a theme depends on. Tests: `external/officeimo/*`,
  `external/msdocs-windows-drivers/Type-C-HW1.png`, `ConnexC`.
- **Older themes ("Visio Theme Deprecated N") have no variation schemes**:
  their color scheme extension list has no `vt:variationClrSchemeLst`, and
  `processColors` reads the entries by element name (it used to require
  exactly three, so these themes lost their scheme ID and no page found its
  theme). `addDefaultVariants` then fills the missing variation colors
  (accent1-6, dk1) and styles (fill 2, line 1, effect 1, font 1), the values
  Visio's deprecated themes with lists use, so QuickStyle values 100-103 do
  not resolve to white. Tests: `features/I01`, `I02`, `Q01`, `Q03`.
- **Stencils that draw outside the shape's box are fitted** (`fitStencilCells` /
  `mxVsdxCodec.fitStencilBounds`, after `scaleGraph`): 1D block arrows have
  Height 0 and draw around their begin-end line, callout leaders leave the box,
  so the stencil drew outside its cell, where exports cropped it. The cell grows
  to the stencil's extent (curves and arcs sampled, degenerate arcs ignored) and
  the drawing, label area (spacing), connection points, the ends of edges
  glued to it (exitX/Y, entryX/Y: the edges exist by then) and children keep
  their positions, with flips and rotation. It runs after scaling because the spacing
  it adds is in final pixels. Cells whose own label ignores spacing
  (`overflow=width|fill`, `legacySpacing`) are skipped unless the box only grows
  evenly around a centered label. Tests: `libraries/arrows_u`, `basic_u`,
  `features/Q01` (Data shape: glued "retry" connector).
- **Rotated text blocks turn around TxtLocPin** (`createLabelSubShape`): Visio
  rotates the text block by `TxtAngle` around its pin, draw.io rotates the label
  cell around its center, so the label's center is placed where the rotation
  around the pin puts it (callouts pin the block at an edge). Visio never
  mirrors text: one flip (FlipX xor FlipY) mirrors the text angle, two flips
  cancel out, and the block's position is mirrored across the shape because
  draw.io does not mirror children with a flipped parent. The label of a group
  is added after `addGroup` has turned the members, so it is turned once (an
  off-centre label of a 30deg group was placed at 60deg). Tests:
  `features/F03`, `libraries/calout_u`, `eefund_u`,
  `external/msdocs-windows-drivers/device-descriptors` (side brackets),
  `external/stencils-open/c4model-visio` (Queue).
- **Edge labels of rotated or flipped 1D shapes use the shape transform**
  (`getLblEdgeOffset`): the text center goes through Pin, LocPin, Angle and
  the flips, relative to the begin point, because a rotated 1D shape turns its
  local frame (lines drawn at an angle, callouts with Angle 90 whose leader is
  the edge). Unrotated 1D shapes keep the old mapping (local frame starting at
  the begin point, box centered between the end points), which is exact for
  dynamic connectors and keeps their offsets unchanged. `addEdgeSublabel`
  only adds the edge rotation to labels without TxtAngle or vertical text:
  `createLabelSubShape` already includes it in theirs. Tests: `features/F03`
  (1D items), `C04` (diagonal line), `libraries/calout_u` (text callouts),
  `external/msdocs-windows-drivers/MALT`, `BlockDiagram`.
- **Routing points of rotated, flipped or reversed 1D shapes use the shape
  transform** (`getTransformedRoutingPoints`): every row goes through Pin,
  LocPin, Angle and the flips, relative to the begin point. The old path
  rotated each row but not the MoveTo it subtracted, and reassigned its
  rotation variable inside the loop, so only the first segment of a rotated
  multi-segment 1D shape was right. A path drawn from the end to the begin
  point (callout leaders) is reversed, so that its last point is the end point
  that the edge's target replaces and `getLblEdgeOffset` measures the label
  from the same path the edge draws. Unrotated forward paths keep the
  MoveTo-relative mapping (dynamic connectors). Tests: `stencils/connec_u`,
  `libraries/arrows_u` (Multi-Line), `libraries/calout_u`, `stencils/chart_u`,
  `external/msdocs-windows-drivers/MALT`, `Isoch-app`, `BlockDiagram`.
- **Holes: Visio fills with the even-odd rule, stencils with nonzero**
  (`mxVsdxCodec.evenOddPath`, called by `closePath` for filled paths): the
  filled geometry sections of a shape are written into one stencil path, so an
  inner section that turns the same way as the one around it was filled
  instead of being a hole (frames, donuts, the No symbol, embellishment
  borders). Subpaths are sampled (`mxVsdxCodec.sampleArc`, shared with
  `getStencilBounds`), nested by containment (bounding box, then 2 of 3 points
  inside), and a subpath that turns like its smallest container is reversed
  (curves swap their control points, arcs flip their sweep flag). Crossing
  subpaths are not emulated, and the work is capped (200 subpaths, 20000
  points). Tests: `features/A01` (Hole: 2 sections), `stencils/embell_u`,
  `libraries/calout_u`, `features/B01`.
- **A theme gradient fills a shape even with FillPattern 0**
  (`Style.isFillGradientEnabled`): Visio draws the gradient whenever
  FillGradientEnabled is TRUE, also when it comes from the theme (THEMEVAL in
  the Theme style sheet), whatever FillPattern says. FillGradientEnabled now
  inherits from the fill style sheets (`styleTypes`) and, like FillForegnd,
  keeps its themed value (`getCellElement` would otherwise read the literal 0
  of the No Style sheet below the Theme sheet); it is on when the theme's fill
  style for the shape is a gradient, except for themes whose variation styles
  are defaults (`defaultVariantStyles`, deprecated themes: Visio says FALSE).
  Such shapes get their solid theme fill; `getGradient` still only draws
  gradients set in the file, as theme gradient stops come out too strong
  (BTP-Drawings, azure-canadapubsec dropped 8-18 points with them). Verified
  per theme in Visio for `features/I01`. Tests: `features/Q08` (background
  frame, also shown on the foreground pages), `I01`, `I03`.
- **Custom line patterns are drawn thin** (`isCustomLinePattern`,
  `getLineWidth`): a LinePattern above the 23 built-in ones is `USE()` of a
  pattern master, whose drawing Visio repeats along the line at the size of
  the line weight (HVAC flexible ducts: two duct walls 24 in apart). draw.io
  has no such patterns, and a stroke that wide covered the page, so the width
  is capped at 1 (still dashed). Test: `stencils/hvacd_u`.
- **Members of flipped groups are mirrored** (`propagateFlip`,
  `isFlippedX`/`isFlippedY`): Visio applies a group's flips to its members,
  draw.io does not flip the children of a cell. Members take the absolute
  flips of their parent group, and their style gets their own flips combined
  with those. Under one flip a member turns the other way, so
  `propagateRotation` negates its own angle (Flip * Rotate(a) = Rotate(-a) *
  Flip). `addGroup` mirrors the vertex members inside the group's box before
  it turns them with the group, and `rotateChildEdge` mirrors, then turns edge
  points. Edge label offsets are mirrored and turned with them
  (`getGroupTransform`, `transformGroupVector`: `getLblEdgeOffset` measures the
  transformed points in the frame of the members, `addUnconnectedEdge`
  measures before the transform), otherwise a centred label on a connector in
  a FlipX group was offset by the connector's length, and the local text
  position was never turned with a rotated group (a centred label in a 180deg
  group was off by the connector's length too). Test: `features/C01` p2
  (connector in a 30deg group, no text). The text turns with the group as
  well: draw.io never turns an edge's own label (`mxPolyline.getRotation` is
  0), so a connector with text in a turned group gets a label sub-shape
  (`isTurnedLabel`; rotation noise such as 359.95deg keeps the edge label),
  and `addEdgeSublabel` adds the group's rotation to the sub-shape's angle,
  which one flip of the group mirrors first (Visio never mirrors text, as in
  `createLabelSubShape`). Tests: the last two items of `features/C04`
  (labelled connector in a 90deg group, TxtAngle in a FlipX + 30deg group).
  Glued ends: the importer
  computes exitX/Y and entryX/Y as fractions of the terminal's box on the page,
  but `getConnectionPoint` mirrors the constraint of a vertex with flipH/flipV,
  so `getGlueConstraintPoint` mirrors them for flipped terminals (members of
  flipped groups and shapes with their own flips); otherwise the connector
  ended on the other side of the shape. Test: `features/L01` (FlipX shape).
  `getOriginPoint` uses the own flips (the shape's transform inside its
  parent), `createLabelSubShape` the style's absolute flips. Tests:
  `features/F02` (Group FlipX, Group FlipY, Group FlipX + 45deg),
  `stencils/block3_u`, `blockp_u`, `hvacd_u` (elbow duct).
- **Shapes turn and flip around their pin** (`getOriginPoint`): Visio applies
  Angle and FlipX/FlipY around the pin (LocPin), draw.io around the center of
  the cell, so a shape whose LocPin is not its center is placed at the center
  that its own transform gives (center minus LocPin, flipped, then turned by
  Angle). The old formula was only right for LocPinX = Width/2 and ignored
  flips. It takes the shape's own Angle (`calcRotation`): `propagateRotation`
  adds the rotation of the parent group to `this.rotation`, and `addGroup`
  turns the members of a rotated group itself. Tests: `features/F01` (LocPin
  bottom-left, 45deg), `libraries/wall_u` (doors: flipped arcs, leaves turned
  around their hinge), `stencils/cyclediag_u`, `blockp_u`.
- **Group geometry is drawn in front of the members** (`addGroupGeometryInFront`):
  Visio's default group `DisplayMode` 2 draws a group's own geometry over its
  members (1 draws it behind), while draw.io draws a parent below its
  children. For DisplayMode 2 the group's drawing moves to a child with the
  ID `<group id>-geo`, added after the members and before the label; the group
  keeps its connection points, label and container role without fill and
  stroke. The derived ID keeps the IDs of the following cells unchanged.
  Tests: `features/G01` (ConvertToGroup item: the member is hidden),
  `libraries/sdcont_u` (Translucent: two 60% transparent layers),
  `stencils/sdcont_u`, `libraries/basic_u`.
- **Image crop detection uses an epsilon** (`getForm`, `cropEps = 1e-6`): stencil
  files carry FP noise (ImgHeight vs Height differing in the 13th decimal), and
  an exact compare used to send those into the async crop path. Cropping is
  canvas-based (SVG → JPEG), so a false-positive crop also degrades EMF-derived
  vector images. Zero/negative ImgWidth/ImgHeight must not crop (div by zero).
- **VSSX masters never get the async crop pass** (`postImportPage` runs for
  pages only): masters with genuinely cropped images get them appended
  UNCROPPED by `mxVssxCodec.applyUncroppedImages` instead — losing the crop but
  keeping the image. `vertexMap` is cleared per master in the VSSX loop so
  shape-ID lookups cannot match a previous master's cells.
- **MoveTo inside edge paths**: Not supported. Edge geometry assumes a single continuous path.
- **Connection constraint rotation**: Incomplete support for rotated connection points (fromPart/toPart).
- **Theme interpretation**: Gradient fills, effects, and variant styles are "best efforts" interpretations of the VSDX spec.
- **Edge groups**: Groups containing edges may produce suboptimal results — hard to detect edges that should be vertices when groups have children.
- **HTML text**: Complex HTML formatting is only partially preserved.
- **EMF images**: Converted client-side by `window.emfToSvg` (`../emf/emf-svg.js`, bundled in `extensions.min.js`). A conversion failure is logged and that image is dropped from `mediaData`, so unsupported EMF records mean a lost image, not a failed import.
- **Charset**: Full charset support is incomplete; UTF-16LE has a basic decoder, other encodings may fail.
- **Extremely large txtPinX/Y values**: Can cause browser hangs during import.
- **HTML `</li>` tag placement**: May appear after font/formatting tags instead of before them.

### Export Limitations
- **SVG shapes**: Converted to raster PNG rather than native Visio vector shapes.
- **Gradient fills**: Approximated as solid colors.
- **Image deduplication**: Not implemented — each image creates a separate media file.
- **Shape clipping**: Overflow handling may differ from mxGraph rendering.
- **Text position**: Approximate for rotated labels.
- **Connector arrows**: Limited arrow type mappings (see ARROWS_MAP).
- **Deep group nesting**: May cause geometry inaccuracies.
- **Image crop accuracy**: Minor width/height differences possible.

### BMP Decoder
- **RGB565 16-bit**: Not fully implemented.
- **RLE compression**: Not supported (uncompressed BMP only).
- **Orientation**: Assumes bottom-up (standard Windows BMP).

### Code Quality Notes
- `importer.js` is **JSweet-transpiled** from Java — patterns like `__extends`, verbose namespace nesting, and `_$LI$()` static initializers are transpiler artifacts.
- JSweet has a **field initialization ordering bug** where defaults execute before `super()` — workarounds exist in VsdxShape and Shape constructors.

---

## Key Data Structures (Import)

```javascript
// Vertex mapping: tracks created cells for edge connection
vertexMap = { ShapePageId(pageId, shapeId): mxCell }

// Edge shapes pending connection processing
edgeShapeMap = { ShapePageId(pageId, edgeId): VsdxShape }

// Original VSDX shape references
vertexShapeMap = { ShapePageId(pageId, shapeId): VsdxShape }

// Parent cells for edges in groups
parentsMap = { ShapePageId(pageId, edgeId): mxCell }

// Layer names indexed by position
layerNames = ["Layer1", "Layer2", ...]
```

---

## Key Data Structures (Export)

```javascript
// Cell ID → sequential VSDX shape ID mapping
idsMap = { "mxCellId": 1, "mxCellId2": 2, ... }
idsCounter = 1  // next available ID
```
