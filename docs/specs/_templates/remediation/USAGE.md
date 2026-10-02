# Як створити remediation SDD

```text
Використай `docs/specs/_templates/remediation/`.
Створи SDD у `<точний destination path>`.
Scope: `<projects/libraries/files>`.
Відомі findings: `<список із evidence>`.
Applicable rules: `<точні docs paths>`.
Observable behavior to preserve: `<routes/actions/states/contracts>`.

Перевір фактичні Nx projects/tags/constraints, imports, public APIs, approved
tools, tests і git diff. Створи AF-*/AR-*, target architecture, ordered EN-*/RM-*,
traceability та readiness checklists. Кожне finding повинно мати owner, task,
dependency, exact paths і verification. Код не реалізовуй.
```
