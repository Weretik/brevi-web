# Sewing composition code audit — 2026-10-25

Follow-up findings AF-007/008 are verified in the [controller/form remediation](../../005-sewing-composition-structure/follow-up.md). They separate screen assembly, feature control, local form state and pure review invalidation. Earlier evidence below describes the original AF-001–006 pass.

**Scope:** handwritten code added or changed for this feature across Product model/data-access/UI/feature and its Admin composition root. Backend audit is owned by its repository. Generated OpenAPI types/snapshots are reviewed as generated boundaries and retained; no manual decomposition. **Mode:** audit plus user-authorized remediation. [Remediation scope and tasks](../../005-sewing-composition-structure/README.md).

## 00. Inventory and authoritative rules

Sources: root `AGENTS.md`; [code organization](../../../../../standards/admin/admin-code-organization.md); [domain structure](../../../../../architecture/admin/structure/domains.md); [dependencies](../../../../../architecture/admin/structure/dependencies.md); [feature design](../design/frontend.md); [API provenance](../contracts/api-contract.md); per-library `project.json`; actual imports/provider wiring; `eslint.config.cjs`. Existing feature behavior is characterized by model/UI/transport/feature and routing tests.

The initial code used the existing four Product Nx libraries and the shared Admin RTK API, with generated DTOs confined to data-access. The violation is responsibility grouping inside those boundaries, rather than evidence that a new business module is needed.

## 01. Dependency matrix

| Owner                        | Permitted role/dependencies                                                 | Initial finding                                                                       |
| ---------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `admin-products-model`       | Pure contracts/defaults/mapping/validation; no React/router/transport.      | AF-001: independent contracts and pure behaviors combined.                            |
| `admin-products-ui`          | Presentation/forms using model; no API or routing.                          | AF-002: list/create and multi-section row responsibilities combined.                  |
| `admin-products-data-access` | Shared Admin API + generated contract types → validated application models. | AF-003: resource, serialization, validation and mapping owners combined.              |
| `admin-products-feature`     | Queries + editable state + scenario orchestration; consumes root aliases.   | AF-004/005: independent state/mutation/navigation and legacy-lock workflows combined. |
| `apps/admin-react`           | Provider/router/layout composition through domain public APIs.              | AF-006: route definitions, layout, router construction and provider in one file.      |

`eslint.config.cjs` contains actual `@nx/enforce-module-boundaries` constraints for model/UI/data-access/feature. Final verification must include real permitted imports and a negative reverse-dependency probe; folder names alone are not evidence.

## 02–04. Findings and split/keep decisions

| ID     | Severity / state  | Initial evidence and rule                                                                                                                                                                    | Impact / target / owner                                                                                                                                                                                                               | Task / verification                                                                                                                   |
| ------ | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| AF-001 | medium / verified | `model/src/sewing/sewing-articles.ts:1` contained unrelated Article/draft/view contracts; `sewing-composition.ts:1` combined defaults, mapping, validation and comparison.                   | `entities/{sewing-articles,sewing-composition}/`, `queries/sewing-composition/`, `mappers/sewing-composition/`, `validators/sewing-composition/`; one application type per entity file.                                               | RM-001; 5 colocated characterization tests, source/test types and scoped ESLint passed.                                               |
| AF-002 | medium / verified | `ui/src/sewing/sewing-composition-editor.tsx:1` combined material/operation rows, sections, form actions and validation; Article panel combined selection and creation.                      | `components/sewing-articles/` and `forms/{sewing-articles,sewing-composition}/`; separate list/create form/editor/sections/rows. Pure validation moved to model.                                                                      | RM-002; 6 component tests, source/test types and scoped ESLint passed.                                                                |
| AF-003 | medium / verified | `data-access/src/api/sewing.api.ts:1` combined three resources and serialization; the response mapper combined validation and conversion.                                                    | Resource-specific `api`, `contracts`, `models`, `mappers`, `validators` capability folders; separate material/operation input mappers and private DTO aliases.                                                                        | RM-003; 9 transport/mapper regression tests, types, ESLint and contract provenance passed.                                            |
| AF-004 | high / verified   | Initial `feature/src/components/sewing-composition/sewing-composition-feature.tsx:56/69/80` owned queries, drafts, writes, reload, selection, error mapping, router/unload and presentation. | Seven focused hooks under `hooks/sewing-composition/`; scope/error contracts in `model/sewing-composition/`; separate scope editors/header, load feedback, stale alert and confirmation dialog. The feature component assembles them. | RM-004; 9 focused feature/compatibility tests, source/test types and scoped ESLint passed, including actual router back/stay/discard. |
| AF-005 | medium / verified | Initial ProductEditPage implemented access/query/legacy-lock policy inline; ProductEditor embedded notice presentation.                                                                      | `hooks/product-editor/use-legacy-sewing-norm-lock.ts` and `components/product-editor/legacy-sewing-norm-lock-notice.tsx`; existing base form keeps its cohesive save path.                                                            | RM-004; Product editor/detail regression included in 9 focused tests; types/ESLint passed.                                            |
| AF-006 | medium / verified | Initial `app-router.tsx:1` combined definitions, layout, factory and provider lifecycle.                                                                                                     | Separate `admin-route-definitions.tsx`, `admin-route-layout.tsx`, `create-admin-router.tsx`, and `app-router.tsx`.                                                                                                                    | RM-005; 11 route/provider tests, app source types and scoped ESLint passed.                                                           |

Keep decisions: existing Product/Nx domain boundaries remain because no new independently owned business capability is established. Colocated props contracts used by one component can remain private to that cohesive file. Generated OpenAPI output and snapshots remain intact to preserve reproducible generation. Existing Product editors outside the added sewing/lock responsibilities are not mass-refactored. Tests are grouped by scenario/responsibility rather than split per assertion.

## 05–06. Verification and closure

Structural remediation reuses characterization/regression; artificial behavioral Red is not required. All six findings are `verified` after final structure/import inspection and the focused checks below. No full application suite, browser, production build, database mutation or Git commit was performed for this remediation.

### Actual data and state paths

| Flow             | Verified owners                                                                                                                                  |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Access           | `api/sewing-access` → session-role validator → capability mapper → feature query hook. Server policies remain authoritative.                     |
| Articles         | `api/sewing-articles` → Article/list validators and mappers → selection/creation hooks → list and separate creation form.                        |
| Composition read | `api/sewing-composition` → header/material/operation validators → response mapper → scoped draft mapper.                                         |
| Composition save | Editable draft → dedicated material/operation/request mappers → generated operation body → shared Admin API; no client IDs/review metadata leak. |
| Conflict         | Shared Admin errors → feature field-error mapper → write lifecycle → stale alert; no automatic 409 retry or draft replacement.                   |
| Navigation       | Feature navigation hook owns router blocker/unload and communicates dirty state; pure confirmation component renders callbacks.                  |

### Structure decisions

- Keep the four existing Product libraries; role boundaries are real and enforced, without inventing a new business module. Cross-library imports use root aliases; validators, DTO aliases and mapper internals are not exported publicly.
- `model/entities/sewing-composition/` has nine small contracts. **Keep** this capability group: all are parts of the same composition/draft projection, each has its own file, and independently selected Articles have their own separate group. A further library or arbitrary folder-per-field would not establish another lifecycle.
- Seven feature hooks have named, distinct read/draft/create/write/view/scope/navigation roles. The container contains composition glue, not the former implementations of those workflows. No reducer duplicates RTK Query server cache.
- Model characterization tests were moved beside defaults, comparison, mapping and validators. Mapper and transport tests are colocated with those owners; a shared saved-composition fixture describes one business slice.
- Generated OpenAPI output/snapshots stay generator-owned. Existing Product editor code outside the added norm-lock capability remains in its established form structure. Private props and coherent scalar checks stay with their sole owner; independent public contracts/components are separated.

### Commands and final evidence

- `npx nx run-many --targets=typecheck,typecheck-tests --projects=admin-products-model,admin-products-ui,admin-products-data-access,admin-products-feature --parallel=1`: all 8 source/test targets passed.
- `npx nx test admin-products-model src/queries/sewing-composition src/mappers/sewing-composition src/validators/sewing-composition --maxWorkers=1`: 5/5 across 5 colocated files.
- `npx nx test admin-products-ui src/forms/sewing-articles/sewing-articles-panel.component.test.tsx src/forms/sewing-composition/sewing-composition-editor.component.test.tsx --maxWorkers=1`: 6/6.
- `npx nx test admin-products-data-access src/api/sewing-articles src/api/sewing-composition src/mappers/sewing-articles src/mappers/sewing-composition src/mappers/sewing-access src/products.api.integration.test.ts --maxWorkers=1`: 9/9 across 6 files. A former test with two independent resource assertions was separated; behavior assertions were retained.
- `npx nx test admin-products-feature src/components/sewing-composition/sewing-composition-feature.component.test.tsx src/pages/product-detail/product-detail-page.component.test.tsx src/components/product-editor/product-editor.component.test.tsx --maxWorkers=1`: 9/9.
- `npx nx test admin-react src/app/router/app-router.integration.test.tsx src/app/providers/app-providers.integration.test.tsx --testTimeout=15000 --maxWorkers=1`: 11/11; the existing cold lazy-import limit is set for this invocation only.
- `npx tsc --noEmit -p apps/admin-react/tsconfig.app.json`: passed for the final app integration.
- Task-scoped ESLint through its Node API checked all 111 changed handwritten TS/TSX source/test files in Product and the Admin composition root: **0 errors, 0 warnings**. Import-order/style fixes and unused symbols were corrected before this final pass.
- A separate in-memory `ESLint.lintText` probe at a real model source path imported `@admin/products/feature`; `@nx/enforce-module-boundaries` correctly rejected the forbidden reverse dependency. No invalid import was written to the repository.
- `npm run contracts:check`: snapshot and generated types match the pinned backend provenance. Contract/schema/generated files were not manually changed by this remediation.

The [feature card](../../../../../features/admin/products/sewing-composition.md) is the current navigation map. Original implementation-checkpoint commands remain historical evidence. Live PostgreSQL migration/deployment acceptance remains the earlier feature gate; this structural work does not claim that verification.
