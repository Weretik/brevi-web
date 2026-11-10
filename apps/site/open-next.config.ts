import { defineCloudflareConfig } from '@opennextjs/cloudflare';
import staticAssetsIncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache';

// Cloudflare Workers adapter (owner decision 2026-10-30).
// Every page is prerendered at build time and nothing is revalidated yet, so the prerendered pages are read from
// the Worker's static assets. Pages with BreviERP data need a writable cache (Workers KV) before they ship.
const config = defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
  enableCacheInterception: true,
});

// apps/site has no package.json: OpenNext starts in the workspace root, and next.config.ts must be loaded from its own folder.
config.buildCommand = 'cd apps/site && npx next build';

export default config;
