import { sameQuoteSelection } from './same-quote-selection';

import type { QuoteBasisComparison } from '../../entities/quotes/quote-basis-comparison';
import type { QuotePriceBasis } from '../../entities/quotes/quote-price-basis';

export function compareQuoteBasis(
  previous: QuotePriceBasis,
  next: QuotePriceBasis,
): QuoteBasisComparison {
  const sourceKey = (basis: QuotePriceBasis) =>
    basis.source == null
      ? null
      : JSON.stringify({
          sourceId: basis.source.sourceId,
          calculationId: basis.source.calculationId,
          ruleVersionId: basis.source.ruleVersionId,
          compositionVersion: basis.source.compositionVersion,
          settingsVersionId: basis.source.settingsVersionId,
          referenceVersionIds: [...basis.source.referenceVersionIds].sort(
            (left, right) => left - right,
          ),
          formulaVersion: basis.source.formulaVersion,
        });
  const tiers = ['retail', 'wholesale', 'largeWholesale'] as const;
  return {
    selectionMatches: sameQuoteSelection(previous.selection, next.selection),
    sourceChanged:
      previous.source === undefined || next.source === undefined
        ? null
        : sourceKey(previous) !== sourceKey(next),
    blocked: next.blockers.length > 0 || tiers.some((tier) => next[tier] === null),
    prices: tiers.map((tier) => ({
      tier,
      before: previous[tier],
      after: next[tier],
      changed: previous[tier] !== next[tier],
    })),
  };
}
