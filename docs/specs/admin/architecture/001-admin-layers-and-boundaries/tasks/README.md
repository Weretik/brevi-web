# Граф remediation tasks

| ID     | Responsibility                             | Findings                       | Depends on     | Status   |
| ------ | ------------------------------------------ | ------------------------------ | -------------- | -------- |
| EN-001 | Characterization і test typecheck baseline | AF-009                         | none           | complete |
| RM-001 | Nx tags і dependency constraints           | AF-001                         | EN-001         | complete |
| RM-002 | Shared contracts/config/baseApi foundation | AF-004, AF-006, AF-010         | RM-001         | complete |
| RM-003 | Products domain model boundary             | AF-002                         | RM-001, RM-002 | complete |
| RM-004 | References domain model boundary           | AF-003                         | RM-001, RM-002 | complete |
| RM-005 | Products RTK Query migration               | AF-004                         | RM-003, RM-004 | complete |
| RM-006 | References RTK Query migration             | AF-004                         | RM-004         | complete |
| RM-007 | Products UI/feature separation             | AF-005                         | RM-005         | complete |
| RM-008 | References UI/feature separation           | AF-005                         | RM-006         | complete |
| RM-009 | Public API, nesting і dead-tree cleanup    | AF-006, AF-007, AF-008, AF-010 | RM-002–RM-008  | complete |
| RM-010 | Full architecture verification і docs sync | AF-001–AF-010                  | RM-009         | complete |

Фази відповідають `docs/specs/_templates/remediation/tasks/phases/`. Не
об'єднуйте domain migrations в одну зміну: products і references мають окремі
regression suites та checkpoints.
