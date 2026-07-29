# API-архітектура Admin

**Область:** `apps/admin`  
**Статус:** чинний  
**Пов'язані документи:** [ADR Admin Axios transport](../admin/adr/0001-admin-axios-transport.md), [стан і API Admin](../admin/state-and-api.md)

## Призначення

Admin передає API-запити через спільний transport, нормалізує backend errors і
підтримує cancellation.

```text
Admin feature
     │ RTK Query hook
     ▼
domain data-access ── baseApi.injectEndpoints
     │
     ▼
shared/api-client
  ApiRequest → axiosBaseQuery → Axios → backend
                    │                │
                    └─ ApiError ◄────┘
                         │
       ┌─────────────────┴─────────────────┐
       ▼                                   ▼
feature error state              runtime notifier (network/timeout/5xx)
```

`feature` показує власні loading/error/empty states. Глобальний notifier не
замінює error state та не повідомляє про validation errors.

## Межі відповідальності

| Шар                  | Відповідальність                                                                                                |
| -------------------- | --------------------------------------------------------------------------------------------------------------- |
| `shared/api-client`  | Axios instance, interceptors, `axiosBaseQuery`, `baseApi`, API contracts, error normalization, runtime notifier |
| Domain `data-access` | DTO, runtime validation, mapper і endpoints через `baseApi.injectEndpoints`                                     |
| `feature`            | Generated RTK Query hooks, loading/error states і ручний `refetch`                                              |
| `ui` / route         | Не викликають HTTP і не імпортують transport                                                                    |

Кожен domain endpoint оголошується виключно через public `baseApi.injectEndpoints`.
Не можна створювати окремий Axios instance, робити deep import у `api-client` або
дублювати RTK Query response/error у slice.

## Публічний transport contract

```ts
interface ApiRequest {
  url: string;
  method?: AxiosRequestConfig['method'];
  data?: AxiosRequestConfig['data'];
  params?: AxiosRequestConfig['params'];
  headers?: AxiosRequestConfig['headers'];
}

type ApiErrorCode =
  | 'Unknown'
  | 'Network'
  | 'Timeout'
  | 'Unauthorized'
  | 'Forbidden'
  | 'NotFound'
  | 'Validation'
  | 'Server';

interface ApiError {
  code: ApiErrorCode;
  status?: number;
  message: string;
  fieldErrors?: Record<string, string[]>;
  traceId?: string;
}
```

`axiosBaseQuery` передає RTK Query `AbortSignal` до Axios і повертає тільки
`{ data }` або `{ error: ApiError }`. Axios exception не виходить у feature.

## Backend errors

| Backend response              | `ApiError`                                |
| ----------------------------- | ----------------------------------------- |
| Немає response                | `Network`, `status: 0`                    |
| `ECONNABORTED` / `ETIMEDOUT`  | `Timeout`                                 |
| HTTP 401 / 403 / 404          | `Unauthorized` / `Forbidden` / `NotFound` |
| HTTP 4xx з validation fields  | `Validation` і `fieldErrors`              |
| HTTP 5xx                      | `Server`                                  |
| Інша transport/client помилка | `Unknown`                                 |

### ASP.NET Problem Details

Backend може повертати `{ detail, title, errors, traceId }`. `detail` має
пріоритет над `title`; `errors` перетворюється на `fieldErrors`; `traceId`
зберігається для діагностики. Response body не логується.

### Ardalis validation result

Backend може повертати масив з `Identifier` / `ErrorMessage` або
`identifier` / `errorMessage`. Клієнт групує повідомлення за полем у
`fieldErrors` і повертає `Validation`.

## Робота з помилками

1. Для `Validation` feature показує field errors.
2. Для `Network`, `Timeout` і `Server` feature пропонує доступний ручний retry
   через `refetch`.
3. Runtime notifier повідомляє про network, timeout, server та unknown errors;
   4xx лишаються відповідальністю конкретного feature.
4. `traceId` передається в support лише через нормалізований `ApiError`; feature
   не парсить backend response самостійно.

## Observability і безпека

- Request interceptor може додавати correlation ID і вимірює тривалість.
- Логи містять тільки method, sanitized URL без query/fragment, status і duration.
- Headers, request/response body, tokens і персональні дані не логуються.
- Logging увімкнений лише за development opt-in flag: `VITE_ENABLE_HTTP_LOGS`.

## Параметри Admin

| Аспект           | Admin                                                               |
| ---------------- | ------------------------------------------------------------------- |
| Base URL         | `@admin/shared/config`                                              |
| Authentication   | bearer token, refresh, CSRF, credentials через `AuthSessionAdapter` |
| Runtime notifier | Налаштовується під час Admin bootstrap                              |
| Connectivity     | browser/HTTP failure handling                                       |

## Перевірка

- Unit: Problem Details, Ardalis, network, timeout і 5xx mapping; `AbortSignal`
  forwarding; logger sanitization.
- Integration: endpoint через `baseApi.injectEndpoints` повертає доменну модель,
  а не DTO.
- Ручна: скасувати запит при unmount або навігації.
