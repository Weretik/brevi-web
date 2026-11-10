# SEO verification: home page

**Date:** 2026-11-10. `npx nx build site`, then `next start` on `localhost:4310` with no `SITE_ENV` (development), checked with `curl` and headless Chromium.

| Check              | `/uk`                                                                 | `/ru`                                                                   |
| ------------------ | --------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Status             | 200, prerendered                                                      | 200, prerendered                                                        |
| `<title>`          | `Пошиття спецодягу з логотипом від виробника — Brevi` (51 characters) | `Пошив спецодежды с логотипом от производителя — Brevi` (53 characters) |
| Description        | 145 characters                                                        | 152 characters                                                          |
| Robots meta        | `noindex, nofollow` (indexing is off outside production)              | the same                                                                |
| Canonical          | `https://brevi.com.ua/uk`                                             | `https://brevi.com.ua/ru`                                               |
| `hreflang`         | `uk-UA`, `ru-UA`, `x-default`                                         | the same                                                                |
| `h1`               | one                                                                   | one                                                                     |
| JSON-LD            | `WebSite`, `LocalBusiness`, `FAQPage`, `Organization` (layout)        | the same                                                                |
| FAQ in HTML        | five `<details>` with answers                                         | the same                                                                |
| Image alt text     | both photos have alt text in the page language                        | the same                                                                |
| Phone, 390 px wide | no horizontal scroll                                                  | not rechecked: same layout                                              |

Not checked here: Rich Results Test and Core Web Vitals on the deployed preview; the cloud environment cannot reach `*.workers.dev`.
