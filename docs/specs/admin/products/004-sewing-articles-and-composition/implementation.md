# Implementation checkpoint — 2026-10-25

This checkpoint preserves the initial delivery evidence. The subsequent [responsibility audit](code-audit/audit.md) and [structural remediation](../005-sewing-composition-structure/README.md) contain current paths and fresh post-move verification. Earlier test commands below remain historical evidence and are not the current navigation guide.

## Scope and contract

This delivery implements the Article/composition editor for React Admin, dependent on backend Catalog SDD 002. [Contract provenance and operation IDs](contracts/api-contract.md) pin the backend implementation. Prices, source-data import, quotes and finance remain outside this feature.

Base Product creation still saves the existing Product draft. Article and composition management follows on the saved Sewing Product's detail page, where a Product ID exists. PPE details retain their existing flow. Model and Article edits have separate drafts from base Product editing and use the dedicated operations and version token.

## Implemented boundaries

- `products/model/src/{entities,queries,mappers,validators}/` separates application contracts, scoped draft defaults/comparison, effective-view conversion and validation. Shared materials and operations are not copied into Article-specific save requests.
- `products/ui/src/components/sewing-articles/` and `forms/{sewing-articles,sewing-composition}/` separate listing, creation, form sections and individual rows. Material kind fixes its unit; non-inventory costs have a cost code. Editing relevant input resets review so it must be confirmed again.
- `products/data-access/src/api/{sewing-access,sewing-articles,sewing-composition}/` owns resource endpoints. Separate contracts/validators/mappers consume generated types, validate responses and construct requests. The shared Product-scoped sewing cache behavior is retained.
- Runtime mapping rejects wrong Article parents/scopes, unsafe numeric IDs, invalid quantities and incomplete review metadata. A stale write is returned once; no automatic save retry occurs.
- Article readiness is fetched when an Article is selected. The list shows an explicit unchecked state for others, avoiding a request per Article or invented readiness. Selected readiness comes from the saved server composition, not the unsaved draft.
- Dirty scope/Article switches require confirmation; tab/window close uses `beforeunload`. The application uses a React Router data router so the feature can block browser-history and SPA navigation with `useBlocker`; one accessible confirmation controls leave/stay. Deletion is disabled while the composition is dirty. A 409 retains the draft and its original token; loading the current version is an explicit discard action.
- Legacy norm controls are locked on existing Sewing Products when new Articles/composition exist or their status cannot be checked. Base fields remain on the existing save path. Create and PPE paths skip these new lookup requests.

## Verification and remaining gates

Focused checks are recorded here when the final feature integration is verified. Model/UI checks and data-access boundary tests are independent of a running backend. No browser, E2E, full frontend suite or production build was requested or run.

The backend migration has not been applied or tested against real PostgreSQL in this environment. A valid generated contract and component tests do not prove deployed database writes. Deployment order is schema migration through the backend procedure, API, then this client. The source catalogue has not been loaded; absence of Articles is a supported empty state.

## Focused evidence

All final commands below passed. Earlier integration failures were corrected before these checkpoints; no failed assertion is treated as accepted behavior.

| Command                                                                                                                                                                                                                                              | Result                                                                                                                       |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `npx nx test admin-products-model src/sewing/sewing-composition.unit.test.ts`                                                                                                                                                                        | 5/5: scoped drafts and effective-view conversion.                                                                            |
| `npx nx test admin-products-ui src/sewing/sewing-articles-panel.component.test.tsx src/sewing/sewing-composition-editor.component.test.tsx`                                                                                                          | 6/6: scope, references, review invalidation, normative time and accessible controls.                                         |
| `npx nx test admin-products-data-access src/sewing.api.integration.test.ts src/products.api.integration.test.ts`                                                                                                                                     | 8/8: runtime validation, Article-only payload, version preservation, no stale-write retry and existing transport regression. |
| `npx nx test admin-products-feature src/components/sewing-composition/sewing-composition-feature.component.test.tsx src/pages/product-detail/product-detail-page.component.test.tsx src/components/product-editor/product-editor.component.test.tsx` | 9/9, including actual memory-router back/stay/discard and old Product editor/detail regression.                              |
| `npx nx test admin-react src/app/router/app-router.integration.test.tsx src/app/providers/app-providers.integration.test.tsx --testTimeout=15000 --maxWorkers=1`                                                                                     | 11/11: current route tree, direct links, shared shell, query-string tabs, providers and theme.                               |

`npx nx typecheck admin-products-model`, `admin-products-ui`, `admin-products-data-access` and `admin-products-feature` passed. `npx nx typecheck-tests admin-products-feature` passed. The root router has no configured application typecheck target, so `npx tsc --noEmit -p apps/admin-react/tsconfig.app.json` verified the changed composition boundary. Targeted ESLint for `app.tsx`, `app-providers.tsx`, `app-router.tsx` and its integration test passed.

`npm run contracts:generate` and `npm run contracts:check` passed; snapshot/type provenance matches the pinned backend commit. Scoped Markdown links and `git diff --check` were checked. Some commands emit existing line-ending or Node color-environment warnings.

The root route regression initially exceeded the default five-second test limit while loading lazy reference modules; the final command uses a fifteen-second limit and one worker for that invocation only. No global timeout or test assertion was weakened. New application and component tests are final-state verification; a preimplementation Red run is not claimed for this frontend slice.

EN-001–003 and TS-001–006 are complete for this client-code scope. Live database rollout, production acceptance, pricing parity and source import remain separate gates.
