import { apiCall, apiClient } from '@admin/shared/api-client';

import { payrollErrors, toProductionApiError } from '../../errors/production-api-error';
import { mapPayrollMonth } from '../../mappers/people/payroll.mapper';
import { productionBaseApi } from '../base/production-base-api';

import type {
  CreatePayrollAdjustmentBody,
  CreatePayrollPaymentBody,
  PayrollMonth,
} from '@admin/production/model';
import type { components } from '@admin/shared/contracts';

type Schemas = components['schemas'];

const payErrors = (response: unknown) => toProductionApiError(response, payrollErrors);

/** A change of a month refreshes every view of pay; closing also changes what work may be recorded. */
const payrollChanged = (_result: unknown, error: unknown) =>
  error ? [] : [{ type: 'Payroll' as const }, { type: 'Timesheet' as const }];

/** «Зарплата»: changes of a month — roles, embroidery, payments, adjustments, issue, close and reopen. */
export const payrollChangesApi = productionBaseApi.injectEndpoints({
  endpoints: (build) => ({
    setPayrollRoles: build.mutation<
      PayrollMonth,
      { month: string; body: Schemas['SetPayrollRolesInput'] }
    >({
      queryFn: ({ month, body }, { signal }) =>
        apiCall(
          apiClient.PUT('/api/production/payroll/{month}/roles', {
            params: { path: { month } },
            body,
            signal,
          }),
          mapPayrollMonth,
          payErrors,
        ),
      invalidatesTags: payrollChanged,
    }),
    setPayrollEmbroidery: build.mutation<
      PayrollMonth,
      { month: string; body: Schemas['SetPayrollEmbroideryInput'] }
    >({
      queryFn: ({ month, body }, { signal }) =>
        apiCall(
          apiClient.PUT('/api/production/payroll/{month}/embroidery', {
            params: { path: { month } },
            body,
            signal,
          }),
          mapPayrollMonth,
          payErrors,
        ),
      invalidatesTags: payrollChanged,
    }),
    createPayrollPayment: build.mutation<
      PayrollMonth,
      { month: string; body: CreatePayrollPaymentBody }
    >({
      queryFn: ({ month, body }, { signal }) =>
        apiCall(
          apiClient.POST('/api/production/payroll/{month}/payments', {
            params: { path: { month } },
            body,
            signal,
          }),
          mapPayrollMonth,
          payErrors,
        ),
      invalidatesTags: payrollChanged,
    }),
    createPayrollAdjustment: build.mutation<
      PayrollMonth,
      { month: string; body: CreatePayrollAdjustmentBody }
    >({
      queryFn: ({ month, body }, { signal }) =>
        apiCall(
          apiClient.POST('/api/production/payroll/{month}/adjustments', {
            params: { path: { month } },
            body,
            signal,
          }),
          mapPayrollMonth,
          payErrors,
        ),
      invalidatesTags: payrollChanged,
    }),
    setPayrollIssued: build.mutation<
      PayrollMonth,
      { month: string; body: Schemas['SetPayrollIssuedInput'] }
    >({
      queryFn: ({ month, body }, { signal }) =>
        apiCall(
          apiClient.PUT('/api/production/payroll/{month}/issued', {
            params: { path: { month } },
            body,
            signal,
          }),
          mapPayrollMonth,
          payErrors,
        ),
      invalidatesTags: payrollChanged,
    }),
    voidPayrollPayment: build.mutation<PayrollMonth, { id: number; reason: string }>({
      queryFn: ({ id, reason }, { signal }) =>
        apiCall(
          apiClient.POST('/api/production/payroll/payments/{paymentId}/void', {
            params: { path: { paymentId: id } },
            body: { reason } satisfies Schemas['VoidPayrollEntryInput'],
            signal,
          }),
          mapPayrollMonth,
          payErrors,
        ),
      invalidatesTags: payrollChanged,
    }),
    voidPayrollAdjustment: build.mutation<PayrollMonth, { id: number; reason: string }>({
      queryFn: ({ id, reason }, { signal }) =>
        apiCall(
          apiClient.POST('/api/production/payroll/adjustments/{adjustmentId}/void', {
            params: { path: { adjustmentId: id } },
            body: { reason } satisfies Schemas['VoidPayrollEntryInput'],
            signal,
          }),
          mapPayrollMonth,
          payErrors,
        ),
      invalidatesTags: payrollChanged,
    }),
    closePayrollMonth: build.mutation<PayrollMonth, string>({
      queryFn: (month, { signal }) =>
        apiCall(
          apiClient.POST('/api/production/payroll/{month}/close', {
            params: { path: { month: month } },
            signal,
          }),
          mapPayrollMonth,
          payErrors,
        ),
      invalidatesTags: (_result, error) =>
        error ? [] : [{ type: 'Payroll' }, { type: 'Timesheet' }, { type: 'ProductionWork' }],
    }),
    reopenPayrollMonth: build.mutation<PayrollMonth, string>({
      queryFn: (month, { signal }) =>
        apiCall(
          apiClient.POST('/api/production/payroll/{month}/reopen', {
            params: { path: { month: month } },
            signal,
          }),
          mapPayrollMonth,
          payErrors,
        ),
      invalidatesTags: (_result, error) =>
        error ? [] : [{ type: 'Payroll' }, { type: 'Timesheet' }, { type: 'ProductionWork' }],
    }),
  }),
});

export const {
  useClosePayrollMonthMutation,
  useCreatePayrollAdjustmentMutation,
  useCreatePayrollPaymentMutation,
  useReopenPayrollMonthMutation,
  useSetPayrollEmbroideryMutation,
  useSetPayrollIssuedMutation,
  useSetPayrollRolesMutation,
  useVoidPayrollAdjustmentMutation,
  useVoidPayrollPaymentMutation,
} = payrollChangesApi;
