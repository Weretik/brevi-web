# TS-005 — Маршрут, меню і приймання

- **ID задачі:** TS-005
- **Охоплює:** SC-005
- **Залежить від:** TS-003
- **Точні шляхи:** `apps/admin-react/src/app/router/`, `libs/admin/references/feature/src/`, `apps/admin-react-e2e/src/`
- **Рівень тестування:** інтеграційний + E2E

## Робота

- [x] `/references/additional-reference` підключено через публічний export; активовано відповідний пункт меню.
- [x] Direct URL, back/forward, обидві теми й 320/768/1280 px перевірено browser E2E; mobile drawer і фокус перевіряють наявні shell tests.
- [x] Relevant lint/typecheck/test, build і E2E запущено; результати нижче.
- [x] Відповідальності перевірено в [аудиті](../code-audit/audit.md).

## Свідчення

- Фокусні тести: `app-router.integration.test.tsx`, `additional-references.spec.ts`.
- Red: до route registration прямий URL відкривав fallback; окремий поведінковий запуск до реалізації не зафіксовано.
- Green: `npx nx test admin-react -- app-router.integration` — 8/8; `npx nx e2e admin-react-e2e --grep 'additional references'` — 2/2.
- Refactor: route використовує наявну схему `availableRoutes` й public feature export; фокусні тести повторено.
- Regression: `npx nx lint admin-react`, `npx nx typecheck admin-react`, `npx nx test admin-react` (14/14), `npx nx build admin-react`, `npx nx e2e admin-react-e2e` (19/19) — успішно.

## Контрольна точка

Сторінка доступна напряму й через меню, усі SC-* verified.
