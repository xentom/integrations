---
description: Run quality checks (lint, typecheck, format) for an integration
---

# Run quality checks

Run all mandatory quality checks for the integration at `packages/$1/`.

## Steps

### 1. TypeScript Type Checking

```bash
bun run typecheck
```

Run from the `packages/$1/` directory. Must produce zero errors.

### 2. Linting

```bash
bun run lint
```

Run from the `packages/$1/` directory. Must produce zero errors and zero warnings.

### 3. Formatting

```bash
bun run format
```

Run from the `packages/$1/` directory. Biome writes fixes in-place — no re-run needed after this step.

## On Failure

If `typecheck` or `lint` fails, fix the issues autonomously and re-run the failing check. Repeat until both pass cleanly.

Follow all rules from `AGENTS.md` § Type Safety when fixing issues. If a type error persists after 3 fix attempts, redesign the approach. Let the formatter handle style; do not fight Biome's formatting decisions.

Report a summary of all checks and any fixes applied.
