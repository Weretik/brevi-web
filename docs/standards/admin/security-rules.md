# Security Rules

## Boundaries and responsibilities

These rules apply to React Admin. The frontend improves safe UI behavior but is
not a security boundary: the backend must check authentication, authorization,
ownership, and validation for every request.

Each Admin feature records roles, route access, access to each mutation,
sensitive data, and the `basic`, `elevated`, or `n/a` security review level in
its spec.

## Access and session

- A route guard and UI may hide an unavailable action, but the endpoint must still be protected by a backend permission check.
- For protected flows, define behavior for `401` (session missing/expired) and `403` (role lacks permission); do not show data or success after rejection.
- Use only the existing `AuthSessionAdapter` and shared API transport. Do not create feature-specific token storage, Axios clients, or refresh flows.
- Do not pass access tokens in URLs, analytics, logs, or errors.

## Data, input, and output

- Validate and map DTOs at the `data-access` boundary; the UI does not show raw API errors, stack traces, or internal identifiers.
- Do not use `dangerouslySetInnerHTML`. HTML from an untrusted source requires a separately approved sanitizer and security review.
- Do not put secrets, tokens, personal data, or request/response bodies in source, documentation, telemetry, or logs.
- For files, CSV/export, external URLs, bulk operations, and PII, specify separate access, validation, and audit/confirmation requirements.

## Transport and observability

- Use the existing bearer, refresh, CSRF, and credentials transport mechanisms without duplicating them in a domain feature.
- Logs may contain only method, sanitized URL, status, duration, and correlation/trace ID as allowed by the current API contract; headers and bodies are prohibited.
- Do not add security headers, cookie attributes, or CSP only in a frontend spec: these are deployment/backend responsibilities and require an agreed contract.

## Proportionate review and verification

| Level      | When                                                            | Minimum check                                                             |
| ---------- | --------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `n/a`      | Local change without data, route, or API                        | Reason in the spec                                                        |
| `basic`    | Standard authenticated Admin feature                            | Roles, 401/403, error exposure, PII/logging check                         |
| `elevated` | Auth, permissions, PII, files, export, bulk/destructive actions | Short threat model, negative automated tests, and backend contract review |

An `elevated` threat model includes: asset, actor, entry point, threat,
server-side mitigation, frontend behavior, and verification method. Security
tests check UI denial and correct 401/403 handling; they do not replace
server-side authorization tests.
