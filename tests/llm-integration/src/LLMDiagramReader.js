/**
 * LLMDiagramReader - Utility for reading and parsing draw.io diagrams for LLM consumption
 *
 * This class provides methods to:
 * - Parse draw.io XML format
 * - Extract diagram elements (shapes, connections, text)
 * - Convert diagram data to LLM-friendly format
 * - Extract semantic meaning from diagrams
 */
class LLMDiagramReader {
    constructor() {
        this.parser = new DOMParser();
        this.serializer = new XMLSerializer();
    }

    /**
     * Parse a draw.io diagram from XML string
     * @param {string} xmlString - The draw.io XML content
     * @returns {Object} Parsed diagram object
     */
    parseDiagram(xmlString) {
        if (!xmlString || typeof xmlString !== 'string') {
            throw new Error('Invalid diagram XML: must be a non-empty string');
        }

        const doc = this.parser.parseFromString(xmlString, 'text/xml');

        // Check for parsing errors
        const parserError = doc.querySelector('parsererror');
        if (parserError) {
            throw new Error('XML parsing error: ' + parserError.textContent);
        }

        const diagram = {
            name: this._extractDiagramName(doc),
            pages: this._extractPages(doc),
            cells: this._extractCells(doc),
            connections: this._extractConnections(doc),
            metadata: this._extractMetadata(doc)
        };

        return diagram;
    }

    /**
     * Extract diagram name from document
     * @private
     */
    _extractDiagramName(doc) {
        const diagramElement = doc.querySelector('diagram');
        return diagramElement ? diagramElement.getAttribute('name') || 'Untitled' : 'Untitled';
    }

    /**
     * Extract all pages from the diagram
     * @private
     */
    _extractPages(doc) {
        const pages = [];
        const diagramElements = doc.querySelectorAll('diagram');

        diagramElements.forEach((diagramEl, index) => {
            pages.push({
                id: diagramEl.getAttribute('id') || `page-${index}`,
                name: diagramEl.getAttribute('name') || `Page ${index + 1}`
            });
        });

        return pages;
    }

    /**
     * Extract all cells (shapes) from the diagram
     * @private
     */
    _extractCells(doc) {
        const cells = [];
        const cellElements = doc.querySelectorAll('mxCell');

        cellElements.forEach(cell => {
            const cellData = {
                id: cell.getAttribute('id'),
                value: cell.getAttribute('value') || '',
                style: cell.getAttribute('style') || '',
                vertex: cell.getAttribute('vertex') === '1',
                edge: cell.getAttribute('edge') === '1',
                parent: cell.getAttribute('parent'),
                source: cell.getAttribute('source'),
                target: cell.getAttribute('target')
            };

            // Extract geometry if present
            const geometry = cell.querySelector('mxGeometry');
            if (geometry) {
                cellData.geometry = {
                    x: parseFloat(geometry.getAttribute('x')) || 0,
                    y: parseFloat(geometry.getAttribute('y')) || 0,
                    width: parseFloat(geometry.getAttribute('width')) || 0,
                    height: parseFloat(geometry.getAttribute('height')) || 0
                };
            }

            cells.push(cellData);
        });

        return cells;
    }

    /**
     * Extract connections (edges) between cells
     * @private
     */
    _extractConnections(doc) {
        const connections = [];
        const cellElements = doc.querySelectorAll('mxCell[edge="1"]');

        cellElements.forEach(cell => {
            const source = cell.getAttribute('source');
            const target = cell.getAttribute('target');

            if (source && target) {
                connections.push({
                    id: cell.getAttribute('id'),
                    source: source,
                    target: target,
                    value: cell.getAttribute('value') || '',
                    style: cell.getAttribute('style') || ''
                });
            }
        });

        return connections;
    }

    /**
     * Extract metadata from the diagram
     * @private
     */
    _extractMetadata(doc) {
        const mxfile = doc.querySelector('mxfile');
        if (!mxfile) {
            return {};
        }

        return {
            host: mxfile.getAttribute('host') || '',
            modified: mxfile.getAttribute('modified') || '',
            agent: mxfile.getAttribute('agent') || '',
            version: mxfile.getAttribute('version') || '',
            type: mxfile.getAttribute('type') || ''
        };
    }

    /**
     * Convert diagram to LLM-friendly text description
     * @param {Object} diagram - Parsed diagram object
     * @returns {string} Text description of the diagram
     */
    toTextDescription(diagram) {
        const lines = [];

        lines.push(`Diagram: ${diagram.name}`);
        lines.push(`Pages: ${diagram.pages.length}`);
        lines.push('');

        // Describe shapes (vertices)
        const shapes = diagram.cells.filter(c => c.vertex && c.value);
        if (shapes.length > 0) {
            lines.push('Shapes:');
            shapes.forEach(shape => {
                const label = this._cleanHtml(shape.value);
                if (label) {
                    lines.push(`  - "${label}" (ID: ${shape.id})`);
                }
            });
            lines.push('');
        }

        // Describe connections
        if (diagram.connections.length > 0) {
            lines.push('Connections:');
            diagram.connections.forEach(conn => {
                const sourceShape = shapes.find(s => s.id === conn.source);
                const targetShape = shapes.find(s => s.id === conn.target);
                const sourceLabel = sourceShape ? this._cleanHtml(sourceShape.value) : conn.source;
                const targetLabel = targetShape ? this._cleanHtml(targetShape.value) : conn.target;
                const connLabel = conn.value ? ` [${this._cleanHtml(conn.value)}]` : '';
                lines.push(`  - "${sourceLabel}" -> "${targetLabel}"${connLabel}`);
            });
        }

        return lines.join('\n');
    }

    /**
     * Get all text content from the diagram
     * @param {Object} diagram - Parsed diagram object
     * @returns {string[]} Array of text content
     */
    getAllText(diagram) {
        const texts = [];

        diagram.cells.forEach(cell => {
            if (cell.value) {
                const cleanText = this._cleanHtml(cell.value);
                if (cleanText) {
                    texts.push(cleanText);
                }
            }
        });

        return texts;
    }

    /**
     * Find shapes by text content
     * @param {Object} diagram - Parsed diagram object
     * @param {string} searchText - Text to search for
     * @returns {Object[]} Matching cells
     */
    findByText(diagram, searchText) {
        const searchLower = searchText.toLowerCase();
        return diagram.cells.filter(cell => {
            if (!cell.value) return false;
            const cleanText = this._cleanHtml(cell.value).toLowerCase();
            return cleanText.includes(searchLower);
        });
    }

    /**
     * Get shape type from style
     * @param {string} style - Cell style string
     * @returns {string} Shape type
     */
    getShapeType(style) {
        if (!style) return 'unknown';

        const shapeMatch = style.match(/shape=([^;]+)/);
        if (shapeMatch) return shapeMatch[1];

        if (style.includes('ellipse')) return 'ellipse';
        if (style.includes('rhombus')) return 'diamond';
        if (style.includes('triangle')) return 'triangle';
        if (style.includes('cylinder')) return 'cylinder';
        if (style.includes('swimlane')) return 'swimlane';

        return 'rectangle';
    }

    /**
     * Clean HTML tags from text
     * @private
     */
    _cleanHtml(html) {
        if (!html) return '';
        // Remove HTML tags and decode entities
        return html
            .replace(/<[^>]*>/g, '')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&amp;/g, '&')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/&nbsp;/g, ' ')
            .trim();
    }
}

module.exports = { LLMDiagramReader };
