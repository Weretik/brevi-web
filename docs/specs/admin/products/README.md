# Список товарів Admin

- **Статус:** implemented — актуальна React Admin реалізація розміщена в доменних бібліотеках
- **Поверхня:** React Web
- **Оновлено:** 2026-10-01

Специфікація описує пошук, фільтри, server sorting/pagination і стани списку
товарів. Актуальна реалізація має окремі `model`, `data-access`, `ui` і
`feature` бібліотеки в `libs/admin/products/`; `apps/admin-react` компонує
маршрути через їхні кореневі public API.

## Навігація

- [Канонічні правила та сценарії](requirements.md)
- [Повна застаріла специфікація](product-list-data-grid.md)
- [Трасування сценаріїв](traceability.md)
- [Граф решти задач](tasks/README.md)
- [Застарілі фази](phases/01-admin-api-contract.md)
- [Як попросити AI продовжити роботу](USAGE.md)

Історичні phase records залишаються свідченням попередніх delivery-кроків.
Поточні архітектурні шари та межі визначені в
[`docs/architecture/admin/domains.md`](../../../architecture/admin/domains.md).

Нова окрема SDD [«Таблиця та дії з товарами»](001-products-table/README.md)
враховує поточний backend OpenAPI та запит на CRUD. Вона не змінює історичні
свідчення цього blocked draft; розбіжність endpoint узгоджується її EN-001.

[Доповнення до повного Admin-сценарію товару](002-admin-product-scenario/README.md)
описує наступні кроки для таблиці, картки, форм, двомовного контенту й станів.

[Наступна SDD для таблиці й окремих сторінок](003-products-table-pages/README.md)
описує контекстне меню рядка, повну українську локалізацію MUI Data Grid,
білі поверхні фільтрів і карткову композицію detail/create/edit.
