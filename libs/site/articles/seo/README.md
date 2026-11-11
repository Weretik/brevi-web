# site-articles-seo

SEO values of the «Статті» pages. See the [feature card](../../../../docs/features/site/articles.md).

- `buildArticlesMetadata` — the list page.
- `buildArticleMetadata`, `buildArticleJsonLd` — one article, from an `ArticleSeoInput`; a page with texts of the other language gets the canonical of that language.
- `articlePath` — `/articles/<slug>`.

Tests: `npx nx test site-articles-seo`.
