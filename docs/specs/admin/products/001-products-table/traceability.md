# Товари — трасування

| Сценарій | Правила      | Задачі                         | Перевірка                                                                                                 | Статус   |
| -------- | ------------ | ------------------------------ | --------------------------------------------------------------------------------------------------------- | -------- |
| SC-001   | R-001, R-002 | EN-001, EN-002, TS-001, TS-002 | [TS-001/002 evidence](tasks/evidence.md#ts-001), API tests і product E2E: server total/page, search reset | verified |
| SC-002   | R-003, R-007 | TS-003, TS-007                 | [TS-003 evidence](tasks/evidence.md#ts-003), browser direct detail/404                                    | verified |
| SC-003   | R-004, R-005 | EN-001, TS-004                 | [TS-004 evidence](tasks/evidence.md#ts-004), browser create/400 draft retention                           | verified |
| SC-004   | R-004, R-005 | EN-001, TS-005                 | [TS-005 evidence](tasks/evidence.md#ts-005), nested draft/PUT/browser edit                                | verified |
| SC-005   | R-006        | TS-006                         | [TS-006 evidence](tasks/evidence.md#ts-006), confirm/delete/409 tests                                     | verified |
| SC-006   | R-001, R-007 | TS-002, TS-007                 | [TS-007 evidence](tasks/evidence.md#ts-007), app routing і browser themes/widths                          | verified |

Процесний виняток: поведінковий TDD Red перед реалізацією не зафіксований; це прозоро вказано в [evidence](tasks/evidence.md). Усі сценарії мають поточні Green і regression перевірки.
