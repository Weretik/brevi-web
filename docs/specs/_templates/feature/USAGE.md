# Як створити feature-специфікацію

Передайте AI точний destination path, мету, scope, exclusions, відомі правила
та пов'язані files.

```text
Використай `docs/specs/_templates/feature/`.
Створи специфікацію в `docs/specs/<surface>/<domain>/<NNN>-<feature-slug>/`.
Мета: <спостережуваний результат>.
Surface: <React Web | shared>.
Scope: <включена поведінка>.
Поза scope: <виключена поведінка>.
Відомі правила: <правила й обмеження>.
Пов'язані файли: <точні paths до code/docs/contracts>.
API: <немає | backend repository, OpenAPI path, commit/tag, operationId для кожної операції>.

Сформулюй R-* і Given/When/Then SC-*, визнач test levels з фактичного tooling,
проведи architecture baseline і початковий аудит наявного коду feature в
`design/frontend.md`, підключи `docs/specs/_templates/code-audit/`. Перевір Nx
tags/constraints, layers/nesting, public entry points, approved state/API stack,
DTO boundary і source/test targets. Для системних розбіжностей створи dependency
на SDD за `docs/specs/_templates/remediation/`. Підготуй малі TS-*/EN-* та
traceability. Код не реалізовуй.
```

Обов'язково вкажіть `docs/specs/_templates/feature/` і destination path. За
наявності додайте paths до попередньої feature, API contract, navigation map,
design reference або browser permission policy.
Для feature з API заповніть `contracts/api-contract.md` до задач інтеграції;
якщо tooling контрактів ще немає, додайте `EN-*` і не вважайте його готовим.
Для feature без API видаліть цей файл.
