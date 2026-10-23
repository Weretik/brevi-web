# BreviERP API — Frontend Integration Guide

The versioned OpenAPI entry point is [openapi.yaml](openapi.yaml). Generate
types and clients from this file; do not copy DTOs from backend source. The
aggregate contract currently includes only APIs for which a separate versioned
contract has been created and verified. An endpoint missing from this file
indicates a gap in contract coverage, not that no runtime endpoint exists.

## Authentication

`POST /api/auth/session/login` returns an opaque Bearer access token and sets
two cookies: the HTTP-only refresh cookie `kedr.rt`, sent only to the refresh
route, and the readable CSRF cookie `kedr.csrf`. These names are the current
legacy BreviERP configuration; the frontend must use them as the runtime
contract until a separate migration changes them. For cross-origin login, the
frontend must use `credentials: 'include'`, otherwise the browser will not
retain cookies from the response.

Send `Authorization: Bearer <accessToken>` for protected operations. To refresh
the session, call `POST /api/auth/session/refresh` with
`credentials: 'include'` and send the current `kedr.csrf` cookie value in the
`X-CSRF-Token` header. The refresh endpoint rotates both cookies and returns a
new access token. `POST /api/auth/session/logout` also requires Bearer
authentication, revokes all active refresh sessions for the user, and deletes
both cookies; for cross-origin logout, use `credentials: 'include'` so the
browser applies the cookie deletion headers. `GET /api/auth/session/me`
returns `userId`, `email`, and `roles`; this response does not include
permissions.

The host uses an authenticated fallback policy. Only endpoints explicitly
marked `AllowAnonymous` in the controller are public.

## HTTP conventions

- JSON uses ASP.NET Core camelCase property names.
- Paginated responses use `{ pagedInfo, value }`. `pagedInfo` contains `pageNumber`, `pageSize`, `totalPages`, and `totalRecords`; `value` contains an array of rows.
- Validation failures return `400` using the current Ardalis validation error format. Do not rely on localized message text.
- `404` has no response body. `409` returns an array of conflict messages. `401` means authentication is missing or invalid; `403` means an authenticated user lacks the required access.
- Decimal values are sent as JSON numbers. IDs are integers unless the schema explicitly defines `uuid` or `string`.

## Current API map

| Area                 | Route                                                                                                                    | Access                                        | OpenAPI coverage                                                 |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------- | ---------------------------------------------------------------- |
| Products             | `/api/v1/products`, `/api/v1/products/{id}`                                                                              | Anonymous in the current controller           | [Catalog product contract](catalog/product-catalog.openapi.yaml) |
| Product categories   | `/api/reference/product-categories/...`                                                                                  | Anonymous in the current controller           | not added yet                                                    |
| Catalog media        | `/api/catalog/media/...`                                                                                                 | Anonymous in the current controller           | not added yet                                                    |
| Suppliers            | `/api/reference/suppliers`                                                                                               | Anonymous in the current controller           | [Reference suppliers contract](reference/suppliers.openapi.yaml) |
| Other reference data | `/api/reference/fabrics`, `/garment-parts`, `/garment-accessories`, `/garment-part-operations`, `/additional-references` | Anonymous in the current controllers          | not added yet                                                    |
| Session              | `/api/auth/session/login`, `/refresh`, `/logout`, `/me`                                                                  | login/refresh — Anonymous; logout/me — Bearer | [Identity session contract](identity/session.openapi.yaml)       |

Before using an endpoint without a versioned OpenAPI contract, frontend and
backend teams must agree on its request, response, status codes, and
authorization, then add the contract to the [aggregate OpenAPI](openapi.yaml).
