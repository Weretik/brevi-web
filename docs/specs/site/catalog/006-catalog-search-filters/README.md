# Catalog, stage 6: search, category tabs, and filters («Рядок над товарами»)

**Status:** stage 1 implemented and verified locally 2026-11-12; stage 2 (fabrics) implemented 2026-11-12, needs BreviERP «fabric names on cards» (CNT-002 R-13) in production.
**Variant:** `nextjs`.
**Source:** owner request 2026-11-12 («не зрозуміло, де пошук, де фільтрація, де категорії»), UX audit with three concepts; the owner chose concept B «Рядок над товарами».
**Feature card:** [site catalog](../../../../features/site/catalog.md).

## Problem

The site had no search at all. Category pages listed every model in one grid with no filters, order, or pagination (85 models in «Спецодяг літній»). The catalog root showed text links only, without pictures or prices. On a subcategory such as «Жилети» the subcategory buttons disappeared, so the visitor could not move to a neighbour. Own sewing and resold protective equipment were mixed. On a phone the stacked subcategory buttons filled the first screen.

## Decisions

- **Search everywhere.** «Пошук» in the header menu row and a search icon in the phone header open a panel with the search field. The catalog root has a large field, a category page a compact one. Suggestions appear as the visitor types: up to six models (photo, name, model number, «від» price) and three categories (with the parent name), and «Усі результати (N)». Enter opens `/{locale}/search?q=…`.
- **Search rules.** Every word of the query must be in the name or the model number of a product, or in the name of a category or its parent. Case, apostrophes, «ё/ї/ы», and Latin letters that look Cyrillic are ignored. Words that start a word of the name rank first.
- **Search index.** `GET /api/catalog-search/{locale}` returns every product and category of the language with the addresses of their pages, built from the cached catalog answers (no new API calls); browsers and Cloudflare keep it for five minutes. The box loads it once, on the first focus.
- **Search page** `/{locale}/search?q=` is rendered per request, `noindex, follow`, out of the sitemap. Without JavaScript the search form still opens it.
- **Category tabs.** «Усі» (the category) and every subcategory with its model count, as links. On a subcategory the tabs show the parent and all its neighbours, the open one marked. On a phone the row scrolls sideways and brings the open tab into view.
- **Row above the listing** (sticky under the header): «Ціна» with three round ranges that split the priced models of the category into thirds (none when fewer than six models have prices), «Тип» (own sewing or protective equipment, only when the category has both), «Порядок» (as in the category, cheaper first, dearer first), and «Знайдено N». Phones get one «Фільтри · N» button that opens a panel from the bottom with the same choices and «Показати N».
- **The choice is kept in the address** (`?price=1000-1400&type=Ppe&sort=cheap`) with `history.replaceState`, so a shared link opens the same view. The HTML is the same for every address and canonical points to the clean category URL; `robots.txt` already disallows `?sort=`.
- **24 models at first**, then «Показати ще (N)». Every product card stays in the HTML (hidden ones with `hidden`), so search engines see every product link.
- **Card:** «Власне пошиття» on own sewing, the name, «Модель 1031», «від 1 480 грн/шт» and «від 40 шт» under it (the «від» price is the 40+ tier). «Економія» stays on the product page only.
- **Catalog root:** the search, then the categories in two groups «Власне пошиття» and «Засоби захисту» (a category goes to the kind most of its models are), each a card with an icon, model count, lowest price, and subcategory links. The header mega menu uses the same icons.
- **No section numbers** on catalog pages: the «01 ----- КАТАЛОГ · 33 МОДЕЛІ» label is replaced by the model count next to the heading. The text staff wrote about a category is folded to about six lines with «Читати повністю».

## Scenarios

1. Typing «зам» in any search field suggests «Куртка ЗАМЕТІЛЬ …» with photo and price; Enter opens the search page with every match.
2. A model number such as «1031» finds its model.
3. On «Жилети» the tabs show «Усі · Куртки … · Жилети», «Жилети» marked; a tab opens its own page.
4. Choosing «Ціна: 1 000 – 1 400» leaves only models in that range, the count and the address change; «Скинути» brings all back.
5. «Спочатку дешевші» orders by price with models without a price last.
6. A category with 30 models shows 24 and «Показати ще (6)».
7. On a phone «Фільтри» opens the bottom panel; the button shows the number of filters on.
8. The catalog root shows own sewing first, protective equipment second, each category with «від N грн».

## Stage 2: fabrics

- The public API card carries `fabrics`, the names of the active fabrics of a sewing model (BreviERP CNT-002 R-13, contract 1.2.0). The site reads it as optional: an older API gives an empty list, and the listing then has no fabric filter.
- **«Тканина»** in the row above the listing (and in the phone panel), between «Ціна» and «Тип»: every fabric of the listing, the most common first; only when the models differ in fabric. The choice is kept as `?fabric=Грета`; names compare without case.
- **Card:** «3 тканини» (the names in the tooltip), or «Тканина: Грета» when the model has one fabric.
- **Search** finds a model by its fabric too: «куртка грета».

Scenario 9: in «Спецодяг літній» choosing «Тканина: Грета» leaves only the models made in Грета; the address gets `?fabric=Грета`.

## Not in this stage

- Season, gender, profession, industry, colour, size: no structured data in the Admin.

## Structure check

No new library. Pure search and listing rules are in `site-catalog-model` (`catalog-search`, `catalog-listing`, `catalogCategoryFamily`). `site-catalog-data-access` reads all cards (`getCatalogProducts`) and maps `type` and `code` of a card. `site-catalog-ui` has the server blocks (tabs, product tile and grid, section groups, category icon) and three client blocks (listing with filters, search box, tab scroller). `site-catalog-feature` builds the search index and the search page. The app adds the route handler and the search route. `site-shared-ui`: `PageHeader` without a label and with a note next to the heading; `Sheet` from the bottom. `site-core-shell`: «Пошук» in the header. Stage 2 adds `catalogFabrics` and the `fabric` choice to `catalog-listing`, `fabrics` to the card type, mapper, search index, and tile; no new file.
