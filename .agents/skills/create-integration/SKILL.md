---
name: create-integration
description: Create a new integration from the template. Use when asked to scaffold, create, or start a new integration package.
---

# Create a New Integration

Create a new integration for the Xentom workflow editor. Ask the user for the integration name and any additional context about what it should do if not already clear.

## 1. Research and Library Selection

Search the web for TypeScript libraries for this integration:

- Prefer official SDKs, then well-maintained community libraries
- Evaluate: maintenance activity, npm downloads, native TypeScript support, documentation quality
- Document the selection rationale before proceeding

## 2. Scaffold from Template

```bash
cp -r packages/template/ packages/<name>/
```

Edit `packages/<name>/package.json`:

- `name` → `@xentom/<name>`
- `displayName` → Human-readable name
- `description` → What the integration enables in workflows
- `categories` → e.g. `["Messaging"]`, `["Developer Tools"]`
- `homepage` → `https://xentom.com/integrations/xentom/<name>`
- `repository.directory` → `packages/<name>`

Run `bun install` from the repo root to install workspace dependencies into the new package, then install the selected library from the `packages/<name>/` directory:

```bash
# From repo root
bun install

# From packages/<name>/
bun add <package-name>
```

Clean up all template placeholder content — replace stub implementations with actual integration code.

## 3. Learn the Framework

Refer to `AGENTS.md` § Framework Reference for the full API surface and `.d.ts` file locations.

## 4. Study a Real Integration

Pick the existing integration most structurally similar to the new one (e.g. similar auth method, domain, or node types) from `packages/` and read its source files to see established patterns in action:

- Entry point with auth and state (`src/index.ts`)
- Pin definitions with schemas, types, and controls (`src/pins/`)
- Node implementations with groups, inputs, outputs, and `run()` (`src/nodes/`)
- Index file re-export conventions

## 5. Implement

Follow the rules and patterns from `AGENTS.md` and the examples studied above.

**`src/index.ts`** — Auth, state, lifecycle. Declare `IntegrationState`, configure `i.auth.token()` (or appropriate auth method), initialize the client in `start()`.

**`src/pins/`** — Define all reusable pins first, before implementing nodes. One file per category, namespace re-exports in `index.ts`.

**`src/nodes/`** — Nodes grouped by category in subdirectories. One group per file, flat re-exports in index files. Always reference pins from `src/pins/` via `.with()` instead of defining pins inline in node files.

## 6. Quality Gate

Run all checks from the `packages/<name>/` directory. All must pass with zero errors and zero warnings:

```bash
bun run typecheck
bun run lint
bun run format
```
