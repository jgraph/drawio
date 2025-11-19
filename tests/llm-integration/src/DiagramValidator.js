/**
 * DiagramValidator - Validates draw.io diagram structure and integrity
 *
 * This class provides methods to:
 * - Validate diagram XML structure
 * - Check for broken connections
 * - Detect orphaned elements
 * - Validate style consistency
 * - Check accessibility requirements
 */
class DiagramValidator {
    constructor(diagramReader) {
        this.diagramReader = diagramReader;
    }

    /**
     * Perform full validation of a diagram
     * @param {string} xmlString - The draw.io XML content
     * @returns {Object} Validation results
     */
    validate(xmlString) {
        const results = {
            valid: true,
            errors: [],
            warnings: [],
            info: []
        };

        try {
            const diagram = this.diagramReader.parseDiagram(xmlString);

            // Run all validations
            this._validateStructure(diagram, results);
            this._validateConnections(diagram, results);
            this._validateLabels(diagram, results);
            this._validateStyles(diagram, results);
            this._validateAccessibility(diagram, results);

            // Update overall validity
            results.valid = results.errors.length === 0;

            return results;
        } catch (error) {
            results.valid = false;
            results.errors.push({
                code: 'PARSE_ERROR',
                message: `Failed to parse diagram: ${error.message}`,
                severity: 'critical'
            });
            return results;
        }
    }

    /**
     * Validate basic diagram structure
     * @private
     */
    _validateStructure(diagram, results) {
        // Check for diagram name
        if (!diagram.name || diagram.name === 'Untitled') {
            results.warnings.push({
                code: 'MISSING_NAME',
                message: 'Diagram does not have a descriptive name',
                severity: 'low'
            });
        }

        // Check for empty pages
        if (diagram.pages.length === 0) {
            results.errors.push({
                code: 'NO_PAGES',
                message: 'Diagram has no pages',
                severity: 'high'
            });
        }

        // Check for minimum content
        const shapes = diagram.cells.filter(c => c.vertex && c.value);
        if (shapes.length === 0) {
            results.warnings.push({
                code: 'EMPTY_DIAGRAM',
                message: 'Diagram contains no labeled shapes',
                severity: 'medium'
            });
        }

        // Check for duplicate IDs
        const ids = diagram.cells.map(c => c.id);
        const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
        if (duplicates.length > 0) {
            results.errors.push({
                code: 'DUPLICATE_IDS',
                message: `Duplicate cell IDs found: ${[...new Set(duplicates)].join(', ')}`,
                severity: 'high',
                details: duplicates
            });
        }
    }

    /**
     * Validate connections between shapes
     * @private
     */
    _validateConnections(diagram, results) {
        const cellIds = new Set(diagram.cells.map(c => c.id));

        // Check for broken connections
        const brokenConnections = [];
        diagram.connections.forEach(conn => {
            if (!cellIds.has(conn.source)) {
                brokenConnections.push({
                    connectionId: conn.id,
                    type: 'source',
                    missingId: conn.source
                });
            }
            if (!cellIds.has(conn.target)) {
                brokenConnections.push({
                    connectionId: conn.id,
                    type: 'target',
                    missingId: conn.target
                });
            }
        });

        if (brokenConnections.length > 0) {
            results.errors.push({
                code: 'BROKEN_CONNECTIONS',
                message: `Found ${brokenConnections.length} broken connection(s)`,
                severity: 'high',
                details: brokenConnections
            });
        }

        // Check for self-referencing connections
        const selfRefs = diagram.connections.filter(c => c.source === c.target);
        if (selfRefs.length > 0) {
            results.warnings.push({
                code: 'SELF_REFERENCING',
                message: `Found ${selfRefs.length} self-referencing connection(s)`,
                severity: 'low',
                details: selfRefs.map(c => c.id)
            });
        }

        // Check for duplicate connections
        const connPairs = diagram.connections.map(c => `${c.source}->${c.target}`);
        const dupConns = connPairs.filter((pair, i) => connPairs.indexOf(pair) !== i);
        if (dupConns.length > 0) {
            results.warnings.push({
                code: 'DUPLICATE_CONNECTIONS',
                message: `Found ${dupConns.length} duplicate connection(s)`,
                severity: 'low',
                details: [...new Set(dupConns)]
            });
        }
    }

    /**
     * Validate labels and text content
     * @private
     */
    _validateLabels(diagram, results) {
        const shapes = diagram.cells.filter(c => c.vertex);

        // Check for unlabeled shapes
        const unlabeled = shapes.filter(s => !s.value || s.value.trim() === '');
        if (unlabeled.length > 0) {
            results.warnings.push({
                code: 'UNLABELED_SHAPES',
                message: `Found ${unlabeled.length} shape(s) without labels`,
                severity: 'medium',
                details: unlabeled.map(s => s.id)
            });
        }

        // Check for very long labels
        shapes.forEach(shape => {
            if (shape.value) {
                const cleanLabel = this.diagramReader._cleanHtml(shape.value);
                if (cleanLabel.length > 100) {
                    results.warnings.push({
                        code: 'LONG_LABEL',
                        message: `Shape "${shape.id}" has a very long label (${cleanLabel.length} chars)`,
                        severity: 'low',
                        details: { id: shape.id, length: cleanLabel.length }
                    });
                }
            }
        });

        // Check for duplicate labels
        const labels = shapes
            .map(s => this.diagramReader._cleanHtml(s.value))
            .filter(l => l);
        const dupLabels = labels.filter((l, i) => labels.indexOf(l) !== i);
        if (dupLabels.length > 0) {
            results.info.push({
                code: 'DUPLICATE_LABELS',
                message: `Found ${[...new Set(dupLabels)].length} duplicate label(s)`,
                severity: 'info',
                details: [...new Set(dupLabels)]
            });
        }
    }

    /**
     * Validate style consistency
     * @private
     */
    _validateStyles(diagram, results) {
        const shapes = diagram.cells.filter(c => c.vertex && c.style);

        // Check for missing styles
        const noStyle = diagram.cells.filter(c => c.vertex && !c.style);
        if (noStyle.length > 0) {
            results.info.push({
                code: 'MISSING_STYLES',
                message: `${noStyle.length} shape(s) have no style defined`,
                severity: 'info',
                details: noStyle.map(s => s.id)
            });
        }

        // Check for inconsistent fill colors (just report variety)
        const fillColors = new Set();
        shapes.forEach(shape => {
            const match = shape.style.match(/fillColor=([^;]+)/);
            if (match) fillColors.add(match[1]);
        });

        if (fillColors.size > 5) {
            results.info.push({
                code: 'COLOR_VARIETY',
                message: `Diagram uses ${fillColors.size} different fill colors`,
                severity: 'info',
                details: [...fillColors]
            });
        }
    }

    /**
     * Validate accessibility requirements
     * @private
     */
    _validateAccessibility(diagram, results) {
        const shapes = diagram.cells.filter(c => c.vertex);

        // Check for minimum shape sizes
        const tooSmall = shapes.filter(s => {
            if (!s.geometry) return false;
            return s.geometry.width < 20 || s.geometry.height < 20;
        });

        if (tooSmall.length > 0) {
            results.warnings.push({
                code: 'SMALL_SHAPES',
                message: `Found ${tooSmall.length} shape(s) that may be too small for accessibility`,
                severity: 'medium',
                details: tooSmall.map(s => ({
                    id: s.id,
                    width: s.geometry.width,
                    height: s.geometry.height
                }))
            });
        }

        // Check for low contrast colors
        shapes.forEach(shape => {
            if (shape.style) {
                const fillColor = this._extractColor(shape.style, 'fillColor');
                const fontColor = this._extractColor(shape.style, 'fontColor') || '#000000';

                if (fillColor && !this._hasGoodContrast(fillColor, fontColor)) {
                    results.warnings.push({
                        code: 'LOW_CONTRAST',
                        message: `Shape "${shape.id}" may have low color contrast`,
                        severity: 'medium',
                        details: { id: shape.id, fill: fillColor, font: fontColor }
                    });
                }
            }
        });

        // Check alt text / descriptions
        if (!diagram.metadata.type && shapes.length > 10) {
            results.info.push({
                code: 'CONSIDER_DESCRIPTION',
                message: 'Consider adding a diagram description for screen readers',
                severity: 'info'
            });
        }
    }

    /**
     * Extract color from style string
     * @private
     */
    _extractColor(style, colorType) {
        const match = style.match(new RegExp(`${colorType}=([^;]+)`));
        return match ? match[1] : null;
    }

    /**
     * Check if two colors have good contrast
     * @private
     */
    _hasGoodContrast(bg, fg) {
        // Simplified contrast check - in reality would use WCAG formula
        // Light backgrounds with dark text or vice versa
        const lightBgs = ['#ffffff', '#fff', '#f5f5f5', '#e0e0e0', '#d5e8d4', '#dae8fc', '#fff2cc', '#f8cecc'];
        const darkFonts = ['#000000', '#000', '#333333', '#333'];

        const isLightBg = lightBgs.some(c => bg.toLowerCase() === c);
        const isDarkFont = darkFonts.some(c => fg.toLowerCase() === c);

        // If light background, need dark font
        if (isLightBg) return isDarkFont;

        // Otherwise assume it's okay
        return true;
    }

    /**
     * Quick validation check (errors only)
     * @param {string} xmlString - The draw.io XML content
     * @returns {boolean} Whether diagram is valid
     */
    isValid(xmlString) {
        const results = this.validate(xmlString);
        return results.valid;
    }

    /**
     * Get validation summary
     * @param {string} xmlString - The draw.io XML content
     * @returns {Object} Summary of validation results
     */
    getSummary(xmlString) {
        const results = this.validate(xmlString);

        return {
            valid: results.valid,
            errorCount: results.errors.length,
            warningCount: results.warnings.length,
            infoCount: results.info.length,
            criticalErrors: results.errors.filter(e => e.severity === 'critical').length,
            highErrors: results.errors.filter(e => e.severity === 'high').length
        };
    }
}

module.exports = { DiagramValidator };
