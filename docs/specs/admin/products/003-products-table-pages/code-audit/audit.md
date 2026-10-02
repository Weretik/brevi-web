# Аудит відповідальностей коду — таблиця й сторінки товарів

- **Feature:** `docs/specs/admin/products/003-products-table-pages/`
- **Scope:** уся feature: product list/detail/create/edit, shared Admin MUI locale й routes
- **Дата:** 2026-10-01

## Перед реалізацією

- [x] Переглянуто `app-router.tsx`, обидві теми, public feature exports, product
      pages/components/hooks/model/data-access, наявні Vitest/Playwright тести та
      попередні SDD 001/002; незакомічені сторонні docs-зміни зафіксовано й не
      включено до реалізації.
- [x] Власники визначені: theme — Material UI/MUI X locale; hooks — query/detail
      loading і retry; data-access — HTTP та mapping; model — draft/validation;
      router — URL composition; pages/components — presentation та interaction.
- [x] У `design/frontend.md` вже записано точні шляхи, поточні змішані ролі й
      обережні межі розділення. `admin-react`, `admin-products-feature` та
      `admin-react-e2e` мають потрібні lint/typecheck/test/build targets.

## Після реалізації

- [x] Повторно переглянуто весь код feature у scope, включно з повторно
      використаними pages/components/hooks/model/data-access, routes, theme,
      public API та тестами, а не лише останній `git diff`.
- [x] Незалежні презентаційні ролі розділено за наявними каталогами `components`
      і `pages`; orchestration, state, model та transport не переміщувалися між шарами.
- [x] Перевірено напрям imports `app → feature → data-access`, внутрішній public
      API, відсутність дублювання locale/product state і нових циклів.
- [x] Невеликі цілісні файли залишено разом; кількість рядків не використано як
      самостійну причину для нового компонента або бібліотеки.
- [x] Для кожного розділення або рішення залишити код разом записано причину й
      фактично виконані перевірки.

## Результат аудиту

| Шлях або область                            | Наявна й впроваджена відповідальність                                                                                                              | Рішення та причина                                                                                                                         | Нові шляхи й межі імпортів                                                                                                                     | Перевірка                                                           |
| ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `pages/products-page.tsx`                   | Query/paging/sort state, category load errors, row-menu coordination, selection і delete target                                                    | Залишено orchestration разом: ці стани керують одним Data Grid flow. Незалежну розмітку фільтрів, декларацію колонок і MUI Menu винесено   | `components/products-list-filters.tsx`, `product-table-columns.tsx`, `product-row-context-menu.tsx`; page → components/hooks/data-access types | feature lint/typecheck; component suite 27/27                       |
| `components/products-list-filters.tsx`      | Controlled MUI filter form і локальна біла surface                                                                                                 | Окремий presentational component: не володіє query і не знає transport; submit event типізується JSX-контекстом без deprecated `FormEvent` | component → MUI/data-access types; export лишається внутрішнім                                                                                 | feature lint/typecheck до останнього type-only cleanup              |
| `components/product-table-columns.tsx`      | Типізована схема колонок, cell rendering і форматування значень                                                                                    | Окремий factory, бо схема таблиці не керує page state; categories передаються явно                                                         | page → column factory → MUI/router/data-access types                                                                                           | feature lint/typecheck; products component tests                    |
| `components/product-editor.tsx`             | Єдиний draft, lookup load, validation, write lock, save/navigation orchestration і композиція field components                                     | Orchestration залишено разом, бо розділення породило б дубльований form state. Винесено лише повторювану stateless surface                 | `product-form-section.tsx`; editor → section/fields/hooks/model/data-access                                                                    | editor/component/model tests у suite 27/27                          |
| Product detail page/components              | Page володіє fetch/delete/navigation; спеціалізовані components показують gallery, descriptions, information, characteristics і type-specific data | Fetch state залишено в page; спільну MUI Card surface винесено, доменні групи лишено окремими. Product state не дублюється                 | `product-detail-section.tsx`; page → detail components/hooks                                                                                   | detail/component tests; E2E до post-audit refactor 27/27            |
| `hooks/` і `model/`                         | Abort/retry/load orchestration; draft conversion, validation, ordering й photo/fabric rules                                                        | Залишено без структурних змін: UI-розділення не змінює власників стану та правил; кожний файл має окрему предметну роль                    | components/pages → hooks/model → data-access                                                                                                   | feature tests 27/27; typecheck passed                               |
| `products/data-access/src`                  | HTTP, error mapping, generated-contract types, response validation/mapping                                                                         | Залишено без змін: transport і runtime mapping вже розділені; UI logic не перенесено                                                       | feature → data-access → api-contract/util                                                                                                      | lint/typecheck; data-access tests 14/14; contracts check            |
| `theme/brevi-theme.ts`                      | Palette composition, component defaults і спільна Material/Data Grid locale для двох themes                                                        | Locale лишено в theme: один малий supported override не виправдовує окремий i18n module; feature text у theme не додано                    | app theme → MUI locale packages                                                                                                                | theme/app tests 18/18; app typecheck                                |
| Routes і public API                         | Чотири product routes та lazy page exports                                                                                                         | Залишено цілісними: внутрішні presentation components не є зовнішнім контрактом і не експортовані з feature index                          | app → `@admin/products/feature`; без reverse import                                                                                            | app lint/typecheck/test; production build                           |
| `apps/admin-react-e2e/src/products.spec.ts` | Browser flows, themes/viewports і network fixtures                                                                                                 | Залишено одним domain spec: fixtures обслуговують спільний product journey; рознесення дублювало б setup                                   | E2E → public browser routes/API mocks                                                                                                          | pre-audit 27/27; post-audit rerun зупинено за вказівкою користувача |

Аудит не виявив циклічних imports, дубльованого product state, нових API або
потреби змінювати public feature exports. Розділення обмежені презентаційними
MUI-компонентами без бізнес-логіки. Після структурної зміни пройшли feature
lint/typecheck/tests, app lint/typecheck/tests, data-access lint/typecheck/tests,
E2E typecheck, contracts check і production build. Повний post-audit E2E не
завершено: перший запуск утратив Vite webServer, повторний однопотоковий запуск
було зупинено за прямою вказівкою користувача після перших п'яти passed tests.
