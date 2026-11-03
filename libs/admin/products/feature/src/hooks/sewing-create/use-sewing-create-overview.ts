import { useUpdateProductOverviewMutation } from '@admin/products/data-access';
import { createProductOverviewFormValues, productOverviewBody } from '@admin/products/model';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useState } from 'react';

import type { ProductOverview } from '@admin/products/model';

type OverviewFlags = { isActive?: boolean; isVerified?: boolean };

/**
 * «Перевірено» and «Активна» of the draft through the «Товари» overview update; every other
 * overview field is sent as it is saved now.
 */
export function useSewingCreateOverview(row: ProductOverview | null) {
  const [update, state] = useUpdateProductOverviewMutation();
  const [message, setMessage] = useState<string | null>(null);

  async function save(flags: OverviewFlags): Promise<boolean> {
    if (!row || state.isLoading) return false;
    const values = { ...createProductOverviewFormValues(row), ...flags };
    setMessage(null);
    try {
      await update({ id: row.id, body: productOverviewBody(values, row) }).unwrap();
      return true;
    } catch (error) {
      setMessage(adminApiErrorMessage(error, 'Не вдалося зберегти модель.'));
      return false;
    }
  }

  return { save, saving: state.isLoading, message };
}
