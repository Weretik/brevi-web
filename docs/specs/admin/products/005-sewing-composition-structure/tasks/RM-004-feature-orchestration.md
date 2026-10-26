# RM-004 — Feature state and independent workflows

**Covers:** AF-004/005; AR-001/002/003/004/005. **Depends on:** RM-001–003 stable exports. **Owner:** `admin-products-feature`.

## Work

Turn the large `SewingCompositionFeature` into a composition boundary. Give reference/query reads, editable draft/baseline lifecycle, create/save/reload orchestration, scope switching, navigation protection and error translation distinct role-first owners. Separate model/Article sections, stale-conflict presentation and confirmation dialogs. Extract the new legacy norm-lock query/policy from ProductEditPage and its notice presentation from the existing Product editor. Do not relocate the entire monolith into one controller hook.

## Checkpoint

No duplicated RTK server cache. Dirty drafts survive 409 and background reads; shared lines are never copied to Article writes. Scope changes, browser back/stay/discard, window unload and save-in-flight protection remain supported. Base Product edits and PPE behavior retain their contracts. Focused feature/compatibility tests and source/test types pass after the final moves.

**Status:** verified. Final commands and results are recorded in the [source audit](../../004-sewing-articles-and-composition/code-audit/audit.md).
