# Research: GitHub CI/CD Pipeline

**Feature**: GitHub CI/CD Pipeline  
**Date**: 2025-01-27  
**Purpose**: Research GitHub Actions best practices and workflow structure for NestJS CI/CD pipeline

## Research Questions

1. What are GitHub Actions best practices for CI/CD workflows?
2. How should workflows be structured for Node.js/NestJS projects?
3. What Node.js version should be used?
4. How to configure pnpm in GitHub Actions?
5. How to structure workflow jobs and steps for test → build → deploy pattern?
6. How to handle workflow failures and error messages?
7. How to configure workflow triggers (push, PR)?
8. How to structure deployment step as placeholder?

## Findings

### GitHub Actions Workflow Structure

**Decision**: Use single workflow file with multiple jobs (test, build, deploy) that run sequentially.

**Rationale**: 
- Jobs provide clear separation of concerns (test, build, deploy)
- Jobs can depend on each other using `needs` keyword
- Sequential execution ensures tests pass before build, build passes before deploy
- Single workflow file is easier to maintain than multiple files

**Alternatives considered**:
- Multiple workflow files (one per job): Rejected - harder to maintain, less clear dependencies
- Single job with multiple steps: Considered but jobs provide better failure isolation and parallelization opportunities

### Node.js Version

**Decision**: Use Node.js LTS version (20.x) with explicit version specification.

**Rationale**:
- LTS versions provide stability and long-term support
- Node.js 20.x is current LTS (as of 2025)
- Explicit version prevents breaking changes from automatic updates
- GitHub Actions provides `actions/setup-node@v4` action for easy Node.js setup

**Alternatives considered**:
- Latest Node.js version: Rejected - may have breaking changes
- Multiple Node.js versions: Rejected - not needed for minimal workflow

### Package Manager Configuration

**Decision**: Use pnpm with explicit installation step and caching.

**Rationale**:
- Repository uses pnpm (pnpm-lock.yaml exists)
- pnpm is faster and more efficient than npm
- GitHub Actions provides `pnpm/action-setup@v2` for pnpm installation
- Caching pnpm store improves workflow performance

**Alternatives considered**:
- npm: Rejected - repository uses pnpm
- yarn: Rejected - repository uses pnpm

### Workflow Triggers

**Decision**: Trigger on push to all branches and on pull request events (opened, synchronize, reopened).

**Rationale**:
- Running on all branches provides early feedback
- PR triggers ensure code quality before merge
- Standard CI/CD pattern for GitHub repositories
- Matches functional requirements (FR-001, FR-002, FR-003)

**Alternatives considered**:
- Only main branch: Rejected - doesn't provide early feedback on feature branches
- Manual trigger only: Rejected - doesn't meet automatic requirement

### Workflow Job Structure

**Decision**: Three jobs: `test`, `build`, `deploy` with sequential dependencies.

**Rationale**:
- Clear separation: test job runs unit and e2e tests
- Build job depends on test job (`needs: test`)
- Deploy job depends on build job (`needs: build`)
- Each job can fail independently, preventing downstream execution
- Matches sequential requirement (FR-015)

**Job Structure**:
```yaml
test:
  - Setup Node.js and pnpm
  - Install dependencies
  - Run unit tests
  - Run e2e tests

build:
  needs: test
  - Setup Node.js and pnpm
  - Install dependencies
  - Build application
  - Upload build artifacts (optional, for deployment step)

deploy:
  needs: build
  - Deployment step placeholder (no-op for now)
```

**Alternatives considered**:
- Single job with all steps: Rejected - less clear failure points, harder to debug
- Parallel jobs: Rejected - violates sequential requirement

### Error Handling and Messaging

**Decision**: Use GitHub Actions built-in step failure handling with clear step names and continue-on-error for optional steps.

**Rationale**:
- GitHub Actions automatically fails workflow on step failure
- Clear step names (`Run unit tests`, `Run e2e tests`, `Build application`) provide actionable error messages
- Step names appear in workflow logs and PR status checks
- Matches requirement for clear error messages (FR-013)

**Alternatives considered**:
- Custom error handling scripts: Rejected - unnecessary complexity for minimal workflow
- Ignore errors: Rejected - violates requirement to fail on errors (FR-004, FR-008, FR-012)

### Deployment Step Structure

**Decision**: Create deploy job with placeholder step that can be easily configured later.

**Rationale**:
- Provides structure for future deployment configuration
- Deploy job exists but does nothing (no-op) until configured
- Easy to add deployment logic without restructuring workflow
- Matches user story 3 requirement (deployment step structure)

**Implementation**:
```yaml
deploy:
  needs: build
  runs-on: ubuntu-latest
  steps:
    - name: Deployment placeholder
      run: echo "Deployment step - configure as needed"
```

**Alternatives considered**:
- Skip deploy job entirely: Rejected - doesn't meet requirement for deployment step structure
- Full deployment implementation: Rejected - deployment target not specified (user chose placeholder)

### Workflow File Location and Naming

**Decision**: Use `.github/workflows/ci-cd.yml` as workflow file name.

**Rationale**:
- Standard GitHub Actions directory structure
- Descriptive name indicates purpose (CI/CD)
- Single file is easier to maintain than multiple workflow files
- Matches minimal requirement

**Alternatives considered**:
- Multiple workflow files (test.yml, build.yml, deploy.yml): Rejected - harder to maintain dependencies
- Generic name (main.yml): Rejected - less descriptive

### Caching Strategy

**Decision**: Cache pnpm store and node_modules to improve workflow performance.

**Rationale**:
- Reduces workflow execution time
- Reduces GitHub Actions minutes usage
- Standard practice for Node.js workflows
- pnpm cache action available: `pnpm/action-setup@v2` with cache option

**Alternatives considered**:
- No caching: Rejected - slower workflow execution, higher cost
- Cache everything: Rejected - may cache unnecessary files

## Summary

The workflow will:
1. Use GitHub Actions YAML workflow file at `.github/workflows/ci-cd.yml`
2. Configure Node.js 20.x LTS with pnpm
3. Structure as three sequential jobs: test → build → deploy
4. Trigger on push and pull request events
5. Use clear step names for error messages
6. Include deployment step as placeholder for future configuration
7. Cache pnpm store for performance

All research questions resolved. Ready for Phase 1 design.

