# TS-002 — Таблиця MUI X

- **ID задачі:** TS-002
- **Охоплює:** SC-001, SC-002, SC-004
- **Залежить від:** TS-001
- **Точні шляхи:** `libs/admin/references/feature/src/components/additional-references/`, `libs/admin/references/feature/src/pages/`
- **Рівень тестування:** компонентний

## Робота

- [x] Реалізовано MUI X Data Grid з колонками ID, назва, ключ, значення з одиницею та станами loading/empty/error.
- [x] Одна таблиця без неіснуючих import/export/status controls.
- [x] Сортування/пагінація клієнтські; вибір рядків для масових дій вимкнено.
- [x] Відповідальності перевірено в [аудиті](../code-audit/audit.md).

## Свідчення

- Фокусні тести: `additional-references-page.component.test.tsx`, `additional-references.spec.ts`.
- Red: окремий поведінковий запуск до реалізації не зафіксовано; пропуск TDD evidence.
- Green: `npx nx test admin-references-feature -- additional-references-page` — 2/2; фокусний E2E — 2/2.
- Refactor: Grid лишився окремим presentational компонентом; фокусні тести повторено.
- Regression: lint/typecheck/build пройшли; повна feature suite 31/31 з `--testTimeout=15000 --maxWorkers=2`, стандартний 5-секундний ліміт нестабільний, див. delivery checklist.

## Контрольна точка

Рядки та порожній/помилковий стани доступні в Brevi shell.
