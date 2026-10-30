import { quoteDocumentApi, quoteDocumentError, documentQuoteUrl } from './quote-document-api';
import { quoteDocumentAccessLoss } from '../../cache/quotes/quote-document-access-loss';
import { mapProductionPackage } from '../../mappers/documents/production-package.mapper';

import type { ProductionPackageView } from '@admin/clients/model';
import type { operations } from '@admin/shared/contracts';

const url = (quoteId: string) => `${documentQuoteUrl(quoteId)}/production-packages`;
export const productionPackageApi = quoteDocumentApi.injectEndpoints({
  endpoints: (build) => ({
    exportQuoteProduction: build.mutation<
      ProductionPackageView,
      { quoteId: string; versionId: string; requestId: string; selectedVariantIds: string[] }
    >({
      query: ({ quoteId, versionId, requestId, selectedVariantIds }) => ({
        url: url(quoteId),
        method: 'POST',
        body: {
          requestId,
          versionId,
          variantIds: selectedVariantIds,
        } satisfies operations['exportCrmProductionPackage']['requestBody']['content']['application/json'],
      }),
      transformResponse: (value: unknown, _meta, { quoteId, versionId }) => {
        const row = mapProductionPackage(value);
        if (row.quoteId !== quoteId || row.versionId !== versionId)
          throw new Error('Інша версія виробничого архіву.');
        return row;
      },
      transformErrorResponse: quoteDocumentError,
      onQueryStarted: quoteDocumentAccessLoss,
    }),
    getQuoteProduction: build.query<ProductionPackageView, { quoteId: string; packageId: string }>({
      query: ({ quoteId, packageId }) => `${url(quoteId)}/${encodeURIComponent(packageId)}`,
      transformResponse: (value: unknown, _meta, { quoteId, packageId }) => {
        const row = mapProductionPackage(value);
        if (row.quoteId !== quoteId || row.id !== packageId)
          throw new Error('Інший виробничий архів.');
        return row;
      },
      transformErrorResponse: quoteDocumentError,
      keepUnusedDataFor: 0,
      onQueryStarted: quoteDocumentAccessLoss,
    }),
  }),
});
export const { useExportQuoteProductionMutation, useLazyGetQuoteProductionQuery } =
  productionPackageApi;
