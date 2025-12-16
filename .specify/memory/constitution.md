<!--
Sync Impact Report:
Version change: N/A → 1.0.0 (initial constitution)
Modified principles: N/A (all new)
Added sections: Core Principles (7 principles), Architecture Constraints, Development Workflow, Governance
Removed sections: N/A
Templates requiring updates:
  ✅ plan-template.md - Constitution Check section references constitution principles
  ✅ spec-template.md - Aligned with TDD and DDD principles
  ✅ tasks-template.md - Task organization aligns with DDD and TDD principles
Follow-up TODOs: None
-->

# NestJS Explore Constitution

## Core Principles

### I. Domain-Driven Design (DDD)

All code MUST be organized around domain concepts, not technical layers. Each domain module MUST be self-contained with its own entities, value objects, domain services, repositories, and application services. Domain logic MUST reside in domain entities and domain services, never in infrastructure or application layers. Bounded contexts MUST be clearly defined and communicated through module boundaries. Ubiquitous language MUST be used consistently across code, tests, and documentation.

**Rationale**: DDD ensures the codebase reflects business reality, making it easier to understand, maintain, and evolve. Clear domain boundaries prevent coupling and enable independent development of features.

### II. Clean Architecture Layers

Code MUST be organized into distinct layers with clear dependency rules: Domain (innermost, no dependencies), Application (depends only on Domain), Infrastructure (depends on Application and Domain), and Presentation (depends on Application and Domain). Dependencies MUST point inward only—outer layers depend on inner layers, never the reverse. Use cases MUST be implemented in the Application layer as application services. Infrastructure concerns (databases, external APIs, frameworks) MUST be isolated in the Infrastructure layer.

**Rationale**: Clean Architecture ensures business logic remains independent of frameworks and infrastructure, enabling easier testing, maintenance, and technology migration. The dependency rule prevents coupling and preserves domain integrity.

### III. Test-Driven Development (TDD) (NON-NEGOTIABLE)

TDD MUST be strictly followed: Red-Green-Refactor cycle is mandatory. Tests MUST be written before implementation code. All new features MUST start with failing tests. Tests MUST be written at multiple levels: unit tests for domain logic and application services, integration tests for use cases, and e2e tests for API endpoints. Test coverage MUST maintain minimum 80% for domain and application layers. All tests MUST be independent, fast, and deterministic.

**Rationale**: TDD ensures code correctness, drives better design through testability requirements, and provides living documentation. Writing tests first forces clear thinking about requirements and interfaces.

### IV. Clean Code Standards

Code MUST be self-documenting through meaningful names, small functions (single responsibility), and clear structure. Functions MUST do one thing and do it well. Classes MUST have a single reason to change (Single Responsibility Principle). Magic numbers and strings MUST be extracted to named constants. Code duplication MUST be eliminated through abstraction, not copy-paste. Comments MUST explain "why", not "what"—code should be clear enough that "what" is obvious.

**Rationale**: Clean Code reduces cognitive load, makes code easier to understand and modify, and reduces bugs. Well-named code serves as documentation and reduces maintenance costs.

### V. Dependency Injection and Inversion of Control

All dependencies MUST be injected through constructors or NestJS dependency injection. Services MUST depend on abstractions (interfaces), not concrete implementations. Infrastructure implementations MUST implement domain-defined interfaces. Application services MUST orchestrate domain logic through injected domain services and repositories.

**Rationale**: Dependency Injection enables testability, flexibility, and loose coupling. Depending on abstractions allows swapping implementations without changing business logic, critical for testing and future changes.

### VI. Domain Model Integrity

Domain entities MUST encapsulate business logic and enforce invariants. Value objects MUST be immutable and represent domain concepts without identity. Domain events MUST be used to communicate significant business occurrences. Aggregates MUST maintain consistency boundaries and be the unit of transaction. Anemic domain models (entities with only data, no behavior) are FORBIDDEN.

**Rationale**: Rich domain models ensure business rules are enforced at the domain level, preventing invalid states and making the codebase a true reflection of business requirements. Encapsulation protects domain integrity.

### VII. Module Organization and Boundaries

Each domain module MUST follow NestJS module structure but MUST respect Clean Architecture layers within. Module structure: `domain/` (entities, value objects, domain services, interfaces), `application/` (use cases, DTOs, application services), `infrastructure/` (repositories, external services, framework adapters), `presentation/` (controllers, DTOs for API). Cross-module communication MUST occur through well-defined interfaces or domain events, never direct dependencies.

**Rationale**: Clear module boundaries prevent coupling between domains and enable independent evolution. NestJS modules provide dependency injection boundaries while Clean Architecture provides logical separation.

## Architecture Constraints

### Layer Dependencies

- Domain layer MUST have zero external dependencies (except standard library and domain primitives)
- Application layer MUST only depend on Domain layer
- Infrastructure layer MUST implement Domain interfaces and depend on Application layer
- Presentation layer (controllers) MUST depend on Application layer, not Infrastructure
- NestJS decorators and framework code MUST be isolated to Infrastructure and Presentation layers

### Technology Stack

- **Framework**: NestJS v11.x (as specified in package.json)
- **Language**: TypeScript with strict mode enabled
- **Testing**: Jest for unit and integration tests, Supertest for e2e tests
- **Validation**: class-validator for DTO validation
- **Error Handling**: NestJS exception filters with domain-specific exceptions

### Domain Module Structure

Each domain module MUST follow this structure:

```
src/[domain]/
├── domain/
│   ├── entities/          # Domain entities with business logic
│   ├── value-objects/     # Immutable value objects
│   ├── services/          # Domain services (stateless business logic)
│   ├── interfaces/        # Repository and service interfaces
│   └── events/            # Domain events
├── application/
│   ├── use-cases/        # Application use cases (orchestration)
│   ├── dto/              # Application DTOs
│   └── services/         # Application services
├── infrastructure/
│   ├── persistence/      # Repository implementations
│   └── external/          # External service adapters
└── presentation/
    ├── controllers/       # REST controllers
    └── dto/              # Presentation DTOs (API contracts)
```

## Development Workflow

### Code Review Requirements

All code changes MUST be reviewed for:
- Compliance with DDD principles (domain logic in domain layer)
- Clean Architecture layer adherence (dependency direction)
- TDD compliance (tests written first, adequate coverage)
- Clean Code standards (naming, function size, clarity)
- Domain model integrity (rich models, not anemic)

### Testing Gates

- Unit tests MUST pass before integration tests are written
- Integration tests MUST pass before e2e tests are written
- All tests MUST pass before code review
- Test coverage MUST not decrease below 80% threshold
- New features without tests MUST be rejected

### Refactoring Standards

Refactoring MUST be done in dedicated commits, separate from feature work. Refactoring MUST not change behavior—all existing tests MUST pass. Large refactorings MUST be broken into smaller, incremental changes. Domain model refactorings MUST be accompanied by updated tests and documentation.

## Governance

This constitution supersedes all other coding practices and architectural decisions. All code MUST comply with these principles. Violations MUST be justified in code review with explicit rationale and documented exceptions.

**Amendment Process**: Amendments require:
1. Documentation of the proposed change and rationale
2. Impact analysis on existing codebase
3. Update to this constitution with version bump
4. Update to all dependent templates and documentation
5. Migration plan if the change affects existing code

**Compliance Review**: All pull requests MUST include a constitution compliance check. Reviewers MUST verify adherence to all applicable principles. Complexity that violates principles MUST be justified with explicit reasoning.

**Version**: 1.0.0 | **Ratified**: 2025-01-27 | **Last Amended**: 2025-01-27
