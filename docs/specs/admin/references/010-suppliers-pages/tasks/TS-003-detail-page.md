# TS-003 — Supplier detail page

- **ID задачі:** TS-003
- **Охоплює:** SC-003, SC-007
- **Залежить від:** TS-001
- **Точні шляхи:** proposed supplier detail page/components, router/tests
- **Рівень тестування:** component/integration
- **Статус:** blocked by TS-001 / EN-001

## Робота

- [ ] Create read-only page with loading/error/not-found/retry and back/edit links.
- [ ] Group fields into white semantic Card/Paper.
- [ ] Preserve safe http(s) link behavior.
- [ ] Register direct route and audit responsibilities.

## Свідчення

- Red: supplier view only exists in Dialog.
- Green: detail/router/safe-link tests.
- Regression: feature/app route suites.

## Контрольна точка

Supplier detail survives reload and has no editable fields.
