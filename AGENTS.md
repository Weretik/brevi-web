# AI navigation: Brevi Web

This is a short entry point for working in this frontend repository. The project files define its actual state and rules; read only the documents needed for the specific task.

## Project context

- [Frontend inventory](docs/architecture/frontend-inventory.md) — applications, tools, and available Nx targets.
- Application architecture: [Admin React](docs/architecture/admin/README.md) and [Storefront Angular](docs/architecture/storefront/README.md).
- [Implemented feature map](docs/features/README.md) — separate Admin and Storefront descriptions with routes, boundaries, and code.
- [Standards index](docs/standards/README.md) — stable rules for code, UI, API, testing, security, and delivery.

Identify the application from the request and current code. If choosing between React and Angular affects the result and cannot be determined from context, clarify it before creating files. For task-specific context, navigate from the [feature map](docs/features/README.md) to the relevant feature card and code; read SDD, architecture, and standards only for the issues involved.

For a new or substantially changed feature, update the [feature map](docs/features/README.md) under the [delivery rules](docs/standards/shared/delivery-rules.md); do not document a minor internal change again.

## Task routing

| Task                                                          | Skill                                                    | Project documentation                                           |
| ------------------------------------------------------------- | -------------------------------------------------------- | --------------------------------------------------------------- |
| Specify new or changed behavior                               | `$frontend-feature-spec`                                 | [Readiness rules](docs/standards/shared/delivery-rules.md)      |
| Implement an accepted specification                           | `$frontend-feature-delivery`                             | [Delivery rules](docs/standards/shared/delivery-rules.md)       |
| Implement with multiple agents at the user's explicit request | `$frontend-feature-orchestrator`                         | [Delivery rules](docs/standards/shared/delivery-rules.md)       |
| Architecture audit / systemic violations                      | `$frontend-code-audit` / `$frontend-remediation-plan`    | [Standards index](docs/standards/README.md)                     |
| HTTP and API contracts                                        | `$frontend-api-contract-sync`                            | [Contract workflow](docs/architecture/api/contract-workflow.md) |
| Verify changes / hand off for review                          | `$frontend-change-verification` / `$frontend-pr-handoff` | [Testing rules](docs/standards/shared/testing-rules.md)         |
| Differences between code and documentation                    | `$frontend-docs-sync`                                    | [Documentation index](docs/README.md)                           |

## Process priority

The user's direct request and this repository's rules define the scope of work. For feature specification, implementation, and verification, use the relevant `frontend-*` skills and project documents as the primary process. Apply additional skills only for a needed method; they do not add repeated approval, mandatory agents, a worktree, or a separate TDD cycle on top of the project process. Run checks and tests according to this repository's rules and the task requirements.

## Verification

During implementation, run only automated tests for the changed feature and related parts under the [testing rules](docs/standards/shared/testing-rules.md). Run general tests, the full suite, coverage, production build, E2E, or a full audit only at the user's explicit request. Determine available targets from `project.json` or `npx nx show project <name> --json`; the inventory is a snapshot, while current configuration takes precedence.
