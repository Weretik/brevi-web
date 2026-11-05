import { financeOverviewTag } from '../../cache/accounting-tags';
import { accountingApiError } from '../../errors/accounting-api-error';
import { mapFinanceOverview } from '../../mappers/accounting-movement.mapper';

import type { AccountingEndpointBuilder } from '../accounting-endpoint-builder';
import type { FinanceOverview, LedgerScope } from '@admin/accounting/model';

export function financeOverviewEndpoints(build: AccountingEndpointBuilder) {
  return {
    /** «Огляд»; `scope` null counts both areas. */
    getFinanceOverview: build.query<
      FinanceOverview,
      { from: string; to: string; scope: LedgerScope | null }
    >({
      query: ({ from, to, scope }) => ({
        url: '/api/accounting/overview',
        params: scope ? { from, to, scope } : { from, to },
      }),
      transformResponse: mapFinanceOverview,
      transformErrorResponse: accountingApiError,
      providesTags: [financeOverviewTag],
    }),
  };
}
