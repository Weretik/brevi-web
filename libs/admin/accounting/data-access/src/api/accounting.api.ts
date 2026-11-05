import { accountingBaseApi } from './accounting-base-api';
import { financeAccountEndpoints } from './accounts/finance-account-endpoints';
import { financeCategoryEndpoints } from './categories/finance-category-endpoints';
import { financeOverviewEndpoints } from './overview/finance-overview-endpoints';
import { financeTransactionEndpoints } from './transactions/finance-transaction-endpoints';
import { financeTransferEndpoints } from './transfers/finance-transfer-endpoints';

export const accountingApi = accountingBaseApi.injectEndpoints({
  endpoints: (build) => ({
    ...financeAccountEndpoints(build),
    ...financeCategoryEndpoints(build),
    ...financeOverviewEndpoints(build),
    ...financeTransactionEndpoints(build),
    ...financeTransferEndpoints(build),
  }),
});

export const {
  useCreateFinanceAccountMutation,
  useCreateFinanceCategoryMutation,
  useCreateFinanceTransactionMutation,
  useCreateFinanceTransferMutation,
  useDeleteFinanceAccountMutation,
  useDeleteFinanceCategoryMutation,
  useGetAccountingSettingsQuery,
  useGetFinanceAccountHistoryQuery,
  useGetFinanceAccountsQuery,
  useGetFinanceCategoriesQuery,
  useGetFinanceCategoryHistoryQuery,
  useGetFinanceOverviewQuery,
  useGetFinanceTransactionHistoryQuery,
  useGetFinanceTransactionsQuery,
  useGetFinanceTransferHistoryQuery,
  useGetFinanceTransfersQuery,
  useSetFinanceAccountActiveMutation,
  useSetFinanceAccountCutoverMutation,
  useUpdateFinanceAccountMutation,
  useUpdateFinanceCategoryMutation,
  useUpdateFinanceTransactionMutation,
  useUpdateFinanceTransferMutation,
  useVoidFinanceTransactionMutation,
  useVoidFinanceTransferMutation,
} = accountingApi;
