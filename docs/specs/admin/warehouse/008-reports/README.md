# Admin: «Склад тканин» UX stage 5, «Звіти»

**Status:** implemented 2026-11-12.

**Backend:** [WH-010 in BreviERP](https://github.com/Weretik/BreviERP/tree/main/docs/sdd/specs/warehouse/010-report-periods) (period of «План і факт» by the last issue; issues to tasks and one-off apart in «Витрата за період»).

**Source:** the owner's go «начинай» on concept A for «Звіти» (2026-11-12). Last stage of the «Склад тканин» redesign.

**Feature card:** [«Склад тканин»](../../../../features/admin/warehouse.md). Follows [UX stage 4](../007-to-order/README.md).

## Scope

- **План і факт.** Figures (tasks, plan / fact per product, overspending with per cent, «Не порівняти»); live search over model, client, fabric and task instead of three fields and «Показати»; chips «Усі», «Перевитрата понад 5%», «Не порівняти»; period chip (server-side, by the day of the last issue; «Усі дати» by default). Rows sorted by deviation; red only above 5% overspending, economy is just a number. A model opens its tasks and fabrics in a side panel instead of nested rows.
- **Витрата за період.** Period chip («Цей місяць» by default), figures «Прийшло», «Видано на завдання», «Разова витрата», «Уточнення», search, sortable columns.
- **Вартість.** One row per fabric sorted by value with a share bar; colours on expand; chips «Усі», «Без ціни», «Дефіцит»; «Немає ціни» marks with «До «Тканини»».
- **No refresh buttons.** Reports are recalculated when opened and after saves; the time of calculation stays in the subtitle.

## Acceptance

| ID    | Check                                                                                 | Test                                                          |
| ----- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| RP-01 | «План і факт» sorted by deviation, red over 5%, chips filter, a model opens its tasks | `report-pages.component.test.tsx`                             |
| RP-02 | A period preset is sent to the server                                                 | `report-pages.component.test.tsx`                             |
| RP-03 | Deviation, threshold, counts, search, sort                                            | `plan-fact-filters.test.ts`                                   |
| RP-04 | «Витрата за період» figures by kind and column sort                                   | `report-pages.component.test.tsx`, `report-tables.test.ts`    |
| RP-05 | «Вартість» by value, share, unpriced mark and link, shortage chip                     | `report-pages.component.test.tsx`, `report-tables.test.ts`    |
| RP-06 | Mapping of `issuedOn`, `issuedToTasks`, `oneOff`, `corrected`                         | `stock-reports.mapper.test.ts`, `fabric-stock.mapper.test.ts` |
| RP-07 | «Цей квартал» range                                                                   | `movement-period.test.ts`                                     |
