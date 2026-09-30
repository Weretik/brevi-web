# Граф задач — оболонка React Admin

Фази планування: [готовність](../../../../_templates/feature/tasks/phases/00-readiness.md),
[React UI](../../../../_templates/feature/tasks/phases/03-react-web-ui.md),
[навігація](../../../../_templates/feature/tasks/phases/04-navigation-browser.md),
[перевірка](../../../../_templates/feature/tasks/phases/06-verification.md).
Після `EN-001` виконуйте малі поведінкові задачі за залежностями.

| ID     | Одна відповідальність           | Залежить від   | Файл                              |
| ------ | ------------------------------- | -------------- | --------------------------------- |
| EN-001 | Nx shell library і test target  | немає          | [EN-001](EN-001-shell-project.md) |
| TS-001 | Тема Brevi та режими            | EN-001         | [TS-001](TS-001-brevi-theme.md)   |
| TS-002 | Спільний layout                 | EN-001, TS-001 | [TS-002](TS-002-layout.md)        |
| TS-003 | Доступна навігація              | TS-002         | [TS-003](TS-003-navigation.md)    |
| TS-004 | Композиція маршрутів і fallback | TS-002, TS-003 | [TS-004](TS-004-app-routing.md)   |

Кожна задача завершується перевіркою відповідальностей змінених файлів.
Стан виконання та докази записуються у відповідному task file; `traceability.md`
зберігає лише зв'язки. Історичні фази `docs/specs/admin/migration/` не є
свідченням виконання цього графа.
