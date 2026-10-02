# Додаткові довідники — трасування

| SC     | R                   | Tasks                          | Level                 | Test target                 | Status                  |
| ------ | ------------------- | ------------------------------ | --------------------- | --------------------------- | ----------------------- |
| SC-001 | R-001, R-002        | TS-002                         | component             | page/grid menu              | blocked by TS-001       |
| SC-002 | R-003               | products/003 TS-001, TS-002    | unit/component        | theme locale, grid controls | locale dependency ready |
| SC-003 | R-004, R-005, R-008 | EN-001, TS-001, TS-003         | integration/component | API/detail                  | blocked by EN-001       |
| SC-004 | R-006–R-008         | EN-001, TS-001, TS-004         | component             | editor modes                | blocked by EN-001       |
| SC-005 | R-004, R-006, R-008 | EN-001, TS-001, TS-004         | integration/component | API/editor errors           | blocked by EN-001       |
| SC-006 | R-001, R-008        | EN-001, TS-001, TS-002, TS-005 | integration/E2E       | delete confirm              | blocked by EN-001       |
| SC-007 | R-007, R-009        | TS-003–TS-005                  | component/E2E         | viewport/theme              | blocked by EN-001       |

## Поточні свідчення — 2026-10-01

- EN-001: pinned snapshot і backend HEAD
  `5d97cc098ade99068d1da70ccc0f6562ec852f2c` не містять three required
  operationId; див. `tasks/EN-001-crud-contracts.md`.
- Shared locale dependency: `npx nx test admin-react --
src/app/theme/brevi-theme.unit.test.ts
src/app/router/app-router.integration.test.tsx` — 14/14 passed.
- Current update-only regression: data-access/feature tests passed; focused
  Playwright `additional-references.spec.ts` — 2/2 passed.
- Contract provenance: `npm run contracts:check` — passed; snapshot/generated
  types match pinned provenance.
