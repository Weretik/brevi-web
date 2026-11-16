# API Contract Lifecycle

These rules apply to every frontend feature that calls the BreviERP API. The
source of truth is the backend code: BreviERP generates
`docs/sdd/contracts/openapi.json` from it on every build, and its CI fails when
the committed file differs from the code. This repository keeps a copy of that
file and never edits it ([ADR-0004](../adr/0004-contract-follows-backend-and-typed-client.md)).

## Where things are

| What                     | Where                                                                                        |
| ------------------------ | -------------------------------------------------------------------------------------------- |
| Snapshot of the contract | `docs/contracts/openapi/openapi.json` (copy, never edited by hand)                           |
| Its source commit        | `docs/contracts/openapi/SOURCE.md`                                                           |
| Generated types          | `libs/admin/shared/contracts/src/generated/openapi.ts` (`paths`, `components`, `operations`) |
| Typed client             | `apiClient`, `apiCall`, `apiRequest` in `@admin/shared/api-client`                           |
| Sync tools               | `tools/contracts/`                                                                           |

## Commands

| Command                                    | What it does                                                                                 |
| ------------------------------------------ | -------------------------------------------------------------------------------------------- |
| `npm run contracts:sync`                   | Downloads `openapi.json` from BreviERP `master`, writes `SOURCE.md`, regenerates the types   |
| `npm run contracts:sync -- --ref <branch>` | The same from a backend branch that is not merged yet                                        |
| `npm run contracts:sync -- --file <path>`  | The same from a local backend checkout                                                       |
| `npm run contracts:check`                  | Regenerates the types and fails if they differ from the committed ones                       |
| `npm run contracts:drift`                  | Fails when the snapshot differs from BreviERP `master` and lists the added and removed paths |

CI runs `contracts:fixtures`, `contracts:check` and `contracts:drift`. The
workflow `contract-sync.yml` runs every weekday at 07:00 Kyiv time and on
demand; when the backend contract changed, it opens or updates the pull request
`chore/sync-backend-contract` and writes whether the typecheck passed. GitHub
does not start CI for a pull request opened by a workflow: push an empty change
or re-run the checks by hand.

## Workflow for a feature

1. Change or add the endpoint in BreviERP first: `WithName` (operation id),
   `WithSummary`, `Produces<T>` for every response with a body, and
   `ProducesProblem`. Build `Host.Api` to regenerate `openapi.json` and commit it.
2. Here, run `npm run contracts:sync -- --ref <backend-branch>` and commit the
   snapshot with the frontend change. After the backend merges, sync again
   from `master` (or merge the daily sync pull request).
3. In domain `data-access`, call the API only through the typed client:

   ```ts
   getQuote: build.query<Quote, number>({
     queryFn: (id, { signal }) =>
       apiCall(
         apiClient.GET('/api/crm/quotes/{id}', { params: { path: { id } }, signal }),
         mapQuote,
         quoteApiError,
       ),
   }),
   ```

   Never raw `fetch` or Axios. Use `apiRequest` outside RTK Query (it throws
   the `ApiError`), `formDataBody` for uploads and `parseAs: 'blob'` for files.

4. The mapper at the `data-access` boundary takes the generated type and
   returns the application model; `feature`, `ui` and models do not import
   generated types. Codes the backend sends as plain strings are narrowed to
   the model union in the mapper only.
5. Test mappers and error handling; component tests stub the network with
   `stubApiFetch` from `@admin/shared/api-client/testing`.
6. Before handoff: `npm run contracts:check`, then `typecheck`, `lint` and the
   focused tests of the changed projects.

Merge order: the backend pull request merges first, then the frontend one.
