# Implementation Plan: LLM Code Generation Workflow

**Branch**: `001-llm-code-pr-workflow` | **Date**: 2025-01-27 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-llm-code-pr-workflow/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implement a GitHub Actions workflow using Claude Code GitHub Actions (`anthropics/claude-code-action@v1`) that accepts a prompt input, uses Claude Code to generate code, applies the generated code to a new branch, and creates a pull request. Claude Code Action handles all LLM integration, code generation, Git operations, and PR creation automatically. The workflow behaves like a junior developer - committing code regardless of correctness or conflicts, leaving PR reviewers to handle issues.

**Reference**: https://code.claude.com/docs/en/github-actions

## Technical Context

**Language/Version**: YAML (GitHub Actions workflow syntax)  
**Primary Dependencies**: Claude Code GitHub Actions (`anthropics/claude-code-action@v1`), GitHub Actions, Claude API (or AWS Bedrock/Google Vertex AI)  
**Storage**: N/A (workflow uses Git repository for code storage)  
**Testing**: Manual workflow testing via GitHub Actions UI, workflow syntax validation  
**Target Platform**: GitHub Actions runners (ubuntu-latest)  
**Project Type**: Infrastructure/DevOps (GitHub Actions workflow)  
**Performance Goals**: Complete workflow execution within 5 minutes for typical prompts (under 500 words)  
**Constraints**: POC scope - no access control restrictions, workflow proceeds like junior dev (no validation/conflict resolution)  
**Scale/Scope**: Single workflow file using Claude Code Action, supports multiple LLM providers (Claude API, AWS Bedrock, Google Vertex AI), handles concurrent workflow runs

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Verify compliance with NestJS Explore Constitution principles:

- **DDD Compliance**: N/A - This is infrastructure code (GitHub Actions workflow), not application domain code. Workflow follows GitHub Actions patterns and best practices.
- **Clean Architecture**: N/A - Infrastructure configuration file, not application code with layers.
- **TDD**: Manual testing via GitHub Actions UI and workflow runs. Workflow syntax can be validated before committing.
- **Clean Code**: YAML should be well-structured, commented, and follow GitHub Actions best practices. Clear step names and error messages.
- **Dependency Injection**: N/A - GitHub Actions uses environment variables and secrets for configuration.
- **Domain Model**: N/A - Infrastructure workflow, no domain entities.
- **Module Organization**: N/A - Single workflow file following GitHub Actions structure.

**Violations**: This is infrastructure/DevOps code (GitHub Actions workflow), not application code. Constitution principles (DDD, Clean Architecture, Domain Model) apply to application code, not infrastructure configuration. The workflow follows GitHub Actions best practices and patterns instead.

### Post-Phase 1 Design Review

After completing Phase 1 (research, data model, contracts, quickstart):

- **Design Completeness**: ✅ All design artifacts created (research.md, data-model.md, contracts/, quickstart.md)
- **LLM Integration**: ✅ Research completed on Claude Code GitHub Actions integration
- **Workflow Structure**: ✅ Single-step workflow using Claude Code Action (handles all operations internally)
- **Error Handling**: ✅ Claude Code Action handles error handling internally with clear messages
- **Contracts**: ✅ Workflow inputs/outputs, Claude Code Action interface documented
- **Constitution Compliance**: ✅ Infrastructure code appropriately exempted from application code principles
- **Updated Approach**: ✅ Using Claude Code GitHub Actions instead of custom implementation (simpler, more robust)

**Status**: Ready for Phase 2 (task breakdown via `/speckit.tasks`)

## Project Structure

### Documentation (this feature)

```text
specs/001-llm-code-pr-workflow/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/          # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
.github/
└── workflows/
    └── llm-code-generation.yml    # GitHub Actions workflow file

# No application code changes - this is infrastructure configuration only
```

**Structure Decision**: Single GitHub Actions workflow file at `.github/workflows/llm-code-generation.yml`. This follows the existing pattern in the repository (see `.github/workflows/ci-cd.yml`). The workflow is infrastructure configuration, not application code, so it doesn't follow DDD/Clean Architecture patterns.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Infrastructure code doesn't follow DDD/Clean Architecture | This is a GitHub Actions workflow (YAML configuration), not application code | N/A - Constitution principles apply to application code, not infrastructure configuration |
