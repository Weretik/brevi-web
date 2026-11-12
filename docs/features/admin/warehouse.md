# Admin: «Склад тканин»

**Status:** implementation exists, checked 2026-11-12 (menu of four items, UX stage 1; «Рух тканини» journal, UX stage 2; «Залишки» with booking, UX stage 3; «Що замовити», UX stage 4; «Звіти», UX stage 5). SDD: [UX stage 2, movement journal](../../specs/admin/warehouse/005-movement-journal/README.md), [UX stage 3, stock with booking](../../specs/admin/warehouse/006-stock-booking/README.md), [UX stage 4, what to order](../../specs/admin/warehouse/007-to-order/README.md), [UX stage 5, reports](../../specs/admin/warehouse/008-reports/README.md), [warehouse stage 2, ledger rules and three pages](../../specs/admin/warehouse/001-ledger-pages/README.md), [stage 3, edit, void and restore](../../specs/admin/warehouse/002-movement-revisions/README.md), [stage 4, issue by actual cutting](../../specs/admin/warehouse/003-issue-by-cutting/README.md), [stage 5, the four reports](../../specs/admin/warehouse/004-reports/README.md); backend [WH-001](https://github.com/Weretik/BreviERP/tree/main/docs/sdd/specs/warehouse/001-warehouse-module) [WH-002](https://github.com/Weretik/BreviERP/tree/main/docs/sdd/specs/warehouse/002-ledger-rules) [WH-003](https://github.com/Weretik/BreviERP/tree/main/docs/sdd/specs/warehouse/003-movement-revisions) [WH-004](https://github.com/Weretik/BreviERP/tree/main/docs/sdd/specs/warehouse/004-issue-by-cutting) [WH-005](https://github.com/Weretik/BreviERP/tree/main/docs/sdd/specs/warehouse/005-reports) and [WH-006, transfer from v133](https://github.com/Weretik/BreviERP/tree/main/docs/sdd/specs/warehouse/006-v133-transfer) and [WH-007, movement journal](https://github.com/Weretik/BreviERP/tree/main/docs/sdd/specs/warehouse/007-movement-journal) and [WH-008, stock booking columns](https://github.com/Weretik/BreviERP/tree/main/docs/sdd/specs/warehouse/008-stock-booking-columns) and [WH-009, to-order dates](https://github.com/Weretik/BreviERP/tree/main/docs/sdd/specs/warehouse/009-to-order-dates) and [WH-010, report periods](https://github.com/Weretik/BreviERP/tree/main/docs/sdd/specs/warehouse/010-report-periods).

«Склад тканин» is its own sidebar block right under «Швейний цех» (backend module Warehouse, `api/warehouse/...`, «Права доступу» page `fabric-stock`). Since 2026-11-12 it has four items: «Залишки», «Рух тканини», «Що замовити» (tabs «Тканина» and «Фурнітура», `?tab=fabric|hardware`) and «Звіти» (tabs «План і факт», «Витрата за період», «Вартість», `?tab=plan-fact|consumption|valuation`). A tab shows only when its own «Права доступу» page is open (`useAccess` from the app, `use-warehouse-access.ts`); the menu item shows when any of its tabs is open. The old addresses `/warehouse/opening`, `/booking`, `/hardware`, `/plan-fact` and `/valuation` redirect to the right item and tab. The four reports are their own «Права доступу» pages: `fabric-plan-fact`, `fabric-booking`, `fabric-valuation` (Admin by default) and `hardware-order` (Admin and WorkshopChief by default). Recording movements is for the head of the workshop and Admin; the server decides it and hides prices from everybody else.

- **«Рух тканини»** (`/warehouse/movements`). A compact journal: every movement, newest operation date first, 50 per page with «1–50 із N», «Назад» and «Далі». Columns: date, «Операція» («Прихід», «На завдання», «Разова витрата», «Уточнення», «Початковий», «Сторно»), fabric · colour (offer code, «→ FAB-023» when it is on the shelf as another code), «Звідки / куди» (`Ц-12 · модель`, supplier · document, «Куди використано» or the reason of an adjustment; «На 1 виріб» under an issue by cutting), the signed quantity (a receipt in green) and «Залишок пари» after the movement (every code of the fabric in this colour; red below zero). Only problems are marked: a cancelled row is greyed with «Прибрано з обліку» or «Сторновано». Filters: one search over every text (fabric, code, colour, supplier, document, task `Ц-12`, model, destination, note; every word must match), the kind chips with counts («Усі», «Прихід», «На завдання», «Разова витрата», «Уточнення», «Початкові», «Відмінені»; `?kind=Opening` opens on «Початкові») and the period chip («Сьогодні», «Цей тиждень», «Цей місяць», «Минулий місяць», «Свій період» with two dates). A row opens its side panel: the operation, the fabric, where from or to, who recorded it and when, with «Історія правок» once changed, «Відмінити операцію…» and «Редагувати» («Правка руху» with the fields of its kind and the effect on the balance; a receipt may move to another offer or colour, an issue to another pair). «Відмінити операцію…» is one dialog with a reason (3–500 characters) and a choice: «Прибрати з обліку» (default; the row stays with no effect and can be taken back in «Історія правок») or «Записати зворотну операцію (сторно)» where the server allows a storno (an opening, a receipt, an adjustment or a one-off issue; an order issue is reversed as a whole package on its card). «Історія правок» shows values before and after each change and «Скасувати останню правку» while nobody changed it since. «Новий прихід» (the one orange action) and «Видача на завдання» are in the header; «Разова витрата», «Внести початковий залишок» and «Вивантажити рух в Excel» are in «Ще». «Новий прихід» records a receipt of the exact offer picked (supplier is a free name with suggestions); after a save the panel stays open for the next roll with metres and document cleared. «Разова витрата» takes a pair the stock holds, shows the balance after it (a shortage becomes a visible minus) and «Куди використано / контрагент». «Видача на завдання» finds an open item (number, client, model or fabric), shows its fabric card and issues by actual cutting: products cut, lines on pairs of «Залишки» covering a planned part or «понад план» with a role, then a check step with plan and fact (P × n / N once per part), metres per product and pair balances before and after, then «Записати». «Вивантажити рух в Excel» reads every page of the current filter into an `.xlsx` (frozen header, filter, text never turns into a formula).
- **«Залишки»** (`/warehouse/stock`, the old `/production/fabric-stock` redirects). One row per fabric and colour (pair) under a fabric row with its codes, composition, density and totals; a fabric row folds (folded by default, opened while a search or a filter is on). Columns that sort: «Залишок, м», «У броні» (what open production plans still need of the pair, from the booking of «Що замовити»), «Вільно» (metres − booked, red below zero) and «Остання операція» (`Ц-14 · 11.11`, `прихід ВН-3201 · 03.11`). Only problems are marked: «Відʼємний» and «Замовити N». Filters: the local search over codes, names and colours, problem chips with counts («Усі», «Відʼємні», «Не вистачає під завдання», «Мало (менше 5 м)»; a chip with 0 hides) and «Постачальник» of the fabric; «Знайдено: N із M». A pair opens its side panel: «Залишок», «У броні», «Вільно», what to order, the lines by code of an alias group, «Під які завдання заброньовано» (task, client, model, metres, what is missing), the last five movements and «Уся історія в «Рух тканини» →» (opens the journal with `?search=` of the pair). For people who may move stock the panel has «Уточнити залишок» (the counted total with a reason; it may not create or deepen a shortage) and «Прихід». The header has «Видача на завдання» and «Прихід»; «Ще» holds «Разова витрата», «Внести початковий залишок», Excel and «Перенесення з v133». «Ще › Завантажити залишки в Excel» exports the whole merged stock whatever the search shows: code, name, composition, density, colour, metres, booked and free, with the Kyiv export time, the count and the total. «Ще › Перенесення з v133» (Admin, `permissions.canTransfer`) opens a side panel: the person picks every `.jsonl` file of the `d1` folder of the old «Цех» export (only the columns the transfer reads are sent, rows keep their file order) and an optional export name for the journal. The server checks it at once without saving: old «Цех», what Brevi gets and what it holds now, errors (block the transfer), notes, and a warning when records entered in Brevi would be removed. «Перенести» replaces the whole stock; with such records only after the confirmation is ticked. The same export again changes nothing.
- **«Внести початковий залишок»** (side panel from «Рух тканини › Ще»; was the page «Початкові залишки»): fabric offer, colour of «Кольори», metres from 0, date; the panel stays open for the next pair. Once per fabric and colour; the server refuses a second one. Openings are the «Початкові» filter of «Рух тканини», with «Сторно».

- **«Звіти › План і факт»** (`/warehouse/reports?tab=plan-fact`). Main fabric by model for items issued for all their products. Figures: tasks and products, plan / fact per product, overspending (red above 5%) with the per cent, «Не порівняти» when there is any. Search (model, client, fabric, `Ц-12`), chips «Усі», «Перевитрата понад 5%», «Не порівняти» (empty ones hide) and a period chip («Усі дати», «Цей місяць», «Минулий місяць», «Цей квартал», «Свій період»; by the day of the last issue, server-side). One row per model sorted by deviation: tasks, plan and fact per product, «Відхилення» (red mark above 5%, «Немає норми» / «Не порівняти» marks, otherwise the number), difference in metres. A model opens its tasks with every material by role in a side panel. One item that cannot be compared makes the difference unknown and is counted.
- **«Звіти › Витрата за період»** (`/warehouse/reports?tab=consumption`, page `fabric-stock`; was the «Зведення витрати» panel of «Рух тканини»). Period chip («Цей тиждень», «Цей місяць» by default, «Минулий місяць», «Цей квартал», «Свій період»); figures «Прийшло», «Видано на завдання», «Разова витрата», «Уточнення»; search; one row per pair with sortable «Прийшло», «На завдання», «Разова», «Уточнення» (and «Видано, грн» for people who see prices).
- **«Що замовити › Тканина»** (`/warehouse/to-order?tab=fabric`, page `fabric-booking`). Figures «Замовити X м» (pairs, suppliers), «У броні», «Вільно на складі», «Без плану» when there is any. Search (fabric, colour, supplier, client, `Ц-12`), chips «Замовити» (default), «Усі пари», «Без плану» with counts, supplier chip. One row per pair: «Постачальник», «Потрібно до» (nearest date of a task still short, red within three days), «Покриття» bar «є X з Y», «Замовити, м»; sorted by the date, then metres. A row opens the queue of tasks in a side panel. «+ Прихід» on a row and in the panel (server `canReceive` and the page «Залишки») opens the receipt with the offer, colour and supplier filled in. «Без плану» lists items with an unknown need and links to «Норми витрати тканини». Reads only.
- **«Звіти › Вартість»** (`/warehouse/reports?tab=valuation`, page `fabric-valuation`). Positive stock at the lowest price of the fabric group in «Тканини». Figures: value (partial when some pairs have no price), metres, «Без ціни», «Дефіцит». Chips «Усі», «Без ціни», «Дефіцит» (the shortage table). One row per fabric, the most valuable first, with metres, price, value and a share bar; a fabric without a price is marked with «До «Тканини»»; a row opens its colours. Time of calculation and price source in the subtitle.
- **«Що замовити › Фурнітура»** (`/warehouse/to-order?tab=hardware`, page `hardware-order`). Full accessory need of open orders by model composition, the nearest due date first. Search (code, name, note, client, task), chips «Усі», «Неповна потреба», «Назву не знайдено» (empty ones hide); columns «Найближчий термін», «Завдань» and «Потреба» with its unit; a missing reference name is marked on the row. A row opens norm × products by task in a side panel. Excel with «Зведена потреба» and «За замовленнями».

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
  queries/stock/stock-problems.ts         # problem chips, counts, supplier filter, column sort
  queries/movements/                      # movement page query, filter change, period presets
  mappers/format/                         # metres, money, Kyiv day and time
  mappers/stock/                          # «Остання операція» label
  mappers/movements/                      # «Операція», «Звідки / куди» and cancel marks of a journal row
  mappers/exports/                        # .xlsx writer (stored zip), stock, movement and accessory workbooks
  entities/reports/stock-reports.ts       # the four reports, result labels, units
  queries/reports/booking-filters.ts      # «Що замовити › Тканина»: search, chips, supplier, sort, coverage
  queries/reports/hardware-filters.ts     # «Що замовити › Фурнітура»: search, chips, sort
  queries/reports/plan-fact-filters.ts    # «План і факт»: deviation %, 5% threshold, chips, search, sort
  queries/reports/consumption-filters.ts, valuation-filters.ts # «Витрата за період» sort and search; «Вартість» chips, sort, share
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
  components/movements/                   # search, kind chips with counts, period chip, «1–50 із N» pager
  panels/movements/                       # details of one movement for its side panel
  components/stock/, panels/stock/        # «Залишки» search, problem and supplier chips; pair details
  dialogs/stock-reason-dialog.tsx         # «Сторно видачі» reason
  dialogs/movement-cancel-dialog.tsx      # «Відмінити операцію…»: «Прибрати з обліку» or storno, with a reason
  panels/item-fabric/item-fabric-card.tsx # item fabric card
  forms/item-issue/                       # issue form and check step
  components/issue-items/                 # items found for «Видача на завдання»
  tables/reports/, components/reports/    # report tables, expandable row, order link, summary figures, filter bar
  panels/reports/                         # «Що замовити» pair: figures and queue of tasks
  panels/stock-transfer/                  # «Перенесення з v133» comparison, errors and notes
  components/menus/warehouse-more-menu.tsx # «Ще» menu of the rare page actions
libs/admin/warehouse/feature/src/
  warehouse.routes.tsx                    # createWarehouseRoutes({ useAccess }): stock, movements, to-order, reports, old-address redirects
  pages/movements|stock|reports/
  pages/to-order/, pages/reports/warehouse-reports-page.tsx # «Що замовити» and «Звіти» tab pages
  pages/tabs/                             # WarehouseTabsPage: tabs by rights in ?tab=, WarehouseTabProps
  components/operations/                  # receipt, opening, issue and adjustment side panels
  components/movements/                   # movement, «Правка руху» and «Історія правок» side panels
  components/stock/                       # «Залишок пари» side panel with its latest movements
  components/reports/                     # «Що замовити» pair and accessory, «План і факт» model side panels
  components/item-issue/                  # ItemFabricSection (exported to production), issue drawer, «Видача на завдання»
  hooks/item-issue/                       # issue in two steps, «Сторно видачі»
  hooks/operations/use-stock-operation.ts # form state, operation id, save
  hooks/movements/                        # «Відмінити операцію…» (void or storno), export of every page
  hooks/debounce/                         # search delay
  hooks/files/download-file.ts
  components/transfer/, hooks/transfer/   # «Перенесення з v133» side panel: files, check, confirmation, transfer
apps/admin-react/src/app/router/
  legacy-menu.ts                          # «Склад тканин» block (four items, tab items accept several access pages)
  use-warehouse-access.ts                 # the tabs' «Права доступу» pages
  admin-route-definitions.tsx             # createWarehouseRoutes behind «Права доступу»
```

## Tests

- `libs/admin/warehouse/model/src/forms/stock-operations/stock-operation-forms.test.ts`
- `libs/admin/warehouse/model/src/forms/movement-edit/movement-edit-form.test.ts`
- `libs/admin/warehouse/model/src/mappers/movements/movement-labels.test.ts`
- `libs/admin/warehouse/model/src/queries/movements/movement-period.test.ts`
- `libs/admin/warehouse/model/src/forms/item-issue/item-issue-form.test.ts`
- `libs/admin/warehouse/model/src/queries/stock/fabric-stock-search.test.ts`
- `libs/admin/warehouse/model/src/queries/stock/stock-problems.test.ts`
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
- `libs/admin/warehouse/model/src/queries/reports/booking-filters.test.ts`, `libs/admin/warehouse/model/src/queries/reports/hardware-filters.test.ts`, `libs/admin/warehouse/model/src/queries/reports/plan-fact-filters.test.ts`, `libs/admin/warehouse/model/src/queries/reports/report-tables.test.ts`, `libs/admin/warehouse/model/src/mappers/exports/hardware-exports.test.ts`
- `libs/admin/warehouse/data-access/src/mappers/stock-reports.mapper.test.ts`
- `libs/admin/warehouse/feature/src/pages/reports/report-pages.component.test.tsx`
- `apps/admin-react/src/app/router/app-router.integration.test.tsx`, `apps/admin-react/src/app/router/navigation-config.unit.test.ts`

Focused run: `npx nx test admin-warehouse-model`, `admin-warehouse-data-access`, `admin-warehouse-ui`, `admin-warehouse-feature`.
