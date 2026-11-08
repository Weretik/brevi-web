import { adminApi } from '@admin/shared/api-client';

export const accountingBaseApi = adminApi.enhanceEndpoints({
  addTagTypes: [
    'BankStatement',
    'FinanceAccount',
    'FinanceAttachment',
    'FinanceCategory',
    'FinanceCounterparty',
    'FinanceHistory',
    'FinanceTransaction',
    'FinanceTransfer',
    'FinanceOverview',
  ],
});
