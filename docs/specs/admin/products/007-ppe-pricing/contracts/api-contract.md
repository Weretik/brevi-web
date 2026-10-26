# PPE contract consumer

Backend repository: https://github.com/Weretik/BreviERP.git. Canonical source: docs/sdd/contracts/catalog/ppe-pricing.openapi.yaml. Pinned clean checkpoint: `c39c95127125c90b4f77bc00a531f0556cb728a2`. Snapshot sync/generate/check completed before transport implementation. No schema copy here.

| operationId           | Consumer                                                                                                                      |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| getPpeProductPrices   | bounded current Product calculations and input versions                                                                       |
| getPpePricingRule     | exact-code rule read available at the data-access boundary; the current panel receives its selected rule in the Product batch |
| createPpeOfferVersion | explicit manager save/approval, expected version + retry UUID                                                                 |
| createPpeRuleVersion  | explicit manager save/approval of shared rule, expected version + retry UUID                                                  |
| getCurrentSession     | existing permission capability read                                                                                           |

Follow repository contract-workflow; generated types stay private to data-access. Validate identity/scope, approved metadata, dates, amounts and readiness before mapping. No raw transport error text. Runtime errors keep retry/reload controls and do not revive legacy prices.

TS-007 current aggregate pin: `0529daf910b837eb808a662695706dda4beaf833`; deprecated Product price fields are metadata-only placeholders. The earlier PPE operation schemas remain unchanged. See the [cutover](../cutover/README.md).
