# <remediation> — findings і вимоги

## Мета та межі

- **Мета:** <який architecture state буде відновлено>
- **У межах:** <projects/libraries/files>
- **Поза межами:** <явні exclusions>
- **Поведінка, яку зберігаємо:** <routes/actions/contracts/states>

## Architecture requirements

- **AR-001:** `<правило>` — джерело: `<doc path#section>`.
- **AR-002:** `<правило>` — джерело: `<doc path#section>`.

## Findings

| ID     | Severity             | Порушує  | Evidence              | Impact    | Target state        |
| ------ | -------------------- | -------- | --------------------- | --------- | ------------------- |
| AF-001 | `<blocker/high/...>` | `AR-001` | `<path:line/command>` | `<ризик>` | `<перевірна умова>` |

Finding описує перевірений факт, а не припущення. Не об'єднуйте незалежні
проблеми в один `AF-*` лише для скорочення task graph.
