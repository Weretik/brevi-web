# FE-EN-002 — Контрактний handoff кожного API slice

**Стан:** P5 TS-009/010 contract handoff verified; manual acceptance of connected FE-008 remains pending. Current backend SHA `e5f563456efd1b29a67a36805c2b3775ce2f9d06`; sync/generate/check passed. [P5 handoff evidence](../../evidence/fe-en-002-p5-2026-10-29.md). **Enables:** Усі API-сценарії відповідного slice. **Depends on:** Відповідна backend TS-задача та FE-EN-001.

## Шляхи та відповідальність

Заплановані області: `tools/contracts/; libs/admin/shared/contracts/; feature contracts/api-contract.md; чинні provenance/snapshot файли`. У скорочених шляхах `feature/`, `ui/`, `model/`, `data-access/` базою є `libs/admin/clients/`. Один компонент/hook/mapper/type — одна основна відповідальність і окремий файл; grouping за сценарієм, public exports через index.ts.

## Робота

Повторювати для кожного нового backend slice: отримати чистий immutable backend SHA, перевірити всі потрібні operationIds/errors, виконати contracts:sync/generate/check, записати справжню provenance. Не правити generated/snapshot вручну і не позначати майбутні операції як існуючі.

## Test level та Evidence

Actual SHA/date/source/sync command, перевірки snapshot/generation; schema-specific runtime mapper tests плануються у відповідному FE slice.

Перевірити існування project targets перед запуском. Для нової поведінки записати focused Red → Green → Refactor → Regression (test name/команда/результат); для discovery/документації — source/link/diff evidence. Для P5 evidence записано у датованому [handoff](../../evidence/fe-en-002-p5-2026-10-29.md) із SHA контракту, зміненими файлами, перевірками та обмеженнями.

## Checkpoint

P3 handoff verified 2026-10-28: backend `f185138fc1cfc6c71cf94fe4e7103652e6719b5b`, canonical `crm/quote-drafts.openapi.yaml`, eight new history/lifecycle/directory operations; sync/generate/check passed. [Evidence](../../evidence/p3-audit-handoff-2026-10-28.md). Connected FE-005 is implemented; its dated evidence records the completed consumer.

P4 FE-006 handoff verified 2026-10-28: clean backend at `31424453f4bef63363167e3dc11e0bfa2857e64f`, canonical `crm/custom-sewing.openapi.yaml` and existing quote custom-version schemas. Sync/generate/check passed; seven custom operation rows are recorded separately in the [consumer contract](../../contracts/api-contract.md#p4-fe-006-handoff--2026-10-28). FE-006 implementation is automatically verified; see its dated task evidence. TS-007 file operations and FE-007 UI are separate slices.

Споживач і backend посилаються на один реально перевірений контракт; відсутня операція є blocker.

Невирішений prerequisite блокує лише залежний slice; не підміняти його mock API як реалізованою можливістю. [План](../implementation-plan.md).

## Виконання

P4 FE-007 handoff complete: clean backend `fdb8095d4dfd52a9680b5a2768c706aea1aa8c4b`; file/template/suggestion operation rows and client decisions in the consumer contract. Sync/generate/check passed; [FE-007 evidence](../../evidence/fe-007-2026-10-28.md). Earlier checkpoints above are historical.

P5 TS-009/010 handoff complete: clean backend `e5f563456efd1b29a67a36805c2b3775ce2f9d06`; seven settings, ready and PDF operations are present in the canonical snapshot and generated types. `contracts:sync`, `contracts:generate`, `contracts:check`, and `docs:check` passed. [P5 handoff evidence](../../evidence/fe-en-002-p5-2026-10-29.md). FE-008 runtime consumer verification is recorded separately in its task evidence; manual acceptance remains pending.

[Фактичні докази](../../evidence/clients-frontend-2026-10-26.md). Для FE-EN-001 архівне query mapping належить майбутньому FE-005; зараз підключено лише clients ID. FE-EN-002 повторюється для майбутніх API slices; поточні сім клієнтських operationIds згенеровані й перевірені.

## TS-016 handoff — 2026-10-30

Clean backend SHA `e16b73d38d4c3ba149cf6253dcf3f2a70dc14f9d` synchronized; generated types and required nine-operation check pass. [Evidence](../../evidence/fe-en-002-ts016-2026-10-30.md). This closes the TS-016 consumer contract prerequisite, separately from FE-011 completion.

## P6 handoff — 2026-10-30

Clean backend `3ad90271721bc58b61fa1efa11ae6c2cd87e9866` synchronized/generated/checked; seven email-active/delivery/production operations are consumed by FE-009. [Actual verification](../../evidence/fe-009-delivery-production-2026-10-30.md). Backend commit explicitly authorized without push; frontend is uncommitted.
