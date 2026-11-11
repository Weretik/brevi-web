# site-redirects-data-access

301 redirects of the site from «Контент → Переадресації»: the BreviERP public list `/api/public/redirects`. See the [feature card](../../../../docs/features/site/redirects.md).

- `redirect-or-not-found.ts` — what a page calls instead of `notFound()`: a permanent redirect for a known old address, otherwise the 404 page.
- `redirects-loader.ts` — the cached list (`'use cache'`, tag `redirects`, five minutes; a failed read one minute) and its shape check.
- `redirect-path.ts` — the address as the Admin keeps it, and the lookup that never leads off the site.

Server only: do not import this library from a client component.

Tests: `npx nx test site-redirects-data-access`.
