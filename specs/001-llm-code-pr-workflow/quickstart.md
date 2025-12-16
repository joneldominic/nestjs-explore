# Quickstart: LLM Code Generation Workflow

**Feature**: LLM Code Generation Workflow  
**Date**: 2025-01-27

## Overview

This guide explains how to use the GitHub Actions workflow for automated code generation using LLM APIs. The workflow accepts a prompt, generates code, commits it to a branch, and creates a pull request.

## Prerequisites

- GitHub repository with GitHub Actions enabled
- LLM API credentials configured as GitHub Secrets
- Repository write permissions for workflow (to create branches and PRs)

## Setup

### Quick Setup (Recommended)

The easiest way to set up Claude Code GitHub Actions is via Claude Code terminal:

1. Open Claude Code in terminal
2. Run `/install-github-app`
3. Follow the guided setup process

This will:
- Install the Claude GitHub App
- Configure required secrets
- Set up the workflow file

**Prerequisites**:
- You must be a repository admin
- GitHub App will request read & write permissions for Contents, Issues, and Pull requests

**Reference**: https://code.claude.com/docs/en/github-actions#quick-setup

### Manual Setup

If you prefer manual setup or `/install-github-app` fails:

#### 1. Install Claude GitHub App

1. Go to https://github.com/apps/claude
2. Click "Install" and select your repository
3. Grant permissions:
   - **Contents**: Read & write
   - **Issues**: Read & write
   - **Pull requests**: Read & write

#### 2. Add API Key Secret

1. Go to repository Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Name: `ANTHROPIC_API_KEY`
4. Value: Your Anthropic API key
5. Click "Add secret"

#### 3. Create Workflow File

Create `.github/workflows/llm-code-generation.yml` with:

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

**Reference**: https://code.claude.com/docs/en/github-actions#manual-setup

## How to Use

### Manual Trigger via GitHub UI

1. Navigate to your repository on GitHub
2. Click on the **Actions** tab
3. Select **LLM Code Generation** workflow from the left sidebar
4. Click **Run workflow** button (top right)
5. Fill in the form:
   - **Prompt** (required): Describe the code you want to generate
     - Example: "Add a user authentication service with login and register endpoints"
   - **LLM Provider** (optional): Choose provider (default: openai)
   - **LLM Model** (optional): Specify model (default: gpt-4)
   - **Target Branch** (optional): Base branch for PR (default: main)
6. Click **Run workflow**

### Workflow Execution Flow

Claude Code Action handles all steps internally:

```
1. Validate Input (prompt processing)
   ↓
2. Call Claude API with prompt
   ↓
3. Generate code based on prompt
   ↓
4. Create branch automatically
   ↓
5. Commit generated code
   ↓
6. Push branch to remote
   ↓
7. Create pull request with title and description
   ↓
8. Complete
```

**All operations handled by Claude Code Action** - no manual steps needed.

### Example Prompts

**Good Prompts**:
- "Add a todo service with CRUD operations"
- "Create a user DTO with email and name validation"
- "Implement a logger service using NestJS Logger"

**Tips for Better Results**:
- Be specific about what you want
- Mention the framework/language (e.g., "NestJS", "TypeScript")
- Include context about existing code structure if relevant
- Keep prompts under 500 words for optimal performance

## Viewing Results

### Workflow Run Status

1. Go to **Actions** tab
2. Click on the workflow run
3. View step-by-step execution:
   - ✅ Green checkmark = step succeeded
   - ❌ Red X = step failed
   - ⏳ Yellow circle = step in progress

### Generated Pull Request

After workflow completes:

1. Go to **Pull requests** tab
2. Find PR with title matching your prompt
3. Review generated code
4. PR description includes:
   - Original prompt
   - List of files changed
   - Generated code diff

### Branch Created

The workflow creates a branch with format:
```
llm-{sanitized-prompt}-{timestamp}
```

Example: `llm-add-user-authentication-20250127-143022`

## Understanding Workflow Failures

### Input Validation Error

**Symptom**: Workflow fails immediately at "Validate Input" step

**Cause**: Prompt is empty or invalid

**Solution**: Provide a non-empty prompt

### LLM API Error

**Symptom**: Workflow fails with authentication or API error

**Possible Causes**:
- Invalid API key
- API quota exhausted
- Network error
- Invalid model name

**Solutions**:
1. Check GitHub Secret `ANTHROPIC_API_KEY` is correctly configured
2. Verify API key is valid and has quota
3. Check Anthropic API status page
4. Try different model in `claude_args` if specified

**Error Message Example**:
```
Error: Authentication failed. Check API key.
```

### Code Generation Error

**Symptom**: Workflow fails during code generation

**Cause**: Claude Code Action unable to generate code from prompt

**Solution**: 
- Refine prompt with clearer instructions
- Check workflow logs for detailed error message
- Ensure prompt is specific and actionable

### Git Operation Error

**Symptom**: Workflow fails at "Create Branch", "Commit", or "Push" step

**Possible Causes**:
- Insufficient repository permissions
- Branch name conflict (should be handled automatically)
- Git configuration error

**Solutions**:
1. Verify workflow has write permissions
2. Check GitHub Actions settings → General → Workflow permissions
3. Ensure "Read and write permissions" is enabled

### PR Creation Error

**Symptom**: Workflow completes but PR creation fails

**Note**: Code is still committed to branch even if PR creation fails

**Possible Causes**:
- PR already exists for branch
- Insufficient permissions
- GitHub API error

**Solutions**:
1. Check if PR already exists (workflow may skip creation)
2. Verify repository permissions
3. Manually create PR from the generated branch if needed

**Error Message Example**:
```
Warning: Failed to create PR: PR already exists. Code committed to branch llm-...
```

## Advanced Usage

### Using Different LLM Providers

**Claude API (Default)**:
- Provider: Direct Claude API
- Model: `claude-sonnet-4-5-20250929`, `claude-opus-4-5-20251101`, etc.
- Secret: `ANTHROPIC_API_KEY`
- Configuration: Default (no special flags)

**AWS Bedrock**:
- Provider: AWS Bedrock
- Model: `us.anthropic.claude-sonnet-4-5-20250929-v1:0`
- Configuration: `use_bedrock: "true"` + AWS OIDC setup
- Reference: https://code.claude.com/docs/en/github-actions#for-aws-bedrock

**Google Vertex AI**:
- Provider: Google Cloud Vertex AI
- Model: `claude-sonnet-4@20250514`
- Configuration: `use_vertex: "true"` + GCP Workload Identity
- Reference: https://code.claude.com/docs/en/github-actions#for-google-cloud-vertex-ai

### Customizing Target Branch

Specify `target_branch` input to create PR against different branch:
- `target_branch: develop` - Creates PR to develop branch
- `target_branch: feature/xyz` - Creates PR to feature branch

### Programmatic Trigger (GitHub API)

Trigger workflow via GitHub API:

```bash
curl -X POST \
  -H "Authorization: token YOUR_GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/OWNER/REPO/actions/workflows/llm-code-generation.yml/dispatches \
  -d '{
    "ref": "main",
    "inputs": {
      "prompt": "Add user authentication service"
    }
  }'
```

### Using @claude Mentions (Interactive Mode)

You can also trigger Claude Code via `@claude` mentions in issues or PR comments:

1. Create an issue or comment on a PR
2. Mention `@claude` with your request
3. Claude Code Action will automatically respond and create PR if needed

**Example**: Comment `@claude add user authentication service` in an issue.

## Best Practices

1. **Review Generated Code**: Always review PR before merging - workflow behaves like junior dev
2. **Clear Prompts**: Be specific and include context for better code generation
3. **Test Generated Code**: Run tests and verify functionality before merging
4. **Handle Conflicts**: If conflicts occur, resolve manually in PR
5. **Monitor API Usage**: Track LLM API quota to avoid unexpected failures
6. **Iterate on Prompts**: If first attempt doesn't work, refine prompt and retry

## Troubleshooting

### Workflow Not Appearing

- Check workflow file exists at `.github/workflows/llm-code-generation.yml`
- Verify YAML syntax is valid
- Check workflow file is committed to default branch

### API Key Not Found

- Verify secret name matches provider (e.g., `LLM_API_KEY_OPENAI`)
- Check secret is added to repository (not organization-level)
- Ensure secret is not misspelled

### Generated Code Quality Issues

- Refine prompt with more specific instructions
- Include examples or reference existing code patterns
- Break down complex requests into smaller prompts
- Review and manually edit PR before merging

### Performance Issues

- Large prompts (>500 words) may take longer
- Complex code generation may exceed token limits
- Consider splitting into multiple smaller workflows

## Security Considerations

⚠️ **Important**: This is a POC workflow with no access control restrictions.

- **Review All Generated Code**: Never merge PRs without review
- **Check for Secrets**: Generated code might include sensitive data - review carefully
- **Validate File Paths**: Ensure generated files don't escape repository boundaries
- **Monitor API Usage**: Track API costs and quota
- **Limit Access**: Consider restricting workflow access in production use

## Next Steps

After workflow completes:

1. Review the generated PR
2. Test the generated code
3. Make manual edits if needed
4. Merge PR when satisfied
5. Or close PR if code doesn't meet requirements

The workflow is designed to assist, not replace, human code review and testing.

