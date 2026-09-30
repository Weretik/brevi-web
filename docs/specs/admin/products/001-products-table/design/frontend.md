# Товари — проєктування frontend

## Перевірений контекст

- Angular shell мав пункт «Товари» без маршруту. React `apps/admin-react/src/app/router/app-router.tsx` тепер реєструє список, створення, деталі й редагування.
- `docs/specs/admin/products/product-list-data-grid.md` — історичний blocked draft: `/api/admin/products` і припущення про `ProductsPage`/`libs/admin/products/*` не відповідали дереву до цієї feature.
- Backend commit `7178113572c5c0da21ba9f28db5d94f96dc8e1b6` фіксує product CRUD, category lookup і media upload в агрегованому OpenAPI. Frontend snapshot і generated types походять із цього commit.
- React shell, Vitest, Playwright, MUI Material і `@mui/x-data-grid` використовуються повторно. Product data-access і feature libs мають власні Nx lint/typecheck/test targets.

## Сторінки й вигляд

Прямі файли референсів: [таблиця товарів](../../../assets/visual-references/products-list.png), [форма створення](../../../assets/visual-references/product-create.png), [форма редагування](../../../assets/visual-references/product-edit.png) і [вкладене меню](../../../assets/visual-references/products-submenu.png). Вони задають композицію, а не поля чи додаткові дії Brevi.

Маршрути: `/references/products` (список), `/references/products/create` (створення), `/references/products/:id` (деталі), `/references/products/:id/edit` (редагування). Меню має лише один пункт «Товари» до списку; form/detail — дочірні сценарії, не постійні посилання меню.

Візуальний принцип із [прикладів](../../../table-visual-guidance.md): виразний заголовок, одна головна дія, компактні фільтри/toolbar, чіткі рядки, згруповані секції форми, повернення до списку. Кольори, логотип і мова — Brevi. Статуси Published/Draft, SKU, stock, quota, import/export, аватари й rich-text editor не показувати без окремого контракту. Створення/редагування включають всі обов'язкові поля фактичного product write contract, включно з умовними секціями типу товару; category lookup і media upload використовують зафіксовані operationId.

Список використовує серверні `page/pageSize` і `pagedInfo.totalRecords` за підтвердженим OpenAPI. При зміні search/filter/sort повертатися на першу сторінку; debounce або явне підтвердження пошуку описати в задачі UI та перевірити тестом. MUI X Community Data Grid працює у контрольованому режимі; не вимагати Pro/Premium функцій. Якщо сервер не підтримує показаний фільтр, його не показувати.

## Межі відповідальності

| Область     | Власник                                                                                                                                                                 |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Route/pages | `libs/admin/products/feature/src/pages/` і `products.routes.tsx` через public export; app лише компонує маршрути.                                                       |
| UI          | `libs/admin/products/feature/src/components/` або `ui/src/` за реального повторного використання: grid, toolbar, секції форми, стани.                                   |
| Data-access | `libs/admin/products/data-access/src/`: generated types на transport boundary, runtime validation, mapping і HTTP; cancellation у read hooks, довгоживучого кешу немає. |
| Model       | Типи товару/запиту без React та HTTP; окремий `model` тільки за потреби спільної логіки.                                                                                |
| Меню        | Специфікація навігації; активувати пункт після доступності списку.                                                                                                      |

Тести: mapper/error unit, component list/form, integration route, один browser journey create/edit/delete на контрольованому середовищі після появи backend/fixtures. Перевірити 320/768/1280 px, обидві теми, keyboard/focus. Build має дати окремий lazy page chunk згідно з `docs/architecture/admin/application.md`.
