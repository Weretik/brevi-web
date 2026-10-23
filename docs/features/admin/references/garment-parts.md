# Admin: Garment Parts and Operations

**Status:** both tabs exist, checked 2026-10-16.

`/references/garment-part-operation` opens parts and operations tabs; the
`tab=parts|operations` query preserves the selection. Each tab has its own
content, hooks, and action dialogs in `references/feature`, tables in
`references/ui`, and separate endpoints and mappers in
`references/data-access`. A shared route does not imply a shared data model.

## Structure diagram

```mermaid
flowchart LR
  Route["/references/garment-part-operation"] --> Tabs["tab=parts or operations"]
  Tabs --> Parts["feature: garment parts"]
  Tabs --> Operations["feature: operations"]
  Parts --> PartsUI["references/ui: table"]
  Operations --> OperationsUI["references/ui: table"]
  Parts --> PartsAPI["data-access: parts API"]
  Operations --> OperationsAPI["data-access: operations API"]
```

## Code structure

```text
libs/admin/references/
├── data-access/src/api/
│   ├── garment-part-operations/
│   │   └── garment-part-operations.api.ts # operations API
│   └── garment-parts/
│       └── garment-parts.api.ts # parts API
├── feature/src/
│   ├── hooks/
│   │   ├── garment-part-operations/
│   │   │   └── use-garment-part-operations.ts # operations state
│   │   └── garment-parts/
│   │       └── use-garment-parts.ts # parts state
│   ├── pages/
│   │   ├── garment-part-operations/
│   │   │   └── garment-part-operations-content.tsx # operations tab
│   │   └── garment-parts/
│   │       └── garment-parts-page.tsx # tabs
│   └── references.routes.tsx # route
├── model/src/entities/
│   ├── garment-part-operations/
│   │   └── garment-part-operation.ts # operations model
│   └── garment-parts/
│       └── garment-part.ts # parts model
└── ui/src/components/
    ├── garment-part-operations/
    │   └── garment-part-operations-grid.tsx # operations table
    └── garment-parts/
        └── garment-parts-grid.tsx # parts table
```

**Where to look:** [route](../../../../libs/admin/references/feature/src/references.routes.tsx), [tabs](../../../../libs/admin/references/feature/src/pages/garment-parts/garment-parts-page.tsx), [parts API](../../../../libs/admin/references/data-access/src/api/garment-parts/garment-parts.api.ts), [operations API](../../../../libs/admin/references/data-access/src/api/garment-part-operations/garment-part-operations.api.ts), [SDD](../../../specs/admin/references/009-operations-pages/README.md).
