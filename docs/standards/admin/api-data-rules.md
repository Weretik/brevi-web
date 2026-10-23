# API and Data Rules

## Contracts and DTOs

- Public API routes, query parameters, and response fields are stable by default; a breaking change requires a contract, migration path, and rollout plan in the feature spec.
- Before implementation, record the exact `operationId`, backend OpenAPI source, and commit/tag in the feature contract. Follow the [API contract lifecycle](../../architecture/api/contract-workflow.md).
- Do not edit synchronized YAML or generated types manually. Do not create a manual copy of the same DTOs.
- Use generated request/response types only at the transport/data-access boundary; runtime response validation and mapping remain in `data-access`.
- A mapper converts DTOs into a domain/view model at the API boundary; `ui` and `feature` do not work with DTOs.
- Do not show raw transport errors, stack traces, or internal details to users.
- Record client decisions in Markdown; do not duplicate OpenAPI schemas.

## Requests and state

- Use the existing RTK Query `baseApi` and typed hooks; do not call Axios/HTTP directly from components.
- Pass the cancellation signal to the transport and preserve current error normalization.
- Define pagination, filtering, sorting, and cache/refetch semantics in the contract before coding.
- Do not duplicate RTK Query cache, loading, or error state in a feature reducer.

## Public configuration

- Validate public runtime configuration at the application boundary.
- Do not add secrets, tokens, PII, or request/response bodies to source, logs, or docs.
