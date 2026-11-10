<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Site (Next.js public site)

New public Brevi site that replaces `apps/storefront` and the old `brevi.com.ua` by the [migration plan](../../docs/specs/site/migration/README.md). Read the [site architecture](../../docs/architecture/site/README.md), the [SEO rules](../../docs/standards/site/seo-rules.md), and the [design system «Строчка»](../../docs/standards/site/design-system.md) before changing it.

- Routes in `src/app` stay thin: read `params`, call a feature, export metadata through `@site/core/seo` or a domain `seo` library.
- Pages are built one at a time; a page that is not built yet answers 404 inside the frame through `[locale]/[...rest]`.
- Texts live in dictionaries of the owning library in `uk` and `ru`; company facts only in `COMPANY` (`@site/core/config`).
- New domain libraries: `npx nx g @nx/react:library libs/site/<domain>/<layer> --name=site-<domain>-<layer> --bundler=none --unitTestRunner=vitest --linter=eslint --importPath=@site/<domain>/<layer> --tags=scope:site,type:<layer>`; then trim the output as in the existing site libraries and add the project to `test:site` and `lint:site` in `package.json`. New UI primitives: `npx shadcn@latest add <component>` from `libs/site/shared/ui`.
- Commands: `npx nx dev site`, `npx nx build site`, `npx nx run site:typecheck`, `npm run test:site`, `npm run lint:site`.
- Indexing stays off unless `SITE_ENV=production` and `SITE_INDEXING=true`.
