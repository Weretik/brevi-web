# Admin API Architecture

The current Angular Storefront is described separately in the
[Storefront API boundary](storefront.md).

- **Scope:** transport for `apps/admin-react`
- **Status (checked 2026-11-15):** typed `openapi-fetch` client, `baseApi` and domain endpoints with `queryFn` are implemented
- **Related documents:** [Admin openapi-fetch transport ADR](../admin/adr/0002-admin-openapi-fetch-transport.md), [Admin state and API](../admin/runtime/state-and-api.md)

The [OpenAPI contract lifecycle](contract-workflow.md) applies to React Admin.
Current entry points are `libs/admin/shared/api-client/src/index.ts`,
`libs/admin/products/data-access/src/index.ts`, and
`libs/admin/references/data-access/src/index.ts`.

## Purpose

Private downloads use `apiRequest(apiClient.GET(path, { parseAs: 'blob', ... }))`: the same client, cookie, CSRF and error mapping. Domain data-access validates MIME/size; feature owns the temporary URL. Binary responses stay outside the RTK cache.

Admin sends API requests through a shared transport, normalizes backend errors,
and supports cancellation.

```text
Admin feature
     │ RTK Query hook
     ▼
domain data-access ── baseApi.injectEndpoints
     │
     ▼
shared/api-client
  queryFn → apiCall(apiClient.GET/POST/…) → fetch → backend
                    │                │
                    └─ ApiError ◄────┘
                         │
       ┌─────────────────┴─────────────────┐
       ▼                                   ▼
feature error state              runtime notifier (network/timeout/5xx)
```

`feature` displays its own loading/error/empty states. The global notifier does
not replace error state or report validation errors.

## Responsibilities

| Layer                | Responsibility                                                                                                  |
| -------------------- | --------------------------------------------------------------------------------------------------------------- |
| `shared/api-client`  | `openapi-fetch` client and middleware, `apiCall`/`apiRequest`, `baseApi`, error normalization, runtime notifier |
| Domain `data-access` | Typed `apiClient` calls in `queryFn`, generated types at the boundary, mapper, endpoints via `injectEndpoints`  |
| `feature`            | Generated RTK Query hooks, loading/error states, and manual `refetch`                                           |
| `ui` / route         | Do not call HTTP or import transport                                                                            |

Declare each domain endpoint exclusively through public
`baseApi.injectEndpoints` with a `queryFn` that calls `apiCall`. Do not call
`fetch` or Axios directly, deep-import from `api-client`, or duplicate RTK Query
response/error state in a slice.

## Public transport contract

```ts
// apiCall(request, map?, mapError?) → { data } | { error: ApiError } for a queryFn
apiCall(apiClient.GET('/api/crm/quotes/{id}', { params: { path: { id } }, signal }), mapQuote);
// apiRequest(request, map?) → the mapped body, or throws ApiError
await apiRequest(apiClient.POST('/api/auth/cookie/logout'));

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

Every `queryFn` forwards RTK Query's `AbortSignal` to the request. `apiCall`
returns only `{ data }` or `{ error: ApiError }`; a non-2xx response becomes
`HttpError` and then `ApiError`, so no exception escapes to the feature.

## Backend errors

| Backend response                | `ApiError`                                |
| ------------------------------- | ----------------------------------------- |
| No response                     | `Network`, `status: 0`                    |
| `TimeoutError` (`DOMException`) | `Timeout`                                 |
| HTTP 401 / 403 / 404            | `Unauthorized` / `Forbidden` / `NotFound` |
| HTTP 4xx with validation fields | `Validation` and `fieldErrors`            |
| HTTP 5xx                        | `Server`                                  |
| Other transport/client error    | `Unknown`                                 |

### ASP.NET Problem Details

The backend may return `{ detail, title, errors, traceId }`. `detail` takes
priority over `title`; `errors` is converted to `fieldErrors`; `traceId` is
retained for diagnostics. The response body is not logged.

### Ardalis validation result

The backend may return an array with `Identifier` / `ErrorMessage` or
`identifier` / `errorMessage`. The client groups messages by field into
`fieldErrors` and returns `Validation`.

## Error handling

1. For `Validation`, the feature displays field errors.
2. For `Network`, `Timeout`, and `Server`, the feature offers an available manual retry through `refetch`.
3. The runtime notifier reports network, timeout, server, and unknown errors; each feature remains responsible for 4xx errors.
4. `traceId` is passed to support only through normalized `ApiError`; the feature does not parse backend responses itself.

## Observability and security

- The logging middleware may measure duration.
- Logs contain only method, sanitized URL without query/fragment, status, and duration.
- Headers, request/response bodies, tokens, and personal data are not logged.
- Logging is enabled only by the development opt-in flag `VITE_ENABLE_HTTP_LOGS`.

## Admin configuration

| Aspect           | Admin                                                                      |
| ---------------- | -------------------------------------------------------------------------- |
| Base URL         | `@admin/shared/config`                                                     |
| Authentication   | HttpOnly session cookie, CSRF middleware, 401 through `AuthSessionAdapter` |
| Runtime notifier | Configured during Admin bootstrap                                          |
| Connectivity     | Browser/HTTP error handling                                                |

## Verification

- Unit: map Problem Details, Ardalis, network errors, timeout, and 5xx; forward `AbortSignal`; sanitize logger data.
- Integration: an endpoint through `baseApi.injectEndpoints` returns a domain model, not a DTO.
- Manual: cancel a request during unmount or navigation.
