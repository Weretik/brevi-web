# TS-002 — Axios RTK transport foundation

- **ID задачі:** TS-002
- **Охоплює:** SC-002, SC-003, SC-006, SC-007
- **Залежить від:** TS-001
- **Точні шляхи:** `libs/admin/shared/api-client/`, products/references
  data-access imports/tests when compatibility requires changes
- **Рівень тестування:** модульний + фокусний інтеграційний

## Робота

- [x] Characterize current reducer path, tag types, error messages, cancellation,
      credentials, provider/store reset and domain endpoint behavior.
- [x] Red: add focused tests for Axios base query, safe error mapping, AbortSignal,
      logging redaction and bounded concurrent refresh plumbing.
- [x] Split source roles into `client`, `contracts`, `errors`, `interceptors`,
      `rtk-query`, `runtime`; one Axios instance and one RTK API only.
- [x] Preserve/atomically migrate current `adminApi`, provider, tag types and
      feature error helper contracts; no second error model exposed to consumers.
- [x] Install auth adapter hooks without owning token or auth endpoint.
- [x] Search for direct fetch/Axios, deep imports, stale exports and duplicate stores.
- [x] Перевірити architecture baseline та відповідальності кожного зміненого
      файла; оновити audit, не split-ити малий цілісний файл формально.

## Свідчення

- Фокусні тести: `errors/api-error.unit.test.ts`,
  `interceptors/{auth-interceptors.integration,api-logging.interceptor.unit}.test.ts`,
  `rtk-query/api-client.integration.test.ts`.
- Red: `npx nx test admin-shared-api-client` — Axios validation response failed
  normalization while canonical reducer test passed.
- Green: `npx nx test admin-shared-api-client` — 5 files, 10/10 tests passed.
- Refactor: mixed `src/lib/admin-api*` split by roles; focused suite repeated.
- Regression: products data-access 2/2, references data-access 14/14, products
  feature 11/11, references feature 33/33, app 18/18; affected lint/typecheck
  and `npx nx build admin-react` passed. Initial concurrent run hit Node OOM and
  one timeout; sequential reruns passed without code/test-timeout changes.

## Контрольна точка

Виконано: один canonical Axios-backed RTK API обслуговує current domain
endpoints без зміни visible behavior; auth lifecycle доступний лише через adapter.
