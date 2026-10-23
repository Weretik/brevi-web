# Additional References — Frontend Design

## Existing Context

- `additional-references-page.tsx` combines the list, active edit dialog, and saved alert.
- `additional-references-grid.tsx` has a single “Редагувати” action button and no selection; localeText sets only noRowsLabel.
- `additional-reference-dialog.tsx` has an edit-only form; the editor hook and validation are already separated.
- Data access has only `getAdditionalReferences` and `updateAdditionalReference`; create/delete/detail transport is absent.
- The router has only the list route; E2E `additional-references.spec.ts` covers the current update flow.
- Nx targets are available in the reference feature/data-access, app, and E2E projects.

## Responsibilities

| Area          | Owner                                                                                                                      |
| ------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Contract/data | EN-001 defines create/detail/delete. Data access handles generated operations, runtime mapping, and error normalization.   |
| State         | The list hook owns list/reload; route hooks own detail/create/edit/delete state; the page does not store an active dialog. |
| UI            | MUI Menu in the grid; read-only detail; one shared form; delete confirmation using existing MUI primitives.                |
| Navigation    | Three child routes and a back link to the list.                                                                            |
| Locale        | Shared products/003 TS-001; feature-specific empty text remains local.                                                     |
| Tests         | Validation unit, API integration, menu/detail/editor component, router, and E2E CRUD journey.                              |

## Initial Audit

| File          | Current roles           | Decision                                         | Target          |
| ------------- | ----------------------- | ------------------------------------------------ | --------------- |
| page          | list/dialog/saved alert | list orchestration + navigation/notifications    | page/routes     |
| grid          | columns/edit action     | remove action column; MUI row menu               | grid/local menu |
| dialog/editor | edit fields/write       | turn into shared form page after create contract | page/form/hook  |
| validation    | update form rules       | reuse; extend only from exact create schema      | model tests     |
| data-access   | list/update             | add detail/create/delete after EN-001            | domain files    |

## References and Risks

- Local: `detail-invoice.png`, `detail-section-cards.png`,
  `create-billing-shipping-form.png`, `create-customer-additional-actions.png`.
- Official: [context Menu](https://mui.com/material-ui/react-menu/#context-menu),
  [Data Grid row slot](https://mui.com/x/react-data-grid/components/#row),
  [localization](https://mui.com/x/react-data-grid/localization/),
  [Card](https://mui.com/material-ui/react-card/),
  [responsive Grid](https://mui.com/system/react-grid/).
- The ID policy, create response/status, delete status/conflict, and detail response
  are unknown; they cannot be inferred from the update contract.
