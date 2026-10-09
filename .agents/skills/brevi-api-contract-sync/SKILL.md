---
name: brevi-api-contract-sync
description: 'Use when syncing, changing, generating, or consuming a backend OpenAPI operation through Brevi Web API contracts.'
---

# Brevi API Contract Sync

Підтримуй backend OpenAPI, versioned snapshot, generated types і frontend consumer синхронними.

## Workflow

1. Прочитай `docs/architecture/api/contract-workflow.md`, relevant feature contract і consumer boundary.
2. Знайди stable `operationId`. Якщо operation відсутня, не вигадуй schema або handwritten transport type; зафіксуй backend blocker.
3. Для sync потрібні явні backend checkout і immutable commit/tag. Запусти `npm run contracts:sync -- <backend-checkout> <backend-commit>` лише в погодженому scope.
4. Запусти `npm run contracts:generate` і `npm run contracts:check`. Не редагуй snapshot YAML або generated TypeScript вручну.
5. Використовуй generated operation types через `@admin/shared/contracts` на transport/data-access boundary; перевір runtime response і map до application model.
6. Онови feature contract, consumer tests і relevant Nx checks.

## Guardrails

- Не змінюй backend repository без прямої авторизації.
- Не перенос generated DTO у feature/UI/domain model.
- Не обходь clean checkout або immutable revision requirements.

## Example

`Use $brevi-api-contract-sync to synchronize the accepted product archive operation and update its Admin consumer.`
