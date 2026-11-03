# Admin: Product sections («Типи і розділи»)

**Status:** implemented 2026-11-03. **SDD:** [017](../../../specs/admin/references/017-product-sections/README.md).

`/references/product-sections` is the Admin copy of the Calculator sheet tab «Типи і розділи». A section («Одяг ЛІТО», «Захист рук»…) belongs to one product type, «Швейна продукція» or «ЗІЗ». The page follows the reference list pattern: header with «Додати розділ», search, type chips with counts, table (name, type, status, comment), drawer for view and edit, confirmed deletion. Products will refer to a section; the public site categories come from sections later.

## Code structure

```text
libs/admin/references/
├── model/src/
│   ├── entities/product-sections/      # ProductSection, type labels
│   ├── queries/product-sections/       # type counts, search and type filter
│   ├── forms/product-sections/         # form values <-> request
│   └── validators/product-sections/    # field rules
├── data-access/src/
│   ├── api/product-sections/           # RTK Query endpoints
│   ├── contracts/product-sections/     # OpenAPI types
│   ├── validators/product-sections/    # response validation
│   └── mappers/product-sections/       # API -> model
├── ui/src/components/product-sections/ # grid, type chips, form, details, delete dialog
└── feature/src/
    ├── hooks/product-sections/         # list, editor
    ├── components/product-sections/    # drawer
    └── pages/product-sections/         # page
```

## Tests

- `npx nx test admin-references-model -- product-section`
- `npx nx test admin-references-data-access -- product-section`
- `npx nx test admin-references-feature -- product-section`
