# TS-001 — Read model і data-access

- **ID задачі:** TS-001
- **Охоплює:** SC-001, SC-005
- **Залежить від:** EN-001, EN-002
- **Точні шляхи:** `libs/admin/references/data-access/src/additional-references/`, `libs/admin/references/feature/src/`
- **Рівень тестування:** модульний + інтеграційний

## Робота

- [x] Перевірено наявні `admin-references-data-access` і `admin-references-feature` targets через `npx nx show project ... --json`; нові libraries не потрібні.
- [x] GET типізовано generated operation, runtime response перевірено й перетворено на модель.
- [x] Loading/empty/error, retry і скасування застарілого read реалізовано; generated DTO не входять у UI.
- [x] Відповідальності перевірено в [аудиті](../code-audit/audit.md).

## Свідчення

- Фокусні тести: `additional-references.mapper.unit.test.ts`, `additional-references.api.integration.test.ts`.
- Red: окремий поведінковий запуск до реалізації не зафіксовано; пропуск TDD evidence.
- Green: `npx nx test admin-references-data-access -- additional-references` — 4/4 пройшли.
- Refactor: transport/error/mapper/model залишені в окремих файлах за наявним зразком; фокусні тести повторено.
- Regression: `npx nx test admin-references-data-access` — 27/27; lint/typecheck і contract check — успішно.

## Контрольна точка

Список повертає перевірені рядки й зрозумілу помилку.
