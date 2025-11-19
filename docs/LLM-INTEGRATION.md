# LLM Integration API Documentation

This document describes how to use the LLM integration components to enable AI systems to understand and interact with draw.io diagrams.

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [LLMDiagramReader](#llmdiagramreader)
- [LLMCommunicationHandler](#llmcommunicationhandler)
- [DiagramExporter](#diagramexporter)
- [DiagramValidator](#diagramvalidator)
- [AccessibilityChecker](#accessibilitychecker)
- [Use Cases](#use-cases)

## Overview

The LLM integration layer provides a bridge between draw.io's XML-based diagram format and AI/LLM systems. It enables:

- **Parsing**: Extract structured data from diagram XML
- **Understanding**: Convert diagrams to natural language descriptions
- **Communication**: Handle user questions about diagrams
- **Export**: Generate multiple output formats
- **Validation**: Check diagram quality and accessibility

## Installation

```bash
cd tests/llm-integration
npm install
```

## Quick Start

```javascript
const { LLMDiagramReader } = require('./src/LLMDiagramReader');
const { LLMCommunicationHandler } = require('./src/LLMCommunicationHandler');

// Create instances
const reader = new LLMDiagramReader();
const handler = new LLMCommunicationHandler(reader);

// Load diagram
const result = handler.loadDiagram(diagramXml);
console.log(result.summary);
// { name: 'My Diagram', pages: 1, shapes: 5, connections: 4 }

// Ask questions
const response = handler.processUserMessage('What shapes are in this diagram?');
console.log(response.response.message);
```

---

## LLMDiagramReader

Parses draw.io XML and extracts diagram elements.

### Constructor

```javascript
const reader = new LLMDiagramReader();
```

### Methods

#### `parseDiagram(xmlString)`

Parse a draw.io diagram from XML.

**Parameters:**
- `xmlString` (string): The draw.io XML content

**Returns:** Parsed diagram object

```javascript
const diagram = reader.parseDiagram(xmlString);

// Returns:
{
  name: 'Diagram Name',
  pages: [{ id: 'page-1', name: 'Page 1' }],
  cells: [
    {
      id: 'cell-1',
      value: 'Shape Label',
      style: 'rounded=1;...',
      vertex: true,
      edge: false,
      geometry: { x: 100, y: 50, width: 120, height: 60 }
    }
  ],
  connections: [
    {
      id: 'edge-1',
      source: 'cell-1',
      target: 'cell-2',
      value: 'Connection Label'
    }
  ],
  metadata: {
    host: 'app.diagrams.net',
    version: '22.1.0'
  }
}
```

#### `toTextDescription(diagram)`

Convert diagram to human-readable text.

**Parameters:**
- `diagram` (object): Parsed diagram object

**Returns:** String description

```javascript
const description = reader.toTextDescription(diagram);

// Returns:
// "Diagram: My Flowchart
// Pages: 1
//
// Shapes:
//   - "Start" (ID: start-1)
//   - "Process" (ID: process-1)
//
// Connections:
//   - "Start" -> "Process""
```

#### `getAllText(diagram)`

Extract all text content from diagram.

**Parameters:**
- `diagram` (object): Parsed diagram object

**Returns:** Array of strings

```javascript
const texts = reader.getAllText(diagram);
// ['Start', 'Process', 'End']
```

#### `findByText(diagram, searchText)`

Find shapes containing specific text.

**Parameters:**
- `diagram` (object): Parsed diagram object
- `searchText` (string): Text to search for

**Returns:** Array of matching cells

```javascript
const results = reader.findByText(diagram, 'Process');
// Returns cells with "Process" in their value
```

#### `getShapeType(style)`

Determine shape type from style string.

**Parameters:**
- `style` (string): Cell style string

**Returns:** Shape type string

```javascript
const type = reader.getShapeType('ellipse;whiteSpace=wrap;');
// 'ellipse'
```

---

## LLMCommunicationHandler

Handles user conversations about diagrams.

### Constructor

```javascript
const handler = new LLMCommunicationHandler(diagramReader);
```

### Methods

#### `loadDiagram(xmlString)`

Load a diagram into the conversation context.

**Parameters:**
- `xmlString` (string): The draw.io XML content

**Returns:** Load result object

```javascript
const result = handler.loadDiagram(xmlString);

// Returns:
{
  success: true,
  message: 'Diagram "My Diagram" loaded successfully',
  summary: {
    name: 'My Diagram',
    pages: 1,
    shapes: 5,
    connections: 4
  }
}
```

#### `processUserMessage(message)`

Process a user message and generate response.

**Parameters:**
- `message` (string): User's message

**Returns:** Response object with intent and context

```javascript
const response = handler.processUserMessage('Describe this diagram');

// Returns:
{
  success: true,
  intent: 'describe',
  response: {
    message: 'Diagram: My Flowchart...',
    type: 'description'
  },
  diagramContext: {
    loaded: true,
    name: 'My Flowchart',
    shapes: 5,
    connections: 4
  }
}
```

### Supported Intents

| Intent | Example Messages | Response Type |
|--------|-----------------|---------------|
| `greeting` | "Hello", "Hi there" | Welcome message |
| `help` | "Help me", "What can you do?" | Feature list |
| `describe` | "Describe this", "What is this diagram?" | Full description |
| `listShapes` | "List all shapes", "Show elements" | Shape list |
| `findShape` | "Find 'Login'", "Where is the database?" | Search results |
| `countElements` | "How many shapes?", "Count connections" | Element counts |
| `connections` | "Show connections", "How are they related?" | Connection list |

#### `getConversationHistory()`

Get the full conversation history.

**Returns:** Array of messages

```javascript
const history = handler.getConversationHistory();
// [{ role: 'user', content: '...', timestamp: '...' }, ...]
```

#### `clearHistory()`

Clear conversation history.

```javascript
handler.clearHistory();
```

#### `hasDiagram()`

Check if a diagram is loaded.

**Returns:** Boolean

```javascript
if (handler.hasDiagram()) {
  // Process diagram-related queries
}
```

---

## DiagramExporter

Export diagrams to various formats.

### Constructor

```javascript
const { DiagramExporter } = require('./src/DiagramExporter');
const exporter = new DiagramExporter(diagramReader);
```

### Methods

#### `exportToJSON(xmlString)`

Export to JSON format.

```javascript
const json = exporter.exportToJSON(xmlString);

// Returns:
{
  format: 'json',
  version: '1.0',
  exported: '2024-01-15T10:30:00.000Z',
  diagram: {
    name: 'My Diagram',
    shapes: [...],
    connections: [...],
    metadata: {...}
  }
}
```

#### `exportToSVG(xmlString, options)`

Export to SVG format.

**Options:**
- `padding` (number): Padding around diagram (default: 20)

```javascript
const svg = exporter.exportToSVG(xmlString, { padding: 30 });

// Returns:
{
  format: 'svg',
  content: '<?xml version="1.0"?>...',
  width: 500,
  height: 400,
  shapeCount: 5,
  connectionCount: 4
}
```

#### `exportToPNG(xmlString, options)`

Export to PNG format (metadata only - actual rendering requires canvas).

**Options:**
- `width` (number): Output width
- `height` (number): Output height
- `scale` (number): Scale factor
- `background` (string): Background color

```javascript
const png = exporter.exportToPNG(xmlString, {
  width: 1200,
  height: 800,
  scale: 2,
  background: '#ffffff'
});
```

#### `generateEmbedCode(xmlString, options)`

Generate HTML embed code.

**Options:**
- `width` (number): Embed width (default: 800)
- `height` (number): Embed height (default: 600)

```javascript
const embed = exporter.generateEmbedCode(xmlString, {
  width: 1000,
  height: 700
});

// Returns:
{
  diagramName: 'My Diagram',
  embedTypes: {
    iframe: '<iframe src="...">...</iframe>',
    div: '<div class="mxgraph">...</div>'
  },
  dimensions: { width: 1000, height: 700 }
}
```

#### `exportStatistics(xmlString)`

Export diagram statistics.

```javascript
const stats = exporter.exportStatistics(xmlString);

// Returns:
{
  name: 'My Diagram',
  pages: 1,
  totalShapes: 5,
  labeledShapes: 5,
  connections: 4,
  shapeTypes: { ellipse: 2, rectangle: 3 },
  complexity: {
    score: 16,
    level: 'moderate'
  }
}
```

---

## DiagramValidator

Validate diagram structure and quality.

### Constructor

```javascript
const { DiagramValidator } = require('./src/DiagramValidator');
const validator = new DiagramValidator(diagramReader);
```

### Methods

#### `validate(xmlString)`

Perform full validation.

```javascript
const results = validator.validate(xmlString);

// Returns:
{
  valid: true,
  errors: [],
  warnings: [
    {
      code: 'UNLABELED_SHAPES',
      message: 'Found 2 shape(s) without labels',
      severity: 'medium',
      details: ['shape-1', 'shape-2']
    }
  ],
  info: []
}
```

### Validation Codes

| Code | Severity | Description |
|------|----------|-------------|
| `PARSE_ERROR` | critical | XML parsing failed |
| `NO_PAGES` | high | Diagram has no pages |
| `DUPLICATE_IDS` | high | Duplicate cell IDs |
| `BROKEN_CONNECTIONS` | high | Connections to missing cells |
| `MISSING_NAME` | low | No diagram name |
| `EMPTY_DIAGRAM` | medium | No labeled shapes |
| `UNLABELED_SHAPES` | medium | Shapes without labels |
| `SELF_REFERENCING` | low | Connection to itself |
| `LONG_LABEL` | low | Label over 100 chars |
| `SMALL_SHAPES` | medium | Shapes under 20x20px |

#### `isValid(xmlString)`

Quick validity check.

```javascript
if (validator.isValid(xmlString)) {
  // Diagram is valid
}
```

#### `getSummary(xmlString)`

Get validation summary.

```javascript
const summary = validator.getSummary(xmlString);

// Returns:
{
  valid: true,
  errorCount: 0,
  warningCount: 2,
  infoCount: 1,
  criticalErrors: 0,
  highErrors: 0
}
```

---

## AccessibilityChecker

Check WCAG accessibility compliance.

### Constructor

```javascript
const { AccessibilityChecker } = require('./src/AccessibilityChecker');
const checker = new AccessibilityChecker(diagramReader);
```

### Methods

#### `check(xmlString)`

Perform accessibility check.

```javascript
const results = checker.check(xmlString);

// Returns:
{
  score: 85,
  maxScore: 100,
  level: 'AA',
  checks: [
    {
      name: 'Alt Text Coverage',
      passed: true,
      score: 100,
      message: '100% of shapes have text labels',
      wcag: '1.1.1'
    },
    {
      name: 'Color Contrast',
      passed: false,
      score: 80,
      message: '2 shape(s) have low color contrast',
      wcag: '1.4.3'
    }
  ],
  recommendations: [
    {
      priority: 'high',
      message: 'Increase color contrast to at least 4.5:1',
      affectedCount: 2
    }
  ]
}
```

### WCAG Checks

| Check | WCAG | Description |
|-------|------|-------------|
| Alt Text Coverage | 1.1.1 | Labels on shapes |
| Diagram Description | 1.1.1 | Overall description |
| Color Contrast | 1.4.3 | 4.5:1 contrast ratio |
| Text Size | 1.4.4 | Minimum 12px font |
| Navigation Structure | 2.4.3 | Logical flow |
| Touch Target Size | 2.5.5 | Minimum 44x44px |
| Label Quality | 2.4.6 | Descriptive labels |
| Unique Labels | 2.4.6 | No duplicates |

#### `generateAltText(xmlString)`

Generate accessible description.

```javascript
const altText = checker.generateAltText(xmlString);

// Returns:
// "Diagram: My Flowchart. Contains 5 shapes and 4 connections.
//  Elements include: Start, Process, Decision, End.
//  The diagram shows 4 relationships between elements."
```

#### `getQuickScore(xmlString)`

Get quick accessibility score.

```javascript
const score = checker.getQuickScore(xmlString);

// Returns:
{
  score: 85,
  level: 'AA',
  passedChecks: 7,
  totalChecks: 8,
  topRecommendation: {
    priority: 'high',
    message: 'Increase color contrast...'
  }
}
```

### Accessibility Levels

| Score | Level | Description |
|-------|-------|-------------|
| 90-100 | AAA | Highest accessibility |
| 70-89 | AA | Standard compliance |
| 50-69 | A | Basic compliance |
| 0-49 | Non-compliant | Needs improvement |

---

## Use Cases

### 1. AI Chatbot Integration

```javascript
// User asks about their diagram
const userQuestion = "What are the main components?";
const response = handler.processUserMessage(userQuestion);

// Send response to user
chatbot.reply(response.response.message);
```

### 2. Automated Documentation

```javascript
// Generate documentation from diagram
const diagram = reader.parseDiagram(xmlString);
const description = reader.toTextDescription(diagram);
const stats = exporter.exportStatistics(xmlString);

// Create documentation
const doc = `
# ${diagram.name}

${description}

## Statistics
- Shapes: ${stats.totalShapes}
- Connections: ${stats.connections}
- Complexity: ${stats.complexity.level}
`;
```

### 3. Accessibility Report

```javascript
// Generate accessibility report
const results = checker.check(xmlString);

console.log(`Accessibility Score: ${results.score}/100 (${results.level})`);
console.log('Issues to fix:');
results.recommendations.forEach(rec => {
  console.log(`- [${rec.priority}] ${rec.message}`);
});
```

### 4. Diagram Validation Pipeline

```javascript
// Validate before saving
const validation = validator.validate(xmlString);

if (!validation.valid) {
  throw new Error(`Diagram has errors: ${validation.errors[0].message}`);
}

if (validation.warnings.length > 0) {
  console.warn(`Warnings: ${validation.warnings.length}`);
}
```

### 5. Multi-Format Export

```javascript
// Export to all formats
const json = exporter.exportToJSON(xmlString);
const svg = exporter.exportToSVG(xmlString);
const embed = exporter.generateEmbedCode(xmlString);

// Save files
fs.writeFileSync('diagram.json', JSON.stringify(json, null, 2));
fs.writeFileSync('diagram.svg', svg.content);
fs.writeFileSync('embed.html', embed.embedTypes.div);
```

---

## Error Handling

All methods throw errors for invalid input:

```javascript
try {
  const diagram = reader.parseDiagram(invalidXml);
} catch (error) {
  if (error.message.includes('XML parsing error')) {
    // Handle parsing error
  }
}
```

## Performance Considerations

- Diagrams are parsed on each call - cache results for repeated operations
- Large diagrams (>1000 shapes) may take longer to process
- SVG generation is computationally intensive

## Next Steps

- [Testing Guide](TESTING.md) - How to run and write tests
- [Component Reference](COMPONENTS.md) - Detailed component internals
- [Contributing](CONTRIBUTING.md) - How to contribute
