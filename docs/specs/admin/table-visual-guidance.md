# Візуальні орієнтири для React Admin

Користувач надав двадцять два зображення як приклади списків, форм, меню,
шапки й окремих сторінок деталей. [Усі оригінальні вкладення та їхні нові
імена](assets/visual-references/README.md) збережено в репозиторії. Вони
показують композицію: виразний заголовок, світлу поверхню таблиці, чіткий
toolbar, відділені рядки, помітну дію створення, видимий поточний пункт у
темній навігації та компактну шапку. Форми групують поля за змістом і показують
помилки поруч із полем. Детальна сторінка дає зворотний перехід.

Для нових сторінок create/edit/detail усі поля й дані розміщуються на білих
поверхнях MUI `Card` або `Paper`, а не безпосередньо на фоні сторінки. Великий
обсяг інформації розділяється на семантичні фрейми. На широкому екрані фрейми
можуть стояти поруч, на вузькому — послідовно в одну колонку. Create та edit
використовують одну структуру форми: create починається з порожніх editable
полів, edit завантажує поточні значення. Detail є лише для читання й містить
кнопку переходу до edit.

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

### Окремі сторінки деталей

![Картка документа з окремою білою поверхнею](assets/visual-references/detail-invoice.png)

![Деталі клієнта з незалежними секціями](assets/visual-references/detail-customer-payments.png)

![Деталі замовлення з основною та бічною секціями](assets/visual-references/detail-order-timeline.png)

![Логічні блоки в окремих білих фреймах](assets/visual-references/detail-section-cards.png)

### Сторінки створення й редагування

![Редагування з основною формою та допоміжною карткою](assets/visual-references/edit-product-layout.png)

![Створення клієнта з окремою секцією](assets/visual-references/create-customer-account.png)

![Основні та адресні дані форми](assets/visual-references/create-order-basic-billing.png)

![Логічні секції billing, shipping та additional](assets/visual-references/create-billing-shipping-sections.png)

![Двоколонкові поля всередині білої поверхні](assets/visual-references/create-billing-shipping-form.png)

![Повторювані рядки як окремий блок форми](assets/visual-references/create-order-line-items.png)

![Нижня частина форми й основні дії](assets/visual-references/create-customer-additional-actions.png)

![Підсумок і дії створення](assets/visual-references/create-order-total-actions.png)
