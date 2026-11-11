# Admin: «Швейний цех»

**Status:** implementation exists, checked 2026-11-05 (stage 8). SDD: [stage 1](../../specs/admin/production/001-workshop-references/README.md) ([consumer contract](../../specs/admin/production/001-workshop-references/contracts/api-contract.md)), [stage 2 «Виробничі завдання»](../../specs/admin/production/002-production-orders/README.md), [stage 3 stages, shipments, files, Telegram](../../specs/admin/production/003-order-tracking/README.md), [stage 4 «Склад тканин»](../../specs/admin/production/004-fabric-stock/README.md), [stage 5 «Журнал робіт» and «Прогноз пошиття»](../../specs/admin/production/005-work-log/README.md), [stage 6 «Робочий час» and «Зарплата»](../../specs/admin/production/006-timesheet-payroll/README.md), [stage 7 «Звіти цеху» and the overview](../../specs/admin/production/007-workshop-reports/README.md), [stage 8 «Архів цеху»](../../specs/admin/production/008-workshop-archive/README.md), [filters and «Зведення за моделями»](../../specs/admin/production/010-order-filters-model-summary/README.md), [«Конвеєр етапів»](../../specs/admin/production/011-order-conveyor/README.md).

The sidebar group «Швейний цех» gets three reference pages for the head of the workshop (role `WorkshopChief`), Admin and the director; the other items of the group without a page stay placeholders for later stages. «Працівники цеху» (`/production/staff`) is the list of workers: they do not sign in, the head of the workshop records their work. Chips switch «Працюють» / «Архів» and filter by position; a worker who left goes «В архів» instead of being deleted. «Норми витрати тканини» (`/production/fabric-norms`, [stage 9](../../specs/admin/production/009-fabric-norms-and-compositions/README.md)) is one work page ([stage 9 revision](../../specs/admin/production/009-fabric-norms-and-compositions/README.md#revision-2026-11-11-one-work-card-per-model)): the list of sewing models from «Товари» on the left, and the work card of the chosen model (`?model=`) on the right with cards «1 колір», «2 кольори», «3 кольори» (each fabric on its own line, «Основна» graphite, «Додаткова» orange, «Разом»), «Підкладка, утеплювач, фліс» and «Решта складу» read from «Товари», and «Рахувати на N шт.» for a batch; only problems get a mark. Both reference lists have «Імпорт» of the transfer JSON with a server preview first. Payroll coefficients are shown only in «Параметри ціноутворення»; the old `/production/payroll-rules` redirects there.

«Виробничі завдання» (`/production/orders`, Admin, Manager and the head of the workshop) is what the workshop sews. A manager makes an order from a КП «під запит» (any saved one, not only one sent from the system; client corrections item 9) at `/production/orders/new`, or with «Передати в цех» in the КП editor's «Цех» block, which saves the КП first and opens the page with it picked (`?quote=`); the block also lists the КП's orders (`QuoteProductionOrders`, given to the quotes routes as `workshopCard`). On the order card the КП number opens the КП; the 28 old orders keep the old number as text. On the page: for each sewing item they pick the fabric and fill in quantity, «Готово до», colours, sizes, technical changes, comment and applications, and see the planned fabric. Colours are picked only from «Кольори» of «Тканини та фурнітура» (a colour the item already has stays; [SDD 019](../../specs/admin/references/019-fabric-colors/README.md)). The list ([SDD 011](../../specs/admin/production/011-order-conveyor/README.md)) opens on «Нові», nearest «Готово до» first, and sorts by «№», «Готово до» or «Створено». Above it the «конвеєр» counts the open orders at each stage (overdue in red) and filters by a stage; a strip appears only when orders are overdue or due within 3 days and narrows the list to them. One row holds search (order or КП number, client, model), «Фільтри» in a side panel (client, period, season, model, fabric, colour, manager) and «Список / Зведення за моделями» (pieces per model of every filtered order, folded «Сортування за пріоритетом», «Переглянути»; [SDD 010](../../specs/admin/production/010-order-filters-model-summary/README.md)); under it status chips with «Прострочені» and the set filters as chips. A row shows the client with its models, the stage with nine marks, the shipped pieces and the due date marked only when it is a problem. «Експорт» to CSV; for Admin «⋯» holds «Імпорт» of the old orders. The card `/production/orders/:id` has «Опис» and «Історія змін», edit in side panels, «Копіювати», «Друк» and, for Admin, «Видалити». Who sees «Розцінка пошиття» and the КП price comes from the server's `permissions`.

An embroidery can point to a saved «Ціна вишивки» calculation («Розрахунок вишивки», searched by name, client or «ВШ-0042»); the КП «Вишивка» rows are put into every item of a new order, and the manager removes what does not apply. The item card then shows the number, stitches, hoop, hoopings, флізелін and fabric metres and the mockup, without prices; a manager or Admin opens the calculation, a removed one stays as its number. Materials are shown only; the stock does not change.

After «Передати в цех» every item shows its «Етапи» (the head of the workshop and Admin tick them; the furthest colours the item) and «Відвантаження» («Відвантажити» side panel, cancel with ×). The header gets «Закрити» when everything is shipped, «Скасувати» with a reason and, for Admin, «Повернути в роботу». Files of the order and of each item are uploaded to the CDN with their kind; old ones are Google Drive links. The Telegram block sends the one message to the workshop group and shows a failure with its reason. For Admin, «⋯» of the list also holds «Імпорт етапів» and «Ціни КП» (КП prices of orders moved from the old «Цех», which kept none, so «Звіти цеху» can value their output; only an item without a price takes one). «Налаштування цеху» (`/production/settings`) picks the Brevi bot's group and topic.

«Склад тканин» is its own menu block right under «Швейний цех», with its own libraries: see [«Склад тканин»](warehouse.md). Every item of an order card has «Тканина»: `ItemFabricSection` of `@admin/warehouse/feature` (the item plan by part, issues with plan and fact, «Видати тканину» by actual cutting, «Оновити план», «Сторно видачі»); see [«Склад тканин»](warehouse.md).

«Журнал робіт» (`/production/work`, the head of the workshop and Admin) lists the work of a month by worker and order: who sewed or cut how many pieces of which item, at which rate. «Додати роботу» records it; within the plan the item's quantity is the limit, more goes as «понад план» with a reason. A wrong record is cancelled by «Сторно» with a reason and stays crossed out. The same «Робота» section is on every item of an order card for those who see the sewing rate. Admin also has «Імпорт» of the old log. «Прогноз пошиття» (`/production/forecast`, the same people as «Виробничі завдання») shows the «Нове» orders in the order they are sewn with the approximate end of sewing from «Параметри ціноутворення»; the head of the workshop and Admin move orders up or down; only problems are marked.

«Робочий час» (`/production/timesheet`, the head of the workshop and Admin) marks the hours of each worker per day in steps of 0,25 with quick 8 / 0 buttons, keeps the history of changes and shows the month by day and by worker. «Зарплата» (`/production/payroll`, the same people) shows a month: master and chief, embroidery, what each worker earned (sewing, cutting, bonus, shares, embroidery, other), was paid and is due, a worker's detail in a side panel and «Excel»; Admin adds payments and adjustments, cancels them with a reason, types «Видано», closes and reopens the month (an unchosen master or chief does not block closing). «Історія за рік» sums the months. All shares come from «Параметри ціноутворення»; only problems are marked.

«Звіти цеху» (`/production/reports`, Admin only) shows whole months, at most 12, optionally against a second period: tab «Огляд» with output at the КП price, accrued pay, fabric issued and the stock at the end, then «Випуск», «Працівники» (with pay per 8 hours), «Видані матеріали» and «Залишки». Only gaps (no price, no hours, negative stock) and payroll warnings are marked; a month closed in «Зарплата» keeps its report. The admin home shows the real workshop board, see [Overview](dashboard.md).

«Архів цеху» (`/production/archive`, the same people as «Виробничі завдання») reads the old «Графік роботи 2017–2026» and «Старі заявки» with «Пошук» and «Від» / «До», opens a line read only with its other fields and links, and lists the closed Brevi orders on «Закриті завдання». Admin has «Імпорт» of workshop-archive.json; a repeated import skips what is already there.

## Structure diagram

```mermaid
flowchart LR
  Menu["legacy-menu.ts: Швейний цех"] --> Router["create-admin-router: RequireRole canManageWorkshop / canUseProductionOrders"]
  Router --> Routes["feature: production.routes.tsx (createProductionRoutes, createProductionOrderRoutes)"]
  Actor["app: use-production-order-actor.ts"] --> Routes
  Routes --> Pages["feature/pages: staff, norms, payroll, orders, work, forecast, timesheet, archive"]
  Pages --> Hooks["feature/hooks: lists, editors, archive, delete, import, orders, requests, stock"]
  Pages --> UI["ui: grids, forms, details, chips, import preview, payroll table, orders"]
  Pages --> RefUI["@admin/references/ui: page header, search, filter row, side panel"]
  Hooks --> DataAccess["data-access: RTK Query endpoints"]
  DataAccess --> Model["model: entities, forms, filters, import file parsing"]
  DataAccess --> API["BreviERP /api/production"]
```

## Code structure

```text
libs/admin/production/
  model/src/
    entities/                     # worker, fabric norm, model composition (layers, lines, units), import result, production order, tracking (stages, files, Telegram, settings), item fabric and issues, work, sewing forecast, timesheet, payroll, workshop report and overview, workshop archive
    forms/                        # worker, norm, order item and order forms, shipment and cancel reason, workshop settings, receipt, correction, issue, work (and months), timesheet hours, payment and adjustment, report period
    queries/                      # list filters, chip counts, order row (due mark, models, stage spread), composition search and quantities, orders and payroll CSV
    validators/                   # reads workshop-staff.json, fabric-norms.json, production-orders.json, production-progress.json, production-work.json, workshop-archive.json
    mappers/format-production.ts  # metres, parameter values, dates
    mappers/format-application.ts # application text, linked embroidery details and link
  data-access/src/
    api/{workshop-staff,fabric-norms,production-orders,production-tracking,workshop-settings,production-work,payroll,workshop-reports,workshop-archive}.api.ts # endpoints (fabric-norms also reads model compositions); production-base-api.ts adds tags
    mappers/                      # runtime-checked response → model
    validators/production-response.ts
    errors/production-api-error.ts
  ui/src/
    staff/  import/  dialogs/
    norms/                        # model list, variant card («Основна» / «Додаткова»), model work card, chips, form
    orders/                       # grid, stage «конвеєр», attention strip, filter side panel and chips, «⋯» menu, status chips, status, item form and card, applications with «Розрахунок вишивки», embroidery block, history, КП list, print sheet
    tracking/                     # stage pill and toggles, shipments, files, Telegram block, shipment form
    settings/                     # workshop settings form
    work/                         # work records table, «Додати роботу» form, item «Робота»
    forecast/                     # forecast queue table with problem marks and up/down
    timesheet/                    # day table, month summary, change history
    payroll/                      # month table with «Видано», payments and adjustments, worker detail, year, roles/embroidery and entry forms
    reports/                      # report totals with comparison and gaps; output, staff, materials and stock tables
    archive/                      # archive grid, read-only line details
  feature/src/
    production.routes.tsx         # createProductionRoutes (workshop), createProductionOrderRoutes, createProductionReportRoutes (Admin); the app wraps them in RequireRole
    pages/staff/
    pages/norms/                  # «Норми витрати тканини»: model list + work card
    pages/orders/                 # list, create from КП, card
    pages/settings/               # «Налаштування цеху»
    pages/work/                   # «Журнал робіт»
    pages/forecast/               # «Прогноз пошиття»
    pages/timesheet/              # «Робочий час»
    pages/payroll/                # «Зарплата»
    pages/reports/                # «Звіти цеху»
    pages/archive/                # «Архів цеху»
    hooks/{staff,norms,import,payroll}/
    hooks/orders/                 # list, export, create, card, editor, copy and delete, «Розрахунок вишивки» search
    hooks/requests/               # debounce, request id against duplicates
    hooks/tracking/               # stages and shipments, close/cancel/reopen
    hooks/files/  hooks/telegram/  hooks/settings/
    hooks/stock/                  # «Сторно» reason dialog state (work, payroll)
    hooks/work/                   # «Додати роботу» editor
    hooks/timesheet/              # a day: typed hours, changes, save
    hooks/archive/                # tab, search, dates, pages of the archive or closed orders
    hooks/payroll/                # payment and adjustment editors, month actions («Видано», cancel, close, reopen)
    components/{staff,norms,import}/ # side panels
    components/orders/            # header and item side panels, header actions, КП item line, order summary
    components/tracking/          # item work (stages, shipments, work, fabric, files), order work (files, Telegram), shipment side panel
    components/work/              # «Додати роботу» side panel, «Сторно» dialog, item «Робота»
    components/payroll/           # month view, roles and embroidery, payment / adjustment / worker side panels
    components/customers/         # client card tab «Завдання в цех» (`CustomerProductionOrders`, `customerId`)
apps/admin-react/src/app/router/  # legacy-menu.ts items, create-admin-router.tsx guards, use-production-order-actor.ts
libs/admin/core/auth/src/session/session-user.ts # WorkshopChief, canManageWorkshop
```

## Tests

- `libs/admin/production/model/src/forms/production-forms.test.ts`, `libs/admin/production/model/src/forms/production-order-forms.test.ts`, `libs/admin/production/model/src/validators/production-import-file.test.ts`, `libs/admin/production/model/src/forms/stock-reason.test.ts`, `libs/admin/production/model/src/forms/production-work-form.test.ts`, `libs/admin/production/model/src/forms/timesheet-form.test.ts`, `libs/admin/production/model/src/forms/payroll-forms.test.ts`, `libs/admin/production/model/src/forms/workshop-report-period.test.ts`, `libs/admin/production/model/src/validators/workshop-archive-import-file.test.ts`
- `libs/admin/production/data-access/src/mappers/production-mappers.test.ts`, `libs/admin/production/data-access/src/mappers/production-order.mapper.test.ts`, `libs/admin/production/data-access/src/mappers/production-tracking.mapper.test.ts`, `libs/admin/production/data-access/src/mappers/production-work.mapper.test.ts`, `libs/admin/production/data-access/src/mappers/payroll.mapper.test.ts`, `libs/admin/production/data-access/src/mappers/workshop-report.mapper.test.ts`, `libs/admin/production/data-access/src/mappers/workshop-archive.mapper.test.ts`
- `libs/admin/production/ui/src/forecast/sewing-forecast-table.component.test.tsx`, `libs/admin/production/ui/src/timesheet/timesheet-day-table.component.test.tsx`, `libs/admin/production/ui/src/payroll/payroll-month-table.component.test.tsx`, `libs/admin/production/ui/src/reports/report-totals.component.test.tsx`
- `libs/admin/production/feature/src/pages/staff/workshop-staff-page.component.test.tsx`, `libs/admin/production/feature/src/pages/norms/fabric-norms-page.component.test.tsx`, `libs/admin/production/feature/src/pages/archive/workshop-archive-page.component.test.tsx`
- `libs/admin/production/feature/src/pages/orders/production-order-create-page.component.test.tsx`, `libs/admin/production/feature/src/pages/orders/production-order-page.component.test.tsx`
- `apps/admin-react/src/app/router/navigation-config.unit.test.ts` (who sees the items)

Focused run: `npx nx run-many -t test -p admin-production-model admin-production-data-access admin-production-ui admin-production-feature`.
