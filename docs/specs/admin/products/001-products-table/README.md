# 001 — Таблиця та дії з товарами

- **Поверхня:** React Web
- **Статус:** delivery checkpoint виконано з задокументованим процесним винятком TDD Red
- **Власник:** admin/products
- **Оновлено:** 2026-09-28

Окрема SDD для нового React-розділу «Товари»: список на MUI X Data Grid і підтримані backend дії створення, перегляду, повного редагування та видалення. React URL `/references/products` активований у меню; дочірні сторінки доступні за прямими адресами.

## Навігація

- [Правила та приймальні сценарії](requirements/overview.md)
- [Проєктування frontend](design/frontend.md)
- [Споживання API-контракту](contracts/api-contract.md)
- [Трасування](traceability.md)
- [Граф задач](tasks/README.md)
- [Готовність специфікації](checklist/spec-readiness.md)
- [Готовність до постачання](checklist/delivery-readiness.md)
- [Як виконувати](USAGE.md)
- [Приклад таблиці товарів](../../assets/visual-references/products-list.png)
- [Приклад створення](../../assets/visual-references/product-create.png)
- [Приклад редагування](../../assets/visual-references/product-edit.png)

[Попередня специфікація списку](../README.md) має статус blocked і припускає інший endpoint та відсутню реалізацію. Її історичні фази не є evidence цієї feature; EN-001 звіряє розбіжності. Візуальні приклади — [тут](../../table-visual-guidance.md).
