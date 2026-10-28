# P2 quote audit and refactoring — 2026-10-28

Scope: FE-003/004 locally implemented quote functionality only. User authorized audit, functional fixes and responsibility refactoring. No backend code, OpenAPI snapshot, generated types or new product phase changed. Contract source remains `1c1f51dc7837f3d5e3a0da7326cb17b48d23e4d9`. No commit or push performed by this audit.

## Red → Green

Commands run from the frontend repository using `node node_modules/vitest/vitest.mjs run --config <config> <test-filter>`.

| Config / test filter                                                                                                          | Before fix                  | Verified behavior after fix                                                                                               |
| ----------------------------------------------------------------------------------------------------------------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `libs/admin/clients/data-access/vitest.config.mts` / `quote-response.unit.test.ts`                                            | 2 failed, 6 passed          | Restores item and alternative order from unique `sortOrder` without mutating the wire graph; rejects duplicate positions. |
| `libs/admin/clients/feature/vitest.config.mts` / `use-quote-preview.unit.test.tsx` and `quote-editor-form.component.test.tsx` | 2 failed, 8 passed combined | Rejects a coherent basis for another requested product; implicit form submission with an access error issues no mutation. |

## Refactoring

- `hooks/quotes/use-quote-write.ts`: create/save mutations, validation, synchronous submit lock, captured original intent/requestId, uncertain-result replay and write feedback.
- `hooks/quotes/use-quote-editor.ts`: editable draft/baseline, navigation guard, refresh confirmation and composition of write/preview hooks.
- `components/quotes/editor/`: form, item/alternative editors and colocated form tests.
- `components/quotes/selection/`: recipient and Catalog picker with its tests.
- `components/quotes/list/` and `changes/`: list filters and reload confirmation.
- `data-access/src/mappers/quotes/quote-price-selection.mapper.ts`: selection decoding, separate from price-basis decoding.
- `data-access/src/validators/quotes/quote-ordered-records.ts`: bounded array, unique order validation and copied-array sorting shared by item/alternative mapping.

Existing public exports and routes are preserved. This is one feature slice inside existing libraries; no empty modules or additional Nx libraries were introduced.

## Fresh verification

`NX_DAEMON=false` and `NX_ISOLATE_PLUGINS=false` used for scoped tooling.

| Check                                                                      | Result                         |
| -------------------------------------------------------------------------- | ------------------------------ |
| Vitest data-access, complete target                                        | 13 tests passed across 4 files |
| Vitest feature, complete target                                            | 28 tests passed across 9 files |
| TypeScript `--noEmit -p libs/admin/clients/data-access/tsconfig.spec.json` | Passed                         |
| TypeScript `--noEmit -p libs/admin/clients/feature/tsconfig.spec.json`     | Passed                         |
| ESLint changed quote mappers/validators/components/hooks/pages             | Passed                         |
| Vitest admin app `navigation-config.unit.test.ts`                          | 4 tests passed                 |

Prettier checks passed for the changed quote source; updated SDD files were formatted. Markdown checker passed for 495 files with no broken links, empty files or duplicates. `git diff --check` passed.

Tests retain coverage of replaying the captured original request after timeout, 409 without losing input, dirty reload confirmation, saved prices, stale preview suppression, Catalog and recipient selection. The pure model was unchanged; its previous 16-test evidence remains in the P2 delivery record.

Browser, manual, visual, deployment and target-environment migration checks were not performed. Local automated evidence does not close those acceptance steps. [Findings and exact source locations](../code-audit/audit.md#p2-functional-audit-and-refactoring--2026-10-28).
