# Документація Brevi Web

Цей каталог містить versioned engineering documentation для frontend-застосунку Brevi Web. Документація ведеться як docs-as-code разом зі змінами коду.

## Frontend SDD

- [Архітектура Admin](architecture/admin/README.md) — фактична топологія frontend-застосунку, модулі та межі шарів.
- [Інженерні правила](standards/README.md) — індекс rules для Admin, UI, API, testing і delivery.
- [Специфікації](specs/README.md) — структура feature-специфікацій та SDD-шаблони.

## Застосунок

- [Admin](architecture/admin/README.md) — архітектура адміністративного застосунку.
- [API](architecture/api/README.md) — API-контракти та інтеграційні домовленості.

## Принцип розміщення

Сталі правила належать у `architecture/` або `standards/`. Рішення, вимоги, контракти, задачі та докази перевірки конкретної feature належать у її папку в `specs/`.

Перед змінами в Admin прочитай [інструкції для AI](AGENTS.md).
