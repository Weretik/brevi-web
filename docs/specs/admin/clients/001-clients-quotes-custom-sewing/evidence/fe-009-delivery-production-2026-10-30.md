# FE-009 — надсилання та виробничий ZIP, 2026-10-30

## Scope і результат

Користувач доручив наступні два пункти P6: інтерфейс явного надсилання/історії та виробничий ZIP. Перед передачею контракту прямо дозволено локальний backend commit перевірених P5/P6, без push. Backend commit **`3ad90271721bc58b61fa1efa11ae6c2cd87e9866`**,186 погоджених файлів, clean tree після commit. До нього увійшли перевірені P6 і решта перевірених залежностей P5/PDF; ignored local адреси/credentials/dumps не включені. Frontend commit не виконувався; попередні frontend working changes збережені.

Реалізація на наявному `/crm/quotes/:quoteId`, через `QuoteDocumentsPanel`:

- Надсилання потребує готового PDF, активної незмінної версії email-шаблону, явного одержувача й імені менеджера. Окремий confirm показує номер/версію КП, template version та PDF hash. Enter у полях відкриває confirm і не зберігає батьківську форму КП.
- Captured intent/requestId зберігаються для явного мережевого повтору; inputs і вибраний шаблон заморожені під час невідомого результату. Подвійне підтвердження не створює другого запиту. Жодного автоматичного POST retry.
- Paged history перевіряється read-only кожні10секунд із skipPollingIfUnfocused. Queued/processing/reconciliation/unknown не відображаються як sent; тільки succeeded означає підтвердження провайдера. Стан кореня КП оновлюється із сервера через наявну дію; client не вигадує sent transition.
- Виробництво використовує лише явно вибрані включені/видимі збережені custom variants. Пакет показує pinned version/hash/size; download перевіряє MIME, розмір, ZIP signature і SHA256. Локальне ім'я файлу складається з opaque package ID, без server path/filename. Немає Workshop/order/sent side effect.
- Quote/version/owner scope keys скидають private local artifacts і відкидають late responses;403/404 очищають private cache/state. Незбережені зміни/архів блокують нові writes. Runtime DTO validation/target matching лишаються в data-access, generated DTO не входять у feature/ui.

## Контракт та структура

`contracts:sync` з clean backend SHA → `contracts:generate` → `contracts:check` пройшли. Snapshot provenance: `docs/contracts/openapi/SOURCE.json`. Сім operationIds у [consumer contract](../contracts/api-contract.md#p6-delivery-and-production-consumer) та required-operation registry. JSON-compatible YAML modules мають property commas; helper точного operationId виправлено й перевірено окремо, без prefix/comment false matches.

`model/models/documents/*-view.ts` — app presentation types; `data-access/api/documents/` — generated-request HTTP і binary; `data-access/mappers/documents/` — окремі runtime mappers; `feature/hooks/documents/` — captured actions і scope; `feature/components/documents/` — route composition; `ui/components/documents/` — чисті MUI форми/історія/checkboxes. Shared PDF saver збережений через сумісний alias до private-document saver.

## Перевірки

Red mapper:4cases,3failed/1passed на compilable throwing stubs; Green4/4. Red panel:6cases failed через відсутні доступні поля/дії в compilable empty panels. Подальші кейси додані для unknown replay, double-click, Enter і зміни active template під час captured retry. Початкові MUI/inputProps, Stack sx, mock-path і typed-fixture compile проблеми виправлені; їх не рахували як поведінковий Red.

- `npx vitest run --config libs/admin/clients/data-access/vitest.config.mts p6-documents`: **8passed** (4mapper +4actual local HTTP/ZIP/cache cases).
- `npx vitest run --config libs/admin/clients/feature/vitest.config.mts p6-panels.component use-quote-documents.unit`: **12passed** (9new interaction +3existing PDF). Після остаточного frozen-template уточнення повторено лише `p6-panels.component`: **9passed**; повтори не збільшують unique count.
- Разом **20 unique Vitest cases**. HTTP uses a local fake boundary, not real Gmail or an app backend deployment.
- `node --test tools/contracts/check-required-operations.test.mjs`: **3passed**. Новий comma case спочатку1failed/2passed, потім3green після parser correction.
- Scoped ESLint **27 changed TS/TSX files**, exit0; Prettier applied only these files plus changed contract helper/test. Після fixture import-order correction і final captured-template changes scoped lint знову0.
- Data-access `tsconfig.lib.json` і `tsconfig.spec.json`: exit0. Final feature `tsconfig.spec.json` (includes source/UI imports): exit0 після виправлення fixture та MUI sx. Це scoped boundary checks, не весь frontend workspace.
- `contracts:check`: exit0, generated artifacts match SHA provenance; required seven operations present. Local docs links/diff results appended below.

API403 immediately resets RTK Query; the originating query can consequently resolve to empty/uninitialized rather than a retained rejected cache entry. The HTTP test checks no private data and an empty cache, respecting that existing access-loss behavior. No response is interpreted as successful send without a validated delivery model.

## Межі

Реальний Google OAuth client ще не створено, controlled send/reconcile не виконано. Backend delivery stays disabled until EN-004; frontend не містить OAuth secrets і не оголошує сервіс готовим. UI приймає відсутність active email template як blocker; Admin template management/new-selection creation remains a separate slice. Повний SC-D03 live acceptance залишається відкритим. Browser/manual visual/E2E та production build не запускалися: вони не були окремо авторизовані. Theme/breakpoints/accessibility переглянуто за кодом; MUI9 slotProps/sx використані без зміни global theme/routes.

Самоперевірка scope: source IDs і request capture, public/private projection, no XSS/raw HTML, no secrets/localStorage, bounded pages/poll, cancel/late-result guards, immutable artifact checks, disabled/loading/empty/error/access states та окремі file responsibilities. Відомих відкритих correctness blockers у цих двох frontend slices немає; це не твердження про повне завершення P6 або deployment.

Final local link checks passed; git -c core.safecrlf=false diff --check exited0. Backend tree remains clean at the pinned SHA. No browser/manual/E2E, real mail, new migration, frontend commit or push was performed.

Follow-up [functional audit](../code-audit/fe-009-functional-audit-2026-10-30.md) supersedes the earlier empty/uninitialized403 query behavior: callers now retain the rejection before cache is cleared. It also records file separation and fresh31-case regression.
