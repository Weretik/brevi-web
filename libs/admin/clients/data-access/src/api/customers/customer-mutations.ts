import { apiCall, apiClient } from '@admin/shared/api-client';

import { customerListTag, changedCustomerTags } from '../../cache/customer-cache';
import { customerApiError } from '../../errors/customer-api-error';
import { customerBody } from '../../mappers/customer-body';
import { mapCustomerDetail } from '../../mappers/customer-detail.mapper';

import type { CreateCustomerIntent } from '../../models/create-customer-intent';
import type { ReviseCustomerIntent } from '../../models/revise-customer-intent';
import type { CustomerEndpointBuilder } from '../base/customer-endpoint-builder';
import type { CustomerDetail } from '@admin/clients/model';
import type { operations } from '@admin/shared/contracts';

export function customerMutations(build: CustomerEndpointBuilder) {
  return {
    createCustomer: build.mutation<CustomerDetail, CreateCustomerIntent>({
      queryFn: ({ draft, requestId }, { signal }) =>
        apiCall(
          apiClient.POST('/api/crm/customers', {
            body: {
              requestId,
              input: customerBody(draft),
            } satisfies operations['createCrmCustomer']['requestBody']['content']['application/json'],
            signal,
          }),
          mapCustomerDetail,
          customerApiError,
        ),
      invalidatesTags: (_, error) => (error ? [] : [customerListTag]),
    }),
    reviseCustomer: build.mutation<CustomerDetail, ReviseCustomerIntent>({
      queryFn: ({ customerId, revision, draft, requestId }, { signal }) =>
        apiCall(
          apiClient.PUT('/api/crm/customers/{customerId}', {
            params: { path: { customerId: customerId } },
            body: {
              requestId,
              expectedRevision: revision,
              input: customerBody(draft),
              active: draft.active,
            } satisfies operations['reviseCrmCustomer']['requestBody']['content']['application/json'],
            signal,
          }),
          mapCustomerDetail,
          customerApiError,
        ),
      invalidatesTags: (_, error, { customerId }) => (error ? [] : changedCustomerTags(customerId)),
    }),
  };
}
