import { apiCall, apiClient } from '@admin/shared/api-client';

import { leadsBaseApi } from './leads-base-api';
import { toLeadApiError } from '../errors/lead-api-error';
import { toRecordLeadCallInput } from '../mappers/lead-input.mapper';
import {
  mapLeadCallResults,
  mapLeadDetail,
  mapLeadMyDay,
  mapLeadPage,
} from '../mappers/lead.mapper';

import type {
  LeadCallFormValues,
  LeadCallResult,
  LeadDetail,
  LeadListQuery,
  LeadMyDay,
  LeadPage,
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
      queryFn: (query, { signal }) =>
        apiCall(
          apiClient.GET('/api/crm/leads', {
            params: {
              query: {
                search: query.search.trim() || undefined,
                scope: query.scope,
                category: query.category ?? undefined,
                page: query.page,
                pageSize: query.pageSize,
              },
            },
            signal,
          }),
          mapLeadPage,
          toLeadApiError,
        ),
      providesTags: list,
    }),
    getLeadMyDay: build.query<LeadMyDay, void>({
      queryFn: (_arg, { signal }) =>
        apiCall(apiClient.GET('/api/crm/leads/my-day', { signal }), mapLeadMyDay, toLeadApiError),
      providesTags: list,
    }),
    getLeadCallResults: build.query<readonly LeadCallResult[], void>({
      queryFn: (_arg, { signal }) =>
        apiCall(
          apiClient.GET('/api/crm/leads/call-results', { signal }),
          mapLeadCallResults,
          toLeadApiError,
        ),
      providesTags: references,
    }),
    getLead: build.query<LeadDetail, number>({
      queryFn: (id, { signal }) =>
        apiCall(
          apiClient.GET('/api/crm/leads/{id}', { params: { path: { id: id } }, signal }),
          mapLeadDetail,
          toLeadApiError,
        ),
      providesTags: (_result, _error, id) => [{ type: 'Lead', id }],
    }),
    takeLead: build.mutation<LeadDetail, number>({
      queryFn: (id, { signal }) =>
        apiCall(
          apiClient.POST('/api/crm/leads/{id}/take', { params: { path: { id: id } }, signal }),
          mapLeadDetail,
          toLeadApiError,
        ),
      invalidatesTags: (_result, error, id) => changed(error, id),
    }),
    releaseLead: build.mutation<LeadDetail, { id: number; version: number }>({
      queryFn: ({ id, version }, { signal }) =>
        apiCall(
          apiClient.POST('/api/crm/leads/{id}/release', {
            params: { path: { id: id }, query: { version } },
            signal,
          }),
          mapLeadDetail,
          toLeadApiError,
        ),
      invalidatesTags: (_result, error, { id }) => changed(error, id),
    }),
    /** `requestId` is one per attempt: a repeated press returns the lead without a second call. */
    recordLeadCall: build.mutation<
      LeadDetail,
      { id: number; version: number; values: LeadCallFormValues; requestId: string }
    >({
      queryFn: ({ id, version, values, requestId }, { signal }) =>
        apiCall(
          apiClient.POST('/api/crm/leads/{id}/calls', {
            params: { path: { id: id } },
            body: { ...toRecordLeadCallInput(values, version), requestId },
            signal,
          }),
          mapLeadDetail,
          toLeadApiError,
        ),
      invalidatesTags: (_result, error, { id }) => changed(error, id),
    }),
  }),
});

export const {
  useGetLeadCallResultsQuery,
  useGetLeadMyDayQuery,
  useGetLeadQuery,
  useListLeadsQuery,
  useRecordLeadCallMutation,
  useReleaseLeadMutation,
  useTakeLeadMutation,
} = leadsApi;
