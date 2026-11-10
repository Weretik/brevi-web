# «Договір» page (public offer)

**Status:** implemented and verified locally 2026-11-10.
**Variant:** `nextjs`.
**Source:** [migration plan](../../migration/README.md); design «Строчка»; text of the live `brevi.com.ua` pages `/dogovir` and `/ru/dogovor`.
**Feature card:** [site agreement](../../../../features/site/agreement.md).

## Goal

Build the page at `/uk/agreement` and `/ru/agreement`; the footer already links to it as «Угода користувача».

## Decision on the edition

The offer is carried over clause by clause. Owner's decision of 2026-11-10: the new site takes no orders through a cart and no online payment, so the clauses about the «Кошик» form and LiqPay are removed. Old clauses 1.8.1, 1.9.1, 1.9.2 and 6.7 are deleted and the following clauses renumbered (1.8.2–1.8.3 became 1.8.1–1.8.2, 1.9.3 became 1.9.1 and now also names the order form, 6.8–6.11 became 6.7–6.10); clauses 1.4, 5.10.5 and 6.6 lost only the cart and payment-system wording. Payment stays by bank transfer on an invoice. The client's lawyer may still give a new edition.

Two technical corrections only: clause number `4..1.1` reads `4.1.1`; in the Russian version clause 4.3.3, glued to 4.3.2 on the live page, is a separate clause as in the Ukrainian one.

## Scope

- Libraries `site-agreement-ui`, `site-agreement-seo`, `site-agreement-feature`, created with `nx g @nx/react:library`.
- The page in the sitemap.

## Out of scope

- A new edition of the offer.
- The «Завантажити договір» file of the live site: it carries the old phones.
- The old phones of the seller details: by the owner's rule the site shows one phone.
- 301 redirects from the old addresses: done at cutover by the migration plan.

## Rules

| ID     | Rule                                                                                                                  |
| ------ | --------------------------------------------------------------------------------------------------------------------- |
| AG-001 | One `h1`; the preamble, a table of contents, eleven sections as `h2`, then the seller details.                        |
| AG-002 | Clause text equals the live page; both languages have the same sections and clause numbers.                           |
| AG-003 | The table of contents links to every section by an anchor.                                                            |
| AG-004 | Seller details: name, ЄДРПОУ, tax number, postal address, IBAN, bank, the site phone, e-mail. No old phones.          |
| AG-005 | Internal links to «Доставка та оплата», «Повернення та обмін», and «Контакти».                                        |
| AG-006 | Breadcrumbs are visible and repeated in `BreadcrumbList`.                                                             |
| AG-007 | Title and description per language, canonical, `hreflang`; both languages have the same blocks; no client components. |

## Traceability

| Rule                   | Code                                           | Test                      |
| ---------------------- | ---------------------------------------------- | ------------------------- |
| AG-001, AG-003, AG-006 | `agreement-page.tsx`, `agreement-contents.tsx` | `agreement-page.spec.tsx` |
| AG-002                 | `data/agreement-uk.ts`, `data/agreement-ru.ts` | `agreement-ui.spec.tsx`   |
| AG-004                 | `agreement-requisites.tsx`                     | `agreement-ui.spec.tsx`   |
| AG-005                 | `agreement-page.tsx`                           | `agreement-page.spec.tsx` |
| AG-007                 | `agreement-metadata.ts`                        | `agreement-seo.spec.ts`   |

## Verification (2026-11-10)

Headless Chromium against `next start` of a production build: both URLs prerendered; title «Договір публічної оферти купівлі-продажу — Brevi»; self canonical; one `h1`; `BreadcrumbList` and the layout `Organization`; no horizontal scroll on an iPhone 13 profile; the sitemap has both languages of the page.

## Structure check (2026-11-10)

Short check under the staged structure check in the [delivery rules](../../../../standards/shared/delivery-rules.md).

| Check                       | Result                                                                                      |
| --------------------------- | ------------------------------------------------------------------------------------------- |
| Route is thin               | `agreement/page.tsx` checks the locale and calls the metadata builder and the page.         |
| One responsibility per file | The offer lives in `data/`, labels in the dictionary, one block per section file.           |
| Client code                 | None.                                                                                       |
| No duplicates               | Seller details from `COMPANY`; page header, section frame, and breadcrumbs from shared UI.  |
| Generator leftovers         | Removed sample components, CSS modules, and `.babelrc`; configs match the other site pages. |
