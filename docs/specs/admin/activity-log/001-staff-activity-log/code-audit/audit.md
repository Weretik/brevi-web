# «Журнал дій»: final frontend audit

**Date:** 2026-11-16. **Scope:** brevi-web #199:

- `libs/admin/activity-log/{model,data-access,feature}`.
- The app wiring: menu, route, `defaultAccess`.
- The synced contract.

The backend audit is in BreviERP, `docs/sdd/specs/activity-log/001-staff-activity-log/audit.md`.

## What was checked

| Area                | Evidence                                                                                                                                                                                                                                                     | Result |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------ |
| Boundaries          | Tags `scope:admin`, `domain:activity-log`, `type:model\|data-access\|feature`. ESLint `depConstraints` passes. Imports go only through public entry points. The one cross-domain import is `@admin/users/model` (`staffRoleLabels`), model → model, allowed. | OK     |
| Layers              | model: pure types, labels, URL ↔ query. data-access: RTK Query through the typed `openapi-fetch` client with runtime-checked mappers. feature: page, hook, components. The app holds composition only.                                                       | OK     |
| Folder shape        | `npm run architecture:structure`: no new deviations. No folder has more than 6 production files. The library roots hold only the entry and routes files.                                                                                                     | OK     |
| One responsibility  | The hook has 2 data hooks, 2 `useState` and 1 `useEffect`. Each component file holds one component. Pure logic (URL, labels, time) is in model.                                                                                                              | OK     |
| Rights              | Menu item `access: 'activity-log'`, route inside `RequirePageAccess`, `defaultAccess` gives Admin «Бачить» like `AccessCatalog`. The page has no write actions.                                                                                              | OK     |
| Repeated submits    | No mutations, so idempotency keys do not apply.                                                                                                                                                                                                              | N/A    |
| Design system «Цех» | `ReferencePageHeader`, the search row, `ReferenceFilterChip` chips, DataGrid with `--admin-table-height`, mono times, read-only `ReferenceEditorDrawer`, and theme paths only. There are no "all OK" badges.                                                 | OK     |
| States              | Loading in the grid. Empty text with and without filters. Error with «Повторити».                                                                                                                                                                            | OK     |
| Tests               | model 5, data-access 3, feature 6, admin-react 35. Each scenario SC-01 to SC-06 has a test.                                                                                                                                                                  | OK     |
| ADR                 | No new app, framework, hosting, state or transport approach, so no ADR is due.                                                                                                                                                                               | OK     |
| Feature card        | `docs/features/admin/activity-log.md`; its code and test paths exist.                                                                                                                                                                                        | OK     |

## Findings

| ID    | Severity | Status          | Where                                   | Finding                                                                                                                                            | Target change / verification                                                                                                                     |
| ----- | -------- | --------------- | --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| AF-01 | Medium   | Fixed, verified | `feature/src/pages/use-activity-log.ts` | A filter chosen during the 300 ms search pause was lost: the pause wrote the URL from the request of its own render.                               | The pause now reads the latest request through a ref. New test «keeps a filter chosen during the search pause»: red before the fix, green after. |
| AF-02 | Low      | Accepted        | `use-activity-log.ts`                   | Browser Back changes the URL search, but the typed text in the field keeps the old words.                                                          | Kept: rare, and the list follows the URL.                                                                                                        |
| AF-03 | Low      | Accepted        | `components/activity-filter-row.tsx`    | `ReferenceFilterRow` gets `count = total = 0` only for its layout, because the page shows no «Знайдено» counter (the grid footer shows the total). | Kept. If a counter is wanted, pass the server total.                                                                                             |

There are no blockers.
