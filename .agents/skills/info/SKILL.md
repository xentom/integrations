---
name: info
description: Get a summary of an integration's structure and capabilities. Use when asked for information about, an overview of, or a summary of an integration package.
---

# Integration Information

Analyze and summarize an integration. Ask the user which integration to analyze if not already clear from context.

## Steps

### 1. Read the Integration Source Files

Start with `packages/<name>/package.json` and `packages/<name>/src/index.ts` for metadata, auth, and state.

Then list the `src/pins/` and `src/nodes/` directories to understand the structure before reading individual files selectively. Only read files needed to produce the summary — avoid loading the entire source tree upfront.

### 2. Generate Summary

Provide a structured summary including:

- **Overview**: What the integration does, which library it uses
- **Authentication**: How it authenticates (token, OAuth, etc.)
- **State**: What's stored in `IntegrationState`
- **Pins**: List all pin categories and their definitions
- **Nodes**: List all nodes grouped by category, with their type (callable/trigger/pure), inputs, and outputs
- **Dependencies**: Third-party packages used
