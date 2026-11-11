# site-articles-model

Types and small rules of the articles. See the [feature card](../../../../docs/features/site/articles.md).

- `article.ts` — `ArticleCard` (the list), `Article` (a page with SEO and text), `ArticleBlock` (paragraph, heading, list, image), `ArticlePhoto`.
- `articles.ts` — `formatArticleDate`, `pickMoreArticles` («Читайте також»).

Articles come from the Admin through `site-articles-data-access`.

Tests: `npx nx test site-articles-model`.
