# VSDX Import/Export Module

## Overview

This folder implements complete **VSDX (Microsoft Visio 2013+ XML)** file format support for draw.io. VSDX files are ZIP archives containing XML documents following the Open Packaging Conventions (OPC) standard.

**4 files, ~893 KB total, ~15,600 lines of code.**

| File | Lines | Size | Purpose |
|------|-------|------|---------|
| `importer.js` | 13,208 | 782 KB | VSDX/VSSX → draw.io import (JSweet-generated from Java) |
| `VsdxExport.js` | 993 | 73 KB | draw.io → VSDX export |
| `mxVsdxCanvas2D.js` | 1,153 | 30 KB | Canvas adapter capturing shape rendering as VSDX geometry |
| `bmpDecoder.js` | 287 | 9 KB | BMP image format decoder for embedded images |

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
│                   │     ├── EMF → PNG (server-side)    │
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
| `image(x, y, w, h, src, aspect, flipH, flipV)` | `(number × 4, string, boolean × 3)` | Embed image: handles SVG→PNG, BMP→PNG conversion |
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
- Canvas 2D Context (SVG → PNG rendering)
- XMLHttpRequest (image fetching, EMF conversion)
- DOMParser / mxUtils.parseXml (XML parsing)
- FileReader (Blob → base64 for EMF conversion)
- Typed Arrays (Uint8Array, Uint8ClampedArray, DataView)

---

## Known Limitations and Issues

### Import Limitations
- **Layer model mismatch**: VSDX layers are virtual groupings where parts of a group can belong to different layers. draw.io cannot represent this — layers are mapped to tags instead.
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
