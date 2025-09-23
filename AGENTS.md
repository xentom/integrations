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

**Reusable Pin Definitions:**

- **✅ REQUIRED**: Main definitions of reusable pins must not include `optional: true`:

  ```typescript
  // Correct: Reusable pin definition without optional
  export const title = i.pins.data({
    description: 'The title of the item',
    schema: v.pipe(v.string(), v.nonEmpty()),
  });

  export const body = i.pins.data({
    description: 'The body content',
    schema: v.string(),
  });
  ```

- **✅ REQUIRED**: Use `optional: true` only when extending pins with `.with()`:
  ```typescript
  // Correct: Optional specified when extending
  i.nodes.callable({
    inputs: {
      title: pins.item.title,
      body: pins.item.body.with({
        optional: true,
      }),
    },
  });
  ```
- **❌ FORBIDDEN**: Including `optional: true` in the main reusable pin definition:
  ```typescript
  // Incorrect: Optional in reusable pin definition
  export const body = i.pins.data({
    description: 'The body content',
    schema: v.string(),
    optional: true, // This breaks reusability
  });
  ```

**Rationale**: Reusable pins should be defined as their canonical form without optionality constraints. The `optional: true` attribute should only be applied when extending pins through `.with()` method, allowing the same pin to be used as both required and optional in different contexts without duplication.

**Pin Control Usage:**

- **✅ REQUIRED**: Include meaningful controls for reusable pins when they enhance user experience:

  ```typescript
  // Correct: Text control for string inputs
  export const title = i.pins.data({
    description: 'The title of the item',
    schema: v.pipe(v.string(), v.nonEmpty()),
    control: i.controls.text(),
  });

  // Correct: Select control for enumerated values
  export const status = i.pins.data({
    description: 'The status of the item',
    control: i.controls.select({
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
      ],
    }),
  });

  // Correct: Dynamic select for contextual options
  export const repository = i.pins.data({
    description: 'The repository to use',
    schema: v.pipe(v.string(), v.nonEmpty()),
    control: i.controls.select({
      async options(opts) {
        const repos = await opts.state.api.listRepositories();
        return repos.data.map((repo) => ({
          value: repo.fullName,
          label: repo.name,
        }));
      },
    }),
  });

  // Correct: Multi-select for arrays of selectable items
  export const assignees = i.pins.data({
    description: 'Users to assign',
    schema: v.array(v.string()),
    control: i.controls.select({
      multiple: true,
      async options(opts) {
        const users = await opts.state.api.getUsers();
        return users.data.map((user) => ({
          value: user.id,
          label: user.name,
        }));
      },
    }),
  });
  ```

- **✅ REQUIRED**: Include controls for user-input values, even numeric ones:

  ```typescript
  // Correct: Expression control for user-entered numeric values
  export const issueNumber = i.pins.data({
    description: 'The issue number',
    schema: v.pipe(v.number(), v.integer(), v.minValue(1)),
    control: i.controls.expression(),
  });

  // Correct: Switch control for boolean flags
  export const isDraft = i.pins.data({
    description: 'Whether the item is a draft',
    schema: v.boolean(),
    control: i.controls.switch(),
  });
  ```

- **✅ PREFERRED**: Omit controls only for specific cases where they don't add value:

  ```typescript
  // Correct: No control for complex response objects
  export const item = i.pins.data<ApiResponseType>({
    displayName: 'User Data',
  });

  // Correct: No control for computed/derived data
  export const searchResults = i.pins.data<SearchResult[]>({
    displayName: 'Search Results',
  });

  // Correct: No control when dynamic options aren't feasible
  export const tags = i.pins.data({
    description: 'Custom tags to apply',
    schema: v.array(v.string()),
    // Omit control when options can't be determined dynamically
  });
  ```

- **❌ FORBIDDEN**: Omitting controls for simple user-input pins:

  ```typescript
  // Incorrect: Missing control for user input
  export const email = i.pins.data({
    description: 'User email address',
    schema: v.string(),
    // Missing control - user needs to input this!
  });

  // Incorrect: Missing control for boolean input
  export const enabled = i.pins.data({
    description: 'Whether feature is enabled',
    schema: v.boolean(),
    // Missing switch control
  });
  ```

**Rationale**: Controls should be included for any pin where users need to provide input values. Use `text` controls for strings, `expression` controls for numbers, `switch` controls for booleans, `select` controls for predefined options, and `select` with `multiple: true` for arrays where users choose from available options. Only omit controls for complex objects, output-only pins, or when dynamic options cannot be reasonably determined.

**Schema Design:**

- **✅ CORRECT**: For complex API responses, omit schema and use TypeScript generics:
  ```typescript
  response: i.pins.data<ApiResponseType>({
    displayName: 'Response Data',
  });
  ```
- **❌ FORBIDDEN**: `v.any()` schema (bypasses type safety)
- **✅ REQUIRED**: Design schemas to match actual API contracts, not idealized versions

**Serialization Compatibility:**

- **❌ FORBIDDEN**: Passing class instances directly through pins without serialization:
  ```typescript
  // Incorrect: Class instances cannot be serialized by the editor
  export const channel = i.pins.data<TeamSpeakChannel>({
    displayName: 'Channel',
    // No schema - class instance passed directly
  });
  ```
- **✅ REQUIRED**: Implement proper serialization/deserialization for class instances:

  ```typescript
  // Correct: Base pin without class-specific schema
  export const item = i.pins.data({
    displayName: 'Channel',
    description: 'The details of a TeamSpeak channel',
  });

  // Correct: Input pin that deserializes to class instance
  export const itemInput = item.with({
    schema({ state }) {
      return v.pipe(
        v.custom<ChannelEntry>((value) => {
          return !!value && typeof value === 'object' && 'cid' in value;
        }),
        v.transform((value) => new TeamSpeakChannel(state.teamspeak, value)),
      );
    },
  });

  // Correct: Output pin that serializes class instance
  export const itemOutput = item.with({
    schema: v.pipe(
      v.custom<TeamSpeakChannel>((value) => value instanceof TeamSpeakChannel),
      v.transform((value) => value.toJSON() as ChannelEntry),
    ),
  });
  ```

- **✅ REQUIRED**: Use separate input/output pins when working with classes:
  ```typescript
  // Correct: Different pins for input and output handling
  export const getChannel = i.nodes.callable({
    inputs: {
      channelData: pins.channel.itemInput, // Deserializes to class
    },
    outputs: {
      channel: pins.channel.itemOutput, // Serializes from class
    },
  });
  ```

**Rationale**: The workflow editor requires all data to be serializable for persistence and state management. Classes must be properly transformed to/from serializable formats using `v.transform()` in separate input and output pin variants to maintain editor compatibility while preserving object-oriented functionality.

**Pin Descriptions:**

- **✅ REQUIRED**: Use the pin's own `description` property for node inputs/outputs:
  ```typescript
  // Correct: Let the pin provide its description
  i.nodes.callable({
    inputs: {
      userId: pins.user.id, // Uses pin's built-in description
    },
  });
  ```
- **✅ ACCEPTABLE**: Override description only when truly necessary for context:
  ```typescript
  // Acceptable: Context-specific override when needed
  i.nodes.callable({
    inputs: {
      targetUserId: pins.user.id.with({
        description: 'The user to assign this task to',
      }),
    },
  });
  ```
- **❌ FORBIDDEN**: Using control description instead of pin description:
  ```typescript
  // Incorrect: Overriding with generic control description
  i.nodes.callable({
    description: 'Select a user ID', // Control-level description
    inputs: {
      userId: pins.user.id.with({
        description: undefined, // Removes pin's meaningful description
      }),
    },
  });
  ```

**Rationale**: Pin descriptions are crafted to explain the data semantically, while control descriptions focus on UI interaction. Using pin descriptions maintains consistency and provides better context about the data being handled.

**Pin Type Strategy:**

- **✅ REQUIRED**: Use typed pins for node outputs (data flowing out):
  ```typescript
  // Correct: Output pins use TypeScript generics for type safety
  export const getUser = i.nodes.callable({
    outputs: {
      user: i.pins.data<UserType>({
        displayName: 'User Data',
      }),
    },
  });
  ```
- **✅ REQUIRED**: Use schema pins for node inputs (data flowing in):
  ```typescript
  // Correct: Input pins use Valibot schemas for validation
  export const createUser = i.nodes.callable({
    inputs: {
      email: i.pins.data({
        schema: v.string(),
        displayName: 'Email Address',
      }),
      name: i.pins.data({
        schema: v.string(),
        displayName: 'Full Name',
      }),
    },
  });
  ```
- **❌ FORBIDDEN**: Using schemas for outputs (prevents proper type inference):
  ```typescript
  // Incorrect: Output with schema breaks TypeScript type flow
  export const getUser = i.nodes.callable({
    outputs: {
      user: i.pins.data({
        schema: v.object({
          id: v.string(),
          name: v.string(),
        }),
      }),
    },
  });
  ```
- **❌ FORBIDDEN**: Using unvalidated types for inputs (bypasses runtime validation):
  ```typescript
  // Incorrect: Input without schema allows invalid data
  export const createUser = i.nodes.callable({
    inputs: {
      userData: i.pins.data<UserType>({
        displayName: 'User Data',
      }),
    },
  });
  ```

**Rationale**: Inputs require runtime validation to ensure data integrity and provide user feedback, while outputs benefit from compile-time type safety without the overhead of re-validating trusted internal data. This pattern optimizes both developer experience and runtime performance.

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

**Intermediate Variable Declarations:**

- **✅ PREFERRED**: Use object properties directly where they are consumed:
  ```typescript
  // Correct: Direct property access
  export const getMessage = i.nodes.callable({
    handler: async (opts) => {
      const response = await opts.state.client.messages.get(
        opts.inputs.messageId,
      );
      return { message: response.data };
    },
  });
  ```
- **❌ FORBIDDEN**: Unnecessary intermediate variables for simple property access:
  ```typescript
  // Incorrect: Unnecessary variable for single-use property
  export const getMessage = i.nodes.callable({
    handler: async (opts) => {
      const client = opts.state.client; // Unnecessary intermediate variable
      const messageId = opts.inputs.messageId; // Unnecessary intermediate variable
      const response = await client.messages.get(messageId);
      return { message: response.data };
    },
  });
  ```
- **✅ ACCEPTABLE**: Use intermediate variables only when they improve readability or are used multiple times:

  ```typescript
  // Acceptable: Variable used multiple times or complex expression
  export const updateMessage = i.nodes.callable({
    handler: async (opts) => {
      const messageId = opts.inputs.messageId;

      // Variable used multiple times - acceptable
      await opts.state.client.messages.update(messageId, opts.inputs.content);
      await opts.state.client.audit.log('message_updated', messageId);

      return { success: true };
    },
  });
  ```

**Rationale**: Unnecessary intermediate variables add cognitive overhead and reduce code clarity when the original property access is already clear and concise. Reserve variable declarations for cases where they genuinely improve readability, reduce repetition, or clarify complex expressions.

#### Display Names and Documentation

**Display Name Rules:**

- **✅ REQUIRED**: Only set `displayName` when it meaningfully differs from auto-generated title
- **✅ CORRECT**: `displayName: 'API Key'` (prevents 'Api Key' auto-generation)
- **❌ FORBIDDEN**: `displayName: 'Message ID'` (redundant with 'messageId' → 'Message Id')

**Node Display Name Usage:**

- **✅ CORRECT**: Omit `displayName` when export name converts properly to title case:
  ```typescript
  // Correct: 'sendMessage' → 'Send Message' automatically
  export const sendMessage = i.nodes.callable({
    category,
    // No displayName needed
  });
  ```
- **❌ FORBIDDEN**: Redundant `displayName` that matches auto-generated title:
  ```typescript
  // Incorrect: Unnecessary displayName specification
  export const sendMessage = i.nodes.callable({
    category,
    displayName: 'Send Message', // Redundant with auto-generation
  });
  ```
- **✅ REQUIRED**: Use `displayName` when export name conflicts with JavaScript keywords:

  ```typescript
  // Correct: Handle JavaScript keyword conflicts
  export const _while = i.nodes.callable({
    category,
    displayName: 'While', // Required to override underscore prefix
  });

  export const _delete = i.nodes.callable({
    category,
    displayName: 'Delete', // Required for reserved word
  });
  ```

- **❌ FORBIDDEN**: Using reserved words directly as export names:
  ```typescript
  // Incorrect: JavaScript keywords cannot be used as export names
  export const while = i.nodes.callable({
    category,
  });
  ```

**Rationale**: The framework automatically converts camelCase exports to readable titles. Setting `displayName` unnecessarily creates maintenance overhead and contradicts the framework's built-in conventions. Only override when the automatic conversion produces incorrect results or when working around JavaScript language constraints.

**Placeholder Field Guidelines:**

- **✅ REQUIRED**: Use realistic example values in placeholder fields to guide user input:
  ```typescript
  email: i.pins.data({
    schema: v.string(),
    placeholder: 'user@example.com',
  }),
  apiUrl: i.pins.data({
    schema: v.string(),
    placeholder: 'https://api.service.com/v1',
  }),
  channelId: i.pins.data({
    schema: v.string(),
    placeholder: 'general-discussion',
  }),
  ```
- **✅ PREFERRED**: Use domain-specific examples that match the integration context:
  ```typescript
  // For GitHub integration
  repository: i.pins.data({
    schema: v.string(),
    placeholder: 'owner/repository-name',
  }),
  // For Slack integration
  channel: i.pins.data({
    schema: v.string(),
    placeholder: '#general',
  }),
  ```
- **❌ FORBIDDEN**: Generic or uninformative placeholders:
  ```typescript
  // Bad: doesn't help user understand expected format
  email: i.pins.data({
    schema: v.string(),
    placeholder: 'Enter email',
  }),
  // Bad: too generic to be useful
  url: i.pins.data({
    schema: v.string(),
    placeholder: 'URL',
  }),
  ```

**Rationale**: Well-chosen placeholder examples reduce user confusion, demonstrate expected formats, and improve the integration's usability in the workflow editor.

#### Code Documentation

**Comment Usage:**

- **❌ FORBIDDEN**: Add unnecessary comments that duplicate information already provided by node or pin descriptions:
  ```typescript
  // Bad: Redundant comment when pin description already explains the purpose
  export const sendEmail = i.nodes.callable({
    inputs: {
      // Send an email to the recipient
      recipient: pins.email.address,
      // The subject line of the email
      subject: pins.email.subject,
    },
  });
  ```
- **✅ REQUIRED**: Let node and pin descriptions provide the necessary context:
  ```typescript
  // Correct: No comments needed - descriptions handle documentation
  export const sendEmail = i.nodes.callable({
    description: 'Send an email message',
    inputs: {
      recipient: pins.email.address,
      subject: pins.email.subject,
    },
  });
  ```
- **✅ ACCEPTABLE**: Use comments only for complex business logic or non-obvious implementation details:
  ```typescript
  // Acceptable: Comment explains non-obvious technical implementation
  export const processWebhook = i.nodes.callable({
    inputs: { payload: pins.webhook.payload },
    handler: async (opts) => {
      // GitHub webhook signatures use HMAC-SHA256 with the raw body
      const signature = computeHmacSha256(opts.inputs.payload);
      return verifySignature(signature);
    },
  });
  ```

**Rationale**: Node descriptions, pin descriptions, and TypeScript types already provide comprehensive documentation. Adding redundant comments creates maintenance overhead and can become outdated when the actual implementation changes.

### Quality Assurance Requirements

**Mandatory Checks:**
Every integration must pass without errors or warnings:

- `bun run lint` - Zero errors and zero warnings
- `bun run typecheck` - Zero TypeScript errors
- `bun run format` - No formatting changes required

These standards ensure maintainable, type-safe, and consistent integration code across the platform.
