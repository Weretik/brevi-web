import { apiCall, apiClient } from '@admin/shared/api-client';

import { toProductionApiError, workshopStaffErrors } from '../../errors/production-api-error';
import { mapStaffImportResult } from '../../mappers/orders/sources/production-import.mapper';
import {
  mapWorkshopEmployee,
  mapWorkshopStaff,
} from '../../mappers/people/workshop-employee.mapper';
import { productionBaseApi } from '../base/production-base-api';

import type {
  ProductionImportResult,
  WorkshopEmployee,
  WorkshopEmployeeDraft,
  WorkshopStaffImportRow,
} from '@admin/production/model';
import type { components } from '@admin/shared/contracts';

type EmployeeInput = components['schemas']['WorkshopEmployeeInput'];

const toInput = (draft: WorkshopEmployeeDraft): EmployeeInput => ({
  fullName: draft.fullName,
  position: draft.position,
});

const staffList = [{ type: 'WorkshopEmployee' as const, id: 'LIST' }];
const errors = (response: unknown) => toProductionApiError(response, workshopStaffErrors);

export const workshopStaffApi = productionBaseApi.injectEndpoints({
  endpoints: (build) => ({
    getWorkshopStaff: build.query<WorkshopEmployee[], void>({
      // Archived workers come too: the page switches between «Працюють» and «Архів» without a request.
      queryFn: (_arg, { signal }) =>
        apiCall(
          apiClient.GET('/api/production/staff', {
            params: { query: { includeArchived: true } },
            signal,
          }),
          mapWorkshopStaff,
          errors,
        ),
      providesTags: staffList,
    }),
    createWorkshopEmployee: build.mutation<WorkshopEmployee, WorkshopEmployeeDraft>({
      queryFn: (draft, { signal }) =>
        apiCall(
          apiClient.POST('/api/production/staff', { body: toInput(draft), signal }),
          mapWorkshopEmployee,
          errors,
        ),
      invalidatesTags: (_result, error) => (error ? [] : staffList),
    }),
    updateWorkshopEmployee: build.mutation<
      WorkshopEmployee,
      { id: number; draft: WorkshopEmployeeDraft }
    >({
      queryFn: ({ id, draft }, { signal }) =>
        apiCall(
          apiClient.PUT('/api/production/staff/{id}', {
            params: { path: { id: id } },
            body: toInput(draft),
            signal,
          }),
          mapWorkshopEmployee,
          errors,
        ),
      invalidatesTags: (_result, error) => (error ? [] : staffList),
    }),
    setWorkshopEmployeeActive: build.mutation<WorkshopEmployee, { id: number; isActive: boolean }>({
      queryFn: ({ id, isActive }, { signal }) =>
        apiCall(
          apiClient.PUT('/api/production/staff/{id}/active', {
            params: { path: { id: id } },
            body: { isActive },
            signal,
          }),
          mapWorkshopEmployee,
          errors,
        ),
      invalidatesTags: (_result, error) => (error ? [] : staffList),
    }),
    importWorkshopStaff: build.mutation<
      ProductionImportResult,
      { rows: WorkshopStaffImportRow[]; dryRun: boolean }
    >({
      queryFn: ({ rows, dryRun }, { signal }) =>
        apiCall(
          apiClient.POST('/api/production/staff/import', {
            params: { query: { dryRun } },
            body: rows.map(toInput),
            signal,
          }),
          mapStaffImportResult,
          errors,
        ),
      invalidatesTags: (result, error) => (error || result?.dryRun ? [] : staffList),
    }),
  }),
});

export const {
  useCreateWorkshopEmployeeMutation,
  useGetWorkshopStaffQuery,
  useImportWorkshopStaffMutation,
  useSetWorkshopEmployeeActiveMutation,
  useUpdateWorkshopEmployeeMutation,
} = workshopStaffApi;
