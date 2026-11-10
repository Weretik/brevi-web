# «Сертифікати» page

**Status:** implemented and verified locally 2026-11-10.
**Variant:** `nextjs`.
**Source:** [migration plan](../../migration/README.md); design «Строчка»; text and scans from the live `brevi.com.ua` page «Сертифікати» (Ukrainian and Russian versions).
**Feature card:** [site certificates](../../../../features/site/certificates.md).

## Goal

Build the page at `/uk/certificates` and `/ru/certificates`; the footer already links to it.

## Scope

- Libraries `site-certificates-ui`, `site-certificates-seo`, `site-certificates-feature`, created with `nx g @nx/react:library`.
- Eight scans in `apps/site/public/assets/certificates/`, each as a full WebP and a thumbnail, and the conformity mark.
- The page in the sitemap.

## Out of scope

- Managing the documents in the admin: wired later, per page.
- Validity dates on the page. The live scans of the type examination certificates show a term until 22 October 2021; the owner decided on 2026-11-10 to keep these scans for now; current scans later replace the files under the same names.

## Rules

| ID    | Rule                                                                                                                 |
| ----- | -------------------------------------------------------------------------------------------------------------------- |
| R-001 | One `h1`; the lead keeps the meaning of the live page intro.                                                         |
| R-002 | The eight documents of the live page are shown once, in the live order, with the standards the live page names.      |
| R-003 | Each card links its thumbnail to the full scan in a new tab; the image has explicit width and height and an alt.     |
| R-004 | The closing block says certified copies are given on request and links to «Контакти».                                |
| R-005 | Breadcrumbs are visible and repeated in `BreadcrumbList`; title and description per language, canonical, `hreflang`. |
| R-006 | Ukrainian and Russian have the same keys; no client components; no horizontal scroll on a phone.                     |

## Traceability

| Rule         | Code                                                     | Test                                                     |
| ------------ | -------------------------------------------------------- | -------------------------------------------------------- |
| R-001, R-005 | `certificates-page.tsx`, `certificates-metadata.ts`      | `certificates-page.spec.tsx`, `certificates-seo.spec.ts` |
| R-002, R-003 | `certificate-documents.ts`, `certificates-documents.tsx` | `certificates-ui.spec.tsx`                               |
| R-004        | `certificates-copies.tsx`, `certificates-page.tsx`       | `certificates-ui.spec.tsx`, `certificates-page.spec.tsx` |
| R-006        | `certificates-dictionary.ts`                             | `certificates-ui.spec.tsx`                               |

## Verification (2026-11-10)

`curl` against `next start` of a production build and headless Chromium: both URLs prerendered as static HTML; title «Сертифікати на робочий одяг — Brevi»; one `h1`; `BreadcrumbList`; the page is in the sitemap; no horizontal scroll on an iPhone 13 profile.

## Structure check (2026-11-10)

Short check under the staged structure check in the [delivery rules](../../../../standards/shared/delivery-rules.md).

| Check                       | Result                                                                                           |
| --------------------------- | ------------------------------------------------------------------------------------------------ |
| Route is thin               | `certificates/page.tsx` checks the locale and calls `buildCertificatesMetadata`, the page.       |
| One responsibility per file | Document list in `data/`, text in `i18n/`, one block per file in `sections/`.                    |
| Client code                 | None.                                                                                            |
| No duplicates               | Standards lists are shared constants; names come from kind and scope, not from eight text items. |
| Generator leftovers         | Removed sample components, CSS modules, and `.babelrc`.                                          |
