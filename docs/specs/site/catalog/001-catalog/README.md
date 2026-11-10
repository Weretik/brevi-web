# Catalog, stage 1: catalog root and category pages

**Status:** implemented and verified locally 2026-11-10.
**Variant:** `nextjs`.
**Source:** [migration plan](../../migration/README.md), steps 3 and 4; design «Строчка»; owner decisions of 2026-11-10; the catalog of the live `brevi.com.ua` (copy of 2026-11-10 in project files `brevi-site/old-site-html/catalog/`).
**Feature card:** [site catalog](../../../../features/site/catalog.md).

## Decisions

- **Data is a snapshot of the old site.** BreviERP has no public catalog API and the owner postponed admin and backend work, so the categories, products, texts, and photos are copied once from `brevi.com.ua` by the scripts in `tools/site-catalog-import`. The pages read data only through `site-catalog-data-access`; the public API replaces the snapshot there later.
- **No prices.** The site has no cart, online order, or online payment, and copied prices would go stale. A card has «Дізнатися ціну» leading to the request page.
- **Flat addresses.** A category is `/{locale}/catalog/{slug}` with one slug for both languages, taken from the Ukrainian address of the old site. Subcategories do not nest in the address.
- **Left out of the old catalog:** the city categories under «Робочий одяг» (replaced by the [«Регіони»](../../regions/001-regions/README.md) page), «Брендування» and «Про нас» (they are separate pages), and categories without products.
- **One page per category.** The largest category has 85 products, so there is no pagination, sorting, or filtering in this stage.
- A few short menu names of the old site are replaced by full names in the import script (`NAMES`).

## Scenarios

1. A visitor opens `/uk/catalog` and sees 13 sections, each with its number of models and links to subsections.
2. A visitor opens a category from the mega menu, the mobile bar, the footer, the home page, or the catalog root and sees the products with photos and names, the links to subsections, and the category text.
3. A parent category lists the products of all its subsections without repeats.
4. An unknown category slug gives 404.
5. «Дізнатися ціну» and «Залишити заявку» open the request page; the phone is a `tel:` link.

## SEO

Catalog root and categories are indexable, with a self canonical, both language alternates, and `BreadcrumbList`. A category takes its title and description from the old page when it had them. All 66 pages per language are in the sitemap. The addresses of the old site are kept in `old-urls.json` of the import work folder for the 301 map at the switch of the domain.

## Not in this stage

- Product page, links from the cards, `ItemList` and `Product` structured data.
- Prices, price tiers, filters, sorting, search.
- Public catalog API in BreviERP and editing the catalog in Admin.
- The 301 redirects from the old addresses.

## Structure check

Five libraries by the catalog pattern of the architecture: `model` (types and the light tree), `data-access` (snapshot, the only reader), `ui`, `seo`, `feature`. The heavy snapshot stays out of client bundles because the client mega menu imports only the tree from `model`. Generated files live in `data/` and `snapshot/`. No generic `utils`, `types`, or `constants` files.
