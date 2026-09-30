# 003 — Тканини

- **Поверхня:** React Web
- **Статус:** реалізовано; delivery checkpoint має відкриту прогалину TDD evidence
- **Власник:** admin/references
- **Оновлено:** 2026-09-28

Окрема feature для таблиці «Тканини» і всіх її наявних дій у React Admin. Сторінка зберігає URL `/references/garment-accessory` і розміщується під спільними Brevi меню та шапкою. 001-suppliers і 002-garment-accessories; використовувати спільну сторінку, не створювати другий URL.

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

Основа: [перенесення меню](../../navigation/001-legacy-menu/README.md), [візуальні орієнтири](../../table-visual-guidance.md). API-контракт зафіксовано в backend commit `2ec6376d986eb18ace4c1b7d360c329d38405b57`. Browser acceptance використовує mock API; живе середовище backend слід перевірити під час інтеграції.
