# Site code rules

**Applies to:** `apps/site` and `libs/site/**`.

The shared [frontend code organization rules](../shared/code-organization.md) apply in full, including the [public site libraries](../shared/code-organization.md#public-site-libraries-nextjs) folder table, [one responsibility per file](../shared/code-organization.md#one-responsibility-per-file), and [tests](../shared/code-organization.md#tests). Route files, caching, and SEO follow the [site architecture](../../architecture/site/README.md) and the [SEO rules](seo-rules.md). This file adds what is specific to the Site.

## Site specifics

- Libraries are created with `npx nx g @nx/react:library libs/site/<domain>/<layer> --bundler=none --unitTestRunner=vitest` and keep the generator's `src/lib/` level. Tests are `*.spec.ts(x)`.
- A `ui` library of one page keeps its page blocks in `src/lib/sections/`, one file per block, and its UI copy in `src/lib/i18n/`. Static content that is not UI copy (agreement text, size charts, certificate lists, work photos) sits in `src/lib/data/`.
- A library that serves several pages or areas uses one folder per page or block: `libs/site/catalog/ui` has `category/`, `listing/` (with `filters/`), `search/`, `product/`, `text/`, `order/`; `libs/site/catalog/feature` has `root/`, `category/`, `product/`, `search/`.
- UI primitives come from `npx shadcn@latest add <component>` in `libs/site/shared/ui`.

## Known deviations

None: no file under `libs/site/` is in [the structure baseline](../../../tools/architecture/structure-baseline.json), and `npm run architecture:structure` fails on any new one.
