# ADR-0001: Next.js App Router for the public Brevi site

**Status:** accepted
**Decision date:** 2026-10-30
**Owners:** product owner, frontend
**Applications:** new `apps/site`, rebuilt from the Brevi storefront `apps/storefront` (Angular), which is removed after cutover. At cutover it also takes over the domain `brevi.com.ua` from the old OpenCart site.
**Related:** [design idea](../../../ideas/storefront-nextjs/README.md), [migration plan](../../../specs/site/migration/README.md), [SEO architecture](../platform/seo-architecture.md)

## Context

The live site `brevi.com.ua` runs on OpenCart. It is indexed and ranks for workwear queries:

- The Ukrainian pages are at the root and the Russian pages are under `/ru/`, with a separate slug for each language.
- It has category and product pages, 26 regional landings, and long SEO texts.

It also has SEO defects:

- No `hreflang` and no structured data.
- Titles of about 165 characters, and titles that name the wrong city (Kyiv, while the business is in Poltava).
- Sizes are shown only as images.
- Some products have no meta description.
- Navigation is duplicated, and one menu item uses `href="#"`.

The Angular 21 SSR app `apps/storefront` in this repository is an unfinished rewrite. It is not deployed and has no backend calls. Its catalog and product routes use client rendering, and its URLs (`/uk/catalog`, `/uk/product-page`) were never indexed.

The client approved a new light, technical design «Строчка» on 2026-10-30. The product owner wants the same stack as the Kedr public site, with strong SEO first. Admin already uses React.

## Options

| Option                                         | Complexity     | Apps and boundaries                                      | Performance                                                    | Team familiarity                                          | Risks                                                     | Evidence                                                          |
| ---------------------------------------------- | -------------- | -------------------------------------------------------- | -------------------------------------------------------------- | --------------------------------------------------------- | --------------------------------------------------------- | ----------------------------------------------------------------- |
| Finish the Angular storefront, add SSR and SEO | medium–high    | `apps/storefront`                                        | good with SSR; PrimeNG bundle stays                            | Angular only in this app                                  | two UI stacks; the design is rebuilt anyway               | current code, [runtime](../../storefront/runtime.md)              |
| Next.js App Router, new `apps/site`            | high (rebuild) | new app and `libs/site/*`; Angular removed after cutover | Server Components, cached rendering, `next/image`, `next/font` | React shared with Admin; Kedr site as a working reference | backend public API and data move from OpenCart are needed | `nextjs-seo-site` rules, Kedr ADR-0001, owner decision 2026-10-30 |
| Keep OpenCart, restyle the theme               | low            | outside this repository                                  | PHP theme; limited control                                     | none                                                      | keeps current SEO defects; no link to BreviERP            | live site                                                         |

## Decision and reason

Build the public site as a new Next.js App Router application `apps/site` with:

- shadcn/ui on Radix UI, Tailwind CSS v4, and lucide icons.
- Server-rendered, cached pages.
- The BreviERP OpenAPI contract as the only data source, read on the server.

Rebuild the pages of the Brevi storefront and fill them from BreviERP. Use the Kedr URL scheme (`/uk`, `/ru`, slugs from BreviERP), and give every old `brevi.com.ua` URL one 301 to its new page. Host on Cloudflare. Cut over the domain only after every page type exists and the redirect map is complete. One React stack, the Kedr site as a proven reference, and first-class SEO primitives outweigh the cost of the rebuild.

## Consequences and verification

- Simpler: per-route metadata and rendering, a real 404 status, the same patterns as the Kedr site, and one data source (BreviERP).
- Harder: BreviERP needs a public catalog API and SEO fields edited in Admin. Old URLs change, so the redirect map must be complete before cutover. The old site's database is not imported.
- Code: `apps/site`, `libs/site/*`, Nx tags `scope:site` and `scope:site-shared`, the `@nx/next` plugin, CI targets for site tests and build. Projects are created with Nx generators and the shadcn CLI.
- Reversibility: the old site keeps serving the domain until cutover. The switch is a Cloudflare DNS change and can be rolled back the same way.
- Compliance: `@nx/enforce-module-boundaries` rules for `scope:site`, and the SEO checks in the [SEO rules](../../../standards/site/seo-rules.md).

## History

| Date       | Change                                                              | Source                                             |
| ---------- | ------------------------------------------------------------------- | -------------------------------------------------- |
| 2026-10-30 | Client chose design «Строчка» (variant 1); owner accepted the stack | [idea](../../../ideas/storefront-nextjs/README.md) |
