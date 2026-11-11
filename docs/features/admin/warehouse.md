# Admin: «Склад тканин»

**Status:** implementation exists, checked 2026-11-11 (warehouse stage 6). SDD: [warehouse stage 2, ledger rules and three pages](../../specs/admin/warehouse/001-ledger-pages/README.md), [stage 3, edit, void and restore](../../specs/admin/warehouse/002-movement-revisions/README.md), [stage 4, issue by actual cutting](../../specs/admin/warehouse/003-issue-by-cutting/README.md), [stage 5, the four reports](../../specs/admin/warehouse/004-reports/README.md); backend [WH-001](https://github.com/Weretik/BreviERP/tree/main/docs/sdd/specs/warehouse/001-warehouse-module) [WH-002](https://github.com/Weretik/BreviERP/tree/main/docs/sdd/specs/warehouse/002-ledger-rules) [WH-003](https://github.com/Weretik/BreviERP/tree/main/docs/sdd/specs/warehouse/003-movement-revisions) [WH-004](https://github.com/Weretik/BreviERP/tree/main/docs/sdd/specs/warehouse/004-issue-by-cutting) [WH-005](https://github.com/Weretik/BreviERP/tree/main/docs/sdd/specs/warehouse/005-reports) and [WH-006, transfer from v133](https://github.com/Weretik/BreviERP/tree/main/docs/sdd/specs/warehouse/006-v133-transfer).

«Склад тканин» is its own sidebar block right under «Швейний цех» (backend module Warehouse, `api/warehouse/...`, «Права доступу» page `fabric-stock`). Its sub-items follow the tabs of the old «Цех» v133. The four reports are their own «Права доступу» pages: `fabric-plan-fact`, `fabric-booking`, `fabric-valuation` (Admin by default) and `hardware-order` (Admin and WorkshopChief by default). Recording movements is for the head of the workshop and Admin; the server decides it and hides prices from everybody else.

- **«Рух тканини»** (`/warehouse/movements`). Every movement, newest operation date first, 50 per page with «Назад», the page number and «Далі». The operation date is shown apart from the record time. Columns: date and who recorded, kind, fabric and colour (the offer code and the fabric it is on the shelf as), supplier and document, order or «Куди використано», in, out, «На 1 виріб» (metres per product cut of an issue by cutting, «—» otherwise) and the balance of the moved line. Filters: fabric (any code of an alias group selects the group), its colour, «Усі / Прихід / Витрата». «Новий прихід» records a receipt of the exact offer picked (supplier is a free name with suggestions); after a save the panel stays open for the next roll with metres and document cleared. «Разова витрата» takes a pair the stock holds, shows the balance after it (a shortage becomes a visible minus) and «Куди використано / контрагент». «Сторно» with a reason (3–500 characters) for an opening, a receipt, an adjustment or a one-off issue; an order issue is reversed as a whole package on its card. «Видача на завдання» finds an open item (number, client, model or fabric), shows its fabric card and issues by actual cutting: products cut, lines on pairs of «Залишки» covering a planned part or «понад план» with a role, then a check step with plan and fact (P × n / N once per part), metres per product and pair balances before and after, then «Записати». Every movement can also be edited (pencil: side panel «Правка руху» with the fields of its kind and the effect on the balance before saving; a receipt may move to another offer or colour, an issue to another pair), cancelled («Скасувати» with a reason: the row stays as «Скасовано» with no effect) and taken back («Історія правок»: values before and after each change, «Скасувати останню правку» while nobody changed it since). «Зведення витрати» by period and «Вивантажити рух в Excel», which reads every page of the current filter into an `.xlsx` (frozen header, filter, text never turns into a formula).
- **«Залишки»** (`/warehouse/stock`, the old `/production/fabric-stock` redirects). Only fabrics and colours the stock holds: a fabric with its codes, composition and density, every colour with metres and the total. Negative metres stay and are red; a warning counts the pairs below zero. The search is local and case-insensitive over codes, names and colours. A colour opens «Уточнити» for people who may move stock: the counted total (not the change) with a reason; it may not create or deepen a shortage. «Завантажити всі залишки Excel» exports the whole merged stock whatever the search shows: code, name, composition, density, colour and metres, with the Kyiv export time, the count and the total. «Перенесення з v133» (Admin, `permissions.canTransfer`) opens a side panel: the person picks every `.jsonl` file of the `d1` folder of the old «Цех» export (only the columns the transfer reads are sent, rows keep their file order) and an optional export name for the journal. The server checks it at once without saving: old «Цех», what Brevi gets and what it holds now, errors (block the transfer), notes, and a warning when records entered in Brevi would be removed. «Перенести» replaces the whole stock; with such records only after the confirmation is ticked. The same export again changes nothing.
- **«Початкові залишки»** (`/warehouse/opening`). The form «Внести початковий залишок»: fabric offer, colour of «Кольори», metres from 0, date. Once per fabric and colour; the server refuses a second one. Below, «Внесені початкові залишки» lists openings not taken back, with «Сторно».

- **«План і факт»** (`/warehouse/plan-fact`). Main fabric by model for items issued for all their products: orders, products, plan, fact and difference per product (weighted), result; filters model, client, fabric; a model opens its orders with every material by role. One item that cannot be compared makes the difference unknown and is counted.
- **«Бронь і що замовити»** (`/warehouse/booking`). Booked, free and to order; pairs sorted by what to order, each opening its queue of items in order of the orders; search and «Лише те, що потрібно замовити»; «Невідомий план» apart. Reads only.
- **«Вартість складу»** (`/warehouse/valuation`). Positive stock at the lowest price of the fabric group in «Тканини»: colours, subtotals and total; «Без ціни» makes the total partial; «Дефіцит» apart; time of calculation and price source; «Оновити ціни і залишки».
- **«Фурнітура до замовлення»** (`/warehouse/hardware`). Full accessory need of open orders by model composition; a line opens norm × products by order; «Потреба неповна», «Потрібна перевірка назв»; Excel with «Зведена потреба» and «За замовленнями».

Every form makes a new operation id and keeps it across failed tries, so a lost answer is replayed by the server instead of moving the stock twice; the default operation date is today in Kyiv. The «Тканина» section of an order item in «Швейний цех» ([production](production.md)) is `ItemFabricSection` of this library: the same card and issue form, read through the orders endpoint. An order-issue edit hides «Куди використано».

## Code structure

```text
libs/admin/warehouse/model/src/
  entities/stock/                         # pairs, fabrics, list, form choices
  entities/movements/fabric-movement.ts   # movement row and page, kinds, filters
  entities/operations/stock-operation.ts  # opening, receipt, issue, adjustment, edit, void, restore bodies, limits
  entities/consumption/                   # «Зведення витрати»
  entities/issues/item-fabric.ts          # item fabric card, plan parts with layers, issues with plan and fact
  forms/item-issue/                       # issue by cutting: purposes, P × n / N, check step, body
  forms/stock-operations/                 # form values, defaults, bodies, balance after an issue, adjustment change
  forms/movement-edit/                    # edit of one movement: signs by kind, validation, effect, body
  validators/stock-operations/            # metres, dates, texts, reason, adjustment target
  queries/stock/fabric-stock-search.ts    # colour key, local search, pair lookup
  queries/movements/                      # movement page query and filter change
  mappers/format/                         # metres, money, Kyiv day and time
  mappers/exports/                        # .xlsx writer (stored zip), stock, movement and accessory workbooks
  entities/reports/stock-reports.ts       # the four reports, result labels, units
  queries/reports/booking-search.ts       # search and «Лише те, що потрібно замовити»
  entities/transfer/, mappers/transfer/v133-export.ts # «Перенесення з v133»: result, JSONL files → transfer body
libs/admin/warehouse/data-access/src/
  api/warehouse-base-api.ts, api/fabric-stock.api.ts # endpoints and hooks on adminApi
  api/item-fabric.api.ts                  # issue-items search, item card (orders or stock), issue, «Оновити план», «Сторно видачі»
  api/stock-reports.api.ts, mappers/stock-reports.mapper.ts # the four reports
  mappers/fabric-stock.mapper.ts, mappers/item-fabric.mapper.ts # runtime-checked responses
  api/stock-transfer.api.ts, mappers/stock-transfer.mapper.ts # «Перенесення з v133» check and transfer
  validators/warehouse-response.ts, errors/warehouse-api-error.ts # the server's Ukrainian reason
libs/admin/warehouse/ui/src/
  tables/stock|movements|consumption/     # «Залишки», «Рух тканини», «Зведення витрати»
  forms/stock-operations/                 # receipt, opening, one-off issue, «Уточнити», offer and colour fields
  forms/movement-edit/                    # «Правка руху» fields
  tables/movements/fabric-movement-history-table.tsx # «Історія правок»
  components/movements/                   # filters and pager
  dialogs/stock-reason-dialog.tsx         # «Сторно» reason
  panels/item-fabric/item-fabric-card.tsx # item fabric card
  forms/item-issue/                       # issue form and check step
  components/issue-items/                 # items found for «Видача на завдання»
  tables/reports/, components/reports/    # report tables, expandable row, order link, summary figures
  panels/stock-transfer/                  # «Перенесення з v133» comparison, errors and notes
libs/admin/warehouse/feature/src/
  warehouse.routes.tsx                    # createWarehouseRoutes: movements, stock, opening, plan-fact, booking, valuation, hardware
  pages/movements|stock|opening|reports/
  components/operations/                  # receipt, issue and adjustment side panels
  components/consumption/                 # «Зведення витрати» side panel
  components/movements/                   # «Правка руху» and «Історія правок» side panels
  components/item-issue/                  # ItemFabricSection (exported to production), issue drawer, «Видача на завдання»
  hooks/item-issue/                       # issue in two steps, «Сторно видачі»
  hooks/operations/use-stock-operation.ts # form state, operation id, save
  hooks/movements/                        # «Сторно», «Скасувати», export of every page
  hooks/files/download-file.ts
  components/transfer/, hooks/transfer/   # «Перенесення з v133» side panel: files, check, confirmation, transfer
apps/admin-react/src/app/router/
  legacy-menu.ts                          # «Склад тканин» block
  admin-route-definitions.tsx             # createWarehouseRoutes behind «Права доступу»
```

## Tests

- `libs/admin/warehouse/model/src/forms/stock-operations/stock-operation-forms.test.ts`
- `libs/admin/warehouse/model/src/forms/movement-edit/movement-edit-form.test.ts`
- `libs/admin/warehouse/model/src/forms/item-issue/item-issue-form.test.ts`
- `libs/admin/warehouse/model/src/queries/stock/fabric-stock-search.test.ts`
- `libs/admin/warehouse/model/src/mappers/exports/xlsx-workbook.test.ts`
- `libs/admin/warehouse/data-access/src/mappers/fabric-stock.mapper.test.ts`
- `libs/admin/warehouse/data-access/src/mappers/item-fabric.mapper.test.ts`
- `libs/admin/warehouse/data-access/src/mappers/stock-transfer.mapper.test.ts`
- `libs/admin/warehouse/model/src/mappers/transfer/v133-export.test.ts`
- `libs/admin/warehouse/feature/src/components/transfer/stock-transfer-drawer.component.test.tsx`
- `libs/admin/warehouse/feature/src/components/item-issue/item-issue-drawer.component.test.tsx`
- `libs/admin/warehouse/ui/src/tables/movements/fabric-movements-table.component.test.tsx`
- `libs/admin/warehouse/feature/src/pages/stock/fabric-stock-page.component.test.tsx`
- `libs/admin/warehouse/feature/src/pages/movements/fabric-movements-page.component.test.tsx`
- `libs/admin/warehouse/model/src/queries/reports/booking-search.test.ts`, `libs/admin/warehouse/model/src/mappers/exports/hardware-exports.test.ts`
- `libs/admin/warehouse/data-access/src/mappers/stock-reports.mapper.test.ts`
- `libs/admin/warehouse/feature/src/pages/reports/report-pages.component.test.tsx`
- `apps/admin-react/src/app/router/app-router.integration.test.tsx`, `apps/admin-react/src/app/router/navigation-config.unit.test.ts`

Focused run: `npx nx test admin-warehouse-model`, `admin-warehouse-data-access`, `admin-warehouse-ui`, `admin-warehouse-feature`.
