# TS-002 — Additional references row menu

- **ID задачі:** TS-002
- **Охоплює:** SC-001, SC-002, SC-006
- **Залежить від:** `products/003-products-table-pages/TS-001`, TS-001 for delete
- **Точні шляхи:** additional references page/grid, proposed delete dialog/hook, tests
- **Рівень тестування:** component
- **Статус:** blocked — delete owner залежить від TS-001; shared locale
  dependency завершено

## Робота

- [ ] Remove edit action column; add MUI mouse/keyboard row menu.
- [ ] Route view/edit and connect confirmed delete only after TS-001.
- [ ] Preserve focus/close semantics and central ukUA/domain empty text.
- [ ] Audit page/grid/delete responsibilities.

## Свідчення

- Red: only inline edit button exists.
- Green: three row actions, focus, locale and delete confirm tests.
- Regression: reference feature tests.

## Контрольна точка

Every row exposes correct accessible actions without inline action column.
