# Admin State, API, and Forms

## Server state and API

- Server state is implemented with RTK Query and belongs in `data-access`.
- The planned root Redux store belongs in `apps/admin-react/src/app/store.ts`; this file is not present in the current bootstrap.
- The shared API is in `@admin/shared/api-client`; transport details are defined in [ADR-0001](../adr/0001-admin-axios-transport.md).
- `admin/core/auth` provides `AuthSessionAdapter` to the API client; the API client does not store tokens or know the session refresh endpoint.
- Each domain declares endpoints in its own `data-access` library through `baseApi.injectEndpoints`.
- A feature uses only exported typed hooks and does not access `baseApi` directly.
- Validate and transform all external data at the `data-access` boundary.
- An API feature records `operationId` and the backend OpenAPI version before endpoint code is added; generated DTOs remain in transport/data-access. The order and status of automation are described in the [contract workflow](../../api/contract-workflow.md).

## Target structure of `@admin/shared/api-client`

`@admin/shared/api-client` is shared transport infrastructure. Its root
`src/index.ts` contains only stable public exports; internal implementations
are grouped by role:

```text
libs/admin/shared/api-client/src/
├── index.ts
├── client/        # Axios instance creation
├── contracts/     # ApiRequest, ApiError, auth contracts
├── errors/        # transport/API error normalization and tests
├── interceptors/  # auth header, refresh/retry, logging, and installer
├── rtk-query/     # baseApi and Axios base query
└── runtime/       # runtime configuration: session adapter, error notifier
```

- A module does not combine the Axios client, interceptor, RTK Query base query, transport contract, and error mapper.
- An interceptor does not own global application state; the session adapter and error notifier belong in `runtime` and are configured through the public API.
- Domain `data-access` libraries declare endpoints only through `baseApi.injectEndpoints`; they do not create their own Axios instance or import internal `api-client` modules.
- Change public transport layer exports only through a separate compatible decision.
- A change to transport behavior includes relevant error mapping or interceptor behavior tests and verification with `npx nx build admin-react`.

## Target structure of `@admin/shared/config`

`@admin/shared/config` isolates the Vite environment from the rest of Admin.
The public `src/index.ts` exports the ready-to-use `appConfig` and the
`AppConfig` type; reading `import.meta.env`, parsing values, and composing
configuration are kept separate:

```text
libs/admin/shared/config/src/
├── index.ts
├── env/
│   ├── admin-environment.types.ts
│   └── environment-reader.ts
└── config/
    ├── app-config.types.ts
    └── app-config.ts
```

- Only `env/environment-reader.ts` accesses `import.meta.env` and references Vite types.
- `config/app-config.ts` is a pure function with explicit environment input; all fallback and parsing rules are centralized in `env`.
- Consumers import only `appConfig` from `@admin/shared/config`, not Vite env or internal config modules.

## Local and client state

Local state stays in `feature`. Domain client state that must survive unmounts
or be used by multiple pages belongs in `feature/state/<domain>.slice.ts`; the
reducer is explicitly exported for store registration. Do not create a slice
for data already cached by RTK Query.

## Forms

A form belongs to a feature scenario. `ProductForm` receives data and handlers
through props, does not call the API or manage routing; pages call mutations.
Move shared controls to `@admin/shared/ui` only after reuse is demonstrated.
Choose the form library and validation schema in a separate ADR before the
first implementation.
