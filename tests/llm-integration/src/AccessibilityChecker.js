/**
 * AccessibilityChecker - Ensures draw.io diagrams meet accessibility standards
 *
 * This class provides methods to:
 * - Check WCAG compliance
 * - Generate alt text descriptions
 * - Verify color contrast
 * - Check for screen reader compatibility
 * - Suggest accessibility improvements
 */
class AccessibilityChecker {
    constructor(diagramReader) {
        this.diagramReader = diagramReader;
    }

    /**
     * Perform full accessibility check
     * @param {string} xmlString - The draw.io XML content
     * @returns {Object} Accessibility check results
     */
    check(xmlString) {
        const diagram = this.diagramReader.parseDiagram(xmlString);

        const results = {
            score: 0,
            maxScore: 100,
            level: '',
            checks: [],
            recommendations: []
        };

        // Run accessibility checks
        this._checkAltText(diagram, results);
        this._checkColorContrast(diagram, results);
        this._checkTextSize(diagram, results);
        this._checkKeyboardNavigation(diagram, results);
        this._checkStructure(diagram, results);
        this._checkLabels(diagram, results);

        // Calculate overall score
        const passedChecks = results.checks.filter(c => c.passed).length;
        results.score = Math.round((passedChecks / results.checks.length) * 100);
        results.level = this._getAccessibilityLevel(results.score);

        return results;
    }

    /**
     * Check for alt text / descriptions
     * @private
     */
    _checkAltText(diagram, results) {
        const shapes = diagram.cells.filter(c => c.vertex);
        const labeledShapes = shapes.filter(s => s.value && s.value.trim());

        const coverage = shapes.length > 0 ? (labeledShapes.length / shapes.length) * 100 : 0;

        results.checks.push({
            name: 'Alt Text Coverage',
            passed: coverage >= 80,
            score: coverage,
            message: `${coverage.toFixed(0)}% of shapes have text labels`,
            wcag: '1.1.1'
        });

        if (coverage < 100) {
            results.recommendations.push({
                priority: 'high',
                message: 'Add descriptive labels to all shapes for screen reader users',
                affectedCount: shapes.length - labeledShapes.length
            });
        }

        // Check for diagram-level description
        const hasDescription = diagram.metadata && diagram.metadata.type;
        results.checks.push({
            name: 'Diagram Description',
            passed: hasDescription || diagram.name !== 'Untitled',
            message: hasDescription ? 'Diagram has metadata description' : 'Diagram has a name but consider adding description',
            wcag: '1.1.1'
        });
    }

    /**
     * Check color contrast ratios
     * @private
     */
    _checkColorContrast(diagram, results) {
        const shapes = diagram.cells.filter(c => c.vertex && c.style);
        let lowContrastCount = 0;
        const lowContrastShapes = [];

        shapes.forEach(shape => {
            const fillColor = this._extractColor(shape.style, 'fillColor');
            const fontColor = this._extractColor(shape.style, 'fontColor') || '#000000';
            const strokeColor = this._extractColor(shape.style, 'strokeColor');

            if (fillColor) {
                const contrastRatio = this._calculateContrastRatio(fillColor, fontColor);

                if (contrastRatio < 4.5) {
                    lowContrastCount++;
                    lowContrastShapes.push({
                        id: shape.id,
                        fill: fillColor,
                        font: fontColor,
                        ratio: contrastRatio.toFixed(2)
                    });
                }
            }
        });

        const passed = lowContrastCount === 0;
        results.checks.push({
            name: 'Color Contrast',
            passed: passed,
            score: shapes.length > 0 ? ((shapes.length - lowContrastCount) / shapes.length) * 100 : 100,
            message: passed
                ? 'All shapes meet contrast requirements'
                : `${lowContrastCount} shape(s) have low color contrast`,
            wcag: '1.4.3',
            details: lowContrastShapes
        });

        if (!passed) {
            results.recommendations.push({
                priority: 'high',
                message: 'Increase color contrast to at least 4.5:1 for text visibility',
                affectedCount: lowContrastCount
            });
        }
    }

    /**
     * Check text size accessibility
     * @private
     */
    _checkTextSize(diagram, results) {
        const shapes = diagram.cells.filter(c => c.vertex && c.style);
        let smallTextCount = 0;

        shapes.forEach(shape => {
            const fontSize = this._extractFontSize(shape.style);
            if (fontSize && fontSize < 12) {
                smallTextCount++;
            }
        });

        const passed = smallTextCount === 0;
        results.checks.push({
            name: 'Text Size',
            passed: passed,
            message: passed
                ? 'All text meets minimum size requirements'
                : `${smallTextCount} shape(s) have text smaller than 12px`,
            wcag: '1.4.4'
        });

        if (!passed) {
            results.recommendations.push({
                priority: 'medium',
                message: 'Increase font size to at least 12px for readability',
                affectedCount: smallTextCount
            });
        }
    }

    /**
     * Check for keyboard navigation support
     * @private
     */
    _checkKeyboardNavigation(diagram, results) {
        // Check if diagram has logical flow (connections)
        const hasConnections = diagram.connections.length > 0;
        const shapes = diagram.cells.filter(c => c.vertex && c.value);

        // Check for logical reading order (left-to-right, top-to-bottom)
        let hasLogicalOrder = true;
        if (shapes.length > 1) {
            const sortedByPosition = [...shapes]
                .filter(s => s.geometry)
                .sort((a, b) => {
                    const yDiff = a.geometry.y - b.geometry.y;
                    return yDiff !== 0 ? yDiff : a.geometry.x - b.geometry.x;
                });

            // Simple check - see if there's some logical arrangement
            hasLogicalOrder = sortedByPosition.length > 0;
        }

        results.checks.push({
            name: 'Navigation Structure',
            passed: hasConnections || hasLogicalOrder,
            message: hasConnections
                ? 'Diagram has connection-based navigation flow'
                : (hasLogicalOrder ? 'Shapes arranged in logical reading order' : 'No clear navigation structure'),
            wcag: '2.4.3'
        });

        if (!hasConnections && shapes.length > 5) {
            results.recommendations.push({
                priority: 'medium',
                message: 'Add connections between shapes to create a clear navigation flow',
                affectedCount: shapes.length
            });
        }
    }

    /**
     * Check structural accessibility
     * @private
     */
    _checkStructure(diagram, results) {
        const shapes = diagram.cells.filter(c => c.vertex);

        // Check for shape size consistency
        let sizeVariation = 0;
        if (shapes.length > 1) {
            const sizes = shapes
                .filter(s => s.geometry)
                .map(s => s.geometry.width * s.geometry.height);

            if (sizes.length > 0) {
                const avgSize = sizes.reduce((a, b) => a + b, 0) / sizes.length;
                const maxDiff = Math.max(...sizes.map(s => Math.abs(s - avgSize)));
                sizeVariation = maxDiff / avgSize;
            }
        }

        results.checks.push({
            name: 'Visual Consistency',
            passed: sizeVariation < 3,
            message: sizeVariation < 3
                ? 'Shapes have consistent sizing'
                : 'Large size variation between shapes may confuse users',
            wcag: '1.4.8'
        });

        // Check minimum touch/click target size
        const tooSmall = shapes.filter(s => {
            if (!s.geometry) return false;
            return s.geometry.width < 44 || s.geometry.height < 44;
        });

        results.checks.push({
            name: 'Touch Target Size',
            passed: tooSmall.length === 0,
            message: tooSmall.length === 0
                ? 'All shapes meet minimum touch target size (44x44px)'
                : `${tooSmall.length} shape(s) are smaller than recommended touch target size`,
            wcag: '2.5.5'
        });

        if (tooSmall.length > 0) {
            results.recommendations.push({
                priority: 'medium',
                message: 'Increase shape size to at least 44x44px for touch accessibility',
                affectedCount: tooSmall.length
            });
        }
    }

    /**
     * Check label quality
     * @private
     */
    _checkLabels(diagram, results) {
        const shapes = diagram.cells.filter(c => c.vertex && c.value);

        // Check for meaningful labels (not just single characters or numbers)
        const poorLabels = shapes.filter(s => {
            const label = this.diagramReader._cleanHtml(s.value).trim();
            return label.length < 2 || /^[0-9]+$/.test(label);
        });

        const passed = poorLabels.length === 0;
        results.checks.push({
            name: 'Label Quality',
            passed: passed,
            message: passed
                ? 'All labels are descriptive'
                : `${poorLabels.length} shape(s) have non-descriptive labels`,
            wcag: '2.4.6'
        });

        if (!passed) {
            results.recommendations.push({
                priority: 'medium',
                message: 'Use descriptive labels instead of single characters or numbers',
                affectedCount: poorLabels.length
            });
        }

        // Check for unique labels
        const labels = shapes.map(s => this.diagramReader._cleanHtml(s.value).trim().toLowerCase());
        const uniqueLabels = new Set(labels);

        results.checks.push({
            name: 'Unique Labels',
            passed: uniqueLabels.size === labels.length,
            message: uniqueLabels.size === labels.length
                ? 'All shapes have unique labels'
                : `${labels.length - uniqueLabels.size} duplicate label(s) found`,
            wcag: '2.4.6'
        });
    }

    /**
     * Generate accessible description of diagram
     * @param {string} xmlString - The draw.io XML content
     * @returns {string} Accessible text description
     */
    generateAltText(xmlString) {
        const diagram = this.diagramReader.parseDiagram(xmlString);
        const shapes = diagram.cells.filter(c => c.vertex && c.value);

        let description = `Diagram: ${diagram.name}. `;
        description += `Contains ${shapes.length} shapes and ${diagram.connections.length} connections. `;

        // Describe main elements
        if (shapes.length > 0) {
            const labels = shapes
                .map(s => this.diagramReader._cleanHtml(s.value))
                .filter(l => l);

            if (labels.length <= 5) {
                description += `Elements include: ${labels.join(', ')}. `;
            } else {
                description += `Main elements include: ${labels.slice(0, 5).join(', ')}, and ${labels.length - 5} more. `;
            }
        }

        // Describe flow if connections exist
        if (diagram.connections.length > 0) {
            description += `The diagram shows ${diagram.connections.length} relationships between elements.`;
        }

        return description;
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
     * Extract font size from style string
     * @private
     */
    _extractFontSize(style) {
        const match = style.match(/fontSize=(\d+)/);
        return match ? parseInt(match[1]) : null;
    }

    /**
     * Calculate contrast ratio between two colors
     * @private
     */
    _calculateContrastRatio(bg, fg) {
        const bgLum = this._getLuminance(bg);
        const fgLum = this._getLuminance(fg);

        const lighter = Math.max(bgLum, fgLum);
        const darker = Math.min(bgLum, fgLum);

        return (lighter + 0.05) / (darker + 0.05);
    }

    /**
     * Calculate relative luminance of a color
     * @private
     */
    _getLuminance(color) {
        // Convert hex to RGB
        let hex = color.replace('#', '');
        if (hex.length === 3) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }

        const r = parseInt(hex.substr(0, 2), 16) / 255;
        const g = parseInt(hex.substr(2, 2), 16) / 255;
        const b = parseInt(hex.substr(4, 2), 16) / 255;

        const sRGB = [r, g, b].map(val => {
            return val <= 0.03928
                ? val / 12.92
                : Math.pow((val + 0.055) / 1.055, 2.4);
        });

        return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
    }

    /**
     * Get accessibility level from score
     * @private
     */
    _getAccessibilityLevel(score) {
        if (score >= 90) return 'AAA';
        if (score >= 70) return 'AA';
        if (score >= 50) return 'A';
        return 'Non-compliant';
    }

    /**
     * Get quick accessibility score
     * @param {string} xmlString - The draw.io XML content
     * @returns {Object} Quick score summary
     */
    getQuickScore(xmlString) {
        const results = this.check(xmlString);
        return {
            score: results.score,
            level: results.level,
            passedChecks: results.checks.filter(c => c.passed).length,
            totalChecks: results.checks.length,
            topRecommendation: results.recommendations[0] || null
        };
    }
}

module.exports = { AccessibilityChecker };
