# Consumer contract: workshop references

- **Canonical OpenAPI:** `docs/sdd/contracts/production/workshop-references.openapi.yaml` in
  `https://github.com/Weretik/BreviERP.git`, commit `ba9a568036a2861370f26a36823dd772c40e8494` (PRD-001 stage 1).
- **Snapshot:** `docs/contracts/openapi/backend/production/`, types in `@admin/shared/contracts`.

| operationId               | Admin use                                      | Cache                                |
| ------------------------- | ---------------------------------------------- | ------------------------------------ |
| getWorkshopStaff          | «Працівники цеху» (with archived, one request) | provides `WorkshopEmployee` LIST     |
| createWorkshopEmployee    | «Додати працівника»                            | invalidates staff                    |
| updateWorkshopEmployee    | Side panel «Редагувати»                        | invalidates staff                    |
| setWorkshopEmployeeActive | «В архів» / «Повернути в цех»                  | invalidates staff                    |
| importWorkshopStaff       | «Імпорт»: preview (dryRun) and save            | invalidates staff after a save       |
| getFabricNorms            | «Норми витрати тканини»                        | provides `FabricNorm` LIST           |
| saveFabricNorm            | Side panel «Задати норму» / «Редагувати»       | invalidates norms                    |
| deleteFabricNorm          | «Видалити норму»                               | invalidates norms                    |
| importFabricNorms         | «Імпорт»: preview and save                     | invalidates norms after a clean save |
| getPayrollParameters      | «Правила зарплати»                             | provides `PayrollParameter` LIST     |

`data-access/src/mappers` validate every field at runtime and return `@admin/production/model` types. Errors: 400 shows the backend's first field message, 404 says the worker or model is gone, 409 says the worker name is taken.
