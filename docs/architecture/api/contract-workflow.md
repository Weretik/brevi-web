# API Contract Lifecycle

These rules apply to every frontend feature that calls a backend API, whether
it uses Angular or React. The source of truth is OpenAPI in the backend
repository. The frontend keeps a reproducible snapshot of a specific backend
commit; Markdown documents consumer decisions and does not copy request or
response schemas.

## Workflow

1. Before implementation, find the operation in the backend OpenAPI. In the
   feature's `contracts/api-contract.md`, record the exact `operationId`, path
   to canonical OpenAPI, backend repository, and full commit SHA or immutable
   release tag. Record a separate row for each operation. If the operation is
   missing or the contract is not agreed, create a backend blocker; method and
   URL alone do not replace `operationId`.
2. Sync OpenAPI from a clean checkout at the pinned commit and preserve the
   snapshot provenance in the frontend: repository, commit, source path, date,
   and sync command. Do not edit snapshot YAML by hand; change the contract in
   the backend and sync again.
3. Generate TypeScript request and response types from the snapshot. Do not
   edit generated files by hand or duplicate equivalent DTOs in `contracts`
   or `data-access`. Use operation-specific types in transport/data-access;
   keep local types only for application models and client rules missing from
   OpenAPI.
4. Validate the network response at runtime before converting the DTO. Static
   type generation is not runtime validation. The mapper at the `data-access`
   boundary returns an application model; `feature`, `ui`, and domain models
   do not import generated DTOs.
5. Document client decisions in the feature contract: request mapping,
   response mapping, errors, pagination, caching/invalidation, retries,
   cancellation, and constraints. Refer to `operationId` and OpenAPI instead
   of rewriting schema fields in Markdown.
6. Run snapshot, generation, relevant typecheck, mapper and error tests, lint,
   and build checks. A backend contract change and its frontend consumer must
   pass these checks against the same pinned version.

## Tooling status in this repository

As of 2026-10-01, the repository has a versioned OpenAPI snapshot, provenance
manifest, generated types in `libs/admin/shared/contracts`, and the
`contracts:sync`, `contracts:generate`, and `contracts:check` commands. React
data-access imports generated operation types through the public alias
`@admin/shared/contracts`.

Verification sequence for an API feature:

```powershell
npm run contracts:sync -- <backend-checkout> <backend-commit>
npm run contracts:generate
npm run contracts:check
npx nx lint <changed-project>
npx nx typecheck <changed-project>
npx nx test <changed-project>
npx nx build <app>
```

The first three lines are current npm scripts; `contracts:sync` requires a
backend checkout and immutable revision. Run `typecheck` and `test` only when
the Nx targets exist, as verified by
`npx nx show project <project> --json`; React test types can be checked with
`npm run typecheck:tests`. If a target is missing, create an `EN-*` task or
record the gap and the available `tsc --noEmit --project <tsconfig>` check.
