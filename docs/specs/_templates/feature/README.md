# <NNN> — <назва функціональності>

- **Поверхня:** <shared | React Web>
- **Статус:** draft
- **Власник:** <команда>
- **Оновлено:** YYYY-MM-DD

<Коротка мета й межі функціональності.>

## Навігація

- [Правила та приймальні сценарії](requirements/overview.md)
- [Проєктування frontend](design/frontend.md)
- [Споживання API-контракту](contracts/api-contract.md) — лише для feature з API
- [Трасування](traceability.md)
- [Граф задач](tasks/README.md)
- [Готовність специфікації](checklist/spec-readiness.md)
- [Готовність до постачання](checklist/delivery-readiness.md)

Окремий модуль `docs/specs/_templates/code-audit/` копіюється до
`code-audit/audit.md` цієї feature перед реалізацією.

- [Як попросити AI створити цю функціональність](USAGE.md)

Додавайте `data-model.md` лише коли він має зміст. Для feature без API видаліть
`contracts/api-contract.md` і рядок навігації до нього; для API feature файл
обов'язковий до реалізації.
