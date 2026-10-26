# Admin Application and Routing

## Application `apps/admin-react`

The application should be the composition root. It hosts React startup, root
providers, routing, global styles, and feature library wiring. Business rules,
API calls, and domain components do not belong here.

As of 2026-10-16, `AppRouter` wires the shared layout, root page,
`productsRoutes`, `referencesRoutes`, and a fallback for unknown URLs. Page
implementations are loaded from domain route files, while the application
imports only public route configurations. Each domain exports a named route
configuration from its public entry point.

```text
productsRoutes   ─┐
referencesRoutes ─┴→ AppRouter
```

Example of valid wiring:

```ts
import { productsRoutes } from '@admin/products/feature';
import { referencesRoutes } from '@admin/references/feature';
```

`AdminLayout` remains a route element with `Outlet`. The router file location
may change without changing this rule.

## Lazy loading route features

**Routing checkpoint, 2026-10-25:** `admin-route-definitions.tsx` combines public domain route configurations, `admin-route-layout.tsx` composes the shared layout/navigation, and `create-admin-router.tsx` constructs the data router. `AppRouter` owns the default router instance and `RouterProvider`; `AppProviders` owns API/session/theme providers. The data router enables feature-level `useBlocker` protection for dirty Sewing composition across browser history and SPA links. Route pages remain lazy and `AdminLayout` still owns `Outlet` and its Suspense fallback. Tests inject isolated router instances. See the [structural audit](../../../specs/admin/products/004-sewing-articles-and-composition/code-audit/audit.md).

- Feature pages used as route entries export a default page component and are
  loaded with the short form `lazy(() => import('./pages/<page>'))` from their
  `<domain>.routes.tsx` module. Do not use named-export adapters with
  `.then(...)` for route pages.
- `AdminLayout` owns the single `Suspense` fallback around `Outlet`; pages and
  features do not duplicate route loading indicators. The fallback shows only
  route chunk loading; it does not make a server request or duplicate a page's
  loading state.
- The shell, route configuration, and minimal route metadata may remain in
  the initial chunk. Page implementations, heavy domain UI, and optional MUI X
  packages must remain behind the relevant route boundary.
- Add manual chunk configuration only when bundle analysis reveals a
  cross-route dependency that route-level lazy loading cannot split.
- Verify route boundary changes with lint for the shell and changed features,
  as well as `npx nx build admin-react`; build output must contain separate
  page chunks.
