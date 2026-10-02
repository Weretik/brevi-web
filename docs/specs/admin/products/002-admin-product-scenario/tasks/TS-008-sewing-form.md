# TS-008 — Порядок і правила Sewing форми

- **ID задачі:** TS-008
- **Охоплює:** SC-004, SC-007
- **Залежить від:** немає
- **Точні шляхи:** `libs/admin/products/ui/src/product-editor/sewing/sewing-fabric-fields.tsx`, `libs/admin/products/ui/src/product-editor/sewing/sewing-accessory-fields.tsx`, `libs/admin/products/ui/src/product-editor/sewing/sewing-operation-fields.tsx`, `libs/admin/products/model/src/product-editor/product-validation.ts`, `libs/admin/products/feature/src/components/product-editor/product-editor.component.test.tsx` (цільовий)
- **Рівень тестування:** модульний + компонентний

## Робота

- [x] Додати перестановку тканин і фурнітури з нормалізацією `sortOrder`; основні тканини показувати першими за порядком у групі.
- [x] Зберегти унікальність ID, додатну quantity й meters; одна обрана тканина має бути основною, максимум дві основні. Операції унікальні й можуть бути порожніми; duration не вводити.
- [x] Перевірити змінені файли на цілісність відповідальності; рішення записати в `code-audit/audit.md`. Розділити незалежні ролі за наявними межами, але не невеликий цілісний файл.

## Свідчення

- Шлях/назва фокусного тесту: Одна/дві основні, дублікати, порожні операції й переставлення двох елементів з перевіркою payload.
- Red: Baseline не мав цієї поведінки; автоматичний Red до зміни не було зафіксовано.
- Green: product-fabrics unit tests + Sewing E2E; npx nx test admin-products-feature — 11/11, npx nx test admin-products-data-access — 11/11, product Playwright — 6/6.
- Refactor: межі відповідальностей перевірено в code-audit/audit.md; фокусні та повні перевірки повторено.
- Regression: ADMIN_REACT_BASE_URL=http://localhost:4319 npx nx e2e admin-react-e2e --workers=2 — 25/25.

## Контрольна точка

Sewing form зберігає порядок і дозволені правила без ручних цін/тривалості.
