# AI navigation: Brevi Web

This is a short entry point for working in this frontend repository. The project files define its actual state and rules; read only the documents needed for the specific task.

## Product

Brevi Web holds the Brevi Admin (React, staff manage the catalogue, reference data, and Sewing/PPE pricing) and the public Storefront (Angular SSR, `/uk` and `/ru`). Data comes from the BreviERP backend through its OpenAPI contract; Storefront has no backend API consumer yet.

## Project context

- [Frontend inventory](docs/architecture/frontend-inventory.md) — applications, tools, and available Nx targets.
- Application architecture: [Admin React](docs/architecture/admin/README.md), [Storefront Angular](docs/architecture/storefront/README.md) (unfinished, not deployed), and [Site Next.js](docs/architecture/site/README.md) (planned public site replacing `brevi.com.ua` by the [migration plan](docs/specs/site/migration/README.md); new public-site work goes here).
- [Implemented feature map](docs/features/README.md) — separate Admin and Storefront descriptions with routes, boundaries, and code.
- [Standards index](docs/standards/README.md) — stable rules for code, UI, API, testing, security, and delivery.
- [Backend OpenAPI snapshot](docs/contracts/openapi/SOURCE.json) — synchronized backend contract and its source commit; see the [contract workflow](docs/architecture/api/contract-workflow.md).

Identify the application from the request and current code. If choosing between React and Angular affects the result and cannot be determined from context, clarify it before creating files.

## Context search order

1. [Feature map](docs/features/README.md) → feature card → files from its "Code structure" and "Tests" sections.
2. Architecture and standards only for the specific rule in question.
3. Specifications hold decisions and history: open them only for acceptance IDs, a past decision, or a specification you are implementing. Do not search `docs/specs/`, code-audit, or evidence files for current behavior; the code wins.
4. Scope searches by path, for example `rg <term> libs/admin/<domain>`, not the whole repository.

For a new or substantially changed feature, update the [feature map](docs/features/README.md) under the [delivery rules](docs/standards/shared/delivery-rules.md); do not document a minor internal change again.

## Commands

| Purpose                         | Command                                                        | Cost |
| ------------------------------- | -------------------------------------------------------------- | ---- |
| Focused tests of one Nx project | `npx nx test <project> -- <file-path-filter>`                  | fast |
| Lint or typecheck one project   | `npx nx lint <project>`, `npx nx typecheck <project>`          | fast |
| Documentation links             | `npm run docs:check`                                           | fast |
| Backend contract snapshot       | `npm run contracts:check`                                      | fast |
| List projects and targets       | `npx nx show projects`, `npx nx show project <project> --json` | fast |

Do not run `run-many`, full `npm run test:web`, coverage, production builds, or E2E (`admin-react-e2e`) unless the user asks; CI runs them. A small fix that restores documented behavior needs no SDD, file-role map, or audit: fix it, run the focused test, and describe the change briefly.

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

Make commits, push, create a branch or PR, or take other actions that change remote state only at the user's direct request.
