# TS-004 — Additional reference create/edit page

- **ID задачі:** TS-004
- **Охоплює:** SC-004, SC-005, SC-007
- **Залежить від:** TS-001
- **Точні шляхи:** current editor/validation, proposed form/page/router/tests
- **Рівень тестування:** component/unit
- **Статус:** blocked — TS-001 не завершено

## Робота

- [ ] Replace edit Dialog and add create route with one shared form structure.
- [ ] Empty/unselected create, filled edit and contract-driven ID behavior.
- [ ] Put all fields into logical white responsive Card/Paper groups.
- [ ] Preserve validation, field/server errors, write lock, entered data and cancel.
- [ ] Audit form/page/hook responsibilities.

## Свідчення

- Red: create absent and edit is dialog.
- Green: common mode tests based on generated contracts.
- Regression: validation/feature/data-access suites.

## Контрольна точка

Create/edit have separate URLs and one nonduplicated form.
