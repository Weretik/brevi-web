# Готові запити для AI

## Старт усієї feature

```text
Працюй за `docs/specs/_templates/ai-feature-workflow/`.
Feature: `<точний path до feature>`.
Scope: уся погоджена feature.
Виконуй усі ready TS-*/EN-* за Depends on до delivery checkpoint.
Підключи окремий модуль `docs/specs/_templates/code-audit/` і заповни
`<feature>/code-audit/audit.md` перед реалізацією та delivery checkpoint.
Якщо audit знаходить системні порушення в dependency chain, підключи погоджену
SDD за `docs/specs/_templates/remediation/` і виконай її prerequisite checkpoints.
```

## Продовження

```text
Продовжуй за `docs/specs/_templates/ai-feature-workflow/`.
Feature: `<точний path>`.
Scope: `<попередній або новий точний scope>`.
Звір task status, traceability, git diff і evidence; почни з першої ready task.
```

## Виконання фази

```text
Працюй за `docs/specs/_templates/ai-feature-workflow/`.
Feature: `<точний path>`.
Scope: phase `<номер і назва>`.
Виконай усі ready task-файли, на які посилається ця phase.
```

## Виконання сценаріїв

```text
Працюй за `docs/specs/_templates/ai-feature-workflow/`.
Feature: `<точний path>`.
Scope: `SC-001, SC-002` та обов'язкові EN-* dependencies.
Заверши всі пов'язані TS-* і онови evidence та traceability.
```

## Виконання tasks/enablers

```text
Працюй за `docs/specs/_templates/ai-feature-workflow/`.
Feature: `<точний path>`.
Scope: `TS-003, EN-002`.
Перевір Depends on, виконай checkpoints і не розширюй scope.
```

Окрема команда для кожного task-файлу в уже дозволеному scope не потрібна.
