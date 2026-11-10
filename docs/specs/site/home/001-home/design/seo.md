# SEO design: home page

| Item       | `/uk`                                                 | `/ru`                                                   |
| ---------- | ----------------------------------------------------- | ------------------------------------------------------- |
| Title      | `Пошиття спецодягу з логотипом від виробника — Brevi` | `Пошив спецодежды с логотипом от производителя — Brevi` |
| `h1`       | `Шиємо спецодяг з логотипом вашої компанії`           | `Шьём спецодежду с логотипом вашей компании`            |
| Canonical  | `/uk`                                                 | `/ru`                                                   |
| `hreflang` | `uk-UA`, `ru-UA`, `x-default` → `/uk`                 | the same set                                            |
| Indexing   | `index, follow` only in production with indexing on   | the same                                                |

- The home route shares its segment with the root layout, so the title template is not applied; the title carries the brand itself.
- Headings: one `h1`; each block has an `h2`; steps, SEO sub-blocks, and the request list use `h3`.
- Structured data on the page: `WebSite`, `LocalBusiness`, `FAQPage`. `Organization` stays in the layout. `FAQPage` is built from the same dictionary entries the page shows, so the markup cannot differ from the visible text.
- No `Product` or `Offer` markup: the page shows no prices.
- Rendering: static, prerendered at build time; no client components in the home libraries.
- Images: `next/image`; the first-screen photo has `priority`, the second loads lazily. Alt text is in the dictionary.
- Internal links: catalog, logo printing, production, industries, contacts. Their pages are built in later steps.
