# Тканини — проєктування frontend

## Перевірений контекст

- Angular-джерело таблиці, діалогів і контекстних дій: `libs/admin/feature/references/src/lib/pages/garment-accessory/` та `libs/admin/feature/references/src/lib/components/dialogs/`.
- Старий transport: `libs/admin/data-access/src/lib/references/fabrics/fabrics.api.ts`; backend controller: `src/Modules/Reference/Reference.Api/Reference.Api/Controllers/` у BreviERP.
- React route `/references/garment-accessory` і `libs/admin/references/*` уже були створені для фурнітури й постачальників. Тканини додані другою вкладкою до наявної сторінки.
- Візуальна композиція: [приклад таблиці](../../../assets/visual-references/products-list.png) і [приклад форми](../../../assets/visual-references/product-create.png); це зразки структури, не полів чи бренду. Застосовувати Brevi MUI theme й безкоштовний `@mui/x-data-grid`, без PrimeNG у React.

## Межа сторінки й таблиці

- Сторінка `/references/garment-accessory`; вкладка: «Тканини» на тій самій сторінці, що й «Фурнітура виробу». 001-suppliers і 002-garment-accessories; використовувати спільну сторінку, не створювати другий URL.
- Колонки: ID, назва, постачальник, ціна. У backend response ім'я постачальника має поле `providerName`; runtime mapper перевіряє його перед UI.
- Дії: створення, перегляд, редагування, одиночне й масове видалення з підтвердженням. Поля форми: назва, постачальник і ціна; не дублювати supplier-модель.
- Зберігати старий бізнес-результат, але будувати новий MUI UI: заголовок, доступний toolbar з наявними діями, Data Grid, рядкове меню, MUI Dialog/Drawer і підтвердження. Не копіювати PrimeNG DOM чи фіктивні можливості референсу.
- Старий endpoint повертає список без серверної пагінації. Якщо чинний OpenAPI підтвердить це, Data Grid сортує й розбиває вже завантажені рядки на клієнті; не заявляти серверну пагінацію. Якщо контракт зміниться — оновити рішення окремо.

## Відповідальності

| Область       | Власник                                                                                                                                                                                                 |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Page/route    | `garment-accessories-page.tsx` компонує тільки вкладки; `garment-accessories-content.tsx` і `fabrics-page.tsx` керують локальними діями відповідних таблиць; app router підключає чинний public export. |
| Таблиця/форма | `libs/admin/references/feature/src/components/fabrics/` або `ui/src/` лише за реального повторного використання; Data Grid та MUI form не викликають HTTP.                                              |
| Data-access   | `libs/admin/references/data-access/src/fabrics/`: generated operation types на HTTP-межі, runtime-перевірка і mapping; `use-fabrics.ts` володіє локальним станом read та перезавантаженням після write. |
| Модель        | Типи застосунку та чисті правила без React/HTTP; окремий `model` лише коли потрібен спільний власник.                                                                                                   |
| Меню          | Активувати пункт тільки разом із route згідно з SDD меню; не додавати другий пункт для вкладки.                                                                                                         |

Залежність селектора: наявний `listSuppliers` з operation `getSuppliers` і runtime mapper; Angular DTO не імпортуються.
Тестувати loading/empty/error, клавіатуру й фокус, успіх/помилку запису, підтвердження видалення там, де воно існує, а також прямий URL. Перевірити 320/768/1280 px, темну/світлу тему. Під час TS-001/TS-002 додати потрібні Nx targets для нових бібліотек і звірити їх через `npx nx show project <project> --json`; не вважати їх наявними.
