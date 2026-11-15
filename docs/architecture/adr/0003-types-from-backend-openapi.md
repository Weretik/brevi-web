# ADR-0003: API types are generated from a pinned snapshot of the backend OpenAPI

**Status:** accepted
**Decision date:** 2026-11-15 (recorded from the current workflow)
**Owners:** frontend, backend
**Applications:** all clients of BreviERP

## Context

The backend BreviERP owns the API and publishes OpenAPI. Hand-written request and response types drifted from it: a renamed field broke a page only at runtime. The frontend must build and test without a running backend.

## Options

| Option                                                     | Complexity | Risks                                      | Evidence                             |
| ---------------------------------------------------------- | ---------- | ------------------------------------------ | ------------------------------------ |
| Hand-written types                                         | low        | silent drift                               | early features                       |
| Read the live OpenAPI at build time                        | medium     | builds depend on a running API; no history | —                                    |
| Pinned snapshot in the repository, types generated from it | medium     | the snapshot must be synced on purpose     | `package.json` `contracts:*` scripts |

## Decision and reason

- The repository keeps a snapshot of the backend OpenAPI (docs/contracts/openapi/ (with `SOURCE.json`)) with its source commit; it is never edited by hand. A contract change starts in the backend.
- `node tools/contracts/contracts.mjs generate` writes `libs/admin/shared/contracts/src/generated/openapi.ts`. Admin uses these types; the Site reads the same BreviERP API on the server by the same contract.
- `npm run contracts:check` fails when the snapshot and the generated file differ.
- Data-access libraries map generated types to the app's own models; components never use transport types directly.

## Consequences and verification

- A backend change that breaks a client shows up as a type error after the sync.
- Every new endpoint needs a sync step before frontend work ([contract workflow](../api/contract-workflow.md)).
- Checked by `contracts:check` in CI and by the frontend code audit.
