# TS-004 — Показники Sewing detail

- **ID задачі:** TS-004
- **Охоплює:** SC-004
- **Залежить від:** TS-002
- **Точні шляхи:** `libs/admin/products/ui/src/product-detail/sewing-product-detail.tsx` (цільовий), `libs/admin/products/feature/src/pages/product-detail/product-detail-page.tsx`, `libs/admin/products/ui/src/product-detail/product-calculations.component.test.tsx` (цільовий)
- **Рівень тестування:** компонентний

## Робота

- [x] Показати метри, тканини з основною ознакою/ціною, фурнітуру з quantity/ціною, операції з minutes, `piecesPerShift` без округлення до цілого.
- [x] Показати `prices.byFabric` для 1–10, 11–39, 40+ та `prices.ranges` min/max із fabric IDs або відповідними назвами; при `null` показати «ще не розраховано».
- [x] Не вводити клієнтську формулу чи ручне поле розрахованої ціни.
- [x] Перевірити змінені файли на цілісність відповідальності; рішення записати в `code-audit/audit.md`. Розділити незалежні ролі за наявними межами, але не невеликий цілісний файл.

## Свідчення

- Шлях/назва фокусного тесту: Fixture з дробовим `piecesPerShift`, усіма діапазонами й окремий fixture з `null`.
- Red: Фокусний Playwright на порту 4311 впав на відсутньому стані продуктивності.
- Green: Sewing calculations component + E2E; npx nx test admin-products-feature — 11/11, npx nx test admin-products-data-access — 11/11, product Playwright — 6/6.
- Refactor: межі відповідальностей перевірено в code-audit/audit.md; фокусні та повні перевірки повторено.
- Regression: ADMIN_REACT_BASE_URL=http://localhost:4319 npx nx e2e admin-react-e2e --workers=2 — 25/25.

## Контрольна точка

SC-004 не приховує жодного серверного Sewing показника.
