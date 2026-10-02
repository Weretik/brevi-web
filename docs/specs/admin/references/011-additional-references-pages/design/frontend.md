# Додаткові довідники — проєктування frontend

## Наявний контекст

- `additional-references-page.tsx` поєднує list, active edit dialog і saved alert.
- `additional-references-grid.tsx` має одну action button «Редагувати», без
  selection; localeText задає лише noRowsLabel.
- `additional-reference-dialog.tsx` має edit-only form; editor hook і
  validation уже відокремлені.
- Data-access має лише `getAdditionalReferences` і
  `updateAdditionalReference`; create/delete/detail transport відсутній.
- Router має лише list route; E2E `additional-references.spec.ts` покриває
  чинний update flow.
- Nx targets доступні в reference feature/data-access, app і E2E.

## Відповідальності

| Область       | Власник                                                                                                        |
| ------------- | -------------------------------------------------------------------------------------------------------------- |
| Contract/data | EN-001 визначає create/detail/delete. Data-access generated operations, runtime mapping й error normalization. |
| State         | List hook володіє list/reload; route hooks — detail/create/edit/delete state; page не зберігає active dialog.  |
| UI            | Grid MUI Menu; read-only detail; одна shared form; delete confirmation із готових MUI primitives.              |
| Navigation    | Три child routes й back link до list.                                                                          |
| Locale        | Shared products/003 TS-001; feature-specific empty text лишається local.                                       |
| Tests         | Validation unit, API integration, menu/detail/editor component, router й E2E CRUD journey.                     |

## Початковий аудит

| Файл          | Поточні ролі            | Рішення                                          | Ціль            |
| ------------- | ----------------------- | ------------------------------------------------ | --------------- |
| page          | list/dialog/saved alert | list orchestration + navigation/notifications    | page/routes     |
| grid          | columns/edit action     | remove action column; MUI row menu               | grid/local menu |
| dialog/editor | edit fields/write       | turn into shared form page after create contract | page/form/hook  |
| validation    | update form rules       | reuse; extend only from exact create schema      | model tests     |
| data-access   | list/update             | add detail/create/delete after EN-001            | domain files    |

## Референси й ризики

- Local: `detail-invoice.png`, `detail-section-cards.png`,
  `create-billing-shipping-form.png`, `create-customer-additional-actions.png`.
- Official: [context Menu](https://mui.com/material-ui/react-menu/#context-menu),
  [Data Grid row slot](https://mui.com/x/react-data-grid/components/#row),
  [localization](https://mui.com/x/react-data-grid/localization/),
  [Card](https://mui.com/material-ui/react-card/),
  [responsive Grid](https://mui.com/system/react-grid/).
- ID policy, create response/status, delete status/conflict й detail response
  невідомі; вони не можуть бути виведені з update contract.
