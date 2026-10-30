# Site architecture (Next.js public site)

**Code:** `apps/site` and `libs/site/*` (planned; not created yet)
**Status:** target architecture only. The new site is rebuilt from the Angular [Storefront](../storefront/README.md) (unfinished, not deployed) with data from BreviERP. The domain `brevi.com.ua` still serves the old OpenCart site.
**Checked:** 2026-10-30 against the storefront code and the [migration plan](../../specs/site/migration/README.md).

## Purpose and boundary

`site` will be the public, search-indexed Brevi website. Brevi sews workwear in-house in Poltava with a custom logo and resells PPE, and sells mainly wholesale. The site's main action is a call or a request, not an online payment.

- The site replaces the Angular storefront under the [migration plan](../../specs/site/migration/README.md) and takes over `brevi.com.ua`, with a 301 from every old URL.
- It reads only public BreviERP operations, and only on the server.
- Admin stays a private React SPA, and nothing from Admin (RTK Query, MUI, session guards) is reused here. The decision is recorded in [ADR-0001](adr/0001-nextjs-public-site.md).

The structure mirrors the Kedr public site (kedr-web `apps/site`), so its patterns can be copied: thin routes, `core` and `shared` libraries, and domain libraries split by layer.

## Overview

```text
apps/site/src/app (thin routes, metadata exports, robots.ts, sitemap.ts)
  -> libs/site/core/shell  (header, footer, language switch)       -> libs/site/shared/ui (shadcn/ui)
  -> libs/site/core/seo    (metadata, alternates, robots, sitemap, JSON-LD) -> core/config, core/i18n
  -> libs/site/<domain>/{feature,seo,ui,data-access,model}
       data-access -> libs/site/shared/api-client (server-only fetch) -> generated BreviERP contract types
apps/site/src/proxy.ts  (/ -> 308 to /uk, old brevi.com.ua URLs -> 301 by the redirect map, 404 for unknown)
```

Arrows point from the consumer to the dependency.

## Planned projects

| Project                                           | Role                                                                                                                 | Step |
| ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | ---- |
| `site`                                            | Routes, metadata exports, global CSS tokens, fonts, `robots.ts`, `sitemap.ts`, `proxy.ts`                            | 1    |
| `site-core-config`                                | `siteConfig` from the environment, `COMPANY` facts (address, phones, email, hours); the only reader of `process.env` | 1    |
| `site-core-i18n`                                  | Locales `uk` and `ru`, language tags, localized path builders (`/uk`, `/ru` prefixes)                                | 1    |
| `site-core-seo`                                   | Metadata, alternates, robots, sitemap, and JSON-LD builders, plus a `JsonLd` component                               | 1    |
| `site-core-shell`                                 | Header with the catalog mega menu, footer, language switch, request counter                                          | 1    |
| `site-shared-ui`                                  | shadcn/ui primitives in the «Строчка» theme, stitch divider, numbered callouts                                       | 1    |
| `site-shared-api-client`                          | Server-only typed `fetch` over the BreviERP public API                                                               | 1    |
| `site-catalog-{model,data-access,ui,seo,feature}` | Category tree, listings, URL model, price tiers, product cards, Breadcrumb and ItemList JSON-LD                      | 3–4  |
| `site-home-{ui,seo,feature}`                      | Home blocks, price calculator island, home metadata                                                                  | 3    |
| `site-product-{model,data-access,ui,seo,feature}` | Product page, gallery with callouts, size and quantity input, Product JSON-LD                                        | 5    |
| `site-request-{model,ui,feature}`                 | Request list (client island), request form and Server Action                                                         | 6    |
| `site-content-{model,seo,ui,feature}`             | Company, production, certificates, works, reviews, legal pages, articles, landings                                   | 7–8  |

Create every project with `npx nx g @nx/next:application` or `npx nx g @nx/react:library`, and every UI primitive with `npx shadcn@latest add`. Then trim the generator output to the workspace conventions.

## Rendering and data

| Route type                             | Rendering                                                         | Cache tag                                             |
| -------------------------------------- | ----------------------------------------------------------------- | ----------------------------------------------------- |
| Home, category, product, content pages | Server Components, `'use cache'` with `cacheLife`                 | `catalog`, `category:{id}`, `product:{id}`, `content` |
| Category with sort or filter query     | dynamic, `noindex, follow`                                        | —                                                     |
| Request list and form                  | client island and Server Action, `noindex` on `/{locale}/request` | never shared-cached                                   |
| Revalidation                           | `POST /api/revalidate` called by BreviERP with a secret           | by tag                                                |

Data comes only from `libs/site/shared/api-client` and the domain `data-access`. Generated types do not leave `data-access`. Prices, availability, and SEO texts come from the API. The frontend never invents them.

## Where to read more

- [SEO architecture](platform/seo-architecture.md): URL and index policy, locales, structured data, sitemaps, and redirects.
- [ADR-0001](adr/0001-nextjs-public-site.md): why Next.js replaces the Angular storefront.
- Standards: [SEO rules](../../standards/site/seo-rules.md) and [design system](../../standards/site/design-system.md).
- [Migration plan](../../specs/site/migration/README.md) and the [page inventory with SEO analysis](../../specs/site/migration/feature-inventory.md).

## Current and target state

| Area     | Now                                                             | Target                                                               | Source                                                 |
| -------- | --------------------------------------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------ |
| Pages    | `apps/storefront` not deployed; old OpenCart site on the domain | All storefront pages in Next.js; 301 from every old URL              | [Migration plan](../../specs/site/migration/README.md) |
| Indexing | Old site is indexed                                             | Preview never indexed; production indexed after cutover              | [SEO architecture](platform/seo-architecture.md)       |
| Data     | BreviERP has the catalog but no public API                      | Public catalog API in BreviERP, texts and SEO fields edited in Admin | Migration plan, step 2                                 |
| Hosting  | —                                                               | Cloudflare via OpenNext, as Kedr (owner decision 2026-10-30)         | Migration plan, step 0                                 |
