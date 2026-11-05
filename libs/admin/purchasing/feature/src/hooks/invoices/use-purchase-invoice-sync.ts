import {
  useGetPurchaseSyncStateQuery,
  useSyncPurchaseInvoicesMutation,
} from '@admin/purchasing/data-access';
import { describePurchaseSync } from '@admin/purchasing/model';
import { adminApiErrorMessage } from '@admin/shared/api-client';

/** «Оновити зараз»: the same sheet sync as the daily job, plus the state of the last one. */
export function usePurchaseInvoiceSync(onResult: (message: string, ok: boolean) => void) {
  const syncState = useGetPurchaseSyncStateQuery();
  const [syncInvoices, state] = useSyncPurchaseInvoicesMutation();

  async function sync() {
    if (state.isLoading) return;
    try {
      onResult(describePurchaseSync(await syncInvoices().unwrap()), true);
    } catch (error) {
      onResult(adminApiErrorMessage(error, 'Не вдалося оновити реєстр з Google-таблиці.'), false);
    }
  }

  return { sync, syncing: state.isLoading, syncState: syncState.currentData };
}
