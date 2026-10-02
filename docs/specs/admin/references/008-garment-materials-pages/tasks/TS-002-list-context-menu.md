# TS-002 — Вкладки й контекстні меню таблиць

- **ID задачі:** TS-002
- **Статус:** completed
- **Охоплює:** SC-001, SC-002, SC-003, SC-007
- **Залежить від:** `products/003-products-table-pages/TS-001`
- **Точні шляхи:** garment accessory/fabric pages, contents, grids і tests
- **Рівень тестування:** компонентний, інтеграційний

## Робота

- [x] Синхронізувати tab з URL query й back target.
- [x] Прибрати обидві action columns; додати спільне MUI context/keyboard menu.
      Перехід menu actions на child routes належить blocked TS-003/TS-004;
      до цього чинні dialogs збережені, щоб не ламати view/edit.
- [x] Зберегти selection, bulk delete та row delete confirmation.
- [x] Успадкувати централізовану ukUA без дублювання повного localeText.
- [x] Перевірити відповідальності page/content/grid і записати audit.

## Свідчення

- Red: `npx nx test admin-references-feature --
src/pages/garment-accessories/garment-accessories-page.component.test.tsx
src/pages/fabrics/fabrics-page.component.test.tsx` — 5/13 failed: action column,
  відсутні mouse/keyboard menu і URL tab restore.
- Green: та сама focused команда — 13/13 passed; mouse menu зберігає selection,
  Shift+F10 відкриває ті самі дії, Escape повертає focus, URL query відновлює tab.
- Refactor: спільні menu behavior і MUI Menu винесено в
  `use-reference-row-context-menu.ts` та `reference-row-context-menu.tsx`;
  domain columns/rows лишилися у двох grids. Локальний `localeText` замінено
  no-rows slots, щоб системні написи успадковували theme ukUA.
- Regression: `npx nx test admin-references-feature` — 35/35;
  `npx nx test admin-react` — 18/18; `npx nx lint admin-references-feature` і
  `npx nx lint admin-react` — success; feature/app source та test typecheck — success;
  `npx nx build admin-react` — success.
- Delivery recheck без Nx cache: focused 13/13, feature 35/35, data-access
  27/27, app 18/18; `garment-accessories.spec.ts` 3/3; lint трьох affected
  projects, available typechecks, contracts check і production build — success.

## Контрольна точка

Обидві таблиці мають однакове доступне меню й відновлювану вкладку.
