# site-articles-ui

Blocks of the «Статті» pages in the «Строчка» design. Server Components only. See the [feature card](../../../../docs/features/site/articles.md).

- `i18n/articles-dictionary.ts` — frame text of the list and the article page in `uk` and `ru`.
- `sections/` — `ArticleCards` (cover, date, title, excerpt), `ArticleBody` (headings, paragraphs, lists, pictures), `ArticleInline` (bold and italic of the Admin texts), `ArticlesOrder` (call to order).

Tests: `npx nx test site-articles-ui`.
