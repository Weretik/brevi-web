# Storefront Architecture

**Scope:** the existing Angular SSR application `apps/storefront`. This section
describes the actual composition, routes, and modules of Brevi Storefront. It
does not apply React Admin rules to Angular.

## Where to find code

- [Map of existing modules](modules.md) — Storefront Nx projects and their roles.
- [Existing Storefront features](../../features/README.md#storefront-angular-appsstorefront) — individual page and relationship descriptions.
- [Storefront runtime](runtime.md) — SSR, hydration, routes, localization, state, and checks.
- [Current API boundary](../api/storefront.md) — configured HTTP pipeline and actual consumers.
- `apps/storefront/src/app/app.config.ts` — global providers: router, HTTP/interceptors, hydration, Transloco, and PrimeNG.
- `apps/storefront/src/app/app.routes.ts` — localized `/uk` and `/ru` routes and feature library route composition.
- `libs/storefront/feature/*/src/lib/lib.routes.ts` — routes for the corresponding features; `order-in-bulk` and `regions` have an additional same-named nested directory.

## Responsibilities

`apps/storefront` composes the application. `libs/storefront/feature/*` contain
individual scenarios and pages; `shell` is the shared shell, `ui` contains
reusable presentation, `data-access` provides data access, and `util` contains
utilities. Shared `libs/shared/*` are used according to their actual public
APIs. Before making changes, check exact dependencies in the code and Nx; do
not assume every feature has its own `model` or `data-access` library.

## Rules and checks

- [Frontend inventory](../frontend-inventory.md) — current stack and Nx targets.
- [Storefront UI rules](../../standards/storefront-ui.md) — PrimeNG and styling.
- [Standards index](../../standards/README.md) — scope of other rules.
- [Specifications](../../specs/README.md) — existing feature specs; create a new one only under project rules.
