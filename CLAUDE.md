# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

This is a monorepo using Bun and Turborepo to manage multiple integration packages.

### Build and Development

- `bun run build` - Build all integrations in the workspace
- `bun run dev` - Start development mode for all integrations
- `bun run typecheck` - Run TypeScript type checking across all packages
- `bun run lint` - Run ESLint across all packages with caching
- `bun run format` - Check code formatting with Prettier
- `bun run format:fix` - Fix code formatting issues
- `bun run clean` - Clean build artifacts and node_modules

### Integration-Specific Commands

Within each integration directory (`integrations/*/`):

- `acme dev` - Start development server for the specific integration
- `acme build` - Build the integration for production
- `acme publish` - Publish the integration to the marketplace

## Architecture Overview

### Monorepo Structure

- **Root**: Contains workspace configuration and shared tooling
- **`integrations/`**: Individual integration packages (essentials, github, openai, resend, teamspeak, template)
- **`patches/`**: Package patches applied via `patchedDependencies`

### Integration Framework

All integrations are built using the `@acme/integration-framework` package and follow a consistent pattern:

**Framework Schema Reference**: The complete TypeScript schema for the integration framework is located at `node_modules/@acme/integration-framework/dist/index.d.ts` and includes type definitions for integrations, nodes, pins, controls, and environment variables.

#### Integration Entry Point (`src/index.ts`)

```typescript
import * as i from '@acme/integration-framework';
import * as nodes from './nodes';

export default i.integration({
  nodes,
  // Optional: environment variables, lifecycle hooks, state management
});
```

#### Node Organization (`src/nodes/`)

Nodes are organized by functional categories:

- **Triggers**: React to external events (webhooks, scheduled tasks)
- **Actions**: Perform operations (API calls, data manipulation)
- **Categories**: Grouped by functionality (e.g., `['AI', 'Prompts']`, `['Issues']`)

#### Reusable Component Organization

For better code reusability and maintainability, organize shared components in dedicated directories:

**`src/schemas/`** - Reusable validation schemas:

```typescript
// src/schemas/index.ts
export const email = v.pipe(v.string(), v.email());
export const uuid = v.pipe(v.string(), v.uuid());
export const emailWithDisplayName = v.pipe(
  v.string(),
  v.regex(/^[^<>]+<[^<>]+@[^<>]+>$|^[^<>]+@[^<>]+$/)
);

// Usage in nodes
import * as schemas from '@/schemas';
```

**`src/pins/`** - Reusable pin definitions:

```typescript
// src/pins/index.ts
export const emailId = i.pins.data({
  displayName: 'Email ID',
  schema: schemas.uuid,
});

export const emailIdWithControl = i.pins.data({
  displayName: 'Email ID',
  schema: schemas.uuid,
  control: controls.uuid,
});

// Usage in nodes
import * as pins from '@/pins';
```

**`src/controls/`** - Reusable control definitions:

```typescript
// src/controls/index.ts
export const uuid = i.controls.text({
  placeholder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
});

export const email = i.controls.text({
  placeholder: 'user@example.com',
});

// Usage in nodes
import * as controls from '@/controls';
```

**Common Patterns:**

- **Schemas**: Use Valibot for consistent validation across integrations
- **Pins**: Create both base pins (without controls) and extended pins (with controls)
- **Controls**: Define reusable controls with appropriate placeholders and validation
- **Import aliases**: Use `@/schemas`, `@/pins`, `@/controls` for clean imports

#### Node Types

- **Triggers**: Use `i.nodes.trigger()` with `subscribe()` method
- **Actions**: Use `i.nodes.callable()` with `run()` method
- **Pins**: Define inputs/outputs with `i.pins.data()` and validation schemas

#### State Management

Integrations can define custom state interfaces:

```typescript
export interface IntegrationState {
  // Custom state properties
}
```

Global state is extended via module augmentation in `src/index.ts`.

### Key Patterns

#### Environment Variables

Define environment variables with validation:

```typescript
env: {
  API_TOKEN: i.env({
    control: i.controls.text({ sensitive: true }),
    schema: v.pipe(v.string(), v.minLength(1)),
  }),
}
```

#### Webhook Integration

- GitHub integration shows webhook pattern with signature verification
- Webhook subscriptions use `opts.webhook.subscribe()`
- Response handling via event emitters for request/response correlation

#### Data Validation

- Uses Valibot (`v`) for schema validation
- Schemas defined on pins for input/output validation
- Global Valibot config: `abortEarly: true, abortPipeEarly: true`

#### Controls and UI

- Rich UI controls: `i.controls.text()`, `i.controls.select()`, etc.
- Sensitive data marked with `sensitive: true`
- Default values and placeholders for better UX

#### Common Reusable Components

**Standard Schemas** (frequently used across integrations):

```typescript
// Common validation patterns
export const email = v.pipe(v.string(), v.email());
export const uuid = v.pipe(v.string(), v.uuid());
export const url = v.pipe(v.string(), v.url());
export const isoDateTime = v.pipe(v.string(), v.isoDateTime());
export const nonEmptyString = v.pipe(v.string(), v.minLength(1));
```

**Standard Controls** (consistent UI patterns):

```typescript
// Common input controls
export const email = i.controls.text({
  placeholder: 'user@example.com',
});

export const uuid = i.controls.text({
  placeholder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
});

export const apiKey = i.controls.text({
  placeholder: 'Enter API key...',
  sensitive: true,
});

export const booleanSwitch = i.controls.switch({
  defaultValue: false,
});
```

**Standard Pin Patterns**:

- ID pins: `entityId` (without control) and `entityIdWithControl` (with control)
- Reference pins: For external resources (repositories, channels, etc.)
- Data pins: For API responses and structured data
- Optional pins: Using `v.optional()` for non-required fields

**Pin Visibility Guidelines**:

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

### Integration Examples

#### Essentials Integration

Core functionality: webhooks, HTTP requests, file operations, data types, time utilities, workflow controls.

#### GitHub Integration

External API integration with:

- OAuth token validation
- Webhook signature verification
- Repository and issue management
- Custom state for Octokit client

#### OpenAI Integration

AI service integration with file and response handling.

#### Resend Integration

Email service integration with contact and email management.

## Testing and Quality

### Type Safety

- All integrations use TypeScript with strict checking
- Global type definitions in `globals.d.ts`
- Integration state properly typed via module augmentation

### Code Quality

- ESLint with shared configuration from `@acme/style-guide`
- Prettier formatting with shared configuration
- Catalog dependencies for version consistency

### Development Workflow

1. Create integration in `integrations/` directory
2. Use `template` integration as starting point
3. Create a README.md file for the integration with setup instructions, usage examples, and API documentation
4. Organize reusable components:
   - Create `src/schemas/` for validation schemas
   - Create `src/controls/` for UI controls
   - Create `src/pins/` for pin definitions
   - Use consistent import patterns (`@/schemas`, `@/pins`, `@/controls`)
5. Implement nodes in `src/nodes/` with proper categorization
6. Add environment variables and state management as needed
7. Validate with `bun run typecheck` and `bun run lint` during development
8. Build and publish with `bun run build` and `bun run publish`

**Best Practices for Reusable Components:**

- **DRY Principle**: Extract common schemas, controls, and pins to dedicated directories
- **Consistent Naming**: Use clear, descriptive names for reusable components
- **Type Safety**: Ensure all schemas have proper TypeScript types
- **Documentation**: Add JSDoc comments for complex validation patterns
- **Testing**: Test reusable components with edge cases and validation scenarios
- **Descriptions**: Every node, pin, control, and environment variable must have a brief, clear description for better user experience and maintainability

## Package Management

Uses Bun workspaces with:

- **Catalog dependencies**: Shared version management for common packages
- **Linked dependencies**: Framework packages linked from workspace
- **Patched dependencies**: Custom patches applied to third-party packages

Key catalog packages: `@acme/integration-framework`, `@acme/style-guide`, `valibot`, `eslint`, `prettier`, `typescript`.
