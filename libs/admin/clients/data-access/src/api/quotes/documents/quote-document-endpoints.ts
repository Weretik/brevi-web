import { toAdminApiError } from '@admin/shared/api-client';

import { quoteAccessLoss } from '../../../cache/quotes/quote-access-loss';
import { quoteDocumentAccessLoss } from '../../../cache/quotes/quote-document-access-loss';
import { mapQuoteDetail } from '../../../mappers/quotes/quote-detail.mapper';

import type { QuoteEndpointBuilder } from '../quote-endpoint-builder';
import type { QuoteDetail } from '@admin/clients/model';
import type { components, operations } from '@admin/shared/contracts';

type PdfArtifact = components['schemas']['QuotePdfArtifact'];
type PrepareBody = operations['prepareCrmQuote']['requestBody']['content']['application/json'];
type RenderBody = operations['renderCrmQuotePdf']['requestBody']['content']['application/json'];
const documentError = (error: unknown) =>
  toAdminApiError(error, {
    conflict: 'Версія КП або його стан змінилися. Оновіть КП перед повтором.',
    notFound: 'КП або документ не знайдено чи доступ обмежено.',
    badRequest: 'Перевірте одержувача, ціни, реквізити та логотип КП.',
    fallback: 'Не вдалося виконати дію з документом КП.',
  });

export function quoteDocumentEndpoints(build: QuoteEndpointBuilder) {
  return {
    prepareQuote: build.mutation<QuoteDetail, { quoteId: string; body: PrepareBody }>({
      query: ({ quoteId, body }) => ({
        url: `/api/crm/quotes/${encodeURIComponent(quoteId)}/ready`,
        method: 'POST',
        body,
      }),
      transformResponse: (value: unknown, _meta, { quoteId, body }) => {
        const detail = mapQuoteDetail(value);
        if (
          detail.publicId !== quoteId ||
          detail.versionId !== body.versionId ||
          detail.state !== 'ready'
        )
          throw new Error('Некоректний результат підготовки КП.');
        return detail;
      },
      transformErrorResponse: documentError,
      invalidatesTags: (_result, error, { quoteId }) =>
        error
          ? []
          : [
              { type: 'Quote', id: quoteId },
              { type: 'Quote', id: 'LIST' },
            ],
      onQueryStarted: quoteAccessLoss,
    }),
    renderQuotePdf: build.mutation<PdfArtifact, { quoteId: string; body: RenderBody }>({
      query: ({ quoteId, body }) => ({
        url: `/api/crm/quotes/${encodeURIComponent(quoteId)}/documents`,
        method: 'POST',
        body,
      }),
      transformErrorResponse: documentError,
      onQueryStarted: quoteDocumentAccessLoss,
    }),
    getQuotePdfArtifact: build.query<PdfArtifact, { quoteId: string; artifactId: string }>({
      query: ({ quoteId, artifactId }) =>
        `/api/crm/quotes/${encodeURIComponent(quoteId)}/documents/${encodeURIComponent(artifactId)}`,
      transformErrorResponse: documentError,
      onQueryStarted: quoteDocumentAccessLoss,
      keepUnusedDataFor: 0,
    }),
  };
}
