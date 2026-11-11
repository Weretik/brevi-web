# site-catalog-model

Catalog model of the public site. See the [feature card](../../../../docs/features/site/catalog.md).

- `catalog-tree.ts` — the category tree type, `findCatalogPath`, `flattenCatalogTree`. The tree itself comes from the API through `site-catalog-data-access`.
- `catalog-types.ts` — `CATALOG_TYPES`: names and slugs of the two product types, the upper level of the tree.
- `catalog-category.ts` — types of a category page and a product card.
- `catalog-product.ts` — types of a product page, its fabrics, and price tiers.
- `catalog-sections.ts` — `toCatalogSections` for the mega menu, the footer, the mobile bar, and the home page.

Tests: `npx nx test site-catalog-model`.
