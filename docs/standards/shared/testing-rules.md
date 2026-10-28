# Testing rules

## Tooling source

Find existing tests in the feature card's `## Tests` section and check targets with `npx nx show project <project> --json`. Open `package.json`, the lockfile, or test configuration only when adding or changing a test tool. The [frontend inventory](../../architecture/frontend-inventory.md) is a snapshot; the actual repository state takes precedence.

Do not assume Jest, Vitest, React Testing Library, Playwright, or another tool is available merely because it is familiar or mentioned in documentation. A dependency without configuration, a target, and an executable test file is a prerequisite to record as a separate `EN-*`. Only recommend a new package until installation is included in the agreed scope.

## Choosing the narrowest level by risk

| Risk                                                    | Primary test level              |
| ------------------------------------------------------- | ------------------------------- |
| Pure functions, mapping, formatting, validation         | Unit                            |
| Hook, store, cache, state transitions, data fetching    | Focused integration             |
| Component, form, loading/empty/error state, interaction | Component                       |
| Navigation, deep link, permission, storage, or adapter  | Integration                     |
| API request/response mapping and transport errors       | Focused integration or contract |
| Critical user scenario across screens/services          | E2E                             |

One `SC-*` may have several focused tests for distinct risks. Do not repeat the full scenario at unit, component, integration, and E2E levels. E2E is for a critical journey, not automatically for every acceptance scenario.

## Designing tests from scenarios

`SC-*` is not an executable test. It is a stable acceptance contract from which specific automated tests are derived. A scenario answers “what can the user see or do?”, while a test answers “at what technical level can we prove this risk most cheaply and reliably?”.

For example, one filtering scenario may have a unit test for parameter normalization and a component test for form submission. Neither test needs to repeat the whole scenario, and E2E needs a separate journey risk.

- Every new or changed observable behavior links to an `SC-*` and relevant `R-*`.
- A scenario describes user behavior in Given/When/Then without component, hook, store, library, or file names.
- A test checks a public contract or visible result. Each test has one clear outcome.
- Component tests use semantic roles, accessible names, and actual interaction events supported by the current setup.
- Test data is deterministic and contains no secrets or real personal information.
- Manual evidence is allowed only for a risk that current tooling objectively cannot automate; record the reason in the task and traceability.

## Test architecture in this repository

- Tests belong to the Nx project whose behavior they verify and live beside source as `*.test.ts`/`*.test.tsx` or in its existing test directory.
- Test pure TypeScript rules without DOM or framework providers.
- State/data-fetching tests assemble the minimum real store/provider graph and replace only the external transport boundary. Do not create a global mock backend or new mocking library without a separate `EN-*`.
- React component tests use Vitest and React Testing Library after a project target and one `test-setup` are created. Global setup contains only DOM matchers/polyfills; feature fixtures and mocks stay local.
- App-level integration tests verify provider composition, routing, and browser adapters only when risk crosses a library boundary.
- Browser E2E uses a separate `admin-react-e2e` Nx project and covers a few critical journeys. Add E2E only for a separate journey risk.
- Coverage is collected in CI after a stable test set exists. Thresholds are introduced by a separate decision based on a baseline, not an arbitrary number.

The base React harness is already configured in `apps/admin-react`. For a new library, check its Nx target/configuration and add the first behavioral test in the relevant `TS-*`. Existing harness smoke coverage checks only test infrastructure and is not evidence for a business scenario.

## Test names and commands

- `*.unit.test.ts` or `*.unit.test.tsx` — pure functions and validation.
- `*.component.test.tsx` — React UI and user interactions.
- `*.integration.test.ts` or `*.integration.test.tsx` — state, data fetching, routing, and browser boundaries.
- `*.spec.ts` in `apps/admin-react-e2e` — browser E2E journeys.

Top-level commands: `npm run test:web`, `npm run test:web:coverage`, `npm run test:web:e2e`, and `npm run typecheck:tests`. Individual empty test levels may pass through `--passWithNoTests`, but readiness requires at least one actual behavioral or infrastructure test.

## Red → Green → Refactor → Regression

For each new testable behavior in `TS-*`:

1. **Red** — add the smallest behavioral test, run it, and record the expected mismatch with `R-*`/`SC-*`.
2. **Green** — implement the smallest complete change that makes the focused test pass.
3. **Refactor** — improve structure within the same responsibility and rerun the focused test.
4. **Regression** — run affected suites/targets and record the command and result.

A compilation error, broken fixture, missing dependency, invalid test setup, or unrelated failure is not a valid Red result. Fix the prerequisite through `EN-*` first, then obtain a behavioral Red result.

## Exceptions

Red-first may not make sense for documentation-only work, a generator/setup task, a new test harness, or a platform prerequisite. Record such work as `EN-*` with `Enables`, the exception reason, and replacement verification. The exception does not remove final verification of the enabled scenario.

## Verification scope during implementation

Run only automated tests for the changed feature and directly related parts. Run general tests, a full app or repository suite, coverage, production build, E2E, and a full audit only at the user's explicit request. An unrequested full suite is not a feature completion condition.

## Evidence

| When               | Minimum action                                                                                                                                      |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Local change       | Run the changed Nx project's test (`npx nx test <project>` if it has a target); for documentation, check links and run `git diff --check`.          |
| API or type change | Add `npm run contracts:check` or `npx nx typecheck <project>` for the affected boundary.                                                            |
| Full CI            | The [workflow](../../../.github/workflows/ci.yml) runs lint, tests, and builds for PRs/pushes; rerun the full suite locally only on direct request. |

Check targets and configuration with `npx nx show project <project> --json`.

A task file stores the test name/path, Red failure, Green result, refactor note, and regression result. `traceability.md` contains only `SC → TS/EN → test → evidence` links and status. For an unrun command, state the exact command, failure point, and whether the cause is pre-existing.

Typical available checks for this repository:

```powershell
npx nx lint <project>
npx nx test <project>
npx nx typecheck <project>
npx nx build <project>
npm run format:check -- <paths>
```

Run only targets listed by `npx nx show project <project> --json`. For an API feature, also verify synchronization/generation/checking under the [contract workflow](../../architecture/api/contract-workflow.md), runtime mapping, and errors. The `contracts:sync`, `contracts:generate`, and `contracts:check` scripts are defined in root `package.json`; run applicable commands and record actual results. If a required contract prerequisite is absent, record a specific `EN-*` rather than marking the check complete.
