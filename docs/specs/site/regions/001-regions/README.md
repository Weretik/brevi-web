# «Регіони» page (delivery across Ukraine)

**Status:** implemented and verified locally 2026-11-10.
**Variant:** `nextjs`.
**Source:** [migration plan](../../migration/README.md); design «Строчка»; owner decision 2026-11-10 after the audit below; delivery terms from the [«Доставка та оплата» page](../../delivery/001-delivery/README.md); the cities from the live `brevi.com.ua`.
**Feature card:** [site regions](../../../../features/site/regions.md).

## Audit of the live region pages (2026-11-10)

- 26 pages: for each of 13 cities one «Пошиття спецодягу на замовлення та оптовий продаж у {місті}» and one catalog category «Спецодяг {місто}».
- Texts of different cities match by 45–55% on average: one template with the city replaced and phrases reordered.
- No local facts on any page: no address in the city, delivery time, clients, or works. The workshop is in Poltava.
- Two pages per city answer the same query and compete with each other.
- Risk: search engines treat such sets as doorway pages. Search Console data was not available, so the traffic of these pages is unknown.

## Decision

One page for all cities instead of a page per city. A city gets its own page later only if Search Console shows clicks for it and the page has unique local content. At cutover the old city addresses redirect (301) to this page.

## Scope

- Libraries `site-regions-ui`, `site-regions-seo`, `site-regions-feature`, created with `nx g @nx/react:library`.
- Footer line «Доставка по всій Україні» linking to the page.
- `Organization` gets `areaServed` (Ukraine).
- The page in the sitemap.

## Out of scope

- City pages `/regions/{city}`.
- The city field in the request form: comes with the «Заявка» page.
- The customer's city in «Наші роботи»: needs data from the client.
- 301 redirects from the old addresses: done at cutover by the migration plan.

## Rules

| ID     | Rule                                                                                                                   |
| ------ | ---------------------------------------------------------------------------------------------------------------------- |
| RG-001 | One `h1`; blocks: lead with the delivery terms, how to order from another city, cities, Poltava, order.                |
| RG-002 | The first screen says that orders come from any city and nobody has to travel to Poltava.                              |
| RG-003 | Delivery facts repeat the delivery page: Nova Poshta and SAT, shipped within 3 working days, courier in Poltava 250 ₴. |
| RG-004 | Cities are plain text, not links; the page says the list is not a limit.                                               |
| RG-005 | «Залишити заявку» opens the request page with `nofollow`; the only phone is the site phone.                            |
| RG-006 | Internal links to delivery, contacts, production, wholesale prices, and industries; the footer links to the page.      |
| RG-007 | Breadcrumbs are visible and repeated in `BreadcrumbList`; `Organization` names Ukraine as the area served.             |
| RG-008 | Title and description per language, canonical, `hreflang`; both languages have the same blocks; no client components.  |

## Traceability

| Rule                   | Code                                                 | Test                                       |
| ---------------------- | ---------------------------------------------------- | ------------------------------------------ |
| RG-001, RG-004         | `regions-page.tsx`, `regions-cities.tsx`             | `regions-page.spec.tsx`, `regions-ui.spec` |
| RG-002, RG-003         | `regions-dictionary.ts`, `regions-local.tsx`         | `regions-ui.spec.tsx`                      |
| RG-005, RG-006         | `regions-hero.tsx`, `regions-order.tsx`, site footer | `regions-ui.spec`, `site-shell.spec.tsx`   |
| RG-007 (area served)   | `site-json-ld.ts`                                    | `json-ld.spec.tsx`                         |
| RG-007 (crumbs), RG-08 | `regions-page.tsx`, `regions-metadata.ts`            | `regions-page.spec`, `regions-seo.spec.ts` |

## Verification (2026-11-10)

Headless Chromium against `next start` of a production build: both URLs prerendered; title «Спецодяг з доставкою по Україні від виробника — Brevi»; self canonical; one `h1`; `BreadcrumbList` and the layout `Organization`; no horizontal scroll on an iPhone 13 profile; the sitemap has both languages of the page.

## Structure check (2026-11-10)

Short check under the staged structure check in the [delivery rules](../../../../standards/shared/delivery-rules.md).

| Check                       | Result                                                                                      |
| --------------------------- | ------------------------------------------------------------------------------------------- |
| Route is thin               | `regions/page.tsx` checks the locale and calls the metadata builder and the page.           |
| One responsibility per file | One section per file; the dictionary holds all text; SEO values live in the `seo` library.  |
| Client code                 | None.                                                                                       |
| No duplicates               | Address and phone from `COMPANY`; section frame, breadcrumbs, and buttons from shared UI.   |
| Generator leftovers         | Removed sample components, CSS modules, and `.babelrc`; configs match the other site pages. |
