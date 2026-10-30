import { customApiError } from '../../errors/custom-sewing/custom-api-error';
import { mapCustomSuggestions } from '../../mappers/custom-suggestions/custom-suggestions.mapper';
import { customBaseApi } from '../custom-sewing/custom-base-api';

import type { CustomSuggestionProductType, CustomSuggestions } from '@admin/clients/model';
import type { operations } from '@admin/shared/contracts';

export const customSuggestionsApi = customBaseApi.injectEndpoints({
  endpoints: (build) => ({
    getCustomSuggestions: build.query<
      CustomSuggestions,
      { productType: CustomSuggestionProductType; season: 'summer' | 'winter' }
    >({
      query: (params) => ({
        url: '/api/crm/custom-sewing/suggestions',
        params: params satisfies operations['getCrmSewingSuggestions']['parameters']['query'],
      }),
      transformResponse: mapCustomSuggestions,
      transformErrorResponse: customApiError,
    }),
  }),
});
export const { useGetCustomSuggestionsQuery } = customSuggestionsApi;
