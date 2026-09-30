# Додаткові довідники — граф задач

Порядок: backend contract → frontend tooling → read model → MUI table → форма/дії → route, меню та перевірка.

| ID     | Одна відповідальність                             | Залежить від   | Задача                                                         |
| ------ | ------------------------------------------------- | -------------- | -------------------------------------------------------------- |
| EN-001 | Канонічний OpenAPI і версія additional-references | немає          | [EN-001](EN-001-backend-contract.md)                           |
| EN-002 | Спільний frontend contract tooling                | немає          | [EN-002](../../001-suppliers/tasks/EN-002-contract-tooling.md) |
| TS-001 | Read data-access і модель                         | EN-001, EN-002 | [TS-001](TS-001-read-model.md)                                 |
| TS-002 | MUI таблиця і стани                               | TS-001         | [TS-002](TS-002-grid.md)                                       |
| TS-003 | Редагування через форму                           | TS-002         | [TS-003](TS-003-form-actions.md)                               |
| TS-005 | Route, меню й інтеграційна перевірка              | TS-003         | [TS-005](TS-005-route-verification.md)                         |
