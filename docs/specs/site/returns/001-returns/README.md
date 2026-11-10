# «Повернення та обмін» page

**Status:** implemented and verified locally 2026-11-10.
**Variant:** `nextjs`.
**Source:** [migration plan](../../migration/README.md); design «Строчка»; text from the live `brevi.com.ua` page «Політика повернення та обміну товару» (owner's reference screenshot).
**Feature card:** [site returns](../../../../features/site/returns.md).

## Goal

Build the page at `/uk/returns-exchanges` and `/ru/returns-exchanges`; the footer already links to it.

## Scope

- Libraries `site-returns-ui`, `site-returns-seo`, `site-returns-feature`, created with `nx g @nx/react:library`.
- The page in the sitemap.

## Out of scope

- Editing the policy in the admin with numbered editions (as Kedr documents have): wired later, per page.

## Rules

| ID    | Rule                                                                                                                 |
| ----- | -------------------------------------------------------------------------------------------------------------------- |
| R-001 | One `h1`; the three parts follow the live page: general rules, conditions, exchange instruction.                     |
| R-002 | The Ukrainian text keeps the meaning and the numbers of the live page (14 days, a bit more than 7 working days).     |
| R-003 | The law is linked on `zakon.rada.gov.ua` in a new tab with `nofollow`.                                               |
| R-004 | The instruction steps are numbered 01–03; the block links to «Контакти».                                             |
| R-005 | Breadcrumbs are visible and repeated in `BreadcrumbList`; title and description per language, canonical, `hreflang`. |
| R-006 | Ukrainian and Russian have the same groups and items; no client components; no horizontal scroll on a phone.         |

## Traceability

| Rule         | Code                                      | Test                                           |
| ------------ | ----------------------------------------- | ---------------------------------------------- |
| R-001, R-005 | `returns-page.tsx`, `returns-metadata.ts` | `returns-page.spec.tsx`, `returns-seo.spec.ts` |
| R-002, R-006 | `returns-dictionary.ts`                   | `returns-ui.spec.tsx`                          |
| R-003        | `returns-general.tsx`                     | `returns-ui.spec.tsx`                          |
| R-004        | `returns-groups.tsx`, `returns-page.tsx`  | `returns-ui.spec.tsx`, `returns-page.spec.tsx` |

## Verification (2026-11-10)

`curl` against `next start` of a production build and headless Chromium: both URLs prerendered as static HTML; title «Повернення та обмін спецодягу — Brevi»; self canonical; one `h1`; `BreadcrumbList` and the layout `Organization`; no horizontal scroll on an iPhone 13 profile.

## Structure check (2026-11-10)

Short check under the staged structure check in the [delivery rules](../../../../standards/shared/delivery-rules.md).

| Check                       | Result                                                                                          |
| --------------------------- | ----------------------------------------------------------------------------------------------- |
| Route is thin               | `returns-exchanges/page.tsx` checks the locale and calls `buildReturnsMetadata`, `ReturnsPage`. |
| One responsibility per file | `ReturnsGroups` renders any list of groups; `ReturnsGeneral` adds the law link and the closing. |
| Client code                 | None.                                                                                           |
| No duplicates               | The three parts share one group component; page head and section frame come from shared UI.     |
| Generator leftovers         | Removed sample components, CSS modules, and `.babelrc`.                                         |
