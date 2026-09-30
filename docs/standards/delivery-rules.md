# Правила постачання

## Готовність

Feature готова до реалізації, коли:

- мета, actor, scope та exclusions однозначні;
- бізнес-правила мають стабільні `R-*`, а observable Given / When / Then
  сценарії — стабільні `SC-*`;
- невідомі product decisions вирішені або позначені `[NEEDS CLARIFICATION]` і
  винесені за межі ready scope;
- design і contracts містять лише потрібні рішення з точними source paths;
- API feature має `operationId`, backend OpenAPI source і зафіксовану версію в
  `contracts/api-contract.md`; відсутній contract tooling оформлено як `EN-*`;
- кожен сценарій має ризик-орієнтований test level та evidence target;
- `traceability.md` пов'язує кожен `SC-*` із малими `TS-*` і потрібними `EN-*`;
- кожна task dependency існує, а перші задачі графа готові.

## Деталізація та відповідальність за документи

- `docs/AGENTS.md` містить лише коротку маршрутизацію для AI.
- `docs/specs/README.md` є лише індексом feature-специфікацій.
- `_templates/README.md` пояснює створення специфікації.
- Feature `README.md` містить статус і навігацію конкретної feature.
- Feature `USAGE.md` дає українську інструкцію користувачу для створення цієї
  feature та перелік потрібних files.
- `ai-feature-workflow/README.md` є точкою входу для виконання AI.
- `ai-feature-workflow/USAGE.md` містить готові українські prompts.
- `testing-rules.md` зберігає стабільні правила тестів і TDD.
- `delivery-rules.md` зберігає readiness, traceability policy і definition of done.
- `traceability.md` містить тільки зв'язки між scenario, task, test та evidence.
- Кожен файл задачі `TS-*` або `EN-*` має одну відповідальність за реалізацію
  чи перевірку.

Requirements описують бізнес-поведінку, design — frontend boundaries і
рішення, contracts — зовнішні interfaces. Великі phase-файли лише оркеструють
планування; вони посилаються на малі task-файли й не стають implementation
checklist.

## Політика трасування

- Не перевикористовуйте ID для іншого змісту й не перенумеровуйте завершені
  задачі.
- `TS-*` містить `Covers`; `EN-*` містить `Enables`. Обидва містять `Depends
on`, exact paths, test level, Work, Evidence і Checkpoint.
- Scenario стає `verified`, лише коли всі потрібні tasks завершені й acceptance
  evidence пройшло.
- Під час зміни меж оновіть вимоги, граф задач і трасування в одній зміні
  документації.
- Старе evidence не переписуйте. Під час міграції посилайтеся на legacy phase
  як historical evidence, а нову роботу описуйте новими `TS-*`/`EN-*`.

## Межі автономного виконання

Якщо користувач дозволив усю feature, phase або набір `SC-*`, AI самостійно
переходить між усіма ready task-файлами в цьому scope за `Depends on`. Окрема
команда для кожної підфази не потрібна. Виконання зупиняється після завершення
scope або через конкретний blocker, що потребує рішення чи нового дозволу.

## Критерії завершення

Усі in-scope `SC-*` реалізовані або явно deferred; tasks і checkpoints
завершені; contracts, docs і implementation узгоджені; focused і regression
evidence записане; релевантні lint/typecheck/test/build пройшли або причина
задокументована. Delivery report перелічує scope, changed files, evidence,
невиконані перевірки та реальні залишкові ризики.
