import { SewingCardMetricStrip, sewingPriceFormat } from '@admin/products/ui';

import type { SewingAmountRange, SewingCardTotals } from '@admin/products/model';

interface Props {
  totals: SewingCardTotals;
  labourMinutes: number;
}

const minutes = new Intl.NumberFormat('uk-UA', { maximumFractionDigits: 1 });

function range(value: SewingAmountRange | null) {
  if (!value) return '—';
  return value.min === value.max
    ? sewingPriceFormat(value.min)
    : `${sewingPriceFormat(value.min)} – ${sewingPriceFormat(value.max)}`;
}

/** Figures of the model: its fabrics, labour, cost and retail price ranges. */
export function SewingCardMetrics({ totals, labourMinutes }: Props) {
  return (
    <SewingCardMetricStrip
      metrics={[
        {
          label: 'Тканини',
          value: String(totals.articles),
          // Only a problem gets a note (CAT-013).
          note:
            totals.articles === 0
              ? 'додайте тканину'
              : totals.ready === totals.articles
                ? undefined
                : `без ціни: ${totals.articles - totals.ready}`,
          tone: totals.articles > 0 && totals.ready === totals.articles ? undefined : 'warning',
        },
        { label: 'Трудовитрати', value: `${minutes.format(labourMinutes)} хв`, note: 'на 1 виріб' },
        { label: 'Собівартість', value: range(totals.fullCost) },
        { label: 'Ціна 1–9 шт.', value: range(totals.retail), note: 'з ПДВ' },
      ]}
    />
  );
}
