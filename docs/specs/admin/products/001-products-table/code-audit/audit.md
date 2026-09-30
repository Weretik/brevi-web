# Аудит відповідальностей коду — Товари

- **Feature:** `docs/specs/admin/products/001-products-table/`
- **Scope:** уся feature
- **Дата:** 2026-09-28

## Перед реалізацією

- [x] Переглянуто фактичні React shell/router/menu, reference data-access/feature як зразок Nx targets, generated contract, backend Products/ProductCategories/CatalogMedia controllers і стару product SDD.
- [x] Власники: backend OpenAPI — API; `libs/admin/products/data-access` — transport/runtime mapping; `libs/admin/products/feature` — UI та локальний стан; app router — маршрути; shared shell — меню.
- [x] У `design/frontend.md` визначено шляхи та межі. Старі продуктові шляхи в історичній SDD не існують; нові створюються за структурою чинних React довідників.

## Після реалізації, до delivery checkpoint

- [x] Повторно переглянуто всі файли `libs/admin/products/*`, router/menu, E2E, generated contract і повторно використані reference lookups.
- [x] HTTP/error, CRUD, lookup/upload, mapping, read hooks, write model, form sections і route composition мають окремі файли.
- [x] Public API лише через `data-access/src/index.ts` і lazy `feature/src/index.ts`; feature не імпортує generated contract і не викликає fetch. Циклів між бібліотеками немає; form state єдиний у editor.
- [x] Невеликі create wrapper, edit wrapper, list/detail hook і confirm dialog лишені цілісними; додатковий шар для них не потрібен.
- [x] Після розділення повторено API/model/app tests, lint/typecheck і E2E; production build має окремі product route chunks.

## Результат аудиту

| Шлях або область                                                                                                                                                                                                               | Відповідальність                                                                     | Рішення та причина                                                                                                                                              | Межа імпортів                                                                | Перевірка                   |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | --------------------------- |
| Backend `docs/sdd/contracts/catalog/product-catalog.openapi.yaml`, `product-dependencies.openapi.yaml`                                                                                                                         | Product CRUD, category lookup і media upload                                         | Окремі module contracts з агрегованими `$ref`                                                                                                                   | Frontend лише через pinned snapshot                                          | `contracts:check`           |
| `libs/admin/api-contract` і `tools/contracts/`                                                                                                                                                                                 | Generated types і sync/check                                                         | Повторно використати спільний tooling                                                                                                                           | Generated DTO тільки в data-access                                           | `contracts:check`           |
| `apps/admin-react/src/app/router/`                                                                                                                                                                                             | Route і активація меню                                                               | Залишити app composition                                                                                                                                        | App → public feature export                                                  | router tests                |
| `libs/admin/products/data-access/src/products.http.ts`, `products.api.ts`, `product-lookups.api.ts`, `products.mapper.ts`                                                                                                      | HTTP/error, CRUD, lookup/upload, runtime validation                                  | Розділено незалежні HTTP ресурси й перевірку DTO; єдиний send/error для однакових статусів; nested detail перевіряється до UI                                   | Без React; generated operations у API/model boundary                         | 9 API tests, lint/typecheck |
| `libs/admin/products/feature/src/hooks/use-product.ts`, `use-products.ts`, `use-product-categories.ts`, `use-product-lookups.ts`                                                                                               | Read cancellation/retry та lookup orchestration                                      | Окремий стан для detail, list, list category filter і form dependencies; скасовані responses не перезаписують новий ID/query, помилки category filter видимі    | Лише data-access public API, existing references public API                  | hook test, app/E2E          |
| `libs/admin/products/feature/src/model/product-draft.ts`, `product-validation.ts`                                                                                                                                              | Ініціалізація/перемикання типу та перевірка write rules                              | Розділено незалежне перетворення detail→draft від валідації; перемикання типу винесено з JSX, щоб не переносити поля іншого типу                                | Без React/HTTP                                                               | 3 model tests               |
| `libs/admin/products/feature/src/components/product-base-fields.tsx`, `product-photo-fields.tsx`, `sewing-product-fields.tsx`, `ppe-product-fields.tsx`, `product-information-fields.tsx`, `product-characteristic-fields.tsx` | Незалежні секції форми                                                               | Фото й upload відділено від тексту/категорій; Sewing/Ppe та blocks/tables мають окремі компоненти, бо їхні поля й операції змінюються незалежно                 | Компоненти отримують draft і lookup props; API upload лише через data-access | product E2E обох типів      |
| `libs/admin/products/feature/src/components/product-editor.tsx`, `product-type-fields.tsx`, `product-delete-dialog.tsx`; `pages/`                                                                                              | Save/delete orchestration, conditional section selection, list/detail/route wrappers | Editor лишено єдиним власником form state; type dispatcher малий і цілісний; confirm dialog очищує помилку при закритті; create/edit wrappers не дублюють форму | Сторінки/компоненти → hooks/model/data-access, без generated imports         | app tests, product E2E      |

Рішення щодо кешу: довгоживучого кешу не вводили. Read effects залежать від query або ID; кожний маршрут завантажує актуальний результат, а delete зі списку викликає reload. Це усуває потребу в синхронізації двох станів у поточній архітектурі.

Обмеження перевірки: E2E використовує контрольовані API fixtures; інтеграція з реально розгорнутим backend і фактичне зберігання файлів не перевірялись. TDD Red до реалізації не був зафіксований; див. [evidence](../tasks/evidence.md).

## Повторний аудит усієї feature

- `products.mapper.ts` лишено цілісною transport перевіркою: ті самі DTO перевіряються перед list/detail UI, а окремий шар за розміром файла не потрібен. `products.model.ts` експортує типізовані alias із pinned generated contract; feature імпортує лише public data-access API, тож залежність від генератора локалізована в data-access.
- `ProductBaseFields` більше не керує media upload. `ProductPhotoFields` володіє фото й upload; загальні назви, описи, тип і категорії лишилися разом, бо становлять одну секцію. `ProductContentFields` як порожню обгортку вилучено після розділення blocks/tables.
- `ProductTypeFields` лишено лише диспетчером; власні Sewing та Ppe секції відокремлено. `product-draft.ts` володіє конвертацією/перемиканням, `product-validation.ts` — правилами до запису. Ці правила не дублюються в JSX.
- `ProductsPage` передає category fetch/error/retry до `use-product-categories.ts`. `use-product.ts` і `use-products.ts` ігнорують застарілі responses після abort; `ProductDeleteDialog` не переносить стару помилку на інший товар.
- App router лишається компоновкою lazy public exports. Existing reference data-access використано через public API, без нового lookup transport; сторонні модулі не змінювались у повторному аудиті.
- Перевірка імпортів: `@admin/api-contract` лише у product data-access; у feature немає прямого `fetch` та імпорту app router; data-access не імпортує feature. Залежності спрямовані app → feature → data-access/reference data-access, циклів у цих межах немає.
- У `use-products.ts` збережено останній `pagedInfo` під час наступного запиту: очищення всього `page` тимчасово скидало `rowCount` до нуля, через що Data Grid повертав користувача з другої сторінки на першу. Під час loading/error старі рядки приховані. Регресію виявив повний E2E і підтвердив повторний тест пагінації.
- Перший повний E2E після виправлення дав 22/23: за шістьох паралельних workers перше відкриття lazy product route ще показувало індикатор завантаження після стандартних 5 секунд. Наступний повний прогін дав 23/23; очікування тільки першого відкриття в цьому сценарії збільшено до 15 секунд.

## Повторна перевірка після аудиту

- `npx nx test admin-products-data-access` — 9/9; `npx nx test admin-products-feature` — 4/4; `npx nx test admin-react` — 15/15.
- `npx nx lint admin-products-data-access`, `admin-products-feature`, `admin-react`, `admin-react-e2e` — успішно; typecheck і typecheck-tests відповідних product/app/E2E targets — успішно.
- `npx nx build admin-react` — успішно, product route chunks окремі; лишається попередження про основний chunk 848 kB.
- `npx nx e2e admin-react-e2e` — 23/23 після корекції очікування; `npx nx lint admin-react-e2e` і `npx nx typecheck admin-react-e2e` також успішні після останньої зміни тесту.
- `npm run docs:check` і `npm run contracts:check` — успішно.

## Уточнення меж швейної секції

- За повторним переглядом `sewing-product-fields.tsx` виявлено чотири незалежні ролі в одному компоненті: витрата тканини на виріб, вибір тканин, фурнітури та операцій. Переміщено керування трьома списками до `sewing-fabric-fields.tsx`, `sewing-accessory-fields.tsx` і `sewing-operation-fields.tsx`; кореневий компонент залишився власником заголовка, поля витрати та порядку секцій.
- Стан draft і правила валідації залишаються в `ProductEditor`/model; дочірні компоненти отримують лише потрібні lookup списки та редагують свою частину draft. Нового локального стану чи API доступу не додано.
- Після розділення пройшли `npx nx lint admin-products-feature`, `npx nx typecheck admin-products-feature`, `npx nx typecheck-tests admin-products-feature`, `npx nx test admin-products-feature` (4/4), `npx nx build admin-react`, product Playwright (4/4) і `npm run docs:check`.

Історичні phase records не переписуються; старий `/api/admin/products` не використовується.
