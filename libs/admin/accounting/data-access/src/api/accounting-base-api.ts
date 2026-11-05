import { adminApi } from '@admin/shared/api-client';

export const accountingBaseApi = adminApi.enhanceEndpoints({
  addTagTypes: [
    'FinanceAccount',
    'FinanceCategory',
    'FinanceCounterparty',
    'FinanceHistory',
    'FinanceTransaction',
    'FinanceTransfer',
    'FinanceOverview',
  ],
});
