# Research: LLM Code Generation Workflow

**Feature**: LLM Code Generation Workflow  
**Date**: 2025-01-27  
**Purpose**: Research GitHub Actions patterns, LLM API integration, and Git operations for automated code generation workflow

## Research Questions

1. How to integrate LLM APIs (OpenAI, Anthropic, etc.) in GitHub Actions workflows?
2. How to structure LLM API responses for code generation (file paths → code content)?
3. How to create branches and commit files programmatically in GitHub Actions?
4. How to create pull requests via GitHub CLI or API in workflows?
5. How to sanitize branch names from user prompts?
6. How to handle LLM API errors and retries in workflows?
7. How to structure workflow steps for code generation → commit → PR creation?

## Findings

### LLM API Integration in GitHub Actions

**Decision**: Use Claude Code GitHub Actions (`anthropics/claude-code-action@v1`) - a ready-made GitHub Action that handles LLM integration, code generation, branch creation, and PR creation automatically.

**Rationale**:
- Claude Code GitHub Actions provides complete solution: LLM API calls, code generation, Git operations, and PR creation
- Built-in support for creating PRs, responding to issues, and code review
- Handles authentication, API calls, branch creation, commits, and PR creation automatically
- Supports multiple LLM providers (Claude API, AWS Bedrock, Google Vertex AI)
- Can be triggered via `@claude` mentions or with direct prompts via `workflow_dispatch`
- Follows project standards via `CLAUDE.md` configuration file
- Secure by default - code stays on GitHub's runners
- Simple setup with `/install-github-app` command or manual configuration
- Reference: https://code.claude.com/docs/en/github-actions

**Alternatives considered**:
- Custom HTTP requests to LLM APIs: Rejected - Claude Code Action handles all complexity
- Custom Git operations and PR creation: Rejected - Claude Code Action provides this functionality
- OpenAI API integration: Rejected - Claude Code Action is purpose-built for this use case and supports multiple providers

### LLM Response Format

**Decision**: Claude Code GitHub Actions handles response parsing automatically - no manual JSON parsing needed.

**Rationale**:
- Claude Code Action automatically handles code generation and file creation
- Action understands code structure and creates appropriate files
- No need to parse JSON responses manually
- Action handles multiple files automatically
- Follows repository structure and conventions

**Note**: Claude Code Action uses Claude Code SDK internally, which handles all code generation, file operations, and Git commits automatically.

### Branch Creation and Git Operations

**Decision**: Claude Code GitHub Actions handles all Git operations automatically (branch creation, commits, pushes).

**Rationale**:
- Claude Code Action automatically creates branches, commits changes, and pushes to remote
- No manual Git commands needed
- Action handles branch naming and conflict resolution
- Uses GitHub App authentication for secure repository access
- Handles all Git operations internally

**Alternatives considered**:
- Manual Git commands: Rejected - Claude Code Action provides this functionality
- Custom Git scripts: Rejected - unnecessary when using Claude Code Action

### Pull Request Creation

**Decision**: Claude Code GitHub Actions automatically creates pull requests after code generation.

**Rationale**:
- Claude Code Action automatically creates PRs with appropriate titles and descriptions
- PR includes context about what was generated
- Handles PR creation errors gracefully
- Can respond to `@claude` mentions in issues/PRs to create PRs
- Supports both interactive mode (`@claude` mentions) and automation mode (direct prompts)

**Alternatives considered**:
- Manual PR creation via GitHub CLI: Rejected - Claude Code Action provides this automatically
- GitHub REST API: Rejected - Claude Code Action handles PR creation internally

### Branch Name Sanitization

**Decision**: Sanitize prompt by: lowercase, replace spaces/special chars with hyphens, truncate to 50 chars, append timestamp `YYYYMMDD-HHMMSS`.

**Rationale**:
- Git branch names must be valid refs (no spaces, special chars)
- Timestamp ensures uniqueness (handles concurrent runs)
- Truncation prevents overly long branch names
- Format: `llm-{sanitized-prompt}-{timestamp}` matches spec clarification
- Example: `llm-add-user-authentication-20250127-143022`

**Sanitization Steps**:
1. Convert to lowercase
2. Replace spaces and special chars with hyphens
3. Remove consecutive hyphens
4. Remove leading/trailing hyphens
5. Truncate to 50 characters
6. Append timestamp: `-YYYYMMDD-HHMMSS`

### LLM API Error Handling

**Decision**: Use HTTP status code checks and retry logic with exponential backoff for transient failures.

**Rationale**:
- LLM APIs may have rate limits or transient failures
- Exponential backoff prevents overwhelming API during outages
- Clear error messages help users understand failures (FR-016)
- Fail fast on authentication errors (invalid API key)
- Retry on 429 (rate limit) and 5xx (server errors)

**Retry Strategy**:
- Max 3 retries for 429/5xx errors
- Exponential backoff: 1s, 2s, 4s delays
- Fail immediately on 401/403 (auth errors)
- Fail immediately on 400 (bad request - user error)

### Workflow Step Structure

**Decision**: Use Claude Code GitHub Actions with single step - action handles all operations internally.

**Rationale**:
- Claude Code Action encapsulates all steps: LLM API call, code generation, branch creation, commits, push, and PR creation
- Single step simplifies workflow configuration
- Action handles error handling internally with clear messages
- Matches user story priorities (P1: generate, P2: apply, P3: PR) - all handled by action
- Can be triggered via `workflow_dispatch` with prompt input or via `@claude` mentions

**Workflow Structure**:
```yaml
jobs:
  claude:
    runs-on: ubuntu-latest
    steps:
      - uses: anthropics/claude-code-action@v1
        with:
          prompt: ${{ inputs.prompt }}
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
```

**Action Internally Handles**:
1. Input validation (prompt processing)
2. LLM API call (Claude API, AWS Bedrock, or Google Vertex AI)
3. Code generation and file creation
4. Branch creation with appropriate naming
5. Git commits
6. Push to remote
7. PR creation with title and description

### LLM Provider Configuration

**Decision**: Claude Code GitHub Actions supports multiple providers via configuration: Claude API (default), AWS Bedrock, or Google Vertex AI.

**Rationale**:
- Claude Code Action supports Claude API (default), AWS Bedrock, and Google Vertex AI
- Model selection via `claude_args: --model` parameter
- Provider selection via `use_bedrock: true` or `use_vertex: true` flags
- API keys stored in GitHub Secrets per provider
- Supports Claude Opus 4.5, Sonnet 4.5, and other models

**Configuration Pattern**:
- **Claude API** (default): `anthropic_api_key` secret, `claude_args: --model claude-sonnet-4-5-20250929`
- **AWS Bedrock**: `use_bedrock: true`, AWS credentials via OIDC, `claude_args: --model us.anthropic.claude-sonnet-4-5-20250929-v1:0`
- **Google Vertex AI**: `use_vertex: true`, GCP Workload Identity, `claude_args: --model claude-sonnet-4@20250514`

**Reference**: https://code.claude.com/docs/en/github-actions#using-with-aws-bedrock--google-vertex-ai

### PR Title and Description Generation

**Decision**: Claude Code GitHub Actions automatically generates PR titles and descriptions based on generated code.

**Rationale**:
- Claude Code Action automatically creates PRs with appropriate titles and descriptions
- PR includes context about what was generated
- Action can include original prompt in PR description
- File changes are automatically included in PR diff
- Follows project standards via `CLAUDE.md` configuration

**Customization**: Can customize PR behavior via `CLAUDE.md` file at repository root to define coding standards, review criteria, and project-specific rules.

