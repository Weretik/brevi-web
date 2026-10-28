# Frontend Inventory

**Checked:** 2026-10-01

This file records the existing architecture and commands only. Update it when
applications, package managers, or test targets change.

## Applications

| Application            | Technology               | Actual state                                                      | Check targets                                           |
| ---------------------- | ------------------------ | ----------------------------------------------------------------- | ------------------------------------------------------- |
| `apps/storefront`      | Angular 21, SSR, PrimeNG | Working storefront; feature code is mainly in `libs/storefront/*` | `lint`, `build`; no test target                         |
| `apps/admin-react`     | React 19, Vite, MUI      | Working Admin with shell, reference data, and product management  | `lint`, `typecheck`, `typecheck-tests`, `test`, `build` |
| `apps/admin-react-e2e` | Playwright, Chromium     | Browser journeys for critical Admin scenarios                     | `lint`, `typecheck`, `e2e`, atomized `e2e-ci`           |

## Code boundaries

- Angular Storefront uses Nx `shared` and `storefront` libraries.
- React Admin composes the application in `apps/admin-react/src/app/`, has its shell in `libs/admin/core/shell`, and domain libraries for `products`, `references`, and `clients`.
- The mobile application is outside this repository's scope.

## Package manager and scripts

See [technology stack and key libraries](technology-and-packages.md); versions
are in root `package.json` and `package-lock.json`.

- Node.js: `24.18.0`, pinned in `.nvmrc` and `.node-version`; supported range is `>=24.15.0 <25`.
- Package manager: `npm@11.6.2`, lock file `package-lock.json`.
- Root scripts include `test:web` and its unit, component, integration, coverage, and E2E variants, plus `typecheck:tests`, `docs:check`, `docs:format:check`, and `storefront:start`, alongside existing build, lint, and formatting commands.
- Nx defines targets per project; inspect `npx nx show project <project> --json` before planning a task.
- `contracts:sync`, `contracts:generate`, and `contracts:check` support the OpenAPI snapshot and generated API types for React Admin.

## Test tooling and existing tests

- Installed tools include Vitest, the Angular Vitest adapter, React Testing Library, `jest-dom`, `user-event`, and `@playwright/test`/`@nx/playwright`.
- React Admin has a separate `vitest.config.mts`, jsdom configuration, and an executable unit, component, and integration test suite.
- `admin-core-shell` has separate lint, typecheck, typecheck-tests, and Vitest test targets, as well as component tests.
- `apps/admin-react-e2e` has a Playwright config, Chromium smoke tests, and Nx inferred targets. Install the Chromium binary locally or in CI with `npx playwright install chromium`.

An installed dependency does not by itself make a test level available. A new
React library must have an executable Nx test target/configuration and focused
tests. Add a new tool through a separate `EN-*` task before including it.

## Client slice — 2026-10-26

`admin-clients-{model,data-access,feature}` add scoped Vitest/lint/typecheck targets under `libs/admin/clients`. `admin-clients-ui` has lint/typecheck; presentational interaction coverage runs through feature, without an empty UI test runner. Project tags remain scope:admin/domain:clients/type:<layer>. See [actual feature structure](../features/admin/clients-and-quotes.md).
