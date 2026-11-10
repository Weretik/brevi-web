# «Пошиття з логотипом» page

**Status:** implemented and verified locally 2026-11-10.
**Variant:** `nextjs`.
**Source:** [migration plan](../../migration/README.md); design «Строчка»; text from the live `brevi.com.ua` pages «Нанесення логотипу на спецодяг (брендування спецодягу)» (`/brenduvannya-specodyagu/nanesennya-logotypu-na-specodyag-brenduvannya-specodyagu/` and its `/ru/` version).
**Feature card:** [site logo printing](../../../../features/site/logo-printing.md).

## Goal

Build the page at `/uk/logo-printing` and `/ru/logo-printing`; the header menu, the catalog menu card, and the footer already link to it.

## Scope

- Libraries `site-logo-printing-ui`, `site-logo-printing-seo`, `site-logo-printing-feature`, created with `nx g @nx/react:library`.
- The page in the sitemap.

## Out of scope

- Photos of branded workwear: the live page has none; added when the client gives them.
- The two neighbouring live category pages («Пошиття корпоративного спецодягу на замовлення», «… з логотипом») and their product lists: decided with the catalog.
- 301 redirects from the old addresses: done at cutover by the migration plan.

## Rules

| ID     | Rule                                                                                                                  |
| ------ | --------------------------------------------------------------------------------------------------------------------- |
| LP-001 | One `h1`; blocks follow the live page: lead, methods, kinds of workwear, custom sewing, how to order.                 |
| LP-002 | The text keeps the meaning and the numbers of the live page: from 5 pieces, 2–4 weeks, delivery across Ukraine.       |
| LP-003 | Three methods (embroidery, heat transfer, screen printing), each with a summary and three advantages.                 |
| LP-004 | «Залишити заявку» opens the request page with `nofollow`; the order block also has the phone, contacts, and delivery. |
| LP-005 | Breadcrumbs are visible and repeated in `BreadcrumbList`; `Service` names the organization as the provider.           |
| LP-006 | Title and description per language, canonical, `hreflang`; both languages have the same blocks; no client components. |

## Traceability

| Rule           | Code                                                    | Test                                                   |
| -------------- | ------------------------------------------------------- | ------------------------------------------------------ |
| LP-001         | `logo-printing-page.tsx`                                | `logo-printing-page.spec.tsx`                          |
| LP-002, LP-003 | `logo-printing-dictionary.ts`, `logo-printing-methods`  | `logo-printing-ui.spec.tsx`                            |
| LP-004         | `logo-printing-hero.tsx`, `logo-printing-order.tsx`     | `logo-printing-ui.spec.tsx`, `logo-printing-page.spec` |
| LP-005, LP-006 | `logo-printing-metadata.ts`, `logo-printing-json-ld.ts` | `logo-printing-seo.spec.ts`, `logo-printing-page.spec` |

## Verification (2026-11-10)

Headless Chromium against `next start` of a production build: both URLs prerendered; title «Нанесення логотипу на спецодяг, брендування — Brevi»; self canonical; one `h1`; `BreadcrumbList`, `Service`, and the layout `Organization`; no horizontal scroll on an iPhone 13 profile; the sitemap has both languages of the page.

## Structure check (2026-11-10)

Short check under the staged structure check in the [delivery rules](../../../../standards/shared/delivery-rules.md).

| Check                       | Result                                                                                      |
| --------------------------- | ------------------------------------------------------------------------------------------- |
| Route is thin               | `logo-printing/page.tsx` checks the locale and calls the metadata builder and the page.     |
| One responsibility per file | One section per file; the dictionary holds all text; SEO values live in the `seo` library.  |
| Client code                 | None.                                                                                       |
| No duplicates               | Section frame, breadcrumbs, and buttons come from shared UI.                                |
| Generator leftovers         | Removed sample components, CSS modules, and `.babelrc`; configs match the other site pages. |
