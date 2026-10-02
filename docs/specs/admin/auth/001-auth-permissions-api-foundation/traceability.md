# Auth, permissions і API foundation — трасування

| Сценарій | Правила             | Задачі / передумови            | Рівень тестування            | Тести                                   | Свідчення                                      | Статус       |
| -------- | ------------------- | ------------------------------ | ---------------------------- | --------------------------------------- | ---------------------------------------------- | ------------ |
| SC-001   | R-001, R-002, R-004 | EN-001, TS-001, TS-003, TS-004 | інтеграційний                | auth bootstrap integration test         | TS-003/TS-004 evidence                         | verified     |
| SC-002   | R-002, R-003, R-007 | TS-002, TS-003                 | фокусний інтеграційний       | auth header + domain query tests        | TS-002/TS-003 evidence                         | verified     |
| SC-003   | R-003, R-004        | EN-001, TS-002, TS-003         | фокусний інтеграційний       | concurrent 401 refresh/retry test       | TS-002/TS-003 evidence                         | verified     |
| SC-004   | R-004, R-006        | EN-001, TS-002, TS-003         | фокусний інтеграційний       | failed refresh/unauthenticated test     | TS-003 evidence                                | verified     |
| SC-005   | R-005               | EN-001, TS-003, TS-004         | компонентний + інтеграційний | shell logout and cache reset tests      | TS-004 evidence                                | verified     |
| SC-006   | R-006, R-008        | TS-002                         | модульний                    | error normalization/log redaction tests | [TS-002](tasks/TS-002-api-client.md#свідчення) | verified     |
| SC-007   | R-007               | TS-001, TS-002, TS-006         | регресійний                  | current products/references suites      | [TS-002](tasks/TS-002-api-client.md#свідчення) | verified     |
| SC-008   | R-009               | EN-001, EN-002, TS-005         | модульний + інтеграційний    | future feature                          | owner decision 2026-10-02                      | out of scope |

Дозволені переходи статусів: `planned`/`blocked` → `red` → `implemented` →
`verified`. SC-008 не переходить у ready лише через створення каталогу.
