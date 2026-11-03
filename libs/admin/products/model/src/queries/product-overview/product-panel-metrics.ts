import { sewingCardTotals } from '../sewing-card/sewing-card-totals';

import type { SewingArticleSummaryRow } from '../../entities/sewing-card/sewing-article-summary';
import type { SewingAmountRange } from '../sewing-card/sewing-card-totals';

/** Figures of the side panel of a sewing model: materials, labour and full cost across Articles. */
export interface SewingPanelMetrics {
  materials: SewingAmountRange | null;
  minutes: number | null;
  fullCost: SewingAmountRange | null;
}

export function sewingPanelMetrics(rows: readonly SewingArticleSummaryRow[]): SewingPanelMetrics {
  const totals = sewingCardTotals(rows);
  const materials = rows
    .filter((row) => row.calculated)
    .flatMap((row) => row.costs.filter((cost) => cost.kind === 'materials'))
    .map((cost) => cost.amount);
  return {
    materials: materials.length
      ? { min: Math.min(...materials), max: Math.max(...materials) }
      : null,
    minutes: totals.minutes,
    fullCost: totals.fullCost,
  };
}
