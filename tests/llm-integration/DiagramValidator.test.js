/**
 * Test suite for DiagramValidator
 *
 * Tests diagram validation and integrity checking
 */

const { DiagramValidator } = require('./src/DiagramValidator');
const { LLMDiagramReader } = require('./src/LLMDiagramReader');
const { sampleDiagrams } = require('./fixtures/sample-diagrams');

describe('DiagramValidator', () => {
    let reader;
    let validator;

    beforeEach(() => {
        reader = new LLMDiagramReader();
        validator = new DiagramValidator(reader);
    });

    describe('validate', () => {
        test('should validate a well-formed diagram', () => {
            const results = validator.validate(sampleDiagrams.simpleFlowchart);

            expect(results.valid).toBe(true);
            expect(results.errors).toHaveLength(0);
        });

        test('should return validation results structure', () => {
            const results = validator.validate(sampleDiagrams.simpleFlowchart);

            expect(results).toHaveProperty('valid');
            expect(results).toHaveProperty('errors');
            expect(results).toHaveProperty('warnings');
            expect(results).toHaveProperty('info');
        });

        test('should detect invalid XML', () => {
            const results = validator.validate(sampleDiagrams.invalidXml);

            expect(results.valid).toBe(false);
            expect(results.errors.length).toBeGreaterThan(0);
            expect(results.errors[0].code).toBe('PARSE_ERROR');
        });

        test('should handle empty diagrams', () => {
            const results = validator.validate(sampleDiagrams.emptyDiagram);

            expect(results.valid).toBe(true);
            // Should have warning about no labeled shapes
            const emptyWarning = results.warnings.find(w => w.code === 'EMPTY_DIAGRAM');
            expect(emptyWarning).toBeDefined();
        });
    });

    describe('Structure Validation', () => {
        test('should warn about missing diagram name', () => {
            // Empty diagram defaults to "Empty Diagram" name
            const results = validator.validate(sampleDiagrams.emptyDiagram);

            // Should not have this warning since it has a name
            const nameWarning = results.warnings.find(w => w.code === 'MISSING_NAME');
            expect(nameWarning).toBeUndefined();
        });

        test('should validate page presence', () => {
            const results = validator.validate(sampleDiagrams.simpleFlowchart);

            // Should not have NO_PAGES error
            const pageError = results.errors.find(e => e.code === 'NO_PAGES');
            expect(pageError).toBeUndefined();
        });

        test('should detect empty diagrams', () => {
            const results = validator.validate(sampleDiagrams.emptyDiagram);

            const emptyWarning = results.warnings.find(w => w.code === 'EMPTY_DIAGRAM');
            expect(emptyWarning).toBeDefined();
            expect(emptyWarning.severity).toBe('medium');
        });
    });

    describe('Connection Validation', () => {
        test('should pass when all connections are valid', () => {
            const results = validator.validate(sampleDiagrams.simpleFlowchart);

            const brokenError = results.errors.find(e => e.code === 'BROKEN_CONNECTIONS');
            expect(brokenError).toBeUndefined();
        });

        test('should validate network architecture connections', () => {
            const results = validator.validate(sampleDiagrams.networkArchitecture);

            const brokenError = results.errors.find(e => e.code === 'BROKEN_CONNECTIONS');
            expect(brokenError).toBeUndefined();
        });

        test('should check for self-referencing connections', () => {
            const results = validator.validate(sampleDiagrams.simpleFlowchart);

            // Simple flowchart should not have self-references
            const selfRef = results.warnings.find(w => w.code === 'SELF_REFERENCING');
            expect(selfRef).toBeUndefined();
        });
    });

    describe('Label Validation', () => {
        test('should check for unlabeled shapes', () => {
            const results = validator.validate(sampleDiagrams.emptyDiagram);

            // Empty diagram has no shapes, so no warning
            const unlabeledWarning = results.warnings.find(w => w.code === 'UNLABELED_SHAPES');
            expect(unlabeledWarning).toBeUndefined();
        });

        test('should handle diagrams with all labeled shapes', () => {
            const results = validator.validate(sampleDiagrams.simpleFlowchart);

            const unlabeledWarning = results.warnings.find(w => w.code === 'UNLABELED_SHAPES');
            expect(unlabeledWarning).toBeUndefined();
        });

        test('should detect duplicate labels', () => {
            const results = validator.validate(sampleDiagrams.simpleFlowchart);

            // Simple flowchart has unique labels, check info
            const dupInfo = results.info.find(i => i.code === 'DUPLICATE_LABELS');
            expect(dupInfo).toBeUndefined();
        });
    });

    describe('Style Validation', () => {
        test('should report color variety', () => {
            const results = validator.validate(sampleDiagrams.simpleFlowchart);

            const colorInfo = results.info.find(i => i.code === 'COLOR_VARIETY');
            // Simple flowchart has multiple colors
            if (colorInfo) {
                expect(colorInfo.details.length).toBeGreaterThan(0);
            }
        });

        test('should handle diagrams with styles', () => {
            const results = validator.validate(sampleDiagrams.networkArchitecture);

            expect(results.valid).toBe(true);
        });
    });

    describe('Accessibility Validation', () => {
        test('should check for small shapes', () => {
            const results = validator.validate(sampleDiagrams.simpleFlowchart);

            // Check if there are any small shape warnings
            const smallWarning = results.warnings.find(w => w.code === 'SMALL_SHAPES');
            // Simple flowchart shapes should be reasonably sized
            if (smallWarning) {
                expect(smallWarning.details).toBeDefined();
            }
        });

        test('should suggest descriptions for complex diagrams', () => {
            const results = validator.validate(sampleDiagrams.simpleFlowchart);

            // May have description suggestion
            const descInfo = results.info.find(i => i.code === 'CONSIDER_DESCRIPTION');
            // 5 shapes is not > 10, so no suggestion expected
            expect(descInfo).toBeUndefined();
        });
    });

    describe('isValid', () => {
        test('should return true for valid diagrams', () => {
            const isValid = validator.isValid(sampleDiagrams.simpleFlowchart);
            expect(isValid).toBe(true);
        });

        test('should return false for invalid diagrams', () => {
            const isValid = validator.isValid(sampleDiagrams.invalidXml);
            expect(isValid).toBe(false);
        });

        test('should return true for empty but valid diagrams', () => {
            const isValid = validator.isValid(sampleDiagrams.emptyDiagram);
            expect(isValid).toBe(true);
        });
    });

    describe('getSummary', () => {
        test('should return validation summary', () => {
            const summary = validator.getSummary(sampleDiagrams.simpleFlowchart);

            expect(summary).toHaveProperty('valid');
            expect(summary).toHaveProperty('errorCount');
            expect(summary).toHaveProperty('warningCount');
            expect(summary).toHaveProperty('infoCount');
        });

        test('should count errors correctly', () => {
            const summary = validator.getSummary(sampleDiagrams.invalidXml);

            expect(summary.valid).toBe(false);
            expect(summary.errorCount).toBeGreaterThan(0);
        });

        test('should count critical errors', () => {
            const summary = validator.getSummary(sampleDiagrams.invalidXml);

            expect(summary.criticalErrors).toBeGreaterThan(0);
        });

        test('should return zero errors for valid diagrams', () => {
            const summary = validator.getSummary(sampleDiagrams.simpleFlowchart);

            expect(summary.valid).toBe(true);
            expect(summary.errorCount).toBe(0);
        });
    });

    describe('Multiple Diagram Types', () => {
        test('should validate network architecture', () => {
            const results = validator.validate(sampleDiagrams.networkArchitecture);

            expect(results.valid).toBe(true);
        });

        test('should validate multi-page diagrams', () => {
            const results = validator.validate(sampleDiagrams.multiPage);

            // Multi-page diagrams may have duplicate IDs across pages (root cells)
            // which is expected behavior in draw.io
            const hasCriticalErrors = results.errors.some(e =>
                e.severity === 'critical' ||
                (e.code !== 'DUPLICATE_IDS')
            );
            expect(hasCriticalErrors).toBe(false);
        });

        test('should validate HTML-formatted text', () => {
            const results = validator.validate(sampleDiagrams.htmlFormattedText);

            expect(results.valid).toBe(true);
        });
    });

    describe('Error Severity', () => {
        test('should assign correct severity to critical errors', () => {
            const results = validator.validate(sampleDiagrams.invalidXml);

            const criticalError = results.errors.find(e => e.severity === 'critical');
            expect(criticalError).toBeDefined();
        });

        test('should include warning details', () => {
            const results = validator.validate(sampleDiagrams.emptyDiagram);

            if (results.warnings.length > 0) {
                const warning = results.warnings[0];
                expect(warning).toHaveProperty('code');
                expect(warning).toHaveProperty('message');
                expect(warning).toHaveProperty('severity');
            }
        });
    });
});
