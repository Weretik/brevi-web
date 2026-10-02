# TS-006 — MUI Drawer для елементів і робіт

- **ID задачі:** TS-006
- **Статус:** completed
- **Охоплює:** SC-004–SC-006, SC-008
- **Залежить від:** TS-002
- **Точні шляхи:** list contents, editor hooks, domain Drawer, component/E2E tests
- **Рівень тестування:** component/E2E

## Робота

- [x] Замінити переходи на неіснуючі child routes правими MUI Drawer.
- [x] Додати read-only view і перехід view → edit у тому самому Drawer.
- [x] Повторно використати editor hooks, validation, API writes і field errors.
- [x] Розділити поля MUI Paper секціями та забезпечити ширину 100% на mobile.
- [x] Зберегти lookup loading/error/retry і блокування save для роботи.
- [x] Видалити неімпортовані Dialog-компоненти та уточнити назви mode types.

## Свідчення

- Red: focused component run — 4 Drawer scenarios failed, бо actions переходили
  на child URL і показували Not Found.
- Green: focused run — 2 files, 10/10 tests passed, включно з lookup retry.
- E2E: paired specs перевіряють view/edit Drawer, незмінний URL, selection і delete.
- Audit: [code-audit/audit.md](../code-audit/audit.md).

## Контрольна точка

Create/view/edit обох сутностей працюють у MUI Drawer без зміни URL вкладки.
