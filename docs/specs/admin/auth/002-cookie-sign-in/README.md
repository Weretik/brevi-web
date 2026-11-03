# Admin: cookie sign-in like Kedr

**Status:** implemented 2026-11-03; deploy together with BreviERP [identity 001](https://github.com/Weretik/BreviERP/blob/master/docs/sdd/specs/identity/001-cookie-sign-in/README.md). Supersedes the temporary anonymous mode of [auth 001 TS-007](../001-auth-permissions-api-foundation/tasks/TS-007-temporary-anonymous.md). Plan: [idea](../../../../ideas/auth-like-kedr.md); pattern: kedr-web PR #15.

## Decisions

| ID  | Decision                                                                                                                                                                                                                                                                                                                                                              |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| D-1 | The session lives only in the HttpOnly cookie `__Host-brevi.session` of `api.brevi.com.ua`. The Admin keeps no token in JavaScript or browser storage; every request goes with `withCredentials`.                                                                                                                                                                     |
| D-2 | `POST`, `PUT`, `PATCH`, `DELETE` send the value of the readable cookie `brevi.csrf` in `X-CSRF-Token` (`shared/api-client/src/csrf`).                                                                                                                                                                                                                                 |
| D-3 | Start: `GET /api/auth/session/me` restores the user. No session → `/login?returnTo=…`; a `401` from any data request ends the local session and drops the RTK Query cache. A `401` from `/api/auth/*` stays with the login page.                                                                                                                                      |
| D-4 | Only staff (Director, Admin, Accountant, Manager) open the Admin; a `User` account sees «Немає доступу» with «Увійти під іншим обліковим записом».                                                                                                                                                                                                                    |
| D-5 | Navigation roles come from the signed-in user. Admin-only entries: «Реквізити та шаблон КП» and «Адміністрування → Користувачі» (`/admin/users`, guarded by `RequireRole`).                                                                                                                                                                                           |
| D-6 | «Користувачі»: list, create Director/Admin/Accountant/Manager, change role, block/unblock, new password, delete. Forms open in the right side panel; changes ask for confirmation. One director; only the director changes the director; nobody blocks or deletes themselves; only the director changes their own role (owner, 2026-11-03; the backend also refuses). |
| D-7 | Production API address `https://api.brevi.com.ua` (Cloudflare Worker in front of Cloud Run). `auth.anonymousAccess` is removed from the configuration.                                                                                                                                                                                                                |

## Contract

Operations (snapshot `docs/contracts/openapi/backend`, provenance in `SOURCE.json`): `loginCookieSession`, `logoutCookieSession`, `getCurrentSession`, `getStaffAccounts`, `createStaffAccount`, `changeStaffRole`, `setStaffBlocked`, `setStaffPassword`. Responses are checked at runtime in `users/data-access/src/mappers`.

## Verification

`npx nx run-many -t lint typecheck test -p admin-core-auth,admin-shared-api-client,admin-shared-config,admin-users-model,admin-users-data-access,admin-users-ui,admin-users-feature,admin-clients-data-access,admin-products-data-access`, `npx nx test admin-react`, `npm run contracts:check`.

## Rollout

1. Cloudflare Worker `api.brevi.com.ua` and secrets in GCP (BreviERP runbook `docs/sdd/operations/deployment/cloudflare-api-proxy.md`).
2. Merge BreviERP and brevi-web together; the old Admin without sign-in stops working once the backend closes its APIs.
3. Sign in as `admin@brevi.com.ua` and create staff accounts on «Користувачі».

Rollback: revert both merges together.
