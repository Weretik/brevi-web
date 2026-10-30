# Трасування вимог, сценаріїв і доказів

P3 SC-Q02/Q04–05: backend TS-005 та frontend FE-005 реалізовано локально; snapshot/generated types pinned to `f185138fc1cfc6c71cf94fe4e7103652e6719b5b`. [FE-005 evidence](evidence/fe-005-2026-10-28.md) містить Red/Green та scoped integration/DOM evidence; manual acceptance pending.

Клієнтські частини SC-C01–05 та P2 draft portions of SC-Q01–04/Q06–07 мають автоматичні backend/frontend докази; ручне приймання pending. Історія/явний reprice/copy/transfer/archive реалізовані FE-005; видані документи, custom та імпорт лишаються planned. [Клієнтські докази](evidence/clients-frontend-2026-10-26.md), [P2 докази й тести](evidence/p2-frontend-2026-10-27.md). Спільні сценарії описані у requirements цього SDD та backend SDD; імпортні SC-M01–03 означають idempotent role-filtered import, чесну неповноту та recovery.

| Rule                          | Scenario | Frontend tasks                                                                                  | Backend prerequisite           | Evidence                                            |
| ----------------------------- | -------- | ----------------------------------------------------------------------------------------------- | ------------------------------ | --------------------------------------------------- |
| R-C01–02                      | SC-C01   | [FE-001](tasks/clients/fe-001.md), [FE-002](tasks/clients/fe-002.md); FE-EN-001/002             | EN-001, TS-001, TS-002         | Client round-trip/API + existing-menu UI            |
| R-C04                         | SC-C02   | [FE-002](tasks/clients/fe-002.md); FE-EN-001/002                                                | TS-001, TS-002                 | Source uniqueness race/review                       |
| R-C03, R-C05                  | SC-C03   | [FE-002](tasks/clients/fe-002.md); FE-EN-001/002                                                | TS-001, TS-002, TS-004         | Primary/deactivate constraints + frozen recipient   |
| R-C06                         | SC-C04   | [FE-001](tasks/clients/fe-001.md), [FE-002](tasks/clients/fe-002.md); FE-EN-001/002             | EN-001, TS-002                 | Scoped list/ID/update/403 checks                    |
| R-C04–05                      | SC-C05   | [FE-002](tasks/clients/fe-002.md); FE-EN-001/002                                                | TS-001, TS-002                 | Atomic merge and historical invariant               |
| R-Q01–04                      | SC-Q01   | [FE-003](tasks/quotes/fe-003.md), [FE-004](tasks/quotes/fe-004.md); FE-EN-001/002               | EN-002, TS-003, TS-004         | Ordered snapshot/paged API/client integration       |
| R-Q04–05, R-Q08               | SC-Q02   | [FE-004](tasks/quotes/fe-004.md), [FE-005](tasks/quotes/fe-005.md); FE-EN-001/002               | TS-003, TS-004, TS-005         | Master-change independence + explicit reprice       |
| R-Q04, R-Q06                  | SC-Q03   | [FE-004](tasks/quotes/fe-004.md); FE-EN-001/002                                                 | TS-003, TS-004                 | PPE reason/forged totals/sewing rejection           |
| R-Q01, R-Q05                  | SC-Q04   | [FE-004](tasks/quotes/fe-004.md), [FE-005](tasks/quotes/fe-005.md); FE-EN-001/002               | TS-003, TS-004, TS-005         | Two-writer 409 + request replay                     |
| R-Q07–08                      | SC-Q05   | [FE-005](tasks/quotes/fe-005.md); FE-EN-001/002                                                 | TS-004, TS-005                 | Copy/transfer/archive history and permissions       |
| R-Q02, R-Q06                  | SC-Q06   | [FE-004](tasks/quotes/fe-004.md), [FE-010](tasks/release/fe-010.md); FE-EN-001/002              | TS-004, TS-013                 | One-off typed private content/legacy classification |
| R-Q03–04, R-Q09               | SC-Q07   | [FE-004](tasks/quotes/fe-004.md), [FE-008](tasks/documents/fe-008.md); FE-EN-001/002            | EN-002, TS-003, TS-004, TS-010 | Blocked SKU/tier/ready validation                   |
| R-S01–02                      | SC-S01   | [FE-006](tasks/custom-sewing/fe-006.md); FE-EN-001/002                                          | EN-002, TS-006                 | Two fabric versions/common engine                   |
| R-S03–04                      | SC-S02   | [FE-006](tasks/custom-sewing/fe-006.md); FE-EN-001/002                                          | EN-002, TS-003, TS-006         | Decimal custom application/delivery golden fixture  |
| R-S02, R-S06                  | SC-S03   | [FE-006](tasks/custom-sewing/fe-006.md), [FE-007](tasks/custom-sewing/fe-007.md); FE-EN-001/002 | TS-006, TS-007                 | Quoted custom/file snapshot independence            |
| R-S05                         | SC-S04   | [FE-007](tasks/custom-sewing/fe-007.md); FE-EN-001/002                                          | TS-008                         | Suggestions/template current-input explicit apply   |
| R-S06                         | SC-S05   | [FE-007](tasks/custom-sewing/fe-007.md); FE-EN-001/002                                          | EN-003, TS-007                 | Actual bytes/hash/MIME/ACL/projection               |
| R-S07                         | SC-S06   | [FE-009](tasks/documents/fe-009.md); FE-EN-001/002                                              | TS-012                         | Pinned production package/no external call          |
| R-D01, R-D06                  | SC-D01   | [FE-008](tasks/documents/fe-008.md); FE-EN-001/002                                              | EN-005, TS-009, TS-010         | Verified settings/ready blockers                    |
| R-D02–03, R-D06               | SC-D02   | [FE-008](tasks/documents/fe-008.md); FE-EN-001/002                                              | EN-003, TS-010                 | Rendered PDF/no hidden/private fields/checksum      |
| R-D04–05                      | SC-D03   | [FE-009](tasks/documents/fe-009.md); FE-EN-001/002                                              | EN-004, TS-011                 | Outbox retry/crash/explicit test send               |
| R-D02–03                      | SC-D04   | [FE-007](tasks/custom-sewing/fe-007.md), [FE-008](tasks/documents/fe-008.md); FE-EN-001/002     | EN-003, TS-007, TS-010         | Malicious text/media/ACL failure                    |
| R-C04, R-Q08; migration rules | SC-M01   | [FE-010](tasks/release/fe-010.md); FE-EN-001/002                                                | EN-006, TS-013, TS-014         | Role-filtered staged import repeated/hash conflict  |
| R-S06; migration rules        | SC-M02   | [FE-010](tasks/release/fe-010.md); FE-EN-001/002                                                | EN-006, TS-013, TS-014         | Partial graph/missing bytes quarantine              |
| Migration recovery rules      | SC-M03   | [FE-010](tasks/release/fe-010.md); FE-EN-001/002                                                | TS-014, TS-015                 | Backup/restore counts/hash/recovery evidence        |

## Перше знайомство

| Rule  | Scenario | Frontend                            | Backend        | Evidence                                           |
| ----- | -------- | ----------------------------------- | -------------- | -------------------------------------------------- |
| R-I01 | SC-I01   | [FE-011](tasks/documents/fe-011.md) | TS-016, EN-002 | 4/8-slot/season/metadata/tier validation           |
| R-I02 | SC-I02   | FE-007, FE-011                      | TS-008, TS-016 | Own template/current-price apply/immutable history |
| R-I03 | SC-I03   | FE-008, FE-009, FE-011              | TS-010/011/016 | Seasonal PDF/privacy/pinned delivery               |

Evidence для API містить реальний контрактний SHA; для UI — focused test/стан/дію та перевірку доступності; для PDF — rendered content/privacy; для імпорту — backend звіт звірки й restore. Backend tasks тут — залежності, не виконані frontend роботи.

FE-005 follow-up audit, SC-Q02/Q05 → AF-FE-P3-003–005 → reprice hook and history/comparison component tests → [fresh evidence](evidence/fe-005-audit-refactor-2026-10-28.md). Verified locally; manual acceptance pending.

FE-006 → frontend SC-S01–03 → configuration/alternative model tests, runtime custom/quote mappers, actual local HTTP cache tests, captured-retry hooks and editor/modal components → [64-case verified execution](evidence/fe-006-2026-10-28.md), historical backend `31424453f4bef63363167e3dc11e0bfa2857e64f`. AF-FE-P4-001 stale source-draft opener is verified fixed by the source-key test.

FE-007 → SC-S03–05 / R-S02,R-S04–06 → finalized/historical file scope, actual multipart/binary transport, explicit flags/unknown retry/discard, private cache handling, template privacy/owned writes/immutable apply and explicit independent suggestion configuration → [114-case evidence](evidence/fe-007-2026-10-28.md), backend `fdb8095d4dfd52a9680b5a2768c706aea1aa8c4b`. P4 implementation complete; SC-S06 production export belongs to P6.

FE-EN-002 P5 handoff → SC-Q07, SC-D01–02, SC-D04 → seven TS-009/010 issuer settings, ready and PDF operationIds in canonical snapshot and generated types → [contract evidence](evidence/fe-en-002-p5-2026-10-29.md), backend `e5f563456efd1b29a67a36805c2b3775ce2f9d06`. FE-008 owns frontend behavior and its separate test evidence; manual acceptance is pending.

FE-009 → SC-D03/SC-S06 → pinned delivery/production API, runtime mappers, local HTTP/ZIP tests and explicit confirmation/captured-retry/late-response UI tests → [verification](evidence/fe-009-delivery-production-2026-10-30.md). Live SC-D03 acceptance remains gated by EN-004.

SC-PUB01/02 → R-PUB01/02 → [FE-EN-003](tasks/readiness/fe-en-003.md) → tools/legal/erp-public-pages.test.mjs → [evidence](evidence/fe-en-003-public-pages-2026-10-30.md). SC-PUB03/R-PUB03 → FE-EN-003 deployment/runtime/Google gates → pending real publication and acceptance.
