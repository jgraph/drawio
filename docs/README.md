# draw.io - Enhanced LLM Integration Edition

[![Version](https://img.shields.io/badge/version-28.0.7-blue.svg)](https://github.com/jgraph/drawio)
[![License](https://img.shields.io/badge/license-Apache%202.0-green.svg)](LICENSE)
[![Tests](https://img.shields.io/badge/tests-179%20passing-brightgreen.svg)](tests/llm-integration)
[![Docker](https://img.shields.io/badge/docker-ready-blue.svg)](docker/README.md)

Free, open-source diagram software with enhanced LLM (Large Language Model) integration capabilities for intelligent diagram understanding and accessibility.

## Features

### Core draw.io Features
- Create flowcharts, UML diagrams, network diagrams, and more
- Import from Visio, Lucidchart, and Gliffy
- Export to PNG, SVG, PDF, and other formats
- Cloud storage integration (Google Drive, OneDrive, Dropbox, GitHub)
- Real-time collaboration support

### Enhanced LLM Integration
- **Diagram Reading**: Parse and understand diagram structure programmatically
- **Natural Language**: Convert diagrams to human-readable descriptions
- **User Communication**: Intelligent Q&A about diagram contents
- **Export Flexibility**: JSON, SVG, PNG with embed code generation
- **Validation**: Automatic diagram quality and structure checking
- **Accessibility**: WCAG compliance checking and alt-text generation

## Quick Start

### Using Docker (Recommended)

#### Windows 11 (PowerShell)
```powershell
# Build and run
.\docker\scripts\build.ps1
.\docker\scripts\run.ps1
```

#### Linux/macOS
```bash
# Build and run
docker-compose up -d
```

Access draw.io at: **http://localhost:8080**

### Manual Installation

#### Prerequisites
- Java JDK 21+
- Apache Tomcat 10.1+
- Node.js 20+ (for tests)

#### Build from Source
```bash
# Compile Java servlets
javac -d src/main/webapp/WEB-INF/classes \
  -cp "src/main/webapp/WEB-INF/lib/*" \
  src/main/java/com/mxgraph/online/*.java

# Deploy to Tomcat
cp -r src/main/webapp $TOMCAT_HOME/webapps/drawio
```

## LLM Integration Components

### Overview

The LLM integration suite provides tools for AI systems to understand, analyze, and communicate about draw.io diagrams.

| Component | Purpose |
|-----------|---------|
| [LLMDiagramReader](docs/api/LLMDiagramReader.md) | Parse diagrams, extract elements |
| [LLMCommunicationHandler](docs/api/LLMCommunicationHandler.md) | Handle user conversations |
| [DiagramExporter](docs/api/DiagramExporter.md) | Export to multiple formats |
| [DiagramValidator](docs/api/DiagramValidator.md) | Validate structure and quality |
| [AccessibilityChecker](docs/api/AccessibilityChecker.md) | WCAG compliance checking |

### Example Usage

```javascript
const { LLMDiagramReader } = require('./src/LLMDiagramReader');
const { LLMCommunicationHandler } = require('./src/LLMCommunicationHandler');

// Initialize
const reader = new LLMDiagramReader();
const handler = new LLMCommunicationHandler(reader);

// Load a diagram
handler.loadDiagram(diagramXml);

// Ask questions about it
const response = handler.processUserMessage('Describe this diagram');
console.log(response.response.message);

// Get text description for LLM context
const description = reader.toTextDescription(diagram);
```

## Testing

### Run All Tests
```bash
cd tests/llm-integration
npm install
npm test
```

### Test Coverage
```bash
npm test -- --coverage
```

### Test Results
- **179 tests** across 5 test suites
- All tests passing
- Components covered:
  - Diagram parsing and reading
  - User communication and intent detection
  - Export to multiple formats
  - Validation and error detection
  - Accessibility compliance

## Project Structure

```
drawio/
├── src/
│   └── main/
│       ├── java/           # Java servlets (26 files)
│       └── webapp/         # Web application
│           ├── js/         # JavaScript modules
│           ├── plugins/    # Optional features
│           └── WEB-INF/    # Server configuration
├── tests/
│   └── llm-integration/    # LLM integration tests
│       ├── src/            # Test utilities and components
│       ├── fixtures/       # Test data
│       └── *.test.js       # Test suites
├── docker/                 # Docker configuration
│   ├── scripts/            # Build/run scripts
│   └── nginx/              # Reverse proxy config
├── docs/                   # Documentation
└── etc/                    # Build tools
```

## Documentation

- [Docker Setup Guide](docker/README.md)
- [LLM Integration API](docs/LLM-INTEGRATION.md)
- [Component Reference](docs/COMPONENTS.md)
- [Testing Guide](docs/TESTING.md)
- [Contributing](docs/CONTRIBUTING.md)

## Architecture

### Frontend
- Modular JavaScript with minified bundles
- MXGraph library for diagram rendering
- Plugin system for extensibility
- Service workers for offline support

### Backend
- Java servlets for OAuth, proxying, and export
- RESTful API endpoints
- Cloud storage integrations

### LLM Integration Layer
- XML parsing and element extraction
- Intent detection and conversation handling
- Multi-format export generation
- Accessibility analysis

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `/proxy` | HTTP proxy service |
| `/export` | Diagram export service |
| `/convert` | Format conversion |
| `/github2` | GitHub OAuth |
| `/google` | Google OAuth |
| `/microsoft` | Microsoft OAuth |
| `/dropbox` | Dropbox OAuth |
| `/gitlab` | GitLab OAuth |
| `/embed.js` | Basic embed script |
| `/embed2.js` | Advanced embed with stencils |

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `CATALINA_OPTS` | JVM memory settings | `-Xms512m -Xmx1024m` |

### OAuth Setup

To enable cloud storage, configure credentials in `WEB-INF/`:
- `github_client_id` / `github_client_secret`
- `google_client_id` / `google_client_secret`
- `dropbox_client_id` / `dropbox_client_secret`

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](docs/CONTRIBUTING.md) for guidelines.

### Development Setup
```bash
# Clone the repository
git clone https://github.com/jgraph/drawio.git
cd drawio

# Run with dev mode
# Add ?dev=1 to URL for unminified JavaScript
```

### Running Tests
```bash
cd tests/llm-integration
npm install
npm test
```

## License

Copyright (c) 2024, JGraph Ltd and draw.io AG

Licensed under the Apache License, Version 2.0. See [LICENSE](LICENSE) for details.

## Support

- **Issues**: [GitHub Issues](https://github.com/jgraph/drawio/issues)
- **Documentation**: [docs.diagrams.net](https://docs.diagrams.net)
- **Community**: [draw.io Community](https://community.draw.io)

## Acknowledgments

- [MXGraph](https://github.com/jgraph/mxgraph) - Diagramming library
- [Apache Tomcat](https://tomcat.apache.org) - Web server
- [Jest](https://jestjs.io) - Testing framework
