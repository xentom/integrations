# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This is a monorepo for Xentom integrations using Turbo for build orchestration and Bun as the package manager. The repository contains multiple integration packages that extend the Xentom platform.

### Key Directories

- `packages/` - Individual integration packages (essentials, github, openai, resend, teamspeak, template, testing)
- `tooling/style-guide/` - Shared ESLint, Prettier, and TypeScript configurations
- Each integration follows the same structure: `src/index.ts` exports nodes, optional environment variables, and integration configuration

### Integration Architecture

Each integration package:
- Uses `@xentom/integration-framework` as the core dependency
- Exports an integration object with `nodes` and optional `env` configuration
- Uses Valibot for schema validation and transformations
- Follows a standardized package.json structure with consistent scripts

## Development Commands

### Root-level commands (run from repository root):
- `bun run clean` - Clean all packages and git-ignored files
- `bun run lint` - Run ESLint across all packages with caching
- `bun run typecheck` - Run TypeScript type checking across all packages
- `bun run format` - Format code with Prettier across all packages
- `bun run pack` - Build/pack all integration packages

### Package-level commands (run from any `packages/*/` directory):
- `bun run dev` - Start development mode using `xentom dev`
- `bun run pack` - Build the integration package using `xentom pack`
- `bun run publish` - Publish the integration using `xentom publish`
- `bun run lint` - Run ESLint for the package
- `bun run typecheck` - Run TypeScript checking with `tsc --noEmit`
- `bun run format` - Check Prettier formatting
- `bun run clean` - Clean build artifacts and dependencies

## Code Standards

- Uses TypeScript with strict configuration
- ESLint configuration from `@xentom/style-guide`
- Prettier formatting from `@xentom/style-guide/prettier`
- All packages use ES modules (`"type": "module"`)
- Dependencies use workspace catalog for version consistency

## Package Manager

This project uses Bun (`bun@1.2.18`) as specified in the packageManager field. Always use `bun` commands instead of npm/yarn.