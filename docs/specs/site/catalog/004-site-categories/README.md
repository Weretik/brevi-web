# Catalog, stage 4: site categories from the Admin

**Status:** implemented and verified locally 2026-11-11.
**Variant:** `nextjs`.
**Source:** owner decision of 2026-11-11 («Свої категорії сайту»); BreviERP [CNT-003](https://github.com/Weretik/BreviERP/blob/9e1995c29d8f3187fba60b75cc25804e9a77e803/docs/sdd/specs/content/003-site-categories/README.md), stage 5 of its plan; public API contract `content-public-catalog.openapi.yaml` 1.1.0 of BreviERP.
**Feature card:** [site catalog](../../../../features/site/catalog.md).

Replaces the «Tree» decision of [stage 3](../003-catalog-from-admin/README.md): the two product types named by the site and the sections of «Типи і розділи» are gone.

## Decisions

- **Tree.** The catalog tree is the one staff keep in «Контент → Розділи сайту»: categories with subcategories, two levels, in their order, with names in both languages. The site reads `GET /api/public/catalog/categories`. A category marked for the site is shown even without products.
- **Category page.** `GET /api/public/catalog/categories/{slug}?language=` gives the name, the SEO title and description, and the text. The text is shown under the products as the block «Про розділ»; without a text there is no block. While only this answer is unavailable the page still opens with the name from the tree.
- **Listing.** `GET /api/public/catalog/products?category={slug}`: the products of the category, then of its subcategories, each once, in the order of the category.
- **Product.** The breadcrumbs lead through the first subcategory the product is in, or its first category; a product in no category has breadcrumbs «Головна → Каталог → товар» and no «other models» block. «Other models» are the neighbours in that category.
- **Count on the catalog root.** A product may be in several categories, so the root counts the models by their own addresses, once each.
- **Language.** A category without Russian texts shows the Ukrainian ones on the Russian page; that page names the Ukrainian one as canonical and is left out of the sitemap, as for a product.
- **Sitemap.** Categories come from `GET /api/public/catalog/category-slugs` with the time of the last change.
- Cache, failure behaviour, prices, and «no cart» stay as in stage 3.

## Scenarios

1. Staff add a subcategory and mark it for the site; within about ten minutes it is in the menu, the footer, the catalog root, and the sitemap, and its page opens.
2. Staff write the SEO title, the description, and the text of a category; the page shows them after the cache refreshes.
3. Staff hide a category; it leaves the menus and its page becomes 404; its products stay on the site.
4. Staff put a product into two categories; both listings show it and the catalog root counts it once.

## SEO

Category: title and description as staff wrote them, otherwise the name and a description built from it; one `h1` (the name); self canonical and both alternates, or the Ukrainian canonical when the Russian page shows Ukrainian texts; `ItemList` and `BreadcrumbList`.

## Verification

`npm run test:site`, `npm run lint:site`, `npx nx run site:typecheck`, `npm run docs:check`, `npm run contracts:check`.
