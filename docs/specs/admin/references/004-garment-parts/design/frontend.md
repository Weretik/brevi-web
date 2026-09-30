# Елементи виробу — проєктування frontend

## Перевірений контекст

- Angular-джерело таблиці, діалогів і контекстних дій: `libs/admin/feature/references/src/lib/pages/garment-part-operation/` та `libs/admin/feature/references/src/lib/components/dialogs/`.
- Старий transport: `libs/admin/data-access/src/lib/references/garment-parts/garment-parts.api.ts`; backend controller: `src/Modules/Reference/Reference.Api/Reference.Api/Controllers/` у BreviERP.
- React route підключено в `apps/admin-react/src/app/router/app-router.tsx`. Наявні `libs/admin/references/feature` і `libs/admin/references/data-access` використано для цієї feature без нових libraries.
- Візуальна композиція: [приклад таблиці](../../../assets/visual-references/customers-status-list.png) і [приклад форми](../../../assets/visual-references/customer-create.png); це зразки структури, не полів чи бренду. Застосовувати Brevi MUI theme й безкоштовний `@mui/x-data-grid`, без PrimeNG у React.

## Межа сторінки й таблиці

- Сторінка `/references/garment-part-operation`; вкладка «Елементи». Вкладку «Роботи» додати за SDD 005.
- Старі колонки: ID, назва. Показувати тільки поля, підтверджені канонічним OpenAPI та runtime mapper; розбіжності оформити як backend blocker до UI.
- Дії: створення, перегляд, редагування, одиночне й масове видалення з підтвердженням. Поля форми: назва; ID та інші поля звірити з контрактом і чинною формою.
- Зберігати старий бізнес-результат, але будувати новий MUI UI: заголовок, доступний toolbar з наявними діями, Data Grid, рядкове меню, MUI Dialog/Drawer і підтвердження. Не копіювати PrimeNG DOM чи фіктивні можливості референсу.
- Endpoint повертає список без серверної пагінації. Data Grid сортує й розбиває вже завантажені рядки на клієнті; серверна пагінація не заявляється.

## Відповідальності

| Область       | Власник                                                                                                                                                          |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Page/route    | `libs/admin/references/feature/src/pages/` компонує вкладки й локальні взаємодії; `apps/admin-react/src/app/router/` підключає route через публічний export.     |
| Таблиця/форма | `libs/admin/references/feature/src/components/garment-parts/` або `ui/src/` лише за реального повторного використання; Data Grid та MUI form не викликають HTTP. |
| Data-access   | `libs/admin/references/data-access/src/garment-parts/`: generated operation types на межі, runtime-перевірка, mapping, транспорт і помилки.                      |
| Модель        | Типи застосунку та чисті правила без React/HTTP; стан списку, вибір і повторне читання належать hooks у `feature/src/hooks/`.                                    |
| Меню          | Активувати пункт тільки разом із route згідно з SDD меню; не додавати другий пункт для вкладки.                                                                  |

Тестувати loading/empty/error, клавіатуру й фокус, успіх/помилку запису, підтвердження видалення та прямий URL. Перевірити 320/768/1280 px, темну/світлу тему. Наявні Nx targets `admin-references-feature` і `admin-references-data-access` звірено через `npx nx show project <project> --json`.
