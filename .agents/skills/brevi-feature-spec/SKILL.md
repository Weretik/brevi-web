---
name: brevi-feature-spec
description: 'Use when creating, extending, or incrementally migrating a Brevi Web frontend feature specification before implementation.'
---

# Brevi Feature Specification

Створюй scenario-first SDD до зміни application code. Цей skill не реалізує feature.

## Workflow

1. Прочитай кореневий `AGENTS.md`, `docs/architecture/frontend-inventory.md`, applicable architecture і standards.
2. Визнач surface: Admin React або shared. Поточний template не має Angular variant; для Storefront Angular зупинись до створення файлів і запроси окреме погодження на розширення templates та architecture guidance.
3. Прочитай `docs/specs/_templates/feature/README.md` і створи feature в `docs/specs/<surface>/<domain>/<NNN>-<slug>/`. `USAGE.md` є підказкою користувачу, а не частиною внутрішнього workflow.
4. Для existing code зафіксуй architecture baseline і початковий code audit. Systemic findings маршрутизуй через `$brevi-remediation-plan`.
5. Створи стабільні `R-*`, Given/When/Then `SC-*`, малі `TS-*`/`EN-*` та повну traceability. Невідомі product decisions позначай `[NEEDS CLARIFICATION: ...]`.
6. Для API feature зафіксуй `operationId`, backend OpenAPI source і immutable revision до integration tasks.
7. Перевір spec-readiness і зупинись після documentation artifacts. Код не реалізовуй без окремого запиту.

## Guardrails

- Не вигадуй Nx targets, test tooling, API operations або architecture rules.
- Не перенумеровуй завершені IDs і не переписуй historical evidence.
- Новий dependency, tooling або exception оформлюй окремим `EN-*`.
- Зберігай сторонні worktree changes.

## Example

`Use $brevi-feature-spec to create an Admin product-archive specification and stop before implementation.`
