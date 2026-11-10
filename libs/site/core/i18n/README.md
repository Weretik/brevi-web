# site-core-i18n

Locales and localized paths of `apps/site`: `uk` (default) and `ru`.

- `LOCALES`, `DEFAULT_LOCALE`, `LOCALE_LANGUAGE_TAGS`, `OPEN_GRAPH_LOCALES`, `isLocale`.
- `localizedPath`, `localizedPaths`, `stripLocale`, `switchLocalePath` — `/uk/...` builders without a trailing slash.

Adding a language also needs the `matcher` in `apps/site/src/proxy.ts` and every dictionary.

Tests: `npx nx test site-core-i18n`.
