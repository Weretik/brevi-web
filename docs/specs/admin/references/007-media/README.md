# 007 — Медіа/Фото

- **Поверхня:** React Web
- **Статус:** delivery checkpoint; Admin authorization і частина Red evidence deferred
- **Власник:** admin/products
- **Оновлено:** 2026-09-29

Окрема сторінка керування фотографіями каталогу в групі меню «Загальні
довідники». Співробітник бачить візуальну галерею, може знайти фото за назвою,
завантажити нове й видалити непотрібне після підтвердження. Реалізацію і
перевірки завершено; platform-wide захист Admin API лишається передумовою.

## Навігація

- [Правила та приймальні сценарії](requirements/overview.md)
- [Проєктування frontend](design/frontend.md)
- [Модель даних](data-model.md)
- [Споживання API-контракту](contracts/api-contract.md)
- [Аудит відповідальностей](code-audit/audit.md)
- [Трасування](traceability.md)
- [Граф задач](tasks/README.md)
- [Готовність специфікації](checklist/spec-readiness.md)
- [Готовність до постачання](checklist/delivery-readiness.md)
- [Як виконувати](USAGE.md)

Основа: наявні React-довідники, product media transport, Brevi MUI theme і
контракт backend commit `e4c1588659684f3d5174fc6dfbfd5bfbd420a6ea`.
