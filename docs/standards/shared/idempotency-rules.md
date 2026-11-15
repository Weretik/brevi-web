# Idempotency rules: repeated submits

**Applies to:** every mutation the client sends: admin forms and actions, public site forms, mobile and offline queues.
**Backend side:** [BreviERP idempotency rules](https://github.com/Weretik/BreviERP/blob/master/docs/sdd/standards/idempotency-rules.md) decides which operations take a key and what a repeat answers. This file says what the client does.

A request can reach the server twice without anyone meaning to: a double press, a retry after a timeout, a lost answer on a weak network, an offline queue sending again after a restart. The client cannot know whether the first copy was saved, so it must make the repeat safe instead of guessing. Kedr and Brevi use this text verbatim; only the specifics and known deviations below differ.

## 1. Attempt key

- **When.** Every mutation whose backend operation takes an idempotency key (header `Idempotency-Key` or body field `requestId`; the contract says which) sends one.
- **One key per attempt.** Make the key (`crypto.randomUUID()`) when the form opens or on the first submit of a payload, and keep it in the feature's state next to the payload it belongs to.
- **Reuse** the same key for every repeat of that attempt: a second press, a retry after a network error, a timeout, a 5xx, or an "unknown outcome" answer.
- **Renew** it after a success (the next order is a new attempt), after a 409 `idempotency_conflict` or another business conflict, and when the person changes the payload (compare the serialized payload; a changed payload is a new attempt).
- **Never** make the key inside a retry loop, in a server action or route handler on the server (every call would make a new one), or from the payload itself (two identical real orders must stay two orders).
- **Server actions and proxies** (Next.js) receive the key from the browser, check that it is a UUID, and pass it through to the API unchanged.
- **Offline and mobile queues** store the key with the queue entry when it is queued; every send of that entry uses it.

## 2. Pending lock

- The submit control is disabled while the request runs, and the store or hook keeps one in-flight promise, so a second press joins the first instead of starting a new request. This is required for **every** mutation, keyed or not.
- Do not let data change while an attempt is pending (or start a new attempt when it does).

## 3. Retries

- Automatic retry of a mutation is allowed only when the operation is idempotent (a key, a `PUT` of a target value, a delete). Turn off library retries for any other mutation (`retry: 0` / no `retryCondition`).
- After an unknown outcome, show a calm message ("we could not confirm; try again") and let the person retry with the same key; never tell them it failed when it may have succeeded.

## 4. Answers

- A repeat answers like the first request (the same id or the saved resource): treat it as success.
- 409 `idempotency_conflict` (or the project's conflict problem for the same key with other data): show the Ukrainian message, renew the key, and let the person reload or resend.
- 409 "stale" for a versioned edit: reload the record; do not resend blindly.

## 5. Tests

- Two quick submits make one request (pending lock).
- A retry after an unknown outcome sends the same key; a changed payload, a success, or a conflict makes a new key.
- The transport sends the key in the header or field the contract names, and only when it has one.
- An offline queue entry keeps its key across restarts.

## 6. Check (audits)

- Every mutation whose contract takes a key sends it, made once per attempt by the rules above.
- Every submit control has a pending lock; no library retries on non-idempotent mutations.
- No key is made on the server side of a form, in a retry loop, or from the payload.

## Brevi Web specifics

BreviERP takes the key as the body field `requestId` (stock commands: `operationId`). The id lives in a `useRef` of the feature hook (or a hidden form field on the site), is made when the form opens, and is renewed after a success.

| Client                  | Mutations that send a key                                                                              | Where                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ----------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Admin «Бухгалтерія»     | New finance operation, transfer                                                                        | [use-finance-transaction-editor.ts](../../../libs/admin/accounting/feature/src/hooks/transactions/use-finance-transaction-editor.ts), [use-finance-transfer-editor.ts](../../../libs/admin/accounting/feature/src/hooks/transfers/use-finance-transfer-editor.ts)                                                                                                                                                                                                                                             |
| Admin «Швейний цех»     | Payroll payment and adjustment, work log entry, new and copied production order                        | [use-payroll-entry-editors.ts](../../../libs/admin/production/feature/src/hooks/payroll/use-payroll-entry-editors.ts), [use-production-work-editor.ts](../../../libs/admin/production/feature/src/hooks/work/use-production-work-editor.ts), [use-production-order-create.ts](../../../libs/admin/production/feature/src/hooks/order-editor/use-production-order-create.ts), [use-production-order-actions.ts](../../../libs/admin/production/feature/src/hooks/order-editor/use-production-order-actions.ts) |
| Admin КП                | Create, introduction letter, copy, «Надіслати»                                                         | [use-quote-editor.ts](../../../libs/admin/quotes/feature/src/hooks/editor/use-quote-editor.ts), [use-quote-introduction-editor.ts](../../../libs/admin/quotes/feature/src/hooks/introduction/use-quote-introduction-editor.ts), [use-quote-lifecycle.ts](../../../libs/admin/quotes/feature/src/hooks/lifecycle/use-quote-lifecycle.ts), [use-quote-send.ts](../../../libs/admin/quotes/feature/src/hooks/sending/use-quote-send.ts)                                                                          |
| Admin «Ліди», «Клієнти» | Lead call; customer create, contact, revise, merge                                                     | [use-my-day.ts](../../../libs/admin/leads/feature/src/hooks/my-day/use-my-day.ts), [use-customer-create.ts](../../../libs/admin/clients/feature/src/hooks/customers/use-customer-create.ts), [use-customer-merge.ts](../../../libs/admin/clients/feature/src/hooks/merge/use-customer-merge.ts)                                                                                                                                                                                                               |
| Admin «Склад»           | Every stock operation (`operationId`)                                                                  | [stock-operation-forms.ts](../../../libs/admin/warehouse/model/src/forms/stock-operations/stock-operation-forms.ts), [item-issue-form.ts](../../../libs/admin/warehouse/model/src/forms/item-issue/item-issue-form.ts)                                                                                                                                                                                                                                                                                        |
| Site «Строчка»          | Site request form: a hidden `requestId` made after hydration, checked as a UUID by the Server Function | [request-form.tsx](../../../libs/site/request/ui/src/lib/sections/request-form.tsx), [submit-request.ts](../../../libs/site/request/feature/src/lib/submit-request.ts)                                                                                                                                                                                                                                                                                                                                        |

Every other Admin mutation relies on the pending lock; RTK Query does not retry mutations.

## Known deviations

| Rule                          | Where                                                        | Risk                                                                                                                                                                                                                  | Plan                                                                                                                                                                                          |
| ----------------------------- | ------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1, renew on a changed payload | Admin hooks above keep the id after an error until a success | After an unknown outcome where the first request was in fact saved, a resend with edited values returns the first row and the edit is lost (the answer shows the saved values). Rare: needs a lost answer and an edit | Renew the id when the form values change after a failed attempt (a helper beside each hook, like Kedr's `keyForRequest`), or let BreviERP answer 409 when a `requestId` comes with other data |
