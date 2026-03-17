---
description: Update an existing integration
---

# Update an existing integration

Update the integration at `packages/$1/`.

Requested changes:

```
$2
```

## 1. Understand the Request and Read Relevant Files

Start by reading `packages/$1/package.json` and `packages/$1/src/index.ts` to understand the integration's dependencies and state setup.

Then read only the files relevant to the requested changes. For example:

- Fixing a bug in a node → read that node file and its related pins
- Adding a new node to an existing category → read that category's directory
- Changing auth or state → read `src/index.ts`
- Adding a new category → read `src/nodes/index.ts` for the export structure

When creating or updating nodes, always read all files in `src/pins/` first to know what reusable pins are already defined. Reuse existing pins via `.with()` instead of creating duplicates.

Read additional files only if needed to understand dependencies or avoid conflicts. Do not load the entire `src/` tree upfront.

## 2. Research (if needed)

- Check library docs for new API methods or breaking changes
- Read `node_modules/@xentom/integration-framework/CLAUDE.md` if framework API questions arise
- For specific API details not covered in the reference, read the relevant `.d.ts` files on demand

## 3. Implement

Apply changes following the rules and patterns in `AGENTS.md`.

If adding new features, study the existing integration most structurally similar to `$1` from `packages/` for reference on established patterns.

## 4. Quality Gate

Run all checks from the `packages/$1/` directory. All must pass with zero errors and zero warnings:

```bash
bun run typecheck
bun run lint
bun run format
```

## 5. Verify

Ensure the update hasn't broken:

- Existing pin definitions and their reusability
- Current node exports and behavior
- Integration lifecycle (auth, start)
- Index file re-exports
