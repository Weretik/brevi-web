import { SewingCardMetricStrip, sewingPriceFormat } from '@admin/products/ui';

import type { SewingAmountRange, SewingCardTotals } from '@admin/products/model';

interface Props {
  totals: SewingCardTotals;
}

const minutes = new Intl.NumberFormat('uk-UA', { maximumFractionDigits: 1 });

function range(value: SewingAmountRange | null) {
  if (!value) return '—';
  return value.min === value.max
    ? sewingPriceFormat(value.min)
    : `${sewingPriceFormat(value.min)} – ${sewingPriceFormat(value.max)}`;
}

/**
 * Figures of the model: its fabrics, labour in minutes and UAH, cost and all three price levels.
 * Labour comes from the server calculation, as in the «Товари» side panel.
 */
export function SewingCardMetrics({ totals }: Props) {
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
        {
          label: 'Трудовитрати',
          value: totals.labour === null ? '—' : sewingPriceFormat(totals.labour),
          note:
            totals.minutes === null ? undefined : `${minutes.format(totals.minutes)} хв на 1 виріб`,
        },
        { label: 'Собівартість', value: range(totals.fullCost) },
        { label: '1–9 шт.', value: range(totals.retail), note: 'з ПДВ' },
        { label: '10–40 шт.', value: range(totals.wholesale), note: 'з ПДВ' },
        { label: 'Від 41 шт.', value: range(totals.largeWholesale), note: 'з ПДВ' },
      ]}
    />
  );
}
