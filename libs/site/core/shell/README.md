# site-core-shell

Layout frame of `apps/site` in the «Строчка» design. Server Components by default; `'use client'` only in the catalog menu, the scrolled-state phone, the mobile bar, language toggle, menu link, and error view. See the [feature card](../../../../docs/features/site/shell.md).

- `SiteShell` — skip link, two-row header, `<main id="content">`, footer, mobile bottom bar.
- `NotFoundView` — 404 message for the app's `not-found.tsx` and `global-not-found.tsx`; `ErrorView` (client, imported from `@site/core/shell/error`) for `error.tsx`.
- `header/` — `site-header` (contacts row and sticky menu row), `catalog-menu` (two-pane menu), `catalog-section-icon`, `show-when-stuck` (phone in the menu row after scrolling).
- `mobile/mobile-bar.tsx` — bottom bar below 1024 px: catalog and menu sheets, «Заявка», call.
- `footer/site-footer.tsx` — call band, catalog, buyer, and company links, contacts, legal line.
- `navigation/site-navigation.ts` — `SHELL_PATHS` (the `SITE_PATHS` of `site-core-i18n`) and the menu and footer link lists. Catalog sections come from `site-catalog-model`.
- `i18n/shell-dictionary.ts` — shell text in `uk` and `ru`.

Tests: `npx nx test site-core-shell`.
