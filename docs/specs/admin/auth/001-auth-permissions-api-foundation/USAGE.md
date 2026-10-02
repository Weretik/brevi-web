# Як запустити реалізацію

```text
Реалізуй `docs/specs/admin/auth/001-auth-permissions-api-foundation/` за
`docs/specs/_templates/ai-feature-workflow/README.md`.

Спочатку закрий EN-001 і EN-002: додай auth operations до versioned backend
OpenAPI з immutable commit та погодь permissions contract. Не вигадуй operationId,
claims, roles або route policies. Потім виконуй ready TS-* за Depends on.

Адаптуй, а не копіюй дослівно, джерела з:
- D:\RiderProjects\kedr-web\libs\admin\core\auth
- D:\RiderProjects\kedr-web\libs\admin\core\permissions
- D:\RiderProjects\kedr-web\libs\admin\core\shell\src\providers
- D:\RiderProjects\kedr-web\libs\admin\shared\api-client
- D:\RiderProjects\kedr-web\libs\admin\shared\config

Збережи сумісність чинних consumers у apps/admin-react, products і references,
виконай Red/Green/Refactor/Regression, онови code-audit та evidence. Не змінюй
Angular Storefront, backend, deployment config або доменну поведінку.
```
