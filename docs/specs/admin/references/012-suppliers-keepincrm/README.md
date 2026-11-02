# 012 — Suppliers: KeepinCRM fields and sync

- **Surface:** React Web (Admin)
- **SDD status:** implemented 2026-11-02
- **Owner:** admin/references
- **Backend:** BreviERP spec `docs/sdd/specs/reference/001-suppliers-keepincrm` (REF-001), contract `reference/suppliers.openapi.yaml` 1.2.0

The client's Calculator Google Sheet kept suppliers on the «Постачальники» tab and
an Apps Script refreshed it from KeepinCRM. This change moves that into Brevi: the
backend owns the sync, the Admin page shows the same fields in the «Цех» style.

## Rules

| ID   | Rule                                                                                                                                                                            |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R-01 | For a supplier with `keepinCrmId`, name, «Що закуповуємо», site, contact person, phones, email and tags come from KeepinCRM; the editor shows them read-only with an info note. |
| R-02 | «Використовувати в проєкті» (`isActive`) and notes are always edited in Brevi; for a KeepinCRM supplier they are saved through `PUT /{id}/brevi-fields`.                        |
| R-03 | A manual supplier (no `keepinCrmId`) keeps full create/edit, now with email, «Що закуповуємо» and activity.                                                                     |
| R-04 | «Оновити з KeepinCRM» calls `POST /keepin-sync`, shows the summary (received, created, linked, updated, missing) or the 503 error, and refreshes the list.                      |
| R-05 | The list filters by activity chips (default «Активні») and searches name, contact, phone, email and purchase categories.                                                        |

## Scenarios

| ID    | Scenario                                                                           | Test                                                                                                     |
| ----- | ---------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| SC-01 | KeepinCRM supplier opens with locked card fields and saves only activity and notes | `suppliers-page.component.test.tsx`                                                                      |
| SC-02 | Sync button shows the summary or the error                                         | `suppliers-page.component.test.tsx`                                                                      |
| SC-03 | Response with the new fields is validated and mapped; sync response is validated   | `suppliers-response.unit.test.ts`, `suppliers.mapper.unit.test.ts`, `references.api.integration.test.ts` |
| SC-04 | Activity filter and extended search                                                | `suppliers-page.component.test.tsx`                                                                      |
