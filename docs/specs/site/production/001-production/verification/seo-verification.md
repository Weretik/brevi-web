# SEO verification: «Виробництво» page

**Date:** 2026-11-10. Checked with `curl` against `next start` of a production build and with headless Chromium.

| Check             | Result                                                                                              |
| ----------------- | --------------------------------------------------------------------------------------------------- |
| Rendering         | `/uk/about-company` and `/ru/about-company` are prerendered as static HTML.                         |
| Title             | «Власне виробництво спецодягу в Полтаві — Brevi» (46 characters); the Russian one is 53 characters. |
| Description       | One per language, 110–165 characters.                                                               |
| Canonical         | `https://brevi.com.ua/uk/about-company`, self.                                                      |
| `hreflang`        | `uk-UA`, `ru-UA`, `x-default` (Ukrainian).                                                          |
| Headings          | One `h1`, five `h2`, `h3` inside the stages and hardware blocks.                                    |
| JSON-LD           | `BreadcrumbList` (two items, absolute URLs) and the layout `Organization`.                          |
| Robots            | `noindex, nofollow` outside production, as for every page.                                          |
| Sitemap           | `/uk/about-company` and `/ru/about-company` listed with alternates.                                 |
| Phone (iPhone 13) | No horizontal scroll.                                                                               |
