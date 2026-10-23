# ADR-0001: Axios Transport for Admin RTK Query

**Status:** Accepted\
**Date:** 2026-07-22

## Context

Admin uses RTK Query for server state, caching, loading states, and
invalidation. The application needs a single transport boundary for
authorization headers, logging, token refresh, and HTTP error normalization.
Domain libraries do not call Axios directly.

## Decision

- `@admin/shared/api-client` owns one Axios instance: `axiosClient`.
- `baseApi` uses `axiosBaseQuery`; each endpoint returns `ApiRequest` and does not call Axios directly.
- `axiosBaseQuery` forwards `AbortSignal` to Axios and converts errors into the public `ApiError` contract.
- The request interceptor adds a bearer token from `AuthSessionAdapter` and forwards credentials.
- The response interceptor handles `401` once per request; concurrent `401` responses share a refresh promise.
- `admin/core/auth` owns tokens, the refresh endpoint, and logout; during bootstrap it configures the API client and refreshes the access token.
- HTTP logs contain only method, URL, status, and duration; `VITE_ENABLE_HTTP_LOGS` enables them.

## Integration contract

The auth feature passes `AuthSessionAdapter` through `configureApiClient`.
`refreshAccessToken` sends `POST /api/auth/session/refresh` with
`withCredentials: true`, passes `kedr.csrf` as `X-CSRF-Token`, and uses a
separate raw Axios client to avoid recursive refresh.

## Consequences

- Domain `data-access` extends `baseApi` through `injectEndpoints` and does not use the Axios API.
- `feature` consumes only generated RTK Query hooks and domain models.
- DTO-to-model mapping and response validation remain the responsibility of domain `data-access`.
- Public `ApiError` contains `code`, `status`, and `message`, plus `fieldErrors` and `traceId` when needed.
