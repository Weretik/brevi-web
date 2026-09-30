# Товари — граф задач

Спершу узгодити історичну SDD й зафіксувати backend контракт; далі створити tooling та реалізувати сценарії окремими задачами. Для lookup категорій і media upload не припускати готовність OpenAPI.

| ID     | Одна відповідальність                                | Залежить від   | Задача                                 |
| ------ | ---------------------------------------------------- | -------------- | -------------------------------------- |
| EN-001 | Узгодити й зафіксувати backend contract та стару SDD | немає          | [EN-001](EN-001-contract-reconcile.md) |
| EN-002 | Відтворювані snapshot/types/check                    | EN-001         | [EN-002](EN-002-contract-tooling.md)   |
| TS-001 | Product read data-access                             | EN-002         | [TS-001](TS-001-read-model.md)         |
| TS-002 | Список і server controls                             | TS-001         | [TS-002](TS-002-list-grid.md)          |
| TS-003 | Деталі                                               | TS-001         | [TS-003](TS-003-detail.md)             |
| TS-004 | Створення                                            | TS-003         | [TS-004](TS-004-create.md)             |
| TS-005 | Повне редагування                                    | TS-004         | [TS-005](TS-005-edit.md)               |
| TS-006 | Видалення                                            | TS-002, TS-003 | [TS-006](TS-006-delete.md)             |
| TS-007 | Маршрути, меню й E2E                                 | TS-002–TS-006  | [TS-007](TS-007-route-verification.md) |
