# TS-001 — Повний список і сортування

- **ID задачі:** TS-001
- **Охоплює:** SC-001
- **Залежить від:** немає
- **Точні шляхи:** `libs/admin/products/feature/src/pages/product-list/products-page.tsx`, `libs/admin/products/feature/src/hooks/product-list/use-product-categories.ts`, `libs/admin/products/feature/src/pages/product-list/products-page.component.test.tsx` (цільовий), `apps/admin-react-e2e/src/products.spec.ts`
- **Рівень тестування:** компонентний + фокусний E2E

## Робота

- [x] Показати назви категорій за list `categoryIds`, дату зміни, усі наявні колонки й стан ціни 0; якщо назва категорії недоступна, показати її ID без вигаданої назви.
- [x] Встановити `name asc` на старті; підтримати `id/name/createdAt/updatedAt` і `asc/desc`, серверні search/type/category/pageSize та повернення на сторінку 1 після зміни умов.
- [x] Перевірити змінені файли на цілісність відповідальності; рішення записати в `code-audit/audit.md`. Розділити незалежні ролі за наявними межами, але не невеликий цілісний файл.

## Свідчення

- Шлях/назва фокусного тесту: Рендер рядка з двома категоріями й обома датами; запит `name asc` на старті та `updatedAt desc` після дії.
- Red: Список початково надсилав sortBy=id; фокусний Playwright на порту 4310 впав на очікуванні name.
- Green: server sort/list E2E; npx nx test admin-products-feature — 11/11, npx nx test admin-products-data-access — 11/11, product Playwright — 6/6.
- Refactor: межі відповідальностей перевірено в code-audit/audit.md; фокусні та повні перевірки повторено.
- Regression: ADMIN_REACT_BASE_URL=http://localhost:4319 npx nx e2e admin-react-e2e --workers=2 — 25/25.

## Контрольна точка

SC-001 показує всі поля і надсилає підтримані серверні query parameters.
