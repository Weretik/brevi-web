# Frontend SDD-специфікації

Специфікація описує одну нетривіальну frontend-feature до початку реалізації.
Вона фіксує користувацький результат, UI-стани, API-контракти, межі бібліотек і
перевірки. Код, контракти й специфікація оновлюються в одному change set.

## Розміщення

Створюйте нову специфікацію у домені Admin:

```text
docs/specs/
└── admin/<domain>/<NNN>-<feature-slug>/
```

`<NNN>` — послідовний номер у домені, наприклад `001-product-catalog`. Для
невеликої зміни достатньо одного Markdown-файлу; папкова специфікація потрібна,
коли feature має кілька незалежно reviewable фаз, UI-сценарії або зовнішній
контракт.

## Шаблон feature

Заповнюйте [шаблон Admin feature](./_templates/admin-feature/) у порядку
`spec.md → plan.md → tasks.md`. `research.md`, `data-model.md` і `contracts/`
створюються лише коли вони потрібні feature.

```text
<NNN>-<feature-slug>/
├── spec.md                   # user stories, requirements, acceptance scenarios
├── plan.md                   # technical context і реальні source paths
├── research.md               # рішення відкритих технічних питань
├── data-model.md             # domain/view models, DTO boundary та інваріанти
├── quickstart.md             # команди перевірки та ручні сценарії
├── contracts/                # API і navigation contracts
├── tasks/                    # dependency-ordered phases by user story
└── checklists/               # requirements і delivery checklists
```

`_templates/git/git-commit-batching.md` — окремий шаблон для планування комітів;
він не належить до специфікації feature.
