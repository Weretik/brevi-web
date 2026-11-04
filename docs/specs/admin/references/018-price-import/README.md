# 018 — «Імпорт цін»: PPE supplier prices

**Status:** stages 1–3 implemented 2026-11-04. **Backend:** BreviERP CAT-017 (`api/v1/pricing/ppe/supplier-prices`).

The client's Apps Scripts updated PPE supplier prices in the sheet «ЗІЗ». This page shows each supplier source, its update logic, schedule and discount, and updates file suppliers (Insight XML, СЕМТО PDF) with a preview first. Stage 2 adds «Оновити зараз» for the website and Google Sheets suppliers that the backend updates every Monday; stage 3 offers it for the Insight and Трєле dealer cabinets, updated daily (Insight keeps its XML upload too).

## Rules

| ID   | Rule                                                                                                                                                                                                                                                                                                                                       |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| R-01 | `/references/price-import` («Загальні довідники» → «Імпорт цін», after «Параметри ціноутворення») shows one table row per source: supplier, how it updates (files or method + schedule), discount, product count, last update. A problem shows only when there is one: supplier missing in «Постачальники», problems of the last run.      |
| R-02 | A row opens the side panel (`ReferenceEditorDrawer`): logic, schedule, discount with who changed it, products with a manual price, last run with its problems. A source without a connected update shows that its prices are not updated yet.                                                                                              |
| R-03 | «Змінити знижку» is offered only when the API says `canChangeDiscounts` (administrators and the director). The discount is 0–90%, up to 2 decimals, comma or dot.                                                                                                                                                                          |
| R-04 | A file source has «Оновити з файлу»: choose exactly its files (Insight 3 XML, СЕМТО 1 PDF), «Перевірити» shows every product of the supplier with old and new prices (Insight also wholesale and retail), changes and problems first, with the reason; nothing is saved. «Застосувати (N)» sends the same files again with `dryRun=false`. |
| R-05 | Files are gzipped in the browser before upload so three 17 MB Insight lists fit the API request limit.                                                                                                                                                                                                                                     |
| R-06 | After applying, product prices in «Товари» are refetched (`Product` tag).                                                                                                                                                                                                                                                                  |
| R-07 | Stage 2: a connected website or Google Sheets source (`method` not `File` and `automaticUpdateConnected`) with a supplier has «Оновити зараз»: «Перевірити» calls `refreshPpeSupplierPrices` with `dryRun=true` and shows the same preview; «Застосувати (N)» calls it with `dryRun=false`, which reads the supplier again and saves.      |

## Verification 2026-11-04

- `npx nx test admin-references-model -- price-import`: 3 passed; `admin-references-data-access -- price-import`: 2 passed; `admin-references-feature -- price-import`: 2 passed; `admin-react -- navigation app-router`: 17 passed; `admin-references-ui -- reference-editor`: 1 passed.
- Typecheck and lint for the references libraries, `admin-shared-api-client` and `admin-react`: pass.
- Contract synchronized with BreviERP `b2f94e0`; `npm run contracts:check` passes.

## Verification 2026-11-04, stage 2

- `npx nx test admin-references-model -- price-import`: 4 passed; `admin-references-feature -- price-import`: 3 passed.
- Typecheck and lint for `admin-references-model`, `admin-references-data-access`, `admin-references-feature`: pass.
- Contract synchronized with BreviERP `01abf10`; `npm run contracts:check` passes.

## Verification 2026-11-04, stage 3

- No new screen: the backend marks Insight and Трєле connected, so the existing «Оновити зараз» section appears for them (R-07); its text now says «Не чекаючи розкладу».
- `npx nx test admin-references-model -- price-import` and `admin-references-feature -- price-import` pass; contract synchronized with BreviERP `053ee0c`.

## Change 2026-11-04 (owner)

- Insight is updated only from its three XML files: the backend no longer marks it connected, so its panel shows only the file upload, without «Оновити зараз». Трєле and the website and Google Sheets sources update only on Monday at 09:00 (the `brevierp-sync` job runs Mon–Fri 09:00 Kyiv). No Admin code change; contract synchronized with BreviERP `9cee053`.
