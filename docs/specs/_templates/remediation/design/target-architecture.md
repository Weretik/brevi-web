# <remediation> — target architecture

## As-is inventory

| Project/module | Roles     | Tags/targets | Imports/tools | Problems |
| -------------- | --------- | ------------ | ------------- | -------- |
| `<path>`       | `<roles>` | `<facts>`    | `<facts>`     | `<AF-*>` |

## Target tree та ownership

```text
<точне мінімальне target tree>
```

| Layer/module | Owns                 | May depend on | Must not contain   |
| ------------ | -------------------- | ------------- | ------------------ |
| `<model>`    | `<types/invariants>` | `<allowed>`   | `<React/HTTP/...>` |

## Migration sequence

Опишіть порядок, у якому кожен проміжний стан компілюється або має окремий
checkpoint. Вкажіть compatibility exports тільки коли вони потрібні між tasks,
та окрему task для їх видалення.

## Approved tools і forbidden patterns

- Approved UI/state/API/test stack: `<tools і owners>`
- Forbidden after remediation: `<imports/patterns>`
- Search/graph checks: `<commands>`

## Behavior preservation

| Observable contract    | Characterization/regression evidence |
| ---------------------- | ------------------------------------ |
| `<route/action/state>` | `<test/command>`                     |
