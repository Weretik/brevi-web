# Архітектура Admin

- **Область:** цільова архітектура React Web застосунку `apps/admin-react`
- **Статус:** частково реалізована; фактичний стан описаний у
  [frontend inventory](../frontend-inventory.md)
- **Підхід:** domain-first

## Призначення

Документи задають цільовий архітектурний контракт React Admin: межі доменів,
допустимі залежності, організацію стану й API, правила Nx та SDD-процес. Нову
можливість спочатку описують специфікацією, а потім реалізують у цих межах.
Спільний shell і тема React Admin реалізовані за
[SDD оболонки](../../specs/admin/shell/001-react-admin-shell-theme/README.md).
[Карта наявних модулів](structure/modules.md) відокремлює реалізовані Nx projects і
маршрути від цільових структур у решті документів. Перед зміною перевіряй
фактичний стан у коді.

## Карта документів

- [Наявні модулі та маршрути](structure/modules.md)
- [Фактичні функціональності Admin](../../features/README.md#admin-react-appsadmin-react)
- [Застосунок і маршрутизація](runtime/application.md)
- [Домени та внутрішня структура feature](structure/domains.md)
- [Правила залежностей](structure/dependencies.md)
- [Nx-контракт і публічний API](structure/nx-contract.md)
- [Стан, API та форми](runtime/state-and-api.md)
- [API-контракти та інтеграційні домовленості](../api/README.md)
- [SDD-процес і відкриті рішення](sdd-process.md)

Пов’язані стандарти:

- [Організація коду Admin](../../standards/admin/admin-code-organization.md)
- [Інтерфейс Admin](../../standards/admin/admin-ui.md)
- [Стратегія тестування](../../standards/shared/testing-rules.md)
- [Правила безпеки](../../standards/admin/security-rules.md)
- [ADR Admin](adr/)
