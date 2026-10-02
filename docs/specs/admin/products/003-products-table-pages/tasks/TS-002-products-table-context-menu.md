# TS-002 — Таблиця товарів, меню рядка й фільтри

- **ID задачі:** TS-002
- **Статус:** completed
- **Охоплює:** SC-001, SC-002, SC-003, SC-004
- **Залежить від:** TS-001
- **Точні шляхи:** `libs/admin/products/feature/src/pages/product-list/products-page.tsx`,
  локальні components/tests, `product-delete-dialog.tsx`
- **Рівень тестування:** компонентний

## Робота

- [x] Видалити колонку «Дії» й відкрити MUI Menu на row context event із
      правильними переглядом, зміною та видаленням.
- [x] Додати клавіатурний виклик, повернення фокуса та стандартне закриття меню.
- [x] Зберегти checkbox/selection semantics і delete confirmation.
- [x] Надати пошуку, типу й категорії білу surface в обох темах локальним MUI styling.
- [x] Перевірити відповідальності змінених файлів і записати рішення в аудит.

## Свідчення

- Тест: `products-page.component.test.tsx`.
- Red: focused component run мав 3 failed: колонка «Дії» лишалася, context/keyboard
  menu та біла surface були відсутні.
- Green: 3 semantic interaction tests перевіряють mouse/keyboard menu, правильний
  row ID, focus return, selection/delete і computed white filter surface.
- Refactor: незалежну MUI Menu-відповідальність винесено в
  `product-row-context-menu.tsx`; query/filter state лишився у page.
- Regression: `npx nx test admin-products-feature` — 27/27; lint/typecheck — success.

## Контрольна точка

Кожний row відкриває доступне меню для власного ID, а filter fields не
зливаються з фоном.
