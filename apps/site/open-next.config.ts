import { defineCloudflareConfig } from '@opennextjs/cloudflare';
import kvIncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/kv-incremental-cache';
import memoryQueue from '@opennextjs/cloudflare/overrides/queue/memory-queue';
import kvNextTagCache from '@opennextjs/cloudflare/overrides/tag-cache/kv-next-tag-cache';

// Cloudflare Workers adapter (owner decision 2026-10-30).
// The catalog comes from the BreviERP Admin and is refreshed without a rebuild (owner decision 2026-11-11):
// 'use cache' data and prerendered pages live in Workers KV, and the tag cache lets a later revalidation
// request reach every isolate.
const config = defineCloudflareConfig({
  incrementalCache: kvIncrementalCache,
  tagCache: kvNextTagCache,
  queue: memoryQueue,
});

// apps/site has no package.json: OpenNext starts in the workspace root, and next.config.mjs must be loaded from its own folder.
config.buildCommand = 'cd apps/site && npx next build';

export default config;
