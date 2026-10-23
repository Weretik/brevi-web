# Delivery rules

Prepare an SDD before implementing a new feature or changing the scenarios, UI behavior, or contracts of an existing feature. For an existing feature, update its current specification or add a revision in its directory; do not duplicate the entire SDD. Maintain IDs and traceability for the changed scope.

For a local internal fix that restores already documented behavior without changing a scenario, contract, or module boundary, a short description of the problem, fix, and focused verification result in the task or report is enough. Open historical revisions only for a specific need.

## Readiness

Keep a feature's current scope and navigation in its `README.md`, requirements in the current specification, evidence in task files, and `traceability.md` as brief links and statuses. Earlier revisions are history; do not duplicate current status in them or open them without a specific need.

A feature is ready for implementation when:

- its goal, actor, scope, and exclusions are unambiguous;
- business rules have stable `R-*` IDs, and observable Given/When/Then scenarios have stable `SC-*` IDs;
- unknown product decisions are resolved or marked `[NEEDS CLARIFICATION]` and excluded from the ready scope;
- design and contracts contain only necessary decisions with exact source paths;
- an API feature records `operationId`, the backend OpenAPI source, and its version in `contracts/api-contract.md`; missing contract tooling is represented by an `EN-*` task;
- each scenario has a risk-based test level and evidence target;
- `traceability.md` links each `SC-*` to small `TS-*` tasks and required `EN-*` tasks;
- every task dependency exists, and the first tasks in the graph are ready.

## Documentation detail and ownership

Describe a new feature with a short card in `docs/features/admin/` or `docs/features/storefront/` and add it to the index. The card includes behavior, route, components, state and data where applicable, a compact Mermaid diagram of verified relationships, and a tree of actual key files and their roles. Use separate trees for distinct `apps/` and `libs/` roots; do not present invented state, APIs, or planned files as existing. Review the card after a substantial change, while the SDD remains the source for requirements and plans. Do not create a subdirectory for a single card.

- Root `AGENTS.md` is a brief entry point for project architecture, standards, and AI skills.
- `docs/specs/README.md` is only an index of feature specifications.
- This document defines specification and delivery readiness.
- A feature `README.md` contains the status and navigation for that feature.
- A feature `USAGE.md` gives English instructions for creating that feature and lists the required files.
- The accepted feature, its task graph, and traceability define execution scope and evidence.
- Systemic violations receive a separate remediation SDD with `AF-*`, `AR-*`, `RM-*`, and `EN-*`.
- A code audit is a required architecture quality gate.
- `testing-rules.md` holds stable testing and TDD rules.
- `delivery-rules.md` holds readiness, traceability policy, and definition of done.
- `traceability.md` contains only links between scenario, task, test, and evidence.
- Each `TS-*` or `EN-*` task file has one implementation or verification responsibility.

Requirements describe business behavior, design describes frontend boundaries and decisions, and contracts describe external interfaces. Large phase files only orchestrate planning; they link to small task files and do not become implementation checklists.

## Traceability policy

- Do not reuse IDs for different content or renumber completed tasks.
- `TS-*` contains `Covers`; `EN-*` contains `Enables`. Both contain `Depends on`, exact paths, test level, `Work`, `Evidence`, and `Checkpoint`.
- A remediation SDD uses `AF-*` findings, `AR-*` requirements, and `RM-*` executable tasks. Each `AF-*` traces to `RM-*`/`EN-*` and verification; delivery requires all in-scope findings to be `verified`.
- A scenario becomes `verified` only when all required tasks are complete and acceptance evidence passes.
- When boundaries change, update requirements, the task graph, and traceability in the same documentation change.
- Do not rewrite old evidence. During migration, link to a legacy phase as historical evidence and describe new work in new `TS-*`/`EN-*` tasks.

## Autonomous execution boundaries

If the user authorizes an entire feature, phase, or set of `SC-*` scenarios, the AI proceeds independently through all ready task files in that scope according to `Depends on`. A separate command for each subphase is unnecessary. Execution stops when the scope is complete or a specific blocker requires a decision or new authorization.

## Completion criteria

All in-scope `SC-*` scenarios are implemented or explicitly deferred; tasks and checkpoints are complete; contracts, documentation, and implementation agree; and evidence of focused tests and regression for the affected feature is recorded. Checks needed for its risks pass or their absence is documented. General tests and a full suite run only at the user's explicit request. The delivery report lists scope, changed files, evidence, unrun checks, and real residual risks. Architecture findings in the current scope must be `verified`; an `open`, `blocked`, or `planned` finding blocks delivery, while `deferred-approved` requires a separate SDD/task, an owner, and explicit approval that the finding is not a prerequisite of the current result.
