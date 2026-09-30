# <функціональність> — споживання API-контракту

Створюйте цей файл для кожної feature з backend API. Для feature без API
видаліть `contracts/api-contract.md` і посилання на нього. Правила та стан
автоматизації: `docs/architecture/api/contract-workflow.md`.

## Джерело та версія

- Backend repository: `<назва або URL>`
- Канонічний OpenAPI entry point у backend: `<шлях>`
- Зафіксована версія backend: `<повний commit SHA або незмінний release tag>`
- Frontend snapshot і provenance: `<шляхи або EN-* для їх створення>`
- Generated types і generator: `<Nx library / script або EN-*>`
- Статус: `<verified | blocked: причина>`

| `operationId` | Метод і шлях з OpenAPI | Сценарії `SC-*` | Статус у snapshot |
| ------------- | ---------------------- | --------------- | ----------------- |
| `<точний ID>` | `<GET /...>`           | `<SC-001>`      | `<є / blocker>`   |

Без конкретного `operationId` і зафіксованої backend-версії інтеграція не
готова до реалізації. Метод і шлях не замінюють ідентифікатор операції.

## Рішення frontend

- Request mapping: `<модель застосунку → параметри операції, defaults і validation>`
- Response validation та mapping: `<DTO → модель застосунку; поведінка при invalid response>`
- Помилки та видимий результат: `<нормалізація, field errors, fallback, SC-*>`
- Пагінація/сортування/фільтрація: `<нумерація сторінок, total, межі або n/a>`
- Кеш та інвалідація: `<ключ, lifetime, invalidation або n/a>`
- Повторні запити та скасування: `<умови, manual/automatic retry, signal або n/a>`
- Обмеження, rollout і сумісність: `<відомі обмеження або n/a>`

Не переписуйте поля request/response schema з OpenAPI в Markdown. Generated
types використовуються лише у transport/data-access; відповідь перевіряється
під час виконання й перетворюється до передачі в feature/UI.

## Перевірки та передумови

- [ ] Кожен `operationId` існує в OpenAPI за зафіксованою backend-версією.
- [ ] Snapshot синхронізований від цієї версії; provenance записане.
- [ ] Generated request/response types відповідають snapshot; ручних копій DTO немає.
- [ ] Runtime-перевірка, мапінг і сценарії помилок мають focused tests.
- [ ] Записані результати `contracts:sync`, `contracts:generate`, `contracts:check`,
      relevant lint/typecheck/test/build або `EN-*` для відсутніх команд.

Поки contract scripts відсутні, не записуйте їх як успішно виконані. Додайте
окрему `EN-*` за `docs/architecture/api/contract-workflow.md`
і вкажіть доступні перевірки конкретного Nx project.
