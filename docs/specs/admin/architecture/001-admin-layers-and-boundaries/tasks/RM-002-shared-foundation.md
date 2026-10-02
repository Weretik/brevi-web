# RM-002 — Shared contracts, config і RTK baseApi foundation

- **Findings:** AF-004, AF-006, AF-010
- **Requirements:** AR-004, AR-005
- **Depends on:** RM-001
- **Exact paths:** `libs/admin/shared/{contracts,config,api-client}/`,
  `apps/admin-react/src/app/providers/`, `apps/admin-react/src/main.tsx`, aliases,
  existing `libs/admin/{api-contract,util}`.

## Work

- [x] Перенести generated contract/config ownership до target shared projects.
- [x] Створити один RTK Query `baseApi`/baseQuery з cancellation, credentials і
      normalized safe errors; підключити store/provider у app composition.
- [x] Дозволити лише короткочасні compatibility exports до RM-009.
- [x] Додати focused config/baseApi integration tests і source/test targets.

## Evidence

- Canonical owners: `admin-shared-contracts`, `admin-shared-config` і
  `admin-shared-api-client`; app composition використовує `AdminApiProvider`.
- Focused config/baseApi tests, source typecheck і test typecheck пройшли.

## Checkpoint

App має один canonical API foundation; generated contract і runtime config
доступні через root public aliases; domain behavior ще не змінено.
