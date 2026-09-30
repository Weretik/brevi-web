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
Решта наведених libraries, routes і providers — цільовий design; їхню
наявність потрібно перевіряти в коді.

## Карта документів

- [Застосунок і маршрутизація](application.md)
- [Домени та внутрішня структура feature](domains.md)
- [Правила залежностей](dependencies.md)
- [Nx-контракт і публічний API](nx-contract.md)
- [Стан, API та форми](state-and-api.md)
- [API-контракти та інтеграційні домовленості](../api/README.md)
- [SDD-процес і відкриті рішення](sdd-process.md)

Пов’язані стандарти:

- [Організація коду Admin](../../standards/admin-code-organization.md)
- [Інтерфейс Admin](../../standards/admin-ui.md)
- [Стратегія тестування](../../standards/testing-rules.md)
- [Правила безпеки](../../standards/security-rules.md)
- [ADR Admin](adr/)
