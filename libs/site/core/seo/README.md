# site-core-seo

SEO builders of `apps/site`. Decisions are in the [SEO architecture](../../../../docs/architecture/site/platform/seo-architecture.md).

- `metadata/` — `buildRootMetadata`, `buildPageMetadata`, `buildLanguageAlternates`, `buildCanonicalPath`, `buildRobotsMeta`.
- `crawling/` — `buildRobotsFile`, `buildSitemapEntries`.
- `json-ld/` — `JsonLd`, `buildOrganizationJsonLd`, `buildWebSiteJsonLd`, `buildLocalBusinessJsonLd`, `buildBreadcrumbJsonLd`, `buildFaqPageJsonLd`.

Depends only on `@site/core/config` and `@site/core/i18n`.

Tests: `npx nx test site-core-seo`.
