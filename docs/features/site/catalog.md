# Site: catalog, category, and product pages

**Status:** catalog root, category pages, and product pages exist, checked 2026-11-11. Specifications: [catalog, stage 1](../../specs/site/catalog/001-catalog/README.md), [product page](../../specs/site/catalog/002-product-page/README.md).

`/uk/catalog` and `/ru/catalog` show the 13 catalog sections with their subsections. `/{locale}/catalog/{slug}` is a category page: breadcrumbs, heading with the number of models, links to subsections, the list of products (photo and name), the category text of the old site, and the order block. There are 65 category pages and 242 products. A category shows all its products on one page (the largest has 85); there is no sorting, filtering, or pagination.

`/{locale}/product/{slug}` is a product page: the photo (the block supports several with thumbnails; the snapshot has one per product), the name, the model number, short facts, «Дізнатися ціну» and the phone, the description, the characteristics, four other models of the same category, and the order block. A product card in a listing opens its product page.

The catalog shows no prices and has no cart (owner decisions of 2026-11-10): product cards and product pages have «Дізнатися ціну», which opens the [request page](request.md).

The data is a snapshot of the old `brevi.com.ua` catalog taken on 2026-11-10, because BreviERP has no public catalog API yet. `site-catalog-data-access` is the only place that reads the snapshot, so switching to the API later does not touch the pages. The light category tree (names, slugs, counts) lives in `site-catalog-model` and feeds the mega menu, the footer, the mobile bar, the home page, and the sitemap.

## Structure diagram

```mermaid
flowchart LR
  Root["apps/site: [locale]/catalog/page.tsx"] --> Feature["site-catalog-feature: root, category, and product pages"]
  Category["apps/site: [locale]/catalog/[category]/page.tsx"] --> Feature
  Product["apps/site: [locale]/product/[product]/page.tsx"] --> Feature
  Product --> PageSeo
  Product --> Data
  Root --> PageSeo["site-catalog-seo: metadata, Product and ItemList"]
  Category --> PageSeo
  Category --> Data["site-catalog-data-access: snapshot of the old site"]
  Feature --> Data
  Feature --> Ui["site-catalog-ui: blocks, dictionary"]
  Feature --> Model["site-catalog-model: tree, types"]
  Data --> Model
  Ui --> Model
  Shell["site-core-shell, site-home-ui, sitemap"] --> Model
```

## Code structure

```text
apps/site/src/app/[locale]/catalog/page.tsx             # catalog root
apps/site/src/app/[locale]/catalog/[category]/page.tsx  # category; unknown slug is 404
apps/site/src/app/[locale]/product/[product]/page.tsx   # product; unknown slug is 404
apps/site/public/catalog/products/                      # product photos (webp), one per product
libs/site/
├── catalog/model/src/lib/
│   ├── catalog-tree.ts            # tree type, path lookup
│   ├── catalog-category.ts        # category and product card types
│   ├── catalog-product.ts         # product page type
│   ├── catalog-sections.ts        # sections for menus and the home page
│   └── data/catalog-tree.ts       # generated tree
├── catalog/data-access/src/lib/
│   ├── catalog-source.ts          # categories, products, related products
│   └── snapshot/                  # generated categories, cards, product details
├── catalog/ui/src/lib/
│   ├── i18n/catalog-dictionary.ts # uk and ru text
│   └── sections/                  # sections grid, subcategories, product grid, text, order,
│                                  # product gallery (client), buy block, specs
├── catalog/seo/src/lib/           # catalog-metadata, catalog-product-seo
└── catalog/feature/src/lib/       # catalog-root-page, catalog-category-page, catalog-product-page
tools/site-catalog-import/         # scripts that built the snapshot
```

## Tests

- `libs/site/catalog/model/src/lib/catalog-sections.spec.ts`
- `libs/site/catalog/data-access/src/lib/catalog-source.spec.ts`
- `libs/site/catalog/ui/src/lib/catalog-ui.spec.tsx`
- `libs/site/catalog/seo/src/lib/catalog-metadata.spec.ts`
- `libs/site/catalog/seo/src/lib/catalog-product-seo.spec.ts`
- `libs/site/catalog/feature/src/lib/catalog-pages.spec.tsx`

Run one project: `npx nx test site-catalog-ui`. All site libraries: `npm run test:site`.
