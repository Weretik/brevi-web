# site-request-ui

Blocks of the «Заявка» page in the «Строчка» design. See the [feature card](../../../../docs/features/site/request.md).

- `i18n/request-dictionary.ts` — page text in `uk` and `ru`, taken from the request form of the live site.
- `sections/` — `RequestIntro` (heading, steps, phone), `RequestForm` (client component: fields, errors, the «could not send» notice), `RequestSent` (confirmation), `RequestFacts` (terms line).

Tests: `npx nx test site-request-ui`.
