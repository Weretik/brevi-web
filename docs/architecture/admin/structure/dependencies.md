# Admin Dependency Rules

## Allowed directions

```text
app -> core | feature | admin/shared
core -> admin/shared
feature -> ui | model | data-access | admin/shared
data-access -> model | admin/shared/api-client | admin/shared/contracts | admin/shared/util
ui -> model | admin/shared/ui | admin/shared/util
model -> admin/shared/contracts | admin/shared/util
admin/shared/* -> admin/shared/* without cycles
```

| Source         | May depend on                                       |
| -------------- | --------------------------------------------------- |
| `app`          | `core`, `feature`, `admin/shared`                   |
| `feature`      | `data-access`, `model`, domain `ui`, `admin/shared` |
| `data-access`  | `model`, API client, contracts, utilities           |
| Domain `ui`    | `model`, shared UI, utilities                       |
| `model`        | contracts, utilities                                |
| `admin/shared` | `admin/shared` only                                 |

## Constraints

- A domain does not import another domain's internal modules.
- `admin/shared` does not depend on domain libraries.
- Admin does not depend on root `libs/shared` libraries.
- `model`, `ui`, and `data-access` do not depend on `feature`.
- `ui` does not import `data-access`, router, or feature.
- `model` remains plain TypeScript without React.
- API DTOs do not leave `data-access`; feature and UI use domain models.
- Circular dependencies are prohibited.
- Between libraries, use path aliases and public entry points rather than relative or deep imports.

A feature in one domain does not import a feature from another. A scenario
spanning multiple domains gets a separate orchestration feature with an
explicit architecture decision.
