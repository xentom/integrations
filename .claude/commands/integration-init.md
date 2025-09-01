# Integration Init Command

## Overview

Initialize a complete integration for the Xentom Integration Framework **monorepo** by setting up the project structure, API client, pins, and nodes following established patterns and best practices.

## Monorepo Structure

This is a **monorepo** containing multiple integrations and shared tooling:

```
/                          # Root monorepo directory
├── packages/          # All service integrations
│   ├── discord/           # Discord integration package
│   ├── essentials/        # Core framework nodes package
│   ├── github/            # GitHub integration package
│   ├── openai/            # OpenAI integration package
│   ├── resend/            # Resend integration package
│   ├── teamspeak/         # TeamSpeak integration package
│   └── template/          # Template for new integrations
├── tooling/               # Shared development tools
│   └── style-guide/       # ESLint, Prettier, TypeScript configs
├── package.json           # Root package.json (workspace manager)
├── turbo.json             # Turbo build configuration
└── bun.lock               # Dependency lockfile
```

## Usage

```bash
/integration-init "service-name"
```

**Arguments:**

- `service-name` - Target service (e.g., "trello", "github", "notion")

## Execution Flow

### Phase 1: Research & Setup

#### 1.1 API Client Research

Search npm for the best TypeScript-compatible client:

**Priority Order:**

1. Official packages (`@service/api`, `service-sdk`)
2. Popular community packages (>1M weekly downloads)
3. Well-maintained libraries (updated within 6 months)
4. TypeScript-first or includes type definitions

**Evaluation Criteria:**

- TypeScript support (native or @types package)
- Recent maintenance (last updated within 6 months)
- Good documentation and examples
- GitHub stars and npm downloads
- Official endorsement or community adoption

#### 1.2 Project Initialization

##### 1.2.1 Copy template

To create a new integration, start by copying the existing template from within the monorepo:

```bash
# From monorepo root
cp -r ./packages/template ./packages/$ARGUMENTS

# Navigate to the new integration directory
cd ./packages/$ARGUMENTS
```

##### 1.2.2 Configure `package.json`

Update the integration's `package.json` with the following fields:

- `name` - unique package identifier
- `displayName` - human-readable name for the integration
- `description` - a brief summary of the integration's purpose

##### 1.2.3 Install the required packages

```bash
# Make sure you are in the integration directory
bun install [selected-package]
```

### Phase 2: API Client Analysis

#### 2.1 Library Investigation

**Current working directory:** `./`

Examine the installed package structure from within the integration directory:

```bash
ls node_modules/[package-name]/
cat node_modules/[package-name]/package.json
cat node_modules/[package-name]/README.md
```

**Key Information to Extract:**

- Client initialization pattern
- Authentication requirements (API keys, OAuth, tokens)
- Available methods and endpoints
- Request/response type definitions
- Error handling patterns
- Rate limiting considerations

#### 2.2 Type Definitions Discovery

```bash
ls node_modules/[package-name]/**/*.d.ts
ls node_modules/@types/[package-name]/ # If separate types package
```

**Document:**

- Response type interfaces
- Method signatures
- Configuration options
- Error types

### Phase 3: Integration Architecture

#### 3.1 Working Directory Context

**Current working directory:** `./packages/$ARGUMENTS/`

All subsequent file paths are relative to this integration directory unless otherwise specified.

#### 3.2 Environment Variables Planning

Based on API client requirements, identify needed environment variables:

- API keys, tokens, secrets
- Base URLs, endpoints
- Configuration options (timeouts, retries)

#### 3.3 Category Structure Design

Analyze the service API to create logical node categories within the integration:

**Standard Integration Structure:**

```
./packages/$ARGUMENTS/                  # Individual integration package
├── src/
│   ├── index.ts                          # Integration entry point
│   ├── nodes/                            # All node implementations
│   │   ├── [category]/
│   │   │   ├── [category].ts             # Node implementations for category
│   │   │   └── index.ts                  # Category exports
│   │   └── index.ts                      # All nodes export
│   └── pins/                             # Type definitions
│       ├── [category].ts                 # Pin definitions by category
│       └── index.ts                      # All pins export
├── images/
│   └── icon.png                          # Integration icon
├── package.json                          # Integration package config
├── tsconfig.json                         # TypeScript config
└── eslint.config.mjs                     # ESLint config
```

**Common Node Category Patterns:**

- Resource-based: `users`, `projects`, `files`, `messages`
- Action-based: `auth`, `search`, `notifications`
- Workflow-based: `boards`, `cards`, `lists` (for project management)

**Example Structure for a Project Management Service:**

```
src/
├── nodes/
│   ├── users/users.ts          # User management nodes
│   ├── projects/projects.ts    # Project operation nodes
│   ├── files/files.ts          # File operation nodes
│   └── search/search.ts        # Search functionality nodes
└── pins/
    ├── user.ts                 # User data type pins
    ├── project.ts              # Project data type pins
    ├── file.ts                 # File data type pins
    ├── common.ts               # Shared type pins
    └── index.ts                # Export all pins
```

### Phase 4: Implementation

**Current working directory:** `./packages/$ARGUMENTS/`

#### 4.1 Integration Entry Point (`src/index.ts`)

```ts
import { ServiceClient } from 'service-api-client';
import * as v from 'valibot';

import * as i from '@xentom/integration-framework';

import * as nodes from './nodes';

// Define shared state interface
interface IntegrationState {
  client: ServiceClient;
  // Add other shared resources
}

export default i.integration({
  nodes,
  env: {
    API_KEY: i.env({
      control: i.controls.text({
        label: 'API Key',
        sensitive: true,
        description: 'Your service API key',
      }),
      schema: v.string(),
    }),
    // Add other environment variables
  },
  start(opts) {
    opts.state.client = new ServiceClient({
      apiKey: process.env.API_KEY,
      // Other configuration
    });
  },
});
```

#### 4.2 Pin Definitions (`src/pins/`)

**Follow Pin Development Rules:**

- No category prefixes in exports
- Use `item` for singles, `list` for arrays
- Non-optional by default
- TypeScript types for complex objects
- Controls only for user input pins

**Pattern for each category:**

```ts
// src/pins/user.ts
import { type UserResponse } from 'service-api-client';
import * as v from 'valibot';

import * as i from '@xentom/integration-framework';

export const id = i.pins.data({
  description: 'User ID.',
  control: i.controls.text(),
  schema: v.pipe(v.string(), v.minLength(1)),
});

export const item = i.pins.data<UserResponse>({
  description: 'User object with complete information.',
});

export const list = i.pins.data<UserResponse[]>({
  description: 'Array of users.',
});
```

#### 4.3 Node Implementations (`src/nodes/`)

**For each category, implement core operations:**

**List Operations:**

```ts
export const listUsers = i.nodes.callable({
  category,
  description: 'List all users.',

  inputs: {
    limit: pins.common.limit.with({ optional: true }),
    search: pins.common.search.with({ optional: true }),
  },

  outputs: {
    users: pins.user.list.with<UserResponse[]>({
      description: 'Array of users.',
    }),
  },

  async run(opts) {
    const response = await opts.state.client.users.list({
      limit: opts.inputs.limit,
      search: opts.inputs.search,
    });

    return opts.next({ users: response.users ?? [] });
  },
});
```

**CRUD Operations:**

- Create: Return created object
- Read: Return specific object
- Update: Return updated object
- Delete: No outputs (operation only)

**Critical Implementation Rules:**

- Direct property passing (no conditional spreads)
- Semantic outputs (extract specific data, not full responses)
- Type safety (every output pin must have TypeScript type)
- Error handling with descriptive messages
- Handle API errors gracefully

### Phase 5: Quality Assurance

**Current working directory:** `./packages/$ARGUMENTS/`

#### 5.1 Code Quality Checks

```bash
# Type checking
bun run typecheck

# Linting
bun run lint

# Fix any issues found
```

#### 5.2 Documentation Creation

Create `README.md` in integration root: `./packages/$ARGUMENTS/README.md`

```markdown
# [Service Name] Integration

Brief description of the service and integration capabilities.

## Environment Variables

### Required

- `API_KEY` - Your [Service] API key. Get it from [service.com/api-keys](url)

### Optional

- `BASE_URL` - Custom API base URL (default: https://api.service.com)

## Getting Started

1. Sign up for [Service Name] account
2. Generate API key from [specific instructions]
3. Configure environment variables
4. Test connection with [specific node]

## Available Nodes

### [Category 1]

- List [items]
- Get [item]
- Create [item]
- Update [item]
- Delete [item]

### [Category 2]

- [Specific operations]

## Notes

- [Any rate limiting considerations]
- [Authentication specifics]
- [Common use cases or patterns]
```

## Success Criteria

### ✅ Complete Implementation Checklist

**Project Structure:**

- [ ] Integration directory created at `./packages/$ARGUMENTS/`
- [ ] All files copied from `./packages/template/`
- [ ] API client installed and configured
- [ ] All necessary dependencies added

**Type Safety:**

- [ ] TypeScript compilation passes without errors
- [ ] All output pins have proper type definitions
- [ ] IntegrationState interface properly defined
- [ ] Type imports use inline `type` specifiers

**Pin Implementation:**

- [ ] Pin naming follows conventions (no prefixes, item/list pattern)
- [ ] Pins are non-optional by default
- [ ] Complex types use TypeScript generics (no schema)
- [ ] Simple types use valibot schemas
- [ ] Controls only on user input pins

**Node Implementation:**

- [ ] All major CRUD operations implemented
- [ ] Direct property passing (no conditional spreads)
- [ ] Semantic outputs (specific data, not API responses)
- [ ] Comprehensive error handling
- [ ] Proper category organization

**Code Quality:**

- [ ] ESLint passes without errors
- [ ] TypeScript compilation successful
- [ ] No anti-patterns used
- [ ] Consistent naming and structure

**Documentation:**

- [ ] README.md created at `./packages/$ARGUMENTS/README.md`
- [ ] Environment variables documented
- [ ] Available nodes listed
- [ ] Getting started guide included

**Functionality:**

- [ ] Integration starts without errors
- [ ] API client initializes correctly
- [ ] Basic operations work as expected
- [ ] Error handling provides useful feedback

## Common Pitfalls to Avoid

- ❌ Using conditional spreads instead of direct property passing
- ❌ Returning full API responses instead of semantic data
- ❌ Missing TypeScript types on output pins
- ❌ Category prefixes in pin exports
- ❌ Creating intermediate variables for direct function calls
- ❌ Using `v.any()` instead of proper TypeScript types
- ❌ Top-level type imports instead of inline specifiers

## Reference

- See `.cursorrules` for critical coding standards and quick reference
- See `CLAUDE.md` for comprehensive documentation and examples
- Reference existing integrations in `./packages/` directory for patterns
