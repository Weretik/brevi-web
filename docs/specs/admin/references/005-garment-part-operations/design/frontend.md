# Операції (роботи) — проєктування frontend

## Перевірений контекст

- Angular-джерело таблиці, діалогів і контекстних дій: `libs/admin/feature/references/src/lib/pages/garment-part-operation/` та `libs/admin/feature/references/src/lib/components/dialogs/`.
- Старий transport: `libs/admin/data-access/src/lib/references/garment-part-operations/garment-part-operations.api.ts`; backend controller: `src/Modules/Reference/Reference.Api/Reference.Api/Controllers/` у BreviERP.
- React route уже існував для «Елементів»; `apps/admin-react` має shell, Vitest, Playwright та lint/typecheck/build. Реалізація робіт повторно використовує наявні `libs/admin/references/feature` і `data-access` та спільний URL.
- Візуальна композиція: [приклад таблиці](../../../assets/visual-references/products-list.png) і [приклад форми](../../../assets/visual-references/product-edit.png); це зразки структури, не полів чи бренду. Застосовувати Brevi MUI theme й безкоштовний `@mui/x-data-grid`, без PrimeNG у React.

## Межа сторінки й таблиці

- Сторінка `/references/garment-part-operation`; вкладка: «Роботи» на тій самій сторінці, що й «Елементи». 004-garment-parts; використовувати спільну сторінку, не створювати другий URL.
- Старі колонки: ID, елемент, назва, хвилини (Min). Показувати тільки поля, підтверджені канонічним OpenAPI та runtime mapper; розбіжності оформити як backend blocker до UI.
- Дії: створення, перегляд, редагування, одиночне й масове видалення з підтвердженням. Поля форми: елемент, назва, хвилини; перевірити числові межі за контрактом.
- Зберігати старий бізнес-результат, але будувати новий MUI UI: заголовок, доступний toolbar з наявними діями, Data Grid, рядкове меню, MUI Dialog/Drawer і підтвердження. Не копіювати PrimeNG DOM чи фіктивні можливості референсу.
- Старий endpoint повертає список без серверної пагінації. Якщо чинний OpenAPI підтвердить це, Data Grid сортує й розбиває вже завантажені рядки на клієнті; не заявляти серверну пагінацію. Якщо контракт зміниться — оновити рішення окремо.

## Відповідальності

| Область       | Власник                                                                                                                                                                                                                                                                          |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Page/route    | `libs/admin/references/feature/src/pages/garment-parts-page.tsx` компонує вкладки; `garment-parts-content.tsx` і `garment-part-operations-content.tsx` володіють локальними взаємодіями; `apps/admin-react/src/app/router/app-router.tsx` використовує наявний публічний export. |
| Таблиця/форма | `libs/admin/references/feature/src/components/garment-part-operations/` — Data Grid, форма й підтвердження без HTTP.                                                                                                                                                             |
| Data-access   | `libs/admin/references/data-access/src/garment-part-operations/` — generated operation types на межі, runtime-перевірка, mapping, transport.                                                                                                                                     |
| Модель        | Типи рядка в data-access; чисті правила в `feature/src/model/garment-part-operation-validation.ts`; hooks володіють станом read/write. Спільний `use-reference-row-selection.ts` володіє однаковим правилом вибору для обох вкладок.                                             |
| Меню          | Наявний пункт «Операції» веде на спільний route; другого пункту чи URL немає.                                                                                                                                                                                                    |

Залежність селектора: елементи виробу для вибору у формі. Вона має власну contract operation і перевірку відповіді; не покладатися на ручні Angular DTO.
Перевірено loading/empty/error, retry, успіх редагування й помилку створення, підтвердження та часткову невдачу видалення, прямий URL, 320/768/1280 px, темну/світлу тему. Nx targets наявних бібліотек звірено через `npx nx show project <project> --json`.
