# Admin Domains and Feature Structure

## Target structure

```text
libs/admin/
├── core/{shell,auth,permissions}/
├── shared/{ui,api-client,contracts,config,util,testing}/
├── references/{feature,data-access,model,ui}/
├── products/{feature,data-access,model,ui}/
├── orders/{feature,data-access,model,ui}/
├── clients/{feature,data-access,model,ui}/
└── dashboard/{feature,data-access,ui}/
```

Place new code according to this structure. Move existing code only as part of
a separate task.

`references` groups six tables across four React Admin pages. Each table has a
separate feature SDD, but paired tabs are composed by one page and one route.
Do not create empty `model` and `ui` libraries in advance. If domain types or
invariants, or reusable domain presentation, already exist, the corresponding
layer is required even when code has historically lived in `data-access` or
`feature`.

## `admin/core`

`shell` contains the application shell, navigation, layout, and route outlet;
`auth` contains session and authentication; `permissions` contains permission
checks. `core` does not contain rules for specific domains.

Group new `core` code by responsibility; the `src` root is not a place for
internal implementations. Target structures for new or substantially changed
code:

```text
libs/admin/core/
├── shell/src/
│   ├── index.ts
│   ├── layout/             # layout composition and content outlet
│   ├── navigation/         # navigation config, sidebar, mobile panel
│   ├── components/         # top bar, breadcrumbs, menus
│   └── hooks/              # shell-specific React hooks
├── auth/src/
│   ├── index.ts
│   ├── api/                # auth transport / RTK Query, if introduced
│   ├── session/            # session model, provider, lifecycle
│   └── hooks/              # useAuth / useSession and other public hooks
└── permissions/src/
    ├── index.ts
    ├── policies/           # permission rules and pure predicates
    ├── guards/             # route and action guards
    └── hooks/              # usePermission and derived hooks
```

Create a directory only when its responsibility exists. Do not mass-move
existing flat code; split it alongside a change to the relevant feature or in
a separate task.

## Business domains

A domain is isolated and exposes its public API only through its root
`src/index.ts`. Deep imports into another domain's internal modules are
prohibited.

| Layer         | Responsibility                                                       | Must not contain              |
| ------------- | -------------------------------------------------------------------- | ----------------------------- |
| `feature`     | Screen, user scenario, route entry, orchestration                    | HTTP and shared UI primitives |
| `data-access` | API, generated DTOs at boundary, response validation, mapping, cache | JSX and routes                |
| `model`       | Types, invariants, pure transformations                              | React, HTTP, browser APIs     |
| `ui`          | Reusable domain presentation components                              | API, router, server state     |

Create `model` when domain types, invariants, or pure logic are consumed by
more than one file or layer. A small domain may start with `feature` until a
separate responsibility actually appears; once it does, do not postpone the
boundary because a second Nx project is missing.

## Internal structure of a domain library

`src/index.ts` in each library is only its public API. Do not place internal
code beside it “temporarily” or accumulate it in a large file. Use these
directories when the corresponding role exists:

```text
libs/admin/<domain>/
├── data-access/src/
│   ├── index.ts
│   ├── api/                # injectEndpoints, hooks, endpoint definitions
│   ├── contracts/          # private adapters; do not manually duplicate OpenAPI DTOs
│   ├── mappers/            # DTO <-> domain/request conversions
│   ├── models/             # technical request/cache types owned by data-access
│   └── validators/         # request/response validation at API boundary
├── model/src/
│   ├── index.ts
│   ├── entities/           # domain entities and value types
│   ├── queries/            # domain query types, defaults, and invariants
│   ├── mappers/            # pure domain transformations
│   └── validators/         # pure domain validation where needed
├── ui/src/
│   ├── index.ts
│   ├── components/         # reusable presentation components
│   ├── tables/             # table shells, columns, and cells
│   ├── forms/              # presentation forms and fields
│   └── states/             # presentation loading/empty/error states
└── feature/src/
    ├── index.ts
    ├── <domain>.routes.tsx
    ├── pages/              # route and page composition
    ├── components/         # feature-only composition elements
    ├── hooks/              # feature orchestration hooks
    └── state/              # local reducer/actions or persistent client state
```

This does not require creating every directory in advance. It requires keeping
roles separate: an endpoint does not contain a DTO parser, a mapper does not
contain a React component, and a table does not own server state or routing.
Nx module-boundary rules should allow the documented directions
`feature -> ui/model/data-access`, `ui -> model`, and `data-access -> model`,
while prohibiting reverse dependencies. If actual `depConstraints` disagree,
first create an architecture enabler/remediation task; do not leave domain
types in the wrong layer only because lint configuration is outdated.

### Example: products

The `products` domain keeps the product model, types, query invariants, and
paginated list result in `products/model`; `products/data-access` owns the
endpoint, imports generated DTOs for the
[OpenAPI contract](../../api/contract-workflow.md), and performs validation
and mapping. The files below illustrate a target structure; they do not prove
that code generation exists.

```text
libs/admin/products/
├── model/src/
│   ├── entities/admin-product-list-item.ts
│   └── queries/
│       ├── products-list-page.ts
│       └── products-list-query.ts
└── data-access/src/
    ├── api/admin-products.api.ts
    ├── contracts/admin-products-list.adapter.ts
    └── mappers/
```

## Internal feature structure

Group internal modules by scenario responsibility:

```text
libs/admin/products/feature/src/
├── index.ts
├── products.routes.tsx
├── pages/
├── components/
├── hooks/
└── state/
```

Create directories only when corresponding code exists. If a page becomes an
independent business boundary, split it into a separate feature only through
a separate architecture decision.

## `admin/shared`

`admin/shared` contains only code shared across multiple domains: UI
primitives, API client, transport contracts, configuration, utilities, and
testing. It does not depend on domains. Do not move code needed by one domain
to `shared` in advance.
