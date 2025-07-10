# Integration Init Command

## Overview

This command initializes a new integration for the workflow editor by setting up the complete integration structure, API client, and all necessary nodes.

## Usage

```bash
/integration-init "service-name"
```

**Arguments:**

- `$ARGUMENTS` - Service name (e.g., "trello", "github", "slack")

## Reference Documentation

For detailed information about the ACME Integration Framework, project structure, and development best practices, refer to `/CLAUDE.md` in the project root.

## Command Flow

### Step 1: Research API Client

Search for existing API clients for the specified service:

1. **Search npm registry** for packages related to the service
   - Look for official packages (e.g., `@trello/api`, `trello-api`)
   - Consider popular community packages with good maintenance
   - Check package stats: downloads, last updated, GitHub stars
   - Prioritize TypeScript-compatible packages

2. **Evaluate and select the best client**
   - Official packages > Well-maintained community packages
   - TypeScript support preferred
   - Recent updates and active maintenance
   - Good documentation and examples

3. **Gather package details**
   - Package name and version
   - Installation command
   - Basic usage examples
   - Required environment variables/configuration

### Step 2: Create Integration Structure

Copy the template integration to create the new integration:

```bash
cp -r /integrations/template /integrations/$ARGUMENTS
```

### Step 3: Install API Client

Navigate to the new integration directory and install the selected API client:

```bash
cd /integrations/$ARGUMENTS
bun install [api-client-package]
```

### Step 4: Analyze API Client

Thoroughly examine the API client to understand its structure:

1. **Read the main module files**
   - `[monorepo-root]/node_modules/[lib-name]/package.json` - Understanding exports and main files
   - `[monorepo-root]/node_modules/[lib-name]/index.js` or `[monorepo-root]/node_modules/[lib-name]/dist/index.js`
   - `[monorepo-root]/node_modules/[lib-name]/lib/` or `[monorepo-root]/node_modules/[lib-name]/src/` directories

2. **Extract key information**
   - Client initialization process
   - Authentication requirements
   - Available endpoints and methods
   - Request/response patterns
   - Error handling approaches

3. **Identify endpoint categories**
   - Group related endpoints logically
   - Create a hierarchical structure
   - Consider the service's natural API organization

### Step 5: Implement Integration Entrypoint

Create the main integration file with proper lifecycle management:

1. **Update integration configuration**
   - Define required environment variables
   - Set integration metadata (name, version, description)
   - Configure authentication requirements

2. **Define IntegrationState interface**
   - Create TypeScript interface defining shared state properties
   - Add API client instance as a property
   - Ensure type safety across all nodes and pins

3. **Implement lifecycle hooks**
   - `start()`: Initialize API client, handle authentication and configuration validation
   - `stop()`: Cleanup resources, close connections

Refer to `/CLAUDE.md` for detailed implementation patterns and examples.

### Step 6: Generate Endpoint Category Tree

Create a well-structured category tree based on the API analysis:

1. **Analyze API endpoints** and group them logically
2. **Create category hierarchy** that makes sense for workflow users
3. **Plan file structure** following the pattern specified in `/CLAUDE.md`

Example for $ARGUMENTS:

```
/$ARGUMENTS/src/
  /nodes/
    [category1]/
      [category1].ts
      index.ts
    [category2]/
      [category2].ts
      index.ts
    [category3]/
      [category3].ts
      index.ts
  /pins/
    [category1].ts
    [category2].ts
    [category3].ts
    index.ts
```

### Step 7: Implement Nodes and Pins

For each category, create comprehensive node implementations following the patterns and best practices detailed in `/CLAUDE.md`:

1. **Create category nodes** (`[category].ts`)
   - Implement CRUD operations where applicable
   - Handle pagination for list operations
   - Implement proper error handling
   - Add input validation
   - Include proper TypeScript types

2. **Create reusable pins** (`/pins/[category].ts`)
   - Define common data structures
   - Create reusable validation schemas
   - Implement helper functions
   - Export type definitions

3. **Follow integration best practices**
   - Use consistent naming conventions
   - Implement proper error handling
   - Add comprehensive logging
   - Include parameter validation
   - Handle rate limiting appropriately
   - Support pagination where needed
   - Implement proper TypeScript types
   - Follow pin organization and optimization guidelines

Refer to `/CLAUDE.md` for detailed implementation patterns, examples, and best practices.

### Step 8: Test Integration

Run comprehensive tests to ensure everything works correctly:

1. **Lint check**

   ```bash
   cd /integrations/$ARGUMENTS
   bun run lint
   ```

2. **Type check**

   ```bash
   cd /integrations/$ARGUMENTS
   bun run typecheck
   ```

3. **Fix any issues** found during testing
   - Resolve linting errors
   - Fix TypeScript compilation errors
   - Ensure all imports are correct
   - Verify all exports are properly defined

## Additional Considerations

### Error Handling

- Implement consistent error handling across all nodes
- Handle API rate limits gracefully
- Provide meaningful error messages to users
- Log errors appropriately for debugging

### Documentation

- Include comprehensive node, pin, and env descriptions to help users and AI use the integration correctly
- Create integration-specific README file (required)
  - Integration name as header
  - Short description of the integration
  - Additional notes for environment variables
  - Instructions on how to generate tokens/API keys on the service

### Performance

- Implement efficient data fetching strategies
- Use caching where appropriate
- Handle large datasets with pagination
- Optimize API calls to minimize requests

## Success Criteria

- All files are created and properly structured
- API client is correctly initialized and configured
- All endpoint categories are implemented with full CRUD operations
- Integration passes linting and type checking
- Error handling is comprehensive and user-friendly
- Code follows established patterns and best practices
