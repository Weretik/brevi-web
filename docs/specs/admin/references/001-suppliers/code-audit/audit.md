# Локальний аудит постачальників: відповідальності та межі

- **Дата:** 2026-11-02.
- **Обсяг:** поточна реалізація `/references/supplier`, компоненти й hooks постачальників, їхні model/data-access та публічні експорти. Це локальна перевірка за запитом власника, не повний аудит застосунку.
- **Метод:** `web-frontend:frontend-code-audit`, застосовні перевірки UI, стану, публічних меж і фізичної структури; додатково `mui-admin-ui` для єдиного власника локалі.
- **Статус:** verified locally; AF-001–AF-003 закриті свіжими перевірками у TS-007. Статус стосується лише цього локального аудиту.
- **Залежна реалізація:** [TS-006](../tasks/TS-006-workshop-page.md). Її попередні результати тестів є історичними свідченнями функціональної перевірки, а не підтвердженням відсутності наведених порушень.
- Первинний аудит був без змін runtime-коду. Після окремого запиту власника всі три знахідки виправлено в [TS-007](../tasks/TS-007-audit-fixes.md). Початкові описи нижче збережено як історію виявлення.
- [Історичний аудит 2026-09-27](audit-2026-09-27.md) збережено окремо без зміни початкового вмісту.

## Джерела правил

- `AGENTS.md`: цільові межі, обсяг перевірок, збереження сторонніх змін.
- `docs/standards/admin/admin-code-organization.md`: Libraries and dependencies, Role folders, Nesting and size, Pages/routes/links.
- `docs/architecture/admin/structure/domains.md`: власники feature/data-access/model/ui.
- `docs/architecture/admin/runtime/state-and-api.md`: RTK Query і Forms.
- `docs/standards/admin/admin-ui.md`: українська локаль та компоненти.
- `/workspace/obsidian/plugins/web-frontend/skills/frontend-code-audit/SKILL.md`: локальний аудит і фіксація AF-*.
- `/workspace/obsidian/plugins/web-frontend/skills/mui-admin-ui/SKILL.md:20`: локалізація через спільну тему, без дублювання localeText у кожній таблиці.

## Знахідки

### AF-001 — Локальна localeText втрачає доповнення спільної теми

- **Severity / status:** medium / verified.
- **Походження:** додано під час поточного редизайну.
- **Owner:** admin/references/ui.
- **Свідчення:** `libs/admin/references/ui/src/components/suppliers/suppliers-grid.tsx:122` передає власний localeText із пакета ukUA. Спільна тема в `apps/admin-react/src/app/theme/brevi-theme.ts:31` окремо додає український `columnMenuAriaLabel`, якого немає в пакеті ukUA цієї версії.
- **Правило:** `mui-admin-ui/SKILL.md:20`, Admin UI Rules / Language and components — локаль має спільного власника, системні назви українською.
- **Вплив:** MUI getThemeProps замінює localeText цілком, а не об'єднує його ключі. Data Grid потім додає англійські defaults, тому кнопка меню колонки втрачає назву `Меню стовпця Назва` й отримує `Назва column menu`. Подальші виправлення словника в темі також не діятимуть тут.
- **Перевірка:** Node-відтворення з установленими `createTheme`, `getThemeProps` та ukUA: спільна тема повертає `Меню стовпця Назва`, а конфігурація таблиці має `columnMenuAriaLabel === undefined`. Код установленого Data Grid (`DataGrid/useDataGridProps.mjs`) підтверджує доповнення англійськими defaults; ukUA.mjs залишає цей ключ закоментованим.
- **Target:** лишити локаль спільній темі, а тексти порожніх станів винести в overlay; альтернативно об'єднувати локальні зміни з localeText саме поточної теми, зберігаючи її доповнення.
- **Залежна задача:** TS-006, SC-006; виправлення: TS-007.
- **Закриття:** таблиця об’єднує власні тексти станів із localeText поточної теми; імпорт ukUA з таблиці прибрано. Integration test з реальною lightTheme/darkTheme повертає український columnMenuAriaLabel — 2 passed.
- **Потрібне свідчення закриття:** компонентний тест із реальною темою Brevi на українську доступну назву меню колонки та регресія трьох порожніх станів.

### AF-002 — Діалог одночасно координує збереження і реалізує форму

- **Severity / status:** medium / verified.
- **Походження:** існувало до редизайну; файл змінювався в поточній роботі, але ця межа лишилася.
- **Owner:** admin/references/feature та admin/references/ui.
- **Свідчення:** `libs/admin/references/feature/src/components/suppliers/supplier-dialog.tsx:29` підключає useSupplierEditor і збереження; той самий компонент з `:60` містить Dialog, усі поля, field errors, submit/Enter, посилання й кнопки режимів create/view/edit.
- **Правило:** admin-code-organization.md:8–9,73 — feature передає дані й callback-и до ui, форми отримують значення та обробники через props; state-and-api.md:66–69 — форма не володіє API-сценарієм.
- **Вплив:** змінити або перевірити відображення форми окремо від RTK Query/провайдера неможливо. Зміни полів і сценарію збереження мають одного власника в одному компоненті, хоча таблиця й інші форми домену вже мають межу feature → ui.
- **Target:** залишити невеликий feature-контейнер із useSupplierEditor; винести цілісне відображення діалогу/форми до ui з props для draft, errors, mode, saving, message та callbacks. Не потрібно розділяти кожне поле або самі режими на окремі компоненти.
- **Залежна задача:** TS-003 / TS-006; виправлення: TS-007.
- **Закриття:** feature SupplierDialog — 30-рядковий контейнер; SupplierEditorDialog у ui/dialogs/suppliers отримує дані й callback-и. Режим і створення draft — model/forms. 3 standalone UI tests проходять без API-провайдера; 18 page tests підтверджують перегляд, перехід до редагування, збереження, Enter, помилки й інші сценарії.
- **Потрібне свідчення закриття:** компонент відображення рендериться без AdminApiProvider; регресія перегляду, Enter, помилок полів і збереження через існуючі компонентні тести сторінки.

### AF-003 — Перевірка невідомої відповіді API знаходиться всередині mapper

- **Severity / status:** low / verified.
- **Походження:** існувало до редизайну; mapper не змінювався ним.
- **Owner:** admin/references/data-access.
- **Свідчення:** `libs/admin/references/data-access/src/mappers/suppliers/suppliers.mapper.ts:6` приймає unknown; рядки 7–20 перевіряють масив, об'єкти й поля, а рядок 22 приводить результат до generated DTO. Окремої перевіреної вхідної моделі mapper не отримує.
- **Правило:** admin-code-organization.md / Role folders — API response validation належить data-access/validators, mapper отримує перевірені дані; фаза 04 frontend-code-audit прямо перевіряє цю межу.
- **Вплив:** перевірка транспортної форми й перетворення в Supplier не мають окремих контрактів і тестових меж. Це структурний борг, а не доказ некоректного поточного результату API.
- **Target:** виділити перевірку відповіді в data-access/validators/suppliers; mapper перетворює вже перевірені дані на Supplier. Не експортувати parser/DTO назовні data-access.
- **Залежна задача:** TS-001; виправлення: TS-007.
- **Закриття:** unknown перевіряє parseSuppliersResponse у validators/suppliers; private generated alias — contracts/suppliers; mapper приймає перевірений тип і явно формує Supplier. Endpoint композиційно викликає validator → mapper. 19 validator/mapper/API tests passed, включно з відхиленням некоректного payload через endpoint.
- **Потрібне свідчення закриття:** тести некоректного payload та регресія перетворення/запиту списку; імпорти через публічні API лишаються чинними.

## Початкові рішення split / keep

| Файл або область                             | Рішення                | Підстава                                                                                                                                                                             |
| -------------------------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| suppliers-page.tsx, 137 рядків               | keep                   | Координує query, локальний пошук, вибір і відкриття діалогів; таблицю та toolbar уже винесено. Простий стан не потребує додаткового reducer чи hook лише заради кількості рядків.    |
| suppliers-grid.tsx, 166 рядків               | keep; виправити AF-001 | Колонки, параметри Data Grid і з'єднання меню — один життєвий цикл таблиці. API/router/generated DTO сюди не потрапляють. Конфігурація колонок сама по собі не вимагає нового файла. |
| ui/components/suppliers, 6 production-файлів | keep                   | Toolbar, таблиця, меню, link cell, footer і підтвердження видалення мають окремі ролі. Поріг проєкту для обов'язкового перегляду папки — 8, його не досягнуто.                       |
| feature/hooks/suppliers, 3 production-файли  | keep                   | Завантаження, редагування і видалення мають різні сценарії; серверні дані лишаються у RTK Query.                                                                                     |
| supplier-dialog.tsx                          | split                  | Окремі власники сценарію й відображення форми: AF-002.                                                                                                                               |
| suppliers.mapper.ts                          | split                  | Різні контракти перевірки unknown та перетворення: AF-003; причина не в розмірі файла.                                                                                               |
| supplier-link.ts і SupplierLinkCell          | keep                   | Чисте перетворення URL відокремлено від MUI-відображення; доступ через public model export.                                                                                          |

## Свідчення первинного аудиту

- Публічні імпорти постачальників використовують alias і root index.ts; внутрішні компоненти меню/комірки/footer не додані в публічний barrel без потреби.
- Пошук у supplier-ui та supplier-link model за API/router/generated DTO не знайшов таких імпортів. У ui немає транспортних викликів.
- Метадані бібліотек та eslint depConstraints задають feature → ui/model/data-access, ui → model. Окремий негативний тест правил імпорту під час цього локального аудиту не запускався.
- Наявні тести сторінки, link cell і URL переглянуто. Вони перевіряють поведінку, але не доводять відсутності структурних AF-002/AF-003 і не відтворюють AF-001 із реальною темою.
- Попередні тести не повторювалися без зміни runtime-коду. Повний аудит, build, E2E і браузерні перевірки не виконувалися.
- Нове свідчення AF-001 отримано без браузера; загальна shell-команда завершилася 1 через наступний rg без збігів (очікуваний результат пошуку), Node-відтворення завершилося успішно.

Рекомендований порядок виправлення: AF-001 (нова регресія локалі), AF-002 (межа форми), AF-003 (борг transport validation). За запитом на перевірку виправлення не виконуються автоматично.

## Перевірка після виправлень — TS-007

- **Підсумок:** AF-001, AF-002, AF-003 — verified. Відкритих знахідок цього локального аудиту не залишилося.
- feature → ui/model/data-access збережено; ui не імпортує API, router, feature або generated contracts; model/forms не імпортує React чи HTTP; DTO/validator/mapper не додані до публічного data-access index.ts.
- Контейнер форми залишено у feature, цілісне відображення — у ui/dialogs. Немає потреби розділяти окремі поля або додавати новий reducer. У ui/components/suppliers лишається 6 production-файлів, у ui/dialogs/suppliers — 1.
- Перевірено task-scoped diff: без raw HTML, нового транспорту, маршрутів чи токенів; RTK Query лишається власником серверного стану, таблиця — з віртуалізацією й пагінацією. Nullable payload і невідповідні типи перевіряються на транспортній межі.
- Свіжі результати: 42 focused tests (2 theme integration + 3 form UI + 19 validator/mapper/API + 18 page), exit 0. Typecheck тестових і транзитивних runtime-меж feature/ui/data-access — exit 0; scoped ESLint — exit 0. Точні команди у TS-007.
- Браузерні перевірки, E2E, production build, повні набори перевірок, commit, push і публікація в цій задачі не виконувалися.
