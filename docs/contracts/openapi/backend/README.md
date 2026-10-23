# API Contracts

`docs/sdd/contracts/` is the canonical, versioned source of machine-readable public API contracts.

## Structure

```text
docs/sdd/contracts/
├── openapi.yaml                         # aggregate entry point for all public APIs
└── <module>/
    └── <feature>.openapi.yaml           # contract owned by one feature
```

`openapi.yaml` is the entry point for Swagger UI, frontend client generation,
and contract tests. It references module contracts through `$ref`; do not
duplicate operations or schemas in the aggregate file.

## Current handoff to frontend teams

- [Frontend integration guide](frontend-integration.md) describes authentication, CSRF, paging, errors, and current contract coverage.
- [Aggregate OpenAPI 3.1 contract](openapi.yaml) covers APIs for which a versioned contract has been created and verified.
- Module contracts: [Identity session](identity/session.openapi.yaml), [Catalog products](catalog/product-catalog.openapi.yaml), [Reference suppliers](reference/suppliers.openapi.yaml).

OpenAPI files describe the contract of the actual code. They do not grant
public access to an endpoint: authorization attributes and host fallback
policy remain authoritative.

Each feature SDD contains `contracts/api-contract.md` to describe human-readable
decisions about boundaries, consumers, compatibility, security, errors,
idempotency, and deployment. For new or changed HTTP behavior, agree on these
decisions and create or update the machine-readable contract before transport
implementation where practical. Based on the agreed contract, add focused
contract/API Red tests, then implement the transport. The feature document
must link to
`docs/sdd/contracts/<module>/<feature>.openapi.yaml`, and the aggregate
`openapi.yaml` must be updated in the same change.

Do not create a public OpenAPI document for changes used only internally.
Before adding an HTTP contract, agree on the route, method, operation ID,
DTOs, examples, errors, security, idempotency for writes with side effects,
and a migration path for incompatible changes.
