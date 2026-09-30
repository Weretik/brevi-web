# Admin-товар — граф задач

`TS-*` виконує одну відповідальність; `EN-001` готує безпечний Markdown renderer. Усі задачі за `Depends on` реалізовано та перевірено на fixture API до delivery checkpoint. Red до реалізації зафіксовано для TS-001–TS-005; для TS-006–TS-012 це evidence не було збережено, що прямо записано в задачах. Evidence `001-products-table` не переписано.

## Фази планування

- [00 — Поведінка та готовність](phases/00-readiness.md)
- [01 — Спільні правила](phases/01-shared-behavior.md)
- [02 — Стан і дані](phases/02-state-data.md)
- [03 — React Web UI](phases/03-react-web-ui.md)
- [04 — Навігація та browser](phases/04-navigation-browser.md)
- [05 — API](phases/05-api-integration.md)
- [06 — Перевірка](phases/06-verification.md)

| ID     | Одна відповідальність                  | Depends on            | Файл                                  |
| ------ | -------------------------------------- | --------------------- | ------------------------------------- |
| EN-001 | Безпечний Markdown renderer            | немає                 | [EN-001](EN-001-markdown-renderer.md) |
| TS-001 | Повний список і сортування             | немає                 | [TS-001](TS-001-list.md)              |
| TS-002 | Метадані й галерея detail              | немає                 | [TS-002](TS-002-detail-summary.md)    |
| TS-003 | Двомовний описовий контент             | EN-001, TS-002        | [TS-003](TS-003-localized-content.md) |
| TS-004 | Показники Sewing detail                | TS-002                | [TS-004](TS-004-sewing-detail.md)     |
| TS-005 | Показники Ppe detail                   | TS-002                | [TS-005](TS-005-ppe-detail.md)        |
| TS-006 | Ready media та керування фото          | немає                 | [TS-006](TS-006-media.md)             |
| TS-007 | Порядок описових колекцій              | TS-003                | [TS-007](TS-007-content-order.md)     |
| TS-008 | Порядок і правила Sewing форми         | немає                 | [TS-008](TS-008-sewing-form.md)       |
| TS-009 | Вибір PPE відсотка                     | немає                 | [TS-009](TS-009-ppe-reference.md)     |
| TS-010 | Підтвердження зміни типу               | немає                 | [TS-010](TS-010-type-change.md)       |
| TS-011 | Повний write та detail після відповіді | TS-002, TS-010        | [TS-011](TS-011-write-result.md)      |
| TS-012 | Порожні стани й API помилки            | TS-006, TS-011        | [TS-012](TS-012-states-errors.md)     |
| TS-013 | Наскрізна регресія та delivery         | EN-001, TS-001–TS-012 | [TS-013](TS-013-regression.md)        |

Кожна виконувана задача завершує `Робота` перевіркою відповідальностей змінених файлів і записом у `code-audit/audit.md`. Окремі секції залишаються цілісними, якщо поділ не додає зрозумілості чи тестованості.
