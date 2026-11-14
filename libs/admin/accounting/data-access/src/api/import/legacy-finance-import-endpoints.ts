import {
  financeAccountsTag,
  financeCategoriesTag,
  financeCounterpartyTags,
  financeMovementTags,
} from '../../cache/accounting-tags';
import { accountingApiError } from '../../errors/accounting-api-error';
import { mapLegacyFinanceImportReport } from '../../mappers/accounting-import.mapper';
import { compressFinanceFile } from '../files/compress-finance-file';

import type { AccountingEndpointBuilder } from '../accounting-endpoint-builder';
import type { LegacyFinanceImportReport } from '@admin/accounting/model';

export function legacyFinanceImportEndpoints(build: AccountingEndpointBuilder) {
  return {
    /** «Перенесення архіву»: a check (`dryRun`) or the move of the old Calculator «Фінанси». */
    importLegacyFinance: build.mutation<LegacyFinanceImportReport, { file: File; dryRun: boolean }>(
      {
        queryFn: async ({ file, dryRun }, _api, _extra, baseQuery) => {
          const body = new FormData();
          body.append('file', await compressFinanceFile(file), file.name);
          const result = await baseQuery({
            url: '/api/accounting/legacy-import',
            method: 'POST',
            params: { dryRun },
            body,
          });
          if (result.error) return { error: accountingApiError(result.error) };
          try {
            return { data: mapLegacyFinanceImportReport(result.data) };
          } catch (error) {
            return { error: accountingApiError(error) };
          }
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
