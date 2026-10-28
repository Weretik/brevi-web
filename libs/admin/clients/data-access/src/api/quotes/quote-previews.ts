import { quoteApiError } from '../../errors/quotes/quote-api-error';
import { quotePriceIntent } from '../../mappers/quotes/quote-price-intent';
import { mapQuoteBasis } from '../../mappers/quotes/quote-price.mapper';

import type { QuoteEndpointBuilder } from './quote-endpoint-builder';
import type { QuotePriceBasis, QuotePriceSelection } from '@admin/clients/model';
import type { operations } from '@admin/shared/contracts';

export function quotePreviews(build: QuoteEndpointBuilder) {
  return {
    previewQuotePrices: build.mutation<
      QuotePriceBasis,
      { quoteId?: string; selection: QuotePriceSelection; requestId: string }
    >({
      query: ({ quoteId, selection, requestId }) => ({
        url: '/api/crm/quotes/price-previews',
        method: 'POST',
        body: {
          requestId,
          quoteId: quoteId ?? null,
          intent: quotePriceIntent(selection),
        } satisfies operations['previewCrmQuotePrices']['requestBody']['content']['application/json'],
      }),
      transformResponse: mapQuoteBasis,
      transformErrorResponse: quoteApiError,
    }),
  };
}
