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

/** Figures of the model: articles ready, labour, cost and retail price ranges. */
export function SewingCardMetrics({ totals, labourMinutes }: Props) {
  return (
    <SewingCardMetricStrip
      metrics={[
        {
          label: 'Артикули',
          value: `${totals.ready} з ${totals.articles}`,
          note: 'готові до розрахунку',
          tone: totals.articles > 0 && totals.ready === totals.articles ? 'success' : 'warning',
        },
        { label: 'Трудовитрати', value: `${minutes.format(labourMinutes)} хв`, note: 'на 1 виріб' },
        { label: 'Собівартість', value: range(totals.fullCost) },
        { label: 'Ціна 1–9 шт.', value: range(totals.retail), note: 'з ПДВ' },
        {
          label: 'Ціна в прайсі',
          value: totals.unpublished ? `${totals.unpublished} змін` : 'Актуальна',
          note: totals.unpublished ? 'нова ціна ще не опублікована' : undefined,
          tone: totals.unpublished ? 'warning' : undefined,
        },
      ]}
    />
  );
}
