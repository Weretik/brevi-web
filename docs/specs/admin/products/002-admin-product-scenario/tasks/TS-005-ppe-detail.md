# TS-005 — Показники Ppe detail

- **ID задачі:** TS-005
- **Охоплює:** SC-005
- **Залежить від:** TS-002
- **Точні шляхи:** `libs/admin/products/feature/src/components/ppe-product-detail.tsx` (цільовий), `libs/admin/products/feature/src/pages/product-detail-page.tsx`, `libs/admin/products/feature/src/components/ppe-product-detail.component.test.tsx` (цільовий)
- **Рівень тестування:** компонентний

## Робота

- [x] Показати постачальника, basePrice, джерело й значення retail/wholesale percent (`Reference` із назвою/значенням/одиницею або `Custom` із числом), серверні retailPrice/wholesalePrice.
- [x] Не обчислювати ціни на клієнті й не представляти відсутній reference як Custom.
- [x] Перевірити змінені файли на цілісність відповідальності; рішення записати в `code-audit/audit.md`. Розділити незалежні ролі за наявними межами, але не невеликий цілісний файл.

## Свідчення

- Шлях/назва фокусного тесту: Ppe detail fixture з одним Reference і одним Custom; обидві ціни беруться з відповіді.
- Red: Фокусний Playwright на порту 4311 впав на відсутньому джерелі роздрібного відсотка.
- Green: PPE calculations component + E2E; npx nx test admin-products-feature — 11/11, npx nx test admin-products-data-access — 11/11, product Playwright — 6/6.
- Refactor: межі відповідальностей перевірено в code-audit/audit.md; фокусні та повні перевірки повторено.
- Regression: ADMIN_REACT_BASE_URL=http://localhost:4319 npx nx e2e admin-react-e2e --workers=2 — 25/25.

## Контрольна точка

SC-005 дозволяє менеджеру бачити джерела відсотків і підтверджені ціни.
