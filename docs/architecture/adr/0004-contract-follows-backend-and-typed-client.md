# ADR-0004: The snapshot follows the backend default branch, and Admin calls the API through openapi-fetch

**Status:** accepted
**Decision date:** 2026-11-15
**Owners:** frontend, backend
**Applications:** Admin (client), all clients (snapshot)

## Context

Since [ADR-0003](0003-types-from-backend-openapi.md) the types came from a snapshot of hand-written backend YAML, copied by hand from a local BreviERP checkout. Nothing checked that the snapshot matched the backend, and nothing checked that the YAML matched the backend code. Admin endpoints sent `{ url, method, data }` through `axiosBaseQuery`, so a wrong path, parameter or body compiled and failed only at runtime.

BreviERP now generates `docs/sdd/contracts/openapi.json` from its code on every build, and its CI fails when the committed file differs from the code (BreviERP ADR-0015).

## Options

| Option                                                          | Complexity | Risks                                                            |
| --------------------------------------------------------------- | ---------- | ---------------------------------------------------------------- |
| Keep the manual sync from a local checkout                      | low        | the snapshot silently lags the backend                           |
| CI fails when the snapshot differs from the backend branch      | low        | a backend merge turns frontend CI red until someone syncs        |
| CI check plus a daily workflow that opens a sync pull request   | medium     | the workflow pull request needs CI started by hand (GitHub rule) |
| Typed `openapi-fetch` calls inside RTK Query `queryFn`          | medium     | one-time migration of every endpoint                             |
| Generate RTK Query endpoints from OpenAPI (`rtk-query-codegen`) | high       | replaces hand-written tags, mappers and cache updates            |

## Decision and reason

- The snapshot is `docs/contracts/openapi/openapi.json`, a copy of the BreviERP generated contract. `npm run contracts:sync` downloads it from the BreviERP default branch (`master`; `--ref <branch>` or `--file <path>` for a backend change that is not merged yet), records the commit in `SOURCE.md`, and regenerates `@admin/shared/contracts`.
- CI runs `npm run contracts:drift`: it fails when the snapshot differs from the backend default branch, and lists the added and removed paths.
- The workflow `contract-sync.yml` runs every weekday at 07:00 Kyiv time and on demand. When the contract changed, it opens or updates one pull request `chore/sync-backend-contract` and writes whether the typecheck passed.
- Admin calls the API through `apiClient`, an `openapi-fetch` client typed with `paths` from `@admin/shared/contracts`. Each RTK Query endpoint keeps its tags and cache updates and uses `queryFn: (arg, { signal }) => apiCall(apiClient.GET('/api/...', { params, body, signal }), mapper)`. A wrong path, parameter, body or mapper input no longer compiles.
- CSRF, development logging and the 401 redirect are `openapi-fetch` middleware; errors are normalized to the same `ApiError`.

## Consequences and verification

- A backend contract change reaches the frontend within a working day, as a pull request whose typecheck shows what to fix.
- `axios` and `axiosBaseQuery` are gone from Admin ([Admin ADR-0002](../admin/adr/0002-admin-openapi-fetch-transport.md)).
- The backend sends many codes as plain strings (`kind`, `status`), so the contract types them as `string`. The `data-access` mapper narrows them to the model union, the only place where a cast is allowed.
- Merge order: a backend change merges first, then the frontend syncs. Until BreviERP has `openapi.json` on `master`, `contracts:drift` fails.
- The workflow needs the repository setting «Allow GitHub Actions to create and approve pull requests».
- Checked by `contracts:fixtures`, `contracts:check` and `contracts:drift` in CI.
