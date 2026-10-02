# Admin layers і boundaries — traceability

| Finding | Requirements   | Tasks                          | Verification target                                                   | Status   |
| ------- | -------------- | ------------------------------ | --------------------------------------------------------------------- | -------- |
| AF-001  | AR-001         | EN-001, RM-001, RM-010         | boundary lint + graph review                                          | verified |
| AF-002  | AR-002         | RM-003, RM-010                 | model/mappers typecheck + tests + DTO import search                   | verified |
| AF-003  | AR-002         | RM-004, RM-010                 | model/mappers typecheck + tests + DTO import search                   | verified |
| AF-004  | AR-004         | RM-002, RM-005, RM-006, RM-010 | baseApi tests + forbidden fetch/manual lifecycle search + regressions | verified |
| AF-005  | AR-003         | RM-007, RM-008, RM-010         | UI dependency inspection + component/E2E regressions                  | verified |
| AF-006  | AR-005         | RM-002, RM-009, RM-010         | alias/barrel/deep-import search + lint                                | verified |
| AF-007  | AR-006         | RM-003–RM-006, RM-009, RM-010  | target tree inspection + tests                                        | verified |
| AF-008  | AR-006         | RM-009, RM-010                 | empty/dead path and stale-doc search                                  | verified |
| AF-009  | AR-007         | EN-001, RM-002–RM-010          | source/test typecheck + focused/regression targets                    | verified |
| AF-010  | AR-001, AR-006 | RM-002, RM-009, RM-010         | canonical shared paths/aliases + graph                                | verified |

Усі findings повторно перевірені RM-010 після останньої production-code зміни.
Exact commands і результати наведені в `code-audit/audit.md`.
