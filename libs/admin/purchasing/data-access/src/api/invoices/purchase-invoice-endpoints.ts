import {
  purchaseInvoicesTag,
  purchaseSuppliersTag,
  purchaseSyncStateTag,
} from '../../cache/purchase-invoice-tags';
import { purchaseApiError } from '../../errors/purchase-api-error';
import {
  mapPurchaseDocumentSave,
  mapPurchaseRecognition,
  mapPurchaseRecognitionBatch,
} from '../../mappers/invoices/purchase-document.mapper';
import { mapPurchaseInvoicePage } from '../../mappers/invoices/purchase-invoice.mapper';
import {
  mapPurchaseInvoiceReview,
  mapPurchaseSupplierOptions,
} from '../../mappers/invoices/purchase-review.mapper';
import {
  mapPurchaseSyncResult,
  mapPurchaseSyncState,
} from '../../mappers/invoices/purchase-sync.mapper';

import type { PurchasingEndpointBuilder } from '../purchasing-endpoint-builder';
import type {
  PurchaseDocumentSave,
  PurchaseDocumentUpload,
  PurchaseInvoicePage,
  PurchaseInvoiceQuery,
  PurchaseInvoiceReview,
  PurchaseRecognition,
  PurchaseRecognitionBatch,
  PurchaseReviewInput,
  PurchaseSupplierOption,
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
    getPurchaseSuppliers: build.query<PurchaseSupplierOption[], void>({
      query: () => ({ url: '/api/purchasing/invoices/suppliers' }),
      transformResponse: mapPurchaseSupplierOptions,
      transformErrorResponse: purchaseApiError,
      providesTags: [purchaseSuppliersTag],
    }),
    reviewPurchaseInvoice: build.mutation<PurchaseInvoiceReview, PurchaseReviewInput>({
      query: ({ messageId, ...body }) => ({
        url: `/api/purchasing/invoices/${encodeURIComponent(messageId)}/review`,
        method: 'PUT',
        body,
      }),
      transformResponse: mapPurchaseInvoiceReview,
      transformErrorResponse: purchaseApiError,
      // A stale version means someone else saved: reload the list either way.
      invalidatesTags: [purchaseInvoicesTag],
    }),
    recognizePurchaseFile: build.mutation<PurchaseRecognition, string>({
      query: (fileId) => ({
        url: `/api/purchasing/invoices/files/${encodeURIComponent(fileId)}/recognize`,
        method: 'POST',
      }),
      transformResponse: mapPurchaseRecognition,
      transformErrorResponse: purchaseApiError,
      invalidatesTags: (_, error) => (error ? [] : [purchaseInvoicesTag]),
    }),
    /** One batch; the feature repeats it. The list reloads after every batch that read a file. */
    recognizeNewPurchaseFiles: build.mutation<PurchaseRecognitionBatch, void>({
      query: () => ({ url: '/api/purchasing/invoices/recognize-new', method: 'POST' }),
      transformResponse: mapPurchaseRecognitionBatch,
      transformErrorResponse: purchaseApiError,
      invalidatesTags: (result) =>
        result && result.recognized + result.needsReview + result.failed + result.skipped > 0
          ? [purchaseInvoicesTag]
          : [],
    }),
    savePurchaseDocument: build.mutation<PurchaseDocumentSave, PurchaseDocumentUpload>({
      query: ({ fileId, document, replace }) => ({
        url: `/api/purchasing/invoices/files/${encodeURIComponent(fileId)}/document`,
        method: 'PUT',
        body: { document, replace },
      }),
      transformResponse: mapPurchaseDocumentSave,
      transformErrorResponse: purchaseApiError,
      invalidatesTags: (_, error) => (error ? [] : [purchaseInvoicesTag]),
    }),
    /** The JSON as the server gives it, to be saved as a file and edited by hand. */
    getPurchaseDocumentTemplate: build.query<unknown, string>({
      query: (fileId) => ({
        url: `/api/purchasing/invoices/files/${encodeURIComponent(fileId)}/document-template`,
      }),
      transformErrorResponse: purchaseApiError,
      keepUnusedDataFor: 0,
    }),
  };
}
