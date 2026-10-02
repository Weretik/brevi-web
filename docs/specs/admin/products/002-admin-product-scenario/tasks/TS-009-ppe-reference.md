# TS-009 — Вибір PPE відсотка

- **ID задачі:** TS-009
- **Охоплює:** SC-005
- **Залежить від:** немає
- **Точні шляхи:** `libs/admin/products/ui/src/product-editor/ppe/ppe-product-fields.tsx`, `libs/admin/products/feature/src/hooks/product-editor/use-product-lookups.ts`, `libs/admin/products/feature/src/components/product-editor/product-editor.component.test.tsx` (цільовий)
- **Рівень тестування:** компонентний

## Робота

- [x] У `Reference` показувати тільки AdditionalReference з `unit === '%'`, а вже збережений некоректний запис пояснювати як стан помилки, не підміняти іншим.
- [x] При переході `Reference` ↔ `Custom` очищати значення попереднього режиму й надсилати лише поле активного режиму; Custom приймає невід'ємне число.
- [x] Перевірити змінені файли на цілісність відповідальності; рішення записати в `code-audit/audit.md`. Розділити незалежні ролі за наявними межами, але не невеликий цілісний файл.

## Свідчення

- Шлях/назва фокусного тесту: Lookup з `%` та іншою одиницею; перемикання двох режимів і валідний write draft.
- Red: Baseline не мав цієї поведінки; автоматичний Red до зміни не було зафіксовано.
- Green: PPE mixed-source E2E; npx nx test admin-products-feature — 11/11, npx nx test admin-products-data-access — 11/11, product Playwright — 6/6.
- Refactor: межі відповідальностей перевірено в code-audit/audit.md; фокусні та повні перевірки повторено.
- Regression: ADMIN_REACT_BASE_URL=http://localhost:4319 npx nx e2e admin-react-e2e --workers=2 — 25/25.

## Контрольна точка

SC-005 не пропонує невідповідний довідник і не змішує режими відсотка.
