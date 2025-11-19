/**
 * Test suite for AccessibilityChecker
 *
 * Tests WCAG compliance and accessibility features
 */

const { AccessibilityChecker } = require('./src/AccessibilityChecker');
const { LLMDiagramReader } = require('./src/LLMDiagramReader');
const { sampleDiagrams } = require('./fixtures/sample-diagrams');

describe('AccessibilityChecker', () => {
    let reader;
    let checker;

    beforeEach(() => {
        reader = new LLMDiagramReader();
        checker = new AccessibilityChecker(reader);
    });

    describe('check', () => {
        test('should perform accessibility check', () => {
            const results = checker.check(sampleDiagrams.simpleFlowchart);

            expect(results).toHaveProperty('score');
            expect(results).toHaveProperty('maxScore');
            expect(results).toHaveProperty('level');
            expect(results).toHaveProperty('checks');
            expect(results).toHaveProperty('recommendations');
        });

        test('should return score between 0 and 100', () => {
            const results = checker.check(sampleDiagrams.simpleFlowchart);

            expect(results.score).toBeGreaterThanOrEqual(0);
            expect(results.score).toBeLessThanOrEqual(100);
        });

        test('should determine accessibility level', () => {
            const results = checker.check(sampleDiagrams.simpleFlowchart);

            expect(['AAA', 'AA', 'A', 'Non-compliant']).toContain(results.level);
        });

        test('should include multiple accessibility checks', () => {
            const results = checker.check(sampleDiagrams.simpleFlowchart);

            expect(results.checks.length).toBeGreaterThan(0);

            // Each check should have required properties
            results.checks.forEach(check => {
                expect(check).toHaveProperty('name');
                expect(check).toHaveProperty('passed');
                expect(check).toHaveProperty('message');
            });
        });
    });

    describe('Alt Text Checks', () => {
        test('should check alt text coverage', () => {
            const results = checker.check(sampleDiagrams.simpleFlowchart);

            const altTextCheck = results.checks.find(c => c.name === 'Alt Text Coverage');
            expect(altTextCheck).toBeDefined();
            expect(altTextCheck.wcag).toBe('1.1.1');
        });

        test('should pass for fully labeled diagrams', () => {
            const results = checker.check(sampleDiagrams.simpleFlowchart);

            const altTextCheck = results.checks.find(c => c.name === 'Alt Text Coverage');
            expect(altTextCheck.passed).toBe(true);
            expect(altTextCheck.score).toBe(100);
        });

        test('should check for diagram description', () => {
            const results = checker.check(sampleDiagrams.simpleFlowchart);

            const descCheck = results.checks.find(c => c.name === 'Diagram Description');
            expect(descCheck).toBeDefined();
        });
    });

    describe('Color Contrast Checks', () => {
        test('should check color contrast', () => {
            const results = checker.check(sampleDiagrams.simpleFlowchart);

            const contrastCheck = results.checks.find(c => c.name === 'Color Contrast');
            expect(contrastCheck).toBeDefined();
            expect(contrastCheck.wcag).toBe('1.4.3');
        });

        test('should pass for good contrast', () => {
            const results = checker.check(sampleDiagrams.simpleFlowchart);

            const contrastCheck = results.checks.find(c => c.name === 'Color Contrast');
            // Most diagrams with light backgrounds and dark text should pass
            expect(contrastCheck.score).toBeGreaterThanOrEqual(80);
        });
    });

    describe('Text Size Checks', () => {
        test('should check text size', () => {
            const results = checker.check(sampleDiagrams.simpleFlowchart);

            const textSizeCheck = results.checks.find(c => c.name === 'Text Size');
            expect(textSizeCheck).toBeDefined();
            expect(textSizeCheck.wcag).toBe('1.4.4');
        });

        test('should pass when text size is adequate', () => {
            const results = checker.check(sampleDiagrams.simpleFlowchart);

            const textSizeCheck = results.checks.find(c => c.name === 'Text Size');
            expect(textSizeCheck.passed).toBe(true);
        });
    });

    describe('Navigation Structure Checks', () => {
        test('should check navigation structure', () => {
            const results = checker.check(sampleDiagrams.simpleFlowchart);

            const navCheck = results.checks.find(c => c.name === 'Navigation Structure');
            expect(navCheck).toBeDefined();
            expect(navCheck.wcag).toBe('2.4.3');
        });

        test('should pass for connected diagrams', () => {
            const results = checker.check(sampleDiagrams.simpleFlowchart);

            const navCheck = results.checks.find(c => c.name === 'Navigation Structure');
            expect(navCheck.passed).toBe(true);
        });
    });

    describe('Visual Consistency Checks', () => {
        test('should check visual consistency', () => {
            const results = checker.check(sampleDiagrams.simpleFlowchart);

            const consistencyCheck = results.checks.find(c => c.name === 'Visual Consistency');
            expect(consistencyCheck).toBeDefined();
        });

        test('should check touch target size', () => {
            const results = checker.check(sampleDiagrams.simpleFlowchart);

            const touchCheck = results.checks.find(c => c.name === 'Touch Target Size');
            expect(touchCheck).toBeDefined();
            expect(touchCheck.wcag).toBe('2.5.5');
        });
    });

    describe('Label Quality Checks', () => {
        test('should check label quality', () => {
            const results = checker.check(sampleDiagrams.simpleFlowchart);

            const labelCheck = results.checks.find(c => c.name === 'Label Quality');
            expect(labelCheck).toBeDefined();
            expect(labelCheck.wcag).toBe('2.4.6');
        });

        test('should pass for descriptive labels', () => {
            const results = checker.check(sampleDiagrams.simpleFlowchart);

            const labelCheck = results.checks.find(c => c.name === 'Label Quality');
            expect(labelCheck.passed).toBe(true);
        });

        test('should check for unique labels', () => {
            const results = checker.check(sampleDiagrams.simpleFlowchart);

            const uniqueCheck = results.checks.find(c => c.name === 'Unique Labels');
            expect(uniqueCheck).toBeDefined();
        });
    });

    describe('Recommendations', () => {
        test('should provide recommendations when needed', () => {
            const results = checker.check(sampleDiagrams.emptyDiagram);

            // Empty diagram should have some recommendations
            expect(Array.isArray(results.recommendations)).toBe(true);
        });

        test('should include priority in recommendations', () => {
            const results = checker.check(sampleDiagrams.emptyDiagram);

            if (results.recommendations.length > 0) {
                results.recommendations.forEach(rec => {
                    expect(rec).toHaveProperty('priority');
                    expect(['high', 'medium', 'low']).toContain(rec.priority);
                });
            }
        });

        test('should include affected count in recommendations', () => {
            const results = checker.check(sampleDiagrams.emptyDiagram);

            if (results.recommendations.length > 0) {
                const recWithCount = results.recommendations.find(r => r.affectedCount !== undefined);
                if (recWithCount) {
                    expect(typeof recWithCount.affectedCount).toBe('number');
                }
            }
        });
    });

    describe('generateAltText', () => {
        test('should generate alt text for diagram', () => {
            const altText = checker.generateAltText(sampleDiagrams.simpleFlowchart);

            expect(typeof altText).toBe('string');
            expect(altText.length).toBeGreaterThan(0);
        });

        test('should include diagram name', () => {
            const altText = checker.generateAltText(sampleDiagrams.simpleFlowchart);

            expect(altText).toContain('Simple Flowchart');
        });

        test('should include shape count', () => {
            const altText = checker.generateAltText(sampleDiagrams.simpleFlowchart);

            expect(altText).toContain('5 shapes');
        });

        test('should include connection count', () => {
            const altText = checker.generateAltText(sampleDiagrams.simpleFlowchart);

            expect(altText).toContain('4 connections');
        });

        test('should list main elements', () => {
            const altText = checker.generateAltText(sampleDiagrams.simpleFlowchart);

            expect(altText).toContain('Start');
            expect(altText).toContain('Process Data');
        });

        test('should describe relationships', () => {
            const altText = checker.generateAltText(sampleDiagrams.simpleFlowchart);

            expect(altText).toContain('relationships');
        });

        test('should handle empty diagrams', () => {
            const altText = checker.generateAltText(sampleDiagrams.emptyDiagram);

            expect(altText).toContain('0 shapes');
            expect(altText).toContain('0 connections');
        });

        test('should handle large diagrams', () => {
            const altText = checker.generateAltText(sampleDiagrams.networkArchitecture);

            expect(altText).toBeDefined();
            // Should mention "more" for diagrams with many elements
            expect(altText.length).toBeGreaterThan(0);
        });
    });

    describe('getQuickScore', () => {
        test('should return quick score summary', () => {
            const summary = checker.getQuickScore(sampleDiagrams.simpleFlowchart);

            expect(summary).toHaveProperty('score');
            expect(summary).toHaveProperty('level');
            expect(summary).toHaveProperty('passedChecks');
            expect(summary).toHaveProperty('totalChecks');
        });

        test('should include top recommendation', () => {
            const summary = checker.getQuickScore(sampleDiagrams.emptyDiagram);

            expect(summary).toHaveProperty('topRecommendation');
        });

        test('should calculate correct check counts', () => {
            const results = checker.check(sampleDiagrams.simpleFlowchart);
            const summary = checker.getQuickScore(sampleDiagrams.simpleFlowchart);

            expect(summary.totalChecks).toBe(results.checks.length);
            expect(summary.passedChecks).toBe(results.checks.filter(c => c.passed).length);
        });
    });

    describe('Accessibility Levels', () => {
        test('should return AAA for high scores', () => {
            const results = checker.check(sampleDiagrams.simpleFlowchart);

            if (results.score >= 90) {
                expect(results.level).toBe('AAA');
            }
        });

        test('should return appropriate level for score', () => {
            const results = checker.check(sampleDiagrams.simpleFlowchart);

            if (results.score >= 90) {
                expect(results.level).toBe('AAA');
            } else if (results.score >= 70) {
                expect(results.level).toBe('AA');
            } else if (results.score >= 50) {
                expect(results.level).toBe('A');
            } else {
                expect(results.level).toBe('Non-compliant');
            }
        });
    });

    describe('Different Diagram Types', () => {
        test('should check network architecture', () => {
            const results = checker.check(sampleDiagrams.networkArchitecture);

            expect(results.score).toBeGreaterThanOrEqual(0);
            expect(results.checks.length).toBeGreaterThan(0);
        });

        test('should check multi-page diagrams', () => {
            const results = checker.check(sampleDiagrams.multiPage);

            expect(results.score).toBeGreaterThanOrEqual(0);
        });

        test('should handle HTML-formatted text', () => {
            const results = checker.check(sampleDiagrams.htmlFormattedText);

            expect(results.score).toBeGreaterThanOrEqual(0);
        });

        test('should handle empty diagrams', () => {
            const results = checker.check(sampleDiagrams.emptyDiagram);

            expect(results.score).toBeGreaterThanOrEqual(0);
            // Empty diagrams should have lower accessibility scores
            expect(results.recommendations.length).toBeGreaterThan(0);
        });
    });
});
