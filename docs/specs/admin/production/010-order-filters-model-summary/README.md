# Admin «Швейний цех»: filters and «Зведення за моделями» on «Виробничі завдання»

**Status:** implemented 2026-11-11. Backend: BreviERP PRD-010 (`docs/sdd/specs/production/010-order-filters-model-summary`). Reference: the owner's screenshots of the old «Цех» filters, «Зведення за моделями» and «Сортування за пріоритетом» (2026-11-11); the owner asked for the same fields in Brevi's own design, not a copy. Changes [stage 2](../002-production-orders/README.md).

## Scenarios

| ID      | Scenario                                                                                                                                                                                                                                                                                                                         |
| ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PRD-S39 | Above the search, a «Фільтри» panel holds «Замовник», «Період від / до», «Сезон», «Модель», «Тканина», «Колір». Values come from `getProductionOrderFilterOptions`. «Згорнути» folds it; folded, every set filter stays visible as a chip with a remove cross. «Скинути (N)» clears them.                                        |
| PRD-S40 | A period that ends before it starts is marked under «Період до» and is not sent.                                                                                                                                                                                                                                                 |
| PRD-S41 | Search covers the order or КП number; the stage select, status chips (including «Скасовані») and the manager stay in the row under the search.                                                                                                                                                                                   |
| PRD-S42 | Tabs «Завдання» and «Зведення за моделями» share the filters. The summary loads only on its tab: Сезон, Модель (code and name), Категорія, Кількість виробів, «Переглянути (N)», footer «Усього виробів». It counts every filtered order, not the page.                                                                          |
| PRD-S43 | «Сортування за пріоритетом» above the table: numbered levels «Спершу за / Потім за» with a field (Сезон, Модель, Категорія, Кількість виробів, Кількість завдань; each once), «Зростання / Спадання», up and down, «Прибрати», and «Додати поле». Default: season, model, category. A row without season or category stays last. |
| PRD-S44 | «Переглянути» sets the «Модель» filter and opens the «Завдання» tab on the first page.                                                                                                                                                                                                                                           |
| PRD-S45 | «Експорт» takes the same filters.                                                                                                                                                                                                                                                                                                |

## Decisions

- Sorting is on the page: the summary is small (one row per model) and the order changes without a request.
- The sort is not saved between visits.
- Access is the page `production-orders`; nothing new in «Права доступу».

## File-role map

| Role        | Files                                                                                                                                                                                        |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Model       | `model/src/entities/production-order.ts` (filters, options, summary), `model/src/queries/model-summary-sort.ts`                                                                              |
| Data access | `data-access/src/api/production-orders.api.ts` (`getProductionModelSummary`, `getProductionOrderFilterOptions`, filter params), `data-access/src/mappers/production-order-filters.mapper.ts` |
| UI          | `ui/src/orders/production-order-filters.tsx`, `ui/src/orders/production-model-summary-table.tsx`, `ui/src/orders/model-summary-sort-editor.tsx`                                              |
| Feature     | `feature/src/hooks/orders/use-production-orders.ts`, `feature/src/hooks/orders/use-production-model-summary.ts`, `feature/src/pages/orders/production-orders-page.tsx`                       |
| Tests       | `model-summary-sort.test.ts`, `production-order-filters.mapper.test.ts`, `production-order-summary.component.test.tsx`, `production-orders-page.component.test.tsx`                          |
