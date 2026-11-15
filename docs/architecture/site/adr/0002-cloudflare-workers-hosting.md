# ADR-0002: The public site runs on Cloudflare Workers through OpenNext

**Status:** accepted
**Decision date:** 2026-10-30 (owner decision; recorded as an ADR on 2026-11-15)
**Owners:** product owner, frontend
**Applications:** `apps/site`
**Related:** [ADR-0001](0001-nextjs-public-site.md), [hosting](../platform/hosting.md)

## Context

The Next.js site ([ADR-0001](0001-nextjs-public-site.md)) needs a server for rendering, an incremental cache and fast answers in Ukraine. The domains, DNS and the API proxy (`api.brevi.com.ua`) already live on Cloudflare. Vercel would add a second provider and a per-seat cost; Cloud Run would add cold starts in front of every page.

## Options

| Option                                              | Complexity | Performance           | Risks                                          | Evidence                          |
| --------------------------------------------------- | ---------- | --------------------- | ---------------------------------------------- | --------------------------------- |
| Vercel                                              | low        | very good             | another provider and billing                   | —                                 |
| Cloud Run container                                 | medium     | cold starts           | slower first byte                              | —                                 |
| Cloudflare Workers through `@opennextjs/cloudflare` | medium     | edge, KV-backed cache | adapter limits, Workers Paid plan for CPU time | [hosting](../platform/hosting.md) |

## Decision and reason

- The site is a separate Worker `brevi-site`, built and deployed by Cloudflare Workers Builds from this repository (`npx nx run site:build-cloudflare`, `site:deploy-cloudflare`).
- Prerendered pages and `'use cache'` data use a persistent incremental cache on Workers.
- `brevi.com.ua` moves to the Worker only at the cutover of the migration plan.

## Consequences and verification

- One provider for DNS, proxy and site; the site is close to readers.
- The Workers Paid plan is required (the free plan's 10 ms CPU is below one render); adapter quirks are documented in [hosting](../platform/hosting.md).
- The build reads the live API, so a build without API access fails.
