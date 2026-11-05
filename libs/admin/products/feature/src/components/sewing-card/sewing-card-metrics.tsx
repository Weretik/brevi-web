import { SewingCardTotals, sewingWholePriceFormat } from '@admin/products/ui';

import type { SewingAmountRange, SewingCardTotals as Totals } from '@admin/products/model';

interface Props {
  totals: Totals;
  /** «Собівартість» is for Admin only (CAT-019). */
  showCost: boolean;
}

const minutes = new Intl.NumberFormat('uk-UA', { maximumFractionDigits: 1 });

function range(value: SewingAmountRange | null) {
  if (!value) return '—';
  return value.min === value.max
    ? sewingWholePriceFormat(value.min)
    : `${sewingWholePriceFormat(value.min)} – ${sewingWholePriceFormat(value.max)}`;
}

/**
 * Figures of the model: fabrics, labour and cost on one line, then the three price levels.
 * Labour comes from the server calculation, as in the «Товари» side panel.
 */
export function SewingCardMetrics({ totals, showCost }: Props) {
  return (
    <SewingCardTotals
      costs={[
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
          value: totals.labour === null ? '—' : sewingWholePriceFormat(totals.labour),
          note:
            totals.minutes === null ? undefined : `${minutes.format(totals.minutes)} хв на 1 виріб`,
        },
        ...(showCost ? [{ label: 'Собівартість', value: range(totals.fullCost) }] : []),
      ]}
      format={sewingWholePriceFormat}
      tiers={[
        { label: '1–9 шт.', range: totals.retail },
        { label: '10–40 шт.', range: totals.wholesale, highlighted: true },
        { label: 'Від 41 шт.', range: totals.largeWholesale },
      ]}
    />
  );
}
