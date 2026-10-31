# Admin: Shell, Navigation, and Session

**Status:** implementation exists, checked 2026-10-16.

`apps/admin-react` starts React and composes providers and `AppRouter`.
`AdminLayout` from `libs/admin/core/shell` displays navigation and `Outlet`; the
list of items depends on routes that are actually available.
`libs/admin/core/auth` provides the session for API transport, while
`libs/admin/shared/config` provides runtime configuration. This is the shared
foundation for domain pages, not a separate place for their business rules.

## Structure diagram

```mermaid
flowchart LR
  App["apps/admin-react: providers"] --> Router["AppRouter"]
  Router --> Layout["AdminLayout: navigation"]
  Layout --> Outlet["Outlet: domain pages"]
  Auth["core/auth: session or anonymous startup"] --> Transport["API transport"]
  Config["shared/config"] --> App
  Config --> Auth
  Auth --> Access["Anonymous local roles or actual server roles"]
  Access --> Layout
```

## Code structure

```text
apps/admin-react/
└── src/app/
    ├── router/
    │   ├── app-router.tsx # router
    │   └── navigation-config.ts # navigation
    └── app.tsx # composition
```

```text
libs/admin/core/
├── auth/src/
│   ├── session/
│   │   └── auth-session.ts # session
│   └── index.ts # session
└── shell/src/
    ├── layout/
    │   └── admin-layout.tsx # shell and Outlet
    └── navigation/
        └── admin-navigation.tsx # navigation
```

```text
libs/admin/shared/
└── config/src/config/
    └── app-config.ts # runtime configuration
```

**Where to look:** [composition](../../../apps/admin-react/src/app/app.tsx), [router](../../../apps/admin-react/src/app/router/app-router.tsx), [navigation](../../../apps/admin-react/src/app/router/navigation-config.ts), [session](../../../libs/admin/core/auth/src/index.ts), [routing architecture](../../architecture/admin/runtime/application.md), [shell specification](../../specs/admin/shell/001-react-admin-shell-theme/README.md).

## Tests

- `libs/admin/core/shell/src/**/*.component.test.tsx`
- `libs/admin/core/auth/src/session/*.test.ts`
- `apps/admin-react/src/app/**/*.test.ts(x)` (router, providers, navigation, theme)
- E2E (run only on request): `apps/admin-react-e2e/src/admin-react.shell.spec.ts`

Focused run: `npx nx test admin-core-shell`; `npx nx test admin-core-auth`; `npx nx test admin-react -- src/app`.

## Temporary anonymous mode

Both Admin environment files under apps/admin-react/src/environments currently enable auth.anonymousAccess. It normalizes through shared config; core/auth skips session transports and removes the bearer/refresh adapter. Existing navigation obtains local Admin/Manager/User roles without /me. Product Sewing read/manage access follows the same flag. Normal role mapping, login, refresh and logout remain when false.

Key source responsibilities: auth/session/auth-session.ts owns lifecycle; auth/session/session-roles.api.ts owns navigation access; products/data-access/src/api/sewing-access/sewing-access.api.ts owns product access. These access projections do not replace real domain requests or backend permissions. Restore false in both environments, rebuild/reload and restore backend authorization as appropriate. [Task, tests and evidence](../../specs/admin/auth/001-auth-permissions-api-foundation/tasks/TS-007-temporary-anonymous.md).
