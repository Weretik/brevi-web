# TS-005 — Supplier verification

- **ID задачі:** TS-005
- **Охоплює:** SC-001–SC-007
- **Залежить від:** TS-002, TS-003, TS-004
- **Точні шляхи:** supplier tests, proposed `apps/admin-react-e2e/src/suppliers.spec.ts`, audit
- **Рівень тестування:** E2E/verification
- **Статус:** blocked by TS-003 and TS-004

## Робота

- [ ] Cover list → detail → edit → save and delete confirm critical journey.
- [ ] Verify direct reload, locale, keyboard, themes and 320/768/1280 px.
- [ ] Finish audit/traceability/checklist.
- [ ] Run contracts check, affected lint/typecheck/test/E2E/build and repeat after splits.

## Свідчення

- Record Red/Green/Refactor/Regression during implementation.

## Контрольна точка

All supplier scenarios have evidence and no dialog-based view/edit remains.
