# Admin «Швейний цех», stage 2: «Виробничі завдання»

**Status:** implemented 2026-11-04. Backend: BreviERP PRD-002 (`docs/sdd/specs/production/002-production-orders`). Stage 3 adds stages of work, shipments, files and Telegram.

## Scenarios

| ID      | Scenario                                                                                                                                                                                                                       |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| PRD-O1  | Admin, Manager and the head of the workshop see «Виробничі завдання» first in «Швейний цех»; other roles get «Немає доступу».                                                                                                  |
| PRD-O2  | The list: search by number, client, КП or model; chips by status with counts and «Прострочені»; a manager filter when there are several; server pages of 50; an overdue «Нове» order is marked red.                            |
| PRD-O3  | «Експорт» downloads every order the filters show as a CSV that Excel opens (BOM, «;»).                                                                                                                                         |
| PRD-O4  | «Нове завдання» (Admin, Manager): pick a sent КП, then for each sewing item choose whether it goes, its fabric, quantity, «Готово до», colours, sizes, technical changes, comment and applications; planned fabric shows live. |
| PRD-O5  | «Передати в цех» sends one request id per attempt, so a repeated press does not make a second order.                                                                                                                           |
| PRD-O6  | The card: «Опис» (header and every item) and «Історія змін» (who changed which field, before and after).                                                                                                                       |
| PRD-O7  | Editing the header or an item happens in a side panel and only while the order is «Нове» and the server allows it (`permissions.canEdit`).                                                                                     |
| PRD-O8  | «Розцінка пошиття» is shown and edited only by Admin and the head of the workshop; the КП price for reports only by Admin and the director. The server hides both, the page only follows `permissions`.                        |
| PRD-O9  | «Копіювати» makes a new «Нове» order with the same items; «Видалити» is for Admin only, with confirmation; «Друк» prints only the order sheet, without prices.                                                                 |
| PRD-O10 | «Імпорт» (Admin) of `production-orders.json` from the old «Цех» with the server preview first.                                                                                                                                 |

## Decisions

- Colours are free text for now; a colour reference may come later.
- The manager picks which КП price goes to reports (default «Опт»); old orders have none.
- The router guards only the section; who may create and import comes from `useProductionOrderActor` in the app, everything else from the server's `permissions` of the order.
- No «all OK» marks: only problems (no fabric in the КП, no norm, overdue) get one.
