---
name: brevi-feature-orchestrator
description: 'Use when implementing an accepted Brevi Web feature specification with multiple agents and coordinating dependency-aware delivery, integration, verification, audit, and PR handoff.'
---

# Brevi Feature Orchestrator

Координуй multi-agent delivery лише для прийнятої feature specification. Цей skill не створює specification і не обходить readiness gate.

## Required input

- Exact feature path під `docs/specs/`.
- Authorized scope: whole feature, phase, `SC-*`, `TS-*` або `EN-*`.
- Явний запит на multiple agents.
- Окреме рішення щодо Git commits; default — no commits, push або PR.

Якщо specification не ready або містить unresolved `[NEEDS CLARIFICATION: ...]`, зупинись і маршрутизуй через `$brevi-feature-spec`.

## Workflow

1. Прочитай кореневий `AGENTS.md`, feature artifacts, inventory, applicable architecture/standards і `docs/specs/_templates/ai-feature-workflow/README.md` з phases `01`–`03`.
2. Підтвердь readiness та baseline audit. Побудуй dependency graph для in-scope `SC-*`, `TS-*` і `EN-*`.
3. Створи dependency-ready work packets за `references/delegation-contract.md`. Признач одного owner кожному mutable path; shared evidence залишається coordinator-owned.
4. Делегуй початково не більше двох-трьох незалежних packets. Кожен implementation agent застосовує `$brevi-feature-delivery`; API packet — `$brevi-api-contract-sync`.
5. У shared workspace паралель лише для read-only або непересічних paths. Пов'язані edits виконуй послідовно або в explicit isolated worktrees.
6. Після кожної wave переглянь diffs, виконай narrow checks, інтегруй dependency order і coordinator-only evidence updates.
7. Після final integration паралельно запусти `$brevi-change-verification` і read-only `$brevi-code-audit`; coordinator записує findings та evidence.
8. Open in-scope findings блокують completion. Systemic findings маршрутизуй через `$brevi-remediation-plan`.
9. Після gates застосуй `$brevi-pr-handoff`; не push і не створюй PR без окремого запиту.

## Git policy

Якщо commits дозволені, дотримуйся `docs/specs/_templates/git/git-commit-batching.md`: один commit — одна логічна зміна, без unrelated files. Agents ніколи не push і не merge.

## Stop conditions

Зупинись при ambiguous scope, unresolved requirements, overlapping ownership, missing dependency/`EN-*`, out-of-scope contract change, unavailable required verification або open in-scope findings.

## Example

`Use $brevi-feature-orchestrator to implement the accepted specification at docs/specs/admin/catalog/002-product-archive/ with multiple agents and stop before push or PR creation.`
