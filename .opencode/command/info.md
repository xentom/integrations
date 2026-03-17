---
description: Get a summary of an integration's structure and capabilities
---

# Integration Information

Analyze and summarize the integration at `packages/$1/`.

## Steps

### 1. Read the Integration Source Files

Read all TypeScript source files in `packages/$1/src/`:

- `src/index.ts` - entry point, auth, state
- `src/pins/**/*.ts` - pin definitions
- `src/nodes/**/*.ts` - node implementations
- Any utility files

Also read `packages/$1/package.json` for metadata and dependencies.

### 2. Generate Summary

Provide a structured summary including:

- **Overview**: What the integration does, which library it uses
- **Authentication**: How it authenticates (token, OAuth, etc.)
- **State**: What's stored in `IntegrationState`
- **Pins**: List all pin categories and their definitions
- **Nodes**: List all nodes grouped by category, with their type (callable/trigger/pure), inputs, and outputs
- **Dependencies**: Third-party packages used
