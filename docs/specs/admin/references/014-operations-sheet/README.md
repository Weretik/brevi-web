# 014 — Operations: Calculator sheet fields and a «Цех» page

- **Surface:** React Web (Admin)
- **SDD status:** implemented 2026-11-02
- **Owner:** admin/references
- **Backend:** BreviERP spec `docs/sdd/specs/reference/003-operations-sheet` (REF-003), contract `reference/garment-part-operations.openapi.yaml` 1.1.0

The Calculator sheet «Операції» (187 operations in 27 groups) replaces the old Brevi operations. The product owner decided on 2026-11-02 that only the sheet data is current and that names are Ukrainian only. The data is moved once through the backend import: preview first, then apply after the owner's «да».

## Rules

| ID   | Rule                                                                                                                                                                                                                                                                          |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R-01 | One page «Операції» at `/references/garment-part-operation` with the tabs «Операції» and «Групи деталей» (`?tab=groups`).                                                                                                                                                     |
| R-02 | Operation fields: code (OP-…), group, element, variant, name, norm in minutes, «Час вказується для кожного виробу», check date, «Активна», notes.                                                                                                                             |
| R-03 | «Вартість» = norm × minute cost; «Зі збиранням» = that × (1 + assembly rate). The minute cost is monthly salary / (work days × shift minutes) from the current sewing settings. Nothing is stored. If the settings cannot be read, the cells show «—» and the header says so. |
| R-04 | Search covers code, group, element, variant and name; activity chips and a group filter narrow the list.                                                                                                                                                                      |
| R-05 | Lists, chips, row menu, drawer and table height follow the reference list pattern (standard table height, inner scroll).                                                                                                                                                      |

## Scenarios

| ID    | Scenario                                                             | Test                                                                                |
| ----- | -------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| SC-01 | List shows sheet fields and costs; time per product shows «на виріб» | `garment-part-operations-content.component.test.tsx`                                |
| SC-02 | Group filter and search                                              | `garment-part-operations-content.component.test.tsx`                                |
| SC-03 | Sewing settings unavailable: list still works, costs «—»             | `garment-part-operations-content.component.test.tsx`                                |
| SC-04 | Card, then edit with time per product sends the sheet fields         | `garment-part-operations-content.component.test.tsx`                                |
| SC-05 | Costs match the sheet (6 хв → 10,67 / 13,34 грн)                     | `operation-labour-cost.unit.test.ts`, `garment-part-operations.mapper.unit.test.ts` |
| SC-06 | Groups tab keeps its CRUD and URL                                    | `garment-parts-content.component.test.tsx`                                          |
