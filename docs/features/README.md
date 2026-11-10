# Brevi Web feature map

**Checked against routes and code:** 2026-10-16. This is a map of the implementation, not a list of future SDDs. Verify an individual scenario's status in the code and its related specification.

In each feature card, “Structure diagram” shows relationships between parts, “Code structure” shows actual directories and key files with their roles, and “Tests” lists test files with the focused run command. Separate trees for `apps/` and `libs/` do not replace architecture documentation.

## Admin React (`apps/admin-react`)

- Service manager: [«КП»: list, «Товари та ціни» editor, «КП для знайомства» with ready templates, PDF, Gmail sending and «Налаштування КП»](admin/quotes.md); [client card from KeepinCRM](admin/clients.md); [manager tasks: «Завдання менеджерам» and the «Мої завдання» board](admin/tasks.md); [leads from the Google Sheet: «Мій день», «Усі ліди» and «Статистика лідів»](admin/leads.md); [«Ціна вишивки»: embroidery and chevron price with «Налаштування»](admin/embroidery.md).
- Admin foundation: [shell, navigation, and session](admin/shell.md); [overview page «Огляд виробництва»](admin/dashboard.md).
- Staff accounts: [sign-in users «Користувачі» (Admin only)](admin/users.md); [«Налаштування ШІ»: OpenAI key, models, limit and recognition rules (Admin only)](admin/ai.md); [«Мій кабінет» and the profile menu](admin/profile.md); [«Права доступу»: rights of every role per page, new and deleted roles (Admin only)](admin/access-rights.md).
- Site content: [«Контент»: privacy and terms](admin/content.md).
- Products: [«Товари» tables, details, creation, and editing](admin/products/products.md); [Sewing fabrics and composition](admin/products/sewing-composition.md); [Article calculation and published prices](admin/products/sewing-pricing.md); [PPE pricing and input approval](admin/products/ppe-pricing.md).
- Sewing workshop: [«Швейний цех»: «Виробничі завдання» (етапи, відвантаження, тканина, файли, Telegram), «Склад тканин», «Журнал робіт», «Прогноз пошиття», «Працівники цеху», «Норми витрати тканини», «Правила зарплати», «Робочий час», «Зарплата», «Звіти цеху», «Архів цеху», «Налаштування цеху»](admin/production.md).
- Photos: [«Фото»: photo library with folders, search, upload and usages](admin/media.md).
- Reminders: [Telegram deadline reminders: tasks, periods, chats, days off](admin/reminders.md).
- Accounting: [«Бухгалтерія»: «Огляд», «Операції», «Перекази», «Рахунки і каси», «Категорії», «Контрагенти», «Потребують перевірки», «Виписки банку», «Перенесення архіву», «Звіти», «Журнал змін», «Фінанси» in the client and supplier cards (director only)](admin/accounting.md); [«Рахунки на закупку»: purchase invoices from the sheet «финансы» with payment links to «Бухгалтерія» (director only)](admin/purchasing.md).
- Reference data: [«Контрагенти»: suppliers and clients from KeepinCRM](admin/references/counterparties.md); [suppliers: search, contacts, and CRUD](admin/references/suppliers.md); [fabrics and accessories](admin/references/materials.md); [operations and garment part groups](admin/references/operations.md); [pricing parameters](admin/references/pricing-parameters.md); [«Типи і розділи»: product sections](admin/references/product-sections.md); [«Імпорт цін»: PPE supplier prices](admin/references/price-import.md).

## Site Next.js (`apps/site`)

- Frame: [shell: layout, header with the catalog mega menu, footer, languages, 404](site/shell.md).
- Pages: [home page](site/home.md), [«Виробництво»](site/production.md), [«Доставка та оплата»](site/delivery.md), [«Контакти»](site/contacts.md), [«Повернення та обмін»](site/returns.md), [«Наші роботи»](site/works.md), [«Сертифікати»](site/certificates.md), [«Статті»](site/articles.md), [«Пошиття з логотипом»](site/logo-printing.md).

## Storefront Angular (`apps/storefront`)

- Main page: [home](storefront/home.md).
- Catalog: [product list and product page](storefront/catalog.md).
- Information: [contacts](storefront/information/contacts.md); [company and information pages](storefront/information/about-us.md); [regions](storefront/information/regions.md).
- Orders: [bulk order](storefront/order-in-bulk.md).
- Navigation: [404 page](storefront/not-found.md).

`apps/storefront/src/app/app.routes.ts` assembles localized `/uk` and `/ru` routes; `apps/admin-react/src/app/router/app-router.tsx` assembles Admin routes. Requirements and task specifications have a [separate SDD index](../specs/README.md); this map explains existing code and relationships. Add a new feature here together with its short description, and update the relevant page after architecture changes.

- BreviERP public information: [description, privacy and terms](admin/public-legal-pages.md).
