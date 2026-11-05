import { purchaseInvoicesTag, purchaseSyncStateTag } from '../../cache/purchase-invoice-tags';
import { purchaseApiError } from '../../errors/purchase-api-error';
import { mapPurchaseInvoicePage } from '../../mappers/invoices/purchase-invoice.mapper';
import {
  mapPurchaseSyncResult,
  mapPurchaseSyncState,
} from '../../mappers/invoices/purchase-sync.mapper';

import type { PurchasingEndpointBuilder } from '../purchasing-endpoint-builder';
import type {
  PurchaseInvoicePage,
  PurchaseInvoiceQuery,
  PurchaseSyncResult,
  PurchaseSyncState,
} from '@admin/purchasing/model';

export function purchaseInvoiceEndpoints(build: PurchasingEndpointBuilder) {
  return {
    getPurchaseInvoices: build.query<PurchaseInvoicePage, PurchaseInvoiceQuery>({
      query: ({ page, pageSize, search, filter }) => ({
        url: '/api/purchasing/invoices',
        params: {
          page,
          pageSize,
          search: search || undefined,
          filter: filter === 'All' ? undefined : filter,
        },
      }),
      transformResponse: mapPurchaseInvoicePage,
      transformErrorResponse: purchaseApiError,
      providesTags: [purchaseInvoicesTag],
    }),
    getPurchaseSyncState: build.query<PurchaseSyncState, void>({
      query: () => ({ url: '/api/purchasing/invoices/sync-state' }),
      transformResponse: mapPurchaseSyncState,
      transformErrorResponse: purchaseApiError,
      providesTags: [purchaseSyncStateTag],
    }),
    syncPurchaseInvoices: build.mutation<PurchaseSyncResult, void>({
      query: () => ({ url: '/api/purchasing/invoices/sync', method: 'POST' }),
      transformResponse: mapPurchaseSyncResult,
      transformErrorResponse: purchaseApiError,
      // A failed sync records its reason, so the state is refreshed either way.
      invalidatesTags: (_, error) =>
        error ? [purchaseSyncStateTag] : [purchaseInvoicesTag, purchaseSyncStateTag],
    }),
  };
}
