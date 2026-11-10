# Site: «Наші роботи» page

**Status:** code exists, checked 2026-11-10. Specification: [«Наші роботи» page](../../specs/site/works/001-works/README.md).

`/uk/our-work` and `/ru/our-work` show a gallery of 82 photos of workwear that Brevi sewed for clients, and a call to order with links to the request form and to «Виробництво». The photos are the originals of the live `brevi.com.ua` gallery, converted to WebP in two sizes: a thumbnail for the grid and a large file that opens in a new tab. The page is static and reads no API.

## Structure diagram

```mermaid
flowchart LR
  Route["apps/site: [locale]/our-work/page.tsx"] --> Feature["site-works-feature: WorksPage"]
  Route --> PageSeo["site-works-seo: metadata"]
  Feature --> Ui["site-works-ui: gallery, order block, dictionary"]
  Feature --> Seo["site-core-seo: JsonLd, BreadcrumbList"]
  Feature --> Shared["site-shared-ui: PageHeader, PageSection"]
  Ui --> Photos["apps/site/public/assets/works"]
```

## Code structure

```text
apps/site/src/app/[locale]/our-work/page.tsx  # route
apps/site/public/assets/works/                # work-NNN.webp and work-NNN-thumb.webp
libs/site/
├── works/feature/src/lib/works-page.tsx      # block order, links, JSON-LD
├── works/ui/src/lib/
│   ├── data/work-photos.ts                   # photo list with sizes, file paths
│   ├── i18n/works-dictionary.ts              # uk and ru text
│   └── sections/                             # works-gallery, works-order
└── works/seo/src/lib/works-metadata.ts
```

To add a photo: put both WebP files into `apps/site/public/assets/works/` and add a row to `WORK_PHOTOS`.

## Tests

- `libs/site/works/ui/src/lib/works-ui.spec.tsx`
- `libs/site/works/feature/src/lib/works-page.spec.tsx`
- `libs/site/works/seo/src/lib/works-seo.spec.ts`

Run one project: `npx nx test site-works-ui`. All site libraries: `npm run test:site`.
