import { adminApi, toAdminApiError } from '@admin/shared/api-client';

import { customAccessLoss } from '../../cache/custom-sewing/custom-access-loss';
import { mapCustomDetail } from '../../mappers/custom-sewing/custom-detail.mapper';
import { templatePayload } from '../../mappers/custom-templates/template-payload';
import { mapTemplateDetail, mapTemplatePage } from '../../mappers/custom-templates/template.mapper';
import { quoteId, quoteRecord, quoteText } from '../../validators/quotes/quote-response-values';

import type {
  CustomDetail,
  CustomTemplateDetail,
  CustomTemplatePage,
  CustomTemplateSelections,
} from '@admin/clients/model';
import type { operations } from '@admin/shared/contracts';

type Write = { requestId: string; introduction: string; selections: CustomTemplateSelections };
type Target = { id: string; revision: number; requestId: string };
const error = (value: unknown) =>
  toAdminApiError(value, {
    conflict: 'Шаблон змінено. Оновіть його перед повторною дією.',
    notFound: 'Шаблон не знайдено або доступ обмежено.',
    fallback: 'Дію з шаблоном не завершено.',
  });
const base = adminApi.enhanceEndpoints({ addTagTypes: ['CustomTemplates'] });
export const customTemplatesApi = base.injectEndpoints({
  endpoints: (build) => ({
    getCustomTemplates: build.query<CustomTemplatePage, { page: number; includeArchived: boolean }>(
      {
        query: (params) => ({
          url: '/api/crm/quote-templates',
          params: { ...params, pageSize: 25 },
        }),
        transformResponse: mapTemplatePage,
        transformErrorResponse: error,
        onQueryStarted: customAccessLoss,
        providesTags: [{ type: 'CustomTemplates', id: 'LIST' }],
      },
    ),
    getCustomTemplate: build.query<CustomTemplateDetail, { id: string; versionId?: string }>({
      query: ({ id, versionId }) => ({
        url: `/api/crm/quote-templates/${encodeURIComponent(id)}`,
        params: versionId ? { versionId } : {},
      }),
      transformResponse: mapTemplateDetail,
      transformErrorResponse: error,
      onQueryStarted: customAccessLoss,
      providesTags: (_r, _e, { id }) => [{ type: 'CustomTemplates', id }],
    }),
    createCustomTemplate: build.mutation<CustomTemplateDetail, Write>({
      query: ({ requestId, introduction, selections }) => ({
        url: '/api/crm/quote-templates',
        method: 'POST',
        body: {
          requestId,
          introduction,
          selections: templatePayload(selections),
          kind: 'customConfiguration',
        } satisfies operations['createCrmQuoteTemplate']['requestBody']['content']['application/json'],
      }),
      transformResponse: mapTemplateDetail,
      transformErrorResponse: error,
      onQueryStarted: customAccessLoss,
      invalidatesTags: (r) => (r ? [{ type: 'CustomTemplates', id: 'LIST' }] : []),
    }),
    reviseCustomTemplate: build.mutation<
      CustomTemplateDetail,
      Write & { id: string; revision: number }
    >({
      query: ({ id, revision, requestId, introduction, selections }) => ({
        url: `/api/crm/quote-templates/${encodeURIComponent(id)}`,
        method: 'PUT',
        body: {
          requestId,
          introduction,
          selections: templatePayload(selections),
          kind: 'customConfiguration',
          expectedRevision: revision,
        } satisfies operations['reviseCrmQuoteTemplate']['requestBody']['content']['application/json'],
      }),
      transformResponse: mapTemplateDetail,
      transformErrorResponse: error,
      onQueryStarted: customAccessLoss,
      invalidatesTags: (r) =>
        r
          ? [
              { type: 'CustomTemplates', id: 'LIST' },
              { type: 'CustomTemplates', id: r.id },
            ]
          : [],
    }),
    archiveCustomTemplate: build.mutation<CustomTemplateDetail, Target & { archived: boolean }>({
      query: ({ id, revision, requestId, archived }) => ({
        url: `/api/crm/quote-templates/${encodeURIComponent(id)}/archive`,
        method: 'PUT',
        body: {
          requestId,
          expectedRevision: revision,
          archived,
        } satisfies operations['setCrmQuoteTemplateArchived']['requestBody']['content']['application/json'],
      }),
      transformResponse: mapTemplateDetail,
      transformErrorResponse: error,
      onQueryStarted: customAccessLoss,
      invalidatesTags: (r) =>
        r
          ? [
              { type: 'CustomTemplates', id: 'LIST' },
              { type: 'CustomTemplates', id: r.id },
            ]
          : [],
    }),
    applyCustomTemplate: build.mutation<
      { draft: CustomDetail; introduction: string; versionId: string },
      Target & { versionId: string; customerId: string | null; quoteId: string | null }
    >({
      query: ({ id, revision, requestId, versionId, customerId, quoteId }) => ({
        url: `/api/crm/quote-templates/${encodeURIComponent(id)}/apply`,
        method: 'POST',
        body: {
          requestId,
          expectedRevision: revision,
          versionId,
          customerPublicId: customerId,
          quotePublicId: quoteId,
        } satisfies operations['applyCrmQuoteTemplate']['requestBody']['content']['application/json'],
      }),
      transformResponse: (value: unknown) => {
        const row = quoteRecord(value);
        return {
          draft: mapCustomDetail(row['draft']),
          introduction: quoteText(row['introduction']),
          versionId: quoteId(row['templateVersionId']),
        };
      },
      transformErrorResponse: error,
      onQueryStarted: customAccessLoss,
    }),
  }),
});
export const {
  useGetCustomTemplatesQuery,
  useGetCustomTemplateQuery,
  useCreateCustomTemplateMutation,
  useReviseCustomTemplateMutation,
  useArchiveCustomTemplateMutation,
  useApplyCustomTemplateMutation,
} = customTemplatesApi;
