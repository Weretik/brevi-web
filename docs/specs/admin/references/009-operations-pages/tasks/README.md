# Операції — граф задач

## Фази планування

- [00 — Готовність](phases/00-readiness.md)
- [02 — Стан і дані](phases/02-state-data.md)
- [03 — React Web UI](phases/03-react-web-ui.md)
- [04 — Навігація](phases/04-navigation-browser.md)
- [05 — API](phases/05-api-integration.md)
- [06 — Перевірка](phases/06-verification.md)

## Задачі

| ID     | Відповідальність       | Залежить від        | Статус     | Файл                                  |
| ------ | ---------------------- | ------------------- | ---------- | ------------------------------------- |
| EN-001 | GET-by-ID contracts    | немає               | deferred   | [EN-001](EN-001-detail-contracts.md)  |
| TS-001 | Detail data-access     | EN-001              | superseded | [TS-001](TS-001-detail-data.md)       |
| TS-002 | URL tabs і row menus   | products/003 TS-001 | completed  | [TS-002](TS-002-list-context-menu.md) |
| TS-003 | Read-only detail pages | TS-001              | superseded | [TS-003](TS-003-detail-pages.md)      |
| TS-004 | Create/edit pages      | TS-001              | superseded | [TS-004](TS-004-editor-pages.md)      |
| TS-005 | E2E/regression         | TS-002, TS-006      | completed  | [TS-005](TS-005-verification.md)      |
| TS-006 | MUI Drawer workflow    | TS-002              | completed  | [TS-006](TS-006-drawer-workflow.md)   |
