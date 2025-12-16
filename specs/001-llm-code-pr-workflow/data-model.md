# Data Model: LLM Code Generation Workflow

**Feature**: LLM Code Generation Workflow  
**Date**: 2025-01-27

## Overview

This feature is infrastructure/DevOps configuration (GitHub Actions workflow), not application code. The "data model" here represents the workflow configuration structure, input/output entities, and data flow.

## Workflow Configuration Entity

### Workflow File Structure

**Entity**: GitHub Actions Workflow Configuration

**Location**: `.github/workflows/llm-code-generation.yml`

**Structure**:
- **name**: Workflow display name
- **on**: Trigger events (workflow_dispatch with inputs)
- **jobs**: Collection of jobs (single job: generate-code-and-pr)
- **env**: Environment variables (LLM API configuration)

**Properties**:
- `name` (string): Human-readable workflow name
- `on.workflow_dispatch.inputs.prompt` (string): User-provided prompt for code generation
- `on.workflow_dispatch.inputs.llm_provider` (string, optional): LLM provider (openai/anthropic, default: openai)
- `on.workflow_dispatch.inputs.llm_model` (string, optional): LLM model name (default: gpt-4)
- `on.workflow_dispatch.inputs.target_branch` (string, optional): Target branch for PR (default: main)
- `jobs.generate-code-and-pr` (object): Single job executing all steps

## Workflow Input Entity

**Entity**: Workflow Input

**Properties**:
- `prompt` (string, required): Natural language description of code to generate
- `llm_provider` (string, optional): LLM service provider (openai/anthropic/etc.)
- `llm_model` (string, optional): Specific model to use (gpt-4/claude-3/etc.)
- `target_branch` (string, optional): Base branch for PR creation (default: main/master)

**Validation Rules**:
- Prompt MUST be non-empty (FR-002)
- Prompt length SHOULD be under 500 words for optimal performance (SC-002)
- LLM provider MUST be supported (configurable list)
- Target branch MUST exist in repository

## LLM API Request Entity

**Entity**: LLM API Request

**Properties**:
- `prompt` (string): User prompt enhanced with format instructions
- `model` (string): LLM model identifier
- `max_tokens` (number, optional): Maximum response length
- `temperature` (number, optional): Creativity/randomness (default: 0.7)

**Format**: Provider-specific (OpenAI uses `messages` array, Anthropic uses `messages` array)

**Enhanced Prompt Template**:
```
{user_prompt}

Return the generated code as a JSON object with this structure:
{
  "files": [
    {
      "path": "relative/file/path.ts",
      "content": "code content here"
    }
  ]
}
```

## LLM API Response Entity

**Entity**: LLM API Response

**Properties**:
- `files` (array): Array of file objects
  - `path` (string): Relative file path from repository root
  - `content` (string): Code content for the file

**Format**: JSON object matching structure requested in prompt

**Example**:
```json
{
  "files": [
    {
      "path": "src/todo/dto/create-todo.dto.ts",
      "content": "export class CreateTodoDto {\n  title: string;\n}"
    },
    {
      "path": "src/todo/todo.service.ts",
      "content": "export class TodoService {\n  // implementation\n}"
    }
  ]
}
```

**Validation Rules**:
- Response MUST be valid JSON
- `files` array MUST be present
- Each file MUST have `path` and `content`
- File paths MUST be relative (no absolute paths)
- File paths MUST not escape repository root (security)

## Generated Branch Entity

**Entity**: Generated Branch

**Properties**:
- `name` (string): Sanitized branch name with timestamp
- `base` (string): Base branch name (from which branch is created)
- `exists` (boolean): Whether branch already exists (for conflict handling)

**Naming Rules**:
- Format: `llm-{sanitized-prompt}-{timestamp}`
- Sanitization: lowercase, spaces→hyphens, special chars→hyphens, max 50 chars
- Timestamp: `YYYYMMDD-HHMMSS` (e.g., `20250127-143022`)
- Example: `llm-add-user-authentication-20250127-143022`

**Uniqueness**: Timestamp ensures uniqueness even for identical prompts

## Pull Request Entity

**Entity**: Pull Request

**Properties**:
- `title` (string): PR title generated from prompt
- `body` (string): PR description with prompt and file summary
- `head` (string): Source branch (generated branch)
- `base` (string): Target branch (default: main/master)
- `number` (number): PR number assigned by GitHub (after creation)

**Title Generation**:
- Sanitize prompt (same as branch name sanitization)
- Take first 50 characters
- Add "..." if truncated
- Example: "Add user authentication feature..."

**Body Template**:
```markdown
## Generated Code

**Prompt**: {original_prompt}

**Files Changed**:
- {file1_path}
- {file2_path}
...
```

## Workflow Step Entities

### Step: Validate Input

**Entity**: Validation Step

**Input**: Workflow input (prompt)
**Output**: Validation result (pass/fail)
**Error Handling**: Fail workflow if prompt is empty

### Step: Call LLM API

**Entity**: LLM API Call Step

**Input**: Enhanced prompt, API credentials, model configuration
**Output**: LLM API Response (JSON)
**Error Handling**: Retry on 429/5xx, fail on 401/403/400

### Step: Parse Response

**Entity**: Response Parsing Step

**Input**: LLM API Response (JSON string)
**Output**: Parsed files array
**Error Handling**: Fail if JSON invalid or structure incorrect

### Step: Create Branch

**Entity**: Branch Creation Step

**Input**: Sanitized branch name, base branch
**Output**: Branch reference
**Error Handling**: Fail if branch creation fails (permissions, etc.)

### Step: Write Files

**Entity**: File Writing Step

**Input**: Parsed files array, repository checkout
**Output**: Files created/updated in workspace
**Error Handling**: Proceed even if files conflict (like junior dev)

### Step: Commit Changes

**Entity**: Commit Step

**Input**: Modified files in workspace
**Output**: Git commit hash
**Error Handling**: Fail if commit fails (no changes, etc.)

### Step: Push Branch

**Entity**: Push Step

**Input**: Local branch, remote repository
**Output**: Remote branch reference
**Error Handling**: Fail if push fails (permissions, conflicts)

### Step: Create PR

**Entity**: PR Creation Step

**Input**: Branch name, PR title, PR body, target branch
**Output**: PR number
**Error Handling**: Fail gracefully (code remains committed even if PR creation fails)

## Workflow State Transitions

```
[Triggered] 
  → [Input Validated]
  → [LLM API Called]
  → [Response Parsed]
  → [Branch Created]
  → [Files Written]
  → [Changes Committed]
  → [Branch Pushed]
  → [PR Created]
  → [Complete]

Any step can transition to [Failed] state with error message.
```

## Data Flow

```
User Input (prompt)
  ↓
Workflow Input Entity
  ↓
Enhanced Prompt (with JSON format instructions)
  ↓
LLM API Request Entity
  ↓
LLM API Response Entity (JSON)
  ↓
Parsed Files Array
  ↓
Generated Branch Entity (created)
  ↓
Files Written to Workspace
  ↓
Git Commit
  ↓
Branch Pushed to Remote
  ↓
Pull Request Entity (created)
  ↓
PR Number Returned
```





