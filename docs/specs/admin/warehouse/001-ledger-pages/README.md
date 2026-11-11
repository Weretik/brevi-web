# Admin: «Склад тканин» stage 2, ledger rules and three pages

**Status:** implemented 2026-11-11. Backend: [WH-002 in BreviERP](https://github.com/Weretik/BreviERP/tree/main/docs/sdd/specs/warehouse/002-ledger-rules). Source: TZ «Brevi — склад тканин» v1.0 (old «Цех» v133), sections 6, 9 and 10. Feature card: [«Склад тканин»](../../../../features/admin/warehouse.md).

## Scope

- Move «Склад тканин» out of `libs/admin/production` into its own libraries `libs/admin/warehouse/{model,data-access,ui,feature}` (tags `domain:warehouse`).
- Three pages of the menu block: «Рух тканини» (`/warehouse/movements`), «Залишки» (`/warehouse/stock`), «Початкові залишки» (`/warehouse/opening`), all behind the `fabric-stock` page of «Права доступу».
- Out of scope, later stages: edit, void and restore of a movement (stage 3); issue by actual cutting (stage 4); «План і факт», «Бронь і що замовити», «Вартість складу», «Фурнітура до замовлення» (stage 5); the v133 transfer (stage 6). The old «Імпорт» button of the stock is removed; stage 6 brings the new transfer.

## Decisions

| Decision                                                                                                                | Why                                                                                                                        |
| ----------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| The «Тканина» tab of an order item stays in «Швейний цех» with its own `getIssueFabricChoices` endpoint on the same URL | It belongs to the order card; stage 4 rebuilds it by actual cutting. RTK Query endpoint names are shared across libraries. |
| Each form keeps one `operationId` (`crypto.randomUUID`) until a save succeeds                                           | TZ 7.3: a retry after a lost answer returns the saved result instead of a second movement.                                 |
| «Уточнити» enters the counted total and sends the pair version                                                          | TZ 9: the total of the merged pair, not the change; the server refuses a stale pair.                                       |
| Excel is a real `.xlsx` written by a small stored-zip writer in `model/mappers/exports`                                 | TZ 9 and A47: frozen header, filter, numeric metres, inline-string text that never becomes a formula; no new dependency.   |
| Header buttons are «Новий прихід» and «Разова витрата»; the form button is «Записати прихід»                            | The filter already has «Прихід».                                                                                           |

## Acceptance

The ledger rules (A01–A13) are enforced and tested on the server (WH-002). The admin checks what the pages add:

| TZ                                                                              | Admin check                                                                             |
| ------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| A01, A03 opening from 0; A02 the server's refusal shown                         | `stock-operation-forms.test.ts`; refusal text through `warehouse-api-error.ts`          |
| A04–A05 receipt of the exact offer, supplier as a name                          | `fabric-movements-page.component.test.tsx`                                              |
| A06–A07 one-off issue, balance after it shown below zero                        | `stock-operation-forms.test.ts`                                                         |
| A08–A09 «Уточнити» to a total, not below min(0, current)                        | `stock-operation-forms.test.ts`, `fabric-stock-page.component.test.tsx`                 |
| A10 two decimals at most                                                        | `stock-operation-forms.test.ts`                                                         |
| A11–A12 colour key and alias group in the search and filters                    | `fabric-stock-search.test.ts`                                                           |
| A46 export of the whole stock and of every movement page; A47 safe text         | `xlsx-workbook.test.ts`, `use-movements-export.ts`                                      |
| Same operation id on a retry (TZ 7.3)                                           | `fabric-movements-page.component.test.tsx`                                              |
| Operation date apart from the record time; 50 rows per page with «Назад»/«Далі» | `fabric-movements-table.component.test.tsx`, `fabric-movements-page.component.test.tsx` |

## Files

See the code structure of the [feature card](../../../../features/admin/warehouse.md). Removed from `libs/admin/production`: the stock page, the line card, receipt, correction and consumption panels, their hooks and forms, the stock grid, chips, movements table, the stock CSV, filters and import file reader.

## Verification

`npx nx run-many -t lint typecheck typecheck-tests test -p admin-warehouse-model admin-warehouse-data-access admin-warehouse-ui admin-warehouse-feature admin-production-model admin-production-data-access admin-production-ui admin-production-feature`, `npx nx run-many -t typecheck lint -p admin-react`, `vitest run src/app/router` in `apps/admin-react`, `npm run contracts:check`, `npm run docs:check`.
