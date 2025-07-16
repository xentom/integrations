# Xentom Integrations Framework Documentation

## Overview

This is a comprehensive guide for building integrations using the Xentom integration framework. This monorepo uses Turbo for build orchestration, Bun as the package manager, and TypeScript with strict type checking.

## Table of Contents

1. [Architecture & Core Concepts](#architecture--core-concepts)
2. [Project Structure](#project-structure)
3. [Integration Development Guide](#integration-development-guide)
4. [Pin System Deep Dive](#pin-system-deep-dive)
5. [Node Implementation Patterns](#node-implementation-patterns)
6. [Environment & Configuration](#environment--configuration)
7. [API Integration Strategies](#api-integration-strategies)
8. [Development Workflow](#development-workflow)
9. [Build Process](#build-process)
10. [Examples & Patterns](#examples--patterns)

## Architecture & Core Concepts

### Integration Framework Components

**Nodes** - Building blocks of integrations:

- **Trigger nodes**: Event-driven (webhooks, polling) that start workflows
- **Callable nodes**: On-demand execution for business logic functions
- **Pure nodes**: Stateless transformations for data manipulation

**Pins** - Type-safe data definitions:

- **Data pins**: Typed inputs/outputs with valibot schemas or TypeScript generics
- **Execution pins**: Control flow connections between nodes

**Controls** - UI components for user configuration:

- **Text**: Plain text input with template expression support
- **Expression**: JavaScript code evaluation at runtime
- **Select**: Dropdown with static or dynamic options
- **Switch**: Boolean toggle controls

**Environment** - Secure configuration management:

- API keys, tokens, connection strings
- Validated with valibot schemas, encrypted storage

**Webhooks** - HTTP endpoints for external triggers:

- Automatic endpoint generation and request routing

### Framework Philosophy

- **Type Safety First**: Leverage TypeScript for compile-time validation
- **Runtime Validation**: Use valibot for user input validation
- **Reusability**: Design pins to be reused across multiple nodes
- **Performance**: Minimize runtime overhead with proper typing
- **Developer Experience**: Clear APIs and helpful error messages

## Project Structure

```
.                                     # Root monorepo directory
├── integrations/[name]/              # Individual integrations
│   ├── src/
│   │   ├── index.ts                  # Integration entry point
│   │   ├── globals.d.ts              # TypeScript global declarations
│   │   ├── nodes/
│   │   │   ├── [category]/           # Node category directories
│   │   │   │   ├── [category].ts     # Node implementations
│   │   │   │   └── index.ts          # Category exports
│   │   │   └── index.ts              # All nodes export
│   │   └── pins/
│   │       ├── [category].ts         # Pin definitions by category
│   │       └── index.ts              # All pins export
│   ├── images/icon.png               # Integration icon (required)
│   ├── package.json                  # Package configuration
│   ├── tsconfig.json                 # TypeScript config
│   └── eslint.config.mjs             # ESLint configuration
├── node_modules/@xentom/integration-framework/  # Core framework
├── tooling/style-guide/              # Shared linting/formatting configs
├── package.json                      # Root workspace configuration
├── turbo.json                        # Turbo build configuration
└── CLAUDE.md                         # This documentation
```

### Required Files for Each Integration

1. **`images/icon.png`** - Integration icon for UI display
2. **`src/index.ts`** - Main integration export with nodes and environment
3. **`src/nodes/`** - Directory containing all node implementations
4. **`src/pins/`** - Data type definitions and schemas
5. **`eslint.config.mjs`** - ESLint configuration
6. **`tsconfig.json`** - TypeScript configuration
7. **`package.json`** - Package configuration with framework dependency

## Integration Development Guide

### Creating a New Integration

1. **Copy Template**: Start with `/integrations/template/` as base
2. **Update Package Info**: Modify `package.json` with integration name and dependencies
3. **Add Icon**: Replace `images/icon.png` with integration-specific icon
4. **Configure Environment**: Define required API keys and configuration in `src/index.ts`
5. **Implement Pins**: Create data type definitions in `src/pins/`
6. **Build Nodes**: Implement integration functionality in `src/nodes/`

### Integration Entry Point Pattern

```typescript
// src/index.ts
import { SomeApiClient } from 'some-api-client';
import * as v from 'valibot';

import * as i from '@xentom/integration-framework';

import * as nodes from './nodes';

export default i.integration({
  nodes,
  env: {
    API_KEY: i.env({
      control: i.controls.text({
        label: 'API Key',
        sensitive: true,
        description: 'Your API key for authentication',
      }),
      schema: v.string(),
    }),
    API_URL: i.env({
      control: i.controls.text({
        label: 'API Base URL',
        description: 'Base URL for API requests',
        placeholder: 'https://api.example.com',
      }),
      schema: v.pipe(v.string(), v.url()),
    }),
  },
  start(opts) {
    // Initialize shared state with API client
    opts.state.client = new SomeApiClient({
      apiKey: process.env.API_KEY,
      baseURL: process.env.API_URL,
    });
  },
});
```

## Pin System Deep Dive

### Pin Categories and Organization

Organize pins by logical domain categories:

```
pins/
├── user.ts          # User-related data types
├── file.ts          # File and document types
├── message.ts       # Communication types
├── common.ts        # Shared/utility types
└── index.ts         # Export all categories
```

### Pin Naming Conventions

**Critical Rules:**

- **NO category prefixes**: Export `address` not `emailAddress`
- **Generic naming**: Use `item` for singles, `list` for arrays
- **Semantic properties**: Use specific names for individual fields

```typescript
// ✅ Good naming patterns
export const item; // pins.user.item
export const list; // pins.user.list
export const id; // pins.user.id
export const name; // pins.user.name
export const email; // pins.user.email

// ❌ Bad naming patterns
export const user; // Would create pins.user.user
export const users; // Use 'list' instead
export const userId; // Use 'id' instead
```

### Pin Type Strategies

**Simple Types with Validation:**

```typescript
export const email = i.pins.data({
  description: 'An email address.',
  control: i.controls.text({
    placeholder: 'user@example.com',
  }),
  schema: v.pipe(v.string(), v.trim(), v.email()),
});
```

**Complex Types with TypeScript Generics:**

```typescript
import { type UserProfile } from 'api-client';

export const profile = i.pins.data<UserProfile>({
  description: 'Complete user profile information.',
  // No schema needed - TypeScript provides type safety
});
```

**Transformed Input Types:**

```typescript
export const emails = i.pins.data({
  description: 'Multiple email addresses (comma-separated).',
  control: i.controls.text({
    placeholder: 'user1@example.com, user2@example.com',
  }),
  schema: v.pipe(
    v.string(),
    v.transform((str) => str.split(',').map((s) => s.trim())),
    v.array(v.pipe(v.string(), v.email())),
    v.maxLength(50),
  ),
});
```

### Pin Optionality Patterns

**Define pins as non-optional by default:**

```typescript
// src/pins/common.ts
export const timeout = i.pins.data({
  description: 'Request timeout in seconds.',
  control: i.controls.text({
    placeholder: '30',
  }),
  schema: v.pipe(v.string(), v.transform(Number), v.integer(), v.minValue(1)),
});
```

**Handle optionality at usage sites:**

```typescript
// In node implementations
inputs: {
  required: pins.common.timeout,
  optional: pins.common.timeout.with({ optional: true }),
  withDefault: pins.common.timeout.with({
    optional: true,
    description: 'Request timeout in seconds (default: 30).',
  }),
}
```

### Control Configuration Patterns

**Input Controls (for user-facing pins):**

```typescript
export const message = i.pins.data({
  description: 'Message content.',
  control: i.controls.text({
    placeholder: 'Enter your message...',
    multiline: true,
  }),
  schema: v.pipe(v.string(), v.minLength(1)),
});

export const priority = i.pins.data({
  description: 'Message priority level.',
  control: i.controls.select({
    options: [
      { value: 'low', label: 'Low' },
      { value: 'normal', label: 'Normal' },
      { value: 'high', label: 'High' },
    ],
  }),
  schema: v.picklist(['low', 'normal', 'high']),
});
```

**Output-Only Pins (no controls needed):**

```typescript
import { type ApiResponse } from 'client';

export const response = i.pins.data<ApiResponse>({
  description: 'API response data.',
  // No control property - this pin is for outputs only
});
```

## Node Implementation Patterns

### Node Categories and Structure

```typescript
// src/nodes/users/users.ts
import * as pins from '@/pins';

import * as i from '@xentom/integration-framework';

const category = {
  path: ['Users'],
} satisfies i.NodeCategory;

export const getUser = i.nodes.callable({
  category,
  description: 'Retrieve user information by ID.',

  inputs: {
    // Required inputs first
    id: pins.user.id,

    // Optional inputs after
    includeProfile: pins.common.flag.with({
      description: 'Include full profile information.',
      optional: true,
    }),
  },

  outputs: {
    user: pins.user.item.with<UserResponse['user']>({
      description: 'User information.',
    }),
  },

  async run(opts) {
    const response = await opts.state.client.users.get({
      id: opts.inputs.id,
      include_profile: opts.inputs.includeProfile,
    });

    if (!response.ok) {
      throw new Error(`Failed to get user: ${response.error}`);
    }

    return opts.next({ user: response.user });
  },
});
```

### Semantic Output Patterns

**Return Specific Data (not full API responses):**

```typescript
// ✅ Good - Extract meaningful data
export const listFiles = i.nodes.callable({
  outputs: {
    files: pins.file.list.with<FileItem[]>({
      description: 'Array of files.',
    }),
    totalCount: pins.common.count.with({
      description: 'Total number of files.',
    }),
  },

  async run(opts) {
    const response = await opts.state.client.files.list();

    return opts.next({
      files: response.files ?? [],
      totalCount: response.total ?? 0,
    });
  },
});

// ❌ Bad - Return full API response
export const listFiles = i.nodes.callable({
  outputs: {
    response: pins.file.apiResponse.with({
      description: 'Files API response.',
    }),
  },

  async run(opts) {
    const response = await opts.state.client.files.list();
    return opts.next({ response }); // User must navigate response.files
  },
});
```

### Operation Nodes (No Outputs)

```typescript
export const deleteFile = i.nodes.callable({
  category,
  description: 'Delete a file permanently.',

  inputs: {
    id: pins.file.id,
  },

  // No outputs property for operations that don't return data

  async run(opts) {
    const response = await opts.state.client.files.delete({
      id: opts.inputs.id,
    });

    if (!response.ok) {
      throw new Error(`Failed to delete file: ${response.error}`);
    }

    return opts.next(); // Operation completed successfully
  },
});
```

### Error Handling Patterns

```typescript
async run(opts) {
  try {
    const response = await opts.state.client.someOperation({
      param: opts.inputs.param,
    });

    // Handle API-specific error responses
    if (!response.ok) {
      throw new Error(`API Error: ${response.error?.message || 'Unknown error'}`);
    }

    // Handle missing required data
    if (!response.data) {
      throw new Error('No data returned from API');
    }

    return opts.next({ result: response.data });

  } catch (error) {
    // Re-throw with context
    throw new Error(`Failed to complete operation: ${error.message}`);
  }
}
```

### Trigger Node Patterns

```typescript
export const webhookTrigger = i.nodes.trigger({
  category,
  description: 'Triggered when a webhook is received.',

  outputs: {
    payload: pins.webhook.payload.with<WebhookPayload>({
      description: 'Webhook payload data.',
    }),
    headers: pins.webhook.headers.with({
      description: 'Request headers.',
    }),
  },

  async setup(opts) {
    // Configure webhook endpoint
    return opts.webhook({
      path: '/webhook',
      method: 'POST',
    });
  },

  async run(opts) {
    const { payload, headers } = opts.request;

    // Validate webhook signature if needed
    const isValid = validateWebhookSignature(headers, payload);
    if (!isValid) {
      throw new Error('Invalid webhook signature');
    }

    return opts.next({
      payload,
      headers,
    });
  },
});
```

## Environment & Configuration

### Environment Variable Patterns

```typescript
env: {
  // Required API credentials
  API_KEY: i.env({
    control: i.controls.text({
      label: 'API Key',
      sensitive: true,
      description: 'Your API key for authentication',
    }),
    schema: v.string(),
  }),

  // Optional configuration with defaults
  TIMEOUT: i.env({
    control: i.controls.text({
      label: 'Request Timeout',
      description: 'Timeout for API requests in seconds',
      placeholder: '30',
    }),
    schema: v.pipe(
      v.string(),
      v.transform(str => str || '30'),
      v.transform(Number),
      v.integer(),
      v.minValue(1),
      v.maxValue(300)
    ),
  }),

  // URL validation
  BASE_URL: i.env({
    control: i.controls.text({
      label: 'Base URL',
      description: 'API base URL',
      placeholder: 'https://api.example.com',
    }),
    schema: v.pipe(v.string(), v.url()),
  }),
}
```

### Client Initialization Patterns

```typescript
start(opts) {
  // Basic client setup
  opts.state.client = new ApiClient({
    apiKey: process.env.API_KEY,
    baseURL: process.env.BASE_URL,
    timeout: Number(process.env.TIMEOUT || '30') * 1000,
  });

  // Session-based setup
  opts.state.session = {
    accessToken: process.env.ACCESS_TOKEN,
    refreshToken: process.env.REFRESH_TOKEN,
    expiresAt: Date.now() + 3600000, // 1 hour
  };

  // Multiple client setup
  opts.state.api = new ApiClient(process.env.API_KEY);
  opts.state.webhook = new WebhookClient(process.env.WEBHOOK_SECRET);
}
```

## API Integration Strategies

### Official Client Libraries

**Search for official Node.js SDKs first:**

1. Check npm for `[service-name]` or `@[service-name]/[client]`
2. Look for official documentation and TypeScript support
3. Verify maintenance status and version compatibility

**Example integration with official client:**

```typescript
// Using official Slack Web API
import { WebClient } from '@slack/web-api';

start(opts) {
  opts.state.slack = new WebClient(process.env.SLACK_BOT_TOKEN);
}

// In nodes
const response = await opts.state.slack.chat.postMessage({
  channel: opts.inputs.channel,
  text: opts.inputs.text,
});
```

### Type Import Strategies

**Import response types from client libraries:**

```typescript
import {
  type ChatPostMessageResponse,
  type ConversationsListResponse,
  type UsersListResponse,
} from '@slack/web-api';

// Use in pin definitions
export const message = i.pins.data<ChatPostMessageResponse['message']>({
  description: 'Posted message information.',
});
```

### Library Type Investigation

**When facing TypeScript errors, investigate library types:**

```bash
# Check library type definitions
ls node_modules/@slack/web-api/dist/types/
cat node_modules/@slack/web-api/dist/types/response/chat.d.ts
```

**Use discovered types correctly:**

```typescript
// After checking types, use proper method signatures
const response: ChatPostMessageResponse =
  await opts.state.slack.chat.postMessage({
    channel: opts.inputs.channel,
    text: opts.inputs.text,
    blocks: opts.inputs.blocks, // Library handles undefined correctly
  });
```

## Development Workflow

### Commands

**Root Level Commands:**

```bash
bun run dev        # Start development mode for all integrations
bun run build      # Build all integrations with Turbo
bun run lint       # Lint all packages
bun run typecheck  # Type check all packages
bun run format     # Format code with Prettier
```

**Integration Level Commands (within `/integrations/[name]/`):**

```bash
bun run dev        # Start development mode (xentom dev)
bun run build      # Build integration (xentom build)
bun run publish    # Publish integration (xentom publish)
bun run lint       # Lint integration code
bun run typecheck  # Type check integration
bun run format     # Format integration code
```

### Development Process

1. **Setup**: Copy template and configure basic settings
2. **Environment**: Define required environment variables
3. **Pins**: Create data type definitions
4. **Nodes**: Implement integration functionality
5. **Testing**: Use `bun run dev` for iterative development
6. **Validation**: Run lint and typecheck before publishing

## Build Process

### Build Pipeline Steps

1. **TypeScript Compilation**: Source code compiled to JavaScript in `build/` directory
2. **Turbo Orchestration**: Manages builds with proper dependency ordering across monorepo
3. **Definition Generation**: Each integration exports `definition.json` and `types.json`
4. **Schema Validation**: Framework validates all pin schemas and environment configurations
5. **Type Generation**: Automatic TypeScript type generation from schemas
6. **Asset Processing**: Integration icons and assets processed and included

### Build Outputs

```
build/
├── definition.json    # Runtime integration metadata
├── types.json        # TypeScript type definitions
├── index.js          # Compiled integration code
└── assets/           # Processed icons and resources
```

## Examples & Patterns

### Complete Integration Example: Resend

```typescript
// src/index.ts
import { Resend } from 'resend';
import * as v from 'valibot';

import * as i from '@xentom/integration-framework';

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
    opts.state.resend = new Resend(process.env.RESEND_API_KEY);
  },
});
```

```typescript
// src/pins/email.ts
import { type GetEmailResponse } from 'resend';
import * as v from 'valibot';

import * as i from '@xentom/integration-framework';

export const address = i.pins.data({
  description: 'An email address.',
  control: i.controls.text({
    placeholder: 'john.doe@example.com',
  }),
  schema: v.pipe(v.string(), v.trim(), v.email()),
});

export const addresses = i.pins.data({
  description: 'Multiple email addresses (comma-separated).',
  control: i.controls.text({
    placeholder: 'john@example.com, jane@example.com',
  }),
  schema: v.pipe(
    v.string(),
    v.transform((emails) => emails.split(',')),
    v.array(v.pipe(v.string(), v.trim(), v.email())),
    v.maxLength(50),
  ),
});

export const item = i.pins.data<GetEmailResponse['data']>({
  description: 'Email object with complete information.',
});
```

```typescript
// src/nodes/emails/emails.ts
import * as pins from '@/pins';

import * as i from '@xentom/integration-framework';

const category = {
  path: ['Emails'],
} satisfies i.NodeCategory;

export const sendEmail = i.nodes.callable({
  category,
  description: 'Send an email using Resend.',

  inputs: {
    from: pins.email.address.with({
      description: "Sender's email address.",
    }),
    to: pins.email.addresses.with({
      description: 'Recipient email addresses.',
    }),
    subject: pins.email.subject,
    html: pins.email.html.with({
      description: 'HTML content of the email.',
      optional: true,
    }),
    text: pins.email.text.with({
      description: 'Plain text content of the email.',
      optional: true,
    }),
  },

  outputs: {
    id: pins.email.id.with({
      description: 'The ID of the sent email.',
    }),
  },

  async run(opts) {
    const response = await opts.state.resend.emails.send({
      from: opts.inputs.from,
      to: opts.inputs.to,
      subject: opts.inputs.subject,
      html: opts.inputs.html,
      text: opts.inputs.text,
    });

    if (response.error) {
      throw new Error(`Failed to send email: ${response.error.message}`);
    }

    return opts.next({ id: response.data.id });
  },
});
```

### Common Integration Patterns

**List Operations:**

```typescript
export const listItems = i.nodes.callable({
  inputs: {
    limit: pins.common.limit.with({ optional: true }),
    offset: pins.common.offset.with({ optional: true }),
  },

  outputs: {
    items: pins.item.list.with<ItemType[]>({
      description: 'Array of items.',
    }),
    total: pins.common.count.with({
      description: 'Total number of items.',
    }),
  },

  async run(opts) {
    const response = await opts.state.client.items.list({
      limit: opts.inputs.limit,
      offset: opts.inputs.offset,
    });

    return opts.next({
      items: response.items ?? [],
      total: response.total ?? 0,
    });
  },
});
```

**CRUD Operations:**

```typescript
export const createItem = i.nodes.callable({
  inputs: {
    name: pins.item.name,
    description: pins.item.description.with({ optional: true }),
  },

  outputs: {
    item: pins.item.item.with<CreatedItem>({
      description: 'The created item.',
    }),
  },

  async run(opts) {
    const response = await opts.state.client.items.create({
      name: opts.inputs.name,
      description: opts.inputs.description,
    });

    return opts.next({ item: response.item });
  },
});

export const updateItem = i.nodes.callable({
  inputs: {
    id: pins.item.id,
    name: pins.item.name.with({ optional: true }),
    description: pins.item.description.with({ optional: true }),
  },

  outputs: {
    item: pins.item.item.with<UpdatedItem>({
      description: 'The updated item.',
    }),
  },

  async run(opts) {
    const response = await opts.state.client.items.update({
      id: opts.inputs.id,
      name: opts.inputs.name,
      description: opts.inputs.description,
    });

    return opts.next({ item: response.item });
  },
});

export const deleteItem = i.nodes.callable({
  inputs: {
    id: pins.item.id,
  },

  // No outputs for delete operations

  async run(opts) {
    const response = await opts.state.client.items.delete({
      id: opts.inputs.id,
    });

    if (!response.ok) {
      throw new Error(`Failed to delete item: ${response.error}`);
    }

    return opts.next();
  },
});
```

This documentation provides comprehensive guidance for building integrations with the Xentom framework, covering everything from basic concepts to advanced patterns and real-world examples.
