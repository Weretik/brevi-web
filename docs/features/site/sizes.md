# Site: «Таблиця розмірів» page

**Status:** code exists, checked 2026-11-11. Specification: [«Таблиця розмірів» page](../../specs/site/sizes/001-size-chart/README.md).

`/uk/size-chart` and `/ru/size-chart` show a size finder (chest and height for clothing, foot length for shoes), the charts as text tables for men's and women's figures and for shoes, and the numbered measuring rules. Data and rules come from the old `brevi.com.ua` page. The page is static and reads no API.

## Code structure

```text
apps/site/src/app/[locale]/size-chart/page.tsx  # route
libs/site/
├── sizes/feature/src/lib/sizes-page.tsx        # block order, links, JSON-LD
├── sizes/ui/src/lib/
│   ├── data/size-chart.ts                      # charts and lookup functions
│   ├── i18n/sizes-dictionary.ts                # uk and ru text
│   └── sections/                               # size-finder (client), size-tables, measure-steps
└── sizes/seo/src/lib/sizes-metadata.ts
```

## Tests

- `libs/site/sizes/ui/src/lib/sizes-ui.spec.tsx`
- `libs/site/sizes/feature/src/lib/sizes-page.spec.tsx`
- `libs/site/sizes/seo/src/lib/sizes-seo.spec.ts`

Run one project: `npx nx test site-sizes-ui`.
