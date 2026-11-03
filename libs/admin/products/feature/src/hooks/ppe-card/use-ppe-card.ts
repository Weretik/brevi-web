import { useGetPpeSupplierOfferQuery, useGetProductAccessQuery } from '@admin/products/data-access';
import { ppeBlockerReasons, ppeReadyStatus } from '@admin/products/model';
import { useListPpeMarkupRulesQuery, useListSuppliersQuery } from '@admin/references/data-access';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useMemo } from 'react';

import { useProductOverview } from '../product-overview/use-product-overview';

import type { SewingCardTone } from '@admin/products/ui';

/** Data of the PPE card: the «Товари» row, the supplier fields with live prices, suppliers and rules. */
export function usePpeCard(productId: number) {
  const overview = useProductOverview('Ppe');
  const offer = useGetPpeSupplierOfferQuery(productId);
  const access = useGetProductAccessQuery();
  const suppliersResult = useListSuppliersQuery();
  const rulesResult = useListPpeMarkupRulesQuery();
  const row = overview.rows.find((item) => item.id === productId) ?? null;
  const suppliers = useMemo(
    () =>
      (suppliersResult.data ?? [])
        .map(({ id, name, isActive }) => ({ id, name, isActive }))
        .sort((a, b) => a.name.localeCompare(b.name, 'uk')),
    [suppliersResult.data],
  );
  const rules = useMemo(() => rulesResult.data ?? [], [rulesResult.data]);
  const data = offer.data ?? null;
  const rule = rules.find((item) => item.name === data?.ruleCode) ?? null;
  const reasons = data ? ppeBlockerReasons(data.blockers) : [];

  const status: { label: string; tone: SewingCardTone } = data
    ? data.prices
      ? { label: ppeReadyStatus, tone: 'success' }
      : { label: reasons[0] ?? 'Ціну не розраховано', tone: 'warning' }
    : { label: offer.isError ? 'Розрахунок недоступний' : 'Розрахунок…', tone: 'neutral' };

  return {
    row,
    sections: overview.sections,
    sectionNames: overview.sectionNames,
    reloadOverview: overview.reload,
    offer: data,
    offerLoading: offer.isLoading,
    offerError: offer.error
      ? adminApiErrorMessage(offer.error, 'Не вдалося завантажити дані постачальника.')
      : null,
    reloadOffer: () => void offer.refetch(),
    canManage: access.currentData?.canManage === true && !access.isError,
    suppliers,
    ruleNames: rules.map((item) => item.name),
    rule,
    reasons,
    status,
  };
}
