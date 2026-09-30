# TS-003 — Редагування

- **ID задачі:** TS-003
- **Охоплює:** SC-002, SC-003
- **Залежить від:** TS-002
- **Точні шляхи:** `libs/admin/references/feature/src/components/additional-references/`, `libs/admin/references/data-access/src/additional-references/`
- **Рівень тестування:** компонентний + інтеграційний

## Робота

- [x] Збережено редагування рядка через діалог; створення, видалення та масових дій немає.
- [x] Поля й обмеження звірено з OpenAPI; помилки біля полів, форма лишається відкритою.
- [x] Успішний запис повторно завантажує список; write не повторюється автоматично.
- [x] Відповідальності перевірено в [аудиті](../code-audit/audit.md).

## Свідчення

- Фокусні тести: `additional-references.api.integration.test.ts`, `additional-references-page.component.test.tsx`, `additional-references.spec.ts`.
- Red: окремий поведінковий запуск до реалізації не зафіксовано; пропуск TDD evidence.
- Green: data-access 4/4, component 2/2, browser E2E 2/2 — успішно.
- Refactor: перевірка форми відокремлена від hook, форма від HTTP; фокусні тести повторено.
- Regression: lint/typecheck/build пройшли; повна feature suite 31/31 з `--testTimeout=15000 --maxWorkers=2`, стандартний 5-секундний ліміт нестабільний, див. delivery checklist.

## Контрольна точка

Форма відтворює старий результат з перевіреними даними.
