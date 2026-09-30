# 005 — Операції (роботи)

- **Поверхня:** React Web
- **Статус:** реалізовано; delivery checkpoint із задокументованим TDD-відхиленням
- **Власник:** admin/references
- **Оновлено:** 2026-09-28

Окрема feature для таблиці «Операції (роботи)» і всіх її наявних дій у React Admin. Сторінка зберігає URL `/references/garment-part-operation` і розміщується під спільними Brevi меню та шапкою. 004-garment-parts; використовувати спільну сторінку, не створювати другий URL.

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
- [Приклад форми](../../assets/visual-references/product-edit.png)

Основа: [перенесення меню](../../navigation/001-legacy-menu/README.md), [візуальні орієнтири](../../table-visual-guidance.md). API-контракт довідника зафіксований у backend commit `9f75e832525ea96a327be227f6ec756e01ddfa67`.
