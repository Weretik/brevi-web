# Постачальники — проєктування frontend

## Перевірений контекст

- Angular-джерело таблиці, діалогів і контекстних дій: `libs/admin/feature/references/src/lib/pages/supplier/` та `libs/admin/feature/references/src/lib/components/dialogs/`.
- Старий transport: `libs/admin/data-access/src/lib/references/suppliers/suppliers.api.ts`; backend controller: `src/Modules/Reference/Reference.Api/Reference.Api/Controllers/` у BreviERP.
- React route `/references/supplier` підключений через `apps/admin-react/src/app/router/app-router.tsx` і публічний export `libs/admin/references/feature/src/index.ts`. `apps/admin-react` має shell, Vitest, Playwright та lint/typecheck/build; нові `libs/admin/references/feature` і `data-access` мають власні Nx targets.
- Візуальна композиція: [приклад таблиці](../../../assets/visual-references/customers-search-list.png) і [приклад форми](../../../assets/visual-references/customer-create.png); це зразки структури, не полів чи бренду. Застосовувати Brevi MUI theme й безкоштовний `@mui/x-data-grid`, без PrimeNG у React.

## Межа сторінки й таблиці

- Сторінка `/references/supplier` містить одну таблицю без вкладок.
- Старі колонки: ID, назва, телефон, контактна особа, нотатки, посилання. Показувати тільки поля, підтверджені канонічним OpenAPI та runtime mapper; розбіжності оформити як backend blocker до UI.
- Дії: створення, перегляд, редагування, одиночне й масове видалення з підтвердженням. Поля форми: назва, телефон, контактна особа, нотатки й посилання; правила полів звірити з OpenAPI та чинною формою.
- Зберігати старий бізнес-результат, але будувати новий MUI UI: заголовок, доступний toolbar з наявними діями, Data Grid, рядкове меню, MUI Dialog/Drawer і підтвердження. Не копіювати PrimeNG DOM чи фіктивні можливості референсу.
- Старий endpoint повертає список без серверної пагінації. Якщо чинний OpenAPI підтвердить це, Data Grid сортує й розбиває вже завантажені рядки на клієнті; не заявляти серверну пагінацію. Якщо контракт зміниться — оновити рішення окремо.

## Відповідальності

| Область       | Власник                                                                                                                                                                                         |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Page/route    | `libs/admin/references/feature/src/pages/suppliers-page.tsx` компонує одну таблицю й локальні діалоги; `apps/admin-react/src/app/router/app-router.tsx` підключає route через публічний export. |
| Таблиця/форма | `libs/admin/references/feature/src/components/suppliers/` малює Data Grid, форму та підтвердження; компоненти не викликають data-access.                                                        |
| Стан і дії    | `libs/admin/references/feature/src/hooks/` містить read lifecycle, збереження форми та підтверджене видалення з відновленням selection.                                                         |
| Data-access   | `libs/admin/references/data-access/src/suppliers/` містить HTTP, generated operation types на межі, runtime-перевірку й mapping; повтор read після write виконує feature hook.                  |
| Модель        | Типи застосунку та чисті правила без React/HTTP; окремий `model` лише коли потрібен спільний власник.                                                                                           |
| Меню          | Активувати пункт тільки разом із route згідно з SDD меню; не додавати другий пункт для вкладки.                                                                                                 |

Тестувати loading/empty/error, клавіатуру й фокус, успіх/помилку запису, підтвердження видалення там, де воно існує, а також прямий URL. Перевірити 320/768/1280 px, темну/світлу тему. Під час TS-001/TS-002 додати потрібні Nx targets для нових бібліотек і звірити їх через `npx nx show project <project> --json`; не вважати їх наявними.

## Межі code-audit

Перед аудитом `supplier-dialog.tsx` змішував MUI-поля зі збереженням через data-access, а `suppliers-page.tsx` — grid presentation із batch delete й reconciliation вибору. Аудит розділяє ці незалежні ролі в межах уже наявної feature library: `hooks/use-supplier-editor.ts`, `hooks/use-supplier-deletion.ts`, `components/suppliers/suppliers-grid.tsx` і `components/suppliers/supplier-delete-dialog.tsx`. Validation лишається чистою функцією у `model/supplier-validation.ts`, доступною hook і формі без залежності hook від UI-каталогу. Transport і runtime mapper залишаються в data-access. Спільний contract tooling, generated type-only library, router і Angular-джерело не змінюють відповідальності.
