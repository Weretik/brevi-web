import { accountingBaseApi } from './accounting-base-api';
import { financeAccountEndpoints } from './accounts/finance-account-endpoints';
import { financeCategoryEndpoints } from './categories/finance-category-endpoints';

export const accountingApi = accountingBaseApi.injectEndpoints({
  endpoints: (build) => ({
    ...financeAccountEndpoints(build),
    ...financeCategoryEndpoints(build),
  }),
});

export const {
  useCreateFinanceAccountMutation,
  useCreateFinanceCategoryMutation,
  useDeleteFinanceAccountMutation,
  useDeleteFinanceCategoryMutation,
  useGetAccountingSettingsQuery,
  useGetFinanceAccountHistoryQuery,
  useGetFinanceAccountsQuery,
  useGetFinanceCategoriesQuery,
  useGetFinanceCategoryHistoryQuery,
  useSetFinanceAccountActiveMutation,
  useSetFinanceAccountCutoverMutation,
  useUpdateFinanceAccountMutation,
  useUpdateFinanceCategoryMutation,
} = accountingApi;
