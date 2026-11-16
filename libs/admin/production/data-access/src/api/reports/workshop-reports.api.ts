import { apiCall, apiClient } from '@admin/shared/api-client';

import { reportErrors, toProductionApiError } from '../../errors/production-api-error';
import {
  mapWorkshopDashboard,
  mapWorkshopReportPair,
} from '../../mappers/reports/workshop-report.mapper';
import { productionBaseApi } from '../base/production-base-api';

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
      queryFn: (params, { signal }) =>
        apiCall(
          apiClient.GET('/api/production/reports', { params: { query: params }, signal }),
          mapWorkshopReportPair,
          errors,
        ),
      providesTags: ['Payroll', 'ProductionWork', 'FabricStock', 'ProductionOrder'],
    }),
    getWorkshopDashboard: build.query<WorkshopDashboard, void>({
      queryFn: (_arg, { signal }) =>
        apiCall(
          apiClient.GET('/api/production/dashboard', { signal }),
          mapWorkshopDashboard,
          errors,
        ),
      providesTags: ['ProductionOrder', 'ProductionWork', 'Timesheet'],
    }),
  }),
});

export const { useGetWorkshopDashboardQuery, useGetWorkshopReportQuery } = workshopReportsApi;
