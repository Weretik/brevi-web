# Карта функціональностей Brevi Web

**Звірено з маршрутами та кодом:** 2026-10-16. Це карта реалізації, а не перелік майбутніх SDD. Статус окремого сценарію перевіряй у коді та пов'язаній специфікації.

У кожній картці «Схема будови» показує зв'язки частин, а «Структура в коді» — фактичні каталоги й ключові файли з їхніми ролями. Окремі дерева для `apps/` і `libs/` не підмінюють архітектурну документацію.

## Admin React (`apps/admin-react`)

- Основа Admin: [оболонка, навігація і сесія](admin/shell.md).
- Товари: [список, деталі, створення і редагування](admin/products/products.md); [медіатека](admin/products/media.md).
- Довідники: [постачальники](admin/references/suppliers.md); [фурнітура і тканини](admin/references/materials.md); [елементи виробу і роботи](admin/references/garment-parts.md); [додаткові довідники](admin/references/additional-references.md).

## Storefront Angular (`apps/storefront`)

- Основна сторінка: [головна](storefront/home.md).
- Каталог: [список товарів і сторінка товару](storefront/catalog.md).
- Інформація: [контакти](storefront/information/contacts.md); [про компанію та інформаційні сторінки](storefront/information/about-us.md); [регіони](storefront/information/regions.md).
- Замовлення: [оптове замовлення](storefront/order-in-bulk.md).
- Навігація: [сторінка 404](storefront/not-found.md).

`apps/storefront/src/app/app.routes.ts` збирає локалізовані маршрути `/uk` і `/ru`; `apps/admin-react/src/app/router/app-router.tsx` збирає маршрути Admin. Специфікації вимог і задач — в [окремому індексі SDD](../specs/README.md); ця карта пояснює наявний код і зв'язки. Нову feature додай сюди одночасно з її коротким описом, а після зміни архітектури онови відповідну сторінку.
