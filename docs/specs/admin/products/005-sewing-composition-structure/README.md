# 005 — Sewing composition responsibility decomposition

**Status:** verified, 2026-10-25. **Scope:** structural remediation of handwritten code delivered for [Sewing Articles and composition](../004-sewing-articles-and-composition/README.md), including its application routing support. The user requested both the audit and fixes; no further implementation approval is required. The [source audit](../004-sewing-articles-and-composition/code-audit/audit.md) owns findings, final paths and verification evidence.

## Architectural requirements

| ID     | Required outcome                                                                                                                                                                                               | Existing rule                                                                |
| ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| AR-001 | Give each production file one cohesive responsibility; independent contracts, forms, rows, state lifecycles and scenarios have named owners.                                                                   | [Code organization](../../../../standards/admin/admin-code-organization.md)  |
| AR-002 | Group roles before capabilities: `entities`, `mappers`, `validators`, `api`, `forms`, `components`, `hooks`, `state`. Keep pure models, transport, presentation and orchestration in their existing libraries. | [Domain structure](../../../../architecture/admin/structure/domains.md)      |
| AR-003 | Preserve versioned requests, validation errors, readiness, local drafts, 409 handling, dirty navigation, legacy/PPE behavior and routes. RTK Query retains server state/cache ownership.                       | [Feature design](../004-sewing-articles-and-composition/design/frontend.md)  |
| AR-004 | Keep cross-library imports on root public aliases. Remove obsolete private compatibility files; generated types and snapshots remain generator-owned.                                                          | [Dependency rules](../../../../architecture/admin/structure/dependencies.md) |
| AR-005 | Verify each move through focused characterization/regression, source/test types and boundary enforcement.                                                                                                      | [Testing rules](../../../../standards/shared/testing-rules.md)               |

## Work and dependencies

| Task                                                                    | Finding    | Owner and dependency                                                             |
| ----------------------------------------------------------------------- | ---------- | -------------------------------------------------------------------------------- |
| [RM-001 — pure models](tasks/RM-001-pure-models.md)                     | AF-001     | `products/model`; keep application exports stable before downstream integration. |
| [RM-002 — presentation](tasks/RM-002-presentation.md)                   | AF-002     | `products/ui`; depends on stable model exports from RM-001.                      |
| [RM-003 — transport](tasks/RM-003-transport.md)                         | AF-003     | `products/data-access`; depends on stable model exports from RM-001.             |
| [RM-004 — feature orchestration](tasks/RM-004-feature-orchestration.md) | AF-004/005 | `products/feature`; integrates stable UI and data-access exports.                |
| [RM-005 — routing composition](tasks/RM-005-routing-composition.md)     | AF-006     | `apps/admin-react`; independent of model/UI moves, then route regression.        |

These tasks reorganize existing responsibilities inside the current Product domain. They do not create a new business module, change the API/schema, or add a second source of data. A real capability boundary is required before creating another Nx library or backend module.

## Migration and recovery

Move consumers and tests to their new owners in the same change, update root exports and remove old private files. Keep the canonical OpenAPI snapshot and generated output untouched. The backend contract remains pinned at `cafa6c231a114c94dd8e095fa4f6dfc6b2aa60a1`; internal backend namespace/file moves do not change that public contract.

There is no data migration or deployment-order change. Recovery is reverting the affected source moves as a group while preserving unrelated working changes. No Git mutation or database write is part of this remediation request.

## Completion

The subsequent [controller/form follow-up](follow-up.md) verifies AF-007/008 without altering the completed base decomposition.

All six findings must be `verified` in the source audit, current paths must match documentation, obsolete imports/facades must be absent, and the focused checks must pass. A successful typecheck alone does not establish responsibility separation.
