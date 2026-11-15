import { apiCall, apiClient } from '@admin/shared/api-client';

import { customerDetailTag, changedCustomerTags } from '../../cache/customer-cache';
import { customerApiError } from '../../errors/customer-api-error';
import { mapCustomerDetail } from '../../mappers/customer-detail.mapper';

import type { MergeCustomersIntent } from '../../models/merge-customers-intent';
import type { CustomerEndpointBuilder } from '../base/customer-endpoint-builder';
import type { CustomerDetail } from '@admin/clients/model';
import type { operations } from '@admin/shared/contracts';

export function customerMerge(build: CustomerEndpointBuilder) {
  return {
    mergeCustomers: build.mutation<CustomerDetail, MergeCustomersIntent>({
      queryFn: (
        { customerId, victimId, revision, victimRevision, reason, requestId },
        { signal },
      ) =>
        apiCall(
          apiClient.POST('/api/crm/customers/{customerId}/merge', {
            params: { path: { customerId: customerId } },
            body: {
              requestId,
              expectedRevision: revision,
              victimId,
              victimRevision,
              reason: reason.trim(),
            } satisfies operations['mergeCrmCustomers']['requestBody']['content']['application/json'],
            signal,
          }),
          mapCustomerDetail,
          customerApiError,
        ),
      invalidatesTags: (_, error, { customerId, victimId }) =>
        error ? [] : [...changedCustomerTags(customerId), customerDetailTag(victimId)],
    }),
  };
}
