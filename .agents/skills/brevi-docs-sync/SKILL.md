---
name: brevi-docs-sync
description: 'Use when checking or repairing drift between Brevi Web code and versioned architecture, standards, contracts, inventory, or feature documentation.'
---

# Brevi Documentation Sync

Знайди й усунь лише підтверджений drift між repository truth та versioned docs.

## Workflow

1. Визнач scope через request, `git status` і scoped diff. Прочитай кореневий `AGENTS.md` та relevant docs indexes.
2. Встанови canonical source: Nx metadata для targets, package/config files для tooling, source public APIs для boundaries, OpenAPI snapshot для operations, feature artifacts для accepted behavior.
3. Порівняй source з `docs/architecture/`, `docs/standards/`, `docs/contracts/` і relevant `docs/specs/`; класифікуй drift як stale, missing, contradictory або historical-only.
4. В audit-only mode надай findings без edits. У repair scope внеси мінімальні зміни й виправ залежні links.
5. Contract drift маршрутизуй через `$brevi-api-contract-sync`; generated artifacts вручну не редагуй.
6. Запусти `npm run docs:check` і `npm run docs:format:check`, а для boundary changes — relevant Nx checks.

## Guardrails

- Не переписуй historical evidence або stable IDs заради стилю.
- Не документуй planned behavior як implemented.
- Не роби broad rewrite для локального drift.

## Example

`Use $brevi-docs-sync to compare current Nx targets with the frontend inventory and repair confirmed drift.`
