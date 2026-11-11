# site-catalog-data-access

The only reader of catalog data: the BreviERP public catalog API. See the [feature card](../../../../docs/features/site/catalog.md).

- `catalog-source.ts` — what pages call: `getCatalogTree`, `getCatalogCategory`, `getCatalogCategorySlugs`, `getCatalogCategoryProducts`, `getCatalogProduct`, `getCatalogProductAddresses`, `getCatalogProductCategory`, `getCatalogRelatedProducts`. An unavailable API gives an empty catalog, never an error.
- `catalog-loaders.ts` — cached reads (`'use cache'`, tag and lifetimes in `catalog-cache.ts`).
- `mappers/public-catalog.mapper.ts` — checks every answer at run time and maps it to the types of `site-catalog-model`. The site does not import the Admin's generated contract types.

Server only: do not import this library from a client component.

Tests: `npx nx test site-catalog-data-access`.
