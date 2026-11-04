# Admin «Швейний цех», stage 1: workers, fabric norms, payroll rules

**Status:** implemented 2026-11-04. Backend: BreviERP PRD-001 (`docs/sdd/specs/production/001-workshop-references`). Part of the port of the client's separate «Цех» app into Brevi; later stages (orders from КП, stock, work log, payroll) get their own SDD.

## Scenarios

| ID     | Scenario                                                                                                                                                                                                                                                                       |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| PRD-W1 | The head of the workshop (role `WorkshopChief`), Admin and the director see the three new items of «Швейний цех»; other roles do not, and the URLs show «Немає доступу».                                                                                                       |
| PRD-W2 | «Працівники цеху»: search, chips «Працюють» / «Архів» and positions, add and edit in the side panel, «В архів» / «Повернути в цех» with confirmation (no delete).                                                                                                              |
| PRD-W3 | «Норми витрати тканини»: every sewing model of «Товари» with its norm in metres; chips «Усі», «З нормою», «Без норми», «Проблеми» (only when there are some); a norm whose model is gone gets a red mark with the reason. Edit in the side panel with the sum of a split norm. |
| PRD-W4 | Import on both lists: choose the transfer JSON, the server checks it (preview), «Зберегти» only when no row has an error.                                                                                                                                                      |
| PRD-W5 | «Правила зарплати»: read-only coefficients from «Параметри ціноутворення» with a link there; only a missing or empty value is marked.                                                                                                                                          |
| PRD-W6 | «Користувачі» can give the role «Начальник цеху».                                                                                                                                                                                                                              |

## Decisions

- Workers do not sign in; the list is data, not accounts.
- Payroll coefficients are not copied into the workshop: one value builds the price and the pay.
- No «all OK» marks: only problems are shown.
- Reuses the «Цех» reference controls from `@admin/references/ui`; `ReferenceDataGrid` gained `selectable` and `deleteLabel` for lists without bulk actions and with archive instead of delete.
