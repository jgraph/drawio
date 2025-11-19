# Testing Guide

This guide covers how to run, write, and understand the draw.io LLM integration test suite.

## Table of Contents

- [Quick Start](#quick-start)
- [Test Structure](#test-structure)
- [Running Tests](#running-tests)
- [Test Suites](#test-suites)
- [Writing Tests](#writing-tests)
- [Test Fixtures](#test-fixtures)
- [Coverage](#coverage)
- [Continuous Integration](#continuous-integration)

## Quick Start

```bash
# Navigate to test directory
cd tests/llm-integration

# Install dependencies
npm install

# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test -- LLMDiagramReader.test.js

# Watch mode
npm test -- --watch
```

## Test Structure

```
tests/llm-integration/
├── package.json              # Test dependencies and scripts
├── setup.js                  # Jest setup file
├── fixtures/
│   └── sample-diagrams.js    # Test diagram fixtures
├── src/
│   ├── LLMDiagramReader.js
│   ├── LLMCommunicationHandler.js
│   ├── DiagramExporter.js
│   ├── DiagramValidator.js
│   └── AccessibilityChecker.js
├── LLMDiagramReader.test.js
├── LLMCommunicationHandler.test.js
├── DiagramExporter.test.js
├── DiagramValidator.test.js
└── AccessibilityChecker.test.js
```

## Running Tests

### All Tests

```bash
npm test
```

### With Verbose Output

```bash
npm test -- --verbose
```

### Single Test File

```bash
npm test -- LLMDiagramReader.test.js
```

### Specific Test

```bash
npm test -- -t "should parse a valid simple flowchart"
```

### Watch Mode

Automatically re-runs tests when files change:

```bash
npm test -- --watch
```

### Using Docker

```bash
# From project root
docker-compose --profile test run drawio-tests
```

Or using the Windows script:

```batch
docker\scripts\test.bat
```

## Test Suites

### LLMDiagramReader.test.js (32 tests)

Tests diagram parsing and data extraction.

**Categories:**
- `parseDiagram` - XML parsing, cell extraction, connections
- `toTextDescription` - Natural language generation
- `getAllText` - Text content extraction
- `findByText` - Shape searching
- `getShapeType` - Style parsing
- `Connection Analysis` - Edge validation

**Example:**
```javascript
test('should parse a valid simple flowchart diagram', () => {
    const diagram = reader.parseDiagram(sampleDiagrams.simpleFlowchart);

    expect(diagram).toBeDefined();
    expect(diagram.name).toBe('Simple Flowchart');
    expect(diagram.pages).toHaveLength(1);
});
```

### LLMCommunicationHandler.test.js (48 tests)

Tests user communication and intent detection.

**Categories:**
- `loadDiagram` - Diagram loading and state
- `Greetings` - Hello messages
- `Help` - Help requests
- `Describe Diagram` - Description generation
- `List Shapes` - Shape enumeration
- `Find Shape` - Shape searching
- `Count Elements` - Counting
- `Connections` - Relationship queries
- `Error Handling` - Invalid inputs
- `Conversation History` - History tracking
- `Complex Scenarios` - Multi-turn conversations

**Example:**
```javascript
test('should recognize various greeting formats', () => {
    const greetings = ['Hello', 'Hi', 'Hey', 'Good morning'];

    greetings.forEach(greeting => {
        const result = handler.processUserMessage(greeting);
        expect(result.intent).toBe('greeting');
    });
});
```

### DiagramExporter.test.js (43 tests)

Tests export functionality.

**Categories:**
- `exportToJSON` - JSON format export
- `exportToSVG` - SVG generation
- `exportToPNG` - PNG metadata
- `generateEmbedCode` - HTML embed code
- `exportStatistics` - Diagram stats
- `Edge Cases` - Empty diagrams, special characters

**Example:**
```javascript
test('should include shape positions and sizes', () => {
    const result = exporter.exportToJSON(sampleDiagrams.simpleFlowchart);

    const startShape = result.diagram.shapes.find(s => s.label === 'Start');
    expect(startShape.position.x).toBe(200);
    expect(startShape.size.width).toBe(100);
});
```

### DiagramValidator.test.js (30 tests)

Tests validation and error detection.

**Categories:**
- `validate` - Full validation
- `Structure Validation` - Pages, names, IDs
- `Connection Validation` - Broken connections
- `Label Validation` - Missing/duplicate labels
- `Style Validation` - Color consistency
- `Accessibility Validation` - Size and contrast
- `isValid` - Quick check
- `getSummary` - Summary counts

**Example:**
```javascript
test('should detect invalid XML', () => {
    const results = validator.validate(sampleDiagrams.invalidXml);

    expect(results.valid).toBe(false);
    expect(results.errors[0].code).toBe('PARSE_ERROR');
});
```

### AccessibilityChecker.test.js (26 tests)

Tests WCAG accessibility compliance.

**Categories:**
- `check` - Full accessibility check
- `Alt Text Checks` - Label coverage
- `Color Contrast Checks` - Contrast ratios
- `Text Size Checks` - Font sizes
- `Navigation Structure` - Logical flow
- `Visual Consistency` - Size uniformity
- `Label Quality` - Descriptive labels
- `generateAltText` - Alt text generation
- `getQuickScore` - Score summary

**Example:**
```javascript
test('should return score between 0 and 100', () => {
    const results = checker.check(sampleDiagrams.simpleFlowchart);

    expect(results.score).toBeGreaterThanOrEqual(0);
    expect(results.score).toBeLessThanOrEqual(100);
});
```

## Writing Tests

### Test File Template

```javascript
const { ComponentName } = require('./src/ComponentName');
const { LLMDiagramReader } = require('./src/LLMDiagramReader');
const { sampleDiagrams } = require('./fixtures/sample-diagrams');

describe('ComponentName', () => {
    let reader;
    let component;

    beforeEach(() => {
        reader = new LLMDiagramReader();
        component = new ComponentName(reader);
    });

    describe('methodName', () => {
        test('should do something specific', () => {
            const result = component.methodName(sampleDiagrams.simpleFlowchart);

            expect(result).toBeDefined();
            expect(result.property).toBe('expected value');
        });

        test('should handle edge case', () => {
            expect(() => {
                component.methodName(null);
            }).toThrow();
        });
    });
});
```

### Best Practices

1. **Descriptive test names**: Use `should...` format
2. **One assertion focus**: Each test should verify one thing
3. **Use fixtures**: Don't duplicate diagram XML
4. **Test edge cases**: Null, empty, invalid inputs
5. **Clean setup**: Use `beforeEach` for fresh instances

### Common Assertions

```javascript
// Equality
expect(value).toBe(expected);
expect(value).toEqual(expected);

// Truthiness
expect(value).toBeTruthy();
expect(value).toBeFalsy();
expect(value).toBeDefined();
expect(value).toBeNull();

// Numbers
expect(value).toBeGreaterThan(5);
expect(value).toBeLessThanOrEqual(10);

// Strings
expect(string).toContain('substring');
expect(string).toMatch(/regex/);

// Arrays
expect(array).toHaveLength(3);
expect(array).toContain(item);

// Objects
expect(obj).toHaveProperty('key');
expect(obj).toHaveProperty('key', 'value');

// Errors
expect(() => fn()).toThrow();
expect(() => fn()).toThrow('error message');
```

## Test Fixtures

### Available Diagrams

Located in `fixtures/sample-diagrams.js`:

| Fixture | Description | Shapes | Connections |
|---------|-------------|--------|-------------|
| `simpleFlowchart` | Basic flowchart with decision | 5 | 4 |
| `networkArchitecture` | Network topology | 5 | 5 |
| `multiPage` | Two-page diagram | 3 | 1 |
| `emptyDiagram` | No shapes | 0 | 0 |
| `htmlFormattedText` | HTML in labels | 2 | 0 |
| `invalidXml` | Malformed XML | N/A | N/A |

### Adding New Fixtures

```javascript
// In fixtures/sample-diagrams.js
const sampleDiagrams = {
    // ... existing diagrams

    myNewDiagram: `<?xml version="1.0" encoding="UTF-8"?>
<mxfile host="app.diagrams.net">
  <diagram name="My New Diagram" id="new-1">
    <mxGraphModel>
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />
        <!-- Add shapes and connections -->
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>`
};
```

## Coverage

### Generate Coverage Report

```bash
npm test -- --coverage
```

### Coverage Output

```
------------------|---------|----------|---------|---------|
File              | % Stmts | % Branch | % Funcs | % Lines |
------------------|---------|----------|---------|---------|
All files         |   95.2  |   88.5   |   97.1  |   95.0  |
 src              |         |          |         |         |
  LLMDiagram...   |   98.0  |   92.0   |  100.0  |   98.0  |
  LLMCommuni...   |   94.5  |   85.0   |   96.0  |   94.0  |
  DiagramExp...   |   96.0  |   90.0   |  100.0  |   96.0  |
  DiagramVal...   |   93.0  |   87.0   |   95.0  |   92.5  |
  Accessibil...   |   95.0  |   88.0   |   97.0  |   95.0  |
------------------|---------|----------|---------|---------|
```

### Coverage Thresholds

Recommended minimums:
- Statements: 90%
- Branches: 80%
- Functions: 95%
- Lines: 90%

## Continuous Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: |
          cd tests/llm-integration
          npm ci

      - name: Run tests
        run: |
          cd tests/llm-integration
          npm test -- --coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          directory: tests/llm-integration/coverage
```

### Docker CI

```yaml
test:
  stage: test
  image: node:20-alpine
  script:
    - cd tests/llm-integration
    - npm ci
    - npm test
  artifacts:
    reports:
      junit: tests/llm-integration/junit.xml
```

## Debugging Tests

### Run Single Test with Debug

```bash
node --inspect-brk node_modules/.bin/jest --runInBand LLMDiagramReader.test.js
```

### Console Output

Add `console.log` in tests or use:

```javascript
test('debug test', () => {
    const result = component.method(input);
    console.log('Result:', JSON.stringify(result, null, 2));
    expect(result).toBeDefined();
});
```

### Jest Debug Mode

```bash
npm test -- --verbose --no-cache
```

## Troubleshooting

### Common Issues

1. **DOMParser not defined**
   - Ensure `jest-environment-jsdom` is installed
   - Check `testEnvironment: 'jsdom'` in jest config

2. **Timeout errors**
   - Increase timeout in `setup.js`:
     ```javascript
     jest.setTimeout(30000);
     ```

3. **Module not found**
   - Check relative paths in imports
   - Ensure all dependencies are installed

4. **Snapshot failures**
   - Update snapshots: `npm test -- -u`

5. **Tests passing locally but failing in CI**
   - Check Node.js version compatibility
   - Ensure no local file dependencies

### Getting Help

- Check Jest documentation: https://jestjs.io/docs
- Review existing tests for patterns
- Ask in GitHub issues
