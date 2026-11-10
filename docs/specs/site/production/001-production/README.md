# «Виробництво» page

**Status:** implemented and verified locally 2026-11-10.
**Variant:** `nextjs`.
**Source:** [migration plan](../../migration/README.md); design «Строчка»; text from the live `brevi.com.ua` page «Власне виробництво спецодягу Brevi» (owner's reference screenshot).
**Feature card:** [site production](../../../../features/site/production.md).

## Goal

Build the first content page of the new site at `/uk/about-company` and `/ru/about-company`; the home page and the menu already link to it.

## Scope

- Libraries `site-production-ui`, `site-production-seo`, `site-production-feature`, created with `nx g @nx/react:library`.
- Shared parts for all content pages: `PageSection` (moved from `site-home-ui`, was `HomeSection`) and `Breadcrumbs` in `site-shared-ui`; `buildBreadcrumbJsonLd` in `site-core-seo`.
- The page in the sitemap.

## Out of scope

- Editing the text in the admin (owner decision 2026-11-10: the admin is wired later, per page).
- The illustrations of the live page: they are AI images with a disclaimer. The page shows the «Імпульс» suit photo until the client sends production photos.
- Inline links inside paragraphs: the links of the live text are shown as actions of their blocks.

## Rules

| ID    | Rule                                                                                                                          |
| ----- | ----------------------------------------------------------------------------------------------------------------------------- |
| R-001 | One `h1`; blocks follow the order of the live page: stages, fabric, threads and hardware, branding, order.                    |
| R-002 | Ukrainian text matches the live page; Russian has the same blocks and list lengths.                                           |
| R-003 | Breadcrumbs «Головна / Виробництво» are visible and repeated in `BreadcrumbList`.                                             |
| R-004 | Title and description per language, self canonical, `hreflang` for `uk-UA`, `ru-UA`, `x-default`.                             |
| R-005 | «Обговорити пошиття спецодягу» leads to the home contacts block; the closing block also shows the sales phone from `COMPANY`. |
| R-006 | No client components; no horizontal scroll on a phone.                                                                        |

## Traceability

| Rule         | Code                                               | Test                                                                       |
| ------------ | -------------------------------------------------- | -------------------------------------------------------------------------- |
| R-001, R-003 | `production-page.tsx`, `breadcrumb-json-ld.ts`     | `production-page.spec.tsx`, `json-ld.spec.tsx`                             |
| R-002        | `production-dictionary.ts`                         | `production-ui.spec.tsx`                                                   |
| R-004        | `production-metadata.ts`, `about-company/page.tsx` | `production-seo.spec.ts`, [verification](verification/seo-verification.md) |
| R-005        | `production-hero.tsx`, `production-order.tsx`      | `production-ui.spec.tsx`                                                   |
| R-006        | all files of `site-production-ui`                  | [verification](verification/seo-verification.md)                           |

## Documents

- [SEO verification](verification/seo-verification.md).
- [Structure check](code-audit/audit.md).
