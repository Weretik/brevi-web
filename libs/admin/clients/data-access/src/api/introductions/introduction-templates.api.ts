import {
  introductionBaseApi,
  introductionError,
  introductionRoot,
  introductionUrl,
} from './introduction-base';
import { customAccessLoss } from '../../cache/custom-sewing/custom-access-loss';
import {
  mapIntroductionDetail,
  mapIntroductionPage,
  mapIntroductionPrepared,
} from '../../mappers/introductions/introduction.mapper';

import type {
  IntroductionTemplateDetail,
  IntroductionTemplatePage,
  IntroductionTemplateWrite,
  IntroductionPreparedDraft,
} from '@admin/clients/model';
import type { operations } from '@admin/shared/contracts';

type Target = { id: string; revision: number; requestId: string };
const payload = (value: IntroductionTemplateWrite) =>
  ({
    requestId: value.requestId,
    name: value.name,
    layout: value.format,
    emailTemplateVersionId: value.emailTemplateVersionId,
    selections: value.selections,
  }) satisfies operations['createCrmIntroductionTemplate']['requestBody']['content']['application/json'];
const tags = (result: IntroductionTemplateDetail | undefined) =>
  result
    ? [
        { type: 'IntroductionTemplates' as const, id: 'LIST' },
        { type: 'IntroductionTemplates' as const, id: result.id },
      ]
    : [];
export const introductionTemplatesApi = introductionBaseApi.injectEndpoints({
  endpoints: (build) => ({
    getIntroductionTemplates: build.query<
      IntroductionTemplatePage,
      { page: number; includeArchived: boolean }
    >({
      query: (params) => ({ url: introductionRoot, params: { ...params, pageSize: 25 } }),
      transformResponse: mapIntroductionPage,
      transformErrorResponse: introductionError,
      onQueryStarted: customAccessLoss,
      providesTags: [{ type: 'IntroductionTemplates', id: 'LIST' }],
    }),
    getIntroductionTemplate: build.query<
      IntroductionTemplateDetail,
      { id: string; versionId?: string }
    >({
      query: ({ id, versionId }) => ({
        url: introductionUrl(id),
        params: versionId ? { versionId } : {},
      }),
      transformResponse: mapIntroductionDetail,
      transformErrorResponse: introductionError,
      onQueryStarted: customAccessLoss,
      providesTags: (_r, _e, { id }) => [{ type: 'IntroductionTemplates', id }],
    }),
    createIntroductionTemplate: build.mutation<
      IntroductionTemplateDetail,
      IntroductionTemplateWrite
    >({
      query: (value) => ({ url: introductionRoot, method: 'POST', body: payload(value) }),
      transformResponse: mapIntroductionDetail,
      transformErrorResponse: introductionError,
      onQueryStarted: customAccessLoss,
      invalidatesTags: tags,
    }),
    reviseIntroductionTemplate: build.mutation<
      IntroductionTemplateDetail,
      IntroductionTemplateWrite & { id: string; revision: number }
    >({
      query: (value) => ({
        url: introductionUrl(value.id),
        method: 'PUT',
        body: {
          ...payload(value),
          expectedRevision: value.revision,
        } satisfies operations['reviseCrmIntroductionTemplate']['requestBody']['content']['application/json'],
      }),
      transformResponse: mapIntroductionDetail,
      transformErrorResponse: introductionError,
      onQueryStarted: customAccessLoss,
      invalidatesTags: tags,
    }),
    archiveIntroductionTemplate: build.mutation<
      IntroductionTemplateDetail,
      Target & { archived: boolean }
    >({
      query: ({ id, revision, requestId, archived }) => ({
        url: `${introductionUrl(id)}/archive`,
        method: 'PUT',
        body: {
          requestId,
          expectedRevision: revision,
          archived,
        } satisfies operations['setCrmIntroductionTemplateArchived']['requestBody']['content']['application/json'],
      }),
      transformResponse: mapIntroductionDetail,
      transformErrorResponse: introductionError,
      onQueryStarted: customAccessLoss,
      invalidatesTags: tags,
    }),
    checkIntroductionTemplate: build.query<
      IntroductionPreparedDraft,
      { id: string; versionId?: string }
    >({
      query: ({ id, versionId }) => ({
        url: `${introductionUrl(id)}/check`,
        params: versionId ? { versionId } : {},
      }),
      transformResponse: mapIntroductionPrepared,
      transformErrorResponse: introductionError,
      onQueryStarted: customAccessLoss,
      keepUnusedDataFor: 0,
      providesTags: (_r, _e, { id }) => [
        { type: 'IntroductionTemplates', id },
        { type: 'IntroductionMapping', id: 'ACTIVE' },
      ],
    }),
  }),
});
export const {
  useGetIntroductionTemplatesQuery,
  useGetIntroductionTemplateQuery,
  useLazyGetIntroductionTemplateQuery,
  useCreateIntroductionTemplateMutation,
  useReviseIntroductionTemplateMutation,
  useArchiveIntroductionTemplateMutation,
  useLazyCheckIntroductionTemplateQuery,
} = introductionTemplatesApi;
