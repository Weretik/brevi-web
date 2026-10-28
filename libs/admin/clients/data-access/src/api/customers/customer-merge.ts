import { customerDetailTag, changedCustomerTags } from '../../cache/customers/customer-cache';
import { customerApiError } from '../../errors/customer-api-error';
import { mapCustomerDetail } from '../../mappers/customers/customer-detail.mapper';

import type { MergeCustomersIntent } from '../../models/customers/merge-customers-intent';
import type { CustomerEndpointBuilder } from '../customer-endpoint-builder';
import type { CustomerDetail } from '@admin/clients/model';
import type { operations } from '@admin/shared/contracts';

export function customerMerge(build: CustomerEndpointBuilder) {
  return {
    mergeCustomers: build.mutation<CustomerDetail, MergeCustomersIntent>({
      query: ({ customerId, victimId, revision, victimRevision, reason, requestId }) => ({
        url: `/api/crm/customers/${customerId}/merge`,
        method: 'POST',
        body: {
          requestId,
          expectedRevision: revision,
          victimId,
          victimRevision,
          reason: reason.trim(),
        } satisfies operations['mergeCrmCustomers']['requestBody']['content']['application/json'],
      }),
      transformResponse: mapCustomerDetail,
      transformErrorResponse: customerApiError,
      invalidatesTags: (_, error, { customerId, victimId }) =>
        error ? [] : [...changedCustomerTags(customerId), customerDetailTag(victimId)],
    }),
  };
}
