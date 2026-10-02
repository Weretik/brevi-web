# TS-005 — Additional references verification

- **ID задачі:** TS-005
- **Охоплює:** SC-001–SC-007
- **Залежить від:** TS-002, TS-003, TS-004
- **Точні шляхи:** affected tests,
  `apps/admin-react-e2e/src/additional-references.spec.ts`, audit/checklists
- **Рівень тестування:** E2E/verification
- **Статус:** blocked — TS-002–TS-004 не завершено

## Робота

- [ ] Cover create → detail → edit → detail and delete confirm journeys.
- [ ] Verify direct reload, locale, keyboard, themes, 320/768/1280 px.
- [ ] Finish audit/traceability/delivery checklist.
- [ ] Run contracts check, affected lint/typecheck/test/E2E/build and repeat after splits.

## Свідчення

- Record Red/Green/Refactor/Regression during implementation.

## Контрольна точка

All scenarios have evidence and no create/view/edit dialog remains.
