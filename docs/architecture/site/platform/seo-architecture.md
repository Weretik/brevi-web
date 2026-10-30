# SEO architecture: site

**Checked:** 2026-10-30 against the live site `brevi.com.ua` (OpenCart). `apps/site` does not exist yet.
**Owners in code (planned):** `libs/site/core/seo`, `libs/site/core/i18n`, `libs/site/core/config`, `apps/site/src/proxy.ts`, `apps/site/src/app/robots.ts`, `apps/site/src/app/sitemap.ts`

This page holds the site-wide SEO decisions. Feature specifications apply them in their `design/seo.md` and propose changes here through review. Per-page findings about the live site are in the [page inventory](../../../specs/site/migration/feature-inventory.md).

## Main rule: keep the live URLs

The live site is indexed, so the new site answers on the **same canonical URLs**. That includes the language scheme, the localized slugs, and the trailing slash as it is today. A URL changes only for a recorded reason (duplicate, typo, conflict), and the old URL then gets a permanent 301 from the redirect map. The URLs proposed in the first design concepts (`/uk/catalog/...`, `/uk/product/...`) are cancelled.

## Origin and URL form

- Production origin: `https://brevi.com.ua` (`SITE_URL`). `metadataBase` makes canonical URLs and alternates absolute.
- `www` and `http` get a 301 to `https://brevi.com.ua` at the hosting level.
- **Trailing slash, as live:** the home and category-type pages end with `/` (`/ru/`, `/specodyag-zymovyj/`, `/ru/stati/`, `/ru/contactu/`). Product and most content pages have none (`/specodyag-zymovyj/kurtka-dikson`, `/ru/o-nas`). Next.js runs with `skipTrailingSlashRedirect: true`, and `proxy.ts` sends the other form of each URL to its canonical form with a 308. The canonical form of each URL type is listed in the table below.
- Non-production: indexing stays off unless `SITE_ENV=production` and `SITE_INDEXING=true`. Every page then has `noindex, nofollow`, and `robots.txt` is `Disallow: /`.

## Locales

| Decision                    | Value                                                                                                                                                                                                          |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Locales and codes           | `uk` → `uk-UA`, `ru` → `ru-UA`                                                                                                                                                                                 |
| Default locale, `x-default` | `uk`                                                                                                                                                                                                           |
| URL scheme                  | Ukrainian **without a prefix** (`/…`), Russian under `/ru/…`, as live. Inside the app: `app/[locale]`; `proxy.ts` rewrites unprefixed paths to `/uk/…` and sends external `/uk/…` with a 308 to the root form. |
| Localized slugs             | yes: each category, product, and content page has its own slug per language (`specodyag-zymovyj` and `zimnyaya-specodezhda`); the API returns both                                                             |
| Missing translation         | do not list the missing language in alternates; never set canonical across languages                                                                                                                           |
| Root `/`                    | the Ukrainian home page itself (200), no `Accept-Language` or IP redirects                                                                                                                                     |
| hreflang                    | `<link rel="alternate">` in HTML and `xhtml:link` in sitemaps. The live site has none today, which is a main gain of the move.                                                                                 |
| Language switch             | links to the exact counterpart URL from the API, not a prefix swap                                                                                                                                             |

## URL and index policy

The forms come from the live site. The Russian URL is shown, and the Ukrainian one is the same without `/ru` and with its own slug.

| URL type                         | Example (canonical form)                                                          | Index                                 | Canonical                   | Sitemap   | Links                                |
| -------------------------------- | --------------------------------------------------------------------------------- | ------------------------------------- | --------------------------- | --------- | ------------------------------------ |
| Home                             | `/`, `/ru/`                                                                       | yes                                   | self                        | yes       | logo, footer                         |
| Catalog root                     | `/ru/specodezhda-optom-ot-proizvoditelya/`                                        | yes                                   | self                        | yes       | menu «Каталог»                       |
| Category                         | `/ru/zimnyaya-specodezhda/`                                                       | yes                                   | self (page 1 without query) | yes       | mega menu, home, breadcrumbs, footer |
| Subcategory                      | `/ru/zimnyaya-specodezhda/zimnie-rabochie-zhilety/`                               | yes                                   | self                        | yes       | category, mega menu                  |
| Third level (footwear)           | `/ru/obuv-rabochaya/letnyaya-rabochaya-obuv/botinki-rabochie/`                    | yes                                   | self                        | yes       | subcategory                          |
| Category page 2+                 | `?page=2`                                                                         | yes                                   | self with `page`            | no        | pagination links                     |
| Sort, limit, filter combinations | `?sort=p.price&order=ASC`, `?limit=50`                                            | no, `noindex, follow`                 | category                    | no        | `rel="nofollow"` on sort             |
| Single-value filter landing      | whitelist only, decided per category                                              | whitelist                             | self                        | whitelist | filter links                         |
| Search                           | `/ru/search?q=…`                                                                  | no, `noindex, follow`                 | —                           | no        | form only                            |
| Product                          | `/ru/zimnyaya-specodezhda/kurtka-dikson`                                          | yes                                   | self                        | yes       | listings, related products           |
| Content                          | `/ru/o-nas`, `/ru/dostavka-i-oplata`, `/ru/stati/`                                | yes                                   | self                        | yes       | menu, footer                         |
| Article                          | `/ru/stati/{slug}`                                                                | yes                                   | self                        | yes       | articles list, category links        |
| Industry landing (new)           | `[NEEDS CLARIFICATION: slug per industry, e.g. /ru/specodezhda-dlya-agrosektora]` | yes                                   | self                        | yes       | home «Галузі», menu                  |
| Logo and branding landings       | `/ru/brendirovanie-specodezhdy/…`, `/ru/nanesenie-logotipov`                      | yes                                   | self                        | yes       | menu «Пошиття з логотипом»           |
| Region landing                   | one set kept, the other gets a 301 (see inventory)                                | yes, with unique text                 | self                        | yes       | regions block in the footer          |
| Request list, form, thanks       | `/zayavka`, `/ru/zayavka`                                                         | no                                    | —                           | no        | `rel="nofollow"`                     |
| Compare                          | `/ru/sravnenie/`                                                                  | not migrated: 301 to the catalog root | —                           | no        | —                                    |
| 404                              | any unknown URL                                                                   | no                                    | —                           | no        | —                                    |

- **Status codes:** unknown slug → 404. A product removed from sale → 301 to its category, or 410 when there is no replacement. An empty filter result → 200 with `noindex`. Never 200 for a page that does not exist.
- **Pagination:** real `<a href>` links. The page-1 URL has no `?page=1`, and `?page=1` gets a 308 to the clean URL.
- **Filters:** the live site has no filters, only sorting. New filters (size, season, fabric) are added only with a written URL model in the catalog SDD.

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
- **City in titles:** Poltava, or the region on a regional landing. The live «Київ» in titles that are not about Kyiv is removed.
- **Migrated texts:** titles, descriptions, and SEO texts come from OpenCart through the import. Overlong titles are shortened during the import review, not by code.

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
- `robots.txt` with indexing on: allow `/`, disallow `/api/`, `/zayavka`, `/ru/zayavka`, and `/*?*sort=`, plus an absolute `Sitemap:` line.

## Redirect map

A versioned file in `apps/site` (format decided in step 9), filled from the OpenCart `seo_url` export, plus the cases recorded in the inventory:

- Old URLs that change (merged region set, `/ru/sravnenie/`, `/ru/magazin/` if it is not kept).
- Language mix-ups found on the live site (`/specodezhda-dlya-predpriyatiy` without `/ru/`, body links to `/o-nas` and `/nashi-raboty` in the Russian version, `/pro-nas` next to `/o-nas`, `/uk/ugody-korystuvacha`).
- OpenCart technical URLs: `index.php?route=product/product&product_id=…`, `index.php?route=product/category&path=…`, and `?route=…` variants found in the export or in Search Console.
- Every redirect points straight at the final URL, with no chains.

## Monitoring

- Google Search Console domain property for `brevi.com.ua`. `[NEEDS CLARIFICATION: who has access]`.
- Export the top pages and queries before cutover, to compare afterwards.
- Watch Core Web Vitals from CrUX.
- Review the 404 and coverage reports weekly for a month after cutover.

## Backend requirements (BreviERP)

For full SEO, BreviERP needs the following. Record each item in the matching backend SDD and the [contracts](../../../contracts/openapi/SOURCE.json).

1. A public catalog read API: a category tree (three levels) with `uk` and `ru` names, slugs, H1, title, description, and SEO text. Products with per-language slugs, the parent category, a model or SKU, description, characteristics, fabrics, sizes, colors, photos, availability, and `updatedAt`.
2. Public price tiers 1–9, 10–39, and 40+ per product and fabric, VAT included, plus logo surcharges for the calculator.
3. A slug history and a "removed" status, for 301 and 410.
4. A one-time import from OpenCart: texts, slugs, photos, meta tags, and the `seo_url` table for the redirect map.
5. An endpoint for site requests (lead or draft quote in CRM), with spam protection and no authentication.
6. Revalidation webhook calls after catalog changes.
