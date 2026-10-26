# Frontend design

Follow existing Admin architecture, API-data, UI and code-organization rules. Sources: docs/architecture/admin/README.md and docs/standards/admin/*. No package or global route/theme change is needed.

Model owns independent calculation/publication application models and pure Product price selection. Data-access owns generated operation aliases, validation of consumed response fields, model mapping, endpoint URLs, errors, retry identities and RTK Query cache tags. UI receives models/callbacks only. Feature owns selected calculation ID, retained retry UUID and composition-dirty/stale gating. RTK Query owns server payloads; do not copy them into feature state.

Planned responsibility map:

```text
libs/admin/products/
  model/src/entities/sewing-pricing/              # calculation / tiers / publication models
  model/src/queries/sewing-pricing/               # select published Product price; no pricing formula
  data-access/src/contracts/sewing-pricing/       # generated operation aliases only
  data-access/src/validators/sewing-pricing/      # runtime boundary checks
  data-access/src/mappers/sewing-pricing/         # DTO to application model
  data-access/src/api/sewing-pricing/             # calculations, publications, bounded Product projection
  ui/src/components/sewing-pricing/              # breakdown, tiers, blockers and publication display
  feature/src/hooks/sewing-pricing/               # Article workflow / Product price projection
  feature/src/components/sewing-pricing/          # thin composition-screen entry point
```

Integrate the Article panel into the existing composition selection; unsaved drafts disable its writes. Existing Product list/detail hooks apply the published-price projection; a failed projection never revives legacy Sewing prices. Hide legacy fabric price bands on the Product detail page while retaining its manufacturing fields. Accept null legacy detail under the already nullable backend contract.

Use installed MUI theme tokens and responsive Stack/Grid patterns. Product strings are Ukrainian. No network calls in UI; no generated DTO imports outside data-access. No frontend approval of imported composition. Settings are read from retained calculation evidence; editing global settings is outside this Article consumer scope.
