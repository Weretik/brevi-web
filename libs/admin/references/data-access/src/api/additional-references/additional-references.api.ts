import { adminApi, toAdminApiError } from '@admin/shared/api-client';

import { mapAdditionalReferences } from '../../mappers/additional-references/additional-references.mapper';
import { referenceErrorMessages } from '../shared/reference-api.shared';

import type { operations } from '@admin/shared/contracts';

type AdditionalReferenceBody =
  operations['updateAdditionalReference']['requestBody']['content']['application/json'];

export const additionalReferencesApi = adminApi.injectEndpoints({
  endpoints: (build) => ({
    listAdditionalReferences: build.query<ReturnType<typeof mapAdditionalReferences>, void>({
      query: () => '/api/reference/additional-references',
      transformResponse: mapAdditionalReferences,
      transformErrorResponse: (error) => toAdminApiError(error, referenceErrorMessages),
      providesTags: [{ type: 'AdditionalReference', id: 'LIST' }],
    }),
    updateAdditionalReference: build.mutation<void, { id: number; body: AdditionalReferenceBody }>({
      query: ({ id, body }) => ({
        url: `/api/reference/additional-references/${id}`,
        method: 'PUT',
        body,
      }),
      transformErrorResponse: (error) => toAdminApiError(error, referenceErrorMessages),
      invalidatesTags: (_result, error) =>
        error ? [] : [{ type: 'AdditionalReference', id: 'LIST' }],
    }),
  }),
});

export const { useListAdditionalReferencesQuery, useUpdateAdditionalReferenceMutation } =
  additionalReferencesApi;
