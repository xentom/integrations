# Xentom Integrations Monorepo

Monorepo containing official integrations for the Xentom workflow editor. Each package under `packages/` is a self-contained integration that connects a third-party service to the Xentom platform.

**Stack:** Bun, Turbo, TypeScript, Biome, Valibot

## Commands

```bash
# Repository root
bun run lint        # Biome lint across all packages
bun run typecheck   # TypeScript checking across all packages
bun run format      # Biome formatting across all packages
bun run pack        # Build/pack all integrations
bun run clean       # Clean all build artifacts

# Per-package (packages/<name>/)
bun run lint        # Biome lint for this package
bun run typecheck   # tsc --noEmit for this package
bun run format      # Biome format for this package
bun run dev         # xentom dev (development mode)
bun run pack        # xentom pack (build)
bun run publish     # xentom publish
```

Always use Bun. Never use npm or yarn.

## Quality Gates

Every integration must pass all three checks with zero errors and zero warnings:

1. `bun run typecheck`
2. `bun run lint`
3. `bun run format`

## Package Structure

```
packages/<name>/
├── assets/icon.png           # Required integration icon
├── src/
│   ├── index.ts              # Entry point: auth, state, lifecycle
│   ├── pins/
│   │   ├── index.ts          # Namespace re-exports
│   │   └── <category>.ts     # Pin definitions per category
│   ├── nodes/
│   │   ├── index.ts          # Flat re-exports
│   │   └── <category>/
│   │       ├── index.ts
│   │       └── <category>.ts # Node implementations
│   └── utils/                # Optional: shared helpers
├── package.json
└── tsconfig.json
```

## Imports

```typescript
import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

import * as pins from '@/pins'
import { myFunction, type MyType } from 'some-package'
```

Forbidden:

- `import type { X } from 'pkg'` — use inline `type` keyword instead
- `i.v.string()` — import valibot directly as `v`

All code examples below omit these standard imports for brevity.

## Entry Point (`src/index.ts`)

```typescript
declare module '@xentom/integration-framework' {
  interface IntegrationState {
    client: Client
  }
}

export default i.integration({
  nodes,
  auth: i.auth.token({
    control: i.controls.text({
      label: 'API Key',
      description: 'Your API key from ...',
      placeholder: 'sk_...',
    }),
    schema: v.pipeAsync(
      v.string(),
      v.checkAsync(async (token) => {
        // Validate token with a test API call
        return true
      }, 'Invalid API key.'),
    ),
  }),
  start(opts) {
    opts.state.client = new Client(opts.auth.token)
  },
})
```

## Pins

Pins are reusable data type definitions in `src/pins/`.

```typescript
// src/pins/email.ts — one file per category
// Pin with schema (runtime validation)
export const address = i.pins.data({
  description: 'An email address.',
  schema: v.pipe(v.string(), v.email()),
  control: i.controls.text({ placeholder: 'user@example.com' }),
})

// Pin with type generic (compile-time typing, no runtime validation)
export const item = i.pins.data<Email>({ description: 'An email object.' })

// Collection pin
export const items = i.pins.data<Email[]>({ description: 'A list of emails.' })
```

```typescript
// src/pins/index.ts — namespace re-exports
export * as email from './email'
export * as user from './user'
```

### Pin Rules

- Pins can have a `schema`, a `<Type>` generic, or both. Either can be used on inputs or outputs.
- Never set `optional: true` on pin definitions. Apply it when extending: `pins.email.address.with({ optional: true })`
- Always use `.with()` to customize pins. Never destructure or access `.schema` directly.
- Use `.with({ control: false })` when extending a pin that has a control but you don't need it (e.g., using an `id` pin as an output).
- Controls: `text()` for strings, `switch()` for booleans, `expression()` for numbers/objects, `select()` for enums.
- Use realistic placeholders: `'user@example.com'` not `'Enter email'`.
- Naming: `item` for a single object, `items` for arrays, descriptive names for properties (`id`, `name`, `email`).

## Nodes

Nodes are actions, triggers, or transforms in `src/nodes/`.

```typescript
// src/nodes/email/email.ts
const nodes = i.nodes.group('Emails')

export const sendEmail = nodes.callable({
  description: 'Send an email.',
  inputs: {
    to: pins.email.address.with({ description: 'Recipient.' }),
    subject: pins.email.subject,
    body: pins.email.body.with({ optional: true }),
  },
  outputs: {
    id: pins.email.id.with({ control: false }),
  },
  async run(opts) {
    const response = await opts.state.client.emails.send({
      to: opts.inputs.to,
      subject: opts.inputs.subject,
      body: opts.inputs.body,
    })
    return opts.next({ id: response.id })
  },
})
```

```typescript
// src/nodes/email/index.ts
export * from './email'

// src/nodes/index.ts
export * from './email'
export * from './contact'
```

### Node Rules

- Node types: `nodes.callable()` for actions, `nodes.trigger()` for events, `nodes.pure()` for transforms.
- Export names must be specific: `sendEmail`, `deleteUser`, `listContacts`. Never generic like `send`, `delete`, `get`.
- Only set `displayName` when auto-generation is wrong (e.g., acronyms like 'API') or for JS keyword conflicts.
- Category directories use singular kebab-case names (e.g., `email/`, `user/`). Group display names may be plural for readability (e.g., `i.nodes.group('Emails')` in an `email/` directory).
- Prefer direct property access: `opts.state.client.emails.send(...)`. Avoid intermediate variables.
- Let errors propagate. No try-catch unless you need to transform the error.
- Return via `opts.next({...})`.

## Select Controls with Dynamic Options

```typescript
export const id = i.pins.data({
  schema: v.string(),
  control: i.controls.select({
    async options({ state, pagination }) {
      const response = await state.client.items.list({
        limit: pagination.limit,
      })
      return {
        hasMore: response.hasMore,
        items: response.data.map((item) => ({
          value: item.id,
          label: item.name,
          suffix: item.id,
        })),
      }
    },
  }),
})
```

## Type Safety

- Never use `as any`, `@ts-ignore`, or `biome-ignore lint/...`
- If a type error persists after 3 fix attempts: redesign the approach
- Use `v.pipe()` for composing validations
- Use class serialization patterns (separate input/output pins) when pins transport class instances

## Framework Reference

Read `node_modules/@xentom/integration-framework/AGENTS.md` for the full framework API reference. If specific details are still unclear, read the relevant `.d.ts` files on demand:

- `node_modules/@xentom/integration-framework/dist/integration.d.ts`
- `node_modules/@xentom/integration-framework/dist/nodes/*.d.ts`
- `node_modules/@xentom/integration-framework/dist/pins/*.d.ts`
- `node_modules/@xentom/integration-framework/dist/controls/*.d.ts`

Refer to existing integrations under `packages/` (e.g., `resend`, `github`, `slack`) as working examples.
