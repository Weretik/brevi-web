# City pages: final code audit

**Date:** 2026-11-20. **Scope:** `libs/site/cities/{model,ui,seo,feature}`, `apps/site/src/app/[locale]/{sewing,workwear}/[city]/page.tsx`, the sitemap, the catalog menu and phone sheet of `site-core-shell`, `catalog/model` `catalogSectionPath`, the «Регіони» city links. Checks run: lint, typecheck and tests of the touched projects and `site`, `npm run architecture:structure` (0 deviations), `npm run docs:check`, browser check of SC-01, SC-02, SC-03, SC-05, SC-06 at 1280 px and 360 px against a mock API.

## Step 0: quality targets

The site has no numeric targets: [SEO architecture](../../../../../architecture/site/platform/seo-architecture.md) only says to watch Core Web Vitals from CrUX, and there are no current values (the site is not deployed). Proposed, to confirm: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1 at the 75th percentile of phone visits, measured in Search Console (CrUX) once the domain serves the new site. No speed verdict is given. The city pages are prerendered for the 13 cities and add only the cached catalog products that the home page already reads.

## Checked

- Boundaries: `site-cities-*` carry `scope:site, domain:cities, type:{model,ui,util,feature}`; `depConstraints` pass (lint). The shell gets the city sections as data from the layout and imports no city library at run time (only its spec does).
- Thin routes: each route checks the locale and the city, reads products, and renders the feature; unknown slugs follow «Переадресації» or 404 (SC-05: 404).
- Server/client: all city blocks are Server Components; the only client part is the existing `CatalogProductCarousel`.
- Folders and size: largest code file 98 lines; text data files ≤ 169 lines; every folder ≤ 6 production files.
- Tests first: specs for model (texts, list, products), UI, SEO, feature, shell menu, «Регіони».
- Mutations: none new; «Купити» and «Залишити заявку» reuse the request window with its `requestId` (SC-02 prefilled the model).
- ADR: no new app, framework, hosting, state or transport approach; none needed.
- Feature card, feature map, site architecture list, SEO URL table, library READMEs: updated.

## Findings

| ID    | Severity | Status   | Where                                                         | Finding                                                                                                | Action                                                                  |
| ----- | -------- | -------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------- |
| AF-01 | medium   | open     | `docs/architecture/site/platform/seo-architecture.md:115`     | No numeric Core Web Vitals targets or current values for the public site (pre-existing, whole site).   | Owner confirms the proposed targets; record them with the hosting docs. |
| AF-02 | low      | accepted | SDD «Non-functional»                                          | SC-01 and SC-02 are proved by the manual browser check only, no E2E suite (as the SDD decided).        | Add to `stack-e2e` when the site gets its first E2E suite.              |
| AF-03 | low      | accepted | `libs/site/regions/ui/src/lib/sections/regions-cities.tsx:26` | «Регіони» matches a city to its pages by the displayed name; a renamed city would silently lose links. | Guarded by the spec that expects 26 links; keep the names in step.      |
| AF-04 | low      | open     | `docs/features/site/city-pages-redirects.md`                  | The 26 old addresses 404 on the new site until staff add the rows in «Контент → Переадресації».        | Owner/staff after the merge (SDD open question 3).                      |

No open finding blocks the delivery of this feature; AF-01 and AF-04 need the owner.
