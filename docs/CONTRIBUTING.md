# Contributing to draw.io

Thank you for your interest in contributing to draw.io! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing Requirements](#testing-requirements)
- [Documentation](#documentation)

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment. Be kind, constructive, and professional in all interactions.

## Getting Started

### Finding Issues

1. Check [GitHub Issues](https://github.com/jgraph/drawio/issues) for open tasks
2. Look for issues labeled `good first issue` or `help wanted`
3. Comment on an issue before starting work to avoid duplicates

### Types of Contributions

- **Bug fixes**: Fix reported issues
- **Features**: Add new functionality
- **Documentation**: Improve or add documentation
- **Tests**: Add or improve test coverage
- **Performance**: Optimize existing code

## Development Setup

### Prerequisites

- Git
- Java JDK 21+
- Node.js 20+
- Docker (optional, for testing)

### Clone and Setup

```bash
# Fork the repository on GitHub first, then:
git clone https://github.com/YOUR_USERNAME/drawio.git
cd drawio

# Add upstream remote
git remote add upstream https://github.com/jgraph/drawio.git
```

### Install Dependencies

```bash
# For LLM integration tests
cd tests/llm-integration
npm install
```

### Build the Project

```bash
# Compile Java servlets
javac -d src/main/webapp/WEB-INF/classes \
  -cp "src/main/webapp/WEB-INF/lib/*" \
  src/main/java/com/mxgraph/online/*.java
```

### Run in Development Mode

Access draw.io with `?dev=1` parameter for unminified JavaScript:
```
http://localhost:8080/?dev=1
```

## Making Changes

### Create a Branch

```bash
# Update main branch
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/your-feature-name
```

### Branch Naming

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `test/` - Test additions/changes
- `refactor/` - Code refactoring

### Commit Messages

Use clear, descriptive commit messages:

```
Add diagram export to JSON format

- Implement exportToJSON method in DiagramExporter
- Add shape positions and metadata to output
- Include 15 tests for JSON export functionality
```

**Format:**
```
<type>: <short summary>

<detailed description if needed>
```

**Types:**
- `Add` - New feature
- `Fix` - Bug fix
- `Update` - Enhancement
- `Remove` - Removal
- `Refactor` - Code restructuring
- `Docs` - Documentation
- `Test` - Test changes

### Keep Changes Focused

- One feature/fix per pull request
- Small, reviewable changes
- Don't mix refactoring with features

## Pull Request Process

### Before Submitting

1. **Run all tests**
   ```bash
   cd tests/llm-integration
   npm test
   ```

2. **Check code style**
   - No linting errors
   - Consistent formatting

3. **Update documentation**
   - Add JSDoc comments
   - Update relevant docs

4. **Update CHANGELOG** (if applicable)

### Submitting a PR

1. Push your branch:
   ```bash
   git push origin feature/your-feature-name
   ```

2. Open a Pull Request on GitHub

3. Fill out the PR template:
   ```markdown
   ## Summary
   Brief description of changes

   ## Changes
   - List of specific changes
   - Another change

   ## Testing
   - [ ] All tests pass
   - [ ] Added new tests for this feature
   - [ ] Manual testing completed

   ## Screenshots (if UI changes)

   ## Related Issues
   Fixes #123
   ```

### Review Process

1. Maintainers will review your PR
2. Address any requested changes
3. Keep the PR updated with main branch
4. Once approved, it will be merged

### After Merge

```bash
# Update your local main
git checkout main
git pull upstream main

# Delete your feature branch
git branch -d feature/your-feature-name
git push origin --delete feature/your-feature-name
```

## Coding Standards

### JavaScript

```javascript
/**
 * Description of function
 * @param {string} param1 - Description
 * @param {Object} options - Options object
 * @returns {Object} Description of return value
 */
function myFunction(param1, options = {}) {
    // Use const for constants
    const MAX_SIZE = 100;

    // Use let for variables
    let result = [];

    // Use template literals
    const message = `Processing ${param1}`;

    // Early returns for validation
    if (!param1) {
        throw new Error('param1 is required');
    }

    // Descriptive variable names
    const processedItems = items.map(item => {
        return transform(item);
    });

    return {
        success: true,
        data: processedItems
    };
}
```

### Java

```java
/**
 * Description of method
 * @param request The HTTP request
 * @param response The HTTP response
 * @throws IOException If an I/O error occurs
 */
protected void doGet(HttpServletRequest request,
        HttpServletResponse response) throws ServletException, IOException
{
    // Validate input early
    String param = request.getParameter("param");
    if (param == null || param.isEmpty())
    {
        response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
        return;
    }

    // Use try-with-resources
    try (InputStream in = getServletContext().getResourceAsStream(path))
    {
        // Process stream
    }
}
```

### General Guidelines

- Use meaningful variable/function names
- Keep functions focused and small
- Add comments for complex logic
- Handle errors gracefully
- No console.log in production code (use proper logging)

## Testing Requirements

### All Changes Must

1. Pass existing tests
2. Include new tests for new functionality
3. Maintain or improve code coverage

### Test Guidelines

```javascript
describe('ComponentName', () => {
    describe('methodName', () => {
        test('should handle normal case', () => {
            // Arrange
            const input = createTestInput();

            // Act
            const result = component.methodName(input);

            // Assert
            expect(result.success).toBe(true);
        });

        test('should handle edge case', () => {
            expect(() => {
                component.methodName(null);
            }).toThrow('Input is required');
        });
    });
});
```

### Running Tests

```bash
# All tests
npm test

# With coverage
npm test -- --coverage

# Specific file
npm test -- DiagramExporter.test.js

# Watch mode
npm test -- --watch
```

### Coverage Requirements

- Minimum 90% line coverage for new code
- All public methods must be tested
- Edge cases and error paths must be tested

## Documentation

### Code Documentation

Use JSDoc for JavaScript:

```javascript
/**
 * Export diagram to JSON format
 *
 * @param {string} xmlString - The draw.io XML content
 * @returns {Object} JSON representation with shapes and connections
 * @throws {Error} If XML is invalid
 *
 * @example
 * const json = exporter.exportToJSON(diagramXml);
 * console.log(json.diagram.shapes);
 */
exportToJSON(xmlString) {
    // Implementation
}
```

### README Updates

If your change affects usage, update relevant documentation:

- `docs/README.md` - Main project overview
- `docs/LLM-INTEGRATION.md` - API documentation
- `docs/TESTING.md` - Test documentation
- `docker/README.md` - Docker usage

### Changelog

For significant changes, add to CHANGELOG:

```markdown
## [Unreleased]

### Added
- New diagram export format (JSON)
- Accessibility checker for WCAG compliance

### Fixed
- Broken connection detection in validator

### Changed
- Improved intent detection accuracy
```

## Areas for Contribution

### High Priority

- Additional export formats
- More accessibility checks
- Performance optimizations
- Better error messages
- Additional test coverage

### Good First Issues

- Documentation improvements
- Adding test cases
- Code cleanup
- Bug fixes with clear reproduction steps

### Feature Ideas

- Diagram diff/comparison
- Version history
- Collaborative editing enhancements
- Additional LLM integrations
- Internationalization improvements

## Getting Help

- **Questions**: Open a GitHub Discussion
- **Bug Reports**: Open a GitHub Issue with reproduction steps
- **Feature Requests**: Open a GitHub Issue with use case description

## License

By contributing, you agree that your contributions will be licensed under the Apache License 2.0.

---

Thank you for contributing to draw.io!
