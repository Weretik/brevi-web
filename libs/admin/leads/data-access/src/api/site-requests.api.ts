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
      query: (query) => ({
        url: '/api/crm/site-requests',
        params: { scope: query.scope, page: query.page, pageSize: query.pageSize },
      }),
      transformResponse: mapSiteRequestPage,
      transformErrorResponse: toSiteRequestApiError,
      providesTags: list,
    }),
    changeSiteRequest: build.mutation<SiteRequest, ChangeSiteRequestArgs>({
      query: ({ id, action, version, note }) => ({
        url: `/api/crm/site-requests/${id}/change`,
        method: 'POST',
        body: { action, version, note: note?.trim() || null },
      }),
      transformResponse: mapSiteRequest,
      transformErrorResponse: toSiteRequestApiError,
      invalidatesTags: (_result, error) => (error ? [] : list),
    }),
  }),
});

export const { useListSiteRequestsQuery, useChangeSiteRequestMutation } = siteRequestsApi;
