# site-core-shell

Layout frame of `apps/site` in the «Строчка» design. Server Components by default; `'use client'` only in the catalog menu, mobile menu, language switch, menu link, and error view. See the [feature card](../../../../docs/features/site/shell.md).

- `SiteShell` — skip link, top line, sticky header, `<main id="content">`, footer.
- `NotFoundView` — 404 message for the app's `not-found.tsx` and `global-not-found.tsx`; `ErrorView` (client, imported from `@site/core/shell/error`) for `error.tsx`.
- `header/` — `top-line`, `site-header`, `catalog-menu` (mega menu), `header-actions` («Заявка», phone), `mobile-menu`.
- `footer/site-footer.tsx` — catalog, company, and buyer links, contacts.
- `navigation/site-navigation.ts` — `SHELL_PATHS` (the `SITE_PATHS` of `site-core-i18n`) and the menu and footer link lists. Catalog sections come from `site-catalog-model`.
- `i18n/shell-dictionary.ts` — shell text in `uk` and `ru`.

Tests: `npx nx test site-core-shell`.
