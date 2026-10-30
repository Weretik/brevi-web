# FE-EN-003 public documents — 2026-10-30

## Implemented scope

SC-PUB01/02: standalone Ukrainian description/privacy/terms in apps/admin-react/public/brevi-erp, shared legal.css, StartPage anchor. Canonical origin supplied by owner: https://office.brevi.com.ua. Sender confirmed: pp.brevi@gmail.com. Contact uses the same owner-specified mailbox. No invented company identity or retention duration. No new dependencies, API or auth coupling. Existing unrelated frontend changes preserved.

Policy describes account identity, OAuth credentials, outgoing recipient/subject/body/PDF, server processing, permitted purposes, Google/infrastructure/recipient sharing, role access, retention/deletion/backup limitations, revocation, human access and Google Limited Use. Terms cover authorized use, document review, Gmail acceptance versus actual delivery, manual unknown review and support.

## Verification

- Red: node --test tools/legal/erp-public-pages.test.mjs — 4 expected failures before implementation: missing public URLs returned the SPA fallback, not complete documents.
- Green and regression: same command — 4 passed after implementation and formatting. Actual anonymous HTTP through Vite, no browser; each page is complete without scripts, local page/CSS links resolve, policy disclosures present. This is local static delivery evidence, not deployed-origin evidence.
- Refactor/boundaries: three independent content files and one shared style file; regular anchor at existing StartPage. Public assets never import the app, session or private client data. Static prerequisite/prose uses the documented EN exception to Red-first; HTTP behavior was tested Red/Green.
- Scoped ESLint passed after fixing one import-group separator in the HTTP test. Formatting passed. npm run docs:check passed for 522 Markdown files; git diff --check passed in frontend and backend (line-ending notices only).

## Mandatory open gates / SC-PUB03

1. Full operator legal name and actual production storage/hosting/retention details still need owner confirmation before publication; no fabricated entity is shown.
2. The current backend/helper still requests gmail.readonly and verifies a Gmail profile; automatic reconciliation still exists. Update runtime/helper to send-only + identity verification and manual unknown review before publishing these claims and enabling Gmail. This task does not claim that code revision completed.
3. Publish description/privacy/terms on the real HTTPS origin without sign-in or proxy protection. No deployment or remote change performed. Full builds/browser/E2E were not run.
4. Verify domain control as required by Google and configure exact public URLs in OAuth Branding, In production. Google approval is not implied by page creation.
5. Consent from pp.brevi@gmail.com, protected production credentials, agreed actual test to wet13prp@gmail.com and recorded acceptance remain pending.

Backend operations runbook now puts this owner decision and mandatory plan before the superseded two-scope/Testing instructions. No commit, push, secret provisioning or mail sent.
