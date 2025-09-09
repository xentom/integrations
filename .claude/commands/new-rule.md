# new-rule

Create, refine, and integrate a new development rule into the CLAUDE.md guidelines to enhance code quality, consistency, and best practices for Xentom integrations.

## Usage

```
/new-rule <detailed-rule-description>
```

**Examples:**

```
/new-rule Always validate API responses before processing data
/new-rule Prefer composition over inheritance for integration components
/new-rule Use consistent error message formats across all nodes
```

## Execution Steps

### 1. Analyze Current Documentation

- Read the complete CLAUDE.md file to understand existing structure and patterns
- Identify current rule categories and their organization
- Note existing formatting conventions and language patterns
- Review similar or related rules to avoid duplication

### 2. Rule Development and Refinement

- Enhance the provided rule description for clarity and specificity
- Ensure the rule addresses a genuine code quality or consistency need
- Make the rule actionable with clear, measurable criteria
- Verify the rule aligns with Xentom integration framework principles

### 3. Categorization and Placement

- Determine the most appropriate section for the new rule:
  - **Code Quality Standards** - Type safety, imports, error handling
  - **Integration Framework Usage** - Pin management, node architecture
  - **Code Structure and Style** - Variable usage, naming, formatting
  - **Integration Development Guidelines** - Patterns, authentication, workflows
- Create a new subsection if the rule doesn't fit existing categories
- Consider the logical flow and grouping with related rules

### 4. Integration and Formatting

- Write the rule using imperative language (e.g., "Use", "Avoid", "Ensure")
- Follow the established format pattern:
  - **✅ REQUIRED/PREFERRED**: Positive guidance with examples
  - **❌ FORBIDDEN/AVOID**: Anti-patterns with explanations
  - **⚠️ CAUTION**: Situational guidance
- Include practical code examples that demonstrate the rule
- Add rationale or context when the rule might not be obvious

### 5. Quality Validation

- Ensure the rule doesn't contradict existing guidelines
- Verify examples compile and follow TypeScript best practices
- Check that the rule is specific enough to be actionable
- Confirm the rule enhances rather than complicates development

## Rule Quality Requirements

### Content Standards

- **Specificity**: Rules must be concrete and actionable, not vague suggestions
- **Measurability**: Include clear criteria for compliance (e.g., "zero errors", "no more than X lines")
- **Relevance**: Address real issues encountered in Xentom integration development
- **Consistency**: Align with existing framework patterns and conventions

### Formatting Standards

- **Language**: Use imperative mood ("Use", "Avoid", "Ensure", "Implement")
- **Examples**: Provide both positive (✅) and negative (❌) examples when helpful
- **Context**: Include brief rationale for non-obvious rules
- **References**: Link to relevant framework documentation when applicable

### Integration Standards

- **Placement**: Position rules logically within existing section hierarchy
- **Grouping**: Place related rules together for easier reference
- **Cross-references**: Note relationships to other rules when relevant
- **Versioning**: Maintain consistency with existing rule numbering or organization

## Example Rule Integration

````markdown
#### Pin Validation

**✅ REQUIRED**: Validate pin schemas match actual API contracts:

```typescript
// Correct: Schema matches API response structure
export const user = i.pins.data({
  schema: v.object({
    id: v.string(),
    email: v.string(),
    name: v.string(),
  }),
});
```
````

**❌ FORBIDDEN**: Over-specifying schemas for complex external APIs:

```typescript
// Incorrect: Brittle schema for complex API
export const response = i.pins.data({
  schema: v.object({
    // 50+ fields trying to match every API variation
  }),
});
```

**Rationale**: Pin schemas should provide type safety without becoming maintenance burdens when external APIs evolve.

```

## Post-Integration Checklist

- [ ] Rule is placed in the most logical section
- [ ] Formatting matches existing conventions (✅/❌ indicators, code blocks)
- [ ] Examples are practical and relevant to Xentom development
- [ ] Rule doesn't conflict with or duplicate existing guidelines
- [ ] Language is clear, imperative, and actionable
- [ ] Code examples follow TypeScript and framework best practices
- [ ] Rule enhances code quality without adding unnecessary complexity

## Notes

- When modifying CLAUDE.md, preserve all existing content and structure
- Ensure new rules integrate seamlessly with the existing flow
- Consider how the rule will be discovered and referenced by developers
- Validate that examples work with the current integration framework version
```
