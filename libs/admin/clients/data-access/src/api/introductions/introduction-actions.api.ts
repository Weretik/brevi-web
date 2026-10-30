import {
  introductionBaseApi,
  introductionMappingAccessLoss,
  introductionError,
  introductionUrl,
} from './introduction-base';
import { customAccessLoss } from '../../cache/custom-sewing/custom-access-loss';
import { mapIntroductionMapping } from '../../mappers/introductions/introduction.mapper';
import { mapQuoteDetail } from '../../mappers/quotes/quote-detail.mapper';

import type {
  IntroductionApply,
  IntroductionFeaturedMapping,
  IntroductionMappingActivation,
  QuoteDetail,
} from '@admin/clients/model';
import type { operations } from '@admin/shared/contracts';

const mappingUrl = '/api/crm/introductions/featured-mapping';
export const introductionActionsApi = introductionBaseApi.injectEndpoints({
  endpoints: (build) => ({
    applyIntroductionTemplate: build.mutation<QuoteDetail, IntroductionApply>({
      query: ({ id, requestId, versionId, customerId, contactId, recipientName }) => ({
        url: `${introductionUrl(id)}/apply`,
        method: 'POST',
        body: {
          requestId,
          versionId,
          customerPublicId: customerId,
          contactPublicId: contactId,
          recipientName,
        } satisfies operations['applyCrmIntroductionTemplate']['requestBody']['content']['application/json'],
      }),
      transformResponse: mapQuoteDetail,
      transformErrorResponse: introductionError,
      onQueryStarted: customAccessLoss,
      invalidatesTags: (result) => (result ? [{ type: 'Quote', id: 'LIST' }] : []),
    }),
    getIntroductionFeaturedMapping: build.query<IntroductionFeaturedMapping, void>({
      query: () => mappingUrl,
      transformResponse: mapIntroductionMapping,
      transformErrorResponse: introductionError,
      onQueryStarted: introductionMappingAccessLoss,
      providesTags: [{ type: 'IntroductionMapping', id: 'ACTIVE' }],
    }),
    activateIntroductionFeaturedMapping: build.mutation<
      IntroductionFeaturedMapping,
      IntroductionMappingActivation
    >({
      query: (body) => ({
        url: mappingUrl,
        method: 'PUT',
        body: body satisfies operations['activateCrmIntroductionFeaturedMapping']['requestBody']['content']['application/json'],
      }),
      transformResponse: mapIntroductionMapping,
      transformErrorResponse: introductionError,
      onQueryStarted: customAccessLoss,
      invalidatesTags: (result) =>
        result
          ? [
              { type: 'IntroductionMapping', id: 'ACTIVE' },
              { type: 'IntroductionTemplates', id: 'LIST' },
            ]
          : [],
    }),
  }),
});
export const {
  useApplyIntroductionTemplateMutation,
  useGetIntroductionFeaturedMappingQuery,
  useActivateIntroductionFeaturedMappingMutation,
} = introductionActionsApi;
