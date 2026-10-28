# FE-003 model audit and refactoring — 2026-10-27

The requested scope is the just-implemented independent quote model slice, not the whole Admin application. Findings are in [the feature audit](../code-audit/audit.md#fe-003-model-audit--2026-10-27). Existing client changes, generated API contracts and backend code were preserved.

## Changes and checks

| Stage / exact command                                                                                                             | Observed result                                                                                                                       |
| --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Red: `node node_modules/vitest/vitest.mjs run --config libs/admin/clients/model/vitest.config.mts quote-basis-state.unit.test.ts` | Exit 1; 2 failed / 3 passed. Copied saved basis without a variant ID and a blank token both returned `blocked` rather than `missing`. |
| Green/refactor: `node node_modules/vitest/vitest.mjs run --config libs/admin/clients/model/vitest.config.mts`                     | Exit 0; 16 passed / 6 files. Includes existing client-model tests, new basis identity/save checks and variant-order isolation.        |
| `node node_modules/typescript/bin/tsc --noEmit -p libs/admin/clients/model/tsconfig.spec.json`                                    | Exit 0; production and test types checked together after the move and split.                                                          |

| Final static check                                                                                                                                                                                                                        | Observed result                                                                                              |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| With PowerShell `$env:NX_DAEMON='false'; $env:NX_ISOLATE_PLUGINS='false'`: `node node_modules/eslint/bin/eslint.js 'libs/admin/clients/model/src/{entities,models,mappers,validators}/quotes/*.ts' libs/admin/clients/model/src/index.ts` | Exit 0; no errors or warnings; no final source edits were needed.                                            |
| `node node_modules/prettier/bin/prettier.cjs --check 'libs/admin/clients/model/src/{entities,models,mappers,validators}/quotes/*.ts' libs/admin/clients/model/src/index.ts`                                                               | Exit 0; all matched files use the project style. Changed audit/feature/task pages were formatted separately. |
| Scoped `git diff --check` and local Markdown link checks                                                                                                                                                                                  | Passed. No stale production imports from the moved selection paths remain.                                   |

Public export names are unchanged. `QuotePriceSelection` moved into quote entities; `sameQuoteSelection` and `changeQuoteSelection` have separate files. Draft graph-save tests are separate from basis-state tests. Order functions remain one cohesive file with a private implementation detail.

No API/source snapshot was synchronized, no editor route was registered, and no browser or whole-app suite ran. The frontend contract handoff dependency is unchanged; this audit does not claim completion of FE-003 or FE-004.
