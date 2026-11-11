# «Статті» pages

**Status:** implemented and verified locally 2026-11-10; articles read from the Admin since 2026-11-11 (see «Change 2026-11-11»).
**Variant:** `nextjs`.
**Source:** [migration plan](../../migration/README.md) and its [feature inventory](../../migration/feature-inventory.md) («Статьи»); [SEO architecture](../../../../architecture/site/platform/seo-architecture.md) (`/uk/articles/{slug}`, `Article`); design «Строчка»; the 26 articles of the live `brevi.com.ua` blog in Ukrainian and Russian.
**Feature card:** [site articles](../../../../features/site/articles.md).

## Goal

Build the list at `/uk/articles`, `/ru/articles` and the article page at `/{locale}/articles/{slug}`; the footer already links to the list. The list and the article page ship together: the list has nowhere to lead without the article page.

## Decisions

- **Storage.** The migration plan left storage to this step. The owner wires the admin later, so articles are TypeScript files in `site-articles-model`, one per article with both languages. Moving them to BreviERP changes only where `ARTICLES` comes from.
- **Slug.** One slug for both languages, the Ukrainian one of the live site, as the SEO architecture requires. The 301 map from the old addresses (`/statti/{slug}`, `/ru/{ru-slug}`) belongs to the cutover step.
- **Titles.** The live titles are in capitals and differ between the list and the page; here each article has one title in sentence case.
- **Text.** Taken as is from each language version, including places where the two versions differ. Only spacing and list markers are cleaned. The owner updates outdated articles later.
- **No pagination.** 26 cards fit one page; pagination comes with the admin if the blog grows.

## Scope

- Libraries `site-articles-model` (`nx g @nx/js:library`), `site-articles-ui`, `site-articles-seo`, `site-articles-feature` (`nx g @nx/react:library`).
- Two article pictures in `apps/site/public/assets/articles/`.
- The list and every article in the sitemap.

## Out of scope

- Editing articles in the admin; article categories; links from articles to catalog sections (the catalog is the last step).

## Rules

| ID    | Rule                                                                                                                    |
| ----- | ----------------------------------------------------------------------------------------------------------------------- |
| R-001 | The list shows every article once, newest first, with date, title, and excerpt; the card title is the link.             |
| R-002 | An article page has one `h1` (the title), the date as `time`, and the body as paragraphs, lists, and pictures.          |
| R-003 | Every article exists in `uk` and `ru` under the same slug; an unknown slug returns 404.                                 |
| R-004 | The article page offers the call to order and three other articles, never the article itself.                           |
| R-005 | The list has `BreadcrumbList`; an article has `Article` (headline, date, language, Brevi as publisher) and breadcrumbs. |
| R-006 | Each page has its own title and description (the excerpt, 110–165 characters), a self canonical, and `hreflang`.        |
| R-007 | Ukrainian and Russian frames have the same keys; no client components; no horizontal scroll on a phone.                 |

## Traceability

| Rule         | Code                                                    | Test                                                                  |
| ------------ | ------------------------------------------------------- | --------------------------------------------------------------------- |
| R-001        | `articles.ts`, `article-cards.tsx`, `articles-page.tsx` | `articles.spec.ts`, `articles-ui.spec.tsx`, `articles-pages.spec.tsx` |
| R-002        | `article-page.tsx`, `article-body.tsx`                  | `articles-ui.spec.tsx`, `articles-pages.spec.tsx`                     |
| R-003        | `data/*.ts`, `articles/[slug]/page.tsx`                 | `articles.spec.ts`; 404 checked with `curl`                           |
| R-004        | `article-page.tsx`, `articles-order.tsx`                | `articles-pages.spec.tsx`                                             |
| R-005, R-006 | `articles-metadata.ts`, `article-json-ld.ts`            | `articles-seo.spec.ts`, `articles-pages.spec.tsx`                     |
| R-007        | `articles-dictionary.ts`                                | `articles-ui.spec.tsx`                                                |

## Verification (2026-11-10)

`curl` against `next start` of a production build and headless Chromium: the list and the articles prerendered as static HTML in both languages; an unknown slug answers 404; the article title, self canonical, and `Article` JSON-LD are in the HTML; the sitemap has the list and 26 articles in both languages; no horizontal scroll on an iPhone 13 profile for the list and an article.

## Structure check (2026-11-10)

Short check under the staged structure check in the [delivery rules](../../../../standards/shared/delivery-rules.md).

| Check                       | Result                                                                                         |
| --------------------------- | ---------------------------------------------------------------------------------------------- |
| Routes are thin             | Both routes check the locale (and the slug) and call the SEO builder and the page component.   |
| One responsibility per file | Data in the model library, one article per file; one block per file in `sections/`.            |
| Boundaries                  | SEO stays a `type:util` library: it takes plain values, the feature maps an article to them.   |
| Client code                 | None.                                                                                          |
| No duplicates               | One card component serves the list and «Читайте також»; links are built in `article-links.ts`. |
| Generator leftovers         | Removed sample files, `.babelrc`, the model `package.json` and `vitest.config.mts`.            |

## Change 2026-11-11: articles from the Admin

Stage 4 of BreviERP [CNT-004](https://github.com/Weretik/BreviERP/blob/master/docs/sdd/specs/content/004-articles/README.md). Staff keep articles in «Контент → Статті»; the old-site articles are moved there with their pictures to the CDN. The site now reads them from the public API (`getPublicArticles`, `getPublicArticle`) and the article files, `ARTICLES` and the two pictures in `apps/site/public/assets/articles/` are removed.

| ID    | Rule                                                                                                                                                                              |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R-008 | New library `site-articles-data-access` is the only reader of articles: answers are checked at run time, kept five minutes (a failure one minute) under the tag `articles`.       |
| R-009 | The list shows the articles marked «Показувати на сайті», newest first; a card has the cover when there is one. With no articles or no API the list says they appear later.       |
| R-010 | A new article opens without a rebuild (`dynamicParams`); a hidden or unknown slug is 404. «Читайте також» shows the next three articles and is left out when there are none.      |
| R-011 | An article without Russian texts shows the Ukrainian ones on the Russian page with `lang="uk"`, a canonical to the Ukrainian page and is listed only in Ukrainian in the sitemap. |
| R-012 | Title and description: what staff wrote for search, otherwise the title and the excerpt. Headings, a bold lead, bold and italic of the visual editor are shown.                   |

| Rule         | Code                                                                           | Test                                                                      |
| ------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------- |
| R-008        | `articles/data-access/src/lib/*`                                               | `public-articles.mapper.spec.ts`, `articles-source.spec.ts`               |
| R-009, R-010 | `articles-page.tsx`, `article-page.tsx`, `articles.ts`, `[slug]/page.tsx`      | `articles-pages.spec.tsx`, `articles.spec.ts`                             |
| R-011, R-012 | `article-links.ts`, `articles-metadata.ts`, `article-json-ld.ts`, `sitemap.ts` | `articles-seo.spec.ts`, `articles-pages.spec.tsx`, `articles-ui.spec.tsx` |

Rollout: deploy after BreviERP's public article API and after the owner has run «Перенести зі старого сайту» on «Статті»; until then the list is empty.
