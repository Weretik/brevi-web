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
import { productionBaseApi } from '../production-base-api';

import type {
  CreatePayrollAdjustmentBody,
  CreatePayrollPaymentBody,
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

/** A change of a month refreshes every view of pay; closing also changes what work may be recorded. */
const payrollChanged = (_result: unknown, error: unknown) =>
  error ? [] : [{ type: 'Payroll' as const }, { type: 'Timesheet' as const }];

const monthChange = <Body>(path: string, method: 'POST' | 'PUT') => ({
  query: ({ month, body }: { month: string; body: Body }) => ({
    url: `/api/production/payroll/${month}/${path}`,
    method,
    body,
  }),
  transformResponse: mapPayrollMonth,
  transformErrorResponse: payErrors,
  invalidatesTags: payrollChanged,
});

export const payrollApi = productionBaseApi.injectEndpoints({
  endpoints: (build) => ({
    getTimesheetDay: build.query<TimesheetDay, string>({
      query: (date) => ({ url: '/api/production/timesheet', params: { date } }),
      transformResponse: mapTimesheetDay,
      transformErrorResponse: sheetErrors,
      providesTags: (_result, _error, date) => [{ type: 'Timesheet', id: date }],
    }),
    saveTimesheetDay: build.mutation<TimesheetDay, SaveTimesheetDayBody>({
      query: (body) => ({
        url: '/api/production/timesheet',
        method: 'PUT',
        body: body satisfies Schemas['SaveTimesheetDayInput'],
      }),
      transformResponse: mapTimesheetDay,
      transformErrorResponse: sheetErrors,
      invalidatesTags: (_result, error) =>
        error ? [] : [{ type: 'Timesheet' }, { type: 'Payroll' }],
    }),
    getPayrollMonth: build.query<PayrollMonth, string>({
      query: (month) => `/api/production/payroll/${month}`,
      transformResponse: mapPayrollMonth,
      transformErrorResponse: payErrors,
      providesTags: (_result, _error, month) => [{ type: 'Payroll', id: month }],
    }),
    getPayrollEmployee: build.query<PayrollEmployee, { month: string; employeeId: number }>({
      query: ({ month, employeeId }) => `/api/production/payroll/${month}/employees/${employeeId}`,
      transformResponse: mapPayrollEmployee,
      transformErrorResponse: payErrors,
      providesTags: (_result, _error, { month }) => [{ type: 'Payroll', id: `${month}:detail` }],
    }),
    getPayrollYear: build.query<PayrollYear, number>({
      query: (year) => `/api/production/payroll/history/${year}`,
      transformResponse: mapPayrollYear,
      transformErrorResponse: payErrors,
      providesTags: (_result, _error, year) => [{ type: 'Payroll', id: `year:${year}` }],
    }),
    setPayrollRoles: build.mutation<
      PayrollMonth,
      { month: string; body: Schemas['SetPayrollRolesInput'] }
    >(monthChange<Schemas['SetPayrollRolesInput']>('roles', 'PUT')),
    setPayrollEmbroidery: build.mutation<
      PayrollMonth,
      { month: string; body: Schemas['SetPayrollEmbroideryInput'] }
    >(monthChange<Schemas['SetPayrollEmbroideryInput']>('embroidery', 'PUT')),
    createPayrollPayment: build.mutation<
      PayrollMonth,
      { month: string; body: CreatePayrollPaymentBody }
    >(monthChange<CreatePayrollPaymentBody>('payments', 'POST')),
    createPayrollAdjustment: build.mutation<
      PayrollMonth,
      { month: string; body: CreatePayrollAdjustmentBody }
    >(monthChange<CreatePayrollAdjustmentBody>('adjustments', 'POST')),
    setPayrollIssued: build.mutation<
      PayrollMonth,
      { month: string; body: Schemas['SetPayrollIssuedInput'] }
    >(monthChange<Schemas['SetPayrollIssuedInput']>('issued', 'PUT')),
    voidPayrollPayment: build.mutation<PayrollMonth, { id: number; reason: string }>({
      query: ({ id, reason }) => ({
        url: `/api/production/payroll/payments/${id}/void`,
        method: 'POST',
        body: { reason } satisfies Schemas['VoidPayrollEntryInput'],
      }),
      transformResponse: mapPayrollMonth,
      transformErrorResponse: payErrors,
      invalidatesTags: payrollChanged,
    }),
    voidPayrollAdjustment: build.mutation<PayrollMonth, { id: number; reason: string }>({
      query: ({ id, reason }) => ({
        url: `/api/production/payroll/adjustments/${id}/void`,
        method: 'POST',
        body: { reason } satisfies Schemas['VoidPayrollEntryInput'],
      }),
      transformResponse: mapPayrollMonth,
      transformErrorResponse: payErrors,
      invalidatesTags: payrollChanged,
    }),
    closePayrollMonth: build.mutation<PayrollMonth, string>({
      query: (month) => ({ url: `/api/production/payroll/${month}/close`, method: 'POST' }),
      transformResponse: mapPayrollMonth,
      transformErrorResponse: payErrors,
      invalidatesTags: (_result, error) =>
        error ? [] : [{ type: 'Payroll' }, { type: 'Timesheet' }, { type: 'ProductionWork' }],
    }),
    reopenPayrollMonth: build.mutation<PayrollMonth, string>({
      query: (month) => ({ url: `/api/production/payroll/${month}/reopen`, method: 'POST' }),
      transformResponse: mapPayrollMonth,
      transformErrorResponse: payErrors,
      invalidatesTags: (_result, error) =>
        error ? [] : [{ type: 'Payroll' }, { type: 'Timesheet' }, { type: 'ProductionWork' }],
    }),
  }),
});

export const {
  useClosePayrollMonthMutation,
  useCreatePayrollAdjustmentMutation,
  useCreatePayrollPaymentMutation,
  useGetPayrollEmployeeQuery,
  useGetPayrollMonthQuery,
  useGetPayrollYearQuery,
  useGetTimesheetDayQuery,
  useReopenPayrollMonthMutation,
  useSaveTimesheetDayMutation,
  useSetPayrollEmbroideryMutation,
  useSetPayrollIssuedMutation,
  useSetPayrollRolesMutation,
  useVoidPayrollAdjustmentMutation,
  useVoidPayrollPaymentMutation,
} = payrollApi;
