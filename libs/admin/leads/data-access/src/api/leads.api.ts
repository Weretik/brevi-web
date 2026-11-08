import { leadsBaseApi } from './leads-base-api';
import { toLeadApiError } from '../errors/lead-api-error';
import { toRecordLeadCallInput, toSaveLeadCallResultInput } from '../mappers/lead-input.mapper';
import {
  mapLeadCallResult,
  mapLeadCallResults,
  mapLeadCategories,
  mapLeadCategory,
  mapLeadDetail,
  mapLeadMyDay,
  mapLeadPage,
  mapLeadStats,
  mapLeadSync,
} from '../mappers/lead.mapper';

import type {
  LeadCallFormValues,
  LeadCallResult,
  LeadCallResultFormValues,
  LeadCategory,
  LeadDetail,
  LeadListQuery,
  LeadMyDay,
  LeadPage,
  LeadStats,
  LeadSyncResult,
} from '@admin/leads/model';

const list = [{ type: 'LeadList' as const, id: 'LIST' }];
const references = [{ type: 'LeadReference' as const, id: 'LIST' }];

/** Taking, giving back and a call refresh the lists, the lead and «Мої завдання». */
const changed = (error: unknown, id: number) =>
  error
    ? []
    : [...list, { type: 'Lead' as const, id }, { type: 'ManagerTaskList' as const, id: 'LIST' }];

export const leadsApi = leadsBaseApi.injectEndpoints({
  endpoints: (build) => ({
    listLeads: build.query<LeadPage, LeadListQuery>({
      query: (query) => ({
        url: '/api/crm/leads',
        params: {
          search: query.search.trim() || undefined,
          scope: query.scope,
          category: query.category ?? undefined,
          page: query.page,
          pageSize: query.pageSize,
        },
      }),
      transformResponse: mapLeadPage,
      transformErrorResponse: toLeadApiError,
      providesTags: list,
    }),
    getLeadMyDay: build.query<LeadMyDay, void>({
      query: () => '/api/crm/leads/my-day',
      transformResponse: mapLeadMyDay,
      transformErrorResponse: toLeadApiError,
      providesTags: list,
    }),
    getLeadCallResults: build.query<readonly LeadCallResult[], void>({
      query: () => '/api/crm/leads/call-results',
      transformResponse: mapLeadCallResults,
      transformErrorResponse: toLeadApiError,
      providesTags: references,
    }),
    getLead: build.query<LeadDetail, number>({
      query: (id) => `/api/crm/leads/${id}`,
      transformResponse: mapLeadDetail,
      transformErrorResponse: toLeadApiError,
      providesTags: (_result, _error, id) => [{ type: 'Lead', id }],
    }),
    takeLead: build.mutation<LeadDetail, number>({
      query: (id) => ({ url: `/api/crm/leads/${id}/take`, method: 'POST' }),
      transformResponse: mapLeadDetail,
      transformErrorResponse: toLeadApiError,
      invalidatesTags: (_result, error, id) => changed(error, id),
    }),
    releaseLead: build.mutation<LeadDetail, { id: number; version: number }>({
      query: ({ id, version }) => ({
        url: `/api/crm/leads/${id}/release`,
        method: 'POST',
        params: { version },
      }),
      transformResponse: mapLeadDetail,
      transformErrorResponse: toLeadApiError,
      invalidatesTags: (_result, error, { id }) => changed(error, id),
    }),
    recordLeadCall: build.mutation<
      LeadDetail,
      { id: number; version: number; values: LeadCallFormValues }
    >({
      query: ({ id, version, values }) => ({
        url: `/api/crm/leads/${id}/calls`,
        method: 'POST',
        body: toRecordLeadCallInput(values, version),
      }),
      transformResponse: mapLeadDetail,
      transformErrorResponse: toLeadApiError,
      invalidatesTags: (_result, error, { id }) => changed(error, id),
    }),
    getLeadStats: build.query<LeadStats, { from: string; to: string }>({
      query: (params) => ({ url: '/api/crm/lead-stats', params }),
      transformResponse: mapLeadStats,
      transformErrorResponse: toLeadApiError,
      providesTags: list,
    }),
    getLeadStatsCallResults: build.query<readonly LeadCallResult[], void>({
      query: () => '/api/crm/lead-stats/call-results',
      transformResponse: mapLeadCallResults,
      transformErrorResponse: toLeadApiError,
      providesTags: references,
    }),
    saveLeadCallResult: build.mutation<
      LeadCallResult,
      { id: number | null; values: LeadCallResultFormValues }
    >({
      query: ({ id, values }) => ({
        url: id ? `/api/crm/lead-stats/call-results/${id}` : '/api/crm/lead-stats/call-results',
        method: id ? 'PUT' : 'POST',
        body: toSaveLeadCallResultInput(values),
      }),
      transformResponse: mapLeadCallResult,
      transformErrorResponse: toLeadApiError,
      invalidatesTags: (_result, error) => (error ? [] : references),
    }),
    getLeadCategories: build.query<readonly LeadCategory[], void>({
      query: () => '/api/crm/lead-stats/categories',
      transformResponse: mapLeadCategories,
      transformErrorResponse: toLeadApiError,
      providesTags: references,
    }),
    saveLeadCategory: build.mutation<LeadCategory, { code: string; description: string }>({
      query: ({ code, description }) => ({
        url: `/api/crm/lead-stats/categories/${encodeURIComponent(code)}`,
        method: 'PUT',
        body: { description: description.trim() || null },
      }),
      transformResponse: mapLeadCategory,
      transformErrorResponse: toLeadApiError,
      invalidatesTags: (_result, error) => (error ? [] : [...references, ...list]),
    }),
    syncLeads: build.mutation<LeadSyncResult, void>({
      query: () => ({ url: '/api/crm/lead-stats/sync', method: 'POST' }),
      transformResponse: mapLeadSync,
      transformErrorResponse: toLeadApiError,
      // A failed run is saved as the last sync error, so the statistics reload either way.
      invalidatesTags: (_result, error) => (error ? list : [...list, ...references]),
    }),
  }),
});

export const {
  useGetLeadCallResultsQuery,
  useGetLeadCategoriesQuery,
  useGetLeadMyDayQuery,
  useGetLeadQuery,
  useGetLeadStatsCallResultsQuery,
  useGetLeadStatsQuery,
  useListLeadsQuery,
  useRecordLeadCallMutation,
  useReleaseLeadMutation,
  useSaveLeadCallResultMutation,
  useSaveLeadCategoryMutation,
  useSyncLeadsMutation,
  useTakeLeadMutation,
} = leadsApi;
