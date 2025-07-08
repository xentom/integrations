# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Start

This is a monorepo using Bun and Turborepo to manage multiple integration packages. Each integration provides nodes (actions and triggers) for workflow automation.

### Development Commands

**Workspace-Level Commands:**
- `bun run build` - Build all integrations in the workspace
- `bun run dev` - Start development mode for all integrations
- `bun run typecheck` - Run TypeScript type checking across all packages
- `bun run lint` - Run ESLint across all packages with caching
- `bun run format` - Check code formatting with Prettier
- `bun run format:fix` - Fix code formatting issues
- `bun run clean` - Clean build artifacts and node_modules

**Integration-Level Commands:**
Within each integration directory (`integrations/*/`):
- `acme dev` - Start development server for the specific integration
- `acme build` - Build the integration for production
- `acme publish` - Publish the integration to the marketplace

## Architecture Overview

### Monorepo Structure

```
acme-integrations/
├── integrations/           # Individual integration packages
│   ├── essentials/        # Core workflow utilities
│   ├── github/           # GitHub API integration
│   ├── openai/           # OpenAI API integration
│   ├── resend/           # Resend email service
│   ├── teamspeak/        # TeamSpeak integration
│   └── template/         # Template for new integrations
├── tooling/              # Shared development tools
│   └── style-guide/      # ESLint, Prettier, TypeScript configs
└── patches/              # Package patches via patchedDependencies
```

### Integration Framework

All integrations are built using the `@acme/integration-framework` package and follow a consistent pattern.

**Framework Schema Reference**: The complete TypeScript schema for the integration framework is located at `node_modules/@acme/integration-framework/dist/index.d.ts` and includes type definitions for integrations, nodes, pins, controls, and environment variables.

#### Integration Entry Point (`src/index.ts`)

```typescript
import * as v from 'valibot';
import * as i from '@acme/integration-framework';

import * as nodes from './nodes';

// Configure Valibot globally
v.setGlobalConfig({
  abortEarly: true,
  abortPipeEarly: true,
});

// Define integration state interface
export interface IntegrationState {
  // Custom state properties (e.g., API clients)
}

export default i.integration({
  nodes,
  env: {
    // Environment variables with validation
  },
  start(opts) {
    // Integration initialization logic
  },
});
```

#### Node Organization (`src/nodes/`)

Nodes are organized by functional categories and represent the core building blocks of integrations:

- **Triggers**: React to external events (webhooks, scheduled tasks)
- **Actions**: Perform operations (API calls, data manipulation)
- **Categories**: Grouped by functionality (e.g., `['AI', 'Prompts']`, `['Issues']`)

**Example Node Structure:**
```
src/nodes/
├── index.ts              # Node exports
├── emails/
│   ├── index.ts         # Email-related node exports
│   └── emails.ts        # Email action/trigger implementations
├── contacts/
│   ├── index.ts
│   └── contacts.ts
└── webhooks/
    ├── index.ts
    └── webhooks.ts
```

#### Reusable Component Organization

For better code reusability and maintainability, organize shared components in dedicated directories:

**`src/common/[domain]/index.ts`** - Domain-specific exports:

```typescript
export * as controls from './controls';
export * as pins from './pins';
export * as schemas from './schemas';
```

**`src/common/[domain]/schemas.ts`** - Domain validation schemas:

```typescript
import * as v from 'valibot';

export const email = v.pipe(v.string(), v.trim(), v.email());
export const uuid = v.pipe(v.string(), v.uuid());
export const url = v.pipe(v.string(), v.url());
```

**`src/common/[domain]/controls.ts`** - Domain-specific UI controls:

```typescript
import * as i from '@acme/integration-framework';

export const email = i.controls.text({
  placeholder: 'user@example.com',
});

export const apiKey = i.controls.text({
  placeholder: 'Enter API key...',
  sensitive: true,
});
```

**`src/common/[domain]/pins.ts`** - Domain-specific pin definitions:

```typescript
import * as v from 'valibot';
import * as i from '@acme/integration-framework';

export const id = i.pins.data({
  displayName: 'Email ID',
  schema: v.pipe(v.string(), v.uuid()),
});

export const idWithControl = id.with({
  control: i.controls.text({
    placeholder: 'xxxxxxxx-xxxx-...',
  }),
});
```

**Legacy Pin Organization (`src/pins/`)** - Simple pin organization:

```typescript
// src/pins/index.ts
export * as email from './email';

// src/pins/email.ts
import * as v from 'valibot';
import * as i from '@acme/integration-framework';

export const id = i.pins.data({
  displayName: 'Email ID',
  schema: v.pipe(v.string(), v.uuid()),
});
```

Usage in nodes:

```typescript
import * as pins from '@/pins';
import * as common from '@/common';

// Legacy approach
pins.email.id;

// Modern approach
common.email.pins.id;
```

#### Node Types and Patterns

**Triggers** - Use `i.nodes.trigger()` with `subscribe()` method:

```typescript
export const webhookTrigger = i.nodes.trigger({
  displayName: 'Webhook Received',
  description: 'Triggers when a webhook is received',
  outputs: {
    payload: i.pins.data({
      displayName: 'Webhook Payload',
      schema: v.record(v.string(), v.unknown()),
    }),
  },
  subscribe(opts) {
    // Set up webhook subscription
  },
});
```

**Actions** - Use `i.nodes.callable()` with `run()` method:

```typescript
export const sendEmail = i.nodes.callable({
  displayName: 'Send Email',
  description: 'Send an email using the configured service',
  inputs: {
    to: i.pins.data({
      displayName: 'To',
      schema: v.string(),
    }),
  },
  outputs: {
    id: i.pins.data({
      displayName: 'Email ID',
      schema: v.string(),
    }),
  },
  async run(opts) {
    // Email sending logic
  },
});
```

#### State Management

Integrations can define custom state interfaces for managing API clients and other stateful resources:

```typescript
export interface IntegrationState {
  apiClient: SomeAPIClient;
  webhookSecret: string;
}

export default i.integration({
  nodes,
  start(opts) {
    // Initialize state
    opts.state.apiClient = new SomeAPIClient(process.env.API_KEY);
    opts.state.webhookSecret = generateSecret();
  },
});
```

Global state is extended via module augmentation in `src/index.ts`.

### Key Patterns

#### Environment Variables

Define environment variables with validation and async checks:

```typescript
env: {
  API_KEY: i.env({
    control: i.controls.text({
      label: 'API Key',
      description: 'Enter your API key from the service dashboard',
      placeholder: 'sk_...',
      sensitive: true,
    }),
    schema: v.pipeAsync(
      v.string(),
      v.startsWith('sk_'),
      v.checkAsync(async (token) => {
        // Validate token with API
        const client = new APIClient(token);
        try {
          await client.validateToken();
          return true;
        } catch {
          return false;
        }
      }, 'Invalid API key. Please check your key and permissions.'),
    ),
  }),
}
```

#### Webhook Integration

The GitHub integration demonstrates the webhook pattern with signature verification:

```typescript
start(opts) {
  opts.webhook.subscribe(async (request) => {
    const signature = request.headers.get('X-Hub-Signature-256');
    const payload = await request.text();
    
    // Verify signature
    if (!(await opts.state.webhooks.verify(payload, signature))) {
      console.warn('Webhook signature invalid');
      return;
    }
    
    // Process webhook
    await opts.state.webhooks.receive({
      id: request.headers.get('X-GitHub-Delivery'),
      name: request.headers.get('X-GitHub-Event'),
      payload: JSON.parse(payload),
    });
  });
}
```

#### Data Validation

All integrations use Valibot for schema validation:

```typescript
// Global configuration (set in src/index.ts)
v.setGlobalConfig({
  abortEarly: true,
  abortPipeEarly: true,
});

// Common validation patterns
export const email = v.pipe(v.string(), v.trim(), v.email());
export const uuid = v.pipe(v.string(), v.uuid());
export const url = v.pipe(v.string(), v.url());
export const isoDateTime = v.pipe(v.string(), v.isoDateTime());
export const nonEmptyString = v.pipe(v.string(), v.minLength(1));
```

#### UI Controls and UX

Rich UI controls provide better user experience:

```typescript
// Standard control patterns
export const email = i.controls.text({
  placeholder: 'user@example.com',
});

export const apiKey = i.controls.text({
  placeholder: 'Enter API key...',
  sensitive: true,
});

export const booleanSwitch = i.controls.switch({
  defaultValue: false,
});

export const dropdown = i.controls.select({
  options: [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
  ],
});
```

#### Pin Patterns and Visibility

**Standard Pin Patterns:**
- **ID pins**: `entityId` (without control) and `entityIdWithControl` (with control)
- **Reference pins**: For external resources (repositories, channels, etc.)
- **Data pins**: For API responses and structured data
- **Optional pins**: Using `v.optional()` for non-required fields

**Pin Visibility Guidelines:**
- **Important data pins only**: Add only the most critical data pins to inputs and outputs
- **Hidden pins for clutter reduction**: When a node has more than 5 data pins, set `hidden: true` on less critical ones to reduce visual clutter
- **Context-specific visibility**: Ensure only context-specific pins are shown by default - users can manually add hidden pins when needed

```typescript
// Example of hiding less critical pins
inputs: {
  // Critical pins - always visible
  message: i.pins.data({
    displayName: 'Message',
    schema: v.string(),
  }),

  // Less critical pins - hidden by default
  metadata: i.pins.data({
    displayName: 'Metadata',
    schema: v.optional(v.record(v.string(), v.unknown())),
    hidden: true,
  }),

  advancedOptions: i.pins.data({
    displayName: 'Advanced Options',
    schema: v.optional(v.object({ /* ... */ })),
    hidden: true,
  }),
}
```

## Integration Examples

### Essentials Integration

Core functionality providing:
- **Webhooks**: Generic webhook handling and response management
- **HTTP requests**: REST API calls with authentication
- **File operations**: File upload, download, and manipulation
- **Data types**: Primitive and structured data transformation
- **Time utilities**: Date/time formatting and manipulation
- **Workflow controls**: Conditional logic and flow control

### GitHub Integration

External API integration featuring:
- **OAuth token validation**: Async API key verification
- **Webhook signature verification**: HMAC-SHA256 signature validation
- **Repository management**: Repository creation, updates, and queries
- **Issue management**: Issue creation, updates, and tracking
- **Custom state**: Octokit client instance management

### OpenAI Integration

AI service integration with:
- **File handling**: Document upload and processing
- **Response management**: AI model response handling and formatting
- **Streaming support**: Real-time response streaming

### Resend Integration

Email service integration providing:
- **Contact management**: Contact creation, updates, and list management
- **Email operations**: Email sending with templates and attachments
- **Audience management**: Subscriber list management
- **Broadcast support**: Bulk email sending capabilities

### TeamSpeak Integration

Voice communication integration with:
- **Channel management**: Channel creation, updates, and monitoring
- **User management**: User permissions and status tracking

### Template Integration

Minimal template for creating new integrations:
- **Empty state interface**: Ready for customization
- **Basic node structure**: Starting point for new nodes
- **Standard configuration**: Pre-configured build and lint setup

## Development Workflow

### Creating New Integrations

1. **Start with template**: Copy the `template` integration as a starting point
2. **Update metadata**: Modify `package.json` with integration name and description
3. **Design the integration**: Plan nodes, pins, and API interactions
4. **Implement core functionality**:
   - Define environment variables in `src/index.ts`
   - Create state interface for API clients
   - Implement nodes in `src/nodes/` with proper categorization
   - Organize reusable components in `src/common/` or `src/pins/`
5. **Add documentation**: Create README.md with setup instructions and examples
6. **Test thoroughly**: Use `bun run typecheck` and `bun run lint` during development
7. **Build and publish**: Use `bun run build` and `acme publish`

### Code Organization Best Practices

**Reusable Components:**
- **Modern approach**: Use `src/common/[domain]/` for domain-specific schemas, controls, and pins
- **Legacy approach**: Use `src/pins/`, `src/schemas/`, `src/controls/` for simple organization
- **Import patterns**: Use path aliases (`@/common`, `@/pins`, `@/schemas`) for clean imports

**Naming Conventions:**
- **Descriptive names**: Use clear, descriptive names for all components
- **Consistent patterns**: Follow established naming patterns across integrations
- **Domain grouping**: Group related functionality by domain (e.g., email, users, files)

**Documentation Requirements:**
- **Descriptions**: Every node, pin, control, and environment variable must have a brief, clear description
- **JSDoc comments**: Add JSDoc comments for complex validation patterns and utilities
- **README files**: Each integration should have comprehensive setup and usage documentation

### Code Quality and Testing

**Type Safety:**
- All integrations use TypeScript with strict checking
- Global type definitions in `globals.d.ts`
- Integration state properly typed via module augmentation
- Comprehensive Valibot schema validation

**Code Quality Tools:**
- **ESLint**: Shared configuration from `@acme/style-guide`
- **Prettier**: Shared formatting configuration
- **TypeScript**: Strict type checking across all packages
- **Catalog dependencies**: Version consistency across workspace

**Development Commands:**
- `bun run typecheck` - Run TypeScript type checking
- `bun run lint` - Run ESLint with caching
- `bun run format` - Check code formatting
- `bun run format:fix` - Fix formatting issues
- `bun run build` - Build all integrations
- `bun run clean` - Clean build artifacts

### Integration Testing

**Validation Testing:**
- Test all Valibot schemas with edge cases
- Verify environment variable validation
- Test pin validation with various input types

**API Integration Testing:**
- Test all API endpoints with valid and invalid data
- Verify error handling and timeout scenarios
- Test webhook signature verification

**Node Testing:**
- Test all node inputs and outputs
- Verify proper error handling and validation
- Test async operations and state management

## Package Management

### Bun Workspaces

The monorepo uses Bun workspaces for dependency management:

```json
{
  "workspaces": {
    "packages": [
      "integrations/*",
      "tooling/*"
    ],
    "catalog": {
      "@acme/integration-framework": "link:@acme/integration-framework",
      "@acme/style-guide": "*",
      "valibot": "^1.1.0",
      "eslint": "^9.29.0",
      "prettier": "^3.5.3",
      "typescript": "^5"
    }
  }
}
```

**Key Features:**
- **Catalog dependencies**: Shared version management for common packages
- **Linked dependencies**: Framework packages linked from workspace
- **Patched dependencies**: Custom patches applied to third-party packages
- **Workspace hoisting**: Shared dependencies hoisted to root `node_modules`

**Key Catalog Packages:**
- `@acme/integration-framework` - Core integration framework
- `@acme/style-guide` - Shared ESLint, Prettier, and TypeScript configs
- `valibot` - Schema validation library
- `eslint` - Code linting
- `prettier` - Code formatting
- `typescript` - TypeScript compiler

### Dependency Guidelines

**Adding Dependencies:**
- Use catalog versions when available
- Add new dependencies to catalog if used by multiple integrations
- Keep dependencies minimal and focused
- Prefer packages with good TypeScript support

**Version Management:**
- Use catalog for shared dependencies
- Use specific versions for integration-specific packages
- Update catalog versions carefully to avoid breaking changes
- Test all integrations after catalog updates

## Troubleshooting

### Common Issues

**Build Failures:**
- Run `bun run clean` to clear build cache
- Check TypeScript errors with `bun run typecheck`
- Verify all dependencies are installed

**Linting Issues:**
- Run `bun run lint` to identify problems
- Use `bun run format:fix` to fix formatting
- Check ESLint configuration in `eslint.config.mjs`

**Integration Framework Issues:**
- Verify `@acme/integration-framework` is properly linked
- Check if framework types are available in `node_modules`
- Ensure global type definitions are in `globals.d.ts`

**Runtime Issues:**
- Check environment variable validation
- Verify API credentials and permissions
- Review webhook configuration and signatures
- Check network connectivity and rate limits
