# Catalog, stage 3: products from the Admin

**Status:** implemented and verified locally 2026-11-11.
**Variant:** `nextjs`.
**Source:** owner task of 2026-11-11 (site products come from the Admin); BreviERP [CNT-002](https://github.com/Weretik/BreviERP/blob/f6c8fd1/docs/sdd/specs/content/002-product-pages/README.md), stage 5 of its plan; public API contract `content-public-catalog.openapi.yaml` of BreviERP.
**Feature card:** [site catalog](../../../../features/site/catalog.md).

## Decisions

- **One source.** The catalog, the menus, the home page block, and the sitemap read the anonymous BreviERP API `GET /api/public/catalog/{tree,products,products/{slug},product-slugs}`. The snapshot of the old site, its photos, and the import scripts are removed.
- **Only what staff show.** The API returns the products marked «Показувати на сайті» in «Контент → Товари сайту»; the site adds no products of its own.
- **Tree.** The upper level is the two product types, named by the site: «Спецодяг власного пошиття» (`/catalog/spetsodyah`) and «Засоби індивідуального захисту» (`/catalog/zasoby-zakhystu`). Under each are the sections of «Типи і розділи» that have products on the site. A section has only a Ukrainian name, so the Russian pages show it too until «Контент → Розділи» exists.
- **Prices are shown (owner decision 2026-11-11).** A listing card shows the lowest price «від 1 250 грн». The product page shows three prices by order size (1–9, 10–39, from 40 pieces): of the chosen fabric for a sewing model, of the product itself for protective equipment. A product without a price keeps «Дізнатися ціну».
- **No cart.** The actions stay «Залишити заявку» and the phone.
- **Automatic refresh (owner decision 2026-11-11).** Answers of the API are cached with `'use cache'` for five minutes under the tag `catalog`, in Workers KV; a failed read is kept for one minute. A change in the Admin reaches the site within about ten minutes (the API keeps its own snapshot for a minute and may be cached for five) without a rebuild. A product or category added later opens on the first visit (`dynamicParams`).
- **Failure.** When the API is unavailable or answers another shape, the catalog is empty, a product is 404, and the rest of the site works.
- **No generated contract types in the site.** `scope:site` may not import Admin libraries, so `site-catalog-data-access` checks every answer at run time and maps it to the site's own types.
- **Language.** The API answers in the page language. A product without Russian texts shows the Ukrainian ones on the Russian page; that page names the Ukrainian page as canonical and is left out of the sitemap.

## Scenarios

1. Staff mark a product «Показувати на сайті»; within about ten minutes it is in its category, in the sitemap, and its page opens.
2. Staff change a price or a text; the product page shows it after the cache refreshes.
3. Staff hide a product; it leaves the listings and its page becomes 404.
4. A visitor picks a fabric on a sewing model and sees the prices of that fabric.
5. The API is down: the header, the footer, and content pages work; the catalog says the models are coming.

## SEO

Category: title is the name, description is built from the name, self canonical, both alternates, `ItemList`. Product: title and description from «Контент → Товари сайту» (the start of the text when there is no description), main photo as the Open Graph image, `Product` with `AggregateOffer` in UAH for the price range the page shows, and no offer when a manager quotes the price.

## Not in this stage

- Russian names, texts, and SEO of sections («Контент → Розділи»).
- Instant refresh from the Admin (`POST /api/revalidate` by tag); the cache tag is already in place.
- Filters, sorting, search, pagination.

## Evidence

`npm run test:site`, `npm run lint:site`, `npx nx run site:typecheck`, `npm run docs:check` on 2026-11-11.
