# SEO design: site shell

Applies the [SEO architecture](../../../../../architecture/site/platform/seo-architecture.md) and the [SEO rules](../../../../../standards/site/seo-rules.md). Nothing here changes the site-wide policy except the industries hub row added to the URL table.

## URLs introduced by this step

| URL                                                    | Status                  | Index                   | Canonical | Sitemap |
| ------------------------------------------------------ | ----------------------- | ----------------------- | --------- | ------- |
| `/`                                                    | 308 → `/uk`             | —                       | —         | no      |
| `/uk`, `/ru`                                           | 200                     | yes when indexing is on | self      | yes     |
| `/uk/` (trailing slash)                                | 308 → `/uk`             | —                       | —         | no      |
| `/{locale}/{unknown}`                                  | 404, framed             | no                      | —         | no      |
| path without a locale                                  | 404, `global-not-found` | no                      | —         | no      |
| `/robots.txt`, `/sitemap.xml`, `/manifest.webmanifest` | 200                     | —                       | —         | —       |

## Rendering

`/uk` and `/ru` are prerendered at build time (`generateStaticParams`). The shell reads no API. The 404 for unknown locale paths is rendered on demand by `[locale]/[...rest]`.

With `experimental.globalNotFound` Next.js sends the framed 404 as a client-rendered shell: the status is 404 and `noindex` is in the HTML, while the frame appears after hydration. That is acceptable for a page that is never indexed.

## Metadata

- Layout: `metadataBase` from `SITE_URL`, title template `%s — Brevi`, site-wide robots, Open Graph `siteName` and `locale`.
- Home: its own title and description in `uk` and `ru`. A page in the layout's own segment does not get the template, so the home title writes « — Brevi» itself.
- `buildPageMetadata` gives every page a self canonical and `hreflang` `uk-UA`, `ru-UA`, `x-default` → Ukrainian.
- No default Open Graph picture yet: pictures are part of step 9.

## Structured data

| Where               | Type                                                   | Source    |
| ------------------- | ------------------------------------------------------ | --------- |
| every page (layout) | `Organization` with `ContactPoint`                     | `COMPANY` |
| home                | `WebSite`, `LocalBusiness` with address, phones, hours | `COMPANY` |

`sameAs` is left out until the social links are known. The postal code is left out because nobody has provided it.

## Links

- Header, mega menu, mobile menu, and footer use `next/link`; there is no `href="#"`.
- «Заявка» carries `rel="nofollow"`; `/uk/request` and `/ru/request` are disallowed in `robots.txt`.
- The language switch keeps the path and sets `hreflang`.

## SEO scenarios

Covered by `SC-006`–`SC-009` in [behavior](../requirements/behavior.md) and recorded in [SEO verification](../verification/seo-verification.md).
