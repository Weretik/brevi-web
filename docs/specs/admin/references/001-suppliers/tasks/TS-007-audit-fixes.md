# TS-007 — Усунути AF-001–AF-003 локального аудиту

- **Covers:** AF-001–AF-003; SC-001–SC-003, SC-006–SC-010; R-007, R-011 та чинні правила організації коду.
- **Depends on:** реалізація TS-006; [локальний аудит](../code-audit/audit.md).
- **Owner:** admin/references.
- **Scope:** усі три знахідки погоджено до виправлення власником у чаті 2026-11-02.
- **Status:** verified locally with mock API, 2026-11-02.
- **Test level:** component/integration для теми й форми; unit та API integration для перевірки відповіді.

## Work

1. Лишити локаль Data Grid спільній темі, зберігши тексти трьох порожніх станів. Отримати поведінковий Red тесту з реальною темою Brevi.
2. Залишити збереження й локальний стан у feature hook; відображення діалогу винести до ui з даними та callback-ами. Спільний режим і перетворення даних форми належать model/forms.
3. Винести runtime-перевірку unknown до data-access/validators; mapper приймає перевірений контракт і повертає доменну модель; endpoint композиційно викликає обидва. Приватні DTO і parser не стають public API.
4. Після кожної частини перевірити межі відповідальностей; наприкінці оновити feature card, audit status і traceability свіжими свідченнями.

## Verification

Для AF-002/AF-003 це структурне виправлення зі збереженням спостережуваної поведінки: штучний поведінковий Red не потрібний за правилами frontend-code-audit. Замість нього — тести фіксації поведінки й регресія наявних сценаріїв. Нових пакетів, API-операцій, маршрутів і змін спільної теми немає.

Заплановано: вузький integration test локалі у admin-react, supplier UI tests, supplier page tests, validator/mapper tests і supplier API integration. Перевірка типів потрібна для нових меж form props та validated response. Браузер, E2E і повний набір тестів не входять у цю задачу.

## Evidence

- **AF-001 Red:** `vitest run suppliers-grid.integration.test.tsx --reporter=dot` у `apps/admin-react` — 2 failed: фактична назва `Назва column menu` замість `Меню стовпця Назва` у світлій і темній темах. Початковий запит через role не бачив приховану до наведення кнопку; перед зміною runtime тест уточнено через label і він підтвердив саме неправильне значення aria-label.
- **AF-001 Green:** та сама команда — 2 passed, exit 0. Таблиця бере localeText поточної теми й змінює лише noRowsLabel; виправлення спільної теми зберігаються.
- **AF-002:** `vitest run supplier-editor-dialog.component.test.tsx --reporter=dot` у `libs/admin/references/ui` — 3 passed, exit 0, без API-провайдера. Передача змін і Enter, read-only/edit callback та помилки/saving перевірені через props.
- **AF-003:** `vitest run suppliers.mapper.unit.test.ts suppliers-response.unit.test.ts references.api.integration.test.ts --reporter=dot` у `libs/admin/references/data-access` — 19 passed, exit 0. Перевірено неправильні payload/рядки/nullable поля, доменне перетворення й реальний ланцюг endpoint → validator → mapper через mock fetch.
- **Regression:** `vitest run suppliers-page.component.test.tsx --reporter=dot` у `libs/admin/references/feature` — 18 passed, exit 0. Зокрема додано перехід перегляд → редагування → PUT → закриття діалогу; наявні пошук, порожні стани, повтор після помилки, Enter і видалення зберегли поведінку.
- Команди використовували встановлені `node_modules/.bin/vitest` і наявні конфігурації Nx-проєктів. Нових пакетів/runner-ів не додано. Разом 42 focused tests; загальні набори не запускалися.
- **Types:** `tsc --noEmit -p tsconfig.spec.json` у feature, ui та data-access — exit 0. Це перевіряє нові form props/model mode, приватний response contract і транзитивні runtime-імпорти.
- **Lint:** ESLint файлів, змінених у TS-007 (тема/integration test, supplier UI/dialog, feature container/hook/page/test, model forms/index і supplier data-access contract/validator/mapper/API/tests) — exit 0.
- **Structure:** після зміни локалі перевірено єдиного власника словника; після форми — відсутність API у ui й чистий model; після validator — приватність DTO і відсутність unknown/assertions у mapper. Фінально переглянуто весь diff цієї задачі; нових відкритих порушень у її межах не виявлено. Старий аудит 2026-09-27 збережено окремою незмінною копією.
- **Documentation:** feature card/diagram/tree/tests, SDD index, task graph, traceability та поточні статуси AF-* оновлено. `npm run docs:check` — 548 файлів, exit 0; `git diff --check` — exit 0. Поточні файли перевірено Prettier; історичну копію аудиту звірено побайтово з HEAD і не переформатовували.

## Checkpoint

AF-001–AF-003 — verified свіжими перевірками; усі погоджені виправлення завершено локально. Живий backend і публікація не перевірялися та не виконувалися в цій задачі.
