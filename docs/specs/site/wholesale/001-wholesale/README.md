# «Ціни для опту» page

**Status:** implemented and verified locally 2026-11-10.
**Variant:** `nextjs`.
**Source:** [migration plan](../../migration/README.md); design «Строчка»; text from the live `brevi.com.ua` page «Спецодяг оптом від виробника» (`/specodyag-optom-vid-vyrobnyka/` and `/ru/specodezhda-optom-ot-proizvoditelya/`); price levels 1–9, 10–39, 40+ from the client brief.
**Feature card:** [site wholesale](../../../../features/site/wholesale.md).

## Goal

Build the page at `/uk/order-in-bulk` and `/ru/order-in-bulk`; the header menu and the footer already link to it.

## Scope

- Libraries `site-wholesale-ui`, `site-wholesale-seo`, `site-wholesale-feature`, created with `nx g @nx/react:library`.
- The page in the sitemap.

## Out of scope

- Prices in hryvnias and a price table: the price source is not decided; they come with the catalog and BreviERP.
- The downloadable price list of the live site (PDF): it carries old contacts; the owner decides whether a new one is needed.
- The product list of the live category page: decided with the catalog.
- 301 redirects from the old addresses: done at cutover by the migration plan.

## Rules

| ID     | Rule                                                                                                                  |
| ------ | --------------------------------------------------------------------------------------------------------------------- |
| WS-001 | One `h1`; blocks: lead with the terms, price levels, what can be ordered, why Brevi, how to order.                    |
| WS-002 | Three price levels by quantity: 1–9, 10–39, 40+ pieces. The page shows no prices; the manager names the exact price.  |
| WS-003 | The text keeps the meaning of the live page: own production, small and large batches, certificates, four order steps. |
| WS-004 | «Залишити заявку» opens the request page with `nofollow`; the order block also has the phone, contacts, and delivery. |
| WS-005 | Internal links to the catalog, «Пошиття з логотипом», «Виробництво», and «Сертифікати».                               |
| WS-006 | Breadcrumbs are visible and repeated in `BreadcrumbList`.                                                             |
| WS-007 | Title and description per language, canonical, `hreflang`; both languages have the same blocks; no client components. |

## Traceability

| Rule           | Code                                                | Test                                           |
| -------------- | --------------------------------------------------- | ---------------------------------------------- |
| WS-001, WS-006 | `wholesale-page.tsx`                                | `wholesale-page.spec.tsx`                      |
| WS-002         | `wholesale-dictionary.ts`, `wholesale-tiers.tsx`    | `wholesale-ui.spec.tsx`, `wholesale-page.spec` |
| WS-003         | `wholesale-dictionary.ts`                           | `wholesale-ui.spec.tsx`                        |
| WS-004, WS-005 | `wholesale-hero.tsx`, `wholesale-range.tsx`, others | `wholesale-ui.spec.tsx`, `wholesale-page.spec` |
| WS-007         | `wholesale-metadata.ts`                             | `wholesale-seo.spec.ts`                        |

## Verification (2026-11-10)

Headless Chromium against `next start` of a production build: both URLs prerendered; title «Спецодяг оптом від виробника, ціни для опту — Brevi»; self canonical; one `h1`; `BreadcrumbList` and the layout `Organization`; no horizontal scroll on an iPhone 13 profile; the sitemap has both languages of the page.

## Structure check (2026-11-10)

Short check under the staged structure check in the [delivery rules](../../../../standards/shared/delivery-rules.md).

| Check                       | Result                                                                                      |
| --------------------------- | ------------------------------------------------------------------------------------------- |
| Route is thin               | `order-in-bulk/page.tsx` checks the locale and calls the metadata builder and the page.     |
| One responsibility per file | One section per file; the dictionary holds all text; SEO values live in the `seo` library.  |
| Client code                 | None.                                                                                       |
| No duplicates               | Section frame, breadcrumbs, and buttons come from shared UI.                                |
| Generator leftovers         | Removed sample components, CSS modules, and `.babelrc`; configs match the other site pages. |
