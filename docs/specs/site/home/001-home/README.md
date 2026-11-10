# Home page (migration step 2)

**Status:** implemented and verified locally 2026-11-10.
**Variant:** `nextjs`.
**Source:** [migration plan](../../migration/README.md); design «Строчка» (`D-Home` in the [idea](../../../../ideas/storefront-nextjs/README.md)); text from the live `brevi.com.ua` home page and the Angular storefront.
**Feature card:** [site home](../../../../features/site/home.md).

## Goal

Replace the temporary first screen at `/uk` and `/ru` with the home page of the «Строчка» mockup, built from blocks that need no data from BreviERP.

## Scope

- Libraries `site-home-ui`, `site-home-seo`, `site-home-feature`, and `site-catalog-model`, created with `nx g @nx/react:library`.
- Blocks in the mockup order: first screen with a product photo and numbered callouts, catalog sections, logo on the uniform, four work steps, own production, industries, contacts, SEO text with FAQ.
- Home metadata and JSON-LD: `WebSite`, `LocalBusiness`, `FAQPage`.
- `SITE_PATHS` in `site-core-i18n` (the shell and the home page share page paths); the fixed catalog sections move from the shell to `site-catalog-model`.

## Out of scope

- Price calculator and product cards with three prices: they need prices from BreviERP and come with the catalog step.
- Request form: the site cannot send requests yet; it comes with the request step.
- Editing home text in the admin.

## Owner decisions

- 2026-11-10: the admin is not wired now; every page is built first with content in code.
- 2026-11-10: the home page ships without prices and without the form. Catalog sections replace the calculator and product cards; the contacts block replaces the form.
- 2026-11-10: screenshots of the live site are the content reference; the main phone is 050 469 86 75.

## Documents

- [Behavior](requirements/behavior.md): rules `R-*` and scenarios `SC-*`.
- [SEO design](design/seo.md).
- [Traceability](traceability.md).
- [SEO verification](verification/seo-verification.md).
- [Structure check](code-audit/audit.md).

## File-role map

| Path                                           | Role                                                                    |
| ---------------------------------------------- | ----------------------------------------------------------------------- |
| `apps/site/src/app/[locale]/page.tsx`          | route: locale check, `buildHomeMetadata`, `HomePage`                    |
| `apps/site/public/assets/home/*.webp`          | photos of the «Імпульс» suit from the Angular storefront                |
| `libs/site/home/feature/src/lib/home-page.tsx` | block order, links, JSON-LD                                             |
| `libs/site/home/ui/src/lib/i18n`               | home text in `uk` and `ru`                                              |
| `libs/site/home/ui/src/lib/layout`             | `HomeSection`: stitch label, `h2`, action link                          |
| `libs/site/home/ui/src/lib/sections`           | one file per block                                                      |
| `libs/site/home/seo/src/lib`                   | home title and description, `FAQPage` builder                           |
| `libs/site/catalog/model/src/lib`              | fixed catalog sections for the mega menu, the footer, and the home page |
| `libs/site/core/i18n/src/lib/site-paths.ts`    | locale-free page paths                                                  |

## Open questions

- Every catalog section and industry card opens the catalog root or the industries hub: category and industry pages do not exist yet.
- Links to `/catalog`, `/logo-printing`, `/about-company`, `/industries`, `/contacts` answer 404 until their steps.
- The photo is the «Імпульс» suit from the Angular storefront; the client's photos on white replace it when they arrive.
