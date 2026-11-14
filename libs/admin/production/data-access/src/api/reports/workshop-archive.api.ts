import { archiveErrors, toProductionApiError } from '../../errors/production-api-error';
import {
  mapWorkshopArchiveImportResult,
  mapWorkshopArchivePage,
} from '../../mappers/reports/workshop-archive.mapper';
import { productionBaseApi } from '../production-base-api';

import type {
  ProductionImportResult,
  WorkshopArchiveImportRow,
  WorkshopArchivePage,
  WorkshopArchiveQuery,
} from '@admin/production/model';
import type { components } from '@admin/shared/contracts';

type Schemas = components['schemas'];

const errors = (response: unknown) => toProductionApiError(response, archiveErrors);

const importInput = (rows: WorkshopArchiveImportRow[]): Schemas['WorkshopArchiveImportRow'][] =>
  rows;

/** «Архів цеху»: read-only lines of the old «Цех»; Admin moves them from the transfer file. */
export const workshopArchiveApi = productionBaseApi.injectEndpoints({
  endpoints: (build) => ({
    getWorkshopArchive: build.query<WorkshopArchivePage, WorkshopArchiveQuery>({
      query: ({ kind, search, from, to, page, pageSize }) => ({
        url: '/api/production/archive',
        params: {
          kind,
          ...(search?.trim() ? { search: search.trim() } : {}),
          ...(from ? { from } : {}),
          ...(to ? { to } : {}),
          page,
          pageSize,
        },
      }),
      transformResponse: mapWorkshopArchivePage,
      transformErrorResponse: errors,
      providesTags: ['WorkshopArchive'],
    }),
    importWorkshopArchive: build.mutation<
      ProductionImportResult,
      { rows: WorkshopArchiveImportRow[]; dryRun: boolean }
    >({
      query: ({ rows, dryRun }) => ({
        url: '/api/production/archive/import',
        method: 'POST',
        params: { dryRun },
        body: importInput(rows),
      }),
      transformResponse: mapWorkshopArchiveImportResult,
      transformErrorResponse: errors,
      invalidatesTags: (result, error) =>
        error || !result || result.dryRun || result.errors > 0 ? [] : ['WorkshopArchive'],
    }),
  }),
});

export const { useGetWorkshopArchiveQuery, useImportWorkshopArchiveMutation } = workshopArchiveApi;
