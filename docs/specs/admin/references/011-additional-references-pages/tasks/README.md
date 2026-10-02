# Додаткові довідники — граф задач

## Фази планування

- [00 — Готовність](phases/00-readiness.md)
- [02 — Стан і дані](phases/02-state-data.md)
- [03 — React Web UI](phases/03-react-web-ui.md)
- [04 — Навігація](phases/04-navigation-browser.md)
- [05 — API](phases/05-api-integration.md)
- [06 — Перевірка](phases/06-verification.md)

## Задачі

| ID     | Відповідальність                  | Depends                                | Статус  | File                                  |
| ------ | --------------------------------- | -------------------------------------- | ------- | ------------------------------------- |
| EN-001 | Create/detail/delete API contract | none                                   | blocked | [EN-001](EN-001-crud-contracts.md)    |
| TS-001 | CRUD data-access/state            | EN-001                                 | blocked | [TS-001](TS-001-crud-data.md)         |
| TS-002 | Grid context menu/locale          | products/003 TS-001; TS-001 for delete | blocked | [TS-002](TS-002-list-context-menu.md) |
| TS-003 | Read-only detail page             | TS-001                                 | blocked | [TS-003](TS-003-detail-page.md)       |
| TS-004 | Shared create/edit page           | TS-001                                 | blocked | [TS-004](TS-004-editor-page.md)       |
| TS-005 | E2E/regression                    | TS-002–TS-004                          | blocked | [TS-005](TS-005-verification.md)      |
