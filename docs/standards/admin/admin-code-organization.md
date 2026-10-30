# Admin Code Organization Rules

## Libraries and dependencies

- Place domain code in `libs/admin/<domain>/{model,data-access,ui,feature}`. Do not create empty libraries in advance, but once a responsibility exists, give it its layer: domain types and invariants in `model`, transport and cache in `data-access`, reusable domain presentation in `ui`, and orchestration in `feature`.
- `model` contains pure TypeScript types, constants, queries, defaults, and invariants; it does not depend on React, HTTP, the router, or browser APIs.
- `data-access` owns endpoints, private DTO adapters, runtime validation, mappers, and RTK Query hooks; it contains no JSX, router, or feature-local state.
- `ui` contains presentational components, forms, tables, dialogs, and feedback states; it does not call APIs or import the router.
- `feature` orchestrates routes, pages, hooks, and local UI state; it passes domain data and callbacks to `ui`.
- Between libraries, import only through aliases and the public `src/index.ts`; deep imports and aliases directly to internal files are prohibited. An additional entry point is allowed only as a separate documented public contract with its own boundary check, not as a way around the root `index.ts`.
- Public APIs export only consumer contracts. Do not export transport helpers, private DTO adapters, response parsers, or internal mappers.
- Nx tags and `depConstraints` must enforce the same dependency direction as the documentation. A layer is not considered established until lint actually allows valid dependencies and blocks reverse dependencies.

## Role folders

Inside `src/`, group files by role first and use only the names below, so every domain reads the same way. A new role name needs a recorded decision in this file before use.

| Library       | Role folders                                                                                                                                                                                                                                                                                                                                         |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `data-access` | `api/` endpoints and hooks · `contracts/` private adapters over generated DTOs · `validators/` runtime response and request validation · `mappers/` validated DTO <-> domain · `models/` technical request/cache types · `cache/` optimistic updates and cache patches · `errors/` API error -> domain error · `testing/` fixtures and request mocks |
| `model`       | `entities/` domain types with their constants · `queries/` query parameters, defaults, invariants · `mappers/` pure domain transformations · `validators/` pure domain and form rules · `forms/` form values, defaults, form <-> domain mapping                                                                                                      |
| `ui`          | `components/` · `tables/` (with `cells/`, `toolbar/`) · `forms/` · `dialogs/` · `details/` · `feedback/` loading, empty, error, and notice states · `hooks/` presentation-only hooks                                                                                                                                                                 |
| `feature`     | `<domain>.routes.tsx` · `pages/` · `components/` · `dialogs/` feature-only dialogs · `hooks/` orchestration · `state/` reducers and URL or persisted client state · `model/` feature-local pure logic such as URL params and view models · `errors/` user-facing messages · `testing/`                                                               |
| `shared/ui`   | Component-library categories: `layout/`, `feedback/`, `inputs/`, `data-display/`, `navigation/`; a cross-domain concept used by two or more domains (for example `slug/`) may have its own folder                                                                                                                                                    |

## Nesting and size

- Create a role folder when the role exists, even for one file.
- Inside a role folder, add a capability subfolder (`components/quote-editor/`, `hooks/sewing-pricing/`) when it would hold two or more files or when the folder mixes independent flows. The order is always role first, then capability; never `src/<capability>/<role>/` or a capability folder directly under `src/`.
- A large component with its own subcomponents gets its own folder inside `components/`.
- A role or capability folder with eight or more production files is a required signal to record a `split/keep` decision in the code audit.
- Keep each test next to its production file at the same level.

```text
libs/admin/<domain>/feature/src/
├── <domain>.routes.tsx
├── pages/
│   ├── <capability-a>/
│   │   ├── <page>.tsx
│   │   └── <page>.spec.tsx
│   └── <capability-b>/
├── components/
│   └── <capability-a>/
├── hooks/
│   └── <capability-a>/
├── model/
├── state/
└── index.ts
```

## Forbidden names and where the code goes

Do not create catch-all folders or files named `utils`, `helpers`, `common`, `misc`, `shared` (inside a domain), `types`, or `constants`.

| Code                                          | Place                                                                                  |
| --------------------------------------------- | -------------------------------------------------------------------------------------- |
| Status lists, limits, enums                   | `model/src/entities/` next to the type they describe                                   |
| Pure calculation or formatting for one domain | `model/src/mappers/` or `model/src/queries/`                                           |
| Form validation rules                         | `model/src/validators/`                                                                |
| API response validation                       | `data-access/src/validators/`; mappers receive already validated data                  |
| Types                                         | Next to their owner: `entities/`, `contracts/`, `models/`, or the component file       |
| Pure helpers used by two or more domains      | `libs/admin/shared/util` (an Nx `util` library), only after the second consumer exists |

## State

- Server data, loading, and API errors belong to RTK Query; do not duplicate them in a reducer.
- Keep simple feature-local state in component state; create a reducer only for related transitions or shared feature state.
- Do not perform HTTP requests or hide business rules in JSX.

## Pages, routes, and links

- A page is an orchestrator; separate toolbars, tables, complex cells, and feature-only dialogs when they have independent responsibilities.
- Reusable dialogs and forms belong in `ui` and receive values, errors, and callbacks through props.
- `ui` and `shared/ui` never import the router. Links use `href` (or a path passed as a prop); the application registers one router-aware link component in the MUI theme (`MuiLink` `component` and `MuiButtonBase` `LinkComponent`). Navigation after an action is a callback from `feature`.
- Do not change routes, guards, the global store, or theme without explicit feature scope.

## Known deviations

Existing code that does not follow these rules yet. Fix an entry when the code is next changed or in a separate remediation task; do not copy these layouts into new code.

| Path under `libs/admin/`                                                                                                                                                                                                                                                                 | Deviation                                 | Target                                                                                                 |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `products/model/src/{ordering,product-category,product-detail,product-editor,product-list,product-media,sewing}/`                                                                                                                                                                        | Capability folders directly under `src/`  | Role folders (`entities/`, `queries/`, `mappers/`, `validators/`, `forms/`) with capability subfolders |
| `products/ui/src/{media,product-content,product-detail,product-editor,product-list}/`                                                                                                                                                                                                    | Capability folders directly under `src/`  | `components/`, `forms/`, `details/` with capability subfolders                                         |
| `clients/feature/src/{mappers,models}/`                                                                                                                                                                                                                                                  | Not feature roles                         | `model/`                                                                                               |
| `clients/model/src/models/`                                                                                                                                                                                                                                                              | Not a model role                          | `entities/` or `queries/`                                                                              |
| `products/data-access/src/test-fixtures/`                                                                                                                                                                                                                                                | Name differs from `testing/`              | `testing/`                                                                                             |
| `references/data-access/src/api/**`                                                                                                                                                                                                                                                      | Response validation inside endpoint files | `validators/`                                                                                          |
| `clients/data-access/src/mappers/quotes/` (13), `clients/model/src/entities/quotes/` (10), `products/model/src/entities/sewing-composition/` (9), `clients/data-access/src/api/quotes/` (8), `products/ui/src/product-detail/` (8), `products/feature/src/hooks/sewing-composition/` (8) | Eight or more production files            | `split/keep` decision in the next code audit                                                           |
