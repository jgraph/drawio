/**
 * Test suite for LLMDiagramReader
 *
 * These tests ensure the LLM can properly read and understand user diagrams
 */

const { LLMDiagramReader } = require('./src/LLMDiagramReader');
const { sampleDiagrams } = require('./fixtures/sample-diagrams');

describe('LLMDiagramReader', () => {
    let reader;

    beforeEach(() => {
        reader = new LLMDiagramReader();
    });

    describe('parseDiagram', () => {
        test('should parse a valid simple flowchart diagram', () => {
            const diagram = reader.parseDiagram(sampleDiagrams.simpleFlowchart);

            expect(diagram).toBeDefined();
            expect(diagram.name).toBe('Simple Flowchart');
            expect(diagram.pages).toHaveLength(1);
            expect(diagram.cells.length).toBeGreaterThan(0);
        });

        test('should extract all cells from a diagram', () => {
            const diagram = reader.parseDiagram(sampleDiagrams.simpleFlowchart);

            // Should have Start, Process Data, Is Valid?, Success, Error shapes
            const vertexCells = diagram.cells.filter(c => c.vertex);
            expect(vertexCells.length).toBe(5);
        });

        test('should extract connections between shapes', () => {
            const diagram = reader.parseDiagram(sampleDiagrams.simpleFlowchart);

            // Should have 4 connections: start->process, process->decision, decision->success, decision->error
            expect(diagram.connections.length).toBe(4);
        });

        test('should parse network architecture diagram', () => {
            const diagram = reader.parseDiagram(sampleDiagrams.networkArchitecture);

            expect(diagram.name).toBe('Network Architecture');

            // Check for specific components
            const texts = reader.getAllText(diagram);
            expect(texts).toContain('Web Client');
            expect(texts).toContain('Load Balancer');
            expect(texts).toContain('Database');
        });

        test('should parse multi-page diagrams', () => {
            const diagram = reader.parseDiagram(sampleDiagrams.multiPage);

            expect(diagram.pages).toHaveLength(2);
            expect(diagram.pages[0].name).toBe('Overview');
            expect(diagram.pages[1].name).toBe('Details');
        });

        test('should handle empty diagrams', () => {
            const diagram = reader.parseDiagram(sampleDiagrams.emptyDiagram);

            expect(diagram.name).toBe('Empty Diagram');
            expect(diagram.connections).toHaveLength(0);

            // Empty diagrams still have root cells
            const vertexCells = diagram.cells.filter(c => c.vertex && c.value);
            expect(vertexCells).toHaveLength(0);
        });

        test('should throw error for invalid XML', () => {
            expect(() => {
                reader.parseDiagram(sampleDiagrams.invalidXml);
            }).toThrow();
        });

        test('should throw error for null input', () => {
            expect(() => {
                reader.parseDiagram(null);
            }).toThrow('Invalid diagram XML');
        });

        test('should throw error for empty string', () => {
            expect(() => {
                reader.parseDiagram('');
            }).toThrow('Invalid diagram XML');
        });

        test('should extract metadata from diagram', () => {
            const diagram = reader.parseDiagram(sampleDiagrams.simpleFlowchart);

            expect(diagram.metadata).toBeDefined();
            expect(diagram.metadata.host).toBe('app.diagrams.net');
            expect(diagram.metadata.version).toBe('22.1.0');
        });

        test('should extract geometry information for cells', () => {
            const diagram = reader.parseDiagram(sampleDiagrams.simpleFlowchart);

            const startCell = diagram.cells.find(c => c.id === 'start-1');
            expect(startCell).toBeDefined();
            expect(startCell.geometry).toBeDefined();
            expect(startCell.geometry.x).toBe(200);
            expect(startCell.geometry.y).toBe(50);
            expect(startCell.geometry.width).toBe(100);
            expect(startCell.geometry.height).toBe(60);
        });
    });

    describe('toTextDescription', () => {
        test('should generate readable text description of flowchart', () => {
            const diagram = reader.parseDiagram(sampleDiagrams.simpleFlowchart);
            const description = reader.toTextDescription(diagram);

            expect(description).toContain('Diagram: Simple Flowchart');
            expect(description).toContain('Shapes:');
            expect(description).toContain('Start');
            expect(description).toContain('Process Data');
            expect(description).toContain('Is Valid?');
            expect(description).toContain('Connections:');
        });

        test('should describe connections with labels', () => {
            const diagram = reader.parseDiagram(sampleDiagrams.simpleFlowchart);
            const description = reader.toTextDescription(diagram);

            // Check that Yes/No labels are included
            expect(description).toContain('[Yes]');
            expect(description).toContain('[No]');
        });

        test('should generate description for network diagram', () => {
            const diagram = reader.parseDiagram(sampleDiagrams.networkArchitecture);
            const description = reader.toTextDescription(diagram);

            expect(description).toContain('Web Client');
            expect(description).toContain('Load Balancer');
            expect(description).toContain('Database');
            expect(description).toContain('->');
        });

        test('should handle diagrams with no connections', () => {
            const diagram = reader.parseDiagram(sampleDiagrams.emptyDiagram);
            const description = reader.toTextDescription(diagram);

            expect(description).toContain('Diagram: Empty Diagram');
            expect(description).not.toContain('Connections:');
        });
    });

    describe('getAllText', () => {
        test('should extract all text content from diagram', () => {
            const diagram = reader.parseDiagram(sampleDiagrams.simpleFlowchart);
            const texts = reader.getAllText(diagram);

            expect(texts).toContain('Start');
            expect(texts).toContain('Process Data');
            expect(texts).toContain('Is Valid?');
            expect(texts).toContain('Success');
            expect(texts).toContain('Error');
        });

        test('should clean HTML tags from text', () => {
            const diagram = reader.parseDiagram(sampleDiagrams.htmlFormattedText);
            const texts = reader.getAllText(diagram);

            // Should have cleaned HTML
            const boldText = texts.find(t => t.includes('Bold Title'));
            expect(boldText).toBeDefined();
            expect(boldText).not.toContain('<b>');
            expect(boldText).not.toContain('</b>');
        });

        test('should decode HTML entities', () => {
            const diagram = reader.parseDiagram(sampleDiagrams.htmlFormattedText);
            const texts = reader.getAllText(diagram);

            // Should have decoded entities
            const specialText = texts.find(t => t.includes('special'));
            expect(specialText).toBeDefined();
            expect(specialText).toContain('<special>');
            expect(specialText).toContain('&');
        });

        test('should return empty array for empty diagram', () => {
            const diagram = reader.parseDiagram(sampleDiagrams.emptyDiagram);
            const texts = reader.getAllText(diagram);

            expect(texts).toHaveLength(0);
        });
    });

    describe('findByText', () => {
        test('should find shapes by exact text match', () => {
            const diagram = reader.parseDiagram(sampleDiagrams.simpleFlowchart);
            const results = reader.findByText(diagram, 'Start');

            expect(results).toHaveLength(1);
            expect(results[0].id).toBe('start-1');
        });

        test('should find shapes by partial text match', () => {
            const diagram = reader.parseDiagram(sampleDiagrams.simpleFlowchart);
            const results = reader.findByText(diagram, 'Process');

            expect(results).toHaveLength(1);
            expect(results[0].value).toContain('Process');
        });

        test('should be case-insensitive', () => {
            const diagram = reader.parseDiagram(sampleDiagrams.simpleFlowchart);
            const results = reader.findByText(diagram, 'START');

            expect(results).toHaveLength(1);
        });

        test('should return empty array when no match found', () => {
            const diagram = reader.parseDiagram(sampleDiagrams.simpleFlowchart);
            const results = reader.findByText(diagram, 'NonExistent');

            expect(results).toHaveLength(0);
        });

        test('should find multiple shapes with matching text', () => {
            const diagram = reader.parseDiagram(sampleDiagrams.networkArchitecture);
            const results = reader.findByText(diagram, 'Server');

            expect(results).toHaveLength(2);
        });
    });

    describe('getShapeType', () => {
        test('should identify ellipse shape', () => {
            const type = reader.getShapeType('ellipse;whiteSpace=wrap;html=1;');
            expect(type).toBe('ellipse');
        });

        test('should identify diamond/rhombus shape', () => {
            const type = reader.getShapeType('rhombus;whiteSpace=wrap;html=1;');
            expect(type).toBe('diamond');
        });

        test('should identify shape from shape= attribute', () => {
            const type = reader.getShapeType('shape=cylinder3;whiteSpace=wrap;');
            expect(type).toBe('cylinder3');
        });

        test('should return rectangle as default', () => {
            const type = reader.getShapeType('rounded=0;whiteSpace=wrap;html=1;');
            expect(type).toBe('rectangle');
        });

        test('should return unknown for empty style', () => {
            const type = reader.getShapeType('');
            expect(type).toBe('unknown');
        });

        test('should return unknown for null style', () => {
            const type = reader.getShapeType(null);
            expect(type).toBe('unknown');
        });
    });

    describe('Connection Analysis', () => {
        test('should correctly identify source and target of connections', () => {
            const diagram = reader.parseDiagram(sampleDiagrams.simpleFlowchart);

            // Find the connection from start to process
            const startToProcess = diagram.connections.find(c => c.source === 'start-1');
            expect(startToProcess).toBeDefined();
            expect(startToProcess.target).toBe('process-1');
        });

        test('should capture connection labels', () => {
            const diagram = reader.parseDiagram(sampleDiagrams.simpleFlowchart);

            // Find connections with labels
            const labeledConnections = diagram.connections.filter(c => c.value);
            expect(labeledConnections.length).toBeGreaterThan(0);

            const yesConnection = labeledConnections.find(c => c.value === 'Yes');
            expect(yesConnection).toBeDefined();
        });

        test('should handle diagrams with multiple connections to same target', () => {
            const diagram = reader.parseDiagram(sampleDiagrams.networkArchitecture);

            // Both servers connect to database
            const dbConnections = diagram.connections.filter(c => c.target === 'db-1');
            expect(dbConnections).toHaveLength(2);
        });
    });
});
