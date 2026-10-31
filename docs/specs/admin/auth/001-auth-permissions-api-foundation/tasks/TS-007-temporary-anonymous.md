# TS-007 — Temporary anonymous Admin

Date: 2026-10-31. Status: implemented and locally verified. User requested removal of frontend authentication requirements while backend anonymous mode is enabled. Covers SC-009/R-010. Depends on: existing runtime config/session/API foundation and backend ApiAccess:AnonymousEnabled mode. Local implementation only; no deployment/commit/push requested.

## Rule / scenario

R-010: both development and production Admin environment configurations enable auth.anonymousAccess temporarily. Omitted/false restores existing authenticated behavior. Anonymous bootstrap clears stale in-memory tokens/private API cache, installs no auth adapter and never calls refresh/login/logout. No fake bearer tokens, browser persistence or fabricated user ID. All existing role-gated menu entries and Sewing read/manage controls are available without /me; valid business readiness checks stay in force. Real API errors remain errors, not forged success.

SC-009: Given anonymous mode and no session, when opening Admin and querying access, then the app mounts without refresh/login, role-gated navigation and product management controls are available, and API requests carry no automatically attached bearer. Given the switch false, existing session restore, role checks and refresh-on-401 remain. Test levels: config unit, auth lifecycle and real-store transport integration, existing navigation component regression. Normal routes already have no login guard; do not invent/remove guards that do not exist.

## Design / exact paths

- apps/admin-react/src/environments/environment{,.prod}.ts: enable temporary flag in each build environment.
- libs/admin/shared/config/src/{env/admin-environment.types.ts,config/app-config.types.ts,config/app-config.ts}: typed environment flag and normalized default false.
- libs/admin/core/auth/src/session/auth-session.ts: anonymous lifecycle branch before normal session flow.
- libs/admin/core/auth/src/session/session-roles.api.ts: anonymous local role projection for existing navigation; normal /me mapper unchanged.
- libs/admin/products/data-access/src/api/sewing-access/sewing-access.api.ts: anonymous local read/manage access projection; normal API mapping/errors retained.
- Tests colocated with config/auth/access API; API-client transport regression verifies no bearer and no 401 refresh. No new dependency or backend contract/DTO changes. Local role projection does not grant backend permissions; backend anonymous mode must actually be deployed/enabled.

## Work / evidence / checkpoint

Prepare behavior tests, obtain Red from existing refresh and /me calls, implement config/session/access queries, review normal mode and module boundaries, run focused checks, update feature card and traceability. SC-009 → TS-007 → config/auth/access integration tests → dated verification appended here. Restore by setting auth.anonymousAccess=false in both environment files, rebuild frontend and disable backend mode as appropriate. Full app suite, build, browser/E2E and live endpoints are outside this task.

## Verification — 2026-10-31

- Red: three new lifecycle tests demonstrated actual calls to refresh/login/logout in the old implementation. Initial access-query tests also failed; their mocked production API base URLs were made explicit before final checks, rather than treating URL setup failures as proof of behavior.
- npx vitest run --config libs/admin/core/auth/vitest.config.mts auth-session.integration session-roles.api.integration --maxWorkers=1: nine tests passed; existing restore/login/logout regression plus anonymous lifecycle and real-store role projection. Repeated after fixing one import-order lint finding.
- npx vitest run --config libs/admin/products/data-access/vitest.config.mts sewing-access --maxWorkers=1: three tests passed; mapper and real-store anonymous/normal access behavior.
- npx vitest run --config libs/admin/shared/api-client/vitest.config.mts auth-interceptors --maxWorkers=1: four tests passed, including no bearer/refresh/retry after removing the auth adapter and normal concurrent-refresh behavior.
- npx vitest run --config libs/admin/shared/config/vitest.config.mts --maxWorkers=1: four tests passed; default normal mode and explicit anonymous flag in both environment types.
- npx vitest run --config apps/admin-react/vitest.config.mts admin-route-layout.component navigation-config.unit --maxWorkers=1: six tests passed; existing role-gated menu behavior remains.
- Total distinct focused tests: 26. Type checks passed for libs/admin/core/auth/tsconfig.spec.json and libs/admin/products/data-access/tsconfig.spec.json. Scoped ESLint passed after fixing the import-order separator/order. Final documentation formatting/link/diff checks recorded by the delivery run.
- Self-review: config/session/API boundaries remain separate; no new guards/packages/routes; only two production /me consumers exist and both are mode-aware. No fake credential or user identity; in-memory token and RTK cache cleared at anonymous startup; logout does not revoke shared backend Admin sessions. Actual domain responses, errors and validation remain. Existing modules/styles/locale are unchanged; there is no new visual flow.
- No browser/manual/E2E, full suite, production build, real backend HTTP, commit, push or deployment performed. The backend anonymous mode must be updated/enabled on the same environment; local frontend role projections cannot bypass a still-protected remote API.

SC-009/R-010 → TS-007 → tests above → verified locally. Restore auth.anonymousAccess=false in both environment source files, rebuild/reload; coordinate with backend ApiAccess:AnonymousEnabled. Historical normal-mode evidence stays intact.
