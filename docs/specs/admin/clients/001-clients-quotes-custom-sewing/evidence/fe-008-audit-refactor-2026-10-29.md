# FE-008 form slice audit — 2026-10-29

**Scope:** only the eight new FE-008 form slice files and their public exports. The backend TS-009 code and TS-010 design were not modified in this audit.

## Finding and fix

Scoped ESLint initially failed with two `import/order` errors at line 4 of `issuer-settings-validation.unit.test.ts` and `document-template-validation.unit.test.ts`. The sibling validator import now precedes the parent model import. No production behavior changed. [Finding AF-FE-P5-001](../code-audit/audit.md) is verified fixed.

## Responsibility decision

The slice already has role and capability separation: editable drafts in `model/src/models/documents`, pure validation and colocated tests in `model/src/validators/documents`, and presentation in `ui/src/forms/documents`. Each form section and validator owns one resource. The files are small and no additional module split would create a meaningful boundary. Public exports are in each library's `src/index.ts`; UI imports model through its public alias. There are no generated DTOs, HTTP calls, pricing formulas, router state, PDF bytes or active-server state in the new files.

The field set and constraints were compared with the local canonical `issuer-settings.openapi.yaml`: eight required seller fields, optional bank/MFO and allowlisted logo; one standard template layout and six required text fields. The approved VAT phrase remains an editable default, while seller values remain blank until entered. UI labels and local rules cover the available fields; the backend remains authoritative when the future API flow is connected.

## Fresh checks

- `node_modules/.bin/eslint.cmd libs/admin/clients/model/src/models/documents/*.ts libs/admin/clients/model/src/validators/documents/*.ts libs/admin/clients/ui/src/forms/documents/*.tsx`: first run 2 import-order errors, final run exit 0.
- From `libs/admin/clients/model`, root `node_modules/.bin/vitest.cmd run src/validators/documents/issuer-settings-validation.unit.test.ts src/validators/documents/document-template-validation.unit.test.ts`: 2 files, 6 tests passed.
- From the same model directory, root `node_modules/.bin/tsc.cmd --noEmit -p tsconfig.spec.json`: exit 0.
- Root Prettier check for the new model/document and UI/document paths: passed.

No browser, manual, backend database, commit or push action was performed. FE-008 remains partial until the TS-009 PostgreSQL gate, clean contract SHA, and TS-010 operations are available.
