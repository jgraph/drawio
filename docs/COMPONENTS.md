# Component Reference

This document provides detailed information about the draw.io LLM integration components, their architecture, and internals.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    User Interface                        │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────┐
│              LLMCommunicationHandler                     │
│  - Intent detection                                      │
│  - Conversation management                               │
│  - Response generation                                   │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────┐
│                 LLMDiagramReader                         │
│  - XML parsing                                           │
│  - Element extraction                                    │
│  - Text conversion                                       │
└─────────────────────┬───────────────────────────────────┘
                      │
    ┌─────────────────┼─────────────────┐
    │                 │                 │
┌───▼───┐       ┌─────▼─────┐     ┌─────▼─────┐
│Export │       │ Validate  │     │Accessible │
│       │       │           │     │           │
└───────┘       └───────────┘     └───────────┘
```

## Component Details

---

## LLMDiagramReader

**Location:** `tests/llm-integration/src/LLMDiagramReader.js`

### Purpose
Core parsing engine that converts draw.io XML into structured data objects.

### Class Structure

```javascript
class LLMDiagramReader {
    constructor()
    parseDiagram(xmlString) → Object
    toTextDescription(diagram) → String
    getAllText(diagram) → String[]
    findByText(diagram, searchText) → Object[]
    getShapeType(style) → String

    // Private methods
    _extractDiagramName(doc) → String
    _extractPages(doc) → Object[]
    _extractCells(doc) → Object[]
    _extractConnections(doc) → Object[]
    _extractMetadata(doc) → Object
    _cleanHtml(html) → String
}
```

### Data Structures

#### Parsed Diagram Object
```javascript
{
    name: String,           // Diagram title
    pages: [{
        id: String,
        name: String
    }],
    cells: [{
        id: String,         // Unique identifier
        value: String,      // Label text (may contain HTML)
        style: String,      // Style properties
        vertex: Boolean,    // Is a shape?
        edge: Boolean,      // Is a connection?
        parent: String,     // Parent cell ID
        source: String,     // Source cell ID (for edges)
        target: String,     // Target cell ID (for edges)
        geometry: {
            x: Number,
            y: Number,
            width: Number,
            height: Number
        }
    }],
    connections: [{
        id: String,
        source: String,
        target: String,
        value: String
    }],
    metadata: {
        host: String,
        modified: String,
        agent: String,
        version: String,
        type: String
    }
}
```

### Internal Parsing Flow

1. **XML Parsing**: Use DOMParser to create document
2. **Validation**: Check for parser errors
3. **Extraction**: Query DOM for elements
4. **Transformation**: Convert to JavaScript objects
5. **Return**: Structured diagram object

### Style Parsing

The `getShapeType` method parses style strings:

```javascript
// Style string format
"shape=ellipse;fillColor=#d5e8d4;strokeColor=#82b366;"

// Parsing logic
if (style.match(/shape=([^;]+)/)) return matched[1];
if (style.includes('ellipse')) return 'ellipse';
if (style.includes('rhombus')) return 'diamond';
// etc.
```

---

## LLMCommunicationHandler

**Location:** `tests/llm-integration/src/LLMCommunicationHandler.js`

### Purpose
Manages conversations between users and the system about diagrams.

### Class Structure

```javascript
class LLMCommunicationHandler {
    constructor(diagramReader)
    loadDiagram(xmlString) → Object
    processUserMessage(message) → Object
    getConversationHistory() → Array
    clearHistory()
    hasDiagram() → Boolean
    getDiagramXml() → String|null

    // Private methods
    _analyzeIntent(message) → String
    _generateResponse(intent, message) → Object
    _handleGreeting() → Object
    _handleHelp() → Object
    _handleDescribe() → Object
    _handleListShapes() → Object
    _handleFindShape(message) → Object
    _handleCount() → Object
    _handleConnections() → Object
    _handleGeneral(message) → Object
    _getDiagramContext() → Object
}
```

### Intent Detection System

Intent patterns are matched in priority order:

```javascript
const intentPatterns = [
    ['greeting', /^(hello|hi|hey|good morning)/i],
    ['help', /\b(help|how do i|can you help)\b/i],
    ['countElements', /\b(how many|count|number of)\b/i],
    ['connections', /\b(connect\w*|link\w*|relat\w*)\b/i],
    ['findShape', /\b(find|where is|locate)\b/i],
    ['describe', /\b(describe|explain|what is)\b/i],
    ['listShapes', /\b(list|show all|all shapes)\b/i]
];
```

**Order matters!** More specific patterns must come before general ones.

### Conversation State

```javascript
{
    conversationHistory: [{
        role: 'user' | 'assistant',
        content: String,
        timestamp: String (ISO 8601)
    }],
    currentDiagram: Object | null,
    currentDiagramXml: String | null
}
```

### Response Structure

```javascript
{
    success: Boolean,
    intent: String,
    response: {
        message: String,
        type: String,
        data: Any (optional)
    },
    diagramContext: {
        loaded: Boolean,
        name: String,
        summary: String,
        shapes: Number,
        connections: Number,
        allText: String[]
    }
}
```

---

## DiagramExporter

**Location:** `tests/llm-integration/src/DiagramExporter.js`

### Purpose
Export diagrams to various formats for sharing and embedding.

### Class Structure

```javascript
class DiagramExporter {
    constructor(diagramReader)
    exportToJSON(xmlString) → Object
    exportToSVG(xmlString, options) → Object
    exportToPNG(xmlString, options) → Object
    generateEmbedCode(xmlString, options) → Object
    exportStatistics(xmlString) → Object

    // Private methods
    _calculateBounds(shapes) → Object
    _extractColor(style, colorType) → String|null
    _generateSVGShape(shape, shapeType, fill, stroke, label) → String
    _generateSVGConnection(source, target, conn) → String
    _calculateComplexity(diagram) → Number
    _getComplexityLevel(score) → String
}
```

### Export Formats

#### JSON Export
```javascript
{
    format: 'json',
    version: '1.0',
    exported: ISO8601_timestamp,
    diagram: {
        name: String,
        pages: Array,
        shapes: [{
            id, label, type, position, size, style
        }],
        connections: [{
            id, from, to, label
        }],
        metadata: Object
    }
}
```

#### SVG Export
```javascript
{
    format: 'svg',
    content: String (SVG XML),
    width: Number,
    height: Number,
    shapeCount: Number,
    connectionCount: Number
}
```

### Complexity Scoring

```javascript
// Formula
score = (shapes * 1) + (connections * 1.5) + (pages * 5)

// Levels
'simple'       // < 10
'moderate'     // 10-29
'complex'      // 30-59
'very complex' // >= 60
```

---

## DiagramValidator

**Location:** `tests/llm-integration/src/DiagramValidator.js`

### Purpose
Validate diagram structure, connections, and quality.

### Class Structure

```javascript
class DiagramValidator {
    constructor(diagramReader)
    validate(xmlString) → Object
    isValid(xmlString) → Boolean
    getSummary(xmlString) → Object

    // Private methods
    _validateStructure(diagram, results)
    _validateConnections(diagram, results)
    _validateLabels(diagram, results)
    _validateStyles(diagram, results)
    _validateAccessibility(diagram, results)
    _extractColor(style, colorType) → String|null
    _hasGoodContrast(bg, fg) → Boolean
}
```

### Validation Results

```javascript
{
    valid: Boolean,
    errors: [{
        code: String,
        message: String,
        severity: 'critical' | 'high' | 'medium' | 'low',
        details: Any (optional)
    }],
    warnings: [/* same structure */],
    info: [/* same structure */]
}
```

### Validation Checks

| Check | Category | Severity |
|-------|----------|----------|
| XML parsing | Structure | critical |
| No pages | Structure | high |
| Duplicate IDs | Structure | high |
| Missing name | Structure | low |
| Empty diagram | Structure | medium |
| Broken connections | Connections | high |
| Self-referencing | Connections | low |
| Duplicate connections | Connections | low |
| Unlabeled shapes | Labels | medium |
| Long labels | Labels | low |
| Duplicate labels | Labels | info |
| Missing styles | Styles | info |
| Color variety | Styles | info |
| Small shapes | Accessibility | medium |
| Low contrast | Accessibility | medium |

---

## AccessibilityChecker

**Location:** `tests/llm-integration/src/AccessibilityChecker.js`

### Purpose
Check WCAG accessibility compliance and generate recommendations.

### Class Structure

```javascript
class AccessibilityChecker {
    constructor(diagramReader)
    check(xmlString) → Object
    generateAltText(xmlString) → String
    getQuickScore(xmlString) → Object

    // Private methods
    _checkAltText(diagram, results)
    _checkColorContrast(diagram, results)
    _checkTextSize(diagram, results)
    _checkKeyboardNavigation(diagram, results)
    _checkStructure(diagram, results)
    _checkLabels(diagram, results)
    _extractColor(style, colorType) → String|null
    _extractFontSize(style) → Number|null
    _calculateContrastRatio(bg, fg) → Number
    _getLuminance(color) → Number
    _getAccessibilityLevel(score) → String
}
```

### Accessibility Check Results

```javascript
{
    score: Number (0-100),
    maxScore: 100,
    level: 'AAA' | 'AA' | 'A' | 'Non-compliant',
    checks: [{
        name: String,
        passed: Boolean,
        score: Number (optional),
        message: String,
        wcag: String (WCAG reference),
        details: Any (optional)
    }],
    recommendations: [{
        priority: 'high' | 'medium' | 'low',
        message: String,
        affectedCount: Number
    }]
}
```

### WCAG Compliance

| Level | Score Range | Description |
|-------|-------------|-------------|
| AAA | 90-100 | Highest compliance |
| AA | 70-89 | Standard compliance |
| A | 50-69 | Basic compliance |
| Non-compliant | 0-49 | Needs improvement |

### Contrast Calculation

Uses WCAG 2.1 relative luminance formula:

```javascript
// Convert hex to relative luminance
_getLuminance(color) {
    // Parse RGB values
    // Apply sRGB transformation
    // Return: 0.2126*R + 0.7152*G + 0.0722*B
}

// Calculate contrast ratio
_calculateContrastRatio(bg, fg) {
    const bgLum = this._getLuminance(bg);
    const fgLum = this._getLuminance(fg);
    return (lighter + 0.05) / (darker + 0.05);
}

// WCAG requirements:
// - Normal text: 4.5:1 minimum
// - Large text: 3:1 minimum
```

---

## Dependencies

### Runtime Dependencies

- **DOMParser**: Browser/JSDOM XML parsing
- **XMLSerializer**: XML serialization

### Test Dependencies

- **Jest**: Test framework
- **jest-environment-jsdom**: DOM simulation

## Performance Considerations

1. **Parsing**: O(n) where n is number of XML elements
2. **Text search**: O(n*m) where m is search text length
3. **SVG generation**: O(n) shapes + O(c) connections
4. **Validation**: Multiple passes, O(n) each

### Optimization Tips

- Cache parsed diagrams for repeated operations
- Use incremental updates when possible
- Limit search scope when known

## Error Handling

All components follow consistent error handling:

```javascript
// Input validation
if (!xmlString || typeof xmlString !== 'string') {
    throw new Error('Invalid input: must be non-empty string');
}

// Parser errors
const parserError = doc.querySelector('parsererror');
if (parserError) {
    throw new Error('XML parsing error: ' + parserError.textContent);
}

// Graceful degradation
try {
    // Risky operation
} catch (e) {
    // Return default/fallback value
    return defaultValue;
}
```

## Extending Components

### Adding New Export Format

```javascript
// In DiagramExporter
exportToMarkdown(xmlString) {
    const diagram = this.diagramReader.parseDiagram(xmlString);

    let md = `# ${diagram.name}\n\n`;
    md += `## Shapes\n`;
    // ... generate markdown

    return {
        format: 'markdown',
        content: md
    };
}
```

### Adding New Validation

```javascript
// In DiagramValidator
_validateCustomRule(diagram, results) {
    // Your validation logic
    if (conditionFails) {
        results.warnings.push({
            code: 'CUSTOM_RULE',
            message: 'Description',
            severity: 'medium'
        });
    }
}

// Call in validate()
this._validateCustomRule(diagram, results);
```

### Adding New Intent

```javascript
// In LLMCommunicationHandler._analyzeIntent
['newIntent', /\b(pattern|keywords)\b/i],

// Add handler method
_handleNewIntent(message) {
    return {
        message: 'Response for new intent',
        type: 'newIntent'
    };
}

// Add to _generateResponse switch
case 'newIntent':
    return this._handleNewIntent(message);
```
