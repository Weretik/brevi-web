# Current Storefront API Boundary

**Checked:** 2026-10-15 against `apps/storefront` and
`libs/{storefront,shared}`. This page describes Angular Storefront.
[Admin API architecture](README.md) contains a separate **target** React
transport and does not describe the current Storefront state.

## What is implemented

`apps/storefront/src/app/app.config.ts` registers Angular `HttpClient` with
`withFetch()` and an interceptor pipeline in this order:

1. `baseUrlInterceptor` adds `environment.api.baseUrl` to relative URLs; it does not change absolute `http(s)` URLs.
2. `loggingInterceptor` passes request metadata to `AppLogger` when the `enableHttpLogs` flag is set; check its behavior before enabling logging in an environment with sensitive data.
3. `errorInterceptor` converts HTTP failures into `AppApiError` with a code, status, message, validation fields, and, when available, `traceId`. It recognizes Problem Details and arrays of Ardalis validation errors.

`provideApiAndLogging(environment)` provides `API_BASE_URL`, the HTTP logging
flag, and `AppLogger` configuration. In development, `api.baseUrl` is
`http://localhost:5000/storefront`; in the production manifest, it is
`https://api.brevi.com.ua/storefront`. These are **values in code**, not
confirmation that the backend is reachable or that this is the current
deployment.

## Actual consumers and state

Searching for `HttpClient`, `http.get/post/put/delete`, `fetch`, and `axios` in
`apps/storefront` and `libs/storefront` found no current feature request to the
backend. `libs/storefront/data-access` currently contains a placeholder
component, not an implemented API adapter. The catalog and pages use local
data and component state. Therefore there is currently no concrete map of
Storefront operations, runtime DTO mapping, or cache policy that can be
accurately described as active.

The server in `apps/storefront/src/server.ts` does not implement a backend
proxy: its `/api/**` example is commented out. The Transloco loader returns
local TypeScript translations through `of(...)`, so the name
`TranslocoHttpLoader` alone does not mean it makes an HTTP request.

## When the first API consumer is added

Before implementation, find the operation in backend OpenAPI and record its
`operationId`, snapshot source, and backend revision according to the
[API contract lifecycle](contract-workflow.md). Place transport and mapping in
the appropriate Storefront `data-access` boundary, and keep the feature
responsible for visible loading/empty/error states. Check existing
interceptors, runtime validation, SSR behavior, auth/CSRF, cache, and
cancellation for that specific operation; do not mechanically apply React
Admin RTK Query/Axios rules.

After implementation, update this page with a table of
`operationId → consumer → mapper/model → cache/error behavior → test`, naming
the actual files and checks. Do not copy OpenAPI schemas into Markdown.
