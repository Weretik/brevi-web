# EN-002 — Permissions inputs і перший consumer

- **ID задачі:** EN-002
- **Уможливлює:** SC-008
- **Залежить від:** EN-001
- **Точні шляхи:** auth `/me` або token claims contract; planned
  `libs/admin/core/permissions/`; first agreed route/action consumer
- **Рівень тестування:** architecture/security decision verification

## Робота

Рішення власника feature від 2026-10-02: завершити delivery без granular
permissions. `/me` повертає `roles`, але рольові policy та перший consumer не
визначені; вони потребують окремої feature.

- [ ] Погодити канонічне джерело permission inputs, stable identifiers,
      unknown-value behavior і відповідність backend policy.
- [ ] Назвати перший реальний route/action consumer і observable denied behavior.
- [ ] Вирішити, які з `policies`, `guards`, `hooks` реально потрібні; не
      створювати порожні каталоги.
- [ ] Записати 401/403 semantics і підтвердити backend enforcement.
- [ ] Перевірити майбутні files на цілісність відповідальності та оновити audit.

## Свідчення

- Чому поведінковий Red не має сенсу: source permissions folder містить лише
  `.babelrc`, а product/security contract ще не визначений.
- Перевірені інструменти: Vitest/RTL та app router integration harness наявні.
- Альтернативна команда або перевірка та результат: погоджене рішення і exact paths.
- Уможливлена поведінкова задача: TS-005.

## Контрольна точка

EN-002/SC-008/TS-005 виключені з цієї delivery без створення порожньої library.
