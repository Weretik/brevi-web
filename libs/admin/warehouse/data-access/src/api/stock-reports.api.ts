import { warehouseBaseApi } from './warehouse-base-api';
import { warehouseApiError } from '../errors/warehouse-api-error';
import {
  mapBooking,
  mapHardware,
  mapPlanFact,
  mapValuation,
} from '../mappers/stock-reports.mapper';

import type {
  BookingReport,
  HardwareReport,
  PlanFactFilter,
  PlanFactReport,
  ValuationReport,
} from '@admin/warehouse/model';

/** Stock and issue changes change every report; the server calculates each one anew. */
const reportTags = [{ type: 'FabricStock' as const }, { type: 'ItemFabric' as const }];

const filterParams = (filter: PlanFactFilter) =>
  Object.fromEntries(
    Object.entries(filter)
      .map(([key, value]) => [key, value.trim()] as const)
      .filter(([, value]) => value.length > 0),
  );

/** The four reports of «Склад тканин» (WH-005), each behind its own page of «Права доступу». */
export const stockReportsApi = warehouseBaseApi.injectEndpoints({
  endpoints: (build) => ({
    getFabricPlanFact: build.query<PlanFactReport, PlanFactFilter>({
      query: (filter) => ({
        url: '/api/warehouse/reports/plan-fact',
        params: filterParams(filter),
      }),
      transformResponse: mapPlanFact,
      transformErrorResponse: warehouseApiError,
      providesTags: reportTags,
    }),
    getFabricBooking: build.query<BookingReport, void>({
      query: () => '/api/warehouse/reports/booking',
      transformResponse: mapBooking,
      transformErrorResponse: warehouseApiError,
      providesTags: reportTags,
    }),
    getFabricValuation: build.query<ValuationReport, void>({
      query: () => '/api/warehouse/reports/valuation',
      transformResponse: mapValuation,
      transformErrorResponse: warehouseApiError,
      providesTags: reportTags,
    }),
    getHardwareOrder: build.query<HardwareReport, void>({
      query: () => '/api/warehouse/reports/hardware',
      transformResponse: mapHardware,
      transformErrorResponse: warehouseApiError,
      providesTags: [{ type: 'ProductionOrder' as const }],
    }),
  }),
});

export const {
  useGetFabricBookingQuery,
  useGetFabricPlanFactQuery,
  useGetFabricValuationQuery,
  useGetHardwareOrderQuery,
} = stockReportsApi;
