# Site: «Регіони» page

**Status:** code exists, checked 2026-11-20. Specification: [«Регіони» page](../../specs/site/regions/001-regions/README.md).

`/uk/regions` and `/ru/regions` are one page about orders from any city of Ukraine: the lead with the delivery terms (all Ukraine, shipped within 3 working days, Nova Poshta and SAT), four steps of an order from another city, the cities Brevi ships to, each of the 13 [city pages](city-pages.md) cities linking to its «Пошиття» and «Робочий одяг» pages, what a buyer in Poltava gets (pickup, courier, address), and the call to order. The footer links here with «Доставка по всій Україні», and `Organization` names Ukraine as the area served. The page is static and reads no API. «Усі міста» of the city sections of the catalog menu leads here.

## Structure diagram

```mermaid
flowchart LR
  Route["apps/site: [locale]/regions/page.tsx"] --> Feature["site-regions-feature: RegionsPage"]
  Route --> PageSeo["site-regions-seo: metadata"]
  Feature --> Ui["site-regions-ui: blocks, dictionary"]
  Feature --> Seo["site-core-seo: JsonLd, BreadcrumbList"]
  Feature --> Shared["site-shared-ui: PageSection, Breadcrumbs"]
```

## Code structure

```text
apps/site/src/app/[locale]/regions/page.tsx  # route
libs/site/
├── regions/feature/src/lib/regions-page.tsx  # block order, links, JSON-LD
├── regions/ui/src/lib/
│   ├── i18n/regions-dictionary.ts            # uk and ru text
│   └── sections/                             # hero, steps, cities, local, order
└── regions/seo/src/lib/regions-metadata.ts
```

## Tests

- `libs/site/regions/ui/src/lib/regions-ui.spec.tsx`
- `libs/site/regions/feature/src/lib/regions-page.spec.tsx`
- `libs/site/regions/seo/src/lib/regions-seo.spec.ts`

Run one project: `npx nx test site-regions-ui`. All site libraries: `npm run test:site`.
