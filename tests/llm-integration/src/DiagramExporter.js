/**
 * DiagramExporter - Enhanced export capabilities for draw.io diagrams
 *
 * This class provides methods to:
 * - Export diagrams to various formats (SVG, PNG data URI, JSON)
 * - Generate embeddable code snippets
 * - Create shareable links
 * - Export with custom styling
 */
class DiagramExporter {
    constructor(diagramReader) {
        this.diagramReader = diagramReader;
        this.serializer = new XMLSerializer();
    }

    /**
     * Export diagram to JSON format
     * @param {string} xmlString - The draw.io XML content
     * @returns {Object} JSON representation of the diagram
     */
    exportToJSON(xmlString) {
        const diagram = this.diagramReader.parseDiagram(xmlString);

        return {
            format: 'json',
            version: '1.0',
            exported: new Date().toISOString(),
            diagram: {
                name: diagram.name,
                pages: diagram.pages,
                shapes: diagram.cells.filter(c => c.vertex).map(cell => ({
                    id: cell.id,
                    label: this.diagramReader._cleanHtml(cell.value),
                    type: this.diagramReader.getShapeType(cell.style),
                    position: cell.geometry ? {
                        x: cell.geometry.x,
                        y: cell.geometry.y
                    } : null,
                    size: cell.geometry ? {
                        width: cell.geometry.width,
                        height: cell.geometry.height
                    } : null,
                    style: cell.style
                })),
                connections: diagram.connections.map(conn => ({
                    id: conn.id,
                    from: conn.source,
                    to: conn.target,
                    label: this.diagramReader._cleanHtml(conn.value)
                })),
                metadata: diagram.metadata
            }
        };
    }

    /**
     * Export diagram to SVG format
     * @param {string} xmlString - The draw.io XML content
     * @param {Object} options - Export options
     * @returns {Object} SVG export result
     */
    exportToSVG(xmlString, options = {}) {
        const diagram = this.diagramReader.parseDiagram(xmlString);
        const shapes = diagram.cells.filter(c => c.vertex && c.geometry);

        // Calculate bounds
        const bounds = this._calculateBounds(shapes);
        const padding = options.padding || 20;

        const width = bounds.maxX - bounds.minX + (padding * 2);
        const height = bounds.maxY - bounds.minY + (padding * 2);

        // Generate SVG
        let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg"
     width="${width}" height="${height}"
     viewBox="0 0 ${width} ${height}">
  <title>${diagram.name}</title>
  <desc>Exported from draw.io</desc>
  <g transform="translate(${padding - bounds.minX}, ${padding - bounds.minY})">`;

        // Add shapes
        shapes.forEach(shape => {
            const label = this.diagramReader._cleanHtml(shape.value);
            const shapeType = this.diagramReader.getShapeType(shape.style);
            const fill = this._extractColor(shape.style, 'fillColor') || '#ffffff';
            const stroke = this._extractColor(shape.style, 'strokeColor') || '#000000';

            svg += this._generateSVGShape(shape, shapeType, fill, stroke, label);
        });

        // Add connections
        diagram.connections.forEach(conn => {
            const sourceShape = shapes.find(s => s.id === conn.source);
            const targetShape = shapes.find(s => s.id === conn.target);

            if (sourceShape && targetShape && sourceShape.geometry && targetShape.geometry) {
                svg += this._generateSVGConnection(sourceShape, targetShape, conn);
            }
        });

        svg += `
  </g>
</svg>`;

        return {
            format: 'svg',
            content: svg,
            width: width,
            height: height,
            shapeCount: shapes.length,
            connectionCount: diagram.connections.length
        };
    }

    /**
     * Export diagram to PNG data URI
     * @param {string} xmlString - The draw.io XML content
     * @param {Object} options - Export options
     * @returns {Object} PNG export result (placeholder - actual rendering requires canvas)
     */
    exportToPNG(xmlString, options = {}) {
        const svgResult = this.exportToSVG(xmlString, options);

        // In a real implementation, this would render SVG to canvas and export as PNG
        // For testing purposes, we return metadata about what would be exported
        return {
            format: 'png',
            width: options.width || svgResult.width,
            height: options.height || svgResult.height,
            scale: options.scale || 1,
            background: options.background || '#ffffff',
            svgSource: svgResult.content,
            // Placeholder for actual PNG data
            dataUri: `data:image/png;base64,placeholder_${svgResult.shapeCount}_shapes`
        };
    }

    /**
     * Generate embeddable HTML code
     * @param {string} xmlString - The draw.io XML content
     * @param {Object} options - Embed options
     * @returns {Object} Embed code result
     */
    generateEmbedCode(xmlString, options = {}) {
        const diagram = this.diagramReader.parseDiagram(xmlString);
        const width = options.width || 800;
        const height = options.height || 600;

        // Generate various embed formats
        const iframeEmbed = `<iframe
  src="https://viewer.diagrams.net/?edit=_blank&layers=1&nav=1"
  width="${width}"
  height="${height}"
  frameborder="0">
</iframe>`;

        const divEmbed = `<div class="mxgraph" style="max-width:100%;border:1px solid transparent;"
  data-mxgraph='{"highlight":"#0000ff","nav":true,"resize":true}'>
</div>
<script type="text/javascript" src="https://viewer.diagrams.net/js/viewer-static.min.js"></script>`;

        return {
            diagramName: diagram.name,
            embedTypes: {
                iframe: iframeEmbed,
                div: divEmbed
            },
            dimensions: { width, height }
        };
    }

    /**
     * Export diagram statistics
     * @param {string} xmlString - The draw.io XML content
     * @returns {Object} Diagram statistics
     */
    exportStatistics(xmlString) {
        const diagram = this.diagramReader.parseDiagram(xmlString);
        const shapes = diagram.cells.filter(c => c.vertex);
        const labeledShapes = shapes.filter(s => s.value);

        // Analyze shape types
        const shapeTypes = {};
        shapes.forEach(shape => {
            const type = this.diagramReader.getShapeType(shape.style);
            shapeTypes[type] = (shapeTypes[type] || 0) + 1;
        });

        // Calculate complexity score
        const complexityScore = this._calculateComplexity(diagram);

        return {
            name: diagram.name,
            pages: diagram.pages.length,
            totalShapes: shapes.length,
            labeledShapes: labeledShapes.length,
            connections: diagram.connections.length,
            shapeTypes: shapeTypes,
            complexity: {
                score: complexityScore,
                level: this._getComplexityLevel(complexityScore)
            },
            metadata: diagram.metadata
        };
    }

    /**
     * Calculate diagram bounds
     * @private
     */
    _calculateBounds(shapes) {
        let minX = Infinity, minY = Infinity;
        let maxX = -Infinity, maxY = -Infinity;

        shapes.forEach(shape => {
            if (shape.geometry) {
                minX = Math.min(minX, shape.geometry.x);
                minY = Math.min(minY, shape.geometry.y);
                maxX = Math.max(maxX, shape.geometry.x + shape.geometry.width);
                maxY = Math.max(maxY, shape.geometry.y + shape.geometry.height);
            }
        });

        // Handle empty diagrams
        if (minX === Infinity) {
            return { minX: 0, minY: 0, maxX: 100, maxY: 100 };
        }

        return { minX, minY, maxX, maxY };
    }

    /**
     * Extract color from style string
     * @private
     */
    _extractColor(style, colorType) {
        if (!style) return null;
        const match = style.match(new RegExp(`${colorType}=([^;]+)`));
        return match ? match[1] : null;
    }

    /**
     * Generate SVG shape element
     * @private
     */
    _generateSVGShape(shape, shapeType, fill, stroke, label) {
        const { x, y, width, height } = shape.geometry;
        let shapeElement = '';

        switch (shapeType) {
            case 'ellipse':
                const cx = x + width / 2;
                const cy = y + height / 2;
                shapeElement = `
    <ellipse cx="${cx}" cy="${cy}" rx="${width/2}" ry="${height/2}"
             fill="${fill}" stroke="${stroke}" stroke-width="1"/>`;
                break;
            case 'diamond':
                const points = `${x + width/2},${y} ${x + width},${y + height/2} ${x + width/2},${y + height} ${x},${y + height/2}`;
                shapeElement = `
    <polygon points="${points}" fill="${fill}" stroke="${stroke}" stroke-width="1"/>`;
                break;
            default: // rectangle
                shapeElement = `
    <rect x="${x}" y="${y}" width="${width}" height="${height}"
          fill="${fill}" stroke="${stroke}" stroke-width="1"/>`;
        }

        // Add label
        if (label) {
            shapeElement += `
    <text x="${x + width/2}" y="${y + height/2}"
          text-anchor="middle" dominant-baseline="middle"
          font-size="12" fill="#000000">${label}</text>`;
        }

        return shapeElement;
    }

    /**
     * Generate SVG connection line
     * @private
     */
    _generateSVGConnection(source, target, conn) {
        const x1 = source.geometry.x + source.geometry.width / 2;
        const y1 = source.geometry.y + source.geometry.height / 2;
        const x2 = target.geometry.x + target.geometry.width / 2;
        const y2 = target.geometry.y + target.geometry.height / 2;

        let line = `
    <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"
          stroke="#000000" stroke-width="1" marker-end="url(#arrow)"/>`;

        // Add label if present
        if (conn.value) {
            const midX = (x1 + x2) / 2;
            const midY = (y1 + y2) / 2;
            line += `
    <text x="${midX}" y="${midY - 5}" text-anchor="middle" font-size="10" fill="#666666">
      ${this.diagramReader._cleanHtml(conn.value)}
    </text>`;
        }

        return line;
    }

    /**
     * Calculate diagram complexity score
     * @private
     */
    _calculateComplexity(diagram) {
        const shapes = diagram.cells.filter(c => c.vertex).length;
        const connections = diagram.connections.length;
        const pages = diagram.pages.length;

        // Weighted formula for complexity
        return Math.round((shapes * 1) + (connections * 1.5) + (pages * 5));
    }

    /**
     * Get complexity level from score
     * @private
     */
    _getComplexityLevel(score) {
        if (score < 10) return 'simple';
        if (score < 30) return 'moderate';
        if (score < 60) return 'complex';
        return 'very complex';
    }
}

module.exports = { DiagramExporter };
