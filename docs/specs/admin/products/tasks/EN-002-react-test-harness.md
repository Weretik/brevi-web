# EN-002 — Налаштування тестового середовища React

- **ID задачі:** EN-002
- **Уможливлює:** SC-001, SC-002, SC-003, SC-004, SC-005, SC-006
- **Залежить від:** немає
- **Точні шляхи:** `apps/admin-react/project.json`, `apps/admin-react/vite.config.mts`, `apps/admin-react/src/test-setup.ts`, `libs/admin/products/feature/`, `libs/admin/products/data-access/`
- **Рівень тестування:** перевірка налаштування

## Робота

- [x] Додати мінімальне налаштування Nx/Vitest і React Testing Library, потрібне для TS-001.

## Свідчення

- Чому поведінковий Red не має сенсу: ця задача створює тестову інфраструктуру
  й не додає поведінки списку товарів.
- Перевірені наявні інструменти: `package.json`, `apps/admin-react/project.json`,
  `apps/admin-react/vite.config.mts`. Генератор Nx Vitest було запущено, але він
  створив застарілий executor і пошкодив наявну конфігурацію Vite; остаточне
  налаштування використовує сучасний inferred plugin `@nx/vitest` і окремий
  `vitest.config.mts`.
- Альтернативна команда або перевірка та результат: `npx nx run admin-react:test`
  — один тест середовища пройшов; `npx nx run admin-react:typecheck-tests` —
  пройшла; `npx nx run admin-react:lint` — пройшла.
- Уможливлена поведінкова задача: TS-001

## Контрольна точка

Завершено 2026-09-08. Фокусний тест React виконується з Vitest, jsdom, React
Testing Library, jest-dom і user-event; майбутні помилки Red можуть бути
поведінковими, а не помилками компіляції, фікстур або залежностей.
