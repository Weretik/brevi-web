# ADR-0002: Typed openapi-fetch transport for Admin RTK Query

**Status:** Accepted (supersedes [ADR-0001](0001-admin-axios-transport.md))\
**Date:** 2026-11-15

## Context

Admin endpoints described requests as `{ url, method, data }` for `axiosBaseQuery`. The URL, parameters and body were untyped, so a request that did not match the backend contract failed only at runtime. The contract types existed but were used only in mappers.

## Decision

- `@admin/shared/api-client` owns one `openapi-fetch` client, `apiClient`, typed with `paths` from `@admin/shared/contracts`. It sends the session cookie (`credentials: 'include'`) and prefixes `appConfig.apiBaseUrl` on every call, so tests and the runtime config can change it.
- Middleware adds `X-CSRF-Token` to unsafe methods, logs requests in development, and calls the session adapter on a `401` outside `/api/auth/`.
- `baseApi` uses `fakeBaseQuery<ApiError>()`. Every endpoint has a `queryFn` that calls `apiCall(apiClient.<METHOD>(path, init), mapper, mapError?)`. `apiCall` passes the body of the success response, typed by the contract, to the mapper, and turns any failure into `ApiError` (`HttpError` for a non-2xx response). RTK Query ignores `transformResponse` and `transformErrorResponse` with `queryFn`, so their work is the `mapper` and `mapError` arguments.
- Code outside RTK Query (sign-in, logout, the current user, file downloads with `parseAs: 'blob'`) uses `apiRequest`, which returns the mapped body or throws `ApiError`.
- File uploads use `formDataBody({ file, ... })`, because the contract types a binary field as a string.
- Tests stub the global `fetch` with `stubApiFetch` from `@admin/shared/api-client/testing`.

## Consequences

- A wrong path, path parameter, query name, body field or mapper input is a type error.
- `axios` is not used in Admin.
- The `ApiError` shape and the feature error handling are unchanged.
