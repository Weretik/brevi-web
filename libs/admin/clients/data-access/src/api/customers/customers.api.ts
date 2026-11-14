import { customerContacts } from './customer-contacts';
import { customerKeepinSync } from './customer-keepin-sync';
import { customerMerge } from './customer-merge';
import { customerMutations } from './customer-mutations';
import { customerQueries } from './customer-queries';
import { customerBaseApi } from '../base/customer-base-api';

export const customersApi = customerBaseApi.injectEndpoints({
  endpoints: (build) => ({
    ...customerQueries(build),
    ...customerMutations(build),
    ...customerContacts(build),
    ...customerMerge(build),
    ...customerKeepinSync(build),
  }),
});

export const {
  useListCustomersQuery,
  useGetCustomerQuery,
  useCreateCustomerMutation,
  useReviseCustomerMutation,
  useSaveCustomerContactMutation,
  useMergeCustomersMutation,
  useSyncCustomersFromKeepinCrmMutation,
} = customersApi;
