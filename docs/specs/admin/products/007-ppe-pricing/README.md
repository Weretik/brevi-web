# Admin PPE pricing — TS-006

Status: implemented and verified, 2026-10-25. Scope: consume Brevi-owned versioned PPE pricing, show three tiers and actionable blockers, explicitly approve/edit offer/rule versions, select new current wholesale prices in Product list/detail without legacy fallback for enrolled Products. No runtime Google/XML, new route/theme/store or automatic approval.

[Requirements](requirements.md) · [Design](design/frontend.md) · [Contract](contracts/api-contract.md) · [Tasks/evidence](tasks.md) · [Traceability](traceability.md).

[TS-007 consumer cutover](cutover/README.md) supersedes the initial legacy fallback and archives old price controls. Current prices now use only Pricing APIs.

[Commit handoff and deferred UI acceptance](handoff.md).
