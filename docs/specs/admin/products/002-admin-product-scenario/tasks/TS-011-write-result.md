# TS-011 — Повний write та detail після відповіді

- **ID задачі:** TS-011
- **Охоплює:** SC-008
- **Залежить від:** TS-002, TS-010
- **Точні шляхи:** `libs/admin/products/feature/src/components/product-editor/product-editor.tsx`, `libs/admin/products/feature/src/pages/product-detail/product-detail-page.tsx`, `libs/admin/products/feature/src/pages/product-editor/product-edit-page.tsx`, `libs/admin/products/data-access/src/products.api.ts`, `apps/admin-react-e2e/src/products.spec.ts`
- **Рівень тестування:** фокусний інтеграційний + E2E

## Робота

- [x] Переконатися, що create/replace передає всі актуальні спільні колекції та лише обраний тип, ID тільки в правильному місці, один активний write; cancel не відправляє PUT.
- [x] Передати повний `ProductDetail` із 201/200 до картки без обов'язкового другого GET; прямий URL/reload і retry отримують актуальний detail через GET.
- [x] Зберегти помилки й draft при невдалому write; не вводити довгоживучий дубльований Product store.
- [x] Перевірити змінені файли на цілісність відповідальності; рішення записати в `code-audit/audit.md`. Розділити незалежні ролі за наявними межами, але не невеликий цілісний файл.

## Свідчення

- Шлях/назва фокусного тесту: Create/replace з усіма nested полями; 201/200 відразу показує slug/розрахунки без додаткового GET, reload виконує GET.
- Red: Baseline не мав цієї поведінки; автоматичний Red до зміни не було зафіксовано.
- Green: write response/reload E2E; npx nx test admin-products-feature — 11/11, npx nx test admin-products-data-access — 11/11, product Playwright — 6/6.
- Refactor: межі відповідальностей перевірено в code-audit/audit.md; фокусні та повні перевірки повторено.
- Regression: ADMIN_REACT_BASE_URL=http://localhost:4319 npx nx e2e admin-react-e2e --workers=2 — 25/25.

## Контрольна точка

SC-008 використовує повну відповідь write, а прямі посилання залишаються актуальними.
