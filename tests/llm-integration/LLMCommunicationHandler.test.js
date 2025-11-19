/**
 * Test suite for LLMCommunicationHandler
 *
 * These tests ensure the LLM can effectively communicate with users about their diagrams
 */

const { LLMCommunicationHandler } = require('./src/LLMCommunicationHandler');
const { LLMDiagramReader } = require('./src/LLMDiagramReader');
const { sampleDiagrams } = require('./fixtures/sample-diagrams');

describe('LLMCommunicationHandler', () => {
    let reader;
    let handler;

    beforeEach(() => {
        reader = new LLMDiagramReader();
        handler = new LLMCommunicationHandler(reader);
    });

    describe('loadDiagram', () => {
        test('should successfully load a valid diagram', () => {
            const result = handler.loadDiagram(sampleDiagrams.simpleFlowchart);

            expect(result.success).toBe(true);
            expect(result.message).toContain('loaded successfully');
            expect(result.summary).toBeDefined();
            expect(result.summary.name).toBe('Simple Flowchart');
        });

        test('should return error for invalid diagram', () => {
            const result = handler.loadDiagram(sampleDiagrams.invalidXml);

            expect(result.success).toBe(false);
            expect(result.message).toContain('Failed to load');
            expect(result.error).toBeDefined();
        });

        test('should update hasDiagram state after loading', () => {
            expect(handler.hasDiagram()).toBe(false);

            handler.loadDiagram(sampleDiagrams.simpleFlowchart);

            expect(handler.hasDiagram()).toBe(true);
        });

        test('should store diagram XML for retrieval', () => {
            handler.loadDiagram(sampleDiagrams.simpleFlowchart);

            const xml = handler.getDiagramXml();
            expect(xml).toBe(sampleDiagrams.simpleFlowchart);
        });

        test('should include shape and connection counts in summary', () => {
            const result = handler.loadDiagram(sampleDiagrams.simpleFlowchart);

            expect(result.summary.shapes).toBe(5);
            expect(result.summary.connections).toBe(4);
        });
    });

    describe('processUserMessage - Greetings', () => {
        test('should respond to greeting when no diagram loaded', () => {
            const result = handler.processUserMessage('Hello!');

            expect(result.success).toBe(true);
            expect(result.intent).toBe('greeting');
            expect(result.response.message).toContain('Hello');
            expect(result.response.message).toContain('loading a diagram');
        });

        test('should respond to greeting with diagram context', () => {
            handler.loadDiagram(sampleDiagrams.simpleFlowchart);
            const result = handler.processUserMessage('Hi there!');

            expect(result.success).toBe(true);
            expect(result.response.message).toContain('Simple Flowchart');
        });

        test('should recognize various greeting formats', () => {
            const greetings = ['Hello', 'Hi', 'Hey', 'Good morning', 'Good afternoon'];

            greetings.forEach(greeting => {
                const result = handler.processUserMessage(greeting);
                expect(result.intent).toBe('greeting');
            });
        });
    });

    describe('processUserMessage - Help', () => {
        test('should provide help information', () => {
            const result = handler.processUserMessage('Help me');

            expect(result.success).toBe(true);
            expect(result.intent).toBe('help');
            expect(result.response.message).toContain('Describe');
            expect(result.response.message).toContain('List');
            expect(result.response.message).toContain('Find');
        });

        test('should recognize various help requests', () => {
            const helpRequests = ['help', 'How do I use this?', 'Can you help?', 'What can you do?'];

            helpRequests.forEach(request => {
                const result = handler.processUserMessage(request);
                expect(result.intent).toBe('help');
            });
        });
    });

    describe('processUserMessage - Describe Diagram', () => {
        beforeEach(() => {
            handler.loadDiagram(sampleDiagrams.simpleFlowchart);
        });

        test('should describe the loaded diagram', () => {
            const result = handler.processUserMessage('Describe this diagram');

            expect(result.success).toBe(true);
            expect(result.intent).toBe('describe');
            expect(result.response.message).toContain('Simple Flowchart');
            expect(result.response.message).toContain('Shapes');
        });

        test('should recognize various describe requests', () => {
            const describeRequests = [
                'Describe this',
                'Explain the diagram',
                'What is this diagram about?',
                'Tell me about this',
                'Give me an overview'
            ];

            describeRequests.forEach(request => {
                const result = handler.processUserMessage(request);
                expect(result.intent).toBe('describe');
            });
        });

        test('should include connections in description', () => {
            const result = handler.processUserMessage('Explain this diagram');

            expect(result.response.message).toContain('Connections');
            expect(result.response.message).toContain('->');
        });
    });

    describe('processUserMessage - List Shapes', () => {
        beforeEach(() => {
            handler.loadDiagram(sampleDiagrams.simpleFlowchart);
        });

        test('should list all shapes in the diagram', () => {
            const result = handler.processUserMessage('List all shapes');

            expect(result.success).toBe(true);
            expect(result.intent).toBe('listShapes');
            expect(result.response.message).toContain('Start');
            expect(result.response.message).toContain('Process Data');
            expect(result.response.message).toContain('Success');
            expect(result.response.message).toContain('Error');
        });

        test('should include shape count', () => {
            const result = handler.processUserMessage('Show all elements');

            expect(result.response.message).toContain('5');
        });

        test('should handle empty diagrams', () => {
            handler.loadDiagram(sampleDiagrams.emptyDiagram);
            const result = handler.processUserMessage('List all shapes');

            expect(result.response.message).toContain('No labeled shapes found');
        });

        test('should recognize various list requests', () => {
            const listRequests = [
                'List all shapes',
                'Show all elements',
                'What shapes are in this diagram?'
            ];

            listRequests.forEach(request => {
                const result = handler.processUserMessage(request);
                expect(result.intent).toBe('listShapes');
            });
        });
    });

    describe('processUserMessage - Find Shape', () => {
        beforeEach(() => {
            handler.loadDiagram(sampleDiagrams.simpleFlowchart);
        });

        test('should find shape by quoted text', () => {
            const result = handler.processUserMessage('Find "Start"');

            expect(result.success).toBe(true);
            expect(result.intent).toBe('findShape');
            expect(result.response.message).toContain('Start');
            expect(result.response.data).toHaveLength(1);
        });

        test('should find shape by unquoted text', () => {
            const result = handler.processUserMessage('Find Process');

            expect(result.response.message).toContain('Process');
        });

        test('should handle search with no results', () => {
            const result = handler.processUserMessage('Find "NonExistent"');

            expect(result.response.message).toContain('No shapes found');
            expect(result.response.data).toHaveLength(0);
        });

        test('should find multiple matching shapes', () => {
            handler.loadDiagram(sampleDiagrams.networkArchitecture);
            const result = handler.processUserMessage('Find "Server"');

            expect(result.response.data.length).toBe(2);
        });

        test('should include position information', () => {
            const result = handler.processUserMessage('Find "Start"');

            expect(result.response.message).toContain('position');
        });

        test('should ask for clarification when no search term provided', () => {
            const result = handler.processUserMessage('Find');

            expect(result.response.type).toBe('clarification');
            expect(result.response.message).toContain('specify');
        });

        test('should recognize various find requests', () => {
            const findRequests = [
                'Find "Start"',
                'Where is the database?',
                'Locate "Process"',
                'Search for error'
            ];

            findRequests.forEach(request => {
                const result = handler.processUserMessage(request);
                expect(result.intent).toBe('findShape');
            });
        });
    });

    describe('processUserMessage - Count Elements', () => {
        beforeEach(() => {
            handler.loadDiagram(sampleDiagrams.simpleFlowchart);
        });

        test('should count elements in the diagram', () => {
            const result = handler.processUserMessage('How many shapes are there?');

            expect(result.success).toBe(true);
            expect(result.intent).toBe('countElements');
            expect(result.response.data.shapes).toBe(5);
            expect(result.response.data.connections).toBe(4);
            expect(result.response.data.pages).toBe(1);
        });

        test('should format count message properly', () => {
            const result = handler.processUserMessage('Count the elements');

            expect(result.response.message).toContain('shape(s)');
            expect(result.response.message).toContain('connection(s)');
            expect(result.response.message).toContain('page(s)');
        });

        test('should recognize various count requests', () => {
            const countRequests = [
                'How many elements are there?',
                'Count the shapes',
                'What is the number of connections?'
            ];

            countRequests.forEach(request => {
                const result = handler.processUserMessage(request);
                expect(result.intent).toBe('countElements');
            });
        });
    });

    describe('processUserMessage - Connections', () => {
        beforeEach(() => {
            handler.loadDiagram(sampleDiagrams.simpleFlowchart);
        });

        test('should describe connections in the diagram', () => {
            const result = handler.processUserMessage('Show me the connections');

            expect(result.success).toBe(true);
            expect(result.intent).toBe('connections');
            expect(result.response.message).toContain('connects to');
        });

        test('should list all connections', () => {
            const result = handler.processUserMessage('What are the relationships?');

            expect(result.response.data).toHaveLength(4);
        });

        test('should handle diagrams with no connections', () => {
            handler.loadDiagram(sampleDiagrams.emptyDiagram);
            const result = handler.processUserMessage('Show connections');

            expect(result.response.message).toContain('No connections found');
        });

        test('should recognize various connection requests', () => {
            const connectionRequests = [
                'Show the connections',
                'What are the links?',
                'How do they relate?',
                'Show me the flow',
                'What are the arrows?'
            ];

            connectionRequests.forEach(request => {
                const result = handler.processUserMessage(request);
                expect(result.intent).toBe('connections');
            });
        });
    });

    describe('processUserMessage - Error Handling', () => {
        test('should return error for null message', () => {
            const result = handler.processUserMessage(null);

            expect(result.success).toBe(false);
            expect(result.error).toContain('Invalid message');
        });

        test('should return error for empty message', () => {
            const result = handler.processUserMessage('');

            expect(result.success).toBe(false);
        });

        test('should handle queries when no diagram is loaded', () => {
            const result = handler.processUserMessage('List all shapes');

            expect(result.response.message).toContain('No diagram is currently loaded');
        });
    });

    describe('Conversation History', () => {
        test('should track conversation history', () => {
            handler.loadDiagram(sampleDiagrams.simpleFlowchart);
            handler.processUserMessage('Hello');
            handler.processUserMessage('List shapes');

            const history = handler.getConversationHistory();

            expect(history).toHaveLength(4); // 2 user + 2 assistant
            expect(history[0].role).toBe('user');
            expect(history[1].role).toBe('assistant');
        });

        test('should include timestamps in history', () => {
            handler.processUserMessage('Hello');

            const history = handler.getConversationHistory();

            expect(history[0].timestamp).toBeDefined();
        });

        test('should clear history', () => {
            handler.processUserMessage('Hello');
            handler.processUserMessage('Help');

            handler.clearHistory();

            expect(handler.getConversationHistory()).toHaveLength(0);
        });
    });

    describe('Diagram Context', () => {
        test('should provide diagram context with response', () => {
            handler.loadDiagram(sampleDiagrams.simpleFlowchart);
            const result = handler.processUserMessage('Tell me about this');

            expect(result.diagramContext).toBeDefined();
            expect(result.diagramContext.loaded).toBe(true);
            expect(result.diagramContext.name).toBe('Simple Flowchart');
        });

        test('should include all text from diagram in context', () => {
            handler.loadDiagram(sampleDiagrams.simpleFlowchart);
            const result = handler.processUserMessage('What is this?');

            expect(result.diagramContext.allText).toContain('Start');
            expect(result.diagramContext.allText).toContain('Process Data');
        });

        test('should indicate when no diagram is loaded', () => {
            const result = handler.processUserMessage('Hello');

            expect(result.diagramContext.loaded).toBe(false);
        });
    });

    describe('General/Unknown Intent', () => {
        beforeEach(() => {
            handler.loadDiagram(sampleDiagrams.simpleFlowchart);
        });

        test('should handle unknown queries gracefully', () => {
            const result = handler.processUserMessage('Some random question about cats');

            expect(result.success).toBe(true);
            expect(result.intent).toBe('general');
            expect(result.response.context).toBeDefined();
        });

        test('should provide diagram summary for general queries', () => {
            const result = handler.processUserMessage('Tell me something');

            expect(result.response.message).toContain('diagram');
        });
    });

    describe('Complex Conversation Scenarios', () => {
        test('should handle a complete user workflow', () => {
            // User loads diagram and asks multiple questions
            const loadResult = handler.loadDiagram(sampleDiagrams.networkArchitecture);
            expect(loadResult.success).toBe(true);

            const greeting = handler.processUserMessage('Hello');
            expect(greeting.intent).toBe('greeting');

            const describe = handler.processUserMessage('Describe this diagram');
            expect(describe.response.message).toContain('Network Architecture');

            const find = handler.processUserMessage('Find "Database"');
            expect(find.response.data).toHaveLength(1);

            const connections = handler.processUserMessage('What connects to the database?');
            expect(connections.intent).toBe('connections');

            const count = handler.processUserMessage('How many servers are there?');
            expect(count.intent).toBe('countElements');

            // Check full history
            const history = handler.getConversationHistory();
            expect(history.length).toBe(10); // 5 user + 5 assistant messages
        });

        test('should maintain context across multiple questions', () => {
            handler.loadDiagram(sampleDiagrams.simpleFlowchart);

            handler.processUserMessage('What shapes are there?');
            handler.processUserMessage('How are they connected?');
            handler.processUserMessage('Where is the decision point?');

            const history = handler.getConversationHistory();

            // All responses should be about the same diagram
            history.filter(h => h.role === 'assistant').forEach(response => {
                // Responses should contain relevant diagram information
                expect(response.content).toBeDefined();
                expect(response.content.length).toBeGreaterThan(0);
            });
        });
    });

    describe('Edge Cases', () => {
        test('should handle diagram with special characters in text', () => {
            handler.loadDiagram(sampleDiagrams.htmlFormattedText);
            const result = handler.processUserMessage('List all shapes');

            expect(result.success).toBe(true);
            expect(result.response.message).toContain('Bold Title');
        });

        test('should handle very long messages', () => {
            handler.loadDiagram(sampleDiagrams.simpleFlowchart);
            const longMessage = 'Can you please tell me about ' + 'the diagram '.repeat(50);
            const result = handler.processUserMessage(longMessage);

            expect(result.success).toBe(true);
        });

        test('should handle rapid successive messages', () => {
            handler.loadDiagram(sampleDiagrams.simpleFlowchart);

            const messages = ['Hello', 'List shapes', 'Count elements', 'Show connections'];
            messages.forEach(msg => {
                const result = handler.processUserMessage(msg);
                expect(result.success).toBe(true);
            });

            expect(handler.getConversationHistory()).toHaveLength(8);
        });
    });
});
