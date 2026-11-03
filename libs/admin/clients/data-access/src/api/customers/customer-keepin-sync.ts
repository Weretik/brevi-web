import { customerListTag } from '../../cache/customers/customer-cache';
import { customerApiError } from '../../errors/customer-api-error';
import { mapCustomerKeepinSyncResult } from '../../mappers/customers/customer-keepin-sync.mapper';

import type { CustomerEndpointBuilder } from '../customer-endpoint-builder';
import type { CustomerKeepinSyncResult } from '@admin/clients/model';
import type { operations } from '@admin/shared/contracts';

type Body = NonNullable<
  operations['syncCrmCustomersFromKeepinCrm']['requestBody']
>['content']['application/json'];

export function customerKeepinSync(build: CustomerEndpointBuilder) {
  return {
    /** «Оновити з KeepinCRM»: the daily refresh, applied, never deleting. */
    syncCustomersFromKeepinCrm: build.mutation<CustomerKeepinSyncResult, void>({
      query: () => ({
        url: '/api/crm/customers/keepin-sync',
        method: 'POST',
        body: { dryRun: false, removeUnlinked: false } satisfies Body,
      }),
      transformResponse: mapCustomerKeepinSyncResult,
      transformErrorResponse: customerApiError,
      invalidatesTags: (_, error) => (error ? [] : [customerListTag]),
    }),
  };
}
