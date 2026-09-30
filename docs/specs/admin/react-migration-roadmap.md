# Порядок перенесення React Admin

Цей індекс не замінює окремі SDD. Кожна таблиця має власні правила, API-контракт, задачі й критерії перевірки; чотири сторінки справочників зберігають старі URL, а дві пари таблиць — спільні сторінки з вкладками.

| Крок | SDD                                                                   | Що стає доступним                                          |
| ---- | --------------------------------------------------------------------- | ---------------------------------------------------------- |
| 1    | [Меню та шапка](navigation/001-legacy-menu/README.md)                 | усі старі пункти видимі; активний лише наявний `/`         |
| 2    | [Постачальники](references/001-suppliers/README.md)                   | `/references/supplier`, дані для вибору в наступних формах |
| 3    | [Фурнітура виробу](references/002-garment-accessories/README.md)      | `/references/garment-accessory`, перша вкладка             |
| 4    | [Тканини](references/003-fabrics/README.md)                           | друга вкладка тієї самої сторінки                          |
| 5    | [Елементи виробу](references/004-garment-parts/README.md)             | `/references/garment-part-operation`, вкладка «Елементи»   |
| 6    | [Операції](references/005-garment-part-operations/README.md)          | вкладка «Роботи» тієї самої сторінки                       |
| 7    | [Додаткові довідники](references/006-additional-references/README.md) | `/references/additional-reference`                         |
| 8    | [Товари](products/001-products-table/README.md)                       | новий `/references/products` із підтриманим backend CRUD   |

На кожному кроці пункт меню активується лише після появи реального React route. Неперенесені пункти залишаються недоступними. Backend OpenAPI для Reference-операцій відсутній, а локальний product contract не зафіксований у Git; до початку API-інтеграції кожна SDD вимагає власні `operationId`, pinned backend commit, frontend snapshot і generated types. Спільний [enabler contract tooling](references/001-suppliers/tasks/EN-002-contract-tooling.md) виконується один раз і повторно використовується всіма table-features.
