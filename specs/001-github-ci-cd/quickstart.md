# Quickstart: GitHub CI/CD Pipeline

**Feature**: GitHub CI/CD Pipeline  
**Date**: 2025-01-27

## Overview

This guide explains how to use and configure the GitHub Actions CI/CD workflow for the NestJS application.

## Prerequisites

- GitHub repository with GitHub Actions enabled
- Repository contains NestJS application code
- `package.json` with test and build scripts configured
- `pnpm-lock.yaml` exists (or workflow will be updated to use npm/yarn)

## Workflow Location

The workflow file is located at:
```
.github/workflows/ci-cd.yml
```

## How It Works

The workflow automatically runs when:
1. Code is pushed to any branch
2. A pull request is created or updated

The workflow executes three jobs sequentially:
1. **Test**: Runs unit tests and e2e tests
2. **Build**: Builds the application
3. **Deploy**: Deployment step (placeholder, configurable later)

## Workflow Execution Flow

```
Push/PR Event
    ↓
Test Job
    ├─ Setup Node.js & pnpm
    ├─ Install dependencies
    ├─ Run unit tests
    └─ Run e2e tests
    ↓ (if tests pass)
Build Job
    ├─ Setup Node.js & pnpm
    ├─ Install dependencies
    └─ Build application
    ↓ (if build succeeds)
Deploy Job
    └─ Deployment placeholder
    ↓
Workflow Complete
```

## Viewing Workflow Results

### In GitHub Web Interface

1. Navigate to your repository on GitHub
2. Click on the **Actions** tab
3. Select the workflow run from the list
4. View individual job and step results

### In Pull Requests

1. Open a pull request
2. Scroll to the bottom to see **Checks** section
3. View workflow status and test results
4. Green checkmark = all tests passed
5. Red X = tests or build failed

## Understanding Workflow Failures

### Test Failures

**Symptom**: Test job fails, build and deploy jobs are skipped

**What to do**:
1. Click on the failed workflow run
2. Expand the "Run unit tests" or "Run e2e tests" step
3. Review test output and error messages
4. Fix failing tests locally
5. Push fixes to trigger workflow again

### Build Failures

**Symptom**: Build job fails, deploy job is skipped

**What to do**:
1. Click on the failed workflow run
2. Expand the "Build application" step
3. Review build errors (TypeScript compilation errors, etc.)
4. Fix build issues locally
5. Push fixes to trigger workflow again

### Deployment Failures

**Symptom**: Deploy job fails (when configured)

**What to do**:
1. Click on the failed workflow run
2. Expand the deployment step
3. Review deployment errors
4. Check deployment target configuration
5. Verify secrets/credentials are configured correctly

## Configuring the Workflow

### Changing Node.js Version

Edit `.github/workflows/ci-cd.yml`:

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: '20'  # Change to desired version
```

### Changing Package Manager

If switching from pnpm to npm or yarn:

1. Update workflow file to use appropriate setup action
2. Update install command in workflow steps
3. Update cache configuration

### Adding Environment Variables

Add to job or step:

```yaml
env:
  NODE_ENV: production
  CUSTOM_VAR: ${{ secrets.CUSTOM_SECRET }}
```

### Configuring Deployment Step

When ready to configure deployment:

1. Edit `.github/workflows/ci-cd.yml`
2. Replace deployment placeholder step with actual deployment logic
3. Configure deployment target (Docker registry, cloud platform, etc.)
4. Add required secrets to GitHub repository settings

## Local Testing

Before pushing, test locally:

```bash
# Run tests
pnpm test
pnpm test:e2e

# Build application
pnpm build

# Verify build output
ls -la dist/
```

If these commands succeed locally, the workflow should succeed.

## Troubleshooting

### Workflow Not Running

**Check**:
- Workflow file is in `.github/workflows/` directory
- File has `.yml` or `.yaml` extension
- YAML syntax is valid
- Workflow triggers are configured correctly

### Tests Pass Locally But Fail in Workflow

**Check**:
- Node.js version matches local environment
- Dependencies are installed correctly
- Environment variables are set (if needed)
- Test database/connections (if e2e tests require them)

### Build Succeeds Locally But Fails in Workflow

**Check**:
- Node.js version matches
- TypeScript version compatibility
- Build output directory matches expectations
- File permissions (if applicable)

## Next Steps

1. **Monitor workflow runs**: Check Actions tab regularly
2. **Fix failures promptly**: Don't let failing workflows accumulate
3. **Configure deployment**: When ready, replace deployment placeholder with actual deployment logic
4. **Add notifications**: Configure GitHub notifications for workflow failures (optional)

## Support

For issues with:
- **GitHub Actions**: See [GitHub Actions Documentation](https://docs.github.com/en/actions)
- **Workflow configuration**: Review workflow file comments
- **Application code**: See application README.md

