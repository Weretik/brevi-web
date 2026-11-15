import { apiCall, apiClient } from '@admin/shared/api-client';

import { customerListTag, customerDetailTag } from '../../cache/customer-cache';
import { customerApiError } from '../../errors/customer-api-error';
import { mapCustomerDetail } from '../../mappers/customer-detail.mapper';
import { mapCustomerPage } from '../../mappers/customer-page.mapper';

import type { CustomerListQuery } from '../../models/customer-list-query';
import type { CustomerEndpointBuilder } from '../base/customer-endpoint-builder';
import type { CustomerDetail, CustomerPage } from '@admin/clients/model';

export function customerQueries(build: CustomerEndpointBuilder) {
  return {
    listCustomers: build.query<CustomerPage, CustomerListQuery>({
      queryFn: (params, { signal }) =>
        apiCall(
          apiClient.GET('/api/crm/customers', { params: { query: params }, signal }),
          mapCustomerPage,
          customerApiError,
        ),
      providesTags: (result) => [
        customerListTag,
        ...(result?.rows.map((row) => customerDetailTag(row.publicId)) ?? []),
      ],
    }),
    getCustomer: build.query<CustomerDetail, string>({
      queryFn: (id, { signal }) =>
        apiCall(
          apiClient.GET('/api/crm/customers/{customerId}', {
            params: { path: { customerId: id } },
            signal,
          }),
          mapCustomerDetail,
          customerApiError,
        ),
      providesTags: (_result, _error, id) => [customerDetailTag(id)],
    }),
  };
}
