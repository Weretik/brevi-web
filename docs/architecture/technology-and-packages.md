# Brevi Web Technologies

Versions live only in root `package.json` (declared) and `package-lock.json` (resolved); read them there. This document records the stack, the role of key libraries, and open questions.

## Stack by application

| Application | Framework and rendering                      | UI                                | Routes                          | State/API                                                                                     | i18n                             | Build/test                                          |
| ----------- | -------------------------------------------- | --------------------------------- | ------------------------------- | --------------------------------------------------------------------------------------------- | -------------------------------- | --------------------------------------------------- |
| Storefront  | Angular 21, Node SSR/Prerender/Client routes | PrimeNG, PrimeUIX theme, Tailwind | Angular Router, `/uk` and `/ru` | Angular signals in UI; `HttpClient` pipeline is ready, but no feature API consumer exists yet | Transloco, local TS translations | Angular build through Nx; no separate test target   |
| Admin       | React 19, browser Vite                       | MUI, Emotion                      | React Router                    | Redux Toolkit/RTK Query, Axios                                                                | Check specific features          | Vite, Vitest, React Testing Library, Playwright E2E |

Read the current composition and constraints in [Storefront runtime](storefront/runtime.md), [Storefront API](api/storefront.md), and [Admin architecture](admin/README.md). The presence of a package does not prove its capability is enabled in every application.

## Key libraries by role

| Role                    | Storefront                                                              | Admin                                                                    |
| ----------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Framework and rendering | `@angular/*`, `@angular/ssr`, `express` (SSR server), `zone.js`, `rxjs` | `react`, `react-dom`                                                     |
| UI and styling          | `primeng`, `@primeuix/themes`, `primeicons`, Tailwind                   | `@mui/material`, `@mui/icons-material`, `@mui/x-data-grid`, `@emotion/*` |
| Routing                 | `@angular/router`                                                       | `react-router-dom`                                                       |
| State and HTTP          | `HttpClient` (no feature consumer yet)                                  | `@reduxjs/toolkit` (RTK Query), `react-redux`, `axios`                   |
| Localization            | `@jsverse/transloco`                                                    | —                                                                        |
| Tests                   | no test target                                                          | Vitest, React Testing Library, Playwright (`admin-react-e2e`)            |

Workspace tooling: Nx, Vite, ESLint, Prettier, TypeScript, and `openapi-typescript` for contract types.

## Open questions

Usage of these direct packages has not been confirmed; check before removing or relying on them: `@mui/x-charts`, `react-markdown`, `primeflex`, `remixicon`, `@analogjs/vite-plugin-angular`, `@babel/preset-react`, `@vitest/ui`, `cross-env`, `eslint-plugin-prettier`, `jsonc-eslint-parser`, `ng-packagr`, `supertest`, `ts-node`.

## Architecture decisions and update rules

- Angular Storefront: SSR/hydration, localization, and runtime are described in [Storefront runtime](storefront/runtime.md); the HTTP pipeline and absence of a current API consumer are described in [Storefront API](api/storefront.md). When adding an API, check server/browser behavior and the contract.
- React Admin: MUI/Emotion, routing, and state have their own boundaries in [Admin architecture](admin/README.md). Axios/RTK Query are described in [API architecture](api/README.md) as the target transport; compare this document with code before changing dependencies.
- OpenAPI types are generated through `contracts:generate`; the source and checks are described in the [contract workflow](api/contract-workflow.md). Do not manually edit generated types.
- After adding, removing, or updating a direct package, synchronize the manifest and lockfile through the normal npm workflow and check actual usage. Update this document only when the stack, a key library's role, or an open question changes; versions are never copied here.
- Do not assume a package under “Open questions” is unused. First inspect imports, CSS, configuration, scripts, and Nx inferred targets; record the result in the change concerning that package and remove it from the list.
