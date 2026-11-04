import { productionBaseApi } from './production-base-api';
import { fabricStockErrors, toProductionApiError } from '../errors/production-api-error';
import {
  mapFabricConsumption,
  mapFabricStockChoices,
  mapFabricStockImportResult,
  mapFabricStockLine,
  mapFabricStockList,
  mapProductionItemFabric,
} from '../mappers/fabric-stock.mapper';

import type {
  CorrectFabricStockBody,
  CreateFabricIssueBody,
  CreateFabricMovementBody,
  FabricConsumption,
  FabricStockChoices,
  FabricStockImportFile,
  FabricStockLine,
  FabricStockList,
  ProductionImportResult,
  ProductionItemFabric,
} from '@admin/production/model';
import type { components } from '@admin/shared/contracts';

type Schemas = components['schemas'];

/** The model bodies must stay assignable to the backend contract. */
const movementInput = (body: CreateFabricMovementBody): Schemas['CreateFabricMovementInput'] =>
  body;
const correctionInput = (body: CorrectFabricStockBody): Schemas['CorrectFabricStockInput'] => body;
const issueInput = (body: CreateFabricIssueBody): Schemas['CreateFabricIssueInput'] => body;

const errors = (response: unknown) => toProductionApiError(response, fabricStockErrors);
const stockList = { type: 'FabricStock' as const, id: 'LIST' };

/** A stock change moves balances, reservations and the tabs of the items that hold them. */
const stockChanged = (_result: unknown, error: unknown) =>
  error ? [] : [{ type: 'FabricStock' as const }, { type: 'ItemFabric' as const }];

/** An issue also writes a line of the order's «Історія змін». */
const issueChanged = (_result: unknown, error: unknown, { orderId }: { orderId: number }) =>
  error
    ? []
    : [
        { type: 'FabricStock' as const },
        { type: 'ItemFabric' as const },
        { type: 'ProductionOrder' as const, id: orderId },
      ];

export const fabricStockApi = productionBaseApi.injectEndpoints({
  endpoints: (build) => ({
    getFabricStock: build.query<FabricStockList, void>({
      query: () => '/api/production/fabric-stock',
      transformResponse: mapFabricStockList,
      transformErrorResponse: errors,
      providesTags: [stockList],
    }),
    getFabricStockChoices: build.query<FabricStockChoices, void>({
      query: () => '/api/production/fabric-stock/choices',
      transformResponse: mapFabricStockChoices,
      transformErrorResponse: errors,
    }),
    getFabricStockLine: build.query<FabricStockLine, number>({
      query: (id) => `/api/production/fabric-stock/${id}`,
      transformResponse: mapFabricStockLine,
      transformErrorResponse: errors,
      providesTags: (_result, _error, id) => [{ type: 'FabricStock', id }],
    }),
    createFabricMovement: build.mutation<FabricStockLine, CreateFabricMovementBody>({
      query: (body) => ({
        url: '/api/production/fabric-stock/movements',
        method: 'POST',
        body: movementInput(body),
      }),
      transformResponse: mapFabricStockLine,
      transformErrorResponse: errors,
      invalidatesTags: stockChanged,
    }),
    correctFabricStock: build.mutation<
      FabricStockLine,
      { id: number; body: CorrectFabricStockBody }
    >({
      query: ({ id, body }) => ({
        url: `/api/production/fabric-stock/${id}/correction`,
        method: 'POST',
        body: correctionInput(body),
      }),
      transformResponse: mapFabricStockLine,
      transformErrorResponse: errors,
      invalidatesTags: stockChanged,
    }),
    reverseFabricMovement: build.mutation<
      FabricStockLine,
      { id: number; movementId: number; version: number; note: string }
    >({
      query: ({ id, movementId, version, note }) => ({
        url: `/api/production/fabric-stock/${id}/movements/${movementId}/reverse`,
        method: 'POST',
        body: { version, note } satisfies Schemas['ReverseFabricMovementInput'],
      }),
      transformResponse: mapFabricStockLine,
      transformErrorResponse: errors,
      invalidatesTags: stockChanged,
    }),
    getFabricConsumption: build.query<FabricConsumption, { from: string; to: string }>({
      query: (params) => ({ url: '/api/production/fabric-stock/consumption', params }),
      transformResponse: mapFabricConsumption,
      transformErrorResponse: errors,
      providesTags: [{ type: 'FabricStock', id: 'CONSUMPTION' }],
    }),
    importFabricStock: build.mutation<
      ProductionImportResult,
      { file: FabricStockImportFile; dryRun: boolean }
    >({
      query: ({ file, dryRun }) => ({
        url: '/api/production/fabric-stock/import',
        method: 'POST',
        params: { dryRun },
        body: file,
      }),
      transformResponse: mapFabricStockImportResult,
      transformErrorResponse: errors,
      invalidatesTags: (result, error) =>
        error || !result || result.dryRun ? [] : [{ type: 'FabricStock' }, { type: 'ItemFabric' }],
    }),
    getProductionItemFabric: build.query<ProductionItemFabric, { orderId: number; itemId: number }>(
      {
        query: ({ orderId, itemId }) => `/api/production/orders/${orderId}/items/${itemId}/fabric`,
        transformResponse: mapProductionItemFabric,
        transformErrorResponse: errors,
        providesTags: (_result, _error, { itemId }) => [{ type: 'ItemFabric', id: itemId }],
      },
    ),
    createFabricIssue: build.mutation<
      ProductionItemFabric,
      { orderId: number; itemId: number; body: CreateFabricIssueBody }
    >({
      query: ({ orderId, itemId, body }) => ({
        url: `/api/production/orders/${orderId}/items/${itemId}/fabric-issues`,
        method: 'POST',
        body: issueInput(body),
      }),
      transformResponse: mapProductionItemFabric,
      transformErrorResponse: errors,
      invalidatesTags: issueChanged,
    }),
    reverseFabricIssue: build.mutation<
      ProductionItemFabric,
      { orderId: number; issueId: number; orderVersion: number; reason: string }
    >({
      query: ({ orderId, issueId, orderVersion, reason }) => ({
        url: `/api/production/orders/${orderId}/fabric-issues/${issueId}/reverse`,
        method: 'POST',
        body: { orderVersion, reason } satisfies Schemas['ReverseFabricIssueInput'],
      }),
      transformResponse: mapProductionItemFabric,
      transformErrorResponse: errors,
      invalidatesTags: issueChanged,
    }),
  }),
});

export const {
  useCorrectFabricStockMutation,
  useCreateFabricIssueMutation,
  useCreateFabricMovementMutation,
  useGetFabricConsumptionQuery,
  useGetFabricStockChoicesQuery,
  useGetFabricStockLineQuery,
  useGetFabricStockQuery,
  useGetProductionItemFabricQuery,
  useImportFabricStockMutation,
  useReverseFabricIssueMutation,
  useReverseFabricMovementMutation,
} = fabricStockApi;
