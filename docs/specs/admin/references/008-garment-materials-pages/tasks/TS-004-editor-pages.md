# TS-004 — Create/edit сторінки тканини й фурнітури

- **ID задачі:** TS-004
- **Статус:** superseded — рішенням 2026-10-01 editor перенесено в MUI Drawer
- **Охоплює:** SC-005, SC-006, SC-008
- **Залежить від:** TS-001
- **Точні шляхи:** current editor hooks/validation, proposed editor pages/forms, router/tests
- **Рівень тестування:** компонентний, модульний

## Робота

- [ ] Замінити dialogs окремими routes, повторно використавши validation і writes.
- [ ] Для кожної сутності створити одну form structure для empty create і filled edit.
- [ ] Розмістити всі поля у білих Card/Paper; адаптувати двоколонковий layout.
- [ ] Зберегти supplier loading/errors, write lock, cancel і field errors.
- [ ] Перевірити responsibilities і записати audit.

## Свідчення

- Red: create/edit існують лише в Dialog.
- Green: спільні structural tests для двох режимів кожної форми.
- Regression: validation, feature і data-access tests.

## Контрольна точка

Чотири routes використовують дві спільні, не дубльовані form structures.
