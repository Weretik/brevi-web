import { apiCall, apiClient } from '@admin/shared/api-client';

import {
  productionWorkErrors,
  sewingForecastErrors,
  toProductionApiError,
} from '../../errors/production-api-error';
import {
  mapProductionItemWork,
  mapSewingForecast,
  mapWorkChoices,
  mapWorkImportResult,
  mapWorkLog,
} from '../../mappers/work/production-work.mapper';
import { productionBaseApi } from '../base/production-base-api';

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
type ImportBody = Schemas['ProductionWorkImportInput'];

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
      queryFn: ({ month, employeeId, orderId }, { signal }) =>
        apiCall(
          apiClient.GET('/api/production/work', {
            params: {
              query: {
                month,
                ...(employeeId ? { employeeId } : {}),
                ...(orderId ? { orderId } : {}),
              },
            },
            signal,
          }),
          mapWorkLog,
          workErrors,
        ),
      providesTags: [{ type: 'ProductionWork', id: 'LOG' }],
    }),
    getWorkChoices: build.query<WorkChoices, void>({
      queryFn: (_arg, { signal }) =>
        apiCall(
          apiClient.GET('/api/production/work/choices', { signal }),
          mapWorkChoices,
          workErrors,
        ),
      providesTags: [{ type: 'ProductionWork', id: 'CHOICES' }],
    }),
    getProductionItemWork: build.query<ProductionItemWorkCard, { orderId: number; itemId: number }>(
      {
        queryFn: ({ orderId, itemId }, { signal }) =>
          apiCall(
            apiClient.GET('/api/production/orders/{id}/items/{itemId}/work', {
              params: { path: { id: orderId, itemId: itemId } },
              signal,
            }),
            mapProductionItemWork,
            workErrors,
          ),
        providesTags: (_result, _error, { itemId }) => [{ type: 'ProductionWork', id: itemId }],
      },
    ),
    createProductionWork: build.mutation<
      ProductionItemWorkCard,
      { orderId: number; itemId: number; body: CreateProductionWorkBody }
    >({
      queryFn: ({ orderId, itemId, body }, { signal }) =>
        apiCall(
          apiClient.POST('/api/production/orders/{id}/items/{itemId}/work', {
            params: { path: { id: orderId, itemId: itemId } },
            body: workInput(body),
            signal,
          }),
          mapProductionItemWork,
          workErrors,
        ),
      invalidatesTags: workChanged,
    }),
    voidProductionWork: build.mutation<ProductionItemWorkCard, { workId: number; reason: string }>({
      queryFn: ({ workId, reason }, { signal }) =>
        apiCall(
          apiClient.POST('/api/production/work/{workId}/void', {
            params: { path: { workId: workId } },
            body: { reason } satisfies Schemas['VoidProductionWorkInput'],
            signal,
          }),
          mapProductionItemWork,
          workErrors,
        ),
      invalidatesTags: workChanged,
    }),
    importProductionWork: build.mutation<
      ProductionImportResult,
      { file: ProductionWorkImportFile; dryRun: boolean }
    >({
      queryFn: ({ file, dryRun }, { signal }) =>
        apiCall(
          apiClient.POST('/api/production/work/import', {
            params: { query: { dryRun } },
            // The uploaded file passes through as it is; the backend validates every row.
            body: file as ImportBody,
            signal,
          }),
          mapWorkImportResult,
          workErrors,
        ),
      invalidatesTags: (result, error) =>
        error || !result || result.dryRun
          ? []
          : [{ type: 'ProductionWork' }, { type: 'SewingForecast' }, { type: 'Payroll' }],
    }),
    getSewingForecast: build.query<SewingForecast, void>({
      queryFn: (_arg, { signal }) =>
        apiCall(
          apiClient.GET('/api/production/forecast', { signal }),
          mapSewingForecast,
          forecastErrors,
        ),
      providesTags: [{ type: 'SewingForecast', id: 'QUEUE' }],
    }),
    saveSewingForecastQueue: build.mutation<void, { version: number; orderIds: number[] }>({
      queryFn: (body, { signal }) =>
        apiCall(
          apiClient.PUT('/api/production/forecast/queue', {
            body: body satisfies Schemas['SaveForecastQueueInput'],
            signal,
          }),
          undefined,
          forecastErrors,
        ),
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
