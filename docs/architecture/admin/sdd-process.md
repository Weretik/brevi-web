# Frontend Feature SDD Process

Plan a frontend feature from observable scenarios down to the smallest
technical responsibilities. Readiness is defined by the
[delivery rules](../../standards/shared/delivery-rules.md), and test strategy
by the [testing rules](../../standards/shared/testing-rules.md).

## Sequence

1. Record the actor, goal, scope, exclusions, and stable business rules `R-*`.
2. Describe acceptance scenarios `SC-*` in Given / When / Then using only observable behavior.
3. Identify the needed areas: shared behavior; state/data access; React Web UI; browser navigation/deep links; browser adapters/permissions; API integration; component, integration, and E2E checks. For an API feature, complete `contracts/api-contract.md` with `operationId`, backend OpenAPI source, and commit/tag before implementation. If sync and generation are missing, add an `EN-*` task under the [contract workflow](../api/contract-workflow.md).
4. Choose the narrowest test level based on risk and check the actual tooling.
5. Split implementation into `TS-*` tasks and shared prerequisites into `EN-*` tasks; add dependencies, exact paths, evidence targets, and checkpoints.
6. Complete `traceability.md` before implementation starts.
7. After agreement, execute ready tasks according to their dependencies, checkpoints, and evidence in the feature SDD.

Do not create empty optional files. If a large feature needs phases, phase
files remain orchestration indexes, while implementation details go in small
task files.

## Current architecture constraints

The actual applications and tooling are described in the
[frontend inventory](../frontend-inventory.md). The mobile application is out
of scope. React Admin has application, shell, and browser test targets; check a
new library's own target/setup before planning automated evidence.
