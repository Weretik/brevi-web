# TS-002 — Вкладки й меню рядків операцій

- **ID задачі:** TS-002
- **Статус:** completed
- **Охоплює:** SC-001–SC-003, SC-007
- **Залежить від:** `products/003-products-table-pages/TS-001`
- **Точні шляхи:** paired page/content/grids, router/tests
- **Рівень тестування:** компонентний, інтеграційний

## Робота

- [x] Перенести active tab у URL query.
- [x] Прибрати action columns, додати MUI context/keyboard menu та navigation.
- [x] Зберегти selection/bulk/delete confirmation і conflict messages.
- [x] Успадкувати central ukUA, не дублювати locale object.
- [x] Перевірити page/content/grid responsibilities і записати audit.

## Свідчення

- Tests:
  `libs/admin/references/feature/src/pages/garment-parts/garment-parts-page.component.test.tsx`,
  `libs/admin/references/feature/src/pages/garment-part-operations/garment-part-operations-page.component.test.tsx`,
  `apps/admin-react/src/app/router/app-router.integration.test.tsx` та paired
  Playwright specs.
- Red:
  `npx nx test admin-references-feature -- src/pages/garment-parts/garment-parts-page.component.test.tsx src/pages/garment-part-operations/garment-part-operations-page.component.test.tsx`
  — 7/7 failed через local-only tab, action columns, відсутні MUI row menus і
  англійські controls поза central theme composition.
- Green: та сама focused команда — 8/8 passed після додавання create-route
  assertion; попередній Green checkpoint був 7/7 до цього assertion.
- Refactor: обидва grids повторно використовують наявні
  `ReferenceRowContextMenu`/`useReferenceRowContextMenu`; domain empty overlays
  не перекривають central `localeText`; list робіт більше не вантажить lookup,
  потрібний лише editor page.
- Regression: `npx nx test admin-references-feature` — 33/33;
  `npx nx test admin-react` — 18/18; focused paired E2E — garment parts 3/3 у
  спільному запуску, garment operations 3/3 після locator fix.
- Static/build: lint для `admin-references-feature`, `admin-react` і
  `admin-react-e2e` — success; typecheck для цих проєктів і
  `admin-react:typecheck-tests` — success; `npx nx build admin-react` — success.

## Контрольна точка

Обидві таблиці мають однакові доступні row actions і stable tab URL.
