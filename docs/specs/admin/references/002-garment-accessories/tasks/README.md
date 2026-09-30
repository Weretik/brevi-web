# Фурнітура виробу — граф задач

Порядок: backend contract → frontend tooling → read model → MUI table → форма/дії → видалення → route, меню та перевірка. Форма залежить від [списку постачальників](../../001-suppliers/README.md); вкладка «Тканини» стає доступною після [SDD 003](../../003-fabrics/README.md).

| ID     | Одна відповідальність                           | Залежить від   | Задача                                                         |
| ------ | ----------------------------------------------- | -------------- | -------------------------------------------------------------- |
| EN-001 | Канонічний OpenAPI і версія garment-accessories | немає          | [EN-001](EN-001-backend-contract.md)                           |
| EN-002 | Спільний frontend contract tooling              | немає          | [EN-002](../../001-suppliers/tasks/EN-002-contract-tooling.md) |
| TS-001 | Read data-access і модель                       | EN-001, EN-002 | [TS-001](TS-001-read-model.md)                                 |
| TS-002 | MUI таблиця і стани                             | TS-001         | [TS-002](TS-002-grid.md)                                       |
| TS-003 | Створення, перегляд і редагування через форму   | TS-002         | [TS-003](TS-003-form-actions.md)                               |
| TS-004 | Одиночне/масове видалення                       | TS-003         | [TS-004](TS-004-delete.md)                                     |
| TS-005 | Route, меню й інтеграційна перевірка            | TS-004         | [TS-005](TS-005-route-verification.md)                         |
