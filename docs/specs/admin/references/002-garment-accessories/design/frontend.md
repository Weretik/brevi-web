# Фурнітура виробу — проєктування frontend

## Перевірений контекст

- Angular-джерело таблиці, діалогів і контекстних дій: `libs/admin/feature/references/src/lib/pages/garment-accessory/` та `libs/admin/feature/references/src/lib/components/dialogs/`.
- Старий transport: `libs/admin/data-access/src/lib/references/garment-accessories/garment-accessories.api.ts`; backend controller: `src/Modules/Reference/Reference.Api/Reference.Api/Controllers/` у BreviERP.
- React route `/references/garment-accessory` підключено в `apps/admin-react/src/app/router/app-router.tsx`; feature/data-access живуть у `libs/admin/references/`. Nx lint/typecheck/test, build і Playwright E2E перевірені.
- Візуальна композиція: [приклад таблиці](../../../assets/visual-references/products-list.png) і [приклад форми](../../../assets/visual-references/product-create.png); це зразки структури, не полів чи бренду. Застосовувати Brevi MUI theme й безкоштовний `@mui/x-data-grid`, без PrimeNG у React.

## Межа сторінки й таблиці

- Сторінка `/references/garment-accessory`; активна вкладка: «Фурнітура виробу». «Тканини» будуть додані за SDD 003, тому зараз не показані. 001-suppliers — список постачальників для форми.
- Старі колонки: ID, назва, постачальник, ціна. Показувати тільки поля, підтверджені канонічним OpenAPI та runtime mapper; розбіжності оформити як backend blocker до UI.
- Дії: створення, перегляд, редагування, одиночне й масове видалення з підтвердженням. Поля форми: назва, постачальник і ціна; вибір постачальника використовує перевірену модель.
- Зберігати старий бізнес-результат, але будувати новий MUI UI: заголовок, доступний toolbar з наявними діями, Data Grid, рядкове меню, MUI Dialog/Drawer і підтвердження. Не копіювати PrimeNG DOM чи фіктивні можливості референсу.
- Чинний OpenAPI повертає список без серверної пагінації. Data Grid сортує й розбиває завантажені рядки на клієнті. Backend повертає 404 для порожнього списку; data-access перетворює саме цей collection GET на `[]`.

## Відповідальності

| Область       | Власник                                                                                                                                                                |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Page/route    | `libs/admin/references/feature/src/pages/` компонує вкладки й локальні взаємодії; `apps/admin-react/src/app/router/` підключає route через публічний export.           |
| Таблиця/форма | `libs/admin/references/feature/src/components/garment-accessories/` або `ui/src/` лише за реального повторного використання; Data Grid та MUI form не викликають HTTP. |
| Data-access   | `libs/admin/references/data-access/src/garment-accessories/`: generated operation types на межі, runtime-перевірка, mapping, кеш і invalidation.                       |
| Модель        | Типи застосунку та чисті правила без React/HTTP; окремий `model` лише коли потрібен спільний власник.                                                                  |
| Меню          | Активувати пункт тільки разом із route згідно з SDD меню; не додавати другий пункт для вкладки.                                                                        |

Залежність селектора: постачальники для вибору у формі. Вона має власну contract operation і перевірку відповіді; не покладатися на ручні Angular DTO.
Тестувати loading/empty/error, клавіатуру й фокус, успіх/помилку запису, підтвердження видалення там, де воно існує, а також прямий URL. Перевірити 320/768/1280 px, темну/світлу тему. Під час TS-001/TS-002 додати потрібні Nx targets для нових бібліотек і звірити їх через `npx nx show project <project> --json`; не вважати їх наявними.
