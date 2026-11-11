# «Таблиця розмірів» page

**Status:** stage 1 (page, #138) merged; stage 2 (size panel on the product page) implemented and verified locally 2026-11-11.
**Variant:** `nextjs`.
**Source:** [migration plan](../../migration/README.md); design «Строчка»; data and rules from the live page `brevi.com.ua/ru/tablica-razmerov`, where the charts are two images.
**Feature card:** [site sizes](../../../../features/site/sizes.md).

## Goal

A size page at `/uk/size-chart` and `/ru/size-chart` that is more modern and convenient than the old images: a size finder, the charts as real text tables, and the measuring rules. Stage 2 opens the same help from every product page.

## Scope

- Libraries `site-sizes-ui`, `site-sizes-seo`, `site-sizes-feature`, created with `nx g @nx/react:library`.
- Footer link «Таблиця розмірів» and a sitemap entry.

## Out of scope

- Editing the charts in the Admin: proposed as a later stage.
- Old URL `/ru/tablica-razmerov` redirect: done at cutover by the [migration plan](../../migration/README.md).

## Rules

| ID    | Rule                                                                                                                                                                                          |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R-001 | One `h1`; blocks: finder, tables, measuring rules, call help.                                                                                                                                 |
| R-002 | Charts are `<table>` text, never images; data in one place (`size-chart.ts`) feeds both the finder and the tables.                                                                            |
| R-003 | Finder: chest girth gives the size, height gives the height group, foot length gives the shoe size; decimal comma works.                                                                      |
| R-004 | A value outside a chart shows a call-us message; a gap between ranges (94.5) rounds up; foot length rounds up.                                                                                |
| R-005 | Women's height group 5–6 is «168–179»: the live page prints «168–169», a probable typo (owner to confirm).                                                                                    |
| R-007 | Every product page has a «Таблиця розмірів» button under the buy block; it opens a side panel with the finder and all tables and links to the full page. No navigation away from the product. |
| R-006 | Title and description per language, canonical, `hreflang`, breadcrumbs with `BreadcrumbList`; UA and RU keys match.                                                                           |

## Traceability

| Rule         | Code                                  | Test                                       |
| ------------ | ------------------------------------- | ------------------------------------------ |
| R-001, R-006 | `sizes-page.tsx`, `sizes-metadata.ts` | `sizes-page.spec.tsx`, `sizes-seo.spec.ts` |
| R-002        | `size-chart.ts`, `size-tables.tsx`    | `sizes-ui.spec.tsx`                        |
| R-003, R-004 | `size-chart.ts`, `size-finder.tsx`    | `sizes-ui.spec.tsx`                        |
| R-005        | `size-chart.ts`                       | —                                          |

## Verification (2026-11-11)

Focused tests and lint of the three libraries pass; `site:typecheck` passes. `next dev` with headless Chromium: both viewports render, the finder answers «48–50» for 100 cm; the 1 px horizontal overflow at 390 px is the same on the existing returns page (shell, not this page).

## Structure check (2026-11-11)

| Check                       | Result                                                                                      |
| --------------------------- | ------------------------------------------------------------------------------------------- |
| Route is thin               | `size-chart/page.tsx` checks the locale and calls `buildSizesMetadata`, `SizesPage`.        |
| One responsibility per file | Data and lookup in `size-chart.ts`; finder, tables and steps are separate components.       |
| Client code                 | Only `SizeFinder` (`'use client'`); the rest is Server Components.                          |
| Generator leftovers         | Removed sample components, CSS modules and `.babelrc`; configs match the returns libraries. |

## Stage 2 structure check (2026-11-11)

| Check                       | Result                                                                                                |
| --------------------------- | ----------------------------------------------------------------------------------------------------- |
| One responsibility per file | `SizeChartSheet` only composes the shared `Sheet`, `SizeFinder` and `SizeTables`; no duplicated data. |
| Client code                 | `SizeChartSheet` and `SizeFinder`; the product page stays a Server Component.                         |
| Catalog change              | Three lines in `catalog-product-page.tsx`; no data-access change.                                     |
| Visual                      | Panel checked on 1280 px and 390 px in headless Chromium.                                             |
