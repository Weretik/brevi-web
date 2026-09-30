# Трасування — Медіа/Фото

| Сценарій | Правила                    | Задачі                         | Рівень                   | Автоматичні свідчення                                        | Статус   |
| -------- | -------------------------- | ------------------------------ | ------------------------ | ------------------------------------------------------------ | -------- |
| SC-001   | R-001–R-003, R-009         | EN-001, TS-001, TS-002, TS-005 | component + router + E2E | page test, router tests, `media.spec.ts`                     | verified |
| SC-002   | R-003                      | TS-001, TS-002                 | data + component         | retained-list/retry page test                                | verified |
| SC-003   | R-004, R-009               | TS-001, TS-002                 | data + component         | locale filter and search page tests                          | verified |
| SC-004   | R-005, R-006, R-009, R-010 | EN-001, TS-001, TS-003, TS-005 | data + component + E2E   | upload contract/page/browser tests                           | verified |
| SC-005   | R-005, R-006               | EN-001, TS-001, TS-003         | data + component         | MIME validation and upload error tests                       | verified |
| SC-006   | R-007, R-009, R-010        | EN-001, TS-001, TS-004, TS-005 | data + component + E2E   | delete API, confirm/focus and browser tests                  | verified |
| SC-007   | R-007, R-008               | EN-001, TS-001, TS-004, TS-005 | data + component + E2E   | 409 transport/dialog/browser cases                           | verified |
| SC-008   | R-010                      | EN-001, TS-001, TS-005         | integration              | frontend rejects non-2xx; endpoint authorization unavailable | deferred |

SC-008 лишається deferred, бо React Admin не має shared auth/session boundary,
а поточні backend catalog/reference controllers використовують `AllowAnonymous`.
Решта contract, UI та browser поведінки перевірена на pinned backend contract.
