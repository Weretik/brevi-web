# TS-006 — Сторінка постачальників у стилі «Цех»

- **Covers:** SC-006–SC-010; регресія SC-002–SC-005.
- **Depends on:** реалізовані TS-001–TS-005; чинна тема «Цех».
- **Test level:** component; unit для безпечного посилання.
- **Status:** verified locally with mock API, 2026-11-02.

## Work

Застосувати [ревізію](../design/workshop-revision.md) до сторінки, панелі інструментів і таблиці; зберегти API та діалоги. Оновити компонентні перевірки й картку feature.

## Evidence

- **Red:** перед реалізацією `vitest run suppliers-page.component.test.tsx` показав 12 очікуваних невідповідностей: відсутні пошук, видима кнопка меню та нова назва дії створення (SC-006–SC-009). Це поведінкові невідповідності, не помилка harness.
- **Green / regression:** `vitest run suppliers-page.component.test.tsx --reporter=dot` — 17 passed. Фінальний повтор через `npx nx test admin-references-feature -- suppliers-page.component.test.tsx` — passed. Перевірено пошук за трьома полями, порожній результат, очищення, збереження прихованого вибору й підтвердження його видалення, клавіатурне меню, фокус, оновлення без скидання пошуку, блокування повторного запиту, повтор після помилки та наявні CRUD-сценарії.
- `vitest run` у `admin-references-ui` — 4 passed (2 files); `npx nx test admin-references-ui` — passed. `vitest run supplier-link.unit.test.ts` у `admin-references-model` — 11 passed. Нормалізацію посилань винесено з поточного діалогу без зміни її правил.
- ESLint змінених файлів feature/ui/model, `tsc --noEmit -p tsconfig.spec.json` для feature/ui та `tsc --noEmit -p tsconfig.lib.json` для feature/ui/model — passed.
- Початкові Nx-команди не запускали дочірні перевірки коректно в sandbox; повтор з `NX_DAEMON=false NX_ISOLATE_PLUGINS=false NX_NATIVE_COMMAND_RUNNER=false` пройшов. Додатково виконано безпосередні команди наявних Nx-targets.
- **Refactor / structure:** API й вибір лишилися у feature; toolbar, footer, link cell та меню — у ui; нормалізація URL — у model через публічний export. Спільний hook меню зберігає попередні обробники та додає відкриття з кнопки; перехід у діалог не планує повернення фокуса за модальне вікно. Зайвий відступ сторінки прибрано, бо його надає shell.
- **Browser visual check:** реальний dev-застосунок з перехопленим mock API, Chromium, 1680×1050 (світла/темна тема й меню) та 390×844 (світла тема). JS page errors: 0; ширина документа на телефоні 390 px при viewport 390 px. Скріншоти: `/workspace/scratch/brevi-suppliers/suppliers-light.png`, `suppliers-actions.png`, `suppliers-dark.png`, `suppliers-mobile.png` у тій самій папці. Це локальні артефакти перевірки; дані mock не включені в застосунок.
- `npm run docs:check` — passed (546 Markdown files на момент перевірки); `git diff --check` — passed.

## Checkpoint

SC-006–SC-010 реалізовані й перевірені локально. Live backend, production build, E2E, повний набір тестів, коміт, push і публікація не виконувалися: вони не входили в запит. Історичний SDD `010` лишається закритим.
