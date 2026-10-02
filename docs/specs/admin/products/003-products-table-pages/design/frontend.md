# Товари — проєктування frontend

## Наявний контекст

- Маршрути: `apps/admin-react/src/app/router/app-router.tsx`.
- Список: `libs/admin/products/feature/src/pages/product-list/products-page.tsx`; зараз він
  змішує query-state, колонки, фільтри, Data Grid і delete target та має
  колонку «Дії».
- Detail: `product-detail-page.tsx`, `product-detail-header.tsx`,
  `product-detail-content.tsx`, type-specific detail і gallery; дані зараз
  переважно розділені Divider, але не білими семантичними поверхнями.
- Create/edit: `product-create-page.tsx`, `product-edit-page.tsx` і спільний
  `product-editor.tsx`; структура вже спільна, але поля лежать на фоні між
  Divider і основна кнопка має однаковий текст.
- Дані: `libs/admin/products/data-access/src/`, `use-products.ts`,
  `use-product.ts`, `use-product-lookups.ts`; окремий GET за ID уже є.
- Локаль і тема: `apps/admin-react/src/app/theme/brevi-theme.ts`; кожна таблиця
  зараз локально задає лише `noRowsLabel`, тому інші MUI-написи англійські.
- Tooling: `admin-products-feature` і `admin-products-data-access` мають
  `lint`, `typecheck`, `test`; feature також `typecheck-tests`. `admin-react`
  має `lint`, `typecheck`, `typecheck-tests`, `test`, `build`;
  `admin-react-e2e` має `lint`, `typecheck`, `e2e`.

## Відповідальності в межах роботи

| Область           | Відповідальність і точні шляхи                                                                                                          |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Спільна поведінка | Центральна українська MUI/MUI X locale у `apps/admin-react/src/app/theme/`; доповнює офіційну `ukUA` лише активними відсутніми ключами. |
| Стан і дані       | Наявні hooks зберігають query, abort, retry та detail fetch; контекстне меню тримає лише поточний row ID і координати.                  |
| React Web         | `products-page.tsx` або малі локальні компоненти для фільтрів/меню; detail/editor компонують MUI Card/Paper за доменними групами.       |
| Навігація         | Чотири наявні маршрути лишаються; меню веде на detail/edit, detail-кнопка — на edit.                                                    |
| API               | Наявні generated operations і runtime mapping без зміни transport contract.                                                             |
| Перевірка         | Component tests для меню, locale, read-only і спільної форми; integration для routes; один Playwright journey list → detail → edit.     |

## Початковий аудит відповідальностей

| Файл/компонент                  | Наявні ролі та залежності                         | Рішення                                                                                 | Цільові межі                                                                                                         |
| ------------------------------- | ------------------------------------------------- | --------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `pages/products-page.tsx`       | Запит, toolbar, колонки, навігація, delete dialog | Розділити тільки меню й фільтри, якщо component test або читабельність цього потребують | `components/products-list-filters.tsx`, `components/product-row-context-menu.tsx` або лишити малу цілісну композицію |
| `components/product-editor.tsx` | Завантаження lookup, draft, save і весь layout    | Зберегти orchestration; винести лише повторювану поверхню секції                        | `components/product-form-section.tsx` лише за реального повторного використання                                      |
| `pages/product-detail-page.tsx` | Fetch states, actions, усі detail секції          | Зберегти orchestration, Card/Paper належать спеціалізованим detail-компонентам          | наявні `product-*-detail.tsx`                                                                                        |
| `theme/brevi-theme.ts`          | Світла/темна тема та component defaults           | Додати core/data-grid `ukUA` й перевірений override без feature-текстів                 | окремий locale-файл у тій самій папці, якщо набір ключів нетривіальний                                               |

## UI-рішення й референси

- Detail орієнтується на `detail-customer-payments.png`,
  `detail-order-timeline.png` і `detail-section-cards.png`.
- Form орієнтується на `edit-product-layout.png`, `create-order-basic-billing.png`
  та `create-order-line-items.png`. Дані прикладів не переносяться.
- Офіційні MUI-патерни: [контекстне Menu](https://mui.com/material-ui/react-menu/#context-menu),
  [row slot Data Grid](https://mui.com/x/react-data-grid/components/#row),
  [локалізація Data Grid](https://mui.com/x/react-data-grid/localization/),
  [локалізація Material UI](https://mui.com/material-ui/guides/localization/),
  [Card](https://mui.com/material-ui/react-card/) і
  [responsive Grid](https://mui.com/system/react-grid/).
- Встановлена `ukUA` Data Grid неповна, тому acceptance вимагає перевірити всі
  реально доступні меню й додати тільки відсутні українські ключі через
  `localeText`/theme API.

## Ризики

- Після вилучення колонки дій потрібен клавіатурний еквівалент; component та
  E2E evidence мають перевірити фокус і правильний row ID.
- Білий Card/Paper у темній темі є свідомим вимогам цієї feature; контраст
  тексту й полів треба перевірити окремо, не змінюючи глобальну палітру.
- Контекстне меню не повинно перехоплювати меню заголовка Data Grid або ламати
  checkbox selection.
