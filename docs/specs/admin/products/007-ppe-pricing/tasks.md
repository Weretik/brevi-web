# Tasks and evidence

- EN-P01: verify backend persistence/API and pin a clean authorized local checkpoint; synchronize/generate/check contracts.
- TS-P01: independent model, DTO validation/mapping and RTK read/version endpoints — boundary tests.
- TS-P02: three-tier/blocker panel and explicit version forms with manager gates, UUID retry/conflict handling — component tests.
- TS-P03: one bounded PPE Product batch, explicit pricing status and compatibility — model/hook/affected Product tests.
- TS-P04: scoped structure review, types/lint/format, navigation and actual evidence. No full suite or browser checks.

Implementation is complete for EN-P01 and TS-P01/02/03. Scope and corrections are recorded in [audit](code-audit/audit.md), architecture in the [feature map](../../../../features/admin/products/ppe-pricing.md), fresh commands/results in [verification](verification.md). TS-P04 is verified: production/test types, scoped lint/format, contract reproducibility, navigation and focused regression passed. No artificial Red was required for generated contract synchronization or moving unchanged shared helpers; generator repeatability and focused regressions replace it.

TS-007 supersedes the original non-enrolled PPE fallback: [current cutover scope](cutover/README.md) and [fresh evidence](cutover/evidence.md). SC-R01/02/03 are verified locally; no legacy sale-price fallback remains.
