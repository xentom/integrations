# Integration Init Command

## Overview

Initialize a complete integration for the ACME Integration Framework by setting up the project structure, API client, pins, and nodes following established patterns and best practices.

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

```bash
# Copy template
cp -r integrations/template integrations/$ARGUMENTS

# Navigate to new integration
cd integrations/$ARGUMENTS

# Install API client
bun install [selected-package]

# Update package.json name and description
```

### Phase 2: API Client Analysis

#### 2.1 Library Investigation

Examine the installed package structure:

```bash
# Check package structure
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
# Check for TypeScript definitions
ls node_modules/[package-name]/**/*.d.ts
ls node_modules/@types/[package-name]/ # If separate types package
```

**Document:**

- Response type interfaces
- Method signatures
- Configuration options
- Error types

### Phase 3: Integration Architecture

#### 3.1 Environment Variables Planning

Based on API client requirements, identify needed environment variables:

- API keys, tokens, secrets
- Base URLs, endpoints
- Configuration options (timeouts, retries)

#### 3.2 Category Structure Design

Analyze the service API to create logical node categories:

**Common Patterns:**

- Resource-based: `users`, `projects`, `files`, `messages`
- Action-based: `auth`, `search`, `notifications`
- Workflow-based: `boards`, `cards`, `lists` (for project management)

**Example Structure:**

```
src/
├── nodes/
│   ├── users/users.ts          # User management
│   ├── projects/projects.ts    # Project operations
│   ├── files/files.ts          # File operations
│   └── search/search.ts        # Search functionality
└── pins/
    ├── user.ts                 # User data types
    ├── project.ts              # Project data types
    ├── file.ts                 # File data types
    ├── common.ts               # Shared types
    └── index.ts                # Export all pins
```

### Phase 4: Implementation

#### 4.1 Integration Entry Point (`src/index.ts`)

```typescript
import { ServiceClient } from 'service-api-client';
import * as v from 'valibot';

import * as i from '@acme/integration-framework';

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

```typescript
// src/pins/user.ts
import { type UserResponse } from 'service-api-client';
import * as v from 'valibot';

import * as i from '@acme/integration-framework';

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

```typescript
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

#### 5.1 Code Quality Checks

```bash
# Type checking
bun run typecheck

# Linting
bun run lint

# Fix any issues found
```

#### 5.2 Integration Testing

```bash
# Test development mode
bun run dev

# Verify all nodes are discoverable
# Test basic functionality with mock data
```

#### 5.3 Documentation Creation

Create `README.md` in integration root:

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

- [ ] Integration directory created from template
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

- [ ] README.md created with setup instructions
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
- Reference existing integrations in `/integrations/` for patterns
