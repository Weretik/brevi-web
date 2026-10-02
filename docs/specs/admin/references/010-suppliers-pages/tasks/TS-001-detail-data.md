# TS-001 — Supplier detail data

- **ID задачі:** TS-001
- **Охоплює:** SC-003–SC-005
- **Залежить від:** EN-001
- **Точні шляхи:** supplier data-access, hook, integration/unit tests
- **Рівень тестування:** focused integration
- **Статус:** blocked by EN-001

## Робота

- [ ] Add generated GET, runtime mapping, abort, 404/error/retry.
- [ ] Reuse Supplier model and keep DTO at transport boundary.
- [ ] Audit domain/hook responsibilities.

## Свідчення

- Red: direct URL has no data owner.
- Blocker verified 2026-10-01: generated `operations` has no
  `getSupplierById`, so response/error typing and runtime boundary cannot be
  implemented without inventing the backend contract.
- Green: success/404/invalid response tests.
- Regression: reference data-access tests/typecheck.

## Контрольна точка

Supplier detail reads independently of list state.
