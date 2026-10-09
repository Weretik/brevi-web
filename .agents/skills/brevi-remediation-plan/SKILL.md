---
name: brevi-remediation-plan
description: 'Use when verified Brevi architecture findings span multiple files, libraries, features, or boundaries and require a separate remediation specification.'
---

# Brevi Remediation Plan

Перетвори systemic findings на dependency-ordered remediation SDD. Не реалізуй план у цьому skill.

## Workflow

1. Прочитай source audit, кореневий `AGENTS.md`, inventory, affected architecture docs і standards.
2. Прочитай `docs/specs/_templates/remediation/README.md` і використовуй canonical templates.
3. Підтвердь root cause та affected boundaries на коді; відокрем symptoms від systemic cause.
4. Створи remediation spec у доречному scope під `docs/specs/` з traceability між `AF-*`, `AR-*`, `EN-*` і `RM-*`.
5. Для кожного task вкажи exact paths, dependencies, migration order, preserved behavior, verification і rollback considerations.
6. Перевір readiness і запроси окреме погодження до implementation.

## Guardrails

- Не створюй remediation SDD для локального one-file fix.
- Не закривай source findings фактом створення плану.
- Не змінюй runtime code або generated artifacts у planning scope.

## Example

`Use $brevi-remediation-plan to turn AF-007 and AF-009 into an Admin architecture remediation specification.`
