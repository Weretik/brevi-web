# TS-002 — Заголовок і галерея detail

- **ID задачі:** TS-002
- **Охоплює:** SC-002
- **Залежить від:** немає
- **Точні шляхи:** `libs/admin/products/feature/src/pages/product-detail/product-detail-page.tsx`, `libs/admin/products/ui/src/product-detail/product-detail-header.tsx`, `libs/admin/products/ui/src/product-detail/product-detail-gallery.tsx`, `libs/admin/products/feature/src/pages/product-detail/product-detail-page.component.test.tsx` (цільові)
- **Рівень тестування:** компонентний

## Робота

- [x] Показати ID, дві назви, тип, slug, created/updated dates і категорії з ProductDetail.
- [x] Показати всі фото за `sortOrder`, включно з прихованими, з прев'ю URL, `alt`, видимістю й головною ознакою; порожню галерею назвати явно.
- [x] Винести read-only секції з route page, залишивши там fetch/error/navigation.
- [x] Перевірити змінені файли на цілісність відповідальності; рішення записати в `code-audit/audit.md`. Розділити незалежні ролі за наявними межами, але не невеликий цілісний файл.

## Свідчення

- Шлях/назва фокусного тесту: Detail fixture з прихованим і головним фото, переплутаним array order і двома датами.
- Red: Фокусний Playwright на порту 4311 впав на відсутньому Slug: gloves.
- Green: header/gallery E2E; npx nx test admin-products-feature — 11/11, npx nx test admin-products-data-access — 11/11, product Playwright — 6/6.
- Refactor: межі відповідальностей перевірено в code-audit/audit.md; фокусні та повні перевірки повторено.
- Regression: ADMIN_REACT_BASE_URL=http://localhost:4319 npx nx e2e admin-react-e2e --workers=2 — 25/25.

## Контрольна точка

Усі метадані й фото detail доступні без даних із list row.
