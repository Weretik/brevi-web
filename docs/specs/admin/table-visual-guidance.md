# Візуальні орієнтири для React Admin

Користувач надав десять зображень як приклади списків, форм, меню й шапки. [Усі оригінальні вкладення та їхні нові імена](assets/visual-references/README.md) збережено в репозиторії. Вони показують композицію: виразний заголовок, світлу поверхню таблиці, чіткий toolbar, відділені рядки, помітну дію створення, видимий поточний пункт у темній навігації та компактну шапку. Форми групують поля за змістом і показують помилки поруч із полем. Детальна сторінка дає зворотний перехід.

Це **референс подачі**, не модель даних Brevi і не доказ наявності функцій. Імена Customers/Products, аватари, quota, status, SKU, stock, import/export, мови, notifications, payments, rich-text editor і вигадані записи не переносяться без окремого backend-контракту та feature-SDD. Інтерфейс залишається українським і використовує корпоративну тему Brevi з [shell feature](shell/001-react-admin-shell-theme/README.md).

Для наявних справочників застосовувати MUI Material та безкоштовний `@mui/x-data-grid` (пакет уже є у `package.json`). Зберігати чотири старі сторінки, а їх шість таблиць планувати окремими feature. У двох парних сторінках вкладки означають різні таблиці, а не нові пункти основного меню. Toolbar має показувати лише дії, реалізовані для конкретної таблиці; контекстне меню Angular можна замінити доступним рядковим меню MUI без зміни бізнес-поведінки. Після перенесення кожної feature перевіряти обидві теми та вузький/широкий екран.

## Меню та шапка

![Повне бічне меню як приклад ієрархії та активного пункту](assets/visual-references/admin-sidebar.png)

![Компактна верхня панель як приклад композиції](assets/visual-references/admin-top-bar.png)

![Вкладене меню товарів як приклад рівнів навігації](assets/visual-references/products-submenu.png)

## Таблиці

![Список клієнтів із вкладками станів](assets/visual-references/customers-status-list.png)

![Список клієнтів із пошуком](assets/visual-references/customers-search-list.png)

![Список товарів](assets/visual-references/products-list.png)

## Форми та деталі

![Форма створення клієнта як приклад групування полів](assets/visual-references/customer-create.png)

![Форма створення товару](assets/visual-references/product-create.png)

![Форма редагування товару](assets/visual-references/product-edit.png)

![Детальна сторінка клієнта як приклад подачі інформації](assets/visual-references/customer-detail.png)
