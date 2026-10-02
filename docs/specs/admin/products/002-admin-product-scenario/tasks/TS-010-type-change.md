# TS-010 — Підтвердження зміни типу

- **ID задачі:** TS-010
- **Охоплює:** SC-008
- **Залежить від:** немає
- **Точні шляхи:** `libs/admin/products/ui/src/product-editor/core/product-base-fields.tsx`, `libs/admin/products/feature/src/components/product-editor/product-editor.tsx`, `libs/admin/products/ui/src/product-editor/core/product-type-change-dialog.tsx` (цільовий), `libs/admin/products/model/src/product-editor/product-draft.ts`, `libs/admin/products/feature/src/components/product-editor/product-editor.component.test.tsx` (цільовий)
- **Рівень тестування:** компонентний + модульний

## Робота

- [x] Перед зміною `Sewing`/`Ppe` повідомити, що умовні дані поточного типу будуть видалені після збереження; скасування залишає форму без змін.
- [x] Після підтвердження зберегти спільні поля/колекції, скинути попередній умовний блок, показати обов'язковий блок нового типу; не передавати поля старого типу.
- [x] Перевірити змінені файли на цілісність відповідальності; рішення записати в `code-audit/audit.md`. Розділити незалежні ролі за наявними межами, але не невеликий цілісний файл.

## Свідчення

- Шлях/назва фокусного тесту: Скасування не змінює тип/draft; підтвердження зберігає спільне й прибирає Sewing-поля.
- Red: Baseline не мав цієї поведінки; автоматичний Red до зміни не було зафіксовано.
- Green: type cancel E2E; npx nx test admin-products-feature — 11/11, npx nx test admin-products-data-access — 11/11, product Playwright — 6/6.
- Refactor: межі відповідальностей перевірено в code-audit/audit.md; фокусні та повні перевірки повторено.
- Regression: ADMIN_REACT_BASE_URL=http://localhost:4319 npx nx e2e admin-react-e2e --workers=2 — 25/25.

## Контрольна точка

SC-008 не втрачає умовні дані без явного підтвердження.
