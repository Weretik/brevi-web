# Як виконати доповнення Admin-товару

```text
Працюй за docs/specs/_templates/ai-feature-workflow/.
Feature: docs/specs/admin/products/002-admin-product-scenario/.
Scope: уся feature.
Виконуй ready EN-/TS- за Depends on до delivery checkpoint.
Джерело: C:/Users/Віталій/RiderProjects/BreviERP/docs/sdd/frontend-scenario/catalog/001-product-page/admin-product-scenario.md, commit a033d044950f735da0ac04f3557e09ecfeebeaa6.
Уточнення користувача: у detail одночасно показати й у формах редагувати обидві мови, без перемикача мови.
Не змінюй backend і не переписуй історичне evidence 001-products-table.
```

Можна звузити scope до конкретного `SC-*` або `TS-*`; перед початком перевірити його залежності в [графі](tasks/README.md). Аудит зміненого коду вести за `docs/specs/_templates/code-audit/` у [записі](code-audit/audit.md).
