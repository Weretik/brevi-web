import { customerListTag, customerDetailTag } from '../../cache/customers/customer-cache';
import { customerApiError } from '../../errors/customer-api-error';
import { mapCustomerDetail } from '../../mappers/customers/customer-detail.mapper';
import { mapCustomerPage } from '../../mappers/customers/customer-page.mapper';

import type { CustomerListQuery } from '../../models/customers/customer-list-query';
import type { CustomerEndpointBuilder } from '../customer-endpoint-builder';
import type { CustomerDetail, CustomerPage } from '@admin/clients/model';

export function customerQueries(build: CustomerEndpointBuilder) {
  return {
    listCustomers: build.query<CustomerPage, CustomerListQuery>({
      query: (params) => ({ url: '/api/crm/customers', params }),
      transformResponse: mapCustomerPage,
      transformErrorResponse: customerApiError,
      providesTags: (result) => [
        customerListTag,
        ...(result?.rows.map((row) => customerDetailTag(row.publicId)) ?? []),
      ],
    }),
    getCustomer: build.query<CustomerDetail, string>({
      query: (id) => `/api/crm/customers/${id}`,
      transformResponse: mapCustomerDetail,
      transformErrorResponse: customerApiError,
      providesTags: (_result, _error, id) => [customerDetailTag(id)],
    }),
  };
}
