# Шаблони SDD

Цей каталог містить окремі модулі: структуру нової feature,
[аудит відповідальностей коду](code-audit/README.md) та AI workflow. Сталі
правила залишаються в [`docs/standards`](../../standards/README.md).

## Створення специфікації

Скопіюйте `feature/` до `docs/specs/<surface>/<domain>/<NNN>-<feature-slug>/`,
замініть placeholders і видаліть optional files, які не мають змісту. Не
копіюйте template `USAGE.md` до створеної feature: натомість створіть власний
`USAGE.md` з конкретними paths і готовим prompt.

```text
<NNN>-<feature-slug>/
├── README.md
├── USAGE.md
├── requirements/overview.md
├── design/frontend.md
├── contracts/api-contract.md  required for API feature; omit without API
├── traceability.md
├── tasks/
│   ├── README.md
│   ├── phases/                 orchestration only
│   └── <TS-* | EN-*>.md        one responsibility per file
└── checklist/
    ├── spec-readiness.md
    └── delivery-readiness.md
```

Спочатку заповніть rules і scenarios, потім design/test strategy, task graph і
traceability. Скористайтеся [feature/USAGE.md](feature/USAGE.md) для створення
та [AI workflow](ai-feature-workflow/README.md) після погодження.
Окремо підключіть [модуль аудиту коду](code-audit/README.md): скопіюйте
`code-audit/audit.template.md` до `<feature>/code-audit/audit.md`. Він охоплює
наявний і новий код feature до delivery checkpoint; модуль можна додати й до
вже створеної специфікації.
Для API feature спочатку запишіть `operationId`, backend OpenAPI source і версію
в [API contract template](feature/contracts/api-contract.md). Відсутню
синхронізацію/генерацію плануйте як `EN-*` за
[contract workflow](../../architecture/api/contract-workflow.md).

Існуючі специфікації мігруйте за [MIGRATION.md](MIGRATION.md), не змінюючи
історичні ID та evidence без потреби.
