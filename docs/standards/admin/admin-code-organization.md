# Admin Code Organization Rules

## Libraries and dependencies

- Place domain code in `libs/admin/<domain>/{model,data-access,ui,feature}`.
  Do not create empty libraries in advance, but once a responsibility exists,
  give it a clear owner: domain types/invariants belong in `model`,
  transport/cache in `data-access`, reusable domain presentation in `ui`, and
  orchestration in `feature`.
- `model` contains pure TypeScript types, queries, defaults, and invariants; it does not depend on React, HTTP, or browser APIs.
- `data-access` owns private DTOs, mappers, and RTK Query hooks; it contains no JSX, router, or feature-local state.
- `ui` contains presentational components, forms, tables, and states; it does not call APIs or the router.
- `feature` orchestrates pages, hooks, and local UI state; it passes domain data and callbacks to `ui`.
- Between libraries, import only through aliases and public `src/index.ts`; deep imports and aliases directly to internal files are prohibited. An additional entry point is allowed only as a separate documented public contract with its own boundary check, not as a way around the root `index.ts`.
- Public APIs export only consumer contracts. Do not export transport helpers, private DTO adapters, response parsers, or internal mappers.
- Nx tags and `depConstraints` must enforce the same dependency direction as the documentation. A layer is not considered established until lint actually allows valid dependencies and blocks reverse dependencies.

## Structure and state

- Give each file, component, and directory one cohesive responsibility.
- Group internal code by role: `components`, `pages`, `hooks`, `state`, `forms`, `tables`, `mappers`, `contracts`.
- In `feature`, start with role-based directories `pages`, `components`, `hooks`, `model`, `state`. If a role directory contains two or more independent flows/resources (for example, list, editor, detail, and media), add capability subdirectories such as `pages/product-list`, `components/product-list`, and `hooks/product-list`. Place each test beside the file at its level: page tests next to pages, hook tests next to hooks. Eight or more production files in a role directory is a required signal to record a `split/keep` decision in the code audit.

### Target `feature` structure

```text
libs/admin/<domain>/feature/src/
├── pages/
│   ├── <module-a>/
│   │   ├── <page>.tsx
│   │   └── <page>.component.test.tsx
│   └── <module-b>/
├── components/
│   ├── <module-a>/
│   │   ├── <component>.tsx
│   │   └── <component>.component.test.tsx
│   └── <module-b>/
├── hooks/
│   ├── <module-a>/
│   │   ├── use-<behavior>.ts
│   │   └── use-<behavior>.unit.test.tsx
│   └── <module-b>/
├── model/
│   └── <module>/
├── state/
│   └── <module>/
└── index.ts
```

Nesting order is required: role first, then module/capability. Create `model`
and `state` directories only when they have a corresponding responsibility.
Keep each test next to its production file at the same level.

- Do not create junk directories or names such as `common`, `misc`, `helpers`, `utils`, or `types` without a domain purpose.
- Server data, loading, and API errors belong to RTK Query; do not duplicate them in a reducer.
- Keep simple feature-local state in component state; create a reducer only for related transitions or shared feature state.
- Do not perform HTTP requests or hide business rules in JSX.

## Pages and routes

- A page is an orchestrator; separate toolbars, tables, complex cells, and feature-only dialogs when they have independent responsibilities.
- Reusable dialogs/forms belong in `ui` and receive values, errors, and callbacks through props.
- Do not change routes, guards, the global store, or theme without explicit feature scope.
