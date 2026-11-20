# site-cities-model

Data of the city pages «Пошиття» and «Робочий одяг». Pure TypeScript, no React. See the [feature card](../../../../docs/features/site/city-pages.md).

- `cities/city-list.ts` — the 13 cities: slug, name and locative in both languages, three nearby cities; `findCity`.
- `cities/city-sections.ts` — `citySections`, the two sections the layout adds to the catalog menus.
- `cities/city-texts.ts` — `cityText`: title, description, intro, needs and questions of one page; the texts are in `texts/<region>/<city>.ts`.
- `cities/city-products.ts` — `cityPageProducts`, the models of the carousel.
- `cities/text-checks.ts` — `repeatedSentences`, used by the spec that keeps every page's words its own.

Tests: `npx nx test site-cities-model`.
