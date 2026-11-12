# Admin: «Склад тканин» UX stage 4, «Що замовити»

**Status:** implemented 2026-11-12.

**Backend:** [WH-009 in BreviERP](https://github.com/Weretik/BreviERP/tree/main/docs/sdd/specs/warehouse/009-to-order-dates) (supplier and «Потрібно до» of a booking pair, due dates of accessory needs, `canReceive`).

**Source:** the owner's go on concept A for «Що замовити» (2026-11-12): what to order first, by the date a task needs it; accessories keep the current calculation (no accessory stock).

**Feature card:** [«Склад тканин»](../../../../features/admin/warehouse.md). Follows [UX stage 3](../006-stock-booking/README.md).

## Scope

- **Тканина, figures.** «Замовити X м» with «N пар · M постачальників», «У броні», «Вільно на складі»; «Без плану» only when some items have no plan.
- **Тканина, filters.** Search over fabric, code, colour, supplier, client and task number; chips «Замовити» (default), «Усі пари», «Без плану» (hidden when empty) with counts; supplier chip; «Знайдено: N».
- **Тканина, table.** One row per pair: «Тканина · колір» (a negative stock is marked), «Постачальник», «Потрібно до» (date and the task, red within three days or past), «Покриття» (bar and «є X з Y»), «Замовити, м». Sorted by «Потрібно до», undated last, then by metres. «+ Прихід» on a row for the stock keepers who also have the page «Залишки»: the receipt panel opens with the fabric offer, colour and supplier filled in.
- **Тканина, side panel.** A row opens the pair: «На складі», «Потреба», «У броні», «Замовити», the shortage already there, and the queue of tasks in order of the orders with date, plan, issued, what is missing; «Прихід» from the panel.
- **«Без плану».** The items with an unknown need and a link to «Норми витрати тканини».
- **Фурнітура.** Same calculation. Search over code, name, note, client and task; chips «Усі», «Неповна потреба», «Назву не знайдено» (hidden when empty); columns «Фурнітура», «Варіант / примітка», «Найближчий термін», «Завдань», «Потреба» with the unit; sorted by the nearest date. A missing name is a mark on the row. A row opens the breakdown norm × products by task in a side panel. Excel unchanged.

## Acceptance

| ID    | Check                                                                                     | Test                                                          |
| ----- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| TO-01 | «Замовити» by default, date and coverage on the row, queue in the panel, other chips      | `report-pages.component.test.tsx`                             |
| TO-02 | «+ Прихід» opens the receipt with the pair and supplier; hidden without «Залишки»         | `report-pages.component.test.tsx`                             |
| TO-03 | Search, chip counts, sort by date then metres, coverage, «soon» within three days         | `booking-filters.test.ts`                                     |
| TO-04 | Receipt preset takes the offer of the code or group, the colour of the list, the supplier | `stock-operation-forms.test.ts`                               |
| TO-05 | Accessories: search, «Назву не знайдено», sort by date, breakdown panel                   | `hardware-filters.test.ts`, `report-pages.component.test.tsx` |
| TO-06 | Mapping of `supplier`, `needBy`, `dueDate`, `canReceive`                                  | `stock-reports.mapper.test.ts`                                |
