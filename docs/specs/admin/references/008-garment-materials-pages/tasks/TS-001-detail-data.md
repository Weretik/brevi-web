# TS-001 — Detail data-access тканини й фурнітури

- **ID задачі:** TS-001
- **Статус:** superseded для Drawer scope — GET-by-ID не використовується
- **Охоплює:** SC-004, SC-005, SC-006
- **Залежить від:** EN-001
- **Точні шляхи:** `libs/admin/references/data-access/src/{garment-accessories,fabrics}/`,
  feature hooks і integration tests
- **Рівень тестування:** фокусний інтеграційний

## Робота

- [ ] Реалізувати generated GET-by-ID, runtime validation/mapping, abort,
      not-found/error/retry для обох сутностей.
- [ ] Повторно використати row application models без transport DTO у UI.
- [ ] Перевірити цілісність domain files і записати рішення в audit.

## Свідчення

- Red: direct detail не має API owner.
- Green: два focused API/hook tests проходять success/404/invalid response.
- Regression: `npx nx test admin-references-data-access`.

## Контрольна точка

Кожна сутність надійно читається за ID незалежно від list state.
