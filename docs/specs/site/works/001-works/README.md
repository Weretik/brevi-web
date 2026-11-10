# «Наші роботи» page

**Status:** implemented and verified locally 2026-11-10.
**Variant:** `nextjs`.
**Source:** [migration plan](../../migration/README.md); design «Строчка»; photos and heading from the live `brevi.com.ua` page «Наші роботи».
**Feature card:** [site works](../../../../features/site/works.md).

## Goal

Build the page at `/uk/our-work` and `/ru/our-work`; the site navigation already links to it.

## Scope

- Libraries `site-works-ui`, `site-works-seo`, `site-works-feature`, created with `nx g @nx/react:library`.
- 82 original gallery photos in `apps/site/public/assets/works/`, each as a large WebP and a thumbnail.
- The page in the sitemap.

## Out of scope

- Managing the gallery in the admin and photo captions (client, garment): wired later, per page.
- A lightbox: the large photo opens in a new tab, so the page needs no client code.

## Rules

| ID    | Rule                                                                                                                 |
| ----- | -------------------------------------------------------------------------------------------------------------------- |
| R-001 | One `h1`; the gallery heading follows the live page.                                                                 |
| R-002 | Every photo of the live gallery is shown once, in the live order.                                                    |
| R-003 | The grid loads thumbnails with explicit width and height; only the first four load eagerly.                          |
| R-004 | Each thumbnail links to its large file in a new tab and has an alt text with its number.                             |
| R-005 | The order block links to the request form anchor and to «Виробництво».                                               |
| R-006 | Breadcrumbs are visible and repeated in `BreadcrumbList`; title and description per language, canonical, `hreflang`. |
| R-007 | No client components; no horizontal scroll on a phone.                                                               |

## Traceability

| Rule         | Code                                  | Test                                       |
| ------------ | ------------------------------------- | ------------------------------------------ |
| R-001, R-006 | `works-page.tsx`, `works-metadata.ts` | `works-page.spec.tsx`, `works-seo.spec.ts` |
| R-002–R-004  | `work-photos.ts`, `works-gallery.tsx` | `works-ui.spec.tsx`                        |
| R-005        | `works-order.tsx`, `works-page.tsx`   | `works-ui.spec.tsx`, `works-page.spec.tsx` |

## Verification (2026-11-10)

`curl` against `next start` of a production build and headless Chromium: both URLs prerendered as static HTML; one `h1`; `BreadcrumbList`; the gallery shows in four columns on a desktop and two on a phone; no horizontal scroll on an iPhone 13 profile.

## Structure check (2026-11-10)

Short check under the staged structure check in the [delivery rules](../../../../standards/shared/delivery-rules.md).

| Check                       | Result                                                                              |
| --------------------------- | ----------------------------------------------------------------------------------- |
| Route is thin               | `our-work/page.tsx` checks the locale and calls `buildWorksMetadata`, `WorksPage`.  |
| One responsibility per file | Photo list in `data/`, text in `i18n/`, one block per file in `sections/`.          |
| Client code                 | None.                                                                               |
| No duplicates               | Page head and section frame come from shared UI; file paths are built in one place. |
| Generator leftovers         | Removed sample components, CSS modules, and `.babelrc`.                             |
