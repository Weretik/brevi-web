import { toProductionApiError, workshopStaffErrors } from '../../errors/production-api-error';
import { mapStaffImportResult } from '../../mappers/orders/production-import.mapper';
import { mapWorkshopEmployee, mapWorkshopStaff } from '../../mappers/people/workshop-employee.mapper';
import { productionBaseApi } from '../production-base-api';

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
      query: () => ({ url: '/api/production/staff', params: { includeArchived: true } }),
      transformResponse: mapWorkshopStaff,
      transformErrorResponse: errors,
      providesTags: staffList,
    }),
    createWorkshopEmployee: build.mutation<WorkshopEmployee, WorkshopEmployeeDraft>({
      query: (draft) => ({ url: '/api/production/staff', method: 'POST', body: toInput(draft) }),
      transformResponse: mapWorkshopEmployee,
      transformErrorResponse: errors,
      invalidatesTags: (_result, error) => (error ? [] : staffList),
    }),
    updateWorkshopEmployee: build.mutation<
      WorkshopEmployee,
      { id: number; draft: WorkshopEmployeeDraft }
    >({
      query: ({ id, draft }) => ({
        url: `/api/production/staff/${id}`,
        method: 'PUT',
        body: toInput(draft),
      }),
      transformResponse: mapWorkshopEmployee,
      transformErrorResponse: errors,
      invalidatesTags: (_result, error) => (error ? [] : staffList),
    }),
    setWorkshopEmployeeActive: build.mutation<WorkshopEmployee, { id: number; isActive: boolean }>({
      query: ({ id, isActive }) => ({
        url: `/api/production/staff/${id}/active`,
        method: 'PUT',
        body: { isActive },
      }),
      transformResponse: mapWorkshopEmployee,
      transformErrorResponse: errors,
      invalidatesTags: (_result, error) => (error ? [] : staffList),
    }),
    importWorkshopStaff: build.mutation<
      ProductionImportResult,
      { rows: WorkshopStaffImportRow[]; dryRun: boolean }
    >({
      query: ({ rows, dryRun }) => ({
        url: '/api/production/staff/import',
        method: 'POST',
        params: { dryRun },
        body: rows.map(toInput),
      }),
      transformResponse: mapStaffImportResult,
      transformErrorResponse: errors,
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
