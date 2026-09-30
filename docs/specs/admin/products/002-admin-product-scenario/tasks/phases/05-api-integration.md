# Фаза 05 — API інтеграція

- До коду запустити `npm run contracts:check` і звірити [API-контракт](../../contracts/api-contract.md).
- TS-001: list query й category name mapping.
- TS-006: upload response не містить status; повторний GET media визначає `Ready`.
- TS-011: повний POST/PUT і повернутий ProductDetail.
- TS-012: 400 field identifiers, 409 message array, 404 без припущення про body.

**Контрольна точка:** transport/mapping tests показують тільки підтверджені contract поля; нових endpoint немає.
