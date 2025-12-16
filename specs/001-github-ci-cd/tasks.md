# Tasks: GitHub CI/CD Pipeline

**Input**: Design documents from `/specs/001-github-ci-cd/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Tests**: Tests are NOT requested in the feature specification. Workflow execution itself serves as validation.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Infrastructure/DevOps**: `.github/workflows/` at repository root
- Single workflow file structure per plan.md

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create workflow directory structure and initialize workflow file

- [x] T001 Create `.github/workflows/` directory structure at repository root
- [x] T002 Initialize workflow file `.github/workflows/ci-cd.yml` with basic workflow structure (name, empty jobs section)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Configure workflow triggers and basic job structure

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 Configure workflow triggers (push to all branches, pull_request events) in `.github/workflows/ci-cd.yml`
- [x] T004 Define three job structure (test, build, deploy) with empty steps in `.github/workflows/ci-cd.yml`
- [x] T005 Configure job dependencies (build needs test, deploy needs build) in `.github/workflows/ci-cd.yml`

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Automated Testing on Code Changes (Priority: P1) 🎯 MVP

**Goal**: Implement test job that runs unit tests and e2e tests automatically on code push and pull requests

**Independent Test**: Push code to any branch and verify that tests execute automatically in GitHub Actions. Check PR status checks display test results.

### Implementation for User Story 1

- [x] T006 [US1] Configure test job with `runs-on: ubuntu-latest` in `.github/workflows/ci-cd.yml`
- [x] T007 [US1] Add checkout step to test job in `.github/workflows/ci-cd.yml`
- [x] T008 [US1] Add Node.js setup step (version 20.x) to test job in `.github/workflows/ci-cd.yml`
- [x] T009 [US1] Add pnpm setup step with cache configuration to test job in `.github/workflows/ci-cd.yml`
- [x] T010 [US1] Add install dependencies step (`pnpm install`) to test job in `.github/workflows/ci-cd.yml`
- [x] T011 [US1] Add run unit tests step (`pnpm test`) with clear step name to test job in `.github/workflows/ci-cd.yml`
- [x] T012 [US1] Add run e2e tests step (`pnpm test:e2e`) with clear step name to test job in `.github/workflows/ci-cd.yml`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently. Push code to trigger workflow and verify tests run automatically.

---

## Phase 4: User Story 2 - Automated Build on Successful Tests (Priority: P2)

**Goal**: Implement build job that builds the application after tests pass, producing deployable artifacts

**Independent Test**: Ensure tests pass, then verify that build step executes and produces build artifacts in dist/ directory.

### Implementation for User Story 2

- [x] T013 [US2] Configure build job with `runs-on: ubuntu-latest` and `needs: test` in `.github/workflows/ci-cd.yml`
- [x] T014 [US2] Add checkout step to build job in `.github/workflows/ci-cd.yml`
- [x] T015 [US2] Add Node.js setup step (version 20.x) to build job in `.github/workflows/ci-cd.yml`
- [x] T016 [US2] Add pnpm setup step with cache configuration to build job in `.github/workflows/ci-cd.yml`
- [x] T017 [US2] Add install dependencies step (`pnpm install`) to build job in `.github/workflows/ci-cd.yml`
- [x] T018 [US2] Add build application step (`pnpm build`) with clear step name to build job in `.github/workflows/ci-cd.yml`
- [x] T019 [US2] Add upload build artifacts step (optional, for deployment) to build job in `.github/workflows/ci-cd.yml`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently. Verify build executes after tests pass and produces artifacts.

---

## Phase 5: User Story 3 - Deployment Step Structure (Priority: P3)

**Goal**: Implement deployment job structure as placeholder that can be configured for any deployment target

**Independent Test**: Verify that after successful build, deployment step structure exists in workflow (even if placeholder/no-op). Workflow should complete successfully.

### Implementation for User Story 3

- [x] T020 [US3] Configure deploy job with `runs-on: ubuntu-latest` and `needs: build` in `.github/workflows/ci-cd.yml`
- [x] T021 [US3] Add deployment placeholder step with clear message to deploy job in `.github/workflows/ci-cd.yml`

**Checkpoint**: All user stories should now be independently functional. Complete CI/CD pipeline structure exists and is ready for deployment configuration when needed.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements and validation

- [x] T022 [P] Validate workflow YAML syntax and structure
- [x] T023 [P] Add workflow comments for clarity and maintainability in `.github/workflows/ci-cd.yml`
- [ ] T024 Test complete workflow end-to-end by pushing code and verifying all jobs execute sequentially
- [ ] T025 Verify workflow status appears in pull request checks
- [ ] T026 Verify error messages are clear when workflow fails (test by introducing intentional failure)
- [ ] T027 Update README.md with workflow documentation (optional, if repository has README)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories MUST proceed sequentially (P1 → P2 → P3) due to job dependencies
  - Cannot run in parallel due to sequential job requirements (test → build → deploy)
- **Polish (Final Phase)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: MUST start after User Story 1 completes - Build job depends on test job
- **User Story 3 (P3)**: MUST start after User Story 2 completes - Deploy job depends on build job

### Within Each User Story

- Steps within a job MUST execute sequentially
- Setup steps before execution steps
- Checkout before environment setup
- Environment setup before dependency installation
- Dependency installation before execution

### Parallel Opportunities

- **Phase 1**: T001 and T002 can run sequentially (T002 depends on T001)
- **Phase 2**: T003, T004, T005 can run sequentially (all modify same file)
- **Phase 3**: Steps T006-T012 must run sequentially (all modify same workflow file)
- **Phase 4**: Steps T013-T019 must run sequentially (all modify same workflow file)
- **Phase 5**: Steps T020-T021 must run sequentially (all modify same workflow file)
- **Phase 6**: T022 and T023 can run in parallel (validation and comments are independent)

**Note**: Due to single workflow file structure, most tasks modify the same file and cannot run in parallel. However, validation and documentation tasks can run in parallel.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Test Job)
4. **STOP and VALIDATE**: Push code and verify tests run automatically
5. Verify workflow appears in PR checks

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 (Test Job) → Test independently → Verify tests run on push/PR (MVP!)
3. Add User Story 2 (Build Job) → Test independently → Verify build executes after tests
4. Add User Story 3 (Deploy Job) → Test independently → Verify complete pipeline
5. Each story adds value without breaking previous stories

### Sequential Execution Required

Due to workflow job dependencies (test → build → deploy), stories MUST be implemented sequentially:
- User Story 1 must complete before User Story 2 can start
- User Story 2 must complete before User Story 3 can start
- This is by design - jobs depend on each other in the workflow

---

## Notes

- [P] tasks = different files or independent operations, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently testable (push code and verify workflow behavior)
- Commit after each phase completion
- Stop at any checkpoint to validate story independently
- Workflow file is single file - tasks modify same file sequentially
- Validation: Push code to trigger workflow and verify expected behavior
- Error testing: Introduce intentional failure to verify error messages are clear

