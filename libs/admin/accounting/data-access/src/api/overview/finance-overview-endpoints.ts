import { apiCall, apiClient } from '@admin/shared/api-client';

import { financeOverviewTag } from '../../cache/accounting-tags';
import { accountingApiError } from '../../errors/accounting-api-error';
import { mapFinanceOverview } from '../../mappers/ledger/accounting-movement.mapper';

import type { AccountingEndpointBuilder } from '../base/accounting-endpoint-builder';
import type { FinanceOverview, LedgerScope } from '@admin/accounting/model';

export function financeOverviewEndpoints(build: AccountingEndpointBuilder) {
  return {
    /** «Огляд»; `scope` null counts both areas. */
    getFinanceOverview: build.query<
      FinanceOverview,
      { from: string; to: string; scope: LedgerScope | null }
    >({
      queryFn: ({ from, to, scope }, { signal }) =>
        apiCall(
          apiClient.GET('/api/accounting/overview', {
            params: { query: scope ? { from, to, scope } : { from, to } },
            signal,
          }),
          mapFinanceOverview,
          accountingApiError,
        ),
      providesTags: [financeOverviewTag],
    }),
  };
}
