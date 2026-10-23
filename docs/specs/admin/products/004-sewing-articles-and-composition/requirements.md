# Rules and observable scenarios

## Rules

- **R-001:** On a Sewing Product detail page, show sale Articles with SKU, active state and calculation-readiness reason. PPE detail keeps its current layout.
- **R-002:** On create/edit, an authorized admin can add an Article, enter shared model material and operation lines, and enter Article-specific material lines. The UI labels scope clearly and does not copy shared lines into each Article form.
- **R-003:** For a selected Article, show the effective composition: its own lines plus shared lines, with material kind, quantity/unit, operation quantity/time and review state. Non-inventory `Other cost` appears as cost input, not a fabric/accessory stock item.
- **R-004:** Client validation mirrors required positive values and selected references, but the server remains authoritative. Show field-level server errors, duplicate SKU, stale-edit conflict, missing Reference and retryable load failure without losing unsaved input.
- **R-005:** Existing Product create/edit and PPE flows remain usable. Saving base Product fields never silently replaces Article/composition data. There is no price publication action in this slice.
- **R-006:** User-visible labels are Ukrainian in the existing Admin style; keyboard and screen-reader interactions follow current form conventions.

## Scenarios

- **SC-001 — See Articles:** Given a Sewing Product with two Articles, when an admin opens its detail page, then both SKUs are visible with their active/readiness state; the PPE page remains unchanged.
- **SC-002 — Edit composition:** Given Article `246`, when an admin selects it, then its fabric plus shared materials and operations appear with scope labels; selecting Article `247` changes the fabric while shared lines remain the same.
- **SC-003 — Add Article:** Given a Sewing Product, when an admin saves a new unique SKU, then it appears in the Article list. A duplicate SKU shows a conflict and preserves the entered draft.
- **SC-004 — Reject invalid input:** Given a missing required quantity, unresolved Reference, or stale update, when the admin saves, then a specific error appears and the previously saved composition remains intact.
- **SC-005 — Old Product edit:** Given a Product with Articles, when an admin changes only its description using the existing editor, then Articles and composition remain unchanged.
- **SC-006 — Review blocker:** Given an unreviewed required operation, when the admin views composition, then a readiness blocker is visible; no price is shown as approved on that basis.

## Exclusions

No new standalone Calculator app, price-formula editor, quote/PDF screen, automatic Sheet sync or production order workflow.
