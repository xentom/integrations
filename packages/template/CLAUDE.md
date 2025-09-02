# Integration Structure Guide

This document provides a comprehensive overview of the integration structure for Xentom integrations.

## Directory Structure

```
/
├── src/
│   ├── index.ts                     # Integration entry point
│   ├── nodes/                       # Functional nodes grouped by category
│   │   ├── [category]/              # e.g., emails, contacts, files
│   │   │   ├── [subcategory]/       # Optional deeper grouping
│   │   │   │   ├── [subcategory].ts # Nodes within subcategory
│   │   │   │   └── index.ts         # Subcategory exports
│   │   │   ├── [category].ts        # Nodes grouped at category level
│   │   │   └── index.ts             # Category exports
│   │   └── index.ts                 # All nodes export
│   └── pins/                        # Reusable "pins" (data types)
│       ├── [category].ts            # Pin definitions by category
│       └── index.ts                 # All pins export
├── images/
│   └── icon.png                     # Integration icon (required)
├── globals.d.ts                     # TypeScript global declarations
├── package.json                     # Package configuration
├── tsconfig.json                    # TypeScript config
└── eslint.config.mjs                # ESLint configuration
```

## Key Components

### 1. Entry Point (`src/index.ts`)

The main integration file that exports all nodes and pins. This is where the integration is defined and configured.

### 2. Nodes (`src/nodes/`)

Contains all the functional nodes of the integration, organized by categories:

- **Categories**: Top-level functional groupings (e.g., `emails`, `contacts`, `files`)
- **Subcategories**: More specific groupings within categories
- **Node Files**: Individual TypeScript files containing node implementations
- **Index Files**: Export files that make nodes available to the integration

### 3. Pins (`src/pins/`)

Contains pin definitions that define data types and structures used throughout the integration:

- **Category Files**: Pin definitions grouped by functional category
- **Index File**: Central export point for all pins

### 4. Configuration Files

- **`package.json`**: NPM package configuration with dependencies
- **`tsconfig.json`**: TypeScript compiler configuration
- **`eslint.config.mjs`**: Code linting rules and configuration
- **`globals.d.ts`**: Global TypeScript type declarations

### 5. Assets

- **`images/icon.png`**: Integration icon displayed in the UI

## File Naming Conventions

- **Categories**: Use kebab-case for directory names (e.g., `user-management`)
- **Node Files**: Match the category/subcategory name (e.g., `emails.ts`, `contacts.ts`)
- **Pin Files**: Match the category they represent (e.g., `email.ts`, `contact.ts`)
- **Index Files**: Always named `index.ts` for consistent exports

## Import/Export Patterns

Each directory level maintains its own `index.ts` file for clean exports:

```typescript
// src/nodes/category/index.ts
export * from './category';
export * from './subcategory';

// src/nodes/index.ts
export * from './category';

// src/pins/index.ts
export * as category from './category';
```

This structure ensures clean imports and maintains separation of concerns while providing a clear hierarchy for organizing integration functionality.
