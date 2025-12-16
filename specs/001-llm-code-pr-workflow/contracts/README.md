# Contracts: LLM Code Generation Workflow

**Feature**: LLM Code Generation Workflow  
**Date**: 2025-01-27

## Overview

This feature uses Claude Code GitHub Actions (`anthropics/claude-code-action@v1`) - a ready-made GitHub Action that handles LLM integration, code generation, Git operations, and PR creation automatically. The "contracts" here define:
1. Workflow input/output interface
2. Claude Code Action interface
3. GitHub App authentication (optional)

**Reference**: https://code.claude.com/docs/en/github-actions

## Workflow Input Contract

**Interface**: GitHub Actions `workflow_dispatch` Inputs

**Location**: `.github/workflows/llm-code-generation.yml`

**Inputs**:

| Input | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `prompt` | string | Yes | - | Natural language description of code to generate |

**Optional Configuration** (via `claude_args`):
- `--model`: Model to use (e.g., `claude-sonnet-4-5-20250929`, `claude-opus-4-5-20251101`)
- `--max-turns`: Maximum conversation turns (default: 10)
- `--system-prompt`: Custom instructions for Claude

**Validation**:
- `prompt` MUST be non-empty (workflow fails if empty)

**Example**:
```yaml
on:
  workflow_dispatch:
    inputs:
      prompt:
        description: 'Code generation prompt'
        required: true
        type: string
```

## Claude Code Action Interface

**Action**: `anthropics/claude-code-action@v1`

**Location**: https://github.com/marketplace/actions/claude-code-action

### Action Parameters

| Parameter | Description | Required | Default |
|-----------|-------------|----------|---------|
| `prompt` | Instructions for Claude (text or slash command) | No* | - |
| `claude_args` | CLI arguments passed to Claude Code | No | - |
| `anthropic_api_key` | Claude API key | Yes** | - |
| `github_token` | GitHub token for API access | No | `GITHUB_TOKEN` |
| `trigger_phrase` | Custom trigger phrase (default: "@claude") | No | "@claude" |
| `use_bedrock` | Use AWS Bedrock instead of Claude API | No | `false` |
| `use_vertex` | Use Google Vertex AI instead of Claude API | No | `false` |

*Prompt is optional - when omitted for issue/PR comments, Claude responds to trigger phrase  
**Required for direct Claude API, not for Bedrock/Vertex

### Basic Workflow Contract

```yaml
name: LLM Code Generation

on:
  workflow_dispatch:
    inputs:
      prompt:
        description: 'Code generation prompt'
        required: true
        type: string

permissions:
  contents: write
  pull-requests: write
  issues: write

jobs:
  generate-code:
    runs-on: ubuntu-latest
    steps:
      - uses: anthropics/claude-code-action@v1
        with:
          prompt: ${{ inputs.prompt }}
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          claude_args: |
            --model claude-sonnet-4-5-20250929
            --max-turns 10
```

### Action Behavior

**What Claude Code Action Does**:
1. Validates input (prompt processing)
2. Calls Claude API (or AWS Bedrock/Google Vertex AI)
3. Generates code based on prompt
4. Creates branch automatically
5. Commits generated code
6. Pushes branch to remote
7. Creates pull request with title and description

**All operations handled internally** - no manual Git commands or PR creation needed.

## GitHub App Authentication (Optional)

**Interface**: GitHub App for enhanced permissions and branded usernames

**Setup**: Install Claude GitHub App at https://github.com/apps/claude

**Required Permissions**:
- **Contents**: Read & write (to modify repository files)
- **Issues**: Read & write (to respond to issues)
- **Pull requests**: Read & write (to create PRs and push changes)

**Alternative**: Use `GITHUB_TOKEN` (default) for basic authentication

## Workflow Output Contract

**Interface**: Workflow Execution Results

**Outputs** (handled by Claude Code Action):

| Output | Type | Description |
|--------|------|-------------|
| `pr_number` | number | GitHub PR number (if PR created successfully) |
| `pr_url` | string | URL to created PR |
| `branch_name` | string | Name of created branch |

**Success Criteria**:
- Workflow completes with exit code 0
- Branch created and pushed (handled by Claude Code Action)
- PR created (handled by Claude Code Action)

**Failure Cases**:
- Exit code 1: Input validation failed or Claude Code Action error
- Exit code 2: API authentication error
- Exit code 3: Code generation failed

## LLM Provider Contracts

### Claude API (Default)

**Provider**: Direct Claude API

**Configuration**:
```yaml
anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
claude_args: --model claude-sonnet-4-5-20250929
```

**Secret**: `ANTHROPIC_API_KEY` in GitHub Secrets

### AWS Bedrock

**Provider**: AWS Bedrock

**Configuration**:
```yaml
use_bedrock: "true"
claude_args: --model us.anthropic.claude-sonnet-4-5-20250929-v1:0
```

**Prerequisites**:
- AWS Bedrock access configured
- OIDC authentication for GitHub Actions
- IAM role with Bedrock permissions

**Secrets Required**:
- `AWS_ROLE_TO_ASSUME`: ARN of IAM role
- `APP_ID`: GitHub App ID (if using GitHub App)
- `APP_PRIVATE_KEY`: GitHub App private key

### Google Vertex AI

**Provider**: Google Cloud Vertex AI

**Configuration**:
```yaml
use_vertex: "true"
claude_args: --model claude-sonnet-4@20250514
```

**Prerequisites**:
- Vertex AI API enabled in GCP project
- Workload Identity Federation configured
- Service account with Vertex AI permissions

**Secrets Required**:
- `GCP_WORKLOAD_IDENTITY_PROVIDER`: Workload identity provider resource name
- `GCP_SERVICE_ACCOUNT`: Service account email
- `APP_ID`: GitHub App ID (if using GitHub App)
- `APP_PRIVATE_KEY`: GitHub App private key

## Error Contract

**Interface**: Workflow Error Messages

**Error Format**: Clear, actionable error messages from Claude Code Action

**Error Types**:
1. **Input Validation Error**: "Prompt is required and cannot be empty"
2. **API Authentication Error**: "Invalid API key" or "Authentication failed"
3. **Code Generation Error**: "Failed to generate code" with details
4. **Git Operation Error**: "Failed to create branch" or "Failed to push changes"
5. **PR Creation Error**: "Failed to create PR" with details

**Error Visibility**: Errors displayed in GitHub Actions workflow logs

## CLAUDE.md Configuration

**Interface**: Project-specific configuration file

**Location**: `CLAUDE.md` at repository root

**Purpose**: Define coding standards, review criteria, and project-specific rules that Claude should follow

**Example**:
```markdown
# Project Guidelines

## Code Style
- Use TypeScript strict mode
- Follow NestJS conventions
- Write tests for all new features

## Review Criteria
- Check for security vulnerabilities
- Verify error handling
- Ensure proper logging
```

Claude Code Action automatically reads and follows `CLAUDE.md` when generating code.

## Trigger Modes

### Automation Mode (workflow_dispatch)

**Trigger**: Manual workflow dispatch with prompt input

**Usage**: User provides prompt via GitHub Actions UI

**Example**:
```yaml
on:
  workflow_dispatch:
    inputs:
      prompt:
        description: 'Code generation prompt'
        required: true
```

### Interactive Mode (@claude mentions)

**Trigger**: `@claude` mention in issue or PR comment

**Usage**: Users mention `@claude` in comments to trigger code generation

**Example**:
```yaml
on:
  issue_comment:
    types: [created]
  pull_request_review_comment:
    types: [created]
```

Claude Code Action automatically detects mode based on configuration.
