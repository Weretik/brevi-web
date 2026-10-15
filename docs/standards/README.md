# Правила frontend-розробки

Це індекс сталих правил. Feature-специфікації посилаються на них і не копіюють
їх у task-файли.

## За застосунком

- **Admin React:** [організація коду](admin/admin-code-organization.md), [UI](admin/admin-ui.md), [API та дані](admin/api-data-rules.md), [безпека](admin/security-rules.md), [архітектура й модулі](../architecture/admin/README.md).
- **Storefront Angular:** [UI та PrimeNG](storefront-ui.md), [архітектура й модулі](../architecture/storefront/README.md). Admin-правила RTK Query, MUI та AuthSessionAdapter не застосовуються до Angular.

## Робочий процес

- [Правила тестування](shared/testing-rules.md) — загальний вибір рівня за ризиком; React/Vitest/RTK Query та `admin-react-e2e` розділи стосуються Admin. Storefront targets перевіряй у Nx та [inventory](../architecture/frontend-inventory.md).
- [Правила постачання](shared/delivery-rules.md) — готовність, трасування та завершення feature.
- [Правила роботи з файлами](shared/repository-conventions.md) — scope зміни та UTF-8.
