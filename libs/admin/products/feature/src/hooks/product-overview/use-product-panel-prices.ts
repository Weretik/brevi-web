import {
  useGetPpeSupplierOfferQuery,
  useGetSewingArticleSummaryQuery,
} from '@admin/products/data-access';
import { productProblemReasons, sewingPanelMetrics } from '@admin/products/model';
import { sewingPriceFormat } from '@admin/products/ui';
import { adminApiErrorMessage } from '@admin/shared/api-client';

import type { ProductOverview, SewingAmountRange } from '@admin/products/model';
import type { ProductPanelMetric } from '@admin/products/ui';

const minutes = new Intl.NumberFormat('uk-UA', { maximumFractionDigits: 1 });
const date = new Intl.DateTimeFormat('uk-UA', { dateStyle: 'short' });

const money = (value: number | null | undefined) =>
  value === null || value === undefined ? '—' : sewingPriceFormat(value);
const range = (value: SewingAmountRange | null) =>
  !value
    ? '—'
    : value.min === value.max
      ? money(value.min)
      : `${money(value.min)} – ${money(value.max)}`;
const day = (value: string | null | undefined) => (value ? date.format(new Date(value)) : '—');

/**
 * Side panel figures (CAT-011): sewing from the live Article summary, PPE from the supplier offer;
 * the row's problems only when a price is missing (CAT-013).
 */
export function useProductPanelPrices(row: ProductOverview) {
  const sewing = row.type === 'Sewing';
  const summary = useGetSewingArticleSummaryQuery(row.id, { skip: !sewing });
  const offer = useGetPpeSupplierOfferQuery(row.id, { skip: sewing });
  const failure = sewing ? summary.error : offer.error;

  let metrics: ProductPanelMetric[];
  const blockers = productProblemReasons(row.type, row.problems);
  if (sewing) {
    const figures = sewingPanelMetrics(summary.data?.articles ?? []);
    metrics = [
      { label: 'Матеріали', value: range(figures.materials) },
      {
        label: 'Трудовитрати',
        value: figures.minutes === null ? '—' : `${minutes.format(figures.minutes)} хв`,
      },
      { label: 'Собівартість', value: range(figures.fullCost) },
      { label: 'Ціни оновлено', value: day(row.pricesUpdatedAt) },
    ];
  } else {
    metrics = [
      { label: 'Ціна постачальника', value: money(offer.data?.supplierPrice) },
      { label: 'Правило', value: offer.data?.ruleCode ?? '—' },
      { label: 'Ціна 1–9 шт.', value: money(row.prices?.retail) },
      { label: 'Ціни оновлено', value: day(row.pricesUpdatedAt ?? offer.data?.priceUpdatedAt) },
    ];
  }

  return {
    metrics,
    blockers,
    loading: sewing ? summary.isLoading : offer.isLoading,
    error: failure ? adminApiErrorMessage(failure, 'Не вдалося завантажити ціни товару.') : null,
  };
}
