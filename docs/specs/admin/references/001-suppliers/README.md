# 001 — Постачальники

- **Поверхня:** React Web
- **Статус:** реалізовано; delivery checkpoint перевірено з mock API
- **Власник:** admin/references
- **Оновлено:** 2026-09-26

Окрема feature для таблиці «Постачальники» і всіх її наявних дій у React Admin. Сторінка зберігає URL `/references/supplier` і розміщується під спільними Brevi меню та шапкою. немає.

## Навігація

- [Правила та приймальні сценарії](requirements/overview.md)
- [Проєктування frontend](design/frontend.md)
- [Споживання API-контракту](contracts/api-contract.md)
- [Трасування](traceability.md)
- [Граф задач](tasks/README.md)
- [Готовність специфікації](checklist/spec-readiness.md)
- [Готовність до постачання](checklist/delivery-readiness.md)
- [Як виконувати](USAGE.md)
- [Приклад таблиці](../../assets/visual-references/customers-search-list.png)
- [Приклад форми](../../assets/visual-references/customer-create.png)

Основа: [перенесення меню](../../navigation/001-legacy-menu/README.md), [візуальні орієнтири](../../table-visual-guidance.md). Контракт зафіксовано в backend `f74c01f7784b1bccaae3234dfee63d8adac5da76`; frontend використовує відтворюваний snapshot і generated types. Browser acceptance використовує mock API; живе середовище backend слід перевірити під час інтеграції.
