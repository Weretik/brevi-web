# Admin: «Склад тканин» UX stage 3, «Залишки» with booking

**Status:** implemented 2026-11-12.

**Backend:** [WH-008 in BreviERP](https://github.com/Weretik/BreviERP/tree/main/docs/sdd/specs/warehouse/008-stock-booking-columns) (booked, free, to order, tasks and the latest movement per pair; supplier per fabric).

**Source:** the owner's go on concept A for «Залишки» (2026-11-12): «сколько лежит и сколько из этого уже занято под завдання».

**Feature card:** [«Склад тканин»](../../../../features/admin/warehouse.md). Follows [UX stage 2](../005-movement-journal/README.md).

## Scope

- **Table.** One row per pair under a fabric row with totals; a fabric row folds (folded by default, open while a search or filter is on). Columns «Залишок, м», «У броні», «Вільно» sort, and so does «Тканина / колір»; «Остання операція» shows the latest movement. Standard table height with a sticky header.
- **Problems only.** «Відʼємний» below zero, «Замовити N» when plans need more than there is; «Вільно» is red below zero. The warning banner is gone: chips with counts replace it.
- **Filters.** Local search, problem chips («Усі», «Відʼємні», «Не вистачає під завдання», «Мало (менше 5 м)»; empty chips hide), supplier chip, «Знайдено: N із M».
- **Side panel.** A pair row opens it instead of «Уточнити»: figures, what to order, lines by code, «Під які завдання заброньовано», the last five movements and «Уся історія в «Рух тканини» →» (`?search=` on the journal). «Уточнити залишок» and «Прихід» for people who may move stock.
- **Header.** «Видача на завдання» and «Прихід»; «Ще» holds «Разова витрата», «Внести початковий залишок», Excel (now with «У броні» and «Вільно») and «Перенесення з v133».

## Acceptance

| ID    | Check                                                                                   | Test                                       |
| ----- | --------------------------------------------------------------------------------------- | ------------------------------------------ |
| SB-01 | Fabrics fold; chips count problems and show only those pairs; marks only on problems    | `fabric-stock-page.component.test.tsx`     |
| SB-02 | A pair opens its panel with the tasks that book it and its latest movements             | `fabric-stock-page.component.test.tsx`     |
| SB-03 | «Уточнити залишок» from the panel sends the counted total and refuses a deeper shortage | `fabric-stock-page.component.test.tsx`     |
| SB-04 | Problem counts, supplier filter and column sort                                         | `stock-problems.test.ts`                   |
| SB-05 | The list maps booking, latest movement and older answers without them                   | `fabric-stock.mapper.test.ts`              |
| SB-06 | «Уся історія» opens the journal with the pair's search                                  | `fabric-movements-page.component.test.tsx` |
