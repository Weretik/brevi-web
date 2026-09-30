# TS-006 — Ready media та керування фото

- **ID задачі:** TS-006
- **Охоплює:** SC-006
- **Залежить від:** немає
- **Точні шляхи:** `libs/admin/products/feature/src/components/product-photo-fields.tsx`, `libs/admin/products/feature/src/components/product-photo-upload.tsx` (цільовий), `libs/admin/products/feature/src/components/product-photo-fields.component.test.tsx` (цільовий), `libs/admin/products/data-access/src/product-lookups.api.ts`, `libs/admin/products/data-access/src/products.api.integration.test.ts`
- **Рівень тестування:** компонентний + фокусний інтеграційний

## Робота

- [x] Після upload оновити media list і перевірити `status === 'Ready'` перед прив'язкою; у списку вибору приховати/заборонити неготові та вже вибрані ID. Невідомий статус не вважати Ready.
- [x] Показати прев'ю готового URL; дозволити змінити `alt`, видимість, рівно одну головну ознаку й порядок; після видалення/перестановки нормалізувати `sortOrder`.
- [x] Upload і налаштування зв'язку рознести, якщо незалежні ролі лишаються в одному складному компоненті; не передавати URL у write.
- [x] Перевірити змінені файли на цілісність відповідальності; рішення записати в `code-audit/audit.md`. Розділити незалежні ролі за наявними межами, але не невеликий цілісний файл.

## Свідчення

- Шлях/назва фокусного тесту: Upload без status → media GET з Pending/Ready; лише Ready можна додати один раз, змінити порядок і зберегти IDs.
- Red: Baseline не мав цієї поведінки; автоматичний Red до зміни не було зафіксовано.
- Green: Ready/Pending upload and reorder E2E; npx nx test admin-products-feature — 11/11, npx nx test admin-products-data-access — 11/11, product Playwright — 6/6.
- Refactor: межі відповідальностей перевірено в code-audit/audit.md; фокусні та повні перевірки повторено.
- Regression: ADMIN_REACT_BASE_URL=http://localhost:4319 npx nx e2e admin-react-e2e --workers=2 — 25/25.

## Контрольна точка

SC-006 не прив'язує неготовий файл і зберігає керований порядок фото.
