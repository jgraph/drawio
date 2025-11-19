/**
 * Test suite for DiagramExporter
 *
 * Tests export capabilities for various formats
 */

const { DiagramExporter } = require('./src/DiagramExporter');
const { LLMDiagramReader } = require('./src/LLMDiagramReader');
const { sampleDiagrams } = require('./fixtures/sample-diagrams');

describe('DiagramExporter', () => {
    let reader;
    let exporter;

    beforeEach(() => {
        reader = new LLMDiagramReader();
        exporter = new DiagramExporter(reader);
    });

    describe('exportToJSON', () => {
        test('should export diagram to JSON format', () => {
            const result = exporter.exportToJSON(sampleDiagrams.simpleFlowchart);

            expect(result.format).toBe('json');
            expect(result.version).toBe('1.0');
            expect(result.exported).toBeDefined();
            expect(result.diagram).toBeDefined();
        });

        test('should include diagram metadata', () => {
            const result = exporter.exportToJSON(sampleDiagrams.simpleFlowchart);

            expect(result.diagram.name).toBe('Simple Flowchart');
            expect(result.diagram.pages).toHaveLength(1);
        });

        test('should include all shapes with labels', () => {
            const result = exporter.exportToJSON(sampleDiagrams.simpleFlowchart);

            const shapes = result.diagram.shapes;
            expect(shapes.length).toBe(5);

            const labels = shapes.map(s => s.label);
            expect(labels).toContain('Start');
            expect(labels).toContain('Process Data');
            expect(labels).toContain('Success');
        });

        test('should include shape positions and sizes', () => {
            const result = exporter.exportToJSON(sampleDiagrams.simpleFlowchart);

            const startShape = result.diagram.shapes.find(s => s.label === 'Start');
            expect(startShape.position).toBeDefined();
            expect(startShape.position.x).toBe(200);
            expect(startShape.position.y).toBe(50);
            expect(startShape.size.width).toBe(100);
            expect(startShape.size.height).toBe(60);
        });

        test('should include shape types', () => {
            const result = exporter.exportToJSON(sampleDiagrams.simpleFlowchart);

            const startShape = result.diagram.shapes.find(s => s.label === 'Start');
            expect(startShape.type).toBe('ellipse');

            const decisionShape = result.diagram.shapes.find(s => s.label === 'Is Valid?');
            expect(decisionShape.type).toBe('diamond');
        });

        test('should include connections', () => {
            const result = exporter.exportToJSON(sampleDiagrams.simpleFlowchart);

            expect(result.diagram.connections).toHaveLength(4);

            const yesConn = result.diagram.connections.find(c => c.label === 'Yes');
            expect(yesConn).toBeDefined();
        });

        test('should handle network architecture diagram', () => {
            const result = exporter.exportToJSON(sampleDiagrams.networkArchitecture);

            expect(result.diagram.name).toBe('Network Architecture');
            expect(result.diagram.shapes.length).toBeGreaterThan(0);
            expect(result.diagram.connections.length).toBeGreaterThan(0);
        });
    });

    describe('exportToSVG', () => {
        test('should export diagram to SVG format', () => {
            const result = exporter.exportToSVG(sampleDiagrams.simpleFlowchart);

            expect(result.format).toBe('svg');
            expect(result.content).toContain('<?xml');
            expect(result.content).toContain('<svg');
            expect(result.content).toContain('</svg>');
        });

        test('should include diagram title', () => {
            const result = exporter.exportToSVG(sampleDiagrams.simpleFlowchart);

            expect(result.content).toContain('<title>Simple Flowchart</title>');
        });

        test('should calculate correct dimensions', () => {
            const result = exporter.exportToSVG(sampleDiagrams.simpleFlowchart);

            expect(result.width).toBeGreaterThan(0);
            expect(result.height).toBeGreaterThan(0);
        });

        test('should include shape count', () => {
            const result = exporter.exportToSVG(sampleDiagrams.simpleFlowchart);

            expect(result.shapeCount).toBe(5);
            expect(result.connectionCount).toBe(4);
        });

        test('should apply custom padding', () => {
            const defaultResult = exporter.exportToSVG(sampleDiagrams.simpleFlowchart);
            const paddedResult = exporter.exportToSVG(sampleDiagrams.simpleFlowchart, { padding: 50 });

            expect(paddedResult.width).toBeGreaterThan(defaultResult.width);
            expect(paddedResult.height).toBeGreaterThan(defaultResult.height);
        });

        test('should generate shape elements', () => {
            const result = exporter.exportToSVG(sampleDiagrams.simpleFlowchart);

            expect(result.content).toContain('<ellipse');
            expect(result.content).toContain('<polygon'); // diamond
            expect(result.content).toContain('<rect');
        });

        test('should include text labels', () => {
            const result = exporter.exportToSVG(sampleDiagrams.simpleFlowchart);

            expect(result.content).toContain('>Start<');
            expect(result.content).toContain('>Process Data<');
        });
    });

    describe('exportToPNG', () => {
        test('should return PNG export metadata', () => {
            const result = exporter.exportToPNG(sampleDiagrams.simpleFlowchart);

            expect(result.format).toBe('png');
            expect(result.width).toBeGreaterThan(0);
            expect(result.height).toBeGreaterThan(0);
            expect(result.dataUri).toContain('data:image/png');
        });

        test('should apply custom dimensions', () => {
            const result = exporter.exportToPNG(sampleDiagrams.simpleFlowchart, {
                width: 1000,
                height: 800
            });

            expect(result.width).toBe(1000);
            expect(result.height).toBe(800);
        });

        test('should include SVG source', () => {
            const result = exporter.exportToPNG(sampleDiagrams.simpleFlowchart);

            expect(result.svgSource).toBeDefined();
            expect(result.svgSource).toContain('<svg');
        });

        test('should support scale option', () => {
            const result = exporter.exportToPNG(sampleDiagrams.simpleFlowchart, { scale: 2 });

            expect(result.scale).toBe(2);
        });

        test('should support background option', () => {
            const result = exporter.exportToPNG(sampleDiagrams.simpleFlowchart, {
                background: '#f0f0f0'
            });

            expect(result.background).toBe('#f0f0f0');
        });
    });

    describe('generateEmbedCode', () => {
        test('should generate embed code', () => {
            const result = exporter.generateEmbedCode(sampleDiagrams.simpleFlowchart);

            expect(result.diagramName).toBe('Simple Flowchart');
            expect(result.embedTypes).toBeDefined();
        });

        test('should include iframe embed', () => {
            const result = exporter.generateEmbedCode(sampleDiagrams.simpleFlowchart);

            expect(result.embedTypes.iframe).toContain('<iframe');
            expect(result.embedTypes.iframe).toContain('viewer.diagrams.net');
        });

        test('should include div embed', () => {
            const result = exporter.generateEmbedCode(sampleDiagrams.simpleFlowchart);

            expect(result.embedTypes.div).toContain('class="mxgraph"');
            expect(result.embedTypes.div).toContain('viewer-static.min.js');
        });

        test('should apply custom dimensions', () => {
            const result = exporter.generateEmbedCode(sampleDiagrams.simpleFlowchart, {
                width: 1200,
                height: 900
            });

            expect(result.dimensions.width).toBe(1200);
            expect(result.dimensions.height).toBe(900);
            expect(result.embedTypes.iframe).toContain('width="1200"');
        });
    });

    describe('exportStatistics', () => {
        test('should export diagram statistics', () => {
            const result = exporter.exportStatistics(sampleDiagrams.simpleFlowchart);

            expect(result.name).toBe('Simple Flowchart');
            expect(result.pages).toBe(1);
            expect(result.totalShapes).toBe(5);
            expect(result.connections).toBe(4);
        });

        test('should count labeled shapes', () => {
            const result = exporter.exportStatistics(sampleDiagrams.simpleFlowchart);

            expect(result.labeledShapes).toBe(5);
        });

        test('should analyze shape types', () => {
            const result = exporter.exportStatistics(sampleDiagrams.simpleFlowchart);

            expect(result.shapeTypes).toBeDefined();
            expect(result.shapeTypes['ellipse']).toBe(3); // Start, Success, Error
            expect(result.shapeTypes['diamond']).toBe(1); // Is Valid?
        });

        test('should calculate complexity score', () => {
            const result = exporter.exportStatistics(sampleDiagrams.simpleFlowchart);

            expect(result.complexity).toBeDefined();
            expect(result.complexity.score).toBeGreaterThan(0);
            expect(result.complexity.level).toBeDefined();
        });

        test('should identify complexity levels', () => {
            const simpleResult = exporter.exportStatistics(sampleDiagrams.emptyDiagram);
            const complexResult = exporter.exportStatistics(sampleDiagrams.networkArchitecture);

            expect(['simple', 'moderate']).toContain(simpleResult.complexity.level);
            expect(complexResult.complexity.score).toBeGreaterThan(simpleResult.complexity.score);
        });

        test('should handle multi-page diagrams', () => {
            const result = exporter.exportStatistics(sampleDiagrams.multiPage);

            expect(result.pages).toBe(2);
        });
    });

    describe('Edge Cases', () => {
        test('should handle empty diagrams', () => {
            const result = exporter.exportToJSON(sampleDiagrams.emptyDiagram);

            expect(result.diagram.shapes).toHaveLength(0);
            expect(result.diagram.connections).toHaveLength(0);
        });

        test('should handle diagrams with HTML-formatted text', () => {
            const result = exporter.exportToJSON(sampleDiagrams.htmlFormattedText);

            const shapes = result.diagram.shapes;
            expect(shapes.length).toBe(2);

            // Labels should be cleaned
            const boldShape = shapes.find(s => s.label.includes('Bold Title'));
            expect(boldShape).toBeDefined();
            expect(boldShape.label).not.toContain('<b>');
        });

        test('should handle multi-page exports', () => {
            const result = exporter.exportToJSON(sampleDiagrams.multiPage);

            expect(result.diagram.pages).toHaveLength(2);
            expect(result.diagram.pages[0].name).toBe('Overview');
            expect(result.diagram.pages[1].name).toBe('Details');
        });
    });
});
