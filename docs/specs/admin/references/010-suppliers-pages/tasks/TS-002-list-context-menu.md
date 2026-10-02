# TS-002 — Supplier list context menu

- **ID задачі:** TS-002
- **Охоплює:** SC-001, SC-002, SC-006
- **Залежить від:** `products/003-products-table-pages/TS-001`
- **Точні шляхи:** suppliers page/grid/delete dialog/tests
- **Рівень тестування:** component
- **Статус:** completed for SC-001, SC-002, SC-006; route handoff waits for
  TS-003/TS-004 landing pages

## Робота

- [x] Remove action column; add mouse/keyboard MUI Menu for the correct row.
- [x] Preserve selection, bulk delete, confirmation, focus and close behavior.
- [x] Inherit central ukUA and retain domain empty text.
- [x] Audit page/grid responsibilities.

View/edit continue opening the existing working dialogs until TS-003/TS-004
provide valid landing routes. Wiring them to missing routes would turn both
actions into a not-found regression while EN-001 is blocked.

## Свідчення

- Test: `src/pages/suppliers/suppliers-page.component.test.tsx`.
- Red: `npx nx test admin-references-feature -- suppliers-page.component.test.tsx`
  — 5/8 failed because the action column remained and mouse/keyboard menu was absent.
- Green: the same command — 8/8 passed after the shared MUI menu/hook integration.
- Refactor: reused `ReferenceRowContextMenu` and
  `useReferenceRowContextMenu`; supplier domain empty overlay remains local.
- Regression: `npx nx test admin-references-feature` — 8 files, 34 tests passed.
- Locale evidence: `npx nx test admin-react -- brevi-theme.unit.test.ts` —
  1 file, 4 tests passed for shared Material/Data Grid `ukUA`.
- Static/build: feature lint, library/test typecheck and `npx nx build admin-react`
  passed; build retained the existing chunk-size warning.

## Контрольна точка

Every row exposes correct accessible actions without an actions column.
