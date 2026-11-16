import { apiCall, apiClient, formDataBody } from '@admin/shared/api-client';

import {
  financeAccountsTag,
  financeCategoriesTag,
  financeCounterpartyTags,
  financeMovementTags,
} from '../../cache/accounting-tags';
import { accountingApiError } from '../../errors/accounting-api-error';
import { mapLegacyFinanceImportReport } from '../../mappers/imports/accounting-import.mapper';
import { compressFinanceFile } from '../files/compress-finance-file';

import type { AccountingEndpointBuilder } from '../base/accounting-endpoint-builder';
import type { LegacyFinanceImportReport } from '@admin/accounting/model';

export function legacyFinanceImportEndpoints(build: AccountingEndpointBuilder) {
  return {
    /** «Перенесення архіву»: a check (`dryRun`) or the move of the old Calculator «Фінанси». */
    importLegacyFinance: build.mutation<LegacyFinanceImportReport, { file: File; dryRun: boolean }>(
      {
        queryFn: async ({ file, dryRun }, { signal }) => {
          const compressed = new File([await compressFinanceFile(file)], file.name);
          return apiCall(
            apiClient.POST('/api/accounting/legacy-import', {
              params: { query: { dryRun } },
              ...formDataBody({ file: compressed }),
              signal,
            }),
            mapLegacyFinanceImportReport,
            accountingApiError,
          );
        },
        /** A move fills every list of «Бухгалтерія». */
        invalidatesTags: (report) =>
          report?.applied
            ? [
                ...financeMovementTags,
                ...financeCounterpartyTags,
                financeAccountsTag,
                financeCategoriesTag,
              ]
            : [],
      },
    ),
  };
}
