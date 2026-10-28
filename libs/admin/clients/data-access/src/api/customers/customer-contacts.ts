import { changedCustomerTags } from '../../cache/customers/customer-cache';
import { customerApiError } from '../../errors/customer-api-error';
import { mapCustomerDetail } from '../../mappers/customers/customer-detail.mapper';

import type { SaveContactIntent } from '../../models/customers/save-contact-intent';
import type { CustomerEndpointBuilder } from '../customer-endpoint-builder';
import type { CustomerDetail } from '@admin/clients/model';
import type { operations } from '@admin/shared/contracts';

export function customerContacts(build: CustomerEndpointBuilder) {
  return {
    saveCustomerContact: build.mutation<CustomerDetail, SaveContactIntent>({
      query: ({ customerId, contactId, revision, draft, requestId }) => ({
        url: `/api/crm/customers/${customerId}/contacts${contactId ? `/${contactId}` : ''}`,
        method: contactId ? 'PUT' : 'POST',
        body: {
          requestId,
          expectedRevision: revision,
          input: {
            ...draft,
            position: draft.position.trim() || null,
            channels: draft.channels.map((c) => ({ ...c, value: c.value.trim() })),
          },
        } satisfies operations['createCrmCustomerContact']['requestBody']['content']['application/json'],
      }),
      transformResponse: mapCustomerDetail,
      transformErrorResponse: customerApiError,
      invalidatesTags: (_, error, { customerId }) => (error ? [] : changedCustomerTags(customerId)),
    }),
  };
}
