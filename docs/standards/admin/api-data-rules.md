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

## Validation and server errors

- The server validates every request; it is the only source of truth. Frontend validation only helps the user (early hints, disabled «Зберегти») and never replaces or weakens a server check.
- Keep form rules in `model/validators` or `data-access/validators` and mirror the server rule where cheap; when they disagree, the server wins and the form shows the server message.
- The backend returns errors as ProblemDetails: `title`/`detail` for the whole request and `errors` with messages by field (`{ "name": ["Вкажіть назву."] }`). Messages are Ukrainian and do not repeat the field name, because the form shows them under the field.
- Parse errors only through `@admin/shared/api-client` (`api-error.ts`): it maps `errors` keys to camelCase form fields (dropping a `Request.` prefix) and still reads the older Ardalis list during the backend's move to ProblemDetails. Do not parse response bodies in features or components.
- Show a field message under its field and the rest in one alert; never show raw bodies, trace ids or English framework text.
