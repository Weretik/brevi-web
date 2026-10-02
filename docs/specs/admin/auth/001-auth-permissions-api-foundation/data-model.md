# Auth, permissions і API foundation — модель даних

| Модель                  | Власник                                             | Поля та інваріанти                                                                            | Споживачі                               |
| ----------------------- | --------------------------------------------------- | --------------------------------------------------------------------------------------------- | --------------------------------------- |
| `AuthSessionAdapter`    | `admin/shared/api-client` contract                  | `getAccessToken`; optional `refreshAccessToken` і `onUnauthenticated`; не володіє token       | transport runtime/interceptors          |
| In-memory session       | `admin/core/auth`                                   | nullable opaque access token; ніколи не серіалізується у storage, URL або logs                | auth lifecycle adapter                  |
| `LoginRequest`          | generated operation type at auth transport boundary | визначається versioned OpenAPI; не дублюється вручну                                          | `admin/core/auth` public login contract |
| `ApiRequest`            | `admin/shared/api-client`                           | URL, method, body/data, params, headers; RTK Query cancellation передається як signal         | domain `injectEndpoints`                |
| `ApiError`              | `admin/shared/api-client`                           | stable code/status/message; optional field errors/trace ID; no raw response                   | Admin feature error UX                  |
| `AppConfig`             | `admin/shared/config`                               | Brevi name/version, API base URL, router base, flags/log switch; parsed once from environment | app bootstrap, transport, logging       |
| Permission input/policy | `[NEEDS CLARIFICATION]` via EN-002                  | stable backend-derived identifiers; deny on unknown; no invented roles                        | first agreed route/action consumer      |

Generated auth DTO залишаються на transport boundary. Permission inputs не
виводяться з UI labels і не зберігаються як незалежне джерело істини frontend.
