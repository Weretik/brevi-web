# Повний аудит архітектури та відповідальностей коду

Це обов'язковий quality gate для наявного й нового коду feature. Він перевіряє
не лише декомпозицію компонентів, а й відповідність фактичної реалізації
architecture/standards: Nx projects і tags, напрям залежностей, domain layers,
вкладеність, public API, approved state/data stack, DTO boundary, test tooling
і відсутність мертвих модулів.

Скопіюйте [audit.template.md](audit.template.md) до
`<feature>/code-audit/audit.md`. Виконуйте фази по черзі:

1. [00 — inventory та джерела правил](phases/00-inventory.md);
2. [01 — projects, layers і module boundaries](phases/01-architecture-boundaries.md);
3. [02 — state, API, DTO та інструменти](phases/02-state-data-tools.md);
4. [03 — UI, feature orchestration і декомпозиція](phases/03-ui-feature.md);
5. [04 — public API, imports і вкладеність](phases/04-public-structure.md);
6. [05 — test tooling та regression safety](phases/05-testing.md);
7. [06 — виправлення й delivery gate](phases/06-remediation-verification.md).

## Статуси findings

Кожна розбіжність отримує стабільний `AF-*` і один статус: `open`, `blocked`,
`fixed`, `verified` або `deferred-approved`. Finding пов'язується з конкретною
`TS-*`/`EN-*` feature-задачею або `RM-*` у
[remediation SDD](../remediation/README.md).

`open`, `blocked` і просто `planned` не проходять delivery checkpoint. Статус
`deferred-approved` допустимий лише коли owner, причина, окрема SDD/task і явне
погодження винесення за поточний scope записані в аудиті. Порушення в dependency
chain поточної задачі не можна deferred: воно стає prerequisite.

## Обов'язкові правила

- Поточний код не є джерелом архітектурної істини. Спочатку читаються
  `docs/architecture`, `docs/standards`, Nx config і feature design.
- Наявність package не доводить використання approved tool; перевіряються
  imports, providers, configs, targets і executable tests.
- Якщо standards вимагають RTK Query, direct `fetch` або ручний
  `useEffect/useState` server lifecycle є finding, навіть коли lint проходить.
- Відсутній потрібний `model`, `ui`, `data-access` чи shared/core module
  створюється task-ом; порожній шар наперед не створюється.
- Nx tags/constraints повинні дозволяти документований напрям і забороняти
  зворотний. Архітектура не вважається виконаною лише через назви каталогів.
- Між libraries дозволені тільки задокументовані public entry points. Deep
  aliases, private mapper/parser/transport exports і generated DTO у UI є
  findings.
- Плоскі `components/hooks/pages/collections` перевіряються як topology, а не
  лише як окремі файли: `>= 8` production-файлів вимагають явного рішення, а
  змішування `>= 2` незалежних flows/resources вимагає capability-підкаталогів
  усередині кожної ролі (`pages/<module>`, `components/<module>`,
  `hooks/<module>`).
- Виправлення зберігає observable behavior через characterization/regression
  evidence. Architecture-only remediation не потребує штучного behavioral Red.
- Аудит не завершується переліком проблем: усі findings у scope виправляються й
  перевіряються або блокують checkpoint.

Для системного боргу, який охоплює кілька features/libraries, спочатку створіть
окрему remediation SDD, а feature-задачі зв'яжіть із її checkpoints.

[Готовий запит для AI](USAGE.md).
