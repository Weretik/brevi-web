# Storefront Runtime: SSR, Routes, and State

**Checked:** 2026-10-15 against `apps/storefront` and `libs/storefront` code.
This describes the existing implementation, not requirements for future
features.

## Composition root and startup

`apps/storefront/src/main.ts` bootstraps Angular in the browser;
`main.server.ts` bootstraps the same `App` with server context. `app.config.ts`
registers the router, HTTP client with Fetch backend, global error handling,
Transloco, PrimeNG, and hydration. `app.config.server.ts` adds server rendering
and rules from `app.routes.server.ts`. The `storefront:build` target in
`apps/storefront/project.json` uses `outputMode: server`: browser files and
the Node server are written to `dist/apps/storefront`.

`apps/storefront/src/server.ts` creates an Express server. It serves static
files from `dist/apps/storefront/browser` and forwards other requests to
`AngularNodeAppEngine`. `PORT` sets the port; the default is `4000`. The
`npm run storefront:start` command runs the built `server/server.mjs`. The
Express server currently has no API endpoint of its own: the code fragment in
the file is commented out as an example.

## SSR, prerender, and hydration

Server routes configure prerendering for `/uk`, `/ru`, and the general `**`
route. `/uk/catalog`, `/ru/catalog`, `/uk/product-page`, and
`/ru/product-page` use `RenderMode.Client`; they should not be described as
server-rendered. Check behavior for a specific URL against route order and
actual build output. Client startup enables event replay, incremental
hydration, and HTTP transfer cache excluding POST requests.

Alongside the Node SSR target, `storefront:build-cloudflare` runs a static
build, and `apps/storefront/public/_worker.js` exists. This is a separate
deployment path; this document does not claim that production uses it.

## Routes and localization

`app.routes.ts` redirects `/` to `/uk`; `/uk` and `/ru` compose feature routes
from `libs/storefront/feature/*`. An unknown localized path opens the `404`
page; the general wildcard adds the current locale to the URL through
`LocaleNavigationService`. The list of existing Nx libraries is in the
[module map](modules.md).

Transloco supports `uk` and `ru`, with `uk` as the primary and fallback
language. `LocaleNavigationService` determines the current language;
`APP_INITIALIZER` loads translations before rendering and synchronizes
PrimeNG text. `TranslocoHttpLoader` reads translations from TypeScript modules
in `apps/storefront/src/app/localization/translations`, not from a network API.

`SeoHreflangService` in `App` updates canonical and hreflang (`uk-UA`,
`ru-UA`, `x-default`) links after navigation. The absolute base URL comes from
`environment.publicSiteUrl`. Check these links when changing the domain,
locale, or route.

## Data, state, and errors

Current feature pages use Angular signals and local component state; for
example, the catalog uses `signal`/`computed` for UI items. The presence of
`libs/storefront/data-access` does not mean that the catalog already fetches
products from the backend: current Storefront code has no `HttpClient` calls
from feature or data-access. The registered HTTP pipeline and its boundary are
described in [Storefront API](../api/storefront.md).

`provideGlobalErrorHandling()` wires `GlobalErrorHandler` and PrimeNG
`MessageService`. `errorInterceptor` normalizes HTTP failures into
`AppApiError`; after a real request is introduced, the feature must separately
show its loading, empty, and error states. Global handling does not prove that
all UI scenarios already handle errors.

## Change verification

- Routes, i18n, SEO: check localized URLs, redirects, canonical, and hreflang in the browser and after a server build.
- SSR/hydration: run `npx nx build storefront`, then `npm run storefront:start`; check responses for prerender/client routes and hydration in the browser.
- API: check configuration and the actual consumer against [Storefront API](../api/storefront.md); do not record a passing HTTP test without an executable consumer and test.
- Before running `nx test storefront`, inspect its target with `npx nx show project storefront --json`: as of this check, there is no separate test target.

General verification rules are in the
[testing rules](../../standards/shared/testing-rules.md).
