# update-integration

Update an existing integration for the xentom workflow editor.

## Usage

```
/update-integration $ARGUMENTS
```

## Description

This command updates an existing integration by following a systematic approach to research, implement, and integrate third-party services into the xentom workflow editor. The integration will be scaffolded from the template and customized based on the chosen TypeScript library.

## Steps

### 1. Review the Integration

Review the existing integration in the `packages/<integration-name>/` directory. Load all the files in the context to understand the existing implementation.

### 2. Review the Integration Framework

Review the source files of the integration framework in monorepo root
`node_modules/@xentom/integration-framework/src/**/*.ts`
or in the integration package root
`packages/<integration-name>/node_modules/@xentom/integration-framework/src/**/*.ts`
to gain a solid understanding of:

- How the framework works and its core concepts
- Proper usage patterns and best practices
- Available APIs and their correct implementation
- Common pitfalls and how to avoid them

### 3. Update the Integration

Update the integration by following the existing implementation pattern.
