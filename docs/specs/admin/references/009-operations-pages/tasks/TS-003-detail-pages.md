# TS-003 — Detail сторінки елементів і робіт

- **ID задачі:** TS-003
- **Статус:** superseded — рішенням 2026-10-01 detail перенесено в MUI Drawer
- **Охоплює:** SC-004, SC-008
- **Залежить від:** TS-001
- **Точні шляхи:** proposed detail pages/components, router/tests
- **Рівень тестування:** component/integration

## Робота

- [ ] Створити read-only detail pages з усіма fetch states і edit/back links.
- [ ] Розмістити чинні поля в білих семантичних Card/Paper.
- [ ] Додати direct routes й правильні return tabs.
- [ ] Перевірити responsibilities і записати audit.

## Свідчення

- Red: view лише в dialogs.
- Green: detail/router tests для element і work.
- Regression: app route/feature suites.

## Контрольна точка

Два detail відновлюються після reload і не мають editable controls.
