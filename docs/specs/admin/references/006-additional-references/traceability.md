# Додаткові довідники — трасування

| Сценарій | Правила      | Задачі / передумови            | Тести й evidence                                                                                                                             | Статус   |
| -------- | ------------ | ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| SC-001   | R-001        | EN-001, EN-002, TS-001, TS-002 | [EN-001](tasks/EN-001-backend-contract.md), [TS-001](tasks/TS-001-read-model.md), [TS-002](tasks/TS-002-grid.md); mapper/API/component tests | verified |
| SC-002   | R-002, R-005 | TS-002, TS-003                 | [TS-002](tasks/TS-002-grid.md), [TS-003](tasks/TS-003-form-actions.md); component/E2E                                                        | verified |
| SC-003   | R-002–R-004  | EN-001, TS-003                 | [EN-001](tasks/EN-001-backend-contract.md), [TS-003](tasks/TS-003-form-actions.md); API/component/E2E                                        | verified |
| SC-004   | R-002        | TS-002                         | [TS-002](tasks/TS-002-grid.md); component/E2E                                                                                                | verified |
| SC-005   | R-001, R-005 | TS-005                         | [TS-005](tasks/TS-005-route-verification.md); router integration/E2E                                                                         | verified |

Процесна прогалина: поведінковий Red до реалізації TS-* не записано; це позначено в кожній task. Повна feature suite пройшла 31/31 з `--testTimeout=15000 --maxWorkers=2`; стандартний 5-секундний ліміт нестабільний у наявних тестах інших довідників.
