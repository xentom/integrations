# Monorepo Structure Guide

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a monorepo for Xentom integrations using:

- **Build orchestration**: Turbo
- **Package manager**: Bun (`bun@1.2.18`)
- **Structure**: Multiple integration packages extending the Xentom platform

## Essential Commands

### Root-level (repository root)

```bash
bun run clean      # Clean all packages and git-ignored files
bun run lint       # Run ESLint across all packages with caching
bun run typecheck  # Run TypeScript type checking across all packages
bun run format     # Format code with Prettier across all packages
bun run pack       # Build/pack all integration packages
```

### Package-level (`packages/*/` directories)

```bash
bun run dev        # Start development mode using `xentom dev`
bun run pack       # Build the integration package using `xentom pack`
bun run publish    # Publish the integration using `xentom publish`
bun run lint       # Run ESLint for the package
bun run typecheck  # Run TypeScript checking with `tsc --noEmit`
bun run format     # Format code with Prettier
bun run clean      # Clean build artifacts and dependencies
```

## 🚨 MANDATORY Quality Checks

**All integrations MUST pass without errors or warnings:**

- ✅ `bun run lint` - Zero ESLint errors and warnings
- ✅ `bun run typecheck` - Zero TypeScript errors
- ✅ `bun run format` - No formatting changes required

---

# Integration Structure Guide

## Directory Structure

```
/
├── src/
│   ├── index.ts                     # Integration entry point
│   ├── nodes/                       # Functional nodes grouped by category
│   │   ├── [category]/
│   │   │   ├── [subcategory]/
│   │   │   │   ├── [subcategory].ts
│   │   │   │   └── index.ts
│   │   │   ├── [category].ts
│   │   │   └── index.ts
│   │   └── index.ts
│   └── pins/                        # Reusable data types
│       ├── [category].ts
│       └── index.ts
├── images/
│   └── icon.png                     # Integration icon (required)
├── globals.d.ts
├── package.json
├── tsconfig.json
└── eslint.config.mjs
```

## Common Code Rules

### Import Management

**✅ REQUIRED Patterns:**

```typescript
// Valibot direct import

// Framework import
import * as i from '@xentom/integration-framework';
import * as v from 'valibot';

// Inline type specifiers
import { myFunction, type MyType } from 'package';

// Custom pins import
import * as pins from '@/pins';
```

**❌ FORBIDDEN Patterns:**

```typescript
// WRONG - use v.string()

// DO NOT use top-level type imports
import type { MyType } from 'package'; // WRONG

// DO NOT use framework's Valibot export
i.v.string();
```

### Type Safety

**Three-Attempt Rule for Type/Lint Errors:**

1. Fix the underlying issue properly
2. Try alternative implementation approach
3. Redesign entire approach if necessary

**❌ ABSOLUTELY FORBIDDEN:**

- `as any`
- `@ts-ignore`
- `eslint-disable-next-line`
- Type bypasses indicate design problems

### Variable Management

**✅ PREFERRED: Direct property access**

```typescript
const message = await opts.state.client.messages.get(opts.inputs.messageId);
```

**❌ AVOID: Unnecessary intermediate variables**

```typescript
const client = opts.state.client; // Unnecessary
const messageId = opts.inputs.messageId; // Unnecessary
const message = await client.messages.get(messageId);
```

### Error Handling

**✅ REQUIRED:** Let the workflow editor handle errors
**❌ FORBIDDEN:** Unnecessary try-catch blocks that only re-throw

### Documentation

**✅ REQUIRED:** Use node/pin descriptions for documentation
**❌ FORBIDDEN:** Redundant comments duplicating descriptions
**✅ ACCEPTABLE:** Comments only for complex business logic

## Node Rules

### Node Structure

**✅ CORRECT Implementation Order:**

```typescript
import * as i from '@xentom/integration-framework';

// 1. Category metadata
const category = {
  path: ['Parent Category', 'Category Name'],
} satisfies i.NodeCategory;

// 2. Trigger nodes (event-driven)
export const onEventName = i.nodes.trigger({
  category,
  // Implementation...
});

// 3. Callable nodes (actions)
export const actionName = i.nodes.callable({
  category,
  // Implementation...
});

// 4. Pure nodes (transformations)
export const transformName = i.nodes.pure({
  category,
  // Implementation...
});
```

### Node Naming

**✅ REQUIRED: Specific, meaningful export names**

```typescript
export const sendMessage = i.nodes.callable({...});
export const updateChannel = i.nodes.callable({...});
export const deleteUser = i.nodes.callable({...});
```

**❌ FORBIDDEN: Generic export names**

```typescript
export const send = i.nodes.callable({...}); // Too generic
export const update = i.nodes.callable({...}); // Missing context
export const delete = i.nodes.callable({...}); // Ambiguous
```

### Display Names

**✅ ONLY use `displayName` when:**

- Auto-generation produces incorrect results (e.g., 'API Key' vs 'Api Key')
- Working around JavaScript keywords

```typescript
// Required for keyword conflicts
export const _delete = i.nodes.callable({
  category,
  displayName: 'Delete',
});

// Omit when auto-generation works
export const sendMessage = i.nodes.callable({
  category,
  // 'sendMessage' → 'Send Message' automatically
});
```

### Category Conventions

**✅ REQUIRED:**

- Singular names: `email`, `user`, `issue`
- Generic names: `email` not `email-management`
- Kebab-case directories: `user-management`
- Title case in paths: `['User Management']`

**❌ FORBIDDEN:**

- Plural names: `emails`, `users`
- PascalCase directories: `UserManagement`

## Pin Rules

### Pin Definition Structure

**✅ CORRECT Pin Types:**

```typescript
// Single item pin
export const item = i.pins.data<Email>({
  displayName: 'Email',
});

// Collection pin
export const items = i.pins.data<Email[]>({
  displayName: 'Emails',
});

// Property pin
export const id = i.pins.data({
  displayName: 'Email ID',
  schema: v.string(),
});
```

### Pin Extension

**✅ REQUIRED: Use `.with()` method**

```typescript
subject: pins.email.subject.with({
  description: 'Email subject line',
  optional: true,
});
```

**❌ FORBIDDEN: Direct property access**

```typescript
// NEVER access schema directly
pins.email.subject.schema

// NEVER destructure pins
{ ...pins.email.subject, optional: true }
```

### Pin Optionality

**✅ CORRECT: Reusable pins without `optional`**

```typescript
// Main definition - no optional
export const title = i.pins.data({
  description: 'The title',
  schema: v.pipe(v.string(), v.nonEmpty()),
});

// Apply optional when extending
inputs: {
  title: pins.item.title.with({ optional: true }),
}
```

**❌ FORBIDDEN: Optional in main definition**

```typescript
export const title = i.pins.data({
  schema: v.string(),
  optional: true, // Breaks reusability
});
```

### Input vs Output Pins

**✅ REQUIRED Strategy:**

```typescript
// INPUTS: Use schemas for validation
inputs: {
  email: i.pins.data({
    schema: v.string(),
    displayName: 'Email',
  }),
}

// OUTPUTS: Use TypeScript types
outputs: {
  user: i.pins.data<UserType>({
    displayName: 'User Data',
  }),
}
```

### Class Serialization

**✅ REQUIRED: Separate input/output pins for classes**

```typescript
// Base pin
export const item = i.pins.data({
  displayName: 'Channel',
});

// Input pin - deserializes
export const itemInput = item.with({
  schema({ state }) {
    return v.pipe(
      v.custom<ChannelEntry>((value) => !!value && 'cid' in value),
      v.transform((value) => new TeamSpeakChannel(state.teamspeak, value)),
    );
  },
});

// Output pin - serializes
export const itemOutput = item.with({
  schema: v.pipe(
    v.custom<TeamSpeakChannel>((value) => value instanceof TeamSpeakChannel),
    v.transform((value) => value.toJSON() as ChannelEntry),
  ),
});
```

### Pin Naming Standards

**✅ REQUIRED Conventions:**

- Single object: `item`
- Arrays/lists: `items`
- Properties: `id`, `name`, `email`
- Consistent naming across all integrations

## Control Rules

### When to Include Controls

**✅ REQUIRED for user inputs:**

```typescript
// Text control for strings
export const title = i.pins.data({
  schema: v.string(),
  control: i.controls.text(),
});

// Expression for all other types except strings and booleans.
export const issueNumber = i.pins.data({
  schema: v.number(),
  control: i.controls.expression(),
});

// Switch for booleans
export const isDraft = i.pins.data({
  schema: v.boolean(),
  control: i.controls.switch(),
});
```

### Select Controls

**✅ Static Options:**

```typescript
export const status = i.pins.data({
  control: i.controls.select({
    options: [
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' },
    ],
  }),
});
```

**✅ Dynamic Options:**

```typescript
export const repository = i.pins.data({
  schema: v.string(),
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
```

**✅ Multi-select for Arrays:**

```typescript
export const assignees = i.pins.data({
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

### When to Omit Controls

**✅ ACCEPTABLE to omit for:**

- Complex response objects
- Computed/derived data
- When dynamic options aren't feasible

```typescript
// Complex object - no control needed
export const apiResponse = i.pins.data<ApiResponseType>({
  displayName: 'API Response',
});
```

## File Export Structure

### Integration Entry (`src/index.ts`)

```typescript
import * as i from '@xentom/integration-framework';

export default i.integration({
  // Configuration...
});
```

### Node Index Files

**`src/nodes/index.ts`:**

```typescript
// Flat re-export of all categories
export * from './category1';
export * from './category2';
```

**`src/nodes/[category]/index.ts`:**

```typescript
// Re-export subcategories
export * from './subcategory1';
export * from './subcategory2';

// Re-export main category nodes
export * from './category';
```

### Pin Index Files

**`src/pins/index.ts`:**

```typescript
// Namespace exports by category
export * as email from './email';
export * as user from './user';
```

## Placeholder Examples

**✅ REQUIRED: Realistic, context-specific examples**

```typescript
email: i.pins.data({
  placeholder: 'user@example.com',
}),

repository: i.pins.data({
  placeholder: 'owner/repository-name',
}),

apiUrl: i.pins.data({
  placeholder: 'https://api.service.com/v1',
}),
```

**❌ FORBIDDEN: Generic placeholders**

```typescript
email: i.pins.data({
  placeholder: 'Enter email', // Too generic
}),
```

## Key References

- Integration framework types: `@node_modules/@xentom/integration-framework/dist/integration.d.ts`
- Node types: `@node_modules/@xentom/integration-framework/dist/nodes/*.d.ts`
- Pin types: `@node_modules/@xentom/integration-framework/dist/pins/*.d.ts`

## Critical Reminders

1. **ALWAYS** use Bun commands, never npm/yarn
2. **ALWAYS** pass quality checks before committing
3. **NEVER** use `as any`, `@ts-ignore`, or bypass type safety
4. **NEVER** include `optional: true` in reusable pin definitions
5. **ALWAYS** use `.with()` to extend pins, never direct property access
6. **ALWAYS** use schemas for inputs, types for outputs
7. **NEVER** use generic node names like `get`, `create`, `delete`
8. **ALWAYS** properly serialize/deserialize class instances
