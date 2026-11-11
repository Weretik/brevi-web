# site-settings-data-access

Site-wide settings from «Контент → Налаштування SEO сайту»: the BreviERP public answer `/api/public/site-settings`. See the [feature card](../../../../docs/features/site/seo-settings.md).

- `site-settings-loader.ts` — the cached settings (`'use cache'`, tag `site-settings`, five minutes; a failed read one minute, with empty settings) and their shape check.

The layout places the codes with `buildVerificationMetadata` and `SiteAnalytics` of `@site/core/seo`; pages add the sharing picture with `withSharePicture`.

Server only: do not import this library from a client component.

Tests: `npx nx test site-settings-data-access`.
