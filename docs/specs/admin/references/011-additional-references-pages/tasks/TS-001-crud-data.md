# TS-001 — Additional reference CRUD data

- **ID задачі:** TS-001
- **Охоплює:** SC-003–SC-006
- **Залежить від:** EN-001
- **Точні шляхи:** additional-references data-access/hooks/model/tests
- **Рівень тестування:** focused integration/unit
- **Статус:** blocked — EN-001 не завершено

## Робота

- [ ] Add generated detail/create/delete transports and request/response mapping.
- [ ] Add runtime validation, abort, 404/conflict/error normalization and reload.
- [ ] Extend form validation only from agreed create schema; no local API assumptions.
- [ ] Audit domain/hook/model responsibilities.

## Свідчення

- Red: operations unavailable in generated contract.
- Green: success/error/invalid response tests for new operations.
- Regression: existing update/list tests and typecheck.

## Контрольна точка

Feature has typed, validated data owners for complete agreed CRUD.
