# TS-007 — final current-price consumer transition

Authorized scope: remove Product metadata price fallback and archived price controls/displays; use only getPublishedSewingProducts / getPpeProductPrices for current sale prices. No new route/store/theme, automatic input approval, quote migration or Storefront API adoption.

- SC-R01: even a non-enrolled PPE Product with an old positive amount has no displayed current price; readers see configuration/blocker guidance and managers explicitly onboard through versioned inputs.
- SC-R02: manufacturing metadata no longer displays the old 1–10/11–39/40+ bands. PPE percent controls and legacy price detail are archived. Existing base/supplier values are metadata; a new Product can use its base amount to prefill an unapproved version draft, never activate prices automatically.
- SC-R03: the pinned Product contract deprecates compatibility price fields but preserves response shape. DTOs stay in data-access; current tier values and states remain in independent models and RTK cache.

Implemented and locally verified against backend checkpoint `0529daf910b837eb808a662695706dda4beaf833`. Selector, mapper, component and neighboring Product/Sewing scenarios passed focused regression. Backend read-only source reconciliation is complete. No browser/full suite or deployment is claimed.

[Evidence](evidence.md). The previous TS-006 non-enrollment fallback is historical and superseded by this revision.
