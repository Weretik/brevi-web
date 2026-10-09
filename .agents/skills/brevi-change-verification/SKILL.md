---
name: brevi-change-verification
description: 'Use when Brevi runtime code, tests, contracts, documentation, or build and test configuration changed and completion needs fresh evidence.'
---

# Brevi Change Verification

Підбери найменший risk-appropriate набір checks і надай свіже evidence.

## Workflow

1. Переглянь `git status`, scoped diff і diff stat. Відокрем task changes від pre-existing worktree changes.
2. Визнач affected Nx projects через `project.json` або `npx nx show project <name> --json`.
3. Прочитай `docs/standards/testing-rules.md` і запусти relevant checks:
   - Admin React: `npm run test:web`, `npm run typecheck:tests:web`, relevant Nx lint/typecheck/build і за ризиком `npm run test:web:e2e`.
   - Storefront Angular: available Nx lint/build; test запускай лише якщо target фактично існує.
   - Contracts: `npm run contracts:generate`, `npm run contracts:check`; sync лише з явним backend checkout і revision.
   - Docs: `npm run docs:check`, `npm run docs:format:check`.
4. Для changed behavior перевір Red → Green → Refactor → Regression evidence.
5. Повідом exact commands, exit codes, tests та всі skipped або unavailable checks.

## Guardrails

- Не вважай dependency доказом доступного target.
- Не приховуй warnings, platform limitations або unrelated failures.
- Не виправляй сторонні failures без окремого scope.

## Example

`Use $brevi-change-verification to verify the current Admin changes and report exact evidence.`
