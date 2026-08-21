# Feature specification: <назва Admin feature>

**Створено:** YYYY-MM-DD  
**Статус:** draft  
**Вхід:** <короткий опис user request>

## User scenarios and testing

### User story 1 — <назва> (Priority: P1)

<Сценарій простою мовою.>

**Independent test:** <як перевірити цю історію окремо від інших.>

**Acceptance scenarios:**

1. Given <стан>, when <дія>, then <результат>.

### User story 2 — <назва> (Priority: P2)

<Сценарій простою мовою.>

**Independent test:** <як перевірити цю історію окремо.>

**Acceptance scenarios:**

1. Given <стан>, when <дія>, then <результат>.

## Edge cases

- <loading, empty, error, forbidden, boundary condition>

## Security and access

- **Review level:** <n/a | basic | elevated; причина вибору>.
- **Actors / roles:** <хто працює з feature>.
- **Route and action access:** <route, read і кожна mutation; backend permission>.
- **Sensitive data:** <PII / financial / files / none>.
- **Security scenarios:** <401, 403, session expiry, invalid input; або n/a з причиною>.
- **Threat model:** <для elevated: asset, actor, entry point, mitigation, verification>.

## Test strategy

| Рівень              | Сценарії / точний test path               | Рішення          |
| ------------------- | ----------------------------------------- | ---------------- |
| Unit                | <pure rules або n/a з причиною>           | <required / n/a> |
| Integration         | <API, mapping, errors або n/a з причиною> | <required / n/a> |
| Component / feature | <user-visible outcome або n/a з причиною> | <required / n/a> |
| E2E                 | <critical journey або n/a з причиною>     | <required / n/a> |

## Requirements

- **FR-001**: Система повинна <конкретна поведінка>.
- **FR-002**: Користувач повинен мати змогу <взаємодія>.
- **FR-003**: <a11y, responsive, i18n або analytics requirement, якщо застосовно>.
- **FR-004**: <access / security requirement, якщо застосовно>.

## Success criteria

- **SC-001**: <вимірюваний користувацький результат>.
- **SC-002**: <вимірювана якісна або performance умова>.

## Assumptions and dependencies

- <існуючий API, permission, route або dependency>
