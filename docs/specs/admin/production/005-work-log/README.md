# Admin «Швейний цех», stage 5: «Журнал робіт» and «Прогноз пошиття»

**Status:** implemented 2026-11-05. Backend: BreviERP PRD-005 (`docs/sdd/specs/production/005-work-log`). Follows [stage 4](../004-fabric-stock/README.md).

## Scenarios

| ID      | Scenario                                                                                                                                                                                                                                                                                                                                        |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PRD-S8  | «Журнал робіт» (`/production/work`, the head of the workshop and Admin) shows the records of a month (arrows switch it) with filters by worker and order: date, worker, order and model, Пошив or Крій, pieces, rate and details (over-plan reason, comment, «Сторно» with who and why). The header sums the pieces sewn and cut.               |
| PRD-S9  | «Додати роботу» opens a side panel: an item of a «Нове» order, a worker of «Працівники цеху», Пошив or Крій, pieces, date (not later than today), «понад план» with a reason from the server's list, comment. Within the plan the panel shows how many pieces are left and refuses more; the server's 409 message is shown as it is.            |
| PRD-S10 | Every item of an order card has «Робота» for those who see the sewing rate: sewn and cut of the quantity, the records, «Додати роботу» and «Сторно» (with a reason) while the order is «Нове». An item without a sewing rate shows why work cannot be recorded.                                                                                 |
| PRD-S11 | «Прогноз пошиття» (`/production/forecast`, Admin, Manager and the head of the workshop) lists the «Нове» orders in the order they are sewn: pieces left, «Готово до», approximate end of sewing and, for those who see the rate, minutes. The note says it is not a delivery date. The head of the workshop and Admin move an order up or down. |
| PRD-S12 | «Імпорт» (Admin) of `production-work.json` shows the server preview first: each record by worker with order, position and pieces.                                                                                                                                                                                                               |

## Decisions

- Who records, who sees the work, the minutes and the minute cost, and who reorders all come from the server (`permissions.seesSewingRate`, `canRecord`, `settings`, `canReorder`).
- The forecast is the server's; the page only shows it and sends the new order with the queue version, so a stale page gets a 409 message instead of overwriting.
- No «all OK» marks: only «Немає розцінки», «Невідомо» after such an order, «Більше 10 років» and a finish later than «Готово до» are marked, each with its reason; missing parameters show what to fill in «Параметри ціноутворення».
