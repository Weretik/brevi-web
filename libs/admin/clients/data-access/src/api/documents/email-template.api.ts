import { toAdminApiError } from '@admin/shared/api-client';

import { emailTemplateAccessLoss } from './email-template-access-loss';
import { quoteDocumentApi } from './quote-document-api';
import {
  mapEmailTemplateDetail,
  mapEmailTemplateSettings,
  mapEmailTemplatePage,
} from '../../mappers/documents/email-template-registry.mapper';
import { mapActiveEmailTemplate } from '../../mappers/documents/email-template.mapper';

import type {
  EmailTemplateView,
  EmailTemplateDetailView,
  EmailTemplateSettingsView,
  EmailTemplatePageView,
} from '@admin/clients/model';
import type { operations } from '@admin/shared/contracts';

type CreateEmailTemplateBody =
  operations['createCrmEmailTemplateVersion']['requestBody']['content']['application/json'];
type ActivateEmailTemplateBody =
  operations['activateCrmEmailTemplate']['requestBody']['content']['application/json'];
const root = '/api/crm/email-templates';
const registryTags = [{ type: 'EmailTemplate' as const, id: 'REGISTRY' }];
const emailTemplateError = (error: unknown) =>
  toAdminApiError(error, {
    conflict: 'Налаштування листів змінилися. Оновіть дані перед активацією.',
    notFound: 'Версію шаблону листа не знайдено або доступ обмежено.',
    badRequest: 'Перевірте назву, тему, текст і дозволені підстановки листа.',
    fallback: 'Не вдалося виконати дію з шаблоном листа.',
  });

export const quoteEmailTemplateApi = quoteDocumentApi
  .enhanceEndpoints({ addTagTypes: ['EmailTemplate'] })
  .injectEndpoints({
    endpoints: (build) => ({
      getActiveQuoteEmailTemplate: build.query<EmailTemplateView | null, void>({
        query: () => `${root}/active`,
        transformResponse: mapActiveEmailTemplate,
        transformErrorResponse: emailTemplateError,
        providesTags: registryTags,
        keepUnusedDataFor: 0,
        onQueryStarted: emailTemplateAccessLoss,
      }),
      getQuoteEmailTemplates: build.query<
        EmailTemplatePageView,
        { page: number; pageSize?: number }
      >({
        query: ({ page, pageSize = 25 }) => ({
          url: root,
          params: { page, pageSize } satisfies NonNullable<
            operations['getCrmEmailTemplates']['parameters']['query']
          >,
        }),
        transformResponse: (value: unknown, _meta, { page, pageSize = 25 }) => {
          const result = mapEmailTemplatePage(value);
          if (result.page !== page || result.pageSize !== pageSize)
            throw new Error('Отримано іншу сторінку шаблонів листів.');
          return result;
        },
        providesTags: registryTags,
        transformErrorResponse: emailTemplateError,
        keepUnusedDataFor: 0,
        onQueryStarted: emailTemplateAccessLoss,
      }),
      getQuoteEmailTemplate: build.query<EmailTemplateDetailView, { id: string }>({
        query: ({ id }) => `${root}/${encodeURIComponent(id)}`,
        transformResponse: (value: unknown, _meta, { id }) => {
          const result = mapEmailTemplateDetail(value);
          if (result.id.toLowerCase() !== id.toLowerCase())
            throw new Error('Отримано іншу версію шаблону листа.');
          return result;
        },
        transformErrorResponse: emailTemplateError,
        keepUnusedDataFor: 0,
        onQueryStarted: emailTemplateAccessLoss,
      }),
      getQuoteEmailTemplateSettings: build.query<EmailTemplateSettingsView, void>({
        query: () => `${root}/active`,
        transformResponse: mapEmailTemplateSettings,
        providesTags: registryTags,
        transformErrorResponse: emailTemplateError,
        keepUnusedDataFor: 0,
        onQueryStarted: emailTemplateAccessLoss,
      }),
      createQuoteEmailTemplate: build.mutation<EmailTemplateDetailView, CreateEmailTemplateBody>({
        query: (body) => ({ url: `${root}/versions`, method: 'POST', body }),
        transformResponse: mapEmailTemplateDetail,
        invalidatesTags: (_result, error) => (error ? [] : registryTags),
        transformErrorResponse: emailTemplateError,
        onQueryStarted: emailTemplateAccessLoss,
      }),
      activateQuoteEmailTemplate: build.mutation<
        EmailTemplateSettingsView,
        ActivateEmailTemplateBody
      >({
        query: (body) => ({ url: `${root}/active`, method: 'PUT', body }),
        transformResponse: (value: unknown, _meta, { versionId }) => {
          const result = mapEmailTemplateSettings(value);
          if (result.active?.id.toLowerCase() !== versionId.toLowerCase())
            throw new Error('Активовано іншу версію шаблону листа.');
          return result;
        },
        invalidatesTags: (_result, error) => (error ? [] : registryTags),
        transformErrorResponse: emailTemplateError,
        onQueryStarted: emailTemplateAccessLoss,
      }),
    }),
  });
export const {
  useGetActiveQuoteEmailTemplateQuery,
  useGetQuoteEmailTemplatesQuery,
  useLazyGetQuoteEmailTemplateQuery,
  useGetQuoteEmailTemplateSettingsQuery,
  useCreateQuoteEmailTemplateMutation,
  useActivateQuoteEmailTemplateMutation,
} = quoteEmailTemplateApi;
