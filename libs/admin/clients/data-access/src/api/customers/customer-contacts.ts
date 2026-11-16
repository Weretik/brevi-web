import { apiCall, apiClient } from '@admin/shared/api-client';

import { changedCustomerTags } from '../../cache/customer-cache';
import { customerApiError } from '../../errors/customer-api-error';
import { mapCustomerDetail } from '../../mappers/customer-detail.mapper';

import type { SaveContactIntent } from '../../models/save-contact-intent';
import type { CustomerEndpointBuilder } from '../base/customer-endpoint-builder';
import type { CustomerDetail } from '@admin/clients/model';
import type { operations } from '@admin/shared/contracts';

export function customerContacts(build: CustomerEndpointBuilder) {
  return {
    saveCustomerContact: build.mutation<CustomerDetail, SaveContactIntent>({
      queryFn: ({ customerId, contactId, revision, draft, requestId }, { signal }) => {
        const body = {
          requestId,
          expectedRevision: revision,
          input: {
            ...draft,
            position: draft.position.trim() || null,
            channels: draft.channels.map((c) => ({ ...c, value: c.value.trim() })),
          },
        } satisfies operations['createCrmCustomerContact']['requestBody']['content']['application/json'];
        return apiCall(
          contactId
            ? apiClient.PUT('/api/crm/customers/{customerId}/contacts/{contactId}', {
                params: { path: { customerId, contactId } },
                body,
                signal,
              })
            : apiClient.POST('/api/crm/customers/{customerId}/contacts', {
                params: { path: { customerId } },
                body,
                signal,
              }),
          mapCustomerDetail,
          customerApiError,
        );
      },
      invalidatesTags: (_, error, { customerId }) => (error ? [] : changedCustomerTags(customerId)),
    }),
  };
}
