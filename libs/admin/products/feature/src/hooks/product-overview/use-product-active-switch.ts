import { useUpdateProductOverviewMutation } from '@admin/products/data-access';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useState } from 'react';

import type { ProductOverview } from '@admin/products/model';

/**
 * Switch «Активний» in the «Товари» list and the card (CAT-018): saves the row with only `isActive`
 * changed, through the same request as the side panel.
 */
export function useProductActiveSwitch(onError: (message: string) => void) {
  const [update] = useUpdateProductOverviewMutation();
  const [savingId, setSavingId] = useState<number | null>(null);

  async function change(product: ProductOverview, isActive: boolean) {
    if (savingId !== null) return;
    setSavingId(product.id);
    try {
      await update({
        id: product.id,
        body: {
          code: product.code,
          sectionId: product.sectionId,
          season: product.type === 'Sewing' ? product.season : null,
          isActive,
          currentSiteUrl: product.currentSiteUrl,
          quoteDescription: product.quoteDescription,
        },
      }).unwrap();
    } catch (error) {
      onError(adminApiErrorMessage(error, 'Не вдалося змінити активність товару.'));
    } finally {
      setSavingId(null);
    }
  }

  return {
    savingId,
    change: (product: ProductOverview, isActive: boolean) => void change(product, isActive),
  };
}
