# 001 — Auth, permissions і API foundation React Admin

- **Поверхня:** React Web
- **Статус:** complete
- **Власник:** frontend
- **Оновлено:** 2026-10-02

SDD описує адаптацію auth/session, permissions, shell session provider,
Axios/RTK Query transport і runtime config із `D:\RiderProjects\kedr-web` до
наявної архітектури `brevi-web`. Реалізація має зберегти чинні Admin routes,
RTK Query endpoints, error UX і публічні aliases; це не механічне копіювання.

## Навігація

- [Правила та приймальні сценарії](requirements/overview.md)
- [Проєктування frontend](design/frontend.md)
- [Модель даних](data-model.md)
- [Споживання API-контракту](contracts/api-contract.md)
- [Трасування](traceability.md)
- [Граф задач](tasks/README.md)
- [Початковий code audit](code-audit/audit.md)
- [Готовність специфікації](checklist/spec-readiness.md)
- [Готовність до постачання](checklist/delivery-readiness.md)
- [Як запустити реалізацію](USAGE.md)

Auth, shell, API client і config реалізовані. За рішенням власника feature
granular permissions винесено за межі цієї delivery: `/me` надає лише roles,
першого permission consumer немає, тому порожня `admin/core/permissions`
library не створюється. Final contract gate закрито backend commit
`79cccf9b88168b726ac588640f6b397c0ed9afd4`.
