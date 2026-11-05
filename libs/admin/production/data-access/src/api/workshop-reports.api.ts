import { productionBaseApi } from './production-base-api';
import { reportErrors, toProductionApiError } from '../errors/production-api-error';
import { mapWorkshopDashboard, mapWorkshopReportPair } from '../mappers/workshop-report.mapper';

import type {
  WorkshopDashboard,
  WorkshopReportPair,
  WorkshopReportQuery,
} from '@admin/production/model';

const errors = (response: unknown) => toProductionApiError(response, reportErrors);

/** «Звіти цеху» (Admin) and «Огляд виробництва» on the admin home. */
export const workshopReportsApi = productionBaseApi.injectEndpoints({
  endpoints: (build) => ({
    getWorkshopReport: build.query<WorkshopReportPair, WorkshopReportQuery>({
      query: (params) => ({ url: '/api/production/reports', params }),
      transformResponse: mapWorkshopReportPair,
      transformErrorResponse: errors,
      providesTags: ['Payroll', 'ProductionWork', 'FabricStock', 'ProductionOrder'],
    }),
    getWorkshopDashboard: build.query<WorkshopDashboard, void>({
      query: () => ({ url: '/api/production/dashboard' }),
      transformResponse: mapWorkshopDashboard,
      transformErrorResponse: errors,
      providesTags: ['ProductionOrder', 'ProductionWork', 'Timesheet'],
    }),
  }),
});

export const { useGetWorkshopDashboardQuery, useGetWorkshopReportQuery } = workshopReportsApi;
