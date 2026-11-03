import { useSyncCustomersFromKeepinCrmMutation } from '@admin/clients/data-access';
import { describeCustomerKeepinSync } from '@admin/clients/model';
import { adminApiErrorMessage } from '@admin/shared/api-client';

/** «Оновити з KeepinCRM» on the clients tab: the same refresh as the daily job. */
export function useCustomerKeepinSync(onResult: (message: string, ok: boolean) => void) {
  const [syncCustomers, state] = useSyncCustomersFromKeepinCrmMutation();

  async function sync() {
    if (state.isLoading) return;
    try {
      onResult(describeCustomerKeepinSync(await syncCustomers().unwrap()), true);
    } catch (error) {
      onResult(adminApiErrorMessage(error, 'Не вдалося оновити з KeepinCRM.'), false);
    }
  }

  return { sync, syncing: state.isLoading };
}
