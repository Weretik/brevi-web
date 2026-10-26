# Frontend task graph

The [2026-10-25 checkpoint](implementation.md) records implemented paths, focused verification and remaining deployment gates. This graph preserves the task dependencies. Follow [delivery rules](../../../../standards/shared/delivery-rules.md).

| ID     | Depends on                | One responsibility and evidence                                                                                                                                                                                                |
| ------ | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| EN-001 | Backend contract accepted | Pin backend commit, sync OpenAPI and generated operations; `contracts:check` and contract provenance.                                                                                                                          |
| EN-002 | —                         | Confirm current Product editor/detail responsibility and exact Nx targets; record focused baseline tests and any existing permission pattern.                                                                                  |
| EN-003 | EN-002                    | Enable data-router navigation blocking for dirty composition, retaining the existing domain route tree, shared layout and lazy pages. Evidence: focused root router regression and real memory-router back/stay/discard tests. |
| TS-001 | EN-001, EN-002            | Add Article/composition application types, mapping and runtime response validation in `products/model` + `data-access`; mapper/error tests.                                                                                    |
| TS-002 | TS-001                    | Add Article list/select/readiness to detail page; component tests for Sewing vs PPE and loading/empty/error.                                                                                                                   |
| TS-003 | TS-001                    | Add Article create with duplicate SKU and dirty draft handling; focused form tests.                                                                                                                                            |
| TS-004 | TS-001, TS-002            | Add shared and Article-specific composition editor; tests for `246`/`247` fabric switching, eight common lines, twelve operation lines and Other cost display.                                                                 |
| TS-005 | TS-003, TS-004, EN-003    | Connect save/concurrency/field errors and dirty-navigation protection; tests for stale edit, invalid reference, back/stay/discard and atomic UI response.                                                                      |
| TS-006 | TS-002–005                | Verify old Product create/replace/PPE scenarios, update Admin product feature card and SDD index/status with evidence.                                                                                                         |

First ready work without backend contract: EN-002 and isolated UI/model design. API-consuming work starts after EN-001. Implementation does not include price or quote screens.
