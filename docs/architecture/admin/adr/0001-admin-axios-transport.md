# ADR-0001: Axios-транспорт для Admin RTK Query

**Статус:** Прийнято  
**Дата:** 2026-07-22

## Контекст

Admin використовує RTK Query для серверного стану, кешування, станів завантаження
та інвалідації. Застосунку потрібна єдина транспортна межа для заголовків
авторизації, логування, оновлення токена й нормалізації HTTP-помилок. Доменні
бібліотеки не викликають Axios напряму.

## Рішення

- `@admin/shared/api-client` володіє одним екземпляром Axios — `axiosClient`.
- `baseApi` використовує `axiosBaseQuery`; кожен endpoint повертає `ApiRequest` і не викликає Axios напряму.
- `axiosBaseQuery` передає `AbortSignal` до Axios і перетворює помилки на публічний контракт `ApiError`.
- Interceptor запиту додає bearer token із `AuthSessionAdapter` та передає credentials.
- Interceptor відповіді обробляє `401` один раз для запиту; паралельні `401` спільно використовують refresh promise.
- `admin/core/auth` володіє токенами, endpoint оновлення та logout; під час bootstrap він налаштовує API-клієнт і оновлює access token.
- HTTP-логи містять лише метод, URL, статус і тривалість; їх вмикає `VITE_ENABLE_HTTP_LOGS`.

## Контракт інтеграції

Auth feature передає `AuthSessionAdapter` через `configureApiClient`. `refreshAccessToken`
виконує `POST /api/auth/session/refresh` із `withCredentials: true`, передає
`kedr.csrf` як `X-CSRF-Token` та використовує окремий raw Axios-клієнт, щоб не
створити рекурсивне оновлення.

## Наслідки

- Domain `data-access` розширює `baseApi` через `injectEndpoints` і не використовує Axios API.
- `feature` споживає лише згенеровані RTK Query hooks і доменні моделі.
- DTO-to-model mapping та валідація відповідей залишаються відповідальністю domain `data-access`.
- Публічний `ApiError` містить `code`, `status`, `message`, а за потреби `fieldErrors` і `traceId`.
