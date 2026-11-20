# Site: home page

**Status:** code exists, checked 2026-11-20 (client corrections: popular models, delivery map, plain industries). Specification: [home page](../../specs/site/home/001-home/README.md).

`/uk` and `/ru` show the home page of the «Строчка» mockup: first screen (offer, three facts, «Залишити заявку», sales phone, suit photo with four callouts), catalog sections, «Популярні моделі» (a carousel of five product cards with «Купити»), logo on the uniform, four work steps, own production, industries (plain text, no links), «Працюємо по всій Україні» with the map ([delivery](delivery.md)), contacts, SEO text with FAQ. Text is in the home dictionary (the SEO text and FAQ saved in «Сторінки сайту» replace it) and company facts in «Контакти та компанія» (`loadSiteCompany`); the catalog sections come from the [catalog](catalog.md) API through the route, and the block is left out while the catalog is empty.

The route picks the popular models with `pickFeaturedProducts` (the first five products of the catalog order with a photo and a price) and the block is left out without them. «Залишити заявку» and «Купити» open the [request window](request.md); there is no cart or online order.

## Structure diagram

```mermaid
flowchart LR
  Route["apps/site: [locale]/page.tsx"] --> Feature["site-home-feature: HomePage"]
  Route --> HomeSeo["site-home-seo: metadata"]
  Feature --> Ui["site-home-ui: blocks, dictionary"]
  Feature --> Model["site-catalog-model: sections"]
  Feature --> Seo["site-core-seo: JsonLd, WebSite, LocalBusiness, FAQPage"]
  Ui --> Shared["site-shared-ui"]
  Feature --> Company["site-settings-data-access: loadSiteCompany"]
```

## Code structure

```text
apps/site/
├── public/assets/home/          # suit photos (front, back)
└── src/app/[locale]/page.tsx    # route; reads the sections and picks the popular models
libs/site/
├── home/feature/src/lib/home-page.tsx   # block order, links, JSON-LD
├── home/ui/src/lib/
│   ├── i18n/home-dictionary.ts  # uk and ru text
│   └── sections/                # home-hero, home-catalog, home-logo, home-process,
│                                # home-production, home-industries, home-contacts, home-seo-text
├── home/seo/src/lib/            # home-metadata
├── catalog/model/src/lib/mappers/catalog-sections.ts
├── catalog/model/src/lib/queries/catalog-featured.ts      # pickFeaturedProducts
├── catalog/ui/src/lib/listing/grid/catalog-product-carousel.tsx
├── delivery/ui/src/lib/map/     # DeliveryAcrossUkraine with the map
├── shared/ui/src/lib/page-section.tsx   # block frame: stitch label, h2, action link
└── core/i18n/src/lib/site-paths.ts
```

## Tests

- `libs/site/home/ui/src/lib/home-ui.spec.tsx`
- `libs/site/home/feature/src/lib/home-page.spec.tsx`
- `libs/site/home/seo/src/lib/home-seo.spec.ts`
- `libs/site/catalog/model/src/lib/mappers/catalog-sections.spec.ts`, `queries/catalog-featured.spec.ts`

Run one project: `npx nx test site-home-ui`. All site libraries: `npm run test:site`.
