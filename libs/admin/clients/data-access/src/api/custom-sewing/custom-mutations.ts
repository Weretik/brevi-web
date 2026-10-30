import { customAccessLoss } from '../../cache/custom-sewing/custom-access-loss';
import { customApiError } from '../../errors/custom-sewing/custom-api-error';
import { customConfigurationPayload } from '../../mappers/custom-sewing/custom-configuration.mapper';
import { mapCustomDetail } from '../../mappers/custom-sewing/custom-detail.mapper';

import type { CustomEndpointBuilder } from './custom-endpoint-builder';
import type { CustomConfiguration, CustomDetail } from '@admin/clients/model';
import type { operations } from '@admin/shared/contracts';

type Write = { id: string; revision: number; requestId: string };
const invalidate = (result: CustomDetail | undefined) =>
  result ? [{ type: 'CustomSewing' as const, id: result.id }] : [];
export function customMutations(build: CustomEndpointBuilder) {
  return {
    createCustomSewing: build.mutation<
      CustomDetail,
      {
        configuration: CustomConfiguration;
        requestId: string;
        quoteId?: string | null;
        customerId?: string | null;
      }
    >({
      query: ({ configuration, requestId, quoteId, customerId }) => ({
        url: '/api/crm/custom-sewing',
        method: 'POST',
        body: {
          requestId,
          configuration: customConfigurationPayload(configuration),
          customerPublicId: customerId ?? null,
          quotePublicId: quoteId ?? null,
        } satisfies operations['createCrmCustomSewingDraft']['requestBody']['content']['application/json'],
      }),
      transformResponse: mapCustomDetail,
      transformErrorResponse: customApiError,
      onQueryStarted: customAccessLoss,
      invalidatesTags: invalidate,
    }),
    saveCustomSewing: build.mutation<CustomDetail, Write & { configuration: CustomConfiguration }>({
      query: ({ id, revision, requestId, configuration }) => ({
        url: `/api/crm/custom-sewing/${encodeURIComponent(id)}`,
        method: 'PUT',
        body: {
          requestId,
          expectedRevision: revision,
          configuration: customConfigurationPayload(configuration),
        } satisfies operations['saveCrmCustomSewingDraft']['requestBody']['content']['application/json'],
      }),
      transformResponse: mapCustomDetail,
      transformErrorResponse: customApiError,
      onQueryStarted: customAccessLoss,
      invalidatesTags: invalidate,
    }),
    calculateCustomSewing: build.mutation<CustomDetail, Write>({
      query: ({ id, revision, requestId }) => ({
        url: `/api/crm/custom-sewing/${encodeURIComponent(id)}/calculations`,
        method: 'POST',
        body: {
          requestId,
          expectedRevision: revision,
        } satisfies operations['calculateCrmCustomSewing']['requestBody']['content']['application/json'],
      }),
      transformResponse: mapCustomDetail,
      transformErrorResponse: customApiError,
      onQueryStarted: customAccessLoss,
    }),
    saveCustomSewingVersion: build.mutation<CustomDetail, Write & { basisToken: string }>({
      query: ({ id, revision, requestId, basisToken }) => ({
        url: `/api/crm/custom-sewing/${encodeURIComponent(id)}/versions`,
        method: 'POST',
        body: {
          requestId,
          expectedRevision: revision,
          basisToken,
        } satisfies operations['saveCrmCustomSewingVersion']['requestBody']['content']['application/json'],
      }),
      transformResponse: mapCustomDetail,
      transformErrorResponse: customApiError,
      onQueryStarted: customAccessLoss,
      invalidatesTags: invalidate,
    }),
  };
}
