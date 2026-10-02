# TS-012 — Порожні стани й API помилки

- **ID задачі:** TS-012
- **Охоплює:** SC-009
- **Залежить від:** TS-006, TS-011
- **Точні шляхи:** `libs/admin/products/data-access/src/products.http.ts`, `libs/admin/products/data-access/src/products.api.integration.test.ts`, `libs/admin/products/feature/src/hooks/product-editor/use-product-lookups.ts`, `libs/admin/products/feature/src/components/product-editor/product-editor.tsx`, `libs/admin/products/feature/src/components/product-deletion/product-delete-dialog.tsx`, `libs/admin/products/feature/src/pages/product-detail/product-detail-page.tsx`, `libs/admin/products/feature/src/components/product-editor/product-editor.component.test.tsx` (цільовий)
- **Рівень тестування:** фокусний інтеграційний + компонентний

## Робота

- [x] Розрізняти loading та empty; пояснити порожній обов'язковий довідник і заблокувати невалідне збереження, залишивши можливість retry.
- [x] Прив'язати 400 identifiers до полів/блоків; розібрати 409 array повідомлень у безпечний видимий текст; 404 detail/update/delete показати як недоступність із шляхом до списку без припущення про body.
- [x] Зберігати введене при мережевій/серверній помилці; запобігти другому submit до завершення першого; не показувати успіх до API confirmation.
- [x] Перевірити змінені файли на цілісність відповідальності; рішення записати в `code-audit/audit.md`. Розділити незалежні ролі за наявними межами, але не невеликий цілісний файл.

## Свідчення

- Шлях/назва фокусного тесту: 400 fieldErrors, 409 body, empty required lookup, 404 write/delete, network failure і два швидкі submit.
- Red: Baseline не мав цієї поведінки; автоматичний Red до зміни не було зафіксовано.
- Green: 409 array integration test + E2E; npx nx test admin-products-feature — 11/11, npx nx test admin-products-data-access — 11/11, product Playwright — 6/6.
- Refactor: межі відповідальностей перевірено в code-audit/audit.md; фокусні та повні перевірки повторено.
- Regression: ADMIN_REACT_BASE_URL=http://localhost:4319 npx nx e2e admin-react-e2e --workers=2 — 25/25.

## Контрольна точка

SC-009 дає дію для кожного стану й не втрачає форму.
