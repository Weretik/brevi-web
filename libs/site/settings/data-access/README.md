# site-settings-data-access

Site-wide settings and fixed-page texts from «Контент → Налаштування SEO сайту» and «Сторінки сайту»: the BreviERP public answers `/api/public/site-settings` and `/api/public/site-pages`. See the [feature card](../../../../docs/features/site/seo-settings.md).

- `site-settings-loader.ts` — the cached settings (`'use cache'`, tag `site-settings`, five minutes; a failed read one minute, with empty settings) and their shape check.
- `site-pages-loader.ts` — the cached texts of «Сторінки сайту» (`/api/public/site-pages`, tag `site-pages`) and their shape check.
- `page-text-metadata.ts`, `site-metadata.ts` — `withPageText`, `sitePageMetadata` for fixed pages, `withSiteSharePicture` for the rest.

The layout places the codes with `buildVerificationMetadata` and `SiteAnalytics` of `@site/core/seo`; fixed pages take their texts and the sharing picture with `sitePageMetadata`, other pages the picture with `withSiteSharePicture`.

Server only: do not import this library from a client component.

Tests: `npx nx test site-settings-data-access`.
