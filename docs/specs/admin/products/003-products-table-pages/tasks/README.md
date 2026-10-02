# Товари — граф задач

## Фази планування

- [00 — Готовність](phases/00-readiness.md)
- [03 — React Web UI](phases/03-react-web-ui.md)
- [04 — Навігація](phases/04-navigation-browser.md)
- [06 — Перевірка](phases/06-verification.md)

## Задачі

| ID     | Відповідальність                          | Залежить від           | Статус    | Файл                                            |
| ------ | ----------------------------------------- | ---------------------- | --------- | ----------------------------------------------- |
| TS-001 | Центральна українська locale MUI          | немає                  | completed | [TS-001](TS-001-mui-ukrainian-locale.md)        |
| TS-002 | Таблиця, меню рядка й білі фільтри        | TS-001                 | completed | [TS-002](TS-002-products-table-context-menu.md) |
| TS-003 | Read-only detail у змістових Card/Paper   | немає                  | completed | [TS-003](TS-003-product-detail-layout.md)       |
| TS-004 | Спільна create/edit форма у білих секціях | немає                  | completed | [TS-004](TS-004-product-editor-layout.md)       |
| TS-005 | Route/E2E/regression verification         | TS-002, TS-003, TS-004 | completed | [TS-005](TS-005-products-verification.md)       |
