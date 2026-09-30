# Медіа/Фото — граф задач

Порядок: backend contract → data-access → gallery → upload/delete → route і
критична перевірка.

| ID     | Одна відповідальність            | Залежить від   | Статус                | Задача                                     |
| ------ | -------------------------------- | -------------- | --------------------- | ------------------------------------------ |
| EN-001 | Production media API contract    | немає          | done; auth deferred   | [EN-001](EN-001-backend-media-contract.md) |
| TS-001 | Media model, mapping і transport | EN-001         | done                  | [TS-001](TS-001-media-data-access.md)      |
| TS-002 | Gallery, search і read states    | TS-001         | done                  | [TS-002](TS-002-media-gallery.md)          |
| TS-003 | Upload одного фото               | TS-001, TS-002 | done                  | [TS-003](TS-003-media-upload.md)           |
| TS-004 | Підтверджене видалення           | TS-001, TS-002 | done                  | [TS-004](TS-004-media-delete.md)           |
| TS-005 | Route, menu і browser journey    | TS-002–TS-004  | done; SC-008 deferred | [TS-005](TS-005-route-verification.md)     |

Кожна TS виконується через Red/Green/Refactor/Regression і завершується
оновленням `code-audit/audit.md` для змінених областей.
