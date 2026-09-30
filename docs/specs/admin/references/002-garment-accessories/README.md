# 002 — Фурнітура виробу

- **Поверхня:** React Web
- **Статус:** реалізовано; delivery verification пройдено
- **Власник:** admin/references
- **Оновлено:** 2026-09-26

Окрема feature для таблиці «Фурнітура виробу» і всіх її наявних дій у React Admin. Сторінка зберігає URL `/references/garment-accessory` і розміщується під спільними Brevi меню та шапкою. 001-suppliers — список постачальників для форми; не вмикати вкладку «Тканини» до SDD 003.

## Навігація

- [Правила та приймальні сценарії](requirements/overview.md)
- [Проєктування frontend](design/frontend.md)
- [Споживання API-контракту](contracts/api-contract.md)
- [Трасування](traceability.md)
- [Граф задач](tasks/README.md)
- [Готовність специфікації](checklist/spec-readiness.md)
- [Готовність до постачання](checklist/delivery-readiness.md)
- [Як виконувати](USAGE.md)
- [Приклад таблиці](../../assets/visual-references/products-list.png)
- [Приклад форми](../../assets/visual-references/product-create.png)

Основа: [перенесення меню](../../navigation/001-legacy-menu/README.md), [візуальні орієнтири](../../table-visual-guidance.md). Контракт закріплено backend commit `d2b011647ed14ec32eb42b76aac2e908fb3d95e6`.
