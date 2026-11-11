export { buildRobotsFile, PRIVATE_PATHS } from './lib/crawling/robots-file';
export { buildSitemapEntries } from './lib/crawling/sitemap-entries';
export type { SitemapPage } from './lib/crawling/sitemap-entries';
export { buildBreadcrumbJsonLd } from './lib/json-ld/breadcrumb-json-ld';
export { buildFaqPageJsonLd } from './lib/json-ld/faq-json-ld';
export { JsonLd, serializeJsonLd } from './lib/json-ld/json-ld';
export type { JsonLdData } from './lib/json-ld/json-ld';
export {
  buildLocalBusinessJsonLd,
  buildOrganizationJsonLd,
  buildWebSiteJsonLd,
} from './lib/json-ld/site-json-ld';
export { buildCanonicalPath, buildLanguageAlternates } from './lib/metadata/alternates';
export { buildPageMetadata, buildRootMetadata } from './lib/metadata/page-metadata';
export type { PageMetadataInput } from './lib/metadata/page-metadata';
export { buildRobotsMeta } from './lib/metadata/robots-policy';
export { SiteAnalytics } from './lib/analytics/site-analytics';
export {
  analyticsId,
  buildVerificationMetadata,
  tagManagerId,
  withSharePicture,
} from './lib/metadata/site-codes';
export type { SharePicture, SiteCodes } from './lib/metadata/site-codes';
