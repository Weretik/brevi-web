# Admin: Products

**Status:** routes and pages implemented, checked 2026-10-16.

`/references/products` shows a list with search, sorting, pagination, and
deletion; `/create`, `/:id`, and `/:id/edit` open create, detail, and edit
pages. `products/feature` owns scenarios, local state, and loading/error/empty
handling; `products/ui` provides presentation; `products/model` provides domain
models; and `products/data-access` provides API endpoints, mappers, and
response validation. The route file lazy-loads pages; `AppRouter` imports only
`productsRoutes`.

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
