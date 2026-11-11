# Hosting — site

**Checked:** 2026-11-10
**Sources:** `apps/site/open-next.config.mjs`, `apps/site/wrangler.jsonc`, `apps/site/project.json`, `libs/site/core/config/src/lib/site-config.ts`

The public site runs on Cloudflare Workers through the OpenNext adapter (`@opennextjs/cloudflare`, owner decision 2026-10-30). It is a separate Worker, `brevi-site`, with a `*.workers.dev` preview address. `brevi.com.ua` stays on the old site until the domain cutover in the [migration plan](../../../specs/site/migration/README.md).

## Build and deploy

| Target                               | Command (cwd `apps/site`)       | Use                                                                     |
| ------------------------------------ | ------------------------------- | ----------------------------------------------------------------------- |
| `npx nx run site:build-cloudflare`   | `opennextjs-cloudflare build`   | `next build` in standalone mode, then the Worker bundle in `.open-next` |
| `npx nx run site:preview-cloudflare` | `opennextjs-cloudflare preview` | fills the cache and runs the bundle in the local Workers runtime        |
| `npx nx run site:deploy-cloudflare`  | `opennextjs-cloudflare deploy`  | fills the cache with the prerendered pages and deploys the Worker       |

- Cloudflare Workers Builds connects to `Weretik/brevi-web`: root directory empty (workspace root), build command `npx nx run site:build-cloudflare`, deploy command `npx nx run site:deploy-cloudflare`. Node comes from `.nvmrc`.
- `apps/site` has no `package.json`, so `open-next.config.mjs` sets `buildCommand` to run `next build` from `apps/site`.
- `wrangler dev` straight after `build-cloudflare` serves pages without the cache (each request renders and logs a read-only cache error); use the preview target.

## Cache

The catalog comes from the BreviERP Admin and must refresh without a rebuild (owner decision 2026-11-11), so the cache is writable, as on the Kedr site:

| Part              | Override               | Binding             | KV namespace (created 2026-11-11)                     |
| ----------------- | ---------------------- | ------------------- | ----------------------------------------------------- |
| Incremental cache | `kv-incremental-cache` | `NEXT_INC_CACHE_KV` | `brevi-site-cache` `1ee61412f2994778b64f0105fe6a813b` |
| Tag cache         | `kv-next-tag-cache`    | `NEXT_TAG_CACHE_KV` | `brevi-site-tags` `5740cb20ed0f4919bae73d034d937214`  |
| Revalidation      | `memory-queue`         | —                   | —                                                     |

- `deploy` writes the prerendered pages into `brevi-site-cache`, so the deploy token needs write access to Workers KV.
- `next.config.mjs` has `experimental.useCache: true`; loaders in `site-catalog-data-access` cache API answers with `'use cache'`, `cacheTag('catalog')`, and `cacheLife` (five minutes; one minute after a failed read). Every page includes the catalog menu, so every page is revalidated on that schedule.
- Cache Components stay off: on the Kedr site their runtime prerender hung on Workers.
- The build reads the API too. When it is unreachable during a build, the pages are built with an empty catalog and fill in on the first revalidation.
- Rendering a page on demand may exceed the 10 ms CPU limit of the free Workers plan (error 1102); the fix is the Workers Paid plan.

## Images

`next/image` uses the `IMAGES` binding (Cloudflare Images transformations; the free plan includes 5,000 unique transformations a month).

## Environment

| Variable        | Where             | Preview                            | Production after cutover |
| --------------- | ----------------- | ---------------------------------- | ------------------------ |
| `SITE_URL`      | build and runtime | default `https://brevi.com.ua`     | same                     |
| `BREVI_API_URL` | build and runtime | default `https://api.brevi.com.ua` | same                     |
| `SITE_ENV`      | build and runtime | unset (development, `noindex`)     | `production`             |
| `SITE_INDEXING` | build and runtime | unset                              | `true`                   |

`robots.txt` and the pages are built once, so indexing variables must be set for the build as well as for the runtime (in the dashboard: both «Builds → Variables and secrets» and «Runtime variables and secrets»). `wrangler.jsonc` has `keep_vars: true`, so a deploy keeps variables set in the dashboard.

`wrangler.jsonc` sets `keep_names: false`: with esbuild keepNames on, functions serialized into an inline `<script>` fail in the browser with `__name is not defined`.

## Plan limits

The Workers free plan gives 10 ms of CPU per request. Prerendered pages served from the cache fit; a page rendered on request (the framed 404, later pages with live data) can exceed it and answer Error 1102. The Kedr site needed Workers Paid for this reason.
