# ACME Integrations Project

## Overview

This is a workspace for building integrations using the ACME integration framework. The project uses a monorepo structure with Turbo for build orchestration and Bun as the package manager.

## Project Structure

```
acme-integrations/
├── integrations/                     # Integration packages
│   ├── resend/                       # Resend email integration
│   ├── template/                     # Template for new integrations
│   └── .../                          # Other integrations
├── node_modules/
│   └── @acme/
│       └── integration-framework/    # Core framework
├── tooling/
│   └── style-guide/                  # ESLint, Prettier, TypeScript configs
├── package.json                      # Root package.json with workspaces
└── turbo.json                        # Turbo configuration
```

## Integration Framework

The `@acme/integration-framework` provides the core building blocks for integrations:

- **Nodes**: Nodes are the building blocks of an integration.
  - Trigger nodes: Event-driven (webhooks, polling)
  - Callable nodes: On-demand execution
  - Pure nodes: Stateless transformations
- **Pins**: Data types and schema definitions for inputs/outputs
  - Data pins: Typed data with validation schemas
  - Execution pins: Control flow connections
- **Controls**: UI components for user inputs
  - **Text**: Plain text input with template expression support
  - **Expression**: JavaScript code evaluation at runtime
  - **Select**: Dropdown with static or dynamic options
  - **Switch**: Boolean toggle controls
- **Environment**: Secure configuration management
  - API keys, tokens, connection strings
  - Validated with valibot schemas
- **Webhooks**: HTTP endpoints for external triggers
  - Automatic endpoint generation
  - Request validation and routing

## Building Integrations

### Required Files

Each integration must have:

- `images/icon.png` - Integration icon
- `src/index.ts` - Main integration export with nodes and environment
- `src/nodes/` - Directory containing triggers and actions
- `src/pins/` - Data type definitions and schemas
- `eslint.config.mjs` - ESLint configuration
- `tsconfig.json` - TypeScript configuration
- `package.json` - Package configuration with framework dependency

### Integration Structure

Each integration follows a standardized folder structure that organizes nodes, pins, and configuration files:

```
integrations/
├── [integration-name]/
│   ├── src/
│   │   ├── index.ts                 # Integration entry point
│   │   ├── globals.d.ts             # TypeScript global declarations
│   │   ├── nodes/
│   │   │   ├── [...category]/       # Node category directories
│   │   │   │   ├── [category].ts    # Node implementations
│   │   │   │   └── index.ts         # Category exports
│   │   │   └── index.ts             # All nodes export
│   │   └── pins/
│   │       ├── [category].ts        # Pin definitions by category
│   │       └── index.ts             # All pins export
│   ├── images/
│   │   └── icon.png                 # Integration icon
│   ├── package.json                 # Package configuration
│   ├── tsconfig.json                # TypeScript config
│   └── eslint.config.mjs            # ESLint configuration
```

**Example: Resend Integration**

```
integrations/
├── resend/
│   ├── src/
│   │   ├── index.ts                 # Main integration export
│   │   ├── globals.d.ts             # Type declarations
│   │   ├── nodes/
│   │   │   ├── emails/
│   │   │   │   ├── emails.ts        # Email operations (send, get, etc.)
│   │   │   │   └── index.ts         # Email node exports
│   │   │   ├── contacts/
│   │   │   │   ├── contacts.ts      # Contact management
│   │   │   │   └── index.ts         # Contact node exports
│   │   │   └── index.ts             # All nodes export
│   │   └── pins/
│   │       ├── email.ts             # Email-related pins
│   │       ├── contact.ts           # Contact-related pins
│   │       ├── audience.ts          # Audience-related pins
│   │       ├── common.ts            # Shared pins
│   │       └── index.ts             # All pins export
│   ├── images/
│   │   └── icon.png                 # Resend integration icon
│   ├── package.json
│   ├── tsconfig.json
│   └── eslint.config.mjs
```

### Pin Structure

The `pins/` folder defines reusable data types and schemas used across nodes. All pins require:

- A useful description
- A valibot schema (required, not optional)
- A control definition for simple data types

```typescript
// Example pin definition
export const emailAddress = i.pins.data({
  description: 'An email address.',
  control: i.controls.text({
    placeholder: 'john.doe@example.com',
  }),
  schema: v.pipe(v.string(), v.trim(), v.email()),
});
```

#### Control Property Best Practices

The `control` property in pin definitions follows these rules:

- **New pins default to no control**: When defining a new pin, omitting the `control` property means it has no UI control
- **Only use `control: false` when extending**: Use `control: false` only when extending an existing pin that has a control and you want to remove it
- **Output pins typically don't need controls**: API response objects and computed values usually don't need UI controls

```typescript
// ✅ Good - New pin with no control (for API responses)
export const apiResponse = i.pins.data<ApiResponse>({
  description: 'Response from the API.',
  // No control property needed - defaults to no control
});

// ✅ Good - New pin with control (for user input)
export const userInput = i.pins.data({
  description: 'User provided text.',
  control: i.controls.text({
    placeholder: 'Enter text...',
  }),
  schema: v.string(),
});

// ✅ Good - Extending pin with control to remove it
export const responseData = pins.common.inputField.with({
  description: 'Response data from API.',
  control: false, // Remove control from pin that was meant for input
});

// ❌ Bad - Unnecessary control: false on new pin
export const badResponse = i.pins.data<ApiResponse>({
  description: 'Response from the API.',
  control: false, // Unnecessary - pins default to no control
});
```

### Integration Entry Point

The main integration file exports nodes, environment variables, and initialization logic:

```typescript
// src/index.ts
import * as i from '@acme/integration-framework';

import * as nodes from './nodes';

export default i.integration({
  nodes,
  env: {
    RESEND_API_KEY: i.env({
      control: i.controls.text({
        label: 'Resend API Key',
        sensitive: true,
        description: 'Your Resend API key for sending emails',
      }),
      schema: v.string(),
    }),
  },
  start(opts) {
    // Initialize shared state with API client
    opts.state.resend = new Resend(process.env.RESEND_API_KEY);
  },
});
```

### Node Types

- **Trigger Nodes**: Event-driven nodes that start workflows (e.g., webhooks, polling)
- **Callable Nodes**: Functions that execute business logic and return results
- **Pure Nodes**: Stateless transformation functions for data manipulation

### Node Implementation

Nodes are organized by category and use pins for inputs and outputs:

```typescript
// src/nodes/emails/emails.ts
import * as pins from '@/pins';

import * as i from '@acme/integration-framework';

const category = {
  path: ['Emails'],
} satisfies i.NodeCategory;

export const sendEmail = i.nodes.callable({
  category,
  description: 'Send a simple email using Resend.',

  inputs: {
    from: pins.email.addressWithDisplayName.with({
      description: "Sender's email address with optional display name.",
    }),
    to: pins.email.addresses.with({
      description: 'Recipient email addresses.',
    }),
    subject: pins.email.subject,
    body: pins.email.body,
  },

  outputs: {
    id: pins.email.uuid.with({
      description: 'The ID of the sent email.',
      control: false, // No control needed for output-only pins
    }),
  },

  async run(opts) {
    const response = await opts.state.resend.emails.send({
      from: opts.inputs.from,
      to: opts.inputs.to,
      subject: opts.inputs.subject,
      text: opts.inputs.body,
    });

    if (response.error) {
      throw new Error(response.error.message);
    }

    return opts.next({ id: response.data.id });
  },
});
```

### Pin Categories

Pins are organized by category to promote reusability and maintain clean namespacing:

#### Pin Naming Best Practices

**Do NOT prefix exported variables with the category name** since they are already namespaced by the index.ts export structure:

```typescript
// ❌ Bad - Redundant prefixes
export const emailAddress = i.pins.data({...});
export const emailAddresses = i.pins.data({...});
export const emailSubject = i.pins.data({...});

// ✅ Good - Clean names without prefixes
export const address = i.pins.data({...});
export const addresses = i.pins.data({...});
export const subject = i.pins.data({...});
```

The category namespacing is handled automatically by the export structure:

```typescript
// Usage in nodes
import * as pins from '@/pins';

// src/pins/index.ts
export * as email from './email';
export * as broadcast from './broadcast';
export * as domain from './domain';

pins.email.address; // ✅ Clear namespacing
pins.broadcast.subject; // ✅ Clear namespacing
pins.domain.name; // ✅ Clear namespacing
```

#### Pin Reusability Best Practices

**Promote reusability by placing pins in their most logical category** and use `.with({...})` to customize them for specific use cases:

```typescript
// ✅ Good - Reusable email content pins in src/pins/email.ts
export const html = i.pins.data({
  description: 'The HTML content of the email.',
  control: i.controls.text({
    placeholder: '<h1>Hello World</h1>',
  }),
  schema: v.pipe(v.string(), v.minLength(1)),
});

export const text = i.pins.data({
  description: 'The plain text content of the email.',
  control: i.controls.text({
    placeholder: 'Plain text content',
  }),
  schema: v.pipe(v.string(), v.minLength(1)),
});

export const react = i.pins.data({
  description: 'React component as JSX string for the email content.',
  control: i.controls.text({
    placeholder: '<div><h1>Hello World</h1></div>',
  }),
  schema: v.pipe(v.string(), v.minLength(1)),
});
```

**Reuse pins across different nodes with custom descriptions**:

```typescript
// In broadcast nodes
inputs: {
  html: pins.email.html.with({
    description: 'The HTML content of the broadcast.',
    optional: true,
  }),
  text: pins.email.text.with({
    description: 'The plain text content of the broadcast.',
    optional: true,
  }),
  react: pins.email.react.with({
    description: 'React component as JSX string for the broadcast content.',
    optional: true,
  }),
}

// In email nodes - same pins, different context
inputs: {
  html: pins.email.html.with({
    description: 'The HTML content of the email message.',
    optional: true,
  }),
  text: pins.email.text.with({
    description: 'The plain text content of the email message.',
    optional: true,
  }),
}
```

#### Pin Schema Typing Best Practices

**Always use proper TypeScript types instead of `v.any()` for schemas**:

```typescript
// ❌ Bad - Using v.any() schema
export const object = i.pins.data({
  description: 'A broadcast object containing all broadcast information.',
  schema: v.any(), // Avoid this!
});

// ✅ Good - Using proper TypeScript types
export const object = i.pins.data<GetBroadcastResponseSuccess>({
  description: 'A broadcast object containing all broadcast information.',
  // No schema needed - TypeScript type provides validation
});

// ✅ Alternative - If no specific type available, omit schema (same as v.any() but more performant)
export const object = i.pins.data({
  description: 'A custom object.',
  // No schema property - implicitly allows any type
});
```

**Import types from the library and use them for complex response objects**:

```typescript
// src/pins/broadcast.ts
import { type GetBroadcastResponseSuccess, type ListBroadcastsResponseSuccess, type RemoveBroadcastResponseSuccess } from 'resend';

export const object = i.pins.data<GetBroadcastResponseSuccess>({
  description: 'A broadcast object containing all broadcast information.',
});

export const list = i.pins.data<ListBroadcastsResponseSuccess>({
  description: 'A list of broadcasts.',
});

// Usage in nodes
outputs: {
  result: i.pins.data<RemoveBroadcastResponseSuccess>({
    description: 'The deletion result.',
  }),
}
```

**Benefits of proper typing**:

- **Better performance**: No runtime validation overhead
- **Type safety**: Compile-time type checking
- **Better IDE support**: Auto-completion and error detection
- **Documentation**: Types serve as documentation
- **Maintainability**: Changes to API types are automatically reflected

#### Pin Implementation Examples

```typescript
// src/pins/email.ts
import * as v from 'valibot';

import * as i from '@acme/integration-framework';

// Simple data pin with validation
export const address = i.pins.data({
  description: 'An email address.',
  control: i.controls.text({
    placeholder: 'john.doe@example.com',
  }),
  schema: v.pipe(v.string(), v.trim(), v.email()),
});

// Complex data pin with transformation
export const addresses = i.pins.data({
  description: 'A list of email addresses.',
  control: i.controls.text({
    placeholder: 'john.doe@example.com, jane.smith@example.com',
  }),
  schema: v.pipe(
    v.string(),
    v.transform((emails) => emails.split(',')),
    v.pipe(v.array(v.pipe(v.string(), v.trim(), v.email())), v.maxLength(50)),
  ),
});

// Pin with regex validation
export const addressWithDisplayName = i.pins.data({
  description: 'An email address with a display name.',
  control: i.controls.text({
    placeholder: 'Your Name <sender@domain.com>',
  }),
  schema: v.pipe(
    v.string(),
    v.trim(),
    v.regex(
      /^(.+?)\s*<([^<>]+@[^<>]+)>$/,
      'Must be in format "Display Name <email@domain.com>"',
    ),
  ),
});
```

## Development Commands

### Root Level

- `bun run dev` - Start development mode for all integrations
- `bun run build` - Build all integrations
- `bun run lint` - Lint all packages
- `bun run typecheck` - Type check all packages
- `bun run format` - Format code with Prettier

### Integration Level

- `bun run dev` - Start development mode (`acme dev`)
- `bun run build` - Build integration (`acme build`)
- `bun run publish` - Publish integration (`acme publish`)
- `bun run lint` - Lint integration code
- `bun run typecheck` - Type check integration
- `bun run format` - Format integration code

## Dependencies

Core dependencies managed via workspace catalog:

- `@acme/integration-framework` - Core framework
- `@acme/style-guide` - Shared linting/formatting configs
- `valibot` - Schema validation
- `typescript` - TypeScript compiler
- `eslint` - Code linting
- `prettier` - Code formatting

## Build Process

1. **TypeScript Compilation**: Source code is compiled to JavaScript in `build/` directory
2. **Turbo Orchestration**: Turbo manages builds with proper dependency ordering across the monorepo
3. **Definition Generation**: Each integration exports:
   - `definition.json` - Runtime integration metadata
   - `types.json` - TypeScript type definitions
4. **Schema Validation**: Framework validates all pin schemas and environment configurations
5. **Type Generation**: Automatic generation of TypeScript types from schemas
6. **Asset Processing**: Integration icons and other assets are processed and included

## Environment Variables

Integrations can define required environment variables that are:

- **Validated**: Using valibot schemas during setup
- **Secure**: Encrypted storage with sensitive flag support
- **Accessible**: Available to all nodes through `opts.env`
- **User-friendly**: Configured through UI controls with descriptions
- **Type-safe**: Full TypeScript support with auto-completion

```typescript
// Environment definition example
env: {
  DATABASE_URL: i.env({
    control: i.controls.text({
      label: 'Database URL',
      description: 'PostgreSQL connection string',
      sensitive: true,
    }),
    schema: v.pipe(v.string(), v.url()),
  }),
  MAX_RETRIES: i.env({
    control: i.controls.text({
      label: 'Max Retries',
      description: 'Maximum number of retry attempts',
      placeholder: '3',
    }),
    schema: v.pipe(v.string(), v.transform(Number), v.minValue(0), v.maxValue(10)),
  }),
}
```

## Integration Development Best Practices

### API and Client Management

1. **Prefer Official Node.js Clients Over Raw Requests**: When implementing new integrations, avoid manually crafting raw API requests or relying on online API references alone. Instead, search for an official or well-maintained Node.js client library on npm and use that. For existing integrations, always use the client or SDK that is already defined in the integration's entry point, rather than introducing a new one.

### TypeScript Best Practices

1. **Prefer Inline Type Specifiers Over Top-Level Type-Only Imports**: Use inline `type` specifiers in import statements instead of top-level type-only imports for better tree-shaking and clarity.

```typescript
// ✅ Good - Inline type specifiers
import {
  type GetBroadcastResponseSuccess,
  type ListBroadcastsResponseSuccess,
} from 'resend';

// ❌ Bad - Top-level type-only import
import type {
  GetBroadcastResponseSuccess,
  ListBroadcastsResponseSuccess,
} from 'resend';
```

This approach:

- Makes it clear which imports are types vs runtime values
- Better tree-shaking for bundlers
- More explicit and readable
- Follows modern TypeScript best practices

### Pin Organization and Optimization

1. **Prioritize Pins**: Order the input and output pins based on the priority or importance of the data they carry. Most critical pins should appear first to improve user experience.

2. **Use Optional Flags for Clarity**: Improve node readability in the UI by marking less relevant or non-essential pins with `optional: true`. This helps users focus on required parameters first.

3. **Only Use `control: false` When Extending Existing Pins**: The `control` property defaults to no control when defining new pins. Only use `control: false` when extending existing pins that already have a control defined and you want to remove it.

```typescript
// Example demonstrating best practices
export const processData = i.nodes.callable({
  category,
  description: 'Process data with optional parameters.',

  inputs: {
    // High priority - required data
    data: pins.common.jsonData.with({
      description: 'Primary data to process.',
    }),

    // Medium priority - commonly used
    format: pins.common.format.with({
      description: 'Output format for the processed data.',
      optional: true,
    }),

    // Low priority - advanced options
    timeout: pins.common.timeout.with({
      description: 'Processing timeout in seconds.',
      optional: true,
    }),
  },

  outputs: {
    // Output pins have no control by default - no need to specify control: false
    result: pins.common.jsonData.with({
      description: 'The processed data result.',
    }),

    // When extending a pin that has a control, use control: false to remove it
    status: pins.common.inputStatus.with({
      description: 'Processing status information.',
      control: false, // Remove control from pin that was originally meant for input
    }),
  },

  async run(opts) {
    // Implementation
  },
});
```

### Node Implementation Best Practices

1. **Pass Properties Directly Into Objects**: When making API calls, pass input properties directly into parameter objects instead of using conditional spread operators. This keeps the code clean and lets the API handle undefined values appropriately.

```typescript
// ✅ Good - Direct property assignment
const orders = await opts.state.shopify.rest.Order.all({
  session: opts.state.session,
  limit: opts.inputs.limit,
  status: opts.inputs.status,
  financial_status: opts.inputs.financialStatus,
  created_at_min: opts.inputs.createdAtMin,
  fields: opts.inputs.fields,
});

// ❌ Bad - Conditional spread operators
const orders = await opts.state.shopify.rest.Order.all({
  session: opts.state.session,
  ...(opts.inputs.limit && { limit: opts.inputs.limit }),
  ...(opts.inputs.status && { status: opts.inputs.status }),
  ...(opts.inputs.financialStatus && {
    financial_status: opts.inputs.financialStatus,
  }),
  ...(opts.inputs.createdAtMin && { created_at_min: opts.inputs.createdAtMin }),
  ...(opts.inputs.fields && { fields: opts.inputs.fields }),
});
```

**Benefits of direct assignment**:

- **Cleaner code**: More readable and maintainable
- **Simpler logic**: No need for conditional checks
- **API-friendly**: Most APIs properly handle undefined/null values
- **Consistent structure**: Object shape is always the same

2. **Use Shared Session State**: Access the authenticated session through `opts.state.session` rather than creating session objects in individual nodes.

```typescript
// ✅ Good - Use shared session
const product = await opts.state.shopify.rest.Product.find({
  session: opts.state.session,
  id: opts.inputs.id,
});

// ❌ Bad - Create session in node
const session = process.env.ACCESS_TOKEN
  ? { accessToken: process.env.ACCESS_TOKEN, shop: process.env.SHOP_DOMAIN }
  : null;
```

## Example: Resend Integration

The Resend integration (`integrations/resend/`) demonstrates:

- Email sending with the Resend API
- Contact management functionality
- Proper error handling and validation
- Environment variable configuration for API keys
- Structured pins for email addresses, UUIDs, and objects

Key files:

- `src/nodes/emails/emails.ts` - Email operations (send, get, update, cancel)
- `src/nodes/contacts/contacts.ts` - Contact management (CRUD operations)
- `src/pins/` - Data type definitions for emails, contacts, audiences
