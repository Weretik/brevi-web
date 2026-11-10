# Site shell: layout, header, footer (migration step 1)

**Status:** implemented and verified locally 2026-11-10. Not deployed: the preview on Cloudflare is migration step 0.
**Variant:** `nextjs`.
**Source:** [migration plan](../../migration/README.md), step 1; design «Строчка» in the [design system](../../../../standards/site/design-system.md) and the [idea](../../../../ideas/storefront-nextjs/README.md).
**Feature card:** [site shell](../../../../features/site/shell.md).

## Goal

Create the public Next.js application `apps/site` with the frame every page uses: the top line, the header with the catalog mega menu, the footer, both languages, the SEO base, and a real 404. Pages are added one at a time in the following steps.

## Scope

- `apps/site` (Next.js App Router) and the libraries `site-core-config`, `site-core-i18n`, `site-core-seo`, `site-core-shell`, `site-shared-ui`, created with Nx generators.
- Tokens and fonts of «Строчка» (Manrope, IBM Plex Mono), light theme only.
- Header and footer by the mockup, with the pages of the Angular storefront.
- `/uk` and `/ru`; `/` → 308 to `/uk`; 404 for everything else.
- Metadata, canonical, `hreflang`, robots, sitemap, `Organization`, `WebSite`, `LocalBusiness`.
- A temporary first screen at `/uk` and `/ru` (heading and phone) until the home step.

## Out of scope

- Home blocks, catalog, product, request, and content pages: their own steps.
- Data from BreviERP: nothing in this step reads the API, so `site-shared-api-client` is created with the first consumer.
- Site search and the request counter in the header: they arrive with the catalog and request steps.
- Cloudflare hosting (step 0) and the redirect map from old URLs (step 9).

## Owner decisions

- Languages are Ukrainian and Russian, Ukrainian by default (owner, 2026-11-10; confirms the plan of 2026-10-30).
- Admin wiring (contacts, SEO fields) comes after the pages are ready; until then company facts live in `site-core-config`.
- The catalog gets a quick solution later; the mega menu uses the sections of the Angular storefront menu.

## Documents

- [Behavior](requirements/behavior.md): rules `R-*` and scenarios `SC-*`.
- [SEO design](design/seo.md).
- [Traceability](traceability.md).
- [SEO verification](verification/seo-verification.md).
- [Structure check](code-audit/audit.md).

## File-role map

| Path                                                                       | Role                                                                           |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `apps/site/src/app/[locale]/layout.tsx`                                    | root layout: `<html lang>`, fonts, `SiteShell`, `Organization` JSON-LD         |
| `apps/site/src/app/[locale]/page.tsx`                                      | temporary first screen, home metadata, `WebSite` and `LocalBusiness`           |
| `apps/site/src/app/[locale]/[...rest]/page.tsx`                            | unknown paths under a locale → framed 404                                      |
| `apps/site/src/app/[locale]/not-found.tsx`, `error.tsx`                    | 404 and 500 inside the frame                                                   |
| `apps/site/src/app/global-not-found.tsx`                                   | 404 document for paths without a locale                                        |
| `apps/site/src/app/{robots,sitemap,manifest}.ts`, `fonts.ts`, `global.css` | crawling files, fonts, design tokens                                           |
| `apps/site/src/proxy.ts`, `next.config.ts`                                 | 404 for non-locale paths; `/` → `/uk`                                          |
| `libs/site/core/config`                                                    | `siteConfig` from the environment, `COMPANY` facts                             |
| `libs/site/core/i18n`                                                      | locales, language tags, localized paths                                        |
| `libs/site/core/seo`                                                       | metadata, alternates, robots, sitemap, JSON-LD builders, `JsonLd`              |
| `libs/site/core/shell`                                                     | `SiteShell`, header, footer, mobile menu, language switch, 404 and error views |
| `libs/site/shared/ui`                                                      | `Button`, `Sheet`, `StitchLabel`, `cn`                                         |

## Open questions

- `[NEEDS CLARIFICATION: working hours — the mockup shows «Пн–Пт 9:00–18:00»; asked the owner 2026-11-10]`. The value is in `COMPANY.openingHours`.
- `[NEEDS CLARIFICATION: links to Facebook, Instagram, YouTube]`. Social icons and `sameAs` are added when the links are known.
- Category slugs do not exist yet, so every mega menu and footer catalog entry opens `/{locale}/catalog`, as in the Angular storefront. The catalog step replaces them with the BreviERP tree.
- Header and footer link to pages that later steps build (`/contacts`, `/order-in-bulk`, and others). Until then they answer 404 inside the frame.
