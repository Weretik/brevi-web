# Suppliers — Frontend Design

## Existing context

- `suppliers-page.tsx` combines list state, dialog mode, selection, bulk/row deletion, alerts, and the create action.
- `suppliers-grid.tsx` contains an action column with three buttons and partial localization.
- `supplier-dialog.tsx` implements create/view/edit, safe URL parsing, and layout; `use-supplier-editor.ts` owns draft/save behavior, with validation separate in `model/`.
- `libs/admin/references/data-access/src/suppliers/` has list/create/update/delete operations and a runtime mapper, but no GET by ID.
- The router has only `/references/supplier`; there is no separate E2E suppliers file, so a critical journey can be added to a new `suppliers.spec.ts`.
- Nx targets are available for the reference feature/data-access, app, and E2E.

## Responsibilities

| Area       | Owner                                                                                                            |
| ---------- | ---------------------------------------------------------------------------------------------------------------- |
| Data       | Supplier GET-by-ID in domain data-access; reuse the existing mapper/model/write operations.                      |
| State      | Keep the list hook for the table; a route editor/detail hook fetches by ID; remove active dialogs from the page. |
| UI         | MUI Menu on grid rows; separate detail/editor pages; keep the safe-link helper pure and testable.                |
| Navigation | Three child routes, direct reload, and a back target to the supplier list.                                       |
| Locale     | Shared products/003 TS-001; local empty message without duplicating the full locale.                             |
| Tests      | Mapper/API integration, validation/helper unit, menu/editor/detail component, router/E2E.                        |

## Initial audit

| File                  | Current roles                        | Decision                                                                     | Target                             |
| --------------------- | ------------------------------------ | ---------------------------------------------------------------------------- | ---------------------------------- |
| `suppliers-page.tsx`  | list, dialogs, delete, notifications | keep list orchestration; replace active state with navigation                | page/grid routes                   |
| `suppliers-grid.tsx`  | columns, actions, grid               | remove actions column; compose MUI menu                                      | grid/local menu                    |
| `supplier-dialog.tsx` | 3 modes, fields, safe link           | split detail/form presentation; extract pure link helper only for reuse/test | proposed detail/editor/form/helper |
| editor/deletion hooks | drafts/writes and delete state       | reuse; do not move route lifecycle into the component                        | hooks                              |
| supplier API          | list/writes                          | add generated detail read after EN-001                                       | domain data-access                 |

## References and risks

- Local: `detail-customer-payments.png`, `detail-section-cards.png`,
  `create-customer-account.png`, `create-customer-additional-actions.png`.
- Official: [context Menu](https://mui.com/material-ui/react-menu/#context-menu),
  [Data Grid row slot](https://mui.com/x/react-data-grid/components/#row),
  [localization](https://mui.com/x/react-data-grid/localization/),
  [Card](https://mui.com/material-ui/react-card/),
  [responsive Grid](https://mui.com/system/react-grid/).
- GET-by-ID blocks reliable direct routes. Links must allow only http(s) and use
  `noopener noreferrer`; invalid values appear as text, not clickable URIs.
