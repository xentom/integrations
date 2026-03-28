# Xentom Integrations Monorepo

Monorepo containing official integrations for the Xentom workflow editor. Each package under `packages/` is a self-contained integration that connects a third-party service to the Xentom platform.

**Stack:** Bun, Turbo, TypeScript, Biome, Valibot

## Commands

```bash
# Repository root
bun run lint        # Biome lint across all packages
bun run typecheck   # TypeScript checking across all packages
bun run format      # Biome formatting across all packages
bun run test        # Run tests across all packages
bun run pack        # Build/pack all integrations
bun run clean       # Clean all build artifacts

# Per-package (packages/<name>/)
bun run lint        # Biome lint for this package
bun run typecheck   # tsc --noEmit for this package
bun run format      # Biome format for this package
bun run test        # bun test for this package
bun run dev         # xentom dev (development mode)
bun run pack        # xentom pack (build)
bun run publish     # xentom publish
```

Always use Bun. Never use npm or yarn.

## Quality Gates

Every integration must pass all four checks with zero errors and zero warnings:

1. `bun run typecheck`
2. `bun run lint`
3. `bun run format`
4. `bun run test`

## Package Structure

```
packages/<name>/
├── assets/icon.png           # Required integration icon
├── src/
│   ├── index.ts              # Entry point: auth, state, lifecycle
│   ├── pins/
│   │   ├── index.ts          # Namespace re-exports
│   │   ├── <category>.ts     # Pin definitions per category
│   │   └── <category>.test.ts # Tests for pin schemas
│   ├── nodes/
│   │   ├── index.ts          # Flat re-exports
│   │   └── <category>/
│   │       ├── index.ts
│   │       ├── <category>.ts     # Node implementations
│   │       └── <category>.test.ts # Tests for nodes
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

## Testing

Every integration must have tests. Tests use `bun:test` (built into Bun) and the framework's test helpers.

### Test File Convention

Co-locate test files with source files using the `.test.ts` suffix:

```
src/nodes/email/email.test.ts    # Tests for email nodes
src/pins/email.test.ts           # Tests for email pin schemas
```

### Test Helpers

Import from `@xentom/integration-framework/testing`:

```typescript
import { run, runAll, subscribe, transform } from '@xentom/integration-framework/testing'
```

| Helper | Node type | Description |
|--------|-----------|-------------|
| `run(node, opts)` | Callable | Executes the node, validates inputs/outputs against pin schemas, captures `next()` |
| `runAll(node, opts)` | Callable | Same as `run()` but allows multiple `next()` calls (iteration nodes) |
| `subscribe(node, opts)` | Trigger | Subscribes to the trigger, captures all `next()` calls, provides cleanup |
| `transform(node, opts)` | Pure | Runs the node, captures mutated outputs |

All helpers require `state` (with mocked clients) and `inputs`. Other options (`ctx`, `variables`, `kv`, `webhook`, `node`) have sensible defaults.

### Typed Mocks

Always type mock functions against the real SDK client types:

```typescript
import { type Mock, mock } from 'bun:test'
import { type Resend } from 'resend'

interface MockResend {
  emails: {
    send: Mock<Resend['emails']['send']>
    get: Mock<Resend['emails']['get']>
  }
}

function createMockResend(overrides: Partial<MockResend['emails']> = {}): MockResend {
  return {
    emails: {
      send: mock<Resend['emails']['send']>(() =>
        Promise.resolve({ data: { id: 'email_123' }, error: null, headers: null }),
      ),
      get: mock<Resend['emails']['get']>(() =>
        Promise.resolve({ data: { /* full response shape */ }, error: null, headers: null }),
      ),
      ...overrides,
    },
  }
}
```

Use `as unknown as Client` when passing to `state` (the mock only implements the methods used by the node):

```typescript
const resend = createMockResend()
const result = await run(sendEmail, {
  state: { resend: resend as unknown as Resend },
  inputs: { from: 'Acme <a@b.com>', to: 'user@example.com', subject: 'Hi', html: '<p>Hi</p>' },
})
expect(result.outputs.id).toBe('email_123')
```

### What to Test

For every node, cover at minimum:

1. **Happy path** — correct inputs produce expected outputs.
2. **Error propagation** — API errors are thrown (not swallowed).
3. **Optional fields** — node handles missing optional inputs.
4. **API call arguments** — the SDK client receives correctly mapped values.

For reusable pins with schemas, test validation of valid and invalid inputs.

Read `node_modules/@xentom/integration-framework/AGENTS.md` for the full testing API reference, including `createKeyValueStore()`, `createWebhook()`, pin schema testing patterns, and detailed typed mock examples.

## Framework Reference

Read `node_modules/@xentom/integration-framework/AGENTS.md` for the full framework API reference. If specific details are still unclear, read the relevant `.d.ts` files on demand:

- `node_modules/@xentom/integration-framework/dist/integration.d.ts`
- `node_modules/@xentom/integration-framework/dist/nodes/*.d.ts`
- `node_modules/@xentom/integration-framework/dist/pins/*.d.ts`
- `node_modules/@xentom/integration-framework/dist/controls/*.d.ts`

Refer to existing integrations under `packages/` (e.g., `resend`, `github`, `slack`) as working examples.
