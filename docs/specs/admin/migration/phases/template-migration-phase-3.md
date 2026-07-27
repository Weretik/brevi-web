# SDD: міграція шаблону Admin — фаза 3, візуальні примітиви сторінок

**Статус:** виконано 2026-07-23.

## Мета

Підготувати візуальні примітиви з референсного шаблону для сторінок Admin без
перенесення демонстраційних даних, Next.js-коду або неузгодженого API.

## Межі

- `AdminLayout` показує breadcrumbs на кожній захищеній сторінці, крім
  кореневого dashboard. Компонент
  відстежує поточний маршрут, використовує централізовану карту українських
  назв і має fallback для майбутніх маршрутів.
- `ProductsPage` отримує заголовок та оболонку таблиці з informative empty state.
- `admin-products-ui` містить лише `ProductsTableShell`: Card-контейнер,
  горизонтальну прокрутку та типізовані стани `loading`, `empty`, `error`,
  `ready`.
- `admin-products-feature` містить `ProductsPageToolbar`, бо він використовує
  маршрутизацію та належить лише сторінці товарів.
- `StatisticCard` розміщується поруч із dashboard як presentation-компонент і
  показує informative empty state з значенням `—` до появи реальних метрик.
- Візуальний референс: структура верхньої частини customer page, table-card і
  overview cards у [локальному шаблоні](file:///D:/RiderProjects/template).

## Поза межами

- Дані товарів, клієнтів, замовлень і dashboard-метрик.
- Кнопки Import, Export, Add, вибір рядків та пагінація до погодження API.
- Новий shared UI-kit або зміна публічного API `AdminLayout`.

## Сценарії

1. Користувач відкриває `/products`, бачить breadcrumbs, заголовок і читабельний
   empty state каталогу.
2. Надалі feature передає в table shell loading, error або готові рядки без
   зміни компонента оболонки.
3. Breadcrumb `Кабінет` доступний з клавіатури та веде на `/dashboard`; на
   `/catalog` відображається шлях `Кабінет / Каталог товарів`.
4. Dashboard показує stat-cards без вигаданих чисел, коли метрики не підключено.

## Критерії приймання

- На кожній захищеній сторінці немає дублювання розмітки breadcrumbs; на
  `/catalog` немає дублювання toolbar і table-card.
- Table shell має типізовані props та всі чотири стани даних.
- Усі тексти користувача українською; інтерактивні елементи мають доступні назви.
- Не додано фіктивних бізнес-даних або залежностей.

## Перевірка

- Unit test `ProductsPage` перевіряє заголовок і empty state; unit test shell
  перевіряє breadcrumbs для dashboard і каталогу.
- `npx nx lint admin-products-ui`.
- `npx nx lint admin-products-feature`.
- `npx nx build admin`.
- Ручна перевірка на 320px, 768px і 1200px у світлій і темній схемах.

## Результат

- Реалізовано route-aware breadcrumbs у `AdminLayout`, toolbar і table shell каталогу
  та informative empty state statistic cards на dashboard.
- Пройдено `npx nx test admin-core-shell`, `npx nx test admin-products-feature`,
  lint змінених проєктів і `npx nx build admin`.
- Ручна візуальна перевірка не виконана: вбудований браузер був недоступний у
  середовищі виконання.
