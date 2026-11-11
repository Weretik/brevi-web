# Admin: «Склад тканин»

**Status:** implementation exists, checked 2026-11-11 (warehouse stage 3). SDD: [warehouse stage 2, ledger rules and three pages](../../specs/admin/warehouse/001-ledger-pages/README.md), [stage 3, edit, void and restore](../../specs/admin/warehouse/002-movement-revisions/README.md); backend [WH-001](https://github.com/Weretik/BreviERP/tree/main/docs/sdd/specs/warehouse/001-warehouse-module) [WH-002](https://github.com/Weretik/BreviERP/tree/main/docs/sdd/specs/warehouse/002-ledger-rules) and [WH-003](https://github.com/Weretik/BreviERP/tree/main/docs/sdd/specs/warehouse/003-movement-revisions).

«Склад тканин» is its own sidebar block right under «Швейний цех» (backend module Warehouse, `api/warehouse/...`, «Права доступу» page `fabric-stock`). Its sub-items follow the tabs of the old «Цех» v133. Three work now; «План і факт», «Бронь і що замовити», «Вартість складу» (Admin) and «Фурнітура до замовлення» stay disabled until their stages. Recording movements is for the head of the workshop and Admin; the server decides it and hides prices from everybody else.

- **«Рух тканини»** (`/warehouse/movements`). Every movement, newest operation date first, 50 per page with «Назад», the page number and «Далі». The operation date is shown apart from the record time. Columns: date and who recorded, kind, fabric and colour (the offer code and the fabric it is on the shelf as), supplier and document, order or «Куди використано», in, out and the balance of the moved line. Filters: fabric (any code of an alias group selects the group), its colour, «Усі / Прихід / Витрата». «Новий прихід» records a receipt of the exact offer picked (supplier is a free name with suggestions); after a save the panel stays open for the next roll with metres and document cleared. «Разова витрата» takes a pair the stock holds, shows the balance after it (a shortage becomes a visible minus) and «Куди використано / контрагент». «Сторно» with a reason (3–500 characters) for an opening, a receipt, an adjustment or a one-off issue; an order issue is reversed in its order. An opening, receipt, adjustment or one-off issue can also be edited (pencil: side panel «Правка руху» with the fields of its kind and the effect on the balance before saving; a receipt may move to another offer or colour, an issue to another pair), cancelled («Скасувати» with a reason: the row stays as «Скасовано» with no effect) and taken back («Історія правок»: values before and after each change, «Скасувати останню правку» while nobody changed it since). «Зведення витрати» by period and «Вивантажити рух в Excel», which reads every page of the current filter into an `.xlsx` (frozen header, filter, text never turns into a formula).
- **«Залишки»** (`/warehouse/stock`, the old `/production/fabric-stock` redirects). Only fabrics and colours the stock holds: a fabric with its codes, composition and density, every colour with metres and the total. Negative metres stay and are red; a warning counts the pairs below zero. The search is local and case-insensitive over codes, names and colours. A colour opens «Уточнити» for people who may move stock: the counted total (not the change) with a reason; it may not create or deepen a shortage. «Завантажити всі залишки Excel» exports the whole merged stock whatever the search shows: code, name, composition, density, colour and metres, with the Kyiv export time, the count and the total.
- **«Початкові залишки»** (`/warehouse/opening`). The form «Внести початковий залишок»: fabric offer, colour of «Кольори», metres from 0, date. Once per fabric and colour; the server refuses a second one. Below, «Внесені початкові залишки» lists openings not taken back, with «Сторно».

Every form makes a new operation id and keeps it across failed tries, so a lost answer is replayed by the server instead of moving the stock twice; the default operation date is today in Kyiv. The «Тканина» tab of an order item stays in «Швейний цех» ([production](production.md)) and takes its offers and colours from the same `choices` endpoint.

## Code structure

```text
libs/admin/warehouse/model/src/
  entities/stock/                         # pairs, fabrics, list, form choices
  entities/movements/fabric-movement.ts   # movement row and page, kinds, filters
  entities/operations/stock-operation.ts  # opening, receipt, issue, adjustment, edit, void, restore bodies, limits
  entities/consumption/                   # «Зведення витрати»
  forms/stock-operations/                 # form values, defaults, bodies, balance after an issue, adjustment change
  forms/movement-edit/                    # edit of one movement: signs by kind, validation, effect, body
  validators/stock-operations/            # metres, dates, texts, reason, adjustment target
  queries/stock/fabric-stock-search.ts    # colour key, local search, pair lookup
  queries/movements/                      # movement page query and filter change
  mappers/format/                         # metres, money, Kyiv day and time
  mappers/exports/                        # .xlsx writer (stored zip), stock and movement workbooks
libs/admin/warehouse/data-access/src/
  api/warehouse-base-api.ts, api/fabric-stock.api.ts # endpoints and hooks on adminApi
  mappers/fabric-stock.mapper.ts          # runtime-checked responses
  validators/warehouse-response.ts, errors/warehouse-api-error.ts # the server's Ukrainian reason
libs/admin/warehouse/ui/src/
  tables/stock|movements|consumption/     # «Залишки», «Рух тканини», «Зведення витрати»
  forms/stock-operations/                 # receipt, opening, one-off issue, «Уточнити», offer and colour fields
  forms/movement-edit/                    # «Правка руху» fields
  tables/movements/fabric-movement-history-table.tsx # «Історія правок»
  components/movements/                   # filters and pager
  dialogs/stock-reason-dialog.tsx         # «Сторно» reason
libs/admin/warehouse/feature/src/
  warehouse.routes.tsx                    # createWarehouseRoutes: /warehouse/movements, /warehouse/stock, /warehouse/opening
  pages/movements|stock|opening/
  components/operations/                  # receipt, issue and adjustment side panels
  components/consumption/                 # «Зведення витрати» side panel
  components/movements/                   # «Правка руху» and «Історія правок» side panels
  hooks/operations/use-stock-operation.ts # form state, operation id, save
  hooks/movements/                        # «Сторно», «Скасувати», export of every page
  hooks/files/download-file.ts
apps/admin-react/src/app/router/
  legacy-menu.ts                          # «Склад тканин» block
  admin-route-definitions.tsx             # createWarehouseRoutes behind «Права доступу»
```

## Tests

- `libs/admin/warehouse/model/src/forms/stock-operations/stock-operation-forms.test.ts`
- `libs/admin/warehouse/model/src/forms/movement-edit/movement-edit-form.test.ts`
- `libs/admin/warehouse/model/src/queries/stock/fabric-stock-search.test.ts`
- `libs/admin/warehouse/model/src/mappers/exports/xlsx-workbook.test.ts`
- `libs/admin/warehouse/data-access/src/mappers/fabric-stock.mapper.test.ts`
- `libs/admin/warehouse/ui/src/tables/movements/fabric-movements-table.component.test.tsx`
- `libs/admin/warehouse/feature/src/pages/stock/fabric-stock-page.component.test.tsx`
- `libs/admin/warehouse/feature/src/pages/movements/fabric-movements-page.component.test.tsx`
- `apps/admin-react/src/app/router/app-router.integration.test.tsx`, `apps/admin-react/src/app/router/navigation-config.unit.test.ts`

Focused run: `npx nx test admin-warehouse-model`, `admin-warehouse-data-access`, `admin-warehouse-ui`, `admin-warehouse-feature`.
