# Requirements and acceptance

- R-001: Sewing prices come exclusively from explicitly published Article calculations. Missing publication is an explicit empty state; no legacy formula or zero-price fallback is displayed. PPE retains its existing behavior.
- R-002: A manager calculates a selected saved Article from server-owned composition/settings/costs. A saved result shows source versions, component costs, total minutes, full cost and three quantity tiers: 1–9, 10–40, 41+. Frontend performs no pricing formula.
- R-003: Named blockers explain what must be reviewed/fixed. Blocked calculations cannot publish. Unsaved composition disables calculation/publication. Published prices remain visible when a new calculation is blocked or stale.
- R-004: Publication is explicit and uses only a saved calculation ID. Changed composition or a server 409 requires a new calculation. Failed network saves preserve the request UUID for safe retry; publication retries reuse the calculation ID. Article changes isolate the selected calculation state.
- R-005: Readers can see published prices/calculation; manager actions follow existing session capabilities. Loading, no-price, error/retry and forbidden states are visible. Backend errors and internal payloads are not shown verbatim.
- R-006: Product lists load published prices with one bounded batch request for the current page, not per row. Publication invalidates Product/card/list and pricing caches. A saved/edited Product or composition response with no legacy Sewing detail remains valid.

SC-001: Given a manager and saved Article, calculating displays the retained result and all three tiers without publishing automatically.

SC-002: Given unreviewed/missing inputs or unsaved composition, the interface explains the block and prevents publication; existing publication stays visible.

SC-003: Given a successful result, publication updates its current price and Product displays. A stale calculation or 409 prompts recalculation, retaining the previous published price.

SC-004: Given transient failure, retry preserves the calculation request UUID; switching Article does not display another Article's result. Reader access never exposes write actions.

SC-005: Given a Sewing Product list/card, price comes from the latest active Article publication; absent/loading/error states do not display legacy values. PPE is unchanged. Imported Sewing Products with null legacy detail still open.
