# Фаза 3: стан списку та toolbar фільтрів

**Статус:** implemented — ручна перевірка очікується
**Залежить від:** [фаза 2](02-react-data-access.md)  
**Блокує:** фази 4–5

## Мета

Реалізувати в `ProductsPage` локальний керований стан запиту та доступний MUI
toolbar для пошуку й фільтрів.

## Межі

- У межах: `useReducer` для застосованого query, локальні draft-значення,
  пошук, boolean-фільтри, ціна, reset та мапінг дій на query.
- Поза межами: URL query parameters, Redux slice, Data Grid, API-виклики поза
  hook з фази 2, категорії та SKU.

## Стан

Початковий застосований domain query: `inStock=false`, `sort='id-asc'`, `page=1`,
`pageSize=20`. Він зберігається тільки локально в feature через `useReducer`.
Transport-параметри `InStock`, `Sort`, `Page` і `PageSize` створює лише mapper
в `data-access`.

- Search draft застосовується лише за Enter або кнопкою «Пошук».
- Ціновий draft застосовується лише кнопкою «Застосувати» або Enter у полі.
- Коли змінюється search, будь-який фільтр або ціна, reducer встановлює
  `Page=1`.
- Reset повертає всі значення за замовчуванням, але не змінює `PageSize`.
- `PriceFrom > PriceTo` блокує застосування та відображає доступну помилку.

## Сценарії

1. Given введений текст, when користувач натискає Enter, then змінюється
   застосований `SearchTerm` і сторінка стає першою.
2. Given діапазон цін, when користувач натискає «Застосувати», then валідні
   значення входять у query; невалідний діапазон не надсилається.
3. Given активні фільтри, when користувач натискає «Скинути фільтри», then
   відновлюються затверджені defaults.

## Критерії приймання

- [x] Локальний стан не дублюється в Redux чи URL.
- [x] Усі контролі мають українські label і використовують MUI-контроли з
      видимим keyboard focus.
- [x] Search не виконує запит на кожне натискання клавіші.
- [x] Ціна не застосовується до явної дії користувача.

## Перевірка

- `npx nx lint admin-products-feature`.
- `npx tsc --noEmit --project libs/admin/products/feature/tsconfig.lib.json`.
- `npx nx typecheck admin`.
- `npx nx build admin`.
- Ручно перевірити search, Enter, reset, кожен boolean-фільтр і validation ціни.

## Результат реалізації

- Додано `useProductsListState` з локальним `useReducer`, applied query та
  draft-значеннями пошуку й діапазону цін.
- Додано `ProductsListFilters` з пошуком, фільтрами наявності/акції/новинки,
  сортуванням, діапазоном цін і reset.
- `ProductsPage` поєднує feature state з toolbar; API hook ще не викликається,
  тому server state не дублюється й належить наступній фазі.
- `npx nx lint admin-products-feature`, type-check feature і app та production
  build Admin завершилися успішно.

## Історія змін

- 2026-07-25: реалізовано локальний стан списку та toolbar фільтрів; ручна
  перевірка в браузері лишається перед прийняттям фази.
- 2026-07-25: керування сортуванням перенесено до Data Grid у фазі 4; toolbar
  лишається панеллю server-side пошуку та фільтрів.
