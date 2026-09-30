# Додаткові довідники — проєктування frontend

## Перевірений контекст

- Angular-джерело таблиці, діалогів і контекстних дій: `libs/admin/feature/references/src/lib/pages/additional-reference/` та `libs/admin/feature/references/src/lib/components/dialogs/`.
- Старий transport: `libs/admin/data-access/src/lib/references/additional-references/additional-references.api.ts`; backend controller: `src/Modules/Reference/Reference.Api/Reference.Api/Controllers/` у BreviERP.
- React route підключено в `apps/admin-react/src/app/router/app-router.tsx`; `libs/admin/references/data-access` і `libs/admin/references/feature` мають lint/typecheck/test targets. Код feature розміщено в їхніх каталогах `src/additional-references/`, `src/components/additional-references/`, `src/hooks/`, `src/model/` та `src/pages/`.
- Візуальна композиція: [приклад таблиці](../../../assets/visual-references/customers-search-list.png) і [приклад форми](../../../assets/visual-references/product-edit.png); це зразки структури, не полів чи бренду. Застосовувати Brevi MUI theme й безкоштовний `@mui/x-data-grid`, без PrimeNG у React.

## Межа сторінки й таблиці

- Сторінка `/references/additional-reference` містить одну таблицю без вкладок.
- Старі колонки: ID, назва, ключ, значення з одиницею. Показувати тільки поля, підтверджені канонічним OpenAPI та runtime mapper; розбіжності оформити як backend blocker до UI.
- Дії: перегляд списку й редагування рядка через діалог; створення, видалення та масові дії не показані в чинній Angular-сторінці. Поля форми: назва, ключ, значення, одиниця та опис; редагування з повідомленням про результат.
- Зберігати старий бізнес-результат у MUI UI: заголовок, Data Grid, рядкова кнопка редагування й MUI Dialog. Не копіювати PrimeNG DOM чи фіктивні можливості референсу.
- Старий endpoint повертає список без серверної пагінації. Якщо чинний OpenAPI підтвердить це, Data Grid сортує й розбиває вже завантажені рядки на клієнті; не заявляти серверну пагінацію. Якщо контракт зміниться — оновити рішення окремо.

## Відповідальності

| Область       | Власник                                                                                                                                                                                                                              |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Page/route    | `libs/admin/references/feature/src/pages/additional-references-page.tsx` компонує одну таблицю й локальні взаємодії; `apps/admin-react/src/app/router/` підключає route через публічний export.                                      |
| Таблиця/форма | `libs/admin/references/feature/src/components/additional-references/` або `ui/src/` лише за реального повторного використання; Data Grid та MUI form не викликають HTTP.                                                             |
| Data-access   | `libs/admin/references/data-access/src/additional-references/`: generated operation types на межі, runtime-перевірка й mapping. Локальний стан списку та повторне завантаження після запису належать `use-additional-references.ts`. |
| Модель        | Типи застосунку та чисті правила без React/HTTP; окремий `model` лише коли потрібен спільний власник.                                                                                                                                |
| Меню          | Активувати пункт тільки разом із route згідно з SDD меню; не додавати другий пункт для вкладки.                                                                                                                                      |

Тестувати loading/empty/error, клавіатуру й фокус, успіх/помилку запису, а також прямий URL. Видалення в цій таблиці немає. Перевірити 320/768/1280 px, темну/світлу тему. Під час TS-001/TS-002 звірено наявні targets через `npx nx show project <project> --json`; нові бібліотеки не потрібні.
