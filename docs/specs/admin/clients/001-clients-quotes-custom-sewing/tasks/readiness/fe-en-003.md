# FE-EN-003 — Публічні сторінки BreviERP для Gmail OAuth

**Status:** implemented locally; verification recorded separately, 2026-10-30. Publication remains a separate mandatory release gate.
**Enables:** SC-D03 / EN-004 Gmail onboarding. **Depends on:** user-approved sender and send-only/manual reconciliation decision (2026-10-30); no API dependency for static pages.

## Rules and scenarios

- R-PUB01: BreviERP has a public description, privacy policy and terms, accessible without authentication or JavaScript, with reciprocal navigation and contact pp.brevi@gmail.com.
- R-PUB02: privacy describes identity, outgoing recipients/body/PDF, server processing, credentials, purposes, sharing, retention, deletion/revocation and Google Limited Use. Do not invent a legal entity, hosting provider, retention period or compliance certification.
- R-PUB03: publication must match actual send-only runtime; gmail.readonly and automatic reconciliation are excluded by the user decision. Current legacy implementation is a release blocker, not a claimed completed capability.
- SC-PUB01: Given an unauthenticated visitor, when opening each public URL, then the complete relevant document and links are readable without loading the ERP application. Level: static HTTP integration.
- SC-PUB02: Given a user reviewing Gmail use, when reading the policy, then sending, account identity, outgoing data, server handling, revocation and contact are disclosed. Level: content review plus focused automated structural checks.
- SC-PUB03: Given production onboarding, when preparing Google Branding, then public HTTPS URLs, operator details, domain control and matching actual scopes must be verified before sending is enabled. Level: deployment gate, not claimed locally verified.

## Design and file responsibilities

Following delivery-rules.md, public assets live in apps/admin-react/public/brevi-erp/: index.html (description), privacy.html (privacy), terms.html (terms), legal.css (shared responsive styling). Vite copies public assets without React/auth coupling. Existing StartPage adds a standard anchor. No client state, API, cookies or extra dependencies. tools/legal/erp-public-pages.test.mjs verifies anonymous HTTP assets and local navigation through Vite. Separate legal content and styling; no generator dependency at runtime.

## Work / mandatory release plan

1. Implement complete Ukrainian documents and description with version/date and navigation; link from ERP start page. Do not publish misleading send-only assertions while legacy read scope remains active.
2. Verify static HTTP responses, navigation, contact and disclosures; record evidence. Documentation/static prerequisite exception to Red-first applies to prose; anonymous HTTP behavior still uses Red/Green.
3. Confirm operator full legal name, contact handling and actual hosting/retention practices with owner. Public domain is https://office.brevi.com.ua; full legal operator identity is pending; do not fabricate them.
4. Finish send-only backend/helper revision: gmail.send + openid/email, sender pp.brevi@gmail.com; replace Gmail profile lookup with identity verification and disable automatic mailbox reconciliation. Manual unknown-result review; no automatic resend.
5. Publish all three pages on the real BreviERP HTTPS origin, outside login/proxy protection; verify direct responses and readable content. Keep links available while OAuth is enabled.
6. Confirm domain ownership as required by Google and enter exact homepage/privacy/terms URLs in OAuth Branding; use In production, not Testing. Resolve applicable verification requirements with Google.
7. Authorize pp.brevi@gmail.com after scope revision; store production credentials in protected environment; verify agreed send to wet13prp@gmail.com. Record acceptance before enabling customer sends.

## Evidence / checkpoint

SC-PUB01/02 → FE-EN-003 → tools/legal/erp-public-pages.test.mjs → evidence/fe-en-003-public-pages-2026-10-30.md.
SC-PUB03 remains pending until actual publication and operational gates above pass. No deployment, Google approval, legal review or live send is implied by local files.

Sources: [Google OAuth policies](https://developers.google.com/identity/protocols/oauth2/policies), [verification requirements](https://support.google.com/cloud/answer/13464321), [Google user data policy](https://developers.google.com/terms/api-services-user-data-policy).
