# Поетапне перенесення справочників Admin

Кожна таблиця має власну SDD за `docs/specs/_templates/feature/`. Чотири старі сторінки та URL зберігаються; парні таблиці залишаються вкладками однієї сторінки. Реалізація йде після [меню](../navigation/001-legacy-menu/README.md) і залежить від backend OpenAPI та frontend contract tooling.

| Порядок | Сторінка                             | Таблиця / feature                                          |
| ------- | ------------------------------------ | ---------------------------------------------------------- |
| 1       | `/references/supplier`               | [Постачальники](001-suppliers/README.md)                   |
| 2       | `/references/garment-accessory`      | [Фурнітура виробу](002-garment-accessories/README.md)      |
| 3       | та сама, вкладка «Тканини»           | [Тканини](003-fabrics/README.md)                           |
| 4       | `/references/garment-part-operation` | [Елементи](004-garment-parts/README.md)                    |
| 5       | та сама, вкладка «Роботи»            | [Операції](005-garment-part-operations/README.md)          |
| 6       | `/references/additional-reference`   | [Додаткові довідники](006-additional-references/README.md) |
| 7       | `/references/media`                  | [Медіа/Фото](007-media/README.md)                          |

«Товари» мають окрему [SDD](../products/001-products-table/README.md), бо в Angular Admin це пункт без сторінки. Візуальні правила — [тут](../table-visual-guidance.md).

Наступний узгоджений етап оформлено п'ятьма окремими SDD змін:

- [Тканина та фурнітура](008-garment-materials-pages/README.md);
- [Операції: елементи та роботи](009-operations-pages/README.md);
- [Постачальники](010-suppliers-pages/README.md);
- [Додаткові довідники](011-additional-references-pages/README.md);
- [Товари](../products/003-products-table-pages/README.md) залишаються в домені products.
