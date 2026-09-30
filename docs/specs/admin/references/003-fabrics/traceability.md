# Тканини — трасування

| Сценарій | Правила             | Задачі / передумови            | Рівень                  | Тести (план)                                                         | Свідчення                                                              | Статус   |
| -------- | ------------------- | ------------------------------ | ----------------------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------- | -------- |
| SC-001   | R-001               | EN-001, EN-002, TS-001, TS-002 | data-access + component | `fabrics.mapper.unit.test.ts`, `fabrics-page.component.test.tsx`     | [TS-001](tasks/TS-001-read-model.md), [TS-002](tasks/TS-002-grid.md)   | verified |
| SC-002   | R-002, R-005        | TS-002, TS-003                 | component + E2E         | `fabrics-page.component.test.tsx`                                    | [TS-002](tasks/TS-002-grid.md), [TS-003](tasks/TS-003-form-actions.md) | verified |
| SC-003   | R-002–R-004         | EN-001, TS-003                 | integration + component | `fabrics.api.integration.test.ts`, `fabrics-page.component.test.tsx` | [TS-003](tasks/TS-003-form-actions.md)                                 | verified |
| SC-004   | R-002, R-004, R-006 | EN-001, TS-004                 | component + integration | `fabrics-page.component.test.tsx`                                    | [TS-004](tasks/TS-004-delete.md)                                       | verified |
| SC-005   | R-001, R-005        | TS-005                         | integration + E2E       | `app-router.integration.test.tsx`, `admin-react.shell.spec.ts`       | [TS-005](tasks/TS-005-route-verification.md)                           | verified |
