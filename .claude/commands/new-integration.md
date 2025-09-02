# new-integration

Create a new integration for the xentom workflow editor.

## Usage

```
/new-integration <integration-name>
```

## Arguments

- `<integration-name>`: The name of the integration to create (e.g., "stripe", "github", "slack")

## Description

This command creates a new integration by following a systematic approach to research, implement, and integrate third-party services into the xentom workflow editor. The integration will be scaffolded from the template and customized based on the chosen TypeScript library.

## Steps

### 1. Search for TypeScript Libraries

Search the web for existing TypeScript libraries for the specified integration:

- Look for official SDKs and community libraries
- Research npm packages with TypeScript support

### 2. Choose the Best Library

Evaluate and select a library based on:

- **Active maintenance**: Recent commits and releases
- **Popularity**: GitHub stars, npm downloads
- **TypeScript support**: Native TypeScript or quality type definitions
- **Documentation quality**: API documentation and examples

### 3. Clone Template Integration

```bash
cp -r packages/template packages/<integration-name>
```

### 4. Install the Library

```bash
cd packages/<integration-name>
bun add <selected-package-name>
```

### 5. Update Package Metadata

Update the `name`, `displayName`, and `description` in the package configuration to reflect:

- The integration name
- A user-friendly display name
- A brief description of how the integration enhances the workflow

### 6. Review Integration Framework

Review the `node_modules/@xentom/integration-framework/src/**/*.ts` source files to understand:

- How the framework works and its core concepts
- Proper usage patterns and best practices
- Available APIs and their correct implementation
- Common pitfalls and how to avoid them

### 7. Read Template Documentation

**Read `packages/template/CLAUDE.md`** to understand:

- The integration structure and architecture
- Implementation patterns and conventions
- Required files and their purposes
- Configuration and setup procedures

### 8. Review the Library Documentation

Study the installed library to understand:

- Its API methods and functionality
- Authentication requirements
- Usage patterns and best practices
- TypeScript type definitions

### 9. Implement Integration Entrypoint (src/index.ts)

Following the template structure:

- Implement necessary integration environment variables
- Implement integration lifecycle scripts for state initialization and connection setup

### 10. Implement Integration Pins (src/pins/index.ts, src/pins/<category>.ts)

Create common and reusable integration pins based on the template patterns and the library's capabilities.

### 11. Implement Integration Nodes

Develop the integration nodes that utilize the library's functionality, following the patterns established in the template.

### 12. Quality Assurance

Ensure the implementation meets quality standards:

```bash
# Run linting
bun run lint

# Run type checking
bun run type-check
```

## Prerequisites

Before running this command:

- Ensure you have access to `packages/template/CLAUDE.md`
- Understand the workflow editor's integration architecture

## Output

The command creates a new integration package at `packages/<integration-name>/` with all necessary files and dependencies, ready for implementation following the template structure.
