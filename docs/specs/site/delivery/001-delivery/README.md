# «Доставка та оплата» page

**Status:** implemented and verified locally 2026-11-10.
**Variant:** `nextjs`.
**Source:** [migration plan](../../migration/README.md); design «Строчка»; text from the live `brevi.com.ua` page «Доставка та оплата» (owner's reference screenshot).
**Feature card:** [site delivery](../../../../features/site/delivery.md).

## Goal

Build the content page at `/uk/delivery-and-payment` and `/ru/delivery-and-payment`; the footer already links to it.

## Scope

- Libraries `site-delivery-ui`, `site-delivery-seo`, `site-delivery-feature`, created with `nx g @nx/react:library`.
- `COMPANY.bankDetails` in `site-core-config`.
- The page in the sitemap.

## Out of scope

- Editing the text, the delivery cost, and the bank details in the admin (wired later, per page).
- Online payment by card: the live page mentions it for purchases on the old site; the new site takes requests, so the sentence is left out.

## Rules

| ID    | Rule                                                                                                                            |
| ----- | ------------------------------------------------------------------------------------------------------------------------------- |
| R-001 | One `h1`; blocks follow the live page: delivery, payment, whom to call.                                                         |
| R-002 | Delivery ways and their cost match the live page: post office and address from 70 UAH, pickup in Poltava free, courier 250 UAH. |
| R-003 | The cost footnote is shown under the delivery ways.                                                                             |
| R-004 | Bank details come from `COMPANY.bankDetails`; the recipient and the bank are shown in the page language.                        |
| R-005 | The phones are the current ones from `COMPANY` (050 469 86 75, 0532 67 11 09), not the old number of the live page.             |
| R-006 | Breadcrumbs are visible and repeated in `BreadcrumbList`; title and description per language, self canonical, `hreflang`.       |
| R-007 | Ukrainian and Russian have the same blocks; no client components; no horizontal scroll on a phone.                              |

## Traceability

| Rule                | Code                                             | Test                                             |
| ------------------- | ------------------------------------------------ | ------------------------------------------------ |
| R-001, R-006        | `delivery-page.tsx`, `delivery-metadata.ts`      | `delivery-page.spec.tsx`, `delivery-seo.spec.ts` |
| R-002, R-003, R-007 | `delivery-dictionary.ts`, `delivery-options.tsx` | `delivery-ui.spec.tsx`                           |
| R-004               | `delivery-payment.tsx`, `company.ts`             | `delivery-ui.spec.tsx`                           |
| R-005               | `delivery-contact.tsx`                           | `delivery-ui.spec.tsx`                           |

## Verification (2026-11-10)

`curl` against `next start` of a production build and headless Chromium: both URLs prerendered as static HTML; title «Доставка та оплата спецодягу по Україні — Brevi»; self canonical; `hreflang` `uk-UA`, `ru-UA`, `x-default`; one `h1`; `BreadcrumbList` and the layout `Organization`; both URLs in the sitemap; no horizontal scroll on an iPhone 13 profile.

## Structure check (2026-11-10)

Short check under the staged structure check in the [delivery rules](../../../../standards/shared/delivery-rules.md).

| Check                       | Result                                                                                               |
| --------------------------- | ---------------------------------------------------------------------------------------------------- |
| Route is thin               | `delivery-and-payment/page.tsx` checks the locale and calls `buildDeliveryMetadata`, `DeliveryPage`. |
| One responsibility per file | One block per file in `delivery/ui/src/lib/sections`.                                                |
| Client code                 | None.                                                                                                |
| No dump folders             | `i18n` and `sections` only.                                                                          |
| No duplicates               | `PageSection`, `Breadcrumbs`, and `buildBreadcrumbJsonLd` are reused from step 3.                    |
| Facts in one place          | Phones and bank details only in `COMPANY`; delivery cost only in the dictionary.                     |
| Generator leftovers         | Removed sample components, CSS modules, and `.babelrc`.                                              |

Update (contacts step): the page head moved to `site-shared-ui` as `PageHeader`; «Доставка та оплата» and «Контакти» use it.
