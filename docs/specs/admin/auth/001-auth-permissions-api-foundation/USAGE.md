# Як запустити реалізацію

```text
Реалізуй `docs/specs/admin/auth/001-auth-permissions-api-foundation/` за
`$frontend-feature-delivery`.

Спочатку закрий EN-001 і EN-002: додай auth operations до versioned backend
OpenAPI з immutable commit та погодь permissions contract. Не вигадуй operationId,
claims, roles або route policies. Потім виконуй ready TS-* за Depends on.

Адаптуй, а не копіюй дослівно, джерела з:
- E:\RiderProjects\kedr-web\libs\admin\core\auth
- E:\RiderProjects\kedr-web\libs\admin\core\permissions
- E:\RiderProjects\kedr-web\libs\admin\core\shell\src\providers
- E:\RiderProjects\kedr-web\libs\admin\shared\api-client
- E:\RiderProjects\kedr-web\libs\admin\shared\config

Збережи сумісність чинних consumers у apps/admin-react, products і references,
виконай Red/Green/Refactor/Regression, онови code-audit та evidence. Не змінюй
Angular Storefront, backend, deployment config або доменну поведінку.
```
