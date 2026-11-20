# City pages «Пошиття» and «Робочий одяг»

**Status:** approved by the owner («да», 2026-11-20); implemented 2026-11-20, see the feature card.
**Variant:** `nextjs` (public, indexed site `apps/site`).
**Source:** owner's corrections of 2026-11-20 (annotated screenshots of the catalog menu); the old city pages listed in the project file `brevi_old_site_city_pages.md` (read 2026-11-20); [SEO architecture](../../../../architecture/site/platform/seo-architecture.md) (row «City landing»); [«Регіони» page](../001-regions/README.md).
**Feature card:** [city pages](../../../../features/site/city-pages.md); redirect rows for the Admin: [city-pages-redirects](../../../../features/site/city-pages-redirects.md).

## Why the decision of 001 changes

[001](../001-regions/README.md) chose one «Регіони» page instead of 26 city pages, because the old pages were one template with the city swapped (doorway risk) and two pages per city competed for the same query. On 2026-11-20 the owner asked for the city pages back as two catalog menu sections. This spec keeps them, and removes the two risks of the old pages:

1. **Two different intents, not two copies.** «Пошиття» is for an order sewn to a company's needs (own production, logo, the company's colours, a batch from 5 pieces). «Робочий одяг» is for buying ready workwear from the catalog (summer and winter sets, protective equipment, prices by quantity). Each type has its own H1, title, blocks and products, and each page links to its pair.
2. **Unique text per page.** Every page has its own intro written for that city and that intent (local industries, who in the city buys workwear and why), its own FAQ and its own title and description. No paragraph is shared between two cities except the fixed blocks (steps, delivery map, request).

## Scope

- 26 pages × 2 languages: 13 cities × {«Пошиття», «Робочий одяг»} at `/uk/...` and `/ru/...`.
- Catalog menu: two new sections after «Готові рішення», «Пошиття» and «Робочий одяг», with the 13 cities as subsections. The same in the phone «Каталог» sheet.
- «Регіони» lists the cities as links to both pages (replaces RG-004 «cities are plain text»).
- Sitemap entries, metadata, `hreflang`, `BreadcrumbList`, `FAQPage`.
- The list of 26 old addresses → new pages, for «Контент → Переадресації» (data, added in the Admin).

## Out of scope

- Editing the city texts in the Admin (static texts in code, like the other content pages). Can come later.
- New cities beyond the 13 of the old site.
- Any online order: «Купити» and «Залишити заявку» open the request window, as everywhere.

## Cities and addresses

City slugs follow the official Ukrainian transliteration (KMU 2010). The old addresses of the live `brevi.com.ua` redirect (308) to the new page of the same type.

| City        | Slug           | «Пошиття» new page        | Old address                                                             | «Робочий одяг» new page     | Old address                               |
| ----------- | -------------- | ------------------------- | ----------------------------------------------------------------------- | --------------------------- | ----------------------------------------- |
| Київ        | `kyiv`         | `/uk/sewing/kyiv`         | `/poshyttya-specodyagu-na-zamovlennya-ta-optovyj-prodazh-u-kyyevi`      | `/uk/workwear/kyiv`         | `/robochyj-odyag/specodyag-kyyiv/`        |
| Харків      | `kharkiv`      | `/uk/sewing/kharkiv`      | `/poshyttya-specodyagu-na-zamovlennya-ta-optovyj-prodazh-u-harkovi`     | `/uk/workwear/kharkiv`      | `/robochyj-odyag/specodyag-harkiv/`       |
| Дніпро      | `dnipro`       | `/uk/sewing/dnipro`       | `/poshyttya-specodyagu-na-zamovlennya-ta-optovyj-prodazh-u-dnipri`      | `/uk/workwear/dnipro`       | `/robochyj-odyag/specodyag-dnipro/`       |
| Одеса       | `odesa`        | `/uk/sewing/odesa`        | `/poshyttya-specodyagu-na-zamovlennya-ta-optovyj-prodazh-v-odesi`       | `/uk/workwear/odesa`        | `/robochyj-odyag/specodyag-odesa/`        |
| Запоріжжя   | `zaporizhzhia` | `/uk/sewing/zaporizhzhia` | `/poshyttya-specodyagu-na-zamovlennya-ta-optovyj-prodazh-u-zaporizhzhi` | `/uk/workwear/zaporizhzhia` | `/robochyj-odyag/specodyag-zaporizhzhya/` |
| Кривий Ріг  | `kryvyi-rih`   | `/uk/sewing/kryvyi-rih`   | `/poshyttya-specodyagu-na-zamovlennya-ta-optovyj-prodazh-kryvyj-rig`    | `/uk/workwear/kryvyi-rih`   | `/robochyj-odyag/specodyag-kryvyj-rig/`   |
| Миколаїв    | `mykolaiv`     | `/uk/sewing/mykolaiv`     | `/poshyttya-specodyagu-na-zamovlennya-ta-optovyj-prodazh-u-mykolayevi`  | `/uk/workwear/mykolaiv`     | `/robochyj-odyag/specodyag-mykolayiv/`    |
| Вінниця     | `vinnytsia`    | `/uk/sewing/vinnytsia`    | `/poshyttya-specodyagu-na-zamovlennya-ta-optovyj-prodazh-u-vinnyci`     | `/uk/workwear/vinnytsia`    | `/robochyj-odyag/specodyag-vinnycya/`     |
| Полтава     | `poltava`      | `/uk/sewing/poltava`      | `/poshyttya-specodyagu-na-zamovlennya-ta-optovyj-prodazh-u-poltavi`     | `/uk/workwear/poltava`      | `/robochyj-odyag/specodyag-poltava/`      |
| Чернігів    | `chernihiv`    | `/uk/sewing/chernihiv`    | `/poshyttya-specodyagu-na-zamovlennya-ta-optovyj-prodazh-u-chernigovi`  | `/uk/workwear/chernihiv`    | `/robochyj-odyag/specodyag-chernigiv/`    |
| Житомир     | `zhytomyr`     | `/uk/sewing/zhytomyr`     | `/poshyttya-specodyagu-na-zamovlennya-ta-optovyj-prodazh-u-zhytomyri`   | `/uk/workwear/zhytomyr`     | `/robochyj-odyag/specodyag-zhytomyr/`     |
| Суми        | `sumy`         | `/uk/sewing/sumy`         | `/poshyttya-specodyagu-na-zamovlennya-ta-optovyj-prodazh-u-sumah`       | `/uk/workwear/sumy`         | `/robochyj-odyag/specodyag-sumy/`         |
| Біла Церква | `bila-tserkva` | `/uk/sewing/bila-tserkva` | `/poshyttya-specodyagu-na-zamovlennya-ta-optovyj-prodazh-bila-cerkva`   | `/uk/workwear/bila-tserkva` | `/robochyj-odyag/specodyag-bila-cerkva/`  |

The Russian pages are the same paths under `/ru`. Old addresses have no language, so they go to `/uk`.

## Rules

| ID     | Rule                                                                                                                                                                                                          |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CP-001 | One template per page type, data per city; one `h1`. «Пошиття»: «Пошиття спецодягу на замовлення у {місті}». «Робочий одяг»: «Робочий одяг і спецодяг у {місті}».                                             |
| CP-002 | Every page has its own text for its city and type: an intro of two paragraphs (40–80 words), 3 needs and 3 FAQ answers, together at least 150 words; no sentence of them repeats on another page (unit test). |
| CP-003 | «Пошиття» blocks: intro, what we sew for the city's industries (3–4 items unique to the city), logo methods, own sewing models carousel, steps, delivery map, FAQ (3 questions), request.                     |
| CP-004 | «Робочий одяг» blocks: intro, what to buy for the city's work (3–4 items), popular models carousel with protective equipment, prices by quantity, delivery map, FAQ (3 questions), request.                   |
| CP-005 | Each page links to its pair («Пошиття у {місті}» ↔ «Робочий одяг у {місті}»), to «Регіони», and to three nearby cities of the same type.                                                                      |
| CP-006 | «Купити» and «Залишити заявку» open the request window; the only phone is 050 469 86 75; no online order, cart or payment wording.                                                                            |
| CP-007 | The Poltava pages say pickup is free from the Poltava warehouse and the courier in Poltava costs 250 грн; other cities get delivery by Nova Poshta or SAT within 3 working days of shipping.                  |
| CP-008 | Title (≤ 60 characters) and description (≤ 160) are unique per page and language; canonical to self; `hreflang` uk-UA, ru-UA, x-default; in the sitemap.                                                      |
| CP-009 | `BreadcrumbList` (Головна › Регіони › «Пошиття у {місті}»; there is no hub page per kind) and `FAQPage` from the visible FAQ; `Organization` stays in the layout.                                             |
| CP-010 | The catalog menu shows «Пошиття» and «Робочий одяг» after «Готові рішення», each with its 13 cities; «Усі міста» of the section leads to «Регіони».                                                           |
| CP-011 | An unknown city slug answers 404. Old addresses redirect once (no chains) to the page of the same type.                                                                                                       |
| CP-012 | Facts about the city (industries, large employers by sector) are general and checkable; no invented clients, addresses or offices in the city.                                                                |

## Scenarios

- **SC-01.** Given a visitor on any page, when they open «Каталог» and pick «Пошиття › Харків», then `/uk/sewing/kharkiv` opens with one `h1` naming Kharkiv and own sewing models.
- **SC-02.** Given the Kharkiv «Пошиття» page, when the visitor presses «Купити» on a model, then the request window opens with the model in the form.
- **SC-03.** Given a search engine reading `/uk/workwear/odesa`, then it gets a unique title and description, a self canonical, `hreflang` to `/ru/workwear/odesa`, `BreadcrumbList` and `FAQPage`.
- **SC-04.** Given the old address `/robochyj-odyag/specodyag-harkiv/` in the redirect list, when it is opened, then it answers one permanent redirect to `/uk/workwear/kharkiv`.
- **SC-05.** Given `/uk/sewing/lviv` (not a city of the list), then the site answers 404.
- **SC-06.** Given «Регіони», then every city links to both of its pages.

## Design (frontend)

Follows [Site Next.js architecture](../../../../architecture/site/README.md) and the folder axiom. New libraries are scaffolded with `nx g @nx/react:library` like `site-regions-*`.

The tree below is the plan; as built, the per-city texts and the sentence check live in `site-cities-model` (`texts/<region>/<city>.ts`, `cities/text-checks.ts`) and the kinds and paths in `site-core-i18n` (`CityPageKind`, `cityPagePath`). The feature card has the current tree.

```text
apps/site/src/app/[locale]/
├── sewing/[city]/page.tsx        # «Пошиття» route: generateStaticParams for 13 cities, metadata, 404 for others
└── workwear/[city]/page.tsx      # «Робочий одяг» route
libs/site/cities/
├── model/src/lib/
│   ├── city-list.ts              # the 13 cities: slug, names in both languages and cases, map point, neighbours
│   ├── city-page-kind.ts         # 'sewing' | 'workwear', paths, pair link
│   └── city-texts-check.ts       # pure check that no two intros share a sentence (used by the spec)
├── ui/src/lib/
│   ├── i18n/                     # shared block text (uk, ru)
│   ├── texts/<region>/<city>.ts  # per-city text for both types and both languages, grouped by region
│   │                             # (centre, east, south-east, south), 2–5 files per folder
│   └── sections/                 # city-hero, city-needs, city-faq, city-links
├── seo/src/lib/city-metadata.ts  # title, description, alternates, sitemap entries
└── feature/src/lib/
    ├── sewing-city-page.tsx      # block order of «Пошиття»
    └── workwear-city-page.tsx    # block order of «Робочий одяг»
```

Changed existing code:

- `site-core-shell` catalog menu and phone catalog sheet: two static sections appended after the catalog sections from the API; `CatalogSection` items get an optional `href` so a city item does not go to `/catalog/...`.
- `site-regions-ui` cities become links to both pages.
- `site-core-seo` sitemap gets a `cities` group.
- Reused as they are: `CatalogProductCarousel` + `pickFeaturedProducts` (filtered by type), `DeliveryAcrossUkraine`, the request window, `PageSection`, `JsonLd`.

The pages are static (no API besides the cached catalog products for the carousel). Product type filter: «Пошиття» shows `Sewing` models, «Робочий одяг» shows all types.

## Redirects

The site already follows «Контент → Переадресації» before its 404 ([redirects](../../../../features/site/redirects.md)). The 26 rows of the table above are data, added by staff in the Admin (or by the owner's choice through a one-off import in BreviERP). No code change in the site.

## Non-functional

- Quality targets: system default of the site (static pages, prerendered; Core Web Vitals as the other content pages).
- Access rights: ➖ public pages, no Admin screen.
- Mutations and double submit: ➖ only the existing request window (it has its `requestId`).
- Personal data: ➖ none.
- End-to-end: SC-01 and SC-02 in the manual browser check; no new E2E suite.

## Tasks

| ID    | Task                                                                         | Test first                                 |
| ----- | ---------------------------------------------------------------------------- | ------------------------------------------ |
| TS-01 | Scaffold `site-cities-{model,ui,seo,feature}`; city list, kinds, paths       | `city-list.spec.ts`                        |
| TS-02 | Shared block text and the 13 city texts (uk, ru); unique-sentence check      | `city-texts.spec.ts`                       |
| TS-03 | Sections and the two page templates                                          | `city-ui.spec.tsx`, `city-pages.spec.tsx`  |
| TS-04 | Routes, metadata, sitemap, JSON-LD                                           | `city-metadata.spec.ts`, `sitemap` spec    |
| TS-05 | Catalog menu and phone sheet sections; «Регіони» links                       | `site-shell.spec.tsx`, `regions-page.spec` |
| TS-06 | Feature card, feature map, SEO architecture row, redirect list for the Admin | `npm run docs:check`                       |
| TS-07 | One audit at the end (`frontend-code-audit`), browser check of SC-01..06     | —                                          |

## Traceability

| Rule                   | Scenario     | Task         |
| ---------------------- | ------------ | ------------ |
| CP-001, CP-003, CP-004 | SC-01        | TS-01, TS-03 |
| CP-002, CP-012         | SC-03        | TS-02        |
| CP-005, CP-010         | SC-01, SC-06 | TS-03, TS-05 |
| CP-006, CP-007         | SC-02        | TS-03        |
| CP-008, CP-009         | SC-03        | TS-04        |
| CP-011                 | SC-04, SC-05 | TS-04, TS-06 |

## Open questions for the owner

1. «Усі міста» of the menu sections leads to «Регіони» (recommended), not to two more hub pages.
2. Delivery time per city: the pages say «відправка протягом 3 робочих днів» from the delivery page; no per-city days unless the owner gives them.
3. The 26 redirects are added in «Контент → Переадресації» by staff after the merge.
