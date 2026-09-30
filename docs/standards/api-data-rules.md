# Правила API та даних

## Контракти та DTO

- Public API route, query parameters і response fields стабільні за замовчуванням; breaking change потребує contract, migration path і rollout у feature spec.
- До реалізації вкажіть точний `operationId`, backend OpenAPI source і commit/tag у feature-контракті. Дотримуйтеся [життєвого циклу контракту](../architecture/api/contract-workflow.md).
- Синхронізований YAML і згенеровані типи не редагуйте вручну. Не створюйте ручну копію тих самих DTO.
- Generated request/response types використовуйте лише на межі transport/data-access; runtime-перевірка відповіді та mapper залишаються в `data-access`.
- Mapper перетворює DTO на domain/view model на API boundary; `ui` і `feature` не працюють із DTO.
- Не показуйте користувачу raw transport errors, stack traces або internal details.
- У Markdown записуйте рішення клієнта, а не дублюйте OpenAPI schemas.

## Запити та стан

- Використовуйте чинний RTK Query `baseApi` і typed hooks; не викликайте Axios/HTTP безпосередньо з components.
- Передавайте cancellation signal у transport та зберігайте чинну нормалізацію errors.
- Визначайте pagination, filtering, sorting, cache/refetch semantics у contract до коду.
- Не дублюйте RTK Query cache, loading або error state у feature reducer.

## Публічна конфігурація

- Перевіряйте public runtime config на межі застосунку.
- Не додавайте secrets, tokens, PII або request/response bodies у source, logs чи docs.
