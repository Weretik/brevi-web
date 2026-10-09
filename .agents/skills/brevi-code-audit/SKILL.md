---
name: brevi-code-audit
description: 'Use when performing a Brevi Web architecture and code audit, or when feature delivery requires its baseline or final audit phases.'
---

# Brevi Code Audit

Перевір фактичний код проти documented architecture, standards і Nx boundaries.

## Workflow

1. Визнач scope і прочитай кореневий `AGENTS.md`, frontend inventory, applicable architecture, standards та feature artifacts.
2. Прочитай `docs/specs/_templates/code-audit/README.md` і виконай phases `00`–`06`; для delivery baseline потрібні `00`–`01`, після implementation — повний audit.
3. Перевір Nx projects/tags, dependency direction, layers, public APIs, state/data stack, DTO mapping, UI orchestration, tests і dead modules.
4. Запиши stable `AF-*` з severity, status, exact paths, evidence, owner, target, task, dependencies і verification.
5. Feature-local findings зв'яжи з `TS-*`/`EN-*`; systemic findings маршрутизуй через `$brevi-remediation-plan`.
6. В audit-only запиті не змінюй implementation. У delivery scope findings повертаються coordinator як blockers до виправлення й verification.

## Guardrails

- Не приймай current code як architecture source of truth.
- Не закривай finding без нового evidence.
- Open, blocked або planned in-scope findings блокують delivery.

## Example

`Use $brevi-code-audit to run phases 00–06 for the Admin products feature and record actionable findings.`
