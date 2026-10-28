# FE-EN-001 — Базова структура та перевірки домену

**Стан:** client slice implemented / automated checks verified; manual acceptance pending. **Enables:** SC-C01–05 та наступні UI-сценарії. **Depends on:** Немає; узгодити backend EN-001.

## Шляхи та відповідальність

Заплановані області: `apps/admin-react/src/app/router/{legacy-menu.ts,admin-route-definitions.tsx,navigation-config.ts}; libs/admin/clients/{feature,data-access,model,ui}/; tsconfig.base.json; project.json`. У скорочених шляхах `feature/`, `ui/`, `model/`, `data-access/` базою є `libs/admin/clients/`. Один компонент/hook/mapper/type — одна основна відповідальність і окремий файл; grouping за сценарієм, public exports через index.ts.

## Робота

Зафіксувати реальні router/auth/permissions патерни, створити лише необхідні Nx layers із root aliases/tags/constraints. Перевірити наявні test/lint/typecheck targets і додати потрібну test основу, якщо її немає. Зберегти старі menu IDs. Окремо довести archived query mapping без поломки registeredPaths.

## Test level та Evidence

Документаційний/архітектурний аналіз, focused dependency/router test plan та фактичні target names.

Перевірити існування project targets перед запуском. Для нової поведінки записати focused Red → Green → Refactor → Regression (test name/команда/результат); для discovery/документації — source/link/diff evidence. Evidence зараз **не виконано**. Під час реалізації додати датований `evidence/fe-en-001.md` у SDD із SHA контракту, зміненими файлами, перевірками та обмеженнями.

## Checkpoint

Карта файлів і перевірки конкретні; жодного дубля меню/порожніх бібліотек чи вигаданого API.

Невирішений prerequisite блокує лише залежний slice; не підміняти його mock API як реалізованою можливістю. [План](../implementation-plan.md).

## Виконання

[Фактичні докази](../../evidence/clients-frontend-2026-10-26.md). Для FE-EN-001 архівне query mapping належить майбутньому FE-005; зараз підключено лише clients ID. FE-EN-002 повторюється для майбутніх API slices; поточні сім клієнтських operationIds згенеровані й перевірені.
