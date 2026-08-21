# Шаблон Admin feature

Створіть `docs/specs/admin/<domain>/<NNN>-<feature-slug>/` і заповніть
артефакти в порядку `spec.md → plan.md → tasks.md`. Шаблон відокремлює
користувацькі вимоги від технічного рішення та задач реалізації.

```text
<NNN>-<feature-slug>/
├── spec.md                   # user stories, requirements, acceptance criteria
├── plan.md                   # technical context, architecture, real source paths
├── research.md               # рішення для відкритих технічних питань
├── data-model.md             # domain/view models, DTO boundary та інваріанти
├── quickstart.md             # lint, tests, build і ручна перевірка
├── contracts/
│   └── api-contract.md       # endpoint, DTO boundary, access
├── tasks/                    # окремі фази реалізації за user story
└── checklists/
    ├── requirements.md       # повнота та перевірюваність requirements
    └── delivery.md           # готовність delivery
```

Admin feature використовує `libs/admin/<domain>/{model,data-access,ui,feature}`.
`data-access` володіє DTO, mapper та RTK Query hooks; `ui` не викликає API або
router; `feature` збирає page і локальний UI-state. Усі міжбібліотечні імпорти
йдуть через публічний `src/index.ts`.

`tasks/` групує задачі за user story, а не за шарами. Кожна задача містить
стабільний ID, `[US#]`, за потреби `[P]`, точний шлях і перевірюваний результат.

## Порядок створення документів

1. Створіть [spec.md](spec.md): **що** отримує користувач — user stories,
   requirements, acceptance scenarios, edge cases, Security/access і Test strategy.
2. За наявності невизначеності створіть [research.md](research.md): питання,
   рішення, докази та відхилені альтернативи.
3. Створіть [plan.md](plan.md): **як** feature лягає в поточний Admin-код —
   libraries, public API, межі та точні source paths.
4. Якщо feature працює з даними, додайте [data-model.md](data-model.md) і,
   за потреби, [API contract](contracts/api-contract.md).
5. Заповніть [requirements checklist](checklists/requirements.md) до коду.
6. Створіть фази в [tasks/](tasks/): спочатку plan gate і foundation, потім
   кожна user story окремою independently testable поставкою. Для кожної story
   задачі на tests і security scenarios є обов'язковими або мають `n/a` з причиною.
7. Після реалізації заповніть [quickstart.md](quickstart.md), результати фаз
   і [delivery checklist](checklists/delivery.md).

## Зв'язок артефактів

```text
spec.md ──► research.md (за потреби) ──► plan.md
   │                                      │
   ├──► data-model.md / contracts/ ◄──────┤
   │                                      ▼
   └──────────────────────────────► tasks/ ──► quickstart.md ──► delivery checklist
```
