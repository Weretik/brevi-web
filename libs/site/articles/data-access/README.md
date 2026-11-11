# site-articles-data-access

The only reader of articles: the BreviERP public article API. See the [feature card](../../../../docs/features/site/articles.md).

- `articles-source.ts` — what pages call: `getArticles`, `getArticle`, `getArticleAddresses`. An unavailable API gives an empty list, never an error.
- `articles-loaders.ts` — cached reads (`'use cache'`, tag and lifetimes in `articles-cache.ts`).
- `mappers/public-articles.mapper.ts` — checks every answer at run time and maps it to the types of `site-articles-model`.

Server only: do not import this library from a client component.

Tests: `npx nx test site-articles-data-access`.
