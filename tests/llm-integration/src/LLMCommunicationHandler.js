/**
 * LLMCommunicationHandler - Handles communication between users and LLM about diagrams
 *
 * This class provides methods to:
 * - Process user messages
 * - Generate context from diagrams
 * - Format responses for users
 * - Handle diagram-related queries
 */
class LLMCommunicationHandler {
    constructor(diagramReader) {
        this.diagramReader = diagramReader;
        this.conversationHistory = [];
        this.currentDiagram = null;
        this.currentDiagramXml = null;
    }

    /**
     * Load a diagram into the conversation context
     * @param {string} xmlString - The draw.io XML content
     * @returns {Object} Result of loading the diagram
     */
    loadDiagram(xmlString) {
        try {
            this.currentDiagram = this.diagramReader.parseDiagram(xmlString);
            this.currentDiagramXml = xmlString;

            return {
                success: true,
                message: `Diagram "${this.currentDiagram.name}" loaded successfully`,
                summary: {
                    name: this.currentDiagram.name,
                    pages: this.currentDiagram.pages.length,
                    shapes: this.currentDiagram.cells.filter(c => c.vertex).length,
                    connections: this.currentDiagram.connections.length
                }
            };
        } catch (error) {
            return {
                success: false,
                message: `Failed to load diagram: ${error.message}`,
                error: error
            };
        }
    }

    /**
     * Process a user message and generate appropriate response
     * @param {string} userMessage - The user's message
     * @returns {Object} Response object with context and suggested response
     */
    processUserMessage(userMessage) {
        if (!userMessage || typeof userMessage !== 'string') {
            return {
                success: false,
                error: 'Invalid message: must be a non-empty string',
                response: null
            };
        }

        // Add to conversation history
        this.conversationHistory.push({
            role: 'user',
            content: userMessage,
            timestamp: new Date().toISOString()
        });

        // Analyze the message intent
        const intent = this._analyzeIntent(userMessage);

        // Generate response based on intent
        const response = this._generateResponse(intent, userMessage);

        // Add response to history
        this.conversationHistory.push({
            role: 'assistant',
            content: response.message,
            timestamp: new Date().toISOString()
        });

        return {
            success: true,
            intent: intent,
            response: response,
            diagramContext: this._getDiagramContext()
        };
    }

    /**
     * Analyze the intent of a user message
     * @private
     */
    _analyzeIntent(message) {
        const lowerMessage = message.toLowerCase();

        // Define intent patterns
        const intents = {
            describe: /describe|explain|what is|tell me about|overview/i,
            findShape: /find|where|locate|search|look for/i,
            listShapes: /list|show|all shapes|elements|components/i,
            countElements: /how many|count|number of/i,
            connections: /connect|link|relation|flow|arrow/i,
            help: /help|how do|can you|what can/i,
            greeting: /hello|hi|hey|good morning|good afternoon/i
        };

        for (const [intent, pattern] of Object.entries(intents)) {
            if (pattern.test(lowerMessage)) {
                return intent;
            }
        }

        return 'general';
    }

    /**
     * Generate a response based on intent
     * @private
     */
    _generateResponse(intent, message) {
        if (!this.currentDiagram && intent !== 'greeting' && intent !== 'help') {
            return {
                message: 'No diagram is currently loaded. Please load a diagram first.',
                type: 'error'
            };
        }

        switch (intent) {
            case 'greeting':
                return this._handleGreeting();
            case 'help':
                return this._handleHelp();
            case 'describe':
                return this._handleDescribe();
            case 'listShapes':
                return this._handleListShapes();
            case 'findShape':
                return this._handleFindShape(message);
            case 'countElements':
                return this._handleCount();
            case 'connections':
                return this._handleConnections();
            default:
                return this._handleGeneral(message);
        }
    }

    /**
     * Handle greeting intent
     * @private
     */
    _handleGreeting() {
        const hasDiagram = this.currentDiagram !== null;
        const diagramInfo = hasDiagram
            ? ` I see you have the diagram "${this.currentDiagram.name}" loaded.`
            : ' You can start by loading a diagram.';

        return {
            message: `Hello! I'm here to help you understand your draw.io diagrams.${diagramInfo} What would you like to know?`,
            type: 'greeting'
        };
    }

    /**
     * Handle help intent
     * @private
     */
    _handleHelp() {
        return {
            message: `I can help you with the following:
- Describe the overall diagram structure
- List all shapes and elements
- Find specific shapes by text
- Count elements (shapes, connections)
- Explain connections between shapes
- Answer questions about your diagram

Just ask me anything about your diagram!`,
            type: 'help'
        };
    }

    /**
     * Handle describe intent
     * @private
     */
    _handleDescribe() {
        const description = this.diagramReader.toTextDescription(this.currentDiagram);
        return {
            message: description,
            type: 'description'
        };
    }

    /**
     * Handle list shapes intent
     * @private
     */
    _handleListShapes() {
        const shapes = this.currentDiagram.cells.filter(c => c.vertex && c.value);
        const texts = shapes.map(s => this.diagramReader._cleanHtml(s.value)).filter(t => t);

        if (texts.length === 0) {
            return {
                message: 'No labeled shapes found in the diagram.',
                type: 'list'
            };
        }

        return {
            message: `Found ${texts.length} labeled shapes:\n${texts.map(t => `- ${t}`).join('\n')}`,
            type: 'list',
            data: texts
        };
    }

    /**
     * Handle find shape intent
     * @private
     */
    _handleFindShape(message) {
        // Extract search term from message
        const searchTerms = message.match(/["']([^"']+)["']|find\s+(\w+)|locate\s+(\w+)|search\s+for\s+(\w+)/i);
        let searchTerm = searchTerms ? (searchTerms[1] || searchTerms[2] || searchTerms[3] || searchTerms[4]) : null;

        if (!searchTerm) {
            return {
                message: 'Please specify what you\'re looking for. For example: "Find \'Login\'" or "Where is the database?"',
                type: 'clarification'
            };
        }

        const results = this.diagramReader.findByText(this.currentDiagram, searchTerm);

        if (results.length === 0) {
            return {
                message: `No shapes found containing "${searchTerm}".`,
                type: 'search',
                data: []
            };
        }

        const resultTexts = results.map(r => {
            const label = this.diagramReader._cleanHtml(r.value);
            const pos = r.geometry ? ` at position (${r.geometry.x}, ${r.geometry.y})` : '';
            return `- "${label}"${pos}`;
        });

        return {
            message: `Found ${results.length} shape(s) matching "${searchTerm}":\n${resultTexts.join('\n')}`,
            type: 'search',
            data: results
        };
    }

    /**
     * Handle count elements intent
     * @private
     */
    _handleCount() {
        const shapes = this.currentDiagram.cells.filter(c => c.vertex).length;
        const connections = this.currentDiagram.connections.length;
        const pages = this.currentDiagram.pages.length;

        return {
            message: `The diagram contains:\n- ${pages} page(s)\n- ${shapes} shape(s)\n- ${connections} connection(s)`,
            type: 'count',
            data: { shapes, connections, pages }
        };
    }

    /**
     * Handle connections intent
     * @private
     */
    _handleConnections() {
        const connections = this.currentDiagram.connections;

        if (connections.length === 0) {
            return {
                message: 'No connections found in the diagram.',
                type: 'connections'
            };
        }

        const shapes = this.currentDiagram.cells.filter(c => c.vertex);
        const connDescriptions = connections.map(conn => {
            const source = shapes.find(s => s.id === conn.source);
            const target = shapes.find(s => s.id === conn.target);
            const sourceLabel = source ? this.diagramReader._cleanHtml(source.value) || 'Unnamed' : 'Unknown';
            const targetLabel = target ? this.diagramReader._cleanHtml(target.value) || 'Unnamed' : 'Unknown';
            return `- "${sourceLabel}" connects to "${targetLabel}"`;
        });

        return {
            message: `Found ${connections.length} connection(s):\n${connDescriptions.join('\n')}`,
            type: 'connections',
            data: connections
        };
    }

    /**
     * Handle general/unknown intent
     * @private
     */
    _handleGeneral(message) {
        // Provide diagram context for general questions
        const context = this._getDiagramContext();

        return {
            message: `I understand you're asking about the diagram. Here's what I know:\n\n${context.summary}`,
            type: 'general',
            context: context
        };
    }

    /**
     * Get current diagram context for LLM
     * @private
     */
    _getDiagramContext() {
        if (!this.currentDiagram) {
            return {
                loaded: false,
                summary: 'No diagram loaded'
            };
        }

        return {
            loaded: true,
            name: this.currentDiagram.name,
            summary: this.diagramReader.toTextDescription(this.currentDiagram),
            shapes: this.currentDiagram.cells.filter(c => c.vertex).length,
            connections: this.currentDiagram.connections.length,
            allText: this.diagramReader.getAllText(this.currentDiagram)
        };
    }

    /**
     * Get conversation history
     * @returns {Array} Conversation history
     */
    getConversationHistory() {
        return [...this.conversationHistory];
    }

    /**
     * Clear conversation history
     */
    clearHistory() {
        this.conversationHistory = [];
    }

    /**
     * Check if a diagram is loaded
     * @returns {boolean}
     */
    hasDiagram() {
        return this.currentDiagram !== null;
    }

    /**
     * Get the raw XML of the current diagram
     * @returns {string|null}
     */
    getDiagramXml() {
        return this.currentDiagramXml;
    }
}

module.exports = { LLMCommunicationHandler };
