# API-архітектура Admin

- **Область:** цільовий transport для `apps/admin-react`
- **Статус:** planned; не підтверджує наявність описаних libraries
- **Пов'язані документи:** [ADR Admin Axios transport](../admin/adr/0001-admin-axios-transport.md), [стан і API Admin](../admin/state-and-api.md)

[Життєвий цикл OpenAPI-контракту](contract-workflow.md) застосовується до
React Admin. Ця сторінка описує цільовий transport; його наявність потрібно
перевіряти в коді.

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

| Шар                    | Відповідальність                                                                                                     |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `shared/api-client`    | Екземпляр Axios, перехоплювачі, `axiosBaseQuery`, `baseApi`, контракти API, нормалізація помилок, runtime-сповіщувач |
| Доменний `data-access` | Generated DTO на межі, runtime-валідація, мапер і кінцеві точки через `baseApi.injectEndpoints`                      |
| `feature`              | Згенеровані хуки RTK Query, стани завантаження/помилки і ручний `refetch`                                            |
| `ui` / маршрут         | Не викликають HTTP і не імпортують транспорт                                                                         |

Кожен domain endpoint оголошується виключно через public `baseApi.injectEndpoints`.
Не можна створювати окремий Axios instance, робити deep import у `api-client` або
дублювати RTK Query response/error у slice.

## Публічний транспортний контракт

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

## Помилки backend

| Відповідь backend               | `ApiError`                                |
| ------------------------------- | ----------------------------------------- |
| Немає відповіді                 | `Network`, `status: 0`                    |
| `ECONNABORTED` / `ETIMEDOUT`    | `Timeout`                                 |
| HTTP 401 / 403 / 404            | `Unauthorized` / `Forbidden` / `NotFound` |
| HTTP 4xx з validation fields    | `Validation` і `fieldErrors`              |
| HTTP 5xx                        | `Server`                                  |
| Інша помилка транспорту/клієнта | `Unknown`                                 |

### Problem Details ASP.NET

Backend може повертати `{ detail, title, errors, traceId }`. `detail` має
пріоритет над `title`; `errors` перетворюється на `fieldErrors`; `traceId`
зберігається для діагностики. Response body не логується.

### Результат валідації Ardalis

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

## Спостережуваність і безпека

- Request interceptor може додавати correlation ID і вимірює тривалість.
- Логи містять тільки method, sanitized URL без query/fragment, status і duration.
- Headers, request/response body, tokens і персональні дані не логуються.
- Logging увімкнений лише за development opt-in flag: `VITE_ENABLE_HTTP_LOGS`.

## Параметри Admin

| Аспект             | Admin                                                               |
| ------------------ | ------------------------------------------------------------------- |
| Базова URL-адреса  | `@admin/shared/config`                                              |
| Автентифікація     | bearer-токен, refresh, CSRF, credentials через `AuthSessionAdapter` |
| Runtime-сповіщувач | Налаштовується під час bootstrap Admin                              |
| З'єднання          | Обробка помилок браузера/HTTP                                       |

## Перевірка

- Модульна: мапінг Problem Details, Ardalis, мережевих помилок, timeout і 5xx;
  передавання `AbortSignal`; очищення даних логера.
- Інтеграційна: кінцева точка через `baseApi.injectEndpoints` повертає доменну модель,
  а не DTO.
- Ручна: скасувати запит під час розмонтування або навігації.
