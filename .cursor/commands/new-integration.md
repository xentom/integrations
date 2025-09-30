---
description: Create a new integration
argument-hint: [integration-name]
---

# Create a new integration

## Description

Create a new integration for the xentom workflow editor by systematically researching, implementing, and integrating a third-party service. The integration will be scaffolded from the template and customized using the selected TypeScript library.

## Implementation Process

### Phase 1: Research and Selection

#### 1.1 Search for TypeScript Libraries

Search the web for TypeScript libraries that support the specified integration:

- Focus on official SDKs first, then community libraries
- Search npm packages that explicitly mention TypeScript support
- Record multiple options for comparison

#### 1.2 Select Optimal Library

Evaluate discovered libraries using these criteria:

- **Maintenance status**: Check for commits/releases within last 6 months
- **Community adoption**: Review GitHub stars and npm weekly downloads
- **TypeScript compatibility**: Verify native TypeScript or @types availability
- **Documentation completeness**: Confirm API documentation and code examples exist

Document your selection rationale.

### Phase 2: Project Setup

#### 2.1 Clone Template Integration

Execute the appropriate command for the user's operating system:

**Linux/macOS:**

```bash
rsync -av --exclude='node_modules' packages/template/ packages/$1/
```

**Windows PowerShell:**

```powershell
powershell -Command "robocopy './packages/template' './packages/$1' /E /XD node_modules"
```

#### 2.2 Configure Package Metadata

Modify the package configuration with:

- `name`: Set to the integration identifier
- `displayName`: Provide user-friendly integration name
- `description`: Write concise explanation of workflow enhancement

#### 2.3 Install Selected Library

Navigate to the package directory and install:

```bash
cd packages/$1
bun add <selected-package-name>
```

### Phase 3: Implementation

#### 3.1 Exploring and Understanding Integration Framework Files

```bash
find node_modules/@xentom/integration-framework/dist -name "*.d.ts" -type f -exec sh -c 'echo "=== $1 ==="; cat "$1"; echo' _ {} \;
```

#### 3.2 Analyze Library Documentation

Review the installed library's documentation to understand:

- Available API methods
- Authentication mechanisms
- Required configuration
- TypeScript type definitions and interfaces

#### 3.3 Implement Core Components

**Integration Entrypoint (`src/index.ts`):**

- Define required environment variables
- Implement lifecycle scripts for state initialization
- Configure connection setup procedures

**Integration Pins (`src/pins/index.ts`, `src/pins/<category>.ts`):**

- Create reusable pins following template patterns
- Leverage library capabilities for pin functionality

**Integration Nodes (`src/nodes/`):**

- Develop nodes utilizing library functionality
- Follow established template patterns
- Ensure proper error handling

### Phase 4: Quality Validation

Execute all quality checks:

```bash
# Verify TypeScript compilation
bun run typecheck

# Check code standards
bun run lint

# Apply consistent formatting
bun run format
```

## Prerequisites

Confirm before execution:

- Understanding of xentom workflow editor's integration architecture is established

## Expected Output

A complete integration package at `packages/$1/` containing:

- Properly configured package files
- Implemented integration components following template structure
- Installed dependencies
- Type-safe, linted, and formatted code ready for testing
