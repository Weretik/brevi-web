# Products — frontend design

## Existing context

- Routes: `apps/admin-react/src/app/router/app-router.tsx`.
- List: `libs/admin/products/feature/src/pages/product-list/products-page.tsx`;
  currently combines query state, columns, filters, Data Grid, and delete
  target, and has a “Дії” column.
- Detail: `product-detail-page.tsx`, `product-detail-header.tsx`,
  `product-detail-content.tsx`, type-specific detail, and gallery; Divider
  currently separates most data, without white semantic surfaces.
- Create/edit: `product-create-page.tsx`, `product-edit-page.tsx`, and shared
  `product-editor.tsx`; structure is already shared, but fields sit on the page
  background between Dividers and the primary button has identical text.
- Data: `libs/admin/products/data-access/src/`, `use-products.ts`,
  `use-product.ts`, `use-product-lookups.ts`; a separate GET by ID exists.
- Locale and theme: `apps/admin-react/src/app/theme/brevi-theme.ts`; each table
  currently sets only `noRowsLabel` locally, leaving other MUI labels English.
- Tooling: `admin-products-feature` and `admin-products-data-access` have
  `lint`, `typecheck`, and `test`; feature also has `typecheck-tests`.
  `admin-react` has `lint`, `typecheck`, `typecheck-tests`, `test`, and `build`;
  `admin-react-e2e` has `lint`, `typecheck`, and `e2e`.

## Responsibilities within scope

| Area            | Responsibility and exact paths                                                                                                           |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Shared behavior | Central Ukrainian MUI/MUI X locale in `apps/admin-react/src/app/theme/`; extends official `ukUA` only for missing active keys.           |
| State and data  | Existing hooks retain query, abort, retry, and detail fetch; the context menu stores only the current row ID and coordinates.            |
| React Web       | `products-page.tsx` or small local filter/menu components; detail/editor compose MUI Card/Paper by domain group.                         |
| Navigation      | Four existing routes remain; the menu goes to detail/edit, and the detail button goes to edit.                                           |
| API             | Existing generated operations and runtime mapping without changing the transport contract.                                               |
| Verification    | Component tests for menu, locale, read-only view, and shared form; route integration tests; one Playwright list → detail → edit journey. |

## Initial responsibility audit

| File/component                  | Existing roles and dependencies                    | Decision                                                                 | Target boundaries                                                                                                         |
| ------------------------------- | -------------------------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| `pages/products-page.tsx`       | Query, toolbar, columns, navigation, delete dialog | Split only menu and filters if component tests or readability require it | `components/products-list-filters.tsx`, `components/product-row-context-menu.tsx`, or retain a small coherent composition |
| `components/product-editor.tsx` | Lookup loading, draft, save, and whole layout      | Retain orchestration; extract only a repeated section surface            | `components/product-form-section.tsx` only if actually reused                                                             |
| `pages/product-detail-page.tsx` | Fetch states, actions, all detail sections         | Retain orchestration; specialized detail components own Card/Paper       | Existing `product-*-detail.tsx`                                                                                           |
| `theme/brevi-theme.ts`          | Light/dark theme and component defaults            | Add core/data-grid `ukUA` and verified override without feature text     | Separate locale file in the same folder if the key set is substantial                                                     |

## UI decisions and references

- Detail uses `detail-customer-payments.png`,
  `detail-order-timeline.png` and `detail-section-cards.png`.
- Form uses `edit-product-layout.png`, `create-order-basic-billing.png`, and
  `create-order-line-items.png`. Example data is not copied.
- Official MUI patterns: [context Menu](https://mui.com/material-ui/react-menu/#context-menu),
  [Data Grid row slot](https://mui.com/x/react-data-grid/components/#row),
  [Data Grid localization](https://mui.com/x/react-data-grid/localization/),
  [Material UI localization](https://mui.com/material-ui/guides/localization/),
  [Card](https://mui.com/material-ui/react-card/), and
  [responsive Grid](https://mui.com/system/react-grid/).
- The installed Data Grid `ukUA` locale is incomplete, so acceptance requires
  checking every available menu and adding only missing Ukrainian keys through
  `localeText`/theme API.

## Risks

- Removing the actions column requires a keyboard equivalent; component and
  E2E evidence must verify focus and the correct row ID.
- White Card/Paper in the dark theme is an explicit feature requirement; text
  and field contrast must be checked separately without changing the global palette.
- The context menu must not intercept the Data Grid header menu or break
  checkbox selection.
