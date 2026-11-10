# «Галузі» page (industries hub)

**Status:** implemented and verified locally 2026-11-10.
**Variant:** `nextjs`.
**Source:** [migration plan](../../migration/README.md); design «Строчка»; text from the live `brevi.com.ua` page «Спецодяг для підприємств» (`/specodyag-dlya-pidpryyemstv` and `/ru/specodezhda-dlya-predpriyatiy`); the industries list from the home page.
**Feature card:** [site industries](../../../../features/site/industries.md).

## Goal

Build the hub at `/uk/industries` and `/ru/industries`; the header menu, the home page, and the footer already link to it.

## Scope

- Libraries `site-industries-ui`, `site-industries-seo`, `site-industries-feature`, created with `nx g @nx/react:library`.
- `buildFaqPageJsonLd` moved from `site-home-seo` to `site-core-seo`: the hub is its second user.
- The page in the sitemap.

## Out of scope

- Industry landing pages `/industries/{slug}`: the old site has no text per industry; each needs its own unique text from the client.
- The request form of the live page (phone, file upload) and the promise to call back in 15 minutes: the form comes with the «Заявка» page.
- Photos of the «Приклади спецодягу для команд» block: the page links to «Наші роботи» instead.
- 301 redirects from the old addresses: done at cutover by the migration plan.

## Rules

| ID     | Rule                                                                                                                         |
| ------ | ---------------------------------------------------------------------------------------------------------------------------- |
| IN-001 | One `h1`; blocks follow the live page: lead with the terms, industries, how to get a quote, frequent questions, order.       |
| IN-002 | Eight industries with typical garments, the same as on the home page; not links until the industry pages exist.              |
| IN-003 | The text keeps the meaning of the live page: from 5 pieces, three steps to a quote, four questions.                          |
| IN-004 | «Залишити заявку» opens the request page with `nofollow`; the only phone is the site phone; no callback-time promise.        |
| IN-005 | Internal links to the catalog, «Наші роботи», «Пошиття з логотипом», «Ціни для опту», and «Контакти».                        |
| IN-006 | Breadcrumbs are visible and repeated in `BreadcrumbList`; the visible questions are repeated in `FAQPage` in the same order. |
| IN-007 | Title and description per language, canonical, `hreflang`; both languages have the same blocks; no client components.        |

## Traceability

| Rule           | Code                                                   | Test                                              |
| -------------- | ------------------------------------------------------ | ------------------------------------------------- |
| IN-001, IN-006 | `industries-page.tsx`, `faq-json-ld.ts` (core)         | `industries-page.spec.tsx`, `faq-json-ld.spec.ts` |
| IN-002, IN-003 | `industries-dictionary.ts`, `industries-list.tsx`      | `industries-ui.spec.tsx`                          |
| IN-004, IN-005 | `industries-hero.tsx`, `industries-order.tsx`, `-list` | `industries-ui.spec.tsx`, `industries-page.spec`  |
| IN-007         | `industries-metadata.ts`                               | `industries-seo.spec.ts`                          |

## Verification (2026-11-10)

Headless Chromium against `next start` of a production build: both URLs prerendered; title «Спецодяг для підприємств — пошиття та брендування — Brevi»; self canonical; one `h1`; `BreadcrumbList`, `FAQPage`, and the layout `Organization`; no horizontal scroll on an iPhone 13 profile; the sitemap has both languages of the page.

## Structure check (2026-11-10)

Short check under the staged structure check in the [delivery rules](../../../../standards/shared/delivery-rules.md).

| Check                       | Result                                                                                      |
| --------------------------- | ------------------------------------------------------------------------------------------- |
| Route is thin               | `industries/page.tsx` checks the locale and calls the metadata builder and the page.        |
| One responsibility per file | One section per file; the dictionary holds all text; SEO values live in the `seo` library.  |
| Client code                 | None.                                                                                       |
| No duplicates               | `FAQPage` builder shared through `site-core-seo`; section frame and buttons from shared UI. |
| Generator leftovers         | Removed sample components, CSS modules, and `.babelrc`; configs match the other site pages. |
