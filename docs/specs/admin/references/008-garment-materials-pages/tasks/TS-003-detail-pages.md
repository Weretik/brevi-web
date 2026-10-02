# TS-003 — Detail сторінки тканини й фурнітури

- **ID задачі:** TS-003
- **Статус:** superseded — рішенням 2026-10-01 detail перенесено в MUI Drawer
- **Охоплює:** SC-004, SC-008
- **Залежить від:** TS-001
- **Точні шляхи:** proposed detail pages/components, router, tests
- **Рівень тестування:** компонентний, інтеграційний

## Робота

- [ ] Створити два read-only detail page з loading/error/not-found/retry.
- [ ] Показати чинні поля в білих семантичних Card/Paper і edit link.
- [ ] Додати direct routes і back link до правильної вкладки.
- [ ] Перевірити responsibility boundaries і записати audit.

## Свідчення

- Red: view відкривається Dialog і не має URL.
- Green: detail component/router tests для обох сутностей.
- Regression: feature/app route suites.

## Контрольна точка

Обидва detail відтворюються після reload і не містять editable controls.
