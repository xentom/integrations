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
- **`tooling/`**: Shared development tools (eslint, prettier, typescript configs)
- **`patches/`**: Package patches applied via `patchedDependencies`

### Integration Framework
All integrations are built using the `@acme/integration-framework` package and follow a consistent pattern:

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
- **Categories**: Grouped by functionality (e.g., `['Web']`, `['Issues']`)

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

Global state is extended via module augmentation in `globals.d.ts`.

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
3. Implement nodes in `src/nodes/` with proper categorization
4. Add environment variables and state management as needed
5. Test with `acme dev` during development
6. Build and publish with `acme build` and `acme publish`

## Package Management

Uses Bun workspaces with:
- **Catalog dependencies**: Shared version management for common packages
- **Linked dependencies**: Framework packages linked from workspace
- **Patched dependencies**: Custom patches applied to third-party packages

Key catalog packages: `@acme/integration-framework`, `@acme/style-guide`, `valibot`, `eslint`, `prettier`, `typescript`.