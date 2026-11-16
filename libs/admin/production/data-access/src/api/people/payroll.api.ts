import { apiCall, apiClient } from '@admin/shared/api-client';

import {
  payrollErrors,
  timesheetErrors,
  toProductionApiError,
} from '../../errors/production-api-error';
import {
  mapPayrollEmployee,
  mapPayrollMonth,
  mapPayrollYear,
  mapTimesheetDay,
} from '../../mappers/people/payroll.mapper';
import { productionBaseApi } from '../base/production-base-api';

import type {
  PayrollEmployee,
  PayrollMonth,
  PayrollYear,
  SaveTimesheetDayBody,
  TimesheetDay,
} from '@admin/production/model';
import type { components } from '@admin/shared/contracts';

type Schemas = components['schemas'];

const sheetErrors = (response: unknown) => toProductionApiError(response, timesheetErrors);
const payErrors = (response: unknown) => toProductionApiError(response, payrollErrors);

export const payrollApi = productionBaseApi.injectEndpoints({
  endpoints: (build) => ({
    getTimesheetDay: build.query<TimesheetDay, string>({
      queryFn: (date, { signal }) =>
        apiCall(
          apiClient.GET('/api/production/timesheet', { params: { query: { date } }, signal }),
          mapTimesheetDay,
          sheetErrors,
        ),
      providesTags: (_result, _error, date) => [{ type: 'Timesheet', id: date }],
    }),
    saveTimesheetDay: build.mutation<TimesheetDay, SaveTimesheetDayBody>({
      queryFn: (body, { signal }) =>
        apiCall(
          apiClient.PUT('/api/production/timesheet', {
            body: body satisfies Schemas['SaveTimesheetDayInput'],
            signal,
          }),
          mapTimesheetDay,
          sheetErrors,
        ),
      invalidatesTags: (_result, error) =>
        error ? [] : [{ type: 'Timesheet' }, { type: 'Payroll' }],
    }),
    getPayrollMonth: build.query<PayrollMonth, string>({
      queryFn: (month, { signal }) =>
        apiCall(
          apiClient.GET('/api/production/payroll/{month}', {
            params: { path: { month: month } },
            signal,
          }),
          mapPayrollMonth,
          payErrors,
        ),
      providesTags: (_result, _error, month) => [{ type: 'Payroll', id: month }],
    }),
    getPayrollEmployee: build.query<PayrollEmployee, { month: string; employeeId: number }>({
      queryFn: ({ month, employeeId }, { signal }) =>
        apiCall(
          apiClient.GET('/api/production/payroll/{month}/employees/{employeeId}', {
            params: { path: { month: month, employeeId: employeeId } },
            signal,
          }),
          mapPayrollEmployee,
          payErrors,
        ),
      providesTags: (_result, _error, { month }) => [{ type: 'Payroll', id: `${month}:detail` }],
    }),
    getPayrollYear: build.query<PayrollYear, number>({
      queryFn: (year, { signal }) =>
        apiCall(
          apiClient.GET('/api/production/payroll/history/{year}', {
            params: { path: { year: year } },
            signal,
          }),
          mapPayrollYear,
          payErrors,
        ),
      providesTags: (_result, _error, year) => [{ type: 'Payroll', id: `year:${year}` }],
    }),
  }),
});

export const {
  useGetPayrollEmployeeQuery,
  useGetPayrollMonthQuery,
  useGetPayrollYearQuery,
  useGetTimesheetDayQuery,
  useSaveTimesheetDayMutation,
} = payrollApi;
