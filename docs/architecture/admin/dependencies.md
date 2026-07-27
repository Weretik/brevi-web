# Правила залежностей Admin

## Допустимі напрямки

```text
app -> core | feature | admin/shared
core -> admin/shared
feature -> ui | model | data-access | admin/shared
data-access -> model | admin/shared/api-client | admin/shared/contracts | admin/shared/util
ui -> model | admin/shared/ui | admin/shared/util
model -> admin/shared/contracts | admin/shared/util
admin/shared/* -> admin/shared/* без циклов
```

| Джерело        | Може залежати від                                   |
| -------------- | --------------------------------------------------- |
| `app`          | `core`, `feature`, `admin/shared`                   |
| `feature`      | `data-access`, `model`, domain `ui`, `admin/shared` |
| `data-access`  | `model`, API client, contracts, util                |
| domain `ui`    | `model`, shared UI, util                            |
| `model`        | contracts, util                                     |
| `admin/shared` | только `admin/shared`                               |

## Обмеження

- Домен не імпортує внутрішні модулі іншого домену.
- `admin/shared` не залежить від доменних бібліотек.
- Admin не залежить від бібліотек кореневого `libs/shared`.
- `model`, `ui` і `data-access` не залежать від `feature`.
- `ui` не імпортує `data-access`, router або feature.
- `model` залишається чистим TypeScript без React.
- API DTO не виходять із `data-access`; feature і UI використовують доменні моделі.
- Циклічні залежності заборонені.
- Між бібліотеками використовуються path aliases і публічні точки входу, а не
  relative/deep imports.

Feature одного домену не імпортує feature іншого. Сценарій кількох доменів
отримує окрему orchestration feature з явним архітектурним рішенням.
