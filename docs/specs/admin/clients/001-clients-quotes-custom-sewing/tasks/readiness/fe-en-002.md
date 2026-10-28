# FE-EN-002 — Контрактний handoff кожного API slice

**Стан:** client and P2 draft-quote slices implemented / automated checks verified; manual acceptance pending. Current backend SHA `f185138fc1cfc6c71cf94fe4e7103652e6719b5b`; sync/generate/check passed. [P2 evidence](../../evidence/p2-frontend-2026-10-27.md). **Enables:** Усі API-сценарії відповідного slice. **Depends on:** Відповідна backend TS-задача та FE-EN-001.

## Шляхи та відповідальність

Заплановані області: `tools/contracts/; libs/admin/shared/contracts/; feature contracts/api-contract.md; чинні provenance/snapshot файли`. У скорочених шляхах `feature/`, `ui/`, `model/`, `data-access/` базою є `libs/admin/clients/`. Один компонент/hook/mapper/type — одна основна відповідальність і окремий файл; grouping за сценарієм, public exports через index.ts.

## Робота

Повторювати для кожного нового backend slice: отримати чистий immutable backend SHA, перевірити всі потрібні operationIds/errors, виконати contracts:sync/generate/check, записати справжню provenance. Не правити generated/snapshot вручну і не позначати майбутні операції як існуючі.

## Test level та Evidence

Actual SHA/date/source/sync command, перевірки snapshot/generation; schema-specific runtime mapper tests плануються у відповідному FE slice.

Перевірити існування project targets перед запуском. Для нової поведінки записати focused Red → Green → Refactor → Regression (test name/команда/результат); для discovery/документації — source/link/diff evidence. Evidence зараз **не виконано**. Під час реалізації додати датований `evidence/fe-en-002.md` у SDD із SHA контракту, зміненими файлами, перевірками та обмеженнями.

## Checkpoint

P3 handoff verified 2026-10-28: backend `f185138fc1cfc6c71cf94fe4e7103652e6719b5b`, canonical `crm/quote-drafts.openapi.yaml`, eight new history/lifecycle/directory operations; sync/generate/check passed. [Evidence](../../evidence/p3-audit-handoff-2026-10-28.md). Connected FE-005 implementation remains pending.

Споживач і backend посилаються на один реально перевірений контракт; відсутня операція є blocker.

Невирішений prerequisite блокує лише залежний slice; не підміняти його mock API як реалізованою можливістю. [План](../implementation-plan.md).

## Виконання

[Фактичні докази](../../evidence/clients-frontend-2026-10-26.md). Для FE-EN-001 архівне query mapping належить майбутньому FE-005; зараз підключено лише clients ID. FE-EN-002 повторюється для майбутніх API slices; поточні сім клієнтських operationIds згенеровані й перевірені.
