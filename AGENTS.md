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

The `@/` path alias resolves to `src/`. Use `import * as pins from '@/pins'` to import pin definitions within a package.

## Framework Reference

Read `node_modules/@xentom/integration-framework/AGENTS.md` for all integration development guidelines. If specific details are still unclear, explore `node_modules/@xentom/integration-framework/dist/` to find and read the relevant `.d.ts` files on demand.

Refer to existing integrations under `packages/` (e.g., `resend`, `github`, `slack`) as working examples.
