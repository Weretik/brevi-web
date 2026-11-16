import { apiCall, apiClient } from '@admin/shared/api-client';

import { leadsBaseApi } from './leads-base-api';
import { toSiteRequestApiError } from '../errors/site-request-api-error';
import { mapSiteRequest, mapSiteRequestPage } from '../mappers/site-request.mapper';

import type {
  SiteRequest,
  SiteRequestAction,
  SiteRequestListQuery,
  SiteRequestPage,
} from '@admin/leads/model';

const list = [{ type: 'SiteRequestList' as const, id: 'LIST' }];

export interface ChangeSiteRequestArgs {
  readonly id: number;
  readonly action: SiteRequestAction;
  readonly version: number;
  readonly note?: string | null;
}

/** «Заявки з сайту» (LEAD-002): the list with tab counts and one change endpoint for every action. */
export const siteRequestsApi = leadsBaseApi.injectEndpoints({
  endpoints: (build) => ({
    listSiteRequests: build.query<SiteRequestPage, SiteRequestListQuery>({
      queryFn: (query, { signal }) =>
        apiCall(
          apiClient.GET('/api/crm/site-requests', {
            params: { query: { scope: query.scope, page: query.page, pageSize: query.pageSize } },
            signal,
          }),
          mapSiteRequestPage,
          toSiteRequestApiError,
        ),
      providesTags: list,
    }),
    changeSiteRequest: build.mutation<SiteRequest, ChangeSiteRequestArgs>({
      queryFn: ({ id, action, version, note }, { signal }) =>
        apiCall(
          apiClient.POST('/api/crm/site-requests/{id}/change', {
            params: { path: { id: id } },
            body: { action, version, note: note?.trim() || null },
            signal,
          }),
          mapSiteRequest,
          toSiteRequestApiError,
        ),
      invalidatesTags: (_result, error) => (error ? [] : list),
    }),
  }),
});

export const { useListSiteRequestsQuery, useChangeSiteRequestMutation } = siteRequestsApi;
