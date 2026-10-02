# TS-001 — Detail data-access операцій

- **ID задачі:** TS-001
- **Статус:** superseded для Drawer scope — GET-by-ID не використовується
- **Охоплює:** SC-004–SC-006
- **Залежить від:** EN-001
- **Точні шляхи:** reference data-access garment-parts/operations, hooks/tests
- **Рівень тестування:** фокусний інтеграційний

## Робота

- [ ] Додати GET-by-ID transport, runtime mapping, abort, 404/error/retry.
- [ ] Зберегти DTO на transport boundary й reuse application models.
- [ ] Перевірити responsibilities і записати audit.

## Свідчення

- Red: direct page не має reliable read owner.
- Green: success/404/invalid response tests для обох сутностей.
- Regression: data-access test/typecheck.

## Контрольна точка

Detail/editor можуть читати запис без list state.
