# Monorepo Structure Guide

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This is a monorepo for Xentom integrations using Turbo for build orchestration and Bun as the package manager. The repository contains multiple integration packages that extend the Xentom platform.

### Key Directories

- `packages/` - Individual integration packages
- `tooling/style-guide/` - Shared ESLint, Prettier, and TypeScript configurations

## Development Commands

### Root-level commands (run from repository root):

- `bun run clean` - Clean all packages and git-ignored files
- `bun run lint` - Run ESLint across all packages with caching
- `bun run typecheck` - Run TypeScript type checking across all packages
- `bun run format` - Format code with Prettier across all packages
- `bun run pack` - Build/pack all integration packages

### Package-level commands (run from any `packages/*/` directory):

- `bun run dev` - Start development mode using `xentom dev`
- `bun run pack` - Build the integration package using `xentom pack`
- `bun run publish` - Publish the integration using `xentom publish`
- `bun run lint` - Run ESLint for the package
- `bun run typecheck` - Run TypeScript checking with `tsc --noEmit`
- `bun run format` - Format code with Prettier
- `bun run clean` - Clean build artifacts and dependencies

## Package Manager

This project uses Bun (`bun@1.2.18`) as specified in the packageManager field. Always use `bun` commands instead of npm/yarn.

## Quality Assurance Requirements

**🚨 Mandatory Checks - All integrations must pass without errors or warnings:**

- ✅ `bun run lint` - Zero ESLint errors and zero warnings
- ✅ `bun run typecheck` - Zero TypeScript errors
- ✅ `bun run format` - No formatting changes required

These standards ensure maintainable, type-safe, and consistent integration code across the platform.

&nbsp;

&nbsp;

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

### 1. Integration Entry Point (`src/index.ts`)

The main configuration file that defines the integration.
It registers all node and establishes the integration's lifecycle hooks, authentication, and other configurations.

Reference: `@node_modules/@xentom/integration-framework/dist/integration.d.ts`

**✅ Correct Implementation:**

```typescript
import * as i from '@xentom/integration-framework';

export default i.integration({
  // Configuration...
});
```

### 2. Integration Nodes (`src/nodes/*`)

The nodes directory contains all the integration nodes, organized hierarchically by category and subcategory.

#### `src/nodes/index.ts`

The root export aggregator that makes all individual nodes available to the integration entry point.
All nodes are exported directly using re-export statements, creating a flat namespace of available nodes.

**✅ Correct Pattern:**

```typescript
// Re-export all nodes from categories
export * from './<category>';
// other category exports...
```

#### `src/nodes/<category>/index.ts`

Category-level export aggregator that consolidates all nodes within a functional area.
Handles both direct category exports and nested subcategory exports, maintaining the hierarchical organization while flattening the export structure.

**✅ Correct Pattern:**

```typescript
// Re-export subcategories if they are defined
export * from './<subcategory>';
// other subcategory exports...

// Re-export the main category nodes
export * from './<category>';
```

#### `src/nodes/<category>/<category>.ts`

The implementation file containing actual node definitions for a category.
Defines the category metadata and implements nodes in a specific order:

- Trigger nodes (event-driven nodes)
- Callable nodes (action nodes)
- Pure nodes (data transformation nodes).

Each node is exported individually as a named export.

Reference: `@node_modules/@xentom/integration-framework/dist/nodes/*.d.ts`

**✅ Correct Implementation Pattern:**

```typescript
import * as i from '@xentom/integration-framework';

// Category metadata
const category = {
  path: ['<...parent categories>', '<category>'],
} satisfies i.NodeCategory;

// All trigger nodes (event-driven)
export const on<EventName> = i.nodes.trigger({
  category,
  // Implementation...
});

// All callable nodes (actions)
export const action = i.nodes.callable({
  category,
  // Implementation...
});

// All pure nodes (data transformations)
export const transform = i.nodes.pure({
  category,
  // Implementation...
});
```

#### `src/nodes/<category>/<subcategory>/<subcategory>.ts`

Subcategory implementation files for more granular organization within larger functional areas.
Follows the same structure as category files but with deeper path hierarchies.
Each node is exported individually and will be re-exported through the category index files.

### 3. Reusable Integration Pins (`src/pins/*`)

The `pins` directory contains all the reusable pins for the integration. When you define a pin more than once,
you should move it to this directory and import it in the nodes that need it. Keep in mind,
that you can modify a reusable pin with the `with` method.

**✅ Correct Pin Usage:**

```typescript
import * as i from '@xentom/integration-framework';

import * as pins from '@/pins';

// Extend existing pin with modifications
i.nodes.trigger({
  inputs: {
    subject: pins.email.subject.with({
      // Override the reusable pin fields
      description: 'Email subject line.',
      optional: true,
    }),
  },
});
```

**❌ Incorrect Pin Usage:**

```typescript
// Don't recreate pins with copied properties
i.nodes.trigger({
  inputs: {
    subject: i.pins.data({
      description: pins.email.subject.description,
    }),
  },
});
```

#### `src/pins/index.ts`

Central export hub that organizes all pin definitions by category. Each category is exported as a namespace,
creating logical groupings of related data types and making them easily discoverable.

**✅ Correct Export Pattern:**

```typescript
export * as category from './<category>';
// other category exports...
```

#### `src/pins/<category>.ts`

Pin definition files containing reusable data type specifications for a functional category.
Defines schemas, validation rules, and type metadata that nodes use for input/output contracts.
Each pin is exported individually within its category namespace.

Reference: `@node_modules/@xentom/integration-framework/dist/pins/*.d.ts`

**✅ Correct Pin Definitions:**

```typescript
import * as i from '@xentom/integration-framework';
import * as v from 'valibot';

// Single item pin with schema validation
export const item = i.pins.data({
  displayName: 'Email',
  schema: v.object({
    id: v.string(),
    subject: v.string(),
    body: v.string(),
    timestamp: v.string(),
  }),
});

// Collection pin for arrays of items
export const items = i.pins.data<EmailType[]>({
  displayName: 'Email List',
});

// Simple property pins
export const id = i.pins.data({
  displayName: 'Email ID',
  schema: v.string(),
});
```

## Naming Conventions

### Categories

**Generic Names:**

- **✅ REQUIRED**: Use generic names for categories (e.g., `email`, `user`, `issue`, `ticket`)
- **❌ FORBIDDEN**: Use specific names for categories (e.g., `email-management`, `user-management`, `issue-management`, `ticket-management`)

**Singular Names:**

- **✅ REQUIRED**: Use singular names for categories (e.g., `email`, `user`, `issue`, `ticket`)
- **❌ FORBIDDEN**: Use plural names for categories (e.g., `emails`, `users`, `issues`, `tickets`)

**Directory and File Names:**

- **✅ REQUIRED**: Use kebab-case for directory and file names (e.g., `user-management`)
- **❌ FORBIDDEN**: Use PascalCase for directory and file names (e.g., `UserManagement`)

**Category Names:**

- **✅ REQUIRED**: Use title case for category names (e.g., `User Management`)
- **❌ FORBIDDEN**: Use camelCase for category names (e.g., `userManagement`)

## Integration Development Guidelines

### Code Quality Standards

#### Import and Dependency Management

**Valibot Integration:**

- **✅ REQUIRED**: Import Valibot directly: `import * as v from 'valibot'`
- **✅ CORRECT**: Use `v.string()`, `v.object()`, etc.
- **❌ FORBIDDEN**: `i.v.string()` - the integration framework does NOT export Valibot schemas

**TypeScript Import Style:**

- **✅ REQUIRED**: Use inline type specifiers: `import { type MyType, myFunction } from 'package'`
- **❌ FORBIDDEN**: Top-level type-only imports: `import type { MyType } from 'package'`

#### Type Safety and Error Handling

**Strict Type Compliance:**

- **❌ FORBIDDEN**: `as any`, `@ts-ignore`, `eslint-disable-next-line` as shortcuts
- **✅ REQUIRED**: Follow the three-attempt rule for type/lint errors:
  1. Fix the underlying issue properly
  2. Reconsider approach and try alternative implementation
  3. Rethink entire approach and redesign if necessary
- Type bypasses indicate design problems, not acceptable solutions

**Error Management:**

- **✅ REQUIRED**: Let the workflow editor handle errors - avoid custom error wrapping
- **❌ FORBIDDEN**: Unnecessary try-catch blocks that only re-throw generic errors
- The platform provides comprehensive error handling at the workflow level

### Integration Framework Usage

#### Pin Management

**Pin Extension:**

- **✅ REQUIRED**: Use `pins.<name>.with({ /* overrides */ })` for pin customization
- **❌ FORBIDDEN**: Direct schema access `pins.<name>.schema` (breaks encapsulation)
- **❌ FORBIDDEN**: Destructuring pin properties `{ ...pins.<name>, optional: true }`

**Pin Optionality:**

- **✅ CORRECT**: Use `optional: true` in pin definition:
  ```typescript
  someField: i.pins.data({
    schema: v.string(),
    optional: true,
  });
  ```
- **❌ FORBIDDEN**: `v.optional()` within pin schemas (breaks pin typing)

**Schema Design:**

- **✅ CORRECT**: For complex API responses, omit schema and use TypeScript generics:
  ```typescript
  response: i.pins.data<ApiResponseType>({
    displayName: 'Response Data',
  });
  ```
- **❌ FORBIDDEN**: `v.any()` schema (bypasses type safety)
- **✅ REQUIRED**: Design schemas to match actual API contracts, not idealized versions

**Pin Naming Conventions:**

- **✅ REQUIRED**: Use consistent namespaced naming for reusable pins across all integrations
- **✅ REQUIRED**: Use `item` for single object pins: `export const item = i.pins.data<ObjectType>({...})`
- **✅ REQUIRED**: Use `items` for array/list pins: `export const items = i.pins.data<ObjectType[]>({...})`
- **✅ REQUIRED**: Use semantic names like `id`, `name`, `email` for specific properties
- **❌ FORBIDDEN**: Inconsistent naming patterns that break monorepo consistency

#### Integration Architecture

**Framework Compliance:**

- **✅ REQUIRED**: Study existing integration patterns before implementing new ones
- **✅ REQUIRED**: Use meaningful node categories: `{ path: ['Category', 'Subcategory'] }`
- **✅ REQUIRED**: Follow established authentication and client initialization patterns
- **✅ REQUIRED**: Implement proper error handling without suppressing type information

### Code Structure and Style

#### Variable Management

**Variable Usage:**

- **✅ PREFERRED**: Use values directly where consumed
- **⚠️ AVOID**: Unnecessary intermediate variables for single-use values
- **✅ REQUIRED**: Define variables as close as possible to their usage
- **❌ FORBIDDEN**: Declaring variables at function top when used much later

**Property Access:**

- **✅ PREFERRED**: Direct property access: `opts.inputs.messageId`
- **⚠️ AVOID**: Unnecessary destructuring: `const { messageId } = opts.inputs` when not beneficial
- Maintains clarity about data sources and reduces variable declarations

#### Display Names and Documentation

**Display Name Rules:**

- **✅ REQUIRED**: Only set `displayName` when it meaningfully differs from auto-generated title
- **✅ CORRECT**: `displayName: 'API Key'` (prevents 'Api Key' auto-generation)
- **❌ INCORRECT**: `displayName: 'Message ID'` (redundant with 'messageId' → 'Message Id')

### Quality Assurance Requirements

**Mandatory Checks:**
Every integration must pass without errors or warnings:

- `bun run lint` - Zero errors and zero warnings
- `bun run typecheck` - Zero TypeScript errors
- `bun run format` - No formatting changes required

These standards ensure maintainable, type-safe, and consistent integration code across the platform.
