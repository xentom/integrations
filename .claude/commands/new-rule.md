---
description: Create and integrate a new development rule into CLAUDE.md guidelines
argument-hint: [description]
---

# Create a new development rule for CLAUDE.md

## Description

Create, refine, and integrate a new development rule into the CLAUDE.md guidelines to enhance code quality, consistency, and best practices for Xentom integrations. The rule will be systematically developed, categorized, and integrated into the existing documentation structure.

## Rule Description

```
$ARGUMENTS
```

## Rule Development Process

### Phase 1: Analysis and Research

#### 1.1 Document Analysis

Thoroughly examine the current CLAUDE.md file:

- **Structure mapping**: Document all existing sections and subsections
- **Rule inventory**: Catalog current rules and their categories
- **Pattern recognition**: Identify formatting conventions and language patterns
- **Gap analysis**: Find areas lacking guidance that the new rule could address

#### 1.2 Duplication Check

Verify the proposed rule's uniqueness:

- Search for similar existing rules
- Identify related guidelines that might overlap
- Determine if the rule extends or replaces existing guidance
- Document relationships to existing rules

### Phase 2: Rule Development

#### 2.1 Rule Refinement

Transform the initial description into a comprehensive guideline:

- **Clarity enhancement**: Rewrite for unambiguous understanding
- **Specificity improvement**: Add measurable criteria and boundaries
- **Actionability focus**: Ensure developers can directly apply the rule
- **Context addition**: Include when and why the rule applies

#### 2.2 Framework Alignment Verification

Confirm compatibility with Xentom principles:

- Validate against integration framework architecture
- Ensure consistency with TypeScript best practices
- Verify alignment with existing workflow patterns
- Check compatibility with current tooling (bun, TypeScript, valibot)

### Phase 3: Categorization and Structure

#### 3.1 Section Selection

Determine optimal placement within these categories:

**Code Quality Standards**

- Type safety requirements
- Import management rules
- Error handling patterns
- Performance considerations

**Integration Framework Usage**

- Pin management guidelines
- Node architecture patterns
- Lifecycle script requirements
- State management rules

**Code Structure and Style**

- Variable naming conventions
- Function organization
- Module structure
- Documentation requirements

**Integration Development Guidelines**

- Authentication patterns
- API interaction standards
- Testing requirements
- Security considerations

Create a new subsection if none fit appropriately.

#### 3.2 Logical Positioning

Strategic rule placement:

- Position after related prerequisites
- Place before dependent concepts
- Group with similar complexity rules
- Maintain reading flow continuity

### Phase 4: Content Creation

#### 4.1 Rule Formulation

Write the rule following established patterns:

**Required Format Structure:**

````markdown
#### [Rule Category]

**✅ REQUIRED/PREFERRED**: [Positive guidance statement]

```typescript
// Correct implementation example
[code demonstrating proper usage]
```
````

**❌ FORBIDDEN/AVOID**: [Anti-pattern description]

```typescript
// Incorrect implementation example
[code showing what to avoid]
```

**⚠️ CAUTION**: [Situational guidance if applicable]

**Rationale**: [Brief explanation of why this rule exists]

````

#### 4.2 Example Development
Create comprehensive code examples:
- **Positive examples**: Show correct implementation
- **Negative examples**: Demonstrate common mistakes
- **Edge cases**: Include boundary condition handling
- **Real-world scenarios**: Use practical Xentom integration contexts

#### 4.3 Documentation Enhancement
Add supporting information:
- **Use cases**: When to apply the rule
- **Exceptions**: Valid reasons to deviate
- **Migration notes**: How to update existing code
- **Performance impact**: If relevant

### Phase 5: Quality Assurance

#### 5.1 Technical Validation
```typescript
// Verify all code examples:
// - Compile without errors
// - Follow TypeScript strict mode
// - Use current framework APIs
// - Demonstrate the rule clearly
````

#### 5.2 Content Review

Ensure rule quality:

- **Clarity**: Rule is immediately understandable
- **Completeness**: All aspects are covered
- **Consistency**: Aligns with existing guidelines
- **Correctness**: Examples are accurate and functional

#### 5.3 Integration Testing

Validate documentation integration:

- Rule flows naturally in its section
- Cross-references are accurate
- Formatting matches existing patterns
- No conflicts with other rules

### Phase 6: Final Integration

#### 6.1 Documentation Update

Integrate the rule into CLAUDE.md:

- Preserve all existing content
- Maintain document structure
- Update table of contents if present
- Ensure proper markdown formatting

#### 6.2 Cross-Reference Updates

Link related content:

- Add references to related rules
- Update dependent guidelines
- Note in relevant sections
- Maintain bidirectional references

## Rule Quality Standards

### Content Requirements

- **Specificity**: Concrete, measurable criteria (e.g., "maximum 100 lines per function")
- **Actionability**: Clear steps developers can follow
- **Relevance**: Addresses actual Xentom development challenges
- **Testability**: Compliance can be verified programmatically or through review

### Language Standards

- **Imperative mood**: "Use", "Implement", "Ensure", "Avoid"
- **Active voice**: Direct and clear communication
- **Technical precision**: Accurate terminology and concepts
- **Accessibility**: Understandable by intermediate TypeScript developers

### Example Requirements

- **Compilation**: All code must be valid TypeScript
- **Framework accuracy**: Use actual Xentom integration APIs
- **Realism**: Examples from actual integration scenarios
- **Completeness**: Show full context, not just fragments

## Quality Checklist

Before finalizing the rule, verify:

- [ ] Rule addresses a genuine development need
- [ ] No duplication with existing guidelines
- [ ] Examples compile with TypeScript strict mode
- [ ] Placement enhances document organization
- [ ] Language is imperative and actionable
- [ ] Both positive and negative examples provided
- [ ] Rationale clearly explains the rule's importance
- [ ] Format matches existing CLAUDE.md conventions
- [ ] Cross-references to related rules included
- [ ] Rule enhances rather than complicates development

## Expected Output

A seamlessly integrated new rule in CLAUDE.md that:

- Enhances code quality and consistency
- Provides clear, actionable guidance
- Includes practical, compilable examples
- Fits naturally within existing documentation structure
- Improves the overall development experience for Xentom integrations
