# Маршрутизація для AI

1. Звір фактичні apps, targets і test tooling з
   [frontend inventory](architecture/frontend-inventory.md).
2. Для feature-роботи відкрий [індекс специфікацій](specs/README.md), README
   потрібної feature та [AI workflow](specs/_templates/ai-feature-workflow/README.md).
3. Застосуй [testing rules](standards/testing-rules.md),
   [delivery rules](standards/delivery-rules.md) і лише релевантні architecture,
   UI, API та security standards.
4. Для нової специфікації використай
   [feature template](specs/_templates/README.md); код до погодження не реалізуй.

Дотримуйся всіх `AGENTS.md` на шляху до файлів, які змінюєш. Не вважай
залежність у `package.json` доступним test level без config, target і
виконуваного test file.
