---
name: brevi-feature-delivery
description: 'Use when implementing or continuing an accepted Brevi Web feature specification at whole-feature, phase, scenario, task, or enablement scope.'
---

# Brevi Feature Delivery

Реалізуй лише погоджений scope і підтримуй feature evidence синхронним із кодом.

## Workflow

1. Прочитай кореневий `AGENTS.md`, усі feature artifacts, `docs/specs/_templates/ai-feature-workflow/README.md` та workflow-файли `01`–`03`.
2. Зафіксуй authorized scope: whole feature, phase, `SC-*`, `TS-*` або `EN-*`. Не розширюй його без погодження.
3. Виконай baseline audit, потім обирай лише dependency-ready tasks. Systemic findings маршрутизуй через `$brevi-remediation-plan`.
4. Для behavior changes дотримуйся Red → Green → Refactor → Regression за `docs/standards/testing-rules.md`.
5. Оновлюй status, traceability та exact evidence після кожної завершеної responsibility.
6. Після останньої implementation-зміни застосуй `$brevi-change-verification` і повний `$brevi-code-audit`.

## Guardrails

- Не обходь readiness gates і не реалізуй незатверджені requirements.
- Не редагуй OpenAPI snapshot або generated TypeScript вручну.
- Не встановлюй tooling без погодженого `EN-*`.
- Не commit, не push і не створюй PR без прямого дозволу.
- Не включай сторонні worktree changes.

## Example

`Use $brevi-feature-delivery to implement SC-003 from the accepted Admin specification.`
