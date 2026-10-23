# Local Startup and Diagnostics

**Verified:** 2026-10-15 against `package.json`, Nx targets, and application
configuration. This is a local checkout guide; external deployment settings
must be checked against the actual infrastructure.

## Prerequisites

The repository uses Node.js `24.18.0` (`.nvmrc`, `.node-version`), with an
allowed range of `>=24.15.0 <25`, npm `11.6.2`, and `package-lock.json`.
For a reproducible install, run `npm ci` from the root. Before working on an
individual library, inspect its Nx targets with
`npx nx show project <name> --json`.

## Applications

| Action                          | Command                                              | What to check                                                                                          |
| ------------------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Run Angular Storefront          | `npx nx serve storefront`                            | `/uk` and `/ru` routes; backend URL in `apps/storefront/src/environments/environment.ts`               |
| Build Storefront for production | `npx nx build storefront`                            | Browser and server output in `dist/apps/storefront`                                                    |
| Run the server build locally    | `npm run storefront:start`                           | `PORT` or default port `4000`; Node SSR entry `server/server.mjs`                                      |
| Build React Admin               | `npx nx build admin-react`                           | Vite build and applicable `VITE_*` parameters from Admin config                                        |
| Check documentation             | `npm run docs:check` and `npm run docs:format:check` | Markdown links and formatting                                                                          |
| Check Admin API snapshot        | `npm run contracts:check`                            | Snapshot and generated types; process in [contract workflow](../architecture/api/contract-workflow.md) |

The root also defines `storefront:build-cloudflare` as an Nx target. Its
presence does not confirm that production is deployed on Cloudflare; a
separate deployment pipeline record is needed to establish the environment.

## Common failures

1. If an Nx command is unavailable, inspect `npx nx show project <name> --json`.
   Storefront has no separate test target as of this verification.
2. If the SSR server does not start, first run `npx nx build storefront`, then
   check `dist/apps/storefront/server/server.mjs` and `PORT`.
3. If `/uk` or `/ru` behaves differently between dev and build, check
   `app.routes.ts`, `app.routes.server.ts`, and the
   [Storefront runtime](../architecture/storefront/runtime.md).
4. If a future HTTP consumer sends requests to the wrong place, check
   `environment.api.baseUrl` and the [current API boundary](../architecture/api/storefront.md).
   A configured `HttpClient` alone does not prove a request exists.
5. If Admin API types do not match the backend, follow the
   [contract workflow](../architecture/api/contract-workflow.md); do not edit
   generated files manually.

Additional Admin test commands are listed in the
[testing rules](../standards/shared/testing-rules.md).
