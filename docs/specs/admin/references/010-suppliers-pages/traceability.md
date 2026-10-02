# Постачальники — трасування

| SC     | R            | Tasks                       | Level                 | Test target / evidence                                     | Status             |
| ------ | ------------ | --------------------------- | --------------------- | ---------------------------------------------------------- | ------------------ |
| SC-001 | R-001, R-002 | TS-002                      | component             | `suppliers-page.component.test.tsx`; TS-002 evidence       | verified           |
| SC-002 | R-003        | products/003 TS-001, TS-002 | unit/component        | `brevi-theme.unit.test.ts`; local empty overlay; TS-002    | verified           |
| SC-003 | R-004, R-005 | EN-001, TS-001, TS-003      | integration/component | EN-001 and TS-001 blocker evidence                         | blocked            |
| SC-004 | R-006, R-007 | EN-001, TS-001, TS-004      | component             | EN-001 and TS-001 blocker evidence                         | blocked            |
| SC-005 | R-004, R-006 | TS-001, TS-004              | integration/component | generated GET-by-ID operation absent                       | blocked            |
| SC-006 | R-001        | TS-002, TS-005              | component/E2E         | component delete confirmation passed; journey waits TS-005 | partially verified |
| SC-007 | R-007, R-008 | TS-003–TS-005               | component/E2E         | detail/editor routes unavailable                           | blocked            |
