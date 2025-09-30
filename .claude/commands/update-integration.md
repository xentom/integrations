---
description: Update an existing integration
argument-hint: [integration-name] [improvements]
---

# Update an existing integration

## Description

Update an existing integration for the xentom workflow editor by systematically analyzing, improving, and enhancing the integration based on specified improvements. The update process ensures compatibility with the current framework while implementing new features or fixes.

## Update Description

```
$2
```

## Update Process

### Phase 1: Analysis and Planning

#### 1.1 Review Existing Integration

Load and analyze the current integration in `packages/$1/`:

- **Source files**: Review all `.ts` files in `src/` directory
- **Configuration**: Examine `package.json` for dependencies and metadata

Document the current implementation patterns and architecture.

#### 1.2 Parse Improvement Requirements

Analyze the specified improvements to determine:

- **Feature additions**: New functionality to implement
- **Bug fixes**: Issues to resolve
- **Performance enhancements**: Optimization opportunities
- **Dependency updates**: Library version upgrades needed
- **API changes**: Adjustments for third-party service updates

### Phase 2: Research and Validation

#### 2.1 Check for Library Updates

If the improvement involves dependency updates:

- Search for newer versions of the current TypeScript library
- Review breaking changes in changelog/release notes
- Evaluate migration requirements
- Check for security advisories

#### 2.2 Research New Capabilities

For feature additions:

- Investigate new API methods in the library documentation
- Search for implementation examples
- Verify TypeScript type definition updates
- Assess compatibility with existing code

### Phase 3: Framework Review

#### 3.1 Exploring and Understanding Integration Framework Files

```bash
find node_modules/@xentom/integration-framework/dist -name "*.d.ts" -type f -exec sh -c 'echo "=== $1 ==="; cat "$1"; echo' _ {} \;
```

#### 3.2 Identify Framework Alignment

Ensure updates align with:

- Current framework architecture
- Established usage patterns
- Type safety requirements
- Error handling standards

### Phase 4: Implementation

#### 4.1 Update Dependencies (if applicable)

```bash
cd packages/$1
# Update specific dependency
bun update <package-name>
# Or update all dependencies
bun update
```

#### 4.2 Implement Core Updates

**For Bug Fixes:**

- Locate and fix identified issues
- Add error handling where missing
- Improve type safety
- Add defensive programming checks

**For New Features:**

- Extend integration entrypoint (`src/index.ts`) if needed
- Add new pins (`src/pins/<category>.ts`) following template patterns
- Create new nodes (`src/nodes/<node-name>.ts`) utilizing library capabilities
- Update environment variables if required

**For Performance Improvements:**

- Optimize data processing
- Implement caching where beneficial
- Reduce unnecessary API calls
- Improve async operation handling

**For API Updates:**

- Adjust method calls to match new API
- Update authentication mechanisms
- Modify request/response handling
- Update TypeScript interfaces

#### 4.3 Update Documentation

Modify package metadata if improvements change functionality:

- Update `description` if capabilities changed
- Adjust `version` following semantic versioning
- Document new environment variables
- Update inline code comments

### Phase 5: Quality Validation

#### 5.1 Type Safety Verification

```bash
# Ensure all TypeScript compiles correctly
bun run typecheck
```

#### 5.2 Code Standards Check

```bash
# Verify code meets standards
bun run lint
```

#### 5.3 Format Consistency

```bash
# Apply consistent formatting
bun run format
```

#### 5.4 Test Integration

- Verify existing functionality remains intact
- Test new features/fixes thoroughly
- Validate error handling
- Check performance improvements

### Phase 6: Final Review

#### 6.1 Regression Check

Ensure updates haven't broken:

- Existing pins functionality
- Current nodes behavior
- Integration lifecycle scripts
- Connection establishment

#### 6.2 Compatibility Verification

Confirm compatibility with:

- Current xentom workflow editor version
- Integration framework version
- Other dependent integrations

## Prerequisites

Before executing updates:

- Existing integration must be present in `packages/$1/`
- Understanding of both current implementation and desired improvements
- Familiarity with xentom workflow editor's integration architecture

## Expected Output

An updated integration package at `packages/$1/` with:

- Implemented improvements maintaining backward compatibility
- Updated dependencies (if applicable)
- Enhanced functionality following framework patterns
- Type-safe, linted, and formatted code
- Preserved existing functionality unless explicitly deprecated
