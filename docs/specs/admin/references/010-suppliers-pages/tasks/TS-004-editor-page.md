# TS-004 — Supplier create/edit page

- **ID задачі:** TS-004
- **Охоплює:** SC-004, SC-005, SC-007
- **Залежить від:** TS-001
- **Точні шляхи:** current editor/validation, proposed editor/form, router/tests
- **Рівень тестування:** component/unit
- **Статус:** blocked by TS-001 / EN-001

## Робота

- [ ] Replace create/edit dialog with routes and one shared form structure.
- [ ] Empty create, filled edit, distinct primary labels, existing validation/write lock.
- [ ] Put all fields in logical white responsive Card/Paper groups.
- [ ] Preserve cancel, field/server errors and entered data.
- [ ] Audit responsibilities.

## Свідчення

- Red: forms have no routes/surfaces.
- Green: shared mode tests and validation tests.
- Regression: feature/data-access suites.

## Контрольна точка

Create/edit use one supplier form and separate URLs.
