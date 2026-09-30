# 001 — Навігація старого Admin у React

- **Поверхня:** React Web
- **Статус:** реалізовано для поточних React-маршрутів; SC-002/SC-003 live route відкладено до перенесення таблиць
- **Власник:** admin/core/shell
- **Оновлено:** 2026-09-26

Перенести структуру меню Angular Admin до чинної оболонки Brevi. На першому етапі активним залишається лише React-маршрут `/`; решта пунктів видима, але недоступна до появи відповідної feature. Шапка зберігає Brevi-оформлення та наявні дієві контролі.

## Навігація

- [Правила та сценарії](requirements/overview.md)
- [Проєктування frontend і карта меню](design/frontend.md)
- [Трасування](traceability.md)
- [Граф задач](tasks/README.md)
- [Готовність специфікації](checklist/spec-readiness.md)
- [Готовність до постачання](checklist/delivery-readiness.md)
- [Як виконувати](USAGE.md)
- [Приклад бічного меню](../../assets/visual-references/admin-sidebar.png)
- [Приклад шапки](../../assets/visual-references/admin-top-bar.png)

Feature не викликає API; `contracts/api-contract.md` не потрібен.
