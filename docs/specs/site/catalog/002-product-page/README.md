# Catalog, stage 2: product page

**Status:** implemented and verified locally 2026-11-11.
**Variant:** `nextjs`.
**Source:** [migration plan](../../migration/README.md), step 5; design «Строчка»; owner decisions of 2026-11-10; product pages of the live `brevi.com.ua` (copy of 2026-11-10 in project files `brevi-site/old-site-html/catalog/`).
**Feature card:** [site catalog](../../../../features/site/catalog.md).

## Decisions

- **Data is the same snapshot of the old site** as in [stage 1](../001-catalog/README.md): name, model number, short facts, description, and characteristics in both languages, built by `tools/site-catalog-import/build_product_data.py`.
- **No prices, no cart, no «Купити».** The old page has a table of three prices and a «Купити» form; they are not carried over. The page offers «Дізнатися ціну» (the request page) and the phone.
- **Address** `/{locale}/product/{slug}` by the URL policy, one slug for both languages, taken from the Ukrainian address of the old site.
- **The page is a template (owner decision 2026-11-11: «не надо товары грузить, просто схематично»).** The galleries of the old site are not copied. A product shows the one photo its listing card already has; the gallery block supports several photos and thumbnails for the time products come from BreviERP.
- **Breadcrumbs** go through the deepest category that lists the product.
- **Other models.** Four neighbours from the same category, starting after the product, so pages link to different models.
- The size guide of the old site (one general text for all products) is not on the product page in this stage.

## Scenarios

1. A visitor opens a product from a category listing and sees the photo, the name, the model number, and the short facts.
2. When a product has several photos, a thumbnail switches the large photo; without JavaScript the first photo stays.
3. «Дізнатися ціну» opens the request page; the phone is a `tel:` link.
4. Below are the description, the characteristics when the product has them, other models of the category, and the order block.
5. An unknown product slug gives 404.

## SEO

Indexable, self canonical, both language alternates, the main photo as the Open Graph image. Title and description come from the old page; without a description the start of the product text is used. Structured data: `Product` (name, model as `sku`, photos, description, brand) without an offer because the site shows no prices, and `BreadcrumbList`. Category pages now add `ItemList` with links to their products. All product pages are in the sitemap.

## Not in this stage

- Prices and price tiers, the quantity calculator, the list of chosen products for a request.
- The size guide, FAQ, reviews.
- Passing the product name into the request form.
- Public catalog API in BreviERP; 301 redirects from the old product addresses.

## Structure check

No new libraries: the product type is in `model`, the reader in `data-access`, three blocks in `ui` (the gallery is the only client component and gets only photos), metadata and structured data in `seo`, the page in `feature`. The product details snapshot stays server-side.
