# Admin: Products

**Status:** routes and pages implemented, checked 2026-10-16.

`/references/products` shows a list with search, sorting, pagination, and
deletion; `/create`, `/:id`, and `/:id/edit` open create, detail, and edit
pages. `products/feature` owns scenarios, local state, and loading/error/empty
handling; `products/ui` provides presentation; `products/model` provides domain
models; and `products/data-access` provides API endpoints, mappers, and
response validation. The route file lazy-loads pages; `AppRouter` imports only
`productsRoutes`.

Saved Sewing Products also expose the [Article and composition editor](sewing-composition.md) through a separate API/draft boundary. Base Product saves preserve the new records; PPE pricing uses its separate versioned input workflow.

[Article pricing](sewing-pricing.md) adds explicit calculation/publication beside the selected Article. Product cards/lists display published Sewing wholesale prices through one bounded page projection, with loading/error/unpublished states and no legacy price fallback. PPE uses only its current versioned pricing endpoint.

## Structure diagram

```mermaid
flowchart LR
  Router["AppRouter"] --> Routes["productsRoutes: lazy pages"]
  Routes --> Feature["products/feature: list, detail, editor"]
  Feature --> UI["products/ui: presentation"]
  Feature --> Model["products/model: types"]
  Feature --> Data["products/data-access: API and mappers"]
```

## Code structure

```text
libs/admin/products/
├── data-access/src/
│   ├── api/
│   │   └── products.api.ts # API
│   └── mappers/
│       └── product.mapper.ts # mapper
├── feature/src/
│   ├── components/product-editor/
│   │   └── product-editor.tsx # editor
│   ├── pages/
│   │   ├── product-detail/
│   │   │   └── product-detail-page.tsx # details
│   │   ├── product-editor/
│   │   │   └── product-create-page.tsx # creation
│   │   └── product-list/
│   │       └── products-page.tsx # list page
│   └── products.routes.tsx # routes
├── model/src/product-editor/
│   └── product-draft.ts # draft
└── ui/src/product-editor/core/
    └── product-base-fields.tsx # form fields
```

**Where to look:** [routes](../../../../libs/admin/products/feature/src/products.routes.tsx), [list page](../../../../libs/admin/products/feature/src/pages/product-list/products-page.tsx), [editor](../../../../libs/admin/products/feature/src/components/product-editor/product-editor.tsx), [API](../../../../libs/admin/products/data-access/src/api/products.api.ts), [product specifications](../../../specs/admin/products/README.md).

[PPE three-tier pricing and input approval](ppe-pricing.md) supplies current prices for enrolled PPE Products; non-enrolled Products show explicit onboarding/blocker states.

## Tests

- `libs/admin/products/feature/src/`: `pages/product-list/`, `pages/product-detail/`, `components/product-editor/`, `hooks/product-detail/`
- `libs/admin/products/data-access/src/products.api.integration.test.ts`
- `libs/admin/products/model/src/`: `product-editor/`, `ordering/`, `sewing/product-fabrics.test.ts`
- `libs/admin/products/ui/src/`: `product-detail/`, `product-editor/`, `product-content/`
- E2E (run only on request): `apps/admin-react-e2e/src/products.spec.ts`

Focused run: `npx nx test admin-products-feature -- product-list product-detail product-editor`; `npx nx test admin-products-data-access -- products.api`; `npx nx test admin-products-model -- product-editor ordering product-fabrics`; `npx nx test admin-products-ui -- product-detail product-editor product-content`.
