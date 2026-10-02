# RM-005 — Products RTK Query migration

- **Findings:** AF-004
- **Requirements:** AR-004
- **Depends on:** RM-003, RM-004
- **Exact paths:** `libs/admin/products/data-access/src/`, product feature hooks/
  components/pages, app provider, product integration/component tests.

## Work

- [x] Оголосити product/media/lookups endpoints через shared `baseApi`.
- [x] Перенести cache keys, loading/errors, cancellation та invalidation в RTK Query.
- [x] Замінити manual server `useEffect/useState/revision` і component API calls
      на generated hooks та feature orchestration.
- [x] Видалити products direct-fetch production path після parity evidence.

## Evidence

- Product, category і media endpoints використовують injected RTK Query hooks;
  successful mutations інвалідують списки, replace оновлює detail cache.
- Forbidden `fetch/useEffect/revision` search порожній; product data-access,
  feature і E2E regressions пройшли.

## Checkpoint

Forbidden search не знаходить domain `fetch` або manual query lifecycle;
products integration/component regression і contract checks green.
