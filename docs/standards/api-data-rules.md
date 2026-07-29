# API and data rules

## Contracts and DTO

- Public API route, query parameters і response fields стабільні за замовчуванням; breaking change потребує contract, migration path і rollout у feature spec.
- Посилайтеся на versioned OpenAPI або погоджений backend contract до реалізації client code.
- DTO, transport envelope і runtime response parsing залишаються private у `data-access/contracts`.
- Mapper перетворює DTO на domain/view model на API boundary; `ui` і `feature` не працюють із DTO.
- Не показуйте користувачу raw transport errors, stack traces або internal details.

## Requests and state

- Використовуйте чинний RTK Query `baseApi` і typed hooks; не викликайте Axios/HTTP безпосередньо з components.
- Передавайте cancellation signal у transport та зберігайте чинну нормалізацію errors.
- Визначайте pagination, filtering, sorting, cache/refetch semantics у contract до коду.
- Не дублюйте RTK Query cache, loading або error state у feature reducer.

## Public configuration

- Перевіряйте public runtime config на межі застосунку.
- Не додавайте secrets, tokens, PII або request/response bodies у source, logs чи docs.
