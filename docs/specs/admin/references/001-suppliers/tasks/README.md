# Постачальники — граф задач

Порядок: backend contract → frontend tooling → read model → MUI table → форма/дії → видалення → route, меню та перевірка.

| ID     | Одна відповідальність                                      | Залежить від   | Задача                                 |
| ------ | ---------------------------------------------------------- | -------------- | -------------------------------------- |
| EN-001 | Канонічний OpenAPI і версія suppliers                      | немає          | [EN-001](EN-001-backend-contract.md)   |
| EN-002 | Спільний frontend contract tooling для всіх table-features | немає          | [EN-002](EN-002-contract-tooling.md)   |
| TS-001 | Read data-access і модель                                  | EN-001, EN-002 | [TS-001](TS-001-read-model.md)         |
| TS-002 | MUI таблиця і стани                                        | TS-001         | [TS-002](TS-002-grid.md)               |
| TS-003 | Створення, перегляд і редагування через форму              | TS-002         | [TS-003](TS-003-form-actions.md)       |
| TS-004 | Одиночне/масове видалення                                  | TS-003         | [TS-004](TS-004-delete.md)             |
| TS-005 | Route, меню й інтеграційна перевірка                       | TS-004         | [TS-005](TS-005-route-verification.md) |
| TS-006 | Сторінка у стилі «Цех», пошук і дії рядка                  | TS-001–TS-005  | [TS-006](TS-006-workshop-page.md)      |
| TS-007 | Закриття локального аудиту AF-001–AF-003                   | TS-006         | [TS-007](TS-007-audit-fixes.md)        |
