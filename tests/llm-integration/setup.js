/**
 * Jest setup file for LLM integration tests
 */

// Mock DOMParser for JSDOM environment
if (typeof DOMParser === 'undefined') {
    global.DOMParser = window.DOMParser;
}

// Mock XMLSerializer for JSDOM environment
if (typeof XMLSerializer === 'undefined') {
    global.XMLSerializer = window.XMLSerializer;
}

// Set test timeout for LLM operations (may take longer)
jest.setTimeout(30000);
