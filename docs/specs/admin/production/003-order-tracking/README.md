# Admin «Швейний цех», stage 3: stages, shipments, files and Telegram

**Status:** implemented 2026-11-04. Backend: BreviERP PRD-003 (`docs/sdd/specs/production/003-order-tracking`). Follows [stage 2](../002-production-orders/README.md).

## Scenarios

| ID     | Scenario                                                                                                                                                                                                                                           |
| ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PRD-T1 | Every item on the card shows its «Етапи»; the head of the workshop and Admin tick several at once on a «Нове» order, the others only see the ticked ones. The furthest stage colours the item's left edge.                                         |
| PRD-T2 | «Відвантажити» opens a side panel with the rest of the item and today; a shipment cannot be larger than the rest; a wrong one is cancelled with ×. «Відвантажено N з M шт.» stays under the item.                                                  |
| PRD-T3 | «Закрити» appears when everything is shipped; «Скасувати» asks for a reason, which then shows on the card; Admin alone gets «Повернути в роботу».                                                                                                  |
| PRD-T4 | «Додати файл» on the order or an item asks for the kind (розміри, нанесення, додатковий, фото) and uploads up to 20 MB of any type; files open in a new tab; deleting asks first.                                                                  |
| PRD-T5 | The Telegram block shows only what needs attention: «Надіслати в цех», a failure with its reason and «Надіслати ще раз», or a warning that the group is not set (with a link for the head of the workshop). A sent message shows when and by whom. |
| PRD-T6 | The list gets an «Етап» column (the least advanced item) and filter; the CSV gets «Етап».                                                                                                                                                          |
| PRD-T7 | «Налаштування цеху» (`/production/settings`, head of the workshop and Admin): the group from the Brevi bot's groups, an optional topic number, sending on or off, and «Надіслати перевірку».                                                       |
| PRD-T8 | «Імпорт етапів» (Admin) of `production-progress.json` with the server preview first.                                                                                                                                                               |

## Decisions

- Who may tick, ship, close, cancel, reopen, manage files and send comes from the order's `permissions`; the page never decides it.
- Each change answers with the whole card, so the page shows the server's state and the list is refreshed.
- No «all OK» marks: a sent Telegram message is a quiet line, problems are alerts with their reason.
