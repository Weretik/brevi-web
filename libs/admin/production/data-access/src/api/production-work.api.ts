import { productionBaseApi } from './production-base-api';
import {
  productionWorkErrors,
  sewingForecastErrors,
  toProductionApiError,
} from '../errors/production-api-error';
import {
  mapProductionItemWork,
  mapSewingForecast,
  mapWorkChoices,
  mapWorkImportResult,
  mapWorkLog,
} from '../mappers/production-work.mapper';

import type {
  CreateProductionWorkBody,
  ProductionImportResult,
  ProductionItemWorkCard,
  ProductionWorkImportFile,
  SewingForecast,
  WorkChoices,
  WorkLog,
  WorkLogQuery,
} from '@admin/production/model';
import type { components } from '@admin/shared/contracts';

type Schemas = components['schemas'];

/**
 * The model body must stay assignable to the backend contract; the reason comes from the server's own list
 * (`overPlanReasons` of the choices), so it is one of the contract values.
 */
const workInput = (body: CreateProductionWorkBody): Schemas['CreateProductionWorkInput'] => ({
  ...body,
  reason: body.reason as Schemas['CreateProductionWorkInput']['reason'],
});

const workErrors = (response: unknown) => toProductionApiError(response, productionWorkErrors);
const forecastErrors = (response: unknown) => toProductionApiError(response, sewingForecastErrors);

/** Work changes the log, the item section, what is left to sew (so the forecast) and the pay. */
const workChanged = (_result: unknown, error: unknown) =>
  error
    ? []
    : [
        { type: 'ProductionWork' as const },
        { type: 'SewingForecast' as const },
        { type: 'Payroll' as const },
      ];

export const productionWorkApi = productionBaseApi.injectEndpoints({
  endpoints: (build) => ({
    getWorkLog: build.query<WorkLog, WorkLogQuery>({
      query: ({ month, employeeId, orderId }) => ({
        url: '/api/production/work',
        params: {
          month,
          ...(employeeId ? { employeeId } : {}),
          ...(orderId ? { orderId } : {}),
        },
      }),
      transformResponse: mapWorkLog,
      transformErrorResponse: workErrors,
      providesTags: [{ type: 'ProductionWork', id: 'LOG' }],
    }),
    getWorkChoices: build.query<WorkChoices, void>({
      query: () => '/api/production/work/choices',
      transformResponse: mapWorkChoices,
      transformErrorResponse: workErrors,
      providesTags: [{ type: 'ProductionWork', id: 'CHOICES' }],
    }),
    getProductionItemWork: build.query<ProductionItemWorkCard, { orderId: number; itemId: number }>(
      {
        query: ({ orderId, itemId }) => `/api/production/orders/${orderId}/items/${itemId}/work`,
        transformResponse: mapProductionItemWork,
        transformErrorResponse: workErrors,
        providesTags: (_result, _error, { itemId }) => [{ type: 'ProductionWork', id: itemId }],
      },
    ),
    createProductionWork: build.mutation<
      ProductionItemWorkCard,
      { orderId: number; itemId: number; body: CreateProductionWorkBody }
    >({
      query: ({ orderId, itemId, body }) => ({
        url: `/api/production/orders/${orderId}/items/${itemId}/work`,
        method: 'POST',
        body: workInput(body),
      }),
      transformResponse: mapProductionItemWork,
      transformErrorResponse: workErrors,
      invalidatesTags: workChanged,
    }),
    voidProductionWork: build.mutation<ProductionItemWorkCard, { workId: number; reason: string }>({
      query: ({ workId, reason }) => ({
        url: `/api/production/work/${workId}/void`,
        method: 'POST',
        body: { reason } satisfies Schemas['VoidProductionWorkInput'],
      }),
      transformResponse: mapProductionItemWork,
      transformErrorResponse: workErrors,
      invalidatesTags: workChanged,
    }),
    importProductionWork: build.mutation<
      ProductionImportResult,
      { file: ProductionWorkImportFile; dryRun: boolean }
    >({
      query: ({ file, dryRun }) => ({
        url: '/api/production/work/import',
        method: 'POST',
        params: { dryRun },
        body: file,
      }),
      transformResponse: mapWorkImportResult,
      transformErrorResponse: workErrors,
      invalidatesTags: (result, error) =>
        error || !result || result.dryRun
          ? []
          : [{ type: 'ProductionWork' }, { type: 'SewingForecast' }, { type: 'Payroll' }],
    }),
    getSewingForecast: build.query<SewingForecast, void>({
      query: () => '/api/production/forecast',
      transformResponse: mapSewingForecast,
      transformErrorResponse: forecastErrors,
      providesTags: [{ type: 'SewingForecast', id: 'QUEUE' }],
    }),
    saveSewingForecastQueue: build.mutation<void, { version: number; orderIds: number[] }>({
      query: (body) => ({
        url: '/api/production/forecast/queue',
        method: 'PUT',
        body: body satisfies Schemas['SaveForecastQueueInput'],
      }),
      transformErrorResponse: forecastErrors,
      invalidatesTags: (_result, error) => (error ? [] : [{ type: 'SewingForecast' }]),
    }),
  }),
});

export const {
  useCreateProductionWorkMutation,
  useGetProductionItemWorkQuery,
  useGetSewingForecastQuery,
  useGetWorkChoicesQuery,
  useGetWorkLogQuery,
  useImportProductionWorkMutation,
  useSaveSewingForecastQueueMutation,
  useVoidProductionWorkMutation,
} = productionWorkApi;
