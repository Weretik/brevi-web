# SEO architecture: site

**Checked:** 2026-10-30. `apps/site` does not exist yet. The old OpenCart site `brevi.com.ua` was read only to list its pages and URL patterns.
**Owners in code (planned):** `libs/site/core/seo`, `libs/site/core/i18n`, `libs/site/core/config`, `apps/site/src/proxy.ts`, `apps/site/src/app/robots.ts`, `apps/site/src/app/sitemap.ts`

This page holds the site-wide SEO decisions. Feature specifications apply them in their `design/seo.md` and propose changes here through review. Findings about the old site are in the [page inventory](../../../specs/site/migration/feature-inventory.md).

## Main rule: new URLs, one 301 from every old URL

The new site is built from the Brevi storefront and BreviERP data, so it uses its own URL scheme, the same one as the Kedr site: a locale prefix and slugs from BreviERP. The domain `brevi.com.ua` is indexed today (OpenCart), so at cutover **every old URL gets exactly one permanent 301** to the closest new page. A 301 passes almost all of a page's ranking, and hreflang, structured data, and better titles make up for the move.

Owner decision 2026-10-30: this scheme, not a one-to-one copy of the old URLs.

## Origin and URL form

- Production origin: `https://brevi.com.ua` (`SITE_URL`). `metadataBase` makes canonical URLs and alternates absolute.
- Hosting: Cloudflare (owner decision 2026-10-30). `www` and `http` get a 301 to `https://brevi.com.ua` at the Cloudflare level.
- Trailing slash: none. `/uk/` → `/uk`, and `/` → `/uk`, are permanent (308) redirects, as on the Kedr site.
- Non-production: indexing stays off unless `SITE_ENV=production` and `SITE_INDEXING=true`. Every page then has `noindex, nofollow`, and `robots.txt` is `Disallow: /`.

## Locales

| Decision                    | Value                                                                                 |
| --------------------------- | ------------------------------------------------------------------------------------- |
| Locales and codes           | `uk` → `uk-UA`, `ru` → `ru-UA`                                                        |
| Default locale, `x-default` | `uk`                                                                                  |
| URL scheme                  | path prefix `/uk` and `/ru` on every page (`app/[locale]`)                            |
| Localized slugs             | no: one slug per product and category from BreviERP, the same in both languages       |
| Missing translation         | do not list the missing language in alternates; never set canonical across languages  |
| Root `/`                    | permanent redirect to `/uk`, no `Accept-Language` or IP detection                     |
| hreflang                    | `<link rel="alternate">` in HTML and `xhtml:link` in sitemaps. The old site has none. |

## URL and index policy

| URL type                        | Example                                         | Index                 | Canonical                   | Sitemap   | Links                                |
| ------------------------------- | ----------------------------------------------- | --------------------- | --------------------------- | --------- | ------------------------------------ |
| Home                            | `/uk`                                           | yes                   | self                        | yes       | logo, footer                         |
| Catalog root                    | `/uk/catalog`                                   | yes                   | self                        | yes       | menu «Каталог»                       |
| Category or subcategory         | `/uk/catalog/{categorySlug}`                    | yes                   | self (page 1 without query) | yes       | mega menu, home, breadcrumbs, footer |
| Category page 2+                | `?page=2`                                       | yes                   | self with `page`            | no        | pagination links                     |
| Sort, filter combinations       | `?sort=price-asc`                               | no, `noindex, follow` | category                    | no        | `rel="nofollow"` on sort             |
| Single-value filter landing     | whitelist only, decided per category            | whitelist             | self                        | whitelist | filter links                         |
| Search                          | `/uk/search?q=…`                                | no, `noindex, follow` | —                           | no        | form only                            |
| Product                         | `/uk/product/{productSlug}`                     | yes                   | self                        | yes       | listings, related products           |
| Content (storefront `about-us`) | `/uk/about-company`, `/uk/delivery-and-payment` | yes                   | self                        | yes       | menu, footer                         |
| Article                         | `/uk/articles/{slug}`                           | yes                   | self                        | yes       | articles list, category links        |
| Contacts                        | `/uk/contacts`                                  | yes                   | self                        | yes       | header, footer                       |
| Industry landing (new)          | `/uk/industries/{slug}`                         | yes                   | self                        | yes       | home «Галузі», menu                  |
| Logo landing                    | `/uk/logo-printing`                             | yes                   | self                        | yes       | menu «Пошиття з логотипом»           |
| Wholesale prices                | `/uk/order-in-bulk`                             | yes                   | self                        | yes       | menu «Ціни для опту»                 |
| Region landing                  | `/uk/regions/{city}`                            | yes, with unique text | self                        | yes       | regions block in the footer          |
| Request list, form, thanks      | `/uk/request`                                   | no                    | —                           | no        | `rel="nofollow"`                     |
| 404                             | any unknown URL                                 | no                    | —                           | no        | —                                    |

Content slugs follow the storefront route names (`libs/storefront/feature/*/lib.routes.ts`); the exact list is fixed in each step's SDD.

- **Status codes:** unknown slug → 404. A product removed from sale → 301 to its category, or 410 when there is no replacement. An empty filter result → 200 with `noindex`. Never 200 for a page that does not exist.
- **Pagination:** real `<a href>` links. The page-1 URL has no `?page=1`, and `?page=1` gets a 308 to the clean URL.
- **Filters:** start with sorting only. New filters (size, season, fabric) are added only with a written URL model in the catalog SDD.

## Metadata

| Field          | Default (layout)     | Per page                                                                            | Builder                                  |
| -------------- | -------------------- | ----------------------------------------------------------------------------------- | ---------------------------------------- |
| Title template | `%s — Brevi`         | ≤ 60 characters, the key phrase first, no keyword stuffing                          | `buildRootMetadata`, `buildPageMetadata` |
| Description    | —                    | required on every indexable page, 140–160 characters, no decorative symbols         | `buildPageMetadata`                      |
| Canonical      | —                    | self, per locale                                                                    | `buildCanonicalPath`                     |
| Alternates     | —                    | `uk-UA`, `ru-UA`, `x-default` → the Ukrainian URL                                   | `buildLanguageAlternates`                |
| Robots         | site policy          | `indexable: false` → `noindex, follow`                                              | `buildRobotsMeta`                        |
| Open Graph     | `siteName`, `locale` | `type`, `url`, `title`, `description`, `alternateLocale`; product photo on products | `buildPageMetadata` + domain `seo`       |

- **Brand name:** one spelling per language: «Brevi» in Latin letters in titles, plus «Бреві» (uk) or «Бреви» (ru) in body text. `[NEEDS CLARIFICATION: confirm with the client]`.
- **City in titles:** Poltava, or the region on a regional landing. The old site's «Київ» in titles that are not about Kyiv is removed.
- **Texts:** titles, descriptions, and SEO texts come from BreviERP (edited in Admin) or from the site dictionaries for static pages. Old-site texts may be reused by hand as a starting point, without its errors.

## Structured data

| Page type   | Types                                                                                                                                                                  | Source                               |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| Every page  | `Organization` (logo, `sameAs` Facebook, Instagram, YouTube, `ContactPoint`)                                                                                           | `COMPANY` constants                  |
| Home        | `WebSite`; `LocalBusiness` (`ClothingStore` is not a fit; use `LocalBusiness` with address, phones, hours)                                                             | `COMPANY`                            |
| Category    | `BreadcrumbList`, `ItemList` of the page's products                                                                                                                    | category API                         |
| Product     | `Product` (name, SKU or model, images, description, `brand: Brevi`) + `AggregateOffer` (`lowPrice`, `highPrice`, `priceCurrency: UAH`, `offerCount`), `BreadcrumbList` | product API                          |
| Visible FAQ | `FAQPage` only where the questions are visible on the page                                                                                                             | page content                         |
| Article     | `Article` (`datePublished`, `dateModified`, author or organization)                                                                                                    | content API                          |
| Contacts    | `LocalBusiness` with `PostalAddress` (Полтава, вул. Кагамлика, 3А), `geo`, `openingHoursSpecification`                                                                 | `COMPANY` (the owner provides hours) |

All JSON-LD is rendered on the server through `JsonLd`, which escapes `<`, `>`, and `&`. Prices in JSON-LD equal the prices visible on the page.

## Sitemaps and robots

- A sitemap index split by type (`categories`, `products`, `content`, `landings`), each file under 50,000 URLs, with `xhtml:link` alternates.
- `lastModified` comes from the API `updatedAt`, and is left out until the API has it.
- `robots.txt` with indexing on: allow `/`, disallow `/api/`, `/uk/request`, `/ru/request`, and `/*?*sort=`, plus an absolute `Sitemap:` line.

## Redirect map

A versioned file in `apps/site` (format decided in step 9). It maps every old `brevi.com.ua` URL to one new URL:

- The list of old URLs comes from the old site's sitemap and the Search Console pages report. No database export is needed.
- Old categories and subcategories (Ukrainian at the root, Russian under `/ru/`) → the matching `/uk/catalog/…` or `/ru/catalog/…`.
- Old products `/{category}/{product}` → `/uk/product/…` or `/ru/product/…`, matched by name or model.
- Content pages, articles, both old region sets, and branding pages → their new pages.
- Pages that are not rebuilt (`/ru/sravnenie/`, `/ru/magazin/`) → the catalog root.
- OpenCart technical URLs (`index.php?route=…`) found in Search Console → the matching page.
- Every redirect points straight at the final URL, with no chains, and keeps the language.

## Monitoring

- Google Search Console domain property for `brevi.com.ua`. `[NEEDS CLARIFICATION: who has access]`.
- Export the top pages and queries before cutover, to compare afterwards.
- Watch Core Web Vitals from CrUX.
- Review the 404 and coverage reports weekly for a month after cutover.

## Backend requirements (BreviERP)

For full SEO, BreviERP needs the following. Record each item in the matching backend SDD and the [contracts](../../../contracts/openapi/SOURCE.json).

1. A public catalog read API: a category tree (three levels) with `uk` and `ru` names, slugs, H1, title, description, and SEO text. Products with a slug, the parent category, a model or SKU, description, characteristics, fabrics, sizes, colors, photos, availability, and `updatedAt`.
2. Public price tiers 1–9, 10–39, and 40+ per product (and per fabric if the price depends on it), VAT included, plus logo surcharges for the calculator.
3. A slug history and a "removed" status, for 301 and 410.
4. An endpoint for site requests (lead or draft quote in CRM), with spam protection and no authentication.
5. Revalidation webhook calls after catalog changes.
