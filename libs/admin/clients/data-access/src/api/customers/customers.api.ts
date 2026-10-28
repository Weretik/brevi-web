import { customerBaseApi } from '../customer-base-api';
import { customerContacts } from './customer-contacts';
import { customerMerge } from './customer-merge';
import { customerMutations } from './customer-mutations';
import { customerQueries } from './customer-queries';

export const customersApi = customerBaseApi.injectEndpoints({
  endpoints: (build) => ({
    ...customerQueries(build),
    ...customerMutations(build),
    ...customerContacts(build),
    ...customerMerge(build),
  }),
});

export const {
  useListCustomersQuery,
  useGetCustomerQuery,
  useCreateCustomerMutation,
  useReviseCustomerMutation,
  useSaveCustomerContactMutation,
  useMergeCustomersMutation,
} = customersApi;
