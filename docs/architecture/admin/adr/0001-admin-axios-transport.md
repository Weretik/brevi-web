# ADR-0001: Axios Transport for Admin RTK Query

**Status:** Accepted\
**Date:** 2026-07-22

## Context

Admin uses RTK Query for server state, caching, loading states, and
invalidation. The application needs a single transport boundary for
credentials and CSRF, logging, session end, and HTTP error normalization.
Domain libraries do not call Axios directly.

## Decision

- `@admin/shared/api-client` owns one Axios instance: `axiosClient`.
- `baseApi` uses `axiosBaseQuery`; each endpoint returns `ApiRequest` and does not call Axios directly.
- `axiosBaseQuery` forwards `AbortSignal` to Axios and converts errors into the public `ApiError` contract.
- Requests go with credentials (the HttpOnly session cookie). The request interceptor adds `X-CSRF-Token` from the `brevi.csrf` cookie to requests that change data; there is no bearer token (2026-11-03, [cookie sign-in](../../../specs/admin/auth/002-cookie-sign-in/README.md)).
- The response interceptor turns a `401` from a data request into `AuthSessionAdapter.onUnauthenticated`; there is no refresh.
- `admin/core/auth` owns sign-in, `me` and logout; during bootstrap it configures the API client and restores the user from `me`.
- HTTP logs contain only method, URL, status, and duration; `VITE_ENABLE_HTTP_LOGS` enables them.

## Integration contract

The auth feature passes `AuthSessionAdapter { onUnauthenticated }` through
`configureApiClient`. Sign-in, logout and `me` use a separate raw Axios client;
a `401` from `/api/auth/*` does not end the session from the interceptor.

## Consequences

- Domain `data-access` extends `baseApi` through `injectEndpoints` and does not use the Axios API.
- `feature` consumes only generated RTK Query hooks and domain models.
- DTO-to-model mapping and response validation remain the responsibility of domain `data-access`.
- Public `ApiError` contains `code`, `status`, and `message`, plus `fieldErrors` and `traceId` when needed.
