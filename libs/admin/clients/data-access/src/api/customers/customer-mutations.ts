import { customerListTag, changedCustomerTags } from '../../cache/customers/customer-cache';
import { customerApiError } from '../../errors/customer-api-error';
import { customerBody } from '../../mappers/customers/customer-body';
import { mapCustomerDetail } from '../../mappers/customers/customer-detail.mapper';

import type { CreateCustomerIntent } from '../../models/customers/create-customer-intent';
import type { ReviseCustomerIntent } from '../../models/customers/revise-customer-intent';
import type { CustomerEndpointBuilder } from '../customer-endpoint-builder';
import type { CustomerDetail } from '@admin/clients/model';
import type { operations } from '@admin/shared/contracts';

export function customerMutations(build: CustomerEndpointBuilder) {
  return {
    createCustomer: build.mutation<CustomerDetail, CreateCustomerIntent>({
      query: ({ draft, requestId }) => ({
        url: '/api/crm/customers',
        method: 'POST',
        body: {
          requestId,
          input: customerBody(draft),
        } satisfies operations['createCrmCustomer']['requestBody']['content']['application/json'],
      }),
      transformResponse: mapCustomerDetail,
      transformErrorResponse: customerApiError,
      invalidatesTags: (_, error) => (error ? [] : [customerListTag]),
    }),
    reviseCustomer: build.mutation<CustomerDetail, ReviseCustomerIntent>({
      query: ({ customerId, revision, draft, requestId }) => ({
        url: `/api/crm/customers/${customerId}`,
        method: 'PUT',
        body: {
          requestId,
          expectedRevision: revision,
          input: customerBody(draft),
          active: draft.active,
        } satisfies operations['reviseCrmCustomer']['requestBody']['content']['application/json'],
      }),
      transformResponse: mapCustomerDetail,
      transformErrorResponse: customerApiError,
      invalidatesTags: (_, error, { customerId }) => (error ? [] : changedCustomerTags(customerId)),
    }),
  };
}
