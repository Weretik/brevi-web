# 002 — Full-stack E2E in CI

- **Surfaces:** React Admin, Next.js site, BreviERP API (test database)
- **Status:** implemented; first green run in GitHub Actions is the acceptance evidence
- **Owner:** frontend
- **Updated:** 2026-11-16

Unit, component and contract tests prove each side alone, and `admin-react-e2e` runs the Admin against a mocked
API. Nothing proved that the Admin and the site still work against the real API and database. This feature adds a
small set of browser tests that run the whole chain in GitHub Actions, without Claude and without touching
production.

## Requirements

| ID  | Requirement                                                                                                                                                |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R-1 | Tests run in GitHub Actions only, against an API built from BreviERP source and an empty PostgreSQL in the job.                                            |
| R-2 | No production data or service: no Telegram, Gmail, KeepinCRM, media CDN or production database settings.                                                   |
| R-3 | At most 6–10 tests, critical journeys only; anything checkable at a lower level stays there ([testing rules](../../../standards/shared/testing-rules.md)). |
| R-4 | A failure keeps a screenshot, a video, a Playwright trace and the API log as a downloadable artifact.                                                      |
| R-5 | The check runs only when the Admin, the site, the contract or the tests change, plus nightly and on demand.                                                |
| R-6 | A backend change that breaks a frontend is found within a day even when no frontend pull request is open.                                                  |

## Scenarios

| ID   | Journey                                                                                                     | Test                            |
| ---- | ----------------------------------------------------------------------------------------------------------- | ------------------------------- |
| SC-1 | A manager is refused with a wrong password and reaches the desk with the right one.                         | `src/admin/sign-in.spec.ts`     |
| SC-2 | A fabric is added in the reference side panel (`ReferenceEditorDrawer`) and is found in the list.           | `src/admin/fabric.spec.ts`      |
| SC-3 | A PPE product is created from a supplier price and a markup rule; its retail price is 100 ₴ + 50 % = 150 ₴. | `src/admin/ppe-product.spec.ts` |
| SC-4 | A КП for a client takes that product with its catalog price and is saved.                                   | `src/quotes/quote.spec.ts`      |
| SC-5 | The site home page and catalog open with the phone number and the request link.                             | `src/site/home.spec.ts`         |
| SC-6 | A request sent from the site form appears in the Admin «Заявки з сайту».                                    | `src/site/site-request.spec.ts` |

## Design

- **Project.** `apps/stack-e2e` (Nx, Playwright, Chromium). Playwright projects: `setup` signs in once, saves the
  cookies and adds through the API what a new database lacks (a PPE section, a markup rule, a client); `admin`
  and `site` depend on it; `quotes` depends on `admin` because the КП uses the product SC-3 created. One worker and
  no retries: all tests share one database, and a retry would meet data the first attempt changed.
- **Servers.** Playwright starts the Admin (Vite dev server; `ADMIN_API_PROXY_TARGET` points its `/api` proxy at
  the API instead of `environment.api.baseUrl`) and the site (`next start` of a production build, `BREVI_API_URL`
  points at the API). The API listens on `http://localhost:5082`; Chromium treats localhost as secure, so the
  production cookie settings work unchanged, only the CSRF cookie domain is emptied.
- **Data.** BreviERP `Host.Seed` creates the schema, roles, demo suppliers and fabrics, and the administrator
  `admin@e2e.test` from `ADMIN_DEFAULT_PASSWORD`. The media storage gets placeholder settings because sign-in
  constructs it; the tests upload nothing.
- **Workflow.** [`.github/workflows/e2e.yml`](../../../../.github/workflows/e2e.yml): Postgres service container →
  checkout BreviERP (`master`, or `backend-ref` on a manual run) → `dotnet publish` of `Host.Seed` and `Host.Api` →
  seed → API in the background → `nx build site` → `npm run test:stack:e2e` → artifact on failure. Triggers: pull
  requests with the paths of R-5, nightly at 01:30 UTC (R-6), and manual. It is not a required check yet; make it
  required in the branch rules once it has stayed green for a while.

## Run locally

Start PostgreSQL, run BreviERP `Host.Seed` on an empty database with `ADMIN_DEFAULT_PASSWORD` and
`Identity__AdminUser__Email=admin@e2e.test`, start `Host.Api` on `http://localhost:5082` with the settings of the
«Start the API» step, build the site with `BREVI_API_URL=http://localhost:5082 npx nx build site`, then
`E2E_ADMIN_PASSWORD=<the same password> npm run test:stack:e2e`. A second run needs a fresh database.

## Evidence

- 2026-11-16, local, fresh database: all 7 tests (setup + SC-1…SC-6) passed in about 45 s.
- First GitHub Actions run: see the pull request that added this feature.
