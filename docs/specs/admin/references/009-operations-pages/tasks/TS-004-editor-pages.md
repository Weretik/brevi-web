# TS-004 — Create/edit сторінки елементів і робіт

- **ID задачі:** TS-004
- **Статус:** superseded — рішенням 2026-10-01 editor перенесено в MUI Drawer
- **Охоплює:** SC-005, SC-006, SC-008
- **Залежить від:** TS-001
- **Точні шляхи:** editor hooks/validation, proposed forms/pages, router/tests
- **Рівень тестування:** component/unit

## Робота

- [ ] Замінити dialogs routes і reuse validation/writes.
- [ ] Зробити одну form structure на сутність для empty create/filled edit.
- [ ] Розмістити всі fields в Card/Paper; operation groups адаптувати responsive.
- [ ] Зберегти garment parts lookup states, field errors, write lock і cancel.
- [ ] Перевірити responsibilities і записати audit.

## Свідчення

- Red: route forms відсутні.
- Green: structural/editor tests обох modes і lookup errors.
- Regression: unit/feature/data-access tests.

## Контрольна точка

Create/edit працюють на окремих URL без duplicated form structures.
