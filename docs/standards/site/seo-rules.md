# SEO rules: site

These are stable rules for every feature of the public Next.js site (`apps/site`). Site-wide decisions live in the [SEO architecture](../../architecture/site/platform/seo-architecture.md). Admin is private: every Admin route is `noindex`, and Admin has no sitemap, structured data, or SEO metadata.

## Required for every public URL change

- The feature SDD uses the `nextjs` variant and includes `design/seo.md` with SEO `R-*` and `SC-*` scenarios.
- Metadata, canonical URLs, alternates, and JSON-LD come from `@site/core/seo` and the domain `seo` library. Route files only call them.
- The main content is in the initial HTML: H1, text, prices, sizes, specs, and FAQ. Indexable content is never fetched only on the client.
- Every indexable page has a unique title (≤ 60 characters) and description in both languages.
- Links are real `<a href>` (Next.js `Link`). That covers menus, filters that lead to indexable landings, and pagination.
- **Every old `brevi.com.ua` URL keeps working** through one permanent redirect from the maintained map, with no chains.
- A new URL type is added to the policy table in the SEO architecture before release.
- Texts reused from the old site are checked by hand: fix typos and mismatches (for example, a spec that contradicts the description) in Admin, not in code.

## Prohibited

- Canonical across languages, or to a page with different content.
- Listing untranslated pages in alternates.
- Status 200 for pages that are not found, empty filter results, or removed products.
- Locale redirects by IP or `Accept-Language`.
- SEO data invented on the frontend when the API should provide it (prices, availability, SKU, dates, SEO texts).
- Prices in JSON-LD that differ from the visible prices.
- Text placed in images: size charts, price tables, and specs.
- Indexing on preview or local environments (`SITE_INDEXING` stays unset outside production).
- Third-party render-blocking assets on indexable pages (icon CDNs, font CSS, chat widgets that load before content).
- `href="#"` in navigation.

## Verification

- Unit tests for URL models (locale paths, trailing slash, pagination), and for the metadata, alternates, robots, sitemap, and JSON-LD builders.
- Rendered-output checks with `curl` against `next start`, recorded in the feature's `verification/seo-verification.md`: status code, `<title>`, description, canonical, `hreflang`, robots meta, and JSON-LD.
- Before cutover: a sample of old URLs (at least 20 per page type from the old sitemap) answers a single 301 to a page that returns 200.
- The `npx nx run site:build` route table matches the rendering choice in the SDD.
