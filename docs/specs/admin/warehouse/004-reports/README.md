# Admin: «Склад тканин» stage 5, the four reports

**Status:** implemented 2026-11-11.

**Backend:** [WH-005 in BreviERP](https://github.com/Weretik/BreviERP/tree/main/docs/sdd/specs/warehouse/005-reports).

**Source:** TZ «Brevi — склад тканин» v1.0 (old «Цех» v133), sections 11–14 and 6.3.

**Feature card:** [«Склад тканин»](../../../../features/admin/warehouse.md). Follows [stage 4](../003-issue-by-cutting/README.md).

## Scope

- The four disabled sub-items of «Склад тканин» become pages. Each is its own page of «Права доступу», so the menu shows it only to people with that right.
- «Рух тканини» gets the column «На 1 виріб». The movement export gets it too.

| Page                      | Route                  | «Права доступу»    | Default                       |
| ------------------------- | ---------------------- | ------------------ | ----------------------------- |
| «План і факт»             | `/warehouse/plan-fact` | `fabric-plan-fact` | Admin, Manager, WorkshopChief |
| «Бронь і що замовити»     | `/warehouse/booking`   | `fabric-booking`   | Admin, Manager, WorkshopChief |
| «Вартість складу»         | `/warehouse/valuation` | `fabric-valuation` | Admin (the owner)             |
| «Фурнітура до замовлення» | `/warehouse/hardware`  | `hardware-order`   | Admin, WorkshopChief          |

## Pages

- **«План і факт».** Filters «Модель», «Замовник», «Тканина» and «Показати». Figures: orders, products, plan and fact per product, and the total difference. The table shows models with orders, products, plan, fact and difference per product, and the result. A model opens «Замовлення і тканини»: each order (a link to its card), its plan, fact and reason, and each material by role with plan, fact («не зафіксовано» when nothing was issued), difference and the fabrics actually used. A warning says how many items cannot be compared, and another how many are still being cut.
- **«Бронь і потреба в тканині».** «Оновити розрахунок», with the time of the calculation. Figures: booked, free and to order. When some plans are unknown, a warning appears. Search covers fabric, colour, client and order number. The switch «Лише те, що потрібно замовити» hides the rest. A pair opens its queue: order and client, due date, model and role, plan, covered by issues, still needed, booked and to order. When the pair is already short, that shows apart. «Невідомий план» lists items with the reason.
- **«Вартість тканин на складі».** «Оновити ціни і залишки», with the time of the calculation and the price source. Figures: the value (of the priced part, when some prices are missing), positive metres, «Без ціни» and the shortage. The table shows fabric and colour with metres, price and value, a subtotal per fabric (with the offer the price came from), and the total. «Дефіцит» is a separate table.
- **«Фурнітура до замовлення».** «Повна потреба… Складські залишки та видачі не віднімаються.» Buttons «Оновити» and «Excel». Figures: active orders, item models and accessory lines. The table shows «Фурнітура», «Варіант / примітка», «Одиниця» and «Потреба». A line opens its shares by order: norm × products = need. «Потреба неповна» and «Потрібна перевірка назв» are separate sections. The Excel has two sheets, «Зведена потреба» and «За замовленнями». The second sheet also holds the incomplete lines and the name warnings.

Only problems are coloured: to order, shortage, overspending, «Без ціни», unchecked names.

## Code

- Model: `entities/reports/stock-reports.ts`, `queries/reports/booking-search.ts`, `mappers/exports/hardware-exports.ts`, `formatPerProduct` and `formatQuantity`.
- Data access: `api/stock-reports.api.ts` and `mappers/stock-reports.mapper.ts`. The reports refresh when the stock or a fabric card changes.
- UI: `tables/reports/*`, `components/reports/expandable-row.tsx`, `order-link.tsx` and `report-stats.tsx`.
- Feature: `pages/reports/*` and the four routes.
- App: the menu items take their paths and access keys. The `requiredRoles` of «Вартість складу» gives way to its own access page.

## Tests

- `libs/admin/warehouse/model/src/queries/reports/booking-search.test.ts`
- `libs/admin/warehouse/model/src/mappers/exports/hardware-exports.test.ts`
- `libs/admin/warehouse/data-access/src/mappers/stock-reports.mapper.test.ts`
- `libs/admin/warehouse/feature/src/pages/reports/report-pages.component.test.tsx`
- `apps/admin-react/src/app/router/app-router.integration.test.tsx`: a Manager sees «План і факт» and «Бронь» but not «Фурнітура до замовлення».
