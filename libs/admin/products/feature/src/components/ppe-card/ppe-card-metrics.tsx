import { SewingCardMetricStrip, sewingPriceFormat } from '@admin/products/ui';

import type { PpeSupplierOffer } from '@admin/products/model';

const price = (value: number | null | undefined) =>
  value === null || value === undefined ? '—' : sewingPriceFormat(value);
const date = new Intl.DateTimeFormat('uk-UA', { dateStyle: 'short', timeZone: 'Europe/Kyiv' });

/** Figures of the PPE product: supplier price and the three prices of «Прайс на сайт». */
export function PpeCardMetrics({
  offer,
  showCost,
}: {
  offer: PpeSupplierOffer | null;
  /** «Ціна постачальника» is for Admin only (CAT-019). */
  showCost: boolean;
}) {
  return (
    <SewingCardMetricStrip
      metrics={[
        ...(showCost
          ? [
              {
                label: 'Ціна постачальника',
                value: price(offer?.supplierPrice),
                note: offer?.priceUpdatedAt
                  ? `оновлено ${date.format(new Date(offer.priceUpdatedAt))}`
                  : undefined,
              },
            ]
          : []),
        { label: 'Роздріб', value: price(offer?.prices?.retail), note: 'від 1 шт., з ПДВ' },
        { label: 'Опт', value: price(offer?.prices?.wholesale), note: 'від 11 шт., з ПДВ' },
        {
          label: 'Великий опт',
          value: price(offer?.prices?.largeWholesale),
          note: 'від 41 шт., з ПДВ',
        },
        {
          label: 'Режим ціни',
          value: offer?.allowManualPrice ? 'Ручна' : 'Автооновлення',
          note: offer?.supplierName ?? undefined,
          tone: offer?.allowManualPrice ? 'warning' : undefined,
        },
      ]}
    />
  );
}
