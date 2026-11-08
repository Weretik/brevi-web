import { accountingBaseApi } from './accounting-base-api';
import { financeAccountEndpoints } from './accounts/finance-account-endpoints';
import { financeAttachmentEndpoints } from './attachments/finance-attachment-endpoints';
import { financeCategoryEndpoints } from './categories/finance-category-endpoints';
import { financeCounterpartyEndpoints } from './counterparties/finance-counterparty-endpoints';
import { legacyFinanceImportEndpoints } from './import/legacy-finance-import-endpoints';
import { financeOverviewEndpoints } from './overview/finance-overview-endpoints';
import { bankStatementEndpoints } from './statements/bank-statement-endpoints';
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
    ...legacyFinanceImportEndpoints(build),
    ...bankStatementEndpoints(build),
  }),
});

export const {
  useBookBankStatementMutation,
  useGetBankStatementQuery,
  useGetBankStatementsQuery,
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
  useImportLegacyFinanceMutation,
  useMergeFinanceCounterpartyMutation,
  usePromoteFinanceOneoffMutation,
  useRestoreFinanceCounterpartyMutation,
  useRollbackBankStatementMutation,
  useReviewFinanceTransactionMutation,
  useSetFinanceAccountActiveMutation,
  useSetFinanceAccountCutoverMutation,
  useUpdateBankStatementLineMutation,
  useUpdateFinanceAccountMutation,
  useUpdateFinanceCategoryMutation,
  useUpdateFinanceCounterpartyMutation,
  useUpdateFinanceTransactionMutation,
  useUpdateFinanceTransferMutation,
  useUploadBankStatementMutation,
  useUploadFinanceAttachmentMutation,
  useVerifyFinanceCounterpartyMutation,
  useVoidFinanceTransactionMutation,
  useVoidFinanceTransferMutation,
} = accountingApi;
