import { useSyncSuppliersFromKeepinCrmMutation } from '@admin/references/data-access';
import { describeSupplierKeepinSync } from '@admin/references/model';
import { adminApiErrorMessage } from '@admin/shared/api-client';

/** «Оновити з KeepinCRM»: runs the same refresh as the daily job and reports the result. */
export function useSupplierKeepinSync(onResult: (message: string, ok: boolean) => void) {
  const [syncSuppliers, state] = useSyncSuppliersFromKeepinCrmMutation();

  async function sync() {
    if (state.isLoading) return;
    try {
      onResult(describeSupplierKeepinSync(await syncSuppliers().unwrap()), true);
    } catch (error) {
      onResult(adminApiErrorMessage(error, 'Не вдалося оновити з KeepinCRM.'), false);
    }
  }

  return { sync, syncing: state.isLoading };
}
