import { accountingBaseApi } from './accounting-base-api';
import { financeAccountEndpoints } from './accounts/finance-account-endpoints';
import { financeAttachmentEndpoints } from './attachments/finance-attachment-endpoints';
import { financeCategoryEndpoints } from './categories/finance-category-endpoints';
import { financeCounterpartyEndpoints } from './counterparties/finance-counterparty-endpoints';
import { financeOverviewEndpoints } from './overview/finance-overview-endpoints';
import { financeTransactionEndpoints } from './transactions/finance-transaction-endpoints';
import { financeTransferEndpoints } from './transfers/finance-transfer-endpoints';

export const accountingApi = accountingBaseApi.injectEndpoints({
  endpoints: (build) => ({
    ...financeAccountEndpoints(build),
    ...financeAttachmentEndpoints(build),
    ...financeCategoryEndpoints(build),
    ...financeCounterpartyEndpoints(build),
    ...financeOverviewEndpoints(build),
    ...financeTransactionEndpoints(build),
    ...financeTransferEndpoints(build),
  }),
});

export const {
  useArchiveFinanceCounterpartyMutation,
  useCreateFinanceAccountMutation,
  useCreateFinanceCategoryMutation,
  useCreateFinanceCounterpartyMutation,
  useCreateFinanceTransactionMutation,
  useCreateFinanceTransferMutation,
  useDeleteFinanceAccountMutation,
  useDeleteFinanceAttachmentMutation,
  useDeleteFinanceCategoryMutation,
  useGetAccountingSettingsQuery,
  useGetFinanceAccountHistoryQuery,
  useGetFinanceAccountsQuery,
  useGetFinanceAttachmentsQuery,
  useGetFinanceCategoriesQuery,
  useGetFinanceCategoryHistoryQuery,
  useGetFinanceCounterpartiesQuery,
  useGetFinanceCounterpartyChoicesQuery,
  useGetFinanceCounterpartyHistoryQuery,
  useGetFinanceOverviewQuery,
  useGetFinanceTransactionHistoryQuery,
  useGetFinanceTransactionsQuery,
  useGetFinanceTransferHistoryQuery,
  useGetFinanceTransfersQuery,
  useMergeFinanceCounterpartyMutation,
  usePromoteFinanceOneoffMutation,
  useRestoreFinanceCounterpartyMutation,
  useReviewFinanceTransactionMutation,
  useSetFinanceAccountActiveMutation,
  useSetFinanceAccountCutoverMutation,
  useUpdateFinanceAccountMutation,
  useUpdateFinanceCategoryMutation,
  useUpdateFinanceCounterpartyMutation,
  useUpdateFinanceTransactionMutation,
  useUpdateFinanceTransferMutation,
  useUploadFinanceAttachmentMutation,
  useVerifyFinanceCounterpartyMutation,
  useVoidFinanceTransactionMutation,
  useVoidFinanceTransferMutation,
} = accountingApi;
