# FE-005 functional audit and refactoring — 2026-10-28

The user authorized auditing and splitting the newly delivered FE-005 functionality. Starting working tree already held the uncommitted FE-005 implementation; unrelated files were preserved. Pinned backend contract and API payloads are unchanged. [Stable findings and module decisions](../code-audit/audit.md#fe-005-functional-and-responsibility-audit--2026-10-28).

## Changes

AF-FE-P3-003: bind reprice comparison state to publicId/versionId/revision and a request generation. A snapshot change aborts the old preview and clears request keys. Old completions cannot replace a newer comparison or clear its pending state. Added two behavioral tests in feature/src/hooks/quotes/reprice/use-quote-reprice.unit.test.tsx, including a deliberately late successful old response.

AF-FE-P3-004: historical price tables distinguish previous and selected saved versions; only reprice uses the after-recalculation wording. Strengthened the existing comparison interaction test.

AF-FE-P3-005: feature/src/components/quotes/history/quote-history-versions.tsx and quote-history-events.tsx now own independent list sections and paging/error rendering. The history route stays the orchestrator; useQuoteHistory retains query and URL coordination; UI tables remain API/router-free. No new libraries, packages, endpoints or public aliases.

## Executed checks

All commands run from the frontend root E:/RiderProjects/brevi-web. Prefix environment for Vitest: NX_DAEMON=false; NX_ISOLATE_PLUGINS=false.

| Command                                                                                                                                 | Result                                                                   |
| --------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| node node_modules/vitest/vitest.mjs run --config libs/admin/clients/feature/vitest.config.mts use-quote-reprice.unit.test.tsx           | Red exit 1: 2 failed / 5 passed; Green exit 0: 7 passed                  |
| node node_modules/vitest/vitest.mjs run --config libs/admin/clients/feature/vitest.config.mts quote-price-comparison.component.test.tsx | Red exit 1: 1 failed / 2 passed; final regression includes all 3 passing |
| node node_modules/vitest/vitest.mjs run --config libs/admin/clients/feature/vitest.config.mts                                           | exit 0: 62 passed / 17 files                                             |
| node node_modules/typescript/bin/tsc --noEmit -p libs/admin/clients/feature/tsconfig.spec.json                                          | exit 0                                                                   |
| node node_modules/typescript/bin/tsc --noEmit -p libs/admin/clients/ui/tsconfig.lib.json                                                | exit 0                                                                   |
| node node_modules/eslint/bin/eslint.js with the seven changed audit source/test paths                                                   | exit 0                                                                   |
| node node_modules/prettier/bin/prettier.cjs --write with the seven changed audit source/test paths                                      | exit 0                                                                   |

The seven paths are the reprice hook/test, history route, both extracted history sections, existing price comparison component test, and UI price comparison component. Boundary searches found no generated-contract imports, direct HTTP fetch, unsafe HTML, console logging or browser persistence in scoped production model/UI/feature. `node tools/docs/check-markdown.mjs` passed (exit 0): 499 Markdown files, no broken links, empty files or duplicates. `git -c core.autocrlf=false diff --check` passed (exit 0). Final scoped diff review confirmed the history/reprice responsibility boundaries and preserved operation payloads.

## Remaining acceptance

No open local scoped finding. Browser/manual and deployed P3 acceptance remain pending as recorded in the original FE-005 delivery. No commit, push or deployment was performed in this audit. Full repository suites/build/E2E were not run; data-access/model and the pinned contract did not change.
