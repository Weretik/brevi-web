# Оболонка React Admin — трасування

| Сценарій | Правила      | Задачі / передумови            | Рівень тестування                            | Тести                                                                                      | Свідчення                                                                   | Статус   |
| -------- | ------------ | ------------------------------ | -------------------------------------------- | ------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------- | -------- |
| SC-001   | R-001, R-004 | EN-001, TS-001, TS-002, TS-004 | компонентний + інтеграційний + ручний вигляд | `admin-layout.component.test.tsx`, `app-router.integration.test.tsx`                       | [TS-002](tasks/TS-002-layout.md), [TS-004](tasks/TS-004-app-routing.md)     | verified |
| SC-002   | R-002        | EN-001, TS-003, TS-004         | інтеграційний + browser                      | `admin-layout.component.test.tsx`, `admin-react.shell.spec.ts`                             | [TS-003](tasks/TS-003-navigation.md), [TS-004](tasks/TS-004-app-routing.md) | verified |
| SC-003   | R-003        | EN-001, TS-003                 | компонентний + browser                       | `admin-layout.component.test.tsx`, `admin-react.shell.spec.ts`                             | [TS-003](tasks/TS-003-navigation.md)                                        | verified |
| SC-004   | R-004        | TS-001, TS-002                 | модульний + інтеграційний + browser          | `brevi-theme.unit.test.ts`, `app-router.integration.test.tsx`, `admin-react.shell.spec.ts` | [TS-001](tasks/TS-001-brevi-theme.md), [TS-002](tasks/TS-002-layout.md)     | verified |
| SC-005   | R-005        | EN-001, TS-002, TS-003         | компонентний                                 | `admin-layout.component.test.tsx`                                                          | [TS-002](tasks/TS-002-layout.md), [TS-003](tasks/TS-003-navigation.md)      | verified |
| SC-006   | R-006        | EN-001, TS-004                 | інтеграційний + browser                      | `app-router.integration.test.tsx`, `admin-react.shell.spec.ts`                             | [TS-004](tasks/TS-004-app-routing.md)                                       | verified |

Результати команд і ручного огляду записані в задачах. Наявний test harness і
історичні записи міграції не використовуються як свідчення цих сценаріїв.
