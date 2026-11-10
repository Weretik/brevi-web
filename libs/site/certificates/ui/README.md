# site-certificates-ui

Blocks of the «Сертифікати» page in the «Строчка» design. Server Components only. See the [feature card](../../../../docs/features/site/certificates.md).

- `data/certificate-documents.ts` — the list of documents (`CERTIFICATE_DOCUMENTS`) with kind, scope, standards, and file paths.
- `i18n/certificates-dictionary.ts` — page text in `uk` and `ru`.
- `sections/` — `CertificatesDocuments` (cards with the scan, name, scope, standards), `CertificatesCopies` (certified copies on request).

Scans live in `apps/site/public/assets/certificates/` as `<kind>-<scope>.webp` and `<kind>-<scope>-thumb.webp`.

Tests: `npx nx test site-certificates-ui`.
