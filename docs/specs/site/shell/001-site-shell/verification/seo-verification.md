# SEO verification: site shell

**Date:** 2026-11-10. `npx nx build site`, then `next start` on `localhost:4310` with no `SITE_ENV` (development), checked with `curl`.

## Status codes

| Request                                          | Answer      |
| ------------------------------------------------ | ----------- |
| `/`                                              | 308 → `/uk` |
| `/uk`, `/ru`                                     | 200         |
| `/uk/`                                           | 308 → `/uk` |
| `/uk/contacts` (page of a later step), `/uk/a/b` | 404         |
| `/en`, `/foo/bar`                                | 404         |
| `/robots.txt`, `/sitemap.xml`                    | 200         |

## `/uk` HTML

| Check                             | Value                                                                 |
| --------------------------------- | --------------------------------------------------------------------- |
| `<html lang>`                     | `uk-UA`                                                               |
| `<title>`                         | `Пошиття спецодягу з логотипом від виробника — Brevi` (51 characters) |
| description                       | present, 145 characters                                               |
| robots meta                       | `noindex, nofollow` (indexing is off outside production)              |
| canonical                         | `https://brevi.com.ua/uk`                                             |
| `hreflang`                        | `uk-UA` → `/uk`, `ru-UA` → `/ru`, `x-default` → `/uk`                 |
| `<h1>`                            | one: «Шиємо спецодяг з логотипом вашої компанії»                      |
| JSON-LD                           | `Organization` (layout), `WebSite`, `LocalBusiness` (home)            |
| `href="#"`                        | none                                                                  |
| catalog links in the initial HTML | 40 `<a href="/uk/catalog">` (mega menu and footer)                    |

## Crawling files

- `robots.txt`: `User-Agent: *`, `Disallow: /`.
- `sitemap.xml`: `/uk` and `/ru`, each with `xhtml:link` alternates for `uk-UA` and `ru-UA`.
- The production variant (`allow /`, disallow `/api/`, `/uk/request`, `/ru/request`, `/*?*sort=`, `Sitemap:` line) is covered by `crawling.spec.ts`.

## Build route table

```text
┌ ○ /_not-found
├   /[locale]
│ ├ ● /uk
│ └ ● /ru
├ ƒ /[locale]/[...rest]
├ ○ /apple-icon.png
├ ○ /manifest.webmanifest
├ ○ /robots.txt
└ ○ /sitemap.xml
ƒ Proxy (Middleware)
```

## Visual check

Headless Chromium screenshots at 1440, 1100, and 390 px: `/uk`, the open mega menu, `/ru`, the framed 404, the bare 404, the phone layout, and the open side menu. No horizontal scroll at 390 px.

## Automated checks

`npm run test:site`, `npm run lint:site`, `npx nx run site:typecheck`, `npx nx build site`: all pass.
