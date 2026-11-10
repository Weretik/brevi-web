# site-agreement-ui

Blocks and text of the «Договір» page in the «Строчка» design. Server Components only. See the [feature card](../../../../docs/features/site/agreement.md).

- `data/agreement-uk.ts`, `data/agreement-ru.ts` — the public offer clause by clause; a legal text, changed only on the client's word.
- `i18n/agreement-dictionary.ts` — labels, `getAgreementText`, section anchors.
- `sections/` — `AgreementContents` (table of contents), `AgreementSection` (clauses), `AgreementRequisites` (seller details from `COMPANY`).

Tests: `npx nx test site-agreement-ui`.
