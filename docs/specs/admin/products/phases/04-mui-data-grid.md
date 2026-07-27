# Фаза 4: MUI Data Grid для товарів

**Статус:** implemented — ручна перевірка очікується
**Залежить від:** [фаза 3](03-list-state-and-toolbar.md)  
**Блокує:** фазу 5

## Мета

Відобразити результат запиту у керованому MUI Data Grid із серверними
пагінацією та сортуванням.

## Межі

- У межах: додавання сумісного `@mui/x-data-grid`, колонки, controlled
  pagination/sort models, loading/empty/error overlays, retry та адаптивність.
- Поза межами: Data Grid Pro/Premium, редагування рядків, selection, експорт,
  bulk actions, навігація до товару, категорії та SKU.

## Контракт UI

- Колонки: фото, ID, товар, ціна, наявність, ознаки «Акція»/«Новинка».
- `paginationMode="server"`, `sortingMode="server"`; client filtering не
  використовується.
- Page sizes: `10`, `20`, `30`, `50`.
- Зміна page або page size оновлює reducer; зміна sort також скидає page на 1.
- Один sort model: за спроби multi-sort використовується перше поле, бо API
  має один `Sort`.

## Сценарії

1. Given `totalRecords`, when Data Grid відображається, then він показує
   правильну кількість сторінок без завантаження всього каталогу.
2. Given зміна sort, when користувач натискає заголовок доступної колонки, then
   виконується серверний запит з відповідним `Sort`.
3. Given помилка hook, when користувач натискає «Повторити», then повторюється
   запит з тим самим query.

## Критерії приймання

- [x] Використано `@mui/x-data-grid` community package без нових UI-бібліотек.
- [x] Рядки, `rowCount`, loading, empty та error правильно обробляються.
- [x] Ціна `null`, фото без URL та відсутні ознаки не ламають таблицю.
- [x] На ширині 320 px таблиця лишається доступною через внутрішню горизонтальну
      прокрутку й keyboard navigation.

## Перевірка

- `npx nx lint admin-products-ui`.
- `npx nx lint admin-products-feature`.
- `npx tsc --noEmit --project libs/admin/products/ui/tsconfig.lib.json`.
- `npx tsc --noEmit --project libs/admin/products/feature/tsconfig.lib.json`.
- `npx nx typecheck admin`.
- `npx nx build admin`.
- Ручно перевірити всі стани, pagination, sort, 320/768/1200 px і light/dark.

## Результат реалізації

- Додано `@mui/x-data-grid` 9.10.1, сумісний з поточними MUI 9 і React 19.
- `ProductsDataGrid` у `@admin/products/ui` відображає фото, ID, назви,
  ціну, наявність та ознаки; фото без URL, `null` ціна й порожні ознаки мають
  безпечні fallback-стани.
- `ProductsPage` викликає `useGetProductsListQuery` з applied query та передає
  дані, loading/error/retry і `rowCount` у grid.
- Grid використовує `paginationMode="server"` і `sortingMode="server"`;
  pagination і клік по заголовку оновлюють feature reducer. Сортування прибрано
  з toolbar, щоб не дублювати Data Grid.
- Type-check UI/feature, lint UI/feature, type-check app і production build
  завершилися успішно.

## Історія змін

- 2026-07-25: реалізовано server-side Data Grid; ручна перевірка в браузері
  лишається перед прийняттям фази.
