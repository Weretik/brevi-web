# FE-011 selection state and UX continuation — 2026-10-29

**Outcome:** partial frontend feature slice for SC-I01–03. The pure 4/8 slot UI now has reusable selection orchestration and a current-selection approval gate. No backend transport, quote route, owned template workflow or release acceptance is claimed.

## File roles

- `model/src/models/introductions/introduction-review-state.ts` and its unit test: exact 4/8 season layout guard; a server review applies only to its opaque current selection token, has no blockers, and has no slot blockers. This does not identify products or compute featured models.
- `feature/src/components/introductions/use-introduction-selection.ts`: asynchronous check/apply through injected callbacks; stale check results are discarded after selection changes; a successful apply consumes the approval. No HTTP operation or backend DTO is defined.
- `feature/src/components/introductions/introduction-selection-panel.tsx` and component test: composes existing format, seasonal slots and review UI; shows backend season/duplicate/featured/fabric blockers as supplied text; selection edits invalidate approval. Product/fabric pickers are callback ports.
- `model/src/index.ts` and `feature/src/index.ts`: public exports for the new boundary. No route is mounted.

## Callback contract for later API integration

`IntroductionSelectionPanelProps` accepts `format`, an ordered 4/8 `IntroductionSlotView[]`, `disabled`, and an opaque UI `selectionToken` that must change on every format/product/fabric edit. It calls `onFormatChange`, `onChooseProduct(slotKey)`, `onChooseFabric(slotKey)`, `onCheck(selectionToken): Promise<{ approved; blockers }>` and `onApply(selectionToken): Promise<void>`. The eventual adapter maps real generated operations to these ports. Server ownership of season validation, duplicate matching, featured identity, fabric metadata, URLs and prices remains unchanged.

## Focused verification

- From `libs/admin/clients/model`: `node ../../../../node_modules/vitest/vitest.mjs run src/models/introductions/introduction-review-state.unit.test.ts src/models/introductions/introduction-layout.unit.test.ts` — **4/4 passed** across two files.
- From `libs/admin/clients/feature`: `node ../../../../node_modules/vitest/vitest.mjs run src/components/introductions/introduction-selection-panel.component.test.tsx` — **3/3 passed**. The first run exposed missing DOM cleanup in the new test fixture (1/3); cleanup was added and the rerun passed.
- `tsc --noEmit -p` for model and feature `tsconfig.lib.json` and `tsconfig.spec.json` passed. Prettier and `git diff --check` passed on the changed slice.

## Remaining

Backend TS-016 contract handoff, typed data-access and server validation mapping, owned Manager selection templates, feature route and draft apply, current server price, pinned seasonal PDF, FE-009 send and manual PDF/privacy acceptance remain open. The UI token and callbacks are local ports; they are not a claim of an implemented API.
