# Шаблон SDD для виправлення наявної архітектури

Використовуйте цей шаблон, коли проблема вже існує в кількох файлах, libraries
або features і її не можна чесно виправити однією behavioral `TS-*`. Remediation
SDD зберігає observable behavior, переводить код із фактичного стану в
документовану target architecture і дає feature-задачам явні prerequisites.

```text
<NNN>-<remediation-slug>/
├── README.md
├── USAGE.md
├── requirements/findings.md
├── design/target-architecture.md
├── traceability.md
├── tasks/
│   ├── README.md
│   ├── EN-NNN-enabler.template.md
│   ├── RM-NNN-remediation.template.md
│   └── phases/
└── checklist/{spec-readiness,delivery-readiness}.md
```

IDs:

- `AF-*` — verified architecture finding;
- `AR-*` — stable architecture requirement/constraint;
- `RM-*` — one executable remediation responsibility;
- `EN-*` — prerequisite tooling, characterization або migration support.

Remediation не вигадує нову architecture. Кожен `AR-*` посилається на чинний
architecture/standard source. Якщо документи суперечать один одному, перша
задача узгоджує їх до implementation. `RM-*` не потребує штучного Red, але має
мати before evidence, target checkpoint, focused regression і final verification.

Після створення підключіть [повний code audit](../code-audit/README.md).
