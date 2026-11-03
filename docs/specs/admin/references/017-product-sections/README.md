# 017 — «Типи і розділи»: product sections from the Calculator sheet

**Status:** implemented 2026-11-03. **Backend:** BreviERP REF-005 (`api/reference/product-sections`).

Stage 1 of moving «Товари» from the Calculator. Products get a section in stage 2; the Content module later builds the public site categories from sections.

## Rules

| ID   | Rule                                                                                                                                            |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| R-01 | `/references/product-sections` lists sections on the reference list pattern: name, product type (Швейна продукція / ЗІЗ), status pill, comment. |
| R-02 | Chips «Усі», «Швейна продукція», «ЗІЗ» with counts filter by type; search looks in the name and comment.                                        |
| R-03 | A drawer views, creates and edits a section: type, name (unique, checked by the backend), active switch, comment. A new section goes last.      |
| R-04 | Deletion asks for confirmation and suggests switching a section off instead.                                                                    |
| R-05 | «Загальні довідники» gets the item «Типи і розділи» right after «Товари».                                                                       |

## Verification 2026-11-03

- `npx nx test admin-references-model -- product-section`: 5 passed; `admin-references-data-access`: 2 passed; `admin-references-feature`: 2 passed; `admin-react`: 26 passed.
- Typecheck and lint for the references libraries and `admin-react`: pass, except the existing `apps/admin-react/vite.config.mts` import order errors on master.
