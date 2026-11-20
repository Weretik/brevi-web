# site-cities-ui

Blocks of the city pages in the «Строчка» design. Server Components only. See the [feature card](../../../../docs/features/site/city-pages.md).

- `i18n/` — `getCityDictionary`: the text of the blocks both kinds of page share, in `uk` and `ru`.
- `sections/` — `CityHero` (h1, intro, actions, facts), `CityPoints` (needs, logo methods, steps, prices), `CityFaq`, `CityLinks` (nearby cities, pair page, «Регіони»), `CityOrder` (call to order).

Tests: `npx nx test site-cities-ui`.
