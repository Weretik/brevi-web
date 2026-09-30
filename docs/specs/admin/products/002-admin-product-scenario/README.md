# 002 — Відповідність Admin-сценарію товару

- **Поверхня:** React Web
- **Статус:** delivery checkpoint; fixture acceptance перевірено, Red evidence gap задокументовано
- **Власник:** admin/products
- **Оновлено:** 2026-09-29

Ця SDD доповнює [реалізовану таблицю й CRUD](../001-products-table/README.md): менеджер бачить усі дані Product detail і може керувати порядком, фото та умовними блоками форми відповідно до backend адміністративного сценарію. Канонічний шлях джерела наведено нижче.

**Джерело поведінки:** `C:/Users/Віталій/RiderProjects/BreviERP/docs/sdd/frontend-scenario/catalog/001-product-page/admin-product-scenario.md` на commit `a033d044950f735da0ac04f3557e09ecfeebeaa6` (SHA-256 `aeb24e0f7a36a8966564682f9e2944006271e4d6e3c2cea8ce0e84c15fb2939c`). API snapshot лишається на commit `7178113572c5c0da21ba9f28db5d94f96dc8e1b6`; OpenAPI між цими commit не змінювався. Ця feature не переписує свідчення `001-products-table`.

## Межі

- У scope: список, повна admin-картка, вміст і порядок колекцій, безпечний перегляд опису, готовність медіа, обмеження вибору PPE, зміна типу, результати write та стани помилок.
- Поза scope: публічна сторінка товару, нові backend endpoints, перерахунок цін на клієнті, глобальна локалізація всього Admin, нові дизайн-токени, інші довідники як самостійні feature.
- Маршрути `/references/products`, `/create`, `/:id`, `/:id/edit` і shell зберігаються. Сценарій не задає точного розташування колонок, вкладок або кольорів.

## Навігація

- [Правила й приймальні сценарії](requirements/overview.md)
- [Проєктування й початковий аудит](design/frontend.md)
- [API-контракт](contracts/api-contract.md)
- [Трасування](traceability.md)
- [Граф задач](tasks/README.md)
- [Готовність специфікації](checklist/spec-readiness.md)
- [Готовність до постачання](checklist/delivery-readiness.md)
- [Аудит після реалізації](code-audit/audit.md)
- [Інструкція виконання](USAGE.md)
