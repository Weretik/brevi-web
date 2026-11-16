import { apiCall, apiClient } from '@admin/shared/api-client';

import { leadsBaseApi } from './leads-base-api';
import { toLeadApiError } from '../errors/lead-api-error';
import { toSaveLeadCallResultInput } from '../mappers/lead-input.mapper';
import {
  mapLeadCallResult,
  mapLeadCallResults,
  mapLeadCategories,
  mapLeadCategory,
  mapLeadStats,
  mapLeadSync,
} from '../mappers/lead.mapper';

import type {
  LeadCallResult,
  LeadCallResultFormValues,
  LeadCategory,
  LeadStats,
  LeadSyncResult,
} from '@admin/leads/model';

const list = [{ type: 'LeadList' as const, id: 'LIST' }];
const references = [{ type: 'LeadReference' as const, id: 'LIST' }];

/** «Ліди»: statistics, call results and categories, and the sync with the old CRM. */
export const leadSettingsApi = leadsBaseApi.injectEndpoints({
  endpoints: (build) => ({
    getLeadStats: build.query<LeadStats, { from: string; to: string }>({
      queryFn: (params, { signal }) =>
        apiCall(
          apiClient.GET('/api/crm/lead-stats', { params: { query: params }, signal }),
          mapLeadStats,
          toLeadApiError,
        ),
      providesTags: list,
    }),
    getLeadStatsCallResults: build.query<readonly LeadCallResult[], void>({
      queryFn: (_arg, { signal }) =>
        apiCall(
          apiClient.GET('/api/crm/lead-stats/call-results', { signal }),
          mapLeadCallResults,
          toLeadApiError,
        ),
      providesTags: references,
    }),
    saveLeadCallResult: build.mutation<
      LeadCallResult,
      { id: number | null; values: LeadCallResultFormValues }
    >({
      queryFn: ({ id, values }, { signal }) => {
        const body = toSaveLeadCallResultInput(values);
        return apiCall(
          id
            ? apiClient.PUT('/api/crm/lead-stats/call-results/{id}', {
                params: { path: { id } },
                body,
                signal,
              })
            : apiClient.POST('/api/crm/lead-stats/call-results', { body, signal }),
          mapLeadCallResult,
          toLeadApiError,
        );
      },
      invalidatesTags: (_result, error) => (error ? [] : references),
    }),
    getLeadCategories: build.query<readonly LeadCategory[], void>({
      queryFn: (_arg, { signal }) =>
        apiCall(
          apiClient.GET('/api/crm/lead-stats/categories', { signal }),
          mapLeadCategories,
          toLeadApiError,
        ),
      providesTags: references,
    }),
    saveLeadCategory: build.mutation<LeadCategory, { code: string; description: string }>({
      queryFn: ({ code, description }, { signal }) =>
        apiCall(
          apiClient.PUT('/api/crm/lead-stats/categories/{code}', {
            params: { path: { code: code } },
            body: { description: description.trim() || null },
            signal,
          }),
          mapLeadCategory,
          toLeadApiError,
        ),
      invalidatesTags: (_result, error) => (error ? [] : [...references, ...list]),
    }),
    syncLeads: build.mutation<LeadSyncResult, void>({
      queryFn: (_arg, { signal }) =>
        apiCall(
          apiClient.POST('/api/crm/lead-stats/sync', { signal }),
          mapLeadSync,
          toLeadApiError,
        ),
      // A failed run is saved as the last sync error, so the statistics reload either way.
      invalidatesTags: (_result, error) => (error ? list : [...list, ...references]),
    }),
  }),
});

export const {
  useGetLeadCategoriesQuery,
  useGetLeadStatsCallResultsQuery,
  useGetLeadStatsQuery,
  useSaveLeadCallResultMutation,
  useSaveLeadCategoryMutation,
  useSyncLeadsMutation,
} = leadSettingsApi;
