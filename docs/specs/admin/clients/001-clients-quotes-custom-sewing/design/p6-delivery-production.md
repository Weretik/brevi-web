# P6 — надсилання та виробничий ZIP

Scope FE-009 / SC-D03, SC-S06: два блоки на існуючому екрані збереженого КП. Backend pinned SHA `3ad90271721bc58b61fa1efa11ae6c2cd87e9866`; реальний OAuth/test-send acceptance залишається EN-004 і не підміняється frontend mock.

Надсилання: користувач бачить номер/версію КП, готовий PDF, активну версію email-шаблону, вводить адресу й ім'я менеджера та явно підтверджує дію. Нові запити заблоковані для незбережених змін, архіву, неготового PDF/шаблону та чужого КП. Історія має сторінки й truthful queued/sending/reconciling/unknown/succeeded/failed; тільки succeeded означає підтвердження провайдера. Перевірка історії — read-only, жодного автоматичного повтору send.

Виробництво: explicit selection лише включених/видимих збережених custom variants; явний export із поточної виданої версії, показ pinned version/hash/size і приватне ZIP download. Немає Workshop transport/order і позначення sent. Зміна КП скидає локальні артефакти й ігнорує застарілі відповіді. Втрата доступу очищає приватний стан/cache.

Обидві write-дії утримують captured intent/requestId для мережевого повтору; double-click і зміна inputs під час невідомого результату заблоковані. API DTO/generated types лишаються в data-access; model містить presentation types, feature — orchestration/hooks, ui — MUI форми/списки. Скачування перевіряє MIME/ліміт/signature і не бере filename/path від сервера. OAuth/password поля в браузер не додаються.

Planned: `model/src/models/documents/*-view.ts`; `data-access/src/{api,mappers}/documents/`; `feature/src/{hooks,components}/documents/{delivery,production}/`; `ui/src/components/documents/{delivery,production}/`. Фокусовані mapper/HTTP/interaction тести та pinned contract checks; браузер/E2E не запускається без окремого дозволу.

## P6 registry UI and new-selection continuation — 2026-11-01

Authorized scope: FE-009 consumes the existing TS-017 email registry; FE-011 closes the deferred creation of new selections. Existing contract provenance in SOURCE.json remains authoritative; no backend schema/API change or email dispatch is needed.

SC-D03 registry prerequisite: Admin can page immutable email versions, read subject/plain-text body, create a new version and separately confirm activation using the current settings revision. Manager can read but cannot create/activate. Creation never autoactivates or sends. Valid inputs use the backend limits (name120, subject200 without CR/LF, body3000) and the supported recipientName/managerName/quoteNumber placeholders. Conflict preserves the form and requires refreshed activation revision; unknown writes preserve the captured payload/requestId and lock inputs; denied reads clear private state. Empty/loading/error/retry states are explicit. Route /crm/email-templates is reached from the existing Quotes page, keeping the current navigation structure.

SC-I01–02 continuation: the seasonal editor lists actual immutable email versions from the registry with paging and explicit selection. New selections cannot save without a real chosen version. Empty/unavailable/denied registry states explain the blocker and allow retry. A loaded historical reference remains pinned until explicit user selection, even if it is not on the current page; no active-template fallback replaces it. Any explicit change invalidates selection approval. Existing owned-template revision/replay/check/apply semantics remain unchanged; stored selection content never becomes an automatic send.

Responsibility packages: P6-A owns typed model, runtime mapping, API exports and registry query/mutations/tests. P6-B owns separate registry page, orchestration hook and UI components/tests. P6-C owns introduction email-version options and existing editor integration/tests. Coordinator owns routes/navigation, shared SDD/evidence/feature map and final integration verification. No generated file is edited manually. No commit/push, production build, browser check or actual Gmail send is part of this implementation request.

Permission composition: apps/admin-react/router/EmailTemplateAccess reads the core session and wraps only the email registry route with the feature-owned EmailTemplateSessionProvider. Without a provider or while roles refresh, writes fail closed. The clients feature imports no core auth module; its lazy page remains lazy. Mutation access loss clears local state; a sticky denied mutation requires reload rather than replay.

## Registry audit correction — 2026-11-01

Read-role revocation or denied list/settings/detail latches access loss and clears private state; protected queries stay skipped until explicit recovery. Resetting private cache must not become an automatic resubscription loop. Pure form/default/error types and validation live in model/forms and model/validators; UI forms/details/dialogs own presentation, and feature composes them. [Verified findings and source map](../code-audit/p6-registry-functional-audit-2026-11-01.md).

## Manual delivery result — 2026-11-01

FE-009 / SC-D03 consumes resolveCrmQuoteDelivery from the backend revision after verified immutable handoff. The existing delivery history offers explicit review only for server canResolveManually. The dialog shows recipient and pinned version/attempt, asks for sent/not_sent and a required evidence note, and requires confirmation. It explains that absence in Sent is not sufficient proof of non-send. No mailbox read or automatic resend is introduced. Active/terminal attempts cannot be overwritten.

Capture requestId/payload/expectedAttempt and lock the parent editor while pending/unknown; retry only the captured request. A409 preserves evidence input and requires history refresh. Current authorization/access loss clears private state. History labels manual confirmation separately from provider acceptance and shows server resolver/time/note. Old server rows without new optional fields remain valid and do not expose manual controls. Actual Gmail send remains EN-004 and is blocked until the owner provides OAuth client configuration and consent.

## Manual implementation checkpoint

The manual slice is implemented and automatically verified against backend 431d799eb468f212f10bde3e058be3a3d94974ab. [Evidence](../evidence/p6-manual-outcome-2026-11-01.md). A failed detail refresh is a read error with explicit retry and never creates an uncertain write. Live OAuth/send is deferred at the owner's request.

## Manual audit checkpoint

The shared document action remains the mutation owner. Its captured retry stays available through its own parent uncertain lock. Protected read denial parks queries, clears local review state, releases the parent lock and invalidates delayed callbacks. Explicit detail refresh and access latching have separate hooks; controlled form fields and runtime response validation have their existing role folders. [Verified scoped findings](../code-audit/p6-manual-functional-audit-2026-11-01.md).
