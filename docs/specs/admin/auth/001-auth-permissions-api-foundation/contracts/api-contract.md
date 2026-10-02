# Auth, permissions і API foundation — споживання API-контракту

## Джерело та версія

- Backend repository: `https://github.com/Weretik/BreviERP.git`
- Канонічний OpenAPI entry point у backend: `docs/sdd/contracts/openapi.yaml`
- Поточна зафіксована версія backend:
  `79cccf9b88168b726ac588640f6b397c0ed9afd4`
- Frontend snapshot: `docs/contracts/openapi/backend/openapi.yaml`; provenance:
  `docs/contracts/openapi/SOURCE.json`
- Generated types: `libs/admin/shared/contracts/src/generated/openapi.ts`,
  `npm run contracts:generate`
- Статус: **verified** — auth operationId/schemas і відновлений
  `deleteCatalogMedia` синхронізовані, згенеровані та пройшли contract gate.

| `operationId`       | Метод і шлях                     | Сценарії               | Статус у snapshot                        |
| ------------------- | -------------------------------- | ---------------------- | ---------------------------------------- |
| `loginSession`      | `POST /api/auth/session/login`   | SC-001, SC-002         | generated                                |
| `refreshSession`    | `POST /api/auth/session/refresh` | SC-001, SC-003, SC-004 | generated                                |
| `logoutSession`     | `POST /api/auth/session/logout`  | SC-005                 | generated                                |
| `getCurrentSession` | `GET /api/auth/session/me`       | future permissions     | generated; not consumed in this delivery |

Назви підтверджені versioned OpenAPI на immutable backend commit.

## Рішення frontend

- Request mapping: login/refresh/logout/me використовують generated operation
  types; refresh читає погоджену CSRF cookie і передає погоджений header;
  credentials увімкнені за contract.
- Response validation та mapping: response перевіряється на transport boundary;
  назовні виходить opaque access token/session model, а не generated DTO.
- Помилки: `401` завершує/поновлює session за сценарієм; `403` є окремою
  authorization відмовою; raw response не показується.
- Пагінація/сортування/фільтрація: n/a.
- Кеш та інвалідація: auth token не кешується RTK Query; logout очищає API cache;
  `/me` policy буде визначена `EN-002`.
- Повторні запити та скасування: один shared refresh promise, один retry на
  original request, no retry для auth session URLs; AbortSignal передається Axios.
- Обмеження: login page і permission matrix не входять до ready scope без
  окремих погоджених вимог.

## Перевірки та передумови

- [x] EN-001 додав усі session operations до backend OpenAPI та зафіксував commit.
- [x] `npm run contracts:sync -- <backend-checkout> <commit>` виконано.
- [x] `npm run contracts:generate` виконано.
- [x] `npm run contracts:check` виконано.
- [x] Generated types використовуються без ручних auth DTO.
- [x] Runtime mapping та негативні refresh/logout tests пройшли.
