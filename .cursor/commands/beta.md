---
description: Get information about an integration
argument-hint: [integration]
---

# Integration Information

## Phase 1: Load all necessary files in the context

### 1.1 Load the integration framework files

Run the following command to load the integration framework files into the context.

```bash
find node_modules/@xentom/integration-framework/dist -name "*.d.ts" -type f -exec sh -c 'echo "=== $1 ==="; cat "$1"; echo' _ {} \;
```

### 1.2 Load the integration files

Run the following command to load the integration files into the context.

```bash
find packages/$1/src -name "*.ts" -type f -exec sh -c 'echo "=== $1 ==="; cat "$1"; echo' _ {} \;
```

## Phase 2: Generate a summary of the integration and its files

Tell me a summary of the integration and its files.
