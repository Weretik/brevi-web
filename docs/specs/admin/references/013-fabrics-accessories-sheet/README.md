# 013 — Fabrics and accessories: Calculator sheet fields and «Цех» pages

- **Surface:** React Web (Admin)
- **SDD status:** implemented 2026-11-02
- **Owner:** admin/references
- **Backend:** BreviERP spec `docs/sdd/specs/reference/002-fabrics-accessories-sheet` (REF-002), contracts `reference/fabrics.openapi.yaml` and `reference/garment-accessories.openapi.yaml` 1.1.0

The client's Calculator Google Sheet kept fabrics on «Тканини» and accessories on
«Фурнітура». Brevi now stores the same fields, and the Admin shows them on two
separate «Цех» pages instead of the old combined tabs page.

The sheet data is moved **once**, by the team through the backend import endpoint
(preview first, then apply). The product owner decided on 2026-11-02 that the Admin
does not need an import window, so the Admin has no file upload.

## Rules

| ID   | Rule                                                                                                                                                                                        |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R-01 | «Тканини» lives at `/references/fabric`, «Фурнітура» at `/references/garment-accessory`; the old `?tab=fabrics` link redirects to the fabrics page. Both are separate items in the sidebar. |
| R-02 | Fabric fields: code (FAB-…), name UA/RU, supplier, composition UA/RU, density g/m², price per metre, price date, «Активна», comment, short КП description.                                  |
| R-03 | Accessory fields: code (FUR-…), name, supplier, price, unit (шт., м, послуга), price date, «Активна», comment.                                                                              |
| R-04 | The price date is read-only; the backend sets it when the price changes.                                                                                                                    |
| R-05 | Lists filter by activity chips (default «Активні») and search code, names, supplier (fabrics also composition). Inactive rows stay for history.                                             |
| R-06 | The supplier picker offers active suppliers and keeps the current value even when it is inactive.                                                                                           |
| R-07 | The fabric editor can fill the КП description from composition and density, as the sheet formula did.                                                                                       |
| R-08 | Lists, pills, toolbar, row menu and footer use the shared «Цех» reference-list pieces, the same as suppliers.                                                                               |

## Scenarios

| ID    | Scenario                                                              | Test                                                                     |
| ----- | --------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| SC-01 | Fabric list shows sheet fields, filters by activity and search, retry | `fabrics-page.component.test.tsx`                                        |
| SC-02 | Fabric create sends the sheet fields; a field error keeps the input   | `fabrics-page.component.test.tsx`                                        |
| SC-03 | Accessory list and create with unit                                   | `garment-accessories-page.component.test.tsx`                            |
| SC-04 | Responses with the new fields and units are validated before mapping  | `fabrics.mapper.unit.test.ts`, `garment-accessories.mapper.unit.test.ts` |
| SC-05 | Old `?tab=fabrics` link opens the fabrics page; sidebar has both      | `apps/admin-react/src/app/router/app-router.integration.test.tsx`        |

## Data transfer

One-time load from the client's .xlsx (86 fabrics, 43 accessories): rows are sent to
`POST /api/reference/fabrics/import` and `/garment-accessories/import` with
`dryRun: true`, the owner checks the preview, then the same rows are sent with
`dryRun: false`. Matching is by code; repeating changes nothing.
