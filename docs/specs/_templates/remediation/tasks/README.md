# Граф remediation tasks

Кожна `RM-*` виправляє одну architecture responsibility і переводить пов'язані
`AF-*` у target state. `EN-*` створює одну prerequisite. Задачі виконуються за
`Depends on`; кожна має exact paths, before evidence, work, focused regression
і checkpoint.

Фази:

1. baseline і characterization;
2. rules, tags і module boundaries;
3. domain model та DTO boundary;
4. state/data tooling;
5. UI/feature ownership;
6. public API, nesting і cleanup;
7. final verification та docs sync.

| ID     | Responsibility     | Findings     | Depends on | Status  |
| ------ | ------------------ | ------------ | ---------- | ------- |
| EN-001 | `<prerequisite>`   | `<AF або —>` | none       | planned |
| RM-001 | `<one correction>` | `<AF-*>`     | EN-001     | planned |
