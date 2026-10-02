# Постачальники — проєктування frontend

## Наявний контекст

- `suppliers-page.tsx` поєднує list state, dialog mode, selection, bulk/row
  delete, alerts і create action.
- `suppliers-grid.tsx` містить action column із трьома buttons і partial locale.
- `supplier-dialog.tsx` реалізує create/view/edit, safe URL parsing і layout;
  `use-supplier-editor.ts` володіє draft/save, validation окрема в `model/`.
- `libs/admin/references/data-access/src/suppliers/` має list/create/update/delete
  та runtime mapper, але не GET by ID.
- Router має лише `/references/supplier`; E2E suppliers file окремо відсутній,
  тому critical journey можна додати до нового `suppliers.spec.ts`.
- Nx targets доступні для reference feature/data-access, app та E2E.

## Відповідальності

| Область    | Власник                                                                                             |
| ---------- | --------------------------------------------------------------------------------------------------- |
| Data       | Supplier GET-by-ID у domain data-access; existing mapper/model/writes reuse.                        |
| State      | List hook лишається для table; route editor/detail hook читає ID; page більше не має active dialog. |
| UI         | Grid row MUI Menu; окремі detail/editor pages; safe link helper лишається pure і тестованим.        |
| Navigation | Три child routes, direct reload і back target до supplier list.                                     |
| Locale     | Shared products/003 TS-001; local empty message без full locale duplication.                        |
| Tests      | Mapper/API integration, validation/helper unit, menu/editor/detail component, router/E2E.           |

## Початковий аудит

| Файл                  | Поточні ролі                         | Рішення                                                                      | Ціль                               |
| --------------------- | ------------------------------------ | ---------------------------------------------------------------------------- | ---------------------------------- |
| `suppliers-page.tsx`  | list, dialogs, delete, notifications | лишити list orchestration; active state замінити navigation                  | page/grid routes                   |
| `suppliers-grid.tsx`  | columns, actions, grid               | remove actions column, MUI menu composition                                  | grid/local menu                    |
| `supplier-dialog.tsx` | 3 modes, fields, safe link           | presentation split detail/form; pure link helper винести лише для reuse/test | proposed detail/editor/form/helper |
| editor/deletion hooks | drafts/writes and delete state       | reuse; route lifecycle не переносити в component                             | hooks                              |
| supplier API          | list/writes                          | add generated detail read after EN-001                                       | domain data-access                 |

## Референси й ризики

- Local: `detail-customer-payments.png`, `detail-section-cards.png`,
  `create-customer-account.png`, `create-customer-additional-actions.png`.
- Official: [context Menu](https://mui.com/material-ui/react-menu/#context-menu),
  [Data Grid row slot](https://mui.com/x/react-data-grid/components/#row),
  [localization](https://mui.com/x/react-data-grid/localization/),
  [Card](https://mui.com/material-ui/react-card/),
  [responsive Grid](https://mui.com/system/react-grid/).
- GET-by-ID блокує reliable direct route. Link must allow only http(s) and use
  `noopener noreferrer`; invalid value shows text, not clickable URI.
