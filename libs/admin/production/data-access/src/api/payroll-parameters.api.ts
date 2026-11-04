import { productionBaseApi } from './production-base-api';
import { payrollParameterErrors, toProductionApiError } from '../errors/production-api-error';
import { mapPayrollParameters } from '../mappers/payroll-parameter.mapper';

import type { PayrollParameter } from '@admin/production/model';

export const payrollParametersApi = productionBaseApi.injectEndpoints({
  endpoints: (build) => ({
    getPayrollParameters: build.query<PayrollParameter[], void>({
      query: () => '/api/production/payroll-parameters',
      transformResponse: mapPayrollParameters,
      transformErrorResponse: (response) => toProductionApiError(response, payrollParameterErrors),
      providesTags: [{ type: 'PayrollParameter', id: 'LIST' }],
    }),
  }),
});

export const { useGetPayrollParametersQuery } = payrollParametersApi;
