# Rules and scenarios

- R-P01: render server current retail/wholesale/large-wholesale amounts; never calculate markups in the browser.
- R-P02: imported source review is distinct from explicit Brevi approval. Managers can edit supplier/external inputs and rule fractions, then save an approved version. Actor/time are server-owned.
- R-P03: stale version or changed-content request UUID yields a safe error with reload; unchanged network retry retains UUID. Edited payload gets a new UUID. Writes never auto-retry or auto-approve.
- R-P04: enrolled Product wholesale reflects the new calculation or explicit blocked/loading/error state, never old prices. TS-007 supersedes the initial non-enrollment fallback: unconfigured PPE has an explicit blocked/onboarding state, never an old amount. Sewing remains on its publication projection.
- R-P05: use the generated contract only in data-access, validate consumed fields, keep models independent, RTK owns server state, MUI and Ukrainian labels follow existing application rules.

SC-P01: Given available current PPE input, when a reader opens its card, then three prices or actionable blockers and version/source review state are shown, without write controls.
SC-P02: Given a manager reviewing imported offer/rule values, when they explicitly save, then a server-approved version is created and card/list pricing refreshes.
SC-P03: Given a failed write, when retried unchanged, then its request identity is retained; changed values use a new identity. A version conflict requires reloading current inputs.
SC-P04: Given enrolled PPE with blocked/loading/failed calculation, when shown in a card/list, then an explicit status replaces legacy amounts. TS-007 applies the same rule to non-enrolled PPE; Sewing remains on its publication source.
