# Admin: «Склад тканин» UX stage 2, the «Рух тканини» journal

**Status:** implemented 2026-11-12.

**Backend:** [WH-007 in BreviERP](https://github.com/Weretik/BreviERP/tree/main/docs/sdd/specs/warehouse/007-movement-journal) (search, period, new kind filters, counts, total, «Залишок пари»).

**Source:** the owner's choice of concept A for «Рух тканини» (2026-11-12) and the decision to merge «Скасувати» and «Сторнувати» into one «Відмінити операцію…» with a choice.

**Feature card:** [«Склад тканин»](../../../../features/admin/warehouse.md). Follows the four-item menu (UX stage 1).

## Scope

- **Filters.** One full-width search (every word must be found in fabric, code, colour, supplier, document, task `Ц-12`, model, destination or note), the kind chips with counts under the other filters («Усі», «Прихід», «На завдання», «Разова витрата», «Уточнення», «Початкові», «Відмінені») and the period chip («Усі дати», «Сьогодні», «Цей тиждень», «Цей місяць», «Минулий місяць», «Свій період» with two dates). The fabric and colour selects are gone; the search covers them. Any change starts from page 1.
- **Table.** One line per movement: date, «Операція», fabric · colour (code, «→» the shelf code of an alias), «Звідки / куди», the signed quantity (a receipt in green) and «Залишок пари». No icon column; the row opens its side panel. Standard table height with a sticky header; pager «1–50 із N».
- **Side panel.** Read-only details of the movement (operation, fabric, where from or to, note, who and when). Footer: «Історія правок» once changed, «Відмінити операцію…» where allowed, «Редагувати» for an active row; all actions only for people who may move stock.
- **«Відмінити операцію…».** One dialog with a required reason (3–500). Options: «Прибрати з обліку» (default, when the row may be edited and is not voided; the row stays with no effect and can be taken back in «Історія правок») and «Записати зворотну операцію (сторно)» (only when the server says `canReverse`). With one option the dialog states it instead of a radio.
- **Problems only.** A cancelled row is greyed with «Прибрано з обліку» or «Сторновано»; a pair balance below zero is red. No marks for normal rows.
- **Excel.** The export uses the same operation names, adds «Залишок пари» and says «Відмінено» instead of «Сторновано».

## Acceptance

| ID    | Check                                                                                                 | Test                                        |
| ----- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| MJ-01 | Chips show counts; a chip, the search and the period go to the query from page 1                      | `fabric-movements-page.component.test.tsx`  |
| MJ-02 | A row shows «Операція», «Звідки / куди», the signed quantity and «Залишок пари»; a click opens it     | `fabric-movements-table.component.test.tsx` |
| MJ-03 | Without the right to move stock the panel is read-only                                                | `fabric-movements-page.component.test.tsx`  |
| MJ-04 | «Відмінити операцію…» defaults to «Прибрати з обліку», needs a reason and can record a storno instead | `fabric-movements-page.component.test.tsx`  |
| MJ-05 | Period presets give the right dates (week from Monday, last month)                                    | `movement-period.test.ts`                   |
| MJ-06 | The page maps `pairMetersAfter`, `total` and `counts`, and older answers without them                 | `fabric-stock.mapper.test.ts`               |
