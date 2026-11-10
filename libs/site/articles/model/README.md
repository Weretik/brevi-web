# site-articles-model

Articles of the Brevi blog as data. See the [feature card](../../../../docs/features/site/articles.md).

- `article.ts` — types `Article` and `ArticleBlock` (paragraph, list, image).
- `data/<slug>.ts` — one file per article with the title, excerpt, and body in `uk` and `ru`.
- `article-files.ts` — the list of article files.
- `articles.ts` — `ARTICLES` (newest first), `findArticle`, `formatArticleDate`.

The articles live in files until the admin gets an article editor.

Tests: `npx nx test site-articles-model`.
