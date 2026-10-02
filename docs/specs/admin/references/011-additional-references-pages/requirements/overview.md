# Додаткові довідники — правила та приймальні сценарії

## Мета та межі

- **Актор:** співробітник Admin.
- **Мета:** переглядати, створювати, редагувати й видаляти додаткові довідники
  так само послідовно, як інші таблиці розділу.
- **У межах:** table context menu, українська locale, create/detail/edit routes,
  delete confirmation, current fields, white semantic surfaces.
- **Поза межами:** нові business fields/units, масові дії, зміна формул,
  global tokens, dependency upgrades та implementation без API contract.

## Бізнес-правила

- **R-001:** Таблиця `/references/additional-reference` не має колонки «Дії».
  Правий клік на рядку відкриває «Перегляд», «Змінити», «Видалити» для цього
  запису; delete завжди підтверджується.
- **R-002:** Сфокусований рядок відкриває те саме меню через Context Menu key
  або Shift+F10; action/Escape/click-away закривають його й повертають фокус.
- **R-003:** Усі системні тексти Data Grid українські через централізовану
  MUI/MUI X locale, включно з menus, pagination, filter, no rows/results.
- **R-004:** Окремі routes: `/references/additional-reference/create`,
  `/references/additional-reference/:id`,
  `/references/additional-reference/:id/edit`. Direct URL/reload читає запис
  за ID і розрізняє loading/error/not found/retry.
- **R-005:** Detail є read-only і показує ID, назву, ключ, значення, одиницю й
  опис у білих semantic sections; кнопка «Редагувати» веде до edit.
- **R-006:** Create/edit використовують одну form structure і validation.
  Create має всі user fields порожні/unselected, edit — поточні значення;
  primary action — «Створити запис» або «Зберегти зміни».
- **R-007:** Усі поля лежать у білих MUI Card/Paper. Основні ідентифікаційні
  поля, значення/одиниця й опис утворюють окремі frames за змістом; horizontal
  layout складається вертикально на вузькому viewport.
- **R-008:** Create, GET-by-ID і delete виконуються лише після появи versioned
  OpenAPI operations. До цього відповідні сценарії blocked, а UI не імітує
  локальні CRUD-результати.
- **R-009:** Використовуються готові MUI components і Brevi theme; screenshots
  визначають композицію, не fields або units.

## Приймальні сценарії

### SC-001 — Контекстне меню

**Охоплює:** R-001, R-002

- **За умови** у таблиці є додатковий довідник
- **Коли** співробітник викликає меню мишею або клавіатурою
- **Тоді** бачить три дії правильного рядка без колонки «Дії», а закриття
  повертає фокус.

### SC-002 — Український Data Grid

**Охоплює:** R-003

- **За умови** доступний системний control таблиці
- **Коли** співробітник відкриває його
- **Тоді** всі підписи й повідомлення українські.

### SC-003 — Read-only detail

**Охоплює:** R-004, R-005, R-008

- **За умови** запис існує й detail contract доступний
- **Коли** співробітник відкриває його зі списку або прямим URL
- **Тоді** бачить всі поля лише для читання у білих sections і edit button.

### SC-004 — Спільна create/edit форма

**Охоплює:** R-006–R-008

- **За умови** потрібні CRUD contracts доступні
- **Коли** співробітник створює або редагує запис
- **Тоді** структура однакова, create порожній, edit заповнений, а fields
  згруповані в responsive white frames.

### SC-005 — Збереження й помилки

**Охоплює:** R-004, R-006, R-008

- **За умови** form valid або API повертає validation/not-found/conflict error
- **Коли** співробітник зберігає
- **Тоді** success відкриває actual detail, а failure зберігає введене й
  дозволяє виправлення/retry без duplicate write.

### SC-006 — Видалення

**Охоплює:** R-001, R-008

- **За умови** delete contract доступний і вибрано «Видалити»
- **Коли** співробітник підтверджує або скасовує
- **Тоді** success оновлює список, а cancel/failure не прибирає рядок помилково.

### SC-007 — Адаптивні поверхні

**Охоплює:** R-007, R-009

- **За умови** detail або form відкриті
- **Коли** viewport змінюється
- **Тоді** усі fields/data лишаються у білих logical frames без overflow.
