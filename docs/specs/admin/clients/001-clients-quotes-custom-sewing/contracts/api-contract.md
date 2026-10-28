# API-контракт споживача

**Клієнтський та P2 draft-quote slices реалізовано; P3 contract handoff виконано.** Current snapshot backend SHA `f185138fc1cfc6c71cf94fe4e7103652e6719b5b` містить сім customer/contact/merge та тринадцять quote/directory operations. Джерело істини — `Weretik/BreviERP`, aggregate `docs/sdd/contracts/openapi.yaml`; feature sources — `crm/clients-quotes.openapi.yaml` і `crm/quote-drafts.openapi.yaml`. Connected FE-005 UI залишається in progress; custom/document operations planned.

Історична baseline ревізія backend `0529daf910b837eb808a662695706dda4beaf833` містить Catalog/Reference, але не CRM. Для кожного впровадженого slice FE-EN-002 фіксує новий **фактичний повний SHA чистого backend commit**, дату/source path/sync command у наявному manifest. Не використовувати старий SHA як доказ існування нової операції. Перевірені schemas генеруються tooling, DTO вручну не дублюються.

## Реєстр операцій і залежностей

Backend implemented rows include seven customer operations, five draft-quote operations and eight P3 history/lifecycle/directory operations pinned below. P3 generated operations are available; connected feature consumers are not yet implemented. Для custom/document рядків schema та новий SHA очікують FE-EN-002 після відповідної backend-задачі. Кожний рядок має окремий operationId; URL сам по собі не є контрактом. Остаточний wire schema/errors — у погодженому backend OpenAPI, не у цьому Markdown.

| Метод | Шлях                                                       | operationId                      | Backend prerequisite |
| ----- | ---------------------------------------------------------- | -------------------------------- | -------------------- |
| GET   | `/api/crm/customers`                                       | `getCrmCustomers`                | TS-002 + FE-EN-002   |
| POST  | `/api/crm/customers`                                       | `createCrmCustomer`              | TS-002 + FE-EN-002   |
| GET   | `/api/crm/customers/{customerId}`                          | `getCrmCustomer`                 | TS-002 + FE-EN-002   |
| PUT   | `/api/crm/customers/{customerId}`                          | `reviseCrmCustomer`              | TS-002 + FE-EN-002   |
| POST  | `/api/crm/customers/{customerId}/contacts`                 | `createCrmCustomerContact`       | TS-002 + FE-EN-002   |
| PUT   | `/api/crm/customers/{customerId}/contacts/{contactId}`     | `reviseCrmCustomerContact`       | TS-002 + FE-EN-002   |
| POST  | `/api/crm/customers/{customerId}/merge`                    | `mergeCrmCustomers`              | TS-002 + FE-EN-002   |
| GET   | `/api/crm/quotes`                                          | `getCrmQuotes`                   | TS-004 + FE-EN-002   |
| POST  | `/api/crm/quotes`                                          | `createCrmQuote`                 | TS-004 + FE-EN-002   |
| GET   | `/api/crm/quotes/{quoteId}`                                | `getCrmQuote`                    | TS-004 + FE-EN-002   |
| POST  | `/api/crm/quotes/price-previews`                           | `previewCrmQuotePrices`          | TS-003 + FE-EN-002   |
| POST  | `/api/crm/quotes/{quoteId}/versions`                       | `saveCrmQuoteVersion`            | TS-004 + FE-EN-002   |
| GET   | `/api/crm/quotes/{quoteId}/versions`                       | `getCrmQuoteVersions`            | TS-005 + FE-EN-002   |
| GET   | `/api/crm/quotes/{quoteId}/events`                         | `getCrmQuoteEvents`              | TS-005 + FE-EN-002   |
| GET   | `/api/crm/quote-assignees`                                 | `getCrmQuoteAssignees`           | TS-005 + FE-EN-002   |
| GET   | `/api/crm/quotes/{quoteId}/versions/{versionId}`           | `getCrmQuoteVersion`             | TS-005 + FE-EN-002   |
| POST  | `/api/crm/quotes/{quoteId}/reprice`                        | `repriceCrmQuote`                | TS-005 + FE-EN-002   |
| POST  | `/api/crm/quotes/{quoteId}/copy`                           | `copyCrmQuote`                   | TS-005 + FE-EN-002   |
| POST  | `/api/crm/quotes/{quoteId}/transfer`                       | `transferCrmQuote`               | TS-005 + FE-EN-002   |
| PUT   | `/api/crm/quotes/{quoteId}/archive`                        | `setCrmQuoteArchived`            | TS-005 + FE-EN-002   |
| POST  | `/api/crm/quotes/{quoteId}/ready`                          | `prepareCrmQuote`                | TS-010 + FE-EN-002   |
| GET   | `/api/crm/custom-sewing`                                   | `getCrmCustomSewingDrafts`       | TS-006 + FE-EN-002   |
| POST  | `/api/crm/custom-sewing`                                   | `createCrmCustomSewingDraft`     | TS-006 + FE-EN-002   |
| GET   | `/api/crm/custom-sewing/{draftId}`                         | `getCrmCustomSewingDraft`        | TS-006 + FE-EN-002   |
| PUT   | `/api/crm/custom-sewing/{draftId}`                         | `saveCrmCustomSewingDraft`       | TS-006 + FE-EN-002   |
| POST  | `/api/crm/custom-sewing/{draftId}/calculations`            | `calculateCrmCustomSewing`       | TS-006 + FE-EN-002   |
| POST  | `/api/crm/custom-sewing/{draftId}/versions`                | `saveCrmCustomSewingVersion`     | TS-006 + FE-EN-002   |
| GET   | `/api/crm/custom-sewing/suggestions`                       | `getCrmSewingSuggestions`        | TS-008 + FE-EN-002   |
| GET   | `/api/crm/quote-templates`                                 | `getCrmQuoteTemplates`           | TS-008 + FE-EN-002   |
| POST  | `/api/crm/quote-templates`                                 | `createCrmQuoteTemplate`         | TS-008 + FE-EN-002   |
| PUT   | `/api/crm/quote-templates/{templateId}`                    | `reviseCrmQuoteTemplate`         | TS-008 + FE-EN-002   |
| POST  | `/api/crm/quote-templates/{templateId}/apply`              | `applyCrmQuoteTemplate`          | TS-008 + FE-EN-002   |
| POST  | `/api/crm/files`                                           | `uploadCrmPrivateFile`           | TS-007 + FE-EN-002   |
| GET   | `/api/crm/files/{fileId}/content`                          | `getCrmPrivateFileContent`       | TS-007 + FE-EN-002   |
| GET   | `/api/crm/issuer-settings`                                 | `getCrmIssuerSettings`           | TS-009 + FE-EN-002   |
| POST  | `/api/crm/issuer-settings/versions`                        | `createCrmIssuerSettingsVersion` | TS-009 + FE-EN-002   |
| PUT   | `/api/crm/issuer-settings/active`                          | `activateCrmIssuerSettings`      | TS-009 + FE-EN-002   |
| POST  | `/api/crm/quotes/{quoteId}/documents`                      | `renderCrmQuoteDocument`         | TS-010 + FE-EN-002   |
| GET   | `/api/crm/quotes/{quoteId}/documents/{artifactId}`         | `getCrmQuoteDocument`            | TS-010 + FE-EN-002   |
| GET   | `/api/crm/quotes/{quoteId}/documents/{artifactId}/content` | `downloadCrmQuoteDocument`       | TS-010 + FE-EN-002   |
| POST  | `/api/crm/quotes/{quoteId}/deliveries`                     | `enqueueCrmQuoteDelivery`        | TS-011 + FE-EN-002   |
| GET   | `/api/crm/quotes/{quoteId}/deliveries`                     | `getCrmQuoteDeliveries`          | TS-011 + FE-EN-002   |
| POST  | `/api/crm/quotes/{quoteId}/production-packages`            | `exportCrmProductionPackage`     | TS-012 + FE-EN-002   |

## Розширення шаблонів першого знайомства

Додатково заплановано `PUT /api/crm/quote-templates/{templateId}/archive`, operationId `setCrmQuoteTemplateArchived` (TS-008/016, FE-EN-002). Manager має write/archive власних selection/configuration templates, Admin — усіх. `applyCrmQuoteTemplate` повертає typed target: quote draft для firstContact або custom draft для customConfiguration. TS-016 додає schema discriminator/layout/4–8 slots/email template refs. Не підключати це до старого snapshot без нового реального SHA. Окремий quote/mail API для introduction не створюється.

## Межа даних та семантика

Для чернеток КП користувач 2026-10-26 підтвердив три поточні ціни Catalog/PPE у UAH без додаткового нарахування ПДВ; backend зберігає ідентичність та версію джерела. Формулювання податку в готовому PDF належить EN-005. FE-EN-002 для P2 виконано з реальним SHA нижче.

data-access використовує operation-specific generated types через `@admin/shared/contracts`, runtime validation і mapper у чисті client models. Зіставлення kind/semantic tiers/blocked/null/visibility явне. Не брати ціну з deprecated Product.Price, не розраховувати три tiers у браузері. Потрібні Catalog Article/published price APIs вже описані canonical backend contracts; фактичні operationIds/schemas для селекторів звіряє FE-EN-002 перед підключенням.

Пагінація: `value` + `pagedInfo`, не губити total/pageSize/navigation metadata; запит має обмежені page/search/date/status/owner/archive параметри. Сортування/фільтри/count серверні зі спільною access scope. Список не тягне всі snapshots/версії.

Write intent включає `requestId`, для змін існуючого кореня `expectedRevision`; ціни/актори/номери server-owned, крім явної typed ручної суми СІЗ із причиною. Basis token зв'язаний із входами/актором/expiry; зміна входів анулює preview. Не повторювати write з новим ключем через timeout: це може створити нову дію. Мапити 409 revision/idempotency/input-change у compare/reload, 422 blockers у конкретні поля, 401/403/404 за чинним auth flow. 413/415 — upload errors, delivery unknown — reconciliation, не success.

Cache tags розділяють customer detail/list, quote root/version, custom draft/version, document та deliveries. Client master edit не переписує quoted recipient; reprice/save інвалідує detail/history/list, transfer додатково чистить недоступну область. Отримання PDF/історії не викликає calculate. Retry/cancel читання використовує чинний api-client; mutations тільки за requestId-політикою. Приватні байти не зберігати в persistent browser cache.

## Контрактний checkpoint кожного slice

Backend реалізує й перевіряє schema/operation → надає чистий immutable SHA → frontend виконує наявні sync/generate/check → фіксує provenance → додає mapper/error/interaction тести → підключає route. Невиконаний prerequisite блокує відповідну інтеграцію, а не виправдовує local mock як готовий backend. Деталі [workflow](../../../../../architecture/api/contract-workflow.md).

## Історичний client handoff

Repository: `https://github.com/Weretik/BreviERP.git`.
Backend commit: `bb0a9a710892a7dd25acad99def291c53ccf6da9` (локальний, без push).
Canonical source: `docs/sdd/contracts/crm/clients-quotes.openapi.yaml`, aggregate `docs/sdd/contracts/openapi.yaml`.
Consumer: [versioned snapshot](../../../../../contracts/openapi/backend/crm/clients-quotes.openapi.yaml), `docs/contracts/openapi/SOURCE.json`, generated `@admin/shared/contracts`.

Синхронізацію виконано з чистого тимчасового локального checkout цього commit, оскільки в основному backend збережено сторонню давню правку індексу. Команди: `npm run contracts:sync -- <clean-checkout> <full-SHA>`, `npm run contracts:generate`, `npm run contracts:check`. Snapshot/generated provenance збігаються; generated файли не редагувалися вручну.

Поточні operationIds: getCrmCustomers, createCrmCustomer, getCrmCustomer, reviseCrmCustomer, createCrmCustomerContact, reviseCrmCustomerContact, mergeCrmCustomers. Create returns 201; інші writes повертають CustomerDetail/200 із новою root revision. Invalid input — 400 за чинним Result mapping, conflicts — 409. CustomerDetail містить canEdit/canMerge, contacts/channels та external identities; page зберігає value + pagedInfo. Старий SHA 0529... вище є baseline, не provenance нової CRM інтеграції.

Кеш: list tag + PublicId tags; create invalidates list, revise/contact invalidates root+list, merge invalidates survivor+victim+list. Error write не інвалідує дані. `currentData` ізолює поточні query args. GET/PDF/quote APIs наступних фаз не викликаються цим slice.

## P2 quote handoff — 2026-10-27

This is the historical P2 checkpoint; the current manifest and generated types use the subsequent P3 SHA below.

## P3 contract handoff — 2026-10-28

Canonical source for every new operation: backend `docs/sdd/contracts/crm/quote-drafts.openapi.yaml`, aggregate `docs/sdd/contracts/openapi.yaml`. Repository: `https://github.com/Weretik/BreviERP.git`. Current [provenance manifest](../../../../../contracts/openapi/SOURCE.json) pins the authorized local commit without push.

| operationId            | Backend immutable SHA                      |
| ---------------------- | ------------------------------------------ |
| `getCrmQuoteVersions`  | `f185138fc1cfc6c71cf94fe4e7103652e6719b5b` |
| `getCrmQuoteVersion`   | `f185138fc1cfc6c71cf94fe4e7103652e6719b5b` |
| `getCrmQuoteEvents`    | `f185138fc1cfc6c71cf94fe4e7103652e6719b5b` |
| `getCrmQuoteAssignees` | `f185138fc1cfc6c71cf94fe4e7103652e6719b5b` |
| `repriceCrmQuote`      | `f185138fc1cfc6c71cf94fe4e7103652e6719b5b` |
| `copyCrmQuote`         | `f185138fc1cfc6c71cf94fe4e7103652e6719b5b` |
| `transferCrmQuote`     | `f185138fc1cfc6c71cf94fe4e7103652e6719b5b` |
| `setCrmQuoteArchived`  | `f185138fc1cfc6c71cf94fe4e7103652e6719b5b` |

Sync/generate/check passed from a clean temporary detached checkout. Current quote reading accepts created/edited/recalculated/copied snapshots and preserves saved monetary values; other action values fail runtime validation. Generated DTOs stay in data-access. New P3 operation-specific mappers, hooks, history navigation, comparison confirmation, transfer cache purge and archive UI remain FE-005 work. [Audit and handoff evidence](../evidence/p3-audit-handoff-2026-10-28.md).

## Historical P2 details

Repository: `https://github.com/Weretik/BreviERP.git`; canonical source: `docs/sdd/contracts/crm/quote-drafts.openapi.yaml`. [Snapshot](../../../../../contracts/openapi/backend/crm/quote-drafts.openapi.yaml) and generated types were synchronized from a clean temporary checkout of the locally authorized commit, then the checkout was removed. The original backend checkout retains the unrelated Product pricing index edit. No push ran.

| operationId           | Path                                      | Full backend commit                        |
| --------------------- | ----------------------------------------- | ------------------------------------------ |
| getCrmQuotes          | GET `/api/crm/quotes`                     | `1c1f51dc7837f3d5e3a0da7326cb17b48d23e4d9` |
| getCrmQuote           | GET `/api/crm/quotes/{quoteId}`           | `1c1f51dc7837f3d5e3a0da7326cb17b48d23e4d9` |
| createCrmQuote        | POST `/api/crm/quotes`                    | `1c1f51dc7837f3d5e3a0da7326cb17b48d23e4d9` |
| saveCrmQuoteVersion   | POST `/api/crm/quotes/{quoteId}/versions` | `1c1f51dc7837f3d5e3a0da7326cb17b48d23e4d9` |
| previewCrmQuotePrices | POST `/api/crm/quotes/price-previews`     | `1c1f51dc7837f3d5e3a0da7326cb17b48d23e4d9` |

Catalog selection reuses `getAdminProducts` and `listSewingArticles` from the same aggregate snapshot. Generated operation-specific request types are used only in data-access. Runtime mappers check UUID/date/kind/tier/currency, source selection coherence, three distinct tiers and tier/basis agreement before producing application models.

P2 errors use 400 for invalid input, 409 for revision/basis/replay conflicts and normal 401/403/404 access handling. A conflict preserves the form; source refresh and dirty reload are explicit. Unknown write results (network, timeout, server/unknown error) freeze editing and retry the original captured payload/requestId until a definite result. Preview retry retains its ID after failure, then resets it after success so an explicit fresh preview does not replay an expired token. Late previews do not overwrite a changed selection.

Cache: `Quote/LIST` plus exact quote IDs. Create invalidates list; version save invalidates that quote and list; preview does not invalidate quotes. No mutation retries automatically, no optimistic price/version updates. Saved bases serialize without a new token for text-only saves; changed selections require a fresh preview. Null prices and blockers remain null/visible in drafts. Unchanged saved selections have no reprice button in P2; P3 owns explicit same-selection reprice/history/copy/transfer/archive. [Evidence](../evidence/p2-frontend-2026-10-27.md).
