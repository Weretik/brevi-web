# Admin «Швейний цех», stage 8: «Архів цеху» and the move off the old «Цех»

**Status:** implemented 2026-11-05. Backend: BreviERP PRD-008 (`docs/sdd/specs/production/008-workshop-archive`). Follows [stage 7](../007-workshop-reports/README.md).

## Scenarios

| ID      | Scenario                                                                                                                                                                                                                                                    |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PRD-S25 | «Архів цеху» (`/production/archive`, the same people as «Виробничі завдання»; menu «Швейний цех», in place of the «Графік роботи» placeholder) has tabs «Графік роботи 2017–2026», «Старі заявки» and «Закриті завдання».                                   |
| PRD-S26 | The two old books are server pages with «Пошук» (every word must match) and «Від» / «До» dates; a «Від» later than «До» is named instead of asking the server. Columns: date (or the text the old book had), №, client, product, quantity, fabric.          |
| PRD-S27 | A line opens in a read-only side panel without «Редагувати»: the main fields, status and notes, «Інші поля» and «Посилання» (the Google document, the site page, attachments), each opening in a new tab. Nothing in the archive can be changed.            |
| PRD-S28 | «Закриті завдання» lists the closed Brevi orders with the same «Пошук»; a row opens the order card.                                                                                                                                                         |
| PRD-S29 | Admin has «Імпорт»: the side panel takes workshop-archive.json, previews what is new and what is already there, and saves only without errors. A repeated import skips the lines already moved, so a fresh export before the cutover only adds what is new. |

## Decisions

- The archive is a reading copy of the old books; the closed Brevi orders are not copied into it.
- No «all OK» marks; only a wrong period and import errors are shown.
- The cutover (fresh export of the old «Цех», import again, check the counts, switch the old app off) is the owner's decision, backend PRD-D58.
