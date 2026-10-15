# AI-навігація: Brevi Web

Це коротка точка входу для роботи в цьому frontend-репозиторії. Фактичний стан і правила визначають файли самого проєкту; читай документи, потрібні для конкретної задачі.

## Контекст проєкту

- [Frontend inventory](docs/architecture/frontend-inventory.md) — застосунки, інструменти та доступні Nx targets.
- Архітектура застосунків: [Admin React](docs/architecture/admin/README.md) і [Storefront Angular](docs/architecture/storefront/README.md).
- [Індекс standards](docs/standards/README.md) — сталі правила коду, UI, API, тестування, безпеки та постачання.

Визнач застосунок за запитом і поточним кодом. Якщо вибір між React та Angular змінює результат і його не можна встановити з контексту, уточни його перед створенням файлів.

## Маршрутизація задач

| Задача                                                   | Навичка                                                  | Документація проєкту                                            |
| -------------------------------------------------------- | -------------------------------------------------------- | --------------------------------------------------------------- |
| Нова або змінена поведінка: специфікація                 | `$frontend-feature-spec`                                 | [Правила готовності](docs/standards/shared/delivery-rules.md)   |
| Реалізація прийнятої специфікації                        | `$frontend-feature-delivery`                             | [Правила постачання](docs/standards/shared/delivery-rules.md)   |
| Реалізація кількома агентами на прямий запит користувача | `$frontend-feature-orchestrator`                         | [Правила постачання](docs/standards/shared/delivery-rules.md)   |
| Архітектурний аудит / системні порушення                 | `$frontend-code-audit` / `$frontend-remediation-plan`    | [Індекс standards](docs/standards/README.md)                    |
| HTTP і API-контракти                                     | `$frontend-api-contract-sync`                            | [Contract workflow](docs/architecture/api/contract-workflow.md) |
| Перевірка змін / передача на review                      | `$frontend-change-verification` / `$frontend-pr-handoff` | [Правила тестування](docs/standards/shared/testing-rules.md)    |
| Розбіжності між кодом і документацією                    | `$frontend-docs-sync`                                    | [Індекс документації](docs/README.md)                           |

## Перевірки

Обирай перевірки за зміненими Nx projects і [правилами тестування](docs/standards/shared/testing-rules.md). Наявні targets визначай із `project.json` або `npx nx show project <name> --json`; inventory є знімком, а поточна конфігурація має пріоритет.
